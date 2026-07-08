/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // These names (tangerine, forestGreen) allow you to use 
        // classes like 'text-tangerine' or 'bg-forestGreen'
        tangerine: '#F28C28', 
        forestGreen: '#228B22',
      },
      fontFamily: {
        // This allows you to use 'font-poppins' in your components
        poppins: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
