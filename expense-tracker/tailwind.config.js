/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["src/**/*.{js,jsx,ts,tsx}"],
  safelist: [
    "bg-blue-500",
    "text-white",
    "p-4",
    "bg-background-dark-alt",
    "border-surface-highlight",
    "text-text-secondary",
    "bg-surface-dark-alt2",
    "bg-primary/10",
    "text-primary",
    "border-primary",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["Manrope", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        lg: "0.5rem",
        xl: "0.75rem",
        "2xl": "1rem",
        full: "9999px",
      },
    },
  },
  plugins: [],
};
