/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["Cinzel", "serif"],
        body: ["Inter", "sans-serif"],
      },
      colors: {
        background: "#1a0f12",   // fundo principal
        surface: "#2a161b",      // cards
        border: "#3a1f26",

        primary: "#7a1f2b",      // borgonha base
        primaryHover: "#922737",

        accent: "#d4a373",       // dourado suave
        accentSoft: "#e6c7a1",

        text: "#f5e9e2",
        textSoft: "#c9b8ae",
      },

      fontFamily: {
        display: ["Cinzel", "serif"],   // títulos RPG vibe
        body: ["Inter", "sans-serif"],  // leitura confortável
      },

      boxShadow: {
        card: "0 4px 20px rgba(0,0,0,0.4)",
      },
    },
  },
  plugins: [],
}