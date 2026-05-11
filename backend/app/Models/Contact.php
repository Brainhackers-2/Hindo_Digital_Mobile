<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * ============================================================
 * Model Contact — Message envoyé via le formulaire de contact
 *
 * Table : contacts
 * Colonnes : id, nom, email, telephone, sujet, message, lu, created_at, updated_at
 * ============================================================
 *
 * @property int    $id
 * @property string $nom       — Nom complet de l'expéditeur
 * @property string $email     — Email de l'expéditeur
 * @property string $telephone — Téléphone (optionnel)
 * @property string $sujet     — Sujet du message
 * @property string $message   — Corps du message
 * @property bool   $lu        — Indicateur de lecture (pour l'admin)
 */
class Contact extends Model
{
    use HasFactory;

    /**
     * Champs autorisés pour l'assignation en masse
     */
    protected $fillable = [
        'nom',
        'email',
        'telephone',
        'sujet',
        'message',
        'lu',
    ];

    /**
     * Conversion automatique des types de données
     */
    protected $casts = [
        'lu' => 'boolean',
    ];
}
