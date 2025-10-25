/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        // Dark theme base colors (neutral)
        background: {
          DEFAULT: '#121212',
          elevated: '#1E1E1E',
          card: '#2A2A2A',
        },
        surface: {
          DEFAULT: '#1E1E1E',
          elevated: '#2A2A2A',
        },
        primary: {
          DEFAULT: '#90CAF9',
          light: '#B3E5FC',
          dark: '#64B5F6',
        },
        secondary: {
          DEFAULT: '#CE93D8',
          light: '#E1BEE7',
          dark: '#BA68C8',
        },
        text: {
          primary: '#FFFFFF',
          secondary: '#B3B3B3',
          disabled: '#666666',
        },
        divider: '#3A3A3A',
        error: '#CF6679',
        success: '#81C784',
      },
      fontFamily: {
        regular: ['System'],
        medium: ['System'],
        bold: ['System'],
      },
    },
  },
  plugins: [],
};
