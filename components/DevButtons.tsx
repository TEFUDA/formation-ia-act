'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Code2, X, LogIn, LayoutDashboard, ChevronRight } from 'lucide-react';

export default function DevButtons() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen ? (
        <div className="bg-slate-800 border border-slate-700 rounded-xl shadow-2xl p-4 min-w-[200px]">
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
          
          <div className="space-y-2">
            <Link
              href="/login"
              className="flex items-center gap-3 px-3 py-2 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors"
            >
              <LogIn className="w-4 h-4" />
              <span className="text-sm">Login / Pricing</span>
              <ChevronRight className="w-4 h-4 ml-auto" />
            </Link>
            
            <Link
              href="/dashboard"
              className="flex items-center gap-3 px-3 py-2 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 transition-colors"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span className="text-sm">Dashboard</span>
              <ChevronRight className="w-4 h-4 ml-auto" />
            </Link>
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
