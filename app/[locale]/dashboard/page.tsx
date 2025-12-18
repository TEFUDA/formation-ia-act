'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  Play, CheckCircle, Lock, ChevronRight, Download, X,
  FileSpreadsheet, FileText, ClipboardList, Award, LogOut,
  User, Clock, Trophy, Flame, Zap, Star, Gift, 
  BookOpen, Target, TrendingUp, ChevronDown, Settings,
  Menu, FolderOpen, Medal, Shield, Users, ExternalLink,
  Share2, Bell, Calendar, BarChart3, Sparkles
} from 'lucide-react';
import Link from 'next/link';

// Données utilisateur simulées (en production: depuis l'auth/API)
const initialUserData = {
  id: 'user-123',
  name: 'Jean',
  lastName: 'Dupont',
  email: 'jean.dupont@acme.com',
  avatar: 'JD',
  role: 'admin' as 'admin' | 'employee' | 'solo', // Changer à 'employee' pour tester
  plan: 'Équipe',
  companyName: 'Acme Corporation',
  streak: 7,
  totalXP: 1250,
  weeklyXP: 380,
  rank: 12,
};

// Modules de formation
const initialModules = [
  { 
    id: 1, 
    title: "Introduction à l'AI Act", 
    description: "Comprendre les fondamentaux du règlement européen",
    duration: "45 min",
    lessons: [
      { id: 1, title: "Origines et objectifs de l'AI Act", duration: "10 min" },
      { id: 2, title: "Calendrier d'application", duration: "8 min" },
      { id: 3, title: "Acteurs concernés", duration: "12 min" },
      { id: 4, title: "Articulation avec le RGPD", duration: "10 min" },
      { id: 5, title: "Quiz du module", duration: "5 min" },
    ],
    xp: 150,
    completed: true, 
    progress: 100,
    quizScore: 90,
    icon: "📋"
  },
  { 
    id: 2, 
    title: "Classification des risques", 
    description: "Les 4 niveaux de risque et leurs implications",
    duration: "1h",
    lessons: [
      { id: 1, title: "Les 4 niveaux de risque", duration: "15 min" },
      { id: 2, title: "IA interdites (risque inacceptable)", duration: "12 min" },
      { id: 3, title: "IA à haut risque", duration: "15 min" },
      { id: 4, title: "IA à risque limité", duration: "10 min" },
      { id: 5, title: "IA à risque minimal", duration: "8 min" },
      { id: 6, title: "Quiz du module", duration: "5 min" },
    ],
    xp: 200,
    completed: true, 
    progress: 100,
    quizScore: 85,
    icon: "⚠️"
  },
  { 
    id: 3, 
    title: "Registre des systèmes IA", 
    description: "Cartographier et documenter vos usages IA",
    duration: "1h15",
    lessons: [
      { id: 1, title: "Méthodologie d'audit interne", duration: "15 min" },
      { id: 2, title: "Inventaire des systèmes IA", duration: "12 min" },
      { id: 3, title: "Classification de vos usages", duration: "15 min" },
      { id: 4, title: "Le registre des traitements IA", duration: "15 min" },
      { id: 5, title: "Évaluation d'impact algorithmique", duration: "12 min" },
      { id: 6, title: "Template et outils pratiques", duration: "8 min" },
      { id: 7, title: "Quiz du module", duration: "5 min" },
    ],
    xp: 250,
    completed: false, 
    progress: 57,
    currentLesson: 5,
    quizScore: null,
    icon: "📊"
  },
  { 
    id: 4, 
    title: "Gouvernance IA", 
    description: "Mettre en place une politique IA d'entreprise",
    duration: "1h",
    lessons: [
      { id: 1, title: "Rôles et responsabilités", duration: "12 min" },
      { id: 2, title: "Le référent IA", duration: "10 min" },
      { id: 3, title: "Politique IA d'entreprise", duration: "15 min" },
      { id: 4, title: "Comité de pilotage IA", duration: "12 min" },
      { id: 5, title: "Quiz du module", duration: "5 min" },
    ],
    xp: 200,
    completed: false, 
    progress: 0,
    quizScore: null,
    icon: "🏛️"
  },
  { 
    id: 5, 
    title: "Systèmes à haut risque", 
    description: "Documentation technique et conformité",
    duration: "1h30",
    lessons: [
      { id: 1, title: "Identifier les systèmes à haut risque", duration: "15 min" },
      { id: 2, title: "Exigences de gestion des risques", duration: "12 min" },
      { id: 3, title: "Data governance", duration: "15 min" },
      { id: 4, title: "Documentation technique", duration: "15 min" },
      { id: 5, title: "Transparence et information", duration: "10 min" },
      { id: 6, title: "Contrôle humain", duration: "10 min" },
      { id: 7, title: "Marquage CE", duration: "8 min" },
      { id: 8, title: "Quiz du module", duration: "5 min" },
    ],
    xp: 300,
    completed: false, 
    progress: 0,
    quizScore: null,
    icon: "🔒"
  },
  { 
    id: 6, 
    title: "Audit et conformité", 
    description: "Préparer et maintenir votre conformité",
    duration: "1h",
    lessons: [
      { id: 1, title: "Audits internes IA", duration: "15 min" },
      { id: 2, title: "Indicateurs de conformité", duration: "12 min" },
      { id: 3, title: "Amélioration continue", duration: "10 min" },
      { id: 4, title: "Préparer les contrôles", duration: "12 min" },
      { id: 5, title: "Sanctions et responsabilités", duration: "8 min" },
      { id: 6, title: "Quiz du module", duration: "5 min" },
    ],
    xp: 250,
    completed: false, 
    progress: 0,
    quizScore: null,
    icon: "✅"
  },
];

// Ressources
const resources = [
  { id: 1, name: "Guide AI Act - Synthèse", module: 1, type: "pdf", file: "guide-ai-act-synthese.pdf", size: "2.4 MB" },
  { id: 2, name: "Checklist : Êtes-vous concerné ?", module: 1, type: "xlsx", file: "checklist-etes-vous-concerne.xlsx", size: "156 KB" },
  { id: 3, name: "Matrice classification risques", module: 2, type: "xlsx", file: "matrice-classification-risques.xlsx", size: "234 KB" },
  { id: 4, name: "Exemples par secteur", module: 2, type: "pdf", file: "exemples-secteurs-activite.pdf", size: "1.8 MB" },
  { id: 5, name: "Template Registre IA", module: 3, type: "xlsx", file: "template-registre-ia.xlsx", size: "445 KB" },
  { id: 6, name: "Guide d'audit pas à pas", module: 3, type: "pdf", file: "guide-audit-pas-a-pas.pdf", size: "3.2 MB" },
  { id: 7, name: "Modèle Politique IA", module: 4, type: "docx", file: "modele-politique-ia.docx", size: "189 KB" },
  { id: 8, name: "Fiche de poste Référent IA", module: 4, type: "docx", file: "fiche-poste-referent-ia.docx", size: "124 KB" },
  { id: 9, name: "Template Documentation technique", module: 5, type: "docx", file: "template-documentation-technique.docx", size: "267 KB" },
  { id: 10, name: "Checklist Marquage CE", module: 5, type: "xlsx", file: "checklist-marquage-ce.xlsx", size: "178 KB" },
  { id: 11, name: "Plan d'audit type", module: 6, type: "xlsx", file: "plan-audit-type.xlsx", size: "312 KB" },
  { id: 12, name: "Tableau de bord conformité", module: 6, type: "xlsx", file: "tableau-bord-conformite-ia.xlsx", size: "534 KB" },
];

// Badges disponibles
const allBadges = [
  { id: 'early-bird', name: 'Lève-tôt', icon: '🌅', description: 'Première leçon avant 9h', earned: true, earnedDate: '15 Jan 2024' },
  { id: 'first-module', name: 'Premier pas', icon: '🎯', description: 'Premier module terminé', earned: true, earnedDate: '16 Jan 2024' },
  { id: 'week-streak', name: 'Semaine parfaite', icon: '🔥', description: '7 jours consécutifs', earned: true, earnedDate: '22 Jan 2024' },
  { id: 'speed-learner', name: 'Rapide', icon: '⚡', description: 'Module en moins de 30min', earned: false },
  { id: 'half-way', name: 'Mi-parcours', icon: '🏃', description: '50% de la formation', earned: false },
  { id: 'perfect-quiz', name: 'Sans faute', icon: '💯', description: '100% à un quiz', earned: false },
  { id: 'certified', name: 'Certifié', icon: '🏆', description: 'Formation complète', earned: false },
  { id: 'helper', name: 'Entraide', icon: '🤝', description: 'Aider un collègue', earned: false },
];

export default function DashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'learn' | 'resources' | 'badges'>('learn');
  const [showStreakModal, setShowStreakModal] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showModuleDetail, setShowModuleDetail] = useState<number | null>(null);
  const [showBadgeDetail, setShowBadgeDetail] = useState<typeof allBadges[0] | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [notification, setNotification] = useState<{type: 'success' | 'info', message: string} | null>(null);
  
  // State pour les modules (persistant pendant la session)
  const [modules, setModules] = useState(initialModules);
  const [userData, setUserData] = useState(initialUserData);
  
  // Calculs
  const completedModules = modules.filter(m => m.completed).length;
  const totalProgress = Math.round(modules.reduce((acc, m) => acc + m.progress, 0) / modules.length);
  const currentModule = modules.find(m => !m.completed && m.progress > 0) || modules.find(m => !m.completed);
  const totalXPPossible = modules.reduce((acc, m) => acc + m.xp, 0);
  const earnedXP = modules.filter(m => m.completed).reduce((acc, m) => acc + m.xp, 0) + 
                   (currentModule ? Math.round((currentModule.progress / 100) * currentModule.xp) : 0);
  
  // Calcul score quiz moyen
  const modulesWithQuiz = modules.filter(m => m.quizScore !== null);
  const averageQuizScore = modulesWithQuiz.length > 0
    ? Math.round(modulesWithQuiz.reduce((acc, m) => acc + (m.quizScore || 0), 0) / modulesWithQuiz.length)
    : 0;
  
  // Éligibilité certificat
  const canGetCertificate = completedModules === 6 && averageQuizScore >= 80;
  const isAdmin = userData.role === 'admin';

  // Notification
  const showNotification = (type: 'success' | 'info', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

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

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bonjour';
    if (hour < 18) return 'Bon après-midi';
    return 'Bonsoir';
  };

  const handleStartModule = (moduleId: number) => {
    router.push(`/formation?module=${moduleId}&lesson=1`);
  };

  const handleContinueModule = (moduleId: number) => {
    const module = modules.find(m => m.id === moduleId);
    const lessonId = module?.currentLesson || 1;
    router.push(`/formation?module=${moduleId}&lesson=${lessonId}`);
  };

  const handleDownloadResource = (resource: typeof resources[0]) => {
    // Simule le téléchargement
    showNotification('success', `Téléchargement de "${resource.name}" démarré`);
  };

  const handleDownloadAll = () => {
    showNotification('success', 'Téléchargement du ZIP (12 fichiers) démarré');
  };

  const handleLogout = () => {
    router.push('/');
  };

  const handleShareProgress = () => {
    navigator.clipboard.writeText(`J'ai complété ${totalProgress}% de ma formation AI Act ! 🚀`);
    showNotification('info', 'Progression copiée dans le presse-papier');
  };

  return (
    <div className="min-h-screen bg-[#0f172a]">
      {/* Notification Toast */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className={`fixed top-4 right-4 z-[100] px-4 py-3 rounded-xl shadow-lg flex items-center gap-3 ${
              notification.type === 'success' 
                ? 'bg-emerald-500 text-white' 
                : 'bg-cyan-500 text-white'
            }`}
          >
            <CheckCircle className="w-5 h-5" />
            {notification.message}
          </motion.div>
        )}
      </AnimatePresence>

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
              {/* Admin Button */}
              {isAdmin && (
                <Link
                  href="/admin"
                  className="hidden sm:flex items-center gap-2 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 rounded-lg px-3 py-1.5 text-purple-400 text-sm font-medium transition-colors"
                >
                  <Users className="w-4 h-4" />
                  Gérer l'équipe
                </Link>
              )}

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

              {/* Profile Menu */}
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-2 hover:bg-slate-800/50 rounded-lg p-1 transition-colors"
                >
                  <div className="w-9 h-9 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {userData.avatar}
                  </div>
                  <ChevronDown className={`w-4 h-4 text-slate-400 hidden sm:block transition-transform ${showProfileMenu ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {showProfileMenu && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setShowProfileMenu(false)} />
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 top-12 w-72 bg-slate-800 border border-slate-700 rounded-xl shadow-xl z-50 overflow-hidden"
                      >
                        {/* User Info */}
                        <div className="p-4 border-b border-slate-700">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                              {userData.avatar}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-white font-semibold truncate">{userData.name} {userData.lastName}</p>
                              <p className="text-slate-400 text-sm truncate">{userData.email}</p>
                            </div>
                          </div>
                          <div className="mt-3 flex items-center gap-2">
                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                              isAdmin ? 'bg-purple-500/20 text-purple-400' : 'bg-slate-700 text-slate-300'
                            }`}>
                              {isAdmin ? 'Admin' : 'Membre'}
                            </span>
                            <span className="text-slate-500 text-xs">• Plan {userData.plan}</span>
                          </div>
                        </div>

                        {/* Stats */}
                        <div className="p-3 border-b border-slate-700">
                          <div className="grid grid-cols-3 gap-2 text-center">
                            <div className="bg-slate-700/30 rounded-lg p-2">
                              <p className="text-lg font-bold text-white">{totalProgress}%</p>
                              <p className="text-slate-500 text-xs">Progression</p>
                            </div>
                            <div className="bg-slate-700/30 rounded-lg p-2">
                              <p className="text-lg font-bold text-yellow-400">{earnedXP}</p>
                              <p className="text-slate-500 text-xs">XP</p>
                            </div>
                            <div className="bg-slate-700/30 rounded-lg p-2">
                              <p className="text-lg font-bold text-orange-400">{userData.streak}</p>
                              <p className="text-slate-500 text-xs">Streak</p>
                            </div>
                          </div>
                        </div>

                        {/* Menu Items */}
                        <div className="p-2">
                          {isAdmin && (
                            <Link
                              href="/admin"
                              onClick={() => setShowProfileMenu(false)}
                              className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-700/50 hover:text-white transition-colors"
                            >
                              <Users className="w-5 h-5 text-purple-400" />
                              <span>Tableau de bord admin</span>
                              <ExternalLink className="w-4 h-4 ml-auto text-slate-500" />
                            </Link>
                          )}
                          
                          {canGetCertificate && (
                            <Link
                              href="/certificate"
                              onClick={() => setShowProfileMenu(false)}
                              className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-700/50 hover:text-white transition-colors"
                            >
                              <Award className="w-5 h-5 text-yellow-400" />
                              <span>Mon certificat</span>
                              <span className="ml-auto text-xs bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded">Disponible</span>
                            </Link>
                          )}

                          <button
                            onClick={() => { handleShareProgress(); setShowProfileMenu(false); }}
                            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-700/50 hover:text-white transition-colors"
                          >
                            <Share2 className="w-5 h-5" />
                            <span>Partager ma progression</span>
                          </button>

                          <button
                            onClick={() => setShowProfileMenu(false)}
                            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-700/50 hover:text-white transition-colors"
                          >
                            <Settings className="w-5 h-5" />
                            <span>Paramètres</span>
                          </button>

                          <hr className="my-2 border-slate-700" />

                          <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
                          >
                            <LogOut className="w-5 h-5" />
                            <span>Déconnexion</span>
                          </button>
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
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
                {isAdmin && (
                  <Link
                    href="/admin"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 w-full px-4 py-3 rounded-lg font-medium text-purple-400 bg-purple-500/10"
                  >
                    <Users className="w-5 h-5" />
                    Gérer l'équipe
                  </Link>
                )}
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
        {/* Certificate Banner */}
        {canGetCertificate && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
            <Link href="/certificate" className="block">
              <div className="bg-gradient-to-r from-yellow-500/20 via-amber-500/20 to-orange-500/20 border border-yellow-500/30 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-yellow-500/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-xl flex items-center justify-center">
                    <Award className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg">Félicitations ! 🎉</h3>
                    <p className="text-slate-300 text-sm">Votre certificat est prêt à être téléchargé</p>
                  </div>
                </div>
                <button className="bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-white font-semibold px-6 py-3 rounded-xl flex items-center justify-center gap-2 transition-all">
                  <Download className="w-5 h-5" />
                  Obtenir mon certificat
                </button>
              </div>
            </Link>
          </motion.div>
        )}

        {/* Welcome Section */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
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
                  <Target className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <p className={`text-2xl font-bold ${averageQuizScore >= 80 ? 'text-emerald-400' : 'text-white'}`}>{averageQuizScore}%</p>
                  <p className="text-slate-500 text-xs">Score quiz</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Global Progress Bar */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-8">
          <div className="bg-gradient-to-r from-slate-800/80 to-slate-800/40 border border-slate-700/50 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-5 h-5 text-cyan-400" />
                <span className="text-white font-medium">Progression globale</span>
              </div>
              <span className="text-3xl font-bold text-white">{totalProgress}%</span>
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
              <span className="text-slate-400">
                <span className="text-yellow-400 font-medium">{earnedXP}</span>/{totalXPPossible} XP
              </span>
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
            <motion.div key="learn" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              {/* Continue Learning Card */}
              {currentModule && totalProgress < 100 && (
                <div className="mb-8">
                  <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Play className="w-5 h-5 text-cyan-400" />
                    Continuer votre apprentissage
                  </h2>
                  <div className="bg-gradient-to-br from-cyan-500/10 via-blue-500/10 to-purple-500/10 border border-cyan-500/20 rounded-2xl p-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-cyan-500/10 to-transparent rounded-full blur-3xl" />
                    
                    <div className="relative flex flex-col lg:flex-row lg:items-center gap-6">
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
                          
                          <div className="flex items-center gap-3">
                            <div className="flex-1 max-w-xs">
                              <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-gradient-to-r from-cyan-400 to-cyan-500 rounded-full"
                                  style={{ width: `${currentModule.progress}%` }}
                                />
                              </div>
                            </div>
                            <span className="text-slate-400 text-sm">
                              {currentModule.currentLesson || 1}/{currentModule.lessons.length} leçons
                            </span>
                          </div>
                        </div>
                      </div>

                      <button 
                        onClick={() => handleContinueModule(currentModule.id)}
                        className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-bold px-8 py-4 rounded-xl flex items-center justify-center gap-3 text-lg transition-all hover:scale-[1.02] shadow-lg shadow-cyan-500/25"
                      >
                        <Play className="w-6 h-6" fill="white" />
                        Reprendre
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* All Modules */}
              <div>
                <h2 className="text-lg font-semibold text-white mb-4">Tous les modules</h2>
                <div className="grid gap-4">
                  {modules.map((module, index) => {
                    const isLocked = index > 0 && !modules[index - 1].completed && module.progress === 0;
                    const isCurrent = currentModule?.id === module.id;
                    
                    return (
                      <motion.div
                        key={module.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`bg-slate-800/30 border rounded-xl p-5 transition-all cursor-pointer ${
                          module.completed 
                            ? 'border-emerald-500/30 hover:border-emerald-500/50' 
                            : isCurrent
                              ? 'border-cyan-500/30 hover:border-cyan-500/50'
                              : isLocked
                                ? 'border-slate-700/50 opacity-60 cursor-not-allowed'
                                : 'border-slate-700/50 hover:border-slate-600'
                        }`}
                        onClick={() => !isLocked && setShowModuleDetail(module.id)}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                          <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 ${
                            module.completed
                              ? 'bg-emerald-500/20'
                              : isCurrent
                                ? 'bg-cyan-500/20'
                                : 'bg-slate-700/50'
                          }`}>
                            {isLocked ? <Lock className="w-6 h-6 text-slate-500" /> : module.icon}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-slate-500 text-sm">Module {module.id}</span>
                              {module.completed && <CheckCircle className="w-4 h-4 text-emerald-400" />}
                              {isCurrent && <span className="text-cyan-400 text-xs bg-cyan-500/20 px-2 py-0.5 rounded">En cours</span>}
                            </div>
                            <h3 className="text-white font-semibold">{module.title}</h3>
                            <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-slate-400">
                              <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {module.duration}</span>
                              <span>{module.lessons.length} leçons</span>
                              <span className="flex items-center gap-1"><Zap className="w-4 h-4 text-yellow-400" /> {module.xp} XP</span>
                              {module.quizScore !== null && (
                                <span className={`flex items-center gap-1 ${module.quizScore >= 80 ? 'text-emerald-400' : 'text-orange-400'}`}>
                                  Quiz: {module.quizScore}%
                                </span>
                              )}
                            </div>
                            
                            {module.progress > 0 && module.progress < 100 && (
                              <div className="mt-3">
                                <div className="h-1.5 bg-slate-700/50 rounded-full overflow-hidden max-w-xs">
                                  <div className="h-full bg-cyan-500 rounded-full" style={{ width: `${module.progress}%` }} />
                                </div>
                              </div>
                            )}
                          </div>

                          <div className="flex-shrink-0">
                            {module.completed ? (
                              <button
                                onClick={(e) => { e.stopPropagation(); handleStartModule(module.id); }}
                                className="text-emerald-400 hover:text-emerald-300 font-medium text-sm flex items-center gap-1 bg-emerald-500/10 hover:bg-emerald-500/20 px-4 py-2 rounded-lg transition-colors"
                              >
                                Revoir <ChevronRight className="w-4 h-4" />
                              </button>
                            ) : isLocked ? (
                              <span className="text-slate-500 text-sm flex items-center gap-1">
                                <Lock className="w-4 h-4" /> Verrouillé
                              </span>
                            ) : isCurrent ? (
                              <button
                                onClick={(e) => { e.stopPropagation(); handleContinueModule(module.id); }}
                                className="bg-cyan-500 hover:bg-cyan-400 text-white font-semibold px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                              >
                                <Play className="w-4 h-4" /> Continuer
                              </button>
                            ) : (
                              <button
                                onClick={(e) => { e.stopPropagation(); handleStartModule(module.id); }}
                                className="bg-slate-700 hover:bg-slate-600 text-white font-semibold px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                              >
                                Commencer
                              </button>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'resources' && (
            <motion.div key="resources" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
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
                <button
                  onClick={handleDownloadAll}
                  className="bg-emerald-500 hover:bg-emerald-400 text-white font-semibold px-6 py-3 rounded-xl flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
                >
                  <Download className="w-5 h-5" />
                  Tout télécharger (ZIP)
                </button>
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
                          <button
                            key={resource.id}
                            onClick={() => handleDownloadResource(resource)}
                            className="group bg-slate-800/30 hover:bg-slate-800/50 border border-slate-700/50 hover:border-slate-600 rounded-xl p-4 flex items-center gap-4 transition-all text-left"
                          >
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${getFileColor(resource.type)}`}>
                              {getFileIcon(resource.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-white font-medium text-sm group-hover:text-cyan-400 transition-colors truncate">
                                {resource.name}
                              </p>
                              <p className="text-slate-500 text-xs mt-0.5 uppercase">
                                {resource.type} • {resource.size}
                              </p>
                            </div>
                            <Download className="w-5 h-5 text-slate-500 group-hover:text-cyan-400 transition-colors flex-shrink-0" />
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {activeTab === 'badges' && (
            <motion.div key="badges" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
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
                      <button
                        key={badge.id}
                        onClick={() => setShowBadgeDetail(badge)}
                        className="text-2xl hover:scale-110 transition-transform"
                      >
                        {badge.icon}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* All Badges Grid */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {allBadges.map((badge) => (
                  <button
                    key={badge.id}
                    onClick={() => badge.earned && setShowBadgeDetail(badge)}
                    className={`relative bg-slate-800/30 border rounded-xl p-5 transition-all text-left ${
                      badge.earned 
                        ? 'border-purple-500/30 hover:border-purple-500/50 cursor-pointer' 
                        : 'border-slate-700/50 opacity-50 cursor-not-allowed'
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
                      <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-slate-900/50">
                        <Lock className="w-8 h-8 text-slate-600" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* ===== MODALS ===== */}

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
              <div className="text-slate-500 text-sm mb-4">
                🎯 Prochain objectif : 14 jours pour le badge "Deux semaines"
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

      {/* Module Detail Modal */}
      <AnimatePresence>
        {showModuleDetail && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowModuleDetail(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-800 border border-slate-700 rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {(() => {
                const module = modules.find(m => m.id === showModuleDetail);
                if (!module) return null;
                
                return (
                  <>
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center gap-4">
                        <div className={`w-16 h-16 rounded-xl flex items-center justify-center text-3xl ${
                          module.completed ? 'bg-emerald-500/20' : 'bg-cyan-500/20'
                        }`}>
                          {module.icon}
                        </div>
                        <div>
                          <span className="text-slate-400 text-sm">Module {module.id}</span>
                          <h3 className="text-xl font-bold text-white">{module.title}</h3>
                        </div>
                      </div>
                      <button onClick={() => setShowModuleDetail(null)} className="text-slate-400 hover:text-white">
                        <X className="w-6 h-6" />
                      </button>
                    </div>

                    <p className="text-slate-400 mb-6">{module.description}</p>

                    <div className="grid grid-cols-3 gap-3 mb-6">
                      <div className="bg-slate-700/30 rounded-lg p-3 text-center">
                        <p className="text-lg font-bold text-white">{module.duration}</p>
                        <p className="text-slate-500 text-xs">Durée</p>
                      </div>
                      <div className="bg-slate-700/30 rounded-lg p-3 text-center">
                        <p className="text-lg font-bold text-white">{module.lessons.length}</p>
                        <p className="text-slate-500 text-xs">Leçons</p>
                      </div>
                      <div className="bg-slate-700/30 rounded-lg p-3 text-center">
                        <p className="text-lg font-bold text-yellow-400">{module.xp}</p>
                        <p className="text-slate-500 text-xs">XP</p>
                      </div>
                    </div>

                    <div className="mb-6">
                      <h4 className="text-white font-semibold mb-3">Contenu du module</h4>
                      <div className="space-y-2">
                        {module.lessons.map((lesson, idx) => {
                          const isCompleted = module.completed || (module.currentLesson && idx < module.currentLesson - 1);
                          const isCurrent = !module.completed && module.currentLesson === idx + 1;
                          
                          return (
                            <div
                              key={idx}
                              className={`flex items-center gap-3 p-3 rounded-lg ${
                                isCompleted ? 'bg-emerald-500/10' : isCurrent ? 'bg-cyan-500/10' : 'bg-slate-700/30'
                              }`}
                            >
                              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                                isCompleted ? 'bg-emerald-500 text-white' : isCurrent ? 'bg-cyan-500 text-white' : 'bg-slate-600 text-slate-400'
                              }`}>
                                {isCompleted ? <CheckCircle className="w-4 h-4" /> : idx + 1}
                              </div>
                              <span className={`flex-1 text-sm ${isCompleted ? 'text-emerald-400' : isCurrent ? 'text-cyan-400' : 'text-slate-400'}`}>
                                {lesson.title}
                              </span>
                              <span className="text-slate-500 text-xs">{lesson.duration}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setShowModuleDetail(null);
                        if (module.completed) {
                          handleStartModule(module.id);
                        } else if (module.progress > 0) {
                          handleContinueModule(module.id);
                        } else {
                          handleStartModule(module.id);
                        }
                      }}
                      className={`w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors ${
                        module.completed
                          ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
                          : 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:from-cyan-400 hover:to-blue-400'
                      }`}
                    >
                      <Play className="w-5 h-5" />
                      {module.completed ? 'Revoir le module' : module.progress > 0 ? 'Continuer' : 'Commencer'}
                    </button>
                  </>
                );
              })()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Badge Detail Modal */}
      <AnimatePresence>
        {showBadgeDetail && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowBadgeDetail(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-800 border border-slate-700 rounded-2xl p-6 max-w-sm w-full text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-24 h-24 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 text-5xl">
                {showBadgeDetail.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{showBadgeDetail.name}</h3>
              <p className="text-slate-400 mb-4">{showBadgeDetail.description}</p>
              {showBadgeDetail.earnedDate && (
                <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg px-4 py-2 inline-flex items-center gap-2 mb-4">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400 text-sm">Obtenu le {showBadgeDetail.earnedDate}</span>
                </div>
              )}
              <button
                onClick={() => setShowBadgeDetail(null)}
                className="w-full bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 rounded-xl transition-colors"
              >
                Fermer
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
