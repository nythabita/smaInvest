/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts}'],
  theme: {
    extend: {
      colors: {
        // Legacy colors (kept for compatibility)
        cream: '#FDF7ED',
        beige: '#F5F5DC',
        tan: '#C19A6B',
        'tan-soft': '#D9B98A',
        espresso: '#4B3621',
        'espresso-soft': '#6B5240',
        
        // Stitch Luxury Editorial Colors
        surface: '#f9f9f7',
        'on-surface': '#1a1c1b',
        'on-surface-variant': '#444748',
        'outline-variant': '#c4c7c7',
        'surface-container-lowest': '#ffffff',
        secondary: '#b61729',
        'on-secondary': '#ffffff',
        'secondary-container': '#d9343e',
        'on-secondary-container': '#fffbff',
        primary: '#000000',
        'on-primary': '#ffffff',
        'surface-container-high': '#e8e8e6'
      },
      fontFamily: {
        // Legacy
        sans: ['"Hanken Grotesk"', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['"Bodoni Moda"', '"Fraunces"', 'Inter', 'serif'],
        
        // Stitch specifics
        'display-lg': ['"Fraunces"', 'serif'],
        'body-md': ['"Hanken Grotesk"', 'sans-serif'],
        'label-caps': ['"Hanken Grotesk"', 'sans-serif'],
        'headline-md': ['"Fraunces"', 'serif'],
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
