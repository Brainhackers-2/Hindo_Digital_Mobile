// ============================================================
// pages/Realisations.jsx — Galerie photos + Section vidéos
// Images filtrables par catégorie + vidéos YouTube/Vimeo
// ============================================================

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Lightbox from 'yet-another-react-lightbox'
import 'yet-another-react-lightbox/styles.css'
import { HiPlay, HiX } from 'react-icons/hi'
import { FaYoutube, FaVimeo } from 'react-icons/fa'

import SectionHeader  from '../components/SectionHeader'
import LoadingSpinner from '../components/LoadingSpinner'
import useFetch       from '../hooks/useFetch'
import { getRealisations } from '../services/realisationsApi'
import { getVideos }       from '../services/videosApi'

const CATEGORIES = ['Tous', 'Réseaux', 'Vidéosurveillance', 'Web & Mobile', 'Formation', 'Infographie']

// Données de démonstration réalisations
const REALISATIONS_DEFAUT = [
  { id:1, titre:'Infrastructure réseau PME',      categorie:'Réseaux',          image_path: null, description:'Réseau local pour une PME de 30 postes.' },
  { id:2, titre:'Système de vidéosurveillance',   categorie:'Vidéosurveillance', image_path: null, description:'12 caméras IP dans un entrepôt logistique.' },
  { id:3, titre:'Site e-commerce boutique',       categorie:'Web & Mobile',      image_path: null, description:'Boutique en ligne avec paiement mobile money.' },
  { id:4, titre:'Application mobile livraison',   categorie:'Web & Mobile',      image_path: null, description:'Application de gestion de livraisons.' },
  { id:5, titre:'Formation bureautique',          categorie:'Formation',         image_path: null, description:'Formation de 20 agents en bureautique.' },
  { id:6, titre:'Identité visuelle restaurant',  categorie:'Infographie',       image_path: null, description:'Logo et menus pour un restaurant à Ziguinchor.' },
]

const Realisations = () => {
  const { data: realisations, loading, error } = useFetch(getRealisations)
  const liste = realisations || REALISATIONS_DEFAUT

  const { data: videos, loading: loadingVideos } = useFetch(getVideos)

  // ---- États ----
  const [categorieActive, setCategorieActive] = useState('Tous')
  const [lightboxIndex, setLightboxIndex]     = useState(-1)
  const [videoOuverte, setVideoOuverte]       = useState(null) // vidéo en cours de lecture

  const listeFiltree = categorieActive === 'Tous'
    ? liste
    : liste.filter((r) => r.categorie === categorieActive)

  const slides = listeFiltree.map((r) => ({
    src: r.image_path
      ? `${API_STORAGE_URL}/storage/${r.image_path}`
      : `https://placehold.co/800x600/8B0000/white?text=${encodeURIComponent(r.titre)}`,
    title: r.titre,
    description: r.description,
  }))

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
            Nos Réalisations
          </motion.h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            Photos et vidéos de nos projets réalisés pour nos clients
          </p>
        </div>
      </section>

      {/* ====================================================
          SECTION GALERIE PHOTOS
          ==================================================== */}
      <section className="section bg-white">
        <div className="container-custom">
          <SectionHeader
            titre="Galerie Photos"
            sousTitre="Aperçu de nos projets réalisés — cliquez sur une image pour l'agrandir"
          />

          {/* Filtres */}
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategorieActive(cat)}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                  categorieActive === cat
                    ? 'bg-primary text-white shadow-md'
                    : 'bg-neutral text-secondary hover:bg-primary/10 hover:text-primary'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {loading && <LoadingSpinner />}
          {error && <p className="text-center text-red-400 text-sm mb-6">Erreur de chargement.</p>}

          <AnimatePresence mode="wait">
            <motion.div
              key={categorieActive}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {listeFiltree.map((realisation, i) => (
                <motion.div
                  key={realisation.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: i * 0.06 }}
                  onClick={() => setLightboxIndex(i)}
                  className="group cursor-pointer rounded-xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300"
                >
                  <div className="relative aspect-video overflow-hidden bg-gray-100">
                    <img
                      src={
                        realisation.image_path
                          ? `${API_STORAGE_URL}/storage/${realisation.image_path}`
                          : `https://placehold.co/600x400/8B0000/white?text=${encodeURIComponent(realisation.titre)}`
                      }
                      alt={realisation.titre}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-primary/70 opacity-0 group-hover:opacity-100
                                    transition-opacity duration-300 flex items-center justify-center">
                      <span className="text-white font-semibold text-lg">Voir le projet</span>
                    </div>
                  </div>
                  <div className="p-5 bg-white">
                    <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-1 rounded-full">
                      {realisation.categorie}
                    </span>
                    <h3 className="font-bold text-secondary font-heading mt-3 mb-1">{realisation.titre}</h3>
                    <p className="text-gray-500 text-sm line-clamp-2">{realisation.description}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {listeFiltree.length === 0 && (
            <div className="text-center py-16 text-gray-400">
              <p>Aucune réalisation dans cette catégorie pour le moment.</p>
            </div>
          )}
        </div>
      </section>

      {/* ====================================================
          SECTION VIDÉOS
          ==================================================== */}
      {(loadingVideos || (videos && videos.length > 0)) && (
        <section className="section bg-neutral">
          <div className="container-custom">
            <SectionHeader
              titre="Nos Vidéos"
              sousTitre="Découvrez nos réalisations en vidéo — cliquez pour lancer la lecture"
            />

            {loadingVideos ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1,2,3].map(i => <div key={i} className="aspect-video bg-gray-200 rounded-2xl animate-pulse" />)}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(videos || []).map((video, i) => (
                  <motion.div
                    key={video.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.08 }}
                    onClick={() => setVideoOuverte(video)}
                    className="group cursor-pointer rounded-2xl overflow-hidden shadow-card
                               hover:shadow-card-hover transition-all duration-300"
                  >
                    {/* Miniature */}
                    <div className="relative aspect-video bg-gray-900 overflow-hidden">
                      {video.thumbnail_url ? (
                        <img
                          src={video.thumbnail_url}
                          alt={video.titre}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-105
                                     transition-transform duration-500"
                          onError={(e) => { e.target.style.display = 'none' }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-secondary/80">
                          {video.type === 'youtube'
                            ? <FaYoutube className="text-red-500" size={48} />
                            : <FaVimeo   className="text-blue-400" size={48} />
                          }
                        </div>
                      )}

                      {/* Overlay sombre + bouton play */}
                      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50
                                      flex items-center justify-center transition-colors duration-300">
                        <motion.div
                          whileHover={{ scale: 1.15 }}
                          className="w-16 h-16 bg-primary rounded-full flex items-center justify-center
                                     shadow-xl border-4 border-white/30"
                        >
                          <HiPlay className="text-white ml-1" size={28} />
                        </motion.div>
                      </div>

                      {/* Badge type */}
                      <div className="absolute top-3 left-3 flex items-center gap-1.5
                                      bg-black/70 backdrop-blur-sm text-white text-xs
                                      px-2.5 py-1 rounded-full">
                        {video.type === 'youtube'
                          ? <FaYoutube className="text-red-400" size={12} />
                          : <FaVimeo   className="text-blue-400" size={12} />
                        }
                        {video.type}
                      </div>

                      {/* Badge catégorie */}
                      {video.categorie && (
                        <div className="absolute top-3 right-3 bg-primary/90 text-white
                                        text-xs px-2.5 py-1 rounded-full font-medium">
                          {video.categorie}
                        </div>
                      )}
                    </div>

                    {/* Infos */}
                    <div className="p-5 bg-white">
                      <h3 className="font-bold text-secondary font-heading mb-1
                                     group-hover:text-primary transition-colors duration-200">
                        {video.titre}
                      </h3>
                      {video.description && (
                        <p className="text-gray-500 text-sm line-clamp-2">{video.description}</p>
                      )}
                      <p className="text-primary text-xs font-semibold mt-2 flex items-center gap-1">
                        <HiPlay size={12} /> Cliquer pour regarder
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Lightbox photos */}
      <Lightbox
        open={lightboxIndex >= 0}
        close={() => setLightboxIndex(-1)}
        index={lightboxIndex}
        slides={slides}
        on={{ view: ({ index }) => setLightboxIndex(index) }}
      />

      {/* ===================================================
          MODAL LECTEUR VIDÉO
          =================================================== */}
      <AnimatePresence>
        {videoOuverte && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
            onClick={() => setVideoOuverte(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-4xl"
              onClick={e => e.stopPropagation()}
            >
              {/* Header du modal */}
              <div className="flex items-center justify-between mb-4 px-1">
                <div>
                  <h3 className="text-white font-bold font-heading text-lg">{videoOuverte.titre}</h3>
                  {videoOuverte.categorie && (
                    <span className="text-primary text-sm font-medium">{videoOuverte.categorie}</span>
                  )}
                </div>
                <button
                  onClick={() => setVideoOuverte(null)}
                  className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full
                             flex items-center justify-center text-white transition-colors"
                >
                  <HiX size={20} />
                </button>
              </div>

              {/* Lecteur vidéo */}
              <div className="aspect-video rounded-2xl overflow-hidden bg-black shadow-2xl">
                {/* YouTube / Vimeo → iframe | Fichier local ou URL directe → <video> */}
                {videoOuverte.embed_url ? (
                  <iframe
                    src={videoOuverte.embed_url}
                    title={videoOuverte.titre}
                    className="w-full h-full"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <video
                    src={videoOuverte.url_lecture}
                    controls
                    autoPlay
                    className="w-full h-full"
                    preload="metadata"
                  >
                    Votre navigateur ne supporte pas la lecture vidéo.
                  </video>
                )}
              </div>

              {/* Description */}
              {videoOuverte.description && (
                <p className="text-white/70 text-sm mt-4 px-1">{videoOuverte.description}</p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default Realisations
