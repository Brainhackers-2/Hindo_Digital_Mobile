<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * ============================================================
 * Model Realisation — Représente un projet réalisé par Hindo Digital
 *
 * Table : realisations
 * Colonnes : id, titre, categorie, image_path, description, created_at, updated_at
 * ============================================================
 *
 * @property int    $id
 * @property string $titre       — Nom du projet (ex: "Site e-commerce boutique")
 * @property string $categorie   — Catégorie (ex: "Web & Mobile", "Réseaux")
 * @property string $image_path  — Chemin de l'image dans storage/app/public/
 * @property string $description — Description courte du projet
 */
class Realisation extends Model
{
    use HasFactory;

    /**
     * Champs autorisés pour l'assignation en masse
     */
    protected $fillable = [
        'titre',
        'categorie',
        'image_path',
        'description',
    ];
}
