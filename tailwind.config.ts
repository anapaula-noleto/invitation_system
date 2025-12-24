import type { Config } from 'tailwindcss'

export default {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-display)', 'serif'],
        heading: ['var(--font-heading)', 'sans-serif'],
        body: ['var(--font-body)', 'sans-serif'],
      },
      colors: {
        // Deep midnight blues
        midnight: {
          50: '#e8eaf0',
          100: '#c5c9d9',
          200: '#9ea6c0',
          300: '#7783a7',
          400: '#596994',
          500: '#3b4f81',
          600: '#354879',
          700: '#2d3f6e',
          800: '#263664',
          900: '#1e2a4a',
          950: '#0f1629',
        },
        // Champagne gold
        champagne: {
          50: '#fffdf8',
          100: '#fef9ed',
          200: '#fcf3db',
          300: '#f9ebc4',
          400: '#f7e7ce',
          500: '#f2d9a9',
          600: '#e5c68a',
          700: '#d4af37',
          800: '#b8972e',
          900: '#8a7022',
        },
        // Electric blue accent
        electric: {
          50: '#eef2ff',
          100: '#dce4ff',
          200: '#c2d0ff',
          300: '#97b1ff',
          400: '#6687ff',
          500: '#4169e1',
          600: '#3457b8',
          700: '#2a4494',
          800: '#253b7a',
          900: '#243366',
        },
        // Rose gold
        rose: {
          50: '#fdf8f6',
          100: '#faf0ec',
          200: '#f5e0d8',
          300: '#e8c4b8',
          400: '#dba898',
          500: '#c98b78',
          600: '#b06f5c',
          700: '#935a4a',
          800: '#7a4c40',
          900: '#674239',
        },
        // Silver
        silver: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#c0c0c0',
          500: '#a3a3a3',
          600: '#737373',
          700: '#525252',
          800: '#404040',
          900: '#262626',
        },
      },
      boxShadow: {
        'glow-gold': '0 0 40px -5px rgba(212, 175, 55, 0.6)',
        'glow-blue': '0 0 40px -5px rgba(65, 105, 225, 0.5)',
        'glow-champagne': '0 0 30px -5px rgba(247, 231, 206, 0.4)',
        'card': '0 30px 60px -15px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(212, 175, 55, 0.2)',
        'inner-glow': 'inset 0 0 60px rgba(212, 175, 55, 0.05)',
      },
      animation: {
        'float': 'float 5s ease-in-out infinite',
        'shimmer': 'shimmer 4s ease-in-out infinite',
        'firework': 'firework-rise 3s ease-out forwards',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'spin-slow': 'spin 10s linear infinite',
        'confetti': 'confetti-fall 4s linear forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        shimmer: {
          '0%, 100%': { backgroundPosition: '0% center' },
          '50%': { backgroundPosition: '200% center' },
        },
        'pulse-glow': {
          '0%, 100%': {
            filter: 'drop-shadow(0 0 8px rgba(212, 175, 55, 0.5))',
            opacity: '0.8',
          },
          '50%': {
            filter: 'drop-shadow(0 0 20px rgba(212, 175, 55, 1))',
            opacity: '1',
          },
        },
      },
    },
  },
  plugins: [],
} satisfies Config
