'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Play, Pause, CheckCircle, ChevronRight, ChevronLeft, X,
  BookOpen, Clock, Award, Home, List, Volume2, VolumeX,
  Maximize, SkipForward, RotateCcw, Download, Share2,
  ThumbsUp, ThumbsDown, MessageSquare, Lightbulb, AlertTriangle,
  FileText, Target, Zap, Trophy, ArrowLeft, Menu, Shield
} from 'lucide-react';
import Link from 'next/link';

// Types
interface Lesson {
  id: number;
  title: string;
  duration: string;
  type: 'video' | 'quiz';
  content?: string;
  videoUrl?: string;
  keyPoints?: string[];
}

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

interface Module {
  id: number;
  title: string;
  description: string;
  duration: string;
  icon: string;
  xp: number;
  lessons: Lesson[];
  quiz: QuizQuestion[];
}

// Données complètes des modules
const modulesData: Module[] = [
  {
    id: 1,
    title: "Introduction à l'AI Act",
    description: "Comprendre les fondamentaux du règlement européen",
    duration: "45 min",
    icon: "📋",
    xp: 150,
    lessons: [
      {
        id: 1,
        title: "Origines et objectifs de l'AI Act",
        duration: "10 min",
        type: 'video',
        content: "L'AI Act est le premier cadre juridique complet au monde régulant l'intelligence artificielle. Adopté par l'Union Européenne, il vise à garantir que les systèmes d'IA utilisés en Europe soient sûrs et respectent les droits fondamentaux.",
        keyPoints: [
          "Premier règlement mondial sur l'IA",
          "Adopté le 13 mars 2024 par le Parlement européen",
          "Objectif : IA digne de confiance et centrée sur l'humain",
          "Applicable à tous les fournisseurs et utilisateurs d'IA en Europe"
        ]
      },
      {
        id: 2,
        title: "Calendrier d'application",
        duration: "8 min",
        type: 'video',
        content: "Le règlement entre en vigueur progressivement entre 2024 et 2027, avec des échéances différentes selon les catégories de risque.",
        keyPoints: [
          "Août 2024 : Entrée en vigueur du règlement",
          "Février 2025 : Interdiction des IA à risque inacceptable",
          "Août 2025 : Obligations de transparence (IA générative)",
          "Août 2026 : Obligations complètes pour IA à haut risque"
        ]
      },
      {
        id: 3,
        title: "Acteurs concernés",
        duration: "12 min",
        type: 'video',
        content: "L'AI Act s'applique à différents acteurs de la chaîne de valeur de l'IA : fournisseurs, déployeurs, importateurs et distributeurs.",
        keyPoints: [
          "Fournisseurs : développent ou font développer des systèmes d'IA",
          "Déployeurs : utilisent des systèmes d'IA dans un cadre professionnel",
          "Importateurs : introduisent des systèmes d'IA sur le marché européen",
          "Application extraterritoriale (comme le RGPD)"
        ]
      },
      {
        id: 4,
        title: "Articulation avec le RGPD",
        duration: "10 min",
        type: 'video',
        content: "L'AI Act complète le RGPD sans le remplacer. Les deux règlements s'appliquent conjointement lorsqu'un système d'IA traite des données personnelles.",
        keyPoints: [
          "AI Act et RGPD sont complémentaires",
          "Le RGPD s'applique aux données personnelles utilisées par l'IA",
          "Mêmes autorités de contrôle dans certains cas",
          "Sanctions cumulables en cas de non-conformité"
        ]
      },
      {
        id: 5,
        title: "Quiz du module",
        duration: "5 min",
        type: 'quiz'
      }
    ],
    quiz: [
      {
        id: 1,
        question: "Quand l'AI Act est-il entré en vigueur ?",
        options: ["Janvier 2024", "Août 2024", "Février 2025", "Août 2026"],
        correctIndex: 1,
        explanation: "L'AI Act est entré en vigueur en août 2024, 20 jours après sa publication au Journal Officiel de l'UE."
      },
      {
        id: 2,
        question: "Quel article de l'AI Act impose la formation obligatoire ?",
        options: ["Article 2", "Article 4", "Article 6", "Article 10"],
        correctIndex: 1,
        explanation: "L'Article 4 de l'AI Act impose une obligation de formation pour toutes les personnes impliquées dans l'utilisation de systèmes d'IA."
      },
      {
        id: 3,
        question: "L'AI Act s'applique-t-il aux entreprises hors UE ?",
        options: ["Non, uniquement aux entreprises européennes", "Oui, si leurs systèmes sont utilisés en UE", "Seulement aux grandes entreprises", "Non, c'est facultatif"],
        correctIndex: 1,
        explanation: "L'AI Act a une portée extraterritoriale : il s'applique à tout système d'IA utilisé ou ayant des effets dans l'UE, quelle que soit la localisation du fournisseur."
      },
      {
        id: 4,
        question: "Quelle est la relation entre l'AI Act et le RGPD ?",
        options: ["L'AI Act remplace le RGPD", "Ils sont complémentaires", "Le RGPD est abrogé", "Ils sont mutuellement exclusifs"],
        correctIndex: 1,
        explanation: "L'AI Act et le RGPD sont complémentaires. Le RGPD continue de s'appliquer pour le traitement des données personnelles par les systèmes d'IA."
      }
    ]
  },
  {
    id: 2,
    title: "Classification des risques",
    description: "Les 4 niveaux de risque et leurs implications",
    duration: "1h",
    icon: "⚠️",
    xp: 200,
    lessons: [
      {
        id: 1,
        title: "Les 4 niveaux de risque",
        duration: "15 min",
        type: 'video',
        content: "L'AI Act établit une approche basée sur les risques avec 4 niveaux : risque inacceptable, haut risque, risque limité et risque minimal.",
        keyPoints: [
          "Approche proportionnée basée sur le risque",
          "Plus le risque est élevé, plus les obligations sont strictes",
          "Classification basée sur l'usage prévu du système",
          "Possibilité de reclassification si l'usage change"
        ]
      },
      {
        id: 2,
        title: "IA interdites (risque inacceptable)",
        duration: "12 min",
        type: 'video',
        content: "Certaines pratiques d'IA sont totalement interdites car elles représentent une menace claire pour les droits fondamentaux.",
        keyPoints: [
          "Manipulation subliminale des comportements",
          "Exploitation des vulnérabilités (âge, handicap)",
          "Scoring social par les autorités publiques",
          "Identification biométrique en temps réel (sauf exceptions)"
        ]
      },
      {
        id: 3,
        title: "IA à haut risque",
        duration: "15 min",
        type: 'video',
        content: "Les systèmes d'IA à haut risque sont soumis à des exigences strictes avant leur mise sur le marché.",
        keyPoints: [
          "Biométrie et catégorisation des personnes",
          "Infrastructures critiques (énergie, transport)",
          "Éducation et formation professionnelle",
          "Emploi et gestion des travailleurs",
          "Services essentiels (banque, assurance)",
          "Application de la loi et justice"
        ]
      },
      {
        id: 4,
        title: "IA à risque limité",
        duration: "10 min",
        type: 'video',
        content: "Les systèmes à risque limité doivent respecter des obligations de transparence pour que les utilisateurs sachent qu'ils interagissent avec une IA.",
        keyPoints: [
          "Chatbots et assistants virtuels",
          "Systèmes de génération de contenu (deepfakes)",
          "Obligation d'informer l'utilisateur",
          "Marquage du contenu généré par IA"
        ]
      },
      {
        id: 5,
        title: "IA à risque minimal",
        duration: "8 min",
        type: 'video',
        content: "La majorité des systèmes d'IA sont à risque minimal et ne sont pas soumis à des obligations spécifiques.",
        keyPoints: [
          "Filtres anti-spam",
          "Jeux vidéo avec IA",
          "Recommandations de contenu",
          "Codes de conduite volontaires encouragés"
        ]
      },
      {
        id: 6,
        title: "Quiz du module",
        duration: "5 min",
        type: 'quiz'
      }
    ],
    quiz: [
      {
        id: 1,
        question: "Combien de niveaux de risque définit l'AI Act ?",
        options: ["2", "3", "4", "5"],
        correctIndex: 2,
        explanation: "L'AI Act définit 4 niveaux de risque : inacceptable, haut, limité et minimal."
      },
      {
        id: 2,
        question: "Les systèmes de scoring social sont classés comme :",
        options: ["Risque minimal", "Risque limité", "Haut risque", "Risque inacceptable"],
        correctIndex: 3,
        explanation: "Le scoring social par les autorités publiques est considéré comme un risque inacceptable et est donc interdit."
      },
      {
        id: 3,
        question: "Quelle obligation s'applique aux chatbots ?",
        options: ["Aucune obligation", "Obligation de transparence", "Certification obligatoire", "Interdiction totale"],
        correctIndex: 1,
        explanation: "Les chatbots sont à risque limité et doivent informer les utilisateurs qu'ils interagissent avec une IA."
      },
      {
        id: 4,
        question: "L'IA utilisée pour le recrutement est classée comme :",
        options: ["Risque minimal", "Risque limité", "Haut risque", "Risque inacceptable"],
        correctIndex: 2,
        explanation: "Les systèmes d'IA utilisés pour le recrutement et la gestion des travailleurs sont classés à haut risque."
      }
    ]
  },
  {
    id: 3,
    title: "Registre des systèmes IA",
    description: "Cartographier et documenter vos usages IA",
    duration: "1h15",
    icon: "📊",
    xp: 250,
    lessons: [
      {
        id: 1,
        title: "Méthodologie d'audit interne",
        duration: "15 min",
        type: 'video',
        content: "Pour vous conformer à l'AI Act, vous devez d'abord identifier tous les systèmes d'IA utilisés dans votre organisation.",
        keyPoints: [
          "Définir le périmètre de l'audit",
          "Identifier les parties prenantes",
          "Collecter les informations sur les systèmes existants",
          "Documenter les cas d'usage"
        ]
      },
      {
        id: 2,
        title: "Inventaire des systèmes IA",
        duration: "12 min",
        type: 'video',
        content: "L'inventaire doit recenser tous les systèmes d'IA, qu'ils soient développés en interne ou achetés à des tiers.",
        keyPoints: [
          "Systèmes développés en interne",
          "Solutions SaaS avec composants IA",
          "APIs et services cloud d'IA",
          "Outils bureautiques avec IA intégrée"
        ]
      },
      {
        id: 3,
        title: "Classification de vos usages",
        duration: "15 min",
        type: 'video',
        content: "Chaque système identifié doit être classé selon les niveaux de risque de l'AI Act.",
        keyPoints: [
          "Analyser l'usage prévu de chaque système",
          "Identifier le secteur d'application",
          "Évaluer l'impact potentiel sur les personnes",
          "Documenter la classification retenue"
        ]
      },
      {
        id: 4,
        title: "Le registre des traitements IA",
        duration: "15 min",
        type: 'video',
        content: "Le registre des systèmes IA est un document vivant qui doit être maintenu à jour.",
        keyPoints: [
          "Informations obligatoires à documenter",
          "Responsable du registre",
          "Fréquence de mise à jour",
          "Lien avec le registre RGPD"
        ]
      },
      {
        id: 5,
        title: "Évaluation d'impact algorithmique",
        duration: "12 min",
        type: 'video',
        content: "Pour les systèmes à haut risque, une évaluation d'impact est obligatoire.",
        keyPoints: [
          "Quand réaliser une évaluation d'impact",
          "Méthodologie recommandée",
          "Parties prenantes à impliquer",
          "Documentation des résultats"
        ]
      },
      {
        id: 6,
        title: "Template et outils pratiques",
        duration: "8 min",
        type: 'video',
        content: "Utilisez les templates fournis pour faciliter votre mise en conformité.",
        keyPoints: [
          "Template de registre IA (Excel)",
          "Checklist d'audit",
          "Grille de classification des risques",
          "Modèle d'évaluation d'impact"
        ]
      },
      {
        id: 7,
        title: "Quiz du module",
        duration: "5 min",
        type: 'quiz'
      }
    ],
    quiz: [
      {
        id: 1,
        question: "Que doit contenir un registre des systèmes IA ?",
        options: ["Uniquement les systèmes développés en interne", "Tous les systèmes IA utilisés", "Seulement les systèmes à haut risque", "Les systèmes achetés uniquement"],
        correctIndex: 1,
        explanation: "Le registre doit recenser tous les systèmes d'IA utilisés, qu'ils soient développés en interne ou achetés."
      },
      {
        id: 2,
        question: "L'évaluation d'impact algorithmique est obligatoire pour :",
        options: ["Tous les systèmes IA", "Les systèmes à haut risque", "Les systèmes à risque minimal", "Aucun système"],
        correctIndex: 1,
        explanation: "L'évaluation d'impact est obligatoire pour les systèmes classés à haut risque."
      },
      {
        id: 3,
        question: "À quelle fréquence le registre IA doit-il être mis à jour ?",
        options: ["Jamais", "Une fois par an", "En continu", "Tous les 5 ans"],
        correctIndex: 2,
        explanation: "Le registre est un document vivant qui doit être mis à jour en continu, à chaque changement."
      }
    ]
  },
  {
    id: 4,
    title: "Gouvernance IA",
    description: "Mettre en place une politique IA d'entreprise",
    duration: "1h",
    icon: "🏛️",
    xp: 200,
    lessons: [
      {
        id: 1,
        title: "Rôles et responsabilités",
        duration: "12 min",
        type: 'video',
        content: "La gouvernance IA nécessite une définition claire des rôles et responsabilités au sein de l'organisation.",
        keyPoints: [
          "Direction générale : sponsor et budget",
          "DSI/CTO : aspects techniques",
          "DPO : articulation avec le RGPD",
          "Métiers : identification des usages"
        ]
      },
      {
        id: 2,
        title: "Le référent IA",
        duration: "10 min",
        type: 'video',
        content: "Nommer un référent IA est recommandé pour coordonner la mise en conformité.",
        keyPoints: [
          "Profil idéal du référent IA",
          "Missions principales",
          "Positionnement dans l'organisation",
          "Formation et compétences requises"
        ]
      },
      {
        id: 3,
        title: "Politique IA d'entreprise",
        duration: "15 min",
        type: 'video',
        content: "La politique IA définit les principes directeurs de l'utilisation de l'IA dans l'organisation.",
        keyPoints: [
          "Principes éthiques",
          "Usages autorisés et interdits",
          "Processus de validation",
          "Formation et sensibilisation"
        ]
      },
      {
        id: 4,
        title: "Comité de pilotage IA",
        duration: "12 min",
        type: 'video',
        content: "Un comité de pilotage assure le suivi de la stratégie IA et de la conformité.",
        keyPoints: [
          "Composition du comité",
          "Fréquence des réunions",
          "Ordre du jour type",
          "Indicateurs de suivi"
        ]
      },
      {
        id: 5,
        title: "Quiz du module",
        duration: "5 min",
        type: 'quiz'
      }
    ],
    quiz: [
      {
        id: 1,
        question: "Qui devrait être le sponsor de la gouvernance IA ?",
        options: ["Le stagiaire", "La direction générale", "Un consultant externe", "Personne"],
        correctIndex: 1,
        explanation: "La direction générale doit sponsoriser la gouvernance IA pour garantir les ressources et l'engagement."
      },
      {
        id: 2,
        question: "Le référent IA doit travailler avec :",
        options: ["Uniquement la DSI", "Uniquement le DPO", "Tous les départements concernés", "Personne"],
        correctIndex: 2,
        explanation: "Le référent IA est un rôle transverse qui implique une collaboration avec tous les départements."
      }
    ]
  },
  {
    id: 5,
    title: "Systèmes à haut risque",
    description: "Documentation technique et conformité",
    duration: "1h30",
    icon: "🔒",
    xp: 300,
    lessons: [
      {
        id: 1,
        title: "Identifier les systèmes à haut risque",
        duration: "15 min",
        type: 'video',
        content: "Les systèmes à haut risque sont listés à l'Annexe III de l'AI Act.",
        keyPoints: [
          "Annexe III : liste des domaines à haut risque",
          "Critères de classification",
          "Exceptions possibles",
          "Cas particuliers"
        ]
      },
      {
        id: 2,
        title: "Exigences de gestion des risques",
        duration: "12 min",
        type: 'video',
        content: "Un système de gestion des risques doit être mis en place tout au long du cycle de vie.",
        keyPoints: [
          "Identification des risques",
          "Évaluation et atténuation",
          "Risques résiduels acceptables",
          "Documentation continue"
        ]
      },
      {
        id: 3,
        title: "Data governance",
        duration: "15 min",
        type: 'video',
        content: "Les données d'entraînement et de test doivent respecter des critères de qualité stricts.",
        keyPoints: [
          "Qualité des données",
          "Représentativité et biais",
          "Traçabilité des datasets",
          "Conservation des données"
        ]
      },
      {
        id: 4,
        title: "Documentation technique",
        duration: "15 min",
        type: 'video',
        content: "Une documentation technique complète est obligatoire pour les systèmes à haut risque.",
        keyPoints: [
          "Contenu obligatoire",
          "Format et structure",
          "Mise à jour",
          "Conservation"
        ]
      },
      {
        id: 5,
        title: "Transparence et information",
        duration: "10 min",
        type: 'video',
        content: "Les utilisateurs doivent être informés qu'ils interagissent avec un système d'IA.",
        keyPoints: [
          "Notice d'utilisation",
          "Informations obligatoires",
          "Accessibilité de l'information",
          "Langue et format"
        ]
      },
      {
        id: 6,
        title: "Contrôle humain",
        duration: "10 min",
        type: 'video',
        content: "Un contrôle humain approprié doit être prévu pour les systèmes à haut risque.",
        keyPoints: [
          "Human-in-the-loop",
          "Human-on-the-loop",
          "Human-in-command",
          "Formation des opérateurs"
        ]
      },
      {
        id: 7,
        title: "Marquage CE",
        duration: "8 min",
        type: 'video',
        content: "Le marquage CE atteste de la conformité du système aux exigences de l'AI Act.",
        keyPoints: [
          "Procédure de marquage",
          "Organismes notifiés",
          "Déclaration de conformité",
          "Surveillance post-commercialisation"
        ]
      },
      {
        id: 8,
        title: "Quiz du module",
        duration: "5 min",
        type: 'quiz'
      }
    ],
    quiz: [
      {
        id: 1,
        question: "Où sont listés les systèmes à haut risque ?",
        options: ["Annexe I", "Annexe II", "Annexe III", "Annexe IV"],
        correctIndex: 2,
        explanation: "L'Annexe III de l'AI Act liste les domaines et cas d'usage considérés comme à haut risque."
      },
      {
        id: 2,
        question: "Le marquage CE pour l'IA signifie :",
        options: ["Conformité RGPD", "Conformité AI Act", "Made in Europe", "Certification ISO"],
        correctIndex: 1,
        explanation: "Le marquage CE atteste que le système d'IA est conforme aux exigences de l'AI Act."
      },
      {
        id: 3,
        question: "Human-in-the-loop signifie :",
        options: ["L'humain est informé", "L'humain valide chaque décision", "L'humain supervise", "L'humain est remplacé"],
        correctIndex: 1,
        explanation: "Human-in-the-loop implique qu'un humain valide chaque décision du système d'IA."
      }
    ]
  },
  {
    id: 6,
    title: "Audit et conformité",
    description: "Préparer et maintenir votre conformité",
    duration: "1h",
    icon: "✅",
    xp: 250,
    lessons: [
      {
        id: 1,
        title: "Audits internes IA",
        duration: "15 min",
        type: 'video',
        content: "Des audits réguliers permettent de vérifier et maintenir la conformité dans le temps.",
        keyPoints: [
          "Planification des audits",
          "Scope et objectifs",
          "Équipe d'audit",
          "Rapport et suivi"
        ]
      },
      {
        id: 2,
        title: "Indicateurs de conformité",
        duration: "12 min",
        type: 'video',
        content: "Des indicateurs permettent de suivre le niveau de conformité et d'identifier les axes d'amélioration.",
        keyPoints: [
          "KPIs de conformité",
          "Tableau de bord",
          "Alertes et seuils",
          "Reporting à la direction"
        ]
      },
      {
        id: 3,
        title: "Amélioration continue",
        duration: "10 min",
        type: 'video',
        content: "La conformité AI Act est un processus continu qui nécessite une amélioration permanente.",
        keyPoints: [
          "Cycle PDCA appliqué à l'IA",
          "Veille réglementaire",
          "Retours d'expérience",
          "Mise à jour des processus"
        ]
      },
      {
        id: 4,
        title: "Préparer les contrôles",
        duration: "12 min",
        type: 'video',
        content: "Les autorités de contrôle pourront vérifier la conformité des organisations.",
        keyPoints: [
          "Autorités compétentes",
          "Pouvoirs d'investigation",
          "Documentation à préparer",
          "Bonnes pratiques"
        ]
      },
      {
        id: 5,
        title: "Sanctions et responsabilités",
        duration: "8 min",
        type: 'video',
        content: "Le non-respect de l'AI Act peut entraîner des sanctions significatives.",
        keyPoints: [
          "Amendes jusqu'à 35M€ ou 7% du CA",
          "Gradation des sanctions",
          "Responsabilité des dirigeants",
          "Sanctions pénales possibles"
        ]
      },
      {
        id: 6,
        title: "Quiz du module",
        duration: "5 min",
        type: 'quiz'
      }
    ],
    quiz: [
      {
        id: 1,
        question: "Quelle est l'amende maximale prévue par l'AI Act ?",
        options: ["10M€", "20M€", "35M€ ou 7% du CA", "50M€"],
        correctIndex: 2,
        explanation: "L'amende maximale est de 35 millions d'euros ou 7% du chiffre d'affaires mondial annuel."
      },
      {
        id: 2,
        question: "À quelle fréquence réaliser des audits internes IA ?",
        options: ["Jamais", "Une fois puis plus jamais", "Régulièrement (au moins annuellement)", "Tous les 10 ans"],
        correctIndex: 2,
        explanation: "Des audits réguliers, au moins annuels, sont recommandés pour maintenir la conformité."
      },
      {
        id: 3,
        question: "Le cycle PDCA signifie :",
        options: ["Plan Do Check Act", "Prepare Document Control Audit", "Privacy Data Compliance Act", "Aucune de ces réponses"],
        correctIndex: 0,
        explanation: "PDCA (Plan-Do-Check-Act) est un cycle d'amélioration continue applicable à la conformité IA."
      }
    ]
  }
];

export default function FormationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Récupérer les paramètres URL
  const moduleId = parseInt(searchParams.get('module') || '1');
  const lessonId = parseInt(searchParams.get('lesson') || '1');
  
  // States
  const [currentModule, setCurrentModule] = useState<Module | null>(null);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [completedLessons, setCompletedLessons] = useState<number[]>([]);
  const [showSidebar, setShowSidebar] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [notes, setNotes] = useState('');
  
  // Quiz states
  const [quizMode, setQuizMode] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  
  // Celebration state
  const [showCelebration, setShowCelebration] = useState(false);
  const [earnedXP, setEarnedXP] = useState(0);

  // Charger le module
  useEffect(() => {
    const module = modulesData.find(m => m.id === moduleId);
    if (module) {
      setCurrentModule(module);
      setCurrentLessonIndex(Math.min(lessonId - 1, module.lessons.length - 1));
      // Simuler les leçons déjà complétées (basé sur la progression)
      const completedCount = Math.max(0, lessonId - 2);
      setCompletedLessons(Array.from({ length: completedCount }, (_, i) => i + 1));
    }
  }, [moduleId, lessonId]);

  if (!currentModule) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Chargement du module...</p>
        </div>
      </div>
    );
  }

  const currentLesson = currentModule.lessons[currentLessonIndex];
  const isLastLesson = currentLessonIndex === currentModule.lessons.length - 1;
  const isQuizLesson = currentLesson.type === 'quiz';
  const progress = ((currentLessonIndex + 1) / currentModule.lessons.length) * 100;

  // Navigation
  const goToLesson = (index: number) => {
    setCurrentLessonIndex(index);
    setQuizMode(false);
    setQuizSubmitted(false);
    setSelectedAnswers([]);
    setCurrentQuestionIndex(0);
    router.push(`/formation?module=${moduleId}&lesson=${index + 1}`, { scroll: false });
  };

  const completeLesson = () => {
    if (!completedLessons.includes(currentLessonIndex + 1)) {
      setCompletedLessons([...completedLessons, currentLessonIndex + 1]);
    }
    
    if (isLastLesson) {
      if (isQuizLesson && !quizSubmitted) {
        setQuizMode(true);
      }
    } else {
      goToLesson(currentLessonIndex + 1);
    }
  };

  const previousLesson = () => {
    if (currentLessonIndex > 0) {
      goToLesson(currentLessonIndex - 1);
    }
  };

  // Quiz functions
  const selectAnswer = (answerIndex: number) => {
    if (quizSubmitted) return;
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestionIndex] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < currentModule.quiz.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const submitQuiz = () => {
    let correct = 0;
    currentModule.quiz.forEach((q, i) => {
      if (selectedAnswers[i] === q.correctIndex) {
        correct++;
      }
    });
    const score = Math.round((correct / currentModule.quiz.length) * 100);
    setQuizScore(score);
    setQuizSubmitted(true);
    
    if (score >= 80) {
      setEarnedXP(currentModule.xp);
      setShowCelebration(true);
    }
  };

  const retakeQuiz = () => {
    setSelectedAnswers([]);
    setCurrentQuestionIndex(0);
    setQuizSubmitted(false);
    setQuizScore(0);
  };

  const finishModule = () => {
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex">
      {/* Sidebar */}
      <AnimatePresence>
        {showSidebar && (
          <motion.aside
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            className="w-80 bg-slate-900/95 border-r border-slate-800 flex flex-col fixed lg:relative h-screen z-40"
          >
            {/* Sidebar Header */}
            <div className="p-4 border-b border-slate-800">
              <Link href="/dashboard" className="flex items-center gap-2 text-slate-400 hover:text-white mb-4 transition-colors">
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm">Retour au dashboard</span>
              </Link>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center text-2xl">
                  {currentModule.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-slate-400 text-xs">Module {currentModule.id}</p>
                  <h2 className="text-white font-semibold truncate">{currentModule.title}</h2>
                </div>
              </div>
              
              {/* Progress */}
              <div className="mt-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-400">Progression</span>
                  <span className="text-cyan-400 font-medium">{Math.round(progress)}%</span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
                  />
                </div>
              </div>
            </div>

            {/* Lessons List */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-2">
                {currentModule.lessons.map((lesson, index) => {
                  const isCompleted = completedLessons.includes(index + 1);
                  const isCurrent = index === currentLessonIndex;
                  const isLocked = index > 0 && !completedLessons.includes(index);
                  
                  return (
                    <button
                      key={index}
                      onClick={() => !isLocked && goToLesson(index)}
                      disabled={isLocked}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left ${
                        isCurrent 
                          ? 'bg-cyan-500/20 border border-cyan-500/30' 
                          : isCompleted
                            ? 'bg-emerald-500/10 hover:bg-emerald-500/20'
                            : isLocked
                              ? 'opacity-50 cursor-not-allowed'
                              : 'hover:bg-slate-800'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                        isCompleted 
                          ? 'bg-emerald-500 text-white'
                          : isCurrent
                            ? 'bg-cyan-500 text-white'
                            : 'bg-slate-700 text-slate-400'
                      }`}>
                        {isCompleted ? <CheckCircle className="w-5 h-5" /> : index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium truncate ${
                          isCurrent ? 'text-cyan-400' : isCompleted ? 'text-emerald-400' : 'text-slate-300'
                        }`}>
                          {lesson.title}
                        </p>
                        <p className="text-slate-500 text-xs flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {lesson.duration}
                        </p>
                      </div>
                      {lesson.type === 'quiz' && (
                        <Award className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Sidebar Footer */}
            <div className="p-4 border-t border-slate-800">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">XP à gagner</span>
                <span className="text-yellow-400 font-bold flex items-center gap-1">
                  <Zap className="w-4 h-4" />
                  {currentModule.xp}
                </span>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Overlay for mobile sidebar */}
      {showSidebar && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setShowSidebar(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <header className="bg-slate-900/95 backdrop-blur-xl border-b border-slate-800 px-4 sm:px-6 py-3 sticky top-0 z-20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowSidebar(!showSidebar)}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div className="hidden sm:block">
                <p className="text-slate-400 text-xs">Leçon {currentLessonIndex + 1} / {currentModule.lessons.length}</p>
                <h1 className="text-white font-semibold">{currentLesson.title}</h1>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowNotes(!showNotes)}
                className={`p-2 rounded-lg transition-colors ${showNotes ? 'bg-cyan-500/20 text-cyan-400' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
              >
                <FileText className="w-5 h-5" />
              </button>
              <Link
                href="/dashboard"
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto">
          {quizMode ? (
            // Quiz View
            <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
              {!quizSubmitted ? (
                <>
                  {/* Quiz Progress */}
                  <div className="mb-8">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-slate-400">Question {currentQuestionIndex + 1} / {currentModule.quiz.length}</span>
                      <span className="text-cyan-400">{selectedAnswers.filter(a => a !== undefined).length} répondue(s)</span>
                    </div>
                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-cyan-500 rounded-full transition-all"
                        style={{ width: `${((currentQuestionIndex + 1) / currentModule.quiz.length) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Question */}
                  <motion.div
                    key={currentQuestionIndex}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 sm:p-8"
                  >
                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-6">
                      {currentModule.quiz[currentQuestionIndex].question}
                    </h3>

                    <div className="space-y-3">
                      {currentModule.quiz[currentQuestionIndex].options.map((option, idx) => (
                        <button
                          key={idx}
                          onClick={() => selectAnswer(idx)}
                          className={`w-full p-4 rounded-xl text-left transition-all flex items-center gap-3 ${
                            selectedAnswers[currentQuestionIndex] === idx
                              ? 'bg-cyan-500/20 border-2 border-cyan-500 text-white'
                              : 'bg-slate-700/50 border-2 border-transparent hover:bg-slate-700 text-slate-300'
                          }`}
                        >
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                            selectedAnswers[currentQuestionIndex] === idx
                              ? 'bg-cyan-500 text-white'
                              : 'bg-slate-600 text-slate-400'
                          }`}>
                            {String.fromCharCode(65 + idx)}
                          </div>
                          {option}
                        </button>
                      ))}
                    </div>
                  </motion.div>

                  {/* Quiz Navigation */}
                  <div className="flex justify-between mt-6">
                    <button
                      onClick={previousQuestion}
                      disabled={currentQuestionIndex === 0}
                      className="flex items-center gap-2 px-4 py-2 text-slate-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5" />
                      Précédent
                    </button>

                    {currentQuestionIndex === currentModule.quiz.length - 1 ? (
                      <button
                        onClick={submitQuiz}
                        disabled={selectedAnswers.length !== currentModule.quiz.length}
                        className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold px-6 py-2 rounded-xl transition-all flex items-center gap-2"
                      >
                        <CheckCircle className="w-5 h-5" />
                        Valider le quiz
                      </button>
                    ) : (
                      <button
                        onClick={nextQuestion}
                        disabled={selectedAnswers[currentQuestionIndex] === undefined}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl transition-colors"
                      >
                        Suivant
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </>
              ) : (
                // Quiz Results
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center"
                >
                  <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 ${
                    quizScore >= 80 ? 'bg-emerald-500/20' : 'bg-orange-500/20'
                  }`}>
                    {quizScore >= 80 ? (
                      <Trophy className="w-12 h-12 text-emerald-400" />
                    ) : (
                      <AlertTriangle className="w-12 h-12 text-orange-400" />
                    )}
                  </div>

                  <h2 className="text-3xl font-bold text-white mb-2">
                    {quizScore >= 80 ? 'Félicitations ! 🎉' : 'Pas encore...'}
                  </h2>
                  
                  <p className="text-slate-400 mb-6">
                    {quizScore >= 80 
                      ? `Vous avez obtenu ${quizScore}% de bonnes réponses !`
                      : `Vous avez obtenu ${quizScore}%. Il faut 80% pour valider.`
                    }
                  </p>

                  <div className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl mb-8 ${
                    quizScore >= 80 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-orange-500/20 text-orange-400'
                  }`}>
                    <span className="text-4xl font-bold">{quizScore}%</span>
                  </div>

                  {/* Review Answers */}
                  <div className="text-left bg-slate-800/50 border border-slate-700 rounded-2xl p-6 mb-6">
                    <h3 className="text-white font-semibold mb-4">Révision des réponses</h3>
                    <div className="space-y-4">
                      {currentModule.quiz.map((question, idx) => {
                        const isCorrect = selectedAnswers[idx] === question.correctIndex;
                        return (
                          <div key={idx} className={`p-4 rounded-xl ${isCorrect ? 'bg-emerald-500/10' : 'bg-red-500/10'}`}>
                            <div className="flex items-start gap-3">
                              <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                                isCorrect ? 'bg-emerald-500' : 'bg-red-500'
                              }`}>
                                {isCorrect ? <CheckCircle className="w-4 h-4 text-white" /> : <X className="w-4 h-4 text-white" />}
                              </div>
                              <div>
                                <p className="text-white font-medium mb-1">{question.question}</p>
                                <p className="text-sm text-slate-400">
                                  Votre réponse : <span className={isCorrect ? 'text-emerald-400' : 'text-red-400'}>
                                    {question.options[selectedAnswers[idx]]}
                                  </span>
                                </p>
                                {!isCorrect && (
                                  <p className="text-sm text-emerald-400 mt-1">
                                    Bonne réponse : {question.options[question.correctIndex]}
                                  </p>
                                )}
                                <p className="text-sm text-slate-500 mt-2 italic">{question.explanation}</p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    {quizScore < 80 && (
                      <button
                        onClick={retakeQuiz}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl transition-colors"
                      >
                        <RotateCcw className="w-5 h-5" />
                        Recommencer le quiz
                      </button>
                    )}
                    <button
                      onClick={finishModule}
                      className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-semibold rounded-xl transition-all"
                    >
                      {quizScore >= 80 ? 'Terminer le module' : 'Retour au dashboard'}
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          ) : (
            // Lesson View
            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
              {/* Video Player Placeholder */}
              <div className="bg-slate-800 rounded-2xl overflow-hidden mb-6 aspect-video relative group">
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900">
                  <div className="w-20 h-20 bg-cyan-500/20 rounded-full flex items-center justify-center mb-4 group-hover:bg-cyan-500/30 transition-colors cursor-pointer" onClick={() => setIsPlaying(!isPlaying)}>
                    {isPlaying ? (
                      <Pause className="w-10 h-10 text-cyan-400" />
                    ) : (
                      <Play className="w-10 h-10 text-cyan-400 ml-1" />
                    )}
                  </div>
                  <p className="text-slate-400 text-sm">Vidéo : {currentLesson.title}</p>
                  <p className="text-slate-500 text-xs mt-1">Durée : {currentLesson.duration}</p>
                </div>

                {/* Video Controls */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="h-1 bg-slate-700 rounded-full mb-3 cursor-pointer">
                    <div className="h-full w-1/3 bg-cyan-500 rounded-full relative">
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <button onClick={() => setIsPlaying(!isPlaying)} className="text-white hover:text-cyan-400 transition-colors">
                        {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                      </button>
                      <button className="text-white hover:text-cyan-400 transition-colors">
                        <SkipForward className="w-5 h-5" />
                      </button>
                      <button onClick={() => setIsMuted(!isMuted)} className="text-white hover:text-cyan-400 transition-colors">
                        {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                      </button>
                      <span className="text-white text-sm">3:24 / {currentLesson.duration}</span>
                    </div>
                    <button className="text-white hover:text-cyan-400 transition-colors">
                      <Maximize className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Lesson Content */}
              <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <h2 className="text-2xl font-bold text-white mb-4">{currentLesson.title}</h2>
                  <p className="text-slate-300 leading-relaxed mb-6">{currentLesson.content}</p>

                  {/* Key Points */}
                  {currentLesson.keyPoints && (
                    <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-xl p-5 mb-6">
                      <h3 className="text-cyan-400 font-semibold mb-3 flex items-center gap-2">
                        <Lightbulb className="w-5 h-5" />
                        Points clés à retenir
                      </h3>
                      <ul className="space-y-2">
                        {currentLesson.keyPoints.map((point, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-slate-300">
                            <CheckCircle className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                            {point}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Navigation */}
                  <div className="flex justify-between pt-6 border-t border-slate-800">
                    <button
                      onClick={previousLesson}
                      disabled={currentLessonIndex === 0}
                      className="flex items-center gap-2 px-4 py-2 text-slate-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5" />
                      Précédent
                    </button>

                    <button
                      onClick={completeLesson}
                      className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-semibold px-6 py-2 rounded-xl transition-all flex items-center gap-2"
                    >
                      {isLastLesson ? (
                        <>
                          <Award className="w-5 h-5" />
                          Passer le quiz
                        </>
                      ) : (
                        <>
                          Suivant
                          <ChevronRight className="w-5 h-5" />
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Sidebar - Notes or Resources */}
                <div className="space-y-4">
                  {/* Notes */}
                  {showNotes && (
                    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
                      <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-cyan-400" />
                        Mes notes
                      </h3>
                      <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Prenez des notes..."
                        className="w-full h-40 bg-slate-700/50 border border-slate-600 rounded-lg p-3 text-white placeholder-slate-500 resize-none focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      />
                    </div>
                  )}

                  {/* Module Info */}
                  <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
                    <h3 className="text-white font-semibold mb-3">À propos du module</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Durée totale</span>
                        <span className="text-white">{currentModule.duration}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Leçons</span>
                        <span className="text-white">{currentModule.lessons.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">XP à gagner</span>
                        <span className="text-yellow-400 font-bold">{currentModule.xp}</span>
                      </div>
                    </div>
                  </div>

                  {/* Related Resources */}
                  <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
                    <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                      <Download className="w-5 h-5 text-emerald-400" />
                      Ressources
                    </h3>
                    <div className="space-y-2">
                      <a href="#" className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-700/50 text-slate-300 hover:text-white transition-colors">
                        <FileText className="w-4 h-4 text-red-400" />
                        <span className="text-sm truncate">Guide Module {currentModule.id}</span>
                      </a>
                      <a href="#" className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-700/50 text-slate-300 hover:text-white transition-colors">
                        <FileText className="w-4 h-4 text-emerald-400" />
                        <span className="text-sm truncate">Template Excel</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Celebration Modal */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowCelebration(false)}
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-2xl p-8 max-w-md w-full text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-3xl font-bold text-white mb-2">Module terminé !</h2>
              <p className="text-slate-400 mb-6">
                Vous avez complété le module "{currentModule.title}" avec succès !
              </p>
              
              <div className="flex justify-center gap-6 mb-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-yellow-500/20 rounded-xl flex items-center justify-center mx-auto mb-2">
                    <Zap className="w-8 h-8 text-yellow-400" />
                  </div>
                  <p className="text-yellow-400 font-bold text-xl">+{earnedXP} XP</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-emerald-500/20 rounded-xl flex items-center justify-center mx-auto mb-2">
                    <Trophy className="w-8 h-8 text-emerald-400" />
                  </div>
                  <p className="text-emerald-400 font-bold text-xl">{quizScore}%</p>
                </div>
              </div>

              <button
                onClick={finishModule}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-semibold py-3 rounded-xl transition-all"
              >
                Retour au dashboard
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
