// api/gemini-debug.js — Diagnostic de la clé API Gemini
// Accès : https://votre-site.vercel.app/api/gemini-debug

export default async function handler(req, res) {
  const apiKey = process.env.GEMINI_API_KEY

  if (!apiKey) {
    return res.json({ erreur: 'GEMINI_API_KEY non définie dans Vercel' })
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
    )
    const data = await response.json()

    if (!response.ok) {
      return res.json({ erreur: data?.error?.message || `HTTP ${response.status}`, data })
    }

    const modeles = (data.models || [])
      .filter(m => m.supportedGenerationMethods?.includes('generateContent'))
      .map(m => m.name)

    return res.json({
      cle_presente: true,
      modeles_disponibles: modeles,
      total: modeles.length,
    })
  } catch (err) {
    return res.json({ erreur: err.message })
  }
}
