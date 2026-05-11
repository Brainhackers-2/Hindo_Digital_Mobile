<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

/**
 * ============================================================
 * InscriptionRequest — Validation des inscriptions aux formations
 * Utilisé par FormationController::inscription()
 * ============================================================
 */
class InscriptionRequest extends FormRequest
{
    /**
     * Tout le monde peut s'inscrire (pas d'authentification requise)
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Règles de validation du formulaire d'inscription
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'nom'          => ['required', 'string', 'min:2', 'max:100'],
            'email'        => ['required', 'email', 'max:150'],
            'telephone'    => ['nullable', 'string', 'max:20'],
            // Vérifie que la formation existe bien en base de données
            'formation_id' => ['required', 'integer', 'exists:formations,id'],
        ];
    }

    /**
     * Messages d'erreur personnalisés en français
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'nom.required'           => 'Votre nom est obligatoire.',
            'email.required'         => 'Une adresse email est requise.',
            'email.email'            => 'L\'adresse email n\'est pas valide.',
            'formation_id.required'  => 'Veuillez sélectionner une formation.',
            'formation_id.exists'    => 'La formation sélectionnée n\'existe pas.',
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
