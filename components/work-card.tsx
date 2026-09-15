'use client'

import { Play } from 'lucide-react'
import Image from 'next/image'
import type { Work } from '@/content/works'

type WorkCardProps = {
  work: Work
  priority?: boolean
  onOpen: () => void
}

export function WorkCard({ work, priority = false, onOpen }: WorkCardProps) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="group flex w-full cursor-pointer flex-col text-left focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-ring"
      aria-label={`Open ${work.title} — ${work.category}`}
    >
      <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden bg-background">
        <Image
          src={work.poster}
          alt=""
          fill
          sizes="(min-width: 1280px) 336px, (min-width: 1024px) 30vw, (min-width: 768px) 45vw, 100vw"
          style={{ objectPosition: work.posterPosition ?? '50% 50%' }}
          className="absolute inset-0 h-full w-full object-cover transition-opacity duration-200 group-hover:opacity-80"
          preload={priority}
        />
        {work.videoKey && (
          <span
            className="absolute right-3 bottom-3 grid size-9 place-items-center border border-foreground/15 bg-background/90 text-foreground backdrop-blur-sm transition-colors group-hover:border-foreground/40"
            aria-hidden="true"
          >
            <Play
              className="ml-0.5 size-3"
              fill="currentColor"
              strokeWidth={1.25}
            />
          </span>
        )}
      </div>

      <div className="mt-4 flex min-h-14 flex-col gap-1">
        <h3 className="text-base leading-snug font-medium tracking-tight text-foreground">
          {work.title}
        </h3>
        <p className="font-mono text-xs uppercase tracking-[0.12em] text-muted-foreground">
          {work.category} &middot; {work.role}
        </p>
      </div>
    </button>
  )
}
