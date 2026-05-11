// ============================================================
// components/ServiceCard.jsx — Carte d'un service Hindo Digital
// Affiche l'image du service si elle existe, sinon l'icône par défaut
// ============================================================

import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  HiWifi, HiShieldCheck, HiCode, HiAcademicCap, HiColorSwatch, HiArrowRight
} from 'react-icons/hi'

const ICONES = {
  wifi:      <HiWifi size={32} />,
  shield:    <HiShieldCheck size={32} />,
  code:      <HiCode size={32} />,
  lightbulb: <HiCode size={32} />,
  academic:  <HiAcademicCap size={32} />,
  color:     <HiColorSwatch size={32} />,
}

/**
 * @param {Object} service — { id, titre, description, icone, image_url }
 * @param {number} index   — Position pour le délai d'animation
 */
const ServiceCard = ({ service, index = 0 }) => {
  const icone = ICONES[service.icone] || <HiCode size={32} />

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -6 }}
      className="bg-white rounded-2xl shadow-card hover:shadow-card-hover overflow-hidden
                 transition-all duration-300 group"
    >
      {/* ---- Image du service OU bandeau couleur + icône ---- */}
      {service.image_url ? (
        <div className="aspect-video overflow-hidden">
          <img
            src={service.image_url}
            alt={service.titre}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      ) : (
        <div className="aspect-video bg-gradient-to-br from-primary/10 to-secondary/10
                        group-hover:from-primary group-hover:to-secondary
                        flex items-center justify-center transition-all duration-500">
          <span className="text-primary group-hover:text-white transition-colors duration-500">
            {icone}
          </span>
        </div>
      )}

      {/* ---- Contenu textuel ---- */}
      <div className="p-5">
        {/* Icône + Titre */}
        <div className="flex items-center gap-3 mb-3">
          {service.image_url && (
            <div className="w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center text-primary shrink-0">
              {icone}
            </div>
          )}
          <h3 className="font-bold text-secondary font-heading leading-tight group-hover:text-primary transition-colors duration-300">
            {service.titre}
          </h3>
        </div>

        <p className="text-gray-500 text-sm leading-relaxed mb-4">
          {service.description}
        </p>

        <Link
          to="/services"
          className="inline-flex items-center gap-1.5 text-primary font-semibold text-sm hover:gap-2.5 transition-all duration-200"
        >
          En savoir plus <HiArrowRight size={14} />
        </Link>
      </div>
    </motion.div>
  )
}

export default ServiceCard
