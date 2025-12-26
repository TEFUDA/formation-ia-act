// ============================================
// TYPES
// ============================================
export interface QuizOption {
  id: string;
  label: string;
  isCorrect: boolean;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: QuizOption[];
  feedback: string;
}

export interface Quiz {
  moduleId: number;
  title: string;
  description?: string;
  questions: QuizQuestion[];
  passingScore: number;
  maxAttempts: number;
}

// ============================================
// QUIZZES DATA
// ============================================
export const QUIZZES: Quiz[] = [
  {
    moduleId: 0,
    title: 'Quiz - Introduction à l\'AI Act',
    description: 'Testez vos connaissances sur les fondamentaux du règlement',
    passingScore: 70,
    maxAttempts: 3,
    questions: [
      {
        id: 'q0-1',
        question: 'Quel est l\'objectif principal de l\'AI Act ?',
        options: [
          { id: 'a', label: 'Interdire toute utilisation de l\'IA en Europe', isCorrect: false },
          { id: 'b', label: 'Encadrer l\'IA pour protéger les droits fondamentaux', isCorrect: true },
          { id: 'c', label: 'Promouvoir uniquement l\'IA européenne', isCorrect: false },
          { id: 'd', label: 'Taxer les entreprises utilisant l\'IA', isCorrect: false }
        ],
        feedback: 'L\'AI Act vise à encadrer l\'utilisation de l\'IA tout en protégeant les droits fondamentaux des citoyens européens.'
      },
      {
        id: 'q0-2',
        question: 'Quand l\'AI Act est-il entré en vigueur ?',
        options: [
          { id: 'a', label: 'Janvier 2024', isCorrect: false },
          { id: 'b', label: 'Août 2024', isCorrect: true },
          { id: 'c', label: 'Janvier 2025', isCorrect: false },
          { id: 'd', label: 'Août 2025', isCorrect: false }
        ],
        feedback: 'L\'AI Act est entré en vigueur le 1er août 2024, avec une application progressive jusqu\'en 2027.'
      },
      {
        id: 'q0-3',
        question: 'Combien de niveaux de risque sont définis dans l\'AI Act ?',
        options: [
          { id: 'a', label: '2 niveaux', isCorrect: false },
          { id: 'b', label: '3 niveaux', isCorrect: false },
          { id: 'c', label: '4 niveaux', isCorrect: true },
          { id: 'd', label: '5 niveaux', isCorrect: false }
        ],
        feedback: 'L\'AI Act définit 4 niveaux de risque : Inacceptable, Haut, Limité et Minimal.'
      }
    ]
  },
  {
    moduleId: 1,
    title: 'Quiz - Diagnostic Initial',
    description: 'Vérifiez votre compréhension des critères d\'application',
    passingScore: 70,
    maxAttempts: 3,
    questions: [
      {
        id: 'q1-1',
        question: 'Qui est concerné par l\'AI Act ?',
        options: [
          { id: 'a', label: 'Uniquement les entreprises européennes', isCorrect: false },
          { id: 'b', label: 'Toute organisation mettant des systèmes IA sur le marché européen', isCorrect: true },
          { id: 'c', label: 'Uniquement les grandes entreprises (+500 salariés)', isCorrect: false },
          { id: 'd', label: 'Uniquement les entreprises tech', isCorrect: false }
        ],
        feedback: 'L\'AI Act s\'applique à toute organisation qui met des systèmes IA sur le marché européen, quelle que soit sa localisation.'
      },
      {
        id: 'q1-2',
        question: 'Qu\'est-ce qu\'un "déployeur" au sens de l\'AI Act ?',
        options: [
          { id: 'a', label: 'Celui qui développe le système IA', isCorrect: false },
          { id: 'b', label: 'Celui qui utilise un système IA dans son activité professionnelle', isCorrect: true },
          { id: 'c', label: 'Celui qui vend des systèmes IA', isCorrect: false },
          { id: 'd', label: 'Celui qui importe des systèmes IA en Europe', isCorrect: false }
        ],
        feedback: 'Un déployeur est une personne ou organisation qui utilise un système IA dans le cadre de son activité professionnelle.'
      },
      {
        id: 'q1-3',
        question: 'Les PME ont-elles des obligations allégées ?',
        options: [
          { id: 'a', label: 'Oui, elles sont totalement exemptées', isCorrect: false },
          { id: 'b', label: 'Oui, certaines obligations sont adaptées pour les PME', isCorrect: true },
          { id: 'c', label: 'Non, les mêmes obligations s\'appliquent à tous', isCorrect: false },
          { id: 'd', label: 'Non, les PME ont plus d\'obligations', isCorrect: false }
        ],
        feedback: 'L\'AI Act prévoit des mesures de soutien et des obligations adaptées pour les PME, mais elles restent concernées.'
      }
    ]
  },
  {
    moduleId: 2,
    title: 'Quiz - Cartographie des Systèmes IA',
    description: 'Testez vos connaissances sur l\'inventaire des systèmes IA',
    passingScore: 70,
    maxAttempts: 3,
    questions: [
      {
        id: 'q2-1',
        question: 'Quel est le premier pas pour se mettre en conformité ?',
        options: [
          { id: 'a', label: 'Acheter un logiciel de conformité', isCorrect: false },
          { id: 'b', label: 'Inventorier tous les systèmes IA utilisés', isCorrect: true },
          { id: 'c', label: 'Engager un avocat spécialisé', isCorrect: false },
          { id: 'd', label: 'Arrêter d\'utiliser l\'IA', isCorrect: false }
        ],
        feedback: 'La cartographie des systèmes IA existants est la première étape indispensable de toute démarche de conformité.'
      },
      {
        id: 'q2-2',
        question: 'Que doit contenir le registre des systèmes IA ?',
        options: [
          { id: 'a', label: 'Uniquement le nom des outils', isCorrect: false },
          { id: 'b', label: 'Le nom, fournisseur, usage, données traitées et classification', isCorrect: true },
          { id: 'c', label: 'Uniquement les systèmes à haut risque', isCorrect: false },
          { id: 'd', label: 'Les mots de passe d\'accès', isCorrect: false }
        ],
        feedback: 'Le registre doit être complet : identification, fournisseur, finalité, données traitées, classification de risque, etc.'
      },
      {
        id: 'q2-3',
        question: 'ChatGPT utilisé par vos employés doit-il figurer dans le registre ?',
        options: [
          { id: 'a', label: 'Non, c\'est un outil grand public', isCorrect: false },
          { id: 'b', label: 'Oui, tout système IA utilisé professionnellement doit être répertorié', isCorrect: true },
          { id: 'c', label: 'Uniquement si c\'est la version payante', isCorrect: false },
          { id: 'd', label: 'Uniquement si plus de 10 employés l\'utilisent', isCorrect: false }
        ],
        feedback: 'Tout système IA utilisé dans le cadre professionnel doit figurer dans l\'inventaire, y compris les outils grand public.'
      }
    ]
  },
  {
    moduleId: 3,
    title: 'Quiz - Classification des Risques',
    description: 'Maîtrisez la classification des systèmes IA',
    passingScore: 70,
    maxAttempts: 3,
    questions: [
      {
        id: 'q3-1',
        question: 'Quel type de système IA est considéré comme "à risque inacceptable" ?',
        options: [
          { id: 'a', label: 'Un chatbot de service client', isCorrect: false },
          { id: 'b', label: 'Un système de notation sociale généralisée', isCorrect: true },
          { id: 'c', label: 'Un outil de traduction automatique', isCorrect: false },
          { id: 'd', label: 'Un système de recommandation de films', isCorrect: false }
        ],
        feedback: 'Les systèmes de notation sociale généralisée sont interdits car ils portent atteinte aux droits fondamentaux.'
      },
      {
        id: 'q3-2',
        question: 'Un système IA de tri de CV est généralement classé comme :',
        options: [
          { id: 'a', label: 'Risque minimal', isCorrect: false },
          { id: 'b', label: 'Risque limité', isCorrect: false },
          { id: 'c', label: 'Haut risque', isCorrect: true },
          { id: 'd', label: 'Risque inacceptable', isCorrect: false }
        ],
        feedback: 'Les systèmes IA utilisés dans le recrutement sont considérés comme à haut risque car ils impactent directement les droits des personnes.'
      },
      {
        id: 'q3-3',
        question: 'Quelle obligation s\'applique aux systèmes à "risque limité" ?',
        options: [
          { id: 'a', label: 'Aucune obligation', isCorrect: false },
          { id: 'b', label: 'Obligation de transparence (informer l\'utilisateur)', isCorrect: true },
          { id: 'c', label: 'Audit externe obligatoire', isCorrect: false },
          { id: 'd', label: 'Interdiction totale', isCorrect: false }
        ],
        feedback: 'Les systèmes à risque limité (chatbots, deepfakes...) doivent informer clairement les utilisateurs qu\'ils interagissent avec une IA.'
      }
    ]
  },
  {
    moduleId: 4,
    title: 'Quiz - Documentation Technique',
    description: 'Testez vos connaissances sur les exigences documentaires',
    passingScore: 70,
    maxAttempts: 3,
    questions: [
      {
        id: 'q4-1',
        question: 'Qui est responsable de fournir la documentation technique ?',
        options: [
          { id: 'a', label: 'Uniquement le déployeur', isCorrect: false },
          { id: 'b', label: 'Le fournisseur du système IA', isCorrect: true },
          { id: 'c', label: 'L\'autorité de surveillance', isCorrect: false },
          { id: 'd', label: 'Les utilisateurs finaux', isCorrect: false }
        ],
        feedback: 'Le fournisseur a l\'obligation de produire et maintenir la documentation technique de son système IA.'
      },
      {
        id: 'q4-2',
        question: 'Combien de temps la documentation technique doit-elle être conservée ?',
        options: [
          { id: 'a', label: '1 an', isCorrect: false },
          { id: 'b', label: '5 ans', isCorrect: false },
          { id: 'c', label: '10 ans après la mise sur le marché', isCorrect: true },
          { id: 'd', label: 'Indéfiniment', isCorrect: false }
        ],
        feedback: 'La documentation technique doit être conservée pendant 10 ans après la mise sur le marché du système IA.'
      },
      {
        id: 'q4-3',
        question: 'Que doit contenir l\'évaluation des risques ?',
        options: [
          { id: 'a', label: 'Uniquement les risques financiers', isCorrect: false },
          { id: 'b', label: 'Les risques pour les droits fondamentaux et la sécurité', isCorrect: true },
          { id: 'c', label: 'Uniquement les bugs techniques', isCorrect: false },
          { id: 'd', label: 'Les risques concurrentiels', isCorrect: false }
        ],
        feedback: 'L\'évaluation doit couvrir les risques pour les droits fondamentaux, la santé, la sécurité et l\'environnement.'
      }
    ]
  },
  {
    moduleId: 5,
    title: 'Quiz - Gouvernance & Politique IA',
    description: 'Vérifiez vos connaissances sur la gouvernance IA',
    passingScore: 70,
    maxAttempts: 3,
    questions: [
      {
        id: 'q5-1',
        question: 'Une politique d\'utilisation de l\'IA est-elle obligatoire ?',
        options: [
          { id: 'a', label: 'Oui, pour toutes les entreprises', isCorrect: false },
          { id: 'b', label: 'Non, mais fortement recommandée pour démontrer la conformité', isCorrect: true },
          { id: 'c', label: 'Uniquement pour les systèmes à haut risque', isCorrect: false },
          { id: 'd', label: 'Non, c\'est inutile', isCorrect: false }
        ],
        feedback: 'Bien que non explicitement obligatoire, une politique IA est essentielle pour prouver une démarche de conformité.'
      },
      {
        id: 'q5-2',
        question: 'Quand faut-il informer qu\'un contenu est généré par IA ?',
        options: [
          { id: 'a', label: 'Jamais, c\'est confidentiel', isCorrect: false },
          { id: 'b', label: 'Toujours, pour tout type de contenu', isCorrect: false },
          { id: 'c', label: 'Pour les deepfakes et contenus pouvant tromper le public', isCorrect: true },
          { id: 'd', label: 'Uniquement si le client le demande', isCorrect: false }
        ],
        feedback: 'L\'AI Act impose une transparence pour les contenus générés par IA susceptibles de tromper (deepfakes, chatbots...).'
      },
      {
        id: 'q5-3',
        question: 'Qui doit former les employés à l\'utilisation de l\'IA ?',
        options: [
          { id: 'a', label: 'Les fournisseurs d\'IA uniquement', isCorrect: false },
          { id: 'b', label: 'L\'employeur (déployeur)', isCorrect: true },
          { id: 'c', label: 'L\'État', isCorrect: false },
          { id: 'd', label: 'Personne, c\'est facultatif', isCorrect: false }
        ],
        feedback: 'L\'employeur a la responsabilité de s\'assurer que ses employés ont les compétences pour utiliser les systèmes IA.'
      }
    ]
  },
  {
    moduleId: 6,
    title: 'Quiz - Simulation d\'Audit',
    description: 'Préparez-vous aux contrôles de conformité',
    passingScore: 70,
    maxAttempts: 3,
    questions: [
      {
        id: 'q6-1',
        question: 'Qui peut effectuer un audit de conformité AI Act ?',
        options: [
          { id: 'a', label: 'Uniquement la Commission Européenne', isCorrect: false },
          { id: 'b', label: 'Les autorités nationales de surveillance du marché', isCorrect: true },
          { id: 'c', label: 'N\'importe quelle entreprise', isCorrect: false },
          { id: 'd', label: 'Personne, il n\'y a pas d\'audit prévu', isCorrect: false }
        ],
        feedback: 'Les autorités nationales de surveillance du marché sont habilitées à contrôler la conformité des systèmes IA.'
      },
      {
        id: 'q6-2',
        question: 'Quel est le montant maximal d\'amende pour non-conformité ?',
        options: [
          { id: 'a', label: '1 million d\'euros', isCorrect: false },
          { id: 'b', label: '10 millions d\'euros', isCorrect: false },
          { id: 'c', label: '35 millions d\'euros ou 7% du CA mondial', isCorrect: true },
          { id: 'd', label: '100 millions d\'euros', isCorrect: false }
        ],
        feedback: 'Les amendes peuvent atteindre 35 millions d\'euros ou 7% du CA mondial pour les violations les plus graves.'
      },
      {
        id: 'q6-3',
        question: 'Quel document devez-vous absolument avoir prêt pour un audit ?',
        options: [
          { id: 'a', label: 'Le business plan de l\'entreprise', isCorrect: false },
          { id: 'b', label: 'Le registre des systèmes IA et leur documentation', isCorrect: true },
          { id: 'c', label: 'Les CV des développeurs', isCorrect: false },
          { id: 'd', label: 'Les factures des fournisseurs IA', isCorrect: false }
        ],
        feedback: 'Le registre des systèmes IA avec leur classification et documentation technique est essentiel pour tout audit.'
      }
    ]
  },
  {
    moduleId: 7,
    title: 'Quiz Final - Certification',
    description: 'Évaluation finale pour obtenir votre certificat',
    passingScore: 80,
    maxAttempts: 2,
    questions: [
      {
        id: 'q7-1',
        question: 'Quelle est la première échéance importante de l\'AI Act ?',
        options: [
          { id: 'a', label: 'Février 2025 - Interdiction des IA à risque inacceptable', isCorrect: true },
          { id: 'b', label: 'Août 2025 - Toutes les obligations entrent en vigueur', isCorrect: false },
          { id: 'c', label: 'Août 2026 - Application complète', isCorrect: false },
          { id: 'd', label: 'Janvier 2027 - Fin de la période de transition', isCorrect: false }
        ],
        feedback: 'Dès février 2025, les systèmes IA à risque inacceptable sont interdits.'
      },
      {
        id: 'q7-2',
        question: 'Résumez les 3 actions prioritaires pour un déployeur :',
        options: [
          { id: 'a', label: 'Acheter, installer, utiliser', isCorrect: false },
          { id: 'b', label: 'Inventorier, classifier, documenter', isCorrect: true },
          { id: 'c', label: 'Ignorer, attendre, voir', isCorrect: false },
          { id: 'd', label: 'Former, recruter, investir', isCorrect: false }
        ],
        feedback: 'Les 3 actions clés : inventorier ses systèmes IA, les classifier selon le risque, et constituer la documentation.'
      },
      {
        id: 'q7-3',
        question: 'Pour les systèmes à haut risque, quelle obligation est nouvelle ?',
        options: [
          { id: 'a', label: 'Payer une taxe IA', isCorrect: false },
          { id: 'b', label: 'Évaluation de conformité et marquage CE', isCorrect: true },
          { id: 'c', label: 'Embaucher un DPO supplémentaire', isCorrect: false },
          { id: 'd', label: 'Publier le code source', isCorrect: false }
        ],
        feedback: 'Les systèmes à haut risque doivent passer une évaluation de conformité et obtenir le marquage CE.'
      },
      {
        id: 'q7-4',
        question: 'L\'AI Act s\'applique-t-il aux IA utilisées à titre personnel ?',
        options: [
          { id: 'a', label: 'Oui, sans exception', isCorrect: false },
          { id: 'b', label: 'Non, uniquement aux usages professionnels', isCorrect: true },
          { id: 'c', label: 'Uniquement si l\'IA est payante', isCorrect: false },
          { id: 'd', label: 'Selon le pays de résidence', isCorrect: false }
        ],
        feedback: 'L\'AI Act ne s\'applique pas aux usages purement personnels et non professionnels.'
      },
      {
        id: 'q7-5',
        question: 'Quel est le rôle du "Bureau européen de l\'IA" ?',
        options: [
          { id: 'a', label: 'Vendre des licences IA', isCorrect: false },
          { id: 'b', label: 'Coordonner l\'application de l\'AI Act au niveau européen', isCorrect: true },
          { id: 'c', label: 'Développer des systèmes IA européens', isCorrect: false },
          { id: 'd', label: 'Former les entreprises gratuitement', isCorrect: false }
        ],
        feedback: 'Le Bureau européen de l\'IA coordonne l\'application cohérente du règlement dans tous les États membres.'
      }
    ]
  }
];

// ============================================
// UTILITY FUNCTIONS
// ============================================
export function getQuizByModuleId(moduleId: number): Quiz | undefined {
  return QUIZZES.find(q => q.moduleId === moduleId);
}

export function calculateQuizScore(
  quiz: Quiz,
  answers: Record<string, string>
): { score: number; passed: boolean; correctCount: number; totalQuestions: number } {
  let correctCount = 0;
  
  for (const question of quiz.questions) {
    const userAnswer = answers[question.id];
    const correctOption = question.options.find(o => o.isCorrect);
    
    if (userAnswer && correctOption && userAnswer === correctOption.id) {
      correctCount++;
    }
  }
  
  const score = Math.round((correctCount / quiz.questions.length) * 100);
  const passed = score >= quiz.passingScore;
  
  return {
    score,
    passed,
    correctCount,
    totalQuestions: quiz.questions.length
  };
}

export function getAllQuizzes(): Quiz[] {
  return QUIZZES;
}

export function getQuizProgress(
  quizScores: Record<number, number>
): { completed: number; total: number; averageScore: number } {
  const completedQuizzes = Object.keys(quizScores).length;
  const totalQuizzes = QUIZZES.length;
  const scores = Object.values(quizScores);
  const averageScore = scores.length > 0
    ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
    : 0;
  
  return {
    completed: completedQuizzes,
    total: totalQuizzes,
    averageScore
  };
}
