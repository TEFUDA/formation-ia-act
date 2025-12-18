'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Code2, X, LogIn, LayoutDashboard, Home, CreditCard, ChevronRight } from 'lucide-react';

export default function DevButtons() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Détecte la page actuelle
  const isLanding = pathname === '/' || pathname === '/fr' || pathname === '/en';
  const isLogin = pathname?.includes('/login');
  const isDashboard = pathname?.includes('/dashboard');

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen ? (
        <div className="bg-slate-800 border border-slate-700 rounded-xl shadow-2xl p-4 min-w-[220px]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Code2 className="w-5 h-5 text-emerald-400" />
              <span className="text-white font-semibold text-sm">DEV MODE</span>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <p className="text-slate-500 text-xs mb-3">Bypass navigation :</p>
          
          <div className="space-y-2">
            {/* Toujours afficher Home */}
            <Link
              href="/"
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                isLanding 
                  ? 'bg-slate-700 text-slate-500 cursor-not-allowed' 
                  : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Home className="w-4 h-4" />
              <span className="text-sm">Landing</span>
              {isLanding && <span className="ml-auto text-xs text-slate-500">✓</span>}
            </Link>

            {/* Bypass Paywall → Login */}
            <Link
              href="/login"
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                isLogin 
                  ? 'bg-blue-500/20 text-blue-400' 
                  : 'bg-blue-500/10 text-blue-400 hover:bg-blue-500/20'
              }`}
            >
              <CreditCard className="w-4 h-4" />
              <span className="text-sm">Pricing / Login</span>
              {isLanding && <span className="ml-auto text-xs bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded">bypass</span>}
              {isLogin && <span className="ml-auto text-xs text-blue-400">✓</span>}
            </Link>
            
            {/* Bypass Login → Dashboard */}
            <Link
              href="/dashboard"
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                isDashboard 
                  ? 'bg-emerald-500/20 text-emerald-400' 
                  : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span className="text-sm">Dashboard</span>
              {(isLanding || isLogin) && <span className="ml-auto text-xs bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded">bypass</span>}
              {isDashboard && <span className="ml-auto text-xs text-emerald-400">✓</span>}
            </Link>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-700">
            <p className="text-slate-500 text-xs">
              🔒 En prod, ces boutons seront masqués
            </p>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-3 rounded-full shadow-lg hover:scale-110 transition-transform animate-pulse"
          title="Menu développeur"
        >
          <Code2 className="w-6 h-6" />
        </button>
      )}
    </div>
  );
}
