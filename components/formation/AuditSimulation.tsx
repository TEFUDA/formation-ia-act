'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ============================================
// TYPES
// ============================================
interface Document {
  id: string;
  name: string;
  description: string;
  category: 'registre' | 'technique' | 'gouvernance' | 'formation' | 'incident' | 'communication' | 'fournisseur';
  icon: string;
  isReady: boolean;
  quality: number;
  aiActReference?: string;
  criticalFor?: string[];
  location?: string; // Pour le mini-jeu de recherche
}

interface Character {
  id: string;
  name: string;
  role: string;
  avatar: string;
  description: string;
  personality: string;
  defaultMood: string;
  relationship: number; // -100 à 100
}

interface GameStats {
  trust: number;
  stress: number;
  evidence: number;
  time: number;
  reputation: number;
  documentsPresented: string[];
  criticalMistakes: number;
  perfectAnswers: number;
  gameOvers: number;
  miniGamesCompleted: number;
  bonusDialogues: number;
}

interface DialogChoice {
  id: string;
  text: string;
  shortText?: string;
  requiresDocument?: string;
  requiresMultipleDocs?: string[];
  minTrust?: number;
  minEvidence?: number;
  effect: {
    trust?: number;
    stress?: number;
    evidence?: number;
    reputation?: number;
    time?: number;
    relationship?: { [characterId: string]: number };
  };
  nextNode: string;
  isOptimal?: boolean;
  isRisky?: boolean;
  isCriticalMistake?: boolean;
  isGameOver?: boolean;
  aiActArticle?: string;
  feedback?: string;
  unlocksBonusDialogue?: string;
}

interface DialogNode {
  id: string;
  phase: string;
  speaker: 'auditor' | 'player' | 'system' | 'dg' | 'dsi' | 'drh' | 'rh' | 'colleague' | 'phone' | 'legal' | 'narrator' | 'internal' | 'intern' | 'vendor';
  speakerName?: string;
  text: string;
  mood?: string;
  choices?: DialogChoice[];
  autoNext?: string;
  delay?: number;
  effect?: {
    trust?: number;
    stress?: number;
    evidence?: number;
    time?: number;
    reputation?: number;
  };
  tip?: string;
  aiActReference?: string;
  isCheckpoint?: boolean;
  triggerEvent?: string;
  triggerMiniGame?: string;
  requiresPreviousChoice?: string;
  requiresMinTrust?: number;
  requiresMaxStress?: number;
  isBonusDialogue?: boolean;
  backgroundChange?: string;
}

interface RandomEvent {
  id: string;
  phase: string[];
  type: 'phone' | 'email' | 'visitor' | 'technical' | 'emergency' | 'opportunity' | 'flashback' | 'internal_thought';
  priority: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  icon: string;
  sender?: string;
  message: string;
  consequence?: string;
  choices: {
    id: string;
    text: string;
    effect: { trust?: number; stress?: number; time?: number; evidence?: number; reputation?: number };
    outcome: string;
    isOptimal?: boolean;
    isGameOver?: boolean;
  }[];
}

interface MiniGame {
  id: string;
  type: 'document_search' | 'quick_answer' | 'priority_sort' | 'risk_classification' | 'memory_test' | 'negotiation';
  title: string;
  description: string;
  context: string;
  timeLimit: number;
  data: any;
  reward: { evidence?: number; trust?: number; stress?: number; time?: number; reputation?: number };
  penalty: { evidence?: number; trust?: number; stress?: number; time?: number; reputation?: number };
}

interface GameOver {
  id: string;
  title: string;
  description: string;
  icon: string;
  canRetry: boolean;
  retryFromNode?: string;
}

// ============================================
// GAME OVERS
// ============================================
const GAME_OVERS: GameOver[] = [
  {
    id: 'trust_zero',
    title: "Confiance perdue",
    description: "L'auditrice a complètement perdu confiance en vous. Elle met fin à l'audit et recommande une inspection approfondie avec saisie de documents.",
    icon: '💔',
    canRetry: true,
    retryFromNode: 'accueil_start'
  },
  {
    id: 'stress_max',
    title: "Crise de panique",
    description: "Le stress vous submerge. Vous devez quitter la salle pour reprendre vos esprits. Votre crédibilité est sévèrement entamée.",
    icon: '😰',
    canRetry: true,
    retryFromNode: 'doc_classification'
  },
  {
    id: 'critical_lie',
    title: "Mensonge découvert",
    description: "L'auditrice a découvert que vous avez falsifié des documents. L'audit se transforme en enquête pénale.",
    icon: '🚨',
    canRetry: false
  },
  {
    id: 'time_out',
    title: "Temps écoulé",
    description: "L'audit s'est prolongé au-delà du temps acceptable. L'auditrice note une 'obstruction passive' dans son rapport.",
    icon: '⏰',
    canRetry: true,
    retryFromNode: 'entretiens_start'
  },
  {
    id: 'dg_fired',
    title: "Licenciement immédiat",
    description: "Le DG, furieux de votre gestion catastrophique, vous demande de quitter l'entreprise sur-le-champ.",
    icon: '📦',
    canRetry: false
  }
];

// ============================================
// CHARACTERS (Enrichis)
// ============================================
const CHARACTERS: Character[] = [
  { 
    id: 'auditor', 
    name: 'Marie Durand', 
    role: 'Auditrice Senior - Commission Nationale IA', 
    avatar: '👩‍💼', 
    description: "15 ans d'expérience en audit de conformité. Réputée pour sa rigueur mais son équité.",
    personality: "Professionnelle, directe, mais apprécie la transparence",
    defaultMood: 'neutral',
    relationship: 0
  },
  { 
    id: 'dg', 
    name: 'Philippe Martin', 
    role: 'Directeur Général', 
    avatar: '👨‍💼',
    description: "DG depuis 8 ans. Focalisé sur les résultats mais conscient des enjeux réglementaires.",
    personality: "Autoritaire, impatient, mais protecteur envers ses équipes",
    defaultMood: 'worried',
    relationship: 50
  },
  { 
    id: 'dsi', 
    name: 'Thomas Leroy', 
    role: 'Directeur des Systèmes d\'Information', 
    avatar: '👨‍💻',
    description: "Expert technique, parfois réticent aux contraintes réglementaires.",
    personality: "Défensif sur son périmètre, mais compétent",
    defaultMood: 'stressed',
    relationship: 30
  },
  { 
    id: 'drh', 
    name: 'Sophie Bernard', 
    role: 'Directrice des Ressources Humaines', 
    avatar: '👩‍💼',
    description: "Très concernée par l'éthique et l'impact humain de l'IA.",
    personality: "Empathique, prudente, soucieuse des collaborateurs",
    defaultMood: 'worried',
    relationship: 60
  },
  { 
    id: 'colleague', 
    name: 'Lucas Petit', 
    role: 'Chef de projet IA', 
    avatar: '🧑‍💻',
    description: "Jeune talent, enthousiaste mais parfois imprudent.",
    personality: "Volontaire, transparent, parfois trop bavard",
    defaultMood: 'helpful',
    relationship: 70
  },
  { 
    id: 'legal', 
    name: 'Claire Moreau', 
    role: 'Directrice Juridique', 
    avatar: '👩‍⚖️',
    description: "Experte en droit du numérique, alliée précieuse.",
    personality: "Analytique, prudente, excellente négociatrice",
    defaultMood: 'neutral',
    relationship: 55
  },
  {
    id: 'vendor',
    name: 'Marc Dubois',
    role: 'Commercial - TechIA Solutions',
    avatar: '🧑‍💼',
    description: "Représentant de votre principal fournisseur IA.",
    personality: "Commercial, évasif sur les détails techniques",
    defaultMood: 'friendly',
    relationship: 40
  },
  {
    id: 'intern',
    name: 'Emma Laurent',
    role: 'Stagiaire Data',
    avatar: '👩‍🎓',
    description: "Stagiaire brillante qui connaît bien les systèmes.",
    personality: "Timide mais très compétente",
    defaultMood: 'stressed',
    relationship: 65
  }
];

// ============================================
// DOCUMENTS (Enrichis - 30+)
// ============================================
const INITIAL_DOCUMENTS: Document[] = [
  // REGISTRE & CARTOGRAPHIE
  { id: 'registre_ia', name: 'Registre des systèmes IA', description: 'Liste exhaustive de tous les systèmes IA déployés avec métadonnées', category: 'registre', icon: '📋', isReady: true, quality: 85, aiActReference: 'Article 29', criticalFor: ['accueil', 'documentation'], location: 'Serveur Conformité > Registres' },
  { id: 'cartographie', name: 'Cartographie des systèmes', description: 'Vue d\'ensemble par département et usage', category: 'registre', icon: '🗺️', isReady: true, quality: 75, criticalFor: ['documentation'], location: 'SharePoint > Gouvernance IA' },
  { id: 'classification_matrix', name: 'Matrice de classification des risques', description: 'Classification de chaque système selon l\'annexe III', category: 'registre', icon: '⚖️', isReady: false, quality: 0, aiActReference: 'Article 6 & Annexe III', criticalFor: ['documentation'], location: 'À créer' },
  { id: 'fiches_systemes', name: 'Fiches détaillées par système', description: '14 fiches avec specs techniques et usages', category: 'registre', icon: '📄', isReady: true, quality: 70, criticalFor: ['entretiens'], location: 'Wiki interne > Systèmes' },
  { id: 'inventaire_donnees', name: 'Inventaire des données utilisées', description: 'Sources, types et sensibilité des données', category: 'registre', icon: '🗃️', isReady: true, quality: 65, aiActReference: 'Article 10', criticalFor: ['documentation'], location: 'DPO > Registre traitements' },
  
  // DOCUMENTATION TECHNIQUE
  { id: 'doc_technique_rh', name: 'Documentation technique - IA RH', description: 'Specs fournisseur du système de recrutement', category: 'technique', icon: '📑', isReady: true, quality: 60, aiActReference: 'Article 13', criticalFor: ['documentation', 'entretiens'], location: 'Contrats fournisseurs > TechIA' },
  { id: 'doc_technique_credit', name: 'Documentation technique - Scoring crédit', description: 'Specs fournisseur du système de scoring', category: 'technique', icon: '📑', isReady: false, quality: 0, aiActReference: 'Article 13', criticalFor: ['documentation'], location: 'À demander au fournisseur' },
  { id: 'doc_technique_chatbot', name: 'Documentation technique - Chatbot', description: 'Architecture et fonctionnement du chatbot client', category: 'technique', icon: '🤖', isReady: true, quality: 70, criticalFor: ['entretiens'], location: 'DSI > Projets > Chatbot' },
  { id: 'aipd_rh', name: 'AIPD - Système RH', description: 'Analyse d\'impact sur les droits fondamentaux', category: 'technique', icon: '🔍', isReady: false, quality: 0, aiActReference: 'Article 27', criticalFor: ['documentation', 'entretiens'], location: 'À créer - URGENT' },
  { id: 'aipd_credit', name: 'AIPD - Scoring crédit', description: 'Analyse d\'impact droits fondamentaux crédit', category: 'technique', icon: '🔍', isReady: true, quality: 65, aiActReference: 'Article 27', criticalFor: ['documentation'], location: 'DPO > AIPD' },
  { id: 'tests_biais', name: 'Rapports de tests de biais', description: 'Audits trimestriels d\'équité algorithmique', category: 'technique', icon: '📊', isReady: true, quality: 80, aiActReference: 'Article 10', criticalFor: ['entretiens'], location: 'Data Science > Audits' },
  { id: 'logs_decisions', name: 'Logs des décisions IA', description: 'Historique traçable des décisions automatisées', category: 'technique', icon: '💾', isReady: true, quality: 55, aiActReference: 'Article 12', criticalFor: ['entretiens'], location: 'Serveur Logs > Export mensuel' },
  { id: 'metriques_performance', name: 'Métriques de performance', description: 'KPIs et indicateurs de qualité des modèles', category: 'technique', icon: '📈', isReady: true, quality: 70, criticalFor: ['entretiens'], location: 'Dashboard BI > IA' },
  { id: 'architecture_ia', name: 'Architecture technique IA', description: 'Schémas d\'architecture des systèmes', category: 'technique', icon: '🏗️', isReady: true, quality: 75, criticalFor: ['entretiens'], location: 'DSI > Architecture' },
  { id: 'code_audit', name: 'Rapport d\'audit de code', description: 'Revue de sécurité du code IA', category: 'technique', icon: '🔐', isReady: false, quality: 0, criticalFor: ['entretiens'], location: 'Sécurité > Audits' },
  
  // GOUVERNANCE
  { id: 'politique_ia', name: 'Politique d\'utilisation de l\'IA', description: 'Cadre de gouvernance validé par la direction', category: 'gouvernance', icon: '📜', isReady: true, quality: 90, aiActReference: 'Article 4', criticalFor: ['accueil', 'documentation'], location: 'Intranet > Politiques' },
  { id: 'charte_ethique', name: 'Charte éthique IA', description: 'Principes et valeurs pour l\'usage de l\'IA', category: 'gouvernance', icon: '⚡', isReady: true, quality: 85, criticalFor: ['documentation'], location: 'RSE > Éthique' },
  { id: 'procedures_supervision', name: 'Procédures de supervision humaine', description: 'Processus de contrôle humain des décisions IA', category: 'gouvernance', icon: '👁️', isReady: false, quality: 0, aiActReference: 'Article 14', criticalFor: ['entretiens'], location: 'À formaliser' },
  { id: 'organigramme_ia', name: 'Organigramme gouvernance IA', description: 'Rôles et responsabilités conformité', category: 'gouvernance', icon: '🏛️', isReady: true, quality: 75, criticalFor: ['accueil'], location: 'RH > Organisation' },
  { id: 'comite_ethique', name: 'PV Comité d\'éthique IA', description: 'Compte-rendus des réunions du comité', category: 'gouvernance', icon: '📝', isReady: true, quality: 60, criticalFor: ['documentation'], location: 'Comité IA > CR' },
  { id: 'lettre_mission', name: 'Lettre de mission DPO/IA', description: 'Nomination officielle du responsable', category: 'gouvernance', icon: '✉️', isReady: true, quality: 80, criticalFor: ['accueil'], location: 'DG > Nominations' },
  { id: 'delegation_pouvoir', name: 'Délégation de pouvoir IA', description: 'Autorité pour stopper des systèmes', category: 'gouvernance', icon: '🔑', isReady: true, quality: 70, criticalFor: ['accueil'], location: 'Juridique > Délégations' },
  
  // FORMATION
  { id: 'plan_formation', name: 'Plan de formation IA', description: 'Programme de montée en compétences', category: 'formation', icon: '🎓', isReady: true, quality: 70, aiActReference: 'Article 4', criticalFor: ['entretiens'], location: 'RH > Formation' },
  { id: 'attestations', name: 'Attestations de formation', description: 'Certificats des collaborateurs formés', category: 'formation', icon: '📜', isReady: true, quality: 65, criticalFor: ['entretiens'], location: 'RH > Certifications' },
  { id: 'quiz_conformite', name: 'Résultats quiz conformité', description: 'Scores des tests de connaissance interne', category: 'formation', icon: '✅', isReady: false, quality: 0, criticalFor: ['entretiens'], location: 'LMS > Rapports' },
  { id: 'supports_formation', name: 'Supports de formation IA', description: 'Présentations et exercices', category: 'formation', icon: '📚', isReady: true, quality: 75, criticalFor: ['entretiens'], location: 'RH > Formation > Supports' },
  
  // INCIDENTS
  { id: 'registre_incidents', name: 'Registre des incidents IA', description: 'Historique des dysfonctionnements', category: 'incident', icon: '🚨', isReady: false, quality: 0, aiActReference: 'Article 62', criticalFor: ['entretiens'], location: 'À créer' },
  { id: 'procedure_incident', name: 'Procédure de gestion d\'incident', description: 'Process de détection, notification, remédiation', category: 'incident', icon: '📋', isReady: true, quality: 50, aiActReference: 'Article 62', criticalFor: ['entretiens'], location: 'Qualité > Procédures' },
  { id: 'post_mortems', name: 'Analyses post-incident', description: 'Root cause analysis des incidents passés', category: 'incident', icon: '🔬', isReady: false, quality: 0, criticalFor: ['entretiens'], location: 'À créer' },
  { id: 'plan_continuite', name: 'Plan de continuité IA', description: 'Procédures de backup et reprise', category: 'incident', icon: '🔄', isReady: true, quality: 60, criticalFor: ['entretiens'], location: 'DSI > PCA' },
  
  // COMMUNICATION
  { id: 'mentions_legales', name: 'Mentions légales IA', description: 'Textes d\'information aux utilisateurs', category: 'communication', icon: '📢', isReady: true, quality: 80, aiActReference: 'Article 50', criticalFor: ['documentation'], location: 'Juridique > Mentions' },
  { id: 'consentements', name: 'Preuves de consentement', description: 'Logs des acceptations utilisateurs', category: 'communication', icon: '✍️', isReady: true, quality: 60, criticalFor: ['entretiens'], location: 'CRM > Consentements' },
  { id: 'faq_ia', name: 'FAQ IA pour les utilisateurs', description: 'Questions fréquentes sur nos systèmes IA', category: 'communication', icon: '❓', isReady: true, quality: 70, criticalFor: ['documentation'], location: 'Site web > FAQ' },
  { id: 'communication_interne', name: 'Communication interne IA', description: 'Notes de service et annonces', category: 'communication', icon: '📣', isReady: true, quality: 65, criticalFor: ['documentation'], location: 'Intranet > Actualités' },
  
  // FOURNISSEURS
  { id: 'contrats_fournisseurs', name: 'Contrats fournisseurs IA', description: 'Contrats avec clauses conformité', category: 'fournisseur', icon: '📃', isReady: true, quality: 70, aiActReference: 'Article 25', criticalFor: ['documentation'], location: 'Juridique > Contrats' },
  { id: 'certifications_fournisseurs', name: 'Certifications fournisseurs', description: 'ISO 27001, SOC2 des fournisseurs', category: 'fournisseur', icon: '🏅', isReady: true, quality: 75, criticalFor: ['documentation'], location: 'Achats > Qualif fournisseurs' },
  { id: 'sla_fournisseurs', name: 'SLA et engagements', description: 'Niveaux de service contractuels', category: 'fournisseur', icon: '⏱️', isReady: true, quality: 60, criticalFor: ['entretiens'], location: 'Juridique > SLA' },
  { id: 'audits_fournisseurs', name: 'Audits fournisseurs', description: 'Rapports d\'audit de nos fournisseurs IA', category: 'fournisseur', icon: '🔎', isReady: false, quality: 0, criticalFor: ['entretiens'], location: 'À demander' }
];

// ============================================
// MINI-GAMES
// ============================================
const MINI_GAMES: MiniGame[] = [
  {
    id: 'document_search_1',
    type: 'document_search',
    title: "🔍 Recherche urgente",
    description: "L'auditrice demande un document spécifique. Trouvez-le rapidement !",
    context: "\"Pouvez-vous me montrer votre analyse d'impact pour le système de recrutement ?\"",
    timeLimit: 30,
    data: {
      targetDocument: 'aipd_rh',
      decoys: ['aipd_credit', 'tests_biais', 'doc_technique_rh'],
      hint: "C'est l'AIPD spécifique au système RH"
    },
    reward: { trust: 10, stress: -5, time: 60 },
    penalty: { trust: -10, stress: 15, time: -60 }
  },
  {
    id: 'quick_answer_1',
    type: 'quick_answer',
    title: "⚡ Question flash",
    description: "Répondez rapidement à une série de questions de l'auditrice",
    context: "L'auditrice teste vos connaissances de base sur l'AI Act",
    timeLimit: 60,
    data: {
      questions: [
        { q: "Quel article définit les systèmes à haut risque ?", options: ["Article 6", "Article 14", "Article 50", "Article 27"], correct: 0 },
        { q: "Quelle annexe liste les domaines d'application haut risque ?", options: ["Annexe I", "Annexe II", "Annexe III", "Annexe IV"], correct: 2 },
        { q: "L'article 14 concerne :", options: ["La transparence", "La supervision humaine", "Les données", "Les sanctions"], correct: 1 },
        { q: "Quel est le délai de notification d'un incident grave ?", options: ["24h", "48h", "72h", "1 semaine"], correct: 2 },
        { q: "L'amende maximale peut atteindre :", options: ["10M€", "20M€", "35M€", "50M€"], correct: 2 }
      ]
    },
    reward: { evidence: 15, trust: 10 },
    penalty: { trust: -15, stress: 10 }
  },
  {
    id: 'risk_classification_1',
    type: 'risk_classification',
    title: "⚖️ Classification des risques",
    description: "Classifiez correctement ces systèmes IA selon l'AI Act",
    context: "L'auditrice vous teste sur votre compréhension de la classification",
    timeLimit: 90,
    data: {
      systems: [
        { name: "Chatbot FAQ site web", correctRisk: "minimal", explanation: "Simple assistance, pas de décision impactante" },
        { name: "Tri automatique de CV", correctRisk: "high", explanation: "Annexe III, point 4a - Emploi et recrutement" },
        { name: "Recommandation de produits e-commerce", correctRisk: "minimal", explanation: "Pas d'impact sur droits fondamentaux" },
        { name: "Scoring crédit bancaire", correctRisk: "high", explanation: "Annexe III, point 5b - Accès au crédit" },
        { name: "Maintenance prédictive machines", correctRisk: "minimal", explanation: "Usage industriel sans impact humain direct" },
        { name: "Analyse de CV pour matching emploi", correctRisk: "high", explanation: "Annexe III, point 4a - Même sans décision finale" }
      ],
      riskLevels: ["minimal", "limited", "high", "unacceptable"]
    },
    reward: { evidence: 20, trust: 15 },
    penalty: { evidence: -10, trust: -10 }
  },
  {
    id: 'priority_sort_1',
    type: 'priority_sort',
    title: "📊 Priorisation d'urgence",
    description: "Vous avez 5 minutes avant l'audit. Ordonnez vos priorités !",
    context: "Le temps presse, que faites-vous en premier ?",
    timeLimit: 45,
    data: {
      tasks: [
        { id: 1, name: "Finaliser l'AIPD manquante", correctOrder: 1 },
        { id: 2, name: "Prendre un café", correctOrder: 5 },
        { id: 3, name: "Briefer le DG", correctOrder: 2 },
        { id: 4, name: "Vérifier que la salle est prête", correctOrder: 3 },
        { id: 5, name: "Relire l'AI Act", correctOrder: 4 }
      ]
    },
    reward: { stress: -10, time: 120 },
    penalty: { stress: 15, time: -60 }
  },
  {
    id: 'memory_test_1',
    type: 'memory_test',
    title: "🧠 Test de mémoire",
    description: "L'auditrice vous a posé des questions. Rappelez-vous de vos réponses !",
    context: "Elle vérifie la cohérence de vos déclarations",
    timeLimit: 45,
    data: {
      questions: [
        { q: "Combien de systèmes IA avez-vous déclaré ?", userAnswer: "14", options: ["12", "14", "16", "18"] },
        { q: "Quel système est classé haut risque ?", userAnswer: "recrutement", options: ["chatbot", "recrutement", "maintenance", "tous"] },
        { q: "Qui est votre référent IA ?", userAnswer: "vous", options: ["le DSI", "vous", "le DPO", "personne"] }
      ]
    },
    reward: { trust: 15, evidence: 5 },
    penalty: { trust: -20, stress: 15 }
  },
  {
    id: 'negotiation_1',
    type: 'negotiation',
    title: "🤝 Négociation fournisseur",
    description: "Votre fournisseur refuse de donner la documentation. Négociez !",
    context: "Appel avec Marc Dubois de TechIA Solutions",
    timeLimit: 120,
    data: {
      vendorPosition: "Les spécifications détaillées sont couvertes par le secret commercial.",
      yourGoal: "Obtenir au minimum les informations requises par l'article 13 de l'AI Act",
      arguments: [
        { text: "L'AI Act nous oblige à avoir cette documentation", power: 3 },
        { text: "C'est mentionné dans notre contrat", power: 2 },
        { text: "On va devoir changer de fournisseur", power: 1 },
        { text: "On peut signer un NDA supplémentaire", power: 2 }
      ],
      vendorThreshold: 5
    },
    reward: { evidence: 25, trust: 10, reputation: 5 },
    penalty: { evidence: -15, trust: -5 }
  }
];

// ============================================
// RANDOM EVENTS (20+)
// ============================================
const RANDOM_EVENTS: RandomEvent[] = [
  // === PHASE NOTIFICATION ===
  {
    id: 'morning_coffee',
    phase: ['notification'],
    type: 'internal_thought',
    priority: 'low',
    title: '☕ Pensée du matin',
    icon: '💭',
    message: "*Vous regardez votre café* Un audit aujourd'hui... Respire. Tu t'es préparé pour ça. Ou pas ?",
    choices: [
      { id: 'a', text: "Rester calme, visualiser le succès", effect: { stress: -10 }, outcome: "Vous vous recentrez. Votre expérience vous guidera.", isOptimal: true },
      { id: 'b', text: "Paniquer intérieurement", effect: { stress: 15 }, outcome: "L'angoisse monte... Pas le meilleur état d'esprit." }
    ]
  },
  
  // === PHASE PREPARATION ===
  {
    id: 'dg_stress',
    phase: ['preparation'],
    type: 'phone',
    priority: 'high',
    title: 'Appel du DG',
    icon: '📱',
    sender: 'Philippe Martin (DG)',
    message: "Je viens d'apprendre pour l'audit. C'est une catastrophe si on échoue ! Qu'est-ce que je dois dire si l'auditrice veut me voir ? Je ne connais rien à l'IA !",
    consequence: "Le DG peut être un atout ou un problème pendant l'audit.",
    choices: [
      { id: 'a', text: "Je vous prépare un brief de 5 points clés. Restez factuel et renvoyez vers moi pour les détails.", effect: { stress: -5, trust: 5, reputation: 10, time: -60 }, outcome: "Le DG est rassuré. Vous gagnez sa confiance.", isOptimal: true },
      { id: 'b', text: "Ne vous inquiétez pas, je gère tout. Évitez de croiser l'auditrice.", effect: { stress: 5, reputation: -10 }, outcome: "Le DG n'aime pas être mis à l'écart..." },
      { id: 'c', text: "Honnêtement, on n'est pas prêts. Il faudrait reporter.", effect: { stress: 15, trust: -10, reputation: -15 }, outcome: "Le DG panique. Votre relation se dégrade sérieusement." }
    ]
  },
  {
    id: 'missing_doc',
    phase: ['preparation'],
    type: 'emergency',
    priority: 'critical',
    title: 'Document introuvable',
    icon: '🔥',
    message: "Lucas vous alerte : \"Je ne trouve plus le rapport d'audit des biais ! Il était sur le serveur mais quelqu'un l'a déplacé !\"",
    consequence: "Sans ce document, une partie de l'audit sera compromise.",
    choices: [
      { id: 'a', text: "Lancer une recherche organisée. Lucas, mobilise Emma aussi.", effect: { time: -90, stress: 10, evidence: 5 }, outcome: "Trouvé ! Dans un sous-dossier archivé. L'équipe est efficace.", isOptimal: true },
      { id: 'b', text: "On fera sans. Ce n'est qu'un document parmi d'autres.", effect: { evidence: -20, stress: 5 }, outcome: "Erreur. Ce document est critique pour démontrer l'absence de biais." },
      { id: 'c', text: "On peut le reconstituer rapidement à partir des données brutes.", effect: { time: -180, stress: 20, evidence: -10 }, outcome: "Perte de temps énorme et document incomplet." }
    ]
  },
  {
    id: 'dsi_conflict',
    phase: ['preparation', 'documentation'],
    type: 'visitor',
    priority: 'high',
    title: 'Tension avec le DSI',
    icon: '😤',
    sender: 'Thomas Leroy (DSI)',
    message: "Le DSI débarque : \"Je refuse que l'auditrice accède à nos serveurs ! C'est une question de sécurité. Nos systèmes sont confidentiels !\"",
    consequence: "Le DSI peut devenir un allié ou un obstacle.",
    choices: [
      { id: 'a', text: "Thomas, la loi nous oblige à coopérer. On peut limiter l'accès aux logs pertinents sans exposer l'infrastructure.", effect: { trust: 5, stress: 5, reputation: 5 }, outcome: "Le DSI accepte un compromis. Vous montrez votre diplomatie.", isOptimal: true },
      { id: 'b', text: "C'est un audit officiel, on n'a pas le choix. Préparez les accès.", effect: { trust: -5, stress: 10, reputation: -10 }, outcome: "Le DSI se braque. Il sera hostile pendant l'audit." },
      { id: 'c', text: "OK, on dira qu'on a des problèmes techniques.", effect: { trust: -25, evidence: -25, stress: 15 }, outcome: "DANGER. Si l'auditrice découvre le mensonge, c'est la catastrophe.", isGameOver: false }
    ]
  },
  {
    id: 'intern_help',
    phase: ['preparation'],
    type: 'opportunity',
    priority: 'medium',
    title: 'Aide inattendue',
    icon: '💡',
    sender: 'Emma Laurent (Stagiaire)',
    message: "Emma frappe timidement : \"Excusez-moi... J'ai fait un tableau récapitulatif de tous nos systèmes IA avec les articles de l'AI Act correspondants. Ça peut servir ?\"",
    consequence: "Une ressource inattendue pourrait vous sauver.",
    choices: [
      { id: 'a', text: "Emma, c'est exactement ce qu'il nous faut ! Peux-tu me le présenter rapidement ?", effect: { evidence: 15, stress: -10, time: -30 }, outcome: "Son tableau est excellent. Vous avez trouvé une alliée précieuse.", isOptimal: true },
      { id: 'b', text: "Merci Emma, mais je n'ai pas le temps de vérifier ton travail maintenant.", effect: { stress: 5 }, outcome: "Vous passez à côté d'une ressource utile. Emma est déçue." }
    ]
  },
  {
    id: 'legal_advice',
    phase: ['preparation'],
    type: 'visitor',
    priority: 'medium',
    title: 'Conseil juridique',
    icon: '⚖️',
    sender: 'Claire Moreau (Juridique)',
    message: "Claire passe la tête : \"J'ai préparé une fiche sur nos droits pendant l'audit. Tu veux qu'on en parle 5 minutes ?\"",
    choices: [
      { id: 'a', text: "Oui, c'est important. 5 minutes bien investies.", effect: { time: -60, stress: -10, evidence: 10 }, outcome: "Vous apprenez des subtilités utiles sur le cadre légal de l'audit.", isOptimal: true },
      { id: 'b', text: "Pas le temps Claire, envoie-moi ça par mail.", effect: { stress: 5 }, outcome: "Vous n'aurez pas le temps de lire avant l'audit." }
    ]
  },

  // === PHASE ACCUEIL ===
  {
    id: 'auditor_early',
    phase: ['accueil'],
    type: 'visitor',
    priority: 'high',
    title: 'Arrivée anticipée',
    icon: '⏰',
    message: "L'auditrice arrive avec 15 minutes d'avance. La salle n'est pas encore prête !",
    choices: [
      { id: 'a', text: "L'accueillir avec un café et proposer une visite des locaux", effect: { trust: 15, stress: 5 }, outcome: "Elle apprécie votre adaptabilité. Vous gagnez du temps subtilement.", isOptimal: true },
      { id: 'b', text: "La faire patienter à l'accueil en s'excusant", effect: { trust: -15, stress: 10 }, outcome: "Elle note 'Organisation défaillante' dans ses premières impressions." },
      { id: 'c', text: "L'installer dans la salle en désordre", effect: { trust: -20, stress: 15 }, outcome: "L'image d'amateurisme est immédiate." }
    ]
  },
  {
    id: 'phone_ring_meeting',
    phase: ['accueil', 'documentation', 'entretiens'],
    type: 'phone',
    priority: 'low',
    title: 'Téléphone qui sonne',
    icon: '📱',
    message: "Votre téléphone sonne en pleine discussion. Numéro inconnu.",
    choices: [
      { id: 'a', text: "Couper discrètement avec un regard d'excuse", effect: { stress: 2 }, outcome: "Professionnalisme noté.", isOptimal: true },
      { id: 'b', text: "Décrocher rapidement : \"Je rappelle\"", effect: { trust: -5, stress: 5 }, outcome: "L'auditrice lève un sourcil." },
      { id: 'c', text: "Laisser sonner", effect: { stress: 15 }, outcome: "La sonnerie persistante crée un malaise..." }
    ]
  },
  {
    id: 'coffee_break',
    phase: ['accueil', 'documentation'],
    type: 'opportunity',
    priority: 'low',
    title: 'Pause café',
    icon: '☕',
    message: "L'auditrice regarde sa montre : \"Une petite pause café ne serait pas de refus.\"",
    choices: [
      { id: 'a', text: "Bien sûr. *Pendant le café* Comment trouvez-vous notre secteur en général sur la conformité ?", effect: { trust: 10, stress: -10, time: -180 }, outcome: "Discussion informelle précieuse. Vous apprenez que votre secteur est plutôt en retard.", isOptimal: true },
      { id: 'b', text: "Bien sûr, je vous accompagne à la machine.", effect: { trust: 5, stress: -5, time: -120 }, outcome: "Pause cordiale mais sans plus." },
      { id: 'c', text: "On est un peu pressés, on peut continuer ?", effect: { trust: -10, stress: 10 }, outcome: "Elle fronce les sourcils. Même les auditeurs ont besoin de pauses." }
    ]
  },

  // === PHASE DOCUMENTATION ===
  {
    id: 'printer_jam',
    phase: ['documentation'],
    type: 'technical',
    priority: 'medium',
    title: 'Imprimante en panne',
    icon: '🖨️',
    message: "L'imprimante est bloquée au moment de sortir un document demandé !",
    choices: [
      { id: 'a', text: "Montrer sur écran en attendant qu'un collègue règle le problème", effect: { time: -30 }, outcome: "Solution pragmatique acceptée.", isOptimal: true },
      { id: 'b', text: "Courir à l'autre étage chercher une imprimante", effect: { time: -180, stress: 10 }, outcome: "Vous revenez essoufflé, 3 minutes plus tard..." },
      { id: 'c', text: "Dire que le document n'est pas disponible", effect: { trust: -20, evidence: -15 }, outcome: "L'auditrice note le document comme non fourni." }
    ]
  },
  {
    id: 'contradiction_found',
    phase: ['documentation'],
    type: 'emergency',
    priority: 'critical',
    title: 'Contradiction détectée',
    icon: '⚠️',
    message: "L'auditrice pointe : \"Votre registre indique 14 systèmes, mais votre cartographie n'en liste que 11. Expliquez-vous.\"",
    consequence: "Votre crédibilité est en jeu.",
    choices: [
      { id: 'a', text: "Vérifier immédiatement. *Consultation* Les 3 manquants sont en annexe 'Projets pilotes'. Je mets à jour la cartographie.", effect: { trust: 5, evidence: -5, stress: 10 }, outcome: "Votre honnêteté et réactivité sont appréciées malgré l'erreur.", isOptimal: true },
      { id: 'b', text: "Ce sont des systèmes en cours de décommissionnement.", effect: { trust: -15, evidence: -15 }, outcome: "Elle demande la preuve du décommissionnement... inexistante." },
      { id: 'c', text: "Erreur de saisie, le registre fait foi.", effect: { trust: -10, evidence: -10 }, outcome: "Elle note 'Documents non fiables'." }
    ]
  },
  {
    id: 'vendor_email',
    phase: ['documentation', 'entretiens'],
    type: 'email',
    priority: 'high',
    title: 'Email du fournisseur',
    icon: '📧',
    sender: 'Support TechIA Solutions',
    message: "\"Suite à votre demande, nous ne pouvons pas fournir les spécifications détaillées. Secret commercial.\"",
    consequence: "Un document clé vous échappe.",
    choices: [
      { id: 'a', text: "Montrer l'email à l'auditrice et expliquer votre procédure d'escalade engagée", effect: { trust: 15, stress: 5 }, outcome: "Votre transparence et proactivité sont saluées.", isOptimal: true },
      { id: 'b', text: "Cacher l'email et espérer qu'elle ne demande pas ce détail", effect: { trust: -20, stress: 25 }, outcome: "Risqué. Si elle découvre..." },
      { id: 'c', text: "Annoncer que vous changez de fournisseur", effect: { trust: -5, stress: 5, reputation: -5 }, outcome: "Réaction excessive notée." }
    ]
  },
  {
    id: 'good_surprise',
    phase: ['documentation'],
    type: 'opportunity',
    priority: 'medium',
    title: 'Bonne surprise',
    icon: '🎁',
    message: "En cherchant un document, vous tombez sur un rapport d'audit de biais que vous aviez oublié. Il est excellent !",
    choices: [
      { id: 'a', text: "Le présenter naturellement comme prévu", effect: { evidence: 15, trust: 10, stress: -5 }, outcome: "L'auditrice est impressionnée par la qualité du travail.", isOptimal: true },
      { id: 'b', text: "Le garder en réserve pour plus tard", effect: { stress: 5 }, outcome: "Pourquoi attendre ?" }
    ]
  },

  // === PHASE ENTRETIENS ===
  {
    id: 'rh_panic',
    phase: ['entretiens'],
    type: 'visitor',
    priority: 'high',
    title: 'La DRH panique',
    icon: '😰',
    sender: 'Sophie Bernard (DRH)',
    message: "La DRH vous prend à part : \"L'auditrice veut voir le système de recrutement en live ! Mais on rejette automatiquement les CV sans bac+5...\"",
    consequence: "Un critère de filtrage controversé va être exposé.",
    choices: [
      { id: 'a', text: "Être transparent. On explique le critère et on montre que l'humain valide chaque rejet.", effect: { trust: 10, stress: 15, evidence: 5 }, outcome: "L'auditrice apprécie l'honnêteté. Elle note le critère mais valide la supervision.", isOptimal: true },
      { id: 'b', text: "Désactiver le filtre le temps de la démo", effect: { trust: -40, evidence: -30, stress: 30 }, outcome: "CATASTROPHE. Elle vérifie les logs et voit la modification. Obstruction caractérisée.", isGameOver: true },
      { id: 'c', text: "Montrer une version démo, pas la prod", effect: { trust: -25, evidence: -20, stress: 25 }, outcome: "Elle demande l'accès à la vraie production." }
    ]
  },
  {
    id: 'bias_live',
    phase: ['entretiens'],
    type: 'emergency',
    priority: 'critical',
    title: 'Biais détecté en direct !',
    icon: '🚨',
    message: "Pendant la démo : \"Tiens, 3 CV de candidates féminines rejetés de suite. C'est normal ?\"",
    consequence: "Votre réponse déterminera si c'est un incident ou une catastrophe.",
    choices: [
      { id: 'a', text: "Vérifier immédiatement les scores détaillés et expliquer chaque rejet factuellement", effect: { trust: 10, stress: 15, evidence: 10 }, outcome: "Rejets basés sur l'expérience, pas le genre. Votre réactivité impressionne.", isOptimal: true },
      { id: 'b', text: "C'est une coïncidence statistique. Sur un échantillon plus large...", effect: { trust: -15, evidence: -15, stress: 15 }, outcome: "Elle demande les stats sur 6 mois. Vous les avez ?" },
      { id: 'c', text: "Le système n'a pas accès au genre, c'est impossible.", effect: { trust: -20, evidence: -20 }, outcome: "Elle vérifie : les prénoms sont visibles par le modèle..." }
    ]
  },
  {
    id: 'colleague_gaffe',
    phase: ['entretiens'],
    type: 'visitor',
    priority: 'high',
    title: 'Gaffe monumentale',
    icon: '🤦',
    sender: 'Lucas Petit',
    message: "Lucas lâche : \"Ah oui, ce système-là on ne l'a pas documenté, il est expérimental depuis 6 mois mais on l'utilise quand même en prod...\"",
    consequence: "Une bombe vient d'exploser.",
    choices: [
      { id: 'a', text: "Prendre le relais : \"Lucas fait référence à notre POC en qualification. Voici la roadmap de mise en conformité.\"", effect: { trust: -10, stress: 15, evidence: -10 }, outcome: "Vous rattrapez partiellement. L'auditrice note l'incohérence.", isOptimal: true },
      { id: 'b', text: "Foudroyer Lucas du regard et changer de sujet", effect: { trust: -25, evidence: -20, stress: 25 }, outcome: "L'auditrice a parfaitement compris ce qui vient de se passer." },
      { id: 'c', text: "Confirmer honnêtement et présenter un plan de remédiation", effect: { trust: -5, evidence: -15, stress: 10 }, outcome: "Au moins vous êtes honnête. Non-conformité flagrante notée." }
    ]
  },
  {
    id: 'system_crash_live',
    phase: ['entretiens'],
    type: 'technical',
    priority: 'critical',
    title: 'Crash en pleine démo',
    icon: '💥',
    message: "\"Erreur 500 - Service indisponible\". Le système vient de planter devant l'auditrice !",
    consequence: "Comment gérez-vous une crise en direct ?",
    choices: [
      { id: 'a', text: "Rester calme et transformer ça en démo de procédure d'incident : notification, bascule backup, log d'erreur", effect: { trust: 20, stress: 10, evidence: 15 }, outcome: "Brillant ! Vous transformez un problème en démonstration de maîtrise.", isOptimal: true },
      { id: 'b', text: "Redémarrer en urgence et s'excuser pour ce bug rare", effect: { trust: -10, stress: 20 }, outcome: "Elle demande l'historique des incidents. Combien de 'bugs rares' ?" },
      { id: 'c', text: "C'est la première fois que ça arrive !", effect: { trust: -20, stress: 30, evidence: -15 }, outcome: "Elle note : 'Gestion de crise déficiente'." }
    ]
  },
  {
    id: 'flashback_training',
    phase: ['entretiens'],
    type: 'flashback',
    priority: 'low',
    title: '💭 Flashback',
    icon: '🎓',
    message: "*Vous repensez à votre formation AI Act...* \"En cas de question piège, restez factuel et proposez toujours une preuve documentaire.\"",
    choices: [
      { id: 'a', text: "Se recentrer sur ce conseil", effect: { stress: -10, trust: 5 }, outcome: "Vous vous sentez plus confiant.", isOptimal: true }
    ]
  },

  // === PHASE CLOTURE ===
  {
    id: 'dg_intervention',
    phase: ['cloture'],
    type: 'visitor',
    priority: 'high',
    title: 'Le DG s\'impose',
    icon: '👔',
    sender: 'Philippe Martin (DG)',
    message: "Le DG entre pour la conclusion : \"Madame l'auditrice, notre entreprise place l'éthique au cœur de sa stratégie...\"",
    consequence: "Le DG peut aider ou tout gâcher.",
    choices: [
      { id: 'a', text: "Laisser terminer puis compléter avec les chiffres concrets", effect: { trust: 10, reputation: 10 }, outcome: "Le discours est crédibilisé par vos données.", isOptimal: true },
      { id: 'b', text: "Couper le DG : \"L'auditrice préfère les faits aux discours.\"", effect: { trust: 5, reputation: -15 }, outcome: "Elle apprécie, mais vous venez d'humilier votre DG..." },
      { id: 'c', text: "Laisser le DG monopoliser la parole", effect: { trust: -15, time: -180 }, outcome: "L'auditrice s'impatiente visiblement." }
    ]
  },
  {
    id: 'last_chance',
    phase: ['cloture'],
    type: 'opportunity',
    priority: 'high',
    title: 'Dernière chance',
    icon: '🎯',
    message: "\"Avant de conclure, y a-t-il un élément que vous souhaitez ajouter ?\"",
    consequence: "C'est maintenant ou jamais.",
    choices: [
      { id: 'a', text: "Présenter la roadmap conformité 2025 avec investissements et jalons", effect: { trust: 15, evidence: 15 }, outcome: "Vous finissez sur une note proactive. L'auditrice apprécie.", isOptimal: true },
      { id: 'b', text: "Je pense que nous avons couvert l'essentiel.", effect: {}, outcome: "Neutre. Ni gain ni perte." },
      { id: 'c', text: "Contester plusieurs de ses observations", effect: { trust: -25, stress: 15 }, outcome: "Elle se ferme. Contester son autorité en fin d'audit est très mal perçu." }
    ]
  },
  {
    id: 'personal_note',
    phase: ['cloture'],
    type: 'opportunity',
    priority: 'low',
    title: 'Note personnelle',
    icon: '💬',
    sender: 'Marie Durand (Auditrice)',
    message: "*En rangeant ses affaires* \"Entre nous, votre approche est plutôt bonne comparée à ce que je vois ailleurs. Continuez comme ça.\"",
    choices: [
      { id: 'a', text: "Merci, c'est encourageant. On peut toujours faire mieux.", effect: { trust: 5, reputation: 10, stress: -15 }, outcome: "Elle sourit. Vous avez marqué des points.", isOptimal: true },
      { id: 'b', text: "Alors on aura une bonne note ?", effect: { trust: -10 }, outcome: "Elle redevient formelle. Trop direct." }
    ]
  }
];

// Suite dans la partie 2...

// ============================================
// AUDIT PHASES
// ============================================
const AUDIT_PHASES = [
  { id: 'notification', name: 'Notification', description: 'Réception de l\'avis d\'audit', icon: '📬', duration: 180, color: '#8B5CF6' },
  { id: 'preparation', name: 'Préparation', description: 'Organisation et collecte des documents', icon: '📋', duration: 420, color: '#00F5FF' },
  { id: 'accueil', name: 'Accueil', description: 'Arrivée de l\'auditrice et cadrage', icon: '🤝', duration: 600, color: '#00FF88' },
  { id: 'documentation', name: 'Revue Documentaire', description: 'Examen des dossiers de conformité', icon: '📁', duration: 900, color: '#FFB800' },
  { id: 'entretiens', name: 'Entretiens', description: 'Questions approfondies et démonstrations', icon: '💬', duration: 900, color: '#FF6B6B' },
  { id: 'cloture', name: 'Clôture', description: 'Synthèse et annonce du verdict', icon: '⚖️', duration: 300, color: '#10B981' }
];

// ============================================
// MASSIVE DIALOGUE SCENARIO (120+ nodes)
// ============================================
const DIALOGUE_SCENARIO: DialogNode[] = [
  // ========================================
  // PHASE 1: NOTIFICATION (10 nodes)
  // ========================================
  {
    id: 'game_start',
    phase: 'notification',
    speaker: 'narrator',
    text: "📅 LUNDI MATIN, 9H00\n\nVous arrivez au bureau avec votre café habituel. La journée s'annonce normale... jusqu'à ce que votre téléphone vibre.",
    autoNext: 'notif_email_arrive',
    delay: 3000,
    backgroundChange: 'office_morning'
  },
  {
    id: 'notif_email_arrive',
    phase: 'notification',
    speaker: 'system',
    text: "📧 NOUVEAU MESSAGE - Priorité : HAUTE\n\nDe : Commission Nationale de l'Intelligence Artificielle\nObjet : NOTIFICATION D'AUDIT DE CONFORMITÉ - URGENT",
    autoNext: 'notif_email_content',
    delay: 2000,
    effect: { stress: 10 }
  },
  {
    id: 'notif_email_content',
    phase: 'notification',
    speaker: 'system',
    text: "\"Madame, Monsieur,\n\nConformément à l'article 74 du Règlement (UE) 2024/1689 relatif à l'intelligence artificielle (AI Act), nous vous informons qu'un contrôle de conformité de vos systèmes d'IA sera effectué CE JOUR à 14h00.\n\nL'auditrice désignée est Mme Marie Durand, Senior Auditor.\n\nMerci de préparer l'ensemble des documents relatifs à vos systèmes IA.\n\nCordialement,\nCommission Nationale de l'IA\"",
    autoNext: 'notif_reaction',
    delay: 5000,
    effect: { stress: 20 }
  },
  {
    id: 'notif_reaction',
    phase: 'notification',
    speaker: 'internal',
    text: "*Votre cœur s'accélère. Un audit aujourd'hui ?! Vous avez 5 heures pour vous préparer. Respire. Réfléchis.*",
    autoNext: 'notif_first_choice',
    delay: 2500
  },
  {
    id: 'notif_first_choice',
    phase: 'notification',
    speaker: 'player',
    text: "",
    tip: "Votre première réaction donnera le ton pour la suite. La gestion de crise commence maintenant.",
    choices: [
      { 
        id: 'a', 
        text: "Garder son calme. Convoquer immédiatement une réunion de crise avec DSI, DRH, Juridique et l'équipe IA.", 
        shortText: "Je convoque une réunion de crise immédiate",
        effect: { stress: -15, trust: 5, reputation: 10 }, 
        nextNode: 'notif_crisis_meeting',
        isOptimal: true 
      },
      { 
        id: 'b', 
        text: "Foncer tête baissée pour rassembler tous les documents disponibles.", 
        shortText: "Je fonce rassembler les documents seul",
        effect: { stress: 15, time: -120, evidence: 5 }, 
        nextNode: 'notif_solo_action'
      },
      { 
        id: 'c', 
        text: "Appeler le DG pour lui annoncer la nouvelle en premier.", 
        shortText: "J'appelle le DG en priorité",
        effect: { stress: 5, reputation: 5 }, 
        nextNode: 'notif_call_dg'
      },
      { 
        id: 'd', 
        text: "Vérifier si c'est un vrai email ou du phishing...", 
        shortText: "Je vérifie d'abord si c'est un vrai email",
        effect: { time: -60 }, 
        nextNode: 'notif_verify_email'
      }
    ]
  },
  {
    id: 'notif_crisis_meeting',
    phase: 'notification',
    speaker: 'system',
    text: "En 10 minutes, vous avez réuni les personnes clés dans la salle de réunion. Tous ont le visage tendu mais concentré.",
    autoNext: 'notif_crisis_meeting_2',
    delay: 2000,
    effect: { reputation: 5 }
  },
  {
    id: 'notif_crisis_meeting_2',
    phase: 'notification',
    speaker: 'dsi',
    speakerName: 'Thomas Leroy (DSI)',
    text: "*S'assoit lourdement* Un audit aujourd'hui ? C'est du jamais vu. On est prêts ?",
    mood: 'stressed',
    autoNext: 'notif_crisis_meeting_3',
    delay: 2500
  },
  {
    id: 'notif_crisis_meeting_3',
    phase: 'notification',
    speaker: 'player',
    text: "",
    choices: [
      {
        id: 'a',
        text: "On a les bases. Chacun se concentre sur son périmètre : Thomas les accès techniques, Sophie les systèmes RH, Claire le cadre légal. On se retrouve à 11h.",
        shortText: "Oui, on se répartit les rôles maintenant",
        effect: { evidence: 15, stress: -10, reputation: 5 },
        nextNode: 'notif_team_dispatch',
        isOptimal: true
      },
      {
        id: 'b',
        text: "Honnêtement, il y a des trous. Focus sur les documents les plus critiques.",
        shortText: "Pas totalement, mais on priorise l'essentiel",
        effect: { evidence: 5, stress: 5 },
        nextNode: 'notif_honest_assessment'
      }
    ]
  },
  {
    id: 'notif_solo_action',
    phase: 'notification',
    speaker: 'system',
    text: "Vous courez vers votre bureau et commencez à fouiller dans les dossiers. Personne ne sait ce qui se passe. Le chaos s'installe progressivement...",
    effect: { stress: 15, evidence: -5 },
    autoNext: 'notif_solo_consequence',
    delay: 2500
  },
  {
    id: 'notif_solo_consequence',
    phase: 'notification',
    speaker: 'colleague',
    speakerName: 'Lucas Petit',
    text: "*Arrive essoufflé* Hé, qu'est-ce qui se passe ? J'ai vu Sophie en panique, Thomas qui crie sur le téléphone... C'est quoi le problème ?",
    mood: 'worried',
    choices: [
      {
        id: 'a',
        text: "Audit surprise cet après-midi. J'aurais dû commencer par prévenir l'équipe. Aide-moi à organiser une réunion rapide.",
        shortText: "Audit surprise ! Aide-moi à organiser une réunion",
        effect: { stress: 5, reputation: -5 },
        nextNode: 'notif_team_dispatch'
      },
      {
        id: 'b',
        text: "Pas le temps d'expliquer ! Trouve-moi le registre IA, vite !",
        shortText: "Pas le temps d'expliquer, trouve-moi le registre !",
        effect: { stress: 10, reputation: -10 },
        nextNode: 'prep_start'
      }
    ]
  },
  {
    id: 'notif_call_dg',
    phase: 'notification',
    speaker: 'phone',
    speakerName: 'Appel sortant...',
    text: "*Tonalité... Tonalité...*",
    autoNext: 'notif_dg_answers',
    delay: 2000
  },
  {
    id: 'notif_dg_answers',
    phase: 'notification',
    speaker: 'dg',
    speakerName: 'Philippe Martin (DG)',
    text: "*Voix tendue* Oui ? Je suis en réunion là...",
    mood: 'stressed',
    choices: [
      {
        id: 'a',
        text: "Philippe, désolé de vous interrompre. Audit de conformité IA aujourd'hui à 14h. Je gère, mais vous devrez peut-être être disponible pour l'accueil.",
        shortText: "Audit IA cet après-midi, je gère, soyez disponible",
        effect: { trust: 5, reputation: 5 },
        nextNode: 'notif_dg_reaction_good'
      },
      {
        id: 'b',
        text: "Philippe, c'est la catastrophe ! On a un audit IA cet après-midi et on n'est pas prêts !",
        shortText: "C'est la catastrophe ! On n'est pas prêts !",
        effect: { stress: 15, reputation: -10 },
        nextNode: 'notif_dg_reaction_bad'
      }
    ]
  },
  {
    id: 'notif_dg_reaction_good',
    phase: 'notification',
    speaker: 'dg',
    speakerName: 'Philippe Martin (DG)',
    text: "*Pause* ... OK. Je compte sur vous pour gérer. Tenez-moi informé. Je libère mon après-midi si nécessaire.",
    mood: 'neutral',
    effect: { reputation: 5 },
    autoNext: 'notif_team_dispatch',
    delay: 2500
  },
  {
    id: 'notif_dg_reaction_bad',
    phase: 'notification',
    speaker: 'dg',
    speakerName: 'Philippe Martin (DG)',
    text: "QUOI ?! Comment ça 'pas prêts' ?! Vous êtes payé pour ça ! *Il raccroche brusquement*",
    mood: 'angry',
    effect: { stress: 20, reputation: -15 },
    autoNext: 'notif_team_dispatch',
    delay: 2500
  },
  {
    id: 'notif_verify_email',
    phase: 'notification',
    speaker: 'system',
    text: "Vous vérifiez l'en-tête de l'email, le domaine de l'expéditeur... Tout semble authentique. C'est bien la Commission Nationale de l'IA.",
    effect: { time: -30 },
    autoNext: 'notif_first_choice',
    delay: 2000
  },
  {
    id: 'notif_honest_assessment',
    phase: 'notification',
    speaker: 'legal',
    speakerName: 'Claire Moreau (Juridique)',
    text: "*Ajuste ses lunettes* Quels sont les trous exactement ? On a combien de temps pour les combler ?",
    mood: 'neutral',
    choices: [
      {
        id: 'a',
        text: "L'AIPD du système RH n'est pas finalisée, la matrice de classification est incomplète, et les procédures de supervision ne sont pas formalisées.",
        shortText: "AIPD non finalisée, matrice incomplète, procédures manquantes",
        effect: { stress: 10 },
        nextNode: 'notif_gap_analysis'
      }
    ]
  },
  {
    id: 'notif_gap_analysis',
    phase: 'notification',
    speaker: 'legal',
    speakerName: 'Claire Moreau',
    text: "OK. Pour l'AIPD, on peut faire une version minimale en 2 heures. La classification, Lucas peut s'en charger. Les procédures... c'est plus compliqué. Focus sur ce qu'on peut sauver.",
    mood: 'neutral',
    effect: { evidence: 10 },
    autoNext: 'notif_team_dispatch',
    delay: 3000
  },
  {
    id: 'notif_team_dispatch',
    phase: 'notification',
    speaker: 'system',
    text: "L'équipe se disperse avec ses missions. Vous avez maintenant 4 heures pour préparer l'audit. Le compte à rebours commence.",
    autoNext: 'prep_start',
    delay: 2500,
    isCheckpoint: true
  },

  // ========================================
  // PHASE 2: PREPARATION (25 nodes)
  // ========================================
  {
    id: 'prep_start',
    phase: 'preparation',
    speaker: 'system',
    text: "⏱️ PHASE DE PRÉPARATION\n\n4 heures avant l'audit. C'est le moment de rassembler vos forces.",
    autoNext: 'prep_office_scene',
    delay: 2000,
    backgroundChange: 'office_busy'
  },
  {
    id: 'prep_office_scene',
    phase: 'preparation',
    speaker: 'narrator',
    text: "Votre bureau est devenu un QG de crise. Des piles de documents s'accumulent, des post-its colorent les murs, et le café coule à flots.",
    autoNext: 'prep_lucas_arrives',
    delay: 2500
  },
  {
    id: 'prep_lucas_arrives',
    phase: 'preparation',
    speaker: 'colleague',
    speakerName: 'Lucas Petit',
    text: "*Arrive avec une pile de dossiers* J'ai commencé à rassembler les documents. On a le registre IA, la cartographie, la politique de gouvernance... Mais il manque pas mal de choses.",
    mood: 'worried',
    autoNext: 'prep_lucas_details',
    delay: 3000
  },
  {
    id: 'prep_lucas_details',
    phase: 'preparation',
    speaker: 'colleague',
    speakerName: 'Lucas Petit',
    text: "L'AIPD du système de recrutement n'a jamais été finalisée. La matrice de classification est à 70%. Et les procédures de supervision humaine... *Il grimace* ...elles existent dans nos têtes mais pas sur papier.",
    mood: 'worried',
    choices: [
      {
        id: 'a',
        text: "Priorité 1 : l'AIPD. Même incomplète, c'est mieux qu'un trou. Tu t'en charges avec Emma. Je gère la matrice.",
        shortText: "Priorité 1 : l'AIPD. Tu t'en charges avec Emma",
        effect: { evidence: 10, time: -120, stress: 5 },
        nextNode: 'prep_aipd_rush',
        isOptimal: true
      },
      {
        id: 'b',
        text: "On ne peut pas tout faire. Focus sur ce qui est prêt et solide. On expliquera le reste.",
        shortText: "Focus sur ce qui est prêt, on expliquera le reste",
        effect: { evidence: -5, stress: -5 },
        nextNode: 'prep_existing_focus'
      },
      {
        id: 'c',
        text: "Qu'est-ce qu'on a d'autre qui manque ? Je veux un état des lieux complet.",
        shortText: "Qu'est-ce qu'il manque d'autre ? État des lieux complet",
        effect: { time: -60, stress: 10 },
        nextNode: 'prep_full_inventory'
      }
    ]
  },
  {
    id: 'prep_aipd_rush',
    phase: 'preparation',
    speaker: 'colleague',
    speakerName: 'Lucas Petit',
    text: "OK, je fonce ! Emma a déjà les données des tests de biais, on peut au moins documenter ça. Ce ne sera pas parfait, mais ce sera quelque chose.",
    mood: 'helpful',
    effect: { evidence: 5 },
    autoNext: 'prep_emma_joins',
    delay: 2500
  },
  {
    id: 'prep_emma_joins',
    phase: 'preparation',
    speaker: 'intern',
    speakerName: 'Emma Laurent (Stagiaire)',
    text: "*Timidement* J'ai... j'ai fait quelque chose qui pourrait aider. Un tableau avec tous nos systèmes IA et les articles de l'AI Act correspondants. C'était pour mon mémoire mais...",
    mood: 'stressed',
    choices: [
      {
        id: 'a',
        text: "Emma, c'est exactement ce qu'il nous faut ! Montre-moi ça tout de suite.",
        shortText: "Excellent ! Montre-moi ça tout de suite",
        effect: { evidence: 15, stress: -10, trust: 5 },
        nextNode: 'prep_emma_table',
        isOptimal: true
      },
      {
        id: 'b',
        text: "C'est gentil Emma, mais là je n'ai pas le temps de vérifier un travail de stagiaire.",
        shortText: "Merci, mais je n'ai pas le temps maintenant",
        effect: { stress: 5 },
        nextNode: 'prep_continue_alone'
      }
    ]
  },
  {
    id: 'prep_emma_table',
    phase: 'preparation',
    speaker: 'system',
    text: "Emma vous montre son tableau. C'est clair, bien structuré, avec des références précises aux articles de l'AI Act. Une vraie pépite.",
    effect: { evidence: 10 },
    autoNext: 'prep_emma_reaction',
    delay: 2500
  },
  {
    id: 'prep_emma_reaction',
    phase: 'preparation',
    speaker: 'player',
    text: "",
    choices: [
      {
        id: 'a',
        text: "Emma, tu viens de me sauver. Je peux compter sur toi pendant l'audit pour m'assister si besoin ?",
        shortText: "Tu viens de me sauver ! Tu m'assistes pendant l'audit ?",
        effect: { stress: -5, reputation: 5 },
        nextNode: 'prep_emma_yes',
        isOptimal: true
      },
      {
        id: 'b',
        text: "Excellent travail. Continue comme ça.",
        shortText: "Bon travail, merci",
        effect: {},
        nextNode: 'prep_continue_prep'
      }
    ]
  },
  {
    id: 'prep_emma_yes',
    phase: 'preparation',
    speaker: 'intern',
    speakerName: 'Emma Laurent',
    text: "*Son visage s'illumine* Vraiment ? Oui, bien sûr ! Je... je ne vous décevrai pas !",
    mood: 'helpful',
    effect: { stress: -5 },
    autoNext: 'prep_continue_prep',
    delay: 2000
  },
  {
    id: 'prep_existing_focus',
    phase: 'preparation',
    speaker: 'colleague',
    speakerName: 'Lucas Petit',
    text: "*Soupire* OK, si tu le dis... Mais si elle demande l'AIPD, on sera mal.",
    mood: 'worried',
    effect: { evidence: -5 },
    autoNext: 'prep_continue_prep',
    delay: 2500
  },
  {
    id: 'prep_full_inventory',
    phase: 'preparation',
    speaker: 'colleague',
    speakerName: 'Lucas Petit',
    text: "*Sort une liste* Voyons... Il manque aussi : la documentation technique complète du fournisseur (ils ne nous l'ont jamais envoyée), les procédures de supervision formalisées, le registre des incidents (vide car jamais utilisé), et les preuves de formation des équipes.",
    mood: 'worried',
    autoNext: 'prep_inventory_reaction',
    delay: 4000
  },
  {
    id: 'prep_inventory_reaction',
    phase: 'preparation',
    speaker: 'player',
    text: "",
    tip: "Ne paniquez pas. Certains manques sont plus graves que d'autres. Priorisez.",
    choices: [
      {
        id: 'a',
        text: "OK, focus : AIPD en priorité, puis documentation fournisseur. Le reste, on expliquera qu'on travaille dessus.",
        shortText: "OK, AIPD d'abord, puis doc fournisseur",
        effect: { evidence: 10, stress: -5 },
        nextNode: 'prep_continue_prep',
        isOptimal: true
      },
      {
        id: 'b',
        text: "Appelez le fournisseur maintenant ! Dites-leur que c'est urgent !",
        shortText: "Appelez le fournisseur maintenant, c'est urgent !",
        effect: { stress: 10, time: -60 },
        nextNode: 'prep_vendor_call'
      }
    ]
  },
  {
    id: 'prep_vendor_call',
    phase: 'preparation',
    speaker: 'phone',
    speakerName: 'Appel vers TechIA Solutions...',
    text: "*Musique d'attente interminable*... \"Bonjour, Marc Dubois, TechIA Solutions. Que puis-je faire pour vous ?\"",
    autoNext: 'prep_vendor_conversation',
    delay: 3000
  },
  {
    id: 'prep_vendor_conversation',
    phase: 'preparation',
    speaker: 'vendor',
    speakerName: 'Marc Dubois (Fournisseur)',
    text: "*Après votre explication* Je comprends l'urgence, mais les spécifications détaillées sont couvertes par notre secret commercial. Je peux vous envoyer une fiche technique résumée, c'est le maximum.",
    mood: 'neutral',
    choices: [
      {
        id: 'a',
        text: "Marc, l'AI Act nous impose d'avoir cette documentation. C'est dans notre contrat. Envoyez-moi au moins les infos de l'article 13 : données d'entraînement, métriques, limitations.",
        shortText: "L'AI Act l'impose. Envoyez au moins les infos Article 13",
        effect: { evidence: 10, stress: 5 },
        nextNode: 'prep_vendor_concede',
        isOptimal: true
      },
      {
        id: 'b',
        text: "Bon, envoyez ce que vous pouvez. On fera avec.",
        shortText: "Bon, envoyez ce que vous pouvez",
        effect: { evidence: -5 },
        nextNode: 'prep_continue_prep'
      }
    ]
  },
  {
    id: 'prep_vendor_concede',
    phase: 'preparation',
    speaker: 'vendor',
    speakerName: 'Marc Dubois',
    text: "*Soupir* OK, je vois ce que je peux faire. Je vous envoie un document dans l'heure. Mais ne le partagez pas avec n'importe qui.",
    mood: 'neutral',
    effect: { evidence: 5 },
    autoNext: 'prep_continue_prep',
    delay: 2500
  },
  {
    id: 'prep_continue_alone',
    phase: 'preparation',
    speaker: 'system',
    text: "Emma hoche la tête tristement et retourne à son bureau. Vous continuez seul à rassembler les documents.",
    effect: { stress: 5 },
    autoNext: 'prep_continue_prep',
    delay: 2000
  },
  {
    id: 'prep_continue_prep',
    phase: 'preparation',
    speaker: 'system',
    text: "Les heures passent. Les documents s'empilent. La tension monte.",
    autoNext: 'prep_dsi_issue',
    delay: 2500,
    triggerEvent: 'dsi_conflict'
  },
  {
    id: 'prep_dsi_issue',
    phase: 'preparation',
    speaker: 'dsi',
    speakerName: 'Thomas Leroy (DSI)',
    text: "*Entre brusquement* On a un problème. Le serveur de logs est lent. Si elle veut une démo live et que ça plante...",
    mood: 'stressed',
    choices: [
      {
        id: 'a',
        text: "Fais un export statique des logs clés en backup. PDF, Excel, peu importe. Si le live plante, on aura ça.",
        shortText: "Fais un export statique en backup au cas où",
        effect: { evidence: 10, time: -30 },
        nextNode: 'prep_backup_ready',
        isOptimal: true
      },
      {
        id: 'b',
        text: "Ça ira. Les serveurs plantent rarement. Ne perdons pas de temps.",
        shortText: "Ça ira, ne perdons pas de temps",
        effect: {},
        nextNode: 'prep_risk_taken'
      }
    ]
  },
  {
    id: 'prep_backup_ready',
    phase: 'preparation',
    speaker: 'dsi',
    speakerName: 'Thomas Leroy',
    text: "OK, je m'en occupe. *Il hésite* Et... désolé pour tout à l'heure. Le stress.",
    mood: 'neutral',
    autoNext: 'prep_claire_arrives',
    delay: 2500
  },
  {
    id: 'prep_risk_taken',
    phase: 'preparation',
    speaker: 'dsi',
    speakerName: 'Thomas Leroy',
    text: "*Hausse les épaules* C'est toi le chef. Mais si ça plante, je t'aurais prévenu.",
    mood: 'stressed',
    autoNext: 'prep_claire_arrives',
    delay: 2500
  },
  {
    id: 'prep_claire_arrives',
    phase: 'preparation',
    speaker: 'legal',
    speakerName: 'Claire Moreau (Juridique)',
    text: "*Entre avec des documents* J'ai préparé une fiche sur le cadre légal de l'audit. Nos droits, les limites de l'auditrice, les points sur lesquels on peut négocier.",
    mood: 'neutral',
    choices: [
      {
        id: 'a',
        text: "Parfait Claire. Résume-moi les 3 points clés.",
        shortText: "Parfait ! Résume-moi les 3 points clés",
        effect: { evidence: 5, stress: -5, time: -30 },
        nextNode: 'prep_claire_summary',
        isOptimal: true
      },
      {
        id: 'b',
        text: "Merci, pose ça là, je lirai plus tard.",
        shortText: "Merci, je lirai plus tard",
        effect: { stress: 5 },
        nextNode: 'prep_final_check'
      }
    ]
  },
  {
    id: 'prep_claire_summary',
    phase: 'preparation',
    speaker: 'legal',
    speakerName: 'Claire Moreau',
    text: "Un : on peut demander un délai de réponse pour les questions complexes. Deux : on peut refuser de répondre sur des éléments hors périmètre IA. Trois : tout ce qu'on dit peut être utilisé, mais on a le droit de corriger le rapport avant publication.",
    mood: 'neutral',
    effect: { evidence: 10 },
    autoNext: 'prep_final_check',
    delay: 4000
  },
  {
    id: 'prep_final_check',
    phase: 'preparation',
    speaker: 'system',
    text: "Il est 13h30. L'auditrice arrive dans 30 minutes.",
    autoNext: 'prep_final_choice',
    delay: 2500,
    effect: { stress: 10 }
  },
  {
    id: 'prep_final_choice',
    phase: 'preparation',
    speaker: 'player',
    text: "",
    tip: "Derniers instants de préparation. Que faites-vous ?",
    // triggerMiniGame déplacé pour éviter blocage
    choices: [
      {
        id: 'a',
        text: "Faire un dernier point avec l'équipe pour s'assurer que chacun connaît son rôle.",
        shortText: "Je fais un dernier point d'équipe",
        effect: { stress: -10, trust: 5 },
        nextNode: 'prep_team_briefing',
        isOptimal: true
      },
      {
        id: 'b',
        text: "Relire une dernière fois les documents clés.",
        shortText: "Je relis les documents clés",
        effect: { evidence: 5, time: -60 },
        nextNode: 'prep_solo_review'
      },
      {
        id: 'c',
        text: "Prendre 5 minutes pour respirer et se recentrer.",
        shortText: "Je prends 5 minutes pour respirer",
        effect: { stress: -15 },
        nextNode: 'prep_breathing'
      }
    ]
  },
  {
    id: 'prep_team_briefing',
    phase: 'preparation',
    speaker: 'player',
    text: "*Réunion rapide* OK tout le monde. Thomas gère la technique, Sophie les questions RH, Claire le juridique, Lucas et Emma en support. Moi je coordonne. Questions ?",
    autoNext: 'prep_team_ready',
    delay: 3000
  },
  {
    id: 'prep_team_ready',
    phase: 'preparation',
    speaker: 'colleague',
    speakerName: 'Lucas Petit',
    text: "*Hochement de tête général* On est prêts. Enfin, aussi prêts qu'on peut l'être.",
    mood: 'neutral',
    autoNext: 'prep_auditor_arrives',
    delay: 2500
  },
  {
    id: 'prep_solo_review',
    phase: 'preparation',
    speaker: 'system',
    text: "Vous parcourez une dernière fois le registre IA, la politique de gouvernance, les fiches des systèmes critiques...",
    effect: { evidence: 5 },
    autoNext: 'prep_auditor_arrives',
    delay: 2500
  },
  {
    id: 'prep_breathing',
    phase: 'preparation',
    speaker: 'internal',
    text: "*Vous fermez les yeux. Respiration. Vous avez fait tout ce que vous pouviez. Maintenant, il faut jouer la partie.*",
    effect: { stress: -10 },
    autoNext: 'prep_auditor_arrives',
    delay: 3000
  },
  {
    id: 'prep_auditor_arrives',
    phase: 'preparation',
    speaker: 'system',
    text: "🔔 13h55 - L'accueil vous appelle : \"L'auditrice de la Commission vient d'arriver.\"",
    effect: { stress: 10 },
    autoNext: 'accueil_start',
    delay: 2500,
    isCheckpoint: true
  },

  // ========================================
  // PHASE 3: ACCUEIL (20 nodes)
  // ========================================
  {
    id: 'accueil_start',
    phase: 'accueil',
    speaker: 'system',
    text: "🤝 PHASE D'ACCUEIL\n\nC'est le moment crucial de la première impression. L'auditrice vous évalue dès les premières secondes.",
    autoNext: 'accueil_lobby',
    delay: 2000,
    backgroundChange: 'lobby'
  },
  {
    id: 'accueil_lobby',
    phase: 'accueil',
    speaker: 'narrator',
    text: "Vous descendez à l'accueil. Une femme d'une cinquantaine d'années, costume gris, mallette en cuir, vous attend. Son regard est perçant mais pas hostile.",
    autoNext: 'accueil_first_contact',
    delay: 2500
  },
  {
    id: 'accueil_first_contact',
    phase: 'accueil',
    speaker: 'auditor',
    speakerName: 'Marie Durand (Auditrice)',
    text: "Bonjour. Marie Durand, Commission Nationale de l'Intelligence Artificielle. Je suis là pour le contrôle de conformité AI Act notifié ce matin.",
    mood: 'neutral',
    choices: [
      {
        id: 'a',
        text: "Bonjour Madame Durand, bienvenue dans nos locaux. Je suis [Votre nom], Responsable Conformité IA. Puis-je vous offrir un café avant de nous installer ?",
        shortText: "Bienvenue ! Puis-je vous offrir un café ?",
        effect: { trust: 15, stress: -5 },
        nextNode: 'accueil_coffee_accepted',
        isOptimal: true
      },
      {
        id: 'b',
        text: "Bonjour. Suivez-moi, notre salle de réunion est prête.",
        shortText: "Bonjour, suivez-moi vers la salle",
        effect: { trust: 0 },
        nextNode: 'accueil_to_room'
      },
      {
        id: 'c',
        text: "Ah, vous êtes déjà là ? Je... la salle n'est peut-être pas tout à fait...",
        shortText: "Euh... vous êtes déjà là ?",
        effect: { trust: -15, stress: 15 },
        nextNode: 'accueil_unprepared',
        isRisky: true
      }
    ]
  },
  {
    id: 'accueil_coffee_accepted',
    phase: 'accueil',
    speaker: 'auditor',
    speakerName: 'Marie Durand',
    text: "*Elle accepte avec un léger sourire* Merci, c'est appréciable. Vous savez, dans beaucoup d'audits, on nous accueille comme des ennemis. Ça change.",
    mood: 'friendly',
    effect: { trust: 5 },
    autoNext: 'accueil_coffee_chat',
    delay: 3000
  },
  {
    id: 'accueil_coffee_chat',
    phase: 'accueil',
    speaker: 'auditor',
    speakerName: 'Marie Durand',
    text: "*En marchant vers la machine à café* Vous êtes dans cette fonction depuis longtemps ? La conformité IA, c'est un métier qui s'invente en ce moment...",
    mood: 'friendly',
    choices: [
      {
        id: 'a',
        text: "Depuis 2 ans dans ce rôle spécifique. Avant j'étais DPO, donc la transition était naturelle. L'AI Act a beaucoup changé notre façon de travailler.",
        shortText: "Depuis 2 ans, après un poste de DPO",
        effect: { trust: 5 },
        nextNode: 'accueil_to_room',
        isOptimal: true
      },
      {
        id: 'b',
        text: "C'est vrai que c'est nouveau pour tout le monde. On fait de notre mieux.",
        shortText: "C'est nouveau pour tout le monde, on fait de notre mieux",
        effect: { trust: 0 },
        nextNode: 'accueil_to_room'
      }
    ]
  },
  {
    id: 'accueil_unprepared',
    phase: 'accueil',
    speaker: 'auditor',
    speakerName: 'Marie Durand',
    text: "*Elle consulte sa montre* Je suis à l'heure prévue. La notification mentionnait 14h00. *Elle sort son carnet et note quelque chose*",
    mood: 'impatient',
    effect: { trust: -5 },
    autoNext: 'accueil_to_room',
    delay: 3000
  },
  {
    id: 'accueil_to_room',
    phase: 'accueil',
    speaker: 'system',
    text: "Vous entrez dans la salle de réunion. L'auditrice sort son ordinateur portable et un épais dossier frappé du logo de la Commission.",
    autoNext: 'accueil_setup',
    delay: 2500
  },
  {
    id: 'accueil_setup',
    phase: 'accueil',
    speaker: 'auditor',
    speakerName: 'Marie Durand',
    text: "*Elle s'installe méthodiquement* Bien. Permettez-moi de rappeler le cadre. Cet audit vise à vérifier votre conformité au Règlement européen sur l'IA. Je vais examiner vos systèmes, leur documentation, votre gouvernance, et vos processus. L'audit durera environ 3 heures. Des questions avant de commencer ?",
    mood: 'neutral',
    aiActReference: 'Article 74 - Contrôle de conformité',
    choices: [
      {
        id: 'a',
        text: "Tout est clair. Notre équipe est mobilisée et nos documents sont prêts. Par où souhaitez-vous commencer ?",
        shortText: "Tout est clair, par où commençons-nous ?",
        effect: { trust: 10 },
        nextNode: 'accueil_role_question',
        isOptimal: true
      },
      {
        id: 'b',
        text: "Pouvez-vous préciser les sanctions en cas de non-conformité ?",
        shortText: "Quelles sanctions en cas de non-conformité ?",
        effect: { trust: -5, stress: 10 },
        nextNode: 'accueil_sanctions_question'
      },
      {
        id: 'c',
        text: "Nos avocats peuvent-ils être présents ?",
        shortText: "Nos avocats peuvent-ils être présents ?",
        effect: { trust: -10, stress: 5 },
        nextNode: 'accueil_lawyers_question'
      }
    ]
  },
  {
    id: 'accueil_sanctions_question',
    phase: 'accueil',
    speaker: 'auditor',
    speakerName: 'Marie Durand',
    text: "*Elle vous regarde avec surprise* Les sanctions vont de l'avertissement à des amendes pouvant atteindre 35 millions d'euros ou 7% du CA mondial. Mais je préférerais qu'on se concentre sur la conformité plutôt que sur les sanctions, non ?",
    mood: 'concerned',
    aiActReference: 'Article 99 - Amendes',
    effect: { stress: 5 },
    autoNext: 'accueil_role_question',
    delay: 4000
  },
  {
    id: 'accueil_lawyers_question',
    phase: 'accueil',
    speaker: 'auditor',
    speakerName: 'Marie Durand',
    text: "Vous êtes en droit de faire appel à vos conseils juridiques. Leur présence n'est pas obligatoire pour un audit de conformité. Dois-je comprendre que vous anticipez des problèmes ?",
    mood: 'concerned',
    effect: { trust: -5 },
    autoNext: 'accueil_role_question',
    delay: 3000
  },
  {
    id: 'accueil_role_question',
    phase: 'accueil',
    speaker: 'auditor',
    speakerName: 'Marie Durand',
    text: "Première question : quel est votre rôle exact dans l'organisation concernant la conformité IA ? Êtes-vous officiellement désigné comme point de contact AI Act ?",
    mood: 'neutral',
    tip: "L'AI Act recommande un point de contact unique et identifié pour la conformité. Article 4.",
    choices: [
      {
        id: 'a',
        text: "Je suis le Responsable Conformité IA, officiellement nommé par la Direction Générale. Voici ma lettre de mission qui définit mon périmètre, mes responsabilités et mon autorité.",
        shortText: "Responsable Conformité IA nommé par la DG. Voici ma lettre de mission",
        requiresDocument: 'lettre_mission',
        effect: { trust: 20, evidence: 15 },
        nextNode: 'accueil_role_approved',
        isOptimal: true
      },
      {
        id: 'b',
        text: "Je suis le DPO et j'ai étendu mon périmètre à l'IA depuis l'entrée en vigueur du règlement.",
        shortText: "Je suis DPO et j'ai étendu mon périmètre à l'IA",
        effect: { trust: 5, evidence: 5 },
        nextNode: 'accueil_role_dpo'
      },
      {
        id: 'c',
        text: "C'est un peu informel. Plusieurs personnes s'occupent de l'IA dans l'entreprise.",
        shortText: "C'est informel, plusieurs personnes s'en occupent",
        effect: { trust: -20, evidence: -15, stress: 10 },
        nextNode: 'accueil_role_problem',
        isCriticalMistake: true
      }
    ]
  },
  {
    id: 'accueil_role_approved',
    phase: 'accueil',
    speaker: 'auditor',
    speakerName: 'Marie Durand',
    text: "*Elle examine attentivement le document* Très bien structuré. Je vois que vous avez autorité pour stopper des systèmes non conformes et un budget dédié. C'est exactement ce que recommande le règlement.",
    mood: 'pleased',
    effect: { evidence: 5, trust: 5 },
    autoNext: 'accueil_authority_question',
    delay: 3500
  },
  {
    id: 'accueil_authority_question',
    phase: 'accueil',
    speaker: 'auditor',
    speakerName: 'Marie Durand',
    text: "Cette autorité, l'avez-vous déjà exercée ? Avez-vous déjà dû stopper ou modifier un système pour des raisons de conformité ?",
    mood: 'neutral',
    choices: [
      {
        id: 'a',
        text: "Oui, il y a 6 mois. Nous avons suspendu un projet de vidéosurveillance IA car il relevait de l'annexe III sans analyse d'impact préalable. Le projet a repris après mise en conformité.",
        shortText: "Oui, on a suspendu un projet vidéosurveillance il y a 6 mois",
        effect: { trust: 20, evidence: 15 },
        nextNode: 'accueil_perimeter_question',
        isOptimal: true
      },
      {
        id: 'b',
        text: "Pas encore, mais je suis prêt à le faire si nécessaire.",
        shortText: "Pas encore, mais je suis prêt à le faire",
        effect: { trust: 5 },
        nextNode: 'accueil_perimeter_question'
      },
      {
        id: 'c',
        text: "En pratique, la direction n'aime pas qu'on bloque des projets...",
        shortText: "La direction n'aime pas qu'on bloque des projets...",
        effect: { trust: -10, evidence: -5 },
        nextNode: 'accueil_authority_weak'
      }
    ]
  },
  {
    id: 'accueil_authority_weak',
    phase: 'accueil',
    speaker: 'auditor',
    speakerName: 'Marie Durand',
    text: "*Elle note* C'est un point d'attention. L'autorité ne doit pas être seulement sur le papier. Si vous n'avez pas le pouvoir réel de faire appliquer la conformité, le dispositif est fragile.",
    mood: 'concerned',
    effect: { evidence: -5 },
    autoNext: 'accueil_perimeter_question',
    delay: 3500
  },
  {
    id: 'accueil_role_dpo',
    phase: 'accueil',
    speaker: 'auditor',
    speakerName: 'Marie Durand',
    text: "DPO et responsable IA... C'est un cumul de fonctions. Avez-vous les ressources suffisantes pour les deux rôles ? Le RGPD et l'AI Act ont des exigences différentes.",
    mood: 'concerned',
    choices: [
      {
        id: 'a',
        text: "C'est temporaire. Un recrutement est en cours pour séparer les fonctions d'ici 6 mois. En attendant, j'ai une équipe dédiée pour chaque périmètre.",
        shortText: "C'est temporaire, un recrutement est en cours",
        effect: { trust: 10 },
        nextNode: 'accueil_perimeter_question'
      },
      {
        id: 'b',
        text: "Les deux réglementations sont complémentaires. Je gère.",
        shortText: "Les deux sont complémentaires, je gère",
        effect: { trust: -5 },
        nextNode: 'accueil_perimeter_question'
      }
    ]
  },
  {
    id: 'accueil_role_problem',
    phase: 'accueil',
    speaker: 'auditor',
    speakerName: 'Marie Durand',
    text: "*Elle fronce les sourcils et note longuement* C'est un premier point de non-conformité significatif. L'article 4 insiste sur la nécessité d'une gouvernance claire avec des responsabilités définies. Je note : 'Absence de point de contact unique identifié'.",
    mood: 'concerned',
    effect: { evidence: -10 },
    aiActReference: 'Article 4 - Maîtrise de l\'IA',
    autoNext: 'accueil_perimeter_question',
    delay: 4000
  },
  {
    id: 'accueil_perimeter_question',
    phase: 'accueil',
    speaker: 'auditor',
    speakerName: 'Marie Durand',
    text: "Passons au périmètre. Combien de systèmes d'intelligence artificielle utilisez-vous dans votre organisation, et disposez-vous d'un registre ?",
    mood: 'neutral',
    tip: "Le registre IA est la pierre angulaire de la conformité. Sans lui, impossible de prouver votre maîtrise.",
    triggerMiniGame: 'document_search_1',
    choices: [
      {
        id: 'a',
        text: "Nous avons identifié et documenté 14 systèmes d'IA répartis dans 5 départements. Voici notre registre complet avec pour chaque système : nom, fournisseur, usage, classification de risque, et date de dernière revue.",
        shortText: "14 systèmes documentés. Voici notre registre",
        requiresDocument: 'registre_ia',
        effect: { trust: 20, evidence: 25 },
        nextNode: 'accueil_registry_review',
        isOptimal: true
      },
      {
        id: 'b',
        text: "On utilise une dizaine de systèmes IA environ. J'ai commencé un inventaire mais il n'est pas finalisé.",
        shortText: "Une dizaine environ, l'inventaire n'est pas finalisé",
        effect: { trust: -15, evidence: -15 },
        nextNode: 'accueil_registry_incomplete'
      },
      {
        id: 'c',
        text: "C'est difficile à dire précisément. Chaque département utilise ses propres outils...",
        shortText: "Difficile à dire, chaque département utilise ses outils",
        effect: { trust: -30, evidence: -25, stress: 15 },
        nextNode: 'accueil_registry_missing',
        isCriticalMistake: true
      }
    ]
  },
  {
    id: 'accueil_registry_review',
    phase: 'accueil',
    speaker: 'auditor',
    speakerName: 'Marie Durand',
    text: "*Elle parcourt le registre attentivement* Intéressant. Je vois 3 systèmes classés 'haut risque' : recrutement IA, scoring crédit client, et vidéosurveillance intelligente. Bonne identification.",
    mood: 'pleased',
    effect: { trust: 5 },
    autoNext: 'doc_start',
    delay: 3000
  },
  {
    id: 'accueil_registry_incomplete',
    phase: 'accueil',
    speaker: 'auditor',
    speakerName: 'Marie Durand',
    text: "*Elle soupire* Un registre incomplet est un problème majeur. Comment garantir la conformité de systèmes non identifiés ? Je note cela comme observation critique.",
    mood: 'impatient',
    effect: { evidence: -10 },
    autoNext: 'doc_start',
    delay: 3000
  },
  {
    id: 'accueil_registry_missing',
    phase: 'accueil',
    speaker: 'auditor',
    speakerName: 'Marie Durand',
    text: "*Elle pose son stylo et vous regarde fixement* L'absence de cartographie est une non-conformité majeure au titre de l'article 29. C'est la base. Sans inventaire, cet audit ne peut pas se poursuivre correctement.",
    mood: 'angry',
    effect: { trust: -20, evidence: -20 },
    aiActReference: 'Article 29 - Obligations des déployeurs',
    autoNext: 'doc_start',
    delay: 4000
  },

  // ========================================
  // PHASE 4: DOCUMENTATION (30 nodes)
  // ========================================
  {
    id: 'doc_start',
    phase: 'documentation',
    speaker: 'system',
    text: "📁 PHASE DE REVUE DOCUMENTAIRE\n\nL'auditrice va maintenant examiner en détail vos dossiers de conformité. C'est le cœur de l'audit.",
    autoNext: 'doc_classification_intro',
    delay: 2000,
    isCheckpoint: true
  },
  {
    id: 'doc_classification_intro',
    phase: 'documentation',
    speaker: 'auditor',
    speakerName: 'Marie Durand',
    text: "Concentrons-nous sur vos systèmes à haut risque. Commençons par le système de recrutement IA. Pouvez-vous me montrer l'analyse qui a conduit à sa classification 'haut risque' ?",
    mood: 'neutral',
    aiActReference: 'Article 6 & Annexe III',
    triggerMiniGame: 'risk_classification_1',
    choices: [
      {
        id: 'a',
        text: "Le système de recrutement tombe sous l'annexe III, point 4a : 'IA utilisée pour le recrutement ou la sélection de personnes'. Nous avons analysé chaque système selon cette grille. Voici notre matrice complète.",
        shortText: "Annexe III, point 4a. Voici notre matrice d'analyse",
        requiresDocument: 'classification_matrix',
        effect: { trust: 20, evidence: 25 },
        nextNode: 'doc_classification_approved',
        isOptimal: true
      },
      {
        id: 'b',
        text: "C'est du recrutement, donc c'est forcément haut risque selon le règlement.",
        shortText: "Recrutement = haut risque, c'est dans le règlement",
        effect: { trust: -10, evidence: -10 },
        nextNode: 'doc_classification_weak'
      },
      {
        id: 'c',
        text: "Nous avons suivi les recommandations d'un consultant externe pour la classification.",
        shortText: "Un consultant nous a aidés pour la classification",
        effect: { trust: -5, evidence: -5 },
        nextNode: 'doc_classification_external'
      }
    ]
  },
  {
    id: 'doc_classification_approved',
    phase: 'documentation',
    speaker: 'auditor',
    speakerName: 'Marie Durand',
    text: "*Elle examine la matrice* Excellent. Je vois que vous avez aussi analysé le scoring crédit sous l'angle de l'annexe III, point 5b, et la vidéosurveillance sous le point 6a. Travail rigoureux.",
    mood: 'pleased',
    effect: { trust: 10, evidence: 5 },
    autoNext: 'doc_aipd_question',
    delay: 3500
  },
  {
    id: 'doc_classification_weak',
    phase: 'documentation',
    speaker: 'auditor',
    speakerName: 'Marie Durand',
    text: "\"Forcément haut risque\" n'est pas une analyse juridique. Avez-vous vérifié si votre usage spécifique correspond aux critères de l'annexe III ? Certains systèmes RH ne sont PAS haut risque selon l'usage exact.",
    mood: 'concerned',
    effect: { evidence: -5 },
    autoNext: 'doc_aipd_question',
    delay: 3500
  },
  {
    id: 'doc_classification_external',
    phase: 'documentation',
    speaker: 'auditor',
    speakerName: 'Marie Durand',
    text: "Un consultant peut vous accompagner, mais la responsabilité vous incombe. Avez-vous validé et compris son analyse ? Où est le livrable du consultant ?",
    mood: 'impatient',
    choices: [
      {
        id: 'a',
        text: "Oui, voici le rapport du consultant et notre validation interne point par point.",
        shortText: "Oui, voici le rapport et notre validation interne",
        effect: { trust: 5, evidence: 5 },
        nextNode: 'doc_aipd_question'
      },
      {
        id: 'b',
        text: "Je... je dois le chercher. Donnez-moi un instant.",
        shortText: "Je dois le chercher, un instant...",
        effect: { trust: -10, stress: 10 },
        nextNode: 'doc_aipd_question'
      }
    ]
  },
  {
    id: 'doc_aipd_question',
    phase: 'documentation',
    speaker: 'auditor',
    speakerName: 'Marie Durand',
    text: "L'article 27 impose aux déployeurs de systèmes à haut risque de réaliser une analyse d'impact sur les droits fondamentaux. Avez-vous mené cette analyse pour votre système de recrutement ?",
    mood: 'serious',
    aiActReference: 'Article 27 - Analyse d\'impact',
    tip: "L'AIPD AI Act est différente de l'AIPD RGPD : elle couvre spécifiquement les risques de biais, discrimination, et atteinte aux droits.",
    choices: [
      {
        id: 'a',
        text: "Oui. Notre AIPD couvre les risques de discrimination (genre, âge, origine), l'impact sur le droit au travail, les mesures de mitigation, et le processus de supervision humaine. La voici.",
        shortText: "Oui, discrimination, droit au travail, mitigation. La voici",
        requiresDocument: 'aipd_rh',
        effect: { trust: 25, evidence: 30 },
        nextNode: 'doc_aipd_review',
        isOptimal: true
      },
      {
        id: 'b',
        text: "Nous avons fait une analyse d'impact RGPD qui couvre les aspects IA aussi.",
        shortText: "On a fait une AIPD RGPD qui couvre aussi l'IA",
        effect: { trust: -15, evidence: -15 },
        nextNode: 'doc_aipd_rgpd'
      },
      {
        id: 'c',
        text: "L'analyse est en cours mais pas encore finalisée.",
        shortText: "Elle est en cours mais pas encore finalisée",
        effect: { trust: -20, evidence: -20 },
        nextNode: 'doc_aipd_missing'
      },
      {
        id: 'd',
        text: "Notre fournisseur nous a certifié que le système était conforme et équitable.",
        shortText: "Le fournisseur nous a certifié la conformité",
        effect: { trust: -25, evidence: -25, stress: 10 },
        nextNode: 'doc_aipd_vendor_trust',
        isRisky: true
      }
    ]
  },
  {
    id: 'doc_aipd_review',
    phase: 'documentation',
    speaker: 'auditor',
    speakerName: 'Marie Durand',
    text: "*Elle lit attentivement* C'est un travail sérieux. Je vois que vous avez identifié un risque de biais défavorable aux candidats de plus de 50 ans et mis en place une pondération corrective. Très bien.",
    mood: 'pleased',
    effect: { trust: 10, evidence: 5 },
    autoNext: 'doc_aipd_followup',
    delay: 3500
  },
  {
    id: 'doc_aipd_followup',
    phase: 'documentation',
    speaker: 'auditor',
    speakerName: 'Marie Durand',
    text: "Avez-vous testé l'efficacité de cette correction ? Comment savez-vous que le biais est réellement corrigé ?",
    mood: 'neutral',
    choices: [
      {
        id: 'a',
        text: "Oui, nous avons des audits trimestriels. Voici le dernier rapport : le biais est passé de 15% à 3%, en-dessous de notre seuil d'acceptabilité de 5%.",
        shortText: "Oui, audits trimestriels. Biais passé de 15% à 3%",
        requiresDocument: 'tests_biais',
        effect: { trust: 20, evidence: 20 },
        nextNode: 'doc_bias_approved',
        isOptimal: true
      },
      {
        id: 'b',
        text: "Nous faisons confiance au paramétrage, mais nous n'avons pas de mesure précise.",
        shortText: "On fait confiance, pas de mesure précise",
        effect: { trust: -10, evidence: -10 },
        nextNode: 'doc_bias_weak'
      }
    ]
  },
  {
    id: 'doc_aipd_rgpd',
    phase: 'documentation',
    speaker: 'auditor',
    speakerName: 'Marie Durand',
    text: "L'AIPD RGPD est nécessaire mais insuffisante. L'AI Act exige une analyse spécifique des risques algorithmiques : biais, discrimination, explicabilité. Ce sont des dimensions que le RGPD ne couvre pas.",
    mood: 'concerned',
    aiActReference: 'Article 27 - spécificités IA',
    effect: { evidence: -10 },
    autoNext: 'doc_bias_testing',
    delay: 4000
  },
  {
    id: 'doc_aipd_missing',
    phase: 'documentation',
    speaker: 'auditor',
    speakerName: 'Marie Durand',
    text: "Depuis combien de temps ce système est-il en production ? *Vous répondez 18 mois* ... 18 mois sans AIPD pour un système haut risque. C'est une non-conformité caractérisée.",
    mood: 'angry',
    effect: { trust: -15, evidence: -15 },
    autoNext: 'doc_bias_testing',
    delay: 4000
  },
  {
    id: 'doc_aipd_vendor_trust',
    phase: 'documentation',
    speaker: 'auditor',
    speakerName: 'Marie Durand',
    text: "*Elle secoue la tête* En tant que déployeur, VOUS êtes responsable. La certification d'un fournisseur ne vous exonère pas. Article 29 : le déployeur doit s'assurer de l'utilisation conforme. C'est VOTRE responsabilité.",
    mood: 'angry',
    effect: { trust: -15, evidence: -10 },
    aiActReference: 'Article 29 - Responsabilité du déployeur',
    autoNext: 'doc_bias_testing',
    delay: 4500
  },
  {
    id: 'doc_bias_approved',
    phase: 'documentation',
    speaker: 'auditor',
    speakerName: 'Marie Durand',
    text: "*Elle hoche la tête* Des métriques précises, un seuil défini, un suivi régulier. C'est exactement ce que nous attendons. Je note cette bonne pratique.",
    mood: 'pleased',
    effect: { trust: 10, evidence: 10 },
    autoNext: 'doc_transparency_question',
    delay: 3000
  },
  {
    id: 'doc_bias_weak',
    phase: 'documentation',
    speaker: 'auditor',
    speakerName: 'Marie Durand',
    text: "Faire confiance au paramétrage sans le vérifier n'est pas une démarche de conformité. Comment prouveriez-vous l'absence de biais devant un tribunal ?",
    mood: 'concerned',
    effect: { evidence: -10 },
    autoNext: 'doc_transparency_question',
    delay: 3500
  },
  {
    id: 'doc_bias_testing',
    phase: 'documentation',
    speaker: 'auditor',
    speakerName: 'Marie Durand',
    text: "Parlons des tests de biais. L'article 10 exige que les données soient pertinentes, représentatives, et exemptes d'erreurs. Comment vérifiez-vous l'absence de biais discriminatoires ?",
    mood: 'neutral',
    aiActReference: 'Article 10 - Données',
    choices: [
      {
        id: 'a',
        text: "Nous réalisons des audits trimestriels d'équité avec des métriques par genre, âge et origine. Voici le dernier rapport montrant nos résultats et les corrections appliquées.",
        shortText: "Audits trimestriels d'équité. Voici le dernier rapport",
        requiresDocument: 'tests_biais',
        effect: { trust: 25, evidence: 20 },
        nextNode: 'doc_transparency_question',
        isOptimal: true
      },
      {
        id: 'b',
        text: "Le fournisseur fait des tests de son côté et nous envoie un rapport annuel.",
        shortText: "Le fournisseur teste et nous envoie un rapport annuel",
        effect: { trust: -10, evidence: -10 },
        nextNode: 'doc_bias_external'
      },
      {
        id: 'c',
        text: "On surveille les plaintes. On n'en a pas eu.",
        shortText: "On surveille les plaintes. On n'en a pas eu",
        effect: { trust: -20, evidence: -15 },
        nextNode: 'doc_bias_reactive'
      }
    ]
  },
  {
    id: 'doc_bias_external',
    phase: 'documentation',
    speaker: 'auditor',
    speakerName: 'Marie Durand',
    text: "Un rapport annuel du fournisseur est insuffisant. Vous devez avoir la capacité de tester vous-même. Que se passe-t-il si un candidat porte plainte ?",
    mood: 'concerned',
    effect: { evidence: -5 },
    autoNext: 'doc_transparency_question',
    delay: 3500
  },
  {
    id: 'doc_bias_reactive',
    phase: 'documentation',
    speaker: 'auditor',
    speakerName: 'Marie Durand',
    text: "Attendre les plaintes est une approche réactive et risquée. Un système peut discriminer pendant des mois avant qu'une plainte n'émerge. La conformité exige une démarche proactive.",
    mood: 'impatient',
    effect: { evidence: -10 },
    autoNext: 'doc_transparency_question',
    delay: 4000
  },
  {
    id: 'doc_transparency_question',
    phase: 'documentation',
    speaker: 'auditor',
    speakerName: 'Marie Durand',
    text: "Passons à la transparence. L'article 50 impose d'informer les utilisateurs qu'ils interagissent avec un système d'IA. Pour votre système de recrutement, les candidats sont-ils informés ?",
    mood: 'neutral',
    aiActReference: 'Article 50 - Obligations de transparence',
    choices: [
      {
        id: 'a',
        text: "Oui, à plusieurs niveaux : mention dans l'offre d'emploi, information dans le formulaire avec case de consentement explicite, et email de confirmation. Voici les captures d'écran.",
        shortText: "Oui : offre d'emploi, formulaire, email. Voici les captures",
        requiresDocument: 'mentions_legales',
        effect: { trust: 25, evidence: 20 },
        nextNode: 'doc_transparency_approved',
        isOptimal: true
      },
      {
        id: 'b',
        text: "C'est mentionné dans nos CGU que les candidats acceptent.",
        shortText: "C'est mentionné dans les CGU",
        effect: { trust: -15, evidence: -15 },
        nextNode: 'doc_transparency_cgu'
      },
      {
        id: 'c',
        text: "Notre chatbot s'appelle 'Luna' et a un avatar humain... C'est peut-être pas assez clair.",
        shortText: "Notre chatbot Luna a un avatar humain... peut-être pas clair",
        effect: { trust: -30, evidence: -25, stress: 15 },
        nextNode: 'doc_transparency_violation',
        isCriticalMistake: true
      }
    ]
  },
  {
    id: 'doc_transparency_approved',
    phase: 'documentation',
    speaker: 'auditor',
    speakerName: 'Marie Durand',
    text: "*Elle parcourt les captures* C'est exemplaire. Information claire, visible, au bon moment. Le consentement explicite est un plus. Je note cette bonne pratique.",
    mood: 'pleased',
    effect: { trust: 10, evidence: 5 },
    autoNext: 'doc_logs_question',
    delay: 3000
  },
  {
    id: 'doc_transparency_cgu',
    phase: 'documentation',
    speaker: 'auditor',
    speakerName: 'Marie Durand',
    text: "Enterrer l'information dans des CGU que personne ne lit n'est pas conforme. L'article 50 exige une information 'claire et compréhensible' fournie 'au moment du premier contact'.",
    mood: 'concerned',
    effect: { evidence: -10 },
    autoNext: 'doc_logs_question',
    delay: 4000
  },
  {
    id: 'doc_transparency_violation',
    phase: 'documentation',
    speaker: 'auditor',
    speakerName: 'Marie Durand',
    text: "*Elle referme brusquement son carnet* Un chatbot avec un prénom et avatar humains qui ne s'identifie pas comme IA ? C'est une violation directe de l'article 50. Vous faites croire aux gens qu'ils parlent à un humain !",
    mood: 'angry',
    effect: { trust: -25, evidence: -20 },
    aiActReference: 'Article 50 - Interdiction de tromper',
    autoNext: 'doc_logs_question',
    delay: 4500
  },
  {
    id: 'doc_logs_question',
    phase: 'documentation',
    speaker: 'auditor',
    speakerName: 'Marie Durand',
    text: "L'article 12 exige une traçabilité des décisions. Avez-vous des logs qui permettent de comprendre et auditer les décisions de vos systèmes IA ?",
    mood: 'neutral',
    aiActReference: 'Article 12 - Enregistrement',
    choices: [
      {
        id: 'a',
        text: "Oui, chaque décision est loguée avec : timestamp, données d'entrée, score, et décision finale avec validation humaine. Les logs sont conservés 5 ans. Voici un export anonymisé.",
        shortText: "Oui, chaque décision loguée avec timestamp. Voici l'export",
        requiresDocument: 'logs_decisions',
        effect: { trust: 20, evidence: 20 },
        nextNode: 'doc_documentation_vendor',
        isOptimal: true
      },
      {
        id: 'b',
        text: "On garde les résultats mais pas le détail du raisonnement de l'IA.",
        shortText: "On garde les résultats mais pas le raisonnement IA",
        effect: { trust: -10, evidence: -10 },
        nextNode: 'doc_logs_partial'
      },
      {
        id: 'c',
        text: "On n'a pas mis en place de système de logs spécifique pour l'IA.",
        shortText: "On n'a pas de système de logs spécifique pour l'IA",
        effect: { trust: -20, evidence: -20 },
        nextNode: 'doc_logs_missing'
      }
    ]
  },
  {
    id: 'doc_logs_partial',
    phase: 'documentation',
    speaker: 'auditor',
    speakerName: 'Marie Durand',
    text: "Insuffisant. Vous devez pouvoir expliquer POURQUOI l'IA a fait telle recommandation. Sans cela, impossible de répondre à une contestation.",
    mood: 'concerned',
    effect: { evidence: -5 },
    autoNext: 'doc_documentation_vendor',
    delay: 3500
  },
  {
    id: 'doc_logs_missing',
    phase: 'documentation',
    speaker: 'auditor',
    speakerName: 'Marie Durand',
    text: "C'est une non-conformité majeure. L'article 12 est explicite sur la nécessité d'enregistrement automatique des événements. Comment auditez-vous vos systèmes sans logs ?",
    mood: 'angry',
    effect: { evidence: -15 },
    autoNext: 'doc_documentation_vendor',
    delay: 4000
  },
  {
    id: 'doc_documentation_vendor',
    phase: 'documentation',
    speaker: 'auditor',
    speakerName: 'Marie Durand',
    text: "L'article 13 exige que vous disposiez de la documentation technique fournie par vos fournisseurs. Avez-vous ces informations pour votre système de recrutement ?",
    mood: 'neutral',
    aiActReference: 'Article 13 - Documentation technique',
    choices: [
      {
        id: 'a',
        text: "Voici les dossiers complets : notice d'utilisation, spécifications, informations sur les données d'entraînement, métriques de performance, et instructions de supervision. Tout est classé par système.",
        shortText: "Voici les dossiers complets classés par système",
        requiresDocument: 'doc_technique_rh',
        effect: { trust: 25, evidence: 20 },
        nextNode: 'entretiens_start',
        isOptimal: true
      },
      {
        id: 'b',
        text: "Nous avons les notices d'utilisation et quelques specs, mais pas les informations sur les données d'entraînement.",
        shortText: "On a les notices, pas les infos données d'entraînement",
        effect: { trust: -10, evidence: -10 },
        nextNode: 'doc_vendor_incomplete'
      },
      {
        id: 'c',
        text: "Nous utilisons ces outils mais nous n'avons pas demandé de documentation détaillée.",
        shortText: "On n'a pas demandé de documentation détaillée",
        effect: { trust: -25, evidence: -20 },
        nextNode: 'doc_vendor_missing'
      }
    ]
  },
  {
    id: 'doc_vendor_incomplete',
    phase: 'documentation',
    speaker: 'auditor',
    speakerName: 'Marie Durand',
    text: "C'est insuffisant. Vous devez exiger ces informations de vos fournisseurs. C'est une obligation légale. Avez-vous formalisé cette demande ?",
    mood: 'concerned',
    triggerEvent: 'vendor_email',
    autoNext: 'entretiens_start',
    delay: 3500
  },
  {
    id: 'doc_vendor_missing',
    phase: 'documentation',
    speaker: 'auditor',
    speakerName: 'Marie Durand',
    text: "C'est un manquement sérieux. En tant que déployeur, vous DEVEZ obtenir cette documentation. Comment pouvez-vous évaluer la conformité sans comprendre le fonctionnement ?",
    mood: 'angry',
    effect: { evidence: -10 },
    autoNext: 'entretiens_start',
    delay: 4000
  },

  // ========================================
  // PHASE 5: ENTRETIENS (35 nodes)
  // ========================================
  {
    id: 'entretiens_start',
    phase: 'entretiens',
    speaker: 'system',
    text: "💬 PHASE D'ENTRETIENS APPROFONDIS\n\nL'auditrice va maintenant tester vos processus en situation réelle. Démonstrations, questions pièges, vérifications concrètes.",
    autoNext: 'entretiens_supervision_intro',
    delay: 2500,
    isCheckpoint: true
  },
  {
    id: 'entretiens_supervision_intro',
    phase: 'entretiens',
    speaker: 'auditor',
    speakerName: 'Marie Durand',
    text: "L'article 14 est fondamental : la supervision humaine. Pour vos systèmes haut risque, comment garantissez-vous qu'un humain reste dans la boucle de décision ?",
    mood: 'serious',
    aiActReference: 'Article 14 - Supervision humaine',
    tip: "La supervision humaine signifie : comprendre le système, surveiller son fonctionnement, pouvoir intervenir et annuler.",
    choices: [
      {
        id: 'a',
        text: "Pour le recrutement : l'IA propose un score et un classement, mais JAMAIS de décision automatique. Un recruteur humain formé examine chaque dossier et prend la décision finale. Nous loguons chaque validation.",
        shortText: "L'IA propose un score, jamais de décision auto. Humain décide",
        requiresDocument: 'procedures_supervision',
        effect: { trust: 30, evidence: 25 },
        nextNode: 'entretiens_supervision_approved',
        isOptimal: true
      },
      {
        id: 'b',
        text: "Les managers peuvent annuler les décisions de l'IA s'ils ne sont pas d'accord.",
        shortText: "Les managers peuvent annuler les décisions IA",
        effect: { trust: 0, evidence: 0 },
        nextNode: 'entretiens_supervision_clarify'
      },
      {
        id: 'c',
        text: "Pour les candidatures clairement non qualifiées, le système rejette automatiquement. Ça fait gagner du temps.",
        shortText: "Le système rejette automatiquement les CV non qualifiés",
        effect: { trust: -35, evidence: -30, stress: 20 },
        nextNode: 'entretiens_supervision_violation',
        isCriticalMistake: true
      }
    ]
  },
  {
    id: 'entretiens_supervision_approved',
    phase: 'entretiens',
    speaker: 'auditor',
    speakerName: 'Marie Durand',
    text: "*Elle note avec satisfaction* C'est exactement ce que demande le règlement. L'IA comme outil d'aide, l'humain comme décideur. Et les recruteurs sont-ils formés à challenger les recommandations ?",
    mood: 'pleased',
    effect: { trust: 5 },
    choices: [
      {
        id: 'a',
        text: "Oui, nous avons un programme de formation spécifique sur l'automation bias. Voici les attestations et le contenu du module.",
        shortText: "Oui, programme sur l'automation bias. Voici les attestations",
        requiresDocument: 'attestations',
        effect: { trust: 15, evidence: 15 },
        nextNode: 'entretiens_demo_request',
        isOptimal: true
      },
      {
        id: 'b',
        text: "Ils ont reçu une présentation du système lors de son déploiement.",
        shortText: "Présentation du système lors du déploiement",
        effect: { trust: -5 },
        nextNode: 'entretiens_demo_request'
      }
    ]
  },
  {
    id: 'entretiens_supervision_clarify',
    phase: 'entretiens',
    speaker: 'auditor',
    speakerName: 'Marie Durand',
    text: "Override en cas de désaccord, c'est bien. Mais par défaut, si le manager ne dit rien, c'est l'IA qui décide ou l'humain ?",
    mood: 'concerned',
    choices: [
      {
        id: 'a',
        text: "L'humain. Une candidature non validée explicitement par le recruteur n'avance pas dans le processus.",
        shortText: "L'humain. Sans validation explicite, ça n'avance pas",
        effect: { trust: 15, evidence: 10 },
        nextNode: 'entretiens_demo_request'
      },
      {
        id: 'b',
        text: "En pratique, les recruteurs suivent généralement les recommandations de l'IA...",
        shortText: "En pratique, les recruteurs suivent généralement l'IA...",
        effect: { trust: -20, evidence: -15 },
        nextNode: 'entretiens_supervision_concern'
      }
    ]
  },
  {
    id: 'entretiens_supervision_violation',
    phase: 'entretiens',
    speaker: 'auditor',
    speakerName: 'Marie Durand',
    text: "*Elle interrompt ses notes et vous fixe* Un rejet AUTOMATIQUE sans intervention humaine pour un système à haut risque ? Article 14 : les systèmes haut risque doivent être supervisés par des personnes physiques. Un rejet automatique n'est PAS de la supervision.",
    mood: 'angry',
    effect: { trust: -25, evidence: -20 },
    aiActReference: 'Article 14.3',
    autoNext: 'entretiens_demo_request',
    delay: 5000
  },
  {
    id: 'entretiens_supervision_concern',
    phase: 'entretiens',
    speaker: 'auditor',
    speakerName: 'Marie Durand',
    text: "C'est ce qu'on appelle 'automation bias'. La tendance à faire aveuglément confiance à la machine. La supervision doit être effective, pas une simple formalité.",
    mood: 'concerned',
    effect: { evidence: -10 },
    autoNext: 'entretiens_demo_request',
    delay: 3500
  },
  {
    id: 'entretiens_demo_request',
    phase: 'entretiens',
    speaker: 'auditor',
    speakerName: 'Marie Durand',
    text: "Je souhaite maintenant voir le système de recrutement en fonctionnement. Pouvez-vous me faire une démonstration live ?",
    mood: 'neutral',
    triggerEvent: 'system_crash_live',
    choices: [
      {
        id: 'a',
        text: "Bien sûr. *Vous ouvrez l'interface* Voici le tableau de bord d'un recruteur. Je vais vous montrer le parcours complet d'analyse d'une candidature.",
        shortText: "Bien sûr, voici le tableau de bord. Je vous montre le parcours",
        effect: { trust: 15, evidence: 10 },
        nextNode: 'entretiens_demo_start',
        isOptimal: true
      },
      {
        id: 'b',
        text: "Je n'ai pas les accès en production. Je peux vous montrer notre environnement de test.",
        shortText: "Je n'ai pas les accès prod. Voici l'environnement de test",
        effect: { trust: -10, evidence: -5 },
        nextNode: 'entretiens_demo_test'
      },
      {
        id: 'c',
        text: "C'est compliqué, le système est géré par notre fournisseur en SaaS.",
        shortText: "C'est compliqué, le système est en SaaS chez le fournisseur",
        effect: { trust: -25, evidence: -20, stress: 15 },
        nextNode: 'entretiens_demo_refused',
        isRisky: true
      }
    ]
  },
  {
    id: 'entretiens_demo_start',
    phase: 'entretiens',
    speaker: 'system',
    text: "*Vous lancez la démonstration. L'interface s'affiche. L'auditrice observe attentivement chaque écran, prenant des notes régulières.*",
    autoNext: 'entretiens_demo_score',
    delay: 2500
  },
  {
    id: 'entretiens_demo_test',
    phase: 'entretiens',
    speaker: 'auditor',
    speakerName: 'Marie Durand',
    text: "Un environnement de test peut différer de la production. Mais montrez-moi quand même. Qui a accès à la vraie production dans votre organisation ?",
    mood: 'concerned',
    effect: { trust: -5 },
    autoNext: 'entretiens_demo_score',
    delay: 3000
  },
  {
    id: 'entretiens_demo_refused',
    phase: 'entretiens',
    speaker: 'auditor',
    speakerName: 'Marie Durand',
    text: "Vous déployez un système que vous ne pouvez pas démontrer ? L'article 29 impose de comprendre le fonctionnement. Comment formez-vous vos utilisateurs si vous n'y avez pas accès vous-même ?",
    mood: 'angry',
    effect: { trust: -15, evidence: -15 },
    autoNext: 'entretiens_demo_score',
    delay: 4000
  },
  {
    id: 'entretiens_demo_score',
    phase: 'entretiens',
    speaker: 'auditor',
    speakerName: 'Marie Durand',
    text: "Je vois que le système attribue un 'score d'adéquation' aux candidats. Pouvez-vous m'expliquer comment ce score est calculé ? Quels critères, quelles pondérations ?",
    mood: 'neutral',
    triggerMiniGame: 'quick_answer_1',
    choices: [
      {
        id: 'a',
        text: "Le score combine : correspondance compétences (40%), expérience pertinente (30%), formation (20%), et signaux comportementaux du CV (10%). Voici la documentation technique.",
        shortText: "Compétences 40%, expérience 30%, formation 20%. Voici la doc",
        requiresDocument: 'doc_technique_rh',
        effect: { trust: 25, evidence: 20 },
        nextNode: 'entretiens_demo_sensitive',
        isOptimal: true
      },
      {
        id: 'b',
        text: "C'est un algorithme propriétaire du fournisseur. On n'a pas tous les détails.",
        shortText: "Algorithme propriétaire, on n'a pas tous les détails",
        effect: { trust: -20, evidence: -20 },
        nextNode: 'entretiens_explainability_issue'
      },
      {
        id: 'c',
        text: "Je ne suis pas data scientist, je ne peux pas expliquer les détails techniques.",
        shortText: "Je ne suis pas data scientist, je ne peux pas expliquer",
        effect: { trust: -25, evidence: -15, stress: 10 },
        nextNode: 'entretiens_competence_issue'
      }
    ]
  },
  {
    id: 'entretiens_explainability_issue',
    phase: 'entretiens',
    speaker: 'auditor',
    speakerName: 'Marie Durand',
    text: "Un algorithme 'boîte noire' pose un problème d'explicabilité. Si un candidat conteste son rejet, comment lui expliquez-vous la décision ?",
    mood: 'concerned',
    effect: { evidence: -10 },
    autoNext: 'entretiens_demo_sensitive',
    delay: 3500
  },
  {
    id: 'entretiens_competence_issue',
    phase: 'entretiens',
    speaker: 'auditor',
    speakerName: 'Marie Durand',
    text: "En tant que responsable conformité, vous DEVEZ comprendre le fonctionnement des systèmes. Sinon, comment évaluez-vous les risques ? Qui a cette compétence chez vous ?",
    mood: 'impatient',
    effect: { trust: -10 },
    autoNext: 'entretiens_demo_sensitive',
    delay: 3500
  },
  {
    id: 'entretiens_demo_sensitive',
    phase: 'entretiens',
    speaker: 'auditor',
    speakerName: 'Marie Durand',
    text: "Question cruciale : le système a-t-il accès à des données sensibles comme le genre, l'âge, ou la photo des candidats ?",
    mood: 'serious',
    choices: [
      {
        id: 'a',
        text: "Non. Nous avons volontairement exclu ces données. Pas de photos, pas de noms, pas d'adresses, pas de dates de naissance. C'est un choix de design pour minimiser les risques.",
        shortText: "Non, pas de photos ni noms ni âge. Choix de design",
        effect: { trust: 30, evidence: 25 },
        nextNode: 'entretiens_demo_approved',
        isOptimal: true
      },
      {
        id: 'b',
        text: "Il a accès au CV complet, donc potentiellement au prénom et à des indices d'âge.",
        shortText: "Accès au CV complet, donc potentiellement prénom et âge",
        effect: { trust: -10, evidence: -10 },
        nextNode: 'entretiens_sensitive_risk'
      },
      {
        id: 'c',
        text: "Oui, mais on fait confiance à l'algorithme pour ne pas en tenir compte.",
        shortText: "Oui, mais l'algorithme n'en tient pas compte",
        effect: { trust: -30, evidence: -25, stress: 15 },
        nextNode: 'entretiens_sensitive_problem',
        isRisky: true
      }
    ]
  },
  {
    id: 'entretiens_demo_approved',
    phase: 'entretiens',
    speaker: 'auditor',
    speakerName: 'Marie Durand',
    text: "*Elle hoche la tête avec approbation* C'est une excellente approche de 'privacy by design'. Vous avez compris que la meilleure façon d'éviter les biais est de ne pas donner accès aux données sensibles.",
    mood: 'pleased',
    effect: { trust: 10, evidence: 10 },
    autoNext: 'entretiens_incident_question',
    delay: 3500
  },
  {
    id: 'entretiens_sensitive_risk',
    phase: 'entretiens',
    speaker: 'auditor',
    speakerName: 'Marie Durand',
    text: "Le prénom peut révéler le genre et parfois l'origine. Avez-vous testé si le modèle utilise ces signaux ?",
    mood: 'concerned',
    effect: { evidence: -5 },
    autoNext: 'entretiens_incident_question',
    delay: 3000
  },
  {
    id: 'entretiens_sensitive_problem',
    phase: 'entretiens',
    speaker: 'auditor',
    speakerName: 'Marie Durand',
    text: "*Elle prend une longue note* 'Faire confiance à l'algorithme' n'est pas une mesure de conformité. Les algorithmes de ML APPRENNENT des patterns dans les données, y compris des biais historiques.",
    mood: 'angry',
    effect: { trust: -20, evidence: -15 },
    autoNext: 'entretiens_incident_question',
    delay: 4000
  },
  {
    id: 'entretiens_incident_question',
    phase: 'entretiens',
    speaker: 'auditor',
    speakerName: 'Marie Durand',
    text: "Dernière grande section : la gestion des incidents. L'article 62 impose des obligations de notification. Avez-vous une procédure formalisée en cas de dysfonctionnement grave ?",
    mood: 'neutral',
    aiActReference: 'Article 62 - Notification des incidents',
    choices: [
      {
        id: 'a',
        text: "Oui. Notre procédure couvre : détection, arrêt si nécessaire, notification aux personnes sous 72h, signalement à l'autorité si impact significatif, analyse post-incident. Nous faisons un exercice annuel.",
        shortText: "Oui : détection, arrêt, notification 72h. Exercice annuel",
        requiresDocument: 'procedure_incident',
        effect: { trust: 25, evidence: 25 },
        nextNode: 'entretiens_incident_history',
        isOptimal: true
      },
      {
        id: 'b',
        text: "On arrêterait le système et on appellerait le fournisseur pour comprendre.",
        shortText: "On arrêterait le système et on appellerait le fournisseur",
        effect: { trust: -10, evidence: -10 },
        nextNode: 'entretiens_incident_weak'
      },
      {
        id: 'c',
        text: "On n'a jamais eu d'incident, donc on n'a pas formalisé de procédure.",
        shortText: "Jamais eu d'incident, pas de procédure formalisée",
        effect: { trust: -20, evidence: -20 },
        nextNode: 'entretiens_incident_missing'
      }
    ]
  },
  {
    id: 'entretiens_incident_history',
    phase: 'entretiens',
    speaker: 'auditor',
    speakerName: 'Marie Durand',
    text: "Très bien. Avez-vous déjà eu des incidents à déclarer ? Pouvez-vous me montrer votre registre ?",
    mood: 'neutral',
    choices: [
      {
        id: 'a',
        text: "Notre registre recense 3 incidents mineurs sur 18 mois : un faux positif de fraude, un bug d'affichage, une latence anormale. Aucun n'a nécessité de notification externe. Voici les analyses post-incident.",
        shortText: "3 incidents mineurs en 18 mois, tous analysés. Voici le registre",
        requiresDocument: 'registre_incidents',
        effect: { trust: 20, evidence: 15 },
        nextNode: 'cloture_start',
        isOptimal: true
      },
      {
        id: 'b',
        text: "Le registre est vide. On n'a vraiment pas eu d'incident.",
        shortText: "Le registre est vide, on n'a vraiment pas eu d'incident",
        effect: { trust: -10, evidence: -5 },
        nextNode: 'entretiens_incident_empty'
      }
    ]
  },
  {
    id: 'entretiens_incident_weak',
    phase: 'entretiens',
    speaker: 'auditor',
    speakerName: 'Marie Durand',
    text: "Appeler le fournisseur est une réaction, pas une procédure. Qui notifie les personnes affectées ? Qui décide de signaler à l'autorité ? Quel est le délai ? Vous devez formaliser tout cela.",
    mood: 'concerned',
    effect: { evidence: -10 },
    autoNext: 'cloture_start',
    delay: 4000
  },
  {
    id: 'entretiens_incident_missing',
    phase: 'entretiens',
    speaker: 'auditor',
    speakerName: 'Marie Durand',
    text: "'Jamais d'incident' n'est pas une excuse. C'est comme dire qu'on n'a pas besoin d'extincteur parce qu'il n'y a jamais eu d'incendie. L'absence de préparation est un risque en soi.",
    mood: 'impatient',
    effect: { evidence: -15 },
    autoNext: 'cloture_start',
    delay: 4000
  },
  {
    id: 'entretiens_incident_empty',
    phase: 'entretiens',
    speaker: 'auditor',
    speakerName: 'Marie Durand',
    text: "18 mois d'exploitation sans aucun incident ? C'est soit remarquable, soit un signe que les incidents ne sont pas détectés ou reportés. Avez-vous des mécanismes de détection d'anomalies ?",
    mood: 'concerned',
    choices: [
      {
        id: 'a',
        text: "Oui, nous avons des alertes automatiques sur les métriques clés : taux de rejet anormalement élevé, temps de réponse, disparités statistiques.",
        shortText: "Oui, alertes automatiques sur les métriques clés",
        effect: { trust: 10, evidence: 10 },
        nextNode: 'cloture_start'
      },
      {
        id: 'b',
        text: "Pas de système automatisé. On compte sur les remontées des utilisateurs.",
        shortText: "Pas de système auto, on compte sur les remontées utilisateurs",
        effect: { trust: -10 },
        nextNode: 'cloture_start'
      }
    ]
  },

  // ========================================
  // PHASE 6: CLOTURE (15 nodes)
  // ========================================
  {
    id: 'cloture_start',
    phase: 'cloture',
    speaker: 'system',
    text: "⚖️ PHASE DE CLÔTURE\n\nL'audit touche à sa fin. L'auditrice va rendre ses conclusions préliminaires. Le moment de vérité approche.",
    autoNext: 'cloture_self_assessment',
    delay: 2500,
    isCheckpoint: true
  },
  {
    id: 'cloture_self_assessment',
    phase: 'cloture',
    speaker: 'auditor',
    speakerName: 'Marie Durand',
    text: "Nous arrivons à la fin de l'audit. Avant de vous donner mes conclusions, j'aimerais connaître votre auto-évaluation. Quels sont, selon vous, vos principaux points d'amélioration ?",
    mood: 'neutral',
    choices: [
      {
        id: 'a',
        text: "Notre auto-évaluation identifie trois axes prioritaires : 1) Finaliser les AIPD manquantes sous 60 jours, 2) Renforcer la formation des équipes métier, 3) Améliorer la traçabilité. Voici notre plan d'action chiffré.",
        shortText: "3 axes : AIPD sous 60j, formation, traçabilité. Voici le plan",
        effect: { trust: 25, evidence: 20 },
        nextNode: 'cloture_self_approved',
        isOptimal: true
      },
      {
        id: 'b',
        text: "On sait qu'on doit améliorer la documentation. C'est en cours.",
        shortText: "La documentation à améliorer. C'est en cours",
        effect: { trust: 5, evidence: 5 },
        nextNode: 'cloture_partial'
      },
      {
        id: 'c',
        text: "Je pense qu'on est plutôt bien. On attend vos retours.",
        shortText: "On est plutôt bien. On attend vos retours",
        effect: { trust: -20, evidence: -10 },
        nextNode: 'cloture_no_awareness'
      }
    ]
  },
  {
    id: 'cloture_self_approved',
    phase: 'cloture',
    speaker: 'auditor',
    speakerName: 'Marie Durand',
    text: "*Elle examine le plan* C'est exactement ce que j'attends. Une organisation qui connaît ses faiblesses et a un plan pour les corriger est sur la bonne voie.",
    mood: 'pleased',
    effect: { trust: 10 },
    autoNext: 'cloture_future_question',
    delay: 3000
  },
  {
    id: 'cloture_partial',
    phase: 'cloture',
    speaker: 'auditor',
    speakerName: 'Marie Durand',
    text: "La documentation est effectivement un point. Mais avez-vous identifié les lacunes spécifiques ? Un plan sans actions datées reste un vœu pieux.",
    mood: 'neutral',
    autoNext: 'cloture_future_question',
    delay: 3000
  },
  {
    id: 'cloture_no_awareness',
    phase: 'cloture',
    speaker: 'auditor',
    speakerName: 'Marie Durand',
    text: "*Elle hausse un sourcil* L'auto-évaluation est une compétence clé en conformité. Attendre qu'un auditeur vous dise quoi améliorer n'est pas une stratégie durable.",
    mood: 'impatient',
    effect: { trust: -10 },
    autoNext: 'cloture_future_question',
    delay: 3500
  },
  {
    id: 'cloture_future_question',
    phase: 'cloture',
    speaker: 'auditor',
    speakerName: 'Marie Durand',
    text: "Dernière question : comment comptez-vous maintenir votre conformité dans le temps ? Le règlement évolue, vos systèmes aussi.",
    mood: 'neutral',
    triggerEvent: 'last_chance',
    choices: [
      {
        id: 'a',
        text: "Nous avons mis en place : veille réglementaire via alertes et cabinet spécialisé, revues trimestrielles du registre, budget formation sanctuarisé, audits internes annuels. Prochaine revue dans 6 semaines.",
        shortText: "Veille réglementaire, revues trimestrielles, audits annuels",
        effect: { trust: 20, evidence: 15 },
        nextNode: 'cloture_future_approved',
        isOptimal: true
      },
      {
        id: 'b',
        text: "On suit les newsletters et on réagira si nécessaire.",
        shortText: "On suit les newsletters et on réagira si nécessaire",
        effect: { trust: -10 },
        nextNode: 'cloture_passive'
      },
      {
        id: 'c',
        text: "Le règlement est encore jeune, on verra comment ça évolue.",
        shortText: "Le règlement est jeune, on verra comment ça évolue",
        effect: { trust: -20, evidence: -10 },
        nextNode: 'cloture_attentisme'
      }
    ]
  },
  {
    id: 'cloture_future_approved',
    phase: 'cloture',
    speaker: 'auditor',
    speakerName: 'Marie Durand',
    text: "Une veille active, des revues planifiées, un budget dédié. C'est une organisation qui prend la conformité au sérieux. C'est noté.",
    mood: 'pleased',
    effect: { trust: 5 },
    autoNext: 'cloture_verdict_intro',
    delay: 3000
  },
  {
    id: 'cloture_passive',
    phase: 'cloture',
    speaker: 'auditor',
    speakerName: 'Marie Durand',
    text: "Les newsletters sont un minimum, mais insuffisantes. Je vous encourage à être plus proactif.",
    mood: 'neutral',
    autoNext: 'cloture_verdict_intro',
    delay: 2500
  },
  {
    id: 'cloture_attentisme',
    phase: 'cloture',
    speaker: 'auditor',
    speakerName: 'Marie Durand',
    text: "Le règlement est entré en vigueur. Attendre n'est plus une option. Les premières sanctions tomberont dans les mois qui viennent.",
    mood: 'serious',
    effect: { trust: -5 },
    autoNext: 'cloture_verdict_intro',
    delay: 3000
  },
  {
    id: 'cloture_verdict_intro',
    phase: 'cloture',
    speaker: 'auditor',
    speakerName: 'Marie Durand',
    text: "*Elle rassemble ses notes et vous regarde* Merci pour votre disponibilité et votre coopération tout au long de cet audit.",
    mood: 'neutral',
    autoNext: 'cloture_verdict_announcement',
    delay: 2500
  },
  {
    id: 'cloture_verdict_announcement',
    phase: 'cloture',
    speaker: 'auditor',
    speakerName: 'Marie Durand',
    text: "Je vais maintenant rédiger mon rapport d'audit. Vous le recevrez sous 15 jours ouvrés avec le détail de mes observations et, le cas échéant, les actions correctives à mettre en œuvre.",
    mood: 'neutral',
    autoNext: 'cloture_handshake',
    delay: 3500
  },
  {
    id: 'cloture_handshake',
    phase: 'cloture',
    speaker: 'narrator',
    text: "*L'auditrice rassemble ses affaires, range son ordinateur dans sa mallette, et se lève pour vous serrer la main.*",
    autoNext: 'cloture_final_words',
    delay: 2500
  },
  {
    id: 'cloture_final_words',
    phase: 'cloture',
    speaker: 'auditor',
    speakerName: 'Marie Durand',
    text: "*En vous serrant la main* Une dernière chose : quelle que soit la note finale, cet audit n'est qu'un point de départ. La conformité est un processus continu, pas une destination.",
    mood: 'neutral',
    autoNext: 'cloture_departure',
    delay: 3500
  },
  {
    id: 'cloture_departure',
    phase: 'cloture',
    speaker: 'system',
    text: "L'auditrice quitte le bâtiment. La tension retombe progressivement. C'est terminé.",
    autoNext: 'verdict_transition',
    delay: 2500
  },
  {
    id: 'verdict_transition',
    phase: 'cloture',
    speaker: 'system',
    text: "📊 CALCUL DU VERDICT EN COURS...\n\nAnalyse de vos réponses, documents présentés, et interactions...",
    autoNext: 'final_verdict',
    delay: 3000
  },
  {
    id: 'final_verdict',
    phase: 'cloture',
    speaker: 'system',
    text: "Verdict prêt.",
    delay: 1000
  }
];

// ============================================
// ICONS
// ============================================
const Icons = {
  Clock: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  AlertTriangle: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  Check: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-full h-full"><polyline points="20 6 9 17 4 12"/></svg>,
  X: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  FileText: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>,
  Download: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
  Play: () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full"><polygon points="5 3 19 12 5 21 5 3"/></svg>,
  Pause: () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>,
  RotateCcw: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>,
  Lightbulb: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>,
  Trophy: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>,
  Users: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  Brain: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-2.54"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-2.54"/></svg>,
};

// ============================================
// MAIN COMPONENT
// ============================================
interface Props {
  moduleColor?: string;
  onComplete?: (score: number) => void;
}

export default function AuditSimulationMassive({ moduleColor = '#F97316', onComplete }: Props) {
  // === GAME STATE ===
  const [gamePhase, setGamePhase] = useState<'intro' | 'playing' | 'minigame' | 'event' | 'gameover' | 'verdict'>('intro');
  const [currentNodeId, setCurrentNodeId] = useState<string>('game_start');
  const [currentPhaseIdx, setCurrentPhaseIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  
  // === PLAYER STATS ===
  const [stats, setStats] = useState<GameStats>({
    trust: 50,
    stress: 20,
    evidence: 30,
    time: 2700, // 45 minutes
    reputation: 50,
    documentsPresented: [],
    criticalMistakes: 0,
    perfectAnswers: 0,
    gameOvers: 0,
    miniGamesCompleted: 0,
    bonusDialogues: 0
  });
  
  // === DOCUMENTS ===
  const [documents, setDocuments] = useState<Document[]>(INITIAL_DOCUMENTS);
  const [selectedDocs, setSelectedDocs] = useState<string[]>([]);
  
  // === DIALOGUE ===
  const [dialogHistory, setDialogHistory] = useState<Array<{
    speaker: string;
    speakerName?: string;
    text: string;
    mood?: string;
    isPlayer?: boolean;
    isNarrator?: boolean;
    isInternal?: boolean;
  }>>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [showChoices, setShowChoices] = useState(false);
  const [currentChoices, setCurrentChoices] = useState<DialogChoice[]>([]);
  
  // === EVENTS & MINIGAMES ===
  const [showEvent, setShowEvent] = useState<RandomEvent | null>(null);
  const [eventOutcome, setEventOutcome] = useState<string | null>(null);
  const [usedEvents, setUsedEvents] = useState<string[]>([]);
  const [currentMiniGame, setCurrentMiniGame] = useState<MiniGame | null>(null);
  const [miniGameResult, setMiniGameResult] = useState<'success' | 'failure' | null>(null);
  
  // === GAME OVER ===
  const [currentGameOver, setCurrentGameOver] = useState<GameOver | null>(null);
  
  // === UI STATE ===
  const [showTip, setShowTip] = useState(false);
  const [currentTip, setCurrentTip] = useState<string>('');
  const [showFeedback, setShowFeedback] = useState<string | null>(null);
  const [prepTime, setPrepTime] = useState(300);
  const [showDocPanel, setShowDocPanel] = useState(false);
  
  const chatRef = useRef<HTMLDivElement>(null);
  const currentNode = DIALOGUE_SCENARIO.find(n => n.id === currentNodeId);
  const currentPhase = AUDIT_PHASES[currentPhaseIdx];

  // === TIMER EFFECT ===
  useEffect(() => {
    if (gamePhase === 'playing' && !isPaused && stats.time > 0 && !showEvent && !currentMiniGame) {
      const timer = setInterval(() => {
        setStats(s => ({ ...s, time: Math.max(0, s.time - 1) }));
        
        // Random events
        if (Math.random() < 0.001 && usedEvents.length < 8) {
          triggerRandomEvent();
        }
      }, 1000);
      return () => clearInterval(timer);
    }
    
    // Game over on time out
    if (stats.time === 0 && gamePhase === 'playing') {
      handleGameOver('time_out');
    }
  }, [gamePhase, isPaused, stats.time, showEvent, currentMiniGame, usedEvents]);

  // === GAME OVER CHECKS ===
  useEffect(() => {
    if (gamePhase !== 'playing') return;
    
    if (stats.trust <= 0) {
      handleGameOver('trust_zero');
    } else if (stats.stress >= 100) {
      handleGameOver('stress_max');
    } else if (stats.criticalMistakes >= 3) {
      handleGameOver('critical_lie');
    }
  }, [stats.trust, stats.stress, stats.criticalMistakes, gamePhase]);

  // === SCROLL TO BOTTOM ===
  useEffect(() => {
    if (chatRef.current) {
      setTimeout(() => {
        chatRef.current!.scrollTop = chatRef.current!.scrollHeight;
      }, 100);
    }
  }, [dialogHistory, isTyping]);

  // === HANDLE GAME OVER ===
  const handleGameOver = (gameOverId: string) => {
    const gameOver = GAME_OVERS.find(g => g.id === gameOverId);
    if (gameOver) {
      setCurrentGameOver(gameOver);
      setGamePhase('gameover');
      setStats(s => ({ ...s, gameOvers: s.gameOvers + 1 }));
    }
  };

  // === RETRY FROM CHECKPOINT ===
  const retryFromCheckpoint = () => {
    if (currentGameOver?.retryFromNode) {
      setGamePhase('playing');
      setCurrentNodeId(currentGameOver.retryFromNode);
      setCurrentGameOver(null);
      setStats(s => ({
        ...s,
        trust: Math.max(30, s.trust),
        stress: Math.min(70, s.stress),
        time: Math.max(600, s.time)
      }));
      setDialogHistory([]);
      processNode(currentGameOver.retryFromNode);
    }
  };

  // === PROCESS DIALOGUE NODE ===
  const processNode = useCallback((nodeId: string) => {
    const node = DIALOGUE_SCENARIO.find(n => n.id === nodeId);
    if (!node) {
      if (nodeId === 'final_verdict') {
        setGamePhase('verdict');
      }
      return;
    }

    // Update phase
    const phaseIdx = AUDIT_PHASES.findIndex(p => p.id === node.phase);
    if (phaseIdx !== -1 && phaseIdx !== currentPhaseIdx) {
      setCurrentPhaseIdx(phaseIdx);
    }

    // Apply effects
    if (node.effect) {
      setStats(s => ({
        ...s,
        trust: Math.max(0, Math.min(100, s.trust + (node.effect?.trust || 0))),
        stress: Math.max(0, Math.min(100, s.stress + (node.effect?.stress || 0))),
        evidence: Math.max(0, Math.min(100, s.evidence + (node.effect?.evidence || 0))),
        time: Math.max(0, s.time + (node.effect?.time || 0)),
        reputation: Math.max(0, Math.min(100, s.reputation + (node.effect?.reputation || 0)))
      }));
    }

    // Set tip
    if (node.tip) {
      setCurrentTip(node.tip);
    } else {
      setCurrentTip('');
    }

    // Mini-game logic désactivée pour éviter les blocages
    // Les mini-games sont maintenant déclenchés via des événements spécifiques
    // if (node.triggerMiniGame) { ... }

    // Process based on speaker type
    const speakerTypes = ['auditor', 'dg', 'dsi', 'drh', 'rh', 'colleague', 'legal', 'vendor', 'intern', 'phone'];
    
    if (speakerTypes.includes(node.speaker)) {
      setIsTyping(true);
      setShowChoices(false);
      
      const typingDuration = 1200 + Math.min(node.text.length * 12, 2500);
      
      setTimeout(() => {
        setIsTyping(false);
        setDialogHistory(h => [...h, {
          speaker: node.speaker,
          speakerName: node.speakerName,
          text: node.text,
          mood: node.mood
        }]);
        
        if (node.choices && node.choices.length > 0) {
          setTimeout(() => {
            setCurrentChoices(node.choices!);
            setShowChoices(true);
          }, 400);
        } else if (node.autoNext) {
          setTimeout(() => {
            processNode(node.autoNext!);
          }, node.delay || 2000);
        }
      }, typingDuration);
    } else if (node.speaker === 'system' || node.speaker === 'narrator') {
      setDialogHistory(h => [...h, {
        speaker: node.speaker,
        text: node.text,
        isNarrator: node.speaker === 'narrator'
      }]);
      
      if (node.autoNext) {
        const nextDelay = node.delay || 2000;
        console.log('AutoNext vers:', node.autoNext, 'dans', nextDelay, 'ms');
        setTimeout(() => {
          processNode(node.autoNext!);
        }, nextDelay);
      } else if (node.choices && node.choices.length > 0) {
        setTimeout(() => {
          setCurrentChoices(node.choices!);
          setShowChoices(true);
        }, 500);
      } else if (node.id === 'final_verdict') {
        setTimeout(() => setGamePhase('verdict'), 1500);
      }
    } else if (node.speaker === 'internal') {
      setDialogHistory(h => [...h, {
        speaker: 'internal',
        text: node.text,
        isInternal: true
      }]);
      
      if (node.autoNext) {
        setTimeout(() => processNode(node.autoNext!), node.delay || 2000);
      } else if (node.choices) {
        setTimeout(() => {
          setCurrentChoices(node.choices!);
          setShowChoices(true);
        }, 500);
      }
    } else if (node.speaker === 'player') {
      // Force l'affichage des choix avec un petit délai pour s'assurer du rendu
      if (node.choices && node.choices.length > 0) {
        setTimeout(() => {
          setCurrentChoices(node.choices!);
          setShowChoices(true);
        }, 100);
      }
    }

    setCurrentNodeId(nodeId);
  }, [currentPhaseIdx]);

  // === START GAME ===
  const startGame = () => {
    setGamePhase('playing');
    processNode('game_start');
  };

  // === HANDLE CHOICE ===
  const handleChoice = (choice: DialogChoice) => {
    setShowChoices(false);
    setCurrentChoices([]);
    setShowTip(false);

    // Check document requirement
    if (choice.requiresDocument) {
      const doc = documents.find(d => d.id === choice.requiresDocument);
      if (!doc?.isReady) {
        setShowFeedback("⚠️ Document non disponible ! Votre réponse perd en crédibilité.");
        setTimeout(() => setShowFeedback(null), 3000);
        // Apply penalty
        setStats(s => ({
          ...s,
          trust: Math.max(0, s.trust - 10),
          evidence: Math.max(0, s.evidence - 10)
        }));
      }
    }

    // Add player message
    setDialogHistory(h => [...h, {
      speaker: 'player',
      text: choice.shortText || choice.text,
      isPlayer: true
    }]);

    // Apply choice effects
    setStats(s => ({
      ...s,
      trust: Math.max(0, Math.min(100, s.trust + (choice.effect.trust || 0))),
      stress: Math.max(0, Math.min(100, s.stress + (choice.effect.stress || 0))),
      evidence: Math.max(0, Math.min(100, s.evidence + (choice.effect.evidence || 0))),
      reputation: Math.max(0, Math.min(100, s.reputation + (choice.effect.reputation || 0))),
      time: Math.max(0, s.time + (choice.effect.time || 0)),
      perfectAnswers: choice.isOptimal ? s.perfectAnswers + 1 : s.perfectAnswers,
      criticalMistakes: choice.isCriticalMistake ? s.criticalMistakes + 1 : s.criticalMistakes
    }));

    // Track document presentation
    if (choice.requiresDocument) {
      setStats(s => ({
        ...s,
        documentsPresented: [...s.documentsPresented, choice.requiresDocument!]
      }));
    }

    // Show feedback
    if (choice.feedback) {
      setShowFeedback(choice.feedback);
      setTimeout(() => setShowFeedback(null), 4000);
    }

    // Check for game over
    if (choice.isGameOver) {
      setTimeout(() => handleGameOver('critical_lie'), 1500);
      return;
    }

    // Process next node
    setTimeout(() => {
      processNode(choice.nextNode);
    }, 1000);
  };

  // === RANDOM EVENTS ===
  const triggerRandomEvent = () => {
    const currentPhaseName = AUDIT_PHASES[currentPhaseIdx]?.id || 'preparation';
    const available = RANDOM_EVENTS.filter(e => 
      !usedEvents.includes(e.id) && 
      e.phase.includes(currentPhaseName)
    );
    
    if (available.length === 0) return;
    
    const event = available[Math.floor(Math.random() * available.length)];
    setUsedEvents(u => [...u, event.id]);
    setShowEvent(event);
    setGamePhase('event');
    setStats(s => ({ ...s, stress: Math.min(100, s.stress + 5) }));
  };

  const handleEventChoice = (choice: RandomEvent['choices'][0]) => {
    setStats(s => ({
      ...s,
      trust: Math.max(0, Math.min(100, s.trust + (choice.effect.trust || 0))),
      stress: Math.max(0, Math.min(100, s.stress + (choice.effect.stress || 0))),
      time: Math.max(0, s.time + (choice.effect.time || 0)),
      evidence: Math.max(0, Math.min(100, s.evidence + (choice.effect.evidence || 0))),
      reputation: Math.max(0, Math.min(100, s.reputation + (choice.effect.reputation || 0)))
    }));
    
    setEventOutcome(choice.outcome);
    
    if (choice.isGameOver) {
      setTimeout(() => {
        setShowEvent(null);
        setEventOutcome(null);
        handleGameOver('critical_lie');
      }, 2500);
    } else {
      setTimeout(() => {
        setShowEvent(null);
        setEventOutcome(null);
        setGamePhase('playing');
      }, 2500);
    }
  };

  // === MINI-GAME HANDLERS ===
  const handleMiniGameComplete = (success: boolean) => {
    const game = currentMiniGame!;
    
    if (success) {
      setStats(s => ({
        ...s,
        trust: Math.max(0, Math.min(100, s.trust + (game.reward.trust || 0))),
        evidence: Math.max(0, Math.min(100, s.evidence + (game.reward.evidence || 0))),
        stress: Math.max(0, Math.min(100, s.stress + (game.reward.stress || 0))),
        time: Math.max(0, s.time + (game.reward.time || 0)),
        miniGamesCompleted: s.miniGamesCompleted + 1
      }));
      setMiniGameResult('success');
    } else {
      setStats(s => ({
        ...s,
        trust: Math.max(0, Math.min(100, s.trust + (game.penalty.trust || 0))),
        evidence: Math.max(0, Math.min(100, s.evidence + (game.penalty.evidence || 0))),
        stress: Math.max(0, Math.min(100, s.stress + (game.penalty.stress || 0))),
        time: Math.max(0, s.time + (game.penalty.time || 0))
      }));
      setMiniGameResult('failure');
    }
    
    setTimeout(() => {
      setCurrentMiniGame(null);
      setMiniGameResult(null);
      setGamePhase('playing');
    }, 2000);
  };

  // === FORMATTING HELPERS ===
  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) return `${h}h${m.toString().padStart(2, '0')}`;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const getGrade = () => {
    const score = Math.round((stats.trust * 0.35 + stats.evidence * 0.35 + (100 - stats.stress) * 0.15 + stats.reputation * 0.15));
    const bonuses = stats.perfectAnswers * 2 - stats.criticalMistakes * 10;
    const finalScore = Math.max(0, Math.min(100, score + bonuses));
    
    if (finalScore >= 90) return { grade: 'A+', label: 'Exemplaire', color: '#22C55E', emoji: '🏆', passed: true, description: 'Conformité exemplaire. Aucune action corrective requise.' };
    if (finalScore >= 80) return { grade: 'A', label: 'Excellent', color: '#22C55E', emoji: '🌟', passed: true, description: 'Très bonne maîtrise. Quelques points d\'amélioration mineurs.' };
    if (finalScore >= 70) return { grade: 'B', label: 'Satisfaisant', color: '#84CC16', emoji: '✅', passed: true, description: 'Conformité satisfaisante. Plan d\'action recommandé sous 90 jours.' };
    if (finalScore >= 55) return { grade: 'C', label: 'Acceptable', color: '#EAB308', emoji: '⚠️', passed: true, description: 'Conformité partielle. Actions correctives requises sous 60 jours.' };
    if (finalScore >= 40) return { grade: 'D', label: 'Insuffisant', color: '#F97316', emoji: '❌', passed: false, description: 'Non-conformités significatives. Mise en demeure sous 30 jours.' };
    return { grade: 'F', label: 'Critique', color: '#EF4444', emoji: '🚨', passed: false, description: 'Non-conformité majeure. Risque de suspension d\'activité IA.' };
  };

  const getMoodEmoji = (mood?: string) => {
    const moods: Record<string, string> = {
      friendly: '😊', pleased: '😌', neutral: '😐', concerned: '🤨',
      impatient: '😤', serious: '😑', angry: '😠', worried: '😰',
      stressed: '😓', helpful: '🙂'
    };
    return moods[mood || 'neutral'] || '👤';
  };

  const getSpeakerInfo = (speaker: string, speakerName?: string) => {
    if (speakerName) {
      const char = CHARACTERS.find(c => speakerName.includes(c.name));
      return { name: speakerName, avatar: char?.avatar || '👤' };
    }
    const char = CHARACTERS.find(c => c.id === speaker);
    if (char) return { name: char.name, avatar: char.avatar };
    return { name: 'Système', avatar: '💻' };
  };

  // ============================================
  // RENDER: INTRO SCREEN
  // ============================================
  if (gamePhase === 'intro') {
    return (
      <div className="space-y-4 p-3">
        {/* Header */}
        <div className="text-center">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-28 h-28 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-lg shadow-orange-500/30"
          >
            <span className="text-6xl">⚖️</span>
          </motion.div>
          <h2 className="text-2xl font-bold mb-2">Simulation d'Audit AI Act</h2>
          <p className="text-white/60 text-sm">Expérience immersive complète • ~45 minutes</p>
        </div>

        {/* Scenario */}
        <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/30 rounded-xl p-4">
          <h3 className="font-bold mb-2 flex items-center gap-2 text-sm">
            <span>📋</span> Scénario
          </h3>
          <p className="text-white/80 text-sm leading-relaxed">
            Vous êtes <strong>Responsable Conformité IA</strong> d'une entreprise de 500 employés. 
            Ce matin, vous recevez une notification d'audit surprise de la Commission Nationale de l'IA. 
            L'auditrice arrive dans 5 heures. Votre mission : préparer l'audit, accueillir l'auditrice, 
            répondre à ses questions, et obtenir un verdict favorable.
          </p>
        </div>

        {/* Stats preview */}
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-white/5 rounded-xl p-3 text-center">
            <div className="text-2xl mb-1">🎭</div>
            <div className="font-bold">6 Phases</div>
            <div className="text-white/40 text-xs">Notification → Verdict</div>
          </div>
          <div className="bg-white/5 rounded-xl p-3 text-center">
            <div className="text-2xl mb-1">👥</div>
            <div className="font-bold">8 Personnages</div>
            <div className="text-white/40 text-xs">Auditrice, DG, DSI...</div>
          </div>
          <div className="bg-white/5 rounded-xl p-3 text-center">
            <div className="text-2xl mb-1">📄</div>
            <div className="font-bold">35+ Documents</div>
            <div className="text-white/40 text-xs">À préparer et présenter</div>
          </div>
          <div className="bg-white/5 rounded-xl p-3 text-center">
            <div className="text-2xl mb-1">⚡</div>
            <div className="font-bold">20+ Événements</div>
            <div className="text-white/40 text-xs">Crises et opportunités</div>
          </div>
        </div>

        {/* Features */}
        <div className="bg-white/5 rounded-xl p-3">
          <h3 className="font-bold mb-2 text-sm">🎮 Caractéristiques</h3>
          <div className="grid grid-cols-2 gap-1 text-xs text-white/70">
            <div className="flex items-center gap-1"><span>✓</span> 120+ dialogues branchés</div>
            <div className="flex items-center gap-1"><span>✓</span> Mini-jeux intégrés</div>
            <div className="flex items-center gap-1"><span>✓</span> 5 fins possibles</div>
            <div className="flex items-center gap-1"><span>✓</span> Game Over si échec</div>
            <div className="flex items-center gap-1"><span>✓</span> Références AI Act</div>
            <div className="flex items-center gap-1"><span>✓</span> Rapport téléchargeable</div>
          </div>
        </div>

        {/* Characters preview */}
        <div className="bg-white/5 rounded-xl p-3">
          <h3 className="font-bold mb-2 text-sm">👥 Personnages clés</h3>
          <div className="flex flex-wrap gap-2">
            {CHARACTERS.slice(0, 6).map(char => (
              <div key={char.id} className="flex items-center gap-1 bg-white/5 rounded-lg px-2 py-1 text-xs">
                <span>{char.avatar}</span>
                <span className="text-white/70">{char.name.split(' ')[0]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Start button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={startGame}
          className="w-full py-4 rounded-xl font-bold text-lg text-black flex items-center justify-center gap-3 shadow-lg"
          style={{ backgroundColor: moduleColor }}
        >
          <div className="w-6 h-6"><Icons.Play /></div>
          Commencer l'audit
        </motion.button>

        <p className="text-center text-white/40 text-xs">
          💡 Conseil : Lisez attentivement chaque situation. Vos choix ont des conséquences !
        </p>
      </div>
    );
  }

  // ============================================
  // RENDER: GAME OVER SCREEN
  // ============================================
  if (gamePhase === 'gameover' && currentGameOver) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-4">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          className="w-24 h-24 rounded-full bg-red-500/20 flex items-center justify-center text-5xl mb-4"
        >
          {currentGameOver.icon}
        </motion.div>
        
        <h2 className="text-2xl font-bold text-red-400 mb-2">GAME OVER</h2>
        <h3 className="text-xl font-semibold mb-4">{currentGameOver.title}</h3>
        
        <p className="text-white/70 text-center mb-6 max-w-md">
          {currentGameOver.description}
        </p>

        <div className="flex gap-3">
          {currentGameOver.canRetry && (
            <button
              onClick={retryFromCheckpoint}
              className="px-6 py-3 rounded-xl bg-orange-500 text-black font-bold flex items-center gap-2"
            >
              <div className="w-5 h-5"><Icons.RotateCcw /></div>
              Réessayer
            </button>
          )}
          <button
            onClick={() => setGamePhase('verdict')}
            className="px-6 py-3 rounded-xl bg-white/10 font-semibold"
          >
            Voir le bilan
          </button>
        </div>

        <p className="text-white/40 text-sm mt-6">
          Game Overs : {stats.gameOvers + 1} | Erreurs critiques : {stats.criticalMistakes}
        </p>
      </div>
    );
  }

  // ============================================
  // RENDER: MINI-GAME SCREEN
  // ============================================
  if (gamePhase === 'minigame' && currentMiniGame) {
    return (
      <MiniGameComponent 
        game={currentMiniGame}
        onComplete={handleMiniGameComplete}
        result={miniGameResult}
      />
    );
  }

  // ============================================
  // RENDER: VERDICT SCREEN
  // ============================================
  if (gamePhase === 'verdict') {
    const result = getGrade();
    const finalScore = Math.round((stats.trust * 0.35 + stats.evidence * 0.35 + (100 - stats.stress) * 0.15 + stats.reputation * 0.15));

    return (
      <div className="space-y-4 p-3 max-h-[600px] overflow-y-auto">
        {/* Header */}
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-24 h-24 mx-auto mb-4 rounded-full flex items-center justify-center text-5xl"
            style={{ backgroundColor: `${result.color}20` }}
          >
            {result.emoji}
          </motion.div>
          <h2 className="text-2xl font-bold mb-1">Rapport d'Audit</h2>
          <p className="text-white/60 text-sm">Commission Nationale de l'IA</p>
        </div>

        {/* Grade */}
        <div className="bg-white/5 rounded-xl p-4 text-center">
          <div className="text-6xl font-bold mb-2" style={{ color: result.color }}>
            {result.grade}
          </div>
          <div className="text-lg font-semibold" style={{ color: result.color }}>
            {result.label}
          </div>
          <div className="text-white/40 text-sm mt-1">
            Score global : {finalScore}/100
          </div>
        </div>

        {/* Verdict description */}
        <div className={`rounded-xl p-4 border ${result.passed ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
          <h3 className="font-bold mb-1">
            {result.passed ? '✅ Verdict favorable' : '❌ Verdict défavorable'}
          </h3>
          <p className="text-white/70 text-sm">{result.description}</p>
        </div>

        {/* Detailed stats */}
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-white/5 rounded-xl p-3">
            <div className="flex justify-between mb-1 text-sm">
              <span>💚 Confiance</span>
              <span className="font-bold">{stats.trust}%</span>
            </div>
            <div className="h-2 bg-white/10 rounded-full">
              <div className="h-full bg-green-500 rounded-full" style={{ width: `${stats.trust}%` }} />
            </div>
          </div>
          <div className="bg-white/5 rounded-xl p-3">
            <div className="flex justify-between mb-1 text-sm">
              <span>📋 Preuves</span>
              <span className="font-bold">{stats.evidence}%</span>
            </div>
            <div className="h-2 bg-white/10 rounded-full">
              <div className="h-full bg-blue-500 rounded-full" style={{ width: `${stats.evidence}%` }} />
            </div>
          </div>
          <div className="bg-white/5 rounded-xl p-3">
            <div className="flex justify-between mb-1 text-sm">
              <span>⭐ Réputation</span>
              <span className="font-bold">{stats.reputation}%</span>
            </div>
            <div className="h-2 bg-white/10 rounded-full">
              <div className="h-full bg-yellow-500 rounded-full" style={{ width: `${stats.reputation}%` }} />
            </div>
          </div>
          <div className="bg-white/5 rounded-xl p-3">
            <div className="flex justify-between mb-1 text-sm">
              <span>😰 Stress final</span>
              <span className="font-bold">{stats.stress}%</span>
            </div>
            <div className="h-2 bg-white/10 rounded-full">
              <div className="h-full bg-red-500 rounded-full" style={{ width: `${stats.stress}%` }} />
            </div>
          </div>
        </div>

        {/* Performance stats */}
        <div className="bg-white/5 rounded-xl p-4">
          <h3 className="font-bold mb-3 text-sm">📊 Performance</h3>
          <div className="grid grid-cols-3 gap-2 text-center text-sm">
            <div>
              <div className="text-2xl font-bold text-green-400">{stats.perfectAnswers}</div>
              <div className="text-white/40 text-xs">Réponses optimales</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-400">{stats.criticalMistakes}</div>
              <div className="text-white/40 text-xs">Erreurs critiques</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-400">{stats.documentsPresented.length}</div>
              <div className="text-white/40 text-xs">Docs présentés</div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-3 text-center text-sm">
            <div>
              <div className="text-xl font-bold text-purple-400">{stats.miniGamesCompleted}</div>
              <div className="text-white/40 text-xs">Mini-jeux réussis</div>
            </div>
            <div>
              <div className="text-xl font-bold text-orange-400">{stats.gameOvers}</div>
              <div className="text-white/40 text-xs">Game Overs</div>
            </div>
          </div>
        </div>

        {/* Time spent */}
        <div className="text-center text-white/40 text-sm">
          ⏱️ Durée de l'audit : {formatTime(2700 - stats.time)}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={() => {
              const report = `═══════════════════════════════════════════
RAPPORT D'AUDIT AI ACT - SIMULATION
═══════════════════════════════════════════

Date : ${new Date().toLocaleDateString('fr-FR')}
Durée : ${formatTime(2700 - stats.time)}

VERDICT : ${result.grade} - ${result.label}
Score global : ${finalScore}/100

${result.description}

DÉTAIL DES ÉVALUATIONS
───────────────────────
• Confiance auditrice : ${stats.trust}%
• Preuves de conformité : ${stats.evidence}%
• Réputation interne : ${stats.reputation}%
• Gestion du stress : ${100 - stats.stress}%

STATISTIQUES DE PERFORMANCE
───────────────────────
• Réponses optimales : ${stats.perfectAnswers}
• Erreurs critiques : ${stats.criticalMistakes}
• Documents présentés : ${stats.documentsPresented.length}
• Mini-jeux réussis : ${stats.miniGamesCompleted}
• Game Overs : ${stats.gameOvers}

DOCUMENTS PRÉSENTÉS
───────────────────────
${stats.documentsPresented.map(id => {
  const doc = INITIAL_DOCUMENTS.find(d => d.id === id);
  return doc ? `• ${doc.name}` : '';
}).filter(Boolean).join('\n') || '• Aucun document présenté'}

RECOMMANDATIONS
───────────────────────
${result.passed 
  ? `• Maintenir la veille réglementaire
• Poursuivre les audits internes
• Former les nouvelles recrues`
  : `• Finaliser les AIPD manquantes immédiatement
• Formaliser les procédures de supervision
• Mettre en place un registre d'incidents
• Prévoir un audit de suivi sous 60 jours`}

═══════════════════════════════════════════
Rapport généré par le Simulateur AI Act
Formation Conformité IA
═══════════════════════════════════════════`;
              const blob = new Blob([report], { type: 'text/plain;charset=utf-8' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `rapport-audit-ia-${new Date().toISOString().split('T')[0]}.txt`;
              a.click();
            }}
            className="flex-1 py-3 rounded-xl bg-white/10 hover:bg-white/20 font-semibold text-sm flex items-center justify-center gap-2"
          >
            <div className="w-4 h-4"><Icons.Download /></div>
            Télécharger
          </button>
          <button
            onClick={() => onComplete?.(finalScore)}
            className="flex-1 py-3 rounded-xl font-bold text-black text-sm"
            style={{ backgroundColor: moduleColor }}
          >
            Terminer ✓
          </button>
        </div>
      </div>
    );
  }

  // ============================================
  // RENDER: MAIN PLAYING INTERFACE
  // ============================================
  return (
    <div className="flex flex-col h-full min-h-[550px]">
      {/* TOP BAR - Phase & Stats */}
      <div className="flex-shrink-0 mb-2 space-y-2">
        {/* Phase indicator */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-hide">
          {AUDIT_PHASES.map((phase, idx) => (
            <div
              key={phase.id}
              className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs whitespace-nowrap transition-all flex-shrink-0 ${
                idx === currentPhaseIdx
                  ? 'bg-white/15 border border-white/30'
                  : idx < currentPhaseIdx
                    ? 'text-white/50 bg-white/5'
                    : 'text-white/20'
              }`}
            >
              <span>{phase.icon}</span>
              <span className="hidden sm:inline">{phase.name}</span>
            </div>
          ))}
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-4 gap-1.5">
          <div className="bg-white/5 rounded-lg p-1.5">
            <div className="flex items-center justify-between text-[10px] mb-0.5">
              <span>💚 Confiance</span>
              <span className={stats.trust >= 50 ? 'text-green-400' : stats.trust >= 25 ? 'text-yellow-400' : 'text-red-400'}>{stats.trust}%</span>
            </div>
            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
              <motion.div 
                className={`h-full rounded-full ${stats.trust >= 50 ? 'bg-green-500' : stats.trust >= 25 ? 'bg-yellow-500' : 'bg-red-500'}`} 
                animate={{ width: `${stats.trust}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
          <div className="bg-white/5 rounded-lg p-1.5">
            <div className="flex items-center justify-between text-[10px] mb-0.5">
              <span>📋 Preuves</span>
              <span className="text-blue-400">{stats.evidence}%</span>
            </div>
            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-blue-500 rounded-full" 
                animate={{ width: `${stats.evidence}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
          <div className="bg-white/5 rounded-lg p-1.5">
            <div className="flex items-center justify-between text-[10px] mb-0.5">
              <span>😰 Stress</span>
              <span className={stats.stress <= 50 ? 'text-green-400' : stats.stress <= 75 ? 'text-yellow-400' : 'text-red-400'}>{stats.stress}%</span>
            </div>
            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
              <motion.div 
                className={`h-full rounded-full ${stats.stress <= 50 ? 'bg-green-500' : stats.stress <= 75 ? 'bg-yellow-500' : 'bg-red-500'}`} 
                animate={{ width: `${stats.stress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
          <div className="bg-white/5 rounded-lg p-1.5">
            <div className="flex items-center justify-between text-[10px] mb-0.5">
              <span>⏱️</span>
              <span className={`font-mono ${stats.time < 300 ? 'text-red-400 animate-pulse' : 'text-white/70'}`}>{formatTime(stats.time)}</span>
            </div>
            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-purple-500 rounded-full" 
                animate={{ width: `${(stats.time / 2700) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* CHAT AREA */}
      <div className="flex-1 bg-white/5 rounded-xl overflow-hidden flex flex-col min-h-0">
        {/* Messages */}
        <div ref={chatRef} className="flex-1 overflow-y-auto p-3 space-y-3">
          <AnimatePresence mode="popLayout">
            {dialogHistory.map((msg, idx) => {
              const info = getSpeakerInfo(msg.speaker, msg.speakerName);
              
              // System/Narrator messages
              if (msg.speaker === 'system') {
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-3 px-4"
                  >
                    <div className="inline-block bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 rounded-xl px-4 py-2">
                      <p className="text-white/90 text-sm whitespace-pre-wrap">{msg.text}</p>
                    </div>
                  </motion.div>
                );
              }
              
              if (msg.isNarrator) {
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-2"
                  >
                    <p className="text-white/50 text-sm italic">{msg.text}</p>
                  </motion.div>
                );
              }

              if (msg.isInternal) {
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-2"
                  >
                    <div className="inline-block bg-yellow-500/10 border border-yellow-500/30 rounded-xl px-4 py-2">
                      <p className="text-yellow-200/80 text-sm italic">{msg.text}</p>
                    </div>
                  </motion.div>
                );
              }
              
              // Player messages
              if (msg.isPlayer || msg.speaker === 'player') {
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex justify-end"
                  >
                    <div className="bg-blue-500/20 border border-blue-500/30 rounded-2xl rounded-tr-sm p-3 max-w-[85%]">
                      <p className="text-sm">{msg.text}</p>
                    </div>
                  </motion.div>
                );
              }
              
              // Character messages
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex gap-2"
                >
                  <div className="flex-shrink-0 w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-lg">
                    {msg.mood ? getMoodEmoji(msg.mood) : info.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-white/40 mb-1">{info.name}</div>
                    <div className="bg-white/10 rounded-2xl rounded-tl-sm p-3">
                      <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
          
          {/* Typing indicator */}
          <AnimatePresence>
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex gap-2"
              >
                <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-lg">
                  👩‍💼
                </div>
                <div className="bg-white/10 rounded-2xl rounded-tl-sm px-4 py-3">
                  <div className="flex gap-1.5">
                    <motion.span
                      className="w-2 h-2 bg-white/40 rounded-full"
                      animate={{ y: [0, -5, 0] }}
                      transition={{ repeat: Infinity, duration: 0.6, delay: 0 }}
                    />
                    <motion.span
                      className="w-2 h-2 bg-white/40 rounded-full"
                      animate={{ y: [0, -5, 0] }}
                      transition={{ repeat: Infinity, duration: 0.6, delay: 0.15 }}
                    />
                    <motion.span
                      className="w-2 h-2 bg-white/40 rounded-full"
                      animate={{ y: [0, -5, 0] }}
                      transition={{ repeat: Infinity, duration: 0.6, delay: 0.3 }}
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Choices panel */}
        <AnimatePresence>
          {showChoices && currentChoices.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="flex-shrink-0 border-t border-white/10 p-4 space-y-2.5 min-h-[100px]"
              style={{ maxHeight: '35vh', overflowY: 'auto' }}
            >
              {/* Indication du nombre de choix */}
              <div className="text-[10px] text-white/40 mb-2">
                {currentChoices.length} option{currentChoices.length > 1 ? 's' : ''} disponible{currentChoices.length > 1 ? 's' : ''}
              </div>
              {/* Tip button */}
              {currentTip && (
                <button
                  onClick={() => setShowTip(!showTip)}
                  className="w-full text-left text-xs text-yellow-400/70 hover:text-yellow-400 flex items-center gap-1 px-2 py-1"
                >
                  <div className="w-3 h-3"><Icons.Lightbulb /></div>
                  {showTip ? 'Masquer l\'indice' : '💡 Voir un indice'}
                </button>
              )}
              
              {/* Tip content */}
              <AnimatePresence>
                {showTip && currentTip && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-2 text-xs text-yellow-200 mb-2"
                  >
                    💡 {currentTip}
                  </motion.div>
                )}
              </AnimatePresence>
              
              {/* Choice buttons */}
              {currentChoices.map((choice, idx) => {
                const doc = choice.requiresDocument ? documents.find(d => d.id === choice.requiresDocument) : null;
                const hasDoc = !choice.requiresDocument || doc?.isReady;
                
                return (
                  <motion.button
                    key={choice.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    onClick={() => handleChoice(choice)}
                    className={`w-full p-2.5 rounded-xl text-left text-sm transition-all ${
                      choice.isOptimal 
                        ? 'bg-green-500/10 border border-green-500/40 hover:bg-green-500/20' 
                        : choice.isRisky || choice.isCriticalMistake
                          ? 'bg-red-500/10 border border-red-500/40 hover:bg-red-500/20'
                          : 'bg-white/5 hover:bg-white/10 border border-transparent'
                    }`}
                  >
                    <div className="font-medium text-xs leading-relaxed">
                      {choice.shortText || (choice.text.length > 80 ? choice.text.substring(0, 80) + '...' : choice.text)}
                    </div>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      {choice.requiresDocument && (
                        <div className={`text-[10px] flex items-center gap-1 ${hasDoc ? 'text-green-400/70' : 'text-red-400/70'}`}>
                          📎 {doc?.name || 'Document requis'}
                          {!hasDoc && ' (non prêt)'}
                        </div>
                      )}
                      {choice.aiActArticle && (
                        <div className="text-[10px] text-blue-400/60">
                          📖 {choice.aiActArticle}
                        </div>
                      )}
                    </div>
                  </motion.button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* FEEDBACK TOAST */}
      <AnimatePresence>
        {showFeedback && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-20 left-4 right-4 bg-red-500/90 text-white p-3 rounded-xl text-sm font-medium shadow-lg z-50"
          >
            {showFeedback}
          </motion.div>
        )}
      </AnimatePresence>

      {/* EVENT OVERLAY */}
      <AnimatePresence>
        {showEvent && gamePhase === 'event' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className={`bg-[#1a1a2e] border rounded-2xl p-4 max-w-md w-full ${
                showEvent.priority === 'critical' ? 'border-red-500/50' :
                showEvent.priority === 'high' ? 'border-yellow-500/50' :
                'border-blue-500/50'
              }`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${
                  showEvent.priority === 'critical' ? 'bg-red-500/20' :
                  showEvent.priority === 'high' ? 'bg-yellow-500/20' :
                  'bg-blue-500/20'
                }`}>
                  {showEvent.icon}
                </div>
                <div>
                  <h3 className={`font-bold ${
                    showEvent.priority === 'critical' ? 'text-red-400' :
                    showEvent.priority === 'high' ? 'text-yellow-400' :
                    'text-blue-400'
                  }`}>{showEvent.title}</h3>
                  {showEvent.sender && <p className="text-white/40 text-xs">{showEvent.sender}</p>}
                </div>
              </div>

              <p className="text-white/90 text-sm mb-4">{showEvent.message}</p>
              
              {showEvent.consequence && (
                <p className="text-white/50 text-xs italic mb-3">⚠️ {showEvent.consequence}</p>
              )}

              {eventOutcome ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-white/5 rounded-xl p-3 text-sm text-white/70"
                >
                  {eventOutcome}
                </motion.div>
              ) : (
                <div className="space-y-2">
                  {showEvent.choices.map((choice, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleEventChoice(choice)}
                      className={`w-full p-3 rounded-xl text-left text-sm transition-all ${
                        choice.isOptimal 
                          ? 'bg-green-500/10 border border-green-500/30 hover:bg-green-500/20'
                          : choice.isGameOver
                            ? 'bg-red-500/10 border border-red-500/30 hover:bg-red-500/20'
                            : 'bg-white/5 hover:bg-white/10'
                      }`}
                    >
                      {choice.text}
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ============================================
// MINI-GAME COMPONENT
// ============================================
interface MiniGameProps {
  game: MiniGame;
  onComplete: (success: boolean) => void;
  result: 'success' | 'failure' | null;
}

function MiniGameComponent({ game, onComplete, result }: MiniGameProps) {
  const [timeLeft, setTimeLeft] = useState(game.timeLimit);
  const [answers, setAnswers] = useState<number[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  useEffect(() => {
    if (result) return;
    
    const timer = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timer);
          onComplete(false);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [result, onComplete]);

  // Result screen
  if (result) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className={`w-20 h-20 rounded-full flex items-center justify-center text-4xl mb-4 ${
            result === 'success' ? 'bg-green-500/20' : 'bg-red-500/20'
          }`}
        >
          {result === 'success' ? '✅' : '❌'}
        </motion.div>
        <h3 className={`text-xl font-bold mb-2 ${result === 'success' ? 'text-green-400' : 'text-red-400'}`}>
          {result === 'success' ? 'Réussi !' : 'Échoué'}
        </h3>
        <p className="text-white/60 text-sm text-center">
          {result === 'success' 
            ? 'Vous avez impressionné l\'auditrice par votre réactivité.'
            : 'Vous avez perdu un temps précieux...'}
        </p>
      </div>
    );
  }

  // Quick Answer Game
  if (game.type === 'quick_answer') {
    const questions = game.data.questions;
    const q = questions[currentQuestion];
    
    const handleAnswer = (answerIdx: number) => {
      const newAnswers = [...answers, answerIdx];
      setAnswers(newAnswers);
      
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(c => c + 1);
      } else {
        // Calculate score
        const correct = newAnswers.filter((a, i) => a === questions[i].correct).length;
        onComplete(correct >= questions.length * 0.6);
      }
    };

    return (
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg">{game.title}</h3>
          <div className={`px-3 py-1 rounded-full text-sm font-mono ${timeLeft < 10 ? 'bg-red-500/20 text-red-400 animate-pulse' : 'bg-white/10'}`}>
            {timeLeft}s
          </div>
        </div>
        
        <div className="text-white/60 text-sm mb-2">
          Question {currentQuestion + 1}/{questions.length}
        </div>
        
        <div className="bg-white/5 rounded-xl p-4 mb-4">
          <p className="font-medium">{q.q}</p>
        </div>
        
        <div className="space-y-2">
          {q.options.map((option: string, idx: number) => (
            <button
              key={idx}
              onClick={() => handleAnswer(idx)}
              className="w-full p-3 rounded-xl bg-white/5 hover:bg-white/10 text-left text-sm transition-all"
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Risk Classification Game
  if (game.type === 'risk_classification') {
    const systems = game.data.systems;
    const riskLevels = game.data.riskLevels;
    
    if (currentQuestion >= systems.length) {
      // Calculate score
      const correct = answers.filter((a, i) => 
        riskLevels[a] === systems[i].correctRisk
      ).length;
      onComplete(correct >= systems.length * 0.7);
      return null;
    }
    
    const system = systems[currentQuestion];

    return (
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg">{game.title}</h3>
          <div className={`px-3 py-1 rounded-full text-sm font-mono ${timeLeft < 15 ? 'bg-red-500/20 text-red-400 animate-pulse' : 'bg-white/10'}`}>
            {timeLeft}s
          </div>
        </div>
        
        <div className="text-white/60 text-sm mb-2">
          Système {currentQuestion + 1}/{systems.length}
        </div>
        
        <div className="bg-white/5 rounded-xl p-4 mb-4">
          <p className="font-medium text-lg">{system.name}</p>
          <p className="text-white/50 text-sm mt-1">Classifiez selon l'AI Act</p>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          {riskLevels.map((level: string, idx: number) => (
            <button
              key={level}
              onClick={() => {
                setAnswers([...answers, idx]);
                setCurrentQuestion(c => c + 1);
              }}
              className={`p-3 rounded-xl text-sm font-medium transition-all ${
                level === 'minimal' ? 'bg-green-500/20 hover:bg-green-500/30 text-green-400' :
                level === 'limited' ? 'bg-blue-500/20 hover:bg-blue-500/30 text-blue-400' :
                level === 'high' ? 'bg-orange-500/20 hover:bg-orange-500/30 text-orange-400' :
                'bg-red-500/20 hover:bg-red-500/30 text-red-400'
              }`}
            >
              {level === 'minimal' ? 'Risque minimal' :
               level === 'limited' ? 'Risque limité' :
               level === 'high' ? 'Haut risque' :
               'Inacceptable'}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Document Search Game
  if (game.type === 'document_search') {
    const docs = [game.data.targetDocument, ...game.data.decoys];
    const shuffled = docs.sort(() => Math.random() - 0.5);
    
    return (
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg">{game.title}</h3>
          <div className={`px-3 py-1 rounded-full text-sm font-mono ${timeLeft < 10 ? 'bg-red-500/20 text-red-400 animate-pulse' : 'bg-white/10'}`}>
            {timeLeft}s
          </div>
        </div>
        
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-3 mb-4">
          <p className="text-sm italic">"{game.context}"</p>
        </div>
        
        {game.data.hint && (
          <p className="text-white/50 text-xs">💡 Indice : {game.data.hint}</p>
        )}
        
        <div className="space-y-2">
          {shuffled.map((docId: string) => {
            const doc = INITIAL_DOCUMENTS.find(d => d.id === docId);
            return (
              <button
                key={docId}
                onClick={() => onComplete(docId === game.data.targetDocument)}
                className="w-full p-3 rounded-xl bg-white/5 hover:bg-white/10 text-left flex items-center gap-3 transition-all"
              >
                <span className="text-xl">{doc?.icon || '📄'}</span>
                <div>
                  <div className="font-medium text-sm">{doc?.name || docId}</div>
                  <div className="text-white/40 text-xs">{doc?.category}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // Priority Sort Game
  if (game.type === 'priority_sort') {
    const tasks = game.data.tasks;
    
    const moveItem = (idx: number, direction: 'up' | 'down') => {
      const newItems = [...selectedItems];
      const newIdx = direction === 'up' ? idx - 1 : idx + 1;
      if (newIdx < 0 || newIdx >= newItems.length) return;
      [newItems[idx], newItems[newIdx]] = [newItems[newIdx], newItems[idx]];
      setSelectedItems(newItems);
    };

    if (selectedItems.length < tasks.length) {
      return (
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-lg">{game.title}</h3>
            <div className={`px-3 py-1 rounded-full text-sm font-mono ${timeLeft < 15 ? 'bg-red-500/20 text-red-400 animate-pulse' : 'bg-white/10'}`}>
              {timeLeft}s
            </div>
          </div>
          
          <p className="text-white/60 text-sm">{game.description}</p>
          
          <p className="text-white/50 text-xs">Sélectionnez les tâches dans l'ordre de priorité :</p>
          
          <div className="space-y-2">
            {tasks.filter((t: any) => !selectedItems.includes(t.id.toString())).map((task: any) => (
              <button
                key={task.id}
                onClick={() => setSelectedItems([...selectedItems, task.id.toString()])}
                className="w-full p-3 rounded-xl bg-white/5 hover:bg-white/10 text-left text-sm"
              >
                {task.name}
              </button>
            ))}
          </div>
          
          {selectedItems.length > 0 && (
            <div className="mt-4">
              <p className="text-white/50 text-xs mb-2">Votre ordre :</p>
              <div className="space-y-1">
                {selectedItems.map((id, idx) => {
                  const task = tasks.find((t: any) => t.id.toString() === id);
                  return (
                    <div key={id} className="flex items-center gap-2 bg-blue-500/10 rounded-lg p-2 text-sm">
                      <span className="text-blue-400 font-bold">{idx + 1}</span>
                      <span className="flex-1">{task?.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      );
    }
    
    // Validate order
    const correctCount = selectedItems.filter((id, idx) => {
      const task = tasks.find((t: any) => t.id.toString() === id);
      return task?.correctOrder === idx + 1;
    }).length;
    
    setTimeout(() => onComplete(correctCount >= tasks.length * 0.6), 500);
    return <div className="p-4 text-center">Vérification...</div>;
  }

  // Default fallback
  return (
    <div className="p-4 text-center">
      <p>Mini-jeu en cours de chargement...</p>
    </div>
  );
}
