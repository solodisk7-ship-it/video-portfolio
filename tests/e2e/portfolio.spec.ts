import { expect, test } from '@playwright/test'
import { siteConfig } from '../../content/site-config'

test('defers MP4 loading, reveals the catalogue and restores the page after close', async ({ page }) => {
  const mp4Requests: string[] = []
  page.on('request', (request) => {
    if (/\.mp4(?:\?|$)/.test(request.url())) mp4Requests.push(request.url())
  })

  await page.goto('/')
  await expect(page.getByRole('button', { name: /^Open / })).toHaveCount(6)
  expect(mp4Requests).toHaveLength(0)

  await page.getByRole('button', { name: 'Load More' }).click()
  await expect(page.getByRole('button', { name: /^Open / })).toHaveCount(12)

  const firstCard = page.getByRole('button', { name: /^Open Halcyon/ })
  const mediaRequest = page.waitForRequest(/\.mp4(?:\?|$)/)
  await firstCard.click()
  await mediaRequest
  await expect(page.getByRole('dialog')).toBeVisible()
  expect(mp4Requests.length).toBeGreaterThan(0)

  await page.keyboard.press('Escape')
  await expect(page.getByRole('dialog')).toHaveCount(0)
  await expect(firstCard).toBeFocused()
  await expect(page.locator('video')).toHaveCount(0)
})

test('serves the remote demo MP4 with MIME and byte ranges', async ({ request }) => {
  expect(siteConfig.demoVideoUrl).toBeTruthy()

  const response = await request.get(siteConfig.demoVideoUrl!, {
    headers: { Range: 'bytes=0-1023' },
  })

  expect(response.status()).toBe(206)
  expect(response.headers()['content-type']).toBe('video/mp4')
  expect(response.headers()['content-range']).toMatch(/^bytes 0-1023\//)
})

test('keeps all cards uncropped and avoids horizontal scroll at mobile width', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')

  const firstImage = page.getByRole('button', { name: /^Open Halcyon/ }).locator('img')
  await expect(firstImage).toHaveCSS('object-fit', 'contain')
  const hasHorizontalScroll = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
  )
  expect(hasHorizontalScroll).toBe(false)
})
