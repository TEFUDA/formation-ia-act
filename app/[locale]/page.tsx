'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const Icons = {
  Shield: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  Check: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-full h-full"><polyline points="20 6 9 17 4 12"/></svg>,
  ArrowRight: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
  Menu: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,
  X: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
};

const calculateDaysUntil = () => {
  const deadline = new Date('2026-08-02');
  const today = new Date();
  const diffTime = deadline.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

const NeuralBackground = () => (
  <div className="fixed inset-0 pointer-events-none overflow-hidden">
    <div className="absolute inset-0 bg-[#030014]" />
    <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-[#8B5CF6]/10 blur-[120px]" />
    <div className="absolute bottom-[-20%] right-[-10%] w-[800px] h-[800px] rounded-full bg-[#00F5FF]/8 blur-[150px]" />
    <div className="absolute top-[40%] left-[50%] w-[400px] h-[400px] rounded-full bg-[#00FF88]/5 blur-[100px]" />
  </div>
);

const HoloCard = ({ children, glow = '#00F5FF', className = '' }: { children: React.ReactNode, glow?: string, className?: string }) => (
  <div className={`relative group ${className}`}>
    <div className="absolute -inset-[1px] rounded-2xl opacity-0 group-hover:opacity-60 transition-opacity duration-300" style={{ background: `linear-gradient(135deg, ${glow}40, transparent 50%, ${glow}40)` }} />
    <div className="relative bg-[#0A0A1B]/80 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent" />
      <div className="relative">{children}</div>
    </div>
  </div>
);

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [daysLeft, setDaysLeft] = useState(0);

  useEffect(() => {
    setDaysLeft(calculateDaysUntil());
  }, []);

  return (
    <div className="min-h-screen bg-[#030014] text-white overflow-x-hidden">
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

          <nav className="hidden md:flex items-center gap-8">
            <a href="#programme" className="text-white/60 hover:text-white transition-colors text-sm">Programme</a>
            <a href="#tarifs" className="text-white/60 hover:text-white transition-colors text-sm">Tarifs</a>
            <a href="#echeances" className="text-white/60 hover:text-white transition-colors text-sm">Échéances</a>
            <Link href="/login" className="text-white/60 hover:text-white transition-colors text-sm">Connexion</Link>
            <Link href="/pricing" className="bg-gradient-to-r from-[#8B5CF6] to-[#00F5FF] text-white font-bold px-5 py-2 rounded-xl text-sm hover:opacity-90 transition-opacity">
              Commencer
            </Link>
          </nav>

          <button className="md:hidden w-8 h-8 text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <Icons.X /> : <Icons.Menu />}
          </button>
        </div>

        {mobileMenuOpen && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="md:hidden absolute top-full left-0 right-0 bg-[#0A0A1B] border-b border-white/10 p-6">
            <div className="flex flex-col gap-4">
              <a href="#programme" className="text-white/60 hover:text-white transition-colors" onClick={() => setMobileMenuOpen(false)}>Programme</a>
              <a href="#tarifs" className="text-white/60 hover:text-white transition-colors" onClick={() => setMobileMenuOpen(false)}>Tarifs</a>
              <a href="#echeances" className="text-white/60 hover:text-white transition-colors" onClick={() => setMobileMenuOpen(false)}>Échéances</a>
              <Link href="/login" className="text-white/60 hover:text-white transition-colors">Connexion</Link>
              <Link href="/pricing" className="bg-gradient-to-r from-[#8B5CF6] to-[#00F5FF] text-white font-bold px-5 py-3 rounded-xl text-center">Commencer</Link>
            </div>
          </motion.div>
        )}
      </header>

      {/* Hero */}
      <section className="relative z-10 px-6 pt-16 pb-24">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-full px-4 py-2 mb-8">
            <span className="animate-pulse w-2 h-2 bg-red-500 rounded-full" />
            <span className="text-red-400 text-sm font-medium">L&apos;AI Act est en vigueur depuis février 2025</span>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Mettez votre entreprise en<br/>
            <span className="bg-gradient-to-r from-[#8B5CF6] via-[#00F5FF] to-[#00FF88] text-transparent bg-clip-text">conformité AI Act</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-xl text-white/60 mb-8 max-w-3xl mx-auto">
            La solution tout-en-un : Formation 8h + 12 Templates + 12 Vidéos pratiques + Audit complet + Certificat. Tout ce dont vous avez besoin pour éviter les sanctions.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
            <Link href="/pricing" className="w-full sm:w-auto bg-gradient-to-r from-[#8B5CF6] to-[#00F5FF] text-white font-bold px-8 py-4 rounded-xl text-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
              Découvrir l&apos;offre à 4 900€
              <div className="w-5 h-5"><Icons.ArrowRight /></div>
            </Link>
            <a href="#programme" className="w-full sm:w-auto bg-white/5 border border-white/10 text-white font-medium px-8 py-4 rounded-xl text-lg hover:bg-white/10 transition-colors">
              Voir le programme
            </a>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="flex flex-wrap items-center justify-center gap-6 text-white/40 text-sm">
            <div className="flex items-center gap-2"><span className="text-green-400">✓</span>Éligible OPCO</div>
            <div className="flex items-center gap-2"><span className="text-green-400">✓</span>Certificat inclus</div>
            <div className="flex items-center gap-2"><span className="text-green-400">✓</span>12 Templates</div>
            <div className="flex items-center gap-2"><span className="text-green-400">✓</span>Audit complet</div>
          </motion.div>
        </div>
      </section>

      {/* Risques */}
      <section className="relative z-10 px-6 py-20 bg-gradient-to-b from-transparent to-red-500/5">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">⚠️ Les risques de <span className="text-red-400">non-conformité</span></h2>
            <p className="text-white/60">L&apos;AI Act prévoit des sanctions parmi les plus lourdes au monde</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { label: "Pratiques interdites", amount: "35M€", percent: "7% du CA mondial", color: "#FF4444", bg: "rgba(255,68,68,0.1)", border: "rgba(255,68,68,0.2)" },
              { label: "Systèmes haut risque", amount: "15M€", percent: "3% du CA mondial", color: "#FF6B00", bg: "rgba(255,107,0,0.1)", border: "rgba(255,107,0,0.2)" },
              { label: "Autres obligations", amount: "7,5M€", percent: "1,5% du CA mondial", color: "#FFB800", bg: "rgba(255,184,0,0.1)", border: "rgba(255,184,0,0.2)" },
            ].map((risk, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="rounded-2xl p-6 text-center" style={{ backgroundColor: risk.bg, border: `1px solid ${risk.border}` }}>
                <p className="text-white/60 mb-2">{risk.label}</p>
                <p className="text-4xl font-bold mb-1" style={{ color: risk.color }}>{risk.amount}</p>
                <p className="text-white/40 text-sm">ou {risk.percent}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Programme */}
      <section id="programme" className="relative z-10 px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Une solution <span className="text-[#00F5FF]">tout-en-un</span></h2>
            <p className="text-white/60 max-w-2xl mx-auto">Tout ce dont vous avez besoin pour être conforme, dans un seul pack</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: "🎓", title: "Formation complète", desc: "8h de modules vidéo pour maîtriser l'AI Act de A à Z", details: ["6 modules progressifs", "Quiz de validation", "Certificat officiel"], color: "#8B5CF6" },
              { icon: "📋", title: "12 Templates", desc: "Documents juridiques prêts à l'emploi et personnalisables", details: ["Registre IA", "Politique IA", "FRIA", "Et 9 autres..."], color: "#00F5FF" },
              { icon: "🎬", title: "Vidéos pratiques", desc: "Tutos écran pour chaque template, étape par étape", details: ["1 vidéo par template", "Exemples concrets", "Cas pratiques"], color: "#00FF88" },
              { icon: "📊", title: "Audit complet", desc: "Évaluez votre conformité et obtenez un plan d'action", details: ["50+ questions", "Rapport PDF", "Recommandations"], color: "#FFB800" },
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <HoloCard glow={item.color}>
                  <div className="p-6">
                    <div className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl mb-4" style={{ backgroundColor: `${item.color}20` }}>{item.icon}</div>
                    <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                    <p className="text-white/60 text-sm mb-4">{item.desc}</p>
                    <ul className="space-y-2">
                      {item.details.map((detail, j) => (
                        <li key={j} className="flex items-center gap-2 text-sm text-white/50">
                          <span style={{ color: item.color }}>✓</span>{detail}
                        </li>
                      ))}
                    </ul>
                  </div>
                </HoloCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tarifs Preview */}
      <section id="tarifs" className="relative z-10 px-6 py-20 bg-gradient-to-b from-transparent to-[#8B5CF6]/5">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Un prix, <span className="text-[#00F5FF]">tout inclus</span></h2>
            <p className="text-white/60 mb-8">Pas de surprises, pas d&apos;options cachées</p>

            <HoloCard glow="#8B5CF6">
              <div className="p-8">
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
                  <span className="text-5xl font-bold">4 900€</span>
                  <span className="text-white/40">HT / personne</span>
                </div>
                <p className="text-[#00FF88] font-medium mb-6">💰 Éligible au financement OPCO - Jusqu&apos;à 50% remboursé</p>
                <div className="flex flex-wrap justify-center gap-4 text-sm text-white/60 mb-8">
                  <span>✓ Formation 8h</span>
                  <span>✓ 12 Templates</span>
                  <span>✓ Vidéos pratiques</span>
                  <span>✓ Audit complet</span>
                  <span>✓ Certificat</span>
                </div>
                <Link href="/pricing" className="inline-flex items-center gap-2 bg-gradient-to-r from-[#8B5CF6] to-[#00F5FF] text-white font-bold px-8 py-4 rounded-xl text-lg hover:opacity-90 transition-opacity">
                  Voir tous les tarifs
                  <div className="w-5 h-5"><Icons.ArrowRight /></div>
                </Link>
              </div>
            </HoloCard>

            <p className="text-white/40 text-sm mt-6">Offres Équipe (5 places - 19 500€) et Entreprise (50 places - sur devis) disponibles</p>
          </motion.div>
        </div>
      </section>

      {/* Échéances */}
      <section id="echeances" className="relative z-10 px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">📅 Les échéances <span className="text-red-400">arrivent vite</span></h2>
            <p className="text-white/60">Plus que <span className="text-[#00F5FF] font-bold">{daysLeft} jours</span> avant l&apos;échéance principale</p>
          </motion.div>

          <div className="space-y-4">
            {[
              { date: "Février 2025", desc: "Pratiques interdites + Obligation de formation (Article 4)", status: "active", color: "#FF4444" },
              { date: "Août 2025", desc: "Règles pour les modèles GPAI (ChatGPT, Claude...)", status: "soon", color: "#FF6B00" },
              { date: "Août 2026", desc: "Toutes les règles pour les systèmes à haut risque", status: "upcoming", color: "#FFB800" },
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="flex items-center gap-4 bg-white/5 rounded-xl p-4 border border-white/5">
                <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                <div className="flex-1">
                  <span className="font-bold" style={{ color: item.color }}>{item.date}</span>
                  <span className="text-white/60 ml-3">{item.desc}</span>
                </div>
                {item.status === "active" && <span className="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded-full">EN VIGUEUR</span>}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <HoloCard glow="#00FF88">
              <div className="p-8 sm:p-12 text-center">
                <h2 className="text-3xl sm:text-4xl font-bold mb-4">Prêt à vous mettre en conformité ?</h2>
                <p className="text-white/60 mb-8 max-w-2xl mx-auto">Rejoignez les entreprises qui anticipent la réglementation plutôt que de la subir.</p>
                <Link href="/pricing" className="inline-flex items-center gap-2 bg-white text-[#030014] font-bold px-8 py-4 rounded-xl text-lg hover:bg-white/90 transition-colors">
                  Commencer maintenant
                  <div className="w-5 h-5"><Icons.ArrowRight /></div>
                </Link>
              </div>
            </HoloCard>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 px-6 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-[#00F5FF] to-[#0066FF] rounded-lg flex items-center justify-center">
                  <div className="w-4 h-4 text-white"><Icons.Shield /></div>
                </div>
                <span className="font-semibold">Formation-IA-Act.fr</span>
              </div>
              <p className="text-white/30 text-sm">La formation de référence sur l&apos;AI Act européen.</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Formation</h4>
              <ul className="space-y-2 text-sm text-white/30">
                <li><a href="#programme" className="hover:text-white transition-colors">Programme</a></li>
                <li><a href="#tarifs" className="hover:text-white transition-colors">Tarifs</a></li>
                <li><Link href="/partenaires" className="hover:text-white transition-colors">Partenaires</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Légal</h4>
              <ul className="space-y-2 text-sm text-white/30">
                <li><a href="#" className="hover:text-white transition-colors">Mentions légales</a></li>
                <li><a href="#" className="hover:text-white transition-colors">CGV</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Confidentialité</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-sm text-white/30">
                <li><a href="mailto:contact@formation-ia-act.fr" className="hover:text-white transition-colors">contact@formation-ia-act.fr</a></li>
              </ul>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6 py-6 border-t border-white/5 mb-6">
            {[
              { text: 'Éligible OPCO', color: '#00FF88' },
              { text: 'Paiement Stripe', color: '#00F5FF' },
              { text: 'Garantie 14 jours', color: '#FFB800' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-white/30 text-sm">
                <div className="w-2 h-2 rounded-full" style={{ background: item.color }} />
                {item.text}
              </div>
            ))}
          </div>
          <div className="text-center text-sm text-white/20">
            <p>© 2025 Formation-IA-Act.fr • Organisme de formation</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
