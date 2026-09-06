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
    for (const p of ['src/pages/index.astro', 'src/pages/blog/post/[id].astro']) {
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

describe('Hero card anchoring (no static-position drift)', () => {
  const css = fs.readFileSync(path.join(ROOT, 'src', 'styles', 'modern-design.css'), 'utf8');

  test('no rule sets position:relative on .hero-stack-image', () => {
    // Regression guard: a leftover `position: relative` once overrode the
    // absolute anchoring, making cards render progressively lower (drift).
    const blocks = [...css.matchAll(/\.hero-stack-image\s*\{([^}]*)\}/g)];
    expect(blocks.length).toBeGreaterThan(0);
    for (const b of blocks) {
      expect(b[1]).not.toMatch(/position\s*:\s*relative/);
    }
  });

  test('base hero card rule anchors absolute at center', () => {
    expect(css).toContain('.hero-stack-image {\n    position: absolute;\n    top: 50%;\n    left: 50%;');
  });

  test('all desktop state transforms include centering translate', () => {
    for (const state of ['active', 'behind-1', 'behind-2', 'behind-3']) {
      const m = css.match(new RegExp(`\\.hero-stack-image\\.${state} \\{([^}]*)\\}`));
      expect(m).toBeTruthy();
      expect(m[1]).toMatch(/translate\(-50%,\s*-50%\)/);
    }
  });
});

describe('Blog data integrity', () => {
  const blogs = fs.readFileSync(path.join(ROOT, 'public', 'blog.jsonl'), 'utf8')
    .trim().split('\n').map((l) => JSON.parse(l));

  test('every blog entry has a markdown file that exists', () => {
    expect(blogs.length).toBeGreaterThan(0);
    for (const b of blogs) {
      const mdPath = path.join(ROOT, 'public', b.markdownContentFile);
      expect(fs.existsSync(mdPath)).toBe(true);
    }
  });

  test('no orphaned markdown files in served blog dir', () => {
    const servedDir = path.join(ROOT, 'public', 'assets', 'markdown', 'blog');
    const onDisk = fs.readdirSync(servedDir).filter((f) => f.endsWith('.md'));
    const referenced = new Set(blogs.map((b) => path.basename(b.markdownContentFile)));
    const orphans = onDisk.filter((f) => !referenced.has(f));
    expect(orphans).toEqual([]);
  });

  test('blog posts are build-time rendered (no runtime fetch of markdown)', () => {
    const src = fs.readFileSync(path.join(ROOT, 'src', 'pages', 'blog', 'post', '[id].astro'), 'utf8');
    expect(src).toContain('from \'marked\'');
    expect(src).not.toContain('fetch(markdownFile)');
    expect(src).not.toMatch(/renderMd/);
  });

  test('blog post page has SEO essentials (canonical, JSON-LD, og)', () => {
    const src = fs.readFileSync(path.join(ROOT, 'src', 'pages', 'blog', 'post', '[id].astro'), 'utf8');
    expect(src).toContain('rel="canonical"');
    expect(src).toContain('BlogPosting');
    expect(src).toContain('og:type" content="article"');
    expect(src).toContain('article:published_time');
  });

  test('blog index has filter + search affordances', () => {
    const src = fs.readFileSync(path.join(ROOT, 'src', 'pages', 'blog', 'index.astro'), 'utf8');
    expect(src).toContain('blog-filter-chip');
    expect(src).toContain('blog-search');
    expect(src).toContain('blog-empty');
  });
});

describe('404 + team index pages', () => {
  test('404 page exists, branded, noindex, has escape links', () => {
    const src = fs.readFileSync(path.join(ROOT, 'src', 'pages', '404.astro'), 'utf8');
    expect(src).toContain('Page Not Found');
    expect(src).toContain('name="robots" content="noindex"');
    ['href="/"', 'href="/products"', 'href="/blog"'].forEach(l => expect(src).toContain(l));
    expect(src).not.toContain('script src="/js/');
  });

  test('team index statically renders all members grouped by role', () => {
    const src = fs.readFileSync(path.join(ROOT, 'src', 'pages', 'team', 'index.astro'), 'utf8');
    expect(src).toContain('readFileSync(\'./public/team.jsonl\''); // build-time data (no client fetch)
    expect(src).toContain('position === \'Advisor\'');
    expect(src).toContain('position === \'Past Member\'');
    expect(src).toContain('rel="canonical"');
    expect(src).not.toContain('fetch(');
    // every member card links to its profile page
    expect(src).toContain('href={`/team/${m.id}`}');
  });

  test('built dist has 404.html and team/index.html (when dist exists)', () => {
    const dist = path.join(ROOT, 'dist');
    // CI runs tests BEFORE build (fresh checkout has no dist) — the workflow's
    // post-build link-integrity step covers that case. Locally we verify the
    // built output whenever a dist/ is present.
    if (!fs.existsSync(dist)) return;
    expect(fs.existsSync(path.join(dist, '404.html'))).toBe(true);
    expect(fs.existsSync(path.join(dist, 'team', 'index.html'))).toBe(true);
    const team = fs.readFileSync(path.join(dist, 'team', 'index.html'), 'utf8');
    expect(team).toContain('team-profile-card');
  });

  test('navs link to /team page (not just homepage anchor)', () => {
    ['src/pages/index.astro', 'src/pages/products/index.astro', 'src/pages/blog/index.astro', 'src/pages/blog/post/[id].astro', 'src/pages/team/[id].astro'].forEach(f => {
      const src = fs.readFileSync(path.join(ROOT, f), 'utf8');
      expect(src).not.toContain('href="/#team"');
    });
  });
});

describe('Favicon + blog mobile layout', () => {
  test('favicon is the ChemActiva logo, not the Vite placeholder', () => {
    const svg = fs.readFileSync(path.join(ROOT, 'public', 'favicon.svg'), 'utf8');
    expect(svg).toContain('/assets/images/logo.png');       // real brand mark
    expect(svg).not.toContain('M50.4 78.5');               // Vite logo path (old placeholder)
    expect(fs.existsSync(path.join(ROOT, 'public', 'favicon-64.png'))).toBe(true);
    // every page declares PNG fallback + apple-touch
    const pages = ['src/pages/index.astro', 'src/pages/404.astro', 'src/pages/blog/index.astro', 'src/pages/products/index.astro', 'src/pages/team/index.astro'];
    pages.forEach(p => {
      const src = fs.readFileSync(path.join(ROOT, p), 'utf8');
      expect(src).toContain('favicon-64.png');
      expect(src).toContain('apple-touch-icon');
    });
  });

  test('blog post mobile layout cannot overflow (block stack under 900px)', () => {
    const css = fs.readFileSync(path.join(ROOT, 'src', 'styles', 'modern-design.css'), 'utf8');
    // the ≤900px rule must switch to block (grid 1fr left the article in an implicit auto track)
    const m = css.match(/@media \(max-width: 900px\) \{\s*\/\* Block stack[\s\S]*?\.post-layout \{\s*display: block;/);
    expect(m).not.toBeNull();
    // grid children can shrink
    expect(css).toMatch(/\.post-layout > \* \{\s*min-width: 0;/);
    // long tokens wrap
    expect(css).toMatch(/\.blog-content \{[\s\S]*?overflow-wrap: break-word;/);
  });
});

describe('Developer attribution (invisible, all pages)', () => {
  test('every built page carries all 3 attribution layers', () => {
    const dist = path.join(ROOT, 'dist');
    if (!fs.existsSync(dist)) return; // CI runs tests pre-build
    const pages = [];
    (function walk(d) {
      for (const e of fs.readdirSync(d, { withFileTypes: true })) {
        const p = path.join(d, e.name);
        if (e.isDirectory()) walk(p);
        else if (e.name === 'index.html' || e.name === '404.html') pages.push(p);
      }
    })(dist);
    expect(pages.length).toBeGreaterThanOrEqual(25);
    for (const p of pages) {
      const html = fs.readFileSync(p, 'utf8');
      expect(html).toContain('<!-- Website developed by Shuvam Banerji Seal -->'); // view-source layer
      // machine layer: author (site pages) or creator (blog posts keep author=post writer)
      expect(html).toMatch(/<meta name="(author|creator)" content="Shuvam Banerji Seal/);
      expect(html).toMatch(/class="sr-only"[^>]*>Website developed by Shuvam Banerji Seal/); // a11y layer
    }
  });

  test('sr-only utility is visually hidden (clip pattern)', () => {
    const css = fs.readFileSync(path.join(ROOT, 'src', 'styles', 'modern-design.css'), 'utf8');
    expect(css).toMatch(/\.sr-only \{[\s\S]*?clip: rect\(0, 0, 0, 0\)/);
  });
});
