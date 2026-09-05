# ChemActiva Innovations Website

Official website for ChemActiva Innovations Pvt Ltd — Pioneering Sustainable Nano Cellulose.
Live at **[chemactiva.com](https://chemactiva.com)**.

## Stack

- **[Astro 5](https://astro.build)** — static site generator (23 pages)
- Zero-JS framework: pages ship plain HTML + small inline scripts
- Single CSS bundle (`src/styles/modern-design.css`) with glassmorphism design system
- Sharp-optimized WebP images with strict aspect-ratio handling
- Service worker (network-first HTML, cache-first hashed assets, SWR images)
- Jest test suite (44 tests) + GitHub Actions CI (lint → test → build → link-check → image-budget → deploy)

## Project Structure

```
.
├── src/
│   └── pages/               # Astro pages (all import modern-design.css)
│       ├── index.astro      # Homepage: 3D card-stack hero, timeline, team, forms
│       ├── products/        # Product catalog (3 shola-valorization products)
│       ├── blog/            # Blog index + post/[id] (markdown-rendered)
│       └── team/[id].astro  # Team member profiles
├── src/styles/
│   └── modern-design.css    # THE design system (single file, ~2900 lines)
├── public/
│   ├── assets/images/       # Optimized webp (team 3:4, products, slides 16:7)
│   ├── assets/markdown/     # Blog article sources (served + fetched at runtime)
│   ├── *.jsonl              # Data: team, blog, journey
│   ├── sw.js                # Service worker v2.1.0
│   └── manifest.json        # PWA manifest
├── js/tests/                # Jest suite (images, wiring, website)
├── optimize-images.mjs      # Sharp image pipeline (EXIF-safe, per-class caps)
└── .github/workflows/       # CI/CD
```

## Development

```bash
npm install
npm run dev        # local dev server
npm run build      # build to dist/
npm test           # jest suite (44 tests)
npm run lint       # eslint
node optimize-images.mjs  # re-encode images (run before committing new media)
```

## Key Conventions

- **Images**: every image is pre-cropped to its display ratio (team 600×800,
  hero slides natural-ratio, products per-image aspect-ratio metadata).
  Never add raw photos — run the optimizer first.
- **Forms**: contact + quote forms POST to Google Forms via verified entry
  IDs (see `js/tests/wiring.test.js` — the IDs are regression-guarded).
- **Theme**: dark default, light via `body.light-mode` (CSS variables).
- **Caching**: SW is network-first for navigations — never cache-first HTML.

## Deployment

Push to `main` → GitHub Actions runs quality gates → builds → deploys to
GitHub Pages → served at chemactiva.com (CNAME).

## License

Copyright © 2023-2026 ChemActiva Innovations Pvt Ltd. All rights reserved.
