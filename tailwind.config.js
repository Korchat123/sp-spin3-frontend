/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-red': '#e4002b',    // Serious Red
        'brand-orange': '#DC5F00', // Street Orange
        'brand-black': '#242424',  // Night Black
        'brand-gray': '#eeeeee',   // Concrete
        'brand-white': '#ffffff',  // Clean White
      },
      fontFamily: {
        'bebas': ['"Bebas Neue"', 'sans-serif'],
        'sans-thai': ['"IBM Plex Sans Thai"', 'sans-serif'],
      }
    },
  },
  plugins: [],
}