'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ============================================
// TYPES
// ============================================
interface FormData {
  companyName: string;
  website: string;
  email: string;
  address: string;
  siret: string;
  dpo: string;
  aiSystems: {
    chatbot: boolean;
    recommendations: boolean;
    analytics: boolean;
    contentGen: boolean;
    other: string;
  };
}

// ============================================
// ICONS
// ============================================
const Icons = {
  Copy: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>,
  Download: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
  Check: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-full h-full"><polyline points="20 6 9 17 4 12"/></svg>,
  RefreshCw: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>,
};

// ============================================
// MENTION TEMPLATES
// ============================================
const generateMentions = (data: FormData): string => {
  const date = new Date().toLocaleDateString('fr-FR');
  
  let mentions = `═══════════════════════════════════════════════════════════════════
MENTIONS LÉGALES - UTILISATION DE L'INTELLIGENCE ARTIFICIELLE
Conformément au Règlement européen sur l'IA (AI Act - 2024/1689)
═══════════════════════════════════════════════════════════════════

📋 IDENTIFICATION DE L'ÉDITEUR
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Raison sociale : ${data.companyName}
Site web : ${data.website}
SIRET : ${data.siret}
Adresse : ${data.address}
Email de contact : ${data.email}


🤖 SYSTÈMES D'INTELLIGENCE ARTIFICIELLE UTILISÉS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Conformément à l'article 50 du Règlement (UE) 2024/1689 sur l'intelligence 
artificielle (AI Act), nous vous informons de l'utilisation des systèmes 
d'IA suivants sur notre plateforme :

`;

  if (data.aiSystems.chatbot) {
    mentions += `✦ ASSISTANT CONVERSATIONNEL (CHATBOT)
   • Nature : Système d'IA générative pour l'assistance client
   • Fonction : Répondre à vos questions et vous orienter
   • Transparence : Vous êtes informé(e) dès le début de la conversation 
     que vous interagissez avec une intelligence artificielle
   • Données : Les conversations peuvent être analysées pour améliorer 
     le service (dans le respect du RGPD)
   • Supervision : Un opérateur humain peut reprendre la conversation

`;
  }

  if (data.aiSystems.recommendations) {
    mentions += `✦ SYSTÈME DE RECOMMANDATIONS PERSONNALISÉES
   • Nature : Algorithme de recommandation basé sur l'IA
   • Fonction : Suggérer des produits/contenus adaptés à vos préférences
   • Base : Analyse de votre historique de navigation et d'achat
   • Transparence : Les recommandations sont signalées comme "suggérées par IA"
   • Opt-out : Vous pouvez désactiver cette fonctionnalité dans vos paramètres

`;
  }

  if (data.aiSystems.analytics) {
    mentions += `✦ ANALYSES PRÉDICTIVES
   • Nature : Outils d'analyse comportementale
   • Fonction : Améliorer l'expérience utilisateur et la qualité de service
   • Données : Données agrégées et anonymisées
   • Impact : Aucune décision automatisée affectant vos droits

`;
  }

  if (data.aiSystems.contentGen) {
    mentions += `✦ GÉNÉRATION DE CONTENU
   • Nature : IA générative pour la création de textes/images
   • Fonction : Assistance à la rédaction de contenus
   • Transparence : Les contenus générés par IA sont identifiés comme tels
   • Supervision : Tous les contenus sont validés par un humain avant publication

`;
  }

  if (data.aiSystems.other) {
    mentions += `✦ AUTRES SYSTÈMES
   • ${data.aiSystems.other}

`;
  }

  mentions += `
⚖️ VOS DROITS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
En vertu du RGPD et de l'AI Act, vous disposez des droits suivants :

• Droit à l'information sur l'utilisation de l'IA
• Droit d'opposition à la prise de décision automatisée
• Droit de demander une intervention humaine
• Droit d'accès aux données utilisées par les systèmes d'IA
• Droit de rectification et de suppression

Pour exercer ces droits, contactez notre DPO :
📧 ${data.dpo}


🔒 GARANTIES DE CONFORMITÉ
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${data.companyName} s'engage à :

✓ Ne pas utiliser de systèmes d'IA interdits (Art. 5 AI Act)
✓ Maintenir une supervision humaine appropriée
✓ Garantir la transparence des systèmes d'IA
✓ Protéger vos données personnelles (RGPD)
✓ Former ses équipes à l'utilisation responsable de l'IA (Art. 4 AI Act)


📅 Dernière mise à jour : ${date}

═══════════════════════════════════════════════════════════════════
Document généré automatiquement - Formation AI Act
Conformité vérifiée selon les exigences du Règlement (UE) 2024/1689
═══════════════════════════════════════════════════════════════════`;

  return mentions;
};

// ============================================
// MAIN COMPONENT
// ============================================
export default function LegalMentionsGenerator({
  onComplete,
  moduleColor = '#FFB800'
}: {
  onComplete?: () => void;
  moduleColor?: string;
}) {
  const [step, setStep] = useState<'form' | 'preview'>('form');
  const [copied, setCopied] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    companyName: '',
    website: '',
    email: '',
    address: '',
    siret: '',
    dpo: '',
    aiSystems: {
      chatbot: false,
      recommendations: false,
      analytics: false,
      contentGen: false,
      other: ''
    }
  });

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleAISystemChange = (system: keyof typeof formData.aiSystems, value: boolean | string) => {
    setFormData({
      ...formData,
      aiSystems: { ...formData.aiSystems, [system]: value }
    });
  };

  const isFormValid = () => {
    return formData.companyName && formData.website && formData.email && 
           (formData.aiSystems.chatbot || formData.aiSystems.recommendations || 
            formData.aiSystems.analytics || formData.aiSystems.contentGen || formData.aiSystems.other);
  };

  const generatedMentions = generateMentions(formData);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedMentions);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadAsText = () => {
    const blob = new Blob([generatedMentions], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `mentions-legales-ia-${formData.companyName.toLowerCase().replace(/\s+/g, '-')}.txt`;
    link.click();
  };

  const downloadAsHTML = () => {
    const html = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Mentions Légales IA - ${formData.companyName}</title>
  <style>
    body { font-family: 'Segoe UI', Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 40px 20px; line-height: 1.6; color: #333; }
    h1 { color: #1a1a1a; border-bottom: 3px solid #8B5CF6; padding-bottom: 10px; }
    h2 { color: #8B5CF6; margin-top: 30px; }
    .system { background: #f5f5f5; padding: 15px 20px; border-left: 4px solid #8B5CF6; margin: 15px 0; }
    .system h3 { margin: 0 0 10px 0; color: #1a1a1a; }
    ul { padding-left: 20px; }
    .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 0.9em; color: #666; }
  </style>
</head>
<body>
  <h1>🤖 Mentions Légales - Intelligence Artificielle</h1>
  <p><strong>Conformément au Règlement européen sur l'IA (AI Act - 2024/1689)</strong></p>
  
  <h2>📋 Identification</h2>
  <p>
    <strong>${formData.companyName}</strong><br>
    Site : ${formData.website}<br>
    SIRET : ${formData.siret}<br>
    Adresse : ${formData.address}<br>
    Contact : ${formData.email}
  </p>
  
  <h2>🤖 Systèmes d'IA utilisés</h2>
  <p>Conformément à l'article 50 du Règlement (UE) 2024/1689, nous vous informons de l'utilisation des systèmes d'IA suivants :</p>
  
  ${formData.aiSystems.chatbot ? `<div class="system">
    <h3>💬 Assistant Conversationnel</h3>
    <ul>
      <li>Système d'IA générative pour l'assistance client</li>
      <li>Vous êtes informé(e) que vous interagissez avec une IA</li>
      <li>Un opérateur humain peut reprendre la conversation</li>
    </ul>
  </div>` : ''}
  
  ${formData.aiSystems.recommendations ? `<div class="system">
    <h3>🎯 Recommandations Personnalisées</h3>
    <ul>
      <li>Algorithme de recommandation basé sur l'IA</li>
      <li>Basé sur votre historique de navigation</li>
      <li>Désactivable dans vos paramètres</li>
    </ul>
  </div>` : ''}
  
  ${formData.aiSystems.analytics ? `<div class="system">
    <h3>📊 Analyses Prédictives</h3>
    <ul>
      <li>Outils d'analyse pour améliorer l'expérience</li>
      <li>Données agrégées et anonymisées</li>
    </ul>
  </div>` : ''}
  
  ${formData.aiSystems.contentGen ? `<div class="system">
    <h3>✍️ Génération de Contenu</h3>
    <ul>
      <li>IA générative pour la création de contenus</li>
      <li>Contenus identifiés et validés par un humain</li>
    </ul>
  </div>` : ''}
  
  <h2>⚖️ Vos Droits</h2>
  <ul>
    <li>Droit à l'information sur l'utilisation de l'IA</li>
    <li>Droit d'opposition à la décision automatisée</li>
    <li>Droit de demander une intervention humaine</li>
    <li>Droit d'accès, rectification et suppression</li>
  </ul>
  <p>Contact DPO : ${formData.dpo}</p>
  
  <div class="footer">
    <p>Dernière mise à jour : ${new Date().toLocaleDateString('fr-FR')}</p>
    <p>Document conforme au Règlement (UE) 2024/1689 (AI Act)</p>
  </div>
</body>
</html>`;
    
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `mentions-legales-ia-${formData.companyName.toLowerCase().replace(/\s+/g, '-')}.html`;
    link.click();
  };

  return (
    <div className="min-h-[500px]">
      <AnimatePresence mode="wait">
        {step === 'form' && (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {/* Header */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">📜 Générateur de Mentions Légales IA</h2>
              <p className="text-white/60">
                Créez vos mentions légales conformes à l'article 50 de l'AI Act en 2 minutes.
              </p>
            </div>

            {/* Form */}
            <div className="space-y-6">
              {/* Company Info */}
              <div className="bg-white/5 rounded-xl p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  🏢 Informations de l'entreprise
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-white/60 mb-2">Raison sociale *</label>
                    <input
                      type="text"
                      value={formData.companyName}
                      onChange={(e) => handleInputChange('companyName', e.target.value)}
                      placeholder="Ex: Ma Société SAS"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-white/30"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-white/60 mb-2">Site web *</label>
                    <input
                      type="text"
                      value={formData.website}
                      onChange={(e) => handleInputChange('website', e.target.value)}
                      placeholder="Ex: www.masociete.fr"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-white/30"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-white/60 mb-2">SIRET</label>
                    <input
                      type="text"
                      value={formData.siret}
                      onChange={(e) => handleInputChange('siret', e.target.value)}
                      placeholder="Ex: 123 456 789 00012"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-white/30"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-white/60 mb-2">Email de contact *</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="Ex: contact@masociete.fr"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-white/30"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm text-white/60 mb-2">Adresse</label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      placeholder="Ex: 123 rue de l'IA, 75001 Paris"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-white/30"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm text-white/60 mb-2">Email du DPO</label>
                    <input
                      type="email"
                      value={formData.dpo}
                      onChange={(e) => handleInputChange('dpo', e.target.value)}
                      placeholder="Ex: dpo@masociete.fr"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-white/30"
                    />
                  </div>
                </div>
              </div>

              {/* AI Systems */}
              <div className="bg-white/5 rounded-xl p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  🤖 Systèmes d'IA utilisés *
                </h3>
                <p className="text-sm text-white/40 mb-4">
                  Cochez les systèmes d'IA présents sur votre site/application
                </p>
                
                <div className="space-y-3">
                  {[
                    { key: 'chatbot', label: '💬 Chatbot / Assistant conversationnel', desc: 'Ex: Service client automatisé' },
                    { key: 'recommendations', label: '🎯 Système de recommandations', desc: 'Ex: "Produits suggérés pour vous"' },
                    { key: 'analytics', label: '📊 Analyses prédictives', desc: 'Ex: Prédiction de comportement utilisateur' },
                    { key: 'contentGen', label: '✍️ Génération de contenu', desc: 'Ex: Textes ou images générés par IA' },
                  ].map(({ key, label, desc }) => (
                    <label
                      key={key}
                      className={`flex items-start gap-4 p-4 rounded-xl cursor-pointer transition-all ${
                        formData.aiSystems[key as keyof typeof formData.aiSystems]
                          ? 'bg-white/10 border-2'
                          : 'bg-white/5 border-2 border-transparent hover:bg-white/10'
                      }`}
                      style={formData.aiSystems[key as keyof typeof formData.aiSystems] ? { borderColor: moduleColor } : {}}
                    >
                      <input
                        type="checkbox"
                        checked={formData.aiSystems[key as keyof typeof formData.aiSystems] as boolean}
                        onChange={(e) => handleAISystemChange(key as keyof typeof formData.aiSystems, e.target.checked)}
                        className="sr-only"
                      />
                      <div 
                        className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          formData.aiSystems[key as keyof typeof formData.aiSystems]
                            ? ''
                            : 'bg-white/10'
                        }`}
                        style={formData.aiSystems[key as keyof typeof formData.aiSystems] ? { backgroundColor: moduleColor } : {}}
                      >
                        {formData.aiSystems[key as keyof typeof formData.aiSystems] && (
                          <div className="w-4 h-4 text-black"><Icons.Check /></div>
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{label}</p>
                        <p className="text-sm text-white/40">{desc}</p>
                      </div>
                    </label>
                  ))}

                  <div className="pt-2">
                    <label className="block text-sm text-white/60 mb-2">Autre système (optionnel)</label>
                    <input
                      type="text"
                      value={formData.aiSystems.other}
                      onChange={(e) => handleAISystemChange('other', e.target.value)}
                      placeholder="Ex: Système de détection de fraude..."
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-white/30"
                    />
                  </div>
                </div>
              </div>

              {/* Generate Button */}
              <button
                onClick={() => setStep('preview')}
                disabled={!isFormValid()}
                className="w-full py-4 rounded-xl font-semibold text-black disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-[1.02]"
                style={{ backgroundColor: moduleColor }}
              >
                ✨ Générer mes mentions légales
              </button>
            </div>
          </motion.div>
        )}

        {step === 'preview' && (
          <motion.div
            key="preview"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold mb-1">✅ Mentions légales générées</h2>
                <p className="text-white/60 text-sm">Conformes à l'article 50 de l'AI Act</p>
              </div>
              <button
                onClick={() => setStep('form')}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
              >
                <div className="w-4 h-4"><Icons.RefreshCw /></div>
                Modifier
              </button>
            </div>

            {/* Preview */}
            <div className="bg-white/5 rounded-xl p-6 mb-6 max-h-[400px] overflow-y-auto">
              <pre className="whitespace-pre-wrap text-sm text-white/80 font-mono">
                {generatedMentions}
              </pre>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
              <button
                onClick={copyToClipboard}
                className={`flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-all ${
                  copied ? 'bg-green-500 text-white' : 'bg-white/10 hover:bg-white/20'
                }`}
              >
                <div className="w-5 h-5">
                  {copied ? <Icons.Check /> : <Icons.Copy />}
                </div>
                {copied ? 'Copié !' : 'Copier le texte'}
              </button>
              
              <button
                onClick={downloadAsText}
                className="flex items-center justify-center gap-2 py-3 rounded-xl bg-white/10 hover:bg-white/20 font-medium transition-colors"
              >
                <div className="w-5 h-5"><Icons.Download /></div>
                Télécharger .txt
              </button>
              
              <button
                onClick={downloadAsHTML}
                className="flex items-center justify-center gap-2 py-3 rounded-xl bg-white/10 hover:bg-white/20 font-medium transition-colors"
              >
                <div className="w-5 h-5"><Icons.Download /></div>
                Télécharger .html
              </button>
            </div>

            {/* Complete Button */}
            <button
              onClick={onComplete}
              className="w-full py-4 rounded-xl font-semibold text-black"
              style={{ backgroundColor: moduleColor }}
            >
              Valider l'exercice
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
