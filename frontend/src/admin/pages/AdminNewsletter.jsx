// ============================================================
// admin/pages/AdminNewsletter.jsx — Consultation des abonnés
// ============================================================

import { HiMail, HiCheck, HiX } from 'react-icons/hi'
import AdminLayout from '../layout/AdminLayout'
import adminApi   from '../services/adminApi'
import useFetch   from '../../hooks/useFetch'

const AdminNewsletter = () => {
  const { data: abonnes, loading } = useFetch(() => adminApi.get('/admin/newsletters').catch(()=>({data:{data:[]}})))

  const actifs   = (abonnes||[]).filter(a=>a.actif).length
  const inactifs = (abonnes||[]).filter(a=>!a.actif).length

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold font-heading text-secondary">Newsletter</h2>
          <p className="text-gray-500 text-sm mt-1">
            {actifs} abonné(s) actif(s) · {inactifs} désabonné(s)
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl shadow-card p-6 text-center">
            <p className="text-4xl font-bold font-heading text-primary">{actifs}</p>
            <p className="text-gray-500 text-sm mt-1">Abonnés actifs</p>
          </div>
          <div className="bg-white rounded-2xl shadow-card p-6 text-center">
            <p className="text-4xl font-bold font-heading text-gray-400">{inactifs}</p>
            <p className="text-gray-500 text-sm mt-1">Désabonnés</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-card overflow-hidden">
          {loading ? (
            <div className="p-6 space-y-3">{[1,2,3].map(i=><div key={i} className="h-12 bg-gray-100 rounded-xl animate-pulse" />)}</div>
          ) : (abonnes||[]).length === 0 ? (
            <div className="p-12 text-center text-gray-400">
              <HiMail size={40} className="mx-auto mb-3 text-gray-200" />
              <p>Aucun abonné enregistré</p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-6 py-3 text-xs text-gray-500 font-semibold uppercase">Email</th>
                  <th className="text-left px-6 py-3 text-xs text-gray-500 font-semibold uppercase">Statut</th>
                  <th className="text-left px-6 py-3 text-xs text-gray-500 font-semibold uppercase hidden md:table-cell">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {(abonnes||[]).map((a) => (
                  <tr key={a.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-3">
                      <a href={`mailto:${a.email}`} className="text-sm text-secondary hover:text-primary transition-colors flex items-center gap-1">
                        <HiMail size={14} className="text-primary" /> {a.email}
                      </a>
                    </td>
                    <td className="px-6 py-3">
                      <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${
                        a.actif ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                      }`}>
                        {a.actif ? <><HiCheck size={12} /> Actif</> : <><HiX size={12} /> Inactif</>}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-gray-400 text-sm hidden md:table-cell">
                      {new Date(a.created_at).toLocaleDateString('fr-FR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}

export default AdminNewsletter
