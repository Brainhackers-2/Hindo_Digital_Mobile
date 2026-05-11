// ============================================================
// services/contactApi.js — Appels API pour le Contact et Newsletter
// Enregistre les messages de contact et les abonnements newsletter
// ============================================================

import api from './api'

/**
 * Envoie un message de contact via le formulaire
 * @param {Object} data — { nom, email, telephone, sujet, message }
 * @returns {Promise} Confirmation d'envoi
 */
export const envoyerContact = (data) => api.post('/contact', data)

/**
 * Inscrit un email à la newsletter
 * @param {Object} data — { email }
 * @returns {Promise} Confirmation d'abonnement
 */
export const abonnerNewsletter = (data) => api.post('/newsletter', data)

/**
 * Récupère les témoignages clients pour l'accueil
 * @returns {Promise} Liste des témoignages
 */
export const getTemoignages = () => api.get('/temoignages')
