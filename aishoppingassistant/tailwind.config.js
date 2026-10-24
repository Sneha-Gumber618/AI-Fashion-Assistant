/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Pastel Pink Palette (Blush & Dusty Rose)
        blush: {
          50: '#FDF8F7',
          100: '#FAF0EE',
          200: '#F5DCD9',
          300: '#ECC0BB',
          400: '#DE9FA8',
          500: '#CB7C89',
          600: '#B5606F',
          700: '#9A4C59',
          800: '#7F3E49',
          900: '#69363F',
        },
        // Warm Earthy Browns & Mochas (Zara & H&M Runway aesthetic)
        mocha: {
          50: '#FAF7F2',
          100: '#F4ECE1',
          200: '#EBDDCD',
          300: '#DEC7B1',
          400: '#C7AA8E',
          500: '#A98767',
          600: '#876749',
          700: '#674C34',
          800: '#4B3624',
          900: '#2F2015',
          950: '#1C120B',
        },
        // Editorial Sand & Cream
        cream: {
          50: '#FFFCF9',
          100: '#FAF6F0',
          200: '#F4EFE6',
          300: '#EAE1D2',
          400: '#D8CCA6',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        serif: ['Cormorant Garamond', 'Georgia', 'serif'],
        display: ['Italiana', 'Cormorant Garamond', 'serif'],
      },
      animation: {
        'marquee': 'marquee 25s linear infinite',
        'fade-in': 'fadeIn 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'fade-out': 'fadeOut 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-up': 'slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'curtain-reveal': 'curtainReveal 1.2s cubic-bezier(0.77, 0, 0.175, 1) forwards',
        'letter-track': 'letterTrack 1.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'float': 'float 4s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0', pointerEvents: 'none' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        curtainReveal: {
          '0%': { transform: 'scaleY(1)' },
          '100%': { transform: 'scaleY(0)' },
        },
        letterTrack: {
          '0%': { letterSpacing: '0.15em', opacity: '0' },
          '50%': { opacity: '1' },
          '100%': { letterSpacing: '0.45em', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.6', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.04)' },
        }
      }
    },
  },
  plugins: [],
}
