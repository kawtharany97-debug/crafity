const sharp = require("sharp");
const path = require("path");

const files = [
  "cat-macrame.jpg",
  "cat-resin.jpg",
  "cat-candles.jpg",
  "cat-soap.jpg",
  "cat-crochet.jpg",
  "cat-gypsum.jpg",
  "cat-beads.jpg",
  "cat-giftbox.jpg",
  "cat-supplies.jpg",
];

async function convertImages() {
  for (const file of files) {
    const input = path.join(__dirname, "public", file);
    const output = path.join(
      __dirname,
      "public",
      file.replace(".jpg", ".webp")
    );

    await sharp(input)
      .resize(400, 400, {
        fit: "cover",
      })
      .webp({
        quality: 75,
      })
      .toFile(output);

    console.log(`Converted ${file} → ${file.replace(".jpg", ".webp")}`);
  }
}

convertImages().catch((error) => {
  console.error("Conversion failed:", error);
});