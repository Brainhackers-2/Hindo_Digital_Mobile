// ============================================================
// api/gemini.js — Proxy serverless Vercel pour Gemini AI
// La clé API reste côté serveur (jamais exposée au navigateur)
// ============================================================

const CONTEXTE_HINDO = `Tu es un assistant IA puissant et intelligent intégré sur le site web de Hindo Digital.

Hindo Digital est une entreprise sénégalaise de services numériques basée à Ziguinchor.
Slogan : "Le Numérique à votre porte"
Contact : hindodigitale@gmail.com | +221 76 404 37 44 | +221 78 849 43 63 | +221 78 121 85 95
WhatsApp : +221 76 404 37 44
Horaires : Lun-Ven 08h-18h | Sam 09h-14h | Dim Fermé

Services proposés :
- Réseaux & Systèmes (LAN/WAN, Cloud, sécurité informatique)
- Sécurité & Vidéosurveillance (caméras IP, alarmes, contrôle d'accès)
- Développement Web & Mobile (sites, apps, e-commerce)
- Formation Informatique (bureautique, réseaux, dev web)
- Infographie (logo, charte graphique, communication visuelle)

Règles :
- Réponds en français par défaut, dans la langue de l'utilisateur si différente
- Tu peux répondre à TOUTES les questions, pas seulement celles sur Hindo Digital
- Sois naturel, intelligent et utile comme un vrai assistant IA
- Pour les demandes de devis, donner le contact Hindo Digital
- Pas de limite sur les sujets`

const MODELS = [
  'gemini-1.5-flash',
  'gemini-1.5-flash-latest',
  'gemini-1.5-flash-8b',
]

async function appelGemini(apiKey, model, contents) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`
  return fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      system_instruction: { parts: [{ text: CONTEXTE_HINDO }] },
      contents,
      generationConfig: { temperature: 0.7, maxOutputTokens: 1024 },
    }),
  })
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
    return res.status(500).json({ error: 'Clé API manquante. Ajoutez GEMINI_API_KEY dans Vercel.' })
  }

  // Construit l'historique au format Gemini (alternance stricte user/model)
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

  // Essaie les modèles dans l'ordre jusqu'à ce qu'un fonctionne
  let derniereErreur = null
  for (const model of MODELS) {
    try {
      const response = await appelGemini(apiKey, model, contents)
      const data = await response.json()

      if (!response.ok) {
        derniereErreur = data?.error?.message || `Erreur HTTP ${response.status}`
        console.warn(`[Gemini] Modèle ${model} échoué:`, derniereErreur)
        continue
      }

      const reponse = data?.candidates?.[0]?.content?.parts?.[0]?.text
      if (!reponse) {
        const raison = data?.candidates?.[0]?.finishReason || 'inconnue'
        derniereErreur = `Pas de réponse (raison: ${raison})`
        continue
      }

      return res.json({ reponse, model })

    } catch (err) {
      derniereErreur = err.message
      console.error(`[Gemini] Erreur réseau (${model}):`, err.message)
    }
  }

  return res.status(500).json({
    error: derniereErreur || 'Tous les modèles Gemini ont échoué.',
  })
}
