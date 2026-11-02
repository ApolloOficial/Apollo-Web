export function sanitizeEmbedUrl(raw: string | undefined): string {
  const value = raw?.trim()

  if (!value) return ''

  try {
    const url = new URL(value)

    return url.protocol === 'https:' ? url.toString() : ''
  } catch {
    return ''
  }
}
