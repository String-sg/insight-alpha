/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Geist_400Regular', 'sans-serif'],
        'geist': ['Geist_400Regular', 'sans-serif'],
        'geist-medium': ['Geist_500Medium', 'sans-serif'],
        'geist-semibold': ['Geist_600SemiBold', 'sans-serif'],
      },
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

