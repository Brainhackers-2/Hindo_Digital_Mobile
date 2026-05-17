// api/admin-users.js — Gestion des utilisateurs admin via Service Role Key
// La service role key ne doit JAMAIS être exposée côté client
// Utilise fetch natif → aucune dépendance externe requise

const SUPABASE_URL = process.env.SUPABASE_URL
const SERVICE_KEY  = process.env.SUPABASE_SERVICE_ROLE_KEY

const adminHeaders = () => ({
  'Content-Type':  'application/json',
  'Authorization': `Bearer ${SERVICE_KEY}`,
  'apikey':        SERVICE_KEY,
})

// Parse le body manuellement au cas où Vercel ne le fait pas automatiquement
async function parseBody(req) {
  if (req.body && typeof req.body === 'object') return req.body
  if (req.body && typeof req.body === 'string') {
    try { return JSON.parse(req.body) } catch { return {} }
  }
  return new Promise((resolve) => {
    let data = ''
    req.on('data', chunk => { data += chunk })
    req.on('end', () => {
      try { resolve(JSON.parse(data)) } catch { resolve({}) }
    })
  })
}

// Vérifie le token utilisateur : apikey = SERVICE_KEY, Authorization = token user
async function getUser(token) {
  const r = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
    headers: {
      'Content-Type':  'application/json',
      'Authorization': `Bearer ${token}`,
      'apikey':        SERVICE_KEY,
    },
  })
  if (!r.ok) return null
  return r.json()
}

// Récupère le profil admin d'un user
async function getAdminProfil(userId) {
  const r = await fetch(
    `${SUPABASE_URL}/rest/v1/admin_profiles?id=eq.${userId}&select=est_super_admin&limit=1`,
    { headers: adminHeaders() }
  )
  if (!r.ok) return null
  const rows = await r.json()
  return rows[0] ?? null
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (req.method === 'OPTIONS') return res.status(200).end()

  if (!SUPABASE_URL || !SERVICE_KEY) {
    return res.status(500).json({ error: 'Variables d\'environnement Supabase manquantes' })
  }

  // Vérifie que l'appelant est authentifié
  const token = req.headers.authorization?.replace('Bearer ', '')
  if (!token) return res.status(401).json({ error: 'Non authentifié' })

  const user = await getUser(token)
  if (!user?.id) return res.status(401).json({ error: 'Token invalide' })

  // Vérifie que c'est un super admin
  const profil = await getAdminProfil(user.id)
  if (!profil?.est_super_admin) {
    return res.status(403).json({ error: 'Réservé au super administrateur' })
  }

  const body = await parseBody(req)

  // ── Créer un utilisateur ──
  if (req.method === 'POST') {
    const { email, password, nom, permissions, est_super_admin } = body
    if (!email || !password || !nom) {
      return res.status(400).json({ error: 'Email, mot de passe et nom requis' })
    }

    // Crée l'utilisateur dans Supabase Auth
    const createRes = await fetch(`${SUPABASE_URL}/auth/v1/admin/users`, {
      method:  'POST',
      headers: adminHeaders(),
      body: JSON.stringify({ email, password, email_confirm: true }),
    })
    const createData = await createRes.json()

    if (!createRes.ok || !createData.id) {
      return res.status(400).json({
        error: createData.message || createData.msg || createData.error_description || JSON.stringify(createData),
      })
    }

    const newUserId = createData.id

    // Crée le profil admin
    const profileRes = await fetch(`${SUPABASE_URL}/rest/v1/admin_profiles`, {
      method:  'POST',
      headers: { ...adminHeaders(), 'Prefer': 'return=minimal' },
      body: JSON.stringify({
        id:            newUserId,
        nom,
        est_super_admin: est_super_admin || false,
        permissions:   est_super_admin ? ['all'] : (permissions || []),
      }),
    })

    if (!profileRes.ok) {
      const profileErr = await profileRes.json().catch(() => ({}))
      // Annule la création Auth si le profil échoue
      await fetch(`${SUPABASE_URL}/auth/v1/admin/users/${newUserId}`, {
        method:  'DELETE',
        headers: adminHeaders(),
      })
      return res.status(500).json({
        error: profileErr.message || profileErr.error_description || JSON.stringify(profileErr),
      })
    }

    return res.json({ success: true, user: { id: newUserId, email } })
  }

  // ── Supprimer un utilisateur ──
  if (req.method === 'DELETE') {
    const { userId } = body
    if (!userId) return res.status(400).json({ error: 'userId requis' })
    if (userId === user.id) return res.status(400).json({ error: 'Vous ne pouvez pas supprimer votre propre compte' })

    const profileDelRes = await fetch(
      `${SUPABASE_URL}/rest/v1/admin_profiles?id=eq.${userId}`,
      { method: 'DELETE', headers: adminHeaders() }
    )
    if (!profileDelRes.ok) {
      const err = await profileDelRes.json().catch(() => ({}))
      return res.status(500).json({ error: err.message || JSON.stringify(err) })
    }

    const userDelRes = await fetch(`${SUPABASE_URL}/auth/v1/admin/users/${userId}`, {
      method:  'DELETE',
      headers: adminHeaders(),
    })
    if (!userDelRes.ok) {
      const err = await userDelRes.json().catch(() => ({}))
      return res.status(500).json({ error: err.message || JSON.stringify(err) })
    }

    return res.json({ success: true })
  }

  return res.status(405).json({ error: 'Méthode non autorisée' })
}
