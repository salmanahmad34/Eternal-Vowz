import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        ivory: {
          DEFAULT: "#FAF8F5",
          50: "#FFFDFB",
          100: "#FAF8F5",
          200: "#F4EFEA",
          300: "#E9DFD4",
          400: "#D6C4B0",
          500: "#C0AA92",
        },
        charcoal: {
          DEFAULT: "#1C1917",
          50: "#F5F5F4",
          100: "#E7E5E4",
          200: "#D6D3D1",
          300: "#A8A29E",
          400: "#78716C",
          500: "#57534E",
          600: "#44403C",
          700: "#292524",
          800: "#1C1917",
          900: "#0C0A09",
        },
        gold: {
          DEFAULT: "#C5A059",
          50: "#FBF8F1",
          100: "#F6F0DF",
          200: "#EBDDBB",
          300: "#DFC895",
          400: "#D3B574",
          500: "#C5A059",
          600: "#A6823C",
          700: "#7E622C",
          800: "#5A451F",
          900: "#382A12",
        },
        emeraldTheme: {
          900: "#064E3B",
          800: "#065F46",
          700: "#047857",
        },
        blushTheme: {
          50: "#FFF5F7",
          100: "#FDF2F4",
          200: "#FBCFE8",
          600: "#BE185D",
          700: "#9D174D",
        },
        midnightTheme: {
          950: "#090D16",
          900: "#0F172A",
          800: "#1E293B",
        }
      },
      fontFamily: {
        serif: ["var(--font-cormorant)", "Playfair Display", "Georgia", "serif"],
        display: ["var(--font-playfair)", "Playfair Display", "serif"],
        sans: ["var(--font-jakarta)", "Plus Jakarta Sans", "Inter", "sans-serif"],
        calligraphy: ["var(--font-great-vibes)", "cursive"],
      },
      boxShadow: {
        'luxury': "0 20px 40px -15px rgba(28, 25, 23, 0.08), 0 0 25px rgba(197, 160, 89, 0.12)",
        'luxury-lg': "0 30px 60px -20px rgba(28, 25, 23, 0.15), 0 0 40px rgba(197, 160, 89, 0.2)",
        'wax': "0 6px 14px rgba(0, 0, 0, 0.35), inset 0 2px 4px rgba(255, 255, 255, 0.25), inset 0 -3px 5px rgba(0, 0, 0, 0.4)",
        'envelope': "0 25px 50px -12px rgba(28, 25, 23, 0.25), 0 0 30px rgba(0, 0, 0, 0.1)",
      },
      animation: {
        'shimmer': 'shimmer 2.5s infinite linear',
        'float': 'float 4s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.6', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.05)' },
        }
      }
    },
  },
  plugins: [],
};
export default config;
