import type { Work } from '../content/works'

type CatalogueEntry = Pick<Work, 'visible' | 'featured'>

export function getCatalogueVisibilityErrors(works: readonly CatalogueEntry[]) {
  const visible = works.filter((work) => work.visible)
  const errors: string[] = []

  if (!visible.length) errors.push('Catalogue must contain at least one visible work.')
  else if (!visible.some((work) => work.featured)) {
    errors.push('At least one visible work must be featured so the initial grid is not empty.')
  }

  return errors
}

export function getReleaseModeErrors(contentStatus: 'demo' | 'production') {
  return contentStatus === 'production'
    ? []
    : ['Final release is blocked while contentStatus is demo. Use pnpm quality and pnpm build for local demo checks.']
}
