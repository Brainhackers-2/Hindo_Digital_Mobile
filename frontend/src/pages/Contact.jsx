// ============================================================
// pages/Contact.jsx — Page Contact de Hindo Digital
// Coordonnées réelles : téléphones, email, site web
// ============================================================

import { motion } from 'framer-motion'
import {
  HiMail, HiPhone, HiLocationMarker, HiCheckCircle, HiGlobe, HiClock
} from 'react-icons/hi'
import { FaFacebookF, FaTiktok, FaWhatsapp, FaInstagram } from 'react-icons/fa'

import SectionHeader from '../components/SectionHeader'
import FormField     from '../components/FormField'
import useForm       from '../hooks/useForm'
import { envoyerContact } from '../services/contactApi'
import { useContenu }     from '../context/ContenuContext'

const SUJETS = [
  { value: 'devis',       label: 'Demande de devis'           },
  { value: 'information', label: 'Demande d\'information'     },
  { value: 'reseaux',     label: 'Réseaux & Systèmes'        },
  { value: 'video',       label: 'Vidéosurveillance'         },
  { value: 'digital',     label: 'Transformation Digitale'   },
  { value: 'formation',   label: 'Formation informatique'    },
  { value: 'infographie', label: 'Infographie & Design'      },
  { value: 'partenariat', label: 'Partenariat'               },
  { value: 'autre',       label: 'Autre'                     },
]

// Coordonnées réelles Hindo Digital
const TELEPHONES = [
  { numero: '+221 76 404 37 44', href: 'tel:+221764043744' },
  { numero: '+221 78 849 43 63', href: 'tel:+221788494363' },
  { numero: '+221 78 121 85 95', href: 'tel:+221781218595' },
]

const Contact = () => {
  const { values, errors, loading, success, handleChange, handleSubmit } = useForm(
    { nom: '', email: '', telephone: '', sujet: '', message: '' },
    async (data) => { await envoyerContact(data) }
  )
  const { c } = useContenu()

  return (
    <>
      {/* ---- En-tête de page ---- */}
      <section className="gradient-hero pt-28 pb-16">
        <div className="container-custom text-white text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold font-heading mb-4"
          >
            Contactez-nous
          </motion.h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            Nous sommes à votre écoute pour une consultation personnalisée et gratuite.
          </p>
        </div>
      </section>

      {/* ====================================================
          SECTION FORMULAIRE + INFOS
          ==================================================== */}
      <section className="section bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

            {/* ---- Formulaire de contact (2/3) ---- */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-2"
            >
              <SectionHeader
                titre="Envoyez-nous un message"
                sousTitre="Remplissez le formulaire — nous répondons sous 24h"
                centré={false}
              />

              {success ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="card text-center py-12 border-2 border-green-200"
                >
                  <HiCheckCircle className="text-green-500 mx-auto mb-4" size={56} />
                  <h3 className="text-xl font-bold font-heading text-secondary mb-3">
                    Message envoyé !
                  </h3>
                  <p className="text-gray-500 max-w-sm mx-auto">
                    Merci pour votre message. Notre équipe vous contactera dans les meilleurs délais.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <FormField label="Nom complet" name="nom" value={values.nom}
                      onChange={handleChange} error={errors.nom}
                      placeholder="Votre nom et prénom" required />
                    <FormField label="Email" name="email" type="email" value={values.email}
                      onChange={handleChange} error={errors.email}
                      placeholder="votre@email.com" required />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <FormField label="Téléphone" name="telephone" type="tel" value={values.telephone}
                      onChange={handleChange} error={errors.telephone}
                      placeholder="+221 76 404 37 44" />
                    <FormField label="Sujet" name="sujet" type="select" value={values.sujet}
                      onChange={handleChange} error={errors.sujet}
                      options={SUJETS} required />
                  </div>
                  <FormField label="Message" name="message" type="textarea" value={values.message}
                    onChange={handleChange} error={errors.message}
                    placeholder="Décrivez votre projet ou votre demande en détail..." required />

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary w-full flex items-center justify-center gap-2 text-base py-4"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Envoi en cours...
                      </>
                    ) : (
                      <><HiMail size={20} /> Envoyer le message</>
                    )}
                  </button>
                </form>
              )}
            </motion.div>

            {/* ---- Informations de contact (1/3) ---- */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="space-y-6"
            >
              <div>
                <h3 className="font-bold text-xl font-heading text-secondary mb-2">
                  Nos coordonnées
                </h3>
                <div className="w-12 h-0.5 bg-primary rounded mb-6" />
              </div>

              {/* Adresse */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary shrink-0">
                  <HiLocationMarker size={20} />
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Adresse</p>
                  <p className="text-secondary font-medium">{c('general_adresse')}</p>
                </div>
              </div>

              {/* Téléphones réels */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary shrink-0">
                  <HiPhone size={20} />
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-1">Téléphone</p>
                  {[c('general_tel1'), c('general_tel2'), c('general_tel3')].filter(Boolean).map(tel => (
                    <a key={tel} href={`tel:${tel.replace(/\s/g,'')}`}
                      className="block text-secondary font-medium hover:text-primary transition-colors">
                      {tel}
                    </a>
                  ))}
                </div>
              </div>

              {/* Email réel */}
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary shrink-0">
                  <HiMail size={20} />
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Email</p>
                  <a href={`mailto:${c('general_email')}`}
                    className="text-secondary font-medium hover:text-primary transition-colors">
                    {c('general_email')}
                  </a>
                </div>
              </div>

              {/* Site web */}
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary shrink-0">
                  <HiGlobe size={20} />
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Site web</p>
                  <a href="https://hindodigitale.com" target="_blank" rel="noopener noreferrer"
                    className="text-secondary font-medium hover:text-primary transition-colors">
                    hindodigitale.com
                  </a>
                </div>
              </div>

              {/* Horaires */}
              <div className="card bg-neutral border-0">
                <div className="flex items-center gap-2 mb-3">
                  <HiClock className="text-primary" size={18} />
                  <h4 className="font-semibold text-secondary">Horaires d'ouverture</h4>
                </div>
                <div className="space-y-1.5 text-sm text-gray-500">
                  <div className="flex justify-between">
                    <span>Lundi — Vendredi</span>
                    <span className="text-secondary font-semibold">{c('contact_horaire_lv')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Samedi</span>
                    <span className="text-secondary font-semibold">{c('contact_horaire_sam')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Dimanche</span>
                    <span className="text-red-400">{c('contact_horaire_dim')}</span>
                  </div>
                </div>
              </div>

              {/* Réseaux sociaux */}
              <div>
                <p className="text-sm font-medium text-secondary mb-3">Suivez-nous</p>
                <div className="flex gap-3">
                  {[
                    { icon: <FaFacebookF />,  href: 'https://www.facebook.com/profile.php?id=61589734688095',      label: 'Facebook'  },
                    { icon: <FaTiktok />,     href: c('general_tiktok') || 'https://tiktok.com/@hindodigitale', label: 'TikTok' },
                    { icon: <FaWhatsapp />,   href: 'https://wa.me/221788494363',              label: 'WhatsApp'  },
                    { icon: <FaInstagram />,  href: 'https://instagram.com/hindodigitale',     label: 'Instagram' },
                  ].map(({ icon, href, label }) => (
                    <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                      className="w-10 h-10 bg-primary/10 hover:bg-primary text-primary hover:text-white
                                 rounded-lg flex items-center justify-center transition-colors duration-300">
                      {icon}
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ====================================================
          SECTION CARTE / LOCALISATION
          ==================================================== */}
      <section className="bg-neutral">
        <div className="container-custom py-12">
          <div className="rounded-2xl overflow-hidden shadow-card h-64 md:h-80 bg-gray-200 flex items-center justify-center">
            <div className="text-center text-gray-400">
              <HiLocationMarker size={48} className="mx-auto mb-3 text-primary" />
              <p className="font-bold text-secondary text-lg">Hindo Digital</p>
              <p className="text-sm">Ziguinchor, Sénégal</p>
              <p className="text-xs mt-1 text-primary">hindodigitale.com</p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default Contact
