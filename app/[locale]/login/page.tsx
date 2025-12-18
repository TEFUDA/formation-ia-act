'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Mail, Lock, Eye, EyeOff, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col">
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

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          {/* Success Message */}
          <div className="bg-emerald-500/20 border border-emerald-500/40 rounded-xl p-4 mb-6 flex items-start gap-3">
            <CheckCircle className="w-6 h-6 text-emerald-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-emerald-400 font-medium">Paiement confirmé !</p>
              <p className="text-emerald-300/70 text-sm">Connectez-vous pour accéder à votre formation.</p>
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-8">
            <h1 className="text-2xl font-bold text-white text-center mb-2">
              Accédez à votre formation
            </h1>
            <p className="text-slate-400 text-center text-sm mb-8">
              Entrez vos identifiants pour commencer
            </p>
            
            <form className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="vous@entreprise.com"
                    className="w-full bg-slate-700/50 border border-slate-600 rounded-lg pl-10 pr-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Mot de passe
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-700/50 border border-slate-600 rounded-lg pl-10 pr-12 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                  <input type="checkbox" className="rounded border-slate-600 bg-slate-700 text-emerald-500 focus:ring-emerald-500" />
                  Se souvenir de moi
                </label>
                <a href="#" className="text-emerald-400 hover:text-emerald-300">
                  Mot de passe oublié ?
                </a>
              </div>

              <Link
                href="/dashboard"
                className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold py-3 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2 mt-6"
              >
                Se connecter
                <ArrowRight className="w-5 h-5" />
              </Link>
            </form>
          </div>

          <p className="text-center text-slate-400 text-sm mt-6">
            Pas encore de compte ?{' '}
            <Link href="/pricing" className="text-emerald-400 hover:text-emerald-300">
              Voir les offres
            </Link>
          </p>
        </motion.div>
      </main>
    </div>
  );
}
