// ============================================================
// tailwind.config.js — Configuration Tailwind CSS pour Hindo Digital
// Définit les couleurs, typographies et extensions personnalisées
// ============================================================

/** @type {import('tailwindcss').Config} */
export default {
  // Fichiers à scanner pour générer les classes CSS utilisées
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    extend: {
      // ---- Palette de couleurs Hindo Digital ----
      colors: {
        primary: {
          DEFAULT: '#8B0000', // Rouge bordeaux — couleur principale
          light: '#A52A2A',
          dark: '#6B0000',
        },
        secondary: {
          DEFAULT: '#2D2D2D', // Gris foncé — textes et fonds sombres
          light: '#3D3D3D',
        },
        neutral: {
          DEFAULT: '#F5F5F5', // Gris clair — fonds neutres
          dark: '#E0E0E0',
        },
      },

      // ---- Typographie Google Fonts ----
      fontFamily: {
        sans: ['Inter', 'Poppins', 'system-ui', 'sans-serif'],
        heading: ['Poppins', 'Inter', 'sans-serif'],
      },

      // ---- Animations personnalisées ----
      animation: {
        'fade-in': 'fadeIn 0.6s ease-in-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'slide-in-left': 'slideInLeft 0.6s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideInLeft: {
          '0%': { transform: 'translateX(-30px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
      },

      // ---- Ombres personnalisées ----
      boxShadow: {
        card: '0 4px 20px rgba(0,0,0,0.08)',
        'card-hover': '0 8px 30px rgba(139,0,0,0.15)',
      },
    },
  },

  plugins: [],
}
