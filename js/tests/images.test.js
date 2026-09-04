/**
 * Image pipeline regression tests.
 * Guards: no empty files, no byte-duplicates, references resolve,
 * byte budgets, portrait orientation for team photos, hero right-sizing.
 */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const sharp = require('sharp');

const ROOT = path.resolve(__dirname, '..', '..');
const PUBLIC = path.join(ROOT, 'public');
const RASTER = new Set(['.webp', '.png', '.jpg', '.jpeg']);

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (['node_modules', '.git', 'dist', 'coverage', '.rigor-trash'].includes(e.name)) continue;
      walk(p, out);
    } else if (e.isFile()) {
      out.push(p);
    }
  }
  return out;
}

function rastersUnder(dir) {
  return walk(dir).filter((p) => RASTER.has(path.extname(p).toLowerCase()));
}

function sourceFiles() {
  const files = [];
  const collect = (dir, exts) => {
    for (const p of walk(dir)) {
      if (exts.includes(path.extname(p).toLowerCase())) files.push(p);
    }
  };
  collect(path.join(ROOT, 'src'), ['.astro', '.js', '.css']);
  collect(PUBLIC, ['.js', '.jsonl', '.json']);
  collect(path.join(ROOT, 'markdown'), ['.md']);
  collect(path.join(PUBLIC, 'assets', 'markdown'), ['.md']);
  return files.filter((p) => !p.includes(`${path.sep}tests${path.sep}`));
}

function referencedAssetPaths() {
  const refs = new Set();
  const re = /\/assets\/[A-Za-z0-9_\-./]+\.(webp|png|jpg|jpeg|svg)/g;
  for (const f of sourceFiles()) {
    const text = fs.readFileSync(f, 'utf8');
    for (const m of text.matchAll(re)) refs.add(m[0]);
  }
  return [...refs];
}

describe('image pipeline', () => {
  test('no empty image files', () => {
    const empty = rastersUnder(PUBLIC).filter((p) => fs.statSync(p).size === 0);
    expect(empty).toEqual([]);
  });

  test('no byte-identical duplicate images', () => {
    const byHash = new Map();
    for (const p of rastersUnder(path.join(PUBLIC, 'assets', 'images'))) {
      const h = crypto.createHash('md5').update(fs.readFileSync(p)).digest('hex');
      if (!byHash.has(h)) byHash.set(h, []);
      byHash.get(h).push(path.relative(ROOT, p));
    }
    const dupes = [...byHash.values()].filter((g) => g.length > 1);
    expect(dupes).toEqual([]);
  });

  test('every referenced asset resolves to a file', () => {
    const missing = referencedAssetPaths().filter((u) => !fs.existsSync(path.join(PUBLIC, u.replace('/assets/', 'assets/'))));
    expect(missing).toEqual([]);
  });

  test('total raster bytes under budget', () => {
    const total = rastersUnder(PUBLIC).reduce((n, p) => n + fs.statSync(p).size, 0);
    expect(total).toBeLessThanOrEqual(4.5 * 1024 * 1024);
  });

  test('no single raster file over budget', () => {
    const big = rastersUnder(PUBLIC)
      .map((p) => ({ f: path.relative(ROOT, p), b: fs.statSync(p).size }))
      .filter((x) => x.b > 350 * 1024);
    expect(big).toEqual([]);
  });

  test('referenced team photos are right-sized (<=800px wide)', async () => {
    const refs = referencedAssetPaths().filter((u) => u.includes('/images/team/'));
    expect(refs.length).toBeGreaterThan(0);
    for (const u of refs) {
      const meta = await sharp(path.join(PUBLIC, u.replace('/assets/', 'assets/'))).metadata();
      expect(meta.width).toBeLessThanOrEqual(800);
    }
  });

  test('hero panels are right-sized (<=1600px wide)', async () => {
    for (const n of [1, 2, 3, 4, 5]) {
      const hits = rastersUnder(path.join(PUBLIC, 'assets', 'images')).filter((p) =>
        path.basename(p).startsWith(`Panel_${n}_`));
      expect(hits.length).toBeGreaterThan(0);
      for (const h of hits) {
        const meta = await sharp(h).metadata();
        expect(meta.width).toBeLessThanOrEqual(1600);
      }
    }
  });

  test('product images are right-sized (<=1200px wide)', async () => {
    const hits = rastersUnder(path.join(PUBLIC, 'assets', 'images', 'products'));
    expect(hits.length).toBeGreaterThan(0);
    for (const h of hits) {
      const meta = await sharp(h).metadata();
      expect(meta.width).toBeLessThanOrEqual(1200);
    }
  });

  test('hero slides are uniform 16:7 (1280x560)', async () => {
    const hits = rastersUnder(path.join(PUBLIC, 'assets', 'images', 'slides'));
    expect(hits.length).toBe(10);
    for (const h of hits) {
      const meta = await sharp(h).metadata();
      expect(meta.width).toBe(1280);
      expect(meta.height).toBe(560);
    }
  });

  test('team images are uniform 3:4 (600x800)', async () => {
    const hits = rastersUnder(path.join(PUBLIC, 'assets', 'images', 'team'));
    expect(hits.length).toBeGreaterThan(5);
    for (const h of hits) {
      const meta = await sharp(h).metadata();
      expect(meta.width).toBe(600);
      expect(meta.height).toBe(800);
    }
  });
});
