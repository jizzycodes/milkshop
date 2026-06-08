import fs from "fs";
import os from "os";
import path from "path";
import sharp from "sharp";

const ROOT = path.resolve("public");
const BACKUP_ROOT = path.resolve(".image-backups/public");
const MIN_BYTES = 50_000;
const WEBP_QUALITY = 82;

const IMAGE_EXT = new Set([".webp", ".png", ".jpg", ".jpeg"]);

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, files);
    else if (IMAGE_EXT.has(path.extname(entry.name).toLowerCase())) files.push(full);
  }
  return files;
}

async function compressFile(filePath) {
  const rel = path.relative(ROOT, filePath);
  const { size: before } = fs.statSync(filePath);
  if (before < MIN_BYTES) {
    return { rel, skipped: true, reason: "below threshold", before };
  }

  const backupPath = path.join(BACKUP_ROOT, rel);
  fs.mkdirSync(path.dirname(backupPath), { recursive: true });
  if (!fs.existsSync(backupPath)) {
    fs.copyFileSync(filePath, backupPath);
  }

  const ext = path.extname(filePath).toLowerCase();
  const tmpPath = path.join(
    os.tmpdir(),
    `milkshop-${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`,
  );

  try {
    const input = sharp(filePath, { failOn: "none" });
    if (ext === ".webp") {
      await input.webp({ quality: WEBP_QUALITY, effort: 6 }).toFile(tmpPath);
    } else if (ext === ".png") {
      await input.png({ quality: WEBP_QUALITY, compressionLevel: 9, palette: true }).toFile(tmpPath);
    } else {
      await input.jpeg({ quality: WEBP_QUALITY, mozjpeg: true }).toFile(tmpPath);
    }

    const after = fs.statSync(tmpPath).size;
    if (after < before * 0.97) {
      const buf = fs.readFileSync(tmpPath);
      fs.writeFileSync(filePath, buf);
      fs.unlinkSync(tmpPath);
      return {
        rel,
        before,
        after,
        saved: before - after,
        pct: Math.round((1 - after / before) * 100),
      };
    }

    fs.unlinkSync(tmpPath);
    return { rel, skipped: true, reason: "no meaningful savings", before, after };
  } catch (err) {
    if (fs.existsSync(tmpPath)) fs.unlinkSync(tmpPath);
    return { rel, error: err.message, before };
  }
}

const files = walk(ROOT);
const results = [];

for (const file of files) {
  results.push(await compressFile(file));
}

const compressed = results.filter((r) => r.after && !r.skipped && !r.error);
const skipped = results.filter((r) => r.skipped);
const errors = results.filter((r) => r.error);

const totalBefore = compressed.reduce((n, r) => n + r.before, 0);
const totalAfter = compressed.reduce((n, r) => n + r.after, 0);

console.log(`Processed: ${files.length} images`);
console.log(`Compressed: ${compressed.length} (saved ${((totalBefore - totalAfter) / 1024).toFixed(1)} KB)`);
console.log(`Skipped: ${skipped.length}`);
console.log(`Errors: ${errors.length}`);
console.log(`Backups: ${BACKUP_ROOT}`);

compressed
  .sort((a, b) => b.saved - a.saved)
  .slice(0, 15)
  .forEach((r) => {
    console.log(`  -${r.pct}%  ${relKb(r.before)} -> ${relKb(r.after)}  ${r.rel}`);
  });

if (errors.length) {
  console.log("\nErrors:");
  errors.forEach((r) => console.log(`  ${r.rel}: ${r.error}`));
}

function relKb(n) {
  return `${(n / 1024).toFixed(1)}KB`;
}
