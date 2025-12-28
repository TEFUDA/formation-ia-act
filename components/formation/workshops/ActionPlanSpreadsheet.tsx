'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// ============================================
// TYPES
// ============================================
interface ActionRow {
  id: string;
  title: string;
  category: string;
  priority: string;
  status: string;
  owner: string;
  startWeek: number;
  endWeek: number;
  aiActRef: string;
  notes: string;
}

// ============================================
// PREDEFINED ACTIONS
// ============================================
const DEFAULT_ACTIONS: Omit<ActionRow, 'id'>[] = [
  // Phase 1: Weeks 1-4
  { title: 'Désigner un responsable IA', category: 'governance', priority: 'critical', status: 'todo', owner: '', startWeek: 1, endWeek: 2, aiActRef: 'Art. 26', notes: '' },
  { title: 'Sensibilisation Direction', category: 'governance', priority: 'critical', status: 'todo', owner: '', startWeek: 1, endWeek: 2, aiActRef: '', notes: '' },
  { title: 'Inventaire des systèmes IA', category: 'inventory', priority: 'critical', status: 'todo', owner: '', startWeek: 2, endWeek: 4, aiActRef: 'Art. 26.5', notes: '' },
  { title: 'Vérifier pratiques interdites', category: 'classification', priority: 'critical', status: 'todo', owner: '', startWeek: 2, endWeek: 3, aiActRef: 'Art. 5', notes: '' },
  { title: 'Identifier systèmes haut risque', category: 'classification', priority: 'high', status: 'todo', owner: '', startWeek: 3, endWeek: 4, aiActRef: 'Annexe III', notes: '' },
  
  // Phase 2: Weeks 5-8
  { title: 'Créer le registre IA officiel', category: 'documentation', priority: 'critical', status: 'todo', owner: '', startWeek: 5, endWeek: 6, aiActRef: 'Art. 49', notes: '' },
  { title: 'Contacter fournisseurs', category: 'documentation', priority: 'high', status: 'todo', owner: '', startWeek: 5, endWeek: 7, aiActRef: 'Art. 26.2', notes: '' },
  { title: 'Évaluation des risques', category: 'classification', priority: 'high', status: 'todo', owner: '', startWeek: 6, endWeek: 8, aiActRef: 'Art. 9', notes: '' },
  { title: 'Former équipes clés', category: 'training', priority: 'high', status: 'todo', owner: '', startWeek: 6, endWeek: 8, aiActRef: 'Art. 4', notes: '' },
  { title: 'Procédure supervision humaine', category: 'governance', priority: 'high', status: 'todo', owner: '', startWeek: 7, endWeek: 8, aiActRef: 'Art. 14', notes: '' },
  
  // Phase 3: Weeks 9-12
  { title: 'Finaliser politique IA', category: 'governance', priority: 'high', status: 'todo', owner: '', startWeek: 9, endWeek: 10, aiActRef: '', notes: '' },
  { title: 'Formation générale', category: 'training', priority: 'medium', status: 'todo', owner: '', startWeek: 9, endWeek: 11, aiActRef: 'Art. 4', notes: '' },
  { title: 'Mentions légales IA', category: 'documentation', priority: 'medium', status: 'todo', owner: '', startWeek: 10, endWeek: 11, aiActRef: 'Art. 50', notes: '' },
  { title: 'Tableau de bord conformité', category: 'monitoring', priority: 'medium', status: 'todo', owner: '', startWeek: 10, endWeek: 12, aiActRef: '', notes: '' },
  { title: 'Audit interne', category: 'monitoring', priority: 'high', status: 'todo', owner: '', startWeek: 11, endWeek: 12, aiActRef: 'Art. 26.11', notes: '' },
  { title: 'Plan de veille continue', category: 'monitoring', priority: 'low', status: 'todo', owner: '', startWeek: 12, endWeek: 13, aiActRef: '', notes: '' },
];

const CATEGORIES = {
  governance: { label: 'Gouvernance', color: '#8B5CF6', icon: '🏛️' },
  inventory: { label: 'Inventaire', color: '#00FF88', icon: '📋' },
  classification: { label: 'Classification', color: '#FFB800', icon: '⚖️' },
  documentation: { label: 'Documentation', color: '#00F5FF', icon: '📄' },
  training: { label: 'Formation', color: '#F97316', icon: '🎓' },
  monitoring: { label: 'Suivi', color: '#10B981', icon: '📊' },
};

const PRIORITIES = {
  critical: { label: '🔴 Critique', color: '#EF4444' },
  high: { label: '🟠 Haute', color: '#F97316' },
  medium: { label: '🟡 Moyenne', color: '#EAB308' },
  low: { label: '🟢 Basse', color: '#22C55E' },
};

const STATUSES = {
  todo: { label: '⏳ À faire', color: '#6B7280' },
  inProgress: { label: '🔄 En cours', color: '#3B82F6' },
  done: { label: '✅ Terminé', color: '#22C55E' },
  blocked: { label: '🚫 Bloqué', color: '#EF4444' },
};

const WEEKS = Array.from({ length: 13 }, (_, i) => i + 1);

// ============================================
// COMPONENT
// ============================================
interface ActionPlanSpreadsheetProps {
  moduleColor: string;
  onComplete: () => void;
}

export default function ActionPlanSpreadsheet({ moduleColor, onComplete }: ActionPlanSpreadsheetProps) {
  const [rows, setRows] = useState<ActionRow[]>([]);
  const [editingCell, setEditingCell] = useState<{ row: number; col: string } | null>(null);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [companyName, setCompanyName] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const [showGantt, setShowGantt] = useState(true);

  // Load data
  useEffect(() => {
    const savedData = localStorage.getItem('workshop_actionplan_spreadsheet');
    if (savedData) {
      try {
        const data = JSON.parse(savedData);
        setRows(data.rows || []);
        setStartDate(data.startDate || new Date().toISOString().split('T')[0]);
        setCompanyName(data.companyName || '');
      } catch (e) {}
    } else {
      // Initialize with default actions
      const initialRows = DEFAULT_ACTIONS.map((action, idx) => ({
        ...action,
        id: `ACT-${String(idx + 1).padStart(3, '0')}`,
      }));
      setRows(initialRows);
    }

    // Load company name
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
      localStorage.setItem('workshop_actionplan_spreadsheet', JSON.stringify({
        rows,
        startDate,
        companyName,
        lastUpdated: new Date().toISOString(),
      }));
    }
  }, [rows, startDate, companyName]);

  // Cell operations
  const handleCellChange = (rowIdx: number, key: keyof ActionRow, value: string | number) => {
    setRows(prev => prev.map((row, idx) =>
      idx === rowIdx ? { ...row, [key]: value } : row
    ));
  };

  const addRow = () => {
    const newId = `ACT-${String(rows.length + 1).padStart(3, '0')}`;
    setRows([...rows, {
      id: newId,
      title: '',
      category: 'governance',
      priority: 'medium',
      status: 'todo',
      owner: '',
      startWeek: 1,
      endWeek: 2,
      aiActRef: '',
      notes: '',
    }]);
  };

  const deleteRow = (idx: number) => {
    setRows(rows.filter((_, i) => i !== idx));
  };

  // Export
  const exportToExcel = async () => {
    setIsExporting(true);
    try {
      const XLSX = await import('xlsx');

      // Main data
      const exportData = rows.map(row => {
        const start = new Date(startDate);
        start.setDate(start.getDate() + (row.startWeek - 1) * 7);
        const end = new Date(startDate);
        end.setDate(end.getDate() + row.endWeek * 7);

        return {
          'ID': row.id,
          'Action': row.title,
          'Catégorie': CATEGORIES[row.category as keyof typeof CATEGORIES]?.label || row.category,
          'Priorité': PRIORITIES[row.priority as keyof typeof PRIORITIES]?.label || row.priority,
          'Statut': STATUSES[row.status as keyof typeof STATUSES]?.label || row.status,
          'Responsable': row.owner,
          'Début': start.toLocaleDateString('fr-FR'),
          'Fin': end.toLocaleDateString('fr-FR'),
          'Semaine début': row.startWeek,
          'Semaine fin': row.endWeek,
          'Réf. AI Act': row.aiActRef,
          'Notes': row.notes,
        };
      });

      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(exportData);

      ws['!cols'] = [
        { wch: 10 }, { wch: 35 }, { wch: 15 }, { wch: 12 },
        { wch: 12 }, { wch: 18 }, { wch: 12 }, { wch: 12 },
        { wch: 10 }, { wch: 10 }, { wch: 12 }, { wch: 30 },
      ];

      XLSX.utils.book_append_sheet(wb, ws, 'Plan Action');

      // Summary
      const doneCount = rows.filter(r => r.status === 'done').length;
      const inProgressCount = rows.filter(r => r.status === 'inProgress').length;
      const blockedCount = rows.filter(r => r.status === 'blocked').length;

      const summaryData = [
        ['PLAN D\'ACTION CONFORMITÉ AI ACT - 90 JOURS'],
        [''],
        ['Entreprise:', companyName || '[Nom de l\'entreprise]'],
        ['Date de début:', new Date(startDate).toLocaleDateString('fr-FR')],
        ['Nombre d\'actions:', rows.length],
        [''],
        ['PROGRESSION'],
        ['Terminées:', doneCount],
        ['En cours:', inProgressCount],
        ['Bloquées:', blockedCount],
        ['À faire:', rows.length - doneCount - inProgressCount - blockedCount],
        ['% Complété:', `${Math.round((doneCount / rows.length) * 100)}%`],
        [''],
        ['PAR CATÉGORIE'],
        ...Object.entries(CATEGORIES).map(([key, cat]) => [
          cat.label + ':',
          rows.filter(r => r.category === key).length,
        ]),
        [''],
        ['Généré via formation-ia-act.fr'],
      ];

      const summaryWs = XLSX.utils.aoa_to_sheet(summaryData);
      summaryWs['!cols'] = [{ wch: 25 }, { wch: 20 }];
      XLSX.utils.book_append_sheet(wb, summaryWs, 'Résumé');

      const fileName = `plan-action-ia-${companyName ? companyName.toLowerCase().replace(/\s+/g, '-') : 'entreprise'}-${new Date().toISOString().split('T')[0]}.xlsx`;
      XLSX.writeFile(wb, fileName);
    } catch (error) {
      console.error('Export error:', error);
      alert('Erreur lors de l\'export');
    } finally {
      setIsExporting(false);
    }
  };

  // Stats
  const totalActions = rows.length;
  const doneActions = rows.filter(r => r.status === 'done').length;
  const progress = totalActions > 0 ? Math.round((doneActions / totalActions) * 100) : 0;
  const criticalPending = rows.filter(r => r.priority === 'critical' && r.status !== 'done').length;

  // Get week date
  const getWeekDate = (weekNum: number) => {
    const date = new Date(startDate);
    date.setDate(date.getDate() + (weekNum - 1) * 7);
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex-shrink-0 mb-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2">
              <span>🎯</span> Plan d'Action 90 Jours - Gantt
            </h2>
            <p className="text-white/60 text-sm mt-1">
              Planifiez votre mise en conformité AI Act
            </p>
          </div>
          <button
            onClick={() => setShowGantt(!showGantt)}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${showGantt ? 'bg-white/20' : 'bg-white/10'}`}
          >
            {showGantt ? '📊 Vue Gantt' : '📋 Vue Liste'}
          </button>
        </div>

        {/* Stats */}
        <div className="flex gap-3 mb-3">
          <div className="flex-1 bg-white/5 rounded-lg p-3 border border-white/10">
            <div className="flex items-center justify-between">
              <span className="text-xs text-white/40">Progression</span>
              <span className="font-bold" style={{ color: progress >= 80 ? '#22C55E' : progress >= 50 ? '#EAB308' : moduleColor }}>{progress}%</span>
            </div>
            <div className="h-1.5 bg-white/10 rounded-full mt-2 overflow-hidden">
              <div className="h-full rounded-full transition-all" style={{ width: `${progress}%`, backgroundColor: moduleColor }} />
            </div>
          </div>
          <div className="flex-1 bg-white/5 rounded-lg p-3 border border-white/10">
            <div className="flex items-center justify-between">
              <span className="text-xs text-white/40">Actions</span>
              <span className="font-bold">{doneActions}/{totalActions}</span>
            </div>
          </div>
          <div className="flex-1 bg-white/5 rounded-lg p-3 border border-white/10">
            <div className="flex items-center justify-between">
              <span className="text-xs text-white/40">Critiques en attente</span>
              <span className="font-bold text-red-400">{criticalPending}</span>
            </div>
          </div>
        </div>

        {/* Settings */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm text-white/60">Début :</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:border-[#00F5FF] focus:outline-none"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm text-white/60">Entreprise :</label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Nom de l'entreprise"
              className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:border-[#00F5FF] focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Spreadsheet with Gantt */}
      <div className="flex-1 overflow-auto bg-[#0a0a15] rounded-xl border border-white/10">
        <table className="w-max min-w-full border-collapse">
          <thead className="sticky top-0 z-10">
            <tr className="bg-[#1a1a2e]">
              <th className="w-8 px-2 py-2 text-xs font-medium text-white/40 border-b border-r border-white/10">#</th>
              <th className="w-48 px-2 py-2 text-xs font-medium text-left border-b border-r border-white/10">Action</th>
              <th className="w-24 px-2 py-2 text-xs font-medium text-left border-b border-r border-white/10">Catégorie</th>
              <th className="w-24 px-2 py-2 text-xs font-medium text-left border-b border-r border-white/10">Priorité</th>
              <th className="w-24 px-2 py-2 text-xs font-medium text-left border-b border-r border-white/10">Statut</th>
              <th className="w-28 px-2 py-2 text-xs font-medium text-left border-b border-r border-white/10">Responsable</th>
              {showGantt && WEEKS.map(week => (
                <th
                  key={week}
                  className="w-10 px-1 py-2 text-[10px] font-medium text-center border-b border-r border-white/10"
                  style={{ backgroundColor: week <= 4 ? '#8B5CF620' : week <= 8 ? '#00F5FF20' : '#22C55E20' }}
                >
                  S{week}
                  <div className="text-[8px] text-white/40">{getWeekDate(week)}</div>
                </th>
              ))}
              <th className="w-12 px-2 py-2 text-xs font-medium text-white/40 border-b border-white/10">🗑️</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIdx) => {
              const cat = CATEGORIES[row.category as keyof typeof CATEGORIES];
              const priority = PRIORITIES[row.priority as keyof typeof PRIORITIES];
              const status = STATUSES[row.status as keyof typeof STATUSES];

              return (
                <tr key={row.id} className={`${rowIdx % 2 === 0 ? 'bg-white/[0.02]' : ''} hover:bg-white/[0.05]`}>
                  <td className="px-2 py-1 text-xs text-white/40 text-center border-r border-white/10">{rowIdx + 1}</td>
                  
                  {/* Title */}
                  <td className="px-2 py-1 border-r border-white/5">
                    {editingCell?.row === rowIdx && editingCell?.col === 'title' ? (
                      <input
                        autoFocus
                        value={row.title}
                        onChange={(e) => handleCellChange(rowIdx, 'title', e.target.value)}
                        onBlur={() => setEditingCell(null)}
                        className="w-full px-1 bg-[#1a1a2e] text-white border-2 outline-none text-xs"
                        style={{ borderColor: moduleColor }}
                      />
                    ) : (
                      <div
                        className="text-xs truncate cursor-cell"
                        onDoubleClick={() => setEditingCell({ row: rowIdx, col: 'title' })}
                        title={row.title}
                      >
                        {row.title || <span className="text-white/20">Cliquer pour éditer</span>}
                      </div>
                    )}
                  </td>

                  {/* Category */}
                  <td className="px-2 py-1 border-r border-white/5">
                    <select
                      value={row.category}
                      onChange={(e) => handleCellChange(rowIdx, 'category', e.target.value)}
                      className="w-full bg-transparent text-xs cursor-pointer"
                      style={{ color: cat?.color }}
                    >
                      {Object.entries(CATEGORIES).map(([key, val]) => (
                        <option key={key} value={key}>{val.icon} {val.label}</option>
                      ))}
                    </select>
                  </td>

                  {/* Priority */}
                  <td className="px-2 py-1 border-r border-white/5">
                    <select
                      value={row.priority}
                      onChange={(e) => handleCellChange(rowIdx, 'priority', e.target.value)}
                      className="w-full bg-transparent text-xs cursor-pointer"
                    >
                      {Object.entries(PRIORITIES).map(([key, val]) => (
                        <option key={key} value={key}>{val.label}</option>
                      ))}
                    </select>
                  </td>

                  {/* Status */}
                  <td className="px-2 py-1 border-r border-white/5">
                    <select
                      value={row.status}
                      onChange={(e) => handleCellChange(rowIdx, 'status', e.target.value)}
                      className="w-full bg-transparent text-xs cursor-pointer"
                      style={{ color: status?.color }}
                    >
                      {Object.entries(STATUSES).map(([key, val]) => (
                        <option key={key} value={key}>{val.label}</option>
                      ))}
                    </select>
                  </td>

                  {/* Owner */}
                  <td className="px-2 py-1 border-r border-white/5">
                    {editingCell?.row === rowIdx && editingCell?.col === 'owner' ? (
                      <input
                        autoFocus
                        value={row.owner}
                        onChange={(e) => handleCellChange(rowIdx, 'owner', e.target.value)}
                        onBlur={() => setEditingCell(null)}
                        className="w-full px-1 bg-[#1a1a2e] text-white border-2 outline-none text-xs"
                        style={{ borderColor: moduleColor }}
                      />
                    ) : (
                      <div
                        className="text-xs truncate cursor-cell text-white/60"
                        onDoubleClick={() => setEditingCell({ row: rowIdx, col: 'owner' })}
                      >
                        {row.owner || <span className="text-white/20">—</span>}
                      </div>
                    )}
                  </td>

                  {/* Gantt bars */}
                  {showGantt && WEEKS.map(week => {
                    const isInRange = week >= row.startWeek && week <= row.endWeek;
                    const isStart = week === row.startWeek;
                    const isEnd = week === row.endWeek;

                    return (
                      <td
                        key={week}
                        className="p-0 border-r border-white/5 relative"
                        onClick={() => {
                          if (week < row.startWeek) {
                            handleCellChange(rowIdx, 'startWeek', week);
                          } else if (week > row.endWeek) {
                            handleCellChange(rowIdx, 'endWeek', week);
                          } else if (week === row.startWeek && week === row.endWeek) {
                            // Single week, do nothing
                          } else if (week === row.startWeek) {
                            handleCellChange(rowIdx, 'startWeek', week + 1);
                          } else if (week === row.endWeek) {
                            handleCellChange(rowIdx, 'endWeek', week - 1);
                          }
                        }}
                      >
                        {isInRange && (
                          <div
                            className={`h-5 my-1 ${isStart ? 'ml-1 rounded-l' : ''} ${isEnd ? 'mr-1 rounded-r' : ''}`}
                            style={{
                              backgroundColor: row.status === 'done' ? '#22C55E' : row.status === 'blocked' ? '#EF4444' : cat?.color || moduleColor,
                              opacity: row.status === 'done' ? 1 : 0.7,
                            }}
                          />
                        )}
                      </td>
                    );
                  })}

                  {/* Delete */}
                  <td className="px-2 py-1 text-center">
                    <button
                      onClick={() => deleteRow(rowIdx)}
                      className="p-1 rounded hover:bg-red-500/20 text-white/40 hover:text-red-400"
                    >
                      ✕
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="flex-shrink-0 mt-3 flex flex-wrap gap-3">
        <div className="text-xs text-white/40">Phases :</div>
        <div className="flex items-center gap-1 text-xs">
          <div className="w-3 h-3 rounded" style={{ backgroundColor: '#8B5CF620' }} />
          <span className="text-white/60">S1-4 : Fondation</span>
        </div>
        <div className="flex items-center gap-1 text-xs">
          <div className="w-3 h-3 rounded" style={{ backgroundColor: '#00F5FF20' }} />
          <span className="text-white/60">S5-8 : Développement</span>
        </div>
        <div className="flex items-center gap-1 text-xs">
          <div className="w-3 h-3 rounded" style={{ backgroundColor: '#22C55E20' }} />
          <span className="text-white/60">S9-13 : Finalisation</span>
        </div>
      </div>

      {/* Footer */}
      <div className="flex-shrink-0 mt-4 flex gap-3">
        <button
          onClick={addRow}
          className="px-4 py-3 rounded-xl bg-white/10 font-medium text-sm hover:bg-white/20"
        >
          ➕ Ajouter une action
        </button>

        <div className="flex-1" />

        <button
          onClick={exportToExcel}
          disabled={isExporting}
          className="px-6 py-3 rounded-xl font-bold text-black text-sm flex items-center gap-2"
          style={{ backgroundColor: moduleColor }}
        >
          {isExporting ? '⏳ Export...' : '📊 Exporter Excel'}
        </button>

        <button
          onClick={onComplete}
          className="px-6 py-3 rounded-xl font-bold text-sm bg-white/10 hover:bg-white/20"
        >
          Terminer →
        </button>
      </div>

      {/* Tips */}
      <div className="flex-shrink-0 mt-3 p-3 bg-white/5 rounded-lg border border-white/10">
        <p className="text-xs text-white/40">
          💡 Cliquez sur les barres Gantt pour ajuster les dates • Double-cliquez sur le texte pour éditer • Les actions pré-remplies sont basées sur les exigences AI Act
        </p>
      </div>
    </div>
  );
}
