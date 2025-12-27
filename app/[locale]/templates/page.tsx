'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

const Icons = {
  Shield: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  ArrowRight: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
  ArrowLeft: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>,
  Lock: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
};

const templates = [
  { id: 1, name: "Registre IA", type: "Excel", icon: "📊", category: "Inventaire", desc: "Inventaire complet de vos systèmes IA" },
  { id: 2, name: "Politique IA Entreprise", type: "Word", icon: "📄", category: "Gouvernance", desc: "Politique d'utilisation de l'IA" },
  { id: 3, name: "FRIA (Analyse d'Impact)", type: "Word", icon: "⚠️", category: "Risques", desc: "Fundamental Rights Impact Assessment" },
  { id: 4, name: "Documentation Technique", type: "Word", icon: "📋", category: "Documentation", desc: "Documentation pour systèmes haut risque" },
  { id: 5, name: "Processus de Validation", type: "Word", icon: "✅", category: "Processus", desc: "Validation des systèmes IA" },
  { id: 6, name: "Contrat Fournisseur IA", type: "Word", icon: "🤝", category: "Juridique", desc: "Clauses contractuelles AI Act" },
  { id: 7, name: "Notice de Transparence", type: "Word", icon: "👁️", category: "Transparence", desc: "Information des utilisateurs" },
  { id: 8, name: "Plan Formation Article 4", type: "Word", icon: "🎓", category: "Formation", desc: "Plan de formation obligatoire" },
  { id: 9, name: "Procédure Supervision Humaine", type: "Word", icon: "👤", category: "Supervision", desc: "Contrôle humain des systèmes IA" },
  { id: 10, name: "Registre des Incidents", type: "Excel", icon: "🚨", category: "Incidents", desc: "Suivi des incidents IA" },
  { id: 11, name: "Checklist Conformité", type: "Excel", icon: "✓", category: "Audit", desc: "Vérification point par point" },
  { id: 12, name: "Rapport Audit Interne", type: "Word", icon: "📝", category: "Audit", desc: "Modèle de rapport d'audit" },
];

const NeuralBackground = () => (
  <div className="fixed inset-0 pointer-events-none overflow-hidden">
    <div className="absolute inset-0 bg-[#030014]" />
    <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#00F5FF]/5 blur-[120px] rounded-full" />
    <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-[#8B5CF6]/5 blur-[100px] rounded-full" />
  </div>
);

const HoloCard = ({ children, glow = '#00F5FF', className = '' }: { children: React.ReactNode, glow?: string, className?: string }) => (
  <div className={`relative group ${className}`}>
    <div className="absolute -inset-[1px] rounded-2xl opacity-0 group-hover:opacity-40 transition-opacity duration-300" style={{ background: `linear-gradient(135deg, ${glow}40, transparent 50%, ${glow}40)` }} />
    <div className="relative bg-[#0A0A1B]/90 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden h-full">
      <div className="relative h-full">{children}</div>
    </div>
  </div>
);

export default function TemplatesPage() {
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
            <span className="text-5xl mb-4 block">📋</span>
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              12 Templates <span className="text-[#00F5FF]">juridiques</span>
            </h1>
            <p className="text-xl text-white/60 max-w-2xl mx-auto mb-6">
              Tous les documents dont vous avez besoin pour votre conformité AI Act, prêts à l&apos;emploi et personnalisables.
            </p>
            
            {/* Included badge */}
            <div className="inline-flex items-center gap-2 bg-[#00FF88]/10 border border-[#00FF88]/20 rounded-full px-5 py-2.5">
              <span className="text-[#00FF88] text-lg">✓</span>
              <span className="text-[#00FF88] font-medium">Inclus dans la formation à 4 990€</span>
            </div>
          </motion.div>

          {/* Templates Grid */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {templates.map((template, i) => (
                <motion.div key={template.id} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.03 }}>
                  <HoloCard glow="#00F5FF">
                    <div className="p-5">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-xl">{template.icon}</div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-white text-sm">{template.name}</h3>
                          <p className="text-white/40 text-xs">{template.type} • {template.category}</p>
                        </div>
                      </div>
                      <p className="text-white/50 text-sm mb-3">{template.desc}</p>
                      <div className="flex items-center gap-2 text-white/30 text-xs">
                        <div className="w-4 h-4"><Icons.Lock /></div>
                        <span>Accès avec la formation</span>
                      </div>
                    </div>
                  </HoloCard>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Ce qui accompagne les templates */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16">
            <HoloCard glow="#8B5CF6">
              <div className="p-8">
                <h2 className="text-xl font-bold text-center mb-8">🎬 Chaque template est accompagné d&apos;une vidéo pratique</h2>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-full bg-[#8B5CF6]/10 flex items-center justify-center text-3xl mx-auto mb-4">📄</div>
                    <h3 className="font-semibold mb-2">Template Word/Excel</h3>
                    <p className="text-white/60 text-sm">Document modifiable, prêt à personnaliser avec vos informations</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-full bg-[#8B5CF6]/10 flex items-center justify-center text-3xl mx-auto mb-4">🎬</div>
                    <h3 className="font-semibold mb-2">Vidéo tuto (5-10 min)</h3>
                    <p className="text-white/60 text-sm">Explication pas à pas de comment remplir le document</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-full bg-[#8B5CF6]/10 flex items-center justify-center text-3xl mx-auto mb-4">✅</div>
                    <h3 className="font-semibold mb-2">Exemple rempli</h3>
                    <p className="text-white/60 text-sm">Un exemple concret pour vous guider</p>
                  </div>
                </div>
              </div>
            </HoloCard>
          </motion.div>

          {/* CTA */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <HoloCard glow="#00FF88">
              <div className="p-8 text-center">
                <h2 className="text-2xl font-bold mb-4">Obtenez les 12 templates + la formation complète</h2>
                <p className="text-white/60 max-w-2xl mx-auto mb-6">
                  Les templates sont inclus dans notre offre tout-en-un avec la formation 8h, les vidéos pratiques, l&apos;audit et le certificat.
                </p>
                <div className="flex flex-wrap justify-center gap-4 text-sm text-white/50 mb-8">
                  <span>✓ 12 Templates</span>
                  <span>✓ 12 Vidéos tutos</span>
                  <span>✓ Formation 8h</span>
                  <span>✓ Audit complet</span>
                  <span>✓ Certificat</span>
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link href="/pricing" className="bg-gradient-to-r from-[#00FF88] to-[#00F5FF] text-black font-bold px-8 py-4 rounded-xl flex items-center gap-2 hover:opacity-90 transition-opacity">
                    Voir l&apos;offre à 4 990€
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
