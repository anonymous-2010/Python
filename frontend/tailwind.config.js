/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        mint: '#34d399',
        surface: {
          DEFAULT: 'rgba(255,255,255,0.03)',
          50: 'rgba(255,255,255,0.05)',
          100: 'rgba(255,255,255,0.08)',
        },
      },
      animation: {
        'in': 'fadeIn 0.3s ease-out',
        'count-pop': 'countPop 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        countPop: {
          '0%': { transform: 'scale(1.8)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
