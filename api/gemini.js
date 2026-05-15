// api/gemini.js — Proxy serverless Vercel pour Gemini AI
// Auto-détecte le modèle disponible selon la clé API

const CONTEXTE_HINDO = `Tu es un assistant IA puissant et intelligent intégré sur le site web de Hindo Digital.

Hindo Digital est une entreprise sénégalaise de services numériques basée à Ziguinchor.
Slogan : "Le Numérique à votre porte"
Contact : hindodigitale@gmail.com | +221 76 404 37 44 | +221 78 849 43 63 | +221 78 121 85 95
WhatsApp : +221 76 404 37 44
Horaires : Lun-Ven 08h-18h | Sam 09h-14h | Dim Fermé

Services :
- Réseaux & Systèmes (LAN/WAN, Cloud, sécurité)
- Sécurité & Vidéosurveillance (caméras IP, alarmes)
- Développement Web & Mobile (sites, apps, e-commerce)
- Formation Informatique (bureautique, réseaux, dev web)
- Infographie (logo, charte graphique, communication visuelle)

Règles :
- Réponds en français par défaut, dans la langue de l'utilisateur si différente
- Tu peux répondre à TOUTES les questions
- Sois naturel, intelligent et utile
- Pour les devis : donner le contact Hindo Digital`

// Priorité des modèles : du plus capable au plus basique
const MODELES_PRIORITE = [
  'gemini-2.0-flash',
  'gemini-1.5-flash',
  'gemini-1.5-flash-latest',
  'gemini-1.5-flash-8b',
  'gemini-1.5-pro',
  'gemini-1.0-pro',
  'gemini-pro',
]

async function trouverModele(apiKey) {
  try {
    const resp = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
    )
    if (!resp.ok) return null
    const { models = [] } = await resp.json()

    const disponibles = models
      .filter(m => m.supportedGenerationMethods?.includes('generateContent'))
      .map(m => m.name.replace('models/', ''))

    for (const prefere of MODELES_PRIORITE) {
      const trouve = disponibles.find(d => d === prefere || d.startsWith(prefere))
      if (trouve) return trouve
    }

    // Retourne n'importe quel modèle disponible en dernier recours
    return disponibles[0] || null
  } catch {
    return null
  }
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Méthode non autorisée' })

  const { message, historique = [] } = req.body || {}
  if (!message?.trim()) return res.status(400).json({ error: 'Message vide' })

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    return res.status(500).json({ error: 'Clé API manquante — ajoutez GEMINI_API_KEY dans Vercel' })
  }

  // Détecte automatiquement le meilleur modèle disponible
  const model = await trouverModele(apiKey)
  if (!model) {
    return res.status(500).json({
      error: 'Aucun modèle Gemini disponible. Vérifiez la clé API sur aistudio.google.com/apikey',
    })
  }

  // Historique au format Gemini (alternance stricte user/model)
  const contents = []
  for (const m of historique) {
    const role = m.role === 'user' ? 'user' : 'model'
    const dernier = contents[contents.length - 1]
    if (dernier && dernier.role === role) {
      dernier.parts[0].text += '\n' + m.texte
    } else {
      contents.push({ role, parts: [{ text: m.texte }] })
    }
  }
  contents.push({ role: 'user', parts: [{ text: message.trim() }] })

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: CONTEXTE_HINDO }] },
        contents,
        generationConfig: { temperature: 0.7, maxOutputTokens: 1024 },
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('[Gemini]', model, data?.error?.message)
      return res.status(500).json({ error: data?.error?.message || `Erreur ${response.status}` })
    }

    const reponse = data?.candidates?.[0]?.content?.parts?.[0]?.text
    if (!reponse) {
      const raison = data?.candidates?.[0]?.finishReason || 'inconnue'
      return res.status(500).json({ error: `Pas de réponse (raison: ${raison})` })
    }

    return res.json({ reponse, model })

  } catch (err) {
    console.error('[Gemini] Erreur réseau:', err.message)
    return res.status(500).json({ error: 'Service indisponible' })
  }
}
