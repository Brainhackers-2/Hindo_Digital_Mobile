// ============================================================
// hooks/useFetchRealtime.js — Fetch avec écoute temps réel Supabase
// Recharge automatiquement les données quand la table change
// ============================================================

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

/**
 * Comme useFetch mais écoute les changements de table en temps réel
 * @param {Function} fetchFn  — fonction qui retourne les données
 * @param {string}   table    — nom de la table Supabase à écouter
 */
const useFetchRealtime = (fetchFn, table) => {
  const [data, setData]       = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  const fetchData = useCallback(async () => {
    try {
      const response = await fetchFn()
      setData(response.data?.data ?? response.data)
      setError(null)
    } catch (err) {
      setError(err.message || 'Erreur de chargement')
    } finally {
      setLoading(false)
    }
  }, [fetchFn])

  useEffect(() => {
    fetchData()

    if (!table) return

    // Écoute les INSERT, UPDATE, DELETE sur la table
    const canal = supabase
      .channel(`realtime-${table}`)
      .on('postgres_changes', { event: '*', schema: 'public', table }, () => {
        fetchData() // Recharge quand la table change
      })
      .subscribe()

    return () => { supabase.removeChannel(canal) }
  }, [table, fetchData])

  return { data, loading, error, refetch: fetchData }
}

export default useFetchRealtime
