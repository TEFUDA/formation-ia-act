'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

const Icons = {
  Shield: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  Check: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-full h-full"><polyline points="20 6 9 17 4 12"/></svg>,
  ArrowRight: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
  ArrowLeft: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>,
};

const plans = [
  {
    id: 'solo',
    name: 'Solo',
    subtitle: '1 personne',
    price: 4900,
    priceDisplay: '4 900',
    color: '#00F5FF',
    icon: '👤',
    description: 'Idéal pour les indépendants, consultants et responsables conformité',
    features: [
      { text: 'Formation complète AI Act (8h)', included: true, highlight: true },
      { text: '6 modules vidéo progressifs', included: true },
      { text: '12 Templates juridiques', included: true, highlight: true },
      { text: '12 Vidéos pratiques (tutos)', included: true, highlight: true },
      { text: 'Audit de conformité complet', included: true, highlight: true },
      { text: 'Rapport PDF personnalisé', included: true },
      { text: 'Certificat de formation', included: true },
      { text: 'Accès 12 mois', included: true },
      { text: 'Support email', included: true },
    ],
  },
  {
    id: 'equipe',
    name: 'Équipe',
    subtitle: "Jusqu'à 5 personnes",
    price: 19500,
    priceDisplay: '19 500',
    pricePerPerson: '3 900',
    color: '#00FF88',
    icon: '👥',
    popular: true,
    description: 'Pour les équipes qui veulent se former ensemble',
    features: [
      { text: 'Tout le contenu Solo ×5', included: true, highlight: true },
      { text: '5 accès individuels', included: true },
      { text: '5 Certificats nominatifs', included: true },
      { text: 'Dashboard équipe', included: true },
      { text: 'Suivi de progression', included: true },
      { text: 'Audit consolidé entreprise', included: true, highlight: true },
      { text: "Rapport d'équipe", included: true },
      { text: 'Support prioritaire', included: true },
      { text: 'Onboarding personnalisé', included: true },
    ],
  },
  {
    id: 'entreprise',
    name: 'Entreprise',
    subtitle: "Jusqu'à 50 personnes",
    price: null,
    priceDisplay: 'Sur devis',
    color: '#8B5CF6',
    icon: '🏢',
    description: 'Déploiement à grande échelle avec accompagnement dédié',
    features: [
      { text: 'Tout le contenu Équipe ×50', included: true, highlight: true },
      { text: '50 accès individuels', included: true },
      { text: '50 Certificats nominatifs', included: true },
      { text: 'Admin multi-sites', included: true },
      { text: 'SSO / Intégration SIRH', included: true },
      { text: 'Personnalisation contenu', included: true },
      { text: 'Webinaire privé (2h)', included: true, highlight: true },
      { text: 'Account manager dédié', included: true },
      { text: 'SLA garanti', included: true },
    ],
  },
];

const included = [
  { icon: '🎓', title: 'Formation 8h', desc: '6 modules vidéo complets', color: '#8B5CF6' },
  { icon: '📋', title: '12 Templates', desc: "Documents prêts à l'emploi", color: '#00F5FF' },
  { icon: '🎬', title: '12 Vidéos pratiques', desc: 'Tutos pour chaque template', color: '#00FF88' },
  { icon: '📊', title: 'Audit complet', desc: '50+ questions + rapport PDF', color: '#FFB800' },
  { icon: '📜', title: 'Certificat', desc: 'Attestation de formation', color: '#FF6B00' },
  { icon: '💬', title: 'Support', desc: 'Assistance par email', color: '#FF4444' },
];

const faqs = [
  { q: "Comment fonctionne le financement OPCO ?", a: "Votre entreprise peut faire une demande de prise en charge auprès de son OPCO. Selon votre branche et la taille de votre entreprise, vous pouvez obtenir un remboursement de 30% à 50% du montant. Nous vous fournissons tous les documents nécessaires." },
  { q: "Combien de temps ai-je accès à la formation ?", a: "Vous avez accès à l'ensemble du contenu pendant 12 mois. Les certificats sont téléchargeables à vie." },
  { q: "Les templates sont-ils personnalisables ?", a: "Oui ! Tous les templates sont en format Word (.docx) modifiable. Les vidéos pratiques vous montrent comment les adapter." },
  { q: "Puis-je faire l'audit plusieurs fois ?", a: "Oui, autant de fois que vous voulez pendant votre période d'accès. Idéal pour suivre votre progression." },
  { q: "Quelle différence avec un cabinet de conseil ?", a: "Un cabinet facture 15 000€ à 50 000€. Notre solution vous rend autonome. Pour les besoins spécifiques, nous avons des cabinets partenaires." },
];

const NeuralBackground = () => (
  <div className="fixed inset-0 pointer-events-none overflow-hidden">
    <div className="absolute inset-0 bg-[#030014]" />
    <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#8B5CF6]/8 blur-[120px] rounded-full" />
    <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-[#00F5FF]/6 blur-[100px] rounded-full" />
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#00FF88]/4 blur-[150px] rounded-full" />
  </div>
);

const HoloCard = ({ children, glow = '#00F5FF', className = '', active = false }: { children: React.ReactNode, glow?: string, className?: string, active?: boolean }) => (
  <div className={`relative group ${className}`}>
    <div className={`absolute -inset-[1px] rounded-2xl transition-opacity duration-300 ${active ? 'opacity-100' : 'opacity-0 group-hover:opacity-60'}`} style={{ background: `linear-gradient(135deg, ${glow}50, transparent 50%, ${glow}50)` }} />
    <div className="relative bg-[#0A0A1B]/90 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden h-full">
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent" />
      <div className="relative h-full">{children}</div>
    </div>
  </div>
);

export default function PricingPage() {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-[#030014] text-white">
      <NeuralBackground />

      <header className="relative z-50 px-6 py-4 border-b border-white/5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
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
            <Link href="/login" className="text-white/60 hover:text-white text-sm transition-colors">Connexion</Link>
          </div>
        </div>
      </header>

      <main className="relative z-10 px-6 py-16">
        <div className="max-w-7xl mx-auto">
          
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              Une offre <span className="bg-gradient-to-r from-[#8B5CF6] to-[#00F5FF] text-transparent bg-clip-text">tout-en-un</span>
            </h1>
            <p className="text-xl text-white/60 mb-6 max-w-2xl mx-auto">
              Formation + Templates + Vidéos pratiques + Audit + Certificat.<br/>Tout ce dont vous avez besoin pour être conforme.
            </p>
            <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-full px-5 py-2.5">
              <span className="text-green-400 text-lg">💰</span>
              <span className="text-green-400 font-medium">Éligible OPCO - Jusqu&apos;à 50% remboursé</span>
            </div>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-6 mb-20">
            {plans.map((plan, index) => (
              <motion.div key={plan.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} className="relative">
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                    <span className="bg-gradient-to-r from-[#00FF88] to-[#00F5FF] text-black text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">⭐ RECOMMANDÉ</span>
                  </div>
                )}
                <HoloCard glow={plan.color} active={plan.popular}>
                  <div className="p-6 flex flex-col h-full">
                    <div className="mb-6">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-3xl">{plan.icon}</span>
                        <div>
                          <h3 className="text-2xl font-bold" style={{ color: plan.color }}>{plan.name}</h3>
                          <p className="text-white/40 text-sm">{plan.subtitle}</p>
                        </div>
                      </div>
                    </div>
                    <div className="mb-6">
                      {plan.price ? (
                        <>
                          <div className="flex items-baseline gap-2">
                            <span className="text-4xl font-bold">{plan.priceDisplay}€</span>
                            <span className="text-white/40">HT</span>
                          </div>
                          {plan.pricePerPerson && <p className="text-sm text-white/40 mt-1">soit {plan.pricePerPerson}€/personne</p>}
                        </>
                      ) : (
                        <span className="text-3xl font-bold">{plan.priceDisplay}</span>
                      )}
                    </div>
                    <p className="text-white/60 text-sm mb-6">{plan.description}</p>
                    <ul className="space-y-3 mb-8 flex-grow">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <span className="text-green-400 mt-0.5 flex-shrink-0">✓</span>
                          <span className={`text-sm ${feature.highlight ? 'text-white font-medium' : 'text-white/70'}`}>{feature.text}</span>
                        </li>
                      ))}
                    </ul>
                    {plan.price ? (
                      <Link href={`/checkout?plan=${plan.id}`} className="w-full py-4 rounded-xl font-bold text-center transition-all block" style={{ background: plan.popular ? `linear-gradient(135deg, ${plan.color}, #00F5FF)` : `${plan.color}20`, color: plan.popular ? '#000' : plan.color, border: plan.popular ? 'none' : `1px solid ${plan.color}40` }}>
                        Commencer maintenant
                      </Link>
                    ) : (
                      <Link href="/devis" className="w-full py-4 rounded-xl font-bold text-center transition-all block" style={{ background: plan.color, color: '#000' }}>
                        Générer mon devis
                      </Link>
                    )}
                    
                    {/* DEV BUTTONS - À SUPPRIMER AVANT PROD */}
                    <div className="mt-3 pt-3 border-t border-white/10">
                      <p className="text-white/30 text-xs text-center mb-2">🔧 Mode DEV</p>
                      <div className="flex gap-2">
                        <Link 
                          href="/dashboard" 
                          className="flex-1 py-2 rounded-lg text-xs font-medium text-center bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 hover:bg-yellow-500/30 transition-all"
                        >
                          → Dashboard
                        </Link>
                        <Link 
                          href="/formation" 
                          className="flex-1 py-2 rounded-lg text-xs font-medium text-center bg-purple-500/20 text-purple-400 border border-purple-500/30 hover:bg-purple-500/30 transition-all"
                        >
                          → Formation
                        </Link>
                      </div>
                      <div className="flex gap-2 mt-2">
                        <Link 
                          href="/audit" 
                          className="flex-1 py-2 rounded-lg text-xs font-medium text-center bg-blue-500/20 text-blue-400 border border-blue-500/30 hover:bg-blue-500/30 transition-all"
                        >
                          → Audit
                        </Link>
                        <Link 
                          href="/certificate" 
                          className="flex-1 py-2 rounded-lg text-xs font-medium text-center bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30 transition-all"
                        >
                          → Certificat
                        </Link>
                      </div>
                    </div>
                    {/* FIN DEV BUTTONS */}
                  </div>
                </HoloCard>
              </motion.div>
            ))}
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-20">
            <h2 className="text-2xl font-bold text-center mb-8">Ce qui est inclus dans <span className="text-[#00F5FF]">chaque formule</span></h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {included.map((item, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
                  <HoloCard glow={item.color}>
                    <div className="flex items-center gap-4 p-5">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0" style={{ background: `${item.color}15` }}>{item.icon}</div>
                      <div>
                        <p className="font-semibold text-white">{item.title}</p>
                        <p className="text-white/50 text-sm">{item.desc}</p>
                      </div>
                    </div>
                  </HoloCard>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-20">
            <HoloCard glow="#FFB800">
              <div className="p-8">
                <h2 className="text-2xl font-bold text-center mb-8">💰 Comparez avec le marché</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                    <h3 className="text-lg font-bold text-white/60 mb-4">Cabinet de conseil classique</h3>
                    <ul className="space-y-3">
                      <li className="flex items-center gap-3 text-white/50"><span className="text-red-400">✗</span>Audit seul : 8 000€ - 25 000€</li>
                      <li className="flex items-center gap-3 text-white/50"><span className="text-red-400">✗</span>Formation : 2 000€ - 4 000€/pers</li>
                      <li className="flex items-center gap-3 text-white/50"><span className="text-red-400">✗</span>Accompagnement : 20 000€ - 50 000€</li>
                      <li className="flex items-center gap-3 text-white/50"><span className="text-red-400">✗</span>Délai : 3-6 mois</li>
                    </ul>
                    <div className="mt-4 pt-4 border-t border-white/10">
                      <p className="text-white/40 text-sm">Total estimé</p>
                      <p className="text-2xl font-bold text-red-400">15 000€ - 50 000€</p>
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-[#00FF88]/10 to-[#00F5FF]/10 rounded-xl p-6 border border-[#00FF88]/30">
                    <h3 className="text-lg font-bold text-[#00FF88] mb-4">Notre solution tout-en-un</h3>
                    <ul className="space-y-3">
                      <li className="flex items-center gap-3 text-white"><span className="text-[#00FF88]">✓</span>Formation complète 8h</li>
                      <li className="flex items-center gap-3 text-white"><span className="text-[#00FF88]">✓</span>12 Templates juridiques</li>
                      <li className="flex items-center gap-3 text-white"><span className="text-[#00FF88]">✓</span>12 Vidéos pratiques</li>
                      <li className="flex items-center gap-3 text-white"><span className="text-[#00FF88]">✓</span>Audit complet + Rapport PDF</li>
                      <li className="flex items-center gap-3 text-white"><span className="text-[#00FF88]">✓</span>Certificat + Support</li>
                    </ul>
                    <div className="mt-4 pt-4 border-t border-[#00FF88]/30">
                      <p className="text-white/60 text-sm">À partir de</p>
                      <p className="text-3xl font-bold text-[#00FF88]">4 900€</p>
                      <p className="text-[#00F5FF] text-sm mt-1">Soit jusqu&apos;à 90% d&apos;économies</p>
                    </div>
                  </div>
                </div>
              </div>
            </HoloCard>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-20">
            <HoloCard glow="#8B5CF6">
              <div className="p-8 text-center">
                <span className="text-4xl mb-4 block">🤝</span>
                <h2 className="text-2xl font-bold mb-4">Besoin d&apos;un accompagnement sur-mesure ?</h2>
                <p className="text-white/60 max-w-2xl mx-auto mb-6">Nous travaillons avec des cabinets partenaires spécialisés AI Act pour un accompagnement personnalisé : audit sur site, DPO externalisé, mise en conformité complète.</p>
                <Link href="/partenaires" className="inline-flex items-center gap-2 bg-[#8B5CF6] text-white font-bold px-6 py-3 rounded-xl hover:bg-[#8B5CF6]/90 transition-colors">
                  Découvrir nos partenaires
                  <div className="w-4 h-4"><Icons.ArrowRight /></div>
                </Link>
              </div>
            </HoloCard>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-20 max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-8">Questions fréquentes</h2>
            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <HoloCard key={i} glow="#00F5FF">
                  <button onClick={() => setExpandedFaq(expandedFaq === i ? null : i)} className="w-full p-5 text-left flex items-center justify-between">
                    <span className="text-white font-medium pr-4">{faq.q}</span>
                    <div className={`w-5 h-5 text-white/40 transition-transform flex-shrink-0 ${expandedFaq === i ? 'rotate-45' : ''}`}>
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
                </HoloCard>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <div className="inline-flex items-center gap-4 bg-green-500/10 border border-green-500/20 rounded-2xl px-8 py-5">
              <span className="text-5xl">🛡️</span>
              <div className="text-left">
                <p className="font-bold text-green-400 text-lg">Garantie satisfait ou remboursé</p>
                <p className="text-white/60">14 jours pour tester. Remboursement intégral si non satisfait.</p>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}>
            <HoloCard glow="#00FF88">
              <div className="p-10 text-center">
                <h2 className="text-2xl font-bold mb-4">Prêt à vous mettre en conformité ?</h2>
                <p className="text-white/60 mb-6 max-w-xl mx-auto">Rejoignez les entreprises qui anticipent la réglementation.</p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link href="/checkout?plan=solo" className="bg-gradient-to-r from-[#00FF88] to-[#00F5FF] text-black font-bold px-8 py-4 rounded-xl flex items-center gap-2">
                    Commencer maintenant
                    <div className="w-5 h-5"><Icons.ArrowRight /></div>
                  </Link>
                  <Link href="/" className="text-white/60 hover:text-white transition-colors px-6 py-4">Retour à l&apos;accueil</Link>
                </div>
                <p className="text-white/30 text-sm mt-6">🔒 Paiement sécurisé par Stripe • Éligible OPCO • Support réactif</p>
              </div>
            </HoloCard>
          </motion.div>
        </div>
      </main>

      <footer className="relative z-10 py-8 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/30 text-sm">© 2025 Formation-IA-Act.fr. Tous droits réservés.</p>
          <div className="flex items-center gap-4 text-sm text-white/40">
            <a href="#" className="hover:text-white transition-colors">Mentions légales</a>
            <a href="#" className="hover:text-white transition-colors">CGV</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
