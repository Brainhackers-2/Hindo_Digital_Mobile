// ============================================================
// admin/layout/AdminLayout.jsx — Mise en page du panneau admin
// Sidebar de navigation + Header + Zone de contenu
// ============================================================

import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  HiHome, HiMail, HiCog, HiPhotograph, HiAcademicCap,
  HiUsers, HiStar, HiNewspaper, HiMenu, HiX, HiPlay,
  HiLogout, HiChevronDown, HiClipboardList, HiAdjustments, HiPencilAlt
} from 'react-icons/hi'
import { useAuthAdmin } from '../context/AuthAdminContext'
import { LogoIcon } from '../../components/Footer'

// Liens de navigation du panneau admin
// separator = true → affiche un label de section dans la sidebar
const NAV_ITEMS = [
  { path: '/admin',              label: 'Dashboard',         icon: <HiHome size={20} />,         exact: true },
  { separator: 'Contenu' },
  { path: '/admin/contacts',     label: 'Messages',          icon: <HiMail size={20} />,         badge: 'contacts' },
  { path: '/admin/services',     label: 'Services',          icon: <HiCog size={20} />           },
  { path: '/admin/formations',   label: 'Formations',        icon: <HiAcademicCap size={20} />   },
  { path: '/admin/inscriptions', label: 'Inscriptions',      icon: <HiClipboardList size={20} /> },
  { path: '/admin/temoignages',  label: 'Témoignages',       icon: <HiStar size={20} />          },
  { path: '/admin/newsletter',   label: 'Newsletter',        icon: <HiNewspaper size={20} />     },
  { separator: 'Galerie' },
  { path: '/admin/galerie',      label: 'Galerie (site)',    icon: <HiPhotograph size={20} />    },
  { path: '/admin/realisations', label: 'Réalisations',      icon: <HiPhotograph size={20} />    },
  { path: '/admin/videos',       label: 'Vidéos',            icon: <HiPlay size={20} />          },
  { separator: 'Paramètres' },
  { path: '/admin/contenu',      label: 'Contenu des pages', icon: <HiPencilAlt size={20} />     },
  { path: '/admin/settings',     label: 'Logo & Images',     icon: <HiAdjustments size={20} />   },
]

const AdminLayout = ({ children, stats }) => {
  const { admin, logout } = useAuthAdmin()
  const navigate          = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    navigate('/admin/login')
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-white/10">
        <LogoIcon size={36} />
        <div>
          <p className="font-bold text-white font-heading leading-none">Hindo Digital</p>
          <p className="text-white/50 text-xs mt-0.5">Administration</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item, i) => {
          if (item.separator) return (
            <p key={i} className="text-white/30 text-[10px] font-bold uppercase tracking-widest px-4 pt-4 pb-1">
              {item.separator}
            </p>
          )
          const { path, label, icon, exact, badge } = item
          return (
            <NavLink
              key={path}
              to={path}
              end={exact}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-primary text-white shadow-md'
                    : 'text-white/60 hover:text-white hover:bg-white/10'
                }`
              }
            >
              {icon}
              <span>{label}</span>
              {badge === 'contacts' && stats?.contacts?.non_lus > 0 && (
                <span className="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {stats.contacts.non_lus}
                </span>
              )}
            </NavLink>
          )
        })}
      </nav>

      {/* Bouton déconnexion en bas */}
      <div className="px-3 py-4 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm font-medium
                     text-white/60 hover:text-white hover:bg-red-500/20 transition-all duration-200"
        >
          <HiLogout size={20} />
          <span>Déconnexion</span>
        </button>
      </div>
    </div>
  )

  return (
    <div className="flex h-screen bg-neutral overflow-hidden">

      {/* ---- Sidebar Desktop (fixe) ---- */}
      <aside className="hidden lg:flex flex-col w-64 bg-secondary shrink-0">
        <SidebarContent />
      </aside>

      {/* ---- Sidebar Mobile (drawer animé) ---- */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-black/60 z-40 lg:hidden"
            />
            {/* Panneau latéral */}
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed left-0 top-0 bottom-0 w-64 bg-secondary z-50 lg:hidden flex flex-col"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ---- Zone principale ---- */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* ---- Header ---- */}
        <header className="bg-white border-b border-gray-200 px-4 md:px-6 h-16 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            {/* Bouton hamburger mobile */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg text-secondary hover:bg-gray-100 transition-colors"
            >
              <HiMenu size={22} />
            </button>
            <div>
              <h1 className="font-bold text-secondary font-heading text-base">
                Panneau d'administration
              </h1>
              <p className="text-xs text-gray-400 hidden md:block">Hindo Digital</p>
            </div>
          </div>

          {/* Profil admin */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm">
                {admin?.name?.charAt(0).toUpperCase() || 'A'}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-semibold text-secondary leading-none">{admin?.name || 'Admin'}</p>
                <p className="text-xs text-gray-400 mt-0.5">{admin?.email}</p>
              </div>
              <HiChevronDown size={16} className="text-gray-400" />
            </button>

            {/* Dropdown */}
            <AnimatePresence>
              {dropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="absolute right-0 top-full mt-2 w-44 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50"
                >
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <HiLogout size={16} /> Déconnexion
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </header>

        {/* ---- Contenu scrollable ---- */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

export default AdminLayout
