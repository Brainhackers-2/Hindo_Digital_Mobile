// ============================================================
// components/SectionHeader.jsx — En-tête de section réutilisable
// Affiche titre, divider rouge bordeaux et sous-titre
// ============================================================

import { motion } from 'framer-motion'

/**
 * En-tête standardisé pour toutes les sections du site
 * @param {string} titre — Titre principal de la section
 * @param {string} sousTitre — Description optionnelle sous le titre
 * @param {boolean} centré — Aligne le contenu au centre (défaut: true)
 */
const SectionHeader = ({ titre, sousTitre, centré = true }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className={`mb-12 ${centré ? 'text-center' : ''}`}
    >
      {/* Titre principal */}
      <h2 className="section-title">{titre}</h2>

      {/* Divider rouge bordeaux */}
      <div className={`w-16 h-1 bg-primary rounded ${centré ? 'mx-auto' : ''} mb-4`} />

      {/* Sous-titre optionnel */}
      {sousTitre && (
        <p className={`text-lg text-gray-500 max-w-2xl ${centré ? 'mx-auto' : ''}`}>
          {sousTitre}
        </p>
      )}
    </motion.div>
  )
}

export default SectionHeader
