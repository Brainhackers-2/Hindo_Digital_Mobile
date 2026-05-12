// ============================================================
// services/servicesApi.js — Services depuis Supabase
// Génère image_url depuis image_path pour l'affichage dans ServiceCard
// ============================================================

import { supabase } from '../lib/supabase'

const publicUrl = (path) =>
  path ? supabase.storage.from('hindo-media').getPublicUrl(path).data.publicUrl : null

export const getServices = async () => {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .order('ordre', { ascending: true })

  if (error) throw error

  // Génère l'URL publique de l'image pour chaque service
  const enriched = (data || []).map((s) => ({
    ...s,
    image_url: publicUrl(s.image_path),
  }))

  return { data: { data: enriched } }
}
