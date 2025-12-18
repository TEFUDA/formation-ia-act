'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

/**
 * DevTools Component
 * 
 * Floating navigation panel for development purposes.
 * Allows quick access to all pages without filling forms.
 * 
 * Usage: Add <DevTools /> to your layout.tsx
 * 
 * Only shows in development mode (process.env.NODE_ENV === 'development')
 * Or when ?dev=true is in the URL
 */

const pages = [
  { name: '🏠 Landing', path: '/', color: '#00F5FF' },
  { name: '💰 Pricing', path: '/pricing', color: '#FFB800' },
  { name: '🛒 Checkout Solo', path: '/checkout?plan=solo', color: '#00F5FF' },
  { name: '🛒 Checkout Équipe', path: '/checkout?plan=equipe', color: '#00FF88' },
  { name: '🛒 Checkout Enterprise', path: '/checkout?plan=enterprise', color: '#8B5CF6' },
  { name: '👋 Onboarding', path: '/onboarding', color: '#FFB800' },
  { name: '📊 Dashboard', path: '/dashboard', color: '#00F5FF' },
  { name: '👔 Admin', path: '/admin', color: '#8B5CF6' },
  { name: '📚 Formation', path: '/formation', color: '#00FF88' },
  { name: '📚 Formation Module 2', path: '/formation?module=2', color: '#FF6B00' },
  { name: '📚 Formation Quiz', path: '/formation?module=1&quiz=true', color: '#FF4444' },
  { name: '🔐 Login', path: '/login', color: '#00F5FF' },
  { name: '📝 Register', path: '/register', color: '#00FF88' },
];

const mockUsers = [
  { name: 'Jean Dupont (Admin)', email: 'admin@test.com', role: 'admin', plan: 'equipe' },
  { name: 'Marie Martin (User)', email: 'user@test.com', role: 'user', plan: 'solo' },
  { name: 'Pierre Bernard (Enterprise)', email: 'enterprise@test.com', role: 'admin', plan: 'enterprise' },
];

export default function DevTools() {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  // Check if we should show DevTools
  // Show in development OR when ?dev=true is in URL
  const isDev = process.env.NODE_ENV === 'development' || 
    (typeof window !== 'undefined' && window.location.search.includes('dev=true'));

  if (!isDev) return null;

  const navigate = (path: string) => {
    router.push(path);
    setIsOpen(false);
  };

  const setMockUser = (user: typeof mockUsers[0]) => {
    // Store mock user in localStorage for other components to use
    localStorage.setItem('devUser', JSON.stringify(user));
    // Also set a cookie for server-side access
    document.cookie = `devUser=${encodeURIComponent(JSON.stringify(user))}; path=/`;
    alert(`✅ Mock user set: ${user.name}\n\nRefresh the page to see changes.`);
  };

  const clearMockUser = () => {
    localStorage.removeItem('devUser');
    document.cookie = 'devUser=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    alert('🗑️ Mock user cleared');
  };

  if (isMinimized) {
    return (
      <button
        onClick={() => setIsMinimized(false)}
        className="fixed bottom-4 right-4 z-[9999] w-12 h-12 bg-[#FF6B00] text-white rounded-full shadow-lg flex items-center justify-center text-xl hover:scale-110 transition-transform"
        title="Open DevTools"
      >
        🛠️
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-[9999]">
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 bg-gradient-to-br from-[#FF6B00] to-[#FF4444] text-white rounded-full shadow-lg flex items-center justify-center text-xl hover:scale-110 transition-transform"
        title="DevTools"
      >
        {isOpen ? '✕' : '🛠️'}
      </button>

      {/* Panel */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-80 bg-[#111827] border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#FF6B00] to-[#FF4444] px-4 py-3 flex items-center justify-between">
            <span className="text-white font-bold text-sm">🛠️ DevTools</span>
            <div className="flex gap-2">
              <button
                onClick={() => setIsMinimized(true)}
                className="text-white/60 hover:text-white text-xs"
              >
                Minimize
              </button>
            </div>
          </div>

          {/* Current Page */}
          <div className="px-4 py-2 bg-white/5 border-b border-white/10">
            <span className="text-white/40 text-xs">Current:</span>
            <span className="text-white text-sm ml-2 font-mono">{pathname}</span>
          </div>

          {/* Quick Navigation */}
          <div className="p-3 border-b border-white/10">
            <h3 className="text-white/60 text-xs uppercase tracking-wider mb-2">Quick Navigation</h3>
            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
              {pages.map((page) => (
                <button
                  key={page.path}
                  onClick={() => navigate(page.path)}
                  className={`text-left px-3 py-2 rounded-lg text-xs transition-all ${
                    pathname === page.path.split('?')[0]
                      ? 'bg-white/20 text-white'
                      : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {page.name}
                </button>
              ))}
            </div>
          </div>

          {/* Mock Users */}
          <div className="p-3 border-b border-white/10">
            <h3 className="text-white/60 text-xs uppercase tracking-wider mb-2">Mock Users</h3>
            <div className="space-y-2">
              {mockUsers.map((user) => (
                <button
                  key={user.email}
                  onClick={() => setMockUser(user)}
                  className="w-full text-left px-3 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <div className="text-white text-xs font-medium">{user.name}</div>
                  <div className="text-white/40 text-xs">{user.email} • {user.plan}</div>
                </button>
              ))}
              <button
                onClick={clearMockUser}
                className="w-full text-center px-3 py-2 text-red-400 hover:bg-red-400/10 rounded-lg text-xs transition-colors"
              >
                Clear Mock User
              </button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="p-3">
            <h3 className="text-white/60 text-xs uppercase tracking-wider mb-2">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  localStorage.clear();
                  sessionStorage.clear();
                  alert('🗑️ Storage cleared!');
                }}
                className="px-3 py-2 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-lg text-xs transition-colors"
              >
                Clear Storage
              </button>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  alert('📋 URL copied!');
                }}
                className="px-3 py-2 bg-white/5 text-white/70 hover:bg-white/10 rounded-lg text-xs transition-colors"
              >
                Copy URL
              </button>
              <button
                onClick={() => window.location.reload()}
                className="px-3 py-2 bg-white/5 text-white/70 hover:bg-white/10 rounded-lg text-xs transition-colors"
              >
                Refresh
              </button>
              <button
                onClick={() => {
                  const url = new URL(window.location.href);
                  url.searchParams.set('dev', 'true');
                  navigator.clipboard.writeText(url.toString());
                  alert('📋 Dev URL copied!');
                }}
                className="px-3 py-2 bg-white/5 text-white/70 hover:bg-white/10 rounded-lg text-xs transition-colors"
              >
                Share Dev URL
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="px-4 py-2 bg-white/5 text-center">
            <span className="text-white/30 text-xs">
              Add ?dev=true to URL to show in production
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
