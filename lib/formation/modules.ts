// ============================================
// TYPES
// ============================================
export interface Video {
  id: string;
  title: string;
  description?: string;
  type: 'video' | 'exercise' | 'quiz' | 'scenario';
  duration?: string;
  videoUrl?: string;
  exerciseFile?: string;
  exerciseDuration?: string;
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
// MODULES DATA
// ============================================
export const MODULES: Module[] = [
  {
    id: 0,
    code: 'M0',
    title: 'Introduction à l\'AI Act',
    description: 'Découvrez les fondamentaux du règlement européen sur l\'IA',
    icon: '🚀',
    color: '#8B5CF6',
    duration: '30 min',
    xp: 100,
    videos: [
      {
        id: '0.1',
        title: 'Bienvenue dans la formation',
        description: 'Présentation du parcours et des objectifs',
        type: 'video',
        duration: '5 min',
        videoUrl: 'https://youtu.be/peVKlanza20'
      },
      {
        id: '0.2',
        title: 'Qu\'est-ce que l\'AI Act ?',
        description: 'Contexte et enjeux du règlement européen',
        type: 'video',
        duration: '10 min'
      },
      {
        id: '0.3',
        title: 'Calendrier de mise en application',
        description: 'Les dates clés à retenir',
        type: 'video',
        duration: '8 min'
      },
      {
        id: '0.4',
        title: 'Quiz - Introduction',
        type: 'quiz'
      }
    ]
  },
  {
    id: 1,
    code: 'M1',
    title: 'Diagnostic Initial',
    description: 'Évaluez votre niveau de conformité actuel',
    icon: '🔍',
    color: '#00F5FF',
    duration: '45 min',
    xp: 150,
    videos: [
      {
        id: '1.1',
        title: 'Êtes-vous concerné par l\'AI Act ?',
        description: 'Critères d\'application du règlement',
        type: 'video',
        duration: '12 min'
      },
      {
        id: '1.2',
        title: 'Checklist - Êtes-vous concerné ?',
        description: 'Auto-évaluation interactive',
        type: 'exercise',
        exerciseFile: '01-checklist-urgence.xlsx',
        exerciseDuration: '10-15 min'
      },
      {
        id: '1.3',
        title: 'Les acteurs de l\'écosystème IA',
        description: 'Fournisseurs, déployeurs, importateurs...',
        type: 'video',
        duration: '10 min'
      },
      {
        id: '1.4',
        title: 'Quiz - Diagnostic',
        type: 'quiz'
      }
    ]
  },
  {
    id: 2,
    code: 'M2',
    title: 'Cartographie des Systèmes IA',
    description: 'Inventoriez et documentez vos systèmes d\'IA',
    icon: '🗺️',
    color: '#00FF88',
    duration: '60 min',
    xp: 200,
    videos: [
      {
        id: '2.1',
        title: 'Identifier les systèmes IA',
        description: 'Méthodologie d\'inventaire',
        type: 'video',
        duration: '15 min'
      },
      {
        id: '2.2',
        title: 'Exercice - Brainstorming IA',
        description: 'Listez vos systèmes par département',
        type: 'exercise',
        exerciseFile: '02-matrice-brainstorming-ia.xlsx',
        exerciseDuration: '15-20 min'
      },
      {
        id: '2.3',
        title: 'Le registre des systèmes IA',
        description: 'Structure et contenu obligatoire',
        type: 'video',
        duration: '12 min'
      },
      {
        id: '2.4',
        title: 'Exercice - Créer votre registre',
        description: 'Template interactif',
        type: 'exercise',
        exerciseFile: '03-registre-ia-complet.xlsx',
        exerciseDuration: '20-30 min'
      },
      {
        id: '2.5',
        title: 'Quiz - Cartographie',
        type: 'quiz'
      }
    ]
  },
  {
    id: 3,
    code: 'M3',
    title: 'Classification des Risques',
    description: 'Catégorisez vos systèmes selon le niveau de risque',
    icon: '⚖️',
    color: '#FFB800',
    duration: '50 min',
    xp: 200,
    videos: [
      {
        id: '3.1',
        title: 'Les 4 niveaux de risque',
        description: 'Inacceptable, Haut, Limité, Minimal',
        type: 'video',
        duration: '15 min'
      },
      {
        id: '3.2',
        title: 'Exercice - Classification interactive',
        description: 'Classifiez vos systèmes avec le wizard',
        type: 'exercise',
        exerciseFile: '04-calculateur-classification.xlsx',
        exerciseDuration: '15-20 min'
      },
      {
        id: '3.3',
        title: 'Cas pratiques par secteur',
        description: 'RH, Finance, Santé, Commerce...',
        type: 'video',
        duration: '12 min'
      },
      {
        id: '3.4',
        title: 'Quiz - Classification',
        type: 'quiz'
      }
    ]
  },
  {
    id: 4,
    code: 'M4',
    title: 'Documentation Technique',
    description: 'Constituez votre dossier de conformité',
    icon: '📄',
    color: '#FF6B6B',
    duration: '55 min',
    xp: 200,
    videos: [
      {
        id: '4.1',
        title: 'Exigences documentaires',
        description: 'Ce que demande l\'AI Act',
        type: 'video',
        duration: '15 min'
      },
      {
        id: '4.2',
        title: 'Exercice - Email fournisseur',
        description: 'Demandez la documentation technique',
        type: 'exercise',
        exerciseFile: '06-email-fournisseur-guide.docx',
        exerciseDuration: '10-15 min'
      },
      {
        id: '4.3',
        title: 'Évaluation des risques',
        description: 'Méthodologie et template',
        type: 'video',
        duration: '12 min'
      },
      {
        id: '4.4',
        title: 'Quiz - Documentation',
        type: 'quiz'
      }
    ]
  },
  {
    id: 5,
    code: 'M5',
    title: 'Gouvernance & Politique IA',
    description: 'Mettez en place votre cadre de gouvernance',
    icon: '🏛️',
    color: '#A855F7',
    duration: '50 min',
    xp: 200,
    videos: [
      {
        id: '5.1',
        title: 'Politique d\'utilisation de l\'IA',
        description: 'Structure et contenu recommandé',
        type: 'video',
        duration: '15 min'
      },
      {
        id: '5.2',
        title: 'Exercice - Rédiger votre politique',
        description: 'Template personnalisable',
        type: 'exercise',
        exerciseFile: '07-politique-ia-template.docx',
        exerciseDuration: '20-30 min'
      },
      {
        id: '5.3',
        title: 'Mentions légales IA',
        description: 'Obligations d\'information',
        type: 'video',
        duration: '10 min'
      },
      {
        id: '5.4',
        title: 'Exercice - Générateur de mentions',
        description: 'Créez vos mentions personnalisées',
        type: 'exercise',
        exerciseDuration: '10-15 min'
      },
      {
        id: '5.5',
        title: 'Quiz - Gouvernance',
        type: 'quiz'
      }
    ]
  },
  {
    id: 6,
    code: 'M6',
    title: 'Simulation d\'Audit',
    description: 'Préparez-vous à un contrôle de conformité',
    icon: '🎯',
    color: '#F97316',
    duration: '45 min',
    xp: 250,
    videos: [
      {
        id: '6.1',
        title: 'Le processus d\'audit AI Act',
        description: 'Comment se déroule un contrôle',
        type: 'video',
        duration: '12 min'
      },
      {
        id: '6.2',
        title: 'Scénario - Simulation d\'audit',
        description: 'Vivez un audit comme si vous y étiez',
        type: 'scenario',
        exerciseFile: '08-simulation-audit-scenario.docx'
      },
      {
        id: '6.3',
        title: 'Quiz - Simulation',
        type: 'quiz'
      }
    ]
  },
  {
    id: 7,
    code: 'M7',
    title: 'Plan d\'Action & Certification',
    description: 'Finalisez votre démarche de conformité',
    icon: '🏆',
    color: '#10B981',
    duration: '40 min',
    xp: 300,
    videos: [
      {
        id: '7.1',
        title: 'Construire son plan d\'action',
        description: 'Priorisation et planification',
        type: 'video',
        duration: '12 min'
      },
      {
        id: '7.2',
        title: 'Exercice - Votre plan 90 jours',
        description: 'Créez votre roadmap personnalisée',
        type: 'exercise',
        exerciseFile: '10-plan-action-90j-personnel.xlsx',
        exerciseDuration: '25-30 min'
      },
      {
        id: '7.3',
        title: 'Veille réglementaire',
        description: 'Restez à jour sur l\'AI Act',
        type: 'video',
        duration: '8 min'
      },
      {
        id: '7.4',
        title: 'Quiz Final',
        type: 'quiz'
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
    module: 2,
    type: 'excel'
  },
  {
    id: 'registre-ia',
    name: 'Registre IA Complet',
    file: '03-registre-ia-complet.xlsx',
    module: 2,
    type: 'excel'
  },
  {
    id: 'calculateur-classification',
    name: 'Calculateur Classification',
    file: '04-calculateur-classification.xlsx',
    module: 3,
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
    module: 4,
    type: 'document'
  },
  {
    id: 'politique-ia',
    name: 'Template Politique IA',
    file: '07-politique-ia-template.docx',
    module: 5,
    type: 'document'
  },
  {
    id: 'simulation-audit',
    name: 'Scénario Simulation Audit',
    file: '08-simulation-audit-scenario.docx',
    module: 6,
    type: 'document'
  },
  {
    id: 'checklist-documents',
    name: 'Checklist Documents Obligatoires',
    file: '09-checklist-documents-obligatoires.pdf',
    module: 4,
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
    module: 7,
    type: 'document'
  }
];

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
