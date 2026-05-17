// admin/pages/AdminGalerie.jsx — Gestion de la galerie photos

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HiPhotograph, HiTrash, HiPlus, HiX } from 'react-icons/hi'
import AdminLayout from '../layout/AdminLayout'
import adminApi   from '../services/adminApi'

const AdminGalerie = () => {
  const [photos, setPhotos]       = useState([])
  const [loading, setLoading]     = useState(true)
  const [uploading, setUploading] = useState(false)
  const [erreur, setErreur]       = useState(null)
  const [titre, setTitre]         = useState('')
  const [fichier, setFichier]     = useState(null)
  const [preview, setPreview]     = useState(null)
  const inputRef = useRef(null)

  const charger = async () => {
    setLoading(true)
    try {
      const res = await adminApi.get('/admin/galerie')
      setPhotos(res.data?.data || [])
    } catch (e) {
      setErreur(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { charger() }, [])

  const choisirFichier = (e) => {
    const f = e.target.files?.[0]
    if (!f) return
    setFichier(f)
    setPreview(URL.createObjectURL(f))
    setErreur(null)
  }

  const annuler = () => {
    setFichier(null)
    setPreview(null)
    setTitre('')
    if (inputRef.current) inputRef.current.value = ''
  }

  const ajouter = async () => {
    if (!fichier) { setErreur('Veuillez choisir une image.'); return }
    setUploading(true)
    setErreur(null)
    try {
      const form = new FormData()
      form.append('titre', titre || 'Photo')
      form.append('image', fichier)
      await adminApi.post('/admin/galerie', form)
      annuler()
      await charger()
    } catch (e) {
      setErreur(`⚠ ${e.message}`)
    } finally {
      setUploading(false)
    }
  }

  const supprimer = async (id) => {
    if (!confirm('Supprimer cette photo ?')) return
    try {
      await adminApi.delete(`/admin/galerie/${id}`)
      setPhotos(prev => prev.filter(p => p.id !== id))
    } catch (e) {
      setErreur(e.message)
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-5xl">
        <div>
          <h2 className="text-2xl font-bold font-heading text-secondary">Galerie Photos</h2>
          <p className="text-gray-500 text-sm mt-1">
            Ces photos apparaissent sur la page <strong>Galerie</strong> du site (différente de Réalisations).
          </p>
        </div>

        {erreur && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">
            {erreur}
          </div>
        )}

        {/* ── Zone d'ajout ── */}
        <div className="bg-white rounded-2xl shadow-card p-6 space-y-4">
          <h3 className="font-semibold text-secondary">Ajouter une photo</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
            {/* Titre */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-secondary">Titre (optionnel)</label>
              <input type="text" value={titre} onChange={e => setTitre(e.target.value)}
                placeholder="Ex: Notre équipe en action"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary" />
            </div>

            {/* Fichier */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-secondary">Image</label>
              <input ref={inputRef} type="file" accept="image/*" onChange={choisirFichier}
                className="w-full text-sm text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded-lg
                           file:border-0 file:text-sm file:font-medium file:bg-primary/10
                           file:text-primary hover:file:bg-primary/20 cursor-pointer" />
            </div>
          </div>

          {/* Prévisualisation */}
          <AnimatePresence>
            {preview && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="relative inline-block"
              >
                <img src={preview} alt="Prévisualisation"
                  className="h-40 w-auto rounded-xl object-cover border border-gray-200" />
                <button onClick={annuler}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center">
                  <HiX size={12} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex gap-3">
            <button onClick={ajouter} disabled={uploading || !fichier}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                uploading || !fichier
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-primary text-white hover:shadow-md'
              }`}>
              {uploading
                ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Upload...</>
                : <><HiPlus size={16} /> Ajouter à la galerie</>
              }
            </button>
            {fichier && (
              <button onClick={annuler} className="px-4 py-2.5 text-sm text-gray-500 hover:text-secondary transition-colors">
                Annuler
              </button>
            )}
          </div>
        </div>

        {/* ── Grille de photos ── */}
        <div className="bg-white rounded-2xl shadow-card p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-semibold text-secondary">{photos.length} photo{photos.length !== 1 ? 's' : ''}</h3>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1,2,3,4].map(i => <div key={i} className="aspect-square bg-gray-100 rounded-xl animate-pulse" />)}
            </div>
          ) : !photos.length ? (
            <div className="text-center py-14 text-gray-400">
              <HiPhotograph size={48} className="mx-auto mb-3 opacity-30" />
              <p>Aucune photo. Ajoutez-en une ci-dessus.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <AnimatePresence>
                {photos.map(photo => (
                  <motion.div
                    key={photo.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="group relative aspect-square rounded-xl overflow-hidden bg-gray-100 shadow-sm"
                  >
                    {photo.image_url ? (
                      <img src={photo.image_url} alt={photo.titre}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <HiPhotograph size={32} className="text-gray-300" />
                      </div>
                    )}
                    {/* Overlay avec infos et bouton supprimer */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors duration-200 flex flex-col justify-between p-2">
                      <div className="flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => supprimer(photo.id)}
                          className="w-8 h-8 bg-red-500 text-white rounded-lg flex items-center justify-center shadow-md hover:bg-red-600 transition-colors">
                          <HiTrash size={14} />
                        </button>
                      </div>
                      {photo.titre && (
                        <p className="text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity truncate">
                          {photo.titre}
                        </p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}

export default AdminGalerie
