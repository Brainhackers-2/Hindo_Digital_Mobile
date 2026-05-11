// ============================================================
// hooks/useFetch.js — Hook personnalisé pour les appels API
// Gère automatiquement les états loading, data et error
// ============================================================

import { useState, useEffect } from 'react'

/**
 * Hook générique de récupération de données depuis une API
 * @param {Function} fetchFn — Fonction API à appeler (ex: getServices)
 * @param {Array} deps — Dépendances qui déclenchent un rechargement
 * @returns {{ data, loading, error, refetch }}
 */
const useFetch = (fetchFn, deps = []) => {
  const [data, setData]       = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetchFn()
      // L'API Laravel renvoie { success, data, message }
      setData(response.data?.data ?? response.data)
    } catch (err) {
      setError(
        err.response?.data?.message || 'Impossible de charger les données.'
      )
    } finally {
      setLoading(false)
    }
  }

  // Déclenche le fetch au montage et quand les dépendances changent
  useEffect(() => {
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return { data, loading, error, refetch: fetchData }
}

export default useFetch
