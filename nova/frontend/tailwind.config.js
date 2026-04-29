/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        space: {
          black: '#050510',
          dark: '#0a0a1a',
          blue: '#00bfff',
          purple: '#7c3aed',
          pink: '#ec4899',
        },
        nova: {
          firefly: '#0E1626',
          bigStone: '#162636',
          eastBay: '#414C6B',
          horizon: '#5A87A1',
          poloBlue: '#8DAAD9',
          cornflower: '#6495ED',
          sapphire: '#0F52BA',
          swanWing: '#F8F9FA',
          success: '#50C878', // Emerald
          warning: '#f59e0b',
          danger: '#ef4444',
        }
      },
      fontFamily: {
        space: ['Space Grotesk', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'twinkle': 'twinkle 2s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        twinkle: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.3 },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        }
      }
    },
  },
  plugins: [],
}
