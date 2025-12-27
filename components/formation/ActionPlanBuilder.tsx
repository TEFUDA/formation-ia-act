'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ============================================
// TYPES
// ============================================
interface Resource {
  id: string;
  name: string;
  filename: string;
  description: string;
  type: 'xlsx' | 'docx' | 'pdf';
}

interface Action {
  id: string;
  week: number;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  category: 'documentation' | 'formation' | 'technique' | 'gouvernance' | 'audit';
  completed: boolean;
  dueDate?: string;
  resources?: string[]; // IDs des ressources associées
}

interface Phase {
  id: string;
  name: string;
  weeks: string;
  color: string;
  icon: string;
  defaultActions: Omit<Action, 'id' | 'completed' | 'dueDate'>[];
}

// ============================================
// RESSOURCES DISPONIBLES
// ============================================
const RESOURCES: Resource[] = [
  {
    id: 'checklist-urgence',
    name: 'Checklist d\'urgence',
    filename: '01-checklist-urgence.xlsx',
    description: 'Liste des actions prioritaires à réaliser',
    type: 'xlsx'
  },
  {
    id: 'matrice-brainstorming',
    name: 'Matrice brainstorming IA',
    filename: '02-matrice-brainstorming-ia.xlsx',
    description: 'Outil pour identifier tous les systèmes IA',
    type: 'xlsx'
  },
  {
    id: 'registre-ia',
    name: 'Registre IA complet',
    filename: '03-registre-ia-complet.xlsx',
    description: 'Template de registre des systèmes IA',
    type: 'xlsx'
  },
  {
    id: 'calculateur-classification',
    name: 'Calculateur de classification',
    filename: '04-calculateur-classification.xlsx',
    description: 'Outil de classification des risques AI Act',
    type: 'xlsx'
  },
  {
    id: 'tableau-bord',
    name: 'Tableau de bord suivi',
    filename: '05-tableau-de-bord-suivi.xlsx',
    description: 'Dashboard de suivi de conformité',
    type: 'xlsx'
  },
  {
    id: 'email-fournisseur',
    name: 'Email type fournisseur',
    filename: '06-email-fournisseur-guide.docx',
    description: 'Modèle d\'email pour demander la documentation',
    type: 'docx'
  },
  {
    id: 'politique-ia',
    name: 'Politique IA template',
    filename: '07-politique-ia-template.docx',
    description: 'Modèle de politique interne IA',
    type: 'docx'
  },
  {
    id: 'simulation-audit',
    name: 'Scénario simulation audit',
    filename: '08-simulation-audit-scenario.docx',
    description: 'Script pour simuler un audit interne',
    type: 'docx'
  },
  {
    id: 'checklist-documents',
    name: 'Checklist documents obligatoires',
    filename: '09-checklist-documents-obligatoires.pdf',
    description: 'Liste des documents requis par l\'AI Act',
    type: 'pdf'
  },
  {
    id: 'plan-90j',
    name: 'Plan d\'action 90 jours',
    filename: '10-plan-action-90j-personnel.xlsx',
    description: 'Template de plan d\'action personnalisable',
    type: 'xlsx'
  },
  {
    id: 'guide-dossiers',
    name: 'Guide dossiers conformité',
    filename: '11-guide-dossiers-conformite.pdf',
    description: 'Guide pour constituer les dossiers de conformité',
    type: 'pdf'
  },
  {
    id: 'certificat',
    name: 'Certificat personnalisable',
    filename: '12-certificat-personnalisable.docx',
    description: 'Modèle de certificat de formation',
    type: 'docx'
  }
];

// ============================================
// PHASES DATA AVEC RESSOURCES
// ============================================
const PHASES: Phase[] = [
  {
    id: 'phase1',
    name: 'Diagnostic & Inventaire',
    weeks: 'Semaines 1-4',
    color: '#FF6B6B',
    icon: '🔍',
    defaultActions: [
      {
        week: 1,
        title: 'Finaliser l\'inventaire des systèmes IA',
        description: 'Compléter le registre avec tous les départements',
        priority: 'high',
        category: 'documentation',
        resources: ['registre-ia', 'matrice-brainstorming', 'checklist-urgence']
      },
      {
        week: 1,
        title: 'Identifier les responsables par système',
        description: 'Nommer un référent pour chaque IA identifiée',
        priority: 'high',
        category: 'gouvernance',
        resources: ['registre-ia', 'tableau-bord']
      },
      {
        week: 2,
        title: 'Classifier tous les systèmes',
        description: 'Utiliser la matrice de classification AI Act',
        priority: 'high',
        category: 'documentation',
        resources: ['calculateur-classification', 'registre-ia']
      },
      {
        week: 3,
        title: 'Prioriser les systèmes à haut risque',
        description: 'Identifier les 3-5 systèmes prioritaires',
        priority: 'high',
        category: 'gouvernance',
        resources: ['calculateur-classification', 'tableau-bord']
      },
      {
        week: 4,
        title: 'Demander la documentation aux fournisseurs',
        description: 'Envoyer les emails de demande Annexe IV',
        priority: 'medium',
        category: 'documentation',
        resources: ['email-fournisseur', 'checklist-documents']
      }
    ]
  },
  {
    id: 'phase2',
    name: 'Documentation & Formation',
    weeks: 'Semaines 5-8',
    color: '#4ECDC4',
    icon: '📚',
    defaultActions: [
      {
        week: 5,
        title: 'Rédiger la politique IA',
        description: 'Adapter le template à votre contexte',
        priority: 'high',
        category: 'gouvernance',
        resources: ['politique-ia', 'guide-dossiers']
      },
      {
        week: 5,
        title: 'Planifier les formations Article 4',
        description: 'Identifier les opérateurs à former',
        priority: 'high',
        category: 'formation',
        resources: ['tableau-bord', 'plan-90j']
      },
      {
        week: 6,
        title: 'Déployer les formations',
        description: 'Former les premiers opérateurs IA',
        priority: 'high',
        category: 'formation',
        resources: ['certificat', 'tableau-bord']
      },
      {
        week: 7,
        title: 'Mettre en place les mentions de transparence',
        description: 'Ajouter les mentions "IA" sur les interfaces',
        priority: 'medium',
        category: 'technique',
        resources: ['politique-ia', 'checklist-documents']
      },
      {
        week: 8,
        title: 'Documenter les analyses d\'impact',
        description: 'Réaliser les DPIA pour systèmes haut risque',
        priority: 'high',
        category: 'documentation',
        resources: ['guide-dossiers', 'checklist-documents', 'calculateur-classification']
      }
    ]
  },
  {
    id: 'phase3',
    name: 'Mise en conformité',
    weeks: 'Semaines 9-12',
    color: '#95E1D3',
    icon: '⚙️',
    defaultActions: [
      {
        week: 9,
        title: 'Implémenter la supervision humaine',
        description: 'Définir les processus de contrôle',
        priority: 'high',
        category: 'technique',
        resources: ['politique-ia', 'guide-dossiers']
      },
      {
        week: 9,
        title: 'Configurer la journalisation',
        description: 'Activer les logs pour systèmes haut risque',
        priority: 'medium',
        category: 'technique',
        resources: ['checklist-documents', 'guide-dossiers']
      },
      {
        week: 10,
        title: 'Valider avec le DPO/juridique',
        description: 'Revue croisée RGPD/AI Act',
        priority: 'high',
        category: 'gouvernance',
        resources: ['checklist-documents', 'registre-ia', 'politique-ia']
      },
      {
        week: 11,
        title: 'Réaliser un audit interne',
        description: 'Test à blanc de contrôle',
        priority: 'medium',
        category: 'audit',
        resources: ['simulation-audit', 'checklist-documents']
      },
      {
        week: 12,
        title: 'Corriger les non-conformités',
        description: 'Plan d\'action sur les écarts identifiés',
        priority: 'high',
        category: 'audit',
        resources: ['plan-90j', 'tableau-bord']
      },
      {
        week: 12,
        title: 'Préparer le dossier de conformité',
        description: 'Consolider toute la documentation',
        priority: 'high',
        category: 'documentation',
        resources: ['guide-dossiers', 'checklist-documents', 'registre-ia']
      }
    ]
  }
];

// ============================================
// ICONS
// ============================================
const Icons = {
  Check: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-full h-full"><polyline points="20 6 9 17 4 12"/></svg>,
  Plus: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  Trash: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>,
  Download: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
  Calendar: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  ChevronDown: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><polyline points="6 9 12 15 18 9"/></svg>,
  FileText: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>,
};

// ============================================
// FILE TYPE CONFIG
// ============================================
const FILE_TYPE_CONFIG = {
  xlsx: { icon: '📊', color: '#22C55E', label: 'Excel' },
  docx: { icon: '📝', color: '#3B82F6', label: 'Word' },
  pdf: { icon: '📕', color: '#EF4444', label: 'PDF' }
};

// ============================================
// CATEGORY CONFIG
// ============================================
const CATEGORY_CONFIG = {
  documentation: { icon: '📄', label: 'Documentation', color: '#FFB800' },
  formation: { icon: '🎓', label: 'Formation', color: '#8B5CF6' },
  technique: { icon: '⚙️', label: 'Technique', color: '#00F5FF' },
  gouvernance: { icon: '🏛️', label: 'Gouvernance', color: '#FF6B6B' },
  audit: { icon: '🔍', label: 'Audit', color: '#00FF88' }
};

const PRIORITY_CONFIG = {
  high: { label: 'Haute', color: '#FF4444' },
  medium: { label: 'Moyenne', color: '#FFB800' },
  low: { label: 'Basse', color: '#44FF44' }
};

// ============================================
// COMPONENT
// ============================================
interface Props {
  moduleColor?: string;
  onComplete?: (actions: Action[]) => void;
}

export default function ActionPlanBuilder({ moduleColor = '#F97316', onComplete }: Props) {
  const [actions, setActions] = useState<Action[]>([]);
  const [expandedPhases, setExpandedPhases] = useState<string[]>(['phase1']);
  const [showAddForm, setShowAddForm] = useState(false);
  const [expandedResources, setExpandedResources] = useState<string | null>(null);
  const [newAction, setNewAction] = useState({
    title: '',
    description: '',
    week: 1,
    priority: 'medium' as const,
    category: 'documentation' as const
  });

  // Initialize with default actions
  useEffect(() => {
    const defaultActions: Action[] = PHASES.flatMap(phase =>
      phase.defaultActions.map((action, idx) => ({
        ...action,
        id: `${phase.id}-${idx}`,
        completed: false
      }))
    );
    setActions(defaultActions);
  }, []);

  const togglePhase = (phaseId: string) => {
    setExpandedPhases(prev =>
      prev.includes(phaseId)
        ? prev.filter(id => id !== phaseId)
        : [...prev, phaseId]
    );
  };

  const toggleAction = (actionId: string) => {
    setActions(prev =>
      prev.map(a => a.id === actionId ? { ...a, completed: !a.completed } : a)
    );
  };

  const toggleResources = (actionId: string) => {
    setExpandedResources(prev => prev === actionId ? null : actionId);
  };

  const deleteAction = (actionId: string) => {
    setActions(prev => prev.filter(a => a.id !== actionId));
  };

  const addAction = () => {
    if (!newAction.title.trim()) return;
    
    const action: Action = {
      id: `custom-${Date.now()}`,
      ...newAction,
      completed: false
    };
    
    setActions(prev => [...prev, action]);
    setNewAction({
      title: '',
      description: '',
      week: 1,
      priority: 'medium',
      category: 'documentation'
    });
    setShowAddForm(false);
  };

  const getResource = (resourceId: string): Resource | undefined => {
    return RESOURCES.find(r => r.id === resourceId);
  };

  const downloadResource = (resource: Resource) => {
    const link = document.createElement('a');
    link.href = `/resources/${resource.filename}`;
    link.download = resource.filename;
    link.click();
  };

  const exportCSV = () => {
    const headers = ['Semaine', 'Titre', 'Description', 'Catégorie', 'Priorité', 'Statut', 'Ressources'];
    const rows = actions.map(a => [
      `S${a.week}`,
      a.title,
      a.description,
      CATEGORY_CONFIG[a.category].label,
      PRIORITY_CONFIG[a.priority].label,
      a.completed ? 'Terminé' : 'À faire',
      a.resources?.map(r => getResource(r)?.name).join(', ') || ''
    ]);

    const csv = [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'plan-action-90-jours.csv';
    link.click();
  };

  const addToGoogleCalendar = () => {
    const baseUrl = 'https://calendar.google.com/calendar/render?action=TEMPLATE';
    const today = new Date();
    
    actions.filter(a => !a.completed).slice(0, 5).forEach((action, idx) => {
      const startDate = new Date(today);
      startDate.setDate(startDate.getDate() + (action.week * 7) - 7 + idx);
      
      const dateStr = startDate.toISOString().replace(/-|:|\.\d+/g, '').slice(0, 15) + 'Z';
      const url = `${baseUrl}&text=${encodeURIComponent(action.title)}&details=${encodeURIComponent(action.description)}&dates=${dateStr}/${dateStr}`;
      
      window.open(url, '_blank');
    });
  };

  // Stats
  const completedCount = actions.filter(a => a.completed).length;
  const progress = actions.length > 0 ? Math.round((completedCount / actions.length) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/5 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">📅</span>
          <h2 className="text-2xl font-bold">Plan d'Action 90 Jours</h2>
        </div>
        <p className="text-white/60 mb-6">
          Votre feuille de route personnalisée pour la mise en conformité AI Act.
        </p>

        {/* Progress bar */}
        <div className="bg-white/10 rounded-full h-3 mb-2 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className="h-full rounded-full"
            style={{ backgroundColor: moduleColor }}
          />
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-white/40">Progression globale</span>
          <span className="font-semibold" style={{ color: moduleColor }}>
            {completedCount} / {actions.length} actions
          </span>
        </div>

        {/* Week markers */}
        <div className="flex justify-between mt-4 text-xs text-white/30">
          <span>Semaine 1</span>
          <span>Semaine 4</span>
          <span>Semaine 8</span>
          <span>Semaine 12</span>
        </div>
      </div>

      {/* Phases */}
      <div className="space-y-4">
        {PHASES.map(phase => {
          const phaseActions = actions.filter(a => 
            a.week >= (phase.id === 'phase1' ? 1 : phase.id === 'phase2' ? 5 : 9) &&
            a.week <= (phase.id === 'phase1' ? 4 : phase.id === 'phase2' ? 8 : 12)
          );
          const phaseCompleted = phaseActions.filter(a => a.completed).length;
          const isExpanded = expandedPhases.includes(phase.id);

          return (
            <div key={phase.id} className="bg-white/5 rounded-xl overflow-hidden">
              {/* Phase header */}
              <button
                onClick={() => togglePhase(phase.id)}
                className="w-full p-4 flex items-center gap-4 hover:bg-white/5 transition-colors"
              >
                <span className="text-2xl">{phase.icon}</span>
                <div className="flex-1 text-left">
                  <h3 className="font-semibold">{phase.name}</h3>
                  <p className="text-sm text-white/40">{phase.weeks}</p>
                </div>
                <div 
                  className="px-3 py-1 rounded-full text-sm font-medium"
                  style={{ 
                    backgroundColor: `${phase.color}20`,
                    color: phase.color
                  }}
                >
                  {phaseCompleted} / {phaseActions.length}
                </div>
                <div 
                  className={`w-6 h-6 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                  style={{ color: phase.color }}
                >
                  <Icons.ChevronDown />
                </div>
              </button>

              {/* Actions */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="p-4 space-y-3 bg-white/5">
                      {phaseActions.map(action => (
                        <div
                          key={action.id}
                          className={`rounded-xl transition-all ${
                            action.completed ? 'bg-green-500/10 opacity-60' : 'bg-black/20'
                          }`}
                        >
                          {/* Main action row */}
                          <div className="p-4 flex items-start gap-4">
                            {/* Checkbox */}
                            <button
                              onClick={() => toggleAction(action.id)}
                              className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 transition-all ${
                                action.completed 
                                  ? 'bg-green-500 text-black' 
                                  : 'border-2 border-white/20 hover:border-white/40'
                              }`}
                            >
                              {action.completed && <div className="w-4 h-4"><Icons.Check /></div>}
                            </button>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1 flex-wrap">
                                <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-white/50">
                                  S{action.week}
                                </span>
                                <span 
                                  className="text-xs px-2 py-0.5 rounded-full"
                                  style={{ 
                                    backgroundColor: `${CATEGORY_CONFIG[action.category].color}20`,
                                    color: CATEGORY_CONFIG[action.category].color
                                  }}
                                >
                                  {CATEGORY_CONFIG[action.category].icon} {CATEGORY_CONFIG[action.category].label}
                                </span>
                                <span 
                                  className="text-xs px-2 py-0.5 rounded-full"
                                  style={{ 
                                    backgroundColor: `${PRIORITY_CONFIG[action.priority].color}20`,
                                    color: PRIORITY_CONFIG[action.priority].color
                                  }}
                                >
                                  {PRIORITY_CONFIG[action.priority].label}
                                </span>
                              </div>
                              <h4 className={`font-medium ${action.completed ? 'line-through' : ''}`}>
                                {action.title}
                              </h4>
                              <p className="text-sm text-white/40">{action.description}</p>

                              {/* Resources button */}
                              {action.resources && action.resources.length > 0 && (
                                <button
                                  onClick={() => toggleResources(action.id)}
                                  className="mt-3 flex items-center gap-2 text-xs px-3 py-2 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 transition-colors border border-blue-500/20"
                                >
                                  <div className="w-4 h-4"><Icons.FileText /></div>
                                  <span className="font-medium">📎 {action.resources.length} document{action.resources.length > 1 ? 's' : ''} utile{action.resources.length > 1 ? 's' : ''}</span>
                                  <div className={`w-4 h-4 transition-transform ${expandedResources === action.id ? 'rotate-180' : ''}`}>
                                    <Icons.ChevronDown />
                                  </div>
                                </button>
                              )}
                            </div>

                            {/* Delete */}
                            <button
                              onClick={() => deleteAction(action.id)}
                              className="w-8 h-8 rounded-lg bg-white/5 hover:bg-red-500/20 flex items-center justify-center text-white/30 hover:text-red-400 transition-colors flex-shrink-0"
                            >
                              <div className="w-4 h-4"><Icons.Trash /></div>
                            </button>
                          </div>

                          {/* Resources panel */}
                          <AnimatePresence>
                            {expandedResources === action.id && action.resources && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden"
                              >
                                <div className="px-4 pb-4 pt-1 ml-10 space-y-2">
                                  <div className="text-xs text-white/50 mb-3 flex items-center gap-2">
                                    <span>📥</span>
                                    <span>Téléchargez ces documents pour réaliser cette tâche :</span>
                                  </div>
                                  {action.resources.map(resourceId => {
                                    const resource = getResource(resourceId);
                                    if (!resource) return null;
                                    const typeConfig = FILE_TYPE_CONFIG[resource.type];
                                    
                                    return (
                                      <div
                                        key={resourceId}
                                        className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors group border border-white/5"
                                      >
                                        <span className="text-xl">{typeConfig.icon}</span>
                                        <div className="flex-1 min-w-0">
                                          <div className="font-medium text-sm">{resource.name}</div>
                                          <div className="text-xs text-white/40 truncate">{resource.description}</div>
                                        </div>
                                        <span 
                                          className="text-[10px] px-2 py-1 rounded-full font-medium"
                                          style={{ 
                                            backgroundColor: `${typeConfig.color}20`,
                                            color: typeConfig.color
                                          }}
                                        >
                                          {typeConfig.label}
                                        </span>
                                        <button
                                          onClick={() => downloadResource(resource)}
                                          className="w-9 h-9 rounded-lg flex items-center justify-center transition-all hover:scale-105"
                                          style={{ 
                                            backgroundColor: moduleColor,
                                            color: 'black'
                                          }}
                                          title={`Télécharger ${resource.filename}`}
                                        >
                                          <div className="w-4 h-4"><Icons.Download /></div>
                                        </button>
                                      </div>
                                    );
                                  })}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Add Custom Action */}
      <AnimatePresence>
        {showAddForm ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white/5 rounded-xl p-6 mb-6"
          >
            <h3 className="font-semibold mb-4">➕ Ajouter une action personnalisée</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm text-white/60 mb-2">Titre *</label>
                <input
                  type="text"
                  value={newAction.title}
                  onChange={(e) => setNewAction({ ...newAction, title: e.target.value })}
                  placeholder="Ex: Réunion avec le RSSI..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-white/30"
                />
              </div>
              <div>
                <label className="block text-sm text-white/60 mb-2">Semaine</label>
                <select
                  value={newAction.week}
                  onChange={(e) => setNewAction({ ...newAction, week: parseInt(e.target.value) })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/30"
                >
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>Semaine {i + 1}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-white/60 mb-2">Catégorie</label>
                <select
                  value={newAction.category}
                  onChange={(e) => setNewAction({ ...newAction, category: e.target.value as any })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/30"
                >
                  {Object.entries(CATEGORY_CONFIG).map(([key, config]) => (
                    <option key={key} value={key}>{config.icon} {config.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-white/60 mb-2">Priorité</label>
                <select
                  value={newAction.priority}
                  onChange={(e) => setNewAction({ ...newAction, priority: e.target.value as any })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/30"
                >
                  <option value="high">🔴 Haute</option>
                  <option value="medium">🟡 Moyenne</option>
                  <option value="low">🟢 Basse</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm text-white/60 mb-2">Description</label>
                <input
                  type="text"
                  value={newAction.description}
                  onChange={(e) => setNewAction({ ...newAction, description: e.target.value })}
                  placeholder="Détails de l'action..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-white/30"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={addAction}
                disabled={!newAction.title.trim()}
                className="flex-1 py-3 rounded-xl font-medium text-black disabled:opacity-50"
                style={{ backgroundColor: moduleColor }}
              >
                Ajouter
              </button>
              <button
                onClick={() => setShowAddForm(false)}
                className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20"
              >
                Annuler
              </button>
            </div>
          </motion.div>
        ) : (
          <button
            onClick={() => setShowAddForm(true)}
            className="w-full py-4 mb-6 rounded-xl border-2 border-dashed border-white/20 hover:border-white/40 flex items-center justify-center gap-2 text-white/60 hover:text-white transition-all"
          >
            <div className="w-5 h-5"><Icons.Plus /></div>
            Ajouter une action personnalisée
          </button>
        )}
      </AnimatePresence>

      {/* Quick Resources Access */}
      <div className="bg-white/5 rounded-xl p-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <span>📦</span>
          Tous les documents de la formation
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {RESOURCES.map(resource => {
            const typeConfig = FILE_TYPE_CONFIG[resource.type];
            return (
              <button
                key={resource.id}
                onClick={() => downloadResource(resource)}
                className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all text-left group border border-white/5 hover:border-white/10"
              >
                <span className="text-xl">{typeConfig.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm truncate">{resource.name}</div>
                  <div className="text-[10px] text-white/40">{typeConfig.label}</div>
                </div>
                <div 
                  className="w-8 h-8 rounded-lg flex items-center justify-center opacity-50 group-hover:opacity-100 transition-all group-hover:scale-105"
                  style={{ 
                    backgroundColor: moduleColor,
                    color: 'black'
                  }}
                >
                  <div className="w-4 h-4"><Icons.Download /></div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <button
          onClick={exportCSV}
          className="flex items-center justify-center gap-2 py-4 rounded-xl bg-white/10 hover:bg-white/20 font-semibold transition-colors"
        >
          <div className="w-5 h-5"><Icons.Download /></div>
          Exporter CSV
        </button>
        
        <button
          onClick={addToGoogleCalendar}
          className="flex items-center justify-center gap-2 py-4 rounded-xl bg-white/10 hover:bg-white/20 font-semibold transition-colors"
        >
          <div className="w-5 h-5"><Icons.Calendar /></div>
          Ajouter au calendrier
        </button>
        
        <button
          onClick={() => onComplete?.(actions)}
          className="flex items-center justify-center gap-2 py-4 rounded-xl font-semibold text-black"
          style={{ backgroundColor: moduleColor }}
        >
          <div className="w-5 h-5"><Icons.Check /></div>
          Valider le plan
        </button>
      </div>
    </div>
  );
}
