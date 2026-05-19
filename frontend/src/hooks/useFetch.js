// ============================================================
// hooks/useFetch.js — Hook personnalisé pour les appels API
// Gère automatiquement les états loading, data et error
// ============================================================

import { useState, useEffect, useRef } from 'react'

const useFetch = (fetchFn, deps = []) => {
  const [data, setData]       = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)
  const hasData = useRef(false)

  const fetchData = async (silent = false) => {
    // Si on a déjà des données (cache API ou visite précédente), pas de spinner
    if (!silent && !hasData.current) setLoading(true)
    setError(null)
    try {
      const response = await fetchFn()
      const result = response.data?.data ?? response.data
      hasData.current = true
      setData(result)
    } catch (err) {
      setError(err.response?.data?.message || 'Impossible de charger les données.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return { data, loading, error, refetch: () => fetchData(true) }
}

export default useFetch
