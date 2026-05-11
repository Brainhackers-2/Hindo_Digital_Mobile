// ============================================================
// services/servicesApi.js — Services depuis Supabase
// ============================================================

import { supabase } from '../lib/supabase'

export const getServices = async () => {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .order('ordre', { ascending: true })

  if (error) throw error
  return { data: { data } }
}
