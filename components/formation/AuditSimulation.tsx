'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ============================================
// TYPES
// ============================================
interface SimulationStep {
  id: string;
  type: 'urgence' | 'qcm' | 'upload' | 'action' | 'dialog';
  phase: 'preparation' | 'controle' | 'debrief';
  timeLimit?: number; // seconds for this step
  auditorMessage: string;
  auditorMood?: 'neutral' | 'satisfied' | 'concerned' | 'suspicious';
  choices?: {
    id: string;
    text: string;
    correct: boolean;
    feedback: string;
    points: number;
  }[];
  uploadPrompt?: string;
  uploadAccept?: string;
  actionPrompt?: string;
  successMessage?: string;
  failMessage?: string;
}

interface SimulationResult {
  stepId: string;
  correct: boolean;
  points: number;
  timeSpent: number;
  answer?: string;
}

// ============================================
// SIMULATION SCENARIO
// ============================================
const SIMULATION_STEPS: SimulationStep[] = [
  // PHASE 1: PRÉPARATION (15 min simulées)
  {
    id: 'prep-1',
    type: 'urgence',
    phase: 'preparation',
    auditorMessage: "📞 Appel de l'accueil : \"Un inspecteur de la CNIL arrive dans 45 minutes pour un contrôle AI Act.\" Quelle est votre première action ?",
    auditorMood: 'neutral',
    choices: [
      { id: 'a', text: "Préparer le registre des systèmes IA", correct: true, feedback: "Excellent réflexe ! Le registre est le premier document demandé.", points: 20 },
      { id: 'b', text: "Appeler le PDG pour prévenir", correct: false, feedback: "Pas prioritaire. Le PDG sera informé, mais votre registre doit être prêt.", points: 5 },
      { id: 'c', text: "Vérifier que tous les systèmes IA sont éteints", correct: false, feedback: "Mauvaise stratégie. Cacher les preuves aggrave la situation.", points: -10 },
      { id: 'd', text: "Préparer du café pour l'inspecteur", correct: false, feedback: "L'hospitalité c'est bien, mais pas prioritaire !", points: 0 }
    ]
  },
  {
    id: 'prep-2',
    type: 'qcm',
    phase: 'preparation',
    auditorMessage: "Vous avez 5 documents essentiels à rassembler. Lequel n'est PAS prioritaire pour un contrôle AI Act ?",
    choices: [
      { id: 'a', text: "Le registre des systèmes IA", correct: false, feedback: "Le registre est absolument prioritaire !", points: 0 },
      { id: 'b', text: "La politique IA de l'entreprise", correct: false, feedback: "La politique IA est essentielle.", points: 0 },
      { id: 'c', text: "Le bilan comptable", correct: true, feedback: "Correct ! Le bilan comptable n'est pas lié au contrôle AI Act.", points: 15 },
      { id: 'd', text: "Les preuves de formation des équipes", correct: false, feedback: "Les preuves de formation Article 4 sont importantes.", points: 0 }
    ]
  },
  {
    id: 'prep-3',
    type: 'action',
    phase: 'preparation',
    auditorMessage: "Vérifiez rapidement : votre chatbot commercial affiche-t-il une mention 'Vous discutez avec une IA' ?",
    actionPrompt: "Confirmez que vous avez vérifié la mention de transparence",
    successMessage: "Bien ! La transparence est obligatoire depuis février 2025 (Article 50).",
    choices: [
      { id: 'yes', text: "Oui, la mention est présente ✓", correct: true, feedback: "Parfait, vous êtes conforme sur ce point.", points: 10 },
      { id: 'no', text: "Non, je dois l'ajouter en urgence !", correct: false, feedback: "Attention ! L'absence de mention peut coûter jusqu'à 5M€.", points: 5 },
      { id: 'nochat', text: "Nous n'avons pas de chatbot", correct: true, feedback: "OK, passons à la suite.", points: 5 }
    ]
  },

  // PHASE 2: CONTRÔLE (30 min simulées)
  {
    id: 'ctrl-1',
    type: 'dialog',
    phase: 'controle',
    auditorMessage: "Bonjour, je suis l'inspecteur Martin de la CNIL. Pouvez-vous me présenter votre registre des systèmes d'IA ?",
    auditorMood: 'neutral',
    choices: [
      { id: 'a', text: "Voici notre registre complet avec 12 systèmes documentés.", correct: true, feedback: "Excellent ! Montrer un registre organisé rassure l'inspecteur.", points: 20 },
      { id: 'b', text: "Nous sommes en train de le finaliser...", correct: false, feedback: "Réponse honnête mais qui révèle un manque de préparation.", points: 5 },
      { id: 'c', text: "Quel registre ? C'est obligatoire ?", correct: false, feedback: "Très mauvaise réponse. Cela montre une méconnaissance totale de la réglementation.", points: -10 }
    ]
  },
  {
    id: 'ctrl-2',
    type: 'qcm',
    phase: 'controle',
    auditorMessage: "Je vois que vous utilisez un outil de tri de CV. Comment l'avez-vous classifié ?",
    auditorMood: 'neutral',
    choices: [
      { id: 'a', text: "Haut risque - Annexe III, point 4 (emploi)", correct: true, feedback: "Parfait ! Le recrutement est explicitement listé comme haut risque.", points: 20 },
      { id: 'b', text: "Risque limité car il ne prend pas de décision finale", correct: false, feedback: "Non, même en assistance, le tri CV reste haut risque.", points: 0 },
      { id: 'c', text: "Risque minimal car c'est juste un filtre", correct: false, feedback: "Erreur de classification. Cela pourrait coûter cher.", points: -5 }
    ]
  },
  {
    id: 'ctrl-3',
    type: 'dialog',
    phase: 'controle',
    auditorMessage: "Avez-vous la documentation technique de ce système de tri CV ? Je voudrais voir l'Annexe IV.",
    auditorMood: 'concerned',
    choices: [
      { id: 'a', text: "Oui, voici le dossier complet fourni par notre éditeur, avec notre analyse d'impact.", correct: true, feedback: "Excellent ! Avoir la doc technique + votre propre analyse = conformité.", points: 25 },
      { id: 'b', text: "Nous avons demandé au fournisseur, voici notre relance du [date] et leur réponse.", correct: true, feedback: "Bonne réponse ! Vous montrez votre diligence même sans doc complète.", points: 15 },
      { id: 'c', text: "Le fournisseur dit que c'est confidentiel.", correct: false, feedback: "Cette réponse ne vous protège pas. Vous restez responsable en tant que déployeur.", points: 0 }
    ]
  },
  {
    id: 'ctrl-4',
    type: 'qcm',
    phase: 'controle',
    auditorMessage: "Je constate que votre système de reconnaissance faciale à l'entrée analyse les émotions. Qu'avez-vous à dire ?",
    auditorMood: 'suspicious',
    choices: [
      { id: 'a', text: "Nous avons désactivé cette fonction il y a 3 mois, voici le PV.", correct: true, feedback: "Parfait ! Montrer que vous avez corrigé le problème = bonne foi.", points: 20 },
      { id: 'b', text: "C'est juste pour la sécurité...", correct: false, feedback: "La reconnaissance des émotions au travail est INTERDITE. Aucune excuse.", points: -15 },
      { id: 'c', text: "Nous n'étions pas au courant que c'était interdit.", correct: false, feedback: "L'ignorance de la loi ne vous protège pas.", points: -10 }
    ]
  },
  {
    id: 'ctrl-5',
    type: 'dialog',
    phase: 'controle',
    auditorMessage: "Comment formez-vous vos équipes sur l'utilisation responsable de l'IA ?",
    auditorMood: 'neutral',
    choices: [
      { id: 'a', text: "Tous nos opérateurs ont suivi une formation AI Act certifiée. Voici les attestations.", correct: true, feedback: "Excellent ! L'Article 4 exige la formation. Vous êtes en règle.", points: 20 },
      { id: 'b', text: "Nous avons prévu de les former d'ici fin d'année.", correct: false, feedback: "L'Article 4 est applicable depuis février 2025. Vous êtes en retard.", points: 5 },
      { id: 'c', text: "Ils se forment sur le tas.", correct: false, feedback: "Insuffisant. Une formation documentée est requise.", points: 0 }
    ]
  },
  {
    id: 'ctrl-6',
    type: 'qcm',
    phase: 'controle',
    auditorMessage: "Dernier point : pouvez-vous prouver l'absence de biais discriminatoires dans votre outil RH ?",
    auditorMood: 'concerned',
    choices: [
      { id: 'a', text: "Voici notre procédure d'audit trimestrielle et le rapport du dernier contrôle.", correct: true, feedback: "Parfait ! Des processus documentés = conformité démontrée.", points: 25 },
      { id: 'b', text: "Nous n'avons reçu aucune plainte.", correct: false, feedback: "L'absence de plainte ne prouve rien. Il faut des audits proactifs.", points: 0 },
      { id: 'c', text: "Le fournisseur garantit l'absence de biais.", correct: false, feedback: "Vous devez vérifier vous-même, pas vous fier aux garanties du vendeur.", points: 5 }
    ]
  },

  // PHASE 3: CONCLUSION
  {
    id: 'end-1',
    type: 'dialog',
    phase: 'debrief',
    auditorMessage: "Merci pour cet échange. Y a-t-il autre chose que vous souhaitez me montrer ?",
    auditorMood: 'neutral',
    choices: [
      { id: 'a', text: "Oui, voici notre plan d'action conformité sur 12 mois avec les jalons.", correct: true, feedback: "Excellent ! Montrer une vision proactive impressionne toujours.", points: 15 },
      { id: 'b', text: "Non, je pense que nous avons fait le tour.", correct: true, feedback: "OK, réponse neutre acceptable.", points: 5 },
      { id: 'c', text: "Quand connaîtrons-nous le résultat du contrôle ?", correct: false, feedback: "Question inappropriée. Vous semblez anxieux.", points: 0 }
    ]
  }
];

// ============================================
// ICONS
// ============================================
const Icons = {
  Clock: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  AlertTriangle: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  User: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  Shield: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  Trophy: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>,
  X: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  Check: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-full h-full"><polyline points="20 6 9 17 4 12"/></svg>,
  Share: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>,
};

// ============================================
// AUDITOR AVATAR
// ============================================
const AuditorAvatar = ({ mood = 'neutral' }: { mood?: string }) => {
  const moodColors = {
    neutral: '#00F5FF',
    satisfied: '#00FF88',
    concerned: '#FFB800',
    suspicious: '#FF4444'
  };

  return (
    <div className="relative">
      <div 
        className="w-16 h-16 rounded-full flex items-center justify-center text-3xl"
        style={{ 
          backgroundColor: `${moodColors[mood as keyof typeof moodColors] || moodColors.neutral}20`,
          boxShadow: `0 0 20px ${moodColors[mood as keyof typeof moodColors] || moodColors.neutral}30`
        }}
      >
        🕵️
      </div>
      <div 
        className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-sm"
        style={{ backgroundColor: moodColors[mood as keyof typeof moodColors] || moodColors.neutral }}
      >
        {mood === 'satisfied' && '😊'}
        {mood === 'concerned' && '🤔'}
        {mood === 'suspicious' && '😠'}
        {mood === 'neutral' && '😐'}
      </div>
    </div>
  );
};

// ============================================
// MAIN COMPONENT
// ============================================
export default function AuditSimulation({
  onComplete,
  moduleColor = '#E040FB'
}: {
  onComplete?: (score: number, results: SimulationResult[]) => void;
  moduleColor?: string;
}) {
  const [phase, setPhase] = useState<'intro' | 'simulation' | 'results'>('intro');
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [results, setResults] = useState<SimulationResult[]>([]);
  const [totalTime, setTotalTime] = useState(45 * 60); // 45 minutes in seconds
  const [stepStartTime, setStepStartTime] = useState<number>(Date.now());
  const [showFeedback, setShowFeedback] = useState(false);
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [isTimerPaused, setIsTimerPaused] = useState(false);

  const currentStep = SIMULATION_STEPS[currentStepIdx];
  const totalScore = results.reduce((sum, r) => sum + r.points, 0);
  const maxScore = SIMULATION_STEPS.reduce((sum, s) => {
    const maxPoints = s.choices ? Math.max(...s.choices.map(c => c.points)) : 0;
    return sum + maxPoints;
  }, 0);

  // Timer countdown
  useEffect(() => {
    if (phase !== 'simulation' || isTimerPaused) return;

    const interval = setInterval(() => {
      setTotalTime(prev => {
        if (prev <= 0) {
          // Time's up - end simulation
          setPhase('results');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [phase, isTimerPaused]);

  // Format time display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle choice selection
  const handleChoice = (choiceId: string) => {
    if (showFeedback) return;

    const choice = currentStep.choices?.find(c => c.id === choiceId);
    if (!choice) return;

    const timeSpent = Math.floor((Date.now() - stepStartTime) / 1000);
    
    const result: SimulationResult = {
      stepId: currentStep.id,
      correct: choice.correct,
      points: choice.points,
      timeSpent,
      answer: choiceId
    };

    setResults([...results, result]);
    setSelectedChoice(choiceId);
    setShowFeedback(true);
    setIsTimerPaused(true);
  };

  // Move to next step
  const nextStep = () => {
    if (currentStepIdx < SIMULATION_STEPS.length - 1) {
      setCurrentStepIdx(currentStepIdx + 1);
      setShowFeedback(false);
      setSelectedChoice(null);
      setStepStartTime(Date.now());
      setIsTimerPaused(false);
    } else {
      setPhase('results');
    }
  };

  // Start simulation
  const startSimulation = () => {
    setPhase('simulation');
    setStepStartTime(Date.now());
  };

  // Get score percentage
  const scorePercentage = Math.round((totalScore / maxScore) * 100);

  // Share on LinkedIn
  const shareOnLinkedIn = () => {
    const text = `🎯 J'ai survécu à la simulation de contrôle AI Act avec un score de ${scorePercentage}% !\n\n✅ Formation AI Act complétée\n🏆 Prêt pour un vrai audit\n\n#AIAct #Conformite #RGPD #IA`;
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.origin)}&summary=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  // Render phase content
  return (
    <div className="min-h-[600px] relative">
      <AnimatePresence mode="wait">
        {/* INTRO PHASE */}
        {phase === 'intro' && (
          <motion.div
            key="intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-8"
          >
            {/* Mission Impossible Style Header */}
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', duration: 0.8 }}
              className="mb-8"
            >
              <div className="text-8xl mb-4">🎭</div>
              <h1 className="text-4xl font-black mb-2">SIMULATION DE CONTRÔLE</h1>
              <p className="text-xl text-white/60">Épreuve du feu AI Act</p>
            </motion.div>

            {/* Mission Brief */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-white/5 rounded-2xl p-8 max-w-2xl mx-auto mb-8 text-left"
            >
              <h2 className="text-xl font-bold mb-4 flex items-center gap-3">
                <div className="w-8 h-8 text-red-500"><Icons.AlertTriangle /></div>
                SITUATION
              </h2>
              <p className="text-white/70 mb-6">
                Un inspecteur de la CNIL vient d'annoncer son arrivée pour un contrôle AI Act. 
                Vous avez <strong className="text-white">45 minutes</strong> pour vous préparer et répondre à ses questions.
              </p>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-black/30 rounded-xl p-4 text-center">
                  <div className="text-3xl mb-2">⏱️</div>
                  <p className="text-sm text-white/60">Temps limité</p>
                  <p className="font-bold">45 minutes</p>
                </div>
                <div className="bg-black/30 rounded-xl p-4 text-center">
                  <div className="text-3xl mb-2">❓</div>
                  <p className="text-sm text-white/60">Questions</p>
                  <p className="font-bold">{SIMULATION_STEPS.length} étapes</p>
                </div>
                <div className="bg-black/30 rounded-xl p-4 text-center">
                  <div className="text-3xl mb-2">🎯</div>
                  <p className="text-sm text-white/60">Score max</p>
                  <p className="font-bold">{maxScore} points</p>
                </div>
              </div>

              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
                <p className="text-yellow-400 text-sm">
                  ⚠️ <strong>Attention :</strong> Vos réponses sont chronométrées. L'inspecteur n'attendra pas.
                </p>
              </div>
            </motion.div>

            {/* Start Button */}
            <motion.button
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              onClick={startSimulation}
              className="px-12 py-4 rounded-xl font-bold text-xl text-black transition-all hover:scale-105"
              style={{ backgroundColor: moduleColor }}
            >
              🚀 COMMENCER LA SIMULATION
            </motion.button>
          </motion.div>
        )}

        {/* SIMULATION PHASE */}
        {phase === 'simulation' && currentStep && (
          <motion.div
            key="simulation"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Timer Bar */}
            <div className="fixed top-0 left-0 right-0 z-50 bg-[#0A0A1B]/95 backdrop-blur-xl border-b border-white/10">
              <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 ${totalTime < 300 ? 'text-red-500 animate-pulse' : 'text-white/60'}`}>
                    <Icons.Clock />
                  </div>
                  <span className={`font-mono text-2xl font-bold ${totalTime < 300 ? 'text-red-500' : 'text-white'}`}>
                    {formatTime(totalTime)}
                  </span>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-sm text-white/60">
                    Étape {currentStepIdx + 1}/{SIMULATION_STEPS.length}
                  </div>
                  <div 
                    className="px-3 py-1 rounded-full text-sm font-medium"
                    style={{ backgroundColor: `${moduleColor}20`, color: moduleColor }}
                  >
                    {totalScore} pts
                  </div>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="h-1 bg-white/10">
                <motion.div
                  className="h-full"
                  style={{ backgroundColor: moduleColor }}
                  animate={{ width: `${((currentStepIdx + 1) / SIMULATION_STEPS.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Step Content */}
            <div className="pt-24 pb-8 px-4 max-w-3xl mx-auto">
              {/* Phase Badge */}
              <div className="flex items-center gap-2 mb-6">
                <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                  currentStep.phase === 'preparation' ? 'bg-blue-500/20 text-blue-400' :
                  currentStep.phase === 'controle' ? 'bg-orange-500/20 text-orange-400' :
                  'bg-green-500/20 text-green-400'
                }`}>
                  {currentStep.phase === 'preparation' && '🏃 Préparation'}
                  {currentStep.phase === 'controle' && '🕵️ Contrôle en cours'}
                  {currentStep.phase === 'debrief' && '✅ Conclusion'}
                </span>
              </div>

              {/* Auditor Message */}
              <div className="bg-white/5 rounded-2xl p-6 mb-6">
                <div className="flex gap-4">
                  <AuditorAvatar mood={currentStep.auditorMood} />
                  <div className="flex-1">
                    <p className="text-sm text-white/40 mb-1">Inspecteur Martin</p>
                    <p className="text-lg">{currentStep.auditorMessage}</p>
                  </div>
                </div>
              </div>

              {/* Choices */}
              {currentStep.choices && (
                <div className="space-y-3">
                  {currentStep.choices.map((choice) => {
                    const isSelected = selectedChoice === choice.id;
                    const showCorrect = showFeedback && choice.correct;
                    const showWrong = showFeedback && isSelected && !choice.correct;

                    return (
                      <motion.button
                        key={choice.id}
                        onClick={() => handleChoice(choice.id)}
                        disabled={showFeedback}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`w-full p-4 rounded-xl text-left transition-all flex items-center gap-4 ${
                          showCorrect ? 'bg-green-500/20 border-2 border-green-500' :
                          showWrong ? 'bg-red-500/20 border-2 border-red-500' :
                          isSelected ? 'bg-white/10 border-2' :
                          'bg-white/5 border-2 border-transparent hover:bg-white/10'
                        }`}
                        style={isSelected && !showFeedback ? { borderColor: moduleColor } : {}}
                      >
                        <span className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold ${
                          showCorrect ? 'bg-green-500 text-white' :
                          showWrong ? 'bg-red-500 text-white' :
                          'bg-white/10 text-white/60'
                        }`}>
                          {showCorrect ? <div className="w-5 h-5"><Icons.Check /></div> :
                           showWrong ? <div className="w-5 h-5"><Icons.X /></div> :
                           choice.id.toUpperCase()}
                        </span>
                        <span className="flex-1">{choice.text}</span>
                        {showFeedback && choice.points !== 0 && (
                          <span className={`text-sm font-medium ${choice.points > 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {choice.points > 0 ? '+' : ''}{choice.points} pts
                          </span>
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              )}

              {/* Feedback */}
              <AnimatePresence>
                {showFeedback && selectedChoice && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-6 overflow-hidden"
                  >
                    <div className={`p-4 rounded-xl ${
                      currentStep.choices?.find(c => c.id === selectedChoice)?.correct
                        ? 'bg-green-500/10 border border-green-500/20'
                        : 'bg-red-500/10 border border-red-500/20'
                    }`}>
                      <p className="text-white/80">
                        {currentStep.choices?.find(c => c.id === selectedChoice)?.feedback}
                      </p>
                    </div>

                    <button
                      onClick={nextStep}
                      className="w-full mt-4 py-4 rounded-xl font-semibold text-black"
                      style={{ backgroundColor: moduleColor }}
                    >
                      {currentStepIdx < SIMULATION_STEPS.length - 1 ? 'Continuer' : 'Voir les résultats'}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        {/* RESULTS PHASE */}
        {phase === 'results' && (
          <motion.div
            key="results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-8 px-4 max-w-2xl mx-auto text-center"
          >
            {/* Score Display */}
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring' }}
              className={`w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-6 ${
                scorePercentage >= 70 ? 'bg-green-500' : 
                scorePercentage >= 50 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
            >
              <div className="text-center">
                <div className="text-4xl font-black text-black">{scorePercentage}%</div>
              </div>
            </motion.div>

            <h1 className="text-3xl font-bold mb-2">
              {scorePercentage >= 70 ? '🏆 Félicitations !' : 
               scorePercentage >= 50 ? '👍 Pas mal !' : '📚 À retravailler'}
            </h1>
            <p className="text-white/60 mb-8">
              {scorePercentage >= 70 ? 'Vous êtes prêt pour un vrai contrôle AI Act !' : 
               scorePercentage >= 50 ? 'Quelques points à améliorer avant le jour J.' : 
               'Revoyez les modules 3 à 5 avant de refaire la simulation.'}
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-white/5 rounded-xl p-4">
                <div className="text-3xl font-bold" style={{ color: moduleColor }}>{totalScore}</div>
                <p className="text-sm text-white/40">Points</p>
              </div>
              <div className="bg-white/5 rounded-xl p-4">
                <div className="text-3xl font-bold text-green-400">
                  {results.filter(r => r.correct).length}
                </div>
                <p className="text-sm text-white/40">Bonnes réponses</p>
              </div>
              <div className="bg-white/5 rounded-xl p-4">
                <div className="text-3xl font-bold text-white">
                  {formatTime(45 * 60 - totalTime)}
                </div>
                <p className="text-sm text-white/40">Temps utilisé</p>
              </div>
            </div>

            {/* Detailed Results */}
            <div className="bg-white/5 rounded-xl p-6 mb-8 text-left">
              <h3 className="font-semibold mb-4">📋 Détail des réponses</h3>
              <div className="space-y-2">
                {results.map((result, idx) => {
                  const step = SIMULATION_STEPS[idx];
                  return (
                    <div 
                      key={result.stepId}
                      className="flex items-center gap-3 p-2 rounded-lg bg-black/20"
                    >
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                        result.correct ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                      }`}>
                        <div className="w-4 h-4">
                          {result.correct ? <Icons.Check /> : <Icons.X />}
                        </div>
                      </div>
                      <span className="text-sm text-white/60 flex-1 truncate">
                        {step?.phase === 'preparation' && '🏃'} 
                        {step?.phase === 'controle' && '🕵️'} 
                        {step?.phase === 'debrief' && '✅'} 
                        Étape {idx + 1}
                      </span>
                      <span className={`text-sm font-medium ${
                        result.points > 0 ? 'text-green-400' : 
                        result.points < 0 ? 'text-red-400' : 'text-white/40'
                      }`}>
                        {result.points > 0 ? '+' : ''}{result.points}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <button
                onClick={shareOnLinkedIn}
                className="w-full py-4 rounded-xl bg-[#0A66C2] hover:bg-[#0A66C2]/80 font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <div className="w-5 h-5"><Icons.Share /></div>
                Partager sur LinkedIn 🎉
              </button>
              
              <button
                onClick={() => onComplete?.(scorePercentage, results)}
                className="w-full py-4 rounded-xl font-semibold text-black"
                style={{ backgroundColor: moduleColor }}
              >
                Valider l'exercice
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
