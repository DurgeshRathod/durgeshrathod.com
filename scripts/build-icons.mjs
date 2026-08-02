/**
 * Generates every raster icon from public/favicon.svg — the single source of truth
 * for the DR mark. Run with `npm run icons` after editing favicon.svg, then commit
 * the outputs. They are committed rather than built so the build stays a pure
 * `astro build` on any host.
 *
 *   public/favicon.ico        48 + 96 (what Google Search reads)
 *   public/apple-touch-icon.png   180, flattened on brand blue for iOS
 *
 * Why favicon.ico exists at all, given the SVG works in browsers: /favicon.ico at the
 * document root is the fallback path that favicon consumers probe when they want a
 * raster — Google's Googlebot-Image among them. Without the file, that probe returned
 * the 404 page (46kb of text/html), which is why Search showed the generic globe.
 * Google also recommends an icon larger than 48x48, which a vector cannot advertise.
 */
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

const PUBLIC = path.join(process.cwd(), 'public');
const SRC = path.join(PUBLIC, 'favicon.svg');
/** Brand blue — matches the rect fill in favicon.svg and --accent-solid in the theme. */
const BRAND = '#1d4ed8';

if (!fs.existsSync(SRC)) {
  console.error(`missing ${SRC}`);
  process.exit(1);
}
const svg = fs.readFileSync(SRC);

/** Rasterise the SVG at `size`, preserving the rounded-corner transparency. */
const png = (size) =>
  sharp(svg, { density: 384 }).resize(size, size, { fit: 'contain' }).png({ compressionLevel: 9 }).toBuffer();

/**
 * Minimal ICO container. Each entry holds a complete PNG payload rather than a BMP —
 * the Vista-era form of the format, read correctly by every browser and by Google.
 * Largest image first, so consumers that just take the first entry get the best one.
 */
function ico(images) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // 1 = icon
  header.writeUInt16LE(images.length, 4);

  const dir = Buffer.alloc(16 * images.length);
  let offset = header.length + dir.length;

  images.forEach(({ size, data }, i) => {
    const at = 16 * i;
    // 0 encodes 256 in this field; nothing here is that large, but keep it correct.
    dir.writeUInt8(size >= 256 ? 0 : size, at);
    dir.writeUInt8(size >= 256 ? 0 : size, at + 1);
    dir.writeUInt8(0, at + 2); // palette entries — 0 for truecolour
    dir.writeUInt8(0, at + 3); // reserved
    dir.writeUInt16LE(1, at + 4); // colour planes
    dir.writeUInt16LE(32, at + 6); // bits per pixel
    dir.writeUInt32LE(data.length, at + 8);
    dir.writeUInt32LE(offset, at + 12);
    offset += data.length;
  });

  return Buffer.concat([header, dir, ...images.map((i) => i.data)]);
}

const sizes = [96, 48];
const images = [];
for (const size of sizes) images.push({ size, data: await png(size) });

fs.writeFileSync(path.join(PUBLIC, 'favicon.ico'), ico(images));

// iOS masks the icon itself, so this one is flattened edge-to-edge on brand blue —
// transparent corners would render as black behind Apple's mask.
await sharp(svg, { density: 384 })
  .resize(180, 180, { fit: 'contain' })
  .flatten({ background: BRAND })
  .png({ compressionLevel: 9 })
  .toFile(path.join(PUBLIC, 'apple-touch-icon.png'));

for (const f of ['favicon.ico', 'apple-touch-icon.png']) {
  console.log(`${f.padEnd(22)} ${fs.statSync(path.join(PUBLIC, f)).size} bytes`);
}
