import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // ─── Dusk site (experiment/opus55-wow home) ─────────────────────
        site: {
          // Token-driven (globals.css → "Dusk site palettes"), so the
          // whole home can be re-skinned at runtime via <html data-palette>.
          sky:     "var(--sky-top)",
          night:   "rgb(var(--site-night) / <alpha-value>)",
          slab:    "rgb(var(--site-slab) / <alpha-value>)",
          rule:    "rgb(var(--site-rule) / <alpha-value>)",
          paper:   "rgb(var(--site-paper) / <alpha-value>)",
          haze:    "rgb(var(--site-haze) / <alpha-value>)",
          vis:     "rgb(var(--site-vis) / <alpha-value>)",
          "vis-hover": "rgb(var(--site-vis-hover) / <alpha-value>)",
          "on-vis": "rgb(var(--site-on-vis) / <alpha-value>)",
          alert:   "rgb(var(--site-alert) / <alpha-value>)",
        },
        // ─── v4: warm stone middle-ground ────────────────────────────────
        // Neutral warm-taupe ramp — not cream, not green. A quiet,
        // architectural palette that sits between light and dark. Sage
        // kept only as a tiny accent color; it no longer dominates.
        // Hex values chosen to form a continuous lightness ramp so
        // gradient bridges between any two adjacent tones read as seamless.
        bone: {
          // Remapped onto Morning Bone (2026-09-24) so any legacy class
          // lands in the new system. Prefer the site-* tokens in new code.
          DEFAULT: "#ECE6D8", // = site-night, the bone page
          deep:    "#E1D9C6", // = site-slab
          soft:    "#CFC5AE", // = site-rule
          warm:    "#B9B199",
        },
        ink: {
          DEFAULT: "#1F1C16", // = site-paper, the ink
          soft:    "#4A4033", // deep walnut — secondary text
          muted:   "#7A6E5B", // warm taupe — tertiary
        },
        clay: {
          DEFAULT: "#B8784E", // terracotta — Pro accent (warm, in family)
          soft:    "#CDA07A",
        },
        brand: {
          // Living sage family — clearly green-dominant, chromatic, alive.
          // Spans from pale pistachio pop down to deep sage dark.
          "sage-mist":     "#cad2c5",
          "sage-bright":   "#B8D4BD",
          sage:            "#8AAA91",
          // Dark sage family → Morning Bone forest (= site-vis and deeper).
          forest:          "#2F5B45",
          deep:            "#2F5B45",
          midnight:        "#264C39",
          "midnight-dark": "#1F3A2C",
          amber:           "#d97706",
          "amber-bright":  "#f59e0b",
        },
      },
      fontFamily: {
        flex:    ["var(--font-flex)", "var(--font-inter)", "system-ui", "sans-serif"],
        // Morning Bone's display face is Roboto Flex; `font-display` follows
        // it so legacy headings join the system. (Fraunces stays loaded only
        // while something still asks for it by name.)
        display: ["var(--font-flex)", "var(--font-inter)", "system-ui", "sans-serif"],
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
