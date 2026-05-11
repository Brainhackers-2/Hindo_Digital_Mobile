// ============================================================
// services/formationsApi.js — Formations depuis Supabase
// ============================================================

import { supabase } from '../lib/supabase'

export const getFormations = async () => {
  const { data, error } = await supabase
    .from('formations')
    .select('*')
    .order('titre', { ascending: true })

  if (error) throw error
  return { data: { data } }
}

export const inscrireFormation = async (formData) => {
  const { data, error } = await supabase
    .from('inscriptions')
    .insert([{
      nom:          formData.nom,
      email:        formData.email,
      telephone:    formData.telephone || null,
      formation_id: formData.formation_id,
    }])
    .select()
    .single()

  if (error) throw error
  return { data: { data, success: true } }
}
