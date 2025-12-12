import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
    // Enable support for standard HTML features and optimized builds
    build: {
        inlineStylesheets: 'auto',
    },
    server: {
        port: 3000,
        host: true
    }
});
