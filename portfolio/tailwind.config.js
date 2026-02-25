module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "primary-blue": "#03114E",
        "dark-primary": "#A01DE7",
        "primary-red": "#DA1212",
        "secondary-blue": "#0E3872",
        "pg-white": "#BEBEBE",
        "shadow-blue": "#0E3872",
        "dark-black": "#121212",
        "dark-white": "#F5F5F5",
        "dark-text": "#BEBEBE",
        "dark-shadow": "#0A0A0A",
        "neon-green": "#39FF14",
      },
      fontFamily: {
        Montserrat: ["Montserrat", "sans-serif"],
        Cormorant: ["Cormorant", "sans-serif"],
      },
      boxShadow: {
        "text-blue": "2px 2px #0E3872", // replace 'blue' with your actual color
      },
      textShadow: {
        blue: "2px 2px #0E3872",
        red: "2px 2px #DA1212",
      },
    },
    container: {
      center: true,
      padding: "1rem",
      screens: {
        md: "1124px",
        lg: "1124px",
        xl: "1124px",
        "2xl": "1124px",
      },
    },
  },
  plugins: [],
};
