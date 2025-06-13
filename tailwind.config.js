/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        kumbh: ['Kumbh Sans', 'sans-serif'],
      },
      colors: {
        primaryAspy: "#1A1A1A", // Negro
        secondaryAspy: "#A7A7A7" //Gris
      },
    },
  },
  plugins: [],
}
