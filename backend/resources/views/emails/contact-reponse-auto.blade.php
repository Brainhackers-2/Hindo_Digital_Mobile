<!DOCTYPE html>
{{-- ============================================================
     Email de réponse automatique — Accusé de réception du contact
     Envoyé au client après soumission du formulaire de contact
     ============================================================ --}}
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Hindo Digital — Message reçu</title>
  <style>
    body { font-family: 'Inter', Arial, sans-serif; background: #F5F5F5; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 30px auto; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
    .header { background: linear-gradient(135deg, #8B0000, #2D2D2D); padding: 32px 40px; text-align: center; }
    .header h1 { color: #fff; font-size: 28px; margin: 0 0 8px; }
    .header p { color: rgba(255,255,255,0.8); font-size: 14px; margin: 0; }
    .body { padding: 40px; }
    .greeting { font-size: 18px; font-weight: 600; color: #2D2D2D; margin-bottom: 16px; }
    .text { color: #555; line-height: 1.7; margin-bottom: 16px; }
    .summary { background: #F5F5F5; border-left: 4px solid #8B0000; padding: 16px 20px; border-radius: 0 8px 8px 0; margin: 24px 0; }
    .summary p { margin: 6px 0; color: #444; font-size: 14px; }
    .summary strong { color: #2D2D2D; }
    .footer { background: #2D2D2D; padding: 24px 40px; text-align: center; }
    .footer p { color: rgba(255,255,255,0.6); font-size: 12px; margin: 4px 0; }
    .footer a { color: #8B0000; text-decoration: none; }
  </style>
</head>
<body>
  <div class="container">
    {{-- En-tête avec logo --}}
    <div class="header">
      <h1>Hindo <span style="color:#ffaaaa">Digital</span></h1>
      <p>Le Numérique à votre porte</p>
    </div>

    {{-- Corps de l'email --}}
    <div class="body">
      <p class="greeting">Bonjour {{ $contact->nom }},</p>

      <p class="text">
        Merci pour votre message. Notre équipe l'a bien reçu et vous contactera dans les meilleurs délais,
        généralement sous <strong>24 heures ouvrables</strong>.
      </p>

      {{-- Récapitulatif du message envoyé --}}
      <div class="summary">
        <p><strong>Sujet :</strong> {{ $contact->sujet }}</p>
        <p><strong>Votre message :</strong></p>
        <p style="font-style: italic; margin-top: 8px;">"{{ Str::limit($contact->message, 200) }}"</p>
      </div>

      <p class="text">
        En attendant, n'hésitez pas à nous suivre sur nos réseaux sociaux pour rester informé
        de nos actualités et offres spéciales.
      </p>

      <p class="text">
        Cordialement,<br>
        <strong style="color:#8B0000">L'équipe Hindo Digital</strong>
      </p>
    </div>

    {{-- Pied de l'email --}}
    <div class="footer">
      <p>Hindo Digital — Dakar, Sénégal</p>
      <p>
        <a href="mailto:contact@hindodigital.sn">contact@hindodigital.sn</a>
        &nbsp;|&nbsp;
        <a href="tel:+221000000000">+221 00 000 00 00</a>
      </p>
      <p style="margin-top: 12px; font-size: 11px;">
        Vous recevez cet email car vous avez soumis le formulaire de contact sur notre site.
      </p>
    </div>
  </div>
</body>
</html>
