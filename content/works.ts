export type AspectRatio = '16:9' | '1:1' | '4:5' | '9:16'

export type Work = {
  slug: string
  title: string
  category: string
  role: string
  year: number
  ratio: AspectRatio
  poster: string
  videoKey?: string
  captions?: string
  featured: boolean
  order: number
  visible: boolean
}

/**
 * Demo catalogue inherited from the V0 prototype.
 * Replace every entry and switch siteConfig.contentStatus to "production"
 * before running `pnpm release:prepare`.
 */
export const works: Work[] = [
  { slug: 'halcyon', title: 'Halcyon', category: 'Brand Film', role: 'Director & Editor', year: 2025, ratio: '16:9', poster: '/works/halcyon.webp', videoKey: 'xionic2-demo-v01.mp4', featured: true, order: 1, visible: true },
  { slug: 'nocturne', title: 'Nocturne', category: 'Music Video', role: 'Editor', year: 2025, ratio: '4:5', poster: '/works/nocturne.webp', videoKey: 'xionic2-demo-v01.mp4', featured: true, order: 2, visible: true },
  { slug: 'field-notes', title: 'Field Notes', category: 'Documentary', role: 'Motion Design', year: 2024, ratio: '16:9', poster: '/works/field-notes.webp', videoKey: 'xionic2-demo-v01.mp4', featured: true, order: 3, visible: true },
  { slug: 'sable', title: 'Sable', category: 'Product Launch', role: 'Motion Design', year: 2024, ratio: '1:1', poster: '/works/sable.webp', videoKey: 'xionic2-demo-v01.mp4', featured: true, order: 4, visible: true },
  { slug: 'vertical-cut', title: 'Vertical Cut', category: 'Social Campaign', role: 'Editor', year: 2024, ratio: '9:16', poster: '/works/vertical-cut.webp', videoKey: 'xionic2-demo-v01.mp4', featured: true, order: 5, visible: true },
  { slug: 'atlas-type', title: 'Atlas Type', category: 'Title Sequence', role: 'Motion Design', year: 2023, ratio: '16:9', poster: '/works/atlas-type.webp', videoKey: 'xionic2-demo-v01.mp4', featured: true, order: 6, visible: true },
  { slug: 'low-tide', title: 'Low Tide', category: 'Short Film', role: 'Colour & Edit', year: 2023, ratio: '4:5', poster: '/works/low-tide.webp', videoKey: 'xionic2-demo-v01.mp4', featured: false, order: 7, visible: true },
  { slug: 'signal', title: 'Signal', category: 'Broadcast ID', role: 'Motion Design', year: 2023, ratio: '16:9', poster: '/works/signal.webp', videoKey: 'xionic2-demo-v01.mp4', featured: false, order: 8, visible: true },
  { slug: 'paper-weight', title: 'Paper Weight', category: 'Editorial Loop', role: 'Animation', year: 2022, ratio: '1:1', poster: '/works/paper-weight.webp', videoKey: 'xionic2-demo-v01.mp4', featured: false, order: 9, visible: true },
  { slug: 'runner', title: 'Runner', category: 'Sports Spot', role: 'Editor', year: 2022, ratio: '9:16', poster: '/works/runner.webp', videoKey: 'xionic2-demo-v01.mp4', featured: false, order: 10, visible: true },
  { slug: 'terrace', title: 'Terrace', category: 'Architecture Reel', role: 'Editor', year: 2022, ratio: '16:9', poster: '/works/terrace.webp', videoKey: 'xionic2-demo-v01.mp4', featured: false, order: 11, visible: true },
  { slug: 'static-bloom', title: 'Static Bloom', category: 'Experimental', role: 'Motion Design', year: 2021, ratio: '4:5', poster: '/works/static-bloom.webp', videoKey: 'xionic2-demo-v01.mp4', featured: false, order: 12, visible: true },
]
