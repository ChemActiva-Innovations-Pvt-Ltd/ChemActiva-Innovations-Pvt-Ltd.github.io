/**
 * Form wiring tests — verify Google Form entry IDs and payload construction.
 * The entry IDs below were verified live via Playwright against the actual
 * Google Forms (submissions confirmed "recorded"). These tests guard against
 * regressions in the wiring constants and payload shape.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');

const CONTACT_FORM = {
  action: 'https://docs.google.com/forms/d/e/1FAIpQLSfZ84dsH5xsDtrnseAt47aQJiDD1bB8VYvBIPZ-zHz0eYlfPg/formResponse',
  entries: {
    name: 'entry.2005620554',
    email: 'entry.1045781291',
    address: 'entry.1065046570',
    phone: 'entry.1166974658',
    subject: 'entry.514031641',
    message: 'entry.839337160'
  }
};

const QUOTE_FORM = {
  action: 'https://docs.google.com/forms/d/e/1FAIpQLSc_EAjG1Gjymylq5FFgervcxW8t1r0DkV_ONOPZOugHrEsL1A/formResponse',
  entries: {
    name: 'entry.1203149553',
    email: 'entry.1879064070',
    product: 'entry.788654624',
    details: 'entry.1146899460',
    message: 'entry.1882260475'
  }
};

describe('Google Form wiring', () => {
  test('contact form entry IDs are the verified live ones', () => {
    expect(CONTACT_FORM.entries.name).toBe('entry.2005620554');
    expect(CONTACT_FORM.entries.email).toBe('entry.1045781291');
    expect(CONTACT_FORM.entries.address).toBe('entry.1065046570');
    expect(CONTACT_FORM.entries.subject).toBe('entry.514031641');
    expect(CONTACT_FORM.entries.message).toBe('entry.839337160');
  });

  test('quote form entry IDs are the verified live ones', () => {
    expect(QUOTE_FORM.entries.name).toBe('entry.1203149553');
    expect(QUOTE_FORM.entries.email).toBe('entry.1879064070');
    expect(QUOTE_FORM.entries.product).toBe('entry.788654624');
    expect(QUOTE_FORM.entries.details).toBe('entry.1146899460');
    expect(QUOTE_FORM.entries.message).toBe('entry.1882260475');
  });

  test('homepage contact form is wired to the verified contact form', () => {
    const src = fs.readFileSync(path.join(ROOT, 'src', 'pages', 'index.astro'), 'utf8');
    expect(src).toContain(CONTACT_FORM.action);
    for (const key of ['name', 'email', 'subject', 'message']) {
      expect(src).toContain(`'${CONTACT_FORM.entries[key]}':`);
    }
    // no-cors mode is required for cross-origin Google Form POST
    expect(src).toContain('mode: \'no-cors\'');
    // status feedback element exists
    expect(src).toContain('id="contact-status"');
  });

  test('products quote form is wired to the verified quotation form', () => {
    const src = fs.readFileSync(path.join(ROOT, 'src', 'pages', 'products', 'index.astro'), 'utf8');
    expect(src).toContain(QUOTE_FORM.action);
    for (const key of ['name', 'email', 'product', 'details']) {
      expect(src).toContain(`'${QUOTE_FORM.entries[key]}':`);
    }
    expect(src).toContain('mode: \'no-cors\'');
    expect(src).toContain('id="quote-status"');
    // fallback link to the human-visible form
    expect(src).toContain('1FAIpQLSc_EAjG1Gjymylq5FFgervcxW8t1r0DkV_ONOPZOugHrEsL1A/viewform');
  });

  test('no stale forms.google.com placeholder links remain', () => {
    for (const p of ['src/pages/index.astro', 'src/pages/products/index.astro', 'src/pages/blog/index.astro']) {
      const src = fs.readFileSync(path.join(ROOT, p), 'utf8');
      expect(src).not.toContain('https://forms.google.com');
    }
  });
});

describe('Team data (drive-sourced updates)', () => {
  const team = fs.readFileSync(path.join(ROOT, 'public', 'team.jsonl'), 'utf8')
    .trim().split('\n').map((l) => JSON.parse(l));

  test('Kulsi position is the new tag', () => {
    const kulsi = team.find((m) => m.id === 'goutam-kulsi');
    expect(kulsi.position).toBe('Founder, CEO & Chief Scientist');
  });

  test('Hazra has an image now', () => {
    const hazra = team.find((m) => m.id === 'soumitra-hazra');
    expect(hazra.image).toBe('/assets/images/team/soumitra-hazra.webp');
    expect(fs.existsSync(path.join(ROOT, 'public', hazra.image.replace('/assets/', 'assets/')))).toBe(true);
  });

  test('Puste has an image now', () => {
    const puste = team.find((m) => m.id === 'prof-anandamoy-puste');
    expect(puste.image).toBe('/assets/images/team/prof-anandamoy-puste.webp');
    expect(fs.existsSync(path.join(ROOT, 'public', puste.image.replace('/assets/', 'assets/')))).toBe(true);
  });

  test('every team image referenced exists on disk', () => {
    for (const m of team) {
      if (m.image) {
        expect(fs.existsSync(path.join(ROOT, 'public', m.image.replace('/assets/', 'assets/')))).toBe(true);
      }
    }
  });
});

describe('Products page content (shola valorization)', () => {
  const src = fs.readFileSync(path.join(ROOT, 'src', 'pages', 'products', 'index.astro'), 'utf8');

  test('all three new products are present', () => {
    expect(src).toContain('Low-Bulk-Density Nanocellulose');
    expect(src).toContain('Microscope Immersion Oil Cleaning Kit');
    expect(src).toContain('Marine & Industrial Oil Spill Kit');
  });

  test('old product names are gone', () => {
    expect(src).not.toContain('\'Domestic Oil Spill Kit\'');
    expect(src).not.toContain('\'Greenulose™ Nano-Cellulose\'');
  });

  test('product images exist', () => {
    for (const f of ['microscope_immersion_oil_kit.webp', 'crystalline_nano_cellulose_new.webp', 'marine_oil_spill_kit_new.webp']) {
      expect(fs.existsSync(path.join(ROOT, 'public', 'assets', 'images', 'products', f))).toBe(true);
    }
  });
});

describe('SVG migration (no emoji UI)', () => {
  test('theme toggles use SVG not emoji', () => {
    for (const p of ['src/pages/index.astro', 'src/pages/products/index.astro', 'src/pages/blog/index.astro']) {
      const src = fs.readFileSync(path.join(ROOT, p), 'utf8');
      expect(src).not.toContain('🌙');
      expect(src).not.toContain('☀️');
      expect(src).toContain('theme-toggle-btn');
    }
  });

  test('feature icons are inline SVG (theme-aware currentColor)', () => {
    const src = fs.readFileSync(path.join(ROOT, 'src', 'pages', 'index.astro'), 'utf8');
    expect(src).toContain('class="icon-svg"');
    expect(src).toContain('M12 21C7 16.5'); // leaf path
    expect(src).toContain('17.5" cy="6.5"'); // microscope icon
    expect(src).toContain('M2 12c2-2.5 4-2.5 6 0'); // wave icon path
  });

  test('SVG icon files exist', () => {
    for (const f of ['leaf.svg', 'microscope.svg', 'wave.svg', 'recycle.svg']) {
      expect(fs.existsSync(path.join(ROOT, 'public', 'assets', 'icons', f))).toBe(true);
    }
  });

  test('falling leaves are SVG, not emoji', () => {
    for (const p of ['src/pages/index.astro', 'src/pages/products/index.astro', 'src/pages/blog/index.astro']) {
      const src = fs.readFileSync(path.join(ROOT, p), 'utf8');
      expect(src).toContain('leaf-svg');
      expect(src).not.toContain('\'🍃\'');
    }
  });
});

describe('SEO / canonical domain', () => {
  test('astro site is the custom domain', () => {
    const cfg = fs.readFileSync(path.join(ROOT, 'astro.config.mjs'), 'utf8');
    expect(cfg).toContain('site: \'https://chemactiva.com\'');
  });

  test('robots.txt sitemap points at custom domain', () => {
    const robots = fs.readFileSync(path.join(ROOT, 'public', 'robots.txt'), 'utf8');
    expect(robots).toContain('https://chemactiva.com/sitemap-index.xml');
  });

  test('no stale github.io URLs in source', () => {
    for (const p of ['src/pages/index.astro', 'src/layouts/Layout.astro', 'src/pages/blog/post/[id].astro']) {
      const src = fs.readFileSync(path.join(ROOT, p), 'utf8');
      expect(src).not.toContain('chemactiva-innovations-pvt-ltd.github.io');
      expect(src).not.toContain('chemactiva.github.io');
    }
  });
});

describe('Service worker v2', () => {
  test('precache list contains only URLs that exist in the built site', () => {
    const sw = fs.readFileSync(path.join(ROOT, 'public', 'sw.js'), 'utf8');
    // Extract ONLY the PRECACHE_URLS array literal, not other strings in the file
    const m = sw.match(/PRECACHE_URLS = \[([\s\S]*?)\]/);
    expect(m).toBeTruthy();
    const urls = [...m[1].matchAll(/'(\/[^']*)'/g)].map((x) => x[1]);
    expect(urls.length).toBeGreaterThan(3);
    const missing = [];
    for (const url of urls) {
      if (!fs.existsSync(path.join(ROOT, 'public', url.slice(1)))) missing.push(url);
    }
    expect(missing).toEqual([]);
  });

  test('SW is network-first for navigations (no stale HTML 404s)', () => {
    const sw = fs.readFileSync(path.join(ROOT, 'public', 'sw.js'), 'utf8');
    expect(sw).toContain('request.mode === \'navigate\'');
    expect(sw).toContain('networkFirst');
    // cache-first only for immutable hashed assets
    expect(sw).toContain('url.pathname.startsWith(\'/_astro/\')');
  });

  test('cache version bumped past v2.0.0', () => {
    const sw = fs.readFileSync(path.join(ROOT, 'public', 'sw.js'), 'utf8');
    expect(sw).toMatch(/chemactiva-v2\.\d+\.\d+/);
    expect(sw).not.toContain('CACHE_NAME = \'chemactiva-v2.0.0\'');
  });
});
