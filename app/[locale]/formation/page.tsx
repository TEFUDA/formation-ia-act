'use client';

import { useState, useEffect, useMemo, useCallback, useRef, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { MODULES, Module, Video } from '@/lib/formation/modules';
import { getQuizByModuleId, calculateQuizScore } from '@/lib/formation/quizzes';

// Import interactive components
import ClassificationWizard from '@/components/formation/ClassificationWizard';
import AuditSimulation from '@/components/formation/AuditSimulation';
import SmartEmailEditor from '@/components/formation/SmartEmailEditor';
import BrainstormingGrid from '@/components/formation/BrainstormingGrid';
import LegalMentionsGenerator from '@/components/formation/LegalMentionsGenerator';
import CertificateGenerator from '@/components/formation/CertificateGenerator';
import ActionPlanBuilder from '@/components/formation/ActionPlanBuilder';

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

const BADGES = [
  { id: 'first-lesson', name: 'Premier Pas', icon: '👣', description: 'Terminer sa première leçon', xpRequired: 10 },
  { id: 'module-complete', name: 'Module Maîtrisé', icon: '📚', description: 'Terminer un module complet', condition: 'moduleComplete' },
  { id: 'quiz-master', name: 'Quiz Master', icon: '🧠', description: 'Obtenir 100% à un quiz', condition: 'perfectQuiz' },
  { id: 'streak-3', name: 'En Forme', icon: '🔥', description: '3 jours consécutifs', condition: 'streak3' },
  { id: 'streak-7', name: 'Déterminé', icon: '💪', description: '7 jours consécutifs', condition: 'streak7' },
  { id: 'speed-learner', name: 'Speed Learner', icon: '⚡', description: '5 leçons en une journée', condition: 'speedLearner' },
  { id: 'note-taker', name: 'Scribe', icon: '✍️', description: 'Prendre 10 notes', condition: 'noteTaker' },
  { id: 'halfway', name: 'Mi-Parcours', icon: '🏃', description: '50% de la formation', condition: 'halfway' },
  { id: 'graduate', name: 'Diplômé', icon: '🎓', description: 'Terminer la formation', condition: 'complete' },
];

const DAILY_GOALS = [
  { id: 'lessons', target: 3, label: 'Leçons', icon: '📖', xpBonus: 50 },
  { id: 'minutes', target: 30, label: 'Minutes', icon: '⏱️', xpBonus: 30 },
  { id: 'quiz', target: 1, label: 'Quiz', icon: '📝', xpBonus: 40 },
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
  Clock: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  Lock: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
  Download: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
  FileText: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
  Target: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>,
  Bookmark: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>,
  BookmarkFilled: () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>,
  Edit: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  Volume: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>,
  Maximize: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>,
  Settings: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
  Fire: () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full"><path d="M12 2c-1.5 2-3 3.5-3 6 0 1.5.5 2.5 1.5 3.5-1-.5-2-2-2-3.5 0 0-2.5 3-2.5 6.5 0 4 3 7 6 7s6-3 6-7c0-2-1-4-2.5-5.5 0 1.5-.5 2.5-1.5 3-.5-2-2-4-2-9z"/></svg>,
  Star: () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  Trophy: () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18M4 22h16M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>,
  Keyboard: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><rect x="2" y="4" width="20" height="16" rx="2" ry="2"/><line x1="6" y1="8" x2="6" y2="8"/><line x1="10" y1="8" x2="10" y2="8"/><line x1="14" y1="8" x2="14" y2="8"/><line x1="18" y1="8" x2="18" y2="8"/><line x1="8" y1="12" x2="8" y2="12"/><line x1="12" y1="12" x2="12" y2="12"/><line x1="16" y1="12" x2="16" y2="12"/><line x1="7" y1="16" x2="17" y2="16"/></svg>,
  Focus: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/></svg>,
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
  unlockedBadges: string[];
  notes: Record<string, string>;
  bookmarks: string[];
}

// ============================================
// UTILITY FUNCTIONS
// ============================================
const getCurrentLevel = (xp: number) => {
  return LEVELS.reduce((acc, level) => (xp >= level.minXP ? level : acc), LEVELS[0]);
};

const getXPToNextLevel = (xp: number) => {
  const current = getCurrentLevel(xp);
  const progress = ((xp - current.minXP) / (current.nextXP - current.minXP)) * 100;
  return { progress: Math.min(progress, 100), remaining: current.nextXP - xp };
};

// ============================================
// COMPONENTS
// ============================================

// Animated XP Gain
const XPGainAnimation = ({ amount, onComplete }: { amount: number; onComplete: () => void }) => (
  <motion.div
    initial={{ opacity: 0, y: 20, scale: 0.5 }}
    animate={{ opacity: 1, y: -40, scale: 1 }}
    exit={{ opacity: 0, y: -60 }}
    onAnimationComplete={onComplete}
    className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[100] pointer-events-none"
  >
    <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold px-6 py-3 rounded-full shadow-2xl">
      <div className="w-6 h-6"><Icons.Zap /></div>
      <span className="text-xl">+{amount} XP</span>
    </div>
  </motion.div>
);

// Level Up Animation
const LevelUpAnimation = ({ level, onComplete }: { level: typeof LEVELS[0]; onComplete: () => void }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.5 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 1.5 }}
    onAnimationComplete={() => setTimeout(onComplete, 2000)}
    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-xl"
  >
    <div className="text-center">
      <motion.div 
        className="text-8xl mb-4"
        animate={{ rotate: [0, -10, 10, -10, 10, 0], scale: [1, 1.2, 1] }}
        transition={{ duration: 0.5 }}
      >
        {level.badge}
      </motion.div>
      <motion.h2 
        className="text-4xl font-black mb-2"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        style={{ color: level.color }}
      >
        NIVEAU {level.level}
      </motion.h2>
      <motion.p 
        className="text-2xl text-white font-bold"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        {level.name}
      </motion.p>
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.7, type: "spring" }}
        className="mt-6 inline-flex items-center gap-2 bg-white/10 px-6 py-3 rounded-full"
      >
        <Icons.Trophy />
        <span>Nouveau titre débloqué !</span>
      </motion.div>
    </div>
  </motion.div>
);

// Streak Badge
const StreakBadge = ({ streak }: { streak: number }) => (
  <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${
    streak > 0 ? 'bg-orange-500/20 text-orange-400' : 'bg-white/5 text-white/40'
  }`}>
    <div className={`w-4 h-4 ${streak > 0 ? 'text-orange-400' : ''}`}>
      <Icons.Fire />
    </div>
    <span className="font-bold text-sm">{streak}</span>
    <span className="text-xs opacity-60">jours</span>
  </div>
);

// Daily Goals Progress
const DailyGoals = ({ progress }: { progress: UserProgress }) => {
  const goals = [
    { ...DAILY_GOALS[0], current: progress.lessonsToday || 0 },
    { ...DAILY_GOALS[1], current: progress.minutesToday || 0 },
    { ...DAILY_GOALS[2], current: progress.quizzesToday || 0 },
  ];

  return (
    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-sm flex items-center gap-2">
          <div className="w-4 h-4 text-[#00F5FF]"><Icons.Target /></div>
          Objectifs du jour
        </h3>
        <span className="text-xs text-white/40">
          {goals.filter(g => g.current >= g.target).length}/{goals.length} ✓
        </span>
      </div>
      <div className="space-y-2">
        {goals.map(goal => {
          const completed = goal.current >= goal.target;
          const percent = Math.min((goal.current / goal.target) * 100, 100);
          return (
            <div key={goal.id} className="flex items-center gap-3">
              <span className="text-lg">{goal.icon}</span>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-white/60">{goal.label}</span>
                  <span className={`text-xs font-medium ${completed ? 'text-green-400' : 'text-white/80'}`}>
                    {goal.current}/{goal.target}
                  </span>
                </div>
                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <motion.div 
                    className={`h-full rounded-full ${completed ? 'bg-green-400' : 'bg-[#00F5FF]'}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${percent}%` }}
                  />
                </div>
              </div>
              {completed && (
                <motion.span 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="text-green-400 text-xs"
                >
                  +{goal.xpBonus} XP
                </motion.span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Notes Panel
const NotesPanel = ({ 
  videoId, 
  notes, 
  onSave 
}: { 
  videoId: string; 
  notes: Record<string, string>;
  onSave: (videoId: string, note: string) => void;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(notes[videoId] || '');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setText(notes[videoId] || '');
  }, [videoId, notes]);

  const handleSave = () => {
    onSave(videoId, text);
    setIsEditing(false);
  };

  return (
    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-sm flex items-center gap-2">
          <div className="w-4 h-4 text-[#8B5CF6]"><Icons.Edit /></div>
          Mes notes
        </h3>
        {!isEditing && text && (
          <button 
            onClick={() => setIsEditing(true)}
            className="text-xs text-[#8B5CF6] hover:underline"
          >
            Modifier
          </button>
        )}
      </div>
      
      {isEditing || !text ? (
        <div>
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Prenez des notes sur cette leçon..."
            className="w-full h-24 bg-white/5 border border-white/10 rounded-lg p-3 text-sm text-white placeholder-white/30 resize-none focus:outline-none focus:border-[#8B5CF6]/50"
          />
          <div className="flex justify-end gap-2 mt-2">
            {text && (
              <button 
                onClick={() => { setText(notes[videoId] || ''); setIsEditing(false); }}
                className="px-3 py-1 text-xs text-white/60 hover:text-white"
              >
                Annuler
              </button>
            )}
            <button 
              onClick={handleSave}
              className="px-3 py-1 text-xs bg-[#8B5CF6] text-white rounded-lg hover:bg-[#7C3AED]"
            >
              Enregistrer
            </button>
          </div>
        </div>
      ) : (
        <p className="text-sm text-white/70 whitespace-pre-wrap">{text}</p>
      )}
    </div>
  );
};

// Keyboard Shortcuts Modal
const KeyboardShortcuts = ({ onClose }: { onClose: () => void }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-xl p-4"
    onClick={onClose}
  >
    <motion.div
      initial={{ scale: 0.9 }}
      animate={{ scale: 1 }}
      className="bg-[#0A0A1B] border border-white/10 rounded-2xl p-6 max-w-md w-full"
      onClick={e => e.stopPropagation()}
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <div className="w-5 h-5 text-[#00F5FF]"><Icons.Keyboard /></div>
          Raccourcis clavier
        </h3>
        <button onClick={onClose} className="w-8 h-8 flex items-center justify-center text-white/40 hover:text-white">
          <Icons.X />
        </button>
      </div>
      
      <div className="space-y-3">
        {[
          { key: 'Espace', action: 'Lecture / Pause' },
          { key: 'N', action: 'Leçon suivante' },
          { key: 'P', action: 'Leçon précédente' },
          { key: 'M', action: 'Marquer comme terminé' },
          { key: 'B', action: 'Ajouter aux favoris' },
          { key: 'F', action: 'Mode Focus' },
          { key: '?', action: 'Afficher les raccourcis' },
          { key: 'Échap', action: 'Fermer le modal' },
        ].map(shortcut => (
          <div key={shortcut.key} className="flex items-center justify-between">
            <span className="text-white/60 text-sm">{shortcut.action}</span>
            <kbd className="px-3 py-1 bg-white/10 rounded-lg text-sm font-mono">{shortcut.key}</kbd>
          </div>
        ))}
      </div>
    </motion.div>
  </motion.div>
);

// Premium Video Player
const VideoPlayer = ({ 
  video, 
  module, 
  isPlaying, 
  onPlayPause,
  onComplete,
  isCompleted 
}: { 
  video: Video;
  module: Module;
  isPlaying: boolean;
  onPlayPause: () => void;
  onComplete: () => void;
  isCompleted: boolean;
}) => {
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(80);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);

  // Simulate video progress
  useEffect(() => {
    if (isPlaying && progress < 100) {
      const interval = setInterval(() => {
        setProgress(p => {
          if (p >= 100) {
            clearInterval(interval);
            return 100;
          }
          return p + 0.5;
        });
      }, 100);
      return () => clearInterval(interval);
    }
  }, [isPlaying, progress]);

  return (
    <div className="relative bg-black rounded-2xl overflow-hidden group">
      {/* Video Area */}
      <div className="aspect-video bg-gradient-to-br from-gray-900 to-black flex items-center justify-center relative">
        {/* Placeholder for actual video */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <motion.button
              onClick={onPlayPause}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="w-20 h-20 rounded-full flex items-center justify-center mb-4 transition-all"
              style={{ backgroundColor: module.color }}
            >
              <div className="w-8 h-8 text-black ml-1">
                {isPlaying ? <Icons.Pause /> : <Icons.Play />}
              </div>
            </motion.button>
            <p className="text-white/60 text-sm">{video.title}</p>
          </div>
        </div>

        {/* Completed Overlay */}
        {isCompleted && (
          <div className="absolute top-2 right-2 sm:top-4 sm:right-4 flex items-center gap-1 sm:gap-2 bg-green-500/20 text-green-400 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm">
            <div className="w-3 h-3 sm:w-4 sm:h-4"><Icons.Check /></div>
            <span className="hidden sm:inline">Terminé</span>
            <span className="sm:hidden">✓</span>
          </div>
        )}

        {/* Module Badge */}
        <div 
          className="absolute top-2 left-2 sm:top-4 sm:left-4 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium"
          style={{ backgroundColor: `${module.color}20`, color: module.color }}
        >
          {module.icon} <span className="hidden sm:inline">{module.code}</span>
        </div>
      </div>

      {/* Controls - Always visible on mobile, hover on desktop */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-3 sm:p-4 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
        {/* Progress Bar */}
        <div className="mb-2 sm:mb-3">
          <div className="h-1.5 sm:h-1 bg-white/20 rounded-full overflow-hidden cursor-pointer">
            <motion.div 
              className="h-full rounded-full"
              style={{ backgroundColor: module.color, width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Controls Row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Play/Pause */}
            <button 
              onClick={onPlayPause}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
            >
              <div className="w-4 h-4 sm:w-5 sm:h-5 text-white">
                {isPlaying ? <Icons.Pause /> : <Icons.Play />}
              </div>
            </button>

            {/* Volume - Hidden on mobile */}
            <div className="hidden sm:flex items-center gap-2">
              <div className="w-5 h-5 text-white/60"><Icons.Volume /></div>
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={volume}
                onChange={(e) => setVolume(parseInt(e.target.value))}
                className="w-20 h-1 accent-white"
              />
            </div>

            {/* Time */}
            <span className="text-white/60 text-xs sm:text-sm">
              {video.duration || '10:00'}
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Speed */}
            <div className="relative">
              <button 
                onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                className="px-2 sm:px-3 py-1 bg-white/10 rounded-lg text-xs sm:text-sm hover:bg-white/20 transition-colors"
              >
                {playbackSpeed}x
              </button>
              {showSpeedMenu && (
                <div className="absolute bottom-full right-0 mb-2 bg-[#1a1a2e] rounded-lg overflow-hidden shadow-xl">
                  {[0.5, 0.75, 1, 1.25, 1.5, 2].map(speed => (
                    <button
                      key={speed}
                      onClick={() => { setPlaybackSpeed(speed); setShowSpeedMenu(false); }}
                      className={`block w-full px-4 py-2 text-sm text-left hover:bg-white/10 ${
                        playbackSpeed === speed ? 'text-[#00F5FF]' : 'text-white'
                      }`}
                    >
                      {speed}x
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Fullscreen */}
            <button className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
              <div className="w-4 h-4 sm:w-5 sm:h-5 text-white"><Icons.Maximize /></div>
            </button>
          </div>
        </div>
      </div>

      {/* Complete Button - Shows when progress > 80% */}
      {progress > 80 && !isCompleted && (
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={onComplete}
          className="absolute bottom-16 sm:bottom-20 left-1/2 transform -translate-x-1/2 px-4 sm:px-6 py-2 sm:py-3 rounded-full font-bold text-black flex items-center gap-2 text-sm sm:text-base"
          style={{ backgroundColor: module.color }}
        >
          <div className="w-4 h-4 sm:w-5 sm:h-5"><Icons.Check /></div>
          <span className="hidden sm:inline">Marquer comme terminé (+10 XP)</span>
          <span className="sm:hidden">Terminé +10 XP</span>
        </motion.button>
      )}
    </div>
  );
};

// Level Progress Header
const LevelHeader = ({ xp, streak }: { xp: number; streak: number }) => {
  const level = getCurrentLevel(xp);
  const { progress, remaining } = getXPToNextLevel(xp);

  return (
    <div className="flex items-center gap-2 sm:gap-4 bg-white/5 rounded-xl p-2 sm:p-3 border border-white/10">
      {/* Level Badge */}
      <div 
        className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center text-lg sm:text-2xl flex-shrink-0"
        style={{ background: `linear-gradient(135deg, ${level.color}40, ${level.color}10)` }}
      >
        {level.badge}
      </div>

      {/* Level Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1 sm:gap-2 mb-1">
          <span className="font-bold text-sm sm:text-base" style={{ color: level.color }}>Niv. {level.level}</span>
          <span className="hidden sm:inline text-white/60 text-sm">•</span>
          <span className="hidden sm:inline text-white/80 text-sm">{level.name}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex-1 h-1.5 sm:h-2 bg-white/10 rounded-full overflow-hidden">
            <motion.div 
              className="h-full rounded-full"
              style={{ backgroundColor: level.color, width: `${progress}%` }}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-[10px] text-white/40 flex-shrink-0">{remaining} XP</span>
        </div>
      </div>

      {/* XP & Streak - Simplified on mobile */}
      <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
        <div className="text-center">
          <div className="flex items-center gap-1 text-yellow-400">
            <div className="w-4 h-4 sm:w-5 sm:h-5"><Icons.Zap /></div>
            <span className="font-bold text-sm sm:text-lg">{xp}</span>
          </div>
          <span className="hidden sm:block text-[10px] text-white/40">XP TOTAL</span>
        </div>
        <div className="hidden sm:block w-px h-8 bg-white/10" />
        <div className="hidden sm:block">
          <StreakBadge streak={streak} />
        </div>
      </div>
    </div>
  );
};

// Navigation Buttons
const NavigationButtons = ({
  onPrev,
  onNext,
  hasPrev,
  hasNext,
  moduleColor
}: {
  onPrev: () => void;
  onNext: () => void;
  hasPrev: boolean;
  hasNext: boolean;
  moduleColor: string;
}) => (
  <div className="flex items-center gap-3">
    <button
      onClick={onPrev}
      disabled={!hasPrev}
      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
        hasPrev 
          ? 'bg-white/10 hover:bg-white/20 text-white' 
          : 'bg-white/5 text-white/30 cursor-not-allowed'
      }`}
    >
      <div className="w-4 h-4"><Icons.ChevronLeft /></div>
      Précédent
    </button>
    <button
      onClick={onNext}
      disabled={!hasNext}
      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
        hasNext 
          ? 'text-black' 
          : 'bg-white/5 text-white/30 cursor-not-allowed'
      }`}
      style={{ backgroundColor: hasNext ? moduleColor : undefined }}
    >
      Suivant
      <div className="w-4 h-4"><Icons.ChevronRight /></div>
    </button>
  </div>
);

// ============================================
// MAIN COMPONENT
// ============================================
function FormationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Core State
  const [viewMode, setViewMode] = useState<ViewMode>('lesson');
  const [selectedModule, setSelectedModule] = useState<number>(0);
  const [selectedVideoIdx, setSelectedVideoIdx] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [showRightPanel, setShowRightPanel] = useState(true);

  // Gamification State
  const [xpAnimation, setXpAnimation] = useState<number | null>(null);
  const [levelUpAnimation, setLevelUpAnimation] = useState<typeof LEVELS[0] | null>(null);

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
    lastActiveDate: new Date().toISOString().split('T')[0],
    lessonsToday: 0,
    minutesToday: 0,
    quizzesToday: 0,
    unlockedBadges: [],
    notes: {},
    bookmarks: [],
  });

  // Load progress from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('formationProgress');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Update streak
        const today = new Date().toISOString().split('T')[0];
        const lastActive = parsed.lastActiveDate || today;
        
        if (lastActive !== today) {
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const yesterdayStr = yesterday.toISOString().split('T')[0];
          
          parsed.streak = lastActive === yesterdayStr ? (parsed.streak || 0) + 1 : 1;
          parsed.lastActiveDate = today;
          parsed.lessonsToday = 0;
          parsed.minutesToday = 0;
          parsed.quizzesToday = 0;
        }
        
        // Merge with defaults to ensure all fields exist
        setProgress(prev => ({
          ...prev,
          ...parsed,
          // Ensure arrays exist
          completedVideos: parsed.completedVideos || [],
          unlockedBadges: parsed.unlockedBadges || [],
          notes: parsed.notes || {},
          bookmarks: parsed.bookmarks || [],
          quizScores: parsed.quizScores || {},
        }));
      } catch (e) {
        console.error('Error loading progress:', e);
      }
    }

    // Check URL params
    const moduleParam = searchParams.get('module');
    if (moduleParam) {
      setSelectedModule(parseInt(moduleParam));
    }
  }, [searchParams]);

  // Save progress
  useEffect(() => {
    localStorage.setItem('formationProgress', JSON.stringify(progress));
  }, [progress]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      switch (e.key.toLowerCase()) {
        case ' ':
          e.preventDefault();
          setIsPlaying(p => !p);
          break;
        case 'n':
          goToNext();
          break;
        case 'p':
          goToPrev();
          break;
        case 'm':
          if (!isVideoCompleted(selectedModule, currentVideo?.id || '')) {
            completeVideo();
          }
          break;
        case 'b':
          toggleBookmark();
          break;
        case 'f':
          setFocusMode(f => !f);
          break;
        case '?':
          setShowShortcuts(true);
          break;
        case 'escape':
          setShowShortcuts(false);
          setFocusMode(false);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedModule, selectedVideoIdx]);

  // Current module and video
  const currentModule = MODULES[selectedModule] || MODULES[0];
  const currentVideo = currentModule?.videos[selectedVideoIdx];
  const currentQuiz = getQuizByModuleId(selectedModule);
  const currentQuestion = currentQuiz?.questions[currentQuestionIdx];

  // Start quiz (when clicking on quiz video)
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

  // Go to next question
  const nextQuestion = () => {
    if (!currentQuiz) return;

    setShowFeedback(false);
    setSelectedAnswer(null);

    if (currentQuestionIdx < currentQuiz.questions.length - 1) {
      setCurrentQuestionIdx(currentQuestionIdx + 1);
    } else {
      const result = calculateQuizScore(currentQuiz, quizAnswers);
      
      if (result.passed) {
        const quizVideoId = `${selectedModule}-${currentModule.videos.find(v => v.type === 'quiz')?.id}`;
        const xpGain = currentModule.xp;
        
        setProgress(p => ({
          ...p,
          completedVideos: (p.completedVideos || []).includes(quizVideoId) 
            ? p.completedVideos 
            : [...(p.completedVideos || []), quizVideoId],
          quizScores: { ...(p.quizScores || {}), [selectedModule]: result.score },
          totalXP: (p.totalXP || 0) + xpGain,
          quizzesToday: (p.quizzesToday || 0) + 1,
        }));
        
        addXP(xpGain);
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
      setViewMode('lesson');
    } else {
      router.push('/formation/complete');
    }
  };

  // Progress calculations
  const overallProgress = useMemo(() => {
    const totalVideos = MODULES.reduce((acc, m) => acc + m.videos.length, 0);
    const completedCount = (progress.completedVideos || []).length;
    return Math.round((completedCount / totalVideos) * 100);
  }, [progress.completedVideos]);

  const getModuleProgress = (moduleId: number) => {
    const module = MODULES.find(m => m.id === moduleId);
    if (!module) return 0;
    const moduleVideoIds = module.videos.map(v => `${moduleId}-${v.id}`);
    const completed = moduleVideoIds.filter(id => (progress.completedVideos || []).includes(id)).length;
    return module.videos.length > 0 ? Math.round((completed / module.videos.length) * 100) : 0;
  };

  const isModuleUnlocked = (moduleId: number) => {
    if (moduleId === 0) return true;
    const prevQuizScore = (progress.quizScores || {})[moduleId - 1];
    return prevQuizScore !== undefined && prevQuizScore >= 70;
  };

  const isVideoCompleted = (moduleId: number, videoId: string) => {
    return (progress.completedVideos || []).includes(`${moduleId}-${videoId}`);
  };

  // Add XP with animation
  const addXP = (amount: number) => {
    const prevLevel = getCurrentLevel(progress.totalXP || 0);
    const newXP = (progress.totalXP || 0) + amount;
    const newLevel = getCurrentLevel(newXP);

    setXpAnimation(amount);
    
    setProgress(p => ({ ...p, totalXP: newXP }));

    if (newLevel.level > prevLevel.level) {
      setTimeout(() => setLevelUpAnimation(newLevel), 1000);
    }
  };

  // Complete video
  const completeVideo = () => {
    if (!currentVideo) return;
    const videoId = `${selectedModule}-${currentVideo.id}`;
    if ((progress.completedVideos || []).includes(videoId)) return;

    const xpGain = 10;
    addXP(xpGain);

    setProgress(p => ({
      ...p,
      completedVideos: [...(p.completedVideos || []), videoId],
      lessonsToday: (p.lessonsToday || 0) + 1,
    }));
  };

  // Navigation
  const goToNext = () => {
    if (selectedVideoIdx < currentModule.videos.length - 1) {
      setSelectedVideoIdx(selectedVideoIdx + 1);
    } else if (selectedModule < MODULES.length - 1 && isModuleUnlocked(selectedModule + 1)) {
      setSelectedModule(selectedModule + 1);
      setSelectedVideoIdx(0);
    }
  };

  const goToPrev = () => {
    if (selectedVideoIdx > 0) {
      setSelectedVideoIdx(selectedVideoIdx - 1);
    } else if (selectedModule > 0) {
      setSelectedModule(selectedModule - 1);
      const prevModule = MODULES[selectedModule - 1];
      setSelectedVideoIdx(prevModule.videos.length - 1);
    }
  };

  // Bookmark
  const toggleBookmark = () => {
    const videoId = `${selectedModule}-${currentVideo?.id}`;
    setProgress(p => ({
      ...p,
      bookmarks: (p.bookmarks || []).includes(videoId)
        ? (p.bookmarks || []).filter(b => b !== videoId)
        : [...(p.bookmarks || []), videoId]
    }));
  };

  // Save note
  const saveNote = (videoId: string, note: string) => {
    setProgress(p => ({
      ...p,
      notes: { ...(p.notes || {}), [videoId]: note }
    }));
    // Bonus XP for first note
    if (!(progress.notes || {})[videoId] && note.trim()) {
      addXP(5);
    }
  };

  const isBookmarked = (progress.bookmarks || []).includes(`${selectedModule}-${currentVideo?.id}`);
  const hasPrev = selectedVideoIdx > 0 || selectedModule > 0;
  const hasNext = selectedVideoIdx < currentModule.videos.length - 1 || 
    (selectedModule < MODULES.length - 1 && isModuleUnlocked(selectedModule + 1));

  return (
    <div className={`min-h-screen bg-[#030014] text-white ${focusMode ? 'overflow-hidden' : ''}`}>
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-[#030014]" />
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full opacity-30 blur-[120px]" style={{ background: currentModule.color }} />
        <div className="absolute bottom-[-20%] right-[-10%] w-[800px] h-[800px] rounded-full bg-[#00F5FF]/10 blur-[150px]" />
      </div>

      {/* XP Animation */}
      <AnimatePresence>
        {xpAnimation && (
          <XPGainAnimation amount={xpAnimation} onComplete={() => setXpAnimation(null)} />
        )}
      </AnimatePresence>

      {/* Level Up Animation */}
      <AnimatePresence>
        {levelUpAnimation && (
          <LevelUpAnimation level={levelUpAnimation} onComplete={() => setLevelUpAnimation(null)} />
        )}
      </AnimatePresence>

      {/* Keyboard Shortcuts Modal */}
      <AnimatePresence>
        {showShortcuts && <KeyboardShortcuts onClose={() => setShowShortcuts(false)} />}
      </AnimatePresence>

      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-[#0A0A1B]/95 backdrop-blur-xl border-b border-white/5">
        <div className="flex items-center justify-between px-3 py-2 gap-2">
          {/* Menu Button */}
          <button 
            onClick={() => setMobileMenuOpen(true)}
            className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0"
          >
            <div className="w-5 h-5 text-white"><Icons.Menu /></div>
          </button>
          
          {/* Current Lesson Info */}
          <div className="flex-1 min-w-0 text-center">
            <p className="text-[10px] text-white/40 truncate">
              {currentModule?.title}
            </p>
            <p className="text-xs font-medium text-white truncate">
              {currentVideo?.title}
            </p>
          </div>

          {/* XP Badge */}
          <div className="flex items-center gap-1 bg-yellow-500/10 text-yellow-400 px-2 py-1 rounded-lg flex-shrink-0">
            <div className="w-4 h-4"><Icons.Zap /></div>
            <span className="text-sm font-bold">{progress.totalXP || 0}</span>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <div className={`flex h-screen ${focusMode ? '' : 'lg:pl-[340px]'}`}>
        {/* Sidebar - Only when not in focus mode */}
        {!focusMode && (
          <aside className={`
            fixed inset-y-0 left-0 z-50 w-80 lg:w-[340px]
            bg-gradient-to-b from-[#0A0A1B] to-[#050510]
            border-r border-white/5
            transform transition-transform duration-300
            ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            flex flex-col
          `}>
            {/* Sidebar content */}
            <div className="p-4 border-b border-white/5">
              {/* Close button - Mobile only */}
              <button 
                onClick={() => setMobileMenuOpen(false)}
                className="lg:hidden absolute top-3 right-3 w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white/60 hover:text-white"
              >
                <div className="w-5 h-5"><Icons.X /></div>
              </button>

              <Link href="/dashboard" className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#00F5FF] via-[#8B5CF6] to-[#FF6B6B] p-0.5">
                  <div className="w-full h-full rounded-[10px] bg-[#0A0A1B] flex items-center justify-center">
                    <div className="w-5 h-5 text-white"><Icons.Home /></div>
                  </div>
                </div>
                <div>
                  <p className="font-bold text-white">Formation AI Act</p>
                  <p className="text-white/50 text-xs">{MODULES.length} modules • 8h</p>
                </div>
              </Link>

              {/* Level Header */}
              <LevelHeader xp={progress.totalXP || 0} streak={progress.streak || 0} />
            </div>

            {/* Modules List */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {MODULES.map((module) => {
                const moduleProgress = getModuleProgress(module.id);
                const isUnlocked = isModuleUnlocked(module.id);
                const isSelected = selectedModule === module.id;
                const isCompleted = moduleProgress === 100;

                return (
                  <div key={module.id} className="rounded-xl overflow-hidden">
                    {/* Module Header */}
                    <button
                      onClick={() => {
                        if (isUnlocked) {
                          if (isSelected) {
                            // Toggle collapse
                          } else {
                            setSelectedModule(module.id);
                            setSelectedVideoIdx(0);
                          }
                          setMobileMenuOpen(false);
                        }
                      }}
                      disabled={!isUnlocked}
                      className={`
                        w-full p-3 text-left transition-all
                        ${isSelected ? 'bg-white/10' : 'hover:bg-white/5'}
                        ${!isUnlocked && 'opacity-50 cursor-not-allowed'}
                      `}
                    >
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-10 h-10 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: `${module.color}20` }}
                        >
                          {isCompleted ? (
                            <div className="w-5 h-5" style={{ color: module.color }}><Icons.Check /></div>
                          ) : !isUnlocked ? (
                            <div className="w-5 h-5 text-white/30"><Icons.Lock /></div>
                          ) : (
                            <span className="text-lg">{module.icon}</span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{module.title}</p>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
                              <div 
                                className="h-full rounded-full transition-all"
                                style={{ width: `${moduleProgress}%`, backgroundColor: module.color }}
                              />
                            </div>
                            <span className="text-xs text-white/40">{moduleProgress}%</span>
                          </div>
                        </div>
                        {isUnlocked && (
                          <div className={`w-4 h-4 text-white/40 transition-transform ${isSelected ? 'rotate-180' : ''}`}>
                            <Icons.ChevronDown />
                          </div>
                        )}
                      </div>
                    </button>

                    {/* Videos List - Show when selected */}
                    {isSelected && isUnlocked && (
                      <div className="bg-white/5 px-3 pb-2 space-y-1">
                        {module.videos.map((video, idx) => {
                          const isActive = selectedVideoIdx === idx;
                          const isComplete = isVideoCompleted(module.id, video.id);
                          const isQuiz = video.type === 'quiz';
                          
                          return (
                            <button
                              key={video.id}
                              onClick={() => {
                                setSelectedVideoIdx(idx);
                                setMobileMenuOpen(false);
                              }}
                              className={`
                                w-full p-2 rounded-lg flex items-center gap-2 text-left transition-all
                                ${isActive ? 'bg-white/10' : 'hover:bg-white/5'}
                              `}
                            >
                              <div className={`
                                w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0
                                ${isComplete ? 'bg-green-500/20' : 'bg-white/5'}
                              `}>
                                {isComplete ? (
                                  <div className="w-3 h-3 text-green-400"><Icons.Check /></div>
                                ) : isQuiz ? (
                                  <span className="text-[10px]">📝</span>
                                ) : (
                                  <span className="text-[10px] text-white/40">{idx + 1}</span>
                                )}
                              </div>
                              <span className={`text-xs truncate ${isActive ? 'text-white' : 'text-white/60'}`}>
                                {video.title}
                              </span>
                              {isActive && (
                                <div className="w-1.5 h-1.5 rounded-full ml-auto" style={{ backgroundColor: module.color }} />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </aside>
        )}

        {/* Mobile Overlay */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 bg-black/60 z-40"
              onClick={() => setMobileMenuOpen(false)}
            />
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className="flex-1 flex flex-col pt-14 lg:pt-0 pb-16 sm:pb-20 h-screen overflow-hidden">
          {/* Top Bar */}
          <div className="hidden lg:flex items-center justify-between px-6 py-4 border-b border-white/5 bg-[#0A0A1B]/50 backdrop-blur-xl">
            <div className="flex items-center gap-4">
              {/* Navigation Arrows */}
              <div className="flex items-center gap-1">
                <button
                  onClick={goToPrev}
                  disabled={!hasPrev}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                    hasPrev ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-white/5 text-white/20 cursor-not-allowed'
                  }`}
                  title="Précédent (P)"
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
                  title="Suivant (N)"
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
              
              {/* Bookmark */}
              <button 
                onClick={toggleBookmark}
                className="w-8 h-8 flex items-center justify-center text-white/40 hover:text-white transition-colors"
              >
                {isBookmarked ? (
                  <div className="w-5 h-5 text-yellow-400"><Icons.BookmarkFilled /></div>
                ) : (
                  <div className="w-5 h-5"><Icons.Bookmark /></div>
                )}
              </button>
            </div>

            <div className="flex items-center gap-3">
              {/* Focus Mode */}
              <button 
                onClick={() => setFocusMode(f => !f)}
                className={`px-3 py-1.5 rounded-lg text-sm flex items-center gap-2 transition-colors ${
                  focusMode ? 'bg-[#8B5CF6] text-white' : 'bg-white/5 text-white/60 hover:text-white'
                }`}
              >
                <div className="w-4 h-4"><Icons.Focus /></div>
                Focus
              </button>

              {/* Shortcuts */}
              <button 
                onClick={() => setShowShortcuts(true)}
                className="px-3 py-1.5 bg-white/5 rounded-lg text-sm text-white/60 hover:text-white flex items-center gap-2"
              >
                <div className="w-4 h-4"><Icons.Keyboard /></div>
                <kbd className="text-xs">?</kbd>
              </button>

              {/* XP Badge */}
              <div className="flex items-center gap-2 bg-yellow-500/10 text-yellow-400 px-3 py-1.5 rounded-lg">
                <div className="w-4 h-4"><Icons.Zap /></div>
                <span className="font-bold">{progress.totalXP || 0}</span>
              </div>

              <StreakBadge streak={progress.streak || 0} />
            </div>
          </div>

          {/* Content Area */}
          <div className={`flex-1 flex overflow-hidden ${focusMode ? 'p-0' : 'p-3 sm:p-4 lg:p-6'}`}>
            {/* Video/Content Section */}
            <div className={`flex-1 flex flex-col overflow-y-auto ${showRightPanel && !focusMode ? 'lg:pr-80' : ''}`}>
              {currentVideo?.type === 'video' && (
                <VideoPlayer
                  video={currentVideo}
                  module={currentModule}
                  isPlaying={isPlaying}
                  onPlayPause={() => setIsPlaying(!isPlaying)}
                  onComplete={completeVideo}
                  isCompleted={isVideoCompleted(selectedModule, currentVideo.id)}
                />
              )}

              {currentVideo?.type === 'exercise' && (
                <div className="flex-1 bg-white/5 rounded-2xl p-4 sm:p-6 overflow-auto border border-white/10">
                  {/* M1 - Diagnostic Initial */}
                  {currentVideo.id === '1.2' && (
                    <div className="text-center py-8">
                      <div className="text-5xl mb-4">🔍</div>
                      <h3 className="text-xl font-bold mb-2">Diagnostic Initial AI Act</h3>
                      <p className="text-white/60 mb-6 max-w-md mx-auto">
                        Téléchargez la checklist pour évaluer votre niveau de conformité actuel.
                      </p>
                      {currentVideo.exerciseFile && (
                        <a
                          href={`/resources/${currentVideo.exerciseFile}`}
                          download
                          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-black"
                          style={{ backgroundColor: currentModule.color }}
                        >
                          <div className="w-5 h-5"><Icons.Download /></div>
                          Télécharger la checklist
                        </a>
                      )}
                      <button
                        onClick={completeVideo}
                        className="block mx-auto mt-4 text-sm text-white/40 hover:text-white/60"
                      >
                        Marquer comme terminé →
                      </button>
                    </div>
                  )}

                  {/* M2 - Brainstorming & Registre IA */}
                  {currentVideo.id === '2.2' && (
                    <BrainstormingGrid 
                      moduleColor={currentModule.color}
                      onComplete={completeVideo}
                    />
                  )}
                  {currentVideo.id === '2.4' && (
                    <div className="text-center py-8">
                      <div className="text-5xl mb-4">📋</div>
                      <h3 className="text-xl font-bold mb-2">Registre des Systèmes IA</h3>
                      <p className="text-white/60 mb-6 max-w-md mx-auto">
                        Téléchargez le template Excel pour créer votre registre des systèmes IA.
                      </p>
                      {currentVideo.exerciseFile && (
                        <a
                          href={`/resources/${currentVideo.exerciseFile}`}
                          download
                          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-black"
                          style={{ backgroundColor: currentModule.color }}
                        >
                          <div className="w-5 h-5"><Icons.Download /></div>
                          Télécharger le registre
                        </a>
                      )}
                      <button
                        onClick={completeVideo}
                        className="block mx-auto mt-4 text-sm text-white/40 hover:text-white/60"
                      >
                        Marquer comme terminé →
                      </button>
                    </div>
                  )}

                  {/* M3 - Classification Wizard */}
                  {currentVideo.id === '3.2' && (
                    <ClassificationWizard 
                      moduleColor={currentModule.color}
                      onComplete={completeVideo}
                    />
                  )}

                  {/* M4 - Smart Email Editor */}
                  {currentVideo.id === '4.2' && (
                    <SmartEmailEditor 
                      moduleColor={currentModule.color}
                      onComplete={completeVideo}
                    />
                  )}

                  {/* M5 - Legal Mentions Generator */}
                  {currentVideo.id === '5.4' && (
                    <LegalMentionsGenerator 
                      moduleColor={currentModule.color}
                      onComplete={completeVideo}
                    />
                  )}

                  {/* M6 - Audit Simulation */}
                  {currentVideo.id === '6.2' && (
                    <AuditSimulation 
                      moduleColor={currentModule.color}
                      onComplete={completeVideo}
                    />
                  )}

                  {/* M7 - Action Plan Builder */}
                  {currentVideo.id === '7.2' && (
                    <ActionPlanBuilder 
                      moduleColor={currentModule.color}
                      onComplete={completeVideo}
                    />
                  )}

                  {/* Fallback pour autres exercices avec fichier */}
                  {!['1.2', '2.2', '2.4', '3.2', '4.2', '5.4', '6.2', '7.2'].includes(currentVideo.id) && 
                   currentVideo.exerciseFile && (
                    <div className="text-center py-8">
                      <div className="text-5xl mb-4">📝</div>
                      <h3 className="text-xl font-bold mb-2">Exercice Pratique</h3>
                      <p className="text-white/60 mb-6">
                        Téléchargez les ressources pour cet exercice.
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

              {/* Scenario type */}
              {currentVideo?.type === 'scenario' && (
                <div className="flex-1 bg-white/5 rounded-2xl p-4 sm:p-6 overflow-auto border border-white/10">
                  {currentModule.id === 6 ? (
                    <AuditSimulation 
                      moduleColor={currentModule.color}
                      onComplete={completeVideo}
                    />
                  ) : (
                    <div className="text-center py-8">
                      <div className="text-5xl mb-4">🎭</div>
                      <h3 className="text-xl font-bold mb-2">Scénario Interactif</h3>
                      <p className="text-white/60 mb-6">
                        Mettez-vous en situation réelle pour pratiquer.
                      </p>
                      {currentVideo.exerciseFile && (
                        <a
                          href={`/resources/${currentVideo.exerciseFile}`}
                          download
                          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-black mb-4"
                          style={{ backgroundColor: currentModule.color }}
                        >
                          <div className="w-5 h-5"><Icons.Download /></div>
                          Télécharger le scénario
                        </a>
                      )}
                      <button
                        onClick={completeVideo}
                        className="block mx-auto mt-4 px-6 py-3 rounded-xl font-bold text-black"
                        style={{ backgroundColor: currentModule.color }}
                      >
                        Lancer le scénario
                      </button>
                    </div>
                  )}
                </div>
              )}

              {currentVideo?.type === 'quiz' && viewMode === 'lesson' && (
                <div className="flex-1 bg-white/5 rounded-2xl p-6 overflow-auto">
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
                <div className="flex-1 flex flex-col min-h-[400px] bg-gradient-to-br from-purple-900/20 to-blue-900/20 rounded-2xl p-4 border border-purple-500/30">
                  {/* Debug info - à supprimer après */}
                  <div className="mb-4 p-2 bg-yellow-500/20 rounded text-yellow-300 text-xs">
                    DEBUG: viewMode={viewMode} | moduleId={selectedModule} | quizExists={currentQuiz ? 'yes' : 'no'} | questionIdx={currentQuestionIdx}
                  </div>
                  
                  {!currentQuiz ? (
                    <div className="flex-1 flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-12 h-12 border-4 border-[#8B5CF6] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                        <p className="text-white/60">Chargement du quiz...</p>
                        <p className="text-red-400 text-sm mt-2">Quiz non trouvé pour module {selectedModule}</p>
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
                                className="p-3 rounded-xl text-xs sm:text-sm"
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
                          <div className="text-center">
                            <div className="text-5xl mb-4">❓</div>
                            <p className="text-white/60">Question non trouvée</p>
                            <button 
                              onClick={() => setViewMode('lesson')}
                              className="mt-4 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20"
                            >
                              Retour
                            </button>
                          </div>
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
                </div>
              )}

              {/* Navigation - Hide in quiz mode */}
              {viewMode !== 'quiz' && (
                <div className="flex items-center justify-between mt-4">
                  <NavigationButtons
                    onPrev={goToPrev}
                    onNext={goToNext}
                    hasPrev={hasPrev}
                    hasNext={hasNext}
                    moduleColor={currentModule.color}
                  />

                  {!isVideoCompleted(selectedModule, currentVideo?.id || '') && currentVideo?.type !== 'quiz' && (
                    <button
                      onClick={completeVideo}
                      className="px-4 py-2 rounded-xl text-sm font-medium bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors flex items-center gap-2"
                    >
                      <div className="w-4 h-4"><Icons.Check /></div>
                      Marquer terminé
                    </button>
                  )}
                </div>
              )}

              {/* Quiz Back Button */}
              {viewMode === 'quiz' && (
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

            {/* Right Panel - Notes & Daily Goals */}
            {showRightPanel && !focusMode && (
              <aside className="hidden lg:block fixed right-0 top-0 bottom-0 w-80 bg-[#0A0A1B]/95 border-l border-white/5 p-4 pt-20 overflow-y-auto">
                <div className="space-y-4">
                  {/* Daily Goals */}
                  <DailyGoals progress={progress} />

                  {/* Notes */}
                  <NotesPanel
                    videoId={`${selectedModule}-${currentVideo?.id}`}
                    notes={progress.notes || {}}
                    onSave={saveNote}
                  />

                  {/* Resources */}
                  {currentVideo?.exerciseFile && (
                    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                      <h3 className="font-semibold text-sm flex items-center gap-2 mb-3">
                        <div className="w-4 h-4 text-[#00FF88]"><Icons.Download /></div>
                        Ressources
                      </h3>
                      <a
                        href={`/resources/${currentVideo.exerciseFile}`}
                        download
                        className="flex items-center gap-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                      >
                        <div className="w-10 h-10 rounded-lg bg-[#00FF88]/10 flex items-center justify-center">
                          <div className="w-5 h-5 text-[#00FF88]"><Icons.FileText /></div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{currentVideo.exerciseFile}</p>
                          <p className="text-xs text-white/40">Télécharger</p>
                        </div>
                      </a>
                    </div>
                  )}

                  {/* Keyboard hint */}
                  <div className="text-center text-xs text-white/30 mt-4">
                    Appuyez sur <kbd className="px-2 py-0.5 bg-white/10 rounded mx-1">?</kbd> pour les raccourcis
                  </div>
                </div>
              </aside>
            )}
          </div>
        </main>

        {/* Fixed Bottom Navigation Bar - Hide during quiz */}
        {viewMode !== 'quiz' && (
          <div className={`fixed bottom-0 left-0 right-0 z-40 bg-[#0A0A1B]/95 backdrop-blur-xl border-t border-white/10 px-3 py-2 sm:px-4 sm:py-3 ${focusMode ? '' : 'lg:left-[340px]'}`}>
            <div className="max-w-4xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
              {/* Previous */}
              <button
                onClick={goToPrev}
                disabled={!hasPrev}
                className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl font-medium transition-all text-sm ${
                  hasPrev 
                    ? 'bg-white/10 hover:bg-white/20 text-white' 
                    : 'bg-white/5 text-white/30 cursor-not-allowed'
                }`}
              >
                <div className="w-4 h-4 sm:w-5 sm:h-5"><Icons.ChevronLeft /></div>
                <span className="hidden sm:inline">Précédent</span>
              </button>

              {/* Center - Mark Complete Button (simplified on mobile) */}
              <div className="flex-1 flex items-center justify-center">
                {!isVideoCompleted(selectedModule, currentVideo?.id || '') && currentVideo?.type !== 'quiz' ? (
                  <button
                    onClick={completeVideo}
                    className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl font-medium bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors text-sm"
                  >
                    <div className="w-4 h-4"><Icons.Check /></div>
                    <span>Terminé</span>
                    <span className="hidden sm:inline text-green-400/60">+10 XP</span>
                  </button>
                ) : isVideoCompleted(selectedModule, currentVideo?.id || '') ? (
                  <div className="flex items-center gap-2 text-green-400 text-sm">
                    <div className="w-5 h-5"><Icons.Check /></div>
                    <span className="hidden sm:inline">Leçon terminée</span>
                    <span className="sm:hidden">✓</span>
                  </div>
                ) : currentVideo?.type === 'quiz' ? (
                  <button
                    onClick={startQuiz}
                    className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl font-medium text-black text-sm"
                    style={{ backgroundColor: currentModule.color }}
                  >
                    <span>📝</span>
                    <span>Commencer le quiz</span>
                  </button>
                ) : (
                  <span className="text-xs text-white/40 text-center">
                    {selectedVideoIdx + 1} / {currentModule?.videos?.length || 0}
                  </span>
                )}
              </div>

              {/* Next */}
              <button
                onClick={goToNext}
                disabled={!hasNext}
                className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl font-medium transition-all text-sm ${
                  hasNext 
                    ? 'text-black' 
                    : 'bg-white/5 text-white/30 cursor-not-allowed'
                }`}
                style={{ backgroundColor: hasNext ? currentModule.color : undefined }}
              >
                <span className="hidden sm:inline">Suivant</span>
                <div className="w-4 h-4 sm:w-5 sm:h-5"><Icons.ChevronRight /></div>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Loading fallback
function FormationLoading() {
  return (
    <div className="min-h-screen bg-[#030014] flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-[#8B5CF6] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-white/60">Chargement de la formation...</p>
      </div>
    </div>
  );
}

// Export with Suspense wrapper
export default function FormationPageWrapper() {
  return (
    <Suspense fallback={<FormationLoading />}>
      <FormationPage />
    </Suspense>
  );
}
