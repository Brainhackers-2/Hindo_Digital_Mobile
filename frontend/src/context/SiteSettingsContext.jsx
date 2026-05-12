// ============================================================
// context/SiteSettingsContext.jsx — Logo, photo équipe et image hero
// ============================================================

import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

const SiteSettingsContext = createContext(null)

const publicUrl = (path) =>
  path ? supabase.storage.from('hindo-media').getPublicUrl(path).data.publicUrl : null

export const SiteSettingsProvider = ({ children }) => {
  const [logoUrl,       setLogoUrl]       = useState(null)
  const [teamImageUrl,  setTeamImageUrl]  = useState(null)
  const [heroImageUrl,  setHeroImageUrl]  = useState(null) // Image hero section accueil
  const [loading,       setLoading]       = useState(true)

  const chargerSettings = useCallback(async () => {
    try {
      const { data } = await supabase.from('settings').select('key, value')
      const map = {}
      ;(data || []).forEach(row => { map[row.key] = row.value })
      setLogoUrl(publicUrl(map.logo_path))
      setTeamImageUrl(publicUrl(map.team_image_path))
      setHeroImageUrl(publicUrl(map.hero_image_path))
    } catch {
      setLogoUrl(null); setTeamImageUrl(null); setHeroImageUrl(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    chargerSettings()
    const canal = supabase
      .channel('settings-logo-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'settings' }, () => {
        chargerSettings()
      })
      .subscribe()
    return () => { supabase.removeChannel(canal) }
  }, [chargerSettings])

  return (
    <SiteSettingsContext.Provider value={{ logoUrl, teamImageUrl, heroImageUrl, loading, rafraichir: chargerSettings }}>
      {children}
    </SiteSettingsContext.Provider>
  )
}

export const useSiteSettings = () => {
  const ctx = useContext(SiteSettingsContext)
  if (!ctx) throw new Error('useSiteSettings doit être dans SiteSettingsProvider')
  return ctx
}
