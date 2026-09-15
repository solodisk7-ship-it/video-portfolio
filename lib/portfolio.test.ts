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

    expect(result.featured).toHaveLength(9)
    expect(result.featured.every((work) => work.featured)).toBe(true)
    expect(result.remaining.every((work) => !work.featured)).toBe(true)
    expect(result.visible.map((work) => work.order)).toEqual(
      [...result.visible].map((work) => work.order).sort((a, b) => a - b),
    )
    expect(LOAD_MORE_COUNT).toBe(12)
  })

  it('excludes hidden work and resolves the staged object-storage key', () => {
    expect(getOrderedVisibleWorks(works)).toHaveLength(9)
    expect(getVideoUrl(works[0])).toBe(
      'https://storage.yandexcloud.net/portfolio-nonstoplife26-media/videos/boots-landscape-v01.mp4',
    )
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
