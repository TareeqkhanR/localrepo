'use client'

import { use, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useVideoStore } from '@/store/videoStore'
import VideoPlayer from '@/components/VideoPlayer'
import { fetchVideoMeta, type VideoMeta, thumbnailFallback } from '@/lib/youtube'
import {
  ArrowLeft,
  Vault,
  Play,
  Trash2,
  ExternalLink,
  Calendar,
  User,
} from 'lucide-react'
import clsx from 'clsx'

interface Props { params: Promise<{ videoId: string }> }

export default function WatchPage({ params }: Props) {
  const { videoId } = use(params)
  const router = useRouter()
  const { videos, addVideo, removeVideo, hasVideo } = useVideoStore()

  const storedVideo = videos.find((v) => v.id === videoId)
  const [meta, setMeta] = useState<VideoMeta | null>(storedVideo ?? null)
  const [fetching, setFetching] = useState(!storedVideo)
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({})

  // If not in vault, fetch metadata on-the-fly (for direct URL visits)
  useEffect(() => {
    if (!storedVideo) {
      setFetching(true)
      fetchVideoMeta(videoId)
        .then(setMeta)
        .catch(() => setMeta(null))
        .finally(() => setFetching(false))
    }
  }, [videoId, storedVideo])

  const others = videos.filter((v) => v.id !== videoId)
  const inVault = hasVideo(videoId)

  function handleSaveToVault() {
    if (meta && !inVault) addVideo(meta)
  }

  return (
    <div className="min-h-screen bg-void page-in">
      {/* ── Topbar ─────────────────────────── */}
      <header className="sticky top-0 z-40 border-b border-ghost/15 bg-void/90 backdrop-blur-xl">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 h-14 flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1.5 text-fog hover:text-chalk text-sm font-body transition-colors"
          >
            <ArrowLeft size={15} />
            Back
          </button>

          <span className="text-ghost/30">|</span>

          <Link href="/" className="flex items-center gap-2 group">
            <Vault size={14} className="text-ember" />
            <span className="font-display text-sm text-chalk group-hover:text-ember transition-colors">
              YT Vault
            </span>
          </Link>

          <div className="ml-auto flex items-center gap-2">
            {meta && (
              <a
                href={`https://youtube.com/watch?v=${videoId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-ghost/30 text-fog hover:text-chalk hover:border-mist text-xs font-mono transition-all"
              >
                <ExternalLink size={11} />
                YouTube
              </a>
            )}
            {inVault ? (
              <button
                onClick={() => { removeVideo(videoId); router.push('/') }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-flame/30 bg-flame/5 text-flame hover:bg-flame/10 text-xs font-mono transition-all"
              >
                <Trash2 size={11} />
                Remove
              </button>
            ) : meta ? (
              <button
                onClick={handleSaveToVault}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-ember text-void hover:bg-amber-300 text-xs font-mono font-semibold transition-all active:scale-95"
              >
                + Save to Vault
              </button>
            ) : null}
          </div>
        </div>
      </header>

      {/* ── Main layout ─────────────────────── */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-6">
        <div className="flex gap-6 items-start">

          {/* ── Player column ─────────────────── */}
          <div className="flex-1 min-w-0">
            {/* Player */}
            <VideoPlayer
              videoId={videoId}
              title={meta?.title ?? 'Loading…'}
              autoplay
            />

            {/* Video info below player */}
            {fetching ? (
              <div className="mt-5 space-y-3 animate-pulse">
                <div className="h-7 bg-raised rounded-lg w-3/4" />
                <div className="h-4 bg-raised rounded-lg w-1/4" />
              </div>
            ) : meta ? (
              <div className="mt-5 animate-fade-up">
                <h1 className="font-display text-2xl sm:text-3xl text-chalk leading-snug mb-3">
                  {meta.title}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-sm">
                  <div className="flex items-center gap-1.5 text-fog font-mono">
                    <User size={13} />
                    {meta.channel}
                  </div>
                  <div className="flex items-center gap-1.5 text-ghost font-mono text-xs">
                    <Calendar size={11} />
                    Added {new Date(meta.addedAt).toLocaleDateString('en', {
                      year: 'numeric', month: 'long', day: 'numeric',
                    })}
                  </div>
                </div>

                {/* Divider */}
                <div className="mt-5 border-t border-ghost/20 pt-5">
                  <p className="text-xs font-mono text-ghost/50">
                    video id: <span className="text-fog">{videoId}</span>
                    <span className="mx-2">·</span>
                    <a
                      href={`https://youtube.com/watch?v=${videoId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-ember/60 hover:text-ember underline underline-offset-2"
                    >
                      open on YouTube
                    </a>
                  </p>
                </div>
              </div>
            ) : (
              <div className="mt-5 p-4 rounded-xl border border-flame/20 bg-flame/5">
                <p className="text-flame text-sm font-mono">
                  Couldn't load video metadata. The video may be private or unavailable.
                </p>
              </div>
            )}
          </div>

          {/* ── Sidebar — other vault videos ─── */}
          {others.length > 0 && (
            <aside className="w-80 xl:w-96 shrink-0 hidden lg:block">
              <div className="sticky top-20">
                <h2 className="text-xs font-mono text-ghost/60 uppercase tracking-widest mb-4 px-1">
                  Also in vault
                </h2>
                <div className="space-y-2 max-h-[calc(100vh-10rem)] overflow-y-auto pr-1">
                  {others.map((v) => (
                    <Link
                      key={v.id}
                      href={`/watch/${v.id}`}
                      className={clsx(
                        'flex gap-3 p-2.5 rounded-xl border transition-all duration-200 group',
                        'border-ghost/20 bg-panel hover:bg-raised hover:border-ember/25'
                      )}
                    >
                      {/* Mini thumb */}
                      <div className="relative shrink-0 w-32 aspect-video-thumb rounded-lg overflow-hidden bg-ink">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={imgErrors[v.id] ? thumbnailFallback(v.id) : v.thumbnail}
                          alt={v.title}
                          onError={() => setImgErrors((p) => ({ ...p, [v.id]: true }))}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-void/40">
                          <Play size={16} className="text-ember fill-ember" />
                        </div>
                      </div>

                      {/* Meta */}
                      <div className="flex-1 min-w-0 flex flex-col justify-center">
                        <p className="text-xs font-body font-medium text-chalk line-clamp-2 leading-snug group-hover:text-ember transition-colors">
                          {v.title}
                        </p>
                        <p className="text-[10px] font-mono text-ghost mt-1 truncate">
                          {v.channel}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </aside>
          )}
        </div>
      </div>
    </div>
  )
}
