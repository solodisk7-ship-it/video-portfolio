export const siteConfig = {
  /** Release validation intentionally blocks deployment while this is "demo". */
  contentStatus: 'demo' as 'demo' | 'production',
  publicName: 'Portfolio',
  siteTitle: 'Motion Design & Video Editing',
  description:
    'Independent motion design and video editing portfolio featuring short-form films, social video and title work.',
  canonicalUrl: 'https://portfolio.example.com',
  mediaBaseUrl: '/works',
  videoProtection: {
    watermarkLabel: 'Portfolio',
  },
  contact: {
    email: 'solo-disk@mail.ru',
    telegram: null as { readonly url: string; readonly label: string } | null,
  },
} as const
