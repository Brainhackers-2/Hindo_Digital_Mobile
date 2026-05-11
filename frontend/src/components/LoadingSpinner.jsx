// ============================================================
// components/LoadingSpinner.jsx — Indicateur de chargement
// Affiché pendant le lazy loading des pages et appels API
// ============================================================

const LoadingSpinner = () => {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center">
      {/* Cercle animé en rouge bordeaux */}
      <div className="w-12 h-12 border-4 border-neutral border-t-primary rounded-full animate-spin" />
      <p className="mt-4 text-gray-400 text-sm">Chargement en cours...</p>
    </div>
  )
}

export default LoadingSpinner
