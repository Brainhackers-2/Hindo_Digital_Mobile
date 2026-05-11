// ============================================================
// admin/pages/AdminSettings.jsx — Logo du site + Photo de l'équipe
// Deux sections d'upload indépendantes
// ============================================================

import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import {
  HiUpload, HiTrash, HiCheckCircle, HiPhotograph, HiRefresh, HiUsers
} from 'react-icons/hi'
import AdminLayout     from '../layout/AdminLayout'
import adminApi        from '../services/adminApi'
import useFetch        from '../../hooks/useFetch'
import { useSiteSettings } from '../../context/SiteSettingsContext'

// ---- Composant générique de zone upload réutilisable ----
const ZoneUpload = ({
  titre, description, conseil,
  imageActuelle, labelBoutonSauvegarder,
  endpoint, endpointDelete, fieldName,
  onSuccess,
  accept = 'image/png,image/jpeg,image/jpg,image/webp',
}) => {
  const [fichier, setFichier]     = useState(null)
  const [apercu, setApercu]       = useState(null)
  const [uploading, setUploading] = useState(false)
  const [deleting, setDeleting]   = useState(false)
  const [message, setMessage]     = useState(null)
  const inputRef = useRef(null)

  const handleFichier = (e) => {
    const f = e.target.files[0]
    if (!f) return
    setFichier(f); setApercu(URL.createObjectURL(f)); setMessage(null)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    const f = e.dataTransfer.files[0]
    if (!f || !f.type.startsWith('image/')) return
    setFichier(f); setApercu(URL.createObjectURL(f)); setMessage(null)
  }

  const handleUpload = async () => {
    if (!fichier) return
    setUploading(true); setMessage(null)
    try {
      const fd = new FormData()
      fd.append(fieldName, fichier)
      await adminApi.post(endpoint, fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      setMessage({ type: 'success', texte: `${titre} mis(e) à jour avec succès !` })
      setFichier(null); setApercu(null)
      onSuccess()
    } catch (err) {
      setMessage({ type: 'error', texte: err.response?.data?.message || 'Erreur lors de l\'upload.' })
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm(`Supprimer ${titre.toLowerCase()} ?`)) return
    setDeleting(true)
    try {
      await adminApi.delete(endpointDelete)
      setMessage({ type: 'success', texte: 'Supprimé. Le contenu par défaut est restauré.' })
      setFichier(null); setApercu(null)
      onSuccess()
    } catch {
      setMessage({ type: 'error', texte: 'Erreur lors de la suppression.' })
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-card p-6 space-y-5">
      <h3 className="font-bold font-heading text-secondary flex items-center gap-2">
        <HiPhotograph className="text-primary" size={20} />
        {titre}
      </h3>
      <p className="text-gray-500 text-sm">{description}</p>

      {/* Image actuelle */}
      {imageActuelle && (
        <div className="flex items-center gap-5 p-4 bg-gray-50 rounded-xl">
          <div className="w-32 h-20 rounded-xl overflow-hidden bg-white border border-gray-100 shrink-0">
            <img src={imageActuelle} alt="actuel" className="w-full h-full object-cover" />
          </div>
          <div>
            <p className="font-semibold text-secondary text-sm">Image actuelle</p>
            <p className="text-gray-400 text-xs mt-0.5">Visible sur le site</p>
            <button
              onClick={handleDelete} disabled={deleting}
              className="mt-2 flex items-center gap-1.5 text-red-500 hover:text-red-700 text-xs
                         font-medium border border-red-200 hover:border-red-400 px-3 py-1.5 rounded-lg transition-colors"
            >
              {deleting
                ? <div className="w-3 h-3 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                : <HiTrash size={13} />
              }
              Supprimer
            </button>
          </div>
        </div>
      )}

      {/* Zone drag & drop */}
      <div
        onDrop={handleDrop}
        onDragOver={e => e.preventDefault()}
        onClick={() => inputRef.current?.click()}
        className={`relative rounded-xl overflow-hidden cursor-pointer border-2 border-dashed transition-all duration-200
          ${apercu ? 'border-primary' : 'border-gray-200 hover:border-primary'}`}
      >
        <input ref={inputRef} type="file" accept={accept} onChange={handleFichier} className="hidden" />

        {apercu ? (
          <div className="relative aspect-video">
            <img src={apercu} alt="aperçu" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/0 hover:bg-black/30 transition-colors
                            flex items-center justify-center">
              <span className="opacity-0 hover:opacity-100 transition-opacity bg-white/90 rounded-xl
                               px-4 py-2 text-sm font-medium text-secondary flex items-center gap-2">
                <HiUpload size={16} /> Changer l'image
              </span>
            </div>
          </div>
        ) : (
          <div className="aspect-video flex flex-col items-center justify-center gap-3 text-gray-400">
            <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center">
              <HiUpload size={28} />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-secondary">Glissez une image ici</p>
              <p className="text-xs mt-0.5">ou <span className="text-primary underline">cliquez pour choisir</span></p>
            </div>
            <p className="text-xs text-gray-300">{conseil}</p>
          </div>
        )}
      </div>

      {/* Retirer la sélection */}
      {apercu && (
        <button
          onClick={() => { setApercu(null); setFichier(null) }}
          className="text-xs text-red-500 hover:underline flex items-center gap-1"
        >
          <HiTrash size={12} /> Retirer la sélection
        </button>
      )}

      {/* Message résultat */}
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm ${
            message.type === 'success'
              ? 'bg-green-50 border border-green-200 text-green-700'
              : 'bg-red-50 border border-red-200 text-red-600'
          }`}
        >
          {message.type === 'success' ? <HiCheckCircle size={18} /> : '⚠'}
          {message.texte}
        </motion.div>
      )}

      {/* Bouton upload */}
      {fichier && (
        <button
          onClick={handleUpload} disabled={uploading}
          className="btn-primary w-full flex items-center justify-center gap-2 py-3"
        >
          {uploading
            ? <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> Upload en cours...</>
            : <><HiUpload size={18} /> {labelBoutonSauvegarder}</>
          }
        </button>
      )}
    </div>
  )
}

// ============================================================
// Page principale AdminSettings
// ============================================================
const AdminSettings = () => {
  const { rafraichir, logoUrl, teamImageUrl } = useSiteSettings()
  const { data, refetch } = useFetch(() => adminApi.get('/admin/settings'))

  const handleSuccess = () => { refetch(); rafraichir() }

  return (
    <AdminLayout>
      <div className="max-w-2xl space-y-6">

        {/* En-tête */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold font-heading text-secondary">Images du site</h2>
            <p className="text-gray-500 text-sm mt-1">Logo et photo de l'équipe</p>
          </div>
          <button
            onClick={handleSuccess}
            className="p-2.5 text-gray-400 hover:text-secondary hover:bg-gray-100 rounded-xl transition-colors"
            title="Recharger"
          >
            <HiRefresh size={18} />
          </button>
        </div>

        {/* ---- Section 1 : Logo du site ---- */}
        <ZoneUpload
          titre="Logo du site"
          description="Affiché dans la barre de navigation et le pied de page sur toutes les pages."
          conseil="PNG ou SVG fond transparent recommandé — max 2 Mo"
          imageActuelle={logoUrl}
          labelBoutonSauvegarder="Appliquer ce logo au site"
          endpoint="/admin/settings/logo"
          endpointDelete="/admin/settings/logo"
          fieldName="logo"
          onSuccess={handleSuccess}
          accept="image/png,image/jpeg,image/jpg,image/svg+xml,image/webp"
        />

        {/* ---- Section 2 : Photo de l'équipe ---- */}
        <ZoneUpload
          titre="Photo de l'équipe fondatrice"
          description="Affichée dans la page À propos, à côté de la présentation de l'entreprise."
          conseil="JPG ou PNG — dimensions recommandées 800×500 px — max 5 Mo"
          imageActuelle={teamImageUrl}
          labelBoutonSauvegarder="Mettre cette photo sur la page À propos"
          endpoint="/admin/settings/team-image"
          endpointDelete="/admin/settings/team-image"
          fieldName="image"
          onSuccess={handleSuccess}
        />

        {/* Aperçu dans le contexte de la page À propos */}
        {teamImageUrl && (
          <div className="bg-white rounded-2xl shadow-card p-6">
            <h3 className="font-bold font-heading text-secondary mb-4 flex items-center gap-2">
              <HiUsers className="text-primary" size={20} />
              Aperçu — Page À propos
            </h3>
            <div className="relative rounded-xl overflow-hidden aspect-video shadow-md">
              <img
                src={teamImageUrl}
                alt="Équipe Hindo Digital"
                className="w-full h-full object-cover"
              />
              {/* Badges flottants simulés */}
              <div className="absolute bottom-3 left-3 bg-white rounded-lg shadow px-3 py-2 text-center">
                <div className="text-lg font-bold text-primary font-heading">5+</div>
                <div className="text-xs text-gray-500">Ans d'expérience</div>
              </div>
              <div className="absolute top-3 right-3 bg-primary rounded-lg shadow px-3 py-2 text-center">
                <div className="text-lg font-bold text-white font-heading">80+</div>
                <div className="text-xs text-white/80">Projets réalisés</div>
              </div>
              <div className="absolute bottom-3 right-1/2 translate-x-1/2 bg-black/50 backdrop-blur-sm
                              text-white px-3 py-1.5 rounded-lg text-xs font-medium">
                Équipe Hindo Digital — Ziguinchor
              </div>
            </div>
          </div>
        )}

      </div>
    </AdminLayout>
  )
}

export default AdminSettings
