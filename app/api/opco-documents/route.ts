// app/api/opco-documents/route.ts
// API pour générer et envoyer les documents OPCO

import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

// Note: jsPDF doit être importé côté client ou avec dynamic import côté serveur
// Cette API utilise les fonctions de génération de lib/opco-documents.ts

const resend = new Resend(process.env.RESEND_API_KEY);

interface GenerateDocumentsRequest {
  client: {
    firstName: string;
    lastName: string;
    email: string;
    company?: string;
    siret?: string;
    address?: string;
    postalCode?: string;
    city?: string;
    phone?: string;
  };
  planId: 'solo' | 'equipe' | 'enterprise';
  invoiceNumber: string;
  stripePaymentId?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: GenerateDocumentsRequest = await request.json();
    const { client, planId, invoiceNumber } = body;

    // Validation
    if (!client.email || !client.firstName || !client.lastName || !planId || !invoiceNumber) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Génération des documents (côté serveur, utiliser une lib compatible Node)
    // Pour jsPDF côté serveur, il faut utiliser jspdf + jspdf-autotable avec canvas
    // Alternative: utiliser puppeteer ou react-pdf/renderer

    // Pour cet exemple, on utilise des URLs vers une route de génération
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://formation-ia-act.fr';
    
    const conventionUrl = `${baseUrl}/api/opco-documents/convention?invoice=${invoiceNumber}`;
    const invoiceUrl = `${baseUrl}/api/opco-documents/invoice?invoice=${invoiceNumber}`;
    const programmeUrl = `${baseUrl}/api/opco-documents/programme`;

    // Envoi de l'email avec les documents
    const planNames = {
      solo: 'Solo (1 utilisateur)',
      equipe: 'Équipe (5 utilisateurs)',
      enterprise: 'Enterprise (50 utilisateurs)',
    };

    const planPrices = {
      solo: 500,
      equipe: 2000,
      enterprise: 18000,
    };

    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Vos documents OPCO - Formation AI Act</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f4f4f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #0A0A1B 0%, #1a1a3e 100%); padding: 40px 40px 30px;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: bold;">
                🎓 Formation-IA-Act.fr
              </h1>
              <p style="margin: 10px 0 0; color: rgba(255,255,255,0.7); font-size: 14px;">
                Organisme certifié Qualiopi
              </p>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 40px;">
              <h2 style="margin: 0 0 20px; color: #1a1a1a; font-size: 22px;">
                Bonjour ${client.firstName},
              </h2>
              
              <p style="margin: 0 0 20px; color: #4a4a4a; font-size: 16px; line-height: 1.6;">
                Merci pour votre achat ! Votre accès à la formation <strong>"Formation AI Act - Conformité Article 4"</strong> est maintenant actif.
              </p>

              <!-- Order Summary -->
              <div style="background-color: #f8fafc; border-radius: 12px; padding: 24px; margin: 24px 0;">
                <h3 style="margin: 0 0 16px; color: #1a1a1a; font-size: 16px;">📦 Récapitulatif de votre commande</h3>
                <table width="100%" style="font-size: 14px;">
                  <tr>
                    <td style="color: #6b7280; padding: 8px 0;">Plan</td>
                    <td style="color: #1a1a1a; text-align: right; font-weight: 600;">${planNames[planId]}</td>
                  </tr>
                  <tr>
                    <td style="color: #6b7280; padding: 8px 0;">Montant HT</td>
                    <td style="color: #1a1a1a; text-align: right;">${planPrices[planId].toFixed(2)} €</td>
                  </tr>
                  <tr>
                    <td style="color: #6b7280; padding: 8px 0;">TVA (20%)</td>
                    <td style="color: #1a1a1a; text-align: right;">${(planPrices[planId] * 0.2).toFixed(2)} €</td>
                  </tr>
                  <tr>
                    <td style="color: #1a1a1a; padding: 12px 0 0; font-weight: 600; border-top: 1px solid #e5e7eb;">Total TTC</td>
                    <td style="color: #059669; text-align: right; font-weight: 700; font-size: 18px; border-top: 1px solid #e5e7eb; padding-top: 12px;">${(planPrices[planId] * 1.2).toFixed(2)} €</td>
                  </tr>
                </table>
              </div>

              <!-- OPCO Section -->
              <div style="background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%); border-radius: 12px; padding: 24px; margin: 24px 0; border: 1px solid #a7f3d0;">
                <h3 style="margin: 0 0 12px; color: #065f46; font-size: 16px;">
                  💰 Vous souhaitez un remboursement OPCO ?
                </h3>
                <p style="margin: 0 0 16px; color: #047857; font-size: 14px; line-height: 1.6;">
                  Notre formation est <strong>certifiée Qualiopi</strong>, vous pouvez donc demander un remboursement à votre OPCO (jusqu'à 100% du montant).
                </p>
                <p style="margin: 0; color: #047857; font-size: 14px; line-height: 1.6;">
                  <strong>Transmettez simplement les 3 documents ci-dessous à votre OPCO :</strong>
                </p>
              </div>

              <!-- Documents -->
              <div style="margin: 24px 0;">
                <h3 style="margin: 0 0 16px; color: #1a1a1a; font-size: 16px;">📄 Vos documents OPCO</h3>
                
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="padding: 12px; background-color: #fafafa; border-radius: 8px; margin-bottom: 8px;">
                      <table width="100%">
                        <tr>
                          <td style="width: 40px;">
                            <div style="width: 40px; height: 40px; background-color: #dbeafe; border-radius: 8px; text-align: center; line-height: 40px; font-size: 20px;">📋</div>
                          </td>
                          <td style="padding-left: 12px;">
                            <p style="margin: 0; color: #1a1a1a; font-weight: 600; font-size: 14px;">Convention de formation</p>
                            <p style="margin: 4px 0 0; color: #6b7280; font-size: 12px;">Document contractuel obligatoire</p>
                          </td>
                          <td style="text-align: right;">
                            <a href="${conventionUrl}" style="display: inline-block; background-color: #3b82f6; color: #ffffff; text-decoration: none; padding: 8px 16px; border-radius: 6px; font-size: 12px; font-weight: 600;">Télécharger</a>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr><td style="height: 8px;"></td></tr>
                  <tr>
                    <td style="padding: 12px; background-color: #fafafa; border-radius: 8px;">
                      <table width="100%">
                        <tr>
                          <td style="width: 40px;">
                            <div style="width: 40px; height: 40px; background-color: #dcfce7; border-radius: 8px; text-align: center; line-height: 40px; font-size: 20px;">🧾</div>
                          </td>
                          <td style="padding-left: 12px;">
                            <p style="margin: 0; color: #1a1a1a; font-weight: 600; font-size: 14px;">Facture acquittée</p>
                            <p style="margin: 4px 0 0; color: #6b7280; font-size: 12px;">Preuve de paiement</p>
                          </td>
                          <td style="text-align: right;">
                            <a href="${invoiceUrl}" style="display: inline-block; background-color: #059669; color: #ffffff; text-decoration: none; padding: 8px 16px; border-radius: 6px; font-size: 12px; font-weight: 600;">Télécharger</a>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr><td style="height: 8px;"></td></tr>
                  <tr>
                    <td style="padding: 12px; background-color: #fafafa; border-radius: 8px;">
                      <table width="100%">
                        <tr>
                          <td style="width: 40px;">
                            <div style="width: 40px; height: 40px; background-color: #fef3c7; border-radius: 8px; text-align: center; line-height: 40px; font-size: 20px;">📚</div>
                          </td>
                          <td style="padding-left: 12px;">
                            <p style="margin: 0; color: #1a1a1a; font-weight: 600; font-size: 14px;">Programme de formation</p>
                            <p style="margin: 4px 0 0; color: #6b7280; font-size: 12px;">Détail des 6 modules</p>
                          </td>
                          <td style="text-align: right;">
                            <a href="${programmeUrl}" style="display: inline-block; background-color: #d97706; color: #ffffff; text-decoration: none; padding: 8px 16px; border-radius: 6px; font-size: 12px; font-weight: 600;">Télécharger</a>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </div>

              <!-- Access Button -->
              <div style="text-align: center; margin: 32px 0;">
                <a href="${baseUrl}/dashboard" style="display: inline-block; background: linear-gradient(135deg, #00F5FF 0%, #0066FF 100%); color: #ffffff; text-decoration: none; padding: 16px 32px; border-radius: 12px; font-size: 16px; font-weight: 700;">
                  🚀 Accéder à ma formation
                </a>
              </div>

              <!-- Help -->
              <div style="background-color: #fafafa; border-radius: 12px; padding: 20px; margin-top: 24px;">
                <p style="margin: 0; color: #6b7280; font-size: 14px; line-height: 1.6;">
                  <strong>Besoin d'aide pour votre dossier OPCO ?</strong><br>
                  Notre équipe peut vous accompagner dans vos démarches. Répondez simplement à cet email ou contactez-nous à <a href="mailto:opco@formation-ia-act.fr" style="color: #3b82f6;">opco@formation-ia-act.fr</a>
                </p>
              </div>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; padding: 24px 40px; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 8px; color: #6b7280; font-size: 12px; text-align: center;">
                Formation-IA-Act.fr - Organisme certifié Qualiopi N° 2024/12345-FR
              </p>
              <p style="margin: 0; color: #9ca3af; font-size: 11px; text-align: center;">
                N° de déclaration d'activité : 11 75 12345 67<br>
                123 Rue de la Conformité, 75001 Paris
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;

    // Envoi de l'email
    const { data, error } = await resend.emails.send({
      from: 'Formation IA Act <formation@formation-ia-act.fr>',
      to: client.email,
      subject: `🎓 Votre accès à la formation AI Act + Documents OPCO`,
      html: emailHtml,
      // Optionnel: joindre les PDFs en pièces jointes
      // attachments: [
      //   { filename: `convention-${invoiceNumber}.pdf`, content: conventionBuffer },
      //   { filename: `facture-${invoiceNumber}.pdf`, content: invoiceBuffer },
      //   { filename: 'programme-formation-ai-act.pdf', content: programmeBuffer },
      // ],
    });

    if (error) {
      console.error('Email sending error:', error);
      return NextResponse.json(
        { error: 'Failed to send email', details: error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      emailId: data?.id,
      message: 'Documents OPCO générés et email envoyé',
      documents: {
        convention: conventionUrl,
        invoice: invoiceUrl,
        programme: programmeUrl,
      },
    });

  } catch (error) {
    console.error('OPCO documents error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
