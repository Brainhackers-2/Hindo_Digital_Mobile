// ============================================================
// admin/pages/AdminLogin.jsx — Page de connexion administrateur
// ============================================================

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { HiLockClosed, HiMail, HiEye, HiEyeOff } from 'react-icons/hi'
import { useAuthAdmin } from '../context/AuthAdminContext'
import { LogoIcon } from '../../components/Footer'

const AdminLogin = () => {
  const { login }     = useAuthAdmin()
  const navigate      = useNavigate()
  const [form, setForm]     = useState({ email: '', password: '' })
  const [erreur, setErreur] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPwd, setShowPwd] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErreur('')
    setLoading(true)
    try {
      await login(form.email, form.password)
      navigate('/admin')
    } catch (err) {
      // Supabase retourne err.message (pas err.response.data.message comme Axios)
      const msg = err.message || ''
      if (msg.includes('Invalid login credentials')) {
        setErreur('Email ou mot de passe incorrect.')
      } else if (msg.includes('Email not confirmed')) {
        setErreur('Email non confirmé. Vérifiez votre boîte mail ou désactivez la confirmation dans Supabase.')
      } else {
        setErreur(msg || 'Erreur de connexion. Vérifiez vos identifiants.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8"
      >
        {/* Logo + Titre */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <LogoIcon size={56} />
          </div>
          <h1 className="text-2xl font-bold font-heading text-secondary">Administration</h1>
          <p className="text-gray-500 text-sm mt-1">Hindo Digital — Espace privé</p>
        </div>

        {/* Message d'erreur */}
        {erreur && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm mb-6 flex items-center gap-2"
          >
            <HiLockClosed size={16} /> {erreur}
          </motion.div>
        )}

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label className="text-sm font-medium text-secondary block mb-1.5">
              Adresse email
            </label>
            <div className="relative">
              <HiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="admin@hindodigital.sn"
                required
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary text-secondary"
              />
            </div>
          </div>

          {/* Mot de passe */}
          <div>
            <label className="text-sm font-medium text-secondary block mb-1.5">
              Mot de passe
            </label>
            <div className="relative">
              <HiLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type={showPwd ? 'text' : 'password'}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••"
                required
                className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary text-secondary"
              />
              <button
                type="button"
                onClick={() => setShowPwd(!showPwd)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-secondary"
              >
                {showPwd ? <HiEyeOff size={18} /> : <HiEye size={18} />}
              </button>
            </div>
          </div>

          {/* Bouton connexion */}
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full flex items-center justify-center gap-2 py-3.5 text-base"
          >
            {loading ? (
              <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> Connexion...</>
            ) : (
              <><HiLockClosed size={18} /> Se connecter</>
            )}
          </button>
        </form>

        <p className="text-center text-xs text-gray-400 mt-6">
          Accès réservé aux administrateurs Hindo Digital
        </p>
      </motion.div>
    </div>
  )
}

export default AdminLogin
