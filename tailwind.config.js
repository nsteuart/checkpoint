/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: '#0d0f14',
          light: '#161a22',
          lighter: '#1c212b',
          border: '#2a2f3a',
        },
        accent: {
          DEFAULT: '#00e05a',
          dark: '#00b84a',
        },
        star: '#f5c518',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
