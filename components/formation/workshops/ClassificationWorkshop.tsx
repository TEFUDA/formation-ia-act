'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ============================================
// TYPES
// ============================================
interface ClassificationResult {
  systemId: string;
  systemName: string;
  riskLevel: 'prohibited' | 'high' | 'limited' | 'minimal' | 'gpai';
  reasons: string[];
  obligations: string[];
  deadline: string;
  classifiedAt: string;
}

interface RegistrySystem {
  id: string;
  name: string;
  vendor: string;
  department: string;
  purpose: string;
  dataTypes: string[];
}

// ============================================
// CLASSIFICATION DECISION TREE
// ============================================
const CLASSIFICATION_QUESTIONS = [
  {
    id: 'q1',
    question: 'Ce système utilise-t-il des techniques subliminales pour manipuler le comportement des utilisateurs ?',
    helpText: 'Manipulation au-delà de la conscience des personnes pour influencer leurs décisions',
    yesPath: { result: 'prohibited', reason: 'Manipulation subliminale (Art. 5.1.a)' },
    noPath: 'q2',
  },
  {
    id: 'q2',
    question: 'Ce système exploite-t-il les vulnérabilités de groupes spécifiques (âge, handicap, situation sociale) ?',
    helpText: 'Ciblage de personnes vulnérables pour influencer leur comportement de manière préjudiciable',
    yesPath: { result: 'prohibited', reason: 'Exploitation de vulnérabilités (Art. 5.1.b)' },
    noPath: 'q3',
  },
  {
    id: 'q3',
    question: 'Ce système est-il utilisé pour du "scoring social" par des autorités publiques ?',
    helpText: 'Notation des citoyens basée sur leur comportement social ou leurs caractéristiques personnelles',
    yesPath: { result: 'prohibited', reason: 'Scoring social (Art. 5.1.c)' },
    noPath: 'q4',
  },
  {
    id: 'q4',
    question: 'Ce système utilise-t-il l\'identification biométrique en temps réel dans l\'espace public ?',
    helpText: 'Reconnaissance faciale ou biométrique en direct dans des lieux publics',
    yesPath: { result: 'prohibited', reason: 'Identification biométrique temps réel (Art. 5.1.d)' },
    noPath: 'q5',
  },
  {
    id: 'q5',
    question: 'Ce système est-il utilisé pour le recrutement, la sélection ou l\'évaluation de candidats ?',
    helpText: 'Tri de CV, matching CV-poste, évaluation de candidatures, entretiens automatisés',
    yesPath: { result: 'high', reason: 'Emploi - Recrutement (Annexe III, 4.a)' },
    noPath: 'q6',
  },
  {
    id: 'q6',
    question: 'Ce système prend-il des décisions affectant les conditions de travail ou les employés ?',
    helpText: 'Promotion, licenciement, allocation des tâches, surveillance, évaluation des performances',
    yesPath: { result: 'high', reason: 'Emploi - Gestion des travailleurs (Annexe III, 4.b)' },
    noPath: 'q7',
  },
  {
    id: 'q7',
    question: 'Ce système est-il utilisé pour évaluer la solvabilité ou le scoring crédit ?',
    helpText: 'Décisions d\'octroi de crédit, évaluation du risque financier des personnes',
    yesPath: { result: 'high', reason: 'Services financiers - Crédit (Annexe III, 5.b)' },
    noPath: 'q8',
  },
  {
    id: 'q8',
    question: 'Ce système est-il utilisé pour la tarification ou l\'évaluation des risques en assurance ?',
    helpText: 'Assurance vie, santé, détermination des primes basée sur le profil',
    yesPath: { result: 'high', reason: 'Services financiers - Assurance (Annexe III, 5.a)' },
    noPath: 'q9',
  },
  {
    id: 'q9',
    question: 'Ce système est-il un dispositif médical ou influence-t-il des décisions médicales ?',
    helpText: 'Diagnostic, traitement, aide à la décision clinique',
    yesPath: { result: 'high', reason: 'Dispositif médical (Annexe III, 1)' },
    noPath: 'q10',
  },
  {
    id: 'q10',
    question: 'Ce système gère-t-il des infrastructures critiques (énergie, eau, transport) ?',
    helpText: 'Gestion du trafic, réseaux d\'énergie, approvisionnement en eau',
    yesPath: { result: 'high', reason: 'Infrastructure critique (Annexe III, 2)' },
    noPath: 'q11',
  },
  {
    id: 'q11',
    question: 'Ce système est-il utilisé dans l\'éducation pour l\'accès ou l\'évaluation ?',
    helpText: 'Admission, notation, surveillance d\'examens, orientation',
    yesPath: { result: 'high', reason: 'Éducation et formation (Annexe III, 3)' },
    noPath: 'q12',
  },
  {
    id: 'q12',
    question: 'Ce système est-il utilisé par les forces de l\'ordre ou la justice ?',
    helpText: 'Évaluation des risques, profilage, analyse de preuves, prédiction d\'infractions',
    yesPath: { result: 'high', reason: 'Application de la loi (Annexe III, 6-7)' },
    noPath: 'q13',
  },
  {
    id: 'q13',
    question: 'Ce système est-il utilisé pour la gestion des migrations ou des contrôles aux frontières ?',
    helpText: 'Vérification de documents, évaluation des demandes d\'asile, détection de risques',
    yesPath: { result: 'high', reason: 'Migration et frontières (Annexe III, 8)' },
    noPath: 'q14',
  },
  {
    id: 'q14',
    question: 'Ce système génère-t-il du contenu (texte, images, audio, vidéo) de manière autonome ?',
    helpText: 'ChatGPT, DALL-E, Midjourney, assistants IA génératifs',
    yesPath: 'q15',
    noPath: 'q16',
  },
  {
    id: 'q15',
    question: 'Ce système est-il un modèle de fondation / IA à usage général (GPAI) ?',
    helpText: 'Modèles entraînés sur de grandes quantités de données pour des usages variés',
    yesPath: { result: 'gpai', reason: 'IA à usage général (GPAI) - Chapitre V' },
    noPath: { result: 'limited', reason: 'IA générative - Obligations de transparence' },
  },
  {
    id: 'q16',
    question: 'Ce système interagit-il directement avec des personnes (chatbot, assistant virtuel) ?',
    helpText: 'Les utilisateurs doivent être informés qu\'ils interagissent avec une IA',
    yesPath: { result: 'limited', reason: 'Interaction homme-machine - Transparence (Art. 52)' },
    noPath: 'q17',
  },
  {
    id: 'q17',
    question: 'Ce système effectue-t-il de la reconnaissance d\'émotions ou de la catégorisation biométrique ?',
    helpText: 'Analyse des émotions, catégorisation par caractéristiques physiques ou comportementales',
    yesPath: { result: 'limited', reason: 'Reconnaissance émotions / Catégorisation biométrique (Art. 52)' },
    noPath: 'q18',
  },
  {
    id: 'q18',
    question: 'Ce système génère-t-il ou manipule-t-il des images/vidéos/sons ressemblant à des personnes réelles ?',
    helpText: 'Deepfakes, synthèse vocale, avatars réalistes',
    yesPath: { result: 'limited', reason: 'Contenu synthétique / Deepfakes (Art. 52)' },
    noPath: { result: 'minimal', reason: 'Aucune catégorie à risque identifiée' },
  },
];

const OBLIGATIONS_BY_LEVEL = {
  prohibited: [
    '🚫 Utilisation INTERDITE',
    '⏰ Mise en conformité immédiate requise',
    '⚠️ Sanctions jusqu\'à 35M€ ou 7% CA mondial',
  ],
  high: [
    '📋 Système de gestion des risques',
    '📊 Gestion des données et gouvernance',
    '📄 Documentation technique complète',
    '🔍 Enregistrement des activités (logs)',
    '📢 Transparence et information des utilisateurs',
    '👁️ Supervision humaine',
    '🎯 Exactitude, robustesse, cybersécurité',
    '✅ Évaluation de conformité',
    '🏷️ Marquage CE',
    '📝 Déclaration de conformité UE',
  ],
  limited: [
    '📢 Informer que l\'utilisateur interagit avec une IA',
    '🏷️ Identifier le contenu généré par IA',
    '📋 Documentation des capacités et limitations',
  ],
  minimal: [
    '✅ Aucune obligation spécifique',
    '📚 Bonnes pratiques recommandées',
    '📋 Code de conduite volontaire',
  ],
  gpai: [
    '📄 Documentation technique',
    '📋 Politique de respect du droit d\'auteur',
    '📊 Résumé des données d\'entraînement',
    '🔬 Si risque systémique: évaluation du modèle',
    '⚠️ Si risque systémique: tests adverses',
    '🛡️ Si risque systémique: mesures d\'atténuation',
  ],
};

const DEADLINES = {
  prohibited: 'Février 2025',
  high: 'Août 2026',
  limited: 'Août 2025',
  minimal: 'Pas d\'échéance',
  gpai: 'Août 2025',
};

// ============================================
// COMPONENT
// ============================================
interface ClassificationWorkshopProps {
  moduleColor: string;
  onComplete: () => void;
}

export default function ClassificationWorkshop({ moduleColor, onComplete }: ClassificationWorkshopProps) {
  const [systems, setSystems] = useState<RegistrySystem[]>([]);
  const [results, setResults] = useState<ClassificationResult[]>([]);
  const [currentSystem, setCurrentSystem] = useState<RegistrySystem | null>(null);
  const [currentQuestionId, setCurrentQuestionId] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, boolean>>({});
  const [classificationReasons, setClassificationReasons] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'classify' | 'summary'>('list');

  // Load systems from registry
  useEffect(() => {
    const savedRegistry = localStorage.getItem('workshop_ai_registry');
    const savedInventory = localStorage.getItem('workshop_ai_inventory');
    
    if (savedRegistry) {
      try {
        const registry = JSON.parse(savedRegistry);
        setSystems(registry);
      } catch (e) {
        console.error('Error loading registry:', e);
      }
    } else if (savedInventory) {
      try {
        const inventory = JSON.parse(savedInventory);
        setSystems(inventory);
      } catch (e) {
        console.error('Error loading inventory:', e);
      }
    }

    // Load existing results
    const savedResults = localStorage.getItem('workshop_classification_results');
    if (savedResults) {
      try {
        setResults(JSON.parse(savedResults));
      } catch (e) {
        console.error('Error loading results:', e);
      }
    }
  }, []);

  // Save results
  useEffect(() => {
    if (results.length > 0) {
      localStorage.setItem('workshop_classification_results', JSON.stringify(results));
      
      // Also update registry with classifications
      const savedRegistry = localStorage.getItem('workshop_ai_registry');
      if (savedRegistry) {
        try {
          const registry = JSON.parse(savedRegistry);
          const updatedRegistry = registry.map((entry: any) => {
            const result = results.find(r => r.systemId === entry.id);
            if (result) {
              return { ...entry, riskCategory: result.riskLevel };
            }
            return entry;
          });
          localStorage.setItem('workshop_ai_registry', JSON.stringify(updatedRegistry));
        } catch (e) {
          console.error('Error updating registry:', e);
        }
      }
    }
  }, [results]);

  const startClassification = (system: RegistrySystem) => {
    setCurrentSystem(system);
    setCurrentQuestionId('q1');
    setAnswers({});
    setClassificationReasons([]);
    setShowResults(false);
    setViewMode('classify');
  };

  const handleAnswer = (questionId: string, answer: boolean) => {
    const question = CLASSIFICATION_QUESTIONS.find(q => q.id === questionId);
    if (!question) return;

    setAnswers({ ...answers, [questionId]: answer });

    const path = answer ? question.yesPath : question.noPath;

    if (typeof path === 'string') {
      // Go to next question
      setCurrentQuestionId(path);
    } else if (path.result) {
      // Got a result
      const newReasons = answer && question.yesPath && typeof question.yesPath !== 'string' 
        ? [...classificationReasons, path.reason]
        : classificationReasons;
      
      if (answer && path.reason) {
        setClassificationReasons([...newReasons]);
      }
      
      finishClassification(path.result as ClassificationResult['riskLevel'], [...newReasons, path.reason]);
    }
  };

  const finishClassification = (riskLevel: ClassificationResult['riskLevel'], reasons: string[]) => {
    if (!currentSystem) return;

    const newResult: ClassificationResult = {
      systemId: currentSystem.id,
      systemName: currentSystem.name,
      riskLevel,
      reasons: [...new Set(reasons.filter(Boolean))],
      obligations: OBLIGATIONS_BY_LEVEL[riskLevel],
      deadline: DEADLINES[riskLevel],
      classifiedAt: new Date().toISOString(),
    };

    // Update or add result
    const existingIdx = results.findIndex(r => r.systemId === currentSystem.id);
    if (existingIdx >= 0) {
      const updated = [...results];
      updated[existingIdx] = newResult;
      setResults(updated);
    } else {
      setResults([...results, newResult]);
    }

    setShowResults(true);
  };

  const getExistingResult = (systemId: string) => {
    return results.find(r => r.systemId === systemId);
  };

  const getRiskLevelConfig = (level: ClassificationResult['riskLevel']) => {
    const configs = {
      prohibited: { color: '#EF4444', label: 'INTERDIT', icon: '🚫', bg: 'bg-red-500/20' },
      high: { color: '#F97316', label: 'HAUT RISQUE', icon: '⚠️', bg: 'bg-orange-500/20' },
      limited: { color: '#EAB308', label: 'RISQUE LIMITÉ', icon: '📋', bg: 'bg-yellow-500/20' },
      minimal: { color: '#22C55E', label: 'RISQUE MINIMAL', icon: '✅', bg: 'bg-green-500/20' },
      gpai: { color: '#8B5CF6', label: 'GPAI', icon: '🤖', bg: 'bg-purple-500/20' },
    };
    return configs[level];
  };

  const currentQuestion = CLASSIFICATION_QUESTIONS.find(q => q.id === currentQuestionId);
  const classifiedCount = results.length;
  const totalCount = systems.length;

  // Classification Result View
  if (viewMode === 'classify' && showResults && currentSystem) {
    const result = results.find(r => r.systemId === currentSystem.id);
    if (!result) return null;

    const config = getRiskLevelConfig(result.riskLevel);

    return (
      <div className="space-y-6">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <div className="text-6xl mb-4">{config.icon}</div>
          <h2 className="text-2xl font-bold mb-2">{currentSystem.name}</h2>
          <div 
            className="inline-block px-4 py-2 rounded-full text-lg font-bold"
            style={{ backgroundColor: `${config.color}20`, color: config.color }}
          >
            {config.label}
          </div>
        </motion.div>

        {/* Reasons */}
        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <span>📋</span> Raisons de la classification
          </h3>
          <div className="space-y-2">
            {result.reasons.map((reason, idx) => (
              <div key={idx} className="flex items-start gap-2 text-sm">
                <div className="w-2 h-2 rounded-full mt-1.5" style={{ backgroundColor: config.color }} />
                <span>{reason}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Obligations */}
        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <span>📝</span> Obligations applicables
          </h3>
          <div className="space-y-2">
            {result.obligations.map((obligation, idx) => (
              <div key={idx} className="flex items-start gap-2 text-sm p-2 bg-white/5 rounded-lg">
                <span>{obligation}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Deadline */}
        <div 
          className="rounded-xl p-4 border-2"
          style={{ backgroundColor: `${config.color}10`, borderColor: config.color }}
        >
          <div className="flex items-center justify-between">
            <span className="font-medium">⏰ Échéance de mise en conformité</span>
            <span className="font-bold text-lg" style={{ color: config.color }}>{result.deadline}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={() => startClassification(currentSystem)}
            className="flex-1 py-3 rounded-xl bg-white/10 font-semibold text-sm hover:bg-white/20"
          >
            🔄 Reclassifier
          </button>
          <button
            onClick={() => { setViewMode('list'); setCurrentSystem(null); }}
            className="flex-1 py-3 rounded-xl font-bold text-black text-sm"
            style={{ backgroundColor: moduleColor }}
          >
            Continuer →
          </button>
        </div>
      </div>
    );
  }

  // Classification Questions View
  if (viewMode === 'classify' && currentQuestion && currentSystem) {
    const questionIndex = CLASSIFICATION_QUESTIONS.findIndex(q => q.id === currentQuestionId);
    const progress = (questionIndex / CLASSIFICATION_QUESTIONS.length) * 100;

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/40 text-xs">Classification de</p>
            <p className="font-bold">{currentSystem.name}</p>
          </div>
          <button
            onClick={() => { setViewMode('list'); setCurrentSystem(null); }}
            className="text-sm text-white/60 hover:text-white"
          >
            ✕ Annuler
          </button>
        </div>

        {/* Progress */}
        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: moduleColor }}
            animate={{ width: `${progress}%` }}
          />
        </div>

        {/* Question */}
        <motion.div
          key={currentQuestion.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white/5 rounded-xl p-6 border border-white/10"
        >
          <h3 className="text-lg font-semibold mb-3">{currentQuestion.question}</h3>
          {currentQuestion.helpText && (
            <p className="text-white/40 text-sm mb-6">{currentQuestion.helpText}</p>
          )}

          <div className="flex gap-4">
            <button
              onClick={() => handleAnswer(currentQuestion.id, true)}
              className="flex-1 py-4 rounded-xl bg-white/10 font-semibold text-sm hover:bg-white/20 transition-colors flex items-center justify-center gap-2"
            >
              <span className="text-xl">✅</span> Oui
            </button>
            <button
              onClick={() => handleAnswer(currentQuestion.id, false)}
              className="flex-1 py-4 rounded-xl bg-white/10 font-semibold text-sm hover:bg-white/20 transition-colors flex items-center justify-center gap-2"
            >
              <span className="text-xl">❌</span> Non
            </button>
          </div>
        </motion.div>

        {/* Accumulated reasons */}
        {classificationReasons.length > 0 && (
          <div className="bg-orange-500/10 rounded-xl p-3 border border-orange-500/20">
            <p className="text-xs text-orange-400 mb-2">Critères identifiés :</p>
            <div className="flex flex-wrap gap-2">
              {classificationReasons.map((reason, idx) => (
                <span key={idx} className="text-xs px-2 py-1 rounded bg-orange-500/20 text-orange-300">
                  {reason}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Summary View
  if (viewMode === 'summary') {
    const byLevel = {
      prohibited: results.filter(r => r.riskLevel === 'prohibited'),
      high: results.filter(r => r.riskLevel === 'high'),
      limited: results.filter(r => r.riskLevel === 'limited'),
      minimal: results.filter(r => r.riskLevel === 'minimal'),
      gpai: results.filter(r => r.riskLevel === 'gpai'),
    };

    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="text-5xl mb-4">📊</div>
          <h2 className="text-2xl font-bold mb-2">Récapitulatif des Classifications</h2>
          <p className="text-white/60">{classifiedCount}/{totalCount} systèmes classifiés</p>
        </div>

        {/* Distribution Chart */}
        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
          <div className="space-y-3">
            {(['prohibited', 'high', 'limited', 'minimal', 'gpai'] as const).map(level => {
              const config = getRiskLevelConfig(level);
              const count = byLevel[level].length;
              const percent = results.length > 0 ? (count / results.length) * 100 : 0;

              return (
                <div key={level} className="flex items-center gap-3">
                  <span className="w-6 text-center">{config.icon}</span>
                  <span className="w-28 text-sm" style={{ color: config.color }}>{config.label}</span>
                  <div className="flex-1 h-6 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full flex items-center justify-end pr-2 transition-all"
                      style={{ width: `${Math.max(percent, count > 0 ? 10 : 0)}%`, backgroundColor: config.color }}
                    >
                      {count > 0 && <span className="text-xs font-bold text-black">{count}</span>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* High Risk Alert */}
        {byLevel.high.length > 0 && (
          <div className="bg-orange-500/10 rounded-xl p-4 border border-orange-500/20">
            <h3 className="font-semibold mb-2 text-orange-400 flex items-center gap-2">
              <span>⚠️</span> {byLevel.high.length} système(s) à haut risque
            </h3>
            <p className="text-sm text-white/60 mb-3">
              Ces systèmes nécessitent une mise en conformité complète avant août 2026.
            </p>
            <div className="flex flex-wrap gap-2">
              {byLevel.high.map(r => (
                <span key={r.systemId} className="text-xs px-2 py-1 rounded bg-orange-500/20">
                  {r.systemName}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Prohibited Alert */}
        {byLevel.prohibited.length > 0 && (
          <div className="bg-red-500/10 rounded-xl p-4 border border-red-500/20">
            <h3 className="font-semibold mb-2 text-red-400 flex items-center gap-2">
              <span>🚫</span> {byLevel.prohibited.length} système(s) interdit(s)
            </h3>
            <p className="text-sm text-white/60 mb-3">
              ACTION IMMÉDIATE REQUISE - Ces systèmes doivent être arrêtés avant février 2025.
            </p>
            <div className="flex flex-wrap gap-2">
              {byLevel.prohibited.map(r => (
                <span key={r.systemId} className="text-xs px-2 py-1 rounded bg-red-500/20">
                  {r.systemName}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={() => setViewMode('list')}
            className="flex-1 py-3 rounded-xl bg-white/10 font-semibold text-sm hover:bg-white/20"
          >
            ← Retour à la liste
          </button>
          <button
            onClick={onComplete}
            className="flex-1 py-3 rounded-xl font-bold text-black text-sm"
            style={{ backgroundColor: moduleColor }}
          >
            Continuer la formation →
          </button>
        </div>

        {/* Download */}
        <div className="text-center">
          <a
            href="/resources/04-calculateur-classification.xlsx"
            download
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-sm transition-colors"
          >
            📥 Télécharger le calculateur Excel
          </a>
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
            <span>⚖️</span> Classification des Risques
          </h2>
          <p className="text-white/60 text-sm mt-1">
            Déterminez le niveau de risque de chaque système selon l'AI Act
          </p>
        </div>
        {classifiedCount > 0 && (
          <button
            onClick={() => setViewMode('summary')}
            className="px-4 py-2 rounded-lg text-sm font-medium"
            style={{ backgroundColor: `${moduleColor}20`, color: moduleColor }}
          >
            📊 Récapitulatif
          </button>
        )}
      </div>

      {/* Progress */}
      <div className="bg-white/5 rounded-xl p-4 border border-white/10">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-white/60">Progression</span>
          <span className="text-sm font-medium">{classifiedCount}/{totalCount} classifiés</span>
        </div>
        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
          <div 
            className="h-full rounded-full transition-all"
            style={{ width: `${totalCount > 0 ? (classifiedCount / totalCount) * 100 : 0}%`, backgroundColor: moduleColor }}
          />
        </div>
      </div>

      {/* Systems List */}
      {systems.length > 0 ? (
        <div className="space-y-2">
          {systems.map(system => {
            const existingResult = getExistingResult(system.id);
            const config = existingResult ? getRiskLevelConfig(existingResult.riskLevel) : null;

            return (
              <div
                key={system.id}
                className="bg-white/5 rounded-xl p-4 border border-white/10 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  {config ? (
                    <div 
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-xl"
                      style={{ backgroundColor: `${config.color}20` }}
                    >
                      {config.icon}
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                      <span className="text-white/40">❓</span>
                    </div>
                  )}
                  <div>
                    <p className="font-medium">{system.name}</p>
                    <p className="text-white/40 text-xs">{system.vendor || 'Fournisseur non spécifié'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {config && (
                    <span 
                      className="px-2 py-1 rounded-full text-xs font-medium"
                      style={{ backgroundColor: `${config.color}20`, color: config.color }}
                    >
                      {config.label}
                    </span>
                  )}
                  <button
                    onClick={() => startClassification(system)}
                    className="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
                    style={{ 
                      backgroundColor: existingResult ? 'rgba(255,255,255,0.1)' : moduleColor,
                      color: existingResult ? 'white' : 'black'
                    }}
                  >
                    {existingResult ? '🔄 Reclassifier' : '▶️ Classifier'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 bg-white/5 rounded-xl border border-dashed border-white/20">
          <div className="text-4xl mb-3">📋</div>
          <p className="text-white/60 text-sm mb-4">Aucun système à classifier</p>
          <p className="text-white/40 text-xs">
            Complétez d'abord l'inventaire (M2.2) ou le registre (M2.4)
          </p>
        </div>
      )}

      {/* Actions */}
      {classifiedCount > 0 && classifiedCount === totalCount && (
        <div className="flex gap-3 pt-4 border-t border-white/10">
          <button
            onClick={() => setViewMode('summary')}
            className="flex-1 py-3 rounded-xl font-bold text-black text-sm"
            style={{ backgroundColor: moduleColor }}
          >
            Voir le récapitulatif complet →
          </button>
        </div>
      )}
    </div>
  );
}
