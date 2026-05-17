// admin/pages/AdminUtilisateurs.jsx — Gestion des utilisateurs admin

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  HiPlus, HiTrash, HiPencil, HiX, HiCheck,
  HiUser, HiLockClosed, HiShieldCheck
} from 'react-icons/hi'
import AdminLayout    from '../layout/AdminLayout'
import { supabase }  from '../../lib/supabase'
import { useAuthAdmin } from '../context/AuthAdminContext'

// Pages disponibles dans l'admin
const PAGES = [
  { id: 'contacts',    label: 'Messages / Contacts' },
  { id: 'services',    label: 'Services' },
  { id: 'galerie',     label: 'Galerie Photos' },
  { id: 'realisations',label: 'Réalisations' },
  { id: 'videos',      label: 'Vidéos' },
  { id: 'formations',  label: 'Formations' },
  { id: 'inscriptions',label: 'Inscriptions' },
  { id: 'temoignages', label: 'Témoignages' },
  { id: 'newsletter',  label: 'Newsletter' },
  { id: 'contenu',     label: 'Contenu des pages' },
  { id: 'settings',    label: 'Logo & Images' },
]

const VIDE_FORM = { nom: '', email: '', password: '', permissions: [], est_super_admin: false }

const AdminUtilisateurs = () => {
  const { admin: moi, isSuperAdmin } = useAuthAdmin()
  const [utilisateurs, setUtilisateurs] = useState([])
  const [loading,  setLoading]  = useState(true)
  const [modal,    setModal]    = useState(null) // null | 'create' | {id,...}
  const [form,     setForm]     = useState(VIDE_FORM)
  const [saving,   setSaving]   = useState(false)
  const [erreur,   setErreur]   = useState('')
  const [succes,   setSucces]   = useState('')
  const timerRef = useRef(null)

  const charger = useCallback(async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('admin_profiles')
        .select('id, nom, est_super_admin, permissions, created_at')
        .order('created_at')
      if (error) throw error
      setUtilisateurs(data || [])
    } catch (e) {
      setErreur(e.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    charger()
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [charger])

  const togglePermission = (id) => {
    setForm(prev => ({
      ...prev,
      permissions: prev.permissions.includes(id)
        ? prev.permissions.filter(p => p !== id)
        : [...prev.permissions, id],
    }))
  }

  const ouvrirCreation = () => {
    setForm(VIDE_FORM); setErreur(''); setSucces(''); setModal('create')
  }

  const ouvrirEdition = (u) => {
    setForm({
      nom: u.nom,
      email: '',
      password: '',
      permissions: u.permissions || [],
      est_super_admin: u.est_super_admin,
    })
    setErreur(''); setSucces('')
    setModal(u)
  }

  const sauvegarder = async () => {
    setSaving(true); setErreur(''); setSucces('')
    try {
      if (modal === 'create') {
        // Récupère le token de session pour l'API serverless
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) throw new Error('Session expirée — reconnectez-vous')

        const res = await fetch('/api/admin-users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            email: form.email,
            password: form.password,
            nom: form.nom,
            est_super_admin: form.est_super_admin,
            permissions: form.est_super_admin ? ['all'] : form.permissions,
          }),
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || 'Erreur création')
        setSucces('Utilisateur créé. Il peut maintenant se connecter avec ses identifiants.')
      } else {
        // Modifier profil existant (pas besoin de l'API serverless)
        const { error } = await supabase.from('admin_profiles').update({
          nom: form.nom,
          est_super_admin: form.est_super_admin,
          permissions: form.est_super_admin ? ['all'] : form.permissions,
        }).eq('id', modal.id)
        if (error) throw error
        setSucces('Profil mis à jour.')
      }
      await charger()
      timerRef.current = setTimeout(() => { setModal(null); setErreur(''); setSucces('') }, 1500)
    } catch (e) {
      setErreur(e.message)
    } finally {
      setSaving(false)
    }
  }

  const supprimer = async (u) => {
    if (u.id === moi?.id) { setErreur('Vous ne pouvez pas supprimer votre propre compte.'); return }
    if (!confirm(`Supprimer l'utilisateur ${u.nom} ?`)) return
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) throw new Error('Session expirée — reconnectez-vous')
      const res = await fetch('/api/admin-users', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ userId: u.id }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      await charger()
    } catch (e) {
      setErreur(e.message)
    }
  }

  if (!isSuperAdmin) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <HiShieldCheck size={56} className="mb-4 opacity-30" />
          <p className="text-lg font-medium">Accès réservé au super administrateur.</p>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-4xl">

        {/* En-tête */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold font-heading text-secondary">Utilisateurs admin</h2>
            <p className="text-gray-500 text-sm mt-1">Créez des comptes avec des accès limités à certaines pages.</p>
          </div>
          <button onClick={ouvrirCreation}
            className="btn-primary flex items-center gap-2">
            <HiPlus size={18} /> Nouvel utilisateur
          </button>
        </div>

        {erreur && !modal && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">{erreur}</div>
        )}

        {/* Liste des utilisateurs */}
        <div className="bg-white rounded-2xl shadow-card overflow-hidden">
          {loading ? (
            <div className="p-6 space-y-3">
              {[1,2,3].map(i => <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />)}
            </div>
          ) : !utilisateurs.length ? (
            <div className="text-center py-12 text-gray-400">
              <HiUser size={40} className="mx-auto mb-3 opacity-30" />
              <p>Aucun utilisateur. Créez le premier.</p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left text-xs font-bold text-gray-400 uppercase tracking-wider px-6 py-3">Nom</th>
                  <th className="text-left text-xs font-bold text-gray-400 uppercase tracking-wider px-6 py-3">Rôle</th>
                  <th className="text-left text-xs font-bold text-gray-400 uppercase tracking-wider px-6 py-3">Accès</th>
                  <th className="px-6 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {utilisateurs.map(u => (
                  <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold">
                          {u.nom?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-secondary text-sm">{u.nom}</p>
                          {u.id === moi?.id && <p className="text-xs text-primary">Vous</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {u.est_super_admin
                        ? <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary">
                            <HiShieldCheck size={12} /> Super admin
                          </span>
                        : <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600">
                            <HiUser size={12} /> Admin limité
                          </span>
                      }
                    </td>
                    <td className="px-6 py-4">
                      {u.est_super_admin || u.permissions?.includes('all')
                        ? <span className="text-xs text-gray-500">Toutes les pages</span>
                        : <span className="text-xs text-gray-500">
                            {(u.permissions || []).length === 0
                              ? 'Aucun accès'
                              : `${u.permissions.length} page${u.permissions.length > 1 ? 's' : ''}`
                            }
                          </span>
                      }
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2 justify-end">
                        <button onClick={() => ouvrirEdition(u)}
                          className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-primary/10 hover:text-primary text-gray-500 flex items-center justify-center transition-colors">
                          <HiPencil size={14} />
                        </button>
                        {u.id !== moi?.id && (
                          <button onClick={() => supprimer(u)}
                            className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-red-50 hover:text-red-500 text-gray-500 flex items-center justify-center transition-colors">
                            <HiTrash size={14} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* ── Modal création/édition ── */}
      <AnimatePresence>
        {modal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => { setModal(null); setErreur(''); setSucces('') }}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              onClick={e => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <h3 className="font-bold font-heading text-secondary">
                  {modal === 'create' ? 'Créer un utilisateur' : `Modifier — ${modal.nom}`}
                </h3>
                <button onClick={() => { setModal(null); setErreur(''); setSucces('') }}
                  className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400">
                  <HiX size={18} />
                </button>
              </div>

              <div className="px-6 py-5 space-y-5">

                {erreur && <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">{erreur}</div>}
                {succes && <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-xl flex items-center gap-2"><HiCheck size={16}/>{succes}</div>}

                {/* Nom */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-secondary flex items-center gap-2"><HiUser size={14}/> Nom complet</label>
                  <input type="text" value={form.nom} onChange={e => setForm({...form, nom: e.target.value})}
                    placeholder="Ex: Mamadou Diallo"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary" />
                </div>

                {/* Email — seulement à la création */}
                {modal === 'create' && (
                  <>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-secondary flex items-center gap-2"><HiUser size={14}/> Email</label>
                      <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                        placeholder="utilisateur@email.com"
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-secondary flex items-center gap-2"><HiLockClosed size={14}/> Mot de passe</label>
                      <input type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})}
                        placeholder="Minimum 6 caractères"
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary" />
                    </div>
                  </>
                )}

                {/* Rôle super admin */}
                <div className="flex items-center gap-3 p-4 bg-primary/5 rounded-xl border border-primary/20 cursor-pointer"
                  onClick={() => setForm(f => ({...f, est_super_admin: !f.est_super_admin}))}>
                  <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors ${
                    form.est_super_admin ? 'bg-primary border-primary' : 'border-gray-300'
                  }`}>
                    {form.est_super_admin && <HiCheck className="text-white" size={12} />}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-secondary flex items-center gap-1.5">
                      <HiShieldCheck className="text-primary" size={16}/> Super administrateur
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">Accès à toutes les pages sans restriction</p>
                  </div>
                </div>

                {/* Permissions par page */}
                {!form.est_super_admin && (
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-secondary mb-1">Pages accessibles</p>
                      <p className="text-xs text-gray-400">Sélectionnez les pages que cet utilisateur peut modifier</p>
                    </div>
                    <div className="grid grid-cols-1 gap-2">
                      {PAGES.map(page => (
                        <div key={page.id}
                          onClick={() => togglePermission(page.id)}
                          className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                            form.permissions.includes(page.id)
                              ? 'border-primary bg-primary/5'
                              : 'border-gray-100 hover:border-gray-200'
                          }`}
                        >
                          <div className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${
                            form.permissions.includes(page.id) ? 'bg-primary border-primary' : 'border-gray-300'
                          }`}>
                            {form.permissions.includes(page.id) && <HiCheck className="text-white" size={10} />}
                          </div>
                          <span className="text-sm text-secondary">{page.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Bouton sauvegarder */}
                <button onClick={sauvegarder} disabled={saving || !form.nom || (modal === 'create' && (!form.email || !form.password))}
                  className="w-full btn-primary py-3 flex items-center justify-center gap-2">
                  {saving
                    ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> En cours...</>
                    : <><HiCheck size={16} /> {modal === 'create' ? 'Créer l\'utilisateur' : 'Enregistrer'}</>
                  }
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AdminLayout>
  )
}

export default AdminUtilisateurs
