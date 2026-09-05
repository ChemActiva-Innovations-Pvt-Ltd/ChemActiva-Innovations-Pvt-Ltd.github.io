# ChemActiva Codebase Map

## 1. Architecture (v3, post-Astro-migration)

```
Astro pages (src/pages/*.astro)
  └─ import modern-design.css (single design system)
       └─ inline <script> per page (vanilla JS, no framework)

Data flow:
  public/*.jsonl ─fetch→ inline JS renders cards/grids
  public/assets/markdown/*.md ─fetch→ client-side markdown render (blog posts)

Build: astro build → dist/ (23 pages, 1 CSS bundle, images, sw.js)
Deploy: push main → Actions quality gate → Pages → chemactiva.com
```

## 2. Pages

| Route | File | What it does |
|-------|------|--------------|
| `/` | `src/pages/index.astro` | Hero (3D card-stack slideshow, milestone-first), journey timeline (animated spine), innovations, product showcase, team + advisors (from team.jsonl), contact form → Google Form, quote modal → Google Form |
| `/products/` | `src/pages/products/index.astro` | 3 products w/ per-image aspect-ratio metadata (`imgMeta`), thumbnail swap updates ratio + portrait class (`swapMain()`), quote modal |
| `/blog/` | `src/pages/blog/index.astro` | Blog cards (reading time, SVG meta icons, reveal) from blog.jsonl |
| `/blog/post/[id]` | `src/pages/blog/post/[id].astro` | Markdown-rendered article, prose styles, back link |
| `/team/[id]` | `src/pages/team/[id].astro` | Member profile (3:4 portrait, bio, responsibilities) |

## 3. Data (public/)

- `team.jsonl` — 15 members (positions drive filtering: Advisor / Past Member / Team)
- `blog.jsonl` — 5 posts (coverImage, markdownContentFile → /assets/markdown/blog/)
- `journey.jsonl` — 5 timeline events
- `manifest.json` — PWA (icons 192/512)

## 4. Design System (src/styles/modern-design.css)

Single-file system, sections marked with banner comments:
- Theme variables (dark default, `body.light-mode` overrides)
- Glassmorphism v2 (dual-theme refraction, ambient glow field, noise grain)
- Hero: desktop card-stack (absolute center-anchored, --card-ratio per image) +
  mobile blur-fill stage (contain + blurred backdrop)
- Timeline v2 (animated spine), blog cards v2, product cards v2
- Reveal animations (.reveal + IntersectionObserver per page)
- a11y: :focus-visible rings, reduced-motion guards

## 5. Service Worker (public/sw.js v2.1.0)

- Navigations: **network-first** (fresh deploys; cache fallback offline)
- `/_astro/*` hashed assets: cache-first (immutable)
- Images: stale-while-revalidate
- jsonl data: network-first

## 6. Testing (js/tests/, 44 tests)

- `images.test.js` — asset integrity: no empties/dupes, budgets, team 3:4 uniform,
  slides natural-ratio, all refs resolve
- `wiring.test.js` — Google Form entry IDs, team data, products content, SVG
  migration, SEO domain, SW strategy, hero-card anchoring regression guards
- `website.test.js` — DOM behavior (theme, hamburger, typewriter)

## 7. CI/CD (.github/workflows/deploy.yml)

quality (Node 24: lint → jest → build → link-integrity → image-budget) →
build+upload (main) → deploy-pages. Lighthouse on PRs.

## 8. Image Pipeline (optimize-images.mjs)

Sharp-based: EXIF-transpose first (rotation-safe), per-class width caps
(team 768 / products 1200 / covers 1200 / hero 768), q82 webp effort 6.
Run before committing new media.
