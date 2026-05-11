// ============================================================
// admin/pages/AdminInscriptions.jsx — Consultation des inscriptions
// ============================================================

import { HiTrash, HiMail, HiPhone } from 'react-icons/hi'
import AdminLayout from '../layout/AdminLayout'
import adminApi   from '../services/adminApi'
import useFetch   from '../../hooks/useFetch'

const AdminInscriptions = () => {
  const { data: inscriptions, loading, refetch } = useFetch(() => adminApi.get('/admin/inscriptions'))

  const supprimer = async (id) => {
    if (!confirm('Supprimer cette inscription ?')) return
    await adminApi.delete(`/admin/inscriptions/${id}`)
    refetch()
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold font-heading text-secondary">Inscriptions aux formations</h2>
          <p className="text-gray-500 text-sm mt-1">{(inscriptions||[]).length} inscription(s)</p>
        </div>

        <div className="bg-white rounded-2xl shadow-card overflow-hidden">
          {loading ? (
            <div className="p-6 space-y-3">{[1,2,3].map(i=><div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />)}</div>
          ) : (inscriptions||[]).length === 0 ? (
            <div className="p-12 text-center text-gray-400">Aucune inscription enregistrée</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left px-6 py-3 text-xs text-gray-500 font-semibold uppercase">Apprenant</th>
                    <th className="text-left px-6 py-3 text-xs text-gray-500 font-semibold uppercase hidden md:table-cell">Formation</th>
                    <th className="text-left px-6 py-3 text-xs text-gray-500 font-semibold uppercase hidden lg:table-cell">Date</th>
                    <th className="text-right px-6 py-3 text-xs text-gray-500 font-semibold uppercase">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {(inscriptions||[]).map((ins) => (
                    <tr key={ins.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-semibold text-secondary text-sm">{ins.nom}</p>
                        <div className="flex flex-col gap-0.5 mt-0.5">
                          <a href={`mailto:${ins.email}`} className="text-primary text-xs flex items-center gap-1 hover:underline">
                            <HiMail size={12} /> {ins.email}
                          </a>
                          {ins.telephone && (
                            <a href={`tel:${ins.telephone}`} className="text-gray-400 text-xs flex items-center gap-1 hover:underline">
                              <HiPhone size={12} /> {ins.telephone}
                            </a>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 hidden md:table-cell">
                        <span className="text-sm text-secondary font-medium">{ins.formation?.titre ?? '—'}</span>
                      </td>
                      <td className="px-6 py-4 text-gray-500 text-sm hidden lg:table-cell">
                        {new Date(ins.created_at).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button onClick={()=>supprimer(ins.id)} className="p-2 hover:bg-red-50 text-red-400 rounded-lg transition-colors">
                          <HiTrash size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}

export default AdminInscriptions
