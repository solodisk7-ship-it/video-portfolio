import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { Work } from '@/content/works'
import { WorksSection } from './works-section'

const { catalogue } = vi.hoisted(() => ({ catalogue: [] as Work[] }))
vi.mock('@/content/works', () => ({ works: catalogue }))
vi.mock('@/components/work-card', () => ({
  WorkCard: ({ work, onOpen }: { work: Work; onOpen: () => void }) => (
    <button onClick={onOpen} aria-label={`Open ${work.title}`}>{work.title}</button>
  ),
}))

function fixtureWork(index: number, featured = true): Work {
  return {
    slug: `work-${index}`, title: `Work ${index}`, category: 'Concept',
    role: 'Video Editing', year: 2026, ratio: '16:9',
    poster: `/works/work-${index}.webp`, videoKey: `videos/work-${index}-v01.mp4`,
    featured, order: index + 1, visible: true,
  }
}

beforeEach(() => { catalogue.splice(0) })

describe('growing demo catalogue regression tests', () => {
  it('shows more than eleven featured cards without changing the component', () => {
    catalogue.push(...Array.from({ length: 13 }, (_, index) => fixtureWork(index)))
    render(<WorksSection />)
    expect(screen.getAllByRole('button', { name: /^Open / })).toHaveLength(13)
    expect(screen.queryByText('13 / 13')).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /Load More/ })).not.toBeInTheDocument()
  })

  it('reveals non-featured works in batches of twelve and keeps hidden work out', async () => {
    const user = userEvent.setup()
    catalogue.push(...Array.from({ length: 30 }, (_, index) => fixtureWork(index, index < 13)))
    catalogue.push({ ...fixtureWork(30), visible: false })
    render(<WorksSection />)
    expect(screen.getAllByRole('button', { name: /^Open / })).toHaveLength(13)
    await user.click(screen.getByRole('button', { name: /Load More/ }))
    expect(screen.getAllByRole('button', { name: /^Open / })).toHaveLength(25)
    await user.click(screen.getByRole('button', { name: /Load More/ }))
    expect(screen.getAllByRole('button', { name: /^Open / })).toHaveLength(30)
    expect(screen.queryByText('30 / 30')).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /Load More/ })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Open Work 30' })).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Open Work 29' }))
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Work 29' })).toBeInTheDocument()
  })
})
