// lib/opco-documents.ts
// Génération automatique des documents OPCO pour le remboursement

import { jsPDF } from 'jspdf';

// Types
interface ClientInfo {
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  siret?: string;
  address?: string;
  postalCode?: string;
  city?: string;
  phone?: string;
}

interface PurchaseInfo {
  planId: 'solo' | 'equipe' | 'enterprise';
  planName: string;
  priceHT: number;
  priceTTC: number;
  tva: number;
  users: number;
  invoiceNumber: string;
  purchaseDate: Date;
  accessEndDate: Date;
}

interface FormationInfo {
  title: string;
  duration: string;
  modules: { title: string; duration: string }[];
  objectives: string[];
  prerequisites: string[];
  targetAudience: string[];
  methods: string[];
  evaluation: string[];
}

// Infos de l'organisme de formation (à personnaliser)
const ORGANISME = {
  name: "Formation-IA-Act.fr",
  legalName: "MODERNEE",
  address: "125 rue du moulin",
  postalCode: "80000",
  city: "Amiens",
  siret: "943 258 996", 
  qualiopi: "2024/12345-FR", // À adapter
  email: "contact@formation-ia-act.fr",
  phone: "06 01 05 37 53",
  website: "https://formation-ia-act.fr",
  rcs: "Paris B 123 456 789", // À adapter
  capital: "500",
  nda: "11 75 12345 67", // Numéro de déclaration d'activité
};

// Infos de la formation
const FORMATION: FormationInfo = {
  title: "Formation AI Act - Conformité Article 4",
  duration: "4 heures (réparties sur 6 modules)",
  modules: [
    { title: "Module 1 - Fondamentaux de l'AI Act", duration: "25 min" },
    { title: "Module 2 - Classification des Risques IA", duration: "25 min" },
    { title: "Module 3 - Cartographie des Systèmes IA", duration: "55 min" },
    { title: "Module 4 - Gouvernance IA en Entreprise", duration: "1h" },
    { title: "Module 5 - Systèmes à Haut Risque", duration: "1h30" },
    { title: "Module 6 - Audit & Mise en Conformité", duration: "1h30" },
  ],
  objectives: [
    "Comprendre le cadre réglementaire de l'AI Act européen",
    "Identifier et classifier les systèmes d'IA de l'entreprise selon les niveaux de risque",
    "Maîtriser les obligations de l'Article 4 relatives à la maîtrise de l'IA",
    "Mettre en place une gouvernance IA conforme",
    "Réaliser un audit de conformité AI Act",
    "Documenter les systèmes IA selon les exigences réglementaires",
  ],
  prerequisites: [
    "Aucun prérequis technique",
    "Connaissance basique du fonctionnement de l'entreprise",
  ],
  targetAudience: [
    "DPO (Délégués à la Protection des Données)",
    "Responsables conformité et juridique",
    "DSI et responsables IT",
    "Chefs de projet IA et Data Scientists",
    "Dirigeants et managers",
    "Toute personne impliquée dans l'utilisation de systèmes d'IA",
  ],
  methods: [
    "Modules vidéo interactifs",
    "Cas pratiques et exercices",
    "Templates et checklists téléchargeables",
    "Quiz de validation des acquis",
    "Accès à une communauté d'apprenants",
  ],
  evaluation: [
    "Quiz de validation à la fin de chaque module",
    "Évaluation finale avec score minimum de 80% requis",
    "Certificat de réussite nominatif et vérifiable",
  ],
};

// Plans
const PLANS = {
  solo: { name: "Solo", priceHT: 500, users: 1 },
  equipe: { name: "Équipe", priceHT: 2000, users: 5 },
  enterprise: { name: "Enterprise", priceHT: 18000, users: 50 },
};

// ============================================
// GÉNÉRATION DE LA CONVENTION DE FORMATION
// ============================================
export function generateConvention(client: ClientInfo, purchase: PurchaseInfo): jsPDF {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 20;

  // Helper functions
  const addTitle = (text: string, size: number = 16) => {
    doc.setFontSize(size);
    doc.setFont('helvetica', 'bold');
    doc.text(text, pageWidth / 2, y, { align: 'center' });
    y += size * 0.5;
  };

  const addSection = (title: string) => {
    y += 8;
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text(title, 20, y);
    y += 6;
    doc.setFont('helvetica', 'normal');
  };

  const addText = (text: string, indent: number = 20) => {
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const lines = doc.splitTextToSize(text, pageWidth - indent - 20);
    doc.text(lines, indent, y);
    y += lines.length * 5;
  };

  const addNewPage = () => {
    doc.addPage();
    y = 20;
  };

  // En-tête
  doc.setFillColor(10, 10, 27);
  doc.rect(0, 0, pageWidth, 40, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text(ORGANISME.name, pageWidth / 2, 18, { align: 'center' });
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Organisme certifié Qualiopi - N° ${ORGANISME.qualiopi}`, pageWidth / 2, 28, { align: 'center' });
  doc.text(`N° de déclaration d'activité : ${ORGANISME.nda}`, pageWidth / 2, 35, { align: 'center' });
  
  doc.setTextColor(0, 0, 0);
  y = 55;

  // Titre
  addTitle('CONVENTION DE FORMATION PROFESSIONNELLE', 14);
  doc.setFontSize(10);
  doc.text(`N° ${purchase.invoiceNumber}`, pageWidth / 2, y, { align: 'center' });
  y += 10;

  // Article 1 - Parties
  addSection('ARTICLE 1 - PARTIES');
  addText(`Entre les soussignés :`);
  y += 3;
  addText(`L'organisme de formation : ${ORGANISME.legalName}`, 25);
  addText(`Siège social : ${ORGANISME.address}, ${ORGANISME.postalCode} ${ORGANISME.city}`, 25);
  addText(`SIRET : ${ORGANISME.siret}`, 25);
  addText(`N° de déclaration d'activité : ${ORGANISME.nda}`, 25);
  addText(`Ci-après dénommé "l'Organisme"`, 25);
  y += 5;
  addText(`Et`, 25);
  y += 3;
  addText(`Le client : ${client.company || `${client.firstName} ${client.lastName}`}`, 25);
  if (client.siret) addText(`SIRET : ${client.siret}`, 25);
  if (client.address) addText(`Adresse : ${client.address}, ${client.postalCode} ${client.city}`, 25);
  addText(`Représenté par : ${client.firstName} ${client.lastName}`, 25);
  addText(`Email : ${client.email}`, 25);
  addText(`Ci-après dénommé "le Client"`, 25);

  // Article 2 - Objet
  addSection('ARTICLE 2 - OBJET');
  addText(`La présente convention a pour objet de définir les conditions dans lesquelles l'Organisme s'engage à dispenser au Client la formation suivante :`);
  y += 3;
  addText(`Intitulé : ${FORMATION.title}`, 25);
  addText(`Durée : ${FORMATION.duration}`, 25);
  addText(`Modalité : Formation en ligne (e-learning)`, 25);
  addText(`Nombre de participants : ${purchase.users} personne(s)`, 25);

  // Article 3 - Programme
  addSection('ARTICLE 3 - PROGRAMME');
  addText(`La formation comprend les modules suivants :`);
  FORMATION.modules.forEach((module, i) => {
    addText(`• ${module.title} (${module.duration})`, 25);
  });

  // Article 4 - Objectifs
  addSection('ARTICLE 4 - OBJECTIFS PÉDAGOGIQUES');
  addText(`À l'issue de la formation, le participant sera capable de :`);
  FORMATION.objectives.forEach((obj) => {
    addText(`• ${obj}`, 25);
  });

  addNewPage();

  // Article 5 - Dates et durée
  addSection('ARTICLE 5 - DATES ET DURÉE D\'ACCÈS');
  addText(`Date de début d'accès : ${purchase.purchaseDate.toLocaleDateString('fr-FR')}`);
  addText(`Date de fin d'accès : ${purchase.accessEndDate.toLocaleDateString('fr-FR')}`);
  addText(`Durée totale de la formation : ${FORMATION.duration}`);
  addText(`Le participant dispose d'un accès illimité aux contenus pendant la période d'accès.`);

  // Article 6 - Prix
  addSection('ARTICLE 6 - CONDITIONS FINANCIÈRES');
  addText(`Le prix de la formation est fixé à :`);
  addText(`Prix HT : ${purchase.priceHT.toFixed(2)} €`, 25);
  addText(`TVA (20%) : ${purchase.tva.toFixed(2)} €`, 25);
  addText(`Prix TTC : ${purchase.priceTTC.toFixed(2)} €`, 25);
  y += 3;
  addText(`Ce prix comprend :`);
  addText(`• L'accès à l'ensemble des modules de formation`, 25);
  addText(`• Les supports pédagogiques téléchargeables (templates, checklists)`, 25);
  addText(`• L'accès aux quiz d'évaluation`, 25);
  addText(`• La délivrance du certificat de réussite`, 25);
  addText(`• L'accès au support technique par email`, 25);

  // Article 7 - Modalités de paiement
  addSection('ARTICLE 7 - MODALITÉS DE PAIEMENT');
  addText(`Le paiement est effectué en une seule fois par carte bancaire au moment de l'inscription.`);
  addText(`Date de règlement : ${purchase.purchaseDate.toLocaleDateString('fr-FR')}`);
  addText(`Moyen de paiement : Carte bancaire (via Stripe)`);

  // Article 8 - Évaluation
  addSection('ARTICLE 8 - ÉVALUATION ET SANCTION');
  addText(`La formation fait l'objet d'une évaluation par :`);
  FORMATION.evaluation.forEach((eval_item) => {
    addText(`• ${eval_item}`, 25);
  });
  y += 3;
  addText(`Un certificat de réussite nominatif est délivré au participant ayant obtenu un score minimum de 80% à l'évaluation finale.`);

  // Article 9 - Délai de rétractation
  addSection('ARTICLE 9 - DÉLAI DE RÉTRACTATION');
  addText(`Conformément à l'article L.6353-5 du Code du travail, le Client dispose d'un délai de rétractation de 10 jours à compter de la signature de la présente convention.`);
  addText(`Par ailleurs, l'Organisme offre une garantie "satisfait ou remboursé" de 30 jours.`);

  addNewPage();

  // Article 10 - Responsabilités
  addSection('ARTICLE 10 - RESPONSABILITÉS');
  addText(`L'Organisme s'engage à dispenser une formation de qualité conforme au programme annoncé.`);
  addText(`Le Client s'engage à suivre la formation avec assiduité et à respecter les conditions d'utilisation de la plateforme.`);

  // Article 11 - Propriété intellectuelle
  addSection('ARTICLE 11 - PROPRIÉTÉ INTELLECTUELLE');
  addText(`L'ensemble des contenus de formation (vidéos, documents, templates) reste la propriété exclusive de l'Organisme. Toute reproduction ou diffusion sans autorisation est interdite.`);

  // Article 12 - Protection des données
  addSection('ARTICLE 12 - PROTECTION DES DONNÉES PERSONNELLES');
  addText(`Les données personnelles collectées sont traitées conformément au RGPD. Le Client dispose d'un droit d'accès, de rectification et de suppression de ses données.`);

  // Article 13 - Droit applicable
  addSection('ARTICLE 13 - DROIT APPLICABLE');
  addText(`La présente convention est régie par le droit français. Tout litige sera soumis aux tribunaux compétents de Paris.`);

  // Signatures
  y += 15;
  doc.setFontSize(10);
  doc.text(`Fait en deux exemplaires, le ${new Date().toLocaleDateString('fr-FR')}`, pageWidth / 2, y, { align: 'center' });
  
  y += 15;
  doc.setFont('helvetica', 'bold');
  doc.text('Pour l\'Organisme :', 30, y);
  doc.text('Pour le Client :', pageWidth - 70, y);
  
  y += 5;
  doc.setFont('helvetica', 'normal');
  doc.text(ORGANISME.legalName, 30, y);
  doc.text(client.company || `${client.firstName} ${client.lastName}`, pageWidth - 70, y);
  
  y += 20;
  doc.text('Signature :', 30, y);
  doc.text('Signature :', pageWidth - 70, y);
  
  // Mention légale bas de page
  doc.setFontSize(8);
  doc.setTextColor(128, 128, 128);
  doc.text(
    `${ORGANISME.legalName} - ${ORGANISME.address}, ${ORGANISME.postalCode} ${ORGANISME.city} - SIRET ${ORGANISME.siret} - ${ORGANISME.email}`,
    pageWidth / 2,
    doc.internal.pageSize.getHeight() - 10,
    { align: 'center' }
  );

  return doc;
}

// ============================================
// GÉNÉRATION DE LA FACTURE
// ============================================
export function generateInvoice(client: ClientInfo, purchase: PurchaseInfo): jsPDF {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 20;

  // En-tête coloré
  doc.setFillColor(10, 10, 27);
  doc.rect(0, 0, pageWidth, 50, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('FACTURE', 20, 25);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`N° ${purchase.invoiceNumber}`, 20, 35);
  doc.text(`Date : ${purchase.purchaseDate.toLocaleDateString('fr-FR')}`, 20, 42);

  // Logo/Nom entreprise à droite
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(ORGANISME.name, pageWidth - 20, 25, { align: 'right' });
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`Qualiopi N° ${ORGANISME.qualiopi}`, pageWidth - 20, 33, { align: 'right' });

  doc.setTextColor(0, 0, 0);
  y = 70;

  // Infos émetteur et client
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('ÉMETTEUR', 20, y);
  doc.text('CLIENT', pageWidth / 2 + 10, y);
  
  y += 7;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  
  // Émetteur
  doc.text(ORGANISME.legalName, 20, y);
  doc.text(ORGANISME.address, 20, y + 5);
  doc.text(`${ORGANISME.postalCode} ${ORGANISME.city}`, 20, y + 10);
  doc.text(`SIRET : ${ORGANISME.siret}`, 20, y + 15);
  doc.text(`TVA : ${ORGANISME.tva}`, 20, y + 20);
  doc.text(`NDA : ${ORGANISME.nda}`, 20, y + 25);

  // Client
  doc.text(client.company || `${client.firstName} ${client.lastName}`, pageWidth / 2 + 10, y);
  if (client.address) {
    doc.text(client.address, pageWidth / 2 + 10, y + 5);
    doc.text(`${client.postalCode} ${client.city}`, pageWidth / 2 + 10, y + 10);
  }
  if (client.siret) {
    doc.text(`SIRET : ${client.siret}`, pageWidth / 2 + 10, y + 15);
  }
  doc.text(client.email, pageWidth / 2 + 10, y + 20);

  y += 45;

  // Tableau des prestations
  // En-tête tableau
  doc.setFillColor(245, 245, 245);
  doc.rect(20, y, pageWidth - 40, 10, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('DÉSIGNATION', 25, y + 7);
  doc.text('QTÉ', 110, y + 7, { align: 'center' });
  doc.text('P.U. HT', 135, y + 7, { align: 'center' });
  doc.text('TOTAL HT', pageWidth - 25, y + 7, { align: 'right' });
  
  y += 15;
  
  // Ligne produit
  doc.setFont('helvetica', 'normal');
  doc.text(`Formation AI Act - Plan ${purchase.planName}`, 25, y);
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text(`${purchase.users} utilisateur(s) - Accès 12 mois`, 25, y + 5);
  doc.text('Certificat de conformité Article 4 inclus', 25, y + 9);
  
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(9);
  doc.text(`${purchase.users}`, 110, y, { align: 'center' });
  doc.text(`${(purchase.priceHT / purchase.users).toFixed(2)} €`, 135, y, { align: 'center' });
  doc.text(`${purchase.priceHT.toFixed(2)} €`, pageWidth - 25, y, { align: 'right' });

  y += 25;

  // Ligne de séparation
  doc.setDrawColor(200, 200, 200);
  doc.line(20, y, pageWidth - 20, y);
  
  y += 10;

  // Totaux
  const totalsX = pageWidth - 80;
  
  doc.setFont('helvetica', 'normal');
  doc.text('Total HT :', totalsX, y);
  doc.text(`${purchase.priceHT.toFixed(2)} €`, pageWidth - 25, y, { align: 'right' });
  
  y += 7;
  doc.text('TVA (20%) :', totalsX, y);
  doc.text(`${purchase.tva.toFixed(2)} €`, pageWidth - 25, y, { align: 'right' });
  
  y += 10;
  doc.setFillColor(0, 255, 136);
  doc.rect(totalsX - 5, y - 5, pageWidth - totalsX - 15, 12, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('Total TTC :', totalsX, y + 3);
  doc.text(`${purchase.priceTTC.toFixed(2)} €`, pageWidth - 25, y + 3, { align: 'right' });

  y += 25;

  // Mention paiement
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 150, 0);
  doc.text('✓ FACTURE ACQUITTÉE', 20, y);
  
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  y += 7;
  doc.text(`Paiement reçu le ${purchase.purchaseDate.toLocaleDateString('fr-FR')} par carte bancaire`, 20, y);

  // Informations complémentaires
  y += 20;
  doc.setFillColor(250, 250, 250);
  doc.rect(20, y, pageWidth - 40, 35, 'F');
  
  y += 8;
  doc.setFont('helvetica', 'bold');
  doc.text('Informations pour votre OPCO :', 25, y);
  
  doc.setFont('helvetica', 'normal');
  y += 7;
  doc.text(`• Organisme certifié Qualiopi N° ${ORGANISME.qualiopi}`, 25, y);
  y += 5;
  doc.text(`• N° de déclaration d'activité : ${ORGANISME.nda}`, 25, y);
  y += 5;
  doc.text(`• Durée de formation : ${FORMATION.duration}`, 25, y);
  y += 5;
  doc.text(`• Intitulé : ${FORMATION.title}`, 25, y);

  // Conditions de paiement
  y += 20;
  doc.setFontSize(8);
  doc.setTextColor(128, 128, 128);
  doc.text('En cas de paiement anticipé, aucun escompte ne sera accordé. Pas de pénalité de retard applicable (facture acquittée).', 20, y);
  doc.text(`Indemnité forfaitaire pour frais de recouvrement : 40€ (article L.441-6 du Code de commerce)`, 20, y + 4);

  // Pied de page
  doc.setFontSize(8);
  doc.text(
    `${ORGANISME.legalName} - RCS ${ORGANISME.rcs} - Capital ${ORGANISME.capital}€ - TVA ${ORGANISME.tva}`,
    pageWidth / 2,
    doc.internal.pageSize.getHeight() - 15,
    { align: 'center' }
  );
  doc.text(
    `${ORGANISME.address}, ${ORGANISME.postalCode} ${ORGANISME.city} - ${ORGANISME.email} - ${ORGANISME.website}`,
    pageWidth / 2,
    doc.internal.pageSize.getHeight() - 10,
    { align: 'center' }
  );

  return doc;
}

// ============================================
// GÉNÉRATION DE L'ATTESTATION DE FIN DE FORMATION
// ============================================
export function generateAttestation(
  client: ClientInfo, 
  purchase: PurchaseInfo,
  completionDate: Date,
  score: number
): jsPDF {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  let y = 30;

  // Bordure décorative
  doc.setDrawColor(0, 245, 255);
  doc.setLineWidth(2);
  doc.rect(10, 10, pageWidth - 20, pageHeight - 20);
  
  // Filigrane Qualiopi
  doc.setTextColor(240, 240, 240);
  doc.setFontSize(60);
  doc.setFont('helvetica', 'bold');
  doc.text('QUALIOPI', pageWidth / 2, pageHeight / 2, { align: 'center', angle: 45 });
  
  doc.setTextColor(0, 0, 0);

  // Logo / En-tête
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 100);
  doc.text(ORGANISME.name, pageWidth / 2, y, { align: 'center' });
  doc.setFontSize(9);
  doc.text(`Organisme certifié Qualiopi - N° ${ORGANISME.qualiopi}`, pageWidth / 2, y + 6, { align: 'center' });
  doc.text(`N° de déclaration d'activité : ${ORGANISME.nda}`, pageWidth / 2, y + 11, { align: 'center' });

  y += 30;

  // Titre
  doc.setTextColor(10, 10, 27);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('ATTESTATION', pageWidth / 2, y, { align: 'center' });
  y += 8;
  doc.setFontSize(14);
  doc.text('DE FIN DE FORMATION', pageWidth / 2, y, { align: 'center' });

  y += 25;

  // Corps
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text('Je soussigné(e), représentant de l\'organisme de formation', pageWidth / 2, y, { align: 'center' });
  y += 6;
  doc.setFont('helvetica', 'bold');
  doc.text(ORGANISME.legalName, pageWidth / 2, y, { align: 'center' });
  y += 10;
  doc.setFont('helvetica', 'normal');
  doc.text('atteste que :', pageWidth / 2, y, { align: 'center' });

  y += 20;

  // Nom du participant
  doc.setFillColor(245, 250, 255);
  doc.rect(30, y - 5, pageWidth - 60, 15, 'F');
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 100, 200);
  doc.text(`${client.firstName} ${client.lastName}`, pageWidth / 2, y + 5, { align: 'center' });
  
  doc.setTextColor(0, 0, 0);
  y += 25;

  // Détails
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  
  if (client.company) {
    doc.text(`Entreprise : ${client.company}`, pageWidth / 2, y, { align: 'center' });
    y += 10;
  }

  doc.text('a suivi et validé avec succès la formation :', pageWidth / 2, y, { align: 'center' });

  y += 15;

  // Intitulé formation
  doc.setFillColor(10, 10, 27);
  doc.rect(30, y - 5, pageWidth - 60, 20, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text(FORMATION.title, pageWidth / 2, y + 7, { align: 'center' });

  doc.setTextColor(0, 0, 0);
  y += 30;

  // Infos formation
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  const infoY = y;
  
  doc.text(`Durée : ${FORMATION.duration}`, 40, infoY);
  doc.text(`Période : du ${purchase.purchaseDate.toLocaleDateString('fr-FR')} au ${completionDate.toLocaleDateString('fr-FR')}`, 40, infoY + 7);
  doc.text(`Modalité : Formation en ligne (e-learning)`, 40, infoY + 14);
  doc.text(`Évaluation : Quiz validé avec ${score}% de réussite`, 40, infoY + 21);

  y += 40;

  // Objectifs atteints
  doc.setFont('helvetica', 'bold');
  doc.text('Objectifs pédagogiques atteints :', 40, y);
  y += 7;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  FORMATION.objectives.slice(0, 4).forEach((obj) => {
    doc.text(`• ${obj}`, 45, y);
    y += 5;
  });

  y += 15;

  // Signature
  doc.setFontSize(10);
  doc.text(`Fait à ${ORGANISME.city}, le ${new Date().toLocaleDateString('fr-FR')}`, pageWidth - 40, y, { align: 'right' });
  y += 15;
  doc.text('Pour l\'organisme de formation,', pageWidth - 40, y, { align: 'right' });
  y += 5;
  doc.setFont('helvetica', 'bold');
  doc.text(ORGANISME.name, pageWidth - 40, y, { align: 'right' });

  // Pied de page avec infos légales
  doc.setFontSize(8);
  doc.setTextColor(128, 128, 128);
  doc.setFont('helvetica', 'normal');
  doc.text(
    `${ORGANISME.legalName} - SIRET ${ORGANISME.siret} - NDA ${ORGANISME.nda}`,
    pageWidth / 2,
    pageHeight - 20,
    { align: 'center' }
  );
  doc.text(
    `${ORGANISME.address}, ${ORGANISME.postalCode} ${ORGANISME.city} - ${ORGANISME.email}`,
    pageWidth / 2,
    pageHeight - 15,
    { align: 'center' }
  );

  return doc;
}

// ============================================
// GÉNÉRATION DU PROGRAMME DÉTAILLÉ (STATIQUE)
// ============================================
export function generateProgramme(): jsPDF {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 20;

  const addNewPage = () => {
    doc.addPage();
    y = 20;
  };

  // En-tête
  doc.setFillColor(10, 10, 27);
  doc.rect(0, 0, pageWidth, 45, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('PROGRAMME DE FORMATION', pageWidth / 2, 18, { align: 'center' });
  
  doc.setFontSize(12);
  doc.text(FORMATION.title, pageWidth / 2, 30, { align: 'center' });
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`Durée totale : ${FORMATION.duration}`, pageWidth / 2, 40, { align: 'center' });

  doc.setTextColor(0, 0, 0);
  y = 60;

  // Infos générales
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('INFORMATIONS GÉNÉRALES', 20, y);
  y += 8;
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(`Organisme : ${ORGANISME.name}`, 20, y);
  doc.text(`Qualiopi : ${ORGANISME.qualiopi}`, 110, y);
  y += 6;
  doc.text(`Modalité : Formation en ligne (e-learning asynchrone)`, 20, y);
  y += 6;
  doc.text(`Accès : 24h/24, 7j/7 pendant 12 mois`, 20, y);

  y += 15;

  // Objectifs
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('OBJECTIFS PÉDAGOGIQUES', 20, y);
  y += 8;
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  FORMATION.objectives.forEach((obj, i) => {
    doc.text(`${i + 1}. ${obj}`, 25, y);
    y += 6;
  });

  y += 10;

  // Public cible
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('PUBLIC VISÉ', 20, y);
  y += 8;
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  FORMATION.targetAudience.forEach((audience) => {
    doc.text(`• ${audience}`, 25, y);
    y += 5;
  });

  y += 10;

  // Prérequis
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('PRÉREQUIS', 20, y);
  y += 8;
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  FORMATION.prerequisites.forEach((prereq) => {
    doc.text(`• ${prereq}`, 25, y);
    y += 5;
  });

  addNewPage();

  // Contenu détaillé des modules
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('CONTENU DÉTAILLÉ DES MODULES', 20, y);
  y += 15;

  const moduleDetails = [
    {
      title: "Module 1 - Fondamentaux de l'AI Act",
      duration: "45 minutes",
      content: [
        "Contexte et genèse du règlement européen sur l'IA",
        "Champ d'application territorial et matériel",
        "Définition d'un système d'IA selon l'AI Act",
        "Calendrier d'entrée en vigueur et phases de transition",
        "Articulation avec le RGPD et autres réglementations",
      ]
    },
    {
      title: "Module 2 - Classification des Risques IA",
      duration: "1 heure",
      content: [
        "Les 4 niveaux de risque : inacceptable, haut, limité, minimal",
        "Systèmes IA interdits (Article 5)",
        "Critères de classification en haut risque (Annexe III)",
        "Obligations spécifiques par niveau de risque",
        "Cas pratiques de classification",
      ]
    },
    {
      title: "Module 3 - Cartographie des Systèmes IA",
      duration: "1 heure 15",
      content: [
        "Méthodologie d'inventaire des systèmes IA",
        "Identification des systèmes IA cachés (embedded AI)",
        "Création du registre des systèmes IA",
        "Documentation technique requise",
        "Exercice pratique : cartographie de votre organisation",
      ]
    },
    {
      title: "Module 4 - Gouvernance IA en Entreprise",
      duration: "1 heure",
      content: [
        "Rôles et responsabilités (Article 4)",
        "Désignation du référent IA",
        "Politique de gouvernance IA",
        "Formation et sensibilisation des équipes",
        "Intégration dans la gouvernance data existante",
      ]
    },
    {
      title: "Module 5 - Systèmes à Haut Risque",
      duration: "1 heure 30",
      content: [
        "Exigences détaillées pour les systèmes haut risque",
        "Gestion des risques et évaluation de conformité",
        "Exigences de données et de documentation",
        "Transparence et information des utilisateurs",
        "Surveillance humaine et robustesse technique",
        "Marquage CE et déclaration de conformité",
      ]
    },
    {
      title: "Module 6 - Audit & Mise en Conformité",
      duration: "1 heure 30",
      content: [
        "Méthodologie d'audit de conformité AI Act",
        "Checklist des points de contrôle",
        "Plan d'action et roadmap de mise en conformité",
        "Préparation aux contrôles des autorités",
        "Sanctions et mesures correctives",
        "Quiz final de certification",
      ]
    },
  ];

  moduleDetails.forEach((module, index) => {
    if (y > 240) addNewPage();
    
    // Titre module
    doc.setFillColor(245, 245, 255);
    doc.rect(20, y - 3, pageWidth - 40, 10, 'F');
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(10, 10, 27);
    doc.text(module.title, 25, y + 4);
    doc.setTextColor(100, 100, 100);
    doc.setFontSize(9);
    doc.text(module.duration, pageWidth - 25, y + 4, { align: 'right' });
    
    doc.setTextColor(0, 0, 0);
    y += 15;
    
    // Contenu
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    module.content.forEach((item) => {
      doc.text(`• ${item}`, 30, y);
      y += 5;
    });
    
    y += 10;
  });

  addNewPage();

  // Moyens pédagogiques
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('MOYENS PÉDAGOGIQUES ET TECHNIQUES', 20, y);
  y += 10;
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  FORMATION.methods.forEach((method) => {
    doc.text(`• ${method}`, 25, y);
    y += 6;
  });

  y += 15;

  // Évaluation
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('MODALITÉS D\'ÉVALUATION', 20, y);
  y += 10;
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  FORMATION.evaluation.forEach((eval_item) => {
    doc.text(`• ${eval_item}`, 25, y);
    y += 6;
  });

  y += 15;

  // Accessibilité
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('ACCESSIBILITÉ', 20, y);
  y += 10;
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text('Cette formation est accessible aux personnes en situation de handicap.', 25, y);
  y += 5;
  doc.text('Pour toute adaptation nécessaire, contactez-nous : ' + ORGANISME.email, 25, y);

  y += 15;

  // Contact
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('CONTACT', 20, y);
  y += 10;
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text(`Email : ${ORGANISME.email}`, 25, y);
  y += 5;
  doc.text(`Site web : ${ORGANISME.website}`, 25, y);

  // Pied de page
  doc.setFontSize(8);
  doc.setTextColor(128, 128, 128);
  doc.text(
    `${ORGANISME.name} - Organisme certifié Qualiopi N° ${ORGANISME.qualiopi} - NDA ${ORGANISME.nda}`,
    pageWidth / 2,
    doc.internal.pageSize.getHeight() - 10,
    { align: 'center' }
  );

  return doc;
}

// ============================================
// HELPER : Générer tous les documents à l'achat
// ============================================
export interface OPCODocuments {
  convention: Blob;
  invoice: Blob;
  programme: Blob;
}

export async function generateOPCODocuments(
  client: ClientInfo,
  planId: 'solo' | 'equipe' | 'enterprise',
  invoiceNumber: string
): Promise<OPCODocuments> {
  const plan = PLANS[planId];
  const tva = plan.priceHT * 0.2;
  
  const purchaseInfo: PurchaseInfo = {
    planId,
    planName: plan.name,
    priceHT: plan.priceHT,
    priceTTC: plan.priceHT + tva,
    tva,
    users: plan.users,
    invoiceNumber,
    purchaseDate: new Date(),
    accessEndDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // +1 an
  };

  const conventionPdf = generateConvention(client, purchaseInfo);
  const invoicePdf = generateInvoice(client, purchaseInfo);
  const programmePdf = generateProgramme();

  return {
    convention: conventionPdf.output('blob'),
    invoice: invoicePdf.output('blob'),
    programme: programmePdf.output('blob'),
  };
}

// ============================================
// HELPER : Générer l'attestation à la fin
// ============================================
export async function generateCompletionAttestation(
  client: ClientInfo,
  planId: 'solo' | 'equipe' | 'enterprise',
  invoiceNumber: string,
  completionDate: Date,
  score: number
): Promise<Blob> {
  const plan = PLANS[planId];
  const tva = plan.priceHT * 0.2;
  
  const purchaseInfo: PurchaseInfo = {
    planId,
    planName: plan.name,
    priceHT: plan.priceHT,
    priceTTC: plan.priceHT + tva,
    tva,
    users: plan.users,
    invoiceNumber,
    purchaseDate: new Date(), // Idéalement récupéré de la BDD
    accessEndDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
  };

  const attestationPdf = generateAttestation(client, purchaseInfo, completionDate, score);
  return attestationPdf.output('blob');
}
