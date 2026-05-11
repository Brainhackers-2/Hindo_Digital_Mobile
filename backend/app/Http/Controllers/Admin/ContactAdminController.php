<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Contact;
use Illuminate\Http\JsonResponse;

/**
 * ============================================================
 * Admin\ContactAdminController — Gestion des messages de contact
 * Liste, lecture, suppression des messages reçus
 * ============================================================
 */
class ContactAdminController extends Controller
{
    /** Liste tous les messages triés par date (non lus en premier) */
    public function index(): JsonResponse
    {
        $contacts = Contact::orderBy('lu')->latest()->get();
        return response()->json(['success' => true, 'data' => $contacts]);
    }

    /** Marque un message comme lu */
    public function marquerLu(Contact $contact): JsonResponse
    {
        $contact->update(['lu' => true]);
        return response()->json(['success' => true, 'message' => 'Message marqué comme lu.']);
    }

    /** Supprime un message de contact */
    public function destroy(Contact $contact): JsonResponse
    {
        $contact->delete();
        return response()->json(['success' => true, 'message' => 'Message supprimé.']);
    }
}
