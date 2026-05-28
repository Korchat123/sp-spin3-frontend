/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          page: '#E4E7EC',
          sidebar: '#E8EBF0',
          header: '#FFFFFF',
          card: '#FFFFFF',
          subheader: '#FCFDFE',
          'hover-row': '#F9FAFB',
          'active-nav': '#D6DBE4',
          'text-primary': '#1A2333',
          'text-secondary': '#6B7A8D',
          'text-tertiary': '#9AA3AE',
          'text-dark': '#3D4A5C',
          'border-outer': '#C8CDD6',
          'border-inner': '#E8EBF0',
          'border-active': '#B4BAC4',
          'success': '#1D9E75',
          'success-bg': '#E1F5EE',
          'success-text': '#0F6E56',
          'danger': '#E24B4A',
          'danger-bg': '#FCEBEB',
          'warning-bg': '#FEF3E2',
          'warning-text': '#C96A00',
          'warning-border': '#FDE5B4',
          'new-badge': '#D0D5DE',
        }
      }
    },
  },
  plugins: [],
}
