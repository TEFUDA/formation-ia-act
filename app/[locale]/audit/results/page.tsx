'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

// ============================================
// ICONS
// ============================================

const Icons = {
  Shield: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  Download: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
  ArrowRight: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
  ArrowLeft: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>,
  Check: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-full h-full"><polyline points="20 6 9 17 4 12"/></svg>,
  FileText: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
  Award: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>,
  TrendingUp: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
  AlertTriangle: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  Calendar: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  Users: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  Briefcase: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>,
  BarChart: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/></svg>,
  Target: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>,
  Clock: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  ExternalLink: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>,
};

// ============================================
// COMPONENTS
// ============================================

const NeuralBackground = () => (
  <div className="fixed inset-0 pointer-events-none overflow-hidden">
    <div className="absolute inset-0 bg-[#030014]" />
    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#8B5CF6]/8 blur-[120px] rounded-full" />
    <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#00FF88]/6 blur-[100px] rounded-full" />
  </div>
);

const HoloCard = ({ children, glow = '#8B5CF6', className = '' }: { children: React.ReactNode, glow?: string, className?: string }) => (
  <div className={`relative group ${className}`}>
    <div className="absolute -inset-[1px] rounded-2xl opacity-0 group-hover:opacity-40 transition-opacity duration-300" style={{ background: `linear-gradient(135deg, ${glow}40, transparent 50%, ${glow}40)` }} />
    <div className="relative bg-[#0A0A1B]/90 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden h-full">
      <div className="relative h-full">{children}</div>
    </div>
  </div>
);

// Radar Chart Component
const RadarChart = ({ data }: { data: { label: string; value: number; color: string }[] }) => {
  const size = 200;
  const center = size / 2;
  const radius = 80;
  const levels = 5;

  const angleStep = (2 * Math.PI) / data.length;

  // Calculate points for the data polygon
  const dataPoints = data.map((d, i) => {
    const angle = i * angleStep - Math.PI / 2;
    const r = (d.value / 100) * radius;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    };
  });

  const dataPath = dataPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';

  return (
    <svg width={size} height={size} className="mx-auto">
      {/* Grid circles */}
      {Array.from({ length: levels }).map((_, i) => (
        <circle
          key={i}
          cx={center}
          cy={center}
          r={(radius / levels) * (i + 1)}
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="1"
        />
      ))}

      {/* Axis lines */}
      {data.map((_, i) => {
        const angle = i * angleStep - Math.PI / 2;
        return (
          <line
            key={i}
            x1={center}
            y1={center}
            x2={center + radius * Math.cos(angle)}
            y2={center + radius * Math.sin(angle)}
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="1"
          />
        );
      })}

      {/* Data polygon */}
      <path
        d={dataPath}
        fill="rgba(139, 92, 246, 0.3)"
        stroke="#8B5CF6"
        strokeWidth="2"
      />

      {/* Data points */}
      {dataPoints.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="4" fill={data[i].color} />
      ))}

      {/* Labels */}
      {data.map((d, i) => {
        const angle = i * angleStep - Math.PI / 2;
        const labelRadius = radius + 25;
        const x = center + labelRadius * Math.cos(angle);
        const y = center + labelRadius * Math.sin(angle);
        return (
          <text
            key={i}
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="rgba(255,255,255,0.7)"
            fontSize="10"
          >
            {d.value}%
          </text>
        );
      })}
    </svg>
  );
};

// Score Gauge Component
const ScoreGauge = ({ score, size = 180 }: { score: number; size?: number }) => {
  const getColor = (s: number) => s >= 70 ? '#00FF88' : s >= 40 ? '#FFB800' : '#FF4444';
  const color = getColor(score);
  const circumference = 2 * Math.PI * 70;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={70}
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="12"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={70}
          fill="none"
          stroke={color}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className="text-5xl font-bold"
          style={{ color }}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
        >
          {score}%
        </motion.span>
        <span className="text-white/50 text-sm">Conformité</span>
      </div>
    </div>
  );
};

// ============================================
// RECOMMENDATIONS DATA
// ============================================

const getRecommendations = (categoryScores: any[], highRiskFlags: string[]) => {
  const recommendations: { priority: 'critical' | 'high' | 'medium' | 'low'; text: string; category: string; aiActRef?: string }[] = [];

  // Critical if high risk detected
  if (highRiskFlags.length > 0) {
    recommendations.push({
      priority: 'critical',
      text: 'Réaliser une Analyse d\'Impact sur les Droits Fondamentaux (FRIA) pour vos systèmes à haut risque',
      category: 'classification',
      aiActRef: 'Article 27'
    });
  }

  // Check each category
  categoryScores.forEach(cat => {
    if (cat.category === 'inventory' && cat.score < 70) {
      recommendations.push({
        priority: cat.score < 40 ? 'critical' : 'high',
        text: 'Compléter l\'inventaire de tous vos systèmes IA',
        category: 'inventory',
        aiActRef: 'Article 49'
      });
    }
    if (cat.category === 'classification' && cat.score < 70) {
      recommendations.push({
        priority: cat.score < 40 ? 'critical' : 'high',
        text: 'Classifier vos systèmes IA selon les 4 niveaux de risque AI Act',
        category: 'classification',
        aiActRef: 'Article 6'
      });
    }
    if (cat.category === 'governance' && cat.score < 70) {
      recommendations.push({
        priority: cat.score < 40 ? 'high' : 'medium',
        text: 'Désigner un Référent IA et formaliser la gouvernance',
        category: 'governance'
      });
      if (cat.score < 50) {
        recommendations.push({
          priority: 'medium',
          text: 'Rédiger et diffuser une politique d\'utilisation de l\'IA',
          category: 'governance'
        });
      }
    }
    if (cat.category === 'documentation' && cat.score < 70) {
      recommendations.push({
        priority: cat.score < 40 ? 'critical' : 'high',
        text: 'Obtenir la documentation technique de vos systèmes IA haut risque',
        category: 'documentation',
        aiActRef: 'Annexe IV'
      });
    }
    if (cat.category === 'training' && cat.score < 70) {
      recommendations.push({
        priority: 'critical',
        text: 'Former vos collaborateurs à la maîtrise de l\'IA (obligation Article 4)',
        category: 'training',
        aiActRef: 'Article 4'
      });
    }
    if (cat.category === 'transparency' && cat.score < 70) {
      recommendations.push({
        priority: cat.score < 40 ? 'high' : 'medium',
        text: 'Informer les utilisateurs de leur interaction avec l\'IA',
        category: 'transparency',
        aiActRef: 'Article 50'
      });
    }
    if (cat.category === 'security' && cat.score < 70) {
      recommendations.push({
        priority: cat.score < 40 ? 'high' : 'medium',
        text: 'Intégrer vos systèmes IA à votre politique de cybersécurité',
        category: 'security',
        aiActRef: 'Article 15'
      });
    }
  });

  // Sort by priority
  const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
  return recommendations.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
};

// Action plan timeline
const getActionPlan = (score: number, plan: string) => {
  const actions = [
    { month: 1, title: 'Inventaire et Classification', tasks: ['Recenser tous les systèmes IA', 'Classifier par niveau de risque', 'Identifier les systèmes haut risque'], priority: score < 50 },
    { month: 2, title: 'Gouvernance', tasks: ['Nommer un Référent IA', 'Créer le comité de gouvernance', 'Rédiger la politique IA'], priority: score < 60 },
    { month: 3, title: 'Formation Article 4', tasks: ['Identifier les publics cibles', 'Déployer les formations', 'Documenter les attestations'], priority: true },
    { month: 4, title: 'Documentation', tasks: ['Collecter la doc technique', 'Vérifier les logs', 'Documenter les biais'], priority: score < 70 },
    { month: 5, title: 'Transparence', tasks: ['Mettre à jour les CGU', 'Identifier les chatbots', 'Marquer les contenus IA'], priority: score < 80 },
    { month: 6, title: 'Audit et ajustements', tasks: ['Réaliser un audit interne', 'Corriger les écarts', 'Préparer la documentation'], priority: true },
  ];

  if (plan === 'enterprise') {
    actions.push(
      { month: 7, title: 'Fournisseurs', tasks: ['Auditer les fournisseurs IA', 'Mettre à jour les contrats', 'Obtenir les conformités'], priority: true },
      { month: 8, title: 'Multi-sites', tasks: ['Harmoniser les pratiques', 'Consolider le registre groupe', 'Former les filiales'], priority: true },
      { month: 9, title: 'Droits fondamentaux', tasks: ['Réaliser les FRIA', 'Consulter les parties prenantes', 'Documenter les mesures'], priority: true },
      { month: 10, title: 'Optimisation', tasks: ['Affiner les processus', 'Automatiser le suivi', 'Préparer l\'audit externe'], priority: false },
      { month: 11, title: 'Benchmark', tasks: ['Comparer aux standards sectoriels', 'Identifier les best practices', 'Ajuster la roadmap'], priority: false },
      { month: 12, title: 'Certification', tasks: ['Audit de certification', 'Correction des non-conformités', 'Obtention du certificat'], priority: true },
    );
  }

  return actions;
};

// ============================================
// MAIN COMPONENT
// ============================================

export default function AuditResultsPage() {
  const searchParams = useSearchParams();
  const score = parseInt(searchParams.get('score') || '0');
  const plan = searchParams.get('plan') || 'solo';

  const [results, setResults] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'details' | 'actions' | 'deliverables'>('overview');
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  useEffect(() => {
    const savedResults = localStorage.getItem('auditResults');
    if (savedResults) {
      setResults(JSON.parse(savedResults));
    }
  }, []);

  const categoryScores = results?.categoryScores || [
    { category: 'inventory', icon: '📋', color: '#00F5FF', score: Math.min(100, score + Math.random() * 20 - 10) },
    { category: 'classification', icon: '⚠️', color: '#FF6B00', score: Math.min(100, score + Math.random() * 20 - 10) },
    { category: 'governance', icon: '🏛️', color: '#8B5CF6', score: Math.min(100, score + Math.random() * 20 - 10) },
    { category: 'documentation', icon: '📄', color: '#00FF88', score: Math.min(100, score + Math.random() * 20 - 10) },
    { category: 'training', icon: '🎓', color: '#FFB800', score: Math.min(100, score + Math.random() * 20 - 10) },
    { category: 'transparency', icon: '👁️', color: '#FF4444', score: Math.min(100, score + Math.random() * 20 - 10) },
  ];

  const highRiskFlags = results?.highRiskFlags || [];
  const profile = results?.profile || { name: 'Votre entreprise', sector: '', size: '' };
  const recommendations = getRecommendations(categoryScores, highRiskFlags);
  const actionPlan = getActionPlan(score, plan);

  const getScoreLabel = (s: number) => {
    if (s >= 80) return { text: 'Excellent', emoji: '🏆', color: '#00FF88' };
    if (s >= 70) return { text: 'Bon', emoji: '✅', color: '#00FF88' };
    if (s >= 50) return { text: 'À améliorer', emoji: '⚠️', color: '#FFB800' };
    if (s >= 30) return { text: 'Insuffisant', emoji: '🚨', color: '#FF6B00' };
    return { text: 'Critique', emoji: '🔴', color: '#FF4444' };
  };

  const scoreLabel = getScoreLabel(score);

  const generatePDF = async () => {
    setIsGeneratingPDF(true);
    // Simulate PDF generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // In real implementation, call API to generate PDF
    const pdfData = {
      score,
      plan,
      profile,
      categoryScores,
      recommendations,
      actionPlan,
      generatedAt: new Date().toISOString(),
    };
    
    // For now, just download a placeholder
    alert(`Génération du rapport PDF ${plan === 'solo' ? '(15 pages)' : plan === 'pro' ? '(40-50 pages)' : '(80-100 pages)'} en cours...`);
    setIsGeneratingPDF(false);
  };

  const categoryNames: Record<string, string> = {
    inventory: 'Inventaire IA',
    classification: 'Classification',
    governance: 'Gouvernance',
    documentation: 'Documentation',
    training: 'Formation',
    transparency: 'Transparence',
    security: 'Sécurité',
    suppliers: 'Fournisseurs',
    multisites: 'Multi-sites',
    rights: 'Droits fondamentaux',
  };

  return (
    <div className="min-h-screen bg-[#030014] text-white">
      <NeuralBackground />

      {/* Header */}
      <header className="relative z-50 px-6 py-4 border-b border-white/5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#00F5FF] to-[#0066FF] rounded-xl flex items-center justify-center">
              <div className="w-5 h-5 text-white"><Icons.Shield /></div>
            </div>
            <span className="font-bold text-lg hidden sm:block">Formation-IA-Act.fr</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-white/60 hover:text-white text-sm transition-colors flex items-center gap-2">
              <div className="w-4 h-4"><Icons.ArrowLeft /></div>
              <span className="hidden sm:inline">Dashboard</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="relative z-10 px-6 py-8">
        <div className="max-w-7xl mx-auto">
          
          {/* Header with Score */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center gap-2 bg-white/5 rounded-full px-4 py-2 mb-4">
              <span className="text-sm text-white/60">Plan {plan.charAt(0).toUpperCase() + plan.slice(1)}</span>
              {profile.name && <span className="text-white/40">•</span>}
              {profile.name && <span className="text-sm text-white/60">{profile.name}</span>}
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-2">
              Résultats de votre <span className="bg-gradient-to-r from-[#8B5CF6] to-[#00F5FF] text-transparent bg-clip-text">audit AI Act</span>
            </h1>
          </motion.div>

          {/* Main Score Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid lg:grid-cols-3 gap-6 mb-8"
          >
            {/* Score Gauge */}
            <HoloCard glow={scoreLabel.color} className="lg:col-span-1">
              <div className="p-8 text-center">
                <ScoreGauge score={score} />
                <div className="mt-4">
                  <span className="text-2xl mr-2">{scoreLabel.emoji}</span>
                  <span className="text-xl font-bold" style={{ color: scoreLabel.color }}>{scoreLabel.text}</span>
                </div>
                {highRiskFlags.length > 0 && (
                  <div className="mt-4 bg-[#FF4444]/10 border border-[#FF4444]/30 rounded-lg p-3">
                    <span className="text-[#FF4444] text-sm font-medium">
                      ⚠️ {highRiskFlags.length} système(s) haut risque détecté(s)
                    </span>
                  </div>
                )}
              </div>
            </HoloCard>

            {/* Radar Chart (Pro/Enterprise) */}
            {(plan === 'pro' || plan === 'enterprise') ? (
              <HoloCard glow="#8B5CF6" className="lg:col-span-1">
                <div className="p-6">
                  <h3 className="text-center font-semibold mb-4">Score par domaine</h3>
                  <RadarChart data={categoryScores.slice(0, 6).map((c: { category: string; score: number; color: string }) => ({
                    label: c.category,
                    value: Math.round(c.score),
                    color: c.color,
                  }))} />
                </div>
              </HoloCard>
            ) : (
              <HoloCard glow="#8B5CF6" className="lg:col-span-1">
                <div className="p-6">
                  <h3 className="font-semibold mb-4">Score par catégorie</h3>
                  <div className="space-y-3">
                    {categoryScores.map((cat, i) => (
                      <div key={i}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-white/70">{cat.icon} {categoryNames[cat.category]}</span>
                          <span style={{ color: cat.color }}>{Math.round(cat.score)}%</span>
                        </div>
                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full rounded-full"
                            style={{ backgroundColor: cat.color }}
                            initial={{ width: 0 }}
                            animate={{ width: `${cat.score}%` }}
                            transition={{ duration: 0.8, delay: i * 0.1 }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </HoloCard>
            )}

            {/* Quick Actions */}
            <HoloCard glow="#00FF88" className="lg:col-span-1">
              <div className="p-6">
                <h3 className="font-semibold mb-4">📥 Vos livrables</h3>
                <div className="space-y-3">
                  <button
                    onClick={generatePDF}
                    disabled={isGeneratingPDF}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-[#8B5CF6] to-[#00F5FF] text-white font-medium rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    <div className="w-5 h-5"><Icons.Download /></div>
                    {isGeneratingPDF ? 'Génération...' : `Télécharger le rapport PDF`}
                  </button>
                  
                  {(plan === 'pro' || plan === 'enterprise') && (
                    <>
                      <button className="w-full flex items-center justify-center gap-2 py-3 bg-[#00FF88]/10 border border-[#00FF88]/30 text-[#00FF88] font-medium rounded-xl hover:bg-[#00FF88]/20 transition-colors">
                        <div className="w-5 h-5"><Icons.Award /></div>
                        Télécharger le certificat
                      </button>
                      <button className="w-full flex items-center justify-center gap-2 py-3 bg-white/5 border border-white/10 text-white/70 font-medium rounded-xl hover:bg-white/10 transition-colors">
                        <div className="w-5 h-5"><Icons.FileText /></div>
                        Templates pré-remplis ({plan === 'enterprise' ? '12' : '3'})
                      </button>
                    </>
                  )}

                  {plan === 'enterprise' && (
                    <button className="w-full flex items-center justify-center gap-2 py-3 bg-[#FFB800]/10 border border-[#FFB800]/30 text-[#FFB800] font-medium rounded-xl hover:bg-[#FFB800]/20 transition-colors">
                      <div className="w-5 h-5"><Icons.BarChart /></div>
                      Accéder au Dashboard
                    </button>
                  )}
                </div>

                {plan === 'solo' && (
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <p className="text-white/50 text-sm mb-3">Passez au Pro pour :</p>
                    <ul className="text-sm text-white/60 space-y-1">
                      <li>✓ Rapport 40-50 pages</li>
                      <li>✓ Certificat d'audit</li>
                      <li>✓ Templates pré-remplis</li>
                    </ul>
                    <Link 
                      href="/checkout?plan=audit-pro"
                      className="mt-3 block text-center text-[#8B5CF6] text-sm hover:underline"
                    >
                      Upgrader vers Pro →
                    </Link>
                  </div>
                )}
              </div>
            </HoloCard>
          </motion.div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {[
              { id: 'overview', label: '📊 Vue d\'ensemble' },
              { id: 'details', label: '📋 Détails par catégorie' },
              { id: 'actions', label: '🎯 Plan d\'action' },
              ...(plan !== 'solo' ? [{ id: 'deliverables', label: '📦 Livrables' }] : []),
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'bg-[#8B5CF6] text-white'
                    : 'bg-white/5 text-white/60 hover:bg-white/10'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Top Recommendations */}
                <HoloCard glow="#FF6B00">
                  <div className="p-6">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                      <span className="text-xl">🎯</span>
                      Recommandations prioritaires
                    </h3>
                    <div className="space-y-3">
                      {recommendations.slice(0, 6).map((rec, i) => (
                        <div key={i} className="flex items-start gap-3 p-3 bg-white/5 rounded-lg">
                          <span className={`text-lg ${
                            rec.priority === 'critical' ? 'text-[#FF4444]' :
                            rec.priority === 'high' ? 'text-[#FF6B00]' :
                            rec.priority === 'medium' ? 'text-[#FFB800]' : 'text-[#00FF88]'
                          }`}>
                            {rec.priority === 'critical' ? '🔴' : rec.priority === 'high' ? '🟠' : rec.priority === 'medium' ? '🟡' : '🟢'}
                          </span>
                          <div className="flex-1">
                            <p className="text-sm text-white/80">{rec.text}</p>
                            {rec.aiActRef && (
                              <p className="text-xs text-white/40 mt-1">📖 {rec.aiActRef}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </HoloCard>

                {/* Key Stats */}
                <HoloCard glow="#00F5FF">
                  <div className="p-6">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                      <span className="text-xl">📈</span>
                      Synthèse de l'audit
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white/5 rounded-xl p-4 text-center">
                        <div className="text-3xl font-bold text-[#00F5FF]">{results?.totalQuestions || 40}</div>
                        <div className="text-sm text-white/50">Questions analysées</div>
                      </div>
                      <div className="bg-white/5 rounded-xl p-4 text-center">
                        <div className="text-3xl font-bold text-[#8B5CF6]">{categoryScores.length}</div>
                        <div className="text-sm text-white/50">Catégories évaluées</div>
                      </div>
                      <div className="bg-white/5 rounded-xl p-4 text-center">
                        <div className="text-3xl font-bold text-[#FF6B00]">{highRiskFlags.length}</div>
                        <div className="text-sm text-white/50">Systèmes haut risque</div>
                      </div>
                      <div className="bg-white/5 rounded-xl p-4 text-center">
                        <div className="text-3xl font-bold text-[#FFB800]">{recommendations.filter(r => r.priority === 'critical' || r.priority === 'high').length}</div>
                        <div className="text-sm text-white/50">Actions urgentes</div>
                      </div>
                    </div>

                    {/* Deadline reminder */}
                    <div className="mt-4 bg-[#FFB800]/10 border border-[#FFB800]/30 rounded-lg p-4">
                      <div className="flex items-center gap-2 text-[#FFB800] font-medium mb-1">
                        <div className="w-4 h-4"><Icons.Calendar /></div>
                        <span>Échéances AI Act</span>
                      </div>
                      <ul className="text-sm text-white/60 space-y-1">
                        <li>• <strong className="text-white/80">Février 2025</strong> : Article 4 (Formation) en vigueur</li>
                        <li>• <strong className="text-white/80">Août 2025</strong> : Interdictions (Article 5) en vigueur</li>
                        <li>• <strong className="text-white/80">Août 2026</strong> : Obligations haut risque en vigueur</li>
                      </ul>
                    </div>
                  </div>
                </HoloCard>
              </div>
            )}

            {/* Details Tab */}
            {activeTab === 'details' && (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {categoryScores.map((cat, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <HoloCard glow={cat.color}>
                      <div className="p-5">
                        <div className="flex items-center gap-3 mb-4">
                          <div 
                            className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                            style={{ backgroundColor: `${cat.color}15` }}
                          >
                            {cat.icon}
                          </div>
                          <div>
                            <h4 className="font-semibold text-white">{categoryNames[cat.category]}</h4>
                            <p className="text-2xl font-bold" style={{ color: cat.color }}>{Math.round(cat.score)}%</p>
                          </div>
                        </div>
                        <div className="h-2 bg-white/10 rounded-full overflow-hidden mb-3">
                          <motion.div
                            className="h-full rounded-full"
                            style={{ backgroundColor: cat.color }}
                            initial={{ width: 0 }}
                            animate={{ width: `${cat.score}%` }}
                            transition={{ duration: 0.8 }}
                          />
                        </div>
                        <p className="text-sm text-white/50">
                          {cat.score >= 70 ? '✅ Bon niveau' : 
                           cat.score >= 40 ? '⚠️ À améliorer' : 
                           '🚨 Action urgente'}
                        </p>
                      </div>
                    </HoloCard>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Actions Tab */}
            {activeTab === 'actions' && (
              <HoloCard glow="#00FF88">
                <div className="p-6">
                  <h3 className="font-semibold mb-6 flex items-center gap-2">
                    <span className="text-xl">📅</span>
                    Plan d'action {plan === 'enterprise' ? '12' : '6'} mois
                  </h3>
                  
                  <div className="relative">
                    {/* Timeline line */}
                    <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-white/10" />
                    
                    <div className="space-y-6">
                      {actionPlan.slice(0, plan === 'enterprise' ? 12 : 6).map((action, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className="relative pl-14"
                        >
                          {/* Timeline dot */}
                          <div 
                            className={`absolute left-4 w-5 h-5 rounded-full border-2 ${
                              action.priority ? 'bg-[#8B5CF6] border-[#8B5CF6]' : 'bg-white/10 border-white/20'
                            }`}
                          />
                          
                          <div className={`p-4 rounded-xl ${action.priority ? 'bg-[#8B5CF6]/10 border border-[#8B5CF6]/30' : 'bg-white/5'}`}>
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-white/40 text-sm">Mois {action.month}</span>
                              <h4 className="font-semibold text-white">{action.title}</h4>
                              {action.priority && <span className="text-xs bg-[#8B5CF6] text-white px-2 py-0.5 rounded-full">Prioritaire</span>}
                            </div>
                            <ul className="space-y-1">
                              {action.tasks.map((task, j) => (
                                <li key={j} className="text-sm text-white/60 flex items-center gap-2">
                                  <span className="w-1.5 h-1.5 rounded-full bg-white/30" />
                                  {task}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {plan === 'solo' && (
                    <div className="mt-8 p-4 bg-white/5 rounded-xl text-center">
                      <p className="text-white/60 mb-3">Passez au Pro pour un plan d'action détaillé avec timeline visuelle et budget estimé</p>
                      <Link 
                        href="/checkout?plan=audit-pro"
                        className="inline-flex items-center gap-2 text-[#8B5CF6] hover:underline"
                      >
                        Upgrader vers Pro
                        <div className="w-4 h-4"><Icons.ArrowRight /></div>
                      </Link>
                    </div>
                  )}
                </div>
              </HoloCard>
            )}

            {/* Deliverables Tab (Pro/Enterprise only) */}
            {activeTab === 'deliverables' && (plan === 'pro' || plan === 'enterprise') && (
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Report */}
                <HoloCard glow="#8B5CF6">
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-[#8B5CF6]/20 flex items-center justify-center">
                        <div className="w-6 h-6 text-[#8B5CF6]"><Icons.FileText /></div>
                      </div>
                      <div>
                        <h4 className="font-semibold">Rapport PDF {plan === 'enterprise' ? 'Expert' : 'Premium'}</h4>
                        <p className="text-sm text-white/50">{plan === 'enterprise' ? '80-100' : '40-50'} pages</p>
                      </div>
                    </div>
                    <ul className="text-sm text-white/60 space-y-2 mb-4">
                      <li>✓ Executive Summary</li>
                      <li>✓ Analyse détaillée par domaine</li>
                      <li>✓ Graphiques et visualisations</li>
                      <li>✓ Citations AI Act</li>
                      <li>✓ 30+ recommandations</li>
                      <li>✓ Plan d'action 12 mois</li>
                      {plan === 'enterprise' && (
                        <>
                          <li>✓ Analyse juridique des risques</li>
                          <li>✓ Benchmark sectoriel</li>
                          <li>✓ ROI conformité chiffré</li>
                        </>
                      )}
                    </ul>
                    <button
                      onClick={generatePDF}
                      className="w-full py-3 bg-[#8B5CF6] text-white font-medium rounded-xl hover:bg-[#8B5CF6]/90 transition-colors flex items-center justify-center gap-2"
                    >
                      <div className="w-5 h-5"><Icons.Download /></div>
                      Télécharger
                    </button>
                  </div>
                </HoloCard>

                {/* Certificate */}
                <HoloCard glow="#00FF88">
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-[#00FF88]/20 flex items-center justify-center">
                        <div className="w-6 h-6 text-[#00FF88]"><Icons.Award /></div>
                      </div>
                      <div>
                        <h4 className="font-semibold">Certificat d'audit</h4>
                        <p className="text-sm text-white/50">Valable 1 an</p>
                      </div>
                    </div>
                    <div className="bg-white/5 rounded-xl p-4 mb-4">
                      <div className="text-center mb-3">
                        <div className="text-4xl mb-2">🏅</div>
                        <p className="text-sm text-white/60">Certificat n°</p>
                        <p className="font-mono text-[#00FF88]">AACT-{Date.now().toString(36).toUpperCase()}</p>
                      </div>
                      <ul className="text-sm text-white/60 space-y-1">
                        <li>✓ Numéro unique</li>
                        <li>✓ QR code de vérification</li>
                        <li>✓ Score et date d'audit</li>
                      </ul>
                    </div>
                    <button className="w-full py-3 bg-[#00FF88]/10 border border-[#00FF88]/30 text-[#00FF88] font-medium rounded-xl hover:bg-[#00FF88]/20 transition-colors flex items-center justify-center gap-2">
                      <div className="w-5 h-5"><Icons.Download /></div>
                      Télécharger
                    </button>
                  </div>
                </HoloCard>

                {/* Templates */}
                <HoloCard glow="#FFB800">
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-[#FFB800]/20 flex items-center justify-center text-2xl">
                        📄
                      </div>
                      <div>
                        <h4 className="font-semibold">Templates pré-remplis</h4>
                        <p className="text-sm text-white/50">{plan === 'enterprise' ? '12' : '3'} documents</p>
                      </div>
                    </div>
                    <ul className="text-sm text-white/60 space-y-2 mb-4">
                      <li>✓ Registre IA pré-complété</li>
                      <li>✓ Politique IA personnalisée</li>
                      <li>✓ Matrice de risques remplie</li>
                      {plan === 'enterprise' && (
                        <>
                          <li>✓ FRIA pré-remplie</li>
                          <li>✓ Documentation technique</li>
                          <li>✓ Plan de formation</li>
                          <li>✓ + 6 autres templates</li>
                        </>
                      )}
                    </ul>
                    <button className="w-full py-3 bg-[#FFB800]/10 border border-[#FFB800]/30 text-[#FFB800] font-medium rounded-xl hover:bg-[#FFB800]/20 transition-colors flex items-center justify-center gap-2">
                      <div className="w-5 h-5"><Icons.Download /></div>
                      Télécharger le pack
                    </button>
                  </div>
                </HoloCard>

                {/* Enterprise extras */}
                {plan === 'enterprise' && (
                  <HoloCard glow="#00F5FF">
                    <div className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-[#00F5FF]/20 flex items-center justify-center text-2xl">
                          👑
                        </div>
                        <div>
                          <h4 className="font-semibold">Livrables Enterprise</h4>
                          <p className="text-sm text-white/50">Exclusifs</p>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <button className="w-full py-3 bg-white/5 border border-white/10 text-white/80 font-medium rounded-xl hover:bg-white/10 transition-colors flex items-center justify-center gap-2 text-sm">
                          📊 PowerPoint COMEX (20 slides)
                        </button>
                        <button className="w-full py-3 bg-white/5 border border-white/10 text-white/80 font-medium rounded-xl hover:bg-white/10 transition-colors flex items-center justify-center gap-2 text-sm">
                          🏛️ Organigramme gouvernance IA
                        </button>
                        <button className="w-full py-3 bg-white/5 border border-white/10 text-white/80 font-medium rounded-xl hover:bg-white/10 transition-colors flex items-center justify-center gap-2 text-sm">
                          📈 Accéder au Dashboard de suivi
                        </button>
                      </div>
                    </div>
                  </HoloCard>
                )}
              </div>
            )}
          </motion.div>

          {/* Refaire l'audit */}
          <div className="mt-12 text-center">
            <Link 
              href="/audit/questionnaire?plan=${plan}"
              className="text-white/50 hover:text-white transition-colors text-sm"
            >
              🔄 Refaire l'audit
            </Link>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-8 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/30 text-sm">© 2025 Formation-IA-Act.fr. Tous droits réservés.</p>
          <div className="flex items-center gap-4 text-sm text-white/40">
            <Link href="/mentions-legales" className="hover:text-white transition-colors">Mentions légales</Link>
            <Link href="/cgv" className="hover:text-white transition-colors">CGV</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
