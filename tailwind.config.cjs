/* eslint-disable no-undef -- postcss requires cjs syntax */

const makeColorClass = (variableName) => {
  return ({ opacityValue }) =>
    opacityValue
      ? `rgba(var(--${variableName}), ${opacityValue})`
      : `rgb(var(--${variableName}))`;
};

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      textColor: {
        primary: makeColorClass("text-primary"),
        muted: makeColorClass("text-muted"),
        accent: makeColorClass("text-accent"),
      },
      backgroundColor: {
        primary: makeColorClass("bg-primary"),
        muted: makeColorClass("bg-muted"),
        accent: makeColorClass("bg-accent"),
      },
      borderColor: {
        primary: makeColorClass("bg-primary"),
        muted: makeColorClass("bg-muted"),
        accent: makeColorClass("bg-accent"),
      },
    },
    fontFamily: {
      sans: "sans-serif",
      serif: "serif",
      mono: "monospace",
      accent: 'var(--font-accent), "Press Start 2P", monospace',
      cursive: "var(--font-cursive), Damion, cursive",
    },
  },
  darkMode: "class",
  plugins: [],
};
