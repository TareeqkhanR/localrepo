'use client'

import { useVideoStore } from '@/store/videoStore'
import VideoCard from './VideoCard'
import { Film, ArrowDown } from 'lucide-react'

export default function VideoGrid() {
  const { videos } = useVideoStore()

  if (videos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 px-6 animate-fade-up text-center">
        {/* Icon */}
        <div className="relative mb-8">
          <div className="w-24 h-24 rounded-3xl bg-raised border border-ghost/30 flex items-center justify-center">
            <Film size={36} className="text-ghost" />
          </div>
          <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-xl bg-ember/20 border border-ember/30 flex items-center justify-center">
            <span className="text-ember text-sm">+</span>
          </div>
        </div>

        {/* Copy */}
        <h2 className="font-display text-2xl text-chalk mb-3">
          Your vault is empty
        </h2>
        <p className="text-fog text-sm font-body max-w-xs leading-relaxed mb-8">
          Paste any YouTube URL above and it'll appear here as a beautiful video card.
        </p>

        {/* Arrow pointing up */}
        <div className="flex flex-col items-center gap-2 text-ghost/50 animate-bounce">
          <ArrowDown size={16} className="rotate-180" />
          <span className="text-xs font-mono">paste a link up there</span>
        </div>

        {/* Sample URLs hint */}
        <div className="mt-10 flex flex-wrap justify-center gap-2">
          {[
            'youtu.be/dQw4w9WgXcQ',
            'youtube.com/watch?v=…',
            'youtube.com/shorts/…',
          ].map((hint) => (
            <span
              key={hint}
              className="px-3 py-1.5 rounded-lg bg-raised border border-ghost/20 text-ghost/50 text-xs font-mono"
            >
              {hint}
            </span>
          ))}
        </div>
      </div>
    )
  }

  return (
    <section className="animate-fade-up">
      {/* Count */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-ghost">
            {videos.length} {videos.length === 1 ? 'video' : 'videos'} in vault
          </span>
          <span className="w-1 h-1 rounded-full bg-ghost/40" />
          <span className="text-xs font-mono text-fog">
            sorted by latest
          </span>
        </div>
      </div>

      {/* Grid */}
      <div className="card-stagger grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {videos.map((video, i) => (
          <VideoCard key={video.id} video={video} index={i} />
        ))}
      </div>
    </section>
  )
}
