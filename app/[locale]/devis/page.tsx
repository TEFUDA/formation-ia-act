'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

const Icons = {
  Shield: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  ArrowRight: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
  ArrowLeft: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>,
  Check: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-full h-full"><polyline points="20 6 9 17 4 12"/></svg>,
  Download: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
  Building: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/></svg>,
  Users: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  FileText: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
  Mail: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
};

// Pricing logic
const calculatePrice = (users: number) => {
  if (users <= 0) return { unitPrice: 0, total: 0, savings: 0, tier: '' };
  
  if (users === 1) {
    return { unitPrice: 4990, total: 4990, savings: 0, tier: 'Solo' };
  } else if (users >= 2 && users <= 5) {
    const total = 9990;
    const unitPrice = Math.round(total / users);
    const savings = users * 4990 - total;
    return { unitPrice, total, savings, tier: 'Équipe' };
  } else {
    // Plus de 5 personnes = sur devis
    return { unitPrice: 0, total: 0, savings: 0, tier: 'Devis personnalisé' };
  }
};

const NeuralBackground = () => (
  <div className="fixed inset-0 pointer-events-none overflow-hidden">
    <div className="absolute inset-0 bg-[#030014]" />
    <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-[#8B5CF6]/8 blur-[120px] rounded-full" />
    <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#00F5FF]/6 blur-[100px] rounded-full" />
  </div>
);

const HoloCard = ({ children, glow = '#8B5CF6', className = '' }: { children: React.ReactNode, glow?: string, className?: string }) => (
  <div className={`relative ${className}`}>
    <div className="absolute -inset-[1px] rounded-2xl opacity-30" style={{ background: `linear-gradient(135deg, ${glow}40, transparent 50%, ${glow}40)` }} />
    <div className="relative bg-[#0A0A1B]/90 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent" />
      <div className="relative">{children}</div>
    </div>
  </div>
);

interface FormData {
  // Step 1: Company info
  companyName: string;
  siret: string;
  address: string;
  postalCode: string;
  city: string;
  country: string;
  // Step 2: Contact
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  contactRole: string;
  // Step 3: Configuration
  users: number;
  opcoFinancing: boolean;
  opcoName: string;
}

const initialFormData: FormData = {
  companyName: '',
  siret: '',
  address: '',
  postalCode: '',
  city: '',
  country: 'France',
  contactName: '',
  contactEmail: '',
  contactPhone: '',
  contactRole: '',
  users: 10,
  opcoFinancing: false,
  opcoName: '',
};

export default function DevisPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isGenerating, setIsGenerating] = useState(false);
  const [quoteGenerated, setQuoteGenerated] = useState(false);
  const [quoteNumber, setQuoteNumber] = useState('');

  const pricing = calculatePrice(formData.users);

  const updateForm = (field: keyof FormData, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateStep = (stepNum: number): boolean => {
    switch (stepNum) {
      case 1:
        return !!(formData.companyName && formData.siret && formData.address && formData.postalCode && formData.city);
      case 2:
        return !!(formData.contactName && formData.contactEmail && formData.contactPhone);
      case 3:
        return formData.users >= 1;
      default:
        return true;
    }
  };

  const generateQuote = async () => {
    setIsGenerating(true);
    // Simulate PDF generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    const number = `DEV-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`;
    setQuoteNumber(number);
    setIsGenerating(false);
    setQuoteGenerated(true);
  };

  const downloadPDF = () => {
    // Create PDF content as HTML for printing
    const content = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Devis ${quoteNumber}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Helvetica Neue', Arial, sans-serif; padding: 40px; color: #1a1a2e; line-height: 1.6; }
    .header { display: flex; justify-content: space-between; margin-bottom: 40px; padding-bottom: 20px; border-bottom: 2px solid #00F5FF; }
    .logo { font-size: 24px; font-weight: bold; color: #1a1a2e; }
    .logo span { color: #00F5FF; }
    .quote-info { text-align: right; }
    .quote-number { font-size: 18px; font-weight: bold; color: #8B5CF6; }
    .date { color: #666; margin-top: 5px; }
    .section { margin-bottom: 30px; }
    .section-title { font-size: 14px; font-weight: bold; color: #8B5CF6; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px; }
    .company-info { background: #f8f9fa; padding: 20px; border-radius: 8px; }
    .company-name { font-size: 18px; font-weight: bold; margin-bottom: 10px; }
    .info-row { display: flex; gap: 40px; margin-bottom: 20px; }
    .info-block { flex: 1; }
    .info-label { font-size: 12px; color: #666; margin-bottom: 2px; }
    .info-value { font-weight: 500; }
    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
    th { background: #1a1a2e; color: white; padding: 12px; text-align: left; font-size: 12px; text-transform: uppercase; }
    td { padding: 15px 12px; border-bottom: 1px solid #eee; }
    .total-row { background: #f0f9ff; font-weight: bold; }
    .total-row td { border-bottom: none; }
    .savings { color: #00C853; font-size: 14px; }
    .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; }
    .validity { background: #fff3e0; padding: 15px; border-radius: 8px; margin-bottom: 20px; }
    .terms { font-size: 12px; color: #666; }
    .cta { background: linear-gradient(135deg, #8B5CF6, #00F5FF); color: white; padding: 20px; border-radius: 8px; text-align: center; margin-top: 30px; }
    .cta-title { font-size: 18px; font-weight: bold; margin-bottom: 5px; }
    .cta-text { font-size: 14px; opacity: 0.9; }
    .badge { display: inline-block; background: #00C853; color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; margin-left: 10px; }
    @media print { body { padding: 20px; } }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="logo">Formation<span>-IA-Act</span>.fr</div>
      <p style="color: #666; font-size: 14px; margin-top: 5px;">Organisme de formation certifié Qualiopi</p>
    </div>
    <div class="quote-info">
      <div class="quote-number">${quoteNumber}</div>
      <div class="date">${new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
    </div>
  </div>

  <div class="info-row">
    <div class="info-block">
      <div class="section-title">Émetteur</div>
      <div class="company-info">
        <div class="company-name">Formation IA Act SAS</div>
        <p>123 Avenue de l'Innovation</p>
        <p>75001 Paris, France</p>
        <p style="margin-top: 10px;">SIRET: 123 456 789 00012</p>
        <p>N° Formation: 11 75 12345 75</p>
        <p style="color: #00C853; font-weight: 500;">✓ Certifié Qualiopi</p>
      </div>
    </div>
    <div class="info-block">
      <div class="section-title">Client</div>
      <div class="company-info">
        <div class="company-name">${formData.companyName}</div>
        <p>${formData.address}</p>
        <p>${formData.postalCode} ${formData.city}, ${formData.country}</p>
        <p style="margin-top: 10px;">SIRET: ${formData.siret}</p>
        <p>Contact: ${formData.contactName}</p>
        <p>${formData.contactEmail}</p>
      </div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">Détail de la prestation</div>
    <table>
      <thead>
        <tr>
          <th style="width: 50%;">Désignation</th>
          <th style="text-align: center;">Quantité</th>
          <th style="text-align: right;">Prix unitaire HT</th>
          <th style="text-align: right;">Total HT</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <strong>Formation AI Act - Pack ${pricing.tier}</strong>
            <p style="font-size: 13px; color: #666; margin-top: 5px;">Formation complète 8h (6 modules vidéo)</p>
          </td>
          <td style="text-align: center;">${formData.users}</td>
          <td style="text-align: right;">${pricing.unitPrice.toLocaleString('fr-FR')} €</td>
          <td style="text-align: right;">${pricing.total.toLocaleString('fr-FR')} €</td>
        </tr>
        <tr>
          <td>
            <strong>12 Templates juridiques</strong>
            <p style="font-size: 13px; color: #666; margin-top: 5px;">Registre IA, Politique IA, FRIA, Documentation technique...</p>
          </td>
          <td style="text-align: center;">12</td>
          <td style="text-align: right;">Inclus</td>
          <td style="text-align: right;">-</td>
        </tr>
        <tr>
          <td>
            <strong>12 Vidéos pratiques</strong>
            <p style="font-size: 13px; color: #666; margin-top: 5px;">Tutoriels pour chaque template</p>
          </td>
          <td style="text-align: center;">12</td>
          <td style="text-align: right;">Inclus</td>
          <td style="text-align: right;">-</td>
        </tr>
        <tr>
          <td>
            <strong>Audit de conformité AI Act</strong>
            <p style="font-size: 13px; color: #666; margin-top: 5px;">150+ questions, rapport PDF personnalisé</p>
          </td>
          <td style="text-align: center;">${formData.users}</td>
          <td style="text-align: right;">Inclus</td>
          <td style="text-align: right;">-</td>
        </tr>
        <tr>
          <td>
            <strong>Certificat de formation</strong>
            <p style="font-size: 13px; color: #666; margin-top: 5px;">Certificat nominatif avec QR code vérifiable</p>
          </td>
          <td style="text-align: center;">${formData.users}</td>
          <td style="text-align: right;">Inclus</td>
          <td style="text-align: right;">-</td>
        </tr>
        ${formData.users >= 10 ? `
        <tr>
          <td>
            <strong>Dashboard administrateur</strong>
            <p style="font-size: 13px; color: #666; margin-top: 5px;">Suivi de progression de l'équipe</p>
          </td>
          <td style="text-align: center;">1</td>
          <td style="text-align: right;">Inclus</td>
          <td style="text-align: right;">-</td>
        </tr>
        ` : ''}
        ${formData.users >= 25 ? `
        <tr>
          <td>
            <strong>Support prioritaire</strong>
            <p style="font-size: 13px; color: #666; margin-top: 5px;">Réponse sous 4h ouvrées</p>
          </td>
          <td style="text-align: center;">12 mois</td>
          <td style="text-align: right;">Inclus</td>
          <td style="text-align: right;">-</td>
        </tr>
        ` : ''}
        ${formData.users >= 50 ? `
        <tr>
          <td>
            <strong>Webinaire privé (2h)</strong>
            <p style="font-size: 13px; color: #666; margin-top: 5px;">Session Q&A avec un expert</p>
          </td>
          <td style="text-align: center;">1</td>
          <td style="text-align: right;">Inclus</td>
          <td style="text-align: right;">-</td>
        </tr>
        <tr>
          <td>
            <strong>Account Manager dédié</strong>
            <p style="font-size: 13px; color: #666; margin-top: 5px;">Interlocuteur unique</p>
          </td>
          <td style="text-align: center;">1</td>
          <td style="text-align: right;">Inclus</td>
          <td style="text-align: right;">-</td>
        </tr>
        ` : ''}
      </tbody>
      <tfoot>
        <tr>
          <td colspan="3" style="text-align: right; padding-top: 20px;"><strong>Total HT</strong></td>
          <td style="text-align: right; padding-top: 20px;"><strong>${pricing.total.toLocaleString('fr-FR')} €</strong></td>
        </tr>
        <tr>
          <td colspan="3" style="text-align: right;">TVA (20%)</td>
          <td style="text-align: right;">${(pricing.total * 0.2).toLocaleString('fr-FR')} €</td>
        </tr>
        <tr class="total-row">
          <td colspan="3" style="text-align: right; font-size: 18px;"><strong>Total TTC</strong></td>
          <td style="text-align: right; font-size: 18px;"><strong>${(pricing.total * 1.2).toLocaleString('fr-FR')} €</strong></td>
        </tr>
        ${pricing.savings > 0 ? `
        <tr>
          <td colspan="4" style="text-align: right;" class="savings">
            ✓ Économie réalisée : ${pricing.savings.toLocaleString('fr-FR')} € (${Math.round((pricing.savings / (formData.users * 4990)) * 100)}% de réduction)
          </td>
        </tr>
        ` : ''}
      </tfoot>
    </table>
  </div>

  ${formData.opcoFinancing ? `
  <div class="validity" style="background: #e8f5e9;">
    <strong style="color: #2e7d32;">💰 Financement OPCO demandé</strong>
    <p style="margin-top: 5px; font-size: 14px;">OPCO : ${formData.opcoName || 'À préciser'}</p>
    <p style="font-size: 14px;">Notre formation est certifiée Qualiopi et éligible à une prise en charge jusqu'à 100%.</p>
  </div>
  ` : ''}

  <div class="validity">
    <strong>⏰ Validité du devis</strong>
    <p style="margin-top: 5px;">Ce devis est valable 30 jours à compter de sa date d'émission.</p>
  </div>

  <div class="terms">
    <strong>Conditions :</strong>
    <ul style="margin-top: 10px; margin-left: 20px;">
      <li>Paiement : À réception de facture ou financement OPCO</li>
      <li>Accès à la plateforme : 12 mois à compter de l'activation</li>
      <li>Garantie satisfait ou remboursé : 30 jours</li>
    </ul>
  </div>

  <div class="cta">
    <div class="cta-title">Prêt à démarrer ?</div>
    <div class="cta-text">Contactez-nous : contact@formation-ia-act.fr</div>
  </div>

  <div style="margin-top: 40px; text-align: center; font-size: 12px; color: #999;">
    Formation IA Act SAS - SIRET 123 456 789 00012 - RCS Paris B 123 456 789<br>
    N° de déclaration d'activité : 11 75 12345 75 - Certifié Qualiopi
  </div>
</body>
</html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(content);
      printWindow.document.close();
      setTimeout(() => {
        printWindow.print();
      }, 500);
    }
  };

  return (
    <div className="min-h-screen bg-[#030014] text-white">
      <NeuralBackground />

      {/* Header */}
      <header className="relative z-50 px-6 py-4 border-b border-white/5">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#00F5FF] to-[#0066FF] rounded-xl flex items-center justify-center">
              <div className="w-5 h-5 text-white"><Icons.Shield /></div>
            </div>
            <span className="font-bold text-lg hidden sm:block">Formation-IA-Act.fr</span>
          </Link>
          <Link href="/pricing" className="text-white/60 hover:text-white text-sm transition-colors flex items-center gap-2">
            <div className="w-4 h-4"><Icons.ArrowLeft /></div>
            Retour aux tarifs
          </Link>
        </div>
      </header>

      <main className="relative z-10 px-6 py-12">
        <div className="max-w-4xl mx-auto">
          
          {/* Title */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold mb-2">
              Générez votre <span className="text-[#8B5CF6]">devis personnalisé</span>
            </h1>
            <p className="text-white/60">En 2 minutes, obtenez un devis PDF professionnel</p>
          </motion.div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center gap-2 mb-8">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div 
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                    step > s ? 'bg-[#00FF88] text-black' : step === s ? 'bg-[#8B5CF6] text-white' : 'bg-white/10 text-white/40'
                  }`}
                >
                  {step > s ? <div className="w-5 h-5"><Icons.Check /></div> : s}
                </div>
                {s < 4 && <div className={`w-12 h-1 rounded ${step > s ? 'bg-[#00FF88]' : 'bg-white/10'}`} />}
              </div>
            ))}
          </div>

          {/* Step Labels */}
          <div className="flex justify-between mb-8 text-xs text-white/40 px-4">
            <span className={step >= 1 ? 'text-white/80' : ''}>Entreprise</span>
            <span className={step >= 2 ? 'text-white/80' : ''}>Contact</span>
            <span className={step >= 3 ? 'text-white/80' : ''}>Configuration</span>
            <span className={step >= 4 ? 'text-white/80' : ''}>Devis</span>
          </div>

          <AnimatePresence mode="wait">
            {/* Step 1: Company Info */}
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <HoloCard glow="#8B5CF6">
                  <div className="p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-lg bg-[#8B5CF6]/20 flex items-center justify-center">
                        <div className="w-5 h-5 text-[#8B5CF6]"><Icons.Building /></div>
                      </div>
                      <h2 className="text-xl font-bold">Informations entreprise</h2>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm text-white/60 mb-1">Raison sociale *</label>
                        <input
                          type="text"
                          value={formData.companyName}
                          onChange={(e) => updateForm('companyName', e.target.value)}
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-[#8B5CF6] transition-colors"
                          placeholder="Nom de votre entreprise"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-white/60 mb-1">SIRET *</label>
                        <input
                          type="text"
                          value={formData.siret}
                          onChange={(e) => updateForm('siret', e.target.value)}
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-[#8B5CF6] transition-colors"
                          placeholder="123 456 789 00012"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-white/60 mb-1">Adresse *</label>
                        <input
                          type="text"
                          value={formData.address}
                          onChange={(e) => updateForm('address', e.target.value)}
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-[#8B5CF6] transition-colors"
                          placeholder="Numéro et rue"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm text-white/60 mb-1">Code postal *</label>
                          <input
                            type="text"
                            value={formData.postalCode}
                            onChange={(e) => updateForm('postalCode', e.target.value)}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-[#8B5CF6] transition-colors"
                            placeholder="75001"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-white/60 mb-1">Ville *</label>
                          <input
                            type="text"
                            value={formData.city}
                            onChange={(e) => updateForm('city', e.target.value)}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-[#8B5CF6] transition-colors"
                            placeholder="Paris"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </HoloCard>
              </motion.div>
            )}

            {/* Step 2: Contact Info */}
            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <HoloCard glow="#00F5FF">
                  <div className="p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-lg bg-[#00F5FF]/20 flex items-center justify-center">
                        <div className="w-5 h-5 text-[#00F5FF]"><Icons.Mail /></div>
                      </div>
                      <h2 className="text-xl font-bold">Contact principal</h2>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm text-white/60 mb-1">Nom et prénom *</label>
                        <input
                          type="text"
                          value={formData.contactName}
                          onChange={(e) => updateForm('contactName', e.target.value)}
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-[#00F5FF] transition-colors"
                          placeholder="Jean Dupont"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-white/60 mb-1">Email professionnel *</label>
                        <input
                          type="email"
                          value={formData.contactEmail}
                          onChange={(e) => updateForm('contactEmail', e.target.value)}
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-[#00F5FF] transition-colors"
                          placeholder="jean.dupont@entreprise.com"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-white/60 mb-1">Téléphone *</label>
                        <input
                          type="tel"
                          value={formData.contactPhone}
                          onChange={(e) => updateForm('contactPhone', e.target.value)}
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-[#00F5FF] transition-colors"
                          placeholder="06 12 34 56 78"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-white/60 mb-1">Fonction</label>
                        <input
                          type="text"
                          value={formData.contactRole}
                          onChange={(e) => updateForm('contactRole', e.target.value)}
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-[#00F5FF] transition-colors"
                          placeholder="DPO, DSI, Responsable conformité..."
                        />
                      </div>
                    </div>
                  </div>
                </HoloCard>
              </motion.div>
            )}

            {/* Step 3: Configuration */}
            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <HoloCard glow="#00FF88">
                  <div className="p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-lg bg-[#00FF88]/20 flex items-center justify-center">
                        <div className="w-5 h-5 text-[#00FF88]"><Icons.Users /></div>
                      </div>
                      <h2 className="text-xl font-bold">Configuration</h2>
                    </div>

                    <div className="space-y-6">
                      {/* Users slider */}
                      <div>
                        <label className="block text-sm text-white/60 mb-3">Nombre de personnes à former</label>
                        <div className="flex items-center gap-4">
                          <input
                            type="range"
                            min="1"
                            max="100"
                            value={formData.users}
                            onChange={(e) => updateForm('users', parseInt(e.target.value))}
                            className="flex-1 h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#00FF88]"
                          />
                          <input
                            type="number"
                            min="1"
                            max="500"
                            value={formData.users}
                            onChange={(e) => updateForm('users', Math.max(1, parseInt(e.target.value) || 1))}
                            className="w-20 px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-center focus:outline-none focus:border-[#00FF88]"
                          />
                        </div>
                      </div>

                      {/* Pricing preview */}
                      <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-white/60">Pack</span>
                          <span className="text-[#00FF88] font-bold">{pricing.tier}</span>
                        </div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-white/60">Prix unitaire</span>
                          <span className="text-white font-medium">{pricing.unitPrice.toLocaleString('fr-FR')} € HT</span>
                        </div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-white/60">{formData.users} personne{formData.users > 1 ? 's' : ''}</span>
                          <span className="text-2xl font-bold text-white">{pricing.total.toLocaleString('fr-FR')} € HT</span>
                        </div>
                        {pricing.savings > 0 && (
                          <div className="flex items-center justify-between pt-4 border-t border-white/10">
                            <span className="text-[#00FF88]">Économie</span>
                            <span className="text-[#00FF88] font-bold">-{pricing.savings.toLocaleString('fr-FR')} €</span>
                          </div>
                        )}
                      </div>

                      {/* OPCO option */}
                      <div className="space-y-3">
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.opcoFinancing}
                            onChange={(e) => updateForm('opcoFinancing', e.target.checked)}
                            className="w-5 h-5 rounded border-white/20 bg-white/5 text-[#00FF88] focus:ring-[#00FF88]"
                          />
                          <span className="text-white">Je souhaite un financement OPCO</span>
                        </label>
                        
                        {formData.opcoFinancing && (
                          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                            <input
                              type="text"
                              value={formData.opcoName}
                              onChange={(e) => updateForm('opcoName', e.target.value)}
                              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-[#00FF88] transition-colors"
                              placeholder="Nom de votre OPCO (OPCO EP, ATLAS, AKTO...)"
                            />
                          </motion.div>
                        )}
                      </div>

                      {/* Pricing tiers info */}
                      <div className="text-xs text-white/40 space-y-1">
                        <p>💡 Tarifs :</p>
                        <p>• 1 pers: 4 990€ | 2-5 pers: 9 990€ (pack équipe)</p>
                        <p>• +5 pers: Devis personnalisé</p>
                      </div>
                    </div>
                  </div>
                </HoloCard>
              </motion.div>
            )}

            {/* Step 4: Generated Quote */}
            {step === 4 && (
              <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                {!quoteGenerated ? (
                  <HoloCard glow="#FFB800">
                    <div className="p-8 text-center">
                      <div className="flex items-center gap-3 justify-center mb-6">
                        <div className="w-10 h-10 rounded-lg bg-[#FFB800]/20 flex items-center justify-center">
                          <div className="w-5 h-5 text-[#FFB800]"><Icons.FileText /></div>
                        </div>
                        <h2 className="text-xl font-bold">Récapitulatif</h2>
                      </div>

                      <div className="text-left bg-white/5 rounded-xl p-6 border border-white/10 mb-6">
                        <div className="grid md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-white/40 mb-1">Entreprise</p>
                            <p className="font-medium">{formData.companyName}</p>
                            <p className="text-white/60">{formData.address}</p>
                            <p className="text-white/60">{formData.postalCode} {formData.city}</p>
                          </div>
                          <div>
                            <p className="text-white/40 mb-1">Contact</p>
                            <p className="font-medium">{formData.contactName}</p>
                            <p className="text-white/60">{formData.contactEmail}</p>
                            <p className="text-white/60">{formData.contactPhone}</p>
                          </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-white/10">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-white/40 text-sm">Formation pour</p>
                              <p className="font-bold text-xl">{formData.users} personne{formData.users > 1 ? 's' : ''}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-white/40 text-sm">Total HT</p>
                              <p className="font-bold text-2xl text-[#00FF88]">{pricing.total.toLocaleString('fr-FR')} €</p>
                            </div>
                          </div>
                          {formData.opcoFinancing && (
                            <p className="text-[#FFB800] text-sm mt-2">💰 Financement OPCO demandé{formData.opcoName ? ` (${formData.opcoName})` : ''}</p>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={generateQuote}
                        disabled={isGenerating}
                        className="inline-flex items-center gap-3 bg-gradient-to-r from-[#8B5CF6] to-[#00F5FF] text-white font-bold px-8 py-4 rounded-xl text-lg disabled:opacity-50"
                      >
                        {isGenerating ? (
                          <>
                            <motion.div 
                              className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                            />
                            Génération en cours...
                          </>
                        ) : (
                          <>
                            <div className="w-5 h-5"><Icons.FileText /></div>
                            Générer mon devis PDF
                          </>
                        )}
                      </button>
                    </div>
                  </HoloCard>
                ) : (
                  <HoloCard glow="#00FF88">
                    <div className="p-8 text-center">
                      <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-20 h-20 rounded-full bg-[#00FF88]/20 flex items-center justify-center mx-auto mb-6"
                      >
                        <div className="w-10 h-10 text-[#00FF88]"><Icons.Check /></div>
                      </motion.div>

                      <h2 className="text-2xl font-bold mb-2">Devis généré ! 🎉</h2>
                      <p className="text-white/60 mb-6">Numéro : <span className="text-[#8B5CF6] font-mono">{quoteNumber}</span></p>

                      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
                        <button
                          onClick={downloadPDF}
                          className="flex items-center gap-2 bg-gradient-to-r from-[#00FF88] to-[#00F5FF] text-black font-bold px-6 py-3 rounded-xl"
                        >
                          <div className="w-5 h-5"><Icons.Download /></div>
                          Télécharger le PDF
                        </button>
                        <a
                          href={`mailto:contact@formation-ia-act.fr?subject=Devis ${quoteNumber} - ${formData.companyName}&body=Bonjour,%0A%0AJe souhaite donner suite au devis ${quoteNumber} pour ${formData.users} personne(s).%0A%0AEntreprise: ${formData.companyName}%0AContact: ${formData.contactName}%0A%0ACordialement`}
                          className="flex items-center gap-2 bg-white/10 text-white font-bold px-6 py-3 rounded-xl hover:bg-white/20 transition-colors"
                        >
                          <div className="w-5 h-5"><Icons.Mail /></div>
                          Envoyer par email
                        </a>
                      </div>

                      <div className="bg-white/5 rounded-xl p-6 border border-white/10 text-left">
                        <p className="font-semibold mb-2">Prochaines étapes :</p>
                        <ol className="text-white/60 text-sm space-y-2">
                          <li className="flex items-start gap-2">
                            <span className="text-[#00FF88]">1.</span>
                            Téléchargez votre devis PDF
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-[#00FF88]">2.</span>
                            {formData.opcoFinancing ? 'Transmettez-le à votre OPCO pour demande de prise en charge' : 'Validez-le en interne'}
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-[#00FF88]">3.</span>
                            Contactez-nous pour finaliser la commande
                          </li>
                        </ol>
                      </div>

                      <p className="text-white/40 text-sm mt-6">
                        Questions ? <a href="mailto:contact@formation-ia-act.fr" className="text-[#00F5FF] hover:underline">contact@formation-ia-act.fr</a>
                      </p>
                    </div>
                  </HoloCard>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation buttons */}
          {!quoteGenerated && (
            <div className="flex justify-between mt-6">
              <button
                onClick={() => setStep(Math.max(1, step - 1))}
                disabled={step === 1}
                className="flex items-center gap-2 text-white/60 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <div className="w-5 h-5"><Icons.ArrowLeft /></div>
                Précédent
              </button>
              
              {step < 4 && (
                <button
                  onClick={() => setStep(step + 1)}
                  disabled={!validateStep(step)}
                  className="flex items-center gap-2 bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed text-white font-medium px-6 py-3 rounded-xl transition-colors"
                >
                  Suivant
                  <div className="w-5 h-5"><Icons.ArrowRight /></div>
                </button>
              )}
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
