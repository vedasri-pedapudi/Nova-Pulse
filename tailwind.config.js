/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#f0f4fa',
          100: '#d9e2f0',
          200: '#b3c7e0',
          300: '#8da7d0',
          400: '#6d8cc0',
          500: '#4a6fa8',
          600: '#3a5a90',
          700: '#2d4570',
          800: '#1a2f52',
          900: '#0f1f3d',
          950: '#0a1530',
        },
        teal: {
          50: '#effcf9',
          100: '#cbf7ef',
          200: '#97eee0',
          300: '#5fe0d0',
          400: '#2ec9be',
          500: '#14ada6',
          600: '#0d8a85',
          700: '#0e6f6b',
          800: '#105956',
          900: '#114b48',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
