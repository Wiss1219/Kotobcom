
import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Define brand-specific colors for direct access - Green version
        brand: {
          // Dark mode colors - Green palette
          green: '#49ab81', // Brightest green from palette
          greenLight: '#4fba8c', // Brighter accent green
          greenMedium: '#398564', // Medium green from palette
          greenDark: '#317256', // Darkest green from palette

          // Light mode colors - Specified cream/beige palette
          white: '#ffffff',
          cream: '#e7e1c8', // Main background
          creamLight: '#f3edda', // Lighter cream
          creamMedium: '#ece7d5', // Medium cream
          creamDark: '#dcd6c3', // Darker cream
          gold: '#ded7ba', // Primary color

          // Background colors
          dark: '#2a3e36' // Dark green background (for dark mode)
        },
        // Define green theme colors for direct access
        greenDark: {
          darkest: '#2a3e36', // Dark green background
          dark: '#317256', // Darkest green from palette
          medium: '#398564', // Medium green from palette
          light: '#49ab81', // Brightest green from palette
          lighter: '#4fba8c', // Brighter accent green
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "float-slow": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "float-medium": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-15px)" },
        },
        "float-fast": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-20px)" },
        },
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "float-slow": "float-slow 6s ease-in-out infinite",
        "float-medium": "float-medium 5s ease-in-out infinite",
        "float-fast": "float-fast 4s ease-in-out infinite",
        "fade-in": "fade-in 0.5s ease-out forwards",
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      // 3D transform utilities
      perspective: {
        'none': 'none',
        '500': '500px',
        '1000': '1000px',
      },
      rotate: {
        'y-6': 'rotateY(6deg)',
        'y-12': 'rotateY(12deg)',
        'y-0': 'rotateY(0deg)',
        'x-3': 'rotateX(3deg)',
        'x-6': 'rotateX(6deg)',
        'x-0': 'rotateX(0deg)',
      },
      transformStyle: {
        'flat': 'flat',
        'preserve-3d': 'preserve-3d',
      }
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
