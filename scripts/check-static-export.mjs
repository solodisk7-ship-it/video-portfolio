import { access, readFile, readdir, stat } from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const out = path.join(root, 'out')
const errors = []

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true })
  return (
    await Promise.all(
      entries.map((entry) => {
        const absolute = path.join(directory, entry.name)
        return entry.isDirectory() ? walk(absolute) : absolute
      }),
    )
  ).flat()
}

for (const required of ['index.html', '_headers', 'robots.txt', 'sitemap.xml']) {
  try {
    await access(path.join(out, required))
  } catch {
    errors.push(`Static export is missing ${required}.`)
  }
}

try {
  const files = await walk(out)
  const htmlFiles = files.filter((file) => file.endsWith('.html'))
  const html = (await Promise.all(htmlFiles.map((file) => readFile(file, 'utf8')))).join('\n')
  if (/\.mp4(?:[?"'])/i.test(html) || /<video\b/i.test(html)) {
    errors.push('Static HTML contains a video source; MP4 must load only after the lightbox opens.')
  }
  if (/placeholder/i.test(html)) {
    errors.push('Static HTML contains placeholder asset references.')
  }
  if (files.some((file) => file.toLowerCase().endsWith('.mp4'))) {
    errors.push('Static export contains a bundled MP4; videos must be served from object storage.')
  }

  for (const file of files.filter((item) => item.endsWith('.webp'))) {
    const info = await stat(file)
    if (info.size > 400 * 1024) {
      errors.push(`Exported poster exceeds 400 KB: ${path.relative(out, file)}.`)
    }
  }
} catch (error) {
  errors.push(`Could not inspect out/: ${error.message}`)
}

if (errors.length) {
  for (const error of errors) console.error(`ERROR: ${error}`)
  process.exit(1)
}

console.log('Static export check passed: no eager MP4 sources and all required files are present.')
