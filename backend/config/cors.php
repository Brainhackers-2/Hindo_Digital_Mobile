<?php

/**
 * ============================================================
 * config/cors.php — Configuration CORS pour l'API Laravel
 * Permet au frontend React (localhost:3000) d'accéder à l'API
 * ============================================================
 */

return [
    /*
    |----------------------------------------------------------------------
    | Chemins soumis aux règles CORS
    |----------------------------------------------------------------------
    | Seule l'API v1 est exposée. Les autres routes ne sont pas concernées.
    */
    'paths' => ['api/*'],

    /*
    |----------------------------------------------------------------------
    | Méthodes HTTP autorisées
    |----------------------------------------------------------------------
    */
    'allowed_methods' => ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],

    /*
    |----------------------------------------------------------------------
    | Origines (domaines) autorisées à faire des requêtes cross-origin
    |----------------------------------------------------------------------
    | En développement : localhost:3000 (React Vite)
    | En production : remplacer par le domaine réel du frontend
    */
    'allowed_origins' => [
        'http://localhost:3000',
        'http://localhost:5173',
        // Vercel accepte tous les sous-domaines *.vercel.app
        // La variable FRONTEND_URL permet de configurer sans modifier le code
    ],

    // Accepte le domaine Vercel défini dans .env (ex: https://hindo-digital.vercel.app)
    'allowed_origins_patterns' => [
        env('FRONTEND_URL', ''),
        '#^https://.*\.vercel\.app$#',  // Tous les previews Vercel
    ],

    /*
    |----------------------------------------------------------------------
    | En-têtes autorisés dans les requêtes
    |----------------------------------------------------------------------
    */
    'allowed_headers' => ['*'],

    /*
    |----------------------------------------------------------------------
    | En-têtes exposés dans la réponse
    |----------------------------------------------------------------------
    */
    'exposed_headers' => [],

    /*
    |----------------------------------------------------------------------
    | Durée de mise en cache des résultats preflight (en secondes)
    |----------------------------------------------------------------------
    */
    'max_age' => 0,

    /*
    |----------------------------------------------------------------------
    | Autorise l'envoi de cookies dans les requêtes cross-origin
    |----------------------------------------------------------------------
    */
    'supports_credentials' => false,
];
