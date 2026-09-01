import type { MetadataRoute } from 'next'
import { siteConfig } from '@/content/site-config'

export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteConfig.canonicalUrl,
      lastModified: new Date('2026-09-01'),
      changeFrequency: 'monthly',
      priority: 1,
    },
  ]
}
