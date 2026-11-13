import { describe, expect, it } from 'vitest'
import { getCatalogueVisibilityErrors, getReleaseModeErrors } from './catalogue-validation'

describe('catalogue visibility rules', () => {
  it.each([1, 6, 11, 12, 30, 51])('accepts %i visible featured works', (count) => {
    const works = Array.from({ length: count }, () => ({ visible: true, featured: true }))
    expect(getCatalogueVisibilityErrors(works)).toEqual([])
  })

  it('accepts featured works followed by a Load More remainder', () => {
    expect(getCatalogueVisibilityErrors([
      { visible: true, featured: true },
      { visible: true, featured: false },
      { visible: false, featured: true },
    ])).toEqual([])
  })

  it('rejects an empty visible catalogue', () => {
    expect(getCatalogueVisibilityErrors([])).toHaveLength(1)
    expect(getCatalogueVisibilityErrors([{ visible: false, featured: true }])).toHaveLength(1)
  })

  it('does not count hidden featured works toward the initial grid', () => {
    expect(getCatalogueVisibilityErrors([
      { visible: true, featured: false },
      { visible: false, featured: true },
    ])).toHaveLength(1)
  })
})

describe('final release guard', () => {
  it('keeps demo blocked without blocking local checks', () => {
    expect(getReleaseModeErrors('demo')).toEqual([expect.stringContaining('Final release is blocked')])
    expect(getReleaseModeErrors('production')).toEqual([])
  })
})
