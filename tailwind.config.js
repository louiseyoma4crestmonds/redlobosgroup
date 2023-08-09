//  TODO: Move these into helpers
const Color = require("color");

// TODO: Move this to config file
const customColors = {
  bg: "#e1d7ca",
  footerBg: "#212529",
  gold: "#BD9A68",
  green1: "#F9FAF1",
};

module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,css}",
    "./src/components/**/*.{js,ts,jsx,tsx,css}",
    "./src/atoms/**/*.{js,ts,jsx,tsx,css}",
    "./src/molecules/**/*.{js,ts,jsx,tsx,css}",
    "./src/layouts/**/*.{js,ts,jsx,tsx,css}",
    "./src/organisms/**/*.{js,ts,jsx,tsx,css}",
  ],
  theme: {
    extend: {
      screens: {
        tablet: "640px", // => @media (min-width: 640px) { ... }
        laptop: "1024px", // => @media (min-width: 1024px) { ... }
        desktop: "1280px", // => @media (min-width: 1280px) { ... }
      },
      colors: {
        redLobosBackground: customColors.bg,
        redLobosFooterBackground: customColors.footerBg,
        gold: customColors.gold,
        green1: customColors.green1,
      },
      keyframes: {
        shake: {
          "10%, 90%": { transform: "translate3d(-1px, 0, 0)" },
          "20%, 80%": { transform: "translate3d(1px, 0, 0)" },
          "30%, 50%, 70%": { transform: "translate3d(-2px, 0, 0)" },
          "40%, 60%": { transform: "translate3d(2px, 0, 0)" },
        },
      },
      animation: {
        shake: "shake 0.82s cubic-bezier(0.36, 0.07, 0.19, 0.97) both",
      },
    },
  },
  plugins: [],
};
