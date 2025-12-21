'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

// Icons
const Icons = {
  Shield: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  ArrowRight: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
  ArrowLeft: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>,
  Check: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-full h-full"><polyline points="20 6 9 17 4 12"/></svg>,
  AlertTriangle: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  X: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
};

// Questions du quiz
const questions = [
  {
    id: 1,
    question: "Votre entreprise utilise-t-elle des outils d'IA ?",
    subtitle: "ChatGPT, Copilot, CRM avec scoring, chatbots, etc.",
    options: [
      { text: "Oui, quotidiennement", score: 3, icon: "🤖" },
      { text: "Oui, occasionnellement", score: 2, icon: "💻" },
      { text: "Non, pas encore", score: 1, icon: "❌" },
      { text: "Je ne sais pas", score: 2, icon: "🤔" },
    ]
  },
  {
    id: 2,
    question: "Combien d'employés compte votre entreprise ?",
    subtitle: "Cela détermine l'ampleur de la mise en conformité",
    options: [
      { text: "1-10 employés", score: 1, icon: "👤" },
      { text: "11-50 employés", score: 2, icon: "👥" },
      { text: "51-250 employés", score: 3, icon: "🏢" },
      { text: "Plus de 250 employés", score: 4, icon: "🏙️" },
    ]
  },
  {
    id: 3,
    question: "Dans quel secteur opérez-vous ?",
    subtitle: "Certains secteurs sont plus réglementés",
    options: [
      { text: "Santé / Médical", score: 4, icon: "🏥" },
      { text: "Finance / Banque / Assurance", score: 4, icon: "🏦" },
      { text: "RH / Recrutement", score: 3, icon: "👔" },
      { text: "Industrie / Manufacturing", score: 3, icon: "🏭" },
      { text: "Services / Conseil", score: 2, icon: "💼" },
      { text: "Tech / SaaS", score: 3, icon: "💻" },
      { text: "Autre", score: 2, icon: "📦" },
    ]
  },
  {
    id: 4,
    question: "Utilisez-vous l'IA pour prendre des décisions impactant des personnes ?",
    subtitle: "Recrutement, scoring crédit, notation, diagnostic...",
    options: [
      { text: "Oui, régulièrement", score: 4, icon: "⚠️" },
      { text: "Oui, parfois", score: 3, icon: "🔶" },
      { text: "Non, jamais", score: 1, icon: "✅" },
      { text: "Je ne suis pas sûr", score: 3, icon: "❓" },
    ]
  },
  {
    id: 5,
    question: "Avez-vous déjà documenté vos systèmes d'IA ?",
    subtitle: "Inventaire, registre, documentation technique...",
    options: [
      { text: "Oui, tout est documenté", score: 1, icon: "📋" },
      { text: "Partiellement", score: 2, icon: "📝" },
      { text: "Non, pas du tout", score: 4, icon: "❌" },
      { text: "Nous n'avons pas de systèmes IA", score: 1, icon: "🚫" },
    ]
  },
  {
    id: 6,
    question: "Vos équipes ont-elles été formées à l'IA Act ?",
    subtitle: "L'Article 4 impose une obligation de formation",
    options: [
      { text: "Oui, formation complète", score: 1, icon: "🎓" },
      { text: "Sensibilisation basique", score: 2, icon: "📖" },
      { text: "Non, aucune formation", score: 4, icon: "❌" },
      { text: "Formation en cours", score: 2, icon: "⏳" },
    ]
  },
  {
    id: 7,
    question: "Avez-vous un DPO ou responsable conformité ?",
    subtitle: "Délégué à la Protection des Données ou équivalent",
    options: [
      { text: "Oui, dédié à temps plein", score: 1, icon: "👤" },
      { text: "Oui, à temps partiel", score: 2, icon: "⏰" },
      { text: "Non, pas encore", score: 3, icon: "❌" },
      { text: "Externe / Consultant", score: 2, icon: "🤝" },
    ]
  },
];

// Neural Background (simplifié)
const NeuralBackground = () => (
  <div className="fixed inset-0 pointer-events-none overflow-hidden">
    <div className="absolute inset-0 bg-[#0A0A1B]" />
    <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-[#00F5FF]/8 blur-[120px] rounded-full" />
    <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#8B5CF6]/6 blur-[100px] rounded-full" />
    <div 
      className="absolute inset-0 opacity-[0.03]" 
      style={{ 
        backgroundImage: 'linear-gradient(rgba(0, 245, 255, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 245, 255, 0.5) 1px, transparent 1px)',
        backgroundSize: '60px 60px'
      }} 
    />
  </div>
);

// HoloCard
const HoloCard = ({ children, glow = '#00F5FF', className = '' }: { children: React.ReactNode, glow?: string, className?: string }) => (
  <div className={`relative group ${className}`}>
    <div 
      className="absolute -inset-[1px] rounded-2xl opacity-50"
      style={{ background: `linear-gradient(135deg, ${glow}30, transparent 40%, transparent 60%, ${glow}30)` }}
    />
    <div className="relative bg-[#0A0A1B]/90 backdrop-blur-xl rounded-2xl border border-white/5 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent" />
      <div className="relative">{children}</div>
    </div>
  </div>
);

// Risk Level Component
const RiskLevel = ({ score, maxScore }: { score: number, maxScore: number }) => {
  const percentage = (score / maxScore) * 100;
  
  let level: { label: string, color: string, emoji: string, description: string };
  
  if (percentage <= 30) {
    level = { 
      label: "Risque Faible", 
      color: "#00FF88", 
      emoji: "✅",
      description: "Votre entreprise semble bien préparée. Une formation permettrait de valider et certifier votre conformité."
    };
  } else if (percentage <= 50) {
    level = { 
      label: "Risque Modéré", 
      color: "#FFB800", 
      emoji: "⚠️",
      description: "Des lacunes existent dans votre conformité AI Act. Une formation est recommandée pour éviter les sanctions."
    };
  } else if (percentage <= 70) {
    level = { 
      label: "Risque Élevé", 
      color: "#FF6B00", 
      emoji: "🔶",
      description: "Votre entreprise présente des risques significatifs. Une mise en conformité urgente est nécessaire."
    };
  } else {
    level = { 
      label: "Risque Critique", 
      color: "#FF4444", 
      emoji: "🚨",
      description: "Attention ! Votre entreprise est très exposée aux sanctions AI Act. Action immédiate requise."
    };
  }

  return { percentage, ...level };
};

export default function QuizPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [email, setEmail] = useState('');
  const [showEmailCapture, setShowEmailCapture] = useState(false);
  const [emailSubmitted, setEmailSubmitted] = useState(false);

  const totalQuestions = questions.length;
  const progress = ((currentQuestion) / totalQuestions) * 100;

  const handleAnswer = (score: number) => {
    const newAnswers = [...answers, score];
    setAnswers(newAnswers);

    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowEmailCapture(true);
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setAnswers(answers.slice(0, -1));
    }
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEmailSubmitted(true);
    setShowEmailCapture(false);
    setShowResults(true);
    // Ici on enverrait l'email à l'API
  };

  const skipEmail = () => {
    setShowEmailCapture(false);
    setShowResults(true);
  };

  const totalScore = answers.reduce((a, b) => a + b, 0);
  const maxScore = totalQuestions * 4; // Max 4 points par question
  const risk = RiskLevel({ score: totalScore, maxScore });

  return (
    <div className="min-h-screen bg-[#0A0A1B] text-white">
      <NeuralBackground />

      {/* Header */}
      <header className="relative z-40 px-6 py-4 border-b border-white/5">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#00F5FF] to-[#0066FF] rounded-xl flex items-center justify-center">
              <div className="w-5 h-5 text-white"><Icons.Shield /></div>
            </div>
            <span className="font-bold text-lg hidden sm:block">Formation-IA-Act.fr</span>
          </Link>

          <Link href="/" className="text-white/40 hover:text-white text-sm flex items-center gap-2">
            <div className="w-4 h-4"><Icons.X /></div>
            Fermer
          </Link>
        </div>
      </header>

      <main className="relative z-10 px-6 py-12">
        <div className="max-w-2xl mx-auto">
          
          <AnimatePresence mode="wait">
            {/* Quiz Questions */}
            {!showEmailCapture && !showResults && (
              <motion.div
                key={`question-${currentQuestion}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {/* Progress */}
                <div className="mb-8">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-white/40">Question {currentQuestion + 1}/{totalQuestions}</span>
                    <span className="text-[#00F5FF] font-medium">{Math.round(progress)}%</span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-gradient-to-r from-[#00F5FF] to-[#0066FF] rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>

                {/* Question Card */}
                <HoloCard glow="#00F5FF">
                  <div className="p-6 sm:p-8">
                    <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
                      {questions[currentQuestion].question}
                    </h2>
                    <p className="text-white/50 text-sm mb-8">
                      {questions[currentQuestion].subtitle}
                    </p>

                    {/* Options */}
                    <div className="space-y-3">
                      {questions[currentQuestion].options.map((option, i) => (
                        <motion.button
                          key={i}
                          onClick={() => handleAnswer(option.score)}
                          className="w-full p-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#00F5FF]/50 rounded-xl text-left transition-all flex items-center gap-4 group"
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                        >
                          <span className="text-2xl">{option.icon}</span>
                          <span className="text-white group-hover:text-[#00F5FF] transition-colors">
                            {option.text}
                          </span>
                          <div className="ml-auto w-5 h-5 text-white/20 group-hover:text-[#00F5FF] transition-colors">
                            <Icons.ArrowRight />
                          </div>
                        </motion.button>
                      ))}
                    </div>

                    {/* Back button */}
                    {currentQuestion > 0 && (
                      <button
                        onClick={handleBack}
                        className="mt-6 text-white/40 hover:text-white text-sm flex items-center gap-2 transition-colors"
                      >
                        <div className="w-4 h-4"><Icons.ArrowLeft /></div>
                        Question précédente
                      </button>
                    )}
                  </div>
                </HoloCard>

                {/* Reassurance */}
                <div className="mt-6 text-center">
                  <p className="text-white/30 text-sm">
                    🔒 Vos réponses sont confidentielles et ne sont pas partagées
                  </p>
                </div>
              </motion.div>
            )}

            {/* Email Capture */}
            {showEmailCapture && (
              <motion.div
                key="email-capture"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <HoloCard glow="#FFB800">
                  <div className="p-8 text-center">
                    <motion.div 
                      className="text-6xl mb-4"
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 0.5 }}
                    >
                      🎯
                    </motion.div>
                    <h2 className="text-2xl font-bold text-white mb-2">
                      Quiz terminé !
                    </h2>
                    <p className="text-white/60 mb-6">
                      Entrez votre email pour recevoir votre rapport de risque détaillé
                      <br />
                      <span className="text-[#FFB800]">+ notre checklist "10 erreurs fatales AI Act"</span>
                    </p>

                    <form onSubmit={handleEmailSubmit} className="space-y-4">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="votre@email.com"
                        required
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-[#FFB800] transition-colors"
                      />
                      <motion.button
                        type="submit"
                        className="w-full py-4 bg-gradient-to-r from-[#FFB800] to-[#FF6B00] text-black font-bold rounded-xl"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Voir mon score de risque
                      </motion.button>
                    </form>

                    <button
                      onClick={skipEmail}
                      className="mt-4 text-white/40 hover:text-white text-sm transition-colors"
                    >
                      Passer cette étape →
                    </button>

                    <p className="text-white/30 text-xs mt-4">
                      Pas de spam. Désinscription en 1 clic.
                    </p>
                  </div>
                </HoloCard>
              </motion.div>
            )}

            {/* Results */}
            {showResults && (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {/* Score Card */}
                <HoloCard glow={risk.color}>
                  <div className="p-8">
                    {/* Risk Badge */}
                    <div className="text-center mb-8">
                      <motion.div 
                        className="text-7xl mb-4"
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        {risk.emoji}
                      </motion.div>
                      <h2 className="text-3xl font-bold mb-2" style={{ color: risk.color }}>
                        {risk.label}
                      </h2>
                      <p className="text-white/60 max-w-md mx-auto">
                        {risk.description}
                      </p>
                    </div>

                    {/* Score Visual */}
                    <div className="mb-8">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-white/40">Score de risque</span>
                        <span className="font-bold" style={{ color: risk.color }}>
                          {Math.round(risk.percentage)}%
                        </span>
                      </div>
                      <div className="h-4 bg-white/5 rounded-full overflow-hidden">
                        <motion.div 
                          className="h-full rounded-full"
                          style={{ background: `linear-gradient(90deg, #00FF88, #FFB800, #FF6B00, #FF4444)` }}
                          initial={{ width: 0 }}
                          animate={{ width: `${risk.percentage}%` }}
                          transition={{ duration: 1, delay: 0.5 }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-white/30 mt-1">
                        <span>Faible</span>
                        <span>Modéré</span>
                        <span>Élevé</span>
                        <span>Critique</span>
                      </div>
                    </div>

                    {/* Key Findings */}
                    <div className="bg-white/5 rounded-xl p-5 mb-8">
                      <h3 className="text-white font-semibold mb-4">📋 Points d'attention identifiés</h3>
                      <div className="space-y-3">
                        {[
                          { condition: answers[5] >= 3, text: "Formation AI Act non réalisée (Article 4 obligatoire depuis février 2025)" },
                          { condition: answers[4] >= 3, text: "Documentation des systèmes IA insuffisante" },
                          { condition: answers[3] >= 3, text: "Utilisation de l'IA pour des décisions impactantes" },
                          { condition: answers[2] >= 3, text: "Secteur à forte réglementation" },
                        ].filter(f => f.condition).map((finding, i) => (
                          <div key={i} className="flex items-start gap-3">
                            <div className="w-5 h-5 text-[#FF6B00] flex-shrink-0 mt-0.5">
                              <Icons.AlertTriangle />
                            </div>
                            <span className="text-white/70 text-sm">{finding.text}</span>
                          </div>
                        ))}
                        {[
                          { condition: answers[5] >= 3, text: "Formation AI Act non réalisée" },
                          { condition: answers[4] >= 3, text: "Documentation insuffisante" },
                          { condition: answers[3] >= 3, text: "IA pour décisions impactantes" },
                          { condition: answers[2] >= 3, text: "Secteur réglementé" },
                        ].filter(f => f.condition).length === 0 && (
                          <div className="flex items-start gap-3">
                            <div className="w-5 h-5 text-[#00FF88] flex-shrink-0 mt-0.5">
                              <Icons.Check />
                            </div>
                            <span className="text-white/70 text-sm">Bonne base de conformité détectée</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Recommendation */}
                    <div className="border-t border-white/10 pt-6">
                      <h3 className="text-white font-semibold mb-3">💡 Nos solutions pour vous mettre en conformité</h3>
                      <p className="text-white/60 text-sm mb-6">
                        {risk.percentage > 50 
                          ? "Au vu de votre score, une action rapide est nécessaire. Choisissez la solution adaptée à vos besoins :"
                          : "Même avec un score modéré, la documentation et/ou la certification prouvent votre conformité en cas de contrôle."
                        }
                      </p>

                      {/* Dual CTA */}
                      <div className="space-y-4">
                        {/* CTA 1: Formation */}
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                          <Link 
                            href="/pricing"
                            className="flex items-center justify-between w-full p-4 bg-gradient-to-r from-[#FF6B00] to-[#FF4444] text-white font-bold rounded-xl group"
                          >
                            <div className="flex items-center gap-3">
                              <span className="text-2xl">🎓</span>
                              <div className="text-left">
                                <p className="font-bold">Formation Certifiante</p>
                                <p className="text-white/80 text-sm font-normal">6 modules + Certificat officiel</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-white/80 text-sm">À partir de 500€</span>
                              <div className="w-5 h-5 group-hover:translate-x-1 transition-transform"><Icons.ArrowRight /></div>
                            </div>
                          </Link>
                        </motion.div>

                        {/* Separator */}
                        <div className="flex items-center gap-4">
                          <div className="flex-1 h-px bg-white/10" />
                          <span className="text-white/30 text-sm">ou</span>
                          <div className="flex-1 h-px bg-white/10" />
                        </div>

                        {/* CTA 2: Templates */}
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                          <Link 
                            href="/templates"
                            className="flex items-center justify-between w-full p-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#00F5FF]/50 text-white rounded-xl group transition-all"
                          >
                            <div className="flex items-center gap-3">
                              <span className="text-2xl">📦</span>
                              <div className="text-left">
                                <p className="font-bold">Pack Templates</p>
                                <p className="text-white/60 text-sm font-normal">12 documents prêts à l'emploi</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-[#00F5FF] font-semibold">299€</span>
                              <div className="w-5 h-5 text-white/40 group-hover:text-[#00F5FF] group-hover:translate-x-1 transition-all"><Icons.ArrowRight /></div>
                            </div>
                          </Link>
                        </motion.div>
                      </div>

                      {/* Trust badges */}
                      <div className="flex flex-wrap items-center justify-center gap-4 mt-6 text-white/40 text-xs">
                        <span>✅ Certifié Qualiopi</span>
                        <span>•</span>
                        <span>🔒 Garantie 30 jours</span>
                        <span>•</span>
                        <span>💰 Finançable OPCO</span>
                      </div>
                    </div>
                  </div>
                </HoloCard>

                {/* Share / Redo */}
                <div className="mt-6 flex items-center justify-center gap-4">
                  <button 
                    onClick={() => {
                      setCurrentQuestion(0);
                      setAnswers([]);
                      setShowResults(false);
                      setShowEmailCapture(false);
                      setEmail('');
                      setEmailSubmitted(false);
                    }}
                    className="text-white/40 hover:text-white text-sm transition-colors"
                  >
                    ↻ Refaire le quiz
                  </button>
                  <span className="text-white/20">|</span>
                  <Link href="/" className="text-white/40 hover:text-white text-sm transition-colors">
                    ← Retour à l'accueil
                  </Link>
                </div>

                {/* Email reminder if skipped */}
                {!emailSubmitted && (
                  <motion.div 
                    className="mt-8"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 2 }}
                  >
                    <HoloCard glow="#FFB800">
                      <div className="p-5 flex flex-col sm:flex-row items-center gap-4">
                        <div className="text-3xl">📧</div>
                        <div className="flex-1 text-center sm:text-left">
                          <p className="text-white font-medium text-sm">Recevez votre rapport détaillé par email</p>
                          <p className="text-white/40 text-xs">+ Checklist "10 erreurs fatales AI Act"</p>
                        </div>
                        <div className="flex gap-2 w-full sm:w-auto">
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="votre@email.com"
                            className="flex-1 sm:w-48 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder-white/30 focus:outline-none focus:border-[#FFB800]"
                          />
                          <button 
                            onClick={() => setEmailSubmitted(true)}
                            className="px-4 py-2 bg-[#FFB800] text-black font-semibold rounded-lg text-sm"
                          >
                            Envoyer
                          </button>
                        </div>
                      </div>
                    </HoloCard>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </main>
    </div>
  );
}
