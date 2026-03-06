/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "green-primary": "#5A9216",
        "green-dark": "#3E6610",
        "green-light": "#EEF5E6",
        "green-muted": "#C8DFA8",
        "amber-accent": "#E8A020",
        "surface-bg": "#F7F9F4",
        "border-color": "#DDE8CF",
        "text-primary": "#1A2410",
        "text-secondary": "#5A6B4A",
      },
      fontFamily: {
        sans: ["DM Sans", "sans-serif"],
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