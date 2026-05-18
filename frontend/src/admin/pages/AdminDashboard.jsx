// ============================================================
// admin/pages/AdminDashboard.jsx — Tableau de bord principal
// Statistiques globales, derniers messages et inscriptions
// ============================================================

import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  HiMail, HiCog, HiPhotograph, HiAcademicCap,
  HiClipboardList, HiStar, HiNewspaper, HiArrowRight, HiPlay
} from 'react-icons/hi'
import AdminLayout       from '../layout/AdminLayout'
import adminApi          from '../services/adminApi'
import { useAuthAdmin }  from '../context/AuthAdminContext'

// Carte de statistique colorée
const StatCard = ({ label, valeur, icon, couleur, lien, badge }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className={`${couleur} rounded-2xl p-6 text-white relative overflow-hidden`}
  >
    <div className="flex items-start justify-between">
      <div>
        <p className="text-white/70 text-sm font-medium">{label}</p>
        <p className="text-4xl font-bold font-heading mt-1">{valeur ?? '—'}</p>
        {badge > 0 && (
          <p className="text-white/80 text-xs mt-1">{badge} non lu{badge > 1 ? 's' : ''}</p>
        )}
      </div>
      <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
        {icon}
      </div>
    </div>
    {lien && (
      <Link to={lien} className="mt-4 flex items-center gap-1 text-white/70 hover:text-white text-xs transition-colors">
        Voir tout <HiArrowRight size={12} />
      </Link>
    )}
    {/* Décoration */}
    <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/10 rounded-full" />
  </motion.div>
)

const AdminDashboard = () => {
  const { aAcces, isSuperAdmin } = useAuthAdmin()
  const [data, setData]     = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    adminApi.get('/admin/dashboard')
      .then((res) => setData(res.data.data))
      .finally(() => setLoading(false))
  }, [])

  const stats = data?.stats

  return (
    <AdminLayout stats={stats}>
      <div className="space-y-6">
        {/* En-tête */}
        <div>
          <h2 className="text-2xl font-bold font-heading text-secondary">Tableau de bord</h2>
          <p className="text-gray-500 text-sm mt-1">Vue d'ensemble de Hindo Digital</p>
        </div>

        {/* Grille de statistiques — filtrée selon les permissions */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {aAcces('contacts')     && <StatCard label="Messages"       valeur={stats?.contacts?.total}  icon={<HiMail size={22} />}         couleur="bg-primary"    lien="/admin/contacts"     badge={stats?.contacts?.non_lus} />}
          {aAcces('services')     && <StatCard label="Services"       valeur={stats?.services}         icon={<HiCog size={22} />}          couleur="bg-secondary"  lien="/admin/services"    />}
          {aAcces('galerie')      && <StatCard label="Galerie Photos" valeur={stats?.galerie}          icon={<HiPhotograph size={22} />}   couleur="bg-blue-600"   lien="/admin/galerie"      />}
          {aAcces('realisations') && <StatCard label="Réalisations"   valeur={stats?.realisations}     icon={<HiPhotograph size={22} />}   couleur="bg-cyan-600"   lien="/admin/realisations" />}
          {aAcces('videos')       && <StatCard label="Vidéos"         valeur={stats?.videos}           icon={<HiPlay size={22} />}         couleur="bg-indigo-600" lien="/admin/videos"      />}
          {aAcces('formations')   && <StatCard label="Formations"     valeur={stats?.formations}       icon={<HiAcademicCap size={22} />}  couleur="bg-green-600"  lien="/admin/formations"  />}
          {aAcces('inscriptions') && <StatCard label="Inscriptions"   valeur={stats?.inscriptions}     icon={<HiClipboardList size={22}/>} couleur="bg-yellow-500" lien="/admin/inscriptions" />}
          {aAcces('temoignages')  && <StatCard label="Témoignages"    valeur={stats?.temoignages}      icon={<HiStar size={22} />}         couleur="bg-purple-600" lien="/admin/temoignages" />}
          {aAcces('newsletter')   && <StatCard label="Newsletter"     valeur={stats?.newsletters}      icon={<HiNewspaper size={22} />}    couleur="bg-pink-500"   lien="/admin/newsletter"  />}
        </div>

        {/* Sections détail — uniquement si l'utilisateur a accès */}
        {(aAcces('contacts') || aAcces('inscriptions')) && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Derniers messages */}
            {aAcces('contacts') && (
              <div className="bg-white rounded-2xl shadow-card p-6">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-bold font-heading text-secondary">Derniers messages</h3>
                  <Link to="/admin/contacts" className="text-primary text-sm hover:underline flex items-center gap-1">
                    Tout voir <HiArrowRight size={14} />
                  </Link>
                </div>
                {loading ? (
                  <div className="space-y-3">
                    {[1,2,3].map(i => <div key={i} className="h-14 bg-gray-100 rounded-xl animate-pulse" />)}
                  </div>
                ) : data?.derniers_contacts?.length > 0 ? (
                  <div className="space-y-3">
                    {data.derniers_contacts.map((c) => (
                      <div key={c.id} className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                        <div className="w-9 h-9 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-sm shrink-0">
                          {c.nom?.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-secondary text-sm truncate">{c.nom}</p>
                          <p className="text-gray-500 text-xs truncate">{c.sujet}</p>
                        </div>
                        <span className="w-2 h-2 bg-primary rounded-full mt-1.5 shrink-0" title="Non lu" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 text-sm text-center py-6">Aucun message non lu</p>
                )}
              </div>
            )}

            {/* Dernières inscriptions */}
            {aAcces('inscriptions') && (
              <div className="bg-white rounded-2xl shadow-card p-6">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-bold font-heading text-secondary">Dernières inscriptions</h3>
                  <Link to="/admin/inscriptions" className="text-primary text-sm hover:underline flex items-center gap-1">
                    Tout voir <HiArrowRight size={14} />
                  </Link>
                </div>
                {loading ? (
                  <div className="space-y-3">
                    {[1,2,3].map(i => <div key={i} className="h-14 bg-gray-100 rounded-xl animate-pulse" />)}
                  </div>
                ) : data?.dernieres_inscriptions?.length > 0 ? (
                  <div className="space-y-3">
                    {data.dernieres_inscriptions.map((ins) => (
                      <div key={ins.id} className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                        <div className="w-9 h-9 bg-green-100 rounded-full flex items-center justify-center text-green-700 font-bold text-sm shrink-0">
                          {ins.nom?.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-secondary text-sm truncate">{ins.nom}</p>
                          <p className="text-gray-500 text-xs truncate">{ins.formation?.titre ?? 'Formation'}</p>
                        </div>
                        <p className="text-gray-400 text-xs shrink-0">
                          {new Date(ins.created_at).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 text-sm text-center py-6">Aucune inscription récente</p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  )
}

export default AdminDashboard
