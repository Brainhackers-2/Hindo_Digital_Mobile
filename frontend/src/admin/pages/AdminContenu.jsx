// ============================================================
// admin/pages/AdminContenu.jsx — CMS : modifier tout le contenu du site
// Interface à onglets couvrant toutes les pages du site
// ============================================================

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  HiSave, HiCheckCircle, HiGlobe, HiHome, HiInformationCircle,
  HiPhone, HiClock, HiStar, HiRefresh
} from 'react-icons/hi'
import AdminLayout from '../layout/AdminLayout'
import adminApi   from '../services/adminApi'
import { DEFAUTS, useContenu } from '../../context/ContenuContext'

// ---- Onglets du CMS ----
const ONGLETS = [
  { id: 'general',  label: 'Général',    icon: <HiGlobe size={16} />           },
  { id: 'accueil',  label: 'Accueil',    icon: <HiHome size={16} />            },
  { id: 'apropos',  label: 'À propos',   icon: <HiInformationCircle size={16} />},
  { id: 'contact',  label: 'Contact',    icon: <HiPhone size={16} />           },
]

// Composant champ de formulaire CMS
const Champ = ({ label, cle, valeurs, onChange, multiline = false, aide = '' }) => (
  <div className="space-y-1.5">
    <div className="flex items-center justify-between">
      <label className="text-sm font-medium text-secondary">{label}</label>
      {aide && <span className="text-xs text-gray-400">{aide}</span>}
    </div>
    {multiline ? (
      <textarea
        rows={3}
        value={valeurs[cle] ?? ''}
        onChange={e => onChange(cle, e.target.value)}
        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none
                   focus:border-primary text-sm text-secondary resize-y min-h-[80px]"
      />
    ) : (
      <input
        type="text"
        value={valeurs[cle] ?? ''}
        onChange={e => onChange(cle, e.target.value)}
        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none
                   focus:border-primary text-sm text-secondary"
      />
    )}
  </div>
)

// Séparateur de section dans le formulaire
const Section = ({ titre, children }) => (
  <div className="space-y-4">
    <div className="flex items-center gap-3">
      <div className="h-px flex-1 bg-gray-100" />
      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">
        {titre}
      </h4>
      <div className="h-px flex-1 bg-gray-100" />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>
  </div>
)

const AdminContenu = () => {
  const { rafraichir } = useContenu() // Pour recharger le contenu sur tout le site après save
  const [ongletActif, setOngletActif] = useState('general')
  const [valeurs, setValeurs]         = useState({})
  const [loading, setLoading]         = useState(true)
  const [saving, setSaving]           = useState(false)
  const [message, setMessage]         = useState(null)

  // Charge le contenu actuel depuis l'API admin
  const charger = async () => {
    setLoading(true)
    try {
      const res = await adminApi.get('/admin/contenu')
      setValeurs({ ...DEFAUTS, ...res.data?.data })
    } catch {
      setValeurs(DEFAUTS)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { charger() }, [])

  const onChange = (cle, valeur) => {
    setValeurs(prev => ({ ...prev, [cle]: valeur }))
    setMessage(null)
  }

  const sauvegarder = async () => {
    setSaving(true)
    setMessage(null)
    try {
      await adminApi.post('/admin/contenu', { contenu: valeurs })
      // Recharge le ContenuContext → toutes les pages du site voient les nouveaux textes
      await rafraichir()
      setMessage({ type: 'success', texte: 'Contenu sauvegardé et appliqué sur le site !' })
    } catch (err) {
      setMessage({ type: 'error', texte: `Erreur : ${err?.message || 'Réessayez.'}` })
    } finally {
      setSaving(false)
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-4xl">

        {/* En-tête */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold font-heading text-secondary">Contenu du site</h2>
            <p className="text-gray-500 text-sm mt-1">
              Modifiez le texte de toutes les pages — les changements sont appliqués instantanément
            </p>
          </div>
          <button
            onClick={charger}
            className="p-2.5 text-gray-400 hover:text-secondary hover:bg-gray-100 rounded-xl transition-colors"
            title="Recharger le contenu"
          >
            <HiRefresh size={18} />
          </button>
        </div>

        {/* Message de succès/erreur */}
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex items-center gap-3 px-5 py-3.5 rounded-xl text-sm font-medium ${
              message.type === 'success'
                ? 'bg-green-50 border border-green-200 text-green-700'
                : 'bg-red-50 border border-red-200 text-red-600'
            }`}
          >
            {message.type === 'success' ? <HiCheckCircle size={18} /> : '⚠'}
            {message.texte}
          </motion.div>
        )}

        {/* Onglets */}
        <div className="flex gap-1 bg-gray-100 rounded-2xl p-1.5">
          {ONGLETS.map(o => (
            <button
              key={o.id}
              onClick={() => setOngletActif(o.id)}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl
                          text-sm font-medium transition-all duration-200 ${
                ongletActif === o.id
                  ? 'bg-white text-secondary shadow-sm'
                  : 'text-gray-500 hover:text-secondary'
              }`}
            >
              {o.icon} {o.label}
            </button>
          ))}
        </div>

        {/* Formulaire */}
        {loading ? (
          <div className="bg-white rounded-2xl shadow-card p-8 space-y-4">
            {[1,2,3,4,5].map(i => (
              <div key={i} className="h-14 bg-gray-100 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-card p-6 md:p-8 space-y-8">

            {/* ================================================
                ONGLET GÉNÉRAL
                ================================================ */}
            {ongletActif === 'general' && (
              <div className="space-y-8">
                <Section titre="Identité de l'entreprise">
                  <Champ label="Nom de l'entreprise"  cle="general_nom"     valeurs={valeurs} onChange={onChange} />
                  <Champ label="Slogan principal"      cle="general_slogan"  valeurs={valeurs} onChange={onChange} />
                </Section>

                <Section titre="Coordonnées">
                  <Champ label="Adresse"        cle="general_adresse" valeurs={valeurs} onChange={onChange} />
                  <Champ label="Email"           cle="general_email"   valeurs={valeurs} onChange={onChange} />
                  <Champ label="Téléphone 1"    cle="general_tel1"    valeurs={valeurs} onChange={onChange} aide="+221 76..." />
                  <Champ label="Téléphone 2"    cle="general_tel2"    valeurs={valeurs} onChange={onChange} aide="+221 78..." />
                  <Champ label="Téléphone 3"    cle="general_tel3"    valeurs={valeurs} onChange={onChange} aide="+221 78..." />
                  <Champ label="Site web"       cle="general_site"    valeurs={valeurs} onChange={onChange} aide="sans https://" />
                </Section>

                <Section titre="Réseaux sociaux (URL complètes)">
                  <Champ label="Facebook"   cle="general_facebook"  valeurs={valeurs} onChange={onChange} />
                  <Champ label="WhatsApp"   cle="general_whatsapp"  valeurs={valeurs} onChange={onChange} aide="wa.me/221..." />
                  <Champ label="LinkedIn"   cle="general_linkedin"  valeurs={valeurs} onChange={onChange} />
                  <Champ label="Instagram"  cle="general_instagram" valeurs={valeurs} onChange={onChange} />
                </Section>
              </div>
            )}

            {/* ================================================
                ONGLET ACCUEIL
                ================================================ */}
            {ongletActif === 'accueil' && (
              <div className="space-y-8">
                <Section titre="Section Hero (bandeau principal)">
                  <div className="md:col-span-2">
                    <Champ label="Badge (petite étiquette au-dessus du titre)" cle="hero_badge" valeurs={valeurs} onChange={onChange} />
                  </div>
                  <Champ label="Titre principal"     cle="hero_titre"          valeurs={valeurs} onChange={onChange} />
                  <Champ label="Slogan en grands caractères" cle="hero_slogan" valeurs={valeurs} onChange={onChange} />
                  <div className="md:col-span-2">
                    <Champ label="Sous-titre (description sous le slogan)" cle="hero_sous_titre" valeurs={valeurs} onChange={onChange} multiline aide="1-2 phrases" />
                  </div>
                  <Champ label="Bouton principal (CTA)"    cle="hero_cta_principal"  valeurs={valeurs} onChange={onChange} />
                  <Champ label="Bouton secondaire"         cle="hero_cta_secondaire" valeurs={valeurs} onChange={onChange} />
                </Section>

                <Section titre="Chiffres clés (4 statistiques)">
                  <Champ label="Stat 1 — Valeur"  cle="stat1_valeur" valeurs={valeurs} onChange={onChange} aide='ex: "50+"' />
                  <Champ label="Stat 1 — Label"   cle="stat1_label"  valeurs={valeurs} onChange={onChange} />
                  <Champ label="Stat 2 — Valeur"  cle="stat2_valeur" valeurs={valeurs} onChange={onChange} />
                  <Champ label="Stat 2 — Label"   cle="stat2_label"  valeurs={valeurs} onChange={onChange} />
                  <Champ label="Stat 3 — Valeur"  cle="stat3_valeur" valeurs={valeurs} onChange={onChange} />
                  <Champ label="Stat 3 — Label"   cle="stat3_label"  valeurs={valeurs} onChange={onChange} />
                  <Champ label="Stat 4 — Valeur"  cle="stat4_valeur" valeurs={valeurs} onChange={onChange} />
                  <Champ label="Stat 4 — Label"   cle="stat4_label"  valeurs={valeurs} onChange={onChange} />
                </Section>

                <Section titre='Section "Pourquoi nous choisir" (4 arguments)'>
                  <Champ label="Argument 1 — Titre" cle="arg1_titre" valeurs={valeurs} onChange={onChange} />
                  <Champ label="Argument 1 — Texte" cle="arg1_texte" valeurs={valeurs} onChange={onChange} multiline />
                  <Champ label="Argument 2 — Titre" cle="arg2_titre" valeurs={valeurs} onChange={onChange} />
                  <Champ label="Argument 2 — Texte" cle="arg2_texte" valeurs={valeurs} onChange={onChange} multiline />
                  <Champ label="Argument 3 — Titre" cle="arg3_titre" valeurs={valeurs} onChange={onChange} />
                  <Champ label="Argument 3 — Texte" cle="arg3_texte" valeurs={valeurs} onChange={onChange} multiline />
                  <Champ label="Argument 4 — Titre" cle="arg4_titre" valeurs={valeurs} onChange={onChange} />
                  <Champ label="Argument 4 — Texte" cle="arg4_texte" valeurs={valeurs} onChange={onChange} multiline />
                </Section>

                <Section titre="Bandeau CTA final (bas de page accueil)">
                  <Champ label="Titre du bandeau" cle="accueil_cta_titre" valeurs={valeurs} onChange={onChange} />
                  <div className="md:col-span-2">
                    <Champ label="Texte du bandeau" cle="accueil_cta_texte" valeurs={valeurs} onChange={onChange} multiline />
                  </div>
                </Section>
              </div>
            )}

            {/* ================================================
                ONGLET À PROPOS
                ================================================ */}
            {ongletActif === 'apropos' && (
              <div className="space-y-8">
                <Section titre="Présentation de l'entreprise (4 paragraphes)">
                  <div className="md:col-span-2">
                    <Champ label="Paragraphe 1 — Présentation générale" cle="apropos_intro1" valeurs={valeurs} onChange={onChange} multiline />
                  </div>
                  <div className="md:col-span-2">
                    <Champ label="Paragraphe 2 — Origine du nom Hindo" cle="apropos_intro2" valeurs={valeurs} onChange={onChange} multiline />
                  </div>
                  <div className="md:col-span-2">
                    <Champ label="Paragraphe 3 — Mission" cle="apropos_intro3" valeurs={valeurs} onChange={onChange} multiline />
                  </div>
                  <div className="md:col-span-2">
                    <Champ label="Paragraphe 4 — L'équipe" cle="apropos_intro4" valeurs={valeurs} onChange={onChange} multiline />
                  </div>
                </Section>

                <Section titre="Mission & Vision">
                  <div className="md:col-span-2">
                    <Champ label="Mission (texte complet)" cle="apropos_mission" valeurs={valeurs} onChange={onChange} multiline />
                  </div>
                  <div className="md:col-span-2">
                    <Champ label="Vision (texte complet)" cle="apropos_vision" valeurs={valeurs} onChange={onChange} multiline />
                  </div>
                </Section>

                <Section titre="Nos Valeurs (4 valeurs)">
                  <Champ label="Valeur 1 — Titre" cle="valeur1_titre" valeurs={valeurs} onChange={onChange} />
                  <Champ label="Valeur 1 — Texte" cle="valeur1_texte" valeurs={valeurs} onChange={onChange} multiline />
                  <Champ label="Valeur 2 — Titre" cle="valeur2_titre" valeurs={valeurs} onChange={onChange} />
                  <Champ label="Valeur 2 — Texte" cle="valeur2_texte" valeurs={valeurs} onChange={onChange} multiline />
                  <Champ label="Valeur 3 — Titre" cle="valeur3_titre" valeurs={valeurs} onChange={onChange} />
                  <Champ label="Valeur 3 — Texte" cle="valeur3_texte" valeurs={valeurs} onChange={onChange} multiline />
                  <Champ label="Valeur 4 — Titre" cle="valeur4_titre" valeurs={valeurs} onChange={onChange} />
                  <Champ label="Valeur 4 — Texte" cle="valeur4_texte" valeurs={valeurs} onChange={onChange} multiline />
                </Section>

                <Section titre="Impact sociétal (2 paragraphes)">
                  <div className="md:col-span-2">
                    <Champ label="Paragraphe 1" cle="apropos_impact1" valeurs={valeurs} onChange={onChange} multiline />
                  </div>
                  <div className="md:col-span-2">
                    <Champ label="Paragraphe 2" cle="apropos_impact2" valeurs={valeurs} onChange={onChange} multiline />
                  </div>
                </Section>
              </div>
            )}

            {/* ================================================
                ONGLET CONTACT
                ================================================ */}
            {ongletActif === 'contact' && (
              <div className="space-y-8">
                <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl text-sm text-blue-700">
                  <strong>Note :</strong> Les coordonnées (email, téléphones, adresse) sont modifiables dans l'onglet <strong>Général</strong> et s'appliquent aussi sur la page Contact.
                </div>

                <Section titre="Horaires d'ouverture">
                  <Champ label="Lundi — Vendredi"  cle="contact_horaire_lv"  valeurs={valeurs} onChange={onChange} aide='ex: "08h — 18h"' />
                  <Champ label="Samedi"             cle="contact_horaire_sam" valeurs={valeurs} onChange={onChange} aide='ex: "09h — 14h"' />
                  <Champ label="Dimanche"           cle="contact_horaire_dim" valeurs={valeurs} onChange={onChange} aide='ex: "Fermé"' />
                </Section>
              </div>
            )}

          </div>
        )}

        {/* Bouton sauvegarder (fixe en bas) */}
        <div className="sticky bottom-0 bg-white border-t border-gray-100 -mx-4 px-4 py-4 md:-mx-6 md:px-6 shadow-lg rounded-b-2xl">
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm text-gray-400">
              Les modifications sont visibles sur le site dès la sauvegarde.
            </p>
            <button
              onClick={sauvegarder}
              disabled={saving || loading}
              className="btn-primary flex items-center gap-2 px-8 py-3 shrink-0"
            >
              {saving ? (
                <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Sauvegarde...</>
              ) : (
                <><HiSave size={18} /> Sauvegarder tout</>
              )}
            </button>
          </div>
        </div>

      </div>
    </AdminLayout>
  )
}

export default AdminContenu
