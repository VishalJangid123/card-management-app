/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './App.{js,ts,tsx}',
    './components/**/*.{js,ts,tsx}',
    './screens/**/*.{js,ts,tsx}',
    './navigation/**/*.{js,ts,tsx}',
  ],

  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: "#49D6D8",
        "c-gray-1": "#808080",
        "c-gray-2": "#8F8F8F"
      },
      fontFamily:{
        "FC-regular": ["FCSubjectRoundedNoncml-Reg"],
        "FC-bold": ["FCSubjectRoundedNoncml-Bold"],
      },

    },
  },
  plugins: [],
};
