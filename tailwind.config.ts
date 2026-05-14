import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        coral: {
          50: "#fff1ed",
          100: "#ffe0d7",
          200: "#ffc5b6",
          300: "#ff9f89",
          400: "#ff7e67",
          500: "#f45f4d",
          600: "#df4131",
          700: "#bd3024",
          800: "#9c2b23",
          900: "#812a24"
        },
        border: "hsl(var(--border) / <alpha-value>)",
        input: "hsl(var(--input) / <alpha-value>)",
        ring: "hsl(var(--ring) / <alpha-value>)",
        background: "hsl(var(--background) / <alpha-value>)",
        foreground: "hsl(var(--foreground) / <alpha-value>)",
        primary: {
          DEFAULT: "hsl(var(--primary) / <alpha-value>)",
          foreground: "hsl(var(--primary-foreground) / <alpha-value>)"
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary) / <alpha-value>)",
          foreground: "hsl(var(--secondary-foreground) / <alpha-value>)"
        },
        muted: {
          DEFAULT: "hsl(var(--muted) / <alpha-value>)",
          foreground: "hsl(var(--muted-foreground) / <alpha-value>)"
        },
        accent: {
          DEFAULT: "hsl(var(--accent) / <alpha-value>)",
          foreground: "hsl(var(--accent-foreground) / <alpha-value>)"
        },
        card: {
          DEFAULT: "hsl(var(--card) / <alpha-value>)",
          foreground: "hsl(var(--card-foreground) / <alpha-value>)"
        }
      },
      boxShadow: {
        glow: "0 24px 80px rgba(0, 92, 150, 0.18)",
        coral: "0 18px 60px rgba(255, 126, 103, 0.22)",
        navy: "0 28px 90px rgba(3, 18, 43, 0.35)"
      },
      backgroundImage: {
        "coral-gradient": "linear-gradient(135deg, #ff7e67 0%, #f66f8d 100%)",
        "aegean-gradient":
          "radial-gradient(circle at 18% 20%, rgba(125, 211, 252, 0.42), transparent 32%), linear-gradient(135deg, #004b7a 0%, #0a75a9 46%, #eaf8ff 100%)",
        "night-sea-gradient":
          "radial-gradient(circle at 76% 18%, rgba(20, 184, 166, 0.24), transparent 30%), radial-gradient(circle at 18% 76%, rgba(255, 126, 103, 0.18), transparent 28%), linear-gradient(135deg, #031225 0%, #082746 48%, #0b3f5f 100%)"
      },
      fontFamily: {
        sans: [
          "Manrope",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif"
        ],
        display: [
          "Sail",
          "Georgia",
          "Cambria",
          "serif"
        ]
      }
    }
  },
  plugins: []
} satisfies Config;
