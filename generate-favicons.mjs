import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const sourcePath = path.join(__dirname, 'apps', 'publications', 'public', 'statement-favicon-source.png');
const outputDir = path.join(__dirname, 'apps', 'publications', 'public');

async function generateFavicons() {
  console.log('Processing favicon source image...');

  // Get image metadata
  const metadata = await sharp(sourcePath).metadata();
  console.log(`Source image: ${metadata.width}x${metadata.height}`);

  // Step 1: Auto-crop to remove black background and get tight crop around the circle
  // Use trim to remove the black background
  const trimmed = await sharp(sourcePath)
    .trim(10) // Trim pixels with similar color (black background)
    .toBuffer({ resolveWithObject: true });

  console.log(`Trimmed to: ${trimmed.info.width}x${trimmed.info.height}`);

  // Step 2: Make it square by padding if needed
  const size = Math.max(trimmed.info.width, trimmed.info.height);
  const squareBuffer = await sharp(trimmed.data)
    .resize(size, size, {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 } // Transparent background
    })
    .toBuffer();

  // Step 3: Generate all required sizes
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

  // Step 4: Generate favicon.ico (multi-size)
  const icoSizes = [16, 32, 48];
  const icoBuffers = await Promise.all(
    icoSizes.map(s =>
      sharp(squareBuffer)
        .resize(s, s, {
          fit: 'contain',
          background: { r: 0, g: 0, b: 0, alpha: 0 }
        })
        .png()
        .toBuffer()
    )
  );

  // Write individual ICO-sized PNGs, then combine
  // sharp doesn't have native ICO support, so we'll create a simple ICO
  // by writing the 32x32 as favicon.ico (browsers auto-detect)
  await sharp(squareBuffer)
    .resize(32, 32, {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    })
    .png()
    .toFile(path.join(outputDir, 'favicon.ico'));

  console.log('Generated: favicon.ico');

  // Step 5: Generate SVG version
  const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
    <circle cx="256" cy="256" r="256" fill="#EBC9A8"/>
    <text x="256" y="340" font-family="Georgia, serif" font-size="280" font-weight="bold" fill="#1D1D1D" text-anchor="middle">S</text>
  </svg>`;

  const { writeFileSync } = await import('fs');
  writeFileSync(path.join(outputDir, 'favicon.svg'), svgContent);
  console.log('Generated: favicon.svg');

  console.log('\nAll favicon files generated successfully!');
}

generateFavicons().catch(console.error);
