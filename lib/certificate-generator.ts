// Professional Certificate Generator for AI Act Formation
// Generates a high-quality PDF certificate with real signature, official stamp, and QR code

import { jsPDF } from 'jspdf';

// ============================================
// TYPES
// ============================================
export interface CertificateData {
  participantName: string;
  completionDate: Date;
  formationTitle?: string;
  duration?: string;
  score?: number;
  modulesCompleted?: number;
  totalModules?: number;
  certificateCode?: string;
}

// ============================================
// SIGNATURE IMAGE (Base64 - Loïc Gros-Flandre)
// ============================================
const SIGNATURE_BASE64 = 'data:image/png;base64,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g==';

// ============================================
// CERTIFICATE GENERATOR
// ============================================
export const generateProfessionalCertificate = async (data: CertificateData): Promise<Blob> => {
  const pdf = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = pdf.internal.pageSize.getWidth(); // 297mm
  const pageHeight = pdf.internal.pageSize.getHeight(); // 210mm
  const centerX = pageWidth / 2;

  // Generate unique certificate code if not provided
  const certCode = data.certificateCode || `CERT-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
  const verificationUrl = `https://formation-ia-act.fr/verify/${certCode}`;

  // Format date
  const formattedDate = data.completionDate.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  // ============================================
  // BACKGROUND & BORDER
  // ============================================
  
  // Cream/off-white background
  pdf.setFillColor(252, 251, 248);
  pdf.rect(0, 0, pageWidth, pageHeight, 'F');

  // Decorative border - outer (dark blue)
  pdf.setDrawColor(26, 26, 46);
  pdf.setLineWidth(2);
  pdf.rect(8, 8, pageWidth - 16, pageHeight - 16);

  // Decorative border - inner (gold)
  pdf.setDrawColor(180, 150, 80);
  pdf.setLineWidth(0.5);
  pdf.rect(12, 12, pageWidth - 24, pageHeight - 24);

  // Corner decorations
  const cornerSize = 15;
  const corners = [
    { x: 12, y: 12 },
    { x: pageWidth - 12 - cornerSize, y: 12 },
    { x: 12, y: pageHeight - 12 - cornerSize },
    { x: pageWidth - 12 - cornerSize, y: pageHeight - 12 - cornerSize },
  ];

  pdf.setDrawColor(180, 150, 80);
  pdf.setLineWidth(0.3);
  corners.forEach(corner => {
    pdf.line(corner.x, corner.y, corner.x + cornerSize, corner.y);
    pdf.line(corner.x, corner.y, corner.x, corner.y + cornerSize);
    pdf.line(corner.x + cornerSize, corner.y + cornerSize, corner.x, corner.y + cornerSize);
    pdf.line(corner.x + cornerSize, corner.y + cornerSize, corner.x + cornerSize, corner.y);
  });

  // ============================================
  // HEADER - EU FLAG REPRESENTATION
  // ============================================
  
  pdf.setFillColor(0, 51, 153);
  pdf.circle(centerX, 25, 8, 'F');
  
  pdf.setFillColor(255, 204, 0);
  const starRadius = 6;
  for (let i = 0; i < 12; i++) {
    const angle = (i * 30 - 90) * (Math.PI / 180);
    const starX = centerX + Math.cos(angle) * starRadius;
    const starY = 25 + Math.sin(angle) * starRadius;
    pdf.circle(starX, starY, 0.8, 'F');
  }

  // ============================================
  // TITLE SECTION
  // ============================================
  
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(14);
  pdf.setTextColor(180, 150, 80);
  pdf.text('UNION EUROPÉENNE', centerX, 40, { align: 'center' });

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(36);
  pdf.setTextColor(26, 26, 46);
  pdf.text('CERTIFICAT', centerX, 55, { align: 'center' });

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(16);
  pdf.setTextColor(100, 100, 100);
  pdf.text('DE FORMATION PROFESSIONNELLE', centerX, 64, { align: 'center' });

  // Decorative line under title
  pdf.setDrawColor(180, 150, 80);
  pdf.setLineWidth(0.5);
  pdf.line(centerX - 60, 70, centerX + 60, 70);

  // ============================================
  // CERTIFICATION TEXT
  // ============================================
  
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(12);
  pdf.setTextColor(80, 80, 80);
  pdf.text('Ce certificat atteste que', centerX, 82, { align: 'center' });

  // Participant name - prominent
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(28);
  pdf.setTextColor(26, 26, 46);
  pdf.text(data.participantName.toUpperCase(), centerX, 95, { align: 'center' });

  // Decorative line under name
  pdf.setDrawColor(180, 150, 80);
  pdf.setLineWidth(0.3);
  pdf.line(centerX - 50, 100, centerX + 50, 100);

  // Completion text
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(12);
  pdf.setTextColor(80, 80, 80);
  pdf.text('a suivi avec succès la formation', centerX, 110, { align: 'center' });

  // Formation title
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(18);
  pdf.setTextColor(26, 26, 46);
  const formationTitle = data.formationTitle || 'Conformité au Règlement Européen sur l\'Intelligence Artificielle';
  pdf.text(formationTitle, centerX, 122, { align: 'center' });

  // AI Act reference
  pdf.setFont('helvetica', 'italic');
  pdf.setFontSize(11);
  pdf.setTextColor(100, 100, 100);
  pdf.text('(Règlement UE 2024/1689 - AI Act)', centerX, 130, { align: 'center' });

  // ============================================
  // DETAILS BOX
  // ============================================
  
  const boxY = 138;
  const boxHeight = 22;
  
  pdf.setFillColor(245, 245, 245);
  pdf.roundedRect(centerX - 80, boxY, 160, boxHeight, 2, 2, 'F');

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(10);
  pdf.setTextColor(60, 60, 60);

  const duration = data.duration || '8 heures';
  const modules = data.modulesCompleted && data.totalModules 
    ? `${data.modulesCompleted}/${data.totalModules} modules`
    : '8 modules';
  const scoreText = data.score ? `Score: ${data.score}%` : '';

  pdf.text(`Durée: ${duration}`, centerX - 70, boxY + 8);
  pdf.text(`Modules: ${modules}`, centerX - 70, boxY + 15);
  pdf.text(`Date: ${formattedDate}`, centerX + 20, boxY + 8);
  if (scoreText) {
    pdf.text(scoreText, centerX + 20, boxY + 15);
  }

  // ============================================
  // SIGNATURES SECTION
  // ============================================
  
  const sigY = 168;
  
  // ---- LEFT: Formateur avec signature manuscrite ----
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(9);
  pdf.setTextColor(100, 100, 100);
  pdf.text('Le Formateur', 70, sigY);
  
  // Ajouter la signature manuscrite
  try {
    pdf.addImage(SIGNATURE_BASE64, 'PNG', 45, sigY - 2, 50, 20);
  } catch (e) {
    // Fallback si l'image ne charge pas
    pdf.setFont('helvetica', 'italic');
    pdf.setFontSize(14);
    pdf.setTextColor(26, 26, 46);
    pdf.text('L. Gros-Flandre', 70, sigY + 10, { align: 'center' });
  }
  
  // Ligne sous signature
  pdf.setDrawColor(26, 26, 46);
  pdf.setLineWidth(0.2);
  pdf.line(45, sigY + 18, 95, sigY + 18);
  
  // Nom sous signature
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(10);
  pdf.setTextColor(26, 26, 46);
  pdf.text('Loïc GROS-FLANDRE', 70, sigY + 24, { align: 'center' });
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(8);
  pdf.setTextColor(100, 100, 100);
  pdf.text('Expert Conformité IA', 70, sigY + 29, { align: 'center' });

  // ---- RIGHT: Tampon officiel dessiné ----
  const stampX = pageWidth - 70;
  const stampY = sigY + 8;
  const stampRadius = 18;
  
  // Cercle extérieur du tampon
  pdf.setDrawColor(0, 82, 147); // Bleu officiel
  pdf.setLineWidth(1.5);
  pdf.circle(stampX, stampY, stampRadius);
  
  // Cercle intérieur
  pdf.setLineWidth(0.5);
  pdf.circle(stampX, stampY, stampRadius - 3);
  
  // Texte circulaire haut "FORMATION IA ACT"
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(7);
  pdf.setTextColor(0, 82, 147);
  
  // Texte en arc (simulé avec plusieurs segments)
  const topText = '★ FORMATION IA ACT ★';
  const arcRadius = stampRadius - 6;
  const startAngle = -160;
  const endAngle = -20;
  const angleStep = (endAngle - startAngle) / (topText.length - 1);
  
  for (let i = 0; i < topText.length; i++) {
    const angle = (startAngle + i * angleStep) * (Math.PI / 180);
    const x = stampX + Math.cos(angle) * arcRadius;
    const y = stampY + Math.sin(angle) * arcRadius;
    pdf.text(topText[i], x, y, { align: 'center' });
  }
  
  // Texte central
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(8);
  pdf.text('ORGANISME', stampX, stampY - 2, { align: 'center' });
  pdf.text('DE', stampX, stampY + 3, { align: 'center' });
  pdf.text('FORMATION', stampX, stampY + 8, { align: 'center' });
  
  // Texte circulaire bas
  const bottomText = 'CERTIFIÉ';
  const bottomArcRadius = stampRadius - 6;
  const bottomStartAngle = 160;
  const bottomEndAngle = 20;
  const bottomAngleStep = (bottomEndAngle - bottomStartAngle) / (bottomText.length - 1);
  
  pdf.setFontSize(6);
  for (let i = 0; i < bottomText.length; i++) {
    const angle = (bottomStartAngle + i * bottomAngleStep) * (Math.PI / 180);
    const x = stampX + Math.cos(angle) * bottomArcRadius;
    const y = stampY + Math.sin(angle) * bottomArcRadius;
    pdf.text(bottomText[i], x, y, { align: 'center' });
  }
  
  // Label sous le tampon
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(9);
  pdf.setTextColor(26, 26, 46);
  pdf.text('FORMATION IA ACT', stampX, sigY + 30, { align: 'center' });
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(7);
  pdf.setTextColor(100, 100, 100);
  pdf.text('formation-ia-act.fr', stampX, sigY + 35, { align: 'center' });

  // ============================================
  // QR CODE (center)
  // ============================================
  
  try {
    const QRCode = await import('qrcode');
    const qrDataURL = await QRCode.toDataURL(verificationUrl, {
      width: 200,
      margin: 1,
      color: {
        dark: '#1a1a2e',
        light: '#FFFFFF',
      },
    });
    
    pdf.addImage(qrDataURL, 'PNG', centerX - 12, sigY - 2, 24, 24);
  } catch (e) {
    console.error('QR generation failed:', e);
  }

  // Verification text under QR
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(7);
  pdf.setTextColor(100, 100, 100);
  pdf.text('Vérifiez ce certificat:', centerX, sigY + 24, { align: 'center' });
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(7);
  pdf.text(verificationUrl, centerX, sigY + 28, { align: 'center' });

  // ============================================
  // FOOTER
  // ============================================
  
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(8);
  pdf.setTextColor(150, 150, 150);
  pdf.text(`N° ${certCode}`, 20, pageHeight - 12);

  pdf.text('formation-ia-act.fr', pageWidth - 20, pageHeight - 12, { align: 'right' });

  pdf.setFontSize(6);
  pdf.text(
    'Ce certificat atteste de la participation et de la réussite à la formation. Il ne constitue pas une certification officielle au sens du Règlement.',
    centerX,
    pageHeight - 8,
    { align: 'center' }
  );

  return pdf.output('blob');
};

// ============================================
// DOWNLOAD HELPER
// ============================================
export const downloadCertificate = async (data: CertificateData): Promise<void> => {
  const blob = await generateProfessionalCertificate(data);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `certificat-ai-act-${data.participantName.toLowerCase().replace(/\s+/g, '-')}.pdf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
