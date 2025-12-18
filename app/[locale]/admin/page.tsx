'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  Users, UserPlus, Mail, MoreVertical, Search,
  CheckCircle, Clock, AlertCircle, Trophy, TrendingUp,
  Download, RefreshCw, X, Send, Trash2, Shield,
  Building2, Crown, BarChart3, Award,
  BookOpen, Target, Zap, ChevronDown, LogOut,
  Settings, Eye, ExternalLink, Copy, Check
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
  expiresIn: string;
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
const companyData = {
  name: 'Acme Corporation',
  plan: 'equipe' as const,
  seats: 5,
  usedSeats: 3,
};

const teamMembers: TeamMember[] = [
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

const pendingInvitations: Invitation[] = [
  { id: '1', email: 'sophie.leroy@acme.com', sentAt: '25 Jan 2024', expiresIn: '5 jours', status: 'pending' },
];

export default function AdminDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'overview' | 'team' | 'invitations'>('overview');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteEmails, setInviteEmails] = useState<string[]>(['']);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isInviting, setIsInviting] = useState(false);
  const [inviteSuccess, setInviteSuccess] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);

  // Stats calculées
  const stats = {
    totalMembers: teamMembers.length,
    activeMembersThisWeek: teamMembers.filter(m => m.status === 'active').length,
    averageProgress: Math.round(teamMembers.reduce((acc, m) => acc + m.progress, 0) / teamMembers.length),
    averageQuizScore: Math.round(teamMembers.reduce((acc, m) => acc + m.averageQuizScore, 0) / teamMembers.length),
    certificatesIssued: teamMembers.filter(m => m.certificateIssued).length,
    membersCompleted: teamMembers.filter(m => m.status === 'completed').length,
    seatsRemaining: companyData.seats - companyData.usedSeats,
  };

  const filteredMembers = teamMembers.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          member.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || member.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

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

  const handleAddEmailField = () => {
    if (inviteEmails.length < stats.seatsRemaining) {
      setInviteEmails([...inviteEmails, '']);
    }
  };

  const handleRemoveEmailField = (index: number) => {
    if (inviteEmails.length > 1) {
      setInviteEmails(inviteEmails.filter((_, i) => i !== index));
    }
  };

  const handleEmailChange = (index: number, value: string) => {
    const newEmails = [...inviteEmails];
    newEmails[index] = value;
    setInviteEmails(newEmails);
  };

  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validEmailsCount = inviteEmails.filter(e => isValidEmail(e)).length;

  const handleInvite = async () => {
    const validEmails = inviteEmails.filter(e => isValidEmail(e));
    if (validEmails.length === 0) return;

    setIsInviting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    console.log('Inviting:', validEmails);
    setInviteSuccess(true);
    
    setTimeout(() => {
      setShowInviteModal(false);
      setInviteEmails(['']);
      setInviteSuccess(false);
      setIsInviting(false);
    }, 2000);
  };

  const handleResendInvite = async (email: string) => {
    // Simulate resend
    console.log('Resending to:', email);
  };

  const handleCancelInvite = async (id: string) => {
    // Simulate cancel
    console.log('Cancelling invite:', id);
  };

  const handleCopyEmail = (email: string) => {
    navigator.clipboard.writeText(email);
    setCopiedEmail(email);
    setTimeout(() => setCopiedEmail(null), 2000);
  };

  const handleLogout = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-[#0f172a]">
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
            
            <div className="flex items-center gap-3">
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-2">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-cyan-400" />
                  <span className="text-white font-bold">{companyData.usedSeats}/{companyData.seats}</span>
                  <span className="text-slate-400 text-sm">places</span>
                </div>
              </div>
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
            { id: 'invitations', label: 'Invitations', icon: Mail, badge: pendingInvitations.length },
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
                  tab.id === 'invitations' ? 'bg-orange-500 text-white' : 'bg-slate-700 text-slate-300'
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

              {/* Progress Chart */}
              <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-6 mb-8">
                <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-cyan-400" />
                  Progression par module
                </h3>
                <div className="grid grid-cols-6 gap-2">
                  {[1, 2, 3, 4, 5, 6].map((moduleNum) => {
                    const completedCount = teamMembers.filter(m => m.modulesCompleted >= moduleNum).length;
                    const percentage = (completedCount / teamMembers.length) * 100;
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
                    <div key={member.id} className="flex items-center justify-between py-3 border-b border-slate-700/50 last:border-0">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {member.avatar}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-white font-medium">{member.name}</p>
                            {member.role === 'admin' && <Crown className="w-4 h-4 text-yellow-400" />}
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
                    placeholder="Rechercher un membre..."
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
              </div>

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
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-4">
                  <p className="text-slate-400 text-sm">Places disponibles</p>
                  <p className="text-2xl font-bold text-white">{stats.seatsRemaining}/{companyData.seats}</p>
                </div>
                <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-4">
                  <p className="text-slate-400 text-sm">Invitations en attente</p>
                  <p className="text-2xl font-bold text-orange-400">{pendingInvitations.length}</p>
                </div>
              </div>

              {/* Pending Invitations */}
              <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-6 mb-6">
                <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <Mail className="w-5 h-5 text-orange-400" />
                  Invitations en attente
                </h3>
                
                {pendingInvitations.length > 0 ? (
                  <div className="space-y-3">
                    {pendingInvitations.map((invitation) => (
                      <div
                        key={invitation.id}
                        className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-orange-500/20 rounded-full flex items-center justify-center">
                            <Mail className="w-5 h-5 text-orange-400" />
                          </div>
                          <div>
                            <p className="text-white font-medium">{invitation.email}</p>
                            <p className="text-slate-500 text-sm">Envoyée le {invitation.sentAt} • Expire dans {invitation.expiresIn}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => handleResendInvite(invitation.email)}
                            className="p-2 text-slate-400 hover:text-cyan-400 hover:bg-slate-700 rounded-lg transition-colors"
                            title="Renvoyer"
                          >
                            <RefreshCw className="w-5 h-5" />
                          </button>
                          <button 
                            onClick={() => handleCancelInvite(invitation.id)}
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
              className="bg-slate-800 border border-slate-700 rounded-2xl p-6 max-w-md w-full"
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
                            className={`w-full bg-slate-700/50 border rounded-xl pl-10 pr-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 ${
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
                        Envoyer {validEmailsCount > 0 ? `${validEmailsCount} invitation${validEmailsCount > 1 ? 's' : ''}` : 'les invitations'}
                      </>
                    )}
                  </button>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
