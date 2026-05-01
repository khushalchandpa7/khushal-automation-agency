/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          base: "#F9F9F6",
        },
        ink: {
          base: "#111111",
          muted: "#4A4A4A",
          subtle: "#7A7A7A",
        },
        accent: {
          mint: "#00D9A3",
          "mint-deep": "#00B388",
          tangerine: "#FF6B35",
          "tangerine-deep": "#E0521F",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
      },
      borderRadius: {
        "2xl": "1.25rem",
        "3xl": "1.75rem",
      },
      boxShadow: {
        soft: "0 1px 2px rgba(17,17,17,0.04), 0 4px 12px rgba(17,17,17,0.04)",
        lift: "0 6px 24px rgba(17,17,17,0.08)",
      },
      maxWidth: {
        container: "1200px",
      },
    },
  },
  plugins: [],
};
