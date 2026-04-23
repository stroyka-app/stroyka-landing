import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // ─── v4: warm stone middle-ground ────────────────────────────────
        // Neutral warm-taupe ramp — not cream, not green. A quiet,
        // architectural palette that sits between light and dark. Sage
        // kept only as a tiny accent color; it no longer dominates.
        // Hex values chosen to form a continuous lightness ramp so
        // gradient bridges between any two adjacent tones read as seamless.
        bone: {
          DEFAULT: "#E3DCC9", // palest warm stone
          deep:    "#D4CBB4", // light stone
          soft:    "#BFB49C", // mid stone — the signature middle-ground
          warm:    "#A89E85", // deeper warm taupe
        },
        ink: {
          DEFAULT: "#2E261C", // near-black warm earth — primary text
          soft:    "#4A4033", // deep walnut — secondary text
          muted:   "#7A6E5B", // warm taupe — tertiary
        },
        clay: {
          DEFAULT: "#B8784E", // terracotta — Pro accent (warm, in family)
          soft:    "#CDA07A",
        },
        brand: {
          // Sage kept as a subtle accent — dots, hover glows, small type.
          "sage-mist":     "#cad2c5",
          "sage-bright":   "#B8D4BD",
          sage:            "#8AAA91",
          // Dark family — teal-sage (close to the original main hero
          // #2f3e46 Maks referenced). Reads as "sage/earth/pistachio"
          // darkened rather than forest green. Used at Hero top,
          // PlanToDone 3D canvas, and Footer.
          forest:          "#3E4C51",
          deep:            "#2A3842",
          midnight:        "#2A3842",
          "midnight-dark": "#1F2B2F",
          amber:           "#d97706",
          "amber-bright":  "#f59e0b",
        },
      },
      fontFamily: {
        display: ["var(--font-fraunces)",      "Georgia", "serif"],
        // `heading` aliases to body (Inter) — Space Grotesk retired in v6
        // to trim to three faces: Fraunces (display), Inter (everything),
        // JetBrains Mono (small tech/data accents).
        heading: ["var(--font-inter)",         "system-ui", "sans-serif"],
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
          "0%,100%": { boxShadow: "0 0 16px rgba(138,170,145,0.25)" },
          "50%":     { boxShadow: "0 0 28px rgba(138,170,145,0.5)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
