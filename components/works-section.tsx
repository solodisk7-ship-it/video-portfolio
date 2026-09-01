'use client'

import { useMemo, useState } from 'react'
import { ArrowDown } from 'lucide-react'
import { works } from '@/content/works'
import { getInitialWorks, LOAD_MORE_COUNT } from '@/lib/portfolio'
import { WorkCard } from '@/components/work-card'
import { WorkLightbox } from '@/components/work-lightbox'

export function WorksSection() {
  const { visible, featured, remaining } = useMemo(
    () => getInitialWorks(works),
    [],
  )
  const [revealedCount, setRevealedCount] = useState(0)
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const displayedWorks = [
    ...featured,
    ...remaining.slice(0, revealedCount),
  ]
  const hasMore = displayedWorks.length < visible.length

  return (
    <section
      id="work"
      className="mx-auto w-full max-w-6xl scroll-mt-24 px-6 md:px-10"
    >
      <div className="flex items-baseline justify-between border-t border-border pt-6">
        <h2 className="font-mono text-xs uppercase tracking-[0.12em] text-muted-foreground">
          Selected Work
        </h2>
        <p
          className="font-mono text-xs tracking-[0.12em] text-muted-foreground"
          aria-live="polite"
        >
          {String(displayedWorks.length).padStart(2, '0')} /{' '}
          {String(visible.length).padStart(2, '0')}
        </p>
      </div>

      <div
        id="work-grid"
        className="mt-8 grid grid-cols-1 items-start gap-x-10 gap-y-12 md:mt-12 md:grid-cols-[repeat(2,minmax(0,1fr))] lg:gap-x-14 lg:gap-y-16"
      >
        {displayedWorks.map((work, index) => (
          <WorkCard
            key={work.slug}
            work={work}
            priority={index < 2}
            onOpen={() => setOpenIndex(index)}
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
          onClose={() => setOpenIndex(null)}
          onNavigate={setOpenIndex}
        />
      )}
    </section>
  )
}
