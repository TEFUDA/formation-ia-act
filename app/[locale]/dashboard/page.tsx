'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

// Icons as simple SVG components for cleaner code
const IconShield = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);

const IconPlay = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
    <polygon points="5 3 19 12 5 21 5 3"/>
  </svg>
);

const IconCheck = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-full h-full">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

const IconLock = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);

const IconFlame = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
    <path d="M12 2c0 5-4 6-4 10a4 4 0 0 0 8 0c0-4-4-5-4-10z"/>
  </svg>
);

const IconZap = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
  </svg>
);

const IconAward = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full">
    <circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/>
  </svg>
);

const IconUsers = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

const IconLogout = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
);

// User data
const userData = {
  name: 'Jean',
  lastName: 'Dupont',
  avatar: 'JD',
  role: 'admin' as const,
  streak: 7,
  xp: 1250,
  level: 4,
};

// Modules with neural theme
const modules = [
  { 
    id: 1, 
    title: "Fondamentaux de l'AI Act",
    subtitle: "Origines • Objectifs • Calendrier",
    duration: "45 min",
    lessons: 5,
    xp: 150,
    completed: true, 
    progress: 100,
    quizScore: 92,
    color: '#00F5FF',
    neuralNodes: 12,
  },
  { 
    id: 2, 
    title: "Classification des Risques",
    subtitle: "4 niveaux • Interdictions • Obligations",
    duration: "1h",
    lessons: 6,
    xp: 200,
    completed: true, 
    progress: 100,
    quizScore: 88,
    color: '#00FF88',
    neuralNodes: 18,
  },
  { 
    id: 3, 
    title: "Cartographie des Systèmes",
    subtitle: "Audit • Registre • Impact",
    duration: "1h15",
    lessons: 7,
    xp: 250,
    completed: false, 
    progress: 57,
    currentLesson: 5,
    quizScore: null,
    color: '#FF00E5',
    neuralNodes: 24,
  },
  { 
    id: 4, 
    title: "Gouvernance IA",
    subtitle: "Politique • Référent • Comité",
    duration: "1h",
    lessons: 5,
    xp: 200,
    completed: false, 
    progress: 0,
    quizScore: null,
    color: '#FFB800',
    neuralNodes: 15,
  },
  { 
    id: 5, 
    title: "Systèmes Haut Risque",
    subtitle: "Documentation • Marquage CE",
    duration: "1h30",
    lessons: 8,
    xp: 300,
    completed: false, 
    progress: 0,
    quizScore: null,
    color: '#FF4444',
    neuralNodes: 30,
  },
  { 
    id: 6, 
    title: "Audit & Conformité",
    subtitle: "Contrôles • Sanctions • Amélioration",
    duration: "1h",
    lessons: 6,
    xp: 250,
    completed: false, 
    progress: 0,
    quizScore: null,
    color: '#8B5CF6',
    neuralNodes: 20,
  },
];

// Neural Network Background Component
const NeuralBackground = () => {
  const [nodes, setNodes] = useState<{x: number, y: number, size: number, delay: number}[]>([]);
  
  useEffect(() => {
    const generatedNodes = Array.from({ length: 50 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      delay: Math.random() * 5,
    }));
    setNodes(generatedNodes);
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Gradient mesh background */}
      <div className="absolute inset-0 bg-[#030014]" />
      
      {/* Organic gradient blobs */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-[#00F5FF]/5 blur-[120px] animate-pulse" style={{ animationDuration: '8s' }} />
      <div className="absolute bottom-[-20%] right-[-10%] w-[800px] h-[800px] rounded-full bg-[#FF00E5]/5 blur-[150px] animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }} />
      <div className="absolute top-[40%] left-[50%] w-[400px] h-[400px] rounded-full bg-[#00FF88]/5 blur-[100px] animate-pulse" style={{ animationDuration: '6s', animationDelay: '4s' }} />
      
      {/* Neural nodes */}
      <svg className="absolute inset-0 w-full h-full opacity-30">
        {nodes.map((node, i) => (
          <g key={i}>
            <circle
              cx={`${node.x}%`}
              cy={`${node.y}%`}
              r={node.size}
              fill="#00F5FF"
              opacity="0.6"
            >
              <animate
                attributeName="opacity"
                values="0.2;0.8;0.2"
                dur={`${3 + node.delay}s`}
                repeatCount="indefinite"
              />
              <animate
                attributeName="r"
                values={`${node.size};${node.size * 1.5};${node.size}`}
                dur={`${4 + node.delay}s`}
                repeatCount="indefinite"
              />
            </circle>
          </g>
        ))}
        {/* Connection lines */}
        {nodes.slice(0, 20).map((node, i) => {
          const nextNode = nodes[(i + 1) % 20];
          return (
            <line
              key={`line-${i}`}
              x1={`${node.x}%`}
              y1={`${node.y}%`}
              x2={`${nextNode.x}%`}
              y2={`${nextNode.y}%`}
              stroke="url(#neuralGradient)"
              strokeWidth="0.5"
              opacity="0.2"
            >
              <animate
                attributeName="opacity"
                values="0.1;0.3;0.1"
                dur={`${5 + node.delay}s`}
                repeatCount="indefinite"
              />
            </line>
          );
        })}
        <defs>
          <linearGradient id="neuralGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00F5FF" />
            <stop offset="50%" stopColor="#FF00E5" />
            <stop offset="100%" stopColor="#00FF88" />
          </linearGradient>
        </defs>
      </svg>

      {/* Scan line effect */}
      <div className="absolute inset-0 overflow-hidden">
        <div 
          className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#00F5FF]/50 to-transparent"
          style={{
            animation: 'scanline 8s linear infinite',
          }}
        />
      </div>

      {/* Grid overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0, 245, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 245, 255, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />

      <style jsx>{`
        @keyframes scanline {
          0% { transform: translateY(-100vh); }
          100% { transform: translateY(100vh); }
        }
      `}</style>
    </div>
  );
};

// Holographic Card Component
const HoloCard = ({ children, className = '', glow = '#00F5FF', hover = true }: { 
  children: React.ReactNode, 
  className?: string,
  glow?: string,
  hover?: boolean 
}) => (
  <motion.div
    whileHover={hover ? { scale: 1.02, y: -4 } : {}}
    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
    className={`relative group ${className}`}
  >
    {/* Glow effect */}
    <div 
      className="absolute -inset-[1px] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"
      style={{ background: `${glow}20` }}
    />
    
    {/* Holographic border */}
    <div 
      className="absolute -inset-[1px] rounded-2xl opacity-50 group-hover:opacity-100 transition-opacity"
      style={{
        background: `linear-gradient(135deg, ${glow}40, transparent 40%, transparent 60%, ${glow}40)`,
      }}
    />
    
    {/* Main card */}
    <div className="relative bg-[#0A0A1B]/80 backdrop-blur-xl rounded-2xl border border-white/5 overflow-hidden">
      {/* Inner glow */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity"
        style={{ background: `radial-gradient(circle at 50% 0%, ${glow}, transparent 70%)` }}
      />
      
      {/* Noise texture */}
      <div className="absolute inset-0 opacity-[0.015]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
      }} />
      
      <div className="relative">{children}</div>
    </div>
  </motion.div>
);

// Liquid Progress Bar
const LiquidProgress = ({ progress, color }: { progress: number, color: string }) => (
  <div className="relative h-2 bg-white/5 rounded-full overflow-hidden">
    <motion.div
      initial={{ width: 0 }}
      animate={{ width: `${progress}%` }}
      transition={{ duration: 1.5, ease: [0.19, 1, 0.22, 1] }}
      className="absolute inset-y-0 left-0 rounded-full"
      style={{ 
        background: `linear-gradient(90deg, ${color}, ${color}88)`,
        boxShadow: `0 0 20px ${color}60, inset 0 0 10px rgba(255,255,255,0.2)`,
      }}
    >
      {/* Liquid wave effect */}
      <div className="absolute inset-0 overflow-hidden rounded-full">
        <div 
          className="absolute inset-0"
          style={{
            background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)`,
            animation: 'liquidWave 2s linear infinite',
          }}
        />
      </div>
    </motion.div>
    <style jsx>{`
      @keyframes liquidWave {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(100%); }
      }
    `}</style>
  </div>
);

// Neural Orb Component (for modules)
const NeuralOrb = ({ color, progress, completed, size = 'md' }: { 
  color: string, 
  progress: number, 
  completed: boolean,
  size?: 'sm' | 'md' | 'lg'
}) => {
  const sizes = { sm: 40, md: 56, lg: 80 };
  const s = sizes[size];
  
  return (
    <div className="relative" style={{ width: s, height: s }}>
      {/* Outer glow */}
      <div 
        className="absolute inset-0 rounded-full blur-lg opacity-50"
        style={{ background: color }}
      />
      
      {/* Progress ring */}
      <svg className="absolute inset-0 -rotate-90" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="4"
        />
        <motion.circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke={color}
          strokeWidth="4"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: progress / 100 }}
          transition={{ duration: 1.5, ease: [0.19, 1, 0.22, 1] }}
          style={{
            strokeDasharray: '283',
            filter: `drop-shadow(0 0 6px ${color})`,
          }}
        />
      </svg>
      
      {/* Inner orb */}
      <div 
        className="absolute inset-2 rounded-full flex items-center justify-center"
        style={{ 
          background: `radial-gradient(circle at 30% 30%, ${color}40, ${color}10)`,
          border: `1px solid ${color}40`,
        }}
      >
        {completed ? (
          <div className="w-5 h-5 text-white">
            <IconCheck />
          </div>
        ) : progress > 0 ? (
          <span className="text-white font-bold text-sm">{progress}%</span>
        ) : (
          <div className="w-4 h-4 text-white/60">
            <IconLock />
          </div>
        )}
      </div>
      
      {/* Pulse effect for active */}
      {progress > 0 && !completed && (
        <div 
          className="absolute inset-0 rounded-full animate-ping opacity-20"
          style={{ background: color, animationDuration: '2s' }}
        />
      )}
    </div>
  );
};

// Stats Orb (for header stats)
const StatsOrb = ({ icon, value, label, color }: { 
  icon: React.ReactNode, 
  value: string | number, 
  label: string,
  color: string 
}) => (
  <div className="flex items-center gap-3">
    <div 
      className="relative w-10 h-10 rounded-xl flex items-center justify-center"
      style={{ 
        background: `linear-gradient(135deg, ${color}20, ${color}05)`,
        border: `1px solid ${color}30`,
        boxShadow: `0 0 20px ${color}10`,
      }}
    >
      <div className="w-5 h-5" style={{ color }}>{icon}</div>
    </div>
    <div>
      <div className="text-white font-bold text-lg leading-none">{value}</div>
      <div className="text-white/40 text-xs mt-0.5">{label}</div>
    </div>
  </div>
);

export default function DashboardPage() {
  const router = useRouter();
  const [showMenu, setShowMenu] = useState(false);
  const [hoveredModule, setHoveredModule] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Calculations
  const completedModules = modules.filter(m => m.completed).length;
  const totalProgress = Math.round(modules.reduce((acc, m) => acc + m.progress, 0) / modules.length);
  const currentModule = modules.find(m => !m.completed && m.progress > 0) || modules.find(m => !m.completed);
  const totalXP = modules.reduce((acc, m) => acc + m.xp, 0);
  const earnedXP = modules.filter(m => m.completed).reduce((acc, m) => acc + m.xp, 0);
  const isAdmin = userData.role === 'admin';

  const handleStartModule = (moduleId: number) => {
    router.push(`/formation?module=${moduleId}&lesson=1`);
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen relative">
      <NeuralBackground />
      
      {/* Header */}
      <header className="relative z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-4"
            >
              <div className="relative w-12 h-12">
                <div className="absolute inset-0 bg-gradient-to-br from-[#00F5FF] to-[#FF00E5] rounded-xl rotate-45 transform-gpu" />
                <div className="absolute inset-[2px] bg-[#030014] rounded-[10px] rotate-45" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-6 h-6 text-[#00F5FF]">
                    <IconShield />
                  </div>
                </div>
              </div>
              <div>
                <h1 className="text-white font-semibold tracking-tight">AI Act Academy</h1>
                <p className="text-white/30 text-xs tracking-widest uppercase">Neural Learning System</p>
              </div>
            </motion.div>

            {/* Stats */}
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="hidden md:flex items-center gap-8"
            >
              <StatsOrb 
                icon={<IconFlame />} 
                value={userData.streak} 
                label="Jours" 
                color="#FF6B00"
              />
              <StatsOrb 
                icon={<IconZap />} 
                value={`${earnedXP}`} 
                label="XP" 
                color="#FFB800"
              />
              <StatsOrb 
                icon={<IconAward />} 
                value={`${completedModules}/6`} 
                label="Modules" 
                color="#00FF88"
              />
            </motion.div>

            {/* Profile */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-4"
            >
              {isAdmin && (
                <button
                  onClick={() => router.push('/admin')}
                  className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-[#8B5CF6]/10 border border-[#8B5CF6]/30 text-[#8B5CF6] text-sm font-medium hover:bg-[#8B5CF6]/20 transition-colors"
                >
                  <div className="w-4 h-4"><IconUsers /></div>
                  Admin
                </button>
              )}
              
              <div className="relative">
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="relative w-12 h-12 rounded-full overflow-hidden group"
                >
                  {/* Avatar ring */}
                  <div className="absolute -inset-[2px] bg-gradient-to-r from-[#00F5FF] via-[#FF00E5] to-[#00FF88] rounded-full animate-spin-slow opacity-60 group-hover:opacity-100 transition-opacity" style={{ animationDuration: '4s' }} />
                  <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a3a] to-[#0a0a1b] rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">{userData.avatar}</span>
                  </div>
                </button>

                <AnimatePresence>
                  {showMenu && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 10 }}
                        className="absolute right-0 top-16 z-50 w-72"
                      >
                        <HoloCard glow="#00F5FF" hover={false}>
                          <div className="p-4">
                            <div className="flex items-center gap-3 mb-4">
                              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#1a1a3a] to-[#0a0a1b] flex items-center justify-center border border-white/10">
                                <span className="text-white font-bold">{userData.avatar}</span>
                              </div>
                              <div>
                                <p className="text-white font-semibold">{userData.name} {userData.lastName}</p>
                                <p className="text-white/40 text-sm">Niveau {userData.level}</p>
                              </div>
                            </div>
                            
                            <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-3" />
                            
                            <button
                              onClick={() => router.push('/')}
                              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition-colors"
                            >
                              <div className="w-5 h-5"><IconLogout /></div>
                              Déconnexion
                            </button>
                          </div>
                        </HoloCard>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Bienvenue, {userData.name}
            <span className="inline-block ml-3 animate-wave">👋</span>
          </h2>
          <p className="text-white/50 text-lg max-w-2xl">
            Poursuivez votre parcours de conformité. Chaque module maîtrisé vous rapproche de la certification AI Act.
          </p>
        </motion.div>

        {/* Progress Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-12"
        >
          <HoloCard glow="#00F5FF">
            <div className="p-6 md:p-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
                <div>
                  <h3 className="text-white/50 text-sm uppercase tracking-widest mb-2">Progression Globale</h3>
                  <div className="flex items-baseline gap-3">
                    <span className="text-5xl font-bold text-white">{totalProgress}%</span>
                    <span className="text-white/30">complété</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-8">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-[#00FF88]">{completedModules}</div>
                    <div className="text-white/30 text-sm">Modules</div>
                  </div>
                  <div className="h-12 w-px bg-white/10" />
                  <div className="text-center">
                    <div className="text-3xl font-bold text-[#FFB800]">{earnedXP}</div>
                    <div className="text-white/30 text-sm">XP gagnés</div>
                  </div>
                  <div className="h-12 w-px bg-white/10" />
                  <div className="text-center">
                    <div className="text-3xl font-bold text-[#FF6B00]">{userData.streak}</div>
                    <div className="text-white/30 text-sm">Série</div>
                  </div>
                </div>
              </div>
              
              <LiquidProgress progress={totalProgress} color="#00F5FF" />
              
              {/* Module indicators */}
              <div className="flex justify-between mt-4">
                {modules.map((m, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <div 
                      className="w-3 h-3 rounded-full transition-all"
                      style={{ 
                        background: m.completed ? m.color : m.progress > 0 ? `${m.color}50` : 'rgba(255,255,255,0.1)',
                        boxShadow: m.completed ? `0 0 10px ${m.color}` : 'none',
                      }}
                    />
                    <span className="text-white/30 text-xs mt-1">M{m.id}</span>
                  </div>
                ))}
              </div>
            </div>
          </HoloCard>
        </motion.div>

        {/* Continue Learning */}
        {currentModule && totalProgress < 100 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-12"
          >
            <h3 className="text-white/50 text-sm uppercase tracking-widest mb-4">Reprendre la Formation</h3>
            
            <HoloCard glow={currentModule.color}>
              <div className="p-6 md:p-8">
                <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                  <NeuralOrb 
                    color={currentModule.color} 
                    progress={currentModule.progress} 
                    completed={false}
                    size="lg"
                  />
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span 
                        className="px-2 py-1 rounded text-xs font-medium"
                        style={{ 
                          background: `${currentModule.color}20`,
                          color: currentModule.color,
                        }}
                      >
                        Module {currentModule.id}
                      </span>
                      <span className="text-white/30 text-sm">{currentModule.duration}</span>
                    </div>
                    <h4 className="text-2xl font-bold text-white mb-1">{currentModule.title}</h4>
                    <p className="text-white/40">{currentModule.subtitle}</p>
                    
                    <div className="mt-4">
                      <LiquidProgress progress={currentModule.progress} color={currentModule.color} />
                      <div className="flex justify-between mt-2 text-sm">
                        <span className="text-white/40">{currentModule.currentLesson || 1}/{currentModule.lessons} leçons</span>
                        <span style={{ color: currentModule.color }}>{currentModule.xp} XP</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleStartModule(currentModule.id)}
                    className="relative group px-8 py-4 rounded-xl font-semibold text-white overflow-hidden"
                    style={{ background: currentModule.color }}
                  >
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform" />
                    <div className="relative flex items-center gap-2">
                      <div className="w-5 h-5"><IconPlay /></div>
                      Continuer
                    </div>
                  </button>
                </div>
              </div>
            </HoloCard>
          </motion.div>
        )}

        {/* All Modules */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h3 className="text-white/50 text-sm uppercase tracking-widest mb-6">Tous les Modules</h3>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map((module, index) => {
              const isLocked = index > 0 && !modules[index - 1].completed && module.progress === 0;
              const isCurrent = currentModule?.id === module.id;
              
              return (
                <motion.div
                  key={module.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  onHoverStart={() => !isLocked && setHoveredModule(module.id)}
                  onHoverEnd={() => setHoveredModule(null)}
                >
                  <HoloCard 
                    glow={module.color} 
                    hover={!isLocked}
                    className={isLocked ? 'opacity-40' : ''}
                  >
                    <div className="p-6">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <NeuralOrb 
                          color={module.color} 
                          progress={module.progress} 
                          completed={module.completed}
                        />
                        <div className="text-right">
                          <span 
                            className="text-xs font-medium"
                            style={{ color: module.color }}
                          >
                            +{module.xp} XP
                          </span>
                          <p className="text-white/30 text-xs">{module.duration}</p>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="mb-4">
                        <span className="text-white/30 text-xs">Module {module.id}</span>
                        <h4 className="text-white font-semibold text-lg mt-1">{module.title}</h4>
                        <p className="text-white/40 text-sm mt-1">{module.subtitle}</p>
                      </div>

                      {/* Progress */}
                      <div className="mb-4">
                        <LiquidProgress progress={module.progress} color={module.color} />
                        <div className="flex justify-between mt-2 text-xs">
                          <span className="text-white/30">{module.lessons} leçons</span>
                          {module.quizScore && (
                            <span className="text-[#00FF88]">Quiz: {module.quizScore}%</span>
                          )}
                        </div>
                      </div>

                      {/* Action Button */}
                      <button
                        onClick={() => !isLocked && handleStartModule(module.id)}
                        disabled={isLocked}
                        className="w-full py-3 rounded-xl font-medium text-sm transition-all flex items-center justify-center gap-2"
                        style={{
                          background: module.completed 
                            ? 'rgba(255,255,255,0.05)' 
                            : isLocked 
                              ? 'rgba(255,255,255,0.02)'
                              : `${module.color}20`,
                          color: module.completed 
                            ? 'rgba(255,255,255,0.5)' 
                            : isLocked 
                              ? 'rgba(255,255,255,0.2)'
                              : module.color,
                          border: `1px solid ${module.completed ? 'rgba(255,255,255,0.1)' : isLocked ? 'rgba(255,255,255,0.05)' : `${module.color}30`}`,
                        }}
                      >
                        {isLocked ? (
                          <>
                            <div className="w-4 h-4"><IconLock /></div>
                            Verrouillé
                          </>
                        ) : module.completed ? (
                          <>
                            <div className="w-4 h-4"><IconCheck /></div>
                            Revoir
                          </>
                        ) : isCurrent ? (
                          <>
                            <div className="w-4 h-4"><IconPlay /></div>
                            Continuer
                          </>
                        ) : (
                          <>
                            <div className="w-4 h-4"><IconPlay /></div>
                            Commencer
                          </>
                        )}
                      </button>
                    </div>
                  </HoloCard>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </main>

      {/* Custom Styles */}
      <style jsx global>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 4s linear infinite;
        }
        @keyframes wave {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(20deg); }
          75% { transform: rotate(-20deg); }
        }
        .animate-wave {
          animation: wave 1s ease-in-out infinite;
          transform-origin: 70% 70%;
        }
      `}</style>
    </div>
  );
}
