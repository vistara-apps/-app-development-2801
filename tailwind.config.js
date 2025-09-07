/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: 'hsl(222, 47%, 11%)',
        accent: 'hsl(210, 80%, 50%)',
        surface: 'hsl(0, 0%, 100%)',
        bg: 'hsl(214, 30%, 98%)',
        dark: {
          primary: 'hsl(222, 84%, 5%)',
          secondary: 'hsl(217, 32%, 17%)',
          accent: 'hsl(210, 80%, 50%)',
          surface: 'hsl(222, 84%, 5%)',
          card: 'hsl(217, 32%, 17%)',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'sm': '6px',
        'md': '10px',
        'lg': '16px',
      },
      spacing: {
        'sm': '8px',
        'md': '12px',
        'lg': '20px',
      },
      boxShadow: {
        'card': '0 4px 12px hsla(214, 30%, 10%, 0.08)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s cubic-bezier(0.32,0.72,0.20,1)',
        'slide-up': 'slideUp 0.3s cubic-bezier(0.32,0.72,0.20,1)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}