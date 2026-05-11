// ============================================================
// services/contactApi.js — Contact, Newsletter, Témoignages
// Tout passe par Supabase directement
// ============================================================

import { supabase } from '../lib/supabase'

export const envoyerContact = async (formData) => {
  const { error } = await supabase
    .from('contacts')
    .insert([{
      nom:       formData.nom,
      email:     formData.email,
      telephone: formData.telephone || null,
      sujet:     formData.sujet,
      message:   formData.message,
      lu:        false,
    }])

  if (error) throw error
  return { data: { success: true } }
}

export const abonnerNewsletter = async (formData) => {
  // Vérifie si l'email existe déjà
  const { data: existant } = await supabase
    .from('newsletters')
    .select('id, actif')
    .eq('email', formData.email)
    .maybeSingle()

  if (existant) {
    if (!existant.actif) {
      await supabase.from('newsletters').update({ actif: true }).eq('id', existant.id)
    }
    return { data: { success: true } }
  }

  const { error } = await supabase
    .from('newsletters')
    .insert([{ email: formData.email, actif: true }])

  if (error) throw error
  return { data: { success: true } }
}

export const getTemoignages = async () => {
  const { data, error } = await supabase
    .from('temoignages')
    .select('*')
    .eq('actif', true)
    .order('created_at', { ascending: false })
    .limit(6)

  if (error) throw error
  return { data: { data } }
}
