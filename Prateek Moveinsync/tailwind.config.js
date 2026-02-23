/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0066CC',
        secondary: '#1A3A52',
        tertiary: '#2D5A8C',
        accent: '#FF6B35',
        success: '#10B981',
        warning: '#F59E0B',
        danger: '#EF4444',
        light: '#F8FAFC',
        lighter: '#F1F5F9',
        dark: '#1F2937',
        darker: '#111827',
      },
    },
  },
  plugins: [],
}
