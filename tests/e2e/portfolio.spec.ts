import { expect, test } from '@playwright/test'
import { siteConfig } from '../../content/site-config'
import { works } from '../../content/works'
import { getVideoUrl } from '../../lib/portfolio'

test('defers MP4 loading and restores the page after close', async ({ page }) => {
  const mp4Requests: string[] = []
  page.on('request', (request) => {
    if (/\.mp4(?:\?|$)/.test(request.url())) mp4Requests.push(request.url())
  })

  await page.goto('/')
  await expect(page.getByRole('button', { name: /^Open / })).toHaveCount(3)
  expect(mp4Requests).toHaveLength(0)
  await expect(page.locator('#work').getByText('2026')).toHaveCount(0)

  const firstCard = page.getByRole('button', { name: /^Open Boots — Landscape/ })
  const mediaRequest = page.waitForRequest(/\.mp4(?:\?|$)/)
  await firstCard.click()
  await mediaRequest
  await expect(page.getByRole('dialog')).toBeVisible()
  await expect(page.getByTestId('video-watermark')).toHaveCount(0)
  await expect(page.getByRole('dialog').getByText('2026')).toHaveCount(0)
  expect(mp4Requests.length).toBeGreaterThan(0)

  await page.keyboard.press('Escape')
  await expect(page.getByRole('dialog')).toHaveCount(0)
  await expect(firstCard).toBeFocused()
  await expect(page.locator('video')).toHaveCount(0)
})

test('serves the first staged MP4 with MIME and byte ranges', async ({ request }) => {
  const videoUrl = getVideoUrl(works[0], siteConfig)
  expect(videoUrl).toBeTruthy()

  const response = await request.get(videoUrl!, {
    headers: { Range: 'bytes=0-1023' },
  })

  expect(response.status()).toBe(206)
  expect(response.headers()['content-type']).toBe('video/mp4')
  expect(response.headers()['content-range']).toMatch(/^bytes 0-1023\//)
})

test('crops card posters consistently and avoids horizontal scroll at mobile width', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')

  const firstImage = page.getByRole('button', { name: /^Open Boots — Landscape/ }).locator('img')
  await expect(firstImage).toHaveCSS('object-fit', 'cover')
  await expect(firstImage).toHaveCSS('object-position', '50% 50%')
  const hasHorizontalScroll = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
  )
  expect(hasHorizontalScroll).toBe(false)
})
