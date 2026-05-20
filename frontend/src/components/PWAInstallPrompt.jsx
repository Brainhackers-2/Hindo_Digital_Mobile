import { useState, useEffect } from 'react'
import { MdInstallMobile, MdClose } from 'react-icons/md'

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
      // N'affiche la bannière que si l'utilisateur ne l'a pas déjà rejetée
      const dismissed = sessionStorage.getItem('pwa-prompt-dismissed')
      if (!dismissed) setVisible(true)
    }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') setVisible(false)
    setDeferredPrompt(null)
  }

  const handleDismiss = () => {
    sessionStorage.setItem('pwa-prompt-dismissed', '1')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div
      role="banner"
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-sm
                 bg-white border border-neutral-dark rounded-2xl shadow-card
                 flex items-center gap-3 p-4 animate-slide-up"
    >
      <div className="flex-shrink-0 bg-primary rounded-xl p-2">
        <MdInstallMobile className="text-white text-2xl" />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-secondary leading-tight">
          Installer Hindo Digital
        </p>
        <p className="text-xs text-secondary/60 mt-0.5">
          Accès rapide depuis votre écran d'accueil
        </p>
      </div>

      <div className="flex items-center gap-1 flex-shrink-0">
        <button
          onClick={handleInstall}
          className="bg-primary text-white text-xs font-semibold px-3 py-1.5 rounded-lg
                     hover:bg-primary-dark transition-colors"
        >
          Installer
        </button>
        <button
          onClick={handleDismiss}
          aria-label="Fermer"
          className="p-1.5 text-secondary/40 hover:text-secondary transition-colors rounded-lg"
        >
          <MdClose className="text-lg" />
        </button>
      </div>
    </div>
  )
}
