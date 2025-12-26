'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ============================================
// TYPES
// ============================================
interface Department {
  id: string;
  name: string;
  icon: string;
  color: string;
  examples: string[];
  systems: string[];
}

// ============================================
// DEPARTMENTS DATA
// ============================================
const DEPARTMENTS: Department[] = [
  {
    id: 'rh',
    name: 'Ressources Humaines',
    icon: '👥',
    color: '#FF6B6B',
    examples: [
      'Tri automatique de CV (Indeed, LinkedIn Recruiter)',
      'Chatbot RH pour les employés',
      'Analyse de performance',
      'Prédiction de turnover',
      'Matching candidat/poste'
    ],
    systems: []
  },
  {
    id: 'commercial',
    name: 'Commercial & Ventes',
    icon: '💼',
    color: '#4ECDC4',
    examples: [
      'Scoring clients (Salesforce Einstein)',
      'Prédiction de ventes',
      'Chatbot de qualification leads',
      'Assistant de pricing dynamique',
      'Analyse de sentiment clients'
    ],
    systems: []
  },
  {
    id: 'marketing',
    name: 'Marketing & Communication',
    icon: '📣',
    color: '#FFE66D',
    examples: [
      'Génération de contenu (ChatGPT, Jasper)',
      'Personnalisation email/web',
      'Segmentation automatique',
      'Optimisation publicitaire',
      'Création d\'images (DALL-E, Midjourney)'
    ],
    systems: []
  },
  {
    id: 'finance',
    name: 'Finance & Comptabilité',
    icon: '💰',
    color: '#95E1D3',
    examples: [
      'Détection de fraude',
      'Prévisions de trésorerie',
      'Rapprochement bancaire auto',
      'Analyse de dépenses',
      'Scoring crédit fournisseurs'
    ],
    systems: []
  },
  {
    id: 'it',
    name: 'IT & Systèmes',
    icon: '💻',
    color: '#A8E6CF',
    examples: [
      'Copilot / Assistance au code',
      'Détection d\'anomalies réseau',
      'Chatbot support IT',
      'Prédiction de pannes',
      'Analyse de logs automatisée'
    ],
    systems: []
  },
  {
    id: 'production',
    name: 'Production & Opérations',
    icon: '🏭',
    color: '#DDA0DD',
    examples: [
      'Maintenance prédictive',
      'Optimisation de production',
      'Contrôle qualité visuel',
      'Gestion des stocks',
      'Planification automatisée'
    ],
    systems: []
  },
  {
    id: 'service_client',
    name: 'Service Client',
    icon: '🎧',
    color: '#87CEEB',
    examples: [
      'Chatbot de support',
      'Analyse de sentiment',
      'Routage intelligent des tickets',
      'Base de connaissances IA',
      'Transcription d\'appels'
    ],
    systems: []
  },
  {
    id: 'direction',
    name: 'Direction Générale',
    icon: '🎯',
    color: '#F0E68C',
    examples: [
      'Tableaux de bord prédictifs',
      'Assistants IA personnels',
      'Analyse de documents',
      'Veille concurrentielle IA',
      'Simulation de scénarios'
    ],
    systems: []
  }
];

// ============================================
// ICONS
// ============================================
const Icons = {
  Plus: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  X: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  Download: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
  Check: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-full h-full"><polyline points="20 6 9 17 4 12"/></svg>,
  Lightbulb: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><path d="M9 18h6"/><path d="M10 22h4"/><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14"/></svg>,
  FileText: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
};

// ============================================
// MAIN COMPONENT
// ============================================
export default function BrainstormingGrid({
  onComplete,
  moduleColor = '#00F5FF'
}: {
  onComplete?: (departments: Department[]) => void;
  moduleColor?: string;
}) {
  const [departments, setDepartments] = useState<Department[]>(DEPARTMENTS);
  const [selectedDept, setSelectedDept] = useState<string | null>(null);
  const [newSystem, setNewSystem] = useState('');
  const [showTips, setShowTips] = useState(true);

  // Load saved data
  useEffect(() => {
    const saved = localStorage.getItem('brainstormingData');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setDepartments(DEPARTMENTS.map(d => ({
          ...d,
          systems: parsed[d.id] || []
        })));
      } catch (e) {
        console.error('Error loading saved data:', e);
      }
    }
  }, []);

  // Save data
  useEffect(() => {
    const data: Record<string, string[]> = {};
    departments.forEach(d => {
      data[d.id] = d.systems;
    });
    localStorage.setItem('brainstormingData', JSON.stringify(data));
  }, [departments]);

  // Add a system
  const addSystem = (deptId: string, system: string) => {
    if (!system.trim()) return;
    
    setDepartments(departments.map(d => 
      d.id === deptId 
        ? { ...d, systems: [...d.systems, system.trim()] }
        : d
    ));
    setNewSystem('');
  };

  // Remove a system
  const removeSystem = (deptId: string, index: number) => {
    setDepartments(departments.map(d => 
      d.id === deptId 
        ? { ...d, systems: d.systems.filter((_, i) => i !== index) }
        : d
    ));
  };

  // Add example to systems
  const addExample = (deptId: string, example: string) => {
    addSystem(deptId, example);
  };

  // Calculate total systems
  const totalSystems = departments.reduce((sum, d) => sum + d.systems.length, 0);
  const departmentsWithSystems = departments.filter(d => d.systems.length > 0).length;

  // Export to CSV
  const exportCSV = () => {
    const rows = [['Département', 'Système IA']];
    departments.forEach(d => {
      d.systems.forEach(s => {
        rows.push([d.name, s]);
      });
    });
    
    const csv = rows.map(r => r.map(c => `"${c}"`).join(';')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `brainstorming-ia-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  // Complete exercise
  const handleComplete = () => {
    if (onComplete) {
      onComplete(departments);
    }
  };

  const selectedDepartment = departments.find(d => d.id === selectedDept);

  return (
    <div className="min-h-[600px]">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">🗺️ Chasse au Trésor IA</h2>
        <p className="text-white/60">
          Identifiez tous les systèmes d'IA utilisés dans chaque département de votre entreprise.
        </p>
      </div>

      {/* Progress */}
      <div className="bg-white/5 rounded-xl p-4 mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-white/60 text-sm">Systèmes identifiés</span>
          <span className="text-white font-bold">{totalSystems} systèmes dans {departmentsWithSystems} départements</span>
        </div>
        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: moduleColor }}
            initial={{ width: 0 }}
            animate={{ width: `${Math.min((totalSystems / 20) * 100, 100)}%` }}
          />
        </div>
        <p className="text-white/40 text-xs mt-2">
          Objectif : identifier au moins 5 systèmes pour continuer
        </p>
      </div>

      {/* Tips */}
      <AnimatePresence>
        {showTips && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 mb-6 relative"
          >
            <button
              onClick={() => setShowTips(false)}
              className="absolute top-2 right-2 w-6 h-6 text-white/40 hover:text-white"
            >
              <Icons.X />
            </button>
            <h4 className="font-medium text-yellow-400 mb-2 flex items-center gap-2">
              <div className="w-5 h-5"><Icons.Lightbulb /></div>
              Technique du 5x5
            </h4>
            <p className="text-sm text-white/70 mb-2">
              Pour chaque département, cherchez les 5 zones où l'IA se cache :
            </p>
            <div className="grid grid-cols-5 gap-2 text-xs">
              <div className="bg-black/20 rounded-lg p-2 text-center">
                <p className="text-white/80">📊</p>
                <p className="text-white/50">Outils métier</p>
              </div>
              <div className="bg-black/20 rounded-lg p-2 text-center">
                <p className="text-white/80">☁️</p>
                <p className="text-white/50">SaaS</p>
              </div>
              <div className="bg-black/20 rounded-lg p-2 text-center">
                <p className="text-white/80">🤝</p>
                <p className="text-white/50">Prestataires</p>
              </div>
              <div className="bg-black/20 rounded-lg p-2 text-center">
                <p className="text-white/80">👤</p>
                <p className="text-white/50">Usages perso</p>
              </div>
              <div className="bg-black/20 rounded-lg p-2 text-center">
                <p className="text-white/80">🚧</p>
                <p className="text-white/50">Projets</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Departments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {departments.map((dept) => (
          <motion.button
            key={dept.id}
            onClick={() => setSelectedDept(selectedDept === dept.id ? null : dept.id)}
            whileHover={{ scale: 1.02 }}
            className={`p-4 rounded-xl text-left transition-all ${
              selectedDept === dept.id 
                ? 'ring-2' 
                : 'bg-white/5 hover:bg-white/10'
            }`}
            style={selectedDept === dept.id ? { 
              backgroundColor: `${dept.color}20`,
              // @ts-ignore - ringColor for custom styling
              '--ring-color': dept.color 
            } as React.CSSProperties : {}}
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">{dept.icon}</span>
              <span className="font-medium text-sm">{dept.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <div 
                className="px-2 py-0.5 rounded-full text-xs font-medium"
                style={{ 
                  backgroundColor: dept.systems.length > 0 ? `${dept.color}30` : 'rgba(255,255,255,0.1)',
                  color: dept.systems.length > 0 ? dept.color : 'rgba(255,255,255,0.4)'
                }}
              >
                {dept.systems.length} système{dept.systems.length > 1 ? 's' : ''}
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Department Detail */}
      <AnimatePresence>
        {selectedDepartment && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div 
              className="rounded-xl p-6 mb-6"
              style={{ backgroundColor: `${selectedDepartment.color}10` }}
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">{selectedDepartment.icon}</span>
                <div>
                  <h3 className="font-bold text-lg">{selectedDepartment.name}</h3>
                  <p className="text-white/40 text-sm">
                    {selectedDepartment.systems.length} système{selectedDepartment.systems.length > 1 ? 's' : ''} identifié{selectedDepartment.systems.length > 1 ? 's' : ''}
                  </p>
                </div>
              </div>

              {/* Add new system */}
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={newSystem}
                  onChange={(e) => setNewSystem(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addSystem(selectedDepartment.id, newSystem)}
                  placeholder="Nom du système IA..."
                  className="flex-1 bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-white/30"
                />
                <button
                  onClick={() => addSystem(selectedDepartment.id, newSystem)}
                  disabled={!newSystem.trim()}
                  className="px-4 py-3 rounded-xl font-medium transition-all disabled:opacity-50 flex items-center gap-2"
                  style={{ backgroundColor: selectedDepartment.color, color: '#000' }}
                >
                  <div className="w-5 h-5"><Icons.Plus /></div>
                  Ajouter
                </button>
              </div>

              {/* Systems list */}
              {selectedDepartment.systems.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm text-white/40 mb-2">Vos systèmes :</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedDepartment.systems.map((system, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/20 text-sm"
                      >
                        {system}
                        <button
                          onClick={() => removeSystem(selectedDepartment.id, idx)}
                          className="w-4 h-4 text-white/40 hover:text-white"
                        >
                          <Icons.X />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Examples */}
              <div>
                <p className="text-sm text-white/40 mb-2">Exemples courants (cliquez pour ajouter) :</p>
                <div className="flex flex-wrap gap-2">
                  {selectedDepartment.examples
                    .filter(ex => !selectedDepartment.systems.includes(ex))
                    .map((example, idx) => (
                      <button
                        key={idx}
                        onClick={() => addExample(selectedDepartment.id, example)}
                        className="px-3 py-1 rounded-full bg-white/5 hover:bg-white/10 text-sm text-white/70 hover:text-white transition-colors"
                      >
                        + {example}
                      </button>
                    ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Summary */}
      {totalSystems > 0 && (
        <div className="bg-white/5 rounded-xl p-4 mb-6">
          <h4 className="font-semibold mb-3">📋 Récapitulatif</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {departments.filter(d => d.systems.length > 0).map(dept => (
              <div key={dept.id} className="flex items-center gap-2 text-sm">
                <span>{dept.icon}</span>
                <span className="text-white/60">{dept.name}:</span>
                <span className="font-medium" style={{ color: dept.color }}>
                  {dept.systems.length}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col gap-3">
        <div className="flex gap-3">
          <button
            onClick={exportCSV}
            disabled={totalSystems === 0}
            className="flex-1 py-3 rounded-xl bg-white/10 hover:bg-white/20 font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
          >
            <div className="w-5 h-5"><Icons.Download /></div>
            Exporter CSV
          </button>
          
          <button
            onClick={() => {
              // Export PDF
              const content = departments.filter(d => d.systems.length > 0)
                .map(d => `${d.name}:\n${d.systems.map(s => `  - ${s}`).join('\n')}`)
                .join('\n\n');
              
              const blob = new Blob([
                `CARTOGRAPHIE DES SYSTÈMES IA\n`,
                `Date: ${new Date().toLocaleDateString('fr-FR')}\n`,
                `Total: ${totalSystems} systèmes dans ${departmentsWithSystems} départements\n\n`,
                `${'='.repeat(50)}\n\n`,
                content
              ], { type: 'text/plain' });
              
              const url = URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.href = url;
              link.download = `cartographie-ia-${new Date().toISOString().split('T')[0]}.txt`;
              link.click();
            }}
            disabled={totalSystems === 0}
            className="flex-1 py-3 rounded-xl bg-white/10 hover:bg-white/20 font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
          >
            <div className="w-5 h-5"><Icons.FileText /></div>
            Exporter TXT
          </button>
        </div>
        
        <button
          onClick={handleComplete}
          disabled={totalSystems < 5}
          className="w-full py-4 rounded-xl font-semibold text-black disabled:opacity-50 transition-all"
          style={{ backgroundColor: moduleColor }}
        >
          {totalSystems < 5 
            ? `Identifiez au moins 5 systèmes (${totalSystems}/5)` 
            : (
              <span className="flex items-center justify-center gap-2">
                <div className="w-5 h-5"><Icons.Check /></div>
                Valider l'exercice
              </span>
            )}
        </button>
      </div>
    </div>
  );
}
