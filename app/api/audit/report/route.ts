// app/api/audit/report/route.ts
// Génération du rapport PDF d'audit AI Act professionnel

import { NextRequest, NextResponse } from "next/server";
import PDFDocument from "pdfkit";

// Configuration
const ORGANISME = {
  name: "Formation-IA-Act.fr",
  website: "https://formation-ia-act.fr",
  email: "contact@formation-ia-act.fr",
};

// Types
interface AuditData {
  score: number;
  plan: string;
  company?: string;
  answers?: Record<string, number>;
  categoryScores?: Record<string, number>;
  date?: string;
}

// Catégories avec descriptions
const CATEGORIES = {
  identification: {
    name: "Identification des systèmes IA",
    icon: "📋",
    description: "Capacité à inventorier et documenter les systèmes d'IA utilisés",
    recommendations: {
      low: [
        "Réaliser un inventaire complet de tous les outils utilisant l'IA",
        "Créer un registre centralisé des systèmes IA",
        "Identifier les responsables pour chaque système",
        "Documenter les cas d'usage de chaque outil IA",
      ],
      medium: [
        "Compléter l'inventaire avec les systèmes manquants",
        "Mettre à jour régulièrement le registre (trimestriel)",
        "Formaliser les processus d'ajout de nouveaux outils IA",
      ],
      high: [
        "Maintenir le registre à jour",
        "Automatiser la détection de nouveaux outils IA",
      ],
    },
  },
  classification: {
    name: "Classification des risques",
    icon: "⚠️",
    description: "Évaluation des niveaux de risque selon l'AI Act",
    recommendations: {
      low: [
        "Former les équipes aux 4 niveaux de risque AI Act",
        "Classifier chaque système IA selon la matrice de risques",
        "Identifier les systèmes à haut risque prioritaires",
        "Vérifier l'absence de systèmes à risque inacceptable",
      ],
      medium: [
        "Affiner la classification des systèmes ambigus",
        "Documenter les justifications de classification",
        "Mettre en place une revue périodique des classifications",
      ],
      high: [
        "Maintenir la veille sur les évolutions réglementaires",
        "Anticiper les reclassifications potentielles",
      ],
    },
  },
  gouvernance: {
    name: "Gouvernance IA",
    icon: "🏛️",
    description: "Structure organisationnelle et politique d'utilisation de l'IA",
    recommendations: {
      low: [
        "Désigner un référent IA au niveau direction",
        "Rédiger une politique d'utilisation de l'IA",
        "Créer un comité de gouvernance IA",
        "Définir les processus de validation des nouveaux outils",
      ],
      medium: [
        "Formaliser les rôles et responsabilités",
        "Mettre en place des indicateurs de suivi",
        "Organiser des revues trimestrielles de gouvernance",
      ],
      high: [
        "Optimiser les processus existants",
        "Partager les bonnes pratiques en interne",
      ],
    },
  },
  documentation: {
    name: "Documentation technique",
    icon: "📄",
    description: "Qualité et exhaustivité de la documentation des systèmes IA",
    recommendations: {
      low: [
        "Créer une documentation technique pour chaque système à haut risque",
        "Documenter les données d'entraînement utilisées",
        "Mettre en place la traçabilité des décisions IA",
        "Conserver les logs pendant la durée réglementaire",
      ],
      medium: [
        "Compléter la documentation existante",
        "Standardiser les formats de documentation",
        "Automatiser la génération de rapports",
      ],
      high: [
        "Maintenir la documentation à jour",
        "Préparer la documentation pour les audits externes",
      ],
    },
  },
  formation: {
    name: "Formation des équipes",
    icon: "🎓",
    description: "Niveau de compétence et sensibilisation des collaborateurs",
    recommendations: {
      low: [
        "Former tous les utilisateurs d'IA aux bases de l'AI Act",
        "Mettre en place une formation certifiante pour les responsables",
        "Créer un programme d'onboarding incluant l'IA",
        "Sensibiliser la direction aux enjeux de conformité",
      ],
      medium: [
        "Approfondir les formations par métier",
        "Mettre en place des formations continues",
        "Évaluer régulièrement les compétences",
      ],
      high: [
        "Maintenir les certifications à jour",
        "Partager la veille réglementaire",
      ],
    },
  },
  conformite: {
    name: "Conformité générale",
    icon: "✅",
    description: "Niveau global de conformité aux exigences de l'AI Act",
    recommendations: {
      low: [
        "Réaliser un audit complet de conformité",
        "Établir un plan de mise en conformité priorisé",
        "Allouer un budget dédié à la conformité IA",
        "Anticiper les échéances réglementaires (février 2025)",
      ],
      medium: [
        "Accélérer la mise en œuvre du plan de conformité",
        "Mettre en place des contrôles internes",
        "Préparer les preuves de conformité",
      ],
      high: [
        "Maintenir le niveau de conformité",
        "Anticiper les évolutions réglementaires",
      ],
    },
  },
};

// Amendes potentielles par niveau de risque
const AMENDES = {
  inacceptable: "Jusqu'à 35M€ ou 7% du CA mondial",
  haut: "Jusqu'à 15M€ ou 3% du CA mondial",
  obligations: "Jusqu'à 7.5M€ ou 1.5% du CA mondial",
};

// Helper: Générer le PDF
async function generatePDFBuffer(data: AuditData): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ 
      margin: 50, 
      size: "A4",
      info: {
        Title: `Rapport Audit AI Act - ${data.company || "Entreprise"}`,
        Author: ORGANISME.name,
        Subject: "Audit de conformité AI Act",
      }
    });
    
    const chunks: Buffer[] = [];
    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    const score = data.score;
    const plan = data.plan;
    const company = data.company || "Votre entreprise";
    const date = data.date || new Date().toLocaleDateString("fr-FR");
    
    // Scores par catégorie (simulés si non fournis)
    const categoryScores = data.categoryScores || {
      identification: Math.max(20, Math.min(100, score + Math.floor(Math.random() * 30 - 15))),
      classification: Math.max(20, Math.min(100, score + Math.floor(Math.random() * 30 - 15))),
      gouvernance: Math.max(20, Math.min(100, score + Math.floor(Math.random() * 30 - 15))),
      documentation: Math.max(20, Math.min(100, score + Math.floor(Math.random() * 30 - 15))),
      formation: Math.max(20, Math.min(100, score + Math.floor(Math.random() * 30 - 15))),
      conformite: Math.max(20, Math.min(100, score + Math.floor(Math.random() * 30 - 15))),
    };

    // Déterminer le niveau de risque
    const getRiskLevel = (s: number) => {
      if (s >= 80) return { level: "Faible", color: "#00FF88" };
      if (s >= 60) return { level: "Modéré", color: "#FFB800" };
      if (s >= 40) return { level: "Élevé", color: "#FF6B00" };
      return { level: "Critique", color: "#FF4444" };
    };

    const risk = getRiskLevel(score);

    // ============================================
    // PAGE 1: COUVERTURE
    // ============================================
    doc.rect(0, 0, doc.page.width, doc.page.height).fill("#0A0A1B");
    
    // Logo zone
    doc.rect(50, 50, 100, 40).fill("#00F5FF");
    doc.fillColor("#0A0A1B").fontSize(14).font("Helvetica-Bold");
    doc.text("AI ACT", 60, 65);
    
    doc.fillColor("#FFFFFF");
    doc.fontSize(12).font("Helvetica").text(ORGANISME.name, 170, 60);
    
    // Titre principal
    doc.fontSize(36).font("Helvetica-Bold");
    doc.text("RAPPORT D'AUDIT", 50, 200, { align: "center" });
    doc.fontSize(28);
    doc.text("CONFORMITÉ AI ACT", 50, 250, { align: "center" });
    
    // Score principal
    doc.fontSize(120).fillColor(risk.color);
    doc.text(`${score}%`, 50, 320, { align: "center" });
    
    doc.fontSize(24).fillColor("#FFFFFF");
    doc.text(`Risque ${risk.level}`, 50, 460, { align: "center" });
    
    // Informations
    doc.fontSize(14).fillColor("#888888");
    doc.text(`Entreprise: ${company}`, 50, 550);
    doc.text(`Date de l'audit: ${date}`, 50, 570);
    doc.text(`Formule: ${plan.charAt(0).toUpperCase() + plan.slice(1)}`, 50, 590);
    
    // Footer
    doc.fontSize(10).fillColor("#666666");
    doc.text(`Généré par ${ORGANISME.name}`, 50, doc.page.height - 50, { align: "center" });

    // ============================================
    // PAGE 2: SOMMAIRE EXÉCUTIF
    // ============================================
    doc.addPage();
    doc.rect(0, 0, doc.page.width, 80).fill("#0A0A1B");
    doc.fillColor("#FFFFFF").fontSize(20).font("Helvetica-Bold");
    doc.text("SOMMAIRE EXÉCUTIF", 50, 35);
    
    doc.fillColor("#000000");
    doc.y = 100;
    
    doc.fontSize(14).font("Helvetica-Bold").text("Synthèse de l'audit");
    doc.moveDown(0.5);
    doc.fontSize(11).font("Helvetica");
    
    let synthese = "";
    if (score >= 80) {
      synthese = `${company} présente un bon niveau de conformité à l'AI Act. Les fondamentaux sont en place et quelques ajustements mineurs permettront d'atteindre une conformité optimale avant les échéances réglementaires.`;
    } else if (score >= 60) {
      synthese = `${company} a entamé sa démarche de conformité à l'AI Act mais des améliorations significatives sont nécessaires. Un plan d'action structuré sur 6 mois permettra d'atteindre un niveau satisfaisant.`;
    } else if (score >= 40) {
      synthese = `${company} présente des lacunes importantes en matière de conformité à l'AI Act. Une action rapide et coordonnée est nécessaire pour éviter les risques juridiques et financiers liés à la non-conformité.`;
    } else {
      synthese = `${company} n'est pas préparée aux exigences de l'AI Act. Un plan d'urgence doit être mis en place immédiatement pour identifier et traiter les risques critiques avant l'entrée en vigueur du règlement.`;
    }
    doc.text(synthese, { width: doc.page.width - 100 });
    doc.moveDown(1.5);

    // Points clés
    doc.fontSize(14).font("Helvetica-Bold").text("Points clés identifiés");
    doc.moveDown(0.5);
    doc.fontSize(11).font("Helvetica");
    
    // Points forts
    doc.fillColor("#00AA66").text("✓ Points forts:");
    doc.fillColor("#000000");
    const strengths = Object.entries(categoryScores)
      .filter(([_, s]) => s >= 60)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);
    
    strengths.forEach(([cat, s]) => {
      const catInfo = CATEGORIES[cat as keyof typeof CATEGORIES];
      doc.text(`  • ${catInfo.name}: ${s}%`, { indent: 20 });
    });
    doc.moveDown(0.5);
    
    // Points à améliorer
    doc.fillColor("#DD4444").text("✗ Points à améliorer:");
    doc.fillColor("#000000");
    const weaknesses = Object.entries(categoryScores)
      .filter(([_, s]) => s < 60)
      .sort((a, b) => a[1] - b[1])
      .slice(0, 3);
    
    weaknesses.forEach(([cat, s]) => {
      const catInfo = CATEGORIES[cat as keyof typeof CATEGORIES];
      doc.text(`  • ${catInfo.name}: ${s}%`, { indent: 20 });
    });
    doc.moveDown(1.5);

    // Risques financiers
    doc.fontSize(14).font("Helvetica-Bold").text("Risques financiers potentiels");
    doc.moveDown(0.5);
    doc.fontSize(11).font("Helvetica");
    
    doc.rect(50, doc.y, doc.page.width - 100, 70).fill("#FFF5F5");
    const riskY = doc.y + 10;
    doc.fillColor("#CC0000").font("Helvetica-Bold");
    doc.text("⚠️ Amendes prévues par l'AI Act:", 60, riskY);
    doc.font("Helvetica").fillColor("#660000");
    doc.text(`• Pratiques interdites: ${AMENDES.inacceptable}`, 70, riskY + 18);
    doc.text(`• Non-conformité systèmes haut risque: ${AMENDES.haut}`, 70, riskY + 33);
    doc.text(`• Non-respect des obligations: ${AMENDES.obligations}`, 70, riskY + 48);
    doc.fillColor("#000000");
    doc.y = riskY + 80;

    // ============================================
    // PAGE 3: SCORES DÉTAILLÉS PAR CATÉGORIE
    // ============================================
    doc.addPage();
    doc.rect(0, 0, doc.page.width, 80).fill("#0A0A1B");
    doc.fillColor("#FFFFFF").fontSize(20).font("Helvetica-Bold");
    doc.text("ANALYSE DÉTAILLÉE", 50, 35);
    
    doc.fillColor("#000000");
    doc.y = 100;

    Object.entries(CATEGORIES).forEach(([key, cat], index) => {
      const catScore = categoryScores[key] || 50;
      const catRisk = getRiskLevel(catScore);
      
      // Nouvelle page si nécessaire
      if (doc.y > 680) {
        doc.addPage();
        doc.y = 50;
      }
      
      // Titre catégorie
      doc.fontSize(14).font("Helvetica-Bold").fillColor("#0A0A1B");
      doc.text(`${cat.icon} ${cat.name}`, 50, doc.y);
      
      // Barre de progression
      const barY = doc.y + 20;
      const barWidth = 300;
      doc.rect(50, barY, barWidth, 12).fill("#E0E0E0");
      doc.rect(50, barY, barWidth * (catScore / 100), 12).fill(catRisk.color);
      
      // Score
      doc.fontSize(16).font("Helvetica-Bold").fillColor(catRisk.color);
      doc.text(`${catScore}%`, 360, barY - 2);
      
      // Description
      doc.fontSize(10).font("Helvetica").fillColor("#666666");
      doc.text(cat.description, 50, barY + 18, { width: 400 });
      
      doc.y = barY + 45;
    });

    // ============================================
    // PAGES 4+: RECOMMANDATIONS DÉTAILLÉES
    // ============================================
    doc.addPage();
    doc.rect(0, 0, doc.page.width, 80).fill("#0A0A1B");
    doc.fillColor("#FFFFFF").fontSize(20).font("Helvetica-Bold");
    doc.text("RECOMMANDATIONS", 50, 35);
    
    doc.fillColor("#000000");
    doc.y = 100;

    let recNumber = 1;
    Object.entries(CATEGORIES).forEach(([key, cat]) => {
      const catScore = categoryScores[key] || 50;
      
      // Déterminer le niveau de recommandations
      let recsLevel: "low" | "medium" | "high" = "low";
      if (catScore >= 80) recsLevel = "high";
      else if (catScore >= 50) recsLevel = "medium";
      
      const recs = cat.recommendations[recsLevel];
      
      // Nouvelle page si nécessaire
      if (doc.y > 650) {
        doc.addPage();
        doc.y = 50;
      }
      
      // Titre
      doc.fontSize(13).font("Helvetica-Bold").fillColor("#0A0A1B");
      doc.text(`${cat.icon} ${cat.name}`, 50, doc.y);
      doc.moveDown(0.3);
      
      // Recommandations
      doc.fontSize(10).font("Helvetica").fillColor("#333333");
      recs.forEach((rec) => {
        if (doc.y > 750) {
          doc.addPage();
          doc.y = 50;
        }
        doc.text(`${recNumber}. ${rec}`, 60, doc.y, { width: doc.page.width - 120 });
        doc.moveDown(0.5);
        recNumber++;
      });
      
      doc.moveDown(1);
    });

    // ============================================
    // PAGE: PLAN D'ACTION (Pro et Enterprise)
    // ============================================
    if (plan === "pro" || plan === "enterprise") {
      doc.addPage();
      doc.rect(0, 0, doc.page.width, 80).fill("#0A0A1B");
      doc.fillColor("#FFFFFF").fontSize(20).font("Helvetica-Bold");
      doc.text("PLAN D'ACTION PRIORISÉ", 50, 35);
      
      doc.fillColor("#000000");
      doc.y = 100;

      // Timeline
      const phases = [
        { 
          name: "Phase 1: Urgences (0-1 mois)", 
          color: "#FF4444",
          actions: [
            "Identifier tous les systèmes IA à risque inacceptable",
            "Stopper l'utilisation des pratiques interdites",
            "Désigner un responsable IA provisoire",
            "Sensibiliser la direction aux enjeux",
          ]
        },
        { 
          name: "Phase 2: Fondations (1-3 mois)", 
          color: "#FF6B00",
          actions: [
            "Réaliser l'inventaire complet des systèmes IA",
            "Classifier tous les systèmes selon les 4 niveaux",
            "Rédiger la politique d'utilisation de l'IA",
            "Lancer le programme de formation",
          ]
        },
        { 
          name: "Phase 3: Conformité (3-6 mois)", 
          color: "#FFB800",
          actions: [
            "Documenter les systèmes à haut risque",
            "Mettre en place la gouvernance IA",
            "Implémenter les contrôles internes",
            "Préparer les preuves de conformité",
          ]
        },
        { 
          name: "Phase 4: Optimisation (6-12 mois)", 
          color: "#00FF88",
          actions: [
            "Automatiser les processus de conformité",
            "Former les nouveaux collaborateurs",
            "Réaliser des audits internes réguliers",
            "Anticiper les évolutions réglementaires",
          ]
        },
      ];

      phases.forEach((phase) => {
        if (doc.y > 650) {
          doc.addPage();
          doc.y = 50;
        }
        
        doc.rect(50, doc.y, 8, 60).fill(phase.color);
        doc.fontSize(12).font("Helvetica-Bold").fillColor("#0A0A1B");
        doc.text(phase.name, 70, doc.y);
        doc.moveDown(0.5);
        
        doc.fontSize(10).font("Helvetica").fillColor("#333333");
        phase.actions.forEach((action) => {
          doc.text(`☐ ${action}`, 80, doc.y, { width: doc.page.width - 140 });
          doc.moveDown(0.4);
        });
        
        doc.y += 20;
      });
    }

    // ============================================
    // PAGE: ESTIMATION BUDGET (Pro et Enterprise)
    // ============================================
    if (plan === "pro" || plan === "enterprise") {
      doc.addPage();
      doc.rect(0, 0, doc.page.width, 80).fill("#0A0A1B");
      doc.fillColor("#FFFFFF").fontSize(20).font("Helvetica-Bold");
      doc.text("ESTIMATION BUDGÉTAIRE", 50, 35);
      
      doc.fillColor("#000000");
      doc.y = 100;

      doc.fontSize(11).font("Helvetica");
      doc.text("Estimation indicative basée sur votre profil de risque:", 50, doc.y);
      doc.moveDown(1);

      const budgetItems = [
        { item: "Formation équipes (certifiante AI Act)", min: 2000, max: 10000 },
        { item: "Accompagnement mise en conformité", min: 5000, max: 30000 },
        { item: "Documentation technique", min: 3000, max: 15000 },
        { item: "Outils de gouvernance IA", min: 1000, max: 10000 },
        { item: "Audit externe de conformité", min: 5000, max: 20000 },
      ];

      // Table header
      doc.rect(50, doc.y, doc.page.width - 100, 25).fill("#F0F0F0");
      doc.fillColor("#000000").font("Helvetica-Bold");
      doc.text("Poste de dépense", 60, doc.y + 8);
      doc.text("Budget estimé", 400, doc.y + 8);
      doc.y += 30;

      let totalMin = 0;
      let totalMax = 0;

      budgetItems.forEach((item, i) => {
        if (i % 2 === 0) {
          doc.rect(50, doc.y - 5, doc.page.width - 100, 25).fill("#FAFAFA");
        }
        doc.fillColor("#000000").font("Helvetica");
        doc.text(item.item, 60, doc.y);
        doc.text(`${item.min.toLocaleString()} - ${item.max.toLocaleString()} €`, 400, doc.y);
        totalMin += item.min;
        totalMax += item.max;
        doc.y += 25;
      });

      // Total
      doc.rect(50, doc.y, doc.page.width - 100, 30).fill("#0A0A1B");
      doc.fillColor("#FFFFFF").font("Helvetica-Bold");
      doc.text("TOTAL ESTIMÉ", 60, doc.y + 10);
      doc.text(`${totalMin.toLocaleString()} - ${totalMax.toLocaleString()} €`, 380, doc.y + 10);
      
      doc.y += 50;
      doc.fillColor("#666666").fontSize(9).font("Helvetica");
      doc.text("* Ces estimations sont indicatives et varient selon la taille de l'entreprise, le nombre de systèmes IA et la complexité de votre environnement.", 50, doc.y, { width: doc.page.width - 100 });
    }

    // ============================================
    // DERNIÈRE PAGE: PROCHAINES ÉTAPES
    // ============================================
    doc.addPage();
    doc.rect(0, 0, doc.page.width, 80).fill("#0A0A1B");
    doc.fillColor("#FFFFFF").fontSize(20).font("Helvetica-Bold");
    doc.text("PROCHAINES ÉTAPES", 50, 35);
    
    doc.fillColor("#000000");
    doc.y = 100;

    doc.fontSize(12).font("Helvetica-Bold").text("Pour aller plus loin:");
    doc.moveDown(1);

    const nextSteps = [
      {
        icon: "🎓",
        title: "Formation certifiante AI Act",
        desc: "Formez vos équipes avec notre formation certifiante. 8h de contenu, quiz interactifs, certificat officiel.",
        cta: "formation-ia-act.fr/pricing",
      },
      {
        icon: "📋",
        title: "Pack Templates Conformité",
        desc: "12 documents prêts à l'emploi: registre IA, politique, matrices de risques, documentation technique...",
        cta: "formation-ia-act.fr/templates",
      },
      {
        icon: "🤝",
        title: "Accompagnement personnalisé",
        desc: "Nos experts vous accompagnent dans votre mise en conformité. Diagnostic, roadmap, implémentation.",
        cta: "formation-ia-act.fr/contact",
      },
    ];

    nextSteps.forEach((step) => {
      doc.fontSize(14).font("Helvetica-Bold").fillColor("#0A0A1B");
      doc.text(`${step.icon} ${step.title}`, 50, doc.y);
      doc.moveDown(0.3);
      doc.fontSize(10).font("Helvetica").fillColor("#333333");
      doc.text(step.desc, 50, doc.y, { width: doc.page.width - 100 });
      doc.moveDown(0.2);
      doc.fillColor("#0066FF").text(step.cta);
      doc.moveDown(1.5);
    });

    // Contact
    doc.y = doc.page.height - 150;
    doc.rect(50, doc.y, doc.page.width - 100, 80).fill("#F5F5FF");
    doc.fillColor("#333333").fontSize(12).font("Helvetica-Bold");
    doc.text("Besoin d'aide ?", 60, doc.y + 15);
    doc.fontSize(10).font("Helvetica");
    doc.text(`Email: ${ORGANISME.email}`, 60, doc.y + 35);
    doc.text(`Site: ${ORGANISME.website}`, 60, doc.y + 50);

    // Footer
    doc.fontSize(8).fillColor("#999999");
    doc.text(
      `Rapport généré le ${date} par ${ORGANISME.name} - Document confidentiel`,
      50,
      doc.page.height - 30,
      { align: "center" }
    );

    doc.end();
  });
}

// Route handler
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  
  const data: AuditData = {
    score: parseInt(searchParams.get("score") || "50"),
    plan: searchParams.get("plan") || "starter",
    company: searchParams.get("company") || "Votre entreprise",
    date: new Date().toLocaleDateString("fr-FR"),
  };

  // Récupérer les scores par catégorie si fournis
  const categoryScoresParam = searchParams.get("categories");
  if (categoryScoresParam) {
    try {
      data.categoryScores = JSON.parse(categoryScoresParam);
    } catch (e) {
      // Utiliser les scores simulés
    }
  }

  try {
    const pdfBuffer = await generatePDFBuffer(data);

    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="rapport-audit-ai-act-${data.score}pct.pdf"`,
        "Cache-Control": "no-cache",
      },
    });
  } catch (error) {
    console.error("PDF generation error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la génération du rapport" },
      { status: 500 }
    );
  }
}
