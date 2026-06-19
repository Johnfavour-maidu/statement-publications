const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const sourcePath = path.join(__dirname, 'public', 'statement-favicon-source.png');
const outputDir = path.join(__dirname, 'public');

async function generateFavicons() {
  console.log('Processing favicon source image...');

  const metadata = await sharp(sourcePath).metadata();
  console.log(`Source image: ${metadata.width}x${metadata.height}`);

  // Get raw pixel data to find the circular icon bounds
  const { data, info } = await sharp(sourcePath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const width = info.width;
  const height = info.height;
  const channels = info.channels;

  // Find non-black bounds (threshold: any pixel with R+G+B > 30)
  let minX = width, maxX = 0, minY = height, maxY = 0;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * channels;
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];
      // Check if pixel is not black (threshold)
      if (r + g + b > 30) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  console.log(`Content bounds: (${minX}, ${minY}) to (${maxX}, ${maxY})`);

  // Add small padding
  const padding = 2;
  minX = Math.max(0, minX - padding);
  minY = Math.max(0, minY - padding);
  maxX = Math.min(width - 1, maxX + padding);
  maxY = Math.min(height - 1, maxY + padding);

  const cropWidth = maxX - minX + 1;
  const cropHeight = maxY - minY + 1;

  console.log(`Cropped area: ${cropWidth}x${cropHeight}`);

  // Crop to the content area
  const croppedBuffer = await sharp(sourcePath)
    .extract({ left: minX, top: minY, width: cropWidth, height: cropHeight })
    .toBuffer();

  // Make square with transparent background
  const squareSize = Math.max(cropWidth, cropHeight);
  const squareBuffer = await sharp(croppedBuffer)
    .resize(squareSize, squareSize, {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    })
    .toBuffer();

  console.log(`Square icon: ${squareSize}x${squareSize}`);

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

  // Generate SVG version (recreate from the original design)
  const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <circle cx="256" cy="256" r="256" fill="#EBC9A8"/>
  <text x="256" y="340" font-family="Georgia, serif" font-size="280" font-weight="bold" fill="#1D1D1D" text-anchor="middle">S</text>
</svg>`;

  fs.writeFileSync(path.join(outputDir, 'favicon.svg'), svgContent);
  console.log('Generated: favicon.svg');

  console.log('\nAll favicon files generated successfully!');
}

generateFavicons().catch(console.error);
