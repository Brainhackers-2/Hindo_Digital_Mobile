<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * ============================================================
 * Model Service — Représente un service proposé par Hindo Digital
 *
 * Table : services
 * Colonnes : id, titre, description, icone, image_path, ordre, created_at, updated_at
 * ============================================================
 */
class Service extends Model
{
    use HasFactory;

    protected $fillable = [
        'titre',
        'description',
        'icone',
        'image_path',
        'ordre',
    ];

    protected $casts = [
        'ordre' => 'integer',
    ];
}
