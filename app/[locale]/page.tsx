'use client'

import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
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
  Play
} from 'lucide-react'
import Link from 'next/link'

export default function LandingPage() {
  const t = useTranslations()

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-lg border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <Shield className="w-8 h-8 text-blue-500" />
              <span className="text-xl font-bold text-white">Formation IA Act</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#modules" className="text-slate-300 hover:text-white transition-colors">{t('nav.modules')}</a>
              <a href="#pricing" className="text-slate-300 hover:text-white transition-colors">{t('nav.pricing')}</a>
              <a href="#faq" className="text-slate-300 hover:text-white transition-colors">FAQ</a>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/formation">
                <Button variant="ghost" className="text-slate-300 hover:text-white">
                  {t('nav.login')}
                </Button>
              </Link>
              <Link href="/formation">
                <Button variant="gradient" size="lg">
                  {t('nav.start')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-2 mb-8">
              <span className="text-blue-400 text-sm font-medium">{t('hero.badge')}</span>
            </div>
            
            {/* Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white mb-6">
              {t('hero.title')}
              <br />
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                {t('hero.titleHighlight')}
              </span>
            </h1>
            
            {/* Subtitle */}
            <p className="text-xl text-slate-400 max-w-3xl mx-auto mb-10">
              {t('hero.subtitle')}
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <Link href="/formation">
                <Button variant="gradient" size="xl" className="w-full sm:w-auto">
                  {t('hero.cta')}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <a href="#modules">
                <Button variant="outline" size="xl" className="w-full sm:w-auto border-slate-700 text-white hover:bg-slate-800">
                  <Play className="w-5 h-5 mr-2" />
                  {t('hero.ctaSecondary')}
                </Button>
              </a>
            </div>
            
            {/* Stats */}
            <div className="flex flex-wrap items-center justify-center gap-8 text-sm">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-400" />
                <span className="text-slate-300">{t('hero.stats.companies')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-400" />
                <span className="text-slate-300">{t('hero.stats.satisfaction')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-green-400" />
                <span className="text-slate-300">{t('hero.stats.certification')}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Urgency Section - Timeline */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-4">{t('urgency.title')}</h2>
          <p className="text-slate-400 text-center mb-12 max-w-2xl mx-auto">
            L'AI Act entre progressivement en application. Ne vous laissez pas surprendre.
          </p>
          
          <div className="grid md:grid-cols-3 gap-6">
            {/* Deadline 1 */}
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

            {/* Deadline 2 */}
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
              <Clock className="w-4 h-4 text-blue-400" />
              <span className="text-slate-300 text-sm">{t('modules.duration')}</span>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((num) => (
              <Card key={num} className="bg-slate-900/80 border-slate-800 hover:border-blue-500/50 transition-all duration-300 group">
                <CardHeader>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white font-bold text-lg">
                      {num}
                    </div>
                    <div className="text-xs text-slate-400 bg-slate-800 px-2 py-1 rounded">
                      {t(`modules.module${num}.duration`)}
                    </div>
                  </div>
                  <CardTitle className="text-white group-hover:text-blue-400 transition-colors">
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
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">{t('pricing.title')}</h2>
            <p className="text-slate-400">{t('pricing.subtitle')}</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Solo */}
            <Card className="bg-slate-900/80 border-slate-800">
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
                <div className="text-xs text-blue-400 mt-1">{t('pricing.solo.pricePerSeat')}</div>
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

            {/* PME - Popular */}
            <Card className="bg-gradient-to-b from-blue-600/20 to-slate-900 border-blue-500/50 relative scale-105 shadow-xl shadow-blue-500/20">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-500 to-cyan-400 text-white text-sm font-bold px-4 py-1 rounded-full">
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
                <div className="text-xs text-blue-400 mt-1">{t('pricing.pme.pricePerSeat')}</div>
              </CardHeader>
              <CardContent className="space-y-4">
                {(t.raw('pricing.pme.features') as string[]).map((feature: string, idx: number) => (
                  <div key={idx} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <span className="text-slate-300 text-sm">{feature}</span>
                  </div>
                ))}
                <Link href="/formation" className="block pt-4">
                  <Button variant="gradient" className="w-full" size="lg">
                    {t('pricing.cta')}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Enterprise */}
            <Card className="bg-slate-900/80 border-slate-800">
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
                <div className="text-xs text-blue-400 mt-1">{t('pricing.enterprise.pricePerSeat')}</div>
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
              <Card key={num} className="bg-slate-900/80 border-slate-800">
                <CardHeader>
                  <CardTitle className="text-white text-lg flex items-start gap-3">
                    <ChevronRight className="w-5 h-5 text-blue-400 flex-shrink-0 mt-1" />
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
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600/20 to-cyan-600/20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">{t('cta.title')}</h2>
          <p className="text-slate-400 mb-8">{t('cta.subtitle')}</p>
          <Link href="/formation">
            <Button variant="gradient" size="xl">
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
            <div className="flex items-center gap-2">
              <Shield className="w-6 h-6 text-blue-500" />
              <span className="text-lg font-bold text-white">Formation IA Act</span>
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
