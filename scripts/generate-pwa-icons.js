// =====================================================
// Generate PWA icons from SVG (using sharp if available, else canvas)
// Run: node scripts/generate-pwa-icons.js
// =====================================================
const fs = require('fs');
const path = require('path');

const ICONS_DIR = path.join(__dirname, '..', 'public', 'icons');
if (!fs.existsSync(ICONS_DIR)) fs.mkdirSync(ICONS_DIR, { recursive: true });

// Logo SVG: pill shape with medical cross, ink-900 + accent-700 gradient
const LOGO_SVG = (size, maskable = false) => {
  const pad = maskable ? Math.round(size * 0.1) : 0; // 10% safe zone for maskable
  const innerSize = size - pad * 2;
  const r = Math.round(innerSize * 0.22);
  const crossSize = Math.round(innerSize * 0.5);
  const crossThick = Math.round(crossSize * 0.28);
  const cx = size / 2;
  const cy = size / 2;
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0f1d3d"/>
      <stop offset="100%" stop-color="#0d7a72"/>
    </linearGradient>
  </defs>
  <rect x="${pad}" y="${pad}" width="${innerSize}" height="${innerSize}" rx="${r}" fill="url(#g)"/>
  <rect x="${cx - crossThick / 2}" y="${cy - crossSize / 2}" width="${crossThick}" height="${crossSize}" rx="${Math.round(crossThick * 0.18)}" fill="#ffffff"/>
  <rect x="${cx - crossSize / 2}" y="${cy - crossThick / 2}" width="${crossSize}" height="${crossThick}" rx="${Math.round(crossThick * 0.18)}" fill="#ffffff"/>
</svg>`;
};

// Simple SVG → PNG conversion using sharp (if installed) or save as SVG with PNG link
async function generateIcon(size, maskable = false) {
  const svg = LOGO_SVG(size, maskable);
  const filename = maskable ? `icon-maskable-512x512.png` : `icon-${size}x${size}.png`;
  const filepath = path.join(ICONS_DIR, filename);

  try {
    // Try sharp first
    const sharp = require('sharp');
    await sharp(Buffer.from(svg))
      .png()
      .toFile(filepath);
    console.log(`✓ Generated ${filename} (${size}x${size}${maskable ? ' maskable' : ''}) via sharp`);
  } catch (e) {
    // Fallback: save as SVG with PNG reference (browsers handle this)
    const svgName = filename.replace('.png', '.svg');
    const svgPath = path.join(ICONS_DIR, svgName);
    fs.writeFileSync(svgPath, svg);
    console.log(`✓ Saved ${svgName} (SVG fallback — install sharp for PNG)`);
  }
}

async function main() {
  const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
  for (const size of sizes) {
    await generateIcon(size, false);
  }
  await generateIcon(512, true);
  
  // Also create favicon.ico (32x32)
  const faviconSvg = LOGO_SVG(32);
  try {
    const sharp = require('sharp');
    await sharp(Buffer.from(faviconSvg))
      .resize(32, 32)
      .png()
      .toFile(path.join(__dirname, '..', 'public', 'favicon.png'));
    console.log('✓ Generated favicon.png');
  } catch (e) {
    fs.writeFileSync(
      path.join(__dirname, '..', 'public', 'favicon.svg'),
      faviconSvg
    );
    console.log('✓ Saved favicon.svg (fallback)');
  }

  // Apple touch icon (180x180)
  const appleTouchSvg = LOGO_SVG(180);
  try {
    const sharp = require('sharp');
    await sharp(Buffer.from(appleTouchSvg))
      .png()
      .toFile(path.join(ICONS_DIR, 'apple-touch-icon.png'));
    console.log('✓ Generated apple-touch-icon.png');
  } catch (e) {
    fs.writeFileSync(
      path.join(ICONS_DIR, 'apple-touch-icon.svg'),
      appleTouchSvg
    );
    console.log('✓ Saved apple-touch-icon.svg (fallback)');
  }

  // Badge 72x72 (monochrome for notification)
  const badgeSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="72" height="72" viewBox="0 0 72 72">
  <rect x="20" y="20" width="32" height="32" rx="6" fill="#0d7a72"/>
  <rect x="32" y="26" width="8" height="20" rx="1.5" fill="#ffffff"/>
  <rect x="26" y="32" width="20" height="8" rx="1.5" fill="#ffffff"/>
</svg>`;
  try {
    const sharp = require('sharp');
    await sharp(Buffer.from(badgeSvg))
      .png()
      .toFile(path.join(ICONS_DIR, 'badge-72x72.png'));
    console.log('✓ Generated badge-72x72.png (notification badge)');
  } catch (e) {
    fs.writeFileSync(path.join(ICONS_DIR, 'badge-72x72.svg'), badgeSvg);
    console.log('✓ Saved badge-72x72.svg (fallback)');
  }

  console.log('\n✅ Done. Icons saved in public/icons/');
}

main().catch((e) => {
  console.error('Error:', e);
  process.exit(1);
});
