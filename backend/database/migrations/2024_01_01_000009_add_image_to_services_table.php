<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * ============================================================
 * Migration : add_image_to_services_table
 * Ajoute une colonne image_path à la table services
 * pour permettre l'upload d'une image par service
 * ============================================================
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('services', function (Blueprint $table) {
            // Chemin de l'image dans storage/app/public/services/
            $table->string('image_path')->nullable()->after('icone');
        });
    }

    public function down(): void
    {
        Schema::table('services', function (Blueprint $table) {
            $table->dropColumn('image_path');
        });
    }
};
