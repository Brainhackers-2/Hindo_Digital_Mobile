// ============================================================
// services/videosApi.js — Vidéos publiques depuis Supabase
// ============================================================

import { supabase } from '../lib/supabase'

const publicUrl = (path) =>
  path ? supabase.storage.from('hindo-media').getPublicUrl(path).data.publicUrl : null

function enrichirVideo(v) {
  let embed_url = null
  let url_lecture = v.url_video

  if (v.type === 'youtube') {
    const m = (v.url_video || '').match(/(?:youtu\.be\/|[?&]v=|embed\/|shorts\/)([a-zA-Z0-9_-]{11})/)
    const ytId = m?.[1]
    embed_url   = ytId ? `https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0` : null
    url_lecture = embed_url
    if (ytId && !v.thumbnail_path) v.thumbnail_url = `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg`
  } else if (v.type === 'vimeo') {
    const m = (v.url_video || '').match(/vimeo\.com\/(\d+)/)
    embed_url   = m ? `https://player.vimeo.com/video/${m[1]}?autoplay=1` : null
    url_lecture = embed_url
  }

  if (v.video_file_path) url_lecture = publicUrl(v.video_file_path)
  if (v.thumbnail_path)  v.thumbnail_url = publicUrl(v.thumbnail_path)

  return { ...v, embed_url, url_lecture, est_fichier_local: !!v.video_file_path }
}

// Vidéos de la page Réalisations
export const getVideos = async () => {
  const { data } = await supabase
    .from('videos')
    .select('*')
    .eq('actif', true)
    .in('source', ['realisations', null])
    .order('ordre', { ascending: true })
    .order('created_at', { ascending: false })
  return { data: { data: (data || []).map(enrichirVideo) } }
}

// Vidéos de la page Galerie
export const getVideosGalerie = async () => {
  const { data } = await supabase
    .from('videos')
    .select('*')
    .eq('actif', true)
    .eq('source', 'galerie')
    .order('ordre', { ascending: true })
    .order('created_at', { ascending: false })
  return { data: { data: (data || []).map(enrichirVideo) } }
}
