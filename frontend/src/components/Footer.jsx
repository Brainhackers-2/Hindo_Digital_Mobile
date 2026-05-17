// ============================================================
// components/Footer.jsx — Pied de page de Hindo Digital
// Coordonnées réelles, réseaux sociaux et formulaire newsletter
// ============================================================

import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FaFacebookF, FaTiktok, FaWhatsapp, FaInstagram } from 'react-icons/fa'
import { HiMail, HiPhone, HiLocationMarker, HiGlobe } from 'react-icons/hi'
import { abonnerNewsletter } from '../services/contactApi'
import { useSiteSettings } from '../context/SiteSettingsContext'
import { useContenu }       from '../context/ContenuContext'

const Footer = () => {
  const [email, setEmail] = useState('')
  const [statut, setStatut] = useState(null)
  const { c } = useContenu() // 'success' | 'error' | null

  const handleNewsletter = async (e) => {
    e.preventDefault()
    try {
      await abonnerNewsletter({ email })
      setStatut('success')
      setEmail('')
    } catch {
      setStatut('error')
    }
  }

  return (
    <footer className="bg-secondary text-white">
      <div className="container-custom py-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

        {/* ---- Colonne 1 : À propos ---- */}
        <div>
          {/* Logo Hindo Digital */}
          <div className="flex items-center gap-3 mb-4">
            <LogoIcon size={36} />
            <span className="font-bold text-xl font-heading">
              Hindo <span className="text-primary">Digital</span>
            </span>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed mb-5">
            Entreprise sénégalaise spécialisée dans les services numériques.
            <em className="text-primary"> Le Numérique à votre porte.</em>
          </p>
          {/* Réseaux sociaux */}
          <div className="flex gap-3">
            {[
              { icon: <FaFacebookF />, href: c('general_facebook') || 'https://facebook.com/hindodigitale', label: 'Facebook'  },
              { icon: <FaTiktok />,    href: c('general_tiktok')   || 'https://tiktok.com/@hindodigitale',  label: 'TikTok'    },
              { icon: <FaWhatsapp />,  href: c('general_whatsapp') || 'https://wa.me/221788494363',         label: 'WhatsApp'  },
              { icon: <FaInstagram />, href: c('general_instagram')|| 'https://instagram.com/hindodigitale',label: 'Instagram' },
            ].map(({ icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="w-9 h-9 bg-white/10 hover:bg-primary rounded-lg flex items-center justify-center transition-colors duration-300"
              >
                {icon}
              </a>
            ))}
          </div>
        </div>

        {/* ---- Colonne 2 : Navigation rapide ---- */}
        <div>
          <h3 className="font-semibold text-lg mb-5 font-heading">Navigation</h3>
          <ul className="space-y-2 text-sm text-gray-400">
            {[
              { path: '/',             label: 'Accueil'      },
              { path: '/a-propos',    label: 'À propos'     },
              { path: '/services',    label: 'Nos services' },
              { path: '/realisations',label: 'Réalisations' },
              { path: '/formation',   label: 'Formations'   },
              { path: '/contact',     label: 'Contact'      },
            ].map(({ path, label }) => (
              <li key={path}>
                <Link to={path} className="hover:text-primary transition-colors flex items-center gap-1">
                  <span className="text-primary">›</span> {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* ---- Colonne 3 : Coordonnées réelles ---- */}
        <div>
          <h3 className="font-semibold text-lg mb-5 font-heading">Contact</h3>
          <ul className="space-y-3 text-sm text-gray-400">
            <li className="flex items-start gap-3">
              <HiLocationMarker className="text-primary mt-0.5 shrink-0" size={18} />
              <span>{c('general_adresse')}</span>
            </li>
            {/* Trois numéros de téléphone réels */}
            <li className="flex items-start gap-3">
              <HiPhone className="text-primary shrink-0 mt-0.5" size={18} />
              <div className="flex flex-col gap-0.5">
                {[c('general_tel1'), c('general_tel2'), c('general_tel3')].filter(Boolean).map(tel => (
                  <a key={tel} href={`tel:${tel.replace(/\s/g,'')}`} className="hover:text-primary transition-colors">{tel}</a>
                ))}
              </div>
            </li>
            <li className="flex items-center gap-3">
              <HiMail className="text-primary shrink-0" size={18} />
              <a href={`mailto:${c('general_email')}`} className="hover:text-primary transition-colors">
                {c('general_email')}
              </a>
            </li>
            <li className="flex items-center gap-3">
              <HiGlobe className="text-primary shrink-0" size={18} />
              <a href="https://hindodigitale.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                hindodigitale.com
              </a>
            </li>
          </ul>
        </div>

        {/* ---- Colonne 4 : Newsletter ---- */}
        <div>
          <h3 className="font-semibold text-lg mb-5 font-heading">Newsletter</h3>
          <p className="text-gray-400 text-sm mb-4">
            Restez informé de nos actualités et nouvelles formations.
          </p>
          <form onSubmit={handleNewsletter} className="flex flex-col gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Votre adresse email"
              required
              className="px-4 py-2.5 rounded-lg bg-white/10 border border-white/20 text-white
                         placeholder-gray-500 focus:outline-none focus:border-primary text-sm"
            />
            <button type="submit" className="btn-primary text-sm py-2.5">
              S'abonner
            </button>
            {statut === 'success' && <p className="text-green-400 text-xs">Merci pour votre abonnement !</p>}
            {statut === 'error'   && <p className="text-red-400 text-xs">Une erreur est survenue. Réessayez.</p>}
          </form>
        </div>
      </div>

      {/* ---- Barre de copyright ---- */}
      <div className="border-t border-white/10">
        <div className="container-custom py-5 flex flex-col md:flex-row items-center justify-between gap-2 text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} Hindo Digital. Tous droits réservés.</p>
          <p>Fait avec ❤️ au Sénégal — <a href="https://hindodigitale.com" className="hover:text-primary transition-colors">hindodigitale.com</a></p>
        </div>
      </div>
    </footer>
  )
}

// ============================================================
// LogoIcon — Affiche le logo personnalisé OU le logo par défaut
// Se met à jour automatiquement quand un nouveau logo est uploadé
// ============================================================
export const LogoIcon = ({ size = 40, className = '' }) => {
  const { logoUrl } = useSiteSettings()

  // Si un logo personnalisé existe → l'afficher
  if (logoUrl) {
    return (
      <div
        style={{ width: size, height: size }}
        className={`shrink-0 rounded-lg overflow-hidden ${className}`}
      >
        <img
          src={logoUrl}
          alt="Logo Hindo Digital"
          className="w-full h-full object-contain"
        />
      </div>
    )
  }

  // Logo par défaut (lettre D rouge bordeaux)
  return (
    <div
      style={{ width: size, height: size }}
      className={`bg-primary rounded-lg flex items-center justify-center shrink-0 relative overflow-hidden ${className}`}
    >
      <span className="text-white font-black font-heading" style={{ fontSize: size * 0.5 }}>D</span>
      <div className="absolute bottom-1 right-1 w-1.5 h-1.5 bg-white/40 rounded-full" />
    </div>
  )
}

export default Footer
