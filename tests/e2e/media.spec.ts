import { expect, test } from '@playwright/test'
import { siteConfig } from '../../content/site-config'
import { works } from '../../content/works'
import { getVideoUrl } from '../../lib/portfolio'

// Explicit network checks: pnpm test:media. No upload or cloud mutation.
test.describe('real object-storage media', () => {
  test.describe.configure({ mode: 'serial' })
  for (const work of works.filter((item) => item.visible)) {
    test(`${work.slug} supports MP4 byte ranges`, async ({ request }) => {
      const videoUrl = getVideoUrl(work, siteConfig)
      expect(videoUrl).toBeTruthy()
      const response = await request.get(videoUrl!, {
        headers: { Range: 'bytes=0-1023', Origin: siteConfig.canonicalUrl },
        timeout: 20_000,
      })
      try {
        expect(response.status()).toBe(206)
        expect(response.headers()['content-type']).toBe('video/mp4')
        expect(response.headers()['content-range']).toMatch(/^bytes 0-1023\/\d+$/)
        expect([siteConfig.canonicalUrl, '*']).toContain(response.headers()['access-control-allow-origin'])
      } finally {
        await response.dispose()
      }
    })
  }
})
