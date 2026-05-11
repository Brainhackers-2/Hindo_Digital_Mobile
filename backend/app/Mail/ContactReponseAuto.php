<?php

namespace App\Mail;

use App\Models\Contact;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

/**
 * ============================================================
 * ContactReponseAuto — Email de réponse automatique au contact
 * Envoyé à l'expéditeur dès réception de son message
 * ============================================================
 */
class ContactReponseAuto extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * Injection du modèle Contact pour accéder aux données dans la vue
     *
     * @param Contact $contact — Le message de contact reçu
     */
    public function __construct(
        public readonly Contact $contact
    ) {}

    /**
     * Définit l'objet (sujet) de l'email envoyé
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Hindo Digital — Votre message a bien été reçu',
        );
    }

    /**
     * Définit le contenu de l'email via la vue Blade
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.contact-reponse-auto',
        );
    }

    /**
     * Pièces jointes (aucune dans ce cas)
     */
    public function attachments(): array
    {
        return [];
    }
}
