import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // ─── v2: rich warm dark ────────────────────────────────────
        // `bone` is the page shell (dark green-ink, warmer than previous
        // blue-grey). `ink` is cream text for dark surfaces. `clay` is a
        // warm oak accent for Pro pricing. Names retained from v1 for
        // mechanical migration — values redefined.
        bone: {
          DEFAULT: "#0C110E", // deepest — page base
          deep:    "#151A16", // subtle section variation
          soft:    "#1F2620", // raised cards
        },
        ink: {
          DEFAULT: "#EDE6D3", // warm cream — body text on dark
          soft:    "#C9BFAA", // secondary
          muted:   "#8C857A", // tertiary / captions
        },
        clay: {
          DEFAULT: "#D4A574", // warm oak — Pro accent
          soft:    "#E8C89D",
        },
        brand: {
          "sage-mist":     "#cad2c5",
          "sage-bright":   "#B8D4BD", // NEW — pops on dark, use sparingly
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
        display: ["var(--font-fraunces)",      "Georgia", "serif"],
        heading: ["var(--font-space-grotesk)", "system-ui", "sans-serif"],
        body:    ["var(--font-inter)",         "system-ui", "sans-serif"],
        mono:    ["var(--font-jetbrains-mono)", "ui-monospace", "monospace"],
      },
      animation: {
        marquee:       "marquee 60s linear infinite",
        wobble:        "wobble 5s ease-in-out infinite",
        "pulse-sage":  "pulse-sage 2.4s ease-in-out infinite",
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
        "pulse-sage": {
          "0%,100%": { boxShadow: "0 0 16px rgba(184,212,189,0.28)" },
          "50%":     { boxShadow: "0 0 28px rgba(184,212,189,0.55)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
