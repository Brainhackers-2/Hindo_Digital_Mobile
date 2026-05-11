<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * ============================================================
 * Model Temoignage — Avis client affiché sur la page d'accueil
 *
 * Table : temoignages
 * Colonnes : id, nom, poste, texte, note, actif, created_at, updated_at
 * ============================================================
 *
 * @property int    $id
 * @property string $nom   — Nom du client
 * @property string $poste — Poste/rôle du client (ex: "Directeur, PME Dakar")
 * @property string $texte — Texte du témoignage
 * @property int    $note  — Note sur 5
 * @property bool   $actif — true = affiché sur le site, false = masqué
 */
class Temoignage extends Model
{
    use HasFactory;

    /**
     * Champs autorisés pour l'assignation en masse
     */
    protected $fillable = [
        'nom',
        'poste',
        'texte',
        'note',
        'actif',
    ];

    /**
     * Conversion automatique des types de données
     */
    protected $casts = [
        'note'  => 'integer',
        'actif' => 'boolean',
    ];
}
