'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Icons
const Icons = {
  Shield: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  Check: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-full h-full"><polyline points="20 6 9 17 4 12"/></svg>,
  X: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  ArrowLeft: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>,
  ArrowRight: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
  Star: () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  Users: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  Award: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>,
  Zap: () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  Book: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>,
  Headphones: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/></svg>,
  Download: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
  BarChart: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/></svg>,
  Settings: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
  Building: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01M16 6h.01M12 6h.01M12 10h.01M12 14h.01M16 10h.01M16 14h.01M8 10h.01M8 14h.01"/></svg>,
};

// Plans
const plans = [
  {
    id: 'solo',
    name: 'Solo',
    tagline: 'Professionnel individuel',
    price: 500,
    pricePerUser: 500,
    color: '#00F5FF',
    icon: '👤',
    users: '1',
    description: 'Parfait pour les indépendants et consultants qui souhaitent se certifier sur l\'AI Act.',
    features: [
      { name: 'Nombre d\'utilisateurs', value: '1', included: true },
      { name: '6 modules de formation', value: 'Oui', included: true },
      { name: 'Certificat officiel', value: 'Oui', included: true },
      { name: 'Accès à la plateforme', value: '12 mois', included: true },
      { name: 'Quiz interactifs', value: 'Oui', included: true },
      { name: 'Support email', value: 'Oui', included: true },
      { name: 'Ressources téléchargeables', value: 'Basiques', included: true },
      { name: 'Dashboard manager', value: 'Non', included: false },
      { name: 'Rapports de progression', value: 'Non', included: false },
      { name: 'Support prioritaire', value: 'Non', included: false },
    ],
  },
  {
    id: 'equipe',
    name: 'Équipe',
    tagline: 'PME & Petites équipes',
    price: 2000,
    pricePerUser: 400,
    color: '#00FF88',
    icon: '👥',
    users: '5',
    popular: true,
    description: 'Idéal pour former une équipe et gérer la conformité de votre organisation.',
    features: [
      { name: 'Nombre d\'utilisateurs', value: '5', included: true },
      { name: '6 modules de formation', value: 'Oui', included: true },
      { name: 'Certificats officiels', value: 'Pour tous', included: true },
      { name: 'Accès à la plateforme', value: '12 mois', included: true },
      { name: 'Quiz interactifs', value: 'Oui', included: true },
      { name: 'Support email', value: 'Prioritaire', included: true },
      { name: 'Ressources téléchargeables', value: 'Complètes', included: true },
      { name: 'Dashboard manager', value: 'Oui', included: true },
      { name: 'Rapports de progression', value: 'Oui', included: true },
      { name: 'Support prioritaire', value: 'Oui', included: true },
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    tagline: 'Grandes organisations',
    price: 18000,
    pricePerUser: 360,
    color: '#8B5CF6',
    icon: '🏢',
    users: '50',
    description: 'Solution complète pour les grandes entreprises avec un accompagnement personnalisé.',
    features: [
      { name: 'Nombre d\'utilisateurs', value: '50', included: true },
      { name: '6 modules de formation', value: 'Oui', included: true },
      { name: 'Certificats officiels', value: 'Pour tous', included: true },
      { name: 'Accès à la plateforme', value: 'Illimité', included: true },
      { name: 'Quiz interactifs', value: 'Oui', included: true },
      { name: 'Support email', value: 'Dédié 24/7', included: true },
      { name: 'Ressources téléchargeables', value: 'Premium', included: true },
      { name: 'Dashboard manager', value: 'Avancé', included: true },
      { name: 'Rapports de progression', value: 'Personnalisés', included: true },
      { name: 'Support prioritaire', value: 'Account manager', included: true },
    ],
    extras: [
      'Formation sur-mesure',
      'Intégration SSO/SAML',
      'API d\'intégration',
      'SLA garanti',
    ],
  },
];

// FAQ
const faqs = [
  { q: "Quelle est la durée d'accès à la formation ?", a: "L'accès est de 12 mois pour les formules Solo et Équipe, et illimité pour Enterprise. Vous pouvez suivre la formation à votre rythme." },
  { q: "Le certificat est-il reconnu officiellement ?", a: "Oui, notre certificat atteste de votre formation conformément à l'Article 4 de l'AI Act. Il est reconnu dans tous les pays de l'Union Européenne." },
  { q: "Puis-je ajouter des utilisateurs après l'achat ?", a: "Oui, vous pouvez passer à une formule supérieure à tout moment. La différence de prix sera calculée au prorata." },
  { q: "Comment fonctionne le paiement ?", a: "Le paiement est unique et sécurisé par Stripe. Nous acceptons les cartes bancaires et les virements pour Enterprise." },
];

// Neural Background
const NeuralBackground = () => (
  <div className="fixed inset-0 pointer-events-none overflow-hidden">
    <div className="absolute inset-0 bg-[#030014]" />
    <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#00F5FF]/5 blur-[120px] rounded-full" />
    <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-[#8B5CF6]/5 blur-[100px] rounded-full" />
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#00FF88]/3 blur-[150px] rounded-full" />
    <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: 'linear-gradient(rgba(0, 245, 255, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 245, 255, 0.3) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
  </div>
);

// Glow Card
const GlowCard = ({ children, glow = '#00F5FF', className = '', active = false }: { children: React.ReactNode, glow?: string, className?: string, active?: boolean }) => (
  <motion.div
    whileHover={{ scale: 1.02, y: -5 }}
    transition={{ type: 'spring', stiffness: 400 }}
    className={`relative group ${className}`}
  >
    {active && <div className="absolute -inset-[2px] rounded-3xl" style={{ background: `linear-gradient(135deg, ${glow}, ${glow}50)` }} />}
    <div className="absolute -inset-[1px] rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" style={{ background: `${glow}30` }} />
    <div className="absolute -inset-[1px] rounded-3xl opacity-30 group-hover:opacity-60 transition-opacity" style={{ background: `linear-gradient(135deg, ${glow}40, transparent 50%, ${glow}40)` }} />
    <div className="relative bg-[#0A0A1B]/95 backdrop-blur-xl rounded-3xl border border-white/5 overflow-hidden h-full">
      <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity" style={{ background: `radial-gradient(circle at 50% 0%, ${glow}, transparent 70%)` }} />
      <div className="relative h-full">{children}</div>
    </div>
  </motion.div>
);

export default function PricingPage() {
  const router = useRouter();
  const [billingAnnual, setBillingAnnual] = useState(true);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-[#030014] text-white">
      <NeuralBackground />

      {/* Header */}
      <header className="relative z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
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

            <Link href="/" className="flex items-center gap-2 text-white/60 hover:text-white transition-colors">
              <div className="w-5 h-5"><Icons.ArrowLeft /></div>
              Retour
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative z-10 pt-12 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="inline-flex items-center gap-2 bg-[#00FF88]/10 border border-[#00FF88]/30 rounded-full px-4 py-2 mb-6">
              <div className="w-2 h-2 bg-[#00FF88] rounded-full animate-pulse" />
              <span className="text-[#00FF88] text-sm font-medium">-20% jusqu'au 31 janvier</span>
            </span>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
            Choisissez votre
            <span className="block bg-gradient-to-r from-[#00F5FF] via-[#FF00E5] to-[#00FF88] bg-clip-text text-transparent">formule</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-xl text-white/50 max-w-2xl mx-auto">
            Des solutions adaptées à chaque besoin, avec un accès complet aux 6 modules de formation et certification officielle.
          </motion.p>
        </div>
      </section>

      {/* Plans */}
      <section className="relative z-10 pb-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
            {plans.map((plan, i) => (
              <motion.div key={plan.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * i }} className="h-full">
                <GlowCard glow={plan.color} active={plan.popular}>
                  <div className="p-6 lg:p-8 flex flex-col h-full">
                    {/* Header */}
                    <div className="mb-6">
                      {plan.popular && (
                        <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium mb-4" style={{ background: `${plan.color}20`, color: plan.color }}>
                          <div className="w-3 h-3"><Icons.Star /></div>
                          Le plus populaire
                        </div>
                      )}
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-3xl">{plan.icon}</span>
                        <div>
                          <h2 className="text-2xl font-bold text-white">{plan.name}</h2>
                          <p className="text-white/40 text-sm">{plan.tagline}</p>
                        </div>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="mb-6 pb-6 border-b border-white/10">
                      <div className="flex items-baseline gap-2">
                        <span className="text-5xl font-bold" style={{ color: plan.color }}>{plan.price.toLocaleString()}</span>
                        <span className="text-white/40">€ HT</span>
                      </div>
                      <p className="text-white/40 text-sm mt-2">
                        Soit <span className="text-white">{plan.pricePerUser}€</span> par utilisateur
                      </p>
                    </div>

                    {/* Description */}
                    <p className="text-white/60 text-sm mb-6">{plan.description}</p>

                    {/* Features */}
                    <div className="flex-1 space-y-3 mb-8">
                      {plan.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className={`w-4 h-4 ${feature.included ? '' : 'opacity-30'}`} style={{ color: feature.included ? plan.color : 'white' }}>
                              {feature.included ? <Icons.Check /> : <Icons.X />}
                            </div>
                            <span className={`text-sm ${feature.included ? 'text-white/70' : 'text-white/30'}`}>{feature.name}</span>
                          </div>
                          <span className={`text-sm font-medium ${feature.included ? 'text-white' : 'text-white/30'}`}>{feature.value}</span>
                        </div>
                      ))}
                      
                      {plan.extras && (
                        <div className="pt-4 mt-4 border-t border-white/10">
                          <p className="text-white/40 text-xs uppercase tracking-wider mb-3">Inclus également</p>
                          {plan.extras.map((extra, idx) => (
                            <div key={idx} className="flex items-center gap-2 mb-2">
                              <div className="w-4 h-4" style={{ color: plan.color }}><Icons.Check /></div>
                              <span className="text-white/70 text-sm">{extra}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* CTA */}
                    <button
                      onClick={() => router.push(`/checkout?plan=${plan.id}`)}
                      className="w-full py-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
                      style={{ 
                        background: plan.popular ? plan.color : 'rgba(255,255,255,0.05)', 
                        color: plan.popular ? 'black' : 'white',
                      }}
                    >
                      {plan.id === 'enterprise' ? 'Nous contacter' : 'Choisir cette formule'}
                      <div className="w-5 h-5"><Icons.ArrowRight /></div>
                    </button>
                  </div>
                </GlowCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table (Desktop) */}
      <section className="relative z-10 pb-24 px-6 hidden lg:block">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <GlowCard glow="#00F5FF">
              <div className="p-8">
                <h3 className="text-2xl font-bold text-white mb-8 text-center">Comparatif détaillé</h3>
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left pb-4 text-white/40 font-medium">Fonctionnalité</th>
                      {plans.map(plan => (
                        <th key={plan.id} className="text-center pb-4">
                          <span className="font-bold text-lg" style={{ color: plan.color }}>{plan.name}</span>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {plans[0].features.map((feature, idx) => (
                      <tr key={idx} className="border-b border-white/5">
                        <td className="py-4 text-white/60">{feature.name}</td>
                        {plans.map(plan => (
                          <td key={plan.id} className="text-center py-4">
                            {plan.features[idx].included ? (
                              <span className="text-white font-medium">{plan.features[idx].value}</span>
                            ) : (
                              <span className="text-white/30">—</span>
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                    <tr>
                      <td className="py-6 text-white/60 font-semibold">Prix</td>
                      {plans.map(plan => (
                        <td key={plan.id} className="text-center py-6">
                          <span className="text-2xl font-bold" style={{ color: plan.color }}>{plan.price.toLocaleString()}€</span>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </GlowCard>
          </motion.div>
        </div>
      </section>

      {/* Features Icons */}
      <section className="relative z-10 pb-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h3 className="text-3xl font-bold text-white mb-4">Inclus dans toutes les formules</h3>
            <p className="text-white/50">Un parcours complet pour maîtriser l'AI Act</p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Icons.Book, title: '6 modules', desc: 'Formation complète', color: '#00F5FF' },
              { icon: Icons.Award, title: 'Certificat', desc: 'Reconnu UE', color: '#00FF88' },
              { icon: Icons.Zap, title: 'Quiz', desc: 'Interactifs', color: '#FFB800' },
              { icon: Icons.Download, title: 'Ressources', desc: 'Téléchargeables', color: '#FF00E5' },
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <GlowCard glow={item.color}>
                  <div className="p-6 text-center">
                    <div className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ background: `${item.color}15` }}>
                      <div className="w-7 h-7" style={{ color: item.color }}><item.icon /></div>
                    </div>
                    <h4 className="text-white font-semibold mb-1">{item.title}</h4>
                    <p className="text-white/40 text-sm">{item.desc}</p>
                  </div>
                </GlowCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="relative z-10 pb-24 px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h3 className="text-3xl font-bold text-white mb-4">Questions fréquentes</h3>
          </motion.div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <GlowCard glow="#00F5FF">
                  <button onClick={() => setExpandedFaq(expandedFaq === i ? null : i)} className="w-full p-5 text-left flex items-center justify-between">
                    <span className="text-white font-medium pr-4">{faq.q}</span>
                    <div className={`w-5 h-5 text-white/40 transition-transform ${expandedFaq === i ? 'rotate-45' : ''}`}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                    </div>
                  </button>
                  <AnimatePresence>
                    {expandedFaq === i && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                        <p className="px-5 pb-5 text-white/60">{faq.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </GlowCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 pb-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}>
            <GlowCard glow="#00FF88">
              <div className="p-10">
                <div className="text-5xl mb-6">💬</div>
                <h3 className="text-2xl font-bold text-white mb-4">Une question ?</h3>
                <p className="text-white/50 mb-6">Notre équipe est disponible pour vous aider à choisir la formule adaptée à vos besoins.</p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <a href="mailto:contact@aiact-academy.eu" className="bg-[#00FF88] text-black font-semibold px-6 py-3 rounded-xl flex items-center gap-2 hover:bg-[#00FF88]/90 transition-colors">
                    <div className="w-5 h-5"><Icons.Headphones /></div>
                    Nous contacter
                  </a>
                  <Link href="/" className="text-white/60 hover:text-white transition-colors px-6 py-3">
                    Retour à l'accueil
                  </Link>
                </div>
              </div>
            </GlowCard>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-8 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/30 text-sm">© 2024 AI Act Academy. Tous droits réservés.</p>
          <div className="flex items-center gap-4 text-sm text-white/40">
            <a href="#" className="hover:text-white transition-colors">Mentions légales</a>
            <a href="#" className="hover:text-white transition-colors">CGV</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
