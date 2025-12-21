// app/api/templates-purchase/route.ts
// Gère l'envoi d'email après achat templates avec upsells et info OPCO

import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface TemplatesPurchaseRequest {
  email: string;
  name?: string;
  pack: 'essentiel' | 'complet';
  invoiceNumber: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: TemplatesPurchaseRequest = await request.json();
    const { email, name, pack, invoiceNumber } = body;

    if (!email || !pack || !invoiceNumber) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const packInfo: Record<string, { templates: number; price: number; name: string }> = {
      essentiel: { templates: 6, price: 299, name: 'Essentiel' },
      complet: { templates: 12, price: 599, name: 'Complet' },
    };

    const info = packInfo[pack] || packInfo.complet;
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://formation-ia-act.fr';
    const firstName = name?.split(' ')[0] || 'Client';

    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;background:#f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 6px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#00F5FF 0%,#0066FF 100%);padding:40px;text-align:center;">
              <h1 style="color:#fff;margin:0;font-size:28px;">📦 Vos Templates sont prêts !</h1>
              <p style="color:rgba(255,255,255,0.8);margin:10px 0 0;font-size:16px;">Pack ${info.name} - ${info.templates} documents</p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding:40px;">
              <h2 style="color:#1a1a2e;margin:0 0 20px;font-size:22px;">Bonjour ${firstName},</h2>
              
              <p style="color:#666;font-size:16px;line-height:1.6;margin:0 0 20px;">
                Merci pour votre achat ! Vous avez maintenant accès à <strong>${info.templates} templates professionnels</strong> 
                pour votre conformité AI Act.
              </p>

              <!-- Download Button -->
              <div style="text-align:center;margin:30px 0;">
                <a href="${baseUrl}/api/templates/download?pack=${pack}&token=${invoiceNumber}" 
                   style="display:inline-block;background:#00FF88;color:#000;font-weight:bold;padding:18px 36px;border-radius:12px;text-decoration:none;font-size:18px;">
                  ⬇️ Télécharger mes templates
                </a>
                <p style="color:#999;font-size:12px;margin:10px 0 0;">Lien valable 30 jours</p>
              </div>

              <!-- Order Summary -->
              <div style="background:#f8f8f8;border-radius:12px;padding:20px;margin:20px 0;">
                <h3 style="color:#1a1a2e;margin:0 0 15px;font-size:16px;">📋 Récapitulatif</h3>
                <table width="100%" style="font-size:14px;">
                  <tr>
                    <td style="color:#666;padding:6px 0;">N° de commande</td>
                    <td style="color:#1a1a2e;text-align:right;font-weight:600;">${invoiceNumber}</td>
                  </tr>
                  <tr>
                    <td style="color:#666;padding:6px 0;">Pack</td>
                    <td style="color:#1a1a2e;text-align:right;">${info.name} (${info.templates} templates)</td>
                  </tr>
                  <tr>
                    <td style="color:#666;padding:6px 0;">Montant HT</td>
                    <td style="color:#1a1a2e;text-align:right;">${info.price}€</td>
                  </tr>
                  <tr>
                    <td style="color:#1a1a2e;padding:12px 0 0;font-weight:600;border-top:1px solid #e5e5e5;">Total TTC</td>
                    <td style="color:#00FF88;text-align:right;font-weight:700;font-size:18px;border-top:1px solid #e5e5e5;padding-top:12px;">${(info.price * 1.2).toFixed(2)}€</td>
                  </tr>
                </table>
              </div>

              <!-- OPCO Section -->
              <div style="background:linear-gradient(135deg,#ecfdf5 0%,#d1fae5 100%);border:1px solid #a7f3d0;border-radius:12px;padding:24px;margin:30px 0;">
                <h3 style="color:#065f46;margin:0 0 12px;font-size:16px;">💰 Remboursement OPCO possible !</h3>
                <p style="color:#047857;font-size:14px;margin:0 0 16px;line-height:1.6;">
                  <strong>Bonne nouvelle :</strong> Vos templates peuvent être remboursés par votre OPCO s'ils sont associés à une formation certifiée.
                </p>
                <p style="color:#047857;font-size:14px;margin:0 0 16px;line-height:1.6;">
                  👉 Ajoutez notre <strong>Formation Certifiante AI Act</strong> et recevez les documents OPCO pour un remboursement jusqu'à 100% !
                </p>
                <div style="text-align:center;">
                  <a href="${baseUrl}/pricing" 
                     style="display:inline-block;background:#059669;color:#fff;font-weight:bold;padding:12px 24px;border-radius:8px;text-decoration:none;font-size:14px;">
                    Voir les formations éligibles OPCO →
                  </a>
                </div>
              </div>

              <!-- Separator -->
              <div style="border-top:2px solid #eee;margin:30px 0;"></div>
              <p style="text-align:center;color:#666;font-size:14px;margin:0 0 20px;">✨ Offres exclusives pour vous</p>

              <!-- Upsell 1: Formation -50% -->
              <div style="background:#fff7ed;border:2px solid #fed7aa;border-radius:12px;padding:24px;margin:20px 0;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="width:50px;vertical-align:top;">
                      <span style="font-size:36px;">🎓</span>
                    </td>
                    <td style="padding-left:15px;">
                      <div style="display:inline-block;background:#FF6B00;color:#fff;font-size:11px;font-weight:bold;padding:4px 10px;border-radius:20px;margin-bottom:8px;">
                        ⏰ OFFRE 48H : -50%
                      </div>
                      <h3 style="color:#c2410c;margin:0 0 8px;font-size:18px;">Formation Certifiante AI Act</h3>
                      <p style="color:#666;font-size:13px;margin:0 0 15px;line-height:1.5;">
                        Vous avez les documents. Obtenez maintenant les <strong>connaissances et le certificat officiel</strong> pour les utiliser correctement et prouver votre conformité.
                      </p>
                      <ul style="color:#666;font-size:13px;margin:0 0 15px;padding-left:20px;line-height:1.6;">
                        <li>6 modules de formation (8h)</li>
                        <li>Certificat officiel AI Act</li>
                        <li>Quiz interactifs</li>
                        <li><strong>Finançable OPCO à 100%</strong></li>
                      </ul>
                      <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td>
                            <span style="color:#999;text-decoration:line-through;font-size:16px;">500€</span>
                            <span style="color:#c2410c;font-size:28px;font-weight:bold;margin-left:10px;">250€</span>
                            <span style="color:#999;font-size:12px;margin-left:5px;">HT</span>
                          </td>
                          <td style="text-align:right;">
                            <a href="${baseUrl}/checkout?plan=solo&discount=TEMPLATES50" 
                               style="display:inline-block;background:linear-gradient(135deg,#FF6B00,#FF4444);color:#fff;font-weight:bold;padding:14px 28px;border-radius:10px;text-decoration:none;font-size:14px;">
                              Ajouter la formation →
                            </a>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </div>

              <!-- Upsell 2: Audit -->
              <div style="background:#f5f3ff;border:2px solid #c4b5fd;border-radius:12px;padding:24px;margin:20px 0;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="width:50px;vertical-align:top;">
                      <span style="font-size:36px;">🔍</span>
                    </td>
                    <td style="padding-left:15px;">
                      <div style="display:inline-block;background:#8B5CF6;color:#fff;font-size:11px;font-weight:bold;padding:4px 10px;border-radius:20px;margin-bottom:8px;">
                        NOUVEAU
                      </div>
                      <h3 style="color:#6d28d9;margin:0 0 8px;font-size:18px;">Audit Automatisé de Conformité</h3>
                      <p style="color:#666;font-size:13px;margin:0 0 15px;line-height:1.5;">
                        Vérifiez votre niveau de conformité réel en <strong>15 minutes</strong>. Recevez un rapport PDF personnalisé avec un plan d'action priorisé.
                      </p>
                      <ul style="color:#666;font-size:13px;margin:0 0 15px;padding-left:20px;line-height:1.6;">
                        <li>30 questions d'analyse</li>
                        <li>Score de conformité détaillé</li>
                        <li>Rapport PDF 30 pages</li>
                        <li>Plan d'action prioritaire</li>
                      </ul>
                      <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td>
                            <span style="color:#999;font-size:12px;">À partir de</span>
                            <span style="color:#6d28d9;font-size:28px;font-weight:bold;margin-left:10px;">499€</span>
                            <span style="color:#999;font-size:12px;margin-left:5px;">HT</span>
                          </td>
                          <td style="text-align:right;">
                            <a href="${baseUrl}/audit" 
                               style="display:inline-block;background:#8B5CF6;color:#fff;font-weight:bold;padding:14px 28px;border-radius:10px;text-decoration:none;font-size:14px;">
                              Découvrir l'audit →
                            </a>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </div>

              <!-- Help -->
              <div style="background:#f8f8f8;border-radius:12px;padding:20px;margin-top:30px;text-align:center;">
                <p style="color:#666;font-size:14px;margin:0;">
                  Une question ? Répondez à cet email ou contactez-nous à 
                  <a href="mailto:support@formation-ia-act.fr" style="color:#0066FF;">support@formation-ia-act.fr</a>
                </p>
              </div>

            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background:#1a1a2e;padding:30px;text-align:center;">
              <p style="color:rgba(255,255,255,0.6);font-size:12px;margin:0 0 10px;">
                Formation-IA-Act.fr - Organisme certifié Qualiopi
              </p>
              <p style="color:rgba(255,255,255,0.4);font-size:11px;margin:0;">
                © 2024 Tous droits réservés
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

    // Envoyer l'email
    const { data, error } = await resend.emails.send({
      from: 'Formation AI Act <commandes@formation-ia-act.fr>',
      to: [email],
      subject: `📦 Vos ${info.templates} templates AI Act sont prêts - Téléchargez-les maintenant !`,
      html: emailHtml,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json(
        { error: 'Failed to send email' },
        { status: 500 }
      );
    }

    console.log(`✅ Templates email sent to ${email} - Pack: ${pack}`);

    return NextResponse.json({ 
      success: true,
      emailId: data?.id,
    });

  } catch (error) {
    console.error('Templates purchase error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
