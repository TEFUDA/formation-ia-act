'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// ============================================
// TYPES
// ============================================
interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  purpose: string;
}

interface GeneratedEmail {
  id: string;
  systemId: string;
  systemName: string;
  vendorName: string;
  vendorEmail: string;
  subject: string;
  body: string;
  status: 'draft' | 'sent' | 'responded';
  createdAt: string;
  sentAt?: string;
}

interface SystemInfo {
  id: string;
  name: string;
  vendor: string;
  department: string;
  purpose: string;
  riskCategory?: string;
}

// ============================================
// EMAIL TEMPLATES
// ============================================
const EMAIL_TEMPLATES: EmailTemplate[] = [
  {
    id: 'initial_request',
    name: 'Demande initiale de documentation',
    purpose: 'Premier contact pour demander la documentation technique AI Act',
    subject: 'Demande de documentation technique AI Act - {{system_name}}',
    body: `Madame, Monsieur,

Dans le cadre de notre mise en conformité avec le Règlement européen sur l'Intelligence Artificielle (AI Act - Règlement UE 2024/1689), nous procédons à l'inventaire et à la documentation de tous les systèmes d'IA que nous utilisons.

Votre solution "{{system_name}}" fait partie de notre périmètre d'analyse.

En tant que déployeur de votre système, nous avons besoin des informations suivantes pour constituer notre dossier de conformité :

1. **Documentation technique**
   - Description détaillée du fonctionnement du système
   - Données d'entraînement utilisées (si applicable)
   - Architecture et technologies employées

2. **Informations de conformité AI Act**
   - Classification du risque selon l'AI Act (votre évaluation)
   - Mesures de supervision humaine intégrées
   - Tests de robustesse et de cybersécurité effectués

3. **Traitement des données**
   - Types de données personnelles traitées
   - Localisation du traitement et des données
   - Mesures de protection mises en place

4. **Garanties contractuelles**
   - Engagement de conformité AI Act
   - Procédures de gestion des incidents
   - Audit et traçabilité disponibles

Pourriez-vous nous transmettre ces éléments dans les meilleurs délais ? 

L'AI Act impose des obligations strictes aux déployeurs de systèmes d'IA, et nous devons pouvoir démontrer notre due diligence dans le choix et la supervision de nos fournisseurs.

Je reste à votre disposition pour un échange téléphonique si nécessaire.

Cordialement,

{{sender_name}}
{{sender_title}}
{{company_name}}`,
  },
  {
    id: 'high_risk_urgent',
    name: 'Urgence - Système Haut Risque',
    purpose: 'Demande urgente pour système classifié haut risque',
    subject: '[URGENT] Documentation AI Act requise - Système Haut Risque - {{system_name}}',
    body: `Madame, Monsieur,

**DEMANDE URGENTE - SYSTÈME CLASSIFIÉ HAUT RISQUE**

Suite à notre analyse de conformité AI Act, votre solution "{{system_name}}" a été classifiée comme système d'IA à **HAUT RISQUE** selon l'Annexe III du Règlement UE 2024/1689.

Cette classification entraîne des obligations renforcées qui s'appliqueront dès **août 2026**, tant pour vous (fournisseur) que pour nous (déployeur).

**INFORMATIONS REQUISES EN PRIORITÉ :**

✅ **Évaluation de conformité**
- Avez-vous réalisé une évaluation de conformité AI Act ?
- Disposez-vous du marquage CE pour ce système ?
- Avez-vous établi une déclaration de conformité UE ?

✅ **Documentation technique obligatoire (Art. 11)**
- Système de gestion des risques
- Gouvernance des données
- Documentation technique complète
- Enregistrement des activités (logs)

✅ **Supervision humaine (Art. 14)**
- Mécanismes de contrôle humain intégrés
- Procédures d'intervention et d'arrêt

✅ **Robustesse et cybersécurité (Art. 15)**
- Tests de robustesse effectués
- Mesures de cybersécurité

**CALENDRIER**
Compte tenu des délais de mise en conformité, nous avons besoin de ces éléments **sous 30 jours**.

L'absence de documentation adéquate pourrait nous contraindre à reconsidérer l'utilisation de votre solution.

Merci de votre réactivité.

Cordialement,

{{sender_name}}
{{sender_title}}
{{company_name}}`,
  },
  {
    id: 'follow_up',
    name: 'Relance',
    purpose: 'Relance après absence de réponse',
    subject: 'Relance - Documentation AI Act - {{system_name}}',
    body: `Madame, Monsieur,

Je me permets de revenir vers vous concernant notre demande de documentation technique dans le cadre de l'AI Act, envoyée le {{previous_date}}.

N'ayant pas reçu de réponse à ce jour, je me permets de vous relancer sur ce sujet important.

Pour rappel, nous avons besoin des éléments suivants pour votre solution "{{system_name}}" :
- Documentation technique du système
- Informations de conformité AI Act
- Garanties sur le traitement des données

**L'échéance de mise en conformité approche** et nous devons impérativement constituer notre dossier de conformité.

Sans réponse de votre part sous 15 jours, nous serons contraints d'évaluer des alternatives pour garantir notre propre conformité réglementaire.

Merci de votre compréhension.

Cordialement,

{{sender_name}}
{{sender_title}}
{{company_name}}`,
  },
  {
    id: 'transparency_gpai',
    name: 'Demande transparence - IA Générative',
    purpose: 'Demande spécifique pour systèmes d\'IA générative (GPAI)',
    subject: 'Obligations de transparence AI Act - {{system_name}} (IA Générative)',
    body: `Madame, Monsieur,

Votre solution "{{system_name}}" étant une **IA à usage général (GPAI)** ou intégrant des capacités génératives, elle est soumise à des obligations spécifiques de transparence selon le **Chapitre V du Règlement AI Act**.

Ces obligations s'appliquent à partir d'**août 2025**.

**INFORMATIONS REQUISES :**

📋 **Documentation technique (Art. 53)**
- Description des capacités et limitations du modèle
- Résumé du contenu utilisé pour l'entraînement
- Politique de respect du droit d'auteur

🏷️ **Marquage du contenu (Art. 50)**
- Mécanismes d'identification du contenu généré par IA
- Watermarking ou métadonnées intégrées
- Outils de détection mis à disposition

⚠️ **Si risque systémique (Art. 55)**
- Évaluation du modèle selon protocoles normalisés
- Tests adverses réalisés
- Mesures d'atténuation des risques

🔒 **Protection des données**
- Données d'entraînement utilisées
- Respect du RGPD et du droit d'auteur
- Procédures de retrait de données (opt-out)

Merci de nous fournir ces éléments pour que nous puissions informer nos utilisateurs conformément à nos obligations de déployeur.

Cordialement,

{{sender_name}}
{{sender_title}}
{{company_name}}`,
  },
];

// ============================================
// COMPONENT
// ============================================
interface EmailGeneratorWorkshopProps {
  moduleColor: string;
  onComplete: () => void;
}

export default function EmailGeneratorWorkshop({ moduleColor, onComplete }: EmailGeneratorWorkshopProps) {
  const [systems, setSystems] = useState<SystemInfo[]>([]);
  const [generatedEmails, setGeneratedEmails] = useState<GeneratedEmail[]>([]);
  const [selectedSystem, setSelectedSystem] = useState<SystemInfo | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'generate' | 'preview' | 'history'>('list');
  
  // Form state
  const [vendorEmail, setVendorEmail] = useState('');
  const [senderName, setSenderName] = useState('');
  const [senderTitle, setSenderTitle] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [customBody, setCustomBody] = useState('');
  const [customSubject, setCustomSubject] = useState('');

  // Load systems from registry
  useEffect(() => {
    const savedRegistry = localStorage.getItem('workshop_ai_registry');
    const savedInventory = localStorage.getItem('workshop_ai_inventory');
    const savedClassification = localStorage.getItem('workshop_classification_results');
    
    let loadedSystems: SystemInfo[] = [];
    
    if (savedRegistry) {
      try {
        loadedSystems = JSON.parse(savedRegistry);
      } catch (e) {
        console.error('Error loading registry:', e);
      }
    } else if (savedInventory) {
      try {
        loadedSystems = JSON.parse(savedInventory);
      } catch (e) {
        console.error('Error loading inventory:', e);
      }
    }

    // Merge classification results
    if (savedClassification) {
      try {
        const classifications = JSON.parse(savedClassification);
        loadedSystems = loadedSystems.map(sys => {
          const classification = classifications.find((c: any) => c.systemId === sys.id);
          return classification ? { ...sys, riskCategory: classification.riskLevel } : sys;
        });
      } catch (e) {
        console.error('Error loading classifications:', e);
      }
    }

    setSystems(loadedSystems);

    // Load company profile
    const savedProfile = localStorage.getItem('workshop_company_profile');
    if (savedProfile) {
      try {
        const profile = JSON.parse(savedProfile);
        setCompanyName(profile.name || '');
      } catch (e) {
        console.error('Error loading profile:', e);
      }
    }

    // Load existing emails
    const savedEmails = localStorage.getItem('workshop_vendor_emails');
    if (savedEmails) {
      try {
        setGeneratedEmails(JSON.parse(savedEmails));
      } catch (e) {
        console.error('Error loading emails:', e);
      }
    }
  }, []);

  // Save emails
  useEffect(() => {
    if (generatedEmails.length > 0) {
      localStorage.setItem('workshop_vendor_emails', JSON.stringify(generatedEmails));
    }
  }, [generatedEmails]);

  const startGeneration = (system: SystemInfo) => {
    setSelectedSystem(system);
    setVendorEmail('');
    
    // Auto-select template based on risk category
    if (system.riskCategory === 'high') {
      setSelectedTemplate(EMAIL_TEMPLATES.find(t => t.id === 'high_risk_urgent') || EMAIL_TEMPLATES[0]);
    } else if (system.riskCategory === 'gpai' || system.riskCategory === 'limited') {
      setSelectedTemplate(EMAIL_TEMPLATES.find(t => t.id === 'transparency_gpai') || EMAIL_TEMPLATES[0]);
    } else {
      setSelectedTemplate(EMAIL_TEMPLATES[0]);
    }
    
    setViewMode('generate');
  };

  const generateEmail = () => {
    if (!selectedSystem || !selectedTemplate) return;

    let body = selectedTemplate.body;
    let subject = selectedTemplate.subject;

    // Replace placeholders
    const replacements: Record<string, string> = {
      '{{system_name}}': selectedSystem.name,
      '{{vendor_name}}': selectedSystem.vendor || 'Votre entreprise',
      '{{sender_name}}': senderName || '[Votre nom]',
      '{{sender_title}}': senderTitle || '[Votre fonction]',
      '{{company_name}}': companyName || '[Votre entreprise]',
      '{{previous_date}}': new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toLocaleDateString('fr-FR'),
    };

    Object.entries(replacements).forEach(([key, value]) => {
      body = body.replace(new RegExp(key, 'g'), value);
      subject = subject.replace(new RegExp(key, 'g'), value);
    });

    setCustomBody(body);
    setCustomSubject(subject);
    setViewMode('preview');
  };

  const saveEmail = () => {
    if (!selectedSystem) return;

    const newEmail: GeneratedEmail = {
      id: `email_${Date.now()}`,
      systemId: selectedSystem.id,
      systemName: selectedSystem.name,
      vendorName: selectedSystem.vendor || '',
      vendorEmail: vendorEmail,
      subject: customSubject,
      body: customBody,
      status: 'draft',
      createdAt: new Date().toISOString(),
    };

    setGeneratedEmails([...generatedEmails, newEmail]);
    setViewMode('list');
    setSelectedSystem(null);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copié dans le presse-papier !');
  };

  const openMailClient = () => {
    const mailto = `mailto:${vendorEmail}?subject=${encodeURIComponent(customSubject)}&body=${encodeURIComponent(customBody)}`;
    window.open(mailto);
  };

  const markAsSent = (emailId: string) => {
    setGeneratedEmails(emails => 
      emails.map(e => e.id === emailId ? { ...e, status: 'sent', sentAt: new Date().toISOString() } : e)
    );
  };

  const deleteEmail = (emailId: string) => {
    if (confirm('Supprimer cet email ?')) {
      setGeneratedEmails(emails => emails.filter(e => e.id !== emailId));
    }
  };

  const getRiskBadge = (riskCategory?: string) => {
    const configs: Record<string, { color: string; label: string }> = {
      prohibited: { color: '#EF4444', label: 'Interdit' },
      high: { color: '#F97316', label: 'Haut risque' },
      limited: { color: '#EAB308', label: 'Limité' },
      minimal: { color: '#22C55E', label: 'Minimal' },
      gpai: { color: '#8B5CF6', label: 'GPAI' },
    };
    return riskCategory ? configs[riskCategory] : null;
  };

  // History View
  if (viewMode === 'history') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <span>📬</span> Historique des emails
          </h2>
          <button
            onClick={() => setViewMode('list')}
            className="text-sm text-white/60 hover:text-white"
          >
            ← Retour
          </button>
        </div>

        {generatedEmails.length > 0 ? (
          <div className="space-y-3">
            {generatedEmails.map(email => (
              <div key={email.id} className="bg-white/5 rounded-xl p-4 border border-white/10">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-medium">{email.systemName}</p>
                    <p className="text-white/40 text-xs">{email.vendorEmail || 'Email non spécifié'}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    email.status === 'sent' ? 'bg-green-500/20 text-green-400' :
                    email.status === 'responded' ? 'bg-blue-500/20 text-blue-400' :
                    'bg-white/10 text-white/60'
                  }`}>
                    {email.status === 'sent' ? '✓ Envoyé' : email.status === 'responded' ? '💬 Répondu' : '📝 Brouillon'}
                  </span>
                </div>
                <p className="text-sm text-white/60 mb-3 line-clamp-2">{email.subject}</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => copyToClipboard(email.body)}
                    className="px-3 py-1.5 rounded-lg text-xs bg-white/10 hover:bg-white/20"
                  >
                    📋 Copier
                  </button>
                  {email.status === 'draft' && (
                    <button
                      onClick={() => markAsSent(email.id)}
                      className="px-3 py-1.5 rounded-lg text-xs bg-green-500/20 text-green-400 hover:bg-green-500/30"
                    >
                      ✓ Marquer envoyé
                    </button>
                  )}
                  <button
                    onClick={() => deleteEmail(email.id)}
                    className="px-3 py-1.5 rounded-lg text-xs bg-red-500/10 text-red-400 hover:bg-red-500/20"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white/5 rounded-xl">
            <p className="text-white/60">Aucun email généré</p>
          </div>
        )}
      </div>
    );
  }

  // Preview View
  if (viewMode === 'preview' && selectedSystem) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">📧 Prévisualisation</h2>
          <button
            onClick={() => setViewMode('generate')}
            className="text-sm text-white/60 hover:text-white"
          >
            ← Modifier
          </button>
        </div>

        {/* Email Preview */}
        <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
          <div className="p-4 bg-white/5 border-b border-white/10">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-white/40 text-sm">À :</span>
              <input
                type="email"
                value={vendorEmail}
                onChange={(e) => setVendorEmail(e.target.value)}
                placeholder="email@fournisseur.com"
                className="flex-1 bg-transparent text-sm focus:outline-none"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-white/40 text-sm">Objet :</span>
              <input
                type="text"
                value={customSubject}
                onChange={(e) => setCustomSubject(e.target.value)}
                className="flex-1 bg-transparent font-medium focus:outline-none"
              />
            </div>
          </div>
          <div className="p-4">
            <textarea
              value={customBody}
              onChange={(e) => setCustomBody(e.target.value)}
              rows={15}
              className="w-full bg-transparent text-sm text-white/80 leading-relaxed focus:outline-none resize-none"
            />
          </div>
        </div>

        {/* Sender Info */}
        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
          <p className="text-sm text-white/60 mb-3">Informations de l'expéditeur</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input
              type="text"
              value={senderName}
              onChange={(e) => setSenderName(e.target.value)}
              placeholder="Votre nom"
              className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:border-[#00F5FF] focus:outline-none"
            />
            <input
              type="text"
              value={senderTitle}
              onChange={(e) => setSenderTitle(e.target.value)}
              placeholder="Votre fonction"
              className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:border-[#00F5FF] focus:outline-none"
            />
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Votre entreprise"
              className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:border-[#00F5FF] focus:outline-none"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => copyToClipboard(customBody)}
            className="flex-1 py-3 rounded-xl bg-white/10 font-semibold text-sm hover:bg-white/20 flex items-center justify-center gap-2"
          >
            📋 Copier le texte
          </button>
          <button
            onClick={openMailClient}
            className="flex-1 py-3 rounded-xl bg-blue-500/20 text-blue-400 font-semibold text-sm hover:bg-blue-500/30 flex items-center justify-center gap-2"
          >
            📧 Ouvrir dans email
          </button>
          <button
            onClick={saveEmail}
            className="flex-1 py-3 rounded-xl font-bold text-black text-sm flex items-center justify-center gap-2"
            style={{ backgroundColor: moduleColor }}
          >
            💾 Sauvegarder
          </button>
        </div>
      </div>
    );
  }

  // Generate View
  if (viewMode === 'generate' && selectedSystem) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/40 text-xs">Générer un email pour</p>
            <h2 className="text-xl font-bold">{selectedSystem.name}</h2>
          </div>
          <button
            onClick={() => { setViewMode('list'); setSelectedSystem(null); }}
            className="text-sm text-white/60 hover:text-white"
          >
            ✕ Annuler
          </button>
        </div>

        {/* Template Selection */}
        <div className="space-y-3">
          <p className="text-sm text-white/60">Choisissez un modèle d'email</p>
          {EMAIL_TEMPLATES.map(template => (
            <button
              key={template.id}
              onClick={() => setSelectedTemplate(template)}
              className={`w-full p-4 rounded-xl text-left transition-all border-2 ${
                selectedTemplate?.id === template.id 
                  ? '' 
                  : 'border-transparent bg-white/5 hover:bg-white/10'
              }`}
              style={selectedTemplate?.id === template.id ? { borderColor: moduleColor, backgroundColor: `${moduleColor}10` } : {}}
            >
              <p className="font-medium mb-1">{template.name}</p>
              <p className="text-white/40 text-xs">{template.purpose}</p>
            </button>
          ))}
        </div>

        {/* Vendor Email */}
        <div>
          <label className="block text-sm text-white/60 mb-2">Email du fournisseur (optionnel)</label>
          <input
            type="email"
            value={vendorEmail}
            onChange={(e) => setVendorEmail(e.target.value)}
            placeholder="contact@fournisseur.com"
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm focus:border-[#00F5FF] focus:outline-none"
          />
        </div>

        {/* Generate Button */}
        <button
          onClick={generateEmail}
          disabled={!selectedTemplate}
          className={`w-full py-3 rounded-xl font-bold text-sm ${
            selectedTemplate ? 'text-black' : 'bg-white/10 text-white/30 cursor-not-allowed'
          }`}
          style={selectedTemplate ? { backgroundColor: moduleColor } : {}}
        >
          Générer l'email →
        </button>
      </div>
    );
  }

  // List View (default)
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <span>📧</span> Emails Fournisseurs
          </h2>
          <p className="text-white/60 text-sm mt-1">
            Générez des emails pour demander la documentation AI Act
          </p>
        </div>
        {generatedEmails.length > 0 && (
          <button
            onClick={() => setViewMode('history')}
            className="px-4 py-2 rounded-lg text-sm font-medium"
            style={{ backgroundColor: `${moduleColor}20`, color: moduleColor }}
          >
            📬 Historique ({generatedEmails.length})
          </button>
        )}
      </div>

      {/* Stats */}
      {systems.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white/5 rounded-xl p-3 text-center border border-white/10">
            <div className="text-2xl font-bold" style={{ color: moduleColor }}>{systems.length}</div>
            <p className="text-white/40 text-xs">Systèmes</p>
          </div>
          <div className="bg-white/5 rounded-xl p-3 text-center border border-white/10">
            <div className="text-2xl font-bold text-blue-400">{generatedEmails.length}</div>
            <p className="text-white/40 text-xs">Emails générés</p>
          </div>
          <div className="bg-white/5 rounded-xl p-3 text-center border border-white/10">
            <div className="text-2xl font-bold text-green-400">
              {generatedEmails.filter(e => e.status === 'sent').length}
            </div>
            <p className="text-white/40 text-xs">Envoyés</p>
          </div>
        </div>
      )}

      {/* Systems List */}
      {systems.length > 0 ? (
        <div className="space-y-2">
          {systems.filter(s => s.vendor).map(system => {
            const riskBadge = getRiskBadge(system.riskCategory);
            const hasEmail = generatedEmails.some(e => e.systemId === system.id);

            return (
              <div
                key={system.id}
                className="bg-white/5 rounded-xl p-4 border border-white/10 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                    📦
                  </div>
                  <div>
                    <p className="font-medium">{system.name}</p>
                    <p className="text-white/40 text-xs">{system.vendor}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {riskBadge && (
                    <span 
                      className="px-2 py-1 rounded-full text-xs font-medium"
                      style={{ backgroundColor: `${riskBadge.color}20`, color: riskBadge.color }}
                    >
                      {riskBadge.label}
                    </span>
                  )}
                  {hasEmail && (
                    <span className="text-green-400 text-xs">✓ Email créé</span>
                  )}
                  <button
                    onClick={() => startGeneration(system)}
                    className="px-3 py-1.5 rounded-lg text-sm font-medium text-black"
                    style={{ backgroundColor: moduleColor }}
                  >
                    {hasEmail ? '+ Nouveau' : '📧 Générer'}
                  </button>
                </div>
              </div>
            );
          })}

          {/* Systems without vendor */}
          {systems.filter(s => !s.vendor).length > 0 && (
            <div className="bg-yellow-500/10 rounded-xl p-4 border border-yellow-500/20">
              <p className="text-sm text-yellow-400">
                ⚠️ {systems.filter(s => !s.vendor).length} système(s) sans fournisseur identifié
              </p>
              <p className="text-xs text-white/40 mt-1">
                Complétez le registre pour ajouter les fournisseurs manquants
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-12 bg-white/5 rounded-xl border border-dashed border-white/20">
          <div className="text-4xl mb-3">📋</div>
          <p className="text-white/60 text-sm mb-4">Aucun système dans le registre</p>
          <p className="text-white/40 text-xs">
            Complétez d'abord l'inventaire (M2.2) ou le registre (M2.4)
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3 pt-4 border-t border-white/10">
        <a
          href="/resources/06-email-fournisseur-guide.docx"
          download
          className="flex-1 py-3 rounded-xl bg-white/10 font-medium text-sm hover:bg-white/20 flex items-center justify-center gap-2"
        >
          📥 Guide Email (Word)
        </a>
        <button
          onClick={onComplete}
          className="flex-1 py-3 rounded-xl font-bold text-black text-sm"
          style={{ backgroundColor: moduleColor }}
        >
          Continuer →
        </button>
      </div>
    </div>
  );
}
