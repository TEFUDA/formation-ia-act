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
  type: 'text' | 'textarea' | 'select' | 'multiselect' | 'boolean';
  options?: { value: string; label: string }[];
  placeholder?: string;
  helpText?: string;
  required?: boolean;
}

interface PolicyData {
  companyName: string;
  sector: string;
  effectiveDate: string;
  answers: Record<string, any>;
  generatedAt?: string;
}

// ============================================
// POLICY SECTIONS
// ============================================
const POLICY_SECTIONS: PolicySection[] = [
  {
    id: 'introduction',
    title: 'Introduction & Contexte',
    icon: '📋',
    questions: [
      {
        id: 'company_name',
        question: 'Nom de votre entreprise',
        type: 'text',
        placeholder: 'Ex: Acme Corp',
        required: true,
      },
      {
        id: 'company_description',
        question: 'Description courte de votre activité',
        type: 'textarea',
        placeholder: 'Ex: Entreprise spécialisée dans...',
        helpText: 'Décrivez en 2-3 phrases votre activité principale',
      },
      {
        id: 'policy_scope',
        question: 'Périmètre d\'application de cette politique',
        type: 'multiselect',
        options: [
          { value: 'all_employees', label: 'Tous les employés' },
          { value: 'contractors', label: 'Prestataires et sous-traitants' },
          { value: 'partners', label: 'Partenaires commerciaux' },
          { value: 'subsidiaries', label: 'Filiales' },
        ],
      },
      {
        id: 'effective_date',
        question: 'Date d\'entrée en vigueur',
        type: 'text',
        placeholder: 'Ex: 1er janvier 2025',
      },
    ],
  },
  {
    id: 'principles',
    title: 'Principes Directeurs',
    icon: '🎯',
    questions: [
      {
        id: 'core_principles',
        question: 'Quels principes guident votre utilisation de l\'IA ?',
        type: 'multiselect',
        options: [
          { value: 'transparency', label: '🔍 Transparence - Informer clairement sur l\'utilisation de l\'IA' },
          { value: 'fairness', label: '⚖️ Équité - Éviter les biais et discriminations' },
          { value: 'privacy', label: '🔒 Protection des données - Respecter la vie privée' },
          { value: 'accountability', label: '📋 Responsabilité - Assumer les décisions de l\'IA' },
          { value: 'security', label: '🛡️ Sécurité - Protéger les systèmes et données' },
          { value: 'human_oversight', label: '👁️ Supervision humaine - Garder le contrôle' },
          { value: 'sustainability', label: '🌱 Durabilité - Considérer l\'impact environnemental' },
        ],
        helpText: 'Sélectionnez les principes que vous souhaitez formaliser',
      },
      {
        id: 'ethical_commitment',
        question: 'Engagement éthique spécifique',
        type: 'textarea',
        placeholder: 'Ex: Nous nous engageons à ne jamais utiliser l\'IA pour...',
        helpText: 'Ajoutez des engagements spécifiques à votre secteur ou valeurs',
      },
    ],
  },
  {
    id: 'governance',
    title: 'Gouvernance & Responsabilités',
    icon: '🏛️',
    questions: [
      {
        id: 'ai_responsible',
        question: 'Qui est responsable de la conformité IA ?',
        type: 'text',
        placeholder: 'Ex: Directeur de la Conformité, DPO...',
        helpText: 'Nom ou fonction de la personne en charge',
      },
      {
        id: 'governance_structure',
        question: 'Quelle structure de gouvernance IA avez-vous ?',
        type: 'select',
        options: [
          { value: 'committee', label: 'Comité IA dédié' },
          { value: 'dpo_extended', label: 'Extension du rôle du DPO' },
          { value: 'ciso_extended', label: 'Extension du rôle du RSSI' },
          { value: 'cross_functional', label: 'Groupe de travail transverse' },
          { value: 'external', label: 'Accompagnement externe' },
          { value: 'none_yet', label: 'Pas encore définie' },
        ],
      },
      {
        id: 'review_frequency',
        question: 'Fréquence de révision de cette politique',
        type: 'select',
        options: [
          { value: 'quarterly', label: 'Trimestrielle' },
          { value: 'biannual', label: 'Semestrielle' },
          { value: 'annual', label: 'Annuelle' },
          { value: 'as_needed', label: 'Selon les évolutions réglementaires' },
        ],
      },
    ],
  },
  {
    id: 'usage_rules',
    title: 'Règles d\'Utilisation',
    icon: '📜',
    questions: [
      {
        id: 'approved_tools',
        question: 'Comment les outils IA sont-ils approuvés ?',
        type: 'multiselect',
        options: [
          { value: 'pre_approved_list', label: 'Liste d\'outils pré-approuvés' },
          { value: 'request_process', label: 'Processus de demande formelle' },
          { value: 'risk_assessment', label: 'Évaluation des risques obligatoire' },
          { value: 'manager_approval', label: 'Approbation du manager' },
          { value: 'security_review', label: 'Revue de sécurité' },
        ],
      },
      {
        id: 'prohibited_uses',
        question: 'Utilisations interdites de l\'IA',
        type: 'multiselect',
        options: [
          { value: 'personal_data_unauthorized', label: 'Traitement de données personnelles non autorisé' },
          { value: 'automated_decisions', label: 'Décisions automatisées sans supervision' },
          { value: 'confidential_data', label: 'Saisie de données confidentielles dans outils publics' },
          { value: 'discrimination', label: 'Usages discriminatoires' },
          { value: 'surveillance', label: 'Surveillance des employés' },
          { value: 'deepfakes', label: 'Création de deepfakes' },
          { value: 'manipulation', label: 'Manipulation psychologique' },
        ],
      },
      {
        id: 'data_rules',
        question: 'Règles concernant les données',
        type: 'multiselect',
        options: [
          { value: 'no_personal', label: 'Ne pas saisir de données personnelles' },
          { value: 'no_confidential', label: 'Ne pas saisir de données confidentielles' },
          { value: 'anonymize', label: 'Anonymiser avant utilisation' },
          { value: 'local_only', label: 'Utiliser uniquement des outils hébergés localement' },
          { value: 'gdpr_compliant', label: 'Vérifier la conformité RGPD' },
        ],
      },
    ],
  },
  {
    id: 'transparency',
    title: 'Transparence & Information',
    icon: '🔍',
    questions: [
      {
        id: 'disclosure_rules',
        question: 'Quand l\'utilisation de l\'IA doit-elle être divulguée ?',
        type: 'multiselect',
        options: [
          { value: 'customer_interaction', label: 'Interactions avec les clients (chatbots...)' },
          { value: 'content_generation', label: 'Contenu généré par IA (textes, images...)' },
          { value: 'decision_support', label: 'Aide à la décision' },
          { value: 'automated_process', label: 'Processus automatisés' },
          { value: 'always', label: 'Toujours, systématiquement' },
        ],
      },
      {
        id: 'labeling_method',
        question: 'Comment le contenu IA est-il identifié ?',
        type: 'multiselect',
        options: [
          { value: 'mention', label: 'Mention textuelle (ex: "Généré avec l\'aide de l\'IA")' },
          { value: 'watermark', label: 'Watermark ou filigrane' },
          { value: 'metadata', label: 'Métadonnées techniques' },
          { value: 'footer', label: 'Mention en bas de page/email' },
        ],
      },
    ],
  },
  {
    id: 'training',
    title: 'Formation & Sensibilisation',
    icon: '🎓',
    questions: [
      {
        id: 'training_mandatory',
        question: 'La formation IA est-elle obligatoire ?',
        type: 'select',
        options: [
          { value: 'all', label: 'Oui, pour tous les employés' },
          { value: 'users', label: 'Oui, pour les utilisateurs d\'IA' },
          { value: 'managers', label: 'Oui, pour les managers' },
          { value: 'optional', label: 'Non, optionnelle' },
        ],
      },
      {
        id: 'training_topics',
        question: 'Sujets couverts par la formation',
        type: 'multiselect',
        options: [
          { value: 'ai_basics', label: 'Bases de l\'IA et fonctionnement' },
          { value: 'ai_act', label: 'Réglementation AI Act' },
          { value: 'risks', label: 'Risques et limites de l\'IA' },
          { value: 'best_practices', label: 'Bonnes pratiques d\'utilisation' },
          { value: 'security', label: 'Sécurité et confidentialité' },
          { value: 'ethics', label: 'Éthique de l\'IA' },
        ],
      },
    ],
  },
  {
    id: 'incidents',
    title: 'Gestion des Incidents',
    icon: '🚨',
    questions: [
      {
        id: 'incident_types',
        question: 'Types d\'incidents à signaler',
        type: 'multiselect',
        options: [
          { value: 'data_breach', label: 'Fuite de données' },
          { value: 'bias_discrimination', label: 'Biais ou discrimination détectée' },
          { value: 'wrong_decision', label: 'Décision erronée impactante' },
          { value: 'security_breach', label: 'Faille de sécurité' },
          { value: 'misuse', label: 'Utilisation non conforme' },
          { value: 'hallucination', label: 'Génération d\'informations fausses' },
        ],
      },
      {
        id: 'incident_contact',
        question: 'Contact pour signaler un incident',
        type: 'text',
        placeholder: 'Ex: incident-ia@entreprise.com',
      },
      {
        id: 'incident_delay',
        question: 'Délai de signalement',
        type: 'select',
        options: [
          { value: 'immediate', label: 'Immédiat' },
          { value: '24h', label: 'Sous 24 heures' },
          { value: '48h', label: 'Sous 48 heures' },
          { value: '72h', label: 'Sous 72 heures' },
        ],
      },
    ],
  },
];

// ============================================
// COMPONENT
// ============================================
interface PolicyGeneratorWorkshopProps {
  moduleColor: string;
  onComplete: () => void;
}

export default function PolicyGeneratorWorkshop({ moduleColor, onComplete }: PolicyGeneratorWorkshopProps) {
  const [currentSection, setCurrentSection] = useState(0);
  const [policyData, setPolicyData] = useState<PolicyData>({
    companyName: '',
    sector: '',
    effectiveDate: '',
    answers: {},
  });
  const [viewMode, setViewMode] = useState<'edit' | 'preview' | 'export'>('edit');

  // Load saved data
  useEffect(() => {
    const savedPolicy = localStorage.getItem('workshop_policy_data');
    if (savedPolicy) {
      try {
        setPolicyData(JSON.parse(savedPolicy));
      } catch (e) {
        console.error('Error loading policy:', e);
      }
    }

    // Load company profile
    const savedProfile = localStorage.getItem('workshop_company_profile');
    if (savedProfile) {
      try {
        const profile = JSON.parse(savedProfile);
        if (profile.name && !policyData.companyName) {
          setPolicyData(prev => ({ 
            ...prev, 
            companyName: profile.name,
            sector: profile.sector,
            answers: { ...prev.answers, company_name: profile.name }
          }));
        }
      } catch (e) {
        console.error('Error loading profile:', e);
      }
    }
  }, []);

  // Save data
  useEffect(() => {
    localStorage.setItem('workshop_policy_data', JSON.stringify(policyData));
  }, [policyData]);

  const updateAnswer = (questionId: string, value: any) => {
    setPolicyData(prev => ({
      ...prev,
      answers: { ...prev.answers, [questionId]: value }
    }));
  };

  const toggleMultiSelect = (questionId: string, value: string) => {
    const current = policyData.answers[questionId] || [];
    const updated = current.includes(value)
      ? current.filter((v: string) => v !== value)
      : [...current, value];
    updateAnswer(questionId, updated);
  };

  const currentSectionData = POLICY_SECTIONS[currentSection];
  const totalSections = POLICY_SECTIONS.length;

  const getSectionProgress = (sectionId: string) => {
    const section = POLICY_SECTIONS.find(s => s.id === sectionId);
    if (!section) return 0;
    
    const answered = section.questions.filter(q => {
      const answer = policyData.answers[q.id];
      if (Array.isArray(answer)) return answer.length > 0;
      return answer !== undefined && answer !== '';
    }).length;
    
    return Math.round((answered / section.questions.length) * 100);
  };

  const getTotalProgress = () => {
    const totalQuestions = POLICY_SECTIONS.reduce((sum, s) => sum + s.questions.length, 0);
    const answered = POLICY_SECTIONS.reduce((sum, s) => {
      return sum + s.questions.filter(q => {
        const answer = policyData.answers[q.id];
        if (Array.isArray(answer)) return answer.length > 0;
        return answer !== undefined && answer !== '';
      }).length;
    }, 0);
    return Math.round((answered / totalQuestions) * 100);
  };

  const generatePolicyText = () => {
    const a = policyData.answers;
    const companyName = a.company_name || '[Nom de l\'entreprise]';
    
    let policy = `# POLITIQUE D'UTILISATION DE L'INTELLIGENCE ARTIFICIELLE

## ${companyName}

**Date d'entrée en vigueur :** ${a.effective_date || '[Date]'}
**Version :** 1.0
**Dernière mise à jour :** ${new Date().toLocaleDateString('fr-FR')}

---

## 1. INTRODUCTION ET OBJET

### 1.1 Contexte
${a.company_description || '[Description de l\'entreprise]'}

Dans le cadre du Règlement européen sur l'Intelligence Artificielle (AI Act - Règlement UE 2024/1689), ${companyName} établit la présente politique pour encadrer l'utilisation des systèmes d'intelligence artificielle au sein de l'organisation.

### 1.2 Champ d'application
Cette politique s'applique à :
${(a.policy_scope || []).map((s: string) => {
  const labels: Record<string, string> = {
    all_employees: '- Tous les employés de l\'entreprise',
    contractors: '- Les prestataires et sous-traitants',
    partners: '- Les partenaires commerciaux',
    subsidiaries: '- Les filiales du groupe',
  };
  return labels[s] || '';
}).filter(Boolean).join('\n')}

---

## 2. PRINCIPES DIRECTEURS

${companyName} s'engage à respecter les principes suivants dans son utilisation de l'IA :

${(a.core_principles || []).map((p: string) => {
  const principles: Record<string, string> = {
    transparency: '### 2.1 Transparence\nNous nous engageons à informer clairement les parties prenantes lorsque l\'IA est utilisée dans nos processus ou interactions.',
    fairness: '### 2.2 Équité\nNous veillons à ce que nos systèmes d\'IA ne génèrent pas de biais discriminatoires et traitent tous les individus de manière équitable.',
    privacy: '### 2.3 Protection des données\nNous respectons la vie privée et assurons la protection des données personnelles conformément au RGPD.',
    accountability: '### 2.4 Responsabilité\nNous assumons la responsabilité des décisions prises avec l\'aide de l\'IA et maintenons une supervision humaine appropriée.',
    security: '### 2.5 Sécurité\nNous mettons en œuvre des mesures de sécurité robustes pour protéger nos systèmes d\'IA et les données qu\'ils traitent.',
    human_oversight: '### 2.6 Supervision humaine\nTout système d\'IA critique est soumis à une supervision humaine, et les décisions importantes restent sous contrôle humain.',
    sustainability: '### 2.7 Durabilité\nNous prenons en compte l\'impact environnemental de nos systèmes d\'IA et cherchons à minimiser notre empreinte.',
  };
  return principles[p] || '';
}).filter(Boolean).join('\n\n')}

${a.ethical_commitment ? `### 2.8 Engagements spécifiques\n${a.ethical_commitment}` : ''}

---

## 3. GOUVERNANCE

### 3.1 Responsable IA
${a.ai_responsible || '[À définir]'} est désigné(e) comme responsable de la conformité IA au sein de ${companyName}.

### 3.2 Structure de gouvernance
${(() => {
  const structures: Record<string, string> = {
    committee: 'Un Comité IA dédié est mis en place pour superviser l\'ensemble des initiatives IA.',
    dpo_extended: 'Le Délégué à la Protection des Données (DPO) voit son rôle étendu à la gouvernance IA.',
    ciso_extended: 'Le Responsable de la Sécurité des Systèmes d\'Information (RSSI) supervise également la sécurité des systèmes IA.',
    cross_functional: 'Un groupe de travail transverse réunit les parties prenantes clés pour la gouvernance IA.',
    external: 'Un accompagnement externe assure le suivi de notre conformité IA.',
    none_yet: 'La structure de gouvernance IA sera définie prochainement.',
  };
  return structures[a.governance_structure] || '[À définir]';
})()}

### 3.3 Révision de la politique
Cette politique fait l'objet d'une révision ${(() => {
  const freq: Record<string, string> = {
    quarterly: 'trimestrielle',
    biannual: 'semestrielle',
    annual: 'annuelle',
    as_needed: 'selon les évolutions réglementaires',
  };
  return freq[a.review_frequency] || 'périodique';
})()}.

---

## 4. RÈGLES D'UTILISATION

### 4.1 Approbation des outils IA
Avant d'utiliser un nouvel outil d'IA, les collaborateurs doivent :
${(a.approved_tools || []).map((t: string) => {
  const tools: Record<string, string> = {
    pre_approved_list: '- Vérifier que l\'outil figure sur la liste des outils pré-approuvés',
    request_process: '- Soumettre une demande formelle d\'approbation',
    risk_assessment: '- Réaliser ou faire réaliser une évaluation des risques',
    manager_approval: '- Obtenir l\'approbation de leur manager',
    security_review: '- Passer une revue de sécurité',
  };
  return tools[t] || '';
}).filter(Boolean).join('\n')}

### 4.2 Utilisations interdites
Les utilisations suivantes de l'IA sont strictement interdites :
${(a.prohibited_uses || []).map((u: string) => {
  const uses: Record<string, string> = {
    personal_data_unauthorized: '- Traitement de données personnelles sans autorisation',
    automated_decisions: '- Prise de décisions automatisées sans supervision humaine',
    confidential_data: '- Saisie de données confidentielles dans des outils IA publics',
    discrimination: '- Tout usage discriminatoire',
    surveillance: '- Surveillance des employés',
    deepfakes: '- Création de deepfakes ou contenus trompeurs',
    manipulation: '- Manipulation psychologique',
  };
  return uses[u] || '';
}).filter(Boolean).join('\n')}

### 4.3 Règles relatives aux données
${(a.data_rules || []).map((r: string) => {
  const rules: Record<string, string> = {
    no_personal: '- Ne pas saisir de données personnelles dans les outils IA externes',
    no_confidential: '- Ne pas saisir de données confidentielles de l\'entreprise',
    anonymize: '- Anonymiser les données avant utilisation',
    local_only: '- Privilégier les outils hébergés localement ou dans l\'UE',
    gdpr_compliant: '- Vérifier la conformité RGPD des outils utilisés',
  };
  return rules[r] || '';
}).filter(Boolean).join('\n')}

---

## 5. TRANSPARENCE

### 5.1 Obligation de divulgation
L'utilisation de l'IA doit être divulguée dans les cas suivants :
${(a.disclosure_rules || []).map((r: string) => {
  const rules: Record<string, string> = {
    customer_interaction: '- Interactions avec les clients (chatbots, assistants virtuels)',
    content_generation: '- Contenu généré par IA (textes, images, présentations)',
    decision_support: '- Aide à la décision affectant des personnes',
    automated_process: '- Processus automatisés',
    always: '- Dans tous les cas d\'utilisation',
  };
  return rules[r] || '';
}).filter(Boolean).join('\n')}

### 5.2 Identification du contenu IA
Le contenu généré par IA est identifié par :
${(a.labeling_method || []).map((m: string) => {
  const methods: Record<string, string> = {
    mention: '- Une mention textuelle claire',
    watermark: '- Un watermark ou filigrane',
    metadata: '- Des métadonnées techniques',
    footer: '- Une mention en bas de page ou d\'email',
  };
  return methods[m] || '';
}).filter(Boolean).join('\n')}

---

## 6. FORMATION

### 6.1 Programme de formation
${(() => {
  const mandatory: Record<string, string> = {
    all: 'La formation sur l\'IA est obligatoire pour tous les employés.',
    users: 'La formation est obligatoire pour tous les utilisateurs de systèmes d\'IA.',
    managers: 'La formation est obligatoire pour les managers.',
    optional: 'Des formations optionnelles sur l\'IA sont proposées aux collaborateurs.',
  };
  return mandatory[a.training_mandatory] || 'Un programme de formation est mis en place.';
})()}

### 6.2 Contenu de la formation
Les formations couvrent les sujets suivants :
${(a.training_topics || []).map((t: string) => {
  const topics: Record<string, string> = {
    ai_basics: '- Fondamentaux de l\'IA et de son fonctionnement',
    ai_act: '- Réglementation AI Act et obligations',
    risks: '- Risques et limites de l\'IA',
    best_practices: '- Bonnes pratiques d\'utilisation',
    security: '- Sécurité et confidentialité',
    ethics: '- Éthique de l\'IA',
  };
  return topics[t] || '';
}).filter(Boolean).join('\n')}

---

## 7. GESTION DES INCIDENTS

### 7.1 Types d'incidents à signaler
Tout collaborateur doit signaler les incidents suivants :
${(a.incident_types || []).map((i: string) => {
  const incidents: Record<string, string> = {
    data_breach: '- Fuite de données impliquant un système IA',
    bias_discrimination: '- Biais ou discrimination détectée',
    wrong_decision: '- Décision erronée ayant un impact significatif',
    security_breach: '- Faille de sécurité d\'un système IA',
    misuse: '- Utilisation non conforme à cette politique',
    hallucination: '- Génération d\'informations fausses ou trompeuses',
  };
  return incidents[i] || '';
}).filter(Boolean).join('\n')}

### 7.2 Procédure de signalement
- **Contact :** ${a.incident_contact || '[À définir]'}
- **Délai de signalement :** ${(() => {
  const delays: Record<string, string> = {
    immediate: 'Immédiat',
    '24h': 'Sous 24 heures',
    '48h': 'Sous 48 heures',
    '72h': 'Sous 72 heures',
  };
  return delays[a.incident_delay] || 'Dès que possible';
})()}

---

## 8. SANCTIONS

Le non-respect de cette politique peut entraîner des sanctions disciplinaires conformément au règlement intérieur de l'entreprise.

---

## 9. CONTACT

Pour toute question relative à cette politique, contactez :
${a.ai_responsible || '[Responsable IA]'}
${a.incident_contact || '[Contact]'}

---

*Document généré le ${new Date().toLocaleDateString('fr-FR')} dans le cadre de la formation AI Act.*
`;

    return policy;
  };

  const copyPolicy = () => {
    navigator.clipboard.writeText(generatePolicyText());
    alert('Politique copiée dans le presse-papier !');
  };

  const downloadPolicy = () => {
    const blob = new Blob([generatePolicyText()], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `politique-ia-${policyData.answers.company_name || 'entreprise'}.md`;
    a.click();
  };

  // Preview Mode
  if (viewMode === 'preview') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">📄 Prévisualisation de la Politique</h2>
          <button
            onClick={() => setViewMode('edit')}
            className="text-sm text-white/60 hover:text-white"
          >
            ← Modifier
          </button>
        </div>

        <div className="bg-white/5 rounded-xl p-6 border border-white/10 max-h-[60vh] overflow-y-auto">
          <pre className="whitespace-pre-wrap text-sm text-white/80 font-sans leading-relaxed">
            {generatePolicyText()}
          </pre>
        </div>

        <div className="flex gap-3">
          <button
            onClick={copyPolicy}
            className="flex-1 py-3 rounded-xl bg-white/10 font-semibold text-sm hover:bg-white/20 flex items-center justify-center gap-2"
          >
            📋 Copier
          </button>
          <button
            onClick={downloadPolicy}
            className="flex-1 py-3 rounded-xl font-bold text-black text-sm flex items-center justify-center gap-2"
            style={{ backgroundColor: moduleColor }}
          >
            📥 Télécharger (.md)
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

  // Edit Mode (default)
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <span>📜</span> Générateur de Politique IA
          </h2>
          <p className="text-white/60 text-sm mt-1">
            Créez votre politique d'utilisation de l'IA
          </p>
        </div>
        <button
          onClick={() => setViewMode('preview')}
          className="px-4 py-2 rounded-lg text-sm font-medium"
          style={{ backgroundColor: `${moduleColor}20`, color: moduleColor }}
        >
          👁️ Prévisualiser
        </button>
      </div>

      {/* Progress */}
      <div className="bg-white/5 rounded-xl p-4 border border-white/10">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-white/60">Progression globale</span>
          <span className="text-sm font-medium">{getTotalProgress()}%</span>
        </div>
        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
          <div 
            className="h-full rounded-full transition-all"
            style={{ width: `${getTotalProgress()}%`, backgroundColor: moduleColor }}
          />
        </div>
      </div>

      {/* Section Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {POLICY_SECTIONS.map((section, idx) => {
          const progress = getSectionProgress(section.id);
          return (
            <button
              key={section.id}
              onClick={() => setCurrentSection(idx)}
              className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm transition-all ${
                currentSection === idx 
                  ? 'text-black font-bold' 
                  : 'bg-white/5 hover:bg-white/10'
              }`}
              style={currentSection === idx ? { backgroundColor: moduleColor } : {}}
            >
              <span className="mr-1">{section.icon}</span>
              <span className="hidden sm:inline">{section.title}</span>
              {progress === 100 && <span className="ml-1">✓</span>}
            </button>
          );
        })}
      </div>

      {/* Current Section */}
      <motion.div
        key={currentSection}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-white/5 rounded-xl p-4 border border-white/10"
      >
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <span>{currentSectionData.icon}</span>
          {currentSectionData.title}
        </h3>

        <div className="space-y-4">
          {currentSectionData.questions.map(q => (
            <div key={q.id}>
              <label className="block text-sm mb-2">
                {q.question}
                {q.required && <span className="text-red-400 ml-1">*</span>}
              </label>
              {q.helpText && (
                <p className="text-white/40 text-xs mb-2">{q.helpText}</p>
              )}

              {q.type === 'text' && (
                <input
                  type="text"
                  value={policyData.answers[q.id] || ''}
                  onChange={(e) => updateAnswer(q.id, e.target.value)}
                  placeholder={q.placeholder}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:border-[#00F5FF] focus:outline-none"
                />
              )}

              {q.type === 'textarea' && (
                <textarea
                  value={policyData.answers[q.id] || ''}
                  onChange={(e) => updateAnswer(q.id, e.target.value)}
                  placeholder={q.placeholder}
                  rows={3}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:border-[#00F5FF] focus:outline-none resize-none"
                />
              )}

              {q.type === 'select' && (
                <select
                  value={policyData.answers[q.id] || ''}
                  onChange={(e) => updateAnswer(q.id, e.target.value)}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:border-[#00F5FF] focus:outline-none"
                >
                  <option value="">Sélectionner...</option>
                  {q.options?.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              )}

              {q.type === 'multiselect' && (
                <div className="space-y-2">
                  {q.options?.map(opt => {
                    const isSelected = (policyData.answers[q.id] || []).includes(opt.value);
                    return (
                      <button
                        key={opt.value}
                        onClick={() => toggleMultiSelect(q.id, opt.value)}
                        className={`w-full p-2 rounded-lg text-left text-sm transition-all flex items-center gap-2 ${
                          isSelected ? '' : 'bg-white/5 hover:bg-white/10'
                        }`}
                        style={isSelected ? { backgroundColor: `${moduleColor}20`, borderColor: moduleColor } : {}}
                      >
                        <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                          isSelected ? 'border-current' : 'border-white/30'
                        }`} style={isSelected ? { backgroundColor: moduleColor, borderColor: moduleColor } : {}}>
                          {isSelected && <span className="text-black text-xs">✓</span>}
                        </div>
                        <span>{opt.label}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Navigation */}
      <div className="flex gap-3">
        {currentSection > 0 && (
          <button
            onClick={() => setCurrentSection(currentSection - 1)}
            className="px-6 py-3 rounded-xl bg-white/10 font-semibold text-sm hover:bg-white/20"
          >
            ← Précédent
          </button>
        )}
        
        {currentSection < totalSections - 1 ? (
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
            Générer la politique 📄
          </button>
        )}
      </div>
    </div>
  );
}
