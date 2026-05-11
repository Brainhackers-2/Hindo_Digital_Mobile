<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

/**
 * ============================================================
 * NewsletterRequest — Validation de l'abonnement newsletter
 * Utilisé par NewsletterController::store()
 * ============================================================
 */
class NewsletterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Règles de validation — un seul champ obligatoire : email
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'email' => ['required', 'email', 'max:150'],
        ];
    }

    /**
     * Messages d'erreur personnalisés en français
     */
    public function messages(): array
    {
        return [
            'email.required' => 'Une adresse email est requise pour l\'abonnement.',
            'email.email'    => 'L\'adresse email saisie n\'est pas valide.',
        ];
    }

    /**
     * Retourne une réponse JSON pour l'API React en cas d'erreur
     */
    protected function failedValidation(Validator $validator): never
    {
        throw new HttpResponseException(response()->json([
            'success' => false,
            'message' => 'Erreur de validation.',
            'errors'  => $validator->errors(),
        ], 422));
    }
}
