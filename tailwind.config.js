/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        cinema: {
          black: "#0A0A0A",
          dark: "#111111",
          card: "#181818",
          border: "#2A2A2A",
          red: "#E50914",
          "red-dark": "#B0060F",
          "red-glow": "#FF1A2430",
          gold: "#FFD700",
          silver: "#C0C0C0",
          muted: "#666666",
          text: "#F0F0F0",
        },
      },
      fontFamily: {
        display: ["'Bebas Neue'", "cursive"],
        body: ["'DM Sans'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      boxShadow: {
        "red-glow": "0 0 30px rgba(229, 9, 20, 0.4)",
        "red-glow-sm": "0 0 15px rgba(229, 9, 20, 0.3)",
        "gold-glow": "0 0 20px rgba(255, 215, 0, 0.3)",
        "card-3d": "0 20px 60px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.05)",
      },
      animation: {
        "float": "float 6s ease-in-out infinite",
        "pulse-red": "pulseRed 2s ease-in-out infinite",
        "scan": "scan 3s linear infinite",
        "shimmer": "shimmer 2s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        pulseRed: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(229, 9, 20, 0.3)" },
          "50%": { boxShadow: "0 0 40px rgba(229, 9, 20, 0.7)" },
        },
        scan: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100vh)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      backgroundImage: {
        "noise": "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.05'/%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [],
};
