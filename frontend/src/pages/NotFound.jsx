// ============================================================
// pages/NotFound.jsx — Page 404 de Hindo Digital
// Affichée quand l'utilisateur accède à une URL inexistante
// ============================================================

import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { HiHome } from 'react-icons/hi'

const NotFound = () => {
  return (
    <section className="min-h-screen gradient-hero flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center text-white"
      >
        {/* Code d'erreur */}
        <h1 className="text-8xl md:text-9xl font-bold font-heading text-white/20 mb-4">
          404
        </h1>

        <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4">
          Page introuvable
        </h2>

        <p className="text-white/70 text-lg mb-10 max-w-md mx-auto">
          La page que vous recherchez n'existe pas ou a été déplacée.
          Retournez à l'accueil pour continuer.
        </p>

        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-white text-primary font-bold
                     px-8 py-4 rounded-lg hover:bg-gray-100 transition-colors text-lg"
        >
          <HiHome size={20} /> Retour à l'accueil
        </Link>
      </motion.div>
    </section>
  )
}

export default NotFound
