/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#F2F0EA',
        surface: '#FFFFFF',
        'surface-alt': '#EAE7DF',
        ink: '#111110',
        muted: '#6B6862',
        border: '#E2DED3',
      },
      fontFamily: {
        display: ['Fraunces', 'serif'],
        wordmark: ['"Archivo Black"', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'tojibox-gradient': 'linear-gradient(90deg, #5C7A99, #D4B896)',
      },
    },
  },
  plugins: [],
};
