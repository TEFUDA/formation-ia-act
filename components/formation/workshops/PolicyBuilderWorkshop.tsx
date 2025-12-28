'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// ============================================
// TYPES
// ============================================
interface PolicySection {
  id: string;
  title: string;
  icon: string;
  questions: PolicyQuestion[];
}

interface PolicyQuestion {
  id: string;
  question: string;
  type: 'text' | 'textarea' | 'select' | 'multiselect' | 'toggle';
  placeholder?: string;
  options?: { value: string; label: string }[];
  helpText?: string;
  required?: boolean;
}

interface PolicyData {
  answers: Record<string, any>;
  generatedAt?: string;
  version: number;
}

// ============================================
// POLICY SECTIONS
// ============================================
const POLICY_SECTIONS: PolicySection[] = [
  {
    id: 'general',
    title: 'Informations générales',
    icon: '🏢',
    questions: [
      {
        id: 'company_name',
        question: 'Nom de l\'entreprise',
        type: 'text',
        placeholder: 'Votre entreprise',
        required: true,
      },
      {
        id: 'policy_date',
        question: 'Date d\'entrée en vigueur',
        type: 'text',
        placeholder: 'Ex: 1er janvier 2025',
        required: true,
      },
      {
        id: 'policy_owner',
        question: 'Responsable de la politique',
        type: 'text',
        placeholder: 'Nom et fonction',
        required: true,
      },
      {
        id: 'contact_email',
        question: 'Email de contact IA',
        type: 'text',
        placeholder: 'ia@entreprise.com',
      },
    ],
  },
  {
    id: 'scope',
    title: 'Périmètre d\'application',
    icon: '🎯',
    questions: [
      {
        id: 'scope_entities',
        question: 'Entités concernées',
        type: 'multiselect',
        options: [
          { value: 'hq', label: 'Siège social' },
          { value: 'subsidiaries', label: 'Filiales' },
          { value: 'branches', label: 'Succursales' },
          { value: 'partners', label: 'Partenaires' },
          { value: 'contractors', label: 'Sous-traitants' },
        ],
      },
      {
        id: 'scope_users',
        question: 'Personnes concernées',
        type: 'multiselect',
        options: [
          { value: 'employees', label: 'Tous les employés' },
          { value: 'managers', label: 'Managers' },
          { value: 'it', label: 'Équipes IT' },
          { value: 'data', label: 'Data Scientists / Analystes' },
          { value: 'external', label: 'Prestataires externes' },
        ],
      },
      {
        id: 'ai_definition',
        question: 'Définition de l\'IA adoptée',
        type: 'select',
        options: [
          { value: 'ai_act', label: 'Définition AI Act (Art. 3)' },
          { value: 'broad', label: 'Définition large (tout algorithme d\'apprentissage)' },
          { value: 'narrow', label: 'Définition restrictive (ML/DL uniquement)' },
          { value: 'custom', label: 'Définition personnalisée' },
        ],
      },
    ],
  },
  {
    id: 'principles',
    title: 'Principes directeurs',
    icon: '⚖️',
    questions: [
      {
        id: 'principles_adopted',
        question: 'Principes éthiques adoptés',
        type: 'multiselect',
        helpText: 'Sélectionnez les principes que votre entreprise s\'engage à respecter',
        options: [
          { value: 'transparency', label: '🔍 Transparence' },
          { value: 'fairness', label: '⚖️ Équité et non-discrimination' },
          { value: 'accountability', label: '📋 Responsabilité' },
          { value: 'privacy', label: '🔒 Protection de la vie privée' },
          { value: 'security', label: '🛡️ Sécurité' },
          { value: 'human_oversight', label: '👁️ Supervision humaine' },
          { value: 'sustainability', label: '🌱 Durabilité environnementale' },
          { value: 'inclusivity', label: '🤝 Inclusivité' },
        ],
      },
      {
        id: 'human_oversight_level',
        question: 'Niveau de supervision humaine',
        type: 'select',
        options: [
          { value: 'human_in_loop', label: 'Human-in-the-loop (validation humaine systématique)' },
          { value: 'human_on_loop', label: 'Human-on-the-loop (supervision avec possibilité d\'intervention)' },
          { value: 'human_in_command', label: 'Human-in-command (contrôle stratégique)' },
          { value: 'mixed', label: 'Approche mixte selon le risque' },
        ],
      },
    ],
  },
  {
    id: 'governance',
    title: 'Gouvernance',
    icon: '🏛️',
    questions: [
      {
        id: 'governance_structure',
        question: 'Structure de gouvernance IA',
        type: 'select',
        options: [
          { value: 'committee', label: 'Comité IA dédié' },
          { value: 'ciso', label: 'Rattachement au CISO' },
          { value: 'dpo', label: 'Rattachement au DPO' },
          { value: 'cto', label: 'Rattachement au CTO' },
          { value: 'ceo', label: 'Rattachement direct à la direction' },
          { value: 'distributed', label: 'Gouvernance distribuée' },
        ],
      },
      {
        id: 'ai_officer',
        question: 'Responsable IA désigné',
        type: 'text',
        placeholder: 'Nom et fonction',
      },
      {
        id: 'review_frequency',
        question: 'Fréquence de revue de la politique',
        type: 'select',
        options: [
          { value: 'quarterly', label: 'Trimestrielle' },
          { value: 'biannual', label: 'Semestrielle' },
          { value: 'annual', label: 'Annuelle' },
          { value: 'continuous', label: 'Continue (à chaque changement majeur)' },
        ],
      },
    ],
  },
  {
    id: 'usage_rules',
    title: 'Règles d\'utilisation',
    icon: '📋',
    questions: [
      {
        id: 'approved_tools',
        question: 'Outils IA approuvés',
        type: 'textarea',
        placeholder: 'Liste des outils IA autorisés dans l\'entreprise...',
        helpText: 'Ex: ChatGPT Enterprise, Microsoft Copilot, outils internes...',
      },
      {
        id: 'prohibited_uses',
        question: 'Usages interdits',
        type: 'multiselect',
        options: [
          { value: 'personal_data', label: 'Traitement de données personnelles sensibles' },
          { value: 'hiring', label: 'Décisions d\'embauche automatisées' },
          { value: 'surveillance', label: 'Surveillance des employés' },
          { value: 'confidential', label: 'Saisie d\'informations confidentielles' },
          { value: 'customer_facing', label: 'Réponses automatiques aux clients (sans validation)' },
          { value: 'legal', label: 'Conseils juridiques automatisés' },
          { value: 'financial', label: 'Décisions financières sans supervision' },
        ],
      },
      {
        id: 'validation_required',
        question: 'Validation requise avant utilisation',
        type: 'select',
        options: [
          { value: 'all', label: 'Pour tout nouvel outil IA' },
          { value: 'high_risk', label: 'Uniquement pour les systèmes à haut risque' },
          { value: 'external', label: 'Uniquement pour les outils externes' },
          { value: 'data', label: 'Si traitement de données personnelles' },
          { value: 'none', label: 'Pas de validation préalable requise' },
        ],
      },
    ],
  },
  {
    id: 'data',
    title: 'Gestion des données',
    icon: '🔐',
    questions: [
      {
        id: 'data_principles',
        question: 'Principes de gestion des données',
        type: 'multiselect',
        options: [
          { value: 'minimization', label: 'Minimisation des données' },
          { value: 'anonymization', label: 'Anonymisation par défaut' },
          { value: 'encryption', label: 'Chiffrement obligatoire' },
          { value: 'retention', label: 'Durée de conservation limitée' },
          { value: 'access', label: 'Contrôle d\'accès strict' },
          { value: 'audit', label: 'Traçabilité des accès' },
        ],
      },
      {
        id: 'external_tools_data',
        question: 'Données autorisées sur les outils IA externes',
        type: 'multiselect',
        options: [
          { value: 'public', label: 'Données publiques uniquement' },
          { value: 'internal', label: 'Données internes non sensibles' },
          { value: 'pseudonymized', label: 'Données pseudonymisées' },
          { value: 'none', label: 'Aucune donnée d\'entreprise' },
        ],
      },
    ],
  },
  {
    id: 'training',
    title: 'Formation et sensibilisation',
    icon: '🎓',
    questions: [
      {
        id: 'training_mandatory',
        question: 'Formation IA obligatoire',
        type: 'toggle',
      },
      {
        id: 'training_frequency',
        question: 'Fréquence des formations',
        type: 'select',
        options: [
          { value: 'onboarding', label: 'À l\'embauche uniquement' },
          { value: 'annual', label: 'Annuelle' },
          { value: 'biannual', label: 'Semestrielle' },
          { value: 'continuous', label: 'Continue (e-learning)' },
        ],
      },
      {
        id: 'training_topics',
        question: 'Thèmes de formation',
        type: 'multiselect',
        options: [
          { value: 'basics', label: 'Fondamentaux de l\'IA' },
          { value: 'ethics', label: 'Éthique de l\'IA' },
          { value: 'ai_act', label: 'Règlement AI Act' },
          { value: 'security', label: 'Sécurité et confidentialité' },
          { value: 'tools', label: 'Utilisation des outils approuvés' },
          { value: 'risks', label: 'Identification des risques' },
        ],
      },
    ],
  },
  {
    id: 'incidents',
    title: 'Gestion des incidents',
    icon: '🚨',
    questions: [
      {
        id: 'incident_procedure',
        question: 'Procédure de signalement',
        type: 'textarea',
        placeholder: 'Décrivez la procédure de signalement des incidents IA...',
      },
      {
        id: 'incident_contact',
        question: 'Contact incident IA',
        type: 'text',
        placeholder: 'Email ou numéro de téléphone',
      },
      {
        id: 'incident_types',
        question: 'Types d\'incidents à signaler',
        type: 'multiselect',
        options: [
          { value: 'bias', label: 'Discrimination / Biais détecté' },
          { value: 'error', label: 'Erreur majeure du système' },
          { value: 'breach', label: 'Fuite de données' },
          { value: 'misuse', label: 'Usage non autorisé' },
          { value: 'failure', label: 'Défaillance système' },
          { value: 'compliance', label: 'Non-conformité réglementaire' },
        ],
      },
    ],
  },
];

// ============================================
// COMPONENT
// ============================================
interface PolicyBuilderWorkshopProps {
  moduleColor: string;
  onComplete: () => void;
}

export default function PolicyBuilderWorkshop({ moduleColor, onComplete }: PolicyBuilderWorkshopProps) {
  const [currentSection, setCurrentSection] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [viewMode, setViewMode] = useState<'edit' | 'preview' | 'export'>('edit');

  // Load saved data
  useEffect(() => {
    const saved = localStorage.getItem('workshop_policy');
    if (saved) {
      try {
        const data: PolicyData = JSON.parse(saved);
        setAnswers(data.answers || {});
      } catch (e) {
        console.error('Error loading policy:', e);
      }
    }

    // Load company profile
    const savedProfile = localStorage.getItem('workshop_company_profile');
    if (savedProfile && !answers.company_name) {
      try {
        const profile = JSON.parse(savedProfile);
        if (profile.name) {
          setAnswers(prev => ({ ...prev, company_name: profile.name }));
        }
      } catch (e) {
        console.error('Error loading profile:', e);
      }
    }
  }, []);

  // Save data
  useEffect(() => {
    if (Object.keys(answers).length > 0) {
      const data: PolicyData = {
        answers,
        generatedAt: new Date().toISOString(),
        version: 1,
      };
      localStorage.setItem('workshop_policy', JSON.stringify(data));
    }
  }, [answers]);

  const handleAnswer = (questionId: string, value: any) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleMultiSelect = (questionId: string, value: string) => {
    const current = answers[questionId] || [];
    if (current.includes(value)) {
      setAnswers(prev => ({ ...prev, [questionId]: current.filter((v: string) => v !== value) }));
    } else {
      setAnswers(prev => ({ ...prev, [questionId]: [...current, value] }));
    }
  };

  const currentSectionData = POLICY_SECTIONS[currentSection];
  const completedSections = POLICY_SECTIONS.filter(section => 
    section.questions.some(q => answers[q.id])
  ).length;

  const generatePolicyText = () => {
    const companyName = answers.company_name || '[Nom de l\'entreprise]';
    const policyDate = answers.policy_date || '[Date]';
    const policyOwner = answers.policy_owner || '[Responsable]';

    const getPrincipleText = (principles: string[]) => {
      const texts: Record<string, string> = {
        transparency: 'Transparence : Nous nous engageons à être transparents sur notre utilisation de l\'IA.',
        fairness: 'Équité : Nos systèmes IA sont conçus pour éviter toute discrimination.',
        accountability: 'Responsabilité : Nous assumons la responsabilité des décisions prises avec l\'aide de l\'IA.',
        privacy: 'Vie privée : La protection des données personnelles est une priorité.',
        security: 'Sécurité : Nos systèmes IA sont sécurisés contre les menaces.',
        human_oversight: 'Supervision humaine : Un contrôle humain est maintenu sur tous les systèmes critiques.',
        sustainability: 'Durabilité : Nous considérons l\'impact environnemental de nos usages IA.',
        inclusivity: 'Inclusivité : Nos systèmes sont conçus pour être accessibles à tous.',
      };
      return principles?.map(p => texts[p]).filter(Boolean).join('\n• ') || '';
    };

    return `
═══════════════════════════════════════════════════════════════
              POLITIQUE D'UTILISATION DE L'INTELLIGENCE ARTIFICIELLE
                          ${companyName.toUpperCase()}
═══════════════════════════════════════════════════════════════

Version : 1.0
Date d'entrée en vigueur : ${policyDate}
Responsable : ${policyOwner}
Contact : ${answers.contact_email || '[Email]'}

───────────────────────────────────────────────────────────────
1. OBJET ET CHAMP D'APPLICATION
───────────────────────────────────────────────────────────────

La présente politique définit les règles et principes régissant l'utilisation 
des systèmes d'intelligence artificielle au sein de ${companyName}.

Entités concernées :
${(answers.scope_entities || []).map((e: string) => `• ${e}`).join('\n') || '• Toutes les entités du groupe'}

Personnes concernées :
${(answers.scope_users || []).map((e: string) => `• ${e}`).join('\n') || '• Tous les collaborateurs'}

───────────────────────────────────────────────────────────────
2. PRINCIPES DIRECTEURS
───────────────────────────────────────────────────────────────

${companyName} s'engage à respecter les principes suivants dans son utilisation de l'IA :

• ${getPrincipleText(answers.principles_adopted) || 'Transparence, équité, responsabilité, protection de la vie privée'}

Niveau de supervision humaine : ${answers.human_oversight_level === 'human_in_loop' ? 'Validation humaine systématique' : 
  answers.human_oversight_level === 'human_on_loop' ? 'Supervision avec possibilité d\'intervention' :
  answers.human_oversight_level === 'human_in_command' ? 'Contrôle stratégique' : 'Approche mixte selon le risque'}

───────────────────────────────────────────────────────────────
3. GOUVERNANCE
───────────────────────────────────────────────────────────────

Structure de gouvernance : ${answers.governance_structure || 'Comité IA dédié'}
Responsable IA : ${answers.ai_officer || '[À désigner]'}
Fréquence de revue : ${answers.review_frequency === 'quarterly' ? 'Trimestrielle' :
  answers.review_frequency === 'biannual' ? 'Semestrielle' :
  answers.review_frequency === 'annual' ? 'Annuelle' : 'Continue'}

───────────────────────────────────────────────────────────────
4. RÈGLES D'UTILISATION
───────────────────────────────────────────────────────────────

4.1 Outils IA approuvés
${answers.approved_tools || 'La liste des outils approuvés est maintenue par le responsable IA.'}

4.2 Usages interdits
Les usages suivants sont strictement interdits :
${(answers.prohibited_uses || []).map((u: string) => `• ${u}`).join('\n') || '• Usages contraires à l\'éthique et à la réglementation'}

4.3 Procédure de validation
${answers.validation_required === 'all' ? 'Tout nouvel outil IA doit être validé avant utilisation.' :
  answers.validation_required === 'high_risk' ? 'Les systèmes à haut risque nécessitent une validation préalable.' :
  'Une validation est requise selon les cas.'}

───────────────────────────────────────────────────────────────
5. GESTION DES DONNÉES
───────────────────────────────────────────────────────────────

Principes appliqués :
${(answers.data_principles || []).map((p: string) => `• ${p}`).join('\n') || '• Minimisation et protection des données'}

Données autorisées sur les outils externes :
${(answers.external_tools_data || ['public']).map((d: string) => `• ${d}`).join('\n')}

───────────────────────────────────────────────────────────────
6. FORMATION ET SENSIBILISATION
───────────────────────────────────────────────────────────────

Formation obligatoire : ${answers.training_mandatory ? 'Oui' : 'Non'}
Fréquence : ${answers.training_frequency || 'Annuelle'}

Thèmes couverts :
${(answers.training_topics || []).map((t: string) => `• ${t}`).join('\n') || '• Fondamentaux de l\'IA et réglementation'}

───────────────────────────────────────────────────────────────
7. GESTION DES INCIDENTS
───────────────────────────────────────────────────────────────

Contact incident : ${answers.incident_contact || '[À définir]'}

Incidents à signaler :
${(answers.incident_types || []).map((i: string) => `• ${i}`).join('\n') || '• Tout incident lié à l\'IA'}

Procédure :
${answers.incident_procedure || 'Signaler immédiatement au responsable IA via l\'adresse dédiée.'}

───────────────────────────────────────────────────────────────
8. CONFORMITÉ RÉGLEMENTAIRE
───────────────────────────────────────────────────────────────

Cette politique s'inscrit dans le cadre du Règlement européen sur l'Intelligence 
Artificielle (AI Act - Règlement UE 2024/1689) et du RGPD.

${companyName} s'engage à :
• Maintenir un registre des systèmes IA utilisés
• Classifier ses systèmes selon les niveaux de risque AI Act
• Respecter les obligations applicables à chaque catégorie
• Coopérer avec les autorités de contrôle

───────────────────────────────────────────────────────────────

Document approuvé par : ${policyOwner}
Date : ${policyDate}

═══════════════════════════════════════════════════════════════
`;
  };

  const downloadPolicy = () => {
    const text = generatePolicyText();
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `politique-ia-${answers.company_name || 'entreprise'}.txt`;
    a.click();
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatePolicyText());
    alert('Politique copiée !');
  };

  // Preview Mode
  if (viewMode === 'preview') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">📄 Prévisualisation</h2>
          <button
            onClick={() => setViewMode('edit')}
            className="text-sm text-white/60 hover:text-white"
          >
            ← Modifier
          </button>
        </div>

        <div className="bg-white/5 rounded-xl p-4 border border-white/10 max-h-96 overflow-y-auto">
          <pre className="text-xs text-white/80 whitespace-pre-wrap font-mono leading-relaxed">
            {generatePolicyText()}
          </pre>
        </div>

        <div className="flex gap-3">
          <button
            onClick={copyToClipboard}
            className="flex-1 py-3 rounded-xl bg-white/10 font-semibold text-sm hover:bg-white/20"
          >
            📋 Copier
          </button>
          <button
            onClick={downloadPolicy}
            className="flex-1 py-3 rounded-xl font-bold text-black text-sm"
            style={{ backgroundColor: moduleColor }}
          >
            📥 Télécharger
          </button>
        </div>

        <a
          href="/resources/07-politique-ia-template.docx"
          download
          className="block text-center text-sm text-white/60 hover:text-white"
        >
          📄 Télécharger le template Word complet
        </a>
      </div>
    );
  }

  // Edit Mode
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <span>📝</span> Générateur de Politique IA
          </h2>
          <p className="text-white/60 text-sm mt-1">
            Créez votre politique d'utilisation de l'IA
          </p>
        </div>
        {completedSections > 0 && (
          <button
            onClick={() => setViewMode('preview')}
            className="px-4 py-2 rounded-lg text-sm font-medium"
            style={{ backgroundColor: `${moduleColor}20`, color: moduleColor }}
          >
            👁️ Prévisualiser
          </button>
        )}
      </div>

      {/* Progress */}
      <div className="flex gap-1">
        {POLICY_SECTIONS.map((section, idx) => {
          const hasAnswers = section.questions.some(q => answers[q.id]);
          return (
            <button
              key={section.id}
              onClick={() => setCurrentSection(idx)}
              className={`flex-1 h-2 rounded-full transition-all ${
                idx === currentSection ? '' : hasAnswers ? 'opacity-60' : 'bg-white/10'
              }`}
              style={idx === currentSection || hasAnswers ? { backgroundColor: moduleColor } : {}}
              title={section.title}
            />
          );
        })}
      </div>

      {/* Section Header */}
      <div className="flex items-center gap-3 pb-2 border-b border-white/10">
        <span className="text-2xl">{currentSectionData.icon}</span>
        <div>
          <p className="text-white/40 text-xs">Section {currentSection + 1}/{POLICY_SECTIONS.length}</p>
          <h3 className="font-bold">{currentSectionData.title}</h3>
        </div>
      </div>

      {/* Questions */}
      <div className="space-y-4">
        {currentSectionData.questions.map(q => (
          <div key={q.id} className="bg-white/5 rounded-xl p-4 border border-white/10">
            <label className="block mb-2">
              <span className="font-medium text-sm">{q.question}</span>
              {q.required && <span className="text-red-400 ml-1">*</span>}
            </label>
            {q.helpText && <p className="text-white/40 text-xs mb-3">{q.helpText}</p>}

            {q.type === 'text' && (
              <input
                type="text"
                value={answers[q.id] || ''}
                onChange={(e) => handleAnswer(q.id, e.target.value)}
                placeholder={q.placeholder}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:border-[#00F5FF] focus:outline-none"
              />
            )}

            {q.type === 'textarea' && (
              <textarea
                value={answers[q.id] || ''}
                onChange={(e) => handleAnswer(q.id, e.target.value)}
                placeholder={q.placeholder}
                rows={3}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:border-[#00F5FF] focus:outline-none resize-none"
              />
            )}

            {q.type === 'select' && (
              <select
                value={answers[q.id] || ''}
                onChange={(e) => handleAnswer(q.id, e.target.value)}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:border-[#00F5FF] focus:outline-none"
              >
                <option value="">Sélectionner...</option>
                {q.options?.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            )}

            {q.type === 'multiselect' && (
              <div className="flex flex-wrap gap-2">
                {q.options?.map(opt => {
                  const isSelected = (answers[q.id] || []).includes(opt.value);
                  return (
                    <button
                      key={opt.value}
                      onClick={() => handleMultiSelect(q.id, opt.value)}
                      className={`px-3 py-1.5 rounded-lg text-xs transition-colors ${
                        isSelected ? 'text-black' : 'bg-white/10 hover:bg-white/20'
                      }`}
                      style={isSelected ? { backgroundColor: moduleColor } : {}}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            )}

            {q.type === 'toggle' && (
              <button
                onClick={() => handleAnswer(q.id, !answers[q.id])}
                className={`w-12 h-6 rounded-full transition-colors ${answers[q.id] ? '' : 'bg-white/20'}`}
                style={answers[q.id] ? { backgroundColor: moduleColor } : {}}
              >
                <div className={`w-5 h-5 rounded-full bg-white transition-transform ${answers[q.id] ? 'translate-x-6' : 'translate-x-0.5'}`} />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Navigation */}
      <div className="flex gap-3 pt-4 border-t border-white/10">
        {currentSection > 0 && (
          <button
            onClick={() => setCurrentSection(currentSection - 1)}
            className="px-4 py-3 rounded-xl bg-white/10 font-semibold text-sm hover:bg-white/20"
          >
            ← Précédent
          </button>
        )}
        
        {currentSection < POLICY_SECTIONS.length - 1 ? (
          <button
            onClick={() => setCurrentSection(currentSection + 1)}
            className="flex-1 py-3 rounded-xl font-bold text-black text-sm"
            style={{ backgroundColor: moduleColor }}
          >
            Suivant →
          </button>
        ) : (
          <button
            onClick={() => setViewMode('preview')}
            className="flex-1 py-3 rounded-xl font-bold text-black text-sm"
            style={{ backgroundColor: moduleColor }}
          >
            Générer la politique →
          </button>
        )}
      </div>
    </div>
  );
}
