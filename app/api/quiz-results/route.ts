// app/api/quiz-results/route.ts
// Envoie les résultats du quiz par email avec le PDF "10 erreurs fatales AI Act"

import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import PDFDocument from 'pdfkit';

const resend = new Resend(process.env.RESEND_API_KEY);

// Questions du quiz pour le rapport
const questionsData = [
  { id: 1, question: "Utilisation d'outils IA", field: "aiUsage" },
  { id: 2, question: "Taille de l'entreprise", field: "companySize" },
  { id: 3, question: "Secteur d'activité", field: "sector" },
  { id: 4, question: "IA pour décisions impactantes", field: "impactDecisions" },
  { id: 5, question: "Documentation des systèmes", field: "documentation" },
  { id: 6, question: "Formation AI Act", field: "training" },
  { id: 7, question: "DPO ou responsable conformité", field: "dpo" },
];

// Les 10 erreurs fatales AI Act
const fatalErrors = [
  {
    number: 1,
    title: "Ignorer l'AI Act car \"on n'utilise pas vraiment d'IA\"",
    description: "ChatGPT, Copilot, les CRM avec scoring, les chatbots... Tous ces outils sont concernés par l'AI Act. Si vos équipes utilisent l'un de ces outils, même occasionnellement, vous êtes soumis au règlement.",
    solution: "Réalisez un inventaire complet de TOUS les outils utilisant de l'IA dans votre organisation.",
  },
  {
    number: 2,
    title: "Attendre août 2026 pour agir",
    description: "L'obligation de formation (Article 4) est déjà en vigueur depuis février 2025. Les IA interdites le sont depuis février 2025 également. Attendre 2026, c'est déjà être en infraction.",
    solution: "Commencez MAINTENANT par former vos équipes et auditer vos systèmes IA existants.",
  },
  {
    number: 3,
    title: "Sous-estimer le périmètre de la loi",
    description: "L'AI Act a une portée extraterritoriale. Si vous vendez en Europe ou si des citoyens européens utilisent vos services IA, vous êtes concerné, même hors UE.",
    solution: "Analysez tous vos marchés et clients pour identifier votre exposition réelle.",
  },
  {
    number: 4,
    title: "Ne pas classifier correctement les risques",
    description: "La classification en 4 niveaux (inacceptable, haut, limité, minimal) détermine vos obligations. Une mauvaise classification peut vous exposer à des sanctions disproportionnées.",
    solution: "Utilisez notre matrice de classification pour évaluer chaque système IA.",
  },
  {
    number: 5,
    title: "Négliger la documentation technique",
    description: "Pour les systèmes à haut risque, une documentation technique complète est obligatoire AVANT la mise sur le marché. Sans elle, pas de marquage CE possible.",
    solution: "Préparez votre documentation avec notre template dédié.",
  },
  {
    number: 6,
    title: "Oublier l'obligation de transparence",
    description: "Les chatbots, deepfakes et contenus générés par IA doivent être clairement identifiés comme tels. L'absence de marquage est une infraction.",
    solution: "Auditez tous vos points de contact client utilisant de l'IA générative.",
  },
  {
    number: 7,
    title: "Ne pas former les équipes",
    description: "L'Article 4 impose une \"maîtrise suffisante de l'IA\" pour toute personne manipulant ces systèmes. C'est une obligation légale, pas une option.",
    solution: "Formez vos équipes avec notre programme certifiant Qualiopi.",
  },
  {
    number: 8,
    title: "Absence de gouvernance IA",
    description: "Sans politique IA claire, sans référent identifié, sans processus de validation, vous naviguez à vue. La CNIL et les autorités de contrôle vérifient ces éléments.",
    solution: "Désignez un référent IA et rédigez votre politique d'utilisation.",
  },
  {
    number: 9,
    title: "Confondre RGPD et AI Act",
    description: "Ces deux textes sont complémentaires mais distincts. Être conforme au RGPD ne signifie pas être conforme à l'AI Act. Les obligations sont différentes.",
    solution: "Faites un audit spécifique AI Act, distinct de votre audit RGPD.",
  },
  {
    number: 10,
    title: "Sous-estimer les sanctions",
    description: "Jusqu'à 35 millions d'euros ou 7% du CA mondial. Ce ne sont pas des menaces en l'air : la CNIL recrute massivement pour les contrôles dès 2026.",
    solution: "Anticipez et documentez votre démarche de conformité dès maintenant.",
  },
];

// Fonction pour générer le PDF
async function generateChecklist(
  email: string,
  riskLevel: string,
  riskPercentage: number,
  answers: number[]
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ 
      size: 'A4',
      margin: 50,
      info: {
        Title: '10 Erreurs Fatales AI Act - Checklist',
        Author: 'Formation-IA-Act.fr',
      }
    });
    
    const chunks: Buffer[] = [];
    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    // Couleurs
    const colors = {
      primary: '#0066FF',
      danger: '#FF4444',
      warning: '#FF6B00',
      success: '#00FF88',
      text: '#1a1a2e',
      lightGray: '#f0f0f5',
    };

    // Header
    doc.rect(0, 0, doc.page.width, 120).fill(colors.primary);
    
    doc.fillColor('#FFFFFF')
       .fontSize(24)
       .font('Helvetica-Bold')
       .text('🚨 10 ERREURS FATALES AI ACT', 50, 40, { align: 'center' });
    
    doc.fontSize(14)
       .font('Helvetica')
       .text('La checklist pour éviter les sanctions', 50, 75, { align: 'center' });

    doc.moveDown(3);
    doc.y = 140;

    // Score personnalisé
    doc.fillColor(colors.text)
       .fontSize(12)
       .font('Helvetica-Bold')
       .text(`Votre score de risque : ${riskPercentage}% - Niveau ${riskLevel}`, 50);
    
    doc.moveDown(0.5);
    
    // Barre de progression
    const barWidth = 200;
    const barHeight = 15;
    const barX = 50;
    const barY = doc.y;
    
    doc.rect(barX, barY, barWidth, barHeight).fill(colors.lightGray);
    
    const progressColor = riskPercentage > 70 ? colors.danger : 
                          riskPercentage > 50 ? colors.warning : colors.success;
    doc.rect(barX, barY, (barWidth * riskPercentage) / 100, barHeight).fill(progressColor);
    
    doc.moveDown(2);

    // Les 10 erreurs
    fatalErrors.forEach((error, index) => {
      // Vérifier si on a besoin d'une nouvelle page
      if (doc.y > 680) {
        doc.addPage();
        doc.y = 50;
      }

      // Numéro
      doc.fillColor(colors.danger)
         .fontSize(16)
         .font('Helvetica-Bold')
         .text(`ERREUR #${error.number}`, 50);
      
      doc.moveDown(0.3);
      
      // Titre
      doc.fillColor(colors.text)
         .fontSize(13)
         .font('Helvetica-Bold')
         .text(error.title, 50, doc.y, { width: 495 });
      
      doc.moveDown(0.3);
      
      // Description
      doc.fillColor('#666666')
         .fontSize(10)
         .font('Helvetica')
         .text(error.description, 50, doc.y, { width: 495 });
      
      doc.moveDown(0.3);
      
      // Solution
      doc.fillColor(colors.success)
         .fontSize(10)
         .font('Helvetica-Bold')
         .text('✓ Solution : ', 50, doc.y, { continued: true })
         .fillColor(colors.text)
         .font('Helvetica')
         .text(error.solution, { width: 450 });
      
      doc.moveDown(1.2);
    });

    // Footer - CTA
    doc.addPage();
    
    doc.rect(0, 0, doc.page.width, doc.page.height).fill(colors.lightGray);
    
    doc.fillColor(colors.primary)
       .fontSize(22)
       .font('Helvetica-Bold')
       .text('Passez à l\'action maintenant !', 50, 100, { align: 'center' });
    
    doc.moveDown(2);
    
    doc.fillColor(colors.text)
       .fontSize(14)
       .font('Helvetica')
       .text('Vous avez identifié vos risques. Voici comment les corriger :', 50, doc.y, { align: 'center' });
    
    doc.moveDown(2);

    // Options
    const options = [
      { emoji: '🎓', title: 'Formation Certifiante', desc: '6 modules pour maîtriser l\'AI Act', price: 'À partir de 500€', url: 'formation-ia-act.fr/pricing' },
      { emoji: '📦', title: 'Pack Templates', desc: '12 documents prêts à l\'emploi', price: '299€', url: 'formation-ia-act.fr/templates' },
      { emoji: '🔍', title: 'Audit Automatisé', desc: 'Évaluez votre conformité en 15 min', price: '499€', url: 'formation-ia-act.fr/audit' },
    ];

    options.forEach((opt, i) => {
      doc.rect(50, doc.y, 495, 70)
         .fill('#FFFFFF');
      
      const boxY = doc.y + 15;
      
      doc.fontSize(24).text(opt.emoji, 70, boxY);
      
      doc.fillColor(colors.text)
         .fontSize(14)
         .font('Helvetica-Bold')
         .text(opt.title, 110, boxY);
      
      doc.fillColor('#666666')
         .fontSize(11)
         .font('Helvetica')
         .text(opt.desc, 110, boxY + 18);
      
      doc.fillColor(colors.primary)
         .fontSize(12)
         .font('Helvetica-Bold')
         .text(opt.price, 400, boxY + 8);
      
      doc.fillColor('#999999')
         .fontSize(9)
         .font('Helvetica')
         .text(opt.url, 110, boxY + 38);
      
      doc.y += 80;
    });

    doc.moveDown(2);
    
    // Garantie
    doc.fillColor(colors.text)
       .fontSize(11)
       .font('Helvetica')
       .text('✅ Certifié Qualiopi  •  🔒 Garantie 30 jours  •  💰 Finançable OPCO', 50, doc.y, { align: 'center' });

    doc.moveDown(2);
    
    doc.fillColor('#999999')
       .fontSize(9)
       .text(`Document généré pour ${email} le ${new Date().toLocaleDateString('fr-FR')}`, 50, doc.y, { align: 'center' });
    
    doc.text('© 2024 Formation-IA-Act.fr - Tous droits réservés', 50, doc.y + 15, { align: 'center' });

    doc.end();
  });
}

// Fonction pour générer l'email HTML
function generateEmailHTML(
  riskLevel: string,
  riskPercentage: number,
  riskColor: string,
  answers: number[],
  findings: string[]
): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #0066FF 0%, #00F5FF 100%); padding: 40px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px;">🔍 Vos Résultats AI Act</h1>
              <p style="color: rgba(255,255,255,0.8); margin: 10px 0 0 0; font-size: 16px;">Évaluation personnalisée de votre conformité</p>
            </td>
          </tr>
          
          <!-- Score -->
          <tr>
            <td style="padding: 40px; text-align: center;">
              <div style="display: inline-block; width: 120px; height: 120px; border-radius: 50%; background: linear-gradient(135deg, ${riskColor}20, ${riskColor}40); line-height: 120px; margin-bottom: 20px;">
                <span style="font-size: 36px; font-weight: bold; color: ${riskColor};">${riskPercentage}%</span>
              </div>
              <h2 style="color: ${riskColor}; margin: 0 0 10px 0; font-size: 24px;">Risque ${riskLevel}</h2>
              <p style="color: #666666; margin: 0; font-size: 14px;">Score basé sur vos 7 réponses</p>
            </td>
          </tr>
          
          <!-- Findings -->
          <tr>
            <td style="padding: 0 40px 30px 40px;">
              <h3 style="color: #1a1a2e; margin: 0 0 15px 0; font-size: 18px;">📋 Points d'attention identifiés</h3>
              <table width="100%" cellpadding="0" cellspacing="0">
                ${findings.map(finding => `
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f5;">
                    <span style="color: #FF6B00; margin-right: 10px;">⚠️</span>
                    <span style="color: #333333; font-size: 14px;">${finding}</span>
                  </td>
                </tr>
                `).join('')}
              </table>
            </td>
          </tr>
          
          <!-- CTA -->
          <tr>
            <td style="padding: 0 40px 40px 40px; text-align: center;">
              <h3 style="color: #1a1a2e; margin: 0 0 20px 0; font-size: 18px;">🚀 Passez à l'action</h3>
              
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding: 15px; background: linear-gradient(135deg, #FF6B00, #FF4444); border-radius: 12px; margin-bottom: 15px;">
                    <a href="https://formation-ia-act.fr/pricing" style="color: #ffffff; text-decoration: none; font-weight: bold; font-size: 16px; display: block;">
                      🎓 Formation Certifiante - À partir de 500€
                    </a>
                    <span style="color: rgba(255,255,255,0.8); font-size: 12px;">6 modules + Certificat officiel</span>
                  </td>
                </tr>
              </table>
              
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 15px;">
                <tr>
                  <td width="48%" style="padding: 15px; background: #f8f8f8; border-radius: 12px; vertical-align: top;">
                    <a href="https://formation-ia-act.fr/templates" style="color: #0066FF; text-decoration: none; font-weight: bold; font-size: 14px;">
                      📦 Pack Templates
                    </a>
                    <br>
                    <span style="color: #666666; font-size: 12px;">12 documents - 299€</span>
                  </td>
                  <td width="4%"></td>
                  <td width="48%" style="padding: 15px; background: #f8f8f8; border-radius: 12px; vertical-align: top;">
                    <a href="https://formation-ia-act.fr/audit" style="color: #8B5CF6; text-decoration: none; font-weight: bold; font-size: 14px;">
                      🔍 Audit Automatisé
                    </a>
                    <br>
                    <span style="color: #666666; font-size: 12px;">Rapport complet - 499€</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- PDF Attachment Note -->
          <tr>
            <td style="padding: 20px 40px; background: #f8f8f8; text-align: center;">
              <p style="color: #666666; margin: 0; font-size: 14px;">
                📎 <strong>Pièce jointe :</strong> Checklist "10 Erreurs Fatales AI Act" (PDF)
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 30px; text-align: center; border-top: 1px solid #f0f0f5;">
              <p style="color: #999999; margin: 0 0 10px 0; font-size: 12px;">
                ✅ Certifié Qualiopi • 🔒 Garantie 30 jours • 💰 Finançable OPCO
              </p>
              <p style="color: #cccccc; margin: 0; font-size: 11px;">
                © 2024 Formation-IA-Act.fr - Tous droits réservés
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
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, answers, riskLevel, riskPercentage, findings } = body;

    if (!email || !answers) {
      return NextResponse.json(
        { error: 'Email et réponses requis' },
        { status: 400 }
      );
    }

    // Déterminer la couleur du risque
    const riskColor = riskPercentage > 70 ? '#FF4444' : 
                      riskPercentage > 50 ? '#FF6B00' :
                      riskPercentage > 30 ? '#FFB800' : '#00FF88';

    // Générer le PDF
    const pdfBuffer = await generateChecklist(email, riskLevel, riskPercentage, answers);

    // Générer l'email HTML
    const emailHtml = generateEmailHTML(riskLevel, riskPercentage, riskColor, answers, findings);

    // Envoyer l'email avec Resend
    const { data, error } = await resend.emails.send({
      from: 'Formation AI Act <results@formation-ia-act.fr>',
      to: [email],
      subject: `🔍 Vos résultats AI Act : Risque ${riskLevel} (${riskPercentage}%)`,
      html: emailHtml,
      attachments: [
        {
          filename: '10-erreurs-fatales-ai-act.pdf',
          content: pdfBuffer.toString('base64'),
        },
      ],
    });

    if (error) {
      console.error('Erreur Resend:', error);
      return NextResponse.json(
        { error: 'Erreur lors de l\'envoi de l\'email' },
        { status: 500 }
      );
    }

    // Log pour tracking
    console.log(`Quiz results sent to ${email} - Risk: ${riskLevel} (${riskPercentage}%)`);

    return NextResponse.json({ 
      success: true, 
      message: 'Email envoyé avec succès',
      emailId: data?.id 
    });

  } catch (error) {
    console.error('Erreur API quiz-results:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
