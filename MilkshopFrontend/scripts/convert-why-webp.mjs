import sharp from "sharp";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const publicDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "public");

const FILES = [
  "franchise/why/no-royalty-fee.png",
  "franchise/why/why-02.png",
  "franchise/why/why-03.png",
  "franchise/why/why-04.png",
  "franchise/why/why-05.png",
  "franchise/why/why-06.png",
];

for (const rel of FILES) {
  const input = path.join(publicDir, rel);
  const output = input.replace(/\.png$/i, ".webp");
  const meta = await sharp(input).metadata();
  await sharp(input)
    .webp({ quality: 85, alphaQuality: meta.hasAlpha ? 92 : undefined })
    .toFile(output);
  const before = fs.statSync(input).size;
  const after = fs.statSync(output).size;
  console.log(`${rel} (${Math.round((1 - after / before) * 100)}% smaller)`);
}
