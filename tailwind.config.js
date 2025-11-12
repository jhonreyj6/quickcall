/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#1E40AF",
        secondary: "#F59E0B",
        info: "#3B82F6",
        success: "#10B981",
        warning: "#FBBF24",
        danger: "#EF4444",
      },
      backgroundColor: {
        primary: "#020617",
        secondary: "#0f172a",
        info: "#3B82F6",
        success: "#10B981",
        warning: "#FBBF24",
        danger: "#EF4444",
      },
    },
  },
  plugins: [],
};
