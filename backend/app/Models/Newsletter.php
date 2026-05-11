<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * ============================================================
 * Model Newsletter — Abonné à la newsletter de Hindo Digital
 *
 * Table : newsletters
 * Colonnes : id, email, actif, created_at, updated_at
 * ============================================================
 *
 * @property int    $id
 * @property string $email — Adresse email de l'abonné
 * @property bool   $actif — true = abonné actif, false = désabonné
 */
class Newsletter extends Model
{
    use HasFactory;

    /**
     * Champs autorisés pour l'assignation en masse
     */
    protected $fillable = [
        'email',
        'actif',
    ];

    /**
     * Conversion automatique des types de données
     */
    protected $casts = [
        'actif' => 'boolean',
    ];
}
