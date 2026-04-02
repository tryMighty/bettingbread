/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        orange: {
          DEFAULT: '#F26419',
          hot: '#FF8540',
          dim: '#7A3008',
          ghost: 'rgba(242,100,25,0.1)'
        },
        green: {
          DEFAULT: '#2D5426',
          bright: '#4A8C3A',
          cash: '#55CC70'
        },
        bbg: {
          DEFAULT: '#050804',
          2: '#090D07',
          surface: '#10180C',
          surface2: '#162010'
        },
        br: {
          DEFAULT: 'rgba(242,100,25,0.13)',
          mid: 'rgba(242,100,25,0.3)',
          green: 'rgba(45,84,38,0.4)'
        },
        tx: {
          DEFAULT: '#ECF5E0',
          muted: '#637856',
          dim: '#374530'
        }
      },
      fontFamily: {
        brand: ["'Black Ops One'", "sans-serif"],
        display: ["'Barlow Condensed'", "sans-serif"],
        body: ["'Barlow'", "sans-serif"],
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/container-queries'),
  ],
}
