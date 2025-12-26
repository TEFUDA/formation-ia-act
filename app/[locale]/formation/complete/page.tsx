'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import CertificateGenerator from '@/components/formation/CertificateGenerator';
import FormationReportPDF from '@/components/formation/FormationReportPDF';

// ============================================
// ICONS
// ============================================
const Icons = {
  ChevronLeft: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><polyline points="15 18 9 12 15 6"/></svg>,
  Home: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
};

// ============================================
// BACKGROUND
// ============================================
const NeuralBackground = () => (
  <div className="fixed inset-0 pointer-events-none overflow-hidden">
    <div className="absolute inset-0 bg-[#030014]" />
    <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-[#00FF88]/5 blur-[120px]" />
    <div className="absolute bottom-[-20%] right-[-10%] w-[800px] h-[800px] rounded-full bg-[#00F5FF]/5 blur-[150px]" />
    <div className="absolute top-[40%] left-[60%] w-[400px] h-[400px] rounded-full bg-[#8B5CF6]/3 blur-[100px]" />
    
    {/* Confetti effect */}
    {[...Array(20)].map((_, i) => (
      <motion.div
        key={i}
        initial={{ 
          y: -20, 
          x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
          opacity: 1,
          rotate: 0
        }}
        animate={{ 
          y: typeof window !== 'undefined' ? window.innerHeight + 50 : 1000,
          rotate: 360 * (Math.random() > 0.5 ? 1 : -1),
          opacity: [1, 1, 0]
        }}
        transition={{ 
          duration: 3 + Math.random() * 2,
          delay: Math.random() * 2,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute w-3 h-3"
        style={{
          backgroundColor: ['#00FF88', '#00F5FF', '#8B5CF6', '#FFB800', '#FF6B6B'][Math.floor(Math.random() * 5)],
          clipPath: Math.random() > 0.5 ? 'circle(50%)' : 'polygon(50% 0%, 0% 100%, 100% 100%)'
        }}
      />
    ))}
  </div>
);

// ============================================
// MAIN COMPONENT
// ============================================
export default function CompletePage() {
  const router = useRouter();
  const [formationStats, setFormationStats] = useState({
    averageScore: 85,
    totalHours: 8,
    modulesCompleted: 8
  });
  const [userName, setUserName] = useState('');
  const [userCompany, setUserCompany] = useState('');

  // Load stats from localStorage
  useEffect(() => {
    const savedProgress = localStorage.getItem('formationProgress');
    if (savedProgress) {
      try {
        const progress = JSON.parse(savedProgress);
        const scores = Object.values(progress.quizScores || {}) as number[];
        const avgScore = scores.length > 0 
          ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
          : 85;
        
        setFormationStats({
          averageScore: avgScore,
          totalHours: 8,
          modulesCompleted: Object.keys(progress.quizScores || {}).length || 8
        });
      } catch (e) {
        console.error('Error loading progress:', e);
      }
    }
    
    // Load user info if saved
    const savedUser = localStorage.getItem('formationUser');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        setUserName(user.name || '');
        setUserCompany(user.company || '');
      } catch (e) {
        console.error('Error loading user:', e);
      }
    }
  }, []);

  return (
    <div className="min-h-screen text-white">
      <NeuralBackground />
      
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0A0A1B]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link 
            href="/formation"
            className="flex items-center gap-2 text-white/60 hover:text-white transition-colors"
          >
            <div className="w-5 h-5"><Icons.ChevronLeft /></div>
            Retour à la formation
          </Link>
          
          <Link 
            href="/dashboard"
            className="flex items-center gap-2 text-white/60 hover:text-white transition-colors"
          >
            <div className="w-5 h-5"><Icons.Home /></div>
            Dashboard
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative pt-24 pb-12 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto"
        >
          <CertificateGenerator 
            userName={userName}
            userCompany={userCompany}
            averageScore={formationStats.averageScore}
            totalHours={formationStats.totalHours}
            modulesCompleted={formationStats.modulesCompleted}
            moduleColor="#00FF88"
            onGenerate={(data) => {
              // Save certificate data
              localStorage.setItem('certificateData', JSON.stringify(data));
              
              // Save user info for future use
              localStorage.setItem('formationUser', JSON.stringify({
                name: data.name,
                company: data.company
              }));
            }}
          />
          
          {/* Rapport PDF Personnalisé */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-8"
          >
            <FormationReportPDF 
              moduleColor="#00FF88"
              onGenerate={() => {
                console.log('Rapport PDF généré');
              }}
            />
          </motion.div>
        </motion.div>
      </main>
      
      {/* Next Steps */}
      <section className="relative max-w-3xl mx-auto px-4 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/5 rounded-2xl p-6"
        >
          <h3 className="text-xl font-bold mb-4">🚀 Prochaines étapes</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/5 rounded-xl p-4">
              <div className="text-3xl mb-2">📋</div>
              <h4 className="font-semibold mb-1">Téléchargez vos templates</h4>
              <p className="text-white/60 text-sm">
                Récupérez tous les modèles de documents dans la section ressources.
              </p>
            </div>
            <div className="bg-white/5 rounded-xl p-4">
              <div className="text-3xl mb-2">📅</div>
              <h4 className="font-semibold mb-1">Lancez votre plan 90 jours</h4>
              <p className="text-white/60 text-sm">
                Suivez le plan d'action pour une mise en conformité progressive.
              </p>
            </div>
            <div className="bg-white/5 rounded-xl p-4">
              <div className="text-3xl mb-2">🤝</div>
              <h4 className="font-semibold mb-1">Restez informé</h4>
              <p className="text-white/60 text-sm">
                Inscrivez-vous à notre newsletter pour les mises à jour AI Act.
              </p>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
