// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import icon from 'astro-icon';
import starlight from '@astrojs/starlight';
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
  integrations: [
    // Starlight owns /docs/ only. Its content lives in src/content/docs/docs/,
    // which puts its routes under /docs/ and leaves the site root free for the
    // marketing pages in src/pages/.
    starlight({
      title: 'Wallpaper Reactor',
      disable404Route: true,
      favicon: '/favicon.ico',
      logo: {
        src: './src/assets/logo.png',
        alt: 'Wallpaper Reactor',
      },
      // Only the token overrides — NOT global.css. That file imports Tailwind,
      // whose preflight resets `ul { list-style: none }` and strips Starlight's
      // own content styling (bullets vanish from every docs page).
      customCss: ['./src/styles/starlight.css'],
      // Starlight's Expressive Code renders code blocks site-wide, and by default
      // emits both a light and a dark theme as --0/--1 CSS variables. Outside
      // Starlight there's no data-theme to select with, so it fell back to the
      // light theme — near-black code on a dark page. The site is dark-only, so
      // ship one theme.
      expressiveCode: {
        themes: ['github-dark'],
      },
      // The site is dark-only, so the theme picker is removed and the theme pinned.
      components: {
        ThemeSelect: './src/components/starlight/ThemeSelect.astro',
        ThemeProvider: './src/components/starlight/ThemeProvider.astro',
      },
      social: [
        { icon: 'github', label: 'GitHub', href: 'https://github.com/wallpaper-reactor' },
      ],
      sidebar: [
        { label: 'Documentation', link: '/docs/' },
        { label: 'Account Deletion', link: '/docs/account-deletion/' },
        {
          label: 'Wallpaper Creation',
          items: [
            { label: 'Overview', link: '/docs/wallpaper-creation/' },
            { label: 'Customizable User Settings', link: '/docs/wallpaper-creation/settings-json-tutorial/' },
            { label: 'Rive Animations', link: '/docs/wallpaper-creation/rive/' },
            { label: 'Wallpaper Upload Guidelines', link: '/docs/wallpaper-creation/wallpaper-guidelines/' },
          ],
        },
      ],
    }),
    mdx(),
    sitemap(),
    icon(),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
