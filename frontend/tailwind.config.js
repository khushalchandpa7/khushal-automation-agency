/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: {
          base: "rgb(var(--color-bg-base) / <alpha-value>)",
        },
        surface: {
          base: "rgb(var(--color-surface-base) / <alpha-value>)",
          soft: "rgb(var(--color-surface-soft) / <alpha-value>)",
          border: "rgb(var(--color-surface-border))",
          strong: "rgb(var(--color-surface-strong))",
        },
        panel: {
          base: "rgb(var(--color-panel-base) / <alpha-value>)",
          soft: "rgb(var(--color-panel-soft))",
          text: "rgb(var(--color-panel-text) / <alpha-value>)",
          muted: "rgb(var(--color-panel-muted))",
        },
        ink: {
          base: "rgb(var(--color-ink-base) / <alpha-value>)",
          muted: "rgb(var(--color-ink-muted) / <alpha-value>)",
          subtle: "rgb(var(--color-ink-subtle) / <alpha-value>)",
        },
        accent: {
          mint: "rgb(var(--color-accent-mint) / <alpha-value>)",
          "mint-deep": "rgb(var(--color-accent-mint-deep) / <alpha-value>)",
          tangerine: "rgb(var(--color-accent-tangerine) / <alpha-value>)",
          "tangerine-deep":
            "rgb(var(--color-accent-tangerine-deep) / <alpha-value>)",
          contrast: "rgb(var(--color-accent-contrast) / <alpha-value>)",
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
        soft: "var(--shadow-soft)",
        lift: "var(--shadow-lift)",
      },
      maxWidth: {
        container: "1200px",
      },
    },
  },
  plugins: [],
};
