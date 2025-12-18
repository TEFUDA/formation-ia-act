'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { 
  Shield, 
  CheckCircle2, 
  Clock, 
  Users, 
  Award, 
  BookOpen, 
  Play,
  Lock,
  ChevronRight,
  ArrowLeft,
  Download,
  Copy,
  UserPlus,
  Settings,
  LogOut,
  Menu,
  X
} from 'lucide-react'
import Link from 'next/link'

// Types
interface User {
  id: string
  name: string
  email: string
  progress: number
  completedModules: number[]
  certified: boolean
  certificationDate?: string
  plan: 'solo' | 'pme' | 'enterprise'
}

interface Module {
  id: number
  title: string
  description: string
  duration: string
  lessons: string[]
  videoUrl?: string
}

// Mock data des modules
const modules: Module[] = [
  {
    id: 1,
    title: "Comprendre l'AI Act",
    description: "Origines, objectifs et calendrier d'application du règlement européen",
    duration: "1h",
    lessons: ["Origines et objectifs de l'AI Act", "Calendrier d'application", "Acteurs concernés", "Articulation avec le RGPD"],
    videoUrl: ""
  },
  {
    id: 2,
    title: "Identifier les risques IA",
    description: "Classification des systèmes IA selon les 4 niveaux de risque",
    duration: "1h",
    lessons: ["Les 4 niveaux de risque", "IA interdites", "IA à haut risque", "IA à risque limité"],
    videoUrl: ""
  },
  {
    id: 3,
    title: "Cartographier vos usages",
    description: "Méthodologie d'audit et registre des systèmes IA",
    duration: "1h",
    lessons: ["Méthodologie d'audit interne", "Registre des systèmes IA", "Évaluation d'impact algorithmique", "Quick wins"],
    videoUrl: ""
  },
  {
    id: 4,
    title: "Mettre en place la gouvernance",
    description: "Organisation et politique IA d'entreprise",
    duration: "1h",
    lessons: ["Rôles et responsabilités", "Politique IA d'entreprise", "Comité de pilotage IA", "Intégration SMSI"],
    videoUrl: ""
  },
  {
    id: 5,
    title: "Documentation & traçabilité",
    description: "Documentation technique et marquage CE",
    duration: "1h",
    lessons: ["Documentation technique", "Conservation des logs", "Marquage CE", "Déclaration de conformité UE"],
    videoUrl: ""
  },
  {
    id: 6,
    title: "Audit & amélioration continue",
    description: "Audits internes et amélioration continue",
    duration: "1h",
    lessons: ["Audits internes", "Indicateurs de performance", "Amélioration continue", "Préparation aux contrôles"],
    videoUrl: ""
  }
]

// Quiz questions par module
const quizQuestions: Record<number, { question: string; options: string[]; correct: number }[]> = {
  1: [
    {
      question: "Quand l'AI Act est-il entré en vigueur ?",
      options: ["Janvier 2024", "Août 2024", "Février 2025", "Août 2026"],
      correct: 1
    },
    {
      question: "Quel article impose la formation obligatoire ?",
      options: ["Article 2", "Article 4", "Article 6", "Article 10"],
      correct: 1
    }
  ],
  2: [
    {
      question: "Combien de niveaux de risque définit l'AI Act ?",
      options: ["2", "3", "4", "5"],
      correct: 2
    },
    {
      question: "Les systèmes de scoring social sont classés comme :",
      options: ["Risque minimal", "Risque limité", "Haut risque", "Risque inacceptable"],
      correct: 3
    }
  ],
  // ... autres quiz
}

export default function FormationPage() {
  const t = useTranslations()
  const [user, setUser] = useState<User | null>(null)
  const [currentView, setCurrentView] = useState<'login' | 'dashboard' | 'module' | 'quiz' | 'certificate'>('login')
  const [currentModule, setCurrentModule] = useState<Module | null>(null)
  const [currentLesson, setCurrentLesson] = useState(0)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  
  // Login form state
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  
  // Quiz state
  const [quizAnswers, setQuizAnswers] = useState<number[]>([])
  const [quizSubmitted, setQuizSubmitted] = useState(false)

  // Simuler connexion
  const handleLogin = () => {
    if (email && name) {
      setUser({
        id: crypto.randomUUID(),
        name,
        email,
        progress: 0,
        completedModules: [],
        certified: false,
        plan: 'pme'
      })
      setCurrentView('dashboard')
    }
  }

  // Commencer un module
  const startModule = (module: Module) => {
    setCurrentModule(module)
    setCurrentLesson(0)
    setCurrentView('module')
  }

  // Compléter un module
  const completeModule = () => {
    if (user && currentModule) {
      const newCompleted = [...user.completedModules, currentModule.id]
      const newProgress = Math.round((newCompleted.length / modules.length) * 100)
      const isCertified = newCompleted.length === modules.length
      
      setUser({
        ...user,
        completedModules: newCompleted,
        progress: newProgress,
        certified: isCertified,
        certificationDate: isCertified ? new Date().toISOString() : undefined
      })
      setCurrentView('dashboard')
      setCurrentModule(null)
    }
  }

  // Calculer si le module est accessible
  const isModuleAccessible = (moduleId: number) => {
    if (moduleId === 1) return true
    return user?.completedModules.includes(moduleId - 1)
  }

  // Rendu Login
  if (currentView === 'login') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-slate-900/80 border-slate-800">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-white text-2xl">Formation AI Act</CardTitle>
            <CardDescription className="text-slate-400">
              Connectez-vous pour accéder à votre formation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm text-slate-400 block mb-2">Votre nom</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Jean Dupont"
              />
            </div>
            <div>
              <label className="text-sm text-slate-400 block mb-2">Email professionnel</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="jean.dupont@entreprise.fr"
              />
            </div>
            <Button 
              variant="gradient" 
              className="w-full" 
              size="lg"
              onClick={handleLogin}
              disabled={!email || !name}
            >
              Accéder à la formation
            </Button>
            <Link href="/" className="block">
              <Button variant="ghost" className="w-full text-slate-400">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour à l'accueil
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Rendu Dashboard
  if (currentView === 'dashboard' && user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
        {/* Header */}
        <header className="bg-slate-900/80 border-b border-slate-800 px-6 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Shield className="w-8 h-8 text-blue-500" />
              <div>
                <h1 className="text-lg font-bold text-white">Formation AI Act</h1>
                <p className="text-sm text-slate-400">{user.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm text-slate-400">Progression globale</p>
                <p className="text-xl font-bold text-white">{user.progress}%</p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setCurrentView('login')}>
                <LogOut className="w-5 h-5 text-slate-400" />
              </Button>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-6 py-8">
          {/* Progress Card */}
          <Card className="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 border-blue-500/30 mb-8">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-white mb-1">Bienvenue, {user.name} 👋</h2>
                  <p className="text-slate-400">
                    {user.certified 
                      ? "Félicitations ! Vous êtes certifié AI Act." 
                      : `${6 - user.completedModules.length} modules restants pour obtenir votre certification`
                    }
                  </p>
                </div>
                {user.certified && (
                  <Button variant="gradient" onClick={() => setCurrentView('certificate')}>
                    <Award className="w-4 h-4 mr-2" />
                    Voir mon certificat
                  </Button>
                )}
              </div>
              <div className="mt-4">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-slate-400">Progression</span>
                  <span className="text-white font-medium">{user.completedModules.length}/6 modules</span>
                </div>
                <Progress value={user.progress} className="h-3" />
              </div>
            </CardContent>
          </Card>

          {/* Modules Grid */}
          <h3 className="text-lg font-bold text-white mb-6">Modules de formation</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map((module) => {
              const isCompleted = user.completedModules.includes(module.id)
              const isAccessible = isModuleAccessible(module.id)
              const isInProgress = currentModule?.id === module.id
              
              return (
                <Card 
                  key={module.id} 
                  className={`bg-slate-900/80 border-slate-800 transition-all duration-300 ${
                    isAccessible ? 'hover:border-blue-500/50 cursor-pointer' : 'opacity-60'
                  } ${isCompleted ? 'border-green-500/50' : ''}`}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg ${
                        isCompleted 
                          ? 'bg-green-500' 
                          : isAccessible 
                            ? 'bg-gradient-to-br from-blue-500 to-cyan-400' 
                            : 'bg-slate-700'
                      }`}>
                        {isCompleted ? <CheckCircle2 className="w-6 h-6" /> : module.id}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-slate-400" />
                        <span className="text-sm text-slate-400">{module.duration}</span>
                      </div>
                    </div>
                    <CardTitle className="text-white">{module.title}</CardTitle>
                    <CardDescription className="text-slate-400">{module.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 mb-4">
                      {module.lessons.map((lesson, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm text-slate-400">
                          <div className={`w-1.5 h-1.5 rounded-full ${isCompleted ? 'bg-green-400' : 'bg-slate-600'}`} />
                          {lesson}
                        </div>
                      ))}
                    </div>
                    <Button 
                      variant={isCompleted ? "outline" : "gradient"} 
                      className="w-full"
                      disabled={!isAccessible}
                      onClick={() => isAccessible && startModule(module)}
                    >
                      {!isAccessible && <Lock className="w-4 h-4 mr-2" />}
                      {isCompleted ? 'Revoir' : isAccessible ? 'Commencer' : 'Verrouillé'}
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </main>
      </div>
    )
  }

  // Rendu Module
  if (currentView === 'module' && currentModule && user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
        {/* Header */}
        <header className="bg-slate-900/80 border-b border-slate-800 px-6 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <Button variant="ghost" onClick={() => setCurrentView('dashboard')}>
              <ArrowLeft className="w-5 h-5 mr-2" />
              Retour
            </Button>
            <div className="text-center">
              <h1 className="text-lg font-bold text-white">{currentModule.title}</h1>
              <p className="text-sm text-slate-400">Leçon {currentLesson + 1} / {currentModule.lessons.length}</p>
            </div>
            <div className="w-24" />
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-6 py-8">
          {/* Video Player */}
          <Card className="bg-slate-900/80 border-slate-800 mb-8">
            <CardContent className="p-0">
              <div className="aspect-video bg-slate-800 rounded-t-xl flex items-center justify-center">
                <div className="text-center">
                  <Play className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-400">Vidéo du module {currentModule.id}</p>
                  <p className="text-sm text-slate-500">"{currentModule.lessons[currentLesson]}"</p>
                </div>
              </div>
              <div className="p-6">
                <h2 className="text-xl font-bold text-white mb-2">{currentModule.lessons[currentLesson]}</h2>
                <p className="text-slate-400">
                  Contenu de la leçon sur {currentModule.lessons[currentLesson].toLowerCase()}.
                  Cette section couvre les aspects essentiels de la conformité AI Act.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <Button 
              variant="outline" 
              disabled={currentLesson === 0}
              onClick={() => setCurrentLesson(currentLesson - 1)}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Précédent
            </Button>
            
            {currentLesson < currentModule.lessons.length - 1 ? (
              <Button 
                variant="gradient"
                onClick={() => setCurrentLesson(currentLesson + 1)}
              >
                Suivant
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button 
                variant="gradient"
                onClick={completeModule}
              >
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Valider le module
              </Button>
            )}
          </div>

          {/* Lessons Sidebar */}
          <Card className="bg-slate-900/80 border-slate-800 mt-8">
            <CardHeader>
              <CardTitle className="text-white text-lg">Contenu du module</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {currentModule.lessons.map((lesson, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentLesson(idx)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                      idx === currentLesson 
                        ? 'bg-blue-500/20 text-blue-400' 
                        : idx < currentLesson 
                          ? 'text-green-400 hover:bg-slate-800' 
                          : 'text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm ${
                      idx === currentLesson 
                        ? 'bg-blue-500 text-white' 
                        : idx < currentLesson 
                          ? 'bg-green-500 text-white' 
                          : 'bg-slate-700 text-slate-400'
                    }`}>
                      {idx < currentLesson ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                    </div>
                    <span className="text-left">{lesson}</span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  // Rendu Certificate
  if (currentView === 'certificate' && user?.certified) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl bg-white text-slate-900">
          <CardContent className="p-12 text-center">
            <Award className="w-20 h-20 text-yellow-500 mx-auto mb-6" />
            <h1 className="text-3xl font-bold mb-2">Certificat de Conformité</h1>
            <h2 className="text-xl text-blue-600 mb-8">AI Act - Article 4</h2>
            
            <p className="text-slate-600 mb-2">Ce certificat atteste que</p>
            <p className="text-3xl font-bold text-slate-900 mb-4">{user.name}</p>
            
            <p className="text-slate-600 mb-8">
              a suivi avec succès la formation complète sur le Règlement Européen 
              sur l'Intelligence Artificielle (AI Act) et possède les compétences 
              requises par l'Article 4.
            </p>
            
            <div className="flex items-center justify-center gap-8 text-sm text-slate-500 mb-8">
              <div>
                <p className="font-medium text-slate-700">Date de certification</p>
                <p>{new Date(user.certificationDate!).toLocaleDateString('fr-FR')}</p>
              </div>
              <div>
                <p className="font-medium text-slate-700">Identifiant</p>
                <p>{user.id.slice(0, 8).toUpperCase()}</p>
              </div>
            </div>
            
            <div className="flex justify-center gap-4">
              <Button variant="outline" onClick={() => setCurrentView('dashboard')}>
                Retour
              </Button>
              <Button variant="gradient">
                <Download className="w-4 h-4 mr-2" />
                Télécharger PDF
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return null
}
