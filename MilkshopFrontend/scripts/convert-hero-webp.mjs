import sharp from "sharp";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, "..", "public");

const HERO_IMAGES = [
  "hero/hero-cups.png",
  "taiwan-word.png",
  "milkshop-logo-removebg-preview.png",
  "about/taiwan-word.png",
  "about/history/storefront.png",
  "products/products-hero.png",
  "franchise/packages/8.png",
  "hero-bg-3.png",
  "closer.jpg",
];

async function convert(relPath) {
  const input = path.join(publicDir, relPath);
  if (!fs.existsSync(input)) {
    console.warn(`skip (missing): ${relPath}`);
    return;
  }
  const output = input.replace(/\.(png|jpe?g)$/i, ".webp");
  const meta = await sharp(input).metadata();
  await sharp(input)
    .webp({
      quality: 85,
      alphaQuality: meta.hasAlpha ? 92 : undefined,
      effort: 4,
    })
    .toFile(output);
  const before = fs.statSync(input).size;
  const after = fs.statSync(output).size;
  const pct = Math.round((1 - after / before) * 100);
  console.log(`${relPath} → ${path.basename(output)} (${pct}% smaller)`);
}

for (const file of HERO_IMAGES) {
  await convert(file);
}

console.log("Done.");
