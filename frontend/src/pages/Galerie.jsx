// pages/Galerie.jsx — Galerie photo et vidéo Hindo Digital (données indépendantes)

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HiX, HiPhotograph, HiPlay, HiChevronLeft, HiChevronRight } from 'react-icons/hi'

import SectionHeader  from '../components/SectionHeader'
import LoadingSpinner from '../components/LoadingSpinner'
import useFetch       from '../hooks/useFetch'
import { getGalerie } from '../services/galerieApi'
import { getVideos }  from '../services/videosApi'

// Lightbox avec navigation
const Lightbox = ({ photos, index, onClose }) => {
  const [idx, setIdx] = useState(index)
  const photo = photos[idx]

  const prev = (e) => { e.stopPropagation(); setIdx(i => (i - 1 + photos.length) % photos.length) }
  const next = (e) => { e.stopPropagation(); setIdx(i => (i + 1) % photos.length) }

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/92 flex items-center justify-center p-4"
    >
      <button onClick={onClose}
        className="absolute top-4 right-4 w-10 h-10 bg-white/10 hover:bg-white/25 rounded-full flex items-center justify-center text-white z-10">
        <HiX size={20} />
      </button>

      {photos.length > 1 && (
        <button onClick={prev}
          className="absolute left-4 w-10 h-10 bg-white/10 hover:bg-white/25 rounded-full flex items-center justify-center text-white z-10">
          <HiChevronLeft size={22} />
        </button>
      )}

      <motion.div
        key={idx}
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        onClick={e => e.stopPropagation()}
        className="max-w-4xl max-h-[88vh] w-full flex flex-col items-center gap-3"
      >
        {photo.image_url ? (
          <img src={photo.image_url} alt={photo.titre}
            className="max-h-[78vh] w-auto object-contain rounded-xl" />
        ) : (
          <div className="w-full h-72 bg-gradient-to-br from-primary to-blue-700 rounded-xl flex items-center justify-center">
            <HiPhotograph size={56} className="text-white/50" />
          </div>
        )}
        {photo.titre && <p className="text-white text-center font-medium">{photo.titre}</p>}
        <p className="text-white/40 text-sm">{idx + 1} / {photos.length}</p>
      </motion.div>

      {photos.length > 1 && (
        <button onClick={next}
          className="absolute right-4 w-10 h-10 bg-white/10 hover:bg-white/25 rounded-full flex items-center justify-center text-white z-10">
          <HiChevronRight size={22} />
        </button>
      )}
    </motion.div>
  )
}

const Galerie = () => {
  const [onglet, setOnglet]           = useState('photos')
  const [lightboxIdx, setLightboxIdx] = useState(null)
  const [videoActif, setVideoActif]   = useState(null)

  const { data: photos, loading: loadPhotos }   = useFetch(getGalerie)
  const { data: videos, loading: loadVideos }   = useFetch(getVideos)

  const getEmbed = (url = '') => {
    const yt = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([^&?\s]+)/)
    if (yt) return `https://www.youtube.com/embed/${yt[1]}?autoplay=1`
    const vi = url.match(/vimeo\.com\/(\d+)/)
    if (vi) return `https://player.vimeo.com/video/${vi[1]}?autoplay=1`
    return url
  }

  const getYtId = (url = '') =>
    url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([^&?\s]+)/)?.[1]

  return (
    <>
      {/* Lightbox photo */}
      <AnimatePresence>
        {lightboxIdx !== null && photos?.length > 0 && (
          <Lightbox photos={photos} index={lightboxIdx} onClose={() => setLightboxIdx(null)} />
        )}
      </AnimatePresence>

      {/* Modal vidéo */}
      <AnimatePresence>
        {videoActif && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setVideoActif(null)}
            className="fixed inset-0 z-50 bg-black/92 flex items-center justify-center p-4"
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
            Notre Galerie
          </motion.h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            Photos et vidéos de notre équipe, nos locaux et nos activités.
          </p>
        </div>
      </section>

      <section className="section bg-white">
        <div className="container-custom">

          {/* Onglets */}
          <div className="flex justify-center mb-10">
            <div className="inline-flex bg-gray-100 rounded-xl p-1 gap-1">
              {[{ id: 'photos', label: 'Photos' }, { id: 'videos', label: 'Vidéos' }].map(o => (
                <button key={o.id} onClick={() => setOnglet(o.id)}
                  className={`px-6 py-2.5 rounded-lg font-semibold text-sm transition-all ${
                    onglet === o.id ? 'bg-primary text-white shadow-md' : 'text-gray-500 hover:text-primary'
                  }`}>
                  {o.label}
                </button>
              ))}
            </div>
          </div>

          {/* ── PHOTOS ── */}
          {onglet === 'photos' && (
            <>
              {loadPhotos ? <LoadingSpinner /> : !photos?.length ? (
                <div className="text-center py-20 text-gray-400">
                  <HiPhotograph size={56} className="mx-auto mb-4 opacity-30" />
                  <p className="text-lg font-medium">Aucune photo pour le moment.</p>
                  <p className="text-sm mt-2">Ajoutez des photos depuis l'espace admin → Galerie.</p>
                </div>
              ) : (
                <motion.div layout className="columns-2 md:columns-3 lg:columns-4 gap-3 space-y-3">
                  {photos.map((photo, i) => (
                    <motion.div
                      key={photo.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.05 }}
                      onClick={() => setLightboxIdx(i)}
                      className="group relative break-inside-avoid rounded-xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300"
                    >
                      {photo.image_url ? (
                        <img src={photo.image_url} alt={photo.titre}
                          className="w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-40 bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center">
                          <HiPhotograph size={32} className="text-primary/50" />
                        </div>
                      )}
                      {photo.titre && (
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-end">
                          <p className="text-white text-xs font-medium p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                            {photo.titre}
                          </p>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </>
          )}

          {/* ── VIDÉOS ── */}
          {onglet === 'videos' && (
            <>
              {loadVideos ? <LoadingSpinner /> : !videos?.length ? (
                <div className="text-center py-20 text-gray-400">
                  <HiPlay size={56} className="mx-auto mb-4 opacity-30" />
                  <p className="text-lg font-medium">Aucune vidéo pour le moment.</p>
                  <p className="text-sm mt-2">Ajoutez des vidéos depuis l'espace admin → Vidéos.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {videos.map((video, i) => {
                    const ytId = getYtId(video.url || video.url_video || '')
                    return (
                      <motion.div
                        key={video.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.08 }}
                        onClick={() => setVideoActif(video)}
                        className="group relative aspect-video bg-gray-900 rounded-xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-shadow"
                      >
                        {ytId ? (
                          <img src={`https://img.youtube.com/vi/${ytId}/hqdefault.jpg`}
                            alt={video.titre}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900" />
                        )}
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/50 transition-colors">
                          <motion.div whileHover={{ scale: 1.1 }}
                            className="w-14 h-14 bg-primary rounded-full flex items-center justify-center shadow-lg">
                            <HiPlay className="text-white ml-1" size={24} />
                          </motion.div>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                          <p className="text-white text-sm font-semibold line-clamp-2">{video.titre}</p>
                        </div>
                      </motion.div>
                    )
                  })}
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
