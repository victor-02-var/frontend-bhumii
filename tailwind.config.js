/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gov: {
          saffron: '#E65100',
          'saffron-light': '#FFF3E0',
          navy: '#0A2540',
          'navy-light': '#1E3A8A',
          green: '#15803D',
          'green-light': '#F0FDF4',
          ashoka: '#000080',
          bg: '#F8FAFC',
          card: '#FFFFFF',
          border: '#E2E8F0',
          muted: '#64748B',
          text: '#0F172A'
        }
      }
    },
  },
  plugins: [],
}
