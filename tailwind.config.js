/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      width: {
        '76': '304px',
        '18': '72px',
      },
      height: {
        '76': '304px',
        '18': '72px',
      },
    },
  },
  plugins: [],
}

