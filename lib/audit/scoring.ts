// lib/audit/scoring.ts
// Moteur de calcul des scores et analyse

import { QUESTIONS, CATEGORIES, Question } from "./questions";

export interface CategoryScore {
  categoryId: string;
  categoryName: string;
  icon: string;
  color: string;
  score: number;
  maxScore: number;
  percentage: number;
  riskLevel: "low" | "medium" | "high" | "critical";
  questionsAnswered: number;
  totalQuestions: number;
  criticalIssues: string[];
  recommendations: Recommendation[];
}

export interface Recommendation {
  id: string;
  priority: "critical" | "high" | "medium" | "low";
  category: string;
  title: string;
  description: string;
  aiActArticle?: string;
  estimatedEffort: "low" | "medium" | "high";
  estimatedCost: string;
  deadline?: string;
}

export interface AuditResult {
  globalScore: number;
  riskLevel: "low" | "medium" | "high" | "critical";
  categoryScores: CategoryScore[];
  totalRecommendations: number;
  criticalIssuesCount: number;
  highRiskSystemsDetected: boolean;
  prohibitedPracticesDetected: boolean;
  complianceGaps: ComplianceGap[];
  estimatedBudget: BudgetEstimate;
  timeline: TimelinePhase[];
  collectedData: Record<string, any>;
}

export interface ComplianceGap {
  area: string;
  description: string;
  aiActArticle: string;
  severity: "critical" | "high" | "medium" | "low";
  currentState: string;
  requiredState: string;
}

export interface BudgetEstimate {
  formation: { min: number; max: number };
  consulting: { min: number; max: number };
  tools: { min: number; max: number };
  documentation: { min: number; max: number };
  audit: { min: number; max: number };
  total: { min: number; max: number };
}

export interface TimelinePhase {
  phase: number;
  name: string;
  duration: string;
  color: string;
  actions: string[];
  priority: "urgent" | "high" | "medium" | "low";
}

// Calcul du score pour une question
function calculateQuestionScore(
  question: Question,
  answer: string | string[]
): { score: number; maxScore: number; riskLevel?: string } {
  if (!question.options) {
    return { score: 0, maxScore: 0 };
  }

  const maxScore = Math.max(...question.options.map((o) => o.score)) * question.weight;
  let score = 0;
  let riskLevel: string | undefined;

  if (Array.isArray(answer)) {
    // Multiple choice
    for (const opt of question.options) {
      if (answer.includes(opt.value)) {
        score += opt.score * question.weight;
        if (opt.riskLevel) riskLevel = opt.riskLevel;
      }
    }
  } else {
    // Single choice
    const selectedOption = question.options.find((o) => o.value === answer);
    if (selectedOption) {
      score = selectedOption.score * question.weight;
      riskLevel = selectedOption.riskLevel;
    }
  }

  return { score, maxScore, riskLevel };
}

// Déterminer le niveau de risque
function getRiskLevel(percentage: number): "low" | "medium" | "high" | "critical" {
  if (percentage >= 80) return "low";
  if (percentage >= 60) return "medium";
  if (percentage >= 40) return "high";
  return "critical";
}

// Générer les recommandations pour une catégorie
function generateCategoryRecommendations(
  categoryId: string,
  score: number,
  answers: Record<string, string | string[]>
): Recommendation[] {
  const recommendations: Recommendation[] = [];
  const category = CATEGORIES.find((c) => c.id === categoryId);
  if (!category) return recommendations;

  // Recommandations basées sur le score
  if (categoryId === "ai_inventory" && score < 70) {
    recommendations.push({
      id: `rec_${categoryId}_1`,
      priority: score < 40 ? "critical" : "high",
      category: category.name,
      title: "Réaliser un inventaire complet des systèmes IA",
      description:
        "Identifier tous les outils et systèmes utilisant l'IA dans votre organisation, y compris les outils SaaS, les APIs et les développements internes.",
      aiActArticle: "Article 6",
      estimatedEffort: "medium",
      estimatedCost: "2 000 - 10 000 €",
      deadline: "1 mois",
    });
  }

  if (categoryId === "risk_classification" && score < 70) {
    recommendations.push({
      id: `rec_${categoryId}_1`,
      priority: "critical",
      category: category.name,
      title: "Classifier tous les systèmes selon les 4 niveaux de risque",
      description:
        "Appliquer la grille de classification AI Act (inacceptable, haut risque, risque limité, minimal) à chaque système identifié.",
      aiActArticle: "Article 6",
      estimatedEffort: "medium",
      estimatedCost: "5 000 - 15 000 €",
      deadline: "2 mois",
    });

    recommendations.push({
      id: `rec_${categoryId}_2`,
      priority: "critical",
      category: category.name,
      title: "Vérifier l'absence de pratiques interdites",
      description:
        "S'assurer qu'aucun système n'utilise de manipulation subliminale, d'exploitation de vulnérabilités, de scoring social ou de reconnaissance faciale en temps réel.",
      aiActArticle: "Article 5",
      estimatedEffort: "low",
      estimatedCost: "1 000 - 5 000 €",
      deadline: "Immédiat",
    });
  }

  if (categoryId === "governance" && score < 70) {
    recommendations.push({
      id: `rec_${categoryId}_1`,
      priority: score < 40 ? "critical" : "high",
      category: category.name,
      title: "Désigner un référent IA",
      description:
        "Nommer une personne responsable de la conformité AI Act, idéalement rattachée à la direction.",
      estimatedEffort: "low",
      estimatedCost: "0 € (réorganisation interne)",
      deadline: "2 semaines",
    });

    recommendations.push({
      id: `rec_${categoryId}_2`,
      priority: "high",
      category: category.name,
      title: "Rédiger une politique d'utilisation de l'IA",
      description:
        "Formaliser les règles d'usage de l'IA : outils autorisés, processus de validation, confidentialité des données.",
      estimatedEffort: "medium",
      estimatedCost: "3 000 - 8 000 €",
      deadline: "1 mois",
    });
  }

  if (categoryId === "documentation" && score < 70) {
    recommendations.push({
      id: `rec_${categoryId}_1`,
      priority: "high",
      category: category.name,
      title: "Documenter les systèmes à haut risque",
      description:
        "Créer la documentation technique requise par l'AI Act : description, conception, données, métriques, mesures de risque.",
      aiActArticle: "Article 11",
      estimatedEffort: "high",
      estimatedCost: "5 000 - 20 000 €",
      deadline: "3 mois",
    });

    recommendations.push({
      id: `rec_${categoryId}_2`,
      priority: "high",
      category: category.name,
      title: "Mettre en place la conservation des logs",
      description: "Implémenter un système de logging conforme avec conservation minimum 6 mois.",
      aiActArticle: "Article 12",
      estimatedEffort: "medium",
      estimatedCost: "2 000 - 10 000 €",
      deadline: "2 mois",
    });
  }

  if (categoryId === "training" && score < 70) {
    recommendations.push({
      id: `rec_${categoryId}_1`,
      priority: score < 40 ? "critical" : "high",
      category: category.name,
      title: "Former les collaborateurs à l'AI Act (Article 4)",
      description:
        "Déployer un programme de formation pour tous les utilisateurs de systèmes IA. C'est une obligation légale depuis février 2025.",
      aiActArticle: "Article 4",
      estimatedEffort: "medium",
      estimatedCost: "5 000 - 20 000 €",
      deadline: "Immédiat",
    });
  }

  if (categoryId === "transparency" && score < 70) {
    recommendations.push({
      id: `rec_${categoryId}_1`,
      priority: "high",
      category: category.name,
      title: "Informer les utilisateurs de l'utilisation de l'IA",
      description:
        "Mettre en place des mentions claires quand les utilisateurs interagissent avec un système IA (chatbots, décisions automatisées).",
      aiActArticle: "Article 50",
      estimatedEffort: "low",
      estimatedCost: "1 000 - 5 000 €",
      deadline: "1 mois",
    });
  }

  if (categoryId === "human_oversight" && score < 70) {
    recommendations.push({
      id: `rec_${categoryId}_1`,
      priority: "critical",
      category: category.name,
      title: "Implémenter la supervision humaine des systèmes à haut risque",
      description:
        "S'assurer qu'un humain peut intervenir, corriger ou arrêter tout système IA à haut risque.",
      aiActArticle: "Article 14",
      estimatedEffort: "medium",
      estimatedCost: "3 000 - 15 000 €",
      deadline: "2 mois",
    });
  }

  if (categoryId === "security" && score < 70) {
    recommendations.push({
      id: `rec_${categoryId}_1`,
      priority: "high",
      category: category.name,
      title: "Évaluer les risques de sécurité des systèmes IA",
      description:
        "Réaliser une analyse de sécurité incluant les risques spécifiques IA : attaques adversariales, empoisonnement de données.",
      aiActArticle: "Article 9",
      estimatedEffort: "medium",
      estimatedCost: "5 000 - 15 000 €",
      deadline: "2 mois",
    });
  }

  if (categoryId === "compliance_process" && score < 70) {
    recommendations.push({
      id: `rec_${categoryId}_1`,
      priority: "high",
      category: category.name,
      title: "Établir une roadmap de mise en conformité",
      description:
        "Définir un plan d'action priorisé avec jalons clairs pour atteindre la conformité avant les échéances réglementaires.",
      estimatedEffort: "medium",
      estimatedCost: "3 000 - 10 000 €",
      deadline: "1 mois",
    });

    recommendations.push({
      id: `rec_${categoryId}_2`,
      priority: "medium",
      category: category.name,
      title: "Mettre en place un registre des systèmes IA",
      description: "Créer et maintenir un registre conforme à l'Article 49 de l'AI Act.",
      aiActArticle: "Article 49",
      estimatedEffort: "low",
      estimatedCost: "1 000 - 3 000 €",
      deadline: "1 mois",
    });
  }

  if (categoryId === "suppliers" && score < 70) {
    recommendations.push({
      id: `rec_${categoryId}_1`,
      priority: "medium",
      category: category.name,
      title: "Réviser les contrats fournisseurs IA",
      description:
        "Ajouter des clauses AI Act aux contrats : responsabilités, documentation, conformité, audit.",
      aiActArticle: "Article 25",
      estimatedEffort: "medium",
      estimatedCost: "2 000 - 8 000 €",
      deadline: "3 mois",
    });
  }

  return recommendations;
}

// Générer l'estimation budgétaire
function generateBudgetEstimate(
  globalScore: number,
  companySize: string,
  highRiskCount: number
): BudgetEstimate {
  // Multiplicateurs selon la taille
  const sizeMultiplier =
    companySize === "ge" ? 3 : companySize === "eti" ? 2 : companySize === "pme" ? 1 : 0.5;

  // Base selon le score (plus le score est bas, plus le budget est élevé)
  const scoreMultiplier = globalScore < 40 ? 2 : globalScore < 60 ? 1.5 : 1;

  // Impact des systèmes à haut risque
  const hrMultiplier = highRiskCount > 5 ? 2 : highRiskCount > 2 ? 1.5 : 1;

  const baseFormation = { min: 3000, max: 15000 };
  const baseConsulting = { min: 5000, max: 30000 };
  const baseTools = { min: 2000, max: 15000 };
  const baseDocumentation = { min: 3000, max: 20000 };
  const baseAudit = { min: 5000, max: 25000 };

  const multiplier = sizeMultiplier * scoreMultiplier * hrMultiplier;

  return {
    formation: {
      min: Math.round(baseFormation.min * multiplier),
      max: Math.round(baseFormation.max * multiplier),
    },
    consulting: {
      min: Math.round(baseConsulting.min * multiplier),
      max: Math.round(baseConsulting.max * multiplier),
    },
    tools: {
      min: Math.round(baseTools.min * multiplier),
      max: Math.round(baseTools.max * multiplier),
    },
    documentation: {
      min: Math.round(baseDocumentation.min * multiplier),
      max: Math.round(baseDocumentation.max * multiplier),
    },
    audit: {
      min: Math.round(baseAudit.min * multiplier),
      max: Math.round(baseAudit.max * multiplier),
    },
    total: {
      min: Math.round(
        (baseFormation.min +
          baseConsulting.min +
          baseTools.min +
          baseDocumentation.min +
          baseAudit.min) *
          multiplier
      ),
      max: Math.round(
        (baseFormation.max +
          baseConsulting.max +
          baseTools.max +
          baseDocumentation.max +
          baseAudit.max) *
          multiplier
      ),
    },
  };
}

// Générer le plan d'action temporel
function generateTimeline(globalScore: number, criticalIssues: boolean): TimelinePhase[] {
  const phases: TimelinePhase[] = [];

  if (globalScore < 60 || criticalIssues) {
    phases.push({
      phase: 1,
      name: "Urgences",
      duration: "0-1 mois",
      color: "#FF4444",
      priority: "urgent",
      actions: [
        "Identifier et stopper les pratiques interdites",
        "Désigner un responsable IA",
        "Réaliser un inventaire rapide des systèmes IA",
        "Sensibilisation direction aux risques",
      ],
    });
  }

  phases.push({
    phase: phases.length + 1,
    name: "Fondations",
    duration: globalScore < 60 ? "1-3 mois" : "0-2 mois",
    color: "#FF6B00",
    priority: "high",
    actions: [
      "Inventaire complet des systèmes IA",
      "Classification selon les 4 niveaux de risque",
      "Rédaction politique IA",
      "Plan de formation Article 4",
    ],
  });

  phases.push({
    phase: phases.length + 1,
    name: "Conformité",
    duration: globalScore < 60 ? "3-6 mois" : "2-4 mois",
    color: "#FFB800",
    priority: "medium",
    actions: [
      "Documentation technique systèmes haut risque",
      "Mise en place gouvernance IA",
      "Implémentation supervision humaine",
      "Révision contrats fournisseurs",
    ],
  });

  phases.push({
    phase: phases.length + 1,
    name: "Optimisation",
    duration: globalScore < 60 ? "6-12 mois" : "4-8 mois",
    color: "#00FF88",
    priority: "low",
    actions: [
      "Automatisation des contrôles",
      "Audits internes réguliers",
      "Amélioration continue",
      "Veille réglementaire",
    ],
  });

  return phases;
}

// Fonction principale de calcul
export function calculateAuditResults(
  answers: Record<string, string | string[]>,
  plan: "starter" | "pro" | "enterprise"
): AuditResult {
  const categoryScoresMap: Record<string, { score: number; maxScore: number; questions: number }> =
    {};
  const criticalIssues: string[] = [];
  const collectedData: Record<string, any> = {};
  let highRiskDetected = false;
  let prohibitedDetected = false;

  // Initialiser les catégories
  for (const cat of CATEGORIES) {
    categoryScoresMap[cat.id] = { score: 0, maxScore: 0, questions: 0 };
  }

  // Calculer les scores
  for (const question of QUESTIONS) {
    if (!question.forPlans.includes(plan)) continue;

    const answer = answers[question.id];
    if (answer === undefined) continue;

    const { score, maxScore, riskLevel } = calculateQuestionScore(question, answer);

    if (categoryScoresMap[question.category]) {
      // Le score est inversé : plus le score est bas, mieux c'est
      // On calcule donc maxScore - score pour avoir un pourcentage de conformité
      categoryScoresMap[question.category].score += score;
      categoryScoresMap[question.category].maxScore += maxScore;
      categoryScoresMap[question.category].questions += 1;
    }

    // Détecter les problèmes critiques
    if (riskLevel === "critical") {
      criticalIssues.push(question.question);
      if (question.category === "risk_classification") {
        if (
          question.id.includes("prohibited") ||
          question.id.includes("social_scoring") ||
          question.id.includes("emotion")
        ) {
          prohibitedDetected = true;
        } else {
          highRiskDetected = true;
        }
      }
    }

    // Collecter les données pour les templates
    if (question.collectData && answer) {
      collectedData[question.collectData] = answer;
    }
  }

  // Convertir en CategoryScore[]
  const categoryScores: CategoryScore[] = CATEGORIES.map((cat) => {
    const data = categoryScoresMap[cat.id];
    // Calculer le pourcentage de conformité (inversé car score élevé = mauvais)
    const percentage =
      data.maxScore > 0 ? Math.round(100 - (data.score / data.maxScore) * 100) : 100;

    const riskLevel = getRiskLevel(percentage);
    const recommendations = generateCategoryRecommendations(cat.id, percentage, answers);

    return {
      categoryId: cat.id,
      categoryName: cat.name,
      icon: cat.icon,
      color: cat.color,
      score: data.score,
      maxScore: data.maxScore,
      percentage,
      riskLevel,
      questionsAnswered: data.questions,
      totalQuestions: QUESTIONS.filter(
        (q) => q.category === cat.id && q.forPlans.includes(plan)
      ).length,
      criticalIssues: criticalIssues.filter((issue) =>
        QUESTIONS.find((q) => q.question === issue && q.category === cat.id)
      ),
      recommendations,
    };
  }).filter((cat) => cat.questionsAnswered > 0);

  // Score global
  const totalScore = categoryScores.reduce((sum, cat) => sum + cat.score, 0);
  const totalMaxScore = categoryScores.reduce((sum, cat) => sum + cat.maxScore, 0);
  const globalScore =
    totalMaxScore > 0 ? Math.round(100 - (totalScore / totalMaxScore) * 100) : 100;
  const globalRiskLevel = getRiskLevel(globalScore);

  // Toutes les recommandations
  const allRecommendations = categoryScores.flatMap((cat) => cat.recommendations);

  // Gaps de conformité
  const complianceGaps: ComplianceGap[] = categoryScores
    .filter((cat) => cat.percentage < 70)
    .map((cat) => ({
      area: cat.categoryName,
      description: `Score de ${cat.percentage}% - Améliorations requises`,
      aiActArticle: "Voir recommandations",
      severity: cat.riskLevel,
      currentState: `${cat.percentage}% de conformité`,
      requiredState: "Minimum 70% recommandé",
    }));

  // Budget estimé
  const companySize = (collectedData.companySize as string) || "pme";
  const highRiskCount = parseInt((collectedData.highRiskCount as string) || "0") || 0;
  const estimatedBudget = generateBudgetEstimate(globalScore, companySize, highRiskCount);

  // Timeline
  const timeline = generateTimeline(globalScore, criticalIssues.length > 0);

  return {
    globalScore,
    riskLevel: globalRiskLevel,
    categoryScores,
    totalRecommendations: allRecommendations.length,
    criticalIssuesCount: criticalIssues.length,
    highRiskSystemsDetected: highRiskDetected,
    prohibitedPracticesDetected: prohibitedDetected,
    complianceGaps,
    estimatedBudget,
    timeline,
    collectedData,
  };
}
