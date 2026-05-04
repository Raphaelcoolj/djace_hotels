import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#18181b", // Charcoal Night
        surface: "#27272a", // Obsidian
        "surface-dim": "#1f1f22",
        primary: "#18181b",
        "on-primary": "#f8f5f0",
        accent: {
          gold: "#d4af37", // Champagne Gold
          "gold-hover": "#e6c354",
        },
        text: {
          main: "#f8f5f0", // Alabaster
          muted: "#a1a1aa", // Slate Silver
        },
        outline: {
          ghost: "rgba(255, 255, 255, 0.1)",
        }
      },
      fontFamily: {
        headline: ["var(--font-noto-serif)", "serif"],
        body: ["var(--font-inter)", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
