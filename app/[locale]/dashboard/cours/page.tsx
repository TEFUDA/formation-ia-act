'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

// Icons
const Icons = {
  Shield: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  Play: () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full"><polygon points="5 3 19 12 5 21 5 3"/></svg>,
  Pause: () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>,
  Check: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-full h-full"><polyline points="20 6 9 17 4 12"/></svg>,
  ChevronLeft: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><polyline points="15 18 9 12 15 6"/></svg>,
  ChevronRight: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><polyline points="9 18 15 12 9 6"/></svg>,
  List: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>,
  Clock: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  Award: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>,
  Download: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
  FileText: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
  Volume2: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>,
  Maximize: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>,
};

// Module data with lessons
const modulesData = [
  { 
    id: 1, 
    title: "Fondamentaux de l'AI Act", 
    duration: "45 min", 
    color: '#00F5FF',
    description: "Comprendre les bases du règlement européen sur l'intelligence artificielle",
    lessons: [
      { id: 1, title: "Introduction à l'AI Act", duration: "8 min", videoUrl: "/videos/module1-lesson1.mp4" },
      { id: 2, title: "Contexte et historique", duration: "10 min", videoUrl: "/videos/module1-lesson2.mp4" },
      { id: 3, title: "Champ d'application", duration: "12 min", videoUrl: "/videos/module1-lesson3.mp4" },
      { id: 4, title: "Définitions clés", duration: "8 min", videoUrl: "/videos/module1-lesson4.mp4" },
      { id: 5, title: "Quiz & Récapitulatif", duration: "7 min", videoUrl: "/videos/module1-lesson5.mp4" },
    ]
  },
  { 
    id: 2, 
    title: "Classification des Risques", 
    duration: "1h", 
    color: '#00FF88',
    description: "Maîtriser la pyramide des risques et identifier votre catégorie",
    lessons: [
      { id: 1, title: "La pyramide des risques", duration: "10 min", videoUrl: "/videos/module2-lesson1.mp4" },
      { id: 2, title: "Systèmes interdits", duration: "12 min", videoUrl: "/videos/module2-lesson2.mp4" },
      { id: 3, title: "Systèmes haut risque", duration: "15 min", videoUrl: "/videos/module2-lesson3.mp4" },
      { id: 4, title: "Risque limité & minimal", duration: "10 min", videoUrl: "/videos/module2-lesson4.mp4" },
      { id: 5, title: "Cas pratiques", duration: "8 min", videoUrl: "/videos/module2-lesson5.mp4" },
      { id: 6, title: "Quiz & Récapitulatif", duration: "5 min", videoUrl: "/videos/module2-lesson6.mp4" },
    ]
  },
  { 
    id: 3, 
    title: "Obligations Fournisseurs", 
    duration: "1h30", 
    color: '#8B5CF6',
    description: "Toutes les obligations pour les fournisseurs de systèmes IA",
    lessons: [
      { id: 1, title: "Qui est fournisseur ?", duration: "10 min", videoUrl: "/videos/module3-lesson1.mp4" },
      { id: 2, title: "Système de gestion des risques", duration: "15 min", videoUrl: "/videos/module3-lesson2.mp4" },
      { id: 3, title: "Données et gouvernance", duration: "12 min", videoUrl: "/videos/module3-lesson3.mp4" },
      { id: 4, title: "Documentation technique", duration: "15 min", videoUrl: "/videos/module3-lesson4.mp4" },
      { id: 5, title: "Transparence & information", duration: "12 min", videoUrl: "/videos/module3-lesson5.mp4" },
      { id: 6, title: "Contrôle humain", duration: "10 min", videoUrl: "/videos/module3-lesson6.mp4" },
      { id: 7, title: "Quiz & Récapitulatif", duration: "6 min", videoUrl: "/videos/module3-lesson7.mp4" },
    ]
  },
  { 
    id: 4, 
    title: "Obligations Déployeurs", 
    duration: "1h", 
    color: '#FFB800',
    description: "Les obligations pour les utilisateurs professionnels de systèmes IA",
    lessons: [
      { id: 1, title: "Qui est déployeur ?", duration: "8 min", videoUrl: "/videos/module4-lesson1.mp4" },
      { id: 2, title: "Obligations principales", duration: "15 min", videoUrl: "/videos/module4-lesson2.mp4" },
      { id: 3, title: "Contrôle humain", duration: "12 min", videoUrl: "/videos/module4-lesson3.mp4" },
      { id: 4, title: "Analyse d'impact (FRIA)", duration: "15 min", videoUrl: "/videos/module4-lesson4.mp4" },
      { id: 5, title: "Quiz & Récapitulatif", duration: "10 min", videoUrl: "/videos/module4-lesson5.mp4" },
    ]
  },
  { 
    id: 5, 
    title: "Gouvernance IA", 
    duration: "1h30", 
    color: '#FF6B00',
    description: "Mettre en place une gouvernance IA conforme dans votre organisation",
    lessons: [
      { id: 1, title: "Principes de gouvernance", duration: "10 min", videoUrl: "/videos/module5-lesson1.mp4" },
      { id: 2, title: "Rôles et responsabilités", duration: "12 min", videoUrl: "/videos/module5-lesson2.mp4" },
      { id: 3, title: "Comité IA", duration: "10 min", videoUrl: "/videos/module5-lesson3.mp4" },
      { id: 4, title: "Politiques internes", duration: "15 min", videoUrl: "/videos/module5-lesson4.mp4" },
      { id: 5, title: "Formation Article 4", duration: "12 min", videoUrl: "/videos/module5-lesson5.mp4" },
      { id: 6, title: "Registre des systèmes IA", duration: "15 min", videoUrl: "/videos/module5-lesson6.mp4" },
      { id: 7, title: "Audit interne", duration: "10 min", videoUrl: "/videos/module5-lesson7.mp4" },
      { id: 8, title: "Quiz & Récapitulatif", duration: "6 min", videoUrl: "/videos/module5-lesson8.mp4" },
    ]
  },
  { 
    id: 6, 
    title: "Mise en Conformité Pratique", 
    duration: "2h", 
    color: '#FF4444',
    description: "Plan d'action concret pour atteindre la conformité AI Act",
    lessons: [
      { id: 1, title: "Cartographie des systèmes", duration: "12 min", videoUrl: "/videos/module6-lesson1.mp4" },
      { id: 2, title: "Gap analysis", duration: "15 min", videoUrl: "/videos/module6-lesson2.mp4" },
      { id: 3, title: "Plan de remédiation", duration: "12 min", videoUrl: "/videos/module6-lesson3.mp4" },
      { id: 4, title: "Documentation obligatoire", duration: "15 min", videoUrl: "/videos/module6-lesson4.mp4" },
      { id: 5, title: "Tests et validation", duration: "12 min", videoUrl: "/videos/module6-lesson5.mp4" },
      { id: 6, title: "Préparation aux audits", duration: "15 min", videoUrl: "/videos/module6-lesson6.mp4" },
      { id: 7, title: "Maintien de conformité", duration: "12 min", videoUrl: "/videos/module6-lesson7.mp4" },
      { id: 8, title: "Utilisation des templates", duration: "10 min", videoUrl: "/videos/module6-lesson8.mp4" },
      { id: 9, title: "Cas pratique complet", duration: "15 min", videoUrl: "/videos/module6-lesson9.mp4" },
      { id: 10, title: "Quiz final & Certificat", duration: "12 min", videoUrl: "/videos/module6-lesson10.mp4" },
    ]
  },
];

// Neural Background
const NeuralBackground = () => (
  <div className="fixed inset-0 pointer-events-none overflow-hidden">
    <div className="absolute inset-0 bg-[#030014]" />
    <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-[#00F5FF]/5 blur-[120px]" />
    <div className="absolute bottom-[-20%] right-[-10%] w-[800px] h-[800px] rounded-full bg-[#8B5CF6]/5 blur-[150px]" />
  </div>
);

export default function CoursPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const moduleId = parseInt(searchParams.get('module') || '1');
  const lessonId = parseInt(searchParams.get('lesson') || '1');
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showSidebar, setShowSidebar] = useState(true);
  const [completedLessons, setCompletedLessons] = useState<Record<string, boolean>>({});
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const currentModule = modulesData.find(m => m.id === moduleId) || modulesData[0];
  const currentLesson = currentModule.lessons.find(l => l.id === lessonId) || currentModule.lessons[0];
  
  // Load progress from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('courseProgress');
    if (saved) {
      setCompletedLessons(JSON.parse(saved));
    }
  }, []);
  
  // Save progress to localStorage
  const markAsCompleted = () => {
    const key = `${moduleId}-${lessonId}`;
    const newCompleted = { ...completedLessons, [key]: true };
    setCompletedLessons(newCompleted);
    localStorage.setItem('courseProgress', JSON.stringify(newCompleted));
    
    // Update module progress in dashboard format
    updateModuleProgress();
  };
  
  const updateModuleProgress = () => {
    const moduleProgress: Record<number, number> = {};
    
    modulesData.forEach(mod => {
      const completedCount = mod.lessons.filter(
        lesson => completedLessons[`${mod.id}-${lesson.id}`]
      ).length;
      moduleProgress[mod.id] = Math.round((completedCount / mod.lessons.length) * 100);
    });
    
    localStorage.setItem('moduleProgress', JSON.stringify(moduleProgress));
  };
  
  const isLessonCompleted = (modId: number, lesId: number) => {
    return completedLessons[`${modId}-${lesId}`] || false;
  };
  
  const getModuleProgress = (modId: number) => {
    const mod = modulesData.find(m => m.id === modId);
    if (!mod) return 0;
    const completedCount = mod.lessons.filter(l => isLessonCompleted(modId, l.id)).length;
    return Math.round((completedCount / mod.lessons.length) * 100);
  };
  
  const goToNextLesson = () => {
    markAsCompleted();
    
    const currentLessonIndex = currentModule.lessons.findIndex(l => l.id === lessonId);
    
    // Next lesson in current module
    if (currentLessonIndex < currentModule.lessons.length - 1) {
      router.push(`/dashboard/cours?module=${moduleId}&lesson=${currentModule.lessons[currentLessonIndex + 1].id}`);
    }
    // First lesson of next module
    else if (moduleId < modulesData.length) {
      router.push(`/dashboard/cours?module=${moduleId + 1}&lesson=1`);
    }
    // Course completed
    else {
      router.push('/formation/complete');
    }
  };
  
  const goToPrevLesson = () => {
    const currentLessonIndex = currentModule.lessons.findIndex(l => l.id === lessonId);
    
    // Previous lesson in current module
    if (currentLessonIndex > 0) {
      router.push(`/dashboard/cours?module=${moduleId}&lesson=${currentModule.lessons[currentLessonIndex - 1].id}`);
    }
    // Last lesson of previous module
    else if (moduleId > 1) {
      const prevModule = modulesData[moduleId - 2];
      router.push(`/dashboard/cours?module=${moduleId - 1}&lesson=${prevModule.lessons[prevModule.lessons.length - 1].id}`);
    }
  };
  
  // Simulate video progress
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            setIsPlaying(false);
            return 100;
          }
          return prev + 0.5;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);
  
  // Reset progress when changing lessons
  useEffect(() => {
    setProgress(0);
    setIsPlaying(false);
  }, [moduleId, lessonId]);

  return (
    <div className="min-h-screen bg-[#030014] text-white">
      <NeuralBackground />
      
      {/* Header */}
      <header className="relative z-20 bg-[#0A0A1B]/80 backdrop-blur-xl border-b border-white/10">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="flex items-center gap-2 text-white/60 hover:text-white transition-colors">
              <div className="w-5 h-5"><Icons.ChevronLeft /></div>
              <span className="hidden sm:inline">Dashboard</span>
            </Link>
            <div className="h-6 w-px bg-white/10" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${currentModule.color}20` }}>
                <span className="text-sm">📚</span>
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-white">{currentModule.title}</p>
                <p className="text-xs text-white/50">Leçon {lessonId}/{currentModule.lessons.length}</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowSidebar(!showSidebar)}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
            >
              <div className="w-5 h-5 text-white/60"><Icons.List /></div>
            </button>
            <Link 
              href="/dashboard?tab=templates"
              className="hidden sm:flex items-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
            >
              <div className="w-4 h-4 text-white/60"><Icons.FileText /></div>
              <span className="text-sm text-white/60">Templates</span>
            </Link>
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="h-1 bg-white/5">
          <div 
            className="h-full transition-all duration-300"
            style={{ 
              width: `${getModuleProgress(moduleId)}%`,
              background: currentModule.color 
            }}
          />
        </div>
      </header>
      
      <div className="relative z-10 flex">
        {/* Sidebar */}
        <AnimatePresence>
          {showSidebar && (
            <motion.aside
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              className="w-80 h-[calc(100vh-57px)] bg-[#0A0A1B]/50 backdrop-blur-xl border-r border-white/10 overflow-y-auto flex-shrink-0"
            >
              <div className="p-4">
                {modulesData.map(mod => (
                  <div key={mod.id} className="mb-4">
                    <div 
                      className="flex items-center justify-between p-3 rounded-xl mb-2"
                      style={{ 
                        background: mod.id === moduleId ? `${mod.color}15` : 'transparent',
                        border: mod.id === moduleId ? `1px solid ${mod.color}30` : '1px solid transparent'
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{getModuleProgress(mod.id) === 100 ? '✅' : '📚'}</span>
                        <div>
                          <p className="text-sm font-medium text-white">Module {mod.id}</p>
                          <p className="text-xs text-white/50">{mod.title}</p>
                        </div>
                      </div>
                      <span className="text-xs font-medium" style={{ color: mod.color }}>
                        {getModuleProgress(mod.id)}%
                      </span>
                    </div>
                    
                    {mod.id === moduleId && (
                      <div className="space-y-1 ml-2">
                        {mod.lessons.map(lesson => (
                          <button
                            key={lesson.id}
                            onClick={() => router.push(`/dashboard/cours?module=${mod.id}&lesson=${lesson.id}`)}
                            className={`w-full text-left p-2 rounded-lg flex items-center gap-2 transition-colors ${
                              lesson.id === lessonId 
                                ? 'bg-white/10 text-white' 
                                : 'text-white/60 hover:bg-white/5 hover:text-white'
                            }`}
                          >
                            <span className="w-5 h-5 flex items-center justify-center text-xs">
                              {isLessonCompleted(mod.id, lesson.id) ? (
                                <span className="text-[#00FF88]">✓</span>
                              ) : (
                                <span className="text-white/30">{lesson.id}</span>
                              )}
                            </span>
                            <span className="text-sm flex-1 truncate">{lesson.title}</span>
                            <span className="text-xs text-white/30">{lesson.duration}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </motion.aside>
          )}
        </AnimatePresence>
        
        {/* Main Content */}
        <main className="flex-1 h-[calc(100vh-57px)] overflow-y-auto">
          <div className="max-w-5xl mx-auto p-6">
            {/* Video Player */}
            <div className="relative aspect-video bg-black rounded-2xl overflow-hidden mb-6 group">
              {/* Placeholder video content */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a2e] to-[#0a0a1b] flex items-center justify-center">
                <div className="text-center">
                  <div 
                    className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 cursor-pointer transition-transform hover:scale-110"
                    style={{ background: `${currentModule.color}20`, border: `2px solid ${currentModule.color}` }}
                    onClick={() => setIsPlaying(!isPlaying)}
                  >
                    <div className="w-10 h-10 ml-1" style={{ color: currentModule.color }}>
                      {isPlaying ? <Icons.Pause /> : <Icons.Play />}
                    </div>
                  </div>
                  <p className="text-white/60 text-sm">
                    {isPlaying ? 'Lecture en cours...' : 'Cliquez pour lancer la vidéo'}
                  </p>
                </div>
              </div>
              
              {/* Video Controls */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
                  >
                    <div className="w-5 h-5 text-white">
                      {isPlaying ? <Icons.Pause /> : <Icons.Play />}
                    </div>
                  </button>
                  
                  <div className="flex-1">
                    <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all"
                        style={{ width: `${progress}%`, background: currentModule.color }}
                      />
                    </div>
                  </div>
                  
                  <span className="text-white/60 text-sm">{currentLesson.duration}</span>
                  
                  <button className="w-8 h-8 text-white/60 hover:text-white transition-colors">
                    <Icons.Volume2 />
                  </button>
                  
                  <button className="w-8 h-8 text-white/60 hover:text-white transition-colors">
                    <Icons.Maximize />
                  </button>
                </div>
              </div>
            </div>
            
            {/* Lesson Info */}
            <div className="mb-8">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <p className="text-sm text-white/50 mb-1">
                    Module {moduleId} • Leçon {lessonId}
                  </p>
                  <h1 className="text-2xl font-bold text-white mb-2">{currentLesson.title}</h1>
                  <p className="text-white/60">{currentModule.description}</p>
                </div>
                
                <button
                  onClick={markAsCompleted}
                  disabled={isLessonCompleted(moduleId, lessonId)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all flex-shrink-0 ${
                    isLessonCompleted(moduleId, lessonId)
                      ? 'bg-[#00FF88]/20 text-[#00FF88] border border-[#00FF88]/30'
                      : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
                  }`}
                >
                  <div className="w-4 h-4"><Icons.Check /></div>
                  {isLessonCompleted(moduleId, lessonId) ? 'Terminé' : 'Marquer comme vu'}
                </button>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-white/50">
                <div className="flex items-center gap-1">
                  <div className="w-4 h-4"><Icons.Clock /></div>
                  <span>{currentLesson.duration}</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-4 h-4"><Icons.Award /></div>
                  <span>Module {moduleId}/6</span>
                </div>
              </div>
            </div>
            
            {/* Navigation */}
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
              <button
                onClick={goToPrevLesson}
                disabled={moduleId === 1 && lessonId === 1}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-white/10 hover:bg-white/20 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <div className="w-4 h-4"><Icons.ChevronLeft /></div>
                Précédent
              </button>
              
              <div className="text-center">
                <p className="text-sm text-white/50">
                  Progression du module
                </p>
                <p className="text-lg font-bold" style={{ color: currentModule.color }}>
                  {getModuleProgress(moduleId)}%
                </p>
              </div>
              
              <button
                onClick={goToNextLesson}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors"
                style={{ 
                  background: currentModule.color,
                  color: '#000'
                }}
              >
                {progress >= 100 || isLessonCompleted(moduleId, lessonId) ? 'Suivant' : 'Passer'}
                <div className="w-4 h-4"><Icons.ChevronRight /></div>
              </button>
            </div>
            
            {/* Resources */}
            <div className="mt-8">
              <h2 className="text-lg font-semibold mb-4">Ressources de la leçon</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-4 bg-white/5 border border-white/10 rounded-xl flex items-center gap-3 hover:bg-white/10 transition-colors cursor-pointer">
                  <div className="w-10 h-10 rounded-lg bg-[#00F5FF]/20 flex items-center justify-center">
                    <div className="w-5 h-5 text-[#00F5FF]"><Icons.FileText /></div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white">Support de cours PDF</p>
                    <p className="text-xs text-white/50">Télécharger le support</p>
                  </div>
                  <div className="w-5 h-5 text-white/30"><Icons.Download /></div>
                </div>
                
                <div className="p-4 bg-white/5 border border-white/10 rounded-xl flex items-center gap-3 hover:bg-white/10 transition-colors cursor-pointer">
                  <div className="w-10 h-10 rounded-lg bg-[#00FF88]/20 flex items-center justify-center">
                    <div className="w-5 h-5 text-[#00FF88]"><Icons.FileText /></div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white">Template associé</p>
                    <p className="text-xs text-white/50">Voir dans les templates</p>
                  </div>
                  <div className="w-5 h-5 text-white/30"><Icons.ChevronRight /></div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
