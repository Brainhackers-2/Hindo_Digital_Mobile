// ============================================================
// hooks/useForm.js — Hook personnalisé pour la gestion des formulaires
// Simplifie la gestion des champs, validation et soumission
// ============================================================

import { useState } from 'react'

/**
 * Hook générique pour les formulaires React
 * @param {Object} initialValues — Valeurs initiales des champs
 * @param {Function} onSubmit — Fonction appelée à la soumission
 * @returns {{ values, errors, loading, success, handleChange, handleSubmit, reset }}
 */
const useForm = (initialValues, onSubmit) => {
  const [values, setValues]   = useState(initialValues)
  const [errors, setErrors]   = useState({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  // Met à jour un champ du formulaire
  const handleChange = (e) => {
    const { name, value } = e.target
    setValues((prev) => ({ ...prev, [name]: value }))
    // Efface l'erreur du champ modifié
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  // Gère la soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setSuccess(false)
    try {
      await onSubmit(values)
      setSuccess(true)
      reset() // Réinitialise le formulaire après succès
    } catch (err) {
      // Récupère les erreurs de validation Laravel (422)
      if (err.response?.status === 422) {
        const laravelErrors = err.response.data.errors || {}
        const formatted = {}
        Object.keys(laravelErrors).forEach((key) => {
          formatted[key] = laravelErrors[key][0]
        })
        setErrors(formatted)
      }
    } finally {
      setLoading(false)
    }
  }

  // Réinitialise le formulaire à ses valeurs initiales
  const reset = () => {
    setValues(initialValues)
    setErrors({})
  }

  return { values, errors, loading, success, handleChange, handleSubmit, reset }
}

export default useForm
