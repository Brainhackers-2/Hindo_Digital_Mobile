<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Contact;
use App\Http\Requests\ContactRequest;
use App\Mail\ContactReponseAuto;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Mail;

/**
 * ============================================================
 * ContactController — Contrôleur pour les messages de contact
 * Enregistre le message en BDD et envoie une réponse automatique
 * ============================================================
 */
class ContactController extends Controller
{
    /**
     * Enregistre un message de contact et envoie un accusé de réception.
     *
     * POST /api/v1/contact
     *
     * @param  ContactRequest $request — Données validées : nom, email, telephone, sujet, message
     * @return JsonResponse
     */
    public function store(ContactRequest $request): JsonResponse
    {
        // Enregistrement du message en base de données
        $contact = Contact::create($request->validated());

        // Envoi de la réponse automatique à l'expéditeur du message
        try {
            Mail::to($contact->email)->send(new ContactReponseAuto($contact));
        } catch (\Exception $e) {
            // On log l'erreur mais on ne bloque pas la réponse API
            \Log::warning('Email de confirmation non envoyé : ' . $e->getMessage());
        }

        return response()->json([
            'success' => true,
            'data'    => null,
            'message' => 'Votre message a bien été envoyé. Nous vous répondrons sous 24h.',
        ], 201);
    }
}
