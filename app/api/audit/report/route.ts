import { NextRequest, NextResponse } from 'next/server';

// Types
interface AuditResults {
  score: number;
  plan: 'solo' | 'pro' | 'enterprise';
  profile: {
    name: string;
    sector: string;
    size: string;
    hasMultipleSites: boolean;
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

// Category names mapping
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

// Sector names
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
  other: 'Autre secteur',
};

// Size names
const sizeNames: Record<string, string> = {
  tpe: 'TPE (< 10 salariés)',
  pme: 'PME (10-249 salariés)',
  eti: 'ETI (250-4999 salariés)',
  ge: 'Grande Entreprise (5000+)',
};

// Generate recommendations based on scores
function generateRecommendations(categoryScores: any[], highRiskFlags: string[]) {
  const recommendations: { priority: string; text: string; category: string; aiActRef?: string; details?: string }[] = [];

  if (highRiskFlags.length > 0) {
    recommendations.push({
      priority: 'critical',
      text: 'Réaliser une Analyse d\'Impact sur les Droits Fondamentaux (FRIA)',
      category: 'classification',
      aiActRef: 'Article 27',
      details: 'Une FRIA est obligatoire avant le déploiement de tout système IA à haut risque. Elle doit évaluer l\'impact sur la dignité humaine, la vie privée, la non-discrimination et autres droits fondamentaux.'
    });
  }

  categoryScores.forEach(cat => {
    if (cat.category === 'inventory' && cat.score < 70) {
      recommendations.push({
        priority: cat.score < 40 ? 'critical' : 'high',
        text: 'Compléter l\'inventaire des systèmes IA',
        category: 'inventory',
        aiActRef: 'Article 49',
        details: 'Établir un registre exhaustif de tous les systèmes IA utilisés, incluant leur finalité, les données traitées, le niveau de risque et le responsable désigné.'
      });
    }
    if (cat.category === 'classification' && cat.score < 70) {
      recommendations.push({
        priority: cat.score < 40 ? 'critical' : 'high',
        text: 'Classifier les systèmes par niveau de risque AI Act',
        category: 'classification',
        aiActRef: 'Article 6, Annexe III',
        details: 'Chaque système IA doit être classé selon les 4 niveaux de risque : Inacceptable (interdit), Élevé (obligations strictes), Limité (transparence), Minimal (libre).'
      });
    }
    if (cat.category === 'governance' && cat.score < 70) {
      recommendations.push({
        priority: cat.score < 40 ? 'high' : 'medium',
        text: 'Formaliser la gouvernance IA',
        category: 'governance',
        details: 'Désigner un Référent IA, créer un comité de gouvernance, et rédiger une politique d\'utilisation de l\'IA.'
      });
    }
    if (cat.category === 'training' && cat.score < 70) {
      recommendations.push({
        priority: 'critical',
        text: 'Former les collaborateurs (obligation Article 4)',
        category: 'training',
        aiActRef: 'Article 4',
        details: 'L\'Article 4 impose une "maîtrise suffisante de l\'IA" pour tous les utilisateurs. Cette obligation est en vigueur depuis février 2025.'
      });
    }
    if (cat.category === 'documentation' && cat.score < 70) {
      recommendations.push({
        priority: cat.score < 40 ? 'critical' : 'high',
        text: 'Compléter la documentation technique',
        category: 'documentation',
        aiActRef: 'Article 11, Annexe IV',
        details: 'Les systèmes à haut risque doivent avoir une documentation technique complète incluant architecture, données d\'entraînement, tests de performance et analyse des biais.'
      });
    }
    if (cat.category === 'transparency' && cat.score < 70) {
      recommendations.push({
        priority: cat.score < 40 ? 'high' : 'medium',
        text: 'Informer les utilisateurs de l\'utilisation de l\'IA',
        category: 'transparency',
        aiActRef: 'Article 50',
        details: 'Les utilisateurs doivent être informés lorsqu\'ils interagissent avec une IA, notamment pour les chatbots et les contenus générés par IA.'
      });
    }
  });

  return recommendations.sort((a, b) => {
    const order = { critical: 0, high: 1, medium: 2, low: 3 };
    return (order[a.priority as keyof typeof order] || 3) - (order[b.priority as keyof typeof order] || 3);
  });
}

// Generate action plan
function generateActionPlan(score: number, plan: string) {
  const actions = [
    { 
      month: 1, 
      title: 'Phase 1 : Inventaire et Classification', 
      tasks: [
        'Recenser exhaustivement tous les systèmes IA',
        'Documenter chaque système (usage, responsable, données)',
        'Classifier selon les 4 niveaux de risque AI Act',
        'Identifier les systèmes potentiellement haut risque'
      ],
      kpi: 'Registre IA complété à 100%',
      budget: '2-5k€'
    },
    { 
      month: 2, 
      title: 'Phase 2 : Gouvernance', 
      tasks: [
        'Nommer officiellement un Référent IA',
        'Constituer le comité de gouvernance IA',
        'Rédiger la politique d\'utilisation IA',
        'Définir le processus de validation'
      ],
      kpi: 'Politique IA validée et diffusée',
      budget: '3-8k€'
    },
    { 
      month: 3, 
      title: 'Phase 3 : Formation Article 4', 
      tasks: [
        'Cartographier les besoins de formation par profil',
        'Sélectionner les formations adaptées',
        'Déployer le plan de formation',
        'Documenter les attestations'
      ],
      kpi: '100% des utilisateurs IA formés',
      budget: '5-15k€'
    },
    { 
      month: 4, 
      title: 'Phase 4 : Documentation', 
      tasks: [
        'Collecter la documentation technique fournisseurs',
        'Vérifier les logs et la traçabilité',
        'Documenter les analyses de biais',
        'Préparer les FRIA si nécessaire'
      ],
      kpi: 'Documentation complète systèmes HR',
      budget: '5-10k€'
    },
    { 
      month: 5, 
      title: 'Phase 5 : Transparence', 
      tasks: [
        'Mettre à jour CGU et mentions légales',
        'Identifier les chatbots/assistants',
        'Implémenter le marquage contenu IA',
        'Créer les notices d\'information'
      ],
      kpi: 'Toutes les IA identifiées aux utilisateurs',
      budget: '2-5k€'
    },
    { 
      month: 6, 
      title: 'Phase 6 : Audit et consolidation', 
      tasks: [
        'Réaliser un audit interne complet',
        'Corriger les écarts identifiés',
        'Mettre à jour la documentation',
        'Préparer le reporting Direction'
      ],
      kpi: 'Score conformité > 80%',
      budget: '5-10k€'
    },
  ];

  if (plan === 'enterprise') {
    actions.push(
      { month: 7, title: 'Phase 7 : Fournisseurs', tasks: ['Auditer les fournisseurs IA', 'Mettre à jour les contrats', 'Obtenir les déclarations de conformité', 'Négocier les clauses AI Act'], kpi: 'Tous contrats à jour', budget: '5-15k€' },
      { month: 8, title: 'Phase 8 : Multi-sites', tasks: ['Harmoniser les pratiques entre sites', 'Consolider le registre groupe', 'Former les correspondants locaux', 'Déployer les outils communs'], kpi: 'Gouvernance groupe unifiée', budget: '10-30k€' },
      { month: 9, title: 'Phase 9 : Droits fondamentaux', tasks: ['Réaliser les FRIA complètes', 'Consulter les parties prenantes', 'Documenter les mesures d\'atténuation', 'Valider avec le DPO'], kpi: 'FRIA validées pour tous les HR', budget: '10-20k€' },
      { month: 10, title: 'Phase 10 : Optimisation', tasks: ['Automatiser le suivi conformité', 'Mettre en place les alertes', 'Optimiser les processus', 'Préparer l\'audit externe'], kpi: 'Dashboard de suivi opérationnel', budget: '5-15k€' },
      { month: 11, title: 'Phase 11 : Benchmark', tasks: ['Comparer aux standards sectoriels', 'Identifier les best practices', 'Ajuster la roadmap', 'Préparer la communication'], kpi: 'Positionnement sectoriel clair', budget: '5-10k€' },
      { month: 12, title: 'Phase 12 : Certification', tasks: ['Audit de certification externe', 'Correction des non-conformités', 'Obtention du certificat', 'Communication interne/externe'], kpi: 'Certification obtenue', budget: '15-30k€' }
    );
  }

  return actions;
}

// Generate HTML report (will be converted to PDF)
function generateHTMLReport(results: AuditResults) {
  const { score, plan, profile, categoryScores, highRiskFlags } = results;
  const recommendations = generateRecommendations(categoryScores, highRiskFlags);
  const actionPlan = generateActionPlan(score, plan);
  
  const getScoreColor = (s: number) => s >= 70 ? '#00FF88' : s >= 40 ? '#FFB800' : '#FF4444';
  const scoreColor = getScoreColor(score);
  
  const reportDate = new Date().toLocaleDateString('fr-FR', { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  });

  // Certificate ID
  const certificateId = `AACT-${Date.now().toString(36).toUpperCase()}`;

  let html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Rapport d'Audit AI Act - ${profile.name}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    
    * { margin: 0; padding: 0; box-sizing: border-box; }
    
    body {
      font-family: 'Inter', sans-serif;
      color: #1a1a2e;
      line-height: 1.6;
    }
    
    .page {
      width: 210mm;
      min-height: 297mm;
      padding: 20mm;
      margin: 0 auto;
      background: white;
      page-break-after: always;
    }
    
    .cover {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      min-height: calc(297mm - 40mm);
    }
    
    .cover-header {
      text-align: center;
      padding-top: 30mm;
    }
    
    .logo {
      font-size: 24px;
      font-weight: 700;
      color: #8B5CF6;
      margin-bottom: 40px;
    }
    
    .cover-title {
      font-size: 36px;
      font-weight: 700;
      margin-bottom: 10px;
      background: linear-gradient(90deg, #8B5CF6, #00F5FF);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    
    .cover-subtitle {
      font-size: 20px;
      color: #666;
      margin-bottom: 40px;
    }
    
    .cover-company {
      font-size: 28px;
      font-weight: 600;
      color: #1a1a2e;
      padding: 20px;
      border: 2px solid #8B5CF6;
      border-radius: 12px;
      display: inline-block;
    }
    
    .cover-score {
      text-align: center;
      padding: 30px;
      background: linear-gradient(135deg, #f8f9ff, #f0f4ff);
      border-radius: 20px;
      margin: 40px 0;
    }
    
    .score-value {
      font-size: 72px;
      font-weight: 700;
      color: ${scoreColor};
    }
    
    .score-label {
      font-size: 18px;
      color: #666;
    }
    
    .cover-footer {
      text-align: center;
      padding-top: 20px;
      border-top: 1px solid #eee;
    }
    
    .cover-date {
      color: #888;
      font-size: 14px;
    }
    
    .cover-plan {
      display: inline-block;
      padding: 8px 20px;
      background: ${plan === 'enterprise' ? '#FFB800' : plan === 'pro' ? '#8B5CF6' : '#00F5FF'};
      color: white;
      border-radius: 20px;
      font-weight: 600;
      margin-top: 10px;
    }
    
    h1 { font-size: 28px; color: #1a1a2e; margin-bottom: 20px; }
    h2 { font-size: 22px; color: #8B5CF6; margin: 30px 0 15px; border-bottom: 2px solid #8B5CF6; padding-bottom: 10px; }
    h3 { font-size: 18px; color: #1a1a2e; margin: 20px 0 10px; }
    
    p { margin-bottom: 12px; }
    
    .toc { margin: 30px 0; }
    .toc-item { 
      display: flex; 
      justify-content: space-between; 
      padding: 10px 0; 
      border-bottom: 1px dotted #ddd; 
    }
    .toc-item:hover { background: #f8f9ff; }
    
    .summary-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 15px;
      margin: 20px 0;
    }
    
    .summary-card {
      padding: 20px;
      background: #f8f9ff;
      border-radius: 12px;
      text-align: center;
    }
    
    .summary-value {
      font-size: 32px;
      font-weight: 700;
      color: #8B5CF6;
    }
    
    .summary-label {
      font-size: 12px;
      color: #666;
      margin-top: 5px;
    }
    
    .category-bar {
      display: flex;
      align-items: center;
      margin: 15px 0;
    }
    
    .category-icon { font-size: 24px; margin-right: 15px; }
    .category-name { flex: 1; font-weight: 500; }
    .category-score { font-weight: 700; width: 60px; text-align: right; }
    
    .bar-container {
      flex: 2;
      height: 12px;
      background: #eee;
      border-radius: 6px;
      margin: 0 15px;
      overflow: hidden;
    }
    
    .bar-fill {
      height: 100%;
      border-radius: 6px;
      transition: width 0.5s;
    }
    
    .recommendation {
      padding: 15px;
      border-left: 4px solid;
      margin: 15px 0;
      background: #f8f9ff;
      border-radius: 0 8px 8px 0;
    }
    
    .rec-critical { border-color: #FF4444; background: #fff5f5; }
    .rec-high { border-color: #FF6B00; background: #fff8f5; }
    .rec-medium { border-color: #FFB800; background: #fffbf0; }
    .rec-low { border-color: #00FF88; background: #f0fff5; }
    
    .rec-priority {
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      margin-bottom: 5px;
    }
    
    .rec-text { font-weight: 500; margin-bottom: 5px; }
    .rec-ref { font-size: 12px; color: #8B5CF6; }
    .rec-details { font-size: 13px; color: #666; margin-top: 8px; }
    
    .timeline {
      position: relative;
      padding-left: 30px;
    }
    
    .timeline::before {
      content: '';
      position: absolute;
      left: 10px;
      top: 0;
      bottom: 0;
      width: 2px;
      background: #ddd;
    }
    
    .timeline-item {
      position: relative;
      margin-bottom: 25px;
      padding: 15px;
      background: #f8f9ff;
      border-radius: 8px;
    }
    
    .timeline-item::before {
      content: '';
      position: absolute;
      left: -25px;
      top: 20px;
      width: 12px;
      height: 12px;
      background: #8B5CF6;
      border-radius: 50%;
    }
    
    .timeline-month {
      font-size: 12px;
      color: #8B5CF6;
      font-weight: 600;
    }
    
    .timeline-title {
      font-weight: 600;
      margin: 5px 0;
    }
    
    .timeline-tasks {
      font-size: 13px;
      color: #666;
      list-style: disc;
      padding-left: 20px;
    }
    
    .timeline-kpi {
      font-size: 12px;
      color: #00FF88;
      margin-top: 8px;
    }
    
    .alert-box {
      padding: 15px 20px;
      border-radius: 8px;
      margin: 20px 0;
    }
    
    .alert-warning {
      background: #fff8f0;
      border: 1px solid #FFB800;
    }
    
    .alert-danger {
      background: #fff5f5;
      border: 1px solid #FF4444;
    }
    
    .alert-info {
      background: #f0f8ff;
      border: 1px solid #00F5FF;
    }
    
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
    }
    
    th, td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid #eee;
    }
    
    th {
      background: #f8f9ff;
      font-weight: 600;
    }
    
    .footer {
      text-align: center;
      padding-top: 20px;
      margin-top: auto;
      border-top: 1px solid #eee;
      font-size: 12px;
      color: #888;
    }
    
    .certificate {
      border: 3px solid #00FF88;
      border-radius: 20px;
      padding: 40px;
      text-align: center;
      background: linear-gradient(135deg, #f0fff5, #f8fff8);
    }
    
    .cert-badge { font-size: 60px; margin-bottom: 20px; }
    .cert-title { font-size: 24px; font-weight: 700; color: #1a1a2e; }
    .cert-company { font-size: 28px; font-weight: 700; color: #8B5CF6; margin: 20px 0; }
    .cert-score { font-size: 48px; font-weight: 700; color: #00FF88; }
    .cert-id { font-family: monospace; color: #666; margin-top: 20px; }
    .cert-date { color: #888; margin-top: 10px; }
    .cert-validity { 
      display: inline-block;
      padding: 8px 20px;
      background: #00FF88;
      color: white;
      border-radius: 20px;
      font-weight: 600;
      margin-top: 20px;
    }
    
    @media print {
      .page { margin: 0; box-shadow: none; }
    }
  </style>
</head>
<body>
  <!-- COVER PAGE -->
  <div class="page">
    <div class="cover">
      <div class="cover-header">
        <div class="logo">🛡️ Formation-IA-Act.fr</div>
        <h1 class="cover-title">Rapport d'Audit AI Act</h1>
        <p class="cover-subtitle">Évaluation de conformité au Règlement européen sur l'IA</p>
        <div class="cover-company">${profile.name}</div>
        
        <div class="cover-score">
          <div class="score-value">${score}%</div>
          <div class="score-label">Score de conformité global</div>
        </div>
      </div>
      
      <div class="cover-footer">
        <p class="cover-date">Rapport généré le ${reportDate}</p>
        <div class="cover-plan">Audit ${plan.toUpperCase()}</div>
      </div>
    </div>
  </div>
  
  <!-- TABLE OF CONTENTS -->
  <div class="page">
    <h1>Sommaire</h1>
    <div class="toc">
      <div class="toc-item"><span>1. Executive Summary</span><span>3</span></div>
      <div class="toc-item"><span>2. Profil de l'organisation</span><span>4</span></div>
      <div class="toc-item"><span>3. Résultats par domaine</span><span>5</span></div>
      <div class="toc-item"><span>4. Recommandations prioritaires</span><span>8</span></div>
      <div class="toc-item"><span>5. Plan d'action</span><span>12</span></div>
      ${plan !== 'solo' ? '<div class="toc-item"><span>6. Estimation budgétaire</span><span>16</span></div>' : ''}
      ${plan === 'enterprise' ? '<div class="toc-item"><span>7. Benchmark sectoriel</span><span>18</span></div>' : ''}
      ${plan !== 'solo' ? '<div class="toc-item"><span>Annexe A : Glossaire AI Act</span><span>20</span></div>' : ''}
      ${plan !== 'solo' ? '<div class="toc-item"><span>Annexe B : Textes de référence</span><span>22</span></div>' : ''}
      ${plan !== 'solo' ? '<div class="toc-item"><span>Certificat d\'audit</span><span>24</span></div>' : ''}
    </div>
    
    <h2>À propos de ce rapport</h2>
    <p>
      Ce rapport présente les résultats de l'audit de conformité AI Act réalisé par ${profile.name}. 
      Il analyse ${results.totalQuestions} critères répartis en ${categoryScores.length} domaines clés 
      du Règlement européen sur l'Intelligence Artificielle (AI Act).
    </p>
    
    ${highRiskFlags.length > 0 ? `
    <div class="alert-box alert-danger">
      <strong>⚠️ Attention :</strong> ${highRiskFlags.length} système(s) à haut risque détecté(s). 
      Des obligations renforcées s'appliquent (documentation, FRIA, supervision humaine).
    </div>
    ` : ''}
  </div>
  
  <!-- EXECUTIVE SUMMARY -->
  <div class="page">
    <h1>1. Executive Summary</h1>
    
    <p>
      L'audit de conformité AI Act de <strong>${profile.name}</strong> 
      (${sectorNames[profile.sector] || profile.sector}, ${sizeNames[profile.size] || profile.size}) 
      révèle un score global de <strong style="color: ${scoreColor}">${score}%</strong>.
    </p>
    
    <div class="summary-grid">
      <div class="summary-card">
        <div class="summary-value">${score}%</div>
        <div class="summary-label">Score global</div>
      </div>
      <div class="summary-card">
        <div class="summary-value">${results.totalQuestions}</div>
        <div class="summary-label">Critères évalués</div>
      </div>
      <div class="summary-card">
        <div class="summary-value">${highRiskFlags.length}</div>
        <div class="summary-label">Systèmes haut risque</div>
      </div>
    </div>
    
    <h3>Points forts</h3>
    <ul>
      ${categoryScores.filter(c => c.score >= 70).map(c => `<li>${categoryNames[c.category] || c.category} : ${Math.round(c.score)}%</li>`).join('')}
      ${categoryScores.filter(c => c.score >= 70).length === 0 ? '<li>Aucun domaine ne dépasse le seuil de conformité (70%)</li>' : ''}
    </ul>
    
    <h3>Points d'amélioration prioritaires</h3>
    <ul>
      ${categoryScores.filter(c => c.score < 50).map(c => `<li><strong>${categoryNames[c.category] || c.category}</strong> : ${Math.round(c.score)}% - Action urgente requise</li>`).join('')}
      ${categoryScores.filter(c => c.score >= 50 && c.score < 70).map(c => `<li>${categoryNames[c.category] || c.category} : ${Math.round(c.score)}% - À améliorer</li>`).join('')}
    </ul>
    
    <div class="alert-box alert-warning">
      <strong>📅 Rappel des échéances AI Act :</strong><br>
      • <strong>Février 2025</strong> : Article 4 (Formation) en vigueur<br>
      • <strong>Août 2025</strong> : Interdictions (Article 5) en vigueur<br>
      • <strong>Août 2026</strong> : Obligations systèmes haut risque en vigueur
    </div>
  </div>
  
  <!-- ORGANIZATION PROFILE -->
  <div class="page">
    <h1>2. Profil de l'organisation</h1>
    
    <table>
      <tr><th>Critère</th><th>Valeur</th></tr>
      <tr><td>Raison sociale</td><td><strong>${profile.name}</strong></td></tr>
      <tr><td>Secteur d'activité</td><td>${sectorNames[profile.sector] || profile.sector}</td></tr>
      <tr><td>Taille</td><td>${sizeNames[profile.size] || profile.size}</td></tr>
      <tr><td>Structure</td><td>${profile.hasMultipleSites ? 'Multi-sites / Groupe' : 'Site unique'}</td></tr>
      <tr><td>Date de l'audit</td><td>${reportDate}</td></tr>
      <tr><td>Type d'audit</td><td>Audit ${plan.toUpperCase()}</td></tr>
      <tr><td>Référence</td><td>${certificateId}</td></tr>
    </table>
    
    ${highRiskFlags.length > 0 ? `
    <h3>Systèmes à haut risque identifiés</h3>
    <div class="alert-box alert-danger">
      <p><strong>${highRiskFlags.length} système(s) potentiellement à haut risque</strong> ont été identifiés lors de l'audit :</p>
      <ul>
        ${highRiskFlags.map(f => `<li>${f}</li>`).join('')}
      </ul>
      <p>Ces systèmes sont soumis aux obligations renforcées de l'AI Act (documentation technique, FRIA, supervision humaine, etc.).</p>
    </div>
    ` : ''}
  </div>
  
  <!-- RESULTS BY DOMAIN -->
  <div class="page">
    <h1>3. Résultats par domaine</h1>
    
    <p>Analyse détaillée des ${categoryScores.length} domaines de conformité évalués :</p>
    
    ${categoryScores.map(cat => `
    <div class="category-bar">
      <span class="category-icon">${cat.icon}</span>
      <span class="category-name">${categoryNames[cat.category] || cat.category}</span>
      <div class="bar-container">
        <div class="bar-fill" style="width: ${cat.score}%; background: ${cat.color}"></div>
      </div>
      <span class="category-score" style="color: ${cat.color}">${Math.round(cat.score)}%</span>
    </div>
    `).join('')}
  </div>
  
  <!-- RECOMMENDATIONS -->
  <div class="page">
    <h1>4. Recommandations prioritaires</h1>
    
    <p>Les recommandations ci-dessous sont classées par ordre de priorité, des plus urgentes aux moins critiques.</p>
    
    ${recommendations.slice(0, plan === 'enterprise' ? 15 : plan === 'pro' ? 10 : 5).map(rec => `
    <div class="recommendation rec-${rec.priority}">
      <div class="rec-priority" style="color: ${rec.priority === 'critical' ? '#FF4444' : rec.priority === 'high' ? '#FF6B00' : rec.priority === 'medium' ? '#FFB800' : '#00FF88'}">
        ${rec.priority === 'critical' ? '🔴 CRITIQUE' : rec.priority === 'high' ? '🟠 HAUTE' : rec.priority === 'medium' ? '🟡 MOYENNE' : '🟢 BASSE'}
      </div>
      <div class="rec-text">${rec.text}</div>
      ${rec.aiActRef ? `<div class="rec-ref">📖 Référence : ${rec.aiActRef}</div>` : ''}
      ${plan !== 'solo' && rec.details ? `<div class="rec-details">${rec.details}</div>` : ''}
    </div>
    `).join('')}
  </div>
  
  <!-- ACTION PLAN -->
  <div class="page">
    <h1>5. Plan d'action</h1>
    
    <p>Plan de mise en conformité sur ${plan === 'enterprise' ? '12' : '6'} mois :</p>
    
    <div class="timeline">
      ${actionPlan.slice(0, plan === 'enterprise' ? 12 : 6).map(action => `
      <div class="timeline-item">
        <div class="timeline-month">Mois ${action.month}</div>
        <div class="timeline-title">${action.title}</div>
        <ul class="timeline-tasks">
          ${action.tasks.map(t => `<li>${t}</li>`).join('')}
        </ul>
        ${plan !== 'solo' ? `<div class="timeline-kpi">🎯 KPI : ${action.kpi}</div>` : ''}
        ${plan !== 'solo' ? `<div style="font-size: 12px; color: #8B5CF6; margin-top: 5px;">💰 Budget estimé : ${action.budget}</div>` : ''}
      </div>
      `).join('')}
    </div>
  </div>
`;

  // Add certificate page for Pro/Enterprise
  if (plan !== 'solo') {
    html += `
  <!-- CERTIFICATE -->
  <div class="page">
    <div class="certificate">
      <div class="cert-badge">🏅</div>
      <div class="cert-title">CERTIFICAT D'AUDIT AI ACT</div>
      <p style="color: #666; margin: 15px 0;">Atteste que</p>
      <div class="cert-company">${profile.name}</div>
      <p style="color: #666; margin: 15px 0;">a réalisé un audit de conformité AI Act<br>et obtenu le score de</p>
      <div class="cert-score">${score}%</div>
      <div class="cert-id">N° ${certificateId}</div>
      <div class="cert-date">Audit réalisé le ${reportDate}</div>
      <div class="cert-validity">Valable jusqu'au ${new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString('fr-FR')}</div>
    </div>
  </div>
`;
  }

  html += `
</body>
</html>
`;

  return html;
}

export async function POST(request: NextRequest) {
  try {
    const results: AuditResults = await request.json();
    
    // Validate input
    if (!results || !results.plan || typeof results.score !== 'number') {
      return NextResponse.json({ error: 'Invalid audit results' }, { status: 400 });
    }

    // Generate HTML report
    const htmlReport = generateHTMLReport(results);
    
    // In production, you would convert HTML to PDF using puppeteer, wkhtmltopdf, or a service
    // For now, we return the HTML that can be printed to PDF in the browser
    
    return new NextResponse(htmlReport, {
      headers: {
        'Content-Type': 'text/html',
        'Content-Disposition': `attachment; filename="rapport-audit-ai-act-${results.profile.name.toLowerCase().replace(/\s+/g, '-')}.html"`,
      },
    });
    
  } catch (error) {
    console.error('Error generating report:', error);
    return NextResponse.json({ error: 'Failed to generate report' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  // Return sample report info
  return NextResponse.json({
    available: true,
    plans: {
      solo: { pages: '15', features: ['Score global', 'Recommandations générales', 'Plan 6 mois'] },
      pro: { pages: '40-50', features: ['Executive Summary', 'Graphiques', 'Citations AI Act', 'Plan 12 mois', 'Budget estimé', 'Certificat'] },
      enterprise: { pages: '80-100', features: ['Tout Pro +', 'Analyse juridique', 'Benchmark sectoriel', 'FRIA', 'ROI', 'Dashboard'] },
    }
  });
}
