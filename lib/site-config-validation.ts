type DemoVideoConfig = {
  contentStatus: 'demo' | 'production'
  demoVideoUrl: string | null
}

export function getDemoVideoConfigErrors(config: DemoVideoConfig) {
  const errors: string[] = []

  if (!config.demoVideoUrl) return errors

  if (config.contentStatus !== 'demo') {
    errors.push('siteConfig.demoVideoUrl must be empty when contentStatus is production.')
  }

  try {
    const url = new URL(config.demoVideoUrl)
    if (url.protocol !== 'https:') {
      errors.push('siteConfig.demoVideoUrl must use HTTPS.')
    }
  } catch {
    errors.push('siteConfig.demoVideoUrl must be a valid absolute URL.')
  }

  return errors
}
