'use client'

import { useState, useRef, type FormEvent, type ClipboardEvent } from 'react'
import { extractVideoId, fetchVideoMeta } from '@/lib/youtube'
import { useVideoStore } from '@/store/videoStore'
import { Link2, Loader2, AlertCircle, Sparkles } from 'lucide-react'
import clsx from 'clsx'

type State = 'idle' | 'loading' | 'error' | 'duplicate'

export default function AddVideoInput() {
  const [value, setValue] = useState('')
  const [state, setState] = useState<State>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const { addVideo, hasVideo } = useVideoStore()

  const preview = extractVideoId(value)

  async function submit(raw: string) {
    const id = extractVideoId(raw.trim())
    if (!id) {
      setState('error')
      setErrorMsg("Hmm, that doesn't look like a YouTube URL.")
      return
    }
    if (hasVideo(id)) {
      setState('duplicate')
      setErrorMsg('Already in your vault.')
      return
    }
    setState('loading')
    try {
      const meta = await fetchVideoMeta(id)
      addVideo(meta)
      setValue('')
      setState('idle')
      inputRef.current?.focus()
    } catch {
      setState('error')
      setErrorMsg("Couldn't fetch video info. Is it public?")
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (value.trim()) submit(value)
  }

  // Auto-submit on paste if it looks like a full URL
  function handlePaste(e: ClipboardEvent<HTMLInputElement>) {
    const pasted = e.clipboardData.getData('text')
    if (pasted.includes('youtu')) {
      e.preventDefault()
      setValue(pasted)
      submit(pasted)
    }
  }

  const isErr = state === 'error' || state === 'duplicate'

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div
        className={clsx(
          'input-ring relative flex items-center gap-3 rounded-2xl border px-4 py-3 transition-all duration-300',
          isErr
            ? 'border-flame/40 bg-flame/5'
            : state === 'loading'
            ? 'border-ember/40 bg-ember/5'
            : 'border-ghost/60 bg-raised hover:border-mist'
        )}
      >
        {/* Icon */}
        <div className="shrink-0">
          {state === 'loading' ? (
            <Loader2 size={18} className="text-ember animate-spin" />
          ) : isErr ? (
            <AlertCircle size={18} className="text-flame" />
          ) : (
            <Link2 size={18} className="text-fog" />
          )}
        </div>

        {/* Input */}
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => { setValue(e.target.value); setState('idle') }}
          onPaste={handlePaste}
          placeholder="Paste a YouTube link…"
          autoComplete="off"
          autoFocus
          className={clsx(
            'flex-1 bg-transparent text-chalk text-sm font-body outline-none placeholder:text-ghost/70',
            'caret-ember'
          )}
        />

        {/* Submit button */}
        <button
          type="submit"
          disabled={state === 'loading' || !value.trim()}
          className={clsx(
            'shrink-0 flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-body font-semibold',
            'transition-all duration-200 active:scale-95',
            state === 'loading' || !value.trim()
              ? 'text-ghost cursor-not-allowed'
              : 'bg-ember text-void hover:bg-amber-300'
          )}
        >
          <Sparkles size={12} />
          Add
        </button>
      </div>

      {/* Error / status message */}
      {isErr && (
        <p className="mt-2 text-center text-xs font-mono text-flame/80 animate-slide-down">
          {errorMsg}
        </p>
      )}

      {/* Tiny hint */}
      {state === 'idle' && !value && (
        <p className="mt-3 text-center text-xs font-mono text-ghost/60">
          youtube.com/watch?v=… · youtu.be/… · shorts · live · embeds
        </p>
      )}
    </form>
  )
}
