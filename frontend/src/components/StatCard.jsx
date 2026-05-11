// ============================================================
// components/StatCard.jsx — Carte de chiffre clé
// Affiche un KPI animé (clients, projets, années d'expérience)
// ============================================================

import { motion } from 'framer-motion'

/**
 * Carte d'un chiffre clé avec animation au scroll
 * @param {string} valeur — La valeur affichée (ex: "50+")
 * @param {string} label — Libellé du chiffre (ex: "Clients satisfaits")
 * @param {React.ReactNode} icon — Icône associée
 * @param {number} index — Position pour le délai d'animation
 */
const StatCard = ({ valeur, label, icon, index = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.15 }}
      className="text-center p-6"
    >
      {/* Icône */}
      {icon && (
        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
          {icon}
        </div>
      )}
      {/* Valeur principale */}
      <div className="text-4xl md:text-5xl font-bold text-primary font-heading mb-2">
        {valeur}
      </div>
      {/* Label */}
      <p className="text-gray-600 font-medium">{label}</p>
    </motion.div>
  )
}

export default StatCard
