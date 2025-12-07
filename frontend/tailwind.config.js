/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Streetwear Color Palette - Black & White with Accent
        street: {
          red: '#FF0000',        // Pure red accent
          neon: '#00FF00',       // Neon green accent
          orange: '#FF6B35',     // Street orange
          purple: '#9D00FF',     // Neon purple
        },
        primary: {
          50: '#f5f5f5',
          100: '#e5e5e5',
          200: '#d4d4d4',
          300: '#a3a3a3',
          400: '#737373',
          500: '#525252',
          600: '#404040',
          700: '#262626',
          800: '#171717',
          900: '#0a0a0a',
        },
        dark: {
          950: '#000000',        // Pure black
          900: '#0a0a0a',
          800: '#141414',
          700: '#1a1a1a',
          600: '#262626',
        },
        light: {
          50: '#ffffff',         // Pure white
          100: '#fafafa',
          200: '#f5f5f5',
          300: '#e5e5e5',
        }
      },
      fontFamily: {
        graffiti: ['"Bebas Neue"', 'Impact', 'sans-serif'],
        street: ['"Montserrat"', '"Inter"', 'sans-serif'],
        display: ['"Oswald"', '"Arial Black"', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'street': '0 4px 20px rgba(0, 0, 0, 0.3)',
        'street-hover': '0 8px 30px rgba(0, 0, 0, 0.5)',
        'red-glow': '0 0 20px rgba(255, 0, 0, 0.5)',
        'neon-glow': '0 0 20px rgba(0, 255, 0, 0.5)',
        'harsh': '8px 8px 0px rgba(0, 0, 0, 1)',
      },
      animation: {
        'slide-up': 'slideUp 0.5s ease-out',
        'glitch': 'glitch 0.3s cubic-bezier(.25, .46, .45, .94) both infinite',
        'fade-in': 'fadeIn 0.6s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
      },
      keyframes: {
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        glitch: {
          '0%, 100%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-2px, 2px)' },
          '40%': { transform: 'translate(-2px, -2px)' },
          '60%': { transform: 'translate(2px, 2px)' },
          '80%': { transform: 'translate(2px, -2px)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      backgroundImage: {
        'noise': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='3.5' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")",
        'grunge': "url(\"data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [],
}

