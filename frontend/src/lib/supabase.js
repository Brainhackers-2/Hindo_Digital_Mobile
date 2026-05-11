// ============================================================
// lib/supabase.js — Client Supabase centralisé
// Utilisé par toutes les pages et services de l'application
// Remplace complètement Laravel + Axios
// ============================================================

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL      = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('[Supabase] Variables VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY manquantes dans .env')
}

// Client principal (utilisé par le site public)
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

export default supabase
