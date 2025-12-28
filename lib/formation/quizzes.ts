// ============================================
// TYPES
// ============================================
export interface QuizOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface QuizQuestion {
  id: string;
  type?: 'qcm' | 'vrai-faux' | 'cas-pratique';
  question: string;
  options: QuizOption[];
  feedback: string;
  articleRef?: string; // Référence à l'article AI Act
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
// MODULE 0 : QUIZ D'INTRODUCTION (10 questions)
// ============================================
const quizModule0: Quiz = {
  moduleId: 1,
  title: "Quiz - Introduction à l'AI Act",
  description: "Testez vos connaissances sur les fondamentaux du règlement",
  passingScore: 80,
  maxAttempts: 2,
  questions: [
    {
      id: 'q0-1',
      type: 'qcm',
      question: "Quel est l'objectif principal de cette formation ?",
      options: [
        { id: 'a', text: "Devenir développeur d'IA", isCorrect: false },
        { id: 'b', text: "Apprendre à coder des algorithmes", isCorrect: false },
        { id: 'c', text: "Mettre en conformité son entreprise avec l'AI Act", isCorrect: true },
        { id: 'd', text: "Obtenir une certification internationale", isCorrect: false }
      ],
      feedback: "Exact ! Cette formation vous transforme en expert opérationnel pour la conformité AI Act, pas en développeur."
    },
    {
      id: 'q0-2',
      type: 'qcm',
      question: "À quelle date les systèmes IA à haut risque doivent-ils être totalement conformes ?",
      options: [
        { id: 'a', text: "2 février 2025", isCorrect: false },
        { id: 'b', text: "2 août 2025", isCorrect: false },
        { id: 'c', text: "2 août 2026", isCorrect: true },
        { id: 'd', text: "2 août 2027", isCorrect: false }
      ],
      feedback: "Correct ! Août 2026 est la deadline critique pour les systèmes à haut risque (RH, santé, crédit...). Vous avez moins de 2 ans pour être prêt !"
    },
    {
      id: 'q0-3',
      type: 'qcm',
      question: "Quel est le montant moyen d'une amende AI Act pour une PME ?",
      options: [
        { id: 'a', text: "15 000€", isCorrect: false },
        { id: 'b', text: "150 000€", isCorrect: true },
        { id: 'c', text: "1 500 000€", isCorrect: false },
        { id: 'd', text: "15 000 000€", isCorrect: false }
      ],
      feedback: "Oui, 150 000€ est le montant moyen estimé. Pour une grande entreprise, cela peut aller jusqu'à 35M€ ou 7% du CA mondial.",
      articleRef: "Article 99"
    },
    {
      id: 'q0-4',
      type: 'qcm',
      question: "Combien de temps dure cette formation complète ?",
      options: [
        { id: 'a', text: "4 heures", isCorrect: false },
        { id: 'b', text: "8 heures", isCorrect: true },
        { id: 'c', text: "16 heures", isCorrect: false },
        { id: 'd', text: "24 heures", isCorrect: false }
      ],
      feedback: "Parfaitement ! 8 heures intensives pour devenir opérationnel, avec des exercices pratiques et des outils concrets."
    },
    {
      id: 'q0-5',
      type: 'vrai-faux',
      question: "Les outils fournis dans la formation sont uniquement des démonstrations sans valeur opérationnelle.",
      options: [
        { id: 'a', text: "Vrai", isCorrect: false },
        { id: 'b', text: "Faux", isCorrect: true }
      ],
      feedback: "Faux ! Vous repartez avec 12+ templates professionnels réutilisables : registre IA, politique, fiches de conformité..."
    },
    {
      id: 'q0-6',
      type: 'qcm',
      question: "Quel règlement européen l'AI Act complète-t-il naturellement ?",
      options: [
        { id: 'a', text: "Le RGPD (protection des données)", isCorrect: true },
        { id: 'b', text: "Le règlement eIDAS (identité numérique)", isCorrect: false },
        { id: 'c', text: "La directive NIS2 (cybersécurité)", isCorrect: false },
        { id: 'd', text: "Le Digital Services Act", isCorrect: false }
      ],
      feedback: "Exact ! L'AI Act et le RGPD sont complémentaires. Si vous traitez des données personnelles avec de l'IA, les deux s'appliquent."
    },
    {
      id: 'q0-7',
      type: 'qcm',
      question: "Depuis quelle date l'obligation de former les collaborateurs (Article 4) est-elle applicable ?",
      options: [
        { id: 'a', text: "Juin 2024", isCorrect: false },
        { id: 'b', text: "Février 2025", isCorrect: true },
        { id: 'c', text: "Août 2025", isCorrect: false },
        { id: 'd', text: "Août 2026", isCorrect: false }
      ],
      feedback: "Correct ! L'article 4 sur la maîtrise de l'IA est applicable depuis février 2025. C'est pourquoi cette formation est urgente !",
      articleRef: "Article 4"
    },
    {
      id: 'q0-8',
      type: 'qcm',
      question: "Combien de niveaux de risque l'AI Act définit-il ?",
      options: [
        { id: 'a', text: "2 niveaux", isCorrect: false },
        { id: 'b', text: "3 niveaux", isCorrect: false },
        { id: 'c', text: "4 niveaux", isCorrect: true },
        { id: 'd', text: "5 niveaux", isCorrect: false }
      ],
      feedback: "Exact ! Les 4 niveaux sont : Inacceptable (interdit), Haut risque, Risque limité, et Risque minimal.",
      articleRef: "Article 6 & Annexe III"
    },
    {
      id: 'q0-9',
      type: 'vrai-faux',
      question: "L'AI Act s'applique uniquement aux entreprises qui développent de l'IA.",
      options: [
        { id: 'a', text: "Vrai", isCorrect: false },
        { id: 'b', text: "Faux", isCorrect: true }
      ],
      feedback: "Faux ! L'AI Act s'applique aussi aux 'déployeurs', c'est-à-dire toutes les entreprises qui UTILISENT des systèmes d'IA."
    },
    {
      id: 'q0-10',
      type: 'qcm',
      question: "Quelles sont les 3 actions prioritaires pour un déployeur AI Act ?",
      options: [
        { id: 'a', text: "Acheter, installer, utiliser", isCorrect: false },
        { id: 'b', text: "Inventorier, classifier, documenter", isCorrect: true },
        { id: 'c', text: "Attendre, observer, réagir", isCorrect: false },
        { id: 'd', text: "Former, recruter, investir", isCorrect: false }
      ],
      feedback: "Parfait ! Les 3 actions clés pour tout déployeur sont : inventorier ses systèmes IA, les classifier selon le risque, et constituer la documentation requise."
    }
  ]
};

// ============================================
// MODULE 2 : QUIZ DIAGNOSTIC (10 questions)
// ============================================
const quizModule1: Quiz = {
  moduleId: 2,
  title: "Quiz - Classification des Systèmes IA",
  description: "Vérifiez votre compréhension de la classification des risques",
  passingScore: 80,
  maxAttempts: 2,
  questions: [
    {
      id: 'q1-1',
      type: 'qcm',
      question: "Une entreprise qui utilise ChatGPT pour analyser des données clients est-elle concernée par l'AI Act ?",
      options: [
        { id: 'a', text: "Non, ChatGPT est américain", isCorrect: false },
        { id: 'b', text: "Oui, car utilisation professionnelle sur données clients", isCorrect: true },
        { id: 'c', text: "Seulement si plus de 250 salariés", isCorrect: false },
        { id: 'd', text: "Seulement pour la version payante", isCorrect: false }
      ],
      feedback: "Correct ! Toute utilisation professionnelle d'IA est concernée, quelle que soit la taille de l'entreprise ou l'origine de l'outil."
    },
    {
      id: 'q1-2',
      type: 'qcm',
      question: "Quelle est la première étape obligatoire selon l'AI Act ?",
      options: [
        { id: 'a', text: "Développer sa propre IA", isCorrect: false },
        { id: 'b', text: "Recenser tous ses systèmes d'IA", isCorrect: true },
        { id: 'c', text: "Souscrire une assurance", isCorrect: false },
        { id: 'd', text: "Former tous les employés", isCorrect: false }
      ],
      feedback: "Exact ! Sans recensement complet, impossible de savoir quelles règles appliquer. C'est le point de départ de toute conformité.",
      articleRef: "Article 29"
    },
    {
      id: 'q1-3',
      type: 'qcm',
      question: "Un outil de tri automatique de CV est classé :",
      options: [
        { id: 'a', text: "Risque minimal", isCorrect: false },
        { id: 'b', text: "Risque limité", isCorrect: false },
        { id: 'c', text: "Haut risque", isCorrect: true },
        { id: 'd', text: "Inacceptable", isCorrect: false }
      ],
      feedback: "Parfait ! Le recrutement fait partie des domaines à haut risque (Annexe III, point 4a). Tout système IA impactant l'emploi est concerné.",
      articleRef: "Annexe III, point 4a"
    },
    {
      id: 'q1-4',
      type: 'qcm',
      question: "L'obligation de former les collaborateurs (Article 4) est applicable depuis :",
      options: [
        { id: 'a', text: "Juin 2024", isCorrect: false },
        { id: 'b', text: "Février 2025", isCorrect: true },
        { id: 'c', text: "Août 2026", isCorrect: false },
        { id: 'd', text: "Ce n'est pas obligatoire", isCorrect: false }
      ],
      feedback: "Correct ! L'article 4 est applicable depuis février 2025. C'est une des premières obligations en vigueur !",
      articleRef: "Article 4"
    },
    {
      id: 'q1-5',
      type: 'vrai-faux',
      question: "Un chatbot sur un site web nécessite seulement une mention de transparence.",
      options: [
        { id: 'a', text: "Vrai", isCorrect: true },
        { id: 'b', text: "Faux", isCorrect: false }
      ],
      feedback: "Exact ! Les chatbots sont en risque limité : obligation principale d'informer l'utilisateur qu'il interagit avec une IA.",
      articleRef: "Article 50"
    },
    {
      id: 'q1-6',
      type: 'qcm',
      question: "Quelle amende pour absence de documentation technique sur un système à haut risque ?",
      options: [
        { id: 'a', text: "Avertissement seulement", isCorrect: false },
        { id: 'b', text: "50 000€ maximum", isCorrect: false },
        { id: 'c', text: "Jusqu'à 7,5M€ ou 1,5% du CA", isCorrect: true },
        { id: 'd', text: "Pas d'amende spécifique", isCorrect: false }
      ],
      feedback: "Correct ! L'absence de documentation technique est sévèrement sanctionnée par le règlement.",
      articleRef: "Article 99"
    },
    {
      id: 'q1-7',
      type: 'qcm',
      question: "Qu'est-ce qu'un 'déployeur' au sens de l'AI Act ?",
      options: [
        { id: 'a', text: "Celui qui développe le système IA", isCorrect: false },
        { id: 'b', text: "Celui qui utilise un système IA dans son activité professionnelle", isCorrect: true },
        { id: 'c', text: "Celui qui vend des systèmes IA", isCorrect: false },
        { id: 'd', text: "Celui qui importe des systèmes IA en Europe", isCorrect: false }
      ],
      feedback: "Exact ! Un déployeur est une personne ou organisation qui utilise un système IA dans le cadre de son activité professionnelle. C'est probablement VOTRE cas !",
      articleRef: "Article 3"
    },
    {
      id: 'q1-8',
      type: 'cas-pratique',
      question: "Votre entreprise utilise un logiciel de comptabilité avec de l'IA intégrée. Êtes-vous concerné par l'AI Act ?",
      options: [
        { id: 'a', text: "Non, c'est un simple logiciel de gestion", isCorrect: false },
        { id: 'b', text: "Oui, si l'IA prend des décisions automatisées", isCorrect: true },
        { id: 'c', text: "Seulement si vous avez plus de 50 employés", isCorrect: false },
        { id: 'd', text: "Uniquement si le logiciel est européen", isCorrect: false }
      ],
      feedback: "Correct ! Dès qu'un système utilise de l'IA pour automatiser des décisions, vous êtes concerné. Il faut évaluer son niveau de risque."
    },
    {
      id: 'q1-9',
      type: 'qcm',
      question: "Qui peut effectuer un contrôle de conformité AI Act ?",
      options: [
        { id: 'a', text: "Uniquement la Commission Européenne", isCorrect: false },
        { id: 'b', text: "Les autorités nationales de surveillance du marché", isCorrect: true },
        { id: 'c', text: "N'importe quel cabinet d'audit", isCorrect: false },
        { id: 'd', text: "Personne, il n'y a pas de contrôle prévu", isCorrect: false }
      ],
      feedback: "Les autorités nationales (en France : la CNIL et l'ARCEP notamment) sont habilitées à contrôler la conformité des systèmes IA.",
      articleRef: "Article 74"
    },
    {
      id: 'q1-10',
      type: 'vrai-faux',
      question: "Les PME ont les mêmes obligations que les grandes entreprises sous l'AI Act.",
      options: [
        { id: 'a', text: "Vrai", isCorrect: false },
        { id: 'b', text: "Faux", isCorrect: true }
      ],
      feedback: "Faux ! L'AI Act prévoit des mesures de soutien et certaines obligations adaptées pour les PME, mais elles restent concernées par les obligations fondamentales."
    }
  ]
};

// ============================================
// MODULE 2 : QUIZ CARTOGRAPHIE (10 questions)
// ============================================
const quizModule2: Quiz = {
  moduleId: 2,
  title: "Quiz - Cartographie des Systèmes IA",
  description: "Testez vos connaissances sur l'inventaire des systèmes IA",
  passingScore: 80,
  maxAttempts: 2,
  questions: [
    {
      id: 'q2-1',
      type: 'qcm',
      question: "Le 'Shadow IT' désigne :",
      options: [
        { id: 'a', text: "Les IA développées en interne", isCorrect: false },
        { id: 'b', text: "Les usages IA non autorisés/non documentés par l'entreprise", isCorrect: true },
        { id: 'c', text: "Les systèmes à haut risque", isCorrect: false },
        { id: 'd', text: "Les fournisseurs étrangers", isCorrect: false }
      ],
      feedback: "Exact ! Le Shadow IT représente environ 60% des usages IA en entreprise. C'est un risque majeur de non-conformité."
    },
    {
      id: 'q2-2',
      type: 'qcm',
      question: "Combien de zones d'ombre faut-il investiguer systématiquement pour trouver les IA cachées ?",
      options: [
        { id: 'a', text: "3 zones", isCorrect: false },
        { id: 'b', text: "5 zones", isCorrect: true },
        { id: 'c', text: "7 zones", isCorrect: false },
        { id: 'd', text: "10 zones", isCorrect: false }
      ],
      feedback: "Correct ! Les 5 zones sont : outils métier, SaaS/cloud, prestataires externes, usages personnels des employés, et projets en cours."
    },
    {
      id: 'q2-3',
      type: 'vrai-faux',
      question: "Un correcteur orthographique avancé qui apprend de vos corrections n'est pas de l'IA.",
      options: [
        { id: 'a', text: "Vrai", isCorrect: false },
        { id: 'b', text: "Faux", isCorrect: true }
      ],
      feedback: "Faux ! Un correcteur qui apprend et s'adapte utilise du machine learning, c'est de l'IA au sens de l'AI Act."
    },
    {
      id: 'q2-4',
      type: 'qcm',
      question: "Quelle méthode est la plus efficace pour détecter le Shadow IT ?",
      options: [
        { id: 'a', text: "Questionnaire anonyme aux collaborateurs", isCorrect: false },
        { id: 'b', text: "Analyse technique avec la DSI (flux réseau, licences)", isCorrect: true },
        { id: 'c', text: "Revue des contrats fournisseurs uniquement", isCorrect: false },
        { id: 'd', text: "Analyse des budgets de l'année", isCorrect: false }
      ],
      feedback: "Correct ! L'analyse technique donne une vision objective des outils réellement utilisés, contrairement aux déclarations parfois incomplètes."
    },
    {
      id: 'q2-5',
      type: 'qcm',
      question: "Les 5 informations essentielles à documenter pour chaque système IA sont :",
      options: [
        { id: 'a', text: "Nom, Prix, Date achat, Fournisseur, Contact", isCorrect: false },
        { id: 'b', text: "Nom, Usage, Données traitées, Utilisateurs, Fournisseur", isCorrect: true },
        { id: 'c', text: "Nom, Version, Langage, Algorithme, Performance", isCorrect: false },
        { id: 'd', text: "Nom, Risque, Documentation, Audit, Responsable", isCorrect: false }
      ],
      feedback: "Parfait ! Ces 5 informations constituent la base minimale pour ensuite classifier et documenter correctement."
    },
    {
      id: 'q2-6',
      type: 'cas-pratique',
      question: "Vous découvrez que 3 commerciaux utilisent ChatGPT Plus avec leur compte personnel pour le travail. Que faites-vous ?",
      options: [
        { id: 'a', text: "Le documentez dans votre registre et évaluez les risques", isCorrect: true },
        { id: 'b', text: "Le signalez à la direction pour sanction", isCorrect: false },
        { id: 'c', text: "L'ignorez car c'est personnel", isCorrect: false },
        { id: 'd', text: "Le bannissez immédiatement sans analyse", isCorrect: false }
      ],
      feedback: "Correct ! Documentez d'abord, puis évaluez les risques (données clients partagées ?), et enfin mettez en place des règles encadrant cet usage."
    },
    {
      id: 'q2-7',
      type: 'qcm',
      question: "Quel est le premier pas pour se mettre en conformité ?",
      options: [
        { id: 'a', text: "Acheter un logiciel de conformité", isCorrect: false },
        { id: 'b', text: "Inventorier tous les systèmes IA utilisés", isCorrect: true },
        { id: 'c', text: "Engager un avocat spécialisé", isCorrect: false },
        { id: 'd', text: "Arrêter d'utiliser l'IA", isCorrect: false }
      ],
      feedback: "La cartographie des systèmes IA existants est la première étape indispensable de toute démarche de conformité.",
      articleRef: "Article 29"
    },
    {
      id: 'q2-8',
      type: 'qcm',
      question: "ChatGPT utilisé par vos employés doit-il figurer dans le registre ?",
      options: [
        { id: 'a', text: "Non, c'est un outil grand public", isCorrect: false },
        { id: 'b', text: "Oui, tout système IA utilisé professionnellement doit être répertorié", isCorrect: true },
        { id: 'c', text: "Uniquement si c'est la version payante", isCorrect: false },
        { id: 'd', text: "Uniquement si plus de 10 employés l'utilisent", isCorrect: false }
      ],
      feedback: "Tout système IA utilisé dans le cadre professionnel doit figurer dans l'inventaire, y compris les outils grand public comme ChatGPT."
    },
    {
      id: 'q2-9',
      type: 'qcm',
      question: "Quelle est la fréquence recommandée de mise à jour du registre IA ?",
      options: [
        { id: 'a', text: "Une fois par an", isCorrect: false },
        { id: 'b', text: "À chaque changement + revue trimestrielle", isCorrect: true },
        { id: 'c', text: "Tous les 6 mois", isCorrect: false },
        { id: 'd', text: "Uniquement lors d'un audit", isCorrect: false }
      ],
      feedback: "Le registre doit être un document vivant : mise à jour à chaque nouveau système ou modification, et revue complète trimestrielle."
    },
    {
      id: 'q2-10',
      type: 'vrai-faux',
      question: "Les systèmes IA utilisés par vos prestataires pour traiter vos données doivent figurer dans votre registre.",
      options: [
        { id: 'a', text: "Vrai", isCorrect: true },
        { id: 'b', text: "Faux", isCorrect: false }
      ],
      feedback: "Vrai ! Si un prestataire utilise de l'IA pour traiter vos données ou celles de vos clients, vous devez le savoir et le documenter."
    }
  ]
};

// ============================================
// MODULE 3 : QUIZ CLASSIFICATION (10 questions)
// ============================================
const quizModule3: Quiz = {
  moduleId: 3,
  title: "Quiz - Classification des Risques",
  description: "Maîtrisez la classification des systèmes IA",
  passingScore: 80,
  maxAttempts: 2,
  questions: [
    {
      id: 'q3-1',
      type: 'qcm',
      question: "Un système qui analyse les émotions des employés en réunion est classé :",
      options: [
        { id: 'a', text: "Haut risque", isCorrect: false },
        { id: 'b', text: "Risque limité", isCorrect: false },
        { id: 'c', text: "Inacceptable (interdit)", isCorrect: true },
        { id: 'd', text: "Risque minimal", isCorrect: false }
      ],
      feedback: "Exact ! La reconnaissance des émotions sur le lieu de travail est INTERDITE par l'AI Act. C'est une pratique à risque inacceptable.",
      articleRef: "Article 5"
    },
    {
      id: 'q3-2',
      type: 'qcm',
      question: "Un chatbot RH qui informe sur les congés est classé :",
      options: [
        { id: 'a', text: "Risque limité", isCorrect: true },
        { id: 'b', text: "Haut risque", isCorrect: false },
        { id: 'c', text: "Inacceptable", isCorrect: false },
        { id: 'd', text: "Risque minimal", isCorrect: false }
      ],
      feedback: "Correct ! Il informe mais ne décide pas → risque limité. Obligation principale : transparence (informer que c'est une IA).",
      articleRef: "Article 50"
    },
    {
      id: 'q3-3',
      type: 'qcm',
      question: "Quelle exception peut transformer un système 'haut risque' en risque inférieur ?",
      options: [
        { id: 'a', text: "Le système est peu utilisé", isCorrect: false },
        { id: 'b', text: "Il prépare une décision que l'humain valide systématiquement", isCorrect: true },
        { id: 'c', text: "Il coûte moins de 10 000€", isCorrect: false },
        { id: 'd', text: "Il vient d'un fournisseur européen", isCorrect: false }
      ],
      feedback: "Exact ! L'article 6(3) prévoit que si le système ne fait que préparer une décision validée par un humain, il peut ne pas être classé haut risque.",
      articleRef: "Article 6(3)"
    },
    {
      id: 'q3-4',
      type: 'qcm',
      question: "Un outil de scoring client pour le marketing est classé :",
      options: [
        { id: 'a', text: "Haut risque", isCorrect: false },
        { id: 'b', text: "Risque limité", isCorrect: true },
        { id: 'c', text: "Inacceptable", isCorrect: false },
        { id: 'd', text: "Cela dépend de l'usage exact", isCorrect: false }
      ],
      feedback: "Pour le marketing = risque limité. ATTENTION : pour une décision de crédit = haut risque. Le même outil peut avoir des classifications différentes selon l'usage !",
      articleRef: "Annexe III, point 5b"
    },
    {
      id: 'q3-5',
      type: 'qcm',
      question: "Règle d'or en cas de doute sur la classification :",
      options: [
        { id: 'a', text: "Classifiez bas pour éviter les contraintes", isCorrect: false },
        { id: 'b', text: "Classifiez haut pour être prudent", isCorrect: true },
        { id: 'c', text: "Demandez à votre fournisseur de décider", isCorrect: false },
        { id: 'd', text: "Ne classez pas et attendez les contrôles", isCorrect: false }
      ],
      feedback: "Exact ! Mieux vaut des garanties supplémentaires qu'une amende. En cas de contrôle, le doute joue contre vous."
    },
    {
      id: 'q3-6',
      type: 'cas-pratique',
      question: "Un outil de maintenance prédictive sur une imprimante de bureau. Classification ?",
      options: [
        { id: 'a', text: "Haut risque", isCorrect: false },
        { id: 'b', text: "Risque minimal", isCorrect: true },
        { id: 'c', text: "Inacceptable", isCorrect: false },
        { id: 'd', text: "Risque limité", isCorrect: false }
      ],
      feedback: "Correct ! Pas d'impact sur la santé, la sécurité ou les droits fondamentaux → risque minimal. Peu d'obligations spécifiques."
    },
    {
      id: 'q3-7',
      type: 'qcm',
      question: "Combien de temps devez-vous conserver la justification de votre classification ?",
      options: [
        { id: 'a', text: "1 an", isCorrect: false },
        { id: 'b', text: "3 ans", isCorrect: false },
        { id: 'c', text: "10 ans après la fin d'utilisation", isCorrect: true },
        { id: 'd', text: "Indéfiniment", isCorrect: false }
      ],
      feedback: "Parfait ! 10 ans minimum après la fin d'utilisation du système. L'AI Act pense long terme.",
      articleRef: "Article 18"
    },
    {
      id: 'q3-8',
      type: 'qcm',
      question: "Quel type de système IA est considéré comme 'à risque inacceptable' ?",
      options: [
        { id: 'a', text: "Un chatbot de service client", isCorrect: false },
        { id: 'b', text: "Un système de notation sociale généralisée", isCorrect: true },
        { id: 'c', text: "Un outil de traduction automatique", isCorrect: false },
        { id: 'd', text: "Un système de recommandation de films", isCorrect: false }
      ],
      feedback: "Les systèmes de notation sociale généralisée (type 'crédit social' chinois) sont totalement interdits en Europe.",
      articleRef: "Article 5"
    },
    {
      id: 'q3-9',
      type: 'cas-pratique',
      question: "Votre système IA de présélection de CV est utilisé uniquement pour faciliter le travail des recruteurs qui examinent TOUS les CV. Classification ?",
      options: [
        { id: 'a', text: "Haut risque - c'est du recrutement", isCorrect: false },
        { id: 'b', text: "Peut être exclu du haut risque si l'humain décide vraiment", isCorrect: true },
        { id: 'c', text: "Risque minimal - c'est juste un outil", isCorrect: false },
        { id: 'd', text: "Inacceptable - on ne peut pas utiliser l'IA pour les CV", isCorrect: false }
      ],
      feedback: "Correct ! L'exception de l'article 6(3) peut s'appliquer si l'IA est un simple outil préparatoire et que l'humain prend vraiment la décision finale. Mais documentez bien !"
    },
    {
      id: 'q3-10',
      type: 'qcm',
      question: "Un système de vidéosurveillance avec reconnaissance faciale dans un magasin est classé :",
      options: [
        { id: 'a', text: "Risque minimal", isCorrect: false },
        { id: 'b', text: "Risque limité", isCorrect: false },
        { id: 'c', text: "Haut risque", isCorrect: true },
        { id: 'd', text: "Inacceptable", isCorrect: false }
      ],
      feedback: "Haut risque ! La reconnaissance biométrique à des fins d'identification est haut risque. Attention : certains usages (identification de masse en temps réel par les forces de l'ordre) sont interdits.",
      articleRef: "Annexe III, point 1"
    }
  ]
};

// ============================================
// MODULE 4 : QUIZ DOCUMENTATION (10 questions)
// ============================================
const quizModule4: Quiz = {
  moduleId: 4,
  title: "Quiz - Documentation Technique",
  description: "Maîtrisez les exigences documentaires",
  passingScore: 80,
  maxAttempts: 2,
  questions: [
    {
      id: 'q4-1',
      type: 'qcm',
      question: "Qui doit produire la documentation technique pour un système que vous utilisez ?",
      options: [
        { id: 'a', text: "Vous (le déployeur)", isCorrect: false },
        { id: 'b', text: "Le fournisseur", isCorrect: true },
        { id: 'c', text: "L'autorité de contrôle", isCorrect: false },
        { id: 'd', text: "Un consultant externe", isCorrect: false }
      ],
      feedback: "Correct ! En tant que déployeur, vous devez EXIGER et OBTENIR la documentation du fournisseur. C'est son obligation.",
      articleRef: "Article 13"
    },
    {
      id: 'q4-2',
      type: 'qcm',
      question: "Combien d'éléments doit contenir la documentation technique (Annexe IV) ?",
      options: [
        { id: 'a', text: "5 éléments", isCorrect: false },
        { id: 'b', text: "7 éléments clés", isCorrect: true },
        { id: 'c', text: "10 éléments", isCorrect: false },
        { id: 'd', text: "12 éléments", isCorrect: false }
      ],
      feedback: "Exact ! Les 7 éléments sont : description, architecture, données, performance, risques, supervision humaine, journalisation.",
      articleRef: "Annexe IV"
    },
    {
      id: 'q4-3',
      type: 'cas-pratique',
      question: "Un fournisseur répond 'C'est confidentiel' à votre demande de documentation. Vous :",
      options: [
        { id: 'a', text: "Acceptez et abandonnez", isCorrect: false },
        { id: 'b', text: "Demandez une version résumée/anonymisée respectant le secret commercial", isCorrect: true },
        { id: 'c', text: "Portez plainte immédiatement", isCorrect: false },
        { id: 'd', text: "Changez de fournisseur sans délai", isCorrect: false }
      ],
      feedback: "Correct ! La négociation d'une version adaptée est la bonne approche. Le fournisseur peut protéger certains détails tout en vous donnant les infos nécessaires."
    },
    {
      id: 'q4-4',
      type: 'qcm',
      question: "La fiche de supervision humaine doit contenir :",
      options: [
        { id: 'a', text: "Le code source du système", isCorrect: false },
        { id: 'b', text: "Le responsable, la fréquence des contrôles, les points de vérification", isCorrect: true },
        { id: 'c', text: "Les factures d'achat", isCorrect: false },
        { id: 'd', text: "Les CV des développeurs", isCorrect: false }
      ],
      feedback: "Parfait ! Simple, clair, opérationnel. Qui contrôle, quand, et que vérifie-t-on.",
      articleRef: "Article 14"
    },
    {
      id: 'q4-5',
      type: 'qcm',
      question: "Durée de conservation de la documentation technique :",
      options: [
        { id: 'a', text: "1 an après l'achat", isCorrect: false },
        { id: 'b', text: "3 ans après la fin d'utilisation", isCorrect: false },
        { id: 'c', text: "10 ans après la fin d'utilisation", isCorrect: true },
        { id: 'd', text: "20 ans", isCorrect: false }
      ],
      feedback: "Exact ! L'AI Act exige une conservation de 10 ans après la mise hors service du système.",
      articleRef: "Article 18"
    },
    {
      id: 'q4-6',
      type: 'cas-pratique',
      question: "Votre fournisseur ne répond pas à vos demandes de documentation après 2 relances. Prochaine étape ?",
      options: [
        { id: 'a', text: "Attendre encore 1 mois", isCorrect: false },
        { id: 'b', text: "Escalader vers son service juridique avec mise en demeure", isCorrect: true },
        { id: 'c', text: "Abandonner, ce n'est pas grave", isCorrect: false },
        { id: 'd', text: "Arrêter d'utiliser le système immédiatement", isCorrect: false }
      ],
      feedback: "Correct ! La persistance et l'escalade sont souvent nécessaires. Documentez vos démarches - c'est une preuve de diligence pour les contrôles."
    },
    {
      id: 'q4-7',
      type: 'qcm',
      question: "Quel document justifie vos choix de classification des risques ?",
      options: [
        { id: 'a', text: "Un simple email", isCorrect: false },
        { id: 'b', text: "Une matrice d'analyse avec critères AI Act", isCorrect: true },
        { id: 'c', text: "L'avis du fournisseur", isCorrect: false },
        { id: 'd', text: "Rien, c'est évident", isCorrect: false }
      ],
      feedback: "Exact ! Une matrice documentée avec les critères de l'Annexe III vous protège en cas de contrôle."
    },
    {
      id: 'q4-8',
      type: 'vrai-faux',
      question: "Un système à risque minimal ne nécessite aucune documentation.",
      options: [
        { id: 'a', text: "Vrai", isCorrect: false },
        { id: 'b', text: "Faux", isCorrect: true }
      ],
      feedback: "Faux ! Même les systèmes à risque minimal doivent a minima figurer dans votre registre avec leur classification justifiée."
    },
    {
      id: 'q4-9',
      type: 'qcm',
      question: "Les logs des décisions IA doivent être conservés :",
      options: [
        { id: 'a', text: "1 an", isCorrect: false },
        { id: 'b', text: "5 ans ou selon la durée imposée par le système", isCorrect: true },
        { id: 'c', text: "Indéfiniment", isCorrect: false },
        { id: 'd', text: "Pas de conservation obligatoire", isCorrect: false }
      ],
      feedback: "Correct ! Minimum 5 ans pour les systèmes à haut risque, sauf si le fournisseur impose une durée différente dans ses specs.",
      articleRef: "Article 12"
    },
    {
      id: 'q4-10',
      type: 'qcm',
      question: "Le 'dossier de conformité' complet pour un système haut risque comprend :",
      options: [
        { id: 'a', text: "Uniquement la documentation technique", isCorrect: false },
        { id: 'b', text: "Doc technique + AIPD + preuves supervision + journaux", isCorrect: true },
        { id: 'c', text: "Les contrats fournisseurs seulement", isCorrect: false },
        { id: 'd', text: "Le code source du système", isCorrect: false }
      ],
      feedback: "Parfait ! Le dossier complet inclut : documentation technique (Annexe IV), analyse d'impact (AIPD), preuves de supervision humaine, et journaux d'événements.",
      articleRef: "Article 11 & Annexe IV"
    }
  ]
};

// ============================================
// MODULE 5 : QUIZ POLITIQUE & TRANSPARENCE (10 questions)
// ============================================
const quizModule5: Quiz = {
  moduleId: 5,
  title: "Quiz - Politique IA & Transparence",
  description: "Maîtrisez les obligations de transparence",
  passingScore: 80,
  maxAttempts: 2,
  questions: [
    {
      id: 'q5-1',
      type: 'qcm',
      question: "Quel article de l'AI Act impose la transparence sur l'utilisation d'IA ?",
      options: [
        { id: 'a', text: "Article 4", isCorrect: false },
        { id: 'b', text: "Article 50", isCorrect: true },
        { id: 'c', text: "Article 14", isCorrect: false },
        { id: 'd', text: "Article 26", isCorrect: false }
      ],
      feedback: "Correct ! L'article 50 impose l'information des utilisateurs pour les systèmes à risque limité.",
      articleRef: "Article 50"
    },
    {
      id: 'q5-2',
      type: 'qcm',
      question: "Une mention de transparence sur un chatbot doit apparaître :",
      options: [
        { id: 'a', text: "Seulement dans les CGU", isCorrect: false },
        { id: 'b', text: "Dès le premier échange, de façon claire", isCorrect: true },
        { id: 'c', text: "Après 5 minutes de conversation", isCorrect: false },
        { id: 'd', text: "Sur demande de l'utilisateur seulement", isCorrect: false }
      ],
      feedback: "Exact ! Immédiatement visible et claire. L'utilisateur doit savoir dès le départ qu'il interagit avec une IA.",
      articleRef: "Article 50"
    },
    {
      id: 'q5-3',
      type: 'qcm',
      question: "Dans votre politique IA, la catégorie 'Conditionnel' signifie :",
      options: [
        { id: 'a', text: "Jamais autorisé", isCorrect: false },
        { id: 'b', text: "Autorisé avec validation préalable et règles spécifiques", isCorrect: true },
        { id: 'c', text: "Réservé à la direction", isCorrect: false },
        { id: 'd', text: "Seulement pour les tests", isCorrect: false }
      ],
      feedback: "Correct ! 'Conditionnel' = usage possible mais encadré : validation par un responsable, règles d'usage spécifiques, données sensibles exclues, etc."
    },
    {
      id: 'q5-4',
      type: 'qcm',
      question: "Qui doit signer la politique IA pour qu'elle soit officielle ?",
      options: [
        { id: 'a', text: "Le référent IA", isCorrect: false },
        { id: 'b', text: "Le directeur général ou un membre du COMEX", isCorrect: true },
        { id: 'c', text: "Le DSI uniquement", isCorrect: false },
        { id: 'd', text: "Tous les employés", isCorrect: false }
      ],
      feedback: "Parfait ! La signature de la direction montre l'engagement de l'entreprise et donne une valeur officielle au document."
    },
    {
      id: 'q5-5',
      type: 'qcm',
      question: "Pour un site e-commerce avec recommandations personnalisées, quelle mention est obligatoire ?",
      options: [
        { id: 'a', text: "'Nos recommandations utilisent l'IA'", isCorrect: true },
        { id: 'b', text: "'Notre site est sécurisé'", isCorrect: false },
        { id: 'c', text: "'Nous respectons le RGPD'", isCorrect: false },
        { id: 'd', text: "Aucune mention spécifique", isCorrect: false }
      ],
      feedback: "Exact ! Les systèmes de recommandation par IA doivent être clairement identifiés.",
      articleRef: "Article 50"
    },
    {
      id: 'q5-6',
      type: 'vrai-faux',
      question: "Une politique IA peut être identique pour toutes les entreprises.",
      options: [
        { id: 'a', text: "Vrai", isCorrect: false },
        { id: 'b', text: "Faux", isCorrect: true }
      ],
      feedback: "Faux ! Elle doit être personnalisée selon votre secteur, vos usages spécifiques, votre taille et vos risques propres."
    },
    {
      id: 'q5-7',
      type: 'qcm',
      question: "Quelle sanction pour absence de mention de transparence ?",
      options: [
        { id: 'a', text: "Simple avertissement", isCorrect: false },
        { id: 'b', text: "Jusqu'à 7,5M€ ou 1,5% du CA mondial", isCorrect: true },
        { id: 'c', text: "Interdiction d'utiliser l'IA", isCorrect: false },
        { id: 'd', text: "Pas de sanction spécifique", isCorrect: false }
      ],
      feedback: "Correct ! Même pour les obligations de transparence (risque limité), les sanctions sont significatives.",
      articleRef: "Article 99"
    },
    {
      id: 'q5-8',
      type: 'qcm',
      question: "Qui doit former les employés à l'utilisation de l'IA dans l'entreprise ?",
      options: [
        { id: 'a', text: "Les fournisseurs d'IA uniquement", isCorrect: false },
        { id: 'b', text: "L'employeur (le déployeur)", isCorrect: true },
        { id: 'c', text: "L'État via des formations publiques", isCorrect: false },
        { id: 'd', text: "Personne, c'est facultatif", isCorrect: false }
      ],
      feedback: "L'employeur a la responsabilité de s'assurer que ses employés ont les compétences pour utiliser les systèmes IA de façon appropriée.",
      articleRef: "Article 4"
    },
    {
      id: 'q5-9',
      type: 'qcm',
      question: "Quand faut-il informer qu'un contenu est généré par IA ?",
      options: [
        { id: 'a', text: "Jamais, c'est confidentiel", isCorrect: false },
        { id: 'b', text: "Toujours, pour tout type de contenu", isCorrect: false },
        { id: 'c', text: "Pour les deepfakes et contenus pouvant tromper le public", isCorrect: true },
        { id: 'd', text: "Uniquement si le client le demande", isCorrect: false }
      ],
      feedback: "L'AI Act impose une transparence pour les contenus générés par IA susceptibles de tromper : deepfakes, textes ressemblant à du contenu humain, etc.",
      articleRef: "Article 50"
    },
    {
      id: 'q5-10',
      type: 'cas-pratique',
      question: "Votre chatbot d'assistance s'appelle 'Sophie' avec un avatar humain. Problème ?",
      options: [
        { id: 'a', text: "Non, c'est plus engageant pour les clients", isCorrect: false },
        { id: 'b', text: "Oui, il doit être clair que c'est une IA, pas une personne", isCorrect: true },
        { id: 'c', text: "Seulement si les clients le demandent", isCorrect: false },
        { id: 'd', text: "Non, tant que le service est bon", isCorrect: false }
      ],
      feedback: "Correct ! Donner un prénom et un avatar humains à une IA sans mention claire viole l'obligation de transparence de l'article 50.",
      articleRef: "Article 50"
    }
  ]
};

// ============================================
// MODULE 6 : QUIZ SIMULATION D'AUDIT (10 questions)
// ============================================
const quizModule6: Quiz = {
  moduleId: 6,
  title: "Quiz - Simulation d'Audit",
  description: "Préparez-vous aux contrôles de conformité",
  passingScore: 80,
  maxAttempts: 2,
  questions: [
    {
      id: 'q6-1',
      type: 'qcm',
      question: "Un auditeur AI Act vous demande votre registre des systèmes IA. Vous avez :",
      options: [
        { id: 'a', text: "24 heures pour le produire", isCorrect: false },
        { id: 'b', text: "Quelques heures maximum", isCorrect: true },
        { id: 'c', text: "1 semaine", isCorrect: false },
        { id: 'd', text: "1 mois", isCorrect: false }
      ],
      feedback: "Exact ! En contrôle, on attend une réponse rapide. Le registre doit être prêt et accessible à tout moment."
    },
    {
      id: 'q6-2',
      type: 'cas-pratique',
      question: "L'auditeur demande la documentation technique d'un système haut risque. Votre fournisseur ne l'a jamais envoyée. Vous répondez :",
      options: [
        { id: 'a', text: "'On fait confiance au fournisseur'", isCorrect: false },
        { id: 'b', text: "'Voici notre demande du [date] et les relances. Nous avons un plan de remédiation.'", isCorrect: true },
        { id: 'c', text: "'C'est confidentiel'", isCorrect: false },
        { id: 'd', text: "'On n'utilise plus ce système' (mensonge)", isCorrect: false }
      ],
      feedback: "Parfait ! Montrez votre diligence et votre plan d'action. La transparence sur les difficultés est mieux perçue que le déni."
    },
    {
      id: 'q6-3',
      type: 'cas-pratique',
      question: "L'auditeur remarque qu'un chatbot n'a pas de mention 'IA'. Vous :",
      options: [
        { id: 'a', text: "'Merci de nous le signaler. Correction prévue sous 48h avec preuve envoyée.'", isCorrect: true },
        { id: 'b', text: "'Les utilisateurs le savent implicitement'", isCorrect: false },
        { id: 'c', text: "'C'est la responsabilité du fournisseur'", isCorrect: false },
        { id: 'd', text: "'Ce n'est pas obligatoire pour les petits chatbots'", isCorrect: false }
      ],
      feedback: "Correct ! Reconnaître l'écart et s'engager sur une correction rapide est la meilleure approche."
    },
    {
      id: 'q6-4',
      type: 'cas-pratique',
      question: "Question piège de l'auditeur : 'Pouvez-vous prouver l'absence de biais dans votre outil RH ?'",
      options: [
        { id: 'a', text: "'Oui, il est très performant'", isCorrect: false },
        { id: 'b', text: "'C'est le fournisseur qui garantit ça'", isCorrect: false },
        { id: 'c', text: "'Voici notre procédure d'audit trimestrielle et les derniers résultats de tests.'", isCorrect: true },
        { id: 'd', text: "'Nous n'avons reçu aucune plainte'", isCorrect: false }
      ],
      feedback: "Parfait ! Montrez des preuves de votre processus de surveillance : méthode, fréquence, résultats, actions correctives.",
      articleRef: "Article 10"
    },
    {
      id: 'q6-5',
      type: 'qcm',
      question: "Phrase à ne JAMAIS dire à un auditeur :",
      options: [
        { id: 'a', text: "'Je vais chercher l'information'", isCorrect: false },
        { id: 'b', text: "'Ce n'est pas mon problème, c'est la DSI'", isCorrect: true },
        { id: 'c', text: "'Pouvez-vous préciser votre demande ?'", isCorrect: false },
        { id: 'd', text: "'Nous avons documenté cette décision'", isCorrect: false }
      ],
      feedback: "Exact ! Montrez toujours votre implication et votre responsabilité. Renvoyer vers quelqu'un d'autre donne une image de désorganisation."
    },
    {
      id: 'q6-6',
      type: 'qcm',
      question: "Les 5 documents à sortir en PRIORITÉ lors d'un contrôle sont :",
      options: [
        { id: 'a', text: "Factures, contrats, emails, CV, organigramme", isCorrect: false },
        { id: 'b', text: "Registre IA, documentation technique, politique IA, preuves formation, plan d'action", isCorrect: true },
        { id: 'c', text: "Bilan comptable, statuts, PV d'AG, règlement intérieur, contrats", isCorrect: false },
        { id: 'd', text: "Charte RGPD, analyse d'impact RGPD, registre traitements, mentions légales", isCorrect: false }
      ],
      feedback: "Parfait ! Ces 5 documents couvrent l'essentiel de ce qu'un auditeur AI Act vérifiera en premier."
    },
    {
      id: 'q6-7',
      type: 'qcm',
      question: "Qui peut effectuer un audit de conformité AI Act ?",
      options: [
        { id: 'a', text: "Uniquement la Commission Européenne", isCorrect: false },
        { id: 'b', text: "Les autorités nationales de surveillance du marché", isCorrect: true },
        { id: 'c', text: "N'importe quelle entreprise certifiée", isCorrect: false },
        { id: 'd', text: "Personne, il n'y a pas d'audit prévu", isCorrect: false }
      ],
      feedback: "Les autorités nationales (CNIL, ARCEP, DGCCRF selon les domaines) sont habilitées à contrôler la conformité.",
      articleRef: "Article 74"
    },
    {
      id: 'q6-8',
      type: 'qcm',
      question: "Quel est le montant maximal d'amende pour non-conformité grave ?",
      options: [
        { id: 'a', text: "1 million d'euros", isCorrect: false },
        { id: 'b', text: "10 millions d'euros", isCorrect: false },
        { id: 'c', text: "35 millions d'euros ou 7% du CA mondial", isCorrect: true },
        { id: 'd', text: "100 millions d'euros", isCorrect: false }
      ],
      feedback: "Les amendes peuvent atteindre 35M€ ou 7% du CA mondial pour les violations les plus graves (systèmes interdits, fraude).",
      articleRef: "Article 99"
    },
    {
      id: 'q6-9',
      type: 'cas-pratique',
      question: "L'auditeur demande : 'Montrez-moi comment un humain supervise les décisions de votre IA de recrutement.' Vous :",
      options: [
        { id: 'a', text: "Lui montrez l'interface et expliquez le processus de validation", isCorrect: true },
        { id: 'b', text: "Dites que le système est fiable et n'a pas besoin de supervision", isCorrect: false },
        { id: 'c', text: "Appelez le fournisseur pour répondre", isCorrect: false },
        { id: 'd', text: "Dites que vous n'êtes pas au courant des détails", isCorrect: false }
      ],
      feedback: "Correct ! Démontrez concrètement le processus : qui valide, sur quels critères, quelle fréquence, quelle traçabilité.",
      articleRef: "Article 14"
    },
    {
      id: 'q6-10',
      type: 'qcm',
      question: "Quel document devez-vous absolument avoir prêt pour un audit ?",
      options: [
        { id: 'a', text: "Le business plan de l'entreprise", isCorrect: false },
        { id: 'b', text: "Le registre des systèmes IA et leur documentation", isCorrect: true },
        { id: 'c', text: "Les CV des développeurs", isCorrect: false },
        { id: 'd', text: "Les factures des fournisseurs IA", isCorrect: false }
      ],
      feedback: "Le registre des systèmes IA avec leur classification et documentation technique est le document essentiel pour tout audit."
    }
  ]
};

// ============================================
// MODULE 7 : QUIZ FINAL - CERTIFICATION (12 questions)
// ============================================
const quizModule7: Quiz = {
  moduleId: 7,
  title: "Quiz Final - Certification",
  description: "Évaluation finale pour obtenir votre certificat",
  passingScore: 85,
  maxAttempts: 2,
  questions: [
    {
      id: 'q7-1',
      type: 'qcm',
      question: "Quelle est la première échéance importante de l'AI Act ?",
      options: [
        { id: 'a', text: "Février 2025 - Interdiction des IA à risque inacceptable + Article 4", isCorrect: true },
        { id: 'b', text: "Août 2025 - Toutes les obligations entrent en vigueur", isCorrect: false },
        { id: 'c', text: "Août 2026 - Application pour les systèmes haut risque", isCorrect: false },
        { id: 'd', text: "Janvier 2027 - Fin de la période de transition", isCorrect: false }
      ],
      feedback: "Dès février 2025, les systèmes IA à risque inacceptable sont interdits ET l'obligation de maîtrise de l'IA (Article 4) s'applique.",
      articleRef: "Article 5 & Article 4"
    },
    {
      id: 'q7-2',
      type: 'qcm',
      question: "Résumez les 3 actions prioritaires pour un déployeur :",
      options: [
        { id: 'a', text: "Acheter, installer, utiliser", isCorrect: false },
        { id: 'b', text: "Inventorier, classifier, documenter", isCorrect: true },
        { id: 'c', text: "Ignorer, attendre, voir", isCorrect: false },
        { id: 'd', text: "Former, recruter, investir", isCorrect: false }
      ],
      feedback: "Les 3 actions clés : inventorier ses systèmes IA, les classifier selon le risque, et constituer la documentation requise."
    },
    {
      id: 'q7-3',
      type: 'qcm',
      question: "Pour les systèmes à haut risque, quelle obligation est nouvelle avec l'AI Act ?",
      options: [
        { id: 'a', text: "Payer une taxe IA", isCorrect: false },
        { id: 'b', text: "Évaluation de conformité et marquage CE", isCorrect: true },
        { id: 'c', text: "Embaucher un DPO supplémentaire", isCorrect: false },
        { id: 'd', text: "Publier le code source", isCorrect: false }
      ],
      feedback: "Les systèmes à haut risque doivent passer une évaluation de conformité et obtenir le marquage CE avant mise sur le marché.",
      articleRef: "Article 43"
    },
    {
      id: 'q7-4',
      type: 'vrai-faux',
      question: "L'AI Act s'applique aux IA utilisées à titre purement personnel et non professionnel.",
      options: [
        { id: 'a', text: "Vrai", isCorrect: false },
        { id: 'b', text: "Faux", isCorrect: true }
      ],
      feedback: "Faux ! L'AI Act ne s'applique pas aux usages purement personnels et non professionnels (ex: ChatGPT pour ses devoirs)."
    },
    {
      id: 'q7-5',
      type: 'qcm',
      question: "Quel est le rôle du 'Bureau européen de l'IA' ?",
      options: [
        { id: 'a', text: "Vendre des licences IA aux entreprises", isCorrect: false },
        { id: 'b', text: "Coordonner l'application de l'AI Act au niveau européen", isCorrect: true },
        { id: 'c', text: "Développer des systèmes IA européens", isCorrect: false },
        { id: 'd', text: "Former les entreprises gratuitement", isCorrect: false }
      ],
      feedback: "Le Bureau européen de l'IA (AI Office) coordonne l'application cohérente du règlement dans tous les États membres."
    },
    {
      id: 'q7-6',
      type: 'qcm',
      question: "À quelle fréquence devez-vous mettre à jour votre registre IA ?",
      options: [
        { id: 'a', text: "Une fois par an", isCorrect: false },
        { id: 'b', text: "En continu + revue trimestrielle formelle", isCorrect: true },
        { id: 'c', text: "Seulement lors de nouveaux achats", isCorrect: false },
        { id: 'd', text: "Tous les 5 ans", isCorrect: false }
      ],
      feedback: "Exact ! Un registre vivant, mis à jour à chaque changement, avec une revue formelle trimestrielle."
    },
    {
      id: 'q7-7',
      type: 'qcm',
      question: "Le cycle PDCA appliqué à l'AI Act signifie :",
      options: [
        { id: 'a', text: "Planifier, Déléguer, Contrôler, Abandonner", isCorrect: false },
        { id: 'b', text: "Planifier, Déployer, Contrôler, Améliorer", isCorrect: true },
        { id: 'c', text: "Protéger, Documenter, Certifier, Archiver", isCorrect: false },
        { id: 'd', text: "Prévenir, Détecter, Corriger, Anticiper", isCorrect: false }
      ],
      feedback: "Correct ! Le cycle d'amélioration continue : Planifier les actions, Déployer, Contrôler les résultats, Améliorer."
    },
    {
      id: 'q7-8',
      type: 'qcm',
      question: "Votre tableau de bord de conformité doit inclure :",
      options: [
        { id: 'a', text: "Le nombre d'employés formés à l'IA", isCorrect: false },
        { id: 'b', text: "Le pourcentage de systèmes classifiés", isCorrect: false },
        { id: 'c', text: "Le taux de documentation complète", isCorrect: false },
        { id: 'd', text: "Toutes ces métriques + actions en retard", isCorrect: true }
      ],
      feedback: "Parfait ! Des indicateurs complets pour piloter : formation, classification, documentation, et suivi des actions."
    },
    {
      id: 'q7-9',
      type: 'qcm',
      question: "Quelle est la PREMIÈRE action à faire dès demain matin ?",
      options: [
        { id: 'a', text: "Former toute l'équipe sur 2 jours", isCorrect: false },
        { id: 'b', text: "Finaliser votre registre avec au moins 5 systèmes identifiés", isCorrect: true },
        { id: 'c', text: "Contacter tous les fournisseurs en même temps", isCorrect: false },
        { id: 'd', text: "Rédiger la politique IA complète", isCorrect: false }
      ],
      feedback: "Parfait ! Le registre est la base de tout. Commencez par identifier 5 systèmes minimum."
    },
    {
      id: 'q7-10',
      type: 'qcm',
      question: "En cas de doute sur une obligation, vous consultez :",
      options: [
        { id: 'a', text: "Les réseaux sociaux et forums", isCorrect: false },
        { id: 'b', text: "Les outils fournis + documentation officielle + votre DPO", isCorrect: true },
        { id: 'c', text: "Un collègue qui 'connaît l'IA'", isCorrect: false },
        { id: 'd', text: "Vous improvisez et voyez ce qui se passe", isCorrect: false }
      ],
      feedback: "Correct ! Utilisez les ressources officielles et vos experts internes (DPO, juridique)."
    },
    {
      id: 'q7-11',
      type: 'qcm',
      question: "Votre plus grande réussite à l'issue de cette formation est :",
      options: [
        { id: 'a', text: "Avoir écouté 8h de contenu", isCorrect: false },
        { id: 'b', text: "Avoir produit vos propres documents de conformité", isCorrect: true },
        { id: 'c', text: "Avoir passé tous les quiz", isCorrect: false },
        { id: 'd', text: "Avoir compris la théorie de l'AI Act", isCorrect: false }
      ],
      feedback: "Exact ! La pratique prime sur la théorie. Vos documents (registre, politique, plan d'action) sont votre vrai livrable. Bravo !"
    },
    {
      id: 'q7-12',
      type: 'cas-pratique',
      question: "Un fournisseur vous propose un nouveau système IA. Quelle est votre check-list AVANT adoption ?",
      options: [
        { id: 'a', text: "Vérifier juste le prix et la facilité d'utilisation", isCorrect: false },
        { id: 'b', text: "Classification risque, documentation dispo, transparence, supervision, conformité fournisseur", isCorrect: true },
        { id: 'c', text: "Demander l'avis de ChatGPT sur ce fournisseur", isCorrect: false },
        { id: 'd', text: "Attendre de voir si d'autres entreprises l'utilisent", isCorrect: false }
      ],
      feedback: "Parfait ! Avant toute adoption : évaluer le niveau de risque, vérifier la disponibilité de la documentation technique, les mentions de transparence, les possibilités de supervision humaine, et la conformité déclarée par le fournisseur."
    }
  ]
};

// ============================================
// EXPORT QUIZZES
// ============================================
export const QUIZZES: Quiz[] = [
  quizModule0,
  quizModule1,
  quizModule2,
  quizModule3,
  quizModule4,
  quizModule5,
  quizModule6,
  quizModule7
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
): { score: number; passed: boolean; correctCount: number; totalCount: number } {
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
    totalCount: quiz.questions.length
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

// ============================================
// STATISTICS
// ============================================
export function getQuizStatistics(): {
  totalQuestions: number;
  questionsByModule: Record<number, number>;
  questionsByType: Record<string, number>;
} {
  const questionsByModule: Record<number, number> = {};
  const questionsByType: Record<string, number> = { qcm: 0, 'vrai-faux': 0, 'cas-pratique': 0 };
  let totalQuestions = 0;

  for (const quiz of QUIZZES) {
    questionsByModule[quiz.moduleId] = quiz.questions.length;
    totalQuestions += quiz.questions.length;
    
    for (const q of quiz.questions) {
      const type = q.type || 'qcm';
      questionsByType[type] = (questionsByType[type] || 0) + 1;
    }
  }

  return { totalQuestions, questionsByModule, questionsByType };
}
