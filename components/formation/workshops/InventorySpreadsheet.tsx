'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// ============================================
// TYPES
// ============================================
interface InventoryRow {
  id: string;
  systemName: string;
  vendor: string;
  department: string;
  purpose: string;
  users: string;
  frequency: string;
  dataTypes: string;
  criticality: string;
  source: string;
  notes: string;
}

interface ColumnDef {
  key: keyof InventoryRow;
  label: string;
  width: number;
  type: 'text' | 'select' | 'textarea';
  options?: { value: string; label: string }[];
  required?: boolean;
  placeholder?: string;
}

// ============================================
// COLUMNS
// ============================================
const COLUMNS: ColumnDef[] = [
  { key: 'id', label: 'ID', width: 70, type: 'text', required: true },
  { key: 'systemName', label: 'Nom du système IA', width: 200, type: 'text', required: true, placeholder: 'Ex: ChatGPT, Copilot...' },
  { key: 'vendor', label: 'Fournisseur', width: 150, type: 'text', required: true, placeholder: 'Ex: OpenAI, Microsoft...' },
  { key: 'department', label: 'Département', width: 130, type: 'select', required: true, options: [
    { value: 'hr', label: '👥 RH' },
    { value: 'marketing', label: '📢 Marketing' },
    { value: 'sales', label: '💼 Commercial' },
    { value: 'finance', label: '💰 Finance' },
    { value: 'it', label: '💻 IT' },
    { value: 'customer_service', label: '🎧 Service Client' },
    { value: 'operations', label: '⚙️ Opérations' },
    { value: 'legal', label: '⚖️ Juridique' },
    { value: 'rd', label: '🔬 R&D' },
    { value: 'management', label: '👔 Direction' },
    { value: 'other', label: '📁 Autre' },
  ]},
  { key: 'purpose', label: 'Finalité / Usage', width: 250, type: 'textarea', required: true, placeholder: 'À quoi sert ce système ?' },
  { key: 'users', label: 'Utilisateurs', width: 120, type: 'text', placeholder: 'Ex: 15 personnes' },
  { key: 'frequency', label: 'Fréquence', width: 120, type: 'select', options: [
    { value: 'realtime', label: '⚡ Temps réel' },
    { value: 'daily', label: '📅 Quotidien' },
    { value: 'weekly', label: '📆 Hebdo' },
    { value: 'monthly', label: '🗓️ Mensuel' },
    { value: 'occasional', label: '🔄 Occasionnel' },
  ]},
  { key: 'dataTypes', label: 'Types de données', width: 160, type: 'select', options: [
    { value: 'none', label: '✅ Aucune perso' },
    { value: 'personal', label: '👤 Personnelles' },
    { value: 'sensitive', label: '🔴 Sensibles' },
    { value: 'biometric', label: '🔐 Biométriques' },
    { value: 'financial', label: '💳 Financières' },
    { value: 'professional', label: '💼 Professionnelles' },
  ]},
  { key: 'criticality', label: 'Criticité', width: 120, type: 'select', options: [
    { value: 'low', label: '🟢 Faible' },
    { value: 'medium', label: '🟡 Moyenne' },
    { value: 'high', label: '🟠 Haute' },
    { value: 'critical', label: '🔴 Critique' },
  ]},
  { key: 'source', label: 'Source', width: 130, type: 'select', options: [
    { value: 'saas', label: '☁️ SaaS' },
    { value: 'onpremise', label: '🏢 On-premise' },
    { value: 'api', label: '🔌 API' },
    { value: 'embedded', label: '📦 Intégré' },
    { value: 'custom', label: '🛠️ Sur mesure' },
  ]},
  { key: 'notes', label: 'Notes', width: 200, type: 'textarea', placeholder: 'Commentaires...' },
];

const EMPTY_ROW: InventoryRow = {
  id: '',
  systemName: '',
  vendor: '',
  department: '',
  purpose: '',
  users: '',
  frequency: '',
  dataTypes: 'none',
  criticality: 'low',
  source: '',
  notes: '',
};

// Common AI systems suggestions
const AI_SUGGESTIONS = [
  { name: 'ChatGPT / GPT-4', vendor: 'OpenAI', purpose: 'Assistant conversationnel, rédaction, analyse' },
  { name: 'Microsoft Copilot', vendor: 'Microsoft', purpose: 'Assistance bureautique (Word, Excel, Teams)' },
  { name: 'GitHub Copilot', vendor: 'Microsoft/GitHub', purpose: 'Assistance au développement logiciel' },
  { name: 'Claude', vendor: 'Anthropic', purpose: 'Assistant conversationnel, analyse de documents' },
  { name: 'Gemini', vendor: 'Google', purpose: 'Assistant IA, recherche, analyse' },
  { name: 'Midjourney', vendor: 'Midjourney', purpose: 'Génération d\'images' },
  { name: 'DALL-E', vendor: 'OpenAI', purpose: 'Génération d\'images' },
  { name: 'Grammarly', vendor: 'Grammarly', purpose: 'Correction et amélioration de texte' },
  { name: 'Notion AI', vendor: 'Notion', purpose: 'Assistance rédaction et organisation' },
  { name: 'Jasper', vendor: 'Jasper', purpose: 'Génération de contenu marketing' },
  { name: 'HubSpot AI', vendor: 'HubSpot', purpose: 'CRM et marketing automatisé' },
  { name: 'Salesforce Einstein', vendor: 'Salesforce', purpose: 'CRM intelligent, prédictions ventes' },
  { name: 'Intercom Fin', vendor: 'Intercom', purpose: 'Chatbot service client' },
  { name: 'Zendesk AI', vendor: 'Zendesk', purpose: 'Support client automatisé' },
];

// ============================================
// COMPONENT
// ============================================
interface InventorySpreadsheetProps {
  moduleColor: string;
  onComplete: () => void;
}

export default function InventorySpreadsheet({ moduleColor, onComplete }: InventorySpreadsheetProps) {
  const [rows, setRows] = useState<InventoryRow[]>([]);
  const [editingCell, setEditingCell] = useState<{ row: number; col: number } | null>(null);
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [companyName, setCompanyName] = useState('');
  const [isExporting, setIsExporting] = useState(false);

  // Load data
  useEffect(() => {
    const savedData = localStorage.getItem('workshop_inventory_spreadsheet');
    if (savedData) {
      try {
        const data = JSON.parse(savedData);
        setRows(data.rows || []);
        setCompanyName(data.companyName || '');
      } catch (e) {}
    } else {
      // Start with 3 empty rows
      setRows([
        { ...EMPTY_ROW, id: 'IA-001' },
        { ...EMPTY_ROW, id: 'IA-002' },
        { ...EMPTY_ROW, id: 'IA-003' },
      ]);
    }

    // Load company name from profile
    const savedProfile = localStorage.getItem('workshop_company_profile');
    if (savedProfile) {
      try {
        const profile = JSON.parse(savedProfile);
        setCompanyName(profile.name || '');
      } catch (e) {}
    }
  }, []);

  // Save data
  useEffect(() => {
    if (rows.length > 0) {
      localStorage.setItem('workshop_inventory_spreadsheet', JSON.stringify({
        rows,
        companyName,
        lastUpdated: new Date().toISOString(),
      }));

      // Also save in old format for compatibility with other workshops
      const inventoryFormat = rows.filter(r => r.systemName).map(r => ({
        name: r.systemName,
        vendor: r.vendor,
        department: r.department,
        purpose: r.purpose,
        dataTypes: [r.dataTypes],
        criticality: r.criticality,
      }));
      localStorage.setItem('workshop_ai_inventory', JSON.stringify(inventoryFormat));
    }
  }, [rows, companyName]);

  // Cell operations
  const handleCellChange = (rowIdx: number, key: keyof InventoryRow, value: string) => {
    setRows(prev => prev.map((row, idx) =>
      idx === rowIdx ? { ...row, [key]: value } : row
    ));
  };

  const handleKeyDown = (e: React.KeyboardEvent, rowIdx: number, colIdx: number) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      setEditingCell(null);
      if (rowIdx < rows.length - 1) {
        setSelectedCell({ row: rowIdx + 1, col: colIdx });
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      setEditingCell(null);
      if (colIdx < COLUMNS.length - 1) {
        setSelectedCell({ row: rowIdx, col: colIdx + 1 });
        setEditingCell({ row: rowIdx, col: colIdx + 1 });
      } else if (rowIdx < rows.length - 1) {
        setSelectedCell({ row: rowIdx + 1, col: 0 });
        setEditingCell({ row: rowIdx + 1, col: 0 });
      }
    } else if (e.key === 'Escape') {
      setEditingCell(null);
    }
  };

  // Row operations
  const addRow = () => {
    const newId = `IA-${String(rows.length + 1).padStart(3, '0')}`;
    setRows([...rows, { ...EMPTY_ROW, id: newId }]);
  };

  const deleteRow = (idx: number) => {
    if (rows.length <= 1) return;
    setRows(rows.filter((_, i) => i !== idx));
  };

  const addFromSuggestion = (suggestion: typeof AI_SUGGESTIONS[0]) => {
    const newId = `IA-${String(rows.length + 1).padStart(3, '0')}`;
    const newRow: InventoryRow = {
      ...EMPTY_ROW,
      id: newId,
      systemName: suggestion.name,
      vendor: suggestion.vendor,
      purpose: suggestion.purpose,
    };
    setRows([...rows, newRow]);
    setShowSuggestions(false);
  };

  // Export
  const exportToExcel = async () => {
    setIsExporting(true);
    try {
      const XLSX = await import('xlsx');

      const exportData = rows.filter(r => r.systemName).map(row => ({
        'ID': row.id,
        'Système IA': row.systemName,
        'Fournisseur': row.vendor,
        'Département': row.department,
        'Finalité': row.purpose,
        'Utilisateurs': row.users,
        'Fréquence': row.frequency,
        'Types de données': row.dataTypes,
        'Criticité': row.criticality,
        'Source': row.source,
        'Notes': row.notes,
      }));

      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(exportData);

      ws['!cols'] = [
        { wch: 10 }, { wch: 25 }, { wch: 20 }, { wch: 15 },
        { wch: 35 }, { wch: 15 }, { wch: 15 }, { wch: 18 },
        { wch: 12 }, { wch: 15 }, { wch: 30 },
      ];

      XLSX.utils.book_append_sheet(wb, ws, 'Inventaire IA');

      // Summary sheet
      const summaryData = [
        ['INVENTAIRE DES SYSTÈMES D\'INTELLIGENCE ARTIFICIELLE'],
        [''],
        ['Entreprise:', companyName || '[Nom de l\'entreprise]'],
        ['Date d\'export:', new Date().toLocaleDateString('fr-FR')],
        ['Nombre de systèmes:', rows.filter(r => r.systemName).length],
        [''],
        ['PAR CRITICITÉ'],
        ['Critique:', rows.filter(r => r.criticality === 'critical').length],
        ['Haute:', rows.filter(r => r.criticality === 'high').length],
        ['Moyenne:', rows.filter(r => r.criticality === 'medium').length],
        ['Faible:', rows.filter(r => r.criticality === 'low').length],
        [''],
        ['PAR TYPE DE DONNÉES'],
        ['Données sensibles:', rows.filter(r => r.dataTypes === 'sensitive' || r.dataTypes === 'biometric').length],
        ['Données personnelles:', rows.filter(r => r.dataTypes === 'personal').length],
        [''],
        ['Généré via formation-ia-act.fr'],
      ];

      const summaryWs = XLSX.utils.aoa_to_sheet(summaryData);
      summaryWs['!cols'] = [{ wch: 25 }, { wch: 30 }];
      XLSX.utils.book_append_sheet(wb, summaryWs, 'Résumé');

      const fileName = `inventaire-ia-${companyName ? companyName.toLowerCase().replace(/\s+/g, '-') : 'entreprise'}-${new Date().toISOString().split('T')[0]}.xlsx`;
      XLSX.writeFile(wb, fileName);
    } catch (error) {
      console.error('Export error:', error);
      alert('Erreur lors de l\'export');
    } finally {
      setIsExporting(false);
    }
  };

  // Stats
  const filledRows = rows.filter(r => r.systemName && r.vendor && r.department).length;
  const totalRows = rows.filter(r => r.systemName).length;
  const criticalCount = rows.filter(r => r.criticality === 'critical' || r.criticality === 'high').length;

  // Render cell
  const renderCell = (row: InventoryRow, col: ColumnDef, rowIdx: number, colIdx: number) => {
    const isEditing = editingCell?.row === rowIdx && editingCell?.col === colIdx;
    const isSelected = selectedCell?.row === rowIdx && selectedCell?.col === colIdx;
    const value = row[col.key];

    if (isEditing) {
      if (col.type === 'select') {
        return (
          <select
            autoFocus
            value={value}
            onChange={(e) => handleCellChange(rowIdx, col.key, e.target.value)}
            onBlur={() => setEditingCell(null)}
            onKeyDown={(e) => handleKeyDown(e, rowIdx, colIdx)}
            className="w-full h-full px-2 bg-[#1a1a2e] text-white border-2 outline-none text-xs"
            style={{ borderColor: moduleColor }}
          >
            <option value="">Sélectionner...</option>
            {col.options?.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        );
      }

      if (col.type === 'textarea') {
        return (
          <textarea
            autoFocus
            value={value}
            onChange={(e) => handleCellChange(rowIdx, col.key, e.target.value)}
            onBlur={() => setEditingCell(null)}
            onKeyDown={(e) => handleKeyDown(e, rowIdx, colIdx)}
            placeholder={col.placeholder}
            className="w-full h-full px-2 py-1 bg-[#1a1a2e] text-white border-2 outline-none resize-none text-xs"
            style={{ borderColor: moduleColor, minHeight: '60px' }}
          />
        );
      }

      return (
        <input
          autoFocus
          type="text"
          value={value}
          onChange={(e) => handleCellChange(rowIdx, col.key, e.target.value)}
          onBlur={() => setEditingCell(null)}
          onKeyDown={(e) => handleKeyDown(e, rowIdx, colIdx)}
          placeholder={col.placeholder}
          className="w-full h-full px-2 bg-[#1a1a2e] text-white border-2 outline-none text-xs"
          style={{ borderColor: moduleColor }}
        />
      );
    }

    let displayValue = value;
    if (col.type === 'select' && col.options) {
      displayValue = col.options.find(o => o.value === value)?.label || value;
    }

    return (
      <div
        className={`w-full h-full px-2 py-1 text-xs truncate cursor-cell ${
          isSelected ? 'ring-2 ring-inset' : ''
        } ${!value && col.required ? 'bg-red-500/10' : ''}`}
        style={isSelected ? { boxShadow: `inset 0 0 0 2px ${moduleColor}` } : {}}
        onClick={() => setSelectedCell({ row: rowIdx, col: colIdx })}
        onDoubleClick={() => setEditingCell({ row: rowIdx, col: colIdx })}
        title={typeof displayValue === 'string' ? displayValue : ''}
      >
        {displayValue || <span className="text-white/20">{col.placeholder || '—'}</span>}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex-shrink-0 mb-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2">
              <span>📋</span> Inventaire IA - Tableur Interactif
            </h2>
            <p className="text-white/60 text-sm mt-1">
              Listez tous les systèmes d'IA utilisés dans votre entreprise
            </p>
          </div>
          <button
            onClick={() => setShowSuggestions(true)}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-white/10 hover:bg-white/20 flex items-center gap-2"
          >
            💡 Suggestions IA
          </button>
        </div>

        {/* Stats */}
        <div className="flex gap-3 mb-3">
          <div className="flex-1 bg-white/5 rounded-lg p-3 border border-white/10">
            <div className="flex items-center justify-between">
              <span className="text-xs text-white/40">Systèmes identifiés</span>
              <span className="font-bold" style={{ color: moduleColor }}>{totalRows}</span>
            </div>
          </div>
          <div className="flex-1 bg-white/5 rounded-lg p-3 border border-white/10">
            <div className="flex items-center justify-between">
              <span className="text-xs text-white/40">Fiches complètes</span>
              <span className="font-bold text-green-400">{filledRows}</span>
            </div>
          </div>
          <div className="flex-1 bg-white/5 rounded-lg p-3 border border-white/10">
            <div className="flex items-center justify-between">
              <span className="text-xs text-white/40">Criticité haute</span>
              <span className="font-bold text-orange-400">{criticalCount}</span>
            </div>
          </div>
        </div>

        {/* Company Name */}
        <div className="flex items-center gap-3">
          <label className="text-sm text-white/60">Entreprise :</label>
          <input
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder="Nom de votre entreprise"
            className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:border-[#00F5FF] focus:outline-none"
          />
        </div>
      </div>

      {/* Spreadsheet */}
      <div className="flex-1 overflow-auto bg-[#0a0a15] rounded-xl border border-white/10">
        <table className="w-max min-w-full border-collapse">
          <thead className="sticky top-0 z-10">
            <tr className="bg-[#1a1a2e]">
              <th className="w-10 px-2 py-2 text-xs font-medium text-white/40 border-b border-r border-white/10 sticky left-0 bg-[#1a1a2e] z-20">
                #
              </th>
              {COLUMNS.map((col) => (
                <th
                  key={col.key}
                  style={{ width: col.width, minWidth: col.width }}
                  className="px-2 py-2 text-xs font-medium text-left border-b border-r border-white/10 whitespace-nowrap"
                >
                  <span className={col.required ? 'text-white' : 'text-white/60'}>
                    {col.label}
                    {col.required && <span className="text-red-400 ml-1">*</span>}
                  </span>
                </th>
              ))}
              <th className="w-16 px-2 py-2 text-xs font-medium text-white/40 border-b border-white/10">
                🗑️
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIdx) => (
              <tr
                key={row.id || rowIdx}
                className={`${rowIdx % 2 === 0 ? 'bg-white/[0.02]' : ''} hover:bg-white/[0.05]`}
              >
                <td className="px-2 py-1 text-xs text-white/40 text-center border-r border-white/10 sticky left-0 bg-[#0a0a15]">
                  {rowIdx + 1}
                </td>
                {COLUMNS.map((col, colIdx) => (
                  <td
                    key={col.key}
                    className="border-r border-b border-white/5 p-0"
                    style={{ width: col.width, minWidth: col.width }}
                  >
                    {renderCell(row, col, rowIdx, colIdx)}
                  </td>
                ))}
                <td className="px-2 py-1 border-b border-white/5 text-center">
                  <button
                    onClick={() => deleteRow(rowIdx)}
                    className="p-1 rounded hover:bg-red-500/20 text-white/40 hover:text-red-400"
                    disabled={rows.length <= 1}
                  >
                    ✕
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="flex-shrink-0 mt-4 flex gap-3">
        <button
          onClick={addRow}
          className="px-4 py-3 rounded-xl bg-white/10 font-medium text-sm hover:bg-white/20 flex items-center gap-2"
        >
          ➕ Ajouter une ligne
        </button>

        <div className="flex-1" />

        <button
          onClick={exportToExcel}
          disabled={isExporting || totalRows === 0}
          className="px-6 py-3 rounded-xl font-bold text-black text-sm flex items-center gap-2 disabled:opacity-50"
          style={{ backgroundColor: moduleColor }}
        >
          {isExporting ? '⏳ Export...' : '📊 Exporter Excel'}
        </button>

        <button
          onClick={onComplete}
          disabled={totalRows === 0}
          className="px-6 py-3 rounded-xl font-bold text-sm bg-white/10 hover:bg-white/20 disabled:opacity-50"
        >
          Continuer →
        </button>
      </div>

      {/* Tips */}
      <div className="flex-shrink-0 mt-3 p-3 bg-white/5 rounded-lg border border-white/10">
        <p className="text-xs text-white/40">
          💡 Double-cliquez pour éditer • Tab pour changer de cellule • Utilisez "Suggestions IA" pour ajouter rapidement des systèmes courants
        </p>
      </div>

      {/* Suggestions Modal */}
      {showSuggestions && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#1a1a2e] rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto border border-white/10"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">💡 Systèmes IA courants</h3>
              <button
                onClick={() => setShowSuggestions(false)}
                className="text-white/40 hover:text-white"
              >
                ✕
              </button>
            </div>
            <p className="text-sm text-white/60 mb-4">
              Cliquez pour ajouter à votre inventaire. Votre entreprise utilise peut-être certains de ces outils :
            </p>
            <div className="grid grid-cols-2 gap-2">
              {AI_SUGGESTIONS.map((suggestion, idx) => (
                <button
                  key={idx}
                  onClick={() => addFromSuggestion(suggestion)}
                  className="p-3 rounded-lg bg-white/5 hover:bg-white/10 text-left transition-colors border border-white/10"
                >
                  <p className="font-medium text-sm">{suggestion.name}</p>
                  <p className="text-xs text-white/40">{suggestion.vendor}</p>
                  <p className="text-xs text-white/60 mt-1 line-clamp-1">{suggestion.purpose}</p>
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
