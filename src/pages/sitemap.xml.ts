import type { APIRoute } from 'astro';
import { SITE } from '../data/site';

/**
 * Jekyll's jekyll-sitemap plugin served the sitemap at /sitemap.xml, and that URL
 * may already be submitted in Search Console or linked from elsewhere.
 * @astrojs/sitemap emits /sitemap-index.xml instead, so this keeps the old path
 * alive as a valid sitemap index pointing at the generated files.
 */
export const GET: APIRoute = () => {
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap><loc>${SITE.url}/sitemap-0.xml</loc></sitemap>
</sitemapindex>
`;

  return new Response(body, {
    headers: { 'Content-Type': 'application/xml' },
  });
};
