'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { MODULES, Module, Video, calculateModuleProgress, getNextContent } from '@/lib/formation/modules';
import { QUIZZES, getQuizByModuleId, calculateQuizScore, Quiz, QuizQuestion } from '@/lib/formation/quizzes';

// Import interactive components
import ClassificationWizard from '@/components/formation/ClassificationWizard';
import AuditSimulation from '@/components/formation/AuditSimulation';
import LegalMentionsGenerator from '@/components/formation/LegalMentionsGenerator';
import SmartEmailEditor from '@/components/formation/SmartEmailEditor';
import BrainstormingGrid from '@/components/formation/BrainstormingGrid';
import CertificateGenerator from '@/components/formation/CertificateGenerator';
import ActionPlanBuilder from '@/components/formation/ActionPlanBuilder';

// ============================================
// ICONS
// ============================================
const Icons = {
  Play: () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full"><polygon points="5 3 19 12 5 21 5 3"/></svg>,
  Pause: () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>,
  Check: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-full h-full"><polyline points="20 6 9 17 4 12"/></svg>,
  ChevronLeft: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><polyline points="15 18 9 12 15 6"/></svg>,
  ChevronRight: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><polyline points="9 18 15 12 9 6"/></svg>,
  ChevronDown: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><polyline points="6 9 12 15 18 9"/></svg>,
  X: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  Menu: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,
  Home: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  Award: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>,
  Zap: () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  Clock: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  Lock: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
  Download: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
  FileText: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
  HelpCircle: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  RotateCcw: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>,
  Trophy: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>,
  Target: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>,
};

// ============================================
// TYPES
// ============================================
type ViewMode = 'modules' | 'lesson' | 'quiz';

interface UserProgress {
  completedVideos: string[];
  quizScores: Record<number, number>;
  currentModule: number;
  currentVideo: string;
  totalXP: number;
}

// ============================================
// COMPONENTS
// ============================================

const NeuralBackground = () => (
  <div className="fixed inset-0 pointer-events-none overflow-hidden">
    <div className="absolute inset-0 bg-[#030014]" />
    <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-[#8B5CF6]/5 blur-[120px]" />
    <div className="absolute bottom-[-20%] right-[-10%] w-[800px] h-[800px] rounded-full bg-[#00F5FF]/5 blur-[150px]" />
    <div className="absolute top-[40%] left-[60%] w-[400px] h-[400px] rounded-full bg-[#00FF88]/3 blur-[100px]" />
  </div>
);

const HoloCard = ({ children, glow = '#00F5FF', className = '', onClick }: { 
  children: React.ReactNode; 
  glow?: string; 
  className?: string;
  onClick?: () => void;
}) => (
  <div className={`relative group ${className}`} onClick={onClick}>
    <div 
      className="absolute -inset-[1px] rounded-2xl opacity-0 group-hover:opacity-50 transition-opacity duration-300" 
      style={{ background: `linear-gradient(135deg, ${glow}40, transparent 50%, ${glow}40)` }} 
    />
    <div className="relative bg-[#0A0A1B]/90 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden h-full">
      <div className="relative h-full">{children}</div>
    </div>
  </div>
);

// Progress Ring Component
const ProgressRing = ({ progress, size = 60, strokeWidth = 4, color }: { 
  progress: number; 
  size?: number; 
  strokeWidth?: number;
  color: string;
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle
          className="text-white/10"
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          className="transition-all duration-500"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          stroke={color}
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-white font-bold text-sm">{progress}%</span>
      </div>
    </div>
  );
};

// Video Type Badge
const ContentBadge = ({ type, color }: { type: Video['type']; color: string }) => {
  const config = {
    video: { icon: '🎬', label: 'Vidéo' },
    exercise: { icon: '✏️', label: 'Exercice' },
    quiz: { icon: '📝', label: 'Quiz' },
    scenario: { icon: '🎭', label: 'Scénario' },
  };

  const { icon, label } = config[type];

  return (
    <span 
      className="text-xs px-2 py-1 rounded-full font-medium"
      style={{ backgroundColor: `${color}20`, color }}
    >
      {icon} {label}
    </span>
  );
};

// ============================================
// MAIN COMPONENT
// ============================================
export default function FormationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // State
  const [viewMode, setViewMode] = useState<ViewMode>('modules');
  const [selectedModule, setSelectedModule] = useState<number>(0);
  const [selectedVideoIdx, setSelectedVideoIdx] = useState<number>(0);
  const [expandedModules, setExpandedModules] = useState<number[]>([0]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Quiz State
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [showQuizResult, setShowQuizResult] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [quizAttempts, setQuizAttempts] = useState<Record<number, number>>({});

  // User Progress (persisted in localStorage)
  const [progress, setProgress] = useState<UserProgress>({
    completedVideos: [],
    quizScores: {},
    currentModule: 0,
    currentVideo: '0.1',
    totalXP: 0,
  });

  // Load progress from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('formationProgress');
    if (saved) {
      try {
        setProgress(JSON.parse(saved));
      } catch (e) {
        console.error('Error loading progress:', e);
      }
    }

    // Check URL params
    const moduleParam = searchParams.get('module');
    const videoParam = searchParams.get('video');
    const quizParam = searchParams.get('quiz');

    if (moduleParam) {
      const moduleId = parseInt(moduleParam);
      setSelectedModule(moduleId);
      setExpandedModules([moduleId]);
      
      if (quizParam === 'true') {
        setViewMode('quiz');
      } else if (videoParam) {
        setSelectedVideoIdx(parseInt(videoParam));
        setViewMode('lesson');
      }
    }
  }, [searchParams]);

  // Save progress to localStorage
  useEffect(() => {
    localStorage.setItem('formationProgress', JSON.stringify(progress));
  }, [progress]);

  // Current module and video
  const currentModule = MODULES[selectedModule];
  const currentVideo = currentModule?.videos[selectedVideoIdx];
  const currentQuiz = getQuizByModuleId(selectedModule);

  // Calculate overall progress
  const overallProgress = useMemo(() => {
    const totalVideos = MODULES.reduce((sum, m) => sum + m.videos.length, 0);
    return Math.round((progress.completedVideos.length / totalVideos) * 100);
  }, [progress.completedVideos]);

  // Module progress calculation
  const getModuleProgress = (moduleId: number) => {
    const module = MODULES[moduleId];
    if (!module) return 0;
    
    const moduleVideoIds = module.videos.map(v => `${moduleId}-${v.id}`);
    const completed = moduleVideoIds.filter(id => progress.completedVideos.includes(id)).length;
    return Math.round((completed / module.videos.length) * 100);
  };

  // Is module unlocked?
  const isModuleUnlocked = (moduleId: number) => {
    if (moduleId === 0) return true;
    const prevModule = MODULES[moduleId - 1];
    if (!prevModule) return false;
    
    // Previous module must have quiz completed with passing score
    const prevQuizScore = progress.quizScores[moduleId - 1];
    const prevQuiz = getQuizByModuleId(moduleId - 1);
    
    return prevQuizScore !== undefined && prevQuiz && prevQuizScore >= prevQuiz.passingScore;
  };

  // Is video completed?
  const isVideoCompleted = (moduleId: number, videoId: string) => {
    return progress.completedVideos.includes(`${moduleId}-${videoId}`);
  };

  // Mark video as completed
  const completeVideo = () => {
    const videoFullId = `${selectedModule}-${currentVideo.id}`;
    
    if (!progress.completedVideos.includes(videoFullId)) {
      const newProgress = {
        ...progress,
        completedVideos: [...progress.completedVideos, videoFullId],
        totalXP: progress.totalXP + 10,
      };
      setProgress(newProgress);
    }

    // Check if this was the last video before quiz
    const isLastBeforeQuiz = selectedVideoIdx === currentModule.videos.length - 2 && 
                             currentModule.videos[selectedVideoIdx + 1].type === 'quiz';
    
    if (isLastBeforeQuiz) {
      // Go to quiz
      setViewMode('quiz');
      setCurrentQuestionIdx(0);
      setQuizAnswers({});
      setShowQuizResult(false);
    } else if (selectedVideoIdx < currentModule.videos.length - 1) {
      // Go to next video
      const nextVideo = currentModule.videos[selectedVideoIdx + 1];
      if (nextVideo.type === 'quiz') {
        setViewMode('quiz');
        setCurrentQuestionIdx(0);
        setQuizAnswers({});
        setShowQuizResult(false);
      } else {
        setSelectedVideoIdx(selectedVideoIdx + 1);
      }
    }
  };

  // Handle quiz answer
  const handleQuizAnswer = (questionId: string, answerId: string) => {
    if (showFeedback) return;
    
    setSelectedAnswer(answerId);
    setQuizAnswers({ ...quizAnswers, [questionId]: answerId });
    setShowFeedback(true);
  };

  // Go to next question
  const nextQuestion = () => {
    if (!currentQuiz) return;

    setShowFeedback(false);
    setSelectedAnswer(null);

    if (currentQuestionIdx < currentQuiz.questions.length - 1) {
      setCurrentQuestionIdx(currentQuestionIdx + 1);
    } else {
      // Calculate final score
      const result = calculateQuizScore(currentQuiz, quizAnswers);
      
      // Update attempts
      const newAttempts = { ...quizAttempts, [selectedModule]: (quizAttempts[selectedModule] || 0) + 1 };
      setQuizAttempts(newAttempts);
      
      if (result.passed) {
        // Update progress
        const quizVideoId = `${selectedModule}-${currentModule.videos.find(v => v.type === 'quiz')?.id}`;
        const newProgress = {
          ...progress,
          completedVideos: progress.completedVideos.includes(quizVideoId) 
            ? progress.completedVideos 
            : [...progress.completedVideos, quizVideoId],
          quizScores: { ...progress.quizScores, [selectedModule]: result.score },
          totalXP: progress.totalXP + currentModule.xp,
        };
        setProgress(newProgress);
        setShowCelebration(true);
      }
      
      setShowQuizResult(true);
    }
  };

  // Retry quiz
  const retryQuiz = () => {
    setCurrentQuestionIdx(0);
    setQuizAnswers({});
    setShowQuizResult(false);
    setShowFeedback(false);
    setSelectedAnswer(null);
  };

  // Go to next module
  const goToNextModule = () => {
    if (selectedModule < MODULES.length - 1) {
      const nextModuleId = selectedModule + 1;
      setSelectedModule(nextModuleId);
      setSelectedVideoIdx(0);
      setExpandedModules([...expandedModules, nextModuleId]);
      setViewMode('lesson');
      setShowCelebration(false);
    } else {
      // Formation completed! Go to certificate generation
      router.push('/formation/complete');
    }
  };

  // Toggle module expansion
  const toggleModule = (moduleId: number) => {
    if (expandedModules.includes(moduleId)) {
      setExpandedModules(expandedModules.filter(id => id !== moduleId));
    } else {
      setExpandedModules([...expandedModules, moduleId]);
    }
  };

  // Select a video
  const selectVideo = (moduleId: number, videoIdx: number) => {
    const module = MODULES[moduleId];
    const video = module.videos[videoIdx];
    
    if (!isModuleUnlocked(moduleId)) return;
    
    setSelectedModule(moduleId);
    setSelectedVideoIdx(videoIdx);
    
    if (video.type === 'quiz') {
      setViewMode('quiz');
      setCurrentQuestionIdx(0);
      setQuizAnswers({});
      setShowQuizResult(false);
      setShowFeedback(false);
    } else {
      setViewMode('lesson');
    }
    
    setMobileMenuOpen(false);
  };

  // Current question for quiz
  const currentQuestion = currentQuiz?.questions[currentQuestionIdx];

  return (
    <div className="min-h-screen bg-[#030014] text-white">
      <NeuralBackground />

      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-[#0A0A1B]/95 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center justify-between px-4 py-3">
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center"
          >
            <div className="w-5 h-5 text-white">{mobileMenuOpen ? <Icons.X /> : <Icons.Menu />}</div>
          </button>
          
          <div className="flex items-center gap-2">
            <span className="text-2xl">{currentModule?.icon}</span>
            <span className="font-semibold text-sm truncate max-w-[150px]">{currentModule?.title}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 text-yellow-400"><Icons.Zap /></div>
            <span className="text-yellow-400 font-bold text-sm">{progress.totalXP}</span>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 z-40 bg-black/80"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-80 bg-[#0A0A1B]/95 backdrop-blur-xl border-r border-white/10
          transform transition-transform duration-300
          ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          pt-16 lg:pt-0 overflow-hidden flex flex-col
        `}>
          {/* Sidebar Header */}
          <div className="p-4 border-b border-white/10">
            <Link href="/dashboard" className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00F5FF] to-[#8B5CF6] flex items-center justify-center">
                <div className="w-5 h-5 text-white"><Icons.Home /></div>
              </div>
              <div>
                <p className="font-bold text-sm">Formation AI Act</p>
                <p className="text-white/50 text-xs">8 modules • 8h</p>
              </div>
            </Link>
            
            {/* Overall Progress */}
            <div className="bg-white/5 rounded-xl p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white/60 text-xs">Progression globale</span>
                <span className="text-white font-bold text-sm">{overallProgress}%</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-gradient-to-r from-[#00F5FF] to-[#8B5CF6] rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${overallProgress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-1">
                  <div className="w-4 h-4 text-yellow-400"><Icons.Zap /></div>
                  <span className="text-yellow-400 font-bold text-xs">{progress.totalXP} XP</span>
                </div>
                <span className="text-white/40 text-xs">
                  {progress.completedVideos.length} / {MODULES.reduce((sum, m) => sum + m.videos.length, 0)} contenus
                </span>
              </div>
            </div>
          </div>

          {/* Modules List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {MODULES.map((module) => {
              const isExpanded = expandedModules.includes(module.id);
              const isUnlocked = isModuleUnlocked(module.id);
              const moduleProgress = getModuleProgress(module.id);
              const isCompleted = moduleProgress === 100;

              return (
                <div key={module.id} className="rounded-xl overflow-hidden">
                  {/* Module Header */}
                  <button
                    onClick={() => isUnlocked && toggleModule(module.id)}
                    className={`w-full p-3 flex items-center gap-3 transition-all ${
                      isUnlocked 
                        ? 'hover:bg-white/5 cursor-pointer' 
                        : 'opacity-50 cursor-not-allowed'
                    } ${selectedModule === module.id ? 'bg-white/5' : ''}`}
                  >
                    {/* Module Icon / Lock */}
                    <div 
                      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: isUnlocked ? `${module.color}20` : 'rgba(255,255,255,0.05)' }}
                    >
                      {isUnlocked ? (
                        isCompleted ? (
                          <div className="w-5 h-5" style={{ color: module.color }}><Icons.Check /></div>
                        ) : (
                          <span className="text-xl">{module.icon}</span>
                        )
                      ) : (
                        <div className="w-5 h-5 text-white/30"><Icons.Lock /></div>
                      )}
                    </div>

                    {/* Module Info */}
                    <div className="flex-1 text-left min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-white/40 text-xs font-mono">{module.code}</span>
                        {isCompleted && (
                          <span className="text-xs px-1.5 py-0.5 rounded bg-green-500/20 text-green-400">✓</span>
                        )}
                      </div>
                      <p className="font-medium text-sm truncate">{module.title}</p>
                      <p className="text-white/40 text-xs">{module.duration} • {module.xp} XP</p>
                    </div>

                    {/* Expand Icon */}
                    {isUnlocked && (
                      <div className={`w-5 h-5 text-white/40 transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                        <Icons.ChevronDown />
                      </div>
                    )}
                  </button>

                  {/* Videos List */}
                  <AnimatePresence>
                    {isExpanded && isUnlocked && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="pl-4 pr-2 pb-2 space-y-1">
                          {module.videos.map((video, idx) => {
                            const isActive = selectedModule === module.id && selectedVideoIdx === idx;
                            const isComplete = isVideoCompleted(module.id, video.id);

                            return (
                              <button
                                key={video.id}
                                onClick={() => selectVideo(module.id, idx)}
                                className={`w-full p-2 rounded-lg flex items-center gap-2 text-left transition-all ${
                                  isActive 
                                    ? 'bg-white/10' 
                                    : 'hover:bg-white/5'
                                }`}
                              >
                                {/* Status Icon */}
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                                  isComplete ? 'bg-green-500/20' : 'bg-white/5'
                                }`}>
                                  {isComplete ? (
                                    <div className="w-3 h-3 text-green-400"><Icons.Check /></div>
                                  ) : (
                                    <span className="text-white/40 text-xs">{idx + 1}</span>
                                  )}
                                </div>

                                {/* Video Info */}
                                <div className="flex-1 min-w-0">
                                  <p className={`text-xs truncate ${isActive ? 'text-white' : 'text-white/70'}`}>
                                    {video.title}
                                  </p>
                                  <div className="flex items-center gap-2 mt-0.5">
                                    <ContentBadge type={video.type} color={module.color} />
                                    <span className="text-white/30 text-xs">{video.duration} min</span>
                                  </div>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 lg:ml-0 pt-16 lg:pt-4 pb-20 lg:pb-24 h-[100dvh] overflow-hidden flex flex-col">
          <AnimatePresence mode="wait">
            {viewMode === 'lesson' && currentVideo && (
              <motion.div
                key="lesson"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="p-4 lg:p-8 pb-24"
              >
                {/* Video Header - TOUJOURS VISIBLE */}
                <div className="mb-2 lg:mb-4 bg-[#0A0A1B]/80 -mx-4 lg:-mx-8 px-4 lg:px-8 py-2 lg:py-3 z-10 backdrop-blur-xl border-b border-white/5 flex-shrink-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span 
                      className="text-[10px] lg:text-xs font-medium px-2 lg:px-3 py-1 rounded-full"
                      style={{ backgroundColor: `${currentModule.color}20`, color: currentModule.color }}
                    >
                      {currentModule.icon} {currentModule.code} - {currentModule.title}
                    </span>
                    <ContentBadge type={currentVideo.type} color={currentModule.color} />
                  </div>
                  <h1 className="text-base lg:text-xl font-bold text-white leading-tight">{currentVideo.title}</h1>
                  {currentVideo.description && (
                    <p className="text-white/60 text-xs lg:text-sm mt-0.5 line-clamp-1">{currentVideo.description}</p>
                  )}
                </div>

                {/* Video Player - Uniquement pour les vidéos */}
                {currentVideo.type === 'video' && (
                  <HoloCard glow={currentModule.color} className="mb-4 max-h-[60vh] overflow-y-auto">
                    <div className="aspect-[16/9] max-h-[50vh] bg-black/50 relative flex items-center justify-center">
                      <button 
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="w-20 h-20 rounded-full flex items-center justify-center transition-all hover:scale-110"
                        style={{ backgroundColor: currentModule.color }}
                      >
                        <div className="w-8 h-8 text-black ml-1">
                          {isPlaying ? <Icons.Pause /> : <Icons.Play />}
                        </div>
                      </button>
                      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                        <div className="flex items-center gap-4">
                          <span className="text-white/60 text-sm">
                            {currentVideo.duration 
                              ? (currentVideo.duration.includes('min') || currentVideo.duration.includes('h') 
                                  ? currentVideo.duration 
                                  : `${currentVideo.duration} min`)
                              : ''}
                          </span>
                          <div className="flex-1 h-1 bg-white/20 rounded-full">
                            <div 
                              className="h-full rounded-full" 
                              style={{ width: '0%', backgroundColor: currentModule.color }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </HoloCard>
                )}

                {/* Exercices Interactifs - SANS limite de taille */}
                {currentVideo.type === 'exercise' && (
                  <HoloCard glow={currentModule.color} className="mb-4 max-h-[60vh] overflow-y-auto">
                    <div className="p-6">
                      {/* Module 1 - Checklist */}
                      {currentVideo.id === '1.2' && (
                        <div className="text-center py-8">
                          <div className="text-6xl mb-4">📋</div>
                          <h3 className="text-xl font-bold mb-2">Checklist "Êtes-vous concerné ?"</h3>
                          <p className="text-white/60 mb-6 max-w-md mx-auto">
                            Téléchargez le fichier Excel et remplissez-le pour déterminer si votre entreprise est concernée par l'AI Act.
                          </p>
                          {currentVideo.exerciseFile && (
                            <a
                              href={`/resources/${currentVideo.exerciseFile}`}
                              download
                              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-black transition-all hover:scale-105"
                              style={{ backgroundColor: currentModule.color }}
                            >
                              <div className="w-5 h-5"><Icons.Download /></div>
                              Télécharger la checklist
                            </a>
                          )}
                        </div>
                      )}
                      
                      {/* Module 2 - Exercice 1: Brainstorming */}
                      {currentVideo.id === '2.2' && (
                        <BrainstormingGrid 
                          moduleColor={currentModule.color}
                          onComplete={() => completeVideo()}
                        />
                      )}
                      
                      {/* Module 2 - Exercice 2: Registre */}
                      {currentVideo.id === '2.4' && (
                        <div className="text-center py-8">
                          <div className="text-6xl mb-4">📊</div>
                          <h3 className="text-xl font-bold mb-2">Registre des Systèmes IA</h3>
                          <p className="text-white/60 mb-6 max-w-md mx-auto">
                            Utilisez ce template pour créer votre registre officiel des systèmes d'IA.
                          </p>
                          {currentVideo.exerciseFile && (
                            <a
                              href={`/resources/${currentVideo.exerciseFile}`}
                              download
                              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-black transition-all hover:scale-105"
                              style={{ backgroundColor: currentModule.color }}
                            >
                              <div className="w-5 h-5"><Icons.Download /></div>
                              Télécharger le template
                            </a>
                          )}
                        </div>
                      )}
                      
                      {/* Module 3 - Classification */}
                      {currentVideo.id === '3.2' && (
                        <ClassificationWizard 
                          moduleColor={currentModule.color}
                          onComplete={() => completeVideo()}
                        />
                      )}
                      
                      {/* Module 4 - Email fournisseur */}
                      {currentVideo.id === '4.2' && (
                        <SmartEmailEditor 
                          moduleColor={currentModule.color}
                          onComplete={() => completeVideo()}
                        />
                      )}
                      
                      {/* Module 5 - Mentions légales */}
                      {currentVideo.id === '5.4' && (
                        <LegalMentionsGenerator 
                          moduleColor={currentModule.color}
                          onComplete={() => completeVideo()}
                        />
                      )}
                      
                      {/* Module 7 - Plan d'action 90 jours */}
                      {currentVideo.id === '7.2' && (
                        <ActionPlanBuilder 
                          moduleColor={currentModule.color}
                          onComplete={() => completeVideo()}
                        />
                      )}
                      
                      {/* Default: exercices non interactifs avec fichier à télécharger */}
                      {!['1.2', '2.2', '2.4', '3.2', '4.2', '5.4', '7.2'].includes(currentVideo.id) && 
                       currentVideo.exerciseFile && (
                        <div className="text-center py-8">
                          <div className="text-6xl mb-4">✏️</div>
                          <h3 className="text-xl font-bold mb-2">Exercice Pratique</h3>
                          <p className="text-white/60 mb-6 max-w-md mx-auto">
                            Durée estimée : {currentVideo.exerciseDuration}
                          </p>
                          <a
                            href={`/resources/${currentVideo.exerciseFile}`}
                            download
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-black transition-all hover:scale-105"
                            style={{ backgroundColor: currentModule.color }}
                          >
                            <div className="w-5 h-5"><Icons.Download /></div>
                            Télécharger le fichier
                          </a>
                        </div>
                      )}
                    </div>
                  </HoloCard>
                )}

                {/* Scénarios Interactifs */}
                {currentVideo.type === 'scenario' && (
                  <HoloCard glow={currentModule.color} className="mb-4 max-h-[60vh] overflow-y-auto">
                    <div className="p-6">
                      {currentModule.id === 6 ? (
                        <AuditSimulation 
                          moduleColor={currentModule.color}
                          onComplete={(score) => {
                            completeVideo();
                          }}
                        />
                      ) : (
                        <div className="text-center py-8">
                          <div className="text-6xl mb-4">🎭</div>
                          <h3 className="text-xl font-bold mb-2">Scénario Interactif</h3>
                          <p className="text-white/60 mb-6 max-w-md mx-auto">
                            Simulation avec timer et documents à produire
                          </p>
                          <button
                            onClick={() => completeVideo()}
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-black transition-all hover:scale-105"
                            style={{ backgroundColor: currentModule.color }}
                          >
                            <div className="w-5 h-5"><Icons.Target /></div>
                            Lancer la simulation
                          </button>
                        </div>
                      )}
                    </div>
                  </HoloCard>
                )}

                {/* Navigation - Barre fixe en bas */}
                <div className="fixed bottom-0 left-0 right-0 lg:left-80 bg-[#0A0A1B]/95 backdrop-blur-xl border-t border-white/10 p-4 z-40">
                  <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <button
                      onClick={() => selectedVideoIdx > 0 && setSelectedVideoIdx(selectedVideoIdx - 1)}
                      disabled={selectedVideoIdx === 0}
                      className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white/10 text-white hover:bg-white/20 disabled:opacity-30 disabled:bg-white/5 transition-all font-medium"
                    >
                      <div className="w-5 h-5"><Icons.ChevronLeft /></div>
                      Précédent
                    </button>
                    
                    <button
                      onClick={completeVideo}
                      className="px-8 py-4 rounded-xl font-bold text-black flex items-center gap-2 transition-all hover:scale-105 shadow-xl"
                      style={{ backgroundColor: currentModule.color }}
                    >
                      {selectedVideoIdx === currentModule.videos.length - 1 || 
                       currentModule.videos[selectedVideoIdx + 1]?.type === 'quiz' ? (
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
              </motion.div>
            )}

            {viewMode === 'quiz' && currentQuiz && (
              <motion.div
                key="quiz"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="p-4 lg:p-8 pt-20 lg:pt-8 pb-28 max-w-3xl mx-auto"
              >
                {!showQuizResult ? (
                  <>
                    {/* Quiz Header - VISIBLE */}
                    <div className="mb-6 bg-[#0A0A1B]/80 -mx-4 lg:-mx-8 px-4 lg:px-8 py-4 rounded-xl border border-white/10">
                      <div className="flex items-center justify-between mb-2">
                        <span 
                          className="text-sm font-medium px-3 py-1.5 rounded-full"
                          style={{ backgroundColor: `${currentModule.color}20`, color: currentModule.color }}
                        >
                          {currentModule.icon} {currentModule.code} - Quiz
                        </span>
                        <span className="text-white/60 text-sm font-medium">
                          Question {currentQuestionIdx + 1} / {currentQuiz.questions.length}
                        </span>
                      </div>
                      <h1 className="text-xl lg:text-2xl font-bold text-white">{currentQuiz.title}</h1>
                      
                      {/* Progress Bar */}
                      <div className="mt-4 h-2 bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ backgroundColor: currentModule.color }}
                          initial={{ width: 0 }}
                          animate={{ width: `${((currentQuestionIdx + 1) / currentQuiz.questions.length) * 100}%` }}
                        />
                      </div>
                    </div>

                    {/* Question Card */}
                    {currentQuestion && (
                      <HoloCard glow={currentModule.color} className="mb-6">
                        <div className="p-6">
                          <h2 className="text-xl font-semibold mb-6">{currentQuestion.question}</h2>
                          
                          <div className="space-y-3">
                            {currentQuestion.options.map((option, idx) => {
                              const isSelected = selectedAnswer === option.id;
                              const isCorrect = option.isCorrect;
                              const showResult = showFeedback;

                              return (
                                <button
                                  key={option.id}
                                  onClick={() => handleQuizAnswer(currentQuestion.id, option.id)}
                                  disabled={showFeedback}
                                  className={`w-full p-4 rounded-xl text-left transition-all flex items-center gap-4 ${
                                    showResult
                                      ? isCorrect
                                        ? 'bg-green-500/20 border-2 border-green-500'
                                        : isSelected
                                          ? 'bg-red-500/20 border-2 border-red-500'
                                          : 'bg-white/5 border-2 border-transparent'
                                      : isSelected
                                        ? 'bg-white/10 border-2'
                                        : 'bg-white/5 border-2 border-transparent hover:bg-white/10'
                                  }`}
                                  style={isSelected && !showResult ? { borderColor: currentModule.color } : {}}
                                >
                                  <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${
                                    showResult
                                      ? isCorrect
                                        ? 'bg-green-500 text-white'
                                        : isSelected
                                          ? 'bg-red-500 text-white'
                                          : 'bg-white/10 text-white/60'
                                      : isSelected
                                        ? 'text-black'
                                        : 'bg-white/10 text-white/60'
                                  }`} style={isSelected && !showResult ? { backgroundColor: currentModule.color } : {}}>
                                    {String.fromCharCode(65 + idx)}
                                  </span>
                                  <span className="flex-1">{option.text}</span>
                                  {showResult && isCorrect && (
                                    <div className="w-6 h-6 text-green-400"><Icons.Check /></div>
                                  )}
                                </button>
                              );
                            })}
                          </div>

                          {/* Feedback */}
                          <AnimatePresence>
                            {showFeedback && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mt-6 overflow-hidden"
                              >
                                <div 
                                  className="p-4 rounded-xl"
                                  style={{ 
                                    backgroundColor: currentQuestion.options.find(o => o.id === selectedAnswer)?.isCorrect 
                                      ? 'rgba(34, 197, 94, 0.1)' 
                                      : 'rgba(239, 68, 68, 0.1)',
                                    borderColor: currentQuestion.options.find(o => o.id === selectedAnswer)?.isCorrect 
                                      ? 'rgba(34, 197, 94, 0.3)' 
                                      : 'rgba(239, 68, 68, 0.3)',
                                    borderWidth: 1,
                                  }}
                                >
                                  <p className={`font-medium mb-1 ${
                                    currentQuestion.options.find(o => o.id === selectedAnswer)?.isCorrect 
                                      ? 'text-green-400' 
                                      : 'text-red-400'
                                  }`}>
                                    {currentQuestion.options.find(o => o.id === selectedAnswer)?.isCorrect 
                                      ? '✓ Bonne réponse !' 
                                      : '✗ Mauvaise réponse'}
                                  </p>
                                  <p className="text-white/70 text-sm">{currentQuestion.feedback}</p>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </HoloCard>
                    )}

                    {/* Navigation Quiz - Barre fixe en bas */}
                    {showFeedback && (
                      <div className="fixed bottom-0 left-0 right-0 lg:left-80 bg-[#0A0A1B]/95 backdrop-blur-xl border-t border-white/10 p-4 z-40">
                        <div className="max-w-3xl mx-auto flex justify-end">
                          <button
                            onClick={nextQuestion}
                            className="px-8 py-4 rounded-xl font-bold text-black flex items-center gap-2 shadow-xl transition-all hover:scale-105"
                            style={{ backgroundColor: currentModule.color }}
                          >
                            {currentQuestionIdx < currentQuiz.questions.length - 1 ? (
                              <>
                                Question suivante
                                <div className="w-5 h-5"><Icons.ChevronRight /></div>
                              </>
                            ) : (
                              <>
                                Voir les résultats
                                <div className="w-5 h-5"><Icons.Award /></div>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  /* Quiz Results */
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    {(() => {
                      const result = calculateQuizScore(currentQuiz, quizAnswers);
                      const passed = result.passed;
                      const attempts = quizAttempts[selectedModule] || 1;
                      const canRetry = attempts < currentQuiz.maxAttempts;

                      return (
                        <HoloCard glow={passed ? '#00FF88' : '#FF4444'}>
                          <div className="p-8 text-center">
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: 'spring', delay: 0.2 }}
                              className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 ${
                                passed ? 'bg-green-500' : 'bg-red-500'
                              }`}
                            >
                              {passed ? (
                                <div className="w-12 h-12 text-white"><Icons.Trophy /></div>
                              ) : (
                                <div className="w-12 h-12 text-white"><Icons.X /></div>
                              )}
                            </motion.div>

                            <h2 className="text-3xl font-bold mb-2">
                              {passed ? 'Bravo ! Quiz réussi 🎉' : 'Quiz non validé'}
                            </h2>
                            <p className="text-white/60 mb-8">
                              {passed 
                                ? `Vous avez obtenu ${result.score}% et débloqué le module suivant !`
                                : `Score insuffisant. ${canRetry ? 'Vous pouvez réessayer.' : 'Revoyez le module.'}`
                              }
                            </p>

                            {/* Score Display */}
                            <div className="flex justify-center gap-8 mb-8">
                              <div className="text-center">
                                <div className={`text-5xl font-bold ${passed ? 'text-green-400' : 'text-red-400'}`}>
                                  {result.score}%
                                </div>
                                <p className="text-white/40 text-sm">Votre score</p>
                              </div>
                              <div className="text-center">
                                <div className="text-5xl font-bold text-white/40">
                                  {currentQuiz.passingScore}%
                                </div>
                                <p className="text-white/40 text-sm">Requis</p>
                              </div>
                            </div>

                            {/* Details */}
                            <div className="bg-white/5 rounded-xl p-4 mb-6">
                              <div className="flex items-center justify-between">
                                <span className="text-white/60">Réponses correctes</span>
                                <span className="text-white font-medium">
                                  {result.correctCount} / {result.totalCount}
                                </span>
                              </div>
                            </div>

                            {/* XP Gain */}
                            {passed && (
                              <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex items-center justify-center gap-2 mb-6 text-yellow-400"
                              >
                                <div className="w-6 h-6"><Icons.Zap /></div>
                                <span className="font-bold text-lg">+{currentModule.xp} XP gagnés !</span>
                              </motion.div>
                            )}

                            {/* Actions */}
                            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                              {!passed && canRetry && (
                                <button
                                  onClick={retryQuiz}
                                  className="flex items-center justify-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 font-semibold rounded-xl transition-all"
                                >
                                  <div className="w-5 h-5"><Icons.RotateCcw /></div>
                                  Réessayer ({currentQuiz.maxAttempts - attempts} essai{currentQuiz.maxAttempts - attempts > 1 ? 's' : ''} restant{currentQuiz.maxAttempts - attempts > 1 ? 's' : ''})
                                </button>
                              )}
                              
                              {passed && (
                                <button
                                  onClick={goToNextModule}
                                  className="flex items-center justify-center gap-2 px-6 py-3 font-semibold rounded-xl text-black"
                                  style={{ backgroundColor: currentModule.color }}
                                >
                                  {selectedModule < MODULES.length - 1 ? (
                                    <>
                                      Module suivant
                                      <div className="w-5 h-5"><Icons.ChevronRight /></div>
                                    </>
                                  ) : (
                                    <>
                                      Obtenir mon certificat
                                      <div className="w-5 h-5"><Icons.Award /></div>
                                    </>
                                  )}
                                </button>
                              )}
                            </div>
                          </div>
                        </HoloCard>
                      );
                    })()}
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* Celebration Modal */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
            onClick={() => setShowCelebration(false)}
          >
            <motion.div
              initial={{ scale: 0.5, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0.5 }}
              className="bg-[#0A0A1B] border border-white/10 rounded-2xl p-8 max-w-md w-full text-center"
              onClick={e => e.stopPropagation()}
            >
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-3xl font-bold mb-2">Module terminé !</h2>
              <p className="text-white/60 mb-6">"{currentModule.title}" complété avec succès !</p>
              
              <div className="flex justify-center gap-8 mb-6">
                <div className="text-center">
                  <div 
                    className="w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-2"
                    style={{ backgroundColor: `${currentModule.color}20` }}
                  >
                    <div className="w-8 h-8 text-yellow-400"><Icons.Zap /></div>
                  </div>
                  <p className="text-yellow-400 font-bold text-xl">+{currentModule.xp} XP</p>
                </div>
              </div>

              <button
                onClick={goToNextModule}
                className="w-full py-3 rounded-xl font-semibold text-black"
                style={{ backgroundColor: currentModule.color }}
              >
                {selectedModule < MODULES.length - 1 ? 'Module suivant' : 'Obtenir mon certificat'}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
