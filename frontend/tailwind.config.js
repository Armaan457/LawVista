/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        PrimaryBlack: "#161616",
        PrimaryGrayDark: "#1D1D1D",
        PrimaryGrayLight: "#393939",
        PrimaryGrayLighter: "#494949",
        PrimaryGrayTextLight: "#BEBEBE",
        PrimaryGrayTextDark: "#9E9E9E",
        PrimaryBlue: "#509FFF",
        PrimaryGrayHover: "#2E2E2E",
        PrimaryGrayIcons: "#676767",
        PrimaryLight: '#ffffff',
        DarkBlue: '#0E1A45',
        PrimaryWhite: '#F4F6FC',
        SecondaryWhite: '#EEF2FD',
        TertiaryWhite: '#E0E6F9',
      },
    },
    fontFamily: {
      sans: ['Urbanist', 'sans-serif']
    }
  },
  plugins: [],
};
