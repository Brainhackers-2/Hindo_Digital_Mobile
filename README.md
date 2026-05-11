# Hindo Digital — Site Vitrine

> **"Le Numérique à votre porte"** — Startup sénégalaise spécialisée dans les services numériques

## Stack Technique

| Couche     | Technologie                        |
|------------|------------------------------------|
| Frontend   | React 18 + Vite + Tailwind CSS     |
| Backend    | Laravel 11 (API REST)              |
| Base de données | MySQL                         |
| Animations | Framer Motion                      |
| HTTP       | Axios                              |
| Routing    | React Router v6                    |

---

## Arborescence du projet

```
hindo-digital/
├── frontend/               # React + Vite
│   ├── src/
│   │   ├── components/     # Navbar, Footer, ServiceCard, FormField...
│   │   ├── pages/          # Accueil, APropos, Services, Realisations, Formation, Contact
│   │   ├── hooks/          # useFetch, useForm
│   │   └── services/       # api.js, servicesApi.js, contactApi.js...
│   ├── tailwind.config.js
│   └── vite.config.js
│
└── backend/                # Laravel 11
    ├── app/Http/Controllers/Api/   # 6 contrôleurs API
    ├── app/Http/Requests/          # Validation stricte
    ├── app/Models/                 # 7 modèles Eloquent
    ├── app/Mail/                   # Email réponse automatique
    ├── database/migrations/        # 7 migrations MySQL
    ├── database/seeders/           # Données de démonstration
    └── routes/api.php              # Routes API v1
```

---

## Installation et démarrage

### Prérequis
- Node.js 18+
- PHP 8.2+
- Composer
- MySQL 8+

---

### 1. Backend Laravel

```bash
cd backend

# Installer les dépendances PHP
composer install

# Copier le fichier d'environnement
cp .env.example .env

# Générer la clé d'application
php artisan key:generate

# Configurer la base de données dans .env
# DB_DATABASE=hindo_digital
# DB_USERNAME=root
# DB_PASSWORD=votre_mot_de_passe

# Créer la base de données MySQL
mysql -u root -p -e "CREATE DATABASE hindo_digital CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# Exécuter les migrations
php artisan migrate

# Peupler avec les données de démonstration
php artisan db:seed

# Créer le lien symbolique pour le stockage des images
php artisan storage:link

# Démarrer le serveur Laravel (port 8000)
php artisan serve
```

---

### 2. Frontend React

```bash
cd frontend

# Installer les dépendances Node.js
npm install

# Démarrer le serveur de développement (port 3000)
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000) dans le navigateur.

---

## API REST — Endpoints

| Méthode | Endpoint                          | Description                    |
|---------|-----------------------------------|--------------------------------|
| GET     | `/api/v1/services`                | Liste des services             |
| GET     | `/api/v1/realisations`            | Galerie des projets            |
| GET     | `/api/v1/formations`              | Catalogue des formations       |
| POST    | `/api/v1/formations/inscription`  | Inscription à une formation    |
| POST    | `/api/v1/contact`                 | Envoyer un message de contact  |
| POST    | `/api/v1/newsletter`              | S'abonner à la newsletter      |
| GET     | `/api/v1/temoignages`             | Témoignages clients            |

### Format de réponse JSON

```json
{
  "success": true,
  "data": [...],
  "message": "Opération réussie"
}
```

---

## Pages du site

| Route            | Page                            |
|------------------|---------------------------------|
| `/`              | Accueil (Hero, Services, Stats, Témoignages) |
| `/a-propos`      | À propos (Histoire, Mission, Valeurs)        |
| `/services`      | Services détaillés                           |
| `/realisations`  | Galerie filtrée + Lightbox                   |
| `/formation`     | Catalogue + Formulaire d'inscription         |
| `/contact`       | Formulaire + Coordonnées + Réseaux sociaux   |

---

## Design System

```css
/* Couleurs */
--primary:   #8B0000;  /* Rouge bordeaux */
--secondary: #2D2D2D;  /* Gris foncé */
--neutral:   #F5F5F5;  /* Gris clair */

/* Typographies */
font-family: Inter, Poppins;
```

---

## Configuration Email (réponse automatique)

Dans `.env`, configurer le service SMTP :

```env
MAIL_MAILER=smtp
MAIL_HOST=sandbox.smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=votre_username
MAIL_PASSWORD=votre_password
MAIL_FROM_ADDRESS="contact@hindodigital.sn"
```

Pour la production, utiliser un service comme **Brevo** (ex-Sendinblue) ou **Mailgun**.

---

## Ajouter des images de réalisations

```bash
# Copier l'image dans le dossier de stockage
cp mon_image.jpg backend/storage/app/public/realisations/

# L'URL publique sera automatiquement :
# http://localhost:8000/storage/realisations/mon_image.jpg
```

---

## Déploiement en production

1. **Backend** : Héberger sur un VPS avec Nginx + PHP-FPM
2. **Frontend** : `npm run build` → déployer `dist/` sur Netlify, Vercel ou Nginx
3. **Base de données** : MySQL sur le serveur ou PlanetScale
4. **CORS** : Mettre à jour `config/cors.php` avec le domaine de production

---

*Développé avec ❤️ pour Hindo Digital — Dakar, Sénégal*
