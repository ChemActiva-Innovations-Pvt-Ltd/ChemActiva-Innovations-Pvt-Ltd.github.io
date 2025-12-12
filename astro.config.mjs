import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
    site: 'https://chemactiva-innovations-pvt-ltd.github.io',
    integrations: [sitemap()],
    build: {
        inlineStylesheets: 'auto',
    },
    server: {
        port: 3000,
        host: true
    }
});
