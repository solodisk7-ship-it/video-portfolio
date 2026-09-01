import { siteConfig } from '@/content/site-config'
import type { Work } from '@/content/works'

export const FEATURED_COUNT = 6
export const LOAD_MORE_COUNT = 12

type VideoSourceConfig = {
  contentStatus: 'demo' | 'production'
  mediaBaseUrl: string
  demoVideoUrl: string | null
}

export function getOrderedVisibleWorks(works: Work[]) {
  return works.filter((work) => work.visible).sort((a, b) => a.order - b.order)
}

export function getInitialWorks(works: Work[]) {
  const visible = getOrderedVisibleWorks(works)
  const featured = visible.filter((work) => work.featured)
  const remaining = visible.filter((work) => !work.featured)
  return { visible, featured, remaining }
}

export function getVideoUrl(work: Work, config: VideoSourceConfig = siteConfig) {
  if (!work.videoKey) return null

  if (config.contentStatus === 'demo' && config.demoVideoUrl) {
    return config.demoVideoUrl
  }

  const base = config.mediaBaseUrl.replace(/\/$/, '')
  const key = work.videoKey.replace(/^\//, '')
  return `${base}/${key}`
}

export function isVideoControlTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false
  return Boolean(
    target.closest('video, audio, input, select, textarea, [contenteditable="true"]'),
  )
}
