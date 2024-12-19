/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      fontFamily:{
        openSauce: ['Open Sauce One', 'sans-serif'],
        garet: ['Garet','sans-serif']
      },
      colors: {
        'primary': '#344258',
        'secondary':'#b29c6b',
        'tertiary':'#e7e7e9'
      }
    },
  },
  plugins: [],
}

