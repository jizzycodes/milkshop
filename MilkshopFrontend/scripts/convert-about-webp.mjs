import sharp from "sharp";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const publicDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "public");

const FILES = [
  "about/history/storefront.png",
  "about/history/grand-opening.png",
  "about/history/ingredients.png",
  "about/history/ingredientss.jpg",
  "about/raw-materials/brown-sugar-pearls.png",
  "about/raw-materials/natural-ingredients.png",
  "about/raw-materials/fresh-milk-boba.png",
  "about/raw-materials/premium-tea-leaves.png",
  "hero-bg-3.png",
  "LOGOLAND.png",
  "closer.jpg",
  "franchise/why/why-05.png",
];

for (const rel of FILES) {
  const input = path.join(publicDir, rel);
  if (!fs.existsSync(input)) {
    console.warn(`skip (missing): ${rel}`);
    continue;
  }
  const output = input.replace(/\.(png|jpe?g)$/i, ".webp");
  const meta = await sharp(input).metadata();
  await sharp(input)
    .webp({ quality: 85, alphaQuality: meta.hasAlpha ? 92 : undefined })
    .toFile(output);
  const before = fs.statSync(input).size;
  const after = fs.statSync(output).size;
  console.log(`${rel} (${Math.round((1 - after / before) * 100)}% smaller)`);
}
