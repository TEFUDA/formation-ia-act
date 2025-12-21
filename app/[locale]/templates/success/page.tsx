"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const TEMPLATES_ESSENTIEL = [
  { name: "Template Registre IA", file: "template-registre-ia.xlsx" },
  { name: "Modele Politique IA", file: "modele-politique-ia.docx" },
  { name: "Matrice Classification Risques", file: "matrice-classification-risques.xlsx" },
  { name: "Checklist Concern", file: "checklist-etes-vous-concerne.xlsx" },
  { name: "Template Documentation Technique", file: "template-documentation-technique.docx" },
  { name: "Fiche Poste Referent IA", file: "fiche-poste-referent-ia.docx" },
];

const TEMPLATES_COMPLET = [
  ...TEMPLATES_ESSENTIEL,
  { name: "Guide AI Act Synthese", file: "guide-ai-act-synthese.pdf" },
  { name: "Plan Audit Type", file: "plan-audit-type.xlsx" },
  { name: "Tableau Bord Conformite", file: "tableau-bord-conformite-ia.xlsx" },
  { name: "Guide Audit Pas a Pas", file: "guide-audit-pas-a-pas.pdf" },
  { name: "Checklist Marquage CE", file: "checklist-marquage-ce.xlsx" },
  { name: "Exemples Secteurs Activite", file: "exemples-secteurs-activite.pdf" },
];

export default function TemplatesSuccessPage() {
  const searchParams = useSearchParams();
  const pack = searchParams.get("pack") || "complet";
  const [showDownloads, setShowDownloads] = useState(false);

  const templates = pack === "essentiel" ? TEMPLATES_ESSENTIEL : TEMPLATES_COMPLET;
  const packName = pack === "essentiel" ? "Essentiel" : pack === "bundle" ? "Bundle" : "Complet";

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#030014", color: "white", padding: "2rem" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>🎉</div>
          <h1 style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "1rem" }}>
            Merci pour votre achat !
          </h1>
          <p style={{ color: "#999", marginBottom: "1.5rem" }}>
            Votre Pack {packName} ({templates.length} templates) est pret.
          </p>

          <button
            onClick={() => setShowDownloads(!showDownloads)}
            style={{
              backgroundColor: "#22c55e",
              color: "black",
              fontWeight: "bold",
              padding: "1rem 2rem",
              borderRadius: "0.75rem",
              border: "none",
              cursor: "pointer",
              fontSize: "1rem"
            }}
          >
            {showDownloads ? "Masquer les fichiers" : "Telecharger mes templates"}
          </button>
        </div>

        {showDownloads && (
          <div style={{
            backgroundColor: "rgba(255,255,255,0.05)",
            borderRadius: "1rem",
            padding: "1.5rem",
            marginBottom: "2rem"
          }}>
            <h3 style={{ fontWeight: "bold", marginBottom: "1rem" }}>
              Vos {templates.length} fichiers :
            </h3>
            {templates.map((t, i) => (
              
                key={i}
                href={"/resources/" + t.file}
                download
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "0.75rem 1rem",
                  backgroundColor: "rgba(255,255,255,0.05)",
                  borderRadius: "0.5rem",
                  marginBottom: "0.5rem",
                  color: "white",
                  textDecoration: "none"
                }}
              >
                <span>{t.name}</span>
                <span style={{ color: "#22c55e" }}>Telecharger</span>
              </a>
            ))}
          </div>
        )}

        <div style={{
          backgroundColor: "rgba(255,255,255,0.05)",
          borderRadius: "1rem",
          padding: "1.5rem",
          marginBottom: "1rem"
        }}>
          <p style={{ color: "#f97316", fontWeight: "bold", fontSize: "0.875rem" }}>-50% EXCLUSIF</p>
          <h3 style={{ fontWeight: "bold", fontSize: "1.25rem", margin: "0.5rem 0" }}>
            Ajoutez la Formation Certifiante
          </h3>
          <p style={{ color: "#999", marginBottom: "1rem" }}>
            Obtenez le certificat pour utiliser vos templates correctement.
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <span style={{ color: "#666", textDecoration: "line-through" }}>500 EUR</span>
            <span style={{ color: "#f97316", fontWeight: "bold", fontSize: "1.5rem" }}>250 EUR</span>
            <Link href="/pricing" style={{
              backgroundColor: "#f97316",
              color: "white",
              padding: "0.75rem 1.5rem",
              borderRadius: "0.5rem",
              textDecoration: "none",
              fontWeight: "bold"
            }}>
              Ajouter
            </Link>
          </div>
        </div>

        <div style={{
          backgroundColor: "rgba(255,255,255,0.05)",
          borderRadius: "1rem",
          padding: "1.5rem"
        }}>
          <p style={{ color: "#a855f7", fontWeight: "bold", fontSize: "0.875rem" }}>NOUVEAU</p>
          <h3 style={{ fontWeight: "bold", fontSize: "1.25rem", margin: "0.5rem 0" }}>
            Audit Automatise de Conformite
          </h3>
          <p style={{ color: "#999", marginBottom: "1rem" }}>
            Verifiez votre conformite en 15 minutes.
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <span style={{ color: "#a855f7", fontWeight: "bold", fontSize: "1.5rem" }}>499 EUR</span>
            <Link href="/audit" style={{
              backgroundColor: "#a855f7",
              color: "white",
              padding: "0.75rem 1.5rem",
              borderRadius: "0.5rem",
              textDecoration: "none",
              fontWeight: "bold"
            }}>
              Decouvrir
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
