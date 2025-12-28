'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';

// ============================================
// TYPES
// ============================================
interface RegistryRow {
  id: string;
  systemName: string;
  vendor: string;
  department: string;
  purpose: string;
  dataTypes: string;
  riskCategory: string;
  aiActRole: string;
  legalBasis: string;
  humanOversight: string;
  technicalDoc: string;
  conformityStatus: string;
  responsiblePerson: string;
  deploymentDate: string;
  lastReview: string;
  notes: string;
}

interface ColumnDef {
  key: keyof RegistryRow;
  label: string;
  width: number;
  type: 'text' | 'select' | 'date' | 'textarea';
  options?: { value: string; label: string }[];
  required?: boolean;
  helpText?: string;
}

// ============================================
// COLUMN DEFINITIONS
// ============================================
const COLUMNS: ColumnDef[] = [
  { key: 'id', label: 'ID', width: 60, type: 'text', required: true },
  { key: 'systemName', label: 'Nom du système', width: 180, type: 'text', required: true },
  { key: 'vendor', label: 'Fournisseur', width: 140, type: 'text', required: true },
  { key: 'department', label: 'Département', width: 130, type: 'select', options: [
    { value: 'hr', label: 'RH' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'sales', label: 'Commercial' },
    { value: 'finance', label: 'Finance' },
    { value: 'it', label: 'IT' },
    { value: 'customer_service', label: 'Service Client' },
    { value: 'operations', label: 'Opérations' },
    { value: 'legal', label: 'Juridique' },
    { value: 'rd', label: 'R&D' },
    { value: 'other', label: 'Autre' },
  ]},
  { key: 'purpose', label: 'Finalité / Usage', width: 200, type: 'textarea' },
  { key: 'dataTypes', label: 'Types de données', width: 150, type: 'select', options: [
    { value: 'none', label: 'Aucune donnée perso' },
    { value: 'personal', label: 'Données personnelles' },
    { value: 'sensitive', label: 'Données sensibles' },
    { value: 'biometric', label: 'Données biométriques' },
    { value: 'financial', label: 'Données financières' },
  ]},
  { key: 'riskCategory', label: 'Catégorie de risque', width: 140, type: 'select', required: true, options: [
    { value: 'unclassified', label: '❓ Non classifié' },
    { value: 'minimal', label: '✅ Minimal' },
    { value: 'limited', label: '📋 Limité' },
    { value: 'high', label: '⚠️ Haut risque' },
    { value: 'prohibited', label: '🚫 Interdit' },
    { value: 'gpai', label: '🤖 GPAI' },
  ]},
  { key: 'aiActRole', label: 'Rôle AI Act', width: 120, type: 'select', options: [
    { value: 'deployer', label: 'Déployeur' },
    { value: 'provider', label: 'Fournisseur' },
    { value: 'importer', label: 'Importateur' },
    { value: 'distributor', label: 'Distributeur' },
  ]},
  { key: 'legalBasis', label: 'Base légale RGPD', width: 150, type: 'select', options: [
    { value: 'consent', label: 'Consentement' },
    { value: 'contract', label: 'Contrat' },
    { value: 'legal_obligation', label: 'Obligation légale' },
    { value: 'legitimate_interest', label: 'Intérêt légitime' },
    { value: 'public_interest', label: 'Intérêt public' },
    { value: 'na', label: 'N/A' },
  ]},
  { key: 'humanOversight', label: 'Supervision humaine', width: 160, type: 'text' },
  { key: 'technicalDoc', label: 'Doc. technique', width: 130, type: 'select', options: [
    { value: 'available', label: '✅ Disponible' },
    { value: 'requested', label: '📨 Demandée' },
    { value: 'missing', label: '❌ Manquante' },
    { value: 'na', label: 'N/A' },
  ]},
  { key: 'conformityStatus', label: 'Statut conformité', width: 140, type: 'select', options: [
    { value: 'compliant', label: '✅ Conforme' },
    { value: 'in_progress', label: '🔄 En cours' },
    { value: 'non_compliant', label: '❌ Non conforme' },
    { value: 'pending', label: '⏳ À évaluer' },
  ]},
  { key: 'responsiblePerson', label: 'Responsable', width: 140, type: 'text' },
  { key: 'deploymentDate', label: 'Date déploiement', width: 130, type: 'date' },
  { key: 'lastReview', label: 'Dernière revue', width: 130, type: 'date' },
  { key: 'notes', label: 'Notes', width: 200, type: 'textarea' },
];

const EMPTY_ROW: RegistryRow = {
  id: '',
  systemName: '',
  vendor: '',
  department: '',
  purpose: '',
  dataTypes: '',
  riskCategory: 'unclassified',
  aiActRole: 'deployer',
  legalBasis: '',
  humanOversight: '',
  technicalDoc: 'missing',
  conformityStatus: 'pending',
  responsiblePerson: '',
  deploymentDate: '',
  lastReview: '',
  notes: '',
};

const DEPARTMENT_LABELS: Record<string, string> = {
  hr: 'RH',
  marketing: 'Marketing',
  sales: 'Commercial',
  finance: 'Finance',
  it: 'IT',
  customer_service: 'Service Client',
  operations: 'Opérations',
  legal: 'Juridique',
  rd: 'R&D',
  other: 'Autre',
};

// ============================================
// COMPONENT
// ============================================
interface RegistrySpreadsheetProps {
  moduleColor: string;
  onComplete: () => void;
}

export default function RegistrySpreadsheet({ moduleColor, onComplete }: RegistrySpreadsheetProps) {
  const [rows, setRows] = useState<RegistryRow[]>([]);
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);
  const [editingCell, setEditingCell] = useState<{ row: number; col: number } | null>(null);
  const [companyName, setCompanyName] = useState('');
  const [showImportModal, setShowImportModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const tableRef = useRef<HTMLDivElement>(null);

  // Load data from previous workshops
  useEffect(() => {
    // Load company name
    const savedProfile = localStorage.getItem('workshop_company_profile');
    if (savedProfile) {
      try {
        const profile = JSON.parse(savedProfile);
        setCompanyName(profile.name || '');
      } catch (e) {}
    }

    // Load existing registry data
    const savedRegistry = localStorage.getItem('workshop_registry_spreadsheet');
    if (savedRegistry) {
      try {
        const data = JSON.parse(savedRegistry);
        setRows(data.rows || []);
      } catch (e) {}
    } else {
      // Check if we have inventory data to import
      const savedInventory = localStorage.getItem('workshop_ai_inventory');
      if (savedInventory) {
        setShowImportModal(true);
      } else {
        // Start with one empty row
        setRows([{ ...EMPTY_ROW, id: 'SYS-001' }]);
      }
    }
  }, []);

  // Save data
  useEffect(() => {
    if (rows.length > 0) {
      localStorage.setItem('workshop_registry_spreadsheet', JSON.stringify({
        rows,
        companyName,
        lastUpdated: new Date().toISOString(),
      }));
    }
  }, [rows, companyName]);

  // Import from inventory
  const importFromInventory = () => {
    const savedInventory = localStorage.getItem('workshop_ai_inventory');
    if (!savedInventory) return;

    try {
      const inventory = JSON.parse(savedInventory);
      const importedRows: RegistryRow[] = inventory.map((sys: any, idx: number) => ({
        ...EMPTY_ROW,
        id: `SYS-${String(idx + 1).padStart(3, '0')}`,
        systemName: sys.name || '',
        vendor: sys.vendor || '',
        department: sys.department || '',
        purpose: sys.purpose || '',
        dataTypes: sys.dataTypes?.[0] || '',
        riskCategory: sys.riskCategory || 'unclassified',
      }));
      
      setRows(importedRows);
      setShowImportModal(false);
    } catch (e) {
      console.error('Import error:', e);
    }
  };

  // Cell editing
  const handleCellClick = (rowIdx: number, colIdx: number) => {
    setSelectedCell({ row: rowIdx, col: colIdx });
  };

  const handleCellDoubleClick = (rowIdx: number, colIdx: number) => {
    setEditingCell({ row: rowIdx, col: colIdx });
  };

  const handleCellChange = (rowIdx: number, key: keyof RegistryRow, value: string) => {
    setRows(prev => prev.map((row, idx) => 
      idx === rowIdx ? { ...row, [key]: value } : row
    ));
  };

  const handleCellBlur = () => {
    setEditingCell(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent, rowIdx: number, colIdx: number) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      setEditingCell(null);
      // Move to next row
      if (rowIdx < rows.length - 1) {
        setSelectedCell({ row: rowIdx + 1, col: colIdx });
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      setEditingCell(null);
      // Move to next column
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
    const newId = `SYS-${String(rows.length + 1).padStart(3, '0')}`;
    setRows([...rows, { ...EMPTY_ROW, id: newId }]);
  };

  const deleteRow = (idx: number) => {
    if (rows.length <= 1) return;
    setRows(rows.filter((_, i) => i !== idx));
  };

  const duplicateRow = (idx: number) => {
    const newRow = { ...rows[idx], id: `SYS-${String(rows.length + 1).padStart(3, '0')}` };
    const newRows = [...rows];
    newRows.splice(idx + 1, 0, newRow);
    setRows(newRows);
  };

  // Export to Excel
  const exportToExcel = async () => {
    setIsExporting(true);
    
    try {
      // Dynamic import of xlsx
      const XLSX = await import('xlsx');
      
      // Prepare data for export
      const exportData = rows.map(row => ({
        'ID': row.id,
        'Nom du système': row.systemName,
        'Fournisseur': row.vendor,
        'Département': DEPARTMENT_LABELS[row.department] || row.department,
        'Finalité / Usage': row.purpose,
        'Types de données': row.dataTypes,
        'Catégorie de risque': row.riskCategory,
        'Rôle AI Act': row.aiActRole,
        'Base légale RGPD': row.legalBasis,
        'Supervision humaine': row.humanOversight,
        'Documentation technique': row.technicalDoc,
        'Statut conformité': row.conformityStatus,
        'Responsable': row.responsiblePerson,
        'Date déploiement': row.deploymentDate,
        'Dernière revue': row.lastReview,
        'Notes': row.notes,
      }));

      // Create workbook
      const wb = XLSX.utils.book_new();
      
      // Main registry sheet
      const ws = XLSX.utils.json_to_sheet(exportData);
      
      // Set column widths
      ws['!cols'] = [
        { wch: 10 },  // ID
        { wch: 25 },  // Nom
        { wch: 20 },  // Fournisseur
        { wch: 15 },  // Département
        { wch: 30 },  // Finalité
        { wch: 18 },  // Types données
        { wch: 18 },  // Risque
        { wch: 15 },  // Rôle
        { wch: 18 },  // Base légale
        { wch: 25 },  // Supervision
        { wch: 18 },  // Doc technique
        { wch: 18 },  // Statut
        { wch: 18 },  // Responsable
        { wch: 15 },  // Date déploiement
        { wch: 15 },  // Dernière revue
        { wch: 30 },  // Notes
      ];

      XLSX.utils.book_append_sheet(wb, ws, 'Registre IA');

      // Add summary sheet
      const summaryData = [
        ['REGISTRE DES SYSTÈMES D\'INTELLIGENCE ARTIFICIELLE'],
        [''],
        ['Entreprise:', companyName || '[Nom de l\'entreprise]'],
        ['Date d\'export:', new Date().toLocaleDateString('fr-FR')],
        ['Nombre de systèmes:', rows.length],
        [''],
        ['STATISTIQUES'],
        ['Systèmes à haut risque:', rows.filter(r => r.riskCategory === 'high').length],
        ['Systèmes GPAI:', rows.filter(r => r.riskCategory === 'gpai').length],
        ['Conformes:', rows.filter(r => r.conformityStatus === 'compliant').length],
        ['En cours d\'évaluation:', rows.filter(r => r.conformityStatus === 'pending' || r.conformityStatus === 'in_progress').length],
        ['Non conformes:', rows.filter(r => r.conformityStatus === 'non_compliant').length],
        [''],
        ['Ce registre a été généré via la formation AI Act de formation-ia-act.fr'],
      ];
      
      const summaryWs = XLSX.utils.aoa_to_sheet(summaryData);
      summaryWs['!cols'] = [{ wch: 30 }, { wch: 40 }];
      XLSX.utils.book_append_sheet(wb, summaryWs, 'Résumé');

      // Generate file
      const fileName = `registre-ia-${companyName ? companyName.toLowerCase().replace(/\s+/g, '-') : 'entreprise'}-${new Date().toISOString().split('T')[0]}.xlsx`;
      XLSX.writeFile(wb, fileName);
      
      setShowExportModal(true);
    } catch (error) {
      console.error('Export error:', error);
      alert('Erreur lors de l\'export. Veuillez réessayer.');
    } finally {
      setIsExporting(false);
    }
  };

  // Get completion stats
  const getCompletionStats = () => {
    const total = rows.length * COLUMNS.filter(c => c.required).length;
    let filled = 0;
    
    rows.forEach(row => {
      COLUMNS.filter(c => c.required).forEach(col => {
        if (row[col.key] && row[col.key] !== 'unclassified' && row[col.key] !== 'pending') {
          filled++;
        }
      });
    });
    
    return { filled, total, percent: total > 0 ? Math.round((filled / total) * 100) : 0 };
  };

  const stats = getCompletionStats();
  const highRiskCount = rows.filter(r => r.riskCategory === 'high' || r.riskCategory === 'prohibited').length;

  // Render cell
  const renderCell = (row: RegistryRow, col: ColumnDef, rowIdx: number, colIdx: number) => {
    const isSelected = selectedCell?.row === rowIdx && selectedCell?.col === colIdx;
    const isEditing = editingCell?.row === rowIdx && editingCell?.col === colIdx;
    const value = row[col.key];

    if (isEditing) {
      if (col.type === 'select') {
        return (
          <select
            autoFocus
            value={value}
            onChange={(e) => handleCellChange(rowIdx, col.key, e.target.value)}
            onBlur={handleCellBlur}
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
            onBlur={handleCellBlur}
            onKeyDown={(e) => handleKeyDown(e, rowIdx, colIdx)}
            className="w-full h-full px-2 py-1 bg-[#1a1a2e] text-white border-2 outline-none resize-none text-xs"
            style={{ borderColor: moduleColor, minHeight: '60px' }}
          />
        );
      }

      return (
        <input
          autoFocus
          type={col.type === 'date' ? 'date' : 'text'}
          value={value}
          onChange={(e) => handleCellChange(rowIdx, col.key, e.target.value)}
          onBlur={handleCellBlur}
          onKeyDown={(e) => handleKeyDown(e, rowIdx, colIdx)}
          className="w-full h-full px-2 bg-[#1a1a2e] text-white border-2 outline-none text-xs"
          style={{ borderColor: moduleColor }}
        />
      );
    }

    // Display value
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
        onClick={() => handleCellClick(rowIdx, colIdx)}
        onDoubleClick={() => handleCellDoubleClick(rowIdx, colIdx)}
        title={displayValue}
      >
        {displayValue || <span className="text-white/20">—</span>}
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
              <span>📊</span> Registre IA - Éditeur Tableur
            </h2>
            <p className="text-white/60 text-sm mt-1">
              Éditez directement comme dans Excel, puis exportez votre fichier
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-xs text-white/40">Complétude</p>
              <p className="text-lg font-bold" style={{ color: stats.percent >= 80 ? '#22C55E' : stats.percent >= 50 ? '#EAB308' : '#EF4444' }}>
                {stats.percent}%
              </p>
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="flex gap-3 mb-3">
          <div className="flex-1 bg-white/5 rounded-lg p-3 border border-white/10">
            <div className="flex items-center justify-between">
              <span className="text-xs text-white/40">Systèmes</span>
              <span className="font-bold" style={{ color: moduleColor }}>{rows.length}</span>
            </div>
          </div>
          <div className="flex-1 bg-white/5 rounded-lg p-3 border border-white/10">
            <div className="flex items-center justify-between">
              <span className="text-xs text-white/40">Haut risque</span>
              <span className="font-bold text-orange-400">{highRiskCount}</span>
            </div>
          </div>
          <div className="flex-1 bg-white/5 rounded-lg p-3 border border-white/10">
            <div className="flex items-center justify-between">
              <span className="text-xs text-white/40">Champs requis</span>
              <span className="font-bold">{stats.filled}/{stats.total}</span>
            </div>
          </div>
        </div>

        {/* Company Name */}
        <div className="flex items-center gap-3 mb-3">
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
      <div 
        ref={tableRef}
        className="flex-1 overflow-auto bg-[#0a0a15] rounded-xl border border-white/10"
      >
        <table className="w-max min-w-full border-collapse">
          {/* Header */}
          <thead className="sticky top-0 z-10">
            <tr className="bg-[#1a1a2e]">
              <th className="w-10 px-2 py-2 text-xs font-medium text-white/40 border-b border-r border-white/10 sticky left-0 bg-[#1a1a2e] z-20">
                #
              </th>
              {COLUMNS.map((col, idx) => (
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
              <th className="w-20 px-2 py-2 text-xs font-medium text-white/40 border-b border-white/10">
                Actions
              </th>
            </tr>
          </thead>

          {/* Body */}
          <tbody>
            {rows.map((row, rowIdx) => (
              <tr 
                key={row.id || rowIdx} 
                className={`${rowIdx % 2 === 0 ? 'bg-white/[0.02]' : ''} hover:bg-white/[0.05]`}
              >
                {/* Row number */}
                <td className="px-2 py-1 text-xs text-white/40 text-center border-r border-white/10 sticky left-0 bg-[#0a0a15] z-10">
                  {rowIdx + 1}
                </td>
                
                {/* Data cells */}
                {COLUMNS.map((col, colIdx) => (
                  <td
                    key={col.key}
                    className="border-r border-b border-white/5 p-0 relative"
                    style={{ width: col.width, minWidth: col.width, maxWidth: col.width }}
                  >
                    {renderCell(row, col, rowIdx, colIdx)}
                  </td>
                ))}
                
                {/* Actions */}
                <td className="px-2 py-1 border-b border-white/5">
                  <div className="flex gap-1 justify-center">
                    <button
                      onClick={() => duplicateRow(rowIdx)}
                      className="p-1 rounded hover:bg-white/10 text-white/40 hover:text-white"
                      title="Dupliquer"
                    >
                      📋
                    </button>
                    <button
                      onClick={() => deleteRow(rowIdx)}
                      className="p-1 rounded hover:bg-red-500/20 text-white/40 hover:text-red-400"
                      title="Supprimer"
                      disabled={rows.length <= 1}
                    >
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer Actions */}
      <div className="flex-shrink-0 mt-4 flex gap-3">
        <button
          onClick={addRow}
          className="px-4 py-3 rounded-xl bg-white/10 font-medium text-sm hover:bg-white/20 flex items-center gap-2"
        >
          ➕ Ajouter une ligne
        </button>
        
        <button
          onClick={() => {
            const savedInventory = localStorage.getItem('workshop_ai_inventory');
            if (savedInventory) {
              setShowImportModal(true);
            } else {
              alert('Aucun inventaire trouvé. Complétez d\'abord l\'exercice 2.2.');
            }
          }}
          className="px-4 py-3 rounded-xl bg-white/10 font-medium text-sm hover:bg-white/20 flex items-center gap-2"
        >
          📥 Importer de l'inventaire
        </button>

        <div className="flex-1" />

        <button
          onClick={exportToExcel}
          disabled={isExporting}
          className="px-6 py-3 rounded-xl font-bold text-black text-sm flex items-center gap-2"
          style={{ backgroundColor: moduleColor }}
        >
          {isExporting ? (
            <>⏳ Export en cours...</>
          ) : (
            <>📊 Exporter en Excel</>
          )}
        </button>
      </div>

      {/* Tips */}
      <div className="flex-shrink-0 mt-3 p-3 bg-white/5 rounded-lg border border-white/10">
        <p className="text-xs text-white/40">
          💡 <strong>Astuces :</strong> Double-cliquez pour éditer • Tab pour changer de cellule • Entrée pour valider • 
          Les champs avec <span className="text-red-400">*</span> sont obligatoires selon l'AI Act
        </p>
      </div>

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#1a1a2e] rounded-2xl p-6 max-w-md w-full border border-white/10"
          >
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <span>📥</span> Importer depuis l'inventaire
            </h3>
            <p className="text-sm text-white/60 mb-6">
              Des systèmes IA ont été identifiés dans l'exercice précédent. 
              Voulez-vous les importer dans le registre ?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowImportModal(false);
                  if (rows.length === 0) {
                    setRows([{ ...EMPTY_ROW, id: 'SYS-001' }]);
                  }
                }}
                className="flex-1 py-3 rounded-xl bg-white/10 font-medium text-sm hover:bg-white/20"
              >
                Commencer vide
              </button>
              <button
                onClick={importFromInventory}
                className="flex-1 py-3 rounded-xl font-bold text-black text-sm"
                style={{ backgroundColor: moduleColor }}
              >
                Importer →
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Export Success Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#1a1a2e] rounded-2xl p-6 max-w-md w-full border border-white/10 text-center"
          >
            <div className="text-5xl mb-4">✅</div>
            <h3 className="text-lg font-bold mb-2">Export réussi !</h3>
            <p className="text-sm text-white/60 mb-6">
              Votre registre IA a été téléchargé au format Excel. 
              Vous pouvez l'utiliser pour votre documentation de conformité AI Act.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowExportModal(false)}
                className="flex-1 py-3 rounded-xl bg-white/10 font-medium text-sm hover:bg-white/20"
              >
                Continuer l'édition
              </button>
              <button
                onClick={() => {
                  setShowExportModal(false);
                  onComplete();
                }}
                className="flex-1 py-3 rounded-xl font-bold text-black text-sm"
                style={{ backgroundColor: moduleColor }}
              >
                Terminer →
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
