// ============================================================
// services/realisationsApi.js — Appels API pour les Réalisations
// Communique avec l'endpoint Laravel GET /api/v1/realisations
// ============================================================

import api from './api'

/**
 * Récupère la liste des réalisations avec leurs images et catégories
 * @returns {Promise} Liste { id, titre, categorie, image_path, description }
 */
export const getRealisations = () => api.get('/realisations')
