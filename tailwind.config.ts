import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          "sage-mist": "#cad2c5",
          sage:        "#84a98c",
          forest:      "#52796f",
          deep:        "#354f52",
          midnight:    "#2f3e46",
        },
      },
      fontFamily: {
        heading: ["var(--font-space-grotesk)", "system-ui", "sans-serif"],
        body:    ["var(--font-inter)",         "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
