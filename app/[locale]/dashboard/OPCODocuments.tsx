// components/dashboard/OPCODocuments.tsx
// Section téléchargement des documents OPCO dans le dashboard

'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface OPCODocumentsProps {
  invoiceNumber: string;
  purchaseDate: Date;
  planName: string;
  priceHT: number;
  priceTTC: number;
  hasCompletedFormation?: boolean;
  completionScore?: number;
}

const Icons = {
  Download: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>
    </svg>
  ),
  FileText: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="16" y1="13" x2="8" y2="13"/>
      <line x1="16" y1="17" x2="8" y2="17"/>
    </svg>
  ),
  Check: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-full h-full">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  Info: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full">
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="16" x2="12" y2="12"/>
      <line x1="12" y1="8" x2="12.01" y2="8"/>
    </svg>
  ),
  ExternalLink: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3"/>
    </svg>
  ),
};

export default function OPCODocuments({
  invoiceNumber,
  purchaseDate,
  planName,
  priceHT,
  priceTTC,
  hasCompletedFormation = false,
  completionScore = 0,
}: OPCODocumentsProps) {
  const [downloading, setDownloading] = useState<string | null>(null);

  const handleDownload = async (type: string, filename: string) => {
    setDownloading(type);
    try {
      const url = `/api/opco-documents/${type}?invoice=${invoiceNumber}${type === 'attestation' ? `&score=${completionScore}` : ''}`;
      
      const response = await fetch(url);
      if (!response.ok) throw new Error('Download failed');
      
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Download error:', error);
      alert('Erreur lors du téléchargement. Veuillez réessayer.');
    } finally {
      setDownloading(null);
    }
  };

  const documents = [
    {
      id: 'convention',
      title: 'Convention de formation',
      description: 'Document contractuel obligatoire pour votre OPCO',
      filename: `convention-${invoiceNumber}.pdf`,
      icon: '📋',
      color: '#3B82F6',
      available: true,
    },
    {
      id: 'invoice',
      title: 'Facture acquittée',
      description: 'Preuve de paiement pour le remboursement',
      filename: `facture-${invoiceNumber}.pdf`,
      icon: '🧾',
      color: '#059669',
      available: true,
    },
    {
      id: 'programme',
      title: 'Programme de formation',
      description: 'Détail des 6 modules et objectifs pédagogiques',
      filename: 'programme-formation-ai-act.pdf',
      icon: '📚',
      color: '#D97706',
      available: true,
    },
    {
      id: 'attestation',
      title: 'Attestation de fin de formation',
      description: hasCompletedFormation 
        ? `Formation validée avec ${completionScore}% de réussite`
        : 'Disponible après validation de la formation',
      filename: `attestation-${invoiceNumber}.pdf`,
      icon: '🎓',
      color: '#8B5CF6',
      available: hasCompletedFormation,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="text-2xl">💰</span>
            Documents OPCO
          </h2>
          <p className="text-white/50 text-sm mt-1">
            Téléchargez vos documents pour demander le remboursement à votre OPCO
          </p>
        </div>
        <div className="px-3 py-1 rounded-full bg-[#00FF88]/10 border border-[#00FF88]/30">
          <span className="text-[#00FF88] text-xs font-medium">Éligible OPCO</span>
        </div>
      </div>

      {/* Info Banner */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-[#00FF88]/10 to-[#00F5FF]/10 rounded-xl p-4 border border-[#00FF88]/20"
      >
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#00FF88]/20 flex items-center justify-center flex-shrink-0">
            <div className="w-5 h-5 text-[#00FF88]"><Icons.Info /></div>
          </div>
          <div>
            <h4 className="text-white font-semibold text-sm mb-1">Comment obtenir votre remboursement ?</h4>
            <ol className="text-white/60 text-xs space-y-1">
              <li>1. Téléchargez les 3 documents ci-dessous</li>
              <li>2. Transmettez-les à votre OPCO (ATLAS, OPCO EP, AKTO, etc.)</li>
              <li>3. Recevez votre remboursement sous 30-60 jours</li>
            </ol>
            <p className="text-[#00FF88] text-xs mt-2 font-medium">
              ✓ Nous sommes certifiés Qualiopi, votre demande sera acceptée !
            </p>
          </div>
        </div>
      </motion.div>

      {/* Purchase Info */}
      <div className="bg-white/5 rounded-xl p-4 border border-white/10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-white/40 text-xs">N° Facture</p>
            <p className="text-white font-semibold text-sm">{invoiceNumber}</p>
          </div>
          <div>
            <p className="text-white/40 text-xs">Date d'achat</p>
            <p className="text-white font-semibold text-sm">{purchaseDate.toLocaleDateString('fr-FR')}</p>
          </div>
          <div>
            <p className="text-white/40 text-xs">Formule</p>
            <p className="text-white font-semibold text-sm">{planName}</p>
          </div>
          <div>
            <p className="text-white/40 text-xs">Montant TTC</p>
            <p className="text-[#00FF88] font-bold text-sm">{priceTTC.toFixed(2)} €</p>
          </div>
        </div>
      </div>

      {/* Documents Grid */}
      <div className="grid sm:grid-cols-2 gap-4">
        {documents.map((doc, i) => (
          <motion.div
            key={doc.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`relative bg-white/5 rounded-xl p-4 border transition-colors ${
              doc.available 
                ? 'border-white/10 hover:border-white/20' 
                : 'border-white/5 opacity-60'
            }`}
          >
            <div className="flex items-start gap-4">
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                style={{ background: `${doc.color}20` }}
              >
                {doc.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-white font-semibold text-sm">{doc.title}</h4>
                <p className="text-white/40 text-xs mt-1 line-clamp-2">{doc.description}</p>
              </div>
            </div>

            <div className="mt-4">
              {doc.available ? (
                <motion.button
                  onClick={() => handleDownload(doc.id, doc.filename)}
                  disabled={downloading === doc.id}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg font-semibold text-sm transition-colors"
                  style={{ 
                    background: `${doc.color}20`,
                    color: doc.color,
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {downloading === doc.id ? (
                    <>
                      <motion.div
                        className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      />
                      Téléchargement...
                    </>
                  ) : (
                    <>
                      <div className="w-4 h-4"><Icons.Download /></div>
                      Télécharger PDF
                    </>
                  )}
                </motion.button>
              ) : (
                <div className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-white/5 text-white/30 text-sm">
                  <div className="w-4 h-4"><Icons.FileText /></div>
                  Disponible après formation
                </div>
              )}
            </div>

            {/* Status badge */}
            {doc.available && (
              <div className="absolute top-3 right-3">
                <div className="w-5 h-5 rounded-full bg-[#00FF88]/20 flex items-center justify-center">
                  <div className="w-3 h-3 text-[#00FF88]"><Icons.Check /></div>
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Help Section */}
      <div className="bg-white/5 rounded-xl p-4 border border-white/10">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-white font-semibold text-sm">Besoin d'aide ?</h4>
            <p className="text-white/40 text-xs mt-1">Notre équipe peut vous accompagner dans vos démarches OPCO</p>
          </div>
          <a 
            href="mailto:opco@formation-ia-act.fr"
            className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/15 rounded-lg text-white text-sm font-medium transition-colors"
          >
            Nous contacter
            <div className="w-4 h-4"><Icons.ExternalLink /></div>
          </a>
        </div>
      </div>

      {/* OPCO Logos */}
      <div className="text-center">
        <p className="text-white/30 text-xs mb-3">Compatible avec tous les OPCO</p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          {['OPCO EP', 'ATLAS', 'AKTO', 'OPCO 2i', 'AFDAS', 'OPCOMMERCE'].map((opco) => (
            <span key={opco} className="px-3 py-1 bg-white/5 rounded-lg text-white/40 text-xs">
              {opco}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
