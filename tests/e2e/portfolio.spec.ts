import { readFileSync } from 'node:fs'
import { expect, test } from '@playwright/test'
import { siteConfig } from '../../content/site-config'
import { works } from '../../content/works'
import { getVideoUrl } from '../../lib/portfolio'

// UI tests intercept real MP4 requests with a tiny local clip, independent of the bucket.
const fixture = readFileSync(new URL('../fixtures/playback.webm', import.meta.url))
const mediaResponse = { status: 200, contentType: 'video/webm', body: fixture }
const visible = works.filter((work) => work.visible).sort((a, b) => a.order - b.order)
const featured = visible.filter((work) => work.featured)
const firstWork = featured[0]
const firstCardName = `Open ${firstWork.title} — ${firstWork.category}`

test.beforeEach(async ({ page }) => {
  await page.route(/\.mp4(?:\?|$)/, (route) => route.fulfill(mediaResponse))
})

test('filters works and keeps project navigation within the selected direction', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/#work')
  const filters = page.getByRole('group', { name: 'Filter works by direction' })
  for (const direction of ['Video Editing', 'AI Video', 'Motion Design']) {
    await filters.getByRole('button', { name: direction, exact: true }).click()
    const selected = visible.filter(work => (work.direction ?? 'Video Editing') === direction)
    await expect(page.locator('#work-grid h3')).toHaveText(selected.map(work => work.title))
    await expect(filters.getByRole('button', { name: direction, exact: true })).toHaveAttribute('aria-pressed', 'true')
  }
  const motionCard = page.getByRole('button', { name: /^Open After Effects Showreel/ })
  await motionCard.click()
  await page.getByRole('button', { name: 'Next', exact: true }).click()
  await expect(page.locator('#lightbox-title')).toHaveText('After Effects Slideshow — Horizontal')
  await page.getByRole('button', { name: 'Next', exact: true }).click()
  await expect(page.locator('#lightbox-title')).toHaveText('After Effects Showreel — Horizontal')
  await page.goBack()
  await expect(page.getByRole('dialog')).toHaveCount(0)
  await expect(motionCard).toBeFocused()
  await expect(filters.getByRole('button', { name: 'Motion Design', exact: true })).toHaveAttribute('aria-pressed', 'true')
  await filters.getByRole('button', { name: 'AI Video', exact: true }).click()
  await page.getByRole('button', { name: /^Open Pottery/ }).click()
  if (visible.filter(work => work.direction === 'AI Video').length < 2) {
    await expect(page.getByRole('button', { name: 'Next', exact: true })).toBeDisabled()
  } else {
    await page.getByRole('button', { name: 'Next', exact: true }).click()
    await expect(page.locator('#lightbox-title')).toHaveText('Urban Vibe — Vertical')
  }
  await page.getByRole('button', { name: 'Close project' }).click()
  await expect(page.getByRole('dialog')).toHaveCount(0)
  await filters.getByRole('button', { name: 'All', exact: true }).click()
  await expect(page.locator('#work-grid h3')).toHaveCount(visible.length)
  await expect(page.locator('#work')).not.toContainText(/\d+\s*\/\s*\d+/)
  expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false)
})

test('defers MP4 loading and restores the page after close', async ({ page }) => {
  const mp4Requests: string[] = []
  page.on('request', (request) => {
    if (/\.mp4(?:\?|$)/.test(request.url())) mp4Requests.push(request.url())
  })

  await page.goto('/')
  await expect(page.getByRole('button', { name: /^Open / })).toHaveCount(featured.length)
  expect(mp4Requests).toHaveLength(0)
  await expect(page.locator('#work').getByText(String(firstWork.year), { exact: true })).toHaveCount(0)

  const firstCard = page.getByRole('button', { name: firstCardName, exact: true })
  await firstCard.click()
  await expect(page.getByRole('dialog')).toBeVisible()
  // preload=metadata is a hint: a browser may defer the actual request until Play.
  await expect(page.locator('video')).toHaveAttribute('src', getVideoUrl(firstWork, siteConfig)!)
  await expect(page.locator('video')).toHaveAttribute('preload', 'metadata')
  await expect(page.getByTestId('video-watermark')).toHaveCount(0)
  await expect(page.getByRole('dialog').getByText(String(firstWork.year), { exact: true })).toHaveCount(0)
  await expect(page.locator('#site-shell')).toHaveAttribute('inert', '')
  await expect(page.locator('video')).toHaveCSS('object-fit', 'contain')

  await page.keyboard.press('Escape')
  await expect(page.getByRole('dialog')).toHaveCount(0)
  await expect(firstCard).toBeFocused()
  await expect(page.locator('video')).toHaveCount(0)
  await expect(page.locator('#site-shell')).not.toHaveAttribute('inert', '')
  await expect(page.locator('body')).not.toHaveCSS('overflow', 'hidden')
})

test('browser history closes projects and preserves normal navigation', async ({ page }) => {
  await page.goto('/?previous=1')
  await page.goto('/#work')
  const card = page.getByRole('button', { name: firstCardName, exact: true })
  await card.scrollIntoViewIfNeeded()
  const scroll = await page.evaluate(() => window.scrollY)
  await card.click()
  await expect(page.getByRole('dialog')).toBeVisible()
  if (featured.length > 1) await page.getByRole('button', { name: 'Next', exact: true }).click()
  await page.goBack()
  await expect(page.getByRole('dialog')).toHaveCount(0)
  await expect(card).toBeFocused()
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeCloseTo(scroll, 0)
  await page.goForward()
  await expect(page.getByRole('dialog')).toBeVisible()
  await page.getByRole('button', { name: 'Close project' }).click()
  await expect(page.getByRole('dialog')).toHaveCount(0)
  await card.click()
  await expect(page.getByRole('dialog')).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(page.getByRole('dialog')).toHaveCount(0)
  await page.goBack()
  await expect(page).toHaveURL(/previous=1/)
})

test('menu anchors reach their sections before and after closing a project', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/#work')
  async function checkMenu() {
    for (const section of ['about', 'contact', 'work']) {
      await page.getByRole('navigation', { name: 'Primary' }).getByRole('link', {
        name: new RegExp(`^${section}$`, 'i'),
      }).click()
      await expect(page).toHaveURL(new RegExp(`#${section}$`))
      await expect.poll(() => page.evaluate((id) => {
        const target = document.getElementById(id)!
        const top = target.getBoundingClientRect().top + window.scrollY
        const margin = parseFloat(getComputedStyle(target).scrollMarginTop)
        const expected = Math.min(top - margin, document.documentElement.scrollHeight - innerHeight)
        return Math.abs(window.scrollY - expected)
      }, section)).toBeLessThan(3)
    }
  }
  await checkMenu()
  await page.getByRole('button', { name: firstCardName, exact: true }).click()
  await page.getByRole('button', { name: 'Close project' }).click()
  await expect(page.getByRole('dialog')).toHaveCount(0)
  await checkMenu()
  await expect(page.locator('#about')).toContainText('Motion Design')
  await expect(page.locator('#about')).not.toContainText('Motion Design & Titles')
  await expect(page.locator('footer')).toContainText('2027')
})

test('reveals the remainder without hard-coded catalogue-size expectations', async ({ page }) => {
  await page.goto('/')
  const more = page.getByRole('button', { name: 'Load More' })
  let count = featured.length
  while (count < visible.length) {
    await expect(more).toBeVisible()
    await more.click()
    count = Math.min(count + 12, visible.length)
    await expect(page.getByRole('button', { name: /^Open / })).toHaveCount(count)
  }
  await expect(more).toHaveCount(0)
  const displayed = [...featured, ...visible.filter((work) => !work.featured)]
  await expect(page.locator('#work-grid h3')).toHaveText(displayed.map((work) => work.title))
})

test('keeps focus inside the dialog and supports keyboard navigation', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: firstCardName, exact: true }).click()
  const close = page.getByRole('button', { name: 'Close project' })
  await expect(close).toBeFocused()
  if (featured.length > 1) {
    await page.keyboard.press('Shift+Tab')
    await expect(page.getByRole('button', { name: 'Next', exact: true })).toBeFocused()
    await page.keyboard.press('Tab')
    await expect(close).toBeFocused()
    await page.keyboard.press('ArrowRight')
    await expect(page.locator('#lightbox-title')).toHaveText(featured[1].title)
    await page.keyboard.press('ArrowLeft')
    await expect(page.locator('#lightbox-title')).toHaveText(firstWork.title)
  }
})

test('recreates the video source after a media error and Retry', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: firstCardName, exact: true }).click()
  // Exercise the real browser error handler without depending on native codec/network routing.
  await page.locator('video').dispatchEvent('error')
  await expect(page.locator('video')).toHaveCount(0)
  await page.getByRole('button', { name: 'Retry', exact: true }).click()
  await expect(page.locator('video')).toBeVisible()
  await expect(page.locator('video')).toHaveAttribute('src', getVideoUrl(firstWork, siteConfig)!)
  await expect(page.locator('video')).toHaveAttribute('preload', 'metadata')
  await expect(page.getByRole('button', { name: 'Retry', exact: true })).toHaveCount(0)
})

test('crops card posters consistently and avoids horizontal scroll at mobile width', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')

  const firstImage = page.getByRole('button', { name: firstCardName, exact: true }).locator('img')
  await expect(firstImage).toHaveCSS('object-fit', 'cover')
  const hasHorizontalScroll = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
  )
  expect(hasHorizontalScroll).toBe(false)
  await page.getByRole('button', { name: firstCardName, exact: true }).click()
  expect(await page.getByRole('dialog').evaluate((dialog) => dialog.scrollWidth > innerWidth)).toBe(false)
})

test('uses a real configured poster for both social previews', async ({ page }) => {
  await page.goto('/')
  const imageUrl = new URL(siteConfig.socialImage.url, siteConfig.canonicalUrl).href
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', imageUrl)
  await expect(page.locator('meta[name="twitter:image"]')).toHaveAttribute('content', imageUrl)
  await expect(page.locator('meta[property="og:image:width"]')).toHaveAttribute('content', String(siteConfig.socialImage.width))
  expect(visible.some((work) => work.poster === siteConfig.socialImage.url)).toBe(true)
})
