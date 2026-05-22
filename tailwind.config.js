/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts}'],
  theme: {
    extend: {
      colors: {
        cream: '#FDF7ED',
        beige: '#F5F5DC',
        tan: '#C19A6B',
        'tan-soft': '#D9B98A',
        espresso: '#4B3621',
        'espresso-soft': '#6B5240'
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['"Fraunces"', 'Inter', 'serif']
      },
      boxShadow: {
        soft: '0 10px 30px -12px rgba(75, 54, 33, 0.18)',
        card: '0 20px 40px -20px rgba(75, 54, 33, 0.25)',
        glow: '0 0 0 1px rgba(193, 154, 107, 0.25), 0 12px 30px -10px rgba(193, 154, 107, 0.35)'
      },
      borderRadius: {
        '4xl': '2rem'
      },
      transitionTimingFunction: {
        silk: 'cubic-bezier(0.22, 1, 0.36, 1)'
      }
    }
  },
  plugins: []
}
