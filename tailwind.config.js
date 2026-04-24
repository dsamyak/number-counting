/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'xs': '375px',
        'sm': '480px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
      },
      colors: {
        primary: {
          DEFAULT: '#1E40AF', // intelliasg.com primary blue
        }
      },
      fontFamily: {
        sans: ['Nunito Sans', 'sans-serif'],
        heading: ['Nunito', 'Fredoka One', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
