/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  safelist: [
    "bg-cyan-500/10", "text-cyan-300", "border-cyan-400/20",
    "bg-purple-500/10", "text-purple-300", "border-purple-400/20",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
