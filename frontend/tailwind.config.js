/** @type {import('tailwindcss').Config} */
import containerQueries from "@tailwindcss/container-queries";

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    screens: {
      xs: "360px",
      sm: "480px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
      "3xl": "1920px",
    },
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
        display: [
          "Space Grotesk",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "sans-serif",
        ],
        sans: [
          "Manrope",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
        mono: [
          "JetBrains Mono",
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Monaco",
          "Consolas",
          "monospace",
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
      spacing: {
        "section-y": "var(--space-section)",
        gutter: "var(--space-gutter)",
        touch: "44px",
        "touch-lg": "48px",
      },
      minWidth: {
        touch: "44px",
        "touch-lg": "48px",
      },
      minHeight: {
        touch: "44px",
        "touch-lg": "48px",
        svh: "100svh",
        lvh: "100lvh",
        dvh: "100dvh",
      },
      height: {
        "touch-lg": "48px",
        svh: "100svh",
        lvh: "100lvh",
        dvh: "100dvh",
      },
      width: {
        "touch-lg": "48px",
      },
      fontSize: {
        "fs-display": [
          "var(--fs-display)",
          { lineHeight: "0.95", letterSpacing: "-0.02em" },
        ],
        "fs-h1": ["var(--fs-h1)", { lineHeight: "1.05" }],
        "fs-h2": ["var(--fs-h2)", { lineHeight: "1.15" }],
        "fs-h3": ["var(--fs-h3)", { lineHeight: "1.25" }],
        "fs-lead": ["var(--fs-lead)", { lineHeight: "1.55" }],
        "fs-body": ["var(--fs-body)", { lineHeight: "1.6" }],
        "fs-meta": ["var(--fs-meta)", { lineHeight: "1.5" }],
      },
    },
  },
  plugins: [
    containerQueries,
    function ({ addVariant }) {
      addVariant("can-hover", "@media (hover: hover) and (pointer: fine)");
      addVariant("no-hover", "@media (hover: none)");
      addVariant("hocus", ["&:hover", "&:focus-visible"]);
    },
  ],
};
