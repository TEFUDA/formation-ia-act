"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const FILES_ESSENTIEL = [
  "template-registre-ia.xlsx",
  "modele-politique-ia.docx",
  "matrice-classification-risques.xlsx",
  "checklist-etes-vous-concerne.xlsx",
  "template-documentation-technique.docx",
  "fiche-poste-referent-ia.docx"
];

const FILES_COMPLET = [
  "template-registre-ia.xlsx",
  "modele-politique-ia.docx",
  "matrice-classification-risques.xlsx",
  "checklist-etes-vous-concerne.xlsx",
  "template-documentation-technique.docx",
  "fiche-poste-referent-ia.docx",
  "guide-ai-act-synthese.pdf",
  "plan-audit-type.xlsx",
  "tableau-bord-conformite-ia.xlsx",
  "guide-audit-pas-a-pas.pdf",
  "checklist-marquage-ce.xlsx",
  "exemples-secteurs-activite.pdf"
];

export default function Page() {
  const searchParams = useSearchParams();
  const pack = searchParams.get("pack") || "complet";
  const [open, setOpen] = useState(false);

  const files = pack === "essentiel" ? FILES_ESSENTIEL : FILES_COMPLET;

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-3xl font-bold mb-2">Merci pour votre achat !</h1>
          <p className="text-gray-400 mb-6">Pack {pack} - {files.length} templates</p>
          <button
            onClick={() => setOpen(!open)}
            className="bg-green-500 text-black font-bold px-6 py-3 rounded-lg"
          >
            {open ? "Masquer" : "Telecharger mes templates"}
          </button>
        </div>

        {open && (
          <div className="bg-white/10 rounded-lg p-4 mb-8">
            <h3 className="font-bold mb-4">Vos fichiers :</h3>
            {files.map((f, i) => (
              <a
                key={i}
                href={"/resources/" + f}
                download
                className="block p-3 mb-2 bg-white/5 rounded hover:bg-white/10"
              >
                {f}
              </a>
            ))}
          </div>
        )}

        <div className="bg-white/10 rounded-lg p-4 mb-4">
          <p className="text-orange-400 font-bold text-sm">-50%</p>
          <h3 className="font-bold text-lg">Formation Certifiante</h3>
          <p className="text-gray-400 text-sm mb-3">Obtenez le certificat AI Act</p>
          <Link href="/pricing" className="inline-block bg-orange-500 text-white px-4 py-2 rounded font-bold">
            250 EUR - Ajouter
          </Link>
        </div>

        <div className="bg-white/10 rounded-lg p-4">
          <p className="text-purple-400 font-bold text-sm">NOUVEAU</p>
          <h3 className="font-bold text-lg">Audit de Conformite</h3>
          <p className="text-gray-400 text-sm mb-3">Verifiez votre conformite en 15 min</p>
          <Link href="/audit" className="inline-block bg-purple-500 text-white px-4 py-2 rounded font-bold">
            499 EUR - Decouvrir
          </Link>
        </div>
      </div>
    </div>
  );
}
