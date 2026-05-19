// ============================================================
// vite.config.js — Configuration de Vite pour Hindo Digital
// Gère le serveur de développement, le proxy API et le build
// ============================================================

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],

  server: {
    port: 3000,
    proxy: {
      '/api/chat':   { target: 'http://localhost:8000', changeOrigin: true, secure: false },
      '/api/gemini': { target: 'http://localhost:8000', changeOrigin: true, secure: false },
    },
  },

  resolve: {
    alias: { '@': '/src' },
  },

  // Supprime console.log en production
  esbuild: {
    drop: ['console', 'debugger'],
  },

  build: {
    // Découpe le bundle en chunks mis en cache séparément
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react':    ['react', 'react-dom', 'react-router-dom'],
          'vendor-motion':   ['framer-motion'],
          'vendor-supabase': ['@supabase/supabase-js'],
        },
      },
    },
    chunkSizeWarningLimit: 600,
  },
})
