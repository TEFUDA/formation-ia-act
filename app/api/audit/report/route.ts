import { NextRequest, NextResponse } from 'next/server';

interface AuditResults {
  score: number;
  plan: 'solo' | 'pro' | 'enterprise';
  profile: {
    name: string;
    sector: string;
    size: string;
    hasMultipleSites: boolean;
    siteCount?: number;
  };
  categoryScores: {
    category: string;
    icon: string;
    color: string;
    score: number;
  }[];
  highRiskFlags: string[];
  answers: Record<string, any>;
  totalQuestions: number;
  completedAt: string;
}

const categoryNames: Record<string, string> = {
  inventory: 'Inventaire IA',
  classification: 'Classification des risques',
  governance: 'Gouvernance IA',
  documentation: 'Documentation technique',
  training: 'Formation Article 4',
  transparency: 'Transparence',
  security: 'Sécurité & RGPD',
  suppliers: 'Fournisseurs IA',
  multisites: 'Multi-sites',
  rights: 'Droits fondamentaux',
};

const sectorNames: Record<string, string> = {
  industry: 'Industrie / Manufacturing',
  health: 'Santé / Médical',
  finance: 'Finance / Banque / Assurance',
  retail: 'Retail / Commerce',
  services: 'Services aux entreprises',
  tech: 'Tech / IT / Digital',
  education: 'Éducation / Formation',
  public: 'Secteur public',
  transport: 'Transport / Logistique',
  energy: 'Énergie / Environnement',
};

const sizeNames: Record<string, string> = {
  tpe: 'TPE (1-9 salariés)',
  pme: 'PME (10-249 salariés)',
  eti: 'ETI (250-4999 salariés)',
  ge: 'Grande Entreprise (5000+ salariés)',
};

function generateCertId(): string {
  return 'AACT-' + Math.random().toString(36).substring(2, 10).toUpperCase();
}

function getScoreColor(score: number): string {
  if (score >= 80) return '#00FF88';
  if (score >= 60) return '#00F5FF';
  if (score >= 40) return '#FFB800';
  return '#FF4444';
}

function generateRecommendations(categoryScores: AuditResults['categoryScores']) {
  const recs: Array<{priority: string; category: string; title: string; description: string; actions: string[]; aiActRef: string; deadline: string; budget: string; responsible: string;}> = [];

  categoryScores.forEach(cat => {
    if (cat.category === 'inventory' && cat.score < 80) {
      recs.push({
        priority: cat.score < 50 ? 'critical' : 'high',
        category: 'Inventaire IA',
        title: "Compléter l'inventaire des systèmes IA",
        description: "L'Article 49 impose aux déployeurs de tenir un registre exhaustif de tous les systèmes IA utilisés.",
        actions: [
          'Envoyer un questionnaire de recensement à tous les départements',
          'Organiser des entretiens avec les responsables métier',
          'Auditer les outils IT et les licences logicielles',
          'Identifier les usages Shadow IT (ChatGPT, etc.)',
          'Créer une fiche descriptive pour chaque système',
          'Nommer un responsable pour chaque système IA'
        ],
        aiActRef: 'Article 49',
        deadline: '1 mois',
        budget: '2 000 € - 5 000 €',
        responsible: 'DSI / Référent IA'
      });
    }
    if (cat.category === 'training' && cat.score < 80) {
      recs.push({
        priority: 'critical',
        category: 'Formation Article 4',
        title: "Former les collaborateurs (obligation Article 4)",
        description: "L'Article 4 impose une 'maîtrise suffisante de l'IA' pour tous les utilisateurs. Cette obligation est en vigueur depuis février 2025.",
        actions: [
          'Cartographier les profils utilisateurs et leurs besoins',
          'Identifier les collaborateurs prioritaires',
          'Sélectionner des formations adaptées',
          'Déployer le plan de formation',
          'Mettre en place un système de suivi (attestations)',
          'Inclure l\'IA dans l\'onboarding des nouveaux arrivants'
        ],
        aiActRef: 'Article 4',
        deadline: 'Immédiat',
        budget: '10 000 € - 50 000 €',
        responsible: 'DRH / Formation'
      });
    }
    if (cat.category === 'governance' && cat.score < 80) {
      recs.push({
        priority: cat.score < 50 ? 'critical' : 'high',
        category: 'Gouvernance IA',
        title: "Mettre en place une gouvernance IA",
        description: "Une gouvernance IA structurée est essentielle pour piloter la conformité dans la durée.",
        actions: [
          'Nommer officiellement un Référent IA',
          'Définir ses responsabilités',
          'Constituer un comité de gouvernance IA',
          'Rédiger une Politique IA',
          'Créer un processus de validation avant déploiement',
          'Mettre en place un reporting Direction'
        ],
        aiActRef: 'Articles 26-27',
        deadline: '1-2 mois',
        budget: '5 000 € - 15 000 €',
        responsible: 'Direction Générale'
      });
    }
    if (cat.category === 'security' && cat.score < 80) {
      recs.push({
        priority: cat.score < 50 ? 'critical' : 'high',
        category: 'Sécurité & RGPD',
        title: "Renforcer la sécurité des systèmes IA",
        description: "Les systèmes IA traitent souvent des données sensibles. L'alignement avec le RGPD est obligatoire.",
        actions: [
          'Intégrer les systèmes IA dans la politique de sécurité IT',
          'Réaliser des analyses de risques spécifiques',
          'Aligner les traitements IA avec le registre RGPD',
          'Définir les bases légales pour chaque traitement',
          'Créer une procédure de gestion des incidents IA'
        ],
        aiActRef: 'Articles 9, 15',
        deadline: '2-4 mois',
        budget: '10 000 € - 30 000 €',
        responsible: 'RSSI / DPO'
      });
    }
    if (cat.category === 'transparency' && cat.score < 80) {
      recs.push({
        priority: 'high',
        category: 'Transparence',
        title: "Améliorer la transparence sur l'utilisation de l'IA",
        description: "L'AI Act impose d'informer les utilisateurs qu'ils interagissent avec une IA.",
        actions: [
          'Identifier tous les points de contact IA',
          'Ajouter des mentions d\'information',
          'Mettre à jour les CGU',
          'Implémenter le marquage du contenu généré par IA',
          'Former les équipes communication'
        ],
        aiActRef: 'Articles 50-52',
        deadline: '2-3 mois',
        budget: '2 000 € - 8 000 €',
        responsible: 'Communication / Juridique'
      });
    }
    if (cat.category === 'documentation' && cat.score < 80) {
      recs.push({
        priority: cat.score < 50 ? 'critical' : 'high',
        category: 'Documentation technique',
        title: "Compléter la documentation technique",
        description: "L'AI Act exige une documentation technique détaillée pour les systèmes à haut risque.",
        actions: [
          'Collecter la documentation technique fournisseurs',
          'Créer des fiches système standardisées',
          'Documenter les données d\'entraînement',
          'Décrire les logiques de fonctionnement',
          'Documenter les métriques de performance',
          'Lister les limites connues de chaque système'
        ],
        aiActRef: 'Article 11, Annexe IV',
        deadline: '3-4 mois',
        budget: '5 000 € - 20 000 €',
        responsible: 'DSI / Équipes techniques'
      });
    }
    if (cat.category === 'classification' && cat.score < 80) {
      recs.push({
        priority: cat.score < 50 ? 'critical' : 'high',
        category: 'Classification des risques',
        title: "Classifier les systèmes IA selon l'AI Act",
        description: "L'AI Act définit 4 niveaux de risque. La classification détermine les obligations applicables.",
        actions: [
          'Analyser chaque système selon l\'Annexe III',
          'Identifier les usages dans les domaines sensibles',
          'Évaluer l\'impact sur les droits fondamentaux',
          'Documenter la méthodologie de classification',
          'Faire valider par le service juridique'
        ],
        aiActRef: 'Articles 6-7, Annexe III',
        deadline: '2 mois',
        budget: '3 000 € - 10 000 €',
        responsible: 'Référent IA / Juridique'
      });
    }
  });

  const priorityOrder: Record<string, number> = { critical: 0, high: 1, medium: 2, low: 3 };
  recs.sort((a, b) => (priorityOrder[a.priority] || 3) - (priorityOrder[b.priority] || 3));
  return recs;
}

function generateHTML(results: AuditResults): string {
  const { score, plan, profile, categoryScores, highRiskFlags, totalQuestions, completedAt } = results;
  const certId = generateCertId();
  const scoreColor = getScoreColor(score);
  const recs = generateRecommendations(categoryScores);
  const reportDate = new Date(completedAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  const planLabel = plan === 'enterprise' ? 'Enterprise' : plan === 'pro' ? 'PRO' : 'Solo';

  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
    * { margin: 0; padding: 0; box-sizing: border-box; }
    :root { --primary: #8B5CF6; --secondary: #00F5FF; --success: #00FF88; --warning: #FFB800; --danger: #FF4444; }
    body { font-family: 'Inter', sans-serif; line-height: 1.6; color: #333; background: white; }
    @media print { body { -webkit-print-color-adjust: exact !important; } .page-break { page-break-before: always; } .no-break { page-break-inside: avoid; } }
    .page { max-width: 210mm; margin: 0 auto; padding: 20mm; min-height: 297mm; }
    .cover { text-align: center; padding: 60px 20px; }
    .cover .brand { font-size: 24px; font-weight: 700; color: var(--primary); margin-bottom: 40px; }
    .cover h1 { font-size: 42px; font-weight: 800; background: linear-gradient(135deg, var(--primary), var(--secondary)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 20px; }
    .cover .company-name { display: inline-block; font-size: 28px; font-weight: 600; padding: 20px 40px; border: 2px solid var(--primary); border-radius: 15px; margin: 30px 0; }
    .cover .score-box { background: linear-gradient(135deg, #f0fdf4, #ecfeff); border-radius: 20px; padding: 40px; margin: 40px auto; max-width: 400px; }
    .cover .score { font-size: 72px; font-weight: 800; }
    .cover .badge { display: inline-block; background: var(--primary); color: white; padding: 10px 25px; border-radius: 25px; font-weight: 600; margin-top: 20px; }
    h2 { font-size: 28px; font-weight: 700; color: #1a1a2e; margin-bottom: 25px; padding-bottom: 15px; border-bottom: 3px solid var(--primary); }
    h3 { font-size: 20px; font-weight: 600; color: #1a1a2e; margin: 25px 0 15px; }
    h4 { font-size: 16px; font-weight: 600; color: #1a1a2e; margin: 20px 0 10px; }
    p { margin-bottom: 15px; text-align: justify; }
    .toc { padding: 30px; background: #f5f5f5; border-radius: 15px; }
    .toc-item { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px dashed #ddd; }
    .toc-item .num { font-weight: 600; color: var(--primary); margin-right: 15px; }
    .exec-summary { background: linear-gradient(135deg, #faf5ff, #ecfeff); border-radius: 15px; padding: 30px; margin: 20px 0; }
    .summary-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin: 25px 0; }
    .summary-card { background: white; border-radius: 12px; padding: 25px; text-align: center; box-shadow: 0 2px 10px rgba(0,0,0,0.05); }
    .summary-card .value { font-size: 36px; font-weight: 700; color: var(--primary); }
    .summary-card .label { font-size: 14px; color: #666; margin-top: 5px; }
    .sw-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 25px; margin: 25px 0; }
    .sw-box { background: white; border-radius: 12px; padding: 25px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); }
    .sw-box.strengths { border-left: 4px solid var(--success); }
    .sw-box.weaknesses { border-left: 4px solid var(--warning); }
    .sw-item { display: flex; justify-content: space-between; padding: 8px 0; font-size: 14px; }
    .profile-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    .profile-table th, .profile-table td { padding: 15px 20px; text-align: left; border-bottom: 1px solid #eee; }
    .profile-table th { background: #f5f5f5; font-weight: 600; width: 40%; }
    .category-section { margin: 30px 0; padding: 25px; background: white; border-radius: 15px; box-shadow: 0 2px 15px rgba(0,0,0,0.05); }
    .category-header { display: flex; align-items: center; gap: 15px; margin-bottom: 20px; }
    .category-icon { font-size: 32px; }
    .category-score { font-size: 28px; font-weight: 700; margin-left: auto; }
    .score-bar { height: 12px; background: #eee; border-radius: 6px; overflow: hidden; margin: 15px 0; }
    .score-bar-fill { height: 100%; border-radius: 6px; }
    .rec-card { background: white; border-radius: 12px; padding: 25px; margin: 20px 0; box-shadow: 0 2px 15px rgba(0,0,0,0.05); border-left: 4px solid var(--primary); }
    .rec-card.critical { border-left-color: var(--danger); background: linear-gradient(135deg, #fff5f5, white); }
    .rec-card.high { border-left-color: var(--warning); background: linear-gradient(135deg, #fffbeb, white); }
    .priority-badge { display: inline-block; padding: 5px 15px; border-radius: 15px; font-size: 12px; font-weight: 600; text-transform: uppercase; margin-bottom: 15px; }
    .priority-badge.critical { background: var(--danger); color: white; }
    .priority-badge.high { background: var(--warning); color: #333; }
    .action-list { margin: 15px 0; padding-left: 20px; }
    .action-list li { margin: 10px 0; padding-left: 10px; }
    .rec-meta { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee; font-size: 14px; }
    .meta-item { display: flex; gap: 10px; }
    .meta-item .label { color: #666; }
    .meta-item .value { font-weight: 500; }
    .timeline { margin: 30px 0; }
    .timeline-item { display: flex; margin-bottom: 30px; }
    .timeline-marker { width: 60px; flex-shrink: 0; text-align: center; }
    .timeline-marker .month { width: 50px; height: 50px; background: var(--primary); color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 18px; }
    .timeline-content { flex: 1; background: #f5f5f5; border-radius: 12px; padding: 25px; margin-left: 20px; }
    .timeline-content h4 { color: var(--primary); margin-bottom: 15px; }
    .budget-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    .budget-table th, .budget-table td { padding: 12px 15px; text-align: left; border-bottom: 1px solid #eee; }
    .budget-table th { background: #f5f5f5; font-weight: 600; }
    .budget-table .total { background: linear-gradient(135deg, #faf5ff, #ecfeff); font-weight: 700; }
    .glossary-term { margin: 20px 0; padding: 20px; background: #f5f5f5; border-radius: 10px; }
    .glossary-term strong { color: var(--primary); font-size: 16px; }
    .certificate { text-align: center; padding: 50px; border: 4px solid var(--success); border-radius: 20px; margin: 40px 0; }
    .certificate .badge-icon { font-size: 80px; margin-bottom: 20px; }
    .certificate h2 { border: none; font-size: 32px; margin-bottom: 10px; }
    .certificate .company { font-size: 28px; color: var(--primary); margin: 30px 0; }
    .certificate .cert-score { font-size: 64px; font-weight: 800; color: var(--success); margin: 20px 0; }
    .certificate .cert-id { font-family: monospace; font-size: 18px; color: var(--success); margin: 20px 0; }
    .certificate .validity { background: #f0fdf4; padding: 15px 30px; border-radius: 10px; display: inline-block; margin-top: 20px; }
    .callout { background: linear-gradient(135deg, #fef3c7, #fef9c3); border-left: 4px solid var(--warning); padding: 20px; border-radius: 0 10px 10px 0; margin: 20px 0; }
    .callout.info { background: linear-gradient(135deg, #dbeafe, #e0f2fe); border-left-color: var(--secondary); }
    .callout.danger { background: linear-gradient(135deg, #fee2e2, #fef2f2); border-left-color: var(--danger); }
    .footer { text-align: center; padding: 30px; color: #666; font-size: 12px; border-top: 1px solid #eee; margin-top: 40px; }
  `;

  const strengthsCats = categoryScores.filter(c => c.score >= 70);
  const weaknessesCats = categoryScores.filter(c => c.score < 70);

  // Generate category analysis pages
  const categoryAnalysisPages = categoryScores.map((cat, idx) => {
    const catName = categoryNames[cat.category] || cat.category;
    const analysis = cat.score >= 80 
      ? `Excellent niveau de maturité. Les fondamentaux sont en place et les processus sont matures.`
      : cat.score >= 60 
        ? `Base solide. Des ajustements sont nécessaires pour atteindre un niveau optimal.`
        : cat.score >= 40
          ? `Attention particulière requise. Des actions correctives significatives doivent être entreprises.`
          : `Lacunes critiques identifiées. Des actions urgentes sont requises.`;
    
    const requirements: Record<string, string> = {
      inventory: "L'Article 49 impose aux déployeurs de tenir à jour un inventaire de tous les systèmes IA utilisés.",
      classification: "Les Articles 6-7 et l'Annexe III définissent les critères de classification en 4 niveaux de risque.",
      governance: "Les Articles 26-27 imposent une gouvernance structurée avec des rôles définis.",
      training: "L'Article 4 impose une 'maîtrise suffisante de l'IA' pour tous les utilisateurs (en vigueur depuis février 2025).",
      documentation: "L'Article 11 et l'Annexe IV définissent les exigences de documentation technique.",
      transparency: "Les Articles 50-52 imposent des obligations de transparence.",
      security: "Les Articles 9 et 15 imposent des mesures de sécurité spécifiques. L'alignement RGPD est obligatoire.",
    };

    return `
      <div class="category-section no-break">
        <div class="category-header">
          <span class="category-icon">${cat.icon}</span>
          <div><h4 style="margin:0;">${idx + 1}. ${catName}</h4></div>
          <span class="category-score" style="color: ${cat.color}">${Math.round(cat.score)}%</span>
        </div>
        <div class="score-bar"><div class="score-bar-fill" style="width: ${cat.score}%; background-color: ${cat.color};"></div></div>
        <h4>Évaluation</h4>
        <p>${analysis}</p>
        <h4>Exigences AI Act</h4>
        <p>${requirements[cat.category] || 'Obligations spécifiques définies par l\'AI Act.'}</p>
      </div>
    `;
  }).join('');

  // Generate recommendations pages
  const recsHTML = recs.map((rec, i) => `
    <div class="rec-card ${rec.priority} no-break">
      <span class="priority-badge ${rec.priority}">
        ${rec.priority === 'critical' ? '🔴 CRITIQUE' : rec.priority === 'high' ? '🟠 PRIORITÉ HAUTE' : '🟡 PRIORITÉ MOYENNE'}
      </span>
      <h4>${rec.title}</h4>
      <p><strong>📖 Référence :</strong> ${rec.aiActRef}</p>
      <p>${rec.description}</p>
      <h4>Actions à mener</h4>
      <ul class="action-list">
        ${rec.actions.map(a => '<li>' + a + '</li>').join('')}
      </ul>
      <div class="rec-meta">
        <div class="meta-item"><span class="label">⏱️ Délai :</span><span class="value">${rec.deadline}</span></div>
        <div class="meta-item"><span class="label">💰 Budget :</span><span class="value">${rec.budget}</span></div>
        <div class="meta-item"><span class="label">👤 Responsable :</span><span class="value">${rec.responsible}</span></div>
      </div>
    </div>
  `).join('');

  // Action plan
  const actionPlanHTML = [1, 2, 3, 4, 5, 6].map(m => {
    const phases: Record<number, {title: string; objectives: string[]; actions: string[]}> = {
      1: { title: 'Fondations', objectives: ['Établir la gouvernance IA', 'Finaliser l\'inventaire', 'Lancer les formations'], actions: ['Nommer le Référent IA', 'Constituer le comité IA', 'Recenser les systèmes IA', 'Identifier les besoins de formation'] },
      2: { title: 'Classification & Gouvernance', objectives: ['Classifier les systèmes IA', 'Formaliser la politique IA'], actions: ['Analyser selon l\'Annexe III', 'Rédiger la Politique IA', 'Déployer les premières formations', 'Mettre en place la validation'] },
      3: { title: 'Documentation & Formation', objectives: ['Compléter la documentation', 'Accélérer les formations'], actions: ['Collecter la doc fournisseurs', 'Créer les fiches techniques', 'Réaliser les FRIA si nécessaire', 'Poursuivre les formations'] },
      4: { title: 'Transparence & Sécurité', objectives: ['Mettre en conformité la transparence', 'Renforcer la sécurité'], actions: ['Implémenter les mentions IA', 'Mettre à jour les CGU', 'Intégrer à la politique sécurité', 'Vérifier l\'alignement RGPD'] },
      5: { title: 'Fournisseurs & Monitoring', objectives: ['Encadrer les fournisseurs', 'Mettre en place le monitoring'], actions: ['Évaluer les fournisseurs IA', 'Négocier les avenants', 'Définir les KPIs de suivi', 'Finaliser les formations'] },
      6: { title: 'Consolidation & Audit', objectives: ['Audit interne', 'Préparer le maintien'], actions: ['Réaliser l\'audit de validation', 'Corriger les écarts', 'Finaliser la documentation', 'Définir le plan de maintien'] },
    };
    const phase = phases[m];
    return `
      <div class="timeline-item no-break">
        <div class="timeline-marker"><div class="month">M${m}</div></div>
        <div class="timeline-content">
          <h4>Phase ${m} : ${phase.title}</h4>
          <p><strong>Objectifs :</strong></p>
          <ul class="action-list">${phase.objectives.map(o => '<li>' + o + '</li>').join('')}</ul>
          <p><strong>Actions clés :</strong></p>
          <ul class="action-list">${phase.actions.map(a => '<li>' + a + '</li>').join('')}</ul>
        </div>
      </div>
    `;
  }).join('');

  return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Rapport d'Audit AI Act - ${profile.name || 'Organisation'}</title>
  <style>${styles}</style>
</head>
<body>
  <!-- COVER -->
  <div class="page cover">
    <div class="brand">🛡 Formation-IA-Act.fr</div>
    <h1>Rapport d'Audit AI Act</h1>
    <p style="font-size: 20px; color: #666;">Évaluation de conformité au Règlement européen sur l'IA</p>
    <div class="company-name">${profile.name || 'Organisation'}</div>
    <div class="score-box">
      <div class="score" style="color: ${scoreColor}">${score}%</div>
      <p style="color: #666;">Score de conformité global</p>
    </div>
    <p style="color: #666;">Rapport généré le ${reportDate}</p>
    <div class="badge">Audit ${planLabel}</div>
  </div>

  <!-- TABLE OF CONTENTS -->
  <div class="page page-break">
    <h2>Sommaire</h2>
    <div class="toc">
      <div class="toc-item"><span><span class="num">1.</span> Executive Summary</span><span>3</span></div>
      <div class="toc-item"><span><span class="num">2.</span> Profil de l'organisation</span><span>5</span></div>
      <div class="toc-item"><span><span class="num">3.</span> Méthodologie d'audit</span><span>7</span></div>
      <div class="toc-item"><span><span class="num">4.</span> Résultats par domaine</span><span>9</span></div>
      <div class="toc-item"><span><span class="num">5.</span> Analyse détaillée</span><span>12</span></div>
      <div class="toc-item"><span><span class="num">6.</span> Recommandations prioritaires</span><span>18</span></div>
      <div class="toc-item"><span><span class="num">7.</span> Plan d'action 6 mois</span><span>26</span></div>
      <div class="toc-item"><span><span class="num">8.</span> Estimation budgétaire</span><span>32</span></div>
      <div class="toc-item"><span><span class="num">9.</span> Prochaines étapes</span><span>36</span></div>
      <div class="toc-item"><span><span class="num">A.</span> Glossaire AI Act</span><span>38</span></div>
      <div class="toc-item"><span><span class="num">B.</span> Textes de référence</span><span>42</span></div>
      <div class="toc-item"><span><span class="num">C.</span> Checklist conformité</span><span>44</span></div>
      <div class="toc-item"><span>Certificat d'audit</span><span>48</span></div>
    </div>
    <div style="margin-top: 40px; padding: 20px; background: #f5f5f5; border-radius: 10px;">
      <h4>À propos de ce rapport</h4>
      <p style="font-size: 14px; color: #666;">Ce rapport présente les résultats de l'audit de conformité AI Act réalisé par ${profile.name || 'votre organisation'}. Il analyse ${totalQuestions} critères répartis en ${categoryScores.length} domaines clés du Règlement européen sur l'Intelligence Artificielle (AI Act).</p>
    </div>
  </div>

  <!-- EXECUTIVE SUMMARY -->
  <div class="page page-break">
    <h2>1. Executive Summary</h2>
    <div class="exec-summary">
      <p>L'audit de conformité AI Act de <strong>${profile.name || 'votre organisation'}</strong> (${sectorNames[profile.sector] || profile.sector}, ${sizeNames[profile.size] || profile.size}) révèle un score global de <strong>${score}%</strong>.</p>
      <div class="summary-grid">
        <div class="summary-card"><div class="value">${score}%</div><div class="label">Score global</div></div>
        <div class="summary-card"><div class="value">${totalQuestions}</div><div class="label">Critères évalués</div></div>
        <div class="summary-card"><div class="value">${highRiskFlags.length}</div><div class="label">Systèmes haut risque</div></div>
      </div>
      <div class="sw-grid">
        <div class="sw-box strengths">
          <h4>✅ Points forts</h4>
          ${strengthsCats.map(c => '<div class="sw-item"><span>' + (categoryNames[c.category] || c.category) + '</span><span style="color:' + c.color + ';font-weight:600">' + Math.round(c.score) + '%</span></div>').join('')}
        </div>
        <div class="sw-box weaknesses">
          <h4>⚠️ Points d'amélioration</h4>
          ${weaknessesCats.map(c => '<div class="sw-item"><span>' + (categoryNames[c.category] || c.category) + '</span><span style="color:' + c.color + ';font-weight:600">' + Math.round(c.score) + '% - ' + (c.score < 50 ? 'Critique' : 'À améliorer') + '</span></div>').join('')}
        </div>
      </div>
    </div>
    <div class="callout">
      <strong>📅 Rappel des échéances AI Act :</strong>
      <ul style="margin-top: 10px;">
        <li><strong>Février 2025</strong> : Article 4 (Formation) en vigueur</li>
        <li><strong>Août 2025</strong> : Interdictions (Article 5) en vigueur</li>
        <li><strong>Août 2026</strong> : Obligations systèmes haut risque en vigueur</li>
      </ul>
    </div>
  </div>

  <!-- PROFILE -->
  <div class="page page-break">
    <h2>2. Profil de l'organisation</h2>
    <table class="profile-table">
      <tr><th>Raison sociale</th><td>${profile.name || 'Non renseigné'}</td></tr>
      <tr><th>Secteur d'activité</th><td>${sectorNames[profile.sector] || profile.sector || 'Non renseigné'}</td></tr>
      <tr><th>Taille</th><td>${sizeNames[profile.size] || profile.size || 'Non renseigné'}</td></tr>
      <tr><th>Structure</th><td>${profile.hasMultipleSites ? 'Multi-sites (' + (profile.siteCount || 'plusieurs') + ' sites)' : 'Site unique'}</td></tr>
      <tr><th>Date de l'audit</th><td>${reportDate}</td></tr>
      <tr><th>Type d'audit</th><td>Audit ${planLabel}</td></tr>
      <tr><th>Référence</th><td>${certId}</td></tr>
    </table>
    <h3>Contexte réglementaire spécifique</h3>
    <p>En tant qu'organisation du secteur <strong>${sectorNames[profile.sector] || 'non spécifié'}</strong>, vous êtes potentiellement concerné par des obligations spécifiques de l'AI Act selon votre usage de l'IA.</p>
    ${profile.sector === 'health' ? '<div class="callout danger"><strong>⚠️ Secteur Santé</strong><p>Les systèmes IA pour le diagnostic médical sont classés à haut risque (Annexe III).</p></div>' : ''}
    ${profile.sector === 'finance' ? '<div class="callout danger"><strong>⚠️ Secteur Finance</strong><p>Les systèmes de scoring crédit sont classés à haut risque (Annexe III).</p></div>' : ''}
  </div>

  <!-- METHODOLOGY -->
  <div class="page page-break">
    <h2>3. Méthodologie d'audit</h2>
    <h3>3.1 Périmètre</h3>
    <p>Cet audit couvre les obligations du Règlement (UE) 2024/1689 (AI Act) applicables aux déployeurs de systèmes d'IA. Il évalue la conformité selon ${categoryScores.length} domaines clés.</p>
    <h3>3.2 Référentiel</h3>
    <ul class="action-list">
      <li>Texte officiel du Règlement (UE) 2024/1689</li>
      <li>Lignes directrices du Comité européen de l'IA</li>
      <li>Bonnes pratiques sectorielles</li>
    </ul>
    <h3>3.3 Méthode de scoring</h3>
    <table class="profile-table">
      <tr><th style="color:#00FF88">80-100%</th><td>Excellent - Conformité atteinte</td></tr>
      <tr><th style="color:#00F5FF">60-79%</th><td>Bon - Quelques ajustements nécessaires</td></tr>
      <tr><th style="color:#FFB800">40-59%</th><td>À améliorer - Actions correctives prioritaires</td></tr>
      <tr><th style="color:#FF4444">0-39%</th><td>Critique - Actions urgentes requises</td></tr>
    </table>
    <h3>3.4 Limites</h3>
    <p>Cet audit est basé sur les réponses déclaratives. Il ne constitue pas un audit de certification et ne se substitue pas à une analyse juridique approfondie.</p>
  </div>

  <!-- RESULTS BY CATEGORY -->
  <div class="page page-break">
    <h2>4. Résultats par domaine</h2>
    <p>Vue d'ensemble des ${categoryScores.length} domaines évalués :</p>
    ${categoryScores.map(cat => `
      <div class="category-section no-break">
        <div class="category-header">
          <span class="category-icon">${cat.icon}</span>
          <div><h4 style="margin:0;">${categoryNames[cat.category] || cat.category}</h4></div>
          <span class="category-score" style="color: ${cat.color}">${Math.round(cat.score)}%</span>
        </div>
        <div class="score-bar"><div class="score-bar-fill" style="width: ${cat.score}%; background-color: ${cat.color};"></div></div>
      </div>
    `).join('')}
  </div>

  <!-- DETAILED ANALYSIS -->
  <div class="page page-break">
    <h2>5. Analyse détaillée des catégories</h2>
    ${categoryAnalysisPages}
  </div>

  <!-- RECOMMENDATIONS -->
  <div class="page page-break">
    <h2>6. Recommandations prioritaires</h2>
    <p>Les recommandations ci-dessous sont classées par ordre de priorité :</p>
    ${recsHTML}
  </div>

  <!-- ACTION PLAN -->
  <div class="page page-break">
    <h2>7. Plan d'action sur 6 mois</h2>
    <p>Plan de mise en conformité structuré :</p>
    <div class="timeline">${actionPlanHTML}</div>
  </div>

  <!-- BUDGET -->
  <div class="page page-break">
    <h2>8. Estimation budgétaire</h2>
    <table class="budget-table">
      <thead><tr><th>Domaine</th><th>Actions</th><th>Budget</th></tr></thead>
      <tbody>
        ${recs.map(r => '<tr><td>' + r.category + '</td><td>' + r.title + '</td><td>' + r.budget + '</td></tr>').join('')}
        <tr class="total"><td colspan="2"><strong>TOTAL ESTIMÉ</strong></td><td><strong>30k€ - 100k€</strong></td></tr>
      </tbody>
    </table>
    <h3>Répartition par type</h3>
    <table class="budget-table">
      <tr><th>Type</th><th>Description</th><th>Part</th></tr>
      <tr><td>Ressources internes</td><td>Temps équipes</td><td>40-50%</td></tr>
      <tr><td>Formation</td><td>Programmes Article 4</td><td>25-35%</td></tr>
      <tr><td>Conseil externe</td><td>Accompagnement si nécessaire</td><td>15-25%</td></tr>
      <tr><td>Outils</td><td>Solutions de registre, monitoring</td><td>5-10%</td></tr>
    </table>
  </div>

  <!-- NEXT STEPS -->
  <div class="page page-break">
    <h2>9. Prochaines étapes</h2>
    <h3>Actions immédiates (Semaine 1)</h3>
    <ol class="action-list">
      <li>Partager ce rapport avec la Direction</li>
      <li>Organiser une réunion de lancement</li>
      <li>Nommer le Référent IA</li>
      <li>Prioriser les actions critiques</li>
    </ol>
    <h3>Court terme (Mois 1)</h3>
    <ol class="action-list">
      <li>Finaliser l'inventaire des systèmes IA</li>
      <li>Lancer les formations Article 4</li>
      <li>Constituer le comité de gouvernance</li>
    </ol>
    <div class="callout info">
      <strong>📞 Besoin d'accompagnement ?</strong>
      <p>Notre équipe peut vous accompagner. Contactez-nous sur <strong>formation-ia-act.fr</strong></p>
    </div>
  </div>

  <!-- GLOSSARY -->
  <div class="page page-break">
    <h2>Annexe A : Glossaire AI Act</h2>
    <div class="glossary-term"><strong>AI Act</strong><p>Règlement (UE) 2024/1689 établissant des règles sur l'IA.</p></div>
    <div class="glossary-term"><strong>Système d'IA</strong><p>Système basé sur une machine conçu pour fonctionner avec différents niveaux d'autonomie.</p></div>
    <div class="glossary-term"><strong>Fournisseur</strong><p>Entité qui développe un système d'IA pour le mettre sur le marché.</p></div>
    <div class="glossary-term"><strong>Déployeur</strong><p>Entité qui utilise un système d'IA sous sa propre autorité.</p></div>
    <div class="glossary-term"><strong>Système IA à haut risque</strong><p>Système listé à l'Annexe III soumis à des obligations renforcées.</p></div>
    <div class="glossary-term"><strong>FRIA</strong><p>Évaluation d'impact sur les droits fondamentaux (Article 27).</p></div>
    <div class="glossary-term"><strong>Maîtrise de l'IA</strong><p>Compétences permettant de prendre des décisions éclairées sur l'IA (Article 4).</p></div>
  </div>

  <!-- REFERENCES -->
  <div class="page page-break">
    <h2>Annexe B : Textes de référence</h2>
    <h3>Articles clés de l'AI Act</h3>
    <ul class="action-list">
      <li><strong>Article 4</strong> - Maîtrise de l'IA (AI Literacy)</li>
      <li><strong>Article 5</strong> - Pratiques interdites</li>
      <li><strong>Articles 6-7</strong> - Classification des systèmes à haut risque</li>
      <li><strong>Article 11</strong> - Documentation technique</li>
      <li><strong>Article 26</strong> - Obligations des déployeurs</li>
      <li><strong>Article 27</strong> - FRIA</li>
      <li><strong>Articles 50-52</strong> - Obligations de transparence</li>
      <li><strong>Annexe III</strong> - Systèmes IA à haut risque</li>
    </ul>
    <h3>Calendrier d'application</h3>
    <table class="budget-table">
      <tr><th>Date</th><th>Dispositions</th></tr>
      <tr><td>Février 2025</td><td>Article 4, Pratiques interdites</td></tr>
      <tr><td>Août 2025</td><td>Gouvernance, Organismes notifiés</td></tr>
      <tr><td>Août 2026</td><td>Obligations systèmes haut risque</td></tr>
    </table>
  </div>

  <!-- CHECKLIST -->
  <div class="page page-break">
    <h2>Annexe C : Checklist de conformité</h2>
    <h4>📋 Inventaire IA</h4>
    <table class="budget-table">
      <tr><td>☐</td><td>Tous les systèmes IA sont recensés</td></tr>
      <tr><td>☐</td><td>Chaque système a une fiche descriptive</td></tr>
      <tr><td>☐</td><td>Un responsable est identifié</td></tr>
    </table>
    <h4>⚠️ Classification</h4>
    <table class="budget-table">
      <tr><td>☐</td><td>Tous les systèmes sont classifiés</td></tr>
      <tr><td>☐</td><td>Les systèmes haut risque sont identifiés</td></tr>
    </table>
    <h4>🏛 Gouvernance</h4>
    <table class="budget-table">
      <tr><td>☐</td><td>Référent IA nommé</td></tr>
      <tr><td>☐</td><td>Politique IA rédigée</td></tr>
      <tr><td>☐</td><td>Processus de validation en place</td></tr>
    </table>
    <h4>🎓 Formation</h4>
    <table class="budget-table">
      <tr><td>☐</td><td>Plan de formation défini</td></tr>
      <tr><td>☐</td><td>Attestations suivies</td></tr>
    </table>
    <h4>👁 Transparence</h4>
    <table class="budget-table">
      <tr><td>☐</td><td>Utilisateurs informés de l'IA</td></tr>
      <tr><td>☐</td><td>Chatbots identifiés</td></tr>
    </table>
    <h4>🔒 Sécurité</h4>
    <table class="budget-table">
      <tr><td>☐</td><td>Alignement RGPD vérifié</td></tr>
      <tr><td>☐</td><td>Procédure incidents en place</td></tr>
    </table>
  </div>

  <!-- CERTIFICATE -->
  <div class="page page-break">
    <div class="certificate">
      <div class="badge-icon">🏅</div>
      <h2>CERTIFICAT D'AUDIT AI ACT</h2>
      <p>Atteste que</p>
      <div class="company">${profile.name || 'Organisation'}</div>
      <p>a réalisé un audit de conformité AI Act<br>et obtenu le score de</p>
      <div class="cert-score">${score}%</div>
      <div class="cert-id">N° ${certId}</div>
      <p>Audit réalisé le ${reportDate}</p>
      <div class="validity">✓ Valable jusqu'au ${new Date(Date.now() + 365*24*60*60*1000).toLocaleDateString('fr-FR')}</div>
    </div>
  </div>

  <div class="footer">
    <p>Ce rapport a été généré par Formation-IA-Act.fr<br>© ${new Date().getFullYear()} - Tous droits réservés</p>
  </div>
</body>
</html>
  `;
}

export async function POST(request: NextRequest) {
  try {
    const results: AuditResults = await request.json();
    const html = generateHTML(results);
    return new NextResponse(html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
  } catch (error) {
    console.error('Error generating report:', error);
    return NextResponse.json({ error: 'Erreur lors de la génération du rapport' }, { status: 500 });
  }
}
