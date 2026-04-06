import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        body: ['var(--font-body)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      colors: {
        void:    '#070709',
        ink:     '#0d0d12',
        panel:   '#111118',
        raised:  '#18181f',
        edge:    '#1f1f28',
        mist:    '#2a2a36',
        ember:   '#f5a623',
        flame:   '#ff6b35',
        chalk:   '#e8e6e0',
        fog:     '#6b6b7a',
        ghost:   '#3a3a4a',
      },
      animation: {
        'card-in':    'cardIn 0.45s cubic-bezier(0.22,1,0.36,1) both',
        'fade-up':    'fadeUp 0.4s ease-out both',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
        'shimmer':    'shimmer 1.6s linear infinite',
        'slide-down': 'slideDown 0.3s ease-out both',
      },
      keyframes: {
        cardIn: {
          '0%':   { opacity: '0', transform: 'translateY(20px) scale(0.97)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        glowPulse: {
          '0%,100%': { boxShadow: '0 0 20px rgba(245,166,35,0.15)' },
          '50%':     { boxShadow: '0 0 40px rgba(245,166,35,0.35)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-400px 0' },
          '100%': { backgroundPosition: '400px 0' },
        },
        slideDown: {
          '0%':   { opacity: '0', transform: 'translateY(-8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      backgroundImage: {
        'noise': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [],
}

export default config
