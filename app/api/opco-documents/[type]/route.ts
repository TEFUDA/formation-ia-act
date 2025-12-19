// app/api/opco-documents/[type]/route.ts
// Routes pour générer et télécharger les documents PDF individuels

import { NextRequest, NextResponse } from 'next/server';

// Note: Pour la génération PDF côté serveur, plusieurs options:
// 1. puppeteer (lourd mais complet)
// 2. @react-pdf/renderer (React-based)
// 3. pdfkit (Node.js natif)
// 4. jspdf avec canvas (nécessite polyfills)

// Pour cet exemple, on utilise une approche simplifiée
// En production, vous pouvez utiliser puppeteer ou un service comme DocRaptor

import PDFDocument from 'pdfkit';

// Infos de l'organisme
const ORGANISME = {
  name: "Formation-IA-Act.fr",
  legalName: "FORMATION IA ACT SAS",
  address: "123 Rue de la Conformité",
  postalCode: "75001",
  city: "Paris",
  siret: "123 456 789 00001",
  tva: "FR12345678901",
  qualiopi: "2024/12345-FR",
  email: "contact@formation-ia-act.fr",
  phone: "01 23 45 67 89",
  website: "https://formation-ia-act.fr",
  nda: "11 75 12345 67",
};

const PLANS = {
  solo: { name: "Solo", priceHT: 500, users: 1 },
  equipe: { name: "Équipe", priceHT: 2000, users: 5 },
  enterprise: { name: "Enterprise", priceHT: 18000, users: 50 },
};

// GET /api/opco-documents/convention?invoice=XXX
// GET /api/opco-documents/invoice?invoice=XXX
// GET /api/opco-documents/programme
// GET /api/opco-documents/attestation?invoice=XXX

export async function GET(
  request: NextRequest,
  { params }: { params: { type: string } }
) {
  const { type } = params;
  const searchParams = request.nextUrl.searchParams;
  const invoiceNumber = searchParams.get('invoice');

  // Vérifier l'authentification (récupérer l'utilisateur depuis la session)
  // const session = await getServerSession(authOptions);
  // if (!session) {
  //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  // }

  // Récupérer les infos client depuis la BDD basé sur le numéro de facture
  // const purchase = await prisma.purchase.findUnique({ where: { invoiceNumber } });

  // Pour cet exemple, on utilise des données de test
  const mockClient = {
    firstName: "Jean",
    lastName: "Dupont",
    email: "jean.dupont@example.com",
    company: "Ma Société SAS",
    siret: "987 654 321 00001",
    address: "456 Avenue des Champs",
    postalCode: "75008",
    city: "Paris",
  };

  const mockPurchase = {
    planId: 'solo' as const,
    planName: "Solo",
    priceHT: 500,
    priceTTC: 600,
    tva: 100,
    users: 1,
    invoiceNumber: invoiceNumber || 'FA-2024-123456',
    purchaseDate: new Date(),
    accessEndDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
  };

  try {
    let pdfBuffer: Buffer;
    let filename: string;

    switch (type) {
      case 'convention':
        pdfBuffer = await generateConventionPDF(mockClient, mockPurchase);
        filename = `convention-${mockPurchase.invoiceNumber}.pdf`;
        break;

      case 'invoice':
        pdfBuffer = await generateInvoicePDF(mockClient, mockPurchase);
        filename = `facture-${mockPurchase.invoiceNumber}.pdf`;
        break;

      case 'programme':
        pdfBuffer = await generateProgrammePDF();
        filename = 'programme-formation-ai-act.pdf';
        break;

      case 'attestation':
        const score = parseInt(searchParams.get('score') || '85');
        pdfBuffer = await generateAttestationPDF(mockClient, mockPurchase, new Date(), score);
        filename = `attestation-${mockPurchase.invoiceNumber}.pdf`;
        break;

      default:
        return NextResponse.json({ error: 'Invalid document type' }, { status: 400 });
    }

    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': pdfBuffer.length.toString(),
      },
    });

  } catch (error) {
    console.error('PDF generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate PDF' },
      { status: 500 }
    );
  }
}

// ============================================
// GÉNÉRATION CONVENTION PDF (avec pdfkit)
// ============================================
async function generateConventionPDF(client: any, purchase: any): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50 });
    const chunks: Buffer[] = [];

    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    // En-tête
    doc.rect(0, 0, doc.page.width, 80).fill('#0A0A1B');
    doc.fillColor('#FFFFFF')
       .fontSize(18)
       .text(ORGANISME.name, 50, 25, { align: 'center' });
    doc.fontSize(10)
       .text(`Organisme certifié Qualiopi - N° ${ORGANISME.qualiopi}`, 50, 50, { align: 'center' });

    doc.fillColor('#000000');
    doc.moveDown(3);

    // Titre
    doc.fontSize(16)
       .font('Helvetica-Bold')
       .text('CONVENTION DE FORMATION PROFESSIONNELLE', { align: 'center' });
    doc.fontSize(10)
       .font('Helvetica')
       .text(`N° ${purchase.invoiceNumber}`, { align: 'center' });
    doc.moveDown(2);

    // Article 1 - Parties
    doc.fontSize(12).font('Helvetica-Bold').text('ARTICLE 1 - PARTIES');
    doc.moveDown(0.5);
    doc.fontSize(10).font('Helvetica');
    doc.text('Entre les soussignés :');
    doc.moveDown(0.5);
    doc.text(`L'organisme de formation : ${ORGANISME.legalName}`);
    doc.text(`Siège social : ${ORGANISME.address}, ${ORGANISME.postalCode} ${ORGANISME.city}`);
    doc.text(`SIRET : ${ORGANISME.siret}`);
    doc.text(`N° de déclaration d'activité : ${ORGANISME.nda}`);
    doc.moveDown(0.5);
    doc.text('Et');
    doc.moveDown(0.5);
    doc.text(`Le client : ${client.company || `${client.firstName} ${client.lastName}`}`);
    if (client.siret) doc.text(`SIRET : ${client.siret}`);
    doc.text(`Représenté par : ${client.firstName} ${client.lastName}`);
    doc.text(`Email : ${client.email}`);
    doc.moveDown(1.5);

    // Article 2 - Objet
    doc.fontSize(12).font('Helvetica-Bold').text('ARTICLE 2 - OBJET');
    doc.moveDown(0.5);
    doc.fontSize(10).font('Helvetica');
    doc.text('La présente convention a pour objet la formation suivante :');
    doc.text('Intitulé : Formation AI Act - Conformité Article 4');
    doc.text('Durée : 8 heures (6 modules)');
    doc.text('Modalité : Formation en ligne (e-learning)');
    doc.text(`Nombre de participants : ${purchase.users} personne(s)`);
    doc.moveDown(1.5);

    // Article 3 - Conditions financières
    doc.fontSize(12).font('Helvetica-Bold').text('ARTICLE 3 - CONDITIONS FINANCIÈRES');
    doc.moveDown(0.5);
    doc.fontSize(10).font('Helvetica');
    doc.text(`Prix HT : ${purchase.priceHT.toFixed(2)} €`);
    doc.text(`TVA (20%) : ${purchase.tva.toFixed(2)} €`);
    doc.text(`Prix TTC : ${purchase.priceTTC.toFixed(2)} €`);
    doc.moveDown(1.5);

    // Dates
    doc.fontSize(12).font('Helvetica-Bold').text('ARTICLE 4 - DATES');
    doc.moveDown(0.5);
    doc.fontSize(10).font('Helvetica');
    doc.text(`Date de début d'accès : ${purchase.purchaseDate.toLocaleDateString('fr-FR')}`);
    doc.text(`Date de fin d'accès : ${purchase.accessEndDate.toLocaleDateString('fr-FR')}`);
    doc.moveDown(2);

    // Signatures
    doc.text(`Fait le ${new Date().toLocaleDateString('fr-FR')}`, { align: 'center' });
    doc.moveDown(2);
    
    doc.text('Pour l\'Organisme :', 50);
    doc.text('Pour le Client :', 350);
    doc.moveDown(0.5);
    doc.text(ORGANISME.legalName, 50);
    doc.text(client.company || `${client.firstName} ${client.lastName}`, 350);

    // Pied de page
    doc.fontSize(8)
       .fillColor('#888888')
       .text(
         `${ORGANISME.legalName} - ${ORGANISME.address}, ${ORGANISME.postalCode} ${ORGANISME.city} - ${ORGANISME.email}`,
         50,
         doc.page.height - 50,
         { align: 'center' }
       );

    doc.end();
  });
}

// ============================================
// GÉNÉRATION FACTURE PDF
// ============================================
async function generateInvoicePDF(client: any, purchase: any): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50 });
    const chunks: Buffer[] = [];

    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    // En-tête
    doc.rect(0, 0, doc.page.width, 100).fill('#0A0A1B');
    doc.fillColor('#FFFFFF')
       .fontSize(24)
       .font('Helvetica-Bold')
       .text('FACTURE', 50, 30);
    doc.fontSize(10)
       .font('Helvetica')
       .text(`N° ${purchase.invoiceNumber}`, 50, 60);
    doc.text(`Date : ${purchase.purchaseDate.toLocaleDateString('fr-FR')}`, 50, 75);
    
    doc.fontSize(14)
       .text(ORGANISME.name, doc.page.width - 200, 30, { align: 'right' });
    doc.fontSize(9)
       .text(`Qualiopi N° ${ORGANISME.qualiopi}`, doc.page.width - 200, 50, { align: 'right' });

    doc.fillColor('#000000');
    doc.y = 130;

    // Émetteur et Client
    doc.fontSize(10).font('Helvetica-Bold');
    doc.text('ÉMETTEUR', 50);
    doc.text('CLIENT', 350);
    
    doc.moveDown(0.5);
    doc.fontSize(9).font('Helvetica');
    
    // Émetteur
    const emitterY = doc.y;
    doc.text(ORGANISME.legalName, 50);
    doc.text(ORGANISME.address, 50);
    doc.text(`${ORGANISME.postalCode} ${ORGANISME.city}`, 50);
    doc.text(`SIRET : ${ORGANISME.siret}`, 50);
    doc.text(`TVA : ${ORGANISME.tva}`, 50);

    // Client
    doc.y = emitterY;
    doc.text(client.company || `${client.firstName} ${client.lastName}`, 350);
    if (client.address) {
      doc.text(client.address, 350);
      doc.text(`${client.postalCode} ${client.city}`, 350);
    }
    if (client.siret) doc.text(`SIRET : ${client.siret}`, 350);
    doc.text(client.email, 350);

    doc.moveDown(3);

    // Tableau
    const tableTop = doc.y;
    doc.rect(50, tableTop, doc.page.width - 100, 25).fill('#f5f5f5');
    doc.fillColor('#000000')
       .font('Helvetica-Bold')
       .fontSize(9);
    doc.text('DÉSIGNATION', 55, tableTop + 8);
    doc.text('QTÉ', 300, tableTop + 8, { align: 'center' });
    doc.text('P.U. HT', 380, tableTop + 8, { align: 'center' });
    doc.text('TOTAL HT', 480, tableTop + 8, { align: 'right' });

    // Ligne produit
    doc.font('Helvetica').fontSize(9);
    const lineY = tableTop + 35;
    doc.text(`Formation AI Act - Plan ${purchase.planName}`, 55, lineY);
    doc.fillColor('#666666').fontSize(8);
    doc.text(`${purchase.users} utilisateur(s) - Accès 12 mois`, 55, lineY + 12);
    doc.fillColor('#000000').fontSize(9);
    doc.text(`${purchase.users}`, 300, lineY, { align: 'center' });
    doc.text(`${(purchase.priceHT / purchase.users).toFixed(2)} €`, 380, lineY, { align: 'center' });
    doc.text(`${purchase.priceHT.toFixed(2)} €`, 480, lineY, { align: 'right' });

    // Ligne séparation
    doc.moveTo(50, lineY + 40).lineTo(doc.page.width - 50, lineY + 40).stroke('#cccccc');

    // Totaux
    const totalsY = lineY + 60;
    doc.text('Total HT :', 380, totalsY);
    doc.text(`${purchase.priceHT.toFixed(2)} €`, 480, totalsY, { align: 'right' });
    
    doc.text('TVA (20%) :', 380, totalsY + 15);
    doc.text(`${purchase.tva.toFixed(2)} €`, 480, totalsY + 15, { align: 'right' });
    
    doc.rect(370, totalsY + 30, 175, 25).fill('#00FF88');
    doc.fillColor('#000000').font('Helvetica-Bold').fontSize(11);
    doc.text('Total TTC :', 380, totalsY + 38);
    doc.text(`${purchase.priceTTC.toFixed(2)} €`, 480, totalsY + 38, { align: 'right' });

    // Mention paiement
    doc.fillColor('#059669').font('Helvetica-Bold').fontSize(10);
    doc.text('✓ FACTURE ACQUITTÉE', 50, totalsY + 70);
    doc.fillColor('#000000').font('Helvetica').fontSize(9);
    doc.text(`Paiement reçu le ${purchase.purchaseDate.toLocaleDateString('fr-FR')} par carte bancaire`, 50, totalsY + 85);

    // Infos OPCO
    doc.rect(50, totalsY + 110, doc.page.width - 100, 60).fill('#fafafa');
    doc.fillColor('#000000').font('Helvetica-Bold').fontSize(9);
    doc.text('Informations pour votre OPCO :', 60, totalsY + 120);
    doc.font('Helvetica').fontSize(8);
    doc.text(`• Organisme certifié Qualiopi N° ${ORGANISME.qualiopi}`, 60, totalsY + 135);
    doc.text(`• N° de déclaration d'activité : ${ORGANISME.nda}`, 60, totalsY + 148);
    doc.text('• Durée de formation : 8 heures', 60, totalsY + 161);

    // Pied de page
    doc.fontSize(7).fillColor('#888888');
    doc.text(
      `${ORGANISME.legalName} - SIRET ${ORGANISME.siret} - TVA ${ORGANISME.tva}`,
      50,
      doc.page.height - 40,
      { align: 'center' }
    );

    doc.end();
  });
}

// ============================================
// GÉNÉRATION PROGRAMME PDF
// ============================================
async function generateProgrammePDF(): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50 });
    const chunks: Buffer[] = [];

    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    // En-tête
    doc.rect(0, 0, doc.page.width, 80).fill('#0A0A1B');
    doc.fillColor('#FFFFFF')
       .fontSize(16)
       .font('Helvetica-Bold')
       .text('PROGRAMME DE FORMATION', 50, 20, { align: 'center' });
    doc.fontSize(12)
       .text('Formation AI Act - Conformité Article 4', 50, 42, { align: 'center' });
    doc.fontSize(9)
       .font('Helvetica')
       .text('Durée totale : 8 heures', 50, 60, { align: 'center' });

    doc.fillColor('#000000');
    doc.y = 100;

    // Infos générales
    doc.fontSize(11).font('Helvetica-Bold').text('INFORMATIONS GÉNÉRALES');
    doc.moveDown(0.5);
    doc.fontSize(9).font('Helvetica');
    doc.text(`Organisme : ${ORGANISME.name} - Qualiopi ${ORGANISME.qualiopi}`);
    doc.text('Modalité : Formation en ligne (e-learning asynchrone)');
    doc.text('Accès : 24h/24, 7j/7 pendant 12 mois');
    doc.moveDown(1);

    // Objectifs
    doc.fontSize(11).font('Helvetica-Bold').text('OBJECTIFS PÉDAGOGIQUES');
    doc.moveDown(0.5);
    doc.fontSize(9).font('Helvetica');
    const objectives = [
      'Comprendre le cadre réglementaire de l\'AI Act européen',
      'Identifier et classifier les systèmes d\'IA selon les niveaux de risque',
      'Maîtriser les obligations de l\'Article 4',
      'Mettre en place une gouvernance IA conforme',
      'Réaliser un audit de conformité AI Act',
    ];
    objectives.forEach((obj, i) => {
      doc.text(`${i + 1}. ${obj}`);
    });
    doc.moveDown(1);

    // Modules
    doc.fontSize(11).font('Helvetica-Bold').text('CONTENU DÉTAILLÉ');
    doc.moveDown(0.5);

    const modules = [
      { title: "Module 1 - Fondamentaux de l'AI Act", duration: "45 min" },
      { title: "Module 2 - Classification des Risques", duration: "1h" },
      { title: "Module 3 - Cartographie des Systèmes IA", duration: "1h15" },
      { title: "Module 4 - Gouvernance IA", duration: "1h" },
      { title: "Module 5 - Systèmes à Haut Risque", duration: "1h30" },
      { title: "Module 6 - Audit & Conformité", duration: "1h30" },
    ];

    modules.forEach(module => {
      doc.fontSize(10).font('Helvetica-Bold').text(`${module.title} (${module.duration})`);
      doc.moveDown(0.3);
    });

    doc.moveDown(1);

    // Évaluation
    doc.fontSize(11).font('Helvetica-Bold').text('ÉVALUATION');
    doc.moveDown(0.5);
    doc.fontSize(9).font('Helvetica');
    doc.text('• Quiz de validation à la fin de chaque module');
    doc.text('• Évaluation finale avec score minimum de 80% requis');
    doc.text('• Certificat de réussite nominatif et vérifiable');

    // Pied de page
    doc.fontSize(8).fillColor('#888888');
    doc.text(
      `${ORGANISME.name} - Qualiopi N° ${ORGANISME.qualiopi} - NDA ${ORGANISME.nda}`,
      50,
      doc.page.height - 40,
      { align: 'center' }
    );

    doc.end();
  });
}

// ============================================
// GÉNÉRATION ATTESTATION PDF
// ============================================
async function generateAttestationPDF(
  client: any,
  purchase: any,
  completionDate: Date,
  score: number
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50 });
    const chunks: Buffer[] = [];

    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    // Bordure décorative
    doc.rect(15, 15, doc.page.width - 30, doc.page.height - 30)
       .lineWidth(2)
       .stroke('#00F5FF');

    // En-tête
    doc.fillColor('#666666').fontSize(12).font('Helvetica');
    doc.text(ORGANISME.name, { align: 'center' });
    doc.fontSize(9);
    doc.text(`Organisme certifié Qualiopi - N° ${ORGANISME.qualiopi}`, { align: 'center' });
    doc.text(`N° de déclaration d'activité : ${ORGANISME.nda}`, { align: 'center' });
    doc.moveDown(3);

    // Titre
    doc.fillColor('#0A0A1B').fontSize(24).font('Helvetica-Bold');
    doc.text('ATTESTATION', { align: 'center' });
    doc.fontSize(14);
    doc.text('DE FIN DE FORMATION', { align: 'center' });
    doc.moveDown(2);

    // Corps
    doc.fillColor('#000000').fontSize(11).font('Helvetica');
    doc.text('Je soussigné(e), représentant de l\'organisme de formation', { align: 'center' });
    doc.font('Helvetica-Bold').text(ORGANISME.legalName, { align: 'center' });
    doc.font('Helvetica').text('atteste que :', { align: 'center' });
    doc.moveDown(1.5);

    // Nom participant
    doc.rect(100, doc.y, doc.page.width - 200, 30).fill('#f0f7ff');
    doc.fillColor('#0066CC').fontSize(16).font('Helvetica-Bold');
    doc.text(`${client.firstName} ${client.lastName}`, { align: 'center' });
    doc.moveDown(1.5);

    // Détails
    doc.fillColor('#000000').fontSize(11).font('Helvetica');
    if (client.company) {
      doc.text(`Entreprise : ${client.company}`, { align: 'center' });
      doc.moveDown(0.5);
    }
    doc.text('a suivi et validé avec succès la formation :', { align: 'center' });
    doc.moveDown(1);

    // Formation
    doc.rect(80, doc.y, doc.page.width - 160, 35).fill('#0A0A1B');
    doc.fillColor('#FFFFFF').fontSize(12).font('Helvetica-Bold');
    doc.text('Formation AI Act - Conformité Article 4', { align: 'center' });
    doc.moveDown(2);

    // Infos
    doc.fillColor('#000000').fontSize(10).font('Helvetica');
    doc.text(`Durée : 8 heures`);
    doc.text(`Période : du ${purchase.purchaseDate.toLocaleDateString('fr-FR')} au ${completionDate.toLocaleDateString('fr-FR')}`);
    doc.text('Modalité : Formation en ligne (e-learning)');
    doc.text(`Évaluation : Quiz validé avec ${score}% de réussite`);
    doc.moveDown(2);

    // Signature
    doc.text(`Fait à ${ORGANISME.city}, le ${new Date().toLocaleDateString('fr-FR')}`, { align: 'right' });
    doc.moveDown(1);
    doc.text('Pour l\'organisme de formation,', { align: 'right' });
    doc.font('Helvetica-Bold').text(ORGANISME.name, { align: 'right' });

    // Pied de page
    doc.fontSize(8).fillColor('#888888').font('Helvetica');
    doc.text(
      `${ORGANISME.legalName} - SIRET ${ORGANISME.siret} - NDA ${ORGANISME.nda}`,
      50,
      doc.page.height - 50,
      { align: 'center' }
    );

    doc.end();
  });
}
