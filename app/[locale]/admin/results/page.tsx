"use client";

import { useState, useEffect, Suspense } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

// Catégories d'audit
const CATEGORIES = [
  { key: "identification", name: "Identification IA", icon: "📋", color: "#00F5FF" },
  { key: "classification", name: "Classification risques", icon: "⚠️", color: "#FF6B00" },
  { key: "gouvernance", name: "Gouvernance", icon: "🏛️", color: "#8B5CF6" },
  { key: "documentation", name: "Documentation", icon: "📄", color: "#00FF88" },
  { key: "formation", name: "Formation", icon: "🎓", color: "#FFB800" },
  { key: "conformite", name: "Conformité", icon: "✅", color: "#00F5FF" },
];

// Recommandations par catégorie et niveau
const RECOMMENDATIONS: Record<string, Record<string, string[]>> = {
  identification: {
    low: ["Réaliser un inventaire complet des systèmes IA", "Créer un registre centralisé", "Identifier les responsables par système"],
    medium: ["Compléter l'inventaire existant", "Formaliser les processus d'ajout d'outils"],
    high: ["Maintenir le registre à jour", "Automatiser la détection"],
  },
  classification: {
    low: ["Former aux 4 niveaux de risque AI Act", "Classifier chaque système", "Identifier les systèmes à haut risque"],
    medium: ["Affiner les classifications", "Documenter les justifications"],
    high: ["Maintenir la veille réglementaire"],
  },
  gouvernance: {
    low: ["Désigner un référent IA", "Rédiger une politique IA", "Créer un comité de gouvernance"],
    medium: ["Formaliser les rôles", "Mettre en place des indicateurs"],
    high: ["Optimiser les processus existants"],
  },
  documentation: {
    low: ["Documenter les systèmes à haut risque", "Tracer les décisions IA", "Conserver les logs"],
    medium: ["Standardiser les formats", "Automatiser les rapports"],
    high: ["Préparer les audits externes"],
  },
  formation: {
    low: ["Former tous les utilisateurs IA", "Formation certifiante responsables", "Sensibiliser la direction"],
    medium: ["Formations par métier", "Évaluer les compétences"],
    high: ["Maintenir les certifications"],
  },
  conformite: {
    low: ["Établir un plan de conformité", "Allouer un budget dédié", "Anticiper février 2025"],
    medium: ["Accélérer la mise en œuvre", "Préparer les preuves"],
    high: ["Anticiper les évolutions"],
  },
};

function ResultsContent() {
  const searchParams = useSearchParams();
  const scoreParam = searchParams.get("score");
  const plan = searchParams.get("plan") || "starter";
  
  const score = scoreParam ? parseInt(scoreParam) : 52;
  
  // Générer des scores par catégorie cohérents
  const [categoryScores] = useState(() => {
    const scores: Record<string, number> = {};
    CATEGORIES.forEach((cat) => {
      const variation = Math.floor(Math.random() * 30) - 15;
      scores[cat.key] = Math.max(15, Math.min(95, score + variation));
    });
    return scores;
  });

  // Déterminer le niveau de risque
  const getRiskInfo = (s: number) => {
    if (s >= 80) return { level: "Faible", color: "#00FF88", emoji: "🟢", desc: "Vous êtes bien préparé à l'AI Act." };
    if (s >= 60) return { level: "Modéré", color: "#FFB800", emoji: "🟡", desc: "Des améliorations sont nécessaires." };
    if (s >= 40) return { level: "Élevé", color: "#FF6B00", emoji: "🟠", desc: "Actions urgentes requises." };
    return { level: "Critique", color: "#FF4444", emoji: "🔴", desc: "Non-conformité majeure détectée." };
  };

  const risk = getRiskInfo(score);

  // Obtenir les recommandations prioritaires
  const getRecommendations = () => {
    const recs: { category: string; icon: string; text: string; priority: string }[] = [];
    
    Object.entries(categoryScores)
      .sort((a, b) => a[1] - b[1])
      .forEach(([key, catScore]) => {
        const cat = CATEGORIES.find((c) => c.key === key);
        if (!cat) return;
        
        let level: "low" | "medium" | "high" = "low";
        let priority = "Critique";
        if (catScore >= 70) { level = "high"; priority = "Faible"; }
        else if (catScore >= 50) { level = "medium"; priority = "Moyenne"; }
        
        const catRecs = RECOMMENDATIONS[key]?.[level] || [];
        catRecs.forEach((text) => {
          recs.push({ category: cat.name, icon: cat.icon, text, priority });
        });
      });
    
    return recs.slice(0, plan === "enterprise" ? 20 : plan === "pro" ? 15 : 10);
  };

  const recommendations = getRecommendations();

  // URL du rapport PDF
  const reportUrl = `/api/audit/report?score=${score}&plan=${plan}&categories=${encodeURIComponent(JSON.stringify(categoryScores))}`;

  return (
    <div className="min-h-screen bg-[#030014] text-white">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-[#030014]" />
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-[#8B5CF6]/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[#00F5FF]/10 blur-[100px] rounded-full" />
      </div>

      {/* Header */}
      <header className="relative z-40 px-6 py-4 border-b border-white/5">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#00F5FF] to-[#0066FF] rounded-xl flex items-center justify-center text-white font-bold">
              IA
            </div>
            <span className="font-bold text-lg">Formation-IA-Act.fr</span>
          </Link>
          <span className="text-sm text-white/40">Audit {plan.charAt(0).toUpperCase() + plan.slice(1)}</span>
        </div>
      </header>

      <main className="relative z-10 px-6 py-12">
        <div className="max-w-6xl mx-auto">
          
          {/* Titre */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-3xl sm:text-4xl font-bold mb-2">Résultats de votre audit AI Act</h1>
            <p className="text-white/60">Analyse complète de votre conformité</p>
          </motion.div>

          {/* Score principal + Graphique */}
          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            
            {/* Score Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8"
            >
              <div className="flex items-center gap-6">
                {/* Cercle score */}
                <div className="relative w-40 h-40">
                  <svg className="w-full h-full -rotate-90">
                    <circle cx="80" cy="80" r="70" fill="none" stroke="#1a1a2e" strokeWidth="12" />
                    <circle
                      cx="80"
                      cy="80"
                      r="70"
                      fill="none"
                      stroke={risk.color}
                      strokeWidth="12"
                      strokeLinecap="round"
                      strokeDasharray={440}
                      strokeDashoffset={440 - (440 * score) / 100}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-bold" style={{ color: risk.color }}>{score}%</span>
                    <span className="text-white/40 text-sm">Score global</span>
                  </div>
                </div>

                {/* Info risque */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">{risk.emoji}</span>
                    <span className="text-2xl font-bold" style={{ color: risk.color }}>
                      Risque {risk.level}
                    </span>
                  </div>
                  <p className="text-white/60 mb-4">{risk.desc}</p>
                  
                  <a
                    href={reportUrl}
                    download
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-[#8B5CF6] to-[#00F5FF] text-white font-bold px-6 py-3 rounded-xl hover:opacity-90 transition-opacity"
                  >
                    <span>📄</span>
                    Télécharger le rapport PDF
                  </a>
                </div>
              </div>
            </motion.div>

            {/* Scores par catégorie */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8"
            >
              <h3 className="font-bold text-lg mb-6">Scores par catégorie</h3>
              <div className="space-y-4">
                {CATEGORIES.map((cat) => {
                  const catScore = categoryScores[cat.key] || 50;
                  return (
                    <div key={cat.key}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-white/80">
                          {cat.icon} {cat.name}
                        </span>
                        <span className="text-sm font-bold" style={{ color: cat.color }}>
                          {catScore}%
                        </span>
                      </div>
                      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${catScore}%` }}
                          transition={{ duration: 1, delay: 0.2 }}
                          className="h-full rounded-full"
                          style={{ backgroundColor: cat.color }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>

          {/* Recommandations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8 mb-12"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-xl">📋 Recommandations prioritaires</h3>
              <span className="text-sm text-white/40">{recommendations.length} actions identifiées</span>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              {recommendations.map((rec, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * i }}
                  className="flex items-start gap-3 p-4 bg-white/5 rounded-xl"
                >
                  <span className="text-xl">{rec.icon}</span>
                  <div className="flex-1">
                    <p className="text-white/80 text-sm">{rec.text}</p>
                    <p className="text-xs text-white/40 mt-1">{rec.category}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    rec.priority === "Critique" ? "bg-red-500/20 text-red-400" :
                    rec.priority === "Moyenne" ? "bg-yellow-500/20 text-yellow-400" :
                    "bg-green-500/20 text-green-400"
                  }`}>
                    {rec.priority}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Timeline */}
          {(plan === "pro" || plan === "enterprise") && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8 mb-12"
            >
              <h3 className="font-bold text-xl mb-6">🗓️ Plan d'action recommandé</h3>
              
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-white/10" />
                
                {[
                  { phase: "Phase 1", time: "0-1 mois", title: "Urgences", color: "#FF4444", items: ["Stopper les pratiques interdites", "Désigner un responsable IA"] },
                  { phase: "Phase 2", time: "1-3 mois", title: "Fondations", color: "#FF6B00", items: ["Inventaire complet", "Classification des risques"] },
                  { phase: "Phase 3", time: "3-6 mois", title: "Conformité", color: "#FFB800", items: ["Documentation technique", "Gouvernance IA"] },
                  { phase: "Phase 4", time: "6-12 mois", title: "Optimisation", color: "#00FF88", items: ["Automatisation", "Audits réguliers"] },
                ].map((phase, i) => (
                  <div key={i} className="relative pl-12 pb-8">
                    <div
                      className="absolute left-2 w-5 h-5 rounded-full border-4 bg-[#030014]"
                      style={{ borderColor: phase.color }}
                    />
                    <div className="bg-white/5 rounded-xl p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-bold" style={{ color: phase.color }}>{phase.phase}</span>
                        <span className="text-white/40 text-sm">({phase.time})</span>
                        <span className="font-bold">{phase.title}</span>
                      </div>
                      <ul className="text-sm text-white/60 space-y-1">
                        {phase.items.map((item, j) => (
                          <li key={j}>☐ {item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Risques financiers */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-gradient-to-br from-red-500/10 to-orange-500/10 backdrop-blur-xl rounded-2xl border border-red-500/20 p-8 mb-12"
          >
            <h3 className="font-bold text-xl mb-4 text-red-400">⚠️ Risques financiers en cas de non-conformité</h3>
            <div className="grid sm:grid-cols-3 gap-4">
              {[
                { label: "Pratiques interdites", amount: "35M€ ou 7% CA", severity: "max" },
                { label: "Systèmes haut risque", amount: "15M€ ou 3% CA", severity: "high" },
                { label: "Autres obligations", amount: "7.5M€ ou 1.5% CA", severity: "medium" },
              ].map((r, i) => (
                <div key={i} className="bg-black/30 rounded-xl p-4 text-center">
                  <p className="text-white/60 text-sm mb-1">{r.label}</p>
                  <p className="text-xl font-bold text-red-400">Jusqu'à {r.amount}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Upsells */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6"
            >
              <span className="text-xs font-bold text-orange-400 bg-orange-400/20 px-2 py-1 rounded-full">
                RECOMMANDÉ
              </span>
              <h3 className="font-bold text-xl mt-3 mb-2">🎓 Formation Certifiante AI Act</h3>
              <p className="text-white/60 text-sm mb-4">
                8h de formation pour maîtriser l'AI Act. Certificat officiel inclus.
              </p>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-orange-400">500€ HT</span>
                <Link
                  href="/pricing"
                  className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-2 rounded-xl transition-colors"
                >
                  Découvrir
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6"
            >
              <span className="text-xs font-bold text-green-400 bg-green-400/20 px-2 py-1 rounded-full">
                INCLUS DANS PRO
              </span>
              <h3 className="font-bold text-xl mt-3 mb-2">📋 Pack Templates Conformité</h3>
              <p className="text-white/60 text-sm mb-4">
                12 documents prêts à l'emploi pour votre mise en conformité.
              </p>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-green-400">599€ HT</span>
                <Link
                  href="/templates"
                  className="bg-green-500 hover:bg-green-600 text-black font-bold px-6 py-2 rounded-xl transition-colors"
                >
                  Découvrir
                </Link>
              </div>
            </motion.div>
          </div>

          {/* Call expert (Pro/Enterprise) */}
          {(plan === "pro" || plan === "enterprise") && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="bg-gradient-to-r from-[#8B5CF6]/20 to-[#00F5FF]/20 backdrop-blur-xl rounded-2xl border border-[#8B5CF6]/30 p-8 text-center"
            >
              <div className="text-4xl mb-4">📞</div>
              <h3 className="font-bold text-2xl mb-2">Votre appel avec un expert est inclus !</h3>
              <p className="text-white/60 mb-6">
                {plan === "enterprise" ? "Workshop de 2h" : "Appel de 30 minutes"} pour analyser vos résultats et définir votre plan d'action.
              </p>
              <a
                href="https://calendly.com/formation-ia-act/audit"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#8B5CF6] text-white font-bold px-8 py-4 rounded-xl hover:bg-[#7C3AED] transition-colors"
              >
                <span>🗓️</span>
                Réserver mon créneau
              </a>
            </motion.div>
          )}

        </div>
      </main>
    </div>
  );
}

export default function AuditResultsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#030014] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <p>Chargement des résultats...</p>
        </div>
      </div>
    }>
      <ResultsContent />
    </Suspense>
  );
}
