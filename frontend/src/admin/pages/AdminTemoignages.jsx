// ============================================================
// admin/pages/AdminTemoignages.jsx — CRUD des témoignages clients
// ============================================================

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HiPlus, HiPencil, HiTrash, HiX, HiCheck, HiStar } from 'react-icons/hi'
import AdminLayout from '../layout/AdminLayout'
import adminApi   from '../services/adminApi'
import useFetch   from '../../hooks/useFetch'

const VIDE = { nom: '', poste: '', texte: '', note: 5, actif: true }

const AdminTemoignages = () => {
  const { data: temoignages, loading, refetch } = useFetch(() => adminApi.get('/admin/temoignages'))
  const [modal, setModal]   = useState(null)
  const [form, setForm]     = useState(VIDE)
  const [saving, setSaving] = useState(false)
  const [erreur, setErreur] = useState('')

  const ouvrirCreation = () => { setForm(VIDE); setErreur(''); setModal('create') }
  const ouvrirEdition  = (t) => { setForm({nom:t.nom,poste:t.poste||'',texte:t.texte,note:t.note,actif:t.actif}); setErreur(''); setModal(t) }

  const sauvegarder = async (e) => {
    e.preventDefault()
    setSaving(true)
    setErreur('')
    try {
      if (modal === 'create') await adminApi.post('/admin/temoignages', form)
      else await adminApi.put(`/admin/temoignages/${modal.id}`, form)
      refetch()
      setModal(null)
    } catch (err) {
      setErreur(err.response?.data?.message || 'Erreur.')
    } finally {
      setSaving(false)
    }
  }

  const supprimer = async (id) => {
    if (!confirm('Supprimer ce témoignage ?')) return
    await adminApi.delete(`/admin/temoignages/${id}`)
    refetch()
  }

  const basculerActif = async (t) => {
    await adminApi.put(`/admin/temoignages/${t.id}`, { ...t, actif: !t.actif })
    refetch()
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold font-heading text-secondary">Témoignages</h2>
            <p className="text-gray-500 text-sm mt-1">{(temoignages||[]).length} témoignage(s)</p>
          </div>
          <button onClick={ouvrirCreation} className="btn-primary flex items-center gap-2">
            <HiPlus size={18} /> Ajouter
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1,2,3].map(i=><div key={i} className="h-44 bg-white rounded-2xl animate-pulse" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {(temoignages||[]).map((t) => (
              <motion.div key={t.id} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}}
                className={`bg-white rounded-2xl shadow-card p-5 border-2 ${t.actif ? 'border-green-200' : 'border-gray-100 opacity-60'}`}>
                {/* Étoiles */}
                <div className="flex gap-0.5 mb-3">
                  {[1,2,3,4,5].map(i=><HiStar key={i} size={14} className={i<=t.note?'text-yellow-400':'text-gray-200'} />)}
                </div>
                <p className="text-gray-600 text-sm italic line-clamp-3 mb-4">"{t.texte}"</p>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-xs">
                    {t.nom?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-secondary text-sm">{t.nom}</p>
                    <p className="text-gray-400 text-xs">{t.poste}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 border-t pt-3">
                  {/* Toggle visible/caché */}
                  <button onClick={()=>basculerActif(t)}
                    className={`flex-1 text-xs font-medium py-1.5 rounded-lg transition-colors ${
                      t.actif ? 'bg-green-50 text-green-700 hover:bg-green-100' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                    }`}>
                    {t.actif ? '✓ Visible' : '○ Masqué'}
                  </button>
                  <button onClick={()=>ouvrirEdition(t)} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors">
                    <HiPencil size={15} />
                  </button>
                  <button onClick={()=>supprimer(t.id)} className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg transition-colors">
                    <HiTrash size={15} />
                  </button>
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
              className="bg-white rounded-2xl shadow-2xl w-full max-w-lg"
              onClick={e=>e.stopPropagation()}>
              <div className="flex items-center justify-between px-6 py-4 border-b">
                <h3 className="font-bold font-heading text-secondary">{modal==='create'?'Nouveau témoignage':'Modifier le témoignage'}</h3>
                <button onClick={()=>setModal(null)} className="p-1.5 hover:bg-gray-100 rounded-lg"><HiX size={18}/></button>
              </div>
              <form onSubmit={sauvegarder} className="p-6 space-y-4">
                {erreur && <p className="text-red-500 text-sm bg-red-50 px-4 py-2 rounded-lg">{erreur}</p>}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-secondary block mb-1.5">Nom *</label>
                    <input type="text" value={form.nom} onChange={e=>setForm({...form,nom:e.target.value})} required
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-primary text-sm" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-secondary block mb-1.5">Poste / Entreprise</label>
                    <input type="text" value={form.poste} onChange={e=>setForm({...form,poste:e.target.value})} placeholder="ex: Directeur, PME"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-primary text-sm" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-secondary block mb-1.5">Témoignage *</label>
                  <textarea rows={4} value={form.texte} onChange={e=>setForm({...form,texte:e.target.value})} required
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-primary text-sm resize-none" />
                </div>
                <div className="flex items-center gap-6">
                  <div>
                    <label className="text-sm font-medium text-secondary block mb-1.5">Note</label>
                    <div className="flex gap-1">
                      {[1,2,3,4,5].map(n=>(
                        <button key={n} type="button" onClick={()=>setForm({...form,note:n})}>
                          <HiStar size={22} className={n<=form.note?'text-yellow-400':'text-gray-200'} />
                        </button>
                      ))}
                    </div>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer mt-4">
                    <input type="checkbox" checked={form.actif} onChange={e=>setForm({...form,actif:e.target.checked})} className="w-4 h-4 accent-primary" />
                    <span className="text-sm text-secondary">Visible sur le site</span>
                  </label>
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

export default AdminTemoignages
