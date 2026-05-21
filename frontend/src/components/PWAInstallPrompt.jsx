import { useState, useEffect } from 'react'
import { MdInstallMobile, MdClose, MdMoreVert, MdIosShare } from 'react-icons/md'

// Détecte si l'app tourne déjà en mode installée (standalone)
const isStandalone = () =>
  window.matchMedia('(display-mode: standalone)').matches ||
  window.navigator.standalone === true

// Détecte iOS (Safari)
const isIOS = () => /iphone|ipad|ipod/i.test(navigator.userAgent)

// Détecte Android
const isAndroid = () => /android/i.test(navigator.userAgent)

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [visible, setVisible] = useState(false)
  const [platform, setPlatform] = useState(null) // 'android' | 'ios' | null

  useEffect(() => {
    // Ne pas afficher si déjà installée
    if (isStandalone()) return

    // Ne pas afficher si déjà ignorée dans cette session
    if (sessionStorage.getItem('pwa-dismissed')) return

    // Détermine la plateforme
    if (isIOS()) setPlatform('ios')
    else if (isAndroid()) setPlatform('android')
    else return // Desktop : on n'affiche pas

    // Attend 2 secondes avant d'afficher (laisser la page charger)
    const timer = setTimeout(() => setVisible(true), 2000)

    // Capture l'événement natif Chrome si disponible
    const handler = (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
    }
    window.addEventListener('beforeinstallprompt', handler)

    return () => {
      clearTimeout(timer)
      window.removeEventListener('beforeinstallprompt', handler)
    }
  }, [])

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      if (outcome === 'accepted') setVisible(false)
      setDeferredPrompt(null)
    }
  }

  const handleDismiss = () => {
    sessionStorage.setItem('pwa-dismissed', '1')
    setVisible(false)
  }

  if (!visible || !platform) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center"
         style={{ background: 'rgba(0,0,0,0.45)' }}
         onClick={handleDismiss}>

      <div
        className="w-full max-w-md bg-white rounded-t-3xl p-6 pb-8 animate-slide-up"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="bg-primary rounded-2xl p-2.5">
              <MdInstallMobile className="text-white text-2xl" />
            </div>
            <div>
              <p className="font-bold text-secondary text-base">Installer Hindo Digital</p>
              <p className="text-xs text-secondary/50">Accès rapide depuis votre écran d'accueil</p>
            </div>
          </div>
          <button onClick={handleDismiss} className="p-2 text-secondary/30 hover:text-secondary rounded-xl">
            <MdClose className="text-xl" />
          </button>
        </div>

        {/* Bouton natif Chrome Android */}
        {platform === 'android' && deferredPrompt && (
          <button
            onClick={handleInstall}
            className="w-full bg-primary text-white font-semibold py-4 rounded-2xl
                       hover:bg-primary-dark transition-colors text-base mb-3"
          >
            Installer l'application
          </button>
        )}

        {/* Instructions manuelles Android */}
        {platform === 'android' && (
          <div className="bg-neutral rounded-2xl p-4">
            <p className="text-xs font-semibold text-secondary mb-3 uppercase tracking-wide">
              {deferredPrompt ? 'Ou installez manuellement' : 'Comment installer'}
            </p>
            <div className="space-y-2.5">
              <Step n={1} icon={<MdMoreVert className="text-primary text-lg" />}
                text={<>Appuyez sur les <strong>3 points ⋮</strong> en haut à droite de Chrome</>} />
              <Step n={2} text={<>Sélectionnez <strong>"Ajouter à l'écran d'accueil"</strong></>} />
              <Step n={3} text={<>Appuyez sur <strong>"Ajouter"</strong> pour confirmer</>} />
            </div>
          </div>
        )}

        {/* Instructions iOS Safari */}
        {platform === 'ios' && (
          <div className="bg-neutral rounded-2xl p-4">
            <p className="text-xs font-semibold text-secondary mb-3 uppercase tracking-wide">
              Comment installer sur iPhone
            </p>
            <div className="space-y-2.5">
              <Step n={1} icon={<MdIosShare className="text-primary text-lg" />}
                text={<>Appuyez sur le bouton <strong>Partager</strong> <span className="text-primary">↑</span> en bas de Safari</>} />
              <Step n={2} text={<>Faites défiler et tapez <strong>"Sur l'écran d'accueil"</strong></>} />
              <Step n={3} text={<>Appuyez sur <strong>"Ajouter"</strong> en haut à droite</>} />
            </div>
            <p className="text-xs text-secondary/40 mt-3">Utilise Safari, pas Chrome, sur iPhone.</p>
          </div>
        )}

        <button onClick={handleDismiss}
          className="w-full mt-3 py-3 text-sm text-secondary/40 hover:text-secondary transition-colors">
          Plus tard
        </button>
      </div>
    </div>
  )
}

function Step({ n, icon, text }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
        {icon ?? <span className="text-xs font-bold text-primary">{n}</span>}
      </div>
      <p className="text-sm text-secondary/70">{text}</p>
    </div>
  )
}
