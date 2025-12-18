'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle, XCircle, ArrowRight, RotateCcw, 
  Trophy, AlertCircle, HelpCircle, Clock, Zap,
  ChevronRight, Award
} from 'lucide-react';

// Types
interface QuestionOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

interface Question {
  id: string;
  text: string;
  type: 'single' | 'multiple';
  options: QuestionOption[];
  explanation: string;
}

interface QuizProps {
  quizId: string;
  lessonId: string;
  lessonTitle: string;
  moduleId: number;
  questions: Question[];
  passingScore?: number; // Default 80%
  onComplete: (score: number, passed: boolean) => void;
  onRetry: () => void;
  onContinue: () => void;
}

// Exemple de questions pour le Module 1
export const sampleQuestions: Question[] = [
  {
    id: 'q1',
    text: "Quelle est la date d'entrée en vigueur complète de l'AI Act ?",
    type: 'single',
    options: [
      { id: 'q1-a', text: '1er janvier 2025', isCorrect: false },
      { id: 'q1-b', text: '2 août 2025', isCorrect: false },
      { id: 'q1-c', text: '2 août 2026', isCorrect: true },
      { id: 'q1-d', text: '1er janvier 2027', isCorrect: false },
    ],
    explanation: "L'AI Act entre pleinement en vigueur le 2 août 2026, deux ans après sa publication au Journal Officiel de l'UE."
  },
  {
    id: 'q2',
    text: "Quels sont les 4 niveaux de risque définis par l'AI Act ?",
    type: 'single',
    options: [
      { id: 'q2-a', text: 'Faible, Moyen, Élevé, Critique', isCorrect: false },
      { id: 'q2-b', text: 'Minimal, Limité, Élevé, Inacceptable', isCorrect: true },
      { id: 'q2-c', text: 'Vert, Orange, Rouge, Noir', isCorrect: false },
      { id: 'q2-d', text: 'Niveau 1, 2, 3, 4', isCorrect: false },
    ],
    explanation: "L'AI Act définit 4 niveaux de risque : Minimal (aucune obligation), Limité (transparence), Élevé (conformité stricte), et Inacceptable (interdit)."
  },
  {
    id: 'q3',
    text: "Quelle est l'amende maximale pour non-conformité à l'AI Act ?",
    type: 'single',
    options: [
      { id: 'q3-a', text: '10 millions € ou 2% du CA mondial', isCorrect: false },
      { id: 'q3-b', text: '20 millions € ou 4% du CA mondial', isCorrect: false },
      { id: 'q3-c', text: '35 millions € ou 7% du CA mondial', isCorrect: true },
      { id: 'q3-d', text: '50 millions € ou 10% du CA mondial', isCorrect: false },
    ],
    explanation: "Les violations les plus graves peuvent entraîner des amendes jusqu'à 35 millions d'euros ou 7% du chiffre d'affaires annuel mondial."
  },
  {
    id: 'q4',
    text: "Qui est responsable de la conformité d'un système IA à haut risque ?",
    type: 'single',
    options: [
      { id: 'q4-a', text: "Uniquement le développeur de l'IA", isCorrect: false },
      { id: 'q4-b', text: "Uniquement l'utilisateur final", isCorrect: false },
      { id: 'q4-c', text: "Le fournisseur (provider) en premier lieu", isCorrect: true },
      { id: 'q4-d', text: "L'Union Européenne", isCorrect: false },
    ],
    explanation: "Le fournisseur (provider) du système IA est le principal responsable de la conformité, mais les déployeurs ont aussi des obligations."
  },
  {
    id: 'q5',
    text: "Quel document est obligatoire pour les systèmes IA à haut risque ?",
    type: 'single',
    options: [
      { id: 'q5-a', text: 'Un communiqué de presse', isCorrect: false },
      { id: 'q5-b', text: 'Une documentation technique complète', isCorrect: true },
      { id: 'q5-c', text: 'Un simple avertissement utilisateur', isCorrect: false },
      { id: 'q5-d', text: 'Aucun document requis', isCorrect: false },
    ],
    explanation: "Les systèmes IA à haut risque nécessitent une documentation technique détaillée incluant l'évaluation des risques, les données d'entraînement, et les mesures de mitigation."
  },
];

export default function Quiz({
  quizId,
  lessonId,
  lessonTitle,
  moduleId,
  questions,
  passingScore = 80,
  onComplete,
  onRetry,
  onContinue,
}: QuizProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [answers, setAnswers] = useState<{ questionId: string; correct: boolean }[]>([]);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  // Vérifier si la réponse est correcte
  const checkAnswer = () => {
    const correctOptionIds = currentQuestion.options
      .filter(o => o.isCorrect)
      .map(o => o.id);
    
    const isCorrect = currentQuestion.type === 'single'
      ? selectedOptions.length === 1 && correctOptionIds.includes(selectedOptions[0])
      : selectedOptions.length === correctOptionIds.length && 
        selectedOptions.every(id => correctOptionIds.includes(id));

    setAnswers([...answers, { questionId: currentQuestion.id, correct: isCorrect }]);
    setHasAnswered(true);
    setShowExplanation(true);
  };

  // Passer à la question suivante
  const nextQuestion = () => {
    if (isLastQuestion) {
      // Calculer le score final
      const correctCount = answers.filter(a => a.correct).length + 
        (hasAnswered ? (answers[answers.length - 1]?.correct ? 0 : 0) : 0);
      const totalCorrect = [...answers].filter(a => a.correct).length;
      const score = Math.round((totalCorrect / questions.length) * 100);
      const passed = score >= passingScore;
      
      setQuizCompleted(true);
      onComplete(score, passed);
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOptions([]);
      setHasAnswered(false);
      setShowExplanation(false);
    }
  };

  // Sélectionner une option
  const handleSelectOption = (optionId: string) => {
    if (hasAnswered) return;

    if (currentQuestion.type === 'single') {
      setSelectedOptions([optionId]);
    } else {
      setSelectedOptions(prev => 
        prev.includes(optionId)
          ? prev.filter(id => id !== optionId)
          : [...prev, optionId]
      );
    }
  };

  // Réessayer le quiz
  const handleRetry = () => {
    setCurrentQuestionIndex(0);
    setSelectedOptions([]);
    setHasAnswered(false);
    setAnswers([]);
    setQuizCompleted(false);
    setShowExplanation(false);
    onRetry();
  };

  // Calculer le score actuel
  const currentScore = answers.length > 0
    ? Math.round((answers.filter(a => a.correct).length / answers.length) * 100)
    : 0;

  const finalScore = quizCompleted
    ? Math.round((answers.filter(a => a.correct).length / questions.length) * 100)
    : 0;

  const passed = finalScore >= passingScore;

  // Écran de résultats
  if (quizCompleted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-8 max-w-2xl mx-auto"
      >
        <div className="text-center">
          {/* Icône résultat */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
            className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 ${
              passed 
                ? 'bg-gradient-to-br from-emerald-400 to-green-500' 
                : 'bg-gradient-to-br from-orange-400 to-red-500'
            }`}
          >
            {passed ? (
              <Trophy className="w-12 h-12 text-white" />
            ) : (
              <RotateCcw className="w-12 h-12 text-white" />
            )}
          </motion.div>

          {/* Score */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-3xl font-bold text-white mb-2">
              {passed ? 'Félicitations ! 🎉' : 'Presque... 💪'}
            </h2>
            <p className="text-slate-400 mb-6">
              {passed 
                ? `Vous avez réussi le quiz de "${lessonTitle}"`
                : `Vous devez obtenir au moins ${passingScore}% pour valider`
              }
            </p>

            <div className="flex items-center justify-center gap-8 mb-8">
              <div className="text-center">
                <div className={`text-5xl font-bold ${passed ? 'text-emerald-400' : 'text-orange-400'}`}>
                  {finalScore}%
                </div>
                <p className="text-slate-500 text-sm mt-1">Votre score</p>
              </div>
              <div className="h-16 w-px bg-slate-700" />
              <div className="text-center">
                <div className="text-5xl font-bold text-slate-400">
                  {passingScore}%
                </div>
                <p className="text-slate-500 text-sm mt-1">Requis</p>
              </div>
            </div>

            {/* Détails */}
            <div className="bg-slate-800/50 rounded-xl p-4 mb-6">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Questions correctes</span>
                <span className="text-white font-medium">
                  {answers.filter(a => a.correct).length} / {questions.length}
                </span>
              </div>
            </div>

            {/* XP gagné */}
            {passed && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex items-center justify-center gap-2 mb-6 text-yellow-400"
              >
                <Zap className="w-5 h-5" />
                <span className="font-bold">+50 XP gagnés !</span>
              </motion.div>
            )}
          </motion.div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {!passed && (
              <button
                onClick={handleRetry}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-xl transition-all"
              >
                <RotateCcw className="w-5 h-5" />
                Réessayer
              </button>
            )}
            <button
              onClick={onContinue}
              className={`flex items-center justify-center gap-2 px-6 py-3 font-semibold rounded-xl transition-all ${
                passed
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white'
                  : 'bg-slate-700 hover:bg-slate-600 text-white'
              }`}
            >
              {passed ? 'Continuer la formation' : 'Continuer quand même'}
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {!passed && (
            <p className="text-slate-500 text-sm mt-4">
              💡 Astuce : Revoyez la leçon avant de réessayer le quiz
            </p>
          )}
        </div>
      </motion.div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-cyan-400" />
            <span className="text-slate-400 text-sm">Quiz - Module {moduleId}</span>
          </div>
          <span className="text-slate-400 text-sm">
            Question {currentQuestionIndex + 1}/{questions.length}
          </span>
        </div>

        {/* Progress bar */}
        <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${((currentQuestionIndex + (hasAnswered ? 1 : 0)) / questions.length) * 100}%` }}
            className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
          />
        </div>
      </div>

      {/* Question Card */}
      <motion.div
        key={currentQuestion.id}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6"
      >
        {/* Question */}
        <h3 className="text-xl font-semibold text-white mb-6">
          {currentQuestion.text}
        </h3>

        {/* Options */}
        <div className="space-y-3 mb-6">
          {currentQuestion.options.map((option, index) => {
            const isSelected = selectedOptions.includes(option.id);
            const showResult = hasAnswered;
            const isCorrect = option.isCorrect;

            return (
              <button
                key={option.id}
                onClick={() => handleSelectOption(option.id)}
                disabled={hasAnswered}
                className={`w-full p-4 rounded-xl text-left transition-all flex items-center gap-4 ${
                  showResult
                    ? isCorrect
                      ? 'bg-emerald-500/20 border-2 border-emerald-500'
                      : isSelected
                        ? 'bg-red-500/20 border-2 border-red-500'
                        : 'bg-slate-700/50 border-2 border-transparent'
                    : isSelected
                      ? 'bg-cyan-500/20 border-2 border-cyan-500'
                      : 'bg-slate-700/50 border-2 border-transparent hover:border-slate-600'
                }`}
              >
                {/* Lettre */}
                <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${
                  showResult
                    ? isCorrect
                      ? 'bg-emerald-500 text-white'
                      : isSelected
                        ? 'bg-red-500 text-white'
                        : 'bg-slate-600 text-slate-300'
                    : isSelected
                      ? 'bg-cyan-500 text-white'
                      : 'bg-slate-600 text-slate-300'
                }`}>
                  {String.fromCharCode(65 + index)}
                </span>

                {/* Texte */}
                <span className={`flex-1 ${
                  showResult
                    ? isCorrect
                      ? 'text-emerald-400'
                      : isSelected
                        ? 'text-red-400'
                        : 'text-slate-300'
                    : 'text-white'
                }`}>
                  {option.text}
                </span>

                {/* Icône résultat */}
                {showResult && (
                  isCorrect ? (
                    <CheckCircle className="w-6 h-6 text-emerald-400" />
                  ) : isSelected ? (
                    <XCircle className="w-6 h-6 text-red-400" />
                  ) : null
                )}
              </button>
            );
          })}
        </div>

        {/* Explication */}
        <AnimatePresence>
          {showExplanation && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 overflow-hidden"
            >
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-blue-400 font-medium mb-1">Explication</p>
                    <p className="text-slate-300 text-sm">{currentQuestion.explanation}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Actions */}
        <div className="flex justify-end">
          {!hasAnswered ? (
            <button
              onClick={checkAnswer}
              disabled={selectedOptions.length === 0}
              className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold px-6 py-3 rounded-xl flex items-center gap-2 transition-all"
            >
              Valider
              <CheckCircle className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={nextQuestion}
              className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-semibold px-6 py-3 rounded-xl flex items-center gap-2 transition-all"
            >
              {isLastQuestion ? 'Voir les résultats' : 'Question suivante'}
              <ArrowRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
