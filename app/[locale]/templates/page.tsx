'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

// Icons
const Icons = {
  Shield: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  Check: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-full h-full"><polyline points="20 6 9 17 4 12"/></svg>,
  ArrowRight: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
  ArrowLeft: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>,
  Download: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
  FileText: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
  Star: () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  Zap: () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  Award: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>,
  Clock: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  Users: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  Lock: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
};

// Templates data
const allTemplates = [
  { id: 1, name: "Template Registre IA", type: "Excel", icon: "📊", category: "Registre", description: "Inventaire complet de vos systèmes IA", pack: "essentiel" },
  { id: 2, name: "Modèle Politique IA", type: "Word", icon: "📄", category: "Gouvernance", description: "Politique d'utilisation de l'IA prête à signer", pack: "essentiel" },
  { id: 3, name: "Matrice Classification Risques", type: "Excel", icon: "⚠️", category: "Risques", description: "Classez vos systèmes selon les 4 niveaux", pack: "essentiel" },
  { id: 4, name: "Checklist Êtes-vous Concerné", type: "Excel", icon: "✅", category: "Diagnostic", description: "Vérifiez si l'AI Act s'applique à vous", pack: "essentiel" },
  { id: 5, name: "Template Documentation Technique", type: "Word", icon: "📋", category: "Documentation", description: "Documentation pour systèmes haut risque", pack: "essentiel" },
  { id: 6, name: "Fiche Poste Référent IA", type: "Word", icon: "👤", category: "Gouvernance", description: "Profil et missions du référent IA", pack: "essentiel" },
  { id: 7, name: "Guide AI Act Synthèse", type: "PDF", icon: "📚", category: "Guide", description: "Résumé complet du règlement en 20 pages", pack: "complet" },
  { id: 8, name: "Plan Audit Type", type: "Excel", icon: "🔍", category: "Audit", description: "Plan d'audit détaillé étape par étape", pack: "complet" },
  { id: 9, name: "Tableau Bord Conformité IA", type: "Excel", icon: "📈", category: "Suivi", description: "Dashboard de suivi de conformité", pack: "complet" },
  { id: 10, name: "Guide Audit Pas à Pas", type: "PDF", icon: "📖", category: "Audit", description: "Méthodologie complète d'audit", pack: "complet" },
  { id: 11, name: "Checklist Marquage CE", type: "Excel", icon: "🏷️", category: "Conformité", description: "Checklist pour le marquage CE des systèmes IA", pack: "complet" },
  { id: 12, name: "Exemples Secteurs Activité", type: "PDF", icon: "🏢", category: "Exemples", description: "Cas pratiques par secteur d'activité", pack: "complet" },
];

// Packs configuration
const packs = [
  {
    id: 'essentiel',
    name: 'Essentiel',
    price: 299,
    originalPrice: 450,
    color: '#00F5FF',
    icon: '📦',
    description: 'Les 6 documents indispensables pour démarrer votre conformité AI Act.',
    templates: allTemplates.filter(t => t.pack === 'essentiel'),
    features: [
      '6 documents essentiels',
      'Formats Word & Excel modifiables',
      'Mises à jour incluses 1 an',
      'Support email',
    ],
    cta: 'Acheter le pack Essentiel',
    stripeLink: 'https://buy.stripe.com/7sY00b8dqdJN21i5oR3AY05', // À remplacer
  },
  {
    id: 'complet',
    name: 'Complet',
    price: 599,
    originalPrice: 900,
    color: '#00FF88',
    icon: '📦',
    popular: true,
    description: 'L\'intégralité des 12 templates pour une conformité totale.',
    templates: allTemplates,
    features: [
      '12 documents complets',
      'Formats Word, Excel & PDF',
      'Mises à jour incluses à vie',
      'Support prioritaire',
      'Accès aux futures ressources',
    ],
    cta: 'Acheter le pack Complet',
    stripeLink: 'https://buy.stripe.com/eVq14f51e0X1cFW18B3AY04', // À remplacer
  },
  {
    id: 'bundle',
    name: 'Bundle Formation',
    price: 799,
    originalPrice: 1100,
    color: '#8B5CF6',
    icon: '🎓',
    description: 'Pack Complet + Formation certifiante. La solution tout-en-un.',
    templates: allTemplates,
    features: [
      '12 documents complets',
      'Formation 6 modules (8h)',
      'Certificat officiel AI Act',
      'Accès formation 12 mois',
      'Support prioritaire',
      'Mises à jour à vie',
    ],
    cta: 'Acheter le Bundle',
    stripeLink: 'https://buy.stripe.com/fZudR151e2158pGbNf3AY03', // À remplacer
    badge: 'MEILLEURE OFFRE',
  },
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

// HoloCard
const HoloCard = ({ children, glow = '#00F5FF', className = '', active = false }: { children: React.ReactNode, glow?: string, className?: string, active?: boolean }) => (
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

// Template Card
const TemplateCard = ({ template }: { template: typeof allTemplates[0] }) => (
  <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/5">
    <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-2xl flex-shrink-0">
      {template.icon}
    </div>
    <div className="flex-1 min-w-0">
      <h4 className="text-white font-medium text-sm truncate">{template.name}</h4>
      <p className="text-white/40 text-xs truncate">{template.description}</p>
    </div>
    <span className="text-white/30 text-xs px-2 py-1 bg-white/5 rounded-lg">{template.type}</span>
  </div>
);

export default function TemplatesPage() {
  const [selectedPack, setSelectedPack] = useState<string>('complet');
  const [showAllTemplates, setShowAllTemplates] = useState(false);

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
            <Link href="/quiz" className="text-white/60 hover:text-white text-sm transition-colors flex items-center gap-2">
              <div className="w-4 h-4"><Icons.ArrowLeft /></div>
              <span className="hidden sm:inline">Retour au quiz</span>
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
            <div className="inline-flex items-center gap-2 bg-[#00FF88]/10 border border-[#00FF88]/30 rounded-full px-4 py-2 mb-6">
              <span className="text-[#00FF88] text-sm font-medium">📦 12 templates professionnels</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">
              <span className="text-white">Tous les documents pour votre</span>
              <br />
              <span className="bg-gradient-to-r from-[#00F5FF] to-[#00FF88] bg-clip-text text-transparent">conformité AI Act</span>
            </h1>
            
            <p className="text-white/60 text-lg max-w-2xl mx-auto mb-8">
              Gagnez des semaines de travail avec nos templates prêts à l'emploi. 
              Registre IA, politique, documentation technique, matrices de risques...
            </p>

            {/* Trust badges */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
              {[
                { icon: "✅", text: "Conformes AI Act 2024" },
                { icon: "📝", text: "100% modifiables" },
                { icon: "🔄", text: "Mises à jour incluses" },
                { icon: "💬", text: "Support inclus" },
              ].map((badge, i) => (
                <div key={i} className="flex items-center gap-2 text-white/50">
                  <span>{badge.icon}</span>
                  <span>{badge.text}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Pricing Cards */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid md:grid-cols-3 gap-6 mb-16"
          >
            {packs.map((pack, index) => (
              <motion.div
                key={pack.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <HoloCard 
                  glow={pack.color} 
                  active={selectedPack === pack.id}
                  className={pack.popular ? 'ring-2 ring-[#00FF88]/50' : ''}
                >
                  <div className="p-6">
                    {/* Badge */}
                    {pack.badge && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <span className="bg-gradient-to-r from-[#8B5CF6] to-[#FF00E5] text-white text-xs font-bold px-4 py-1 rounded-full">
                          {pack.badge}
                        </span>
                      </div>
                    )}
                    {pack.popular && !pack.badge && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <span className="bg-[#00FF88] text-black text-xs font-bold px-4 py-1 rounded-full">
                          POPULAIRE
                        </span>
                      </div>
                    )}

                    {/* Header */}
                    <div className="text-center mb-6 pt-2">
                      <span className="text-4xl mb-3 block">{pack.icon}</span>
                      <h3 className="text-xl font-bold text-white mb-1">{pack.name}</h3>
                      <p className="text-white/50 text-sm">{pack.description}</p>
                    </div>

                    {/* Price */}
                    <div className="text-center mb-6">
                      <div className="flex items-center justify-center gap-2 mb-1">
                        <span className="text-white/40 line-through text-lg">{pack.originalPrice}€</span>
                        <span className="bg-[#FF4444]/20 text-[#FF4444] text-xs font-bold px-2 py-0.5 rounded">
                          -{Math.round((1 - pack.price / pack.originalPrice) * 100)}%
                        </span>
                      </div>
                      <div className="flex items-baseline justify-center gap-1">
                        <span className="text-4xl font-bold" style={{ color: pack.color }}>{pack.price}</span>
                        <span className="text-white/40">€ HT</span>
                      </div>
                      <p className="text-white/30 text-xs mt-1">Paiement unique</p>
                    </div>

                    {/* Features */}
                    <div className="space-y-3 mb-6">
                      {pack.features.map((feature, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: `${pack.color}20` }}>
                            <div className="w-3 h-3" style={{ color: pack.color }}><Icons.Check /></div>
                          </div>
                          <span className="text-white/70 text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>

                    {/* CTA */}
                    <motion.a
                      href={pack.stripeLink}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="block w-full py-4 rounded-xl font-bold text-center transition-all"
                      style={{ 
                        background: selectedPack === pack.id ? pack.color : 'rgba(255,255,255,0.05)',
                        color: selectedPack === pack.id ? '#000' : pack.color,
                        border: `1px solid ${pack.color}30`
                      }}
                      onClick={() => setSelectedPack(pack.id)}
                    >
                      {pack.cta}
                    </motion.a>
                  </div>
                </HoloCard>
              </motion.div>
            ))}
          </motion.div>

          {/* Templates List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-16"
          >
            <HoloCard glow="#FFB800">
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">📋 Contenu des packs</h2>
                    <p className="text-white/50">Aperçu des 12 templates professionnels inclus</p>
                  </div>
                  <button
                    onClick={() => setShowAllTemplates(!showAllTemplates)}
                    className="text-[#FFB800] text-sm font-medium hover:underline"
                  >
                    {showAllTemplates ? 'Voir moins' : 'Voir tout'}
                  </button>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {(showAllTemplates ? allTemplates : allTemplates.slice(0, 6)).map((template) => (
                    <div key={template.id} className="relative">
                      <TemplateCard template={template} />
                      {template.pack === 'complet' && (
                        <div className="absolute top-2 right-2">
                          <span className="bg-[#00FF88]/20 text-[#00FF88] text-xs px-2 py-0.5 rounded-full">
                            Complet
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {!showAllTemplates && (
                  <div className="text-center mt-6">
                    <button
                      onClick={() => setShowAllTemplates(true)}
                      className="text-white/40 hover:text-white text-sm transition-colors"
                    >
                      + 6 autres templates...
                    </button>
                  </div>
                )}
              </div>
            </HoloCard>
          </motion.div>

          {/* Comparison Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-16"
          >
            <HoloCard glow="#00F5FF">
              <div className="p-8 overflow-x-auto">
                <h2 className="text-2xl font-bold text-white mb-6 text-center">Comparatif des packs</h2>
                
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left py-4 text-white/60 font-medium">Fonctionnalité</th>
                      {packs.map(pack => (
                        <th key={pack.id} className="text-center py-4">
                          <span className="font-bold" style={{ color: pack.color }}>{pack.name}</span>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-white/5">
                      <td className="py-4 text-white/70">Nombre de templates</td>
                      <td className="text-center py-4 text-white">6</td>
                      <td className="text-center py-4 text-white font-bold">12</td>
                      <td className="text-center py-4 text-white font-bold">12</td>
                    </tr>
                    <tr className="border-b border-white/5">
                      <td className="py-4 text-white/70">Formation certifiante</td>
                      <td className="text-center py-4 text-white/30">—</td>
                      <td className="text-center py-4 text-white/30">—</td>
                      <td className="text-center py-4 text-[#00FF88]">✓ 6 modules</td>
                    </tr>
                    <tr className="border-b border-white/5">
                      <td className="py-4 text-white/70">Certificat officiel</td>
                      <td className="text-center py-4 text-white/30">—</td>
                      <td className="text-center py-4 text-white/30">—</td>
                      <td className="text-center py-4 text-[#00FF88]">✓</td>
                    </tr>
                    <tr className="border-b border-white/5">
                      <td className="py-4 text-white/70">Mises à jour</td>
                      <td className="text-center py-4 text-white">1 an</td>
                      <td className="text-center py-4 text-[#00FF88]">À vie</td>
                      <td className="text-center py-4 text-[#00FF88]">À vie</td>
                    </tr>
                    <tr className="border-b border-white/5">
                      <td className="py-4 text-white/70">Support</td>
                      <td className="text-center py-4 text-white">Email</td>
                      <td className="text-center py-4 text-white">Prioritaire</td>
                      <td className="text-center py-4 text-[#00FF88]">Prioritaire</td>
                    </tr>
                    <tr>
                      <td className="py-6 text-white/60 font-semibold">Prix</td>
                      {packs.map(pack => (
                        <td key={pack.id} className="text-center py-6">
                          <span className="text-2xl font-bold" style={{ color: pack.color }}>{pack.price}€</span>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
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
                  q: "Les templates sont-ils à jour avec l'AI Act 2024 ?", 
                  a: "Oui, tous nos templates sont conformes au règlement AI Act voté en mars 2024 et mis à jour régulièrement selon les guidelines de la Commission européenne." 
                },
                { 
                  q: "Puis-je modifier les documents ?", 
                  a: "Absolument ! Tous les templates Word et Excel sont 100% éditables. Vous pouvez les adapter à votre entreprise, ajouter votre logo, etc." 
                },
                { 
                  q: "Les templates remplacent-ils la formation ?", 
                  a: "Les templates vous donnent les outils pratiques. La formation vous donne les connaissances pour les utiliser correctement. L'idéal est de combiner les deux (Bundle)." 
                },
                { 
                  q: "Comment recevoir mes templates ?", 
                  a: "Immédiatement après le paiement, vous recevez un email avec un lien de téléchargement. Vous aurez aussi accès à votre espace client." 
                },
              ].map((faq, i) => (
                <HoloCard key={i} glow="#00F5FF">
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
                <span className="text-5xl mb-4 block">🚀</span>
                <h2 className="text-2xl font-bold text-white mb-4">
                  Prêt à sécuriser votre conformité ?
                </h2>
                <p className="text-white/60 mb-8 max-w-xl mx-auto">
                  Rejoignez les 847+ entreprises qui utilisent déjà nos templates pour leur conformité AI Act.
                </p>
                
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <motion.a
                    href={packs[1].stripeLink}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-[#00FF88] text-black font-bold px-8 py-4 rounded-xl flex items-center gap-2"
                  >
                    <span>Obtenir le Pack Complet</span>
                    <span className="opacity-70">599€</span>
                  </motion.a>
                  
                  <Link 
                    href="/pricing"
                    className="text-white/60 hover:text-white transition-colors flex items-center gap-2"
                  >
                    Ou voir la formation
                    <div className="w-4 h-4"><Icons.ArrowRight /></div>
                  </Link>
                </div>

                {/* Trust */}
                <div className="flex items-center justify-center gap-6 mt-8 text-white/40 text-sm">
                  <span>🔒 Paiement sécurisé</span>
                  <span>•</span>
                  <span>📧 Support réactif</span>
                  <span>•</span>
                  <span>✅ Garantie 30 jours</span>
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
