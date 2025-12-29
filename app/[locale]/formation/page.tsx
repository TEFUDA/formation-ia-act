'use client';

import { useState, useEffect, useMemo, useCallback, useRef, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { MODULES, Module, Video } from '@/lib/formation/modules';
import { getQuizByModuleId, calculateQuizScore } from '@/lib/formation/quizzes';

// Import interactive components (legacy)
import ClassificationWizard from '@/components/formation/ClassificationWizard';
import AuditSimulation from '@/components/formation/AuditSimulation';
import SmartEmailEditor from '@/components/formation/SmartEmailEditor';
import BrainstormingGrid from '@/components/formation/BrainstormingGrid';
import LegalMentionsGenerator from '@/components/formation/LegalMentionsGenerator';
import ActionPlanBuilder from '@/components/formation/ActionPlanBuilder';

// Import new workshops
import {
  DiagnosticWorkshop,
  InventorySpreadsheet,
  RegistrySpreadsheet,
  ClassificationWorkshop,
  EmailGeneratorWorkshop,
  PolicyGeneratorWorkshop,
  ActionPlanSpreadsheet,
} from '@/components/formation/workshops';

// ============================================
// GAMIFICATION CONFIG
// ============================================
const LEVELS = [
  { level: 1, name: 'Novice', minXP: 0, badge: '🌱', color: '#6B7280', nextXP: 500 },
  { level: 2, name: 'Initié', minXP: 500, badge: '🔵', color: '#3B82F6', nextXP: 1500 },
  { level: 3, name: 'Praticien', minXP: 1500, badge: '🟣', color: '#8B5CF6', nextXP: 3000 },
  { level: 4, name: 'Expert', minXP: 3000, badge: '🟠', color: '#F59E0B', nextXP: 5000 },
  { level: 5, name: 'Maître AI Act', minXP: 5000, badge: '👑', color: '#FFD700', nextXP: 10000 },
];

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
  Lock: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
  Download: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
  Bookmark: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>,
  BookmarkFilled: () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>,
  Fire: () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full"><path d="M12 2c-1.5 2-3 3.5-3 6 0 1.5.5 2.5 1.5 3.5-1-.5-2-2-2-3.5 0 0-2.5 3-2.5 6.5 0 4 3 7 6 7s6-3 6-7c0-2-1-4-2.5-5.5 0 1.5-.5 2.5-1.5 3-.5-2-2-4-2-9z"/></svg>,
  Trophy: () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18M4 22h16M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>,
  Target: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>,
  Edit: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
};

// ============================================
// TYPES
// ============================================
type ViewMode = 'lesson' | 'quiz';

interface UserProgress {
  completedVideos: string[];
  quizScores: Record<number, number>;
  currentModule: number;
  currentVideo: string;
  totalXP: number;
  streak: number;
  lastActiveDate: string;
  lessonsToday: number;
  minutesToday: number;
  quizzesToday: number;
  notes: Record<string, string>;
  bookmarks: string[];
}

// ============================================
// HELPER FUNCTIONS
// ============================================
const getCurrentLevel = (xp: number) => {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].minXP) return LEVELS[i];
  }
  return LEVELS[0];
};

// ============================================
// COMPONENTS
// ============================================

// Neural Background
const NeuralBackground = () => (
  <div className="fixed inset-0 pointer-events-none overflow-hidden">
    <div className="absolute inset-0 bg-[#030014]" />
    <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-[#8B5CF6]/5 blur-[120px]" />
    <div className="absolute bottom-[-20%] right-[-10%] w-[800px] h-[800px] rounded-full bg-[#00F5FF]/5 blur-[150px]" />
  </div>
);

// Streak Badge
const StreakBadge = ({ streak }: { streak: number }) => (
  <div className={`flex items-center gap-1 px-2 py-1 rounded-lg ${streak > 0 ? 'bg-orange-500/20 text-orange-400' : 'bg-white/5 text-white/40'}`}>
    <div className="w-4 h-4"><Icons.Fire /></div>
    <span className="font-bold text-sm">{streak}</span>
  </div>
);

// Daily Goals Component
const DailyGoals = ({ progress }: { progress: UserProgress }) => {
  const goals = [
    { id: 'lessons', current: progress.lessonsToday || 0, target: 3, label: 'Leçons', icon: '📖' },
    { id: 'minutes', current: progress.minutesToday || 0, target: 30, label: 'Minutes', icon: '⏱️' },
    { id: 'quiz', current: progress.quizzesToday || 0, target: 1, label: 'Quiz', icon: '📝' },
  ];

  const completedCount = goals.filter(g => g.current >= g.target).length;

  return (
    <div className="bg-white/5 rounded-xl p-3 border border-white/10">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 text-[#00F5FF]"><Icons.Target /></div>
          <span className="font-semibold text-sm">Objectifs du jour</span>
        </div>
        <span className="text-xs text-white/60">{completedCount}/3 ✓</span>
      </div>
      <div className="space-y-2">
        {goals.map(goal => {
          const percent = Math.min(100, (goal.current / goal.target) * 100);
          const isComplete = goal.current >= goal.target;
          return (
            <div key={goal.id} className="flex items-center gap-2">
              <span className="text-sm">{goal.icon}</span>
              <div className="flex-1">
                <div className="flex justify-between text-xs mb-0.5">
                  <span className="text-white/60">{goal.label}</span>
                  <span className={isComplete ? 'text-green-400' : 'text-white/40'}>
                    {goal.current}/{goal.target} {isComplete && '+50 XP'}
                  </span>
                </div>
                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all ${isComplete ? 'bg-green-500' : 'bg-[#8B5CF6]'}`}
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Video Player Component (Placeholder)
// Helper function to convert YouTube URLs to embed format
const getYouTubeEmbedUrl = (url: string): string | null => {
  if (!url) return null;
  const shortMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
  if (shortMatch) return `https://www.youtube.com/embed/${shortMatch[1]}`;
  const longMatch = url.match(/youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/);
  if (longMatch) return `https://www.youtube.com/embed/${longMatch[1]}`;
  if (url.includes('youtube.com/embed/')) return url;
  return null;
};

const VideoPlayer = ({ video, module, isPlaying, onPlayPause, onComplete, isCompleted }: {
  video: Video;
  module: Module;
  isPlaying: boolean;
  onPlayPause: () => void;
  onComplete: () => void;
  isCompleted: boolean;
}) => {
  const embedUrl = video.videoUrl ? getYouTubeEmbedUrl(video.videoUrl) : null;
  
  return (
    <div className="flex-1 bg-white/5 rounded-2xl overflow-hidden border border-white/10 flex flex-col">
      {/* Video Area */}
      <div className="flex-1 bg-gradient-to-br from-black/50 to-black/30 relative flex items-center justify-center min-h-[300px] sm:min-h-[400px] lg:min-h-[500px]">
        {embedUrl ? (
          <iframe
            src={`${embedUrl}?rel=0&modestbranding=1`}
            title={video.title}
            className="absolute inset-0 w-full h-full"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <div className="text-center">
            <button
              onClick={onPlayPause}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center transition-all hover:scale-110 mb-4"
              style={{ backgroundColor: module.color }}
            >
              <div className="w-6 h-6 sm:w-8 sm:h-8 text-black ml-1">
                {isPlaying ? <Icons.Pause /> : <Icons.Play />}
              </div>
            </button>
            <p className="text-white/40 text-sm">🎬 Vidéo en cours de production</p>
            <p className="text-white/20 text-xs mt-1">{video.duration}</p>
          </div>
        )}
        
        {/* Progress bar - only show for placeholder */}
        {!embedUrl && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
            <div 
              className="h-full transition-all"
              style={{ 
                width: isCompleted ? '100%' : '0%',
                backgroundColor: module.color 
              }}
            />
          </div>
        )}
      </div>
      
      {/* Controls */}
      <div className="p-3 bg-black/30 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="text-sm text-white/60">{video.duration}</div>
          {embedUrl && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/20 text-red-400">
              ▶ YouTube
            </span>
          )}
        </div>
        {!isCompleted && (
          <button
            onClick={onComplete}
            className="text-xs px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
          >
            Marquer comme vu ✓
          </button>
        )}
        {isCompleted && (
          <span className="text-xs text-green-400 flex items-center gap-1">
            <div className="w-3 h-3"><Icons.Check /></div> Complété
          </span>
        )}
      </div>
    </div>
  );
};

// ============================================
// MAIN COMPONENT
// ============================================
function FormationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // State
  const [viewMode, setViewMode] = useState<ViewMode>('lesson');
  const [selectedModule, setSelectedModule] = useState(0);
  const [selectedVideoIdx, setSelectedVideoIdx] = useState(0);
  const [expandedModules, setExpandedModules] = useState<number[]>([0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showRightPanel, setShowRightPanel] = useState(true);

  // Quiz State
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [showQuizResult, setShowQuizResult] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  // User Progress
  const [progress, setProgress] = useState<UserProgress>({
    completedVideos: [],
    quizScores: {},
    currentModule: 0,
    currentVideo: '0.1',
    totalXP: 0,
    streak: 0,
    lastActiveDate: '',
    lessonsToday: 0,
    minutesToday: 0,
    quizzesToday: 0,
    notes: {},
    bookmarks: [],
  });

  // Notes state
  const [currentNote, setCurrentNote] = useState('');

  // Load progress
  useEffect(() => {
    const saved = localStorage.getItem('formationProgress');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setProgress({
          completedVideos: parsed.completedVideos || [],
          quizScores: parsed.quizScores || {},
          currentModule: parsed.currentModule || 0,
          currentVideo: parsed.currentVideo || '0.1',
          totalXP: parsed.totalXP || 0,
          streak: parsed.streak || 0,
          lastActiveDate: parsed.lastActiveDate || '',
          lessonsToday: parsed.lessonsToday || 0,
          minutesToday: parsed.minutesToday || 0,
          quizzesToday: parsed.quizzesToday || 0,
          notes: parsed.notes || {},
          bookmarks: parsed.bookmarks || [],
        });
      } catch (e) {
        console.error('Error loading progress:', e);
      }
    }

    // Handle URL params
    const moduleParam = searchParams.get('module');
    if (moduleParam) {
      const moduleId = parseInt(moduleParam);
      setSelectedModule(moduleId);
      setExpandedModules([moduleId]);
    }
  }, [searchParams]);

  // Save progress
  useEffect(() => {
    localStorage.setItem('formationProgress', JSON.stringify(progress));
  }, [progress]);

  // Current data
  const currentModule = MODULES[selectedModule] || MODULES[0];
  const currentVideo = currentModule?.videos[selectedVideoIdx];
  const currentQuiz = getQuizByModuleId(selectedModule);
  const currentQuestion = currentQuiz?.questions[currentQuestionIdx];
  const currentLevel = getCurrentLevel(progress.totalXP || 0);

  // Calculate overall progress
  const overallProgress = useMemo(() => {
    const totalVideos = MODULES.reduce((sum, m) => sum + m.videos.length, 0);
    return Math.round(((progress.completedVideos?.length || 0) / totalVideos) * 100);
  }, [progress.completedVideos]);

  // Module progress
  const getModuleProgress = (moduleId: number) => {
    const module = MODULES[moduleId];
    if (!module) return 0;
    const moduleVideoIds = module.videos.map(v => `${moduleId}-${v.id}`);
    const completed = moduleVideoIds.filter(id => (progress.completedVideos || []).includes(id)).length;
    return Math.round((completed / module.videos.length) * 100);
  };

  // Is module unlocked?
  const isModuleUnlocked = (moduleId: number) => {
    if (moduleId === 0) return true;
    const prevQuizScore = progress.quizScores?.[moduleId - 1];
    const prevQuiz = getQuizByModuleId(moduleId - 1);
    return prevQuizScore !== undefined && prevQuiz && prevQuizScore >= prevQuiz.passingScore;
  };

  // Is video completed?
  const isVideoCompleted = (moduleId: number, videoId: string) => {
    return (progress.completedVideos || []).includes(`${moduleId}-${videoId}`);
  };

  // Add XP
  const addXP = (amount: number) => {
    setProgress(p => ({ ...p, totalXP: (p.totalXP || 0) + amount }));
  };

  // Complete video
  const completeVideo = () => {
    if (!currentVideo) return;
    const videoFullId = `${selectedModule}-${currentVideo.id}`;
    
    if (!(progress.completedVideos || []).includes(videoFullId)) {
      setProgress(p => ({
        ...p,
        completedVideos: [...(p.completedVideos || []), videoFullId],
        totalXP: (p.totalXP || 0) + 10,
        lessonsToday: (p.lessonsToday || 0) + 1,
      }));
    }

    // Auto advance
    if (selectedVideoIdx < currentModule.videos.length - 1) {
      const nextVideo = currentModule.videos[selectedVideoIdx + 1];
      if (nextVideo.type === 'quiz') {
        startQuiz();
      } else {
        setSelectedVideoIdx(selectedVideoIdx + 1);
      }
    }
  };

  // Start Quiz
  const startQuiz = () => {
    setViewMode('quiz');
    setCurrentQuestionIdx(0);
    setQuizAnswers({});
    setSelectedAnswer(null);
    setShowFeedback(false);
    setShowQuizResult(false);
  };

  // Handle quiz answer
  const handleQuizAnswer = (questionId: string, answerId: string) => {
    if (showFeedback) return;
    setSelectedAnswer(answerId);
    setQuizAnswers({ ...quizAnswers, [questionId]: answerId });
    setShowFeedback(true);
  };

  // Next question
  const nextQuestion = () => {
    if (!currentQuiz) return;

    setShowFeedback(false);
    setSelectedAnswer(null);

    if (currentQuestionIdx < currentQuiz.questions.length - 1) {
      setCurrentQuestionIdx(currentQuestionIdx + 1);
    } else {
      // Calculate result
      const result = calculateQuizScore(currentQuiz, quizAnswers);
      
      if (result.passed) {
        const quizVideoId = `${selectedModule}-${currentModule.videos.find(v => v.type === 'quiz')?.id}`;
        setProgress(p => ({
          ...p,
          completedVideos: (p.completedVideos || []).includes(quizVideoId)
            ? p.completedVideos
            : [...(p.completedVideos || []), quizVideoId],
          quizScores: { ...(p.quizScores || {}), [selectedModule]: result.score },
          totalXP: (p.totalXP || 0) + currentModule.xp,
          quizzesToday: (p.quizzesToday || 0) + 1,
        }));
      } else {
        setProgress(p => ({
          ...p,
          quizScores: { ...(p.quizScores || {}), [selectedModule]: result.score },
        }));
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
      setSelectedModule(selectedModule + 1);
      setSelectedVideoIdx(0);
      setExpandedModules([...expandedModules, selectedModule + 1]);
      setViewMode('lesson');
      setShowQuizResult(false);
    } else {
      router.push('/formation/complete');
    }
  };

  // Toggle module
  const toggleModule = (moduleId: number) => {
    if (expandedModules.includes(moduleId)) {
      setExpandedModules(expandedModules.filter(id => id !== moduleId));
    } else {
      setExpandedModules([...expandedModules, moduleId]);
    }
  };

  // Select video
  const selectVideo = (moduleId: number, videoIdx: number) => {
    if (!isModuleUnlocked(moduleId)) return;
    
    const video = MODULES[moduleId]?.videos[videoIdx];
    setSelectedModule(moduleId);
    setSelectedVideoIdx(videoIdx);
    
    if (video?.type === 'quiz') {
      startQuiz();
    } else {
      setViewMode('lesson');
    }
    setMobileMenuOpen(false);
  };

  // Navigation
  const goToPrev = () => {
    if (selectedVideoIdx > 0) {
      setSelectedVideoIdx(selectedVideoIdx - 1);
      setViewMode('lesson');
    }
  };

  const goToNext = () => {
    if (selectedVideoIdx < currentModule.videos.length - 1) {
      const nextVideo = currentModule.videos[selectedVideoIdx + 1];
      if (nextVideo.type === 'quiz') {
        startQuiz();
      } else {
        setSelectedVideoIdx(selectedVideoIdx + 1);
      }
    }
  };

  // Save note
  const saveNote = () => {
    if (!currentVideo || !currentNote.trim()) return;
    const noteKey = `${selectedModule}-${currentVideo.id}`;
    setProgress(p => ({
      ...p,
      notes: { ...(p.notes || {}), [noteKey]: currentNote }
    }));
  };

  // Load note when video changes
  useEffect(() => {
    if (currentVideo) {
      const noteKey = `${selectedModule}-${currentVideo.id}`;
      setCurrentNote(progress.notes?.[noteKey] || '');
    }
  }, [selectedModule, selectedVideoIdx, currentVideo, progress.notes]);

  const hasPrev = selectedVideoIdx > 0;
  const hasNext = selectedVideoIdx < currentModule.videos.length - 1;

  return (
    <div className="h-[100dvh] bg-[#030014] text-white flex overflow-hidden">
      <NeuralBackground />

      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-[#0A0A1B]/95 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center justify-between px-3 py-2">
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center"
          >
            <div className="w-5 h-5">{mobileMenuOpen ? <Icons.X /> : <Icons.Menu />}</div>
          </button>
          
          <div className="flex items-center gap-2">
            <span className="text-lg">{currentModule?.icon}</span>
            <span className="font-semibold text-xs truncate max-w-[120px]">{currentModule?.title}</span>
          </div>
          
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 text-yellow-400"><Icons.Zap /></div>
            <span className="text-yellow-400 font-bold text-xs">{progress.totalXP || 0}</span>
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

      {/* Sidebar */}
      <aside className={`
        fixed lg:static z-50
        w-72 bg-[#0A0A1B]/98 backdrop-blur-xl border-r border-white/10
        transform transition-transform duration-300
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        pt-12 lg:pt-0 flex flex-col h-[100dvh]
      `}>
        {/* Header */}
        <div className="p-3 border-b border-white/10 flex-shrink-0">
          <Link href="/dashboard" className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00F5FF] to-[#8B5CF6] flex items-center justify-center">
              <div className="w-4 h-4"><Icons.Home /></div>
            </div>
            <div>
              <p className="font-bold text-xs">Formation AI Act</p>
              <p className="text-white/50 text-[10px]">8 modules • 8h</p>
            </div>
          </Link>

          {/* Level & XP */}
          <div className="flex items-center gap-2 p-2 bg-white/5 rounded-lg mb-2">
            <div className="text-2xl">{currentLevel.badge}</div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium">Niv. {currentLevel.level}</span>
                <span className="text-[10px] text-white/40">{currentLevel.name}</span>
              </div>
              <div className="flex items-center gap-1 mt-0.5">
                <div className="w-3 h-3 text-yellow-400"><Icons.Zap /></div>
                <span className="text-yellow-400 text-xs font-bold">{progress.totalXP || 0} XP</span>
              </div>
            </div>
            <StreakBadge streak={progress.streak || 0} />
          </div>

          {/* Overall Progress */}
          <div className="bg-white/5 rounded-lg p-2">
            <div className="flex justify-between text-[10px] mb-1">
              <span className="text-white/60">Progression</span>
              <span className="font-bold">{overallProgress}%</span>
            </div>
            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-[#00F5FF] to-[#8B5CF6] rounded-full transition-all"
                style={{ width: `${overallProgress}%` }}
              />
            </div>
          </div>

          {/* Compliance Dossier Button */}
          <Link 
            href="/dossier" 
            className="mt-3 flex items-center gap-2 p-2 bg-gradient-to-r from-[#00F5FF]/20 to-[#8B5CF6]/20 rounded-lg border border-[#00F5FF]/30 hover:border-[#00F5FF]/50 transition-all group"
          >
            <span className="text-xl">📁</span>
            <div className="flex-1">
              <p className="text-xs font-medium group-hover:text-[#00F5FF] transition-colors">Mon Dossier Conformité</p>
              <p className="text-[10px] text-white/50">Télécharger tous mes documents</p>
            </div>
            <span className="text-white/40 group-hover:text-[#00F5FF] transition-colors">→</span>
          </Link>
        </div>

        {/* Modules List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {MODULES.map((module) => {
            const isExpanded = expandedModules.includes(module.id);
            const isUnlocked = isModuleUnlocked(module.id);
            const moduleProgress = getModuleProgress(module.id);

            return (
              <div key={module.id} className="rounded-lg overflow-hidden">
                <button
                  onClick={() => isUnlocked && toggleModule(module.id)}
                  className={`w-full p-2 flex items-center gap-2 transition-all ${
                    isUnlocked ? 'hover:bg-white/5 cursor-pointer' : 'opacity-50 cursor-not-allowed'
                  } ${selectedModule === module.id ? 'bg-white/5' : ''}`}
                >
                  <div 
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: isUnlocked ? `${module.color}20` : 'rgba(255,255,255,0.05)' }}
                  >
                    {isUnlocked ? (
                      moduleProgress === 100 ? (
                        <div className="w-4 h-4" style={{ color: module.color }}><Icons.Check /></div>
                      ) : (
                        <span className="text-base">{module.icon}</span>
                      )
                    ) : (
                      <div className="w-4 h-4 text-white/30"><Icons.Lock /></div>
                    )}
                  </div>

                  <div className="flex-1 text-left min-w-0">
                    <p className="font-medium text-xs truncate">{module.title}</p>
                    {isUnlocked && (
                      <div className="h-1 bg-white/10 rounded-full mt-1 overflow-hidden">
                        <div 
                          className="h-full rounded-full transition-all"
                          style={{ width: `${moduleProgress}%`, backgroundColor: module.color }}
                        />
                      </div>
                    )}
                  </div>

                  <span className="text-[10px] text-white/40">{moduleProgress}%</span>

                  {isUnlocked && (
                    <div className={`w-4 h-4 text-white/40 transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
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
                      <div className="pl-3 pr-1 pb-1 space-y-0.5">
                        {module.videos.map((video, idx) => {
                          const isActive = selectedModule === module.id && selectedVideoIdx === idx;
                          const isComplete = isVideoCompleted(module.id, video.id);

                          return (
                            <button
                              key={video.id}
                              onClick={() => selectVideo(module.id, idx)}
                              className={`w-full p-1.5 rounded-md flex items-center gap-2 text-left transition-all ${
                                isActive ? 'bg-white/10' : 'hover:bg-white/5'
                              }`}
                            >
                              <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                                isComplete ? 'bg-green-500/20' : 'bg-white/5'
                              }`}>
                                {isComplete ? (
                                  <div className="w-2.5 h-2.5 text-green-400"><Icons.Check /></div>
                                ) : video.type === 'quiz' ? (
                                  <span className="text-[9px]">📝</span>
                                ) : (
                                  <span className="text-white/40 text-[9px]">{idx + 1}</span>
                                )}
                              </div>

                              <div className="flex-1 min-w-0">
                                <p className={`text-[10px] truncate ${isActive ? 'text-white' : 'text-white/70'}`}>
                                  {video.title}
                                </p>
                              </div>

                              {isActive && (
                                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: module.color }} />
                              )}
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
      <main className="flex-1 flex flex-col h-[100dvh] pt-12 lg:pt-0 overflow-hidden relative">
        {/* Header */}
        <div className="flex-shrink-0 hidden lg:flex items-center justify-between px-4 py-2 bg-[#0A0A1B]/80 backdrop-blur-xl border-b border-white/5">
          <div className="flex items-center gap-3">
            {/* Nav arrows */}
            <div className="flex gap-1">
              <button
                onClick={goToPrev}
                disabled={!hasPrev}
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                  hasPrev ? 'bg-white/10 hover:bg-white/20' : 'bg-white/5 text-white/20 cursor-not-allowed'
                }`}
              >
                <div className="w-4 h-4"><Icons.ChevronLeft /></div>
              </button>
              <button
                onClick={goToNext}
                disabled={!hasNext}
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                  hasNext ? 'text-black' : 'bg-white/5 text-white/20 cursor-not-allowed'
                }`}
                style={{ backgroundColor: hasNext ? currentModule.color : undefined }}
              >
                <div className="w-4 h-4"><Icons.ChevronRight /></div>
              </button>
            </div>

            <span 
              className="px-3 py-1.5 rounded-full text-sm font-medium"
              style={{ backgroundColor: `${currentModule.color}20`, color: currentModule.color }}
            >
              {currentModule.icon} {currentModule.code}
            </span>
            <h1 className="text-lg font-bold">{currentVideo?.title}</h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-yellow-500/10 text-yellow-400 px-3 py-1.5 rounded-lg">
              <div className="w-4 h-4"><Icons.Zap /></div>
              <span className="font-bold">{progress.totalXP || 0}</span>
            </div>
            <StreakBadge streak={progress.streak || 0} />
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex overflow-hidden p-3 sm:p-4 lg:p-6">
          {/* Main Content Section */}
          <div className={`flex-1 flex flex-col overflow-y-auto ${showRightPanel ? 'lg:pr-80' : ''}`}>
            
            {/* LESSON VIEW - Video */}
            {viewMode === 'lesson' && currentVideo?.type === 'video' && (
              <VideoPlayer
                video={currentVideo}
                module={currentModule}
                isPlaying={isPlaying}
                onPlayPause={() => setIsPlaying(!isPlaying)}
                onComplete={completeVideo}
                isCompleted={isVideoCompleted(selectedModule, currentVideo.id)}
              />
            )}

            {/* LESSON VIEW - Exercise */}
            {viewMode === 'lesson' && currentVideo?.type === 'exercise' && (
              <div className="flex-1 bg-white/5 rounded-2xl p-4 sm:p-6 overflow-auto border border-white/10">
                {/* M1 - Diagnostic Workshop */}
                {currentVideo.id === '1.2' && (
                  <DiagnosticWorkshop 
                    moduleColor={currentModule.color}
                    onComplete={completeVideo}
                  />
                )}

                {/* M2 - Inventory Spreadsheet */}
                {currentVideo.id === '2.2' && (
                  <InventorySpreadsheet 
                    moduleColor={currentModule.color}
                    onComplete={completeVideo}
                  />
                )}

                {/* M2 - Registry Spreadsheet */}
                {currentVideo.id === '2.4' && (
                  <RegistrySpreadsheet 
                    moduleColor={currentModule.color}
                    onComplete={completeVideo}
                  />
                )}

                {/* M3 - Classification Workshop */}
                {currentVideo.id === '3.2' && (
                  <ClassificationWorkshop 
                    moduleColor={currentModule.color}
                    onComplete={completeVideo}
                  />
                )}

                {/* M4 - Email Generator Workshop */}
                {currentVideo.id === '4.2' && (
                  <EmailGeneratorWorkshop 
                    moduleColor={currentModule.color}
                    onComplete={completeVideo}
                  />
                )}

                {/* M5 - Policy Generator Workshop */}
                {currentVideo.id === '5.2' && (
                  <PolicyGeneratorWorkshop 
                    moduleColor={currentModule.color}
                    onComplete={completeVideo}
                  />
                )}

                {/* M5 - Legal Mentions Generator (legacy) */}
                {currentVideo.id === '5.4' && (
                  <LegalMentionsGenerator 
                    moduleColor={currentModule.color}
                    onComplete={completeVideo}
                  />
                )}

                {/* M7 - Action Plan Spreadsheet */}
                {currentVideo.id === '7.2' && (
                  <ActionPlanSpreadsheet 
                    moduleColor={currentModule.color}
                    onComplete={completeVideo}
                  />
                )}

                {/* Fallback for other exercises */}
                {!['1.2', '2.2', '2.4', '3.2', '4.2', '5.2', '5.4', '7.2'].includes(currentVideo.id) && 
                 currentVideo.exerciseFile && (
                  <div className="text-center py-8">
                    <div className="text-5xl mb-4">📝</div>
                    <h3 className="text-xl font-bold mb-2">{currentVideo.title}</h3>
                    <p className="text-white/60 mb-6 max-w-md mx-auto">
                      {currentVideo.description}
                    </p>
                    <a
                      href={`/resources/${currentVideo.exerciseFile}`}
                      download
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-black"
                      style={{ backgroundColor: currentModule.color }}
                    >
                      <div className="w-5 h-5"><Icons.Download /></div>
                      Télécharger
                    </a>
                    <button
                      onClick={completeVideo}
                      className="block mx-auto mt-4 text-sm text-white/40 hover:text-white/60"
                    >
                      Marquer comme terminé →
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* LESSON VIEW - Scenario (Module 6) */}
            {viewMode === 'lesson' && currentVideo?.type === 'scenario' && (
              <div className="flex-1 bg-white/5 rounded-2xl p-4 sm:p-6 overflow-auto border border-white/10">
                {selectedModule === 6 ? (
                  <AuditSimulation 
                    moduleColor={currentModule.color}
                    onComplete={completeVideo}
                  />
                ) : (
                  <div className="text-center py-8">
                    <div className="text-5xl mb-4">🎭</div>
                    <h3 className="text-xl font-bold mb-2">Scénario Interactif</h3>
                    <p className="text-white/60 mb-6">Mettez en pratique vos connaissances</p>
                    <button
                      onClick={completeVideo}
                      className="px-6 py-3 rounded-xl font-bold text-black"
                      style={{ backgroundColor: currentModule.color }}
                    >
                      Commencer le scénario
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* LESSON VIEW - Quiz Button */}
            {viewMode === 'lesson' && currentVideo?.type === 'quiz' && (
              <div className="flex-1 bg-white/5 rounded-2xl p-6 overflow-auto border border-white/10">
                <div className="text-center py-8">
                  <div className="text-5xl mb-4">📝</div>
                  <h3 className="text-xl font-bold mb-2">Quiz - {currentModule.title}</h3>
                  <p className="text-white/60 mb-6">Testez vos connaissances pour débloquer le module suivant</p>
                  <button
                    onClick={startQuiz}
                    className="px-6 py-3 rounded-xl font-bold text-black"
                    style={{ backgroundColor: currentModule.color }}
                  >
                    Commencer le quiz
                  </button>
                </div>
              </div>
            )}

            {/* QUIZ VIEW */}
            {viewMode === 'quiz' && (
              <div className="flex-1 flex flex-col min-h-[400px]">
                {!currentQuiz ? (
                  <div className="flex-1 flex items-center justify-center bg-white/5 rounded-2xl border border-white/10">
                    <div className="text-center">
                      <div className="text-5xl mb-4">❌</div>
                      <p className="text-white/60">Quiz non trouvé pour le module {selectedModule}</p>
                      <button 
                        onClick={() => setViewMode('lesson')}
                        className="mt-4 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20"
                      >
                        Retour
                      </button>
                    </div>
                  </div>
                ) : !showQuizResult ? (
                  <>
                    {/* Quiz Header */}
                    <div className="flex-shrink-0 mb-3 bg-[#0A0A1B]/80 px-3 py-2 rounded-xl border border-white/10">
                      <div className="flex items-center justify-between mb-1">
                        <span 
                          className="text-xs font-medium px-2 py-0.5 rounded-full"
                          style={{ backgroundColor: `${currentModule.color}20`, color: currentModule.color }}
                        >
                          {currentModule.icon} Quiz
                        </span>
                        <span className="text-white/60 text-xs">
                          {currentQuestionIdx + 1} / {currentQuiz.questions.length}
                        </span>
                      </div>
                      <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ backgroundColor: currentModule.color }}
                          animate={{ width: `${((currentQuestionIdx + 1) / currentQuiz.questions.length) * 100}%` }}
                        />
                      </div>
                    </div>

                    {/* Question */}
                    {currentQuestion ? (
                      <div className="flex-1 bg-white/5 rounded-2xl p-4 sm:p-6 overflow-auto border border-white/10">
                        <h2 className="text-sm sm:text-base font-semibold mb-4">{currentQuestion.question}</h2>
                        
                        <div className="space-y-2">
                          {currentQuestion.options.map((option, idx) => {
                            const isSelected = selectedAnswer === option.id;
                            const isCorrect = option.isCorrect;
                            const showResult = showFeedback;

                            return (
                              <button
                                key={option.id}
                                onClick={() => handleQuizAnswer(currentQuestion.id, option.id)}
                                disabled={showFeedback}
                                className={`w-full p-3 rounded-xl text-left transition-all flex items-center gap-3 text-xs sm:text-sm ${
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
                                <span className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs ${
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
                              </button>
                            );
                          })}
                        </div>

                        {/* Feedback */}
                        {showFeedback && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-4"
                          >
                            <div 
                              className="p-3 rounded-xl text-sm"
                              style={{ 
                                backgroundColor: currentQuestion.options.find(o => o.id === selectedAnswer)?.isCorrect 
                                  ? 'rgba(34, 197, 94, 0.1)' 
                                  : 'rgba(239, 68, 68, 0.1)'
                              }}
                            >
                              <p className="font-medium">
                                {currentQuestion.options.find(o => o.id === selectedAnswer)?.isCorrect 
                                  ? '✅ Bonne réponse !' 
                                  : '❌ Mauvaise réponse'}
                              </p>
                              {currentQuestion.feedback && (
                                <p className="text-white/60 text-xs mt-1">{currentQuestion.feedback}</p>
                              )}
                            </div>

                            <button
                              onClick={nextQuestion}
                              className="w-full mt-3 py-3 rounded-xl font-bold text-black text-sm"
                              style={{ backgroundColor: currentModule.color }}
                            >
                              {currentQuestionIdx < currentQuiz.questions.length - 1 
                                ? 'Question suivante' 
                                : 'Voir les résultats'}
                            </button>
                          </motion.div>
                        )}
                      </div>
                    ) : (
                      <div className="flex-1 flex items-center justify-center bg-white/5 rounded-2xl border border-white/10">
                        <p className="text-white/60">Question non trouvée</p>
                      </div>
                    )}
                  </>
                ) : (
                  /* Quiz Results */
                  <div 
                    className="flex-1 rounded-2xl p-4 sm:p-6 text-center overflow-auto border-2"
                    style={{ 
                      backgroundColor: 'rgba(255,255,255,0.05)',
                      borderColor: calculateQuizScore(currentQuiz, quizAnswers).passed ? '#00FF88' : '#FF4444'
                    }}
                  >
                    {(() => {
                      const result = calculateQuizScore(currentQuiz, quizAnswers);
                      const passed = result.passed;

                      return (
                        <>
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${
                              passed ? 'bg-green-500' : 'bg-red-500'
                            }`}
                          >
                            {passed ? (
                              <div className="w-8 h-8 sm:w-10 sm:h-10 text-white"><Icons.Trophy /></div>
                            ) : (
                              <div className="w-8 h-8 sm:w-10 sm:h-10 text-white"><Icons.X /></div>
                            )}
                          </motion.div>

                          <h2 className="text-xl sm:text-2xl font-bold mb-2">
                            {passed ? 'Bravo ! 🎉' : 'Pas encore...'}
                          </h2>
                          
                          <p className="text-white/60 text-sm mb-4">
                            {passed 
                              ? `Vous avez débloqué le module suivant ! +${currentModule.xp} XP` 
                              : 'Réessayez pour débloquer le module suivant'}
                          </p>
                          
                          <div className="flex justify-center gap-6 my-4">
                            <div className="text-center">
                              <div className={`text-3xl sm:text-4xl font-bold ${passed ? 'text-green-400' : 'text-red-400'}`}>
                                {result.score}%
                              </div>
                              <p className="text-white/40 text-xs">Votre score</p>
                            </div>
                            <div className="text-center">
                              <div className="text-3xl sm:text-4xl font-bold text-white/40">
                                {currentQuiz.passingScore}%
                              </div>
                              <p className="text-white/40 text-xs">Requis</p>
                            </div>
                          </div>

                          <div className="flex gap-2 mt-4">
                            {!passed && (
                              <button
                                onClick={retryQuiz}
                                className="flex-1 py-3 rounded-xl bg-white/10 font-semibold text-sm hover:bg-white/20 transition-colors"
                              >
                                Réessayer
                              </button>
                            )}
                            {passed && (
                              <button
                                onClick={goToNextModule}
                                className="flex-1 py-3 rounded-xl font-bold text-black text-sm"
                                style={{ backgroundColor: currentModule.color }}
                              >
                                {selectedModule < MODULES.length - 1 ? 'Module suivant →' : 'Terminer la formation 🎓'}
                              </button>
                            )}
                          </div>
                        </>
                      );
                    })()}
                  </div>
                )}

                {/* Back to lesson button */}
                {!showQuizResult && (
                  <div className="mt-4">
                    <button
                      onClick={() => setViewMode('lesson')}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-white/10 hover:bg-white/20 transition-colors"
                    >
                      <div className="w-4 h-4"><Icons.ChevronLeft /></div>
                      Retour à la leçon
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Bottom Navigation - Only in lesson mode */}
            {viewMode === 'lesson' && (
              <div className="flex items-center justify-between mt-4">
                <div className="flex gap-2">
                  <button
                    onClick={goToPrev}
                    disabled={!hasPrev}
                    className={`px-4 py-2 rounded-xl text-sm flex items-center gap-2 ${
                      hasPrev ? 'bg-white/10 hover:bg-white/20' : 'bg-white/5 text-white/30 cursor-not-allowed'
                    }`}
                  >
                    <div className="w-4 h-4"><Icons.ChevronLeft /></div>
                    Précédent
                  </button>
                  <button
                    onClick={goToNext}
                    disabled={!hasNext}
                    className={`px-4 py-2 rounded-xl text-sm flex items-center gap-2 ${
                      hasNext ? 'text-black font-bold' : 'bg-white/5 text-white/30 cursor-not-allowed'
                    }`}
                    style={{ backgroundColor: hasNext ? currentModule.color : undefined }}
                  >
                    Suivant
                    <div className="w-4 h-4"><Icons.ChevronRight /></div>
                  </button>
                </div>

                {currentVideo?.type !== 'quiz' && !isVideoCompleted(selectedModule, currentVideo?.id || '') && (
                  <button
                    onClick={completeVideo}
                    className="px-4 py-2 rounded-xl text-sm font-medium bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors flex items-center gap-2"
                  >
                    <div className="w-4 h-4"><Icons.Check /></div>
                    Marquer terminé
                  </button>
                )}

                {currentVideo?.type === 'quiz' && (
                  <button
                    onClick={startQuiz}
                    className="px-4 py-2 rounded-xl text-sm font-bold text-black flex items-center gap-2"
                    style={{ backgroundColor: currentModule.color }}
                  >
                    <div className="w-4 h-4"><Icons.Award /></div>
                    Commencer le quiz
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Right Panel - Notes & Goals */}
          {showRightPanel && (
            <aside className="hidden lg:block fixed right-0 top-0 bottom-0 w-80 bg-[#0A0A1B]/95 border-l border-white/5 p-4 pt-20 overflow-y-auto">
              <div className="space-y-4">
                {/* Daily Goals */}
                <DailyGoals progress={progress} />

                {/* Notes */}
                <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-4 h-4 text-white/60"><Icons.Edit /></div>
                    <span className="font-semibold text-sm">Mes notes</span>
                  </div>
                  <textarea
                    value={currentNote}
                    onChange={(e) => setCurrentNote(e.target.value)}
                    placeholder="Prenez des notes sur cette leçon..."
                    className="w-full h-24 bg-white/5 rounded-lg p-2 text-sm text-white/80 placeholder-white/30 resize-none border border-white/10 focus:border-[#8B5CF6] focus:outline-none"
                  />
                  <button
                    onClick={saveNote}
                    className="mt-2 w-full py-2 rounded-lg text-xs font-medium bg-[#8B5CF6] text-white hover:bg-[#7C3AED] transition-colors"
                  >
                    Enregistrer
                  </button>
                </div>
              </div>
            </aside>
          )}
        </div>
      </main>
    </div>
  );
}

// Main Export with Suspense
export default function FormationPage() {
  return (
    <Suspense fallback={
      <div className="h-screen bg-[#030014] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#8B5CF6] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <FormationContent />
    </Suspense>
  );
}
