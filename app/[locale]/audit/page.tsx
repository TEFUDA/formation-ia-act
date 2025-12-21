'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

// Icons
const Icons = {
  Shield: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  Check: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-full h-full"><polyline points="20 6 9 17 4 12"/></svg>,
  ArrowRight: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
  ArrowLeft: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>,
  Search: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  FileText: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
  BarChart: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/></svg>,
  Users: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  Clock: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  Zap: () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  AlertTriangle: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  Building: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01M16 6h.01M12 6h.01M12 10h.01M12 14h.01M16 10h.01M16 14h.01M8 10h.01M8 14h.01"/></svg>,
};

// Audit plans
const auditPlans = [
  {
    id: 'starter',
    name: 'Starter',
    tagline: 'PME & Startups',
    price: 499,
    color: '#00F5FF',
    icon: '🏢',
    description: 'Idéal pour les petites structures souhaitant un premier diagnostic rapide.',
    features: [
      '30 questions d\'analyse',
      'Score de conformité global',
      'Rapport PDF 15 pages',
      'Identification des risques majeurs',
      'Plan d\'action simplifié',
      'Support email',
    ],
    notIncluded: [
      'Analyse par département',
      'Recommandations détaillées',
      'Call de restitution',
    ],
    cta: 'Commencer l\'audit',
    stripeLink: 'https://buy.stripe.com/AUDIT_STARTER', // À remplacer
  },
  {
    id: 'pro',
    name: 'Pro',
    tagline: 'ETI & Grandes PME',
    price: 999,
    color: '#00FF88',
    icon: '🏛️',
    popular: true,
    description: 'Analyse complète avec recommandations personnalisées et call de restitution.',
    features: [
      '50 questions d\'analyse',
      'Score par domaine (5 axes)',
      'Rapport PDF 30 pages',
      'Analyse détaillée des risques',
      'Plan d\'action détaillé',
      'Recommandations personnalisées',
      'Call de restitution 30 min',
      'Support prioritaire',
    ],
    notIncluded: [
      'Audit multi-sites',
    ],
    cta: 'Choisir Pro',
    stripeLink: 'https://buy.stripe.com/AUDIT_PRO', // À remplacer
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    tagline: 'Grands Groupes',
    price: 2999,
    color: '#8B5CF6',
    icon: '🌐',
    description: 'Audit approfondi multi-sites avec accompagnement dédié.',
    features: [
      '80+ questions d\'analyse',
      'Score par entité/département',
      'Rapport PDF 50+ pages',
      'Cartographie complète des risques',
      'Plan d\'action par priorité',
      'Benchmarks sectoriels',
      'Audit multi-sites (jusqu\'à 5)',
      'Call de restitution 1h + workshop',
      'Account manager dédié',
      'Suivi trimestriel',
    ],
    notIncluded: [],
    cta: 'Demander un devis',
    stripeLink: 'https://buy.stripe.com/AUDIT_ENTERPRISE', // À remplacer
  },
];

// What's analyzed
const analysisAreas = [
  { icon: '📋', title: 'Identification', desc: 'Inventaire de vos systèmes IA', color: '#00F5FF' },
  { icon: '⚠️', title: 'Classification', desc: 'Niveau de risque par système', color: '#FF6B00' },
  { icon: '🏛️', title: 'Gouvernance', desc: 'Organisation et responsabilités', color: '#00FF88' },
  { icon: '📄', title: 'Documentation', desc: 'État de votre documentation', color: '#8B5CF6' },
  { icon: '🎓', title: 'Formation', desc: 'Compétences de vos équipes', color: '#FFB800' },
  { icon: '✅', title: 'Conformité', desc: 'Respect des obligations légales', color: '#FF4444' },
];

// Neural Background
const NeuralBackground = () => (
  <div className="fixed inset-0 pointer-events-none overflow-hidden">
    <div className="absolute inset-0 bg-[#030014]" />
    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#8B5CF6]/8 blur-[120px] rounded-full" />
    <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#00FF88]/6 blur-[100px] rounded-full" />
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#00F5FF]/4 blur-[150px] rounded-full" />
    <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: 'linear-gradient(rgba(139, 92, 246, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(139, 92, 246, 0.3) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
  </div>
);

// HoloCard
const HoloCard = ({ children, glow = '#8B5CF6', className = '', active = false }: { children: React.ReactNode, glow?: string, className?: string, active?: boolean }) => (
  <div className={`relative group ${className}`}>
    <div 
      className={`absolute -inset-[1px] rounded-2xl transition-opacity ${active ? 'opacity-100' : 'opacity-30 group-hover:opacity-60'}`}
      style={{ background: `linear-gradient(135deg, ${glow}40, transparent 50%, ${glow}40)` }}
    />
    <div className="relative bg-[#0A0A1B]/90 backdrop-blur-xl rounded-2xl border border-white/5 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent" />
      <div className="relative">{children}</div>
    </div>
  </div>
);

export default function AuditPage() {
  const [selectedPlan, setSelectedPlan] = useState<string>('pro');

  return (
    <div className="min-h-screen bg-[#030014] text-white">
      <NeuralBackground />

      {/* Header */}
      <header className="relative z-40 px-6 py-4 border-b border-white/5">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#00F5FF] to-[#0066FF] rounded-xl flex items-center justify-center">
              <div className="w-5 h-5 text-white"><Icons.Shield /></div>
            </div>
            <span className="font-bold text-lg hidden sm:block">Formation-IA-Act.fr</span>
          </Link>

          <div className="flex items-center gap-4">
            <Link href="/" className="text-white/60 hover:text-white text-sm transition-colors flex items-center gap-2">
              <div className="w-4 h-4"><Icons.ArrowLeft /></div>
              <span className="hidden sm:inline">Retour</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="relative z-10 px-6 py-12">
        <div className="max-w-6xl mx-auto">
          
          {/* Hero */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 bg-[#8B5CF6]/10 border border-[#8B5CF6]/30 rounded-full px-4 py-2 mb-6">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                🔍
              </motion.div>
              <span className="text-[#8B5CF6] text-sm font-medium">Audit automatisé en 15 minutes</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">
              <span className="text-white">Êtes-vous vraiment</span>
              <br />
              <span className="bg-gradient-to-r from-[#8B5CF6] to-[#FF00E5] bg-clip-text text-transparent">conforme à l'AI Act ?</span>
            </h1>
            
            <p className="text-white/60 text-lg max-w-2xl mx-auto mb-8">
              Notre audit automatisé analyse votre situation en profondeur et génère un rapport personnalisé avec un plan d'action concret.
            </p>

            {/* Key metrics */}
            <div className="flex flex-wrap items-center justify-center gap-8 text-sm">
              {[
                { value: "15 min", label: "Temps de réponse" },
                { value: "30+", label: "Pages de rapport" },
                { value: "6 axes", label: "D'analyse" },
                { value: "100%", label: "Personnalisé" },
              ].map((metric, i) => (
                <div key={i} className="text-center">
                  <p className="text-2xl font-bold text-white">{metric.value}</p>
                  <p className="text-white/40 text-xs">{metric.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* What's analyzed */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-16"
          >
            <h2 className="text-2xl font-bold text-white mb-8 text-center">Ce que nous analysons</h2>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {analysisAreas.map((area, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * i }}
                >
                  <HoloCard glow={area.color}>
                    <div className="p-5 flex items-center gap-4">
                      <div 
                        className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                        style={{ background: `${area.color}15` }}
                      >
                        {area.icon}
                      </div>
                      <div>
                        <h3 className="text-white font-semibold">{area.title}</h3>
                        <p className="text-white/50 text-sm">{area.desc}</p>
                      </div>
                    </div>
                  </HoloCard>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Pricing Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-16"
          >
            <h2 className="text-2xl font-bold text-white mb-8 text-center">Choisissez votre formule</h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              {auditPlans.map((plan, index) => (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <HoloCard 
                    glow={plan.color} 
                    active={selectedPlan === plan.id}
                    className={plan.popular ? 'ring-2 ring-[#00FF88]/50' : ''}
                  >
                    <div className="p-6">
                      {/* Badge */}
                      {plan.popular && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                          <span className="bg-[#00FF88] text-black text-xs font-bold px-4 py-1 rounded-full">
                            RECOMMANDÉ
                          </span>
                        </div>
                      )}

                      {/* Header */}
                      <div className="text-center mb-6 pt-2">
                        <span className="text-4xl mb-3 block">{plan.icon}</span>
                        <h3 className="text-xl font-bold text-white mb-1">{plan.name}</h3>
                        <p className="text-white/40 text-sm">{plan.tagline}</p>
                      </div>

                      {/* Price */}
                      <div className="text-center mb-6">
                        <div className="flex items-baseline justify-center gap-1">
                          <span className="text-4xl font-bold" style={{ color: plan.color }}>{plan.price.toLocaleString()}</span>
                          <span className="text-white/40">€ HT</span>
                        </div>
                        <p className="text-white/30 text-xs mt-1">Paiement unique</p>
                      </div>

                      {/* Features */}
                      <div className="space-y-2 mb-4">
                        {plan.features.map((feature, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: `${plan.color}20` }}>
                              <div className="w-2.5 h-2.5" style={{ color: plan.color }}><Icons.Check /></div>
                            </div>
                            <span className="text-white/70 text-sm">{feature}</span>
                          </div>
                        ))}
                      </div>

                      {/* Not included */}
                      {plan.notIncluded.length > 0 && (
                        <div className="space-y-2 mb-6 pt-4 border-t border-white/5">
                          {plan.notIncluded.map((item, i) => (
                            <div key={i} className="flex items-center gap-2">
                              <span className="text-white/20 text-sm">✕</span>
                              <span className="text-white/30 text-sm">{item}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* CTA */}
                      <motion.a
                        href={plan.stripeLink}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="block w-full py-4 rounded-xl font-bold text-center transition-all"
                        style={{ 
                          background: selectedPlan === plan.id ? plan.color : 'rgba(255,255,255,0.05)',
                          color: selectedPlan === plan.id ? '#000' : plan.color,
                          border: `1px solid ${plan.color}30`
                        }}
                        onClick={() => setSelectedPlan(plan.id)}
                      >
                        {plan.cta}
                      </motion.a>
                    </div>
                  </HoloCard>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* How it works */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-16"
          >
            <HoloCard glow="#00F5FF">
              <div className="p-8">
                <h2 className="text-2xl font-bold text-white mb-8 text-center">Comment ça fonctionne</h2>
                
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    { num: 1, title: "Répondez aux questions", desc: "30 à 80 questions selon votre formule, en 15-30 minutes", icon: "📝" },
                    { num: 2, title: "Analyse automatique", desc: "Notre algorithme analyse vos réponses et calcule vos scores", icon: "🤖" },
                    { num: 3, title: "Rapport généré", desc: "Recevez un rapport PDF personnalisé de 15 à 50 pages", icon: "📄" },
                    { num: 4, title: "Passez à l'action", desc: "Suivez le plan d'action priorisé pour vous mettre en conformité", icon: "🚀" },
                  ].map((step) => (
                    <div key={step.num} className="text-center">
                      <div className="w-16 h-16 rounded-2xl bg-[#00F5FF]/10 flex items-center justify-center text-3xl mx-auto mb-4">
                        {step.icon}
                      </div>
                      <div className="w-8 h-8 rounded-full bg-[#00F5FF] text-black font-bold flex items-center justify-center mx-auto mb-3">
                        {step.num}
                      </div>
                      <h3 className="text-white font-semibold mb-2">{step.title}</h3>
                      <p className="text-white/50 text-sm">{step.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </HoloCard>
          </motion.div>

          {/* Sample Report Preview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-16"
          >
            <HoloCard glow="#8B5CF6">
              <div className="p-8">
                <div className="flex flex-col lg:flex-row gap-8 items-center">
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-white mb-4">📊 Exemple de rapport</h2>
                    <p className="text-white/60 mb-6">
                      Chaque rapport inclut un score global, des scores par domaine, l'identification des risques prioritaires et un plan d'action détaillé.
                    </p>
                    
                    <div className="space-y-4">
                      {[
                        { label: "Score global de conformité", value: "47%", color: "#FF6B00" },
                        { label: "Identification des systèmes", value: "65%", color: "#00FF88" },
                        { label: "Classification des risques", value: "42%", color: "#FFB800" },
                        { label: "Gouvernance IA", value: "38%", color: "#FF4444" },
                        { label: "Documentation", value: "52%", color: "#00F5FF" },
                      ].map((item, i) => (
                        <div key={i}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-white/60">{item.label}</span>
                            <span className="font-semibold" style={{ color: item.color }}>{item.value}</span>
                          </div>
                          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                            <motion.div 
                              className="h-full rounded-full"
                              style={{ background: item.color }}
                              initial={{ width: 0 }}
                              animate={{ width: item.value }}
                              transition={{ duration: 1, delay: 0.5 + i * 0.1 }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="lg:w-80 flex-shrink-0">
                    <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                      <div className="text-center mb-6">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#FF6B00] to-[#FF4444] flex items-center justify-center mx-auto mb-4">
                          <span className="text-3xl font-bold text-white">47%</span>
                        </div>
                        <h3 className="text-white font-bold text-lg">Risque Élevé</h3>
                        <p className="text-white/40 text-sm">Action urgente recommandée</p>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-[#FF4444]">⚠️</span>
                          <span className="text-white/70">3 risques critiques identifiés</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-[#FFB800]">📋</span>
                          <span className="text-white/70">12 actions recommandées</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-[#00FF88]">✅</span>
                          <span className="text-white/70">4 points de conformité OK</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </HoloCard>
          </motion.div>

          {/* FAQ */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mb-16"
          >
            <h2 className="text-2xl font-bold text-white mb-8 text-center">Questions fréquentes</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              {[
                { 
                  q: "Combien de temps dure l'audit ?", 
                  a: "Entre 15 et 30 minutes selon la formule choisie. Vous pouvez sauvegarder et reprendre plus tard." 
                },
                { 
                  q: "Le rapport est-il vraiment personnalisé ?", 
                  a: "Oui, le rapport est généré dynamiquement en fonction de vos réponses, votre secteur d'activité et la taille de votre entreprise." 
                },
                { 
                  q: "Puis-je refaire l'audit plus tard ?", 
                  a: "Oui, nous recommandons de refaire l'audit tous les 6 mois pour suivre votre progression. Des tarifs préférentiels sont proposés." 
                },
                { 
                  q: "L'audit remplace-t-il un audit par un cabinet ?", 
                  a: "Non, notre audit est un outil d'auto-évaluation. Pour un audit certifiant, nous pouvons vous mettre en relation avec nos partenaires." 
                },
              ].map((faq, i) => (
                <HoloCard key={i} glow="#8B5CF6">
                  <div className="p-6">
                    <h3 className="text-white font-semibold mb-2">{faq.q}</h3>
                    <p className="text-white/60 text-sm">{faq.a}</p>
                  </div>
                </HoloCard>
              ))}
            </div>
          </motion.div>

          {/* Final CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="text-center"
          >
            <HoloCard glow="#00FF88">
              <div className="p-10">
                <span className="text-5xl mb-4 block">🔍</span>
                <h2 className="text-2xl font-bold text-white mb-4">
                  Prêt à évaluer votre conformité ?
                </h2>
                <p className="text-white/60 mb-8 max-w-xl mx-auto">
                  Commencez votre audit maintenant et recevez votre rapport personnalisé en moins de 30 minutes.
                </p>
                
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <motion.a
                    href={auditPlans[1].stripeLink}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-[#00FF88] text-black font-bold px-8 py-4 rounded-xl flex items-center gap-2"
                  >
                    <span>Commencer l'audit Pro</span>
                    <span className="opacity-70">999€</span>
                  </motion.a>
                  
                  <Link 
                    href="/templates"
                    className="text-white/60 hover:text-white transition-colors flex items-center gap-2"
                  >
                    Ou voir les templates
                    <div className="w-4 h-4"><Icons.ArrowRight /></div>
                  </Link>
                </div>

                {/* Trust */}
                <div className="flex items-center justify-center gap-6 mt-8 text-white/40 text-sm">
                  <span>🔒 Données sécurisées</span>
                  <span>•</span>
                  <span>📄 Rapport immédiat</span>
                  <span>•</span>
                  <span>✅ Garantie satisfait</span>
                </div>
              </div>
            </HoloCard>
          </motion.div>

        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-8 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/30 text-sm">© 2024 Formation AI Act. Tous droits réservés.</p>
          <div className="flex items-center gap-4 text-sm text-white/40">
            <a href="#" className="hover:text-white transition-colors">Mentions légales</a>
            <a href="#" className="hover:text-white transition-colors">CGV</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
