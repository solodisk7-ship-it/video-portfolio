import { describe, expect, it } from 'vitest'
import { getDemoVideoConfigErrors } from '@/lib/site-config-validation'

describe('demo video configuration validation', () => {
  it('accepts an HTTPS demo override while content is demo', () => {
    expect(
      getDemoVideoConfigErrors({
        contentStatus: 'demo',
        demoVideoUrl: 'https://storage.example.test/test.mp4',
      }),
    ).toEqual([])
  })

  it('rejects a demo override in production', () => {
    expect(
      getDemoVideoConfigErrors({
        contentStatus: 'production',
        demoVideoUrl: 'https://storage.example.test/test.mp4',
      }),
    ).toContain('siteConfig.demoVideoUrl must be empty when contentStatus is production.')
  })

  it('rejects an insecure demo URL', () => {
    expect(
      getDemoVideoConfigErrors({
        contentStatus: 'demo',
        demoVideoUrl: 'http://storage.example.test/test.mp4',
      }),
    ).toContain('siteConfig.demoVideoUrl must use HTTPS.')
  })
})
