import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { WorksSection } from '@/components/works-section'

describe('WorksSection', () => {
  it('loads no video and shows the staged catalogue without public years', () => {
    render(
      <div id="site-shell">
        <WorksSection />
      </div>,
    )

    expect(document.querySelector('video')).not.toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: /^Open / })).toHaveLength(11)
    expect(screen.queryByRole('button', { name: 'Load More' })).not.toBeInTheDocument()
    expect(screen.queryByText('2026')).not.toBeInTheDocument()
    const landscapePoster = screen
      .getByRole('button', { name: /^Open Boots — Horizontal/ })
      .querySelector('img')
    expect(landscapePoster).toHaveClass('object-cover')
    expect(landscapePoster).toHaveStyle({ objectPosition: '50% 50%' })
    expect(
      screen.getByRole('button', { name: /^Open Sport — Hockey/ }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /^Open Pottery Workshop/ }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /^Open Shoes — Square/ }),
    ).toBeInTheDocument()
  })

  it('shows the AI production note only for the Pottery project', async () => {
    const user = userEvent.setup()
    render(
      <div id="site-shell">
        <WorksSection />
      </div>,
    )

    await user.click(screen.getByRole('button', { name: /^Open Pottery Workshop/ }))
    const dialog = await screen.findByRole('dialog')
    expect(
      within(dialog).getByText(/Graphics, video, music and voice-over were created entirely/),
    ).toBeInTheDocument()

    fireEvent.keyDown(window, { key: 'Escape' })
    await user.click(screen.getByRole('button', { name: /^Open Shoes — Square/ }))
    expect(
      within(await screen.findByRole('dialog')).queryByText(/created entirely with AI tools/),
    ).not.toBeInTheDocument()
  })

  it('keeps arrow keys available to native video controls and retries media errors', async () => {
    const user = userEvent.setup()
    render(
      <div id="site-shell">
        <WorksSection />
      </div>,
    )

    await user.click(screen.getByRole('button', { name: /^Open Boots — Horizontal/ }))
    const dialog = await screen.findByRole('dialog')
    const video = dialog.querySelector('video')
    expect(video).toHaveAttribute('preload', 'metadata')
    expect(video).toHaveAttribute('controlslist', 'nodownload noremoteplayback')
    expect(video).toHaveAttribute('disablepictureinpicture')
    expect(screen.queryByTestId('video-watermark')).not.toBeInTheDocument()

    const contextMenu = new MouseEvent('contextmenu', {
      bubbles: true,
      cancelable: true,
    })
    video!.dispatchEvent(contextMenu)
    expect(contextMenu.defaultPrevented).toBe(true)

    fireEvent.keyDown(video!, { key: 'ArrowRight' })
    expect(within(dialog).getByRole('heading', { name: 'Boots — Horizontal' })).toBeInTheDocument()

    fireEvent.error(video!)
    expect(await screen.findByRole('button', { name: 'Retry' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Retry' }))
    await waitFor(() => expect(dialog.querySelector('video')).toBeInTheDocument())

    fireEvent.keyDown(window, { key: 'ArrowRight' })
    expect(within(dialog).getByRole('heading', { name: 'Boots — Square' })).toBeInTheDocument()

    fireEvent.keyDown(window, { key: 'Escape' })
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})
