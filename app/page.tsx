import AddVideoInput from '@/components/AddVideoInput'
import VideoGrid from '@/components/VideoGrid'
import { Vault } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-void page-in">
      {/* ── Header ─────────────────────────────── */}
      <header className="sticky top-0 z-40 border-b border-ghost/20 bg-void/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="w-7 h-7 rounded-lg bg-ember/20 border border-ember/30 flex items-center justify-center transition-all group-hover:bg-ember/30">
              <Vault size={14} className="text-ember" />
            </div>
            <span className="font-display text-base text-chalk tracking-tight">
              YT <span className="text-ember">Vault</span>
            </span>
          </a>

          {/* Compact input in header for non-hero scroll position */}
          <div className="hidden md:block flex-1 max-w-md">
            <AddVideoInput />
          </div>

          {/* Right side count */}
          <div className="shrink-0 text-xs font-mono text-ghost hidden sm:block">
            private · local · yours
          </div>
        </div>
      </header>

      {/* ── Hero ───────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-20 pb-12">
        <div className="text-center mb-14">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-ember/20 bg-ember/5 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-ember animate-pulse" />
            <span className="text-xs font-mono text-ember/80">No account. No tracking. Just videos.</span>
          </div>

          {/* Headline */}
          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl text-chalk leading-none mb-4">
            Your private<br />
            <em className="text-ember not-italic">video theater.</em>
          </h1>
          <p className="text-fog text-base font-body max-w-md mx-auto leading-relaxed">
            Drop YouTube links. They become beautiful cards. Click to watch in cinema mode.
          </p>

          {/* Main input */}
          <div className="mt-10 max-w-xl mx-auto">
            <AddVideoInput />
          </div>
        </div>

        {/* ── Video Grid ─────────────────────────── */}
        <VideoGrid />
      </div>

      {/* ── Footer ─────────────────────────────── */}
      <footer className="border-t border-ghost/10 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          <span className="text-xs font-mono text-ghost/40">
            YT Vault · everything stays in your browser
          </span>
          <span className="text-xs font-mono text-ghost/30">
            ← saved locally via localStorage
          </span>
        </div>
      </footer>
    </div>
  )
}
