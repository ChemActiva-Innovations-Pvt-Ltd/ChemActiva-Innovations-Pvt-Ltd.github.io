import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const TARGET_DIR = './public/assets';
const QUALITY = 82;

// Per-directory width caps, matched to actual display sizes (2x retina headroom).
// NOTE: .rotate() MUST run before any resize — it applies the EXIF orientation
// flag to the pixels. Skipping it bakes sideways portraits into the output
// (this is what rotated dr-goutam-kulsi / prof-sayam-sen-gupta in the past).
const WIDTH_CAPS = [
    [/images[\\/]team/, 768], // team cards render ~250-400px wide
    [/images[\\/]products/, 1200], // product gallery main images
    [/images[\\/]covers/, 1200], // blog/research card covers
    [/images[\\/]gallery/, 1200], // gallery lightbox
    [/[\\/]images$/, 768], // root hero panels render <=360px wide (dirname ends with 'images')
];
const DEFAULT_MAX_WIDTH = 1600;

// Never touch PWA/manifest icons (format + presence are contractual).
const SKIP_BASENAMES = new Set(['logo.png', 'logo-small_size.png']);

function capFor(file) {
    for (const [re, w] of WIDTH_CAPS) {
        if (re.test(path.dirname(file))) return w;
    }
    return DEFAULT_MAX_WIDTH;
}

async function getImages(dir) {
    let images = [];
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            images = images.concat(await getImages(fullPath));
        } else if (entry.isFile() && /\.(webp|png|jpg|jpeg)$/i.test(entry.name)) {
            if (!SKIP_BASENAMES.has(entry.name)) images.push(fullPath);
        }
    }
    return images;
}

async function optimize() {
    console.log('Scanning for images...');
    const images = await getImages(TARGET_DIR);
    console.log(`Found ${images.length} images.`);

    let totalSaved = 0;

    for (const file of images) {
        try {
            const stats = await fs.stat(file);
            const originalSize = stats.size;
            if (originalSize === 0) {
                console.log(`Skipped ${file} (empty file)`);
                continue;
            }

            const buffer = await fs.readFile(file);
            const pipeline = sharp(buffer, { failOn: 'none' }).rotate(); // EXIF auto-orient first
            const metadata = await pipeline.metadata();
            const cap = capFor(file);

            let out = pipeline;
            if (metadata.width > cap) {
                out = out.resize({ width: cap, withoutEnlargement: true });
            }

            if (metadata.format === 'jpeg' || metadata.format === 'jpg') {
                out = out.jpeg({ quality: QUALITY, mozjpeg: true });
            } else if (metadata.format === 'png') {
                out = out.png({ quality: QUALITY, compressionLevel: 9 });
            } else {
                out = out.webp({ quality: QUALITY, effort: 6 });
            }

            const outputBuffer = await out.toBuffer();

            if (outputBuffer.length < originalSize) {
                await fs.writeFile(file, outputBuffer);
                const saved = originalSize - outputBuffer.length;
                totalSaved += saved;
                console.log(
                    `Optimized ${path.basename(file)}: ${(originalSize / 1024).toFixed(0)}KB -> ${(outputBuffer.length / 1024).toFixed(0)}KB`
                );
            } else {
                console.log(`Skipped ${path.basename(file)} (no gain)`);
            }
        } catch (e) {
            console.error(`Error processing ${file}:`, e.message);
        }
    }

    console.log(`\nTotal Reduced: ${(totalSaved / 1024 / 1024).toFixed(2)} MB`);
}

optimize();
