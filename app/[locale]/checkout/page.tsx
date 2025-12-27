'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

// Icons
const Icons = {
  Shield: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  Check: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-full h-full"><polyline points="20 6 9 17 4 12"/></svg>,
  ArrowLeft: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>,
  Lock: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
  CreditCard: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>,
  Users: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  Award: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>,
  Clock: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  ShieldCheck: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>,
  Zap: () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
};

// Plans data - Synchronisé avec la landing page
const plansData: Record<string, { name: string; price: number; originalPrice: number; users: string; color: string; features: string[] }> = {
  solo: {
    name: 'Solo',
    price: 4990,
    originalPrice: 7500,
    users: '1',
    color: '#00F5FF',
    features: [
      'Formation complète 8h',
      '12 Templates juridiques',
      '12 Vidéos pratiques',
      'Audit + Rapport PDF',
      'Certificat officiel',
      '12 mois d\'accès'
    ],
  },
  equipe: {
    name: 'Équipe',
    price: 9990,
    originalPrice: 15000,
    users: '5',
    color: '#00FF88',
    features: [
      'Tout le pack Solo ×5',
      '5 Certificats nominatifs',
      'Dashboard équipe',
      'Audit consolidé',
      'Support prioritaire',
      'Onboarding personnalisé'
    ],
  },
};

// Neural Background
const NeuralBackground = () => {
  const [particles, setParticles] = useState<{x: number, y: number, size: number, speed: number}[]>([]);
  
  useEffect(() => {
    setParticles(Array.from({ length: 30 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 1,
      speed: Math.random() * 20 + 10,
    })));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      <div className="absolute inset-0 bg-[#0a0f1a]" />
      <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-[#00FF88]/5 blur-[100px] rounded-full" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[400px] h-[400px] bg-[#00F5FF]/5 blur-[80px] rounded-full" />
      <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'linear-gradient(rgba(0, 245, 255, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 245, 255, 0.3) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
      {particles.map((p, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-[#00FF88]"
          style={{ width: p.size, height: p.size, left: `${p.x}%`, top: `${p.y}%`, opacity: 0.2 }}
          animate={{ y: [0, -15, 0], opacity: [0.1, 0.3, 0.1] }}
          transition={{ duration: p.speed, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
};

// Glow Card
const GlowCard = ({ children, glow = '#00F5FF', className = '' }: { children: React.ReactNode, glow?: string, className?: string }) => (
  <div className={`relative group ${className}`}>
    <div className="absolute -inset-[1px] rounded-2xl opacity-30" style={{ background: `linear-gradient(135deg, ${glow}40, transparent 50%, ${glow}40)` }} />
    <div className="relative bg-[#111827]/90 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
      {children}
    </div>
  </div>
);

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const planId = searchParams.get('plan') || 'solo';
  
  const plan = plansData[planId] || plansData.solo;
  
  const [formData, setFormData] = useState({
    email: '',
    cardNumber: '',
    expiry: '',
    cvc: '',
    name: '',
    company: '',
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join(' ') : value;
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email invalide';
    }
    if (!formData.name) {
      newErrors.name = 'Nom requis';
    }
    if (!formData.cardNumber || formData.cardNumber.replace(/\s/g, '').length < 16) {
      newErrors.cardNumber = 'Numéro de carte invalide';
    }
    if (!formData.expiry || formData.expiry.length < 5) {
      newErrors.expiry = 'Date invalide';
    }
    if (!formData.cvc || formData.cvc.length < 3) {
      newErrors.cvc = 'CVC invalide';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;

    setIsProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    // Redirect to onboarding on success
    router.push('/onboarding');
  };

  // For Enterprise, show contact form instead
  if (planId === 'enterprise') {
    return (
      <div className="min-h-screen bg-[#0a0f1a] text-white flex flex-col">
        <NeuralBackground />

        {/* Header */}
        <header className="relative z-10 px-6 py-4">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#00F5FF] to-[#0066FF] rounded-xl flex items-center justify-center">
                <div className="w-5 h-5 text-white"><Icons.Shield /></div>
              </div>
              <span className="font-bold text-lg hidden sm:block">Formation-IA-Act.fr</span>
            </Link>
            <Link href="/pricing" className="flex items-center gap-2 text-white/60 hover:text-white transition-colors">
              <div className="w-5 h-5"><Icons.ArrowLeft /></div>
              Retour
            </Link>
          </div>
        </header>

        <main className="relative z-10 flex-1 flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-lg">
            <GlowCard glow="#8B5CF6">
              <div className="p-8 text-center">
                <div className="w-16 h-16 rounded-2xl bg-[#8B5CF6]/20 flex items-center justify-center mx-auto mb-6">
                  <div className="w-8 h-8 text-[#8B5CF6]"><Icons.Users /></div>
                </div>
                <h1 className="text-2xl font-bold text-white mb-2">Plan Enterprise</h1>
                <p className="text-white/50 mb-6">Pour les grandes organisations (50+ utilisateurs)</p>
                
                <div className="bg-white/5 rounded-xl p-6 mb-6 text-left">
                  <h3 className="text-white font-semibold mb-4">Ce plan inclut :</h3>
                  <ul className="space-y-2">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-white/60 text-sm">
                        <div className="w-4 h-4 text-[#8B5CF6]"><Icons.Check /></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <p className="text-white/40 text-sm mb-6">
                  Contactez notre équipe commerciale pour un devis personnalisé et une démonstration de la plateforme.
                </p>

                <a 
                  href="mailto:entreprise@formation-ia-act.fr?subject=Demande Enterprise"
                  className="block w-full py-4 bg-[#8B5CF6] text-white font-semibold rounded-xl hover:bg-[#8B5CF6]/90 transition-colors"
                >
                  Contacter l'équipe commerciale
                </a>
                
                <p className="text-white/30 text-sm mt-4">
                  Ou appelez-nous : +33 1 23 45 67 89
                </p>
              </div>
            </GlowCard>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0f1a] text-white flex flex-col">
      <NeuralBackground />

      {/* Header */}
      <header className="relative z-10 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#00F5FF] to-[#0066FF] rounded-xl flex items-center justify-center">
              <div className="w-5 h-5 text-white"><Icons.Shield /></div>
            </div>
            <span className="font-bold text-lg hidden sm:block">Formation-IA-Act.fr</span>
          </Link>
          <Link href="/#tarifs" className="flex items-center gap-2 text-white/60 hover:text-white transition-colors">
            <div className="w-5 h-5"><Icons.ArrowLeft /></div>
            Retour aux tarifs
          </Link>
        </div>
      </header>

      {/* Urgency Banner - Dynamique */}
      {(() => {
        const endDate = new Date('2025-01-31T23:59:59');
        const now = new Date();
        const diffTime = endDate.getTime() - now.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        // Message adaptatif selon les jours restants
        let urgencyMessage = '';
        let urgencyColor = 'from-[#FF4444]/20 via-[#FF6B00]/20 to-[#FFB800]/20';
        let borderColor = 'border-[#FF4444]/30';
        
        if (diffDays <= 0) {
          urgencyMessage = "⚠️ Dernières heures pour profiter du tarif de lancement !";
          urgencyColor = 'from-[#FF4444]/30 via-[#FF4444]/20 to-[#FF4444]/30';
        } else if (diffDays === 1) {
          urgencyMessage = "⏰ Dernier jour — L'offre expire demain !";
          urgencyColor = 'from-[#FF4444]/30 via-[#FF4444]/20 to-[#FF4444]/30';
        } else if (diffDays <= 3) {
          urgencyMessage = `🔥 Plus que ${diffDays} jours — Offre de lancement`;
        } else if (diffDays <= 7) {
          urgencyMessage = `⚡ J-${diffDays} — Tarif préférentiel jusqu'au 31 janvier`;
        } else {
          urgencyMessage = `🎯 Offre de lancement — Encore ${diffDays} jours pour en profiter`;
          urgencyColor = 'from-[#FFB800]/20 via-[#FF6B00]/10 to-[#FFB800]/20';
          borderColor = 'border-[#FFB800]/30';
        }
        
        return (
          <div className={`relative z-10 bg-gradient-to-r ${urgencyColor} border-y ${borderColor}`}>
            <div className="max-w-5xl mx-auto px-6 py-3 flex items-center justify-center gap-3 text-sm">
              <span className="text-white/80">
                <span className="font-semibold text-white">{urgencyMessage}</span>
                <span className="hidden sm:inline"> • </span>
                <span className="hidden sm:inline text-[#00FF88] font-bold">Économisez {(plan.originalPrice - plan.price).toLocaleString()}€</span>
              </span>
            </div>
          </div>
        );
      })()}

      {/* Main */}
      <main className="relative z-10 flex-1 px-6 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-5 gap-8">
            {/* Payment Form */}
            <div className="lg:col-span-3">
              <GlowCard glow={plan.color}>
                <form onSubmit={handleSubmit} className="p-6 sm:p-8">
                  <h1 className="text-2xl font-bold text-white mb-6">Finaliser votre commande</h1>

                  {/* Email */}
                  <div className="mb-6">
                    <label className="block text-white/60 text-sm mb-2">Adresse email *</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={e => updateField('email', e.target.value)}
                      placeholder="vous@entreprise.com"
                      className={`w-full bg-white/5 border rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none transition-colors ${errors.email ? 'border-red-500' : 'border-white/10 focus:border-[#00F5FF]/50'}`}
                    />
                    {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
                  </div>

                  {/* Company (optional) */}
                  <div className="mb-6">
                    <label className="block text-white/60 text-sm mb-2">Nom de l'entreprise (pour la facture)</label>
                    <input
                      type="text"
                      value={formData.company}
                      onChange={e => updateField('company', e.target.value)}
                      placeholder="Acme Corporation"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#00F5FF]/50 transition-colors"
                    />
                  </div>

                  {/* Payment Section */}
                  <div className="border-t border-white/10 pt-6 mb-6">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-5 h-5 text-white/60"><Icons.CreditCard /></div>
                      <h2 className="text-white font-semibold">Informations de paiement</h2>
                    </div>

                    {/* Cardholder Name */}
                    <div className="mb-4">
                      <label className="block text-white/60 text-sm mb-2">Nom sur la carte *</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={e => updateField('name', e.target.value)}
                        placeholder="Jean Dupont"
                        className={`w-full bg-white/5 border rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none transition-colors ${errors.name ? 'border-red-500' : 'border-white/10 focus:border-[#00F5FF]/50'}`}
                      />
                      {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
                    </div>

                    {/* Card Number */}
                    <div className="mb-4">
                      <label className="block text-white/60 text-sm mb-2">Numéro de carte *</label>
                      <input
                        type="text"
                        value={formData.cardNumber}
                        onChange={e => updateField('cardNumber', formatCardNumber(e.target.value))}
                        placeholder="4242 4242 4242 4242"
                        maxLength={19}
                        className={`w-full bg-white/5 border rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none transition-colors font-mono ${errors.cardNumber ? 'border-red-500' : 'border-white/10 focus:border-[#00F5FF]/50'}`}
                      />
                      {errors.cardNumber && <p className="text-red-400 text-sm mt-1">{errors.cardNumber}</p>}
                    </div>

                    {/* Expiry & CVC */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-white/60 text-sm mb-2">Date d'expiration *</label>
                        <input
                          type="text"
                          value={formData.expiry}
                          onChange={e => updateField('expiry', formatExpiry(e.target.value))}
                          placeholder="MM/AA"
                          maxLength={5}
                          className={`w-full bg-white/5 border rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none transition-colors font-mono ${errors.expiry ? 'border-red-500' : 'border-white/10 focus:border-[#00F5FF]/50'}`}
                        />
                        {errors.expiry && <p className="text-red-400 text-sm mt-1">{errors.expiry}</p>}
                      </div>
                      <div>
                        <label className="block text-white/60 text-sm mb-2">CVC *</label>
                        <input
                          type="text"
                          value={formData.cvc}
                          onChange={e => updateField('cvc', e.target.value.replace(/\D/g, '').slice(0, 4))}
                          placeholder="123"
                          maxLength={4}
                          className={`w-full bg-white/5 border rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none transition-colors font-mono ${errors.cvc ? 'border-red-500' : 'border-white/10 focus:border-[#00F5FF]/50'}`}
                        />
                        {errors.cvc && <p className="text-red-400 text-sm mt-1">{errors.cvc}</p>}
                      </div>
                    </div>
                  </div>

                  {/* Security Notice */}
                  <div className="flex items-center gap-2 text-white/40 text-sm mb-6">
                    <div className="w-4 h-4"><Icons.Lock /></div>
                    Paiement 100% sécurisé par Stripe
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full py-4 rounded-xl font-bold text-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    style={{ background: plan.color, color: '#000' }}
                  >
                    {isProcessing ? (
                      <>
                        <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                        Traitement en cours...
                      </>
                    ) : (
                      <>
                        Payer {plan.price.toLocaleString()}€ HT
                      </>
                    )}
                  </button>

                  {/* Terms */}
                  <p className="text-white/30 text-xs text-center mt-4">
                    En cliquant sur "Payer", vous acceptez nos{' '}
                    <Link href="/cgv" className="text-[#00F5FF] hover:underline">CGV</Link>
                    {' '}et notre{' '}
                    <Link href="/confidentialite" className="text-[#00F5FF] hover:underline">politique de confidentialité</Link>.
                  </p>
                </form>
              </GlowCard>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-2">
              <GlowCard glow={plan.color}>
                <div className="p-6">
                  <h2 className="text-lg font-bold text-white mb-4">Récapitulatif</h2>

                  {/* Plan */}
                  <div className="bg-white/5 rounded-xl p-4 mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white font-semibold">Plan {plan.name}</span>
                      <div className="text-right">
                        <span className="text-white/40 line-through text-sm mr-2">{plan.originalPrice.toLocaleString()}€</span>
                        <span className="font-bold text-xl" style={{ color: plan.color }}>{plan.price.toLocaleString()}€</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-white/40 text-sm">{plan.users} utilisateur{parseInt(plan.users) > 1 ? 's' : ''} • Accès 12 mois</p>
                      <span className="text-xs bg-[#FF4444]/20 text-[#FF4444] px-2 py-0.5 rounded-full font-medium">
                        -{Math.round((1 - plan.price / plan.originalPrice) * 100)}%
                      </span>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="mb-6">
                    <h3 className="text-white/60 text-sm mb-3">Inclus dans votre plan :</h3>
                    <ul className="space-y-2">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-2 text-white/70 text-sm">
                          <div className="w-4 h-4" style={{ color: plan.color }}><Icons.Check /></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Pricing Details */}
                  <div className="border-t border-white/10 pt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-white/60">Sous-total HT</span>
                      <span className="text-white">{plan.price.toLocaleString()}€</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-white/60">TVA (20%)</span>
                      <span className="text-white">{(plan.price * 0.2).toLocaleString()}€</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold pt-2 border-t border-white/10">
                      <span className="text-white">Total TTC</span>
                      <span style={{ color: plan.color }}>{(plan.price * 1.2).toLocaleString()}€</span>
                    </div>
                  </div>
                </div>
              </GlowCard>

              {/* Trust Badges */}
              <div className="mt-4 space-y-3">
                {[
                  { icon: Icons.ShieldCheck, text: "Paiement sécurisé Stripe" },
                  { icon: Icons.Clock, text: "Accès immédiat après paiement" },
                  { icon: Icons.Award, text: "Garantie satisfait ou remboursé 30j" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-white/40 text-sm">
                    <div className="w-5 h-5 text-[#00FF88]"><item.icon /></div>
                    {item.text}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-4 text-center border-t border-white/5">
        <p className="text-white/30 text-sm">
          Besoin d'aide ? <a href="mailto:support@formation-ia-act.fr" className="text-[#00F5FF] hover:underline">support@formation-ia-act.fr</a>
        </p>
      </footer>
    </div>
  );
}
