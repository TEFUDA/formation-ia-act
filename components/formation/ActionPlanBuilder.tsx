'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ============================================
// TYPES
// ============================================
interface Action {
  id: string;
  week: number;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  category: 'documentation' | 'formation' | 'technique' | 'gouvernance' | 'audit';
  completed: boolean;
  dueDate?: string;
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
// PHASES DATA
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
        category: 'documentation'
      },
      {
        week: 1,
        title: 'Identifier les responsables par système',
        description: 'Nommer un référent pour chaque IA identifiée',
        priority: 'high',
        category: 'gouvernance'
      },
      {
        week: 2,
        title: 'Classifier tous les systèmes',
        description: 'Utiliser la matrice de classification AI Act',
        priority: 'high',
        category: 'documentation'
      },
      {
        week: 3,
        title: 'Prioriser les systèmes à haut risque',
        description: 'Identifier les 3-5 systèmes prioritaires',
        priority: 'high',
        category: 'gouvernance'
      },
      {
        week: 4,
        title: 'Demander la documentation aux fournisseurs',
        description: 'Envoyer les emails de demande Annexe IV',
        priority: 'medium',
        category: 'documentation'
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
        category: 'gouvernance'
      },
      {
        week: 5,
        title: 'Planifier les formations Article 4',
        description: 'Identifier les opérateurs à former',
        priority: 'high',
        category: 'formation'
      },
      {
        week: 6,
        title: 'Déployer les formations',
        description: 'Former les premiers opérateurs IA',
        priority: 'high',
        category: 'formation'
      },
      {
        week: 7,
        title: 'Mettre en place les mentions de transparence',
        description: 'Ajouter les mentions "IA" sur les interfaces',
        priority: 'medium',
        category: 'technique'
      },
      {
        week: 8,
        title: 'Documenter les analyses d\'impact',
        description: 'Réaliser les DPIA pour systèmes haut risque',
        priority: 'high',
        category: 'documentation'
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
        category: 'technique'
      },
      {
        week: 9,
        title: 'Configurer la journalisation',
        description: 'Activer les logs pour systèmes haut risque',
        priority: 'medium',
        category: 'technique'
      },
      {
        week: 10,
        title: 'Valider avec le DPO/juridique',
        description: 'Revue croisée RGPD/AI Act',
        priority: 'high',
        category: 'gouvernance'
      },
      {
        week: 11,
        title: 'Réaliser un audit interne',
        description: 'Test à blanc de contrôle',
        priority: 'medium',
        category: 'audit'
      },
      {
        week: 12,
        title: 'Corriger les non-conformités',
        description: 'Plan d\'action sur les écarts identifiés',
        priority: 'high',
        category: 'audit'
      },
      {
        week: 12,
        title: 'Préparer le dossier de conformité',
        description: 'Consolider toute la documentation',
        priority: 'high',
        category: 'documentation'
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
  low: { label: 'Basse', color: '#00FF88' }
};

// ============================================
// MAIN COMPONENT
// ============================================
export default function ActionPlanBuilder({
  onComplete,
  moduleColor = '#00FF88',
  startDate = new Date()
}: {
  onComplete?: (actions: Action[]) => void;
  moduleColor?: string;
  startDate?: Date;
}) {
  const [actions, setActions] = useState<Action[]>([]);
  const [expandedPhase, setExpandedPhase] = useState<string>('phase1');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAction, setNewAction] = useState({
    week: 1,
    title: '',
    description: '',
    priority: 'medium' as 'high' | 'medium' | 'low',
    category: 'documentation' as keyof typeof CATEGORY_CONFIG
  });

  // Initialize with default actions
  useEffect(() => {
    const initialActions: Action[] = [];
    PHASES.forEach(phase => {
      phase.defaultActions.forEach((action, idx) => {
        const weekStart = new Date(startDate);
        weekStart.setDate(weekStart.getDate() + (action.week - 1) * 7);
        
        initialActions.push({
          ...action,
          id: `${phase.id}-${idx}`,
          completed: false,
          dueDate: weekStart.toISOString().split('T')[0]
        });
      });
    });
    setActions(initialActions);
  }, [startDate]);

  // Toggle action completion
  const toggleAction = (id: string) => {
    setActions(actions.map(a => 
      a.id === id ? { ...a, completed: !a.completed } : a
    ));
  };

  // Delete action
  const deleteAction = (id: string) => {
    setActions(actions.filter(a => a.id !== id));
  };

  // Add custom action
  const addAction = () => {
    if (!newAction.title.trim()) return;

    const weekStart = new Date(startDate);
    weekStart.setDate(weekStart.getDate() + (newAction.week - 1) * 7);

    setActions([...actions, {
      ...newAction,
      id: `custom-${Date.now()}`,
      completed: false,
      dueDate: weekStart.toISOString().split('T')[0]
    }]);

    setNewAction({
      week: 1,
      title: '',
      description: '',
      priority: 'medium',
      category: 'documentation'
    });
    setShowAddForm(false);
  };

  // Calculate progress
  const completedCount = actions.filter(a => a.completed).length;
  const totalCount = actions.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Group actions by phase
  const getPhaseActions = (phaseId: string) => {
    const phase = PHASES.find(p => p.id === phaseId);
    if (!phase) return [];
    
    const weekRanges: Record<string, [number, number]> = {
      phase1: [1, 4],
      phase2: [5, 8],
      phase3: [9, 12]
    };
    
    const [minWeek, maxWeek] = weekRanges[phaseId] || [1, 12];
    return actions.filter(a => a.week >= minWeek && a.week <= maxWeek);
  };

  // Export to CSV
  const exportCSV = () => {
    const rows = [['Semaine', 'Titre', 'Description', 'Priorité', 'Catégorie', 'Date', 'Complété']];
    actions.forEach(a => {
      rows.push([
        `S${a.week}`,
        a.title,
        a.description,
        PRIORITY_CONFIG[a.priority].label,
        CATEGORY_CONFIG[a.category].label,
        a.dueDate || '',
        a.completed ? 'Oui' : 'Non'
      ]);
    });
    
    const csv = rows.map(r => r.map(c => `"${c}"`).join(';')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `plan-action-ai-act-90jours.csv`;
    link.click();
  };

  // Add to Google Calendar
  const addToGoogleCalendar = () => {
    // Create iCal content
    let icalContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Formation AI Act//FR
`;
    
    actions.filter(a => !a.completed).forEach(action => {
      const date = action.dueDate ? new Date(action.dueDate) : new Date();
      const dateStr = date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
      
      icalContent += `BEGIN:VEVENT
DTSTART:${dateStr}
DTEND:${dateStr}
SUMMARY:[AI Act] ${action.title}
DESCRIPTION:${action.description}
END:VEVENT
`;
    });
    
    icalContent += 'END:VCALENDAR';
    
    const blob = new Blob([icalContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'plan-action-ai-act.ics';
    link.click();
  };

  return (
    <div className="min-h-[600px]">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">📅 Plan d'Action 90 Jours</h2>
        <p className="text-white/60">
          Votre feuille de route personnalisée pour la mise en conformité AI Act.
        </p>
      </div>

      {/* Progress */}
      <div className="bg-white/5 rounded-xl p-4 mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-white/60 text-sm">Progression globale</span>
          <span className="text-white font-bold">{completedCount}/{totalCount} actions</span>
        </div>
        <div className="h-3 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: moduleColor }}
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
          />
        </div>
        <div className="flex justify-between mt-2 text-xs text-white/40">
          <span>Semaine 1</span>
          <span>Semaine 4</span>
          <span>Semaine 8</span>
          <span>Semaine 12</span>
        </div>
      </div>

      {/* Phases */}
      <div className="space-y-4 mb-6">
        {PHASES.map(phase => {
          const phaseActions = getPhaseActions(phase.id);
          const phaseCompleted = phaseActions.filter(a => a.completed).length;
          const isExpanded = expandedPhase === phase.id;

          return (
            <div key={phase.id} className="rounded-xl overflow-hidden">
              {/* Phase Header */}
              <button
                onClick={() => setExpandedPhase(isExpanded ? '' : phase.id)}
                className="w-full p-4 flex items-center gap-4 transition-colors"
                style={{ backgroundColor: `${phase.color}20` }}
              >
                <span className="text-2xl">{phase.icon}</span>
                <div className="flex-1 text-left">
                  <h3 className="font-semibold">{phase.name}</h3>
                  <p className="text-sm text-white/40">{phase.weeks}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span 
                    className="text-sm font-medium px-2 py-1 rounded-full"
                    style={{ backgroundColor: `${phase.color}30`, color: phase.color }}
                  >
                    {phaseCompleted}/{phaseActions.length}
                  </span>
                  <motion.div
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    className="w-5 h-5 text-white/40"
                  >
                    <Icons.ChevronDown />
                  </motion.div>
                </div>
              </button>

              {/* Phase Actions */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="p-4 space-y-2 bg-white/5">
                      {phaseActions.map(action => (
                        <div
                          key={action.id}
                          className={`p-4 rounded-xl flex items-start gap-4 transition-all ${
                            action.completed ? 'bg-green-500/10 opacity-60' : 'bg-black/20'
                          }`}
                        >
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
                            <div className="flex items-center gap-2 mb-1">
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
                          </div>

                          {/* Delete */}
                          <button
                            onClick={() => deleteAction(action.id)}
                            className="w-8 h-8 rounded-lg bg-white/5 hover:bg-red-500/20 flex items-center justify-center text-white/30 hover:text-red-400 transition-colors flex-shrink-0"
                          >
                            <div className="w-4 h-4"><Icons.Trash /></div>
                          </button>
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
