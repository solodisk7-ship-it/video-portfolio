export const siteConfig = {
  /** Release validation intentionally blocks deployment while this is "demo". */
  contentStatus: 'demo' as 'demo' | 'production',
  publicName: 'Portfolio',
  siteTitle: 'Motion Design & Video Editing',
  description:
    'Independent motion design and video editing portfolio featuring short-form films, social video and title work.',
  canonicalUrl: 'https://video-portfolio-3s4.pages.dev',
  mediaBaseUrl: '/works',
  demoVideoUrl:
    'https://storage.yandexcloud.net/portfolio-nonstoplife26-media/xionic2.mp4.mp4' as string | null,
  videoProtection: {
    watermarkLabel: 'Portfolio',
  },
  contact: {
    email: 'solo-disk@mail.ru',
    telegram: null as { readonly url: string; readonly label: string } | null,
  },
} as const
