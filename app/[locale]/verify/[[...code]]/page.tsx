'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, CheckCircle, XCircle, Search, Award,
  Calendar, Clock, User, Building2, ExternalLink,
  AlertCircle, Loader2
} from 'lucide-react';
import Link from 'next/link';

// Simulated certificate database (in production, this would be an API call)
const certificatesDB: Record<string, {
  recipientName: string;
  companyName?: string;
  completionDate: string;
  averageScore: number;
  totalHours: number;
  certificateId: string;
  isValid: boolean;
}> = {
  'ABC1-2DEF-3GHI': {
    recipientName: 'Jean Dupont',
    companyName: 'Acme Corporation',
    completionDate: '2024-01-25',
    averageScore: 92,
    totalHours: 7,
    certificateId: 'CERT-2024-00001',
    isValid: true,
  },
  'XYZ9-8WVU-7TSR': {
    recipientName: 'Marie Martin',
    completionDate: '2024-01-20',
    averageScore: 88,
    totalHours: 7,
    certificateId: 'CERT-2024-00002',
    isValid: true,
  },
};

export default function VerifyPage({ params }: { params: { code?: string[] } }) {
  const [searchCode, setSearchCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{
    found: boolean;
    data?: typeof certificatesDB[string];
  } | null>(null);

  // If code is provided in URL
  const urlCode = params.code?.join('/') || '';

  useEffect(() => {
    if (urlCode) {
      setSearchCode(urlCode);
      handleVerify(urlCode);
    }
  }, [urlCode]);

  const handleVerify = async (code?: string) => {
    const codeToVerify = code || searchCode.toUpperCase().trim();
    if (!codeToVerify) return;

    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    const certificate = certificatesDB[codeToVerify];
    setResult({
      found: !!certificate,
      data: certificate,
    });
    
    setIsLoading(false);
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(new Date(dateString));
  };

  return (
    <div className="min-h-screen bg-[#0f172a]">
      {/* Header */}
      <header className="bg-[#0f172a]/95 backdrop-blur-xl border-b border-slate-800/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <span className="text-lg font-bold text-white">Formation AI Act</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
        {/* Title */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-cyan-500/30">
            <Shield className="w-8 h-8 text-cyan-400" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-3">
            Vérification de Certificat
          </h1>
          <p className="text-slate-400 max-w-md mx-auto">
            Vérifiez l'authenticité d'un certificat de compétence AI Act en entrant son code de vérification.
          </p>
        </div>

        {/* Search Form */}
        <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-6 mb-8">
          <label className="block text-sm font-medium text-slate-300 mb-3">
            Code de vérification
          </label>
          <div className="flex gap-3">
            <input
              type="text"
              value={searchCode}
              onChange={(e) => setSearchCode(e.target.value.toUpperCase())}
              placeholder="Ex: ABC1-2DEF-3GHI"
              className="flex-1 bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 font-mono tracking-wider"
              maxLength={14}
            />
            <button
              onClick={() => handleVerify()}
              disabled={isLoading || !searchCode}
              className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold px-6 py-3 rounded-xl flex items-center gap-2 transition-all"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Search className="w-5 h-5" />
              )}
              Vérifier
            </button>
          </div>
          <p className="text-slate-500 text-sm mt-3">
            Le code se trouve en bas du certificat, au format XXXX-XXXX-XXXX
          </p>
        </div>

        {/* Result */}
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {result.found && result.data ? (
              /* Certificate Found */
              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl overflow-hidden">
                {/* Header */}
                <div className="bg-emerald-500/20 p-4 flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-emerald-400 font-semibold">Certificat Authentique</h3>
                    <p className="text-emerald-400/70 text-sm">Ce certificat est valide et vérifié</p>
                  </div>
                </div>

                {/* Details */}
                <div className="p-6 space-y-4">
                  {/* Recipient */}
                  <div className="flex items-center gap-4 p-4 bg-slate-800/30 rounded-xl">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-slate-400 text-sm">Délivré à</p>
                      <p className="text-white font-semibold text-lg">{result.data.recipientName}</p>
                    </div>
                  </div>

                  {/* Company if exists */}
                  {result.data.companyName && (
                    <div className="flex items-center gap-3 text-slate-400">
                      <Building2 className="w-5 h-5" />
                      <span>{result.data.companyName}</span>
                    </div>
                  )}

                  {/* Stats Grid */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-slate-800/30 rounded-xl p-4 text-center">
                      <Award className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-white">{result.data.averageScore}%</p>
                      <p className="text-slate-500 text-xs">Score moyen</p>
                    </div>
                    <div className="bg-slate-800/30 rounded-xl p-4 text-center">
                      <Clock className="w-6 h-6 text-cyan-400 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-white">{result.data.totalHours}h</p>
                      <p className="text-slate-500 text-xs">Formation</p>
                    </div>
                    <div className="bg-slate-800/30 rounded-xl p-4 text-center">
                      <CheckCircle className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-white">6/6</p>
                      <p className="text-slate-500 text-xs">Modules</p>
                    </div>
                  </div>

                  {/* Date & ID */}
                  <div className="flex flex-wrap gap-4 text-sm pt-4 border-t border-slate-700/50">
                    <div className="flex items-center gap-2 text-slate-400">
                      <Calendar className="w-4 h-4" />
                      <span>Délivré le {formatDate(result.data.completionDate)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-500">
                      <span>N° {result.data.certificateId}</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Certificate Not Found */
              <div className="bg-red-500/10 border border-red-500/30 rounded-2xl overflow-hidden">
                {/* Header */}
                <div className="bg-red-500/20 p-4 flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                    <XCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-red-400 font-semibold">Certificat Introuvable</h3>
                    <p className="text-red-400/70 text-sm">Ce code ne correspond à aucun certificat</p>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-start gap-3 text-slate-300">
                    <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <div className="space-y-2 text-sm">
                      <p>Le code de vérification entré ne correspond à aucun certificat dans notre base de données.</p>
                      <p>Causes possibles :</p>
                      <ul className="list-disc list-inside text-slate-400 space-y-1 ml-2">
                        <li>Erreur de saisie du code</li>
                        <li>Certificat frauduleux</li>
                        <li>Certificat révoqué</li>
                      </ul>
                      <p className="text-slate-400 mt-4">
                        Si vous pensez qu'il s'agit d'une erreur, contactez-nous à{' '}
                        <a href="mailto:support@formation-ia-act.fr" className="text-cyan-400 hover:underline">
                          support@formation-ia-act.fr
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Info Section */}
        <div className="mt-12 text-center">
          <h2 className="text-lg font-semibold text-white mb-4">
            Pourquoi vérifier un certificat ?
          </h2>
          <div className="grid sm:grid-cols-3 gap-4 text-sm">
            <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-4">
              <Shield className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
              <p className="text-slate-300">Garantir l'authenticité des compétences déclarées</p>
            </div>
            <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-4">
              <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
              <p className="text-slate-300">Valider que la formation a bien été complétée</p>
            </div>
            <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-4">
              <Award className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
              <p className="text-slate-300">Confirmer le niveau de compétence (score 80%+)</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 mt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 text-center text-slate-500 text-sm">
          <p>© 2024 Formation IA Act. Tous droits réservés.</p>
          <p className="mt-2">
            <Link href="/" className="text-cyan-400 hover:underline">
              Retour au site principal
            </Link>
          </p>
        </div>
      </footer>
    </div>
  );
}
