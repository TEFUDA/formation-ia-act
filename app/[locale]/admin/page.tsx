'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

// Minimal SVG Icons
const Icons = {
  Shield: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  Users: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  UserPlus: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>,
  Award: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>,
  Download: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
  Mail: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
  Check: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-full h-full"><polyline points="20 6 9 17 4 12"/></svg>,
  X: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  Trash: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>,
  Refresh: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>,
  Star: () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  Crown: () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full"><path d="M2 4l3 12h14l3-12-6 7-4-9-4 9-6-7zm3 14h14v2H5v-2z"/></svg>,
  Target: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>,
  Zap: () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  Eye: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
  Book: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>,
  Logout: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  Search: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  Send: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>,
  ArrowUp: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>,
  Copy: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>,
};

// Types
interface TeamMember {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'admin' | 'employee';
  status: 'active' | 'completed' | 'inactive';
  progress: number;
  modulesCompleted: number;
  quizScore: number;
  certificateIssued: boolean;
  certificateDate?: string;
  certificateId?: string;
}

interface Invitation {
  id: string;
  email: string;
  sentAt: string;
  status: 'pending' | 'expired';
}

// Plan Config
const PLANS = {
  equipe: { name: 'Équipe', seats: 5, price: 2000, color: '#00F5FF' },
  enterprise: { name: 'Enterprise', seats: 50, price: 18000, color: '#8B5CF6' },
};

// Mock Data
const adminData = { name: 'Jean', lastName: 'Dupont', avatar: 'JD' };

interface CompanyData {
  name: string;
  plan: 'equipe' | 'enterprise';
  usedSeats: number;
}

const initialCompanyData: CompanyData = {
  name: 'Acme Corporation',
  plan: 'equipe',
  usedSeats: 4,
};

const initialTeamMembers: TeamMember[] = [
  { id: '1', name: 'Jean Dupont', email: 'jean.dupont@acme.com', avatar: 'JD', role: 'admin', status: 'completed', progress: 100, modulesCompleted: 6, quizScore: 92, certificateIssued: true, certificateDate: '2024-01-28', certificateId: 'CERT-001' },
  { id: '2', name: 'Marie Martin', email: 'marie.martin@acme.com', avatar: 'MM', role: 'employee', status: 'completed', progress: 100, modulesCompleted: 6, quizScore: 95, certificateIssued: true, certificateDate: '2024-01-25', certificateId: 'CERT-002' },
  { id: '3', name: 'Pierre Bernard', email: 'pierre.bernard@acme.com', avatar: 'PB', role: 'employee', status: 'active', progress: 67, modulesCompleted: 4, quizScore: 78, certificateIssued: false },
  { id: '4', name: 'Sophie Leroy', email: 'sophie.leroy@acme.com', avatar: 'SL', role: 'employee', status: 'active', progress: 33, modulesCompleted: 2, quizScore: 82, certificateIssued: false },
];

const initialInvitations: Invitation[] = [
  { id: 'inv-1', email: 'lucas.petit@acme.com', sentAt: '25 Jan 2024', status: 'pending' },
];

// Neural Background
const NeuralBackground = () => {
  const [nodes, setNodes] = useState<{x: number, y: number, size: number, delay: number}[]>([]);
  
  useEffect(() => {
    setNodes(Array.from({ length: 40 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 1,
      delay: Math.random() * 5,
    })));
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-[#030014]" />
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[#8B5CF6]/5 blur-[120px] animate-pulse" style={{ animationDuration: '8s' }} />
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-[#00F5FF]/5 blur-[150px] animate-pulse" style={{ animationDuration: '10s' }} />
      
      <svg className="absolute inset-0 w-full h-full opacity-20">
        {nodes.map((node, i) => (
          <circle key={i} cx={`${node.x}%`} cy={`${node.y}%`} r={node.size} fill="#8B5CF6" opacity="0.6">
            <animate attributeName="opacity" values="0.2;0.8;0.2" dur={`${3 + node.delay}s`} repeatCount="indefinite" />
          </circle>
        ))}
        <defs>
          <linearGradient id="adminGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8B5CF6" />
            <stop offset="100%" stopColor="#00F5FF" />
          </linearGradient>
        </defs>
      </svg>

      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: `linear-gradient(rgba(139, 92, 246, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(139, 92, 246, 0.1) 1px, transparent 1px)`,
        backgroundSize: '50px 50px',
      }} />
    </div>
  );
};

// Holo Card
const HoloCard = ({ children, className = '', glow = '#8B5CF6' }: { children: React.ReactNode, className?: string, glow?: string }) => (
  <motion.div whileHover={{ scale: 1.01 }} className={`relative group ${className}`}>
    <div className="absolute -inset-[1px] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" style={{ background: `${glow}15` }} />
    <div className="absolute -inset-[1px] rounded-2xl opacity-40 group-hover:opacity-60 transition-opacity" style={{ background: `linear-gradient(135deg, ${glow}30, transparent 50%, ${glow}30)` }} />
    <div className="relative bg-[#0A0A1B]/80 backdrop-blur-xl rounded-2xl border border-white/5 overflow-hidden">
      <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity" style={{ background: `radial-gradient(circle at 50% 0%, ${glow}, transparent 70%)` }} />
      <div className="relative">{children}</div>
    </div>
  </motion.div>
);

// Data Bar Chart
const DataBar = ({ value, max, color, label }: { value: number, max: number, color: string, label: string }) => (
  <div className="flex-1">
    <div className="h-32 bg-white/5 rounded-lg relative overflow-hidden flex items-end">
      <motion.div
        initial={{ height: 0 }}
        animate={{ height: `${(value / max) * 100}%` }}
        transition={{ duration: 1, ease: [0.19, 1, 0.22, 1] }}
        className="w-full rounded-t-lg relative"
        style={{ background: `linear-gradient(to top, ${color}, ${color}80)`, boxShadow: `0 0 20px ${color}40` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/20" />
      </motion.div>
    </div>
    <p className="text-center text-white/40 text-xs mt-2">{label}</p>
    <p className="text-center text-white font-bold">{value}</p>
  </div>
);

// Liquid Progress
const LiquidProgress = ({ progress, color }: { progress: number, color: string }) => (
  <div className="relative h-1.5 bg-white/5 rounded-full overflow-hidden">
    <motion.div
      initial={{ width: 0 }}
      animate={{ width: `${progress}%` }}
      transition={{ duration: 1, ease: [0.19, 1, 0.22, 1] }}
      className="absolute inset-y-0 left-0 rounded-full"
      style={{ background: color, boxShadow: `0 0 10px ${color}60` }}
    />
  </div>
);

// Avatar with Ring
const AvatarRing = ({ initials, color, size = 'md', certified = false }: { initials: string, color: string, size?: 'sm' | 'md' | 'lg', certified?: boolean }) => {
  const sizes = { sm: 'w-8 h-8 text-xs', md: 'w-10 h-10 text-sm', lg: 'w-14 h-14 text-lg' };
  return (
    <div className="relative">
      <div 
        className={`${sizes[size]} rounded-full bg-gradient-to-br from-[#1a1a3a] to-[#0a0a1b] flex items-center justify-center text-white font-bold`} 
        style={{ boxShadow: `0 0 0 2px ${color}50` }}
      >
        {initials}
      </div>
      {certified && (
        <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-[#00FF88] rounded-full flex items-center justify-center">
          <div className="w-2.5 h-2.5 text-white"><Icons.Check /></div>
        </div>
      )}
    </div>
  );
};

// Status Pill
const StatusPill = ({ status }: { status: string }) => {
  const styles: Record<string, { bg: string, text: string, label: string }> = {
    completed: { bg: 'rgba(0, 255, 136, 0.15)', text: '#00FF88', label: 'Certifié' },
    active: { bg: 'rgba(0, 245, 255, 0.15)', text: '#00F5FF', label: 'En cours' },
    inactive: { bg: 'rgba(255, 107, 0, 0.15)', text: '#FF6B00', label: 'Inactif' },
  };
  const s = styles[status] || styles.inactive;
  return (
    <span className="px-2 py-1 rounded-full text-xs font-medium" style={{ background: s.bg, color: s.text }}>
      {s.label}
    </span>
  );
};

export default function AdminDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'overview' | 'team' | 'certificates' | 'invitations'>('overview');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showMemberModal, setShowMemberModal] = useState<TeamMember | null>(null);
  const [showMenu, setShowMenu] = useState(false);
  
  const [teamMembers, setTeamMembers] = useState(initialTeamMembers);
  const [invitations, setInvitations] = useState(initialInvitations);
  const [companyData, setCompanyData] = useState(initialCompanyData);
  
  const [inviteEmails, setInviteEmails] = useState(['']);
  const [searchQuery, setSearchQuery] = useState('');
  const [isInviting, setIsInviting] = useState(false);
  const [notification, setNotification] = useState<{ type: string, msg: string } | null>(null);
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);
  const [downloadingIds, setDownloadingIds] = useState<string[]>([]);

  const plan = PLANS[companyData.plan];
  const seatsRemaining = plan.seats - companyData.usedSeats;
  const certifiedMembers = teamMembers.filter(m => m.certificateIssued);
  
  const stats = {
    totalMembers: teamMembers.length,
    avgProgress: Math.round(teamMembers.reduce((a, m) => a + m.progress, 0) / teamMembers.length),
    avgQuiz: Math.round(teamMembers.reduce((a, m) => a + m.quizScore, 0) / teamMembers.length),
    certificates: certifiedMembers.length,
  };

  const filteredMembers = teamMembers.filter(m => 
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    m.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const showNotif = (type: string, msg: string) => {
    setNotification({ type, msg });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleInvite = async () => {
    const validEmails = inviteEmails.filter(e => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e));
    if (validEmails.length === 0) return;
    if (validEmails.length > seatsRemaining) {
      showNotif('error', `Seulement ${seatsRemaining} place(s) disponible(s)`);
      return;
    }
    setIsInviting(true);
    await new Promise(r => setTimeout(r, 1500));
    const newInvites = validEmails.map((email, i) => ({
      id: `inv-${Date.now()}-${i}`,
      email,
      sentAt: new Date().toLocaleDateString('fr-FR'),
      status: 'pending' as const,
    }));
    setInvitations([...newInvites, ...invitations]);
    setCompanyData(prev => ({ ...prev, usedSeats: prev.usedSeats + validEmails.length }));
    setIsInviting(false);
    setShowInviteModal(false);
    setInviteEmails(['']);
    showNotif('success', `${validEmails.length} invitation(s) envoyée(s)`);
  };

  const handleDownloadCert = async (member: TeamMember) => {
    setDownloadingIds(prev => [...prev, member.id]);
    await new Promise(r => setTimeout(r, 1500));
    setDownloadingIds(prev => prev.filter(id => id !== member.id));
    showNotif('success', `Certificat de ${member.name} téléchargé`);
  };

  const handleDownloadAll = async () => {
    setDownloadingIds(certifiedMembers.map(m => m.id));
    await new Promise(r => setTimeout(r, 2000));
    setDownloadingIds([]);
    showNotif('success', `${certifiedMembers.length} certificat(s) téléchargé(s)`);
  };

  const handleUpgrade = () => {
    setCompanyData(prev => ({ ...prev, plan: 'enterprise' }));
    setShowUpgradeModal(false);
    showNotif('success', 'Bienvenue sur Enterprise ! 50 places disponibles');
  };

  const handleOpenInvite = () => {
    if (seatsRemaining === 0 && companyData.plan === 'equipe') {
      setShowUpgradeModal(true);
    } else if (seatsRemaining === 0) {
      showNotif('error', 'Toutes les places sont utilisées');
    } else {
      setShowInviteModal(true);
    }
  };

  const copyEmail = (email: string) => {
    navigator.clipboard.writeText(email);
    setCopiedEmail(email);
    setTimeout(() => setCopiedEmail(null), 2000);
  };

  return (
    <div className="min-h-screen relative">
      <NeuralBackground />

      {/* Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className={`fixed top-4 right-4 z-[100] px-4 py-3 rounded-xl backdrop-blur-xl flex items-center gap-3 ${
              notification.type === 'success' ? 'bg-[#00FF88]/20 text-[#00FF88] border border-[#00FF88]/30' :
              notification.type === 'error' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
              'bg-[#00F5FF]/20 text-[#00F5FF] border border-[#00F5FF]/30'
            }`}
          >
            <div className="w-5 h-5"><Icons.Check /></div>
            {notification.msg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="relative z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-4">
              <div className="relative w-12 h-12">
                <div className="absolute inset-0 bg-gradient-to-br from-[#8B5CF6] to-[#00F5FF] rounded-xl rotate-45" />
                <div className="absolute inset-[2px] bg-[#030014] rounded-[10px] rotate-45" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-6 h-6 text-[#8B5CF6]"><Icons.Shield /></div>
                </div>
              </div>
              <div>
                <h1 className="text-white font-semibold">AI Act Academy</h1>
                <p className="text-white/30 text-xs tracking-widest uppercase">Admin Console</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/dashboard')}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#00F5FF]/10 border border-[#00F5FF]/30 text-[#00F5FF] text-sm hover:bg-[#00F5FF]/20 transition-colors"
              >
                <div className="w-4 h-4"><Icons.Book /></div>
                Ma formation
              </button>

              {/* Plan Badge */}
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ background: `${plan.color}15`, border: `1px solid ${plan.color}30` }}>
                <div className="w-4 h-4" style={{ color: plan.color }}><Icons.Crown /></div>
                <span className="text-sm font-medium" style={{ color: plan.color }}>{plan.name}</span>
              </div>

              {/* Profile */}
              <div className="relative">
                <button onClick={() => setShowMenu(!showMenu)} className="relative w-10 h-10 rounded-full overflow-hidden group">
                  <div className="absolute -inset-[2px] bg-gradient-to-r from-[#8B5CF6] to-[#00F5FF] rounded-full opacity-60 group-hover:opacity-100 transition-opacity animate-spin" style={{ animationDuration: '4s' }} />
                  <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a3a] to-[#0a0a1b] rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">{adminData.avatar}</span>
                  </div>
                </button>

                <AnimatePresence>
                  {showMenu && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
                      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="absolute right-0 top-14 z-50 w-64">
                        <HoloCard>
                          <div className="p-4">
                            <div className="flex items-center gap-3 mb-3">
                              <AvatarRing initials={adminData.avatar} color="#8B5CF6" />
                              <div>
                                <p className="text-white font-semibold">{adminData.name} {adminData.lastName}</p>
                                <p className="text-white/40 text-sm">Administrateur</p>
                              </div>
                            </div>
                            <div className="h-px bg-white/10 my-2" />
                            <button onClick={() => router.push('/')} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition-colors">
                              <div className="w-5 h-5"><Icons.Logout /></div>
                              Déconnexion
                            </button>
                          </div>
                        </HoloCard>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        {/* Title */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">{companyData.name}</h2>
              <p className="text-white/40">Gérez votre équipe et suivez leur progression</p>
            </div>
            <div className="flex items-center gap-3">
              {/* Seats */}
              <div className={`px-4 py-2 rounded-xl ${seatsRemaining === 0 ? 'bg-[#FF6B00]/15 border-[#FF6B00]/30' : 'bg-white/5 border-white/10'} border`}>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5" style={{ color: seatsRemaining === 0 ? '#FF6B00' : '#00F5FF' }}><Icons.Users /></div>
                  <span className="text-white font-bold">{companyData.usedSeats}/{plan.seats}</span>
                  <span className="text-white/40 text-sm">places</span>
                </div>
              </div>

              {/* Upgrade */}
              {companyData.plan === 'equipe' && seatsRemaining <= 1 && (
                <button onClick={() => setShowUpgradeModal(true)} className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#FF00E5] text-white font-medium flex items-center gap-2 hover:opacity-90 transition-opacity">
                  <div className="w-4 h-4"><Icons.Star /></div>
                  Upgrade
                </button>
              )}

              {/* Invite */}
              <button onClick={handleOpenInvite} className="px-4 py-2 rounded-xl bg-[#00F5FF] text-black font-semibold flex items-center gap-2 hover:bg-[#00F5FF]/90 transition-colors">
                <div className="w-5 h-5"><Icons.UserPlus /></div>
                Inviter
              </button>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {[
            { id: 'overview', label: 'Vue d\'ensemble', icon: Icons.Target },
            { id: 'team', label: 'Équipe', icon: Icons.Users, badge: teamMembers.length },
            { id: 'certificates', label: 'Certificats', icon: Icons.Award, badge: certifiedMembers.length },
            { id: 'invitations', label: 'Invitations', icon: Icons.Mail, badge: invitations.filter(i => i.status === 'pending').length },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-[#8B5CF6]/20 text-[#8B5CF6] border border-[#8B5CF6]/30'
                  : 'text-white/40 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="w-4 h-4"><tab.icon /></div>
              {tab.label}
              {tab.badge !== undefined && tab.badge > 0 && (
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  tab.id === 'certificates' ? 'bg-[#00FF88] text-black' :
                  tab.id === 'invitations' ? 'bg-[#FF6B00] text-white' :
                  'bg-white/10 text-white'
                }`}>{tab.badge}</span>
              )}
            </button>
          ))}
        </motion.div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {/* Overview */}
          {activeTab === 'overview' && (
            <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              {/* Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {[
                  { label: 'Membres actifs', value: stats.totalMembers, color: '#00F5FF', icon: Icons.Users },
                  { label: 'Progression moy.', value: `${stats.avgProgress}%`, color: '#00FF88', icon: Icons.Target },
                  { label: 'Score quiz moy.', value: `${stats.avgQuiz}%`, color: '#FFB800', icon: Icons.Zap },
                  { label: 'Certificats', value: stats.certificates, color: '#8B5CF6', icon: Icons.Award },
                ].map((stat, i) => (
                  <HoloCard key={i} glow={stat.color}>
                    <div className="p-5">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: `${stat.color}15` }}>
                        <div className="w-5 h-5" style={{ color: stat.color }}><stat.icon /></div>
                      </div>
                      <div className="text-3xl font-bold text-white">{stat.value}</div>
                      <p className="text-white/40 text-sm">{stat.label}</p>
                    </div>
                  </HoloCard>
                ))}
              </div>

              {/* Progress Chart */}
              <HoloCard className="mb-8">
                <div className="p-6">
                  <h3 className="text-white font-semibold mb-6">Progression par module</h3>
                  <div className="flex gap-4">
                    {[1, 2, 3, 4, 5, 6].map(m => {
                      const completed = teamMembers.filter(member => member.modulesCompleted >= m).length;
                      const colors = ['#00F5FF', '#00FF88', '#FF00E5', '#FFB800', '#FF4444', '#8B5CF6'];
                      return <DataBar key={m} value={completed} max={teamMembers.length} color={colors[m-1]} label={`M${m}`} />;
                    })}
                  </div>
                </div>
              </HoloCard>

              {/* Recent Activity */}
              <HoloCard>
                <div className="p-6">
                  <h3 className="text-white font-semibold mb-4">Activité récente</h3>
                  <div className="space-y-3">
                    {teamMembers.slice(0, 4).map(member => (
                      <div key={member.id} className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer" onClick={() => setShowMemberModal(member)}>
                        <div className="flex items-center gap-3">
                          <AvatarRing initials={member.avatar} color={member.status === 'completed' ? '#00FF88' : '#00F5FF'} certified={member.certificateIssued} />
                          <div>
                            <p className="text-white font-medium">{member.name}</p>
                            <p className="text-white/40 text-sm">{member.modulesCompleted}/6 modules</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-white font-bold">{member.progress}%</p>
                          <StatusPill status={member.status} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </HoloCard>
            </motion.div>
          )}

          {/* Team */}
          {activeTab === 'team' && (
            <motion.div key="team" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              {/* Search */}
              <div className="relative mb-6">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30"><Icons.Search /></div>
                <input
                  type="text"
                  placeholder="Rechercher un membre..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#8B5CF6]/50 transition-colors"
                />
              </div>

              {/* Members */}
              <div className="space-y-4">
                {filteredMembers.map(member => (
                  <HoloCard key={member.id} glow={member.status === 'completed' ? '#00FF88' : '#00F5FF'}>
                    <div className="p-5">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <AvatarRing initials={member.avatar} color={member.status === 'completed' ? '#00FF88' : '#00F5FF'} size="lg" certified={member.certificateIssued} />
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-white font-semibold text-lg">{member.name}</h4>
                              {member.role === 'admin' && <div className="w-4 h-4 text-[#FFB800]"><Icons.Crown /></div>}
                            </div>
                            <div className="flex items-center gap-2">
                              <p className="text-white/40 text-sm">{member.email}</p>
                              <button onClick={() => copyEmail(member.email)} className="text-white/30 hover:text-white">
                                <div className="w-3 h-3">{copiedEmail === member.email ? <Icons.Check /> : <Icons.Copy />}</div>
                              </button>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-6">
                          <StatusPill status={member.status} />
                          
                          <div className="text-center">
                            <p className="text-white font-bold">{member.progress}%</p>
                            <p className="text-white/30 text-xs">Progression</p>
                          </div>
                          
                          <div className="text-center">
                            <p className="text-white font-bold">{member.modulesCompleted}/6</p>
                            <p className="text-white/30 text-xs">Modules</p>
                          </div>
                          
                          <div className="text-center">
                            <p className={`font-bold ${member.quizScore >= 80 ? 'text-[#00FF88]' : 'text-[#FF6B00]'}`}>{member.quizScore}%</p>
                            <p className="text-white/30 text-xs">Quiz</p>
                          </div>

                          <div className="flex gap-2">
                            {member.certificateIssued && (
                              <button onClick={() => handleDownloadCert(member)} disabled={downloadingIds.includes(member.id)} className="p-2 rounded-lg bg-[#00FF88]/10 text-[#00FF88] hover:bg-[#00FF88]/20 transition-colors disabled:opacity-50">
                                {downloadingIds.includes(member.id) ? <div className="w-5 h-5 border-2 border-[#00FF88]/30 border-t-[#00FF88] rounded-full animate-spin" /> : <div className="w-5 h-5"><Icons.Download /></div>}
                              </button>
                            )}
                            <button onClick={() => setShowMemberModal(member)} className="p-2 rounded-lg bg-white/5 text-white/60 hover:bg-white/10 hover:text-white transition-colors">
                              <div className="w-5 h-5"><Icons.Eye /></div>
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4">
                        <LiquidProgress progress={member.progress} color={member.status === 'completed' ? '#00FF88' : '#00F5FF'} />
                      </div>
                    </div>
                  </HoloCard>
                ))}
              </div>
            </motion.div>
          )}

          {/* Certificates */}
          {activeTab === 'certificates' && (
            <motion.div key="certificates" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              {certifiedMembers.length > 0 && (
                <HoloCard glow="#00FF88" className="mb-6">
                  <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-[#00FF88]/15 flex items-center justify-center">
                        <div className="w-6 h-6 text-[#00FF88]"><Icons.Award /></div>
                      </div>
                      <div>
                        <h3 className="text-white font-semibold text-lg">{certifiedMembers.length} certificat{certifiedMembers.length > 1 ? 's' : ''} disponible{certifiedMembers.length > 1 ? 's' : ''}</h3>
                        <p className="text-white/40 text-sm">Téléchargez les certificats de vos employés</p>
                      </div>
                    </div>
                    <button onClick={handleDownloadAll} disabled={downloadingIds.length > 0} className="px-6 py-3 rounded-xl bg-[#00FF88] text-black font-semibold flex items-center gap-2 hover:bg-[#00FF88]/90 transition-colors disabled:opacity-50">
                      {downloadingIds.length > 0 ? <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" /> : <div className="w-5 h-5"><Icons.Download /></div>}
                      Tout télécharger
                    </button>
                  </div>
                </HoloCard>
              )}

              <div className="space-y-4">
                {certifiedMembers.map(member => (
                  <HoloCard key={member.id} glow="#00FF88">
                    <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <AvatarRing initials={member.avatar} color="#00FF88" size="lg" certified />
                        <div>
                          <h4 className="text-white font-semibold">{member.name}</h4>
                          <p className="text-white/40 text-sm">{member.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-center">
                          <p className="text-[#00FF88] font-bold text-xl">{member.quizScore}%</p>
                          <p className="text-white/30 text-xs">Score final</p>
                        </div>
                        <div className="text-center">
                          <p className="text-white">{member.certificateDate}</p>
                          <p className="text-white/30 text-xs">Date</p>
                        </div>
                        <div className="text-center">
                          <p className="text-white/60 font-mono text-sm">{member.certificateId}</p>
                          <p className="text-white/30 text-xs">ID</p>
                        </div>
                        <button onClick={() => handleDownloadCert(member)} disabled={downloadingIds.includes(member.id)} className="px-4 py-2 rounded-xl bg-[#00FF88] text-black font-semibold flex items-center gap-2 hover:bg-[#00FF88]/90 transition-colors disabled:opacity-50">
                          {downloadingIds.includes(member.id) ? <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" /> : <div className="w-4 h-4"><Icons.Download /></div>}
                          PDF
                        </button>
                      </div>
                    </div>
                  </HoloCard>
                ))}
              </div>

              {teamMembers.filter(m => !m.certificateIssued).length > 0 && (
                <div className="mt-8">
                  <h3 className="text-white/50 text-sm uppercase tracking-widest mb-4">En attente de certification</h3>
                  <div className="space-y-3">
                    {teamMembers.filter(m => !m.certificateIssued).map(member => (
                      <div key={member.id} className="p-4 rounded-xl bg-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <AvatarRing initials={member.avatar} color="#00F5FF" />
                          <div>
                            <p className="text-white">{member.name}</p>
                            <p className="text-white/40 text-sm">{member.progress}% complété</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="w-32"><LiquidProgress progress={member.progress} color="#00F5FF" /></div>
                          <span className="text-white/40 text-sm">{100 - member.progress}% restant</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* Invitations */}
          {activeTab === 'invitations' && (
            <motion.div key="invitations" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              {/* Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {[
                  { label: 'Places totales', value: plan.seats, color: '#8B5CF6' },
                  { label: 'Utilisées', value: companyData.usedSeats, color: '#00F5FF' },
                  { label: 'Disponibles', value: seatsRemaining, color: seatsRemaining === 0 ? '#FF6B00' : '#00FF88' },
                  { label: 'En attente', value: invitations.filter(i => i.status === 'pending').length, color: '#FFB800' },
                ].map((s, i) => (
                  <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <p className="text-white/40 text-sm">{s.label}</p>
                    <p className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</p>
                  </div>
                ))}
              </div>

              {/* Upgrade Banner */}
              {seatsRemaining === 0 && companyData.plan === 'equipe' && (
                <HoloCard glow="#8B5CF6" className="mb-6">
                  <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-[#8B5CF6]/15 flex items-center justify-center">
                        <div className="w-6 h-6 text-[#8B5CF6]"><Icons.Star /></div>
                      </div>
                      <div>
                        <h3 className="text-white font-semibold">Besoin de plus de places ?</h3>
                        <p className="text-white/40 text-sm">Passez à Enterprise pour 50 places</p>
                      </div>
                    </div>
                    <button onClick={() => setShowUpgradeModal(true)} className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#FF00E5] text-white font-semibold flex items-center gap-2 hover:opacity-90 transition-opacity">
                      <div className="w-5 h-5"><Icons.ArrowUp /></div>
                      Passer à Enterprise
                    </button>
                  </div>
                </HoloCard>
              )}

              {/* Pending */}
              <HoloCard className="mb-6">
                <div className="p-6">
                  <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                    <div className="w-5 h-5 text-[#FFB800]"><Icons.Mail /></div>
                    Invitations en attente
                  </h3>
                  {invitations.filter(i => i.status === 'pending').length > 0 ? (
                    <div className="space-y-3">
                      {invitations.filter(i => i.status === 'pending').map(inv => (
                        <div key={inv.id} className="p-4 rounded-xl bg-white/5 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-[#FFB800]/15 flex items-center justify-center">
                              <div className="w-5 h-5 text-[#FFB800]"><Icons.Mail /></div>
                            </div>
                            <div>
                              <p className="text-white">{inv.email}</p>
                              <p className="text-white/40 text-sm">Envoyée le {inv.sentAt}</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button className="p-2 rounded-lg bg-white/5 text-white/60 hover:text-[#00F5FF] transition-colors">
                              <div className="w-5 h-5"><Icons.Refresh /></div>
                            </button>
                            <button className="p-2 rounded-lg bg-white/5 text-white/60 hover:text-red-400 transition-colors">
                              <div className="w-5 h-5"><Icons.Trash /></div>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-white/40 text-center py-8">Aucune invitation en attente</p>
                  )}
                </div>
              </HoloCard>

              {/* Invite CTA */}
              <HoloCard glow="#00F5FF">
                <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-white font-semibold">Inviter de nouveaux membres</h3>
                    <p className="text-white/40 text-sm">
                      {seatsRemaining > 0 ? `${seatsRemaining} place(s) disponible(s)` : 'Toutes les places sont utilisées'}
                    </p>
                  </div>
                  <button onClick={handleOpenInvite} className="px-6 py-3 rounded-xl bg-[#00F5FF] text-black font-semibold flex items-center gap-2 hover:bg-[#00F5FF]/90 transition-colors">
                    <div className="w-5 h-5"><Icons.UserPlus /></div>
                    Inviter
                  </button>
                </div>
              </HoloCard>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Invite Modal */}
      <AnimatePresence>
        {showInviteModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowInviteModal(false)}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} onClick={e => e.stopPropagation()} className="w-full max-w-md">
              <HoloCard glow="#00F5FF">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-white">Inviter des membres</h3>
                    <button onClick={() => setShowInviteModal(false)} className="text-white/40 hover:text-white">
                      <div className="w-6 h-6"><Icons.X /></div>
                    </button>
                  </div>

                  <div className="bg-white/5 rounded-lg p-3 mb-4 flex items-center justify-between">
                    <span className="text-white/60 text-sm">Places disponibles</span>
                    <span className="text-[#00FF88] font-bold">{seatsRemaining}</span>
                  </div>

                  <div className="space-y-3 mb-4">
                    {inviteEmails.map((email, i) => (
                      <div key={i} className="flex gap-2">
                        <div className="relative flex-1">
                          <div className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30"><Icons.Mail /></div>
                          <input
                            type="email"
                            placeholder="email@entreprise.com"
                            value={email}
                            onChange={e => {
                              const newEmails = [...inviteEmails];
                              newEmails[i] = e.target.value;
                              setInviteEmails(newEmails);
                            }}
                            className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#00F5FF]/50"
                          />
                        </div>
                        {inviteEmails.length > 1 && (
                          <button onClick={() => setInviteEmails(inviteEmails.filter((_, idx) => idx !== i))} className="p-3 text-white/40 hover:text-red-400">
                            <div className="w-5 h-5"><Icons.Trash /></div>
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  {inviteEmails.length < seatsRemaining && (
                    <button onClick={() => setInviteEmails([...inviteEmails, ''])} className="w-full py-2 border-2 border-dashed border-white/10 hover:border-[#00F5FF]/50 rounded-xl text-white/40 hover:text-[#00F5FF] flex items-center justify-center gap-2 mb-4 transition-colors">
                      <div className="w-4 h-4"><Icons.UserPlus /></div>
                      Ajouter un email
                    </button>
                  )}

                  <button onClick={handleInvite} disabled={isInviting || inviteEmails.filter(e => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)).length === 0} className="w-full py-3 rounded-xl bg-[#00F5FF] text-black font-semibold flex items-center justify-center gap-2 hover:bg-[#00F5FF]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                    {isInviting ? <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" /> : <div className="w-5 h-5"><Icons.Send /></div>}
                    {isInviting ? 'Envoi...' : 'Envoyer les invitations'}
                  </button>
                </div>
              </HoloCard>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upgrade Modal */}
      <AnimatePresence>
        {showUpgradeModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowUpgradeModal(false)}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} onClick={e => e.stopPropagation()} className="w-full max-w-lg">
              <HoloCard glow="#8B5CF6">
                <div className="p-6 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[#8B5CF6] to-[#FF00E5] flex items-center justify-center">
                    <div className="w-8 h-8 text-white"><Icons.Star /></div>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Passez à Enterprise</h3>
                  <p className="text-white/40 mb-6">Débloquez 50 places pour former toute votre équipe</p>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                      <p className="text-white/40 text-sm mb-1">Votre plan</p>
                      <p className="text-white font-bold">Équipe</p>
                      <p className="text-[#00F5FF] font-bold text-2xl mt-2">2 000€</p>
                      <p className="text-white/40 text-sm">5 places</p>
                    </div>
                    <div className="p-4 rounded-xl bg-[#8B5CF6]/10 border border-[#8B5CF6]/30">
                      <p className="text-[#8B5CF6] text-sm mb-1">Recommandé</p>
                      <p className="text-white font-bold">Enterprise</p>
                      <p className="text-[#8B5CF6] font-bold text-2xl mt-2">18 000€</p>
                      <p className="text-white/60 text-sm">50 places</p>
                    </div>
                  </div>

                  <div className="text-left bg-white/5 rounded-xl p-4 mb-6">
                    <h4 className="text-white font-semibold mb-3">Ce que vous obtenez :</h4>
                    <div className="space-y-2">
                      {['50 places au lieu de 5', 'Support prioritaire', 'Rapports personnalisés', 'Tableau de bord avancé'].map((item, i) => (
                        <div key={i} className="flex items-center gap-2 text-white/60 text-sm">
                          <div className="w-4 h-4 text-[#00FF88]"><Icons.Check /></div>
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-[#00FF88]/10 border border-[#00FF88]/30 rounded-xl p-4 mb-6">
                    <p className="text-white/60 text-sm">Montant à payer</p>
                    <p className="text-[#00FF88] font-bold text-3xl">16 000€</p>
                    <p className="text-white/40 text-sm">(18 000€ - 2 000€ déjà payés)</p>
                  </div>

                  <div className="flex gap-3">
                    <button onClick={() => setShowUpgradeModal(false)} className="flex-1 py-3 rounded-xl bg-white/5 text-white hover:bg-white/10 transition-colors">Plus tard</button>
                    <button onClick={handleUpgrade} className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#FF00E5] text-white font-semibold hover:opacity-90 transition-opacity">Upgrade</button>
                  </div>
                </div>
              </HoloCard>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Member Modal */}
      <AnimatePresence>
        {showMemberModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowMemberModal(null)}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} onClick={e => e.stopPropagation()} className="w-full max-w-md">
              <HoloCard glow={showMemberModal.status === 'completed' ? '#00FF88' : '#00F5FF'}>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <AvatarRing initials={showMemberModal.avatar} color={showMemberModal.status === 'completed' ? '#00FF88' : '#00F5FF'} size="lg" certified={showMemberModal.certificateIssued} />
                      <div>
                        <h3 className="text-xl font-bold text-white">{showMemberModal.name}</h3>
                        <p className="text-white/40">{showMemberModal.email}</p>
                      </div>
                    </div>
                    <button onClick={() => setShowMemberModal(null)} className="text-white/40 hover:text-white">
                      <div className="w-6 h-6"><Icons.X /></div>
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-3 mb-6">
                    <div className="p-3 rounded-xl bg-white/5 text-center">
                      <p className="text-2xl font-bold text-white">{showMemberModal.progress}%</p>
                      <p className="text-white/40 text-xs">Progression</p>
                    </div>
                    <div className="p-3 rounded-xl bg-white/5 text-center">
                      <p className="text-2xl font-bold text-white">{showMemberModal.modulesCompleted}/6</p>
                      <p className="text-white/40 text-xs">Modules</p>
                    </div>
                    <div className="p-3 rounded-xl bg-white/5 text-center">
                      <p className={`text-2xl font-bold ${showMemberModal.quizScore >= 80 ? 'text-[#00FF88]' : 'text-[#FF6B00]'}`}>{showMemberModal.quizScore}%</p>
                      <p className="text-white/40 text-xs">Quiz</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <LiquidProgress progress={showMemberModal.progress} color={showMemberModal.status === 'completed' ? '#00FF88' : '#00F5FF'} />
                  </div>

                  <div className="flex gap-3">
                    {showMemberModal.certificateIssued && (
                      <button onClick={() => handleDownloadCert(showMemberModal)} className="flex-1 py-3 rounded-xl bg-[#00FF88]/15 text-[#00FF88] font-medium flex items-center justify-center gap-2 hover:bg-[#00FF88]/25 transition-colors">
                        <div className="w-5 h-5"><Icons.Download /></div>
                        Certificat
                      </button>
                    )}
                    <button onClick={() => copyEmail(showMemberModal.email)} className="flex-1 py-3 rounded-xl bg-white/5 text-white font-medium flex items-center justify-center gap-2 hover:bg-white/10 transition-colors">
                      <div className="w-5 h-5">{copiedEmail === showMemberModal.email ? <Icons.Check /> : <Icons.Copy />}</div>
                      {copiedEmail === showMemberModal.email ? 'Copié !' : 'Copier email'}
                    </button>
                  </div>
                </div>
              </HoloCard>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
