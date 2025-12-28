'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ============================================
// TYPES
// ============================================
interface DocumentStatus {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'essential' | 'recommended' | 'optional';
  storageKey: string;
  workshopId: string;
  exportFormat: 'xlsx' | 'docx' | 'pdf' | 'txt';
  isComplete: boolean;
  completionPercent: number;
  data: any;
  aiActRef?: string;
}

// ============================================
// DOCUMENT DEFINITIONS
// ============================================
const DOCUMENTS_CONFIG: Omit<DocumentStatus, 'isComplete' | 'completionPercent' | 'data'>[] = [
  {
    id: 'registry',
    name: 'Registre des systèmes IA',
    description: 'Liste complète de tous vos systèmes d\'IA avec leur classification',
    icon: '📋',
    category: 'essential',
    storageKey: 'workshop_registry_spreadsheet',
    workshopId: '2.4',
    exportFormat: 'xlsx',
    aiActRef: 'Article 49',
  },
  {
    id: 'policy',
    name: 'Politique IA interne',
    description: 'Règles et principes d\'utilisation de l\'IA dans votre entreprise',
    icon: '📜',
    category: 'essential',
    storageKey: 'workshop_policy_data',
    workshopId: '5.2',
    exportFormat: 'docx',
    aiActRef: 'Article 4',
  },
  {
    id: 'action_plan',
    name: 'Plan d\'action 90 jours',
    description: 'Roadmap de mise en conformité avec échéances',
    icon: '🎯',
    category: 'essential',
    storageKey: 'workshop_actionplan_spreadsheet',
    workshopId: '7.2',
    exportFormat: 'xlsx',
    aiActRef: 'Bonnes pratiques',
  },
  {
    id: 'diagnostic',
    name: 'Diagnostic initial',
    description: 'Évaluation de votre niveau d\'exposition à l\'AI Act',
    icon: '🔍',
    category: 'essential',
    storageKey: 'workshop_diagnostic',
    workshopId: '1.2',
    exportFormat: 'pdf',
    aiActRef: 'Auto-évaluation',
  },
  {
    id: 'inventory',
    name: 'Inventaire des systèmes IA',
    description: 'Cartographie complète par département',
    icon: '🗂️',
    category: 'recommended',
    storageKey: 'workshop_inventory_spreadsheet',
    workshopId: '2.2',
    exportFormat: 'xlsx',
  },
  {
    id: 'classification',
    name: 'Résultats de classification',
    description: 'Niveau de risque de chaque système IA',
    icon: '⚖️',
    category: 'recommended',
    storageKey: 'workshop_classification_results',
    workshopId: '3.2',
    exportFormat: 'xlsx',
    aiActRef: 'Annexe III',
  },
  {
    id: 'vendor_emails',
    name: 'Emails fournisseurs',
    description: 'Historique des demandes de documentation',
    icon: '📧',
    category: 'recommended',
    storageKey: 'workshop_vendor_emails',
    workshopId: '4.2',
    exportFormat: 'docx',
    aiActRef: 'Article 26',
  },
  {
    id: 'company_profile',
    name: 'Profil entreprise',
    description: 'Informations générales sur votre organisation',
    icon: '🏢',
    category: 'optional',
    storageKey: 'workshop_company_profile',
    workshopId: '1.2',
    exportFormat: 'txt',
  },
];

// ============================================
// COMPONENT
// ============================================
interface ComplianceDossierProps {
  moduleColor?: string;
  onNavigateToWorkshop?: (workshopId: string) => void;
}

export default function ComplianceDossier({ 
  moduleColor = '#00F5FF',
  onNavigateToWorkshop 
}: ComplianceDossierProps) {
  const [documents, setDocuments] = useState<DocumentStatus[]>([]);
  const [companyName, setCompanyName] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportType, setExportType] = useState<'zip' | 'pdf'>('zip');
  const [showExportModal, setShowExportModal] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<DocumentStatus | null>(null);
  const [certificateCode, setCertificateCode] = useState('');

  const getCertificateUrl = () => {
    const code = certificateCode || `CERT-${Date.now().toString(36).toUpperCase()}`;
    return `https://formation-ia-act.fr/verify/${code}`;
  };

  useEffect(() => {
    loadDocumentStatuses();
    
    const savedProfile = localStorage.getItem('workshop_company_profile');
    if (savedProfile) {
      try {
        const profile = JSON.parse(savedProfile);
        setCompanyName(profile.name || profile.companyName || '');
      } catch (e) {}
    }

    const savedCode = localStorage.getItem('compliance_certificate_code');
    if (savedCode) {
      setCertificateCode(savedCode);
    } else {
      const newCode = `CERT-${Date.now().toString(36).toUpperCase()}`;
      setCertificateCode(newCode);
      localStorage.setItem('compliance_certificate_code', newCode);
    }
  }, []);

  const loadDocumentStatuses = () => {
    const statuses: DocumentStatus[] = DOCUMENTS_CONFIG.map(config => {
      const savedData = localStorage.getItem(config.storageKey);
      let data = null;
      let isComplete = false;
      let completionPercent = 0;

      if (savedData) {
        try {
          data = JSON.parse(savedData);
          
          switch (config.id) {
            case 'registry':
            case 'inventory':
              const rows = data.rows || [];
              const filledRows = rows.filter((r: any) => r.systemName && r.vendor);
              isComplete = filledRows.length >= 1;
              completionPercent = rows.length > 0 ? Math.min(100, Math.round((filledRows.length / Math.max(rows.length, 1)) * 100)) : 0;
              break;
            case 'action_plan':
              const actions = data.rows || [];
              const doneActions = actions.filter((a: any) => a.status === 'done');
              isComplete = actions.length > 0;
              completionPercent = actions.length > 0 ? Math.round((doneActions.length / actions.length) * 100) : 0;
              break;
            case 'policy':
              const sections = Object.keys(data).filter(k => k.startsWith('section_'));
              isComplete = sections.length >= 3;
              completionPercent = Math.min(100, Math.round((sections.length / 7) * 100));
              break;
            case 'diagnostic':
              isComplete = data.completed || data.score !== undefined;
              completionPercent = isComplete ? 100 : 0;
              break;
            case 'classification':
              const results = data.results || data;
              isComplete = Array.isArray(results) ? results.length > 0 : Object.keys(results).length > 0;
              completionPercent = isComplete ? 100 : 0;
              break;
            case 'vendor_emails':
              const emails = data.emails || data;
              isComplete = Array.isArray(emails) ? emails.length > 0 : false;
              completionPercent = isComplete ? 100 : 0;
              break;
            default:
              isComplete = !!data;
              completionPercent = isComplete ? 100 : 0;
          }
        } catch (e) {
          console.error('Error parsing', config.storageKey, e);
        }
      }

      return { ...config, isComplete, completionPercent, data };
    });

    setDocuments(statuses);
  };

  const essentialDocs = documents.filter(d => d.category === 'essential');
  const completedEssential = essentialDocs.filter(d => d.isComplete).length;
  const overallProgress = essentialDocs.length > 0 
    ? Math.round((completedEssential / essentialDocs.length) * 100) 
    : 0;

  const exportDocument = async (doc: DocumentStatus) => {
    if (!doc.data) return;

    try {
      const XLSX = await import('xlsx');

      switch (doc.id) {
        case 'registry':
        case 'inventory': {
          const rows = doc.data.rows || [];
          const wb = XLSX.utils.book_new();
          const ws = XLSX.utils.json_to_sheet(rows);
          XLSX.utils.book_append_sheet(wb, ws, doc.name.substring(0, 31));
          XLSX.writeFile(wb, `${doc.id}-${companyName || 'entreprise'}.xlsx`);
          break;
        }
        case 'action_plan': {
          const rows = doc.data.rows || [];
          const exportData = rows.map((row: any) => ({
            'ID': row.id,
            'Action': row.title,
            'Catégorie': row.category,
            'Priorité': row.priority,
            'Statut': row.status,
            'Responsable': row.owner,
            'Semaine début': row.startWeek,
            'Semaine fin': row.endWeek,
          }));
          const wb = XLSX.utils.book_new();
          const ws = XLSX.utils.json_to_sheet(exportData);
          XLSX.utils.book_append_sheet(wb, ws, 'Plan Action');
          XLSX.writeFile(wb, `plan-action-${companyName || 'entreprise'}.xlsx`);
          break;
        }
        case 'classification': {
          const results = doc.data.results || doc.data;
          const exportData = Object.entries(results).map(([systemId, result]: [string, any]) => ({
            'Système': result.systemName || systemId,
            'Niveau de risque': result.riskLevel,
            'Raisons': Array.isArray(result.reasons) ? result.reasons.join(', ') : '',
          }));
          const wb = XLSX.utils.book_new();
          const ws = XLSX.utils.json_to_sheet(exportData);
          XLSX.utils.book_append_sheet(wb, ws, 'Classification');
          XLSX.writeFile(wb, `classification-ia-${companyName || 'entreprise'}.xlsx`);
          break;
        }
        case 'policy': {
          try {
            const { generatePolicyDocx, downloadBlob } = await import('@/lib/document-generator');
            const blob = await generatePolicyDocx(doc.data, companyName, getCertificateUrl());
            downloadBlob(blob, `politique-ia-${companyName || 'entreprise'}.docx`);
          } catch (e) {
            console.error('Word export failed:', e);
            let content = `POLITIQUE D'UTILISATION DE L'INTELLIGENCE ARTIFICIELLE\n`;
            content += `${companyName || '[Nom de l\'entreprise]'}\n\n`;
            Object.entries(doc.data).forEach(([key, value]) => {
              if (key.startsWith('section_')) {
                content += `${key.replace('section_', '').toUpperCase()}\n${value}\n\n`;
              }
            });
            const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `politique-ia-${companyName || 'entreprise'}.txt`;
            a.click();
            URL.revokeObjectURL(url);
          }
          break;
        }
        default: {
          const content = JSON.stringify(doc.data, null, 2);
          const blob = new Blob([content], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `${doc.id}-${companyName || 'entreprise'}.json`;
          a.click();
          URL.revokeObjectURL(url);
        }
      }
    } catch (error) {
      console.error('Export error:', error);
      alert('Erreur lors de l\'export');
    }
  };

  const exportCompleteDossierZip = async () => {
    setIsExporting(true);
    setExportProgress(0);
    setExportType('zip');
    setShowExportModal(true);

    try {
      const JSZip = (await import('jszip')).default;
      const XLSX = await import('xlsx');
      const zip = new JSZip();

      const folder = zip.folder(`dossier-conformite-ia-act-${companyName || 'entreprise'}`);
      if (!folder) throw new Error('Could not create folder');

      const readme = `# DOSSIER DE CONFORMITÉ AI ACT

Entreprise: ${companyName || '[À compléter]'}
Date: ${new Date().toLocaleDateString('fr-FR')}
Code de vérification: ${certificateCode}
URL: ${getCertificateUrl()}

## Documents inclus
${documents.filter(d => d.isComplete).map(d => `- ${d.icon} ${d.name}`).join('\n')}

## Progression: ${overallProgress}%

---
Formation AI Act - https://formation-ia-act.fr
`;
      folder.file('README.md', readme);
      setExportProgress(10);

      const completedDocs = documents.filter(d => d.isComplete && d.data);
      let progress = 10;
      const progressPerDoc = 70 / Math.max(completedDocs.length, 1);

      for (const doc of completedDocs) {
        try {
          switch (doc.id) {
            case 'registry':
            case 'inventory': {
              const rows = doc.data.rows || [];
              const wb = XLSX.utils.book_new();
              const ws = XLSX.utils.json_to_sheet(rows);
              XLSX.utils.book_append_sheet(wb, ws, 'Données');
              const xlsxData = XLSX.write(wb, { type: 'array', bookType: 'xlsx' });
              folder.file(`${doc.id}.xlsx`, xlsxData);
              break;
            }
            case 'action_plan': {
              const rows = doc.data.rows || [];
              const exportData = rows.map((row: any) => ({
                'ID': row.id, 'Action': row.title, 'Statut': row.status,
                'Semaine début': row.startWeek, 'Semaine fin': row.endWeek,
              }));
              const wb = XLSX.utils.book_new();
              const ws = XLSX.utils.json_to_sheet(exportData);
              XLSX.utils.book_append_sheet(wb, ws, 'Plan');
              const xlsxData = XLSX.write(wb, { type: 'array', bookType: 'xlsx' });
              folder.file('plan-action.xlsx', xlsxData);
              break;
            }
            case 'policy': {
              try {
                const { generatePolicyDocx } = await import('@/lib/document-generator');
                const blob = await generatePolicyDocx(doc.data, companyName, getCertificateUrl());
                const arrayBuffer = await blob.arrayBuffer();
                folder.file('politique-ia.docx', arrayBuffer);
              } catch (e) {
                let content = `# POLITIQUE IA\n\n${companyName}\n\n`;
                Object.entries(doc.data).forEach(([k, v]) => {
                  if (k.startsWith('section_')) content += `## ${k}\n${v}\n\n`;
                });
                folder.file('politique-ia.md', content);
              }
              break;
            }
            case 'classification': {
              const results = doc.data.results || doc.data;
              const exportData = Object.entries(results).map(([id, r]: [string, any]) => ({
                'Système': r.systemName || id, 'Niveau': r.riskLevel,
              }));
              const wb = XLSX.utils.book_new();
              const ws = XLSX.utils.json_to_sheet(exportData);
              XLSX.utils.book_append_sheet(wb, ws, 'Classification');
              const xlsxData = XLSX.write(wb, { type: 'array', bookType: 'xlsx' });
              folder.file('classification.xlsx', xlsxData);
              break;
            }
            default:
              folder.file(`${doc.id}.json`, JSON.stringify(doc.data, null, 2));
          }
        } catch (e) {
          console.error(`Error exporting ${doc.id}:`, e);
        }
        progress += progressPerDoc;
        setExportProgress(Math.round(progress));
      }

      setExportProgress(85);
      try {
        const { generateComplianceDossierPDF } = await import('@/lib/document-generator');
        const pdfBlob = await generateComplianceDossierPDF(documents, companyName, getCertificateUrl());
        const pdfArrayBuffer = await pdfBlob.arrayBuffer();
        folder.file('SYNTHESE-CONFORMITE.pdf', pdfArrayBuffer);
      } catch (e) {
        console.error('PDF failed:', e);
      }

      setExportProgress(95);
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `dossier-conformite-${companyName || 'entreprise'}-${new Date().toISOString().split('T')[0]}.zip`;
      a.click();
      URL.revokeObjectURL(url);

      setExportProgress(100);
    } catch (error) {
      console.error('Export error:', error);
      alert('Erreur lors de l\'export');
    } finally {
      setIsExporting(false);
    }
  };

  const exportAsPDF = async () => {
    setIsExporting(true);
    setExportProgress(0);
    setExportType('pdf');
    setShowExportModal(true);

    try {
      setExportProgress(30);
      const { generateComplianceDossierPDF, downloadBlob } = await import('@/lib/document-generator');
      setExportProgress(60);
      const pdfBlob = await generateComplianceDossierPDF(documents, companyName, getCertificateUrl());
      setExportProgress(90);
      downloadBlob(pdfBlob, `synthese-conformite-${companyName || 'entreprise'}.pdf`);
      setExportProgress(100);
    } catch (error) {
      console.error('PDF error:', error);
      alert('Erreur PDF');
    } finally {
      setIsExporting(false);
    }
  };

  const getStatusColor = (doc: DocumentStatus) => {
    if (!doc.isComplete) return '#6B7280';
    if (doc.completionPercent >= 100) return '#22C55E';
    if (doc.completionPercent >= 50) return '#EAB308';
    return '#F97316';
  };

  const renderDocumentCard = (doc: DocumentStatus) => (
    <motion.div
      key={doc.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white/5 rounded-xl border p-4 cursor-pointer transition-all hover:bg-white/10 ${doc.isComplete ? 'border-white/20' : 'border-white/10'}`}
      onClick={() => setSelectedDoc(doc)}
    >
      <div className="flex items-start gap-3">
        <div className="text-3xl">{doc.icon}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-medium truncate">{doc.name}</h3>
            {doc.aiActRef && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-white/60">{doc.aiActRef}</span>
            )}
          </div>
          <p className="text-xs text-white/50 mt-1 line-clamp-2">{doc.description}</p>
          <div className="mt-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] text-white/40">{doc.isComplete ? 'Complété' : 'Non commencé'}</span>
              <span className="text-xs font-medium" style={{ color: getStatusColor(doc) }}>{doc.completionPercent}%</span>
            </div>
            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all" style={{ width: `${doc.completionPercent}%`, backgroundColor: getStatusColor(doc) }} />
            </div>
          </div>
        </div>
        <div className="flex-shrink-0">
          {doc.isComplete ? (
            <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
              <span className="text-green-400">✓</span>
            </div>
          ) : (
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
              <span className="text-white/40">○</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-[#0a0a15] text-white p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-3 mb-2">
            <span className="text-4xl">📁</span>
            Dossier de Conformité AI Act
          </h1>
          <p className="text-white/60">Tous vos documents prêts pour l'audit</p>
        </div>

        {/* Company Name */}
        <div className="mb-6 p-4 bg-white/5 rounded-xl border border-white/10">
          <div className="flex items-center gap-4">
            <span className="text-2xl">🏢</span>
            <div className="flex-1">
              <label className="text-xs text-white/40 block mb-1">Entreprise</label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Nom de votre entreprise"
                className="w-full bg-transparent border-b border-white/20 pb-1 focus:border-[#00F5FF] focus:outline-none text-lg"
              />
            </div>
            <div className="text-right">
              <label className="text-xs text-white/40 block mb-1">Code vérification</label>
              <span className="text-sm font-mono text-[#00F5FF]">{certificateCode}</span>
            </div>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-8 p-6 rounded-2xl border border-white/10" style={{ backgroundColor: `${moduleColor}10` }}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold">Progression globale</h2>
              <p className="text-white/60 text-sm">Documents essentiels</p>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold" style={{ color: moduleColor }}>{overallProgress}%</div>
              <div className="text-sm text-white/60">{completedEssential}/{essentialDocs.length}</div>
            </div>
          </div>
          <div className="h-3 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${overallProgress}%` }}
              className="h-full rounded-full"
              style={{ backgroundColor: moduleColor }}
            />
          </div>
          {overallProgress >= 100 && (
            <div className="mt-4 p-3 bg-green-500/20 rounded-lg border border-green-500/30 flex items-center gap-2">
              <span className="text-2xl">🎉</span>
              <span className="text-green-400 font-medium">Tous vos documents sont prêts !</span>
            </div>
          )}
        </div>

        {/* Download Buttons */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={exportCompleteDossierZip}
            disabled={isExporting || completedEssential === 0}
            className="py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 disabled:opacity-50"
            style={{ backgroundColor: moduleColor, color: '#000' }}
          >
            {isExporting && exportType === 'zip' ? '⏳ Préparation...' : '📦 Télécharger le dossier (.zip)'}
          </button>
          <button
            onClick={exportAsPDF}
            disabled={isExporting || completedEssential === 0}
            className="py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 disabled:opacity-50 bg-white/10 hover:bg-white/20"
          >
            {isExporting && exportType === 'pdf' ? '⏳ Génération...' : '📄 Synthèse PDF + QR Code'}
          </button>
        </div>

        <p className="text-center text-xs text-white/40 mb-8">🔐 Chaque document inclut un QR code de vérification</p>

        {/* Essential Documents */}
        <div className="mb-8">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <span>🔴</span> Documents Essentiels
            <span className="text-xs font-normal text-white/40 ml-2">Requis AI Act</span>
          </h2>
          <div className="grid gap-3">{documents.filter(d => d.category === 'essential').map(renderDocumentCard)}</div>
        </div>

        {/* Recommended */}
        <div className="mb-8">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><span>🟡</span> Recommandés</h2>
          <div className="grid gap-3">{documents.filter(d => d.category === 'recommended').map(renderDocumentCard)}</div>
        </div>

        {/* Optional */}
        <div className="mb-8">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><span>🟢</span> Optionnels</h2>
          <div className="grid gap-3">{documents.filter(d => d.category === 'optional').map(renderDocumentCard)}</div>
        </div>

        <div className="text-center text-white/40 text-sm">
          <p>Généré via formation-ia-act.fr</p>
        </div>
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedDoc && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedDoc(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-[#1a1a2e] rounded-2xl p-6 max-w-lg w-full border border-white/10"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start gap-4 mb-6">
                <div className="text-5xl">{selectedDoc.icon}</div>
                <div>
                  <h3 className="text-xl font-bold">{selectedDoc.name}</h3>
                  <p className="text-white/60 text-sm mt-1">{selectedDoc.description}</p>
                  {selectedDoc.aiActRef && (
                    <span className="inline-block mt-2 text-xs px-2 py-1 rounded bg-white/10">📋 {selectedDoc.aiActRef}</span>
                  )}
                </div>
              </div>

              <div className="mb-4 flex items-center gap-2">
                <span className="text-xs text-white/40">Format :</span>
                <span className="text-xs px-2 py-1 rounded bg-white/10 font-mono">.{selectedDoc.exportFormat}</span>
                {selectedDoc.exportFormat === 'docx' && <span className="text-xs text-green-400">✨ Word + QR</span>}
              </div>

              <div className="mb-6 p-4 rounded-xl bg-white/5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-white/60">Statut</span>
                  <span className="font-medium" style={{ color: getStatusColor(selectedDoc) }}>
                    {selectedDoc.isComplete ? `${selectedDoc.completionPercent}%` : 'Non commencé'}
                  </span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${selectedDoc.completionPercent}%`, backgroundColor: getStatusColor(selectedDoc) }} />
                </div>
              </div>

              <div className="flex gap-3">
                {selectedDoc.isComplete ? (
                  <>
                    <button
                      onClick={() => { exportDocument(selectedDoc); setSelectedDoc(null); }}
                      className="flex-1 py-3 rounded-xl font-bold text-black"
                      style={{ backgroundColor: moduleColor }}
                    >
                      📥 Télécharger
                    </button>
                    <button
                      onClick={() => { onNavigateToWorkshop?.(selectedDoc.workshopId); setSelectedDoc(null); }}
                      className="flex-1 py-3 rounded-xl font-medium bg-white/10 hover:bg-white/20"
                    >
                      ✏️ Modifier
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => { onNavigateToWorkshop?.(selectedDoc.workshopId); setSelectedDoc(null); }}
                    className="flex-1 py-3 rounded-xl font-bold text-black"
                    style={{ backgroundColor: moduleColor }}
                  >
                    🚀 Commencer
                  </button>
                )}
              </div>
              <button onClick={() => setSelectedDoc(null)} className="w-full mt-3 py-2 text-white/40 hover:text-white text-sm">Fermer</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Export Modal */}
      <AnimatePresence>
        {showExportModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-[#1a1a2e] rounded-2xl p-8 max-w-md w-full border border-white/10 text-center"
            >
              {exportProgress < 100 ? (
                <>
                  <div className="text-5xl mb-4 animate-bounce">{exportType === 'pdf' ? '📄' : '📦'}</div>
                  <h3 className="text-xl font-bold mb-2">
                    {exportType === 'pdf' ? 'Génération PDF...' : 'Préparation du dossier...'}
                  </h3>
                  <p className="text-white/60 text-sm mb-6">Création avec QR code de vérification</p>
                  <div className="h-3 bg-white/10 rounded-full overflow-hidden mb-2">
                    <motion.div className="h-full rounded-full" style={{ backgroundColor: moduleColor }} animate={{ width: `${exportProgress}%` }} />
                  </div>
                  <p className="text-sm text-white/40">{exportProgress}%</p>
                </>
              ) : (
                <>
                  <div className="text-5xl mb-4">✅</div>
                  <h3 className="text-xl font-bold mb-2">{exportType === 'pdf' ? 'PDF généré !' : 'Dossier téléchargé !'}</h3>
                  <div className="mb-6 p-3 bg-white/5 rounded-lg">
                    <p className="text-xs text-white/60 mb-2">🔐 Code de vérification :</p>
                    <p className="font-mono text-sm text-[#00F5FF]">{certificateCode}</p>
                  </div>
                  <button onClick={() => setShowExportModal(false)} className="px-6 py-3 rounded-xl font-bold text-black w-full" style={{ backgroundColor: moduleColor }}>
                    Parfait !
                  </button>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
