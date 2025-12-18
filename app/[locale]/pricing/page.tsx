'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, User, Users, Building2, ArrowRight, CreditCard, Shield, Zap } from 'lucide-react';
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

export default function PricingPage() {
  const [selectedPlan, setSelectedPlan] = useState<string>('equipe');

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
          <Link href="/login" className="text-slate-400 hover:text-white transition-colors text-sm">
            Déjà un compte ? Se connecter →
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="inline-block bg-emerald-500/20 text-emerald-400 text-sm font-medium px-4 py-1 rounded-full mb-4">
              🎁 12 ressources offertes (847€ de valeur)
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Choisissez votre formule
            </h1>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Formation complète AI Act pour mettre votre entreprise en conformité avant les échéances 2025
            </p>
          </motion.div>
        </div>

        {/* Plans Grid */}
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto mb-12">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => setSelectedPlan(plan.id)}
              className={`relative bg-slate-800/50 backdrop-blur-sm rounded-2xl border-2 p-6 cursor-pointer transition-all ${
                selectedPlan === plan.id
                  ? 'border-emerald-500 ring-2 ring-emerald-500/20 scale-[1.02]'
                  : 'border-slate-700/50 hover:border-slate-600'
              } ${plan.popular ? 'md:-mt-4 md:mb-4' : ''}`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-xs font-bold px-4 py-1 rounded-full">
                    POPULAIRE
                  </span>
                </div>
              )}

              <div className={`absolute top-4 right-4 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
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
                {plan.pricePerUser && (
                  <p className="text-emerald-400 text-sm mt-1">soit {plan.pricePerUser}€ / personne</p>
                )}
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

        {/* CTA Button */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="max-w-md mx-auto"
        >
          <Link
            href="/login"
            className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold py-4 px-8 rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-3 text-lg shadow-lg shadow-emerald-500/25"
          >
            <CreditCard className="w-6 h-6" />
            Payer {plans.find(p => p.id === selectedPlan)?.price.toLocaleString('fr-FR')}€ HT
            <ArrowRight className="w-5 h-5" />
          </Link>
          
          <div className="flex items-center justify-center gap-6 mt-6 text-sm text-slate-400">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              <span>Paiement sécurisé</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              <span>Accès immédiat</span>
            </div>
          </div>
        </motion.div>

        {/* Garantie */}
        <div className="mt-16 max-w-2xl mx-auto text-center">
          <div className="bg-slate-800/50 rounded-2xl border border-slate-700 p-8">
            <h3 className="text-xl font-bold text-white mb-2">✅ Garantie satisfait ou remboursé 30 jours</h3>
            <p className="text-slate-400">
              Si la formation ne répond pas à vos attentes, nous vous remboursons intégralement. Sans condition.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
