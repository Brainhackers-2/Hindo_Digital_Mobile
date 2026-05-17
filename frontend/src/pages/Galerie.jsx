// pages/Galerie.jsx — Galerie photo et vidéo de Hindo Digital

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HiX, HiPhotograph, HiPlay, HiChevronLeft, HiChevronRight } from 'react-icons/hi'

import SectionHeader  from '../components/SectionHeader'
import LoadingSpinner from '../components/LoadingSpinner'
import useFetch       from '../hooks/useFetch'
import { getRealisations } from '../services/realisationsApi'
import { getVideos }       from '../services/videosApi'

const CATEGORIES = ['Tous', 'Réseaux', 'Vidéosurveillance', 'Web & Mobile', 'Formation', 'Infographie']

// Photos de démonstration si la base est vide
const PHOTOS_DEFAUT = [
  { id:1, titre:'Infrastructure réseau PME',     categorie:'Réseaux',           image_url: null },
  { id:2, titre:'Vidéosurveillance entrepôt',    categorie:'Vidéosurveillance', image_url: null },
  { id:3, titre:'Site e-commerce boutique',      categorie:'Web & Mobile',      image_url: null },
  { id:4, titre:'Application mobile livraison',  categorie:'Web & Mobile',      image_url: null },
  { id:5, titre:'Formation bureautique',         categorie:'Formation',         image_url: null },
  { id:6, titre:'Identité visuelle restaurant',  categorie:'Infographie',       image_url: null },
]

// Couleur par catégorie (pour les placeholders)
const COULEURS = {
  'Réseaux':           'from-blue-500 to-blue-700',
  'Vidéosurveillance': 'from-slate-500 to-slate-700',
  'Web & Mobile':      'from-violet-500 to-violet-700',
  'Formation':         'from-amber-500 to-amber-700',
  'Infographie':       'from-rose-500 to-rose-700',
}

// Lightbox simple — affiche une photo en grand avec navigation
const Lightbox = ({ photos, index, onClose }) => {
  const [idx, setIdx] = useState(index)
  const photo = photos[idx]

  const prev = (e) => { e.stopPropagation(); setIdx(i => (i - 1 + photos.length) % photos.length) }
  const next = (e) => { e.stopPropagation(); setIdx(i => (i + 1) % photos.length) }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
    >
      {/* Bouton fermer */}
      <button onClick={onClose}
        className="absolute top-4 right-4 w-10 h-10 bg-white/10 hover:bg-white/25 rounded-full flex items-center justify-center text-white transition-colors z-10">
        <HiX size={20} />
      </button>

      {/* Navigation gauche */}
      {photos.length > 1 && (
        <button onClick={prev}
          className="absolute left-4 w-10 h-10 bg-white/10 hover:bg-white/25 rounded-full flex items-center justify-center text-white transition-colors z-10">
          <HiChevronLeft size={22} />
        </button>
      )}

      {/* Image */}
      <motion.div
        key={idx}
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        onClick={e => e.stopPropagation()}
        className="max-w-4xl max-h-[85vh] w-full"
      >
        {photo.image_url ? (
          <img src={photo.image_url} alt={photo.titre}
            className="w-full h-full object-contain rounded-xl" />
        ) : (
          <div className={`w-full h-80 bg-gradient-to-br ${COULEURS[photo.categorie] || 'from-primary to-blue-700'} rounded-xl flex items-center justify-center`}>
            <div className="text-center text-white">
              <HiPhotograph size={56} className="mx-auto mb-3 opacity-60" />
              <p className="font-bold text-lg">{photo.titre}</p>
              <p className="text-white/70 text-sm mt-1">{photo.categorie}</p>
            </div>
          </div>
        )}
        <p className="text-white text-center mt-3 font-medium">{photo.titre}</p>
        <p className="text-white/50 text-center text-sm mt-1">{idx + 1} / {photos.length}</p>
      </motion.div>

      {/* Navigation droite */}
      {photos.length > 1 && (
        <button onClick={next}
          className="absolute right-4 w-10 h-10 bg-white/10 hover:bg-white/25 rounded-full flex items-center justify-center text-white transition-colors z-10">
          <HiChevronRight size={22} />
        </button>
      )}
    </motion.div>
  )
}

const Galerie = () => {
  const [onglet, setOnglet]           = useState('photos')
  const [categorie, setCategorie]     = useState('Tous')
  const [lightboxIdx, setLightboxIdx] = useState(null)
  const [videoActif, setVideoActif]   = useState(null)

  const { data: realisations, loading: loadPhotos } = useFetch(getRealisations)
  const { data: videos, loading: loadVideos }        = useFetch(getVideos)

  const photos = (realisations?.length ? realisations : PHOTOS_DEFAUT)
    .filter(p => categorie === 'Tous' || p.categorie === categorie)

  // Extrait l'ID YouTube/Vimeo pour l'embed
  const getEmbed = (url = '') => {
    const yt = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([^&?\s]+)/)
    if (yt) return `https://www.youtube.com/embed/${yt[1]}?autoplay=1`
    const vi = url.match(/vimeo\.com\/(\d+)/)
    if (vi) return `https://player.vimeo.com/video/${vi[1]}?autoplay=1`
    return url
  }

  return (
    <>
      {/* Lightbox photo */}
      <AnimatePresence>
        {lightboxIdx !== null && (
          <Lightbox photos={photos} index={lightboxIdx} onClose={() => setLightboxIdx(null)} />
        )}
      </AnimatePresence>

      {/* Modal vidéo */}
      <AnimatePresence>
        {videoActif && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setVideoActif(null)}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          >
            <button onClick={() => setVideoActif(null)}
              className="absolute top-4 right-4 w-10 h-10 bg-white/10 hover:bg-white/25 rounded-full flex items-center justify-center text-white">
              <HiX size={20} />
            </button>
            <div onClick={e => e.stopPropagation()} className="w-full max-w-3xl aspect-video rounded-xl overflow-hidden">
              <iframe src={getEmbed(videoActif.url)} className="w-full h-full"
                allow="autoplay; fullscreen" allowFullScreen title={videoActif.titre} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── En-tête ── */}
      <section className="gradient-hero pt-28 pb-16">
        <div className="container-custom text-white text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold font-heading mb-4"
          >
            Galerie
          </motion.h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            Découvrez nos réalisations et nos projets en images et en vidéos.
          </p>
        </div>
      </section>

      {/* ── Onglets Photos / Vidéos ── */}
      <section className="section bg-white">
        <div className="container-custom">

          {/* Sélecteur d'onglet */}
          <div className="flex justify-center mb-10">
            <div className="inline-flex bg-gray-100 rounded-xl p-1 gap-1">
              {[
                { id: 'photos', label: 'Photos' },
                { id: 'videos', label: 'Vidéos' },
              ].map(o => (
                <button key={o.id} onClick={() => setOnglet(o.id)}
                  className={`px-6 py-2.5 rounded-lg font-semibold text-sm transition-all ${
                    onglet === o.id
                      ? 'bg-primary text-white shadow-md'
                      : 'text-gray-500 hover:text-primary'
                  }`}>
                  {o.label}
                </button>
              ))}
            </div>
          </div>

          {/* ════ ONGLET PHOTOS ════ */}
          {onglet === 'photos' && (
            <>
              {/* Filtres catégories */}
              <div className="flex flex-wrap justify-center gap-2 mb-8">
                {CATEGORIES.map(cat => (
                  <motion.button key={cat} whileTap={{ scale: 0.95 }}
                    onClick={() => setCategorie(cat)}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                      categorie === cat
                        ? 'bg-primary text-white shadow-sm'
                        : 'bg-gray-100 text-gray-600 hover:bg-primary/10 hover:text-primary'
                    }`}>
                    {cat}
                  </motion.button>
                ))}
              </div>

              {loadPhotos ? <LoadingSpinner /> : (
                <motion.div layout className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  <AnimatePresence>
                    {photos.map((photo, i) => (
                      <motion.div
                        key={photo.id}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.3, delay: i * 0.04 }}
                        onClick={() => setLightboxIdx(i)}
                        className="group relative aspect-square rounded-xl overflow-hidden cursor-pointer shadow-sm hover:shadow-lg transition-shadow"
                      >
                        {photo.image_url ? (
                          <img src={photo.image_url} alt={photo.titre}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        ) : (
                          <div className={`w-full h-full bg-gradient-to-br ${COULEURS[photo.categorie] || 'from-primary to-blue-700'} flex items-center justify-center`}>
                            <HiPhotograph size={36} className="text-white/60" />
                          </div>
                        )}
                        {/* Overlay au survol */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors duration-300 flex items-end">
                          <div className="p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                            <p className="text-white text-xs font-semibold line-clamp-2">{photo.titre}</p>
                            <span className="text-white/70 text-xs">{photo.categorie}</span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              )}
            </>
          )}

          {/* ════ ONGLET VIDÉOS ════ */}
          {onglet === 'videos' && (
            <>
              {loadVideos ? <LoadingSpinner /> : !videos?.length ? (
                <div className="text-center py-16 text-gray-400">
                  <HiPlay size={48} className="mx-auto mb-3 opacity-40" />
                  <p>Aucune vidéo disponible pour le moment.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {videos.map((video, i) => (
                    <motion.div
                      key={video.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.08 }}
                      onClick={() => setVideoActif(video)}
                      className="group relative aspect-video bg-gray-900 rounded-xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-shadow"
                    >
                      {/* Thumbnail YouTube */}
                      {video.url?.includes('youtube') || video.url?.includes('youtu.be') ? (
                        <img
                          src={`https://img.youtube.com/vi/${video.url.match(/(?:v=|youtu\.be\/)([^&?\s]+)/)?.[1]}/hqdefault.jpg`}
                          alt={video.titre}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center">
                          <HiPlay size={48} className="text-white/50" />
                        </div>
                      )}
                      {/* Bouton play */}
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/50 transition-colors">
                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                          className="w-14 h-14 bg-primary rounded-full flex items-center justify-center shadow-lg">
                          <HiPlay className="text-white ml-1" size={24} />
                        </motion.div>
                      </div>
                      {/* Titre */}
                      <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                        <p className="text-white text-sm font-semibold line-clamp-2">{video.titre}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </>
          )}

        </div>
      </section>
    </>
  )
}

export default Galerie
