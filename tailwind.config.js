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
      colors: {
        'chat': {
          'bg-light': '#f1f5f9',
          'text-dark': '#0f172a',
          'text-medium': '#475569',
          'text-light': '#64748b',
          'bubble-bg': '#ffffff',
          'button-bg': '#e2e8f0',
          'primary-bg': '#020617',
          'primary-text': '#ffffff',
        }
      }
    },
  },
  plugins: [
    function({ addUtilities }) {
      const newUtilities = {
        '.chat-text-force-dark': {
          'color': '#0f172a !important',
          '-webkit-text-fill-color': '#0f172a !important',
        },
        '.chat-text-force-medium': {
          'color': '#475569 !important',
          '-webkit-text-fill-color': '#475569 !important',
        },
        '.chat-text-force-light': {
          'color': '#64748b !important',
          '-webkit-text-fill-color': '#64748b !important',
        },
        '.chat-bg-force-light': {
          'background-color': '#f1f5f9 !important',
        },
        '.chat-bubble-force-bg': {
          'background-color': '#ffffff !important',
        }
      }
      addUtilities(newUtilities)
    }
  ],
}

