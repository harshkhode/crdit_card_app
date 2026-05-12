/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        gold: {
          50:  '#fdf9ec',
          100: '#faf0c8',
          200: '#f5de8e',
          300: '#f0c860',
          400: '#e8b030',
          500: '#c9a840',
          600: '#b8860b',
          700: '#8b6914',
          800: '#6b500f',
          900: '#4a380a',
        },
        dark: {
          50:  '#f0efe8',
          100: '#d0cfcc',
          200: '#a0a09c',
          300: '#707070',
          400: '#4a4a5a',
          500: '#2a2a3a',
          600: '#1a1a28',
          700: '#111120',
          800: '#0a0a16',
          900: '#030308',
        },
      },
      fontFamily: {
        sans:    ['Inter', 'system-ui', 'sans-serif'],
        display: ["'Space Grotesk'", 'Inter', 'system-ui', 'sans-serif'],
        mono:    ["'JetBrains Mono'", 'monospace'],
      },
      animation: {
        'fade-in':     'fadeIn 0.35s ease-out',
        'slide-up':    'slideUp 0.4s ease-out',
        'float':       'float 6s ease-in-out infinite',
        'glow-pulse':  'glowPulse 3s ease-in-out infinite',
        'spin-slow':   'spin 8s linear infinite',
      },
      keyframes: {
        fadeIn:    { '0%': { opacity: 0 }, '100%': { opacity: 1 } },
        slideUp:   { '0%': { opacity: 0, transform: 'translateY(20px)' }, '100%': { opacity: 1, transform: 'translateY(0)' } },
        float:     { '0%,100%': { transform: 'translateY(0) rotate(0deg)' }, '33%': { transform: 'translateY(-10px) rotate(0.6deg)' }, '66%': { transform: 'translateY(-5px) rotate(-0.4deg)' } },
        glowPulse: { '0%,100%': { boxShadow: '0 0 20px rgba(201,168,64,0.2)' }, '50%': { boxShadow: '0 0 40px rgba(201,168,64,0.45), 0 0 80px rgba(201,168,64,0.15)' } },
      },
      boxShadow: {
        'card-dark': '0 4px 32px rgba(0,0,0,0.6), 0 1px 0 rgba(255,255,255,0.04) inset',
        'card-hover': '0 24px 64px rgba(0,0,0,0.8), 0 0 40px rgba(201,168,64,0.12)',
        'gold':       '0 4px 20px rgba(201,168,64,0.35)',
        'gold-lg':    '0 8px 32px rgba(201,168,64,0.5)',
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #b8860b 0%, #daa520 40%, #f0c060 70%, #c9a840 100%)',
        'dark-mesh':     'radial-gradient(ellipse 80% 60% at 70% 40%, rgba(201,168,64,0.05) 0%, transparent 60%), linear-gradient(160deg, #030308 0%, #06061a 40%, #080810 70%, #030308 100%)',
      },
      aspectRatio: {
        'card': '86 / 54',
      },
    },
  },
  plugins: [],
};
