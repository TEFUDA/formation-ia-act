'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// ============================================
// TYPES
// ============================================
interface ActionItem {
  id: string;
  title: string;
  description: string;
  category: 'governance' | 'inventory' | 'classification' | 'documentation' | 'training' | 'monitoring';
  priority: 'critical' | 'high' | 'medium' | 'low';
  phase: 1 | 2 | 3;
  status: 'todo' | 'inProgress' | 'done' | 'blocked';
  dueDate?: string;
  assignee?: string;
  notes?: string;
  dependencies?: string[];
  aiActArticle?: string;
}

interface ActionPlan {
  companyName: string;
  startDate: string;
  actions: ActionItem[];
  createdAt: string;
  lastUpdated: string;
}

// ============================================
// PREDEFINED ACTIONS
// ============================================
const ACTION_TEMPLATES: Omit<ActionItem, 'id' | 'status' | 'dueDate' | 'assignee' | 'notes'>[] = [
  // Phase 1: Foundation (Days 1-30)
  {
    title: 'Désigner un responsable IA',
    description: 'Nommer une personne ou créer un comité responsable de la conformité AI Act',
    category: 'governance',
    priority: 'critical',
    phase: 1,
    aiActArticle: 'Art. 26',
  },
  {
    title: 'Sensibiliser la direction',
    description: 'Présenter l\'AI Act et ses implications au COMEX/Direction',
    category: 'governance',
    priority: 'critical',
    phase: 1,
  },
  {
    title: 'Inventaire initial des systèmes IA',
    description: 'Lister tous les systèmes d\'IA utilisés dans l\'entreprise',
    category: 'inventory',
    priority: 'critical',
    phase: 1,
    aiActArticle: 'Art. 26.5',
  },
  {
    title: 'Identifier les systèmes à haut risque',
    description: 'Classifier les systèmes selon les catégories de l\'Annexe III',
    category: 'classification',
    priority: 'high',
    phase: 1,
    aiActArticle: 'Annexe III',
  },
  {
    title: 'Vérifier les pratiques interdites',
    description: 'S\'assurer qu\'aucun système n\'entre dans les catégories interdites (Art. 5)',
    category: 'classification',
    priority: 'critical',
    phase: 1,
    aiActArticle: 'Art. 5',
  },
  {
    title: 'Rédiger une politique IA préliminaire',
    description: 'Établir les premières règles d\'utilisation de l\'IA',
    category: 'governance',
    priority: 'high',
    phase: 1,
  },

  // Phase 2: Development (Days 31-60)
  {
    title: 'Créer le registre IA officiel',
    description: 'Documenter chaque système avec les informations requises par l\'AI Act',
    category: 'documentation',
    priority: 'critical',
    phase: 2,
    aiActArticle: 'Art. 49',
  },
  {
    title: 'Contacter les fournisseurs',
    description: 'Demander la documentation technique aux fournisseurs de systèmes IA',
    category: 'documentation',
    priority: 'high',
    phase: 2,
    aiActArticle: 'Art. 26.2',
  },
  {
    title: 'Évaluer les risques par système',
    description: 'Réaliser une évaluation des risques pour chaque système à haut risque',
    category: 'classification',
    priority: 'high',
    phase: 2,
    aiActArticle: 'Art. 9',
  },
  {
    title: 'Former les équipes clés',
    description: 'Sensibiliser les utilisateurs principaux d\'IA aux nouvelles obligations',
    category: 'training',
    priority: 'high',
    phase: 2,
    aiActArticle: 'Art. 4',
  },
  {
    title: 'Mettre en place la supervision humaine',
    description: 'Définir les procédures de contrôle humain pour les systèmes à haut risque',
    category: 'governance',
    priority: 'high',
    phase: 2,
    aiActArticle: 'Art. 14',
  },
  {
    title: 'Établir la procédure d\'incidents',
    description: 'Créer un processus de signalement et gestion des incidents IA',
    category: 'governance',
    priority: 'medium',
    phase: 2,
    aiActArticle: 'Art. 26.5',
  },

  // Phase 3: Finalization (Days 61-90)
  {
    title: 'Finaliser la politique IA',
    description: 'Compléter et valider la politique d\'utilisation de l\'IA',
    category: 'governance',
    priority: 'high',
    phase: 3,
  },
  {
    title: 'Déployer la formation générale',
    description: 'Former l\'ensemble des collaborateurs concernés',
    category: 'training',
    priority: 'medium',
    phase: 3,
    aiActArticle: 'Art. 4',
  },
  {
    title: 'Implémenter les mentions légales',
    description: 'Ajouter les mentions de transparence IA sur les interfaces utilisateurs',
    category: 'documentation',
    priority: 'medium',
    phase: 3,
    aiActArticle: 'Art. 50',
  },
  {
    title: 'Mettre en place le monitoring',
    description: 'Créer un tableau de bord de suivi de la conformité IA',
    category: 'monitoring',
    priority: 'medium',
    phase: 3,
  },
  {
    title: 'Auditer les systèmes à haut risque',
    description: 'Réaliser un audit interne de conformité sur les systèmes critiques',
    category: 'monitoring',
    priority: 'high',
    phase: 3,
    aiActArticle: 'Art. 26.11',
  },
  {
    title: 'Préparer le plan de veille',
    description: 'Établir un processus de veille réglementaire continue',
    category: 'monitoring',
    priority: 'low',
    phase: 3,
  },
];

const CATEGORIES = {
  governance: { label: 'Gouvernance', icon: '🏛️', color: '#8B5CF6' },
  inventory: { label: 'Inventaire', icon: '📋', color: '#00FF88' },
  classification: { label: 'Classification', icon: '⚖️', color: '#FFB800' },
  documentation: { label: 'Documentation', icon: '📄', color: '#00F5FF' },
  training: { label: 'Formation', icon: '🎓', color: '#F97316' },
  monitoring: { label: 'Suivi', icon: '📊', color: '#10B981' },
};

const PRIORITIES = {
  critical: { label: 'Critique', color: '#EF4444' },
  high: { label: 'Haute', color: '#F97316' },
  medium: { label: 'Moyenne', color: '#EAB308' },
  low: { label: 'Basse', color: '#22C55E' },
};

const STATUSES = {
  todo: { label: 'À faire', icon: '⏳', color: '#6B7280' },
  inProgress: { label: 'En cours', icon: '🔄', color: '#3B82F6' },
  done: { label: 'Terminé', icon: '✅', color: '#22C55E' },
  blocked: { label: 'Bloqué', icon: '🚫', color: '#EF4444' },
};

// ============================================
// COMPONENT
// ============================================
interface ActionPlanWorkshopProps {
  moduleColor: string;
  onComplete: () => void;
}

export default function ActionPlanWorkshop({ moduleColor, onComplete }: ActionPlanWorkshopProps) {
  const [plan, setPlan] = useState<ActionPlan>({
    companyName: '',
    startDate: new Date().toISOString().split('T')[0],
    actions: [],
    createdAt: new Date().toISOString(),
    lastUpdated: new Date().toISOString(),
  });
  const [viewMode, setViewMode] = useState<'setup' | 'board' | 'timeline' | 'export'>('setup');
  const [selectedAction, setSelectedAction] = useState<ActionItem | null>(null);
  const [filterPhase, setFilterPhase] = useState<number | null>(null);
  const [filterCategory, setFilterCategory] = useState<string | null>(null);

  // Load saved plan
  useEffect(() => {
    const savedPlan = localStorage.getItem('workshop_action_plan');
    if (savedPlan) {
      try {
        const parsed = JSON.parse(savedPlan);
        setPlan(parsed);
        if (parsed.actions.length > 0) {
          setViewMode('board');
        }
      } catch (e) {
        console.error('Error loading plan:', e);
      }
    }

    // Load company name
    const savedProfile = localStorage.getItem('workshop_company_profile');
    if (savedProfile) {
      try {
        const profile = JSON.parse(savedProfile);
        if (profile.name) {
          setPlan(prev => ({ ...prev, companyName: profile.name }));
        }
      } catch (e) {
        console.error('Error loading profile:', e);
      }
    }
  }, []);

  // Save plan
  useEffect(() => {
    if (plan.actions.length > 0 || plan.companyName) {
      localStorage.setItem('workshop_action_plan', JSON.stringify({
        ...plan,
        lastUpdated: new Date().toISOString()
      }));
    }
  }, [plan]);

  const initializePlan = () => {
    const startDate = new Date(plan.startDate);
    const actions: ActionItem[] = ACTION_TEMPLATES.map((template, idx) => {
      // Calculate due date based on phase
      let dueDateOffset = 0;
      if (template.phase === 1) dueDateOffset = 10 + (idx % 6) * 3;
      else if (template.phase === 2) dueDateOffset = 35 + (idx % 6) * 4;
      else dueDateOffset = 65 + (idx % 6) * 4;

      const dueDate = new Date(startDate);
      dueDate.setDate(dueDate.getDate() + dueDateOffset);

      return {
        ...template,
        id: `action_${Date.now()}_${idx}`,
        status: 'todo',
        dueDate: dueDate.toISOString().split('T')[0],
      };
    });

    setPlan(prev => ({ ...prev, actions }));
    setViewMode('board');
  };

  const updateAction = (actionId: string, updates: Partial<ActionItem>) => {
    setPlan(prev => ({
      ...prev,
      actions: prev.actions.map(a => a.id === actionId ? { ...a, ...updates } : a)
    }));
  };

  const getPhaseProgress = (phase: number) => {
    const phaseActions = plan.actions.filter(a => a.phase === phase);
    if (phaseActions.length === 0) return 0;
    const done = phaseActions.filter(a => a.status === 'done').length;
    return Math.round((done / phaseActions.length) * 100);
  };

  const getTotalProgress = () => {
    if (plan.actions.length === 0) return 0;
    const done = plan.actions.filter(a => a.status === 'done').length;
    return Math.round((done / plan.actions.length) * 100);
  };

  const getFilteredActions = () => {
    return plan.actions.filter(a => {
      if (filterPhase && a.phase !== filterPhase) return false;
      if (filterCategory && a.category !== filterCategory) return false;
      return true;
    });
  };

  const exportPlan = () => {
    const headers = ['Phase', 'Catégorie', 'Priorité', 'Action', 'Description', 'Échéance', 'Statut', 'Assigné', 'Article AI Act'];
    const rows = plan.actions.map(a => [
      `Phase ${a.phase}`,
      CATEGORIES[a.category].label,
      PRIORITIES[a.priority].label,
      a.title,
      a.description,
      a.dueDate || '',
      STATUSES[a.status].label,
      a.assignee || '',
      a.aiActArticle || ''
    ]);

    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${(cell || '').toString().replace(/"/g, '""')}"`).join(','))
      .join('\n');

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `plan-action-ia-${plan.companyName || 'entreprise'}.csv`;
    a.click();
  };

  // Setup View
  if (viewMode === 'setup') {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="text-5xl mb-4">🎯</div>
          <h2 className="text-2xl font-bold mb-2">Plan d'Action 90 Jours</h2>
          <p className="text-white/60">Créez votre roadmap de mise en conformité AI Act</p>
        </div>

        <div className="bg-white/5 rounded-xl p-6 border border-white/10 space-y-4">
          <div>
            <label className="block text-sm text-white/60 mb-2">Nom de l'entreprise</label>
            <input
              type="text"
              value={plan.companyName}
              onChange={(e) => setPlan(prev => ({ ...prev, companyName: e.target.value }))}
              placeholder="Votre entreprise"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm focus:border-[#00F5FF] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm text-white/60 mb-2">Date de début du plan</label>
            <input
              type="date"
              value={plan.startDate}
              onChange={(e) => setPlan(prev => ({ ...prev, startDate: e.target.value }))}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm focus:border-[#00F5FF] focus:outline-none"
            />
          </div>
        </div>

        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
          <h3 className="font-semibold mb-3">📋 Ce plan inclut :</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center p-3 bg-white/5 rounded-lg">
              <div className="text-2xl font-bold" style={{ color: moduleColor }}>{ACTION_TEMPLATES.length}</div>
              <p className="text-xs text-white/40">Actions prédéfinies</p>
            </div>
            <div className="text-center p-3 bg-white/5 rounded-lg">
              <div className="text-2xl font-bold text-purple-400">3</div>
              <p className="text-xs text-white/40">Phases de 30 jours</p>
            </div>
            <div className="text-center p-3 bg-white/5 rounded-lg">
              <div className="text-2xl font-bold text-orange-400">6</div>
              <p className="text-xs text-white/40">Catégories</p>
            </div>
            <div className="text-center p-3 bg-white/5 rounded-lg">
              <div className="text-2xl font-bold text-cyan-400">90</div>
              <p className="text-xs text-white/40">Jours</p>
            </div>
          </div>
        </div>

        <button
          onClick={initializePlan}
          className="w-full py-4 rounded-xl font-bold text-black"
          style={{ backgroundColor: moduleColor }}
        >
          Générer mon plan d'action →
        </button>
      </div>
    );
  }

  // Action Detail Modal
  const ActionDetailModal = () => {
    if (!selectedAction) return null;
    const cat = CATEGORIES[selectedAction.category];
    const priority = PRIORITIES[selectedAction.priority];
    const status = STATUSES[selectedAction.status];

    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-[#1a1a2e] rounded-2xl p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto border border-white/10"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{cat.icon}</span>
              <div>
                <p className="text-xs text-white/40">Phase {selectedAction.phase}</p>
                <h3 className="font-bold">{selectedAction.title}</h3>
              </div>
            </div>
            <button
              onClick={() => setSelectedAction(null)}
              className="text-white/40 hover:text-white"
            >
              ✕
            </button>
          </div>

          <p className="text-sm text-white/60 mb-4">{selectedAction.description}</p>

          {selectedAction.aiActArticle && (
            <div className="bg-white/5 rounded-lg p-3 mb-4 text-sm">
              <span className="text-white/40">📜 Référence AI Act :</span>
              <span className="ml-2 font-medium">{selectedAction.aiActArticle}</span>
            </div>
          )}

          <div className="space-y-4">
            {/* Status */}
            <div>
              <label className="block text-xs text-white/60 mb-2">Statut</label>
              <div className="flex gap-2">
                {(Object.keys(STATUSES) as Array<keyof typeof STATUSES>).map(s => (
                  <button
                    key={s}
                    onClick={() => updateAction(selectedAction.id, { status: s })}
                    className={`flex-1 py-2 rounded-lg text-xs font-medium transition-colors ${
                      selectedAction.status === s ? '' : 'bg-white/5 hover:bg-white/10'
                    }`}
                    style={selectedAction.status === s ? { backgroundColor: STATUSES[s].color } : {}}
                  >
                    {STATUSES[s].icon} {STATUSES[s].label}
                  </button>
                ))}
              </div>
            </div>

            {/* Assignee */}
            <div>
              <label className="block text-xs text-white/60 mb-2">Assigné à</label>
              <input
                type="text"
                value={selectedAction.assignee || ''}
                onChange={(e) => updateAction(selectedAction.id, { assignee: e.target.value })}
                placeholder="Nom du responsable"
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:border-[#00F5FF] focus:outline-none"
              />
            </div>

            {/* Due Date */}
            <div>
              <label className="block text-xs text-white/60 mb-2">Échéance</label>
              <input
                type="date"
                value={selectedAction.dueDate || ''}
                onChange={(e) => updateAction(selectedAction.id, { dueDate: e.target.value })}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:border-[#00F5FF] focus:outline-none"
              />
            </div>

            {/* Notes */}
            <div>
              <label className="block text-xs text-white/60 mb-2">Notes</label>
              <textarea
                value={selectedAction.notes || ''}
                onChange={(e) => updateAction(selectedAction.id, { notes: e.target.value })}
                placeholder="Notes additionnelles..."
                rows={3}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:border-[#00F5FF] focus:outline-none resize-none"
              />
            </div>
          </div>

          <button
            onClick={() => setSelectedAction(null)}
            className="w-full mt-4 py-3 rounded-xl font-bold text-black"
            style={{ backgroundColor: moduleColor }}
          >
            Enregistrer
          </button>
        </motion.div>
      </div>
    );
  };

  // Board View
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <span>🎯</span> Plan d'Action
          </h2>
          <p className="text-white/60 text-sm mt-1">{plan.companyName}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('timeline')}
            className={`px-3 py-2 rounded-lg text-sm ${viewMode === 'timeline' ? 'bg-white/20' : 'bg-white/10 hover:bg-white/20'}`}
          >
            📅 Timeline
          </button>
          <button
            onClick={exportPlan}
            className="px-3 py-2 rounded-lg text-sm font-medium"
            style={{ backgroundColor: `${moduleColor}20`, color: moduleColor }}
          >
            📥 Export
          </button>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-4 gap-3">
        <div className="bg-white/5 rounded-xl p-3 text-center border border-white/10">
          <div className="text-2xl font-bold" style={{ color: moduleColor }}>{getTotalProgress()}%</div>
          <p className="text-white/40 text-xs">Total</p>
        </div>
        {[1, 2, 3].map(phase => (
          <div key={phase} className="bg-white/5 rounded-xl p-3 text-center border border-white/10">
            <div className="text-2xl font-bold">{getPhaseProgress(phase)}%</div>
            <p className="text-white/40 text-xs">Phase {phase}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setFilterPhase(null)}
          className={`px-3 py-1.5 rounded-lg text-xs ${!filterPhase ? 'bg-white/20' : 'bg-white/5 hover:bg-white/10'}`}
        >
          Toutes
        </button>
        {[1, 2, 3].map(phase => (
          <button
            key={phase}
            onClick={() => setFilterPhase(filterPhase === phase ? null : phase)}
            className={`px-3 py-1.5 rounded-lg text-xs ${filterPhase === phase ? 'bg-white/20' : 'bg-white/5 hover:bg-white/10'}`}
          >
            Phase {phase}
          </button>
        ))}
        <div className="w-px bg-white/10" />
        {Object.entries(CATEGORIES).map(([key, cat]) => (
          <button
            key={key}
            onClick={() => setFilterCategory(filterCategory === key ? null : key)}
            className={`px-3 py-1.5 rounded-lg text-xs flex items-center gap-1 ${filterCategory === key ? '' : 'bg-white/5 hover:bg-white/10'}`}
            style={filterCategory === key ? { backgroundColor: cat.color } : {}}
          >
            <span>{cat.icon}</span>
            <span className="hidden sm:inline">{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Actions List */}
      <div className="space-y-2 max-h-[50vh] overflow-y-auto">
        {getFilteredActions().map(action => {
          const cat = CATEGORIES[action.category];
          const priority = PRIORITIES[action.priority];
          const status = STATUSES[action.status];
          const isOverdue = action.dueDate && new Date(action.dueDate) < new Date() && action.status !== 'done';

          return (
            <motion.div
              key={action.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => setSelectedAction(action)}
              className={`bg-white/5 rounded-xl p-4 border cursor-pointer hover:bg-white/10 transition-colors ${
                isOverdue ? 'border-red-500/50' : 'border-white/10'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1">
                  <span className="text-xl">{cat.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs px-1.5 py-0.5 rounded" style={{ backgroundColor: `${priority.color}20`, color: priority.color }}>
                        {priority.label}
                      </span>
                      <span className="text-xs text-white/40">Phase {action.phase}</span>
                    </div>
                    <p className="font-medium text-sm truncate">{action.title}</p>
                    <p className="text-white/40 text-xs truncate">{action.description}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span 
                    className="text-xs px-2 py-1 rounded-full"
                    style={{ backgroundColor: `${status.color}20`, color: status.color }}
                  >
                    {status.icon} {status.label}
                  </span>
                  {action.dueDate && (
                    <span className={`text-xs ${isOverdue ? 'text-red-400' : 'text-white/40'}`}>
                      {new Date(action.dueDate).toLocaleDateString('fr-FR')}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-2 text-center">
        {(Object.keys(STATUSES) as Array<keyof typeof STATUSES>).map(s => {
          const count = plan.actions.filter(a => a.status === s).length;
          return (
            <div key={s} className="bg-white/5 rounded-lg p-2">
              <div className="font-bold" style={{ color: STATUSES[s].color }}>{count}</div>
              <p className="text-[10px] text-white/40">{STATUSES[s].label}</p>
            </div>
          );
        })}
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <a
          href="/resources/10-plan-action-90j-personnel.xlsx"
          download
          className="flex-1 py-3 rounded-xl bg-white/10 font-medium text-sm hover:bg-white/20 flex items-center justify-center gap-2"
        >
          📥 Template Excel
        </a>
        <button
          onClick={onComplete}
          className="flex-1 py-3 rounded-xl font-bold text-black text-sm"
          style={{ backgroundColor: moduleColor }}
        >
          Terminer →
        </button>
      </div>

      {/* Action Detail Modal */}
      {selectedAction && <ActionDetailModal />}
    </div>
  );
}
