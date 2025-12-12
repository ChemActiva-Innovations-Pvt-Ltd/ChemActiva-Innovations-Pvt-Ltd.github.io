import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const TARGET_DIR = './public/assets';
const MAX_WIDTH = 1920;
const QUALITY = 80;

async function getImages(dir) {
    let images = [];
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            images = images.concat(await getImages(fullPath));
        } else if (entry.isFile() && /\.(webp|png|jpg|jpeg)$/i.test(entry.name)) {
            images.push(fullPath);
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

            // Read metadata first to see if resize is needed
            const metadata = await sharp(file).metadata();

            // Skip small images (e.g. icons < 100KB) unless explicitly large dimensions
            if (originalSize < 100 * 1024 && metadata.width <= MAX_WIDTH) {
                continue;
            }

            const buffer = await fs.readFile(file);
            let pipeline = sharp(buffer);

            if (metadata.width > MAX_WIDTH) {
                pipeline = pipeline.resize({ width: MAX_WIDTH, withoutEnlargement: true });
            }

            // Detect format and compress
            if (metadata.format === 'jpeg' || metadata.format === 'jpg') {
                pipeline = pipeline.jpeg({ quality: QUALITY, mozjpeg: true });
            } else if (metadata.format === 'png') {
                pipeline = pipeline.png({ quality: QUALITY, compressionLevel: 8 });
            } else if (metadata.format === 'webp') {
                pipeline = pipeline.webp({ quality: QUALITY });
            }

            const outputBuffer = await pipeline.toBuffer();

            if (outputBuffer.length < originalSize) {
                await fs.writeFile(file, outputBuffer);
                const saved = originalSize - outputBuffer.length;
                totalSaved += saved;
                console.log(`Optimized ${path.basename(file)}: ${(originalSize / 1024 / 1024).toFixed(2)}MB -> ${(outputBuffer.length / 1024 / 1024).toFixed(2)}MB`);
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
