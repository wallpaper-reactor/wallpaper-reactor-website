/** Single source of truth for site-wide constants and external store links. */
import { downloadAttrs } from '../scripts/download-tracking.js';

export const SITE = {
  title: 'Wallpaper Reactor',
  description:
    'Live wallpapers for macOS, Windows, Android and Linux (KDE Plasma, GNOME, Sway, Hyprland) — video loops, GLSL shaders, Godot scenes and interactive web wallpapers in one app.',
  url: 'https://wallpaperreactor.app',
  author: 'Kyle Eichlin',
  gaTrackingId: 'G-YYB483JREW',
} as const;

export const STORES = {
  googlePlay: 'https://play.google.com/store/apps/details?id=app.wallpaperreactor',
  microsoft: 'https://apps.microsoft.com/detail/9n4302crdqrl',
  /** Mac App Store build is the limited "Lite" version — never the primary CTA. */
  appStoreLite: 'https://apps.apple.com/us/app/wallpaper-reactor-lite/id6751447022',
} as const;

/** The `data-download-*` attributes for a store link; spread them onto the `<a>`. */
export const storeAttrs = (store: keyof typeof STORES) =>
  ({
    googlePlay: downloadAttrs('android', 'play'),
    microsoft: downloadAttrs('windows', 'microsoft-store'),
    appStoreLite: downloadAttrs('macos', 'app-store'),
  })[store];

export const WEB_APP = 'https://web.wallpaperreactor.app';

export const NAV = [
  { label: 'Home', href: '/' },
  { label: 'Features & Pricing', href: '/features/' },
  { label: 'Releases', href: '/releases/' },
  { label: 'Documentation', href: '/docs/' },
  { label: 'Blog', href: '/blog/' },
  { label: 'Support', href: '/support/' },
] as const;
