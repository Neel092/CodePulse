import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: "#F5F0E8", // Light Mode
          dark: "#0E0C0A",    // Dark Mode
        },
        surface: {
          DEFAULT: "#FDFAF5",
          dark: "#1A1714",
        },
        elevated: {
          DEFAULT: "#F0EBE0",
          dark: "#242019",
        },
        border: {
          DEFAULT: "#D4C9B4",
          dark: "#2E2A24",
        },
        muted: {
          DEFAULT: "#8C8070",
          dark: "#7A7068",
        },
        foreground: {
          DEFAULT: "#3A3028",
          dark: "#C9B99A",
        },
        heading: {
          DEFAULT: "#1E1A14",
          dark: "#EDE0C8",
        },
        primary: {
          DEFAULT: "#C26B28",
          dark: "#D97B3C",
        },
        secondary: {
          DEFAULT: "#3D7A54",
          dark: "#5C9E6E",
        },
        danger: {
          DEFAULT: "#A83535",
          dark: "#C0474A",
        },
        info: {
          DEFAULT: "#3A6A96",
          dark: "#5B8DB8",
        },
        warning: {
          DEFAULT: "#B89742",
          dark: "#B89742",
        },
      },
      fontFamily: {
        sans: ["var(--font-dm-sans)"],
        display: ["var(--font-syne)"],
        mono: ["var(--font-jetbrains-mono)"],
      },
      borderRadius: {
        xl: "0.75rem",
      },
      boxShadow: {
        warm: "0 4px 24px rgba(217, 123, 60, 0.06)",
      },
    },
  },
  plugins: [],
};
export default config;
