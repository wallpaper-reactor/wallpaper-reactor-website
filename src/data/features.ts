/** Content for /features/ — pulled out of markup so the tier table and the plan
    cards can't disagree about what's in each tier. */

export const HIGHLIGHTS = [
  {
    title: '✅ Zero-friction start',
    body: 'Browse and apply wallpapers locally, with battery-aware options out of the box.',
  },
  {
    title: '☁️ Cloud convenience',
    body: 'Sign in to sync favorites and to create and upload wallpapers.',
  },
  {
    title: '⚡ Power features',
    body: 'Paid unlocks settings sync, private wallpapers, large files, and priority support.',
  },
] as const;

export type Tier = 'anon' | 'signedIn' | 'paid';

export const TIER_LABELS: Record<Tier, string> = {
  anon: 'Free (Anon)',
  signedIn: 'Free (Signed In)',
  paid: 'Paid',
};

export const TIER_FEATURES: { label: string; tiers: Tier[] }[] = [
  { label: 'Browse Gallery / Apply Locally', tiers: ['anon', 'signedIn', 'paid'] },
  { label: 'Quick Wallpaper (apply your own file)', tiers: ['anon', 'signedIn', 'paid'] },
  { label: 'Search & Filter', tiers: ['anon', 'signedIn', 'paid'] },
  { label: 'Battery Options', tiers: ['anon', 'signedIn', 'paid'] },
  { label: 'Performance Settings', tiers: ['anon', 'signedIn', 'paid'] },
  { label: 'Feedback System', tiers: ['anon', 'signedIn', 'paid'] },
  { label: 'All wallpapers < 50 MB', tiers: ['anon', 'signedIn', 'paid'] },
  { label: 'User Profile', tiers: ['signedIn', 'paid'] },
  { label: 'Cloud Favorites', tiers: ['signedIn', 'paid'] },
  { label: 'Create / Upload Wallpapers', tiers: ['signedIn', 'paid'] },
  { label: 'Wallpaper Settings Sync', tiers: ['paid'] },
  { label: 'Private Wallpapers', tiers: ['paid'] },
  { label: 'Large Wallpaper Files', tiers: ['paid'] },
  { label: 'Priority Support', tiers: ['paid'] },
];

export const PLANS = [
  {
    emoji: '🆓',
    name: 'Free (Anonymous)',
    price: '$0',
    unit: null as string | null,
    intro: 'Includes',
    items: [
      'Browse Gallery',
      'Apply Locally',
      'Quick Wallpaper (apply your own file)',
      'Search & Filter',
      'Battery Options',
      'Performance Settings',
      'Feedback System',
      'All wallpapers < 50 MB',
    ],
    style: 'base' as const,
  },
  {
    emoji: '👤',
    name: 'Free (Signed In)',
    price: '$0',
    unit: null,
    intro: 'Everything in Free (Anonymous), plus',
    items: ['User Profile', 'Cloud Favorites', 'Wallpaper Creation / Upload'],
    style: 'outline' as const,
  },
  {
    emoji: '💎',
    name: 'Paid',
    price: '$3',
    unit: '/month or $10/year',
    intro: 'Everything in Free (Signed In), plus',
    items: [
      'Wallpaper Settings Sync',
      'Private Wallpapers',
      'Large Wallpaper Files',
      'Priority Support',
    ],
    style: 'primary' as const,
  },
];

export const PLATFORMS = [
  {
    name: 'Android',
    icon: '/assets/images/android-logo-fill.svg',
    options: [
      { title: 'Google Play Store', label: 'Full', tone: 'green' as const, note: 'Auto-updates, full feature set' },
      { title: 'Direct Download', label: 'Full', tone: 'green' as const, note: 'Manual updates required' },
    ],
    limitation: {
      lead: 'Note:',
      text: "Android 16 (QPR3) and newer don't show live wallpapers on a connected external display. Android's own policy, not something the app can change.",
    },
  },
  {
    name: 'Windows',
    icon: '/assets/images/windows-logo-fill.svg',
    options: [
      { title: 'Microsoft Store', label: 'Full', tone: 'green' as const, note: 'Auto-updates, full feature set' },
      { title: 'Direct Download', label: 'Full', tone: 'green' as const, note: 'Updates in the app, full feature set' },
    ],
    limitation: {
      lead: 'Note:',
      text: 'The direct download installs for all users, so installing and updating it needs an administrator.',
    },
  },
  {
    name: 'macOS',
    icon: '/assets/images/apple-logo-fill.svg',
    options: [
      { title: 'Mac App Store', label: 'Lite', tone: 'yellow' as const, note: 'Auto-updates, limited features' },
      { title: 'Direct Download', label: 'Full', tone: 'green' as const, note: 'Updates in the app, full feature set' },
    ],
    limitation: {
      lead: 'Lite version:',
      text: "Sign-in and cloud favorites work, but Pro can't be bought here and cross-platform branding and links are hidden. A Pro account from another platform keeps Pro when you sign in.",
    },
  },
  {
    name: 'Linux',
    icon: '/assets/images/linux-logo-fill.svg',
    options: [
      { title: '.deb (Debian, Ubuntu)', label: 'Full', tone: 'green' as const, note: 'Direct download. Install new versions over the old one' },
      { title: 'Flatpak (SteamOS, Fedora, others)', label: 'Full', tone: 'green' as const, note: 'Direct download. Install new versions over the old one' },
    ],
    limitation: {
      lead: 'Note:',
      text: 'KDE Plasma 6 on x86_64 only. Other desktops can browse wallpapers but not set them, and Steam Deck needs Desktop Mode.',
    },
  },
];
