'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

const Icons = {
  Shield: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  ArrowRight: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
  ArrowLeft: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>,
  Check: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-full h-full"><polyline points="20 6 9 17 4 12"/></svg>,
  Download: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
};

const steps = [
  {
    num: 1,
    title: "Vérifiez votre éligibilité",
    desc: "Toute entreprise cotisant à un OPCO peut bénéficier d'une prise en charge. Nous sommes certifiés Qualiopi, ce qui garantit l'éligibilité.",
    icon: "✅",
    color: "#00FF88",
  },
  {
    num: 2,
    title: "Demandez votre devis",
    desc: "Remplissez notre formulaire ou contactez-nous. Nous vous envoyons un devis détaillé sous 24h avec tous les documents nécessaires.",
    icon: "📄",
    color: "#00F5FF",
  },
  {
    num: 3,
    title: "Soumettez à votre OPCO",
    desc: "Transmettez notre devis et programme à votre OPCO. Nous pouvons vous accompagner dans cette démarche si besoin.",
    icon: "📤",
    color: "#8B5CF6",
  },
  {
    num: 4,
    title: "Obtenez l'accord de prise en charge",
    desc: "Votre OPCO vous notifie le montant pris en charge (généralement 30% à 100% selon votre branche et la taille de votre entreprise).",
    icon: "🎯",
    color: "#FFB800",
  },
  {
    num: 5,
    title: "Démarrez la formation",
    desc: "Une fois l'accord obtenu, vous accédez immédiatement à la plateforme. La facturation se fait directement à l'OPCO ou à vous avec remboursement.",
    icon: "🚀",
    color: "#FF6B00",
  },
];

const opcos = [
  { name: "OPCO EP", sectors: "Services, Conseil, IT", color: "#00F5FF" },
  { name: "ATLAS", sectors: "Banque, Assurance, Conseil", color: "#8B5CF6" },
  { name: "AKTO", sectors: "Services aux entreprises", color: "#00FF88" },
  { name: "OPCO 2i", sectors: "Industrie", color: "#FFB800" },
  { name: "OPCO Santé", sectors: "Santé, Médico-social", color: "#FF6B00" },
  { name: "AFDAS", sectors: "Médias, Communication", color: "#FF4444" },
  { name: "OPCOMMERCE", sectors: "Commerce, Distribution", color: "#00F5FF" },
  { name: "Uniformation", sectors: "Économie sociale", color: "#8B5CF6" },
];

const faqs = [
  {
    q: "Qu'est-ce que Qualiopi ?",
    a: "Qualiopi est la certification nationale qualité des organismes de formation. Elle garantit la qualité de nos formations et est obligatoire pour bénéficier des fonds publics de formation (OPCO, CPF...)."
  },
  {
    q: "Quel est le montant de la prise en charge ?",
    a: "Le montant varie selon votre OPCO, la taille de votre entreprise et votre branche professionnelle. En moyenne, la prise en charge est de 30% à 100%. Contactez-nous pour une estimation personnalisée."
  },
  {
    q: "Combien de temps pour obtenir l'accord ?",
    a: "Les délais varient selon les OPCO : de 48h à 3 semaines en moyenne. Nous vous conseillons d'anticiper votre demande. En cas d'urgence, vous pouvez commencer la formation et être remboursé après."
  },
  {
    q: "Puis-je commencer avant l'accord OPCO ?",
    a: "Oui ! Vous pouvez démarrer la formation immédiatement et être remboursé une fois l'accord OPCO obtenu. Notre garantie 30 jours vous couvre en cas de refus."
  },
  {
    q: "Comment trouver mon OPCO ?",
    a: "Votre OPCO dépend de votre convention collective. Vous pouvez le trouver sur votre bulletin de salaire ou nous contacter - nous vous aiderons à l'identifier."
  },
  {
    q: "Quels documents fournissez-vous ?",
    a: "Nous fournissons tous les documents requis : devis, convention de formation, programme détaillé, attestation de présence, certificat de réalisation, facture."
  },
];

const NeuralBackground = () => (
  <div className="fixed inset-0 pointer-events-none overflow-hidden">
    <div className="absolute inset-0 bg-[#030014]" />
    <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-[#00FF88]/8 blur-[120px] rounded-full" />
    <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#8B5CF6]/6 blur-[100px] rounded-full" />
  </div>
);

const HoloCard = ({ children, glow = '#00FF88', className = '' }: { children: React.ReactNode, glow?: string, className?: string }) => (
  <div className={`relative group ${className}`}>
    <div className="absolute -inset-[1px] rounded-2xl opacity-0 group-hover:opacity-60 transition-opacity duration-300" style={{ background: `linear-gradient(135deg, ${glow}40, transparent 50%, ${glow}40)` }} />
    <div className="relative bg-[#0A0A1B]/90 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden h-full">
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent" />
      <div className="relative h-full">{children}</div>
    </div>
  </div>
);

export default function QualiopiPage() {
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
            <Link href="/pricing" className="bg-gradient-to-r from-[#00FF88] to-[#00F5FF] text-black font-bold px-5 py-2 rounded-xl text-sm">
              Voir les tarifs
            </Link>
          </div>
        </div>
      </header>

      <main className="relative z-10 px-6 py-16">
        <div className="max-w-6xl mx-auto">
          
          {/* Hero */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
            <div className="inline-flex items-center gap-4 mb-6">
              <motion.div 
                className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-lg"
                animate={{ rotate: [0, 2, -2, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <div className="text-center">
                  <div className="text-3xl font-black text-[#1a1a2e]">Q</div>
                  <div className="text-[10px] font-bold text-[#E30613] uppercase">Qualiopi</div>
                </div>
              </motion.div>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              Formation <span className="text-[#00FF88]">100% finançable</span> par votre OPCO
            </h1>
            <p className="text-xl text-white/60 max-w-2xl mx-auto">
              Nous sommes certifiés Qualiopi. Votre formation peut être prise en charge jusqu&apos;à 100% par votre OPCO.
            </p>
          </motion.div>

          {/* Badges */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="flex flex-wrap justify-center gap-4 mb-16">
            {[
              { text: "Certifié Qualiopi", icon: "✅", color: "#00FF88" },
              { text: "Éligible OPCO", icon: "💰", color: "#00F5FF" },
              { text: "N° 11 75 12345 75", icon: "📋", color: "#8B5CF6" },
            ].map((badge, i) => (
              <div key={i} className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-5 py-2.5">
                <span>{badge.icon}</span>
                <span className="font-medium" style={{ color: badge.color }}>{badge.text}</span>
              </div>
            ))}
          </motion.div>

          {/* Process Steps */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16">
            <h2 className="text-2xl font-bold text-center mb-8">Comment ça marche ?</h2>
            <div className="grid md:grid-cols-5 gap-4">
              {steps.map((step, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, y: 20 }} 
                  whileInView={{ opacity: 1, y: 0 }} 
                  viewport={{ once: true }} 
                  transition={{ delay: i * 0.1 }}
                >
                  <HoloCard glow={step.color}>
                    <div className="p-5 text-center h-full flex flex-col">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg mx-auto mb-3" style={{ background: `${step.color}20`, color: step.color }}>
                        {step.num}
                      </div>
                      <div className="text-3xl mb-2">{step.icon}</div>
                      <h3 className="font-semibold text-white text-sm mb-2">{step.title}</h3>
                      <p className="text-white/50 text-xs flex-grow">{step.desc}</p>
                    </div>
                  </HoloCard>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Financing Example */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16">
            <HoloCard glow="#00FF88">
              <div className="p-8">
                <h2 className="text-2xl font-bold text-center mb-8">💰 Exemple de financement</h2>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-white/5 rounded-xl p-6 text-center border border-white/10">
                    <p className="text-white/40 text-sm mb-2">Pack Solo</p>
                    <p className="text-2xl font-bold text-white mb-4">4 990€ HT</p>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between text-white/60">
                        <span>OPCO (50%)</span>
                        <span className="text-[#00FF88]">-2 495€</span>
                      </div>
                      <div className="h-px bg-white/10" />
                      <div className="flex justify-between font-bold">
                        <span>Reste à charge</span>
                        <span className="text-[#00FF88]">2 495€</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-[#00FF88]/10 to-[#00F5FF]/10 rounded-xl p-6 text-center border-2 border-[#00FF88]/30">
                    <p className="text-[#00FF88] text-sm mb-2 font-medium">Pack Équipe ⭐</p>
                    <p className="text-2xl font-bold text-white mb-4">9 990€ HT</p>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between text-white/60">
                        <span>OPCO (100%)</span>
                        <span className="text-[#00FF88]">-9 990€</span>
                      </div>
                      <div className="h-px bg-white/10" />
                      <div className="flex justify-between font-bold">
                        <span>Reste à charge</span>
                        <motion.span 
                          className="text-[#00FF88] text-xl"
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          0€
                        </motion.span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-6 text-center border border-white/10">
                    <p className="text-white/40 text-sm mb-2">Pack Enterprise</p>
                    <p className="text-2xl font-bold text-white mb-4">Sur devis</p>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between text-white/60">
                        <span>OPCO</span>
                        <span className="text-[#00FF88]">Variable</span>
                      </div>
                      <div className="h-px bg-white/10" />
                      <div className="flex justify-between font-bold">
                        <span>Reste à charge</span>
                        <span className="text-white/60">À définir</span>
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-white/40 text-xs text-center mt-6">* Le taux de prise en charge dépend de votre OPCO et de votre convention collective</p>
              </div>
            </HoloCard>
          </motion.div>

          {/* OPCOs */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16">
            <h2 className="text-2xl font-bold text-center mb-4">Nous travaillons avec tous les OPCO</h2>
            <p className="text-white/60 text-center mb-8">Quel que soit votre secteur, nous vous accompagnons</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {opcos.map((opco, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-white/5 rounded-xl p-4 text-center border border-white/10 hover:border-white/20 transition-colors"
                >
                  <p className="font-semibold text-white mb-1">{opco.name}</p>
                  <p className="text-white/40 text-xs">{opco.sectors}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Documents fournis */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16">
            <HoloCard glow="#8B5CF6">
              <div className="p-8">
                <h2 className="text-2xl font-bold text-center mb-8">📋 Documents fournis pour votre OPCO</h2>
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {[
                    { name: "Devis détaillé", icon: "📄" },
                    { name: "Programme de formation", icon: "📚" },
                    { name: "Convention de formation", icon: "📝" },
                    { name: "Attestation d'entrée", icon: "✅" },
                    { name: "Certificat de réalisation", icon: "🎓" },
                    { name: "Facture conforme", icon: "🧾" },
                  ].map((doc, i) => (
                    <div key={i} className="flex items-center gap-3 bg-white/5 rounded-xl p-4">
                      <span className="text-2xl">{doc.icon}</span>
                      <span className="text-white/80 text-sm">{doc.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </HoloCard>
          </motion.div>

          {/* FAQ */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16">
            <h2 className="text-2xl font-bold text-center mb-8">Questions fréquentes</h2>
            <div className="space-y-3 max-w-3xl mx-auto">
              {faqs.map((faq, i) => (
                <HoloCard key={i} glow="#00F5FF">
                  <details className="group">
                    <summary className="flex items-center justify-between p-5 cursor-pointer list-none">
                      <span className="text-white font-medium pr-4">{faq.q}</span>
                      <span className="text-[#00F5FF] text-xl group-open:rotate-45 transition-transform flex-shrink-0">+</span>
                    </summary>
                    <div className="px-5 pb-5 text-white/60">{faq.a}</div>
                  </details>
                </HoloCard>
              ))}
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <HoloCard glow="#00FF88">
              <div className="p-8 sm:p-12 text-center">
                <h2 className="text-2xl font-bold mb-4">Prêt à faire financer votre formation ?</h2>
                <p className="text-white/60 mb-6 max-w-xl mx-auto">
                  Demandez votre devis personnalisé. Nous vous accompagnons dans toutes vos démarches OPCO.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link href="/pricing" className="bg-gradient-to-r from-[#00FF88] to-[#00F5FF] text-black font-bold px-8 py-4 rounded-xl flex items-center gap-2">
                    Demander un devis
                    <div className="w-5 h-5"><Icons.ArrowRight /></div>
                  </Link>
                  <a href="mailto:contact@formation-ia-act.fr?subject=Demande financement OPCO" className="text-white/60 hover:text-white transition-colors px-6 py-4">
                    Nous contacter
                  </a>
                </div>
                <p className="text-white/40 text-sm mt-6">
                  📞 Besoin d&apos;aide ? Appelez-nous : [Numéro de téléphone]
                </p>
              </div>
            </HoloCard>
          </motion.div>

        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-8 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/30 text-sm">© 2025 Formation-IA-Act.fr. Organisme de formation certifié Qualiopi.</p>
          <div className="flex items-center gap-4 text-sm text-white/40">
            <Link href="/mentions-legales" className="hover:text-white transition-colors">Mentions légales</Link>
            <Link href="/cgv" className="hover:text-white transition-colors">CGV</Link>
            <Link href="/confidentialite" className="hover:text-white transition-colors">Confidentialité</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
