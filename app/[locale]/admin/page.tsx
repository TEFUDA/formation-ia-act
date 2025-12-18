'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  Users, UserPlus, Mail, Search,
  CheckCircle, Clock, AlertCircle, Trophy, TrendingUp,
  Download, RefreshCw, X, Send, Trash2, Shield,
  Building2, Crown, BarChart3, Award,
  BookOpen, Target, Zap, ChevronDown, LogOut,
  Settings, Copy, Check, Eye, MoreHorizontal,
  UserMinus, Bell, Filter
} from 'lucide-react';
import Link from 'next/link';

// Types
interface TeamMember {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'admin' | 'employee';
  status: 'active' | 'inactive' | 'completed' | 'not_started';
  progress: number;
  modulesCompleted: number;
  averageQuizScore: number;
  lastActivity: string;
  certificateIssued: boolean;
  invitedAt: string;
}

interface Invitation {
  id: string;
  email: string;
  sentAt: string;
  expiresAt: string;
  status: 'pending' | 'expired';
}

// Données admin simulées
const adminData = {
  id: 'admin-123',
  name: 'Jean',
  lastName: 'Dupont',
  email: 'jean.dupont@acme.com',
  avatar: 'JD',
};

// Données entreprise simulées
const initialCompanyData = {
  name: 'Acme Corporation',
  plan: 'equipe' as const,
  seats: 5,
  usedSeats: 3,
};

const initialTeamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'Jean Dupont',
    email: 'jean.dupont@acme.com',
    avatar: 'JD',
    role: 'admin',
    status: 'active',
    progress: 67,
    modulesCompleted: 4,
    averageQuizScore: 85,
    lastActivity: 'Il y a 2 heures',
    certificateIssued: false,
    invitedAt: '2024-01-15',
  },
  {
    id: '2',
    name: 'Marie Martin',
    email: 'marie.martin@acme.com',
    avatar: 'MM',
    role: 'employee',
    status: 'completed',
    progress: 100,
    modulesCompleted: 6,
    averageQuizScore: 92,
    lastActivity: 'Il y a 1 jour',
    certificateIssued: true,
    invitedAt: '2024-01-16',
  },
  {
    id: '3',
    name: 'Pierre Bernard',
    email: 'pierre.bernard@acme.com',
    avatar: 'PB',
    role: 'employee',
    status: 'active',
    progress: 33,
    modulesCompleted: 2,
    averageQuizScore: 78,
    lastActivity: 'Il y a 3 jours',
    certificateIssued: false,
    invitedAt: '2024-01-20',
  },
];

const initialInvitations: Invitation[] = [
  { id: 'inv-1', email: 'sophie.leroy@acme.com', sentAt: '25 Jan 2024', expiresAt: '01 Fév 2024', status: 'pending' },
  { id: 'inv-2', email: 'lucas.petit@acme.com', sentAt: '20 Jan 2024', expiresAt: '27 Jan 2024', status: 'expired' },
];

export default function AdminDashboardPage() {
  const router = useRouter();
  
  // State
  const [activeTab, setActiveTab] = useState<'overview' | 'team' | 'invitations'>('overview');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showMemberModal, setShowMemberModal] = useState<TeamMember | null>(null);
  const [showRemoveConfirm, setShowRemoveConfirm] = useState<string | null>(null);
  const [showCancelInviteConfirm, setShowCancelInviteConfirm] = useState<string | null>(null);
  
  // Data state (simulated - changes persist during session)
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(initialTeamMembers);
  const [invitations, setInvitations] = useState<Invitation[]>(initialInvitations);
  const [companyData, setCompanyData] = useState(initialCompanyData);
  
  // Form state
  const [inviteEmails, setInviteEmails] = useState<string[]>(['']);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterRole, setFilterRole] = useState<string>('all');
  
  // UI state
  const [isInviting, setIsInviting] = useState(false);
  const [inviteSuccess, setInviteSuccess] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);
  const [resendingId, setResendingId] = useState<string | null>(null);
  const [resendSuccess, setResendSuccess] = useState<string | null>(null);
  const [notification, setNotification] = useState<{type: 'success' | 'error', message: string} | null>(null);

  // Stats calculées
  const stats = {
    totalMembers: teamMembers.length,
    activeMembersThisWeek: teamMembers.filter(m => m.status === 'active' || m.status === 'completed').length,
    averageProgress: teamMembers.length > 0 ? Math.round(teamMembers.reduce((acc, m) => acc + m.progress, 0) / teamMembers.length) : 0,
    averageQuizScore: teamMembers.length > 0 ? Math.round(teamMembers.reduce((acc, m) => acc + m.averageQuizScore, 0) / teamMembers.length) : 0,
    certificatesIssued: teamMembers.filter(m => m.certificateIssued).length,
    membersCompleted: teamMembers.filter(m => m.status === 'completed').length,
    seatsRemaining: companyData.seats - companyData.usedSeats,
    pendingInvitations: invitations.filter(i => i.status === 'pending').length,
  };

  // Filtered members
  const filteredMembers = teamMembers.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          member.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || member.status === filterStatus;
    const matchesRole = filterRole === 'all' || member.role === filterRole;
    return matchesSearch && matchesStatus && matchesRole;
  });

  // Show notification
  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  // Status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 text-xs rounded-full flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Terminé</span>;
      case 'active':
        return <span className="px-2 py-1 bg-cyan-500/20 text-cyan-400 text-xs rounded-full flex items-center gap-1"><Clock className="w-3 h-3" /> En cours</span>;
      case 'inactive':
        return <span className="px-2 py-1 bg-orange-500/20 text-orange-400 text-xs rounded-full flex items-center gap-1"><AlertCircle className="w-3 h-3" /> Inactif</span>;
      default:
        return <span className="px-2 py-1 bg-slate-500/20 text-slate-400 text-xs rounded-full">Non commencé</span>;
    }
  };

  // Email validation
  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validEmailsCount = inviteEmails.filter(e => isValidEmail(e)).length;

  // ===== ACTIONS =====

  // Add email field
  const handleAddEmailField = () => {
    if (inviteEmails.length < stats.seatsRemaining) {
      setInviteEmails([...inviteEmails, '']);
    }
  };

  // Remove email field
  const handleRemoveEmailField = (index: number) => {
    if (inviteEmails.length > 1) {
      setInviteEmails(inviteEmails.filter((_, i) => i !== index));
    }
  };

  // Update email field
  const handleEmailChange = (index: number, value: string) => {
    const newEmails = [...inviteEmails];
    newEmails[index] = value;
    setInviteEmails(newEmails);
  };

  // Send invitations
  const handleInvite = async () => {
    const validEmails = inviteEmails.filter(e => isValidEmail(e));
    if (validEmails.length === 0) return;

    setIsInviting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Add new invitations
    const newInvitations: Invitation[] = validEmails.map((email, i) => ({
      id: `inv-new-${Date.now()}-${i}`,
      email,
      sentAt: new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }),
      status: 'pending' as const,
    }));
    
    setInvitations([...newInvitations, ...invitations]);
    setCompanyData(prev => ({ ...prev, usedSeats: prev.usedSeats + validEmails.length }));
    setInviteSuccess(true);
    
    setTimeout(() => {
      setShowInviteModal(false);
      setInviteEmails(['']);
      setInviteSuccess(false);
      setIsInviting(false);
      showNotification('success', `${validEmails.length} invitation${validEmails.length > 1 ? 's' : ''} envoyée${validEmails.length > 1 ? 's' : ''}`);
    }, 1500);
  };

  // Resend invitation
  const handleResendInvite = async (invitation: Invitation) => {
    setResendingId(invitation.id);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Update invitation
    setInvitations(prev => prev.map(inv => 
      inv.id === invitation.id 
        ? { 
            ...inv, 
            sentAt: new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }),
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }),
            status: 'pending' as const
          }
        : inv
    ));
    
    setResendingId(null);
    setResendSuccess(invitation.id);
    setTimeout(() => setResendSuccess(null), 2000);
    showNotification('success', `Invitation renvoyée à ${invitation.email}`);
  };

  // Cancel invitation
  const handleCancelInvite = async (id: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const invitation = invitations.find(i => i.id === id);
    setInvitations(prev => prev.filter(inv => inv.id !== id));
    setCompanyData(prev => ({ ...prev, usedSeats: Math.max(prev.usedSeats - 1, teamMembers.length) }));
    setShowCancelInviteConfirm(null);
    showNotification('success', `Invitation annulée pour ${invitation?.email}`);
  };

  // Remove member
  const handleRemoveMember = async (memberId: string) => {
    const member = teamMembers.find(m => m.id === memberId);
    if (member?.role === 'admin') {
      showNotification('error', 'Impossible de supprimer un administrateur');
      return;
    }
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setTeamMembers(prev => prev.filter(m => m.id !== memberId));
    setCompanyData(prev => ({ ...prev, usedSeats: prev.usedSeats - 1 }));
    setShowRemoveConfirm(null);
    setShowMemberModal(null);
    showNotification('success', `${member?.name} a été retiré de l'équipe`);
  };

  // Copy email
  const handleCopyEmail = (email: string) => {
    navigator.clipboard.writeText(email);
    setCopiedEmail(email);
    setTimeout(() => setCopiedEmail(null), 2000);
  };

  // Export team data
  const handleExportData = () => {
    const data = teamMembers.map(m => ({
      Nom: m.name,
      Email: m.email,
      Role: m.role,
      Statut: m.status,
      Progression: `${m.progress}%`,
      Modules: `${m.modulesCompleted}/6`,
      'Score Quiz': `${m.averageQuizScore}%`,
      Certificat: m.certificateIssued ? 'Oui' : 'Non',
    }));
    
    const csv = [
      Object.keys(data[0]).join(','),
      ...data.map(row => Object.values(row).join(','))
    ].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `equipe-formation-ia-act-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    
    showNotification('success', 'Export téléchargé');
  };

  // Send reminder to inactive members
  const handleSendReminders = async () => {
    const inactiveMembers = teamMembers.filter(m => m.status === 'inactive' || m.status === 'not_started');
    if (inactiveMembers.length === 0) {
      showNotification('error', 'Aucun membre inactif');
      return;
    }
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    showNotification('success', `Rappel envoyé à ${inactiveMembers.length} membre${inactiveMembers.length > 1 ? 's' : ''}`);
  };

  // Logout
  const handleLogout = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-[#0f172a]">
      {/* Notification Toast */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className={`fixed top-4 right-4 z-[100] px-4 py-3 rounded-xl shadow-lg flex items-center gap-3 ${
              notification.type === 'success' 
                ? 'bg-emerald-500 text-white' 
                : 'bg-red-500 text-white'
            }`}
          >
            {notification.type === 'success' ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            {notification.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="bg-[#0f172a]/95 backdrop-blur-xl border-b border-slate-800/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <span className="text-lg font-bold text-white hidden sm:block">Formation AI Act</span>
            </Link>

            <div className="flex items-center gap-3">
              {/* Back to Dashboard */}
              <Link
                href="/dashboard"
                className="flex items-center gap-2 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 rounded-lg px-3 py-1.5 text-cyan-400 text-sm font-medium transition-colors"
              >
                <BookOpen className="w-4 h-4" />
                <span className="hidden sm:inline">Ma formation</span>
              </Link>

              {/* Admin Badge */}
              <div className="flex items-center gap-2 bg-purple-500/10 border border-purple-500/30 rounded-full px-3 py-1.5">
                <Crown className="w-4 h-4 text-purple-400" />
                <span className="text-purple-400 text-sm font-medium hidden sm:inline">Admin</span>
              </div>

              {/* Profile Menu */}
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-2 hover:bg-slate-800/50 rounded-lg p-1 transition-colors"
                >
                  <div className="w-9 h-9 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {adminData.avatar}
                  </div>
                  <ChevronDown className={`w-4 h-4 text-slate-400 hidden sm:block transition-transform ${showProfileMenu ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {showProfileMenu && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setShowProfileMenu(false)} />
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 top-12 w-64 bg-slate-800 border border-slate-700 rounded-xl shadow-xl z-50 overflow-hidden"
                      >
                        <div className="p-4 border-b border-slate-700">
                          <p className="text-white font-semibold">{adminData.name} {adminData.lastName}</p>
                          <p className="text-slate-400 text-sm truncate">{adminData.email}</p>
                        </div>
                        <div className="p-2">
                          <Link
                            href="/dashboard"
                            onClick={() => setShowProfileMenu(false)}
                            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-700/50 hover:text-white transition-colors"
                          >
                            <BookOpen className="w-5 h-5 text-cyan-400" />
                            <span>Ma formation</span>
                          </Link>
                          <button
                            onClick={() => setShowProfileMenu(false)}
                            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-700/50 hover:text-white transition-colors"
                          >
                            <Settings className="w-5 h-5" />
                            <span>Paramètres</span>
                          </button>
                          <hr className="my-2 border-slate-700" />
                          <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
                          >
                            <LogOut className="w-5 h-5" />
                            <span>Déconnexion</span>
                          </button>
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Building2 className="w-6 h-6 text-cyan-400" />
                <h1 className="text-2xl font-bold text-white">{companyData.name}</h1>
              </div>
              <p className="text-slate-400">
                Gérez votre équipe et suivez leur progression dans la formation AI Act
              </p>
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-2">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-cyan-400" />
                  <span className="text-white font-bold">{companyData.usedSeats}/{companyData.seats}</span>
                  <span className="text-slate-400 text-sm">places</span>
                </div>
              </div>
              
              <button
                onClick={handleExportData}
                className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition-colors"
              >
                <Download className="w-5 h-5" />
                <span className="hidden sm:inline">Exporter</span>
              </button>
              
              <button
                onClick={() => setShowInviteModal(true)}
                disabled={stats.seatsRemaining === 0}
                className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold px-4 py-2 rounded-xl flex items-center gap-2 transition-all"
              >
                <UserPlus className="w-5 h-5" />
                Inviter
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-slate-800 pb-4 overflow-x-auto">
          {[
            { id: 'overview', label: 'Vue d\'ensemble', icon: BarChart3 },
            { id: 'team', label: 'Équipe', icon: Users, badge: teamMembers.length },
            { id: 'invitations', label: 'Invitations', icon: Mail, badge: stats.pendingInvitations },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-cyan-500/20 text-cyan-400'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
              {tab.badge !== undefined && tab.badge > 0 && (
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  tab.id === 'invitations' && tab.badge > 0 ? 'bg-orange-500 text-white' : 'bg-slate-700 text-slate-300'
                }`}>
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {/* Stats Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                      <Users className="w-5 h-5 text-cyan-400" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-white">{stats.activeMembersThisWeek}</div>
                  <p className="text-slate-500 text-sm mt-1">Membres actifs</p>
                </div>

                <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                      <Target className="w-5 h-5 text-emerald-400" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-white">{stats.averageProgress}%</div>
                  <p className="text-slate-500 text-sm mt-1">Progression moyenne</p>
                </div>

                <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                      <Zap className="w-5 h-5 text-yellow-400" />
                    </div>
                  </div>
                  <div className={`text-3xl font-bold ${stats.averageQuizScore >= 80 ? 'text-emerald-400' : 'text-orange-400'}`}>
                    {stats.averageQuizScore}%
                  </div>
                  <p className="text-slate-500 text-sm mt-1">Score moyen quiz</p>
                </div>

                <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                      <Award className="w-5 h-5 text-purple-400" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-white">{stats.certificatesIssued}</div>
                  <p className="text-slate-500 text-sm mt-1">Certificats délivrés</p>
                </div>
              </div>

              {/* Actions rapides */}
              <div className="grid sm:grid-cols-2 gap-4 mb-8">
                <button
                  onClick={handleSendReminders}
                  className="bg-slate-800/30 border border-slate-700/50 hover:border-cyan-500/50 rounded-xl p-5 text-left transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center group-hover:bg-orange-500/30 transition-colors">
                      <Bell className="w-6 h-6 text-orange-400" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">Envoyer des rappels</h3>
                      <p className="text-slate-400 text-sm">Relancer les membres inactifs</p>
                    </div>
                  </div>
                </button>
                
                <button
                  onClick={handleExportData}
                  className="bg-slate-800/30 border border-slate-700/50 hover:border-cyan-500/50 rounded-xl p-5 text-left transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center group-hover:bg-emerald-500/30 transition-colors">
                      <Download className="w-6 h-6 text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">Exporter les données</h3>
                      <p className="text-slate-400 text-sm">Télécharger un rapport CSV</p>
                    </div>
                  </div>
                </button>
              </div>

              {/* Progress Chart */}
              <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-6 mb-8">
                <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-cyan-400" />
                  Progression par module
                </h3>
                <div className="grid grid-cols-6 gap-2">
                  {[1, 2, 3, 4, 5, 6].map((moduleNum) => {
                    const completedCount = teamMembers.filter(m => m.modulesCompleted >= moduleNum).length;
                    const percentage = teamMembers.length > 0 ? (completedCount / teamMembers.length) * 100 : 0;
                    return (
                      <div key={moduleNum} className="text-center">
                        <div className="h-32 bg-slate-700/50 rounded-lg relative overflow-hidden mb-2">
                          <motion.div 
                            initial={{ height: 0 }}
                            animate={{ height: `${percentage}%` }}
                            transition={{ duration: 0.8, delay: moduleNum * 0.1 }}
                            className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-cyan-500 to-cyan-400"
                          />
                        </div>
                        <p className="text-slate-400 text-xs">M{moduleNum}</p>
                        <p className="text-white font-medium text-sm">{completedCount}/{teamMembers.length}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-6">
                <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-cyan-400" />
                  Activité récente
                </h3>
                <div className="space-y-4">
                  {teamMembers.slice(0, 5).map((member) => (
                    <div 
                      key={member.id} 
                      className="flex items-center justify-between py-3 border-b border-slate-700/50 last:border-0 cursor-pointer hover:bg-slate-800/30 -mx-2 px-2 rounded-lg transition-colors"
                      onClick={() => setShowMemberModal(member)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {member.avatar}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-white font-medium">{member.name}</p>
                            {member.role === 'admin' && <Crown className="w-4 h-4 text-yellow-400" />}
                            {member.certificateIssued && <Award className="w-4 h-4 text-emerald-400" />}
                          </div>
                          <p className="text-slate-500 text-sm">{member.lastActivity}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-medium">{member.progress}%</p>
                        <p className="text-slate-500 text-sm">{member.modulesCompleted}/6 modules</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Team Tab */}
          {activeTab === 'team' && (
            <motion.div
              key="team"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {/* Search and Filters */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Rechercher par nom ou email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl pl-10 pr-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  <option value="all">Tous les statuts</option>
                  <option value="active">En cours</option>
                  <option value="completed">Terminé</option>
                  <option value="inactive">Inactif</option>
                  <option value="not_started">Non commencé</option>
                </select>
                <select
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                  className="bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  <option value="all">Tous les rôles</option>
                  <option value="admin">Admin</option>
                  <option value="employee">Employé</option>
                </select>
              </div>

              {/* Results count */}
              <p className="text-slate-400 text-sm mb-4">
                {filteredMembers.length} membre{filteredMembers.length > 1 ? 's' : ''} trouvé{filteredMembers.length > 1 ? 's' : ''}
              </p>

              {/* Team Members Grid */}
              <div className="grid gap-4">
                {filteredMembers.map((member) => (
                  <div
                    key={member.id}
                    className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-5 hover:border-slate-600 transition-all"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                          {member.avatar}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-white font-semibold">{member.name}</h4>
                            {member.role === 'admin' && <Crown className="w-4 h-4 text-yellow-400" />}
                            {member.certificateIssued && <Award className="w-4 h-4 text-emerald-400" />}
                          </div>
                          <div className="flex items-center gap-2">
                            <p className="text-slate-400 text-sm">{member.email}</p>
                            <button
                              onClick={() => handleCopyEmail(member.email)}
                              className="text-slate-500 hover:text-white"
                            >
                              {copiedEmail === member.email ? (
                                <Check className="w-3 h-3 text-emerald-400" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-4">
                        {getStatusBadge(member.status)}
                        
                        <div className="text-center">
                          <p className="text-white font-bold">{member.progress}%</p>
                          <p className="text-slate-500 text-xs">Progression</p>
                        </div>
                        
                        <div className="text-center">
                          <p className="text-white font-bold">{member.modulesCompleted}/6</p>
                          <p className="text-slate-500 text-xs">Modules</p>
                        </div>
                        
                        <div className="text-center">
                          <p className={`font-bold ${member.averageQuizScore >= 80 ? 'text-emerald-400' : 'text-orange-400'}`}>
                            {member.averageQuizScore}%
                          </p>
                          <p className="text-slate-500 text-xs">Quiz</p>
                        </div>
                        
                        <button
                          onClick={() => setShowMemberModal(member)}
                          className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    <div className="mt-4">
                      <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all ${
                            member.status === 'completed' ? 'bg-emerald-500' : 'bg-cyan-500'
                          }`}
                          style={{ width: `${member.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}

                {filteredMembers.length === 0 && (
                  <div className="text-center py-12 text-slate-400">
                    <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Aucun membre trouvé</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Invitations Tab */}
          {activeTab === 'invitations' && (
            <motion.div
              key="invitations"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {/* Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-4">
                  <p className="text-slate-400 text-sm">Places totales</p>
                  <p className="text-2xl font-bold text-white">{companyData.seats}</p>
                </div>
                <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-4">
                  <p className="text-slate-400 text-sm">Places utilisées</p>
                  <p className="text-2xl font-bold text-cyan-400">{companyData.usedSeats}</p>
                </div>
                <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-4">
                  <p className="text-slate-400 text-sm">Places disponibles</p>
                  <p className="text-2xl font-bold text-emerald-400">{stats.seatsRemaining}</p>
                </div>
                <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-4">
                  <p className="text-slate-400 text-sm">En attente</p>
                  <p className="text-2xl font-bold text-orange-400">{stats.pendingInvitations}</p>
                </div>
              </div>

              {/* Pending Invitations */}
              <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-6 mb-6">
                <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <Mail className="w-5 h-5 text-orange-400" />
                  Invitations en attente
                </h3>
                
                {invitations.filter(i => i.status === 'pending').length > 0 ? (
                  <div className="space-y-3">
                    {invitations.filter(i => i.status === 'pending').map((invitation) => (
                      <div
                        key={invitation.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-slate-800/50 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-orange-500/20 rounded-full flex items-center justify-center">
                            <Mail className="w-5 h-5 text-orange-400" />
                          </div>
                          <div>
                            <p className="text-white font-medium">{invitation.email}</p>
                            <p className="text-slate-500 text-sm">Envoyée le {invitation.sentAt} • Expire le {invitation.expiresAt}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {resendSuccess === invitation.id ? (
                            <span className="text-emerald-400 text-sm flex items-center gap-1">
                              <CheckCircle className="w-4 h-4" /> Renvoyée
                            </span>
                          ) : (
                            <button 
                              onClick={() => handleResendInvite(invitation)}
                              disabled={resendingId === invitation.id}
                              className="p-2 text-slate-400 hover:text-cyan-400 hover:bg-slate-700 rounded-lg transition-colors disabled:opacity-50"
                              title="Renvoyer"
                            >
                              {resendingId === invitation.id ? (
                                <div className="w-5 h-5 border-2 border-slate-400/30 border-t-cyan-400 rounded-full animate-spin" />
                              ) : (
                                <RefreshCw className="w-5 h-5" />
                              )}
                            </button>
                          )}
                          <button 
                            onClick={() => setShowCancelInviteConfirm(invitation.id)}
                            className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-700 rounded-lg transition-colors"
                            title="Annuler"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-400 text-center py-8">Aucune invitation en attente</p>
                )}
              </div>

              {/* Expired Invitations */}
              {invitations.filter(i => i.status === 'expired').length > 0 && (
                <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-6 mb-6">
                  <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-red-400" />
                    Invitations expirées
                  </h3>
                  <div className="space-y-3">
                    {invitations.filter(i => i.status === 'expired').map((invitation) => (
                      <div
                        key={invitation.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-slate-800/50 rounded-lg opacity-60"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center">
                            <Mail className="w-5 h-5 text-red-400" />
                          </div>
                          <div>
                            <p className="text-white font-medium">{invitation.email}</p>
                            <p className="text-slate-500 text-sm">Expirée le {invitation.expiresAt}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => handleResendInvite(invitation)}
                            disabled={resendingId === invitation.id}
                            className="px-3 py-1.5 bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 rounded-lg transition-colors text-sm flex items-center gap-1"
                          >
                            <RefreshCw className="w-4 h-4" />
                            Relancer
                          </button>
                          <button 
                            onClick={() => setShowCancelInviteConfirm(invitation.id)}
                            className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-700 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Invite Button */}
              <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-xl p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-white font-semibold mb-1">Inviter de nouveaux membres</h3>
                    <p className="text-slate-400 text-sm">
                      {stats.seatsRemaining > 0 
                        ? `Vous pouvez encore inviter ${stats.seatsRemaining} personne${stats.seatsRemaining > 1 ? 's' : ''}`
                        : 'Toutes vos places sont utilisées'
                      }
                    </p>
                  </div>
                  <button
                    onClick={() => setShowInviteModal(true)}
                    disabled={stats.seatsRemaining === 0}
                    className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold px-6 py-3 rounded-xl flex items-center gap-2 transition-all"
                  >
                    <UserPlus className="w-5 h-5" />
                    Inviter
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* ===== MODALS ===== */}

      {/* Invite Modal */}
      <AnimatePresence>
        {showInviteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => !isInviting && setShowInviteModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-800 border border-slate-700 rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {inviteSuccess ? (
                <div className="text-center py-6">
                  <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Invitations envoyées !</h3>
                  <p className="text-slate-400">
                    {validEmailsCount} invitation{validEmailsCount > 1 ? 's' : ''} envoyée{validEmailsCount > 1 ? 's' : ''} avec succès
                  </p>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-white">Inviter des membres</h3>
                    <button onClick={() => setShowInviteModal(false)} className="text-slate-400 hover:text-white">
                      <X className="w-6 h-6" />
                    </button>
                  </div>

                  <p className="text-slate-400 text-sm mb-4">
                    {stats.seatsRemaining} place{stats.seatsRemaining > 1 ? 's' : ''} disponible{stats.seatsRemaining > 1 ? 's' : ''}
                  </p>

                  <div className="space-y-3 mb-4">
                    {inviteEmails.map((email, index) => (
                      <div key={index} className="flex gap-2">
                        <div className="relative flex-1">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                          <input
                            type="email"
                            placeholder="email@entreprise.com"
                            value={email}
                            onChange={(e) => handleEmailChange(index, e.target.value)}
                            className={`w-full bg-slate-700/50 border rounded-xl pl-10 pr-10 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 ${
                              email && !isValidEmail(email) ? 'border-orange-500' : 'border-slate-600'
                            }`}
                          />
                          {email && isValidEmail(email) && (
                            <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-400" />
                          )}
                        </div>
                        {inviteEmails.length > 1 && (
                          <button
                            onClick={() => handleRemoveEmailField(index)}
                            className="p-3 text-slate-400 hover:text-red-400 hover:bg-slate-700 rounded-xl transition-colors"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  {inviteEmails.length < stats.seatsRemaining && (
                    <button
                      onClick={handleAddEmailField}
                      className="w-full py-2 border-2 border-dashed border-slate-600 hover:border-cyan-500 rounded-xl text-slate-400 hover:text-cyan-400 flex items-center justify-center gap-2 transition-colors mb-4"
                    >
                      <UserPlus className="w-4 h-4" />
                      Ajouter un email
                    </button>
                  )}

                  <div className="bg-slate-700/30 rounded-lg p-3 mb-4">
                    <p className="text-slate-300 text-sm">
                      📧 Un email d'invitation sera envoyé avec un lien pour rejoindre la formation. L'invitation expire après 7 jours.
                    </p>
                  </div>

                  <button
                    onClick={handleInvite}
                    disabled={validEmailsCount === 0 || isInviting}
                    className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-all"
                  >
                    {isInviting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Envoi en cours...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Envoyer {validEmailsCount > 0 ? `${validEmailsCount} invitation${validEmailsCount > 1 ? 's' : ''}` : ''}
                      </>
                    )}
                  </button>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Member Detail Modal */}
      <AnimatePresence>
        {showMemberModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowMemberModal(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-800 border border-slate-700 rounded-2xl p-6 max-w-lg w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                    {showMemberModal.avatar}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-bold text-white">{showMemberModal.name}</h3>
                      {showMemberModal.role === 'admin' && <Crown className="w-5 h-5 text-yellow-400" />}
                    </div>
                    <p className="text-slate-400">{showMemberModal.email}</p>
                    {getStatusBadge(showMemberModal.status)}
                  </div>
                </div>
                <button onClick={() => setShowMemberModal(null)} className="text-slate-400 hover:text-white">
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-slate-700/30 rounded-xl p-4 text-center">
                  <p className="text-3xl font-bold text-white">{showMemberModal.progress}%</p>
                  <p className="text-slate-500 text-sm">Progression</p>
                </div>
                <div className="bg-slate-700/30 rounded-xl p-4 text-center">
                  <p className="text-3xl font-bold text-white">{showMemberModal.modulesCompleted}/6</p>
                  <p className="text-slate-500 text-sm">Modules</p>
                </div>
                <div className="bg-slate-700/30 rounded-xl p-4 text-center">
                  <p className={`text-3xl font-bold ${showMemberModal.averageQuizScore >= 80 ? 'text-emerald-400' : 'text-orange-400'}`}>
                    {showMemberModal.averageQuizScore}%
                  </p>
                  <p className="text-slate-500 text-sm">Score Quiz</p>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mb-6">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-400">Progression globale</span>
                  <span className="text-white font-medium">{showMemberModal.progress}%</span>
                </div>
                <div className="h-3 bg-slate-700/50 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${showMemberModal.status === 'completed' ? 'bg-emerald-500' : 'bg-cyan-500'}`}
                    style={{ width: `${showMemberModal.progress}%` }}
                  />
                </div>
              </div>

              {/* Info */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between py-2 border-b border-slate-700/50">
                  <span className="text-slate-400">Rôle</span>
                  <span className="text-white capitalize">{showMemberModal.role}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-700/50">
                  <span className="text-slate-400">Dernière activité</span>
                  <span className="text-white">{showMemberModal.lastActivity}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-700/50">
                  <span className="text-slate-400">Invité le</span>
                  <span className="text-white">{showMemberModal.invitedAt}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-slate-400">Certificat</span>
                  <span className={showMemberModal.certificateIssued ? 'text-emerald-400' : 'text-slate-500'}>
                    {showMemberModal.certificateIssued ? '✓ Obtenu' : 'Non obtenu'}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => handleCopyEmail(showMemberModal.email)}
                  className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-3 rounded-xl flex items-center justify-center gap-2 transition-colors"
                >
                  {copiedEmail === showMemberModal.email ? (
                    <>
                      <Check className="w-5 h-5 text-emerald-400" />
                      Copié !
                    </>
                  ) : (
                    <>
                      <Copy className="w-5 h-5" />
                      Copier email
                    </>
                  )}
                </button>
                {showMemberModal.role !== 'admin' && (
                  <button
                    onClick={() => setShowRemoveConfirm(showMemberModal.id)}
                    className="bg-red-500/20 hover:bg-red-500/30 text-red-400 py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors"
                  >
                    <UserMinus className="w-5 h-5" />
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Remove Member Confirmation Modal */}
      <AnimatePresence>
        {showRemoveConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
            onClick={() => setShowRemoveConfirm(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-800 border border-slate-700 rounded-2xl p-6 max-w-sm w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-6 h-6 text-red-400" />
              </div>
              <h3 className="text-xl font-bold text-white text-center mb-2">Retirer ce membre ?</h3>
              <p className="text-slate-400 text-center mb-6">
                Cette action supprimera l'accès de ce membre à la formation. Cette action est irréversible.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowRemoveConfirm(null)}
                  className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-3 rounded-xl transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={() => handleRemoveMember(showRemoveConfirm)}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl transition-colors"
                >
                  Retirer
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cancel Invitation Confirmation Modal */}
      <AnimatePresence>
        {showCancelInviteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
            onClick={() => setShowCancelInviteConfirm(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-800 border border-slate-700 rounded-2xl p-6 max-w-sm w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-6 h-6 text-orange-400" />
              </div>
              <h3 className="text-xl font-bold text-white text-center mb-2">Annuler cette invitation ?</h3>
              <p className="text-slate-400 text-center mb-6">
                Le lien d'invitation sera désactivé et la place sera libérée.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowCancelInviteConfirm(null)}
                  className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-3 rounded-xl transition-colors"
                >
                  Non, garder
                </button>
                <button
                  onClick={() => handleCancelInvite(showCancelInviteConfirm)}
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl transition-colors"
                >
                  Oui, annuler
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
