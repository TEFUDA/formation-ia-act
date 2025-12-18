'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

// Icons
const Icons = {
  Shield: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  Check: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-full h-full"><polyline points="20 6 9 17 4 12"/></svg>,
  ArrowRight: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
  ArrowLeft: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>,
  User: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  Users: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  Building: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01M16 6h.01M12 6h.01M12 10h.01M12 14h.01M16 10h.01M16 14h.01M8 10h.01M8 14h.01"/></svg>,
  Mail: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
  Plus: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  Trash: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>,
  Zap: () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  Award: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>,
  Rocket: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg>,
  Sparkles: () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full"><path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3zM5 16l1 3 3 1-3 1-1 3-1-3-3-1 3-1 1-3z"/></svg>,
};

// Neural Background
const NeuralBackground = () => {
  const [particles, setParticles] = useState<{x: number, y: number, size: number, speed: number}[]>([]);
  
  useEffect(() => {
    setParticles(Array.from({ length: 40 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 1,
      speed: Math.random() * 20 + 10,
    })));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      <div className="absolute inset-0 bg-[#0a0f1a]" />
      <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-[#00F5FF]/5 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-[#8B5CF6]/5 blur-[100px] rounded-full" />
      <div className="absolute top-[40%] left-[50%] w-[400px] h-[400px] bg-[#00FF88]/3 blur-[80px] rounded-full" />
      <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'linear-gradient(rgba(0, 245, 255, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 245, 255, 0.3) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
      {particles.map((p, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-[#00F5FF]"
          style={{ width: p.size, height: p.size, left: `${p.x}%`, top: `${p.y}%`, opacity: 0.3 }}
          animate={{ y: [0, -20, 0], opacity: [0.2, 0.5, 0.2] }}
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

// Step indicator
const StepIndicator = ({ currentStep, totalSteps }: { currentStep: number, totalSteps: number }) => (
  <div className="flex items-center justify-center gap-2">
    {Array.from({ length: totalSteps }).map((_, i) => (
      <div key={i} className="flex items-center">
        <div 
          className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
            i + 1 < currentStep 
              ? 'bg-[#00FF88] text-black' 
              : i + 1 === currentStep 
                ? 'bg-[#00F5FF] text-black' 
                : 'bg-white/10 text-white/40'
          }`}
        >
          {i + 1 < currentStep ? (
            <div className="w-5 h-5"><Icons.Check /></div>
          ) : (
            i + 1
          )}
        </div>
        {i < totalSteps - 1 && (
          <div className={`w-12 h-1 mx-1 rounded-full transition-all ${
            i + 1 < currentStep ? 'bg-[#00FF88]' : 'bg-white/10'
          }`} />
        )}
      </div>
    ))}
  </div>
);

// Steps content
const steps = [
  { 
    title: "Bienvenue !",
    subtitle: "Commençons la configuration de votre espace",
    icon: Icons.Sparkles,
    color: '#FFB800'
  },
  { 
    title: "Votre profil",
    subtitle: "Quelques informations sur vous",
    icon: Icons.User,
    color: '#00F5FF'
  },
  { 
    title: "Votre entreprise",
    subtitle: "Informations sur votre organisation",
    icon: Icons.Building,
    color: '#8B5CF6'
  },
  { 
    title: "Invitez votre équipe",
    subtitle: "Ajoutez vos collaborateurs",
    icon: Icons.Users,
    color: '#00FF88'
  },
  { 
    title: "C'est parti !",
    subtitle: "Tout est prêt pour commencer",
    icon: Icons.Rocket,
    color: '#FF6B00'
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  
  // Form data
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    jobTitle: '',
    companyName: '',
    companySize: '',
    industry: '',
    teamEmails: [''],
  });

  const totalSteps = 5;
  const step = steps[currentStep - 1];

  const updateFormData = (field: string, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addTeamEmail = () => {
    if (formData.teamEmails.length < 5) {
      setFormData(prev => ({ ...prev, teamEmails: [...prev.teamEmails, ''] }));
    }
  };

  const removeTeamEmail = (index: number) => {
    setFormData(prev => ({
      ...prev,
      teamEmails: prev.teamEmails.filter((_, i) => i !== index)
    }));
  };

  const updateTeamEmail = (index: number, value: string) => {
    const newEmails = [...formData.teamEmails];
    newEmails[index] = value;
    setFormData(prev => ({ ...prev, teamEmails: newEmails }));
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: return true;
      case 2: return formData.firstName && formData.lastName;
      case 3: return formData.companyName && formData.companySize;
      case 4: return true; // Optional step
      case 5: return true;
      default: return false;
    }
  };

  const handleNext = async () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    } else {
      setIsLoading(true);
      await new Promise(r => setTimeout(r, 1500));
      router.push('/dashboard');
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSkip = () => {
    if (currentStep === 4) {
      setCurrentStep(5);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0f1a] text-white flex flex-col">
      <NeuralBackground />

      {/* Header */}
      <header className="relative z-10 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#00F5FF] to-[#0066FF] rounded-xl flex items-center justify-center">
              <div className="w-5 h-5 text-white"><Icons.Shield /></div>
            </div>
            <span className="font-bold text-lg hidden sm:block">Formation-IA-Act.fr</span>
          </div>
          <div className="text-white/40 text-sm">
            Étape {currentStep} sur {totalSteps}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-2xl">
          {/* Step Indicator */}
          <div className="mb-12">
            <StepIndicator currentStep={currentStep} totalSteps={totalSteps} />
          </div>

          {/* Step Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <GlowCard glow={step.color}>
                <div className="p-8 sm:p-10">
                  {/* Step Header */}
                  <div className="text-center mb-8">
                    <div 
                      className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
                      style={{ background: `${step.color}20` }}
                    >
                      <div className="w-8 h-8" style={{ color: step.color }}>
                        <step.icon />
                      </div>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">{step.title}</h1>
                    <p className="text-white/50">{step.subtitle}</p>
                  </div>

                  {/* Step 1: Welcome */}
                  {currentStep === 1 && (
                    <div className="space-y-6">
                      <div className="bg-white/5 rounded-xl p-6 text-center">
                        <p className="text-white/70 mb-4">
                          Merci d'avoir choisi notre formation AI Act ! En quelques étapes, nous allons configurer votre espace de formation personnalisé.
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                          {[
                            { icon: Icons.Award, text: "Certificat officiel" },
                            { icon: Icons.Zap, text: "6 modules complets" },
                            { icon: Icons.Users, text: "Espace équipe" },
                          ].map((item, i) => (
                            <div key={i} className="flex items-center gap-2 text-white/50 text-sm">
                              <div className="w-4 h-4 text-[#00F5FF]"><item.icon /></div>
                              {item.text}
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="text-center text-white/40 text-sm">
                        ⏱️ Configuration en moins de 2 minutes
                      </div>
                    </div>
                  )}

                  {/* Step 2: Profile */}
                  {currentStep === 2 && (
                    <div className="space-y-6">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-white/60 text-sm mb-2">Prénom *</label>
                          <input
                            type="text"
                            value={formData.firstName}
                            onChange={e => updateFormData('firstName', e.target.value)}
                            placeholder="Jean"
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#00F5FF]/50 transition-colors"
                          />
                        </div>
                        <div>
                          <label className="block text-white/60 text-sm mb-2">Nom *</label>
                          <input
                            type="text"
                            value={formData.lastName}
                            onChange={e => updateFormData('lastName', e.target.value)}
                            placeholder="Dupont"
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#00F5FF]/50 transition-colors"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-white/60 text-sm mb-2">Fonction</label>
                        <input
                          type="text"
                          value={formData.jobTitle}
                          onChange={e => updateFormData('jobTitle', e.target.value)}
                          placeholder="DPO, Directeur Juridique, DSI..."
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#00F5FF]/50 transition-colors"
                        />
                      </div>
                    </div>
                  )}

                  {/* Step 3: Company */}
                  {currentStep === 3 && (
                    <div className="space-y-6">
                      <div>
                        <label className="block text-white/60 text-sm mb-2">Nom de l'entreprise *</label>
                        <input
                          type="text"
                          value={formData.companyName}
                          onChange={e => updateFormData('companyName', e.target.value)}
                          placeholder="Acme Corporation"
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#8B5CF6]/50 transition-colors"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-white/60 text-sm mb-2">Taille de l'entreprise *</label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          {['1-10', '11-50', '51-250', '250+'].map(size => (
                            <button
                              key={size}
                              onClick={() => updateFormData('companySize', size)}
                              className={`py-3 rounded-xl text-sm font-medium transition-all ${
                                formData.companySize === size
                                  ? 'bg-[#8B5CF6] text-white'
                                  : 'bg-white/5 text-white/60 hover:bg-white/10'
                              }`}
                            >
                              {size}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-white/60 text-sm mb-2">Secteur d'activité</label>
                        <select
                          value={formData.industry}
                          onChange={e => updateFormData('industry', e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#8B5CF6]/50 transition-colors"
                        >
                          <option value="" className="bg-[#111827]">Sélectionnez...</option>
                          <option value="tech" className="bg-[#111827]">Technologies / IT</option>
                          <option value="finance" className="bg-[#111827]">Finance / Banque</option>
                          <option value="sante" className="bg-[#111827]">Santé</option>
                          <option value="industrie" className="bg-[#111827]">Industrie</option>
                          <option value="retail" className="bg-[#111827]">Retail / Commerce</option>
                          <option value="services" className="bg-[#111827]">Services</option>
                          <option value="public" className="bg-[#111827]">Secteur public</option>
                          <option value="autre" className="bg-[#111827]">Autre</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {/* Step 4: Team Invitations */}
                  {currentStep === 4 && (
                    <div className="space-y-6">
                      <div className="bg-[#00FF88]/10 border border-[#00FF88]/30 rounded-xl p-4 text-center">
                        <p className="text-[#00FF88] text-sm">
                          💡 Vous pouvez inviter jusqu'à 4 collaborateurs maintenant (selon votre plan)
                        </p>
                      </div>

                      <div className="space-y-3">
                        {formData.teamEmails.map((email, index) => (
                          <div key={index} className="flex gap-2">
                            <div className="relative flex-1">
                              <div className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30">
                                <Icons.Mail />
                              </div>
                              <input
                                type="email"
                                value={email}
                                onChange={e => updateTeamEmail(index, e.target.value)}
                                placeholder="collegue@entreprise.com"
                                className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#00FF88]/50 transition-colors"
                              />
                            </div>
                            {formData.teamEmails.length > 1 && (
                              <button
                                onClick={() => removeTeamEmail(index)}
                                className="p-3 text-white/40 hover:text-red-400 transition-colors"
                              >
                                <div className="w-5 h-5"><Icons.Trash /></div>
                              </button>
                            )}
                          </div>
                        ))}
                      </div>

                      {formData.teamEmails.length < 5 && (
                        <button
                          onClick={addTeamEmail}
                          className="w-full py-3 border-2 border-dashed border-white/10 hover:border-[#00FF88]/50 rounded-xl text-white/40 hover:text-[#00FF88] flex items-center justify-center gap-2 transition-colors"
                        >
                          <div className="w-4 h-4"><Icons.Plus /></div>
                          Ajouter un email
                        </button>
                      )}

                      <p className="text-center text-white/30 text-sm">
                        Les invitations seront envoyées après la configuration
                      </p>
                    </div>
                  )}

                  {/* Step 5: Ready */}
                  {currentStep === 5 && (
                    <div className="space-y-6">
                      <div className="bg-gradient-to-br from-[#FF6B00]/10 to-[#FF4444]/10 rounded-xl p-6 text-center">
                        <div className="text-5xl mb-4">🚀</div>
                        <h3 className="text-xl font-bold text-white mb-2">Tout est prêt !</h3>
                        <p className="text-white/60">
                          Votre espace de formation est configuré. Vous pouvez maintenant commencer votre parcours de conformité AI Act.
                        </p>
                      </div>

                      {/* Summary */}
                      <div className="bg-white/5 rounded-xl p-6 space-y-4">
                        <h4 className="text-white font-semibold">Récapitulatif</h4>
                        <div className="grid sm:grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-white/40">Nom</span>
                            <p className="text-white">{formData.firstName} {formData.lastName}</p>
                          </div>
                          <div>
                            <span className="text-white/40">Fonction</span>
                            <p className="text-white">{formData.jobTitle || '-'}</p>
                          </div>
                          <div>
                            <span className="text-white/40">Entreprise</span>
                            <p className="text-white">{formData.companyName}</p>
                          </div>
                          <div>
                            <span className="text-white/40">Invitations</span>
                            <p className="text-white">
                              {formData.teamEmails.filter(e => e).length || 0} collaborateur(s)
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* What's next */}
                      <div className="space-y-3">
                        {[
                          { icon: "📚", text: "Accédez aux 6 modules de formation" },
                          { icon: "🎯", text: "Suivez votre progression en temps réel" },
                          { icon: "🏆", text: "Obtenez votre certificat AI Act" },
                        ].map((item, i) => (
                          <div key={i} className="flex items-center gap-3 text-white/60 text-sm">
                            <span className="text-lg">{item.icon}</span>
                            {item.text}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Navigation Buttons */}
                  <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/10">
                    <div>
                      {currentStep > 1 && (
                        <button
                          onClick={handleBack}
                          className="flex items-center gap-2 text-white/60 hover:text-white transition-colors"
                        >
                          <div className="w-5 h-5"><Icons.ArrowLeft /></div>
                          Retour
                        </button>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      {currentStep === 4 && (
                        <button
                          onClick={handleSkip}
                          className="px-6 py-3 text-white/60 hover:text-white transition-colors"
                        >
                          Passer
                        </button>
                      )}
                      
                      <button
                        onClick={handleNext}
                        disabled={!canProceed() || isLoading}
                        className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{ background: step.color, color: currentStep === 1 ? 'black' : 'white' }}
                      >
                        {isLoading ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Chargement...
                          </>
                        ) : currentStep === totalSteps ? (
                          <>
                            Accéder à ma formation
                            <div className="w-5 h-5"><Icons.ArrowRight /></div>
                          </>
                        ) : (
                          <>
                            Continuer
                            <div className="w-5 h-5"><Icons.ArrowRight /></div>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </GlowCard>
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-4 text-center">
        <p className="text-white/30 text-sm">
          Besoin d'aide ? <a href="mailto:support@formation-ia-act.fr" className="text-[#00F5FF] hover:underline">support@formation-ia-act.fr</a>
        </p>
      </footer>
    </div>
  );
}
