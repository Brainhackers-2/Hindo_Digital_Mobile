<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * ============================================================
 * Model Setting — Paramètres globaux du site Hindo Digital
 * Système clé/valeur : logo_path, favicon_path, etc.
 * ============================================================
 */
class Setting extends Model
{
    protected $fillable = ['key', 'value'];

    /**
     * Récupère la valeur d'un paramètre par sa clé
     * Retourne $defaut si la clé n'existe pas
     */
    public static function get(string $key, mixed $defaut = null): mixed
    {
        $setting = static::where('key', $key)->first();
        return $setting ? $setting->value : $defaut;
    }

    /**
     * Crée ou met à jour un paramètre (upsert simplifié)
     */
    public static function set(string $key, mixed $value): void
    {
        static::updateOrCreate(['key' => $key], ['value' => $value]);
    }
}
