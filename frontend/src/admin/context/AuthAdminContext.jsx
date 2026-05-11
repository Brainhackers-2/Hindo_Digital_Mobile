// ============================================================
// admin/context/AuthAdminContext.jsx — Auth admin via Supabase Auth
// Remplace l'ancien système Sanctum (Laravel)
// ============================================================

import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

const AuthAdminContext = createContext(null)

export const AuthAdminProvider = ({ children }) => {
  const [admin, setAdmin]     = useState(null)
  const [loading, setLoading] = useState(true)

  // Écoute les changements de session Supabase
  useEffect(() => {
    // Récupère la session existante au démarrage
    supabase.auth.getSession().then(({ data: { session } }) => {
      setAdmin(session?.user ?? null)
      setLoading(false)
    })

    // Écoute les connexions/déconnexions en temps réel
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setAdmin(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    setAdmin(data.user)
    return data
  }

  const logout = async () => {
    await supabase.auth.signOut()
    setAdmin(null)
  }

  return (
    <AuthAdminContext.Provider value={{ admin, loading, login, logout, isAuth: !!admin }}>
      {children}
    </AuthAdminContext.Provider>
  )
}

export const useAuthAdmin = () => {
  const ctx = useContext(AuthAdminContext)
  if (!ctx) throw new Error('useAuthAdmin doit être utilisé dans AuthAdminProvider')
  return ctx
}
