// ============================================================
// context/ContenuContext.jsx — Contenu dynamique via Supabase
// ============================================================

import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

const DEFAUTS = {
  general_nom: 'Hindo Digital', general_slogan: 'Le Numérique à votre porte',
  general_adresse: 'Ziguinchor, Sénégal', general_email: 'hindodigitale@gmail.com',
  general_tel1: '+221 76 404 37 44', general_tel2: '+221 78 849 43 63', general_tel3: '+221 78 121 85 95',
  general_site: 'hindodigitale.com',
  general_facebook: 'https://facebook.com/hindodigitale', general_whatsapp: 'https://wa.me/221788494363',
  general_tiktok: 'https://tiktok.com/@hindodigitale', general_instagram: 'https://instagram.com/hindodigitale',
  hero_badge: 'Entreprise numérique sénégalaise — Ziguinchor',
  hero_titre: 'Hindo Digital', hero_slogan: 'Le Numérique à votre porte',
  hero_sous_titre: 'Réseaux, vidéosurveillance, développement web & mobile, formation informatique et infographie.',
  hero_cta_principal: 'Consultation gratuite', hero_cta_secondaire: 'Nos services',
  stat1_valeur: '50+', stat1_label: 'Clients satisfaits',
  stat2_valeur: '80+', stat2_label: 'Projets réalisés',
  stat3_valeur: '5+',  stat3_label: "Années d'expérience",
  stat4_valeur: '24/7',stat4_label: 'Support disponible',
  arg1_titre: 'Expertise technique',   arg1_texte: 'Couvrant tous les domaines IT.',
  arg2_titre: 'Solutions sur mesure',  arg2_texte: 'Adaptées aux besoins de nos clients.',
  arg3_titre: 'Support 24/7',          arg3_texte: 'Maintenance proactive disponible en permanence.',
  arg4_titre: 'Approche pédagogique',  arg4_texte: "Pour l'autonomisation de nos clients.",
  accueil_cta_titre: 'Prêt à passer au numérique ?',
  accueil_cta_texte: "Contactez-nous et découvrez comment Hindo Digital peut transformer votre activité.",
  apropos_intro1: "Hindo Digital est une startup sénégalaise spécialisée dans les services numériques.",
  apropos_intro2: "Inspirée du mot \"Hindo\", qui signifie résidence ou lieu d'origine.",
  apropos_intro3: "Notre mission est de démocratiser l'accès aux technologies numériques.",
  apropos_intro4: "Une équipe jeune, dynamique et polyvalente, partenaire de confiance.",
  apropos_mission: "Démocratiser l'accès aux technologies numériques en accompagnant les entreprises, les institutions et les particuliers.",
  apropos_vision: "Devenir le partenaire numérique de référence au Sénégal.",
  apropos_impact1: "Hindo Digital joue un rôle clé en rendant le numérique accessible à tous.",
  apropos_impact2: "En formant les jeunes aux métiers du numérique et en accompagnant les PME.",
  valeur1_titre: 'Innovation',  valeur1_texte: 'Solutions nouvelles et créatives.',
  valeur2_titre: 'Proximité',   valeur2_texte: "Proche des populations qu'elle sert.",
  valeur3_titre: 'Excellence',  valeur3_texte: 'Solutions durables et adaptées.',
  valeur4_titre: 'Confiance',   valeur4_texte: 'Partenaire de confiance pour chaque client.',
  contact_horaire_lv: '08h — 18h', contact_horaire_sam: '09h — 14h', contact_horaire_dim: 'Fermé',
}

const ContenuContext = createContext(null)

export const ContenuProvider = ({ children }) => {
  const [contenu, setContenu] = useState(DEFAUTS)
  const [loading, setLoading] = useState(true)

  const charger = useCallback(async () => {
    try {
      const { data } = await supabase.from('settings').select('key, value')
      const map = {}
      ;(data || []).forEach(row => { map[row.key] = row.value })
      setContenu({ ...DEFAUTS, ...map })
    } catch {
      setContenu(DEFAUTS)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    charger()

    // Temps réel Supabase : recharge automatiquement quand la table settings change
    // Fonctionne sur tous les onglets et appareils connectés
    const canal = supabase
      .channel('settings-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'settings' }, () => {
        charger()
      })
      .subscribe()

    return () => { supabase.removeChannel(canal) }
  }, [charger])

  const c = (cle) => contenu[cle] ?? DEFAUTS[cle] ?? ''

  return (
    <ContenuContext.Provider value={{ contenu, loading, c, rafraichir: charger }}>
      {children}
    </ContenuContext.Provider>
  )
}

export const useContenu = () => {
  const ctx = useContext(ContenuContext)
  if (!ctx) throw new Error('useContenu doit être dans ContenuProvider')
  return ctx
}

export { DEFAUTS }
