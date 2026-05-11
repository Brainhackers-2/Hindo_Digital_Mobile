<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

/**
 * ============================================================
 * ContactRequest — Validation stricte du formulaire de contact
 * Utilisé par ContactController::store()
 * ============================================================
 */
class ContactRequest extends FormRequest
{
    /**
     * Tout le monde peut envoyer un message de contact (pas d'auth requise)
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Règles de validation du formulaire de contact
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'nom'       => ['required', 'string', 'min:2', 'max:100'],
            'email'     => ['required', 'email', 'max:150'],
            'telephone' => ['nullable', 'string', 'max:20'],
            'sujet'     => ['required', 'string', 'max:200'],
            'message'   => ['required', 'string', 'min:10', 'max:5000'],
        ];
    }

    /**
     * Messages d'erreur personnalisés en français
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'nom.required'      => 'Votre nom est obligatoire.',
            'nom.min'           => 'Le nom doit contenir au moins 2 caractères.',
            'email.required'    => 'Une adresse email est requise.',
            'email.email'       => 'L\'adresse email n\'est pas valide.',
            'sujet.required'    => 'Veuillez indiquer le sujet de votre message.',
            'message.required'  => 'Le corps du message est obligatoire.',
            'message.min'       => 'Le message doit contenir au moins 10 caractères.',
        ];
    }

    /**
     * Retourne une réponse JSON en cas d'erreur de validation (au lieu d'une redirection)
     * Nécessaire pour une API REST consommée par React
     */
    protected function failedValidation(Validator $validator): never
    {
        throw new HttpResponseException(response()->json([
            'success' => false,
            'message' => 'Erreur de validation. Vérifiez les champs du formulaire.',
            'errors'  => $validator->errors(),
        ], 422));
    }
}
