/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Arctic Slate Palette
        slate: {
          50: '#f8fafc',  // Light bg
          100: '#f1f5f9',
          200: '#e2e8f0', // Borders
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155', // Light Primary
          800: '#1e293b',
          900: '#0f172a', // Dark Surface
          950: '#020617', // Dark Bg
        },
        primary: {
          light: '#334155', // Slate 700
          dark: '#e2e8f0',  // Slate 200
        },
        accent: {
          light: '#38bdf8', // Sky 400
          dark: '#22d3ee',  // Cyan 400
          DEFAULT: '#0ea5e9',
        }
      },
      fontFamily: {
        heading: ['Outfit', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'pulse-slow': 'pulse 3s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        }
      }
    },
    screens: {
      '2xl': { 'min': '1535px' },
      'xl': { 'min': '1279px' },
      'lg': { 'min': '900px' },
      'md': { 'min': '768px' },
      'sm': { 'min': '639px' },
      'tiny': { 'min': '550px' },
      'm2xl': { 'max': '1535px' },
      'mxl': { 'max': '1279px' },
      'mlg': { 'max': '900px' },
      'mmd': { 'max': '768px' },
      'msm': { 'max': '639px' },
      'mtiny': { 'max': '550px' },
    }
  },
  plugins: [],
}