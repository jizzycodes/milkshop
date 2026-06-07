import sharp from "sharp";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const publicDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "public", "happy-customers");

const FILES = ["mooba.png", ...Array.from({ length: 10 }, (_, i) => `h${i + 1}.jpg`)];

for (const name of FILES) {
  const input = path.join(publicDir, name);
  const output = input.replace(/\.(png|jpe?g)$/i, ".webp");
  const meta = await sharp(input).metadata();
  await sharp(input)
    .webp({ quality: 85, alphaQuality: meta.hasAlpha ? 92 : undefined })
    .toFile(output);
  const before = fs.statSync(input).size;
  const after = fs.statSync(output).size;
  console.log(`${name} (${Math.round((1 - after / before) * 100)}% smaller)`);
}
