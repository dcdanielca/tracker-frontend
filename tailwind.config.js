/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#1e3a8a",
          950: "#172554",
        },
        status: {
          open: "#10b981",
          in_progress: "#f59e0b",
          resolved: "#3b82f6",
          closed: "#6b7280",
        },
        priority: {
          low: "#10b981",
          medium: "#f59e0b",
          high: "#ef4444",
          critical: "#dc2626",
        },
      },
    },
  },
  plugins: [],
};
