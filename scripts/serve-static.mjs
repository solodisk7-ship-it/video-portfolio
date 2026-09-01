import { createReadStream } from 'node:fs'
import { stat } from 'node:fs/promises'
import { createServer } from 'node:http'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'out')
const host = process.env.HOST || '127.0.0.1'
const port = Number(process.env.PORT || 4173)
const mimeTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.mp4': 'video/mp4',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain; charset=utf-8',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
  '.xml': 'application/xml; charset=utf-8',
}

function sendFile(request, response, file, size) {
  const contentType =
    mimeTypes[path.extname(file).toLowerCase()] || 'application/octet-stream'
  const range = request.headers.range
  response.setHeader('Content-Type', contentType)
  response.setHeader('Accept-Ranges', 'bytes')

  if (range) {
    const match = /^bytes=(\d*)-(\d*)$/.exec(range)
    if (!match) {
      response.writeHead(416, { 'Content-Range': 'bytes */' + size })
      response.end()
      return
    }
    const start = match[1] ? Number(match[1]) : 0
    const end = match[2] ? Math.min(Number(match[2]), size - 1) : size - 1
    if (start > end || start >= size) {
      response.writeHead(416, { 'Content-Range': 'bytes */' + size })
      response.end()
      return
    }
    response.writeHead(206, {
      'Content-Length': end - start + 1,
      'Content-Range': 'bytes ' + start + '-' + end + '/' + size,
    })
    if (request.method === 'HEAD') response.end()
    else createReadStream(file, { start, end }).pipe(response)
    return
  }

  response.writeHead(200, { 'Content-Length': size })
  if (request.method === 'HEAD') response.end()
  else createReadStream(file).pipe(response)
}

const server = createServer(async (request, response) => {
  try {
    const pathname = decodeURIComponent(
      new URL(request.url || '/', 'http://local').pathname,
    )
    if (pathname === '/__shutdown__') {
      response.writeHead(204)
      response.end()
      setImmediate(() => server.close())
      return
    }
    const relative = pathname === '/' ? 'index.html' : pathname.replace(/^\/+/, '')
    let file = path.resolve(root, relative)
    if (file !== root && !file.startsWith(root + path.sep)) {
      response.writeHead(403).end()
      return
    }

    let info = await stat(file)
    if (info.isDirectory()) {
      file = path.join(file, 'index.html')
      info = await stat(file)
    }
    sendFile(request, response, file, info.size)
  } catch {
    response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' })
    response.end('Not found')
  }
})

server.listen(port, host, () => {
  console.log('Static portfolio available at http://' + host + ':' + port)
})
