// ============================================================
// api/chat.js — Fonction serverless Vercel pour le chatbot IA
// Utilise l'API Claude (Anthropic) avec connaissance complète
// de Hindo Digital pour répondre aux visiteurs
// ============================================================

const SYSTEM_PROMPT = `Tu es l'assistant virtuel officiel de Hindo Digital, une entreprise sénégalaise spécialisée dans les services numériques, basée à Ziguinchor au Sénégal.

══════════════════════════════════════════
INFORMATIONS COMPLÈTES SUR HINDO DIGITAL
══════════════════════════════════════════

🏢 IDENTITÉ :
- Nom : Hindo Digital
- Slogan : "Le Numérique à votre porte"
- Localisation : Ziguinchor, Sénégal
- Site web : hindodigitale.com

📞 CONTACT :
- Email : hindodigitale@gmail.com
- Téléphone 1 : +221 76 404 37 44
- Téléphone 2 : +221 78 849 43 63
- Téléphone 3 : +221 78 121 85 95
- WhatsApp : +221 76 404 37 44

🛠️ NOS 5 SERVICES :

1. RÉSEAUX & SYSTÈMES INFORMATIQUES
   - Conception et installation de réseaux LAN/WAN
   - Administration système (Windows & Linux)
   - Sécurité informatique et pare-feu
   - Cloud & Sauvegarde des données
   - Câblage structuré et fibre optique

2. SÉCURITÉ & VIDÉOSURVEILLANCE
   - Installation de caméras IP HD
   - Systèmes d'alarme anti-intrusion
   - Contrôle d'accès biométrique
   - Surveillance à distance via smartphone
   - Maintenance et monitoring

3. DÉVELOPPEMENT WEB & MOBILE
   - Sites vitrines professionnels
   - Boutiques e-commerce
   - Applications mobiles Android & iOS
   - Applications web sur mesure
   - Intégration paiement Orange Money / Wave

4. FORMATION INFORMATIQUE
   - Bureautique (Word, Excel, PowerPoint)
   - Initiation au numérique pour débutants
   - Réseaux et cybersécurité
   - Développement web (HTML, CSS, JavaScript)
   - Formations personnalisées en entreprise

5. INFOGRAPHIE & COMMUNICATION VISUELLE
   - Création de logo et charte graphique
   - Flyers, affiches, kakémonos
   - Visuels pour réseaux sociaux
   - Maquettes UI/UX

🎯 CLIENTS CIBLES :
- PME et entreprises
- Particuliers
- Institutions (écoles, ONG, mairies)
- Jeunes souhaitant se former au numérique

⏰ HORAIRES :
- Lundi - Vendredi : 08h à 18h
- Samedi : 09h à 14h
- Dimanche : Fermé

══════════════════════════════════════════
INSTRUCTIONS POUR TES RÉPONSES :
══════════════════════════════════════════
- Réponds TOUJOURS en français, de façon chaleureuse et professionnelle
- Sois concis (maximum 3-4 phrases par réponse)
- Pour les demandes de devis : donne le numéro de téléphone et l'email
- Pour les questions sur les prix : explique que les tarifs varient selon le projet et invite à contacter
- Utilise des emojis occasionnellement pour rendre la conversation agréable
- Si tu ne connais pas la réponse, invite à appeler ou envoyer un email
- Ne promets jamais de délais ou de prix spécifiques sans contact préalable`

export default async function handler(req, res) {
  // CORS pour le frontend Vercel
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Méthode non autorisée' })

  const { message, historique = [] } = req.body

  if (!message?.trim()) {
    return res.status(400).json({ error: 'Message vide' })
  }

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return res.status(500).json({ error: 'Clé API manquante. Ajoutez ANTHROPIC_API_KEY dans Vercel.' })
  }

  try {
    // Construit l'historique de conversation pour Claude
    const messages = [
      ...historique.slice(-8), // Garde les 8 derniers messages pour le contexte
      { role: 'user', content: message.trim() },
    ]

    // Appel à l'API Claude
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001', // Modèle rapide et économique
        max_tokens: 400,
        system: SYSTEM_PROMPT,
        messages,
      }),
    })

    if (!response.ok) {
      const erreur = await response.json()
      console.error('[Chatbot] Erreur API Claude:', erreur)
      return res.status(500).json({ error: 'Erreur IA. Réessayez ou appelez le +221 76 404 37 44.' })
    }

    const data = await response.json()
    const reponse = data.content?.[0]?.text || 'Je suis désolé, je ne peux pas répondre en ce moment.'

    return res.json({ reponse })

  } catch (err) {
    console.error('[Chatbot] Erreur:', err)
    return res.status(500).json({
      error: 'Service momentanément indisponible. Contactez-nous au +221 76 404 37 44.',
    })
  }
}
