'use client';

import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Download, Share2, Award, CheckCircle, Shield, 
  Calendar, Clock, ExternalLink, Copy, Check
} from 'lucide-react';

interface CertificateProps {
  recipientName: string;
  completionDate: Date;
  averageScore: number;
  totalHours: number;
  certificateId: string;
  verificationCode: string;
  companyName?: string;
}

export default function Certificate({
  recipientName,
  completionDate,
  averageScore,
  totalHours,
  certificateId,
  verificationCode,
  companyName,
}: CertificateProps) {
  const certificateRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  const formattedDate = new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(completionDate);

  const verificationUrl = `https://formation-ia-act.fr/verify/${verificationCode}`;

  const handleDownload = async () => {
    // En production, cela appellerait une API qui génère un vrai PDF
    // Pour l'instant, on utilise window.print() comme fallback
    window.print();
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(verificationUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Certificat AI Act',
          text: `${recipientName} a obtenu sa certification AI Act !`,
          url: verificationUrl,
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <div className="space-y-6">
      {/* Certificate Preview */}
      <div 
        ref={certificateRef}
        className="bg-white rounded-2xl overflow-hidden shadow-2xl print:shadow-none"
        id="certificate"
      >
        {/* Certificate Content */}
        <div className="relative p-8 sm:p-12 bg-gradient-to-br from-slate-50 to-blue-50">
          {/* Decorative Border */}
          <div className="absolute inset-4 border-2 border-blue-200 rounded-xl pointer-events-none" />
          <div className="absolute inset-6 border border-blue-100 rounded-lg pointer-events-none" />

          {/* Corner Decorations */}
          <div className="absolute top-8 left-8 w-16 h-16 border-t-4 border-l-4 border-blue-500 rounded-tl-lg" />
          <div className="absolute top-8 right-8 w-16 h-16 border-t-4 border-r-4 border-blue-500 rounded-tr-lg" />
          <div className="absolute bottom-8 left-8 w-16 h-16 border-b-4 border-l-4 border-blue-500 rounded-bl-lg" />
          <div className="absolute bottom-8 right-8 w-16 h-16 border-b-4 border-r-4 border-blue-500 rounded-br-lg" />

          <div className="relative z-10 text-center">
            {/* Logo & Header */}
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <Shield className="w-8 h-8 text-white" />
              </div>
            </div>

            <p className="text-blue-600 text-sm font-semibold tracking-widest uppercase mb-2">
              Formation IA Act
            </p>

            <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-2">
              Certificat de Compétence
            </h1>

            <div className="w-24 h-1 bg-gradient-to-r from-cyan-500 to-blue-500 mx-auto mb-8 rounded-full" />

            {/* Recipient */}
            <p className="text-slate-600 mb-2">Décerné à</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1">
              {recipientName}
            </h2>
            {companyName && (
              <p className="text-slate-500 mb-6">{companyName}</p>
            )}

            {/* Achievement */}
            <div className="bg-white/80 backdrop-blur-sm border border-blue-100 rounded-xl p-6 mb-8 max-w-lg mx-auto">
              <p className="text-slate-600 leading-relaxed">
                A complété avec succès la formation
                <br />
                <span className="font-bold text-slate-800">
                  « Conformité AI Act - Règlement Européen sur l'Intelligence Artificielle »
                </span>
              </p>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-8 mb-8">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 text-emerald-600 mb-1">
                  <CheckCircle className="w-5 h-5" />
                  <span className="text-2xl font-bold">{averageScore}%</span>
                </div>
                <p className="text-slate-500 text-sm">Score moyen aux quiz</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 text-blue-600 mb-1">
                  <Clock className="w-5 h-5" />
                  <span className="text-2xl font-bold">{totalHours}h</span>
                </div>
                <p className="text-slate-500 text-sm">De formation</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 text-purple-600 mb-1">
                  <Award className="w-5 h-5" />
                  <span className="text-2xl font-bold">6</span>
                </div>
                <p className="text-slate-500 text-sm">Modules validés</p>
              </div>
            </div>

            {/* Modules Covered */}
            <div className="mb-8">
              <p className="text-slate-500 text-sm mb-3">Compétences validées :</p>
              <div className="flex flex-wrap justify-center gap-2 max-w-xl mx-auto">
                {[
                  "Introduction à l'AI Act",
                  "Classification des risques",
                  "Registre des systèmes IA",
                  "Gouvernance IA",
                  "Systèmes à haut risque",
                  "Audit et conformité",
                ].map((module, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-50 text-blue-700 text-xs rounded-full border border-blue-100"
                  >
                    {module}
                  </span>
                ))}
              </div>
            </div>

            {/* Date & Signature */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-6 border-t border-blue-100">
              <div className="text-left">
                <div className="flex items-center gap-2 text-slate-600 mb-1">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">Délivré le {formattedDate}</span>
                </div>
                <p className="text-slate-400 text-xs">
                  Certificat N° {certificateId}
                </p>
              </div>

              <div className="text-center">
                <div className="font-script text-2xl text-slate-700 mb-1" style={{ fontFamily: 'cursive' }}>
                  Formation IA Act
                </div>
                <div className="w-32 h-px bg-slate-300 mb-1" />
                <p className="text-slate-500 text-xs">formation-ia-act.fr</p>
              </div>
            </div>

            {/* Verification */}
            <div className="mt-6 pt-4 border-t border-blue-100">
              <p className="text-slate-400 text-xs">
                Vérifier l'authenticité : {verificationUrl}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Actions - Hidden when printing */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center print:hidden">
        <button
          onClick={handleDownload}
          className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-semibold px-6 py-3 rounded-xl flex items-center justify-center gap-2 transition-all"
        >
          <Download className="w-5 h-5" />
          Télécharger (PDF)
        </button>

        <button
          onClick={handleShare}
          className="bg-slate-700 hover:bg-slate-600 text-white font-semibold px-6 py-3 rounded-xl flex items-center justify-center gap-2 transition-all"
        >
          <Share2 className="w-5 h-5" />
          Partager
        </button>

        <button
          onClick={handleCopyLink}
          className="bg-slate-800/50 hover:bg-slate-700 text-white font-semibold px-6 py-3 rounded-xl flex items-center justify-center gap-2 transition-all border border-slate-700"
        >
          {copied ? (
            <>
              <Check className="w-5 h-5 text-emerald-400" />
              Copié !
            </>
          ) : (
            <>
              <Copy className="w-5 h-5" />
              Copier le lien
            </>
          )}
        </button>
      </div>

      {/* Verification Info */}
      <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-4 print:hidden">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-white font-medium mb-1">Certificat vérifiable</p>
            <p className="text-slate-400 text-sm">
              Ce certificat peut être vérifié en ligne par les employeurs et partenaires via le lien de vérification unique.
              Le code <span className="font-mono text-cyan-400">{verificationCode}</span> garantit son authenticité.
            </p>
          </div>
        </div>
      </div>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #certificate, #certificate * {
            visibility: visible;
          }
          #certificate {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}

// Fonction utilitaire pour générer un code de vérification unique
export function generateVerificationCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 12; i++) {
    if (i > 0 && i % 4 === 0) code += '-';
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// Fonction utilitaire pour générer un ID de certificat
export function generateCertificateId(): string {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 100000).toString().padStart(5, '0');
  return `CERT-${year}-${random}`;
}
