/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#16A34A',
          dark: '#15803D',
          light: '#22C55E',
          50: '#F0FDF4',
          100: '#DCFCE7',
        },
        accent: {
          DEFAULT: '#FACC15',
          dark: '#EAB308',
        },
        background: '#F8FAFC',
        surface: '#FFFFFF',
        text: '#0F172A',
      },
      fontFamily: {
        heading: ['Poppins', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
