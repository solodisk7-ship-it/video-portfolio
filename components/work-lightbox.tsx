'use client'

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react'
import { createPortal } from 'react-dom'
import { ArrowLeft, ArrowRight, RotateCcw, X } from 'lucide-react'
import type { Work } from '@/content/works'
import { getVideoUrl, isVideoControlTarget } from '@/lib/portfolio'

type WorkLightboxProps = {
  works: Work[]
  index: number
  onClose: () => void
  onNavigate: (nextIndex: number) => void
}

function getFocusable(container: HTMLElement) {
  return Array.from(
    container.querySelectorAll<HTMLElement>(
      'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), video[controls], [tabindex]:not([tabindex="-1"])',
    ),
  )
}

function releaseVideo(video: HTMLVideoElement | null) {
  if (!video) return
  video.pause()
  video.removeAttribute('src')
  video.load()
}

const subscribeToClient = () => () => undefined

export function WorkLightbox({ works, index, onClose, onNavigate }: WorkLightboxProps) {
  const work = works[index]
  const isClient = useSyncExternalStore(
    subscribeToClient,
    () => true,
    () => false,
  )
  const [failedSlug, setFailedSlug] = useState<string | null>(null)
  const [retryNonce, setRetryNonce] = useState(0)
  const dialogRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const videoUrl = getVideoUrl(work)
  const mediaError = failedSlug === work.slug

  const goPrev = useCallback(() => {
    if (works.length < 2) return
    releaseVideo(videoRef.current)
    setFailedSlug(null)
    setRetryNonce(0)
    onNavigate((index - 1 + works.length) % works.length)
  }, [index, works.length, onNavigate])

  const goNext = useCallback(() => {
    if (works.length < 2) return
    releaseVideo(videoRef.current)
    setFailedSlug(null)
    setRetryNonce(0)
    onNavigate((index + 1) % works.length)
  }, [index, works.length, onNavigate])

  useEffect(() => {
    if (!isClient) return

    const previousFocus = document.activeElement as HTMLElement | null
    const scrollY = window.scrollY
    const previousOverflow = document.body.style.overflow
    const previousPaddingRight = document.body.style.paddingRight
    const shell = document.getElementById('site-shell')
    const shellWasInert = shell?.hasAttribute('inert') ?? false
    const scrollbar = window.innerWidth - document.documentElement.clientWidth

    shell?.setAttribute('inert', '')
    document.body.style.overflow = 'hidden'
    if (scrollbar > 0) document.body.style.paddingRight = `${scrollbar}px`
    closeRef.current?.focus({ preventScroll: true })
    const mountedVideo = videoRef.current

    return () => {
      releaseVideo(mountedVideo)
      if (!shellWasInert) shell?.removeAttribute('inert')
      document.body.style.overflow = previousOverflow
      document.body.style.paddingRight = previousPaddingRight
      previousFocus?.focus({ preventScroll: true })
      window.scrollTo(0, scrollY)
    }
  }, [isClient])

  useEffect(() => {
    const video = videoRef.current
    return () => releaseVideo(video)
  }, [index, retryNonce])

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const dialog = dialogRef.current

      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
        return
      }

      const preserveNativeControls = isVideoControlTarget(event.target)
      if (event.key === 'ArrowLeft' && !preserveNativeControls) {
        event.preventDefault()
        goPrev()
        return
      }
      if (event.key === 'ArrowRight' && !preserveNativeControls) {
        event.preventDefault()
        goNext()
        return
      }

      if (event.key !== 'Tab' || !dialog) return
      const focusable = getFocusable(dialog)
      if (!focusable.length) {
        event.preventDefault()
        return
      }

      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [goNext, goPrev, onClose])

  if (!isClient) return null

  const portrait = work.ratio === '9:16' || work.ratio === '4:5'
  const mediaHeight = portrait
    ? 'max-h-[56vh] md:max-h-[62vh]'
    : 'max-h-[50vh] md:max-h-[58vh]'

  return createPortal(
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="lightbox-title"
      aria-describedby="lightbox-meta"
      className="fixed inset-0 z-50 overflow-y-auto bg-background"
    >
      <div className="mx-auto flex min-h-full max-w-6xl flex-col px-6 py-4 md:px-10 md:py-6">
        <div className="flex items-center justify-between">
          <p className="font-mono text-xs tracking-[0.12em] text-muted-foreground">
            {String(index + 1).padStart(2, '0')} /{' '}
            {String(works.length).padStart(2, '0')}
          </p>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close project"
            className="-mr-2 flex min-h-11 cursor-pointer items-center gap-2 px-2 font-mono text-xs uppercase tracking-[0.12em] text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            Close <X className="size-4" strokeWidth={1.5} aria-hidden="true" />
          </button>
        </div>

        <div className="flex flex-1 flex-col justify-center py-6 md:py-8">
          <div className="flex min-h-0 items-center justify-center">
            {videoUrl && !mediaError ? (
              <div className="inline-flex max-w-full items-center justify-center">
                <video
                  key={`${work.slug}-${retryNonce}`}
                  ref={videoRef}
                  src={videoUrl}
                  poster={work.poster}
                  controls
                  controlsList="nodownload noremoteplayback"
                  disablePictureInPicture
                  playsInline
                  preload="metadata"
                  onContextMenu={(event) => event.preventDefault()}
                  onError={() => setFailedSlug(work.slug)}
                  className={`${mediaHeight} h-auto w-auto max-w-full object-contain`}
                >
                  {work.captions && (
                    <track
                      kind="captions"
                      src={work.captions}
                      srcLang="en"
                      label="English"
                      default
                    />
                  )}
                </video>
              </div>
            ) : mediaError ? (
              <div className="flex min-h-64 w-full max-w-xl flex-col items-center justify-center gap-5 border border-border px-6 text-center">
                <p className="text-sm leading-relaxed text-muted-foreground">
                  The video could not be loaded. Check your connection and try again.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setFailedSlug(null)
                    setRetryNonce((nonce) => nonce + 1)
                  }}
                  className="flex min-h-11 cursor-pointer items-center gap-2 px-3 font-mono text-xs uppercase tracking-[0.12em] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                >
                  <RotateCcw className="size-4" strokeWidth={1.5} aria-hidden="true" />
                  Retry
                </button>
              </div>
            ) : (
              // Native img preserves the unknown intrinsic ratio for poster-only entries.
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={work.poster}
                alt={`Still frame from ${work.title}`}
                className={`${mediaHeight} h-auto w-auto max-w-full object-contain`}
              />
            )}
          </div>
        </div>

        <div className="border-t border-border pt-5 md:grid md:grid-cols-2 md:gap-20">
          <div className="flex flex-col gap-2">
            <h2
              id="lightbox-title"
              className="text-2xl leading-tight font-medium tracking-tight md:text-3xl"
            >
              {work.title}
            </h2>
            <p
              id="lightbox-meta"
              className="font-mono text-xs uppercase tracking-[0.12em] text-muted-foreground"
            >
              {work.category} &middot; {work.role}
            </p>
          </div>
          <div className="mt-5 flex items-center gap-2 md:mt-0 md:justify-end">
            <button
              type="button"
              onClick={goPrev}
              disabled={works.length < 2}
              className="flex min-h-11 cursor-pointer items-center gap-2 px-3 font-mono text-xs uppercase tracking-[0.12em] text-muted-foreground transition-colors hover:text-foreground disabled:cursor-default disabled:opacity-30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              <ArrowLeft className="size-4" strokeWidth={1.5} aria-hidden="true" />
              Previous
            </button>
            <button
              type="button"
              onClick={goNext}
              disabled={works.length < 2}
              className="flex min-h-11 cursor-pointer items-center gap-2 px-3 font-mono text-xs uppercase tracking-[0.12em] text-muted-foreground transition-colors hover:text-foreground disabled:cursor-default disabled:opacity-30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              Next
              <ArrowRight className="size-4" strokeWidth={1.5} aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  )
}
