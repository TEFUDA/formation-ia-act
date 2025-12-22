'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

const Icons = {
  Shield: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  ArrowRight: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
  ArrowLeft: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>,
};

const categories = [
  { icon: "📋", title: "Inventaire IA", desc: "Identifiez tous vos systèmes IA", questions: 8, color: "#00F5FF" },
  { icon: "⚠️", title: "Classification", desc: "Évaluez les niveaux de risque", questions: 10, color: "#FF6B00" },
  { icon: "🏛️", title: "Gouvernance", desc: "Organisation et responsabilités", questions: 8, color: "#8B5CF6" },
  { icon: "📄", title: "Documentation", desc: "État de votre documentation", questions: 10, color: "#00FF88" },
  { icon: "🎓", title: "Formation", desc: "Compétences de vos équipes", questions: 6, color: "#FFB800" },
  { icon: "👁️", title: "Transparence", desc: "Information des utilisateurs", questions: 8, color: "#FF4444" },
];

const features = [
  { icon: "📊", title: "Score détaillé", desc: "Score global + score par catégorie" },
  { icon: "📄", title: "Rapport PDF", desc: "30+ pages de recommandations" },
  { icon: "✅", title: "Plan d'action", desc: "Priorités et étapes concrètes" },
  { icon: "🔄", title: "Refaisable", desc: "Suivez votre progression" },
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
    <div className="absolute -inset-[1px] rounded-2xl opacity-0 group-hover:opacity-40 transition-opacity duration-300" style={{ background: `linear-gradient(135deg, ${glow}40, transparent 50%, ${glow}40)` }} />
    <div className="relative bg-[#0A0A1B]/90 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden h-full">
      <div className="relative h-full">{children}</div>
    </div>
  </div>
);

export default function AuditPage() {
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
            <Link href="/" className="text-white/60 hover:text-white text-sm transition-colors flex items-center gap-2">
              <div className="w-4 h-4"><Icons.ArrowLeft /></div>
              <span className="hidden sm:inline">Retour</span>
            </Link>
            <Link href="/login" className="text-white/60 hover:text-white text-sm transition-colors">Connexion</Link>
          </div>
        </div>
      </header>

      <main className="relative z-10 px-6 py-16">
        <div className="max-w-6xl mx-auto">
          
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <span className="text-5xl mb-4 block">🔍</span>
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              Audit de <span className="bg-gradient-to-r from-[#8B5CF6] to-[#00F5FF] text-transparent bg-clip-text">conformité AI Act</span>
            </h1>
            <p className="text-xl text-white/60 max-w-2xl mx-auto mb-6">
              Évaluez votre niveau de conformité en 15-20 minutes et obtenez un rapport PDF personnalisé avec des recommandations concrètes.
            </p>
            
            {/* Included badge */}
            <div className="inline-flex items-center gap-2 bg-[#00FF88]/10 border border-[#00FF88]/20 rounded-full px-5 py-2.5">
              <span className="text-[#00FF88] text-lg">✓</span>
              <span className="text-[#00FF88] font-medium">Inclus dans la formation à 4 900€</span>
            </div>
          </motion.div>

          {/* Categories */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16">
            <h2 className="text-2xl font-bold text-center mb-8">6 catégories analysées</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((cat, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
                  <HoloCard glow={cat.color}>
                    <div className="p-5">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{ background: `${cat.color}15` }}>{cat.icon}</div>
                        <div>
                          <h3 className="font-semibold text-white">{cat.title}</h3>
                          <p className="text-white/50 text-sm">{cat.questions} questions</p>
                        </div>
                      </div>
                      <p className="text-white/60 text-sm">{cat.desc}</p>
                    </div>
                  </HoloCard>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Features */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16">
            <h2 className="text-2xl font-bold text-center mb-8">Ce que vous obtenez</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {features.map((feature, i) => (
                <HoloCard key={i} glow="#8B5CF6">
                  <div className="p-5 text-center">
                    <div className="text-3xl mb-3">{feature.icon}</div>
                    <h3 className="font-semibold text-white mb-1">{feature.title}</h3>
                    <p className="text-white/50 text-sm">{feature.desc}</p>
                  </div>
                </HoloCard>
              ))}
            </div>
          </motion.div>

          {/* Exemple de rapport */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16">
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
                        { priority: "🟠", text: "Nommer un référent IA" },
                        { priority: "🟠", text: "Documenter les systèmes haut risque" },
                        { priority: "🟡", text: "Former les équipes (Article 4)" },
                      ].map((rec, i) => (
                        <div key={i} className="flex items-start gap-2 text-sm">
                          <span>{rec.priority}</span>
                          <span className="text-white/70">{rec.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </HoloCard>
          </motion.div>

          {/* CTA */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <HoloCard glow="#00FF88">
              <div className="p-8 text-center">
                <h2 className="text-2xl font-bold mb-4">Accédez à l&apos;audit + la formation complète</h2>
                <p className="text-white/60 max-w-2xl mx-auto mb-6">
                  L&apos;audit est inclus dans notre offre tout-en-un avec la formation 8h, les 12 templates, les vidéos pratiques et le certificat.
                </p>
                <div className="flex flex-wrap justify-center gap-4 text-sm text-white/50 mb-8">
                  <span>✓ 50+ questions</span>
                  <span>✓ Rapport PDF 30+ pages</span>
                  <span>✓ Plan d&apos;action</span>
                  <span>✓ Refaisable à volonté</span>
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link href="/pricing" className="bg-gradient-to-r from-[#8B5CF6] to-[#00F5FF] text-white font-bold px-8 py-4 rounded-xl flex items-center gap-2 hover:opacity-90 transition-opacity">
                    Voir l&apos;offre à 4 900€
                    <div className="w-5 h-5"><Icons.ArrowRight /></div>
                  </Link>
                  <Link href="/login" className="text-white/60 hover:text-white transition-colors px-6 py-4">
                    Déjà inscrit ? Connexion
                  </Link>
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
            <a href="#" className="hover:text-white transition-colors">Mentions légales</a>
            <a href="#" className="hover:text-white transition-colors">CGV</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
