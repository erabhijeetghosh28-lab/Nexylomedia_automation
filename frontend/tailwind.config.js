/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#4f46e5",
          foreground: "#ffffff",
          light: "#6366f1",
          dark: "#3730a3",
          muted: "#eef2ff",
        },
        secondary: {
          DEFAULT: "#8b5cf6",
          foreground: "#ffffff",
          light: "#a855f7",
          dark: "#6d28d9",
          muted: "#f3e8ff",
        },
        success: {
          DEFAULT: "#10b981",
          foreground: "#ffffff",
          muted: "#d1fae5",
        },
        warning: {
          DEFAULT: "#f59e0b",
          foreground: "#111827",
          muted: "#fef3c7",
        },
        danger: {
          DEFAULT: "#ef4444",
          foreground: "#ffffff",
          muted: "#fee2e2",
        },
        info: {
          DEFAULT: "#0ea5e9",
          foreground: "#0f172a",
          muted: "#e0f2fe",
        },
        bg: {
          DEFAULT: "#f8fafc",
          subtle: "#f1f5f9",
          surface: "#ffffff",
          inverted: "#0f172a",
        },
        muted: {
          DEFAULT: "#94a3b8",
          darker: "#64748b",
          lighter: "#cbd5f5",
        },
        border: {
          DEFAULT: "#e2e8f0",
          strong: "#cbd5f5",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          "sans-serif",
        ],
        mono: ["'JetBrains Mono'", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      fontSize: {
        h1: ["2.75rem", { lineHeight: "1.1", fontWeight: "700" }],
        h2: ["2.25rem", { lineHeight: "1.1", fontWeight: "700" }],
        h3: ["1.875rem", { lineHeight: "1.2", fontWeight: "600" }],
        h4: ["1.5rem", { lineHeight: "1.3", fontWeight: "600" }],
        h5: ["1.25rem", { lineHeight: "1.4", fontWeight: "600" }],
        h6: ["1.125rem", { lineHeight: "1.5", fontWeight: "600" }],
        body: ["1rem", { lineHeight: "1.6", fontWeight: "400" }],
        small: ["0.875rem", { lineHeight: "1.5", fontWeight: "500" }],
        xsmall: ["0.75rem", { lineHeight: "1.5", fontWeight: "500" }],
      },
      spacing: {
        xs: "0.5rem",
        sm: "0.75rem",
        md: "1rem",
        lg: "1.5rem",
        xl: "2rem",
        "2xl": "3rem",
      },
      boxShadow: {
        subtle: "0 10px 20px -12px rgba(15, 23, 42, 0.12)",
        medium: "0 18px 30px -15px rgba(15, 23, 42, 0.18)",
      },
      borderRadius: {
        xl: "1rem",
      },
      screens: {
        xs: "480px",
      },
    },
  },
  plugins: [],
};

