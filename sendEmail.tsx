// This is a backend-only helper and must not be imported into client components.
export const ADMIN_EMAIL = "haitibridgegroup@gmail.com";

interface SendEmailResult {
  success: boolean;
  error?: string;
}

/**
 * Sends an email using the Resend API.
 * Reads RESEND_API_KEY and RESEND_FROM_EMAIL from process.env.
 */
export async function sendEmail(
  to: string,
  subject: string,
  html: string
): Promise<SendEmailResult> {
  try {
    const apiKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.RESEND_FROM_EMAIL || "no-reply@haitibridgegroup.com";

    if (!apiKey) {
      console.warn("RESEND_API_KEY is not defined. Skipping email sending.");
      return { success: false, error: "Missing API key" };
    }

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: `Haiti Bridge Group <${fromEmail}>`,
        to,
        subject,
        html,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error(`Failed to send email to ${to}. Status: ${response.status}`, errorData);
      return { success: false, error: errorData };
    }

    console.log(`Email successfully sent to ${to}. Subject: "${subject}"`);
    return { success: true };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    console.error(`Error sending email to ${to}:`, errorMessage);
    return { success: false, error: errorMessage };
  }
}

/**
 * Generates the standard professional HTML wrapper for Haiti Bridge emails.
 */
function baseTemplate(title: string, content: string): string {
  return `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f5f7; margin: 0; padding: 20px;">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
        <!-- Header -->
        <tr>
          <td style="background-color: #0056b3; padding: 24px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600; letter-spacing: -0.5px;">Haiti Bridge Group</h1>
          </td>
        </tr>
        <!-- Accent Line -->
        <tr>
          <td style="height: 4px; background-color: #C9A84C; width: 100%;"></td>
        </tr>
        <!-- Content -->
        <tr>
          <td style="padding: 32px; color: #333333; line-height: 1.6; font-size: 16px;">
            ${content}
          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td style="background-color: #fafafa; padding: 20px; text-align: center; color: #888888; font-size: 13px; border-top: 1px solid #eeeeee;">
            &copy; 2025 Haiti Bridge Group - Port-au-Prince, Haïti
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}

// --- TEMPLATES ---

export function getWelcomeAgentEmail(displayName: string) {
  const subject = "Bienvenue sur Haiti Bridge Group - Votre portail Agent";
  const html = baseTemplate(
    subject,
    `
      <h2 style="color: #0056b3; margin-top: 0;">Bonjour ${displayName},</h2>
      <p>Bienvenue sur <strong>Haiti Bridge Group</strong> ! Nous sommes ravis de vous compter parmi nos agents immobiliers.</p>
      <p>En tant qu'agent sur notre plateforme, vous pouvez :</p>
      <ul style="padding-left: 20px; color: #444;">
        <li>Publier vos annonces immobilières avec photos et vidéos.</li>
        <li>Bénéficier de notre badge de vérification pour instaurer la confiance.</li>
        <li>Gérer vos rendez-vous et interactions via notre tableau de bord professionnel.</li>
      </ul>
      <p>Pour commencer, nous vous invitons à compléter votre profil et à soumettre votre pièce d'identité afin d'obtenir votre statut d'Agent Vérifié.</p>
      <p>À très bientôt,<br>L'équipe Haiti Bridge Group</p>
    `
  );
  return { subject, html };
}

export function getAdminNewAgentEmail(agentName: string, agentEmail: string) {
  const subject = `Nouvel Agent Inscrit: ${agentName}`;
  const html = baseTemplate(
    subject,
    `
      <h2 style="color: #0056b3; margin-top: 0;">Nouvelle inscription d'Agent</h2>
      <p>Un nouvel agent vient de créer un compte sur la plateforme :</p>
      <div style="background-color: #f9f9f9; padding: 16px; border-radius: 6px; border: 1px solid #eee; margin: 20px 0;">
        <p style="margin: 0 0 8px 0;"><strong>Nom :</strong> ${agentName}</p>
        <p style="margin: 0;"><strong>Email :</strong> ${agentEmail}</p>
      </div>
      <p>Veuillez vérifier son profil et ses documents dans le tableau de bord administrateur dès qu'ils seront soumis.</p>
    `
  );
  return { subject, html };
}

export function getWelcomeUserEmail(displayName: string) {
  const subject = "Bienvenue sur Haiti Bridge Group";
  const html = baseTemplate(
    subject,
    `
      <h2 style="color: #0056b3; margin-top: 0;">Bonjour ${displayName},</h2>
      <p>Nous sommes heureux de vous accueillir sur <strong>Haiti Bridge Group</strong>, la plateforme de référence pour l'immobilier en Haïti.</p>
      <p>Explorez dès maintenant des milliers d'offres :</p>
      <ul style="padding-left: 20px; color: #444;">
        <li>Maisons et appartements à louer ou à vendre.</li>
        <li>Terrains et propriétés commerciales.</li>
        <li>Prenez rendez-vous directement avec des agents vérifiés.</li>
      </ul>
      <p>Merci de votre confiance et bonne recherche !</p>
      <p>L'équipe Haiti Bridge Group</p>
    `
  );
  return { subject, html };
}

export function getPaymentNotificationEmail(
  displayName: string,
  planName: string,
  paymentMethod: string,
  paymentReference: string
) {
  const subject = "Confirmation de notification de paiement";
  const html = baseTemplate(
    subject,
    `
      <h2 style="color: #0056b3; margin-top: 0;">Bonjour ${displayName},</h2>
      <p>Nous avons bien reçu votre notification de paiement pour le forfait <strong>${planName}</strong>.</p>
      <div style="background-color: #f9f9f9; padding: 16px; border-radius: 6px; border: 1px solid #eee; margin: 20px 0;">
        <p style="margin: 0 0 8px 0;"><strong>Méthode de paiement :</strong> ${paymentMethod}</p>
        <p style="margin: 0;"><strong>Référence :</strong> ${paymentReference}</p>
      </div>
      <p>Notre équipe examine actuellement votre transaction. Vous recevrez un courriel dès que votre abonnement sera activé.</p>
      <p>Merci pour votre confiance,<br>L'équipe Haiti Bridge Group</p>
    `
  );
  return { subject, html };
}

export function getSubscriptionActivatedEmail(
  displayName: string,
  planName: string,
  expiresAt: Date
) {
  const subject = `Votre abonnement ${planName} est activé !`;
  const formattedDate = new Intl.DateTimeFormat('fr-FR', {
    dateStyle: 'full',
  }).format(expiresAt);

  const html = baseTemplate(
    subject,
    `
      <h2 style="color: #0056b3; margin-top: 0;">Félicitations ${displayName},</h2>
      <p>Votre abonnement <strong>${planName}</strong> a été activé avec succès.</p>
      <p>Profitez dès maintenant de tous vos avantages exclusifs pour mettre en valeur vos propriétés et développer votre activité.</p>
      <p style="background-color: #e6f3ff; padding: 12px; border-radius: 6px; color: #0056b3; font-weight: 600; text-align: center;">
        Votre abonnement est valide jusqu'au : ${formattedDate}
      </p>
      <p>Bonnes ventes !<br>L'équipe Haiti Bridge Group</p>
    `
  );
  return { subject, html };
}

export function getSubscriptionDeactivatedEmail(displayName: string, planName: string) {
  const subject = `Expiration de votre abonnement ${planName}`;
  const html = baseTemplate(
    subject,
    `
      <h2 style="color: #0056b3; margin-top: 0;">Bonjour ${displayName},</h2>
      <p>Nous vous informons que votre abonnement <strong>${planName}</strong> est arrivé à expiration ou a été désactivé.</p>
      <p>Vos annonces pourraient être limitées selon les restrictions du plan gratuit. Pour continuer à profiter de vos avantages Premium, nous vous invitons à renouveler votre abonnement depuis votre tableau de bord.</p>
      <p>L'équipe Haiti Bridge Group</p>
    `
  );
  return { subject, html };
}

export function getPasswordResetEmail(displayName: string, resetLink: string) {
  const subject = "Réinitialisation de votre mot de passe";
  const html = baseTemplate(
    subject,
    `
      <h2 style="color: #0056b3; margin-top: 0;">Bonjour ${displayName},</h2>
      <p>Vous avez demandé la réinitialisation de votre mot de passe sur Haiti Bridge Group.</p>
      <p>Veuillez cliquer sur le bouton ci-dessous pour créer un nouveau mot de passe. Ce lien est valide pour une durée limitée.</p>
      <div style="text-align: center; margin: 32px 0;">
        <a href="${resetLink}" style="background-color: #0056b3; color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 6px; font-weight: 600; display: inline-block;">Réinitialiser mon mot de passe</a>
      </div>
      <p style="font-size: 14px; color: #666;">Si vous n'êtes pas à l'origine de cette demande, vous pouvez ignorer cet e-mail en toute sécurité.</p>
    `
  );
  return { subject, html };
}