/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{html,js,jsx}"
  ],
  theme: {
    extend: {
      keyframes: {
        'fade-in-down': {
          "from": {
            transform: "translateY(-0.75rem)",
            opacity: '0'
          },
          "to": {
            transform: "translateY(0rem)",
            opacity: '1'
          },
        },
      },
      animation: {
        'fade-in-down': "fade-in-down 0.2s ease-in-out both",
      },
      colors: {
        grnavgreen: '#217267',
        grbodydark: '#2B2D42',
        grtextlight: '#EDF2F4',
        grbtnred: '#EF233C',
        grbtnhover: '#F53E53'
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms')
  ],
}

