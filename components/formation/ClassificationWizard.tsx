'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ============================================
// TYPES
// ============================================
interface AISystem {
  id: string;
  name: string;
  description: string;
  classification?: Classification;
  answers?: Record<string, string>;
}

interface Classification {
  level: 'minimal' | 'limited' | 'high' | 'prohibited';
  label: string;
  color: string;
  icon: string;
  explanation: string;
  actions: string[];
  articles: string[];
}

interface Question {
  id: string;
  question: string;
  help?: string;
  options: {
    id: string;
    text: string;
    points: Record<string, number>; // Points pour chaque niveau de risque
  }[];
}

// ============================================
// CLASSIFICATION QUESTIONS
// ============================================
const CLASSIFICATION_QUESTIONS: Question[] = [
  {
    id: 'q1',
    question: "Ce système utilise-t-il la reconnaissance biométrique (visage, empreintes, voix) ?",
    help: "Inclut l'identification, la vérification ou la catégorisation basée sur des données biométriques",
    options: [
      { id: 'yes', text: 'Oui', points: { high: 3, prohibited: 2 } },
      { id: 'no', text: 'Non', points: { minimal: 1 } },
      { id: 'unknown', text: 'Je ne sais pas', points: { high: 1 } }
    ]
  },
  {
    id: 'q2',
    question: "Ce système est-il utilisé pour le recrutement ou l'évaluation des employés ?",
    help: "Tri de CV, évaluation de performance, décisions de promotion, etc.",
    options: [
      { id: 'yes', text: 'Oui, il prend ou influence des décisions', points: { high: 4 } },
      { id: 'assist', text: 'Oui, mais en assistance seulement (humain décide)', points: { limited: 2 } },
      { id: 'no', text: 'Non', points: { minimal: 1 } }
    ]
  },
  {
    id: 'q3',
    question: "Ce système analyse-t-il les émotions des personnes ?",
    help: "Détection d'émotions via expressions faciales, voix, texte, comportement",
    options: [
      { id: 'work', text: 'Oui, au travail ou à l\'école', points: { prohibited: 5 } },
      { id: 'other', text: 'Oui, dans un autre contexte', points: { high: 2 } },
      { id: 'no', text: 'Non', points: { minimal: 1 } }
    ]
  },
  {
    id: 'q4',
    question: "Ce système est-il utilisé pour des décisions de crédit, assurance ou services essentiels ?",
    help: "Scoring crédit, tarification assurance, accès aux services publics essentiels",
    options: [
      { id: 'yes', text: 'Oui', points: { high: 4 } },
      { id: 'partial', text: 'Partiellement (aide à la décision)', points: { high: 2 } },
      { id: 'no', text: 'Non', points: { minimal: 1 } }
    ]
  },
  {
    id: 'q5',
    question: "Ce système interagit-il directement avec des utilisateurs ?",
    help: "Chatbot, assistant vocal, recommandations personnalisées, etc.",
    options: [
      { id: 'yes', text: 'Oui, sans qu\'ils sachent que c\'est une IA', points: { limited: 3 } },
      { id: 'transparent', text: 'Oui, mais c\'est clairement indiqué', points: { limited: 1 } },
      { id: 'no', text: 'Non, c\'est un outil interne', points: { minimal: 1 } }
    ]
  },
  {
    id: 'q6',
    question: "Ce système génère-t-il du contenu (texte, image, audio, vidéo) ?",
    help: "IA générative type ChatGPT, DALL-E, Midjourney, etc.",
    options: [
      { id: 'deepfake', text: 'Oui, y compris des deepfakes potentiels', points: { limited: 3, high: 1 } },
      { id: 'yes', text: 'Oui, du contenu créatif/informatif', points: { limited: 2 } },
      { id: 'no', text: 'Non', points: { minimal: 1 } }
    ]
  },
  {
    id: 'q7',
    question: "Ce système peut-il affecter la santé ou la sécurité des personnes ?",
    help: "Diagnostic médical, conduite autonome, contrôle d'équipements critiques",
    options: [
      { id: 'direct', text: 'Oui, impact direct possible', points: { high: 5 } },
      { id: 'indirect', text: 'Oui, impact indirect possible', points: { high: 2 } },
      { id: 'no', text: 'Non, aucun impact', points: { minimal: 1 } }
    ]
  },
  {
    id: 'q8',
    question: "Ce système traite-t-il des données sensibles (santé, opinions, orientation) ?",
    help: "Données de catégorie spéciale au sens du RGPD",
    options: [
      { id: 'yes', text: 'Oui, régulièrement', points: { high: 3 } },
      { id: 'occasional', text: 'Parfois/accidentellement', points: { limited: 2 } },
      { id: 'no', text: 'Non', points: { minimal: 1 } }
    ]
  },
  {
    id: 'q9',
    question: "Qui valide les décisions/outputs de ce système ?",
    help: "Niveau de supervision humaine",
    options: [
      { id: 'none', text: 'Personne, c\'est automatique', points: { high: 2 } },
      { id: 'spot', text: 'Vérification ponctuelle', points: { limited: 1 } },
      { id: 'always', text: 'Toujours un humain valide', points: { minimal: 2 } }
    ]
  },
  {
    id: 'q10',
    question: "Ce système pourrait-il être utilisé pour manipuler des personnes ?",
    help: "Techniques subliminales, exploitation de vulnérabilités, manipulation comportementale",
    options: [
      { id: 'yes', text: 'Oui, potentiellement', points: { prohibited: 3, high: 2 } },
      { id: 'no', text: 'Non, ce n\'est pas sa fonction', points: { minimal: 1 } }
    ]
  }
];

// ============================================
// CLASSIFICATION RULES
// ============================================
const CLASSIFICATIONS: Record<string, Classification> = {
  prohibited: {
    level: 'prohibited',
    label: 'INTERDIT',
    color: '#FF0000',
    icon: '🚫',
    explanation: "Ce système IA est INTERDIT par l'AI Act. Son utilisation doit cesser immédiatement.",
    actions: [
      "Arrêter immédiatement l'utilisation du système",
      "Documenter la décision d'arrêt",
      "Informer les parties prenantes",
      "Rechercher des alternatives conformes"
    ],
    articles: ["Article 5 - Pratiques interdites"]
  },
  high: {
    level: 'high',
    label: 'HAUT RISQUE',
    color: '#FF6B00',
    icon: '⚠️',
    explanation: "Ce système est classé HAUT RISQUE. Des obligations strictes s'appliquent avant août 2026.",
    actions: [
      "Exiger la documentation technique du fournisseur (Annexe IV)",
      "Mettre en place une supervision humaine",
      "Réaliser une analyse d'impact",
      "Tenir un registre d'utilisation",
      "Former les utilisateurs",
      "Prévoir des audits réguliers"
    ],
    articles: ["Article 6 - Systèmes à haut risque", "Annexe III", "Articles 9-15"]
  },
  limited: {
    level: 'limited',
    label: 'RISQUE LIMITÉ',
    color: '#FFB800',
    icon: '⚡',
    explanation: "Ce système est à RISQUE LIMITÉ. Des obligations de transparence s'appliquent.",
    actions: [
      "Ajouter une mention claire que c'est une IA",
      "Informer les utilisateurs du fonctionnement",
      "Documenter dans le registre IA",
      "Former les opérateurs"
    ],
    articles: ["Article 50 - Obligations de transparence"]
  },
  minimal: {
    level: 'minimal',
    label: 'RISQUE MINIMAL',
    color: '#00FF88',
    icon: '✅',
    explanation: "Ce système est à RISQUE MINIMAL. Pas d'obligations spécifiques, mais les bonnes pratiques sont recommandées.",
    actions: [
      "Documenter dans le registre IA (recommandé)",
      "Appliquer les bonnes pratiques d'IA responsable",
      "Surveiller les évolutions réglementaires"
    ],
    articles: ["Article 95 - Mesures volontaires"]
  }
};

function calculateClassification(answers: Record<string, string>): Classification {
  const scores = { prohibited: 0, high: 0, limited: 0, minimal: 0 };
  
  CLASSIFICATION_QUESTIONS.forEach(q => {
    const answer = answers[q.id];
    if (answer) {
      const option = q.options.find(o => o.id === answer);
      if (option) {
        Object.entries(option.points).forEach(([level, points]) => {
          scores[level as keyof typeof scores] += points;
        });
      }
    }
  });

  // Déterminer le niveau le plus élevé
  if (scores.prohibited >= 5) return CLASSIFICATIONS.prohibited;
  if (scores.high >= 8) return CLASSIFICATIONS.high;
  if (scores.limited >= 5) return CLASSIFICATIONS.limited;
  return CLASSIFICATIONS.minimal;
}

// ============================================
// ICONS
// ============================================
const Icons = {
  Plus: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  Trash: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>,
  ChevronRight: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><polyline points="9 18 15 12 9 6"/></svg>,
  ChevronLeft: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><polyline points="15 18 9 12 15 6"/></svg>,
  Check: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-full h-full"><polyline points="20 6 9 17 4 12"/></svg>,
  Download: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
  HelpCircle: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  Edit: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
};

// ============================================
// MAIN COMPONENT
// ============================================
export default function ClassificationWizard({ 
  onComplete, 
  moduleColor = '#FF6B00' 
}: { 
  onComplete?: (systems: AISystem[]) => void;
  moduleColor?: string;
}) {
  const [systems, setSystems] = useState<AISystem[]>([]);
  const [currentSystemIdx, setCurrentSystemIdx] = useState<number | null>(null);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [newSystemName, setNewSystemName] = useState('');
  const [newSystemDesc, setNewSystemDesc] = useState('');
  const [showAddForm, setShowAddForm] = useState(true);
  const [showHelp, setShowHelp] = useState<string | null>(null);

  const currentSystem = currentSystemIdx !== null ? systems[currentSystemIdx] : null;
  const currentQuestion = CLASSIFICATION_QUESTIONS[currentQuestionIdx];

  // Add a new system
  const addSystem = () => {
    if (!newSystemName.trim()) return;
    
    const newSystem: AISystem = {
      id: `sys-${Date.now()}`,
      name: newSystemName.trim(),
      description: newSystemDesc.trim(),
      answers: {}
    };
    
    setSystems([...systems, newSystem]);
    setNewSystemName('');
    setNewSystemDesc('');
    setShowAddForm(false);
  };

  // Remove a system
  const removeSystem = (id: string) => {
    setSystems(systems.filter(s => s.id !== id));
  };

  // Start classification for a system
  const startClassification = (idx: number) => {
    setCurrentSystemIdx(idx);
    setCurrentQuestionIdx(0);
    setShowResults(false);
  };

  // Answer a question
  const answerQuestion = (answerId: string) => {
    if (currentSystemIdx === null || !currentSystem) return;

    const updatedAnswers = {
      ...currentSystem.answers,
      [currentQuestion.id]: answerId
    };

    const updatedSystems = [...systems];
    updatedSystems[currentSystemIdx] = {
      ...currentSystem,
      answers: updatedAnswers
    };

    if (currentQuestionIdx < CLASSIFICATION_QUESTIONS.length - 1) {
      setSystems(updatedSystems);
      setCurrentQuestionIdx(currentQuestionIdx + 1);
    } else {
      // Calculate final classification
      const classification = calculateClassification(updatedAnswers);
      updatedSystems[currentSystemIdx] = {
        ...currentSystem,
        answers: updatedAnswers,
        classification
      };
      setSystems(updatedSystems);
      setShowResults(true);
    }
  };

  // Go back to previous question
  const previousQuestion = () => {
    if (currentQuestionIdx > 0) {
      setCurrentQuestionIdx(currentQuestionIdx - 1);
    }
  };

  // Export results
  const exportResults = () => {
    const data = systems.map(s => ({
      Système: s.name,
      Description: s.description,
      Classification: s.classification?.label || 'Non classifié',
      Explication: s.classification?.explanation || '',
      Actions: s.classification?.actions.join(' | ') || '',
      Articles: s.classification?.articles.join(', ') || ''
    }));

    const csv = [
      Object.keys(data[0] || {}).join(';'),
      ...data.map(row => Object.values(row).map(v => `"${v}"`).join(';'))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `classification-ia-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  // Complete the exercise
  const completeExercise = () => {
    if (onComplete) {
      onComplete(systems);
    }
  };

  // Count classified systems
  const classifiedCount = systems.filter(s => s.classification).length;

  return (
    <div className="min-h-[600px]">
      <AnimatePresence mode="wait">
        {/* STEP 1: Add Systems */}
        {currentSystemIdx === null && (
          <motion.div
            key="systems-list"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {/* Header */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">🎯 Machine à Classer vos Systèmes IA</h2>
              <p className="text-white/60">
                Ajoutez vos systèmes IA, puis classifiez-les un par un grâce à notre wizard intelligent.
              </p>
            </div>

            {/* Progress */}
            {systems.length > 0 && (
              <div className="bg-white/5 rounded-xl p-4 mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white/60 text-sm">Progression</span>
                  <span className="text-white font-bold">{classifiedCount}/{systems.length} classifiés</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: moduleColor }}
                    initial={{ width: 0 }}
                    animate={{ width: `${(classifiedCount / systems.length) * 100}%` }}
                  />
                </div>
              </div>
            )}

            {/* Systems List */}
            <div className="space-y-3 mb-6">
              {systems.map((system, idx) => (
                <motion.div
                  key={system.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white/5 rounded-xl p-4 flex items-center gap-4"
                >
                  {/* Classification Badge */}
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                    style={{ 
                      backgroundColor: system.classification 
                        ? `${system.classification.color}20` 
                        : 'rgba(255,255,255,0.05)'
                    }}
                  >
                    {system.classification?.icon || '❓'}
                  </div>

                  {/* System Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold truncate">{system.name}</h3>
                    {system.description && (
                      <p className="text-white/40 text-sm truncate">{system.description}</p>
                    )}
                    {system.classification && (
                      <span 
                        className="inline-block text-xs font-medium px-2 py-0.5 rounded mt-1"
                        style={{ 
                          backgroundColor: `${system.classification.color}20`,
                          color: system.classification.color
                        }}
                      >
                        {system.classification.label}
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => startClassification(idx)}
                      className="px-4 py-2 rounded-lg text-sm font-medium transition-all hover:scale-105"
                      style={{ 
                        backgroundColor: system.classification ? 'rgba(255,255,255,0.1)' : moduleColor,
                        color: system.classification ? 'white' : 'black'
                      }}
                    >
                      {system.classification ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4"><Icons.Edit /></div>
                          Modifier
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          Classifier
                          <div className="w-4 h-4"><Icons.ChevronRight /></div>
                        </div>
                      )}
                    </button>
                    <button
                      onClick={() => removeSystem(system.id)}
                      className="w-10 h-10 rounded-lg bg-red-500/10 hover:bg-red-500/20 flex items-center justify-center text-red-400 transition-colors"
                    >
                      <div className="w-5 h-5"><Icons.Trash /></div>
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Add System Form */}
            {showAddForm ? (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="bg-white/5 rounded-xl p-6 mb-6"
              >
                <h3 className="font-semibold mb-4">➕ Ajouter un système IA</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-white/60 mb-2">Nom du système *</label>
                    <input
                      type="text"
                      value={newSystemName}
                      onChange={(e) => setNewSystemName(e.target.value)}
                      placeholder="Ex: ChatGPT, Outil de tri CV, Chatbot SAV..."
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-white/30"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-white/60 mb-2">Description (optionnel)</label>
                    <input
                      type="text"
                      value={newSystemDesc}
                      onChange={(e) => setNewSystemDesc(e.target.value)}
                      placeholder="Ex: Utilisé par le service RH pour pré-filtrer les candidatures"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-white/30"
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={addSystem}
                      disabled={!newSystemName.trim()}
                      className="flex-1 py-3 rounded-xl font-semibold text-black disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-[1.02]"
                      style={{ backgroundColor: moduleColor }}
                    >
                      Ajouter ce système
                    </button>
                    {systems.length > 0 && (
                      <button
                        onClick={() => setShowAddForm(false)}
                        className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 font-medium transition-colors"
                      >
                        Annuler
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ) : (
              <button
                onClick={() => setShowAddForm(true)}
                className="w-full py-4 rounded-xl border-2 border-dashed border-white/20 hover:border-white/40 flex items-center justify-center gap-2 text-white/60 hover:text-white transition-all mb-6"
              >
                <div className="w-5 h-5"><Icons.Plus /></div>
                Ajouter un autre système
              </button>
            )}

            {/* Export - dès 1 système */}
            {classifiedCount >= 1 && (
              <button
                onClick={exportResults}
                className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 font-semibold flex items-center justify-center gap-2 transition-colors mb-3"
              >
                <div className="w-5 h-5"><Icons.Download /></div>
                Exporter mes classifications (CSV)
              </button>
            )}

            {/* Valider - à partir de 5 systèmes */}
            {classifiedCount >= 5 && (
              <button
                onClick={completeExercise}
                className="w-full py-4 rounded-xl font-semibold text-black flex items-center justify-center gap-2"
                style={{ backgroundColor: moduleColor }}
              >
                <div className="w-5 h-5"><Icons.Check /></div>
                Valider l'exercice
              </button>
            )}

            {systems.length > 0 && classifiedCount < 5 && (
              <p className="text-center text-white/40 text-sm mt-4">
                Classifiez au moins 5 systèmes pour valider ({classifiedCount}/5)
              </p>
            )}
          </motion.div>
        )}

        {/* STEP 2: Classification Wizard */}
        {currentSystemIdx !== null && !showResults && currentSystem && (
          <motion.div
            key="wizard"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {/* Header */}
            <div className="mb-6">
              <button
                onClick={() => {
                  setCurrentSystemIdx(null);
                  setCurrentQuestionIdx(0);
                }}
                className="flex items-center gap-2 text-white/60 hover:text-white mb-4 transition-colors"
              >
                <div className="w-4 h-4"><Icons.ChevronLeft /></div>
                Retour à la liste
              </button>
              <h2 className="text-xl font-bold mb-1">Classification de : {currentSystem.name}</h2>
              <p className="text-white/40 text-sm">
                Question {currentQuestionIdx + 1} sur {CLASSIFICATION_QUESTIONS.length}
              </p>
              
              {/* Progress Bar */}
              <div className="mt-4 h-2 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: moduleColor }}
                  animate={{ width: `${((currentQuestionIdx + 1) / CLASSIFICATION_QUESTIONS.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Question */}
            <div className="bg-white/5 rounded-xl p-6 mb-6">
              <div className="flex items-start gap-3 mb-6">
                <h3 className="text-xl font-semibold flex-1">{currentQuestion.question}</h3>
                {currentQuestion.help && (
                  <button
                    onClick={() => setShowHelp(showHelp === currentQuestion.id ? null : currentQuestion.id)}
                    className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/60 hover:text-white transition-colors flex-shrink-0"
                  >
                    <div className="w-5 h-5"><Icons.HelpCircle /></div>
                  </button>
                )}
              </div>

              {/* Help Text */}
              <AnimatePresence>
                {showHelp === currentQuestion.id && currentQuestion.help && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-6 overflow-hidden"
                  >
                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 text-blue-300 text-sm">
                      💡 {currentQuestion.help}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Options */}
              <div className="space-y-3">
                {currentQuestion.options.map((option) => {
                  const isSelected = currentSystem.answers?.[currentQuestion.id] === option.id;
                  
                  return (
                    <button
                      key={option.id}
                      onClick={() => answerQuestion(option.id)}
                      className={`w-full p-4 rounded-xl text-left transition-all flex items-center gap-4 ${
                        isSelected 
                          ? 'border-2' 
                          : 'bg-white/5 border-2 border-transparent hover:bg-white/10'
                      }`}
                      style={isSelected ? { 
                        backgroundColor: `${moduleColor}20`,
                        borderColor: moduleColor 
                      } : {}}
                    >
                      <div 
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                          isSelected ? 'border-transparent' : 'border-white/30'
                        }`}
                        style={isSelected ? { backgroundColor: moduleColor } : {}}
                      >
                        {isSelected && <div className="w-3 h-3 text-black"><Icons.Check /></div>}
                      </div>
                      <span>{option.text}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between">
              <button
                onClick={previousQuestion}
                disabled={currentQuestionIdx === 0}
                className="flex items-center gap-2 px-4 py-2 text-white/60 hover:text-white disabled:opacity-30 transition-colors"
              >
                <div className="w-5 h-5"><Icons.ChevronLeft /></div>
                Précédent
              </button>
            </div>
          </motion.div>
        )}

        {/* STEP 3: Results */}
        {showResults && currentSystem?.classification && (
          <motion.div
            key="results"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div 
              className="rounded-xl p-8 mb-6"
              style={{ backgroundColor: `${currentSystem.classification.color}10` }}
            >
              {/* Badge */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.2 }}
                className="w-24 h-24 rounded-2xl flex items-center justify-center text-5xl mx-auto mb-6"
                style={{ backgroundColor: `${currentSystem.classification.color}20` }}
              >
                {currentSystem.classification.icon}
              </motion.div>

              <h2 
                className="text-3xl font-bold text-center mb-2"
                style={{ color: currentSystem.classification.color }}
              >
                {currentSystem.classification.label}
              </h2>
              <p className="text-white/70 text-center mb-8">{currentSystem.name}</p>

              {/* Explanation */}
              <div className="bg-black/20 rounded-xl p-6 mb-6">
                <p className="text-white/80">{currentSystem.classification.explanation}</p>
              </div>

              {/* Actions Required */}
              <div className="mb-6">
                <h4 className="font-semibold mb-4 flex items-center gap-2">
                  📋 Actions à mener
                </h4>
                <ul className="space-y-2">
                  {currentSystem.classification.actions.map((action, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-white/70">
                      <span 
                        className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5"
                        style={{ backgroundColor: `${currentSystem.classification!.color}30`, color: currentSystem.classification!.color }}
                      >
                        {idx + 1}
                      </span>
                      {action}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Articles */}
              <div className="flex flex-wrap gap-2">
                {currentSystem.classification.articles.map((article, idx) => (
                  <span 
                    key={idx}
                    className="text-xs px-3 py-1 rounded-full bg-white/10 text-white/60"
                  >
                    {article}
                  </span>
                ))}
              </div>
            </div>

            {/* Continue Button */}
            <button
              onClick={() => {
                setCurrentSystemIdx(null);
                setShowResults(false);
                setCurrentQuestionIdx(0);
              }}
              className="w-full py-4 rounded-xl font-semibold text-black"
              style={{ backgroundColor: moduleColor }}
            >
              Continuer avec les autres systèmes
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
