'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ============================================
// TYPES
// ============================================
interface AISystem {
  id: string;
  name: string;
  vendor: string;
  department: string;
  purpose: string;
  dataTypes: string[];
  users: string;
  frequency: string;
  criticalLevel: 'low' | 'medium' | 'high' | 'critical';
  notes: string;
  createdAt: string;
}

interface Department {
  id: string;
  name: string;
  icon: string;
  suggestions: string[];
}

// ============================================
// DATA
// ============================================
const DEPARTMENTS: Department[] = [
  {
    id: 'hr',
    name: 'Ressources Humaines',
    icon: '👥',
    suggestions: [
      'Tri de CV automatique',
      'Chatbot RH pour les employés',
      'Analyse de sentiment des enquêtes',
      'Planification automatique',
      'Matching CV-Poste',
      'Détection de risque de départ',
    ],
  },
  {
    id: 'marketing',
    name: 'Marketing & Communication',
    icon: '📣',
    suggestions: [
      'Génération de contenu (ChatGPT, etc.)',
      'Personnalisation des campagnes',
      'Scoring des leads',
      'Analyse des sentiments social media',
      'Génération d\'images (DALL-E, etc.)',
      'Recommandation de produits',
      'A/B testing automatisé',
    ],
  },
  {
    id: 'sales',
    name: 'Commercial & Ventes',
    icon: '💼',
    suggestions: [
      'Prédiction des ventes',
      'Chatbot commercial',
      'Scoring des opportunités',
      'Analyse des appels',
      'Recommandation de prix',
      'Prévision de demande',
    ],
  },
  {
    id: 'finance',
    name: 'Finance & Comptabilité',
    icon: '💰',
    suggestions: [
      'Détection de fraude',
      'Prévisions financières',
      'Automatisation des factures',
      'Scoring crédit client',
      'Réconciliation bancaire',
      'Analyse des dépenses',
    ],
  },
  {
    id: 'it',
    name: 'IT & Systèmes',
    icon: '💻',
    suggestions: [
      'Détection d\'anomalies sécurité',
      'Chatbot support IT',
      'Analyse des logs',
      'Maintenance prédictive',
      'Copilot / Assistant code',
      'Automatisation des tests',
    ],
  },
  {
    id: 'customer_service',
    name: 'Service Client',
    icon: '🎧',
    suggestions: [
      'Chatbot service client',
      'Routage intelligent des tickets',
      'Analyse des sentiments',
      'Suggestions de réponses',
      'Transcription des appels',
      'FAQ dynamique',
    ],
  },
  {
    id: 'operations',
    name: 'Opérations & Logistique',
    icon: '🏭',
    suggestions: [
      'Optimisation des stocks',
      'Planification de production',
      'Maintenance prédictive',
      'Optimisation des tournées',
      'Contrôle qualité visuel',
      'Prévision de demande',
    ],
  },
  {
    id: 'legal',
    name: 'Juridique & Conformité',
    icon: '⚖️',
    suggestions: [
      'Analyse de contrats',
      'Recherche juridique IA',
      'Due diligence automatisée',
      'Veille réglementaire',
      'Génération de documents',
    ],
  },
  {
    id: 'rd',
    name: 'R&D / Innovation',
    icon: '🔬',
    suggestions: [
      'Analyse de brevets',
      'Simulation / Modélisation',
      'Analyse de données scientifiques',
      'Génération de formulations',
      'Découverte de molécules',
    ],
  },
  {
    id: 'other',
    name: 'Autre / Transverse',
    icon: '📋',
    suggestions: [
      'Assistant virtuel général',
      'Traduction automatique',
      'Transcription de réunions',
      'Résumé de documents',
      'Autre système IA',
    ],
  },
];

const DATA_TYPES = [
  { id: 'personal', label: 'Données personnelles (nom, email...)', icon: '👤' },
  { id: 'sensitive', label: 'Données sensibles (santé, religion...)', icon: '🔒' },
  { id: 'financial', label: 'Données financières', icon: '💳' },
  { id: 'biometric', label: 'Données biométriques', icon: '🔐' },
  { id: 'behavioral', label: 'Données comportementales', icon: '📊' },
  { id: 'professional', label: 'Données professionnelles', icon: '💼' },
  { id: 'public', label: 'Données publiques uniquement', icon: '🌐' },
  { id: 'none', label: 'Aucune donnée personnelle', icon: '✅' },
];

const FREQUENCY_OPTIONS = [
  { value: 'realtime', label: 'Temps réel / Continu' },
  { value: 'daily', label: 'Quotidien' },
  { value: 'weekly', label: 'Hebdomadaire' },
  { value: 'monthly', label: 'Mensuel' },
  { value: 'occasional', label: 'Occasionnel' },
];

const CRITICAL_LEVELS = [
  { value: 'low', label: 'Faible', color: '#22C55E', description: 'Impact limité si indisponible' },
  { value: 'medium', label: 'Moyen', color: '#EAB308', description: 'Gêne opérationnelle' },
  { value: 'high', label: 'Élevé', color: '#F97316', description: 'Impact business significatif' },
  { value: 'critical', label: 'Critique', color: '#EF4444', description: 'Activité bloquée' },
];

// ============================================
// COMPONENT
// ============================================
interface InventoryWorkshopProps {
  moduleColor: string;
  onComplete: () => void;
}

export default function InventoryWorkshop({ moduleColor, onComplete }: InventoryWorkshopProps) {
  const [systems, setSystems] = useState<AISystem[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);
  const [isAddingSystem, setIsAddingSystem] = useState(false);
  const [editingSystem, setEditingSystem] = useState<AISystem | null>(null);
  const [showSummary, setShowSummary] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    vendor: '',
    purpose: '',
    dataTypes: [] as string[],
    users: '',
    frequency: 'daily',
    criticalLevel: 'medium' as AISystem['criticalLevel'],
    notes: '',
  });

  // Load saved systems
  useEffect(() => {
    const saved = localStorage.getItem('workshop_ai_inventory');
    if (saved) {
      try {
        setSystems(JSON.parse(saved));
      } catch (e) {
        console.error('Error loading inventory:', e);
      }
    }
  }, []);

  // Save systems
  useEffect(() => {
    localStorage.setItem('workshop_ai_inventory', JSON.stringify(systems));
  }, [systems]);

  const resetForm = () => {
    setFormData({
      name: '',
      vendor: '',
      purpose: '',
      dataTypes: [],
      users: '',
      frequency: 'daily',
      criticalLevel: 'medium',
      notes: '',
    });
  };

  const handleAddSystem = () => {
    if (!selectedDepartment || !formData.name) return;

    const newSystem: AISystem = {
      id: `sys_${Date.now()}`,
      name: formData.name,
      vendor: formData.vendor,
      department: selectedDepartment,
      purpose: formData.purpose,
      dataTypes: formData.dataTypes,
      users: formData.users,
      frequency: formData.frequency,
      criticalLevel: formData.criticalLevel,
      notes: formData.notes,
      createdAt: new Date().toISOString(),
    };

    setSystems([...systems, newSystem]);
    resetForm();
    setIsAddingSystem(false);
  };

  const handleUpdateSystem = () => {
    if (!editingSystem) return;

    setSystems(systems.map(s => 
      s.id === editingSystem.id 
        ? { ...editingSystem, ...formData }
        : s
    ));
    setEditingSystem(null);
    resetForm();
  };

  const handleDeleteSystem = (id: string) => {
    if (confirm('Supprimer ce système ?')) {
      setSystems(systems.filter(s => s.id !== id));
    }
  };

  const startEdit = (system: AISystem) => {
    setEditingSystem(system);
    setFormData({
      name: system.name,
      vendor: system.vendor,
      purpose: system.purpose,
      dataTypes: system.dataTypes,
      users: system.users,
      frequency: system.frequency,
      criticalLevel: system.criticalLevel,
      notes: system.notes,
    });
    setSelectedDepartment(system.department);
    setIsAddingSystem(true);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setFormData(prev => ({ ...prev, name: suggestion }));
    setIsAddingSystem(true);
  };

  const toggleDataType = (typeId: string) => {
    if (typeId === 'none') {
      setFormData(prev => ({ ...prev, dataTypes: ['none'] }));
    } else {
      setFormData(prev => ({
        ...prev,
        dataTypes: prev.dataTypes.includes('none')
          ? [typeId]
          : prev.dataTypes.includes(typeId)
            ? prev.dataTypes.filter(t => t !== typeId)
            : [...prev.dataTypes, typeId]
      }));
    }
  };

  const getSystemsByDepartment = (deptId: string) => {
    return systems.filter(s => s.department === deptId);
  };

  const exportToJSON = () => {
    const data = {
      exportDate: new Date().toISOString(),
      totalSystems: systems.length,
      systems: systems,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'inventaire-ia.json';
    a.click();
  };

  // Summary View
  if (showSummary) {
    const byDepartment = DEPARTMENTS.map(dept => ({
      ...dept,
      count: getSystemsByDepartment(dept.id).length,
      systems: getSystemsByDepartment(dept.id),
    })).filter(d => d.count > 0);

    const byCriticality = {
      critical: systems.filter(s => s.criticalLevel === 'critical').length,
      high: systems.filter(s => s.criticalLevel === 'high').length,
      medium: systems.filter(s => s.criticalLevel === 'medium').length,
      low: systems.filter(s => s.criticalLevel === 'low').length,
    };

    const withSensitiveData = systems.filter(s => 
      s.dataTypes.some(t => ['personal', 'sensitive', 'biometric', 'financial'].includes(t))
    ).length;

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="text-5xl mb-4">📊</div>
          <h2 className="text-2xl font-bold mb-2">Récapitulatif de l'inventaire</h2>
          <p className="text-white/60">{systems.length} système(s) IA identifié(s)</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-white/5 rounded-xl p-4 text-center border border-white/10">
            <div className="text-3xl font-bold" style={{ color: moduleColor }}>{systems.length}</div>
            <p className="text-white/40 text-xs mt-1">Systèmes IA</p>
          </div>
          <div className="bg-white/5 rounded-xl p-4 text-center border border-white/10">
            <div className="text-3xl font-bold text-orange-400">{byCriticality.critical + byCriticality.high}</div>
            <p className="text-white/40 text-xs mt-1">Haute criticité</p>
          </div>
          <div className="bg-white/5 rounded-xl p-4 text-center border border-white/10">
            <div className="text-3xl font-bold text-purple-400">{withSensitiveData}</div>
            <p className="text-white/40 text-xs mt-1">Données sensibles</p>
          </div>
          <div className="bg-white/5 rounded-xl p-4 text-center border border-white/10">
            <div className="text-3xl font-bold text-blue-400">{byDepartment.length}</div>
            <p className="text-white/40 text-xs mt-1">Départements</p>
          </div>
        </div>

        {/* By Department */}
        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <span>🏢</span> Par département
          </h3>
          <div className="space-y-3">
            {byDepartment.map(dept => (
              <div key={dept.id} className="bg-white/5 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">
                    {dept.icon} {dept.name}
                  </span>
                  <span className="text-sm text-white/60">{dept.count} système(s)</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {dept.systems.map(sys => (
                    <span 
                      key={sys.id} 
                      className="text-xs px-2 py-1 rounded-full bg-white/10"
                      style={{ borderLeft: `3px solid ${CRITICAL_LEVELS.find(l => l.value === sys.criticalLevel)?.color}` }}
                    >
                      {sys.name}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Criticality Distribution */}
        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <span>⚠️</span> Répartition par criticité
          </h3>
          <div className="space-y-2">
            {CRITICAL_LEVELS.map(level => {
              const count = byCriticality[level.value as keyof typeof byCriticality];
              const percent = systems.length > 0 ? (count / systems.length) * 100 : 0;
              return (
                <div key={level.value} className="flex items-center gap-3">
                  <span className="w-20 text-sm" style={{ color: level.color }}>{level.label}</span>
                  <div className="flex-1 h-6 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full flex items-center justify-end pr-2"
                      style={{ width: `${Math.max(percent, 5)}%`, backgroundColor: level.color }}
                    >
                      {count > 0 && <span className="text-xs font-bold text-black">{count}</span>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={() => setShowSummary(false)}
            className="flex-1 py-3 rounded-xl bg-white/10 font-semibold text-sm hover:bg-white/20"
          >
            ← Modifier l'inventaire
          </button>
          <button
            onClick={exportToJSON}
            className="px-4 py-3 rounded-xl bg-white/10 font-semibold text-sm hover:bg-white/20"
          >
            📥 Exporter
          </button>
          <button
            onClick={onComplete}
            className="flex-1 py-3 rounded-xl font-bold text-black text-sm"
            style={{ backgroundColor: moduleColor }}
          >
            Continuer →
          </button>
        </div>

        {/* Next Step Info */}
        <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-xl p-4 border border-purple-500/20">
          <p className="text-sm">
            <span className="font-bold">💡 Prochaine étape :</span> Ces systèmes seront automatiquement importés dans votre <strong>Registre IA officiel</strong> (exercice suivant) où vous ajouterez les informations de conformité requises par l'AI Act.
          </p>
        </div>
      </div>
    );
  }

  // Main View - Department Selection & Systems
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <span>🗺️</span> Inventaire des Systèmes IA
          </h2>
          <p className="text-white/60 text-sm mt-1">
            Identifiez tous les systèmes IA utilisés dans votre entreprise
          </p>
        </div>
        {systems.length > 0 && (
          <button
            onClick={() => setShowSummary(true)}
            className="px-4 py-2 rounded-lg text-sm font-medium"
            style={{ backgroundColor: `${moduleColor}20`, color: moduleColor }}
          >
            Voir le récapitulatif ({systems.length})
          </button>
        )}
      </div>

      {/* Progress */}
      <div className="bg-white/5 rounded-xl p-4 border border-white/10">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-white/60">Progression</span>
          <span className="text-sm font-medium">{systems.length} système(s) ajouté(s)</span>
        </div>
        <div className="grid grid-cols-5 gap-1">
          {DEPARTMENTS.slice(0, 10).map(dept => {
            const count = getSystemsByDepartment(dept.id).length;
            return (
              <div
                key={dept.id}
                className={`h-2 rounded-full ${count > 0 ? '' : 'bg-white/10'}`}
                style={count > 0 ? { backgroundColor: moduleColor } : {}}
                title={`${dept.name}: ${count} système(s)`}
              />
            );
          })}
        </div>
      </div>

      {/* Departments Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {DEPARTMENTS.map(dept => {
          const count = getSystemsByDepartment(dept.id).length;
          const isSelected = selectedDepartment === dept.id;
          
          return (
            <button
              key={dept.id}
              onClick={() => {
                setSelectedDepartment(isSelected ? null : dept.id);
                setIsAddingSystem(false);
              }}
              className={`p-4 rounded-xl text-center transition-all border-2 ${
                isSelected
                  ? 'bg-white/10'
                  : 'bg-white/5 border-transparent hover:bg-white/10'
              }`}
              style={isSelected ? { borderColor: moduleColor } : {}}
            >
              <div className="text-2xl mb-1">{dept.icon}</div>
              <p className="text-xs font-medium truncate">{dept.name}</p>
              {count > 0 && (
                <span 
                  className="inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold"
                  style={{ backgroundColor: moduleColor, color: 'black' }}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
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
            {(() => {
              const dept = DEPARTMENTS.find(d => d.id === selectedDepartment);
              if (!dept) return null;
              const deptSystems = getSystemsByDepartment(selectedDepartment);

              return (
                <div className="bg-white/5 rounded-xl p-4 border border-white/10 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold flex items-center gap-2">
                      <span>{dept.icon}</span> {dept.name}
                    </h3>
                    <button
                      onClick={() => {
                        resetForm();
                        setEditingSystem(null);
                        setIsAddingSystem(true);
                      }}
                      className="px-3 py-1.5 rounded-lg text-sm font-medium text-black"
                      style={{ backgroundColor: moduleColor }}
                    >
                      + Ajouter un système
                    </button>
                  </div>

                  {/* Existing Systems */}
                  {deptSystems.length > 0 && !isAddingSystem && (
                    <div className="space-y-2">
                      {deptSystems.map(sys => (
                        <div 
                          key={sys.id} 
                          className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <div 
                              className="w-2 h-8 rounded-full"
                              style={{ backgroundColor: CRITICAL_LEVELS.find(l => l.value === sys.criticalLevel)?.color }}
                            />
                            <div>
                              <p className="font-medium text-sm">{sys.name}</p>
                              <p className="text-white/40 text-xs">{sys.vendor || 'Fournisseur non spécifié'}</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => startEdit(sys)}
                              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-xs"
                            >
                              ✏️
                            </button>
                            <button
                              onClick={() => handleDeleteSystem(sys.id)}
                              className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-xs text-red-400"
                            >
                              🗑️
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Suggestions */}
                  {!isAddingSystem && deptSystems.length === 0 && (
                    <div>
                      <p className="text-sm text-white/40 mb-2">Suggestions courantes :</p>
                      <div className="flex flex-wrap gap-2">
                        {dept.suggestions.map(suggestion => (
                          <button
                            key={suggestion}
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="px-3 py-1.5 rounded-lg text-xs bg-white/10 hover:bg-white/20 transition-colors"
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Add/Edit Form */}
                  {isAddingSystem && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="space-y-4 pt-4 border-t border-white/10"
                    >
                      <h4 className="font-medium text-sm">
                        {editingSystem ? '✏️ Modifier le système' : '➕ Nouveau système IA'}
                      </h4>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Name */}
                        <div>
                          <label className="block text-xs text-white/60 mb-1">Nom du système *</label>
                          <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                            placeholder="Ex: ChatGPT, Copilot..."
                            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:border-[#00F5FF] focus:outline-none"
                          />
                        </div>

                        {/* Vendor */}
                        <div>
                          <label className="block text-xs text-white/60 mb-1">Fournisseur</label>
                          <input
                            type="text"
                            value={formData.vendor}
                            onChange={(e) => setFormData(prev => ({ ...prev, vendor: e.target.value }))}
                            placeholder="Ex: OpenAI, Microsoft..."
                            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:border-[#00F5FF] focus:outline-none"
                          />
                        </div>
                      </div>

                      {/* Purpose */}
                      <div>
                        <label className="block text-xs text-white/60 mb-1">Usage / Finalité</label>
                        <textarea
                          value={formData.purpose}
                          onChange={(e) => setFormData(prev => ({ ...prev, purpose: e.target.value }))}
                          placeholder="Décrivez à quoi sert ce système..."
                          rows={2}
                          className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:border-[#00F5FF] focus:outline-none resize-none"
                        />
                      </div>

                      {/* Data Types */}
                      <div>
                        <label className="block text-xs text-white/60 mb-2">Types de données traitées</label>
                        <div className="flex flex-wrap gap-2">
                          {DATA_TYPES.map(type => {
                            const isSelected = formData.dataTypes.includes(type.id);
                            return (
                              <button
                                key={type.id}
                                onClick={() => toggleDataType(type.id)}
                                className={`px-3 py-1.5 rounded-lg text-xs flex items-center gap-1 transition-colors ${
                                  isSelected ? 'text-black' : 'bg-white/10 hover:bg-white/20'
                                }`}
                                style={isSelected ? { backgroundColor: moduleColor } : {}}
                              >
                                <span>{type.icon}</span>
                                <span>{type.label}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {/* Users */}
                        <div>
                          <label className="block text-xs text-white/60 mb-1">Utilisateurs</label>
                          <input
                            type="text"
                            value={formData.users}
                            onChange={(e) => setFormData(prev => ({ ...prev, users: e.target.value }))}
                            placeholder="Ex: 10-50 personnes"
                            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:border-[#00F5FF] focus:outline-none"
                          />
                        </div>

                        {/* Frequency */}
                        <div>
                          <label className="block text-xs text-white/60 mb-1">Fréquence d'usage</label>
                          <select
                            value={formData.frequency}
                            onChange={(e) => setFormData(prev => ({ ...prev, frequency: e.target.value }))}
                            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:border-[#00F5FF] focus:outline-none"
                          >
                            {FREQUENCY_OPTIONS.map(opt => (
                              <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                          </select>
                        </div>

                        {/* Criticality */}
                        <div>
                          <label className="block text-xs text-white/60 mb-1">Criticité</label>
                          <select
                            value={formData.criticalLevel}
                            onChange={(e) => setFormData(prev => ({ ...prev, criticalLevel: e.target.value as AISystem['criticalLevel'] }))}
                            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:border-[#00F5FF] focus:outline-none"
                          >
                            {CRITICAL_LEVELS.map(opt => (
                              <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Notes */}
                      <div>
                        <label className="block text-xs text-white/60 mb-1">Notes additionnelles</label>
                        <textarea
                          value={formData.notes}
                          onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                          placeholder="Informations complémentaires..."
                          rows={2}
                          className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:border-[#00F5FF] focus:outline-none resize-none"
                        />
                      </div>

                      {/* Form Actions */}
                      <div className="flex gap-3">
                        <button
                          onClick={() => {
                            setIsAddingSystem(false);
                            setEditingSystem(null);
                            resetForm();
                          }}
                          className="flex-1 py-2 rounded-lg bg-white/10 font-medium text-sm hover:bg-white/20"
                        >
                          Annuler
                        </button>
                        <button
                          onClick={editingSystem ? handleUpdateSystem : handleAddSystem}
                          disabled={!formData.name}
                          className={`flex-1 py-2 rounded-lg font-bold text-sm ${
                            formData.name ? 'text-black' : 'bg-white/10 text-white/30 cursor-not-allowed'
                          }`}
                          style={formData.name ? { backgroundColor: moduleColor } : {}}
                        >
                          {editingSystem ? 'Mettre à jour' : 'Ajouter le système'}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </div>
              );
            })()}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Actions */}
      {systems.length > 0 && (
        <div className="flex gap-3 pt-4 border-t border-white/10">
          <a
            href="/resources/02-matrice-brainstorming-ia.xlsx"
            download
            className="px-4 py-3 rounded-xl bg-white/10 font-medium text-sm hover:bg-white/20 flex items-center gap-2"
          >
            📥 Télécharger le template Excel
          </a>
          <button
            onClick={() => setShowSummary(true)}
            className="flex-1 py-3 rounded-xl font-bold text-black text-sm"
            style={{ backgroundColor: moduleColor }}
          >
            Voir le récapitulatif ({systems.length} systèmes) →
          </button>
        </div>
      )}

      {/* Empty State CTA */}
      {systems.length === 0 && !selectedDepartment && (
        <div className="text-center py-8 bg-white/5 rounded-xl border border-dashed border-white/20">
          <div className="text-4xl mb-3">👆</div>
          <p className="text-white/60 text-sm">
            Cliquez sur un département pour commencer à ajouter vos systèmes IA
          </p>
        </div>
      )}
    </div>
  );
}
