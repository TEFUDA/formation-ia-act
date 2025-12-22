'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useParams } from 'next/navigation';

// Icons
const Icons = {
  ArrowLeft: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>,
  ArrowRight: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
  Check: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-full h-full"><polyline points="20 6 9 17 4 12"/></svg>,
  Download: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
  Lightbulb: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><path d="M9 18h6M10 22h4M12 2v1M12 6a4 4 0 0 0-4 4c0 2.5 2 4 2 6h4c0-2 2-3.5 2-6a4 4 0 0 0-4-4z"/></svg>,
  AlertTriangle: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  Info: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>,
};

// ============================================
// EXACT DOCUMENT STRUCTURES FROM REAL TEMPLATES
// ============================================

// REGISTRE IA - Structure exacte du fichier Excel
const registreIAStructure = {
  sheets: [
    {
      name: "Registre IA",
      description: "Inventaire de tous les systèmes IA",
      columns: [
        { letter: "A", name: "ID", example: "SYS-001", description: "Identifiant unique du système (format: SYS-XXX)", required: true },
        { letter: "B", name: "Nom du système", example: "Microsoft Copilot", description: "Nom commercial ou appellation interne du système IA", required: true },
        { letter: "C", name: "Éditeur/Fournisseur", example: "Microsoft Corporation", description: "Société éditrice ou fournisseur du système", required: true },
        { letter: "D", name: "Version", example: "M365 Enterprise", description: "Version ou édition du système déployé", required: true },
        { letter: "E", name: "Date déploiement", example: "15/01/2025", description: "Date de mise en service dans votre organisation", required: true },
        { letter: "F", name: "Département", example: "Direction, Marketing, RH", description: "Service(s) utilisant le système", required: true },
        { letter: "G", name: "Responsable", example: "Marie Martin - DSI", description: "Nom et fonction du responsable métier", required: true },
        { letter: "H", name: "Finalité/Usage", example: "Assistant rédaction, analyse documents, synthèses", description: "À quoi sert concrètement le système", required: true },
        { letter: "I", name: "Données traitées", example: "Documents internes, emails, données clients", description: "Types de données manipulées par le système", required: true },
        { letter: "J", name: "Niveau risque AI Act", example: "Risque limité", description: "Classification: Inacceptable / Élevé / Limité / Minimal", required: true },
        { letter: "K", name: "Base légale RGPD", example: "Intérêt légitime + consentement", description: "Fondement juridique du traitement de données", required: true },
        { letter: "L", name: "Supervision humaine", example: "Oui", description: "Un humain supervise-t-il les décisions du système?", required: true },
        { letter: "M", name: "Documentation technique", example: "Disponible (DPA Microsoft)", description: "Documentation technique disponible ou à obtenir", required: false },
        { letter: "N", name: "Date dernier audit", example: "10/03/2025", description: "Dernière évaluation de conformité", required: false },
        { letter: "O", name: "Conformité AI Act", example: "Conforme", description: "Statut: Conforme / En cours / Non conforme / N/A", required: true },
        { letter: "P", name: "Actions correctives", example: "Formation utilisateurs complétée", description: "Actions en cours ou réalisées", required: false },
        { letter: "Q", name: "Prochaine révision", example: "10/03/2026", description: "Date de la prochaine évaluation prévue", required: true },
      ]
    },
    {
      name: "Statistiques",
      description: "Tableau de bord synthétique",
      columns: [
        { letter: "A", name: "Indicateur", example: "Nombre total systèmes", description: "Métrique mesurée", required: true },
        { letter: "B", name: "Valeur", example: "12", description: "Valeur actuelle de l'indicateur", required: true },
        { letter: "C", name: "Objectif", example: "100%", description: "Cible à atteindre", required: false },
      ]
    },
    {
      name: "Mode d'emploi",
      description: "Instructions d'utilisation du registre",
      columns: []
    }
  ]
};

// POLITIQUE IA - Structure exacte du document Word
const politiqueIAStructure = {
  title: "Politique d'Utilisation de l'Intelligence Artificielle",
  subtitle: "[NOM DE L'ENTREPRISE]",
  articles: [
    {
      number: "1",
      title: "Objet et champ d'application",
      content: "La présente politique définit les règles d'utilisation des systèmes d'Intelligence Artificielle au sein de [NOM DE L'ENTREPRISE]. Elle s'applique à l'ensemble des collaborateurs, prestataires et partenaires ayant accès aux outils IA.",
      lists: [],
      fillFields: ["[NOM DE L'ENTREPRISE]"]
    },
    {
      number: "2",
      title: "Principes directeurs",
      content: "L'utilisation de l'IA repose sur les principes suivants :",
      lists: [
        "Transparence : informer les parties prenantes de l'utilisation de l'IA",
        "Responsabilité : maintenir un contrôle humain sur les décisions",
        "Équité : prévenir les discriminations et biais algorithmiques",
        "Sécurité : protéger les données et la confidentialité",
        "Conformité : respecter le cadre légal (AI Act, RGPD)"
      ],
      fillFields: []
    },
    {
      number: "3",
      title: "Gouvernance",
      content: "Un Référent IA est désigné au sein de la Direction. Il est responsable de :",
      lists: [
        "La mise à jour du registre des systèmes IA",
        "La coordination des évaluations de conformité",
        "La formation des collaborateurs",
        "Le reporting à la Direction"
      ],
      fillFields: []
    },
    {
      number: "4",
      title: "Acquisition et déploiement",
      content: "Tout nouveau système IA doit faire l'objet d'une évaluation préalable incluant :",
      lists: [
        "Classification du niveau de risque AI Act",
        "Analyse d'impact sur les droits fondamentaux",
        "Vérification de la documentation technique",
        "Validation par le Référent IA"
      ],
      fillFields: []
    },
    {
      number: "5",
      title: "Utilisation au quotidien",
      content: "Les collaborateurs s'engagent à :",
      lists: [
        "Utiliser les outils IA uniquement pour des usages professionnels",
        "Ne pas saisir de données confidentielles dans des IA non approuvées",
        "Vérifier les résultats produits par l'IA avant diffusion",
        "Signaler tout dysfonctionnement ou résultat discriminatoire"
      ],
      fillFields: []
    },
    {
      number: "6",
      title: "Formation",
      content: "Conformément à l'article 4 de l'AI Act, tous les collaborateurs utilisant des systèmes IA bénéficient d'une formation adaptée à leur niveau d'utilisation.",
      lists: [],
      fillFields: []
    },
    {
      number: "7",
      title: "Sanctions",
      content: "Le non-respect de la présente politique peut entraîner des sanctions disciplinaires conformément au règlement intérieur de l'entreprise.",
      lists: [],
      fillFields: []
    }
  ],
  signature: {
    dateField: "Date d'entrée en vigueur : ___/___/______",
    signatureField: "Signature Direction : _______________________"
  }
};

// DOCUMENTATION TECHNIQUE - Structure exacte
const documentationTechniqueStructure = {
  title: "Template Documentation Technique",
  subtitle: "Système IA à Haut Risque - Annexe IV AI Act",
  intro: "Ce template liste les éléments de documentation technique exigés par l'AI Act pour les systèmes à haut risque.",
  sections: [
    {
      number: "1",
      title: "DESCRIPTION GÉNÉRALE DU SYSTÈME",
      content: "Description complète du système IA, son usage prévu, et ses caractéristiques principales.",
      subsections: [
        "1.1 Nom et identification du système",
        "1.2 Usage prévu et public cible",
        "1.3 Catégorie de risque AI Act",
        "1.4 Fonctionnalités principales"
      ],
      fields: ["Nom système", "Version", "Date mise sur marché", "Fournisseur"]
    },
    {
      number: "2",
      title: "ÉLÉMENTS CONSTITUTIFS",
      content: "Architecture technique et composants du système.",
      subsections: [
        "2.1 Architecture générale",
        "2.2 Algorithmes et modèles utilisés",
        "2.3 Logiciels et dépendances",
        "2.4 Matériel requis"
      ],
      fields: []
    },
    {
      number: "3",
      title: "DONNÉES D'ENTRAÎNEMENT",
      content: "Informations sur les données utilisées pour développer le système.",
      subsections: [
        "3.1 Sources des données",
        "3.2 Volume et caractéristiques",
        "3.3 Préparation et nettoyage",
        "3.4 Analyse des biais potentiels"
      ],
      fields: []
    },
    {
      number: "4",
      title: "PERFORMANCE ET LIMITES",
      content: "Métriques de performance et limitations connues.",
      subsections: [
        "4.1 Métriques de performance",
        "4.2 Conditions d'utilisation optimales",
        "4.3 Limites et cas d'échec connus",
        "4.4 Robustesse et fiabilité"
      ],
      fields: []
    },
    {
      number: "5",
      title: "MESURES DE GESTION DES RISQUES",
      content: "Mesures mises en place pour gérer les risques identifiés.",
      subsections: [
        "5.1 Risques identifiés",
        "5.2 Mesures d'atténuation",
        "5.3 Tests de conformité",
        "5.4 Plan de surveillance post-marché"
      ],
      fields: []
    },
    {
      number: "6",
      title: "SUPERVISION HUMAINE",
      content: "Mécanismes permettant la supervision humaine du système.",
      subsections: [
        "6.1 Points de contrôle humain",
        "6.2 Interfaces de supervision",
        "6.3 Procédures d'intervention",
        "6.4 Formation des opérateurs"
      ],
      fields: []
    },
    {
      number: "7",
      title: "JOURNALISATION ET TRAÇABILITÉ",
      content: "Capacités de logging et traçabilité des décisions.",
      subsections: [
        "7.1 Données journalisées",
        "7.2 Durée de conservation",
        "7.3 Accès aux logs",
        "7.4 Format et interopérabilité"
      ],
      fields: []
    }
  ]
};

// FRIA - Structure exacte
const friaStructure = {
  title: "Évaluation d'Impact sur les Droits Fondamentaux (FRIA)",
  subtitle: "Fundamental Rights Impact Assessment - Article 27 AI Act",
  sections: [
    {
      number: "1",
      title: "IDENTIFICATION",
      subsections: ["Nom du système", "Fournisseur", "Version", "Date évaluation", "Évaluateur"],
      description: "Identifiez précisément le système IA évalué"
    },
    {
      number: "2",
      title: "CONTEXTE D'UTILISATION",
      subsections: ["Objectif du déploiement", "Catégories de personnes concernées", "Volume de personnes impactées", "Secteur d'activité"],
      description: "Décrivez le contexte de déploiement"
    },
    {
      number: "3",
      title: "PROCESSUS ET DÉCISIONS",
      subsections: ["Processus dans lequel s'inscrit l'IA", "Décisions influencées par le système", "Degré d'automatisation", "Possibilité de recours humain"],
      description: "Détaillez les processus et décisions impliqués"
    },
    {
      number: "4",
      title: "ANALYSE DES DROITS FONDAMENTAUX",
      subsections: [
        "Droit à la dignité humaine",
        "Droit à la vie privée",
        "Protection des données personnelles",
        "Non-discrimination",
        "Égalité de traitement",
        "Droits des travailleurs",
        "Droits des consommateurs",
        "Droit à un recours effectif"
      ],
      description: "Pour chaque droit: Impact potentiel (Oui/Non), Gravité (1-4), Mesures d'atténuation"
    },
    {
      number: "5",
      title: "ÉVALUATION GLOBALE DES RISQUES",
      subsections: ["Synthèse des risques", "Score de risque global", "Acceptabilité du risque"],
      description: "Synthétisez l'évaluation globale"
    },
    {
      number: "6",
      title: "MESURES D'ATTÉNUATION",
      subsections: ["Mesures techniques", "Mesures organisationnelles", "Mesures de contrôle", "Plan de mise en œuvre"],
      description: "Décrivez les mesures pour réduire les risques"
    },
    {
      number: "7",
      title: "CONCLUSION ET VALIDATION",
      subsections: ["Avis du DPO", "Avis du Référent IA", "Décision de déploiement", "Conditions et restrictions"],
      description: "Formalisez la décision finale"
    }
  ]
};

// REGISTRE INCIDENTS - Structure
const registreIncidentsStructure = {
  sheets: [
    {
      name: "Incidents IA",
      description: "Journal des incidents",
      columns: [
        { letter: "A", name: "N° Incident", example: "INC-2025-001", description: "Numéro unique de l'incident", required: true },
        { letter: "B", name: "Date/Heure", example: "15/03/2025 14:32", description: "Date et heure de l'incident", required: true },
        { letter: "C", name: "Système concerné", example: "SYS-001", description: "ID du système (réf. registre)", required: true },
        { letter: "D", name: "Type incident", example: "Biais discriminatoire", description: "Catégorie: Biais / Erreur / Sécurité / Performance / Autre", required: true },
        { letter: "E", name: "Description", example: "Le système a refusé 70% des candidatures féminines", description: "Description détaillée de l'incident", required: true },
        { letter: "F", name: "Gravité", example: "Majeur", description: "Mineur / Modéré / Majeur / Critique", required: true },
        { letter: "G", name: "Impact", example: "23 candidatures concernées", description: "Personnes/processus impactés", required: true },
        { letter: "H", name: "Signalé par", example: "Marie Dupont - RH", description: "Personne ayant signalé l'incident", required: true },
        { letter: "I", name: "Actions immédiates", example: "Suspension système, revue manuelle", description: "Mesures prises en urgence", required: true },
        { letter: "J", name: "Statut", example: "En cours", description: "Ouvert / En cours / Résolu / Clos", required: true },
        { letter: "K", name: "Responsable traitement", example: "Pierre Martin - DSI", description: "Personne en charge de la résolution", required: true },
        { letter: "L", name: "Cause racine", example: "Biais dans données entraînement", description: "Analyse de la cause profonde", required: false },
        { letter: "M", name: "Actions correctives", example: "Rééquilibrage dataset", description: "Corrections durables mises en place", required: false },
        { letter: "N", name: "Notification autorité", example: "CNIL notifiée le 16/03", description: "Notification requise? Si oui, quand?", required: true },
        { letter: "O", name: "Date clôture", example: "20/03/2025", description: "Date de clôture de l'incident", required: false },
      ]
    }
  ]
};

// CHECKLIST CONFORMITÉ - Structure
const checklistStructure = {
  sheets: [
    {
      name: "Checklist conformité",
      description: "Vérification article par article",
      columns: [
        { letter: "A", name: "Réf. Article", example: "Art. 4", description: "Article de l'AI Act", required: true },
        { letter: "B", name: "Obligation", example: "Maîtrise de l'IA - Formation", description: "Description de l'obligation", required: true },
        { letter: "C", name: "Applicable", example: "Oui", description: "Cette obligation vous concerne-t-elle?", required: true },
        { letter: "D", name: "Statut", example: "Conforme", description: "Conforme / En cours / Non conforme / N/A", required: true },
        { letter: "E", name: "Preuves", example: "Attestations de formation", description: "Documents justificatifs disponibles", required: false },
        { letter: "F", name: "Actions requises", example: "Former 5 collaborateurs", description: "Ce qui reste à faire", required: false },
        { letter: "G", name: "Responsable", example: "Marie Dupont - RH", description: "Personne en charge", required: false },
        { letter: "H", name: "Échéance", example: "30/06/2025", description: "Date cible de mise en conformité", required: false },
      ]
    }
  ]
};

// ============================================
// TUTORIALS DATA WITH EXACT STRUCTURES
// ============================================

interface TutorialData {
  id: number;
  name: string;
  type: 'Excel' | 'Word';
  icon: string;
  file: string;
  description: string;
  duration: string;
  objectives: string[];
  excelData?: typeof registreIAStructure;
  wordData?: typeof politiqueIAStructure;
  docTechData?: typeof documentationTechniqueStructure;
  friaData?: typeof friaStructure;
  steps: { title: string; description: string; focusOn?: string; tips?: string[]; warning?: string }[];
}

const tutorialsData: Record<string, TutorialData> = {
  '1': {
    id: 1, name: "Registre des Systèmes IA", type: "Excel", icon: "📊", file: "template-registre-ia.xlsx",
    description: "Le registre IA recense exhaustivement tous vos systèmes d'intelligence artificielle.",
    duration: "15 min",
    objectives: ["Comprendre chaque colonne du registre", "Savoir remplir correctement les informations", "Classifier les systèmes par niveau de risque"],
    excelData: registreIAStructure,
    steps: [
      { title: "Structure du fichier", description: "Le registre comprend 3 onglets: 'Registre IA' (principal), 'Statistiques' (tableau de bord), et 'Mode d'emploi'.", tips: ["Commencez toujours par lire le 'Mode d'emploi'"] },
      { title: "Colonnes A à D - Identification", description: "Identifiez chaque système avec un ID unique, son nom, fournisseur et version.", focusOn: "A-D", tips: ["Format ID recommandé: SYS-001, SYS-002..."] },
      { title: "Colonnes E à G - Organisation", description: "Date de déploiement, département utilisateur et responsable métier.", focusOn: "E-G", warning: "Chaque système DOIT avoir un responsable nominatif" },
      { title: "Colonnes H à I - Usage", description: "Décrivez la finalité/usage et les données traitées.", focusOn: "H-I", tips: ["Soyez précis sur les types de données personnelles"] },
      { title: "Colonnes J à K - Classification", description: "Niveau de risque AI Act et base légale RGPD.", focusOn: "J-K", warning: "En cas de doute sur le risque, classifiez au niveau supérieur" },
      { title: "Colonnes L à Q - Conformité", description: "Supervision humaine, documentation, audits et conformité.", focusOn: "L-Q", tips: ["Planifiez les révisions à l'avance (colonne Q)"] }
    ]
  },
  '2': {
    id: 2, name: "Politique IA Entreprise", type: "Word", icon: "📄", file: "modele-politique-ia.docx",
    description: "Document officiel définissant les règles d'utilisation de l'IA dans votre organisation.",
    duration: "20 min",
    objectives: ["Comprendre chaque article de la politique", "Savoir personnaliser le document", "Communiquer efficacement la politique"],
    wordData: politiqueIAStructure,
    steps: [
      { title: "Vue d'ensemble", description: "La politique comprend 7 articles couvrant tous les aspects de l'utilisation de l'IA.", tips: ["Faites valider par la Direction avant diffusion"] },
      { title: "Article 1 - Objet", description: "Définit le périmètre: qui est concerné par cette politique.", focusOn: "1", tips: ["Remplacez [NOM DE L'ENTREPRISE] partout dans le document"] },
      { title: "Article 2 - Principes directeurs", description: "Les 5 principes fondamentaux: Transparence, Responsabilité, Équité, Sécurité, Conformité.", focusOn: "2" },
      { title: "Article 3 - Gouvernance", description: "Rôle et responsabilités du Référent IA.", focusOn: "3", warning: "Le Référent IA doit être formé (obligation Article 4 AI Act)" },
      { title: "Article 4 - Acquisition", description: "Processus de validation avant tout nouveau déploiement.", focusOn: "4" },
      { title: "Article 5 - Utilisation", description: "Règles quotidiennes pour les collaborateurs.", focusOn: "5", tips: ["Ces règles doivent être communiquées à tous"] },
      { title: "Articles 6-7 - Formation & Sanctions", description: "Obligation de formation et conséquences du non-respect.", focusOn: "6-7" }
    ]
  },
  '3': {
    id: 3, name: "FRIA - Analyse d'Impact", type: "Word", icon: "⚠️", file: "template-fria.docx",
    description: "Évaluation d'impact sur les droits fondamentaux, obligatoire pour les systèmes à haut risque.",
    duration: "25 min",
    objectives: ["Savoir quand un FRIA est obligatoire", "Évaluer l'impact sur chaque droit fondamental", "Documenter les mesures d'atténuation"],
    friaData: friaStructure,
    steps: [
      { title: "Qu'est-ce qu'un FRIA?", description: "Évaluation obligatoire (Article 27) avant déploiement de tout système IA à haut risque.", warning: "Sans FRIA validé, vous ne pouvez pas déployer légalement" },
      { title: "Section 1 - Identification", description: "Identifiez précisément le système, sa version, et l'évaluateur.", focusOn: "1", tips: ["Un FRIA = une version spécifique du système"] },
      { title: "Section 2-3 - Contexte", description: "Décrivez le contexte d'utilisation et les décisions impactées.", focusOn: "2-3" },
      { title: "Section 4 - Droits fondamentaux", description: "Analysez l'impact sur chaque droit: dignité, vie privée, non-discrimination...", focusOn: "4", warning: "Pour le recrutement, la non-discrimination est critique" },
      { title: "Section 5-6 - Risques et mesures", description: "Évaluez le risque global et définissez les mesures d'atténuation.", focusOn: "5-6" },
      { title: "Section 7 - Validation", description: "Obtenez les avis du DPO et du Référent IA, puis la décision du Comité.", focusOn: "7", tips: ["Conservez le FRIA pendant toute la durée d'utilisation + 10 ans"] }
    ]
  },
  '4': {
    id: 4, name: "Documentation Technique", type: "Word", icon: "📋", file: "template-documentation-technique.docx",
    description: "Documentation technique exigée par l'AI Act pour les systèmes à haut risque (Annexe IV).",
    duration: "20 min",
    objectives: ["Comprendre les 7 sections obligatoires", "Documenter architecture et données", "Tracer les tests et performances"],
    docTechData: documentationTechniqueStructure,
    steps: [
      { title: "Vue d'ensemble", description: "La documentation comprend 7 sections obligatoires selon l'Annexe IV de l'AI Act.", warning: "Doit pouvoir être fournie aux autorités sur demande" },
      { title: "Section 1 - Description générale", description: "Nom, usage prévu, catégorie de risque, fonctionnalités.", focusOn: "1" },
      { title: "Section 2 - Éléments constitutifs", description: "Architecture, algorithmes, logiciels et matériel.", focusOn: "2", tips: ["Incluez des schémas d'architecture"] },
      { title: "Section 3 - Données d'entraînement", description: "Sources, volume, préparation et analyse des biais.", focusOn: "3", warning: "La traçabilité des données est cruciale" },
      { title: "Section 4 - Performance", description: "Métriques, conditions optimales, limites et robustesse.", focusOn: "4" },
      { title: "Section 5-7 - Risques, supervision, logs", description: "Gestion des risques, supervision humaine et journalisation.", focusOn: "5-7" }
    ]
  },
  '10': {
    id: 10, name: "Registre des Incidents", type: "Excel", icon: "🚨", file: "registre-incidents-ia.xlsx",
    description: "Journal de tous les incidents et dysfonctionnements liés à vos systèmes IA.",
    duration: "12 min",
    objectives: ["Savoir ce qu'est un incident IA", "Enregistrer et classifier correctement", "Respecter les obligations de notification"],
    excelData: registreIncidentsStructure,
    steps: [
      { title: "Qu'est-ce qu'un incident IA?", description: "Tout dysfonctionnement, erreur, biais ou problème de sécurité lié à un système IA.", warning: "Certains incidents doivent être notifiés aux autorités (Article 62)" },
      { title: "Colonnes A à E - Identification", description: "Numéro, date, système concerné, type et description.", focusOn: "A-E", tips: ["Soyez précis dans la description"] },
      { title: "Colonnes F à I - Gravité et actions", description: "Gravité, impact, signalement et actions immédiates.", focusOn: "F-I" },
      { title: "Colonnes J à O - Traitement", description: "Statut, responsable, cause racine, actions correctives et clôture.", focusOn: "J-O" },
      { title: "Notification aux autorités", description: "La colonne N 'Notification autorité' est critique pour les incidents graves.", warning: "Délai de notification: 72h maximum pour incidents graves" }
    ]
  },
  '11': {
    id: 11, name: "Checklist Conformité", type: "Excel", icon: "✓", file: "checklist-conformite-ai-act.xlsx",
    description: "Vérifiez votre conformité à l'AI Act, article par article.",
    duration: "15 min",
    objectives: ["Vérifier chaque obligation applicable", "Identifier les lacunes", "Planifier les actions correctives"],
    excelData: checklistStructure,
    steps: [
      { title: "Structure de la checklist", description: "Chaque ligne correspond à une obligation de l'AI Act.", tips: ["Faites l'évaluation avec le Référent IA et le DPO"] },
      { title: "Colonnes A-B - Obligation", description: "Référence de l'article et description de l'obligation.", focusOn: "A-B" },
      { title: "Colonnes C-D - Évaluation", description: "L'obligation est-elle applicable? Quel est votre statut?", focusOn: "C-D", tips: ["Soyez honnête - c'est un outil interne"] },
      { title: "Colonnes E-H - Actions", description: "Preuves, actions requises, responsable et échéance.", focusOn: "E-H" },
      { title: "Revue périodique", description: "Utilisez cette checklist trimestriellement et avant chaque audit.", tips: ["Conservez les versions précédentes pour montrer la progression"] }
    ]
  }
};

// Add simple tutorials for remaining templates
const simpleTutorials: Record<string, TutorialData> = {
  '5': { id: 5, name: "Processus de Validation", type: "Word", icon: "✅", file: "processus-validation-ia.docx", description: "Processus d'approbation avant déploiement d'un système IA.", duration: "12 min", objectives: ["Définir les étapes de validation", "Identifier les valideurs"], steps: [{ title: "Étapes du processus", description: "1. Demande → 2. Classification → 3. Analyse → 4. Validation → 5. Déploiement" }] },
  '6': { id: 6, name: "Contrat Fournisseur IA", type: "Word", icon: "🤝", file: "contrat-fournisseur-ia.docx", description: "Clauses contractuelles AI Act pour vos fournisseurs.", duration: "15 min", objectives: ["Sécuriser les relations fournisseurs", "Prévoir audit et réversibilité"], steps: [{ title: "Clauses essentielles", description: "Conformité AI Act, Documentation, Audit, Incidents, Réversibilité" }] },
  '7': { id: 7, name: "Notice de Transparence", type: "Word", icon: "👁️", file: "notice-transparence.docx", description: "Informer les utilisateurs qu'ils interagissent avec une IA.", duration: "10 min", objectives: ["Rédiger une notice claire", "Placer au bon endroit"], steps: [{ title: "Contenu obligatoire", description: "Nature IA, Objectif, Limites, Contact humain" }] },
  '8': { id: 8, name: "Plan Formation Article 4", type: "Word", icon: "🎓", file: "plan-formation-article4.docx", description: "Plan de formation 'maîtrise de l'IA' (Article 4).", duration: "12 min", objectives: ["Identifier qui former", "Définir le contenu"], steps: [{ title: "Obligation Article 4", description: "Applicable depuis février 2025 - Tous les utilisateurs IA doivent être formés", warning: "Obligation déjà en vigueur!" }] },
  '9': { id: 9, name: "Procédure Supervision Humaine", type: "Word", icon: "👤", file: "procedure-supervision-humaine.docx", description: "Comment maintenir le contrôle humain sur l'IA.", duration: "15 min", objectives: ["Définir les niveaux de supervision", "Tracer les interventions"], steps: [{ title: "Principe", description: "Article 14 - Un humain doit toujours pouvoir intervenir sur les décisions IA" }] },
  '12': { id: 12, name: "Rapport Audit Interne", type: "Word", icon: "📝", file: "rapport-audit-interne.docx", description: "Modèle de rapport pour vos audits de conformité.", duration: "15 min", objectives: ["Structurer un audit", "Formuler des recommandations"], steps: [{ title: "Structure du rapport", description: "Périmètre → Méthodologie → Constats → Recommandations → Suivi" }] }
};

const allTutorials = { ...tutorialsData, ...simpleTutorials };

// ============================================
// VISUAL COMPONENTS - EXACT REPLICAS
// ============================================

// Excel Replica Component
const ExcelReplica = ({ data, activeSheet, setActiveSheet, focusColumns }: { 
  data: typeof registreIAStructure; 
  activeSheet: number;
  setActiveSheet: (i: number) => void;
  focusColumns?: string;
}) => {
  const [selectedCol, setSelectedCol] = useState<typeof data.sheets[0]['columns'][0] | null>(null);
  const sheet = data.sheets[activeSheet];
  
  const isColumnFocused = (letter: string) => {
    if (!focusColumns) return true;
    const [start, end] = focusColumns.split('-');
    if (!end) return letter === start;
    return letter >= start && letter <= end;
  };

  return (
    <div className="rounded-xl overflow-hidden shadow-2xl border border-gray-300">
      {/* Excel Title Bar */}
      <div className="bg-[#217346] text-white px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
            <div className="w-3 h-3 rounded-full bg-[#28ca41]" />
          </div>
          <span className="font-semibold ml-2">📊 {sheet.name}.xlsx - Excel</span>
        </div>
      </div>
      
      {/* Excel Ribbon (simplified) */}
      <div className="bg-[#f3f3f3] border-b border-gray-300 px-4 py-1.5 flex items-center gap-6 text-sm text-gray-600">
        <span className="font-medium text-[#217346]">Accueil</span>
        <span>Insertion</span>
        <span>Mise en page</span>
        <span>Formules</span>
        <span>Données</span>
      </div>

      {/* Sheet Tabs */}
      <div className="bg-[#f0f0f0] px-2 py-1 flex gap-1 border-b border-gray-300">
        {data.sheets.map((s, i) => (
          <button
            key={i}
            onClick={() => setActiveSheet(i)}
            className={`px-4 py-1.5 text-sm rounded-t transition-colors ${
              activeSheet === i 
                ? 'bg-white border-t border-x border-gray-300 font-medium text-gray-800' 
                : 'bg-[#e0e0e0] text-gray-600 hover:bg-[#d0d0d0]'
            }`}
          >
            {s.name}
          </button>
        ))}
      </div>

      {/* Sheet Content */}
      {sheet.columns.length > 0 ? (
        <div className="overflow-x-auto bg-white">
          <table className="w-full text-sm border-collapse">
            <thead>
              {/* Column Letters Row */}
              <tr className="bg-[#f5f5f5]">
                <th className="w-10 min-w-[40px] border-r border-b border-gray-300 bg-[#e8e8e8]" />
                {sheet.columns.map((col) => (
                  <th
                    key={col.letter}
                    onClick={() => setSelectedCol(col)}
                    className={`min-w-[140px] px-2 py-1.5 border-r border-b border-gray-300 font-medium text-center cursor-pointer transition-all ${
                      selectedCol?.letter === col.letter 
                        ? 'bg-[#217346] text-white' 
                        : isColumnFocused(col.letter)
                          ? 'bg-[#e8f5e9] hover:bg-[#c8e6c9]'
                          : 'bg-[#f5f5f5] hover:bg-[#e8e8e8] opacity-50'
                    }`}
                  >
                    {col.letter}
                  </th>
                ))}
              </tr>
              {/* Header Row */}
              <tr className="bg-[#e3f2e6]">
                <td className="border-r border-b border-gray-300 bg-[#e8e8e8] text-center text-gray-600 font-medium py-1">1</td>
                {sheet.columns.map((col) => (
                  <td
                    key={col.letter}
                    onClick={() => setSelectedCol(col)}
                    className={`px-2 py-2 border-r border-b border-gray-300 font-semibold text-xs cursor-pointer ${
                      selectedCol?.letter === col.letter ? 'bg-[#c8e6c9]' : ''
                    } ${isColumnFocused(col.letter) ? '' : 'opacity-50'}`}
                  >
                    {col.name}
                    {col.required && <span className="text-red-500 ml-1">*</span>}
                  </td>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Example Row */}
              <tr className="hover:bg-[#f8f8f8]">
                <td className="border-r border-b border-gray-300 bg-[#e8e8e8] text-center text-gray-600 font-medium py-1">2</td>
                {sheet.columns.map((col) => (
                  <td
                    key={col.letter}
                    onClick={() => setSelectedCol(col)}
                    className={`px-2 py-2 border-r border-b border-gray-300 text-xs cursor-pointer ${
                      selectedCol?.letter === col.letter ? 'bg-[#f0f8f0]' : ''
                    } ${isColumnFocused(col.letter) ? 'text-gray-700' : 'text-gray-400 opacity-50'}`}
                  >
                    <span className="italic">{col.example}</span>
                  </td>
                ))}
              </tr>
              {/* Empty rows */}
              {[3, 4, 5].map((row) => (
                <tr key={row} className="hover:bg-[#f8f8f8]">
                  <td className="border-r border-b border-gray-300 bg-[#e8e8e8] text-center text-gray-600 font-medium py-1">{row}</td>
                  {sheet.columns.map((col) => (
                    <td key={col.letter} className="px-2 py-2 border-r border-b border-gray-300" />
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white p-8 text-center text-gray-500">
          <p>Cet onglet contient des instructions ou un tableau de bord.</p>
          <p className="text-sm mt-2">Consultez-le directement dans le fichier Excel.</p>
        </div>
      )}

      {/* Selected Column Detail Panel */}
      <AnimatePresence>
        {selectedCol && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-gradient-to-r from-[#e8f5e9] to-[#f1f8e9] border-t-2 border-[#217346]"
          >
            <div className="p-5">
              <div className="flex items-start gap-4">
                <div className="bg-[#217346] text-white w-12 h-12 rounded-xl flex items-center justify-center font-bold text-xl flex-shrink-0 shadow-lg">
                  {selectedCol.letter}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-bold text-gray-800 text-lg">{selectedCol.name}</h4>
                    {selectedCol.required && (
                      <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full font-medium">
                        Obligatoire
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600">{selectedCol.description}</p>
                  <div className="mt-4 bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Exemple de saisie</p>
                    <p className="text-[#217346] font-medium text-lg">{selectedCol.example}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedCol(null)}
                  className="text-gray-400 hover:text-gray-600 p-2"
                >
                  ✕
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-gray-100 px-4 py-2 text-xs text-gray-500 text-center border-t border-gray-200">
        👆 Cliquez sur une colonne pour voir les explications détaillées
      </div>
    </div>
  );
};

// Word Document Replica Component
const WordReplica = ({ data, focusArticle }: { 
  data: typeof politiqueIAStructure;
  focusArticle?: string;
}) => {
  const [selectedArticle, setSelectedArticle] = useState<typeof data.articles[0] | null>(null);

  const isArticleFocused = (num: string) => {
    if (!focusArticle) return true;
    if (focusArticle.includes('-')) {
      const [start, end] = focusArticle.split('-');
      return parseInt(num) >= parseInt(start) && parseInt(num) <= parseInt(end);
    }
    return num === focusArticle;
  };

  return (
    <div className="rounded-xl overflow-hidden shadow-2xl border border-gray-300">
      {/* Word Title Bar */}
      <div className="bg-[#2b579a] text-white px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
            <div className="w-3 h-3 rounded-full bg-[#28ca41]" />
          </div>
          <span className="font-semibold ml-2">📄 Politique-IA.docx - Word</span>
        </div>
      </div>
      
      {/* Word Ribbon */}
      <div className="bg-[#f3f3f3] border-b border-gray-300 px-4 py-1.5 flex items-center gap-6 text-sm text-gray-600">
        <span>Fichier</span>
        <span className="font-medium text-[#2b579a]">Accueil</span>
        <span>Insertion</span>
        <span>Mise en page</span>
        <span>Révision</span>
      </div>

      {/* Document Content */}
      <div className="bg-[#f0f0f0] p-6 min-h-[400px]">
        <div className="max-w-2xl mx-auto bg-white shadow-xl rounded-sm">
          {/* Document Paper */}
          <div className="p-8 space-y-6">
            {/* Title */}
            <div className="text-center border-b-2 border-[#2b579a] pb-4 mb-6">
              <h1 className="text-xl font-bold text-gray-800">{data.title}</h1>
              <p className="text-gray-600 mt-1">{data.subtitle}</p>
            </div>

            {/* Articles */}
            <div className="space-y-4">
              {data.articles.map((article) => (
                <motion.div
                  key={article.number}
                  onClick={() => setSelectedArticle(article)}
                  whileHover={{ x: 2 }}
                  className={`p-4 rounded-lg cursor-pointer transition-all ${
                    selectedArticle?.number === article.number
                      ? 'bg-[#e8f0fe] border-l-4 border-[#2b579a] shadow-md'
                      : isArticleFocused(article.number)
                        ? 'hover:bg-gray-50 border-l-4 border-transparent hover:border-gray-200'
                        : 'opacity-40 border-l-4 border-transparent'
                  }`}
                >
                  <h3 className="font-bold text-[#2b579a]">
                    Article {article.number} - {article.title}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">{article.content}</p>
                  {article.lists.length > 0 && (
                    <p className="text-xs text-gray-400 mt-1">+ {article.lists.length} points détaillés</p>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Signature */}
            <div className="pt-6 mt-6 border-t border-gray-200 text-sm text-gray-500">
              <p>{data.signature.dateField}</p>
              <p className="mt-2">{data.signature.signatureField}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Selected Article Detail Panel */}
      <AnimatePresence>
        {selectedArticle && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-gradient-to-r from-[#e8f0fe] to-[#f0f4ff] border-t-2 border-[#2b579a]"
          >
            <div className="p-5">
              <div className="flex items-start gap-4">
                <div className="bg-[#2b579a] text-white w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg flex-shrink-0 shadow-lg">
                  {selectedArticle.number}
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-gray-800 text-lg">Article {selectedArticle.number} - {selectedArticle.title}</h4>
                  <p className="text-gray-600 mt-2">{selectedArticle.content}</p>
                  
                  {selectedArticle.lists.length > 0 && (
                    <div className="mt-4 bg-white rounded-lg p-4 border border-gray-200">
                      <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Points clés</p>
                      <ul className="space-y-2">
                        {selectedArticle.lists.map((item, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                            <span className="text-[#2b579a] font-bold">•</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {selectedArticle.fillFields.length > 0 && (
                    <div className="mt-4 bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                      <p className="text-xs text-yellow-700 font-medium mb-2">📝 Champs à personnaliser :</p>
                      {selectedArticle.fillFields.map((field, i) => (
                        <code key={i} className="inline-block bg-yellow-100 px-2 py-1 rounded text-yellow-800 text-sm mr-2">
                          {field}
                        </code>
                      ))}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => setSelectedArticle(null)}
                  className="text-gray-400 hover:text-gray-600 p-2"
                >
                  ✕
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-gray-100 px-4 py-2 text-xs text-gray-500 text-center border-t border-gray-200">
        👆 Cliquez sur un article pour voir le contenu détaillé
      </div>
    </div>
  );
};

// Documentation Technique Replica
const DocTechReplica = ({ data, focusSection }: { 
  data: typeof documentationTechniqueStructure;
  focusSection?: string;
}) => {
  const [selectedSection, setSelectedSection] = useState<typeof data.sections[0] | null>(null);

  return (
    <div className="rounded-xl overflow-hidden shadow-2xl border border-gray-300">
      <div className="bg-[#2b579a] text-white px-4 py-2.5 flex items-center gap-3">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
          <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
          <div className="w-3 h-3 rounded-full bg-[#28ca41]" />
        </div>
        <span className="font-semibold ml-2">📋 Documentation-Technique.docx - Word</span>
      </div>
      
      <div className="bg-[#f0f0f0] p-6">
        <div className="max-w-2xl mx-auto bg-white shadow-xl rounded-sm p-8">
          <div className="text-center border-b-2 border-[#2b579a] pb-4 mb-6">
            <h1 className="text-xl font-bold text-gray-800">{data.title}</h1>
            <p className="text-[#2b579a] font-medium mt-1">{data.subtitle}</p>
            <p className="text-sm text-gray-500 mt-2">{data.intro}</p>
          </div>

          <div className="space-y-3">
            {data.sections.map((section) => (
              <motion.div
                key={section.number}
                onClick={() => setSelectedSection(section)}
                whileHover={{ x: 2 }}
                className={`p-4 rounded-lg cursor-pointer transition-all ${
                  selectedSection?.number === section.number
                    ? 'bg-[#e8f0fe] border-l-4 border-[#2b579a]'
                    : focusSection && section.number !== focusSection && !focusSection.includes('-')
                      ? 'opacity-40'
                      : 'hover:bg-gray-50'
                }`}
              >
                <h3 className="font-bold text-[#2b579a]">{section.number}. {section.title}</h3>
                <p className="text-xs text-gray-500 mt-1">{section.content}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {selectedSection && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-gradient-to-r from-[#e8f0fe] to-[#f0f4ff] border-t-2 border-[#2b579a] p-5"
          >
            <div className="flex items-start gap-4">
              <div className="bg-[#2b579a] text-white w-12 h-12 rounded-xl flex items-center justify-center font-bold flex-shrink-0">
                {selectedSection.number}
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-gray-800 text-lg">{selectedSection.title}</h4>
                <p className="text-gray-600 mt-2">{selectedSection.content}</p>
                <div className="mt-4 bg-white rounded-lg p-4 border border-gray-200">
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Sous-sections à remplir</p>
                  <ul className="space-y-1">
                    {selectedSection.subsections.map((sub, i) => (
                      <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                        <span className="text-[#2b579a]">→</span>{sub}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <button onClick={() => setSelectedSection(null)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// FRIA Replica
const FRIAReplica = ({ data, focusSection }: { 
  data: typeof friaStructure;
  focusSection?: string;
}) => {
  const [selectedSection, setSelectedSection] = useState<typeof data.sections[0] | null>(null);

  return (
    <div className="rounded-xl overflow-hidden shadow-2xl border border-gray-300">
      <div className="bg-[#b45309] text-white px-4 py-2.5 flex items-center gap-3">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
          <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
          <div className="w-3 h-3 rounded-full bg-[#28ca41]" />
        </div>
        <span className="font-semibold ml-2">⚠️ FRIA.docx - Word</span>
      </div>
      
      <div className="bg-[#fef3c7] p-6">
        <div className="max-w-2xl mx-auto bg-white shadow-xl rounded-sm p-8">
          <div className="text-center border-b-2 border-[#b45309] pb-4 mb-6">
            <h1 className="text-xl font-bold text-gray-800">{data.title}</h1>
            <p className="text-[#b45309] font-medium mt-1">{data.subtitle}</p>
          </div>

          <div className="space-y-3">
            {data.sections.map((section) => (
              <motion.div
                key={section.number}
                onClick={() => setSelectedSection(section)}
                whileHover={{ x: 2 }}
                className={`p-4 rounded-lg cursor-pointer transition-all ${
                  selectedSection?.number === section.number
                    ? 'bg-[#fef3c7] border-l-4 border-[#b45309]'
                    : 'hover:bg-gray-50'
                }`}
              >
                <h3 className="font-bold text-[#b45309]">{section.number}. {section.title}</h3>
                <p className="text-xs text-gray-500 mt-1">{section.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {selectedSection && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-gradient-to-r from-[#fef3c7] to-[#fef9c3] border-t-2 border-[#b45309] p-5"
          >
            <div className="flex items-start gap-4">
              <div className="bg-[#b45309] text-white w-12 h-12 rounded-xl flex items-center justify-center font-bold flex-shrink-0">
                {selectedSection.number}
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-gray-800 text-lg">{selectedSection.title}</h4>
                <p className="text-gray-600 mt-2">{selectedSection.description}</p>
                <div className="mt-4 bg-white rounded-lg p-4 border border-gray-200">
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Éléments à documenter</p>
                  <ul className="space-y-1">
                    {selectedSection.subsections.map((sub, i) => (
                      <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                        <span className="text-[#b45309]">□</span>{sub}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <button onClick={() => setSelectedSection(null)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ============================================
// MAIN PAGE COMPONENT
// ============================================

export default function TutorialPage() {
  const params = useParams();
  const tutorialId = params.id as string;
  const tutorial = allTutorials[tutorialId];
  
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [activeSheet, setActiveSheet] = useState(0);

  if (!tutorial) {
    return (
      <div className="min-h-screen bg-[#030014] text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Tutoriel non trouvé</h1>
          <Link href="/dashboard" className="text-[#00F5FF] hover:underline">← Retour au dashboard</Link>
        </div>
      </div>
    );
  }

  const step = tutorial.steps[currentStep];
  const progress = Math.round((completedSteps.length / tutorial.steps.length) * 100);

  return (
    <div className="min-h-screen bg-[#030014] text-white">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[#030014]" />
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-[#00F5FF]/5 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[800px] h-[800px] rounded-full bg-[#8B5CF6]/5 blur-[150px]" />
      </div>

      {/* Header */}
      <header className="relative z-50 px-6 py-4 border-b border-white/5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-3 text-white/60 hover:text-white transition-colors">
            <div className="w-5 h-5"><Icons.ArrowLeft /></div>
            <span>Retour au dashboard</span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-2xl">{tutorial.icon}</span>
            <span className="font-bold">{tutorial.name}</span>
            <span className="text-white/40 text-sm">• {tutorial.duration}</span>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white/60 text-sm">Progression du tutoriel</span>
            <span className="text-[#00FF88] font-bold">{progress}%</span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="h-full bg-gradient-to-r from-[#00FF88] to-[#00F5FF]"
            />
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Info Card */}
            <div className="bg-[#0A0A1B]/90 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">{tutorial.icon}</span>
                <div>
                  <h2 className="font-bold">{tutorial.name}</h2>
                  <p className="text-white/40 text-sm">{tutorial.type === 'Excel' ? 'Fichier Excel' : 'Document Word'}</p>
                </div>
              </div>
              <p className="text-white/60 text-sm mb-4">{tutorial.description}</p>
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-white/80">Objectifs :</h3>
                {tutorial.objectives.map((obj, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm text-white/60">
                    <div className="w-4 h-4 text-[#00FF88] flex-shrink-0 mt-0.5"><Icons.Check /></div>
                    {obj}
                  </div>
                ))}
              </div>
            </div>

            {/* Steps Navigation */}
            <div className="bg-[#0A0A1B]/90 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
              <h3 className="text-sm font-semibold text-white/80 mb-4">Étapes du tutoriel</h3>
              <div className="space-y-2">
                {tutorial.steps.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentStep(i)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-colors ${
                      currentStep === i ? 'bg-[#00F5FF]/20 border border-[#00F5FF]/30' : 'hover:bg-white/5'
                    }`}
                  >
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                      completedSteps.includes(i)
                        ? 'bg-[#00FF88] text-black'
                        : currentStep === i
                          ? 'bg-[#00F5FF] text-black'
                          : 'bg-white/10 text-white/60'
                    }`}>
                      {completedSteps.includes(i) ? <Icons.Check /> : i + 1}
                    </div>
                    <span className={`text-sm ${currentStep === i ? 'text-white' : 'text-white/60'}`}>
                      {s.title}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Download Button */}
            <Link
              href={`/resources/${tutorial.file}`}
              download
              className="flex items-center justify-center gap-2 w-full py-4 bg-gradient-to-r from-[#00FF88] to-[#00F5FF] text-black font-bold rounded-xl hover:opacity-90 transition-opacity"
            >
              <div className="w-5 h-5"><Icons.Download /></div>
              Télécharger le template
            </Link>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                {/* Step Header */}
                <div className="bg-[#0A0A1B]/90 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-[#00F5FF]/20 flex items-center justify-center text-[#00F5FF] font-bold">
                      {currentStep + 1}
                    </div>
                    <div>
                      <h2 className="text-xl font-bold">{step.title}</h2>
                      <p className="text-white/60 text-sm">{step.description}</p>
                    </div>
                  </div>

                  {step.tips && (
                    <div className="bg-[#FFB800]/10 border border-[#FFB800]/30 rounded-xl p-4 mt-4">
                      <div className="flex items-center gap-2 text-[#FFB800] font-semibold text-sm mb-2">
                        <div className="w-4 h-4"><Icons.Lightbulb /></div>
                        Conseils
                      </div>
                      <ul className="space-y-1">
                        {step.tips.map((tip, i) => (
                          <li key={i} className="text-white/70 text-sm">• {tip}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {step.warning && (
                    <div className="bg-[#FF4444]/10 border border-[#FF4444]/30 rounded-xl p-4 mt-4">
                      <div className="flex items-center gap-2 text-[#FF4444] font-semibold text-sm mb-2">
                        <div className="w-4 h-4"><Icons.AlertTriangle /></div>
                        Attention
                      </div>
                      <p className="text-white/70 text-sm">{step.warning}</p>
                    </div>
                  )}
                </div>

                {/* Document Visualization */}
                {tutorial.excelData && (
                  <ExcelReplica
                    data={tutorial.excelData}
                    activeSheet={activeSheet}
                    setActiveSheet={setActiveSheet}
                    focusColumns={step.focusOn}
                  />
                )}

                {tutorial.wordData && (
                  <WordReplica
                    data={tutorial.wordData}
                    focusArticle={step.focusOn}
                  />
                )}

                {tutorial.docTechData && (
                  <DocTechReplica
                    data={tutorial.docTechData}
                    focusSection={step.focusOn}
                  />
                )}

                {tutorial.friaData && (
                  <FRIAReplica
                    data={tutorial.friaData}
                    focusSection={step.focusOn}
                  />
                )}

                {/* Navigation */}
                <div className="flex items-center justify-between pt-4">
                  <button
                    onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                    disabled={currentStep === 0}
                    className="flex items-center gap-2 text-white/60 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <div className="w-5 h-5"><Icons.ArrowLeft /></div>
                    Précédent
                  </button>

                  <button
                    onClick={() => {
                      if (!completedSteps.includes(currentStep)) {
                        setCompletedSteps([...completedSteps, currentStep]);
                      }
                    }}
                    className={`px-6 py-2 rounded-xl text-sm font-medium transition-colors ${
                      completedSteps.includes(currentStep)
                        ? 'bg-[#00FF88]/20 text-[#00FF88]'
                        : 'bg-white/10 text-white/60 hover:bg-white/20'
                    }`}
                  >
                    {completedSteps.includes(currentStep) ? '✓ Compris !' : 'Marquer comme compris'}
                  </button>

                  <button
                    onClick={() => setCurrentStep(Math.min(tutorial.steps.length - 1, currentStep + 1))}
                    disabled={currentStep === tutorial.steps.length - 1}
                    className="flex items-center gap-2 text-[#00F5FF] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    Suivant
                    <div className="w-5 h-5"><Icons.ArrowRight /></div>
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
}
