export interface VideoMeta {
  id: string
  title: string
  channel: string
  thumbnail: string
  addedAt: number
}

/** Extract YouTube video ID from any URL format or raw ID */
export function extractVideoId(input: string): string | null {
  const trimmed = input.trim()

  // Raw 11-char video ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed

  const patterns = [
    /[?&]v=([a-zA-Z0-9_-]{11})/,
    /youtu\.be\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/live\/([a-zA-Z0-9_-]{11})/,
  ]

  for (const p of patterns) {
    const m = trimmed.match(p)
    if (m) return m[1]
  }
  return null
}

/** Best-quality thumbnail URL for a given video ID */
export function thumbnailUrl(id: string): string {
  return `https://img.youtube.com/vi/${id}/maxresdefault.jpg`
}

export function thumbnailFallback(id: string): string {
  return `https://img.youtube.com/vi/${id}/hqdefault.jpg`
}

/** Fetch video metadata via YouTube oEmbed — no API key required */
export async function fetchVideoMeta(id: string): Promise<VideoMeta> {
  const url = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${id}&format=json`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`oEmbed failed: ${res.status}`)
  const data = await res.json()
  return {
    id,
    title: data.title ?? 'Untitled',
    channel: data.author_name ?? 'Unknown',
    thumbnail: thumbnailUrl(id),
    addedAt: Date.now(),
  }
}
