// Document Generator Utilities
// Generates Word (.docx) and PDF documents with QR codes for AI Act compliance

import { jsPDF } from 'jspdf';

// ============================================
// QR CODE GENERATOR
// ============================================
export const generateQRCodeDataURL = async (url: string, size: number = 150): Promise<string> => {
  try {
    const QRCode = await import('qrcode');
    const dataURL = await QRCode.toDataURL(url, {
      width: size,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
    });
    return dataURL;
  } catch (error) {
    console.error('QR Code generation error:', error);
    return '';
  }
};

// ============================================
// WORD DOCUMENT GENERATOR
// ============================================
export const generatePolicyDocx = async (
  policyData: any,
  companyName: string,
  certificateUrl?: string
): Promise<Blob> => {
  const {
    Document,
    Packer,
    Paragraph,
    TextRun,
    HeadingLevel,
    AlignmentType,
    PageBreak,
    Table,
    TableRow,
    TableCell,
    WidthType,
    BorderStyle,
    ImageRun,
  } = await import('docx');

  // Generate QR code if certificate URL provided
  let qrCodeImage: any = null;
  if (certificateUrl) {
    try {
      const qrDataURL = await generateQRCodeDataURL(certificateUrl, 100);
      if (qrDataURL) {
        const base64Data = qrDataURL.split(',')[1];
        qrCodeImage = new ImageRun({
          data: Buffer.from(base64Data, 'base64'),
          transformation: { width: 80, height: 80 },
          type: 'png',
        });
      }
    } catch (e) {
      console.error('QR generation failed:', e);
    }
  }

  const currentDate = new Date().toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Build sections from policy data
  const sections: any[] = [];

  // Title page
  sections.push(
    new Paragraph({
      children: [
        new TextRun({
          text: 'POLITIQUE D\'UTILISATION',
          bold: true,
          size: 56,
          color: '1a1a2e',
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { before: 400, after: 200 },
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: 'DE L\'INTELLIGENCE ARTIFICIELLE',
          bold: true,
          size: 56,
          color: '1a1a2e',
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 600 },
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: companyName || '[Nom de l\'entreprise]',
          bold: true,
          size: 36,
          color: '00F5FF',
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: `Date d'entrée en vigueur : ${currentDate}`,
          size: 24,
          color: '666666',
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: 'Document de conformité au Règlement Européen sur l\'Intelligence Artificielle (AI Act)',
          size: 20,
          italics: true,
          color: '888888',
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 800 },
    })
  );

  // QR Code on title page
  if (qrCodeImage) {
    sections.push(
      new Paragraph({
        children: [qrCodeImage],
        alignment: AlignmentType.CENTER,
        spacing: { before: 400, after: 100 },
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: 'Scannez pour vérifier l\'authenticité',
            size: 16,
            color: '888888',
          }),
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 400 },
      })
    );
  }

  // Page break before content
  sections.push(
    new Paragraph({
      children: [new PageBreak()],
    })
  );

  // Table of contents header
  sections.push(
    new Paragraph({
      text: 'TABLE DES MATIÈRES',
      heading: HeadingLevel.HEADING_1,
      spacing: { after: 400 },
    })
  );

  const sectionTitles = [
    '1. Introduction et contexte',
    '2. Principes directeurs',
    '3. Gouvernance et responsabilités',
    '4. Règles d\'utilisation',
    '5. Transparence et information',
    '6. Formation et sensibilisation',
    '7. Gestion des incidents',
  ];

  sectionTitles.forEach((title) => {
    sections.push(
      new Paragraph({
        children: [
          new TextRun({
            text: title,
            size: 24,
          }),
        ],
        spacing: { after: 100 },
      })
    );
  });

  sections.push(
    new Paragraph({
      children: [new PageBreak()],
    })
  );

  // Content sections
  const sectionContents: { [key: string]: { title: string; content: string } } = {
    section_1: {
      title: '1. INTRODUCTION ET CONTEXTE',
      content: policyData.section_1 || policyData.introduction || `
Cette politique définit le cadre d'utilisation de l'Intelligence Artificielle au sein de ${companyName || 'notre entreprise'}.

Elle s'inscrit dans le contexte du Règlement Européen sur l'Intelligence Artificielle (AI Act - Règlement UE 2024/1689) qui établit des règles harmonisées pour le développement, la mise sur le marché et l'utilisation des systèmes d'IA dans l'Union Européenne.

Cette politique vise à garantir une utilisation responsable, éthique et conforme de l'IA, tout en permettant à notre organisation de bénéficier des avantages de ces technologies.
      `.trim(),
    },
    section_2: {
      title: '2. PRINCIPES DIRECTEURS',
      content: policyData.section_2 || policyData.principles || `
Notre utilisation de l'Intelligence Artificielle repose sur les principes fondamentaux suivants :

• Respect de la dignité humaine et des droits fondamentaux
• Transparence dans l'utilisation des systèmes d'IA
• Supervision humaine appropriée des décisions automatisées
• Protection des données personnelles et de la vie privée
• Non-discrimination et équité algorithmique
• Responsabilité et traçabilité des décisions
• Sécurité et robustesse des systèmes
      `.trim(),
    },
    section_3: {
      title: '3. GOUVERNANCE ET RESPONSABILITÉS',
      content: policyData.section_3 || policyData.governance || `
La gouvernance de l'IA au sein de notre organisation est structurée comme suit :

Responsable IA : ${policyData.responsible_person || '[À désigner]'}
- Supervise la mise en œuvre de cette politique
- Maintient le registre des systèmes d'IA
- Coordonne les évaluations de conformité

Comité IA :
- Se réunit ${policyData.review_frequency || 'trimestriellement'}
- Valide les nouveaux déploiements d'IA
- Examine les incidents et non-conformités

Chaque département est responsable de :
- Déclarer les systèmes d'IA utilisés
- Respecter les règles d'utilisation définies
- Signaler tout incident ou dysfonctionnement
      `.trim(),
    },
    section_4: {
      title: '4. RÈGLES D\'UTILISATION',
      content: policyData.section_4 || policyData.rules || `
Systèmes autorisés :
Seuls les systèmes d'IA référencés dans le registre officiel peuvent être utilisés dans le cadre professionnel.

Usages interdits :
• Manipulation ou exploitation des vulnérabilités des personnes
• Notation sociale des individus
• Identification biométrique en temps réel (sauf exceptions légales)
• Prise de décision automatisée sans supervision humaine pour les décisions à fort impact

Règles de confidentialité :
• Ne jamais saisir de données personnelles sensibles dans les IA génératives publiques
• Respecter la classification des données de l'entreprise
• Anonymiser les données avant utilisation si nécessaire
      `.trim(),
    },
    section_5: {
      title: '5. TRANSPARENCE ET INFORMATION',
      content: policyData.section_5 || policyData.transparency || `
Information des utilisateurs :
Toute personne interagissant avec un système d'IA doit en être informée de manière claire.

Mentions obligatoires :
• Les contenus générés par IA doivent être identifiés comme tels
• Les chatbots doivent se présenter comme des systèmes automatisés
• Les décisions assistées par IA doivent être signalées

Documentation :
• Chaque système d'IA dispose d'une fiche descriptive accessible
• Les évaluations de risque sont documentées et mises à jour
• Les incidents sont tracés et analysés
      `.trim(),
    },
    section_6: {
      title: '6. FORMATION ET SENSIBILISATION',
      content: policyData.section_6 || policyData.training || `
Programme de formation :
Conformément à l'Article 4 de l'AI Act, notre organisation s'engage à garantir un niveau suffisant de maîtrise de l'IA pour l'ensemble des collaborateurs concernés.

Formations obligatoires :
• Sensibilisation générale à l'IA pour tous les collaborateurs
• Formation approfondie pour les utilisateurs réguliers
• Formation spécialisée pour les administrateurs et développeurs

Fréquence :
• Formation initiale à l'embauche ou lors du déploiement d'un nouveau système
• Mise à jour annuelle des connaissances
• Sessions ad-hoc lors de changements majeurs
      `.trim(),
    },
    section_7: {
      title: '7. GESTION DES INCIDENTS',
      content: policyData.section_7 || policyData.incidents || `
Définition d'un incident IA :
Tout dysfonctionnement, biais détecté, violation de données, ou utilisation non conforme d'un système d'IA.

Procédure de signalement :
1. Signalement immédiat au responsable IA
2. Documentation de l'incident
3. Évaluation de la gravité
4. Actions correctives immédiates si nécessaire
5. Analyse des causes profondes
6. Mise en place de mesures préventives

Contact : ${policyData.contact_email || '[email du responsable IA]'}

En cas d'incident grave impliquant un système à haut risque, une notification aux autorités compétentes peut être requise conformément à l'AI Act.
      `.trim(),
    },
  };

  Object.entries(sectionContents).forEach(([key, section]) => {
    // Section title
    sections.push(
      new Paragraph({
        text: section.title,
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 400, after: 200 },
      })
    );

    // Section content - split by paragraphs
    const paragraphs = section.content.split('\n\n');
    paragraphs.forEach((para) => {
      if (para.trim()) {
        sections.push(
          new Paragraph({
            children: [
              new TextRun({
                text: para.trim(),
                size: 24,
              }),
            ],
            spacing: { after: 200 },
          })
        );
      }
    });
  });

  // Footer with date and version
  sections.push(
    new Paragraph({
      children: [new PageBreak()],
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: '─'.repeat(50),
          color: 'CCCCCC',
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { before: 400, after: 200 },
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: `Document généré le ${currentDate}`,
          size: 20,
          color: '888888',
        }),
      ],
      alignment: AlignmentType.CENTER,
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: 'Formation AI Act - formation-ia-act.fr',
          size: 18,
          color: '888888',
          italics: true,
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
    })
  );

  // Create document
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: sections,
      },
    ],
  });

  // Generate blob
  const blob = await Packer.toBlob(doc);
  return blob;
};

// ============================================
// PDF DOSSIER GENERATOR
// ============================================
export const generateComplianceDossierPDF = async (
  documents: any[],
  companyName: string,
  certificateUrl?: string
): Promise<Blob> => {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - 2 * margin;
  
  const currentDate = new Date().toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Colors
  const primaryColor: [number, number, number] = [0, 245, 255]; // #00F5FF
  const darkColor: [number, number, number] = [26, 26, 46]; // #1a1a2e
  const grayColor: [number, number, number] = [100, 100, 100];

  // ============ COVER PAGE ============
  // Background gradient effect (simplified)
  pdf.setFillColor(26, 26, 46);
  pdf.rect(0, 0, pageWidth, pageHeight, 'F');

  // Title
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(32);
  pdf.setFont('helvetica', 'bold');
  pdf.text('DOSSIER DE CONFORMITÉ', pageWidth / 2, 60, { align: 'center' });
  
  pdf.setFontSize(28);
  pdf.text('AI ACT', pageWidth / 2, 75, { align: 'center' });

  // Company name
  pdf.setTextColor(...primaryColor);
  pdf.setFontSize(24);
  pdf.text(companyName || '[Entreprise]', pageWidth / 2, 100, { align: 'center' });

  // Date
  pdf.setTextColor(150, 150, 150);
  pdf.setFontSize(12);
  pdf.text(currentDate, pageWidth / 2, 115, { align: 'center' });

  // QR Code
  if (certificateUrl) {
    try {
      const qrDataURL = await generateQRCodeDataURL(certificateUrl, 200);
      if (qrDataURL) {
        pdf.addImage(qrDataURL, 'PNG', pageWidth / 2 - 25, 140, 50, 50);
        pdf.setFontSize(10);
        pdf.setTextColor(150, 150, 150);
        pdf.text('Scannez pour vérifier l\'authenticité', pageWidth / 2, 200, { align: 'center' });
      }
    } catch (e) {
      console.error('QR code error:', e);
    }
  }

  // Footer
  pdf.setFontSize(10);
  pdf.setTextColor(100, 100, 100);
  pdf.text('Généré via formation-ia-act.fr', pageWidth / 2, pageHeight - 20, { align: 'center' });

  // ============ TABLE OF CONTENTS ============
  pdf.addPage();
  pdf.setFillColor(255, 255, 255);
  pdf.rect(0, 0, pageWidth, pageHeight, 'F');

  pdf.setTextColor(...darkColor);
  pdf.setFontSize(24);
  pdf.setFont('helvetica', 'bold');
  pdf.text('SOMMAIRE', margin, 30);

  pdf.setDrawColor(...primaryColor);
  pdf.setLineWidth(1);
  pdf.line(margin, 35, margin + 60, 35);

  let yPos = 55;
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');

  const completedDocs = documents.filter(d => d.isComplete);
  const pendingDocs = documents.filter(d => !d.isComplete);

  // Completed documents
  pdf.setTextColor(...darkColor);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Documents complétés', margin, yPos);
  yPos += 10;

  pdf.setFont('helvetica', 'normal');
  completedDocs.forEach((doc, idx) => {
    pdf.setTextColor(34, 197, 94); // green
    pdf.text('✓', margin, yPos);
    pdf.setTextColor(...darkColor);
    pdf.text(`${doc.name}`, margin + 8, yPos);
    if (doc.aiActRef) {
      pdf.setTextColor(...grayColor);
      pdf.setFontSize(10);
      pdf.text(`(${doc.aiActRef})`, margin + 100, yPos);
      pdf.setFontSize(12);
    }
    yPos += 8;
  });

  // Pending documents
  if (pendingDocs.length > 0) {
    yPos += 10;
    pdf.setTextColor(...darkColor);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Documents à compléter', margin, yPos);
    yPos += 10;

    pdf.setFont('helvetica', 'normal');
    pendingDocs.forEach((doc) => {
      pdf.setTextColor(234, 179, 8); // yellow
      pdf.text('○', margin, yPos);
      pdf.setTextColor(...grayColor);
      pdf.text(`${doc.name}`, margin + 8, yPos);
      yPos += 8;
    });
  }

  // ============ PROGRESS SUMMARY ============
  pdf.addPage();
  pdf.setTextColor(...darkColor);
  pdf.setFontSize(24);
  pdf.setFont('helvetica', 'bold');
  pdf.text('SYNTHÈSE DE CONFORMITÉ', margin, 30);

  pdf.setDrawColor(...primaryColor);
  pdf.line(margin, 35, margin + 80, 35);

  // Progress stats
  yPos = 55;
  const essentialDocs = documents.filter(d => d.category === 'essential');
  const completedEssential = essentialDocs.filter(d => d.isComplete).length;
  const overallProgress = essentialDocs.length > 0 
    ? Math.round((completedEssential / essentialDocs.length) * 100) 
    : 0;

  // Progress bar
  pdf.setFillColor(230, 230, 230);
  pdf.roundedRect(margin, yPos, contentWidth, 15, 3, 3, 'F');
  
  pdf.setFillColor(...primaryColor);
  pdf.roundedRect(margin, yPos, (contentWidth * overallProgress) / 100, 15, 3, 3, 'F');

  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'bold');
  pdf.text(`${overallProgress}%`, margin + 5, yPos + 10);

  yPos += 30;

  // Stats boxes
  const stats = [
    { label: 'Documents essentiels', value: `${completedEssential}/${essentialDocs.length}`, color: primaryColor },
    { label: 'Documents totaux', value: `${completedDocs.length}/${documents.length}`, color: [139, 92, 246] as [number, number, number] },
    { label: 'Statut', value: overallProgress >= 100 ? 'CONFORME' : 'EN COURS', color: overallProgress >= 100 ? [34, 197, 94] as [number, number, number] : [234, 179, 8] as [number, number, number] },
  ];

  const boxWidth = (contentWidth - 20) / 3;
  stats.forEach((stat, idx) => {
    const xPos = margin + idx * (boxWidth + 10);
    
    pdf.setFillColor(245, 245, 245);
    pdf.roundedRect(xPos, yPos, boxWidth, 40, 3, 3, 'F');
    
    pdf.setTextColor(...grayColor);
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.text(stat.label, xPos + 5, yPos + 12);
    
    pdf.setTextColor(...stat.color);
    pdf.setFontSize(18);
    pdf.setFont('helvetica', 'bold');
    pdf.text(stat.value, xPos + 5, yPos + 30);
  });

  yPos += 60;

  // Document details
  pdf.setTextColor(...darkColor);
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Détail des documents', margin, yPos);
  yPos += 15;

  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');

  documents.forEach((doc) => {
    if (yPos > pageHeight - 30) {
      pdf.addPage();
      yPos = 30;
    }

    // Status icon
    if (doc.isComplete) {
      pdf.setTextColor(34, 197, 94);
      pdf.text('●', margin, yPos);
    } else {
      pdf.setTextColor(234, 179, 8);
      pdf.text('○', margin, yPos);
    }

    // Document name
    pdf.setTextColor(...darkColor);
    pdf.text(doc.name, margin + 8, yPos);

    // Completion %
    pdf.setTextColor(...grayColor);
    pdf.text(`${doc.completionPercent || 0}%`, pageWidth - margin - 20, yPos);

    // AI Act ref
    if (doc.aiActRef) {
      pdf.setFontSize(8);
      pdf.text(doc.aiActRef, margin + 8, yPos + 4);
      pdf.setFontSize(10);
      yPos += 4;
    }

    yPos += 10;
  });

  // ============ FOOTER ON EACH PAGE ============
  const totalPages = pdf.internal.pages.length - 1;
  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i);
    pdf.setFontSize(8);
    pdf.setTextColor(150, 150, 150);
    pdf.text(
      `${companyName || 'Entreprise'} - Dossier de conformité AI Act - Page ${i}/${totalPages}`,
      pageWidth / 2,
      pageHeight - 10,
      { align: 'center' }
    );
  }

  return pdf.output('blob');
};

// ============================================
// HELPER: Download blob as file
// ============================================
export const downloadBlob = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
