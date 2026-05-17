import { supabase } from '../lib/supabase'

const publicUrl = (path) =>
  path ? supabase.storage.from('hindo-media').getPublicUrl(path).data.publicUrl : null

export const getGalerie = async () => {
  const { data, error } = await supabase
    .from('galerie')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return (data || []).map(g => ({ ...g, image_url: publicUrl(g.image_path) }))
}
