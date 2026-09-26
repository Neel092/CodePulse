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
        brand: {
          orange: "#FF4D1C",
          "orange-hover": "#FF6236",
          "orange-glow": "rgba(255, 77, 28, 0.15)",
          dark: "#080808",
          surface: "#0D0D0D",
          card: "#121212",
          elevated: "#181818",
          border: "#242424",
          "border-subtle": "#1A1A1A",
          teal: "#22D3EE",
          green: "#10B981",
          amber: "#F59E0B",
          red: "#EF4444",
          muted: "#737373",
          text: "#E5E5E5",
        },
      },
      fontFamily: {
        sans: ["var(--font-dm-sans)", "sans-serif"],
        serif: ["var(--font-serif)", "Playfair Display", "serif"],
        display: ["var(--font-serif)", "Playfair Display", "serif"],
        mono: ["var(--font-jetbrains-mono)", "JetBrains Mono", "monospace"],
      },
      borderRadius: {
        xl: "0.75rem",
      },
      boxShadow: {
        warm: "0 4px 24px rgba(217, 123, 60, 0.06)",
        orange: "0 4px 20px rgba(255, 77, 28, 0.25)",
      },
    },
  },
  plugins: [],
};
export default config;
