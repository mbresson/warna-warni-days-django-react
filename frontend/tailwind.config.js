module.exports = {
  purge: [
    "./common/**/*.tsx",
    "./components/**/*.tsx",
    "./pages/**/*.tsx",
  ],
  theme: {
    extend: {},
    opacity: {
      90: "0.90",
    },
  },
  variants: {
    borderStyle: ["hover"],
  },
  plugins: [],
};
