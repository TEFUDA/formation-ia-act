// lib/audit/pdf-generator.ts
// Générateur de rapport PDF professionnel - 50 à 100 pages

import { PDFDocument, rgb, StandardFonts, PDFPage, PDFFont } from "pdf-lib";
import { AuditResult, CategoryScore, Recommendation, TimelinePhase } from "./scoring";
import { CATEGORIES, SECTORS } from "./questions";

// Configuration
const PAGE_WIDTH = 595;
const PAGE_HEIGHT = 842;
const MARGIN = 50;
const CONTENT_WIDTH = PAGE_WIDTH - 2 * MARGIN;

// Couleurs
const COLORS = {
  primary: rgb(0, 0.4, 0.8),
  secondary: rgb(0.55, 0.36, 0.96),
  success: rgb(0, 0.8, 0.4),
  warning: rgb(1, 0.7, 0),
  danger: rgb(1, 0.2, 0.2),
  dark: rgb(0.04, 0.04, 0.1),
  gray: rgb(0.4, 0.4, 0.4),
  lightGray: rgb(0.9, 0.9, 0.9),
  white: rgb(1, 1, 1),
};

// Interface pour le contexte PDF
interface PDFContext {
  doc: PDFDocument;
  page: PDFPage;
  yPos: number;
  fonts: {
    regular: PDFFont;
    bold: PDFFont;
  };
  pageNumber: number;
}

// Utilitaire: Nouvelle page
async function newPage(ctx: PDFContext): Promise<void> {
  ctx.page = ctx.doc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  ctx.yPos = PAGE_HEIGHT - MARGIN;
  ctx.pageNumber++;

  // Footer sur chaque page
  ctx.page.drawText(`Page ${ctx.pageNumber}`, {
    x: PAGE_WIDTH / 2 - 20,
    y: 25,
    size: 8,
    font: ctx.fonts.regular,
    color: COLORS.gray,
  });

  ctx.page.drawText("Rapport d'Audit AI Act - Confidentiel", {
    x: MARGIN,
    y: 25,
    size: 8,
    font: ctx.fonts.regular,
    color: COLORS.gray,
  });
}

// Utilitaire: Vérifier si besoin nouvelle page
async function checkNewPage(ctx: PDFContext, requiredSpace: number): Promise<void> {
  if (ctx.yPos < MARGIN + requiredSpace) {
    await newPage(ctx);
  }
}

// Utilitaire: Couleur selon le niveau de risque
function getRiskColor(riskLevel: string): ReturnType<typeof rgb> {
  switch (riskLevel) {
    case "low":
      return COLORS.success;
    case "medium":
      return COLORS.warning;
    case "high":
      return rgb(1, 0.4, 0);
    case "critical":
      return COLORS.danger;
    default:
      return COLORS.gray;
  }
}

// Dessiner l'en-tête de section
function drawSectionHeader(
  ctx: PDFContext,
  title: string,
  subtitle?: string
): void {
  // Bande de couleur
  ctx.page.drawRectangle({
    x: 0,
    y: ctx.yPos - 10,
    width: PAGE_WIDTH,
    height: 50,
    color: COLORS.dark,
  });

  ctx.page.drawText(title, {
    x: MARGIN,
    y: ctx.yPos + 5,
    size: 18,
    font: ctx.fonts.bold,
    color: COLORS.white,
  });

  if (subtitle) {
    ctx.page.drawText(subtitle, {
      x: MARGIN,
      y: ctx.yPos - 15,
      size: 10,
      font: ctx.fonts.regular,
      color: rgb(0.7, 0.7, 0.7),
    });
  }

  ctx.yPos -= 70;
}

// Dessiner une barre de progression
function drawProgressBar(
  ctx: PDFContext,
  x: number,
  y: number,
  width: number,
  percentage: number,
  color: ReturnType<typeof rgb>
): void {
  // Fond
  ctx.page.drawRectangle({
    x,
    y,
    width,
    height: 10,
    color: COLORS.lightGray,
  });

  // Remplissage
  ctx.page.drawRectangle({
    x,
    y,
    width: width * (percentage / 100),
    height: 10,
    color,
  });
}

// Dessiner un encadré d'alerte
function drawAlertBox(
  ctx: PDFContext,
  title: string,
  content: string,
  type: "danger" | "warning" | "info" | "success"
): void {
  const bgColor =
    type === "danger"
      ? rgb(1, 0.95, 0.95)
      : type === "warning"
      ? rgb(1, 0.98, 0.9)
      : type === "success"
      ? rgb(0.9, 1, 0.95)
      : rgb(0.9, 0.95, 1);

  const borderColor =
    type === "danger"
      ? COLORS.danger
      : type === "warning"
      ? COLORS.warning
      : type === "success"
      ? COLORS.success
      : COLORS.primary;

  ctx.page.drawRectangle({
    x: MARGIN,
    y: ctx.yPos - 60,
    width: CONTENT_WIDTH,
    height: 70,
    color: bgColor,
    borderColor,
    borderWidth: 2,
  });

  ctx.page.drawText(title, {
    x: MARGIN + 15,
    y: ctx.yPos - 15,
    size: 12,
    font: ctx.fonts.bold,
    color: borderColor,
  });

  ctx.page.drawText(content, {
    x: MARGIN + 15,
    y: ctx.yPos - 35,
    size: 10,
    font: ctx.fonts.regular,
    color: COLORS.gray,
  });

  ctx.yPos -= 80;
}

// ============================================
// PAGE DE COUVERTURE
// ============================================
async function drawCoverPage(
  ctx: PDFContext,
  result: AuditResult,
  companyName: string,
  plan: string
): Promise<void> {
  const page = ctx.page;
  const date = new Date().toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // Fond sombre
  page.drawRectangle({
    x: 0,
    y: 0,
    width: PAGE_WIDTH,
    height: PAGE_HEIGHT,
    color: COLORS.dark,
  });

  // Logo / Nom
  page.drawRectangle({
    x: MARGIN,
    y: PAGE_HEIGHT - 80,
    width: 150,
    height: 40,
    color: COLORS.primary,
  });

  page.drawText("FORMATION-IA-ACT.FR", {
    x: MARGIN + 10,
    y: PAGE_HEIGHT - 60,
    size: 12,
    font: ctx.fonts.bold,
    color: COLORS.white,
  });

  // Titre principal
  page.drawText("RAPPORT D'AUDIT", {
    x: MARGIN,
    y: PAGE_HEIGHT - 180,
    size: 42,
    font: ctx.fonts.bold,
    color: COLORS.white,
  });

  page.drawText("CONFORMITE AI ACT", {
    x: MARGIN,
    y: PAGE_HEIGHT - 230,
    size: 32,
    font: ctx.fonts.bold,
    color: COLORS.white,
  });

  // Ligne décorative
  page.drawRectangle({
    x: MARGIN,
    y: PAGE_HEIGHT - 260,
    width: 100,
    height: 4,
    color: COLORS.primary,
  });

  // Score principal
  const riskColor = getRiskColor(result.riskLevel);
  page.drawText(`${result.globalScore}%`, {
    x: PAGE_WIDTH / 2 - 60,
    y: PAGE_HEIGHT - 400,
    size: 80,
    font: ctx.fonts.bold,
    color: riskColor,
  });

  page.drawText("Score de conformite", {
    x: PAGE_WIDTH / 2 - 70,
    y: PAGE_HEIGHT - 430,
    size: 14,
    font: ctx.fonts.regular,
    color: COLORS.white,
  });

  // Niveau de risque
  const riskLabels: Record<string, string> = {
    low: "RISQUE FAIBLE",
    medium: "RISQUE MODERE",
    high: "RISQUE ELEVE",
    critical: "RISQUE CRITIQUE",
  };

  page.drawRectangle({
    x: PAGE_WIDTH / 2 - 80,
    y: PAGE_HEIGHT - 480,
    width: 160,
    height: 35,
    color: riskColor,
  });

  page.drawText(riskLabels[result.riskLevel] || "RISQUE", {
    x: PAGE_WIDTH / 2 - 55,
    y: PAGE_HEIGHT - 468,
    size: 14,
    font: ctx.fonts.bold,
    color: COLORS.white,
  });

  // Informations entreprise
  page.drawText(`Entreprise: ${companyName}`, {
    x: MARGIN,
    y: 180,
    size: 12,
    font: ctx.fonts.regular,
    color: rgb(0.6, 0.6, 0.6),
  });

  page.drawText(`Date de l'audit: ${date}`, {
    x: MARGIN,
    y: 160,
    size: 12,
    font: ctx.fonts.regular,
    color: rgb(0.6, 0.6, 0.6),
  });

  page.drawText(`Formule: ${plan.charAt(0).toUpperCase() + plan.slice(1)}`, {
    x: MARGIN,
    y: 140,
    size: 12,
    font: ctx.fonts.regular,
    color: rgb(0.6, 0.6, 0.6),
  });

  page.drawText(`${result.totalRecommendations} recommandations`, {
    x: MARGIN,
    y: 120,
    size: 12,
    font: ctx.fonts.regular,
    color: rgb(0.6, 0.6, 0.6),
  });

  // Footer
  page.drawText("Document confidentiel - Usage interne uniquement", {
    x: PAGE_WIDTH / 2 - 120,
    y: 50,
    size: 10,
    font: ctx.fonts.regular,
    color: rgb(0.5, 0.5, 0.5),
  });
}

// ============================================
// SOMMAIRE
// ============================================
async function drawTableOfContents(ctx: PDFContext): Promise<void> {
  await newPage(ctx);
  drawSectionHeader(ctx, "SOMMAIRE", "Table des matieres");

  const sections = [
    { title: "Sommaire executif", page: 3 },
    { title: "Synthese des resultats", page: 4 },
    { title: "Analyse par domaine", page: 6 },
    { title: "Identification des systemes IA", page: 7 },
    { title: "Classification des risques", page: 9 },
    { title: "Gouvernance IA", page: 11 },
    { title: "Documentation technique", page: 13 },
    { title: "Formation des equipes", page: 15 },
    { title: "Transparence et information", page: 17 },
    { title: "Supervision humaine", page: 19 },
    { title: "Securite et robustesse", page: 21 },
    { title: "Recommandations prioritaires", page: 23 },
    { title: "Plan d'action", page: 28 },
    { title: "Estimation budgetaire", page: 32 },
    { title: "Benchmark sectoriel", page: 35 },
    { title: "Annexes", page: 38 },
  ];

  let yPos = ctx.yPos;

  for (const section of sections) {
    // Titre
    ctx.page.drawText(section.title, {
      x: MARGIN,
      y: yPos,
      size: 11,
      font: ctx.fonts.regular,
      color: COLORS.dark,
    });

    // Points de suite
    const dotsWidth = CONTENT_WIDTH - 200;
    let dotsX = MARGIN + 200;
    ctx.page.drawText(".", {
      x: dotsX,
      y: yPos,
      size: 11,
      font: ctx.fonts.regular,
      color: COLORS.gray,
    });

    // Numéro de page
    ctx.page.drawText(section.page.toString(), {
      x: MARGIN + CONTENT_WIDTH - 20,
      y: yPos,
      size: 11,
      font: ctx.fonts.regular,
      color: COLORS.dark,
    });

    yPos -= 25;
  }

  ctx.yPos = yPos;
}

// ============================================
// SOMMAIRE EXECUTIF
// ============================================
async function drawExecutiveSummary(
  ctx: PDFContext,
  result: AuditResult,
  companyName: string
): Promise<void> {
  await newPage(ctx);
  drawSectionHeader(ctx, "SOMMAIRE EXECUTIF", "Vue d'ensemble de l'audit");

  // Synthèse
  ctx.page.drawText("SYNTHESE", {
    x: MARGIN,
    y: ctx.yPos,
    size: 14,
    font: ctx.fonts.bold,
    color: COLORS.dark,
  });
  ctx.yPos -= 25;

  let summaryText = "";
  if (result.globalScore >= 80) {
    summaryText = `${companyName} presente un bon niveau de conformite a l'AI Act avec un score de ${result.globalScore}%. Les fondamentaux sont en place et quelques ajustements mineurs permettront d'atteindre une conformite optimale avant les echeances reglementaires.`;
  } else if (result.globalScore >= 60) {
    summaryText = `${companyName} a entame sa demarche de conformite a l'AI Act mais obtient un score de ${result.globalScore}% qui revele des axes d'amelioration significatifs. Un plan d'action structure sur 6 mois est recommande pour atteindre un niveau satisfaisant.`;
  } else if (result.globalScore >= 40) {
    summaryText = `${companyName} presente des lacunes importantes en matiere de conformite AI Act avec un score de ${result.globalScore}%. Une action rapide et coordonnee est necessaire pour eviter les risques juridiques et financiers lies a la non-conformite.`;
  } else {
    summaryText = `${companyName} n'est pas preparee aux exigences de l'AI Act avec un score critique de ${result.globalScore}%. Un plan d'urgence doit etre mis en place immediatement pour identifier et traiter les risques critiques avant l'entree en vigueur du reglement.`;
  }

  // Découper le texte en lignes
  const words = summaryText.split(" ");
  let line = "";
  let lineY = ctx.yPos;

  for (const word of words) {
    const testLine = line + word + " ";
    if (testLine.length > 85) {
      ctx.page.drawText(line.trim(), {
        x: MARGIN,
        y: lineY,
        size: 11,
        font: ctx.fonts.regular,
        color: COLORS.gray,
      });
      line = word + " ";
      lineY -= 18;
    } else {
      line = testLine;
    }
  }
  if (line.trim()) {
    ctx.page.drawText(line.trim(), {
      x: MARGIN,
      y: lineY,
      size: 11,
      font: ctx.fonts.regular,
      color: COLORS.gray,
    });
  }

  ctx.yPos = lineY - 40;

  // Chiffres clés
  ctx.page.drawText("CHIFFRES CLES", {
    x: MARGIN,
    y: ctx.yPos,
    size: 14,
    font: ctx.fonts.bold,
    color: COLORS.dark,
  });
  ctx.yPos -= 30;

  const keyFigures = [
    { label: "Score global de conformite", value: `${result.globalScore}%` },
    { label: "Recommandations identifiees", value: result.totalRecommendations.toString() },
    { label: "Points critiques a traiter", value: result.criticalIssuesCount.toString() },
    {
      label: "Domaines analyses",
      value: result.categoryScores.length.toString(),
    },
  ];

  for (const figure of keyFigures) {
    ctx.page.drawRectangle({
      x: MARGIN,
      y: ctx.yPos - 5,
      width: CONTENT_WIDTH / 2 - 10,
      height: 30,
      color: COLORS.lightGray,
    });

    ctx.page.drawText(figure.label, {
      x: MARGIN + 10,
      y: ctx.yPos + 5,
      size: 10,
      font: ctx.fonts.regular,
      color: COLORS.gray,
    });

    ctx.page.drawText(figure.value, {
      x: MARGIN + CONTENT_WIDTH / 2 - 60,
      y: ctx.yPos + 5,
      size: 14,
      font: ctx.fonts.bold,
      color: COLORS.primary,
    });

    ctx.yPos -= 40;
  }

  // Alerte risques
  ctx.yPos -= 20;
  drawAlertBox(
    ctx,
    "RISQUES FINANCIERS EN CAS DE NON-CONFORMITE",
    "Pratiques interdites: 35M EUR / 7% CA | Haut risque: 15M EUR / 3% CA | Autres: 7.5M EUR / 1.5% CA",
    "danger"
  );
}

// ============================================
// SYNTHESE DES RESULTATS
// ============================================
async function drawResultsSummary(
  ctx: PDFContext,
  result: AuditResult
): Promise<void> {
  await newPage(ctx);
  drawSectionHeader(ctx, "SYNTHESE DES RESULTATS", "Scores par domaine");

  // Graphique des scores par catégorie
  for (const cat of result.categoryScores) {
    await checkNewPage(ctx, 60);

    const riskColor = getRiskColor(cat.riskLevel);

    // Nom de la catégorie
    ctx.page.drawText(`${cat.icon} ${cat.categoryName}`, {
      x: MARGIN,
      y: ctx.yPos,
      size: 12,
      font: ctx.fonts.bold,
      color: COLORS.dark,
    });

    // Score
    ctx.page.drawText(`${cat.percentage}%`, {
      x: MARGIN + CONTENT_WIDTH - 50,
      y: ctx.yPos,
      size: 14,
      font: ctx.fonts.bold,
      color: riskColor,
    });

    ctx.yPos -= 20;

    // Barre de progression
    drawProgressBar(ctx, MARGIN, ctx.yPos, CONTENT_WIDTH - 80, cat.percentage, riskColor);

    ctx.yPos -= 30;
  }

  // Points forts et points faibles
  ctx.yPos -= 20;
  await checkNewPage(ctx, 200);

  // Points forts
  ctx.page.drawText("POINTS FORTS", {
    x: MARGIN,
    y: ctx.yPos,
    size: 12,
    font: ctx.fonts.bold,
    color: COLORS.success,
  });
  ctx.yPos -= 20;

  const strengths = result.categoryScores
    .filter((c) => c.percentage >= 60)
    .sort((a, b) => b.percentage - a.percentage)
    .slice(0, 3);

  for (const s of strengths) {
    ctx.page.drawText(`+ ${s.categoryName}: ${s.percentage}%`, {
      x: MARGIN + 15,
      y: ctx.yPos,
      size: 10,
      font: ctx.fonts.regular,
      color: COLORS.gray,
    });
    ctx.yPos -= 18;
  }

  // Points à améliorer
  ctx.yPos -= 15;
  ctx.page.drawText("POINTS A AMELIORER", {
    x: MARGIN,
    y: ctx.yPos,
    size: 12,
    font: ctx.fonts.bold,
    color: COLORS.danger,
  });
  ctx.yPos -= 20;

  const weaknesses = result.categoryScores
    .filter((c) => c.percentage < 60)
    .sort((a, b) => a.percentage - b.percentage)
    .slice(0, 3);

  for (const w of weaknesses) {
    ctx.page.drawText(`- ${w.categoryName}: ${w.percentage}%`, {
      x: MARGIN + 15,
      y: ctx.yPos,
      size: 10,
      font: ctx.fonts.regular,
      color: COLORS.gray,
    });
    ctx.yPos -= 18;
  }
}

// ============================================
// ANALYSE PAR DOMAINE
// ============================================
async function drawCategoryAnalysis(
  ctx: PDFContext,
  category: CategoryScore
): Promise<void> {
  await newPage(ctx);
  drawSectionHeader(ctx, `${category.icon} ${category.categoryName.toUpperCase()}`, `Score: ${category.percentage}%`);

  const riskColor = getRiskColor(category.riskLevel);

  // Score visuel
  ctx.page.drawText("Score du domaine", {
    x: MARGIN,
    y: ctx.yPos,
    size: 12,
    font: ctx.fonts.bold,
    color: COLORS.dark,
  });
  ctx.yPos -= 25;

  drawProgressBar(ctx, MARGIN, ctx.yPos, CONTENT_WIDTH, category.percentage, riskColor);
  ctx.yPos -= 30;

  // Niveau de risque
  const riskLabels: Record<string, string> = {
    low: "Risque faible - Bon niveau de conformite",
    medium: "Risque modere - Ameliorations necessaires",
    high: "Risque eleve - Actions prioritaires requises",
    critical: "Risque critique - Intervention urgente",
  };

  ctx.page.drawRectangle({
    x: MARGIN,
    y: ctx.yPos - 5,
    width: CONTENT_WIDTH,
    height: 30,
    color: riskColor,
  });

  ctx.page.drawText(riskLabels[category.riskLevel] || "", {
    x: MARGIN + 15,
    y: ctx.yPos + 5,
    size: 11,
    font: ctx.fonts.bold,
    color: COLORS.white,
  });
  ctx.yPos -= 50;

  // Statistiques
  ctx.page.drawText("STATISTIQUES", {
    x: MARGIN,
    y: ctx.yPos,
    size: 12,
    font: ctx.fonts.bold,
    color: COLORS.dark,
  });
  ctx.yPos -= 25;

  const stats = [
    { label: "Questions evaluees", value: category.questionsAnswered.toString() },
    { label: "Recommandations", value: category.recommendations.length.toString() },
    { label: "Points critiques", value: category.criticalIssues.length.toString() },
  ];

  for (const stat of stats) {
    ctx.page.drawText(`${stat.label}: ${stat.value}`, {
      x: MARGIN + 15,
      y: ctx.yPos,
      size: 10,
      font: ctx.fonts.regular,
      color: COLORS.gray,
    });
    ctx.yPos -= 18;
  }

  // Recommandations du domaine
  if (category.recommendations.length > 0) {
    ctx.yPos -= 20;
    ctx.page.drawText("RECOMMANDATIONS POUR CE DOMAINE", {
      x: MARGIN,
      y: ctx.yPos,
      size: 12,
      font: ctx.fonts.bold,
      color: COLORS.dark,
    });
    ctx.yPos -= 25;

    for (const rec of category.recommendations.slice(0, 5)) {
      await checkNewPage(ctx, 80);

      const priorityColor =
        rec.priority === "critical"
          ? COLORS.danger
          : rec.priority === "high"
          ? rgb(1, 0.4, 0)
          : rec.priority === "medium"
          ? COLORS.warning
          : COLORS.success;

      // Badge priorité
      ctx.page.drawRectangle({
        x: MARGIN,
        y: ctx.yPos - 3,
        width: 60,
        height: 18,
        color: priorityColor,
      });

      ctx.page.drawText(rec.priority.toUpperCase(), {
        x: MARGIN + 5,
        y: ctx.yPos,
        size: 8,
        font: ctx.fonts.bold,
        color: COLORS.white,
      });

      // Titre
      ctx.page.drawText(rec.title, {
        x: MARGIN + 70,
        y: ctx.yPos,
        size: 10,
        font: ctx.fonts.bold,
        color: COLORS.dark,
      });
      ctx.yPos -= 18;

      // Description
      ctx.page.drawText(rec.description.substring(0, 90) + "...", {
        x: MARGIN + 15,
        y: ctx.yPos,
        size: 9,
        font: ctx.fonts.regular,
        color: COLORS.gray,
      });
      ctx.yPos -= 15;

      // Effort et coût
      ctx.page.drawText(`Effort: ${rec.estimatedEffort} | Cout: ${rec.estimatedCost}`, {
        x: MARGIN + 15,
        y: ctx.yPos,
        size: 8,
        font: ctx.fonts.regular,
        color: COLORS.gray,
      });
      ctx.yPos -= 25;
    }
  }
}

// Export de la fonction principale
export async function generateAuditPDF(
  result: AuditResult,
  companyName: string,
  plan: "starter" | "pro" | "enterprise"
): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  const regularFont = await doc.embedFont(StandardFonts.Helvetica);
  const boldFont = await doc.embedFont(StandardFonts.HelveticaBold);

  const ctx: PDFContext = {
    doc,
    page: doc.addPage([PAGE_WIDTH, PAGE_HEIGHT]),
    yPos: PAGE_HEIGHT - MARGIN,
    fonts: { regular: regularFont, bold: boldFont },
    pageNumber: 0,
  };

  // 1. Couverture
  await drawCoverPage(ctx, result, companyName, plan);

  // 2. Sommaire
  await drawTableOfContents(ctx);

  // 3. Sommaire exécutif
  await drawExecutiveSummary(ctx, result, companyName);

  // 4. Synthèse des résultats
  await drawResultsSummary(ctx, result);

  // 5. Analyse par domaine (1 page par domaine)
  for (const category of result.categoryScores) {
    await drawCategoryAnalysis(ctx, category);
  }

  // 6. Recommandations (Pro & Enterprise)
  if (plan === "pro" || plan === "enterprise") {
    await drawAllRecommendations(ctx, result);
  }

  // 7. Plan d'action (Pro & Enterprise)
  if (plan === "pro" || plan === "enterprise") {
    await drawActionPlan(ctx, result);
  }

  // 8. Budget (Enterprise)
  if (plan === "enterprise") {
    await drawBudgetEstimate(ctx, result);
  }

  // 9. Annexes
  await drawAnnexes(ctx, result, plan);

  return doc.save();
}

// Fonctions supplémentaires pour les sections Pro/Enterprise

async function drawAllRecommendations(ctx: PDFContext, result: AuditResult): Promise<void> {
  await newPage(ctx);
  drawSectionHeader(ctx, "RECOMMANDATIONS PRIORITAIRES", `${result.totalRecommendations} actions identifiees`);

  const allRecs = result.categoryScores.flatMap((c) => c.recommendations);
  const sortedRecs = allRecs.sort((a, b) => {
    const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  let recNumber = 1;
  for (const rec of sortedRecs) {
    await checkNewPage(ctx, 100);

    const priorityColor =
      rec.priority === "critical"
        ? COLORS.danger
        : rec.priority === "high"
        ? rgb(1, 0.4, 0)
        : rec.priority === "medium"
        ? COLORS.warning
        : COLORS.success;

    // Numéro et badge
    ctx.page.drawText(`#${recNumber}`, {
      x: MARGIN,
      y: ctx.yPos,
      size: 12,
      font: ctx.fonts.bold,
      color: COLORS.dark,
    });

    ctx.page.drawRectangle({
      x: MARGIN + 35,
      y: ctx.yPos - 3,
      width: 60,
      height: 18,
      color: priorityColor,
    });

    ctx.page.drawText(rec.priority.toUpperCase(), {
      x: MARGIN + 40,
      y: ctx.yPos,
      size: 8,
      font: ctx.fonts.bold,
      color: COLORS.white,
    });

    // Catégorie
    ctx.page.drawText(rec.category, {
      x: MARGIN + 105,
      y: ctx.yPos,
      size: 9,
      font: ctx.fonts.regular,
      color: COLORS.gray,
    });
    ctx.yPos -= 22;

    // Titre
    ctx.page.drawText(rec.title, {
      x: MARGIN,
      y: ctx.yPos,
      size: 11,
      font: ctx.fonts.bold,
      color: COLORS.dark,
    });
    ctx.yPos -= 18;

    // Description
    const descLines = rec.description.match(/.{1,90}/g) || [rec.description];
    for (const line of descLines.slice(0, 2)) {
      ctx.page.drawText(line, {
        x: MARGIN,
        y: ctx.yPos,
        size: 9,
        font: ctx.fonts.regular,
        color: COLORS.gray,
      });
      ctx.yPos -= 14;
    }

    // Détails
    ctx.page.drawText(
      `Effort: ${rec.estimatedEffort} | Cout estime: ${rec.estimatedCost}${rec.deadline ? ` | Delai: ${rec.deadline}` : ""}`,
      {
        x: MARGIN,
        y: ctx.yPos,
        size: 8,
        font: ctx.fonts.regular,
        color: COLORS.primary,
      }
    );

    if (rec.aiActArticle) {
      ctx.page.drawText(`Ref: ${rec.aiActArticle}`, {
        x: MARGIN + 350,
        y: ctx.yPos,
        size: 8,
        font: ctx.fonts.regular,
        color: COLORS.secondary,
      });
    }

    ctx.yPos -= 30;
    recNumber++;
  }
}

async function drawActionPlan(ctx: PDFContext, result: AuditResult): Promise<void> {
  await newPage(ctx);
  drawSectionHeader(ctx, "PLAN D'ACTION", "Roadmap de mise en conformite");

  for (const phase of result.timeline) {
    await checkNewPage(ctx, 150);

    const phaseColor = rgb(
      phase.color === "#FF4444" ? 1 : phase.color === "#FF6B00" ? 1 : phase.color === "#FFB800" ? 1 : 0,
      phase.color === "#FF4444" ? 0.2 : phase.color === "#FF6B00" ? 0.4 : phase.color === "#FFB800" ? 0.7 : 0.8,
      phase.color === "#FF4444" ? 0.2 : phase.color === "#FF6B00" ? 0 : phase.color === "#FFB800" ? 0 : 0.4
    );

    // Indicateur de phase
    ctx.page.drawRectangle({
      x: MARGIN,
      y: ctx.yPos - 80,
      width: 8,
      height: 100,
      color: phaseColor,
    });

    // Titre de phase
    ctx.page.drawText(`PHASE ${phase.phase}: ${phase.name.toUpperCase()}`, {
      x: MARGIN + 20,
      y: ctx.yPos,
      size: 14,
      font: ctx.fonts.bold,
      color: COLORS.dark,
    });

    ctx.page.drawText(phase.duration, {
      x: MARGIN + 20,
      y: ctx.yPos - 18,
      size: 10,
      font: ctx.fonts.regular,
      color: COLORS.gray,
    });
    ctx.yPos -= 45;

    // Actions
    for (const action of phase.actions) {
      ctx.page.drawText(`[ ] ${action}`, {
        x: MARGIN + 30,
        y: ctx.yPos,
        size: 10,
        font: ctx.fonts.regular,
        color: COLORS.gray,
      });
      ctx.yPos -= 18;
    }

    ctx.yPos -= 30;
  }
}

async function drawBudgetEstimate(ctx: PDFContext, result: AuditResult): Promise<void> {
  await newPage(ctx);
  drawSectionHeader(ctx, "ESTIMATION BUDGETAIRE", "Investissement pour la conformite");

  const budget = result.estimatedBudget;

  // Tableau
  const items = [
    { label: "Formation des equipes", range: budget.formation },
    { label: "Accompagnement / Consulting", range: budget.consulting },
    { label: "Outils et technologies", range: budget.tools },
    { label: "Documentation technique", range: budget.documentation },
    { label: "Audit externe", range: budget.audit },
  ];

  // En-tête tableau
  ctx.page.drawRectangle({
    x: MARGIN,
    y: ctx.yPos - 5,
    width: CONTENT_WIDTH,
    height: 30,
    color: COLORS.dark,
  });

  ctx.page.drawText("Poste de depense", {
    x: MARGIN + 15,
    y: ctx.yPos + 5,
    size: 11,
    font: ctx.fonts.bold,
    color: COLORS.white,
  });

  ctx.page.drawText("Budget estime (EUR)", {
    x: MARGIN + 320,
    y: ctx.yPos + 5,
    size: 11,
    font: ctx.fonts.bold,
    color: COLORS.white,
  });
  ctx.yPos -= 35;

  // Lignes
  let isEven = true;
  for (const item of items) {
    if (isEven) {
      ctx.page.drawRectangle({
        x: MARGIN,
        y: ctx.yPos - 5,
        width: CONTENT_WIDTH,
        height: 28,
        color: COLORS.lightGray,
      });
    }

    ctx.page.drawText(item.label, {
      x: MARGIN + 15,
      y: ctx.yPos + 3,
      size: 10,
      font: ctx.fonts.regular,
      color: COLORS.dark,
    });

    ctx.page.drawText(
      `${item.range.min.toLocaleString()} - ${item.range.max.toLocaleString()} EUR`,
      {
        x: MARGIN + 320,
        y: ctx.yPos + 3,
        size: 10,
        font: ctx.fonts.regular,
        color: COLORS.dark,
      }
    );

    ctx.yPos -= 28;
    isEven = !isEven;
  }

  // Total
  ctx.page.drawRectangle({
    x: MARGIN,
    y: ctx.yPos - 5,
    width: CONTENT_WIDTH,
    height: 35,
    color: COLORS.primary,
  });

  ctx.page.drawText("TOTAL ESTIME", {
    x: MARGIN + 15,
    y: ctx.yPos + 8,
    size: 12,
    font: ctx.fonts.bold,
    color: COLORS.white,
  });

  ctx.page.drawText(
    `${budget.total.min.toLocaleString()} - ${budget.total.max.toLocaleString()} EUR`,
    {
      x: MARGIN + 300,
      y: ctx.yPos + 8,
      size: 12,
      font: ctx.fonts.bold,
      color: COLORS.white,
    }
  );

  ctx.yPos -= 60;

  // Note
  ctx.page.drawText(
    "* Ces estimations sont indicatives et varient selon la complexite de votre environnement.",
    {
      x: MARGIN,
      y: ctx.yPos,
      size: 8,
      font: ctx.fonts.regular,
      color: COLORS.gray,
    }
  );
}

async function drawAnnexes(
  ctx: PDFContext,
  result: AuditResult,
  plan: string
): Promise<void> {
  await newPage(ctx);
  drawSectionHeader(ctx, "ANNEXES", "Informations complementaires");

  // Glossaire AI Act
  ctx.page.drawText("GLOSSAIRE AI ACT", {
    x: MARGIN,
    y: ctx.yPos,
    size: 12,
    font: ctx.fonts.bold,
    color: COLORS.dark,
  });
  ctx.yPos -= 25;

  const glossary = [
    { term: "Systeme d'IA", def: "Systeme base sur une machine concu pour fonctionner avec divers niveaux d'autonomie" },
    { term: "Haut risque", def: "Systeme IA ayant un impact significatif sur la sante, securite ou droits fondamentaux" },
    { term: "Deploieur", def: "Personne utilisant un systeme IA sous sa propre autorite" },
    { term: "Fournisseur", def: "Personne developpant ou mettant sur le marche un systeme IA" },
    { term: "GPAI", def: "General Purpose AI - Modele d'IA a usage general" },
    { term: "Marquage CE", def: "Certification indiquant la conformite aux exigences europeennes" },
  ];

  for (const item of glossary) {
    ctx.page.drawText(`${item.term}:`, {
      x: MARGIN + 15,
      y: ctx.yPos,
      size: 9,
      font: ctx.fonts.bold,
      color: COLORS.dark,
    });
    ctx.page.drawText(item.def, {
      x: MARGIN + 120,
      y: ctx.yPos,
      size: 9,
      font: ctx.fonts.regular,
      color: COLORS.gray,
    });
    ctx.yPos -= 18;
  }

  // Échéances AI Act
  ctx.yPos -= 30;
  await checkNewPage(ctx, 150);

  ctx.page.drawText("ECHEANCES CLE DE L'AI ACT", {
    x: MARGIN,
    y: ctx.yPos,
    size: 12,
    font: ctx.fonts.bold,
    color: COLORS.dark,
  });
  ctx.yPos -= 25;

  const deadlines = [
    { date: "Fevrier 2025", desc: "Interdiction des pratiques prohibees + Obligation de formation (Art. 4)" },
    { date: "Aout 2025", desc: "Regles pour les modeles GPAI" },
    { date: "Aout 2026", desc: "Toutes les regles pour les systemes a haut risque" },
    { date: "Aout 2027", desc: "Systemes IA integres dans des produits reglementes" },
  ];

  for (const dl of deadlines) {
    ctx.page.drawRectangle({
      x: MARGIN,
      y: ctx.yPos - 3,
      width: 100,
      height: 20,
      color: COLORS.warning,
    });

    ctx.page.drawText(dl.date, {
      x: MARGIN + 10,
      y: ctx.yPos,
      size: 9,
      font: ctx.fonts.bold,
      color: COLORS.dark,
    });

    ctx.page.drawText(dl.desc, {
      x: MARGIN + 115,
      y: ctx.yPos,
      size: 9,
      font: ctx.fonts.regular,
      color: COLORS.gray,
    });

    ctx.yPos -= 28;
  }

  // Contact
  ctx.yPos -= 40;
  await checkNewPage(ctx, 100);

  ctx.page.drawRectangle({
    x: MARGIN,
    y: ctx.yPos - 60,
    width: CONTENT_WIDTH,
    height: 80,
    color: rgb(0.95, 0.95, 1),
    borderColor: COLORS.primary,
    borderWidth: 1,
  });

  ctx.page.drawText("BESOIN D'ACCOMPAGNEMENT ?", {
    x: MARGIN + 15,
    y: ctx.yPos - 10,
    size: 12,
    font: ctx.fonts.bold,
    color: COLORS.primary,
  });

  ctx.page.drawText("Email: contact@formation-ia-act.fr", {
    x: MARGIN + 15,
    y: ctx.yPos - 30,
    size: 10,
    font: ctx.fonts.regular,
    color: COLORS.dark,
  });

  ctx.page.drawText("Site: https://formation-ia-act.fr", {
    x: MARGIN + 15,
    y: ctx.yPos - 45,
    size: 10,
    font: ctx.fonts.regular,
    color: COLORS.dark,
  });
}
