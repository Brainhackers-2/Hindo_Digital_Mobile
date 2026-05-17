// ============================================================
// pages/Services.jsx — Page des 5 services officiels Hindo Digital
// D'après le cahier des charges : Réseaux, Sécurité, Dev Web/Mobile,
// Formation informatique, Infographie
// ============================================================

import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  HiWifi, HiShieldCheck, HiCode, HiAcademicCap, HiColorSwatch,
  HiCheckCircle, HiArrowRight, HiPhone
} from 'react-icons/hi'
import { FaWhatsapp } from 'react-icons/fa'

import SectionHeader  from '../components/SectionHeader'
import LoadingSpinner from '../components/LoadingSpinner'
import useFetchRealtime from '../hooks/useFetchRealtime'
import { getServices }   from '../services/servicesApi'
import { useContenu }    from '../context/ContenuContext'

// Correspondance icône → composant (identique aux seeders)
const ICONES_MAP = {
  wifi:      <HiWifi size={44} />,
  shield:    <HiShieldCheck size={44} />,
  code:      <HiCode size={44} />,
  academic:  <HiAcademicCap size={44} />,
  color:     <HiColorSwatch size={44} />,
  lightbulb: <HiCode size={44} />,
}

// ---- 5 services officiels du cahier des charges ----
const SERVICES_OFFICIELS = [
  {
    id: 1,
    titre: 'Réseaux & Systèmes',
    icone: 'wifi',
    couleur: 'from-blue-50 to-blue-100',
    couleurHover: 'hover:from-primary hover:to-primary-dark',
    description: 'Installation, configuration et maintenance de réseaux informatiques locaux et distants, adaptés à vos besoins professionnels.',
    details: [
      'Conception d\'architectures réseau LAN/WAN',
      'Installation de switches, routeurs et bornes Wi-Fi',
      'Câblage structuré et fibre optique',
      'Administration et supervision réseau',
      'Cloud & Sauvegarde sécurisée des données',
      'Sécurité informatique et pare-feu',
    ],
  },
  {
    id: 2,
    titre: 'Sécurité & Vidéosurveillance',
    icone: 'shield',
    couleur: 'from-red-50 to-red-100',
    couleurHover: 'hover:from-primary hover:to-primary-dark',
    description: 'Mise en place de systèmes de surveillance et de protection pour sécuriser vos locaux professionnels et résidentiels.',
    details: [
      'Installation de caméras IP HD (intérieur & extérieur)',
      'Enregistrement sur DVR/NVR',
      'Surveillance et monitoring à distance via smartphone',
      'Systèmes d\'alarme anti-intrusion',
      'Contrôle d\'accès biométrique',
      'Maintenance préventive des équipements',
    ],
  },
  {
    id: 3,
    titre: 'Développement Web & Mobile',
    icone: 'code',
    couleur: 'from-green-50 to-green-100',
    couleurHover: 'hover:from-primary hover:to-primary-dark',
    description: 'Création de sites web, d\'applications mobiles et de plateformes digitales sur mesure pour valoriser votre présence en ligne.',
    details: [
      'Sites vitrines professionnels et responsives',
      'Boutiques en ligne (e-commerce)',
      'Applications mobiles Android & iOS',
      'Applications web métiers sur mesure',
      'Intégration de paiement mobile (Orange Money, Wave)',
      'Maintenance et hébergement web',
    ],
  },
  {
    id: 4,
    titre: 'Formation Informatique',
    icone: 'academic',
    couleur: 'from-yellow-50 to-yellow-100',
    couleurHover: 'hover:from-primary hover:to-primary-dark',
    description: 'Formations pratiques en informatique pour tous les niveaux, destinées aux particuliers, entreprises et institutions.',
    details: [
      'Bureautique (Word, Excel, PowerPoint, Outlook)',
      'Initiation au numérique pour débutants',
      'Réseaux informatiques et sécurité',
      'Développement web (HTML, CSS, JavaScript)',
      'Administration système Linux & Windows',
      'Formations personnalisées en entreprise',
    ],
  },
  {
    id: 5,
    titre: 'Infographie',
    icone: 'color',
    couleur: 'from-purple-50 to-purple-100',
    couleurHover: 'hover:from-primary hover:to-primary-dark',
    description: 'Conception graphique et communication visuelle professionnelle pour construire et renforcer l\'identité de votre marque.',
    details: [
      'Création de logo et identité visuelle',
      'Charte graphique complète',
      'Flyers, affiches, kakémonos et banners',
      'Visuels pour réseaux sociaux',
      'Maquettes UI/UX et prototypage',
      'Cartes de visite et supports print',
    ],
  },
]

const Services = () => {
  const { c } = useContenu()
  const { data: services, loading, error } = useFetchRealtime(getServices, 'services')

  // Fusionne les données API avec les détails étendus locaux
  const liste = (services || SERVICES_OFFICIELS).map((srv) => {
    const local = SERVICES_OFFICIELS.find((s) => s.id === srv.id)
    return local ? { ...srv, details: local.details, couleur: local.couleur } : srv
  })

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
            Nos Services
          </motion.h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            Des solutions numériques accessibles, adaptées et de proximité — pour les entreprises,
            institutions et particuliers
          </p>
        </div>
      </section>

      {/* ====================================================
          GRILLE APERÇU DES 5 SERVICES
          ==================================================== */}
      <section className="section bg-white">
        <div className="container-custom">
          <SectionHeader
            titre="Nos 5 domaines d'expertise"
            sousTitre="Chaque service est pensé pour répondre précisément à vos besoins numériques"
          />

          {loading && <LoadingSpinner />}
          {error && (
            <p className="text-center text-red-400 text-sm mb-8">
              Chargement depuis les données locales.
            </p>
          )}

          {/* Aperçu rapide — 5 cards en grille */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {liste.map((service, i) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="bg-white rounded-2xl shadow-card hover:shadow-card-hover overflow-hidden
                           group hover:-translate-y-2 transition-all duration-300"
              >
                {/* Image si disponible, sinon bandeau icône */}
                {service.image_url ? (
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={service.image_url}
                      alt={service.titre}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                ) : (
                  <div className="aspect-video bg-gradient-to-br from-primary/10 to-secondary/10
                                  group-hover:from-primary group-hover:to-secondary
                                  flex items-center justify-center transition-all duration-500">
                    <span className="text-primary group-hover:text-white transition-colors duration-500">
                      {ICONES_MAP[service.icone] || <HiCode size={36} />}
                    </span>
                  </div>
                )}

                <div className="p-5">
                  <div className="text-xs font-semibold text-primary/60 mb-1 uppercase tracking-widest">
                    Service {String(i + 1).padStart(2, '0')}
                  </div>
                  <h3 className="font-bold text-lg text-secondary font-heading mb-2 group-hover:text-primary transition-colors">
                    {service.titre}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-4">
                    {service.description}
                  </p>
                  <Link to="/contact" className="inline-flex items-center gap-1.5 text-primary font-semibold text-sm hover:gap-2.5 transition-all">
                    Demander un devis <HiArrowRight size={14} />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>

          {/* ---- Détail complet de chaque service ---- */}
          <div className="space-y-20">
            {liste.map((service, i) => (
              <motion.div
                key={`detail-${service.id}`}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${i % 2 === 1 ? '' : ''}`}
              >
                {/* Visuel — image réelle ou bandeau couleur */}
                <div className={i % 2 === 1 ? 'lg:order-2' : ''}>
                  {service.image_url ? (
                    <div className="aspect-video rounded-2xl overflow-hidden shadow-lg">
                      <img
                        src={service.image_url}
                        alt={service.titre}
                        loading="lazy"
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  ) : (
                    <div className={`aspect-video bg-gradient-to-br ${service.couleur || 'from-primary/10 to-secondary/10'}
                                     rounded-2xl flex flex-col items-center justify-center gap-5 group
                                     hover:from-primary hover:to-secondary transition-all duration-500 p-8`}>
                      <span className="text-primary group-hover:text-white transition-colors duration-500">
                        {ICONES_MAP[service.icone] || <HiCode size={44} />}
                      </span>
                      <p className="text-secondary group-hover:text-white font-heading font-bold
                                    text-xl text-center transition-colors duration-500">
                        {service.titre}
                      </p>
                    </div>
                  )}
                </div>

                {/* Contenu textuel */}
                <div className={i % 2 === 1 ? 'lg:order-1' : ''}>
                  <div className="inline-flex items-center gap-2 bg-primary/10 text-primary
                                  px-3 py-1 rounded-full text-xs font-semibold mb-4 uppercase tracking-wide">
                    Service {String(i + 1).padStart(2, '0')}
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold font-heading text-secondary mb-4">
                    {service.titre}
                  </h2>
                  <p className="text-gray-600 leading-relaxed mb-6 text-base">
                    {service.description}
                  </p>

                  {/* Liste des prestations */}
                  {service.details && (
                    <ul className="space-y-2.5 mb-8">
                      {service.details.map((point) => (
                        <li key={point} className="flex items-start gap-3 text-gray-600 text-sm">
                          <HiCheckCircle className="text-primary shrink-0 mt-0.5" size={18} />
                          {point}
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* CTA double */}
                  <div className="flex flex-wrap gap-3">
                    <Link to="/contact" className="btn-primary inline-flex items-center gap-2">
                      Demander un devis <HiArrowRight />
                    </Link>
                    <a
                      href={c('general_whatsapp') || 'https://wa.me/221788494363'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white
                                 px-5 py-3 rounded-lg font-semibold transition-colors text-sm"
                    >
                      <FaWhatsapp size={16} /> WhatsApp
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ====================================================
          SECTION CTA FINALE
          ==================================================== */}
      <section className="section bg-neutral">
        <div className="container-custom">
          <div className="bg-white rounded-2xl shadow-card p-10 md:p-14 text-center">
            <h2 className="text-2xl md:text-3xl font-bold font-heading text-secondary mb-4">
              Un besoin spécifique ? Parlons-en.
            </h2>
            <p className="text-gray-500 mb-8 max-w-xl mx-auto">
              Contactez Hindo Digital pour un devis personnalisé et gratuit.
              Nous répondons sous 24h.
            </p>

            {/* Numéros de téléphone */}
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              {[c('general_tel1'), c('general_tel2'), c('general_tel3')].filter(Boolean).map(tel => ({
                tel, href: `tel:${tel.replace(/\s/g,'')}`,
              })).map(({ tel, href }) => (
                <a
                  key={href}
                  href={href}
                  className="flex items-center gap-2 text-secondary hover:text-primary
                             font-medium transition-colors border border-gray-200 hover:border-primary
                             px-4 py-2 rounded-lg text-sm"
                >
                  <HiPhone size={16} className="text-primary" /> {tel}
                </a>
              ))}
            </div>

            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/contact" className="btn-primary inline-flex items-center gap-2 text-base px-8 py-4">
                Obtenir un devis gratuit <HiArrowRight />
              </Link>
              <a
                href="mailto:hindodigitale@gmail.com"
                className="btn-outline inline-flex items-center gap-2 text-base px-8 py-4"
              >
                hindodigitale@gmail.com
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default Services
