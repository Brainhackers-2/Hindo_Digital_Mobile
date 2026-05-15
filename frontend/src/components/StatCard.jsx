// components/StatCard.jsx — Carte de chiffre clé avec animation de comptage

import { useState, useEffect, useRef } from 'react'
import { motion, useInView } from 'framer-motion'

// Extrait le nombre et le suffixe d'une valeur comme "50+", "100%", "5"
const parseValeur = (valeur = '') => {
  const match = String(valeur).match(/^(\d+)(.*)$/)
  if (!match) return { nombre: null, suffix: valeur }
  return { nombre: parseInt(match[1], 10), suffix: match[2] }
}

const StatCard = ({ valeur, label, icon, index = 0 }) => {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-50px' })
  const { nombre, suffix } = parseValeur(valeur)
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!inView || nombre === null) return

    const duration = 1800
    const steps = 60
    const stepTime = duration / steps
    const increment = nombre / steps
    let current = 0
    let interval

    const timeout = setTimeout(() => {
      interval = setInterval(() => {
        current += increment
        if (current >= nombre) {
          setCount(nombre)
          clearInterval(interval)
        } else {
          setCount(Math.floor(current))
        }
      }, stepTime)
    }, index * 150)

    return () => {
      clearTimeout(timeout)
      clearInterval(interval)
    }
  }, [inView, nombre, index])

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.15 }}
      className="text-center p-6"
    >
      {icon && (
        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
          {icon}
        </div>
      )}
      <div className="text-4xl md:text-5xl font-bold text-primary font-heading mb-2">
        {nombre !== null ? `${count}${suffix}` : valeur}
      </div>
      <p className="text-gray-600 font-medium">{label}</p>
    </motion.div>
  )
}

export default StatCard
