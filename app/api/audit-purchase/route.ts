// app/api/audit-purchase/route.ts
// Gère l'envoi d'email après achat audit avec lien vers questionnaire

import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface AuditPurchaseRequest {
  email: string;
  name?: string;
  plan: 'starter' | 'pro' | 'enterprise';
  invoiceNumber: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: AuditPurchaseRequest = await request.json();
    const { email, name, plan, invoiceNumber } = body;

    if (!email || !plan || !invoiceNumber) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const planInfo: Record<string, { name: string; price: number; questions: number; pages: number }> = {
      starter: { name: 'Starter', price: 499, questions: 30, pages: 15 },
      pro: { name: 'Pro', price: 999, questions: 50, pages: 30 },
      enterprise: { name: 'Enterprise', price: 2999, questions: 80, pages: 50 },
    };

    const info = planInfo[plan] || planInfo.pro;
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://formation-ia-act.fr';
    const firstName = name?.split(' ')[0] || 'Client';

    // Générer un token unique pour l'audit
    const auditToken = `${invoiceNumber}-${Date.now().toString(36)}`;

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
            <td style="background:linear-gradient(135deg,#8B5CF6 0%,#6D28D9 100%);padding:40px;text-align:center;">
              <h1 style="color:#fff;margin:0;font-size:28px;">🔍 Votre Audit AI Act est prêt !</h1>
              <p style="color:rgba(255,255,255,0.8);margin:10px 0 0;font-size:16px;">Formule ${info.name} - ${info.questions} questions</p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding:40px;">
              <h2 style="color:#1a1a2e;margin:0 0 20px;font-size:22px;">Bonjour ${firstName},</h2>
              
              <p style="color:#666;font-size:16px;line-height:1.6;margin:0 0 20px;">
                Merci pour votre achat ! Vous pouvez maintenant lancer votre <strong>audit de conformité AI Act</strong>.
              </p>

              <!-- CTA Button -->
              <div style="text-align:center;margin:30px 0;">
                <a href="${baseUrl}/audit/questionnaire?token=${auditToken}&plan=${plan}" 
                   style="display:inline-block;background:linear-gradient(135deg,#8B5CF6,#6D28D9);color:#fff;font-weight:bold;padding:18px 36px;border-radius:12px;text-decoration:none;font-size:18px;">
                  🚀 Commencer mon audit
                </a>
                <p style="color:#999;font-size:12px;margin:10px 0 0;">Durée estimée : 15-30 minutes</p>
              </div>

              <!-- What to expect -->
              <div style="background:#f5f3ff;border:1px solid #c4b5fd;border-radius:12px;padding:24px;margin:30px 0;">
                <h3 style="color:#6d28d9;margin:0 0 15px;font-size:16px;">📋 Ce qui vous attend</h3>
                <table width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;">
                  <tr>
                    <td style="padding:8px 0;color:#666;">
                      <span style="color:#8B5CF6;margin-right:10px;">1️⃣</span>
                      Répondez à <strong>${info.questions} questions</strong> sur votre utilisation de l'IA
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:8px 0;color:#666;">
                      <span style="color:#8B5CF6;margin-right:10px;">2️⃣</span>
                      Notre algorithme analyse vos réponses en temps réel
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:8px 0;color:#666;">
                      <span style="color:#8B5CF6;margin-right:10px;">3️⃣</span>
                      Recevez votre <strong>rapport PDF de ${info.pages} pages</strong>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:8px 0;color:#666;">
                      <span style="color:#8B5CF6;margin-right:10px;">4️⃣</span>
                      Suivez le plan d'action priorisé pour vous mettre en conformité
                    </td>
                  </tr>
                </table>
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
                    <td style="color:#666;padding:6px 0;">Formule</td>
                    <td style="color:#1a1a2e;text-align:right;">${info.name}</td>
                  </tr>
                  <tr>
                    <td style="color:#666;padding:6px 0;">Montant HT</td>
                    <td style="color:#1a1a2e;text-align:right;">${info.price}€</td>
                  </tr>
                  <tr>
                    <td style="color:#1a1a2e;padding:12px 0 0;font-weight:600;border-top:1px solid #e5e5e5;">Total TTC</td>
                    <td style="color:#8B5CF6;text-align:right;font-weight:700;font-size:18px;border-top:1px solid #e5e5e5;padding-top:12px;">${(info.price * 1.2).toFixed(2)}€</td>
                  </tr>
                </table>
              </div>

              <!-- OPCO Info -->
              <div style="background:linear-gradient(135deg,#ecfdf5 0%,#d1fae5 100%);border:1px solid #a7f3d0;border-radius:12px;padding:24px;margin:30px 0;">
                <h3 style="color:#065f46;margin:0 0 12px;font-size:16px;">💰 Remboursement OPCO</h3>
                <p style="color:#047857;font-size:14px;margin:0;line-height:1.6;">
                  Votre audit peut être <strong>remboursé par votre OPCO</strong> s'il est associé à notre formation certifiée Qualiopi.
                  Contactez-nous pour recevoir les documents nécessaires.
                </p>
              </div>

              ${plan === 'pro' || plan === 'enterprise' ? `
              <!-- Call Reminder -->
              <div style="background:#fef3c7;border:1px solid #fcd34d;border-radius:12px;padding:24px;margin:20px 0;">
                <h3 style="color:#92400e;margin:0 0 12px;font-size:16px;">📞 Votre call de restitution</h3>
                <p style="color:#a16207;font-size:14px;margin:0 0 15px;line-height:1.6;">
                  Votre formule ${info.name} inclut un call de restitution ${plan === 'enterprise' ? '(1h + workshop)' : '(30 min)'} avec un expert conformité.
                  Vous recevrez un email pour planifier ce rendez-vous après avoir complété votre audit.
                </p>
              </div>
              ` : ''}

              <!-- Separator -->
              <div style="border-top:2px solid #eee;margin:30px 0;"></div>
              <p style="text-align:center;color:#666;font-size:14px;margin:0 0 20px;">✨ Complétez votre conformité</p>

              <!-- Upsell: Formation -->
              <div style="background:#fff7ed;border:2px solid #fed7aa;border-radius:12px;padding:24px;margin:20px 0;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="width:50px;vertical-align:top;">
                      <span style="font-size:36px;">🎓</span>
                    </td>
                    <td style="padding-left:15px;">
                      <h3 style="color:#c2410c;margin:0 0 8px;font-size:18px;">Formation Certifiante AI Act</h3>
                      <p style="color:#666;font-size:13px;margin:0 0 15px;line-height:1.5;">
                        Après l'audit, formez vos équipes pour corriger les points identifiés. Certificat officiel + financement OPCO 100%.
                      </p>
                      <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td>
                            <span style="color:#999;font-size:12px;">À partir de</span>
                            <span style="color:#c2410c;font-size:24px;font-weight:bold;margin-left:10px;">500€</span>
                            <span style="color:#999;font-size:12px;margin-left:5px;">HT</span>
                          </td>
                          <td style="text-align:right;">
                            <a href="${baseUrl}/pricing" 
                               style="display:inline-block;background:linear-gradient(135deg,#FF6B00,#FF4444);color:#fff;font-weight:bold;padding:12px 24px;border-radius:8px;text-decoration:none;font-size:14px;">
                              Voir les formations →
                            </a>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </div>

              <!-- Upsell: Templates -->
              <div style="background:#ecfeff;border:2px solid #a5f3fc;border-radius:12px;padding:24px;margin:20px 0;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="width:50px;vertical-align:top;">
                      <span style="font-size:36px;">📦</span>
                    </td>
                    <td style="padding-left:15px;">
                      <h3 style="color:#0891b2;margin:0 0 8px;font-size:18px;">Pack Templates Complet</h3>
                      <p style="color:#666;font-size:13px;margin:0 0 15px;line-height:1.5;">
                        12 documents prêts à l'emploi pour implémenter les recommandations de votre audit : registre IA, politique, matrices, checklists...
                      </p>
                      <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td>
                            <span style="color:#999;text-decoration:line-through;font-size:14px;">900€</span>
                            <span style="color:#0891b2;font-size:24px;font-weight:bold;margin-left:10px;">599€</span>
                            <span style="color:#999;font-size:12px;margin-left:5px;">HT</span>
                          </td>
                          <td style="text-align:right;">
                            <a href="${baseUrl}/templates" 
                               style="display:inline-block;background:#00F5FF;color:#000;font-weight:bold;padding:12px 24px;border-radius:8px;text-decoration:none;font-size:14px;">
                              Voir les templates →
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
                  <a href="mailto:audit@formation-ia-act.fr" style="color:#8B5CF6;">audit@formation-ia-act.fr</a>
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
      from: 'Formation AI Act <audit@formation-ia-act.fr>',
      to: [email],
      subject: `🔍 Votre Audit AI Act ${info.name} est prêt - Commencez maintenant !`,
      html: emailHtml,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json(
        { error: 'Failed to send email' },
        { status: 500 }
      );
    }

    console.log(`✅ Audit email sent to ${email} - Plan: ${plan}`);

    return NextResponse.json({ 
      success: true,
      emailId: data?.id,
      auditToken,
    });

  } catch (error) {
    console.error('Audit purchase error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
