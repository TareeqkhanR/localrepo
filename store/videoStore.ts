'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { VideoMeta } from '@/lib/youtube'

interface VideoStore {
  videos: VideoMeta[]
  addVideo: (v: VideoMeta) => void
  removeVideo: (id: string) => void
  hasVideo: (id: string) => boolean
  reorder: (from: number, to: number) => void
}

export const useVideoStore = create<VideoStore>()(
  persist(
    (set, get) => ({
      videos: [],

      addVideo: (v) =>
        set((s) => ({
          videos: s.videos.some((x) => x.id === v.id)
            ? s.videos
            : [v, ...s.videos],
        })),

      removeVideo: (id) =>
        set((s) => ({ videos: s.videos.filter((v) => v.id !== id) })),

      hasVideo: (id) => get().videos.some((v) => v.id === id),

      reorder: (from, to) =>
        set((s) => {
          const arr = [...s.videos]
          const [item] = arr.splice(from, 1)
          arr.splice(to, 0, item)
          return { videos: arr }
        }),
    }),
    { name: 'yt-vault-videos' }
  )
)
