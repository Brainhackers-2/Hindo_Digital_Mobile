// ============================================================
// admin/services/adminApi.js — Toutes les opérations admin via Supabase
// Remplace complètement les appels Axios vers Laravel
// ============================================================

import { supabase } from '../../lib/supabase'

// ---- Helpers génériques ----

const publicUrl = (path) =>
  path ? supabase.storage.from('hindo-media').getPublicUrl(path).data.publicUrl : null

const uploadFile = async (bucket, folder, file) => {
  const ext  = file.name.split('.').pop()
  const path = `${folder}/${Date.now()}.${ext}`
  const { error } = await supabase.storage.from(bucket).upload(path, file, { upsert: true })
  if (error) throw error
  return path
}

const deleteFile = async (path) => {
  if (!path) return
  await supabase.storage.from('hindo-media').remove([path])
}

// ============================================================
// Compatible avec useFetch — retourne { data: { data: [...] } }
// ============================================================
const wrap = (data) => ({ data: { data } })

// ---- DASHBOARD ----
export const getDashboard = async () => {
  const [contacts, services, realisations, formations, inscriptions, newsletters, temoignages] =
    await Promise.all([
      supabase.from('contacts').select('id, lu', { count: 'exact' }),
      supabase.from('services').select('id', { count: 'exact' }),
      supabase.from('realisations').select('id', { count: 'exact' }),
      supabase.from('formations').select('id', { count: 'exact' }),
      supabase.from('inscriptions').select('id', { count: 'exact' }),
      supabase.from('newsletters').select('id', { count: 'exact' }).eq('actif', true),
      supabase.from('temoignages').select('id', { count: 'exact' }),
    ])

  const nonLus = (contacts.data || []).filter(c => !c.lu).length

  const derniers_contacts = await supabase
    .from('contacts').select('id,nom,email,sujet,created_at')
    .eq('lu', false).order('created_at', { ascending: false }).limit(5)

  const dernieres_inscriptions = await supabase
    .from('inscriptions').select('id,nom,email,formation_id,created_at, formations(titre)')
    .order('created_at', { ascending: false }).limit(5)

  return wrap({
    stats: {
      contacts:     { total: contacts.count, non_lus: nonLus },
      services:     services.count,
      realisations: realisations.count,
      formations:   formations.count,
      inscriptions: inscriptions.count,
      newsletters:  newsletters.count,
      temoignages:  temoignages.count,
    },
    derniers_contacts:      derniers_contacts.data || [],
    dernieres_inscriptions: (dernieres_inscriptions.data || []).map(i => ({
      ...i, formation: i.formations,
    })),
  })
}

// ---- CONTACTS ----
export const getContacts = async () => {
  const { data } = await supabase.from('contacts')
    .select('*').order('lu').order('created_at', { ascending: false })
  return wrap(data || [])
}

export const marquerContactLu = async (id) => {
  await supabase.from('contacts').update({ lu: true }).eq('id', id)
}

export const supprimerContact = async (id) => {
  await supabase.from('contacts').delete().eq('id', id)
}

// ---- SERVICES ----
export const getServicesAdmin = async () => {
  const { data } = await supabase.from('services').select('*').order('ordre')
  return wrap((data || []).map(s => ({ ...s, image_url: publicUrl(s.image_path) })))
}

export const creerService = async (form, imageFichier) => {
  let image_path = null
  if (imageFichier) image_path = await uploadFile('hindo-media', 'services', imageFichier)
  const { data, error } = await supabase.from('services')
    .insert([{ titre: form.titre, description: form.description, icone: form.icone, ordre: form.ordre || 1, image_path }])
    .select().single()
  if (error) throw error
  return { ...data, image_url: publicUrl(data.image_path) }
}

export const modifierService = async (id, form, imageFichier, ancienImagePath) => {
  let image_path = ancienImagePath
  if (imageFichier) {
    await deleteFile(ancienImagePath)
    image_path = await uploadFile('hindo-media', 'services', imageFichier)
  }
  const { data, error } = await supabase.from('services')
    .update({ titre: form.titre, description: form.description, icone: form.icone, ordre: form.ordre || 1, image_path })
    .eq('id', id).select().single()
  if (error) throw error
  return { ...data, image_url: publicUrl(data.image_path) }
}

export const supprimerServiceImage = async (id, imagePath) => {
  await deleteFile(imagePath)
  await supabase.from('services').update({ image_path: null }).eq('id', id)
}

export const supprimerService = async (id, imagePath) => {
  await deleteFile(imagePath)
  await supabase.from('services').delete().eq('id', id)
}

// ---- RÉALISATIONS ----
export const getRealisationsAdmin = async () => {
  const { data } = await supabase.from('realisations').select('*').order('created_at', { ascending: false })
  return wrap((data || []).map(r => ({ ...r, image_url: publicUrl(r.image_path) })))
}

export const creerRealisation = async (form, imageFichier) => {
  let image_path = null
  if (imageFichier) image_path = await uploadFile('hindo-media', 'realisations', imageFichier)
  const { data, error } = await supabase.from('realisations')
    .insert([{ titre: form.titre, categorie: form.categorie, description: form.description, image_path }])
    .select().single()
  if (error) throw error
  return { ...data, image_url: publicUrl(data.image_path) }
}

export const modifierRealisation = async (id, form, imageFichier, ancienImagePath) => {
  let image_path = ancienImagePath
  if (imageFichier) {
    await deleteFile(ancienImagePath)
    image_path = await uploadFile('hindo-media', 'realisations', imageFichier)
  }
  const { data, error } = await supabase.from('realisations')
    .update({ titre: form.titre, categorie: form.categorie, description: form.description, image_path })
    .eq('id', id).select().single()
  if (error) throw error
  return { ...data, image_url: publicUrl(data.image_path) }
}

export const supprimerRealisation = async (id, imagePath) => {
  await deleteFile(imagePath)
  await supabase.from('realisations').delete().eq('id', id)
}

// ---- FORMATIONS ----
export const getFormationsAdmin = async () => {
  const { data } = await supabase.from('formations')
    .select('*, inscriptions(count)').order('titre')
  return wrap((data || []).map(f => ({ ...f, inscriptions_count: f.inscriptions?.[0]?.count ?? 0 })))
}

export const creerFormation = async (form) => {
  const { data, error } = await supabase.from('formations')
    .insert([{ titre: form.titre, description: form.description, duree: form.duree, niveau: form.niveau, prix: form.prix || null }])
    .select().single()
  if (error) throw error
  return data
}

export const modifierFormation = async (id, form) => {
  const { data, error } = await supabase.from('formations')
    .update({ titre: form.titre, description: form.description, duree: form.duree, niveau: form.niveau, prix: form.prix || null })
    .eq('id', id).select().single()
  if (error) throw error
  return data
}

export const supprimerFormation = async (id) => {
  await supabase.from('inscriptions').delete().eq('formation_id', id)
  await supabase.from('formations').delete().eq('id', id)
}

// ---- INSCRIPTIONS ----
export const getInscriptions = async () => {
  const { data } = await supabase.from('inscriptions')
    .select('*, formations(titre)').order('created_at', { ascending: false })
  return wrap((data || []).map(i => ({ ...i, formation: i.formations })))
}

export const supprimerInscription = async (id) => {
  await supabase.from('inscriptions').delete().eq('id', id)
}

// ---- TÉMOIGNAGES ----
export const getTemoignagesAdmin = async () => {
  const { data } = await supabase.from('temoignages').select('*').order('created_at', { ascending: false })
  return wrap(data || [])
}

export const creerTemoignage = async (form) => {
  const { data, error } = await supabase.from('temoignages')
    .insert([{ nom: form.nom, poste: form.poste || null, texte: form.texte, note: form.note, actif: form.actif }])
    .select().single()
  if (error) throw error
  return data
}

export const modifierTemoignage = async (id, form) => {
  const { data, error } = await supabase.from('temoignages')
    .update({ nom: form.nom, poste: form.poste || null, texte: form.texte, note: form.note, actif: form.actif })
    .eq('id', id).select().single()
  if (error) throw error
  return data
}

export const supprimerTemoignage = async (id) => {
  await supabase.from('temoignages').delete().eq('id', id)
}

// ---- NEWSLETTER ----
export const getNewsletter = async () => {
  const { data } = await supabase.from('newsletters').select('*').order('created_at', { ascending: false })
  return wrap(data || [])
}

// ---- VIDÉOS ----
export const getVideosAdmin = async () => {
  const { data } = await supabase.from('videos').select('*').order('ordre').order('created_at', { ascending: false })
  return wrap((data || []).map(v => enrichirVideo(v)))
}

export const creerVideo = async (form, videoFichier) => {
  let video_file_path = null, url_video = form.url_video
  if (videoFichier) {
    video_file_path = await uploadFile('hindo-media', 'videos/fichiers', videoFichier)
    url_video = publicUrl(video_file_path)
  }
  const { data, error } = await supabase.from('videos')
    .insert([{ titre: form.titre, description: form.description, url_video, video_file_path, type: form.type, categorie: form.categorie || null, actif: form.actif, ordre: form.ordre || 0 }])
    .select().single()
  if (error) throw error
  return enrichirVideo(data)
}

export const modifierVideo = async (id, form, videoFichier, ancienFilePath) => {
  let video_file_path = ancienFilePath, url_video = form.url_video
  if (videoFichier) {
    await deleteFile(ancienFilePath)
    video_file_path = await uploadFile('hindo-media', 'videos/fichiers', videoFichier)
    url_video = publicUrl(video_file_path)
  }
  const { data, error } = await supabase.from('videos')
    .update({ titre: form.titre, description: form.description, url_video, video_file_path, type: form.type, categorie: form.categorie || null, actif: form.actif, ordre: form.ordre || 0 })
    .eq('id', id).select().single()
  if (error) throw error
  return enrichirVideo(data)
}

export const supprimerVideo = async (id, videoFilePath) => {
  await deleteFile(videoFilePath)
  await supabase.from('videos').delete().eq('id', id)
}

export const toggleVideoActif = async (id, actifActuel) => {
  await supabase.from('videos').update({ actif: !actifActuel }).eq('id', id)
}

// ---- SETTINGS (Logo + Photo équipe) ----
export const getSettings = async () => {
  const { data } = await supabase.from('settings').select('key, value')
  const map = {}
  ;(data || []).forEach(row => { map[row.key] = row.value })
  return wrap({ logo_url: publicUrl(map.logo_path), team_image_url: publicUrl(map.team_image_path) })
}

export const uploadLogo = async (fichier) => {
  const { data: ancienData } = await supabase.from('settings').select('value').eq('key', 'logo_path').maybeSingle()
  await deleteFile(ancienData?.value)
  const path = await uploadFile('hindo-media', 'logos', fichier)
  await supabase.from('settings').upsert({ key: 'logo_path', value: path })
  return publicUrl(path)
}

export const deleteLogo = async () => {
  const { data } = await supabase.from('settings').select('value').eq('key', 'logo_path').maybeSingle()
  await deleteFile(data?.value)
  await supabase.from('settings').upsert({ key: 'logo_path', value: null })
}

export const uploadTeamImage = async (fichier) => {
  const { data: ancienData } = await supabase.from('settings').select('value').eq('key', 'team_image_path').maybeSingle()
  await deleteFile(ancienData?.value)
  const path = await uploadFile('hindo-media', 'team', fichier)
  await supabase.from('settings').upsert({ key: 'team_image_path', value: path })
  return publicUrl(path)
}

export const deleteTeamImage = async () => {
  const { data } = await supabase.from('settings').select('value').eq('key', 'team_image_path').maybeSingle()
  await deleteFile(data?.value)
  await supabase.from('settings').upsert({ key: 'team_image_path', value: null })
}

// ---- CONTENU CMS ----
export const getContenu = async () => {
  const { data } = await supabase.from('settings').select('key, value')
  const map = {}
  ;(data || []).forEach(row => { map[row.key] = row.value })
  return wrap(map)
}

export const sauvegarderContenu = async (contenu) => {
  // Vérifie que l'utilisateur est bien authentifié avant de sauvegarder
  const { data: session } = await supabase.auth.getSession()
  if (!session?.session) {
    throw new Error('Non authentifié — reconnectez-vous à l\'admin.')
  }

  // Ne sauvegarde que les clés qui ont une valeur (ignore les undefined)
  const rows = Object.entries(contenu)
    .filter(([, val]) => val !== undefined)
    .map(([key, value]) => ({ key, value: value === null ? null : String(value) }))

  const { error } = await supabase.from('settings').upsert(rows, { onConflict: 'key' })

  if (error) {
    console.error('[Supabase] Erreur sauvegarde settings:', error)
    throw new Error(`Erreur Supabase: ${error.message} (code: ${error.code})`)
  }
}

// ---- Helpers privés ----
function enrichirVideo(v) {
  let embed_url = null, url_lecture = v.url_video

  if (v.type === 'youtube') {
    const m = (v.url_video || '').match(/(?:youtu\.be\/|[?&]v=|embed\/|shorts\/)([a-zA-Z0-9_-]{11})/)
    const ytId = m?.[1]
    embed_url   = ytId ? `https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0` : null
    url_lecture = embed_url
    if (!v.thumbnail_path && ytId) v.thumbnail_url = `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg`
  } else if (v.type === 'vimeo') {
    const m = (v.url_video || '').match(/vimeo\.com\/(\d+)/)
    embed_url   = m ? `https://player.vimeo.com/video/${m[1]}?autoplay=1` : null
    url_lecture = embed_url
  }

  if (v.video_file_path) url_lecture = publicUrl(v.video_file_path)
  if (v.thumbnail_path)  v.thumbnail_url = publicUrl(v.thumbnail_path)

  return { ...v, embed_url, url_lecture, est_fichier_local: !!v.video_file_path }
}

// ============================================================
// Routeur de compatibilité — remplace les appels Axios vers Laravel
// Chaque adminApi.get/post/put/patch/delete appelle la bonne fonction Supabase
// ============================================================

// Convertit un FormData en objet JS simple (sans les fichiers File)
function fdToObj(data) {
  if (!(data instanceof FormData)) return data || {}
  const obj = {}
  for (const [key, value] of data.entries()) {
    if (!(value instanceof File)) obj[key] = value
  }
  return obj
}

const ok  = (data = null) => ({ data: { data, success: true } })
const err = (msg) => { throw new Error(msg) }

const adminApi = {
  get:    (path)        => routerGet(path),
  post:   (path, data)  => routerPost(path, data),
  put:    (path, data)  => routerPut(path, data),
  patch:  (path)        => routerPatch(path),
  delete: (path)        => routerDelete(path),
}

// ---- GET ----
async function routerGet(path) {
  if (path === '/admin/dashboard')    return getDashboard()
  if (path === '/admin/contacts')     return getContacts()
  if (path === '/admin/services')     return getServicesAdmin()
  if (path === '/admin/realisations') return getRealisationsAdmin()
  if (path === '/admin/formations')   return getFormationsAdmin()
  if (path === '/admin/inscriptions') return getInscriptions()
  if (path === '/admin/temoignages')  return getTemoignagesAdmin()
  if (path === '/admin/newsletters')  return getNewsletter()
  if (path === '/admin/videos')       return getVideosAdmin()
  if (path === '/admin/settings')     return getSettings()
  if (path === '/admin/contenu')      return getContenu()
  throw new Error(`[adminApi] Route GET inconnue: ${path}`)
}

// ---- POST ----
async function routerPost(path, data) {
  const form = fdToObj(data)

  // Contenu CMS
  if (path === '/admin/contenu') {
    try {
      await sauvegarderContenu(data?.contenu || data)
      return ok()
    } catch (e) { throw new Error(e.message) }
  }

  // Logo du site
  if (path === '/admin/settings/logo') {
    const file = data instanceof FormData ? data.get('logo') : null
    if (!file) err('Aucun fichier logo fourni')
    const url = await uploadLogo(file)
    return ok({ logo_url: url })
  }

  // Photo équipe
  if (path === '/admin/settings/team-image') {
    const file = data instanceof FormData ? data.get('image') : null
    if (!file) err('Aucun fichier image fourni')
    const url = await uploadTeamImage(file)
    return ok({ team_image_url: url })
  }

  // Création service
  if (path === '/admin/services') {
    const imageFile = data instanceof FormData ? data.get('image') : null
    const service = await creerService(form, imageFile instanceof File ? imageFile : null)
    return ok(service)
  }

  // Modification service : /admin/services/123
  const serviceM = path.match(/^\/admin\/services\/(\d+)$/)
  if (serviceM) {
    const imageFile = data instanceof FormData ? data.get('image') : null
    const { data: s } = await supabase.from('services').select('image_path').eq('id', serviceM[1]).maybeSingle()
    const service = await modifierService(serviceM[1], form, imageFile instanceof File ? imageFile : null, s?.image_path)
    return ok(service)
  }

  // Création réalisation
  if (path === '/admin/realisations') {
    const imageFile = data instanceof FormData ? data.get('image') : null
    const real = await creerRealisation(form, imageFile instanceof File ? imageFile : null)
    return ok(real)
  }

  // Modification réalisation : /admin/realisations/123
  const realM = path.match(/^\/admin\/realisations\/(\d+)$/)
  if (realM) {
    const imageFile = data instanceof FormData ? data.get('image') : null
    const { data: r } = await supabase.from('realisations').select('image_path').eq('id', realM[1]).maybeSingle()
    const real = await modifierRealisation(realM[1], form, imageFile instanceof File ? imageFile : null, r?.image_path)
    return ok(real)
  }

  // Création vidéo
  if (path === '/admin/videos') {
    const videoFile = data instanceof FormData ? data.get('video_file') : null
    const video = await creerVideo(form, videoFile instanceof File ? videoFile : null)
    return ok(video)
  }

  // Modification vidéo : /admin/videos/123
  const videoM = path.match(/^\/admin\/videos\/(\d+)$/)
  if (videoM) {
    const videoFile = data instanceof FormData ? data.get('video_file') : null
    const { data: v } = await supabase.from('videos').select('video_file_path').eq('id', videoM[1]).maybeSingle()
    const video = await modifierVideo(videoM[1], form, videoFile instanceof File ? videoFile : null, v?.video_file_path)
    return ok(video)
  }

  // Formations
  if (path === '/admin/formations') {
    const f = await creerFormation(form)
    return ok(f)
  }
  // Témoignages
  if (path === '/admin/temoignages') {
    const t = await creerTemoignage(form)
    return ok(t)
  }

  return ok()
}

// ---- PUT ----
async function routerPut(path, data) {
  const formationM = path.match(/^\/admin\/formations\/(\d+)$/)
  if (formationM) return ok(await modifierFormation(formationM[1], data))

  const temoignageM = path.match(/^\/admin\/temoignages\/(\d+)$/)
  if (temoignageM) return ok(await modifierTemoignage(temoignageM[1], data))

  const serviceM = path.match(/^\/admin\/services\/(\d+)$/)
  if (serviceM) {
    const { data: s } = await supabase.from('services').select('image_path').eq('id', serviceM[1]).maybeSingle()
    return ok(await modifierService(serviceM[1], data, null, s?.image_path))
  }

  return ok()
}

// ---- PATCH ----
async function routerPatch(path) {
  const contactM = path.match(/^\/admin\/contacts\/(\d+)\/lu$/)
  if (contactM) { await marquerContactLu(contactM[1]); return ok() }
  return ok()
}

// ---- DELETE ----
async function routerDelete(path) {
  // Logo et photo équipe
  if (path === '/admin/settings/logo')       { await deleteLogo();      return ok() }
  if (path === '/admin/settings/team-image') { await deleteTeamImage(); return ok() }

  // Image d'un service seul
  const svcImgM = path.match(/^\/admin\/services\/(\d+)\/image$/)
  if (svcImgM) {
    const { data: s } = await supabase.from('services').select('image_path').eq('id', svcImgM[1]).maybeSingle()
    await supprimerServiceImage(svcImgM[1], s?.image_path)
    return ok()
  }

  // Service complet
  const svcM = path.match(/^\/admin\/services\/(\d+)$/)
  if (svcM) {
    const { data: s } = await supabase.from('services').select('image_path').eq('id', svcM[1]).maybeSingle()
    await supprimerService(svcM[1], s?.image_path)
    return ok()
  }

  // Réalisation
  const realM = path.match(/^\/admin\/realisations\/(\d+)$/)
  if (realM) {
    const { data: r } = await supabase.from('realisations').select('image_path').eq('id', realM[1]).maybeSingle()
    await supprimerRealisation(realM[1], r?.image_path)
    return ok()
  }

  // Vidéo
  const videoM = path.match(/^\/admin\/videos\/(\d+)$/)
  if (videoM) {
    const { data: v } = await supabase.from('videos').select('video_file_path').eq('id', videoM[1]).maybeSingle()
    await supprimerVideo(videoM[1], v?.video_file_path)
    return ok()
  }

  // Formation
  const formM = path.match(/^\/admin\/formations\/(\d+)$/)
  if (formM) { await supprimerFormation(formM[1]); return ok() }

  // Témoignage
  const temoM = path.match(/^\/admin\/temoignages\/(\d+)$/)
  if (temoM) { await supprimerTemoignage(temoM[1]); return ok() }

  // Inscription
  const inscrM = path.match(/^\/admin\/inscriptions\/(\d+)$/)
  if (inscrM) { await supprimerInscription(inscrM[1]); return ok() }

  // Contact
  const contM = path.match(/^\/admin\/contacts\/(\d+)$/)
  if (contM) { await supprimerContact(contM[1]); return ok() }

  return ok()
}

export default adminApi
