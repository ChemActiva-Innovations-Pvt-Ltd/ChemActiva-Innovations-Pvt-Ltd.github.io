# ChemActiva Codebase Map

## 1. Project Overview
**ChemActiva Innovations** website is a modern, responsive, static web application designed to showcase sustainable nanocellulose products. It utilizes a modular architecture with vanilla JavaScript (ES Modules), extensive CSS styling, and JSONL files for data storage. It features PWA capabilities via a Service Worker.

## 2. Directory Structure

### Root Directory
- **`index.html`**: The main landing page.
    - **Key Sections**: Hero (Slider), About Us, Journey (dynamic), Innovation, Products (Highlight), Team (dynamic), Advisors (dynamic), Contact.
    - **Logic**: Loads data from `journey.jsonl`, `team.jsonl` via inline scripts and rendering logic.
    - **Dependencies**: Loads `js/main.js`, `js/mobile-enhancements.js`, `js/visual-enhancements.js`.
- **`sw.js`**: Service Worker.
    - **Function**: Caches application shell (HTML, CSS, JS, Images) for offline support.
    - **Strategy**: Stale-while-revalidate / Cache-first for assets.
- **`manifest.json`**: Web App Manifest for PWA installation (icons, theme color).
- **`package.json`**: Project metadata and dependencies (if any build tools are used).

### Data Files (JSONL)
- **`journey.jsonl`**: Contains timeline events for the "Our Journey" section.
- **`team.jsonl`**: Contains team member profiles (Name, Position, Bio, Image) for "Our Team" and "Advisors" sections.
- **`blog.jsonl`**: Metadata for blog posts (Title, Date, Author, Tags, Path to Markdown file).

### Sub-Pages
#### `products/`
- **`index.html`**: The full products catalog.
    - **Logic**: Contains an inline `products` array and `renderProducts()` function to display grid.
    - **Enhanced Logic**: Imports `js/products.js` which initializes `ProductFlashCards` and `ModernThemeManager` for advanced interactions.

#### `blog/`
- **`index.html`**: The blog listing and article view.
    - **Logic**: Imports `loadBlogArticles` from `js/blog.js`. Switches between grid view and article view dynamically.

### `/js/` (JavaScript Logic)
Each file is an ES Module.

| File | Purpose | Key Classes/Functions |
| :--- | :--- | :--- |
| **`main.js`** | Core initialization for the site. | Themes, Navigation, Footer Year. |
| **`mobile-enhancements.js`** | Mobile UX improvements. | `MobileEnhancements`: Swipe gestures, pull-to-refresh, touch ripples. |
| **`visual-enhancements.js`** | Visual polish. | `VisualEnhancements`: Navbar scroll effect, custom lazy loading, scroll animations. |
| **`products.js`** | Logic for Products page. | Init `ProductFlashCards`, `ModernThemeManager`, event listeners for interactions. |
| **`blog.js`** | Blog logic. | `loadBlogArticles`, `loadArticle` (uses `marked` library from CDN), `setupBackButton`. |
| **`sw-register.js`** | Registers the Service Worker. | Standard registration boilerplate. |
| **`HeroLoader.js`** | Specific loader for the Hero section. | (Likely handles particle or image loading orchestration). |
| **`ModernCursorEffects.js`** | Custom cursor logic. | Adds interactive cursor effects (likely trailing or hover states). |
| **`lazy-loading.js`** | Standalone lazy loader. | Polyfill or utility for image lazy loading. |
| **`utils.*.js`** | Helper functions. | Bundled utility code. |

### `/css/` (Styling)
Modular CSS architecture. Key files:

| File | Scope |
| :--- | :--- |
| **`base.css`**, **`theme.css`** | Core variables (colors, fonts) and reset. |
| **`layout.css`**, **`navbar.css`**, **`footer.css`** | Structural components. |
| **`hero.css`**, **`enhanced-hero-banner.css`** | Specifics for the complex Hero section. |
| **`products-modern.css`**, **`products-redesigned.css`** | Styling for the products grid and cards. |
| **`mobile-fixes.css`** | Overrides and adjustments for mobile viewports. |
| **`modern-sections.css`** | Styling for updated/redesigned sections. |

### `/assets/`
- **`images/`**: Product images, team photos, UI icons.
- **`icons/`**: SVGs for features and sections.

## 3. Key Workflows & Relationships

1.  **Homepage Loading**:
    - `index.html` loads.
    - `sw.js` is registered.
    - CSS files apply styles.
    - Inline JS fetches `journey.jsonl` -> Renders Timeline.
    - Inline JS fetches `team.jsonl` -> Renders Team & Advisors.
    - `main.js` initializes Theme and Nav.
    - `mobile-enhancements.js` adds touch listeners.

2.  **Product Page Interaction**:
    - `products/index.html` loads.
    - Inline JS renders the initial "Products Grid" from hardcoded data.
    - `products.js` initializes `ProductFlashCards` (likely upgrades the DOM or handles a different view mode) and `ContactManager`.

3.  **Blog Reading**:
    - `blog/index.html` loads.
    - `blog.js` fetches `blog.jsonl`.
    - User clicks article -> `loadArticle` fetches the Markdown file -> Renders via `marked`.

## 4. UI/UX Features
- **Modern Interactions**: Custom cursor, scroll animations, swipe support on mobile.
- **Performance**: Lazy loading of images, Service Worker caching.
- **Dark Mode**: Supported via `theme.css` and `ModernThemeManager`.
