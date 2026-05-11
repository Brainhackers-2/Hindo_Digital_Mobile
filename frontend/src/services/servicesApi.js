// ============================================================
// services/servicesApi.js — Appels API pour les Services
// Communique avec l'endpoint Laravel GET /api/v1/services
// ============================================================

import api from './api'

/**
 * Récupère la liste complète des services depuis la base de données
 * @returns {Promise} Liste des services { id, titre, description, icone, ordre }
 */
export const getServices = () => api.get('/services')
