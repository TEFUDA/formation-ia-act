'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  Clock: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  AlertTriangle: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  Star: () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  Menu: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,
  X: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  FileText: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
  Headphones: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/></svg>,
  CheckCircle: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>,
  Quote: () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V21c0 1 0 1 1 1z"/><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/></svg>,
  Linkedin: () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>,
  Mail: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
  Calendar: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  ShieldCheck: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>,
};

// Calculate days until August 2, 2026
const calculateDaysUntil = () => {
  const deadline = new Date('2026-08-02');
  const today = new Date();
  const diffTime = deadline.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// Neural Background - Same as dashboard
const NeuralBackground = () => {
  const [particles, setParticles] = useState<{x: number, y: number, size: number, speed: number, delay: number}[]>([]);
  
  useEffect(() => {
    setParticles(Array.from({ length: 60 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      speed: Math.random() * 20 + 15,
      delay: Math.random() * 5,
    })));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-[#0A0A1B]" />
      
      {/* Gradient orbs */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-[#00F5FF]/8 blur-[120px] rounded-full" />
      <div className="absolute top-[20%] right-[-15%] w-[500px] h-[500px] bg-[#8B5CF6]/6 blur-[100px] rounded-full" />
      <div className="absolute bottom-[-10%] left-[30%] w-[700px] h-[700px] bg-[#FF6B00]/5 blur-[140px] rounded-full" />
      <div className="absolute bottom-[20%] right-[20%] w-[400px] h-[400px] bg-[#00FF88]/5 blur-[80px] rounded-full" />
      
      {/* Grid */}
      <div 
        className="absolute inset-0 opacity-[0.03]" 
        style={{ 
          backgroundImage: 'linear-gradient(rgba(0, 245, 255, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 245, 255, 0.5) 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }} 
      />
      
      {/* Floating particles */}
      {particles.map((p, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{ 
            width: p.size, 
            height: p.size, 
            left: `${p.x}%`, 
            top: `${p.y}%`,
            background: i % 3 === 0 ? '#00F5FF' : i % 3 === 1 ? '#00FF88' : '#8B5CF6',
          }}
          animate={{ 
            y: [0, -30, 0], 
            opacity: [0.2, 0.6, 0.2],
            scale: [1, 1.2, 1],
          }}
          transition={{ 
            duration: p.speed, 
            repeat: Infinity, 
            ease: "easeInOut",
            delay: p.delay,
          }}
        />
      ))}
    </div>
  );
};

// HoloCard - Same as dashboard/app
const HoloCard = ({ children, glow = '#00F5FF', hover = true, className = '' }: { children: React.ReactNode, glow?: string, hover?: boolean, className?: string }) => (
  <motion.div 
    className={`relative group ${className}`}
    whileHover={hover ? { scale: 1.01, y: -2 } : {}}
    transition={{ type: "spring", stiffness: 400, damping: 25 }}
  >
    {/* Glow effect */}
    <div 
      className="absolute -inset-[1px] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"
      style={{ background: `linear-gradient(135deg, ${glow}40, transparent 50%, ${glow}40)` }}
    />
    {/* Border gradient */}
    <div 
      className="absolute -inset-[1px] rounded-2xl opacity-50 group-hover:opacity-80 transition-opacity"
      style={{ background: `linear-gradient(135deg, ${glow}30, transparent 40%, transparent 60%, ${glow}30)` }}
    />
    {/* Content */}
    <div className="relative bg-[#0A0A1B]/80 backdrop-blur-xl rounded-2xl border border-white/5 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent" />
      <div className="relative">{children}</div>
    </div>
  </motion.div>
);

// Neural Orb - Animated circular element
const NeuralOrb = ({ color, size = 'md' }: { color: string, size?: 'sm' | 'md' | 'lg' }) => {
  const sizes = { sm: 'w-12 h-12', md: 'w-16 h-16', lg: 'w-20 h-20' };
  return (
    <div className={`relative ${sizes[size]}`}>
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{ background: `radial-gradient(circle, ${color}40 0%, transparent 70%)` }}
        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
      <div 
        className="absolute inset-2 rounded-full backdrop-blur-sm border"
        style={{ borderColor: `${color}30`, background: `linear-gradient(135deg, ${color}20, transparent)` }}
      />
    </div>
  );
};

// Data
const testimonials = [
  { name: "Sophie Martin", role: "DPO", company: "BNP Paribas", image: "SM", quote: "Formation très complète qui m'a permis de comprendre les obligations de l'AI Act. Les templates sont un vrai plus.", rating: 5 },
  { name: "Thomas Durand", role: "Directeur Juridique", company: "Capgemini", image: "TD", quote: "Indispensable pour toute personne impliquée dans la conformité IA. Le certificat est reconnu par nos clients.", rating: 5 },
  { name: "Marie Lefevre", role: "Chief AI Officer", company: "Société Générale", image: "ML", quote: "Nous avons formé 40 collaborateurs. Le dashboard admin et le suivi sont excellents pour les grandes équipes.", rating: 5 },
];

const modules = [
  { num: 1, title: "Fondamentaux de l'AI Act", duration: "45 min", icon: "📋", color: '#00F5FF' },
  { num: 2, title: "Classification des Risques", duration: "1h", icon: "⚠️", color: '#FF6B00' },
  { num: 3, title: "Cartographie des Systèmes IA", duration: "1h15", icon: "📊", color: '#00FF88' },
  { num: 4, title: "Gouvernance IA", duration: "1h", icon: "🏛️", color: '#FFB800' },
  { num: 5, title: "Systèmes Haut Risque", duration: "1h30", icon: "🔒", color: '#FF4444' },
  { num: 6, title: "Audit & Conformité", duration: "1h", icon: "✅", color: '#8B5CF6' },
];

const plans = [
  { id: 'solo', name: 'Solo', price: 500, users: '1', color: '#00F5FF', features: ['1 utilisateur', '6 modules complets', 'Certificat officiel', '12 mois d\'accès', 'Support email'] },
  { id: 'equipe', name: 'Équipe', price: 2000, users: '5', color: '#00FF88', popular: true, features: ['5 utilisateurs', '6 modules complets', 'Certificats officiels', 'Dashboard admin', 'Support prioritaire'] },
  { id: 'enterprise', name: 'Enterprise', price: 18000, users: '50', color: '#8B5CF6', features: ['50 utilisateurs', '6 modules complets', 'Certificats officiels', 'Dashboard avancé', 'Account manager dédié', 'Formation sur-mesure'] },
];

const steps = [
  { num: 1, title: "Inscription", desc: "Créez votre compte et choisissez votre formule", icon: "📝", color: '#00F5FF' },
  { num: 2, title: "Formation", desc: "Suivez les 6 modules à votre rythme", icon: "🎓", color: '#00FF88' },
  { num: 3, title: "Quiz", desc: "Validez vos connaissances (80% requis)", icon: "✍️", color: '#FFB800' },
  { num: 4, title: "Certificat", desc: "Obtenez votre certificat officiel", icon: "🏆", color: '#8B5CF6' },
];

export default function LandingPage() {
  const [mobileMenu, setMobileMenu] = useState(false);
  const [daysLeft, setDaysLeft] = useState(227);

  useEffect(() => {
    setDaysLeft(calculateDaysUntil());
  }, []);

  const progressPercent = Math.max(0, Math.min(100, ((365 * 2 - daysLeft) / (365 * 2)) * 100));

  return (
    <div className="min-h-screen bg-[#0A0A1B] text-white overflow-x-hidden">
      <NeuralBackground />

      {/* URGENCY TOP BANNER - Neural style */}
      <motion.div 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative z-50"
      >
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-[#FF4444] via-[#FF6B00] to-[#FF4444]" />
          <motion.div 
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          />
          <div className="relative py-3 px-4">
            <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center gap-x-6 gap-y-1 text-sm">
              <div className="flex items-center gap-2">
                <motion.div 
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="w-4 h-4"
                >
                  <Icons.AlertTriangle />
                </motion.div>
                <span className="font-semibold">AI Act 2026 :</span>
                <span>Plus que <strong className="text-yellow-300">{daysLeft} jours</strong> pour vous mettre en conformité</span>
              </div>
              <div className="hidden sm:block text-white/50">|</div>
              <span className="font-medium">Amendes jusqu'à <strong>35M€</strong> ou <strong>7% du CA</strong></span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Header */}
      <header className="relative z-40 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <motion.div 
              className="w-10 h-10 bg-gradient-to-br from-[#00F5FF] to-[#0066FF] rounded-xl flex items-center justify-center relative overflow-hidden"
              whileHover={{ scale: 1.05 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="w-5 h-5 text-white"><Icons.Shield /></div>
            </motion.div>
            <span className="font-bold text-lg">Formation-IA-Act.fr</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {['Modules', 'Formateur', 'Témoignages', 'Tarifs', 'FAQ'].map((item) => (
              <a 
                key={item} 
                href={`#${item.toLowerCase()}`} 
                className="relative text-white/60 hover:text-white transition-colors text-sm group"
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#00F5FF] group-hover:w-full transition-all duration-300" />
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/login" className="hidden sm:block text-white/60 hover:text-white transition-colors text-sm px-4 py-2">
              Connexion
            </Link>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link href="/pricing" className="relative group bg-gradient-to-r from-[#00F5FF] to-[#0066FF] text-white font-semibold px-5 py-2.5 rounded-xl text-sm overflow-hidden">
                <span className="relative z-10">Commencer</span>
                <div className="absolute inset-0 bg-gradient-to-r from-[#0066FF] to-[#00F5FF] opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            </motion.div>
            <button onClick={() => setMobileMenu(true)} className="md:hidden p-2 text-white/60">
              <div className="w-6 h-6"><Icons.Menu /></div>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenu && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 z-[60] bg-[#0A0A1B]/98 backdrop-blur-xl md:hidden"
          >
            <div className="p-6">
              <div className="flex justify-end mb-8">
                <button onClick={() => setMobileMenu(false)} className="p-2 text-white/60">
                  <div className="w-6 h-6"><Icons.X /></div>
                </button>
              </div>
              <nav className="flex flex-col gap-4">
                {['Modules', 'Formateur', 'Témoignages', 'Tarifs', 'FAQ'].map(item => (
                  <a key={item} href={`#${item.toLowerCase()}`} onClick={() => setMobileMenu(false)} className="text-xl font-semibold text-white/80 py-2">{item}</a>
                ))}
                <hr className="border-white/10 my-4" />
                <Link href="/login" className="text-white/60 py-2">Connexion</Link>
                <Link href="/pricing" className="bg-gradient-to-r from-[#00F5FF] to-[#0066FF] text-white font-semibold px-6 py-3 rounded-xl text-center mt-2">Commencer</Link>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HERO SECTION */}
      <section className="relative z-10 pt-12 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Content */}
            <div>
              {/* Urgency Badge */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                className="inline-flex items-center gap-2 bg-[#FF4444]/10 border border-[#FF4444]/30 rounded-full px-4 py-2 mb-6 backdrop-blur-sm"
              >
                <motion.div 
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-2 h-2 rounded-full bg-[#FF4444]" 
                />
                <span className="text-[#FF4444] text-sm font-medium">Obligation légale depuis février 2025</span>
              </motion.div>

              <motion.h1 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: 0.1 }} 
                className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
              >
                Formez vos équipes<br />
                à l'<span className="bg-gradient-to-r from-[#00F5FF] to-[#0066FF] bg-clip-text text-transparent">AI Act</span><br />
                <span className="text-white/30">avant les sanctions</span>
              </motion.h1>

              <motion.p 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: 0.2 }} 
                className="text-lg text-white/50 mb-8 max-w-lg"
              >
                La première formation en ligne certifiante pour mettre votre entreprise en conformité avec le règlement européen sur l'Intelligence Artificielle.
              </motion.p>

              {/* Features Grid */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: 0.3 }} 
                className="grid grid-cols-2 gap-4 mb-8"
              >
                {[
                  { icon: Icons.Clock, text: "6 modules • 8h de formation", color: '#00F5FF' },
                  { icon: Icons.Award, text: "Certification reconnue", color: '#00FF88' },
                  { icon: Icons.FileText, text: "Templates & checklists inclus", color: '#FFB800' },
                  { icon: Icons.Headphones, text: "Support expert inclus", color: '#8B5CF6' },
                ].map((item, i) => (
                  <motion.div 
                    key={i} 
                    className="flex items-center gap-3 group"
                    whileHover={{ x: 5 }}
                  >
                    <div 
                      className="w-10 h-10 rounded-xl flex items-center justify-center transition-colors"
                      style={{ background: `${item.color}15` }}
                    >
                      <div className="w-5 h-5" style={{ color: item.color }}><item.icon /></div>
                    </div>
                    <span className="text-sm text-white/60 group-hover:text-white/80 transition-colors">{item.text}</span>
                  </motion.div>
                ))}
              </motion.div>

              {/* CTA */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: 0.4 }} 
                className="flex flex-col sm:flex-row gap-4 mb-8"
              >
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Link href="/quiz" className="group relative bg-gradient-to-r from-[#FF6B00] to-[#FF4444] text-white font-bold px-6 py-4 rounded-xl flex items-center justify-center gap-2 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#FF4444] to-[#FF6B00] opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative flex items-center gap-2">
                      <div className="w-5 h-5"><Icons.Zap /></div>
                      Évaluez votre niveau de risque
                      <motion.div 
                        className="w-5 h-5"
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <Icons.ArrowRight />
                      </motion.div>
                    </div>
                  </Link>
                </motion.div>
                <Link href="#tarifs" className="border border-white/20 hover:border-white/40 hover:bg-white/5 text-white font-medium px-6 py-4 rounded-xl text-center transition-all">
                  Voir les tarifs
                </Link>
              </motion.div>

              {/* Social Proof */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: 0.5 }} 
                className="flex flex-wrap items-center gap-6"
              >
                <div className="flex -space-x-2">
                  {['#00F5FF', '#00FF88', '#FFB800', '#8B5CF6', '#FF6B00'].map((color, i) => (
                    <motion.div 
                      key={i} 
                      className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white border-2 border-[#0A0A1B]"
                      style={{ background: `linear-gradient(135deg, ${color}, ${color}80)` }}
                      initial={{ x: -10, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.5 + i * 0.1 }}
                    >
                      {String.fromCharCode(65 + i)}
                    </motion.div>
                  ))}
                </div>
                <div className="text-sm">
                  <span className="text-white font-semibold">+2,847</span>
                  <span className="text-white/40 ml-1">professionnels formés</span>
                </div>
                <div className="flex items-center gap-1">
                  {[1,2,3,4,5].map(i => (
                    <motion.div 
                      key={i} 
                      className="w-4 h-4 text-yellow-400"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.8 + i * 0.05 }}
                    >
                      <Icons.Star />
                    </motion.div>
                  ))}
                  <span className="text-white/40 text-sm ml-1">4.9/5</span>
                </div>
              </motion.div>
            </div>

            {/* Right: Countdown Card */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }} 
              animate={{ opacity: 1, x: 0 }} 
              transition={{ delay: 0.3, type: "spring" }}
            >
              <HoloCard glow="#FF6B00">
                <div className="p-6 sm:p-8">
                  {/* Neural decoration */}
                  <div className="absolute top-4 right-4">
                    <NeuralOrb color="#FF6B00" size="sm" />
                  </div>

                  {/* Countdown */}
                  <div className="text-center mb-6">
                    <motion.div 
                      className="text-7xl sm:text-8xl font-bold bg-gradient-to-br from-[#FF6B00] to-[#FF4444] bg-clip-text text-transparent"
                      animate={{ scale: [1, 1.02, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      {daysLeft}
                    </motion.div>
                    <p className="text-white/40 mt-2">jours avant l'échéance AI Act</p>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-6">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-white/40">Progression vers la deadline</span>
                      <span className="text-[#FF6B00] font-medium">{Math.round(progressPercent)}%</span>
                    </div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                      <motion.div 
                        className="h-full rounded-full relative overflow-hidden"
                        style={{ background: 'linear-gradient(90deg, #FF6B00, #FF4444)' }}
                        initial={{ width: 0 }}
                        animate={{ width: `${progressPercent}%` }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                      >
                        <motion.div 
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                          animate={{ x: ['-100%', '100%'] }}
                          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        />
                      </motion.div>
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { value: '35M€', label: 'Amende maximale', color: '#FF4444' },
                      { value: '7%', label: 'Du CA mondial', color: '#FF6B00' },
                      { value: '100%', label: 'Entreprises concernées', color: '#FFB800' },
                      { value: 'Art. 4', label: 'Formation obligatoire', color: '#00F5FF' },
                    ].map((stat, i) => (
                      <motion.div 
                        key={i} 
                        className="bg-white/5 rounded-xl p-4 text-center border border-white/5 hover:border-white/10 transition-colors"
                        whileHover={{ scale: 1.02 }}
                      >
                        <div className="text-xl font-bold" style={{ color: stat.color }}>{stat.value}</div>
                        <div className="text-xs text-white/30 mt-1">{stat.label}</div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </HoloCard>
            </motion.div>
          </div>
        </div>
      </section>

      {/* TRUSTED BY - With hover effects */}
      <section className="relative z-10 py-12 px-6 border-y border-white/5">
        <div className="max-w-6xl mx-auto">
          <p className="text-center text-white/20 text-sm mb-8 uppercase tracking-widest">Ils nous font confiance</p>
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12">
            {['BNP Paribas', 'Capgemini', 'Orange', 'Société Générale', 'AXA', 'Thales'].map((company, i) => (
              <motion.div 
                key={company} 
                className="text-white/30 hover:text-white/60 font-semibold text-lg transition-colors cursor-default"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                {company}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS - Neural cards */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }} 
            className="text-center mb-12"
          >
            <span className="text-[#00F5FF] text-sm font-medium uppercase tracking-widest">Processus</span>
            <h2 className="text-3xl sm:text-4xl font-bold mt-2 mb-4">Comment ça marche ?</h2>
            <p className="text-white/40 max-w-xl mx-auto">Un parcours simple et efficace pour vous certifier</p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 20 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true }} 
                transition={{ delay: i * 0.1 }}
              >
                <HoloCard glow={step.color}>
                  <div className="p-6 text-center relative">
                    {/* Step number */}
                    <div 
                      className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                      style={{ background: step.color, color: '#0A0A1B' }}
                    >
                      {step.num}
                    </div>
                    
                    {/* Icon */}
                    <div className="text-4xl mb-4 mt-4">{step.icon}</div>
                    
                    <h3 className="text-white font-semibold mb-2">{step.title}</h3>
                    <p className="text-white/40 text-sm">{step.desc}</p>
                    
                    {/* Connection line */}
                    {i < steps.length - 1 && (
                      <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-0.5" style={{ background: `linear-gradient(90deg, ${step.color}, transparent)` }} />
                    )}
                  </div>
                </HoloCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* MODULES */}
      <section id="modules" className="relative z-10 py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }} 
            className="text-center mb-12"
          >
            <span className="text-[#00FF88] text-sm font-medium uppercase tracking-widest">Programme</span>
            <h2 className="text-3xl sm:text-4xl font-bold mt-2 mb-4">6 modules pour tout maîtriser</h2>
            <p className="text-white/40 max-w-xl mx-auto">Un parcours progressif conçu par des experts juridiques et des spécialistes de l'IA</p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map((module, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 20 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true }} 
                transition={{ delay: i * 0.1 }}
              >
                <HoloCard glow={module.color}>
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <motion.div 
                        className="text-4xl"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                      >
                        {module.icon}
                      </motion.div>
                      <span className="text-white/20 text-sm font-medium">Module {module.num}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-3">{module.title}</h3>
                    <div className="flex items-center gap-2 text-white/40 text-sm">
                      <div className="w-4 h-4" style={{ color: module.color }}><Icons.Clock /></div>
                      {module.duration}
                    </div>
                    
                    {/* Progress indicator */}
                    <div className="mt-4 h-1 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full rounded-full w-0" style={{ background: module.color }} />
                    </div>
                  </div>
                </HoloCard>
              </motion.div>
            ))}
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }} 
            className="text-center mt-10"
          >
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link href="/pricing" className="inline-flex items-center gap-2 bg-gradient-to-r from-[#00FF88] to-[#00F5FF] text-black font-bold px-8 py-4 rounded-xl">
                Accéder à la formation
                <div className="w-5 h-5"><Icons.ArrowRight /></div>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* EXPERT SECTION */}
      <section id="formateur" className="relative z-10 py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -30 }} 
              whileInView={{ opacity: 1, x: 0 }} 
              viewport={{ once: true }}
            >
              <HoloCard glow="#8B5CF6">
                <div className="p-8">
                  {/* Expert Image */}
                  <div className="relative mb-6">
                    <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-[#8B5CF6] to-[#00F5FF] flex items-center justify-center text-4xl font-bold text-white">
                      JD
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-lg bg-[#00FF88] flex items-center justify-center">
                      <div className="w-5 h-5 text-black"><Icons.CheckCircle /></div>
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-2">Jean Dupont</h3>
                  <p className="text-[#8B5CF6] font-medium mb-6">Expert Conformité IA & RGPD</p>
                  
                  <div className="space-y-3 text-white/50 text-sm">
                    {[
                      "15 ans d'expérience en conformité réglementaire",
                      "Ancien DPO chez Capgemini et BNP Paribas",
                      "Certifié CIPP/E, CIPM, CIPT (IAPP)",
                      "Intervenant à HEC, Sciences Po et Polytechnique",
                      "Co-auteur du livre \"L'IA et le Droit\" (Dalloz, 2024)",
                    ].map((item, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <div className="w-4 h-4 text-[#8B5CF6] mt-0.5"><Icons.Check /></div>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center gap-3 mt-6">
                    <motion.a 
                      href="#" 
                      className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/40 hover:text-[#0077B5] hover:bg-[#0077B5]/10 transition-colors"
                      whileHover={{ scale: 1.1 }}
                    >
                      <div className="w-5 h-5"><Icons.Linkedin /></div>
                    </motion.a>
                    <motion.a 
                      href="#" 
                      className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/40 hover:text-[#00F5FF] hover:bg-[#00F5FF]/10 transition-colors"
                      whileHover={{ scale: 1.1 }}
                    >
                      <div className="w-5 h-5"><Icons.Mail /></div>
                    </motion.a>
                  </div>
                </div>
              </HoloCard>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 30 }} 
              whileInView={{ opacity: 1, x: 0 }} 
              viewport={{ once: true }}
            >
              <span className="text-[#8B5CF6] text-sm font-medium uppercase tracking-widest">Votre formateur</span>
              <h2 className="text-3xl sm:text-4xl font-bold mt-2 mb-6">Un expert reconnu de la conformité IA</h2>
              <p className="text-white/50 mb-6">
                Fort de 15 années d'expérience dans la conformité réglementaire, Jean Dupont a accompagné plus de 200 entreprises dans leur mise en conformité RGPD et prépare désormais les organisations aux exigences de l'AI Act.
              </p>
              <p className="text-white/50 mb-8">
                Sa méthodologie pratique, enrichie de nombreux cas concrets et de templates prêts à l'emploi, vous permettra de mettre rapidement votre entreprise en conformité.
              </p>

              {/* Credentials */}
              <div className="flex flex-wrap gap-3">
                {['CIPP/E', 'CIPM', 'CIPT', 'ISO 27001'].map(cert => (
                  <motion.span 
                    key={cert} 
                    className="px-4 py-2 rounded-xl bg-[#8B5CF6]/10 border border-[#8B5CF6]/30 text-[#8B5CF6] text-sm font-medium"
                    whileHover={{ scale: 1.05, background: 'rgba(139, 92, 246, 0.2)' }}
                  >
                    {cert}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="temoignages" className="relative z-10 py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }} 
            className="text-center mb-12"
          >
            <span className="text-[#00FF88] text-sm font-medium uppercase tracking-widest">Témoignages</span>
            <h2 className="text-3xl sm:text-4xl font-bold mt-2 mb-4">Ce que disent nos certifiés</h2>
            <p className="text-white/40 max-w-xl mx-auto">Plus de 2,800 professionnels ont suivi notre formation</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 20 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true }} 
                transition={{ delay: i * 0.1 }}
              >
                <HoloCard glow="#00FF88" className="h-full">
                  <div className="p-6 flex flex-col h-full">
                    {/* Stars */}
                    <div className="flex gap-1 mb-4">
                      {Array.from({ length: testimonial.rating }).map((_, j) => (
                        <motion.div 
                          key={j} 
                          className="w-4 h-4 text-yellow-400"
                          initial={{ scale: 0 }}
                          whileInView={{ scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.3 + j * 0.05 }}
                        >
                          <Icons.Star />
                        </motion.div>
                      ))}
                    </div>
                    
                    {/* Quote */}
                    <div className="flex-1">
                      <div className="w-8 h-8 text-[#00FF88]/20 mb-2"><Icons.Quote /></div>
                      <p className="text-white/60 text-sm leading-relaxed">"{testimonial.quote}"</p>
                    </div>

                    {/* Author */}
                    <div className="flex items-center gap-3 mt-6 pt-4 border-t border-white/5">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00FF88] to-[#00F5FF] flex items-center justify-center text-black font-bold text-sm">
                        {testimonial.image}
                      </div>
                      <div>
                        <p className="text-white font-medium text-sm">{testimonial.name}</p>
                        <p className="text-white/30 text-xs">{testimonial.role}, {testimonial.company}</p>
                      </div>
                    </div>
                  </div>
                </HoloCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="tarifs" className="relative z-10 py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }} 
            className="text-center mb-12"
          >
            <span className="text-[#FFB800] text-sm font-medium uppercase tracking-widest">Tarifs</span>
            <h2 className="text-3xl sm:text-4xl font-bold mt-2 mb-4">Choisissez votre formule</h2>
            <p className="text-white/40 max-w-xl mx-auto">Des solutions adaptées à chaque besoin</p>
          </motion.div>

          {/* Guarantee Banner */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }} 
            className="mb-8"
          >
            <div className="bg-[#00FF88]/5 border border-[#00FF88]/20 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-center gap-4 backdrop-blur-sm">
              <motion.div 
                className="w-12 h-12 rounded-full bg-[#00FF88]/10 flex items-center justify-center"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <div className="w-6 h-6 text-[#00FF88]"><Icons.ShieldCheck /></div>
              </motion.div>
              <div className="text-center sm:text-left">
                <p className="text-[#00FF88] font-semibold">Garantie satisfait ou remboursé 30 jours</p>
                <p className="text-white/40 text-sm">Si la formation ne vous convient pas, nous vous remboursons intégralement.</p>
              </div>
            </div>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 items-start">
            {plans.map((plan, i) => (
              <motion.div 
                key={plan.id} 
                initial={{ opacity: 0, y: 20 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true }} 
                transition={{ delay: i * 0.1 }}
                className={plan.popular ? 'lg:-mt-4' : ''}
              >
                <div className="relative">
                  {plan.popular && (
                    <motion.div 
                      className="absolute -top-3 left-1/2 -translate-x-1/2 z-10"
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                    >
                      <span className="bg-gradient-to-r from-[#00FF88] to-[#00F5FF] text-black text-xs font-bold px-4 py-1.5 rounded-full">
                        Le plus populaire
                      </span>
                    </motion.div>
                  )}
                  
                  <HoloCard glow={plan.color}>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                      <p className="text-white/30 text-sm mb-4">{plan.users} utilisateur{parseInt(plan.users) > 1 ? 's' : ''}</p>
                      
                      <div className="mb-6">
                        <span className="text-4xl font-bold" style={{ color: plan.color }}>{plan.price.toLocaleString()}€</span>
                        <span className="text-white/30 ml-2">HT</span>
                      </div>

                      <ul className="space-y-3 mb-6">
                        {plan.features.map((feature, idx) => (
                          <li key={idx} className="flex items-center gap-3 text-white/50 text-sm">
                            <div className="w-4 h-4" style={{ color: plan.color }}><Icons.Check /></div>
                            {feature}
                          </li>
                        ))}
                      </ul>

                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Link 
                          href={`/checkout?plan=${plan.id}`} 
                          className="block w-full py-3 rounded-xl font-semibold text-center transition-all"
                          style={{ 
                            background: plan.popular ? `linear-gradient(135deg, ${plan.color}, ${plan.color}cc)` : 'rgba(255,255,255,0.05)',
                            color: plan.popular ? 'black' : 'white',
                            border: plan.popular ? 'none' : '1px solid rgba(255,255,255,0.1)'
                          }}
                        >
                          {plan.id === 'enterprise' ? 'Nous contacter' : 'Commencer'}
                        </Link>
                      </motion.div>
                    </div>
                  </HoloCard>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* BONUS SECTION - MASSIVE VALUE */}
      <section className="relative z-10 py-20 px-6 overflow-hidden">
        {/* Background glow for emphasis */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#FFB800]/10 blur-[150px] rounded-full" />
        </div>

        <div className="max-w-6xl mx-auto relative">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }} 
            className="text-center mb-12"
          >
            <motion.div 
              className="inline-flex items-center gap-3 bg-gradient-to-r from-[#FFB800]/20 to-[#FF6B00]/20 border border-[#FFB800]/30 rounded-full px-6 py-3 mb-6"
              animate={{ boxShadow: ['0 0 20px rgba(255,184,0,0.2)', '0 0 40px rgba(255,184,0,0.4)', '0 0 20px rgba(255,184,0,0.2)'] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <span className="text-2xl">🎁</span>
              <span className="text-[#FFB800] font-bold">BONUS EXCLUSIFS</span>
              <span className="text-2xl">🎁</span>
            </motion.div>
            
            <h2 className="text-3xl sm:text-5xl font-bold text-white mb-4">
              <motion.span 
                className="bg-gradient-to-r from-[#FFB800] via-[#FF6B00] to-[#FFB800] bg-clip-text text-transparent"
                animate={{ backgroundPosition: ['0%', '100%', '0%'] }}
                transition={{ duration: 5, repeat: Infinity }}
                style={{ backgroundSize: '200%' }}
              >
                847€
              </motion.span>
              {' '}de ressources incluses
            </h2>
            <p className="text-white/50 text-lg max-w-2xl mx-auto">
              Tout ce dont vous avez besoin pour mettre votre entreprise en conformité, <span className="text-[#00FF88] font-semibold">offert avec votre formation</span>
            </p>
          </motion.div>

          {/* Main Value Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { title: "Pack Templates", value: 297, icon: "📋", desc: "12 documents professionnels prêts à l'emploi", color: '#00F5FF', items: ['Registre IA', 'Politique IA', 'EIAI', 'Gouvernance'] },
              { title: "Checklists Complètes", value: 150, icon: "✅", desc: "50+ points de contrôle pour votre conformité", color: '#00FF88', items: ['Audit initial', 'Haut risque', 'Marquage CE', 'Article 4'] },
              { title: "Guides Experts", value: 200, icon: "📚", desc: "Documentation détaillée par nos experts", color: '#8B5CF6', items: ['Guide AI Act', 'Guide Audit', 'Guide Article 4', 'Cas pratiques'] },
              { title: "Communauté VIP", value: 200, icon: "👥", desc: "Accès à vie à notre réseau de certifiés", color: '#FF6B00', items: ['Slack privé', 'Webinaires', 'Updates légaux', 'Networking'] },
            ].map((bonus, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, type: "spring" }}
              >
                <HoloCard glow={bonus.color} className="h-full">
                  <div className="p-5 h-full flex flex-col">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <motion.div 
                        className="text-4xl"
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }}
                      >
                        {bonus.icon}
                      </motion.div>
                      <div className="text-right">
                        <div className="text-xs text-white/30 line-through">Valeur</div>
                        <motion.div 
                          className="text-xl font-bold"
                          style={{ color: bonus.color }}
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                        >
                          {bonus.value}€
                        </motion.div>
                      </div>
                    </div>
                    
                    {/* Title */}
                    <h3 className="text-white font-bold text-lg mb-2">{bonus.title}</h3>
                    <p className="text-white/40 text-sm mb-4 flex-1">{bonus.desc}</p>
                    
                    {/* Items list */}
                    <div className="space-y-1.5">
                      {bonus.items.map((item, j) => (
                        <motion.div 
                          key={j}
                          className="flex items-center gap-2 text-white/50 text-xs"
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.3 + j * 0.1 }}
                        >
                          <div className="w-3 h-3" style={{ color: bonus.color }}><Icons.Check /></div>
                          {item}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </HoloCard>
              </motion.div>
            ))}
          </div>

          {/* All 12 Resources Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <HoloCard glow="#FFB800">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <motion.div 
                      className="w-10 h-10 rounded-xl bg-[#FFB800]/20 flex items-center justify-center"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    >
                      <span className="text-xl">📦</span>
                    </motion.div>
                    <div>
                      <h4 className="text-white font-bold">12 fichiers professionnels</h4>
                      <p className="text-white/40 text-sm">Téléchargeables immédiatement après inscription</p>
                    </div>
                  </div>
                  <div className="hidden sm:flex items-center gap-2 bg-[#00FF88]/10 border border-[#00FF88]/30 rounded-full px-4 py-2">
                    <div className="w-4 h-4 text-[#00FF88]"><Icons.Check /></div>
                    <span className="text-[#00FF88] text-sm font-medium">Inclus dans toutes les formules</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {[
                    { name: "Template Registre IA", type: "Excel", icon: "📊", color: "#00FF88" },
                    { name: "Modèle Politique IA", type: "Word", icon: "📄", color: "#00F5FF" },
                    { name: "Checklist Conformité", type: "Excel", icon: "✅", color: "#FF6B00" },
                    { name: "Template Doc Technique", type: "Word", icon: "📋", color: "#8B5CF6" },
                    { name: "Matrice Risques", type: "Excel", icon: "⚠️", color: "#FF4444" },
                    { name: "Guide AI Act", type: "PDF", icon: "📚", color: "#00F5FF" },
                    { name: "Fiche Référent IA", type: "Word", icon: "👤", color: "#FFB800" },
                    { name: "Plan Audit Type", type: "Excel", icon: "🔍", color: "#00FF88" },
                    { name: "Tableau Conformité", type: "Excel", icon: "📈", color: "#00F5FF" },
                    { name: "Guide Audit", type: "PDF", icon: "📖", color: "#8B5CF6" },
                    { name: "Checklist CE", type: "Excel", icon: "🏷️", color: "#FF4444" },
                    { name: "Exemples Secteurs", type: "PDF", icon: "🏢", color: "#FFB800" },
                  ].map((file, i) => (
                    <motion.div
                      key={i}
                      className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5 hover:border-white/20 hover:bg-white/10 transition-all cursor-default group"
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.03 }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <motion.div 
                        className="text-xl"
                        whileHover={{ scale: 1.2, rotate: 10 }}
                      >
                        {file.icon}
                      </motion.div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-xs font-medium truncate group-hover:text-[#FFB800] transition-colors">{file.name}</p>
                        <p className="text-white/30 text-xs">{file.type}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </HoloCard>
          </motion.div>

          {/* Total Value Banner */}
          <motion.div
            className="mt-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="relative overflow-hidden rounded-2xl">
              {/* Animated gradient background */}
              <motion.div 
                className="absolute inset-0"
                style={{ background: 'linear-gradient(90deg, #FFB800, #FF6B00, #FF4444, #FF6B00, #FFB800)' }}
                animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
                transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
              />
              
              <div className="relative px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4 text-center sm:text-left">
                  <motion.div 
                    className="text-5xl"
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  >
                    💎
                  </motion.div>
                  <div>
                    <p className="text-black/70 text-sm font-medium">Valeur totale des bonus</p>
                    <motion.p 
                      className="text-3xl sm:text-4xl font-black text-black"
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      847€ → OFFERTS
                    </motion.p>
                  </div>
                </div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link 
                    href="/pricing" 
                    className="inline-flex items-center gap-2 bg-black text-white font-bold px-8 py-4 rounded-xl hover:bg-black/80 transition-colors"
                  >
                    Obtenir les bonus
                    <div className="w-5 h-5"><Icons.ArrowRight /></div>
                  </Link>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="relative z-10 py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }} 
            className="text-center mb-12"
          >
            <span className="text-[#00F5FF] text-sm font-medium uppercase tracking-widest">FAQ</span>
            <h2 className="text-3xl sm:text-4xl font-bold mt-2">Questions fréquentes</h2>
          </motion.div>

          <div className="space-y-4">
            {[
              { q: "Qui est concerné par l'AI Act ?", a: "Toute entreprise qui développe, déploie ou utilise des systèmes d'IA dans l'Union Européenne est concernée. L'Article 4 impose une obligation de formation pour toutes les personnes impliquées." },
              { q: "La formation est-elle certifiante ?", a: "Oui, vous recevez un certificat officiel attestant de votre formation conformément à l'Article 4 de l'AI Act. Ce certificat est vérifiable en ligne avec un QR code unique." },
              { q: "Combien de temps dure la formation ?", a: "La formation complète représente environ 8 heures de contenu réparties en 6 modules. Vous pouvez la suivre à votre rythme sur 12 mois." },
              { q: "Puis-je faire financer la formation ?", a: "Oui, notre formation est éligible au financement par votre OPCO ou votre budget formation entreprise. Contactez-nous pour obtenir un devis." },
              { q: "Y a-t-il une garantie ?", a: "Oui, nous offrons une garantie satisfait ou remboursé de 30 jours. Si la formation ne vous convient pas, nous vous remboursons intégralement, sans condition." },
            ].map((faq, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 10 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true }} 
                transition={{ delay: i * 0.05 }}
              >
                <details className="group">
                  <summary className="flex items-center justify-between p-5 bg-white/5 hover:bg-white/[0.07] rounded-xl border border-white/5 cursor-pointer list-none transition-colors">
                    <span className="text-white font-medium pr-4">{faq.q}</span>
                    <motion.span 
                      className="text-[#00F5FF] text-xl font-light"
                      whileHover={{ scale: 1.2 }}
                    >
                      +
                    </motion.span>
                  </summary>
                  <div className="px-5 py-4 text-white/50 text-sm bg-white/[0.02] rounded-b-xl -mt-2 border-x border-b border-white/5">
                    {faq.a}
                  </div>
                </details>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} 
            whileInView={{ opacity: 1, scale: 1 }} 
            viewport={{ once: true }}
          >
            <HoloCard glow="#FF6B00">
              <div className="p-8 sm:p-12 text-center relative overflow-hidden">
                {/* Background animation */}
                <motion.div 
                  className="absolute inset-0 opacity-30"
                  style={{ background: 'radial-gradient(circle at 50% 50%, #FF6B0030, transparent 70%)' }}
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 4, repeat: Infinity }}
                />
                
                <div className="relative">
                  <motion.div 
                    className="w-16 h-16 rounded-2xl bg-[#FF6B00]/20 flex items-center justify-center mx-auto mb-6"
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 4, repeat: Infinity }}
                  >
                    <div className="w-8 h-8 text-[#FF6B00]"><Icons.AlertTriangle /></div>
                  </motion.div>
                  
                  <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                    Plus que <motion.span 
                      className="text-[#FF6B00]"
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      {daysLeft} jours
                    </motion.span> pour vous mettre en conformité
                  </h2>
                  <p className="text-white/40 mb-8 max-w-xl mx-auto">
                    Ne risquez pas une amende de 35M€. Formez vos équipes dès maintenant et obtenez votre certificat de conformité.
                  </p>
                  
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Link href="/pricing" className="inline-flex items-center gap-2 bg-gradient-to-r from-[#FF6B00] to-[#FF4444] text-white font-bold px-8 py-4 rounded-xl">
                      Démarrer ma formation
                      <motion.div 
                        className="w-5 h-5"
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <Icons.ArrowRight />
                      </motion.div>
                    </Link>
                  </motion.div>
                </div>
              </div>
            </HoloCard>
          </motion.div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="relative z-10 py-16 px-6 border-t border-white/5">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-xl font-bold text-white mb-4">Une question ?</h3>
          <p className="text-white/40 mb-6">Notre équipe est disponible pour vous aider</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <motion.a 
              href="mailto:contact@formation-ia-act.fr" 
              className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 px-6 py-3 rounded-xl transition-colors"
              whileHover={{ scale: 1.02 }}
            >
              <div className="w-5 h-5 text-[#00F5FF]"><Icons.Mail /></div>
              contact@formation-ia-act.fr
            </motion.a>
            <motion.a 
              href="https://calendly.com/formation-ia-act" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center gap-2 bg-gradient-to-r from-[#00F5FF] to-[#0066FF] text-white font-semibold px-6 py-3 rounded-xl"
              whileHover={{ scale: 1.02 }}
            >
              <div className="w-5 h-5"><Icons.Calendar /></div>
              Réserver un appel
            </motion.a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-12 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-[#00F5FF] to-[#0066FF] rounded-lg flex items-center justify-center">
                  <div className="w-4 h-4 text-white"><Icons.Shield /></div>
                </div>
                <span className="font-semibold">Formation-IA-Act.fr</span>
              </div>
              <p className="text-white/30 text-sm">La première formation certifiante sur le règlement européen AI Act.</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Formation</h4>
              <ul className="space-y-2 text-sm text-white/30">
                <li><a href="#modules" className="hover:text-white transition-colors">Modules</a></li>
                <li><a href="#tarifs" className="hover:text-white transition-colors">Tarifs</a></li>
                <li><a href="#formateur" className="hover:text-white transition-colors">Formateur</a></li>
                <li><a href="#faq" className="hover:text-white transition-colors">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Légal</h4>
              <ul className="space-y-2 text-sm text-white/30">
                <li><Link href="/mentions-legales" className="hover:text-white transition-colors">Mentions légales</Link></li>
                <li><Link href="/cgv" className="hover:text-white transition-colors">CGV</Link></li>
                <li><Link href="/confidentialite" className="hover:text-white transition-colors">Politique de confidentialité</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-sm text-white/30">
                <li><a href="mailto:contact@formation-ia-act.fr" className="hover:text-white transition-colors">contact@formation-ia-act.fr</a></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Formulaire de contact</Link></li>
              </ul>
            </div>
          </div>
          
          {/* Payment & Trust */}
          <div className="flex flex-wrap items-center justify-center gap-6 py-6 border-t border-white/5 mb-6">
            {[
              { icon: Icons.ShieldCheck, text: 'Paiement sécurisé Stripe', color: '#00FF88' },
              { icon: Icons.CheckCircle, text: 'Certificat vérifiable', color: '#00F5FF' },
              { icon: Icons.Award, text: 'Garantie 30 jours', color: '#FFB800' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-white/30 text-sm">
                <div className="w-4 h-4" style={{ color: item.color }}><item.icon /></div>
                {item.text}
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-white/20">
            <p>© 2024 Formation-IA-Act.fr. Tous droits réservés.</p>
            <p>Organisme de formation n° 12345678901</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
