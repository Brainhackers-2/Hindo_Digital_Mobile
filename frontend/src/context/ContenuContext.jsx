// ============================================================
// context/ContenuContext.jsx — CMS : contenu dynamique de toutes les pages
// Charge les textes depuis l'API Laravel et les rend disponibles
// partout dans l'application via le hook useContenu()
// ============================================================

import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import api from '../services/api'

// Valeurs par défaut — utilisées si l'API est indisponible
const DEFAUTS = {
  general_nom:          'Hindo Digital',
  general_slogan:       'Le Numérique à votre porte',
  general_adresse:      'Ziguinchor, Sénégal',
  general_email:        'hindodigitale@gmail.com',
  general_tel1:         '+221 76 404 37 44',
  general_tel2:         '+221 78 849 43 63',
  general_tel3:         '+221 78 121 85 95',
  general_site:         'hindodigitale.com',
  general_facebook:     'https://facebook.com/hindodigitale',
  general_whatsapp:     'https://wa.me/221764043744',
  general_linkedin:     'https://linkedin.com/company/hindodigital',
  general_instagram:    'https://instagram.com/hindodigitale',
  hero_badge:           'Entreprise numérique sénégalaise — Ziguinchor',
  hero_titre:           'Hindo Digital',
  hero_slogan:          'Le Numérique à votre porte',
  hero_sous_titre:      'Réseaux, vidéosurveillance, développement web & mobile, formation informatique et infographie — des solutions numériques complètes pour les entreprises et particuliers.',
  hero_cta_principal:   'Consultation gratuite',
  hero_cta_secondaire:  'Nos services',
  stat1_valeur: '50+', stat1_label: 'Clients satisfaits',
  stat2_valeur: '80+', stat2_label: 'Projets réalisés',
  stat3_valeur: '5+',  stat3_label: "Années d'expérience",
  stat4_valeur: '24/7',stat4_label: 'Support disponible',
  arg1_titre: 'Expertise technique',   arg1_texte: 'Couvrant tous les domaines IT : réseaux, sécurité, développement, formation et design.',
  arg2_titre: 'Solutions sur mesure',  arg2_texte: 'Adaptées aux besoins des entreprises, institutions et particuliers.',
  arg3_titre: 'Support 24/7',          arg3_texte: 'Maintenance proactive et assistance technique disponible en permanence.',
  arg4_titre: 'Approche pédagogique',  arg4_texte: "Pour l'autonomisation de nos clients — nous vous formons à maîtriser vos outils.",
  accueil_cta_titre: 'Prêt à passer au numérique ?',
  accueil_cta_texte: "Contactez-nous dès aujourd'hui et découvrez comment Hindo Digital peut transformer votre activité.",
  apropos_intro1:   "Hindo Digital est une startup sénégalaise spécialisée dans les services numériques, offrant des solutions innovantes en réseaux informatiques, sécurité, développement web et mobile, ainsi que formation en informatique.",
  apropos_intro2:   "Inspirée du mot \"Hindo\", qui signifie résidence ou lieu d'origine, l'entreprise met un point d'honneur à rapprocher la technologie des populations en proposant des services accessibles, adaptés et de proximité.",
  apropos_intro3:   "Notre mission est de démocratiser l'accès aux technologies numériques en accompagnant les entreprises, les institutions et les particuliers dans leur transformation digitale, tout en garantissant la sécurité de leurs infrastructures et de leurs données.",
  apropos_intro4:   "Grâce à une équipe jeune, dynamique et polyvalente, Hindo Digital se positionne comme un partenaire de confiance, capable d'apporter des solutions complètes et durables adaptées aux réalités locales.",
  apropos_mission:  "Démocratiser l'accès aux technologies numériques en accompagnant les entreprises, les institutions et les particuliers dans leur transformation digitale, tout en garantissant la sécurité de leurs infrastructures et de leurs données.",
  apropos_vision:   "Devenir le partenaire numérique de référence au Sénégal, en proposant des services accessibles, adaptés et de proximité. Nous aspirons à construire un écosystème digital inclusif qui propulse le développement économique local et régional.",
  apropos_impact1:  "Dans un contexte où la transformation numérique est devenue un enjeu majeur pour le développement économique, Hindo Digital joue un rôle clé en rendant le numérique accessible à tous les segments de la société sénégalaise.",
  apropos_impact2:  "En formant les jeunes aux métiers du numérique, en accompagnant les PME dans leur digitalisation et en sécurisant les infrastructures des institutions, nous contribuons directement à la création d'emplois et à la compétitivité des acteurs économiques locaux.",
  valeur1_titre: 'Innovation',  valeur1_texte: 'Nous cherchons constamment des solutions nouvelles et créatives pour répondre aux défis numériques de nos clients et de la société.',
  valeur2_titre: 'Proximité',   valeur2_texte: "Inspirée du mot \"Hindo\" (résidence, lieu d'origine), l'entreprise met un point d'honneur à être proche des populations qu'elle sert.",
  valeur3_titre: 'Excellence',  valeur3_texte: 'Des solutions complètes, durables et adaptées aux réalités locales, délivrées avec rigueur et professionnalisme.',
  valeur4_titre: 'Confiance',   valeur4_texte: 'Une équipe jeune, dynamique et polyvalente qui se positionne comme un partenaire de confiance pour chaque client.',
  contact_horaire_lv:  '08h — 18h',
  contact_horaire_sam: '09h — 14h',
  contact_horaire_dim: 'Fermé',
}

const ContenuContext = createContext(null)

export const ContenuProvider = ({ children }) => {
  const [contenu, setContenu]   = useState(DEFAUTS)
  const [loading, setLoading]   = useState(true)

  const charger = useCallback(async () => {
    try {
      const res = await api.get('/contenu')
      // Fusionne les valeurs de l'API avec les défauts (protection si clé manquante)
      setContenu({ ...DEFAUTS, ...res.data?.data })
    } catch {
      setContenu(DEFAUTS)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { charger() }, [charger])

  // Raccourci : c('hero_titre') retourne la valeur de la clé
  const c = (cle) => contenu[cle] ?? DEFAUTS[cle] ?? ''

  return (
    <ContenuContext.Provider value={{ contenu, loading, c, rafraichir: charger }}>
      {children}
    </ContenuContext.Provider>
  )
}

export const useContenu = () => {
  const ctx = useContext(ContenuContext)
  if (!ctx) throw new Error('useContenu doit être utilisé dans ContenuProvider')
  return ctx
}

export { DEFAUTS }
