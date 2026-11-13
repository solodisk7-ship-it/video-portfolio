'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowDown } from 'lucide-react'
import { works, type WorkDirection } from '@/content/works'
import { getInitialWorks, LOAD_MORE_COUNT } from '@/lib/portfolio'
import { WorkCard } from '@/components/work-card'
import { WorkLightbox } from '@/components/work-lightbox'

const filters = ['All', 'Video Editing', 'AI Video', 'Motion Design'] as const
type WorkFilter = 'All' | WorkDirection

export function WorksSection() {
  const [filter, setFilter] = useState<WorkFilter>('All')
  const { visible, featured, remaining } = useMemo(
    () => getInitialWorks(works.filter((work) =>
      filter === 'All' || (work.direction ?? 'Video Editing') === filter)),
    [filter],
  )
  const [revealedCount, setRevealedCount] = useState(0)
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const historyOwner = useRef<string | null>(null)
  const closing = useRef(false)
  const projectOpen = useRef(false)
  const opener = useRef<HTMLElement | null>(null)
  const catalogueScroll = useRef(0)

  const displayedWorks = [
    ...featured,
    ...remaining.slice(0, revealedCount),
  ]
  const hasMore = displayedWorks.length < visible.length

  useEffect(() => {
    historyOwner.current = crypto.randomUUID()
    function onPopState(event: PopStateEvent) {
      closing.current = false
      const entry = event.state?.portfolioProject
      if (entry?.owner === historyOwner.current) {
        projectOpen.current = true
        setFilter(entry.filter ?? 'All')
        setRevealedCount(entry.revealedCount ?? 0)
        setOpenIndex(entry.index)
      } else {
        const restoreCatalogue = projectOpen.current
        projectOpen.current = false
        setOpenIndex(null)
        if (!restoreCatalogue) return
        requestAnimationFrame(() => {
          opener.current?.focus({ preventScroll: true })
          window.scrollTo(0, catalogueScroll.current)
        })
      }
    }
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  function openProject(index: number) {
    if (closing.current) return
    opener.current = document.activeElement as HTMLElement | null
    catalogueScroll.current = window.scrollY
    projectOpen.current = true
    window.history.pushState({
      ...window.history.state,
      portfolioProject: { owner: historyOwner.current, index, filter, revealedCount },
    }, '')
    setOpenIndex(index)
  }

  function closeProject() {
    if (closing.current) return
    const entry = window.history.state?.portfolioProject
    if (entry?.owner === historyOwner.current) {
      closing.current = true
      setOpenIndex(null)
      window.history.back()
    } else {
      setOpenIndex(null)
    }
  }

  function navigateProject(index: number) {
    if (closing.current) return
    window.history.replaceState({
      ...window.history.state,
      portfolioProject: { owner: historyOwner.current, index, filter, revealedCount },
    }, '')
    setOpenIndex(index)
  }

  return (
    <section
      id="work"
      className="mx-auto w-full max-w-6xl scroll-mt-24 px-6 md:px-10"
    >
      <div className="flex items-baseline justify-between border-t border-border pt-6">
        <h2 className="font-mono text-xs uppercase tracking-[0.12em] text-muted-foreground">
          Selected Work
        </h2>
      </div>

      <div role="group" aria-label="Filter works by direction" className="mt-6 flex flex-wrap gap-x-6 gap-y-2 md:gap-x-8">
        {filters.map((item) => (
          <button
            key={item}
            type="button"
            aria-pressed={filter === item}
            aria-controls="work-grid"
            onClick={() => { setFilter(item); setRevealedCount(0) }}
            className={`min-h-11 cursor-pointer border-b px-1 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring md:text-base ${filter === item ? 'border-foreground text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
          >
            {item}
          </button>
        ))}
      </div>

      <div
        id="work-grid"
        className="mt-8 grid grid-cols-1 items-start gap-x-8 gap-y-12 md:mt-12 md:grid-cols-2 lg:grid-cols-3 lg:gap-y-14"
      >
        {displayedWorks.map((work, index) => (
          <WorkCard
            key={work.slug}
            work={work}
            priority={index < 2}
            onOpen={() => openProject(index)}
          />
        ))}
      </div>

      {hasMore && (
        <div className="mt-12 flex justify-center md:mt-16">
          <button
            type="button"
            onClick={() =>
              setRevealedCount((count) => count + LOAD_MORE_COUNT)
            }
            className="flex min-h-11 cursor-pointer items-center gap-3 px-3 font-mono text-xs uppercase tracking-[0.12em] text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
            aria-controls="work-grid"
          >
            Load More
            <ArrowDown className="size-4" strokeWidth={1.5} aria-hidden="true" />
          </button>
        </div>
      )}

      {openIndex !== null && (
        <WorkLightbox
          works={displayedWorks}
          index={openIndex}
          onClose={closeProject}
          onNavigate={navigateProject}
        />
      )}
    </section>
  )
}
