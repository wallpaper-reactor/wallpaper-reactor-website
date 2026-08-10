// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import icon from 'astro-icon';
import tailwindcss from '@tailwindcss/vite';

// Apex custom domain, so no `base`. `trailingSlash: 'always'` plus the default
// directory build format reproduces Jekyll's `permalink: pretty` URLs exactly —
// every live URL is /like/this/, and a mismatch would 404.
export default defineConfig({
  site: 'https://wallpaperreactor.app',
  trailingSlash: 'always',
  build: {
    format: 'directory',
  },
  integrations: [mdx(), sitemap(), icon()],
  vite: {
    plugins: [tailwindcss()],
  },
});
