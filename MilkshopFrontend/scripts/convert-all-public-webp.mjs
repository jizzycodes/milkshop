import sharp from "sharp";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const publicDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "public");
const IMAGE_RE = /\.(png|jpe?g)$/i;

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...walk(full));
    else if (IMAGE_RE.test(entry.name)) files.push(full);
  }
  return files;
}

const inputs = walk(publicDir);
let converted = 0;
let skipped = 0;

for (const input of inputs) {
  const output = input.replace(IMAGE_RE, ".webp");
  try {
    const meta = await sharp(input).metadata();
    await sharp(input)
      .webp({ quality: 85, alphaQuality: meta.hasAlpha ? 92 : undefined, effort: 4 })
      .toFile(output);
    fs.unlinkSync(input);
    converted += 1;
    const rel = path.relative(publicDir, input);
    console.log(`ok: ${rel}`);
  } catch (err) {
    skipped += 1;
    console.warn(`fail: ${path.relative(publicDir, input)} — ${err.message}`);
  }
}

console.log(`\nConverted & removed ${converted} file(s). Skipped: ${skipped}.`);
