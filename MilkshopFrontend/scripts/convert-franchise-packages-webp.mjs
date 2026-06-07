import sharp from "sharp";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const publicDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "public", "franchise", "packages");

for (const name of ["2.png", "4.png", "8.png", "placeholder-store.png"]) {
  const input = path.join(publicDir, name);
  if (!fs.existsSync(input)) {
    console.warn(`skip (missing): ${name}`);
    continue;
  }
  const output = input.replace(/\.png$/i, ".webp");
  const meta = await sharp(input).metadata();
  await sharp(input)
    .webp({ quality: 85, alphaQuality: meta.hasAlpha ? 92 : undefined })
    .toFile(output);
  const before = fs.statSync(input).size;
  const after = fs.statSync(output).size;
  console.log(`${name} (${Math.round((1 - after / before) * 100)}% smaller)`);
}
