'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import jsPDF from 'jspdf';

// ============================================
// TYPES
// ============================================
interface FormationData {
  user: {
    name: string;
    company: string;
    email?: string;
    completionDate: string;
  };
  modules: {
    id: number;
    title: string;
    completed: boolean;
    score?: number;
  }[];
  brainstorming: {
    department: string;
    systems: string[];
  }[];
  classifications: {
    system: string;
    riskLevel: string;
    category: string;
  }[];
  actionPlan: {
    phase: number;
    title: string;
    actions: {
      title: string;
      completed: boolean;
    }[];
  }[];
  totalXP: number;
  averageScore: number;
  certificateCode?: string;
}

interface FormationReportPDFProps {
  moduleColor?: string;
  onGenerate?: () => void;
}

// ============================================
// ICONS
// ============================================
const Icons = {
  Download: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
      <polyline points="7 10 12 15 17 10"/>
      <line x1="12" y1="15" x2="12" y2="3"/>
    </svg>
  ),
  Check: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  Loader: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full animate-spin">
      <circle cx="12" cy="12" r="10" strokeOpacity="0.25"/>
      <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round"/>
    </svg>
  ),
};

// ============================================
// AI ACT EXPLANATIONS DATA
// ============================================
const AI_ACT_EXPLANATIONS = {
  overview: {
    title: "Qu'est-ce que l'AI Act ?",
    content: `Le Reglement europeen sur l'Intelligence Artificielle (AI Act) est le premier cadre juridique complet au monde regissant l'IA. Adopte en 2024, il etablit des regles harmonisees pour le developpement, la mise sur le marche et l'utilisation des systemes d'IA dans l'Union Europeenne. L'AI Act adopte une approche basee sur les risques : plus un systeme d'IA est susceptible de causer des dommages, plus les exigences reglementaires sont strictes.`
  },
  riskLevels: [
    {
      level: "RISQUE INACCEPTABLE",
      color: "#DC2626",
      description: "Systemes INTERDITS car presentant une menace pour les droits fondamentaux",
      examples: [
        "Notation sociale par les gouvernements",
        "Reconnaissance biometrique en temps reel (sauf exceptions)",
        "Manipulation subliminale",
        "Exploitation des vulnerabilites",
        "Reconnaissance des emotions au travail/ecole"
      ],
      deadline: "2 fevrier 2025"
    },
    {
      level: "HAUT RISQUE",
      color: "#F97316",
      description: "Systemes soumis a des obligations strictes de conformite",
      examples: [
        "Recrutement et gestion RH",
        "Education et formation professionnelle",
        "Acces aux services essentiels (credit, assurance)",
        "Application de la loi",
        "Migration et controle aux frontieres"
      ],
      deadline: "2 aout 2026"
    },
    {
      level: "RISQUE LIMITE",
      color: "#EAB308",
      description: "Systemes avec obligations de transparence",
      examples: [
        "Chatbots et assistants virtuels",
        "Systemes de recommandation",
        "IA generative (texte, image, audio)",
        "Deepfakes"
      ],
      deadline: "2 aout 2025"
    },
    {
      level: "RISQUE MINIMAL",
      color: "#22C55E",
      description: "Systemes sans obligations specifiques",
      examples: [
        "Filtres anti-spam",
        "Jeux video avec IA",
        "Correcteurs orthographiques",
        "Systemes de tri de stock"
      ],
      deadline: "Pas d'obligation specifique"
    }
  ],
  keyDates: [
    { date: "1er aout 2024", event: "Entree en vigueur de l'AI Act" },
    { date: "2 fevrier 2025", event: "Interdiction des pratiques IA inacceptables" },
    { date: "2 aout 2025", event: "Obligations de transparence (IA generative)" },
    { date: "2 aout 2026", event: "Conformite complete pour systemes haut risque" },
    { date: "2 aout 2027", event: "Conformite pour IA integree dans produits reglementes" }
  ],
  obligations: {
    highRisk: [
      "Systeme de gestion des risques",
      "Gouvernance des donnees (qualite, tracabilite)",
      "Documentation technique complete",
      "Tenue de logs/registres",
      "Transparence et information des utilisateurs",
      "Controle humain effectif",
      "Exactitude, robustesse et cybersecurite",
      "Evaluation de conformite (avant mise sur le marche)"
    ],
    transparency: [
      "Informer que l'utilisateur interagit avec une IA",
      "Marquer les contenus generes par IA (deepfakes, etc.)",
      "Indiquer que le contenu a ete genere artificiellement"
    ]
  },
  sanctions: [
    { violation: "Pratiques interdites", amende: "35 millions EUR ou 7% du CA mondial" },
    { violation: "Non-conformite systemes haut risque", amende: "15 millions EUR ou 3% du CA mondial" },
    { violation: "Informations incorrectes aux autorites", amende: "7,5 millions EUR ou 1,5% du CA mondial" }
  ]
};

// Helper function to convert hex to RGB
const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 0, g: 0, b: 0 };
};

// ============================================
// PDF GENERATION
// ============================================
const generatePDF = (data: FormationData) => {
  const doc = new jsPDF('p', 'mm', 'a4');
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - 2 * margin;
  let yPos = margin;

  // Helper functions
  const addNewPageIfNeeded = (requiredSpace: number) => {
    if (yPos + requiredSpace > pageHeight - margin) {
      doc.addPage();
      yPos = margin;
      return true;
    }
    return false;
  };

  const drawHeader = (text: string, emoji: string = '') => {
    addNewPageIfNeeded(20);
    doc.setFillColor(103, 126, 234);
    doc.rect(margin, yPos, contentWidth, 12, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(`${emoji} ${text}`, margin + 5, yPos + 8);
    doc.setTextColor(0, 0, 0);
    yPos += 18;
  };

  const drawSubHeader = (text: string) => {
    addNewPageIfNeeded(15);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(60, 60, 60);
    doc.text(text, margin, yPos);
    yPos += 8;
  };

  const drawText = (text: string, indent: number = 0) => {
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(80, 80, 80);
    const lines = doc.splitTextToSize(text, contentWidth - indent);
    lines.forEach((line: string) => {
      addNewPageIfNeeded(6);
      doc.text(line, margin + indent, yPos);
      yPos += 5;
    });
    yPos += 2;
  };

  const drawBullet = (text: string, indent: number = 5) => {
    addNewPageIfNeeded(6);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(80, 80, 80);
    doc.text('*', margin + indent, yPos);
    const lines = doc.splitTextToSize(text, contentWidth - indent - 8);
    lines.forEach((line: string, idx: number) => {
      if (idx > 0) addNewPageIfNeeded(5);
      doc.text(line, margin + indent + 5, yPos);
      if (idx < lines.length - 1) yPos += 5;
    });
    yPos += 6;
  };

  // ============================================
  // PAGE 1: COVER
  // ============================================
  
  // Header background
  doc.setFillColor(103, 126, 234);
  doc.rect(0, 0, pageWidth, 70, 'F');

  // Title
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(26);
  doc.setFont('helvetica', 'bold');
  doc.text('RAPPORT DE FORMATION', pageWidth / 2, 30, { align: 'center' });
  doc.setFontSize(20);
  doc.text('AI Act - Conformite IA', pageWidth / 2, 42, { align: 'center' });
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text('Reglement Europeen sur l\'Intelligence Artificielle', pageWidth / 2, 55, { align: 'center' });

  // User info box
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(margin, 85, contentWidth, 40, 3, 3, 'F');
  doc.setDrawColor(230, 230, 230);
  doc.roundedRect(margin, 85, contentWidth, 40, 3, 3, 'S');
  
  doc.setTextColor(60, 60, 60);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text(data.user.name || 'Apprenant', margin + 10, 100);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(data.user.company || 'Entreprise', margin + 10, 110);
  doc.setFontSize(9);
  doc.setTextColor(120, 120, 120);
  doc.text(`Genere le ${new Date().toLocaleDateString('fr-FR')}`, margin + 10, 120);

  // Score badge
  doc.setFillColor(34, 197, 94);
  doc.roundedRect(pageWidth - margin - 40, 90, 35, 30, 3, 3, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text(`${data.averageScore}%`, pageWidth - margin - 22.5, 107, { align: 'center' });
  doc.setFontSize(8);
  doc.text('Score', pageWidth - margin - 22.5, 115, { align: 'center' });

  // Summary section
  yPos = 140;
  drawHeader('Resume de votre formation', '');
  
  const completedModules = data.modules.filter(m => m.completed).length;
  drawText(`Vous avez complete ${completedModules} modules sur ${data.modules.length} avec un score moyen de ${data.averageScore}%.`);
  drawText(`Total XP acquis : ${data.totalXP} points d'experience.`);
  yPos += 5;

  // Modules list
  drawSubHeader('Modules completes :');
  data.modules.forEach((module) => {
    addNewPageIfNeeded(8);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(60, 60, 60);
    const status = module.completed ? '[OK]' : '[ ]';
    const scoreText = module.score ? ` - Score: ${module.score}%` : '';
    doc.text(`${status} M${module.id} - ${module.title}${scoreText}`, margin + 5, yPos);
    yPos += 6;
  });

  // ============================================
  // PAGE 2: AI ACT OVERVIEW
  // ============================================
  doc.addPage();
  yPos = margin;

  drawHeader("Comprendre l'AI Act", '');
  drawText(AI_ACT_EXPLANATIONS.overview.content);
  yPos += 10;

  // Risk Levels
  drawHeader('Les 4 niveaux de risque', '');
  
  AI_ACT_EXPLANATIONS.riskLevels.forEach(risk => {
    addNewPageIfNeeded(45);
    
    // Risk level header
    const rgb = hexToRgb(risk.color);
    doc.setFillColor(rgb.r, rgb.g, rgb.b);
    doc.roundedRect(margin, yPos, contentWidth, 8, 2, 2, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(risk.level, margin + 5, yPos + 5.5);
    doc.setFontSize(8);
    doc.text(`Echeance: ${risk.deadline}`, pageWidth - margin - 5, yPos + 5.5, { align: 'right' });
    yPos += 12;
    
    doc.setTextColor(60, 60, 60);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'italic');
    doc.text(risk.description, margin, yPos);
    yPos += 8;
    
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text('Exemples :', margin, yPos);
    yPos += 5;
    
    risk.examples.forEach(ex => {
      drawBullet(ex, 5);
    });
    yPos += 3;
  });

  // ============================================
  // PAGE 3: CALENDAR & OBLIGATIONS
  // ============================================
  doc.addPage();
  yPos = margin;

  // Key Dates
  drawHeader('Calendrier de mise en conformite', '');
  
  AI_ACT_EXPLANATIONS.keyDates.forEach(item => {
    addNewPageIfNeeded(10);
    doc.setFillColor(240, 240, 255);
    doc.roundedRect(margin, yPos, contentWidth, 8, 2, 2, 'F');
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(103, 126, 234);
    doc.text(item.date, margin + 5, yPos + 5.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(60, 60, 60);
    doc.text(item.event, margin + 40, yPos + 5.5);
    yPos += 11;
  });

  yPos += 10;

  // Obligations for high risk
  drawHeader('Obligations pour systemes a haut risque', '');
  
  AI_ACT_EXPLANATIONS.obligations.highRisk.forEach(obligation => {
    drawBullet(obligation);
  });

  yPos += 5;

  // Transparency obligations
  drawSubHeader('Obligations de transparence (tous systemes) :');
  
  AI_ACT_EXPLANATIONS.obligations.transparency.forEach(obligation => {
    drawBullet(obligation);
  });

  yPos += 10;

  // Sanctions
  addNewPageIfNeeded(50);
  drawHeader('Sanctions en cas de non-conformite', '');
  
  AI_ACT_EXPLANATIONS.sanctions.forEach(sanction => {
    addNewPageIfNeeded(12);
    doc.setFillColor(254, 243, 199);
    doc.roundedRect(margin, yPos, contentWidth, 10, 2, 2, 'F');
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(146, 64, 14);
    doc.text(sanction.violation, margin + 5, yPos + 6);
    doc.setFont('helvetica', 'normal');
    doc.text(sanction.amende, pageWidth - margin - 5, yPos + 6, { align: 'right' });
    yPos += 13;
  });

  // ============================================
  // PAGE 4: USER RESULTS
  // ============================================
  doc.addPage();
  yPos = margin;

  // Brainstorming results
  if (data.brainstorming.length > 0 && data.brainstorming.some(b => b.systems.length > 0)) {
    drawHeader('Vos systemes IA identifies', '');
    
    data.brainstorming.forEach(dept => {
      if (dept.systems.length > 0) {
        addNewPageIfNeeded(15);
        drawSubHeader(dept.department);
        dept.systems.forEach(system => {
          drawBullet(system);
        });
        yPos += 3;
      }
    });
    yPos += 5;
  }

  // Classification results
  if (data.classifications.length > 0) {
    addNewPageIfNeeded(30);
    drawHeader('Classification de vos systemes', '');
    
    data.classifications.forEach(classif => {
      addNewPageIfNeeded(12);
      const riskColors: Record<string, string> = {
        'inacceptable': '#DC2626',
        'prohibited': '#DC2626',
        'haut': '#F97316',
        'high': '#F97316',
        'limite': '#EAB308',
        'limited': '#EAB308',
        'minimal': '#22C55E'
      };
      const color = riskColors[classif.riskLevel.toLowerCase()] || '#6B7280';
      const rgb = hexToRgb(color);
      
      doc.setFillColor(248, 250, 252);
      doc.roundedRect(margin, yPos, contentWidth, 10, 2, 2, 'F');
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(60, 60, 60);
      doc.text(classif.system, margin + 5, yPos + 6);
      
      // Risk badge
      doc.setFillColor(rgb.r, rgb.g, rgb.b);
      doc.roundedRect(pageWidth - margin - 35, yPos + 2, 30, 6, 2, 2, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(7);
      doc.text(classif.riskLevel.toUpperCase(), pageWidth - margin - 20, yPos + 6, { align: 'center' });
      yPos += 13;
    });
    yPos += 5;
  }

  // Action Plan
  if (data.actionPlan.length > 0) {
    addNewPageIfNeeded(30);
    drawHeader('Votre plan d\'action 90 jours', '');
    
    data.actionPlan.forEach(phase => {
      addNewPageIfNeeded(20);
      
      // Phase header
      doc.setFillColor(103, 126, 234);
      doc.circle(margin + 5, yPos + 3, 4, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');
      doc.text(String(phase.phase), margin + 5, yPos + 4.5, { align: 'center' });
      
      doc.setTextColor(60, 60, 60);
      doc.setFontSize(11);
      doc.text(phase.title, margin + 15, yPos + 5);
      yPos += 12;
      
      phase.actions.forEach(action => {
        addNewPageIfNeeded(8);
        const checkbox = action.completed ? '[X]' : '[ ]';
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(action.completed ? 120 : 60, action.completed ? 120 : 60, action.completed ? 120 : 60);
        doc.text(`${checkbox} ${action.title}`, margin + 10, yPos);
        yPos += 7;
      });
      yPos += 5;
    });
  }

  // ============================================
  // LAST PAGE: RECOMMENDATIONS
  // ============================================
  doc.addPage();
  yPos = margin;

  drawHeader('Recommandations personnalisees', '');

  // Priority recommendation
  const hasProhibited = data.classifications.some(c => 
    c.riskLevel.toLowerCase() === 'inacceptable' || c.riskLevel.toLowerCase() === 'prohibited'
  );
  const hasHighRisk = data.classifications.some(c => 
    c.riskLevel.toLowerCase() === 'haut' || c.riskLevel.toLowerCase() === 'high'
  );

  doc.setFillColor(254, 243, 199);
  doc.roundedRect(margin, yPos, contentWidth, 28, 3, 3, 'F');
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(146, 64, 14);
  doc.text('PRIORITE IMMEDIATE', margin + 5, yPos + 8);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  
  let priorityText = '';
  if (hasProhibited) {
    priorityText = 'ATTENTION : Vous avez identifie des systemes a risque INACCEPTABLE. Ces systemes doivent etre immediatement retires ou modifies avant le 2 fevrier 2025.';
  } else if (hasHighRisk) {
    priorityText = 'Vos systemes a HAUT RISQUE necessitent une attention prioritaire : documentation technique, evaluation de conformite, et supervision humaine.';
  } else {
    priorityText = 'Bonne nouvelle ! Vos systemes identifies presentent un risque limite ou minimal. Continuez a maintenir votre documentation a jour.';
  }
  const priorityLines = doc.splitTextToSize(priorityText, contentWidth - 10);
  doc.text(priorityLines, margin + 5, yPos + 16);
  yPos += 35;

  // Next steps
  drawSubHeader('Prochaines etapes recommandees :');
  const nextSteps = [
    'Completer votre registre des systemes IA avec tous les details techniques',
    'Former les equipes concernees sur leurs obligations specifiques',
    'Mettre en place la supervision humaine pour les systemes a haut risque',
    'Planifier un audit interne de conformite avant les echeances',
    'Documenter les evaluations d\'impact pour chaque systeme haut risque',
    'Etablir une procedure de signalement des incidents IA'
  ];
  nextSteps.forEach(step => drawBullet(step));

  yPos += 10;

  // Resources
  drawSubHeader('Ressources complementaires :');
  const resources = [
    'Texte officiel de l\'AI Act : eur-lex.europa.eu',
    'Guide de la CNIL sur l\'IA : cnil.fr',
    'Documentation technique disponible sur votre espace formation'
  ];
  resources.forEach(resource => drawBullet(resource));

  // Footer
  yPos = pageHeight - 25;
  doc.setDrawColor(200, 200, 200);
  doc.line(margin, yPos, pageWidth - margin, yPos);
  yPos += 6;
  doc.setFontSize(8);
  doc.setTextColor(120, 120, 120);
  doc.text('Rapport genere suite a la formation "Maitrisez l\'AI Act" - Formation certifiee Qualiopi', pageWidth / 2, yPos, { align: 'center' });
  if (data.certificateCode) {
    doc.text(`Code de verification : ${data.certificateCode}`, pageWidth / 2, yPos + 5, { align: 'center' });
  }
  doc.text(`${new Date().getFullYear()} Modernee - Tous droits reserves`, pageWidth / 2, yPos + 10, { align: 'center' });

  // Save PDF
  const fileName = `rapport-formation-ai-act-${data.user.name.replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
};

// ============================================
// MAIN COMPONENT
// ============================================
export default function FormationReportPDF({ 
  moduleColor = '#8B5CF6',
  onGenerate 
}: FormationReportPDFProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);

  const loadFormationData = (): FormationData => {
    if (typeof window === 'undefined') {
      return getDefaultData();
    }

    try {
      const userInfo = JSON.parse(localStorage.getItem('formationUser') || '{}');
      const certificateData = JSON.parse(localStorage.getItem('certificateData') || '{}');
      const progress = JSON.parse(localStorage.getItem('formationProgress') || '{}');
      const brainstormingRaw = JSON.parse(localStorage.getItem('brainstormingData') || '[]');
      const classificationRaw = JSON.parse(localStorage.getItem('classificationData') || '[]');
      const actionPlanRaw = JSON.parse(localStorage.getItem('actionPlanData') || '[]');

      const scores = Object.values(progress.quizScores || {}) as number[];
      const averageScore = scores.length > 0 
        ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
        : 85;

      return {
        user: {
          name: userInfo.name || certificateData.userName || 'Apprenant',
          company: userInfo.company || certificateData.company || 'Entreprise',
          email: userInfo.email,
          completionDate: certificateData.completionDate || new Date().toISOString()
        },
        modules: [
          { id: 0, title: 'Intro', completed: true, score: progress.quizScores?.['0'] || 100 },
          { id: 1, title: 'Concerne ?', completed: true, score: progress.quizScores?.['1'] || 85 },
          { id: 2, title: 'Cartographie', completed: true, score: progress.quizScores?.['2'] || 90 },
          { id: 3, title: 'Classification', completed: true, score: progress.quizScores?.['3'] || 80 },
          { id: 4, title: 'Documentation', completed: true, score: progress.quizScores?.['4'] || 85 },
          { id: 5, title: 'Gouvernance', completed: true, score: progress.quizScores?.['5'] || 88 },
          { id: 6, title: 'Audit', completed: true, score: progress.quizScores?.['6'] || 82 },
          { id: 7, title: 'Plan 90j', completed: true, score: progress.quizScores?.['7'] || 90 },
        ],
        brainstorming: Array.isArray(brainstormingRaw) ? brainstormingRaw : [],
        classifications: Array.isArray(classificationRaw) ? classificationRaw : [],
        actionPlan: Array.isArray(actionPlanRaw) ? actionPlanRaw : [],
        totalXP: progress.totalXP || 1600,
        averageScore,
        certificateCode: certificateData.verificationCode
      };
    } catch (e) {
      console.error('Error loading formation data:', e);
      return getDefaultData();
    }
  };

  const getDefaultData = (): FormationData => ({
    user: { name: 'Apprenant', company: 'Entreprise', completionDate: new Date().toISOString() },
    modules: [
      { id: 0, title: 'Intro', completed: true, score: 100 },
      { id: 1, title: 'Concerne ?', completed: true, score: 85 },
      { id: 2, title: 'Cartographie', completed: true, score: 90 },
      { id: 3, title: 'Classification', completed: true, score: 80 },
      { id: 4, title: 'Documentation', completed: true, score: 85 },
      { id: 5, title: 'Gouvernance', completed: true, score: 88 },
      { id: 6, title: 'Audit', completed: true, score: 82 },
      { id: 7, title: 'Plan 90j', completed: true, score: 90 },
    ],
    brainstorming: [],
    classifications: [],
    actionPlan: [],
    totalXP: 1600,
    averageScore: 85
  });

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const data = loadFormationData();
      generatePDF(data);
      setIsGenerated(true);
      if (onGenerate) onGenerate();
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Erreur lors de la generation du PDF. Veuillez reessayer.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-2xl p-6 border border-white/10">
      <div className="flex items-start gap-4 mb-6">
        <div 
          className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl"
          style={{ backgroundColor: `${moduleColor}20` }}
        >
          📄
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-white mb-1">
            Rapport PDF Complet
          </h3>
          <p className="text-white/60 text-sm">
            Téléchargez votre rapport personnalisé avec toutes les explications sur l'AI Act,
            vos résultats et votre plan d'action.
          </p>
        </div>
      </div>

      {/* What's included */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {[
          { icon: '📜', label: "Explications AI Act" },
          { icon: '⚖️', label: '4 niveaux de risque' },
          { icon: '📅', label: 'Calendrier 2024-2027' },
          { icon: '📋', label: 'Vos obligations' },
          { icon: '🗺️', label: 'Vos systèmes IA' },
          { icon: '💡', label: 'Recommandations' },
        ].map((item, idx) => (
          <div 
            key={idx}
            className="flex items-center gap-2 bg-white/5 rounded-lg px-3 py-2"
          >
            <span className="text-lg">{item.icon}</span>
            <span className="text-white/80 text-sm">{item.label}</span>
          </div>
        ))}
      </div>

      {/* Generate Button */}
      <motion.button
        onClick={handleGenerate}
        disabled={isGenerating}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full py-4 rounded-xl font-bold text-black flex items-center justify-center gap-3 transition-all disabled:opacity-50"
        style={{ backgroundColor: moduleColor }}
      >
        <div className="w-6 h-6">
          {isGenerating ? <Icons.Loader /> : isGenerated ? <Icons.Check /> : <Icons.Download />}
        </div>
        {isGenerating 
          ? 'Génération en cours...' 
          : isGenerated 
          ? '✅ Téléchargé ! Cliquez pour régénérer'
          : 'Télécharger le rapport PDF'}
      </motion.button>

      {isGenerated && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center text-green-400 text-sm mt-3"
        >
          Le PDF a été téléchargé sur votre ordinateur !
        </motion.p>
      )}

      <p className="text-white/40 text-xs text-center mt-4">
        Document PDF de ~8 pages avec toutes les explications AI Act
      </p>
    </div>
  );
}
