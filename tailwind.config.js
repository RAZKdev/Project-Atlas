/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        parchment: {
          50: '#FDFCFA',
          100: '#FAF8F5',
          200: '#F4EFEA',
          300: '#EAE2D7',
          400: '#DDD2C3',
          500: '#C7B7A3',
        },
        museum: {
          base: '#121110',
          surface: '#1A1817',
          card: '#22201E',
          border: '#332E2A',
          hover: '#2D2926',
        },
        earth: {
          50: '#F9F6F0',
          100: '#F0E9DC',
          200: '#DFCDB8',
          300: '#C9AE92',
          400: '#A9896A',
          500: '#8C6D50',
          600: '#70543D',
          700: '#543D2A',
        },
        moss: {
          400: '#6E7F66',
          500: '#576751',
          600: '#43513E',
        },
        slateatlas: {
          400: '#5F7379',
          500: '#485C62',
          600: '#34454A',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'Cambria', '"Times New Roman"', 'serif'],
        sans: ['"Inter"', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
    },
  },
  plugins: [],
}
