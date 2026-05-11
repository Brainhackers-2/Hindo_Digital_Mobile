// ============================================================
// pages/Formation.jsx — Page des Formations de Hindo Digital
// Affiche les formations disponibles et un formulaire d'inscription
// ============================================================

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  HiAcademicCap, HiClock, HiChartBar, HiTag, HiCheckCircle, HiX
} from 'react-icons/hi'

import SectionHeader from '../components/SectionHeader'
import FormField     from '../components/FormField'
import LoadingSpinner from '../components/LoadingSpinner'
import useFetch      from '../hooks/useFetch'
import useForm       from '../hooks/useForm'
import { getFormations, inscrireFormation } from '../services/formationsApi'

// Couleur par niveau de difficulté
const COULEURS_NIVEAU = {
  'Débutant':      'bg-green-100 text-green-700',
  'Intermédiaire': 'bg-yellow-100 text-yellow-700',
  'Avancé':        'bg-red-100 text-red-700',
}

// Formations par défaut (fallback si l'API n'est pas disponible)
const FORMATIONS_DEFAUT = [
  { id:1, titre:'Bureautique complète',         description:'Maîtrisez Word, Excel, PowerPoint et les outils de la suite Office.', duree:'2 semaines', niveau:'Débutant',      prix:25000  },
  { id:2, titre:'Développement Web Front-End',  description:'HTML, CSS, JavaScript : créez vos premières pages web interactives.', duree:'4 semaines', niveau:'Intermédiaire', prix:75000  },
  { id:3, titre:'Réseaux informatiques',        description:'Bases du networking, TCP/IP, configuration de routeurs et switches.', duree:'3 semaines', niveau:'Intermédiaire', prix:60000  },
  { id:4, titre:'Administration système Linux', description:'Gestion d\'un serveur Linux : installation, configuration, sécurité.', duree:'4 semaines', niveau:'Avancé',        prix:80000  },
  { id:5, titre:'Photoshop & Design graphique', description:'Retouche photo, création d\'affiches et supports visuels avec Photoshop.', duree:'2 semaines', niveau:'Débutant',  prix:35000  },
  { id:6, titre:'Sécurité informatique',        description:'Bases de la cybersécurité, protection des données et bonnes pratiques.', duree:'3 semaines', niveau:'Avancé',     prix:90000  },
]

const Formation = () => {
  const { data: formations, loading } = useFetch(getFormations)
  const liste = formations || FORMATIONS_DEFAUT

  // Contrôle la visibilité du modal d'inscription
  const [formationSelectionnee, setFormationSelectionnee] = useState(null)

  return (
    <>
      {/* ---- En-tête de page ---- */}
      <section className="gradient-hero pt-28 pb-16">
        <div className="container-custom text-white text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold font-heading mb-4"
          >
            Nos Formations
          </motion.h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            Des formations pratiques animées par des experts, accessibles à tous les niveaux
          </p>
        </div>
      </section>

      {/* ====================================================
          SECTION LISTE DES FORMATIONS
          ==================================================== */}
      <section className="section bg-white">
        <div className="container-custom">
          <SectionHeader
            titre="Catalogue de Formations"
            sousTitre="Choisissez la formation qui correspond à votre niveau et à vos objectifs"
          />

          {loading && <LoadingSpinner />}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {liste.map((formation, i) => (
              <motion.div
                key={formation.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="card border border-gray-100 flex flex-col"
              >
                {/* En-tête de la card */}
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                    <HiAcademicCap className="text-primary" size={24} />
                  </div>
                  {/* Badge niveau */}
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${COULEURS_NIVEAU[formation.niveau] || 'bg-gray-100 text-gray-600'}`}>
                    {formation.niveau}
                  </span>
                </div>

                {/* Titre et description */}
                <h3 className="font-bold text-secondary font-heading text-lg mb-2">
                  {formation.titre}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed flex-1 mb-4">
                  {formation.description}
                </p>

                {/* Métadonnées */}
                <div className="flex flex-wrap gap-4 mb-5 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <HiClock className="text-primary" size={16} />
                    {formation.duree}
                  </span>
                  {formation.prix && (
                    <span className="flex items-center gap-1">
                      <HiTag className="text-primary" size={16} />
                      {formation.prix.toLocaleString('fr-SN')} FCFA
                    </span>
                  )}
                </div>

                {/* Bouton S'inscrire */}
                <button
                  onClick={() => setFormationSelectionnee(formation)}
                  className="btn-primary w-full text-center"
                >
                  S'inscrire
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ====================================================
          SECTION AVANTAGES
          ==================================================== */}
      <section className="section bg-neutral">
        <div className="container-custom">
          <SectionHeader
            titre="Pourquoi se former chez nous ?"
            sousTitre="Des formations pensées pour l'efficacité et l'employabilité"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { titre: 'Formateurs experts', desc: 'Des professionnels du terrain avec une expérience pratique solide.' },
              { titre: 'Pratique avant tout', desc: 'Plus de 70% du temps en travaux pratiques sur cas réels.' },
              { titre: 'Petits groupes', desc: 'Maximum 10 apprenants par session pour un suivi personnalisé.' },
              { titre: 'Attestation délivrée', desc: 'Certificat de formation reconnu à la fin de chaque programme.' },
              { titre: 'Horaires flexibles', desc: 'Cours en journée, en soirée ou le week-end selon vos disponibilités.' },
              { titre: 'Tarifs accessibles', desc: 'Des formations de qualité à des prix adaptés au marché local.' },
            ].map((avantage, i) => (
              <motion.div
                key={avantage.titre}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="flex items-start gap-4"
              >
                <HiCheckCircle className="text-primary shrink-0 mt-1" size={22} />
                <div>
                  <h4 className="font-semibold text-secondary mb-1">{avantage.titre}</h4>
                  <p className="text-gray-500 text-sm">{avantage.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ====================================================
          MODAL D'INSCRIPTION
          ==================================================== */}
      <AnimatePresence>
        {formationSelectionnee && (
          <ModalInscription
            formation={formationSelectionnee}
            onClose={() => setFormationSelectionnee(null)}
          />
        )}
      </AnimatePresence>
    </>
  )
}

// ---- Sous-composant : Modal formulaire d'inscription ----
const ModalInscription = ({ formation, onClose }) => {
  const { values, errors, loading, success, handleChange, handleSubmit } = useForm(
    { nom: '', email: '', telephone: '', formation_id: formation.id },
    async (data) => {
      await inscrireFormation(data)
    }
  )

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        {/* En-tête du modal */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-bold text-xl font-heading text-secondary">Inscription</h3>
            <p className="text-primary text-sm font-medium mt-1">{formation.titre}</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            <HiX size={16} />
          </button>
        </div>

        {/* Message de succès */}
        {success ? (
          <div className="text-center py-8">
            <HiCheckCircle className="text-green-500 mx-auto mb-3" size={48} />
            <h4 className="font-bold text-secondary font-heading mb-2">Inscription réussie !</h4>
            <p className="text-gray-500 text-sm">Nous vous contacterons sous 24h pour confirmer votre inscription.</p>
            <button onClick={onClose} className="btn-primary mt-6">Fermer</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField
              label="Nom complet" name="nom" value={values.nom}
              onChange={handleChange} error={errors.nom}
              placeholder="Votre nom et prénom" required
            />
            <FormField
              label="Adresse email" name="email" type="email" value={values.email}
              onChange={handleChange} error={errors.email}
              placeholder="votre@email.com" required
            />
            <FormField
              label="Téléphone" name="telephone" type="tel" value={values.telephone}
              onChange={handleChange} error={errors.telephone}
              placeholder="+221 00 000 00 00"
            />

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Envoi en cours...
                </>
              ) : (
                "Confirmer l'inscription"
              )}
            </button>
          </form>
        )}
      </motion.div>
    </motion.div>
  )
}

export default Formation
