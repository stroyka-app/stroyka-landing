import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // ─── v3: Paysages-inspired continuous sage ramp ────────────────
        // All colors sit on the same warm green-yellow hue family so
        // transitions between adjacent section tones read as soft even
        // with hard cuts. Light dominant; two dark forest moments
        // (hero top + CTA/footer) for rhythm.
        bone: {
          DEFAULT: "#F2EFE0", // warm cream — page base
          deep:    "#EBE9D0", // subtle cream variation
          soft:    "#D3DAC0", // pale pistachio — the signature Paysages tone
        },
        ink: {
          DEFAULT: "#1F2A1C", // deep forest-black — primary text on light
          soft:    "#3F4E35", // secondary — rich forest
          muted:   "#6B7E55", // tertiary — olive
        },
        clay: {
          DEFAULT: "#C9844E", // warm terracotta — Pro accent
          soft:    "#D9A478",
        },
        brand: {
          "sage-mist":     "#cad2c5",
          "sage-bright":   "#B8D4BD",
          sage:            "#8AAA91",
          // Forest family — redefined from the old teal-blue tokens to a
          // continuous olive-green ramp so `bg-brand-forest`/`-deep`/
          // `-midnight` blend with the bone/ink family above.
          forest:          "#3F4E35",
          deep:            "#2A3524",
          midnight:        "#1F2A1C",
          "midnight-dark": "#151A11",
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
          "0%,100%": { boxShadow: "0 0 16px rgba(138,170,145,0.28)" },
          "50%":     { boxShadow: "0 0 28px rgba(138,170,145,0.55)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
