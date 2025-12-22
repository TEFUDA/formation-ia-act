'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const Icons = {
  Shield: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  ArrowRight: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
  ArrowLeft: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>,
  Check: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-full h-full"><polyline points="20 6 9 17 4 12"/></svg>,
  X: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  Lock: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
};

const NeuralBackground = () => (
  <div className="fixed inset-0 pointer-events-none overflow-hidden">
    <div className="absolute inset-0 bg-[#030014]" />
    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#8B5CF6]/8 blur-[120px] rounded-full" />
    <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#00FF88]/6 blur-[100px] rounded-full" />
  </div>
);

const HoloCard = ({ children, glow = '#8B5CF6', className = '', highlight = false, locked = false }: { children: React.ReactNode, glow?: string, className?: string, highlight?: boolean, locked?: boolean }) => (
  <div className={`relative group ${className} ${locked ? 'opacity-60' : ''}`}>
    {highlight && !locked && (
      <div className="absolute -inset-[2px] rounded-2xl bg-gradient-to-r from-[#8B5CF6] via-[#00F5FF] to-[#FFB800] opacity-70 animate-pulse" />
    )}
    <div className="absolute -inset-[1px] rounded-2xl opacity-0 group-hover:opacity-60 transition-opacity duration-300" style={{ background: `linear-gradient(135deg, ${glow}40, transparent 50%, ${glow}40)` }} />
    <div className={`relative bg-[#0A0A1B]/95 backdrop-blur-xl rounded-2xl border overflow-hidden h-full ${highlight && !locked ? 'border-transparent' : 'border-white/10'}`}>
      {locked && (
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] z-10 flex items-center justify-center">
          <div className="w-12 h-12 text-white/30"><Icons.Lock /></div>
        </div>
      )}
      <div className="relative h-full">{children}</div>
    </div>
  </div>
);

// Plan hierarchy: enterprise > pro > solo
const planHierarchy = { solo: 1, pro: 2, enterprise: 3 };

const auditPlans = [
  {
    id: 'solo',
    name: 'Audit Solo',
    subtitle: 'Audit de base',
    color: '#00F5FF',
    icon: '📊',
    duration: '15-20 min',
    questions: '40 questions',
    reportPages: '15 pages',
    features: [
      "40 questions standard",
      "6 catégories analysées",
      "Score de conformité global",
      "Rapport PDF (15 pages)",
      "Recommandations générales",
      "Refaisable à volonté",
    ],
    notIncluded: [
      "Questions adaptatives",
      "Templates pré-remplis",
      "Certificat d'audit",
    ],
  },
  {
    id: 'pro',
    name: 'Audit Pro',
    subtitle: 'Audit Premium',
    color: '#8B5CF6',
    icon: '⭐',
    duration: '45-60 min',
    questions: '80 questions',
    reportPages: '40-50 pages',
    popular: true,
    features: [
      "80 questions adaptatives",
      "Questions par secteur d'activité",
      "Détection auto systèmes haut risque",
      "Rapport PDF Premium (40-50 pages)",
      "Graphiques : radar, jauges, matrices",
      "Citations AI Act par point",
      "30+ recommandations détaillées",
      "Plan d'action 12 mois",
      "3 templates pré-remplis",
      "Certificat d'audit (1 an)",
    ],
    notIncluded: [
      "Analyse multi-sites",
      "Dashboard de suivi",
    ],
  },
  {
    id: 'enterprise',
    name: 'Audit Enterprise',
    subtitle: 'Audit Expert',
    color: '#FFB800',
    icon: '👑',
    duration: '90-120 min',
    questions: '150 questions',
    reportPages: '80-100 pages',
    features: [
      "150 questions ultra-détaillées",
      "Analyse multi-sites/filiales",
      "Questions fournisseurs IA",
      "Rapport Expert (80-100 pages)",
      "Analyse juridique des risques",
      "Benchmark sectoriel",
      "Analyse droits fondamentaux",
      "12 templates pré-remplis",
      "PowerPoint COMEX (20 slides)",
      "Dashboard suivi 12 mois",
      "Mises à jour AI Act",
    ],
    notIncluded: [],
  },
];

const categoriesSolo = [
  { icon: "📋", title: "Inventaire IA", questions: 7, color: "#00F5FF" },
  { icon: "⚠️", title: "Classification", questions: 7, color: "#FF6B00" },
  { icon: "🏛️", title: "Gouvernance", questions: 7, color: "#8B5CF6" },
  { icon: "📄", title: "Documentation", questions: 7, color: "#00FF88" },
  { icon: "🎓", title: "Formation", questions: 6, color: "#FFB800" },
  { icon: "👁️", title: "Transparence", questions: 6, color: "#FF4444" },
];

export default function AuditPage() {
  const router = useRouter();
  const [userPlan, setUserPlan] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check user's current plan from localStorage
    const savedPlan = localStorage.getItem('userPlan');
    setUserPlan(savedPlan);
    setIsLoading(false);
  }, []);

  // Check if user can access a specific audit level
  const canAccess = (auditPlanId: string) => {
    if (!userPlan) return false;
    const userLevel = planHierarchy[userPlan as keyof typeof planHierarchy] || 0;
    const requiredLevel = planHierarchy[auditPlanId as keyof typeof planHierarchy] || 0;
    return userLevel >= requiredLevel;
  };

  // Get the audit plan the user should use
  const getUserAuditPlan = () => {
    if (!userPlan) return null;
    return userPlan;
  };

  const handleStartAudit = (planId: string) => {
    if (canAccess(planId)) {
      router.push(`/audit/questionnaire?plan=${planId}`);
    } else if (!userPlan) {
      router.push('/pricing');
    } else {
      router.push('/pricing');
    }
  };

  // If user has a plan, show their specific audit
  const userAuditPlan = getUserAuditPlan();

  return (
    <div className="min-h-screen bg-[#030014] text-white">
      <NeuralBackground />

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
            <Link href="/dashboard" className="text-white/60 hover:text-white text-sm transition-colors flex items-center gap-2">
              <div className="w-4 h-4"><Icons.ArrowLeft /></div>
              <span className="hidden sm:inline">Dashboard</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="relative z-10 px-6 py-12">
        <div className="max-w-6xl mx-auto">
          
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <span className="text-5xl mb-4 block">🔍</span>
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              Audit de <span className="bg-gradient-to-r from-[#8B5CF6] to-[#00F5FF] text-transparent bg-clip-text">conformité AI Act</span>
            </h1>
            <p className="text-xl text-white/60 max-w-3xl mx-auto">
              Évaluez votre niveau de conformité et obtenez un rapport personnalisé avec des recommandations concrètes.
            </p>
          </motion.div>

          {/* User status */}
          {!isLoading && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }}
              className="mb-12"
            >
              {userPlan ? (
                <div className="text-center">
                  <div className="inline-flex flex-col items-center gap-4 bg-gradient-to-br from-white/5 to-white/10 border border-white/20 rounded-2xl px-8 py-6">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">
                        {userPlan === 'enterprise' ? '👑' : userPlan === 'pro' ? '⭐' : '📊'}
                      </span>
                      <span className="text-lg font-medium">
                        Vous avez accès à l'<span style={{ color: userPlan === 'enterprise' ? '#FFB800' : userPlan === 'pro' ? '#8B5CF6' : '#00F5FF' }}>Audit {userPlan.charAt(0).toUpperCase() + userPlan.slice(1)}</span>
                      </span>
                    </div>
                    <button
                      onClick={() => router.push(`/audit/questionnaire?plan=${userPlan}`)}
                      className="px-8 py-4 rounded-xl font-bold text-lg transition-all hover:scale-105"
                      style={{ 
                        background: userPlan === 'enterprise' 
                          ? 'linear-gradient(90deg, #FFB800, #FF8C00)' 
                          : userPlan === 'pro' 
                            ? 'linear-gradient(90deg, #8B5CF6, #00F5FF)' 
                            : 'linear-gradient(90deg, #00F5FF, #0066FF)',
                        color: userPlan === 'enterprise' ? '#000' : '#fff'
                      }}
                    >
                      🚀 Lancer mon audit {userPlan.charAt(0).toUpperCase() + userPlan.slice(1)} →
                    </button>
                    <p className="text-white/40 text-sm">
                      {userPlan === 'enterprise' ? '150 questions • 90-120 min • Rapport 80-100 pages' :
                       userPlan === 'pro' ? '80 questions • 45-60 min • Rapport 40-50 pages' :
                       '40 questions • 15-20 min • Rapport 15 pages'}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <div className="inline-flex flex-col items-center gap-3 bg-[#FFB800]/10 border border-[#FFB800]/30 rounded-2xl px-8 py-6">
                    <span className="text-[#FFB800] text-lg">🔒 Audit inclus dans la formation</span>
                    <p className="text-white/60 text-sm max-w-md">
                      L'audit de conformité AI Act est inclus dans nos formations. Choisissez votre plan pour accéder à l'audit correspondant.
                    </p>
                    <Link 
                      href="/pricing"
                      className="mt-2 bg-gradient-to-r from-[#8B5CF6] to-[#00F5FF] text-white font-bold px-8 py-3 rounded-xl hover:opacity-90 transition-opacity flex items-center gap-2"
                    >
                      Voir les formations
                      <div className="w-5 h-5"><Icons.ArrowRight /></div>
                    </Link>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* Audit Plans Cards */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.1 }}
            className="grid lg:grid-cols-3 gap-6 mb-16"
          >
            {auditPlans.map((plan, i) => {
              const hasAccess = canAccess(plan.id);
              const isUserPlan = userPlan === plan.id;
              
              return (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.1 }}
                >
                  <HoloCard 
                    glow={plan.color} 
                    highlight={plan.popular || isUserPlan}
                    locked={!hasAccess && userPlan !== null}
                  >
                    <div className="p-6">
                      {/* Badge */}
                      {isUserPlan && (
                        <div className="absolute top-0 right-0 bg-[#00FF88] text-black text-xs font-bold px-4 py-1 rounded-bl-xl rounded-tr-xl">
                          ✓ VOTRE PLAN
                        </div>
                      )}
                      {plan.popular && !isUserPlan && (
                        <div className="absolute top-0 right-0 bg-gradient-to-r from-[#8B5CF6] to-[#00F5FF] text-white text-xs font-bold px-4 py-1 rounded-bl-xl rounded-tr-xl">
                          ⭐ POPULAIRE
                        </div>
                      )}
                      
                      {/* Header */}
                      <div className="text-center mb-6">
                        <span className="text-4xl mb-3 block">{plan.icon}</span>
                        <h3 className="text-2xl font-bold" style={{ color: plan.color }}>{plan.name}</h3>
                        <p className="text-white/50 text-sm">{plan.subtitle}</p>
                      </div>
                      
                      {/* Stats */}
                      <div className="grid grid-cols-3 gap-2 mb-6">
                        <div className="text-center p-2 bg-white/5 rounded-lg">
                          <div className="text-xs text-white/40 mb-1">⏱️</div>
                          <div className="text-xs font-medium">{plan.duration}</div>
                        </div>
                        <div className="text-center p-2 bg-white/5 rounded-lg">
                          <div className="text-xs text-white/40 mb-1">❓</div>
                          <div className="text-xs font-medium">{plan.questions}</div>
                        </div>
                        <div className="text-center p-2 bg-white/5 rounded-lg">
                          <div className="text-xs text-white/40 mb-1">📄</div>
                          <div className="text-xs font-medium">{plan.reportPages}</div>
                        </div>
                      </div>
                      
                      {/* Features */}
                      <div className="space-y-2 mb-6 max-h-[250px] overflow-y-auto pr-2">
                        {plan.features.map((feature, j) => (
                          <div key={j} className="flex items-start gap-2 text-sm text-white/80">
                            <div className="w-4 h-4 flex-shrink-0 mt-0.5 text-[#00FF88]">
                              <Icons.Check />
                            </div>
                            <span>{feature}</span>
                          </div>
                        ))}
                        {plan.notIncluded.map((feature, j) => (
                          <div key={`not-${j}`} className="flex items-start gap-2 text-sm text-white/30">
                            <div className="w-4 h-4 flex-shrink-0 mt-0.5 text-white/20">
                              <Icons.X />
                            </div>
                            <span className="line-through">{feature}</span>
                          </div>
                        ))}
                      </div>
                      
                      {/* CTA */}
                      {hasAccess ? (
                        <button
                          onClick={() => handleStartAudit(plan.id)}
                          className={`w-full py-4 rounded-xl font-bold text-center transition-all ${
                            isUserPlan
                              ? 'bg-gradient-to-r from-[#00FF88] to-[#00F5FF] text-black hover:opacity-90'
                              : 'bg-gradient-to-r from-[#8B5CF6] to-[#00F5FF] text-white hover:opacity-90'
                          }`}
                        >
                          {isUserPlan ? "Commencer l'audit →" : "Accéder à cet audit →"}
                        </button>
                      ) : userPlan ? (
                        <Link
                          href="/pricing"
                          className="block w-full py-4 rounded-xl font-bold text-center border-2 border-white/20 text-white/50 hover:bg-white/5 transition-all"
                        >
                          🔒 Upgrade requis
                        </Link>
                      ) : (
                        <Link
                          href="/pricing"
                          className="block w-full py-4 rounded-xl font-bold text-center border-2 hover:bg-white/5 transition-all"
                          style={{ borderColor: plan.color, color: plan.color }}
                        >
                          Voir la formation {plan.id.charAt(0).toUpperCase() + plan.id.slice(1)}
                        </Link>
                      )}
                    </div>
                  </HoloCard>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Categories analyzed */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }} 
            className="mb-16"
          >
            <h2 className="text-2xl font-bold text-center mb-2">6 domaines analysés</h2>
            <p className="text-white/50 text-center mb-8">Basé sur les exigences de l'AI Act européen</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {categoriesSolo.map((cat, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, y: 10 }} 
                  whileInView={{ opacity: 1, y: 0 }} 
                  viewport={{ once: true }} 
                  transition={{ delay: i * 0.05 }}
                  className="bg-white/5 rounded-xl p-4 flex items-center gap-4"
                >
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                    style={{ background: `${cat.color}15` }}
                  >
                    {cat.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{cat.title}</h3>
                    <p className="text-white/50 text-sm">{cat.questions}+ questions</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Sample Report Preview */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }}
          >
            <HoloCard glow="#FFB800">
              <div className="p-8">
                <h2 className="text-xl font-bold text-center mb-8">📊 Aperçu du rapport</h2>
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="font-semibold mb-4 text-[#FFB800]">Score de conformité</h3>
                    <div className="space-y-3">
                      {[
                        { label: "Inventaire IA", value: 75, color: "#00F5FF" },
                        { label: "Classification", value: 45, color: "#FF6B00" },
                        { label: "Gouvernance", value: 60, color: "#8B5CF6" },
                        { label: "Documentation", value: 30, color: "#00FF88" },
                        { label: "Formation", value: 80, color: "#FFB800" },
                        { label: "Transparence", value: 55, color: "#FF4444" },
                      ].map((item, i) => (
                        <div key={i}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-white/70">{item.label}</span>
                            <span className="font-medium" style={{ color: item.color }}>{item.value}%</span>
                          </div>
                          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                            <motion.div
                              className="h-full rounded-full"
                              style={{ background: item.color }}
                              initial={{ width: 0 }}
                              whileInView={{ width: `${item.value}%` }}
                              viewport={{ once: true }}
                              transition={{ duration: 0.8, delay: i * 0.1 }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-4 text-[#FFB800]">Recommandations prioritaires</h3>
                    <div className="space-y-3">
                      {[
                        { priority: "🔴", text: "Compléter le registre des systèmes IA" },
                        { priority: "🔴", text: "Classifier les systèmes par niveau de risque" },
                        { priority: "🟠", text: "Nommer un Référent IA" },
                        { priority: "🟠", text: "Documenter les systèmes haut risque" },
                        { priority: "🟡", text: "Former les équipes (Article 4)" },
                      ].map((rec, i) => (
                        <div key={i} className="flex items-start gap-2 text-sm">
                          <span>{rec.priority}</span>
                          <span className="text-white/70">{rec.text}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-6 pt-4 border-t border-white/10">
                      <p className="text-white/50 text-sm">
                        📅 <strong>Échéance Article 4 :</strong> Février 2025 (obligation de formation)
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </HoloCard>
          </motion.div>

        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-8 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/30 text-sm">© 2025 Formation-IA-Act.fr. Tous droits réservés.</p>
          <div className="flex items-center gap-4 text-sm text-white/40">
            <Link href="/mentions-legales" className="hover:text-white transition-colors">Mentions légales</Link>
            <Link href="/cgv" className="hover:text-white transition-colors">CGV</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
