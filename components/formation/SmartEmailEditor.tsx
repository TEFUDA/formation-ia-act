'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ============================================
// TYPES
// ============================================
interface EmailSection {
  id: string;
  name: string;
  icon: string;
  content: string;
  description: string;
}

// ============================================
// EMAIL SECTIONS
// ============================================
const EMAIL_SECTIONS: EmailSection[] = [
  {
    id: 'intro',
    name: 'Introduction formelle',
    icon: '👋',
    content: `Je me permets de vous contacter en ma qualité de [votre fonction] au sein de [votre entreprise], utilisatrice de votre solution [nom du produit].

Dans le cadre de notre démarche de mise en conformité avec le Règlement européen sur l'Intelligence Artificielle (Règlement UE 2024/1689, dit "AI Act"), nous devons constituer un dossier documentaire pour chaque système d'IA que nous déployons.`,
    description: 'Présentation professionnelle et contexte réglementaire'
  },
  {
    id: 'demande_doc',
    name: 'Demande de documentation',
    icon: '📄',
    content: `À ce titre, nous vous serions reconnaissants de bien vouloir nous transmettre les éléments suivants, conformément à l'Annexe IV du règlement :

1. Description générale du système d'IA et de son fonctionnement
2. Architecture technique et composants principaux
3. Informations sur les données d'entraînement utilisées
4. Métriques de performance et indicateurs de fiabilité
5. Analyse des risques et mesures d'atténuation
6. Instructions pour la supervision humaine
7. Modalités de journalisation des événements`,
    description: 'Liste des 7 éléments requis par l\'Annexe IV'
  },
  {
    id: 'classification',
    name: 'Question sur la classification',
    icon: '⚖️',
    content: `Par ailleurs, pourriez-vous nous confirmer :
- La classification de risque de votre système selon l'AI Act (minimal, limité, haut risque)
- Les articles de l'AI Act applicables à votre solution
- Si votre produit dispose d'un marquage CE le cas échéant`,
    description: 'Demande de précision sur le niveau de risque'
  },
  {
    id: 'deadline',
    name: 'Délai de réponse',
    icon: '⏰',
    content: `Compte tenu des échéances réglementaires (notamment l'entrée en application de l'article 4 sur la formation en février 2025), nous vous serions reconnaissants de nous faire parvenir ces informations dans un délai de 15 jours ouvrés.`,
    description: 'Fixe un délai précis et rappelle l\'urgence'
  },
  {
    id: 'menace_soft',
    name: 'Mention AI Act (soft)',
    icon: '⚡',
    content: `Nous vous rappelons que l'AI Act impose aux fournisseurs de systèmes d'IA de mettre à disposition des déployeurs la documentation technique nécessaire (Article 13). L'absence de réponse pourrait nous contraindre à reconsidérer l'utilisation de votre solution dans notre organisation.`,
    description: 'Rappel des obligations légales du fournisseur'
  },
  {
    id: 'menace_strong',
    name: 'Mention AI Act (ferme)',
    icon: '⚠️',
    content: `Nous attirons votre attention sur le fait que le non-respect des obligations de transparence et de documentation prévues par l'AI Act peut entraîner des sanctions allant jusqu'à 15 millions d'euros ou 3% du chiffre d'affaires mondial (Article 99).

Dans l'hypothèse où cette documentation ne nous serait pas fournie, nous serions dans l'obligation de :
- Documenter votre refus dans notre registre de conformité
- Envisager la suspension de l'utilisation de votre solution
- Signaler cette situation à notre autorité de contrôle compétente`,
    description: 'Version plus directive avec rappel des sanctions'
  },
  {
    id: 'nda',
    name: 'Proposition de NDA',
    icon: '🔒',
    content: `Nous comprenons que certaines informations puissent être considérées comme confidentielles. Nous vous proposons :
- La signature d'un accord de confidentialité (NDA) préalable
- La transmission d'une version synthétique ou anonymisée
- Un échange technique en visioconférence avec vos équipes

Notre objectif n'est pas d'obtenir vos secrets industriels, mais de disposer des informations nécessaires pour démontrer notre conformité en cas de contrôle.`,
    description: 'Propose des alternatives si le fournisseur invoque la confidentialité'
  },
  {
    id: 'contact',
    name: 'Coordonnées',
    icon: '📞',
    content: `Je reste à votre disposition pour tout complément d'information.

Vous pouvez me joindre :
- Par email : [votre email]
- Par téléphone : [votre téléphone]

Nous vous remercions par avance de votre collaboration.`,
    description: 'Formule de politesse et coordonnées'
  }
];

// ============================================
// ICONS
// ============================================
const Icons = {
  Copy: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>,
  Download: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
  Check: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-full h-full"><polyline points="20 6 9 17 4 12"/></svg>,
  Plus: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  Trash: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>,
  Mail: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
};

// ============================================
// MAIN COMPONENT
// ============================================
export default function SmartEmailEditor({
  onComplete,
  moduleColor = '#00FF88'
}: {
  onComplete?: () => void;
  moduleColor?: string;
}) {
  const [supplierName, setSupplierName] = useState('');
  const [productName, setProductName] = useState('');
  const [emailContent, setEmailContent] = useState(`Objet : Demande de documentation technique - Conformité AI Act

Madame, Monsieur,

[Cliquez sur les boutons ci-dessous pour construire votre email]

Cordialement,

[Votre signature]`);
  const [copied, setCopied] = useState(false);
  const [selectedSections, setSelectedSections] = useState<string[]>([]);

  // Insert section into email
  const insertSection = (section: EmailSection) => {
    // Replace placeholders
    let content = section.content;
    if (supplierName) {
      content = content.replace(/\[nom du fournisseur\]/g, supplierName);
    }
    if (productName) {
      content = content.replace(/\[nom du produit\]/g, productName);
    }

    // Find cursor position or append
    const placeholder = '[Cliquez sur les boutons ci-dessous pour construire votre email]';
    if (emailContent.includes(placeholder)) {
      setEmailContent(emailContent.replace(placeholder, content + '\n\n' + placeholder));
    } else {
      // Insert before "Cordialement"
      const cordialementIndex = emailContent.indexOf('Cordialement');
      if (cordialementIndex > -1) {
        setEmailContent(
          emailContent.slice(0, cordialementIndex) + 
          content + '\n\n' + 
          emailContent.slice(cordialementIndex)
        );
      } else {
        setEmailContent(emailContent + '\n\n' + content);
      }
    }

    setSelectedSections([...selectedSections, section.id]);
  };

  // Copy to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(emailContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Download as .txt
  const downloadEmail = () => {
    const blob = new Blob([emailContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `email-documentation-${supplierName || 'fournisseur'}.txt`;
    link.click();
  };

  // Reset email
  const resetEmail = () => {
    setEmailContent(`Objet : Demande de documentation technique - Conformité AI Act

Madame, Monsieur,

[Cliquez sur les boutons ci-dessous pour construire votre email]

Cordialement,

[Votre signature]`);
    setSelectedSections([]);
  };

  return (
    <div className="min-h-[600px]">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">📧 Éditeur d'Email Intelligent</h2>
        <p className="text-white/60">
          Construisez un email professionnel pour demander la documentation technique à vos fournisseurs.
        </p>
      </div>

      {/* Context Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm text-white/60 mb-2">Nom du fournisseur</label>
          <input
            type="text"
            value={supplierName}
            onChange={(e) => setSupplierName(e.target.value)}
            placeholder="Ex: Microsoft, OpenAI, Salesforce..."
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-white/30"
          />
        </div>
        <div>
          <label className="block text-sm text-white/60 mb-2">Nom du produit/solution</label>
          <input
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            placeholder="Ex: Copilot, ChatGPT Enterprise..."
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-white/30"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Section Buttons */}
        <div>
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            🧩 Sections à insérer
          </h3>
          <div className="space-y-2">
            {EMAIL_SECTIONS.map((section) => {
              const isAdded = selectedSections.includes(section.id);
              
              return (
                <button
                  key={section.id}
                  onClick={() => !isAdded && insertSection(section)}
                  disabled={isAdded}
                  className={`w-full p-3 rounded-xl text-left transition-all flex items-center gap-3 ${
                    isAdded 
                      ? 'bg-green-500/10 border border-green-500/30 cursor-default' 
                      : 'bg-white/5 hover:bg-white/10 border border-transparent'
                  }`}
                >
                  <span className="text-xl">{section.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{section.name}</p>
                    <p className="text-xs text-white/40 truncate">{section.description}</p>
                  </div>
                  {isAdded ? (
                    <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                      <div className="w-4 h-4 text-black"><Icons.Check /></div>
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center">
                      <div className="w-4 h-4 text-white/60"><Icons.Plus /></div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Email Preview */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold flex items-center gap-2">
              <div className="w-5 h-5"><Icons.Mail /></div>
              Votre email
            </h3>
            <button
              onClick={resetEmail}
              className="text-sm text-white/40 hover:text-white flex items-center gap-1"
            >
              <div className="w-4 h-4"><Icons.Trash /></div>
              Recommencer
            </button>
          </div>
          
          <div className="bg-white/5 rounded-xl overflow-hidden">
            <textarea
              value={emailContent}
              onChange={(e) => setEmailContent(e.target.value)}
              className="w-full h-[400px] bg-transparent p-4 text-sm text-white/90 font-mono resize-none focus:outline-none"
            />
          </div>

          {/* Actions */}
          <div className="grid grid-cols-2 gap-3 mt-4">
            <button
              onClick={copyToClipboard}
              className={`flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-all ${
                copied ? 'bg-green-500 text-white' : 'bg-white/10 hover:bg-white/20'
              }`}
            >
              <div className="w-5 h-5">
                {copied ? <Icons.Check /> : <Icons.Copy />}
              </div>
              {copied ? 'Copié !' : 'Copier'}
            </button>
            
            <button
              onClick={downloadEmail}
              className="flex items-center justify-center gap-2 py-3 rounded-xl bg-white/10 hover:bg-white/20 font-medium transition-colors"
            >
              <div className="w-5 h-5"><Icons.Download /></div>
              Télécharger
            </button>
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="mt-6 bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
        <h4 className="font-medium text-blue-400 mb-2">💡 Conseils</h4>
        <ul className="text-sm text-white/60 space-y-1">
          <li>• Commencez par l'<strong>introduction formelle</strong> puis la <strong>demande de documentation</strong></li>
          <li>• Ajoutez un <strong>délai</strong> pour montrer l'urgence</li>
          <li>• Si le fournisseur refuse, proposez un <strong>NDA</strong></li>
          <li>• En dernier recours, utilisez la <strong>mention ferme</strong> avec rappel des sanctions</li>
        </ul>
      </div>

      {/* Complete Button */}
      <button
        onClick={onComplete}
        disabled={selectedSections.length < 3}
        className="w-full mt-6 py-4 rounded-xl font-semibold text-black disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        style={{ backgroundColor: moduleColor }}
      >
        {selectedSections.length < 3 
          ? `Ajoutez au moins 3 sections (${selectedSections.length}/3)` 
          : 'Valider l\'exercice'}
      </button>
    </div>
  );
}
