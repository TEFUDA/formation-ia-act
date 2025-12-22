'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';

// ============================================
// TYPES
// ============================================

interface QuestionOption {
  label: string;
  score: number;
  highRiskFlag?: boolean;
  triggerQuestions?: string[];
}

interface Question {
  id: string;
  question: string;
  options: QuestionOption[];
  category: string;
  categoryIcon: string;
  categoryColor: string;
  plans: ('solo' | 'pro' | 'enterprise')[];
  sectors?: string[];
  sizes?: string[];
  condition?: (answers: Record<string, any>) => boolean;
  infoBox?: string;
  aiActRef?: string;
}

interface CompanyProfile {
  name: string;
  sector: string;
  size: string;
  hasMultipleSites: boolean;
  siteCount?: number;
  hasExternalProviders: boolean;
  mainActivity: string;
}

// ============================================
// CONSTANTS
// ============================================

const sectors = [
  { id: 'industry', label: '🏭 Industrie / Manufacturing', icon: '🏭' },
  { id: 'health', label: '🏥 Santé / Médical', icon: '🏥' },
  { id: 'finance', label: '🏦 Finance / Banque / Assurance', icon: '🏦' },
  { id: 'retail', label: '🛒 Retail / Commerce', icon: '🛒' },
  { id: 'services', label: '💼 Services aux entreprises', icon: '💼' },
  { id: 'tech', label: '💻 Tech / IT / Digital', icon: '💻' },
  { id: 'education', label: '🎓 Éducation / Formation', icon: '🎓' },
  { id: 'public', label: '🏛️ Secteur public', icon: '🏛️' },
  { id: 'transport', label: '🚚 Transport / Logistique', icon: '🚚' },
  { id: 'energy', label: '⚡ Énergie / Environnement', icon: '⚡' },
  { id: 'other', label: '📋 Autre secteur', icon: '📋' },
];

const companySizes = [
  { id: 'tpe', label: 'TPE (< 10 salariés)', employees: '< 10' },
  { id: 'pme', label: 'PME (10-249 salariés)', employees: '10-249' },
  { id: 'eti', label: 'ETI (250-4999 salariés)', employees: '250-4999' },
  { id: 'ge', label: 'Grande Entreprise (5000+)', employees: '5000+' },
];

const categoryColors: Record<string, { color: string; icon: string }> = {
  profiling: { color: '#8B5CF6', icon: '👤' },
  inventory: { color: '#00F5FF', icon: '📋' },
  classification: { color: '#FF6B00', icon: '⚠️' },
  governance: { color: '#8B5CF6', icon: '🏛️' },
  documentation: { color: '#00FF88', icon: '📄' },
  training: { color: '#FFB800', icon: '🎓' },
  transparency: { color: '#FF4444', icon: '👁️' },
  security: { color: '#0066FF', icon: '🔒' },
  suppliers: { color: '#FF00FF', icon: '🤝' },
  multisites: { color: '#00FFAA', icon: '🌍' },
  rights: { color: '#FF6B6B', icon: '⚖️' },
};

// ============================================
// QUESTIONS DATABASE
// ============================================

const allQuestions: Question[] = [
  // =====================
  // INVENTORY QUESTIONS
  // =====================
  {
    id: 'inv1',
    question: "Avez-vous réalisé un inventaire complet des systèmes d'IA utilisés dans votre organisation ?",
    options: [
      { label: 'Oui, inventaire complet et à jour', score: 0 },
      { label: 'Inventaire partiel ou obsolète', score: 2 },
      { label: 'Non, pas d\'inventaire', score: 4 },
    ],
    category: 'inventory',
    categoryIcon: '📋',
    categoryColor: '#00F5FF',
    plans: ['solo', 'pro', 'enterprise'],
    aiActRef: 'Article 49',
  },
  {
    id: 'inv2',
    question: "Utilisez-vous des outils d'IA générative (ChatGPT, Copilot, Midjourney, etc.) ?",
    options: [
      { label: 'Non, aucun outil d\'IA générative', score: 0 },
      { label: 'Oui, avec une politique d\'encadrement', score: 1 },
      { label: 'Oui, sans encadrement particulier', score: 3, highRiskFlag: true },
    ],
    category: 'inventory',
    categoryIcon: '📋',
    categoryColor: '#00F5FF',
    plans: ['solo', 'pro', 'enterprise'],
  },
  {
    id: 'inv3',
    question: "Combien de systèmes IA différents utilisez-vous approximativement ?",
    options: [
      { label: '1-5 systèmes', score: 0 },
      { label: '6-15 systèmes', score: 1 },
      { label: '16-50 systèmes', score: 2 },
      { label: 'Plus de 50 systèmes', score: 3 },
    ],
    category: 'inventory',
    categoryIcon: '📋',
    categoryColor: '#00F5FF',
    plans: ['solo', 'pro', 'enterprise'],
  },
  {
    id: 'inv4',
    question: "Savez-vous quels départements utilisent l'IA dans votre organisation ?",
    options: [
      { label: 'Oui, cartographie complète par département', score: 0 },
      { label: 'Vision partielle', score: 2 },
      { label: 'Non, pas de visibilité', score: 4 },
    ],
    category: 'inventory',
    categoryIcon: '📋',
    categoryColor: '#00F5FF',
    plans: ['solo', 'pro', 'enterprise'],
  },
  {
    id: 'inv5',
    question: "Vos systèmes IA sont-ils documentés (fiche descriptive, usage, responsable) ?",
    options: [
      { label: 'Oui, tous documentés', score: 0 },
      { label: 'Partiellement documentés', score: 2 },
      { label: 'Non documentés', score: 4 },
    ],
    category: 'inventory',
    categoryIcon: '📋',
    categoryColor: '#00F5FF',
    plans: ['solo', 'pro', 'enterprise'],
  },
  // Pro/Enterprise inventory questions
  {
    id: 'inv6_pro',
    question: "Avez-vous identifié les systèmes IA développés en interne vs achetés ?",
    options: [
      { label: 'Oui, distinction claire', score: 0 },
      { label: 'Partiellement', score: 2 },
      { label: 'Non', score: 3 },
    ],
    category: 'inventory',
    categoryIcon: '📋',
    categoryColor: '#00F5FF',
    plans: ['pro', 'enterprise'],
  },
  {
    id: 'inv7_pro',
    question: "Disposez-vous d'un registre centralisé accessible aux parties prenantes ?",
    options: [
      { label: 'Oui, registre centralisé et partagé', score: 0 },
      { label: 'Registre existe mais accès limité', score: 2 },
      { label: 'Pas de registre centralisé', score: 4 },
    ],
    category: 'inventory',
    categoryIcon: '📋',
    categoryColor: '#00F5FF',
    plans: ['pro', 'enterprise'],
    aiActRef: 'Article 49',
  },
  
  // =====================
  // CLASSIFICATION QUESTIONS
  // =====================
  {
    id: 'class1',
    question: "Avez-vous classifié vos systèmes IA selon les 4 niveaux de risque de l'AI Act ?",
    options: [
      { label: 'Oui, tous classifiés', score: 0 },
      { label: 'Classification en cours', score: 2 },
      { label: 'Non, pas de classification', score: 4 },
    ],
    category: 'classification',
    categoryIcon: '⚠️',
    categoryColor: '#FF6B00',
    plans: ['solo', 'pro', 'enterprise'],
    aiActRef: 'Article 6, Annexe III',
    infoBox: 'Les 4 niveaux : Inacceptable (interdit), Élevé (obligations strictes), Limité (transparence), Minimal (libre)',
  },
  {
    id: 'class2',
    question: "Utilisez-vous l'IA pour des décisions RH (recrutement, évaluation, promotion) ?",
    options: [
      { label: 'Non', score: 0 },
      { label: 'Oui, en aide à la décision avec validation humaine', score: 2, highRiskFlag: true },
      { label: 'Oui, avec décisions automatisées', score: 4, highRiskFlag: true },
    ],
    category: 'classification',
    categoryIcon: '⚠️',
    categoryColor: '#FF6B00',
    plans: ['solo', 'pro', 'enterprise'],
    aiActRef: 'Annexe III, point 4',
    infoBox: '⚠️ L\'IA en RH est classée HAUT RISQUE par l\'AI Act',
  },
  {
    id: 'class3',
    question: "Utilisez-vous des systèmes de scoring ou notation de personnes ?",
    options: [
      { label: 'Non', score: 0 },
      { label: 'Scoring commercial (lead scoring, etc.)', score: 1 },
      { label: 'Scoring crédit / assurance / risque', score: 4, highRiskFlag: true },
    ],
    category: 'classification',
    categoryIcon: '⚠️',
    categoryColor: '#FF6B00',
    plans: ['solo', 'pro', 'enterprise'],
    aiActRef: 'Annexe III, point 5',
  },
  {
    id: 'class4',
    question: "Utilisez-vous la reconnaissance faciale ou biométrique ?",
    options: [
      { label: 'Non', score: 0 },
      { label: 'Oui, pour l\'accès interne uniquement', score: 3, highRiskFlag: true },
      { label: 'Oui, sur clients ou public', score: 4, highRiskFlag: true },
    ],
    category: 'classification',
    categoryIcon: '⚠️',
    categoryColor: '#FF6B00',
    plans: ['solo', 'pro', 'enterprise'],
    aiActRef: 'Article 5, Annexe III',
    infoBox: '⚠️ La reconnaissance biométrique est très encadrée par l\'AI Act',
  },
  {
    id: 'class5',
    question: "Vos systèmes IA prennent-ils des décisions impactant des droits fondamentaux ?",
    options: [
      { label: 'Non', score: 0 },
      { label: 'Oui, avec supervision humaine systématique', score: 2, highRiskFlag: true },
      { label: 'Oui, de manière automatisée', score: 4, highRiskFlag: true },
    ],
    category: 'classification',
    categoryIcon: '⚠️',
    categoryColor: '#FF6B00',
    plans: ['solo', 'pro', 'enterprise'],
    aiActRef: 'Article 27',
  },
  // Sector-specific classification (Pro/Enterprise)
  {
    id: 'class6_health',
    question: "Utilisez-vous l'IA pour le diagnostic médical ou l'aide au diagnostic ?",
    options: [
      { label: 'Non', score: 0 },
      { label: 'Oui, en aide au praticien', score: 2, highRiskFlag: true },
      { label: 'Oui, avec diagnostic automatisé', score: 4, highRiskFlag: true },
    ],
    category: 'classification',
    categoryIcon: '⚠️',
    categoryColor: '#FF6B00',
    plans: ['pro', 'enterprise'],
    sectors: ['health'],
    aiActRef: 'Annexe III, point 5',
  },
  {
    id: 'class7_finance',
    question: "Utilisez-vous l'IA pour l'évaluation de solvabilité ou l'octroi de crédit ?",
    options: [
      { label: 'Non', score: 0 },
      { label: 'Oui, en aide à la décision', score: 2, highRiskFlag: true },
      { label: 'Oui, décisions automatisées', score: 4, highRiskFlag: true },
    ],
    category: 'classification',
    categoryIcon: '⚠️',
    categoryColor: '#FF6B00',
    plans: ['pro', 'enterprise'],
    sectors: ['finance'],
    aiActRef: 'Annexe III, point 5b',
  },
  {
    id: 'class8_public',
    question: "Utilisez-vous l'IA pour l'attribution de prestations ou services publics ?",
    options: [
      { label: 'Non', score: 0 },
      { label: 'Oui, en aide à la décision', score: 2, highRiskFlag: true },
      { label: 'Oui, automatisé', score: 4, highRiskFlag: true },
    ],
    category: 'classification',
    categoryIcon: '⚠️',
    categoryColor: '#FF6B00',
    plans: ['pro', 'enterprise'],
    sectors: ['public'],
    aiActRef: 'Annexe III, point 5a',
  },

  // =====================
  // GOVERNANCE QUESTIONS
  // =====================
  {
    id: 'gov1',
    question: "Avez-vous désigné un Référent IA dans votre organisation ?",
    options: [
      { label: 'Oui, formellement désigné et formé', score: 0 },
      { label: 'Rôle informel, non formalisé', score: 2 },
      { label: 'Non, pas de référent', score: 4 },
    ],
    category: 'governance',
    categoryIcon: '🏛️',
    categoryColor: '#8B5CF6',
    plans: ['solo', 'pro', 'enterprise'],
  },
  {
    id: 'gov2',
    question: "Existe-t-il une politique d'utilisation de l'IA dans votre organisation ?",
    options: [
      { label: 'Oui, formalisée et diffusée', score: 0 },
      { label: 'En cours de rédaction', score: 2 },
      { label: 'Non, pas de politique', score: 4 },
    ],
    category: 'governance',
    categoryIcon: '🏛️',
    categoryColor: '#8B5CF6',
    plans: ['solo', 'pro', 'enterprise'],
  },
  {
    id: 'gov3',
    question: "Avez-vous un comité ou une instance de gouvernance IA ?",
    options: [
      { label: 'Oui, comité formalisé avec réunions régulières', score: 0 },
      { label: 'Groupe de travail informel', score: 2 },
      { label: 'Non', score: 3 },
    ],
    category: 'governance',
    categoryIcon: '🏛️',
    categoryColor: '#8B5CF6',
    plans: ['solo', 'pro', 'enterprise'],
  },
  {
    id: 'gov4',
    question: "L'adoption de nouveaux outils IA suit-elle un processus de validation ?",
    options: [
      { label: 'Oui, processus formel avec validation', score: 0 },
      { label: 'Processus informel', score: 2 },
      { label: 'Libre, pas de processus', score: 4 },
    ],
    category: 'governance',
    categoryIcon: '🏛️',
    categoryColor: '#8B5CF6',
    plans: ['solo', 'pro', 'enterprise'],
  },
  {
    id: 'gov5',
    question: "La Direction est-elle impliquée dans la stratégie IA ?",
    options: [
      { label: 'Oui, sujet stratégique porté par la Direction', score: 0 },
      { label: 'Implication limitée', score: 2 },
      { label: 'Non, sujet délégué', score: 3 },
    ],
    category: 'governance',
    categoryIcon: '🏛️',
    categoryColor: '#8B5CF6',
    plans: ['solo', 'pro', 'enterprise'],
  },
  // Pro/Enterprise governance
  {
    id: 'gov6_pro',
    question: "Avez-vous défini des KPIs de suivi de la conformité IA ?",
    options: [
      { label: 'Oui, KPIs définis et suivis', score: 0 },
      { label: 'Quelques indicateurs informels', score: 2 },
      { label: 'Non', score: 3 },
    ],
    category: 'governance',
    categoryIcon: '🏛️',
    categoryColor: '#8B5CF6',
    plans: ['pro', 'enterprise'],
  },
  {
    id: 'gov7_pro',
    question: "Avez-vous un budget dédié à la conformité AI Act ?",
    options: [
      { label: 'Oui, budget identifié', score: 0 },
      { label: 'Budget limité ou non formalisé', score: 2 },
      { label: 'Pas de budget dédié', score: 3 },
    ],
    category: 'governance',
    categoryIcon: '🏛️',
    categoryColor: '#8B5CF6',
    plans: ['pro', 'enterprise'],
  },
  // Enterprise governance
  {
    id: 'gov8_ent',
    question: "Existe-t-il une charte éthique IA dans votre organisation ?",
    options: [
      { label: 'Oui, formalisée et communiquée', score: 0 },
      { label: 'En cours de rédaction', score: 1 },
      { label: 'Non', score: 2 },
    ],
    category: 'governance',
    categoryIcon: '🏛️',
    categoryColor: '#8B5CF6',
    plans: ['enterprise'],
  },
  {
    id: 'gov9_ent',
    question: "La gouvernance IA est-elle intégrée à votre gouvernance d'entreprise globale ?",
    options: [
      { label: 'Oui, pleinement intégrée', score: 0 },
      { label: 'Partiellement', score: 2 },
      { label: 'Non, silos séparés', score: 3 },
    ],
    category: 'governance',
    categoryIcon: '🏛️',
    categoryColor: '#8B5CF6',
    plans: ['enterprise'],
  },

  // =====================
  // DOCUMENTATION QUESTIONS
  // =====================
  {
    id: 'doc1',
    question: "Disposez-vous de la documentation technique de vos systèmes IA à haut risque ?",
    options: [
      { label: 'Oui, documentation complète', score: 0 },
      { label: 'Documentation partielle', score: 2 },
      { label: 'Non ou pas de systèmes haut risque', score: 3 },
    ],
    category: 'documentation',
    categoryIcon: '📄',
    categoryColor: '#00FF88',
    plans: ['solo', 'pro', 'enterprise'],
    aiActRef: 'Article 11, Annexe IV',
  },
  {
    id: 'doc2',
    question: "Les logs de vos systèmes IA sont-ils conservés ?",
    options: [
      { label: 'Oui, conservation conforme', score: 0 },
      { label: 'Conservation partielle', score: 2 },
      { label: 'Non ou ne sait pas', score: 4 },
    ],
    category: 'documentation',
    categoryIcon: '📄',
    categoryColor: '#00FF88',
    plans: ['solo', 'pro', 'enterprise'],
    aiActRef: 'Article 12',
  },
  {
    id: 'doc3',
    question: "Avez-vous documenté les biais potentiels de vos systèmes IA ?",
    options: [
      { label: 'Oui, analyse de biais réalisée', score: 0 },
      { label: 'Analyse partielle', score: 2 },
      { label: 'Non', score: 4 },
    ],
    category: 'documentation',
    categoryIcon: '📄',
    categoryColor: '#00FF88',
    plans: ['solo', 'pro', 'enterprise'],
    aiActRef: 'Article 10',
  },
  {
    id: 'doc4',
    question: "Les données d'entraînement de vos IA sont-elles documentées ?",
    options: [
      { label: 'Oui, traçabilité complète', score: 0 },
      { label: 'Documentation partielle', score: 2 },
      { label: 'Non ou ne sait pas', score: 3 },
    ],
    category: 'documentation',
    categoryIcon: '📄',
    categoryColor: '#00FF88',
    plans: ['solo', 'pro', 'enterprise'],
    aiActRef: 'Article 10, Annexe IV',
  },
  {
    id: 'doc5',
    question: "Avez-vous des procédures de maintenance et mise à jour de vos IA ?",
    options: [
      { label: 'Oui, procédures formalisées', score: 0 },
      { label: 'Procédures informelles', score: 2 },
      { label: 'Non', score: 4 },
    ],
    category: 'documentation',
    categoryIcon: '📄',
    categoryColor: '#00FF88',
    plans: ['solo', 'pro', 'enterprise'],
  },
  // Pro/Enterprise documentation
  {
    id: 'doc6_pro',
    question: "Avez-vous réalisé une analyse d'impact (FRIA) pour vos systèmes haut risque ?",
    options: [
      { label: 'Oui, FRIA complète', score: 0 },
      { label: 'FRIA en cours', score: 2 },
      { label: 'Non', score: 4 },
    ],
    category: 'documentation',
    categoryIcon: '📄',
    categoryColor: '#00FF88',
    plans: ['pro', 'enterprise'],
    aiActRef: 'Article 27',
  },
  {
    id: 'doc7_pro',
    question: "Disposez-vous des déclarations de conformité de vos fournisseurs IA ?",
    options: [
      { label: 'Oui, pour tous les systèmes', score: 0 },
      { label: 'Pour certains systèmes', score: 2 },
      { label: 'Non', score: 3 },
    ],
    category: 'documentation',
    categoryIcon: '📄',
    categoryColor: '#00FF88',
    plans: ['pro', 'enterprise'],
    aiActRef: 'Article 47',
  },

  // =====================
  // TRAINING QUESTIONS
  // =====================
  {
    id: 'train1',
    question: "Vos collaborateurs utilisant l'IA sont-ils formés à son utilisation responsable ?",
    options: [
      { label: 'Oui, formation certifiante', score: 0 },
      { label: 'Sensibilisation basique', score: 2 },
      { label: 'Non, pas de formation', score: 4 },
    ],
    category: 'training',
    categoryIcon: '🎓',
    categoryColor: '#FFB800',
    plans: ['solo', 'pro', 'enterprise'],
    aiActRef: 'Article 4',
    infoBox: 'L\'Article 4 impose une "maîtrise suffisante de l\'IA" - obligation en vigueur depuis février 2025',
  },
  {
    id: 'train2',
    question: "Existe-t-il un plan de formation IA dans votre organisation ?",
    options: [
      { label: 'Oui, plan formalisé', score: 0 },
      { label: 'Formations ponctuelles', score: 2 },
      { label: 'Non', score: 4 },
    ],
    category: 'training',
    categoryIcon: '🎓',
    categoryColor: '#FFB800',
    plans: ['solo', 'pro', 'enterprise'],
    aiActRef: 'Article 4',
  },
  {
    id: 'train3',
    question: "Les nouveaux arrivants sont-ils formés à l'IA dès leur intégration ?",
    options: [
      { label: 'Oui, inclus dans l\'onboarding', score: 0 },
      { label: 'Formation ultérieure', score: 2 },
      { label: 'Non', score: 4 },
    ],
    category: 'training',
    categoryIcon: '🎓',
    categoryColor: '#FFB800',
    plans: ['solo', 'pro', 'enterprise'],
  },
  {
    id: 'train4',
    question: "Les managers sont-ils formés aux enjeux de l'IA et de l'AI Act ?",
    options: [
      { label: 'Oui, formation spécifique managers', score: 0 },
      { label: 'Sensibilisation générale', score: 2 },
      { label: 'Non', score: 4 },
    ],
    category: 'training',
    categoryIcon: '🎓',
    categoryColor: '#FFB800',
    plans: ['solo', 'pro', 'enterprise'],
  },
  {
    id: 'train5',
    question: "Connaissez-vous l'obligation de formation Article 4 de l'AI Act ?",
    options: [
      { label: 'Oui, et nous sommes conformes', score: 0 },
      { label: 'Oui, mise en conformité en cours', score: 2 },
      { label: 'Non, je ne connais pas', score: 4 },
    ],
    category: 'training',
    categoryIcon: '🎓',
    categoryColor: '#FFB800',
    plans: ['solo', 'pro', 'enterprise'],
    aiActRef: 'Article 4',
  },
  // Pro/Enterprise training
  {
    id: 'train6_pro',
    question: "Avez-vous identifié les niveaux de compétence requis par profil métier ?",
    options: [
      { label: 'Oui, matrice de compétences définie', score: 0 },
      { label: 'Partiellement', score: 2 },
      { label: 'Non', score: 3 },
    ],
    category: 'training',
    categoryIcon: '🎓',
    categoryColor: '#FFB800',
    plans: ['pro', 'enterprise'],
  },
  {
    id: 'train7_pro',
    question: "Les formations IA sont-elles documentées et traçables ?",
    options: [
      { label: 'Oui, attestations conservées', score: 0 },
      { label: 'Traçabilité partielle', score: 2 },
      { label: 'Non', score: 3 },
    ],
    category: 'training',
    categoryIcon: '🎓',
    categoryColor: '#FFB800',
    plans: ['pro', 'enterprise'],
  },

  // =====================
  // TRANSPARENCY QUESTIONS
  // =====================
  {
    id: 'trans1',
    question: "Informez-vous les utilisateurs lorsqu'ils interagissent avec une IA ?",
    options: [
      { label: 'Oui, systématiquement', score: 0 },
      { label: 'Parfois', score: 2 },
      { label: 'Non', score: 4 },
    ],
    category: 'transparency',
    categoryIcon: '👁️',
    categoryColor: '#FF4444',
    plans: ['solo', 'pro', 'enterprise'],
    aiActRef: 'Article 50',
  },
  {
    id: 'trans2',
    question: "Vos chatbots ou assistants virtuels s'identifient-ils comme des IA ?",
    options: [
      { label: 'Oui, mention claire', score: 0 },
      { label: 'Pas de chatbot/assistant', score: 0 },
      { label: 'Non, pas de mention', score: 4 },
    ],
    category: 'transparency',
    categoryIcon: '👁️',
    categoryColor: '#FF4444',
    plans: ['solo', 'pro', 'enterprise'],
    aiActRef: 'Article 50',
  },
  {
    id: 'trans3',
    question: "Les contenus générés par IA sont-ils identifiés comme tels ?",
    options: [
      { label: 'Oui, marquage systématique', score: 0 },
      { label: 'Pas de contenu généré par IA', score: 0 },
      { label: 'Non, pas de marquage', score: 3 },
    ],
    category: 'transparency',
    categoryIcon: '👁️',
    categoryColor: '#FF4444',
    plans: ['solo', 'pro', 'enterprise'],
    aiActRef: 'Article 50',
  },
  {
    id: 'trans4',
    question: "Vos CGU/mentions légales mentionnent-elles l'utilisation de l'IA ?",
    options: [
      { label: 'Oui, mention complète', score: 0 },
      { label: 'Mention partielle', score: 2 },
      { label: 'Non', score: 3 },
    ],
    category: 'transparency',
    categoryIcon: '👁️',
    categoryColor: '#FF4444',
    plans: ['solo', 'pro', 'enterprise'],
  },
  {
    id: 'trans5',
    question: "Proposez-vous un droit d'opposition à l'utilisation de l'IA ?",
    options: [
      { label: 'Oui, processus clair', score: 0 },
      { label: 'Possible sur demande', score: 1 },
      { label: 'Non', score: 3 },
    ],
    category: 'transparency',
    categoryIcon: '👁️',
    categoryColor: '#FF4444',
    plans: ['solo', 'pro', 'enterprise'],
  },

  // =====================
  // SECURITY QUESTIONS (Pro/Enterprise)
  // =====================
  {
    id: 'sec1_pro',
    question: "Vos systèmes IA sont-ils intégrés à votre politique de cybersécurité ?",
    options: [
      { label: 'Oui, pleinement intégrés', score: 0 },
      { label: 'Partiellement', score: 2 },
      { label: 'Non', score: 4 },
    ],
    category: 'security',
    categoryIcon: '🔒',
    categoryColor: '#0066FF',
    plans: ['pro', 'enterprise'],
    aiActRef: 'Article 15',
  },
  {
    id: 'sec2_pro',
    question: "Avez-vous réalisé des tests de robustesse sur vos IA ?",
    options: [
      { label: 'Oui, tests réguliers', score: 0 },
      { label: 'Tests ponctuels', score: 2 },
      { label: 'Non', score: 3 },
    ],
    category: 'security',
    categoryIcon: '🔒',
    categoryColor: '#0066FF',
    plans: ['pro', 'enterprise'],
    aiActRef: 'Article 15',
  },
  {
    id: 'sec3_pro',
    question: "Vos IA sont-elles conformes au RGPD ?",
    options: [
      { label: 'Oui, conformité vérifiée', score: 0 },
      { label: 'Partiellement', score: 2 },
      { label: 'Non ou ne sait pas', score: 4 },
    ],
    category: 'security',
    categoryIcon: '🔒',
    categoryColor: '#0066FF',
    plans: ['pro', 'enterprise'],
  },
  {
    id: 'sec4_pro',
    question: "Avez-vous un processus de gestion des incidents IA ?",
    options: [
      { label: 'Oui, processus formalisé', score: 0 },
      { label: 'Processus ad hoc', score: 2 },
      { label: 'Non', score: 4 },
    ],
    category: 'security',
    categoryIcon: '🔒',
    categoryColor: '#0066FF',
    plans: ['pro', 'enterprise'],
    aiActRef: 'Article 62',
  },

  // =====================
  // SUPPLIERS QUESTIONS (Enterprise)
  // =====================
  {
    id: 'sup1_ent',
    question: "Avez-vous cartographié tous vos fournisseurs de systèmes IA ?",
    options: [
      { label: 'Oui, cartographie complète', score: 0 },
      { label: 'Cartographie partielle', score: 2 },
      { label: 'Non', score: 3 },
    ],
    category: 'suppliers',
    categoryIcon: '🤝',
    categoryColor: '#FF00FF',
    plans: ['enterprise'],
  },
  {
    id: 'sup2_ent',
    question: "Vos contrats fournisseurs incluent-ils des clauses AI Act ?",
    options: [
      { label: 'Oui, clauses spécifiques', score: 0 },
      { label: 'En cours de mise à jour', score: 2 },
      { label: 'Non', score: 4 },
    ],
    category: 'suppliers',
    categoryIcon: '🤝',
    categoryColor: '#FF00FF',
    plans: ['enterprise'],
    aiActRef: 'Article 25',
  },
  {
    id: 'sup3_ent',
    question: "Avez-vous obtenu les documentations techniques de vos fournisseurs ?",
    options: [
      { label: 'Oui, pour tous', score: 0 },
      { label: 'Pour certains', score: 2 },
      { label: 'Non', score: 3 },
    ],
    category: 'suppliers',
    categoryIcon: '🤝',
    categoryColor: '#FF00FF',
    plans: ['enterprise'],
  },
  {
    id: 'sup4_ent',
    question: "Avez-vous un droit d'audit sur vos fournisseurs IA ?",
    options: [
      { label: 'Oui, contractuellement prévu', score: 0 },
      { label: 'Pour certains fournisseurs', score: 2 },
      { label: 'Non', score: 3 },
    ],
    category: 'suppliers',
    categoryIcon: '🤝',
    categoryColor: '#FF00FF',
    plans: ['enterprise'],
  },
  {
    id: 'sup5_ent',
    question: "Vos fournisseurs vous notifient-ils les mises à jour de leurs IA ?",
    options: [
      { label: 'Oui, notification systématique', score: 0 },
      { label: 'Parfois', score: 2 },
      { label: 'Non', score: 3 },
    ],
    category: 'suppliers',
    categoryIcon: '🤝',
    categoryColor: '#FF00FF',
    plans: ['enterprise'],
  },

  // =====================
  // MULTI-SITES QUESTIONS (Enterprise)
  // =====================
  {
    id: 'multi1_ent',
    question: "La gouvernance IA est-elle harmonisée entre vos sites/filiales ?",
    options: [
      { label: 'Oui, politique groupe unique', score: 0 },
      { label: 'Partiellement harmonisée', score: 2 },
      { label: 'Non, politiques différentes', score: 4 },
    ],
    category: 'multisites',
    categoryIcon: '🌍',
    categoryColor: '#00FFAA',
    plans: ['enterprise'],
    condition: (answers) => answers.profile?.hasMultipleSites === true,
  },
  {
    id: 'multi2_ent',
    question: "Avez-vous un registre IA consolidé pour l'ensemble du groupe ?",
    options: [
      { label: 'Oui, registre groupe', score: 0 },
      { label: 'Registres séparés mais synchronisés', score: 2 },
      { label: 'Non, registres indépendants', score: 4 },
    ],
    category: 'multisites',
    categoryIcon: '🌍',
    categoryColor: '#00FFAA',
    plans: ['enterprise'],
    condition: (answers) => answers.profile?.hasMultipleSites === true,
  },
  {
    id: 'multi3_ent',
    question: "Les formations IA sont-elles déployées de manière homogène ?",
    options: [
      { label: 'Oui, même programme partout', score: 0 },
      { label: 'Partiellement', score: 2 },
      { label: 'Non, formations différentes', score: 3 },
    ],
    category: 'multisites',
    categoryIcon: '🌍',
    categoryColor: '#00FFAA',
    plans: ['enterprise'],
    condition: (answers) => answers.profile?.hasMultipleSites === true,
  },
  {
    id: 'multi4_ent',
    question: "Avez-vous des IA déployées dans des pays hors UE ?",
    options: [
      { label: 'Non, UE uniquement', score: 0 },
      { label: 'Oui, avec conformité vérifiée', score: 1 },
      { label: 'Oui, conformité non vérifiée', score: 3 },
    ],
    category: 'multisites',
    categoryIcon: '🌍',
    categoryColor: '#00FFAA',
    plans: ['enterprise'],
    condition: (answers) => answers.profile?.hasMultipleSites === true,
  },

  // =====================
  // FUNDAMENTAL RIGHTS (Enterprise)
  // =====================
  {
    id: 'rights1_ent',
    question: "Avez-vous identifié les droits fondamentaux potentiellement impactés par vos IA ?",
    options: [
      { label: 'Oui, analyse complète', score: 0 },
      { label: 'Analyse partielle', score: 2 },
      { label: 'Non', score: 4 },
    ],
    category: 'rights',
    categoryIcon: '⚖️',
    categoryColor: '#FF6B6B',
    plans: ['enterprise'],
    aiActRef: 'Article 27',
  },
  {
    id: 'rights2_ent',
    question: "Avez-vous consulté des parties prenantes (salariés, clients) sur vos IA ?",
    options: [
      { label: 'Oui, consultation formelle', score: 0 },
      { label: 'Consultation informelle', score: 2 },
      { label: 'Non', score: 3 },
    ],
    category: 'rights',
    categoryIcon: '⚖️',
    categoryColor: '#FF6B6B',
    plans: ['enterprise'],
  },
  {
    id: 'rights3_ent',
    question: "Proposez-vous un recours aux personnes impactées par des décisions IA ?",
    options: [
      { label: 'Oui, processus formalisé', score: 0 },
      { label: 'Possible sur demande', score: 2 },
      { label: 'Non', score: 4 },
    ],
    category: 'rights',
    categoryIcon: '⚖️',
    categoryColor: '#FF6B6B',
    plans: ['enterprise'],
    aiActRef: 'Article 86',
  },
];

// ============================================
// COMPONENTS
// ============================================

const NeuralBackground = () => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none">
    <div className="absolute inset-0 bg-gradient-to-br from-[#0A0A1B] via-[#0d0d2b] to-[#0A0A1B]" />
  </div>
);

const HoloCard = ({ children, glow = '#00F5FF', className = '' }: { children: React.ReactNode; glow?: string; className?: string }) => (
  <div
    className={`relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden ${className}`}
    style={{ boxShadow: `0 0 40px ${glow}20` }}
  >
    <div className="relative">{children}</div>
  </div>
);

// Profiling Step Component
const ProfilingStep = ({ 
  profile, 
  setProfile, 
  onComplete 
}: { 
  profile: CompanyProfile; 
  setProfile: (p: CompanyProfile) => void; 
  onComplete: () => void;
}) => {
  const [step, setStep] = useState(0);

  const steps = [
    {
      title: "Nom de votre entreprise",
      subtitle: "Ce nom apparaîtra sur votre rapport et certificat",
      content: (
        <input
          type="text"
          value={profile.name}
          onChange={(e) => setProfile({ ...profile, name: e.target.value })}
          placeholder="Ex: ACME Corporation"
          className="w-full p-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-[#8B5CF6]"
        />
      ),
      canContinue: profile.name.length > 2,
    },
    {
      title: "Secteur d'activité",
      subtitle: "Les questions seront adaptées à votre secteur",
      content: (
        <div className="grid sm:grid-cols-2 gap-3 max-h-[400px] overflow-y-auto pr-2">
          {sectors.map((s) => (
            <button
              key={s.id}
              onClick={() => setProfile({ ...profile, sector: s.id })}
              className={`p-4 rounded-xl border text-left transition-all ${
                profile.sector === s.id
                  ? 'bg-[#8B5CF6]/20 border-[#8B5CF6]'
                  : 'bg-white/5 border-white/10 hover:bg-white/10'
              }`}
            >
              <span className="text-xl mr-2">{s.icon}</span>
              <span className="text-sm">{s.label.split(' ').slice(1).join(' ')}</span>
            </button>
          ))}
        </div>
      ),
      canContinue: profile.sector !== '',
    },
    {
      title: "Taille de votre entreprise",
      subtitle: "Les obligations varient selon la taille",
      content: (
        <div className="space-y-3">
          {companySizes.map((s) => (
            <button
              key={s.id}
              onClick={() => setProfile({ ...profile, size: s.id })}
              className={`w-full p-4 rounded-xl border text-left transition-all ${
                profile.size === s.id
                  ? 'bg-[#8B5CF6]/20 border-[#8B5CF6]'
                  : 'bg-white/5 border-white/10 hover:bg-white/10'
              }`}
            >
              <div className="font-medium">{s.label}</div>
              <div className="text-sm text-white/50">{s.employees} salariés</div>
            </button>
          ))}
        </div>
      ),
      canContinue: profile.size !== '',
    },
    {
      title: "Structure de votre organisation",
      subtitle: "Avez-vous plusieurs sites ou filiales ?",
      content: (
        <div className="space-y-3">
          <button
            onClick={() => setProfile({ ...profile, hasMultipleSites: false })}
            className={`w-full p-4 rounded-xl border text-left transition-all ${
              profile.hasMultipleSites === false
                ? 'bg-[#8B5CF6]/20 border-[#8B5CF6]'
                : 'bg-white/5 border-white/10 hover:bg-white/10'
            }`}
          >
            <div className="font-medium">🏢 Site unique</div>
            <div className="text-sm text-white/50">Une seule entité juridique et un seul site</div>
          </button>
          <button
            onClick={() => setProfile({ ...profile, hasMultipleSites: true })}
            className={`w-full p-4 rounded-xl border text-left transition-all ${
              profile.hasMultipleSites === true
                ? 'bg-[#8B5CF6]/20 border-[#8B5CF6]'
                : 'bg-white/5 border-white/10 hover:bg-white/10'
            }`}
          >
            <div className="font-medium">🌍 Multi-sites / Groupe</div>
            <div className="text-sm text-white/50">Plusieurs sites, filiales ou entités</div>
          </button>
        </div>
      ),
      canContinue: profile.hasMultipleSites !== undefined,
    },
  ];

  const currentStepData = steps[step];
  const isLastStep = step === steps.length - 1;

  return (
    <div className="max-w-xl mx-auto">
      {/* Progress */}
      <div className="mb-8">
        <div className="flex justify-between text-sm text-white/50 mb-2">
          <span>Profil entreprise</span>
          <span>{step + 1}/{steps.length}</span>
        </div>
        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-gradient-to-r from-[#8B5CF6] to-[#00F5FF]"
            animate={{ width: `${((step + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>

      <HoloCard glow="#8B5CF6">
        <div className="p-8">
          <div className="text-center mb-8">
            <span className="text-4xl mb-4 block">👤</span>
            <h2 className="text-xl font-bold text-white mb-2">{currentStepData.title}</h2>
            <p className="text-white/60 text-sm">{currentStepData.subtitle}</p>
          </div>

          <div className="mb-8">
            {currentStepData.content}
          </div>

          <div className="flex gap-4">
            {step > 0 && (
              <button
                onClick={() => setStep(step - 1)}
                className="flex-1 py-3 rounded-xl border border-white/20 text-white/70 hover:bg-white/5"
              >
                ← Précédent
              </button>
            )}
            <button
              onClick={() => isLastStep ? onComplete() : setStep(step + 1)}
              disabled={!currentStepData.canContinue}
              className={`flex-1 py-3 rounded-xl font-medium transition-all ${
                currentStepData.canContinue
                  ? 'bg-gradient-to-r from-[#8B5CF6] to-[#00F5FF] text-white'
                  : 'bg-white/10 text-white/30 cursor-not-allowed'
              }`}
            >
              {isLastStep ? 'Commencer l\'audit →' : 'Continuer →'}
            </button>
          </div>
        </div>
      </HoloCard>
    </div>
  );
};

// ============================================
// MAIN COMPONENT
// ============================================

export default function AuditQuestionnairePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // Get plan from URL param or localStorage
  const [plan, setPlan] = useState<'solo' | 'pro' | 'enterprise'>('solo');
  
  useEffect(() => {
    const urlPlan = searchParams.get('plan');
    if (urlPlan && ['solo', 'pro', 'enterprise'].includes(urlPlan)) {
      setPlan(urlPlan as 'solo' | 'pro' | 'enterprise');
    } else {
      const savedPlan = localStorage.getItem('userPlan');
      if (savedPlan && ['solo', 'pro', 'enterprise'].includes(savedPlan)) {
        setPlan(savedPlan as 'solo' | 'pro' | 'enterprise');
      }
    }
  }, [searchParams]);

  // Update phase based on plan
  useEffect(() => {
    if (plan !== 'solo') {
      setPhase('profiling');
    } else {
      setPhase('questions');
    }
  }, [plan]);

  // State
  const [phase, setPhase] = useState<'profiling' | 'questions' | 'complete'>('questions');
  const [profile, setProfile] = useState<CompanyProfile>({
    name: '',
    sector: '',
    size: '',
    hasMultipleSites: false,
    hasExternalProviders: false,
    mainActivity: '',
  });
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({ profile });
  const [highRiskFlags, setHighRiskFlags] = useState<string[]>([]);

  // Filter questions based on plan, sector, and conditions
  const filteredQuestions = useMemo(() => {
    return allQuestions.filter(q => {
      // Check plan
      if (!q.plans.includes(plan)) return false;
      
      // Check sector (if specified)
      if (q.sectors && q.sectors.length > 0 && !q.sectors.includes(profile.sector)) return false;
      
      // Check size (if specified)
      if (q.sizes && q.sizes.length > 0 && !q.sizes.includes(profile.size)) return false;
      
      // Check condition
      if (q.condition && !q.condition({ ...answers, profile })) return false;
      
      return true;
    });
  }, [plan, profile, answers]);

  const totalQuestions = filteredQuestions.length;
  const progress = totalQuestions > 0 ? ((currentQuestion + 1) / totalQuestions) * 100 : 0;
  const isComplete = currentQuestion >= totalQuestions;

  // Handle answer
  const handleAnswer = (questionId: string, optionIndex: number, score: number, highRiskFlag?: boolean) => {
    const newAnswers = { ...answers, [questionId]: { optionIndex, score } };
    setAnswers(newAnswers);
    
    if (highRiskFlag) {
      setHighRiskFlags([...highRiskFlags, questionId]);
    }
    
    // Move to next question
    setTimeout(() => {
      if (currentQuestion < totalQuestions - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        setPhase('complete');
      }
    }, 300);
  };

  // Calculate score
  const calculateScore = () => {
    const questionScores = Object.entries(answers)
      .filter(([key]) => key !== 'profile')
      .map(([_, value]: [string, any]) => value.score || 0);
    
    const totalScore = questionScores.reduce((a, b) => a + b, 0);
    const maxScore = filteredQuestions.length * 4;
    return Math.max(0, Math.min(100, 100 - Math.round((totalScore / maxScore) * 100)));
  };

  // Calculate category scores
  const calculateCategoryScores = () => {
    const categories: Record<string, { total: number; max: number; count: number }> = {};
    
    filteredQuestions.forEach(q => {
      if (!categories[q.category]) {
        categories[q.category] = { total: 0, max: 0, count: 0 };
      }
      const answer = answers[q.id];
      if (answer) {
        categories[q.category].total += answer.score;
        categories[q.category].max += 4;
        categories[q.category].count++;
      }
    });

    return Object.entries(categories).map(([cat, data]) => ({
      category: cat,
      ...categoryColors[cat],
      score: data.max > 0 ? Math.round(100 - (data.total / data.max) * 100) : 0,
      questionCount: data.count,
    }));
  };

  // Go to results
  const goToResults = () => {
    const score = calculateScore();
    const categoryScores = calculateCategoryScores();
    
    // Store detailed results
    const results = {
      score,
      plan,
      profile,
      categoryScores,
      highRiskFlags,
      answers,
      totalQuestions,
      completedAt: new Date().toISOString(),
    };
    
    localStorage.setItem('auditResults', JSON.stringify(results));
    router.push(`/audit/results?score=${score}&plan=${plan}`);
  };

  // Render profiling phase
  if (phase === 'profiling') {
    return (
      <div className="min-h-screen bg-[#0A0A1B] text-white">
        <NeuralBackground />
        
        <header className="relative z-10 border-b border-white/10 bg-black/20 backdrop-blur-xl">
          <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link href="/audit" className="text-white/60 hover:text-white">← Retour</Link>
            <div className="text-center">
              <h1 className="text-lg font-bold">Audit AI Act</h1>
              <p className="text-sm text-white/60">Plan {plan.charAt(0).toUpperCase() + plan.slice(1)}</p>
            </div>
            <div className="text-sm text-white/60">Étape 1/2</div>
          </div>
        </header>

        <main className="relative z-10 px-6 py-12">
          <ProfilingStep
            profile={profile}
            setProfile={setProfile}
            onComplete={() => {
              setAnswers({ ...answers, profile });
              setPhase('questions');
            }}
          />
        </main>
      </div>
    );
  }

  // Render complete phase
  if (phase === 'complete' || isComplete) {
    const score = calculateScore();
    const categoryScores = calculateCategoryScores();
    
    return (
      <div className="min-h-screen bg-[#0A0A1B] text-white">
        <NeuralBackground />
        <main className="relative z-10 max-w-3xl mx-auto px-6 py-12">
          <HoloCard glow="#00FF88">
            <div className="p-8 text-center">
              <div className="text-7xl mb-6">✅</div>
              <h2 className="text-2xl font-bold text-white mb-2">Audit terminé !</h2>
              <p className="text-white/60 mb-8">{totalQuestions} questions analysées</p>
              
              {/* Score */}
              <div className="bg-white/5 rounded-2xl p-6 mb-6">
                <p className="text-white/60 text-sm mb-2">Votre score global</p>
                <div className="text-6xl font-bold mb-2" style={{ 
                  color: score >= 70 ? '#00FF88' : score >= 40 ? '#FFB800' : '#FF4444' 
                }}>
                  {score}%
                </div>
                <p className="text-white/50 text-sm">
                  {score >= 70 ? '✅ Bon niveau de conformité' : 
                   score >= 40 ? '⚠️ Des améliorations nécessaires' : 
                   '🚨 Actions urgentes requises'}
                </p>
              </div>

              {/* High risk alert */}
              {highRiskFlags.length > 0 && (
                <div className="bg-[#FF4444]/10 border border-[#FF4444]/30 rounded-xl p-4 mb-6 text-left">
                  <div className="flex items-center gap-2 text-[#FF4444] font-medium mb-2">
                    <span>⚠️</span>
                    <span>{highRiskFlags.length} système(s) à haut risque détecté(s)</span>
                  </div>
                  <p className="text-white/60 text-sm">
                    Certaines de vos réponses indiquent l'utilisation de systèmes IA à haut risque selon l'AI Act. 
                    Consultez le rapport pour les recommandations spécifiques.
                  </p>
                </div>
              )}

              {/* Category preview */}
              <div className="bg-white/5 rounded-xl p-4 mb-8 text-left">
                <p className="text-white/60 text-sm mb-3">Score par catégorie :</p>
                <div className="space-y-2">
                  {categoryScores.slice(0, 6).map((cat, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <span className="text-lg">{cat.icon}</span>
                      <div className="flex-1">
                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                          <div 
                            className="h-full rounded-full transition-all duration-500"
                            style={{ width: `${cat.score}%`, backgroundColor: cat.color }}
                          />
                        </div>
                      </div>
                      <span className="text-sm font-medium w-12 text-right" style={{ color: cat.color }}>
                        {cat.score}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              
              <button 
                onClick={goToResults} 
                className="w-full py-4 bg-gradient-to-r from-[#8B5CF6] to-[#00F5FF] text-white font-bold rounded-xl"
              >
                Voir mon rapport détaillé →
              </button>
            </div>
          </HoloCard>
        </main>
      </div>
    );
  }

  // Render questions phase
  const currentQ = filteredQuestions[currentQuestion];
  if (!currentQ) return null;

  const catColor = categoryColors[currentQ.category] || { color: '#8B5CF6', icon: '📋' };

  return (
    <div className="min-h-screen bg-[#0A0A1B] text-white">
      <NeuralBackground />
      
      {/* Header */}
      <header className="relative z-10 border-b border-white/10 bg-black/20 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/audit" className="text-white/60 hover:text-white text-sm">← Quitter</Link>
          <div className="text-center">
            <h1 className="text-lg font-bold">Audit AI Act</h1>
            <p className="text-sm text-white/60">
              Plan {plan.charAt(0).toUpperCase() + plan.slice(1)}
              {profile.name && ` • ${profile.name}`}
            </p>
          </div>
          <p className="text-sm text-white/60">{currentQuestion + 1}/{totalQuestions}</p>
        </div>
      </header>
      
      {/* Progress bar */}
      <div className="relative z-10 bg-black/20">
        <div className="max-w-4xl mx-auto px-6">
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-gradient-to-r from-[#8B5CF6] to-[#00F5FF]" 
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      </div>
      
      {/* Question */}
      <main className="relative z-10 max-w-3xl mx-auto px-6 py-12">
        <AnimatePresence mode="wait">
          <motion.div 
            key={currentQuestion} 
            initial={{ opacity: 0, x: 20 }} 
            animate={{ opacity: 1, x: 0 }} 
            exit={{ opacity: 0, x: -20 }}
          >
            {/* Category badge */}
            <div className="flex items-center justify-center gap-2 mb-8">
              <span className="text-2xl">{catColor.icon}</span>
              <span 
                className="text-sm font-medium px-3 py-1 rounded-full" 
                style={{ backgroundColor: `${catColor.color}20`, color: catColor.color }}
              >
                {currentQ.category.charAt(0).toUpperCase() + currentQ.category.slice(1)}
              </span>
              {currentQ.aiActRef && (
                <span className="text-xs text-white/40 ml-2">
                  📖 {currentQ.aiActRef}
                </span>
              )}
            </div>
            
            <HoloCard glow={catColor.color}>
              <div className="p-8">
                {/* Question */}
                <h2 className="text-xl font-semibold text-white mb-2 text-center">
                  {currentQ.question}
                </h2>
                
                {/* Info box */}
                {currentQ.infoBox && (
                  <div className="bg-white/5 border border-white/10 rounded-lg p-3 mb-6 text-center">
                    <p className="text-sm text-white/70">{currentQ.infoBox}</p>
                  </div>
                )}
                
                {/* Options */}
                <div className="space-y-3 mt-8">
                  {currentQ.options.map((option, index) => (
                    <motion.button 
                      key={index} 
                      onClick={() => handleAnswer(currentQ.id, index, option.score, option.highRiskFlag)}
                      className={`w-full p-4 text-left rounded-xl border transition-all ${
                        option.highRiskFlag 
                          ? 'border-[#FF6B00]/30 bg-[#FF6B00]/5 hover:bg-[#FF6B00]/10' 
                          : 'border-white/10 bg-white/5 hover:bg-white/10'
                      }`}
                      whileHover={{ scale: 1.01 }} 
                      whileTap={{ scale: 0.99 }}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 ${
                          option.highRiskFlag ? 'border-[#FF6B00]' : 'border-white/30'
                        }`} />
                        <span>{option.label}</span>
                        {option.highRiskFlag && (
                          <span className="ml-auto text-xs text-[#FF6B00]">⚠️ Haut risque</span>
                        )}
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            </HoloCard>

            {/* Navigation hint */}
            <div className="text-center mt-6 text-white/40 text-sm">
              💡 Cliquez sur une réponse pour passer à la question suivante
            </div>
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
