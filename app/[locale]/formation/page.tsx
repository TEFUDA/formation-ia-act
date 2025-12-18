'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';

// Minimal SVG Icons
const Icons = {
  Play: () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full"><polygon points="5 3 19 12 5 21 5 3"/></svg>,
  Pause: () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>,
  Check: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-full h-full"><polyline points="20 6 9 17 4 12"/></svg>,
  ChevronLeft: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><polyline points="15 18 9 12 15 6"/></svg>,
  ChevronRight: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><polyline points="9 18 15 12 9 6"/></svg>,
  X: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  Menu: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,
  Home: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  Award: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>,
  Zap: () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  Clock: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  Lightbulb: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><path d="M9 18h6"/><path d="M10 22h4"/><path d="M12 2a7 7 0 0 0-4 12.9V17h8v-2.1A7 7 0 0 0 12 2z"/></svg>,
  RotateCcw: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>,
  Trophy: () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full"><path d="M6 2h12v2H6V2zm0 4h12a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4zm6 6c1.1 0 2 .9 2 2v6h-4v-6c0-1.1.9-2 2-2zm-3 8v2h6v-2H9z"/></svg>,
};

// Module Data
const modulesData = [
  {
    id: 1,
    title: "Fondamentaux de l'AI Act",
    color: '#00F5FF',
    xp: 150,
    lessons: [
      { id: 1, title: "Origines et objectifs", duration: "10 min", keyPoints: ["Premier règlement mondial sur l'IA", "Adopté le 13 mars 2024", "Objectif : IA de confiance", "Applicable dans toute l'UE"] },
      { id: 2, title: "Calendrier d'application", duration: "8 min", keyPoints: ["Août 2024 : Entrée en vigueur", "Février 2025 : IA interdites", "Août 2025 : Transparence IA générative", "Août 2026 : Obligations complètes"] },
      { id: 3, title: "Acteurs concernés", duration: "12 min", keyPoints: ["Fournisseurs d'IA", "Déployeurs", "Importateurs", "Application extraterritoriale"] },
      { id: 4, title: "Articulation RGPD", duration: "10 min", keyPoints: ["Complémentarité des textes", "Données personnelles et IA", "Mêmes autorités de contrôle", "Sanctions cumulables"] },
      { id: 5, title: "Quiz du module", duration: "5 min", type: 'quiz' },
    ],
    quiz: [
      { q: "Quand l'AI Act est-il entré en vigueur ?", opts: ["Janvier 2024", "Août 2024", "Février 2025", "Août 2026"], correct: 1, explain: "L'AI Act est entré en vigueur en août 2024." },
      { q: "Quel article impose la formation ?", opts: ["Article 2", "Article 4", "Article 6", "Article 10"], correct: 1, explain: "L'Article 4 impose la formation obligatoire." },
      { q: "L'AI Act s'applique-t-il hors UE ?", opts: ["Non", "Oui, si utilisé en UE", "Seulement grandes entreprises", "Facultatif"], correct: 1, explain: "Application extraterritoriale pour tout système utilisé en UE." },
    ]
  },
  {
    id: 2,
    title: "Classification des Risques",
    color: '#00FF88',
    xp: 200,
    lessons: [
      { id: 1, title: "Les 4 niveaux de risque", duration: "15 min", keyPoints: ["Approche proportionnée", "Obligations selon le risque", "Classification par usage", "Reclassification possible"] },
      { id: 2, title: "IA interdites", duration: "12 min", keyPoints: ["Manipulation subliminale", "Exploitation vulnérabilités", "Scoring social", "Biométrie temps réel"] },
      { id: 3, title: "IA à haut risque", duration: "15 min", keyPoints: ["Biométrie", "Infrastructures critiques", "Éducation", "Emploi", "Services essentiels"] },
      { id: 4, title: "IA risque limité", duration: "10 min", keyPoints: ["Chatbots", "Deepfakes", "Obligation transparence", "Marquage contenu IA"] },
      { id: 5, title: "IA risque minimal", duration: "8 min", keyPoints: ["Filtres anti-spam", "Jeux vidéo", "Recommandations", "Codes volontaires"] },
      { id: 6, title: "Quiz du module", duration: "5 min", type: 'quiz' },
    ],
    quiz: [
      { q: "Combien de niveaux de risque ?", opts: ["2", "3", "4", "5"], correct: 2, explain: "4 niveaux : inacceptable, haut, limité, minimal." },
      { q: "Le scoring social est classé :", opts: ["Risque minimal", "Risque limité", "Haut risque", "Inacceptable"], correct: 3, explain: "Le scoring social est interdit (risque inacceptable)." },
      { q: "Quelle obligation pour les chatbots ?", opts: ["Aucune", "Transparence", "Certification", "Interdiction"], correct: 1, explain: "Obligation d'informer l'utilisateur qu'il parle à une IA." },
    ]
  },
  {
    id: 3,
    title: "Cartographie des Systèmes",
    color: '#FF00E5',
    xp: 250,
    lessons: [
      { id: 1, title: "Méthodologie d'audit", duration: "15 min", keyPoints: ["Définir le périmètre", "Identifier les parties prenantes", "Collecter les informations", "Documenter les usages"] },
      { id: 2, title: "Inventaire des systèmes", duration: "12 min", keyPoints: ["Systèmes internes", "Solutions SaaS", "APIs cloud", "Outils bureautiques IA"] },
      { id: 3, title: "Classification des usages", duration: "15 min", keyPoints: ["Analyser l'usage prévu", "Identifier le secteur", "Évaluer l'impact", "Documenter"] },
      { id: 4, title: "Registre IA", duration: "15 min", keyPoints: ["Informations obligatoires", "Responsable registre", "Fréquence MAJ", "Lien registre RGPD"] },
      { id: 5, title: "Évaluation d'impact", duration: "12 min", keyPoints: ["Quand la réaliser", "Méthodologie", "Parties prenantes", "Documentation"] },
      { id: 6, title: "Templates pratiques", duration: "8 min", keyPoints: ["Template registre", "Checklist audit", "Grille classification", "Modèle EIAI"] },
      { id: 7, title: "Quiz du module", duration: "5 min", type: 'quiz' },
    ],
    quiz: [
      { q: "Que contient le registre IA ?", opts: ["Systèmes internes seulement", "Tous les systèmes", "Haut risque seulement", "Achetés seulement"], correct: 1, explain: "Le registre recense TOUS les systèmes IA utilisés." },
      { q: "L'EIAI est obligatoire pour :", opts: ["Tous les systèmes", "Haut risque", "Risque minimal", "Aucun"], correct: 1, explain: "L'évaluation d'impact est obligatoire pour le haut risque." },
    ]
  },
  {
    id: 4,
    title: "Gouvernance IA",
    color: '#FFB800',
    xp: 200,
    lessons: [
      { id: 1, title: "Rôles et responsabilités", duration: "12 min", keyPoints: ["Direction générale", "DSI/CTO", "DPO", "Métiers"] },
      { id: 2, title: "Le référent IA", duration: "10 min", keyPoints: ["Profil idéal", "Missions", "Positionnement", "Compétences"] },
      { id: 3, title: "Politique IA entreprise", duration: "15 min", keyPoints: ["Principes éthiques", "Usages autorisés/interdits", "Processus validation", "Formation"] },
      { id: 4, title: "Comité de pilotage", duration: "12 min", keyPoints: ["Composition", "Fréquence", "Ordre du jour", "Indicateurs"] },
      { id: 5, title: "Quiz du module", duration: "5 min", type: 'quiz' },
    ],
    quiz: [
      { q: "Qui sponsorise la gouvernance IA ?", opts: ["Le stagiaire", "La direction", "Un consultant", "Personne"], correct: 1, explain: "La direction générale doit sponsoriser la gouvernance IA." },
      { q: "Le référent IA travaille avec :", opts: ["La DSI seulement", "Le DPO seulement", "Tous les départements", "Personne"], correct: 2, explain: "Le référent IA est un rôle transverse." },
    ]
  },
  {
    id: 5,
    title: "Systèmes Haut Risque",
    color: '#FF4444',
    xp: 300,
    lessons: [
      { id: 1, title: "Identifier le haut risque", duration: "15 min", keyPoints: ["Annexe III", "Critères classification", "Exceptions", "Cas particuliers"] },
      { id: 2, title: "Gestion des risques", duration: "12 min", keyPoints: ["Identification", "Évaluation", "Risques résiduels", "Documentation"] },
      { id: 3, title: "Data governance", duration: "15 min", keyPoints: ["Qualité données", "Représentativité", "Traçabilité", "Conservation"] },
      { id: 4, title: "Documentation technique", duration: "15 min", keyPoints: ["Contenu obligatoire", "Format", "Mise à jour", "Conservation"] },
      { id: 5, title: "Transparence", duration: "10 min", keyPoints: ["Notice utilisation", "Informations obligatoires", "Accessibilité", "Langue"] },
      { id: 6, title: "Contrôle humain", duration: "10 min", keyPoints: ["Human-in-the-loop", "Human-on-the-loop", "Human-in-command", "Formation"] },
      { id: 7, title: "Marquage CE", duration: "8 min", keyPoints: ["Procédure", "Organismes notifiés", "Déclaration conformité", "Surveillance"] },
      { id: 8, title: "Quiz du module", duration: "5 min", type: 'quiz' },
    ],
    quiz: [
      { q: "Où sont listés les systèmes haut risque ?", opts: ["Annexe I", "Annexe II", "Annexe III", "Annexe IV"], correct: 2, explain: "L'Annexe III liste les cas haut risque." },
      { q: "Le marquage CE signifie :", opts: ["Conformité RGPD", "Conformité AI Act", "Made in Europe", "ISO"], correct: 1, explain: "Le marquage CE atteste la conformité AI Act." },
    ]
  },
  {
    id: 6,
    title: "Audit & Conformité",
    color: '#8B5CF6',
    xp: 250,
    lessons: [
      { id: 1, title: "Audits internes", duration: "15 min", keyPoints: ["Planification", "Scope et objectifs", "Équipe d'audit", "Rapport et suivi"] },
      { id: 2, title: "Indicateurs conformité", duration: "12 min", keyPoints: ["KPIs", "Tableau de bord", "Alertes", "Reporting"] },
      { id: 3, title: "Amélioration continue", duration: "10 min", keyPoints: ["Cycle PDCA", "Veille réglementaire", "Retours expérience", "MAJ processus"] },
      { id: 4, title: "Préparer les contrôles", duration: "12 min", keyPoints: ["Autorités", "Pouvoirs investigation", "Documentation", "Bonnes pratiques"] },
      { id: 5, title: "Sanctions", duration: "8 min", keyPoints: ["Amendes jusqu'à 35M€", "Gradation", "Responsabilité dirigeants", "Sanctions pénales"] },
      { id: 6, title: "Quiz du module", duration: "5 min", type: 'quiz' },
    ],
    quiz: [
      { q: "Amende maximale AI Act ?", opts: ["10M€", "20M€", "35M€ ou 7% CA", "50M€"], correct: 2, explain: "Jusqu'à 35M€ ou 7% du CA mondial annuel." },
      { q: "Fréquence des audits internes ?", opts: ["Jamais", "Une fois", "Régulièrement", "Tous les 10 ans"], correct: 2, explain: "Audits réguliers, au moins annuels, recommandés." },
    ]
  },
];

// Neural Background
const NeuralBackground = () => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none">
    <div className="absolute inset-0 bg-[#030014]" />
    <div className="absolute top-[-20%] left-[-10%] w-[400px] h-[400px] rounded-full bg-[#FF00E5]/5 blur-[100px] animate-pulse" style={{ animationDuration: '8s' }} />
    <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-[#00F5FF]/5 blur-[120px] animate-pulse" style={{ animationDuration: '10s' }} />
    <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'linear-gradient(rgba(0, 245, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 245, 255, 0.1) 1px, transparent 1px)', backgroundSize: '50px 50px' }} />
  </div>
);

// Progress Ring
const ProgressRing = ({ progress, color, size = 60 }: { progress: number, color: string, size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" className="-rotate-90">
    <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
    <motion.circle
      cx="50" cy="50" r="45" fill="none" stroke={color} strokeWidth="6" strokeLinecap="round"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: progress / 100 }}
      transition={{ duration: 1, ease: [0.19, 1, 0.22, 1] }}
      style={{ filter: `drop-shadow(0 0 8px ${color})` }}
    />
  </svg>
);

export default function FormationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const moduleId = parseInt(searchParams.get('module') || '1');
  const lessonId = parseInt(searchParams.get('lesson') || '1');
  
  const [currentModule, setCurrentModule] = useState(modulesData[0]);
  const [currentLessonIdx, setCurrentLessonIdx] = useState(0);
  const [completedLessons, setCompletedLessons] = useState<number[]>([]);
  const [showSidebar, setShowSidebar] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Quiz state
  const [quizMode, setQuizMode] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [quizDone, setQuizDone] = useState(false);
  const [score, setScore] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    const mod = modulesData.find(m => m.id === moduleId);
    if (mod) {
      setCurrentModule(mod);
      setCurrentLessonIdx(Math.min(lessonId - 1, mod.lessons.length - 1));
      setCompletedLessons(Array.from({ length: Math.max(0, lessonId - 2) }, (_, i) => i + 1));
    }
  }, [moduleId, lessonId]);

  const lesson = currentModule.lessons[currentLessonIdx];
  const progress = ((currentLessonIdx + 1) / currentModule.lessons.length) * 100;
  const isQuizLesson = lesson?.type === 'quiz';
  const isLastLesson = currentLessonIdx === currentModule.lessons.length - 1;

  const goToLesson = (idx: number) => {
    setCurrentLessonIdx(idx);
    setQuizMode(false);
    setQuizDone(false);
    setAnswers([]);
    setCurrentQ(0);
    router.push(`/formation?module=${moduleId}&lesson=${idx + 1}`, { scroll: false });
  };

  const completeLesson = () => {
    if (!completedLessons.includes(currentLessonIdx + 1)) {
      setCompletedLessons([...completedLessons, currentLessonIdx + 1]);
    }
    if (isLastLesson && isQuizLesson) {
      setQuizMode(true);
    } else if (!isLastLesson) {
      goToLesson(currentLessonIdx + 1);
    }
  };

  const submitQuiz = () => {
    let correct = 0;
    currentModule.quiz.forEach((q, i) => {
      if (answers[i] === q.correct) correct++;
    });
    const s = Math.round((correct / currentModule.quiz.length) * 100);
    setScore(s);
    setQuizDone(true);
    if (s >= 80) {
      setShowCelebration(true);
    }
  };

  const retakeQuiz = () => {
    setAnswers([]);
    setCurrentQ(0);
    setQuizDone(false);
  };

  return (
    <div className="min-h-screen relative flex">
      <NeuralBackground />

      {/* Sidebar */}
      <AnimatePresence>
        {showSidebar && (
          <motion.aside
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            className="w-80 bg-[#0A0A1B]/95 backdrop-blur-xl border-r border-white/5 flex flex-col fixed lg:relative h-screen z-40"
          >
            {/* Header */}
            <div className="p-4 border-b border-white/5">
              <button onClick={() => router.push('/dashboard')} className="flex items-center gap-2 text-white/40 hover:text-white mb-4 transition-colors text-sm">
                <div className="w-4 h-4"><Icons.Home /></div>
                Dashboard
              </button>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{ background: `${currentModule.color}20` }}>
                  {moduleId === 1 ? '📋' : moduleId === 2 ? '⚠️' : moduleId === 3 ? '📊' : moduleId === 4 ? '🏛️' : moduleId === 5 ? '🔒' : '✅'}
                </div>
                <div>
                  <p className="text-white/40 text-xs">Module {currentModule.id}</p>
                  <h2 className="text-white font-semibold text-sm">{currentModule.title}</h2>
                </div>
              </div>
              
              {/* Progress */}
              <div className="mt-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-white/40">Progression</span>
                  <span style={{ color: currentModule.color }}>{Math.round(progress)}%</span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} className="h-full rounded-full" style={{ background: currentModule.color, boxShadow: `0 0 10px ${currentModule.color}50` }} />
                </div>
              </div>
            </div>

            {/* Lessons */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-2">
                {currentModule.lessons.map((l, idx) => {
                  const done = completedLessons.includes(idx + 1);
                  const current = idx === currentLessonIdx;
                  const locked = idx > 0 && !completedLessons.includes(idx);
                  
                  return (
                    <button
                      key={idx}
                      onClick={() => !locked && goToLesson(idx)}
                      disabled={locked}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left ${
                        current ? 'bg-white/10 border border-white/10' : done ? 'bg-white/5' : locked ? 'opacity-40' : 'hover:bg-white/5'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                        done ? 'text-black' : current ? 'text-black' : 'text-white/40 bg-white/5'
                      }`} style={{ background: done ? '#00FF88' : current ? currentModule.color : undefined }}>
                        {done ? <div className="w-4 h-4"><Icons.Check /></div> : idx + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium truncate ${current ? 'text-white' : done ? 'text-white/70' : 'text-white/50'}`}>{l.title}</p>
                        <p className="text-white/30 text-xs flex items-center gap-1">
                          <span className="w-3 h-3"><Icons.Clock /></span>
                          {l.duration}
                        </p>
                      </div>
                      {l.type === 'quiz' && <div className="w-4 h-4 text-yellow-400"><Icons.Award /></div>}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-white/5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/40">XP à gagner</span>
                <span className="text-yellow-400 font-bold flex items-center gap-1">
                  <div className="w-4 h-4"><Icons.Zap /></div>
                  {currentModule.xp}
                </span>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Overlay */}
      {showSidebar && <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setShowSidebar(false)} />}

      {/* Main */}
      <div className="flex-1 flex flex-col min-h-screen relative z-10">
        {/* Header */}
        <header className="bg-[#0A0A1B]/80 backdrop-blur-xl border-b border-white/5 px-4 sm:px-6 py-3 sticky top-0 z-20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={() => setShowSidebar(!showSidebar)} className="p-2 text-white/40 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                <div className="w-5 h-5"><Icons.Menu /></div>
              </button>
              <div className="hidden sm:block">
                <p className="text-white/40 text-xs">Leçon {currentLessonIdx + 1} / {currentModule.lessons.length}</p>
                <h1 className="text-white font-semibold">{lesson?.title}</h1>
              </div>
            </div>
            <button onClick={() => router.push('/dashboard')} className="p-2 text-white/40 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
              <div className="w-5 h-5"><Icons.X /></div>
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto">
          {quizMode ? (
            // Quiz View
            <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
              {!quizDone ? (
                <>
                  {/* Quiz Progress */}
                  <div className="mb-8">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-white/40">Question {currentQ + 1} / {currentModule.quiz.length}</span>
                      <span style={{ color: currentModule.color }}>{answers.filter(a => a !== undefined).length} répondue(s)</span>
                    </div>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all" style={{ width: `${((currentQ + 1) / currentModule.quiz.length) * 100}%`, background: currentModule.color }} />
                    </div>
                  </div>

                  {/* Question Card */}
                  <motion.div key={currentQ} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-[#0A0A1B]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-8">
                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-6">{currentModule.quiz[currentQ].q}</h3>
                    <div className="space-y-3">
                      {currentModule.quiz[currentQ].opts.map((opt, idx) => (
                        <button
                          key={idx}
                          onClick={() => { const na = [...answers]; na[currentQ] = idx; setAnswers(na); }}
                          className={`w-full p-4 rounded-xl text-left transition-all flex items-center gap-3 ${
                            answers[currentQ] === idx
                              ? 'border-2 text-white'
                              : 'bg-white/5 border-2 border-transparent hover:bg-white/10 text-white/70'
                          }`}
                          style={{ borderColor: answers[currentQ] === idx ? currentModule.color : 'transparent', background: answers[currentQ] === idx ? `${currentModule.color}15` : undefined }}
                        >
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${answers[currentQ] === idx ? 'text-black' : 'bg-white/10 text-white/40'}`} style={{ background: answers[currentQ] === idx ? currentModule.color : undefined }}>
                            {String.fromCharCode(65 + idx)}
                          </div>
                          {opt}
                        </button>
                      ))}
                    </div>
                  </motion.div>

                  {/* Nav */}
                  <div className="flex justify-between mt-6">
                    <button onClick={() => currentQ > 0 && setCurrentQ(currentQ - 1)} disabled={currentQ === 0} className="flex items-center gap-2 px-4 py-2 text-white/40 hover:text-white disabled:opacity-30 transition-colors">
                      <div className="w-5 h-5"><Icons.ChevronLeft /></div>
                      Précédent
                    </button>
                    {currentQ === currentModule.quiz.length - 1 ? (
                      <button onClick={submitQuiz} disabled={answers.length !== currentModule.quiz.length} className="px-6 py-2 rounded-xl font-semibold text-black disabled:opacity-50 transition-colors flex items-center gap-2" style={{ background: currentModule.color }}>
                        <div className="w-5 h-5"><Icons.Check /></div>
                        Valider
                      </button>
                    ) : (
                      <button onClick={() => setCurrentQ(currentQ + 1)} disabled={answers[currentQ] === undefined} className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl disabled:opacity-30 transition-colors">
                        Suivant
                        <div className="w-5 h-5"><Icons.ChevronRight /></div>
                      </button>
                    )}
                  </div>
                </>
              ) : (
                // Quiz Results
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
                  <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6`} style={{ background: score >= 80 ? 'rgba(0, 255, 136, 0.15)' : 'rgba(255, 107, 0, 0.15)' }}>
                    <div className="w-12 h-12" style={{ color: score >= 80 ? '#00FF88' : '#FF6B00' }}>
                      {score >= 80 ? <Icons.Trophy /> : <Icons.RotateCcw />}
                    </div>
                  </div>
                  <h2 className="text-3xl font-bold text-white mb-2">{score >= 80 ? 'Félicitations ! 🎉' : 'Pas encore...'}</h2>
                  <p className="text-white/40 mb-6">{score >= 80 ? `${score}% de bonnes réponses !` : `${score}% - Il faut 80% pour valider`}</p>
                  
                  <div className="inline-flex items-center gap-2 px-6 py-3 rounded-xl mb-8" style={{ background: score >= 80 ? 'rgba(0, 255, 136, 0.15)' : 'rgba(255, 107, 0, 0.15)' }}>
                    <span className="text-4xl font-bold" style={{ color: score >= 80 ? '#00FF88' : '#FF6B00' }}>{score}%</span>
                  </div>

                  {/* Review */}
                  <div className="text-left bg-[#0A0A1B]/80 border border-white/10 rounded-2xl p-6 mb-6">
                    <h3 className="text-white font-semibold mb-4">Révision</h3>
                    <div className="space-y-4">
                      {currentModule.quiz.map((q, idx) => {
                        const correct = answers[idx] === q.correct;
                        return (
                          <div key={idx} className="p-4 rounded-xl" style={{ background: correct ? 'rgba(0, 255, 136, 0.1)' : 'rgba(255, 68, 68, 0.1)' }}>
                            <div className="flex items-start gap-3">
                              <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0`} style={{ background: correct ? '#00FF88' : '#FF4444' }}>
                                <div className="w-3 h-3 text-white">{correct ? <Icons.Check /> : <Icons.X />}</div>
                              </div>
                              <div>
                                <p className="text-white font-medium mb-1">{q.q}</p>
                                <p className="text-sm text-white/40">Votre réponse : <span style={{ color: correct ? '#00FF88' : '#FF4444' }}>{q.opts[answers[idx]]}</span></p>
                                {!correct && <p className="text-sm text-[#00FF88] mt-1">Bonne réponse : {q.opts[q.correct]}</p>}
                                <p className="text-sm text-white/30 mt-2 italic">{q.explain}</p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex gap-3 justify-center">
                    {score < 80 && (
                      <button onClick={retakeQuiz} className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl flex items-center gap-2 transition-colors">
                        <div className="w-5 h-5"><Icons.RotateCcw /></div>
                        Recommencer
                      </button>
                    )}
                    <button onClick={() => router.push('/dashboard')} className="px-6 py-3 rounded-xl font-semibold text-black flex items-center gap-2" style={{ background: currentModule.color }}>
                      {score >= 80 ? 'Terminer' : 'Dashboard'}
                      <div className="w-5 h-5"><Icons.ChevronRight /></div>
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          ) : (
            // Lesson View
            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
              {/* Video Player */}
              <div className="bg-[#0A0A1B]/80 rounded-2xl overflow-hidden mb-6 aspect-video relative group border border-white/5">
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <button onClick={() => setIsPlaying(!isPlaying)} className="w-20 h-20 rounded-full flex items-center justify-center transition-all group-hover:scale-110" style={{ background: `${currentModule.color}20`, border: `2px solid ${currentModule.color}50` }}>
                    <div className="w-8 h-8 ml-1" style={{ color: currentModule.color }}>
                      {isPlaying ? <Icons.Pause /> : <Icons.Play />}
                    </div>
                  </button>
                  <p className="text-white/40 text-sm mt-4">Vidéo : {lesson?.title}</p>
                  <p className="text-white/30 text-xs">{lesson?.duration}</p>
                </div>
                
                {/* Progress bar */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="h-1 bg-white/20 rounded-full cursor-pointer">
                    <div className="h-full w-1/3 rounded-full relative" style={{ background: currentModule.color }}>
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Lesson Content */}
              <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <h2 className="text-2xl font-bold text-white mb-4">{lesson?.title}</h2>
                  
                  {/* Key Points */}
                  {lesson?.keyPoints && (
                    <div className="rounded-2xl p-5 mb-6 border" style={{ background: `${currentModule.color}10`, borderColor: `${currentModule.color}30` }}>
                      <h3 className="font-semibold mb-3 flex items-center gap-2" style={{ color: currentModule.color }}>
                        <div className="w-5 h-5"><Icons.Lightbulb /></div>
                        Points clés
                      </h3>
                      <ul className="space-y-2">
                        {lesson.keyPoints.map((point, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-white/70">
                            <div className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: currentModule.color }}><Icons.Check /></div>
                            {point}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Nav */}
                  <div className="flex justify-between pt-6 border-t border-white/10">
                    <button onClick={() => currentLessonIdx > 0 && goToLesson(currentLessonIdx - 1)} disabled={currentLessonIdx === 0} className="flex items-center gap-2 px-4 py-2 text-white/40 hover:text-white disabled:opacity-30 transition-colors">
                      <div className="w-5 h-5"><Icons.ChevronLeft /></div>
                      Précédent
                    </button>
                    <button onClick={completeLesson} className="px-6 py-2 rounded-xl font-semibold text-black flex items-center gap-2" style={{ background: currentModule.color }}>
                      {isLastLesson ? (
                        <>
                          <div className="w-5 h-5"><Icons.Award /></div>
                          Passer le quiz
                        </>
                      ) : (
                        <>
                          Suivant
                          <div className="w-5 h-5"><Icons.ChevronRight /></div>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Module Info */}
                <div className="space-y-4">
                  <div className="bg-[#0A0A1B]/80 border border-white/5 rounded-2xl p-4">
                    <h3 className="text-white font-semibold mb-3">Module</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-white/40">Leçons</span>
                        <span className="text-white">{currentModule.lessons.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/40">XP</span>
                        <span className="text-yellow-400 font-bold">{currentModule.xp}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Celebration Modal */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowCelebration(false)}>
            <motion.div initial={{ scale: 0.5 }} animate={{ scale: 1 }} exit={{ scale: 0.5 }} className="bg-[#0A0A1B] border border-white/10 rounded-2xl p-8 max-w-md w-full text-center" onClick={e => e.stopPropagation()}>
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-3xl font-bold text-white mb-2">Module terminé !</h2>
              <p className="text-white/40 mb-6">"{currentModule.title}" complété avec succès !</p>
              
              <div className="flex justify-center gap-6 mb-6">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-2" style={{ background: 'rgba(255, 184, 0, 0.15)' }}>
                    <div className="w-8 h-8 text-yellow-400"><Icons.Zap /></div>
                  </div>
                  <p className="text-yellow-400 font-bold text-xl">+{currentModule.xp} XP</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-2" style={{ background: 'rgba(0, 255, 136, 0.15)' }}>
                    <div className="w-8 h-8 text-[#00FF88]"><Icons.Trophy /></div>
                  </div>
                  <p className="text-[#00FF88] font-bold text-xl">{score}%</p>
                </div>
              </div>

              <button onClick={() => router.push('/dashboard')} className="w-full py-3 rounded-xl font-semibold text-black" style={{ background: currentModule.color }}>
                Retour au dashboard
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
