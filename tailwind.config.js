/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#0755E9",
        secondary: "#F7F7F7",
        heading: "#131313",
      },
    },
  },
  plugins: [],
};
