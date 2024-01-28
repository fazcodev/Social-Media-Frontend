/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
    screens: {
      '2xl': {'min': '1535px'},
      // => @media (max-width: 1535px) { ... }

      'xl': {'min': '1279px'},
      // => @media (max-width: 1279px) { ... }

      'lg': {'min': '900px'},
      // => @media (max-width: 1023px) { ... }

      'md': {'min': '768px'},
      // => @media (max-width: 767px) { ... }
      
      'sm': {'min': '639px'},

      'tiny':{'min': '550px'},

      'm2xl': {'max': '1535px'},
      // => @media (max-width: 1535px) { ... }

      'mxl': {'max': '1279px'},
      // => @media (max-width: 1279px) { ... }

      'mlg': {'max': '900px'},
      // => @media (max-width: 1023px) { ... }

      'mmd': {'max': '768px'},
      // => @media (max-width: 767px) { ... }

      'msm': {'max': '639px'},
      // => @media (max-width: 639px) { ... }
      'mtiny': {'max': '550px'},
    }
  },
  plugins: [],
}