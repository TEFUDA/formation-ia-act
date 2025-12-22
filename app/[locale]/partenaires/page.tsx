'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

const Icons = {
  Shield: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  ArrowRight: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
  ArrowLeft: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>,
  Check: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-full h-full"><polyline points="20 6 9 17 4 12"/></svg>,
  Mail: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
};

const partners = [
  {
    id: 1,
    name: "Cabinet Dupont & Associés",
    type: "Cabinet d'avocats",
    specialty: "Droit du numérique & IA",
    location: "Paris",
    description: "Spécialisé en droit des nouvelles technologies depuis 2010. Expertise reconnue sur le RGPD et l'AI Act.",
    services: ["Audit juridique complet", "Mise en conformité", "DPO externalisé", "Formation sur-mesure"],
    color: "#8B5CF6",
  },
  {
    id: 2,
    name: "AI Compliance Partners",
    type: "Cabinet de conseil",
    specialty: "Conformité IA & Data",
    location: "Lyon / Paris",
    description: "Équipe pluridisciplinaire (juristes, data scientists, ingénieurs) dédiée à la conformité IA.",
    services: ["Cartographie des systèmes IA", "Classification des risques", "Documentation technique", "Accompagnement certification"],
    color: "#00F5FF",
  },
  {
    id: 3,
    name: "Legal Tech Conseil",
    type: "Cabinet de conseil juridique",
    specialty: "RegTech & Compliance",
    location: "Bordeaux / Remote",
    description: "Approche innovante de la conformité avec des outils digitaux. Spécialistes des secteurs réglementés.",
    services: ["Audit flash AI Act", "Veille réglementaire", "Tableaux de bord conformité", "Formation équipes"],
    color: "#00FF88",
  },
];

const services = [
  { icon: "🔍", title: "Audit sur site", desc: "Analyse approfondie de vos systèmes IA par des experts", color: "#8B5CF6" },
  { icon: "📋", title: "Mise en conformité", desc: "Accompagnement complet jusqu'à la conformité totale", color: "#00F5FF" },
  { icon: "👤", title: "DPO externalisé", desc: "Un délégué à la protection des données dédié", color: "#00FF88" },
  { icon: "🎓", title: "Formation sur-mesure", desc: "Sessions de formation adaptées à votre secteur", color: "#FFB800" },
  { icon: "📄", title: "Documentation", desc: "Rédaction de toute la documentation requise", color: "#FF6B00" },
  { icon: "⚖️", title: "Veille juridique", desc: "Suivi des évolutions réglementaires", color: "#FF4444" },
];

const NeuralBackground = () => (
  <div className="fixed inset-0 pointer-events-none overflow-hidden">
    <div className="absolute inset-0 bg-[#030014]" />
    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#8B5CF6]/8 blur-[120px] rounded-full" />
    <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#00FF88]/6 blur-[100px] rounded-full" />
  </div>
);

const HoloCard = ({ children, glow = '#8B5CF6', className = '' }: { children: React.ReactNode, glow?: string, className?: string }) => (
  <div className={`relative group ${className}`}>
    <div className="absolute -inset-[1px] rounded-2xl opacity-0 group-hover:opacity-60 transition-opacity duration-300" style={{ background: `linear-gradient(135deg, ${glow}40, transparent 50%, ${glow}40)` }} />
    <div className="relative bg-[#0A0A1B]/90 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden h-full">
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent" />
      <div className="relative h-full">{children}</div>
    </div>
  </div>
);

export default function PartenairesPage() {
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
            <Link href="/pricing" className="text-white/60 hover:text-white text-sm transition-colors flex items-center gap-2">
              <div className="w-4 h-4"><Icons.ArrowLeft /></div>
              <span className="hidden sm:inline">Retour aux tarifs</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="relative z-10 px-6 py-16">
        <div className="max-w-6xl mx-auto">
          
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
            <span className="text-5xl mb-4 block">🤝</span>
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              Nos <span className="bg-gradient-to-r from-[#8B5CF6] to-[#00F5FF] text-transparent bg-clip-text">cabinets partenaires</span>
            </h1>
            <p className="text-xl text-white/60 max-w-2xl mx-auto">
              Pour un accompagnement personnalisé au-delà de la formation, nous travaillons avec des experts reconnus de l&apos;AI Act.
            </p>
          </motion.div>

          {/* Quand faire appel */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16">
            <HoloCard glow="#FFB800">
              <div className="p-8">
                <h2 className="text-xl font-bold mb-6 text-center">💡 Quand faire appel à un cabinet partenaire ?</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-[#00FF88] mb-3">Notre formation vous suffit si :</h3>
                    <ul className="space-y-2 text-white/70 text-sm">
                      <li className="flex items-start gap-2"><span className="text-[#00FF88]">✓</span>Vous avez moins de 10 systèmes IA à gérer</li>
                      <li className="flex items-start gap-2"><span className="text-[#00FF88]">✓</span>Vous pouvez dédier du temps à la conformité</li>
                      <li className="flex items-start gap-2"><span className="text-[#00FF88]">✓</span>Vos systèmes sont principalement à risque limité</li>
                      <li className="flex items-start gap-2"><span className="text-[#00FF88]">✓</span>Vous avez des ressources juridiques internes</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#8B5CF6] mb-3">Un cabinet est recommandé si :</h3>
                    <ul className="space-y-2 text-white/70 text-sm">
                      <li className="flex items-start gap-2"><span className="text-[#8B5CF6]">→</span>Vous avez des systèmes classés haut risque</li>
                      <li className="flex items-start gap-2"><span className="text-[#8B5CF6]">→</span>Vous êtes dans un secteur très réglementé (santé, finance...)</li>
                      <li className="flex items-start gap-2"><span className="text-[#8B5CF6]">→</span>Vous manquez de temps ou de ressources internes</li>
                      <li className="flex items-start gap-2"><span className="text-[#8B5CF6]">→</span>Vous avez besoin d&apos;une certification externe</li>
                    </ul>
                  </div>
                </div>
              </div>
            </HoloCard>
          </motion.div>

          {/* Services */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16">
            <h2 className="text-2xl font-bold text-center mb-8">Services proposés par nos partenaires</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {services.map((service, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
                  <HoloCard glow={service.color}>
                    <div className="p-5 flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0" style={{ background: `${service.color}15` }}>{service.icon}</div>
                      <div>
                        <p className="font-semibold text-white">{service.title}</p>
                        <p className="text-white/50 text-sm">{service.desc}</p>
                      </div>
                    </div>
                  </HoloCard>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Partenaires */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16">
            <h2 className="text-2xl font-bold text-center mb-8">Nos partenaires certifiés</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {partners.map((partner, i) => (
                <motion.div key={partner.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                  <HoloCard glow={partner.color}>
                    <div className="p-6 h-full flex flex-col">
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs px-2 py-1 rounded-full" style={{ background: `${partner.color}20`, color: partner.color }}>{partner.type}</span>
                          <span className="text-white/40 text-xs">📍 {partner.location}</span>
                        </div>
                        <h3 className="text-xl font-bold text-white">{partner.name}</h3>
                        <p className="text-sm" style={{ color: partner.color }}>{partner.specialty}</p>
                      </div>
                      <p className="text-white/60 text-sm mb-4 flex-grow">{partner.description}</p>
                      <div className="space-y-2 mb-4">
                        {partner.services.map((service, j) => (
                          <div key={j} className="flex items-center gap-2 text-sm text-white/70">
                            <span style={{ color: partner.color }}>✓</span>{service}
                          </div>
                        ))}
                      </div>
                      <a href={`mailto:contact@formation-ia-act.fr?subject=Mise en relation - ${partner.name}`} className="w-full py-3 rounded-xl font-medium text-center transition-all block text-sm" style={{ background: `${partner.color}20`, color: partner.color, border: `1px solid ${partner.color}40` }}>
                        Demander une mise en relation
                      </a>
                    </div>
                  </HoloCard>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Devenir partenaire */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16">
            <HoloCard glow="#00FF88">
              <div className="p-8 text-center">
                <span className="text-4xl mb-4 block">🚀</span>
                <h2 className="text-2xl font-bold mb-4">Vous êtes un cabinet spécialisé AI Act ?</h2>
                <p className="text-white/60 max-w-2xl mx-auto mb-6">
                  Rejoignez notre réseau de partenaires et accédez à des clients qualifiés, déjà sensibilisés aux enjeux de l&apos;AI Act grâce à notre formation.
                </p>
                <div className="flex flex-wrap justify-center gap-4 text-sm text-white/60 mb-6">
                  <span>✓ Leads qualifiés</span>
                  <span>✓ Visibilité premium</span>
                  <span>✓ Co-marketing</span>
                  <span>✓ Commission sur recommandations</span>
                </div>
                <a href="mailto:partenaires@formation-ia-act.fr?subject=Devenir partenaire" className="inline-flex items-center gap-2 bg-[#00FF88] text-black font-bold px-6 py-3 rounded-xl hover:bg-[#00FF88]/90 transition-colors">
                  <div className="w-5 h-5"><Icons.Mail /></div>
                  Devenir partenaire
                </a>
              </div>
            </HoloCard>
          </motion.div>

          {/* CTA retour */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center">
            <p className="text-white/60 mb-4">Pas besoin d&apos;un cabinet pour le moment ?</p>
            <Link href="/pricing" className="inline-flex items-center gap-2 text-[#00F5FF] hover:underline">
              <div className="w-4 h-4"><Icons.ArrowLeft /></div>
              Retour aux tarifs de la formation
            </Link>
          </motion.div>

        </div>
      </main>

      {/* Footer */}
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
