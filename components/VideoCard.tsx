'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useVideoStore } from '@/store/videoStore'
import { Play, Trash2, ExternalLink } from 'lucide-react'
import type { VideoMeta } from '@/lib/youtube'
import { thumbnailFallback } from '@/lib/youtube'
import clsx from 'clsx'

export default function VideoCard({ video, index }: { video: VideoMeta; index: number }) {
  const { removeVideo } = useVideoStore()
  const [imgError, setImgError] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const thumb = imgError ? thumbnailFallback(video.id) : video.thumbnail

  function handleDelete(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    if (confirmDelete) {
      removeVideo(video.id)
    } else {
      setConfirmDelete(true)
      setTimeout(() => setConfirmDelete(false), 2500)
    }
  }

  function handleOpenYouTube(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    window.open(`https://youtube.com/watch?v=${video.id}`, '_blank', 'noopener,noreferrer')
  }

  return (
    <article
      className="animate-card-in"
      style={{ animationDelay: `${Math.min(index * 55, 400)}ms` }}
    >
      <Link
        href={`/watch/${video.id}`}
        className={clsx(
          'group block rounded-2xl overflow-hidden border transition-all duration-300',
          'card-glow border-ghost/30 bg-panel hover:border-ember/30',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember/60'
        )}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => { setHovered(false); setConfirmDelete(false) }}
      >
        <div className="aspect-video-thumb relative overflow-hidden bg-ink">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={thumb}
            alt={video.title}
            onError={() => setImgError(true)}
            className={clsx(
              'w-full h-full object-cover transition-transform duration-500',
              'group-hover:scale-105'
            )}
          />
          <div className="thumbnail-overlay absolute inset-0" />
          <div className={clsx(
            'absolute inset-0 flex items-center justify-center transition-all duration-300',
            hovered ? 'opacity-100' : 'opacity-0'
          )}>
            <div className="w-14 h-14 rounded-full bg-ember/90 flex items-center justify-center backdrop-blur-sm shadow-2xl transition-transform duration-200 group-hover:scale-110">
              <Play size={22} className="text-void fill-void ml-1" />
            </div>
          </div>

          <button
            onClick={handleDelete}
            className={clsx(
              'absolute top-2.5 right-2.5 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg',
              'text-xs font-mono font-medium transition-all duration-200 backdrop-blur-md',
              hovered ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-1',
              confirmDelete
                ? 'bg-flame/80 text-white'
                : 'bg-void/60 text-fog hover:bg-void/80 hover:text-chalk'
            )}
          >
            <Trash2 size={11} />
            {confirmDelete ? 'Confirm?' : 'Remove'}
          </button>

          {/* ✅ button instead of <a> — fixes nested anchor hydration error */}
          <button
            onClick={handleOpenYouTube}
            title="Open on YouTube"
            className={clsx(
              'absolute top-2.5 left-2.5 p-1.5 rounded-lg backdrop-blur-md',
              'transition-all duration-200',
              'bg-void/60 text-fog hover:text-chalk hover:bg-void/80',
              hovered ? 'opacity-100' : 'opacity-0'
            )}
          >
            <ExternalLink size={12} />
          </button>
        </div>

        <div className="px-4 pt-3 pb-4">
          <h3 className={clsx(
            'font-display text-[15px] leading-snug text-chalk',
            'line-clamp-2 group-hover:text-ember transition-colors duration-200'
          )}>
            {video.title}
          </h3>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-xs font-mono text-fog truncate max-w-[80%]">
              {video.channel}
            </span>
            <span className="text-[10px] font-mono text-ghost shrink-0">
              {new Date(video.addedAt).toLocaleDateString('en', { month: 'short', day: 'numeric' })}
            </span>
          </div>
        </div>
      </Link>
    </article>
  )
}