// ============================================================
// pages/Accueil.jsx — Page d'accueil de Hindo Digital
// Données réelles : services, coordonnées, arguments de vente
// ============================================================

import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  HiUsers, HiLightBulb, HiClipboardList, HiStar, HiArrowRight,
  HiShieldCheck, HiSupport
} from 'react-icons/hi'
import { FaWhatsapp } from 'react-icons/fa'

import SectionHeader    from '../components/SectionHeader'
import ServiceCard      from '../components/ServiceCard'
import StatCard         from '../components/StatCard'
import LoadingSpinner   from '../components/LoadingSpinner'
import useFetch          from '../hooks/useFetch'
import useFetchRealtime   from '../hooks/useFetchRealtime'
import { getServices }    from '../services/servicesApi'
import { getTemoignages } from '../services/contactApi'
import { useContenu }      from '../context/ContenuContext'
import { useSiteSettings } from '../context/SiteSettingsContext'

// ---- Chiffres clés réels ----
const STATS = [
  { valeur: '50+',  label: 'Clients satisfaits',   icon: <HiUsers size={22} />       },
  { valeur: '80+',  label: 'Projets réalisés',      icon: <HiClipboardList size={22} /> },
  { valeur: '5+',   label: "Années d'expérience",   icon: <HiLightBulb size={22} />   },
  { valeur: '24/7', label: 'Support disponible',    icon: <HiSupport size={22} />     },
]

// ---- Services fallback (d'après les visuels Hindo Digital) ----
const SERVICES_DEFAUT = [
  { id:1, titre:'Réseaux & Systèmes Informatiques',      description:'Infrastructure réseau, administration système, sécurité informatique et Cloud & Sauvegarde.', icone:'wifi' },
  { id:2, titre:'Vidéosurveillance & Monitoring',        description:'Solutions de vidéosurveillance IP HD et monitoring intelligent pour la sécurité de vos locaux.', icone:'shield' },
  { id:3, titre:'Transformation Digitale & Innovation',  description:'Développement Web & Mobile, Intelligence Artificielle et Big Data pour votre croissance numérique.', icone:'academic' },
  { id:4, titre:'Formation & Initiation en Info',        description:'Ateliers et formations professionnelles en informatique — initiation au numérique pour tous.', icone:'academic' },
  { id:5, titre:'Infographie & Communication Visuelle',  description:'Création graphique, identité visuelle et supports de communication pour renforcer votre image.', icone:'color' },
]

// ---- Arguments "Pourquoi nous choisir" (image 3) ----
const ARGUMENTS = [
  { titre: 'Expertise technique',    desc: 'Couvrant tous les domaines IT : réseaux, sécurité, développement, formation et design.', icon: <HiLightBulb size={22} /> },
  { titre: 'Solutions sur mesure',   desc: 'Adaptées aux besoins des entreprises, institutions et particuliers.', icon: <HiClipboardList size={22} /> },
  { titre: 'Support 24/7',           desc: 'Maintenance proactive et assistance technique disponible en permanence.', icon: <HiSupport size={22} /> },
  { titre: 'Approche pédagogique',   desc: 'Pour l\'autonomisation de nos clients — nous vous formons à maîtriser vos outils.', icon: <HiUsers size={22} /> },
]

const Accueil = () => {
  const { data: services, loading: loadingServices } = useFetchRealtime(getServices, 'services')
  const { data: temoignages, loading: loadingTemo }  = useFetchRealtime(getTemoignages, 'temoignages')
  const { c }                                    = useContenu()
  const { heroImageUrl, heroImageTaille = 100 }  = useSiteSettings()

  // Stats et arguments construits dynamiquement depuis le CMS
  const stats = [
    { valeur: c('stat1_valeur'), label: c('stat1_label'), icon: <HiUsers size={22} />         },
    { valeur: c('stat2_valeur'), label: c('stat2_label'), icon: <HiClipboardList size={22} />  },
    { valeur: c('stat3_valeur'), label: c('stat3_label'), icon: <HiLightBulb size={22} />      },
    { valeur: c('stat4_valeur'), label: c('stat4_label'), icon: <HiSupport size={22} />        },
  ]
  const arguments_ = [
    { titre: c('arg1_titre'), desc: c('arg1_texte'), icon: <HiLightBulb size={22} />    },
    { titre: c('arg2_titre'), desc: c('arg2_texte'), icon: <HiClipboardList size={22} /> },
    { titre: c('arg3_titre'), desc: c('arg3_texte'), icon: <HiSupport size={22} />       },
    { titre: c('arg4_titre'), desc: c('arg4_texte'), icon: <HiUsers size={22} />         },
  ]

  return (
    <>
      {/* ====================================================
          HERO SECTION
          ==================================================== */}
      <section className="relative min-h-screen gradient-hero flex items-center overflow-hidden">
        {/* Éléments décoratifs de fond */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 right-20 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-10 w-96 h-96 bg-white rounded-full blur-3xl" />
        </div>

        <div className="container-custom relative z-10 py-24 md:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* ---- COLONNE GAUCHE : Image ---- */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              className="relative flex justify-center"
            >
              {heroImageUrl ? (
                /* Image uploadée — taille contrôlée par l'admin */
                <div
                  className="relative transition-all duration-500"
                  style={{ width: `${heroImageTaille}%`, maxWidth: '100%' }}
                >
                  <img
                    src={heroImageUrl}
                    alt="Hindo Digital"
                    className="w-full h-auto rounded-2xl shadow-2xl object-cover"
                  />
                  {/* Badge flottant */}
                  <div className="absolute -bottom-4 -right-4 bg-white rounded-xl shadow-lg px-4 py-3 text-center">
                    <div className="text-2xl font-bold text-primary font-heading">5+</div>
                    <div className="text-xs text-gray-500">Ans d'expérience</div>
                  </div>
                  <div className="absolute -top-4 -left-4 bg-primary rounded-xl shadow-lg px-4 py-3 text-center">
                    <div className="text-2xl font-bold text-white font-heading">80+</div>
                    <div className="text-xs text-white/80">Projets réalisés</div>
                  </div>
                </div>
              ) : (
                /* Placeholder si pas d'image */
                <div className="relative w-full max-w-lg aspect-square bg-white/10 border-2 border-white/20
                                rounded-2xl flex flex-col items-center justify-center gap-4 backdrop-blur-sm">
                  <div className="text-8xl">🇸🇳</div>
                  <p className="text-white font-heading font-bold text-2xl">Hindo Digital</p>
                  <p className="text-white/70 text-sm">Ziguinchor, Sénégal</p>
                  {/* Indication admin */}
                  <p className="text-white/40 text-xs text-center px-4 mt-2">
                    Ajoutez une image depuis<br/>Admin → Logo & Paramètres
                  </p>
                  {/* Badges flottants */}
                  <div className="absolute -bottom-4 -right-4 bg-white rounded-xl shadow-lg px-4 py-3 text-center">
                    <div className="text-2xl font-bold text-primary font-heading">5+</div>
                    <div className="text-xs text-gray-500">Ans d'expérience</div>
                  </div>
                  <div className="absolute -top-4 -left-4 bg-primary rounded-xl shadow-lg px-4 py-3 text-center">
                    <div className="text-2xl font-bold text-white font-heading">80+</div>
                    <div className="text-xs text-white/80">Projets réalisés</div>
                  </div>
                </div>
              )}
            </motion.div>

            {/* ---- COLONNE DROITE : Texte ---- */}
            <div>
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 bg-white/10 border border-white/20
                           text-white px-4 py-2 rounded-full text-sm font-medium mb-6"
              >
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                {c('hero_badge')}
              </motion.div>

              {/* Titre */}
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-white font-heading leading-tight mb-4"
              >
                {c('hero_titre')}
              </motion.h1>

              {/* Slogan */}
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-xl md:text-2xl text-white/90 font-heading font-light mb-5 uppercase tracking-wide"
              >
                {c('hero_slogan')}
              </motion.p>

              {/* Sous-titre */}
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-white/70 text-base leading-relaxed mb-8"
              >
                {c('hero_sous_titre')}
              </motion.p>

              {/* CTA buttons */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex flex-wrap gap-3"
              >
                <Link to="/contact" className="btn-primary flex items-center gap-2">
                  {c('hero_cta_principal')} <HiArrowRight />
                </Link>
                <a href={`https://wa.me/${c('general_whatsapp')?.replace(/\D/g,'') || '221764043744'}`}
                  target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white
                             px-5 py-3 rounded-lg font-semibold transition-colors">
                  <FaWhatsapp size={18} /> WhatsApp
                </a>
                <Link to="/services"
                  className="btn-outline border-white text-white hover:bg-white hover:text-primary">
                  {c('hero_cta_secondaire')}
                </Link>
              </motion.div>

              {/* Téléphones */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="mt-6 flex flex-wrap gap-3"
              >
                {[c('general_tel1'), c('general_tel2'), c('general_tel3')].filter(Boolean).map((tel) => (
                  <a key={tel} href={`tel:${tel.replace(/\s/g,'')}`}
                    className="text-white/60 hover:text-white text-sm flex items-center gap-1 transition-colors">
                    📞 {tel}
                  </a>
                ))}
              </motion.div>
            </div>

          </div>
        </div>

        {/* Vague de transition */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="white" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,80L1440,20L1440,80L0,80Z" />
          </svg>
        </div>
      </section>

      {/* ====================================================
          SECTION NOS DOMAINES D'INTERVENTION
          ==================================================== */}
      <section className="section bg-white">
        <div className="container-custom">
          <SectionHeader
            titre="Nos Domaines d'Intervention"
            sousTitre="Des solutions numériques complètes pour accompagner votre transformation digitale"
          />

          {loadingServices ? (
            <LoadingSpinner />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(services || SERVICES_DEFAUT).map((service, i) => (
                <ServiceCard key={service.id} service={service} index={i} />
              ))}
            </div>
          )}

          <div className="text-center mt-10">
            <Link to="/services" className="btn-outline">
              Voir tous nos services
            </Link>
          </div>
        </div>
      </section>

      {/* ====================================================
          SECTION CHIFFRES CLÉS
          ==================================================== */}
      <section className="section bg-neutral">
        <div className="container-custom">
          <SectionHeader
            titre="Hindo Digital en chiffres"
            sousTitre="Notre engagement se mesure à travers les résultats obtenus pour nos clients"
          />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <StatCard key={stat.label} {...stat} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ====================================================
          SECTION POURQUOI NOUS CHOISIR (d'après image 3)
          ==================================================== */}
      <section className="section bg-white">
        <div className="container-custom">
          <SectionHeader
            titre="Pourquoi choisir Hindo Digital ?"
            sousTitre="Contactez Hindo Digital pour une consultation personnalisée !"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {arguments_.map((arg, i) => (
              <motion.div
                key={arg.titre}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="card text-center group hover:-translate-y-2 transition-transform duration-300"
              >
                <div className="w-14 h-14 bg-primary/10 group-hover:bg-primary rounded-xl
                                flex items-center justify-center mx-auto mb-4 transition-colors duration-300">
                  <span className="text-primary group-hover:text-white transition-colors duration-300">
                    {arg.icon}
                  </span>
                </div>
                <h4 className="font-bold text-secondary font-heading mb-3">{arg.titre}</h4>
                <p className="text-gray-500 text-sm leading-relaxed">{arg.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Besoin d'un projet — bandeau */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-primary/5 border border-primary/20 rounded-2xl p-8 flex flex-col md:flex-row
                       items-center justify-between gap-6 text-center md:text-left"
          >
            <div>
              <h3 className="text-2xl font-bold font-heading text-secondary">Besoin d'un projet ?</h3>
              <p className="text-gray-500 mt-1">
                Contactez <strong className="text-primary">Hindo Digital</strong> pour une consultation personnalisée !
              </p>
            </div>
            <div className="flex flex-wrap gap-3 shrink-0">
              <Link to="/contact" className="btn-primary whitespace-nowrap">
                Nous contacter
              </Link>
              <a href="https://wa.me/221788494363" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white
                           px-6 py-3 rounded-lg font-semibold transition-colors whitespace-nowrap">
                <FaWhatsapp /> WhatsApp
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ====================================================
          SECTION TÉMOIGNAGES
          ==================================================== */}
      <section className="section bg-neutral">
        <div className="container-custom">
          <SectionHeader
            titre="Ce que disent nos clients"
            sousTitre="La satisfaction de nos clients est notre meilleure récompense"
          />

          {loadingTemo ? (
            <LoadingSpinner />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(temoignages || TEMOIGNAGES_DEFAUT).map((temo, i) => (
                <TemoignageCard key={temo.id || i} temoignage={temo} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ====================================================
          SECTION CTA FINALE
          ==================================================== */}
      <section className="gradient-hero py-20">
        <div className="container-custom text-center text-white">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold font-heading mb-4"
          >
            {c('accueil_cta_titre')}
          </motion.h2>
          <p className="text-white/80 text-lg mb-4 max-w-xl mx-auto">
            {c('accueil_cta_texte')}
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-8 text-white/70 text-sm">
            {[c('general_tel1'), c('general_tel2'), c('general_tel3')].filter(Boolean).map(tel => (
              <a key={tel} href={`tel:${tel.replace(/\s/g,'')}`} className="hover:text-white transition-colors">📞 {tel}</a>
            ))}
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/contact"
              className="inline-flex items-center gap-2 bg-white text-primary font-bold
                         px-8 py-4 rounded-lg hover:bg-gray-100 transition-colors text-lg">
              Démarrer un projet <HiArrowRight />
            </Link>
            <a href="https://wa.me/221788494363" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white
                         font-bold px-8 py-4 rounded-lg transition-colors text-lg">
              <FaWhatsapp size={22} /> Écrire sur WhatsApp
            </a>
          </div>
        </div>
      </section>
    </>
  )
}

// ---- Données témoignages de secours ----
const TEMOIGNAGES_DEFAUT = [
  { id:1, nom:'Mamadou Diallo',  poste:'Directeur, PME Ziguinchor',      texte:"Hindo Digital a complètement transformé notre infrastructure réseau. Équipe professionnelle et résultats au-delà de nos attentes !", note:5 },
  { id:2, nom:'Fatou Mbaye',    poste:'Gérante, Boutique Ziguinchor',    texte:"Notre site e-commerce a été livré dans les délais avec une qualité remarquable. Les ventes ont augmenté de 40% !", note:5 },
  { id:3, nom:'Ibrahima Sow',   poste:'Responsable IT, ONG Ziguinchor',  texte:"Les formations Hindo Digital ont boosté les compétences numériques de mon équipe. Formateurs très pédagogues.", note:5 },
]

// ---- Sous-composant carte témoignage ----
const TemoignageCard = ({ temoignage, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    className="card border border-gray-100"
  >
    <div className="flex gap-1 mb-4">
      {Array.from({ length: temoignage.note || 5 }).map((_, i) => (
        <HiStar key={i} className="text-yellow-400" size={18} />
      ))}
    </div>
    <p className="text-gray-600 text-sm leading-relaxed mb-5 italic">
      "{temoignage.texte}"
    </p>
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
        <span className="text-primary font-bold text-sm">
          {temoignage.nom?.charAt(0).toUpperCase()}
        </span>
      </div>
      <div>
        <p className="font-semibold text-secondary text-sm">{temoignage.nom}</p>
        <p className="text-gray-400 text-xs">{temoignage.poste}</p>
      </div>
    </div>
  </motion.div>
)

export default Accueil
