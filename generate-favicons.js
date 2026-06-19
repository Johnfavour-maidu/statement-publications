const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const sourcePath = path.join(__dirname, 'apps', 'publications', 'public', 'statement-favicon-source.png');
const outputDir = path.join(__dirname, 'apps', 'publications', 'public');

async function generateFavicons() {
  console.log('Processing favicon source image...');

  const metadata = await sharp(sourcePath).metadata();
  console.log(`Source image: ${metadata.width}x${metadata.height}`);

  // Trim black background
  const trimmed = await sharp(sourcePath)
    .trim(10)
    .toBuffer({ resolveWithObject: true });

  console.log(`Trimmed to: ${trimmed.info.width}x${trimmed.info.height}`);

  // Make square with transparent background
  const size = Math.max(trimmed.info.width, trimmed.info.height);
  const squareBuffer = await sharp(trimmed.data)
    .resize(size, size, {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    })
    .toBuffer();

  // Generate all required PNG sizes
  const sizes = [16, 32, 48, 64, 96, 128, 180, 192, 256, 512];

  for (const s of sizes) {
    const filename = s === 180 ? 'apple-touch-icon.png' :
                     s === 192 ? 'android-chrome-192x192.png' :
                     s === 512 ? 'android-chrome-512x512.png' :
                     `favicon-${s}x${s}.png`;

    await sharp(squareBuffer)
      .resize(s, s, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .png()
      .toFile(path.join(outputDir, filename));

    console.log(`Generated: ${filename} (${s}x${s})`);
  }

  // Generate favicon.ico (32x32)
  await sharp(squareBuffer)
    .resize(32, 32, {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    })
    .png()
    .toFile(path.join(outputDir, 'favicon.ico'));

  console.log('Generated: favicon.ico');

  // Generate SVG version
  const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <circle cx="256" cy="256" r="256" fill="#EBC9A8"/>
  <text x="256" y="340" font-family="Georgia, serif" font-size="280" font-weight="bold" fill="#1D1D1D" text-anchor="middle">S</text>
</svg>`;

  fs.writeFileSync(path.join(outputDir, 'favicon.svg'), svgContent);
  console.log('Generated: favicon.svg');

  console.log('\nAll favicon files generated successfully!');
}

generateFavicons().catch(console.error);
