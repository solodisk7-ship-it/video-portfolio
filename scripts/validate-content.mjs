import { access, readFile, readdir, stat } from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { siteConfig } from '../content/site-config.ts'
import { works } from '../content/works.ts'
import { getDemoVideoConfigErrors } from '../lib/site-config-validation.ts'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const releaseMode = process.argv.includes('--release')
const errors = []
const warnings = []
const allowedRatios = new Set(['16:9', '1:1', '4:5', '9:16'])
const placeholderPattern =
  /example\.com|portfolio owner|your_username|placeholder|change-me|replace-me/i

function report(condition, message, target = errors) {
  if (!condition) target.push(message)
}

function unique(field, values) {
  const duplicates = values.filter((value, index) => values.indexOf(value) !== index)
  report(duplicates.length === 0, `${field} must be unique: ${[...new Set(duplicates)].join(', ')}`)
}

async function localAsset(relativeUrl, extensions, label, maxBytes) {
  report(relativeUrl.startsWith('/'), `${label} must use a root-relative URL: ${relativeUrl}`)
  report(extensions.some((extension) => relativeUrl.endsWith(extension)), `${label} has the wrong extension: ${relativeUrl}`)
  report(!placeholderPattern.test(relativeUrl), `${label} contains placeholder text: ${relativeUrl}`)

  const absolutePath = path.join(root, 'public', relativeUrl.replace(/^\//, ''))
  try {
    await access(absolutePath)
    if (maxBytes) {
      const file = await stat(absolutePath)
      report(
        file.size <= maxBytes,
        `${label} is ${Math.ceil(file.size / 1024)} KB; maximum is ${Math.ceil(maxBytes / 1024)} KB: ${relativeUrl}`,
      )
      if (file.size > 250 * 1024) {
        warnings.push(`${label} exceeds the 250 KB target: ${relativeUrl}`)
      }
    }
  } catch {
    errors.push(`${label} does not exist: ${relativeUrl}`)
  }
}

report(Array.isArray(works) && works.length > 0, 'Catalogue must contain at least one work.')
unique('slug', works.map((work) => work.slug))
unique('order', works.map((work) => work.order))
unique('poster', works.map((work) => work.poster))

for (const message of getDemoVideoConfigErrors(siteConfig)) errors.push(message)
if (siteConfig.demoVideoUrl) {
  report(
    !placeholderPattern.test(siteConfig.demoVideoUrl),
    'siteConfig.demoVideoUrl contains placeholder text.',
  )
}

for (const work of works) {
  const label = `Work “${work.slug}”`
  report(/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(work.slug), `${label} has an invalid slug.`)
  report(Boolean(work.title.trim()), `${label} is missing a title.`)
  report(Boolean(work.category.trim()), `${label} is missing a category.`)
  report(Boolean(work.role.trim()), `${label} is missing a role.`)
  report(Number.isInteger(work.year) && work.year >= 2000 && work.year <= 2100, `${label} has an invalid year.`)
  report(Number.isInteger(work.order) && work.order > 0, `${label} has an invalid order.`)
  report(allowedRatios.has(work.ratio), `${label} has an unsupported aspect ratio.`)
  report(!placeholderPattern.test(JSON.stringify(work)), `${label} contains placeholder content.`)
  await localAsset(work.poster, ['.webp'], `${label} poster`, 400 * 1024)

  if (work.visible) {
    report(Boolean(work.videoKey), `${label} is visible but has no videoKey.`)
  }
  if (work.videoKey) {
    report(
      /-v\d{2,}\.mp4$/i.test(work.videoKey),
      `${label} videoKey must be versioned like slug-v01.mp4.`,
    )
  }
  if (work.captions) {
    await localAsset(work.captions, ['.vtt'], `${label} captions`)
  }
}

const visibleWorks = works.filter((work) => work.visible)
const featuredWorks = visibleWorks.filter((work) => work.featured)
if (siteConfig.contentStatus === 'production') {
  report(featuredWorks.length === 6, `Exactly six visible works must be featured; found ${featuredWorks.length}.`)
} else {
  report(
    featuredWorks.length >= 1 && featuredWorks.length <= 9,
    `Demo content must have one to nine visible featured works; found ${featuredWorks.length}.`,
  )
}

if (releaseMode) {
  report(siteConfig.contentStatus === 'production', 'siteConfig.contentStatus must be “production”.')
  report(!placeholderPattern.test(JSON.stringify(siteConfig)), 'site-config still contains placeholder values.')
  report(/^https:\/\//.test(siteConfig.canonicalUrl), 'canonicalUrl must be HTTPS.')
  report(/^https:\/\//.test(siteConfig.mediaBaseUrl), 'mediaBaseUrl must be an HTTPS object-storage URL.')
  report(visibleWorks.length >= 10 && visibleWorks.length <= 50, `Production catalogue must contain 10–50 visible works; found ${visibleWorks.length}.`)
  unique('visible videoKey', visibleWorks.map((work) => work.videoKey))
  const publicWorks = await readdir(path.join(root, 'public', 'works'))
  report(
    !publicWorks.some((file) => file.toLowerCase().endsWith('.mp4')),
    'Production must not contain MP4 files in public/works; upload them to object storage.',
  )

  try {
    const manifestPath = path.join(root, 'ops', 'release-manifest.json')
    const manifest = JSON.parse(await readFile(manifestPath, 'utf8'))
    report(!placeholderPattern.test(JSON.stringify(manifest)), 'release-manifest contains placeholder values.')
    report(/^[0-9a-f]{7,40}$/i.test(manifest.publishedCommit), 'release-manifest publishedCommit must be a Git SHA.')
    if (process.env.SOURCE_VERSION) {
      report(
        manifest.publishedCommit === process.env.SOURCE_VERSION,
        'release-manifest publishedCommit must match SOURCE_VERSION.',
      )
    }
    const entries = Array.isArray(manifest.items) ? manifest.items : []
    unique('manifest slug', entries.map((item) => item.slug))
    for (const work of visibleWorks) {
      const entry = entries.find((item) => item.slug === work.slug)
      report(Boolean(entry), `release-manifest is missing “${work.slug}”.`)
      if (!entry) continue
      report(entry.objectKey === work.videoKey, `release-manifest objectKey does not match “${work.slug}”.`)
      report(/^[0-9a-f]{64}$/i.test(entry.sha256), `release-manifest checksum is invalid for “${work.slug}”.`)
      report(entry.durationSeconds > 0 && entry.durationSeconds <= 60, `release-manifest duration is invalid for “${work.slug}”.`)
      report(entry.resolution?.width > 0 && entry.resolution?.height > 0, `release-manifest resolution is invalid for “${work.slug}”.`)
      report(Boolean(entry.videoCodec), `release-manifest codec is missing for “${work.slug}”.`)
    }
  } catch (error) {
    errors.push(`release-manifest could not be read: ${error.message}`)
  }
}

for (const warning of warnings) console.warn(`WARN: ${warning}`)
if (errors.length) {
  for (const error of errors) console.error(`ERROR: ${error}`)
  process.exit(1)
}

console.log(
  `Content validation passed (${releaseMode ? 'release' : 'structural'}): ${visibleWorks.length} visible works, ${featuredWorks.length} featured.`,
)
