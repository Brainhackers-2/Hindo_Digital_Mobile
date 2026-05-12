// ============================================================
// components/Navbar.jsx — Barre de navigation principale
// Navigation responsive avec logo réel Hindo Digital
// ============================================================

import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { HiMenu, HiX } from 'react-icons/hi'
import { LogoIcon } from './Footer'

const NAV_LINKS = [
  { path: '/',             label: 'Accueil'      },
  { path: '/a-propos',    label: 'À propos'     },
  { path: '/services',    label: 'Services'     },
  { path: '/realisations',label: 'Réalisations' },
  { path: '/formation',   label: 'Formation'    },
  { path: '/contact',     label: 'Contact'      },
]

const Navbar = () => {
  const [menuOuvert, setMenuOuvert] = useState(false)
  const location = useLocation()

  // Ferme le menu automatiquement à chaque changement de page
  useEffect(() => {
    setMenuOuvert(false)
  }, [location.pathname])

  const fermerMenu = () => setMenuOuvert(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
      <nav className="container-custom flex items-center justify-between h-16 md:h-20">

        {/* ---- Logo Hindo Digital ---- */}
        <Link to="/" onClick={fermerMenu} className="flex items-center gap-2.5">
          <LogoIcon size={40} />
          <div>
            <span className="font-bold text-xl font-heading text-secondary">
              Hindo <span className="text-primary">Digital</span>
            </span>
            <p className="text-xs hidden md:block leading-none mt-0.5 text-gray-400">
              Le Numérique à votre porte
            </p>
          </div>
        </Link>

        {/* ---- Navigation Desktop ---- */}
        <ul className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(({ path, label }) => (
            <li key={path}>
              <NavLink
                to={path}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                    isActive
                      ? 'text-primary bg-primary/10'
                      : 'text-secondary hover:text-primary hover:bg-gray-50'
                  }`
                }
              >
                {label}
              </NavLink>
            </li>
          ))}
          <li className="ml-2">
            <Link to="/contact" className="btn-primary text-sm">
              Nous contacter
            </Link>
          </li>
        </ul>

        {/* ---- Bouton hamburger mobile ---- */}
        <button
          onClick={() => setMenuOuvert(!menuOuvert)}
          className="md:hidden p-2 rounded-lg text-secondary hover:text-primary transition-colors"
          aria-label="Ouvrir le menu"
        >
          {menuOuvert ? <HiX size={24} /> : <HiMenu size={24} />}
        </button>
      </nav>

      {/* ---- Menu mobile animé ---- */}
      <AnimatePresence>
        {menuOuvert && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden bg-white border-t border-gray-100 shadow-lg"
          >
            <ul className="container-custom py-4 flex flex-col gap-1">
              {NAV_LINKS.map(({ path, label }) => (
                <li key={path}>
                  <NavLink
                    to={path}
                    onClick={fermerMenu}
                    className={({ isActive }) =>
                      `block px-4 py-3 rounded-lg font-medium transition-colors ${
                        isActive ? 'text-primary bg-primary/10' : 'text-secondary hover:text-primary hover:bg-gray-50'
                      }`
                    }
                  >
                    {label}
                  </NavLink>
                </li>
              ))}
              <li className="mt-2">
                <Link to="/contact" onClick={fermerMenu} className="btn-primary w-full text-center block">
                  Nous contacter
                </Link>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

export default Navbar
