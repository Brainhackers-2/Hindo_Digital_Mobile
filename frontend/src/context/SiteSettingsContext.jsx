// ============================================================
// context/SiteSettingsContext.jsx — Paramètres globaux du site
// Charge le logo + la photo d'équipe depuis l'API Laravel
// ============================================================

import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import api from '../services/api'

const SiteSettingsContext = createContext(null)

export const SiteSettingsProvider = ({ children }) => {
  const [logoUrl,       setLogoUrl]       = useState(null)
  const [teamImageUrl,  setTeamImageUrl]  = useState(null)
  const [loading,       setLoading]       = useState(true)

  const chargerSettings = useCallback(async () => {
    try {
      const res = await api.get('/settings')
      setLogoUrl(res.data?.data?.logo_url        || null)
      setTeamImageUrl(res.data?.data?.team_image_url || null)
    } catch {
      setLogoUrl(null)
      setTeamImageUrl(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { chargerSettings() }, [chargerSettings])

  return (
    <SiteSettingsContext.Provider value={{ logoUrl, teamImageUrl, loading, rafraichir: chargerSettings }}>
      {children}
    </SiteSettingsContext.Provider>
  )
}

export const useSiteSettings = () => {
  const ctx = useContext(SiteSettingsContext)
  if (!ctx) throw new Error('useSiteSettings doit être utilisé dans SiteSettingsProvider')
  return ctx
}
