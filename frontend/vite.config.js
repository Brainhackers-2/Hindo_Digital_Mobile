// ============================================================
// vite.config.js — Configuration de Vite pour Hindo Digital
// Gère le serveur de développement, le proxy API et le build
// ============================================================

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],

  // Serveur de développement local
  server: {
    port: 3000,
    // Proxy : redirige les appels /api vers Laravel (port 8000)
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
      },
    },
  },

  // Résolution des alias pour simplifier les imports
  resolve: {
    alias: {
      '@': '/src',
    },
  },
})
