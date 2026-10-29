import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    container: { center: true, padding: { DEFAULT: "1rem", lg: "2rem" }, screens: { "2xl": "1280px" } },
    extend: {
      colors: {
        brand: {
          50: "#EBF4FF",
          100: "#D6E9FF",
          200: "#A8D0FF",
          300: "#6FB1FF",
          400: "#3896FF",
          500: "#087CFF",
          600: "#0063D6",
          700: "#004DA8",
          800: "#003A80",
          900: "#002A5C",
        },
        ink: {
          DEFAULT: "#080F20",
          800: "#0E1830",
          700: "#16223F",
          600: "#22305A",
        },
        whatsapp: "#25D366",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "var(--font-sans)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(8,15,32,.04), 0 8px 24px -12px rgba(8,15,32,.18)",
        glow: "0 0 0 1px rgba(8,124,255,.35), 0 12px 40px -8px rgba(8,124,255,.55)",
      },
      keyframes: {
        "fade-up": { from: { opacity: "0", transform: "translateY(12px)" }, to: { opacity: "1", transform: "none" } },
        "slide-in": { from: { transform: "translateX(100%)" }, to: { transform: "none" } },
        "slide-in-rtl": { from: { transform: "translateX(-100%)" }, to: { transform: "none" } },
        float: { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-10px)" } },
        pulse_ring: { "0%": { transform: "scale(.9)", opacity: ".7" }, "100%": { transform: "scale(1.6)", opacity: "0" } },
      },
      animation: {
        "fade-up": "fade-up .5s ease-out both",
        "slide-in": "slide-in .3s cubic-bezier(.2,.8,.2,1) both",
        "slide-in-rtl": "slide-in-rtl .3s cubic-bezier(.2,.8,.2,1) both",
        float: "float 6s ease-in-out infinite",
        "pulse-ring": "pulse_ring 1.8s ease-out infinite",
      },
    },
  },
  plugins: [],
} satisfies Config;
