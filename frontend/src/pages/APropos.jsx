// ============================================================
// pages/APropos.jsx — Page "À propos" de Hindo Digital
// Texte officiel : présentation, mission, vision, valeurs, impact
// ============================================================

import { motion } from 'framer-motion'
import {
  HiLightBulb, HiEye, HiHeart, HiGlobe, HiUserGroup,
  HiOfficeBuilding, HiAcademicCap, HiHome
} from 'react-icons/hi'
import { FaHandshake } from 'react-icons/fa'
import SectionHeader from '../components/SectionHeader'
import { Link } from 'react-router-dom'
import { useContenu }      from '../context/ContenuContext'
import { useSiteSettings } from '../context/SiteSettingsContext'

// ---- Valeurs officielles de l'entreprise ----
const VALEURS = [
  {
    icon: <HiLightBulb size={28} />,
    titre: 'Innovation',
    texte: 'Nous cherchons constamment des solutions nouvelles et créatives pour répondre aux défis numériques de nos clients et de la société.',
  },
  {
    icon: <HiHeart size={28} />,
    titre: 'Proximité',
    texte: 'Inspirée du mot "Hindo" (résidence, lieu d\'origine), l\'entreprise met un point d\'honneur à être proche des populations qu\'elle sert.',
  },
  {
    icon: <HiEye size={28} />,
    titre: 'Excellence',
    texte: 'Des solutions complètes, durables et adaptées aux réalités locales, délivrées avec rigueur et professionnalisme.',
  },
  {
    icon: <FaHandshake size={26} />,
    titre: 'Confiance',
    texte: 'Une équipe jeune, dynamique et polyvalente qui se positionne comme un partenaire de confiance pour chaque client.',
  },
]

// ---- Public cible de Hindo Digital (depuis le cahier des charges) ----
const CIBLES = [
  {
    icon: <HiOfficeBuilding size={28} />,
    titre: 'PME & Entreprises',
    texte: 'Accompagnement dans la transformation digitale, la mise en place d\'infrastructures réseau fiables et la sécurisation des données.',
  },
  {
    icon: <HiHome size={28} />,
    titre: 'Particuliers',
    texte: 'Solutions numériques accessibles et de proximité pour les particuliers souhaitant bénéficier des services du numérique.',
  },
  {
    icon: <HiGlobe size={28} />,
    titre: 'Institutions',
    texte: 'Écoles, ONG, mairies et administrations publiques — Hindo Digital les accompagne dans leur modernisation numérique.',
  },
  {
    icon: <HiAcademicCap size={28} />,
    titre: 'Jeunes en formation',
    texte: 'Formations pratiques pour les jeunes souhaitant acquérir des compétences numériques et s\'insérer dans le marché du travail.',
  },
]

const APropos = () => {
  const { c }                                      = useContenu()
  const { teamImageUrl, teamImageTaille = 100 }    = useSiteSettings()
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
            À propos de nous
          </motion.h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            Découvrez qui nous sommes, ce qui nous anime et pourquoi Hindo Digital est votre partenaire numérique de confiance
          </p>
        </div>
      </section>

      {/* ====================================================
          SECTION PRÉSENTATION OFFICIELLE
          ==================================================== */}
      <section className="section bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">

            {/* Texte officiel de présentation */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="section-title text-left">Qui sommes-nous ?</h2>
              <div className="w-16 h-1 bg-primary rounded mb-6" />

              <div className="space-y-5 text-gray-600 leading-relaxed">
                <p>{c('apropos_intro1')}</p>
                <p>{c('apropos_intro2')}</p>
                <p>{c('apropos_intro3')}</p>
                <p>{c('apropos_intro4')}</p>
              </div>

              <div className="mt-8">
                <Link to="/contact" className="btn-primary inline-flex items-center gap-2">
                  Nous contacter
                </Link>
              </div>
            </motion.div>

            {/* Photo d'équipe OU placeholder */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              {teamImageUrl ? (
                <div
                  className="rounded-2xl overflow-hidden shadow-xl transition-all duration-500 mx-auto"
                  style={{ width: `${teamImageTaille}%` }}
                >
                  <img
                    src={teamImageUrl}
                    alt="Équipe Hindo Digital"
                    className="w-full h-full object-cover"
                    onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex' }}
                  />
                  {/* Fallback si l'image ne charge pas */}
                  <div style={{ display: 'none' }}
                    className="aspect-video bg-gradient-to-br from-primary to-secondary rounded-2xl
                               flex flex-col items-center justify-center p-10 text-center">
                    <div className="text-6xl mb-4">🇸🇳</div>
                    <p className="font-heading font-bold text-3xl text-white">Hindo Digital</p>
                    <p className="text-white/80 mt-2 text-lg">{c('general_adresse')}</p>
                  </div>
                  <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm
                                  text-white px-4 py-2 rounded-xl text-sm font-medium">
                    Équipe Hindo Digital — {c('general_adresse')}
                  </div>
                </div>
              ) : (
                <div className="aspect-video bg-gradient-to-br from-primary to-secondary rounded-2xl
                                flex flex-col items-center justify-center shadow-xl p-10 text-center">
                  <div className="text-6xl mb-4">🇸🇳</div>
                  <p className="font-heading font-bold text-3xl text-white">Hindo Digital</p>
                  <p className="text-white/80 mt-2 text-lg">{c('general_adresse')}</p>
                  <p className="text-white/60 text-sm mt-3 italic font-light">"{c('general_slogan')}"</p>
                </div>
              )}

              {/* Badges flottants */}
              <div className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-card p-4 text-center z-10">
                <div className="text-2xl font-bold text-primary font-heading">5+</div>
                <div className="text-xs text-gray-500">Ans d'expérience</div>
              </div>
              <div className="absolute -top-4 -right-4 bg-primary rounded-xl shadow-card p-4 text-center z-10">
                <div className="text-2xl font-bold text-white font-heading">80+</div>
                <div className="text-xs text-white/80">Projets réalisés</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ====================================================
          SECTION MISSION & VISION
          ==================================================== */}
      <section className="section bg-neutral">
        <div className="container-custom">
          <SectionHeader
            titre="Mission & Vision"
            sousTitre="Les fondements qui guident chacune de nos actions"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

            {/* Mission officielle */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="card border-l-4 border-primary"
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                  <HiLightBulb className="text-white" size={24} />
                </div>
                <h3 className="text-xl font-bold font-heading text-secondary">Notre Mission</h3>
              </div>
              <p className="text-gray-600 leading-relaxed text-base">{c('apropos_mission')}</p>
            </motion.div>

            {/* Vision */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="card border-l-4 border-secondary"
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center">
                  <HiEye className="text-white" size={24} />
                </div>
                <h3 className="text-xl font-bold font-heading text-secondary">Notre Vision</h3>
              </div>
              <p className="text-gray-600 leading-relaxed text-base">{c('apropos_vision')}</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ====================================================
          SECTION VALEURS
          ==================================================== */}
      <section className="section bg-white">
        <div className="container-custom">
          <SectionHeader
            titre="Nos Valeurs"
            sousTitre="Les principes qui guident chacune de nos actions au quotidien"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <HiLightBulb size={28} />, titre: c('valeur1_titre'), texte: c('valeur1_texte') },
              { icon: <HiHeart size={28} />,     titre: c('valeur2_titre'), texte: c('valeur2_texte') },
              { icon: <HiEye size={28} />,       titre: c('valeur3_titre'), texte: c('valeur3_texte') },
              { icon: <FaHandshake size={26} />, titre: c('valeur4_titre'), texte: c('valeur4_texte') },
            ].map((val, i) => (
              <motion.div
                key={val.titre}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="card text-center group hover:-translate-y-2 transition-transform duration-300"
              >
                <div className="w-14 h-14 bg-primary/10 group-hover:bg-primary rounded-xl
                                flex items-center justify-center mx-auto mb-4 transition-colors duration-300">
                  <span className="text-primary group-hover:text-white transition-colors duration-300">
                    {val.icon}
                  </span>
                </div>
                <h4 className="font-bold text-secondary font-heading mb-3">{val.titre}</h4>
                <p className="text-gray-500 text-sm leading-relaxed">{val.texte}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ====================================================
          SECTION PUBLIC CIBLE
          ==================================================== */}
      <section className="section bg-neutral">
        <div className="container-custom">
          <SectionHeader
            titre="Qui accompagnons-nous ?"
            sousTitre="Hindo Digital s'adresse à tous ceux qui souhaitent tirer parti du numérique"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {CIBLES.map((cible, i) => (
              <motion.div
                key={cible.titre}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="card flex flex-col items-center text-center"
              >
                <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mb-4 shadow-md">
                  <span className="text-white">{cible.icon}</span>
                </div>
                <h4 className="font-bold text-secondary font-heading mb-3">{cible.titre}</h4>
                <p className="text-gray-500 text-sm leading-relaxed">{cible.texte}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ====================================================
          SECTION IMPORTANCE / IMPACT SOCIÉTAL
          ==================================================== */}
      <section className="section bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">

            {/* Texte impact */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="section-title text-left">Notre importance dans la société</h2>
              <div className="w-16 h-1 bg-primary rounded mb-6" />
              <div className="space-y-5 text-gray-600 leading-relaxed">
                <p>{c('apropos_impact1')}</p>
                <p>{c('apropos_impact2')}</p>
                <p>
                  Notre approche de <strong className="text-secondary">proximité et d'accessibilité</strong>{' '}
                  nous permet de toucher des populations souvent éloignées des services technologiques,
                  fidèles à notre nom : <em className="text-primary">"Hindo"</em> — être là où vous êtes.
                </p>
              </div>
            </motion.div>

            {/* Chiffres d'impact */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="grid grid-cols-2 gap-4"
            >
              {[
                { valeur: '50+',  label: 'Clients accompagnés',      bg: 'bg-primary'   },
                { valeur: '80+',  label: 'Projets livrés',           bg: 'bg-secondary' },
                { valeur: '5+',   label: "Années d'expérience",      bg: 'bg-secondary' },
                { valeur: '4',    label: 'Domaines d\'intervention', bg: 'bg-primary'   },
              ].map((item) => (
                <div
                  key={item.label}
                  className={`${item.bg} rounded-2xl p-6 text-center text-white`}
                >
                  <div className="text-4xl font-bold font-heading mb-2">{item.valeur}</div>
                  <div className="text-sm text-white/80">{item.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ====================================================
          SECTION CTA
          ==================================================== */}
      <section className="gradient-hero py-20">
        <div className="container-custom text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <HiUserGroup className="mx-auto mb-4" size={48} />
            <h2 className="text-3xl md:text-4xl font-bold font-heading mb-6">
              Rejoignez nos clients satisfaits
            </h2>
            <p className="text-white/80 text-lg leading-relaxed max-w-2xl mx-auto mb-8">
              Que vous soyez une PME, une institution, un particulier ou un jeune en quête de formation —
              Hindo Digital est votre partenaire numérique de proximité au Sénégal.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 bg-white text-primary font-bold
                         px-8 py-4 rounded-lg hover:bg-gray-100 transition-colors text-lg"
            >
              Nous contacter
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  )
}

export default APropos
