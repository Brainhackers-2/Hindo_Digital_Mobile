// admin/context/AuthAdminContext.jsx — Auth admin avec rôles et permissions

import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { supabase } from '../../lib/supabase'

const AuthAdminContext = createContext(null)

export const AuthAdminProvider = ({ children }) => {
  const [admin,          setAdmin]          = useState(null)
  const [profil,         setProfil]         = useState(null) // {nom, est_super_admin, permissions}
  const [loading,        setLoading]        = useState(true)

  const chargerProfil = useCallback(async (user) => {
    if (!user) { setProfil(null); return }
    try {
      const { data } = await supabase
        .from('admin_profiles')
        .select('nom, est_super_admin, permissions')
        .eq('id', user.id)
        .maybeSingle()
      setProfil(data || { nom: user.email, est_super_admin: false, permissions: [] })
    } catch {
      setProfil({ nom: user.email, est_super_admin: false, permissions: [] })
    }
  }, [])

  useEffect(() => {
    // Timeout de sécurité : si Supabase ne répond pas en 5s, on débloque quand même
    const timeout = setTimeout(() => setLoading(false), 5000)

    supabase.auth.getSession()
      .then(async ({ data: { session } }) => {
        setAdmin(session?.user ?? null)
        await chargerProfil(session?.user ?? null)
      })
      .catch(() => {})
      .finally(() => {
        clearTimeout(timeout)
        setLoading(false)
      })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setAdmin(session?.user ?? null)
      await chargerProfil(session?.user ?? null)
      setLoading(false)
    })

    return () => {
      clearTimeout(timeout)
      subscription.unsubscribe()
    }
  }, [chargerProfil])

  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    setAdmin(data.user)
    await chargerProfil(data.user)
    return data
  }

  const logout = async () => {
    await supabase.auth.signOut()
    setAdmin(null)
    setProfil(null)
  }

  // Vérifie si l'admin a accès à une page donnée
  const aAcces = (page) => {
    if (!profil) return false
    if (profil.est_super_admin) return true
    if (profil.permissions?.includes('all')) return true
    return profil.permissions?.includes(page) ?? false
  }

  return (
    <AuthAdminContext.Provider value={{
      admin, profil, loading,
      login, logout,
      isAuth: !!admin,
      isSuperAdmin: profil?.est_super_admin ?? false,
      aAcces,
    }}>
      {children}
    </AuthAdminContext.Provider>
  )
}

export const useAuthAdmin = () => {
  const ctx = useContext(AuthAdminContext)
  if (!ctx) throw new Error('useAuthAdmin doit être utilisé dans AuthAdminProvider')
  return ctx
}
