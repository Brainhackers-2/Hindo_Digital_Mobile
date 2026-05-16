// ChatBot.jsx — Assistant IA Hindo Digital (Groq / LLaMA 3)

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HiX, HiPaperAirplane, HiRefresh } from 'react-icons/hi'
import { HiMicrophone, HiStop } from 'react-icons/hi2'
import { RiRobot2Line } from 'react-icons/ri'

const MSG_BIENVENUE = {
  id: 0,
  role: 'assistant',
  texte: '👋 Bonjour ! Je suis l\'assistant de **Hindo Digital**.\n\nJe peux vous renseigner sur nos services, nos tarifs, nos formations et nos coordonnées. Comment puis-je vous aider ?',
}

const SUGGESTIONS = [
  'Quels sont vos services ?',
  'Comment vous contacter ?',
  'Quels sont vos horaires ?',
  'Je veux un devis',
]

// Animation pour chaque bulle de message
const bulleVariants = {
  user:      { initial: { opacity: 0, x: 30, scale: 0.9 }, animate: { opacity: 1, x: 0, scale: 1 } },
  assistant: { initial: { opacity: 0, x: -30, scale: 0.9 }, animate: { opacity: 1, x: 0, scale: 1 } },
}

const ChatBot = () => {
  const [ouvert, setOuvert]                 = useState(false)
  const [messages, setMessages]             = useState([MSG_BIENVENUE])
  const [saisie, setSaisie]                 = useState('')
  const [chargement, setChargement]         = useState(false)
  const [erreur, setErreur]                 = useState(null)
  const [nonLus, setNonLus]                 = useState(0)
  const [enregistrement, setEnregistrement] = useState(false)
  const messagesRef    = useRef(null)
  const inputRef       = useRef(null)
  const recognitionRef = useRef(null)

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight
    }
  }, [messages, chargement])

  useEffect(() => {
    if (ouvert) {
      setNonLus(0)
      setTimeout(() => inputRef.current?.focus(), 300)
    } else {
      recognitionRef.current?.stop()
      setEnregistrement(false)
    }
  }, [ouvert])

  useEffect(() => {
    return () => recognitionRef.current?.stop()
  }, [])

  const toggleVocal = useCallback(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      setErreur('Reconnaissance vocale non supportée par votre navigateur.')
      return
    }
    if (enregistrement) {
      recognitionRef.current?.stop()
      setEnregistrement(false)
      return
    }
    const rec = new SpeechRecognition()
    rec.lang = 'fr-FR'
    rec.interimResults = false
    rec.maxAlternatives = 1
    rec.onresult = (e) => {
      const texte = e.results[0][0].transcript
      setEnregistrement(false)
      envoyerMessage(texte)
    }
    rec.onerror = () => setEnregistrement(false)
    rec.onend   = () => setEnregistrement(false)
    recognitionRef.current = rec
    rec.start()
    setEnregistrement(true)
    setErreur(null)
  }, [enregistrement])

  const envoyerMessage = async (texteForce) => {
    const msg = (texteForce || saisie).trim()
    if (!msg || chargement) return
    setSaisie('')
    setErreur(null)
    const idUser  = Date.now()
    const msgUser = { id: idUser, role: 'user', texte: msg }
    setMessages(prev => [...prev, msgUser])
    setChargement(true)
    try {
      const historique = [...messages, msgUser]
        .filter(m => m.id !== 0 && m.role !== 'error')
        .map(m => ({ role: m.role, texte: m.texte }))
      const reponseAPI = await fetch('/api/gemini', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ message: msg, historique }),
      })
      const data = await reponseAPI.json()
      if (!reponseAPI.ok) throw new Error(data.error || `Erreur ${reponseAPI.status}`)
      setMessages(prev => [...prev, { id: Date.now(), role: 'assistant', texte: data.reponse }])
      if (!ouvert) setNonLus(n => n + 1)
    } catch (e) {
      console.error('[ChatBot]', e.message)
      setErreur(e.message)
    } finally {
      setChargement(false)
    }
  }

  const reinitialiser = () => {
    setMessages([MSG_BIENVENUE])
    setErreur(null)
  }

  const renderMarkdown = (texte) => {
    return texte.split('\n').map((ligne, i) => {
      if (!ligne.trim()) return <br key={i} />
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
            initial={{ opacity: 0, scale: 0.85, y: 24 }}
            animate={{ opacity: 1, scale: 1,    y: 0  }}
            exit={{   opacity: 0, scale: 0.85,  y: 24 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="fixed bottom-24 right-4 md:right-6 z-50
                       w-[92vw] max-w-sm bg-white rounded-2xl
                       shadow-2xl border border-gray-100 flex flex-col overflow-hidden"
            style={{ height: '540px' }}
          >
            {/* ── Header ── */}
            <div className="gradient-hero px-5 py-3.5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                {/* Avatar animé */}
                <motion.div
                  animate={{ scale: [1, 1.08, 1] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                  className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center"
                >
                  <RiRobot2Line className="text-white" size={20} />
                </motion.div>
                <div>
                  <p className="font-bold text-white text-sm font-heading leading-none">
                    Assistant Hindo Digital
                  </p>
                  <p className="text-white/70 text-xs mt-0.5 flex items-center gap-1">
                    <motion.span
                      animate={{ opacity: [1, 0.3, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="w-1.5 h-1.5 bg-green-400 rounded-full inline-block"
                    />
                    IA · En ligne
                  </p>
                </div>
              </div>
              <div className="flex gap-1.5">
                <motion.button
                  whileHover={{ rotate: 180 }}
                  transition={{ duration: 0.3 }}
                  onClick={reinitialiser}
                  title="Nouvelle conversation"
                  className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/25 flex items-center justify-center transition-colors"
                >
                  <HiRefresh className="text-white" size={15} />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                  onClick={() => setOuvert(false)}
                  className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/25 flex items-center justify-center transition-colors"
                >
                  <HiX className="text-white" size={18} />
                </motion.button>
              </div>
            </div>

            {/* ── Messages ── */}
            <div ref={messagesRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-gray-50">
              <AnimatePresence initial={false}>
                {messages.map(m => (
                  <motion.div
                    key={m.id}
                    variants={bulleVariants[m.role] || bulleVariants.assistant}
                    initial="initial"
                    animate="animate"
                    transition={{ type: 'spring', damping: 22, stiffness: 300 }}
                    className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} items-end gap-2`}
                  >
                    {m.role !== 'user' && (
                      <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center shrink-0">
                        <RiRobot2Line className="text-white" size={14} />
                      </div>
                    )}
                    <motion.div
                      whileHover={{ scale: 1.01 }}
                      className={`max-w-[84%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                        m.role === 'user'
                          ? 'bg-primary text-white rounded-br-sm'
                          : 'bg-white text-secondary shadow-sm rounded-bl-sm'
                      }`}
                    >
                      {renderMarkdown(m.texte)}
                    </motion.div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Indicateur de frappe */}
              <AnimatePresence>
                {chargement && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1,  y: 0  }}
                    exit={{   opacity: 0,  y: 10  }}
                    className="flex items-end gap-2"
                  >
                    <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center shrink-0">
                      <RiRobot2Line className="text-white" size={14} />
                    </div>
                    <div className="bg-white rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm flex gap-1.5">
                      {[0, 1, 2].map(i => (
                        <motion.span
                          key={i}
                          animate={{ y: [0, -6, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                          className="w-2 h-2 bg-primary/50 rounded-full block"
                        />
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {erreur && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1,  scale: 1  }}
                    exit={{   opacity: 0,  scale: 0.9 }}
                    className="bg-orange-50 border border-orange-200 text-orange-700 text-xs px-4 py-3 rounded-xl"
                  >
                    ⚠️ {erreur}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* ── Suggestions ── */}
            <AnimatePresence>
              {messages.length === 1 && !chargement && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1,  y: 0  }}
                  exit={{   opacity: 0,  y: 10  }}
                  className="px-3 pb-2 flex flex-wrap gap-1.5 shrink-0"
                >
                  {SUGGESTIONS.map((s, i) => (
                    <motion.button
                      key={s}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.08 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => envoyerMessage(s)}
                      className="text-xs bg-primary/10 hover:bg-primary hover:text-white
                                 text-primary px-3 py-1.5 rounded-full transition-colors font-medium"
                    >
                      {s}
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── Zone de saisie ── */}
            <div className="px-3 py-3 border-t border-gray-100 bg-white flex gap-2 shrink-0">

              {/* Bouton microphone */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                animate={enregistrement ? { scale: [1, 1.15, 1] } : {}}
                transition={enregistrement ? { duration: 0.8, repeat: Infinity } : {}}
                onClick={toggleVocal}
                title={enregistrement ? 'Arrêter' : 'Message vocal'}
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                  enregistrement
                    ? 'bg-red-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-500 hover:bg-primary/10 hover:text-primary'
                }`}
              >
                {enregistrement ? <HiStop size={17} /> : <HiMicrophone size={17} />}
              </motion.button>

              <input
                ref={inputRef}
                type="text"
                value={saisie}
                onChange={e => setSaisie(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) envoyerMessage() }}
                placeholder={enregistrement ? '🎤 Parlez, envoi automatique...' : 'Votre question...'}
                disabled={chargement}
                className="flex-1 text-sm outline-none bg-gray-50 rounded-xl
                           px-4 py-2.5 border border-gray-200 focus:border-primary
                           transition-colors text-secondary placeholder-gray-400"
              />

              {/* Bouton envoyer */}
              <motion.button
                whileHover={saisie.trim() && !chargement ? { scale: 1.1 } : {}}
                whileTap={saisie.trim()  && !chargement ? { scale: 0.9 } : {}}
                onClick={() => envoyerMessage()}
                disabled={!saisie.trim() || chargement}
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all ${
                  saisie.trim() && !chargement
                    ? 'bg-primary text-white shadow-md hover:shadow-lg'
                    : 'bg-gray-100 text-gray-300 cursor-not-allowed'
                }`}
              >
                <HiPaperAirplane size={17} className="rotate-90" />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══════════════════════════════
          BOUTON FLOTTANT
          ═══════════════════════════════ */}
      <motion.button
        onClick={() => setOuvert(v => !v)}
        whileHover={{ scale: 1.12 }}
        whileTap={{ scale: 0.9 }}
        animate={ouvert ? {} : { y: [0, -5, 0] }}
        transition={ouvert ? {} : { duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        className="fixed bottom-5 right-4 md:right-6 z-50 w-14 h-14
                   gradient-hero rounded-full shadow-xl
                   flex items-center justify-center"
        aria-label="Assistant IA"
      >
        {/* Halo pulsant quand fermé */}
        {!ouvert && (
          <motion.span
            animate={{ scale: [1, 1.6, 1], opacity: [0.4, 0, 0.4] }}
            transition={{ duration: 2.5, repeat: Infinity }}
            className="absolute inset-0 rounded-full bg-primary"
          />
        )}

        <AnimatePresence mode="wait">
          {ouvert
            ? <motion.div key="x"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0,   opacity: 1 }}
                exit={{   rotate:  90, opacity: 0 }}
                transition={{ duration: 0.2 }}>
                <HiX className="text-white" size={24} />
              </motion.div>
            : <motion.div key="bot"
                initial={{ rotate:  90, opacity: 0 }}
                animate={{ rotate: 0,   opacity: 1 }}
                exit={{   rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}>
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
