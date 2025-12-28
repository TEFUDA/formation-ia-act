// ============================================
// TYPES
// ============================================
export interface Video {
  id: string;
  title: string;
  description?: string;
  type: 'video' | 'exercise' | 'quiz' | 'scenario' | 'workshop' | 'certificate';
  duration?: string;
  videoUrl?: string;
  exerciseFile?: string;
  exerciseDuration?: string;
  workshopComponent?: string;
}

export interface Module {
  id: number;
  code: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  duration: string;
  xp: number;
  videos: Video[];
}

// ============================================
// MODULES DATA - 8 MODULES / 36 VIDÉOS THÉORIQUES
// ============================================
export const MODULES: Module[] = [
  // ═══════════════════════════════════════════
  // MODULE 1 : AI Act - Le Règlement qui Va Tout Changer
  // ═══════════════════════════════════════════
  {
    id: 1,
    code: 'M1',
    title: 'AI Act : Le Règlement qui Va Tout Changer',
    description: 'Comprendre les fondamentaux du règlement européen sur l\'IA et ses enjeux',
    icon: '🚀',
    color: '#8B5CF6',
    duration: '25 min',
    xp: 150,
    videos: [
      {
        id: '1.1',
        title: 'L\'IA est Partout... et ça Pose Problème',
        description: 'L\'omniprésence de l\'IA et les risques associés',
        type: 'video',
        duration: '5 min',
        videoUrl: 'https://youtu.be/peVKlanza20'
      },
      {
        id: '1.2',
        title: 'La Réponse de l\'Europe : Un Règlement Historique',
        description: 'Première mondiale : l\'Europe encadre l\'IA',
        type: 'video',
        duration: '4 min'
      },
      {
        id: '1.3',
        title: '4 Niveaux de Risque : Où Êtes-Vous ?',
        description: 'La pyramide des risques AI Act',
        type: 'video',
        duration: '5 min'
      },
      {
        id: '1.4',
        title: '2025-2027 : Le Compte à Rebours a Commencé',
        description: 'Calendrier et sanctions',
        type: 'video',
        duration: '5 min'
      },
      {
        id: '1.5',
        title: 'Quiz - Module 1',
        description: 'Validez vos connaissances sur les fondamentaux',
        type: 'quiz'
      }
    ]
  },

  // ═══════════════════════════════════════════
  // MODULE 2 : Votre IA est-elle ILLÉGALE ?
  // ═══════════════════════════════════════════
  {
    id: 2,
    code: 'M2',
    title: 'Votre IA est-elle ILLÉGALE ?',
    description: 'Classification des systèmes IA : interdictions et niveaux de risque',
    icon: '⚠️',
    color: '#EF4444',
    duration: '35 min',
    xp: 200,
    videos: [
      {
        id: '2.1',
        title: 'Les 8 IA Interdites en Europe',
        description: 'Pratiques bannies par l\'AI Act',
        type: 'video',
        duration: '6 min'
      },
      {
        id: '2.2',
        title: 'Haut Risque : Les 8 Domaines dans le Viseur',
        description: 'Secteurs soumis aux obligations renforcées',
        type: 'video',
        duration: '5 min'
      },
      {
        id: '2.3',
        title: 'Recrutement, Santé, Crédit : Êtes-Vous Concerné ?',
        description: 'Cas concrets de systèmes à haut risque',
        type: 'video',
        duration: '5 min'
      },
      {
        id: '2.4',
        title: 'ChatGPT, Midjourney : Le Cas Spécial de l\'IA Générative',
        description: 'GPAI et modèles de fondation',
        type: 'video',
        duration: '5 min'
      },
      {
        id: '2.5',
        title: 'Le Test de Classification en 4 Questions',
        description: 'Méthode simple pour classifier vos IA',
        type: 'video',
        duration: '4 min'
      },
      {
        id: '2.6',
        title: 'Workshop - Classifiez Vos Systèmes IA',
        description: 'Outil interactif de classification',
        type: 'workshop',
        workshopComponent: 'ClassificationWorkshop',
        exerciseDuration: '15-20 min'
      },
      {
        id: '2.7',
        title: 'Quiz - Module 2',
        description: 'Validez vos connaissances sur la classification',
        type: 'quiz'
      }
    ]
  },

  // ═══════════════════════════════════════════
  // MODULE 3 : 35 Millions d'Amende - Ce que Vous DEVEZ Faire
  // ═══════════════════════════════════════════
  {
    id: 3,
    code: 'M3',
    title: '35 Millions d\'Amende : Ce que Vous DEVEZ Faire',
    description: 'Les obligations détaillées pour chaque niveau de risque',
    icon: '📋',
    color: '#F59E0B',
    duration: '30 min',
    xp: 200,
    videos: [
      {
        id: '3.1',
        title: 'Haut Risque : Les 8 Obligations qui Font Peur',
        description: 'Vue d\'ensemble des exigences',
        type: 'video',
        duration: '4 min'
      },
      {
        id: '3.2',
        title: 'Documentation & Logs : Ce qu\'On Va Vous Demander',
        description: 'Exigences de traçabilité',
        type: 'video',
        duration: '5 min'
      },
      {
        id: '3.3',
        title: 'L\'Humain DOIT Rester aux Commandes',
        description: 'Contrôle humain et transparence',
        type: 'video',
        duration: '5 min'
      },
      {
        id: '3.4',
        title: 'Risque Limité : 3 Obligations Simples',
        description: 'Obligations de transparence allégées',
        type: 'video',
        duration: '5 min'
      },
      {
        id: '3.5',
        title: 'Les Sanctions : Combien ça Coûte de ne Rien Faire',
        description: 'Barème des amendes et conséquences',
        type: 'video',
        duration: '5 min'
      },
      {
        id: '3.6',
        title: 'Quiz - Module 3',
        description: 'Validez vos connaissances sur les obligations',
        type: 'quiz'
      }
    ]
  },

  // ═══════════════════════════════════════════
  // MODULE 4 : Le Système Anti-Sanction
  // ═══════════════════════════════════════════
  {
    id: 4,
    code: 'M4',
    title: 'Le Système Anti-Sanction',
    description: 'Mettre en place une gouvernance IA robuste',
    icon: '🏛️',
    color: '#10B981',
    duration: '50 min',
    xp: 250,
    videos: [
      {
        id: '4.1',
        title: 'Le Rôle qui Peut Vous Sauver : Le Responsable IA',
        description: 'Gouvernance et organisation',
        type: 'video',
        duration: '5 min'
      },
      {
        id: '4.2',
        title: 'La Politique IA : Le Document N°1',
        description: 'Structure et contenu de votre politique',
        type: 'video',
        duration: '5 min'
      },
      {
        id: '4.3',
        title: 'Registre & Inventaire : Ne Rien Oublier',
        description: 'Documenter tous vos systèmes',
        type: 'video',
        duration: '5 min'
      },
      {
        id: '4.4',
        title: 'Prêt pour l\'Audit ? La Checklist Complète',
        description: 'Se préparer à un contrôle',
        type: 'video',
        duration: '5 min'
      },
      {
        id: '4.5',
        title: 'Workshop - Générez Votre Politique IA',
        description: 'Créez votre politique IA personnalisée',
        type: 'workshop',
        workshopComponent: 'PolicyGeneratorWorkshop',
        exerciseDuration: '20-30 min'
      },
      {
        id: '4.6',
        title: 'Workshop - Inventaire des Systèmes IA',
        description: 'Cartographiez tous vos systèmes',
        type: 'workshop',
        workshopComponent: 'InventoryWorkshop',
        exerciseDuration: '15-20 min'
      },
      {
        id: '4.7',
        title: 'Workshop - Registre Haut Risque',
        description: 'Documentez vos systèmes à haut risque',
        type: 'workshop',
        workshopComponent: 'RegistryBuilder',
        exerciseDuration: '20-30 min'
      },
      {
        id: '4.8',
        title: 'Quiz - Module 4',
        description: 'Validez vos connaissances sur la gouvernance',
        type: 'quiz'
      }
    ]
  },

  // ═══════════════════════════════════════════
  // MODULE 5 : Vos IA Cachent des Bombes à Retardement
  // ═══════════════════════════════════════════
  {
    id: 5,
    code: 'M5',
    title: 'Vos IA Cachent des Bombes à Retardement',
    description: 'Évaluation et gestion des risques IA',
    icon: '💣',
    color: '#EF4444',
    duration: '40 min',
    xp: 200,
    videos: [
      {
        id: '5.1',
        title: 'Les 7 Risques que Personne ne Voit',
        description: 'Catégories de risques IA',
        type: 'video',
        duration: '5 min'
      },
      {
        id: '5.2',
        title: 'Biais, Discrimination : Le Risque N°1',
        description: 'Comprendre et combattre les biais algorithmiques',
        type: 'video',
        duration: '5 min'
      },
      {
        id: '5.3',
        title: 'La Matrice Magique : Priorisez vos Risques',
        description: 'Matrice probabilité × impact',
        type: 'video',
        duration: '5 min'
      },
      {
        id: '5.4',
        title: '4 Stratégies pour Neutraliser un Risque',
        description: 'Éviter, réduire, transférer, accepter',
        type: 'video',
        duration: '5 min'
      },
      {
        id: '5.5',
        title: 'Le Rapport qui Vous Protège en Cas de Contrôle',
        description: 'Documentation de l\'évaluation des risques',
        type: 'video',
        duration: '4 min'
      },
      {
        id: '5.6',
        title: 'Workshop - Diagnostic des Risques IA',
        description: 'Évaluez les risques de vos systèmes',
        type: 'workshop',
        workshopComponent: 'DiagnosticWorkshop',
        exerciseDuration: '30-45 min'
      },
      {
        id: '5.7',
        title: 'Quiz - Module 5',
        description: 'Validez vos connaissances sur l\'évaluation des risques',
        type: 'quiz'
      }
    ]
  },

  // ═══════════════════════════════════════════
  // MODULE 6 : La Phrase Magique qui Vous Protège Légalement
  // ═══════════════════════════════════════════
  {
    id: 6,
    code: 'M6',
    title: 'La Phrase Magique qui Vous Protège Légalement',
    description: 'Obligations de transparence et mentions légales',
    icon: '💬',
    color: '#06B6D4',
    duration: '30 min',
    xp: 200,
    videos: [
      {
        id: '6.1',
        title: 'Pourquoi le Silence Peut Vous Coûter Cher',
        description: 'L\'importance de la transparence',
        type: 'video',
        duration: '4 min'
      },
      {
        id: '6.2',
        title: 'Chatbot : La Phrase Obligatoire dès la 1ère Seconde',
        description: 'Informer les utilisateurs d\'un chatbot',
        type: 'video',
        duration: '5 min'
      },
      {
        id: '6.3',
        title: 'Images IA, Deepfakes : Comment les Marquer',
        description: 'Marquage du contenu généré',
        type: 'video',
        duration: '5 min'
      },
      {
        id: '6.4',
        title: 'Templates Prêts à Copier pour Chaque Situation',
        description: 'Modèles de mentions légales',
        type: 'video',
        duration: '6 min'
      },
      {
        id: '6.5',
        title: 'Workshop - Générateur de Mentions Légales',
        description: 'Créez vos mentions personnalisées',
        type: 'workshop',
        workshopComponent: 'LegalMentionsWorkshop',
        exerciseDuration: '10-15 min'
      },
      {
        id: '6.6',
        title: 'Quiz - Module 6',
        description: 'Validez vos connaissances sur la transparence',
        type: 'quiz'
      }
    ]
  },

  // ═══════════════════════════════════════════
  // MODULE 7 : Conforme en 90 Jours - Le Plan Copier-Coller
  // ═══════════════════════════════════════════
  {
    id: 7,
    code: 'M7',
    title: 'Conforme en 90 Jours : Le Plan Copier-Coller',
    description: 'Votre roadmap complète vers la conformité',
    icon: '🗓️',
    color: '#8B5CF6',
    duration: '45 min',
    xp: 250,
    videos: [
      {
        id: '7.1',
        title: 'Semaines 1-2 : L\'Audit qui Révèle Tout',
        description: 'Phase 1 - Inventaire initial',
        type: 'video',
        duration: '5 min'
      },
      {
        id: '7.2',
        title: 'Semaines 3-4 : Classifiez et Priorisez',
        description: 'Phase 2 - Classification',
        type: 'video',
        duration: '4 min'
      },
      {
        id: '7.3',
        title: 'Semaines 5-8 : La Documentation Express',
        description: 'Phase 3 - Création documentaire',
        type: 'video',
        duration: '5 min'
      },
      {
        id: '7.4',
        title: 'Semaines 9-12 : Déployez et Testez',
        description: 'Phase 4 - Mise en œuvre',
        type: 'video',
        duration: '5 min'
      },
      {
        id: '7.5',
        title: 'Après 90 Jours : Ne Jamais Relâcher',
        description: 'Phase 5 - Surveillance continue',
        type: 'video',
        duration: '4 min'
      },
      {
        id: '7.6',
        title: 'Workshop - Plan d\'Action Personnalisé',
        description: 'Générez votre roadmap 90 jours',
        type: 'workshop',
        workshopComponent: 'ActionPlanWorkshop',
        exerciseDuration: '20-30 min'
      },
      {
        id: '7.7',
        title: 'Workshop - Emails Fournisseurs',
        description: 'Demandez la documentation à vos fournisseurs',
        type: 'workshop',
        workshopComponent: 'EmailGeneratorWorkshop',
        exerciseDuration: '10-15 min'
      },
      {
        id: '7.8',
        title: 'Quiz - Module 7',
        description: 'Validez vos connaissances sur le plan d\'action',
        type: 'quiz'
      }
    ]
  },

  // ═══════════════════════════════════════════
  // MODULE 8 : Vous Êtes Prêt - Obtenez Votre Certificat
  // ═══════════════════════════════════════════
  {
    id: 8,
    code: 'M8',
    title: 'Vous Êtes Prêt : Obtenez Votre Certificat',
    description: 'Cas pratiques et certification finale',
    icon: '🏆',
    color: '#F59E0B',
    duration: '30 min',
    xp: 300,
    videos: [
      {
        id: '8.1',
        title: 'Cas Réel #1 : L\'Entreprise qui a Frôlé la Catastrophe',
        description: 'Études de cas PME et recrutement',
        type: 'video',
        duration: '6 min'
      },
      {
        id: '8.2',
        title: 'Cas Réel #2 : 3 IA, 3 Niveaux de Risque Différents',
        description: 'Études de cas e-commerce et santé',
        type: 'video',
        duration: '5 min'
      },
      {
        id: '8.3',
        title: 'Les 5 Erreurs à 1 Million € (Ne les Faites Pas)',
        description: 'Erreurs coûteuses à éviter',
        type: 'video',
        duration: '5 min'
      },
      {
        id: '8.4',
        title: 'Félicitations : Téléchargez Votre Certificat !',
        description: 'Conclusion et prochaines étapes',
        type: 'video',
        duration: '5 min'
      },
      {
        id: '8.5',
        title: 'Quiz Final',
        description: 'Évaluation finale de vos connaissances',
        type: 'quiz'
      },
      {
        id: '8.6',
        title: 'Votre Certificat de Formation',
        description: 'Téléchargez votre certificat professionnel',
        type: 'certificate'
      }
    ]
  }
];

// ============================================
// RESSOURCES SUPPLÉMENTAIRES
// ============================================
export const RESOURCES = [
  {
    id: 'checklist-urgence',
    name: 'Checklist Urgence AI Act',
    file: '01-checklist-urgence.xlsx',
    module: 1,
    type: 'excel'
  },
  {
    id: 'matrice-brainstorming',
    name: 'Matrice Brainstorming IA',
    file: '02-matrice-brainstorming-ia.xlsx',
    module: 4,
    type: 'excel'
  },
  {
    id: 'registre-ia',
    name: 'Registre IA Complet',
    file: '03-registre-ia-complet.xlsx',
    module: 4,
    type: 'excel'
  },
  {
    id: 'calculateur-classification',
    name: 'Calculateur Classification',
    file: '04-calculateur-classification.xlsx',
    module: 2,
    type: 'excel'
  },
  {
    id: 'tableau-bord',
    name: 'Tableau de Bord Suivi',
    file: '05-tableau-de-bord-suivi.xlsx',
    module: 7,
    type: 'excel'
  },
  {
    id: 'email-fournisseur',
    name: 'Guide Email Fournisseur',
    file: '06-email-fournisseur-guide.docx',
    module: 7,
    type: 'document'
  },
  {
    id: 'politique-ia',
    name: 'Template Politique IA',
    file: '07-politique-ia-template.docx',
    module: 4,
    type: 'document'
  },
  {
    id: 'simulation-audit',
    name: 'Scénario Simulation Audit',
    file: '08-simulation-audit-scenario.docx',
    module: 4,
    type: 'document'
  },
  {
    id: 'checklist-documents',
    name: 'Checklist Documents Obligatoires',
    file: '09-checklist-documents-obligatoires.pdf',
    module: 3,
    type: 'pdf'
  },
  {
    id: 'plan-action',
    name: 'Plan Action 90 Jours',
    file: '10-plan-action-90j-personnel.xlsx',
    module: 7,
    type: 'excel'
  },
  {
    id: 'guide-dossiers',
    name: 'Guide Dossiers Conformité',
    file: '11-guide-dossiers-conformite.pdf',
    module: 4,
    type: 'pdf'
  },
  {
    id: 'certificat',
    name: 'Certificat Personnalisable',
    file: '12-certificat-personnalisable.docx',
    module: 8,
    type: 'document'
  }
];

// ============================================
// STATISTIQUES DE LA FORMATION
// ============================================
export const FORMATION_STATS = {
  totalModules: 8,
  totalVideos: 36,
  totalWorkshops: 8,
  totalQuizzes: 9, // 8 modules + 1 quiz final
  totalDuration: '285 min', // ~4h45
  totalXP: 1750
};

// ============================================
// UTILITY FUNCTIONS
// ============================================
export function calculateModuleProgress(
  moduleId: number,
  completedVideos: string[]
): number {
  const module = MODULES.find(m => m.id === moduleId);
  if (!module) return 0;
  
  const moduleVideoIds = module.videos.map(v => `${moduleId}-${v.id}`);
  const completed = moduleVideoIds.filter(id => completedVideos.includes(id)).length;
  
  return Math.round((completed / module.videos.length) * 100);
}

export function getNextContent(
  currentModuleId: number,
  currentVideoIdx: number,
  completedVideos: string[]
): { moduleId: number; videoIdx: number } | null {
  const module = MODULES.find(m => m.id === currentModuleId);
  if (!module) return null;
  
  if (currentVideoIdx < module.videos.length - 1) {
    return { moduleId: currentModuleId, videoIdx: currentVideoIdx + 1 };
  }
  
  const nextModule = MODULES.find(m => m.id === currentModuleId + 1);
  if (nextModule) {
    return { moduleId: nextModule.id, videoIdx: 0 };
  }
  
  return null;
}

export function getTotalProgress(completedVideos: string[]): number {
  const totalVideos = MODULES.reduce((sum, m) => sum + m.videos.length, 0);
  return Math.round((completedVideos.length / totalVideos) * 100);
}

export function isModuleComplete(moduleId: number, completedVideos: string[]): boolean {
  const module = MODULES.find(m => m.id === moduleId);
  if (!module) return false;
  
  return module.videos.every(v => completedVideos.includes(`${moduleId}-${v.id}`));
}

export function getResourcesByModule(moduleId: number) {
  return RESOURCES.filter(r => r.module === moduleId);
}

export function getVideoById(moduleId: number, videoId: string): Video | undefined {
  const module = MODULES.find(m => m.id === moduleId);
  return module?.videos.find(v => v.id === videoId);
}

export function getModuleById(moduleId: number): Module | undefined {
  return MODULES.find(m => m.id === moduleId);
}

export function getAllVideos(): { module: Module; video: Video }[] {
  const result: { module: Module; video: Video }[] = [];
  MODULES.forEach(module => {
    module.videos.forEach(video => {
      result.push({ module, video });
    });
  });
  return result;
}

export function getVideosByType(type: Video['type']): { module: Module; video: Video }[] {
  return getAllVideos().filter(item => item.video.type === type);
}
