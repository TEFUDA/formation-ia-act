'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  Code2, X, Home, CreditCard, LogIn, LayoutDashboard, 
  ChevronRight, Users, Award, Shield 
} from 'lucide-react';

export default function DevButtons() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const isLanding = pathname === '/' || pathname?.endsWith('/fr') || pathname?.endsWith('/en');
  const isPricing = pathname?.includes('/pricing');
  const isOnboarding = pathname?.includes('/onboarding');
  const isLogin = pathname?.includes('/login');
  const isDashboard = pathname?.includes('/dashboard') && !pathname?.includes('/admin');
  const isAdmin = pathname?.includes('/admin');
  const isCertificate = pathname?.includes('/certificate');
  const isVerify = pathname?.includes('/verify');

  const navItems = [
    { href: '/', label: 'Landing', icon: Home, active: isLanding },
    { href: '/pricing', label: 'Pricing', icon: CreditCard, active: isPricing },
    { href: '/onboarding?plan=equipe', label: 'Onboarding', icon: Users, active: isOnboarding },
    { href: '/login', label: 'Login', icon: LogIn, active: isLogin },
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, active: isDashboard },
    { href: '/admin', label: 'Admin (Équipe)', icon: Users, active: isAdmin },
    { href: '/certificate', label: 'Certificat', icon: Award, active: isCertificate },
    { href: '/verify', label: 'Vérification', icon: Shield, active: isVerify },
  ];

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen ? (
        <div className="bg-slate-800 border border-slate-700 rounded-xl shadow-2xl p-4 min-w-[260px]">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Code2 className="w-5 h-5 text-purple-400" />
              <span className="text-white font-semibold text-sm">DEV MODE</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="text-xs text-slate-500 mb-3 pb-2 border-b border-slate-700">
            Navigation rapide (toutes les pages)
          </div>
          
          <div className="space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  item.active
                    ? 'bg-cyan-500/20 text-cyan-400'
                    : 'text-slate-400 hover:bg-slate-700 hover:text-white'
                }`}
              >
                <item.icon className="w-4 h-4" />
                <span className="text-sm flex-1">{item.label}</span>
                {item.active && (
                  <span className="text-xs bg-slate-700 px-2 py-0.5 rounded">ici</span>
                )}
                {!item.active && (
                  <ChevronRight className="w-4 h-4 opacity-50" />
                )}
              </Link>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-700">
            <p className="text-slate-500 text-xs">
              🔒 Masqué en production
            </p>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-3 rounded-full shadow-lg hover:scale-110 transition-transform"
          title="Menu développeur"
        >
          <Code2 className="w-6 h-6" />
        </button>
      )}
    </div>
  );
}
