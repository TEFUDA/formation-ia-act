'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

// ============================================
// TYPES
// ============================================

interface CategoryScore {
  category: string;
  icon: string;
  color: string;
  score: number;
}

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

const getRecommendations = (categoryScores: CategoryScore[], highRiskFlags: string[]) => {
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

  const categoryScores: CategoryScore[] = results?.categoryScores || [
    { category: 'inventory', icon: '📋', color: '#00F5FF', score: Math.min(100, score + Math.random() * 20 - 10) },
    { category: 'classification', icon: '⚠️', color: '#FF6B00', score: Math.min(100, score + Math.random() * 20 - 10) },
    { category: 'governance', icon: '🏛️', color: '#8B5CF6', score: Math.min(100, score + Math.random() * 20 - 10) },
    { category: 'documentation', icon: '📄', color: '#00FF88', score: Math.min(100, score + Math.random() * 20 - 10) },
    { category: 'training', icon: '🎓', color: '#FFB800', score: Math.min(100, score + Math.random() * 20 - 10) },
    { category: 'transparency', icon: '👁️', color: '#FF4444', score: Math.min(100, score + Math.random() * 20 - 10) },
    { category: 'security', icon: '🔒', color: '#00BFFF', score: Math.min(100, score + Math.random() * 20 - 10) },
  ];

  const highRiskFlags = results?.highRiskFlags || [];
  const profile = results?.profile || { name: 'Votre entreprise', sector: '', size: '' };
  const totalQuestions = results?.totalQuestions || (plan === 'enterprise' ? 150 : plan === 'pro' ? 80 : 40);
  const completedAt = results?.completedAt || new Date().toISOString();
  const recommendations = getRecommendations(categoryScores, highRiskFlags);
  const actionPlan = getActionPlan(score, plan);

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
    
    try {
      const response = await fetch('/api/audit/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          score,
          plan,
          profile,
          categoryScores,
          highRiskFlags,
          answers: {},
          totalQuestions,
          completedAt,
        }),
      });
      
      if (!response.ok) throw new Error('Erreur génération rapport');
      
      const html = await response.text();
      
      // Open in new window for printing
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(html);
        printWindow.document.close();
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la génération du rapport. Veuillez réessayer.');
    }
    
    setIsGeneratingPDF(false);
  };

  const generateCertificate = async () => {
    // Generate certificate HTML
    const certId = `AACT-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
    const certHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Certificat AI Act - ${profile.name || 'Entreprise'}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Inter', sans-serif; background: #f5f5f5; padding: 40px; }
          .certificate { 
            max-width: 800px; 
            margin: 0 auto; 
            background: white; 
            border: 4px solid #00FF88;
            border-radius: 20px;
            padding: 60px;
            text-align: center;
          }
          .badge { font-size: 80px; margin-bottom: 20px; }
          .title { font-size: 32px; font-weight: 700; color: #1a1a2e; margin-bottom: 10px; }
          .subtitle { font-size: 18px; color: #666; margin-bottom: 40px; }
          .company { font-size: 28px; font-weight: 600; color: #8B5CF6; margin-bottom: 20px; }
          .score-box { 
            display: inline-block;
            background: linear-gradient(135deg, #00FF88, #00F5FF);
            color: white;
            padding: 20px 40px;
            border-radius: 15px;
            margin: 20px 0;
          }
          .score { font-size: 48px; font-weight: 700; }
          .score-label { font-size: 16px; opacity: 0.9; }
          .cert-id { 
            font-family: monospace;
            font-size: 20px;
            color: #00FF88;
            margin: 30px 0;
          }
          .date { color: #666; margin-top: 20px; }
          .validity { 
            background: #f0f9f0;
            padding: 15px 30px;
            border-radius: 10px;
            display: inline-block;
            margin-top: 20px;
          }
          .footer { margin-top: 40px; color: #999; font-size: 12px; }
          @media print {
            body { padding: 0; background: white; }
            .certificate { border: 4px solid #00FF88; }
          }
        </style>
      </head>
      <body>
        <div class="certificate">
          <div class="badge">🏆</div>
          <div class="title">Certificat de Conformité AI Act</div>
          <div class="subtitle">Audit réalisé avec Formation-IA-Act.fr</div>
          
          <div class="company">${profile.name || 'Entreprise'}</div>
          
          <div class="score-box">
            <div class="score">${score}%</div>
            <div class="score-label">Score de conformité</div>
          </div>
          
          <div class="cert-id">Certificat n° ${certId}</div>
          
          <div class="date">
            Audit réalisé le ${new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
          </div>
          
          <div class="validity">
            ✓ Valable jusqu'au ${new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
          </div>
          
          <div class="footer">
            Ce certificat atteste que l'organisation a réalisé un audit de conformité AI Act.<br>
            Vérifiable sur formation-ia-act.fr/verify/${certId}
          </div>
        </div>
      </body>
      </html>
    `;
    
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(certHtml);
      printWindow.document.close();
    }
  };

  const downloadTemplates = () => {
    // Generate HTML templates pack
    const templatesHTML = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>Pack Templates AI Act - ${profile.name || 'Entreprise'}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', system-ui, sans-serif; background: #f5f5f5; padding: 40px; }
    .container { max-width: 900px; margin: 0 auto; }
    h1 { color: #8B5CF6; margin-bottom: 30px; text-align: center; }
    .template { background: white; border-radius: 12px; padding: 30px; margin: 20px 0; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
    .template h2 { color: #333; margin-bottom: 15px; display: flex; align-items: center; gap: 10px; }
    .template p { color: #666; margin-bottom: 20px; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    th, td { padding: 12px; border: 1px solid #ddd; text-align: left; }
    th { background: #8B5CF6; color: white; }
    .note { background: #f0f9ff; border-left: 4px solid #00F5FF; padding: 15px; margin: 15px 0; font-size: 14px; }
    @media print { .no-print { display: none; } body { background: white; } }
  </style>
</head>
<body>
  <div class="container">
    <h1>🛡️ Pack Templates AI Act</h1>
    <p style="text-align: center; color: #666; margin-bottom: 40px;">
      ${plan === 'enterprise' ? '12' : '3'} templates prêts à l'emploi pour ${profile.name || 'votre organisation'}
    </p>

    <!-- Template 1: Registre IA -->
    <div class="template">
      <h2>📋 Template 1 : Registre des Systèmes IA</h2>
      <p>Inventaire complet de tous vos systèmes d'intelligence artificielle conformément à l'Article 49.</p>
      <table>
        <tr><th>ID</th><th>Nom du système</th><th>Fournisseur</th><th>Département</th><th>Classification</th><th>Responsable</th><th>Date déploiement</th></tr>
        <tr><td>IA-001</td><td>[Nom]</td><td>[Fournisseur]</td><td>[Département]</td><td>☐ Minimal ☐ Limité ☐ Haut</td><td>[Nom]</td><td>[Date]</td></tr>
        <tr><td>IA-002</td><td></td><td></td><td></td><td>☐ Minimal ☐ Limité ☐ Haut</td><td></td><td></td></tr>
        <tr><td>IA-003</td><td></td><td></td><td></td><td>☐ Minimal ☐ Limité ☐ Haut</td><td></td><td></td></tr>
      </table>
      <div class="note">💡 À mettre à jour à chaque nouveau système ou modification majeure</div>
    </div>

    <!-- Template 2: Fiche Système -->
    <div class="template">
      <h2>📄 Template 2 : Fiche Descriptive Système IA</h2>
      <table>
        <tr><th style="width:30%">Champ</th><th>Information</th></tr>
        <tr><td>Nom du système</td><td></td></tr>
        <tr><td>Version</td><td></td></tr>
        <tr><td>Fournisseur</td><td></td></tr>
        <tr><td>Date de mise en service</td><td></td></tr>
        <tr><td>Responsable interne</td><td></td></tr>
        <tr><td>Finalité / Usage prévu</td><td></td></tr>
        <tr><td>Données en entrée</td><td></td></tr>
        <tr><td>Données en sortie</td><td></td></tr>
        <tr><td>Classification risque</td><td>☐ Minimal ☐ Limité ☐ Haut risque ☐ Inacceptable</td></tr>
        <tr><td>Base légale RGPD</td><td></td></tr>
        <tr><td>Limites connues</td><td></td></tr>
      </table>
    </div>

    <!-- Template 3: Politique IA -->
    <div class="template">
      <h2>📜 Template 3 : Politique d'Utilisation de l'IA</h2>
      <h3 style="margin: 20px 0 10px;">1. Objet</h3>
      <p>La présente politique définit les règles d'utilisation des systèmes d'intelligence artificielle au sein de ${profile.name || '[Nom de l\'entreprise]'}.</p>
      
      <h3 style="margin: 20px 0 10px;">2. Champ d'application</h3>
      <p>Cette politique s'applique à l'ensemble des collaborateurs utilisant des systèmes IA dans le cadre de leurs fonctions.</p>
      
      <h3 style="margin: 20px 0 10px;">3. Principes directeurs</h3>
      <ul style="margin-left: 20px;">
        <li>Transparence : Informer les personnes concernées de l'utilisation de l'IA</li>
        <li>Équité : S'assurer que les systèmes IA ne génèrent pas de discriminations</li>
        <li>Responsabilité : Maintenir une supervision humaine appropriée</li>
        <li>Sécurité : Protéger les données et les systèmes</li>
      </ul>
      
      <h3 style="margin: 20px 0 10px;">4. Usages autorisés</h3>
      <p>[Lister les usages autorisés]</p>
      
      <h3 style="margin: 20px 0 10px;">5. Usages interdits</h3>
      <p>[Lister les usages interdits]</p>
      
      <h3 style="margin: 20px 0 10px;">6. Processus de validation</h3>
      <p>Tout nouveau système IA doit être validé par le Référent IA avant déploiement.</p>
      
      <div class="note">Date d'entrée en vigueur : [Date] | Prochaine révision : [Date + 1 an]</div>
    </div>

    ${plan === 'enterprise' || plan === 'pro' ? `
    <!-- Template 4: Checklist Classification -->
    <div class="template">
      <h2>✅ Template 4 : Checklist Classification des Risques</h2>
      <p>Vérifiez si votre système IA est à haut risque selon l'Annexe III :</p>
      <table>
        <tr><th>Critère</th><th>Oui/Non</th><th>Commentaire</th></tr>
        <tr><td>Utilisé dans le recrutement ou la gestion RH ?</td><td>☐ Oui ☐ Non</td><td></td></tr>
        <tr><td>Évalue la solvabilité ou le scoring crédit ?</td><td>☐ Oui ☐ Non</td><td></td></tr>
        <tr><td>Utilisé dans l'éducation pour l'admission/évaluation ?</td><td>☐ Oui ☐ Non</td><td></td></tr>
        <tr><td>Utilisé dans la santé pour le diagnostic ?</td><td>☐ Oui ☐ Non</td><td></td></tr>
        <tr><td>Utilisé dans la justice ou forces de l'ordre ?</td><td>☐ Oui ☐ Non</td><td></td></tr>
        <tr><td>Utilisé pour la reconnaissance biométrique ?</td><td>☐ Oui ☐ Non</td><td></td></tr>
        <tr><td>Impacte l'accès aux services essentiels ?</td><td>☐ Oui ☐ Non</td><td></td></tr>
      </table>
      <div class="note">⚠️ Si au moins une réponse est "Oui", votre système est potentiellement à haut risque</div>
    </div>

    <!-- Template 5: FRIA -->
    <div class="template">
      <h2>⚖️ Template 5 : Évaluation d'Impact (FRIA)</h2>
      <h3>Fundamental Rights Impact Assessment</h3>
      <table>
        <tr><th style="width:30%">Section</th><th>Contenu</th></tr>
        <tr><td>Système concerné</td><td></td></tr>
        <tr><td>Date de l'évaluation</td><td></td></tr>
        <tr><td>Responsable</td><td></td></tr>
        <tr><td>Description du système</td><td></td></tr>
        <tr><td>Finalité</td><td></td></tr>
        <tr><td>Droits fondamentaux impactés</td><td>☐ Dignité ☐ Vie privée ☐ Non-discrimination ☐ Liberté d'expression ☐ Autre: ___</td></tr>
        <tr><td>Mesures de mitigation</td><td></td></tr>
        <tr><td>Risque résiduel</td><td>☐ Faible ☐ Moyen ☐ Élevé</td></tr>
        <tr><td>Décision</td><td>☐ Approuvé ☐ Approuvé avec réserves ☐ Rejeté</td></tr>
      </table>
    </div>

    <!-- Template 6: Plan Formation -->
    <div class="template">
      <h2>🎓 Template 6 : Plan de Formation Article 4</h2>
      <table>
        <tr><th>Profil</th><th>Formation requise</th><th>Durée</th><th>Échéance</th><th>Statut</th></tr>
        <tr><td>Direction</td><td>Sensibilisation AI Act</td><td>2h</td><td></td><td>☐</td></tr>
        <tr><td>Managers</td><td>AI Act & Management</td><td>4h</td><td></td><td>☐</td></tr>
        <tr><td>Utilisateurs IA</td><td>Utilisation responsable IA</td><td>3h</td><td></td><td>☐</td></tr>
        <tr><td>Équipes RH</td><td>IA et recrutement</td><td>4h</td><td></td><td>☐</td></tr>
        <tr><td>Équipes tech</td><td>Documentation technique IA</td><td>8h</td><td></td><td>☐</td></tr>
      </table>
    </div>
    ` : ''}

    <p style="text-align: center; margin-top: 40px; color: #666;">
      <br>Généré par Formation-IA-Act.fr<br>
      <button onclick="window.print()" class="no-print" style="margin-top: 20px; padding: 15px 30px; background: #8B5CF6; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 16px;">
        🖨️ Imprimer / Sauvegarder en PDF
      </button>
    </p>
  </div>
</body>
</html>
    `;
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(templatesHTML);
      printWindow.document.close();
    }
  };

  // Generate PowerPoint COMEX (Enterprise)
  const generatePowerPointCOMEX = () => {
    const pptHTML = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>Présentation COMEX - Conformité AI Act</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', system-ui, sans-serif; background: #1a1a2e; }
    .slide { width: 100%; max-width: 960px; height: 540px; margin: 20px auto; background: linear-gradient(135deg, #1a1a2e, #0f0f23); border-radius: 12px; padding: 50px; color: white; display: flex; flex-direction: column; box-shadow: 0 10px 40px rgba(0,0,0,0.3); page-break-after: always; }
    .slide-title { background: linear-gradient(135deg, #8B5CF6, #00F5FF); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-size: 36px; font-weight: 700; margin-bottom: 30px; }
    .slide-content { flex: 1; display: flex; flex-direction: column; justify-content: center; }
    .slide h2 { font-size: 28px; margin-bottom: 20px; color: #00F5FF; }
    .slide p, .slide li { font-size: 18px; line-height: 1.8; color: rgba(255,255,255,0.9); }
    .slide ul { margin-left: 30px; }
    .slide li { margin: 10px 0; }
    .metric { display: flex; justify-content: space-around; margin: 30px 0; }
    .metric-box { text-align: center; padding: 30px; background: rgba(255,255,255,0.05); border-radius: 12px; border: 1px solid rgba(255,255,255,0.1); }
    .metric-value { font-size: 48px; font-weight: 800; color: #00FF88; }
    .metric-label { font-size: 14px; color: rgba(255,255,255,0.6); margin-top: 10px; }
    .highlight { background: rgba(139, 92, 246, 0.2); padding: 20px; border-radius: 8px; border-left: 4px solid #8B5CF6; margin: 20px 0; }
    .timeline { display: flex; justify-content: space-between; margin: 30px 0; }
    .timeline-item { text-align: center; flex: 1; }
    .timeline-date { font-size: 14px; color: #00F5FF; font-weight: 600; }
    .timeline-event { font-size: 12px; color: rgba(255,255,255,0.7); margin-top: 5px; }
    .risk-matrix { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin: 20px 0; }
    .risk-item { padding: 15px; border-radius: 8px; font-size: 14px; }
    .risk-high { background: rgba(255, 68, 68, 0.2); border: 1px solid #FF4444; }
    .risk-med { background: rgba(255, 184, 0, 0.2); border: 1px solid #FFB800; }
    .risk-low { background: rgba(0, 255, 136, 0.2); border: 1px solid #00FF88; }
    .logo { position: absolute; bottom: 20px; right: 30px; font-size: 12px; color: rgba(255,255,255,0.4); }
    .slide-number { position: absolute; bottom: 20px; left: 30px; font-size: 12px; color: rgba(255,255,255,0.4); }
    @media print { .slide { page-break-after: always; box-shadow: none; margin: 0; } body { background: white; } }
    .print-btn { position: fixed; top: 20px; right: 20px; padding: 15px 30px; background: #8B5CF6; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 16px; z-index: 1000; }
    @media print { .print-btn { display: none; } }
  </style>
</head>
<body>
  <button class="print-btn" onclick="window.print()">🖨️ Imprimer / Exporter PDF</button>

  <!-- Slide 1: Cover -->
  <div class="slide" style="justify-content: center; align-items: center; text-align: center;">
    <div style="font-size: 64px; margin-bottom: 30px;">🛡️</div>
    <h1 class="slide-title" style="font-size: 48px;">Conformité AI Act</h1>
    <p style="font-size: 24px; color: rgba(255,255,255,0.7);">Présentation au Comité Exécutif</p>
    <p style="margin-top: 40px; color: rgba(255,255,255,0.5);">${profile.name || 'Organisation'} • ${new Date().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}</p>
  </div>

  <!-- Slide 2: Agenda -->
  <div class="slide">
    <h1 class="slide-title">Agenda</h1>
    <div class="slide-content">
      <ul style="font-size: 22px;">
        <li>1. Contexte réglementaire AI Act</li>
        <li>2. Résultats de l'audit de conformité</li>
        <li>3. Analyse des risques</li>
        <li>4. Recommandations prioritaires</li>
        <li>5. Plan d'action et budget</li>
        <li>6. Gouvernance proposée</li>
        <li>7. Prochaines étapes</li>
      </ul>
    </div>
  </div>

  <!-- Slide 3: Context -->
  <div class="slide">
    <h1 class="slide-title">1. L'AI Act en bref</h1>
    <div class="slide-content">
      <p style="font-size: 20px; margin-bottom: 30px;">Premier cadre juridique mondial sur l'Intelligence Artificielle</p>
      <div class="highlight">
        <p><strong>Sanctions :</strong> Jusqu'à 35M€ ou 7% du CA mondial</p>
      </div>
      <div class="timeline">
        <div class="timeline-item"><div class="timeline-date">Fév 2025</div><div class="timeline-event">Article 4 Formation</div></div>
        <div class="timeline-item"><div class="timeline-date">Août 2025</div><div class="timeline-event">Interdictions</div></div>
        <div class="timeline-item"><div class="timeline-date">Août 2026</div><div class="timeline-event">Obligations HR</div></div>
      </div>
    </div>
  </div>

  <!-- Slide 4: Our Score -->
  <div class="slide">
    <h1 class="slide-title">2. Notre score de conformité</h1>
    <div class="slide-content">
      <div class="metric">
        <div class="metric-box">
          <div class="metric-value">${score}%</div>
          <div class="metric-label">Score global</div>
        </div>
        <div class="metric-box">
          <div class="metric-value" style="color: #00F5FF;">${totalQuestions}</div>
          <div class="metric-label">Critères évalués</div>
        </div>
        <div class="metric-box">
          <div class="metric-value" style="color: ${highRiskFlags.length > 0 ? '#FF4444' : '#00FF88'};">${highRiskFlags.length}</div>
          <div class="metric-label">Systèmes haut risque</div>
        </div>
      </div>
      <p style="text-align: center; color: rgba(255,255,255,0.6);">Audit réalisé le ${new Date(completedAt).toLocaleDateString('fr-FR')}</p>
    </div>
  </div>

  <!-- Slide 5: Results by Domain -->
  <div class="slide">
    <h1 class="slide-title">Résultats par domaine</h1>
    <div class="slide-content">
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
        ${categoryScores.map((cat) => `
          <div style="display: flex; align-items: center; gap: 10px; padding: 10px; background: rgba(255,255,255,0.05); border-radius: 8px;">
            <span style="font-size: 24px;">${cat.icon}</span>
            <div style="flex: 1;">
              <div style="font-size: 14px;">${categoryNames[cat.category] || cat.category}</div>
              <div style="height: 6px; background: rgba(255,255,255,0.1); border-radius: 3px; margin-top: 5px;">
                <div style="height: 100%; width: ${cat.score}%; background: ${cat.color}; border-radius: 3px;"></div>
              </div>
            </div>
            <span style="font-weight: 700; color: ${cat.color};">${Math.round(cat.score)}%</span>
          </div>
        `).join('')}
      </div>
    </div>
  </div>

  <!-- Slide 6: Strengths -->
  <div class="slide">
    <h1 class="slide-title">✅ Points forts</h1>
    <div class="slide-content">
      <ul>
        ${categoryScores.filter((c) => c.score >= 70).map((c) => `
          <li style="color: #00FF88;"><strong>${categoryNames[c.category] || c.category}</strong> : ${Math.round(c.score)}%</li>
        `).join('')}
      </ul>
      <div class="highlight" style="margin-top: 30px;">
        <p>Ces domaines constituent une base solide pour notre conformité AI Act.</p>
      </div>
    </div>
  </div>

  <!-- Slide 7: Weaknesses -->
  <div class="slide">
    <h1 class="slide-title">⚠️ Points d'amélioration</h1>
    <div class="slide-content">
      <div class="risk-matrix">
        ${categoryScores.filter((c) => c.score < 70).map((c) => `
          <div class="risk-item ${c.score < 50 ? 'risk-high' : 'risk-med'}">
            <strong>${categoryNames[c.category] || c.category}</strong><br>
            Score: ${Math.round(c.score)}% - ${c.score < 50 ? 'Action urgente' : 'À améliorer'}
          </div>
        `).join('')}
      </div>
    </div>
  </div>

  <!-- Slide 8: Key Risks -->
  <div class="slide">
    <h1 class="slide-title">3. Analyse des risques</h1>
    <div class="slide-content">
      <h2>Risques identifiés</h2>
      <ul>
        <li><strong>Risque réglementaire :</strong> Sanctions financières (jusqu'à 7% CA)</li>
        <li><strong>Risque opérationnel :</strong> Suspension d'usage de certains systèmes</li>
        <li><strong>Risque réputationnel :</strong> Impact sur l'image de marque</li>
        <li><strong>Risque commercial :</strong> Perte de confiance clients B2B</li>
      </ul>
      ${highRiskFlags.length > 0 ? `
      <div class="highlight" style="border-left-color: #FF4444; background: rgba(255,68,68,0.1);">
        <p><strong>${highRiskFlags.length} système(s) identifié(s) comme potentiellement à haut risque</strong></p>
      </div>
      ` : ''}
    </div>
  </div>

  <!-- Slide 9: Priority Actions -->
  <div class="slide">
    <h1 class="slide-title">4. Recommandations prioritaires</h1>
    <div class="slide-content">
      <ol>
        ${categoryScores.filter((c) => c.score < 80).slice(0, 4).map((c, i) => `
          <li style="margin: 15px 0;"><strong>${categoryNames[c.category] || c.category}</strong> - ${c.score < 50 ? '🔴 Critique' : '🟠 Prioritaire'}</li>
        `).join('')}
      </ol>
      <div class="highlight">
        <p>L'Article 4 (Formation) est en vigueur depuis février 2025 - Action immédiate requise</p>
      </div>
    </div>
  </div>

  <!-- Slide 10: Action Plan Overview -->
  <div class="slide">
    <h1 class="slide-title">5. Plan d'action 6 mois</h1>
    <div class="slide-content">
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px;">
        <div style="padding: 20px; background: rgba(139,92,246,0.2); border-radius: 8px; text-align: center;">
          <div style="font-size: 24px; font-weight: 700;">M1-M2</div>
          <div style="font-size: 14px; margin-top: 10px;">Fondations & Gouvernance</div>
        </div>
        <div style="padding: 20px; background: rgba(0,245,255,0.2); border-radius: 8px; text-align: center;">
          <div style="font-size: 24px; font-weight: 700;">M3-M4</div>
          <div style="font-size: 14px; margin-top: 10px;">Documentation & Formation</div>
        </div>
        <div style="padding: 20px; background: rgba(0,255,136,0.2); border-radius: 8px; text-align: center;">
          <div style="font-size: 24px; font-weight: 700;">M5-M6</div>
          <div style="font-size: 14px; margin-top: 10px;">Consolidation & Audit</div>
        </div>
      </div>
    </div>
  </div>

  <!-- Slide 11: Budget -->
  <div class="slide">
    <h1 class="slide-title">Budget estimatif</h1>
    <div class="slide-content">
      <div class="metric">
        <div class="metric-box">
          <div class="metric-value" style="font-size: 36px;">30-80k€</div>
          <div class="metric-label">Budget total estimé</div>
        </div>
      </div>
      <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-top: 20px;">
        <div style="padding: 15px; background: rgba(255,255,255,0.05); border-radius: 8px;">
          <div style="color: #00F5FF;">40-50%</div>
          <div style="font-size: 12px;">Ressources internes</div>
        </div>
        <div style="padding: 15px; background: rgba(255,255,255,0.05); border-radius: 8px;">
          <div style="color: #00F5FF;">25-35%</div>
          <div style="font-size: 12px;">Formation</div>
        </div>
        <div style="padding: 15px; background: rgba(255,255,255,0.05); border-radius: 8px;">
          <div style="color: #00F5FF;">15-25%</div>
          <div style="font-size: 12px;">Conseil externe</div>
        </div>
        <div style="padding: 15px; background: rgba(255,255,255,0.05); border-radius: 8px;">
          <div style="color: #00F5FF;">5-10%</div>
          <div style="font-size: 12px;">Outils</div>
        </div>
      </div>
    </div>
  </div>

  <!-- Slide 12: ROI -->
  <div class="slide">
    <h1 class="slide-title">Retour sur investissement</h1>
    <div class="slide-content">
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px;">
        <div>
          <h2 style="color: #FF4444;">Coût de la non-conformité</h2>
          <ul>
            <li>Sanctions : jusqu'à 35M€</li>
            <li>Suspension d'activité</li>
            <li>Perte de contrats</li>
            <li>Atteinte réputationnelle</li>
          </ul>
        </div>
        <div>
          <h2 style="color: #00FF88;">Bénéfices de la conformité</h2>
          <ul>
            <li>Avantage concurrentiel</li>
            <li>Confiance clients renforcée</li>
            <li>Maîtrise des risques</li>
            <li>Innovation responsable</li>
          </ul>
        </div>
      </div>
      <div class="highlight" style="margin-top: 30px;">
        <p><strong>ROI estimé : 200-500%</strong> sur 3 ans</p>
      </div>
    </div>
  </div>

  <!-- Slide 13: Governance -->
  <div class="slide">
    <h1 class="slide-title">6. Gouvernance proposée</h1>
    <div class="slide-content">
      <div style="text-align: center;">
        <div style="padding: 20px; background: rgba(139,92,246,0.3); border-radius: 12px; display: inline-block; margin-bottom: 20px;">
          <div style="font-size: 24px;">👤 Référent IA</div>
          <div style="font-size: 12px; color: rgba(255,255,255,0.6);">Pilotage opérationnel</div>
        </div>
        <div style="display: flex; justify-content: center; gap: 20px; margin-top: 20px;">
          <div style="padding: 15px; background: rgba(0,245,255,0.2); border-radius: 8px;">
            <div>🏛️ Comité IA</div>
            <div style="font-size: 10px;">Direction, DSI, DRH, Juridique</div>
          </div>
          <div style="padding: 15px; background: rgba(0,245,255,0.2); border-radius: 8px;">
            <div>📋 Politique IA</div>
            <div style="font-size: 10px;">Règles d'utilisation</div>
          </div>
          <div style="padding: 15px; background: rgba(0,245,255,0.2); border-radius: 8px;">
            <div>✅ Validation</div>
            <div style="font-size: 10px;">Processus avant déploiement</div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Slide 14: Next Steps -->
  <div class="slide">
    <h1 class="slide-title">7. Prochaines étapes</h1>
    <div class="slide-content">
      <h2>Actions immédiates (30 jours)</h2>
      <ol>
        <li>Valider le budget conformité</li>
        <li>Nommer le Référent IA</li>
        <li>Lancer les formations Article 4</li>
        <li>Constituer le comité de gouvernance</li>
      </ol>
      <div class="highlight" style="margin-top: 30px;">
        <p><strong>Décision attendue :</strong> Validation du plan d'action et du budget</p>
      </div>
    </div>
  </div>

  <!-- Slide 15: Questions -->
  <div class="slide" style="justify-content: center; align-items: center; text-align: center;">
    <div style="font-size: 64px; margin-bottom: 30px;">❓</div>
    <h1 class="slide-title" style="font-size: 48px;">Questions</h1>
    <p style="font-size: 20px; color: rgba(255,255,255,0.7); margin-top: 30px;">Merci de votre attention</p>
  </div>

  <!-- Slide 16-20: Annexes -->
  <div class="slide">
    <h1 class="slide-title">Annexe 1 : Calendrier AI Act</h1>
    <div class="slide-content">
      <table style="width: 100%; border-collapse: collapse;">
        <tr style="background: rgba(139,92,246,0.2);"><th style="padding: 15px; text-align: left;">Date</th><th style="padding: 15px; text-align: left;">Dispositions</th></tr>
        <tr><td style="padding: 12px; border-bottom: 1px solid rgba(255,255,255,0.1);">2 février 2025</td><td style="padding: 12px; border-bottom: 1px solid rgba(255,255,255,0.1);">Article 4 (Formation), Pratiques interdites</td></tr>
        <tr><td style="padding: 12px; border-bottom: 1px solid rgba(255,255,255,0.1);">2 août 2025</td><td style="padding: 12px; border-bottom: 1px solid rgba(255,255,255,0.1);">Gouvernance, Organismes notifiés</td></tr>
        <tr><td style="padding: 12px; border-bottom: 1px solid rgba(255,255,255,0.1);">2 août 2026</td><td style="padding: 12px; border-bottom: 1px solid rgba(255,255,255,0.1);">Obligations systèmes haut risque</td></tr>
        <tr><td style="padding: 12px;">2 août 2027</td><td style="padding: 12px;">Systèmes HR produits Annexe I</td></tr>
      </table>
    </div>
  </div>

  <div class="slide">
    <h1 class="slide-title">Annexe 2 : Niveaux de risque AI Act</h1>
    <div class="slide-content">
      <div class="risk-matrix" style="grid-template-columns: 1fr;">
        <div class="risk-item risk-high">🚫 <strong>Inacceptable</strong> - Interdit (scoring social, manipulation subliminale...)</div>
        <div class="risk-item risk-med">⚠️ <strong>Haut risque</strong> - Obligations renforcées (RH, santé, finance...)</div>
        <div class="risk-item" style="background: rgba(0,245,255,0.2); border: 1px solid #00F5FF;">ℹ️ <strong>Limité</strong> - Obligations de transparence (chatbots, deepfakes...)</div>
        <div class="risk-item risk-low">✅ <strong>Minimal</strong> - Pas d'obligation spécifique</div>
      </div>
    </div>
  </div>

  <div class="slide">
    <h1 class="slide-title">Annexe 3 : Détail des scores</h1>
    <div class="slide-content">
      <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
        <tr style="background: rgba(139,92,246,0.2);"><th style="padding: 10px;">Domaine</th><th style="padding: 10px;">Score</th><th style="padding: 10px;">Statut</th></tr>
        ${categoryScores.map((c) => `
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid rgba(255,255,255,0.1);">${c.icon} ${categoryNames[c.category] || c.category}</td>
            <td style="padding: 10px; border-bottom: 1px solid rgba(255,255,255,0.1); color: ${c.color}; font-weight: 700;">${Math.round(c.score)}%</td>
            <td style="padding: 10px; border-bottom: 1px solid rgba(255,255,255,0.1);">${c.score >= 80 ? '✅ Conforme' : c.score >= 60 ? '🟡 À améliorer' : '🔴 Critique'}</td>
          </tr>
        `).join('')}
      </table>
    </div>
  </div>

  <div class="slide">
    <h1 class="slide-title">Annexe 4 : Contacts & Ressources</h1>
    <div class="slide-content">
      <h2>Référent AI Act proposé</h2>
      <p>[Nom à définir] - [Fonction]</p>
      
      <h2 style="margin-top: 30px;">Ressources</h2>
      <ul>
        <li>Formation complète : formation-ia-act.fr</li>
        <li>Texte officiel : eur-lex.europa.eu</li>
        <li>Commission européenne : digital-strategy.ec.europa.eu</li>
      </ul>
      
      <div class="highlight" style="margin-top: 30px;">
        <p>Pour toute question : contact@formation-ia-act.fr</p>
      </div>
    </div>
  </div>

  <div class="slide" style="justify-content: center; align-items: center; text-align: center;">
    <div style="font-size: 48px; margin-bottom: 20px;">🛡️</div>
    <h1 class="slide-title">Merci</h1>
    <p style="color: rgba(255,255,255,0.6);">Présentation générée par Formation-IA-Act.fr</p>
    <p style="color: rgba(255,255,255,0.4); margin-top: 20px;">${profile.name || 'Organisation'} • ${new Date().toLocaleDateString('fr-FR')}</p>
  </div>
</body>
</html>
    `;
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(pptHTML);
      printWindow.document.close();
    }
  };

  // Generate Organigramme Gouvernance IA
  const generateOrganigramme = () => {
    const orgHTML = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>Organigramme Gouvernance IA - ${profile.name || 'Organisation'}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', system-ui, sans-serif; background: #f8fafc; padding: 40px; }
    .container { max-width: 1200px; margin: 0 auto; }
    h1 { text-align: center; color: #1a1a2e; margin-bottom: 10px; }
    .subtitle { text-align: center; color: #666; margin-bottom: 40px; }
    .org-chart { display: flex; flex-direction: column; align-items: center; }
    .level { display: flex; justify-content: center; gap: 30px; margin: 20px 0; position: relative; }
    .box { background: white; border-radius: 12px; padding: 20px 30px; text-align: center; box-shadow: 0 4px 15px rgba(0,0,0,0.1); min-width: 200px; position: relative; }
    .box.direction { background: linear-gradient(135deg, #8B5CF6, #7C3AED); color: white; }
    .box.referent { background: linear-gradient(135deg, #00F5FF, #0066FF); color: white; border: 3px solid #FFB800; }
    .box.comite { background: linear-gradient(135deg, #00FF88, #00CC6A); color: white; }
    .box.equipe { background: white; border: 2px solid #8B5CF6; }
    .box h3 { font-size: 18px; margin-bottom: 5px; }
    .box p { font-size: 12px; opacity: 0.9; }
    .box .role { font-size: 11px; margin-top: 10px; padding: 5px 10px; background: rgba(255,255,255,0.2); border-radius: 15px; display: inline-block; }
    .connector { width: 2px; height: 30px; background: #8B5CF6; margin: 0 auto; }
    .h-connector { height: 2px; background: #8B5CF6; position: absolute; top: -15px; }
    .legend { margin-top: 50px; padding: 20px; background: white; border-radius: 12px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); }
    .legend h4 { margin-bottom: 15px; color: #1a1a2e; }
    .legend-item { display: flex; align-items: center; gap: 10px; margin: 10px 0; font-size: 14px; }
    .legend-color { width: 30px; height: 20px; border-radius: 4px; }
    .responsibilities { margin-top: 40px; display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; }
    .resp-box { background: white; border-radius: 12px; padding: 20px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); }
    .resp-box h4 { color: #8B5CF6; margin-bottom: 15px; display: flex; align-items: center; gap: 10px; }
    .resp-box ul { margin-left: 20px; font-size: 14px; color: #555; }
    .resp-box li { margin: 8px 0; }
    @media print { body { background: white; } .print-btn { display: none; } }
    .print-btn { position: fixed; top: 20px; right: 20px; padding: 15px 30px; background: #8B5CF6; color: white; border: none; border-radius: 8px; cursor: pointer; }
  </style>
</head>
<body>
  <button class="print-btn" onclick="window.print()">🖨️ Imprimer / PDF</button>
  
  <div class="container">
    <h1>🏛️ Organigramme Gouvernance IA</h1>
    <p class="subtitle">${profile.name || 'Organisation'} - ${new Date().toLocaleDateString('fr-FR')}</p>
    
    <div class="org-chart">
      <!-- Niveau 1: Direction -->
      <div class="level">
        <div class="box direction">
          <h3>👔 Direction Générale</h3>
          <p>Sponsor exécutif</p>
          <span class="role">Validation stratégique</span>
        </div>
      </div>
      
      <div class="connector"></div>
      
      <!-- Niveau 2: Comité -->
      <div class="level">
        <div class="box comite">
          <h3>🏛️ Comité de Gouvernance IA</h3>
          <p>Instance de pilotage</p>
          <span class="role">Réunion mensuelle</span>
        </div>
      </div>
      
      <div class="connector"></div>
      
      <!-- Niveau 3: Référent -->
      <div class="level">
        <div class="box referent">
          <h3>⭐ Référent IA</h3>
          <p>Pilote opérationnel</p>
          <span class="role">Point focal AI Act</span>
        </div>
      </div>
      
      <div class="connector"></div>
      
      <!-- Niveau 4: Équipes -->
      <div class="level">
        <div class="box equipe">
          <h3>💻 DSI</h3>
          <p>Systèmes & Data</p>
        </div>
        <div class="box equipe">
          <h3>👥 DRH</h3>
          <p>Formation & RH</p>
        </div>
        <div class="box equipe">
          <h3>⚖️ Juridique</h3>
          <p>Conformité</p>
        </div>
        <div class="box equipe">
          <h3>🔒 RSSI/DPO</h3>
          <p>Sécurité & RGPD</p>
        </div>
      </div>
    </div>
    
    <!-- Légende -->
    <div class="legend">
      <h4>Légende</h4>
      <div style="display: flex; gap: 30px; flex-wrap: wrap;">
        <div class="legend-item">
          <div class="legend-color" style="background: linear-gradient(135deg, #8B5CF6, #7C3AED);"></div>
          <span>Direction - Sponsor exécutif</span>
        </div>
        <div class="legend-item">
          <div class="legend-color" style="background: linear-gradient(135deg, #00FF88, #00CC6A);"></div>
          <span>Comité - Instance de pilotage</span>
        </div>
        <div class="legend-item">
          <div class="legend-color" style="background: linear-gradient(135deg, #00F5FF, #0066FF); border: 2px solid #FFB800;"></div>
          <span>Référent IA - Pilote opérationnel (⭐ Clé)</span>
        </div>
        <div class="legend-item">
          <div class="legend-color" style="background: white; border: 2px solid #8B5CF6;"></div>
          <span>Équipes support</span>
        </div>
      </div>
    </div>
    
    <!-- Responsabilités -->
    <div class="responsibilities">
      <div class="resp-box">
        <h4>⭐ Référent IA</h4>
        <ul>
          <li>Piloter le programme de conformité AI Act</li>
          <li>Tenir à jour le registre des systèmes IA</li>
          <li>Coordonner les équipes sur les sujets IA</li>
          <li>Valider les nouveaux déploiements IA</li>
          <li>Assurer la veille réglementaire</li>
          <li>Reporter au Comité et à la Direction</li>
        </ul>
      </div>
      <div class="resp-box">
        <h4>🏛️ Comité de Gouvernance</h4>
        <ul>
          <li>Valider la stratégie IA de l'organisation</li>
          <li>Arbitrer les cas complexes</li>
          <li>Allouer les ressources nécessaires</li>
          <li>Suivre les indicateurs de conformité</li>
          <li>Approuver la Politique IA</li>
        </ul>
      </div>
      <div class="resp-box">
        <h4>💻 DSI</h4>
        <ul>
          <li>Maintenir l'inventaire technique des IA</li>
          <li>Assurer la documentation technique</li>
          <li>Gérer les relations fournisseurs IA</li>
          <li>Implémenter les mesures de sécurité</li>
        </ul>
      </div>
      <div class="resp-box">
        <h4>👥 DRH</h4>
        <ul>
          <li>Piloter le plan de formation Article 4</li>
          <li>Suivre les attestations de formation</li>
          <li>Intégrer l'IA dans l'onboarding</li>
          <li>Gérer la conformité IA RH (recrutement)</li>
        </ul>
      </div>
    </div>
    
    <p style="text-align: center; margin-top: 40px; color: #666; font-size: 12px;">
      Document généré par Formation-IA-Act.fr
    </p>
  </div>
</body>
</html>
    `;
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(orgHTML);
      printWindow.document.close();
    }
  };

  // Generate Dashboard de suivi
  const generateDashboard = () => {
    console.log('generateDashboard called');
    try {
      const dashHTML = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>Dashboard de Suivi Conformité AI Act</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', system-ui, sans-serif; background: #0f0f23; color: white; min-height: 100vh; }
    .dashboard { padding: 30px; max-width: 1400px; margin: 0 auto; }
    .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 1px solid rgba(255,255,255,0.1); }
    .header h1 { font-size: 28px; background: linear-gradient(135deg, #8B5CF6, #00F5FF); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    .header .date { color: rgba(255,255,255,0.6); }
    .metrics { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-bottom: 30px; }
    .metric-card { background: rgba(255,255,255,0.05); border-radius: 16px; padding: 25px; border: 1px solid rgba(255,255,255,0.1); }
    .metric-card .value { font-size: 42px; font-weight: 700; margin-bottom: 5px; }
    .metric-card .label { font-size: 14px; color: rgba(255,255,255,0.6); }
    .metric-card .trend { font-size: 12px; margin-top: 10px; }
    .metric-card .trend.up { color: #00FF88; }
    .metric-card .trend.down { color: #FF4444; }
    .grid { display: grid; grid-template-columns: 2fr 1fr; gap: 20px; margin-bottom: 30px; }
    .card { background: rgba(255,255,255,0.05); border-radius: 16px; padding: 25px; border: 1px solid rgba(255,255,255,0.1); }
    .card h3 { font-size: 18px; margin-bottom: 20px; color: #00F5FF; }
    .progress-item { margin: 15px 0; }
    .progress-item .header { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 14px; }
    .progress-bar { height: 8px; background: rgba(255,255,255,0.1); border-radius: 4px; overflow: hidden; }
    .progress-fill { height: 100%; border-radius: 4px; }
    .timeline-item { display: flex; gap: 15px; margin: 15px 0; padding: 15px; background: rgba(255,255,255,0.03); border-radius: 8px; }
    .timeline-icon { width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 18px; }
    .timeline-content h4 { font-size: 14px; margin-bottom: 5px; }
    .timeline-content p { font-size: 12px; color: rgba(255,255,255,0.6); }
    .checklist-item { display: flex; align-items: center; gap: 12px; padding: 12px; margin: 8px 0; background: rgba(255,255,255,0.03); border-radius: 8px; font-size: 14px; }
    .checklist-item.done { opacity: 0.6; }
    .checklist-item .check { width: 24px; height: 24px; border: 2px solid rgba(255,255,255,0.3); border-radius: 6px; display: flex; align-items: center; justify-content: center; }
    .checklist-item.done .check { background: #00FF88; border-color: #00FF88; }
    .alert-box { padding: 15px; border-radius: 8px; margin: 10px 0; font-size: 14px; }
    .alert-box.warning { background: rgba(255,184,0,0.1); border: 1px solid #FFB800; }
    .alert-box.danger { background: rgba(255,68,68,0.1); border: 1px solid #FF4444; }
    .alert-box.success { background: rgba(0,255,136,0.1); border: 1px solid #00FF88; }
    table { width: 100%; border-collapse: collapse; font-size: 14px; }
    th, td { padding: 12px; text-align: left; border-bottom: 1px solid rgba(255,255,255,0.1); }
    th { color: rgba(255,255,255,0.6); font-weight: 500; }
    .status { padding: 4px 12px; border-radius: 20px; font-size: 12px; }
    .status.done { background: rgba(0,255,136,0.2); color: #00FF88; }
    .status.progress { background: rgba(0,245,255,0.2); color: #00F5FF; }
    .status.todo { background: rgba(255,255,255,0.1); color: rgba(255,255,255,0.6); }
    @media print { body { background: white; color: #333; } .card { border: 1px solid #ddd; background: #f9f9f9; } }
  </style>
</head>
<body>
  <div class="dashboard">
    <div class="header">
      <h1>📊 Dashboard Conformité AI Act</h1>
      <div>
        <div class="date">${profile.name || 'Organisation'}</div>
        <div class="date">Mis à jour le ${new Date().toLocaleDateString('fr-FR')}</div>
      </div>
    </div>
    
    <!-- Métriques principales -->
    <div class="metrics">
      <div class="metric-card">
        <div class="value" style="color: ${score >= 80 ? '#00FF88' : score >= 60 ? '#00F5FF' : '#FFB800'};">${score}%</div>
        <div class="label">Score de conformité</div>
        <div class="trend up">↑ Objectif : 80%</div>
      </div>
      <div class="metric-card">
        <div class="value" style="color: #00F5FF;">${totalQuestions}</div>
        <div class="label">Critères évalués</div>
      </div>
      <div class="metric-card">
        <div class="value" style="color: ${highRiskFlags.length > 0 ? '#FF4444' : '#00FF88'};">${highRiskFlags.length}</div>
        <div class="label">Systèmes haut risque</div>
      </div>
      <div class="metric-card">
        <div class="value" style="color: #8B5CF6;">${categoryScores.filter((c) => c.score >= 80).length}/${categoryScores.length}</div>
        <div class="label">Domaines conformes</div>
      </div>
    </div>
    
    <div class="grid">
      <!-- Progression par domaine -->
      <div class="card">
        <h3>📈 Progression par domaine</h3>
        ${categoryScores.map((c) => `
          <div class="progress-item">
            <div class="header">
              <span>${c.icon} ${categoryNames[c.category] || c.category}</span>
              <span style="color: ${c.color};">${Math.round(c.score)}%</span>
            </div>
            <div class="progress-bar">
              <div class="progress-fill" style="width: ${c.score}%; background: ${c.color};"></div>
            </div>
          </div>
        `).join('')}
      </div>
      
      <!-- Alertes -->
      <div class="card">
        <h3>⚠️ Alertes & Échéances</h3>
        ${categoryScores.filter((c) => c.score < 60).length > 0 ? `
          <div class="alert-box danger">
            🔴 ${categoryScores.filter((c) => c.score < 60).length} domaine(s) critique(s) à traiter en priorité
          </div>
        ` : ''}
        <div class="alert-box warning">
          📅 Article 4 (Formation) : Obligation en vigueur depuis février 2025
        </div>
        <div class="alert-box warning">
          📅 Interdictions : Août 2025
        </div>
        ${score >= 80 ? `
          <div class="alert-box success">
            ✅ Score de conformité satisfaisant (${score}%)
          </div>
        ` : ''}
      </div>
    </div>
    
    <div class="grid">
      <!-- Plan d'action -->
      <div class="card">
        <h3>📋 Plan d'action - Prochaines étapes</h3>
        <table>
          <thead>
            <tr><th>Action</th><th>Responsable</th><th>Échéance</th><th>Statut</th></tr>
          </thead>
          <tbody>
            <tr>
              <td>Nommer le Référent IA</td>
              <td>DG</td>
              <td>M1</td>
              <td><span class="status ${score >= 60 ? 'done' : 'progress'}">${score >= 60 ? 'Fait' : 'En cours'}</span></td>
            </tr>
            <tr>
              <td>Compléter l'inventaire IA</td>
              <td>DSI</td>
              <td>M1</td>
              <td><span class="status ${(categoryScores.find((c) => c.category === 'inventory')?.score ?? 0) >= 80 ? 'done' : 'progress'}">${(categoryScores.find((c) => c.category === 'inventory')?.score ?? 0) >= 80 ? 'Fait' : 'En cours'}</span></td>
            </tr>
            <tr>
              <td>Former les équipes (Article 4)</td>
              <td>DRH</td>
              <td>M2-M3</td>
              <td><span class="status ${(categoryScores.find((c) => c.category === 'training')?.score ?? 0) >= 80 ? 'done' : 'progress'}">${(categoryScores.find((c) => c.category === 'training')?.score ?? 0) >= 80 ? 'Fait' : 'En cours'}</span></td>
            </tr>
            <tr>
              <td>Rédiger la Politique IA</td>
              <td>Juridique</td>
              <td>M2</td>
              <td><span class="status ${(categoryScores.find((c) => c.category === 'governance')?.score ?? 0) >= 80 ? 'done' : 'progress'}">${(categoryScores.find((c) => c.category === 'governance')?.score ?? 0) >= 80 ? 'Fait' : 'En cours'}</span></td>
            </tr>
            <tr>
              <td>Classifier les systèmes</td>
              <td>Référent IA</td>
              <td>M2</td>
              <td><span class="status ${(categoryScores.find((c) => c.category === 'classification')?.score ?? 0) >= 80 ? 'done' : 'progress'}">${(categoryScores.find((c) => c.category === 'classification')?.score ?? 0) >= 80 ? 'Fait' : 'En cours'}</span></td>
            </tr>
            <tr>
              <td>Mettre à jour CGU (transparence)</td>
              <td>Juridique</td>
              <td>M3</td>
              <td><span class="status todo">À faire</span></td>
            </tr>
            <tr>
              <td>Audit interne de validation</td>
              <td>Référent IA</td>
              <td>M6</td>
              <td><span class="status todo">À faire</span></td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- Checklist rapide -->
      <div class="card">
        <h3>✅ Checklist conformité</h3>
        <div class="checklist-item ${(categoryScores.find((c) => c.category === 'inventory')?.score ?? 0) >= 80 ? 'done' : ''}">
          <div class="check">${(categoryScores.find((c) => c.category === 'inventory')?.score ?? 0) >= 80 ? '✓' : ''}</div>
          <span>Inventaire IA complet</span>
        </div>
        <div class="checklist-item ${(categoryScores.find((c) => c.category === 'governance')?.score ?? 0) >= 80 ? 'done' : ''}">
          <div class="check">${(categoryScores.find((c) => c.category === 'governance')?.score ?? 0) >= 80 ? '✓' : ''}</div>
          <span>Référent IA nommé</span>
        </div>
        <div class="checklist-item ${(categoryScores.find((c) => c.category === 'governance')?.score ?? 0) >= 80 ? 'done' : ''}">
          <div class="check">${(categoryScores.find((c) => c.category === 'governance')?.score ?? 0) >= 80 ? '✓' : ''}</div>
          <span>Politique IA rédigée</span>
        </div>
        <div class="checklist-item ${(categoryScores.find((c) => c.category === 'classification')?.score ?? 0) >= 80 ? 'done' : ''}">
          <div class="check">${(categoryScores.find((c) => c.category === 'classification')?.score ?? 0) >= 80 ? '✓' : ''}</div>
          <span>Systèmes classifiés</span>
        </div>
        <div class="checklist-item ${(categoryScores.find((c) => c.category === 'training')?.score ?? 0) >= 80 ? 'done' : ''}">
          <div class="check">${(categoryScores.find((c) => c.category === 'training')?.score ?? 0) >= 80 ? '✓' : ''}</div>
          <span>Formation Article 4 déployée</span>
        </div>
        <div class="checklist-item ${(categoryScores.find((c) => c.category === 'documentation')?.score ?? 0) >= 80 ? 'done' : ''}">
          <div class="check">${(categoryScores.find((c) => c.category === 'documentation')?.score ?? 0) >= 80 ? '✓' : ''}</div>
          <span>Documentation technique</span>
        </div>
        <div class="checklist-item ${(categoryScores.find((c) => c.category === 'transparency')?.score ?? 0) >= 80 ? 'done' : ''}">
          <div class="check">${(categoryScores.find((c) => c.category === 'transparency')?.score ?? 0) >= 80 ? '✓' : ''}</div>
          <span>Transparence IA</span>
        </div>
        <div class="checklist-item ${(categoryScores.find((c) => c.category === 'security')?.score ?? 0) >= 80 ? 'done' : ''}">
          <div class="check">${(categoryScores.find((c) => c.category === 'security')?.score ?? 0) >= 80 ? '✓' : ''}</div>
          <span>Sécurité & RGPD alignés</span>
        </div>
      </div>
    </div>
    
    <p style="text-align: center; margin-top: 30px; color: rgba(255,255,255,0.4); font-size: 12px;">
      Dashboard généré par Formation-IA-Act.fr | Score basé sur l'audit du ${new Date(completedAt).toLocaleDateString('fr-FR')}
    </p>
  </div>
</body>
</html>
    `;
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(dashHTML);
        printWindow.document.close();
      } else {
        alert('Impossible d\'ouvrir le dashboard. Veuillez autoriser les popups pour ce site.');
      }
    } catch (error) {
      console.error('Erreur lors de la génération du dashboard:', error);
      alert('Erreur lors de la génération du dashboard. Veuillez réessayer.');
    }
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
                    {categoryScores.map((cat: { category: string; icon: string; color: string; score: number }, i: number) => (
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
                      <button 
                        onClick={generateCertificate}
                        className="w-full flex items-center justify-center gap-2 py-3 bg-[#00FF88]/10 border border-[#00FF88]/30 text-[#00FF88] font-medium rounded-xl hover:bg-[#00FF88]/20 transition-colors"
                      >
                        <div className="w-5 h-5"><Icons.Award /></div>
                        Télécharger le certificat
                      </button>
                      <button 
                        onClick={downloadTemplates}
                        className="w-full flex items-center justify-center gap-2 py-3 bg-white/5 border border-white/10 text-white/70 font-medium rounded-xl hover:bg-white/10 transition-colors"
                      >
                        <div className="w-5 h-5"><Icons.FileText /></div>
                        Templates pré-remplis ({plan === 'enterprise' ? '12' : '3'})
                      </button>
                    </>
                  )}

                  {plan === 'enterprise' && (
                    <button 
                      onClick={generateDashboard}
                      className="w-full flex items-center justify-center gap-2 py-3 bg-[#FFB800]/10 border border-[#FFB800]/30 text-[#FFB800] font-medium rounded-xl hover:bg-[#FFB800]/20 transition-colors"
                    >
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
                      href="/pricing"
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
            ].map((tab: { id: string; label: string }) => (
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
                      {recommendations.slice(0, 6).map((rec: { priority: string; text: string; category: string; aiActRef?: string }, i: number) => (
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
                        <div className="text-3xl font-bold text-[#00F5FF]">{totalQuestions}</div>
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
                {categoryScores.map((cat: { category: string; icon: string; color: string; score: number }, i: number) => (
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
                      {actionPlan.slice(0, plan === 'enterprise' ? 12 : 6).map((action: { month: number; title: string; tasks: string[]; priority: boolean; kpi?: string; budget?: string }, i: number) => (
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
                              {action.tasks.map((task: string, j: number) => (
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
                        href="/pricing"
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
                    <button 
                      onClick={generateCertificate}
                      className="w-full py-3 bg-[#00FF88]/10 border border-[#00FF88]/30 text-[#00FF88] font-medium rounded-xl hover:bg-[#00FF88]/20 transition-colors flex items-center justify-center gap-2"
                    >
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
                    <button 
                      onClick={downloadTemplates}
                      className="w-full py-3 bg-[#FFB800]/10 border border-[#FFB800]/30 text-[#FFB800] font-medium rounded-xl hover:bg-[#FFB800]/20 transition-colors flex items-center justify-center gap-2"
                    >
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
                        <button 
                          onClick={generatePowerPointCOMEX}
                          className="w-full py-3 bg-white/5 border border-white/10 text-white/80 font-medium rounded-xl hover:bg-white/10 transition-colors flex items-center justify-center gap-2 text-sm"
                        >
                          📊 PowerPoint COMEX (20 slides)
                        </button>
                        <button 
                          onClick={generateOrganigramme}
                          className="w-full py-3 bg-white/5 border border-white/10 text-white/80 font-medium rounded-xl hover:bg-white/10 transition-colors flex items-center justify-center gap-2 text-sm"
                        >
                          🏛️ Organigramme gouvernance IA
                        </button>
                        <button 
                          onClick={generateDashboard}
                          className="w-full py-3 bg-gradient-to-r from-[#8B5CF6]/20 to-[#00F5FF]/20 border border-[#00F5FF]/30 text-white font-medium rounded-xl hover:from-[#8B5CF6]/30 hover:to-[#00F5FF]/30 transition-colors flex items-center justify-center gap-2 text-sm"
                        >
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
              href={`/audit/questionnaire?plan=${plan}`}
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
