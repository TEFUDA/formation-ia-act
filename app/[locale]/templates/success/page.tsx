'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

const Icons = {
  Shield: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  Check: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-full h-full"><polyline points="20 6 9 17 4 12"/></svg>,
  ArrowRight: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
  Download: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
};

const NeuralBackground = () => (
  <div className="fixed inset-0 pointer-events-none overflow-hidden">
    <div className="absolute inset-0 bg-[#030014]" />
    <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-[#00FF88]/10 blur-[120px] rounded-full" />
    <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[#8B5CF6]/8 blur-[100px] rounded-full" />
  </div>
);

const HoloCard = ({ children, glow = '#00F5FF', className = '' }: { children: React.ReactNode, glow?: string, className?: string }) => (
  <div className={`relative group ${className}`}>
    <div className="absolute -inset-[1px] rounded-2xl opacity-50" style={{ background: `linear-gradient(135deg, ${glow}40, transparent 50%, ${glow}40)` }} />
    <div className="relative bg-[#0A0A1B]/90 backdrop-blur-xl rounded-2xl border border-white/5 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent" />
      <div className="relative">{children}</div>
    </div>
  </div>
);

const CountdownTimer = ({ minutes }: { minutes: number }) => {
  const [timeLeft, setTimeLeft] = useState(minutes * 60);
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);
  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  return (
    <div className="bg-[#FF4444]/20 px-3 py-1 rounded-lg">
      <span className="text-[#FF4444] font-mono font-bold text-lg">{String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}</span>
    </div>
  );
};

const TEMPLATES = {
  essentiel: [
    { name: 'Template Registre IA', file: 'template-registre-ia.xlsx' },
    { name: 'Modèle Politique IA', file: 'modele-politique-ia.docx' },
    { name: 'Matrice Classification Risques', file: 'matrice-classification-risques.xlsx' },
    { name: 'Checklist Êtes-vous concerné', file: 'checklist-etes-vous-concerne.xlsx' },
    { name: 'Template Documentation Technique', file: 'template-documentation-technique.docx' },
    { name: 'Fiche Poste Référent IA', file: 'fiche-poste-referent-ia.docx' },
  ],
  complet: [
    { name: 'Template Registre IA', file: 'template-registre-ia.xlsx' },
    { name: 'Modèle Politique IA', file: 'modele-politique-ia.docx' },
    { name: 'Matrice Classification Risques', file: 'matrice-classification-risques.xlsx' },
    { name: 'Checklist Êtes-vous concerné', file: 'checklist-etes-vous-concerne.xlsx' },
    { name: 'Template Documentation Technique', file: 'template-documentation-technique.docx' },
    { name: 'Fiche Poste Référent IA', file: 'fiche-poste-referent-ia.docx' },
    { name: 'Guide AI Act Synthèse', file: 'guide-ai-act-synthese.pdf' },
    { name: 'Plan Audit Type', file: 'plan-audit-type.xlsx' },
    { name: 'Tableau Bord Conformité', file: 'tableau-bord-conformite-ia.xlsx' },
    { name: 'Guide Audit Pas à Pas', file: 'guide-audit-pas-a-pas.pdf' },
    { name: 'Checklist Marquage CE', file: 'checklist-marquage-ce.xlsx' },
    { name: 'Exemples Secteurs Activité', file: 'exemples-secteurs-activite.pdf' },
  ],
};

export default function TemplatesSuccessPage() {
  const searchParams = useSearchParams();
  const pack = searchParams.get('pack') || 'complet';
  const [upsell1Dismissed, setUpsell1Dismissed] = useState(false);
  const [showDownloads, setShowDownloads] = useState(false);

  const packInfo: Record<string, { name: string; templates: number }> = {
    essentiel: { name: 'Essentiel', templates: 6 },
    complet: { name: 'Complet', templates: 12 },
    bundle: { name: 'Bundle Formation', templates: 12 },
  };

  const currentPack = packInfo[pack] || packInfo.complet;
  const isBundle = pack === 'bundle';
  const templates = pack === 'essentiel' ? TEMPLATES.essentiel : TEMPLATES.complet;

  return (
    <div className="min-h-screen bg-[#030014] text-white">
      <NeuralBackground />

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
        <div className="max-w-3xl mx-auto">
          
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center mb-8">
            <motion.div className="text-7xl mb-6" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, delay: 0.2 }}>🎉</motion.div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">Merci pour votre achat !</h1>
            <p className="text-white/60 text-lg mb-6">Votre Pack {currentPack.name} ({currentPack.templates} templates) est prêt.</p>

            <motion.button
              onClick={() => setShowDownloads(!showDownloads)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-3 bg-[#00FF88] text-black font-bold px-8 py-4 rounded-xl"
            >
              <div className="w-5 h-5"><Icons.Download /></div>
              {showDownloads ? 'Masquer les fichiers' : 'Télécharger mes templates'}
            </motion.button>

            {showDownloads && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mt-6">
                <HoloCard glow="#00FF88">
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-white mb-4">📁 Vos {templates.length} fichiers</h3>
                    <div className="grid gap-2">
                      {templates.map((t, i) => (
                        
                          key={i}
                          href={`/resources/${t.file}`}
                          download
                          className="flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                        >
                          <span className="text-white/80">{t.name}</span>
                          <div className="w-5 h-5 text-[#00FF88]"><Icons.Download /></div>
                        </a>
                      ))}
                    </div>
                  </div>
                </HoloCard>
              </motion.div>
            )}

            <p className="text-white/40 text-sm mt-4">📧 Un email avec le lien de téléchargement vous a également été envoyé.</p>
          </motion.div>

          <div className="flex items-center gap-4 my-12">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-white/30 text-sm">Offres exclusives pour vous</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {!isBundle && !upsell1Dismissed && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="mb-8">
              <HoloCard glow="#FF6B00">
                <div className="p-6 sm:p-8">
                  <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
                    <div className="flex items-center gap-2">
                      <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1, repeat: Infinity }} className="text-2xl">⏰</motion.div>
                      <span className="text-white/60 text-sm">Offre valable pendant</span>
                    </div>
                    <CountdownTimer minutes={30} />
                  </div>
                  <div className="flex flex-col lg:flex-row gap-6">
                    <div className="flex-1">
                      <span className="bg-[#FF6B00]/20 text-[#FF6B00] text-xs font-bold px-3 py-1 rounded-full">UPSELL EXCLUSIF -50%</span>
                      <h3 className="text-2xl font-bold text-white my-3">🎓 Ajoutez la Formation Certifiante</h3>
                      <p className="text-white/60 mb-4">Vous avez les documents. Obtenez maintenant les <strong className="text-white">connaissances et le certificat</strong> pour les utiliser correctement.</p>
                      <div className="space-y-2 mb-6">
                        {["6 modules de formation (8h)", "Certificat officiel AI Act", "Quiz interactifs", "Accès 12 mois", "Support prioritaire"].map((f, i) => (
                          <div key={i} className="flex items-center gap-2 text-white/70 text-sm">
                            <div className="w-4 h-4 text-[#00FF88]"><Icons.Check /></div>{f}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="lg:w-64 flex flex-col justify-center">
                      <div className="text-center mb-4">
                        <div className="flex items-center justify-center gap-2 mb-1">
                          <span className="text-white/40 line-through text-lg">500€</span>
                          <span className="bg-[#FF4444] text-white text-xs font-bold px-2 py-0.5 rounded">-50%</span>
                        </div>
                        <div className="text-4xl font-bold text-[#FF6B00]">250€</div>
                        <p className="text-white/40 text-xs">HT • Paiement unique</p>
                      </div>
                      <Link href="/pricing" className="w-full py-4 bg-gradient-to-r from-[#FF6B00] to-[#FF4444] text-white font-bold rounded-xl text-center flex items-center justify-center gap-2">
                        Ajouter la formation <div className="w-5 h-5"><Icons.ArrowRight /></div>
                      </Link>
                      <button onClick={() => setUpsell1Dismissed(true)} className="text-white/30 hover:text-white/50 text-sm mt-3">Non merci</button>
                    </div>
                  </div>
                </div>
              </HoloCard>
            </motion.div>
          )}

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className="mb-8">
            <HoloCard glow="#8B5CF6">
              <div className="p-6 sm:p-8">
                <div className="flex flex-col lg:flex-row gap-6">
                  <div className="flex-1">
                    <span className="bg-[#8B5CF6]/20 text-[#8B5CF6] text-xs font-bold px-3 py-1 rounded-full">NOUVEAU</span>
                    <h3 className="text-2xl font-bold text-white my-3">🔍 Audit Automatisé de Conformité</h3>
                    <p className="text-white/60 mb-4">Vous avez les templates, mais <strong className="text-white">êtes-vous vraiment conforme ?</strong> Notre audit analyse votre situation en 15 minutes.</p>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {[{ icon: "📋", text: "30 questions" }, { icon: "📊", text: "Score détaillé" }, { icon: "📄", text: "Rapport PDF" }, { icon: "🎯", text: "Plan d'action" }].map((item, i) => (
                        <div key={i} className="flex items-center gap-2 text-white/70 text-sm"><span>{item.icon}</span>{item.text}</div>
                      ))}
                    </div>
                  </div>
                  <div className="lg:w-64 flex flex-col justify-center">
                    <div className="text-center mb-4">
                      <p className="text-white/40 text-sm mb-1">À partir de</p>
                      <div className="text-4xl font-bold text-[#8B5CF6]">499€</div>
                    </div>
                    <Link href="/audit" className="w-full py-4 bg-[#8B5CF6] text-white font-bold rounded-xl text-center flex items-center justify-center gap-2">
                      Découvrir l'audit <div className="w-5 h-5"><Icons.ArrowRight /></div>
                    </Link>
                  </div>
                </div>
              </div>
            </HoloCard>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="text-center">
            <p className="text-white/40 text-sm">Une question ? <a href="mailto:support@formation-ia-act.fr" className="text-[#00F5FF] hover:underline">support@formation-ia-act.fr</a></p>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
