import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx,js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        mono: [
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Monaco",
          "Consolas",
          '"Liberation Mono"',
          '"Courier New"',
          "monospace",
        ],
      },
      boxShadow: {
        retro: "3px 3px 0px 0px rgba(28, 25, 23, 1)",
        "retro-sm": "2px 2px 0px 0px rgba(28, 25, 23, 1)",
        "retro-dark": "3px 3px 0px 0px rgba(214, 211, 209, 0.9)",
        "retro-dark-sm": "2px 2px 0px 0px rgba(214, 211, 209, 0.9)",
      },
      colors: {
        retro: {
          bg: "#f5f3ec",
          surface: "#ffffff",
          card: "#faf8f2",
          border: "#1c1917",
          ink: "#1c1917",
          muted: "#78716c",
          red: "#b91c1c",
          amber: "#c2410c",
          green: "#15803d",
          blue: "#1d4ed8",
        },
      },
    },
  },
  plugins: [],
};

export default config;
