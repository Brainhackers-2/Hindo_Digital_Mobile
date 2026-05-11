// ============================================================
// services/realisationsApi.js — Réalisations depuis Supabase
// ============================================================

import { supabase } from '../lib/supabase'

export const getRealisations = async () => {
  const { data, error } = await supabase
    .from('realisations')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error

  // Construit l'URL publique de chaque image via Supabase Storage
  const enriched = (data || []).map((r) => ({
    ...r,
    image_url: r.image_path
      ? supabase.storage.from('hindo-media').getPublicUrl(r.image_path).data.publicUrl
      : null,
  }))

  return { data: { data: enriched } }
}
