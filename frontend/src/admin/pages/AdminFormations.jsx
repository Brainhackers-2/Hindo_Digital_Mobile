// ============================================================
// admin/pages/AdminFormations.jsx — CRUD des formations
// ============================================================

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HiPlus, HiPencil, HiTrash, HiX, HiCheck } from 'react-icons/hi'
import AdminLayout from '../layout/AdminLayout'
import adminApi   from '../services/adminApi'
import useFetch   from '../../hooks/useFetch'

const NIVEAUX = ['Débutant', 'Intermédiaire', 'Avancé']
const VIDE = { titre: '', description: '', duree: '', niveau: 'Débutant', prix: '' }

const BadgeNiveau = ({ niveau }) => {
  const c = { 'Débutant':'bg-green-100 text-green-700', 'Intermédiaire':'bg-yellow-100 text-yellow-700', 'Avancé':'bg-red-100 text-red-700' }
  return <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${c[niveau]||'bg-gray-100 text-gray-600'}`}>{niveau}</span>
}

const AdminFormations = () => {
  const { data: formations, loading, refetch } = useFetch(() => adminApi.get('/admin/formations'))
  const [modal, setModal]   = useState(null)
  const [form, setForm]     = useState(VIDE)
  const [saving, setSaving] = useState(false)
  const [erreur, setErreur] = useState('')

  const ouvrirCreation = () => { setForm(VIDE); setErreur(''); setModal('create') }
  const ouvrirEdition  = (f) => { setForm({titre:f.titre,description:f.description,duree:f.duree,niveau:f.niveau,prix:f.prix??''}); setErreur(''); setModal(f) }

  const sauvegarder = async (e) => {
    e.preventDefault()
    setSaving(true)
    setErreur('')
    try {
      const payload = { ...form, prix: form.prix === '' ? null : Number(form.prix) }
      if (modal === 'create') {
        await adminApi.post('/admin/formations', payload)
      } else {
        await adminApi.put(`/admin/formations/${modal.id}`, payload)
      }
      refetch()
      setModal(null)
    } catch (err) {
      setErreur(err.response?.data?.message || 'Erreur.')
    } finally {
      setSaving(false)
    }
  }

  const supprimer = async (id) => {
    if (!confirm('Supprimer cette formation ? Les inscriptions associées seront également supprimées.')) return
    await adminApi.delete(`/admin/formations/${id}`)
    refetch()
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold font-heading text-secondary">Formations</h2>
            <p className="text-gray-500 text-sm mt-1">{(formations||[]).length} formation(s)</p>
          </div>
          <button onClick={ouvrirCreation} className="btn-primary flex items-center gap-2">
            <HiPlus size={18} /> Ajouter
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-card overflow-hidden">
          {loading ? (
            <div className="p-6 space-y-3">{[1,2,3].map(i=><div key={i} className="h-20 bg-gray-100 rounded-xl animate-pulse" />)}</div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-6 py-3 text-xs text-gray-500 font-semibold uppercase">Titre</th>
                  <th className="text-left px-6 py-3 text-xs text-gray-500 font-semibold uppercase hidden md:table-cell">Niveau</th>
                  <th className="text-left px-6 py-3 text-xs text-gray-500 font-semibold uppercase hidden lg:table-cell">Durée</th>
                  <th className="text-left px-6 py-3 text-xs text-gray-500 font-semibold uppercase hidden lg:table-cell">Prix</th>
                  <th className="text-left px-6 py-3 text-xs text-gray-500 font-semibold uppercase hidden lg:table-cell">Inscrits</th>
                  <th className="text-right px-6 py-3 text-xs text-gray-500 font-semibold uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {(formations||[]).map((f) => (
                  <tr key={f.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-secondary text-sm">{f.titre}</p>
                      <p className="text-gray-400 text-xs mt-0.5 line-clamp-1">{f.description}</p>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell"><BadgeNiveau niveau={f.niveau} /></td>
                    <td className="px-6 py-4 text-gray-500 text-sm hidden lg:table-cell">{f.duree}</td>
                    <td className="px-6 py-4 text-gray-500 text-sm hidden lg:table-cell">
                      {f.prix ? `${f.prix.toLocaleString('fr-FR')} FCFA` : 'Gratuit'}
                    </td>
                    <td className="px-6 py-4 hidden lg:table-cell">
                      <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                        {f.inscriptions_count ?? 0} inscrits
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={()=>ouvrirEdition(f)} className="p-2 hover:bg-blue-50 text-blue-500 rounded-lg transition-colors"><HiPencil size={16} /></button>
                        <button onClick={()=>supprimer(f.id)} className="p-2 hover:bg-red-50 text-red-500 rounded-lg transition-colors"><HiTrash size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
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
                <h3 className="font-bold font-heading text-secondary">{modal==='create'?'Nouvelle formation':'Modifier la formation'}</h3>
                <button onClick={()=>setModal(null)} className="p-1.5 hover:bg-gray-100 rounded-lg"><HiX size={18}/></button>
              </div>
              <form onSubmit={sauvegarder} className="p-6 space-y-4">
                {erreur && <p className="text-red-500 text-sm bg-red-50 px-4 py-2 rounded-lg">{erreur}</p>}
                <div>
                  <label className="text-sm font-medium text-secondary block mb-1.5">Titre *</label>
                  <input type="text" value={form.titre} onChange={e=>setForm({...form,titre:e.target.value})} required
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-primary text-sm" />
                </div>
                <div>
                  <label className="text-sm font-medium text-secondary block mb-1.5">Description *</label>
                  <textarea rows={3} value={form.description} onChange={e=>setForm({...form,description:e.target.value})} required
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-primary text-sm resize-none" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-secondary block mb-1.5">Durée *</label>
                    <input type="text" value={form.duree} onChange={e=>setForm({...form,duree:e.target.value})} required placeholder="ex: 2 semaines"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-primary text-sm" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-secondary block mb-1.5">Niveau *</label>
                    <select value={form.niveau} onChange={e=>setForm({...form,niveau:e.target.value})}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-primary text-sm">
                      {NIVEAUX.map(n=><option key={n} value={n}>{n}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-secondary block mb-1.5">Prix (FCFA) — laisser vide si gratuit</label>
                  <input type="number" value={form.prix} onChange={e=>setForm({...form,prix:e.target.value})} min={0} placeholder="ex: 50000"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-primary text-sm" />
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

export default AdminFormations
