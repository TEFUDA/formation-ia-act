'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

// Icons
const Icons = {
  Shield: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  Check: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-full h-full"><polyline points="20 6 9 17 4 12"/></svg>,
  ArrowRight: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
  Download: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
  AlertTriangle: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  Phone: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>,
  Calendar: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  Users: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
};

// Neural Background
const NeuralBackground = () => (
  <div className="fixed inset-0 pointer-events-none overflow-hidden">
    <div className="absolute inset-0 bg-[#030014]" />
    <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-[#FF4444]/10 blur-[120px] rounded-full" />
    <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[#8B5CF6]/8 blur-[100px] rounded-full" />
  </div>
);

// HoloCard
const HoloCard = ({ children, glow = '#8B5CF6', className = '' }: { children: React.ReactNode, glow?: string, className?: string }) => (
  <div className={`relative group ${className}`}>
    <div 
      className="absolute -inset-[1px] rounded-2xl opacity-50"
      style={{ background: `linear-gradient(135deg, ${glow}40, transparent 50%, ${glow}40)` }}
    />
    <div className="relative bg-[#0A0A1B]/90 backdrop-blur-xl rounded-2xl border border-white/5 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent" />
      <div className="relative">{children}</div>
    </div>
  </div>
);

// Score interpretation
const getScoreData = (score: number) => {
  if (score <= 30) {
    return {
      level: 'Critique',
      color: '#FF4444',
      emoji: '🚨',
      description: 'Votre entreprise présente des risques majeurs de non-conformité. Une action immédiate est nécessaire pour éviter les sanctions.',
      recommendation: 'accompagnement',
    };
  } else if (score <= 50) {
    return {
      level: 'Élevé',
      color: '#FF6B00',
      emoji: '⚠️',
      description: 'Des lacunes significatives ont été identifiées. Un accompagnement expert est fortement recommandé pour sécuriser votre mise en conformité.',
      recommendation: 'accompagnement',
    };
  } else if (score <= 70) {
    return {
      level: 'Modéré',
      color: '#FFB800',
      emoji: '🔶',
      description: 'Vous avez de bonnes bases mais des améliorations sont nécessaires. Formation et templates vous permettront de finaliser votre conformité.',
      recommendation: 'formation',
    };
  } else if (score <= 85) {
    return {
      level: 'Faible',
      color: '#00FF88',
      emoji: '✅',
      description: 'Bonne progression ! Quelques ajustements mineurs et vous serez pleinement conforme.',
      recommendation: 'templates',
    };
  } else {
    return {
      level: 'Conforme',
      color: '#00F5FF',
      emoji: '🏆',
      description: 'Félicitations ! Votre entreprise est bien préparée pour l\'AI Act. Maintenez cette conformité avec une veille régulière.',
      recommendation: 'veille',
    };
  }
};

export default function AuditResultsPage() {
  const searchParams = useSearchParams();
  
  // Simulated score - in production, this would come from the audit completion
  const [score, setScore] = useState(47);
  const [animatedScore, setAnimatedScore] = useState(0);
  
  // Get score from URL or default
  useEffect(() => {
    const urlScore = searchParams.get('score');
    if (urlScore) {
      setScore(parseInt(urlScore));
    }
  }, [searchParams]);

  // Animate score
  useEffect(() => {
    const timer = setTimeout(() => {
      if (animatedScore < score) {
        setAnimatedScore(prev => Math.min(prev + 1, score));
      }
    }, 30);
    return () => clearTimeout(timer);
  }, [animatedScore, score]);

  const scoreData = getScoreData(score);
  const isHighRisk = score <= 50;

  // Sample findings based on score
  const findings = [
    { area: 'Identification des systèmes IA', score: Math.min(score + 15, 100), status: score + 15 > 60 ? 'ok' : 'warning' },
    { area: 'Classification des risques', score: Math.max(score - 10, 10), status: score - 10 > 50 ? 'ok' : 'critical' },
    { area: 'Gouvernance IA', score: Math.max(score - 5, 15), status: score - 5 > 50 ? 'ok' : 'warning' },
    { area: 'Documentation technique', score: Math.max(score - 15, 10), status: score - 15 > 50 ? 'ok' : 'critical' },
    { area: 'Formation des équipes', score: Math.min(score + 5, 95), status: score + 5 > 60 ? 'ok' : 'warning' },
    { area: 'Processus de conformité', score: score, status: score > 50 ? 'ok' : 'warning' },
  ];

  return (
    <div className="min-h-screen bg-[#030014] text-white">
      <NeuralBackground />

      {/* Header */}
      <header className="relative z-40 px-6 py-4 border-b border-white/5">
        <div className="max-w-4xl mx-auto flex items-center justify-center">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#00F5FF] to-[#0066FF] rounded-xl flex items-center justify-center">
              <div className="w-5 h-5 text-white"><Icons.Shield /></div>
            </div>
            <span className="font-bold text-lg">Formation-IA-Act.fr</span>
          </Link>
        </div>
      </header>

      <main className="relative z-10 px-6 py-12">
        <div className="max-w-4xl mx-auto">
          
          {/* Score Display */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center mb-12"
          >
            <h1 className="text-2xl font-bold text-white mb-6">Résultats de votre audit AI Act</h1>
            
            <HoloCard glow={scoreData.color}>
              <div className="p-8">
                <div className="flex flex-col lg:flex-row items-center gap-8">
                  {/* Score Circle */}
                  <div className="relative">
                    <svg className="w-48 h-48 transform -rotate-90">
                      <circle
                        cx="96"
                        cy="96"
                        r="88"
                        stroke="rgba(255,255,255,0.1)"
                        strokeWidth="12"
                        fill="none"
                      />
                      <motion.circle
                        cx="96"
                        cy="96"
                        r="88"
                        stroke={scoreData.color}
                        strokeWidth="12"
                        fill="none"
                        strokeLinecap="round"
                        strokeDasharray={553}
                        initial={{ strokeDashoffset: 553 }}
                        animate={{ strokeDashoffset: 553 - (553 * animatedScore) / 100 }}
                        transition={{ duration: 2, ease: "easeOut" }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <motion.span 
                        className="text-5xl font-bold"
                        style={{ color: scoreData.color }}
                      >
                        {animatedScore}%
                      </motion.span>
                      <span className="text-white/40 text-sm">Score global</span>
                    </div>
                  </div>

                  {/* Score Info */}
                  <div className="flex-1 text-center lg:text-left">
                    <div className="flex items-center justify-center lg:justify-start gap-3 mb-4">
                      <span className="text-4xl">{scoreData.emoji}</span>
                      <div>
                        <h2 className="text-2xl font-bold" style={{ color: scoreData.color }}>
                          Risque {scoreData.level}
                        </h2>
                      </div>
                    </div>
                    <p className="text-white/60 mb-6">{scoreData.description}</p>
                    
                    {/* Download Report */}
                    <motion.a
                      href="/api/audit/report" // À configurer
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl transition-colors"
                    >
                      <div className="w-5 h-5"><Icons.Download /></div>
                      Télécharger le rapport complet (PDF)
                    </motion.a>
                  </div>
                </div>
              </div>
            </HoloCard>
          </motion.div>

          {/* Findings Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-12"
          >
            <h2 className="text-xl font-bold text-white mb-6">📊 Détail par domaine</h2>
            
            <HoloCard glow="#00F5FF">
              <div className="p-6">
                <div className="space-y-4">
                  {findings.map((finding, i) => (
                    <div key={i}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className={finding.status === 'critical' ? 'text-[#FF4444]' : finding.status === 'warning' ? 'text-[#FFB800]' : 'text-[#00FF88]'}>
                            {finding.status === 'critical' ? '🔴' : finding.status === 'warning' ? '🟠' : '🟢'}
                          </span>
                          <span className="text-white/70 text-sm">{finding.area}</span>
                        </div>
                        <span className="font-semibold text-white">{finding.score}%</span>
                      </div>
                      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <motion.div 
                          className="h-full rounded-full"
                          style={{ 
                            background: finding.status === 'critical' ? '#FF4444' : finding.status === 'warning' ? '#FFB800' : '#00FF88'
                          }}
                          initial={{ width: 0 }}
                          animate={{ width: `${finding.score}%` }}
                          transition={{ duration: 1, delay: 0.5 + i * 0.1 }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </HoloCard>
          </motion.div>

          {/* Recommendations - 3 Options */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-12"
          >
            <h2 className="text-xl font-bold text-white mb-2">💡 Nos recommandations</h2>
            <p className="text-white/50 mb-6">
              {isHighRisk 
                ? "Au vu de votre score, nous vous recommandons un accompagnement expert pour accélérer votre mise en conformité."
                : "Voici les options pour finaliser votre conformité AI Act."}
            </p>

            <div className="space-y-4">
              {/* Option 1: Autonome (Formation + Templates) */}
              <HoloCard glow={isHighRisk ? "#00F5FF" : "#00FF88"}>
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl">🎓</span>
                        <h3 className="text-lg font-bold text-white">Option 1 : Je me forme</h3>
                        {!isHighRisk && (
                          <span className="bg-[#00FF88]/20 text-[#00FF88] text-xs font-bold px-2 py-0.5 rounded-full ml-2">
                            RECOMMANDÉ
                          </span>
                        )}
                      </div>
                      <p className="text-white/60 text-sm mb-4">
                        Formation complète + Templates pour une mise en conformité autonome. Idéal si vous avez le temps et les ressources en interne.
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {['Formation 6 modules', 'Certificat officiel', '12 templates', 'Support inclus'].map((item, i) => (
                          <span key={i} className="text-xs bg-white/5 text-white/60 px-2 py-1 rounded">
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="lg:text-right">
                      <div className="text-2xl font-bold text-[#00FF88] mb-2">799€</div>
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Link
                          href="/templates"
                          className="inline-flex items-center gap-2 bg-[#00FF88]/20 text-[#00FF88] font-semibold px-5 py-2.5 rounded-xl hover:bg-[#00FF88]/30 transition-colors"
                        >
                          Voir le Bundle
                          <div className="w-4 h-4"><Icons.ArrowRight /></div>
                        </Link>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </HoloCard>

              {/* Option 2: Accompagnement (High-ticket) */}
              <HoloCard glow={isHighRisk ? "#FF6B00" : "#8B5CF6"}>
                <div className="p-6">
                  {isHighRisk && (
                    <div className="absolute -top-3 left-6">
                      <span className="bg-gradient-to-r from-[#FF6B00] to-[#FF4444] text-white text-xs font-bold px-4 py-1 rounded-full">
                        ⭐ RECOMMANDÉ POUR VOTRE PROFIL
                      </span>
                    </div>
                  )}
                  <div className="flex flex-col lg:flex-row lg:items-center gap-6 pt-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl">🤝</span>
                        <h3 className="text-lg font-bold text-white">Option 2 : Je me fais accompagner</h3>
                      </div>
                      <p className="text-white/60 text-sm mb-4">
                        Un expert conformité vous accompagne pas à pas dans votre mise en conformité. Audit approfondi, plan d'action personnalisé et suivi régulier.
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {['Consultant dédié', 'Audit sur-mesure', 'Plan d\'action', 'Suivi 6 mois', 'Rapport de conformité'].map((item, i) => (
                          <span key={i} className="text-xs bg-white/5 text-white/60 px-2 py-1 rounded">
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="lg:text-right">
                      <div className="text-white/40 text-sm">À partir de</div>
                      <div className="text-2xl font-bold text-[#FF6B00] mb-2">5 000€</div>
                      <motion.a
                        href="https://calendly.com/formation-ia-act/accompagnement" // À configurer
                        target="_blank"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`inline-flex items-center gap-2 font-semibold px-5 py-2.5 rounded-xl transition-colors ${
                          isHighRisk 
                            ? 'bg-gradient-to-r from-[#FF6B00] to-[#FF4444] text-white' 
                            : 'bg-[#8B5CF6]/20 text-[#8B5CF6] hover:bg-[#8B5CF6]/30'
                        }`}
                      >
                        <div className="w-4 h-4"><Icons.Calendar /></div>
                        Prendre RDV
                      </motion.a>
                    </div>
                  </div>
                </div>
              </HoloCard>

              {/* Option 3: DPO Externalisé */}
              <HoloCard glow="#8B5CF6">
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl">🛡️</span>
                        <h3 className="text-lg font-bold text-white">Option 3 : Je délègue tout</h3>
                      </div>
                      <p className="text-white/60 text-sm mb-4">
                        Confiez-nous la gestion complète de votre conformité IA. DPO externalisé dédié, veille réglementaire et mise à jour continue.
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {['DPO dédié', 'Gestion complète', 'Veille réglementaire', 'Audits périodiques', 'Rapports mensuels'].map((item, i) => (
                          <span key={i} className="text-xs bg-white/5 text-white/60 px-2 py-1 rounded">
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="lg:text-right">
                      <div className="text-white/40 text-sm">À partir de</div>
                      <div className="text-2xl font-bold text-[#8B5CF6] mb-1">500€<span className="text-base font-normal text-white/40">/mois</span></div>
                      <motion.a
                        href="https://calendly.com/formation-ia-act/dpo-externalise" // À configurer
                        target="_blank"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="inline-flex items-center gap-2 bg-[#8B5CF6]/20 text-[#8B5CF6] font-semibold px-5 py-2.5 rounded-xl hover:bg-[#8B5CF6]/30 transition-colors"
                      >
                        <div className="w-4 h-4"><Icons.Phone /></div>
                        Être rappelé
                      </motion.a>
                    </div>
                  </div>
                </div>
              </HoloCard>
            </div>
          </motion.div>

          {/* Urgency Reminder (for high risk) */}
          {isHighRisk && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="mb-12"
            >
              <HoloCard glow="#FF4444">
                <div className="p-6 flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#FF4444]/20 flex items-center justify-center flex-shrink-0">
                    <div className="w-6 h-6 text-[#FF4444]"><Icons.AlertTriangle /></div>
                  </div>
                  <div>
                    <h3 className="text-white font-bold mb-2">⚠️ Attention : Deadline approche</h3>
                    <p className="text-white/60 text-sm">
                      L'AI Act entre pleinement en application en <strong className="text-white">août 2026</strong>. 
                      Avec un score de <strong className="text-[#FF4444]">{score}%</strong>, vous avez besoin de plusieurs mois pour vous mettre en conformité.
                      <br /><br />
                      Les entreprises non conformes s'exposent à des amendes jusqu'à <strong className="text-white">35 millions d'euros</strong> ou <strong className="text-white">7% du CA mondial</strong>.
                    </p>
                  </div>
                </div>
              </HoloCard>
            </motion.div>
          )}

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link 
              href="/dashboard"
              className="text-white/40 hover:text-white text-sm transition-colors"
            >
              ← Retour au dashboard
            </Link>
            <span className="text-white/20 hidden sm:inline">|</span>
            <Link 
              href="/audit"
              className="text-white/40 hover:text-white text-sm transition-colors"
            >
              Refaire l'audit
            </Link>
          </motion.div>

        </div>
      </main>

      {/* Contact Footer */}
      <footer className="relative z-10 py-8 px-6 border-t border-white/5 mt-12">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-white/40 text-sm mb-2">
            Des questions sur vos résultats ?
          </p>
          <a 
            href="mailto:contact@formation-ia-act.fr" 
            className="text-[#00F5FF] hover:underline"
          >
            contact@formation-ia-act.fr
          </a>
        </div>
      </footer>
    </div>
  );
}
