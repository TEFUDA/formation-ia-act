'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ============================================
// TYPES
// ============================================
interface DiagnosticAnswer {
  questionId: string;
  answer: string | string[] | number;
  score: number;
}

interface DiagnosticResult {
  totalScore: number;
  maxScore: number;
  percentage: number;
  level: 'critical' | 'high' | 'medium' | 'low' | 'minimal';
  recommendations: string[];
  concernedBy: string[];
  completedAt: string;
}

interface CompanyProfile {
  name: string;
  sector: string;
  size: string;
  role: string;
  euPresence: boolean;
  aiUsage: string[];
}

// ============================================
// QUESTIONS DATA
// ============================================
const DIAGNOSTIC_SECTIONS = [
  {
    id: 'company',
    title: 'Profil de votre entreprise',
    icon: '🏢',
    questions: [
      {
        id: 'company_name',
        question: 'Quel est le nom de votre entreprise ?',
        type: 'text',
        placeholder: 'Ex: Acme Corp',
        required: true,
      },
      {
        id: 'sector',
        question: 'Dans quel secteur d\'activité êtes-vous ?',
        type: 'select',
        options: [
          { value: 'finance', label: '🏦 Finance / Banque / Assurance', riskWeight: 3 },
          { value: 'healthcare', label: '🏥 Santé / Pharma', riskWeight: 3 },
          { value: 'hr', label: '👥 Ressources Humaines / Recrutement', riskWeight: 3 },
          { value: 'legal', label: '⚖️ Juridique', riskWeight: 2 },
          { value: 'education', label: '🎓 Éducation / Formation', riskWeight: 2 },
          { value: 'retail', label: '🛒 Commerce / E-commerce', riskWeight: 1 },
          { value: 'industry', label: '🏭 Industrie / Manufacturing', riskWeight: 2 },
          { value: 'tech', label: '💻 Tech / IT / SaaS', riskWeight: 2 },
          { value: 'transport', label: '🚗 Transport / Logistique', riskWeight: 2 },
          { value: 'energy', label: '⚡ Énergie / Utilities', riskWeight: 2 },
          { value: 'public', label: '🏛️ Secteur Public', riskWeight: 3 },
          { value: 'other', label: '📋 Autre', riskWeight: 1 },
        ],
        required: true,
      },
      {
        id: 'company_size',
        question: 'Quelle est la taille de votre entreprise ?',
        type: 'select',
        options: [
          { value: 'micro', label: '1-9 employés (Micro)', riskWeight: 0 },
          { value: 'small', label: '10-49 employés (Petite)', riskWeight: 1 },
          { value: 'medium', label: '50-249 employés (Moyenne)', riskWeight: 2 },
          { value: 'large', label: '250+ employés (Grande)', riskWeight: 3 },
        ],
        required: true,
      },
      {
        id: 'eu_presence',
        question: 'Avez-vous une présence dans l\'Union Européenne ?',
        type: 'select',
        helpText: 'Clients, utilisateurs, filiales ou activités dans l\'UE',
        options: [
          { value: 'yes_hq', label: 'Oui, siège social dans l\'UE', riskWeight: 3 },
          { value: 'yes_subsidiary', label: 'Oui, filiale(s) dans l\'UE', riskWeight: 3 },
          { value: 'yes_clients', label: 'Oui, clients/utilisateurs dans l\'UE', riskWeight: 2 },
          { value: 'no', label: 'Non, aucune présence UE', riskWeight: 0 },
        ],
        required: true,
      },
    ],
  },
  {
    id: 'ai_usage',
    title: 'Utilisation de l\'IA',
    icon: '🤖',
    questions: [
      {
        id: 'ai_role',
        question: 'Quel est votre rôle par rapport aux systèmes IA ?',
        type: 'multiselect',
        helpText: 'Sélectionnez tous les rôles applicables',
        options: [
          { value: 'provider', label: '🔧 Fournisseur - Nous développons/vendons des systèmes IA', riskWeight: 4 },
          { value: 'deployer', label: '📦 Déployeur - Nous utilisons des systèmes IA de tiers', riskWeight: 3 },
          { value: 'importer', label: '🌍 Importateur - Nous importons des IA de hors UE', riskWeight: 3 },
          { value: 'distributor', label: '🔄 Distributeur - Nous distribuons des systèmes IA', riskWeight: 2 },
          { value: 'none', label: '❌ Aucun - Nous n\'utilisons pas d\'IA', riskWeight: 0 },
        ],
        required: true,
      },
      {
        id: 'ai_systems_count',
        question: 'Combien de systèmes IA utilisez-vous approximativement ?',
        type: 'select',
        options: [
          { value: '0', label: 'Aucun', riskWeight: 0 },
          { value: '1-5', label: '1 à 5 systèmes', riskWeight: 1 },
          { value: '6-15', label: '6 à 15 systèmes', riskWeight: 2 },
          { value: '16-50', label: '16 à 50 systèmes', riskWeight: 3 },
          { value: '50+', label: 'Plus de 50 systèmes', riskWeight: 4 },
        ],
        required: true,
      },
      {
        id: 'ai_types',
        question: 'Quels types de systèmes IA utilisez-vous ?',
        type: 'multiselect',
        helpText: 'Sélectionnez tous les types applicables',
        options: [
          { value: 'chatbot', label: '💬 Chatbots / Assistants virtuels', riskWeight: 1 },
          { value: 'recommendation', label: '🎯 Systèmes de recommandation', riskWeight: 1 },
          { value: 'analytics', label: '📊 Analytics prédictifs', riskWeight: 2 },
          { value: 'cv_screening', label: '📄 Tri de CV / Recrutement', riskWeight: 4 },
          { value: 'credit_scoring', label: '💳 Scoring crédit / Risque', riskWeight: 4 },
          { value: 'facial_recognition', label: '👤 Reconnaissance faciale', riskWeight: 5 },
          { value: 'biometric', label: '🔐 Identification biométrique', riskWeight: 5 },
          { value: 'medical_diagnosis', label: '🏥 Diagnostic médical', riskWeight: 5 },
          { value: 'autonomous_vehicles', label: '🚗 Véhicules autonomes', riskWeight: 5 },
          { value: 'content_moderation', label: '🛡️ Modération de contenu', riskWeight: 2 },
          { value: 'translation', label: '🌐 Traduction automatique', riskWeight: 1 },
          { value: 'image_generation', label: '🎨 Génération d\'images (DALL-E, etc.)', riskWeight: 2 },
          { value: 'text_generation', label: '✍️ Génération de texte (ChatGPT, etc.)', riskWeight: 2 },
          { value: 'voice_assistant', label: '🎤 Assistants vocaux', riskWeight: 1 },
          { value: 'fraud_detection', label: '🔍 Détection de fraude', riskWeight: 3 },
          { value: 'other', label: '📋 Autre', riskWeight: 1 },
        ],
        required: true,
      },
    ],
  },
  {
    id: 'high_risk',
    title: 'Systèmes à haut risque',
    icon: '⚠️',
    questions: [
      {
        id: 'hr_decisions',
        question: 'Utilisez-vous l\'IA pour des décisions RH ?',
        type: 'multiselect',
        helpText: 'Recrutement, évaluation, promotion, licenciement...',
        options: [
          { value: 'recruitment', label: '📋 Tri de CV / Présélection candidats', riskWeight: 5 },
          { value: 'performance', label: '📈 Évaluation des performances', riskWeight: 4 },
          { value: 'promotion', label: '🎯 Décisions de promotion', riskWeight: 4 },
          { value: 'scheduling', label: '📅 Planning / Affectation des tâches', riskWeight: 2 },
          { value: 'monitoring', label: '👁️ Surveillance des employés', riskWeight: 5 },
          { value: 'none', label: '❌ Non, aucune utilisation RH', riskWeight: 0 },
        ],
        required: true,
      },
      {
        id: 'credit_insurance',
        question: 'Utilisez-vous l\'IA pour le crédit ou l\'assurance ?',
        type: 'multiselect',
        options: [
          { value: 'credit_scoring', label: '💳 Scoring crédit / Solvabilité', riskWeight: 5 },
          { value: 'insurance_pricing', label: '📊 Tarification assurance', riskWeight: 5 },
          { value: 'claim_processing', label: '📝 Traitement des sinistres', riskWeight: 4 },
          { value: 'fraud_detection', label: '🔍 Détection de fraude', riskWeight: 3 },
          { value: 'none', label: '❌ Non, aucune utilisation', riskWeight: 0 },
        ],
        required: true,
      },
      {
        id: 'biometric_usage',
        question: 'Utilisez-vous des systèmes biométriques ?',
        type: 'multiselect',
        options: [
          { value: 'facial_id', label: '👤 Identification faciale', riskWeight: 5 },
          { value: 'emotion_recognition', label: '😊 Reconnaissance des émotions', riskWeight: 5 },
          { value: 'voice_id', label: '🎤 Identification vocale', riskWeight: 4 },
          { value: 'fingerprint', label: '👆 Empreintes digitales (accès)', riskWeight: 2 },
          { value: 'none', label: '❌ Non, aucun système biométrique', riskWeight: 0 },
        ],
        required: true,
      },
      {
        id: 'critical_infrastructure',
        question: 'Opérez-vous dans des infrastructures critiques ?',
        type: 'multiselect',
        options: [
          { value: 'energy', label: '⚡ Gestion de l\'énergie', riskWeight: 5 },
          { value: 'water', label: '💧 Approvisionnement en eau', riskWeight: 5 },
          { value: 'transport', label: '🚂 Transport (rail, aérien, maritime)', riskWeight: 5 },
          { value: 'healthcare', label: '🏥 Santé / Dispositifs médicaux', riskWeight: 5 },
          { value: 'safety', label: '🛡️ Sécurité publique', riskWeight: 5 },
          { value: 'none', label: '❌ Non, aucune infrastructure critique', riskWeight: 0 },
        ],
        required: true,
      },
    ],
  },
  {
    id: 'governance',
    title: 'Gouvernance actuelle',
    icon: '📋',
    questions: [
      {
        id: 'existing_policy',
        question: 'Avez-vous une politique d\'utilisation de l\'IA ?',
        type: 'select',
        options: [
          { value: 'yes_complete', label: '✅ Oui, complète et documentée', riskWeight: 0 },
          { value: 'yes_partial', label: '📝 Oui, mais partielle', riskWeight: 1 },
          { value: 'in_progress', label: '🔄 En cours d\'élaboration', riskWeight: 2 },
          { value: 'no', label: '❌ Non, aucune politique', riskWeight: 3 },
        ],
        required: true,
      },
      {
        id: 'inventory_exists',
        question: 'Avez-vous un inventaire de vos systèmes IA ?',
        type: 'select',
        options: [
          { value: 'yes_complete', label: '✅ Oui, complet et à jour', riskWeight: 0 },
          { value: 'yes_partial', label: '📝 Oui, mais incomplet', riskWeight: 1 },
          { value: 'in_progress', label: '🔄 En cours de création', riskWeight: 2 },
          { value: 'no', label: '❌ Non, aucun inventaire', riskWeight: 3 },
        ],
        required: true,
      },
      {
        id: 'dpo_ciso',
        question: 'Avez-vous un DPO ou responsable conformité ?',
        type: 'select',
        options: [
          { value: 'dpo_ciso', label: '✅ DPO + CISO/Responsable sécurité', riskWeight: 0 },
          { value: 'dpo_only', label: '📋 DPO uniquement', riskWeight: 1 },
          { value: 'external', label: '🤝 DPO externe', riskWeight: 1 },
          { value: 'none', label: '❌ Aucun', riskWeight: 3 },
        ],
        required: true,
      },
      {
        id: 'training',
        question: 'Vos équipes sont-elles formées sur l\'IA ?',
        type: 'select',
        options: [
          { value: 'yes_all', label: '✅ Oui, formation régulière', riskWeight: 0 },
          { value: 'yes_some', label: '📝 Partiellement', riskWeight: 1 },
          { value: 'planned', label: '🔄 Prévu prochainement', riskWeight: 2 },
          { value: 'no', label: '❌ Non', riskWeight: 3 },
        ],
        required: true,
      },
    ],
  },
];

// ============================================
// COMPONENT
// ============================================
interface DiagnosticWorkshopProps {
  moduleColor: string;
  onComplete: () => void;
}

export default function DiagnosticWorkshop({ moduleColor, onComplete }: DiagnosticWorkshopProps) {
  const [currentSection, setCurrentSection] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [showResults, setShowResults] = useState(false);
  const [result, setResult] = useState<DiagnosticResult | null>(null);

  // Load saved answers
  useEffect(() => {
    const saved = localStorage.getItem('workshop_diagnostic');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setAnswers(parsed.answers || {});
        if (parsed.result) {
          setResult(parsed.result);
        }
      } catch (e) {
        console.error('Error loading diagnostic:', e);
      }
    }
  }, []);

  // Save answers
  useEffect(() => {
    if (Object.keys(answers).length > 0) {
      localStorage.setItem('workshop_diagnostic', JSON.stringify({ answers, result }));
    }
  }, [answers, result]);

  const currentSectionData = DIAGNOSTIC_SECTIONS[currentSection];
  const totalSections = DIAGNOSTIC_SECTIONS.length;

  const handleAnswer = (questionId: string, value: any) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleMultiSelect = (questionId: string, value: string) => {
    const current = answers[questionId] || [];
    if (value === 'none') {
      setAnswers(prev => ({ ...prev, [questionId]: ['none'] }));
    } else if (current.includes('none')) {
      setAnswers(prev => ({ ...prev, [questionId]: [value] }));
    } else if (current.includes(value)) {
      setAnswers(prev => ({ ...prev, [questionId]: current.filter((v: string) => v !== value) }));
    } else {
      setAnswers(prev => ({ ...prev, [questionId]: [...current, value] }));
    }
  };

  const isSectionComplete = () => {
    return currentSectionData.questions.every(q => {
      if (!q.required) return true;
      const answer = answers[q.id];
      if (q.type === 'multiselect') return answer && answer.length > 0;
      return answer !== undefined && answer !== '';
    });
  };

  const calculateResults = () => {
    let totalScore = 0;
    let maxScore = 0;
    const recommendations: string[] = [];
    const concernedBy: string[] = [];

    // Calculate scores from all sections
    DIAGNOSTIC_SECTIONS.forEach(section => {
      section.questions.forEach(q => {
        const answer = answers[q.id];
        if (!answer) return;

        if (q.type === 'multiselect' && Array.isArray(answer)) {
          answer.forEach(val => {
            const opt = q.options?.find(o => o.value === val);
            if (opt) {
              totalScore += opt.riskWeight || 0;
              maxScore += 5; // Max possible per option
            }
          });
        } else if (q.type === 'select') {
          const opt = q.options?.find(o => o.value === answer);
          if (opt) {
            totalScore += opt.riskWeight || 0;
            maxScore += 5;
          }
        }
      });
    });

    // Determine level
    const percentage = Math.round((totalScore / Math.max(maxScore, 1)) * 100);
    let level: DiagnosticResult['level'] = 'minimal';
    
    if (percentage >= 70) level = 'critical';
    else if (percentage >= 50) level = 'high';
    else if (percentage >= 30) level = 'medium';
    else if (percentage >= 15) level = 'low';

    // Generate recommendations
    if (answers.existing_policy === 'no' || answers.existing_policy === 'in_progress') {
      recommendations.push('Établir une politique d\'utilisation de l\'IA en priorité');
    }
    if (answers.inventory_exists === 'no' || answers.inventory_exists === 'in_progress') {
      recommendations.push('Créer un inventaire exhaustif de vos systèmes IA');
    }
    if (answers.ai_types?.includes('cv_screening') || answers.hr_decisions?.includes('recruitment')) {
      recommendations.push('Vos systèmes RH sont à haut risque - conformité obligatoire');
      concernedBy.push('Systèmes IA à haut risque (Annexe III)');
    }
    if (answers.ai_types?.includes('credit_scoring') || answers.credit_insurance?.some((v: string) => v !== 'none')) {
      recommendations.push('Vos systèmes financiers nécessitent une documentation complète');
      concernedBy.push('Systèmes IA à haut risque (Annexe III)');
    }
    if (answers.biometric_usage?.some((v: string) => v !== 'none' && v !== 'fingerprint')) {
      recommendations.push('Les systèmes biométriques sont strictement encadrés');
      concernedBy.push('Systèmes biométriques (restrictions spéciales)');
    }
    if (answers.ai_types?.includes('text_generation') || answers.ai_types?.includes('image_generation')) {
      recommendations.push('Obligations de transparence pour l\'IA générative');
      concernedBy.push('IA à usage général / Générative (GPAI)');
    }
    if (answers.eu_presence !== 'no') {
      concernedBy.push('Activité dans l\'UE (application territoriale)');
    }
    if (answers.ai_role?.includes('provider')) {
      concernedBy.push('Fournisseur de systèmes IA');
      recommendations.push('En tant que fournisseur, obligations maximales (documentation technique, évaluation de conformité)');
    }
    if (answers.ai_role?.includes('deployer')) {
      concernedBy.push('Déployeur de systèmes IA');
      recommendations.push('En tant que déployeur, vérifier la conformité des systèmes utilisés');
    }

    if (recommendations.length === 0) {
      recommendations.push('Maintenir une veille réglementaire sur l\'AI Act');
    }

    const finalResult: DiagnosticResult = {
      totalScore,
      maxScore,
      percentage,
      level,
      recommendations: Array.from(new Set(recommendations)),
      concernedBy: Array.from(new Set(concernedBy)),
      completedAt: new Date().toISOString(),
    };

    setResult(finalResult);
    setShowResults(true);

    // Save to localStorage for other modules
    const companyProfile: CompanyProfile = {
      name: answers.company_name || '',
      sector: answers.sector || '',
      size: answers.company_size || '',
      role: answers.ai_role?.join(', ') || '',
      euPresence: answers.eu_presence !== 'no',
      aiUsage: answers.ai_types || [],
    };
    localStorage.setItem('workshop_company_profile', JSON.stringify(companyProfile));
    localStorage.setItem('workshop_diagnostic', JSON.stringify({ answers, result: finalResult }));
  };

  const getLevelConfig = (level: DiagnosticResult['level']) => {
    const configs = {
      critical: { color: '#EF4444', label: 'CRITIQUE', icon: '🚨', bg: 'bg-red-500/20' },
      high: { color: '#F97316', label: 'ÉLEVÉ', icon: '⚠️', bg: 'bg-orange-500/20' },
      medium: { color: '#EAB308', label: 'MODÉRÉ', icon: '📊', bg: 'bg-yellow-500/20' },
      low: { color: '#22C55E', label: 'FAIBLE', icon: '✅', bg: 'bg-green-500/20' },
      minimal: { color: '#06B6D4', label: 'MINIMAL', icon: '🎯', bg: 'bg-cyan-500/20' },
    };
    return configs[level];
  };

  const resetDiagnostic = () => {
    setAnswers({});
    setResult(null);
    setShowResults(false);
    setCurrentSection(0);
    localStorage.removeItem('workshop_diagnostic');
    localStorage.removeItem('workshop_company_profile');
  };

  // Results View
  if (showResults && result) {
    const levelConfig = getLevelConfig(result.level);

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="text-6xl mb-4"
          >
            {levelConfig.icon}
          </motion.div>
          <h2 className="text-2xl font-bold mb-2">Résultat du Diagnostic</h2>
          <p className="text-white/60">Analyse de votre exposition à l'AI Act</p>
        </div>

        {/* Score Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`${levelConfig.bg} rounded-2xl p-6 border-2`}
          style={{ borderColor: levelConfig.color }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-white/60 text-sm">Niveau d'exposition</p>
              <p className="text-3xl font-bold" style={{ color: levelConfig.color }}>
                {levelConfig.label}
              </p>
            </div>
            <div className="text-right">
              <p className="text-white/60 text-sm">Score de risque</p>
              <p className="text-4xl font-bold">{result.percentage}%</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="h-3 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${result.percentage}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="h-full rounded-full"
              style={{ backgroundColor: levelConfig.color }}
            />
          </div>
        </motion.div>

        {/* Concerned By */}
        {result.concernedBy.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/5 rounded-xl p-4 border border-white/10"
          >
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <span>📋</span> Vous êtes concerné par
            </h3>
            <div className="space-y-2">
              {result.concernedBy.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: moduleColor }} />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Recommendations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/5 rounded-xl p-4 border border-white/10"
        >
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <span>🎯</span> Recommandations prioritaires
          </h3>
          <div className="space-y-3">
            {result.recommendations.map((rec, idx) => (
              <div key={idx} className="flex items-start gap-3 p-3 bg-white/5 rounded-lg">
                <span className="text-lg">{idx + 1}.</span>
                <p className="text-sm text-white/80">{rec}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Company Info Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/5 rounded-xl p-4 border border-white/10"
        >
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <span>🏢</span> Profil enregistré
          </h3>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="p-2 bg-white/5 rounded-lg">
              <p className="text-white/40 text-xs">Entreprise</p>
              <p className="font-medium">{answers.company_name || 'Non renseigné'}</p>
            </div>
            <div className="p-2 bg-white/5 rounded-lg">
              <p className="text-white/40 text-xs">Secteur</p>
              <p className="font-medium">{DIAGNOSTIC_SECTIONS[0].questions[1].options?.find(o => o.value === answers.sector)?.label.split(' ').slice(1).join(' ') || 'Non renseigné'}</p>
            </div>
            <div className="p-2 bg-white/5 rounded-lg">
              <p className="text-white/40 text-xs">Taille</p>
              <p className="font-medium">{DIAGNOSTIC_SECTIONS[0].questions[2].options?.find(o => o.value === answers.company_size)?.label || 'Non renseigné'}</p>
            </div>
            <div className="p-2 bg-white/5 rounded-lg">
              <p className="text-white/40 text-xs">Systèmes IA</p>
              <p className="font-medium">{answers.ai_types?.length || 0} type(s)</p>
            </div>
          </div>
        </motion.div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={resetDiagnostic}
            className="flex-1 py-3 rounded-xl bg-white/10 font-semibold text-sm hover:bg-white/20 transition-colors"
          >
            Refaire le diagnostic
          </button>
          <button
            onClick={() => {
              onComplete();
            }}
            className="flex-1 py-3 rounded-xl font-bold text-black text-sm"
            style={{ backgroundColor: moduleColor }}
          >
            Continuer la formation →
          </button>
        </div>

        {/* Download CTA */}
        <div className="text-center pt-4 border-t border-white/10">
          <p className="text-white/40 text-xs mb-2">Ces données seront utilisées dans les prochains exercices</p>
          <a
            href="/resources/01-checklist-urgence.xlsx"
            download
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-sm transition-colors"
          >
            <span>📥</span> Télécharger la checklist complète (Excel)
          </a>
        </div>
      </div>
    );
  }

  // Questions View
  return (
    <div className="space-y-6">
      {/* Progress Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{currentSectionData.icon}</span>
          <div>
            <p className="text-white/40 text-xs">Section {currentSection + 1}/{totalSections}</p>
            <h2 className="text-lg font-bold">{currentSectionData.title}</h2>
          </div>
        </div>
        <div className="text-right">
          <p className="text-white/40 text-xs">Progression</p>
          <p className="font-bold">{Math.round(((currentSection) / totalSections) * 100)}%</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: moduleColor }}
          animate={{ width: `${((currentSection + 1) / totalSections) * 100}%` }}
        />
      </div>

      {/* Questions */}
      <div className="space-y-6">
        {currentSectionData.questions.map((q, idx) => (
          <motion.div
            key={q.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white/5 rounded-xl p-4 border border-white/10"
          >
            <label className="block mb-3">
              <span className="font-medium text-sm">{q.question}</span>
              {q.required && <span className="text-red-400 ml-1">*</span>}
              {q.helpText && (
                <p className="text-white/40 text-xs mt-1">{q.helpText}</p>
              )}
            </label>

            {/* Text Input */}
            {q.type === 'text' && (
              <input
                type="text"
                value={answers[q.id] || ''}
                onChange={(e) => handleAnswer(q.id, e.target.value)}
                placeholder={q.placeholder}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:border-[#00F5FF] focus:outline-none transition-colors"
              />
            )}

            {/* Select */}
            {q.type === 'select' && (
              <div className="space-y-2">
                {q.options?.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => handleAnswer(q.id, opt.value)}
                    className={`w-full p-3 rounded-xl text-left text-sm transition-all flex items-center gap-3 ${
                      answers[q.id] === opt.value
                        ? 'bg-white/10 border-2'
                        : 'bg-white/5 border-2 border-transparent hover:bg-white/10'
                    }`}
                    style={answers[q.id] === opt.value ? { borderColor: moduleColor } : {}}
                  >
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      answers[q.id] === opt.value ? 'border-current' : 'border-white/30'
                    }`} style={answers[q.id] === opt.value ? { borderColor: moduleColor } : {}}>
                      {answers[q.id] === opt.value && (
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: moduleColor }} />
                      )}
                    </div>
                    <span>{opt.label}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Multiselect */}
            {q.type === 'multiselect' && (
              <div className="space-y-2">
                {q.options?.map(opt => {
                  const isSelected = (answers[q.id] || []).includes(opt.value);
                  return (
                    <button
                      key={opt.value}
                      onClick={() => handleMultiSelect(q.id, opt.value)}
                      className={`w-full p-3 rounded-xl text-left text-sm transition-all flex items-center gap-3 ${
                        isSelected
                          ? 'bg-white/10 border-2'
                          : 'bg-white/5 border-2 border-transparent hover:bg-white/10'
                      }`}
                      style={isSelected ? { borderColor: moduleColor } : {}}
                    >
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                        isSelected ? 'border-current' : 'border-white/30'
                      }`} style={isSelected ? { borderColor: moduleColor, backgroundColor: moduleColor } : {}}>
                        {isSelected && (
                          <svg className="w-3 h-3 text-black" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        )}
                      </div>
                      <span>{opt.label}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Navigation */}
      <div className="flex gap-3 pt-4">
        {currentSection > 0 && (
          <button
            onClick={() => setCurrentSection(currentSection - 1)}
            className="px-6 py-3 rounded-xl bg-white/10 font-semibold text-sm hover:bg-white/20 transition-colors"
          >
            ← Précédent
          </button>
        )}
        
        {currentSection < totalSections - 1 ? (
          <button
            onClick={() => setCurrentSection(currentSection + 1)}
            disabled={!isSectionComplete()}
            className={`flex-1 py-3 rounded-xl font-bold text-sm transition-colors ${
              isSectionComplete()
                ? 'text-black'
                : 'bg-white/10 text-white/30 cursor-not-allowed'
            }`}
            style={isSectionComplete() ? { backgroundColor: moduleColor } : {}}
          >
            Suivant →
          </button>
        ) : (
          <button
            onClick={calculateResults}
            disabled={!isSectionComplete()}
            className={`flex-1 py-3 rounded-xl font-bold text-sm transition-colors ${
              isSectionComplete()
                ? 'text-black'
                : 'bg-white/10 text-white/30 cursor-not-allowed'
            }`}
            style={isSectionComplete() ? { backgroundColor: moduleColor } : {}}
          >
            Voir les résultats 🎯
          </button>
        )}
      </div>
    </div>
  );
}
