'use client'

import { useState, useEffect } from 'react'
import { Loader2 } from 'lucide-react'
import clsx from 'clsx'

interface VideoPlayerProps {
  videoId: string
  title: string
  autoplay?: boolean
}

export default function VideoPlayer({ videoId, title, autoplay = true }: VideoPlayerProps) {
  const [loaded, setLoaded] = useState(false)

  // reset on video change
  useEffect(() => { setLoaded(false) }, [videoId])

  const src = [
    `https://www.youtube.com/embed/${videoId}`,
    `?autoplay=${autoplay ? 1 : 0}`,
    `&rel=0`,
    `&modestbranding=1`,
    `&color=white`,
    `&iv_load_policy=3`,
  ].join('')

  return (
    <div className="theater-frame w-full relative rounded-xl overflow-hidden bg-ink shadow-2xl shadow-black/60">
      {/* Loader */}
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-ink z-10">
          <div className="flex flex-col items-center gap-3">
            <Loader2 size={28} className="text-ember animate-spin" />
            <span className="text-xs font-mono text-fog">Loading theater…</span>
          </div>
        </div>
      )}

      <iframe
        src={src}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        onLoad={() => setLoaded(true)}
        className={clsx(
          'w-full h-full border-0 transition-opacity duration-500',
          loaded ? 'opacity-100' : 'opacity-0'
        )}
      />
    </div>
  )
}
