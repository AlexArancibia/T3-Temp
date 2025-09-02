/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/frontend/components/**/*.{js,ts,jsx,tsx}",
    "./src/frontend/app/**/*.{js,ts,jsx,tsx}",
    "./src/frontend/pages/**/*.{js,ts,jsx,tsx}",
    "./src/frontend/hooks/**/*.{js,ts,jsx,tsx}",
    "./src/frontend/contexts/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
