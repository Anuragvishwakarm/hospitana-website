import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        primary: "#0066CC",
        secondary: "#00A86B",
        accent: "#FF6B35",
        cream: {
          50: "#FFFFFF",
          100: "#F8FAFC",
          200: "#E2E8F0",
        },
        ink: {
          900: "#111827",
          800: "#1F2937",
          700: "#374151",
          500: "#6B7280",
          400: "#9CA3AF",
        },
        forest: {
          50: "#EFF6FF",
          100: "#DBEAFE",
          500: "#2563EB",
          700: "#0066CC",
          900: "#1E3A8A",
        },
        clay: {
          50: "#FEF2F2",
          400: "#F87171",
          500: "#DC2626",
          600: "#B91C1C",
        },
      },
      fontFamily: {
        display: ['"Inter"', "system-ui", "sans-serif"],
        body: ['"Inter"', "system-ui", "sans-serif"],
      },
      animation: {
        "fade-up": "fadeUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        marquee: "marquee 40s linear infinite",
        float: "float 6s ease-in-out infinite",
        "pulse-soft": "pulseSoft 2.5s ease-in-out infinite",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.55" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
