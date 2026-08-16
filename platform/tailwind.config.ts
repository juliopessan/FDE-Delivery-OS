import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  darkMode: "media",
  theme: {
    extend: {
      colors: {
        ink: "#14150F",
        inksoft: "#1C1F18",
        paper: "#F2F0EA",
        paper2: "#EDEAE0",
        lime: "#C4F04C",
        amber: "#E8B84B",
        rust: "#D97757",
        peach: "#E8916E",
      },
      fontFamily: {
        display: ["'Helvetica Neue'", "Helvetica", "Arial", "sans-serif"],
        serif: ["'Instrument Serif'", "Georgia", "serif"],
        mono: ["'JetBrains Mono'", "ui-monospace", "'Courier New'", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
