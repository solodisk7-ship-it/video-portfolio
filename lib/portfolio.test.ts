import { describe, expect, it } from 'vitest'
import { works } from '@/content/works'
import {
  getInitialWorks,
  getOrderedVisibleWorks,
  getVideoUrl,
  LOAD_MORE_COUNT,
} from '@/lib/portfolio'

describe('portfolio catalogue helpers', () => {
  it('returns six featured works before the ordered remainder', () => {
    const result = getInitialWorks(works)

    expect(result.featured).toHaveLength(6)
    expect(result.featured.every((work) => work.featured)).toBe(true)
    expect(result.remaining.every((work) => !work.featured)).toBe(true)
    expect(result.visible.map((work) => work.order)).toEqual(
      [...result.visible].map((work) => work.order).sort((a, b) => a - b),
    )
    expect(LOAD_MORE_COUNT).toBe(12)
  })

  it('excludes hidden work and uses the remote demo video override', () => {
    const hidden = { ...works[0], visible: false }
    expect(getOrderedVisibleWorks([hidden])).toHaveLength(0)
    expect(getVideoUrl(works[0])).toBe(
      'https://storage.yandexcloud.net/portfolio-nonstoplife26-media/xionic2.mp4.mp4',
    )
  })

  it('ignores the demo override when resolving a production media key', () => {
    expect(
      getVideoUrl(works[0], {
        contentStatus: 'production',
        mediaBaseUrl: 'https://media.example.test/videos/',
        demoVideoUrl: 'https://demo.example.test/test.mp4',
      }),
    ).toBe('https://media.example.test/videos/xionic2-demo-v01.mp4')
  })
})
