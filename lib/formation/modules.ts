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
        duration: '5 min'
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
        type: 'exercise'
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
        type: 'exercise'
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
        type: 'exercise'
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
        type: 'exercise'
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
        type: 'exercise'
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
        type: 'exercise'
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
        type: 'exercise'
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
        type: 'scenario'
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
        type: 'exercise'
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
  
  // Check if there's a next video in current module
  if (currentVideoIdx < module.videos.length - 1) {
    return { moduleId: currentModuleId, videoIdx: currentVideoIdx + 1 };
  }
  
  // Check if there's a next module
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
