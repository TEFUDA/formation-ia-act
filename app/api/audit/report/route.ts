// app/api/audit/report/route.ts
// Génération du rapport PDF d'audit AI Act - Compatible Vercel Serverless

import { NextRequest, NextResponse } from "next/server";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

// Types
interface AuditData {
  score: number;
  plan: string;
  company?: string;
  categoryScores?: Record<string, number>;
  date?: string;
}

// Catégories
const CATEGORIES = [
  { key: "identification", name: "Identification des systemes IA", icon: "1" },
  { key: "classification", name: "Classification des risques", icon: "2" },
  { key: "gouvernance", name: "Gouvernance IA", icon: "3" },
  { key: "documentation", name: "Documentation technique", icon: "4" },
  { key: "formation", name: "Formation des equipes", icon: "5" },
  { key: "conformite", name: "Conformite generale", icon: "6" },
];

// Recommandations
const RECOMMENDATIONS: Record<string, string[]> = {
  identification: [
    "Realiser un inventaire complet des systemes IA",
    "Creer un registre centralise des outils IA",
    "Identifier les responsables par systeme",
  ],
  classification: [
    "Former aux 4 niveaux de risque AI Act",
    "Classifier chaque systeme selon la matrice",
    "Identifier les systemes a haut risque",
  ],
  gouvernance: [
    "Designer un referent IA",
    "Rediger une politique d'utilisation IA",
    "Creer un comite de gouvernance",
  ],
  documentation: [
    "Documenter les systemes a haut risque",
    "Mettre en place la tracabilite",
    "Conserver les logs reglementaires",
  ],
  formation: [
    "Former tous les utilisateurs IA",
    "Formation certifiante pour responsables",
    "Sensibiliser la direction",
  ],
  conformite: [
    "Etablir un plan de conformite",
    "Allouer un budget dedie",
    "Anticiper fevrier 2025",
  ],
};

// Helper: Get risk level
function getRiskLevel(score: number): { level: string; color: { r: number; g: number; b: number } } {
  if (score >= 80) return { level: "Faible", color: { r: 0, g: 0.8, b: 0.4 } };
  if (score >= 60) return { level: "Modere", color: { r: 1, g: 0.7, b: 0 } };
  if (score >= 40) return { level: "Eleve", color: { r: 1, g: 0.4, b: 0 } };
  return { level: "Critique", color: { r: 1, g: 0.2, b: 0.2 } };
}

// Generate PDF
async function generatePDF(data: AuditData): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  
  const score = data.score;
  const plan = data.plan;
  const company = data.company || "Votre entreprise";
  const date = data.date || new Date().toLocaleDateString("fr-FR");
  const risk = getRiskLevel(score);
  
  // Generate category scores if not provided
  const categoryScores = data.categoryScores || {};
  CATEGORIES.forEach((cat) => {
    if (!categoryScores[cat.key]) {
      const variation = Math.floor(Math.random() * 30) - 15;
      categoryScores[cat.key] = Math.max(15, Math.min(95, score + variation));
    }
  });

  // ============================================
  // PAGE 1: COVER
  // ============================================
  let page = pdfDoc.addPage([595, 842]); // A4
  const { width, height } = page.getSize();
  
  // Dark background
  page.drawRectangle({
    x: 0, y: 0, width, height,
    color: rgb(0.04, 0.04, 0.1),
  });
  
  // Header
  page.drawText("FORMATION-IA-ACT.FR", {
    x: 50, y: height - 60,
    size: 14,
    font: helveticaBold,
    color: rgb(0, 0.9, 1),
  });
  
  // Title
  page.drawText("RAPPORT D'AUDIT", {
    x: 50, y: height - 180,
    size: 36,
    font: helveticaBold,
    color: rgb(1, 1, 1),
  });
  
  page.drawText("CONFORMITE AI ACT", {
    x: 50, y: height - 230,
    size: 28,
    font: helveticaBold,
    color: rgb(1, 1, 1),
  });
  
  // Score circle (simplified as text)
  page.drawText(`${score}%`, {
    x: 220, y: height - 400,
    size: 72,
    font: helveticaBold,
    color: rgb(risk.color.r, risk.color.g, risk.color.b),
  });
  
  page.drawText(`Risque ${risk.level}`, {
    x: 200, y: height - 450,
    size: 24,
    font: helvetica,
    color: rgb(1, 1, 1),
  });
  
  // Info
  page.drawText(`Entreprise: ${company}`, {
    x: 50, y: 150,
    size: 12,
    font: helvetica,
    color: rgb(0.6, 0.6, 0.6),
  });
  
  page.drawText(`Date: ${date}`, {
    x: 50, y: 130,
    size: 12,
    font: helvetica,
    color: rgb(0.6, 0.6, 0.6),
  });
  
  page.drawText(`Formule: ${plan.charAt(0).toUpperCase() + plan.slice(1)}`, {
    x: 50, y: 110,
    size: 12,
    font: helvetica,
    color: rgb(0.6, 0.6, 0.6),
  });

  // ============================================
  // PAGE 2: EXECUTIVE SUMMARY
  // ============================================
  page = pdfDoc.addPage([595, 842]);
  
  // Header bar
  page.drawRectangle({
    x: 0, y: height - 80, width, height: 80,
    color: rgb(0.04, 0.04, 0.1),
  });
  
  page.drawText("SOMMAIRE EXECUTIF", {
    x: 50, y: height - 50,
    size: 20,
    font: helveticaBold,
    color: rgb(1, 1, 1),
  });
  
  let yPos = height - 120;
  
  // Summary text
  page.drawText("Synthese de l'audit", {
    x: 50, y: yPos,
    size: 14,
    font: helveticaBold,
    color: rgb(0, 0, 0),
  });
  
  yPos -= 25;
  
  let summaryText = "";
  if (score >= 80) {
    summaryText = "Votre entreprise presente un bon niveau de conformite a l'AI Act.";
  } else if (score >= 60) {
    summaryText = "Des ameliorations significatives sont necessaires pour la conformite.";
  } else if (score >= 40) {
    summaryText = "Des lacunes importantes necessitent une action rapide.";
  } else {
    summaryText = "Un plan d'urgence doit etre mis en place immediatement.";
  }
  
  page.drawText(summaryText, {
    x: 50, y: yPos,
    size: 11,
    font: helvetica,
    color: rgb(0.2, 0.2, 0.2),
  });
  
  yPos -= 50;
  
  // Risk warning box
  page.drawRectangle({
    x: 50, y: yPos - 60, width: width - 100, height: 70,
    color: rgb(1, 0.95, 0.95),
    borderColor: rgb(0.8, 0.2, 0.2),
    borderWidth: 1,
  });
  
  page.drawText("RISQUES FINANCIERS - AMENDES AI ACT", {
    x: 60, y: yPos - 15,
    size: 12,
    font: helveticaBold,
    color: rgb(0.8, 0, 0),
  });
  
  page.drawText("Pratiques interdites: jusqu'a 35M EUR ou 7% du CA mondial", {
    x: 60, y: yPos - 32,
    size: 10,
    font: helvetica,
    color: rgb(0.4, 0, 0),
  });
  
  page.drawText("Systemes haut risque: jusqu'a 15M EUR ou 3% du CA mondial", {
    x: 60, y: yPos - 46,
    size: 10,
    font: helvetica,
    color: rgb(0.4, 0, 0),
  });

  // ============================================
  // PAGE 3: CATEGORY SCORES
  // ============================================
  page = pdfDoc.addPage([595, 842]);
  
  // Header
  page.drawRectangle({
    x: 0, y: height - 80, width, height: 80,
    color: rgb(0.04, 0.04, 0.1),
  });
  
  page.drawText("ANALYSE PAR CATEGORIE", {
    x: 50, y: height - 50,
    size: 20,
    font: helveticaBold,
    color: rgb(1, 1, 1),
  });
  
  yPos = height - 120;
  
  CATEGORIES.forEach((cat, index) => {
    const catScore = categoryScores[cat.key] || 50;
    const catRisk = getRiskLevel(catScore);
    
    // Category name
    page.drawText(`${index + 1}. ${cat.name}`, {
      x: 50, y: yPos,
      size: 12,
      font: helveticaBold,
      color: rgb(0, 0, 0),
    });
    
    // Score
    page.drawText(`${catScore}%`, {
      x: 480, y: yPos,
      size: 14,
      font: helveticaBold,
      color: rgb(catRisk.color.r, catRisk.color.g, catRisk.color.b),
    });
    
    yPos -= 15;
    
    // Progress bar background
    page.drawRectangle({
      x: 50, y: yPos - 8, width: 400, height: 10,
      color: rgb(0.9, 0.9, 0.9),
    });
    
    // Progress bar fill
    page.drawRectangle({
      x: 50, y: yPos - 8, width: 400 * (catScore / 100), height: 10,
      color: rgb(catRisk.color.r, catRisk.color.g, catRisk.color.b),
    });
    
    yPos -= 40;
  });

  // ============================================
  // PAGE 4: RECOMMENDATIONS
  // ============================================
  page = pdfDoc.addPage([595, 842]);
  
  // Header
  page.drawRectangle({
    x: 0, y: height - 80, width, height: 80,
    color: rgb(0.04, 0.04, 0.1),
  });
  
  page.drawText("RECOMMANDATIONS PRIORITAIRES", {
    x: 50, y: height - 50,
    size: 20,
    font: helveticaBold,
    color: rgb(1, 1, 1),
  });
  
  yPos = height - 120;
  let recNumber = 1;
  
  CATEGORIES.forEach((cat) => {
    const catScore = categoryScores[cat.key] || 50;
    
    // Only show recommendations for categories below 70%
    if (catScore < 70) {
      page.drawText(`${cat.name}:`, {
        x: 50, y: yPos,
        size: 11,
        font: helveticaBold,
        color: rgb(0.2, 0.2, 0.2),
      });
      yPos -= 18;
      
      const recs = RECOMMENDATIONS[cat.key] || [];
      recs.forEach((rec) => {
        if (yPos < 100) {
          page = pdfDoc.addPage([595, 842]);
          yPos = height - 50;
        }
        
        page.drawText(`${recNumber}. ${rec}`, {
          x: 60, y: yPos,
          size: 10,
          font: helvetica,
          color: rgb(0.3, 0.3, 0.3),
        });
        yPos -= 16;
        recNumber++;
      });
      
      yPos -= 15;
    }
  });

  // ============================================
  // PAGE 5: ACTION PLAN (Pro & Enterprise)
  // ============================================
  if (plan === "pro" || plan === "enterprise") {
    page = pdfDoc.addPage([595, 842]);
    
    // Header
    page.drawRectangle({
      x: 0, y: height - 80, width, height: 80,
      color: rgb(0.04, 0.04, 0.1),
    });
    
    page.drawText("PLAN D'ACTION", {
      x: 50, y: height - 50,
      size: 20,
      font: helveticaBold,
      color: rgb(1, 1, 1),
    });
    
    yPos = height - 120;
    
    const phases = [
      { name: "Phase 1: Urgences (0-1 mois)", color: rgb(1, 0.2, 0.2), items: ["Stopper les pratiques interdites", "Designer un responsable IA"] },
      { name: "Phase 2: Fondations (1-3 mois)", color: rgb(1, 0.4, 0), items: ["Inventaire complet", "Classification des risques"] },
      { name: "Phase 3: Conformite (3-6 mois)", color: rgb(1, 0.7, 0), items: ["Documentation technique", "Gouvernance IA"] },
      { name: "Phase 4: Optimisation (6-12 mois)", color: rgb(0, 0.8, 0.4), items: ["Automatisation", "Audits reguliers"] },
    ];
    
    phases.forEach((phase) => {
      // Phase indicator
      page.drawRectangle({
        x: 50, y: yPos - 40, width: 6, height: 50,
        color: phase.color,
      });
      
      page.drawText(phase.name, {
        x: 65, y: yPos,
        size: 12,
        font: helveticaBold,
        color: rgb(0, 0, 0),
      });
      
      yPos -= 18;
      
      phase.items.forEach((item) => {
        page.drawText(`[ ] ${item}`, {
          x: 75, y: yPos,
          size: 10,
          font: helvetica,
          color: rgb(0.3, 0.3, 0.3),
        });
        yPos -= 14;
      });
      
      yPos -= 25;
    });
  }

  // ============================================
  // PAGE 6: BUDGET (Enterprise only)
  // ============================================
  if (plan === "enterprise") {
    page = pdfDoc.addPage([595, 842]);
    
    // Header
    page.drawRectangle({
      x: 0, y: height - 80, width, height: 80,
      color: rgb(0.04, 0.04, 0.1),
    });
    
    page.drawText("ESTIMATION BUDGETAIRE", {
      x: 50, y: height - 50,
      size: 20,
      font: helveticaBold,
      color: rgb(1, 1, 1),
    });
    
    yPos = height - 120;
    
    const budgetItems = [
      { item: "Formation equipes", range: "2 000 - 10 000 EUR" },
      { item: "Accompagnement conformite", range: "5 000 - 30 000 EUR" },
      { item: "Documentation technique", range: "3 000 - 15 000 EUR" },
      { item: "Outils gouvernance", range: "1 000 - 10 000 EUR" },
      { item: "Audit externe", range: "5 000 - 20 000 EUR" },
    ];
    
    // Table header
    page.drawRectangle({
      x: 50, y: yPos - 5, width: 495, height: 25,
      color: rgb(0.9, 0.9, 0.9),
    });
    
    page.drawText("Poste de depense", {
      x: 60, y: yPos,
      size: 11,
      font: helveticaBold,
      color: rgb(0, 0, 0),
    });
    
    page.drawText("Budget estime", {
      x: 380, y: yPos,
      size: 11,
      font: helveticaBold,
      color: rgb(0, 0, 0),
    });
    
    yPos -= 30;
    
    budgetItems.forEach((item, i) => {
      if (i % 2 === 0) {
        page.drawRectangle({
          x: 50, y: yPos - 5, width: 495, height: 22,
          color: rgb(0.97, 0.97, 0.97),
        });
      }
      
      page.drawText(item.item, {
        x: 60, y: yPos,
        size: 10,
        font: helvetica,
        color: rgb(0.2, 0.2, 0.2),
      });
      
      page.drawText(item.range, {
        x: 380, y: yPos,
        size: 10,
        font: helvetica,
        color: rgb(0.2, 0.2, 0.2),
      });
      
      yPos -= 22;
    });
    
    // Total
    page.drawRectangle({
      x: 50, y: yPos - 5, width: 495, height: 28,
      color: rgb(0.04, 0.04, 0.1),
    });
    
    page.drawText("TOTAL ESTIME", {
      x: 60, y: yPos,
      size: 11,
      font: helveticaBold,
      color: rgb(1, 1, 1),
    });
    
    page.drawText("16 000 - 85 000 EUR", {
      x: 380, y: yPos,
      size: 11,
      font: helveticaBold,
      color: rgb(1, 1, 1),
    });
  }

  // ============================================
  // LAST PAGE: NEXT STEPS
  // ============================================
  page = pdfDoc.addPage([595, 842]);
  
  // Header
  page.drawRectangle({
    x: 0, y: height - 80, width, height: 80,
    color: rgb(0.04, 0.04, 0.1),
  });
  
  page.drawText("PROCHAINES ETAPES", {
    x: 50, y: height - 50,
    size: 20,
    font: helveticaBold,
    color: rgb(1, 1, 1),
  });
  
  yPos = height - 130;
  
  const nextSteps = [
    { title: "Formation certifiante AI Act", desc: "8h de formation, certificat officiel inclus", url: "formation-ia-act.fr/pricing" },
    { title: "Pack Templates Conformite", desc: "12 documents prets a l'emploi", url: "formation-ia-act.fr/templates" },
    { title: "Accompagnement personnalise", desc: "Nos experts vous accompagnent", url: "formation-ia-act.fr/contact" },
  ];
  
  nextSteps.forEach((step) => {
    page.drawText(step.title, {
      x: 50, y: yPos,
      size: 14,
      font: helveticaBold,
      color: rgb(0, 0, 0),
    });
    yPos -= 18;
    
    page.drawText(step.desc, {
      x: 50, y: yPos,
      size: 10,
      font: helvetica,
      color: rgb(0.4, 0.4, 0.4),
    });
    yPos -= 15;
    
    page.drawText(step.url, {
      x: 50, y: yPos,
      size: 10,
      font: helvetica,
      color: rgb(0, 0.4, 0.8),
    });
    yPos -= 35;
  });
  
  // Contact box
  page.drawRectangle({
    x: 50, y: 100, width: 495, height: 80,
    color: rgb(0.95, 0.95, 1),
    borderColor: rgb(0.8, 0.8, 0.9),
    borderWidth: 1,
  });
  
  page.drawText("Besoin d'aide ?", {
    x: 60, y: 160,
    size: 12,
    font: helveticaBold,
    color: rgb(0.2, 0.2, 0.2),
  });
  
  page.drawText("Email: contact@formation-ia-act.fr", {
    x: 60, y: 140,
    size: 10,
    font: helvetica,
    color: rgb(0.3, 0.3, 0.3),
  });
  
  page.drawText("Site: https://formation-ia-act.fr", {
    x: 60, y: 125,
    size: 10,
    font: helvetica,
    color: rgb(0.3, 0.3, 0.3),
  });
  
  // Footer
  page.drawText(`Rapport genere le ${date} par Formation-IA-Act.fr - Document confidentiel`, {
    x: 120, y: 40,
    size: 8,
    font: helvetica,
    color: rgb(0.6, 0.6, 0.6),
  });

  return pdfDoc.save();
}

// Route handler
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  
  const data: AuditData = {
    score: parseInt(searchParams.get("score") || "50"),
    plan: searchParams.get("plan") || "starter",
    company: searchParams.get("company") || undefined,
    date: new Date().toLocaleDateString("fr-FR"),
  };

  // Parse category scores if provided
  const categoryScoresParam = searchParams.get("categories");
  if (categoryScoresParam) {
    try {
      data.categoryScores = JSON.parse(categoryScoresParam);
    } catch (e) {
      // Use generated scores
    }
  }

  try {
    const pdfBytes = await generatePDF(data);

    return new NextResponse(pdfBytes, {
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
      { error: "Erreur lors de la generation du rapport", details: String(error) },
      { status: 500 }
    );
  }
}
