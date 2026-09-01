export default async function globalTeardown() {
  try {
    await fetch('http://127.0.0.1:4173/__shutdown__')
  } catch {
    // The server may already be gone after a failed launch.
  }
}
