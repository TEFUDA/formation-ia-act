'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, User, Users, Building2, ArrowRight, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';

const plans = [
  {
    id: 'solo',
    name: 'Solo',
    price: 500,
    description: 'Pour les indépendants et TPE',
    icon: User,
    color: 'from-blue-500 to-blue-600',
    features: [
      '1 accès personnel',
      '6 modules de formation',
      '12 ressources téléchargeables',
      'Certificat de compétence',
      'Accès à vie aux mises à jour',
      'Support par email',
    ],
    popular: false,
  },
  {
    id: 'equipe',
    name: 'Équipe',
    price: 2000,
    pricePerUser: 400,
    description: 'Pour les PME et équipes',
    icon: Users,
    color: 'from-emerald-500 to-emerald-600',
    features: [
      '5 accès collaborateurs',
      '6 modules de formation',
      '12 ressources téléchargeables',
      'Certificats de compétence',
      'Tableau de bord manager',
      'Support prioritaire',
      'Session Q&A mensuelle',
    ],
    popular: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 18000,
    pricePerUser: 360,
    description: 'Pour les grandes organisations',
    icon: Building2,
    color: 'from-purple-500 to-purple-600',
    features: [
      '50 accès collaborateurs',
      '6 modules de formation',
      '12 ressources téléchargeables',
      'Certificats de compétence',
      'Tableau de bord admin',
      'Support dédié',
      'Sessions Q&A illimitées',
      'Personnalisation logo',
      'Intégration SSO',
      'Rapport de conformité',
    ],
    popular: false,
  },
];

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <header className="border-b border-slate-700/50 bg-slate-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">IA</span>
            </div>
            <span className="text-white font-semibold text-lg">Formation AI Act</span>
          </Link>
          <Link href="/" className="text-slate-400 hover:text-white transition-colors text-sm">
            ← Retour à l'accueil
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex justify-center mb-8">
          <div className="bg-slate-800 rounded-full p-1 flex gap-1">
            <button
              onClick={() => setIsLogin(true)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                isLogin ? 'bg-white text-slate-900' : 'text-slate-400 hover:text-white'
              }`}
            >
              Connexion
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                !isLogin ? 'bg-white text-slate-900' : 'text-slate-400 hover:text-white'
              }`}
            >
              Inscription
            </button>
          </div>
        </div>

        {isLogin ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-md mx-auto">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-8">
              <h1 className="text-2xl font-bold text-white text-center mb-6">Accédez à votre formation</h1>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input type="email" placeholder="vous@entreprise.com" className="w-full bg-slate-700/50 border border-slate-600 rounded-lg pl-10 pr-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Mot de passe</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input type={showPassword ? 'text' : 'password'} placeholder="••••••••" className="w-full bg-slate-700/50 border border-slate-600 rounded-lg pl-10 pr-12 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white">
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
                <Link href="/dashboard" className="w-full bg-gradient-to-r from-blue-500 to-emerald-500 text-white font-semibold py-3 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                  Se connecter <ArrowRight className="w-5 h-5" />
                </Link>
              </form>
              <p className="text-center text-slate-400 text-sm mt-6">
                Pas encore de compte ? <button onClick={() => setIsLogin(false)} className="text-blue-400 hover:text-blue-300">Choisir une offre</button>
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="text-center mb-12">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Choisissez votre formule</h1>
              <p className="text-slate-400 text-lg">Formation complète AI Act avec 12 ressources professionnelles (847€ de valeur) incluses</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto mb-12">
              {plans.map((plan, index) => (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => setSelectedPlan(plan.id)}
                  className={`relative bg-slate-800/50 backdrop-blur-sm rounded-2xl border-2 p-6 cursor-pointer transition-all ${
                    selectedPlan === plan.id ? 'border-emerald-500 ring-2 ring-emerald-500/20' : 'border-slate-700/50 hover:border-slate-600'
                  } ${plan.popular ? 'md:-mt-4 md:mb-4' : ''}`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-xs font-bold px-4 py-1 rounded-full">POPULAIRE</span>
                    </div>
                  )}
                  <div className={`absolute top-4 right-4 w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    selectedPlan === plan.id ? 'border-emerald-500 bg-emerald-500' : 'border-slate-600'
                  }`}>
                    {selectedPlan === plan.id && <Check className="w-4 h-4 text-white" />}
                  </div>
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${plan.color} flex items-center justify-center mb-4`}>
                    <plan.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-1">{plan.name}</h3>
                  <p className="text-slate-400 text-sm mb-4">{plan.description}</p>
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-white">{plan.price.toLocaleString('fr-FR')}€</span>
                    <span className="text-slate-400 ml-2">HT</span>
                    {plan.pricePerUser && <p className="text-emerald-400 text-sm mt-1">soit {plan.pricePerUser}€ / personne</p>}
                  </div>
                  <ul className="space-y-3">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm">
                        <Check className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                        <span className="text-slate-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>

            {selectedPlan && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-md mx-auto">
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-8">
                  <h2 className="text-xl font-bold text-white text-center mb-6">
                    Créer votre compte - Offre {plans.find(p => p.id === selectedPlan)?.name}
                  </h2>
                  <form className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Prénom</label>
                        <input type="text" placeholder="Jean" className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Nom</label>
                        <input type="text" placeholder="Dupont" className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Email professionnel</label>
                      <input type="email" placeholder="vous@entreprise.com" className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Entreprise</label>
                      <input type="text" placeholder="Nom de votre entreprise" className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Mot de passe</label>
                      <input type="password" placeholder="••••••••" className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div className="bg-slate-700/30 rounded-lg p-4 flex items-center justify-between">
                      <span className="text-slate-300">Total HT</span>
                      <span className="text-2xl font-bold text-white">{plans.find(p => p.id === selectedPlan)?.price.toLocaleString('fr-FR')}€</span>
                    </div>
                    <Link href="/dashboard" className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold py-3 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                      Procéder au paiement <ArrowRight className="w-5 h-5" />
                    </Link>
                  </form>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </main>
    </div>
  );
}
