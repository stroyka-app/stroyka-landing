import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          "sage-mist":     "#cad2c5",
          sage:            "#84a98c",
          forest:          "#52796f",
          deep:            "#354f52",
          midnight:        "#2f3e46",
          "midnight-dark": "#1a2428",
          amber:           "#d97706",
          "amber-bright":  "#f59e0b",
        },
      },
      fontFamily: {
        heading: ["var(--font-space-grotesk)", "system-ui", "sans-serif"],
        body:    ["var(--font-inter)",         "system-ui", "sans-serif"],
      },
      animation: {
        marquee:       "marquee 60s linear infinite",
        wobble:        "wobble 5s ease-in-out infinite",
        "pulse-amber": "pulse-amber 2.2s ease-in-out infinite",
        "spin-slow":   "spin 6s linear infinite",
      },
      keyframes: {
        marquee: {
          to: { transform: "translateX(-50%)" },
        },
        wobble: {
          "0%,100%": { transform: "rotate(var(--rot, 0deg)) translateY(0)" },
          "50%":     { transform: "rotate(calc(var(--rot, 0deg) + 1deg)) translateY(-3px)" },
        },
        "pulse-amber": {
          "0%,100%": { boxShadow: "0 0 12px rgba(245,158,11,0.5)" },
          "50%":     { boxShadow: "0 0 20px rgba(245,158,11,0.8)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
