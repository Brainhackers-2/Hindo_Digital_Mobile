// ============================================================
// services/formationsApi.js — Appels API pour les Formations
// Gère la récupération et l'inscription aux formations
// ============================================================

import api from './api'

/**
 * Récupère la liste complète des formations disponibles
 * @returns {Promise} Liste { id, titre, description, duree, niveau, prix }
 */
export const getFormations = () => api.get('/formations')

/**
 * Enregistre une inscription à une formation
 * @param {Object} data — { nom, email, telephone, formation_id }
 * @returns {Promise} Confirmation d'inscription
 */
export const inscrireFormation = (data) => api.post('/formations/inscription', data)
