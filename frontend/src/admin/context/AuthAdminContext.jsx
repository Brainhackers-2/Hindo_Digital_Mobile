// ============================================================
// admin/context/AuthAdminContext.jsx — Contexte d'authentification admin
// Gère le token Sanctum, l'état de connexion et les redirections
// ============================================================

import { createContext, useContext, useState, useEffect } from 'react'
import adminApi from '../services/adminApi'

const AuthAdminContext = createContext(null)

export const AuthAdminProvider = ({ children }) => {
  const [admin, setAdmin]     = useState(null)
  const [loading, setLoading] = useState(true) // Vérifie le token au démarrage

  // Au montage : vérifie si un token valide est stocké en localStorage
  useEffect(() => {
    const token = localStorage.getItem('hindo_admin_token')
    if (token) {
      adminApi.defaults.headers.common['Authorization'] = `Bearer ${token}`
      // Vérifie que le token est encore valide en appelant /me
      adminApi.get('/admin/me')
        .then((res) => setAdmin(res.data.data))
        .catch(() => {
          // Token expiré ou invalide — on déconnecte
          localStorage.removeItem('hindo_admin_token')
          delete adminApi.defaults.headers.common['Authorization']
        })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  // Connexion : stocke le token et charge les infos admin
  const login = async (email, password) => {
    const res   = await adminApi.post('/admin/login', { email, password })
    const token = res.data.data.token
    localStorage.setItem('hindo_admin_token', token)
    adminApi.defaults.headers.common['Authorization'] = `Bearer ${token}`
    setAdmin(res.data.data.user)
    return res.data
  }

  // Déconnexion : révoque le token et nettoie le state
  const logout = async () => {
    try {
      await adminApi.post('/admin/logout')
    } catch {
      // Ignore les erreurs réseau lors du logout
    }
    localStorage.removeItem('hindo_admin_token')
    delete adminApi.defaults.headers.common['Authorization']
    setAdmin(null)
  }

  return (
    <AuthAdminContext.Provider value={{ admin, loading, login, logout, isAuth: !!admin }}>
      {children}
    </AuthAdminContext.Provider>
  )
}

// Hook raccourci pour utiliser le contexte d'auth admin
export const useAuthAdmin = () => {
  const ctx = useContext(AuthAdminContext)
  if (!ctx) throw new Error('useAuthAdmin doit être utilisé dans AuthAdminProvider')
  return ctx
}
