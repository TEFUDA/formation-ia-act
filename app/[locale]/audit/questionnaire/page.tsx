'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';

const NeuralBackground = () => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none">
    <div className="absolute inset-0 bg-gradient-to-br from-[#0A0A1B] via-[#0d0d2b] to-[#0A0A1B]" />
  </div>
);

const HoloCard = ({ children, glow = '#00F5FF', className = '' }: { children: React.ReactNode; glow?: string; className?: string }) => (
  <div
    className={`relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden ${className}`}
    style={{ boxShadow: `0 0 40px ${glow}20` }}
  >
    <div className="relative">{children}</div>
  </div>
);

const questionCategories = {
  identification: {
    name: 'Identification des systèmes IA',
    icon: '📋',
    color: '#00F5FF',
    questions: [
      { id: 'id1', question: 'Avez-vous réalisé un inventaire complet des systèmes d\'IA utilisés ?', options: [{ label: 'Oui, complet', score: 0 }, { label: 'Partiellement', score: 2 }, { label: 'Non', score: 4 }] },
      { id: 'id2', question: 'Utilisez-vous des outils d\'IA générative (ChatGPT, Copilot, etc.) ?', options: [{ label: 'Non', score: 0 }, { label: 'Oui, avec politique', score: 1 }, { label: 'Oui, sans encadrement', score: 4 }] },
      { id: 'id3', question: 'Vos systèmes IA sont-ils documentés ?', options: [{ label: 'Oui', score: 0 }, { label: 'Partiellement', score: 2 }, { label: 'Non', score: 4 }] },
      { id: 'id4', question: 'Savez-vous quels départements utilisent l\'IA ?', options: [{ label: 'Oui, cartographie complète', score: 0 }, { label: 'Vision partielle', score: 2 }, { label: 'Non', score: 4 }] },
      { id: 'id5', question: 'Vos contrats fournisseurs mentionnent-ils l\'AI Act ?', options: [{ label: 'Oui', score: 0 }, { label: 'Non', score: 3 }, { label: 'Pas de contrats', score: 4 }] },
    ],
  },
  classification: {
    name: 'Classification des risques',
    icon: '⚠️',
    color: '#FF6B00',
    questions: [
      { id: 'cl1', question: 'Avez-vous classifié vos IA selon les 4 niveaux de risque ?', options: [{ label: 'Oui', score: 0 }, { label: 'En cours', score: 2 }, { label: 'Non', score: 4 }] },
      { id: 'cl2', question: 'Utilisez-vous l\'IA pour des décisions RH ?', options: [{ label: 'Non', score: 0 }, { label: 'Aide à la décision', score: 2 }, { label: 'Décisions automatisées', score: 4 }] },
      { id: 'cl3', question: 'Avez-vous des systèmes de scoring de personnes ?', options: [{ label: 'Non', score: 0 }, { label: 'Scoring commercial', score: 2 }, { label: 'Scoring crédit/assurance', score: 4 }] },
      { id: 'cl4', question: 'Utilisez-vous la reconnaissance faciale ?', options: [{ label: 'Non', score: 0 }, { label: 'Interne seulement', score: 3 }, { label: 'Sur clients/public', score: 4 }] },
      { id: 'cl5', question: 'Vos IA impactent-elles des droits fondamentaux ?', options: [{ label: 'Non', score: 0 }, { label: 'Sous supervision', score: 2 }, { label: 'Automatisé', score: 4 }] },
    ],
  },
  gouvernance: {
    name: 'Gouvernance IA',
    icon: '🏛️',
    color: '#8B5CF6',
    questions: [
      { id: 'go1', question: 'Avez-vous désigné un référent IA ?', options: [{ label: 'Oui, formalisé', score: 0 }, { label: 'Informel', score: 2 }, { label: 'Non', score: 4 }] },
      { id: 'go2', question: 'Existe-t-il une politique d\'utilisation IA ?', options: [{ label: 'Oui, diffusée', score: 0 }, { label: 'En cours', score: 2 }, { label: 'Non', score: 4 }] },
      { id: 'go3', question: 'Avez-vous un comité de gouvernance IA ?', options: [{ label: 'Oui', score: 0 }, { label: 'Informel', score: 2 }, { label: 'Non', score: 4 }] },
      { id: 'go4', question: 'L\'adoption de nouveaux outils IA suit-elle un processus ?', options: [{ label: 'Oui', score: 0 }, { label: 'Informel', score: 2 }, { label: 'Libre', score: 4 }] },
      { id: 'go5', question: 'La direction est-elle impliquée dans la stratégie IA ?', options: [{ label: 'Oui', score: 0 }, { label: 'Limitée', score: 2 }, { label: 'Non', score: 3 }] },
    ],
  },
  documentation: {
    name: 'Documentation technique',
    icon: '📄',
    color: '#00FF88',
    questions: [
      { id: 'do1', question: 'Avez-vous la doc technique de vos IA à haut risque ?', options: [{ label: 'Oui', score: 0 }, { label: 'Partielle', score: 2 }, { label: 'Non', score: 3 }] },
      { id: 'do2', question: 'Les logs de vos IA sont-ils conservés ?', options: [{ label: 'Oui', score: 0 }, { label: 'Partiellement', score: 2 }, { label: 'Non', score: 4 }] },
      { id: 'do3', question: 'Avez-vous documenté les biais potentiels ?', options: [{ label: 'Oui', score: 0 }, { label: 'Partiel', score: 2 }, { label: 'Non', score: 4 }] },
      { id: 'do4', question: 'Les données d\'entraînement sont-elles documentées ?', options: [{ label: 'Oui', score: 0 }, { label: 'Partiel', score: 2 }, { label: 'Non/NSP', score: 3 }] },
      { id: 'do5', question: 'Avez-vous des procédures de maintenance IA ?', options: [{ label: 'Oui', score: 0 }, { label: 'Informel', score: 2 }, { label: 'Non', score: 4 }] },
    ],
  },
  formation: {
    name: 'Formation des équipes',
    icon: '🎓',
    color: '#FFB800',
    questions: [
      { id: 'fo1', question: 'Vos collaborateurs sont-ils formés à l\'AI Act ?', options: [{ label: 'Formation certifiante', score: 0 }, { label: 'Sensibilisation', score: 2 }, { label: 'Non', score: 4 }] },
      { id: 'fo2', question: 'Existe-t-il un plan de formation IA ?', options: [{ label: 'Oui', score: 0 }, { label: 'Ponctuel', score: 2 }, { label: 'Non', score: 4 }] },
      { id: 'fo3', question: 'Les nouveaux arrivants sont-ils formés ?', options: [{ label: 'Oui, onboarding', score: 0 }, { label: 'Informel', score: 2 }, { label: 'Non', score: 4 }] },
      { id: 'fo4', question: 'Les managers sont-ils formés aux enjeux IA ?', options: [{ label: 'Oui', score: 0 }, { label: 'Partiellement', score: 2 }, { label: 'Non', score: 4 }] },
      { id: 'fo5', question: 'Connaissez-vous l\'obligation Article 4 AI Act ?', options: [{ label: 'Oui, conformes', score: 0 }, { label: 'Oui, pas conforme', score: 2 }, { label: 'Non', score: 4 }] },
    ],
  },
  conformite: {
    name: 'Conformité générale',
    icon: '✅',
    color: '#00F5FF',
    questions: [
      { id: 'co1', question: 'Avez-vous réalisé un audit AI Act ?', options: [{ label: 'Oui, complet', score: 0 }, { label: 'Partiel/en cours', score: 2 }, { label: 'Non', score: 4 }] },
      { id: 'co2', question: 'Avez-vous un plan de mise en conformité ?', options: [{ label: 'Oui', score: 0 }, { label: 'En cours', score: 2 }, { label: 'Non', score: 4 }] },
      { id: 'co3', question: 'Êtes-vous conforme RGPD pour vos IA ?', options: [{ label: 'Oui', score: 0 }, { label: 'Partiellement', score: 2 }, { label: 'Non/NSP', score: 3 }] },
      { id: 'co4', question: 'Vos CGU mentionnent-elles l\'utilisation d\'IA ?', options: [{ label: 'Oui', score: 0 }, { label: 'Partiellement', score: 2 }, { label: 'Non', score: 3 }] },
      { id: 'co5', question: 'Avez-vous prévu un budget conformité AI Act ?', options: [{ label: 'Oui', score: 0 }, { label: 'Limité', score: 2 }, { label: 'Non', score: 3 }] },
    ],
  },
};

export default function AuditQuestionnairePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const plan = searchParams.get('plan') || 'starter';

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});

  const allQuestions = Object.entries(questionCategories).flatMap(([catKey, cat]) =>
    cat.questions.map(q => ({ ...q, category: catKey, categoryName: cat.name, categoryIcon: cat.icon, categoryColor: cat.color }))
  );

  const maxQuestions = plan === 'enterprise' ? 30 : plan === 'pro' ? 25 : 20;
  const questions = allQuestions.slice(0, maxQuestions);
  const totalQuestions = questions.length;
  const progress = ((currentQuestion + 1) / totalQuestions) * 100;
  const isComplete = currentQuestion >= totalQuestions;

  const handleAnswer = (score: number) => {
    const q = questions[currentQuestion];
    setAnswers({ ...answers, [q.id]: score });
    setCurrentQuestion(currentQuestion + 1);
  };

  const calculateScore = () => {
    const totalScore = Object.values(answers).reduce((a, b) => a + b, 0);
    const maxScore = totalQuestions * 4;
    return 100 - Math.round((totalScore / maxScore) * 100);
  };

  const goToResults = () => {
    const score = calculateScore();
    router.push(`/audit/results?score=${score}&plan=${plan}`);
  };

  if (isComplete) {
    const score = calculateScore();
    return (
      <div className="min-h-screen bg-[#0A0A1B] text-white">
        <NeuralBackground />
        <main className="relative z-10 max-w-3xl mx-auto px-6 py-12">
          <HoloCard glow="#00FF88">
            <div className="p-8 text-center">
              <div className="text-7xl mb-6">✅</div>
              <h2 className="text-2xl font-bold text-white mb-2">Audit terminé !</h2>
              <p className="text-white/60 mb-8">{totalQuestions} questions analysées</p>
              <div className="bg-white/5 rounded-2xl p-6 mb-8">
                <p className="text-white/60 text-sm mb-2">Votre score</p>
                <div className="text-5xl font-bold" style={{ color: score > 70 ? '#00FF88' : score > 40 ? '#FFB800' : '#FF4444' }}>
                  {score}%
                </div>
              </div>
              <button onClick={goToResults} className="w-full py-4 bg-gradient-to-r from-[#8B5CF6] to-[#00F5FF] text-white font-bold rounded-xl">
                Voir mon rapport détaillé →
              </button>
            </div>
          </HoloCard>
        </main>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];

  return (
    <div className="min-h-screen bg-[#0A0A1B] text-white">
      <NeuralBackground />
      <header className="relative z-10 border-b border-white/10 bg-black/20 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/audit" className="text-white/60 hover:text-white">← Retour</Link>
          <div className="text-center">
            <h1 className="text-lg font-bold">Audit AI Act</h1>
            <p className="text-sm text-white/60">Plan {plan}</p>
          </div>
          <p className="text-sm text-white/60">{currentQuestion + 1}/{totalQuestions}</p>
        </div>
      </header>
      <div className="relative z-10 bg-black/20">
        <div className="max-w-4xl mx-auto px-6">
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <motion.div className="h-full bg-gradient-to-r from-[#8B5CF6] to-[#00F5FF]" animate={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>
      <main className="relative z-10 max-w-3xl mx-auto px-6 py-12">
        <AnimatePresence mode="wait">
          <motion.div key={currentQuestion} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <div className="flex items-center justify-center gap-2 mb-8">
              <span className="text-2xl">{currentQ.categoryIcon}</span>
              <span className="text-sm font-medium px-3 py-1 rounded-full" style={{ backgroundColor: `${currentQ.categoryColor}20`, color: currentQ.categoryColor }}>
                {currentQ.categoryName}
              </span>
            </div>
            <HoloCard glow={currentQ.categoryColor}>
              <div className="p-8">
                <h2 className="text-xl font-semibold text-white mb-8 text-center">{currentQ.question}</h2>
                <div className="space-y-3">
                  {currentQ.options.map((option, index) => (
                    <motion.button key={index} onClick={() => handleAnswer(option.score)} className="w-full p-4 text-left rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all" whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                      {option.label}
                    </motion.button>
                  ))}
                </div>
              </div>
            </HoloCard>
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
