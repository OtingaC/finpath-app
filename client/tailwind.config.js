/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e6f1ff',
          100: '#b3d7ff',
          200: '#80bdff',
          300: '#4da3ff',
          400: '#1a89ff',
          500: '#0070e6',  // Main blue
          600: '#0059b3',
          700: '#004280',
          800: '#002b4d',
          900: '#00141a',
        },
        accent: {
          50: '#e6f9f0',
          100: '#b3eed4',
          200: '#80e3b8',
          300: '#4dd89c',
          400: '#1acd80',
          500: '#00b367',  // Main green
          600: '#008c50',
          700: '#006539',
          800: '#003e22',
          900: '#00170b',
        }
      }
    },
  },
  plugins: [],
}