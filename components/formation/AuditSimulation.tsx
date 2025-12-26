'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ============================================
// TYPES
// ============================================
interface Document {
  id: string;
  name: string;
  category: 'registre' | 'technique' | 'gouvernance' | 'formation' | 'incident';
  icon: string;
  isReady: boolean;
  quality: number; // 0-100
}

interface AuditorState {
  mood: 'friendly' | 'neutral' | 'impatient' | 'concerned' | 'angry' | 'impressed' | 'serious' | 'pleased';
  message: string;
  isTyping: boolean;
  isSpeaking: boolean;
}

interface GameState {
  phase: 'briefing' | 'preparation' | 'audit' | 'deliberation' | 'verdict';
  subPhase: string;
  turn: number;
  maxTurns: number;
}

interface PlayerStats {
  trust: number;      // 0-100 - Confiance de l'auditrice
  stress: number;     // 0-100 - Niveau de stress
  evidence: number;   // 0-100 - Preuves de conformité collectées
  time: number;       // Secondes restantes
}

interface DialogNode {
  id: string;
  speaker: 'auditor' | 'player' | 'system' | 'interruption';
  text: string;
  mood?: AuditorState['mood'];
  choices?: DialogChoice[];
  documentRequired?: string;
  autoNext?: string;
  delay?: number;
  effect?: {
    trust?: number;
    stress?: number;
    evidence?: number;
    time?: number;
  };
}

interface DialogChoice {
  id: string;
  text: string;
  shortText?: string;
  requiresDocument?: string;
  effect: {
    trust?: number;
    stress?: number;
    evidence?: number;
  };
  nextNode: string;
  isOptimal?: boolean;
  isRisky?: boolean;
}

interface RandomEvent {
  id: string;
  type: 'phone' | 'email' | 'technical' | 'colleague' | 'emergency';
  title: string;
  icon: string;
  message: string;
  choices: {
    text: string;
    effect: { trust?: number; stress?: number; time?: number };
    outcome: string;
  }[];
}

// ============================================
// GAME DATA
// ============================================
const INITIAL_DOCUMENTS: Document[] = [
  { id: 'registre', name: 'Registre des systèmes IA', category: 'registre', icon: '📋', isReady: true, quality: 85 },
  { id: 'cartographie', name: 'Cartographie complète', category: 'registre', icon: '🗺️', isReady: true, quality: 70 },
  { id: 'classification', name: 'Matrice de classification', category: 'registre', icon: '⚖️', isReady: false, quality: 0 },
  { id: 'doc_technique', name: 'Documentation technique fournisseurs', category: 'technique', icon: '📄', isReady: true, quality: 60 },
  { id: 'aipd', name: 'Analyse d\'impact (AIPD)', category: 'technique', icon: '🔍', isReady: false, quality: 0 },
  { id: 'tests_biais', name: 'Rapports tests de biais', category: 'technique', icon: '📊', isReady: true, quality: 75 },
  { id: 'politique_ia', name: 'Politique d\'utilisation IA', category: 'gouvernance', icon: '📜', isReady: true, quality: 90 },
  { id: 'charte', name: 'Charte éthique IA', category: 'gouvernance', icon: '⚡', isReady: true, quality: 80 },
  { id: 'procedures', name: 'Procédures de supervision', category: 'gouvernance', icon: '👁️', isReady: false, quality: 0 },
  { id: 'formation', name: 'Attestations de formation', category: 'formation', icon: '🎓', isReady: true, quality: 65 },
  { id: 'logs', name: 'Logs des décisions IA', category: 'technique', icon: '💾', isReady: true, quality: 55 },
  { id: 'incidents', name: 'Registre des incidents', category: 'incident', icon: '🚨', isReady: false, quality: 0 },
];

const RANDOM_EVENTS: RandomEvent[] = [
  {
    id: 'phone_ceo',
    type: 'phone',
    title: 'Appel du PDG',
    icon: '📱',
    message: "Votre PDG vous appelle : \"Comment ça se passe ? Le conseil d'administration me demande des nouvelles...\"",
    choices: [
      { text: "Rassurer calmement et raccrocher vite", effect: { stress: -5, time: -30 }, outcome: "Vous gérez bien la pression hiérarchique." },
      { text: "Expliquer la situation en détail", effect: { stress: 10, time: -120, trust: -5 }, outcome: "L'auditrice remarque votre longue absence..." },
      { text: "Ignorer l'appel", effect: { stress: 15 }, outcome: "Le PDG n'appréciera pas, mais vous restez concentré." }
    ]
  },
  {
    id: 'system_crash',
    type: 'technical',
    title: 'Panne système',
    icon: '💥',
    message: "L'écran de démonstration affiche une erreur : \"Connexion au serveur perdue\"",
    choices: [
      { text: "Rester calme, proposer les documents papier", effect: { trust: 5, stress: 10 }, outcome: "Votre sang-froid impressionne l'auditrice." },
      { text: "Paniquer et appeler la DSI", effect: { trust: -10, stress: 25, time: -180 }, outcome: "L'auditrice note votre manque de préparation." },
      { text: "Expliquer que c'est un cas rare et documenté", effect: { trust: -5, stress: 15 }, outcome: "L'excuse passe moyennement..." }
    ]
  },
  {
    id: 'colleague_interrupt',
    type: 'colleague',
    title: 'Interruption d\'un collègue',
    icon: '🚪',
    message: "Un collègue entre sans frapper : \"Désolé, mais on a un problème urgent avec le chatbot client, il dit n'importe quoi !\"",
    choices: [
      { text: "Lui demander de gérer et revenir plus tard", effect: { stress: 10 }, outcome: "Vous gardez le focus sur l'audit." },
      { text: "S'excuser auprès de l'auditrice et aller voir", effect: { trust: -15, stress: 20, time: -300 }, outcome: "L'auditrice fronce les sourcils en voyant le chaos." },
      { text: "Transformer ça en exemple de gestion d'incident", effect: { trust: 10, stress: 15 }, outcome: "Brillant ! Vous montrez votre réactivité." }
    ]
  },
  {
    id: 'email_vendor',
    type: 'email',
    title: 'Email urgent du fournisseur',
    icon: '📧',
    message: "Email de votre fournisseur IA RH : \"Suite à notre échange, nous ne pouvons pas vous fournir les données d'entraînement. Confidentialité.\"",
    choices: [
      { text: "Montrer l'email à l'auditrice et votre plan d'escalade", effect: { trust: 10 }, outcome: "Votre transparence est appréciée." },
      { text: "Cacher l'email et espérer qu'elle ne demande pas", effect: { trust: -20, stress: 25 }, outcome: "Risqué... Si elle découvre..." },
      { text: "Dire que vous allez changer de fournisseur", effect: { trust: -5, stress: 5 }, outcome: "Réaction un peu excessive mais notée." }
    ]
  },
  {
    id: 'fire_alarm',
    type: 'emergency',
    title: 'Alarme incendie',
    icon: '🔥',
    message: "L'alarme incendie se déclenche ! Probablement un exercice, mais...",
    choices: [
      { text: "Évacuer calmement avec l'auditrice", effect: { trust: 5, time: -600 }, outcome: "Vous montrez que vous respectez les procédures de sécurité." },
      { text: "Proposer de continuer, c'est sûrement un test", effect: { trust: -10, stress: 10 }, outcome: "L'auditrice note que vous ignorez les alarmes..." },
      { text: "Vérifier rapidement si c'est un vrai incendie", effect: { time: -120 }, outcome: "Pragmatique. C'était bien un exercice." }
    ]
  }
];

const AUDIT_SCENARIO: DialogNode[] = [
  // === PHASE 1: ACCUEIL ===
  {
    id: 'start',
    speaker: 'system',
    text: "09:00 - L'auditrice de la Commission Nationale de l'IA arrive dans le hall...",
    autoNext: 'arrival',
    delay: 2000
  },
  {
    id: 'arrival',
    speaker: 'auditor',
    text: "Bonjour. Marie Durand, Commission Nationale de l'IA. Conformément à l'article 74, nous procédons à un contrôle de conformité de vos systèmes d'intelligence artificielle. Pouvons-nous commencer ?",
    mood: 'neutral',
    choices: [
      { 
        id: 'welcome_warm', 
        text: "Bonjour Madame Durand ! Bienvenue. Un café avant de commencer ? Notre salle de réunion est prête.",
        shortText: "Accueil chaleureux + café",
        effect: { trust: 10, stress: -5 }, 
        nextNode: 'coffee_accepted',
        isOptimal: true
      },
      { 
        id: 'welcome_formal', 
        text: "Bonjour. Oui, nous vous attendions. Suivez-moi en salle de réunion.",
        shortText: "Accueil formel",
        effect: { trust: 0 }, 
        nextNode: 'to_meeting_room' 
      },
      { 
        id: 'welcome_nervous', 
        text: "Oh ! Déjà ? Euh... je pensais que c'était à 10h... Donnez-moi 5 minutes !",
        shortText: "Panique (non préparé)",
        effect: { trust: -15, stress: 20 }, 
        nextNode: 'bad_start',
        isRisky: true
      }
    ]
  },
  {
    id: 'coffee_accepted',
    speaker: 'auditor',
    text: "Volontiers, merci. *Elle sourit légèrement* C'est appréciable d'être bien accueilli. Ça change de certains contrôles où l'on nous traite comme des ennemis...",
    mood: 'friendly',
    autoNext: 'to_meeting_room',
    delay: 3000
  },
  {
    id: 'bad_start',
    speaker: 'auditor',
    text: "*Elle fronce les sourcils* L'heure était pourtant claire dans la notification. Ce n'est pas un bon début... Je vais patienter, mais notez que je chronométre.",
    mood: 'impatient',
    effect: { trust: -10 },
    autoNext: 'to_meeting_room',
    delay: 3000
  },
  {
    id: 'to_meeting_room',
    speaker: 'system',
    text: "Vous entrez en salle de réunion. L'auditrice sort son ordinateur et un épais dossier.",
    autoNext: 'intro_question',
    delay: 2000
  },

  // === PHASE 2: IDENTIFICATION ===
  {
    id: 'intro_question',
    speaker: 'auditor',
    text: "Bien. Commençons par les présentations officielles. Quel est votre rôle exact concernant la conformité IA dans cette organisation ? Êtes-vous le référent désigné ?",
    mood: 'neutral',
    choices: [
      {
        id: 'role_designated',
        text: "Je suis le Responsable Conformité IA, officiellement désigné par la Direction Générale. Voici ma lettre de mission qui définit mon périmètre et mes responsabilités.",
        shortText: "Montrer lettre de mission",
        requiresDocument: 'politique_ia',
        effect: { trust: 15, evidence: 10 },
        nextNode: 'role_approved',
        isOptimal: true
      },
      {
        id: 'role_dsi',
        text: "Je suis le DSI. L'IA fait partie de mon périmètre technique, donc je gère aussi la conformité.",
        shortText: "DSI (pas de rôle dédié)",
        effect: { trust: -5 },
        nextNode: 'role_concern'
      },
      {
        id: 'role_vague',
        text: "Eh bien... on est plusieurs à s'en occuper. Il n'y a pas vraiment de responsable unique désigné.",
        shortText: "Pas de responsable clair",
        effect: { trust: -20, stress: 15 },
        nextNode: 'role_problem',
        isRisky: true
      }
    ]
  },
  {
    id: 'role_approved',
    speaker: 'auditor',
    text: "*Elle examine le document* Très bien. Une mission clairement définie, approuvée par la direction. C'est conforme aux recommandations. Vous avez aussi l'autorité pour prendre des décisions de mise en conformité ?",
    mood: 'friendly',
    effect: { evidence: 5 },
    choices: [
      {
        id: 'authority_yes',
        text: "Oui, j'ai un budget dédié et je peux imposer des arrêts de systèmes non conformes. La direction me soutient pleinement.",
        shortText: "Autorité complète",
        effect: { trust: 10, evidence: 5 },
        nextNode: 'perimeter_question',
        isOptimal: true
      },
      {
        id: 'authority_partial',
        text: "J'ai un rôle consultatif. Les décisions finales remontent à la direction.",
        shortText: "Rôle consultatif",
        effect: { trust: -5 },
        nextNode: 'perimeter_question'
      }
    ]
  },
  {
    id: 'role_concern',
    speaker: 'auditor',
    text: "*Elle prend des notes* Le DSI comme responsable conformité... C'est un cumul de fonctions qui peut poser des conflits d'intérêts. L'AI Act recommande une fonction indépendante. Avez-vous prévu d'évoluer ?",
    mood: 'concerned',
    choices: [
      {
        id: 'evolve_yes',
        text: "Oui, nous avons identifié ce point. Un recrutement est en cours pour un poste dédié.",
        shortText: "Recrutement en cours",
        effect: { trust: 10 },
        nextNode: 'perimeter_question'
      },
      {
        id: 'evolve_no',
        text: "Pour l'instant ça fonctionne comme ça. On verra plus tard.",
        shortText: "Pas d'évolution prévue",
        effect: { trust: -10 },
        nextNode: 'perimeter_question'
      }
    ]
  },
  {
    id: 'role_problem',
    speaker: 'auditor',
    text: "*Elle pose son stylo et vous regarde fixement* C'est un premier point de non-conformité significatif. L'AI Act exige un point de contact unique et identifié. Je vais noter cela comme observation critique.",
    mood: 'concerned',
    effect: { trust: -10, evidence: -15 },
    autoNext: 'perimeter_question',
    delay: 3000
  },

  // === PHASE 3: PÉRIMÈTRE ===
  {
    id: 'perimeter_question',
    speaker: 'auditor',
    text: "Passons au périmètre. Combien de systèmes d'IA utilisez-vous dans l'organisation, et pouvez-vous me présenter votre registre ?",
    mood: 'neutral',
    documentRequired: 'registre',
    choices: [
      {
        id: 'registry_complete',
        text: "Nous avons identifié 14 systèmes d'IA. Voici notre registre complet : nom, fournisseur, usage, classification de risque, et date de dernière revue pour chacun.",
        shortText: "Présenter registre complet",
        requiresDocument: 'registre',
        effect: { trust: 15, evidence: 20 },
        nextNode: 'registry_review',
        isOptimal: true
      },
      {
        id: 'registry_partial',
        text: "On utilise environ une dizaine d'outils IA. J'ai commencé un inventaire mais il n'est pas finalisé.",
        shortText: "Registre incomplet",
        effect: { trust: -10, evidence: -10 },
        nextNode: 'registry_incomplete'
      },
      {
        id: 'registry_none',
        text: "Honnêtement, je n'ai pas le chiffre exact. Chaque département utilise ses propres outils...",
        shortText: "Pas de visibilité",
        effect: { trust: -25, stress: 20, evidence: -25 },
        nextNode: 'registry_critical',
        isRisky: true
      }
    ]
  },
  {
    id: 'registry_review',
    speaker: 'auditor',
    text: "*Elle parcourt le registre* Intéressant. Je vois que vous avez 3 systèmes classés 'haut risque' : recrutement IA, scoring crédit, et vidéosurveillance intelligente. Pouvez-vous me détailler les critères qui vous ont amenés à ces classifications ?",
    mood: 'neutral',
    choices: [
      {
        id: 'classification_detailed',
        text: "Pour chaque système, nous avons analysé l'annexe III de l'AI Act. Le recrutement IA tombe sous le point 4a (emploi), le scoring sous 5b (crédit), et la vidéo sous 6a (application de la loi). Voici nos fiches d'analyse.",
        shortText: "Montrer analyse détaillée",
        requiresDocument: 'classification',
        effect: { trust: 15, evidence: 15 },
        nextNode: 'high_risk_deep_dive',
        isOptimal: true
      },
      {
        id: 'classification_basic',
        text: "On s'est basé sur le fait que ce sont des domaines sensibles listés dans le règlement.",
        shortText: "Analyse basique",
        effect: { trust: 0, evidence: 5 },
        nextNode: 'high_risk_deep_dive'
      }
    ]
  },
  {
    id: 'registry_incomplete',
    speaker: 'auditor',
    text: "*Soupir* Un registre incomplet rend impossible la vérification de conformité. Comment pouvez-vous garantir que tous vos systèmes respectent le règlement si vous ne les avez pas tous identifiés ?",
    mood: 'impatient',
    effect: { evidence: -10 },
    autoNext: 'high_risk_deep_dive',
    delay: 3000
  },
  {
    id: 'registry_critical',
    speaker: 'auditor',
    text: "*Elle referme son dossier* Madame, Monsieur, l'absence totale de cartographie est une non-conformité majeure. C'est l'article 29 du règlement. Je dois le signaler immédiatement dans mon rapport préliminaire.",
    mood: 'angry',
    effect: { trust: -20, evidence: -20 },
    autoNext: 'high_risk_deep_dive',
    delay: 4000
  },

  // === PHASE 4: SYSTÈMES HAUT RISQUE ===
  {
    id: 'high_risk_deep_dive',
    speaker: 'auditor',
    text: "Concentrons-nous sur votre système de recrutement IA. C'est un système à haut risque au sens de l'article 6. Avez-vous réalisé une analyse d'impact sur les droits fondamentaux ?",
    mood: 'serious',
    documentRequired: 'aipd',
    choices: [
      {
        id: 'aipd_complete',
        text: "Oui, nous avons conduit une AIPD spécifique qui couvre : les risques de discrimination (genre, âge, origine), la protection des données, et les mesures de mitigation mises en place.",
        shortText: "AIPD complète",
        requiresDocument: 'aipd',
        effect: { trust: 20, evidence: 25 },
        nextNode: 'bias_testing',
        isOptimal: true
      },
      {
        id: 'aipd_gdpr',
        text: "On a fait une analyse d'impact RGPD, ça devrait couvrir les aspects IA aussi, non ?",
        shortText: "Seulement AIPD RGPD",
        effect: { trust: -10, evidence: -5 },
        nextNode: 'aipd_insufficient'
      },
      {
        id: 'aipd_none',
        text: "Pas encore. On prévoyait de le faire cette année...",
        shortText: "Pas d'AIPD",
        effect: { trust: -25, stress: 15, evidence: -20 },
        nextNode: 'aipd_missing',
        isRisky: true
      }
    ]
  },
  {
    id: 'aipd_insufficient',
    speaker: 'auditor',
    text: "Non. L'AI Act requiert une analyse spécifique aux risques IA : biais algorithmiques, équité, explicabilité. Une AIPD RGPD ne couvre pas ces aspects. Vous devez compléter votre analyse.",
    mood: 'concerned',
    effect: { evidence: -10 },
    autoNext: 'bias_testing',
    delay: 3000
  },
  {
    id: 'aipd_missing',
    speaker: 'auditor',
    text: "*Elle note longuement* Article 27 - Obligation d'analyse d'impact non respectée. Pour un système de recrutement utilisé depuis combien de temps ?... *Elle secoue la tête* C'est problématique.",
    mood: 'angry',
    effect: { trust: -15, evidence: -15 },
    autoNext: 'bias_testing',
    delay: 4000
  },
  {
    id: 'bias_testing',
    speaker: 'auditor',
    text: "Avez-vous testé votre système de recrutement pour détecter d'éventuels biais discriminatoires ? Pouvez-vous me montrer les résultats ?",
    mood: 'neutral',
    documentRequired: 'tests_biais',
    choices: [
      {
        id: 'bias_tested',
        text: "Oui, nous faisons des audits trimestriels. Voici le dernier rapport : nous testons l'équité par genre, tranche d'âge, et origine géographique. Nous avons détecté un biais de 12% défavorisant les candidats seniors, et mis en place une correction.",
        shortText: "Tests réguliers + correction",
        requiresDocument: 'tests_biais',
        effect: { trust: 25, evidence: 20 },
        nextNode: 'transparency_check',
        isOptimal: true
      },
      {
        id: 'bias_vendor',
        text: "Notre fournisseur nous a assuré que le système était équitable. Nous lui faisons confiance.",
        shortText: "Confiance au fournisseur",
        effect: { trust: -15, evidence: -10 },
        nextNode: 'vendor_trust_issue'
      },
      {
        id: 'bias_no',
        text: "On n'a pas les compétences pour faire ce type de tests en interne...",
        shortText: "Pas de tests",
        effect: { trust: -20, stress: 10, evidence: -15 },
        nextNode: 'vendor_trust_issue',
        isRisky: true
      }
    ]
  },
  {
    id: 'vendor_trust_issue',
    speaker: 'auditor',
    text: "En tant que déployeur, VOUS êtes responsable de vérifier le système. Faire confiance aveuglément au fournisseur ne vous exonère pas. L'article 29 est clair : le déployeur doit mettre en œuvre des mesures de contrôle.",
    mood: 'serious',
    effect: { evidence: -10 },
    autoNext: 'transparency_check',
    delay: 4000
  },

  // === PHASE 5: TRANSPARENCE ===
  {
    id: 'transparency_check',
    speaker: 'auditor',
    text: "Question transparence. Vos utilisateurs - les candidats qui postulent - savent-ils qu'une IA analyse leur CV ? Comment les en informez-vous ?",
    mood: 'neutral',
    choices: [
      {
        id: 'transparency_clear',
        text: "Oui, à trois niveaux : 1) Mention claire sur l'offre d'emploi, 2) Information dans le formulaire de candidature avec case à cocher, 3) Email de confirmation détaillant le processus. Voici les captures d'écran.",
        shortText: "Information à 3 niveaux",
        effect: { trust: 20, evidence: 15 },
        nextNode: 'human_oversight',
        isOptimal: true
      },
      {
        id: 'transparency_cgu',
        text: "C'est mentionné dans nos conditions générales d'utilisation que les candidats acceptent.",
        shortText: "Seulement dans les CGU",
        effect: { trust: -10, evidence: -5 },
        nextNode: 'transparency_insufficient'
      },
      {
        id: 'transparency_none',
        text: "Euh... je ne crois pas que ce soit explicitement communiqué...",
        shortText: "Pas d'information",
        effect: { trust: -25, stress: 15, evidence: -20 },
        nextNode: 'transparency_violation',
        isRisky: true
      }
    ]
  },
  {
    id: 'transparency_insufficient',
    speaker: 'auditor',
    text: "Enterrer l'information dans des CGU que personne ne lit n'est pas conforme. L'article 50 exige une information claire, accessible et visible au moment de l'interaction.",
    mood: 'concerned',
    effect: { evidence: -5 },
    autoNext: 'human_oversight',
    delay: 3000
  },
  {
    id: 'transparency_violation',
    speaker: 'auditor',
    text: "*Elle pose son stylo, l'air grave* C'est une violation directe de l'article 50 sur la transparence. Les personnes concernées doivent être informées qu'elles interagissent avec un système d'IA. C'est non négociable.",
    mood: 'angry',
    effect: { trust: -15, evidence: -15 },
    autoNext: 'human_oversight',
    delay: 4000
  },

  // === PHASE 6: SUPERVISION HUMAINE ===
  {
    id: 'human_oversight',
    speaker: 'auditor',
    text: "Article 14 - La supervision humaine. Comment garantissez-vous qu'un humain reste dans la boucle pour les décisions du système de recrutement ?",
    mood: 'neutral',
    choices: [
      {
        id: 'oversight_full',
        text: "L'IA ne prend aucune décision seule. Elle propose un classement des candidatures avec un score d'adéquation. Un recruteur humain formé examine chaque dossier et prend la décision finale. Nous loguons qui valide quoi.",
        shortText: "IA propose, humain décide + logs",
        requiresDocument: 'procedures',
        effect: { trust: 25, evidence: 20 },
        nextNode: 'incident_procedure',
        isOptimal: true
      },
      {
        id: 'oversight_exception',
        text: "Les recruteurs peuvent override les décisions de l'IA s'ils ne sont pas d'accord.",
        shortText: "Override possible",
        effect: { trust: 0, evidence: 5 },
        nextNode: 'oversight_clarify'
      },
      {
        id: 'oversight_auto',
        text: "Pour les candidatures clairement non qualifiées, le système rejette automatiquement. Ça fait gagner du temps.",
        shortText: "Rejet automatique",
        effect: { trust: -30, stress: 20, evidence: -25 },
        nextNode: 'oversight_violation',
        isRisky: true
      }
    ]
  },
  {
    id: 'oversight_clarify',
    speaker: 'auditor',
    text: "Override en cas de désaccord, c'est bien. Mais par défaut, qui prend la décision ? L'IA ou l'humain ?",
    mood: 'neutral',
    choices: [
      {
        id: 'clarify_human',
        text: "L'humain. L'IA est un outil d'aide, pas un décideur.",
        effect: { trust: 10, evidence: 10 },
        nextNode: 'incident_procedure'
      },
      {
        id: 'clarify_ia',
        text: "En pratique, les recruteurs suivent souvent les recommandations de l'IA...",
        effect: { trust: -15, evidence: -10 },
        nextNode: 'oversight_concern'
      }
    ]
  },
  {
    id: 'oversight_violation',
    speaker: 'auditor',
    text: "*Elle s'arrête d'écrire* Un rejet automatique sans intervention humaine pour un système de recrutement ? C'est exactement ce que l'AI Act interdit. Vous refusez des candidatures sur la seule base d'un algorithme ?",
    mood: 'angry',
    effect: { trust: -20, evidence: -20 },
    autoNext: 'incident_procedure',
    delay: 4000
  },
  {
    id: 'oversight_concern',
    speaker: 'auditor',
    text: "Si les humains valident systématiquement sans analyse critique, vous avez une 'automation bias'. La supervision humaine doit être effective, pas une simple formalité.",
    mood: 'concerned',
    effect: { evidence: -10 },
    autoNext: 'incident_procedure',
    delay: 3000
  },

  // === PHASE 7: GESTION DES INCIDENTS ===
  {
    id: 'incident_procedure',
    speaker: 'auditor',
    text: "Dernière grande section : la gestion des incidents. Avez-vous une procédure formalisée en cas de dysfonctionnement grave de vos systèmes IA ?",
    mood: 'neutral',
    documentRequired: 'incidents',
    choices: [
      {
        id: 'incident_complete',
        text: "Oui, notre procédure couvre : 1) Détection et arrêt immédiat, 2) Notification aux personnes affectées sous 72h, 3) Signalement à l'autorité si impact significatif, 4) Analyse root cause, 5) Plan de remédiation. On fait un exercice annuel.",
        shortText: "Procédure complète + exercices",
        requiresDocument: 'incidents',
        effect: { trust: 20, evidence: 20 },
        nextNode: 'final_questions',
        isOptimal: true
      },
      {
        id: 'incident_basic',
        text: "On arrêterait le système et on appellerait le fournisseur pour comprendre.",
        shortText: "Procédure basique",
        effect: { trust: -5, evidence: -5 },
        nextNode: 'incident_improve'
      },
      {
        id: 'incident_none',
        text: "On n'a jamais eu d'incident, donc on n'a pas vraiment formalisé de procédure...",
        shortText: "Pas de procédure",
        effect: { trust: -20, evidence: -15 },
        nextNode: 'incident_risk',
        isRisky: true
      }
    ]
  },
  {
    id: 'incident_improve',
    speaker: 'auditor',
    text: "Contacter le fournisseur est une réaction, pas une procédure. Quid de la notification aux personnes impactées ? Du signalement réglementaire ? De la traçabilité ? Vous devez formaliser cela.",
    mood: 'concerned',
    effect: { evidence: -10 },
    autoNext: 'final_questions',
    delay: 3000
  },
  {
    id: 'incident_risk',
    speaker: 'auditor',
    text: "'Jamais eu d'incident' ne signifie pas 'jamais d'incident à venir'. L'absence de procédure est un risque organisationnel majeur. Que ferez-vous le jour où un candidat portera plainte pour discrimination ?",
    mood: 'serious',
    effect: { trust: -10, evidence: -10, stress: 15 },
    autoNext: 'final_questions',
    delay: 4000
  },

  // === PHASE FINALE ===
  {
    id: 'final_questions',
    speaker: 'auditor',
    text: "Nous approchons de la fin. Une dernière question : quels sont, selon vous, vos principaux axes d'amélioration en matière de conformité IA ?",
    mood: 'neutral',
    choices: [
      {
        id: 'selfaware_good',
        text: "Notre auto-évaluation identifie trois priorités : compléter les AIPD manquantes, renforcer la formation des équipes métier, et améliorer notre traçabilité. Voici notre plan d'action sur 6 mois.",
        shortText: "Lucidité + plan d'action",
        effect: { trust: 20, evidence: 15 },
        nextNode: 'closing',
        isOptimal: true
      },
      {
        id: 'selfaware_basic',
        text: "On sait qu'on doit améliorer notre documentation. C'est en cours.",
        shortText: "Conscience limitée",
        effect: { trust: 5, evidence: 5 },
        nextNode: 'closing'
      },
      {
        id: 'selfaware_none',
        text: "Je pense qu'on est plutôt bien. On attend vos retours pour voir.",
        shortText: "Pas de recul critique",
        effect: { trust: -15, evidence: -10 },
        nextNode: 'closing_negative'
      }
    ]
  },
  {
    id: 'closing_negative',
    speaker: 'auditor',
    text: "*Elle referme son dossier* L'auto-évaluation est une compétence clé en conformité. Attendre qu'un auditeur vous dise quoi améliorer n'est pas une stratégie viable.",
    mood: 'impatient',
    effect: { trust: -10 },
    autoNext: 'closing',
    delay: 3000
  },
  {
    id: 'closing',
    speaker: 'auditor',
    text: "Je vous remercie pour votre disponibilité. Je vais maintenant rédiger mon rapport préliminaire. Vous le recevrez sous 15 jours avec mes observations et recommandations. Avez-vous des questions ?",
    mood: 'neutral',
    choices: [
      {
        id: 'question_timeline',
        text: "Merci pour cet échange constructif. Quel est le délai pour mettre en œuvre les éventuelles actions correctives ?",
        shortText: "Question sur les délais",
        effect: { trust: 5 },
        nextNode: 'end'
      },
      {
        id: 'question_none',
        text: "Non, tout est clair. Merci pour votre temps.",
        shortText: "Pas de questions",
        effect: {},
        nextNode: 'end'
      }
    ]
  },
  {
    id: 'end',
    speaker: 'system',
    text: "L'auditrice rassemble ses affaires et vous serre la main. L'audit est terminé. Place au verdict...",
    autoNext: 'verdict',
    delay: 3000
  }
];

// ============================================
// COMPONENT
// ============================================
interface Props {
  moduleColor?: string;
  onComplete?: (score: number) => void;
}

export default function AuditSimulationGame({ moduleColor = '#F97316', onComplete }: Props) {
  // === STATE ===
  const [gamePhase, setGamePhase] = useState<'intro' | 'prep' | 'audit' | 'verdict'>('intro');
  const [currentNodeId, setCurrentNodeId] = useState<string>('start');
  const [stats, setStats] = useState<PlayerStats>({ trust: 50, stress: 20, evidence: 30, time: 7200 });
  const [documents, setDocuments] = useState<Document[]>(INITIAL_DOCUMENTS);
  const [selectedDocs, setSelectedDocs] = useState<string[]>([]);
  const [auditorState, setAuditorState] = useState<AuditorState>({ mood: 'neutral', message: '', isTyping: false, isSpeaking: false });
  const [dialogHistory, setDialogHistory] = useState<Array<{ speaker: string; text: string; mood?: string }>>([]);
  const [showEvent, setShowEvent] = useState<RandomEvent | null>(null);
  const [eventOutcome, setEventOutcome] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showDocPanel, setShowDocPanel] = useState(false);
  const [prepTime, setPrepTime] = useState(300); // 5 min de préparation
  const [usedEvents, setUsedEvents] = useState<string[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const currentNode = AUDIT_SCENARIO.find(n => n.id === currentNodeId);

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
        setStats(s => ({ ...s, time: s.time - 1 }));
        // Random events
        if (Math.random() < 0.003 && usedEvents.length < 3) {
          triggerRandomEvent();
        }
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [gamePhase, stats.time, showEvent, usedEvents]);

  // === SCROLL TO BOTTOM ===
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [dialogHistory, auditorState.isTyping]);

  // === PROCESS NODE ===
  useEffect(() => {
    if (!currentNode || gamePhase !== 'audit') return;

    // Apply effects
    if (currentNode.effect) {
      setStats(s => ({
        ...s,
        trust: Math.max(0, Math.min(100, s.trust + (currentNode.effect?.trust || 0))),
        stress: Math.max(0, Math.min(100, s.stress + (currentNode.effect?.stress || 0))),
        evidence: Math.max(0, Math.min(100, s.evidence + (currentNode.effect?.evidence || 0))),
        time: s.time + (currentNode.effect?.time || 0)
      }));
    }

    if (currentNode.speaker === 'auditor') {
      setAuditorState(s => ({ ...s, isTyping: true, mood: currentNode.mood || 'neutral' }));
      setTimeout(() => {
        setAuditorState(s => ({ ...s, isTyping: false, isSpeaking: true }));
        setDialogHistory(h => [...h, { speaker: 'auditor', text: currentNode.text, mood: currentNode.mood }]);
        setTimeout(() => setAuditorState(s => ({ ...s, isSpeaking: false })), 2000);
      }, 1500 + Math.random() * 1000);
    } else if (currentNode.speaker === 'system') {
      setDialogHistory(h => [...h, { speaker: 'system', text: currentNode.text }]);
    }

    if (currentNode.autoNext) {
      setTimeout(() => setCurrentNodeId(currentNode.autoNext!), currentNode.delay || 2000);
    }

    if (currentNode.id === 'verdict') {
      setTimeout(() => setGamePhase('verdict'), 1000);
    }
  }, [currentNodeId, gamePhase]);

  // === HANDLERS ===
  const triggerRandomEvent = () => {
    const available = RANDOM_EVENTS.filter(e => !usedEvents.includes(e.id));
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
      time: s.time + (choice.effect.time || 0)
    }));
    setEventOutcome(choice.outcome);
    setTimeout(() => {
      setShowEvent(null);
      setEventOutcome(null);
    }, 2500);
  };

  const handleChoice = (choice: DialogChoice) => {
    if (isProcessing) return;
    
    // Check document requirement
    if (choice.requiresDocument && !selectedDocs.includes(choice.requiresDocument)) {
      const doc = documents.find(d => d.id === choice.requiresDocument);
      if (doc && !doc.isReady) {
        setStats(s => ({ ...s, stress: Math.min(100, s.stress + 15), trust: Math.max(0, s.trust - 10) }));
        setDialogHistory(h => [...h, { speaker: 'system', text: `⚠️ Vous n'avez pas préparé : ${doc.name}` }]);
      }
    }

    setIsProcessing(true);
    setDialogHistory(h => [...h, { speaker: 'player', text: choice.text }]);
    
    // Apply effects
    setStats(s => ({
      ...s,
      trust: Math.max(0, Math.min(100, s.trust + (choice.effect.trust || 0))),
      stress: Math.max(0, Math.min(100, s.stress + (choice.effect.stress || 0))),
      evidence: Math.max(0, Math.min(100, s.evidence + (choice.effect.evidence || 0)))
    }));

    setTimeout(() => {
      setCurrentNodeId(choice.nextNode);
      setIsProcessing(false);
    }, 1000);
  };

  const toggleDocument = (docId: string) => {
    const doc = documents.find(d => d.id === docId);
    if (!doc) return;
    
    if (selectedDocs.includes(docId)) {
      setSelectedDocs(s => s.filter(d => d !== docId));
    } else {
      if (!doc.isReady) {
        // Préparer le document (coûte du temps)
        setPrepTime(t => Math.max(0, t - 30));
        setDocuments(docs => docs.map(d => 
          d.id === docId ? { ...d, isReady: true, quality: 50 + Math.floor(Math.random() * 30) } : d
        ));
      }
      setSelectedDocs(s => [...s, docId]);
    }
  };

  const startPreparation = () => {
    setGamePhase('prep');
  };

  const startAudit = () => {
    setGamePhase('audit');
    setCurrentNodeId('start');
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) return `${h}h${m.toString().padStart(2, '0')}`;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const getScoreGrade = () => {
    const score = (stats.trust + stats.evidence) / 2;
    if (score >= 80) return { grade: 'A', label: 'Excellent', color: '#22C55E', emoji: '🏆' };
    if (score >= 65) return { grade: 'B', label: 'Satisfaisant', color: '#84CC16', emoji: '✅' };
    if (score >= 50) return { grade: 'C', label: 'Acceptable', color: '#EAB308', emoji: '⚠️' };
    if (score >= 35) return { grade: 'D', label: 'Insuffisant', color: '#F97316', emoji: '❌' };
    return { grade: 'F', label: 'Critique', color: '#EF4444', emoji: '🚨' };
  };

  const getMoodEmoji = (mood?: string) => {
    switch (mood) {
      case 'friendly': return '😊';
      case 'pleased': return '🙂';
      case 'neutral': return '😐';
      case 'concerned': return '🤨';
      case 'impatient': return '😤';
      case 'serious': return '😑';
      case 'angry': return '😠';
      default: return '👩‍💼';
    }
  };

  // === RENDER ===

  // INTRO SCREEN
  if (gamePhase === 'intro') {
    return (
      <div className="space-y-4">
        {/* Header */}
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
            <span className="text-4xl">🎯</span>
          </div>
          <h2 className="text-2xl font-bold mb-2">Simulation d'Audit AI Act</h2>
          <p className="text-white/60 text-sm">Une expérience immersive de contrôle de conformité</p>
        </div>

        {/* Briefing card */}
        <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/30 rounded-xl p-4">
          <h3 className="font-bold mb-3 flex items-center gap-2">
            <span>📋</span> Votre mission
          </h3>
          <p className="text-white/80 text-sm mb-3">
            Vous êtes <strong>Responsable Conformité IA</strong>. La Commission Nationale de l'IA 
            débarque pour un contrôle inopiné. Vous avez <strong>5 minutes</strong> pour vous préparer, 
            puis l'audit commence.
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-white/5 rounded-lg p-2">
              <span className="text-orange-400">🎭</span> Dialogue dynamique
            </div>
            <div className="bg-white/5 rounded-lg p-2">
              <span className="text-orange-400">📊</span> Jauges en temps réel
            </div>
            <div className="bg-white/5 rounded-lg p-2">
              <span className="text-orange-400">📁</span> Documents à présenter
            </div>
            <div className="bg-white/5 rounded-lg p-2">
              <span className="text-orange-400">⚡</span> Événements surprises
            </div>
          </div>
        </div>

        {/* Auditor preview */}
        <div className="bg-white/5 rounded-xl p-4 flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-slate-600 to-slate-800 flex items-center justify-center text-3xl">
            👩‍💼
          </div>
          <div>
            <h4 className="font-bold">Marie Durand</h4>
            <p className="text-white/60 text-sm">Auditrice Senior</p>
            <p className="text-white/40 text-xs">Commission Nationale de l'IA</p>
          </div>
        </div>

        {/* Stats preview */}
        <div className="grid grid-cols-4 gap-2 text-center text-xs">
          <div className="bg-white/5 rounded-lg p-2">
            <div className="text-lg mb-1">💚</div>
            <div className="text-white/60">Confiance</div>
          </div>
          <div className="bg-white/5 rounded-lg p-2">
            <div className="text-lg mb-1">😰</div>
            <div className="text-white/60">Stress</div>
          </div>
          <div className="bg-white/5 rounded-lg p-2">
            <div className="text-lg mb-1">📋</div>
            <div className="text-white/60">Preuves</div>
          </div>
          <div className="bg-white/5 rounded-lg p-2">
            <div className="text-lg mb-1">⏱️</div>
            <div className="text-white/60">Temps</div>
          </div>
        </div>

        <button
          onClick={startPreparation}
          className="w-full py-4 rounded-xl font-bold text-lg text-black flex items-center justify-center gap-2"
          style={{ backgroundColor: moduleColor }}
        >
          <span>🚀</span> Commencer
        </button>
      </div>
    );
  }

  // PREPARATION PHASE
  if (gamePhase === 'prep') {
    return (
      <div className="space-y-4">
        {/* Timer */}
        <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold flex items-center gap-2">
              <span>⏱️</span> Temps de préparation
            </h3>
            <span className={`font-mono text-2xl font-bold ${prepTime < 60 ? 'text-red-400 animate-pulse' : 'text-orange-400'}`}>
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
            Sélectionnez les documents à préparer. Les documents non préparés vous feront perdre des points !
          </p>
        </div>

        {/* Documents grid */}
        <div className="space-y-2">
          <h3 className="font-semibold text-sm flex items-center justify-between">
            <span>📁 Documents disponibles</span>
            <span className="text-white/40">{selectedDocs.length} sélectionné(s)</span>
          </h3>
          <div className="grid grid-cols-2 gap-2 max-h-[300px] overflow-y-auto">
            {documents.map(doc => (
              <button
                key={doc.id}
                onClick={() => toggleDocument(doc.id)}
                className={`p-3 rounded-xl text-left transition-all ${
                  selectedDocs.includes(doc.id)
                    ? 'bg-green-500/20 border-2 border-green-500'
                    : doc.isReady
                      ? 'bg-white/5 border-2 border-transparent hover:bg-white/10'
                      : 'bg-red-500/10 border-2 border-red-500/30 hover:bg-red-500/20'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">{doc.icon}</span>
                  <span className="text-xs font-medium truncate">{doc.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className={`text-xs ${doc.isReady ? 'text-green-400' : 'text-red-400'}`}>
                    {doc.isReady ? '✓ Prêt' : '⚠️ À préparer'}
                  </span>
                  {doc.isReady && (
                    <span className="text-xs text-white/40">
                      Qualité: {doc.quality}%
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={startAudit}
          className="w-full py-3 rounded-xl font-bold text-black"
          style={{ backgroundColor: moduleColor }}
        >
          {prepTime > 0 ? "Passer à l'audit →" : "L'auditrice arrive !"}
        </button>
      </div>
    );
  }

  // VERDICT
  if (gamePhase === 'verdict') {
    const result = getScoreGrade();
    const finalScore = Math.round((stats.trust + stats.evidence) / 2);

    return (
      <div className="space-y-4">
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
          <p className="text-white/60">Commission Nationale de l'IA</p>
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
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/5 rounded-xl p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm">Confiance</span>
              <span className="font-bold" style={{ color: stats.trust >= 60 ? '#22C55E' : stats.trust >= 40 ? '#EAB308' : '#EF4444' }}>
                {stats.trust}%
              </span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-green-500 rounded-full" style={{ width: `${stats.trust}%` }} />
            </div>
          </div>
          <div className="bg-white/5 rounded-xl p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm">Preuves</span>
              <span className="font-bold" style={{ color: stats.evidence >= 60 ? '#22C55E' : stats.evidence >= 40 ? '#EAB308' : '#EF4444' }}>
                {stats.evidence}%
              </span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full" style={{ width: `${stats.evidence}%` }} />
            </div>
          </div>
        </div>

        {/* Verdict text */}
        <div className={`rounded-xl p-4 border ${
          finalScore >= 65 ? 'bg-green-500/10 border-green-500/30' : 
          finalScore >= 50 ? 'bg-yellow-500/10 border-yellow-500/30' : 
          'bg-red-500/10 border-red-500/30'
        }`}>
          <h3 className="font-bold mb-2">
            {finalScore >= 65 ? '✅ Conformité validée' : 
             finalScore >= 50 ? '⚠️ Conformité partielle' : 
             '❌ Non-conformité majeure'}
          </h3>
          <p className="text-white/70 text-sm">
            {finalScore >= 65 
              ? "Votre organisation démontre une maîtrise satisfaisante des exigences de l'AI Act. Continuez vos efforts de conformité."
              : finalScore >= 50 
                ? "Des lacunes ont été identifiées. Un plan d'action corrective doit être soumis sous 90 jours."
                : "Des non-conformités critiques nécessitent une action immédiate. Risque de sanctions administratives."}
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={() => {
              const report = `RAPPORT D'AUDIT AI ACT\n${'='.repeat(40)}\nDate: ${new Date().toLocaleDateString('fr-FR')}\nGrade: ${result.grade} - ${result.label}\nScore: ${finalScore}/100\n\nDétails:\n- Confiance auditrice: ${stats.trust}%\n- Preuves conformité: ${stats.evidence}%\n- Niveau de stress: ${stats.stress}%`;
              const blob = new Blob([report], { type: 'text/plain' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'rapport-audit-ia.txt';
              a.click();
            }}
            className="flex-1 py-3 rounded-xl bg-white/10 hover:bg-white/20 font-semibold text-sm"
          >
            📄 Télécharger
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
    <div className="flex flex-col h-full min-h-[600px]">
      {/* TOP BAR - Stats */}
      <div className="flex-shrink-0 mb-3">
        <div className="grid grid-cols-4 gap-2">
          {/* Trust */}
          <div className="bg-white/5 rounded-lg p-2">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs">💚 Confiance</span>
              <span className={`text-xs font-bold ${stats.trust >= 60 ? 'text-green-400' : stats.trust >= 40 ? 'text-yellow-400' : 'text-red-400'}`}>
                {stats.trust}%
              </span>
            </div>
            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className={`h-full rounded-full ${stats.trust >= 60 ? 'bg-green-500' : stats.trust >= 40 ? 'bg-yellow-500' : 'bg-red-500'}`}
                animate={{ width: `${stats.trust}%` }}
              />
            </div>
          </div>

          {/* Stress */}
          <div className="bg-white/5 rounded-lg p-2">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs">😰 Stress</span>
              <span className={`text-xs font-bold ${stats.stress <= 40 ? 'text-green-400' : stats.stress <= 70 ? 'text-yellow-400' : 'text-red-400'}`}>
                {stats.stress}%
              </span>
            </div>
            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className={`h-full rounded-full ${stats.stress <= 40 ? 'bg-green-500' : stats.stress <= 70 ? 'bg-yellow-500' : 'bg-red-500'}`}
                animate={{ width: `${stats.stress}%` }}
              />
            </div>
          </div>

          {/* Evidence */}
          <div className="bg-white/5 rounded-lg p-2">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs">📋 Preuves</span>
              <span className={`text-xs font-bold ${stats.evidence >= 60 ? 'text-green-400' : stats.evidence >= 40 ? 'text-yellow-400' : 'text-red-400'}`}>
                {stats.evidence}%
              </span>
            </div>
            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-blue-500"
                animate={{ width: `${stats.evidence}%` }}
              />
            </div>
          </div>

          {/* Time */}
          <div className="bg-white/5 rounded-lg p-2">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs">⏱️ Temps</span>
              <span className="text-xs font-bold font-mono">{formatTime(stats.time)}</span>
            </div>
            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-purple-500"
                animate={{ width: `${(stats.time / 7200) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex gap-3 min-h-0">
        {/* CHAT AREA */}
        <div className="flex-1 flex flex-col bg-white/5 rounded-xl overflow-hidden">
          {/* Auditor header */}
          <div className="flex-shrink-0 p-3 border-b border-white/10 flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-600 to-slate-800 flex items-center justify-center text-xl">
                {getMoodEmoji(auditorState.mood)}
              </div>
              {auditorState.isSpeaking && (
                <motion.div
                  className="absolute -right-1 -bottom-1 w-4 h-4 bg-green-500 rounded-full"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                />
              )}
            </div>
            <div>
              <h4 className="font-semibold text-sm">Marie Durand</h4>
              <p className="text-white/40 text-xs">
                {auditorState.mood === 'friendly' && "Bien disposée"}
                {auditorState.mood === 'neutral' && "Professionnelle"}
                {auditorState.mood === 'impatient' && "Impatiente..."}
                {auditorState.mood === 'concerned' && "Préoccupée"}
                {auditorState.mood === 'serious' && "Sérieuse"}
                {auditorState.mood === 'angry' && "Mécontente !"}
                {auditorState.mood === 'pleased' && "Satisfaite"}
              </p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {dialogHistory.map((msg, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.speaker === 'player' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.speaker === 'system' ? (
                  <div className="w-full text-center text-white/40 text-xs italic py-2">
                    {msg.text}
                  </div>
                ) : msg.speaker === 'auditor' ? (
                  <div className="flex gap-2 max-w-[85%]">
                    <div className="text-lg flex-shrink-0">{getMoodEmoji(msg.mood)}</div>
                    <div className="bg-white/10 rounded-2xl rounded-tl-none p-3">
                      <p className="text-sm">{msg.text}</p>
                    </div>
                  </div>
                ) : (
                  <div className="bg-blue-500/20 rounded-2xl rounded-tr-none p-3 max-w-[85%]">
                    <p className="text-sm">{msg.text}</p>
                  </div>
                )}
              </motion.div>
            ))}

            {/* Typing indicator */}
            {auditorState.isTyping && (
              <div className="flex gap-2">
                <div className="text-lg">👩‍💼</div>
                <div className="bg-white/10 rounded-2xl rounded-tl-none px-4 py-3">
                  <div className="flex gap-1">
                    <motion.span
                      className="w-2 h-2 bg-white/40 rounded-full"
                      animate={{ y: [0, -5, 0] }}
                      transition={{ repeat: Infinity, duration: 0.6, delay: 0 }}
                    />
                    <motion.span
                      className="w-2 h-2 bg-white/40 rounded-full"
                      animate={{ y: [0, -5, 0] }}
                      transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }}
                    />
                    <motion.span
                      className="w-2 h-2 bg-white/40 rounded-full"
                      animate={{ y: [0, -5, 0] }}
                      transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }}
                    />
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Choices */}
          {currentNode?.choices && !auditorState.isTyping && !isProcessing && (
            <div className="flex-shrink-0 p-3 border-t border-white/10 space-y-2 max-h-[200px] overflow-y-auto">
              {currentNode.choices.map((choice) => (
                <button
                  key={choice.id}
                  onClick={() => handleChoice(choice)}
                  className={`w-full p-3 rounded-xl text-left text-sm transition-all ${
                    choice.isOptimal 
                      ? 'bg-green-500/10 border border-green-500/30 hover:bg-green-500/20' 
                      : choice.isRisky
                        ? 'bg-red-500/10 border border-red-500/30 hover:bg-red-500/20'
                        : 'bg-white/5 hover:bg-white/10'
                  }`}
                >
                  <div className="font-medium">{choice.shortText || choice.text.substring(0, 50) + '...'}</div>
                  {choice.requiresDocument && (
                    <div className="text-xs text-white/40 mt-1">
                      📎 Nécessite: {documents.find(d => d.id === choice.requiresDocument)?.name}
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* DOCUMENT PANEL (Desktop) */}
        <div className="hidden lg:block w-48 bg-white/5 rounded-xl p-2 overflow-y-auto">
          <h4 className="text-xs font-semibold mb-2 text-white/60">📁 Documents prêts</h4>
          <div className="space-y-1">
            {documents.filter(d => d.isReady && selectedDocs.includes(d.id)).map(doc => (
              <div key={doc.id} className="text-xs bg-white/5 rounded-lg p-2">
                <span className="mr-1">{doc.icon}</span>
                {doc.name.substring(0, 20)}...
              </div>
            ))}
          </div>
        </div>
      </div>

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
              exit={{ scale: 0.9, y: 20 }}
              className="bg-[#1a1a2e] border border-yellow-500/50 rounded-2xl p-4 max-w-md w-full"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center text-2xl">
                  {showEvent.icon}
                </div>
                <div>
                  <h3 className="font-bold text-yellow-400">{showEvent.title}</h3>
                  <p className="text-white/40 text-xs">Événement imprévu !</p>
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
                      className="w-full p-3 rounded-xl bg-white/5 hover:bg-white/10 text-left text-sm"
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
