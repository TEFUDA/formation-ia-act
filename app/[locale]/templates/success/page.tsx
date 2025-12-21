'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

const DownloadIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="7 10 12 15 17 10"/>
    <line x1="12" y1="15" x2="12" y2="3"/>
  </svg>
);

const TEMPLATES = {
  essentiel: [
    { name: 'Template Registre IA', file: 'template-registre-ia.xlsx' },
    { name: 'Modele Politique IA', file: 'modele-politique-ia.docx' },
    { name: 'Matrice Classification Risques', file: 'matrice-classification-risques.xlsx' },
    { name: 'Checklist Etes-vous concerne', file: 'checklist-etes-vous-concerne.xlsx' },
    { name: 'Template Documentation Technique', file: 'template-documentation-technique.docx' },
    { name: 'Fiche Poste Referent IA', file: 'fiche-poste-referent-ia.docx' },
  ],
  complet: [
    { name: 'Template Registre IA', file: 'template-registre-ia.xlsx' },
    { name: 'Modele Politique IA', file: 'modele-politique-ia.docx' },
    { name: 'Matrice Classification Risques', file: 'matrice-classification-risques.xlsx' },
    { name: 'Checklist Etes-vous concerne', file: 'checklist-etes-vous-concerne.xlsx' },
    { name: 'Template Documentation Technique', file: 'template-documentation-technique.docx' },
    { name: 'Fiche Poste Referent IA', file: 'fiche-poste-referent-ia.docx' },
    { name: 'Guide AI Act Synthese', file: 'guide-ai-act-synthese.pdf' },
    { name: 'Plan Audit Type', file: 'plan-audit-type.xlsx' },
    { name: 'Tableau Bord Conformite', file: 'tableau-bord-conformite-ia.xlsx' },
    { name: 'Guide Audit Pas a Pas', file: 'guide-audit-pas-a-pas.pdf' },
    { name: 'Checklist Marquage CE', file: 'checklist-marquage-ce.xlsx' },
    { name: 'Exemples Secteurs Activite', file: 'exemples-secteurs-activite.pdf' },
  ],
};

export default function TemplatesSuccessPage() {
  const searchParams = useSearchParams();
  const pack = searchParams.get('pack') || 'complet';
  const [showDownloads, setShowDownloads] = useState(false);

  const packInfo: Record<string, { name: string; count: number }> = {
    essentiel: { name: 'Essentiel', count: 6 },
    complet: { name: 'Complet', count: 12 },
    bundle: { name: 'Bundle Formation', count: 12 },
  };

  const currentPack = packInfo[pack] || packInfo.complet;
  const templates = pack === 'essentiel' ? TEMPLATES.essentiel : TEMPLATES.complet;

  return (
    <div className="min-h-screen bg-[#030014] text-white">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-[#030014]" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-500/10 blur-3xl rounded-full" />
      </div>

      <header className="relative z-40 px-6 py-4 border-b border-white/5">
        <div className="max-w-4xl mx-auto flex items-center justify-center">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold">
              IA
            </div>
            <span className="font-bold text-lg">Formation-IA-Act.fr</span>
          </Link>
        </div>
      </header>

      <main className="relative z-10 px-6 py-12">
        <div className="max-w-3xl mx-auto">
          
          <div className="text-center mb-8">
            <div className="text-7xl mb-6">🎉</div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Merci pour votre achat !
            </h1>
            <p className="text-white/60 text-lg mb-6">
              Votre Pack {currentPack.name} ({currentPack.count} templates) est pret.
            </p>

            <button
              onClick={() => setShowDownloads(!showDownloads)}
              className="inline-flex items-center gap-3 bg-green-500 hover:bg-green-600 text-black font-bold px-8 py-4 rounded-xl transition-colors"
            >
              <DownloadIcon />
              {showDownloads ? 'Masquer les fichiers' : 'Telecharger mes templates'}
            </button>

            {showDownloads && (
              <div className="mt-6 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
                <h3 className="text-lg font-bold text-white mb-4">Vos {templates.length} fichiers</h3>
                <div className="grid gap-2">
                  {templates.map((t, i) => (
                    
                      key={i}
                      href={`/resources/${t.file}`}
                      download
                      className="flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                    >
                      <span className="text-white/80">{t.name}</span>
                      <span className="text-green-400"><DownloadIcon /></span>
                    </a>
                  ))}
                </div>
              </div>
            )}

            <p className="text-white/40 text-sm mt-4">
              Un email avec le lien de telechargement vous a ete envoye.
            </p>
          </div>

          <div className="flex items-center gap-4 my-12">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-white/30 text-sm">Offres exclusives</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 mb-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-orange-500/20 text-orange-400 text-xs font-bold px-3 py-1 rounded-full">
                -50% EXCLUSIF
              </span>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              Ajoutez la Formation Certifiante
            </h3>
            <p className="text-white/60 mb-4">
              Obtenez les connaissances et le certificat pour utiliser vos templates correctement.
            </p>
            <div className="flex items-center gap-4">
              <div>
                <span className="text-white/40 line-through">500 EUR</span>
                <span className="text-2xl font-bold text-orange-400 ml-2">250 EUR</span>
              </div>
              <Link href="/pricing" className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-3 rounded-xl transition-colors">
                Ajouter
              </Link>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
            <span className="bg-purple-500/20 text-purple-400 text-xs font-bold px-3 py-1 rounded-full">
              NOUVEAU
            </span>
            <h3 className="text-xl font-bold text-white my-2">
              Audit Automatise de Conformite
            </h3>
            <p className="text-white/60 mb-4">
              Verifiez votre conformite en 15 minutes avec notre audit automatise.
            </p>
            <div className="flex items-center gap-4">
              <span className="text-2xl font-bold text-purple-400">499 EUR</span>
              <Link href="/audit" className="bg-purple-500 hover:bg-purple-600 text-white font-bold px-6 py-3 rounded-xl transition-colors">
                Decouvrir
              </Link>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-white/40 text-sm">
              Une question ? <a href="mailto:support@formation-ia-act.fr" className="text-cyan-400 hover:underline">support@formation-ia-act.fr</a>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
