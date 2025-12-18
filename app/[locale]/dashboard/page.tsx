'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpen, Download, Play, CheckCircle, Lock, ChevronRight,
  FileSpreadsheet, FileText, ClipboardList, Award, LogOut,
  User, BarChart3, Clock, Trophy
} from 'lucide-react';
import Link from 'next/link';

const modules = [
  { id: 1, title: "Introduction à l'AI Act", description: "Comprendre les fondamentaux du règlement européen", duration: "45 min", lessons: 5, completed: true, progress: 100 },
  { id: 2, title: "Classification des risques", description: "Les 4 niveaux de risque et leurs implications", duration: "1h", lessons: 6, completed: true, progress: 100 },
  { id: 3, title: "Registre des systèmes IA", description: "Cartographier et documenter vos usages IA", duration: "1h15", lessons: 7, completed: false, progress: 60 },
  { id: 4, title: "Gouvernance IA", description: "Mettre en place une politique IA efficace", duration: "1h", lessons: 5, completed: false, progress: 0 },
  { id: 5, title: "Systèmes haut risque", description: "Documentation technique et marquage CE", duration: "1h30", lessons: 8, completed: false, progress: 0 },
  { id: 6, title: "Audit et conformité", description: "Préparer et maintenir votre conformité", duration: "1h", lessons: 6, completed: false, progress: 0 },
];

const resources = [
  { id: 1, name: "Guide AI Act - Synthèse", module: 1, type: "pdf", file: "guide-ai-act-synthese.pdf", value: 97 },
  { id: 2, name: "Checklist : Êtes-vous concerné ?", module: 1, type: "xlsx", file: "checklist-etes-vous-concerne.xlsx", value: 47 },
  { id: 3, name: "Matrice classification risques", module: 2, type: "xlsx", file: "matrice-classification-risques.xlsx", value: 127 },
  { id: 4, name: "Exemples par secteur d'activité", module: 2, type: "pdf", file: "exemples-secteurs-activite.pdf", value: 67 },
  { id: 5, name: "Template Registre IA", module: 3, type: "xlsx", file: "template-registre-ia.xlsx", value: 97 },
  { id: 6, name: "Guide d'audit pas à pas", module: 3, type: "pdf", file: "guide-audit-pas-a-pas.pdf", value: 77 },
  { id: 7, name: "Modèle Politique IA", module: 4, type: "docx", file: "modele-politique-ia.docx", value: 67 },
  { id: 8, name: "Fiche de poste Référent IA", module: 4, type: "docx", file: "fiche-poste-referent-ia.docx", value: 47 },
  { id: 9, name: "Template Documentation technique", module: 5, type: "docx", file: "template-documentation-technique.docx", value: 97 },
  { id: 10, name: "Checklist Marquage CE", module: 5, type: "xlsx", file: "checklist-marquage-ce.xlsx", value: 47 },
  { id: 11, name: "Plan d'audit type", module: 6, type: "xlsx", file: "plan-audit-type.xlsx", value: 47 },
  { id: 12, name: "Tableau de bord conformité", module: 6, type: "xlsx", file: "tableau-bord-conformite-ia.xlsx", value: 127 },
];

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
    case 'xlsx': return 'text-emerald-400 bg-emerald-400/10';
    case 'docx': return 'text-blue-400 bg-blue-400/10';
    case 'pdf': return 'text-red-400 bg-red-400/10';
    default: return 'text-slate-400 bg-slate-400/10';
  }
};

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<'modules' | 'resources'>('modules');
  const [selectedModule, setSelectedModule] = useState<number | null>(null);
  const totalProgress = Math.round(modules.reduce((acc, m) => acc + m.progress, 0) / modules.length);
  const filteredResources = selectedModule ? resources.filter(r => r.module === selectedModule) : resources;

  return (
    <div className="min-h-screen bg-slate-900">
      <aside className="fixed left-0 top-0 h-full w-64 bg-slate-800 border-r border-slate-700 z-40">
        <div className="p-4 border-b border-slate-700">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">IA</span>
            </div>
            <span className="text-white font-semibold">Formation AI Act</span>
          </Link>
        </div>
        <nav className="p-4 space-y-2">
          <button onClick={() => setActiveTab('modules')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'modules' ? 'bg-blue-500/20 text-blue-400' : 'text-slate-400 hover:bg-slate-700'}`}>
            <BookOpen className="w-5 h-5" /><span>Modules</span>
          </button>
          <button onClick={() => setActiveTab('resources')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'resources' ? 'bg-blue-500/20 text-blue-400' : 'text-slate-400 hover:bg-slate-700'}`}>
            <Download className="w-5 h-5" /><span>Ressources</span>
            <span className="ml-auto bg-emerald-500 text-white text-xs px-2 py-0.5 rounded-full">12</span>
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:bg-slate-700 transition-colors">
            <Award className="w-5 h-5" /><span>Certificat</span>
          </button>
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-white text-sm font-medium">Jean Dupont</p>
              <p className="text-slate-400 text-xs">Offre Équipe</p>
            </div>
          </div>
          <Link href="/login" className="flex items-center gap-2 text-slate-400 hover:text-white text-sm transition-colors">
            <LogOut className="w-4 h-4" />Déconnexion
          </Link>
        </div>
      </aside>

      <main className="ml-64 p-8">
        <div className="grid grid-cols-4 gap-6 mb-8">
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center"><BarChart3 className="w-6 h-6 text-blue-400" /></div>
              <div><p className="text-slate-400 text-sm">Progression</p><p className="text-2xl font-bold text-white">{totalProgress}%</p></div>
            </div>
          </div>
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-500/20 rounded-lg flex items-center justify-center"><CheckCircle className="w-6 h-6 text-emerald-400" /></div>
              <div><p className="text-slate-400 text-sm">Modules terminés</p><p className="text-2xl font-bold text-white">{modules.filter(m => m.completed).length}/{modules.length}</p></div>
            </div>
          </div>
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center"><Clock className="w-6 h-6 text-purple-400" /></div>
              <div><p className="text-slate-400 text-sm">Temps restant</p><p className="text-2xl font-bold text-white">4h30</p></div>
            </div>
          </div>
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center"><Trophy className="w-6 h-6 text-orange-400" /></div>
              <div><p className="text-slate-400 text-sm">Certificat</p><p className="text-lg font-bold text-orange-400">En cours...</p></div>
            </div>
          </div>
        </div>

        {activeTab === 'modules' ? (
          <div>
            <h1 className="text-2xl font-bold text-white mb-6">Vos modules de formation</h1>
            <div className="grid gap-4">
              {modules.map((module, index) => (
                <motion.div key={module.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }} className="bg-slate-800 rounded-xl border border-slate-700 p-6 hover:border-slate-600 transition-colors">
                  <div className="flex items-center gap-6">
                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${module.completed ? 'bg-emerald-500/20' : module.progress > 0 ? 'bg-blue-500/20' : 'bg-slate-700'}`}>
                      {module.completed ? <CheckCircle className="w-7 h-7 text-emerald-400" /> : module.progress > 0 ? <Play className="w-7 h-7 text-blue-400" /> : <Lock className="w-7 h-7 text-slate-500" />}
                    </div>
                    <div className="flex-grow">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-slate-500 text-sm">Module {module.id}</span>
                        <span className="text-slate-600">•</span>
                        <span className="text-slate-500 text-sm">{module.duration}</span>
                        <span className="text-slate-600">•</span>
                        <span className="text-slate-500 text-sm">{module.lessons} leçons</span>
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-1">{module.title}</h3>
                      <p className="text-slate-400 text-sm">{module.description}</p>
                      <div className="mt-3 flex items-center gap-3">
                        <div className="flex-grow h-2 bg-slate-700 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full transition-all ${module.completed ? 'bg-emerald-500' : 'bg-blue-500'}`} style={{ width: `${module.progress}%` }} />
                        </div>
                        <span className="text-sm text-slate-400">{module.progress}%</span>
                      </div>
                    </div>
                    <button className={`px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors ${module.completed ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' : module.progress > 0 ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-slate-700 text-slate-400'}`}>
                      {module.completed ? 'Revoir' : module.progress > 0 ? 'Continuer' : 'Commencer'}<ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-white">Vos ressources</h1>
                <p className="text-slate-400">12 ressources professionnelles (847€ de valeur incluse)</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-400 text-sm">Filtrer :</span>
                <select value={selectedModule || ''} onChange={(e) => setSelectedModule(e.target.value ? Number(e.target.value) : null)} className="bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Tous les modules</option>
                  {modules.map(m => (<option key={m.id} value={m.id}>Module {m.id} - {m.title}</option>))}
                </select>
              </div>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredResources.map((resource, index) => (
                <motion.div key={resource.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} className="bg-slate-800 rounded-xl border border-slate-700 p-5 hover:border-slate-600 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getFileColor(resource.type)}`}>{getFileIcon(resource.type)}</div>
                    <div className="flex-grow min-w-0">
                      <span className="text-xs text-slate-500 uppercase">Module {resource.module}</span>
                      <h3 className="text-white font-medium mt-1 truncate">{resource.name}</h3>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs text-slate-500 uppercase">{resource.type}</span>
                        <span className="text-xs text-emerald-400">({resource.value}€ de valeur)</span>
                      </div>
                    </div>
                  </div>
                  <a href={`/resources/${resource.file}`} download className="mt-4 w-full bg-slate-700 hover:bg-slate-600 text-white py-2 rounded-lg flex items-center justify-center gap-2 transition-colors text-sm">
                    <Download className="w-4 h-4" />Télécharger
                  </a>
                </motion.div>
              ))}
            </div>
            <div className="mt-8 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 rounded-xl border border-emerald-500/30 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-white">Télécharger toutes les ressources</h3>
                  <p className="text-slate-400 text-sm">12 fichiers • Excel, Word et PDF • 847€ de valeur</p>
                </div>
                <a href="/resources/ressources-formation-ia-act.zip" download className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors font-medium">
                  <Download className="w-5 h-5" />Tout télécharger (.zip)
                </a>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
