<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * ============================================================
 * Model Inscription — Enregistrement d'une inscription à une formation
 *
 * Table : inscriptions
 * Colonnes : id, nom, email, telephone, formation_id, created_at, updated_at
 * ============================================================
 *
 * @property int    $id
 * @property string $nom          — Nom et prénom de l'apprenant
 * @property string $email        — Email de contact de l'apprenant
 * @property string $telephone    — Numéro de téléphone (optionnel)
 * @property int    $formation_id — Clé étrangère vers la table formations
 */
class Inscription extends Model
{
    use HasFactory;

    /**
     * Champs autorisés pour l'assignation en masse
     */
    protected $fillable = [
        'nom',
        'email',
        'telephone',
        'formation_id',
    ];

    /**
     * Relation : une inscription appartient à une formation
     */
    public function formation()
    {
        return $this->belongsTo(Formation::class);
    }
}
