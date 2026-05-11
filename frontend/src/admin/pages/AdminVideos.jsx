// ============================================================
// admin/pages/AdminVideos.jsx — Gestion des vidéos de réalisations
// YouTube, Vimeo, URL distante ET upload de fichiers depuis l'ordinateur
// ============================================================

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  HiPlus, HiPencil, HiTrash, HiX, HiCheck,
  HiPlay, HiEye, HiEyeOff, HiUpload, HiFilm, HiLink
} from 'react-icons/hi'
import { FaYoutube, FaVimeo } from 'react-icons/fa'
import AdminLayout from '../layout/AdminLayout'
import adminApi   from '../services/adminApi'
import useFetch   from '../../hooks/useFetch'

const CATEGORIES = ['Réseaux', 'Vidéosurveillance', 'Web & Mobile', 'Formation', 'Infographie', 'Autre']

const VIDE = {
  titre: '', description: '', url_video: '', type: 'youtube',
  categorie: '', actif: true, ordre: 0,
}

// Icône selon le type
const IconeType = ({ type }) => {
  if (type === 'youtube') return <FaYoutube className="text-red-500"  size={18} />
  if (type === 'vimeo')   return <FaVimeo   className="text-blue-500" size={18} />
  return <HiFilm className="text-gray-500" size={18} />
}

const AdminVideos = () => {
  const { data: videos, loading, refetch } = useFetch(() => adminApi.get('/admin/videos'))
  const [modal, setModal]       = useState(null)
  const [form, setForm]         = useState(VIDE)
  const [saving, setSaving]     = useState(false)
  const [erreur, setErreur]     = useState('')
  const [previewUrl, setPreviewUrl]   = useState(null)    // miniature YouTube auto
  const [videoFichier, setVideoFichier] = useState(null)  // fichier vidéo sélectionné
  const [videoPreview, setVideoPreview] = useState(null)  // URL locale preview du fichier
  // Mode pour le type "fichier" : 'url' | 'upload'
  const [modeFichier, setModeFichier]   = useState('upload')
  const videoInputRef = useRef(null)

  const ouvrirCreation = () => {
    setForm(VIDE); setErreur(''); setPreviewUrl(null)
    setVideoFichier(null); setVideoPreview(null); setModeFichier('upload')
    setModal('create')
  }

  const ouvrirEdition = (v) => {
    setForm({
      titre: v.titre, description: v.description || '', url_video: v.url_video || '',
      type: v.type, categorie: v.categorie || '', actif: v.actif, ordre: v.ordre,
    })
    setPreviewUrl(v.thumbnail_url || null)
    setVideoFichier(null)
    // Si c'est un fichier local existant, on montre l'URL
    setVideoPreview(v.est_fichier_local ? v.url_lecture : null)
    setModeFichier(v.est_fichier_local ? 'upload' : 'url')
    setErreur('')
    setModal(v)
  }

  // Génère l'aperçu miniature YouTube automatiquement à la frappe
  const handleUrlChange = (url) => {
    setForm(prev => ({ ...prev, url_video: url }))
    const ytMatch = url.match(/(?:youtu\.be\/|[?&]v=|embed\/|shorts\/)([a-zA-Z0-9_-]{11})/)
    setPreviewUrl(ytMatch ? `https://img.youtube.com/vi/${ytMatch[1]}/mqdefault.jpg` : null)
  }

  // Sélection d'un fichier vidéo depuis l'ordinateur
  const handleVideoFichier = (e) => {
    const f = e.target.files[0]
    if (!f) return
    setVideoFichier(f)
    setVideoPreview(URL.createObjectURL(f))
    setForm(prev => ({ ...prev, url_video: '' })) // vide l'URL distante
  }

  const handleDrop = (e) => {
    e.preventDefault()
    const f = e.dataTransfer.files[0]
    if (!f || !f.type.startsWith('video/')) return
    setVideoFichier(f)
    setVideoPreview(URL.createObjectURL(f))
  }

  const sauvegarder = async (e) => {
    e.preventDefault()
    setSaving(true); setErreur('')
    try {
      const fd = new FormData()
      fd.append('titre',       form.titre)
      fd.append('description', form.description)
      fd.append('type',        form.type)
      fd.append('categorie',   form.categorie)
      fd.append('actif',       form.actif ? '1' : '0')
      fd.append('ordre',       form.ordre || 0)

      if (form.type === 'fichier') {
        if (videoFichier) {
          // Fichier uploadé depuis l'ordinateur
          fd.append('video_file', videoFichier)
        } else if (form.url_video) {
          // URL distante directe
          fd.append('url_video', form.url_video)
        }
      } else {
        fd.append('url_video', form.url_video)
      }

      const endpoint = modal === 'create'
        ? '/admin/videos'
        : `/admin/videos/${modal.id}`

      await adminApi.post(endpoint, fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      refetch(); setModal(null)
    } catch (err) {
      setErreur(err.response?.data?.message || 'Erreur lors de l\'enregistrement.')
    } finally {
      setSaving(false)
    }
  }

  const toggleActif = async (video) => {
    const fd = new FormData()
    fd.append('titre',     video.titre)
    fd.append('url_video', video.url_video || '')
    fd.append('type',      video.type)
    fd.append('actif',     video.actif ? '0' : '1')
    fd.append('ordre',     video.ordre)
    await adminApi.post(`/admin/videos/${video.id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } })
    refetch()
  }

  const supprimer = async (id) => {
    if (!confirm('Supprimer cette vidéo ?')) return
    await adminApi.delete(`/admin/videos/${id}`)
    refetch()
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* En-tête */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold font-heading text-secondary">Vidéos</h2>
            <p className="text-gray-500 text-sm mt-1">
              {(videos || []).length} vidéo(s) — YouTube · Vimeo · URL · Fichier local
            </p>
          </div>
          <button onClick={ouvrirCreation} className="btn-primary flex items-center gap-2">
            <HiPlus size={18} /> Ajouter une vidéo
          </button>
        </div>

        {/* Grille des vidéos */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1,2,3].map(i => <div key={i} className="h-52 bg-white rounded-2xl animate-pulse" />)}
          </div>
        ) : (videos || []).length === 0 ? (
          <div className="bg-white rounded-2xl shadow-card p-16 text-center text-gray-400">
            <HiFilm size={48} className="mx-auto mb-3 text-gray-200" />
            <p className="font-medium">Aucune vidéo ajoutée</p>
            <p className="text-sm mt-1">Cliquez sur "Ajouter une vidéo" pour commencer</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {(videos || []).map((v) => (
              <motion.div key={v.id} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}}
                className={`bg-white rounded-2xl shadow-card overflow-hidden ${!v.actif ? 'opacity-60' : ''}`}>
                {/* Miniature */}
                <div className="relative aspect-video bg-gray-900 overflow-hidden">
                  {v.thumbnail_url ? (
                    <img src={v.thumbnail_url} alt={v.titre}
                      className="w-full h-full object-cover"
                      onError={e => { e.target.style.display='none' }} />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-secondary/60">
                      <IconeType type={v.type} />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/35 flex items-center justify-center">
                    <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
                      <HiPlay className="text-primary ml-0.5" size={22} />
                    </div>
                  </div>
                  <div className="absolute top-2 left-2 flex items-center gap-1 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
                    <IconeType type={v.type} />
                    {v.est_fichier_local ? 'Fichier local' : v.type}
                  </div>
                </div>
                {/* Infos */}
                <div className="p-4">
                  {v.categorie && (
                    <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                      {v.categorie}
                    </span>
                  )}
                  <p className="font-bold text-secondary text-sm mt-2 mb-1 line-clamp-1">{v.titre}</p>
                  {v.description && <p className="text-gray-400 text-xs line-clamp-2">{v.description}</p>}
                  <div className="flex gap-2 mt-3">
                    <button onClick={() => toggleActif(v)}
                      className={`flex items-center gap-1 py-1.5 px-3 rounded-xl text-xs font-medium transition-colors ${
                        v.actif ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {v.actif ? <><HiEye size={13}/> Visible</> : <><HiEyeOff size={13}/> Masqué</>}
                    </button>
                    <button onClick={() => ouvrirEdition(v)}
                      className="flex items-center gap-1 py-1.5 px-3 rounded-xl text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors">
                      <HiPencil size={13} /> Modifier
                    </button>
                    <button onClick={() => supprimer(v.id)}
                      className="py-1.5 px-3 rounded-xl text-xs font-medium text-red-500 bg-red-50 hover:bg-red-100 transition-colors">
                      <HiTrash size={13} />
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
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
            onClick={() => setModal(null)}>
            <motion.div initial={{scale:0.92,opacity:0}} animate={{scale:1,opacity:1}} exit={{scale:0.92,opacity:0}}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}>

              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b sticky top-0 bg-white z-10">
                <h3 className="font-bold font-heading text-secondary">
                  {modal === 'create' ? 'Nouvelle vidéo' : 'Modifier la vidéo'}
                </h3>
                <button onClick={() => setModal(null)} className="p-1.5 hover:bg-gray-100 rounded-lg"><HiX size={18}/></button>
              </div>

              <form onSubmit={sauvegarder} className="p-6 space-y-5">
                {erreur && <p className="text-red-500 text-sm bg-red-50 px-4 py-2.5 rounded-xl">{erreur}</p>}

                {/* ---- Sélection du type de source ---- */}
                <div>
                  <label className="text-sm font-medium text-secondary block mb-2">Source de la vidéo *</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { val: 'youtube', label: 'YouTube',    icon: <FaYoutube className="text-red-500"  size={22} /> },
                      { val: 'vimeo',   label: 'Vimeo',      icon: <FaVimeo   className="text-blue-500" size={22} /> },
                      { val: 'fichier', label: 'Mon fichier', icon: <HiFilm    className="text-primary"  size={22} /> },
                    ].map(({ val, label, icon }) => (
                      <button key={val} type="button"
                        onClick={() => { setForm(prev => ({...prev, type: val, url_video: ''})); setPreviewUrl(null); setVideoFichier(null); setVideoPreview(null) }}
                        className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${
                          form.type === val ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-gray-300'}`}>
                        {icon}
                        <span className="text-xs font-semibold text-secondary">{label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* ---- Zone de saisie selon le type ---- */}

                {/* YouTube */}
                {form.type === 'youtube' && (
                  <div>
                    <label className="text-sm font-medium text-secondary block mb-1.5 flex items-center gap-2">
                      <FaYoutube className="text-red-500" size={16} /> URL YouTube *
                    </label>
                    <input type="url" value={form.url_video} onChange={e => handleUrlChange(e.target.value)}
                      placeholder="https://www.youtube.com/watch?v=..."
                      required
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-primary text-sm" />
                    {/* Aperçu miniature automatique */}
                    {previewUrl && (
                      <div className="mt-2 rounded-xl overflow-hidden aspect-video relative bg-black">
                        <img src={previewUrl} alt="aperçu" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                          <div className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center">
                            <HiPlay className="text-primary ml-0.5" size={18} />
                          </div>
                        </div>
                        <span className="absolute bottom-2 left-2 text-white text-xs bg-black/50 px-2 py-0.5 rounded">Aperçu automatique</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Vimeo */}
                {form.type === 'vimeo' && (
                  <div>
                    <label className="text-sm font-medium text-secondary block mb-1.5 flex items-center gap-2">
                      <FaVimeo className="text-blue-500" size={16} /> URL Vimeo *
                    </label>
                    <input type="url" value={form.url_video} onChange={e => setForm({...form, url_video: e.target.value})}
                      placeholder="https://vimeo.com/..."
                      required
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-primary text-sm" />
                  </div>
                )}

                {/* Fichier — avec choix URL ou upload */}
                {form.type === 'fichier' && (
                  <div className="space-y-3">
                    {/* Onglets URL / Fichier local */}
                    <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
                      <button type="button"
                        onClick={() => { setModeFichier('upload'); setForm(prev => ({...prev, url_video: ''})) }}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all ${
                          modeFichier === 'upload' ? 'bg-white text-secondary shadow-sm' : 'text-gray-500'}`}>
                        <HiUpload size={15} /> Fichier de mon PC
                      </button>
                      <button type="button"
                        onClick={() => { setModeFichier('url'); setVideoFichier(null); setVideoPreview(null) }}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all ${
                          modeFichier === 'url' ? 'bg-white text-secondary shadow-sm' : 'text-gray-500'}`}>
                        <HiLink size={15} /> URL distante
                      </button>
                    </div>

                    {/* Mode Upload */}
                    {modeFichier === 'upload' && (
                      <div>
                        <div
                          onDrop={handleDrop}
                          onDragOver={e => e.preventDefault()}
                          onClick={() => videoInputRef.current?.click()}
                          className={`border-2 border-dashed rounded-xl cursor-pointer transition-colors ${
                            videoPreview ? 'border-primary' : 'border-gray-200 hover:border-primary'}`}
                        >
                          <input
                            ref={videoInputRef}
                            type="file"
                            accept="video/mp4,video/webm,video/avi,video/quicktime,video/x-matroska,video/x-m4v"
                            onChange={handleVideoFichier}
                            className="hidden"
                          />
                          {videoPreview ? (
                            /* Lecteur vidéo preview */
                            <div className="relative aspect-video rounded-xl overflow-hidden bg-black">
                              <video src={videoPreview} controls className="w-full h-full" />
                              <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                                ✓ Prêt à uploader
                              </div>
                            </div>
                          ) : (
                            <div className="aspect-video flex flex-col items-center justify-center gap-3 text-gray-400">
                              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center">
                                <HiFilm className="text-primary" size={32} />
                              </div>
                              <div className="text-center">
                                <p className="text-sm font-semibold text-secondary">Glissez votre vidéo ici</p>
                                <p className="text-xs mt-1">ou <span className="text-primary underline">cliquez pour choisir</span></p>
                              </div>
                              <p className="text-xs text-gray-300">MP4, WebM, AVI, MOV, MKV — max 500 Mo</p>
                            </div>
                          )}
                        </div>
                        {videoFichier && (
                          <div className="mt-2 flex items-center justify-between text-xs text-gray-500 bg-gray-50 px-3 py-2 rounded-lg">
                            <span className="truncate">{videoFichier.name}</span>
                            <span className="shrink-0 ml-2 font-medium">{(videoFichier.size / 1024 / 1024).toFixed(1)} Mo</span>
                          </div>
                        )}
                        {modal !== 'create' && !videoFichier && videoPreview && (
                          <p className="text-xs text-gray-400 mt-1">Fichier actuel conservé — sélectionnez-en un nouveau pour le remplacer.</p>
                        )}
                      </div>
                    )}

                    {/* Mode URL distante */}
                    {modeFichier === 'url' && (
                      <div>
                        <label className="text-sm font-medium text-secondary block mb-1.5">URL directe du fichier vidéo *</label>
                        <input type="url" value={form.url_video}
                          onChange={e => setForm({...form, url_video: e.target.value})}
                          placeholder="https://exemple.com/video.mp4"
                          className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-primary text-sm" />
                      </div>
                    )}
                  </div>
                )}

                {/* ---- Informations de la vidéo ---- */}
                <div>
                  <label className="text-sm font-medium text-secondary block mb-1.5">Titre du projet *</label>
                  <input type="text" value={form.titre}
                    onChange={e => setForm({...form, titre: e.target.value})}
                    placeholder="Ex: Installation réseau PME Ziguinchor"
                    required
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-primary text-sm" />
                </div>

                <div>
                  <label className="text-sm font-medium text-secondary block mb-1.5">Description</label>
                  <textarea rows={2} value={form.description}
                    onChange={e => setForm({...form, description: e.target.value})}
                    placeholder="Courte description du projet..."
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-primary text-sm resize-none" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-secondary block mb-1.5">Catégorie</label>
                    <select value={form.categorie} onChange={e => setForm({...form, categorie: e.target.value})}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-primary text-sm">
                      <option value="">-- Aucune --</option>
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-secondary block mb-1.5">Ordre</label>
                    <input type="number" value={form.ordre} min={0}
                      onChange={e => setForm({...form, ordre: e.target.value})}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-primary text-sm" />
                  </div>
                </div>

                <label className="flex items-center gap-3 cursor-pointer p-3 bg-gray-50 rounded-xl">
                  <input type="checkbox" checked={form.actif}
                    onChange={e => setForm({...form, actif: e.target.checked})}
                    className="w-4 h-4 accent-primary" />
                  <span className="text-sm text-secondary font-medium">Visible sur la page Réalisations</span>
                </label>

                {/* Boutons */}
                <div className="flex gap-3 pt-1">
                  <button type="submit" disabled={saving}
                    className="btn-primary flex items-center gap-2 flex-1 justify-center py-3">
                    {saving
                      ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/> Enregistrement...</>
                      : <><HiCheck size={16}/> Enregistrer</>
                    }
                  </button>
                  <button type="button" onClick={() => setModal(null)} className="btn-outline px-6">Annuler</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AdminLayout>
  )
}

export default AdminVideos
