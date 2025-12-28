'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ============================================
// TYPES
// ============================================
interface InventorySystem {
  id: string;
  name: string;
  vendor: string;
  department: string;
  purpose: string;
  dataTypes: string[];
  users: string;
  frequency: string;
  criticalLevel: 'low' | 'medium' | 'high' | 'critical';
}

interface RegistryEntry extends InventorySystem {
  // AI Act required fields
  riskCategory: 'prohibited' | 'high' | 'limited' | 'minimal' | 'gpai' | 'unclassified';
  aiActRole: 'provider' | 'deployer' | 'importer' | 'distributor';
  legalBasis: string;
  humanOversight: string;
  technicalDoc: 'available' | 'requested' | 'missing' | 'na';
  conformityAssessment: 'done' | 'inProgress' | 'notStarted' | 'na';
  incidentProcedure: boolean;
  lastReview: string;
  nextReview: string;
  responsiblePerson: string;
  complianceNotes: string;
  // Metadata
  registryId: string;
  addedToRegistry: string;
  lastUpdated: string;
}

// ============================================
// DATA
// ============================================
const RISK_CATEGORIES = [
  { 
    value: 'prohibited', 
    label: 'Interdit', 
    color: '#EF4444', 
    icon: '🚫',
    description: 'Pratiques interdites par l\'AI Act',
    examples: 'Score social, manipulation subliminale, exploitation de vulnérabilités'
  },
  { 
    value: 'high', 
    label: 'Haut risque', 
    color: '#F97316', 
    icon: '⚠️',
    description: 'Annexe III - Exigences strictes',
    examples: 'RH/recrutement, crédit, biométrie, infrastructures critiques'
  },
  { 
    value: 'limited', 
    label: 'Risque limité', 
    color: '#EAB308', 
    icon: '📋',
    description: 'Obligations de transparence',
    examples: 'Chatbots, génération de contenu, détection d\'émotions'
  },
  { 
    value: 'minimal', 
    label: 'Risque minimal', 
    color: '#22C55E', 
    icon: '✅',
    description: 'Libre utilisation',
    examples: 'Filtres spam, jeux vidéo, optimisation industrielle'
  },
  { 
    value: 'gpai', 
    label: 'IA à usage général', 
    color: '#8B5CF6', 
    icon: '🤖',
    description: 'GPAI - Règles spécifiques',
    examples: 'ChatGPT, Claude, Gemini, modèles de fondation'
  },
  { 
    value: 'unclassified', 
    label: 'Non classifié', 
    color: '#6B7280', 
    icon: '❓',
    description: 'À déterminer',
    examples: ''
  },
];

const AI_ACT_ROLES = [
  { value: 'provider', label: 'Fournisseur', description: 'Vous développez/vendez le système' },
  { value: 'deployer', label: 'Déployeur', description: 'Vous utilisez le système' },
  { value: 'importer', label: 'Importateur', description: 'Vous importez de hors UE' },
  { value: 'distributor', label: 'Distributeur', description: 'Vous distribuez le système' },
];

const LEGAL_BASIS_OPTIONS = [
  'Consentement',
  'Exécution d\'un contrat',
  'Obligation légale',
  'Intérêts vitaux',
  'Mission d\'intérêt public',
  'Intérêts légitimes',
  'Non applicable (pas de données personnelles)',
];

const DEPARTMENT_NAMES: Record<string, string> = {
  hr: 'Ressources Humaines',
  marketing: 'Marketing & Communication',
  sales: 'Commercial & Ventes',
  finance: 'Finance & Comptabilité',
  it: 'IT & Systèmes',
  customer_service: 'Service Client',
  operations: 'Opérations & Logistique',
  legal: 'Juridique & Conformité',
  rd: 'R&D / Innovation',
  other: 'Autre / Transverse',
};

// ============================================
// COMPONENT
// ============================================
interface RegistryBuilderProps {
  moduleColor: string;
  onComplete: () => void;
}

export default function RegistryBuilder({ moduleColor, onComplete }: RegistryBuilderProps) {
  const [inventorySystems, setInventorySystems] = useState<InventorySystem[]>([]);
  const [registryEntries, setRegistryEntries] = useState<RegistryEntry[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<string | null>(null);
  const [showImport, setShowImport] = useState(true);
  const [viewMode, setViewMode] = useState<'list' | 'detail' | 'export'>('list');

  // Load inventory systems and existing registry
  useEffect(() => {
    // Load from inventory (M2.2)
    const savedInventory = localStorage.getItem('workshop_ai_inventory');
    if (savedInventory) {
      try {
        setInventorySystems(JSON.parse(savedInventory));
      } catch (e) {
        console.error('Error loading inventory:', e);
      }
    }

    // Load existing registry
    const savedRegistry = localStorage.getItem('workshop_ai_registry');
    if (savedRegistry) {
      try {
        setRegistryEntries(JSON.parse(savedRegistry));
        setShowImport(false);
      } catch (e) {
        console.error('Error loading registry:', e);
      }
    }
  }, []);

  // Save registry
  useEffect(() => {
    if (registryEntries.length > 0) {
      localStorage.setItem('workshop_ai_registry', JSON.stringify(registryEntries));
    }
  }, [registryEntries]);

  const importFromInventory = () => {
    const newEntries: RegistryEntry[] = inventorySystems
      .filter(sys => !registryEntries.some(e => e.id === sys.id))
      .map(sys => ({
        ...sys,
        riskCategory: 'unclassified',
        aiActRole: 'deployer',
        legalBasis: '',
        humanOversight: '',
        technicalDoc: 'missing',
        conformityAssessment: 'notStarted',
        incidentProcedure: false,
        lastReview: '',
        nextReview: '',
        responsiblePerson: '',
        complianceNotes: '',
        registryId: `REG-${Date.now()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`,
        addedToRegistry: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
      }));

    setRegistryEntries([...registryEntries, ...newEntries]);
    setShowImport(false);
  };

  const addManualEntry = () => {
    const newEntry: RegistryEntry = {
      id: `manual_${Date.now()}`,
      name: 'Nouveau système',
      vendor: '',
      department: 'other',
      purpose: '',
      dataTypes: [],
      users: '',
      frequency: 'daily',
      criticalLevel: 'medium',
      riskCategory: 'unclassified',
      aiActRole: 'deployer',
      legalBasis: '',
      humanOversight: '',
      technicalDoc: 'missing',
      conformityAssessment: 'notStarted',
      incidentProcedure: false,
      lastReview: '',
      nextReview: '',
      responsiblePerson: '',
      complianceNotes: '',
      registryId: `REG-${Date.now()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`,
      addedToRegistry: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
    };
    setRegistryEntries([...registryEntries, newEntry]);
    setSelectedEntry(newEntry.id);
    setViewMode('detail');
  };

  const updateEntry = (id: string, updates: Partial<RegistryEntry>) => {
    setRegistryEntries(entries => 
      entries.map(e => e.id === id ? { ...e, ...updates, lastUpdated: new Date().toISOString() } : e)
    );
  };

  const deleteEntry = (id: string) => {
    if (confirm('Supprimer cette entrée du registre ?')) {
      setRegistryEntries(entries => entries.filter(e => e.id !== id));
      if (selectedEntry === id) {
        setSelectedEntry(null);
        setViewMode('list');
      }
    }
  };

  const getComplianceScore = (entry: RegistryEntry) => {
    let score = 0;
    let total = 0;

    // Risk category defined
    total += 1;
    if (entry.riskCategory !== 'unclassified') score += 1;

    // Legal basis
    total += 1;
    if (entry.legalBasis) score += 1;

    // Human oversight
    total += 1;
    if (entry.humanOversight) score += 1;

    // Technical documentation
    total += 1;
    if (entry.technicalDoc === 'available') score += 1;

    // Conformity assessment (for high risk)
    if (entry.riskCategory === 'high') {
      total += 1;
      if (entry.conformityAssessment === 'done') score += 1;
    }

    // Responsible person
    total += 1;
    if (entry.responsiblePerson) score += 1;

    return Math.round((score / total) * 100);
  };

  const getTotalComplianceScore = () => {
    if (registryEntries.length === 0) return 0;
    const total = registryEntries.reduce((sum, entry) => sum + getComplianceScore(entry), 0);
    return Math.round(total / registryEntries.length);
  };

  const exportRegistry = () => {
    const headers = [
      'ID Registre', 'Nom', 'Fournisseur', 'Département', 'Finalité',
      'Catégorie de risque', 'Rôle AI Act', 'Base légale', 'Supervision humaine',
      'Doc technique', 'Évaluation conformité', 'Procédure incidents', 'Responsable',
      'Dernière revue', 'Prochaine revue', 'Notes'
    ];

    const rows = registryEntries.map(e => [
      e.registryId, e.name, e.vendor, DEPARTMENT_NAMES[e.department] || e.department, e.purpose,
      RISK_CATEGORIES.find(r => r.value === e.riskCategory)?.label || e.riskCategory,
      AI_ACT_ROLES.find(r => r.value === e.aiActRole)?.label || e.aiActRole,
      e.legalBasis, e.humanOversight,
      e.technicalDoc, e.conformityAssessment, e.incidentProcedure ? 'Oui' : 'Non',
      e.responsiblePerson, e.lastReview, e.nextReview, e.complianceNotes
    ]);

    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${(cell || '').toString().replace(/"/g, '""')}"`).join(','))
      .join('\n');

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `registre-ia-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const selectedEntryData = registryEntries.find(e => e.id === selectedEntry);

  // Import View
  if (showImport && inventorySystems.length > 0 && registryEntries.length === 0) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="text-5xl mb-4">📥</div>
          <h2 className="text-2xl font-bold mb-2">Importer depuis l'inventaire</h2>
          <p className="text-white/60">
            {inventorySystems.length} système(s) identifié(s) dans l'exercice précédent
          </p>
        </div>

        <div className="bg-white/5 rounded-xl p-4 border border-white/10 max-h-64 overflow-y-auto">
          {inventorySystems.map(sys => (
            <div key={sys.id} className="flex items-center gap-3 p-2 hover:bg-white/5 rounded-lg">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: moduleColor }} />
              <div className="flex-1">
                <p className="font-medium text-sm">{sys.name}</p>
                <p className="text-white/40 text-xs">{DEPARTMENT_NAMES[sys.department]} • {sys.vendor || 'Fournisseur non spécifié'}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setShowImport(false)}
            className="flex-1 py-3 rounded-xl bg-white/10 font-semibold text-sm hover:bg-white/20"
          >
            Créer un registre vide
          </button>
          <button
            onClick={importFromInventory}
            className="flex-1 py-3 rounded-xl font-bold text-black text-sm"
            style={{ backgroundColor: moduleColor }}
          >
            Importer {inventorySystems.length} système(s) →
          </button>
        </div>
      </div>
    );
  }

  // Detail View
  if (viewMode === 'detail' && selectedEntryData) {
    const entry = selectedEntryData;
    const complianceScore = getComplianceScore(entry);

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => { setViewMode('list'); setSelectedEntry(null); }}
            className="flex items-center gap-2 text-sm text-white/60 hover:text-white"
          >
            ← Retour au registre
          </button>
          <span className="text-xs text-white/40 font-mono">{entry.registryId}</span>
        </div>

        {/* System Header */}
        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
          <div className="flex items-start justify-between mb-4">
            <div>
              <input
                type="text"
                value={entry.name}
                onChange={(e) => updateEntry(entry.id, { name: e.target.value })}
                className="text-xl font-bold bg-transparent border-b border-transparent hover:border-white/20 focus:border-[#00F5FF] focus:outline-none"
              />
              <p className="text-white/40 text-sm mt-1">
                {DEPARTMENT_NAMES[entry.department]} • {entry.vendor || 'Fournisseur non spécifié'}
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold" style={{ color: complianceScore >= 80 ? '#22C55E' : complianceScore >= 50 ? '#EAB308' : '#EF4444' }}>
                {complianceScore}%
              </div>
              <p className="text-xs text-white/40">Conformité</p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="flex gap-2">
            <span 
              className="px-2 py-1 rounded-full text-xs font-medium"
              style={{ 
                backgroundColor: `${RISK_CATEGORIES.find(r => r.value === entry.riskCategory)?.color}20`,
                color: RISK_CATEGORIES.find(r => r.value === entry.riskCategory)?.color
              }}
            >
              {RISK_CATEGORIES.find(r => r.value === entry.riskCategory)?.icon} {RISK_CATEGORIES.find(r => r.value === entry.riskCategory)?.label}
            </span>
            <span className="px-2 py-1 rounded-full text-xs bg-white/10">
              {AI_ACT_ROLES.find(r => r.value === entry.aiActRole)?.label}
            </span>
          </div>
        </div>

        {/* Risk Category Selection */}
        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <span>⚖️</span> Classification du risque
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {RISK_CATEGORIES.map(cat => (
              <button
                key={cat.value}
                onClick={() => updateEntry(entry.id, { riskCategory: cat.value as RegistryEntry['riskCategory'] })}
                className={`p-3 rounded-xl text-left transition-all border-2 ${
                  entry.riskCategory === cat.value ? '' : 'border-transparent bg-white/5 hover:bg-white/10'
                }`}
                style={entry.riskCategory === cat.value ? { borderColor: cat.color, backgroundColor: `${cat.color}10` } : {}}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span>{cat.icon}</span>
                  <span className="font-medium text-sm" style={{ color: cat.color }}>{cat.label}</span>
                </div>
                <p className="text-[10px] text-white/40">{cat.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Compliance Fields */}
        <div className="bg-white/5 rounded-xl p-4 border border-white/10 space-y-4">
          <h3 className="font-semibold flex items-center gap-2">
            <span>📋</span> Informations de conformité
          </h3>

          {/* Role */}
          <div>
            <label className="block text-xs text-white/60 mb-2">Votre rôle AI Act</label>
            <div className="flex flex-wrap gap-2">
              {AI_ACT_ROLES.map(role => (
                <button
                  key={role.value}
                  onClick={() => updateEntry(entry.id, { aiActRole: role.value as RegistryEntry['aiActRole'] })}
                  className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                    entry.aiActRole === role.value ? 'text-black' : 'bg-white/10 hover:bg-white/20'
                  }`}
                  style={entry.aiActRole === role.value ? { backgroundColor: moduleColor } : {}}
                >
                  {role.label}
                </button>
              ))}
            </div>
          </div>

          {/* Legal Basis */}
          <div>
            <label className="block text-xs text-white/60 mb-2">Base légale (RGPD)</label>
            <select
              value={entry.legalBasis}
              onChange={(e) => updateEntry(entry.id, { legalBasis: e.target.value })}
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:border-[#00F5FF] focus:outline-none"
            >
              <option value="">Sélectionner...</option>
              {LEGAL_BASIS_OPTIONS.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>

          {/* Human Oversight */}
          <div>
            <label className="block text-xs text-white/60 mb-2">Supervision humaine</label>
            <textarea
              value={entry.humanOversight}
              onChange={(e) => updateEntry(entry.id, { humanOversight: e.target.value })}
              placeholder="Décrivez comment les humains supervisent ce système..."
              rows={2}
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:border-[#00F5FF] focus:outline-none resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Technical Documentation */}
            <div>
              <label className="block text-xs text-white/60 mb-2">Documentation technique</label>
              <select
                value={entry.technicalDoc}
                onChange={(e) => updateEntry(entry.id, { technicalDoc: e.target.value as RegistryEntry['technicalDoc'] })}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:border-[#00F5FF] focus:outline-none"
              >
                <option value="available">✅ Disponible</option>
                <option value="requested">📨 Demandée</option>
                <option value="missing">❌ Manquante</option>
                <option value="na">N/A</option>
              </select>
            </div>

            {/* Conformity Assessment */}
            <div>
              <label className="block text-xs text-white/60 mb-2">Évaluation de conformité</label>
              <select
                value={entry.conformityAssessment}
                onChange={(e) => updateEntry(entry.id, { conformityAssessment: e.target.value as RegistryEntry['conformityAssessment'] })}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:border-[#00F5FF] focus:outline-none"
              >
                <option value="done">✅ Effectuée</option>
                <option value="inProgress">🔄 En cours</option>
                <option value="notStarted">⏳ Non commencée</option>
                <option value="na">N/A</option>
              </select>
            </div>
          </div>

          {/* Responsible Person */}
          <div>
            <label className="block text-xs text-white/60 mb-2">Personne responsable</label>
            <input
              type="text"
              value={entry.responsiblePerson}
              onChange={(e) => updateEntry(entry.id, { responsiblePerson: e.target.value })}
              placeholder="Nom du responsable..."
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:border-[#00F5FF] focus:outline-none"
            />
          </div>

          {/* Incident Procedure */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => updateEntry(entry.id, { incidentProcedure: !entry.incidentProcedure })}
              className={`w-12 h-6 rounded-full transition-colors ${entry.incidentProcedure ? '' : 'bg-white/20'}`}
              style={entry.incidentProcedure ? { backgroundColor: moduleColor } : {}}
            >
              <div className={`w-5 h-5 rounded-full bg-white transition-transform ${entry.incidentProcedure ? 'translate-x-6' : 'translate-x-0.5'}`} />
            </button>
            <span className="text-sm">Procédure de gestion des incidents en place</span>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs text-white/60 mb-2">Notes de conformité</label>
            <textarea
              value={entry.complianceNotes}
              onChange={(e) => updateEntry(entry.id, { complianceNotes: e.target.value })}
              placeholder="Notes additionnelles sur la conformité..."
              rows={3}
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:border-[#00F5FF] focus:outline-none resize-none"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={() => deleteEntry(entry.id)}
            className="px-4 py-3 rounded-xl bg-red-500/10 text-red-400 font-medium text-sm hover:bg-red-500/20"
          >
            🗑️ Supprimer
          </button>
          <button
            onClick={() => { setViewMode('list'); setSelectedEntry(null); }}
            className="flex-1 py-3 rounded-xl font-bold text-black text-sm"
            style={{ backgroundColor: moduleColor }}
          >
            ✓ Enregistrer et retour
          </button>
        </div>
      </div>
    );
  }

  // Export View
  if (viewMode === 'export') {
    const totalScore = getTotalComplianceScore();
    const highRiskCount = registryEntries.filter(e => e.riskCategory === 'high').length;
    const unclassifiedCount = registryEntries.filter(e => e.riskCategory === 'unclassified').length;

    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="text-5xl mb-4">📊</div>
          <h2 className="text-2xl font-bold mb-2">Export du Registre IA</h2>
          <p className="text-white/60">{registryEntries.length} système(s) documenté(s)</p>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-white/5 rounded-xl p-4 text-center border border-white/10">
            <div className="text-3xl font-bold" style={{ color: totalScore >= 80 ? '#22C55E' : totalScore >= 50 ? '#EAB308' : '#EF4444' }}>
              {totalScore}%
            </div>
            <p className="text-white/40 text-xs mt-1">Conformité moyenne</p>
          </div>
          <div className="bg-white/5 rounded-xl p-4 text-center border border-white/10">
            <div className="text-3xl font-bold text-orange-400">{highRiskCount}</div>
            <p className="text-white/40 text-xs mt-1">Haut risque</p>
          </div>
          <div className="bg-white/5 rounded-xl p-4 text-center border border-white/10">
            <div className="text-3xl font-bold text-gray-400">{unclassifiedCount}</div>
            <p className="text-white/40 text-xs mt-1">Non classifié</p>
          </div>
          <div className="bg-white/5 rounded-xl p-4 text-center border border-white/10">
            <div className="text-3xl font-bold" style={{ color: moduleColor }}>{registryEntries.length}</div>
            <p className="text-white/40 text-xs mt-1">Total systèmes</p>
          </div>
        </div>

        {/* Preview */}
        <div className="bg-white/5 rounded-xl p-4 border border-white/10 max-h-64 overflow-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-white/40 text-left">
                <th className="pb-2">Système</th>
                <th className="pb-2">Risque</th>
                <th className="pb-2">Conformité</th>
              </tr>
            </thead>
            <tbody>
              {registryEntries.map(entry => (
                <tr key={entry.id} className="border-t border-white/5">
                  <td className="py-2">{entry.name}</td>
                  <td className="py-2">
                    <span style={{ color: RISK_CATEGORIES.find(r => r.value === entry.riskCategory)?.color }}>
                      {RISK_CATEGORIES.find(r => r.value === entry.riskCategory)?.icon}
                    </span>
                  </td>
                  <td className="py-2">{getComplianceScore(entry)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Export Options */}
        <div className="flex flex-col gap-3">
          <button
            onClick={exportRegistry}
            className="w-full py-3 rounded-xl font-bold text-black text-sm flex items-center justify-center gap-2"
            style={{ backgroundColor: moduleColor }}
          >
            📥 Télécharger en CSV
          </button>
          <a
            href="/resources/03-registre-ia-complet.xlsx"
            download
            className="w-full py-3 rounded-xl bg-white/10 font-medium text-sm hover:bg-white/20 flex items-center justify-center gap-2"
          >
            📄 Télécharger le template Excel vierge
          </a>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={() => setViewMode('list')}
            className="flex-1 py-3 rounded-xl bg-white/10 font-semibold text-sm hover:bg-white/20"
          >
            ← Retour au registre
          </button>
          <button
            onClick={onComplete}
            className="flex-1 py-3 rounded-xl font-bold text-black text-sm"
            style={{ backgroundColor: moduleColor }}
          >
            Continuer la formation →
          </button>
        </div>
      </div>
    );
  }

  // List View (default)
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <span>📋</span> Registre IA
          </h2>
          <p className="text-white/60 text-sm mt-1">
            Documentation officielle de vos systèmes IA
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={addManualEntry}
            className="px-3 py-2 rounded-lg text-sm bg-white/10 hover:bg-white/20"
          >
            + Ajouter
          </button>
          {registryEntries.length > 0 && (
            <button
              onClick={() => setViewMode('export')}
              className="px-3 py-2 rounded-lg text-sm font-medium"
              style={{ backgroundColor: `${moduleColor}20`, color: moduleColor }}
            >
              📥 Export
            </button>
          )}
        </div>
      </div>

      {/* Global Stats */}
      {registryEntries.length > 0 && (
        <div className="bg-gradient-to-r from-white/5 to-white/10 rounded-xl p-4 border border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/40 text-xs">Score de conformité global</p>
              <p className="text-2xl font-bold" style={{ color: getTotalComplianceScore() >= 80 ? '#22C55E' : getTotalComplianceScore() >= 50 ? '#EAB308' : '#EF4444' }}>
                {getTotalComplianceScore()}%
              </p>
            </div>
            <div className="text-right">
              <p className="text-white/40 text-xs">Systèmes documentés</p>
              <p className="text-2xl font-bold">{registryEntries.length}</p>
            </div>
          </div>
        </div>
      )}

      {/* Entries List */}
      {registryEntries.length > 0 ? (
        <div className="space-y-2">
          {registryEntries.map(entry => {
            const riskCat = RISK_CATEGORIES.find(r => r.value === entry.riskCategory);
            const complianceScore = getComplianceScore(entry);

            return (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => { setSelectedEntry(entry.id); setViewMode('detail'); }}
                className="bg-white/5 rounded-xl p-4 border border-white/10 cursor-pointer hover:bg-white/10 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-xl"
                      style={{ backgroundColor: `${riskCat?.color}20` }}
                    >
                      {riskCat?.icon}
                    </div>
                    <div>
                      <p className="font-medium">{entry.name}</p>
                      <p className="text-white/40 text-xs">{DEPARTMENT_NAMES[entry.department]} • {entry.vendor || 'Fournisseur non spécifié'}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div 
                      className="text-lg font-bold"
                      style={{ color: complianceScore >= 80 ? '#22C55E' : complianceScore >= 50 ? '#EAB308' : '#EF4444' }}
                    >
                      {complianceScore}%
                    </div>
                    <p className="text-[10px] text-white/40">Conformité</p>
                  </div>
                </div>

                {/* Quick indicators */}
                <div className="flex gap-2 mt-3">
                  <span 
                    className="px-2 py-0.5 rounded text-[10px]"
                    style={{ backgroundColor: `${riskCat?.color}20`, color: riskCat?.color }}
                  >
                    {riskCat?.label}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] ${
                    entry.technicalDoc === 'available' ? 'bg-green-500/20 text-green-400' :
                    entry.technicalDoc === 'requested' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    Doc: {entry.technicalDoc === 'available' ? '✓' : entry.technicalDoc === 'requested' ? '📨' : '✗'}
                  </span>
                  {entry.riskCategory === 'high' && (
                    <span className={`px-2 py-0.5 rounded text-[10px] ${
                      entry.conformityAssessment === 'done' ? 'bg-green-500/20 text-green-400' :
                      entry.conformityAssessment === 'inProgress' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      Éval: {entry.conformityAssessment === 'done' ? '✓' : entry.conformityAssessment === 'inProgress' ? '🔄' : '✗'}
                    </span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 bg-white/5 rounded-xl border border-dashed border-white/20">
          <div className="text-4xl mb-3">📋</div>
          <p className="text-white/60 text-sm mb-4">Aucun système dans le registre</p>
          {inventorySystems.length > 0 ? (
            <button
              onClick={() => setShowImport(true)}
              className="px-4 py-2 rounded-lg text-sm font-medium"
              style={{ backgroundColor: moduleColor, color: 'black' }}
            >
              Importer depuis l'inventaire ({inventorySystems.length})
            </button>
          ) : (
            <button
              onClick={addManualEntry}
              className="px-4 py-2 rounded-lg text-sm font-medium"
              style={{ backgroundColor: moduleColor, color: 'black' }}
            >
              Ajouter un système
            </button>
          )}
        </div>
      )}

      {/* Bottom Actions */}
      {registryEntries.length > 0 && (
        <div className="flex gap-3 pt-4 border-t border-white/10">
          <a
            href="/resources/03-registre-ia-complet.xlsx"
            download
            className="px-4 py-3 rounded-xl bg-white/10 font-medium text-sm hover:bg-white/20 flex items-center gap-2"
          >
            📥 Template Excel
          </a>
          <button
            onClick={() => setViewMode('export')}
            className="flex-1 py-3 rounded-xl font-bold text-black text-sm"
            style={{ backgroundColor: moduleColor }}
          >
            Exporter le registre →
          </button>
        </div>
      )}
    </div>
  );
}
