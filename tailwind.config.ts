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
        // Design System Colors
        primary: {
          DEFAULT: "#4A6EED",
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#E6F0FF",
          foreground: "#4A6EED",
        },
        background: "#F5F7FA",
        surface: "#FFFFFF",
        text: {
          dark: "#1F2937",
          medium: "#4B5563",
          light: "#9CA3AF",
        },
        border: "#E5E7EB",
        success: "#34D399",
        warning: "#F59E0B",
        destructive: "#EF4444",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "SF Mono", "Consolas", "Liberation Mono", "Menlo", "monospace"],
      },
      fontSize: {
        // Design System Typography
        "h1": ["32px", { lineHeight: "1.2", fontWeight: "700" }],
        "h2": ["24px", { lineHeight: "1.2", fontWeight: "600" }],
        "h3": ["18px", { lineHeight: "1.2", fontWeight: "600" }],
        "body": ["14px", { lineHeight: "1.5", fontWeight: "400" }],
        "caption": ["12px", { lineHeight: "1.4", fontWeight: "400" }],
      },
      spacing: {
        // Design System Spacing
        "xs": "4px",
        "sm": "8px",
        "md": "16px",
        "lg": "24px",
        "xl": "32px",
      },
      borderRadius: {
        // Design System Border Radius
        "sm": "4px",
        "md": "8px",
        "lg": "12px",
      },
      boxShadow: {
        // Design System Shadows
        "card": "0px 4px 12px rgba(0, 0, 0, 0.05)",
      },
    },
  },
  plugins: [],
};

export default config;
