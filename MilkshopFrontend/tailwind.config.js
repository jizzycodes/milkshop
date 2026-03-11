/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "green-primary": "#97b64c",
        "green-dark": "#62840b",
        "green-light": "#b7cd7f",
        "green-muted": "#b7cd7f",
        "amber-accent": "#E8A020",
        "surface-bg": "#f5f8ef",
        "border-color": "#d0e0b0",
        "text-primary": "#1e1e1e",
        "text-secondary": "#5a5a5a",
      },
      fontFamily: {
        sans: ["Signia Pro", "DM Sans", "sans-serif"],
        mono: ["DM Mono", "monospace"],
      },
      transitionTimingFunction: {
        soft: "cubic-bezier(0.22, 0.61, 0.36, 1)",
      },
      animation: {
        "spin-slow": "spin 20s linear infinite",
        "page-in": "fade-slide 0.4s cubic-bezier(0.22, 0.61, 0.36, 1) both",
      },
      keyframes: {
        "fade-slide": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};