import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
    site: 'https://chemactiva.com',
    integrations: [sitemap()],
    build: {
        inlineStylesheets: 'auto',
    },
    server: {
        port: 3000,
        host: true
    }
});
