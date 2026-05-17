import { supabase } from '../lib/supabase'

const publicUrl = (path) =>
  path ? supabase.storage.from('hindo-media').getPublicUrl(path).data.publicUrl : null

export const getGalerie = async () => {
  const result = await supabase
    .from('galerie')
    .select('*')
    .order('created_at', { ascending: false })
  const photos = (result.data || []).map(g => ({ ...g, image_url: publicUrl(g.image_path) }))
  return { data: photos }
}
