import { NextRequest } from "next/server";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

interface AuditData {
  score: number;
  plan: string;
  company?: string;
  categoryScores?: Record<string, number>;
  date?: string;
}

const CATEGORIES = [
  { key: "identification", name: "Identification des systemes IA" },
  { key: "classification", name: "Classification des risques" },
  { key: "gouvernance", name: "Gouvernance IA" },
  { key: "documentation", name: "Documentation technique" },
  { key: "formation", name: "Formation des equipes" },
  { key: "conformite", name: "Conformite generale" },
];

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
    "Rediger une politique IA",
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

function getRiskLevel(score: number) {
  if (score >= 80) return { level: "Faible", r: 0, g: 0.8, b: 0.4 };
  if (score >= 60) return { level: "Modere", r: 1, g: 0.7, b: 0 };
  if (score >= 40) return { level: "Eleve", r: 1, g: 0.4, b: 0 };
  return { level: "Critique", r: 1, g: 0.2, b: 0.2 };
}

async function generatePDF(data: AuditData): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const score = data.score;
  const plan = data.plan;
  const company = data.company || "Votre entreprise";
  const date = data.date || new Date().toLocaleDateString("fr-FR");
  const risk = getRiskLevel(score);

  const categoryScores: Record<string, number> = data.categoryScores || {};
  CATEGORIES.forEach((cat) => {
    if (!categoryScores[cat.key]) {
      const variation = Math.floor(Math.random() * 30) - 15;
      categoryScores[cat.key] = Math.max(15, Math.min(95, score + variation));
    }
  });

  // PAGE 1: COVER
  let page = pdfDoc.addPage([595, 842]);
  const { width, height } = page.getSize();

  page.drawRectangle({ x: 0, y: 0, width, height, color: rgb(0.04, 0.04, 0.1) });

  page.drawText("FORMATION-IA-ACT.FR", {
    x: 50, y: height - 60, size: 14, font: helveticaBold, color: rgb(0, 0.9, 1),
  });

  page.drawText("RAPPORT D'AUDIT", {
    x: 50, y: height - 180, size: 36, font: helveticaBold, color: rgb(1, 1, 1),
  });

  page.drawText("CONFORMITE AI ACT", {
    x: 50, y: height - 230, size: 28, font: helveticaBold, color: rgb(1, 1, 1),
  });

  page.drawText(score + "%", {
    x: 220, y: height - 400, size: 72, font: helveticaBold, color: rgb(risk.r, risk.g, risk.b),
  });

  page.drawText("Risque " + risk.level, {
    x: 200, y: height - 450, size: 24, font: helvetica, color: rgb(1, 1, 1),
  });

  page.drawText("Entreprise: " + company, {
    x: 50, y: 150, size: 12, font: helvetica, color: rgb(0.6, 0.6, 0.6),
  });

  page.drawText("Date: " + date, {
    x: 50, y: 130, size: 12, font: helvetica, color: rgb(0.6, 0.6, 0.6),
  });

  page.drawText("Formule: " + plan.charAt(0).toUpperCase() + plan.slice(1), {
    x: 50, y: 110, size: 12, font: helvetica, color: rgb(0.6, 0.6, 0.6),
  });

  // PAGE 2: EXECUTIVE SUMMARY
  page = pdfDoc.addPage([595, 842]);

  page.drawRectangle({ x: 0, y: height - 80, width, height: 80, color: rgb(0.04, 0.04, 0.1) });

  page.drawText("SOMMAIRE EXECUTIF", {
    x: 50, y: height - 50, size: 20, font: helveticaBold, color: rgb(1, 1, 1),
  });

  let yPos = height - 120;

  page.drawText("Synthese de l'audit", {
    x: 50, y: yPos, size: 14, font: helveticaBold, color: rgb(0, 0, 0),
  });

  yPos -= 25;

  let summaryText = "Des actions sont necessaires pour assurer la conformite AI Act.";
  if (score >= 80) summaryText = "Bon niveau de conformite. Quelques ajustements mineurs.";
  else if (score >= 60) summaryText = "Ameliorations significatives necessaires.";
  else if (score < 40) summaryText = "Plan d'urgence requis immediatement.";

  page.drawText(summaryText, {
    x: 50, y: yPos, size: 11, font: helvetica, color: rgb(0.2, 0.2, 0.2),
  });

  yPos -= 50;

  page.drawRectangle({
    x: 50, y: yPos - 60, width: width - 100, height: 70,
    color: rgb(1, 0.95, 0.95), borderColor: rgb(0.8, 0.2, 0.2), borderWidth: 1,
  });

  page.drawText("RISQUES FINANCIERS - AMENDES AI ACT", {
    x: 60, y: yPos - 15, size: 12, font: helveticaBold, color: rgb(0.8, 0, 0),
  });

  page.drawText("Pratiques interdites: jusqu'a 35M EUR ou 7% du CA", {
    x: 60, y: yPos - 32, size: 10, font: helvetica, color: rgb(0.4, 0, 0),
  });

  page.drawText("Systemes haut risque: jusqu'a 15M EUR ou 3% du CA", {
    x: 60, y: yPos - 46, size: 10, font: helvetica, color: rgb(0.4, 0, 0),
  });

  // PAGE 3: CATEGORY SCORES
  page = pdfDoc.addPage([595, 842]);

  page.drawRectangle({ x: 0, y: height - 80, width, height: 80, color: rgb(0.04, 0.04, 0.1) });

  page.drawText("ANALYSE PAR CATEGORIE", {
    x: 50, y: height - 50, size: 20, font: helveticaBold, color: rgb(1, 1, 1),
  });

  yPos = height - 120;

  CATEGORIES.forEach((cat, index) => {
    const catScore = categoryScores[cat.key] || 50;
    const catRisk = getRiskLevel(catScore);

    page.drawText((index + 1) + ". " + cat.name, {
      x: 50, y: yPos, size: 12, font: helveticaBold, color: rgb(0, 0, 0),
    });

    page.drawText(catScore + "%", {
      x: 480, y: yPos, size: 14, font: helveticaBold, color: rgb(catRisk.r, catRisk.g, catRisk.b),
    });

    yPos -= 15;

    page.drawRectangle({ x: 50, y: yPos - 8, width: 400, height: 10, color: rgb(0.9, 0.9, 0.9) });
    page.drawRectangle({
      x: 50, y: yPos - 8, width: 400 * (catScore / 100), height: 10,
      color: rgb(catRisk.r, catRisk.g, catRisk.b),
    });

    yPos -= 40;
  });

  // PAGE 4: RECOMMENDATIONS
  page = pdfDoc.addPage([595, 842]);

  page.drawRectangle({ x: 0, y: height - 80, width, height: 80, color: rgb(0.04, 0.04, 0.1) });

  page.drawText("RECOMMANDATIONS PRIORITAIRES", {
    x: 50, y: height - 50, size: 20, font: helveticaBold, color: rgb(1, 1, 1),
  });

  yPos = height - 120;
  let recNumber = 1;

  CATEGORIES.forEach((cat) => {
    const catScore = categoryScores[cat.key] || 50;

    if (catScore < 70) {
      page.drawText(cat.name + ":", {
        x: 50, y: yPos, size: 11, font: helveticaBold, color: rgb(0.2, 0.2, 0.2),
      });
      yPos -= 18;

      const recs = RECOMMENDATIONS[cat.key] || [];
      recs.forEach((rec) => {
        if (yPos < 100) {
          page = pdfDoc.addPage([595, 842]);
          yPos = height - 50;
        }

        page.drawText(recNumber + ". " + rec, {
          x: 60, y: yPos, size: 10, font: helvetica, color: rgb(0.3, 0.3, 0.3),
        });
        yPos -= 16;
        recNumber++;
      });

      yPos -= 15;
    }
  });

  // PAGE 5: ACTION PLAN (Pro & Enterprise)
  if (plan === "pro" || plan === "enterprise") {
    page = pdfDoc.addPage([595, 842]);

    page.drawRectangle({ x: 0, y: height - 80, width, height: 80, color: rgb(0.04, 0.04, 0.1) });

    page.drawText("PLAN D'ACTION", {
      x: 50, y: height - 50, size: 20, font: helveticaBold, color: rgb(1, 1, 1),
    });

    yPos = height - 120;

    const phases = [
      { name: "Phase 1: Urgences (0-1 mois)", r: 1, g: 0.2, b: 0.2, items: ["Stopper pratiques interdites", "Designer responsable IA"] },
      { name: "Phase 2: Fondations (1-3 mois)", r: 1, g: 0.4, b: 0, items: ["Inventaire complet", "Classification risques"] },
      { name: "Phase 3: Conformite (3-6 mois)", r: 1, g: 0.7, b: 0, items: ["Documentation technique", "Gouvernance IA"] },
      { name: "Phase 4: Optimisation (6-12 mois)", r: 0, g: 0.8, b: 0.4, items: ["Automatisation", "Audits reguliers"] },
    ];

    phases.forEach((ph) => {
      page.drawRectangle({ x: 50, y: yPos - 40, width: 6, height: 50, color: rgb(ph.r, ph.g, ph.b) });

      page.drawText(ph.name, {
        x: 65, y: yPos, size: 12, font: helveticaBold, color: rgb(0, 0, 0),
      });

      yPos -= 18;

      ph.items.forEach((item) => {
        page.drawText("[ ] " + item, {
          x: 75, y: yPos, size: 10, font: helvetica, color: rgb(0.3, 0.3, 0.3),
        });
        yPos -= 14;
      });

      yPos -= 25;
    });
  }

  // LAST PAGE: NEXT STEPS
  page = pdfDoc.addPage([595, 842]);

  page.drawRectangle({ x: 0, y: height - 80, width, height: 80, color: rgb(0.04, 0.04, 0.1) });

  page.drawText("PROCHAINES ETAPES", {
    x: 50, y: height - 50, size: 20, font: helveticaBold, color: rgb(1, 1, 1),
  });

  yPos = height - 130;

  page.drawText("Formation certifiante AI Act", {
    x: 50, y: yPos, size: 14, font: helveticaBold, color: rgb(0, 0, 0),
  });
  page.drawText("8h de formation, certificat officiel - formation-ia-act.fr/pricing", {
    x: 50, y: yPos - 18, size: 10, font: helvetica, color: rgb(0.4, 0.4, 0.4),
  });

  yPos -= 50;

  page.drawText("Pack Templates Conformite", {
    x: 50, y: yPos, size: 14, font: helveticaBold, color: rgb(0, 0, 0),
  });
  page.drawText("12 documents prets a l'emploi - formation-ia-act.fr/templates", {
    x: 50, y: yPos - 18, size: 10, font: helvetica, color: rgb(0.4, 0.4, 0.4),
  });

  page.drawRectangle({
    x: 50, y: 100, width: 495, height: 80,
    color: rgb(0.95, 0.95, 1), borderColor: rgb(0.8, 0.8, 0.9), borderWidth: 1,
  });

  page.drawText("Besoin d'aide ? contact@formation-ia-act.fr", {
    x: 60, y: 150, size: 12, font: helveticaBold, color: rgb(0.2, 0.2, 0.2),
  });

  page.drawText("https://formation-ia-act.fr", {
    x: 60, y: 130, size: 10, font: helvetica, color: rgb(0, 0.4, 0.8),
  });

  page.drawText("Rapport genere le " + date + " - Document confidentiel", {
    x: 150, y: 40, size: 8, font: helvetica, color: rgb(0.6, 0.6, 0.6),
  });

  return pdfDoc.save();
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const data: AuditData = {
    score: parseInt(searchParams.get("score") || "50"),
    plan: searchParams.get("plan") || "starter",
    company: searchParams.get("company") || undefined,
    date: new Date().toLocaleDateString("fr-FR"),
  };

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

    return new Response(Buffer.from(pdfBytes), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "attachment; filename=rapport-audit-ai-act-" + data.score + "pct.pdf",
        "Cache-Control": "no-cache",
      },
    });
  } catch (error) {
    console.error("PDF generation error:", error);
    return new Response(JSON.stringify({ error: "Erreur generation PDF" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
