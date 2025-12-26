'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';

// ============================================
// TYPES
// ============================================
interface CertificateData {
  name: string;
  company: string;
  date: string;
  score: number;
  hours: number;
  modules: number;
  code: string;
}

// ============================================
// ICONS
// ============================================
const Icons = {
  Download: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
  Share: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>,
  Copy: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>,
  Check: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-full h-full"><polyline points="20 6 9 17 4 12"/></svg>,
  Award: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>,
  Linkedin: () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>,
};

// Generate verification code
const generateCode = (): string => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const parts = [];
  for (let i = 0; i < 3; i++) {
    let part = '';
    for (let j = 0; j < 4; j++) {
      part += chars[Math.floor(Math.random() * chars.length)];
    }
    parts.push(part);
  }
  return parts.join('-');
};

// ============================================
// MAIN COMPONENT
// ============================================
export default function CertificateGenerator({
  userName = '',
  userCompany = '',
  averageScore = 85,
  totalHours = 8,
  modulesCompleted = 8,
  onGenerate,
  moduleColor = '#00FF88'
}: {
  userName?: string;
  userCompany?: string;
  averageScore?: number;
  totalHours?: number;
  modulesCompleted?: number;
  onGenerate?: (data: CertificateData) => void;
  moduleColor?: string;
}) {
  const [name, setName] = useState(userName);
  const [company, setCompany] = useState(userCompany);
  const [isGenerated, setIsGenerated] = useState(false);
  const [certificateData, setCertificateData] = useState<CertificateData | null>(null);
  const [copied, setCopied] = useState(false);
  const certificateRef = useRef<HTMLDivElement>(null);

  const handleGenerate = () => {
    if (!name.trim()) return;

    const data: CertificateData = {
      name: name.trim(),
      company: company.trim(),
      date: new Date().toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }),
      score: averageScore,
      hours: totalHours,
      modules: modulesCompleted,
      code: generateCode()
    };

    setCertificateData(data);
    setIsGenerated(true);
    
    if (onGenerate) {
      onGenerate(data);
    }
  };

  const copyVerificationLink = () => {
    if (!certificateData) return;
    const url = `${window.location.origin}/verify/${certificateData.code}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareOnLinkedIn = () => {
    if (!certificateData) return;
    const text = `🎓 Je viens d'obtenir ma certification AI Act avec un score de ${certificateData.score}% !

✅ ${certificateData.hours}h de formation complétées
✅ ${certificateData.modules} modules validés
✅ Prêt pour la conformité 2026

Vérifiez mon certificat : ${window.location.origin}/verify/${certificateData.code}

#AIAct #Conformite #Formation #IA`;
    
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.origin + '/verify/' + certificateData.code)}`;
    window.open(url, '_blank');
  };

  const downloadCertificate = async () => {
    if (!certificateRef.current) return;

    try {
      // Dynamic import of html2canvas
      // @ts-ignore - html2canvas may not be installed
      const html2canvasModule = await import('html2canvas');
      const html2canvas = html2canvasModule.default;
      
      const canvas = await html2canvas(certificateRef.current, {
        backgroundColor: '#030014',
        scale: 2
      });
      
      const link = document.createElement('a');
      link.download = `certificat-ai-act-${certificateData?.code || 'cert'}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      // Fallback: print the page
      console.error('html2canvas not available, using print fallback');
      window.print();
    }
  };

  return (
    <div className="min-h-[600px]">
      {!isGenerated ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-xl mx-auto text-center"
        >
          {/* Success Animation */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2 }}
            className="w-32 h-32 rounded-full bg-gradient-to-br from-[#00FF88] to-[#00F5FF] flex items-center justify-center mx-auto mb-8"
          >
            <div className="w-16 h-16 text-black"><Icons.Award /></div>
          </motion.div>

          <h1 className="text-4xl font-black mb-4">🎉 Félicitations !</h1>
          <p className="text-xl text-white/60 mb-8">
            Vous avez terminé la formation AI Act avec succès !
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-white/5 rounded-xl p-4">
              <div className="text-3xl font-bold text-green-400">{averageScore}%</div>
              <p className="text-sm text-white/40">Score moyen</p>
            </div>
            <div className="bg-white/5 rounded-xl p-4">
              <div className="text-3xl font-bold text-cyan-400">{totalHours}h</div>
              <p className="text-sm text-white/40">Formation</p>
            </div>
            <div className="bg-white/5 rounded-xl p-4">
              <div className="text-3xl font-bold text-violet-400">{modulesCompleted}</div>
              <p className="text-sm text-white/40">Modules</p>
            </div>
          </div>

          {/* Form */}
          <div className="bg-white/5 rounded-xl p-6 text-left mb-6">
            <h3 className="font-semibold mb-4">Personnalisez votre certificat</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-white/60 mb-2">Votre nom complet *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jean Dupont"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-white/30"
                />
              </div>
              <div>
                <label className="block text-sm text-white/60 mb-2">Votre entreprise (optionnel)</label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="Ma Société SAS"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-white/30"
                />
              </div>
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={!name.trim()}
            className="w-full py-4 rounded-xl font-bold text-xl text-black disabled:opacity-50 transition-all hover:scale-[1.02]"
            style={{ backgroundColor: moduleColor }}
          >
            🎓 Générer mon certificat
          </button>
        </motion.div>
      ) : certificateData && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {/* Certificate Preview */}
          <div 
            ref={certificateRef}
            className="bg-gradient-to-br from-[#0A0A2E] to-[#030014] rounded-2xl p-8 mb-6 border border-white/10 relative overflow-hidden"
          >
            {/* Decorative Elements */}
            <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-[#8B5CF6]/20 to-transparent rounded-br-full" />
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-[#00F5FF]/20 to-transparent rounded-tl-full" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-[#00FF88]/5 via-[#00F5FF]/5 to-[#8B5CF6]/5 rounded-full blur-3xl" />

            {/* Content */}
            <div className="relative text-center">
              {/* Header */}
              <div className="mb-8">
                <div className="text-4xl mb-2">🏆</div>
                <h1 className="text-2xl font-bold tracking-wider text-white/90 uppercase">
                  Certificat de Réussite
                </h1>
                <p className="text-white/40 text-sm">Formation AI Act - Règlement UE 2024/1689</p>
              </div>

              {/* Main Content */}
              <div className="mb-8">
                <p className="text-white/60 mb-2">Ce certificat atteste que</p>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-[#00FF88] via-[#00F5FF] to-[#8B5CF6] bg-clip-text text-transparent mb-2">
                  {certificateData.name}
                </h2>
                {certificateData.company && (
                  <p className="text-white/60">{certificateData.company}</p>
                )}
              </div>

              <div className="mb-8">
                <p className="text-white/70">
                  a complété avec succès la formation complète
                </p>
                <p className="text-xl font-bold text-white mt-2">
                  "Conformité AI Act - 8 heures"
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="bg-white/5 rounded-xl p-3">
                  <div className="text-2xl font-bold text-green-400">{certificateData.score}%</div>
                  <p className="text-xs text-white/40">Score</p>
                </div>
                <div className="bg-white/5 rounded-xl p-3">
                  <div className="text-2xl font-bold text-cyan-400">{certificateData.hours}h</div>
                  <p className="text-xs text-white/40">Formation</p>
                </div>
                <div className="bg-white/5 rounded-xl p-3">
                  <div className="text-2xl font-bold text-violet-400">{certificateData.modules}/8</div>
                  <p className="text-xs text-white/40">Modules</p>
                </div>
              </div>

              {/* Footer */}
              <div className="border-t border-white/10 pt-4">
                <div className="flex items-center justify-between text-sm">
                  <div className="text-left">
                    <p className="text-white/40">Date d'obtention</p>
                    <p className="text-white/70">{certificateData.date}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-white/40">Code de vérification</p>
                    <p className="text-white font-mono font-bold">{certificateData.code}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white/40">Validité</p>
                    <p className="text-white/70">Août 2026</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Verification Link */}
          <div className="bg-white/5 rounded-xl p-4 mb-6">
            <p className="text-sm text-white/60 mb-2">Lien de vérification publique :</p>
            <div className="flex gap-2">
              <code className="flex-1 bg-black/30 rounded-lg px-4 py-2 text-sm font-mono text-cyan-400 truncate">
                {window.location.origin}/verify/{certificateData.code}
              </code>
              <button
                onClick={copyVerificationLink}
                className={`px-4 py-2 rounded-lg transition-all ${
                  copied ? 'bg-green-500 text-white' : 'bg-white/10 hover:bg-white/20'
                }`}
              >
                <div className="w-5 h-5">
                  {copied ? <Icons.Check /> : <Icons.Copy />}
                </div>
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              onClick={downloadCertificate}
              className="flex items-center justify-center gap-2 py-4 rounded-xl bg-white/10 hover:bg-white/20 font-semibold transition-colors"
            >
              <div className="w-5 h-5"><Icons.Download /></div>
              Télécharger
            </button>
            
            <button
              onClick={shareOnLinkedIn}
              className="flex items-center justify-center gap-2 py-4 rounded-xl bg-[#0A66C2] hover:bg-[#0A66C2]/80 font-semibold transition-colors"
            >
              <div className="w-5 h-5"><Icons.Linkedin /></div>
              Partager
            </button>
            
            <button
              onClick={() => window.print()}
              className="flex items-center justify-center gap-2 py-4 rounded-xl font-semibold text-black"
              style={{ backgroundColor: moduleColor }}
            >
              <div className="w-5 h-5"><Icons.Award /></div>
              Imprimer
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
