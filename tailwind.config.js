/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    'app/**/*.{ts,tsx}',
    'components/**/*.{ts,tsx}',
    'pages/**/*.{ts,tsx}'
  ],
  plugins: [require('daisyui')],
  daisyui: {
    themes: ['cmyk']
  }
};
