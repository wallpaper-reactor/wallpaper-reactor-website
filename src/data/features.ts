/** Content for /features/ — pulled out of markup so the tier table and the plan
    cards can't disagree about what's in each tier. */

export const HIGHLIGHTS = [
  {
    title: '✅ Zero-friction start',
    body: 'Browse and apply wallpapers locally, with battery-aware options out of the box.',
  },
  {
    title: '☁️ Cloud convenience',
    body: 'Sign in to sync favorites, create/upload wallpapers, and collect feedback.',
  },
  {
    title: '⚡ Power features',
    body: 'Paid unlocks settings sync, private wallpapers, large files, performance tuning, and priority support.',
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
  { label: 'Search & Filter', tiers: ['anon', 'signedIn', 'paid'] },
  { label: 'Battery Options', tiers: ['anon', 'signedIn', 'paid'] },
  { label: 'All wallpapers < 50 MB', tiers: ['anon', 'signedIn', 'paid'] },
  { label: 'User Profile', tiers: ['signedIn', 'paid'] },
  { label: 'Cloud Favorites', tiers: ['signedIn', 'paid'] },
  { label: 'Create / Upload Wallpapers', tiers: ['signedIn', 'paid'] },
  { label: 'Feedback System', tiers: ['signedIn', 'paid'] },
  { label: 'Wallpaper Settings Sync', tiers: ['paid'] },
  { label: 'Private Wallpapers', tiers: ['paid'] },
  { label: 'Ad-Free Experience', tiers: ['paid'] },
  { label: 'Performance Settings', tiers: ['paid'] },
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
    items: ['Browse Gallery', 'Apply Locally', 'Search & Filter', 'Battery Options', 'All wallpapers < 50 MB'],
    style: 'base' as const,
  },
  {
    emoji: '👤',
    name: 'Free (Signed In)',
    price: '$0',
    unit: null,
    intro: 'Everything in Free (Anonymous), plus',
    items: ['User Profile', 'Cloud Favorites', 'Wallpaper Creation / Upload', 'Feedback System'],
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
      'Ad-Free Experience',
      'Performance Settings',
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
    limitation: { lead: 'Note:', text: 'Video upload unavailable (mobile hardware limits)' },
  },
  {
    name: 'Windows',
    icon: '/assets/images/windows-logo-fill.svg',
    options: [
      { title: 'Microsoft Store', label: 'Full', tone: 'green' as const, note: 'Auto-updates, full feature set' },
      { title: 'Direct Download', label: 'Full', tone: 'green' as const, note: 'Manual updates required' },
    ],
    limitation: {
      lead: 'Note:',
      text: 'No multi-platform info (no cross-platform branding, suggestions, or links)',
    },
  },
  {
    name: 'macOS',
    icon: '/assets/images/apple-logo-fill.svg',
    options: [
      { title: 'Mac App Store', label: 'Lite', tone: 'yellow' as const, note: 'Auto-updates, limited features' },
      { title: 'Direct Download', label: 'Full', tone: 'green' as const, note: 'Manual updates, full feature set' },
    ],
    limitation: {
      lead: 'Lite version:',
      text: 'Free only; no sign-in, cloud sync, performance options, cross-platform info, or paid features',
    },
  },
];
