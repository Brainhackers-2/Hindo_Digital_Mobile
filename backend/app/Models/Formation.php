<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * ============================================================
 * Model Formation — Représente une formation proposée par Hindo Digital
 *
 * Table : formations
 * Colonnes : id, titre, description, duree, niveau, prix, created_at, updated_at
 * ============================================================
 *
 * @property int    $id
 * @property string $titre       — Intitulé de la formation
 * @property string $description — Contenu et objectifs de la formation
 * @property string $duree       — Durée (ex: "2 semaines", "30 heures")
 * @property string $niveau      — Niveau requis : Débutant | Intermédiaire | Avancé
 * @property int    $prix        — Prix en FCFA (null = gratuit)
 */
class Formation extends Model
{
    use HasFactory;

    /**
     * Champs autorisés pour l'assignation en masse
     */
    protected $fillable = [
        'titre',
        'description',
        'duree',
        'niveau',
        'prix',
    ];

    /**
     * Conversion automatique des types de données
     */
    protected $casts = [
        'prix' => 'integer',
    ];

    /**
     * Relation : une formation peut avoir plusieurs inscriptions
     */
    public function inscriptions()
    {
        return $this->hasMany(Inscription::class);
    }
}
