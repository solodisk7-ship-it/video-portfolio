import { describe, expect, it } from 'vitest'
import { works } from '@/content/works'
import {
  getInitialWorks,
  getOrderedVisibleWorks,
  getVideoUrl,
  LOAD_MORE_COUNT,
} from '@/lib/portfolio'

describe('portfolio catalogue helpers', () => {
  it('returns the visible featured works before the ordered remainder', () => {
    const result = getInitialWorks(works)

    expect(result.featured).toHaveLength(works.filter((work) => work.visible && work.featured).length)
    expect(result.featured.every((work) => work.featured)).toBe(true)
    expect(result.remaining.every((work) => !work.featured)).toBe(true)
    expect(result.visible.map((work) => work.order)).toEqual(
      [...result.visible].map((work) => work.order).sort((a, b) => a - b),
    )
    expect(LOAD_MORE_COUNT).toBe(12)
  })

  it('excludes hidden work and resolves the staged object-storage key', () => {
    expect(getOrderedVisibleWorks(works)).toHaveLength(works.filter((work) => work.visible).length)
    expect(getVideoUrl(works[0])).toBe(
      'https://storage.yandexcloud.net/portfolio-nonstoplife26-media/videos/boots-landscape-v01.mp4',
    )
  })

  it('supports an expanding catalogue without a featured cap and preserves input order', () => {
    const entries = Array.from({ length: 30 }, (_, index) => ({
      ...works[0], slug: `test-work-${index}`, order: 30 - index,
      visible: index !== 29, featured: index < 13,
    }))
    const originalOrder = entries.map((work) => work.order)
    const result = getInitialWorks(entries)
    expect(result.visible).toHaveLength(29)
    expect(result.featured).toHaveLength(13)
    expect(result.remaining).toHaveLength(16)
    expect(result.featured.map((work) => work.order)).toEqual(
      [...result.featured].map((work) => work.order).sort((a, b) => a - b),
    )
    expect(entries.map((work) => work.order)).toEqual(originalOrder)
  })

  it('ignores the demo override when resolving a production media key', () => {
    expect(
      getVideoUrl(works[0], {
        contentStatus: 'production',
        mediaBaseUrl: 'https://media.example.test/',
        demoVideoUrl: 'https://demo.example.test/test.mp4',
      }),
    ).toBe('https://media.example.test/videos/boots-landscape-v01.mp4')
  })
})
