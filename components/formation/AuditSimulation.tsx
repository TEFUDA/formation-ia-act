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
  category: 'registre' | 'technique' | 'gouvernance' | 'formation' | 'incident' | 'communication';
  icon: string;
  isReady: boolean;
  quality: number;
  aiActReference?: string;
  criticalFor?: string[];
}

interface Character {
  id: string;
  name: string;
  role: string;
  avatar: string;
  mood: 'friendly' | 'neutral' | 'stressed' | 'angry' | 'helpful' | 'worried';
  trust: number;
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
}

interface AuditPhase {
  id: string;
  name: string;
  description: string;
  icon: string;
  duration: number;
  color: string;
}

interface DialogChoice {
  id: string;
  text: string;
  shortText?: string;
  requiresDocument?: string;
  requiresMultipleDocs?: string[];
  effect: {
    trust?: number;
    stress?: number;
    evidence?: number;
    reputation?: number;
    time?: number;
  };
  nextNode: string;
  isOptimal?: boolean;
  isRisky?: boolean;
  isCriticalMistake?: boolean;
  aiActArticle?: string;
  feedback?: string;
}

interface DialogNode {
  id: string;
  phase: string;
  speaker: 'auditor' | 'player' | 'system' | 'dg' | 'dsi' | 'drh' | 'rh' | 'colleague' | 'phone' | 'legal';
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
  requiresPreviousChoice?: string;
}

interface RandomEvent {
  id: string;
  phase: string[];
  type: 'phone' | 'email' | 'visitor' | 'technical' | 'emergency' | 'opportunity';
  priority: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  icon: string;
  sender?: string;
  message: string;
  choices: {
    id: string;
    text: string;
    effect: { trust?: number; stress?: number; time?: number; evidence?: number; reputation?: number };
    outcome: string;
    isOptimal?: boolean;
  }[];
}

interface MiniGame {
  id: string;
  type: 'document_search' | 'quick_answer' | 'priority_sort' | 'risk_classification';
  title: string;
  description: string;
  timeLimit: number;
  reward: { evidence?: number; trust?: number; stress?: number };
  penalty: { evidence?: number; trust?: number; stress?: number };
}

// ============================================
// GAME CONSTANTS
// ============================================
const AUDIT_PHASES: AuditPhase[] = [
  { id: 'notification', name: 'Notification', description: 'Réception de l\'avis d\'audit', icon: '📬', duration: 120, color: '#8B5CF6' },
  { id: 'preparation', name: 'Préparation', description: 'Organisation et collecte des documents', icon: '📋', duration: 300, color: '#00F5FF' },
  { id: 'accueil', name: 'Accueil', description: 'Arrivée de l\'auditrice et cadrage', icon: '🤝', duration: 600, color: '#00FF88' },
  { id: 'documentation', name: 'Revue Documentaire', description: 'Examen des dossiers de conformité', icon: '📁', duration: 900, color: '#FFB800' },
  { id: 'entretiens', name: 'Entretiens', description: 'Questions approfondies et démonstrations', icon: '💬', duration: 600, color: '#FF6B6B' },
  { id: 'cloture', name: 'Clôture', description: 'Synthèse et annonce du verdict', icon: '⚖️', duration: 300, color: '#10B981' }
];

const CHARACTERS: Character[] = [
  { id: 'auditor', name: 'Marie Durand', role: 'Auditrice Senior - Commission Nationale IA', avatar: '👩‍💼', mood: 'neutral', trust: 50 },
  { id: 'dg', name: 'Philippe Martin', role: 'Directeur Général', avatar: '👨‍💼', mood: 'worried', trust: 70 },
  { id: 'dsi', name: 'Thomas Leroy', role: 'Directeur des Systèmes d\'Information', avatar: '👨‍💻', mood: 'stressed', trust: 60 },
  { id: 'drh', name: 'Sophie Bernard', role: 'Directrice des Ressources Humaines', avatar: '👩‍💼', mood: 'neutral', trust: 65 },
  { id: 'colleague', name: 'Lucas Petit', role: 'Chef de projet IA', avatar: '🧑‍💻', mood: 'helpful', trust: 80 },
  { id: 'legal', name: 'Claire Moreau', role: 'Juriste', avatar: '👩‍⚖️', mood: 'neutral', trust: 75 }
];

const INITIAL_DOCUMENTS: Document[] = [
  // REGISTRE & CARTOGRAPHIE
  { id: 'registre_ia', name: 'Registre des systèmes IA', description: 'Liste exhaustive de tous les systèmes IA déployés', category: 'registre', icon: '📋', isReady: true, quality: 85, aiActReference: 'Article 29', criticalFor: ['accueil', 'documentation'] },
  { id: 'cartographie', name: 'Cartographie des systèmes', description: 'Vue d\'ensemble par département et usage', category: 'registre', icon: '🗺️', isReady: true, quality: 75, criticalFor: ['documentation'] },
  { id: 'classification_matrix', name: 'Matrice de classification des risques', description: 'Classification de chaque système selon l\'annexe III', category: 'registre', icon: '⚖️', isReady: false, quality: 0, aiActReference: 'Article 6 & Annexe III', criticalFor: ['documentation'] },
  { id: 'fiches_systemes', name: 'Fiches détaillées par système', description: '14 fiches avec specs techniques et usages', category: 'registre', icon: '📄', isReady: true, quality: 70, criticalFor: ['entretiens'] },
  
  // DOCUMENTATION TECHNIQUE
  { id: 'doc_technique_rh', name: 'Documentation technique - IA RH', description: 'Specs fournisseur du système de recrutement', category: 'technique', icon: '📑', isReady: true, quality: 60, aiActReference: 'Article 13', criticalFor: ['documentation', 'entretiens'] },
  { id: 'doc_technique_credit', name: 'Documentation technique - Scoring crédit', description: 'Specs fournisseur du système de scoring', category: 'technique', icon: '📑', isReady: false, quality: 0, aiActReference: 'Article 13', criticalFor: ['documentation'] },
  { id: 'aipd_rh', name: 'AIPD - Système RH', description: 'Analyse d\'impact sur les droits fondamentaux', category: 'technique', icon: '🔍', isReady: false, quality: 0, aiActReference: 'Article 27', criticalFor: ['documentation', 'entretiens'] },
  { id: 'aipd_credit', name: 'AIPD - Scoring crédit', description: 'Analyse d\'impact droits fondamentaux crédit', category: 'technique', icon: '🔍', isReady: true, quality: 65, aiActReference: 'Article 27', criticalFor: ['documentation'] },
  { id: 'tests_biais', name: 'Rapports de tests de biais', description: 'Audits trimestriels d\'équité algorithmique', category: 'technique', icon: '📊', isReady: true, quality: 80, aiActReference: 'Article 10', criticalFor: ['entretiens'] },
  { id: 'logs_decisions', name: 'Logs des décisions IA', description: 'Historique traçable des décisions automatisées', category: 'technique', icon: '💾', isReady: true, quality: 55, aiActReference: 'Article 12', criticalFor: ['entretiens'] },
  { id: 'metriques_performance', name: 'Métriques de performance', description: 'KPIs et indicateurs de qualité des modèles', category: 'technique', icon: '📈', isReady: true, quality: 70, criticalFor: ['entretiens'] },
  
  // GOUVERNANCE
  { id: 'politique_ia', name: 'Politique d\'utilisation de l\'IA', description: 'Cadre de gouvernance validé par la direction', category: 'gouvernance', icon: '📜', isReady: true, quality: 90, aiActReference: 'Article 4', criticalFor: ['accueil', 'documentation'] },
  { id: 'charte_ethique', name: 'Charte éthique IA', description: 'Principes et valeurs pour l\'usage de l\'IA', category: 'gouvernance', icon: '⚡', isReady: true, quality: 85, criticalFor: ['documentation'] },
  { id: 'procedures_supervision', name: 'Procédures de supervision humaine', description: 'Processus de contrôle humain des décisions IA', category: 'gouvernance', icon: '👁️', isReady: false, quality: 0, aiActReference: 'Article 14', criticalFor: ['entretiens'] },
  { id: 'organigramme_ia', name: 'Organigramme gouvernance IA', description: 'Rôles et responsabilités conformité', category: 'gouvernance', icon: '🏛️', isReady: true, quality: 75, criticalFor: ['accueil'] },
  { id: 'comite_ethique', name: 'PV Comité d\'éthique IA', description: 'Compte-rendus des réunions du comité', category: 'gouvernance', icon: '📝', isReady: true, quality: 60, criticalFor: ['documentation'] },
  
  // FORMATION
  { id: 'plan_formation', name: 'Plan de formation IA', description: 'Programme de montée en compétences', category: 'formation', icon: '🎓', isReady: true, quality: 70, aiActReference: 'Article 4', criticalFor: ['entretiens'] },
  { id: 'attestations', name: 'Attestations de formation', description: 'Certificats des collaborateurs formés', category: 'formation', icon: '📜', isReady: true, quality: 65, criticalFor: ['entretiens'] },
  { id: 'quiz_conformite', name: 'Résultats quiz conformité', description: 'Scores des tests de connaissance interne', category: 'formation', icon: '✅', isReady: false, quality: 0, criticalFor: ['entretiens'] },
  
  // INCIDENTS
  { id: 'registre_incidents', name: 'Registre des incidents IA', description: 'Historique des dysfonctionnements', category: 'incident', icon: '🚨', isReady: false, quality: 0, aiActReference: 'Article 62', criticalFor: ['entretiens'] },
  { id: 'procedure_incident', name: 'Procédure de gestion d\'incident', description: 'Process de détection, notification, remédiation', category: 'incident', icon: '📋', isReady: true, quality: 50, aiActReference: 'Article 62', criticalFor: ['entretiens'] },
  { id: 'post_mortems', name: 'Analyses post-incident', description: 'Root cause analysis des incidents passés', category: 'incident', icon: '🔬', isReady: false, quality: 0, criticalFor: ['entretiens'] },
  
  // COMMUNICATION
  { id: 'mentions_legales', name: 'Mentions légales IA', description: 'Textes d\'information aux utilisateurs', category: 'communication', icon: '📢', isReady: true, quality: 80, aiActReference: 'Article 50', criticalFor: ['documentation'] },
  { id: 'consentements', name: 'Preuves de consentement', description: 'Logs des acceptations utilisateurs', category: 'communication', icon: '✍️', isReady: true, quality: 60, criticalFor: ['entretiens'] },
  { id: 'faq_ia', name: 'FAQ IA pour les utilisateurs', description: 'Questions fréquentes sur nos systèmes IA', category: 'communication', icon: '❓', isReady: true, quality: 70, criticalFor: ['documentation'] }
];

// ============================================
// RANDOM EVENTS (15+)
// ============================================
const RANDOM_EVENTS: RandomEvent[] = [
  // PHASE PREPARATION
  {
    id: 'dg_stress',
    phase: ['preparation'],
    type: 'phone',
    priority: 'high',
    title: 'Appel du DG',
    icon: '📱',
    sender: 'Philippe Martin (DG)',
    message: "Je viens d'apprendre pour l'audit. C'est une catastrophe si on échoue ! Qu'est-ce que je dois dire si l'auditrice veut me voir ? Je ne connais rien à l'IA !",
    choices: [
      { id: 'a', text: "Je vous prépare un brief de 5 points clés. Restez factuel et renvoyez vers moi pour les détails.", effect: { stress: -5, trust: 5, time: -60 }, outcome: "Le DG est rassuré. Vous gagnez sa confiance.", isOptimal: true },
      { id: 'b', text: "Ne vous inquiétez pas, je gère tout. Évitez de croiser l'auditrice.", effect: { stress: 5, reputation: -5 }, outcome: "Le DG n'aime pas être mis à l'écart..." },
      { id: 'c', text: "Honnêtement, on n'est pas prêts. Il faudrait reporter.", effect: { stress: 15, trust: -10, reputation: -10 }, outcome: "Le DG panique. L'ambiance se dégrade." }
    ]
  },
  {
    id: 'missing_doc',
    phase: ['preparation'],
    type: 'emergency',
    priority: 'critical',
    title: 'Document introuvable',
    icon: '🔥',
    message: "Lucas (chef de projet IA) vous alerte : \"Je ne trouve plus le rapport d'audit des biais du système RH ! Il était sur le serveur partagé mais quelqu'un l'a déplacé !\"",
    choices: [
      { id: 'a', text: "On lance une recherche dans tous les dossiers. Lucas, mobilise l'équipe.", effect: { time: -120, stress: 10 }, outcome: "Après 10 minutes de recherche, vous retrouvez le fichier dans un sous-dossier archivé.", isOptimal: true },
      { id: 'b', text: "On fera sans. Ce n'est qu'un document parmi d'autres.", effect: { evidence: -15, stress: 5 }, outcome: "Mauvais choix. Ce document est critique pour démontrer l'absence de biais." },
      { id: 'c', text: "On reconstitue le document à partir des données brutes.", effect: { time: -180, stress: 15, evidence: -5 }, outcome: "Vous perdez un temps précieux et le document reconstitué est incomplet." }
    ]
  },
  {
    id: 'dsi_conflict',
    phase: ['preparation', 'documentation'],
    type: 'visitor',
    priority: 'medium',
    title: 'Tension avec le DSI',
    icon: '😤',
    sender: 'Thomas Leroy (DSI)',
    message: "Le DSI débarque dans votre bureau : \"Je refuse que l'auditrice accède à nos serveurs ! C'est une question de sécurité. Nos systèmes sont confidentiels !\"",
    choices: [
      { id: 'a', text: "Thomas, la loi nous oblige à coopérer. On peut limiter l'accès aux logs pertinents sans exposer l'infrastructure complète.", effect: { trust: 5, stress: 5 }, outcome: "Le DSI accepte un compromis. Vous montrez votre capacité de négociation.", isOptimal: true },
      { id: 'b', text: "C'est un audit officiel, on n'a pas le choix. Préparez les accès.", effect: { trust: -5, stress: 10, reputation: -5 }, outcome: "Le DSI se braque. Il risque d'être hostile pendant l'audit." },
      { id: 'c', text: "OK, on dira qu'on a des problèmes techniques temporaires.", effect: { trust: -20, evidence: -20, stress: 15 }, outcome: "Terrible idée. Si l'auditrice découvre le mensonge, c'est la catastrophe." }
    ]
  },
  
  // PHASE ACCUEIL
  {
    id: 'auditor_early',
    phase: ['accueil'],
    type: 'visitor',
    priority: 'high',
    title: 'Arrivée anticipée',
    icon: '⏰',
    message: "L'auditrice arrive avec 15 minutes d'avance. La salle de réunion n'est pas encore prête et le DG est en call !",
    choices: [
      { id: 'a', text: "Je l'accueille avec un café et lui propose une visite des locaux en attendant.", effect: { trust: 10, stress: 5 }, outcome: "L'auditrice apprécie votre adaptabilité. Vous gagnez du temps pour finaliser.", isOptimal: true },
      { id: 'b', text: "Je la fais patienter à l'accueil en m'excusant du retard.", effect: { trust: -10, stress: 10 }, outcome: "Elle note 'Organisation défaillante' dans ses premières impressions..." },
      { id: 'c', text: "Je la fais entrer directement dans la salle en désordre.", effect: { trust: -15, stress: 15 }, outcome: "L'image d'amateurisme est immédiate. Mauvais départ." }
    ]
  },
  {
    id: 'phone_ring',
    phase: ['accueil', 'documentation', 'entretiens'],
    type: 'phone',
    priority: 'low',
    title: 'Téléphone qui sonne',
    icon: '📱',
    message: "Votre téléphone sonne en pleine discussion avec l'auditrice. C'est un numéro inconnu.",
    choices: [
      { id: 'a', text: "Je coupe discrètement et m'excuse d'un regard.", effect: { stress: 2 }, outcome: "L'auditrice hoche la tête. Professionnalisme noté.", isOptimal: true },
      { id: 'b', text: "Je décroche rapidement : \"Je vous rappelle\" et raccroche.", effect: { trust: -5, stress: 5 }, outcome: "L'auditrice lève un sourcil. Interruption malvenue." },
      { id: 'c', text: "Je laisse sonner sans réagir.", effect: { stress: 10 }, outcome: "La sonnerie persistante crée un malaise..." }
    ]
  },
  
  // PHASE DOCUMENTATION
  {
    id: 'printer_jam',
    phase: ['documentation'],
    type: 'technical',
    priority: 'medium',
    title: 'Imprimante en panne',
    icon: '🖨️',
    message: "Vous devez imprimer un document crucial que l'auditrice a demandé, mais l'imprimante est bloquée !",
    choices: [
      { id: 'a', text: "Je lui montre sur mon écran en attendant qu'un collègue règle l'imprimante.", effect: { time: -30 }, outcome: "Solution pragmatique. L'auditrice accède quand même à l'information.", isOptimal: true },
      { id: 'b', text: "Je cours à l'autre étage chercher une imprimante qui marche.", effect: { time: -180, stress: 10 }, outcome: "Vous revenez essoufflé, 3 minutes plus tard..." },
      { id: 'c', text: "Je dis que le document n'est pas disponible pour le moment.", effect: { trust: -15, evidence: -10 }, outcome: "L'auditrice note le document comme non fourni." }
    ]
  },
  {
    id: 'contradiction_found',
    phase: ['documentation'],
    type: 'emergency',
    priority: 'critical',
    title: 'Contradiction détectée',
    icon: '⚠️',
    message: "L'auditrice pointe une incohérence : \"Votre registre indique 14 systèmes, mais votre cartographie n'en liste que 11. Pouvez-vous m'expliquer ?\"",
    choices: [
      { id: 'a', text: "Vous avez raison, je vérifie immédiatement. *Vous consultez les documents* Les 3 systèmes manquants sont dans l'annexe 'Projets pilotes'. Je mets à jour la cartographie.", effect: { trust: 5, evidence: -5, stress: 10 }, outcome: "Votre honnêteté et réactivité sont appréciées, malgré l'erreur.", isOptimal: true },
      { id: 'b', text: "Ce sont des systèmes en cours de décommissionnement, donc on ne les compte plus.", effect: { trust: -10, evidence: -10 }, outcome: "L'auditrice demande la preuve du décommissionnement... que vous n'avez pas." },
      { id: 'c', text: "C'est une erreur de saisie dans la cartographie, le registre fait foi.", effect: { trust: -5, evidence: -5 }, outcome: "Elle note 'Documents non fiables - vérification nécessaire'." }
    ]
  },
  {
    id: 'vendor_call',
    phase: ['documentation', 'entretiens'],
    type: 'email',
    priority: 'high',
    title: 'Email du fournisseur',
    icon: '📧',
    sender: 'Support TechIA (fournisseur)',
    message: "\"Suite à votre demande urgente de documentation technique, nous vous informons que les spécifications détaillées de notre modèle sont couvertes par le secret commercial. Nous ne pouvons pas les transmettre.\"",
    choices: [
      { id: 'a', text: "Je montre l'email à l'auditrice et explique que j'ai engagé une procédure d'escalade avec leur direction commerciale et juridique.", effect: { trust: 10, stress: 5 }, outcome: "Votre transparence et votre proactivité sont saluées.", isOptimal: true },
      { id: 'b', text: "Je garde ça pour moi et espère qu'elle ne demandera pas ces détails.", effect: { trust: -15, stress: 20 }, outcome: "Risqué. Si elle découvre l'email, votre crédibilité s'effondre." },
      { id: 'c', text: "Je dis que le fournisseur a promis d'envoyer les docs d'ici demain.", effect: { trust: -10, evidence: -5 }, outcome: "Un mensonge qui risque de vous rattraper..." }
    ]
  },
  
  // PHASE ENTRETIENS
  {
    id: 'rh_panic',
    phase: ['entretiens'],
    type: 'visitor',
    priority: 'high',
    title: 'La DRH panique',
    icon: '😰',
    sender: 'Sophie Bernard (DRH)',
    message: "La DRH vous prend à part : \"L'auditrice veut voir le système de recrutement en live ! Mais j'ai peur qu'elle découvre qu'on rejette automatiquement les CV sans diplôme bac+5...\"",
    choices: [
      { id: 'a', text: "Sophie, c'est le moment d'être transparent. On explique le critère et on montre qu'un humain valide chaque rejet. C'est mieux qu'elle le découvre plutôt qu'on le cache.", effect: { trust: 10, stress: 10, evidence: 5 }, outcome: "L'auditrice apprécie l'honnêteté. Elle note le critère mais valide la supervision humaine.", isOptimal: true },
      { id: 'b', text: "On désactive temporairement ce filtre le temps de la démo.", effect: { trust: -30, evidence: -20, stress: 25 }, outcome: "CATASTROPHE. L'auditrice vérifie les logs et voit la modification. C'est une obstruction." },
      { id: 'c', text: "On lui montre une version 'démo' du système, pas la prod.", effect: { trust: -20, evidence: -15, stress: 20 }, outcome: "Elle demande l'accès à la vraie production. Votre crédibilité s'effrite." }
    ]
  },
  {
    id: 'bias_live',
    phase: ['entretiens'],
    type: 'emergency',
    priority: 'critical',
    title: 'Biais détecté en direct !',
    icon: '🚨',
    message: "Pendant la démonstration, l'auditrice remarque : \"Tiens, votre système a rejeté 3 CV de suite de candidates féminines. C'est normal ?\"",
    choices: [
      { id: 'a', text: "Je vérifie immédiatement les scores détaillés. *Analyse* Ces rejets sont basés sur l'expérience requise, pas le genre. Voici les critères appliqués pour chaque cas.", effect: { trust: 5, stress: 15, evidence: 5 }, outcome: "Votre réponse factuelle et documentée rassure l'auditrice.", isOptimal: true },
      { id: 'b', text: "C'est une coïncidence statistique. Sur un échantillon plus large, c'est équilibré.", effect: { trust: -10, evidence: -10, stress: 10 }, outcome: "Elle demande les stats sur 6 mois. Vous les avez ?" },
      { id: 'c', text: "Le système n'a pas accès au genre des candidats, c'est impossible.", effect: { trust: -15, evidence: -15 }, outcome: "Elle vérifie et constate que les prénoms sont bien visibles par le modèle..." }
    ]
  },
  {
    id: 'colleague_gaffe',
    phase: ['entretiens'],
    type: 'visitor',
    priority: 'high',
    title: 'Gaffe d\'un collègue',
    icon: '🤦',
    message: "Lucas (chef de projet IA) lâche devant l'auditrice : \"Ah oui, ce système-là on ne l'a pas documenté, il est expérimental depuis 6 mois mais on l'utilise quand même en prod...\"",
    choices: [
      { id: 'a', text: "Je prends le relais : \"Lucas fait référence à notre POC en phase de qualification. Il n'est pas en production au sens réglementaire. Voici la roadmap de mise en conformité.\"", effect: { trust: -5, stress: 15, evidence: -5 }, outcome: "Vous rattrapez partiellement la gaffe, mais l'auditrice note l'incohérence.", isOptimal: true },
      { id: 'b', text: "Je foudroie Lucas du regard et change de sujet.", effect: { trust: -20, evidence: -15, stress: 20 }, outcome: "L'auditrice a très bien compris ce qui vient de se passer." },
      { id: 'c', text: "Je confirme : \"Oui, on a pris du retard sur ce système mais on rattrape.\"", effect: { trust: -10, evidence: -10, stress: 10 }, outcome: "Au moins vous êtes honnête, mais c'est une non-conformité flagrante." }
    ]
  },
  {
    id: 'system_crash_live',
    phase: ['entretiens'],
    type: 'technical',
    priority: 'critical',
    title: 'Crash en pleine démo',
    icon: '💥',
    message: "L'écran affiche soudainement : \"Erreur 500 - Service indisponible\". Le système de recrutement IA vient de planter devant l'auditrice !",
    choices: [
      { id: 'a', text: "Je reste calme : \"C'est l'occasion de vous montrer notre procédure d'incident. *Je lance le processus* Notification envoyée, bascule sur le backup, et voici le log d'erreur.\"", effect: { trust: 15, stress: 10, evidence: 10 }, outcome: "Brillant ! Vous transformez un problème en démonstration de maîtrise.", isOptimal: true },
      { id: 'b', text: "Je redémarre le service en urgence et m'excuse pour ce bug rare.", effect: { trust: -5, stress: 15 }, outcome: "L'auditrice demande à voir l'historique des incidents... Ça fait combien de 'bugs rares' cette année ?" },
      { id: 'c', text: "C'est la première fois que ça arrive ! Je ne comprends pas...", effect: { trust: -15, stress: 25, evidence: -10 }, outcome: "L'auditrice note : 'Gestion de crise déficiente, équipe non préparée'." }
    ]
  },
  
  // PHASE CLÔTURE  
  {
    id: 'dg_intervention',
    phase: ['cloture'],
    type: 'visitor',
    priority: 'high',
    title: 'Le DG s\'en mêle',
    icon: '👔',
    sender: 'Philippe Martin (DG)',
    message: "Le DG entre dans la salle pour la conclusion : \"Madame l'auditrice, avant votre verdict, je tiens à vous assurer que notre entreprise place l'éthique au cœur de sa stratégie. Nous investissons massivement dans la conformité...\"",
    choices: [
      { id: 'a', text: "Je laisse le DG terminer puis je complète avec les chiffres : budget conformité, formation, projets en cours.", effect: { trust: 5, reputation: 5 }, outcome: "Le discours du DG est crédibilisé par vos données factuelles.", isOptimal: true },
      { id: 'b', text: "Je coupe le DG : \"Merci Philippe, je pense que l'auditrice préfère les faits aux discours.\"", effect: { trust: 5, reputation: -10 }, outcome: "L'auditrice apprécie, mais vous venez d'humilier votre DG..." },
      { id: 'c', text: "Je laisse le DG monopoliser la parole pendant 5 minutes.", effect: { trust: -10, time: -120 }, outcome: "L'auditrice s'impatiente. Le DG parle beaucoup mais ne dit rien de concret." }
    ]
  },
  {
    id: 'last_chance',
    phase: ['cloture'],
    type: 'opportunity',
    priority: 'high',
    title: 'Dernière chance',
    icon: '🎯',
    message: "L'auditrice vous regarde : \"Avant de conclure, y a-t-il un élément que vous souhaitez ajouter ou un document que vous n'avez pas eu l'occasion de présenter ?\"",
    choices: [
      { id: 'a', text: "Oui, je souhaite vous montrer notre roadmap conformité 2025 avec les investissements prévus et les jalons de mise en conformité complète.", effect: { trust: 10, evidence: 10 }, outcome: "Vous finissez sur une note proactive. L'auditrice apprécie la vision long terme.", isOptimal: true },
      { id: 'b', text: "Je pense que nous avons couvert l'essentiel. Merci pour cet échange.", effect: { trust: 0 }, outcome: "Neutre. Vous ne gagnez ni ne perdez de points." },
      { id: 'c', text: "Oui, je conteste plusieurs de vos observations. Notre système est conforme selon notre lecture du règlement.", effect: { trust: -20, stress: 10 }, outcome: "L'auditrice se ferme. Contester son autorité en fin d'audit est très mal perçu." }
    ]
  }
];

// Suite dans la partie 2...

// ============================================
// DIALOGUE SCENARIO - 100+ NODES
// ============================================
const DIALOGUE_SCENARIO: DialogNode[] = [
  // ========== PHASE: NOTIFICATION ==========
  {
    id: 'notif_start',
    phase: 'notification',
    speaker: 'system',
    text: "📬 LUNDI 9H00 - Vous recevez un email officiel de la Commission Nationale de l'Intelligence Artificielle...",
    autoNext: 'notif_email',
    delay: 2000
  },
  {
    id: 'notif_email',
    phase: 'notification',
    speaker: 'system',
    text: "\"Objet : NOTIFICATION D'AUDIT DE CONFORMITÉ AI ACT\n\nMadame, Monsieur,\n\nConformément à l'article 74 du Règlement (UE) 2024/1689, nous vous informons qu'un contrôle de conformité de vos systèmes d'intelligence artificielle sera effectué ce jour à 14h00.\n\nL'auditrice désignée est Mme Marie Durand.\n\nMerci de préparer l'ensemble des documents relatifs à vos systèmes IA.\n\nCordialement,\nCommission Nationale de l'IA\"",
    autoNext: 'notif_reaction',
    delay: 5000,
    effect: { stress: 20 }
  },
  {
    id: 'notif_reaction',
    phase: 'notification',
    speaker: 'system',
    text: "Vous avez 5 heures pour vous préparer. C'est un audit inopiné - la situation est tendue.",
    autoNext: 'notif_choice',
    delay: 2000
  },
  {
    id: 'notif_choice',
    phase: 'notification',
    speaker: 'player',
    text: "",
    choices: [
      { id: 'a', text: "Garder son calme et convoquer immédiatement une réunion de crise avec DSI, DRH et juridique", shortText: "Réunion de crise", effect: { stress: -10, trust: 5 }, nextNode: 'notif_crisis_meeting', isOptimal: true },
      { id: 'b', text: "Foncer tête baissée pour rassembler tous les documents disponibles", shortText: "Rassembler les docs seul", effect: { stress: 10, time: -60 }, nextNode: 'notif_solo' },
      { id: 'c', text: "Appeler le DG pour lui annoncer la nouvelle", shortText: "Appeler le DG d'abord", effect: { stress: 5 }, nextNode: 'notif_dg_call' }
    ]
  },
  {
    id: 'notif_crisis_meeting',
    phase: 'notification',
    speaker: 'system',
    text: "Bonne initiative ! En 15 minutes, vous avez réuni les personnes clés. Chacun sait ce qu'il doit préparer. L'équipe est mobilisée.",
    effect: { evidence: 10, reputation: 5 },
    autoNext: 'prep_start',
    delay: 3000
  },
  {
    id: 'notif_solo',
    phase: 'notification',
    speaker: 'system',
    text: "Vous courez dans tous les sens, mais personne ne sait ce qui se passe. La désorganisation règne.",
    effect: { evidence: -5, stress: 10 },
    autoNext: 'prep_start',
    delay: 3000
  },
  {
    id: 'notif_dg_call',
    phase: 'notification',
    speaker: 'dg',
    speakerName: 'Philippe Martin (DG)',
    text: "QUOI ?! Un audit aujourd'hui ?! Mais c'est impossible, j'ai un conseil d'administration cet après-midi ! Vous vous rendez compte des conséquences si ça se passe mal ?!",
    mood: 'worried',
    autoNext: 'notif_dg_response',
    delay: 3000
  },
  {
    id: 'notif_dg_response',
    phase: 'notification',
    speaker: 'player',
    text: "",
    choices: [
      { id: 'a', text: "Philippe, je gère. Concentrez-vous sur le CA, je vous fais un point à 13h30.", effect: { reputation: 10, stress: -5 }, nextNode: 'prep_start', isOptimal: true },
      { id: 'b', text: "Il faudrait peut-être que vous soyez là pour l'accueil de l'auditrice...", effect: { stress: 5 }, nextNode: 'notif_dg_reluctant' }
    ]
  },
  {
    id: 'notif_dg_reluctant',
    phase: 'notification',
    speaker: 'dg',
    speakerName: 'Philippe Martin (DG)',
    text: "*soupir* Bon, je décalerai si c'est vraiment nécessaire. Mais je compte sur vous pour que ce soit rapide !",
    mood: 'stressed',
    autoNext: 'prep_start',
    delay: 2000
  },

  // ========== PHASE: PREPARATION ==========
  {
    id: 'prep_start',
    phase: 'preparation',
    speaker: 'system',
    text: "⏱️ PHASE DE PRÉPARATION - Vous avez 5 minutes (temps réel) pour préparer vos documents et briefer votre équipe.",
    isCheckpoint: true,
    autoNext: 'prep_docs_intro',
    delay: 2000
  },
  {
    id: 'prep_docs_intro',
    phase: 'preparation',
    speaker: 'colleague',
    speakerName: 'Lucas Petit (Chef de projet IA)',
    text: "J'ai commencé à rassembler les documents. On a le registre IA, la cartographie, et la politique de gouvernance. Mais il manque pas mal de choses... L'AIPD du système RH n'a jamais été finalisée !",
    mood: 'worried',
    choices: [
      { id: 'a', text: "Priorité 1 : finaliser l'AIPD même si c'est incomplet. C'est mieux qu'un trou.", shortText: "Finaliser l'AIPD en urgence", effect: { time: -120, evidence: 10 }, nextNode: 'prep_aipd_rush', isOptimal: true },
      { id: 'b', text: "On expliquera que c'est en cours. Concentrons-nous sur ce qui est prêt.", shortText: "Ignorer l'AIPD manquante", effect: { evidence: -10 }, nextNode: 'prep_continue' },
      { id: 'c', text: "Mince... Qu'est-ce qu'on a d'autre qui manque ?", shortText: "État des lieux complet", effect: { time: -60 }, nextNode: 'prep_inventory' }
    ]
  },
  {
    id: 'prep_aipd_rush',
    phase: 'preparation',
    speaker: 'colleague',
    speakerName: 'Lucas Petit',
    text: "OK, je m'y mets ! J'ai les données des tests de biais, je peux au moins documenter ça. Ça ne sera pas parfait mais c'est mieux que rien.",
    mood: 'helpful',
    effect: { stress: 5 },
    autoNext: 'prep_continue',
    delay: 2000
  },
  {
    id: 'prep_inventory',
    phase: 'preparation',
    speaker: 'colleague',
    speakerName: 'Lucas Petit',
    text: "Voyons... Il manque aussi : la matrice de classification formelle, les procédures de supervision humaine documentées, et le registre des incidents est... vide. On n'a jamais eu d'incident officiel.",
    mood: 'worried',
    autoNext: 'prep_inventory_choice',
    delay: 3000
  },
  {
    id: 'prep_inventory_choice',
    phase: 'preparation',
    speaker: 'player',
    text: "",
    choices: [
      { id: 'a', text: "Un registre d'incidents vide peut être positif si on sait l'expliquer. Focus sur la classification et les procédures.", effect: { evidence: 5, stress: -5 }, nextNode: 'prep_continue', isOptimal: true },
      { id: 'b', text: "Créons un faux incident pour montrer qu'on a un historique...", effect: { trust: -30, evidence: -20, stress: 20 }, nextNode: 'prep_bad_idea', isCriticalMistake: true }
    ]
  },
  {
    id: 'prep_bad_idea',
    phase: 'preparation',
    speaker: 'colleague',
    speakerName: 'Lucas Petit',
    text: "Euh... Fabriquer un faux incident ? Si l'auditrice vérifie les dates dans les logs, on est morts. C'est vraiment ce que tu veux faire ?",
    mood: 'worried',
    choices: [
      { id: 'a', text: "Tu as raison, oublie ça. On reste honnêtes.", effect: { stress: 10 }, nextNode: 'prep_continue' },
      { id: 'b', text: "Non, fais-le. On maquillera les logs.", effect: { trust: -50, evidence: -30, stress: 30 }, nextNode: 'prep_continue', isCriticalMistake: true, feedback: "ERREUR CRITIQUE : Falsifier des documents d'audit est un délit pénal." }
    ]
  },
  {
    id: 'prep_continue',
    phase: 'preparation',
    speaker: 'dsi',
    speakerName: 'Thomas Leroy (DSI)',
    text: "J'ai préparé les accès aux systèmes. Par contre, le serveur de logs est un peu lent aujourd'hui. J'espère qu'il ne plantera pas en pleine démo...",
    mood: 'stressed',
    choices: [
      { id: 'a', text: "Fais un export statique des logs clés en backup. Si le serveur plante, on aura au moins ça.", shortText: "Préparer un backup", effect: { evidence: 5, time: -30 }, nextNode: 'prep_final', isOptimal: true },
      { id: 'b', text: "Ça ira. Ne perdons pas de temps là-dessus.", shortText: "Pas de backup", effect: { time: 30 }, nextNode: 'prep_final' }
    ]
  },
  {
    id: 'prep_final',
    phase: 'preparation',
    speaker: 'system',
    text: "🔔 13H55 - L'auditrice vient d'arriver à l'accueil. Il est temps d'y aller.",
    effect: { stress: 10 },
    autoNext: 'accueil_start',
    delay: 3000,
    isCheckpoint: true
  },

  // ========== PHASE: ACCUEIL ==========
  {
    id: 'accueil_start',
    phase: 'accueil',
    speaker: 'system',
    text: "🤝 PHASE D'ACCUEIL - Première impression cruciale. L'auditrice vous évalue dès les premières secondes.",
    autoNext: 'accueil_lobby',
    delay: 2000
  },
  {
    id: 'accueil_lobby',
    phase: 'accueil',
    speaker: 'auditor',
    speakerName: 'Marie Durand (Auditrice)',
    text: "Bonjour. Marie Durand, Commission Nationale de l'IA. Je suis là pour le contrôle de conformité AI Act notifié ce matin. Pouvons-nous commencer ?",
    mood: 'neutral',
    choices: [
      { id: 'a', text: "Bonjour Madame Durand, bienvenue. Je suis [Nom], Responsable Conformité IA. Permettez-moi de vous offrir un café avant de nous installer en salle de réunion.", shortText: "Accueil chaleureux + café", effect: { trust: 15, stress: -5 }, nextNode: 'accueil_coffee', isOptimal: true },
      { id: 'b', text: "Bonjour. Suivez-moi, la salle est prête.", shortText: "Direct et efficace", effect: { trust: 0 }, nextNode: 'accueil_room' },
      { id: 'c', text: "Ah, vous êtes en avance... Euh, un instant, je vérifie que la salle est prête.", shortText: "Déstabilisé", effect: { trust: -10, stress: 10 }, nextNode: 'accueil_unprepared', isRisky: true }
    ]
  },
  {
    id: 'accueil_coffee',
    phase: 'accueil',
    speaker: 'auditor',
    speakerName: 'Marie Durand',
    text: "*Elle accepte le café avec un léger sourire* Merci, c'est appréciable. Vous savez, dans beaucoup d'audits, on nous accueille comme des ennemis. Ça change.",
    mood: 'friendly',
    effect: { trust: 5 },
    autoNext: 'accueil_room',
    delay: 3000
  },
  {
    id: 'accueil_unprepared',
    phase: 'accueil',
    speaker: 'auditor',
    speakerName: 'Marie Durand',
    text: "*Elle consulte sa montre* Je suis à l'heure prévue. La notification mentionnait 14h00. *Elle note quelque chose sur son carnet*",
    mood: 'impatient',
    effect: { trust: -5 },
    autoNext: 'accueil_room',
    delay: 3000
  },
  {
    id: 'accueil_room',
    phase: 'accueil',
    speaker: 'system',
    text: "Vous entrez en salle de réunion. L'auditrice sort son ordinateur portable et un épais dossier marqué du logo de la Commission.",
    autoNext: 'accueil_intro_audit',
    delay: 2000
  },
  {
    id: 'accueil_intro_audit',
    phase: 'accueil',
    speaker: 'auditor',
    speakerName: 'Marie Durand',
    text: "Bien. Permettez-moi de vous rappeler le cadre de cet audit. Il s'agit d'un contrôle de conformité au titre du Règlement européen sur l'IA, dit AI Act. Je vais examiner vos systèmes d'IA, leur documentation, votre gouvernance, et vos processus. L'audit durera environ 3 heures. Des questions avant de commencer ?",
    mood: 'neutral',
    aiActReference: 'Article 74 - Contrôle de conformité',
    choices: [
      { id: 'a', text: "Tout est clair. Notre équipe est mobilisée et nos documents sont prêts. Par où souhaitez-vous commencer ?", shortText: "Prêt et proactif", effect: { trust: 10 }, nextNode: 'accueil_role_question', isOptimal: true },
      { id: 'b', text: "Pouvez-vous me préciser quelles sanctions nous risquons en cas de non-conformité ?", shortText: "Question sur les sanctions", effect: { trust: -5, stress: 10 }, nextNode: 'accueil_sanctions' },
      { id: 'c', text: "Est-ce que nos avocats peuvent être présents ?", shortText: "Demander la présence des avocats", effect: { trust: -10, stress: 15 }, nextNode: 'accueil_lawyers' }
    ]
  },
  {
    id: 'accueil_sanctions',
    phase: 'accueil',
    speaker: 'auditor',
    speakerName: 'Marie Durand',
    text: "*Elle vous regarde avec un air surpris* Les sanctions vont de l'avertissement à des amendes pouvant atteindre 35 millions d'euros ou 7% du CA mondial pour les violations les plus graves. Mais je préférerais qu'on se concentre sur la conformité plutôt que sur les sanctions, non ?",
    mood: 'concerned',
    aiActReference: 'Article 99 - Amendes',
    autoNext: 'accueil_role_question',
    delay: 4000
  },
  {
    id: 'accueil_lawyers',
    phase: 'accueil',
    speaker: 'auditor',
    speakerName: 'Marie Durand',
    text: "Vous êtes en droit de faire appel à vos conseils juridiques, mais leur présence n'est pas obligatoire pour un audit de conformité. Dois-je comprendre que vous anticipez des problèmes ?",
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
    tip: "L'AI Act recommande un point de contact unique et identifié pour la conformité.",
    choices: [
      { id: 'a', text: "Je suis le Responsable Conformité IA, officiellement nommé par la Direction Générale en janvier dernier. Voici ma lettre de mission qui définit mes responsabilités et mon autorité.", shortText: "Rôle officiel + lettre de mission", requiresDocument: 'organigramme_ia', effect: { trust: 20, evidence: 15 }, nextNode: 'accueil_role_approved', isOptimal: true },
      { id: 'b', text: "Je suis le DPO et j'ai étendu mon périmètre à l'IA depuis l'entrée en vigueur du règlement.", shortText: "DPO étendu à l'IA", effect: { trust: 5, evidence: 5 }, nextNode: 'accueil_role_dpo' },
      { id: 'c', text: "C'est un peu informel. Plusieurs personnes s'occupent de l'IA dans l'entreprise.", shortText: "Pas de rôle défini", effect: { trust: -15, evidence: -10, stress: 10 }, nextNode: 'accueil_role_problem', isRisky: true }
    ]
  },
  {
    id: 'accueil_role_approved',
    phase: 'accueil',
    speaker: 'auditor',
    speakerName: 'Marie Durand',
    text: "*Elle examine le document* Très bien structuré. Je vois que vous avez autorité pour stopper des systèmes non conformes et un budget dédié. C'est exactement ce que recommande le règlement. *Elle coche une case sur son formulaire*",
    mood: 'pleased',
    effect: { evidence: 5 },
    autoNext: 'accueil_perimeter',
    delay: 3000
  },
  {
    id: 'accueil_role_dpo',
    phase: 'accueil',
    speaker: 'auditor',
    speakerName: 'Marie Durand',
    text: "DPO et responsable IA... C'est un cumul de fonctions. Avez-vous les ressources suffisantes pour les deux rôles ? Le RGPD et l'AI Act ont des exigences différentes.",
    mood: 'concerned',
    choices: [
      { id: 'a', text: "C'est temporaire. Un recrutement est en cours pour séparer les fonctions d'ici 6 mois.", effect: { trust: 5 }, nextNode: 'accueil_perimeter' },
      { id: 'b', text: "Les deux réglementations sont complémentaires, je gère.", effect: { trust: -5 }, nextNode: 'accueil_perimeter' }
    ]
  },
  {
    id: 'accueil_role_problem',
    phase: 'accueil',
    speaker: 'auditor',
    speakerName: 'Marie Durand',
    text: "*Elle fronce les sourcils et note longuement* C'est un premier point d'attention. L'article 4 du règlement insiste sur la nécessité d'une gouvernance claire avec des responsabilités définies. Je note : 'Absence de point de contact unique identifié'.",
    mood: 'concerned',
    effect: { evidence: -5 },
    aiActReference: 'Article 4 - Maîtrise de l\'IA',
    autoNext: 'accueil_perimeter',
    delay: 4000
  },
  {
    id: 'accueil_perimeter',
    phase: 'accueil',
    speaker: 'auditor',
    speakerName: 'Marie Durand',
    text: "Parlons maintenant de votre périmètre IA. Combien de systèmes d'intelligence artificielle utilisez-vous dans votre organisation, et disposez-vous d'un registre ?",
    mood: 'neutral',
    tip: "Le registre IA est la pierre angulaire de la conformité. Sans lui, impossible de prouver votre maîtrise.",
    choices: [
      { id: 'a', text: "Nous avons identifié et documenté 14 systèmes d'IA répartis dans 5 départements. Voici notre registre complet avec pour chaque système : nom, fournisseur, usage, classification de risque, et date de dernière revue.", shortText: "Registre complet et structuré", requiresDocument: 'registre_ia', effect: { trust: 20, evidence: 20 }, nextNode: 'accueil_registry_review', isOptimal: true },
      { id: 'b', text: "On utilise une dizaine de systèmes IA environ. J'ai commencé un inventaire mais il n'est pas finalisé.", shortText: "Registre incomplet", effect: { trust: -10, evidence: -10 }, nextNode: 'accueil_registry_incomplete' },
      { id: 'c', text: "C'est difficile à dire précisément. Chaque département utilise ses propres outils...", shortText: "Pas de visibilité", effect: { trust: -25, evidence: -25, stress: 15 }, nextNode: 'accueil_registry_missing', isCriticalMistake: true }
    ]
  },
  {
    id: 'accueil_registry_review',
    phase: 'accueil',
    speaker: 'auditor',
    speakerName: 'Marie Durand',
    text: "*Elle parcourt le registre attentivement pendant une minute* Je vois 3 systèmes classés 'haut risque' : recrutement IA, scoring crédit client, et vidéosurveillance intelligente. Pouvez-vous me détailler les critères qui ont conduit à ces classifications ?",
    mood: 'neutral',
    effect: { trust: 5 },
    autoNext: 'doc_classification',
    delay: 4000
  },
  {
    id: 'accueil_registry_incomplete',
    phase: 'accueil',
    speaker: 'auditor',
    speakerName: 'Marie Durand',
    text: "*Elle soupire* Un registre incomplet est un problème majeur. Comment pouvez-vous garantir la conformité de systèmes que vous n'avez pas identifiés ? Je vais noter cela comme observation critique.",
    mood: 'impatient',
    effect: { evidence: -10 },
    autoNext: 'doc_classification',
    delay: 3000
  },
  {
    id: 'accueil_registry_missing',
    phase: 'accueil',
    speaker: 'auditor',
    speakerName: 'Marie Durand',
    text: "*Elle pose son stylo et vous regarde fixement* L'absence de cartographie est une non-conformité majeure au titre de l'article 29. C'est la base de toute démarche de conformité. Sans inventaire, cet audit ne peut pas se poursuivre correctement. Je vais le mentionner dans mon rapport préliminaire.",
    mood: 'angry',
    effect: { trust: -15, evidence: -15 },
    aiActReference: 'Article 29 - Obligations des déployeurs',
    autoNext: 'doc_classification',
    delay: 5000
  },

  // ========== PHASE: DOCUMENTATION ==========
  {
    id: 'doc_classification',
    phase: 'documentation',
    speaker: 'system',
    text: "📁 PHASE DE REVUE DOCUMENTAIRE - L'auditrice va examiner en détail vos dossiers de conformité.",
    isCheckpoint: true,
    autoNext: 'doc_classification_q',
    delay: 2000
  },
  {
    id: 'doc_classification_q',
    phase: 'documentation',
    speaker: 'auditor',
    speakerName: 'Marie Durand',
    text: "Concentrons-nous sur vos systèmes à haut risque. Pour votre système de recrutement IA, pouvez-vous me montrer l'analyse qui a conduit à la classification 'haut risque' ?",
    mood: 'neutral',
    aiActReference: 'Article 6 & Annexe III',
    choices: [
      { id: 'a', text: "Le système de recrutement tombe sous l'annexe III, point 4a : 'IA utilisée pour le recrutement ou la sélection de personnes physiques, notamment pour la publication d'offres, le tri des candidatures ou l'évaluation'. Voici notre matrice d'analyse détaillée.", shortText: "Analyse juridique précise + matrice", requiresDocument: 'classification_matrix', effect: { trust: 20, evidence: 20 }, nextNode: 'doc_high_risk_deep', isOptimal: true },
      { id: 'b', text: "C'est du recrutement, donc c'est forcément haut risque selon le règlement.", shortText: "Réponse approximative", effect: { trust: -5, evidence: -5 }, nextNode: 'doc_classification_weak' },
      { id: 'c', text: "Honnêtement, on a suivi les recommandations d'un consultant externe.", shortText: "Externalisation de l'analyse", effect: { trust: -10, evidence: -10 }, nextNode: 'doc_classification_external' }
    ]
  },
  {
    id: 'doc_high_risk_deep',
    phase: 'documentation',
    speaker: 'auditor',
    speakerName: 'Marie Durand',
    text: "Excellente maîtrise du texte. *Elle examine la matrice* Je vois que vous avez aussi analysé le scoring crédit sous l'angle de l'annexe III, point 5b. Maintenant, passons aux obligations spécifiques. Pour ces systèmes haut risque, avez-vous réalisé une analyse d'impact sur les droits fondamentaux ?",
    mood: 'pleased',
    effect: { trust: 5 },
    aiActReference: 'Article 27 - Analyse d\'impact',
    autoNext: 'doc_aipd_question',
    delay: 4000
  },
  {
    id: 'doc_classification_weak',
    phase: 'documentation',
    speaker: 'auditor',
    speakerName: 'Marie Durand',
    text: "\"Forcément haut risque\" n'est pas une analyse juridique. Avez-vous vérifié si votre usage spécifique correspond bien aux critères de l'annexe III ? Certains systèmes RH ne sont PAS haut risque selon l'usage exact.",
    mood: 'concerned',
    effect: { evidence: -5 },
    autoNext: 'doc_aipd_question',
    delay: 3000
  },
  {
    id: 'doc_classification_external',
    phase: 'documentation',
    speaker: 'auditor',
    speakerName: 'Marie Durand',
    text: "Un consultant peut vous accompagner, mais la responsabilité de la classification vous incombe. Avez-vous validé et compris son analyse ? Où est le livrable ?",
    mood: 'impatient',
    effect: { trust: -5 },
    autoNext: 'doc_aipd_question',
    delay: 3000
  },
  {
    id: 'doc_aipd_question',
    phase: 'documentation',
    speaker: 'auditor',
    speakerName: 'Marie Durand',
    text: "L'article 27 impose aux déployeurs de systèmes à haut risque de réaliser une analyse d'impact sur les droits fondamentaux. Avez-vous mené cette analyse pour votre système de recrutement ?",
    mood: 'serious',
    tip: "L'AIPD AI Act est différente de l'AIPD RGPD : elle couvre spécifiquement les risques de biais, discrimination, et atteinte aux droits fondamentaux.",
    choices: [
      { id: 'a', text: "Oui. Notre AIPD couvre : les risques de discrimination (genre, âge, origine), l'impact sur le droit au travail, les mesures de mitigation, et le processus de supervision humaine. Voici le document complet.", shortText: "AIPD complète", requiresDocument: 'aipd_rh', effect: { trust: 25, evidence: 25 }, nextNode: 'doc_aipd_review', isOptimal: true },
      { id: 'b', text: "On a fait une analyse d'impact RGPD qui couvre les aspects IA aussi.", shortText: "Seulement AIPD RGPD", effect: { trust: -10, evidence: -15 }, nextNode: 'doc_aipd_rgpd' },
      { id: 'c', text: "L'analyse est en cours mais pas finalisée...", shortText: "AIPD non finalisée", effect: { trust: -15, evidence: -20 }, nextNode: 'doc_aipd_missing' },
      { id: 'd', text: "Le fournisseur nous a certifié que le système était équitable.", shortText: "Confiance au fournisseur", effect: { trust: -20, evidence: -20, stress: 10 }, nextNode: 'doc_aipd_vendor', isRisky: true }
    ]
  },
  {
    id: 'doc_aipd_review',
    phase: 'documentation',
    speaker: 'auditor',
    speakerName: 'Marie Durand',
    text: "*Elle lit attentivement plusieurs pages* C'est un travail sérieux. Je vois que vous avez identifié un risque de biais défavorable aux candidats de plus de 50 ans et mis en place une pondération corrective. Très bien. Avez-vous testé l'efficacité de cette correction ?",
    mood: 'pleased',
    effect: { trust: 10 },
    autoNext: 'doc_bias_testing',
    delay: 4000
  },
  {
    id: 'doc_aipd_rgpd',
    phase: 'documentation',
    speaker: 'auditor',
    speakerName: 'Marie Durand',
    text: "L'AIPD RGPD est nécessaire mais insuffisante. L'AI Act exige une analyse spécifique des risques algorithmiques : biais, discrimination, explicabilité. Ce sont des dimensions que le RGPD ne couvre pas. Je note cette lacune.",
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
    text: "Depuis combien de temps ce système est-il en production ?... *Vous répondez 18 mois*... 18 mois sans AIPD pour un système haut risque. C'est une non-conformité caractérisée. Je dois le mentionner dans mon rapport.",
    mood: 'serious',
    effect: { trust: -10, evidence: -15 },
    autoNext: 'doc_bias_testing',
    delay: 4000
  },
  {
    id: 'doc_aipd_vendor',
    phase: 'documentation',
    speaker: 'auditor',
    speakerName: 'Marie Durand',
    text: "*Elle secoue la tête* En tant que déployeur, VOUS êtes responsable de vérifier la conformité. La certification d'un fournisseur ne vous exonère pas. L'article 29 est clair : le déployeur doit s'assurer de l'utilisation conforme. C'est VOTRE responsabilité, pas celle du fournisseur.",
    mood: 'angry',
    effect: { trust: -15, evidence: -10 },
    aiActReference: 'Article 29 - Responsabilité du déployeur',
    autoNext: 'doc_bias_testing',
    delay: 5000
  },
  {
    id: 'doc_bias_testing',
    phase: 'documentation',
    speaker: 'auditor',
    speakerName: 'Marie Durand',
    text: "Parlons des tests de biais. L'article 10 exige que les données utilisées soient pertinentes, représentatives, et exemptes d'erreurs. Comment vérifiez-vous l'absence de biais discriminatoires dans votre système de recrutement ?",
    mood: 'neutral',
    aiActReference: 'Article 10 - Données et gouvernance des données',
    choices: [
      { id: 'a', text: "Nous réalisons des audits trimestriels d'équité. Voici le dernier rapport : nous testons le taux de sélection par genre, âge, et origine géographique. Nous avons détecté un biais de 8% et appliqué une correction. Les métriques post-correction sont dans l'annexe.", shortText: "Audits réguliers + métriques", requiresDocument: 'tests_biais', effect: { trust: 25, evidence: 20 }, nextNode: 'doc_transparency', isOptimal: true },
      { id: 'b', text: "Le fournisseur fait des tests de son côté et nous envoie un rapport annuel.", shortText: "Tests externalisés", effect: { trust: -5, evidence: -5 }, nextNode: 'doc_bias_external' },
      { id: 'c', text: "On surveille les plaintes des candidats. On n'en a pas eu.", shortText: "Pas de tests proactifs", effect: { trust: -15, evidence: -15 }, nextNode: 'doc_bias_reactive' }
    ]
  },
  {
    id: 'doc_bias_external',
    phase: 'documentation',
    speaker: 'auditor',
    speakerName: 'Marie Durand',
    text: "Un rapport annuel du fournisseur est un minimum, mais insuffisant. Vous devez avoir la capacité de tester vous-même. Que se passe-t-il si un candidat porte plainte pour discrimination ? Vous n'aurez pas les données pour vous défendre.",
    mood: 'concerned',
    effect: { evidence: -5 },
    autoNext: 'doc_transparency',
    delay: 3000
  },
  {
    id: 'doc_bias_reactive',
    phase: 'documentation',
    speaker: 'auditor',
    speakerName: 'Marie Durand',
    text: "Attendre les plaintes est une approche réactive et risquée. Un système peut discriminer pendant des mois avant qu'une plainte n'émerge. La conformité exige une démarche proactive de détection.",
    mood: 'impatient',
    effect: { evidence: -10 },
    autoNext: 'doc_transparency',
    delay: 3000
  },
  {
    id: 'doc_transparency',
    phase: 'documentation',
    speaker: 'auditor',
    speakerName: 'Marie Durand',
    text: "Passons à la transparence. L'article 50 impose d'informer les utilisateurs qu'ils interagissent avec un système d'IA. Pour votre système de recrutement, les candidats savent-ils qu'une IA analyse leur CV ?",
    mood: 'neutral',
    aiActReference: 'Article 50 - Obligations de transparence',
    choices: [
      { id: 'a', text: "Oui, à plusieurs niveaux : mention dans l'offre d'emploi, information dans le formulaire de candidature avec case de consentement explicite, et email de confirmation détaillant le processus. Voici les captures d'écran de notre parcours candidat.", shortText: "Transparence multi-niveaux", requiresDocument: 'mentions_legales', effect: { trust: 20, evidence: 15 }, nextNode: 'doc_transparency_good', isOptimal: true },
      { id: 'b', text: "C'est mentionné dans nos CGU que les candidats acceptent.", shortText: "Seulement dans les CGU", effect: { trust: -15, evidence: -10 }, nextNode: 'doc_transparency_cgu' },
      { id: 'c', text: "Notre chatbot d'assistance s'appelle 'Luna'... C'est peut-être pas assez clair que c'est une IA.", shortText: "Transparence insuffisante", effect: { trust: -25, evidence: -20, stress: 10 }, nextNode: 'doc_transparency_violation', isCriticalMistake: true }
    ]
  },
  {
    id: 'doc_transparency_good',
    phase: 'documentation',
    speaker: 'auditor',
    speakerName: 'Marie Durand',
    text: "*Elle parcourt les captures* C'est exemplaire. Information claire, visible, et au bon moment. Le consentement explicite est un plus, même s'il n'est pas toujours requis. Je note cette bonne pratique.",
    mood: 'pleased',
    effect: { trust: 5, evidence: 5 },
    autoNext: 'entretiens_start',
    delay: 3000
  },
  {
    id: 'doc_transparency_cgu',
    phase: 'documentation',
    speaker: 'auditor',
    speakerName: 'Marie Durand',
    text: "Enterrer l'information dans des CGU que personne ne lit n'est pas conforme à l'esprit du règlement. L'article 50 exige une information 'claire et compréhensible', fournie 'au plus tard au moment du premier contact'. Les CGU ne remplissent pas ce critère.",
    mood: 'concerned',
    effect: { evidence: -10 },
    aiActReference: 'Article 50 - modalités d\'information',
    autoNext: 'entretiens_start',
    delay: 4000
  },
  {
    id: 'doc_transparency_violation',
    phase: 'documentation',
    speaker: 'auditor',
    speakerName: 'Marie Durand',
    text: "*Elle note longuement* Un chatbot avec un prénom humain qui ne s'identifie pas comme IA ? C'est une violation directe de l'article 50. Vous faites croire aux candidats qu'ils parlent à un humain. C'est non seulement non conforme, mais potentiellement trompeur.",
    mood: 'angry',
    effect: { trust: -20, evidence: -20 },
    aiActReference: 'Article 50 - Interdiction de tromper',
    autoNext: 'entretiens_start',
    delay: 5000
  },

  // ========== PHASE: ENTRETIENS ==========
  {
    id: 'entretiens_start',
    phase: 'entretiens',
    speaker: 'system',
    text: "💬 PHASE D'ENTRETIENS APPROFONDIS - L'auditrice va tester vos processus en situation réelle.",
    isCheckpoint: true,
    autoNext: 'entretiens_supervision',
    delay: 2000
  },
  {
    id: 'entretiens_supervision',
    phase: 'entretiens',
    speaker: 'auditor',
    speakerName: 'Marie Durand',
    text: "L'article 14 est fondamental : la supervision humaine. Pour vos systèmes haut risque, comment garantissez-vous qu'un humain reste dans la boucle de décision ?",
    mood: 'serious',
    aiActReference: 'Article 14 - Supervision humaine',
    tip: "La supervision humaine signifie : comprendre le système, surveiller son fonctionnement, pouvoir intervenir, pouvoir ignorer/annuler ses recommandations.",
    choices: [
      { id: 'a', text: "Pour le recrutement : l'IA propose un score et un classement, mais JAMAIS de décision automatique. Un recruteur humain formé examine chaque dossier et prend la décision finale. Nous gardons la trace de chaque validation humaine dans nos logs.", shortText: "IA propose, humain dispose + traçabilité", requiresDocument: 'procedures_supervision', effect: { trust: 25, evidence: 20 }, nextNode: 'entretiens_demo_request', isOptimal: true },
      { id: 'b', text: "Les managers peuvent annuler les décisions de l'IA s'ils ne sont pas d'accord.", shortText: "Override possible", effect: { trust: 0, evidence: 0 }, nextNode: 'entretiens_supervision_clarify' },
      { id: 'c', text: "Pour les candidatures clairement non qualifiées, le système rejette automatiquement. Ça fait gagner du temps.", shortText: "Rejet automatique", effect: { trust: -30, evidence: -25, stress: 15 }, nextNode: 'entretiens_supervision_violation', isCriticalMistake: true }
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
      { id: 'a', text: "L'humain. Une candidature non validée explicitement par le recruteur n'avance pas.", effect: { trust: 10, evidence: 10 }, nextNode: 'entretiens_demo_request' },
      { id: 'b', text: "En pratique... les recruteurs suivent généralement les recommandations de l'IA...", effect: { trust: -15, evidence: -15 }, nextNode: 'entretiens_supervision_concern' }
    ]
  },
  {
    id: 'entretiens_supervision_violation',
    phase: 'entretiens',
    speaker: 'auditor',
    speakerName: 'Marie Durand',
    text: "*Elle interrompt ses notes et vous regarde fixement* Un rejet automatique sans intervention humaine pour un système de recrutement à haut risque ? C'est exactement ce que l'AI Act interdit. Article 14 : les systèmes à haut risque doivent être conçus pour être supervisés par des personnes physiques. Un rejet automatique n'est PAS de la supervision.",
    mood: 'angry',
    effect: { trust: -20, evidence: -15 },
    aiActReference: 'Article 14.3 - Mesures de supervision',
    autoNext: 'entretiens_demo_request',
    delay: 5000
  },
  {
    id: 'entretiens_supervision_concern',
    phase: 'entretiens',
    speaker: 'auditor',
    speakerName: 'Marie Durand',
    text: "C'est ce qu'on appelle 'automation bias' - la tendance à faire aveuglément confiance à la machine. La supervision humaine doit être effective, pas une simple formalité. Vos recruteurs sont-ils formés à challenger les recommandations de l'IA ?",
    mood: 'concerned',
    effect: { evidence: -10 },
    autoNext: 'entretiens_demo_request',
    delay: 4000
  },
  {
    id: 'entretiens_demo_request',
    phase: 'entretiens',
    speaker: 'auditor',
    speakerName: 'Marie Durand',
    text: "Je souhaite voir le système de recrutement en fonctionnement. Pouvez-vous me faire une démonstration live ?",
    mood: 'neutral',
    choices: [
      { id: 'a', text: "Bien sûr. *Vous ouvrez l'interface* Voici le tableau de bord d'un recruteur. Je vais vous montrer le parcours complet d'analyse d'une candidature, avec les explications du score et les options de supervision.", shortText: "Démo complète avec explications", effect: { trust: 15, evidence: 10 }, nextNode: 'entretiens_demo_live', isOptimal: true },
      { id: 'b', text: "Je n'ai pas les accès en production, mais je peux vous montrer notre environnement de test.", shortText: "Seulement environnement de test", effect: { trust: -10, evidence: -5 }, nextNode: 'entretiens_demo_test' },
      { id: 'c', text: "C'est compliqué... Le système est géré par notre fournisseur en SaaS.", shortText: "Pas d'accès", effect: { trust: -20, evidence: -15, stress: 10 }, nextNode: 'entretiens_demo_refused', isRisky: true }
    ]
  },
  {
    id: 'entretiens_demo_live',
    phase: 'entretiens',
    speaker: 'system',
    text: "Vous lancez la démonstration. L'auditrice observe attentivement chaque écran...",
    autoNext: 'entretiens_demo_question1',
    delay: 2000,
    triggerEvent: 'bias_live' // Possible random event
  },
  {
    id: 'entretiens_demo_test',
    phase: 'entretiens',
    speaker: 'auditor',
    speakerName: 'Marie Durand',
    text: "Un environnement de test peut différer de la production. Mais montrez-moi quand même. Qui a accès à la vraie production ?",
    mood: 'concerned',
    effect: { trust: -5 },
    autoNext: 'entretiens_demo_question1',
    delay: 3000
  },
  {
    id: 'entretiens_demo_refused',
    phase: 'entretiens',
    speaker: 'auditor',
    speakerName: 'Marie Durand',
    text: "Vous déployez un système que vous ne pouvez pas démontrer ? L'article 29 impose au déployeur de comprendre le fonctionnement et de pouvoir l'expliquer. Comment formez-vous vos utilisateurs si vous n'avez pas accès vous-même ?",
    mood: 'angry',
    effect: { trust: -15, evidence: -10 },
    autoNext: 'entretiens_demo_question1',
    delay: 4000
  },
  {
    id: 'entretiens_demo_question1',
    phase: 'entretiens',
    speaker: 'auditor',
    speakerName: 'Marie Durand',
    text: "Je vois que le système attribue un 'score d'adéquation' aux candidats. Pouvez-vous m'expliquer comment ce score est calculé ? Quels critères, quelles pondérations ?",
    mood: 'neutral',
    choices: [
      { id: 'a', text: "Le score combine : correspondance des compétences (40%), expérience pertinente (30%), formation (20%), et signaux comportementaux du CV (10%). Voici la documentation technique détaillant chaque critère.", shortText: "Explication détaillée + documentation", requiresDocument: 'doc_technique_rh', effect: { trust: 20, evidence: 15 }, nextNode: 'entretiens_demo_sensitive', isOptimal: true },
      { id: 'b', text: "C'est un algorithme propriétaire du fournisseur. On n'a pas tous les détails.", shortText: "Algorithme opaque", effect: { trust: -15, evidence: -15 }, nextNode: 'entretiens_explainability_issue' },
      { id: 'c', text: "Je ne suis pas data scientist, je ne peux pas vous expliquer les détails techniques.", shortText: "Manque de compréhension", effect: { trust: -20, evidence: -10, stress: 10 }, nextNode: 'entretiens_competence_issue' }
    ]
  },
  {
    id: 'entretiens_explainability_issue',
    phase: 'entretiens',
    speaker: 'auditor',
    speakerName: 'Marie Durand',
    text: "Un algorithme 'boîte noire' pose un problème d'explicabilité. Si un candidat conteste son rejet, comment lui expliquez-vous la décision ? L'article 13 exige que les systèmes soient conçus pour permettre l'interprétation de leurs résultats.",
    mood: 'concerned',
    aiActReference: 'Article 13 - Transparence',
    effect: { evidence: -10 },
    autoNext: 'entretiens_demo_sensitive',
    delay: 4000
  },
  {
    id: 'entretiens_competence_issue',
    phase: 'entretiens',
    speaker: 'auditor',
    speakerName: 'Marie Durand',
    text: "En tant que responsable conformité, vous devez comprendre le fonctionnement des systèmes que vous supervisez. Sinon, comment pouvez-vous évaluer les risques ? Qui dans votre organisation a cette compétence ?",
    mood: 'impatient',
    effect: { trust: -10 },
    autoNext: 'entretiens_demo_sensitive',
    delay: 3000
  },
  {
    id: 'entretiens_demo_sensitive',
    phase: 'entretiens',
    speaker: 'auditor',
    speakerName: 'Marie Durand',
    text: "Question cruciale : le système a-t-il accès à des données sensibles comme le genre, l'âge, ou la photo des candidats ?",
    mood: 'serious',
    choices: [
      { id: 'a', text: "Non. Nous avons volontairement exclu ces données. Le système n'a pas accès aux photos, aux noms, aux adresses, ni aux dates de naissance. C'est un choix de design pour minimiser les risques de discrimination.", shortText: "Données sensibles exclues by design", effect: { trust: 25, evidence: 20 }, nextNode: 'entretiens_incident_question', isOptimal: true },
      { id: 'b', text: "Il a accès au CV complet, donc potentiellement au prénom et à des indices d'âge.", shortText: "Accès partiel aux données sensibles", effect: { trust: -5, evidence: -5 }, nextNode: 'entretiens_sensitive_risk' },
      { id: 'c', text: "Oui, mais on fait confiance à l'algorithme pour ne pas en tenir compte.", shortText: "Accès complet, confiance à l'algorithme", effect: { trust: -25, evidence: -20, stress: 15 }, nextNode: 'entretiens_sensitive_problem', isRisky: true }
    ]
  },
  {
    id: 'entretiens_sensitive_risk',
    phase: 'entretiens',
    speaker: 'auditor',
    speakerName: 'Marie Durand',
    text: "Le prénom peut révéler le genre et parfois l'origine. Avez-vous testé si le modèle utilise ces signaux ? Un audit de biais sur ces dimensions est indispensable.",
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
    text: "*Elle prend une longue note* \"Faire confiance à l'algorithme\" n'est pas une mesure de conformité. Les algorithmes de machine learning APPRENNENT des patterns dans les données, y compris des biais historiques. Sans protection by design, vous prenez un risque majeur de discrimination indirecte.",
    mood: 'angry',
    effect: { trust: -15, evidence: -15 },
    autoNext: 'entretiens_incident_question',
    delay: 5000
  },
  {
    id: 'entretiens_incident_question',
    phase: 'entretiens',
    speaker: 'auditor',
    speakerName: 'Marie Durand',
    text: "Dernière section importante : la gestion des incidents. L'article 62 impose des obligations de notification en cas de dysfonctionnement grave. Avez-vous une procédure d'incident pour vos systèmes IA ?",
    mood: 'neutral',
    aiActReference: 'Article 62 - Notification des incidents',
    choices: [
      { id: 'a', text: "Oui. Notre procédure couvre : détection automatisée ou manuelle, arrêt du système si nécessaire, notification aux personnes affectées sous 72h, signalement à l'autorité si impact significatif, et analyse post-incident. Nous faisons un exercice annuel pour tester la procédure.", shortText: "Procédure complète + exercices", requiresDocument: 'procedure_incident', effect: { trust: 20, evidence: 20 }, nextNode: 'entretiens_incident_history', isOptimal: true },
      { id: 'b', text: "On arrêterait le système et on appellerait le fournisseur.", shortText: "Procédure informelle", effect: { trust: -5, evidence: -10 }, nextNode: 'entretiens_incident_weak' },
      { id: 'c', text: "On n'a jamais eu d'incident, donc on n'a pas formalisé de procédure.", shortText: "Pas de procédure", effect: { trust: -15, evidence: -15 }, nextNode: 'entretiens_incident_missing' }
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
      { id: 'a', text: "Notre registre recense 3 incidents mineurs sur 18 mois : un faux positif de fraude, un bug d'affichage, et une latence anormale. Aucun n'a nécessité de notification externe. Voici les analyses post-incident.", shortText: "Registre transparent avec incidents", requiresDocument: 'registre_incidents', effect: { trust: 15, evidence: 10 }, nextNode: 'cloture_start', isOptimal: true },
      { id: 'b', text: "Le registre est vide. On n'a vraiment pas eu d'incident.", shortText: "Registre vide", effect: { trust: -5, evidence: -5 }, nextNode: 'entretiens_incident_empty' }
    ]
  },
  {
    id: 'entretiens_incident_weak',
    phase: 'entretiens',
    speaker: 'auditor',
    speakerName: 'Marie Durand',
    text: "Appeler le fournisseur est une réaction, pas une procédure. Qui notifie les personnes affectées ? Qui décide de signaler à l'autorité ? Quel est le délai ? Vous devez formaliser tout cela.",
    mood: 'concerned',
    effect: { evidence: -5 },
    autoNext: 'cloture_start',
    delay: 3000
  },
  {
    id: 'entretiens_incident_missing',
    phase: 'entretiens',
    speaker: 'auditor',
    speakerName: 'Marie Durand',
    text: "'Jamais d'incident' n'est pas une excuse pour ne pas avoir de procédure. C'est comme dire qu'on n'a pas besoin d'extincteur parce qu'il n'y a jamais eu d'incendie. L'absence de préparation est un risque en soi.",
    mood: 'impatient',
    effect: { evidence: -10 },
    autoNext: 'cloture_start',
    delay: 4000
  },
  {
    id: 'entretiens_incident_empty',
    phase: 'entretiens',
    speaker: 'auditor',
    speakerName: 'Marie Durand',
    text: "18 mois d'exploitation sans aucun incident ? C'est soit remarquable, soit... un signe que les incidents ne sont pas détectés ou pas reportés. Avez-vous des mécanismes de détection d'anomalies ?",
    mood: 'concerned',
    autoNext: 'cloture_start',
    delay: 3000
  },

  // ========== PHASE: CLOTURE ==========
  {
    id: 'cloture_start',
    phase: 'cloture',
    speaker: 'system',
    text: "⚖️ PHASE DE CLÔTURE - L'auditrice va rendre ses conclusions préliminaires.",
    isCheckpoint: true,
    autoNext: 'cloture_self_assessment',
    delay: 2000
  },
  {
    id: 'cloture_self_assessment',
    phase: 'cloture',
    speaker: 'auditor',
    speakerName: 'Marie Durand',
    text: "Nous arrivons à la fin de l'audit. Avant de vous donner mes conclusions, j'aimerais connaître votre auto-évaluation. Quels sont, selon vous, vos principaux points d'amélioration ?",
    mood: 'neutral',
    choices: [
      { id: 'a', text: "Notre auto-évaluation identifie trois axes prioritaires : 1) Finaliser les AIPD manquantes d'ici 60 jours, 2) Renforcer la formation des équipes métier, 3) Améliorer la traçabilité des décisions. Voici notre plan d'action chiffré.", shortText: "Lucidité complète + plan d'action", effect: { trust: 20, evidence: 15 }, nextNode: 'cloture_final_question', isOptimal: true },
      { id: 'b', text: "On sait qu'on doit améliorer la documentation. C'est en cours.", shortText: "Conscience partielle", effect: { trust: 5, evidence: 5 }, nextNode: 'cloture_partial_awareness' },
      { id: 'c', text: "Je pense qu'on est plutôt bien. On attend vos retours.", shortText: "Pas de recul critique", effect: { trust: -15, evidence: -10 }, nextNode: 'cloture_no_awareness' }
    ]
  },
  {
    id: 'cloture_partial_awareness',
    phase: 'cloture',
    speaker: 'auditor',
    speakerName: 'Marie Durand',
    text: "La documentation est effectivement un point. Mais avez-vous identifié les lacunes spécifiques ? Un plan sans actions datées reste un vœu pieux.",
    mood: 'neutral',
    autoNext: 'cloture_final_question',
    delay: 3000
  },
  {
    id: 'cloture_no_awareness',
    phase: 'cloture',
    speaker: 'auditor',
    speakerName: 'Marie Durand',
    text: "*Elle hausse un sourcil* L'auto-évaluation est une compétence clé en conformité. Attendre qu'un auditeur vous dise quoi améliorer n'est pas une stratégie de conformité durable.",
    mood: 'impatient',
    effect: { trust: -5 },
    autoNext: 'cloture_final_question',
    delay: 3000
  },
  {
    id: 'cloture_final_question',
    phase: 'cloture',
    speaker: 'auditor',
    speakerName: 'Marie Durand',
    text: "Dernière question : comment comptez-vous maintenir votre conformité dans le temps ? Le règlement évolue, vos systèmes aussi.",
    mood: 'neutral',
    choices: [
      { id: 'a', text: "Nous avons mis en place : une veille réglementaire via des alertes et un cabinet spécialisé, des revues trimestrielles de notre registre, un budget formation sanctuarisé, et des audits internes annuels. Notre prochaine revue est planifiée dans 6 semaines.", shortText: "Organisation pérenne", effect: { trust: 15, evidence: 10 }, nextNode: 'cloture_verdict', isOptimal: true },
      { id: 'b', text: "On suit les newsletters et on réagira si nécessaire.", shortText: "Veille passive", effect: { trust: -5 }, nextNode: 'cloture_verdict' },
      { id: 'c', text: "Le règlement est encore jeune, on verra comment ça évolue.", shortText: "Attentisme", effect: { trust: -15, evidence: -5 }, nextNode: 'cloture_attentisme' }
    ]
  },
  {
    id: 'cloture_attentisme',
    phase: 'cloture',
    speaker: 'auditor',
    speakerName: 'Marie Durand',
    text: "Le règlement est entré en vigueur. Attendre n'est plus une option. Les premières sanctions tomberont dans les mois qui viennent pour les organisations qui n'auront pas anticipé.",
    mood: 'serious',
    autoNext: 'cloture_verdict',
    delay: 3000
  },
  {
    id: 'cloture_verdict',
    phase: 'cloture',
    speaker: 'auditor',
    speakerName: 'Marie Durand',
    text: "Merci pour votre disponibilité et votre coopération. Je vais maintenant rédiger mon rapport d'audit. Vous le recevrez sous 15 jours ouvrés avec le détail de mes observations et, le cas échéant, les actions correctives à mettre en œuvre.",
    mood: 'neutral',
    autoNext: 'verdict_transition',
    delay: 4000
  },
  {
    id: 'verdict_transition',
    phase: 'cloture',
    speaker: 'system',
    text: "L'auditrice rassemble ses documents et se lève pour vous serrer la main. L'audit est terminé. Attendons le verdict...",
    autoNext: 'final_verdict',
    delay: 3000
  },
  {
    id: 'final_verdict',
    phase: 'cloture',
    speaker: 'system',
    text: "📊 CALCUL DU VERDICT EN COURS...",
    delay: 2000
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
  ChevronRight: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><polyline points="9 18 15 12 9 6"/></svg>,
  Download: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
  Trophy: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>,
  Lightbulb: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>,
  Users: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  Folder: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>,
  Star: () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  Play: () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full"><polygon points="5 3 19 12 5 21 5 3"/></svg>,
};

// ============================================
// MAIN COMPONENT
// ============================================
interface Props {
  moduleColor?: string;
  onComplete?: (score: number) => void;
}

export default function AuditSimulationEpic({ moduleColor = '#F97316', onComplete }: Props) {
  // === GAME STATE ===
  const [gamePhase, setGamePhase] = useState<'intro' | 'prep' | 'audit' | 'verdict'>('intro');
  const [currentNodeId, setCurrentNodeId] = useState<string>('notif_start');
  const [currentPhaseIdx, setCurrentPhaseIdx] = useState(0);
  
  // === PLAYER STATS ===
  const [stats, setStats] = useState<GameStats>({
    trust: 50,
    stress: 20,
    evidence: 30,
    time: 2700, // 45 minutes
    reputation: 50,
    documentsPresented: [],
    criticalMistakes: 0,
    perfectAnswers: 0
  });
  
  // === DOCUMENTS ===
  const [documents, setDocuments] = useState<Document[]>(INITIAL_DOCUMENTS);
  const [selectedDocs, setSelectedDocs] = useState<string[]>([]);
  const [showDocPanel, setShowDocPanel] = useState(false);
  
  // === DIALOGUE ===
  const [dialogHistory, setDialogHistory] = useState<Array<{
    speaker: string;
    speakerName?: string;
    text: string;
    mood?: string;
    isPlayer?: boolean;
  }>>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [showChoices, setShowChoices] = useState(false);
  const [currentChoices, setCurrentChoices] = useState<DialogChoice[]>([]);
  
  // === EVENTS ===
  const [showEvent, setShowEvent] = useState<RandomEvent | null>(null);
  const [eventOutcome, setEventOutcome] = useState<string | null>(null);
  const [usedEvents, setUsedEvents] = useState<string[]>([]);
  
  // === UI ===
  const [showTip, setShowTip] = useState(false);
  const [currentTip, setCurrentTip] = useState<string>('');
  const [showFeedback, setShowFeedback] = useState<string | null>(null);
  const [prepTime, setPrepTime] = useState(300);
  
  const chatRef = useRef<HTMLDivElement>(null);
  const currentNode = DIALOGUE_SCENARIO.find(n => n.id === currentNodeId);
  const currentPhase = AUDIT_PHASES[currentPhaseIdx];

  // === TIMER ===
  useEffect(() => {
    if (gamePhase === 'prep' && prepTime > 0) {
      const timer = setInterval(() => setPrepTime(t => t - 1), 1000);
      return () => clearInterval(timer);
    }
    if (gamePhase === 'prep' && prepTime === 0) {
      startAudit();
    }
  }, [gamePhase, prepTime]);

  useEffect(() => {
    if (gamePhase === 'audit' && stats.time > 0 && !showEvent) {
      const timer = setInterval(() => {
        setStats(s => ({ ...s, time: Math.max(0, s.time - 1) }));
        
        // Trigger random events periodically
        if (Math.random() < 0.002 && usedEvents.length < 5) {
          triggerRandomEvent();
        }
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [gamePhase, stats.time, showEvent, usedEvents]);

  // === SCROLL TO BOTTOM ===
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [dialogHistory, isTyping]);

  // === PROCESS DIALOGUE NODE ===
  const processNode = useCallback((nodeId: string) => {
    const node = DIALOGUE_SCENARIO.find(n => n.id === nodeId);
    if (!node) return;

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
        time: Math.max(0, s.time + (node.effect?.time || 0))
      }));
    }

    // Set tip
    if (node.tip) {
      setCurrentTip(node.tip);
    }

    // Show typing indicator for auditor
    if (node.speaker === 'auditor' || node.speaker === 'dg' || node.speaker === 'dsi' || node.speaker === 'drh' || node.speaker === 'rh' || node.speaker === 'colleague' || node.speaker === 'legal') {
      setIsTyping(true);
      setShowChoices(false);
      
      const typingDuration = 1500 + Math.min(node.text.length * 15, 3000);
      
      setTimeout(() => {
        setIsTyping(false);
        setDialogHistory(h => [...h, {
          speaker: node.speaker,
          speakerName: node.speakerName,
          text: node.text,
          mood: node.mood
        }]);
        
        // Show choices or auto-advance
        if (node.choices && node.choices.length > 0) {
          setTimeout(() => {
            setCurrentChoices(node.choices!);
            setShowChoices(true);
          }, 500);
        } else if (node.autoNext) {
          setTimeout(() => {
            processNode(node.autoNext!);
          }, node.delay || 2000);
        } else if (node.id === 'final_verdict') {
          setGamePhase('verdict');
        }
      }, typingDuration);
    } else if (node.speaker === 'system') {
      setDialogHistory(h => [...h, {
        speaker: 'system',
        text: node.text
      }]);
      
      if (node.autoNext) {
        setTimeout(() => {
          processNode(node.autoNext!);
        }, node.delay || 2000);
      }
    }

    setCurrentNodeId(nodeId);
  }, [currentPhaseIdx]);

  // === START FUNCTIONS ===
  const startPreparation = () => {
    setGamePhase('prep');
  };

  const startAudit = () => {
    setGamePhase('audit');
    processNode('notif_start');
  };

  // === HANDLE CHOICE ===
  const handleChoice = (choice: DialogChoice) => {
    setShowChoices(false);
    setCurrentChoices([]);
    setShowTip(false);

    // Add player message
    setDialogHistory(h => [...h, {
      speaker: 'player',
      text: choice.text,
      isPlayer: true
    }]);

    // Apply choice effects
    setStats(s => ({
      ...s,
      trust: Math.max(0, Math.min(100, s.trust + (choice.effect.trust || 0))),
      stress: Math.max(0, Math.min(100, s.stress + (choice.effect.stress || 0))),
      evidence: Math.max(0, Math.min(100, s.evidence + (choice.effect.evidence || 0))),
      reputation: Math.max(0, Math.min(100, s.reputation + (choice.effect.reputation || 0))),
      perfectAnswers: choice.isOptimal ? s.perfectAnswers + 1 : s.perfectAnswers,
      criticalMistakes: choice.isCriticalMistake ? s.criticalMistakes + 1 : s.criticalMistakes
    }));

    // Show feedback
    if (choice.feedback) {
      setShowFeedback(choice.feedback);
      setTimeout(() => setShowFeedback(null), 3000);
    }

    // Track document presentation
    if (choice.requiresDocument) {
      setStats(s => ({
        ...s,
        documentsPresented: [...s.documentsPresented, choice.requiresDocument!]
      }));
    }

    // Process next node
    setTimeout(() => {
      processNode(choice.nextNode);
    }, 1000);
  };

  // === RANDOM EVENTS ===
  const triggerRandomEvent = () => {
    const currentPhaseName = AUDIT_PHASES[currentPhaseIdx]?.id || 'audit';
    const available = RANDOM_EVENTS.filter(e => 
      !usedEvents.includes(e.id) && 
      e.phase.includes(currentPhaseName)
    );
    
    if (available.length === 0) return;
    
    const event = available[Math.floor(Math.random() * available.length)];
    setUsedEvents(u => [...u, event.id]);
    setShowEvent(event);
    setStats(s => ({ ...s, stress: Math.min(100, s.stress + 10) }));
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
    setTimeout(() => {
      setShowEvent(null);
      setEventOutcome(null);
    }, 2500);
  };

  // === DOCUMENT MANAGEMENT ===
  const toggleDocument = (docId: string) => {
    const doc = documents.find(d => d.id === docId);
    if (!doc) return;
    
    if (selectedDocs.includes(docId)) {
      setSelectedDocs(s => s.filter(d => d !== docId));
    } else {
      if (!doc.isReady) {
        setPrepTime(t => Math.max(0, t - 45));
        setDocuments(docs => docs.map(d => 
          d.id === docId ? { ...d, isReady: true, quality: 40 + Math.floor(Math.random() * 40) } : d
        ));
      }
      setSelectedDocs(s => [...s, docId]);
    }
  };

  // === FORMATTING ===
  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) return `${h}h${m.toString().padStart(2, '0')}m`;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const getGrade = () => {
    const score = Math.round((stats.trust * 0.4 + stats.evidence * 0.4 + (100 - stats.stress) * 0.1 + stats.reputation * 0.1));
    if (score >= 85) return { grade: 'A+', label: 'Exemplaire', color: '#22C55E', emoji: '🏆', passed: true };
    if (score >= 75) return { grade: 'A', label: 'Excellent', color: '#22C55E', emoji: '🌟', passed: true };
    if (score >= 65) return { grade: 'B', label: 'Satisfaisant', color: '#84CC16', emoji: '✅', passed: true };
    if (score >= 55) return { grade: 'C', label: 'Acceptable', color: '#EAB308', emoji: '⚠️', passed: true };
    if (score >= 45) return { grade: 'D', label: 'Insuffisant', color: '#F97316', emoji: '❌', passed: false };
    return { grade: 'F', label: 'Critique', color: '#EF4444', emoji: '🚨', passed: false };
  };

  const getMoodEmoji = (mood?: string) => {
    switch (mood) {
      case 'friendly': case 'pleased': return '😊';
      case 'neutral': return '😐';
      case 'concerned': return '🤨';
      case 'impatient': return '😤';
      case 'serious': return '😑';
      case 'angry': return '😠';
      case 'worried': return '😰';
      case 'stressed': return '😓';
      case 'helpful': return '🙂';
      default: return '👤';
    }
  };

  const getSpeakerInfo = (speaker: string, speakerName?: string) => {
    if (speakerName) return { name: speakerName, avatar: getMoodEmoji() };
    const char = CHARACTERS.find(c => c.id === speaker);
    if (char) return { name: char.name, avatar: char.avatar };
    return { name: 'Système', avatar: '💻' };
  };

  // ============================================
  // RENDER
  // ============================================

  // INTRO SCREEN
  if (gamePhase === 'intro') {
    return (
      <div className="space-y-4 p-2">
        {/* Header */}
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-lg shadow-orange-500/30">
            <span className="text-5xl">🎯</span>
          </div>
          <h2 className="text-2xl font-bold mb-2">Simulation d'Audit AI Act</h2>
          <p className="text-white/60 text-sm">Une expérience immersive de 45 minutes</p>
        </div>

        {/* Stats preview */}
        <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/30 rounded-xl p-4">
          <h3 className="font-bold mb-3 flex items-center gap-2 text-sm">
            <span>📊</span> Ce qui vous attend
          </h3>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-white/5 rounded-lg p-2 flex items-center gap-2">
              <span>📬</span> Notification d'audit
            </div>
            <div className="bg-white/5 rounded-lg p-2 flex items-center gap-2">
              <span>📋</span> Phase préparation
            </div>
            <div className="bg-white/5 rounded-lg p-2 flex items-center gap-2">
              <span>🤝</span> Accueil auditrice
            </div>
            <div className="bg-white/5 rounded-lg p-2 flex items-center gap-2">
              <span>📁</span> Revue documentaire
            </div>
            <div className="bg-white/5 rounded-lg p-2 flex items-center gap-2">
              <span>💬</span> Entretiens approfondis
            </div>
            <div className="bg-white/5 rounded-lg p-2 flex items-center gap-2">
              <span>⚖️</span> Verdict final
            </div>
          </div>
        </div>

        {/* Characters */}
        <div className="bg-white/5 rounded-xl p-4">
          <h3 className="font-bold mb-3 text-sm flex items-center gap-2">
            <span>👥</span> Personnages
          </h3>
          <div className="space-y-2">
            {CHARACTERS.slice(0, 4).map(char => (
              <div key={char.id} className="flex items-center gap-3 text-sm">
                <span className="text-xl">{char.avatar}</span>
                <div>
                  <div className="font-medium">{char.name}</div>
                  <div className="text-white/40 text-xs">{char.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-white/5 rounded-lg p-2 text-center">
            <div className="text-lg mb-1">100+</div>
            <div className="text-white/60">Situations</div>
          </div>
          <div className="bg-white/5 rounded-lg p-2 text-center">
            <div className="text-lg mb-1">15+</div>
            <div className="text-white/60">Événements</div>
          </div>
          <div className="bg-white/5 rounded-lg p-2 text-center">
            <div className="text-lg mb-1">25+</div>
            <div className="text-white/60">Documents</div>
          </div>
          <div className="bg-white/5 rounded-lg p-2 text-center">
            <div className="text-lg mb-1">5</div>
            <div className="text-white/60">Fins possibles</div>
          </div>
        </div>

        <button
          onClick={startPreparation}
          className="w-full py-4 rounded-xl font-bold text-lg text-black flex items-center justify-center gap-2 shadow-lg"
          style={{ backgroundColor: moduleColor }}
        >
          <span className="w-5 h-5"><Icons.Play /></span>
          Commencer la simulation
        </button>

        <p className="text-center text-white/40 text-xs">
          ⏱️ Durée : ~45 minutes | 🎮 Sauvegarde automatique
        </p>
      </div>
    );
  }

  // PREPARATION PHASE
  if (gamePhase === 'prep') {
    const docsByCategory = {
      registre: documents.filter(d => d.category === 'registre'),
      technique: documents.filter(d => d.category === 'technique'),
      gouvernance: documents.filter(d => d.category === 'gouvernance'),
      formation: documents.filter(d => d.category === 'formation'),
      incident: documents.filter(d => d.category === 'incident'),
      communication: documents.filter(d => d.category === 'communication')
    };

    return (
      <div className="space-y-3 p-2">
        {/* Timer */}
        <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 rounded-xl p-3">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold flex items-center gap-2 text-sm">
              <span>⏱️</span> Temps de préparation
            </h3>
            <span className={`font-mono text-xl font-bold ${prepTime < 60 ? 'text-red-400 animate-pulse' : 'text-orange-400'}`}>
              {formatTime(prepTime)}
            </span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-orange-500 to-red-500"
              animate={{ width: `${(prepTime / 300) * 100}%` }}
            />
          </div>
          <p className="text-white/60 text-xs mt-2">
            Sélectionnez les documents à préparer. Chaque document non prêt prend 45s à préparer.
          </p>
        </div>

        {/* Documents by category */}
        <div className="space-y-3 max-h-[400px] overflow-y-auto">
          {Object.entries(docsByCategory).map(([category, docs]) => (
            <div key={category} className="bg-white/5 rounded-xl p-3">
              <h4 className="font-semibold text-xs mb-2 text-white/60 uppercase">
                {category === 'registre' && '📋 Registre & Cartographie'}
                {category === 'technique' && '⚙️ Documentation Technique'}
                {category === 'gouvernance' && '🏛️ Gouvernance'}
                {category === 'formation' && '🎓 Formation'}
                {category === 'incident' && '🚨 Incidents'}
                {category === 'communication' && '📢 Communication'}
              </h4>
              <div className="grid grid-cols-1 gap-1">
                {docs.map(doc => (
                  <button
                    key={doc.id}
                    onClick={() => toggleDocument(doc.id)}
                    className={`p-2 rounded-lg text-left text-xs transition-all flex items-center gap-2 ${
                      selectedDocs.includes(doc.id)
                        ? 'bg-green-500/20 border border-green-500/50'
                        : doc.isReady
                          ? 'bg-white/5 hover:bg-white/10'
                          : 'bg-red-500/10 border border-red-500/30'
                    }`}
                  >
                    <span>{doc.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{doc.name}</div>
                      {doc.aiActReference && (
                        <div className="text-white/40 text-[10px]">{doc.aiActReference}</div>
                      )}
                    </div>
                    <div className="flex-shrink-0">
                      {selectedDocs.includes(doc.id) ? (
                        <span className="text-green-400">✓</span>
                      ) : doc.isReady ? (
                        <span className="text-white/40">{doc.quality}%</span>
                      ) : (
                        <span className="text-red-400 text-[10px]">À préparer</span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Selected count */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-white/60">{selectedDocs.length} documents sélectionnés</span>
          <button
            onClick={startAudit}
            className="px-4 py-2 rounded-lg font-bold text-black text-sm"
            style={{ backgroundColor: moduleColor }}
          >
            {prepTime > 0 ? "Démarrer l'audit →" : "L'auditrice arrive !"}
          </button>
        </div>
      </div>
    );
  }

  // VERDICT SCREEN
  if (gamePhase === 'verdict') {
    const result = getGrade();
    const finalScore = Math.round((stats.trust * 0.4 + stats.evidence * 0.4 + (100 - stats.stress) * 0.1 + stats.reputation * 0.1));

    return (
      <div className="space-y-4 p-2">
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

        {/* Detailed stats */}
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-white/5 rounded-xl p-3">
            <div className="flex justify-between mb-1 text-sm">
              <span>💚 Confiance</span>
              <span className="font-bold">{stats.trust}%</span>
            </div>
            <div className="h-1.5 bg-white/10 rounded-full">
              <div className="h-full bg-green-500 rounded-full" style={{ width: `${stats.trust}%` }} />
            </div>
          </div>
          <div className="bg-white/5 rounded-xl p-3">
            <div className="flex justify-between mb-1 text-sm">
              <span>📋 Preuves</span>
              <span className="font-bold">{stats.evidence}%</span>
            </div>
            <div className="h-1.5 bg-white/10 rounded-full">
              <div className="h-full bg-blue-500 rounded-full" style={{ width: `${stats.evidence}%` }} />
            </div>
          </div>
          <div className="bg-white/5 rounded-xl p-3">
            <div className="flex justify-between mb-1 text-sm">
              <span>⭐ Réputation</span>
              <span className="font-bold">{stats.reputation}%</span>
            </div>
            <div className="h-1.5 bg-white/10 rounded-full">
              <div className="h-full bg-yellow-500 rounded-full" style={{ width: `${stats.reputation}%` }} />
            </div>
          </div>
          <div className="bg-white/5 rounded-xl p-3">
            <div className="flex justify-between mb-1 text-sm">
              <span>😰 Stress</span>
              <span className="font-bold">{stats.stress}%</span>
            </div>
            <div className="h-1.5 bg-white/10 rounded-full">
              <div className="h-full bg-red-500 rounded-full" style={{ width: `${stats.stress}%` }} />
            </div>
          </div>
        </div>

        {/* Stats summary */}
        <div className="flex justify-around text-center text-xs">
          <div>
            <div className="text-2xl font-bold text-green-400">{stats.perfectAnswers}</div>
            <div className="text-white/40">Réponses optimales</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-red-400">{stats.criticalMistakes}</div>
            <div className="text-white/40">Erreurs critiques</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-400">{stats.documentsPresented.length}</div>
            <div className="text-white/40">Documents présentés</div>
          </div>
        </div>

        {/* Verdict */}
        <div className={`rounded-xl p-4 border ${
          result.passed ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'
        }`}>
          <h3 className="font-bold mb-2">
            {result.passed ? '✅ Conformité validée' : '❌ Actions correctives requises'}
          </h3>
          <p className="text-white/70 text-sm">
            {result.passed 
              ? "Votre organisation démontre une maîtrise satisfaisante des exigences de l'AI Act."
              : "Des non-conformités significatives ont été identifiées. Un plan d'action est requis sous 90 jours."}
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={() => {
              const report = `RAPPORT D'AUDIT AI ACT - SIMULATION
══════════════════════════════════════════
Date : ${new Date().toLocaleDateString('fr-FR')}
Durée : ${formatTime(2700 - stats.time)}

VERDICT : ${result.grade} - ${result.label}
Score global : ${finalScore}/100

DÉTAIL DES ÉVALUATIONS
───────────────────────
• Confiance auditrice : ${stats.trust}%
• Preuves de conformité : ${stats.evidence}%
• Réputation : ${stats.reputation}%
• Gestion du stress : ${100 - stats.stress}%

STATISTIQUES
───────────────────────
• Réponses optimales : ${stats.perfectAnswers}
• Erreurs critiques : ${stats.criticalMistakes}
• Documents présentés : ${stats.documentsPresented.length}

CONCLUSION
───────────────────────
${result.passed 
  ? "Conformité validée. Maintenir la veille et les audits internes."
  : "Actions correctives requises sous 90 jours."}

──────────────────────────────────────────
Rapport généré par le Simulateur AI Act
`;
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
            Rapport
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

  // MAIN AUDIT INTERFACE
  return (
    <div className="flex flex-col h-full min-h-[550px]">
      {/* TOP BAR */}
      <div className="flex-shrink-0 mb-2">
        {/* Phase indicator */}
        <div className="flex items-center gap-1 mb-2 overflow-x-auto pb-1">
          {AUDIT_PHASES.map((phase, idx) => (
            <div
              key={phase.id}
              className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs whitespace-nowrap transition-all ${
                idx === currentPhaseIdx
                  ? 'bg-white/10'
                  : idx < currentPhaseIdx
                    ? 'text-white/40'
                    : 'text-white/20'
              }`}
              style={idx === currentPhaseIdx ? { borderColor: phase.color, borderWidth: 1 } : {}}
            >
              <span>{phase.icon}</span>
              <span className="hidden sm:inline">{phase.name}</span>
            </div>
          ))}
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-4 gap-1">
          <div className="bg-white/5 rounded-lg p-1.5">
            <div className="flex items-center justify-between text-[10px] mb-0.5">
              <span>💚</span>
              <span className={stats.trust >= 50 ? 'text-green-400' : 'text-red-400'}>{stats.trust}%</span>
            </div>
            <div className="h-1 bg-white/10 rounded-full">
              <div className={`h-full rounded-full ${stats.trust >= 50 ? 'bg-green-500' : 'bg-red-500'}`} style={{ width: `${stats.trust}%` }} />
            </div>
          </div>
          <div className="bg-white/5 rounded-lg p-1.5">
            <div className="flex items-center justify-between text-[10px] mb-0.5">
              <span>📋</span>
              <span className="text-blue-400">{stats.evidence}%</span>
            </div>
            <div className="h-1 bg-white/10 rounded-full">
              <div className="h-full bg-blue-500 rounded-full" style={{ width: `${stats.evidence}%` }} />
            </div>
          </div>
          <div className="bg-white/5 rounded-lg p-1.5">
            <div className="flex items-center justify-between text-[10px] mb-0.5">
              <span>😰</span>
              <span className={stats.stress <= 50 ? 'text-green-400' : 'text-red-400'}>{stats.stress}%</span>
            </div>
            <div className="h-1 bg-white/10 rounded-full">
              <div className={`h-full rounded-full ${stats.stress <= 50 ? 'bg-green-500' : 'bg-red-500'}`} style={{ width: `${stats.stress}%` }} />
            </div>
          </div>
          <div className="bg-white/5 rounded-lg p-1.5">
            <div className="flex items-center justify-between text-[10px] mb-0.5">
              <span>⏱️</span>
              <span className="font-mono">{formatTime(stats.time)}</span>
            </div>
            <div className="h-1 bg-white/10 rounded-full">
              <div className="h-full bg-purple-500 rounded-full" style={{ width: `${(stats.time / 2700) * 100}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* CHAT AREA */}
      <div className="flex-1 bg-white/5 rounded-xl overflow-hidden flex flex-col min-h-0">
        {/* Messages */}
        <div ref={chatRef} className="flex-1 overflow-y-auto p-3 space-y-3">
          {dialogHistory.map((msg, idx) => {
            const info = getSpeakerInfo(msg.speaker, msg.speakerName);
            
            if (msg.speaker === 'system') {
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center text-white/40 text-xs italic py-2 px-4 bg-white/5 rounded-lg"
                >
                  {msg.text}
                </motion.div>
              );
            }
            
            if (msg.isPlayer || msg.speaker === 'player') {
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex justify-end"
                >
                  <div className="bg-blue-500/20 rounded-2xl rounded-tr-sm p-3 max-w-[85%]">
                    <p className="text-sm">{msg.text}</p>
                  </div>
                </motion.div>
              );
            }
            
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex gap-2"
              >
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-lg">
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
          
          {/* Typing indicator */}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-2"
            >
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                👩‍💼
              </div>
              <div className="bg-white/10 rounded-2xl rounded-tl-sm px-4 py-3">
                <div className="flex gap-1">
                  <motion.span
                    className="w-2 h-2 bg-white/40 rounded-full"
                    animate={{ y: [0, -4, 0] }}
                    transition={{ repeat: Infinity, duration: 0.6, delay: 0 }}
                  />
                  <motion.span
                    className="w-2 h-2 bg-white/40 rounded-full"
                    animate={{ y: [0, -4, 0] }}
                    transition={{ repeat: Infinity, duration: 0.6, delay: 0.15 }}
                  />
                  <motion.span
                    className="w-2 h-2 bg-white/40 rounded-full"
                    animate={{ y: [0, -4, 0] }}
                    transition={{ repeat: Infinity, duration: 0.6, delay: 0.3 }}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Choices */}
        {showChoices && currentChoices.length > 0 && (
          <div className="flex-shrink-0 border-t border-white/10 p-2 space-y-1.5 max-h-[200px] overflow-y-auto">
            {currentTip && (
              <button
                onClick={() => setShowTip(!showTip)}
                className="w-full text-left text-xs text-yellow-400/70 hover:text-yellow-400 flex items-center gap-1 mb-1"
              >
                <div className="w-3 h-3"><Icons.Lightbulb /></div>
                {showTip ? 'Masquer l\'indice' : 'Voir un indice'}
              </button>
            )}
            {showTip && currentTip && (
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-2 text-xs text-yellow-200 mb-2">
                💡 {currentTip}
              </div>
            )}
            {currentChoices.map((choice) => (
              <button
                key={choice.id}
                onClick={() => handleChoice(choice)}
                className={`w-full p-2.5 rounded-xl text-left text-sm transition-all ${
                  choice.isOptimal 
                    ? 'bg-green-500/10 border border-green-500/30 hover:bg-green-500/20' 
                    : choice.isRisky
                      ? 'bg-red-500/10 border border-red-500/30 hover:bg-red-500/20'
                      : 'bg-white/5 hover:bg-white/10'
                }`}
              >
                <div className="font-medium text-xs">{choice.shortText || choice.text.substring(0, 60) + '...'}</div>
                {choice.requiresDocument && (
                  <div className="text-[10px] text-white/40 mt-1">
                    📎 {documents.find(d => d.id === choice.requiresDocument)?.name}
                  </div>
                )}
                {choice.aiActArticle && (
                  <div className="text-[10px] text-blue-400/60 mt-0.5">
                    📖 {choice.aiActArticle}
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* FEEDBACK TOAST */}
      <AnimatePresence>
        {showFeedback && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="absolute bottom-4 left-4 right-4 bg-red-500/90 text-white p-3 rounded-xl text-sm font-medium"
          >
            ⚠️ {showFeedback}
          </motion.div>
        )}
      </AnimatePresence>

      {/* RANDOM EVENT OVERLAY */}
      <AnimatePresence>
        {showEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-[#1a1a2e] border border-yellow-500/50 rounded-2xl p-4 max-w-md w-full"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center text-2xl">
                  {showEvent.icon}
                </div>
                <div>
                  <h3 className="font-bold text-yellow-400">{showEvent.title}</h3>
                  {showEvent.sender && <p className="text-white/40 text-xs">{showEvent.sender}</p>}
                </div>
              </div>

              <p className="text-white/90 text-sm mb-4">{showEvent.message}</p>

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
