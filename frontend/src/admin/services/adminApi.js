// ============================================================
// admin/services/adminApi.js — Instance Axios pour l'API admin
// Ajoute automatiquement le token Bearer depuis localStorage
// ============================================================

import axios from 'axios'

const adminApi = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1',
  headers: {
    Accept: 'application/json',
  },
  timeout: 15000,
})

// Injecte le token sauvegardé au démarrage si présent
const token = localStorage.getItem('hindo_admin_token')
if (token) {
  adminApi.defaults.headers.common['Authorization'] = `Bearer ${token}`
}

// Intercepteur réponse — redirige vers /admin/login si 401
adminApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('hindo_admin_token')
      window.location.href = '/admin/login'
    }
    return Promise.reject(error)
  }
)

export default adminApi
