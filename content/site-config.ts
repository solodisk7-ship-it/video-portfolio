export const siteConfig = {
  /** Local demo builds are allowed; the final release command stays blocked. */
  contentStatus: 'demo' as 'demo' | 'production',
  publicName: 'Portfolio',
  siteTitle: 'Motion Design & Video Editing',
  description:
    'Independent motion design and video editing portfolio featuring short-form films, social video and title work.',
  canonicalUrl: 'https://video-portfolio-3s4.pages.dev',
  socialImage: {
    url: '/works/boots-landscape-v01.webp',
    width: 1600,
    height: 900,
    alt: 'Boots — Horizontal · Fashion Concept · Video Editing',
  },
  mediaBaseUrl:
    'https://storage.yandexcloud.net/portfolio-nonstoplife26-media',
  demoVideoUrl: null as string | null,
  contact: {
    email: 'solo-disk@mail.ru',
    telegram: null as { readonly url: string; readonly label: string } | null,
  },
} as const
