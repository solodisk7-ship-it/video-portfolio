export const dynamic = 'force-static'

export function GET() {
  const release = process.env.SOURCE_VERSION ?? process.env.CF_PAGES_COMMIT_SHA ?? 'local'
  return Response.json({ release })
}
