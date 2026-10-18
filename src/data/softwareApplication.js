/**
 * The site-wide SoftwareApplication JSON-LD. Plain JS (like `scripts/analytics.js`) so the `node --test`
 * suite can import it. `BaseLayout.astro` emits it on every page; a page with richer pricing passes `offers`.
 *
 * Required for a Google software-app rich result: name, offers (price), and one of aggregateRating or
 * review. We have no rating source, so neither is emitted. Never add a made-up one: it violates
 * Google's structured-data guidelines. Pages still carry the entity for the knowledge graph.
 *
 * `applicationCategory` is LifestyleApplication: the app personalises a device's look, which is not a
 * design tool (DesignApplication) even though wallpapers can be authored in it.
 */
const FREE_OFFER = { '@type': 'Offer', price: '0', priceCurrency: 'USD' };

/** @param {{ siteUrl: string, imageUrl: string, offers?: object | object[] }} args */
export function softwareApplicationSchema({ siteUrl, imageUrl, offers = FREE_OFFER }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Wallpaper Reactor',
    description:
      'Live wallpapers for Android, Windows, macOS and Linux: video loops, GLSL shaders, Godot scenes and interactive web wallpapers.',
    url: siteUrl,
    image: imageUrl,
    applicationCategory: 'LifestyleApplication',
    operatingSystem: 'Android, Windows, macOS, Linux',
    offers,
    downloadUrl: `${siteUrl}/releases/`,
  };
}
