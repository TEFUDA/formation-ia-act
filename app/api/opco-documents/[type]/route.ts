// app/api/opco-documents/[type]/route.ts
// Routes pour générer et télécharger les documents PDF OPCO avec upsells inclus

import { NextRequest } from 'next/server';
import PDFDocument from 'pdfkit';

// ============================================
// CONFIGURATION ORGANISME (À PERSONNALISER)
// ============================================
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
  nda: "11 75 12345 67", // Numéro de déclaration d'activité
};

// ============================================
// CATALOGUE PRODUITS
// ============================================
const FORMATIONS = {
  solo: { name: "Formation AI Act - Solo", priceHT: 500, users: 1, duration: "8 heures" },
  solo_upsell: { name: "Formation AI Act - Solo (Offre spéciale)", priceHT: 250, users: 1, duration: "8 heures" },
  equipe: { name: "Formation AI Act - Équipe", priceHT: 2000, users: 10, duration: "8 heures" },
  enterprise: { name: "Formation AI Act - Enterprise", priceHT: 18000, users: 100, duration: "16 heures + accompagnement" },
  bundle: { name: "Formation AI Act - Bundle Complet", priceHT: 799, users: 1, duration: "8 heures" },
};

const TEMPLATES = {
  essentiel: { name: "Pack Templates Essentiel", priceHT: 299, count: 6, description: "6 documents essentiels" },
  complet: { name: "Pack Templates Complet", priceHT: 599, count: 12, description: "12 documents complets" },
};

const AUDITS = {
  starter: { name: "Audit AI Act - Starter", priceHT: 499, description: "30 questions, rapport 15 pages" },
  pro: { name: "Audit AI Act - Pro", priceHT: 999, description: "50 questions, rapport 30 pages, call 30min" },
  enterprise: { name: "Audit AI Act - Enterprise", priceHT: 2999, description: "80+ questions, rapport 50+ pages, workshop" },
};

// ============================================
// TYPES
// ============================================
interface ClientData {
  firstName: string;
  lastName: string;
  email: string;
  company?: string;
  siret?: string;
  address?: string;
  postalCode?: string;
  city?: string;
}

interface PurchaseData {
  planId: string;
  invoiceNumber: string;
  purchaseDate: Date;
  accessEndDate: Date;
  // Upsells optionnels
  templatesPack?: 'essentiel' | 'complet' | null;
  auditPlan?: 'starter' | 'pro' | 'enterprise' | null;
  // Flags
  includeTemplates?: boolean;
  includeAudit?: boolean;
  isBundle?: boolean;
}

interface InvoiceLine {
  description: string;
  details?: string;
  quantity: number;
  unitPriceHT: number;
  totalHT: number;
}

// ============================================
// HELPER: Générer le PDF et retourner un ArrayBuffer
// ============================================
async function generatePDFArrayBuffer(
  buildPDF: (doc: PDFKit.PDFDocument) => void
): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50, size: 'A4' });
    const chunks: Uint8Array[] = [];

    doc.on('data', (chunk: Uint8Array) => chunks.push(chunk));
    doc.on('end', () => {
      const buffer = Buffer.concat(chunks);
      const arrayBuffer = buffer.buffer.slice(
        buffer.byteOffset,
        buffer.byteOffset + buffer.byteLength
      );
      resolve(arrayBuffer);
    });
    doc.on('error', reject);

    buildPDF(doc);
    doc.end();
  });
}

// ============================================
// HELPER: Calculer les totaux avec upsells
// ============================================
function calculateInvoiceLines(purchase: PurchaseData): {
  lines: InvoiceLine[];
  totalHT: number;
  tva: number;
  totalTTC: number;
} {
  const lines: InvoiceLine[] = [];
  
  // 1. Formation principale
  const formation = FORMATIONS[purchase.planId as keyof typeof FORMATIONS] || FORMATIONS.solo;
  lines.push({
    description: formation.name,
    details: `${formation.users} utilisateur(s) - Accès 12 mois - Durée: ${formation.duration}`,
    quantity: 1,
    unitPriceHT: formation.priceHT,
    totalHT: formation.priceHT,
  });

  // 2. Templates (si inclus)
  if (purchase.includeTemplates && purchase.templatesPack) {
    const templates = TEMPLATES[purchase.templatesPack];
    if (templates) {
      lines.push({
        description: `${templates.name} (Ressources pédagogiques)`,
        details: templates.description,
        quantity: 1,
        unitPriceHT: purchase.isBundle ? 0 : templates.priceHT, // Gratuit si bundle
        totalHT: purchase.isBundle ? 0 : templates.priceHT,
      });
    }
  }

  // 3. Audit (si inclus)
  if (purchase.includeAudit && purchase.auditPlan) {
    const audit = AUDITS[purchase.auditPlan];
    if (audit) {
      lines.push({
        description: `${audit.name} (Évaluation des compétences)`,
        details: audit.description,
        quantity: 1,
        unitPriceHT: audit.priceHT,
        totalHT: audit.priceHT,
      });
    }
  }

  // Calcul des totaux
  const totalHT = lines.reduce((sum, line) => sum + line.totalHT, 0);
  const tva = Math.round(totalHT * 0.2 * 100) / 100;
  const totalTTC = totalHT + tva;

  return { lines, totalHT, tva, totalTTC };
}

// ============================================
// ROUTE HANDLER
// ============================================
export async function GET(
  request: NextRequest,
  { params }: { params: { type: string } }
) {
  const { type } = params;
  const searchParams = request.nextUrl.searchParams;
  
  // Récupérer les paramètres
  const invoiceNumber = searchParams.get('invoice') || `FA-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`;
  const planId = searchParams.get('plan') || 'solo';
  const templatesPack = searchParams.get('templates') as 'essentiel' | 'complet' | null;
  const auditPlan = searchParams.get('audit') as 'starter' | 'pro' | 'enterprise' | null;
  const score = parseInt(searchParams.get('score') || '85');

  // Données client (en production, récupérer depuis la BDD avec le token/invoice)
  const mockClient: ClientData = {
    firstName: searchParams.get('firstName') || "Jean",
    lastName: searchParams.get('lastName') || "Dupont",
    email: searchParams.get('email') || "jean.dupont@example.com",
    company: searchParams.get('company') || "Ma Société SAS",
    siret: searchParams.get('siret') || "987 654 321 00001",
    address: searchParams.get('address') || "45 Avenue de l'Innovation",
    postalCode: searchParams.get('postalCode') || "69001",
    city: searchParams.get('city') || "Lyon",
  };

  // Données d'achat
  const mockPurchase: PurchaseData = {
    planId,
    invoiceNumber,
    purchaseDate: new Date(),
    accessEndDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    templatesPack,
    auditPlan,
    includeTemplates: !!templatesPack || planId === 'bundle',
    includeAudit: !!auditPlan,
    isBundle: planId === 'bundle',
  };

  // Si bundle, inclure les templates complet par défaut
  if (planId === 'bundle' && !mockPurchase.templatesPack) {
    mockPurchase.templatesPack = 'complet';
    mockPurchase.includeTemplates = true;
  }

  try {
    let pdfArrayBuffer: ArrayBuffer;
    let filename: string;

    switch (type) {
      case 'convention':
        pdfArrayBuffer = await generateConventionPDF(mockClient, mockPurchase);
        filename = `convention-formation-${invoiceNumber}.pdf`;
        break;

      case 'invoice':
      case 'facture':
        pdfArrayBuffer = await generateInvoicePDF(mockClient, mockPurchase);
        filename = `facture-${invoiceNumber}.pdf`;
        break;

      case 'programme':
        pdfArrayBuffer = await generateProgrammePDF(mockPurchase);
        filename = 'programme-formation-ai-act.pdf';
        break;

      case 'attestation':
        pdfArrayBuffer = await generateAttestationPDF(mockClient, mockPurchase, new Date(), score);
        filename = `attestation-${invoiceNumber}.pdf`;
        break;

      case 'all':
      case 'pack':
        // Retourner une erreur - pour le pack complet, utiliser /api/opco-documents POST
        return new Response(
          JSON.stringify({ error: 'Pour le pack complet, utilisez POST /api/opco-documents' }), 
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );

      default:
        return new Response(
          JSON.stringify({ error: 'Type de document invalide. Types valides: convention, invoice, programme, attestation' }), 
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
    }

    return new Response(pdfArrayBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-cache',
      },
    });

  } catch (error) {
    console.error('PDF generation error:', error);
    return new Response(
      JSON.stringify({ error: 'Erreur lors de la génération du PDF', details: String(error) }), 
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

// ============================================
// GÉNÉRATION CONVENTION PDF (avec upsells)
// ============================================
async function generateConventionPDF(client: ClientData, purchase: PurchaseData): Promise<ArrayBuffer> {
  const { lines, totalHT, tva, totalTTC } = calculateInvoiceLines(purchase);
  const formation = FORMATIONS[purchase.planId as keyof typeof FORMATIONS] || FORMATIONS.solo;

  return generatePDFArrayBuffer((doc) => {
    // === EN-TÊTE ===
    doc.rect(0, 0, doc.page.width, 85).fill('#0A0A1B');
    
    doc.fillColor('#FFFFFF')
       .fontSize(20)
       .font('Helvetica-Bold')
       .text(ORGANISME.name, 50, 25, { align: 'center' });
    
    doc.fontSize(10)
       .font('Helvetica')
       .text(`Organisme de formation certifié Qualiopi`, 50, 50, { align: 'center' });
    doc.text(`N° ${ORGANISME.qualiopi} | NDA : ${ORGANISME.nda}`, 50, 63, { align: 'center' });

    doc.fillColor('#000000');
    doc.y = 105;

    // === TITRE ===
    doc.fontSize(16)
       .font('Helvetica-Bold')
       .fillColor('#0A0A1B')
       .text('CONVENTION DE FORMATION PROFESSIONNELLE', { align: 'center' });
    doc.fontSize(11)
       .font('Helvetica')
       .fillColor('#666666')
       .text(`N° ${purchase.invoiceNumber}`, { align: 'center' });
    doc.moveDown(1.5);

    // === ARTICLE 1 - PARTIES ===
    doc.fillColor('#000000');
    doc.fontSize(12).font('Helvetica-Bold').text('ARTICLE 1 – LES PARTIES');
    doc.moveDown(0.5);
    doc.fontSize(10).font('Helvetica');
    
    doc.text('Entre les soussignés :');
    doc.moveDown(0.3);
    
    // Organisme
    doc.font('Helvetica-Bold').text("L'Organisme de formation :");
    doc.font('Helvetica');
    doc.text(`${ORGANISME.legalName}`);
    doc.text(`${ORGANISME.address}, ${ORGANISME.postalCode} ${ORGANISME.city}`);
    doc.text(`SIRET : ${ORGANISME.siret} | TVA : ${ORGANISME.tva}`);
    doc.text(`N° de déclaration d'activité : ${ORGANISME.nda}`);
    doc.moveDown(0.5);
    
    doc.text('Ci-après dénommé "l\'Organisme"');
    doc.moveDown(0.5);
    
    doc.font('Helvetica-Bold').text('Et');
    doc.moveDown(0.3);
    
    // Client
    doc.font('Helvetica-Bold').text('Le Client :');
    doc.font('Helvetica');
    doc.text(`${client.company || `${client.firstName} ${client.lastName}`}`);
    if (client.address) doc.text(`${client.address}, ${client.postalCode} ${client.city}`);
    if (client.siret) doc.text(`SIRET : ${client.siret}`);
    doc.text(`Représenté par : ${client.firstName} ${client.lastName}`);
    doc.text(`Email : ${client.email}`);
    doc.moveDown(0.3);
    doc.text('Ci-après dénommé "le Client"');
    doc.moveDown(1.5);

    // === ARTICLE 2 - OBJET ===
    doc.fontSize(12).font('Helvetica-Bold').text('ARTICLE 2 – OBJET DE LA CONVENTION');
    doc.moveDown(0.5);
    doc.fontSize(10).font('Helvetica');
    
    doc.text("La présente convention a pour objet de définir les conditions dans lesquelles l'Organisme s'engage à dispenser la formation suivante :");
    doc.moveDown(0.5);

    // Tableau des prestations
    doc.font('Helvetica-Bold').text('Prestations incluses :');
    doc.moveDown(0.3);
    
    lines.forEach((line, index) => {
      doc.font('Helvetica-Bold').text(`${index + 1}. ${line.description}`, { continued: false });
      if (line.details) {
        doc.font('Helvetica').text(`   ${line.details}`);
      }
      doc.font('Helvetica').text(`   Montant HT : ${line.totalHT.toFixed(2)} €`);
      doc.moveDown(0.3);
    });

    doc.moveDown(0.5);
    doc.text(`Durée totale de la formation : ${formation.duration}`);
    doc.text(`Nombre de participants : ${formation.users} personne(s)`);
    doc.text('Modalité : Formation en ligne (e-learning asynchrone)');
    doc.moveDown(1.5);

    // === ARTICLE 3 - CONDITIONS FINANCIÈRES ===
    doc.fontSize(12).font('Helvetica-Bold').text('ARTICLE 3 – CONDITIONS FINANCIÈRES');
    doc.moveDown(0.5);
    doc.fontSize(10).font('Helvetica');
    
    doc.text('Le coût de la formation est fixé comme suit :');
    doc.moveDown(0.3);

    // Détail par ligne
    lines.forEach(line => {
      doc.text(`• ${line.description} : ${line.totalHT.toFixed(2)} € HT`);
    });
    doc.moveDown(0.3);

    // Totaux
    doc.font('Helvetica-Bold');
    doc.text(`Total HT : ${totalHT.toFixed(2)} €`);
    doc.text(`TVA (20%) : ${tva.toFixed(2)} €`);
    doc.text(`Total TTC : ${totalTTC.toFixed(2)} €`);
    doc.font('Helvetica');
    doc.moveDown(1);

    // Info OPCO
    doc.rect(50, doc.y, doc.page.width - 100, 45).fill('#f0fdf4');
    doc.fillColor('#065f46').fontSize(9);
    const opcoY = doc.y + 10;
    doc.text('💰 PRISE EN CHARGE OPCO', 60, opcoY, { underline: true });
    doc.text("Cette formation est éligible à une prise en charge par votre OPCO.", 60, opcoY + 15);
    doc.text("L'ensemble des prestations ci-dessus peuvent être incluses dans votre demande de financement.", 60, opcoY + 27);
    doc.fillColor('#000000');
    doc.y = opcoY + 55;

    // === ARTICLE 4 - DATES ===
    doc.fontSize(12).font('Helvetica-Bold').text('ARTICLE 4 – PÉRIODE DE RÉALISATION');
    doc.moveDown(0.5);
    doc.fontSize(10).font('Helvetica');
    doc.text(`Date de début d'accès : ${purchase.purchaseDate.toLocaleDateString('fr-FR')}`);
    doc.text(`Date de fin d'accès : ${purchase.accessEndDate.toLocaleDateString('fr-FR')}`);
    doc.text("Le stagiaire dispose d'un accès 24h/24 et 7j/7 à la plateforme de formation.");
    doc.moveDown(1.5);

    // === ARTICLE 5 - MODALITÉS ===
    doc.fontSize(12).font('Helvetica-Bold').text('ARTICLE 5 – MODALITÉS DE RÉALISATION');
    doc.moveDown(0.5);
    doc.fontSize(10).font('Helvetica');
    doc.text("La formation est dispensée en e-learning via la plateforme sécurisée de l'Organisme.");
    doc.text("Elle comprend :");
    doc.text("• 6 modules de formation interactifs");
    doc.text("• Quiz de validation à chaque étape");
    doc.text("• Évaluation finale avec score minimum de 80% requis");
    doc.text("• Certificat de réussite nominatif et vérifiable");
    if (purchase.includeTemplates) {
      doc.text("• Ressources pédagogiques téléchargeables (templates)");
    }
    if (purchase.includeAudit) {
      doc.text("• Évaluation des compétences acquises (audit)");
    }
    doc.moveDown(1.5);

    // === SIGNATURES ===
    // Vérifier si on a besoin d'une nouvelle page
    if (doc.y > 650) {
      doc.addPage();
      doc.y = 50;
    }

    doc.fontSize(12).font('Helvetica-Bold').text('ARTICLE 6 – SIGNATURES');
    doc.moveDown(0.5);
    doc.fontSize(10).font('Helvetica');
    doc.text(`Fait en deux exemplaires, le ${new Date().toLocaleDateString('fr-FR')}`);
    doc.moveDown(1.5);

    const sigY = doc.y;
    doc.text("Pour l'Organisme de formation :", 50, sigY);
    doc.text("Pour le Client :", 320, sigY);
    
    doc.text(ORGANISME.legalName, 50, sigY + 15);
    doc.text(client.company || `${client.firstName} ${client.lastName}`, 320, sigY + 15);
    
    doc.text("(Signature et cachet)", 50, sigY + 60);
    doc.text("(Signature et cachet)", 320, sigY + 60);
    doc.text('"Lu et approuvé"', 320, sigY + 75);

    // === PIED DE PAGE ===
    doc.fontSize(8)
       .fillColor('#888888')
       .text(
         `${ORGANISME.legalName} | ${ORGANISME.address}, ${ORGANISME.postalCode} ${ORGANISME.city} | ${ORGANISME.email} | ${ORGANISME.phone}`,
         50,
         doc.page.height - 40,
         { align: 'center', width: doc.page.width - 100 }
       );
  });
}

// ============================================
// GÉNÉRATION FACTURE PDF (avec upsells)
// ============================================
async function generateInvoicePDF(client: ClientData, purchase: PurchaseData): Promise<ArrayBuffer> {
  const { lines, totalHT, tva, totalTTC } = calculateInvoiceLines(purchase);

  return generatePDFArrayBuffer((doc) => {
    // === EN-TÊTE ===
    doc.rect(0, 0, doc.page.width, 100).fill('#0A0A1B');
    
    // Titre FACTURE
    doc.fillColor('#FFFFFF')
       .fontSize(28)
       .font('Helvetica-Bold')
       .text('FACTURE', 50, 30);
    
    doc.fontSize(11)
       .font('Helvetica')
       .text(`N° ${purchase.invoiceNumber}`, 50, 62);
    doc.text(`Date : ${purchase.purchaseDate.toLocaleDateString('fr-FR')}`, 50, 77);
    
    // Logo / Nom organisme
    doc.fontSize(14)
       .font('Helvetica-Bold')
       .text(ORGANISME.name, doc.page.width - 200, 35, { align: 'right', width: 150 });
    doc.fontSize(9)
       .font('Helvetica')
       .text(`Qualiopi N° ${ORGANISME.qualiopi}`, doc.page.width - 200, 55, { align: 'right', width: 150 });
    doc.text(`NDA : ${ORGANISME.nda}`, doc.page.width - 200, 68, { align: 'right', width: 150 });

    doc.fillColor('#000000');
    doc.y = 120;

    // === ÉMETTEUR ET CLIENT ===
    const infoY = doc.y;
    
    // Émetteur (gauche)
    doc.fontSize(10).font('Helvetica-Bold').text('ÉMETTEUR', 50, infoY);
    doc.fontSize(9).font('Helvetica');
    doc.text(ORGANISME.legalName, 50, infoY + 15);
    doc.text(ORGANISME.address, 50, infoY + 27);
    doc.text(`${ORGANISME.postalCode} ${ORGANISME.city}`, 50, infoY + 39);
    doc.text(`SIRET : ${ORGANISME.siret}`, 50, infoY + 51);
    doc.text(`TVA : ${ORGANISME.tva}`, 50, infoY + 63);
    doc.text(`Tél : ${ORGANISME.phone}`, 50, infoY + 75);

    // Client (droite)
    doc.fontSize(10).font('Helvetica-Bold').text('CLIENT', 350, infoY);
    doc.fontSize(9).font('Helvetica');
    doc.text(client.company || `${client.firstName} ${client.lastName}`, 350, infoY + 15);
    if (client.address) {
      doc.text(client.address, 350, infoY + 27);
      doc.text(`${client.postalCode} ${client.city}`, 350, infoY + 39);
    }
    if (client.siret) doc.text(`SIRET : ${client.siret}`, 350, infoY + 51);
    doc.text(client.email, 350, infoY + 63);

    doc.y = infoY + 100;

    // === TABLEAU DES PRESTATIONS ===
    const tableTop = doc.y;
    const tableWidth = doc.page.width - 100;
    
    // En-tête du tableau
    doc.rect(50, tableTop, tableWidth, 28).fill('#f5f5f5');
    doc.fillColor('#000000').font('Helvetica-Bold').fontSize(9);
    doc.text('DÉSIGNATION', 60, tableTop + 10);
    doc.text('QTÉ', 350, tableTop + 10, { width: 40, align: 'center' });
    doc.text('P.U. HT', 400, tableTop + 10, { width: 60, align: 'right' });
    doc.text('TOTAL HT', 470, tableTop + 10, { width: 70, align: 'right' });

    // Lignes du tableau
    let currentY = tableTop + 35;
    doc.font('Helvetica').fontSize(9);

    lines.forEach((line, index) => {
      // Alternance de couleur
      if (index % 2 === 1) {
        doc.rect(50, currentY - 5, tableWidth, 35).fill('#fafafa');
      }
      
      doc.fillColor('#000000');
      doc.font('Helvetica-Bold').text(line.description, 60, currentY, { width: 280 });
      if (line.details) {
        doc.font('Helvetica').fontSize(8).fillColor('#666666');
        doc.text(line.details, 60, currentY + 12, { width: 280 });
        doc.fontSize(9).fillColor('#000000');
      }
      
      doc.font('Helvetica');
      doc.text(line.quantity.toString(), 350, currentY, { width: 40, align: 'center' });
      doc.text(`${line.unitPriceHT.toFixed(2)} €`, 400, currentY, { width: 60, align: 'right' });
      doc.text(`${line.totalHT.toFixed(2)} €`, 470, currentY, { width: 70, align: 'right' });
      
      currentY += line.details ? 40 : 25;
    });

    // Ligne de séparation
    doc.moveTo(50, currentY + 5).lineTo(50 + tableWidth, currentY + 5).stroke('#e5e5e5');
    currentY += 15;

    // === TOTAUX ===
    const totalsX = 380;
    
    doc.font('Helvetica').fontSize(10);
    doc.text('Total HT :', totalsX, currentY);
    doc.text(`${totalHT.toFixed(2)} €`, 470, currentY, { width: 70, align: 'right' });
    currentY += 18;
    
    doc.text('TVA (20%) :', totalsX, currentY);
    doc.text(`${tva.toFixed(2)} €`, 470, currentY, { width: 70, align: 'right' });
    currentY += 18;

    // Total TTC avec fond vert
    doc.rect(totalsX - 10, currentY - 5, 160, 30).fill('#00FF88');
    doc.fillColor('#000000').font('Helvetica-Bold').fontSize(12);
    doc.text('Total TTC :', totalsX, currentY + 3);
    doc.text(`${totalTTC.toFixed(2)} €`, 470, currentY + 3, { width: 70, align: 'right' });
    
    currentY += 45;

    // === MENTION PAIEMENT ===
    doc.font('Helvetica-Bold').fontSize(11).fillColor('#059669');
    doc.text('✓ FACTURE ACQUITTÉE', 50, currentY);
    doc.font('Helvetica').fontSize(9).fillColor('#000000');
    doc.text(`Paiement reçu le ${purchase.purchaseDate.toLocaleDateString('fr-FR')} par carte bancaire`, 50, currentY + 15);
    
    currentY += 45;

    // === ENCART OPCO ===
    doc.rect(50, currentY, tableWidth, 60).fill('#f0fdf4').stroke('#a7f3d0');
    doc.fillColor('#065f46').font('Helvetica-Bold').fontSize(10);
    doc.text('💰 INFORMATIONS POUR VOTRE OPCO', 60, currentY + 10);
    doc.font('Helvetica').fontSize(9);
    doc.text(`• Organisme certifié Qualiopi N° ${ORGANISME.qualiopi}`, 60, currentY + 28);
    doc.text(`• N° de déclaration d'activité : ${ORGANISME.nda}`, 60, currentY + 40);
    doc.text(`• Toutes les prestations ci-dessus sont éligibles au financement OPCO`, 60, currentY + 52);

    // === PIED DE PAGE ===
    doc.fontSize(7)
       .fillColor('#888888')
       .text(
         `${ORGANISME.legalName} - SIRET ${ORGANISME.siret} - TVA ${ORGANISME.tva} - ${ORGANISME.email}`,
         50,
         doc.page.height - 30,
         { align: 'center', width: doc.page.width - 100 }
       );
  });
}

// ============================================
// GÉNÉRATION PROGRAMME PDF (avec mention ressources)
// ============================================
async function generateProgrammePDF(purchase: PurchaseData): Promise<ArrayBuffer> {
  const formation = FORMATIONS[purchase.planId as keyof typeof FORMATIONS] || FORMATIONS.solo;

  return generatePDFArrayBuffer((doc) => {
    // === EN-TÊTE ===
    doc.rect(0, 0, doc.page.width, 90).fill('#0A0A1B');
    
    doc.fillColor('#FFFFFF')
       .fontSize(18)
       .font('Helvetica-Bold')
       .text('PROGRAMME DE FORMATION', 50, 20, { align: 'center' });
    
    doc.fontSize(14)
       .text('Formation AI Act - Conformité Article 4', 50, 45, { align: 'center' });
    
    doc.fontSize(10)
       .font('Helvetica')
       .text(`Durée : ${formation.duration} | Modalité : E-learning`, 50, 70, { align: 'center' });

    doc.fillColor('#000000');
    doc.y = 110;

    // === INFORMATIONS GÉNÉRALES ===
    doc.fontSize(12).font('Helvetica-Bold').fillColor('#0A0A1B').text('INFORMATIONS GÉNÉRALES');
    doc.moveDown(0.5);
    doc.fontSize(10).font('Helvetica').fillColor('#000000');
    doc.text(`Organisme : ${ORGANISME.name}`);
    doc.text(`Certification : Qualiopi N° ${ORGANISME.qualiopi}`);
    doc.text(`Modalité : Formation 100% en ligne (e-learning asynchrone)`);
    doc.text(`Accès : 24h/24, 7j/7 pendant 12 mois`);
    doc.text(`Public visé : Dirigeants, managers, DPO, responsables conformité, DSI`);
    doc.text(`Prérequis : Aucun prérequis technique. Connexion internet requise.`);
    doc.moveDown(1);

    // === OBJECTIFS PÉDAGOGIQUES ===
    doc.fontSize(12).font('Helvetica-Bold').fillColor('#0A0A1B').text('OBJECTIFS PÉDAGOGIQUES');
    doc.moveDown(0.5);
    doc.fontSize(10).font('Helvetica').fillColor('#000000');
    
    const objectives = [
      "Comprendre le cadre réglementaire de l'AI Act européen et ses implications",
      "Identifier et classifier les systèmes d'IA selon les 4 niveaux de risque",
      "Maîtriser les obligations de l'Article 4 relatives à la formation",
      "Mettre en place une gouvernance IA conforme aux exigences",
      "Réaliser un audit de conformité AI Act de son organisation",
      "Documenter les systèmes d'IA conformément aux exigences réglementaires",
    ];
    
    objectives.forEach((obj, i) => {
      doc.text(`${i + 1}. ${obj}`);
    });
    doc.moveDown(1);

    // === CONTENU DÉTAILLÉ ===
    doc.fontSize(12).font('Helvetica-Bold').fillColor('#0A0A1B').text('CONTENU DÉTAILLÉ');
    doc.moveDown(0.5);

    const modules = [
      {
        title: "Module 1 - Fondamentaux de l'AI Act",
        duration: "45 min",
        content: ["Contexte et genèse du règlement", "Champ d'application territorial et matériel", "Calendrier d'entrée en vigueur", "Articulation avec le RGPD"],
      },
      {
        title: "Module 2 - Classification des Risques",
        duration: "1h",
        content: ["Les 4 niveaux de risque (inacceptable, haut, limité, minimal)", "Critères de classification", "Exemples concrets par secteur", "Cas pratiques"],
      },
      {
        title: "Module 3 - Cartographie des Systèmes IA",
        duration: "1h15",
        content: ["Méthodologie d'inventaire", "Identification des systèmes IA en entreprise", "Outils de cartographie", "Registre des systèmes IA"],
      },
      {
        title: "Module 4 - Gouvernance IA",
        duration: "1h",
        content: ["Politique d'utilisation de l'IA", "Rôles et responsabilités", "Comité de gouvernance", "Processus de validation"],
      },
      {
        title: "Module 5 - Systèmes à Haut Risque",
        duration: "1h30",
        content: ["Obligations spécifiques", "Documentation technique requise", "Évaluation de conformité", "Marquage CE"],
      },
      {
        title: "Module 6 - Audit et Conformité",
        duration: "1h30",
        content: ["Méthodologie d'audit AI Act", "Plan d'action de mise en conformité", "Préparation aux contrôles", "Sanctions et risques"],
      },
    ];

    modules.forEach((module) => {
      doc.fontSize(11).font('Helvetica-Bold').fillColor('#0066FF');
      doc.text(`${module.title} (${module.duration})`);
      doc.fontSize(9).font('Helvetica').fillColor('#000000');
      module.content.forEach(item => {
        doc.text(`   • ${item}`);
      });
      doc.moveDown(0.5);
    });

    // === RESSOURCES PÉDAGOGIQUES ===
    if (purchase.includeTemplates) {
      doc.moveDown(0.5);
      doc.fontSize(12).font('Helvetica-Bold').fillColor('#0A0A1B').text('RESSOURCES PÉDAGOGIQUES INCLUSES');
      doc.moveDown(0.5);
      doc.fontSize(10).font('Helvetica').fillColor('#000000');
      
      const templates = [
        "Template Registre IA (Excel)",
        "Modèle Politique IA (Word)",
        "Matrice de Classification des Risques (Excel)",
        "Checklist de conformité (Excel)",
        "Template Documentation Technique (Word)",
        "Fiche de poste Référent IA (Word)",
      ];
      
      if (purchase.templatesPack === 'complet') {
        templates.push(
          "Guide AI Act - Synthèse (PDF)",
          "Plan d'Audit Type (Excel)",
          "Tableau de Bord Conformité (Excel)",
          "Guide Audit Pas à Pas (PDF)",
          "Checklist Marquage CE (Excel)",
          "Exemples par Secteur d'Activité (PDF)"
        );
      }
      
      templates.forEach(t => doc.text(`   📄 ${t}`));
    }

    // Nouvelle page pour la suite
    doc.addPage();
    doc.y = 50;

    // === ÉVALUATION ===
    doc.fontSize(12).font('Helvetica-Bold').fillColor('#0A0A1B').text('MODALITÉS D\'ÉVALUATION');
    doc.moveDown(0.5);
    doc.fontSize(10).font('Helvetica').fillColor('#000000');
    doc.text("• Quiz de validation à la fin de chaque module");
    doc.text("• Évaluation finale avec score minimum de 80% requis pour l'obtention du certificat");
    doc.text("• Certificat de réussite nominatif et vérifiable en ligne");
    doc.text("• Attestation de fin de formation pour votre OPCO");
    
    if (purchase.includeAudit) {
      doc.moveDown(0.5);
      doc.font('Helvetica-Bold').text("Évaluation complémentaire (Audit) :");
      doc.font('Helvetica');
      const audit = AUDITS[purchase.auditPlan as keyof typeof AUDITS];
      if (audit) {
        doc.text(`   • ${audit.name}`);
        doc.text(`   • ${audit.description}`);
      }
    }
    doc.moveDown(1);

    // === MOYENS PÉDAGOGIQUES ===
    doc.fontSize(12).font('Helvetica-Bold').fillColor('#0A0A1B').text('MOYENS PÉDAGOGIQUES ET TECHNIQUES');
    doc.moveDown(0.5);
    doc.fontSize(10).font('Helvetica').fillColor('#000000');
    doc.text("• Plateforme e-learning accessible 24h/24");
    doc.text("• Vidéos explicatives et animations");
    doc.text("• Supports de cours téléchargeables");
    doc.text("• Quiz interactifs et exercices pratiques");
    doc.text("• Forum de discussion avec les formateurs");
    doc.text("• Support technique par email");
    doc.moveDown(1);

    // === ENCADREMENT ===
    doc.fontSize(12).font('Helvetica-Bold').fillColor('#0A0A1B').text('ENCADREMENT');
    doc.moveDown(0.5);
    doc.fontSize(10).font('Helvetica').fillColor('#000000');
    doc.text("Formation conçue et supervisée par des experts en conformité réglementaire");
    doc.text("et en intelligence artificielle, avec une expérience en audit et conseil");
    doc.text("auprès d'entreprises de toutes tailles.");
    doc.moveDown(1);

    // === ACCESSIBILITÉ ===
    doc.fontSize(12).font('Helvetica-Bold').fillColor('#0A0A1B').text('ACCESSIBILITÉ');
    doc.moveDown(0.5);
    doc.fontSize(10).font('Helvetica').fillColor('#000000');
    doc.text("Cette formation est accessible aux personnes en situation de handicap.");
    doc.text("Contactez-nous pour étudier les adaptations possibles.");
    doc.text(`Email : ${ORGANISME.email} | Tél : ${ORGANISME.phone}`);

    // === PIED DE PAGE ===
    doc.fontSize(8)
       .fillColor('#888888')
       .text(
         `${ORGANISME.name} - Certifié Qualiopi N° ${ORGANISME.qualiopi} - NDA ${ORGANISME.nda}`,
         50,
         doc.page.height - 30,
         { align: 'center', width: doc.page.width - 100 }
       );
  });
}

// ============================================
// GÉNÉRATION ATTESTATION PDF
// ============================================
async function generateAttestationPDF(
  client: ClientData,
  purchase: PurchaseData,
  completionDate: Date,
  score: number
): Promise<ArrayBuffer> {
  const formation = FORMATIONS[purchase.planId as keyof typeof FORMATIONS] || FORMATIONS.solo;

  return generatePDFArrayBuffer((doc) => {
    // === BORDURE DÉCORATIVE ===
    doc.rect(20, 20, doc.page.width - 40, doc.page.height - 40)
       .lineWidth(3)
       .stroke('#00F5FF');
    
    doc.rect(25, 25, doc.page.width - 50, doc.page.height - 50)
       .lineWidth(1)
       .stroke('#0066FF');

    // === EN-TÊTE ===
    doc.fillColor('#666666').fontSize(11).font('Helvetica');
    doc.text(ORGANISME.name, 50, 50, { align: 'center' });
    doc.fontSize(9);
    doc.text(`Organisme de formation certifié Qualiopi - N° ${ORGANISME.qualiopi}`, { align: 'center' });
    doc.text(`N° de déclaration d'activité : ${ORGANISME.nda}`, { align: 'center' });

    doc.moveDown(3);

    // === TITRE ===
    doc.fillColor('#0A0A1B').fontSize(28).font('Helvetica-Bold');
    doc.text('ATTESTATION', { align: 'center' });
    doc.fontSize(16);
    doc.text('DE FIN DE FORMATION', { align: 'center' });

    doc.moveDown(2);

    // === CORPS ===
    doc.fillColor('#000000').fontSize(12).font('Helvetica');
    doc.text("Je soussigné(e), représentant de l'organisme de formation", { align: 'center' });
    doc.font('Helvetica-Bold').text(ORGANISME.legalName, { align: 'center' });
    doc.font('Helvetica').text('atteste que :', { align: 'center' });

    doc.moveDown(1.5);

    // === NOM DU PARTICIPANT ===
    doc.fillColor('#0066FF').fontSize(20).font('Helvetica-Bold');
    doc.text(`${client.firstName} ${client.lastName}`, { align: 'center' });

    doc.moveDown(1);

    // === DÉTAILS ===
    doc.fillColor('#000000').fontSize(11).font('Helvetica');
    if (client.company) {
      doc.text(`Entreprise : ${client.company}`, { align: 'center' });
      doc.moveDown(0.3);
    }
    doc.text('a suivi et validé avec succès la formation :', { align: 'center' });

    doc.moveDown(1);

    // === INTITULÉ FORMATION ===
    doc.fontSize(14).font('Helvetica-Bold').fillColor('#0A0A1B');
    doc.text(formation.name, { align: 'center' });

    doc.moveDown(1.5);

    // === INFORMATIONS ===
    doc.fontSize(11).font('Helvetica').fillColor('#000000');
    doc.text(`Durée : ${formation.duration}`, { align: 'center' });
    doc.text(`Période : du ${purchase.purchaseDate.toLocaleDateString('fr-FR')} au ${completionDate.toLocaleDateString('fr-FR')}`, { align: 'center' });
    doc.text('Modalité : Formation en ligne (e-learning)', { align: 'center' });
    doc.text(`Évaluation : Quiz validé avec ${score}% de réussite`, { align: 'center' });

    // Mention ressources si incluses
    if (purchase.includeTemplates || purchase.includeAudit) {
      doc.moveDown(0.5);
      doc.fontSize(10).fillColor('#666666');
      let extras = [];
      if (purchase.includeTemplates) extras.push('Ressources pédagogiques');
      if (purchase.includeAudit) extras.push('Évaluation des compétences');
      doc.text(`Incluant : ${extras.join(' et ')}`, { align: 'center' });
    }

    doc.moveDown(2);

    // === OBJECTIFS ATTEINTS ===
    doc.fillColor('#000000').fontSize(10).font('Helvetica');
    doc.text('Objectifs pédagogiques atteints :', { align: 'center' });
    doc.moveDown(0.5);
    doc.fontSize(9);
    doc.text("✓ Compréhension du cadre réglementaire AI Act", { align: 'center' });
    doc.text("✓ Classification des systèmes d'IA par niveau de risque", { align: 'center' });
    doc.text("✓ Maîtrise des obligations de l'Article 4", { align: 'center' });
    doc.text("✓ Capacité à mettre en place une gouvernance IA conforme", { align: 'center' });

    doc.moveDown(2);

    // === SIGNATURE ===
    doc.fontSize(10).font('Helvetica');
    doc.text(`Fait à ${ORGANISME.city}, le ${new Date().toLocaleDateString('fr-FR')}`, doc.page.width - 250, doc.y, { align: 'right', width: 200 });
    doc.moveDown(1);
    doc.text("Pour l'organisme de formation,", doc.page.width - 250, doc.y, { align: 'right', width: 200 });
    doc.font('Helvetica-Bold').text(ORGANISME.name, doc.page.width - 250, doc.y + 15, { align: 'right', width: 200 });

    // === PIED DE PAGE ===
    doc.fontSize(8)
       .fillColor('#888888')
       .font('Helvetica')
       .text(
         `${ORGANISME.legalName} - SIRET ${ORGANISME.siret} - NDA ${ORGANISME.nda}`,
         50,
         doc.page.height - 50,
         { align: 'center', width: doc.page.width - 100 }
       );
    
    // ID de vérification
    const verificationId = `CERT-${Date.now().toString(36).toUpperCase()}`;
    doc.fontSize(7)
       .text(
         `Certificat vérifiable sur ${ORGANISME.website}/verify/${verificationId}`,
         50,
         doc.page.height - 38,
         { align: 'center', width: doc.page.width - 100 }
       );
  });
}
