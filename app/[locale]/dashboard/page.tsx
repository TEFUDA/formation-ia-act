'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Play, CheckCircle, Lock, ChevronRight, Download,
  FileSpreadsheet, FileText, ClipboardList, Award, LogOut,
  User, Clock, Trophy, ArrowRight, Sparkles, BookOpen,
  BarChart3, Calendar, Gift, Home
} from 'lucide-react';
import Link from 'next/link';

const modules = [
  { id: 1, title: "Introduction à l'AI Act", description: "Comprendre les fondamentaux", duration: "45 min", completed: true, progress: 100 },
  { id: 2, title: "Classification des risques", description: "Les 4 niveaux de risque", duration: "1h", completed: true, progress: 100 },
  { id: 3, title: "Registre des systèmes IA", description: "Cartographier vos usages", duration: "1h15", completed: false, progress: 60 },
  { id: 4, title: "Gouvernance IA", description: "Politique et organisation", duration: "1h", completed: false, progress: 0 },
  { id: 5, title: "Systèmes haut risque", description: "Documentation technique", duration: "1h30", completed: false, progress: 0 },
  { id: 6, title: "Audit et conformité", description: "Maintenir la conformité", duration: "1h", completed: false, progress: 0 },
];

const resources = [
  { id: 1, name: "Guide AI Act - Synthèse", module: 1, type: "pdf", file: "guide-ai-act-synthese.pdf" },
  { id: 2, name: "Checklist : Êtes-vous concerné ?", module: 1, type: "xlsx", file: "checklist-etes-vous-concerne.xlsx" },
  { id: 3, name: "Matrice classification risques", module: 2, type: "xlsx", file: "matrice-classification-risques.xlsx" },
  { id: 4, name: "Exemples par secteur", module: 2, type: "pdf", file: "exemples-secteurs-activite.pdf" },
  { id: 5, name: "Template Registre IA", module: 3, type: "xlsx", file: "template-registre-ia.xlsx" },
  { id: 6, name: "Guide d'audit pas à pas", module: 3, type: "pdf", file: "guide-audit-pas-a-pas.pdf" },
  { id: 7, name: "Modèle Politique IA", module: 4, type: "docx", file: "modele-politique-ia.docx" },
  { id: 8, name: "Fiche de poste Référent IA", module: 4, type: "docx", file: "fiche-poste-referent-ia.docx" },
  { id: 9, name: "Template Documentation technique", module: 5, type: "docx", file: "template-documentation-technique.docx" },
  { id: 10, name: "Checklist Marquage CE", module: 5, type: "xlsx", file: "checklist-marquage-ce.xlsx" },
  { id: 11, name: "Plan d'audit type", module: 6, type: "xlsx", file: "plan-audit-type.xlsx" },
  { id: 12, name: "Tableau de bord conformité", module: 6, type: "xlsx", file: "tableau-bord-conformite-ia.xlsx" },
];

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<'formation' | 'ressources'>('formation');
  
  const completedModules = modules.filter(m => m.completed).length;
  const totalProgress = Math.round(modules.reduce((acc, m) => acc + m.progress, 0) / modules.length);
  const currentModule = modules.find(m => !m.completed && m.progress > 0) || modules.find(m => !m.completed);

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'xlsx': return <FileSpreadsheet className="w-5 h-5" />;
      case 'docx': return <FileText className="w-5 h-5" />;
      case 'pdf': return <ClipboardList className="w-5 h-5" />;
      default: return <FileText className="w-5 h-5" />;
    }
  };

  const getFileColor = (type: string) => {
    switch (type) {
      case 'xlsx': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'docx': return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
      case 'pdf': return 'text-red-400 bg-red-500/10 border-red-500/20';
      default: return 'text-slate-400 bg-slate-500/10 border-slate-500/20';
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0f1a]">
      {/* Header simple */}
      <header className="bg-[#0a0f1a]/80 backdrop-blur-lg border-b border-slate-800/50 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-semibold text-white">Formation AI Act</span>
            </Link>
            
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 text-sm text-slate-400">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <span>Jean D.</span>
              </div>
              <Link href="/login" className="text-slate-400 hover:text-white transition-colors">
                <LogOut className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Welcome + Progress */}
        <div className="mb-8">
          <motion.div 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6"
          >
            <div>
              <h1 className="text-2xl font-bold text-white mb-1">Bonjour Jean 👋</h1>
              <p className="text-slate-400">Continuez votre parcours de formation</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-2 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-400" />
                <span className="text-white font-medium">{completedModules}/6</span>
                <span className="text-slate-400 text-sm">modules</span>
              </div>
            </div>
          </motion.div>

          {/* Progress bar global */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-slate-300 font-medium">Progression globale</span>
              <span className="text-2xl font-bold text-white">{totalProgress}%</span>
            </div>
            <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${totalProgress}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
              />
            </div>
            <div className="flex items-center justify-between mt-3 text-sm">
              <span className="text-slate-500">{completedModules} modules terminés</span>
              <span className="text-slate-500">~{6 - completedModules}h restantes</span>
            </div>
          </motion.div>
        </div>

        {/* Continue Module Card */}
        {currentModule && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-2xl p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                    {currentModule.id}
                  </div>
                  <div>
                    <p className="text-cyan-400 text-sm font-medium mb-1">Continuer</p>
                    <h3 className="text-xl font-bold text-white mb-1">{currentModule.title}</h3>
                    <p className="text-slate-400 text-sm">{currentModule.description}</p>
                    {currentModule.progress > 0 && (
                      <div className="flex items-center gap-2 mt-2">
                        <div className="w-24 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                          <div className="h-full bg-cyan-500 rounded-full" style={{ width: `${currentModule.progress}%` }} />
                        </div>
                        <span className="text-cyan-400 text-xs">{currentModule.progress}%</span>
                      </div>
                    )}
                  </div>
                </div>
                <button className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold px-6 py-3 rounded-xl hover:opacity-90 transition-opacity flex items-center gap-2 whitespace-nowrap">
                  <Play className="w-5 h-5" />
                  {currentModule.progress > 0 ? 'Reprendre' : 'Commencer'}
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('formation')}
            className={`px-5 py-2.5 rounded-xl font-medium transition-all ${
              activeTab === 'formation'
                ? 'bg-white text-slate-900'
                : 'bg-slate-800/50 text-slate-400 hover:text-white'
            }`}
          >
            Formation
          </button>
          <button
            onClick={() => setActiveTab('ressources')}
            className={`px-5 py-2.5 rounded-xl font-medium transition-all flex items-center gap-2 ${
              activeTab === 'ressources'
                ? 'bg-white text-slate-900'
                : 'bg-slate-800/50 text-slate-400 hover:text-white'
            }`}
          >
            Ressources
            <span className="bg-emerald-500 text-white text-xs px-2 py-0.5 rounded-full">12</span>
          </button>
        </div>

        {activeTab === 'formation' ? (
          /* Modules List */
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            className="space-y-3"
          >
            {modules.map((module, index) => (
              <motion.div
                key={module.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`bg-slate-800/30 border rounded-xl p-4 transition-all ${
                  module.completed 
                    ? 'border-emerald-500/30 hover:border-emerald-500/50' 
                    : module.progress > 0 
                      ? 'border-cyan-500/30 hover:border-cyan-500/50' 
                      : 'border-slate-700/50 hover:border-slate-600'
                }`}
              >
                <div className="flex items-center gap-4">
                  {/* Status Icon */}
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    module.completed 
                      ? 'bg-emerald-500/20' 
                      : module.progress > 0 
                        ? 'bg-cyan-500/20' 
                        : 'bg-slate-800'
                  }`}>
                    {module.completed ? (
                      <CheckCircle className="w-6 h-6 text-emerald-400" />
                    ) : module.progress > 0 ? (
                      <Play className="w-6 h-6 text-cyan-400" />
                    ) : (
                      <span className="text-slate-500 font-bold">{module.id}</span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className="font-semibold text-white truncate">{module.title}</h3>
                      <span className="text-slate-500 text-sm hidden sm:inline">• {module.duration}</span>
                    </div>
                    <p className="text-slate-400 text-sm truncate">{module.description}</p>
                  </div>

                  {/* Action */}
                  <div className="flex items-center gap-3 flex-shrink-0">
                    {module.progress > 0 && !module.completed && (
                      <div className="hidden sm:flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                          <div className="h-full bg-cyan-500 rounded-full" style={{ width: `${module.progress}%` }} />
                        </div>
                        <span className="text-slate-400 text-xs">{module.progress}%</span>
                      </div>
                    )}
                    <button className={`p-2 rounded-lg transition-colors ${
                      module.completed
                        ? 'text-slate-400 hover:bg-slate-700'
                        : module.progress > 0
                          ? 'text-cyan-400 hover:bg-cyan-500/10'
                          : 'text-slate-500 hover:bg-slate-700'
                    }`}>
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          /* Resources Grid */
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {/* Download All Banner */}
            <div className="bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border border-emerald-500/20 rounded-xl p-4 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                  <Gift className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <p className="text-white font-medium">12 ressources incluses</p>
                  <p className="text-slate-400 text-sm">847€ de valeur offerte</p>
                </div>
              </div>
              
                href="/resources/ressources-formation-ia-act.zip"
                download
                className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors font-medium text-sm"
              >
                <Download className="w-4 h-4" />
                Tout télécharger
              </a>
            </div>

            {/* Resources Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {resources.map((resource, index) => (
                <motion.a
                  key={resource.id}
                  href={`/resources/${resource.file}`}
                  download
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-4 hover:border-slate-600 transition-all group"
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center border ${getFileColor(resource.type)}`}>
                      {getFileIcon(resource.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium text-sm truncate group-hover:text-cyan-400 transition-colors">
                        {resource.name}
                      </p>
                      <p className="text-slate-500 text-xs mt-0.5">
                        Module {resource.module} • {resource.type.toUpperCase()}
                      </p>
                    </div>
                    <Download className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition-colors flex-shrink-0" />
                  </div>
                </motion.a>
              ))}
            </div>
          </motion.div>
        )}

        {/* Certificat Banner */}
        {totalProgress >= 100 ? (
          <motion.div 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 rounded-2xl p-6 text-center"
          >
            <Award className="w-12 h-12 text-amber-400 mx-auto mb-3" />
            <h3 className="text-xl font-bold text-white mb-2">Félicitations ! 🎉</h3>
            <p className="text-slate-300 mb-4">Vous avez terminé la formation. Téléchargez votre certificat.</p>
            <button className="bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold px-6 py-3 rounded-xl hover:opacity-90 transition-opacity">
              Obtenir mon certificat
            </button>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8 bg-slate-800/30 border border-slate-700/50 rounded-xl p-5 flex items-center gap-4"
          >
            <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center flex-shrink-0">
              <Award className="w-6 h-6 text-slate-500" />
            </div>
            <div className="flex-1">
              <p className="text-white font-medium">Certificat de compétence</p>
              <p className="text-slate-400 text-sm">Terminez les 6 modules pour l'obtenir</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-white">{totalProgress}%</p>
              <p className="text-slate-500 text-xs">complété</p>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}
