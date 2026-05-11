// ============================================================
// admin/pages/AdminServices.jsx — CRUD des services avec images
// Chaque service peut avoir une image uploadée (PNG, JPG, WebP)
// ============================================================

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  HiPlus, HiPencil, HiTrash, HiX, HiCheck, HiPhotograph, HiUpload
} from 'react-icons/hi'
import AdminLayout from '../layout/AdminLayout'
import adminApi   from '../services/adminApi'
import useFetch   from '../../hooks/useFetch'

const ICONES_OPTIONS = [
  { value: 'wifi',     label: 'Réseaux (wifi)'      },
  { value: 'shield',   label: 'Sécurité (shield)'   },
  { value: 'code',     label: 'Développement (code)' },
  { value: 'academic', label: 'Formation (academic)' },
  { value: 'color',    label: 'Infographie (color)'  },
]

const VIDE = { titre: '', description: '', icone: 'wifi', ordre: 1, image: null }

const AdminServices = () => {
  const { data: services, loading, refetch } = useFetch(() => adminApi.get('/admin/services'))
  const [modal, setModal]     = useState(null)   // null | 'create' | objet service
  const [form, setForm]       = useState(VIDE)
  const [apercu, setApercu]   = useState(null)   // prévisualisation locale
  const [saving, setSaving]   = useState(false)
  const [delImgId, setDelImgId] = useState(null) // id du service dont on supprime l'image
  const [erreur, setErreur]   = useState('')
  const inputRef = useRef(null)

  const ouvrirCreation = () => {
    setForm(VIDE); setApercu(null); setErreur(''); setModal('create')
  }
  const ouvrirEdition = (s) => {
    setForm({ titre: s.titre, description: s.description, icone: s.icone, ordre: s.ordre, image: null })
    setApercu(s.image_url || null)
    setErreur('')
    setModal(s)
  }

  const handleImage = (e) => {
    const f = e.target.files[0]
    if (!f) return
    setForm({ ...form, image: f })
    setApercu(URL.createObjectURL(f))
  }

  const handleDrop = (e) => {
    e.preventDefault()
    const f = e.dataTransfer.files[0]
    if (!f || !f.type.startsWith('image/')) return
    setForm({ ...form, image: f })
    setApercu(URL.createObjectURL(f))
  }

  const sauvegarder = async (e) => {
    e.preventDefault()
    setSaving(true); setErreur('')
    try {
      const fd = new FormData()
      fd.append('titre', form.titre)
      fd.append('description', form.description)
      fd.append('icone', form.icone)
      fd.append('ordre', form.ordre || 1)
      if (form.image) fd.append('image', form.image)

      if (modal === 'create') {
        await adminApi.post('/admin/services', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      } else {
        await adminApi.post(`/admin/services/${modal.id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      }
      refetch(); setModal(null)
    } catch (err) {
      setErreur(err.response?.data?.message || 'Une erreur est survenue.')
    } finally {
      setSaving(false)
    }
  }

  const supprimerImage = async (service) => {
    if (!confirm(`Supprimer l'image de "${service.titre}" ?`)) return
    setDelImgId(service.id)
    try {
      await adminApi.delete(`/admin/services/${service.id}/image`)
      refetch()
      // Met à jour l'aperçu si ce service est en cours d'édition
      if (modal?.id === service.id) setApercu(null)
    } finally {
      setDelImgId(null)
    }
  }

  const supprimerService = async (id) => {
    if (!confirm('Supprimer ce service et son image ?')) return
    await adminApi.delete(`/admin/services/${id}`)
    refetch()
  }

  return (
    <AdminLayout>
      <div className="space-y-6">

        {/* En-tête */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold font-heading text-secondary">Services</h2>
            <p className="text-gray-500 text-sm mt-1">
              {(services || []).length} service(s) — cliquez sur l'image pour la changer
            </p>
          </div>
          <button onClick={ouvrirCreation} className="btn-primary flex items-center gap-2">
            <HiPlus size={18} /> Ajouter un service
          </button>
        </div>

        {/* Grille des services */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1,2,3,4,5].map(i => <div key={i} className="h-64 bg-white rounded-2xl animate-pulse" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {(services || []).map((s) => (
              <motion.div key={s.id} initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
                className="bg-white rounded-2xl shadow-card overflow-hidden group">

                {/* Zone image du service */}
                <div className="relative aspect-video bg-gray-100 overflow-hidden">
                  {s.image_url ? (
                    <img
                      src={s.image_url}
                      alt={s.titre}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    /* Placeholder quand pas d'image */
                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-300 gap-2">
                      <HiPhotograph size={40} />
                      <p className="text-xs">Pas d'image</p>
                    </div>
                  )}

                  {/* Bouton supprimer image (visible au survol si image présente) */}
                  {s.image_url && (
                    <button
                      onClick={() => supprimerImage(s)}
                      disabled={delImgId === s.id}
                      className="absolute top-2 right-2 w-8 h-8 bg-red-500 hover:bg-red-600 text-white
                                 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100
                                 transition-all duration-200 shadow-md"
                      title="Supprimer l'image"
                    >
                      {delImgId === s.id
                        ? <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        : <HiTrash size={14} />
                      }
                    </button>
                  )}

                  {/* Badge icône */}
                  <div className="absolute bottom-2 left-2 bg-primary/90 text-white text-xs px-2 py-1 rounded-full font-medium">
                    {s.icone}
                  </div>
                </div>

                {/* Infos + actions */}
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-secondary text-sm truncate">{s.titre}</p>
                      <p className="text-gray-400 text-xs mt-0.5 line-clamp-2">{s.description}</p>
                    </div>
                    <span className="text-xs text-gray-300 shrink-0 mt-0.5">#{s.ordre}</span>
                  </div>

                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => ouvrirEdition(s)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium
                                 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors"
                    >
                      <HiPencil size={14} /> Modifier
                    </button>
                    <button
                      onClick={() => supprimerService(s.id)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium
                                 text-red-500 bg-red-50 hover:bg-red-100 rounded-xl transition-colors"
                    >
                      <HiTrash size={14} /> Supprimer
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* ===================================================
          MODAL Création / Édition
          =================================================== */}
      <AnimatePresence>
        {modal && (
          <motion.div
            initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
            onClick={() => setModal(null)}
          >
            <motion.div
              initial={{ scale:0.92, opacity:0 }} animate={{ scale:1, opacity:1 }} exit={{ scale:0.92, opacity:0 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b sticky top-0 bg-white z-10">
                <h3 className="font-bold font-heading text-secondary">
                  {modal === 'create' ? 'Nouveau service' : `Modifier — ${modal.titre}`}
                </h3>
                <button onClick={() => setModal(null)} className="p-1.5 hover:bg-gray-100 rounded-lg">
                  <HiX size={18} />
                </button>
              </div>

              <form onSubmit={sauvegarder} className="p-6 space-y-5">
                {erreur && (
                  <p className="text-red-500 text-sm bg-red-50 border border-red-200 px-4 py-2.5 rounded-xl">
                    {erreur}
                  </p>
                )}

                {/* ---- Zone upload image ---- */}
                <div>
                  <label className="text-sm font-medium text-secondary block mb-2">
                    Image du service
                    <span className="text-gray-400 font-normal ml-1">(PNG, JPG, WebP — max 3 Mo)</span>
                  </label>

                  <div
                    onDrop={handleDrop}
                    onDragOver={e => e.preventDefault()}
                    onClick={() => inputRef.current?.click()}
                    className={`relative rounded-xl overflow-hidden cursor-pointer border-2 border-dashed transition-all duration-200
                      ${apercu ? 'border-primary' : 'border-gray-200 hover:border-primary'}`}
                  >
                    <input
                      ref={inputRef}
                      type="file"
                      accept="image/png,image/jpeg,image/jpg,image/webp"
                      onChange={handleImage}
                      className="hidden"
                    />

                    {apercu ? (
                      /* Prévisualisation */
                      <div className="relative aspect-video">
                        <img src={apercu} alt="aperçu" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/0 hover:bg-black/30 transition-colors
                                        flex items-center justify-center">
                          <div className="opacity-0 hover:opacity-100 transition-opacity bg-white/90
                                          rounded-xl px-4 py-2 text-sm font-medium text-secondary flex items-center gap-2">
                            <HiUpload size={16} /> Changer l'image
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* Zone vide */
                      <div className="aspect-video flex flex-col items-center justify-center gap-3 text-gray-400">
                        <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center">
                          <HiPhotograph size={28} />
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-medium text-secondary">Glissez une image ici</p>
                          <p className="text-xs mt-0.5">ou <span className="text-primary underline">cliquez pour choisir</span></p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Bouton supprimer l'image sélectionnée */}
                  {apercu && (
                    <button
                      type="button"
                      onClick={() => { setApercu(null); setForm({ ...form, image: null }) }}
                      className="mt-2 text-xs text-red-500 hover:underline flex items-center gap-1"
                    >
                      <HiTrash size={12} /> Retirer l'image
                    </button>
                  )}
                </div>

                {/* ---- Champs texte ---- */}
                <div>
                  <label className="text-sm font-medium text-secondary block mb-1.5">Titre du service *</label>
                  <input
                    type="text" value={form.titre}
                    onChange={e => setForm({ ...form, titre: e.target.value })}
                    placeholder="Ex: Réseaux & Systèmes"
                    required
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-primary text-sm"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-secondary block mb-1.5">Description *</label>
                  <textarea
                    rows={3} value={form.description}
                    onChange={e => setForm({ ...form, description: e.target.value })}
                    placeholder="Description courte et claire du service..."
                    required
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-primary text-sm resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-secondary block mb-1.5">Icône *</label>
                    <select
                      value={form.icone}
                      onChange={e => setForm({ ...form, icone: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-primary text-sm"
                    >
                      {ICONES_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-secondary block mb-1.5">Ordre d'affichage</label>
                    <input
                      type="number" value={form.ordre} min={1}
                      onChange={e => setForm({ ...form, ordre: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-primary text-sm"
                    />
                  </div>
                </div>

                {/* Boutons */}
                <div className="flex gap-3 pt-1">
                  <button
                    type="submit" disabled={saving}
                    className="btn-primary flex items-center gap-2 flex-1 justify-center py-3"
                  >
                    {saving
                      ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Enregistrement...</>
                      : <><HiCheck size={16} /> Enregistrer</>
                    }
                  </button>
                  <button type="button" onClick={() => setModal(null)} className="btn-outline px-6">
                    Annuler
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AdminLayout>
  )
}

export default AdminServices
