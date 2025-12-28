'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// ============================================
// TYPES
// ============================================
interface MentionType {
  id: string;
  name: string;
  icon: string;
  description: string;
  required: boolean;
  template: string;
  fields: MentionField[];
}

interface MentionField {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'select';
  placeholder?: string;
  options?: string[];
}

// ============================================
// MENTION TYPES
// ============================================
const MENTION_TYPES: MentionType[] = [
  {
    id: 'chatbot',
    name: 'Chatbot / Assistant virtuel',
    icon: '💬',
    description: 'Pour les chatbots et assistants IA sur votre site',
    required: true,
    fields: [
      { id: 'chatbot_name', label: 'Nom du chatbot', type: 'text', placeholder: 'Ex: Assistant Max' },
      { id: 'chatbot_purpose', label: 'Fonction du chatbot', type: 'text', placeholder: 'Ex: Support client' },
      { id: 'human_fallback', label: 'Contact humain disponible ?', type: 'select', options: ['Oui', 'Non'] },
    ],
    template: `🤖 ASSISTANT VIRTUEL

Vous interagissez avec {{chatbot_name}}, un assistant virtuel propulsé par l'intelligence artificielle.

Conformément au Règlement européen sur l'Intelligence Artificielle (AI Act), nous vous informons que :

• Ce système utilise des technologies d'IA pour répondre à vos questions
• Les réponses générées peuvent contenir des erreurs ou imprécisions
• Aucune donnée personnelle sensible ne doit être partagée dans cette conversation
• Fonction : {{chatbot_purpose}}
{{#if human_fallback}}
• Un conseiller humain est disponible sur demande
{{/if}}

En utilisant ce service, vous acceptez ces conditions.`,
  },
  {
    id: 'content_generation',
    name: 'Contenu généré par IA',
    icon: '✍️',
    description: 'Pour le contenu créé avec l\'aide de l\'IA',
    required: true,
    fields: [
      { id: 'content_type', label: 'Type de contenu', type: 'select', options: ['Articles', 'Descriptions produits', 'Traductions', 'Résumés', 'Images', 'Autre'] },
      { id: 'ai_tools', label: 'Outils IA utilisés', type: 'text', placeholder: 'Ex: ChatGPT, DALL-E' },
      { id: 'human_review', label: 'Révision humaine ?', type: 'select', options: ['Oui, systématique', 'Partielle', 'Non'] },
    ],
    template: `📝 CONTENU ASSISTÉ PAR IA

Ce {{content_type}} a été créé avec l'assistance de l'intelligence artificielle ({{ai_tools}}).

Conformément à l'AI Act (Art. 50), nous vous informons que :

• Ce contenu a été généré ou assisté par des systèmes d'IA
• Révision humaine : {{human_review}}
• Le contenu a pu être édité pour en améliorer la qualité
• En cas de doute, vérifiez les informations auprès de sources officielles

[Entreprise] s'engage à utiliser l'IA de manière responsable et transparente.`,
  },
  {
    id: 'recommendation',
    name: 'Système de recommandation',
    icon: '🎯',
    description: 'Pour les algorithmes de recommandation',
    required: false,
    fields: [
      { id: 'rec_type', label: 'Type de recommandations', type: 'select', options: ['Produits', 'Contenus', 'Services', 'Profils'] },
      { id: 'data_used', label: 'Données utilisées', type: 'textarea', placeholder: 'Ex: Historique de navigation, achats précédents...' },
      { id: 'opt_out', label: 'Désactivation possible ?', type: 'select', options: ['Oui', 'Non'] },
    ],
    template: `🎯 RECOMMANDATIONS PERSONNALISÉES

Ce site utilise un système de recommandation basé sur l'intelligence artificielle pour vous proposer des {{rec_type}} adaptés à vos préférences.

Comment ça fonctionne :
• Données analysées : {{data_used}}
• Les recommandations sont générées automatiquement par un algorithme
• Elles ne constituent pas des conseils professionnels

Vos droits :
{{#if opt_out}}
• Vous pouvez désactiver les recommandations personnalisées dans vos paramètres
{{/if}}
• Vous pouvez demander l'accès à vos données (RGPD Art. 15)
• Vous pouvez vous opposer au profilage (RGPD Art. 21)`,
  },
  {
    id: 'decision_support',
    name: 'Aide à la décision',
    icon: '📊',
    description: 'Pour les systèmes d\'aide à la décision',
    required: true,
    fields: [
      { id: 'decision_type', label: 'Type de décision', type: 'text', placeholder: 'Ex: Éligibilité, scoring, évaluation' },
      { id: 'human_decision', label: 'Décision finale humaine ?', type: 'select', options: ['Oui, toujours', 'Selon les cas', 'Non'] },
      { id: 'contestation', label: 'Possibilité de contester ?', type: 'select', options: ['Oui', 'Non'] },
    ],
    template: `📊 SYSTÈME D'AIDE À LA DÉCISION

Ce service utilise un système d'intelligence artificielle pour : {{decision_type}}.

Informations importantes :

• Ce système analyse vos données pour fournir une recommandation ou un score
• La décision finale est prise par {{human_decision}}
• Les critères utilisés sont documentés et peuvent être expliqués sur demande

Vos droits (RGPD Art. 22 + AI Act) :
• Droit à l'explication des critères de décision
{{#if contestation}}
• Droit de contester la décision et d'obtenir une révision humaine
{{/if}}
• Droit d'accès aux données vous concernant

Contact : [email de contact]`,
  },
  {
    id: 'biometric',
    name: 'Système biométrique',
    icon: '🔐',
    description: 'Pour la reconnaissance faciale ou biométrique',
    required: true,
    fields: [
      { id: 'bio_type', label: 'Type de biométrie', type: 'select', options: ['Reconnaissance faciale', 'Empreinte digitale', 'Reconnaissance vocale', 'Autre'] },
      { id: 'bio_purpose', label: 'Finalité', type: 'text', placeholder: 'Ex: Authentification, contrôle d\'accès' },
      { id: 'data_retention', label: 'Durée de conservation', type: 'text', placeholder: 'Ex: Session uniquement, 1 an' },
    ],
    template: `🔐 TRAITEMENT BIOMÉTRIQUE

Ce service utilise un système de {{bio_type}} basé sur l'intelligence artificielle.

⚠️ INFORMATION IMPORTANTE - AI ACT

Finalité : {{bio_purpose}}

Ce traitement de données biométriques est soumis à des règles strictes :
• Votre consentement explicite est requis
• Les données sont conservées : {{data_retention}}
• Vous pouvez retirer votre consentement à tout moment
• Alternative sans biométrie disponible sur demande

Vos droits (RGPD + AI Act) :
• Droit d'accès, rectification et suppression
• Droit de retrait du consentement
• Droit de recourir à une alternative non-biométrique

Contact DPO : [email DPO]`,
  },
  {
    id: 'emotion',
    name: 'Reconnaissance d\'émotions',
    icon: '😊',
    description: 'Pour les systèmes analysant les émotions',
    required: true,
    fields: [
      { id: 'emotion_context', label: 'Contexte d\'utilisation', type: 'text', placeholder: 'Ex: Enquête de satisfaction' },
      { id: 'emotion_purpose', label: 'Finalité', type: 'textarea', placeholder: 'Pourquoi analysez-vous les émotions ?' },
    ],
    template: `😊 ANALYSE DES ÉMOTIONS

Ce service peut analyser des signaux émotionnels (expressions faciales, ton de voix, etc.).

⚠️ SYSTÈME RÉGLEMENTÉ PAR L'AI ACT

Contexte : {{emotion_context}}
Finalité : {{emotion_purpose}}

IMPORTANT :
• Ce type de système est strictement encadré par l'AI Act
• Votre consentement explicite et éclairé est obligatoire
• L'analyse ne sera pas utilisée à des fins de manipulation
• Vous pouvez refuser cette analyse sans conséquence

En cas de refus, une alternative sans analyse émotionnelle vous sera proposée.

Pour exercer vos droits : [email contact]`,
  },
  {
    id: 'website_general',
    name: 'Mentions générales site web',
    icon: '🌐',
    description: 'Mentions IA générales pour votre site',
    required: false,
    fields: [
      { id: 'company_name', label: 'Nom de l\'entreprise', type: 'text', placeholder: 'Votre entreprise' },
      { id: 'ai_uses', label: 'Usages IA sur le site', type: 'textarea', placeholder: 'Listez vos usages : chatbot, recommandations, etc.' },
      { id: 'contact_email', label: 'Email de contact', type: 'text', placeholder: 'ia@entreprise.com' },
    ],
    template: `🤖 UTILISATION DE L'INTELLIGENCE ARTIFICIELLE

{{company_name}} utilise des technologies d'intelligence artificielle sur ce site.

SYSTÈMES IA UTILISÉS :
{{ai_uses}}

CONFORMITÉ RÉGLEMENTAIRE :
Nous respectons le Règlement européen sur l'Intelligence Artificielle (AI Act) et le RGPD.

VOS DROITS :
• Être informé de l'utilisation de l'IA
• Demander une explication des décisions automatisées vous concernant
• Contester une décision et obtenir une intervention humaine
• Accéder à vos données et les faire supprimer

CONTACT :
Pour toute question relative à notre utilisation de l'IA : {{contact_email}}

Dernière mise à jour : [Date]`,
  },
];

// ============================================
// COMPONENT
// ============================================
interface LegalMentionsWorkshopProps {
  moduleColor: string;
  onComplete: () => void;
}

export default function LegalMentionsWorkshop({ moduleColor, onComplete }: LegalMentionsWorkshopProps) {
  const [selectedType, setSelectedType] = useState<MentionType | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [generatedMentions, setGeneratedMentions] = useState<Array<{ type: string; content: string }>>([]);
  const [viewMode, setViewMode] = useState<'select' | 'fill' | 'preview' | 'library'>('select');

  // Load saved data
  useEffect(() => {
    const saved = localStorage.getItem('workshop_legal_mentions');
    if (saved) {
      try {
        setGeneratedMentions(JSON.parse(saved));
      } catch (e) {
        console.error('Error loading mentions:', e);
      }
    }

    // Load company profile
    const savedProfile = localStorage.getItem('workshop_company_profile');
    if (savedProfile) {
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

  // Save mentions
  useEffect(() => {
    if (generatedMentions.length > 0) {
      localStorage.setItem('workshop_legal_mentions', JSON.stringify(generatedMentions));
    }
  }, [generatedMentions]);

  const handleAnswer = (fieldId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [fieldId]: value }));
  };

  const generateMention = () => {
    if (!selectedType) return;

    let content = selectedType.template;

    // Replace placeholders
    selectedType.fields.forEach(field => {
      const value = answers[field.id] || `[${field.label}]`;
      content = content.replace(new RegExp(`{{${field.id}}}`, 'g'), value);
    });

    // Handle conditionals (simplified)
    content = content.replace(/{{#if (\w+)}}([\s\S]*?){{\/if}}/g, (match, fieldId, text) => {
      return answers[fieldId] === 'Oui' ? text : '';
    });

    // Add to library
    setGeneratedMentions([...generatedMentions, { type: selectedType.id, content }]);
    setViewMode('preview');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copié !');
  };

  const deleteMention = (index: number) => {
    setGeneratedMentions(mentions => mentions.filter((_, i) => i !== index));
  };

  const startNew = (type: MentionType) => {
    setSelectedType(type);
    setAnswers({});
    setViewMode('fill');
  };

  // Library View
  if (viewMode === 'library') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">📚 Vos mentions légales</h2>
          <button
            onClick={() => setViewMode('select')}
            className="text-sm text-white/60 hover:text-white"
          >
            + Nouvelle mention
          </button>
        </div>

        {generatedMentions.length > 0 ? (
          <div className="space-y-3">
            {generatedMentions.map((mention, idx) => {
              const type = MENTION_TYPES.find(t => t.id === mention.type);
              return (
                <div key={idx} className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-medium flex items-center gap-2">
                      <span>{type?.icon}</span> {type?.name}
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => copyToClipboard(mention.content)}
                        className="px-3 py-1 rounded-lg text-xs bg-white/10 hover:bg-white/20"
                      >
                        📋 Copier
                      </button>
                      <button
                        onClick={() => deleteMention(idx)}
                        className="px-3 py-1 rounded-lg text-xs bg-red-500/10 text-red-400 hover:bg-red-500/20"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                  <pre className="text-xs text-white/60 whitespace-pre-wrap line-clamp-4">
                    {mention.content}
                  </pre>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 bg-white/5 rounded-xl">
            <p className="text-white/60">Aucune mention générée</p>
          </div>
        )}

        <button
          onClick={onComplete}
          className="w-full py-3 rounded-xl font-bold text-black text-sm"
          style={{ backgroundColor: moduleColor }}
        >
          Continuer la formation →
        </button>
      </div>
    );
  }

  // Preview View
  if (viewMode === 'preview' && selectedType) {
    const lastMention = generatedMentions[generatedMentions.length - 1];

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <span>{selectedType.icon}</span> Mention générée
          </h2>
          <button
            onClick={() => setViewMode('library')}
            className="text-sm text-white/60 hover:text-white"
          >
            📚 Voir toutes
          </button>
        </div>

        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
          <pre className="text-sm text-white/80 whitespace-pre-wrap leading-relaxed">
            {lastMention?.content}
          </pre>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => copyToClipboard(lastMention?.content || '')}
            className="flex-1 py-3 rounded-xl bg-white/10 font-semibold text-sm hover:bg-white/20"
          >
            📋 Copier
          </button>
          <button
            onClick={() => setViewMode('select')}
            className="flex-1 py-3 rounded-xl font-bold text-black text-sm"
            style={{ backgroundColor: moduleColor }}
          >
            + Autre mention
          </button>
        </div>
      </div>
    );
  }

  // Fill Form View
  if (viewMode === 'fill' && selectedType) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <span>{selectedType.icon}</span> {selectedType.name}
          </h2>
          <button
            onClick={() => setViewMode('select')}
            className="text-sm text-white/60 hover:text-white"
          >
            ← Retour
          </button>
        </div>

        <p className="text-white/60 text-sm">{selectedType.description}</p>

        <div className="space-y-4">
          {selectedType.fields.map(field => (
            <div key={field.id} className="bg-white/5 rounded-xl p-4 border border-white/10">
              <label className="block text-sm font-medium mb-2">{field.label}</label>
              
              {field.type === 'text' && (
                <input
                  type="text"
                  value={answers[field.id] || ''}
                  onChange={(e) => handleAnswer(field.id, e.target.value)}
                  placeholder={field.placeholder}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:border-[#00F5FF] focus:outline-none"
                />
              )}

              {field.type === 'textarea' && (
                <textarea
                  value={answers[field.id] || ''}
                  onChange={(e) => handleAnswer(field.id, e.target.value)}
                  placeholder={field.placeholder}
                  rows={3}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:border-[#00F5FF] focus:outline-none resize-none"
                />
              )}

              {field.type === 'select' && (
                <select
                  value={answers[field.id] || ''}
                  onChange={(e) => handleAnswer(field.id, e.target.value)}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:border-[#00F5FF] focus:outline-none"
                >
                  <option value="">Sélectionner...</option>
                  {field.options?.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              )}
            </div>
          ))}
        </div>

        <button
          onClick={generateMention}
          className="w-full py-3 rounded-xl font-bold text-black text-sm"
          style={{ backgroundColor: moduleColor }}
        >
          Générer la mention →
        </button>
      </div>
    );
  }

  // Select Type View (default)
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <span>📋</span> Générateur de Mentions Légales
          </h2>
          <p className="text-white/60 text-sm mt-1">
            Créez vos mentions obligatoires AI Act
          </p>
        </div>
        {generatedMentions.length > 0 && (
          <button
            onClick={() => setViewMode('library')}
            className="px-4 py-2 rounded-lg text-sm font-medium"
            style={{ backgroundColor: `${moduleColor}20`, color: moduleColor }}
          >
            📚 Bibliothèque ({generatedMentions.length})
          </button>
        )}
      </div>

      <div className="grid gap-3">
        {MENTION_TYPES.map(type => (
          <button
            key={type.id}
            onClick={() => startNew(type)}
            className="bg-white/5 rounded-xl p-4 border border-white/10 text-left hover:bg-white/10 transition-colors"
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl">{type.icon}</span>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{type.name}</span>
                  {type.required && (
                    <span className="px-2 py-0.5 rounded text-[10px] bg-red-500/20 text-red-400">
                      Obligatoire
                    </span>
                  )}
                </div>
                <p className="text-white/40 text-sm mt-1">{type.description}</p>
              </div>
              <span className="text-white/40">→</span>
            </div>
          </button>
        ))}
      </div>

      {generatedMentions.length > 0 && (
        <button
          onClick={onComplete}
          className="w-full py-3 rounded-xl font-bold text-black text-sm"
          style={{ backgroundColor: moduleColor }}
        >
          Continuer la formation →
        </button>
      )}
    </div>
  );
}
