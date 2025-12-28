'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MODULES } from '@/lib/formation/modules';

const Icons = {
  Shield: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  Play: () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full"><polygon points="5 3 19 12 5 21 5 3"/></svg>,
  Check: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-full h-full"><polyline points="20 6 9 17 4 12"/></svg>,
  Lock: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
  Download: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
  Video: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>,
  Award: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>,
  Logout: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  ChartBar: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/></svg>,
};

const tabs = [
  { id: 'overview', label: 'Vue d\'ensemble', icon: '📊' },
  { id: 'formation', label: 'Formation', icon: '🎓' },
  { id: 'templates', label: 'Templates', icon: '📋' },
  { id: 'audit', label: 'Audit', icon: '🔍' },
];

// Interface pour la progression utilisateur (synchronisée avec /formation)
interface UserProgress {
  completedVideos: string[];
  quizScores: Record<number, number>;
  currentModule: number;
  currentVideo: string;
  totalXP: number;
}

const templates = [
  { id: 1, name: "Registre IA", type: "Excel", icon: "📊", hasVideo: true, file: "template-registre-ia.xlsx" },
  { id: 2, name: "Politique IA Entreprise", type: "Word", icon: "📄", hasVideo: true, file: "modele-politique-ia.docx" },
  { id: 3, name: "FRIA (Analyse d'Impact)", type: "Word", icon: "⚠️", hasVideo: true, file: "template-fria.docx" },
  { id: 4, name: "Documentation Technique", type: "Word", icon: "📋", hasVideo: true, file: "template-documentation-technique.docx" },
  { id: 5, name: "Processus de Validation", type: "Word", icon: "✅", hasVideo: true, file: "processus-validation-ia.docx" },
  { id: 6, name: "Contrat Fournisseur IA", type: "Word", icon: "🤝", hasVideo: true, file: "contrat-fournisseur-ia.docx" },
  { id: 7, name: "Notice de Transparence", type: "Word", icon: "👁️", hasVideo: true, file: "notice-transparence.docx" },
  { id: 8, name: "Plan Formation Article 4", type: "Word", icon: "🎓", hasVideo: true, file: "plan-formation-article4.docx" },
  { id: 9, name: "Procédure Supervision Humaine", type: "Word", icon: "👤", hasVideo: true, file: "procedure-supervision-humaine.docx" },
  { id: 10, name: "Registre des Incidents", type: "Excel", icon: "🚨", hasVideo: true, file: "registre-incidents-ia.xlsx" },
  { id: 11, name: "Checklist Conformité", type: "Excel", icon: "✓", hasVideo: true, file: "checklist-conformite-ai-act.xlsx" },
  { id: 12, name: "Rapport Audit Interne", type: "Word", icon: "📝", hasVideo: true, file: "rapport-audit-interne.docx" },
];

const NeuralBackground = () => (
  <div className="fixed inset-0 pointer-events-none overflow-hidden">
    <div className="absolute inset-0 bg-[#030014]" />
    <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-[#00F5FF]/5 blur-[120px]" />
    <div className="absolute bottom-[-20%] right-[-10%] w-[800px] h-[800px] rounded-full bg-[#8B5CF6]/5 blur-[150px]" />
  </div>
);

const HoloCard = ({ children, glow = '#00F5FF', className = '' }: { children: React.ReactNode, glow?: string, className?: string }) => (
  <div className={`relative group ${className}`}>
    <div className="absolute -inset-[1px] rounded-2xl opacity-0 group-hover:opacity-40 transition-opacity duration-300" style={{ background: `linear-gradient(135deg, ${glow}40, transparent 50%, ${glow}40)` }} />
    <div className="relative bg-[#0A0A1B]/90 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden h-full">
      <div className="relative h-full">{children}</div>
    </div>
  </div>
);

export default function DashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [auditScore, setAuditScore] = useState<number | null>(null);
  const [userPlan, setUserPlan] = useState<string>('solo');
  const [showDevPanel, setShowDevPanel] = useState(false);
  
  // Progression synchronisée avec /formation
  const [userProgress, setUserProgress] = useState<UserProgress>({
    completedVideos: [],
    quizScores: {},
    currentModule: 0,
    currentVideo: '0.1',
    totalXP: 0
  });

  useEffect(() => {
    const savedScore = localStorage.getItem('auditScore');
    if (savedScore) setAuditScore(parseInt(savedScore));
    
    const savedPlan = localStorage.getItem('userPlan');
    if (savedPlan) setUserPlan(savedPlan);
    else {
      localStorage.setItem('userPlan', 'solo');
    }
    
    // Charger la progression depuis la page formation
    const savedProgress = localStorage.getItem('formationProgress');
    if (savedProgress) {
      try {
        setUserProgress(JSON.parse(savedProgress));
      } catch (e) {
        console.error('Error loading formation progress:', e);
      }
    }
  }, []);

  // Calculer la progression de chaque module
  const getModuleProgress = (moduleId: number) => {
    const module = MODULES.find(m => m.id === moduleId);
    if (!module) return 0;
    
    const moduleVideoIds = module.videos.map(v => `${moduleId}-${v.id}`);
    const completed = moduleVideoIds.filter(id => userProgress.completedVideos.includes(id)).length;
    return module.videos.length > 0 ? Math.round((completed / module.videos.length) * 100) : 0;
  };

  // Vérifier si un module est débloqué
  const isModuleUnlocked = (moduleId: number) => {
    if (moduleId === 0) return true;
    const prevQuizScore = userProgress.quizScores[moduleId - 1];
    return prevQuizScore !== undefined && prevQuizScore >= 70;
  };

  // Modules avec progression dynamique
  const modules = MODULES.map(m => ({
    id: m.id,
    title: m.title,
    duration: m.duration,
    lessons: m.videos.length,
    color: m.color,
    progress: getModuleProgress(m.id),
    completed: getModuleProgress(m.id) === 100 && userProgress.quizScores[m.id] >= 70,
    unlocked: isModuleUnlocked(m.id)
  }));

  const changePlan = (plan: string) => {
    setUserPlan(plan);
    localStorage.setItem('userPlan', plan);
  };

  const totalProgress = Math.round(modules.reduce((acc, m) => acc + m.progress, 0) / modules.length);
  const completedModules = modules.filter(m => m.completed).length;

  return (
    <div className="min-h-screen bg-[#030014] text-white">
      <NeuralBackground />

      {/* DEV MODE - Plan Selector */}
      <div className="fixed bottom-4 right-4 z-[100]">
        <button
          onClick={() => setShowDevPanel(!showDevPanel)}
          className="w-12 h-12 bg-[#FF6B00] rounded-full flex items-center justify-center text-white font-bold shadow-lg hover:bg-[#FF8C00] transition-colors"
          title="Mode développeur"
        >
          🛠️
        </button>
        {showDevPanel && (
          <div className="absolute bottom-14 right-0 bg-[#1a1a2e] border border-white/20 rounded-xl p-4 shadow-2xl min-w-[200px]">
            <h4 className="text-sm font-bold text-white/80 mb-3">🧪 Mode Test</h4>
            <p className="text-xs text-white/50 mb-3">Changer de plan :</p>
            <div className="space-y-2">
              {[
                { id: 'solo', name: 'Solo', price: '499€', color: '#00F5FF' },
                { id: 'pro', name: 'Pro', price: '999€', color: '#8B5CF6' },
                { id: 'enterprise', name: 'Enterprise', price: '2999€', color: '#FFB800' },
              ].map((p) => (
                <button
                  key={p.id}
                  onClick={() => changePlan(p.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all ${
                    userPlan === p.id
                      ? 'bg-white/20 border-2'
                      : 'bg-white/5 border border-white/10 hover:bg-white/10'
                  }`}
                  style={{ borderColor: userPlan === p.id ? p.color : undefined }}
                >
                  <span style={{ color: p.color }}>{p.name}</span>
                  <span className="text-white/40 text-xs">{p.price}</span>
                </button>
              ))}
            </div>
            <div className="mt-3 pt-3 border-t border-white/10">
              <p className="text-xs text-white/40">
                Plan actuel: <span className="text-white font-medium">{userPlan.toUpperCase()}</span>
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Header */}
      <header className="relative z-50 px-6 py-4 border-b border-white/5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#00F5FF] to-[#0066FF] rounded-xl flex items-center justify-center">
              <div className="w-5 h-5 text-white"><Icons.Shield /></div>
            </div>
            <span className="font-bold text-lg hidden sm:block">Formation-IA-Act.fr</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/formation/complete" className="text-white/60 hover:text-white text-sm transition-colors flex items-center gap-2">
              <div className="w-4 h-4"><Icons.Award /></div>
              <span className="hidden sm:inline">Certificat</span>
            </Link>
            <Link href="/login" className="text-white/60 hover:text-white text-sm transition-colors flex items-center gap-2">
              <div className="w-4 h-4"><Icons.Logout /></div>
              <span className="hidden sm:inline">Déconnexion</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="relative z-10 px-6 py-8">
        <div className="max-w-7xl mx-auto">
          
          {/* Welcome */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold">Bonjour ! 👋</h1>
              <span 
                className="px-3 py-1 rounded-full text-sm font-bold"
                style={{ 
                  backgroundColor: userPlan === 'enterprise' ? '#FFB800' : userPlan === 'pro' ? '#8B5CF6' : '#00F5FF',
                  color: userPlan === 'enterprise' ? '#000' : '#fff'
                }}
              >
                {userPlan.toUpperCase()}
              </span>
            </div>
            <p className="text-white/60">Bienvenue dans votre espace de formation AI Act</p>
          </motion.div>

          {/* Tabs */}
          <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'bg-[#8B5CF6] text-white'
                    : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                }`}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {/* OVERVIEW TAB */}
            {activeTab === 'overview' && (
              <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                {/* Stats */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  {[
                    { label: 'Progression Formation', value: `${totalProgress}%`, icon: '📚', color: '#8B5CF6' },
                    { label: 'Modules Complétés', value: `${completedModules}/${modules.length}`, icon: '✅', color: '#00FF88' },
                    { label: 'Templates disponibles', value: '12', icon: '📋', color: '#00F5FF' },
                    { label: 'Score Audit', value: auditScore ? `${auditScore}%` : 'À faire', icon: '🔍', color: '#FFB800' },
                  ].map((stat, i) => (
                    <HoloCard key={i} glow={stat.color}>
                      <div className="p-5">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-2xl">{stat.icon}</span>
                          <span className="text-2xl font-bold" style={{ color: stat.color }}>{stat.value}</span>
                        </div>
                        <p className="text-white/50 text-sm">{stat.label}</p>
                      </div>
                    </HoloCard>
                  ))}
                </div>

                {/* Certificat disponible - affiché quand formation terminée */}
                {totalProgress === 100 && (
                  <div className="mb-8">
                    <HoloCard glow="#00FF88">
                      <div className="p-6 text-center">
                        <span className="text-5xl mb-4 block">🏆</span>
                        <h3 className="text-2xl font-bold mb-2 text-[#00FF88]">Félicitations !</h3>
                        <p className="text-white/60 mb-4">Vous avez terminé la formation AI Act. Votre certificat est prêt !</p>
                        <Link 
                          href="/formation/complete"
                          className="inline-flex items-center gap-2 bg-gradient-to-r from-[#00FF88] to-[#00F5FF] text-black font-bold px-8 py-4 rounded-xl text-lg hover:opacity-90 transition-opacity"
                        >
                          <div className="w-5 h-5"><Icons.Award /></div>
                          Obtenir mon certificat
                        </Link>
                      </div>
                    </HoloCard>
                  </div>
                )}

                {/* Quick Actions */}
                <h3 className="text-lg font-semibold mb-4">Actions rapides</h3>
                <div className="grid sm:grid-cols-3 gap-4 mb-8">
                  <Link href={`/formation?module=${userProgress.currentModule}`} className="p-4 bg-[#8B5CF6]/10 border border-[#8B5CF6]/30 rounded-xl text-left hover:bg-[#8B5CF6]/20 transition-colors block">
                    <span className="text-2xl mb-2 block">▶️</span>
                    <p className="font-medium">{totalProgress === 100 ? 'Revoir la formation' : 'Continuer la formation'}</p>
                    <p className="text-white/50 text-sm">
                      {totalProgress === 100 
                        ? `${completedModules} modules complétés` 
                        : `Module ${userProgress.currentModule} en cours`
                      }
                    </p>
                  </Link>
                  <button onClick={() => setActiveTab('templates')} className="p-4 bg-[#00F5FF]/10 border border-[#00F5FF]/30 rounded-xl text-left hover:bg-[#00F5FF]/20 transition-colors">
                    <span className="text-2xl mb-2 block">📥</span>
                    <p className="font-medium">Accéder aux templates</p>
                    <p className="text-white/50 text-sm">12 documents inclus</p>
                  </button>
                  {auditScore ? (
                    <button onClick={() => setActiveTab('audit')} className="p-4 bg-[#FFB800]/10 border border-[#FFB800]/30 rounded-xl text-left hover:bg-[#FFB800]/20 transition-colors">
                      <span className="text-2xl mb-2 block">📊</span>
                      <p className="font-medium">Voir mon audit</p>
                      <p className="text-white/50 text-sm">Score: {auditScore}%</p>
                    </button>
                  ) : (
                    <Link href={`/audit/questionnaire?plan=${userPlan}`} className="p-4 bg-[#FFB800]/10 border border-[#FFB800]/30 rounded-xl text-left hover:bg-[#FFB800]/20 transition-colors block">
                      <span className="text-2xl mb-2 block">📊</span>
                      <p className="font-medium">Lancer l&apos;audit {userPlan.charAt(0).toUpperCase() + userPlan.slice(1)}</p>
                      <p className="text-white/50 text-sm">{userPlan === 'enterprise' ? '150 questions' : userPlan === 'pro' ? '80 questions' : '40 questions'}</p>
                    </Link>
                  )}
                </div>

                {/* Prochaines échéances */}
                <h3 className="text-lg font-semibold mb-4">📅 Prochaines échéances AI Act</h3>
                <HoloCard glow="#FF4444">
                  <div className="p-5">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-red-500" />
                        <span className="text-red-400 font-medium">Février 2025</span>
                        <span className="text-white/60">- Pratiques interdites + Formation Article 4</span>
                        <span className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full ml-auto">EN VIGUEUR</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-orange-500" />
                        <span className="text-orange-400 font-medium">Août 2025</span>
                        <span className="text-white/60">- Modèles GPAI</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-yellow-500" />
                        <span className="text-yellow-400 font-medium">Août 2026</span>
                        <span className="text-white/60">- Systèmes haut risque</span>
                      </div>
                    </div>
                  </div>
                </HoloCard>
              </motion.div>
            )}

            {/* FORMATION TAB */}
            {activeTab === 'formation' && (
              <motion.div key="formation" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-bold">Formation AI Act</h2>
                    <p className="text-white/60 text-sm">6 modules • 8h de contenu</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-[#8B5CF6]">{totalProgress}%</p>
                    <p className="text-white/50 text-sm">complété</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {modules.map((module, i) => {
                    const isLocked = !module.unlocked;
                    return (
                      <HoloCard key={module.id} glow={module.color}>
                        <div className="p-5">
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0" style={{ background: `${module.color}20` }}>
                              {module.completed ? '✅' : isLocked ? '🔒' : '📚'}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-white/40 text-xs">Module {module.id}</span>
                                <span className="text-white/30">•</span>
                                <span className="text-white/40 text-xs">{module.duration}</span>
                              </div>
                              <h3 className="font-semibold text-white mb-2">{module.title}</h3>
                              <div className="flex items-center gap-3">
                                <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                                  <div className="h-full rounded-full transition-all" style={{ width: `${module.progress}%`, background: module.color }} />
                                </div>
                                <span className="text-sm font-medium" style={{ color: module.color }}>{module.progress}%</span>
                              </div>
                            </div>
                            <button
                              disabled={isLocked}
                              onClick={() => !isLocked && router.push(`/formation?module=${module.id}`)}
                              className="px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 flex-shrink-0"
                              style={{
                                background: isLocked ? 'rgba(255,255,255,0.05)' : `${module.color}20`,
                                color: isLocked ? 'rgba(255,255,255,0.3)' : module.color,
                                border: `1px solid ${isLocked ? 'rgba(255,255,255,0.1)' : `${module.color}40`}`,
                                opacity: isLocked ? 0.5 : 1,
                                cursor: isLocked ? 'not-allowed' : 'pointer'
                              }}
                            >
                              {isLocked ? (
                                <><div className="w-4 h-4"><Icons.Lock /></div>Verrouillé</>
                              ) : module.completed ? (
                                <><div className="w-4 h-4"><Icons.Check /></div>Revoir</>
                              ) : module.progress > 0 ? (
                                <><div className="w-4 h-4"><Icons.Play /></div>Continuer</>
                              ) : (
                                <><div className="w-4 h-4"><Icons.Play /></div>Commencer</>
                              )}
                            </button>
                          </div>
                        </div>
                      </HoloCard>
                    );
                  })}
                </div>

                {/* Certificat disponible quand formation terminée */}
                {totalProgress === 100 && (
                  <div className="mt-6">
                    <Link 
                      href="/formation/complete"
                      className="w-full p-4 bg-gradient-to-r from-[#00FF88]/20 to-[#00F5FF]/20 border border-[#00FF88]/30 rounded-xl flex items-center justify-center gap-3 hover:from-[#00FF88]/30 hover:to-[#00F5FF]/30 transition-all"
                    >
                      <span className="text-2xl">🏆</span>
                      <div className="text-left">
                        <p className="font-bold text-[#00FF88]">Formation terminée !</p>
                        <p className="text-white/60 text-sm">Cliquez pour obtenir votre certificat</p>
                      </div>
                      <div className="w-5 h-5 text-[#00FF88] ml-auto"><Icons.Award /></div>
                    </Link>
                  </div>
                )}
              </motion.div>
            )}

            {/* TEMPLATES TAB */}
            {activeTab === 'templates' && (
              <motion.div key="templates" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-bold">Templates juridiques</h2>
                    <p className="text-white/60 text-sm">12 documents prêts à l&apos;emploi • <span className="text-[#00FF88]">Inclus dans votre formation</span></p>
                  </div>
                  <a href="/resources/pack-templates-ai-act.zip" download className="hidden sm:flex items-center gap-2 bg-[#00F5FF]/10 text-[#00F5FF] border border-[#00F5FF]/30 px-4 py-2 rounded-xl text-sm font-medium hover:bg-[#00F5FF]/20 transition-colors">
                    <div className="w-4 h-4"><Icons.Download /></div>
                    Tout télécharger
                  </a>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {templates.map((template) => (
                    <HoloCard key={template.id} glow="#00F5FF">
                      <div className="p-5">
                        <div className="flex items-start gap-3 mb-4">
                          <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-xl">{template.icon}</div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-white text-sm truncate">{template.name}</h3>
                            <p className="text-white/40 text-xs">{template.type}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <a 
                            href={`/resources/${template.file}`} 
                            download
                            className="flex-1 py-2 rounded-lg text-xs font-medium bg-[#00F5FF]/10 text-[#00F5FF] border border-[#00F5FF]/30 hover:bg-[#00F5FF]/20 transition-colors flex items-center justify-center gap-1"
                          >
                            <div className="w-3 h-3"><Icons.Download /></div>
                            Télécharger
                          </a>
                          {template.hasVideo && (
                            <Link 
                              href={`/tutoriels/${template.id}`}
                              className="flex-1 py-2 rounded-lg text-xs font-medium bg-[#8B5CF6]/10 text-[#8B5CF6] border border-[#8B5CF6]/30 hover:bg-[#8B5CF6]/20 transition-colors flex items-center justify-center gap-1"
                            >
                              <div className="w-3 h-3"><Icons.Video /></div>
                              Tuto vidéo
                            </Link>
                          )}
                        </div>
                      </div>
                    </HoloCard>
                  ))}
                </div>
              </motion.div>
            )}

            {/* AUDIT TAB */}
            {activeTab === 'audit' && (
              <motion.div key="audit" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <h2 className="text-xl font-bold">Audit de conformité AI Act</h2>
                    <span className="bg-[#00FF88]/20 text-[#00FF88] text-xs font-bold px-2 py-0.5 rounded-full">v2.0</span>
                  </div>
                  <p className="text-white/60 text-sm">150+ questions • Rapport PDF personnalisé • <span className="text-[#00FF88]">Inclus dans votre formation</span></p>
                </div>

                {auditScore ? (
                  <>
                    {/* Score existant */}
                    <div className="grid md:grid-cols-2 gap-6 mb-8">
                      <HoloCard glow={auditScore >= 70 ? '#00FF88' : auditScore >= 40 ? '#FFB800' : '#FF4444'}>
                        <div className="p-6 text-center">
                          <p className="text-white/50 text-sm mb-2">Votre score actuel</p>
                          <div className="inline-flex items-center justify-center w-32 h-32 rounded-full mb-4" style={{
                            background: `conic-gradient(${auditScore >= 70 ? '#00FF88' : auditScore >= 40 ? '#FFB800' : '#FF4444'} ${auditScore * 3.6}deg, rgba(255,255,255,0.1) 0deg)`
                          }}>
                            <div className="w-28 h-28 rounded-full bg-[#030014] flex items-center justify-center">
                              <span className="text-4xl font-bold">{auditScore}%</span>
                            </div>
                          </div>
                          <p className="text-white/60">
                            {auditScore >= 70 ? '✅ Bon niveau de conformité' : auditScore >= 40 ? '⚠️ Des améliorations nécessaires' : '🚨 Actions urgentes requises'}
                          </p>
                        </div>
                      </HoloCard>

                      <HoloCard glow="#8B5CF6">
                        <div className="p-6">
                          <h3 className="font-semibold mb-4">Actions rapides</h3>
                          <div className="space-y-3">
                            <Link href="/audit/results" className="flex items-center gap-3 p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
                              <div className="w-10 h-10 rounded-lg bg-[#00F5FF]/10 flex items-center justify-center text-lg">📊</div>
                              <div className="flex-1">
                                <p className="font-medium text-sm">Voir le rapport détaillé</p>
                                <p className="text-white/40 text-xs">Recommandations par catégorie</p>
                              </div>
                            </Link>
                            <a href="/audit/report.pdf" download className="flex items-center gap-3 p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
                              <div className="w-10 h-10 rounded-lg bg-[#00FF88]/10 flex items-center justify-center text-lg">📄</div>
                              <div className="flex-1">
                                <p className="font-medium text-sm">Télécharger le PDF</p>
                                <p className="text-white/40 text-xs">Rapport complet exportable</p>
                              </div>
                            </a>
                            <Link href={`/audit/questionnaire?plan=${userPlan}`} className="flex items-center gap-3 p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
                              <div className="w-10 h-10 rounded-lg bg-[#8B5CF6]/10 flex items-center justify-center text-lg">🔄</div>
                              <div className="flex-1">
                                <p className="font-medium text-sm">Refaire l&apos;audit</p>
                                <p className="text-white/40 text-xs">Suivez votre progression</p>
                              </div>
                            </Link>
                          </div>
                        </div>
                      </HoloCard>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Pas encore d'audit */}
                    <div className="grid md:grid-cols-3 gap-4 mb-8">
                      {[
                        { icon: "📋", title: "150+ questions", desc: "Analyse exhaustive", color: "#00F5FF" },
                        { icon: "📊", title: "6 catégories", desc: "Couverture complète", color: "#8B5CF6" },
                        { icon: "📄", title: "Rapport PDF", desc: "30+ pages", color: "#00FF88" },
                      ].map((item, i) => (
                        <HoloCard key={i} glow={item.color}>
                          <div className="p-5 text-center">
                            <div className="text-3xl mb-2">{item.icon}</div>
                            <p className="font-semibold text-white">{item.title}</p>
                            <p className="text-white/50 text-sm">{item.desc}</p>
                          </div>
                        </HoloCard>
                      ))}
                    </div>

                    <HoloCard glow="#8B5CF6">
                      <div className="p-8 text-center">
                        <span className="text-5xl mb-4 block">🔍</span>
                        <h3 className="text-2xl font-bold mb-4">Lancez votre audit de conformité</h3>
                        <p className="text-white/60 max-w-lg mx-auto mb-6">
                          Répondez aux questions pour obtenir un diagnostic complet de votre conformité AI Act avec un plan d&apos;action personnalisé.
                        </p>
                        <div className="flex flex-wrap justify-center gap-4 text-sm text-white/50 mb-6">
                          <span>⏱️ 30-45 minutes</span>
                          <span>📊 Score par catégorie</span>
                          <span>📄 Rapport PDF</span>
                          <span>✅ Plan d&apos;action</span>
                        </div>
                        <Link href={`/audit/questionnaire?plan=${userPlan}`} className="inline-flex items-center gap-2 bg-gradient-to-r from-[#8B5CF6] to-[#00F5FF] text-white font-bold px-8 py-4 rounded-xl text-lg hover:opacity-90 transition-opacity">
                          Commencer l&apos;audit
                          <div className="w-5 h-5"><Icons.ChartBar /></div>
                        </Link>
                      </div>
                    </HoloCard>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </main>
    </div>
  );
}
