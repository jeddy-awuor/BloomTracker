import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        pink: {
          50: "#fff5f9",
          100: "#ffe8f2",
          200: "#ffd1e6",
          300: "#ffb3d9",
          400: "#ff8fc7",
          500: "#ff6bb5",
          600: "#f04da0",
          700: "#d63384",
          800: "#b02a6f",
          900: "#8c2459",
        },
        blush: {
          50: "#fff0f6",
          100: "#ffe4ef",
          200: "#ffc9e0",
          300: "#ffa8cf",
          400: "#ff87be",
          500: "#ff66ad",
        },
      },
      fontFamily: {
        sans: ["system-ui", "-apple-system", "Segoe UI", "sans-serif"],
      },
      boxShadow: {
        pink: "0 4px 24px -4px rgba(255, 107, 181, 0.25)",
        "pink-lg": "0 8px 32px -8px rgba(255, 107, 181, 0.35)",
      },
    },
  },
  plugins: [],
};

export default config;
