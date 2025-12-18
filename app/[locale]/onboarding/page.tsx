'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  User, Building2, Users, Mail, ChevronRight, ChevronLeft,
  Check, Plus, X, Trash2, Shield, Sparkles, ArrowRight,
  CheckCircle, Send, SkipForward, Loader2
} from 'lucide-react';
import Link from 'next/link';

type PlanType = 'solo' | 'equipe' | 'enterprise';

interface InviteEmail {
  id: string;
  email: string;
  valid: boolean;
}

const PLANS = {
  solo: { name: 'Solo', seats: 1, price: 500 },
  equipe: { name: 'Équipe', seats: 5, price: 2000 },
  enterprise: { name: 'Enterprise', seats: 50, price: 18000 },
};

export default function OnboardingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const planFromUrl = (searchParams.get('plan') as PlanType) || 'equipe';
  
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  
  // Step 1: Account
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Step 2: Company (only for Équipe/Enterprise)
  const [companyName, setCompanyName] = useState('');
  const [sector, setSector] = useState('');
  
  // Step 3: Team invites
  const [inviteEmails, setInviteEmails] = useState<InviteEmail[]>([
    { id: '1', email: '', valid: false }
  ]);
  
  const plan = PLANS[planFromUrl];
  const isSolo = planFromUrl === 'solo';
  const totalSteps = isSolo ? 2 : 3;
  
  // Validate email format
  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };
  
  // Add invite email field
  const addInviteEmail = () => {
    if (inviteEmails.length < plan.seats - 1) {
      setInviteEmails([
        ...inviteEmails,
        { id: Date.now().toString(), email: '', valid: false }
      ]);
    }
  };
  
  // Remove invite email field
  const removeInviteEmail = (id: string) => {
    if (inviteEmails.length > 1) {
      setInviteEmails(inviteEmails.filter(e => e.id !== id));
    }
  };
  
  // Update invite email
  const updateInviteEmail = (id: string, email: string) => {
    setInviteEmails(inviteEmails.map(e => 
      e.id === id ? { ...e, email, valid: isValidEmail(email) } : e
    ));
  };
  
  // Check if step is valid
  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return firstName && lastName && isValidEmail(email) && password.length >= 8;
      case 2:
        if (isSolo) return true; // Skip validation for solo
        return companyName.length > 0;
      case 3:
        return true; // Always valid (can skip)
      default:
        return false;
    }
  };
  
  // Count valid invites
  const validInvitesCount = inviteEmails.filter(e => e.valid).length;
  
  // Handle next step
  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };
  
  // Handle skip invites
  const handleSkipInvites = () => {
    handleComplete();
  };
  
  // Handle complete onboarding
  const handleComplete = async () => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // In production: Create account, send invites, etc.
    console.log('Account:', { firstName, lastName, email, password });
    console.log('Company:', { companyName, sector });
    console.log('Invites:', inviteEmails.filter(e => e.valid).map(e => e.email));
    
    // Redirect based on plan
    if (isSolo) {
      router.push('/dashboard');
    } else {
      router.push('/admin');
    }
  };
  
  // Handle previous step
  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex flex-col">
      {/* Header */}
      <header className="border-b border-slate-800/50 py-4">
        <div className="max-w-2xl mx-auto px-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <span className="text-lg font-bold text-white">Formation AI Act</span>
          </Link>
          
          <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full px-3 py-1.5">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span className="text-emerald-400 text-sm font-medium">Paiement confirmé</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center py-8 px-4">
        <div className="w-full max-w-xl">
          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
                <div key={step} className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                    step < currentStep
                      ? 'bg-emerald-500 text-white'
                      : step === currentStep
                        ? 'bg-cyan-500 text-white'
                        : 'bg-slate-700 text-slate-400'
                  }`}>
                    {step < currentStep ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      step
                    )}
                  </div>
                  {step < totalSteps && (
                    <div className={`w-16 sm:w-24 h-1 mx-2 rounded-full transition-all ${
                      step < currentStep ? 'bg-emerald-500' : 'bg-slate-700'
                    }`} />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between text-sm">
              <span className={currentStep >= 1 ? 'text-white' : 'text-slate-500'}>Compte</span>
              {!isSolo && (
                <span className={currentStep >= 2 ? 'text-white' : 'text-slate-500'}>Entreprise</span>
              )}
              {!isSolo && (
                <span className={currentStep >= 3 ? 'text-white' : 'text-slate-500'}>Équipe</span>
              )}
              {isSolo && (
                <span className={currentStep >= 2 ? 'text-white' : 'text-slate-500'}>Confirmation</span>
              )}
            </div>
          </div>

          {/* Step Content */}
          <AnimatePresence mode="wait">
            {/* Step 1: Account */}
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-6 sm:p-8"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-cyan-500/20 rounded-xl flex items-center justify-center">
                    <User className="w-6 h-6 text-cyan-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Créez votre compte</h2>
                    <p className="text-slate-400 text-sm">Plan {plan.name} • {plan.seats} place{plan.seats > 1 ? 's' : ''}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Prénom</label>
                      <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="Jean"
                        className="w-full bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Nom</label>
                      <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Dupont"
                        className="w-full bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Email professionnel</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="jean.dupont@entreprise.com"
                      className="w-full bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Mot de passe</label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Minimum 8 caractères"
                      className="w-full bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                    {password && password.length < 8 && (
                      <p className="text-orange-400 text-sm mt-1">Minimum 8 caractères</p>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2: Company (for Équipe/Enterprise) */}
            {currentStep === 2 && !isSolo && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-6 sm:p-8"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Votre entreprise</h2>
                    <p className="text-slate-400 text-sm">Ces informations apparaîtront sur les certificats</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Nom de l'entreprise</label>
                    <input
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="Acme Corporation"
                      className="w-full bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Secteur d'activité (optionnel)</label>
                    <select
                      value={sector}
                      onChange={(e) => setSector(e.target.value)}
                      className="w-full bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    >
                      <option value="">Sélectionner un secteur</option>
                      <option value="tech">Technologies / IT</option>
                      <option value="finance">Finance / Banque / Assurance</option>
                      <option value="sante">Santé / Pharmaceutique</option>
                      <option value="industrie">Industrie / Manufacturing</option>
                      <option value="retail">Retail / E-commerce</option>
                      <option value="services">Services / Conseil</option>
                      <option value="public">Secteur public</option>
                      <option value="autre">Autre</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2 for Solo OR Step 3 for Équipe/Enterprise: Team Invites */}
            {((currentStep === 2 && isSolo) || (currentStep === 3 && !isSolo)) && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                {isSolo ? (
                  /* Solo: Confirmation */
                  <div className="bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 border border-emerald-500/30 rounded-2xl p-6 sm:p-8 text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Sparkles className="w-10 h-10 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-3">Tout est prêt ! 🎉</h2>
                    <p className="text-slate-300 mb-6">
                      Votre compte est configuré. Vous pouvez maintenant commencer votre formation AI Act.
                    </p>
                    <div className="bg-slate-800/50 rounded-xl p-4 text-left">
                      <p className="text-slate-400 text-sm mb-2">Récapitulatif :</p>
                      <p className="text-white font-medium">{firstName} {lastName}</p>
                      <p className="text-slate-400 text-sm">{email}</p>
                      <p className="text-cyan-400 text-sm mt-2">Plan {plan.name}</p>
                    </div>
                  </div>
                ) : (
                  /* Équipe/Enterprise: Invite Team */
                  <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-6 sm:p-8">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                        <Users className="w-6 h-6 text-blue-400" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-white">Invitez votre équipe</h2>
                        <p className="text-slate-400 text-sm">{plan.seats - 1} places disponibles</p>
                      </div>
                    </div>

                    <p className="text-slate-400 text-sm mb-6">
                      Ajoutez les emails de vos collaborateurs. Ils recevront une invitation pour créer leur compte et commencer la formation.
                    </p>

                    <div className="space-y-3 mb-6">
                      {inviteEmails.map((invite, index) => (
                        <div key={invite.id} className="flex gap-2">
                          <div className="relative flex-1">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                              type="email"
                              value={invite.email}
                              onChange={(e) => updateInviteEmail(invite.id, e.target.value)}
                              placeholder={`collaborateur${index + 1}@${companyName.toLowerCase().replace(/\s/g, '') || 'entreprise'}.com`}
                              className={`w-full bg-slate-700/50 border rounded-xl pl-10 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 ${
                                invite.email && !invite.valid ? 'border-orange-500' : 'border-slate-600'
                              }`}
                            />
                            {invite.valid && (
                              <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-400" />
                            )}
                          </div>
                          {inviteEmails.length > 1 && (
                            <button
                              onClick={() => removeInviteEmail(invite.id)}
                              className="p-3 text-slate-400 hover:text-red-400 hover:bg-slate-700 rounded-xl transition-colors"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>

                    {inviteEmails.length < plan.seats - 1 && (
                      <button
                        onClick={addInviteEmail}
                        className="w-full py-3 border-2 border-dashed border-slate-600 hover:border-cyan-500 rounded-xl text-slate-400 hover:text-cyan-400 flex items-center justify-center gap-2 transition-colors mb-6"
                      >
                        <Plus className="w-5 h-5" />
                        Ajouter un collaborateur
                      </button>
                    )}

                    {/* Summary */}
                    <div className="bg-slate-800/50 rounded-xl p-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-400">Invitations à envoyer</span>
                        <span className="text-white font-medium">{validInvitesCount} / {plan.seats - 1}</span>
                      </div>
                      {validInvitesCount === 0 && (
                        <p className="text-slate-500 text-xs mt-2">
                          💡 Vous pouvez aussi inviter plus tard depuis le Dashboard Admin
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            {currentStep > 1 && (
              <button
                onClick={handlePrevious}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-xl transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
                Retour
              </button>
            )}
            
            <div className="flex-1 flex gap-3">
              {/* Skip button for team invite step */}
              {currentStep === 3 && !isSolo && (
                <button
                  onClick={handleSkipInvites}
                  disabled={isLoading}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-xl transition-colors"
                >
                  <SkipForward className="w-5 h-5" />
                  Plus tard
                </button>
              )}
              
              <button
                onClick={handleNext}
                disabled={!isStepValid() || isLoading}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Création en cours...
                  </>
                ) : currentStep === totalSteps ? (
                  <>
                    {currentStep === 3 && validInvitesCount > 0 ? (
                      <>
                        <Send className="w-5 h-5" />
                        Envoyer {validInvitesCount} invitation{validInvitesCount > 1 ? 's' : ''} et continuer
                      </>
                    ) : (
                      <>
                        <ArrowRight className="w-5 h-5" />
                        Commencer la formation
                      </>
                    )}
                  </>
                ) : (
                  <>
                    Continuer
                    <ChevronRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
