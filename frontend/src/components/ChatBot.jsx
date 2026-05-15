// ============================================================
// ChatBot.jsx — Assistant IA Hindo Digital
// Gemini 2.5 Flash — Intelligence artificielle complète
// ============================================================

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HiX, HiPaperAirplane, HiRefresh } from 'react-icons/hi'
import { RiRobot2Line } from 'react-icons/ri'

const GEMINI_KEY = import.meta.env.VITE_GEMINI_API_KEY
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_KEY}`

// Contexte Hindo Digital — donné à Gemini en arrière-plan
// Gemini garde son intelligence complète et répond à TOUT
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

// Message de bienvenue (affiché visuellement, NON envoyé à l'API)
const MSG_BIENVENUE = {
  id: 0,
  role: 'assistant',
  texte: '👋 Bonjour ! Je suis votre assistant IA.\n\nJe peux répondre à toutes vos questions — sur **Hindo Digital**, le numérique, ou n\'importe quel autre sujet. Comment puis-je vous aider ?',
}

const SUGGESTIONS = [
  'Quels sont vos services ?',
  'Comment créer un site web ?',
  'Expliquez-moi l\'intelligence artificielle',
  'Comment vous contacter ?',
]

const ChatBot = () => {
  const [ouvert, setOuvert]         = useState(false)
  const [messages, setMessages]     = useState([MSG_BIENVENUE])
  const [saisie, setSaisie]         = useState('')
  const [chargement, setChargement] = useState(false)
  const [erreur, setErreur]         = useState(null)
  const [nonLus, setNonLus]         = useState(0)
  const messagesRef                 = useRef(null)
  const inputRef                    = useRef(null)

  // Auto-scroll vers le bas
  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight
    }
  }, [messages, chargement])

  // Focus à l'ouverture
  useEffect(() => {
    if (ouvert) {
      setNonLus(0)
      setTimeout(() => inputRef.current?.focus(), 300)
    }
  }, [ouvert])

  const envoyerMessage = async (texteForce) => {
    const msg = (texteForce || saisie).trim()
    if (!msg || chargement) return

    setSaisie('')
    setErreur(null)

    // Ajoute le message utilisateur dans l'UI
    const idUser  = Date.now()
    const msgUser = { id: idUser, role: 'user', texte: msg }
    setMessages(prev => [...prev, msgUser])
    setChargement(true)

    try {
      if (!GEMINI_KEY) throw new Error('VITE_GEMINI_API_KEY manquante dans .env')

      // Construit l'historique pour Gemini
      // On ignore MSG_BIENVENUE (id=0) — c'est juste visuel
      // Gemini exige : user → model → user → model (alternés, commence par user)
      const historique = [...messages, msgUser]
        .filter(m => m.id !== 0)            // ignore le message de bienvenue
        .filter(m => m.role !== 'error')    // ignore les erreurs UI
        .map(m => ({
          role:  m.role === 'user' ? 'user' : 'model',
          parts: [{ text: m.texte }],
        }))

      // Gemini 2.5 — appel complet
      const reponseAPI = await fetch(GEMINI_URL, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: {
            parts: [{ text: CONTEXTE_HINDO }],
          },
          contents: historique,
          generationConfig: {
            temperature:       1,
            topP:              0.95,
            maxOutputTokens:   8192,
            responseMimeType:  'text/plain',
          },
        }),
      })

      if (!reponseAPI.ok) {
        const errData = await reponseAPI.json().catch(() => ({}))
        const msg = errData?.error?.message || `Erreur HTTP ${reponseAPI.status}`
        throw new Error(msg)
      }

      const data     = await reponseAPI.json()
      const texteBot = data?.candidates?.[0]?.content?.parts?.[0]?.text

      if (!texteBot) throw new Error('Réponse vide reçue de Gemini')

      setMessages(prev => [...prev, {
        id:    Date.now(),
        role:  'assistant',
        texte: texteBot,
      }])

      if (!ouvert) setNonLus(n => n + 1)

    } catch (e) {
      console.error('[ChatBot Gemini 2.5]', e.message)
      setErreur(e.message)
    } finally {
      setChargement(false)
    }
  }

  const reinitialiser = () => {
    setMessages([MSG_BIENVENUE])
    setErreur(null)
  }

  // Rendu Markdown minimal : **gras**, sauts de ligne, listes
  const renderMarkdown = (texte) => {
    return texte.split('\n').map((ligne, i) => {
      // Ligne vide
      if (!ligne.trim()) return <br key={i} />

      // Gras **texte**
      const parties = ligne.split(/(\*\*[^*]+\*\*)/g)
      const rendu   = parties.map((p, j) =>
        p.startsWith('**') && p.endsWith('**')
          ? <strong key={j}>{p.slice(2, -2)}</strong>
          : <span key={j}>{p}</span>
      )

      return <p key={i} className="mb-1">{rendu}</p>
    })
  }

  return (
    <>
      {/* ═══════════════════════════════
          FENÊTRE DU CHAT
          ═══════════════════════════════ */}
      <AnimatePresence>
        {ouvert && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 16 }}
            animate={{ opacity: 1, scale: 1,   y: 0  }}
            exit={{   opacity: 0, scale: 0.9, y: 16  }}
            transition={{ type: 'spring', damping: 22, stiffness: 280 }}
            className="fixed bottom-24 right-4 md:right-6 z-50
                       w-[92vw] max-w-sm bg-white rounded-2xl
                       shadow-2xl border border-gray-100 flex flex-col overflow-hidden"
            style={{ height: '540px' }}
          >
            {/* ── Header ── */}
            <div className="gradient-hero px-5 py-3.5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center">
                  <RiRobot2Line className="text-white" size={20} />
                </div>
                <div>
                  <p className="font-bold text-white text-sm font-heading leading-none">
                    Assistant Hindo Digital
                  </p>
                  <p className="text-white/70 text-xs mt-0.5 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full inline-block" />
                    Gemini 2.5 · En ligne
                  </p>
                </div>
              </div>
              <div className="flex gap-1.5">
                <button onClick={reinitialiser}
                  title="Nouvelle conversation"
                  className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/25 flex items-center justify-center transition-colors">
                  <HiRefresh className="text-white" size={15} />
                </button>
                <button onClick={() => setOuvert(false)}
                  className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/25 flex items-center justify-center transition-colors">
                  <HiX className="text-white" size={18} />
                </button>
              </div>
            </div>

            {/* ── Messages ── */}
            <div
              ref={messagesRef}
              className="flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-gray-50"
            >
              {messages.map(m => (
                <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} items-end gap-2`}>

                  {/* Avatar bot */}
                  {m.role !== 'user' && (
                    <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center shrink-0">
                      <RiRobot2Line className="text-white" size={14} />
                    </div>
                  )}

                  <div className={`max-w-[84%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-primary text-white rounded-br-sm'
                      : 'bg-white text-secondary shadow-sm rounded-bl-sm'
                  }`}>
                    {renderMarkdown(m.texte)}
                  </div>
                </div>
              ))}

              {/* Indicateur de frappe */}
              {chargement && (
                <div className="flex items-end gap-2">
                  <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center shrink-0">
                    <RiRobot2Line className="text-white" size={14} />
                  </div>
                  <div className="bg-white rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm flex gap-1.5">
                    {[0, 1, 2].map(i => (
                      <span
                        key={i}
                        className="w-2 h-2 bg-primary/40 rounded-full animate-bounce"
                        style={{ animationDelay: `${i * 0.18}s` }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Erreur */}
              {erreur && (
                <div className="bg-orange-50 border border-orange-200 text-orange-700
                                text-xs px-4 py-3 rounded-xl">
                  ⚠️ {erreur}
                </div>
              )}
            </div>

            {/* ── Suggestions (premier message seulement) ── */}
            {messages.length === 1 && !chargement && (
              <div className="px-3 pb-2 flex flex-wrap gap-1.5 shrink-0">
                {SUGGESTIONS.map(s => (
                  <button
                    key={s}
                    onClick={() => envoyerMessage(s)}
                    className="text-xs bg-primary/10 hover:bg-primary hover:text-white
                               text-primary px-3 py-1.5 rounded-full transition-colors font-medium"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {/* ── Zone de saisie ── */}
            <div className="px-3 py-3 border-t border-gray-100 bg-white flex gap-2 shrink-0">
              <input
                ref={inputRef}
                type="text"
                value={saisie}
                onChange={e => setSaisie(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) envoyerMessage() }}
                placeholder="Posez n'importe quelle question..."
                disabled={chargement}
                className="flex-1 text-sm outline-none bg-gray-50 rounded-xl
                           px-4 py-2.5 border border-gray-200 focus:border-primary
                           transition-colors text-secondary placeholder-gray-400"
              />
              <button
                onClick={() => envoyerMessage()}
                disabled={!saisie.trim() || chargement}
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all ${
                  saisie.trim() && !chargement
                    ? 'bg-primary text-white shadow-md hover:shadow-lg'
                    : 'bg-gray-100 text-gray-300 cursor-not-allowed'
                }`}
              >
                <HiPaperAirplane size={17} className="rotate-90" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══════════════════════════════
          BOUTON FLOTTANT
          ═══════════════════════════════ */}
      <motion.button
        onClick={() => setOuvert(v => !v)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.92 }}
        className="fixed bottom-5 right-4 md:right-6 z-50 w-14 h-14
                   gradient-hero rounded-full shadow-xl
                   flex items-center justify-center"
        aria-label="Assistant IA"
      >
        <AnimatePresence mode="wait">
          {ouvert
            ? <motion.div key="x"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0,   opacity: 1 }}
                exit={{   rotate:  90, opacity: 0 }}>
                <HiX className="text-white" size={24} />
              </motion.div>
            : <motion.div key="bot"
                initial={{ rotate:  90, opacity: 0 }}
                animate={{ rotate: 0,   opacity: 1 }}
                exit={{   rotate: -90, opacity: 0 }}>
                <RiRobot2Line className="text-white" size={26} />
              </motion.div>
          }
        </AnimatePresence>

        {/* Badge non-lus */}
        <AnimatePresence>
          {nonLus > 0 && !ouvert && (
            <motion.span
              initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
              className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white
                         text-xs font-bold rounded-full flex items-center justify-center"
            >
              {nonLus}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </>
  )
}

export default ChatBot
