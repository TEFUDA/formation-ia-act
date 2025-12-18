'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

// Icons
const Icons = {
  Shield: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  Check: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-full h-full"><polyline points="20 6 9 17 4 12"/></svg>,
  ArrowRight: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
  Play: () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full"><polygon points="5 3 19 12 5 21 5 3"/></svg>,
  Users: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  Award: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>,
  Zap: () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  Book: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>,
  Target: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>,
  Clock: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  Globe: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
  Building: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01M16 6h.01M12 6h.01M12 10h.01M12 14h.01M16 10h.01M16 14h.01M8 10h.01M8 14h.01"/></svg>,
  Star: () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  Menu: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,
  X: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
};

// Neural Particle Field
const NeuralField = () => {
  const [particles, setParticles] = useState<{x: number, y: number, size: number, speed: number, opacity: number}[]>([]);
  
  useEffect(() => {
    setParticles(Array.from({ length: 80 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      speed: Math.random() * 20 + 10,
      opacity: Math.random() * 0.5 + 0.2,
    })));
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {particles.map((p, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-[#00F5FF]"
          style={{ width: p.size, height: p.size, left: `${p.x}%`, top: `${p.y}%`, opacity: p.opacity }}
          animate={{ y: [0, -30, 0], opacity: [p.opacity, p.opacity * 1.5, p.opacity] }}
          transition={{ duration: p.speed, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
};

// Floating Badge Component
const FloatingBadge = ({ children, delay = 0, className = '' }: { children: React.ReactNode, delay?: number, className?: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
    className={className}
  >
    <motion.div
      animate={{ y: [0, -10, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay }}
      className="bg-[#0A0A1B]/80 backdrop-blur-xl border border-white/10 rounded-2xl px-4 py-3 shadow-2xl"
    >
      {children}
    </motion.div>
  </motion.div>
);

// Glowing Card
const GlowCard = ({ children, glow = '#00F5FF', className = '' }: { children: React.ReactNode, glow?: string, className?: string }) => (
  <motion.div
    whileHover={{ scale: 1.02, y: -5 }}
    transition={{ type: 'spring', stiffness: 400 }}
    className={`relative group ${className}`}
  >
    <div className="absolute -inset-[1px] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" style={{ background: `${glow}30` }} />
    <div className="absolute -inset-[1px] rounded-2xl opacity-30 group-hover:opacity-60 transition-opacity" style={{ background: `linear-gradient(135deg, ${glow}40, transparent 50%, ${glow}40)` }} />
    <div className="relative bg-[#0A0A1B]/90 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
      <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity" style={{ background: `radial-gradient(circle at 50% 0%, ${glow}, transparent 70%)` }} />
      <div className="relative">{children}</div>
    </div>
  </motion.div>
);

// Pricing Data
const plans = [
  {
    id: 'solo',
    name: 'Solo',
    price: 500,
    description: 'Pour les professionnels individuels',
    color: '#00F5FF',
    features: ['1 utilisateur', '6 modules complets', 'Certificat officiel', 'Accès 12 mois', 'Support email'],
    popular: false,
  },
  {
    id: 'equipe',
    name: 'Équipe',
    price: 2000,
    description: 'Pour les petites équipes',
    color: '#00FF88',
    features: ['5 utilisateurs', '6 modules complets', 'Certificats officiels', 'Dashboard manager', 'Support prioritaire', 'Ressources téléchargeables'],
    popular: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 18000,
    description: 'Pour les grandes organisations',
    color: '#8B5CF6',
    features: ['50 utilisateurs', '6 modules complets', 'Certificats officiels', 'Dashboard avancé', 'Support dédié', 'Rapports personnalisés', 'Formation sur-mesure'],
    popular: false,
  },
];

// Modules Data
const modules = [
  { num: 1, title: "Fondamentaux de l'AI Act", duration: "45 min", icon: "📋", color: '#00F5FF' },
  { num: 2, title: "Classification des Risques", duration: "1h", icon: "⚠️", color: '#00FF88' },
  { num: 3, title: "Cartographie des Systèmes", duration: "1h15", icon: "📊", color: '#FF00E5' },
  { num: 4, title: "Gouvernance IA", duration: "1h", icon: "🏛️", color: '#FFB800' },
  { num: 5, title: "Systèmes Haut Risque", duration: "1h30", icon: "🔒", color: '#FF4444' },
  { num: 6, title: "Audit & Conformité", duration: "1h", icon: "✅", color: '#8B5CF6' },
];

// Stats
const stats = [
  { value: '35M€', label: "Amende maximale", icon: Icons.Shield },
  { value: '6h', label: "Formation complète", icon: Icons.Clock },
  { value: '100%', label: "Article 4 compliant", icon: Icons.Target },
  { value: '27', label: "Pays concernés", icon: Icons.Globe },
];

export default function LandingPage() {
  const [mobileMenu, setMobileMenu] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  return (
    <div className="min-h-screen bg-[#030014] text-white overflow-x-hidden">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[#030014]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-b from-[#00F5FF]/10 via-[#FF00E5]/5 to-transparent blur-[100px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#8B5CF6]/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#00FF88]/5 blur-[100px] rounded-full" />
        <NeuralField />
        <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: 'linear-gradient(rgba(0, 245, 255, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 245, 255, 0.3) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center justify-between bg-[#0A0A1B]/60 backdrop-blur-xl rounded-2xl border border-white/5 px-6 py-3">
            <Link href="/" className="flex items-center gap-3">
              <div className="relative w-10 h-10">
                <div className="absolute inset-0 bg-gradient-to-br from-[#00F5FF] to-[#FF00E5] rounded-xl rotate-45" />
                <div className="absolute inset-[2px] bg-[#030014] rounded-[8px] rotate-45" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-5 h-5 text-[#00F5FF]"><Icons.Shield /></div>
                </div>
              </div>
              <span className="font-bold text-lg hidden sm:block">AI Act Academy</span>
            </Link>

            <nav className="hidden md:flex items-center gap-8">
              {['Formation', 'Modules', 'Tarifs', 'Entreprise'].map(item => (
                <a key={item} href={`#${item.toLowerCase()}`} className="text-white/60 hover:text-white transition-colors text-sm">{item}</a>
              ))}
            </nav>

            <div className="flex items-center gap-3">
              <Link href="/login" className="hidden sm:block text-white/60 hover:text-white transition-colors text-sm px-4 py-2">Connexion</Link>
              <Link href="/pricing" className="bg-[#00F5FF] text-black font-semibold px-5 py-2.5 rounded-xl hover:bg-[#00F5FF]/90 transition-colors text-sm">
                Commencer
              </Link>
              <button onClick={() => setMobileMenu(true)} className="md:hidden p-2 text-white/60 hover:text-white">
                <div className="w-6 h-6"><Icons.Menu /></div>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenu && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[60] bg-[#030014]/95 backdrop-blur-xl md:hidden">
            <div className="p-6">
              <div className="flex justify-end mb-8">
                <button onClick={() => setMobileMenu(false)} className="p-2 text-white/60 hover:text-white">
                  <div className="w-6 h-6"><Icons.X /></div>
                </button>
              </div>
              <nav className="flex flex-col gap-4">
                {['Formation', 'Modules', 'Tarifs', 'Entreprise'].map(item => (
                  <a key={item} href={`#${item.toLowerCase()}`} onClick={() => setMobileMenu(false)} className="text-2xl font-semibold text-white/80 hover:text-white py-2">{item}</a>
                ))}
                <hr className="border-white/10 my-4" />
                <Link href="/login" className="text-white/60 py-2">Connexion</Link>
                <Link href="/pricing" className="bg-[#00F5FF] text-black font-semibold px-6 py-3 rounded-xl text-center mt-2">Commencer</Link>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center pt-24 pb-16 px-6">
        <motion.div style={{ opacity: heroOpacity, scale: heroScale }} className="relative z-10 max-w-5xl mx-auto text-center">
          {/* Badge */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="inline-flex items-center gap-2 bg-[#FF00E5]/10 border border-[#FF00E5]/30 rounded-full px-4 py-2 mb-8">
            <div className="w-2 h-2 bg-[#FF00E5] rounded-full animate-pulse" />
            <span className="text-[#FF00E5] text-sm font-medium">Article 4 • Obligation de formation</span>
          </motion.div>

          {/* Title */}
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-6 leading-[0.95]">
            <span className="block">Maîtrisez</span>
            <span className="block bg-gradient-to-r from-[#00F5FF] via-[#FF00E5] to-[#00FF88] bg-clip-text text-transparent">l'AI Act</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="text-xl sm:text-2xl text-white/50 max-w-2xl mx-auto mb-10">
            La formation complète pour être en conformité avec le règlement européen sur l'intelligence artificielle
          </motion.p>

          {/* CTA */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link href="/pricing" className="group relative bg-gradient-to-r from-[#00F5FF] to-[#00FF88] text-black font-bold px-8 py-4 rounded-xl text-lg overflow-hidden">
              <span className="relative z-10 flex items-center gap-2">
                Démarrer maintenant
                <div className="w-5 h-5 group-hover:translate-x-1 transition-transform"><Icons.ArrowRight /></div>
              </span>
              <div className="absolute inset-0 bg-white/30 translate-y-full group-hover:translate-y-0 transition-transform" />
            </Link>
            <button className="flex items-center gap-3 text-white/60 hover:text-white transition-colors px-6 py-4">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                <div className="w-5 h-5 ml-0.5"><Icons.Play /></div>
              </div>
              Voir la démo
            </button>
          </motion.div>

          {/* Floating Badges */}
          <div className="hidden lg:block">
            <FloatingBadge delay={0.6} className="absolute -left-20 top-1/4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#00FF88]/15 flex items-center justify-center">
                  <div className="w-5 h-5 text-[#00FF88]"><Icons.Award /></div>
                </div>
                <div className="text-left">
                  <p className="text-white font-semibold text-sm">Certificat officiel</p>
                  <p className="text-white/40 text-xs">Reconnu dans l'UE</p>
                </div>
              </div>
            </FloatingBadge>

            <FloatingBadge delay={0.8} className="absolute -right-16 top-1/3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#FFB800]/15 flex items-center justify-center">
                  <div className="w-5 h-5 text-[#FFB800]"><Icons.Zap /></div>
                </div>
                <div className="text-left">
                  <p className="text-white font-semibold text-sm">6 heures</p>
                  <p className="text-white/40 text-xs">Formation complète</p>
                </div>
              </div>
            </FloatingBadge>

            <FloatingBadge delay={1} className="absolute left-10 bottom-0">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  {['JD', 'MM', 'PB'].map((a, i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-[#1a1a3a] to-[#0a0a1b] flex items-center justify-center text-xs font-bold text-white border-2 border-[#030014]">{a}</div>
                  ))}
                </div>
                <p className="text-white/60 text-sm">+2,500 certifiés</p>
              </div>
            </FloatingBadge>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }} className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 2, repeat: Infinity }} className="w-6 h-10 rounded-full border-2 border-white/20 flex justify-center pt-2">
            <div className="w-1.5 h-3 bg-white/40 rounded-full" />
          </motion.div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="relative py-16 px-6 border-y border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center">
                <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4">
                  <div className="w-7 h-7 text-[#00F5FF]"><stat.icon /></div>
                </div>
                <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
                <p className="text-white/40 text-sm">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Modules Section */}
      <section id="modules" className="relative py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <span className="text-[#00F5FF] text-sm font-medium uppercase tracking-widest">Programme</span>
            <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-6">6 modules pour tout maîtriser</h2>
            <p className="text-white/50 text-lg max-w-2xl mx-auto">Un parcours progressif conçu par des experts juridiques et des spécialistes de l'IA</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map((module, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <GlowCard glow={module.color}>
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="text-4xl">{module.icon}</div>
                      <span className="text-white/30 text-sm">Module {module.num}</span>
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">{module.title}</h3>
                    <div className="flex items-center gap-2 text-white/40 text-sm">
                      <div className="w-4 h-4"><Icons.Clock /></div>
                      {module.duration}
                    </div>
                  </div>
                </GlowCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Section */}
      <section id="formation" className="relative py-24 px-6 bg-gradient-to-b from-transparent via-[#0A0A1B]/50 to-transparent">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <span className="text-[#FF00E5] text-sm font-medium uppercase tracking-widest">Pourquoi cette formation ?</span>
              <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-6">L'Article 4 vous concerne</h2>
              <p className="text-white/50 text-lg mb-8">Le règlement européen AI Act impose une obligation de formation pour toute personne impliquée dans la conception, le déploiement ou l'utilisation de systèmes d'IA.</p>
              
              <div className="space-y-4">
                {[
                  { title: "Obligation légale", desc: "Article 4 : formation obligatoire pour tous les acteurs de l'IA" },
                  { title: "Sanctions lourdes", desc: "Jusqu'à 35M€ ou 7% du CA mondial annuel" },
                  { title: "Applicable maintenant", desc: "Les premières obligations entrent en vigueur dès 2025" },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="w-6 h-6 rounded-full bg-[#00FF88]/15 flex items-center justify-center flex-shrink-0 mt-1">
                      <div className="w-3 h-3 text-[#00FF88]"><Icons.Check /></div>
                    </div>
                    <div>
                      <h4 className="text-white font-semibold">{item.title}</h4>
                      <p className="text-white/40 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="relative">
              <GlowCard glow="#FF00E5">
                <div className="p-8">
                  <div className="text-6xl mb-6">⚖️</div>
                  <h3 className="text-2xl font-bold text-white mb-4">Calendrier AI Act</h3>
                  <div className="space-y-4">
                    {[
                      { date: "Août 2024", event: "Entrée en vigueur", active: true },
                      { date: "Fév 2025", event: "IA interdites", active: true },
                      { date: "Août 2025", event: "Obligation formation", active: false },
                      { date: "Août 2026", event: "Obligations complètes", active: false },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-4">
                        <div className={`w-3 h-3 rounded-full ${item.active ? 'bg-[#00FF88]' : 'bg-white/20'}`} />
                        <div>
                          <span className={`font-semibold ${item.active ? 'text-white' : 'text-white/50'}`}>{item.date}</span>
                          <span className="text-white/40 ml-2">— {item.event}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </GlowCard>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="tarifs" className="relative py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <span className="text-[#00FF88] text-sm font-medium uppercase tracking-widest">Tarifs</span>
            <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-6">Choisissez votre formule</h2>
            <p className="text-white/50 text-lg max-w-2xl mx-auto">Des solutions adaptées à chaque besoin, du professionnel indépendant à la grande entreprise</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {plans.map((plan, i) => (
              <motion.div key={plan.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <GlowCard glow={plan.color} className={plan.popular ? 'ring-2' : ''} style={{ '--tw-ring-color': plan.color } as React.CSSProperties}>
                  <div className="p-6">
                    {plan.popular && (
                      <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium mb-4" style={{ background: `${plan.color}20`, color: plan.color }}>
                        <div className="w-3 h-3"><Icons.Star /></div>
                        Populaire
                      </div>
                    )}
                    <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                    <p className="text-white/40 text-sm mb-4">{plan.description}</p>
                    
                    <div className="mb-6">
                      <span className="text-4xl font-bold" style={{ color: plan.color }}>{plan.price.toLocaleString()}€</span>
                      <span className="text-white/40 ml-2">HT</span>
                    </div>

                    <ul className="space-y-3 mb-6">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-white/60 text-sm">
                          <div className="w-4 h-4" style={{ color: plan.color }}><Icons.Check /></div>
                          {feature}
                        </li>
                      ))}
                    </ul>

                    <Link href={`/checkout?plan=${plan.id}`} className="block w-full py-3 rounded-xl font-semibold text-center transition-all" style={{ background: plan.popular ? plan.color : 'rgba(255,255,255,0.05)', color: plan.popular ? 'black' : 'white' }}>
                      {plan.id === 'enterprise' ? 'Nous contacter' : 'Commencer'}
                    </Link>
                  </div>
                </GlowCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}>
            <GlowCard glow="#00F5FF">
              <div className="p-12">
                <div className="text-5xl mb-6">🚀</div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Prêt à vous mettre en conformité ?</h2>
                <p className="text-white/50 text-lg mb-8 max-w-xl mx-auto">Rejoignez les 2,500+ professionnels déjà certifiés et anticipez les obligations de l'AI Act</p>
                <Link href="/pricing" className="inline-flex items-center gap-2 bg-[#00F5FF] text-black font-bold px-8 py-4 rounded-xl hover:bg-[#00F5FF]/90 transition-colors">
                  Démarrer ma formation
                  <div className="w-5 h-5"><Icons.ArrowRight /></div>
                </Link>
              </div>
            </GlowCard>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-12 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="relative w-8 h-8">
                <div className="absolute inset-0 bg-gradient-to-br from-[#00F5FF] to-[#FF00E5] rounded-lg rotate-45" />
                <div className="absolute inset-[2px] bg-[#030014] rounded-[6px] rotate-45" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-4 h-4 text-[#00F5FF]"><Icons.Shield /></div>
                </div>
              </div>
              <span className="font-semibold">AI Act Academy</span>
            </div>
            
            <nav className="flex items-center gap-6 text-sm text-white/40">
              <a href="#" className="hover:text-white transition-colors">Mentions légales</a>
              <a href="#" className="hover:text-white transition-colors">CGV</a>
              <a href="#" className="hover:text-white transition-colors">Contact</a>
            </nav>
            
            <p className="text-white/30 text-sm">© 2024 AI Act Academy. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
