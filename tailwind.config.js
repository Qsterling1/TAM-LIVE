/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        stitch: {
          background: '#0f111a',
          surface: '#13182b',
          panel: '#161c31',
          muted: '#1c233a',
          border: '#232b44',
          foreground: '#e5e8f5',
          subtle: '#9aa4c4',
          accent: '#4f8bff',
          'accent-foreground': '#e7efff',
          glow: '#7fb4ff',
          success: '#2dd4bf',
          danger: '#ef476f',
        },
      },
      boxShadow: {
        'stitch-glow': '0 0 0 1px rgba(79, 139, 255, 0.6), 0 15px 60px rgba(0, 0, 0, 0.55)',
        'panel-soft': '0 10px 45px rgba(0, 0, 0, 0.35)',
      },
      fontFamily: {
        sans: ['Inter', 'SF Pro Display', 'Segoe UI', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.25rem',
      },
    },
  },
  plugins: [],
}
