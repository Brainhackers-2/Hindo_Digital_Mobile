// ============================================================
// components/ScrollToTop.jsx — Remonte en haut à chaque navigation
// Corrige le comportement par défaut du routeur React
// ============================================================

import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const ScrollToTop = () => {
  const { pathname } = useLocation()

  // Défile vers le haut chaque fois que le chemin change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [pathname])

  return null // Ce composant ne rend rien visuellement
}

export default ScrollToTop
