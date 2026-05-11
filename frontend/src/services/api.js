// ============================================================
// services/api.js — Configuration centrale d'Axios
// Définit l'instance HTTP de base pour communiquer avec l'API Laravel
// ============================================================

import axios from 'axios'

// Création de l'instance Axios avec l'URL de base de l'API
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 10000, // Délai d'attente de 10 secondes maximum
})

// ---- Intercepteur de requêtes ----
// Permet d'ajouter un token d'auth si nécessaire à l'avenir
api.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
)

// ---- Intercepteur de réponses ----
// Gestion centralisée des erreurs HTTP
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message || 'Une erreur est survenue. Veuillez réessayer.'
    console.error('[API Error]', message, error)
    return Promise.reject(error)
  }
)

export default api
