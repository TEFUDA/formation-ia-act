'use client'

import { useTranslations } from 'next-intl'
import { useState, useEffect } from 'react'
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
  AlertTriangle,
  ArrowRight,
  Star,
  Zap,
  FileCheck,
  Building2,
  ChevronRight,
  Play,
  FileText,
  Headphones,
  Timer,
  TrendingUp
} from 'lucide-react'
import Link from 'next/link'

// Calcul des jours restants jusqu'au 2 août 2026
function getDaysUntilDeadline() {
  const deadline = new Date('2026-08-02')
  const today = new Date()
  const diffTime = deadline.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
}

function getProgressPercentage() {
  const start = new Date('2024-08-01') // Entrée en vigueur
  const deadline = new Date('2026-08-02')
  const today = new Date()
  const total = deadline.getTime() - start.getTime()
  const elapsed = today.getTime() - start.getTime()
  return Math.min(Math.round((elapsed / total) * 100), 100)
}

export default function LandingPage() {
  const t = useTranslations()
  const [daysLeft, setDaysLeft] = useState(getDaysUntilDeadline())
  const [progress, setProgress] = useState(getProgressPercentage())

  useEffect(() => {
    setDaysLeft(getDaysUntilDeadline())
    setProgress(getProgressPercentage())
  }, [])

  return (
    <div className="min-h-screen bg-[#0a0f1a]">
      {/* Bandeau d'urgence rouge */}
      <div className="bg-gradient-to-r from-red-600 to-red-500 text-white py-3 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 text-sm md:text-base">
          <Timer className="w-5 h-5 animate-pulse" />
          <span className="font-medium">
            AI Act 2026 : Plus que <span className="font-bold text-yellow-300">{daysLeft} jours</span> pour vous mettre en conformité
          </span>
          <span className="hidden md:inline">|</span>
          <span className="hidden md:inline font-medium">
            Amendes jusqu'à <span className="font-bold">35M€</span> ou <span className="font-bold">7% du CA</span>
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="bg-[#0a0f1a]/80 backdrop-blur-lg border-b border-slate-800/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold">
                <span className="text-white">Formation-</span>
                <span className="text-cyan-400">IA-Act</span>
                <span className="text-white">.fr</span>
              </span>
            </div>
            <Link href="/formation">
              <Button variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white">
                Connexion
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-12 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column */}
            <div>
              {/* Badge alerte */}
              <div className="inline-flex items-center gap-2 bg-orange-500/20 border border-orange-500/40 rounded-full px-4 py-2 mb-6">
                <AlertTriangle className="w-4 h-4 text-orange-400" />
                <span className="text-orange-400 text-sm font-medium">Obligation légale depuis février 2025</span>
              </div>
              
              {/* Title */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-2 leading-tight">
                Formez vos équipes
                <br />
                à l'<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">AI Act</span>
              </h1>
              <p className="text-2xl sm:text-3xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-400 mb-6">
                avant les sanctions
              </p>
              
              {/* Subtitle */}
              <p className="text-lg text-slate-400 mb-8 max-w-xl">
                La première formation en ligne certifiante pour mettre votre entreprise en conformité avec le règlement européen sur l'Intelligence Artificielle.
              </p>
              
              {/* Features Grid */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-slate-400" />
                  </div>
                  <span className="text-slate-300 text-sm">6 modules • 8h de formation</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center">
                    <Award className="w-5 h-5 text-slate-400" />
                  </div>
                  <span className="text-slate-300 text-sm">Certification reconnue</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-slate-400" />
                  </div>
                  <span className="text-slate-300 text-sm">Templates & checklists inclus</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center">
                    <Headphones className="w-5 h-5 text-slate-400" />
                  </div>
                  <span className="text-slate-300 text-sm">Support expert inclus</span>
                </div>
              </div>
              
              {/* CTA Button */}
              <Link href="/formation">
                <Button className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-lg px-8 py-6 rounded-xl shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-all">
                  <Zap className="w-5 h-5 mr-2" />
                  Évaluez votre niveau de risque
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              
              {/* Social Proof */}
              <div className="flex items-center gap-6 mt-8">
                <div className="flex -space-x-2">
                  {['A', 'B', 'C', 'D', 'E'].map((letter, i) => (
                    <div 
                      key={letter}
                      className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 border-2 border-[#0a0f1a] flex items-center justify-center text-xs font-medium text-white"
                    >
                      {letter}
                    </div>
                  ))}
                </div>
                <div className="text-slate-400 text-sm">
                  <span className="text-white font-semibold">+2,847</span> professionnels formés
                </div>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                  <span className="text-slate-400 text-sm ml-1">4.9/5</span>
                </div>
              </div>
            </div>

            {/* Right Column - Countdown Card */}
            <div className="lg:pl-8">
              <Card className="bg-[#111827] border-slate-800 overflow-hidden">
                <CardContent className="p-8">
                  {/* Countdown Number */}
                  <div className="text-center mb-6">
                    <div className="text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-red-400 to-orange-500 mb-2">
                      {daysLeft}
                    </div>
                    <p className="text-slate-400">jours avant l'échéance AI Act</p>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="mb-8">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-slate-400">Progression vers la deadline</span>
                      <span className="text-orange-400 font-semibold">{progress}%</span>
                    </div>
                    <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full transition-all duration-1000"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                  
                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-800/50 rounded-xl p-4 text-center">
                      <div className="text-2xl font-bold text-white mb-1">35M€</div>
                      <div className="text-xs text-slate-400">Amende maximale</div>
                    </div>
                    <div className="bg-slate-800/50 rounded-xl p-4 text-center">
                      <div className="text-2xl font-bold text-white mb-1">7%</div>
                      <div className="text-xs text-slate-400">Du CA mondial</div>
                    </div>
                    <div className="bg-slate-800/50 rounded-xl p-4 text-center">
                      <div className="text-2xl font-bold text-white mb-1">100%</div>
                      <div className="text-xs text-slate-400">Entreprises concernées</div>
                    </div>
                    <div className="bg-slate-800/50 rounded-xl p-4 text-center">
                      <div className="text-2xl font-bold text-white mb-1">Art. 4</div>
                      <div className="text-xs text-slate-400">Formation obligatoire</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Urgency Section - Timeline */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">{t('urgency.title')}</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              L'AI Act entre progressivement en application. Ne vous laissez pas surprendre.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {/* Deadline 1 - PASSÉ */}
            <Card className="bg-red-500/10 border-red-500/30 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                PASSÉ
              </div>
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center mb-4">
                  <AlertTriangle className="w-6 h-6 text-red-400" />
                </div>
                <CardTitle className="text-white">{t('urgency.deadline1.date')}</CardTitle>
                <CardDescription className="text-red-300 font-medium">
                  {t('urgency.deadline1.title')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-slate-400">{t('urgency.deadline1.description')}</p>
              </CardContent>
            </Card>

            {/* Deadline 2 - URGENT */}
            <Card className="bg-orange-500/10 border-orange-500/30 relative overflow-hidden ring-2 ring-orange-500/50">
              <div className="absolute top-0 right-0 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg animate-pulse">
                URGENT
              </div>
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center mb-4">
                  <Clock className="w-6 h-6 text-orange-400" />
                </div>
                <CardTitle className="text-white">{t('urgency.deadline2.date')}</CardTitle>
                <CardDescription className="text-orange-300 font-medium">
                  {t('urgency.deadline2.title')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-slate-400">{t('urgency.deadline2.description')}</p>
              </CardContent>
            </Card>

            {/* Deadline 3 */}
            <Card className="bg-blue-500/10 border-blue-500/30">
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center mb-4">
                  <FileCheck className="w-6 h-6 text-blue-400" />
                </div>
                <CardTitle className="text-white">{t('urgency.deadline3.date')}</CardTitle>
                <CardDescription className="text-blue-300 font-medium">
                  {t('urgency.deadline3.title')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-slate-400">{t('urgency.deadline3.description')}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Modules Section */}
      <section id="modules" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">{t('modules.title')}</h2>
            <p className="text-slate-400">{t('modules.subtitle')}</p>
            <div className="inline-flex items-center gap-2 bg-slate-800 rounded-full px-4 py-2 mt-4">
              <Clock className="w-4 h-4 text-cyan-400" />
              <span className="text-slate-300 text-sm">{t('modules.duration')}</span>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((num) => (
              <Card key={num} className="bg-[#111827] border-slate-800 hover:border-cyan-500/50 transition-all duration-300 group">
                <CardHeader>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-white font-bold text-lg">
                      {num}
                    </div>
                    <div className="text-xs text-slate-400 bg-slate-800 px-2 py-1 rounded">
                      {t(`modules.module${num}.duration`)}
                    </div>
                  </div>
                  <CardTitle className="text-white group-hover:text-cyan-400 transition-colors">
                    {t(`modules.module${num}.title`)}
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    {t(`modules.module${num}.description`)}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {(t.raw(`modules.module${num}.lessons`) as string[]).map((lesson: string, idx: number) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-slate-300">
                        <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
                        {lesson}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">{t('pricing.title')}</h2>
            <p className="text-slate-400">{t('pricing.subtitle')}</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Solo */}
            <Card className="bg-[#111827] border-slate-800">
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-white text-xl">{t('pricing.solo.name')}</CardTitle>
                <CardDescription className="text-slate-400">
                  {t('pricing.solo.description')}
                </CardDescription>
                <div className="mt-6">
                  <span className="text-5xl font-bold text-white">{t('pricing.solo.price')}</span>
                  <span className="text-slate-400">{t('pricing.solo.period')}</span>
                </div>
                <div className="text-sm text-slate-400 mt-2">{t('pricing.solo.seats')}</div>
                <div className="text-xs text-cyan-400 mt-1">{t('pricing.solo.pricePerSeat')}</div>
              </CardHeader>
              <CardContent className="space-y-4">
                {(t.raw('pricing.solo.features') as string[]).map((feature: string, idx: number) => (
                  <div key={idx} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <span className="text-slate-300 text-sm">{feature}</span>
                  </div>
                ))}
                <Link href="/formation" className="block pt-4">
                  <Button variant="outline" className="w-full border-slate-700 text-white hover:bg-slate-800">
                    {t('pricing.cta')}
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Équipe - Popular */}
            <Card className="bg-gradient-to-b from-orange-600/20 to-[#111827] border-orange-500/50 relative scale-105 shadow-xl shadow-orange-500/20">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-sm font-bold px-4 py-1 rounded-full">
                {t('pricing.pme.popular')}
              </div>
              <CardHeader className="text-center pb-8 pt-8">
                <CardTitle className="text-white text-xl">{t('pricing.pme.name')}</CardTitle>
                <CardDescription className="text-slate-400">
                  {t('pricing.pme.description')}
                </CardDescription>
                <div className="mt-6">
                  <span className="text-5xl font-bold text-white">{t('pricing.pme.price')}</span>
                  <span className="text-slate-400">{t('pricing.pme.period')}</span>
                </div>
                <div className="text-sm text-slate-400 mt-2">{t('pricing.pme.seats')}</div>
                <div className="text-xs text-orange-400 mt-1">{t('pricing.pme.pricePerSeat')}</div>
              </CardHeader>
              <CardContent className="space-y-4">
                {(t.raw('pricing.pme.features') as string[]).map((feature: string, idx: number) => (
                  <div key={idx} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <span className="text-slate-300 text-sm">{feature}</span>
                  </div>
                ))}
                <Link href="/formation" className="block pt-4">
                  <Button className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white" size="lg">
                    {t('pricing.cta')}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Enterprise */}
            <Card className="bg-[#111827] border-slate-800">
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-white text-xl">{t('pricing.enterprise.name')}</CardTitle>
                <CardDescription className="text-slate-400">
                  {t('pricing.enterprise.description')}
                </CardDescription>
                <div className="mt-6">
                  <span className="text-5xl font-bold text-white">{t('pricing.enterprise.price')}</span>
                  <span className="text-slate-400">{t('pricing.enterprise.period')}</span>
                </div>
                <div className="text-sm text-slate-400 mt-2">{t('pricing.enterprise.seats')}</div>
                <div className="text-xs text-cyan-400 mt-1">{t('pricing.enterprise.pricePerSeat')}</div>
              </CardHeader>
              <CardContent className="space-y-4">
                {(t.raw('pricing.enterprise.features') as string[]).map((feature: string, idx: number) => (
                  <div key={idx} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <span className="text-slate-300 text-sm">{feature}</span>
                  </div>
                ))}
                <Link href="/formation" className="block pt-4">
                  <Button variant="outline" className="w-full border-slate-700 text-white hover:bg-slate-800">
                    {t('pricing.cta')}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">{t('faq.title')}</h2>
          
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((num) => (
              <Card key={num} className="bg-[#111827] border-slate-800">
                <CardHeader>
                  <CardTitle className="text-white text-lg flex items-start gap-3">
                    <ChevronRight className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-1" />
                    {t(`faq.q${num}.question`)}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pl-12">
                  <p className="text-slate-400">{t(`faq.q${num}.answer`)}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-orange-600/20 to-red-600/20 border-y border-orange-500/20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-red-500/20 border border-red-500/40 rounded-full px-4 py-2 mb-6">
            <AlertTriangle className="w-4 h-4 text-red-400" />
            <span className="text-red-400 text-sm font-medium">Plus que {daysLeft} jours</span>
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">{t('cta.title')}</h2>
          <p className="text-slate-400 mb-8">{t('cta.subtitle')}</p>
          <Link href="/formation">
            <Button className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-lg px-10 py-6 rounded-xl shadow-lg shadow-orange-500/25">
              {t('cta.button')}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold">
                <span className="text-white">Formation-</span>
                <span className="text-cyan-400">IA-Act</span>
                <span className="text-white">.fr</span>
              </span>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-400">
              <a href="#" className="hover:text-white transition-colors">{t('footer.legal')}</a>
              <a href="#" className="hover:text-white transition-colors">{t('footer.privacy')}</a>
              <a href="#" className="hover:text-white transition-colors">{t('footer.terms')}</a>
              <a href="#" className="hover:text-white transition-colors">{t('footer.contact')}</a>
            </div>
            <div className="text-sm text-slate-500">
              {t('footer.copyright')}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
