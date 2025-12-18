'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, CheckCircle, Lock, ChevronRight, Download, X,
  FileSpreadsheet, FileText, ClipboardList, Award, LogOut,
  User, Clock, Trophy, Flame, Zap, Star, Gift, 
  BookOpen, Target, TrendingUp, Calendar, Crown,
  ChevronDown, Volume2, Pause, SkipForward, Settings,
  Bell, Search, Menu, Home, FolderOpen, Medal,
  Sparkles, PartyPopper, Shield
} from 'lucide-react';
import Link from 'next/link';

// Données utilisateur simulées
const userData = {
  name: 'Jean',
  avatar: 'JD',
  plan: 'Équipe',
  streak: 7,
  totalXP: 1250,
  weeklyXP: 380,
  rank: 12,
  badges: ['early-bird', 'first-module', 'week-streak'],
};

// Modules de formation
const modules = [
  { 
    id: 1, 
    title: "Introduction à l'AI Act", 
    description: "Comprendre les fondamentaux du règlement européen",
    duration: "45 min",
    lessons: 5,
    xp: 150,
    completed: true, 
    progress: 100,
    icon: "📋"
  },
  { 
    id: 2, 
    title: "Classification des risques", 
    description: "Les 4 niveaux de risque et leurs implications",
    duration: "1h",
    lessons: 6,
    xp: 200,
    completed: true, 
    progress: 100,
    icon: "⚠️"
  },
  { 
    id: 3, 
    title: "Registre des systèmes IA", 
    description: "Cartographier et documenter vos usages IA",
    duration: "1h15",
    lessons: 7,
    xp: 250,
    completed: false, 
    progress: 60,
    currentLesson: 5,
    icon: "📊"
  },
  { 
    id: 4, 
    title: "Gouvernance IA", 
    description: "Mettre en place une politique IA d'entreprise",
    duration: "1h",
    lessons: 5,
    xp: 200,
    completed: false, 
    progress: 0,
    icon: "🏛️"
  },
  { 
    id: 5, 
    title: "Systèmes à haut risque", 
    description: "Documentation technique et conformité",
    duration: "1h30",
    lessons: 8,
    xp: 300,
    completed: false, 
    progress: 0,
    icon: "🔒"
  },
  { 
    id: 6, 
    title: "Audit et conformité", 
    description: "Préparer et maintenir votre conformité",
    duration: "1h",
    lessons: 6,
    xp: 250,
    completed: false, 
    progress: 0,
    icon: "✅"
  },
];

// Ressources
const resources = [
  { id: 1, name: "Guide AI Act - Synthèse", module: 1, type: "pdf", file: "guide-ai-act-synthese.pdf" },
  { id: 2, name: "Checklist : Êtes-vous concerné ?", module: 1, type: "xlsx", file: "checklist-etes-vous-concerne.xlsx" },
  { id: 3, name: "Matrice classification risques", module: 2, type: "xlsx", file: "matrice-classification-risques.xlsx" },
  { id: 4, name: "Exemples par secteur", module: 2, type: "pdf", file: "exemples-secteurs-activite.pdf" },
  { id: 5, name: "Template Registre IA", module: 3, type: "xlsx", file: "template-registre-ia.xlsx" },
  { id: 6, name: "Guide d'audit pas à pas", module: 3, type: "pdf", file: "guide-audit-pas-a-pas.pdf" },
  { id: 7, name: "Modèle Politique IA", module: 4, type: "docx", file: "modele-politique-ia.docx" },
  { id: 8, name: "Fiche de poste Référent IA", module: 4, type: "docx", file: "fiche-poste-referent-ia.docx" },
  { id: 9, name: "Template Documentation technique", module: 5, type: "docx", file: "template-documentation-technique.docx" },
  { id: 10, name: "Checklist Marquage CE", module: 5, type: "xlsx", file: "checklist-marquage-ce.xlsx" },
  { id: 11, name: "Plan d'audit type", module: 6, type: "xlsx", file: "plan-audit-type.xlsx" },
  { id: 12, name: "Tableau de bord conformité", module: 6, type: "xlsx", file: "tableau-bord-conformite-ia.xlsx" },
];

// Badges disponibles
const allBadges = [
  { id: 'early-bird', name: 'Lève-tôt', icon: '🌅', description: 'Première leçon avant 9h', earned: true },
  { id: 'first-module', name: 'Premier pas', icon: '🎯', description: 'Premier module terminé', earned: true },
  { id: 'week-streak', name: 'Semaine parfaite', icon: '🔥', description: '7 jours consécutifs', earned: true },
  { id: 'speed-learner', name: 'Rapide', icon: '⚡', description: 'Module en moins de 30min', earned: false },
  { id: 'half-way', name: 'Mi-parcours', icon: '🏃', description: '50% de la formation', earned: false },
  { id: 'certified', name: 'Certifié', icon: '🏆', description: 'Formation complète', earned: false },
];

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<'learn' | 'resources' | 'badges'>('learn');
  const [showStreakModal, setShowStreakModal] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Calculs
  const completedModules = modules.filter(m => m.completed).length;
  const totalProgress = Math.round(modules.reduce((acc, m) => acc + m.progress, 0) / modules.length);
  const currentModule = modules.find(m => !m.completed && m.progress > 0) || modules.find(m => !m.completed);
  const totalXPPossible = modules.reduce((acc, m) => acc + m.xp, 0);
  const earnedXP = modules.filter(m => m.completed).reduce((acc, m) => acc + m.xp, 0) + 
                   (currentModule ? Math.round((currentModule.progress / 100) * currentModule.xp) : 0);

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'xlsx': return <FileSpreadsheet className="w-5 h-5" />;
      case 'docx': return <FileText className="w-5 h-5" />;
      case 'pdf': return <ClipboardList className="w-5 h-5" />;
      default: return <FileText className="w-5 h-5" />;
    }
  };

  const getFileColor = (type: string) => {
    switch (type) {
      case 'xlsx': return 'text-emerald-400 bg-emerald-500/10';
      case 'docx': return 'text-blue-400 bg-blue-500/10';
      case 'pdf': return 'text-red-400 bg-red-500/10';
      default: return 'text-slate-400 bg-slate-500/10';
    }
  };

  // Greeting basé sur l'heure
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bonjour';
    if (hour < 18) return 'Bon après-midi';
    return 'Bonsoir';
  };

  return (
    <div className="min-h-screen bg-[#0f172a]">
      {/* Header */}
      <header className="bg-[#0f172a]/95 backdrop-blur-xl border-b border-slate-800/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <span className="text-lg font-bold text-white hidden sm:block">Formation AI Act</span>
            </Link>

            {/* Navigation desktop */}
            <nav className="hidden md:flex items-center gap-1">
              {[
                { id: 'learn', label: 'Apprendre', icon: BookOpen },
                { id: 'resources', label: 'Ressources', icon: FolderOpen },
                { id: 'badges', label: 'Badges', icon: Medal },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-cyan-500/20 text-cyan-400'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </nav>

            {/* Right side */}
            <div className="flex items-center gap-3">
              {/* Streak */}
              <button 
                onClick={() => setShowStreakModal(true)}
                className="flex items-center gap-2 bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/30 rounded-full px-3 py-1.5 transition-colors"
              >
                <Flame className="w-5 h-5 text-orange-400" />
                <span className="text-orange-400 font-bold">{userData.streak}</span>
              </button>

              {/* XP */}
              <div className="hidden sm:flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/30 rounded-full px-3 py-1.5">
                <Zap className="w-5 h-5 text-yellow-400" />
                <span className="text-yellow-400 font-bold">{earnedXP}</span>
              </div>

              {/* Avatar */}
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {userData.avatar}
                </div>
              </div>

              {/* Mobile menu */}
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden text-slate-400 hover:text-white"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile navigation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden border-t border-slate-800 overflow-hidden"
            >
              <div className="px-4 py-3 space-y-1">
                {[
                  { id: 'learn', label: 'Apprendre', icon: BookOpen },
                  { id: 'resources', label: 'Ressources', icon: FolderOpen },
                  { id: 'badges', label: 'Badges', icon: Medal },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => { setActiveTab(tab.id as typeof activeTab); setIsMobileMenuOpen(false); }}
                    className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg font-medium transition-all ${
                      activeTab === tab.id
                        ? 'bg-cyan-500/20 text-cyan-400'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                    }`}
                  >
                    <tab.icon className="w-5 h-5" />
                    {tab.label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Welcome Section */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }} 
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            {/* Greeting */}
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                {getGreeting()}, {userData.name} ! 👋
              </h1>
              <p className="text-slate-400">
                {totalProgress < 100 
                  ? `Vous avez complété ${totalProgress}% de votre formation. Continuez comme ça !`
                  : `Félicitations ! Vous avez terminé la formation. 🎉`
                }
              </p>
            </div>

            {/* Quick Stats */}
            <div className="flex flex-wrap gap-3">
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3 flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{completedModules}/6</p>
                  <p className="text-slate-500 text-xs">Modules</p>
                </div>
              </div>
              
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3 flex items-center gap-3">
                <div className="w-10 h-10 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">~{Math.round((6 - completedModules) * 1.2)}h</p>
                  <p className="text-slate-500 text-xs">Restantes</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Global Progress Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }} 
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="bg-gradient-to-r from-slate-800/80 to-slate-800/40 border border-slate-700/50 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <Target className="w-5 h-5 text-cyan-400" />
                <span className="text-white font-medium">Progression globale</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-3xl font-bold text-white">{totalProgress}%</span>
              </div>
            </div>
            <div className="h-4 bg-slate-700/50 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${totalProgress}%` }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-full relative"
              >
                <div className="absolute inset-0 bg-white/20 animate-pulse" />
              </motion.div>
            </div>
            <div className="flex items-center justify-between mt-3 text-sm">
              <div className="flex items-center gap-4">
                <span className="text-slate-400">
                  <span className="text-emerald-400 font-medium">{completedModules}</span> modules terminés
                </span>
                <span className="text-slate-400">
                  <span className="text-yellow-400 font-medium">{earnedXP}</span>/{totalXPPossible} XP
                </span>
              </div>
              {totalProgress >= 100 && (
                <span className="text-emerald-400 font-medium flex items-center gap-1">
                  <CheckCircle className="w-4 h-4" /> Terminé !
                </span>
              )}
            </div>
          </div>
        </motion.div>

        {/* Content based on active tab */}
        <AnimatePresence mode="wait">
          {activeTab === 'learn' && (
            <motion.div
              key="learn"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {/* Continue Learning Card */}
              {currentModule && (
                <div className="mb-8">
                  <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Play className="w-5 h-5 text-cyan-400" />
                    Continuer votre apprentissage
                  </h2>
                  <div className="bg-gradient-to-br from-cyan-500/10 via-blue-500/10 to-purple-500/10 border border-cyan-500/20 rounded-2xl p-6 relative overflow-hidden">
                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-cyan-500/10 to-transparent rounded-full blur-3xl" />
                    
                    <div className="relative flex flex-col lg:flex-row lg:items-center gap-6">
                      {/* Module info */}
                      <div className="flex items-start gap-4 flex-1">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center text-3xl sm:text-4xl flex-shrink-0 shadow-lg shadow-cyan-500/25">
                          {currentModule.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-cyan-400 text-sm font-medium">Module {currentModule.id}</span>
                            <span className="text-slate-500">•</span>
                            <span className="text-slate-400 text-sm">{currentModule.duration}</span>
                          </div>
                          <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">{currentModule.title}</h3>
                          <p className="text-slate-400 text-sm mb-3 hidden sm:block">{currentModule.description}</p>
                          
                          {/* Progress */}
                          <div className="flex items-center gap-3">
                            <div className="flex-1 max-w-xs">
                              <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-gradient-to-r from-cyan-400 to-cyan-500 rounded-full"
                                  style={{ width: `${currentModule.progress}%` }}
                                />
                              </div>
                            </div>
                            <span className="text-cyan-400 font-medium text-sm">{currentModule.progress}%</span>
                          </div>
                          
                          {currentModule.currentLesson && (
                            <p className="text-slate-500 text-sm mt-2">
                              Leçon {currentModule.currentLesson}/{currentModule.lessons}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* CTA */}
                      <div className="flex flex-col items-stretch lg:items-end gap-3">
                        <button className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-bold px-8 py-4 rounded-xl transition-all flex items-center justify-center gap-3 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-[1.02]">
                          <Play className="w-6 h-6" fill="white" />
                          <span className="text-lg">
                            {currentModule.progress > 0 ? 'Reprendre' : 'Commencer'}
                          </span>
                        </button>
                        <div className="flex items-center justify-center gap-2 text-sm">
                          <Zap className="w-4 h-4 text-yellow-400" />
                          <span className="text-yellow-400 font-medium">+{currentModule.xp} XP</span>
                          <span className="text-slate-500">à gagner</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* All Modules */}
              <div>
                <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-slate-400" />
                  Tous les modules
                </h2>
                <div className="grid gap-3">
                  {modules.map((module, index) => (
                    <motion.div
                      key={module.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`group bg-slate-800/30 hover:bg-slate-800/50 border rounded-xl p-4 sm:p-5 transition-all cursor-pointer ${
                        module.completed 
                          ? 'border-emerald-500/30 hover:border-emerald-500/50' 
                          : module.progress > 0 
                            ? 'border-cyan-500/30 hover:border-cyan-500/50' 
                            : 'border-slate-700/50 hover:border-slate-600'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        {/* Icon */}
                        <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center text-2xl sm:text-3xl flex-shrink-0 transition-transform group-hover:scale-105 ${
                          module.completed 
                            ? 'bg-emerald-500/20' 
                            : module.progress > 0 
                              ? 'bg-cyan-500/20' 
                              : 'bg-slate-800'
                        }`}>
                          {module.completed ? (
                            <CheckCircle className="w-8 h-8 text-emerald-400" />
                          ) : (
                            module.icon
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                              module.completed ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-700 text-slate-400'
                            }`}>
                              Module {module.id}
                            </span>
                            <span className="text-slate-500 text-xs hidden sm:inline">{module.duration} • {module.lessons} leçons</span>
                          </div>
                          <h3 className="font-semibold text-white group-hover:text-cyan-400 transition-colors truncate">
                            {module.title}
                          </h3>
                          <p className="text-slate-500 text-sm truncate hidden sm:block">{module.description}</p>
                          
                          {/* Progress bar for in-progress modules */}
                          {module.progress > 0 && !module.completed && (
                            <div className="flex items-center gap-2 mt-2">
                              <div className="w-32 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-cyan-500 rounded-full"
                                  style={{ width: `${module.progress}%` }}
                                />
                              </div>
                              <span className="text-cyan-400 text-xs font-medium">{module.progress}%</span>
                            </div>
                          )}
                        </div>

                        {/* Right side */}
                        <div className="flex items-center gap-4 flex-shrink-0">
                          <div className="hidden sm:flex items-center gap-1 text-sm">
                            <Zap className="w-4 h-4 text-yellow-400" />
                            <span className="text-yellow-400 font-medium">{module.xp}</span>
                          </div>
                          <ChevronRight className={`w-5 h-5 transition-transform group-hover:translate-x-1 ${
                            module.completed ? 'text-emerald-400' : module.progress > 0 ? 'text-cyan-400' : 'text-slate-500'
                          }`} />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Certificate Banner */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-8"
              >
                {totalProgress >= 100 ? (
                  <div className="bg-gradient-to-r from-amber-500/20 via-yellow-500/20 to-orange-500/20 border border-amber-500/30 rounded-2xl p-6 sm:p-8 text-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djZoNnYtNmgtNnptMC0xMHY2aDZ2LTZoLTZ6bTAgLTEwdjZoNnYtNmgtNnptLTEwIDEwdjZoNnYtNmgtNnptMCAxMHY2aDZ2LTZoLTZ6bTAgMTB2Nmg2di02aC02em0tMTAtMTB2Nmg2di02aC02em0wIDEwdjZoNnYtNmgtNnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-50" />
                    <div className="relative">
                      <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-amber-500/30">
                        <Award className="w-10 h-10 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-2">Félicitations ! 🎉</h3>
                      <p className="text-slate-300 mb-6 max-w-md mx-auto">
                        Vous avez terminé la formation AI Act. Téléchargez votre certificat de compétence.
                      </p>
                      <button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-bold px-8 py-4 rounded-xl transition-all shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 flex items-center gap-2 mx-auto">
                        <Download className="w-5 h-5" />
                        Télécharger mon certificat
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-5 flex items-center gap-4">
                    <div className="w-14 h-14 bg-slate-800 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Award className="w-7 h-7 text-slate-500" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-white font-semibold">Certificat de compétence AI Act</h3>
                      <p className="text-slate-500 text-sm">Terminez les 6 modules pour l'obtenir</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-white">{totalProgress}%</div>
                      <div className="text-slate-500 text-xs">complété</div>
                    </div>
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}

          {activeTab === 'resources' && (
            <motion.div
              key="resources"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {/* Download All Banner */}
              <div className="bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border border-emerald-500/20 rounded-2xl p-5 sm:p-6 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                    <Gift className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-lg">12 ressources professionnelles</h3>
                    <p className="text-slate-400 text-sm">Valeur totale : 847€ • Inclus dans votre formation</p>
                  </div>
                </div>
                <a
                  href="/resources/ressources-formation-ia-act.zip"
                  download
                  className="bg-emerald-500 hover:bg-emerald-400 text-white font-semibold px-6 py-3 rounded-xl flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
                >
                  <Download className="w-5 h-5" />
                  Tout télécharger (ZIP)
                </a>
              </div>

              {/* Resources by Module */}
              <div className="space-y-6">
                {[1, 2, 3, 4, 5, 6].map((moduleId) => {
                  const moduleResources = resources.filter(r => r.module === moduleId);
                  const module = modules.find(m => m.id === moduleId);
                  return (
                    <div key={moduleId}>
                      <h3 className="text-sm font-medium text-slate-400 mb-3 flex items-center gap-2">
                        <span className="text-lg">{module?.icon}</span>
                        Module {moduleId} : {module?.title}
                      </h3>
                      <div className="grid sm:grid-cols-2 gap-3">
                        {moduleResources.map((resource) => (
                          <a
                            key={resource.id}
                            href={`/resources/${resource.file}`}
                            download
                            className="group bg-slate-800/30 hover:bg-slate-800/50 border border-slate-700/50 hover:border-slate-600 rounded-xl p-4 flex items-center gap-4 transition-all"
                          >
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${getFileColor(resource.type)}`}>
                              {getFileIcon(resource.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-white font-medium text-sm group-hover:text-cyan-400 transition-colors truncate">
                                {resource.name}
                              </p>
                              <p className="text-slate-500 text-xs mt-0.5 uppercase">
                                {resource.type}
                              </p>
                            </div>
                            <Download className="w-5 h-5 text-slate-500 group-hover:text-cyan-400 transition-colors flex-shrink-0" />
                          </a>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {activeTab === 'badges' && (
            <motion.div
              key="badges"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {/* Badge Stats */}
              <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-2xl p-6 mb-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-white font-semibold text-lg mb-1">Vos accomplissements</h3>
                    <p className="text-slate-400 text-sm">
                      {allBadges.filter(b => b.earned).length} badges sur {allBadges.length} débloqués
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {allBadges.filter(b => b.earned).map((badge) => (
                      <div key={badge.id} className="text-2xl">{badge.icon}</div>
                    ))}
                  </div>
                </div>
              </div>

              {/* All Badges Grid */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {allBadges.map((badge) => (
                  <div
                    key={badge.id}
                    className={`relative bg-slate-800/30 border rounded-xl p-5 transition-all ${
                      badge.earned 
                        ? 'border-purple-500/30 hover:border-purple-500/50' 
                        : 'border-slate-700/50 opacity-50'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-3xl ${
                        badge.earned ? 'bg-purple-500/20' : 'bg-slate-800 grayscale'
                      }`}>
                        {badge.icon}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-white font-semibold">{badge.name}</h4>
                        <p className="text-slate-500 text-sm mt-1">{badge.description}</p>
                        {badge.earned && (
                          <span className="inline-flex items-center gap-1 text-emerald-400 text-xs mt-2">
                            <CheckCircle className="w-3 h-3" /> Obtenu
                          </span>
                        )}
                      </div>
                    </div>
                    {!badge.earned && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Lock className="w-8 h-8 text-slate-600" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Streak Modal */}
      <AnimatePresence>
        {showStreakModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowStreakModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-800 border border-slate-700 rounded-2xl p-6 max-w-sm w-full text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Flame className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                {userData.streak} jours de suite ! 🔥
              </h3>
              <p className="text-slate-400 mb-6">
                Continuez votre série d'apprentissage pour gagner des badges exclusifs.
              </p>
              <div className="flex justify-center gap-2 mb-6">
                {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                  <div
                    key={day}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
                      day <= userData.streak
                        ? 'bg-orange-500 text-white'
                        : 'bg-slate-700 text-slate-500'
                    }`}
                  >
                    {day <= userData.streak ? '✓' : day}
                  </div>
                ))}
              </div>
              <button
                onClick={() => setShowStreakModal(false)}
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold py-3 rounded-xl hover:opacity-90 transition-opacity"
              >
                Continuer ma série
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
