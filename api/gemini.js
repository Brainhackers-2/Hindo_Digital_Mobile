// api/gemini.js — Proxy serverless Vercel pour Gemini AI
// Auto-détecte le modèle disponible selon la clé API

const CONTEXTE_HINDO = `Tu es l'assistant virtuel officiel de Hindo Digital. Tu réponds UNIQUEMENT aux questions concernant Hindo Digital et ses services. Pour toute autre question (politique, sport, cuisine, etc.), réponds poliment que tu es uniquement là pour aider avec les services de Hindo Digital.

══ INFORMATIONS HINDO DIGITAL ══

Entreprise : Hindo Digital
Slogan : "Le Numérique à votre porte"
Localisation : Ziguinchor, Sénégal
Site web : hindodigitale.com

CONTACT :
- Email : hindodigitale@gmail.com
- Téléphone 1 : +221 76 404 37 44
- Téléphone 2 : +221 78 849 43 63
- Téléphone 3 : +221 78 121 85 95
- WhatsApp : +221 76 404 37 44

HORAIRES :
- Lundi - Vendredi : 08h à 18h
- Samedi : 09h à 14h
- Dimanche : Fermé

NOS 5 SERVICES :

1. RÉSEAUX & SYSTÈMES
   - Réseaux LAN/WAN, câblage structuré, fibre optique
   - Administration système Windows & Linux
   - Sécurité informatique, pare-feu, Cloud, sauvegarde

2. SÉCURITÉ & VIDÉOSURVEILLANCE
   - Caméras IP HD, alarmes anti-intrusion
   - Contrôle d'accès biométrique
   - Surveillance à distance via smartphone

3. DÉVELOPPEMENT WEB & MOBILE
   - Sites vitrines, boutiques e-commerce
   - Applications mobiles Android & iOS
   - Intégration paiement Orange Money / Wave

4. FORMATION INFORMATIQUE
   - Bureautique (Word, Excel, PowerPoint)
   - Réseaux, cybersécurité, développement web
   - Formations en entreprise

5. INFOGRAPHIE & COMMUNICATION
   - Logos, charte graphique, flyers, affiches
   - Visuels réseaux sociaux, maquettes UI/UX

CLIENTS : PME, particuliers, institutions, jeunes en formation

══ RÈGLES DE RÉPONSE ══
- Réponds en français, de façon chaleureuse et professionnelle
- Réponds UNIQUEMENT aux questions sur Hindo Digital et ses services
- Si la question ne concerne pas Hindo Digital, dis : "Je suis uniquement là pour vous renseigner sur Hindo Digital et ses services. Pour toute question, contactez-nous au +221 76 404 37 44."
- Pour les devis : inviter à appeler ou écrire à hindodigitale@gmail.com
- Sois concis (3-4 phrases maximum par réponse)`

// Modèles gratuits confirmés sur AI Studio (pas d'auto-détection)
const MODELES_GRATUITS = [
  'gemini-1.5-flash',
  'gemini-1.5-flash-8b',
]

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

  // Essaie chaque modèle gratuit jusqu'à ce qu'un réponde
  for (const model of MODELES_GRATUITS) {
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
        console.warn(`[Gemini] ${model} échoué:`, data?.error?.message)
        continue
      }

      const reponse = data?.candidates?.[0]?.content?.parts?.[0]?.text
      if (!reponse) continue

      return res.json({ reponse })

    } catch (err) {
      console.warn(`[Gemini] ${model} erreur réseau:`, err.message)
    }
  }

  return res.status(500).json({
    error: 'Quota Gemini dépassé. Vérifiez votre clé sur aistudio.google.com/apikey et assurez-vous de créer la clé dans un NOUVEAU projet.',
  })
}
