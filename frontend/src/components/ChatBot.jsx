// ============================================================
// components/ChatBot.jsx — Assistant virtuel Hindo Digital
// Alimenté par Google Gemini AI — appel direct depuis le frontend
// ============================================================

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HiX, HiPaperAirplane, HiRefresh } from 'react-icons/hi'
import { RiRobot2Line } from 'react-icons/ri'

// Clé API Gemini (variable d'environnement Vite)
const GEMINI_KEY = import.meta.env.VITE_GEMINI_API_KEY
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_KEY}`

// Prompt complet — répond à TOUTES les questions + expert Hindo Digital
const SYSTEM_PROMPT = `Tu es un assistant intelligent et polyvalent intégré sur le site de Hindo Digital, une entreprise sénégalaise de services numériques basée à Ziguinchor.

Tu peux répondre à TOUTES les questions posées par les visiteurs :
- Questions générales (informatique, technologie, internet, logiciels, etc.)
- Questions sur le numérique et le développement web
- Questions sur Hindo Digital et ses services
- Questions de la vie quotidienne
- Conseils professionnels
- Toute autre question

═══════════════════════════════════
INFORMATIONS SUR HINDO DIGITAL
═══════════════════════════════════
- Nom : Hindo Digital | Slogan : "Le Numérique à votre porte"
- Localisation : Ziguinchor, Sénégal
- Email : hindodigitale@gmail.com
- Tél 1 : +221 76 404 37 44
- Tél 2 : +221 78 849 43 63
- Tél 3 : +221 78 121 85 95
- WhatsApp : +221 76 404 37 44
- Site : hindodigitale.com
- Horaires : Lun-Ven 08h-18h | Sam 09h-14h | Dim Fermé

SERVICES :
1. Réseaux & Systèmes (LAN/WAN, administration, Cloud, sécurité)
2. Sécurité & Vidéosurveillance (caméras IP, alarmes, contrôle d'accès)
3. Développement Web & Mobile (sites, apps, e-commerce, Orange Money/Wave)
4. Formation Informatique (bureautique, réseaux, développement web)
5. Infographie (logo, charte graphique, flyers, visuels réseaux sociaux)

═══════════════════════════════════
RÈGLES DE RÉPONSE
═══════════════════════════════════
- Réponds TOUJOURS en français, sauf si on te parle dans une autre langue
- Sois utile, chaleureux et précis
- Réponds clairement à TOUTE question posée
- Si la question concerne un devis Hindo Digital : donner le +221 76 404 37 44
- Utilise des emojis avec modération pour rendre la conversation agréable
- Pas de limite sur les sujets : réponds à tout !`

// Message de bienvenue
const BIENVENUE = {
  role: 'model',
  texte: '👋 Bonjour ! Je suis l\'assistant intelligent de **Hindo Digital**.\n\nJe peux répondre à toutes vos questions — sur nos services, le numérique, ou tout autre sujet ! 🚀',
}

// Questions rapides suggérées
const QUESTIONS = [
  'Quels sont vos services ?',
  'Comment créer un site web ?',
  'Vous faites des applications ?',
  'Proposez-vous des formations ?',
]

const ChatBot = () => {
  const [ouvert, setOuvert]         = useState(false)
  const [messages, setMessages]     = useState([BIENVENUE])
  const [saisie, setSaisie]         = useState('')
  const [chargement, setChargement] = useState(false)
  const [erreur, setErreur]         = useState(null)
  const [nonLus, setNonLus]         = useState(0)
  const messagesRef                 = useRef(null)
  const inputRef                    = useRef(null)

  // Défile vers le bas à chaque nouveau message
  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight
    }
  }, [messages, chargement])

  // Focus sur l'input à l'ouverture
  useEffect(() => {
    if (ouvert) {
      setNonLus(0)
      setTimeout(() => inputRef.current?.focus(), 300)
    }
  }, [ouvert])

  const envoyerMessage = async (texteForce) => {
    const msg = texteForce || saisie.trim()
    if (!msg || chargement) return

    setSaisie('')
    setErreur(null)

    const msgUser = { role: 'user', texte: msg }
    const nouveaux = [...messages, msgUser]
    setMessages(nouveaux)
    setChargement(true)

    try {
      // Construit l'historique au format Gemini (user / model alternés)
      const contents = nouveaux.map(m => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.texte }],
      }))

      const response = await fetch(GEMINI_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: {
            parts: [{ text: SYSTEM_PROMPT }],
          },
          contents,
          generationConfig: {
            maxOutputTokens: 1024,  // Réponses plus complètes
            temperature: 0.8,
          },
        }),
      })

      if (!response.ok) {
        const err = await response.json()
        throw new Error(err.error?.message || 'Erreur Gemini')
      }

      const data = await response.json()
      const reponse = data.candidates?.[0]?.content?.parts?.[0]?.text

      if (!reponse) throw new Error('Réponse vide')

      setMessages(prev => [...prev, { role: 'model', texte: reponse }])
      if (!ouvert) setNonLus(n => n + 1)

    } catch (err) {
      console.error('[ChatBot]', err)
      setErreur('Désolé, je rencontre une difficulté. Appelez-nous au +221 76 404 37 44 😊')
    } finally {
      setChargement(false)
    }
  }

  const reinitialiser = () => { setMessages([BIENVENUE]); setErreur(null) }

  // Rendu du texte avec support gras (**texte**)
  const renderTexte = (texte) =>
    texte.split(/(\*\*[^*]+\*\*)/g).map((p, i) =>
      p.startsWith('**') && p.endsWith('**')
        ? <strong key={i}>{p.slice(2, -2)}</strong>
        : <span key={i}>{p}</span>
    )

  return (
    <>
      {/* ===== Widget de chat ===== */}
      <AnimatePresence>
        {ouvert && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-24 right-4 md:right-6 z-50 w-[92vw] max-w-sm
                       bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden"
            style={{ height: '520px' }}
          >
            {/* Header */}
            <div className="gradient-hero px-5 py-4 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <RiRobot2Line className="text-white" size={22} />
                </div>
                <div>
                  <p className="font-bold text-white font-heading text-sm leading-none">Assistant Hindo Digital</p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-white/80 text-xs">Propulsé par Gemini AI</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={reinitialiser}
                  className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors"
                  title="Nouvelle conversation">
                  <HiRefresh className="text-white" size={15} />
                </button>
                <button onClick={() => setOuvert(false)}
                  className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors">
                  <HiX className="text-white" size={18} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div ref={messagesRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-gray-50">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.role === 'model' && (
                    <div className="w-7 h-7 bg-primary rounded-full flex items-center justify-center mr-2 shrink-0 mt-0.5">
                      <RiRobot2Line className="text-white" size={14} />
                    </div>
                  )}
                  <div className={`max-w-[82%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                    msg.role === 'user'
                      ? 'bg-primary text-white rounded-br-sm'
                      : 'bg-white text-secondary shadow-sm rounded-bl-sm'
                  }`}>
                    {renderTexte(msg.texte)}
                  </div>
                </div>
              ))}

              {/* Indicateur de frappe */}
              {chargement && (
                <div className="flex justify-start items-center gap-2">
                  <div className="w-7 h-7 bg-primary rounded-full flex items-center justify-center shrink-0">
                    <RiRobot2Line className="text-white" size={14} />
                  </div>
                  <div className="bg-white rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm flex gap-1.5">
                    {[0,1,2].map(i => (
                      <span key={i} className="w-2 h-2 bg-primary/50 rounded-full animate-bounce"
                        style={{ animationDelay: `${i * 0.15}s` }} />
                    ))}
                  </div>
                </div>
              )}

              {/* Erreur */}
              {erreur && (
                <div className="bg-red-50 border border-red-100 text-red-600 text-xs px-4 py-2.5 rounded-xl">
                  {erreur}
                </div>
              )}
            </div>

            {/* Questions rapides */}
            {messages.length === 1 && (
              <div className="px-4 pb-2 flex flex-wrap gap-1.5 shrink-0">
                {QUESTIONS.map(q => (
                  <button key={q} onClick={() => envoyerMessage(q)}
                    className="text-xs bg-primary/10 text-primary hover:bg-primary hover:text-white
                               px-3 py-1.5 rounded-full transition-colors font-medium">
                    {q}
                  </button>
                ))}
              </div>
            )}

            {/* Zone de saisie */}
            <div className="px-4 py-3 border-t border-gray-100 bg-white flex items-center gap-2 shrink-0">
              <input
                ref={inputRef}
                type="text"
                value={saisie}
                onChange={e => setSaisie(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && envoyerMessage()}
                placeholder="Posez votre question..."
                disabled={chargement}
                className="flex-1 text-sm text-secondary placeholder-gray-400 outline-none
                           bg-gray-50 rounded-xl px-4 py-2.5 border border-gray-200
                           focus:border-primary transition-colors"
              />
              <button
                onClick={() => envoyerMessage()}
                disabled={!saisie.trim() || chargement}
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all ${
                  saisie.trim() && !chargement
                    ? 'bg-primary text-white hover:bg-primary-dark shadow-md'
                    : 'bg-gray-100 text-gray-300'
                }`}>
                <HiPaperAirplane size={18} className="rotate-90" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== Bouton flottant ===== */}
      <motion.button
        onClick={() => setOuvert(v => !v)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-5 right-4 md:right-6 z-50 w-14 h-14 gradient-hero
                   rounded-full shadow-xl flex items-center justify-center text-white"
        aria-label="Ouvrir l'assistant"
      >
        <AnimatePresence mode="wait">
          {ouvert
            ? <motion.span key="x"   initial={{rotate:-90,opacity:0}} animate={{rotate:0,opacity:1}} exit={{rotate:90,opacity:0}}><HiX size={24} /></motion.span>
            : <motion.span key="bot" initial={{rotate:90,opacity:0}}  animate={{rotate:0,opacity:1}} exit={{rotate:-90,opacity:0}}><RiRobot2Line size={26} /></motion.span>
          }
        </AnimatePresence>

        {/* Badge message non lu */}
        {nonLus > 0 && !ouvert && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white
                           text-xs font-bold rounded-full flex items-center justify-center">
            {nonLus}
          </span>
        )}
      </motion.button>
    </>
  )
}

export default ChatBot
