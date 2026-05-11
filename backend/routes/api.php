<?php

/**
 * ============================================================
 * routes/api.php — Routes de l'API REST Hindo Digital
 * Routes publiques (/api/v1/) + Routes admin protégées (Sanctum)
 * ============================================================
 */

use Illuminate\Support\Facades\Route;

// ---- Contrôleurs publics ----
use App\Http\Controllers\Api\ServiceController;
use App\Http\Controllers\Api\RealisationController;
use App\Http\Controllers\Api\FormationController;
use App\Http\Controllers\Api\ContactController;
use App\Http\Controllers\Api\NewsletterController;
use App\Http\Controllers\Api\TemoignageController;
use App\Http\Controllers\Api\SettingController;
use App\Http\Controllers\Api\ContentController;
use App\Http\Controllers\Api\VideoController;
use App\Http\Controllers\Admin\ContentAdminController;
use App\Http\Controllers\Admin\VideoAdminController;

// ---- Contrôleurs admin ----
use App\Http\Controllers\Admin\AuthController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\ContactAdminController;
use App\Http\Controllers\Admin\ServiceAdminController;
use App\Http\Controllers\Admin\RealisationAdminController;
use App\Http\Controllers\Admin\FormationAdminController;
use App\Http\Controllers\Admin\InscriptionAdminController;
use App\Http\Controllers\Admin\TemoignageAdminController;
use App\Http\Controllers\Admin\NewsletterAdminController;
use App\Http\Controllers\Admin\SettingAdminController;

/*
|--------------------------------------------------------------------------
| Routes publiques — accessibles sans authentification
|--------------------------------------------------------------------------
*/
Route::prefix('v1')->group(function () {

    Route::get('/services',               [ServiceController::class,    'index']);
    Route::get('/realisations',           [RealisationController::class,'index']);
    Route::get('/formations',             [FormationController::class,  'index']);
    Route::post('/formations/inscription',[FormationController::class,  'inscription']);
    Route::post('/contact',               [ContactController::class,    'store']);
    Route::post('/newsletter',            [NewsletterController::class, 'store']);
    Route::get('/temoignages',            [TemoignageController::class, 'index']);

    Route::get('/settings',   [SettingController::class,  'index']);
    Route::get('/videos',     [VideoController::class,    'index']);
    Route::get('/contenu',    [ContentController::class, 'index']);

    /*
    |----------------------------------------------------------------------
    | Routes d'authentification admin (publiques — login ne nécessite pas de token)
    |----------------------------------------------------------------------
    */
    Route::post('/admin/login', [AuthController::class, 'login']);

    /*
    |----------------------------------------------------------------------
    | Routes admin protégées — requièrent un token Sanctum valide
    |----------------------------------------------------------------------
    */
    Route::middleware('auth:sanctum')->prefix('admin')->group(function () {

        // Auth
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/me',      [AuthController::class, 'me']);

        // Dashboard — statistiques globales
        Route::get('/dashboard', [DashboardController::class, 'index']);

        // Messages de contact
        Route::get('/contacts',                [ContactAdminController::class, 'index']);
        Route::patch('/contacts/{contact}/lu', [ContactAdminController::class, 'marquerLu']);
        Route::delete('/contacts/{contact}',   [ContactAdminController::class, 'destroy']);

        // Services (multipart/form-data pour les images)
        Route::get('/services',                          [ServiceAdminController::class, 'index']);
        Route::post('/services',                         [ServiceAdminController::class, 'store']);
        Route::post('/services/{service}',               [ServiceAdminController::class, 'update']);
        Route::delete('/services/{service}/image',       [ServiceAdminController::class, 'deleteImage']);
        Route::delete('/services/{service}',             [ServiceAdminController::class, 'destroy']);

        // Réalisations (avec upload d'image)
        Route::get('/realisations',                    [RealisationAdminController::class, 'index']);
        Route::post('/realisations',                   [RealisationAdminController::class, 'store']);
        Route::post('/realisations/{realisation}',     [RealisationAdminController::class, 'update']);
        Route::delete('/realisations/{realisation}',   [RealisationAdminController::class, 'destroy']);

        // Formations
        Route::get('/formations',                [FormationAdminController::class, 'index']);
        Route::post('/formations',               [FormationAdminController::class, 'store']);
        Route::put('/formations/{formation}',    [FormationAdminController::class, 'update']);
        Route::delete('/formations/{formation}', [FormationAdminController::class, 'destroy']);

        // Inscriptions
        Route::get('/inscriptions',                   [InscriptionAdminController::class, 'index']);
        Route::delete('/inscriptions/{inscription}',  [InscriptionAdminController::class, 'destroy']);

        // Newsletter
        Route::get('/newsletters', [NewsletterAdminController::class, 'index']);

        // Vidéos de réalisations
        Route::get('/videos',              [VideoAdminController::class, 'index']);
        Route::post('/videos',             [VideoAdminController::class, 'store']);
        Route::post('/videos/{video}',     [VideoAdminController::class, 'update']);
        Route::delete('/videos/{video}',   [VideoAdminController::class, 'destroy']);

        // Contenu CMS — toutes les pages
        Route::get('/contenu',  [ContentAdminController::class, 'index']);
        Route::post('/contenu', [ContentAdminController::class, 'sauvegarder']);

        // Paramètres du site — logo et photo équipe
        Route::get('/settings',                     [SettingAdminController::class, 'index']);
        Route::post('/settings/logo',               [SettingAdminController::class, 'uploadLogo']);
        Route::delete('/settings/logo',             [SettingAdminController::class, 'deleteLogo']);
        Route::post('/settings/team-image',         [SettingAdminController::class, 'uploadTeamImage']);
        Route::delete('/settings/team-image',       [SettingAdminController::class, 'deleteTeamImage']);

        // Témoignages
        Route::get('/temoignages',                   [TemoignageAdminController::class, 'index']);
        Route::post('/temoignages',                  [TemoignageAdminController::class, 'store']);
        Route::put('/temoignages/{temoignage}',      [TemoignageAdminController::class, 'update']);
        Route::delete('/temoignages/{temoignage}',   [TemoignageAdminController::class, 'destroy']);
    });
});
