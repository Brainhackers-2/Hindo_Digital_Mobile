// ============================================================
// admin/pages/AdminRealisations.jsx — CRUD des réalisations
// Avec upload d'image via FormData
// ============================================================

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HiPlus, HiPencil, HiTrash, HiX, HiCheck, HiPhotograph } from 'react-icons/hi'
import AdminLayout from '../layout/AdminLayout'
import adminApi   from '../services/adminApi'
import useFetch   from '../../hooks/useFetch'

const CATEGORIES = ['Réseaux','Vidéosurveillance','Web & Mobile','Formation','Infographie','Autre']
const VIDE = { titre: '', categorie: 'Réseaux', description: '', image: null }
const API_URL = import.meta.env.VITE_API_BASE_URL?.replace('/api/v1','') || 'http://localhost:8000'

const AdminRealisations = () => {
  const { data: realisations, loading, refetch } = useFetch(() => adminApi.get('/admin/realisations'))
  const [modal, setModal]   = useState(null)
  const [form, setForm]     = useState(VIDE)
  const [preview, setPreview] = useState(null)
  const [saving, setSaving] = useState(false)
  const [erreur, setErreur] = useState('')

  const ouvrirCreation = () => { setForm(VIDE); setPreview(null); setErreur(''); setModal('create') }
  const ouvrirEdition  = (r)  => { setForm({titre:r.titre, categorie:r.categorie, description:r.description||'', image:null}); setPreview(r.image_url); setErreur(''); setModal(r) }

  const handleImage = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setForm({...form, image: file})
    setPreview(URL.createObjectURL(file))
  }

  const sauvegarder = async (e) => {
    e.preventDefault()
    setSaving(true)
    setErreur('')
    try {
      const fd = new FormData()
      fd.append('titre', form.titre)
      fd.append('categorie', form.categorie)
      fd.append('description', form.description)
      if (form.image) fd.append('image', form.image)

      if (modal === 'create') {
        await adminApi.post('/admin/realisations', fd, { headers: {'Content-Type': 'multipart/form-data'} })
      } else {
        await adminApi.post(`/admin/realisations/${modal.id}`, fd, { headers: {'Content-Type': 'multipart/form-data'} })
      }
      refetch()
      setModal(null)
    } catch (err) {
      setErreur(err.response?.data?.message || 'Erreur lors de l\'enregistrement.')
    } finally {
      setSaving(false)
    }
  }

  const supprimer = async (id) => {
    if (!confirm('Supprimer cette réalisation et son image ?')) return
    await adminApi.delete(`/admin/realisations/${id}`)
    refetch()
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold font-heading text-secondary">Réalisations</h2>
            <p className="text-gray-500 text-sm mt-1">{(realisations||[]).length} projet(s)</p>
          </div>
          <button onClick={ouvrirCreation} className="btn-primary flex items-center gap-2">
            <HiPlus size={18} /> Ajouter
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1,2,3,4,5,6].map(i=><div key={i} className="h-52 bg-white rounded-2xl animate-pulse" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {(realisations||[]).map((r) => (
              <motion.div key={r.id} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}}
                className="bg-white rounded-2xl shadow-card overflow-hidden group">
                {/* Image */}
                <div className="aspect-video bg-gray-100 relative overflow-hidden">
                  <img
                    src={r.image_url || `https://placehold.co/400x250/8B0000/white?text=${encodeURIComponent(r.titre)}`}
                    alt={r.titre}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                </div>
                {/* Info */}
                <div className="p-4">
                  <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                    {r.categorie}
                  </span>
                  <p className="font-bold text-secondary text-sm mt-2 mb-1">{r.titre}</p>
                  <p className="text-gray-400 text-xs line-clamp-2">{r.description}</p>
                  <div className="flex gap-2 mt-3">
                    <button onClick={()=>ouvrirEdition(r)} className="flex-1 flex items-center justify-center gap-1 py-1.5 text-xs text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                      <HiPencil size={14} /> Modifier
                    </button>
                    <button onClick={()=>supprimer(r.id)} className="flex-1 flex items-center justify-center gap-1 py-1.5 text-xs text-red-500 bg-red-50 hover:bg-red-100 rounded-lg transition-colors">
                      <HiTrash size={14} /> Supprimer
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {modal && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={()=>setModal(null)}>
            <motion.div initial={{scale:0.9}} animate={{scale:1}} exit={{scale:0.9}}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
              onClick={e=>e.stopPropagation()}>
              <div className="flex items-center justify-between px-6 py-4 border-b sticky top-0 bg-white">
                <h3 className="font-bold font-heading text-secondary">
                  {modal==='create' ? 'Nouvelle réalisation' : 'Modifier la réalisation'}
                </h3>
                <button onClick={()=>setModal(null)} className="p-1.5 hover:bg-gray-100 rounded-lg"><HiX size={18}/></button>
              </div>
              <form onSubmit={sauvegarder} className="p-6 space-y-4">
                {erreur && <p className="text-red-500 text-sm bg-red-50 px-4 py-2 rounded-lg">{erreur}</p>}

                {/* Upload image */}
                <div>
                  <label className="text-sm font-medium text-secondary block mb-1.5">Image du projet</label>
                  <label className="relative cursor-pointer group">
                    <div className={`aspect-video rounded-xl overflow-hidden border-2 border-dashed transition-colors
                      ${preview ? 'border-primary' : 'border-gray-200 hover:border-primary'}`}>
                      {preview ? (
                        <img src={preview} alt="aperçu" className="w-full h-full object-cover" />
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-2">
                          <HiPhotograph size={32} />
                          <p className="text-sm">Cliquer pour ajouter une image</p>
                          <p className="text-xs">JPEG, PNG, WebP — max 5 Mo</p>
                        </div>
                      )}
                      {preview && (
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <p className="text-white text-sm font-medium">Changer l'image</p>
                        </div>
                      )}
                    </div>
                    <input type="file" accept="image/*" onChange={handleImage} className="hidden" />
                  </label>
                </div>

                <div>
                  <label className="text-sm font-medium text-secondary block mb-1.5">Titre *</label>
                  <input type="text" value={form.titre} onChange={e=>setForm({...form,titre:e.target.value})} required
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-primary text-sm" />
                </div>
                <div>
                  <label className="text-sm font-medium text-secondary block mb-1.5">Catégorie *</label>
                  <select value={form.categorie} onChange={e=>setForm({...form,categorie:e.target.value})}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-primary text-sm">
                    {CATEGORIES.map(c=><option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-secondary block mb-1.5">Description</label>
                  <textarea rows={3} value={form.description} onChange={e=>setForm({...form,description:e.target.value})}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-primary text-sm resize-none" />
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2 flex-1 justify-center">
                    {saving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <HiCheck size={16} />}
                    {saving ? 'Enregistrement...' : 'Enregistrer'}
                  </button>
                  <button type="button" onClick={()=>setModal(null)} className="btn-outline px-6">Annuler</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AdminLayout>
  )
}

export default AdminRealisations
