// api/admin-users.js — Gestion des utilisateurs admin via Service Role Key
// La service role key ne doit JAMAIS être exposée côté client

import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = () => createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (req.method === 'OPTIONS') return res.status(200).end()

  // Vérifie que l'appelant est authentifié et est super admin
  const token = req.headers.authorization?.replace('Bearer ', '')
  if (!token) return res.status(401).json({ error: 'Non authentifié' })

  const sb = supabaseAdmin()
  const { data: { user }, error: authErr } = await sb.auth.getUser(token)
  if (authErr || !user) return res.status(401).json({ error: 'Token invalide' })

  // Vérifie que c'est un super admin
  const { data: profil } = await sb.from('admin_profiles')
    .select('est_super_admin')
    .eq('id', user.id)
    .maybeSingle()

  if (!profil?.est_super_admin) {
    return res.status(403).json({ error: 'Réservé au super administrateur' })
  }

  // ── Créer un utilisateur ──
  if (req.method === 'POST') {
    const { email, password, nom, permissions, est_super_admin } = req.body || {}
    if (!email || !password || !nom) {
      return res.status(400).json({ error: 'Email, mot de passe et nom requis' })
    }

    // Crée l'utilisateur dans Supabase Auth
    const { data: newUser, error: createErr } = await sb.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    })

    if (createErr) return res.status(400).json({ error: createErr.message })

    // Crée le profil admin
    const { error: profileErr } = await sb.from('admin_profiles').insert({
      id: newUser.user.id,
      nom,
      est_super_admin: est_super_admin || false,
      permissions: est_super_admin ? ['all'] : (permissions || []),
    })

    if (profileErr) {
      // Annule la création si le profil échoue
      await sb.auth.admin.deleteUser(newUser.user.id)
      return res.status(500).json({ error: profileErr.message })
    }

    return res.json({ success: true, user: { id: newUser.user.id, email } })
  }

  // ── Supprimer un utilisateur ──
  if (req.method === 'DELETE') {
    const { userId } = req.body || {}
    if (!userId) return res.status(400).json({ error: 'userId requis' })
    if (userId === user.id) return res.status(400).json({ error: 'Vous ne pouvez pas supprimer votre propre compte' })

    const { error: profileErr } = await sb.from('admin_profiles').delete().eq('id', userId)
    if (profileErr) return res.status(500).json({ error: profileErr.message })

    const { error: deleteErr } = await sb.auth.admin.deleteUser(userId)
    if (deleteErr) return res.status(500).json({ error: deleteErr.message })

    return res.json({ success: true })
  }

  return res.status(405).json({ error: 'Méthode non autorisée' })
}
