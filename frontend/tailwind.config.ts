// Location: frontend/tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50:  '#fef3f2',
          100: '#fde8e6',
          200: '#fbd4d0',
          300: '#f7b0aa',
          400: '#f07f74',
          500: '#e55547',
          600: '#d13828',
          700: '#af2d1f',
          800: '#91281d',
          900: '#78261f',
          950: '#420f0b',
        },
        dark: {
          50:  '#f6f6f7',
          100: '#e1e3e6',
          200: '#c3c7cd',
          300: '#9ca3ad',
          400: '#75808d',
          500: '#5a6573',
          600: '#47505d',
          700: '#3a424d',
          800: '#313842',
          900: '#1c2028',
          950: '#0f1117',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        body: ['var(--font-body)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;