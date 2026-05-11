// ============================================================
// admin/pages/AdminContacts.jsx — Gestion des messages de contact
// Lecture, marquage comme lu, suppression
// ============================================================

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HiMail, HiTrash, HiCheck, HiX, HiPhone } from 'react-icons/hi'
import AdminLayout from '../layout/AdminLayout'
import adminApi   from '../services/adminApi'
import useFetch   from '../../hooks/useFetch'

const AdminContacts = () => {
  const { data: contacts, loading, refetch } = useFetch(() => adminApi.get('/admin/contacts'))
  const [selected, setSelected] = useState(null) // Message ouvert dans la modale

  const marquerLu = async (id) => {
    await adminApi.patch(`/admin/contacts/${id}/lu`)
    refetch()
  }

  const supprimer = async (id) => {
    if (!confirm('Supprimer ce message ?')) return
    await adminApi.delete(`/admin/contacts/${id}`)
    setSelected(null)
    refetch()
  }

  const liste = contacts || []
  const nonLus = liste.filter((c) => !c.lu).length

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* En-tête */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold font-heading text-secondary">Messages de contact</h2>
            <p className="text-gray-500 text-sm mt-1">
              {liste.length} message{liste.length > 1 ? 's' : ''} —{' '}
              <span className="text-primary font-medium">{nonLus} non lu{nonLus > 1 ? 's' : ''}</span>
            </p>
          </div>
        </div>

        {/* Tableau des messages */}
        <div className="bg-white rounded-2xl shadow-card overflow-hidden">
          {loading ? (
            <div className="p-8 space-y-3">
              {[1,2,3,4].map(i => <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />)}
            </div>
          ) : liste.length === 0 ? (
            <div className="p-12 text-center text-gray-400">
              <HiMail size={40} className="mx-auto mb-3 text-gray-200" />
              <p>Aucun message reçu</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {liste.map((contact) => (
                <motion.div
                  key={contact.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`flex items-center gap-4 px-6 py-4 hover:bg-gray-50 cursor-pointer transition-colors
                    ${!contact.lu ? 'bg-primary/5 border-l-4 border-primary' : ''}`}
                  onClick={() => { setSelected(contact); marquerLu(contact.id) }}
                >
                  {/* Avatar */}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0
                    ${!contact.lu ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'}`}>
                    {contact.nom?.charAt(0).toUpperCase()}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className={`text-sm font-semibold truncate ${!contact.lu ? 'text-secondary' : 'text-gray-600'}`}>
                        {contact.nom}
                      </p>
                      {!contact.lu && <span className="w-2 h-2 bg-primary rounded-full shrink-0" />}
                    </div>
                    <p className="text-xs text-gray-400 truncate">{contact.sujet}</p>
                  </div>

                  <p className="text-xs text-gray-400 shrink-0">
                    {new Date(contact.created_at).toLocaleDateString('fr-FR')}
                  </p>

                  {/* Supprimer */}
                  <button
                    onClick={(e) => { e.stopPropagation(); supprimer(contact.id) }}
                    className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors shrink-0"
                  >
                    <HiTrash size={16} />
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ---- Modale de lecture d'un message ---- */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-lg"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header modale */}
              <div className="flex items-center justify-between px-6 py-4 border-b">
                <h3 className="font-bold font-heading text-secondary">Message reçu</h3>
                <button onClick={() => setSelected(null)} className="p-1.5 hover:bg-gray-100 rounded-lg">
                  <HiX size={18} />
                </button>
              </div>

              {/* Corps */}
              <div className="p-6 space-y-4">
                {/* Expéditeur */}
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                    {selected.nom?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-bold text-secondary">{selected.nom}</p>
                    <a href={`mailto:${selected.email}`} className="text-primary text-sm hover:underline flex items-center gap-1">
                      <HiMail size={14} /> {selected.email}
                    </a>
                    {selected.telephone && (
                      <a href={`tel:${selected.telephone}`} className="text-gray-500 text-sm flex items-center gap-1 mt-0.5">
                        <HiPhone size={14} /> {selected.telephone}
                      </a>
                    )}
                  </div>
                </div>

                {/* Sujet */}
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Sujet</p>
                  <p className="font-semibold text-secondary">{selected.sujet}</p>
                </div>

                {/* Message */}
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Message</p>
                  <p className="text-gray-700 leading-relaxed text-sm whitespace-pre-wrap">{selected.message}</p>
                </div>

                <p className="text-xs text-gray-400">
                  Reçu le {new Date(selected.created_at).toLocaleString('fr-FR')}
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-3 px-6 py-4 border-t">
                <a href={`mailto:${selected.email}?subject=Re: ${selected.sujet}`}
                  className="btn-primary flex items-center gap-2 text-sm flex-1 justify-center">
                  <HiMail size={16} /> Répondre par email
                </a>
                <button onClick={() => supprimer(selected.id)}
                  className="px-4 py-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-2 text-sm border border-red-200">
                  <HiTrash size={16} /> Supprimer
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AdminLayout>
  )
}

export default AdminContacts
