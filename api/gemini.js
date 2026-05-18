// api/gemini.js — Chatbot Hindo Digital via Groq (LLaMA 3)
// Groq : gratuit, 14 400 req/jour, ultra-rapide

const CONTEXTE_HINDO = `Tu es un assistant IA intelligent et polyvalent intégré au site de Hindo Digital. Tu peux répondre à toutes les questions, qu'elles concernent Hindo Digital ou n'importe quel autre sujet (informatique, culture générale, conseils, rédaction, traduction, etc.).

Quand la question concerne Hindo Digital, utilise ces informations :

══ HINDO DIGITAL ══
Slogan : "Le Numérique à votre porte"
Localisation : Ziguinchor, Sénégal
Site web : hindodigitale.com

CONTACT :
- Email : hindodigitale@gmail.com
- Téléphone 1 : +221 76 404 37 44
- Téléphone 2 : +221 78 849 43 63
- Téléphone 3 : +221 78 121 85 95
- WhatsApp : +221 78 849 43 63

HORAIRES :
- Lundi - Vendredi : 08h à 18h
- Samedi : 09h à 14h
- Dimanche : Fermé

NOS 5 SERVICES :
1. RÉSEAUX & SYSTÈMES — LAN/WAN, fibre optique, Cloud, sécurité informatique
2. SÉCURITÉ & VIDÉOSURVEILLANCE — Caméras IP, alarmes, contrôle d'accès biométrique
3. DÉVELOPPEMENT WEB & MOBILE — Sites vitrines, e-commerce, apps Android/iOS, Orange Money/Wave
4. FORMATION INFORMATIQUE — Bureautique, réseaux, cybersécurité, dev web
5. INFOGRAPHIE & COMMUNICATION — Logos, flyers, visuels réseaux sociaux, UI/UX

CLIENTS : PME, particuliers, institutions, jeunes en formation

RÈGLES :
- Réponds toujours en français, de façon chaleureuse et professionnelle
- Pour les questions sur Hindo Digital : invite à appeler ou écrire à hindodigitale@gmail.com pour les devis
- Sois clair et concis dans tes réponses`

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Méthode non autorisée' })

  const { message, historique = [] } = req.body || {}
  if (!message?.trim()) return res.status(400).json({ error: 'Message vide' })

  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) {
    return res.status(500).json({ error: 'Clé API manquante — ajoutez GROQ_API_KEY dans Vercel' })
  }

  // Convertit l'historique au format OpenAI/Groq
  const messages = [
    { role: 'system', content: CONTEXTE_HINDO },
    ...historique.map(m => ({
      role: m.role === 'user' ? 'user' : 'assistant',
      content: m.texte,
    })),
    { role: 'user', content: message.trim() },
  ]

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages,
        temperature: 0.5,
        max_tokens: 512,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('[Groq]', data?.error?.message)
      return res.status(500).json({ error: data?.error?.message || 'Erreur Groq' })
    }

    const reponse = data.choices?.[0]?.message?.content
    if (!reponse) return res.status(500).json({ error: 'Pas de réponse' })

    return res.json({ reponse })

  } catch (err) {
    console.error('[Groq]', err.message)
    return res.status(500).json({ error: 'Service indisponible' })
  }
}
