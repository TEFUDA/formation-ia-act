'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ============================================
// TYPES
// ============================================
interface CheckItem {
  id: string;
  category: string;
  question: string;
  help?: string;
  risk: 'high' | 'medium' | 'low';
  answer?: 'yes' | 'no' | 'unknown';
}

interface DiagnosticResult {
  score: number;
  level: 'critical' | 'warning' | 'ok';
  message: string;
  recommendations: string[];
}

// ============================================
// CHECKLIST DATA
// ============================================
const CHECKLIST_ITEMS: CheckItem[] = [
  // Catégorie 1: Utilisation actuelle
  {
    id: '1-1',
    category: 'Utilisation actuelle',
    question: "Votre entreprise utilise-t-elle des outils d'IA (ChatGPT, Copilot, outils métier avec IA...) ?",
    help: "Incluez les outils gratuits utilisés par les employés",
    risk: 'high'
  },
  {
    id: '1-2',
    category: 'Utilisation actuelle',
    question: "Avez-vous un inventaire de tous les systèmes d'IA utilisés ?",
    risk: 'high'
  },
  {
    id: '1-3',
    category: 'Utilisation actuelle',
    question: "Vos fournisseurs vous ont-ils informé des fonctionnalités IA dans leurs produits ?",
    risk: 'medium'
  },
  
  // Catégorie 2: RH et Recrutement
  {
    id: '2-1',
    category: 'RH et Recrutement',
    question: "Utilisez-vous un outil de tri automatique de CV ?",
    help: "LinkedIn Recruiter, Indeed, Workday, etc.",
    risk: 'high'
  },
  {
    id: '2-2',
    category: 'RH et Recrutement',
    question: "Avez-vous des outils d'évaluation de performance basés sur l'IA ?",
    risk: 'high'
  },
  {
    id: '2-3',
    category: 'RH et Recrutement',
    question: "Utilisez-vous l'IA pour la planification des effectifs ou la prédiction de turnover ?",
    risk: 'medium'
  },

  // Catégorie 3: Reconnaissance biométrique
  {
    id: '3-1',
    category: 'Biométrie',
    question: "Avez-vous un système de reconnaissance faciale (accès, pointage...) ?",
    risk: 'high'
  },
  {
    id: '3-2',
    category: 'Biométrie',
    question: "Utilisez-vous la reconnaissance vocale ou d'empreintes ?",
    risk: 'high'
  },
  {
    id: '3-3',
    category: 'Biométrie',
    question: "Avez-vous des caméras avec analyse comportementale ?",
    help: "Détection de mouvements suspects, comptage de personnes, etc.",
    risk: 'high'
  },

  // Catégorie 4: Relation client
  {
    id: '4-1',
    category: 'Relation Client',
    question: "Utilisez-vous un chatbot ou assistant virtuel ?",
    risk: 'medium'
  },
  {
    id: '4-2',
    category: 'Relation Client',
    question: "Avez-vous un système de recommandation de produits/contenus ?",
    risk: 'low'
  },
  {
    id: '4-3',
    category: 'Relation Client',
    question: "Utilisez-vous l'IA pour le scoring client ou la segmentation ?",
    risk: 'medium'
  },

  // Catégorie 5: Finance et Risques
  {
    id: '5-1',
    category: 'Finance',
    question: "Utilisez-vous l'IA pour la détection de fraude ?",
    risk: 'medium'
  },
  {
    id: '5-2',
    category: 'Finance',
    question: "Avez-vous des outils de scoring crédit automatisé ?",
    risk: 'high'
  },
  {
    id: '5-3',
    category: 'Finance',
    question: "Utilisez-vous l'IA pour des décisions d'assurance ou de tarification ?",
    risk: 'high'
  },

  // Catégorie 6: Conformité actuelle
  {
    id: '6-1',
    category: 'Conformité',
    question: "Avez-vous désigné un responsable AI Act dans votre organisation ?",
    risk: 'high'
  },
  {
    id: '6-2',
    category: 'Conformité',
    question: "Vos équipes ont-elles été formées à l'utilisation responsable de l'IA ?",
    help: "Obligation Article 4 depuis février 2025",
    risk: 'high'
  },
  {
    id: '6-3',
    category: 'Conformité',
    question: "Avez-vous une politique d'utilisation de l'IA dans votre entreprise ?",
    risk: 'high'
  },
  {
    id: '6-4',
    category: 'Conformité',
    question: "Vos mentions légales incluent-elles les informations sur l'IA ?",
    help: "Obligation Article 50",
    risk: 'medium'
  }
];

// ============================================
// ICONS
// ============================================
const Icons = {
  Check: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-full h-full"><polyline points="20 6 9 17 4 12"/></svg>,
  X: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  HelpCircle: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  Download: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
  AlertTriangle: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  ChevronDown: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><polyline points="6 9 12 15 18 9"/></svg>,
};

// ============================================
// CALCULATE RESULT
// ============================================
const calculateResult = (items: CheckItem[]): DiagnosticResult => {
  const answered = items.filter(i => i.answer !== undefined);
  if (answered.length === 0) {
    return {
      score: 0,
      level: 'ok',
      message: "Commencez le diagnostic pour évaluer votre situation.",
      recommendations: []
    };
  }

  let riskScore = 0;
  const recommendations: string[] = [];

  items.forEach(item => {
    if (item.answer === 'yes' && (item.risk === 'high' || item.risk === 'medium')) {
      riskScore += item.risk === 'high' ? 10 : 5;
    }
    if (item.answer === 'no' && item.category === 'Conformité') {
      riskScore += item.risk === 'high' ? 15 : 8;
      recommendations.push(`Action requise : ${item.question.replace('Avez-vous', 'Mettre en place').replace('?', '')}`);
    }
    if (item.answer === 'unknown') {
      riskScore += 3;
    }
  });

  // Normalize score 0-100
  const maxScore = items.length * 15;
  const normalizedScore = Math.round((riskScore / maxScore) * 100);

  let level: 'critical' | 'warning' | 'ok';
  let message: string;

  if (normalizedScore >= 60) {
    level = 'critical';
    message = "🚨 ALERTE CRITIQUE - Votre entreprise présente des risques majeurs de non-conformité AI Act. Action immédiate requise.";
  } else if (normalizedScore >= 30) {
    level = 'warning';
    message = "⚠️ ATTENTION - Plusieurs points nécessitent une mise en conformité avant août 2026. Continuez la formation.";
  } else {
    level = 'ok';
    message = "✅ BONNE BASE - Votre situation initiale est correcte, mais restez vigilant et complétez la formation.";
  }

  return {
    score: normalizedScore,
    level,
    message,
    recommendations: recommendations.slice(0, 5)
  };
};

// ============================================
// MAIN COMPONENT
// ============================================
export default function DiagnosticChecklist({
  onComplete,
  moduleColor = '#FF4444'
}: {
  onComplete?: (result: DiagnosticResult) => void;
  moduleColor?: string;
}) {
  const [items, setItems] = useState<CheckItem[]>(CHECKLIST_ITEMS);
  const [expandedCategory, setExpandedCategory] = useState<string | null>('Utilisation actuelle');
  const [showHelp, setShowHelp] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);

  // Group by category
  const categories = Array.from(new Set(items.map(i => i.category)));
  
  // Calculate progress
  const answeredCount = items.filter(i => i.answer !== undefined).length;
  const progress = Math.round((answeredCount / items.length) * 100);
  
  // Calculate result
  const result = calculateResult(items);

  // Answer a question
  const setAnswer = (id: string, answer: 'yes' | 'no' | 'unknown') => {
    setItems(items.map(i => i.id === id ? { ...i, answer } : i));
  };

  // Export to CSV
  const exportCSV = () => {
    const rows = [
      ['Catégorie', 'Question', 'Réponse', 'Niveau de risque'],
      ...items.map(i => [
        i.category,
        i.question,
        i.answer === 'yes' ? 'Oui' : i.answer === 'no' ? 'Non' : i.answer === 'unknown' ? 'Ne sais pas' : 'Non répondu',
        i.risk === 'high' ? 'Élevé' : i.risk === 'medium' ? 'Moyen' : 'Faible'
      ])
    ];
    
    const csv = rows.map(r => r.map(c => `"${c}"`).join(';')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `diagnostic-ai-act-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  // Complete exercise
  const handleComplete = () => {
    setShowResults(true);
    if (onComplete) {
      onComplete(result);
    }
  };

  return (
    <div className="min-h-[600px]">
      <AnimatePresence mode="wait">
        {!showResults ? (
          <motion.div
            key="checklist"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Header */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">🔍 Diagnostic Express AI Act</h2>
              <p className="text-white/60">
                Répondez à ces {items.length} questions pour évaluer votre niveau de risque.
              </p>
            </div>

            {/* Progress */}
            <div className="bg-white/5 rounded-xl p-4 mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white/60 text-sm">Progression</span>
                <span className="text-white font-bold">{answeredCount}/{items.length}</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: moduleColor }}
                  animate={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Categories */}
            <div className="space-y-4 mb-6">
              {categories.map((category) => {
                const categoryItems = items.filter(i => i.category === category);
                const categoryAnswered = categoryItems.filter(i => i.answer !== undefined).length;
                const isExpanded = expandedCategory === category;

                return (
                  <div key={category} className="bg-white/5 rounded-xl overflow-hidden">
                    {/* Category Header */}
                    <button
                      onClick={() => setExpandedCategory(isExpanded ? null : category)}
                      className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">
                          {category === 'Utilisation actuelle' && '📊'}
                          {category === 'RH et Recrutement' && '👥'}
                          {category === 'Biométrie' && '🔐'}
                          {category === 'Relation Client' && '💬'}
                          {category === 'Finance' && '💰'}
                          {category === 'Conformité' && '⚖️'}
                        </span>
                        <span className="font-medium">{category}</span>
                        <span className="text-sm text-white/40">
                          ({categoryAnswered}/{categoryItems.length})
                        </span>
                      </div>
                      <div 
                        className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                      >
                        <Icons.ChevronDown />
                      </div>
                    </button>

                    {/* Questions */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: 'auto' }}
                          exit={{ height: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="px-4 pb-4 space-y-3">
                            {categoryItems.map((item) => (
                              <div 
                                key={item.id}
                                className="bg-black/20 rounded-xl p-4"
                              >
                                <div className="flex items-start gap-3 mb-3">
                                  <div 
                                    className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                                      item.risk === 'high' ? 'bg-red-500' :
                                      item.risk === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                                    }`}
                                  />
                                  <div className="flex-1">
                                    <p className="text-sm">{item.question}</p>
                                    {item.help && (
                                      <button
                                        onClick={() => setShowHelp(showHelp === item.id ? null : item.id)}
                                        className="text-xs text-white/40 hover:text-white/60 flex items-center gap-1 mt-1"
                                      >
                                        <div className="w-3 h-3"><Icons.HelpCircle /></div>
                                        Aide
                                      </button>
                                    )}
                                    <AnimatePresence>
                                      {showHelp === item.id && item.help && (
                                        <motion.p
                                          initial={{ opacity: 0, height: 0 }}
                                          animate={{ opacity: 1, height: 'auto' }}
                                          exit={{ opacity: 0, height: 0 }}
                                          className="text-xs text-cyan-400 mt-2 bg-cyan-500/10 rounded-lg p-2"
                                        >
                                          💡 {item.help}
                                        </motion.p>
                                      )}
                                    </AnimatePresence>
                                  </div>
                                </div>

                                {/* Answer buttons */}
                                <div className="flex gap-2">
                                  {[
                                    { value: 'yes', label: 'Oui', color: '#FF6B6B' },
                                    { value: 'no', label: 'Non', color: '#00FF88' },
                                    { value: 'unknown', label: '?', color: '#FFB800' }
                                  ].map(({ value, label, color }) => (
                                    <button
                                      key={value}
                                      onClick={() => setAnswer(item.id, value as 'yes' | 'no' | 'unknown')}
                                      className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                                        item.answer === value
                                          ? 'text-black'
                                          : 'bg-white/5 hover:bg-white/10 text-white/70'
                                      }`}
                                      style={item.answer === value ? { backgroundColor: color } : {}}
                                    >
                                      {label}
                                    </button>
                                  ))}
                                </div>
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

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={exportCSV}
                disabled={answeredCount === 0}
                className="flex-1 py-4 rounded-xl bg-white/10 hover:bg-white/20 font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
              >
                <div className="w-5 h-5"><Icons.Download /></div>
                Exporter
              </button>
              
              <button
                onClick={handleComplete}
                disabled={answeredCount < items.length * 0.8}
                className="flex-1 py-4 rounded-xl font-semibold text-black disabled:opacity-50 transition-all"
                style={{ backgroundColor: moduleColor }}
              >
                {answeredCount < items.length * 0.8
                  ? `Encore ${Math.ceil(items.length * 0.8) - answeredCount} réponses`
                  : 'Voir mon diagnostic'}
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="results"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            {/* Score */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.2 }}
              className={`w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-6 ${
                result.level === 'critical' ? 'bg-red-500' :
                result.level === 'warning' ? 'bg-yellow-500' : 'bg-green-500'
              }`}
            >
              <div className="text-center">
                <div className="text-4xl font-black text-black">{result.score}%</div>
                <div className="text-xs text-black/60">risque</div>
              </div>
            </motion.div>

            <h2 className="text-2xl font-bold mb-4">
              {result.level === 'critical' && '🚨 Situation Critique'}
              {result.level === 'warning' && '⚠️ Points d\'Attention'}
              {result.level === 'ok' && '✅ Bonne Base'}
            </h2>

            <p className="text-white/70 mb-8 max-w-lg mx-auto">
              {result.message}
            </p>

            {/* Recommendations */}
            {result.recommendations.length > 0 && (
              <div className="bg-white/5 rounded-xl p-6 text-left mb-8 max-w-lg mx-auto">
                <h4 className="font-semibold mb-4 flex items-center gap-2">
                  <div className="w-5 h-5 text-yellow-400"><Icons.AlertTriangle /></div>
                  Actions prioritaires
                </h4>
                <ul className="space-y-2">
                  {result.recommendations.map((rec, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-white/70">
                      <span className="text-red-400">•</span>
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-8 max-w-lg mx-auto">
              <div className="bg-white/5 rounded-xl p-4">
                <div className="text-2xl font-bold text-red-400">
                  {items.filter(i => i.answer === 'yes' && i.risk === 'high').length}
                </div>
                <p className="text-xs text-white/40">Risques élevés</p>
              </div>
              <div className="bg-white/5 rounded-xl p-4">
                <div className="text-2xl font-bold text-yellow-400">
                  {items.filter(i => i.answer === 'unknown').length}
                </div>
                <p className="text-xs text-white/40">À vérifier</p>
              </div>
              <div className="bg-white/5 rounded-xl p-4">
                <div className="text-2xl font-bold text-green-400">
                  {items.filter(i => i.answer === 'no' || (i.answer === 'yes' && i.risk === 'low')).length}
                </div>
                <p className="text-xs text-white/40">OK</p>
              </div>
            </div>

            <button
              onClick={() => onComplete?.(result)}
              className="px-12 py-4 rounded-xl font-semibold text-black"
              style={{ backgroundColor: moduleColor }}
            >
              Continuer la formation →
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
