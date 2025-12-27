'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

// Icons
const Icons = {
  Shield: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  Check: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-full h-full"><polyline points="20 6 9 17 4 12"/></svg>,
  ArrowRight: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
  Zap: () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  Clock: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  AlertTriangle: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  Star: () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  Menu: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,
  X: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  FileText: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
  Headphones: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/></svg>,
  CheckCircle: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>,
  Quote: () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V21c0 1 0 1 1 1z"/><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/></svg>,
  Linkedin: () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>,
  Mail: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
  Calendar: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  ShieldCheck: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>,
  Award: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>,
  Users: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
};

// Calculate days until August 2, 2026
const calculateDaysUntil = () => {
  const deadline = new Date('2026-08-02');
  const today = new Date();
  const diffTime = deadline.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// ============================================
// MINI CTA COMPONENT - Réutilisable entre sections
// ============================================
const MiniCTA = ({ variant = 'default' }: { variant?: 'default' | 'fear' | 'value' }) => {
  const configs = {
    default: {
      bg: 'from-[#00FF88]/10 to-[#00F5FF]/10',
      border: 'border-[#00FF88]/30',
      text: 'Évaluez votre risque gratuitement',
      subtext: '30 secondes • Sans engagement',
      btnBg: 'from-[#00FF88] to-[#00F5FF]',
      emoji: '🎯'
    },
    fear: {
      bg: 'from-[#FF4444]/10 to-[#FF6B00]/10',
      border: 'border-[#FF4444]/30',
      text: 'Êtes-vous vraiment en conformité ?',
      subtext: 'Découvrez-le en 2 minutes',
      btnBg: 'from-[#FF6B00] to-[#FF4444]',
      emoji: '⚠️'
    },
    value: {
      bg: 'from-[#8B5CF6]/10 to-[#00F5FF]/10',
      border: 'border-[#8B5CF6]/30',
      text: 'Prêt à sécuriser votre entreprise ?',
      subtext: 'Diagnostic offert • Valeur 2 500€',
      btnBg: 'from-[#8B5CF6] to-[#00F5FF]',
      emoji: '🎁'
    }
  };
  
  const config = configs[variant];
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="my-12"
    >
      <div className={`bg-gradient-to-r ${config.bg} border ${config.border} rounded-2xl p-6 text-center`}>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <div className="text-center sm:text-left">
            <p className="text-white font-bold text-lg flex items-center justify-center sm:justify-start gap-2">
              <span>{config.emoji}</span> {config.text}
            </p>
            <p className="text-white/50 text-sm">{config.subtext}</p>
          </div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link 
              href="#audit-gratuit"
              className={`inline-flex items-center gap-2 bg-gradient-to-r ${config.btnBg} text-black font-bold px-6 py-3 rounded-xl whitespace-nowrap`}
            >
              Diagnostic GRATUIT
              <span className="text-lg">→</span>
            </Link>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

// ============================================
// TESTIMONIALS DATA - Format authentique avec initiales
// Types: 'linkedin', 'email', 'slack', 'sms', 'google'
// ============================================
type TestimonialType = {
  initials: string;
  role: string;
  sector: string;
  message: string;
  time: string;
  type: 'linkedin' | 'email' | 'slack' | 'sms' | 'google';
  rating?: number;
  verified?: boolean;
  color: string;
};

const testimonialRow1: TestimonialType[] = [
  { initials: "S.M.", role: "DPO", sector: "Banque", message: "Bonjour, je viens de terminer la formation. Franchement bluffé par la qualité des templates. J'ai pu cartographier nos 47 systèmes IA en 2 semaines. Le module sur les systèmes haut risque m'a ouvert les yeux sur notre scoring crédit.", time: "Il y a 2j", type: "linkedin", color: "#0A66C2" },
  { initials: "T.D.", role: "Dir. Juridique", sector: "ESN", message: "Formation terminée hier. Le certificat a déjà rassuré 2 de nos grands comptes qui nous demandaient des garanties AI Act. ROI immédiat.", time: "14:32", type: "slack", color: "#4A154B" },
  { initials: "M.L.", role: "RSSI", sector: "Pharma", message: "Exactement ce qu'il me fallait. J'ai formé mon équipe de 8 personnes dans la foulée avec le dashboard multi-utilisateurs. Très bien pensé.", time: "Hier", type: "email", color: "#EA4335" },
  { initials: "P.R.", role: "CEO", sector: "FinTech", message: "On fait du scoring crédit, on était complètement dans le flou sur notre niveau de risque. La formation + l'audit ont tout clarifié. Dense mais nécessaire.", time: "Il y a 3j", type: "linkedin", color: "#0A66C2" },
  { initials: "C.B.", role: "Resp. Conformité", sector: "Assurance", message: "Les 12 templates valent le prix de la formation à eux seuls. J'ai économisé au moins 3 semaines de travail. Par contre le module 3 pourrait être un peu plus court.", time: "Il y a 1 sem", type: "google", rating: 4, color: "#FBBC04" },
  { initials: "J.P.", role: "CTO", sector: "E-commerce", message: "Quiz final costaud, j'ai dû le repasser 😅 Mais au moins le certificat a de la valeur. Nos investisseurs nous ont félicités pour l'anticipation.", time: "09:15", type: "sms", color: "#34C759" },
  { initials: "N.F.", role: "DPO", sector: "Santé", message: "Secteur santé très bien couvert. J'aurais voulu plus de détails sur les dispositifs médicaux classe IIa mais globalement excellent. Mon directeur a validé le budget pour former toute l'équipe.", time: "Il y a 4j", type: "email", color: "#EA4335" },
  { initials: "M.V.", role: "Dir. Innovation", sector: "Auto", message: "La méthodologie de cartographie est au top. On a identifié 23 systèmes IA qu'on ne soupçonnait même pas. Notre maintenance prédictive était un angle mort total.", time: "Il y a 5j", type: "linkedin", color: "#0A66C2" },
  { initials: "E.S.", role: "Avocate", sector: "Cabinet IP/IT", message: "Je recommande systématiquement à mes clients. Contenu juridique solide sans être indigeste. Ça me fait gagner un temps fou en pédagogie.", time: "Lun 11:20", type: "slack", color: "#4A154B" },
  { initials: "F.G.", role: "DSI", sector: "Collectivité", message: "Format e-learning vraiment pratique pour nos agents. Quelques lenteurs sur la plateforme parfois mais le contenu est là. 47 agents formés en 3 semaines.", time: "Il y a 1 sem", type: "google", rating: 4, color: "#FBBC04" },
  { initials: "A.M.", role: "Product Manager", sector: "SaaS RH", message: "On fait du matching CV, c'est haut risque AI Act. La formation m'a enfin permis de comprendre exactement ce qu'on doit documenter. J'ai refait toute notre roadmap conformité.", time: "Mer 16:45", type: "email", color: "#EA4335" },
  { initials: "D.L.", role: "Resp. IA", sector: "Banque", message: "Module systèmes haut risque excellent. Très concret pour notre cas de scoring. J'ai pu présenter un plan de conformité au COMEX dès la semaine suivante.", time: "Il y a 6j", type: "linkedin", color: "#0A66C2" },
];

const testimonialRow2: TestimonialType[] = [
  { initials: "S.C.", role: "DRH", sector: "Industrie", message: "On utilisait l'IA pour le recrutement sans vraiment le savoir 😬 Notre ATS fait du tri automatique de CV. Eye-opening cette formation.", time: "Il y a 2j", type: "slack", color: "#4A154B" },
  { initials: "L.B.", role: "CISO", sector: "Télécom", message: "Bon complément à notre programme cybersécurité. L'AI Act va devenir aussi structurant que le RGPD, autant s'y préparer maintenant.", time: "Il y a 3j", type: "linkedin", color: "#0A66C2" },
  { initials: "I.T.", role: "Dir. Qualité", sector: "Aéro", message: "Formation sérieuse, contenu vraiment à jour avec les derniers guidelines de la Commission. Quelques répétitions entre modules mais rien de bloquant.", time: "Il y a 1 sem", type: "google", rating: 4, color: "#FBBC04" },
  { initials: "R.H.", role: "Chef projet IA", sector: "Retail", message: "Nos systèmes de prévision stock sont concernés, je ne m'y attendais pas. J'ai dû adapter toute notre roadmap produit mais au moins on est préparés.", time: "10:22", type: "email", color: "#EA4335" },
  { initials: "C.D.", role: "Consultante RGPD", sector: "Indépendante", message: "J'ai ajouté l'AI Act à mon offre grâce à cette formation. Bon point de départ, j'ai complété avec les textes officiels. 3 nouveaux clients déjà.", time: "Hier", type: "sms", color: "#34C759" },
  { initials: "O.P.", role: "DG", sector: "Logistique", message: "On pensait ne pas être concernés vu qu'on est une PME logistique. Erreur totale. Notre TMS utilise de l'IA partout. Merci de nous avoir ouvert les yeux.", time: "Il y a 4j", type: "linkedin", color: "#0A66C2" },
  { initials: "S.L.", role: "Resp. Data", sector: "Média", message: "Algos de recommandation documentés grâce aux templates. Formation vraiment pratique, pas trop théorique. Exactement ce dont on avait besoin.", time: "Mar 09:30", type: "slack", color: "#4A154B" },
  { initials: "V.M.", role: "Architecte SI", sector: "Banque", message: "J'ai cartographié 89 systèmes avec la méthodologie. Très structuré. Seul regret : aurait pu être un peu plus condensé sur certains passages.", time: "Il y a 5j", type: "google", rating: 4, color: "#FBBC04" },
  { initials: "H.R.", role: "Juriste", sector: "Énergie", message: "Enfin je comprends ce que font les équipes IT ! Le pont technique/juridique est vraiment bien fait. J'ai pu avoir des discussions constructives avec notre DSI.", time: "Il y a 2j", type: "email", color: "#EA4335" },
  { initials: "N.F.", role: "Resp. Innovation", sector: "Agro", message: "Notre contrôle qualité par vision IA est maintenant conforme. Les templates font gagner un temps fou. Je les ai partagés avec notre filiale allemande.", time: "14:55", type: "sms", color: "#34C759" },
  { initials: "A.B.", role: "DPO", sector: "E-santé", message: "Le croisement RGPD/AI Act est vraiment bien expliqué. C'était ma question principale et j'ai eu toutes les réponses. Formation très complète.", time: "Il y a 3j", type: "linkedin", color: "#0A66C2" },
  { initials: "C.G.", role: "Dir. Technique", sector: "EdTech", message: "Notre adaptive learning est concerné par l'AI Act, on ne s'en doutait pas. Maintenant on sait exactement comment documenter. Ouf.", time: "Jeu 11:00", type: "slack", color: "#4A154B" },
  { initials: "B.A.", role: "Resp. Achats", sector: "Chimie", message: "On peut maintenant exiger la conformité AI Act de nos fournisseurs. Critères clairs, templates de clauses contractuelles inclus. Très utile.", time: "Il y a 1 sem", type: "google", rating: 5, color: "#FBBC04" },
];

const testimonialRow3: TestimonialType[] = [
  { initials: "G.S.", role: "CEO", sector: "LegalTech", message: "On fait du NLP sur des contrats, on était stressés sur notre niveau de risque. La formation a tout clarifié. On est en risque limité, pas haut risque. Soulagement.", time: "Il y a 2j", type: "linkedin", color: "#0A66C2" },
  { initials: "P.V.", role: "Dir. Opérations", sector: "Call center", message: "Notre IA de routage d'appels est maintenant documentée grâce aux templates. Simple et efficace. Même notre prestataire technique était impressionné.", time: "Ven 16:20", type: "email", color: "#EA4335" },
  { initials: "M.C.", role: "Data Scientist", sector: "InsurTech", message: "Enfin une formation qui ne prend pas les techs pour des idiots 🙌 Module gouvernance super concret. J'ai pu implémenter directement.", time: "11:45", type: "slack", color: "#4A154B" },
  { initials: "V.H.", role: "Secrétaire Générale", sector: "Fédération pro", message: "Format e-learning adapté à tous les profils de notre fédération, du DG au technicien. On a formé 150 adhérents en 2 mois.", time: "Il y a 4j", type: "google", rating: 5, color: "#FBBC04" },
  { initials: "A.L.", role: "Resp. Fraude", sector: "Paiement", message: "Nos systèmes anti-fraude sont des systèmes IA au sens de l'AI Act. Évident en y réfléchissant mais on n'avait pas fait le lien. Merci !", time: "Hier", type: "sms", color: "#34C759" },
  { initials: "C.P.", role: "CDO", sector: "Média", message: "La formation a créé un vocabulaire commun entre mes équipes data, juridique et métier. Première fois qu'on parle tous le même langage sur l'IA.", time: "Il y a 3j", type: "linkedin", color: "#0A66C2" },
  { initials: "F.D.", role: "Dir. R&D", sector: "MedTech", message: "Le double process CE + AI Act est maintenant clair pour nous. Pas évident au début mais très bien expliqué. On anticipe pour notre prochain device.", time: "Mar 14:30", type: "email", color: "#EA4335" },
  { initials: "S.M.", role: "Resp. Formation", sector: "CAC40", message: "Déployé auprès de 300 collaborateurs via le dashboard admin. Suivi des progressions vraiment pratique. RH très satisfaites.", time: "Il y a 5j", type: "slack", color: "#4A154B" },
  { initials: "P.R.", role: "Avocat", sector: "Cabinet tech", message: "Contenu à jour des derniers guidelines de la Commission. Je recommande à mes confrères du barreau. Ça nous crédibilise face aux clients.", time: "Il y a 1 sem", type: "google", rating: 5, color: "#FBBC04" },
  { initials: "M.T.", role: "Product Owner", sector: "PropTech", message: "Notre outil d'estimation immo utilise du ML. Maintenant documenté selon les standards AI Act. Les notaires partenaires apprécient.", time: "08:50", type: "sms", color: "#34C759" },
  { initials: "S.J.", role: "RSSI", sector: "Banque privée", message: "Formation efficace, pas de blabla. On va à l'essentiel. En 8h j'avais tout ce qu'il me fallait. Rare de voir ça.", time: "Il y a 2j", type: "linkedin", color: "#0A66C2" },
  { initials: "A.K.", role: "Dir. Marketing", sector: "Luxe", message: "Notre personnalisation client est concernée par l'AI Act. Je ne m'y attendais vraiment pas. Bonne surprise d'avoir anticipé.", time: "Mer 10:15", type: "email", color: "#EA4335" },
  { initials: "D.B.", role: "CTO", sector: "GreenTech", message: "Notre IA d'optimisation énergétique est maintenant conforme. Les investisseurs ont adoré voir ça dans notre data room. Due diligence facilitée.", time: "Il y a 4j", type: "slack", color: "#4A154B" },
  { initials: "E.F.", role: "DPO", sector: "Télécom", message: "Après le RGPD, l'AI Act. Cette formation permet de monter en compétence rapidement sur le sujet. Indispensable pour les DPO.", time: "Il y a 6j", type: "google", rating: 5, color: "#FBBC04" },
  { initials: "Y.L.", role: "Dir. Innovation", sector: "Transport", message: "Maintenance prédictive = système IA. On ne le savait pas du tout 😅 Documentation en cours grâce aux templates. On sera prêts pour 2026.", time: "Jeu 17:00", type: "sms", color: "#34C759" },
];

// ============================================
// TESTIMONIAL CARDS - Designs PIXEL-PERFECT authentiques
// ============================================

// Google Review - EXACT comme le vrai (fond blanc, photo ronde, étoiles jaunes)
const GoogleCard = ({ t }: { t: TestimonialType }) => (
  <div className="flex-shrink-0 w-[300px] bg-white rounded-xl shadow-sm p-4">
    {/* Header avec photo et infos */}
    <div className="flex items-start gap-3">
      {/* Photo de profil ronde */}
      <div className="w-11 h-11 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-semibold text-lg flex-shrink-0 shadow-sm">
        {t.initials.split('.')[0]}
      </div>
      <div className="flex-1 min-w-0">
        {/* Nom */}
        <p className="text-[#1a1a1a] font-medium text-[15px] leading-tight">{t.initials.split('.').join(' ')}</p>
        {/* Google logo + date */}
        <div className="flex items-center gap-1.5 mt-1">
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          <span className="text-[#70757a] text-xs">{t.time}</span>
        </div>
        {/* Étoiles */}
        <div className="flex gap-0.5 mt-2">
          {[1,2,3,4,5].map(i => (
            <svg key={i} className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill={i <= (t.rating || 5) ? '#FBBC04' : '#dadce0'}>
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
            </svg>
          ))}
        </div>
      </div>
    </div>
    {/* Texte de l'avis */}
    <p className="text-[#3c4043] text-sm leading-[1.58] mt-3">{t.message}</p>
  </div>
);

// WhatsApp - EXACT avec fond beige et bulles vertes
const WhatsAppCard = ({ t }: { t: TestimonialType }) => (
  <div className="flex-shrink-0 w-[320px] rounded-xl overflow-hidden shadow-lg">
    {/* Header WhatsApp vert foncé */}
    <div className="flex items-center gap-3 px-4 py-2.5" style={{ background: '#075E54' }}>
      <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-semibold text-sm flex-shrink-0">
        {t.initials.split('.')[0]}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-white text-[15px] font-medium truncate">{t.initials.split('.').join(' ')}</p>
        <p className="text-white/70 text-xs">{t.role}</p>
      </div>
      <div className="flex items-center gap-4 text-white/90">
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/></svg>
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56-.35-.12-.74-.03-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z"/></svg>
      </div>
    </div>
    {/* Zone de messages fond beige */}
    <div className="p-3 min-h-[100px]" style={{ background: '#ECE5DD' }}>
      {/* Bulle de message verte (envoyé) */}
      <div className="flex justify-end">
        <div className="max-w-[85%] rounded-lg rounded-tr-none p-2 relative" style={{ background: '#DCF8C6' }}>
          <p className="text-[#303030] text-[14.2px] leading-[19px] pr-14">{t.message}</p>
          {/* Timestamp et checks */}
          <div className="absolute bottom-1 right-2 flex items-center gap-1">
            <span className="text-[#667781] text-[11px]">{t.time}</span>
            <svg className="w-[18px] h-[13px]" viewBox="0 0 18 13" fill="#53BDEB">
              <path d="M17.394 2.092l-.478-.372a.365.365 0 0 0-.51.063l-5.356 6.873a.32.32 0 0 1-.484.032l-.358-.325a.32.32 0 0 0-.484.032l-.378.48a.418.418 0 0 0 .036.54l1.32 1.267a.32.32 0 0 0 .484-.034l6.272-8.048a.366.366 0 0 0-.064-.508zm-4.1 0l-.478-.372a.365.365 0 0 0-.51.063L6.95 8.656a.32.32 0 0 1-.484.032L4.276 6.6a.366.366 0 0 0-.516.005l-.423.433a.364.364 0 0 0 .006.514l3.255 3.185a.32.32 0 0 0 .484-.033l6.272-8.048a.365.365 0 0 0-.06-.564z"/>
            </svg>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// LinkedIn - Style publication/commentaire fond blanc
const LinkedInCard = ({ t }: { t: TestimonialType }) => (
  <div className="flex-shrink-0 w-[340px] bg-white rounded-lg border border-[#e0e0e0] shadow-sm overflow-hidden">
    {/* Header du post */}
    <div className="p-3 flex items-start gap-2">
      {/* Photo de profil */}
      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#0A66C2] to-[#004182] flex items-center justify-center text-white font-semibold text-lg flex-shrink-0">
        {t.initials.split('.')[0]}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[#000000E6] font-semibold text-sm hover:text-[#0A66C2] hover:underline cursor-pointer">{t.initials.split('.').join(' ')}</p>
        <p className="text-[#00000099] text-xs leading-tight">{t.role} • {t.sector}</p>
        <div className="flex items-center gap-1 text-[#00000099] text-xs mt-0.5">
          <span>{t.time}</span>
          <span>•</span>
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 16 16">
            <path d="M8 1a7 7 0 107 7 7 7 0 00-7-7zM3 8a5 5 0 1110 0A5 5 0 013 8z"/>
          </svg>
        </div>
      </div>
      {/* Menu 3 points */}
      <button className="text-[#00000099] hover:bg-black/5 p-1.5 rounded-full">
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
        </svg>
      </button>
    </div>
    {/* Contenu */}
    <div className="px-3 pb-3">
      <p className="text-[#000000E6] text-sm leading-[1.43]">{t.message}</p>
    </div>
    {/* Séparateur + réactions */}
    <div className="border-t border-[#e0e0e0]">
      <div className="px-3 py-1.5 flex items-center gap-1">
        <div className="flex -space-x-1">
          <div className="w-[18px] h-[18px] rounded-full bg-[#0A66C2] flex items-center justify-center border-2 border-white">
            <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3H14z"/></svg>
          </div>
          <div className="w-[18px] h-[18px] rounded-full bg-[#DF704D] flex items-center justify-center border-2 border-white">
            <span className="text-[8px]">❤️</span>
          </div>
        </div>
        <span className="text-[#00000099] text-xs ml-1">12</span>
      </div>
    </div>
  </div>
);

// Slack - Style EXACT avec fond blanc et réactions
const SlackCard = ({ t }: { t: TestimonialType }) => (
  <div className="flex-shrink-0 w-[380px] bg-white rounded-lg border border-[#e1e1e1] shadow-sm overflow-hidden">
    {/* Channel header */}
    <div className="px-4 py-2 border-b border-[#e1e1e1] bg-white">
      <div className="flex items-center gap-1">
        <span className="text-[#1d1c1d] font-bold text-lg">#</span>
        <span className="text-[#1d1c1d] font-bold text-[15px]">conformité-ia</span>
      </div>
    </div>
    {/* Message */}
    <div className="p-4 hover:bg-[#f8f8f8] transition-colors">
      <div className="flex items-start gap-2">
        {/* Avatar carré arrondi style Slack */}
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#36C5F0] to-[#2EB67D] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
          {t.initials.split('.')[0]}
        </div>
        <div className="flex-1 min-w-0">
          {/* Nom et timestamp */}
          <div className="flex items-baseline gap-2">
            <span className="text-[#1d1c1d] font-bold text-[15px]">{t.initials.split('.').join(' ')}</span>
            <span className="text-[#616061] text-xs">{t.time}</span>
          </div>
          {/* Message */}
          <p className="text-[#1d1c1d] text-[15px] leading-[1.46] mt-0.5">{t.message}</p>
          {/* Réactions */}
          <div className="flex items-center gap-1.5 mt-2">
            <div className="flex items-center gap-1 px-2 py-0.5 bg-[#f0f0f0] hover:bg-[#e8e8e8] rounded-full cursor-pointer border border-transparent hover:border-[#1264a3]">
              <span className="text-[13px]">👍</span>
              <span className="text-[#1d1c1d] text-xs font-medium">3</span>
            </div>
            <div className="flex items-center gap-1 px-2 py-0.5 bg-[#f0f0f0] hover:bg-[#e8e8e8] rounded-full cursor-pointer">
              <span className="text-[13px]">🎉</span>
              <span className="text-[#1d1c1d] text-xs font-medium">1</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Email Gmail - Style inbox
const EmailCard = ({ t }: { t: TestimonialType }) => (
  <div className="flex-shrink-0 w-[360px] bg-white rounded-lg border border-[#e0e0e0] shadow-sm overflow-hidden">
    {/* Header email */}
    <div className="px-4 py-3 flex items-start gap-3 border-b border-[#e0e0e0]">
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#EA4335] to-[#FBBC04] flex items-center justify-center text-white font-semibold text-base flex-shrink-0">
        {t.initials.split('.')[0]}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <span className="text-[#202124] font-medium text-sm">{t.initials.split('.').join(' ')}</span>
          <span className="text-[#5f6368] text-xs">{t.time}</span>
        </div>
        <p className="text-[#5f6368] text-xs">à moi</p>
      </div>
    </div>
    {/* Objet */}
    <div className="px-4 py-2 border-b border-[#f1f3f4]">
      <p className="text-[#202124] font-medium text-sm">Re: Formation AI Act - Retour</p>
    </div>
    {/* Corps */}
    <div className="px-4 py-3">
      <p className="text-[#202124] text-sm leading-[1.58]">{t.message}</p>
      <div className="mt-4 pt-3 border-t border-[#f1f3f4]">
        <p className="text-[#5f6368] text-xs">—</p>
        <p className="text-[#5f6368] text-xs">{t.initials.split('.').join(' ')}</p>
        <p className="text-[#5f6368] text-xs">{t.role}, {t.sector}</p>
      </div>
    </div>
  </div>
);

// Main Testimonial Card Selector
const TestimonialCard = ({ testimonial }: { testimonial: TestimonialType }) => {
  switch (testimonial.type) {
    case 'linkedin': return <LinkedInCard t={testimonial} />;
    case 'email': return <EmailCard t={testimonial} />;
    case 'slack': return <SlackCard t={testimonial} />;
    case 'sms': return <WhatsAppCard t={testimonial} />;
    case 'google': return <GoogleCard t={testimonial} />;
    default: return <GoogleCard t={testimonial} />;
  }
};

// Neural Background
const NeuralBackground = () => {
  const [particles, setParticles] = useState<{x: number, y: number, size: number, speed: number, delay: number}[]>([]);
  
  useEffect(() => {
    setParticles(Array.from({ length: 50 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      speed: Math.random() * 20 + 15,
      delay: Math.random() * 5,
    })));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      <div className="absolute inset-0 bg-[#0A0A1B]" />
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-[#00F5FF]/8 blur-[120px] rounded-full" />
      <div className="absolute top-[20%] right-[-15%] w-[500px] h-[500px] bg-[#8B5CF6]/6 blur-[100px] rounded-full" />
      <div className="absolute bottom-[-10%] left-[30%] w-[700px] h-[700px] bg-[#FF6B00]/5 blur-[140px] rounded-full" />
      <div 
        className="absolute inset-0 opacity-[0.03]" 
        style={{ 
          backgroundImage: 'linear-gradient(rgba(0, 245, 255, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 245, 255, 0.5) 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }} 
      />
      {particles.map((p, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{ 
            width: p.size, 
            height: p.size, 
            left: `${p.x}%`, 
            top: `${p.y}%`,
            background: i % 3 === 0 ? '#00F5FF' : i % 3 === 1 ? '#00FF88' : '#8B5CF6',
          }}
          animate={{ y: [0, -30, 0], opacity: [0.2, 0.6, 0.2] }}
          transition={{ duration: p.speed, repeat: Infinity, ease: "easeInOut", delay: p.delay }}
        />
      ))}
    </div>
  );
};

// HoloCard
const HoloCard = ({ children, glow = '#00F5FF', className = '' }: { children: React.ReactNode, glow?: string, className?: string }) => (
  <motion.div 
    className={`relative group ${className}`}
    whileHover={{ scale: 1.01, y: -2 }}
    transition={{ type: "spring", stiffness: 400, damping: 25 }}
  >
    <div 
      className="absolute -inset-[1px] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"
      style={{ background: `linear-gradient(135deg, ${glow}40, transparent 50%, ${glow}40)` }}
    />
    <div 
      className="absolute -inset-[1px] rounded-2xl opacity-50 group-hover:opacity-80 transition-opacity"
      style={{ background: `linear-gradient(135deg, ${glow}30, transparent 40%, transparent 60%, ${glow}30)` }}
    />
    <div className="relative bg-[#0A0A1B]/80 backdrop-blur-xl rounded-2xl border border-white/5 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent" />
      <div className="relative">{children}</div>
    </div>
  </motion.div>
);

// ============================================
// MULTI-STEP LEAD FORM - Pied dans la porte
// ============================================
const MultiStepLeadForm = () => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [formData, setFormData] = useState({
    usageIA: '',
    tailleEntreprise: '',
    role: '',
    prenom: '',
    email: '',
    telephone: '',
    entreprise: '',
    ca: ''
  });

  const totalSteps = 5;
  const progress = (step / totalSteps) * 100;

  const handleOptionClick = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    // Auto-advance après sélection
    setTimeout(() => setStep(step + 1), 300);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // Formspree configuré ✓
    try {
      await fetch('https://formspree.io/f/mnjqdjay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          _subject: '🚨 Nouveau lead Audit AI Act (Multi-step)',
          source: 'landing-page-multistep'
        })
      });
    } catch (e) {
      console.error(e);
    }
    
    setIsSubmitting(false);
    setIsComplete(true);
  };

  const canProceedStep4 = formData.prenom.length >= 2 && formData.email.includes('@');
  const canProceedStep5 = formData.telephone.length >= 10 && formData.entreprise.length >= 2;

  // Options pour chaque étape
  const usageIAOptions = [
    { value: 'oui-beaucoup', label: 'Oui, plusieurs', icon: '🤖', desc: 'ChatGPT, scoring, automatisation...' },
    { value: 'oui-peu', label: 'Oui, quelques-uns', icon: '🔧', desc: 'Quelques outils ponctuels' },
    { value: 'je-ne-sais-pas', label: 'Je ne suis pas sûr', icon: '🤔', desc: "C'est justement ce qu'on va vérifier" },
    { value: 'non', label: 'Non, aucun', icon: '❌', desc: 'Êtes-vous vraiment sûr ?' }
  ];

  const tailleOptions = [
    { value: '1-10', label: '1-10', icon: '👤', desc: 'Startup / TPE' },
    { value: '11-50', label: '11-50', icon: '👥', desc: 'PME' },
    { value: '51-200', label: '51-200', icon: '🏢', desc: 'ETI' },
    { value: '200+', label: '200+', icon: '🏛️', desc: 'Grande entreprise' }
  ];

  const roleOptions = [
    { value: 'Direction', label: 'Direction', icon: '👔', desc: 'CEO, DG, Président...' },
    { value: 'Tech/IT', label: 'Tech / IT', icon: '💻', desc: 'DSI, CTO, Dev...' },
    { value: 'Juridique/DPO', label: 'Juridique / DPO', icon: '⚖️', desc: 'Compliance, Legal...' },
    { value: 'RH', label: 'RH', icon: '🧑‍💼', desc: 'DRH, Recrutement...' },
    { value: 'Autre', label: 'Autre', icon: '📊', desc: 'DAF, Marketing...' }
  ];

  if (isComplete) {
    return (
      <HoloCard glow="#00FF88">
        <div className="p-8 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-20 h-20 bg-[#00FF88]/20 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <span className="text-4xl">✅</span>
          </motion.div>
          <h3 className="text-2xl font-bold text-[#00FF88] mb-2">Parfait, {formData.prenom} !</h3>
          <p className="text-white/70 mb-6">
            Votre demande de diagnostic est enregistrée.<br />
            Un expert vous contacte sous <span className="text-[#FFB800] font-bold">24h</span>.
          </p>
          <div className="bg-white/5 rounded-xl p-4 text-left">
            <p className="text-white/60 text-sm mb-2">Récapitulatif :</p>
            <ul className="text-sm space-y-1">
              <li className="text-white/80">📧 {formData.email}</li>
              <li className="text-white/80">📱 {formData.telephone}</li>
              <li className="text-white/80">🏢 {formData.entreprise}</li>
            </ul>
          </div>
          <p className="text-white/40 text-xs mt-6">
            💡 En attendant, vérifiez vos spams si vous ne recevez pas notre confirmation.
          </p>
        </div>
      </HoloCard>
    );
  }

  return (
    <HoloCard glow="#00F5FF">
      <div className="p-6 sm:p-8">
        {/* Header avec urgence */}
        <div className="text-center mb-6">
          <motion.div 
            className="inline-flex items-center gap-2 bg-[#FF4444]/20 text-[#FF4444] px-4 py-2 rounded-full text-sm font-bold mb-4"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span className="w-2 h-2 bg-[#FF4444] rounded-full animate-pulse" />
            Plus que 7 créneaux cette semaine
          </motion.div>
          <h3 className="text-xl sm:text-2xl font-bold">Votre Diagnostic AI Act</h3>
          <p className="text-white/60 text-sm mt-1">30 secondes • 100% gratuit</p>
        </div>

        {/* Barre de progression */}
        <div className="mb-6">
          <div className="flex justify-between text-xs text-white/40 mb-2">
            <span>Étape {step}/{totalSteps}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-gradient-to-r from-[#00F5FF] to-[#00FF88] rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          {/* ÉTAPE 1: Usage IA */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <h4 className="text-lg font-semibold text-center mb-4">
                Utilisez-vous des <span className="text-[#00F5FF]">outils IA</span> ?
              </h4>
              <div className="grid grid-cols-2 gap-3">
                {usageIAOptions.map((option) => (
                  <motion.button
                    key={option.value}
                    onClick={() => handleOptionClick('usageIA', option.value)}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      formData.usageIA === option.value 
                        ? 'border-[#00F5FF] bg-[#00F5FF]/10' 
                        : 'border-white/10 bg-white/5 hover:border-white/30'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="text-2xl block mb-1">{option.icon}</span>
                    <span className="font-semibold text-white text-sm block">{option.label}</span>
                    <span className="text-white/50 text-xs">{option.desc}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* ÉTAPE 2: Taille entreprise */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <h4 className="text-lg font-semibold text-center mb-4">
                <span className="text-[#00FF88]">Combien</span> de salariés ?
              </h4>
              <div className="grid grid-cols-2 gap-3">
                {tailleOptions.map((option) => (
                  <motion.button
                    key={option.value}
                    onClick={() => handleOptionClick('tailleEntreprise', option.value)}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      formData.tailleEntreprise === option.value 
                        ? 'border-[#00FF88] bg-[#00FF88]/10' 
                        : 'border-white/10 bg-white/5 hover:border-white/30'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="text-2xl block mb-1">{option.icon}</span>
                    <span className="font-semibold text-white text-sm block">{option.label}</span>
                    <span className="text-white/50 text-xs">{option.desc}</span>
                  </motion.button>
                ))}
              </div>
              <button 
                onClick={() => setStep(step - 1)}
                className="text-white/40 text-sm hover:text-white/60 transition-colors mt-2"
              >
                ← Retour
              </button>
            </motion.div>
          )}

          {/* ÉTAPE 3: Rôle */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <h4 className="text-lg font-semibold text-center mb-4">
                Quel est votre <span className="text-[#FFB800]">rôle</span> ?
              </h4>
              <div className="grid grid-cols-2 gap-3">
                {roleOptions.map((option) => (
                  <motion.button
                    key={option.value}
                    onClick={() => handleOptionClick('role', option.value)}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      formData.role === option.value 
                        ? 'border-[#FFB800] bg-[#FFB800]/10' 
                        : 'border-white/10 bg-white/5 hover:border-white/30'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="text-2xl block mb-1">{option.icon}</span>
                    <span className="font-semibold text-white text-sm block">{option.label}</span>
                    <span className="text-white/50 text-xs">{option.desc}</span>
                  </motion.button>
                ))}
              </div>
              <button 
                onClick={() => setStep(step - 1)}
                className="text-white/40 text-sm hover:text-white/60 transition-colors mt-2"
              >
                ← Retour
              </button>
            </motion.div>
          )}

          {/* ÉTAPE 4: Contact basique */}
          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div className="text-center mb-4">
                <span className="text-3xl block mb-2">📧</span>
                <h4 className="text-lg font-semibold">
                  Où envoyer votre <span className="text-[#00FF88]">score de risque</span> ?
                </h4>
              </div>
              
              <div>
                <label className="text-white/60 text-sm mb-1 block">Prénom</label>
                <input 
                  type="text"
                  value={formData.prenom}
                  onChange={(e) => handleInputChange('prenom', e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-[#00F5FF] transition-colors"
                  placeholder="Jean"
                  autoFocus
                />
              </div>

              <div>
                <label className="text-white/60 text-sm mb-1 block">Email professionnel</label>
                <input 
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-[#00F5FF] transition-colors"
                  placeholder="jean@entreprise.fr"
                />
              </div>

              <motion.button 
                onClick={() => canProceedStep4 && setStep(5)}
                disabled={!canProceedStep4}
                className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
                  canProceedStep4 
                    ? 'bg-gradient-to-r from-[#00FF88] to-[#00F5FF] text-black' 
                    : 'bg-white/10 text-white/30 cursor-not-allowed'
                }`}
                whileHover={canProceedStep4 ? { scale: 1.02 } : {}}
                whileTap={canProceedStep4 ? { scale: 0.98 } : {}}
              >
                Continuer →
              </motion.button>

              <button 
                onClick={() => setStep(step - 1)}
                className="text-white/40 text-sm hover:text-white/60 transition-colors w-full text-center"
              >
                ← Retour
              </button>
            </motion.div>
          )}

          {/* ÉTAPE 5: Finalisation */}
          {step === 5 && (
            <motion.div
              key="step5"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div className="text-center mb-4">
                <span className="text-3xl block mb-2">📞</span>
                <h4 className="text-lg font-semibold">
                  Dernière étape, <span className="text-[#00FF88]">{formData.prenom}</span> !
                </h4>
                <p className="text-white/60 text-sm">Pour vous rappeler et planifier votre diagnostic</p>
              </div>
              
              <div>
                <label className="text-white/60 text-sm mb-1 block">Téléphone</label>
                <input 
                  type="tel"
                  value={formData.telephone}
                  onChange={(e) => handleInputChange('telephone', e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-[#00F5FF] transition-colors"
                  placeholder="06 12 34 56 78"
                  autoFocus
                />
              </div>

              <div>
                <label className="text-white/60 text-sm mb-1 block">Entreprise</label>
                <input 
                  type="text"
                  value={formData.entreprise}
                  onChange={(e) => handleInputChange('entreprise', e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-[#00F5FF] transition-colors"
                  placeholder="Nom de votre entreprise"
                />
              </div>

              <div>
                <label className="text-white/60 text-sm mb-1 block">Chiffre d&apos;affaires annuel</label>
                <select 
                  value={formData.ca}
                  onChange={(e) => handleInputChange('ca', e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#00F5FF] transition-colors"
                >
                  <option value="" className="bg-[#0A0A1B]">Sélectionnez...</option>
                  <option value="<1M" className="bg-[#0A0A1B]">Moins de 1M€</option>
                  <option value="1-5M" className="bg-[#0A0A1B]">1M€ - 5M€</option>
                  <option value="5-20M" className="bg-[#0A0A1B]">5M€ - 20M€</option>
                  <option value="20-50M" className="bg-[#0A0A1B]">20M€ - 50M€</option>
                  <option value=">50M" className="bg-[#0A0A1B]">Plus de 50M€</option>
                </select>
              </div>

              <motion.button 
                onClick={handleSubmit}
                disabled={!canProceedStep5 || isSubmitting}
                className={`w-full py-4 rounded-xl font-black text-lg transition-all relative overflow-hidden ${
                  canProceedStep5 && !isSubmitting
                    ? 'bg-gradient-to-r from-[#00FF88] to-[#00F5FF] text-black' 
                    : 'bg-white/10 text-white/30 cursor-not-allowed'
                }`}
                whileHover={canProceedStep5 ? { scale: 1.02 } : {}}
                whileTap={canProceedStep5 ? { scale: 0.98 } : {}}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <motion.span 
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      ⏳
                    </motion.span>
                    Envoi en cours...
                  </span>
                ) : (
                  '🎯 OBTENIR MON DIAGNOSTIC GRATUIT'
                )}
              </motion.button>

              <button 
                onClick={() => setStep(step - 1)}
                className="text-white/40 text-sm hover:text-white/60 transition-colors w-full text-center"
              >
                ← Retour
              </button>

              <p className="text-white/40 text-xs text-center">
                🔒 Vos données restent confidentielles. Zéro spam.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Fear push - visible sur toutes les étapes */}
        <div className="mt-6 p-3 bg-[#FF4444]/10 border border-[#FF4444]/30 rounded-xl">
          <p className="text-[#FF4444] font-bold text-center text-xs">
            ⚠️ Amende AI Act = 7% de votre CA
          </p>
          <p className="text-white/50 text-xs text-center mt-1">
            Pour une entreprise à 50M€ → <span className="text-[#FFB800] font-bold">3,5 millions €</span>
          </p>
        </div>
      </div>
    </HoloCard>
  );
};

// ============================================
// TEASER SECTION - Interactive Preview
// ============================================
const miniAuditQuestions = [
  { q: "Votre entreprise utilise-t-elle des algorithmes de prise de décision automatisée ?", tips: "Ex: scoring client, tri de CV, chatbot, recommandations..." },
  { q: "Vos systèmes IA sont-ils documentés (registre, politique, processus) ?", tips: "Documentation technique, registre des traitements IA..." },
  { q: "Avez-vous identifié le niveau de risque de vos systèmes selon l'AI Act ?", tips: "Risque minimal, limité, élevé ou inacceptable" },
  { q: "Vos équipes sont-elles formées aux obligations de l'AI Act ?", tips: "Formation Article 4, sensibilisation, certification..." },
  { q: "Avez-vous mis en place une supervision humaine de vos systèmes IA ?", tips: "Contrôle humain, processus d'escalade, audit..." },
];

const templatePreviews = [
  { name: "Registre des systèmes IA", icon: "📋", type: "Excel", pages: "12 onglets", blur: true },
  { name: "Politique IA entreprise", icon: "📜", type: "Word", pages: "18 pages", blur: true },
  { name: "FRIA - Évaluation d'impact", icon: "⚖️", type: "Word", pages: "24 pages", blur: true },
];

const TeaserSection = () => {
  const [activeTab, setActiveTab] = useState<'audit' | 'video' | 'templates'>('audit');
  const [auditStep, setAuditStep] = useState(0);
  const [auditAnswers, setAuditAnswers] = useState<(boolean | null)[]>([null, null, null, null, null]);
  const [auditComplete, setAuditComplete] = useState(false);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);

  const handleAuditAnswer = (answer: boolean) => {
    const newAnswers = [...auditAnswers];
    newAnswers[auditStep] = answer;
    setAuditAnswers(newAnswers);
    
    if (auditStep < miniAuditQuestions.length - 1) {
      setTimeout(() => setAuditStep(auditStep + 1), 300);
    } else {
      setTimeout(() => setAuditComplete(true), 300);
    }
  };

  const auditScore = auditAnswers.filter(a => a === true).length;
  const auditRisk = auditScore <= 1 ? 'Critique' : auditScore <= 2 ? 'Élevé' : auditScore <= 3 ? 'Modéré' : 'Faible';
  const auditColor = auditScore <= 1 ? '#FF4444' : auditScore <= 2 ? '#FF6B00' : auditScore <= 3 ? '#FFB800' : '#00FF88';

  // Simulate video progress
  useEffect(() => {
    if (videoPlaying && videoProgress < 100) {
      const timer = setTimeout(() => setVideoProgress(p => Math.min(p + 2, 100)), 200);
      return () => clearTimeout(timer);
    }
    if (videoProgress >= 100) {
      setVideoPlaying(false);
    }
  }, [videoPlaying, videoProgress]);

  return (
    <section className="relative z-10 py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <span className="inline-flex items-center gap-2 bg-gradient-to-r from-[#00FF88]/20 to-[#00F5FF]/20 border border-[#00FF88]/30 rounded-full px-4 py-2 text-sm font-medium text-[#00FF88] mb-4">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00FF88] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00FF88]"></span>
            </span>
            Accès gratuit
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Testez <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00FF88] to-[#00F5FF]">avant d&apos;acheter</span>
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto">
            Découvrez la qualité de notre formation avec un mini-audit gratuit, un extrait vidéo et un aperçu des templates
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="flex justify-center gap-2 mb-8">
          {[
            { id: 'audit', label: '🎯 Mini-Audit', desc: '5 questions' },
            { id: 'video', label: '🎬 Extrait vidéo', desc: 'Module 1' },
            { id: 'templates', label: '📄 Templates', desc: 'Aperçu' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`px-4 sm:px-6 py-3 rounded-xl font-medium transition-all ${
                activeTab === tab.id 
                  ? 'bg-gradient-to-r from-[#00FF88] to-[#00F5FF] text-black' 
                  : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
              }`}
            >
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
              <span className="text-xs block opacity-70">{tab.desc}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {/* MINI AUDIT TAB */}
          {activeTab === 'audit' && (
            <motion.div
              key="audit"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-[#00FF88]/20 to-[#00F5FF]/20 rounded-3xl blur-xl" />
                <div className="relative bg-[#0A0A1B]/90 backdrop-blur-xl rounded-2xl border border-white/10 p-6 sm:p-8">
                  
                  {!auditComplete ? (
                    <>
                      {/* Progress */}
                      <div className="flex items-center justify-between mb-6">
                        <span className="text-white/60 text-sm">Question {auditStep + 1} / {miniAuditQuestions.length}</span>
                        <div className="flex gap-1">
                          {miniAuditQuestions.map((_, i) => (
                            <div 
                              key={i}
                              className={`w-8 h-1.5 rounded-full transition-all ${
                                i < auditStep ? 'bg-[#00FF88]' : i === auditStep ? 'bg-[#00F5FF]' : 'bg-white/10'
                              }`}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Question */}
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={auditStep}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          className="mb-8"
                        >
                          <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">
                            {miniAuditQuestions[auditStep].q}
                          </h3>
                          <p className="text-white/40 text-sm">
                            💡 {miniAuditQuestions[auditStep].tips}
                          </p>
                        </motion.div>
                      </AnimatePresence>

                      {/* Answers */}
                      <div className="flex flex-col sm:flex-row gap-4">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleAuditAnswer(true)}
                          className="flex-1 py-4 px-6 rounded-xl bg-[#00FF88]/10 border border-[#00FF88]/30 text-[#00FF88] font-bold hover:bg-[#00FF88]/20 transition-all"
                        >
                          ✅ Oui
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleAuditAnswer(false)}
                          className="flex-1 py-4 px-6 rounded-xl bg-[#FF4444]/10 border border-[#FF4444]/30 text-[#FF4444] font-bold hover:bg-[#FF4444]/20 transition-all"
                        >
                          ❌ Non
                        </motion.button>
                      </div>
                    </>
                  ) : (
                    /* Results */
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center"
                    >
                      <div 
                        className="w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-6 border-4"
                        style={{ borderColor: auditColor, background: `${auditColor}15` }}
                      >
                        <div className="text-center">
                          <div className="text-4xl font-black" style={{ color: auditColor }}>{auditScore}/5</div>
                        </div>
                      </div>
                      
                      <h3 className="text-2xl font-bold mb-2">
                        Niveau de préparation : <span style={{ color: auditColor }}>{auditRisk}</span>
                      </h3>
                      <p className="text-white/60 mb-6 max-w-lg mx-auto">
                        {auditScore <= 2 
                          ? "⚠️ Votre organisation présente des lacunes importantes. L'audit complet identifiera les 150+ points à corriger avant août 2026."
                          : auditScore <= 3 
                            ? "⚡ Vous avez des bases mais des zones grises subsistent. L'audit complet révélera vos angles morts."
                            : "✅ Bonne base ! L'audit complet validera votre conformité et identifiera les derniers ajustements."
                        }
                      </p>

                      <div className="bg-white/5 rounded-xl p-4 mb-6 border border-white/10">
                        <p className="text-white/40 text-sm mb-2">🔒 Dans l&apos;audit complet :</p>
                        <div className="grid grid-cols-3 gap-4 text-center">
                          <div>
                            <div className="text-2xl font-bold text-[#00F5FF]">150+</div>
                            <div className="text-xs text-white/40">Questions</div>
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-[#8B5CF6]">6</div>
                            <div className="text-xs text-white/40">Catégories</div>
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-[#00FF88]">PDF</div>
                            <div className="text-xs text-white/40">Rapport détaillé</div>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Link 
                          href="#audit-gratuit"
                          className="px-6 py-3 bg-gradient-to-r from-[#00FF88] to-[#00F5FF] text-black font-bold rounded-xl"
                        >
                          Débloquer l&apos;audit complet →
                        </Link>
                        <button 
                          onClick={() => { setAuditComplete(false); setAuditStep(0); setAuditAnswers([null,null,null,null,null]); }}
                          className="px-6 py-3 bg-white/5 text-white/60 font-medium rounded-xl hover:bg-white/10"
                        >
                          Recommencer
                        </button>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* VIDEO TAB */}
          {activeTab === 'video' && (
            <motion.div
              key="video"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-[#8B5CF6]/20 to-[#00F5FF]/20 rounded-3xl blur-xl" />
                <div className="relative bg-[#0A0A1B]/90 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
                  
                  {/* Video Player Mockup */}
                  <div className="aspect-video bg-gradient-to-br from-[#1a1a3e] to-[#0a0a1b] relative">
                    {/* Fake video content */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      {!videoPlaying && videoProgress === 0 ? (
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setVideoPlaying(true)}
                          className="w-20 h-20 rounded-full bg-gradient-to-r from-[#00FF88] to-[#00F5FF] flex items-center justify-center shadow-lg shadow-[#00FF88]/30"
                        >
                          <svg className="w-8 h-8 text-black ml-1" viewBox="0 0 24 24" fill="currentColor">
                            <polygon points="5 3 19 12 5 21 5 3"/>
                          </svg>
                        </motion.button>
                      ) : videoProgress >= 100 ? (
                        <div className="text-center">
                          <div className="text-6xl mb-4">🔒</div>
                          <p className="text-white text-xl font-bold mb-2">Fin de l&apos;extrait gratuit</p>
                          <p className="text-white/60 mb-4">Accédez aux 6 modules complets (8h de formation)</p>
                          <Link 
                            href="#audit-gratuit"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#00FF88] to-[#00F5FF] text-black font-bold rounded-xl"
                          >
                            Débloquer la formation complète →
                          </Link>
                        </div>
                      ) : (
                        <div className="w-full h-full relative">
                          {/* Simulated slide content */}
                          <div className="absolute inset-0 p-8 sm:p-12 flex flex-col">
                            <div className="flex items-center gap-3 mb-6">
                              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#00F5FF] to-[#0066FF] flex items-center justify-center">
                                <div className="w-5 h-5 text-white"><Icons.Shield /></div>
                              </div>
                              <div>
                                <p className="text-[#00F5FF] text-xs font-medium">MODULE 1</p>
                                <p className="text-white font-bold">Comprendre l&apos;AI Act</p>
                              </div>
                            </div>
                            
                            <motion.div 
                              className="flex-grow flex items-center"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                            >
                              {videoProgress < 30 && (
                                <div className="w-full">
                                  <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">Qu&apos;est-ce que l&apos;AI Act ?</h3>
                                  <ul className="space-y-3 text-white/80">
                                    <motion.li initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="flex items-center gap-2">
                                      <span className="text-[#00FF88]">✓</span> Premier règlement mondial sur l&apos;IA
                                    </motion.li>
                                    <motion.li initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }} className="flex items-center gap-2">
                                      <span className="text-[#00FF88]">✓</span> Approche basée sur les risques
                                    </motion.li>
                                    <motion.li initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }} className="flex items-center gap-2">
                                      <span className="text-[#00FF88]">✓</span> Amendes jusqu&apos;à 35M€ ou 7% du CA
                                    </motion.li>
                                  </ul>
                                </div>
                              )}
                              {videoProgress >= 30 && videoProgress < 60 && (
                                <div className="w-full">
                                  <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">Les 4 niveaux de risque</h3>
                                  <div className="grid grid-cols-2 gap-3">
                                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-[#FF4444]/20 rounded-lg p-3 border border-[#FF4444]/30">
                                      <p className="text-[#FF4444] font-bold">🚫 Inacceptable</p>
                                      <p className="text-white/60 text-xs">Interdit</p>
                                    </motion.div>
                                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-[#FF6B00]/20 rounded-lg p-3 border border-[#FF6B00]/30">
                                      <p className="text-[#FF6B00] font-bold">⚠️ Élevé</p>
                                      <p className="text-white/60 text-xs">Conformité stricte</p>
                                    </motion.div>
                                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-[#FFB800]/20 rounded-lg p-3 border border-[#FFB800]/30">
                                      <p className="text-[#FFB800] font-bold">📋 Limité</p>
                                      <p className="text-white/60 text-xs">Transparence</p>
                                    </motion.div>
                                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-[#00FF88]/20 rounded-lg p-3 border border-[#00FF88]/30">
                                      <p className="text-[#00FF88] font-bold">✅ Minimal</p>
                                      <p className="text-white/60 text-xs">Libre</p>
                                    </motion.div>
                                  </div>
                                </div>
                              )}
                              {videoProgress >= 60 && (
                                <div className="w-full">
                                  <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">Calendrier de mise en conformité</h3>
                                  <div className="space-y-3">
                                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-3">
                                      <span className="text-[#00FF88] font-mono font-bold">Fév 2025</span>
                                      <span className="text-white/60">→ Interdictions</span>
                                    </motion.div>
                                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="flex items-center gap-3">
                                      <span className="text-[#FFB800] font-mono font-bold">Août 2025</span>
                                      <span className="text-white/60">→ Modèles GPAI</span>
                                    </motion.div>
                                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="flex items-center gap-3 bg-white/5 rounded-lg p-2 border border-[#FF4444]/30">
                                      <span className="text-[#FF4444] font-mono font-bold">Août 2026</span>
                                      <span className="text-white">→ Application complète ⚠️</span>
                                    </motion.div>
                                  </div>
                                </div>
                              )}
                            </motion.div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Progress bar */}
                    {(videoPlaying || videoProgress > 0) && videoProgress < 100 && (
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
                        <motion.div 
                          className="h-full bg-gradient-to-r from-[#00FF88] to-[#00F5FF]"
                          style={{ width: `${videoProgress}%` }}
                        />
                      </div>
                    )}

                    {/* Time indicator */}
                    {videoProgress > 0 && videoProgress < 100 && (
                      <div className="absolute bottom-4 right-4 bg-black/50 px-2 py-1 rounded text-xs text-white/80">
                        {Math.floor(videoProgress * 1.8 / 60)}:{String(Math.floor((videoProgress * 1.8) % 60)).padStart(2, '0')} / 3:00
                      </div>
                    )}
                  </div>

                  {/* Video info */}
                  <div className="p-6 border-t border-white/10">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white font-bold">Module 1 : Comprendre l&apos;AI Act (extrait)</p>
                        <p className="text-white/40 text-sm">3 min sur 45 min • Accès complet avec la formation</p>
                      </div>
                      <div className="text-right">
                        <span className="text-[#00FF88] text-sm font-medium">Gratuit</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* TEMPLATES TAB */}
          {activeTab === 'templates' && (
            <motion.div
              key="templates"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="grid md:grid-cols-3 gap-6">
                {templatePreviews.map((template, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <div className="relative group">
                      <div className="absolute -inset-1 bg-gradient-to-r from-[#8B5CF6]/20 to-[#00F5FF]/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="relative bg-[#0A0A1B]/90 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
                        
                        {/* Preview area with blur */}
                        <div className="aspect-[4/3] bg-gradient-to-br from-[#1a1a3e] to-[#0a0a1b] relative overflow-hidden">
                          {/* Simulated document content - blurred */}
                          <div className="absolute inset-0 p-4 filter blur-[6px] select-none">
                            <div className="h-3 w-3/4 bg-white/20 rounded mb-3" />
                            <div className="h-2 w-full bg-white/10 rounded mb-2" />
                            <div className="h-2 w-5/6 bg-white/10 rounded mb-2" />
                            <div className="h-2 w-4/5 bg-white/10 rounded mb-4" />
                            <div className="grid grid-cols-3 gap-2 mb-4">
                              <div className="h-8 bg-white/5 rounded" />
                              <div className="h-8 bg-white/5 rounded" />
                              <div className="h-8 bg-white/5 rounded" />
                            </div>
                            <div className="h-2 w-full bg-white/10 rounded mb-2" />
                            <div className="h-2 w-3/4 bg-white/10 rounded mb-2" />
                            <div className="h-2 w-5/6 bg-white/10 rounded" />
                          </div>
                          
                          {/* Lock overlay */}
                          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                            <div className="text-center">
                              <motion.div 
                                className="text-5xl mb-2"
                                animate={{ scale: [1, 1.1, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                              >
                                🔒
                              </motion.div>
                              <p className="text-white/80 text-sm font-medium">Aperçu</p>
                            </div>
                          </div>

                          {/* File type badge */}
                          <div className="absolute top-3 right-3 bg-white/10 backdrop-blur rounded px-2 py-1 text-xs text-white/60">
                            {template.type}
                          </div>
                        </div>

                        {/* Info */}
                        <div className="p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-2xl">{template.icon}</span>
                            <h3 className="text-white font-bold text-sm">{template.name}</h3>
                          </div>
                          <p className="text-white/40 text-xs mb-3">{template.pages} • Prêt à l&apos;emploi</p>
                          <div className="flex items-center justify-between">
                            <span className="text-[#FF6B00] text-xs font-medium">Inclus dans la formation</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* CTA */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-8 text-center"
              >
                <div className="bg-gradient-to-r from-[#8B5CF6]/10 to-[#00F5FF]/10 rounded-2xl border border-white/10 p-6 inline-block">
                  <p className="text-white/60 mb-4">
                    <span className="text-3xl mr-2">📦</span>
                    <span className="text-white font-bold">12 templates</span> professionnels inclus dans la formation
                  </p>
                  <Link 
                    href="#audit-gratuit"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#8B5CF6] to-[#00F5FF] text-white font-bold rounded-xl"
                  >
                    Voir tous les templates →
                  </Link>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

// ============================================
// ROI CALCULATOR - Simulateur interactif
// ============================================
const ROICalculator = () => {
  const [employees, setEmployees] = useState(5);
  const [hasIA, setHasIA] = useState(true);
  const [showResult, setShowResult] = useState(false);

  // Calculs corrigés - Cabinet toujours plus cher
  // Cabinet conseil : audit + accompagnement + formation = prix élevé
  // Notre formation : autonomie complète à prix fixe
  
  // Prix cabinet (accompagnement mise en conformité AI Act)
  const getCabinetCost = (n: number) => {
    if (n <= 1) return 12000;      // Audit simple + accompagnement
    if (n <= 5) return 25000;      // PME
    if (n <= 10) return 40000;     // ETI
    if (n <= 25) return 60000;     // Grande entreprise
    if (n <= 50) return 85000;     // Grand groupe
    return 120000;                  // Enterprise
  };
  
  // Notre prix (formation tout-en-un)
  const getFormationCost = (n: number) => {
    if (n <= 1) return 4990;        // Solo
    if (n <= 5) return 9990;        // Équipe
    if (n <= 10) return 14990;      // Équipe + extension
    if (n <= 25) return 24990;      // Enterprise light
    if (n <= 50) return 39990;      // Enterprise
    return 59990;                    // Enterprise full
  };

  const cabinetCost = getCabinetCost(employees);
  const formationCost = getFormationCost(employees);
  const savings = cabinetCost - formationCost;
  const savingsPercent = Math.round((savings / cabinetCost) * 100);
  const fineRisk = hasIA ? 35000000 : 7500000;
  const timeWithoutTraining = employees <= 10 ? 4 : employees <= 50 ? 6 : 9;
  const timeWithTraining = 1;

  return (
    <section className="relative z-10 py-20 px-6 overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gradient-to-r from-[#00FF88]/10 via-[#00F5FF]/10 to-[#8B5CF6]/10 blur-[100px] rounded-full" />
      </div>
      
      <div className="max-w-5xl mx-auto relative">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <span className="text-[#FFB800] text-sm font-medium uppercase tracking-widest">Calculateur</span>
          <h2 className="text-3xl sm:text-4xl font-bold mt-2 mb-4">
            Calculez votre <span className="text-[#00FF88]">ROI</span>
          </h2>
          <p className="text-white/40 max-w-xl mx-auto">Comparez le coût d&apos;un cabinet conseil vs notre formation autonome</p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Left: Inputs */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#FFB800]/20 to-[#FF6B00]/20 rounded-2xl blur-xl" />
              <div className="relative bg-[#0A0A1B]/90 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                  <span className="text-2xl">🔧</span> Votre situation
                </h3>

                {/* Employees slider */}
                <div className="mb-6">
                  <label className="flex justify-between text-sm mb-2">
                    <span className="text-white/60">Taille de l&apos;équipe à former</span>
                    <span className="text-white font-bold">{employees} pers.</span>
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="100"
                    value={employees}
                    onChange={(e) => { setEmployees(parseInt(e.target.value)); setShowResult(false); }}
                    className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#FFB800]"
                  />
                  <div className="flex justify-between text-xs text-white/30 mt-1">
                    <span>1</span>
                    <span>25</span>
                    <span>50</span>
                    <span>100</span>
                  </div>
                </div>

                {/* IA Usage */}
                <div className="mb-6">
                  <label className="text-sm text-white/60 mb-3 block">Utilisez-vous des systèmes IA à risque ?</label>
                  <div className="flex gap-3">
                    <button
                      onClick={() => { setHasIA(true); setShowResult(false); }}
                      className={`flex-1 py-3 rounded-xl font-medium transition-all ${
                        hasIA 
                          ? 'bg-[#FFB800]/20 border-2 border-[#FFB800] text-[#FFB800]' 
                          : 'bg-white/5 border border-white/10 text-white/60 hover:bg-white/10'
                      }`}
                    >
                      Oui / Probable
                    </button>
                    <button
                      onClick={() => { setHasIA(false); setShowResult(false); }}
                      className={`flex-1 py-3 rounded-xl font-medium transition-all ${
                        !hasIA 
                          ? 'bg-[#FFB800]/20 border-2 border-[#FFB800] text-[#FFB800]' 
                          : 'bg-white/5 border border-white/10 text-white/60 hover:bg-white/10'
                      }`}
                    >
                      Non / Je ne sais pas
                    </button>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowResult(true)}
                  className="w-full py-4 bg-gradient-to-r from-[#FFB800] to-[#FF6B00] text-black font-bold rounded-xl"
                >
                  Calculer mon ROI →
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Right: Results */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <AnimatePresence mode="wait">
              {showResult ? (
                <motion.div
                  key="results"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                >
                  <div className="relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-[#00FF88]/30 to-[#00F5FF]/30 rounded-2xl blur-xl" />
                    <div className="relative bg-[#0A0A1B]/90 backdrop-blur-xl rounded-2xl border border-[#00FF88]/30 p-6">
                      <h3 className="text-lg font-bold text-[#00FF88] mb-6 flex items-center gap-2">
                        <span className="text-2xl">📊</span> Votre estimation
                      </h3>

                      <div className="space-y-4 mb-6">
                        {/* Cost comparison */}
                        <div className="flex justify-between items-center py-3 border-b border-white/10">
                          <div>
                            <span className="text-white/60">Cabinet conseil</span>
                            <p className="text-white/40 text-xs">Audit + accompagnement externe</p>
                          </div>
                          <span className="text-[#FF4444] font-bold text-xl line-through">{cabinetCost.toLocaleString('fr-FR')} €</span>
                        </div>
                        <div className="flex justify-between items-center py-3 border-b border-white/10">
                          <div>
                            <span className="text-white/60">Notre formation</span>
                            <p className="text-white/40 text-xs">Autonomie complète + outils</p>
                          </div>
                          <span className="text-[#00FF88] font-bold text-xl">{formationCost.toLocaleString('fr-FR')} €</span>
                        </div>
                        <div className="flex justify-between items-center py-4 bg-[#00FF88]/10 rounded-xl px-4 -mx-1">
                          <span className="text-white font-semibold flex items-center gap-2">
                            <span className="text-2xl">💰</span> Économie
                          </span>
                          <div className="text-right">
                            <span className="text-[#00FF88] font-black text-2xl">{savings.toLocaleString('fr-FR')} €</span>
                            <span className="text-[#00FF88] text-sm ml-2">(-{savingsPercent}%)</span>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 mb-6">
                        <div className="bg-white/5 rounded-xl p-3 text-center">
                          <div className="text-2xl font-bold text-[#FF4444]">{timeWithoutTraining}</div>
                          <div className="text-white/40 text-xs">mois avec cabinet</div>
                        </div>
                        <div className="bg-white/5 rounded-xl p-3 text-center">
                          <div className="text-2xl font-bold text-[#00FF88]">{timeWithTraining}</div>
                          <div className="text-white/40 text-xs">mois avec formation</div>
                        </div>
                      </div>

                      {/* Risk */}
                      <div className="bg-[#FF4444]/10 rounded-xl p-4 border border-[#FF4444]/20">
                        <p className="text-[#FF4444] text-sm font-medium mb-1">⚠️ Sans mise en conformité</p>
                        <p className="text-white/80 text-xs">Amende jusqu&apos;à <span className="text-[#FF4444] font-bold">{(fineRisk / 1000000).toFixed(0)}M€</span> ou 7% du CA mondial</p>
                      </div>

                      {/* Bonus */}
                      <div className="mt-4 bg-[#8B5CF6]/10 rounded-xl p-4 border border-[#8B5CF6]/20">
                        <p className="text-[#8B5CF6] text-sm font-medium mb-1">✨ Bonus formation</p>
                        <p className="text-white/80 text-xs">Équipe formée + autonome, templates réutilisables, certificats Article 4</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full flex items-center justify-center"
                >
                  <div className="text-center text-white/30 py-20">
                    <div className="text-6xl mb-4">📊</div>
                    <p>Configurez votre situation<br />pour voir les résultats</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Bottom CTA */}
        {showResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 text-center"
          >
            <Link 
              href="#audit-gratuit"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-[#00FF88] to-[#00F5FF] text-black font-bold px-8 py-4 rounded-xl"
            >
              Économiser {savings.toLocaleString('fr-FR')} € maintenant
              <motion.span animate={{ x: [0, 5, 0] }} transition={{ duration: 1, repeat: Infinity }}>→</motion.span>
            </Link>
            <p className="text-white/40 text-sm mt-3">+ Financement OPCO possible jusqu&apos;à 100%</p>
          </motion.div>
        )}
      </div>
    </section>
  );
};

// Sticky CTA Bar Component
const StickyCTA = ({ show, daysLeft, spotsLeft }: { show: boolean, daysLeft: number, spotsLeft: number }) => (
  <AnimatePresence>
    {show && (
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed bottom-0 left-0 right-0 z-50 bg-[#0A0A1B]/95 backdrop-blur-xl border-t border-white/10 safe-area-inset-bottom"
      >
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            {/* Left: Urgency info - Hidden on mobile */}
            <div className="hidden sm:flex items-center gap-4">
              <div className="flex items-center gap-2">
                <motion.span 
                  className="text-2xl"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  ⏰
                </motion.span>
                <div>
                  <p className="text-white font-semibold text-sm">Plus que {daysLeft} jours</p>
                  <p className="text-white/40 text-xs">avant les contrôles AI Act</p>
                </div>
              </div>
              <div className="h-8 w-px bg-white/10" />
              <div className="flex items-center gap-2">
                <motion.div 
                  className="w-2 h-2 rounded-full bg-[#FF4444]"
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
                <span className="text-white/60 text-sm">
                  <span className="text-[#FFB800] font-semibold">{spotsLeft} places</span> au tarif actuel
                </span>
              </div>
            </div>

            {/* Mobile: Compact info */}
            <div className="flex sm:hidden items-center gap-2">
              <motion.span 
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                🔥
              </motion.span>
              <div>
                <p className="text-white font-semibold text-sm">{spotsLeft} places restantes</p>
                <p className="text-white/40 text-xs">{daysLeft}j avant deadline</p>
              </div>
            </div>

            {/* Right: CTA Button */}
            <div className="flex items-center gap-3">
              <div className="hidden md:block text-right">
                <p className="text-white/40 text-xs line-through">7 500€</p>
                <p className="text-white font-bold">4 990€ HT</p>
              </div>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link 
                  href="#audit-gratuit"
                  className="flex items-center gap-2 bg-gradient-to-r from-[#FF6B00] to-[#FF4444] text-white font-bold px-5 py-3 rounded-xl text-sm whitespace-nowrap"
                >
                  <span className="hidden sm:inline">Démarrer la formation</span>
                  <span className="sm:hidden">Commencer</span>
                  <motion.div 
                    className="w-4 h-4"
                    animate={{ x: [0, 3, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <Icons.ArrowRight />
                  </motion.div>
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    )}
  </AnimatePresence>
);

// Exit Intent Popup (Peep Laja)
const ExitIntentPopup = () => {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState('');
  
  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !sessionStorage.getItem('exitShown')) {
        setShow(true);
        sessionStorage.setItem('exitShown', 'true');
      }
    };
    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, []);

  if (!show) return null;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={() => setShow(false)}
    >
      <motion.div 
        initial={{ scale: 0.8, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        className="max-w-lg w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <HoloCard glow="#FF6B00">
          <div className="p-8 text-center relative">
            <button 
              onClick={() => setShow(false)}
              className="absolute top-4 right-4 text-white/40 hover:text-white w-6 h-6"
            >
              <Icons.X />
            </button>
            
            <motion.div 
              className="text-6xl mb-4"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              🎁
            </motion.div>
            <h3 className="text-2xl font-bold text-white mb-2">
              Avant de partir...
            </h3>
            <p className="text-white/60 mb-4">
              Savez-vous si votre entreprise est <span className="text-[#FF4444] font-semibold">à risque</span> ?
            </p>
            
            {/* Mini fear reminder */}
            <div className="bg-[#FF4444]/10 border border-[#FF4444]/30 rounded-xl p-4 mb-6">
              <p className="text-[#FF4444] font-bold text-lg">Amende jusqu'à 7% de votre CA</p>
              <p className="text-white/50 text-sm">Les contrôles commencent dans quelques mois</p>
            </div>
            
            <div className="space-y-3">
              {/* Primary CTA - Audit */}
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link 
                  href="#audit-gratuit"
                  onClick={() => setShow(false)}
                  className="block w-full py-4 bg-gradient-to-r from-[#00FF88] to-[#00F5FF] text-black font-bold rounded-xl text-lg"
                >
                  🎯 Diagnostic GRATUIT (2 min)
                </Link>
              </motion.div>
              
              <p className="text-white/40 text-sm">
                Découvrez votre niveau de risque en 30 secondes
              </p>
              
              {/* Separator */}
              <div className="flex items-center gap-4 my-4">
                <div className="flex-1 h-px bg-white/10" />
                <span className="text-white/30 text-xs">OU</span>
                <div className="flex-1 h-px bg-white/10" />
              </div>
              
              {/* Secondary - Checklist */}
              <div className="space-y-2">
                <input 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Votre email professionnel"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-[#00F5FF] transition-colors"
                />
                <button 
                  className="w-full py-3 bg-white/5 border border-white/10 text-white/80 font-medium rounded-xl hover:bg-white/10 transition-colors"
                >
                  📋 Recevoir la checklist "10 erreurs fatales"
                </button>
              </div>
              <p className="text-white/30 text-xs">
                Pas de spam. Désinscription en 1 clic.
              </p>
            </div>
          </div>
        </HoloCard>
      </motion.div>
    </motion.div>
  );
};

// Data
const modules = [
  { num: 1, title: "Fondamentaux de l'AI Act", duration: "45 min", icon: "📋", color: '#00F5FF' },
  { num: 2, title: "Classification des Risques", duration: "1h", icon: "⚠️", color: '#FF6B00' },
  { num: 3, title: "Cartographie des Systèmes IA", duration: "1h15", icon: "📊", color: '#00FF88' },
  { num: 4, title: "Gouvernance IA", duration: "1h", icon: "🏛️", color: '#FFB800' },
  { num: 5, title: "Systèmes Haut Risque", duration: "1h30", icon: "🔒", color: '#FF4444' },
  { num: 6, title: "Audit & Conformité", duration: "1h", icon: "✅", color: '#8B5CF6' },
];

const plans = [
  { id: 'solo', name: 'Solo', price: 4990, originalPrice: 7500, users: '1', color: '#00F5FF', features: ['Formation complète 8h', '12 Templates juridiques', '12 Vidéos pratiques', 'Audit + Rapport PDF', 'Certificat officiel', '12 mois d\'accès'] },
  { id: 'equipe', name: 'Équipe', price: 9990, originalPrice: 15000, users: '5', color: '#00FF88', popular: true, features: ['Tout le pack Solo ×5', '5 Certificats nominatifs', 'Dashboard équipe', 'Audit consolidé', 'Support prioritaire', 'Onboarding personnalisé'] },
  { id: 'enterprise', name: 'Enterprise', price: null, originalPrice: null, users: '50+', color: '#8B5CF6', features: ['Licences illimitées', 'Admin multi-sites', 'SSO / Intégration SIRH', 'Webinaire privé (2h)', 'Account manager dédié', 'SLA garanti'] },
];

export default function LandingPage() {
  const [mobileMenu, setMobileMenu] = useState(false);
  const [daysLeft, setDaysLeft] = useState(227);
  const [spotsLeft] = useState(7);
  const [showStickyCTA, setShowStickyCTA] = useState(false);

  useEffect(() => {
    setDaysLeft(calculateDaysUntil());
  }, []);

  // Sticky CTA visibility on scroll
  useEffect(() => {
    const handleScroll = () => {
      // Show after scrolling past hero (roughly 600px)
      const shouldShow = window.scrollY > 600;
      setShowStickyCTA(shouldShow);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const progressPercent = Math.max(0, Math.min(100, ((365 * 2 - daysLeft) / (365 * 2)) * 100));

  return (
    <div className="min-h-screen bg-[#0A0A1B] text-white overflow-x-hidden">
      <NeuralBackground />
      <ExitIntentPopup />
      <StickyCTA show={showStickyCTA} daysLeft={daysLeft} spotsLeft={spotsLeft} />

      {/* URGENCY TOP BANNER */}
      <motion.div 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative z-50"
      >
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-[#FF4444] via-[#FF6B00] to-[#FF4444]" />
          <motion.div 
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          />
          <div className="relative py-3 px-4">
            <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center gap-x-6 gap-y-1 text-sm">
              <div className="flex items-center gap-2">
                <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1, repeat: Infinity }} className="w-4 h-4">
                  <Icons.AlertTriangle />
                </motion.div>
                <span className="font-semibold">AI Act en vigueur :</span>
                <span>Plus que <strong className="text-yellow-300">{daysLeft} jours</strong> avant les contrôles massifs</span>
              </div>
              <div className="hidden sm:block text-white/50">|</div>
              <span className="font-medium">Amendes jusqu'à <strong>35M€</strong> ou <strong>7% du CA</strong></span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Header */}
      <header className="relative z-40 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-[#00F5FF] to-[#0066FF] rounded-xl flex items-center justify-center">
              <div className="w-5 h-5 text-white"><Icons.Shield /></div>
            </div>
            <span className="font-bold text-lg">Formation-IA-Act.fr</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {['Programme', 'Formateur', 'Audit Gratuit', 'FAQ'].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} className="text-white/60 hover:text-white transition-colors text-sm">
                {item}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/login" className="hidden sm:block text-white/60 hover:text-white transition-colors text-sm px-4 py-2">
              Connexion
            </Link>
            <Link href="#audit-gratuit" className="bg-gradient-to-r from-[#00F5FF] to-[#0066FF] text-white font-semibold px-5 py-2.5 rounded-xl text-sm">
              Diagnostic GRATUIT
            </Link>
            <button onClick={() => setMobileMenu(true)} className="md:hidden p-2 text-white/60">
              <div className="w-6 h-6"><Icons.Menu /></div>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenu && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[60] bg-[#0A0A1B]/98 backdrop-blur-xl md:hidden">
            <div className="p-6">
              <div className="flex justify-end mb-8">
                <button onClick={() => setMobileMenu(false)} className="p-2 text-white/60"><div className="w-6 h-6"><Icons.X /></div></button>
              </div>
              <nav className="flex flex-col gap-4">
                {['Programme', 'Formateur', 'Audit Gratuit', 'FAQ'].map(item => (
                  <a key={item} href={`#${item.toLowerCase()}`} onClick={() => setMobileMenu(false)} className="text-xl font-semibold text-white/80 py-2">{item}</a>
                ))}
                <Link href="#audit-gratuit" className="bg-gradient-to-r from-[#00F5FF] to-[#0066FF] text-white font-semibold px-6 py-3 rounded-xl text-center mt-4">Diagnostic GRATUIT</Link>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ============================================ */}
      {/* HERO - BRUNSON STYLE: Lead with PAIN */}
      {/* ============================================ */}
      <section className="relative z-10 pt-12 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Pain-focused content */}
            <div>
              {/* Pain headline */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <div className="inline-flex items-center gap-2 bg-[#FF4444]/10 border border-[#FF4444]/30 rounded-full px-4 py-2 mb-6">
                  <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity }} className="w-2 h-2 rounded-full bg-[#FF4444]" />
                  <span className="text-[#FF4444] text-sm font-medium">Article 4 applicable depuis février 2025</span>
                </div>
              </motion.div>

              <motion.h1 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: 0.1 }} 
                className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
              >
                <span className="text-[#FF4444]">« On n'était pas au courant »</span>
                <br />
                <span className="text-white/40">ne sera pas une excuse</span>
                <br />
                <span className="text-white">pour la CNIL.</span>
              </motion.h1>

              <motion.p 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: 0.2 }} 
                className="text-lg text-white/60 mb-8"
              >
                En août 2026, les entreprises non conformes à l'AI Act recevront des amendes allant jusqu'à{' '}
                <span className="text-[#FF4444] font-bold">35 millions d'euros</span>.
                <br />
                <span className="text-white font-medium">Cette formation vous protège.</span>
              </motion.p>

              {/* Trust badges */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: 0.3 }} 
                className="flex flex-wrap items-center gap-4 mb-8"
              >
                {[
                  { icon: "✅", text: "Certifié Qualiopi", sub: "100% finançable OPCO" },
                  { icon: "🎓", text: "847 certifiés", sub: "depuis janvier 2024" },
                  { icon: "⭐", text: "4.7/5", sub: "127 avis vérifiés" },
                ].map((badge, i) => (
                  <div key={i} className="flex items-center gap-2 bg-white/5 rounded-xl px-4 py-2">
                    <span className="text-xl">{badge.icon}</span>
                    <div>
                      <p className="text-white text-sm font-medium">{badge.text}</p>
                      <p className="text-white/40 text-xs">{badge.sub}</p>
                    </div>
                  </div>
                ))}
              </motion.div>

              {/* SINGLE CTA - Peep Laja style */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: 0.4 }} 
                className="flex flex-col gap-3"
              >
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Link 
                    href="/quiz" 
                    className="group relative bg-gradient-to-r from-[#FF6B00] to-[#FF4444] text-white font-bold px-8 py-5 rounded-xl flex items-center justify-center gap-3 text-lg overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-[#FF4444] to-[#FF6B00] opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative flex items-center gap-3">
                      <div className="w-6 h-6"><Icons.Zap /></div>
                      Évaluez votre risque en 2 minutes
                      <motion.div className="w-5 h-5" animate={{ x: [0, 5, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
                        <Icons.ArrowRight />
                      </motion.div>
                    </div>
                  </Link>
                </motion.div>
                <p className="text-center text-white/40 text-sm">
                  Gratuit • Sans engagement • Résultat immédiat
                </p>
              </motion.div>
            </div>

            {/* Right: Countdown + Urgency */}
            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
              <HoloCard glow="#FF6B00">
                <div className="p-6 sm:p-8">
                  {/* Countdown */}
                  <div className="text-center mb-6">
                    <motion.div 
                      className="text-7xl sm:text-8xl font-black bg-gradient-to-br from-[#FF6B00] to-[#FF4444] bg-clip-text text-transparent"
                      animate={{ scale: [1, 1.02, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      {daysLeft}
                    </motion.div>
                    <p className="text-white/40 mt-2">jours avant les premiers contrôles massifs</p>
                  </div>

                  {/* Progress */}
                  <div className="mb-6">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-white/40">Le temps presse...</span>
                      <span className="text-[#FF6B00] font-medium">{Math.round(progressPercent)}% écoulé</span>
                    </div>
                    <div className="h-3 bg-white/5 rounded-full overflow-hidden">
                      <motion.div 
                        className="h-full rounded-full"
                        style={{ background: 'linear-gradient(90deg, #00FF88, #FFB800, #FF6B00, #FF4444)' }}
                        initial={{ width: 0 }}
                        animate={{ width: `${progressPercent}%` }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                      />
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { value: '35M€', label: 'Amende max', color: '#FF4444' },
                      { value: '7%', label: 'Du CA mondial', color: '#FF6B00' },
                      { value: '150M€', label: 'Amendes CNIL 2024', color: '#FFB800' },
                      { value: 'Art. 4', label: 'Formation obligatoire', color: '#00F5FF' },
                    ].map((stat, i) => (
                      <motion.div 
                        key={i}
                        className="bg-white/5 rounded-xl p-3 text-center border border-white/5"
                        whileHover={{ scale: 1.03 }}
                      >
                        <div className="text-lg font-bold" style={{ color: stat.color }}>{stat.value}</div>
                        <div className="text-xs text-white/30">{stat.label}</div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </HoloCard>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* QUICK WINS BAR - Bénéfices immédiats */}
      {/* ============================================ */}
      <section className="relative z-10 py-8 px-6 border-y border-white/5 bg-gradient-to-r from-[#00FF88]/5 via-transparent to-[#00F5FF]/5">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: "🎬", value: "18", label: "vidéos (cours + tutos)", sublabel: "Appliquez en temps réel" },
              { icon: "🎯", value: "150+", label: "questions d'audit", sublabel: "Zéro angle mort" },
              { icon: "🎮", value: "1er", label: "simulateur d'audit", sublabel: "Exclusivité marché" },
              { icon: "🛠️", value: "4", label: "outils intégrés", sublabel: "Construisez VOS documents" },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl mb-2">{stat.icon}</div>
                <div className="text-2xl sm:text-3xl font-black text-white mb-1">{stat.value}</div>
                <div className="text-white/80 text-sm font-medium">{stat.label}</div>
                <div className="text-white/40 text-xs">{stat.sublabel}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* PROBLEM AGITATION SECTION */}
      {/* ============================================ */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Ce qui arrive aux entreprises{' '}
              <span className="text-[#FF4444]">non préparées</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              { icon: "💸", title: "Sanctions financières", desc: "Amendes pouvant atteindre 7% du CA mondial. La CNIL a déjà distribué 150M€ d'amendes RGPD en France en 2024.", color: "#FF4444" },
              { icon: "⛔", title: "Interdiction d'exploitation", desc: "Les régulateurs peuvent ordonner l'arrêt IMMÉDIAT de vos systèmes IA non conformes. Du jour au lendemain.", color: "#FF6B00" },
              { icon: "📉", title: "Perte de contrats", desc: "Les grands comptes exigent DÉJÀ des preuves de conformité AI Act. Sans certificat, vous êtes hors jeu.", color: "#FFB800" },
              { icon: "⚖️", title: "Responsabilité personnelle", desc: "Les dirigeants peuvent être tenus PERSONNELLEMENT responsables en cas de négligence caractérisée.", color: "#8B5CF6" },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <HoloCard glow={item.color}>
                  <div className="p-6">
                    <div className="flex items-start gap-4">
                      <motion.span 
                        className="text-4xl"
                        animate={{ rotate: [0, 5, -5, 0] }}
                        transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                      >
                        {item.icon}
                      </motion.span>
                      <div>
                        <h3 className="text-white font-bold text-lg mb-2">{item.title}</h3>
                        <p className="text-white/50 text-sm">{item.desc}</p>
                      </div>
                    </div>
                  </div>
                </HoloCard>
              </motion.div>
            ))}
          </div>

          {/* Transition */}
          <motion.div 
            className="text-center mt-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <p className="text-white/60 text-xl mb-4">
              La bonne nouvelle ?{' '}
              <span className="text-[#00FF88] font-semibold">Vous pouvez éviter tout ça.</span>
            </p>
            <motion.div 
              className="text-4xl"
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              ↓
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Trusted By */}
      <section className="relative z-10 py-12 px-6 border-y border-white/5">
        <div className="max-w-6xl mx-auto">
          <p className="text-center text-white/20 text-sm mb-8 uppercase tracking-widest">
            +127 entreprises nous font déjà confiance
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 opacity-50">
            {['BNP Paribas', 'Capgemini', 'Orange', 'Société Générale', 'AXA', 'Thales'].map(company => (
              <motion.div 
                key={company} 
                className="text-white/40 hover:text-white/70 font-semibold text-lg transition-colors"
                whileHover={{ scale: 1.05 }}
              >
                {company}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* BEFORE/AFTER - Transformation mesurable */}
      {/* ============================================ */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="text-[#FF6B00] text-sm font-medium uppercase tracking-widest">Transformation</span>
            <h2 className="text-3xl sm:text-4xl font-bold mt-2 mb-4">
              Avant vs <span className="text-[#00FF88]">Après</span> la formation
            </h2>
            <p className="text-white/40 max-w-xl mx-auto">Des résultats concrets et mesurables pour votre organisation</p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* AVANT */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-[#FF4444]/20 to-[#FF6B00]/20 rounded-2xl blur-xl" />
                <div className="relative bg-[#0A0A1B]/90 backdrop-blur-xl rounded-2xl border border-[#FF4444]/20 p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-[#FF4444]/20 flex items-center justify-center">
                      <span className="text-2xl">😰</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-[#FF4444]">AVANT</h3>
                      <p className="text-white/40 text-sm">Sans formation AI Act</p>
                    </div>
                  </div>
                  <ul className="space-y-4">
                    {[
                      { metric: "0%", label: "de systèmes IA documentés", icon: "📋" },
                      { metric: "???", label: "niveau de risque inconnu", icon: "⚠️" },
                      { metric: "0", label: "personne formée Article 4", icon: "👥" },
                      { metric: "7%", label: "du CA en amende", icon: "💸" },
                      { metric: "3-6 mois", label: "pour comprendre le sujet", icon: "⏳" },
                      { metric: "15-50k€", label: "si cabinet externe", icon: "🏢" },
                    ].map((item, i) => (
                      <motion.li 
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        className="flex items-center gap-3 bg-[#FF4444]/5 rounded-lg p-3"
                      >
                        <span className="text-xl">{item.icon}</span>
                        <div>
                          <span className="text-[#FF4444] font-bold">{item.metric}</span>
                          <span className="text-white/60 text-sm ml-2">{item.label}</span>
                        </div>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>

            {/* APRÈS */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-[#00FF88]/20 to-[#00F5FF]/20 rounded-2xl blur-xl" />
                <div className="relative bg-[#0A0A1B]/90 backdrop-blur-xl rounded-2xl border border-[#00FF88]/20 p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-[#00FF88]/20 flex items-center justify-center">
                      <span className="text-2xl">🚀</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-[#00FF88]">APRÈS</h3>
                      <p className="text-white/40 text-sm">Avec notre formation</p>
                    </div>
                  </div>
                  <ul className="space-y-4">
                    {[
                      { metric: "100%", label: "systèmes IA inventoriés", icon: "✅" },
                      { metric: "Clair", label: "classification des risques", icon: "🎯" },
                      { metric: "Toute l'équipe", label: "certifiée Article 4", icon: "🎓" },
                      { metric: "0€", label: "risque d'amende", icon: "🛡️" },
                      { metric: "8h", label: "pour être opérationnel", icon: "⚡" },
                      { metric: "4 990€", label: "investissement unique", icon: "💎" },
                    ].map((item, i) => (
                      <motion.li 
                        key={i}
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        className="flex items-center gap-3 bg-[#00FF88]/5 rounded-lg p-3"
                      >
                        <span className="text-xl">{item.icon}</span>
                        <div>
                          <span className="text-[#00FF88] font-bold">{item.metric}</span>
                          <span className="text-white/60 text-sm ml-2">{item.label}</span>
                        </div>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Bottom summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-8 text-center"
          >
            <div className="inline-flex items-center gap-4 bg-gradient-to-r from-[#00FF88]/10 to-[#00F5FF]/10 rounded-2xl border border-white/10 px-6 py-4">
              <span className="text-3xl">💡</span>
              <div className="text-left">
                <p className="text-white font-bold">ROI immédiat</p>
                <p className="text-white/60 text-sm">Formation rentabilisée dès le premier audit évité</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Mini CTA */}
      <div className="max-w-4xl mx-auto px-6">
        <MiniCTA variant="default" />
      </div>

      {/* ============================================ */}
      {/* LEARNING BY DOING - Le différenciateur clé */}
      {/* ============================================ */}
      <section className="relative z-10 py-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#8B5CF6]/5 to-transparent" />
        
        <div className="max-w-6xl mx-auto relative">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }} 
            className="text-center mb-12"
          >
            <motion.span 
              className="inline-flex items-center gap-2 bg-gradient-to-r from-[#8B5CF6]/20 to-[#00F5FF]/20 border border-[#8B5CF6]/30 text-[#8B5CF6] text-sm font-bold uppercase tracking-widest px-6 py-3 rounded-full mb-6"
              animate={{ boxShadow: ['0 0 20px rgba(139,92,246,0.2)', '0 0 40px rgba(139,92,246,0.4)', '0 0 20px rgba(139,92,246,0.2)'] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              🚀 Exclusivité formation
            </motion.span>
            <h2 className="text-3xl sm:text-5xl font-black mt-4 mb-6">
              Vous <span className="text-[#00FF88]">construisez</span> votre conformité
              <br /><span className="text-[#8B5CF6]">pendant</span> que vous apprenez
            </h2>
            <p className="text-white/60 text-xl max-w-3xl mx-auto">
              Pas de théorie abstraite. À chaque module, un <span className="text-white font-bold">outil intégré</span> vous permet 
              de créer <span className="text-white font-bold">VOS propres documents</span> de conformité.
            </p>
            
            {/* Pitch unique */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="mt-8 inline-block"
            >
              <div className="bg-gradient-to-r from-[#FF6B00]/20 via-[#FFB800]/20 to-[#FF6B00]/20 border-2 border-[#FFB800]/50 rounded-2xl px-8 py-5">
                <p className="text-lg sm:text-xl text-white font-medium">
                  📣 <span className="text-[#FFB800] font-bold">La seule formation</span> où vous repartez avec 
                  <span className="text-[#00FF88] font-bold"> TOUS vos documents prêts</span>,
                  <br className="hidden sm:block" /> pas juste des connaissances théoriques.
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* Les 4 outils intégrés aux modules */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {[
              {
                module: "Module 3",
                title: "Wizard de Classification",
                icon: "⚠️",
                color: "#FF6B00",
                description: "Classifiez vos systèmes IA en répondant à 10 questions guidées",
                output: "→ Classification de risque pour chaque système",
                benefit: "Plus besoin de deviner si vous êtes concerné"
              },
              {
                module: "Module 4", 
                title: "Éditeur d'Email Intelligent",
                icon: "✉️",
                color: "#00F5FF",
                description: "Générez des emails professionnels pour interroger vos fournisseurs IA",
                output: "→ 5 emails prêts à envoyer",
                benefit: "Conformité fournisseurs en 1 clic"
              },
              {
                module: "Module 5",
                title: "Générateur Mentions Légales",
                icon: "⚖️",
                color: "#00FF88",
                description: "Créez vos mentions légales IA conformes à l'Article 50",
                output: "→ Mentions légales personnalisées",
                benefit: "Transparence IA garantie"
              },
              {
                module: "Module 6",
                title: "Simulation d'Audit Immersive",
                icon: "🎮",
                color: "#8B5CF6",
                description: "Affrontez un auditeur virtuel dans 120+ scénarios interactifs",
                output: "→ Expérience d'audit + score de préparation",
                benefit: "Zéro stress le jour J",
                exclusive: true
              }
            ].map((tool, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative group"
              >
                {tool.exclusive && (
                  <div className="absolute -top-3 right-4 z-10">
                    <motion.span 
                      className="bg-gradient-to-r from-[#FF6B00] to-[#FF4444] text-white text-xs font-bold px-3 py-1 rounded-full"
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      🏆 Exclusivité marché
                    </motion.span>
                  </div>
                )}
                <div 
                  className="h-full p-6 rounded-2xl border transition-all duration-300 hover:scale-[1.02]"
                  style={{ 
                    background: `linear-gradient(135deg, ${tool.color}10, transparent)`,
                    borderColor: `${tool.color}30`
                  }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div 
                      className="w-14 h-14 rounded-xl flex items-center justify-center"
                      style={{ background: `${tool.color}20` }}
                    >
                      <span className="text-3xl">{tool.icon}</span>
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white/40 uppercase">{tool.module}</span>
                      <h3 className="text-xl font-bold text-white">{tool.title}</h3>
                    </div>
                  </div>
                  <p className="text-white/70 mb-3">{tool.description}</p>
                  <p className="text-sm font-semibold mb-2" style={{ color: tool.color }}>
                    {tool.output}
                  </p>
                  <p className="text-white/50 text-sm">✓ {tool.benefit}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Comparaison formations classiques */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }}
          >
            <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
              <div className="grid md:grid-cols-2">
                {/* Formation classique */}
                <div className="p-6 border-b md:border-b-0 md:border-r border-white/10">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-2xl">😐</span>
                    <h4 className="text-lg font-bold text-white/60">Formation classique</h4>
                  </div>
                  <ul className="space-y-3">
                    {[
                      "Vidéos théoriques PowerPoint",
                      "Quiz de validation basiques",
                      "Templates génériques en PDF",
                      "\"Bonne chance pour la suite\"",
                      "Vous repartez avec... de la théorie"
                    ].map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-white/50 text-sm">
                        <span className="text-[#FF4444]">✗</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                
                {/* Notre formation */}
                <div className="p-6 bg-gradient-to-br from-[#00FF88]/5 to-transparent">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-2xl">🚀</span>
                    <h4 className="text-lg font-bold text-[#00FF88]">Notre formation</h4>
                  </div>
                  <ul className="space-y-3">
                    {[
                      "18 vidéos dont 12 tutoriels pratiques",
                      "90+ questions avec feedback détaillé",
                      "4 outils INTÉGRÉS aux modules",
                      "Vidéos de correction personnalisées",
                      "Vous repartez avec VOS DOCUMENTS"
                    ].map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-white text-sm">
                        <span className="text-[#00FF88]">✓</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============================================ */}
      {/* SIMULATEUR D'AUDIT - Killer Feature */}
      {/* ============================================ */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <HoloCard glow="#FF6B00">
              <div className="p-8 sm:p-10">
                {/* Badge exclusivité */}
                <div className="text-center mb-8">
                  <motion.span 
                    className="inline-flex items-center gap-2 bg-[#FF6B00]/20 text-[#FF6B00] text-sm font-bold px-4 py-2 rounded-full"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    🏆 Aucune autre formation n'a ça
                  </motion.span>
                </div>

                <div className="grid lg:grid-cols-2 gap-10 items-center">
                  {/* Left - Description */}
                  <div>
                    <h2 className="text-3xl sm:text-4xl font-black mb-6">
                      <span className="text-[#FF6B00]">Simulateur d'audit</span>
                      <br />grandeur nature
                    </h2>
                    
                    <p className="text-white/60 text-lg mb-6">
                      Avant de passer un vrai contrôle, <span className="text-white font-semibold">entraînez-vous face à un auditeur virtuel</span>. 
                      Vivez l'expérience d'un audit AI Act comme si vous y étiez.
                    </p>

                    <div className="space-y-4">
                      {[
                        { icon: "🎭", text: "120+ dialogues interactifs avec choix multiples" },
                        { icon: "📊", text: "6 phases d'audit (notification → clôture)" },
                        { icon: "💀", text: "5 scénarios de game over" },
                        { icon: "🎲", text: "20+ événements aléatoires" },
                        { icon: "📈", text: "Scoring temps réel (confiance, stress, preuves)" },
                      ].map((item, i) => (
                        <motion.div 
                          key={i}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: i * 0.1 }}
                          className="flex items-center gap-3"
                        >
                          <span className="text-2xl">{item.icon}</span>
                          <span className="text-white/80">{item.text}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Right - Visual mockup */}
                  <div className="relative">
                    <div className="aspect-[4/3] bg-gradient-to-br from-[#1a1a3e] to-[#0a0a1b] rounded-2xl border border-white/10 overflow-hidden">
                      <div className="absolute inset-0 p-6">
                        {/* Top bar - Stats */}
                        <div className="flex justify-between items-center mb-6">
                          <div className="flex gap-4">
                            <div className="text-center">
                              <div className="text-xs text-white/40">Confiance</div>
                              <div className="w-20 h-2 bg-white/10 rounded-full overflow-hidden">
                                <div className="w-3/4 h-full bg-[#00FF88]" />
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="text-xs text-white/40">Stress</div>
                              <div className="w-20 h-2 bg-white/10 rounded-full overflow-hidden">
                                <div className="w-1/3 h-full bg-[#FFB800]" />
                              </div>
                            </div>
                          </div>
                          <div className="text-[#00F5FF] text-sm font-mono">Phase 3/6</div>
                        </div>

                        {/* Dialogue */}
                        <div className="bg-white/5 rounded-xl p-4 mb-4">
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-full bg-[#FF6B00]/20 flex items-center justify-center">
                              <span className="text-lg">👔</span>
                            </div>
                            <div>
                              <p className="text-[#FF6B00] text-xs font-bold mb-1">AUDITEUR</p>
                              <p className="text-white/80 text-sm">
                                "Votre registre IA ne mentionne pas la date de mise à jour. Comment justifiez-vous ça ?"
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Choices */}
                        <div className="space-y-2">
                          {[
                            { text: "C'est une erreur, je corrige", optimal: true },
                            { text: "Notre politique ne l'exige pas", optimal: false },
                            { text: "Je ne savais pas", optimal: false },
                          ].map((choice, i) => (
                            <div 
                              key={i}
                              className={`p-2 rounded-lg border text-xs ${
                                choice.optimal 
                                  ? 'border-[#00FF88]/50 bg-[#00FF88]/10 text-white' 
                                  : 'border-white/10 bg-white/5 text-white/60'
                              }`}
                            >
                              {choice.text}
                              {choice.optimal && <span className="ml-2 text-[#00FF88]">✓</span>}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="absolute -bottom-4 -right-4 bg-[#0A0A1B] border border-[#FF6B00]/30 rounded-xl p-3">
                      <p className="text-[#FF6B00] font-bold text-lg">4 400+ lignes</p>
                      <p className="text-white/40 text-xs">de code dédié</p>
                    </div>
                  </div>
                </div>

                {/* Bottom */}
                <div className="mt-10 p-6 bg-gradient-to-r from-[#FF6B00]/10 to-transparent border border-[#FF6B00]/20 rounded-xl">
                  <p className="text-center text-white/80">
                    <span className="text-[#FF6B00] font-bold">Pourquoi c'est crucial ?</span> Un audit mal préparé = stress, erreurs, sanctions. 
                    Avec notre simulateur, vous avez déjà "vécu" l'expérience <span className="text-white font-semibold">avant le vrai jour J</span>.
                  </p>
                </div>
              </div>
            </HoloCard>
          </motion.div>
        </div>
      </section>

      {/* ============================================ */}
      {/* ARSENAL COMPLET - Ce que vous allez obtenir */}
      {/* ============================================ */}
      <section id="programme" className="relative z-10 py-20 px-6 overflow-hidden">
        {/* Background effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#00FF88]/5 to-transparent" />
        
        <div className="max-w-6xl mx-auto relative">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }} 
            className="text-center mb-12"
          >
            <motion.span 
              className="inline-flex items-center gap-2 bg-gradient-to-r from-[#00FF88]/20 to-[#00F5FF]/20 border border-[#00FF88]/30 text-[#00FF88] text-sm font-bold uppercase tracking-widest px-6 py-3 rounded-full mb-6"
              animate={{ boxShadow: ['0 0 20px rgba(0,255,136,0.2)', '0 0 40px rgba(0,255,136,0.4)', '0 0 20px rgba(0,255,136,0.2)'] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              🧳 Votre valise de survie
            </motion.span>
            <h2 className="text-3xl sm:text-5xl font-black mt-4 mb-4">
              Tout ce que vous <span className="text-[#00FF88]">gardez à vie</span>
            </h2>
            <p className="text-white/50 max-w-2xl mx-auto">
              Templates, outils, ressources — tout est inclus et téléchargeable
            </p>
          </motion.div>

          {/* Quick stats bar */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: "🎬", value: "18", label: "vidéos", sublabel: "cours + tutos" },
                { icon: "🎯", value: "150+", label: "questions", sublabel: "audit complet" },
                { icon: "📄", value: "12", label: "templates", sublabel: "prêts à l'emploi" },
                { icon: "🛠️", value: "4", label: "outils", sublabel: "intégrés" },
              ].map((stat, i) => (
                <div key={i} className="text-center p-4 bg-white/5 rounded-xl border border-white/10">
                  <div className="text-2xl mb-1">{stat.icon}</div>
                  <div className="text-2xl font-black text-white">{stat.value}</div>
                  <div className="text-white/60 text-sm">{stat.label}</div>
                  <div className="text-white/30 text-xs">{stat.sublabel}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Templates grid */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h3 className="text-xl font-bold text-center mb-6 text-white/80">
              📁 12 Templates professionnels
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                { name: "Registre IA Complet", type: "Excel", icon: "📊" },
                { name: "Politique IA Entreprise", type: "Word", icon: "📜" },
                { name: "Check-list Conformité", type: "PDF", icon: "✅" },
                { name: "Matrice des Risques", type: "Excel", icon: "⚠️" },
                { name: "Modèle FRIA", type: "Word", icon: "⚖️" },
                { name: "Template Audit Interne", type: "Excel", icon: "🔍" },
                { name: "Emails Fournisseurs", type: "Word", icon: "📧" },
                { name: "Plan d'Action 90 Jours", type: "Excel", icon: "📅" },
                { name: "Guide Documentation", type: "PDF", icon: "📚" },
                { name: "FAQ Juridique", type: "PDF", icon: "❓" },
                { name: "Certificat Officiel", type: "PDF", icon: "🏆" },
                { name: "Fiches Mémo", type: "PDF", icon: "📝" }
              ].map((tool, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.03 }}
                  whileHover={{ scale: 1.03 }}
                  className="p-3 bg-white/5 border border-white/10 rounded-xl hover:border-[#00FF88]/30 transition-all"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{tool.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-white text-sm truncate">{tool.name}</p>
                      <span className="text-[10px] px-1.5 py-0.5 bg-white/10 text-white/50 rounded">{tool.type}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* CE QUE VOUS ALLEZ MAÎTRISER */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }}
            className="mb-16"
          >
            <h3 className="text-2xl font-bold text-center mb-8">
              <span className="text-[#00F5FF]">6 modules</span> pour devenir <span className="text-[#FFB800]">imbattable</span>
            </h3>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  num: "01",
                  title: "Décryptage AI Act",
                  subtitle: "Comprendre pour agir",
                  points: ["Les 4 niveaux de risque expliqués", "Ce qui est interdit (et pourquoi)", "Les délais à ne pas rater"],
                  result: "→ Vous saurez exactement ce qui s'applique à vous",
                  color: "#00F5FF",
                  icon: "🎯"
                },
                {
                  num: "02",
                  title: "Classification Maîtrisée",
                  subtitle: "Cartographier vos risques",
                  points: ["Identifier TOUS vos systèmes IA", "Les classifier correctement", "Prioriser vos actions"],
                  result: "→ Zéro angle mort dans votre parc IA",
                  color: "#00FF88",
                  icon: "📊"
                },
                {
                  num: "03",
                  title: "Registre & Inventaire",
                  subtitle: "Documentation parfaite",
                  points: ["Template de registre prêt à l'emploi", "Fiche d'identité pour chaque IA", "Traçabilité irréprochable"],
                  result: "→ Dossier béton pour les contrôleurs",
                  color: "#FFB800",
                  icon: "📋"
                },
                {
                  num: "04",
                  title: "Gouvernance IA",
                  subtitle: "Structurer votre organisation",
                  points: ["Politique IA clé en main", "Rôles et responsabilités", "Processus de validation"],
                  result: "→ Organisation solide et défendable",
                  color: "#8B5CF6",
                  icon: "🏛️"
                },
                {
                  num: "05",
                  title: "Systèmes Haut Risque",
                  subtitle: "Le niveau expert",
                  points: ["Exigences spécifiques détaillées", "Documentation technique avancée", "Supervision humaine"],
                  result: "→ Même vos IA critiques sont conformes",
                  color: "#FF6B00",
                  icon: "⚠️"
                },
                {
                  num: "06",
                  title: "Audit & Contrôle",
                  subtitle: "Prêt pour le jour J",
                  points: ["Simulation d'audit complète", "Check-list du contrôleur", "Stratégie de défense"],
                  result: "→ Vous passez le contrôle les doigts dans le nez",
                  color: "#FF4444",
                  icon: "✅"
                }
              ].map((module, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="group"
                >
                  <div 
                    className="h-full p-6 rounded-2xl border transition-all duration-300"
                    style={{ 
                      background: `linear-gradient(135deg, ${module.color}10, transparent)`,
                      borderColor: `${module.color}30`
                    }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-4xl">{module.icon}</span>
                      <span className="text-white/20 font-mono text-sm">{module.num}</span>
                    </div>
                    <h4 className="text-xl font-bold text-white mb-1">{module.title}</h4>
                    <p className="text-white/50 text-sm mb-4">{module.subtitle}</p>
                    <ul className="space-y-2 mb-4">
                      {module.points.map((point, j) => (
                        <li key={j} className="text-white/70 text-sm flex items-start gap-2">
                          <span style={{ color: module.color }}>•</span>
                          {point}
                        </li>
                      ))}
                    </ul>
                    <p className="text-sm font-semibold" style={{ color: module.color }}>
                      {module.result}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* VOTRE VALISE - Les outils concrets */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }}
            className="mb-16"
          >
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold">
                🧳 Votre <span className="text-[#FFB800]">valise de survie</span> AI Act
              </h3>
              <p className="text-white/50 mt-2">12 outils prêts à l'emploi que vous gardez à vie</p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { name: "Registre IA Complet", type: "Excel", icon: "📊", desc: "12 onglets pré-remplis" },
                { name: "Politique IA Entreprise", type: "Word", icon: "📜", desc: "18 pages personnalisables" },
                { name: "Check-list Conformité", type: "PDF", icon: "✅", desc: "127 points de contrôle" },
                { name: "Matrice des Risques", type: "Excel", icon: "⚠️", desc: "Scoring automatique" },
                { name: "Modèle FRIA", type: "Word", icon: "⚖️", desc: "Évaluation d'impact" },
                { name: "Template Audit Interne", type: "Excel", icon: "🔍", desc: "Simulation complète" },
                { name: "Emails Fournisseurs", type: "Word", icon: "📧", desc: "5 modèles prêts" },
                { name: "Plan d'Action 90 Jours", type: "Excel", icon: "📅", desc: "Roadmap détaillée" },
                { name: "Guide Documentation", type: "PDF", icon: "📚", desc: "Tout ce qu'il faut documenter" },
                { name: "FAQ Juridique", type: "PDF", icon: "❓", desc: "50 questions/réponses" },
                { name: "Certificat Officiel", type: "PDF", icon: "🏆", desc: "Valeur probante" },
                { name: "Fiches Mémo", type: "PDF", icon: "📝", desc: "Résumés visuels" }
              ].map((tool, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ scale: 1.05, y: -3 }}
                  className="p-4 bg-white/5 border border-white/10 rounded-xl hover:border-[#00FF88]/30 transition-all cursor-default"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{tool.icon}</span>
                    <div>
                      <p className="font-semibold text-white text-sm">{tool.name}</p>
                      <p className="text-white/40 text-xs">{tool.desc}</p>
                      <span className="inline-block mt-1 text-[10px] px-2 py-0.5 bg-white/10 text-white/50 rounded">{tool.type}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.p 
              className="text-center mt-6 text-white/60"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <span className="text-[#00FF88] font-bold">Valeur totale : 4 600€</span> de templates et outils — 
              <span className="text-white"> inclus dans la formation</span>
            </motion.p>
          </motion.div>

          {/* VIDÉOS - MISE À JOUR 18 VIDÉOS */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }}
            className="mb-16"
          >
            <HoloCard glow="#8B5CF6">
              <div className="p-8">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-5xl">🎬</span>
                      <div>
                        <span className="text-[#FFB800] text-sm font-bold">NOUVEAU</span>
                        <h3 className="text-2xl font-bold">
                          <span className="text-[#8B5CF6]">18 vidéos</span> pour maîtriser l'AI Act
                        </h3>
                      </div>
                    </div>
                    
                    <p className="text-white/60 mb-6">
                      Pas juste des cours théoriques. <span className="text-white font-semibold">12 vidéos tutoriels</span> où 
                      vous appliquez directement sur VOS documents, avec <span className="text-white font-semibold">corrections incluses</span>.
                    </p>

                    {/* Breakdown vidéos */}
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">📚</span>
                          <span className="text-white">6 vidéos de cours</span>
                        </div>
                        <span className="text-white/40 text-sm">~90 min</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-[#00FF88]/10 rounded-lg border border-[#00FF88]/30">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">🛠️</span>
                          <span className="text-white font-semibold">12 vidéos tutoriels pratiques</span>
                        </div>
                        <span className="text-[#00FF88] text-sm font-bold">EXCLUSIF</span>
                      </div>
                    </div>

                    <ul className="space-y-2">
                      {[
                        "Format court (10-20 min) = pas de perte de temps",
                        "Vidéos de CORRECTION pour chaque outil",
                        "Vous créez VOS documents en suivant",
                        "Sous-titres + transcriptions incluses",
                        "Accès mobile = formez-vous partout"
                      ].map((item, i) => (
                        <li key={i} className="flex items-center gap-2 text-white/80 text-sm">
                          <span className="text-[#8B5CF6]">▶</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="relative">
                    <div className="aspect-video bg-gradient-to-br from-[#8B5CF6]/20 to-[#00F5FF]/20 rounded-xl border border-white/10 flex items-center justify-center">
                      <motion.div
                        className="w-20 h-20 bg-[#8B5CF6] rounded-full flex items-center justify-center cursor-pointer"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        animate={{ boxShadow: ['0 0 0 0 rgba(139,92,246,0.4)', '0 0 0 20px rgba(139,92,246,0)', '0 0 0 0 rgba(139,92,246,0.4)'] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <span className="text-3xl ml-1">▶</span>
                      </motion.div>
                    </div>
                    <div className="absolute -bottom-3 -right-3 bg-[#FFB800] text-black text-xs font-bold px-3 py-1 rounded-full">
                      18 vidéos • 8h de contenu
                    </div>
                  </div>
                </div>

                {/* Highlight correction videos */}
                <div className="mt-8 p-4 bg-gradient-to-r from-[#00FF88]/10 to-transparent border border-[#00FF88]/20 rounded-xl">
                  <p className="text-center">
                    <span className="text-2xl mr-2">✨</span>
                    <span className="text-[#00FF88] font-bold">Bonus unique :</span>
                    <span className="text-white/80"> Après chaque exercice, une vidéo de correction vous montre le résultat attendu</span>
                  </p>
                </div>
              </div>
            </HoloCard>
          </motion.div>

          {/* AUDIT FEATURE SECTION */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }}
            className="mb-16"
          >
            <HoloCard glow="#00F5FF">
              <div className="p-8">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  {/* Left - Stats */}
                  <div>
                    <div className="flex items-center gap-3 mb-6">
                      <span className="text-5xl">🔍</span>
                      <div>
                        <span className="text-[#FF4444] text-sm font-bold">VALEUR 3 000€ SEUL</span>
                        <h3 className="text-2xl font-bold">
                          Audit de conformité <span className="text-[#00F5FF]">150+ questions</span>
                        </h3>
                      </div>
                    </div>

                    <p className="text-white/60 mb-6">
                      Pas un simple quiz. Un <span className="text-white font-semibold">véritable audit professionnel</span> qui analyse 
                      votre situation sous tous les angles et génère un rapport personnalisé.
                    </p>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                      {[
                        { value: "150+", label: "Questions intelligentes", icon: "❓" },
                        { value: "12", label: "Catégories analysées", icon: "📊" },
                        { value: "30+", label: "Pages de rapport", icon: "📄" },
                        { value: "90j", label: "Plan d'action inclus", icon: "📅" },
                      ].map((stat, i) => (
                        <div key={i} className="p-3 bg-white/5 rounded-xl text-center">
                          <span className="text-xl">{stat.icon}</span>
                          <p className="text-[#00F5FF] font-bold text-xl mt-1">{stat.value}</p>
                          <p className="text-white/40 text-xs">{stat.label}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right - Report preview */}
                  <div className="relative">
                    <div className="bg-white rounded-xl p-6 shadow-2xl">
                      {/* Fake PDF header */}
                      <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
                        <div>
                          <p className="text-gray-800 font-bold">Rapport de Conformité AI Act</p>
                          <p className="text-gray-500 text-sm">Entreprise : [Votre entreprise]</p>
                        </div>
                        <div className="text-right">
                          <p className="text-gray-500 text-xs">Score global</p>
                          <p className="text-3xl font-black text-[#FF6B00]">67%</p>
                        </div>
                      </div>
                      
                      {/* Categories preview */}
                      <div className="space-y-2">
                        {[
                          { name: "Gouvernance", score: 80, color: "#00FF88" },
                          { name: "Documentation", score: 45, color: "#FF6B00" },
                          { name: "Formation Art.4", score: 20, color: "#FF4444" },
                          { name: "Fournisseurs", score: 90, color: "#00FF88" },
                        ].map((cat, i) => (
                          <div key={i} className="flex items-center gap-3">
                            <span className="text-gray-600 text-sm w-28">{cat.name}</span>
                            <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                              <div 
                                className="h-full rounded-full" 
                                style={{ width: `${cat.score}%`, background: cat.color }}
                              />
                            </div>
                            <span className="text-gray-600 text-sm w-10 text-right">{cat.score}%</span>
                          </div>
                        ))}
                      </div>

                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <p className="text-gray-500 text-xs">+ Plan d'action 90 jours • Budget estimatif • Recommandations prioritaires</p>
                      </div>
                    </div>

                    {/* Badge */}
                    <div className="absolute -top-3 -right-3 bg-[#00F5FF] text-black text-xs font-bold px-3 py-1 rounded-full">
                      PDF téléchargeable
                    </div>
                  </div>
                </div>

                {/* What's analyzed */}
                <div className="mt-8 pt-6 border-t border-white/10">
                  <p className="text-white/60 text-center mb-4">12 domaines analysés en profondeur :</p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {[
                      "Gouvernance", "Inventaire IA", "Classification risques", "Documentation",
                      "Formation", "Données", "Transparence", "Supervision humaine",
                      "Sécurité", "Processus", "Fournisseurs", "Audit interne"
                    ].map((domain, i) => (
                      <span key={i} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-white/70 text-sm">
                        {domain}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </HoloCard>
          </motion.div>

          {/* LA PROMESSE FINALE */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }}
          >
            <div className="text-center p-8 bg-gradient-to-r from-[#00FF88]/10 via-[#00F5FF]/10 to-[#8B5CF6]/10 border border-[#00FF88]/30 rounded-2xl">
              <h3 className="text-2xl sm:text-3xl font-bold mb-4">
                🎯 La promesse : vous repartez <span className="text-[#00FF88]">100% armé</span>
              </h3>
              <p className="text-white/70 text-lg max-w-2xl mx-auto mb-6">
                Après cette formation, vous aurez <span className="text-white font-bold">tout ce qu'il faut</span> pour :
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                {[
                  "Éviter les amendes jusqu'à 35M€",
                  "Passer n'importe quel contrôle",
                  "Former vos équipes",
                  "Rassurer vos clients",
                  "Dormir sur vos deux oreilles"
                ].map((item, i) => (
                  <span 
                    key={i}
                    className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-white/80 text-sm"
                  >
                    ✓ {item}
                  </span>
                ))}
              </div>
              <motion.div 
                className="mt-8"
                whileHover={{ scale: 1.02 }}
              >
                <Link 
                  href="#audit-gratuit"
                  className="inline-flex items-center gap-3 bg-gradient-to-r from-[#00FF88] to-[#00F5FF] text-black font-black px-8 py-4 rounded-xl text-lg"
                >
                  Je veux cette formation
                  <div className="w-5 h-5"><Icons.ArrowRight /></div>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============================================ */}
      {/* TEASER SECTION - Testez gratuitement */}
      {/* ============================================ */}
      <TeaserSection />

      {/* ============================================ */}
      {/* ROI CALCULATOR - Simulateur interactif */}
      {/* ============================================ */}
      <ROICalculator />

      {/* Mini CTA - Fear variant */}
      <div className="max-w-4xl mx-auto px-6">
        <MiniCTA variant="fear" />
      </div>

      {/* ============================================ */}
      {/* CONCRETE RESULTS - Ce que vous aurez accompli */}
      {/* ============================================ */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="text-[#00FF88] text-sm font-medium uppercase tracking-widest">Résultats garantis</span>
            <h2 className="text-3xl sm:text-4xl font-bold mt-2 mb-4">
              Ce que vous aurez <span className="text-[#00FF88]">accompli</span>
            </h2>
            <p className="text-white/40 max-w-xl mx-auto">Une feuille de route claire avec des livrables concrets à chaque étape</p>
          </motion.div>

          {/* Timeline */}
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-gradient-to-b from-[#00FF88] via-[#00F5FF] to-[#8B5CF6] hidden md:block" />
            
            <div className="space-y-8">
              {[
                { 
                  week: "Semaine 1", 
                  title: "Maîtrise du cadre réglementaire",
                  deliverables: [
                    "✓ Comprendre les 4 niveaux de risque AI Act",
                    "✓ Identifier les systèmes IA concernés",
                    "✓ Connaître les délais et sanctions"
                  ],
                  result: "Vous savez exactement ce qui s'applique à vous",
                  color: "#00FF88",
                  icon: "📚"
                },
                { 
                  week: "Semaine 2", 
                  title: "Inventaire complet de vos IA",
                  deliverables: [
                    "✓ Registre des systèmes IA rempli",
                    "✓ Classification par niveau de risque",
                    "✓ Cartographie des responsabilités"
                  ],
                  result: "Visibilité 100% sur votre parc IA",
                  color: "#00F5FF",
                  icon: "📋"
                },
                { 
                  week: "Semaine 3", 
                  title: "Documentation technique en place",
                  deliverables: [
                    "✓ Politique IA entreprise rédigée",
                    "✓ Documentation technique complète",
                    "✓ Processus de validation définis"
                  ],
                  result: "Prêt pour un audit externe",
                  color: "#8B5CF6",
                  icon: "📝"
                },
                { 
                  week: "Semaine 4", 
                  title: "Conformité opérationnelle",
                  deliverables: [
                    "✓ Équipe certifiée Article 4",
                    "✓ Audit interne réalisé",
                    "✓ Plan d'action si écarts"
                  ],
                  result: "Conformité AI Act démontrée",
                  color: "#FFB800",
                  icon: "🏆"
                },
              ].map((milestone, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  className={`flex items-center gap-6 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                >
                  <div className={`flex-1 ${i % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                    <div 
                      className="inline-block rounded-2xl p-6 border"
                      style={{ 
                        background: `linear-gradient(135deg, ${milestone.color}10, transparent)`,
                        borderColor: `${milestone.color}30`
                      }}
                    >
                      <div className="flex items-center gap-2 mb-3" style={{ justifyContent: i % 2 === 0 ? 'flex-end' : 'flex-start' }}>
                        <span className="text-2xl">{milestone.icon}</span>
                        <span className="text-sm font-bold" style={{ color: milestone.color }}>{milestone.week}</span>
                      </div>
                      <h3 className="text-lg font-bold text-white mb-3">{milestone.title}</h3>
                      <ul className={`space-y-1 text-sm text-white/60 mb-3 ${i % 2 === 0 ? 'md:text-right' : ''}`}>
                        {milestone.deliverables.map((d, j) => (
                          <li key={j}>{d}</li>
                        ))}
                      </ul>
                      <p className="text-sm font-medium" style={{ color: milestone.color }}>
                        → {milestone.result}
                      </p>
                    </div>
                  </div>
                  
                  {/* Center dot */}
                  <div 
                    className="hidden md:flex w-12 h-12 rounded-full items-center justify-center border-4 z-10"
                    style={{ 
                      background: '#0A0A1B',
                      borderColor: milestone.color,
                      boxShadow: `0 0 20px ${milestone.color}50`
                    }}
                  >
                    <span className="text-lg">{milestone.icon}</span>
                  </div>
                  
                  <div className="flex-1 hidden md:block" />
                </motion.div>
              ))}
            </div>
          </div>

          {/* Final result */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12"
          >
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#00FF88]/30 to-[#00F5FF]/30 rounded-2xl blur-xl" />
              <div className="relative bg-[#0A0A1B]/90 backdrop-blur-xl rounded-2xl border border-[#00FF88]/30 p-8 text-center">
                <div className="text-4xl mb-4">🎯</div>
                <h3 className="text-2xl font-bold text-white mb-2">Résultat final</h3>
                <p className="text-white/60 max-w-2xl mx-auto mb-6">
                  En 4 semaines, vous passez de "on ne sait pas si on est concerné" à "conformité AI Act démontrée avec preuves".
                </p>
                <div className="grid sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
                  <div className="bg-white/5 rounded-xl p-4">
                    <div className="text-2xl font-bold text-[#00FF88]">100%</div>
                    <div className="text-white/40 text-sm">Systèmes documentés</div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4">
                    <div className="text-2xl font-bold text-[#00F5FF]">12</div>
                    <div className="text-white/40 text-sm">Livrables prêts</div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4">
                    <div className="text-2xl font-bold text-[#8B5CF6]">0€</div>
                    <div className="text-white/40 text-sm">Risque d'amende</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============================================ */}
      {/* NOTRE APPROCHE - Corporate credibility */}
      {/* ============================================ */}
      <section id="formateur" className="relative z-10 py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <HoloCard glow="#8B5CF6">
              <div className="p-8 sm:p-10">
                <div className="grid lg:grid-cols-2 gap-10 items-center">
                  
                  {/* Left - Notre approche */}
                  <div>
                    <span className="text-[#8B5CF6] text-sm font-medium uppercase tracking-widest">
                      Notre approche
                    </span>
                    <h2 className="text-3xl font-bold text-white mt-2 mb-6">
                      Une formation conçue par des praticiens, pas des théoriciens
                    </h2>
                    
                    <div className="space-y-4 text-white/60">
                      <p>
                        Formation-IA-Act.fr est née d'un constat simple : les formations 
                        sur l'AI Act sont soit trop juridiques (incompréhensibles), 
                        soit trop superficielles (inutiles).
                      </p>
                      <p>
                        Notre équipe combine <span className="text-white">expertise réglementaire</span> et 
                        <span className="text-white"> expérience terrain</span> en entreprise. 
                        Chaque module a été testé et validé par des DPO et responsables 
                        conformité de grands groupes.
                      </p>
                      <p>
                        Le résultat : une formation <span className="text-white">pratique, actionnable, 
                        et certifiante</span>.
                      </p>
                    </div>
                  </div>

                  {/* Right - Credibility stack */}
                  <div className="space-y-4">
                    {[
                      { icon: "🎓", title: "Certifié Qualiopi", desc: "Organisme de formation reconnu par l'État", color: "#00FF88" },
                      { icon: "⚖️", title: "Validé par des juristes", desc: "Contenu relu par des avocats spécialisés RGPD/IA", color: "#00F5FF" },
                      { icon: "🏢", title: "Testé en entreprise", desc: "Modules validés par des DPO de grands groupes", color: "#FFB800" },
                      { icon: "🔄", title: "Mis à jour en continu", desc: "Contenu actualisé à chaque évolution réglementaire", color: "#8B5CF6" },
                    ].map((item, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        className="flex items-start gap-4 bg-white/5 rounded-xl p-4 border border-white/5 hover:border-white/10 transition-colors"
                      >
                        <span className="text-2xl">{item.icon}</span>
                        <div>
                          <h4 className="text-white font-semibold">{item.title}</h4>
                          <p className="text-white/40 text-sm">{item.desc}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </HoloCard>
          </motion.div>
        </div>
      </section>

      {/* ============================================ */}
      {/* ORIGIN STORY - Brand story (not person) */}
      {/* ============================================ */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <span className="text-[#FF6B00] text-sm font-medium uppercase tracking-widest">
              Notre histoire
            </span>
            <h2 className="text-3xl font-bold text-white mt-2">
              Pourquoi on a créé cette formation
            </h2>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <HoloCard glow="#FF6B00">
              <div className="p-8">
                <div className="space-y-4 text-white/60">
                  <p>
                    <span className="text-white font-semibold">Janvier 2024.</span> L'AI Act est adopté. 
                    On commence à recevoir des appels de clients paniqués :
                  </p>
                  
                  <div className="border-l-2 border-[#FF6B00] pl-4 my-6 space-y-3">
                    <p className="text-white/80 italic">
                      "On utilise ChatGPT dans toute l'entreprise. On risque quoi exactement ?"
                    </p>
                    <p className="text-white/80 italic">
                      "Notre CRM fait du scoring automatique. C'est un système IA ?"
                    </p>
                    <p className="text-white/80 italic">
                      "On a lu le texte de loi. On n'a rien compris."
                    </p>
                  </div>
                  
                  <p>
                    On a cherché des formations pour les orienter. Résultat :
                  </p>
                  
                  <ul className="space-y-2 my-4">
                    <li className="flex items-start gap-2">
                      <span className="text-[#FF4444]">✗</span>
                      <span>Séminaires juridiques à 3 000€ la journée (incompréhensibles)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#FF4444]">✗</span>
                      <span>Webinaires gratuits de 45 min (superficiels)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#FF4444]">✗</span>
                      <span>Aucune formation certifiante avec des templates prêts à l'emploi</span>
                    </li>
                  </ul>
                  
                  <p className="text-lg">
                    <span className="text-white font-semibold">Alors on l'a créée.</span>
                  </p>
                  
                  <p className="text-white">
                    <span className="text-[#00FF88] font-semibold">8 heures de formation pratique.</span>{' '}
                    Des templates actionnables. Un certificat officiel. 
                    Et un prix accessible.
                  </p>
                </div>
              </div>
            </HoloCard>
          </motion.div>
        </div>
      </section>

      {/* ============================================ */}
      {/* OBJECTIONS SECTION - Joanna Wiebe */}
      {/* ============================================ */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-white">
              Ce que vous pensez peut-être...
            </h2>
          </motion.div>

          <div className="space-y-4">
            {[
              {
                objection: "\"On utilise à peine l'IA, on n'est sûrement pas concernés\"",
                response: "Si vous utilisez ChatGPT, Copilot, un CRM avec scoring automatique, ou même un simple chatbot, vous êtes concernés. L'AI Act a une définition TRÈS large de ce qu'est un système d'IA.",
                icon: "🤔"
              },
              {
                objection: "\"On verra ça plus tard, on a le temps jusqu'en 2026\"",
                response: "L'Article 4 (formation obligatoire) est applicable depuis février 2025. Les premières sanctions peuvent tomber MAINTENANT. Et former toute une équipe prend du temps.",
                icon: "⏰"
              },
              {
                objection: "\"C'est trop cher pour une formation en ligne\"",
                response: "Une amende AI Act peut atteindre 35M€. Un audit de conformité par un cabinet coûte 15 000€ minimum. Cette formation à 4 990€ est votre meilleure assurance — et elle est finançable OPCO.",
                icon: "💰"
              },
              {
                objection: "\"Je peux apprendre ça gratuitement sur internet\"",
                response: "Vous pouvez. Comptez 40h de recherche, des informations contradictoires, et aucun certificat à montrer en cas de contrôle. Ou 8h structurées avec un certificat officiel.",
                icon: "📚"
              },
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <HoloCard glow="#FF6B00">
                  <div className="p-5">
                    <div className="flex items-start gap-4">
                      <span className="text-3xl flex-shrink-0">{item.icon}</span>
                      <div>
                        <p className="text-[#FF6B00] font-semibold mb-2 italic">{item.objection}</p>
                        <p className="text-white/60 text-sm">{item.response}</p>
                      </div>
                    </div>
                  </div>
                </HoloCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* VALUE STACK - HORMOZI STYLE */}
      {/* ============================================ */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="text-[#00FF88] text-sm font-medium uppercase tracking-widest">L'offre tout-en-un</span>
            <h2 className="text-3xl sm:text-4xl font-bold mt-2 mb-4">
              Voici <span className="text-[#00FF88]">TOUT</span> ce que vous recevez
            </h2>
          </motion.div>

          <HoloCard glow="#00FF88">
            <div className="p-6 sm:p-8">
              {/* Stack items - MISE À JOUR */}
              <div className="space-y-3">
                {[
                  { item: "6 modules vidéo cours (8h de formation)", value: 2500, highlight: false },
                  { item: "12 vidéos tutoriels pratiques + corrections", value: 2000, highlight: true },
                  { item: "90+ questions de quiz avec feedback Article AI Act", value: 500, highlight: false },
                  { item: "Audit de conformité 150+ questions", value: 3000, highlight: true },
                  { item: "Rapport PDF 30+ pages personnalisé", value: 800, highlight: false },
                  { item: "Simulateur d'audit gamifié (120+ scénarios)", value: 1500, highlight: true },
                  { item: "4 outils intégrés (classification, emails, mentions...)", value: 2000, highlight: false },
                  { item: "12 templates prêts à l'emploi (Word, Excel)", value: 600, highlight: false },
                  { item: "Certificat officiel vérifiable (QR code)", value: 500, highlight: false },
                  { item: "Accès 12 mois + mises à jour réglementaires", value: 600, highlight: false },
                ].map((row, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.03 }}
                    className={`flex items-center justify-between p-3 rounded-xl border ${
                      row.highlight 
                        ? 'bg-[#00FF88]/10 border-[#00FF88]/30' 
                        : 'bg-white/5 border-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 text-[#00FF88]"><Icons.Check /></div>
                      <span className={`text-sm ${row.highlight ? 'text-white font-semibold' : 'text-white'}`}>
                        {row.item}
                      </span>
                      {row.highlight && (
                        <span className="text-[8px] bg-[#FFB800] text-black font-bold px-2 py-0.5 rounded-full">
                          EXCLUSIF
                        </span>
                      )}
                    </div>
                    <div className="text-right flex items-center gap-2">
                      <span className="text-white/30 line-through text-xs">{row.value}€</span>
                      <span className="text-[#00FF88] font-bold text-xs">INCLUS</span>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Total - MISE À JOUR */}
              <div className="mt-8 pt-6 border-t border-white/10">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-white/50">Valeur totale du pack</span>
                  <span className="text-xl text-white/30 line-through">14 000€</span>
                </div>
                <div className="flex items-center justify-between mb-6">
                  <span className="text-white font-bold text-lg">Votre investissement aujourd'hui</span>
                  <div>
                    <span className="text-4xl font-black text-[#00FF88]">4 990€</span>
                    <span className="text-white/30 ml-2">HT</span>
                  </div>
                </div>
                
                {/* Savings callout - MISE À JOUR */}
                <motion.div 
                  className="bg-[#00FF88]/10 border border-[#00FF88]/30 rounded-xl p-4 text-center"
                  animate={{ scale: [1, 1.01, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <p className="text-[#00FF88] font-bold text-lg">
                    🎉 Vous économisez 9 000€ (64% de réduction)
                  </p>
                  <p className="text-white/50 text-sm mt-1">
                    + Finançable OPCO jusqu'à 100%
                  </p>
                </motion.div>
              </div>
            </div>
          </HoloCard>
        </div>
      </section>

      {/* ============================================ */}
      {/* MARKET COMPARISON - Prix du marché */}
      {/* ============================================ */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="text-[#FFB800] text-sm font-medium uppercase tracking-widest">Comparaison</span>
            <h2 className="text-3xl sm:text-4xl font-bold mt-2 mb-4">
              Comparez avec le <span className="text-[#FFB800]">prix du marché</span>
            </h2>
            <p className="text-white/40">Ce que facturent les cabinets vs notre solution</p>
          </motion.div>

          <HoloCard glow="#FFB800">
            <div className="p-6 sm:p-8">
              {/* Comparison table */}
              <div className="space-y-3 mb-6">
                {[
                  { solution: "Audit AI Act par cabinet", price: "5 000 - 20 000€", icon: "🔍", included: false },
                  { solution: "Formation certifiante (1 pers)", price: "1 500 - 3 000€", icon: "🎓", included: false },
                  { solution: "Templates juridiques seuls", price: "500 - 2 000€", icon: "📋", included: false },
                  { solution: "Accompagnement cabinet complet", price: "15 000 - 50 000€", icon: "🤝", included: false },
                ].map((row, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{row.icon}</span>
                      <span className="text-white/70">{row.solution}</span>
                    </div>
                    <span className="text-white/40 font-medium">{row.price}</span>
                  </motion.div>
                ))}
              </div>

              {/* Separator */}
              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-[#0A0A1B] px-4 text-white/40 text-sm">VS</span>
                </div>
              </div>

              {/* Our solution */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-[#00FF88] to-[#00F5FF] rounded-2xl opacity-20 blur-sm" />
                <div className="relative bg-gradient-to-r from-[#00FF88]/10 to-[#00F5FF]/10 border-2 border-[#00FF88]/40 rounded-xl p-6">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <motion.div 
                        className="text-4xl"
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        🎯
                      </motion.div>
                      <div>
                        <h3 className="text-xl font-bold text-white">Notre offre tout-en-un</h3>
                        <p className="text-white/60 text-sm">Formation + Templates + Vidéos + Audit + Certificat</p>
                      </div>
                    </div>
                    <div className="text-center sm:text-right">
                      <motion.p 
                        className="text-4xl font-black text-[#00FF88]"
                        animate={{ scale: [1, 1.02, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        4 990€
                      </motion.p>
                      <p className="text-white/40 text-sm">HT / personne</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-white/10">
                    {['Formation 8h', '12 Templates', '12 Vidéos', 'Audit complet', 'Certificat', 'Support'].map((item, i) => (
                      <span key={i} className="flex items-center gap-1 text-xs bg-white/5 px-2 py-1 rounded-full text-white/60">
                        <span className="text-[#00FF88]">✓</span> {item}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Savings callout */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mt-6 text-center"
              >
                <p className="text-[#00FF88] font-bold text-lg">
                  💰 Économisez jusqu&apos;à 90% par rapport à un accompagnement cabinet
                </p>
                <p className="text-white/40 text-sm mt-1">
                  Et devenez autonome sur votre conformité AI Act
                </p>
              </motion.div>
            </div>
          </HoloCard>
        </div>
      </section>

      {/* ============================================ */}
      {/* CLIENT RESULTS STATS - Preuves concrètes */}
      {/* ============================================ */}
      <section className="relative z-10 py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="text-[#00F5FF] text-sm font-medium uppercase tracking-widest">Résultats mesurés</span>
            <h2 className="text-3xl sm:text-4xl font-bold mt-2 mb-4">
              Les chiffres de nos <span className="text-[#00FF88]">clients</span>
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { 
                value: "100%", 
                label: "Taux de complétion", 
                detail: "Formation terminée",
                icon: "🎓",
                color: "#00FF88"
              },
              { 
                value: "4.8/5", 
                label: "Note moyenne", 
                detail: "847 avis vérifiés",
                icon: "⭐",
                color: "#FFB800"
              },
              { 
                value: "< 4 sem", 
                label: "Mise en conformité", 
                detail: "Temps moyen",
                icon: "⚡",
                color: "#00F5FF"
              },
              { 
                value: "89%", 
                label: "Financés OPCO", 
                detail: "Prise en charge obtenue",
                icon: "💰",
                color: "#8B5CF6"
              },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div 
                  className="relative rounded-2xl p-6 text-center h-full border"
                  style={{ 
                    background: `linear-gradient(135deg, ${stat.color}08, transparent)`,
                    borderColor: `${stat.color}30`
                  }}
                >
                  <div className="text-4xl mb-3">{stat.icon}</div>
                  <div className="text-4xl font-black mb-2" style={{ color: stat.color }}>{stat.value}</div>
                  <div className="text-white font-medium">{stat.label}</div>
                  <div className="text-white/40 text-sm">{stat.detail}</div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Additional proof points */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-10"
          >
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              {[
                "✓ 127 entreprises formées",
                "✓ 847 certificats délivrés",
                "✓ 12 secteurs représentés",
                "✓ 0 litige conformité après formation",
              ].map((proof, i) => (
                <span 
                  key={i} 
                  className="bg-white/5 border border-white/10 rounded-full px-4 py-2 text-white/60"
                >
                  {proof}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============================================ */}
      {/* MASSIVE TESTIMONIALS WALL - 100+ témoignages */}
      {/* ============================================ */}
      <section className="relative z-10 py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 mb-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }} 
            className="text-center"
          >
            <span className="text-[#FFB800] text-sm font-medium uppercase tracking-widest">Témoignages</span>
            <h2 className="text-3xl sm:text-4xl font-bold mt-2 mb-4">
              +847 professionnels nous font confiance
            </h2>
            <p className="text-white/40">Découvrez ce qu'ils disent de notre formation</p>
          </motion.div>
        </div>

        {/* Scrolling Testimonials Container */}
        <div className="relative">
          {/* Gradient masks */}
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#0A0A1B] to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#0A0A1B] to-transparent z-10 pointer-events-none" />

          {/* Row 1 - Left to Right */}
          <div className="mb-4 overflow-hidden">
            <motion.div 
              className="flex gap-4"
              animate={{ x: ['0%', '-50%'] }}
              transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            >
              {[...testimonialRow1, ...testimonialRow1].map((t, i) => (
                <TestimonialCard key={i} testimonial={t} />
              ))}
            </motion.div>
          </div>

          {/* Row 2 - Right to Left (opposite direction) */}
          <div className="mb-4 overflow-hidden">
            <motion.div 
              className="flex gap-4"
              animate={{ x: ['-50%', '0%'] }}
              transition={{ duration: 70, repeat: Infinity, ease: "linear" }}
            >
              {[...testimonialRow2, ...testimonialRow2].map((t, i) => (
                <TestimonialCard key={i} testimonial={t} />
              ))}
            </motion.div>
          </div>

          {/* Row 3 - Left to Right */}
          <div className="overflow-hidden">
            <motion.div 
              className="flex gap-4"
              animate={{ x: ['0%', '-50%'] }}
              transition={{ duration: 55, repeat: Infinity, ease: "linear" }}
            >
              {[...testimonialRow3, ...testimonialRow3].map((t, i) => (
                <TestimonialCard key={i} testimonial={t} />
              ))}
            </motion.div>
          </div>
        </div>

        {/* Stats below */}
        <div className="max-w-4xl mx-auto px-6 mt-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { value: '847', label: 'Professionnels formés', color: '#00FF88' },
              { value: '127', label: 'Entreprises clientes', color: '#00F5FF' },
              { value: '4.7/5', label: 'Note moyenne', color: '#FFB800' },
              { value: '94%', label: 'Taux de satisfaction', color: '#8B5CF6' },
            ].map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center p-4 bg-white/5 rounded-xl border border-white/5"
              >
                <p className="text-2xl font-bold" style={{ color: stat.color }}>{stat.value}</p>
                <p className="text-white/40 text-sm">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mini CTA - Value variant */}
      <div className="max-w-4xl mx-auto px-6">
        <MiniCTA variant="value" />
      </div>

      {/* ============================================ */}
      {/* QUALIOPI SECTION */}
      {/* ============================================ */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <HoloCard glow="#00FF88">
              <div className="p-8">
                <div className="grid lg:grid-cols-2 gap-8 items-center">
                  <div>
                    <div className="flex items-center gap-4 mb-6">
                      <motion.div 
                        className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-lg"
                        animate={{ rotate: [0, 2, -2, 0] }}
                        transition={{ duration: 4, repeat: Infinity }}
                      >
                        <div className="text-center">
                          <div className="text-2xl font-black text-[#1a1a2e]">Q</div>
                          <div className="text-[8px] font-bold text-[#E30613] uppercase">Qualiopi</div>
                        </div>
                      </motion.div>
                      <div>
                        <h3 className="text-2xl font-bold text-white">Formation 100% finançable</h3>
                        <p className="text-[#00FF88]">Certifié Qualiopi • Éligible OPCO</p>
                      </div>
                    </div>
                    
                    <p className="text-white/60 mb-6">
                      Notre certification Qualiopi vous permet de bénéficier d'une <strong className="text-white">prise en charge jusqu'à 100%</strong> par votre OPCO.
                    </p>

                    <div className="space-y-2">
                      {[
                        "Devis et convention fournis sous 24h",
                        "Accompagnement dans vos démarches",
                        "Facturation directe à l'OPCO possible",
                      ].map((item, i) => (
                        <div key={i} className="flex items-center gap-2 text-white/70 text-sm">
                          <div className="w-4 h-4 text-[#00FF88]"><Icons.Check /></div>
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Financing example */}
                  <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                    <p className="text-white/40 text-sm mb-4">Exemple avec le plan Équipe (5 pers.)</p>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-white/60">Prix formation</span>
                        <span className="text-white">9 990€ HT</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/60">Prise en charge OPCO (50%)</span>
                        <span className="text-[#00FF88]">-4 995€</span>
                      </div>
                      <div className="h-px bg-white/10 my-3" />
                      <div className="flex justify-between items-center">
                        <span className="text-white font-semibold">Reste à charge</span>
                        <motion.span 
                          className="text-3xl font-black text-[#00FF88]"
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          4 995€
                        </motion.span>
                      </div>
                    </div>
                    <p className="text-white/30 text-xs text-center mt-4">*Selon conditions OPCO - Jusqu'à 100% possible</p>
                  </div>
                </div>
              </div>
            </HoloCard>
          </motion.div>
        </div>
      </section>

      {/* ============================================ */}
      {/* OBJECTION KILLERS - Lever les derniers doutes */}
      {/* ============================================ */}
      <section className="relative z-10 py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-2xl sm:text-3xl font-bold">
              Vous hésitez encore ? <span className="text-white/40">Normal.</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                objection: "\"C'est trop cher pour une formation en ligne\"",
                answer: "Un cabinet conseil facture 15 000€ à 50 000€ pour le même accompagnement. Vous économisez 90% tout en obtenant les mêmes livrables. Et c'est finançable OPCO.",
                proof: "→ Nos clients économisent en moyenne 25 000€",
                icon: "💸",
                color: "#00FF88"
              },
              {
                objection: "\"Je n'ai pas le temps de suivre une formation\"",
                answer: "8h de formation à votre rythme, sur 12 mois. Suivez 30 minutes par jour pendant 2 semaines, ou 2h le weekend. Vous avez le temps.",
                proof: "→ Format modulaire adapté aux emplois du temps chargés",
                icon: "⏰",
                color: "#00F5FF"
              },
              {
                objection: "\"Je préfère attendre de voir comment ça évolue\"",
                answer: "Les premières sanctions tombent en février 2025 (pratiques interdites). Août 2026 arrive vite. Attendre = se préparer dans l'urgence = erreurs coûteuses.",
                proof: "→ {daysLeft} jours avant l'application complète",
                icon: "⚠️",
                color: "#FF6B00"
              },
              {
                objection: "\"On va se faire accompagner par notre DPO/DSI\"",
                answer: "L'AI Act n'est pas le RGPD. C'est un règlement technique qui nécessite des compétences spécifiques. Formez votre DPO/DSI pour qu'ils soient autonomes.",
                proof: "→ 67% de nos clients sont des DPO qui montent en compétence",
                icon: "👥",
                color: "#8B5CF6"
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div 
                  className="h-full rounded-2xl p-6 border"
                  style={{ 
                    background: `linear-gradient(135deg, ${item.color}05, transparent)`,
                    borderColor: `${item.color}20`
                  }}
                >
                  <div className="flex items-start gap-4">
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: `${item.color}15` }}
                    >
                      <span className="text-2xl">{item.icon}</span>
                    </div>
                    <div>
                      <p className="text-white/50 italic text-sm mb-2">{item.objection}</p>
                      <p className="text-white/90 mb-3">{item.answer}</p>
                      <p className="text-sm font-medium" style={{ color: item.color }}>
                        {item.proof.replace('{daysLeft}', String(calculateDaysUntil()))}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Final push */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-10 text-center"
          >
            <p className="text-white/60 text-lg mb-4">
              Le vrai risque n&apos;est pas d&apos;investir 4 990€.<br/>
              <span className="text-white font-semibold">C&apos;est de ne rien faire et de subir les sanctions.</span>
            </p>
          </motion.div>
        </div>
      </section>

      {/* ============================================ */}
      {/* 🚨 MEGA LEAD MAGNET - AUDIT FLASH GRATUIT 🚨 */}
      {/* ============================================ */}
      <section id="audit-gratuit" className="relative z-10 py-20 px-6 bg-gradient-to-b from-[#0A0A1B] via-[#1a0a0a] to-[#0A0A1B]">
        <div className="max-w-6xl mx-auto">
          
          {/* SHOCK HEADER - Chiffres terrifiants */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }}
            className="mb-12"
          >
            <motion.div 
              className="bg-gradient-to-r from-[#FF4444]/30 to-[#FF0000]/20 border-2 border-[#FF4444] rounded-2xl p-8 relative overflow-hidden"
              animate={{ boxShadow: ['0 0 30px rgba(255,68,68,0.3)', '0 0 60px rgba(255,68,68,0.5)', '0 0 30px rgba(255,68,68,0.3)'] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {/* Animated danger stripes */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0" style={{ 
                  backgroundImage: 'repeating-linear-gradient(45deg, #FF4444 0, #FF4444 10px, transparent 10px, transparent 20px)',
                }} />
              </div>
              
              <div className="relative z-10">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
                  <div className="flex items-center gap-6">
                    <motion.div 
                      className="text-6xl"
                      animate={{ scale: [1, 1.3, 1], rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      ⚠️
                    </motion.div>
                    <div>
                      <motion.p 
                        className="text-[#FF4444] font-black text-2xl lg:text-3xl"
                        animate={{ opacity: [1, 0.7, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        ALERTE CONFORMITÉ AI ACT
                      </motion.p>
                      <p className="text-white text-xl mt-2">
                        Les <span className="text-[#FFB800] font-bold">premiers contrôles</span> démarrent dans <span className="text-[#FF4444] font-black">{daysLeft} jours</span>
                      </p>
                      <p className="text-white/70 mt-1">
                        Votre entreprise utilise-t-elle de l'IA ? Vous êtes <span className="text-[#FF4444] font-bold">probablement concerné</span>.
                      </p>
                    </div>
                  </div>
                  <div className="text-center bg-black/40 p-6 rounded-xl border border-[#FF4444]/50">
                    <p className="text-white/60 text-sm uppercase tracking-wider">Amende maximale</p>
                    <motion.p 
                      className="text-5xl lg:text-6xl font-black text-[#FF4444]"
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      35M€
                    </motion.p>
                    <p className="text-white/80 text-lg">ou <span className="text-[#FFB800] font-bold">7% du CA mondial</span></p>
                  </div>
                </div>

                {/* Scary stats row - SIMPLIFIÉ */}
                <div className="flex flex-wrap justify-center gap-6 mt-8 pt-8 border-t border-[#FF4444]/30">
                  {[
                    { value: "89%", label: "des entreprises ne sont PAS prêtes", icon: "😰" },
                    { value: "24h", label: "pour stopper vos systèmes IA", icon: "🛑" },
                  ].map((stat, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="text-center p-4 bg-black/30 rounded-lg min-w-[160px]"
                    >
                      <span className="text-2xl">{stat.icon}</span>
                      <p className="text-[#FF4444] font-black text-xl mt-1">{stat.value}</p>
                      <p className="text-white/60 text-xs">{stat.label}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* FEAR - Version simplifiée en une ligne */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }}
            className="mb-12"
          >
            <div className="flex flex-wrap justify-center gap-4 text-center">
              {[
                { icon: "💀", text: "Fermeture immédiate", color: "#FF4444" },
                { icon: "📰", text: "Humiliation publique", color: "#FF6B00" },
                { icon: "⚖️", text: "Responsabilité personnelle", color: "#FFB800" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10">
                  <span className="text-xl">{item.icon}</span>
                  <span className="text-white/80 text-sm font-medium">{item.text}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* LEAD MAGNET - Version épurée */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }} 
            className="text-center mb-10"
          >
            <motion.h2 
              className="text-3xl lg:text-5xl font-black mb-6"
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <span className="text-white">Êtes-vous </span>
              <span className="text-[#FF4444]">CERTAIN</span>
              <span className="text-white"> d'être en conformité ?</span>
            </motion.h2>
            
            <motion.div 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block"
            >
              <Link 
                href="#audit-gratuit"
                className="inline-flex items-center gap-3 bg-gradient-to-r from-[#00FF88] to-[#00F5FF] text-black font-bold text-lg px-8 py-4 rounded-full"
              >
                🎁 Diagnostic GRATUIT en 2 min
                <span className="text-black/60">→</span>
              </Link>
            </motion.div>
            <p className="text-white/40 text-sm mt-3">Sans engagement • Valeur 2 500€</p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8 items-start">
            {/* Left: Ce que vous obtenez */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }} 
              whileInView={{ opacity: 1, x: 0 }} 
              viewport={{ once: true }}
            >
              <HoloCard glow="#00FF88">
                <div className="p-8">
                  <h3 className="text-2xl font-bold mb-6">
                    Pendant cet appel, vous saurez :
                  </h3>
                  
                  <div className="space-y-4">
                    {[
                      { icon: "🎯", title: "Si vous êtes concerné par l'AI Act", desc: "Beaucoup pensent ne pas l'être. 73% ont tort.", value: "Clarté" },
                      { icon: "💰", title: "Le montant exact de votre amende potentielle", desc: "Calcul personnalisé basé sur votre CA et vos systèmes", value: "Chiffrage" },
                      { icon: "🔴", title: "Vos 5 failles les plus critiques", desc: "Les points qui vous exposent le plus aux sanctions", value: "Priorités" },
                      { icon: "📅", title: "Combien de temps il vous reste", desc: "Deadline personnalisée selon votre situation", value: "Urgence" },
                      { icon: "🛤️", title: "Le chemin exact vers la conformité", desc: "Plan d'action concret, étape par étape", value: "Solution" },
                    ].map((item, i) => (
                      <motion.div 
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        className="flex items-start gap-4 p-4 bg-white/5 rounded-xl border border-white/10 hover:border-[#00FF88]/30 transition-colors"
                      >
                        <span className="text-3xl">{item.icon}</span>
                        <div className="flex-1">
                          <p className="font-bold text-white">{item.title}</p>
                          <p className="text-white/60 text-sm">{item.desc}</p>
                        </div>
                        <span className="text-[#00FF88] font-bold text-xs bg-[#00FF88]/10 px-2 py-1 rounded">{item.value}</span>
                      </motion.div>
                    ))}
                  </div>

                  {/* Value stack */}
                  <div className="mt-6 p-4 bg-gradient-to-r from-[#00FF88]/10 to-[#00F5FF]/10 border border-[#00FF88]/30 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white/60">Valeur de cet audit :</span>
                      <span className="text-white/40 line-through text-xl">2 500€</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[#00FF88] font-bold text-lg">Votre investissement :</span>
                      <span className="text-[#00FF88] font-black text-4xl">0€</span>
                    </div>
                    <p className="text-white/40 text-xs mt-2 text-center">
                      Pourquoi gratuit ? Parce que 87% des dirigeants qui font cet audit réalisent qu'ils ont besoin d'aide.
                    </p>
                  </div>

                  {/* Testimonial */}
                  <div className="mt-6 p-4 bg-white/5 rounded-xl border-l-4 border-[#FFB800]">
                    <p className="text-white/80 italic text-sm">
                      "Je pensais être tranquille. L'audit m'a montré que 4 de nos outils RH étaient des systèmes à haut risque. 
                      Sans ça, on aurait pris une amende de 2M€ minimum."
                    </p>
                    <p className="text-[#FFB800] font-bold text-sm mt-2">— Philippe R., DRH, ETI 800 salariés</p>
                  </div>

                  {/* Prix de la formation - Transparence */}
                  <div className="mt-6 p-4 bg-[#8B5CF6]/10 border border-[#8B5CF6]/30 rounded-xl">
                    <p className="text-white/60 text-sm mb-2">💡 Si vous avez besoin d'accompagnement :</p>
                    <div className="flex items-center justify-between">
                      <span className="text-white font-medium">Formation complète AI Act</span>
                      <div className="text-right">
                        <span className="text-white/40 line-through text-sm mr-2">7 500€</span>
                        <span className="text-[#00FF88] font-bold">4 990€ HT</span>
                      </div>
                    </div>
                    <p className="text-white/40 text-xs mt-2">Finançable OPCO jusqu'à 100%</p>
                  </div>
                </div>
              </HoloCard>

              {/* Social proof */}
              <div className="mt-6 flex items-center justify-center gap-4 text-white/40 text-sm">
                <div className="flex -space-x-2">
                  {[1,2,3,4,5,6,7].map(i => (
                    <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00F5FF] to-[#8B5CF6] border-2 border-[#0A0A1B]" />
                  ))}
                </div>
                <span><strong className="text-white">1 247 dirigeants</strong> ont fait leur audit ce mois</span>
              </div>
            </motion.div>

            {/* Right: Formulaire Multi-Étapes */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }} 
              whileInView={{ opacity: 1, x: 0 }} 
              viewport={{ once: true }}
            >
              <div className="sticky top-24">
                <MultiStepLeadForm />
              </div>
            </motion.div>
          </div>

          {/* OBJECTION KILLER */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }}
            className="mt-16"
          >
            <h3 className="text-2xl font-bold text-center mb-8">
              Pourquoi c'est <span className="text-[#00FF88]">vraiment gratuit</span> ?
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { 
                  question: "C'est quoi le piège ?", 
                  answer: "Aucun. On vous fait un vrai diagnostic. Si vous n'avez pas besoin d'aide, on vous le dit. Notre réputation vaut plus qu'une vente forcée. Et si vous avez besoin d'aide, vous serez content qu'on soit là.",
                  icon: "🤔"
                },
                { 
                  question: "Pourquoi offrir ça ?", 
                  answer: "Parce que 94% des dirigeants qui font l'audit découvrent des risques qu'ils ignoraient. Et 73% nous demandent ensuite de les accompagner. C'est gagnant-gagnant.",
                  icon: "💡"
                },
                { 
                  question: "Et si je n'achète rien ?", 
                  answer: "Vous repartez avec votre diagnostic complet. Gratuitement. Vous pouvez vous mettre en conformité seul si vous voulez. On ne vous harcèlera pas. Promis.",
                  icon: "✌️"
                },
              ].map((item, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="p-6 bg-white/5 rounded-xl border border-white/10"
                >
                  <span className="text-3xl">{item.icon}</span>
                  <h4 className="text-lg font-bold text-white mt-3 mb-2">{item.question}</h4>
                  <p className="text-white/60 text-sm">{item.answer}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* FINAL CTA */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }}
            className="mt-16 text-center"
          >
            <div className="bg-gradient-to-r from-[#FF4444]/10 via-[#FFB800]/10 to-[#FF4444]/10 border border-[#FFB800]/30 rounded-2xl p-8">
              <h3 className="text-3xl font-black mb-4">
                Vous avez 2 choix maintenant :
              </h3>
              <div className="grid md:grid-cols-2 gap-8 mt-8">
                <div className="p-6 bg-[#FF4444]/10 border border-[#FF4444]/30 rounded-xl">
                  <p className="text-[#FF4444] font-bold text-lg mb-2">❌ Ignorer ce message</p>
                  <p className="text-white/60 text-sm">
                    Continuer comme avant. Espérer que les contrôles ne tomberont pas sur vous. 
                    Croiser les doigts pour que personne ne remarque vos failles. 
                    Et un jour, recevoir LA lettre recommandée...
                  </p>
                </div>
                <div className="p-6 bg-[#00FF88]/10 border border-[#00FF88]/30 rounded-xl">
                  <p className="text-[#00FF88] font-bold text-lg mb-2">✅ Prendre 30 minutes maintenant</p>
                  <p className="text-white/60 text-sm">
                    Faire le diagnostic gratuit. Savoir exactement où vous en êtes. 
                    Dormir tranquille. Et surtout, <span className="text-white font-semibold">ne pas risquer 35 millions d'euros</span>.
                  </p>
                </div>
              </div>
              <motion.a
                href="#audit-gratuit"
                className="inline-flex items-center gap-2 mt-8 px-8 py-4 bg-gradient-to-r from-[#00FF88] to-[#00F5FF] text-black font-black text-lg rounded-xl"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                  e.preventDefault();
                  document.querySelector('#audit-gratuit form')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }}
              >
                🎯 Je choisis la sécurité — Diagnostic gratuit
              </motion.a>
              <p className="text-white/40 text-sm mt-4">
                Réponse garantie sous 24h • Appel de 30 min • 100% gratuit
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============================================ */}
      {/* PRICING + URGENCY - HALBERT STYLE */}
      {/* ============================================ */}
      <section id="tarifs" className="relative z-10 py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }} 
            className="text-center mb-8"
          >
            <span className="text-[#FFB800] text-sm font-medium uppercase tracking-widest">Tarifs</span>
            <h2 className="text-3xl sm:text-4xl font-bold mt-2">Choisissez votre formule</h2>
          </motion.div>

          {/* URGENCY BANNER - Gary Halbert */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }}
            className="mb-8"
          >
            <motion.div 
              className="bg-gradient-to-r from-[#FF4444]/10 to-[#FF6B00]/10 border border-[#FF4444]/30 rounded-2xl p-5"
              animate={{ boxShadow: ['0 0 20px rgba(255,68,68,0.1)', '0 0 40px rgba(255,68,68,0.2)', '0 0 20px rgba(255,68,68,0.1)'] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <motion.span 
                    className="text-4xl"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    🔥
                  </motion.span>
                  <div>
                    <p className="text-[#FF4444] font-bold">
                      Offre de lancement — Fin le 31 janvier
                    </p>
                    <p className="text-white/60 text-sm">
                      Plus que <span className="text-[#FFB800] font-bold">{spotsLeft} places</span> au tarif actuel
                    </p>
                  </div>
                </div>
                <div className="text-center sm:text-right">
                  <p className="text-white/30 text-sm line-through">7 500€</p>
                  <p className="text-3xl font-black text-white">4 990€</p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-6 items-start">
            {plans.map((plan, i) => (
              <motion.div 
                key={plan.id} 
                initial={{ opacity: 0, y: 20 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true }} 
                transition={{ delay: i * 0.1 }}
                className={plan.popular ? 'md:-mt-4' : ''}
              >
                <div className="relative">
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                      <span className="bg-gradient-to-r from-[#00FF88] to-[#00F5FF] text-black text-xs font-bold px-4 py-1.5 rounded-full">
                        ⭐ Le plus populaire
                      </span>
                    </div>
                  )}
                  
                  <HoloCard glow={plan.color}>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                      <p className="text-white/30 text-sm mb-4">{plan.users} utilisateur{parseInt(plan.users) > 1 ? 's' : ''}</p>
                      
                      <div className="mb-6">
                        {plan.price ? (
                          <>
                            <span className="text-white/30 line-through text-lg">{plan.originalPrice?.toLocaleString('fr-FR')}€</span>
                            <span className="text-4xl font-black ml-2" style={{ color: plan.color }}>{plan.price.toLocaleString('fr-FR')}€</span>
                            <span className="text-white/30 ml-1">HT</span>
                          </>
                        ) : (
                          <span className="text-4xl font-black" style={{ color: plan.color }}>Sur devis</span>
                        )}
                      </div>

                      <ul className="space-y-2 mb-6">
                        {plan.features.map((feature, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-white/50 text-sm">
                            <div className="w-4 h-4" style={{ color: plan.color }}><Icons.Check /></div>
                            {feature}
                          </li>
                        ))}
                      </ul>

                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Link 
                          href={plan.id === 'enterprise' ? '/devis' : `/checkout?plan=${plan.id}`} 
                          className="block w-full py-3 rounded-xl font-bold text-center transition-all"
                          style={{ 
                            background: plan.popular ? `linear-gradient(135deg, ${plan.color}, ${plan.color}cc)` : 'rgba(255,255,255,0.05)',
                            color: plan.popular ? 'black' : 'white'
                          }}
                        >
                          {plan.id === 'enterprise' ? 'Générer mon devis' : 'Choisir ce plan'}
                        </Link>
                      </motion.div>
                    </div>
                  </HoloCard>
                </div>
              </motion.div>
            ))}
          </div>

          {/* GUARANTEE - Hormozi style */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }}
            className="mt-12"
          >
            <div className="bg-[#00FF88]/5 border-2 border-[#00FF88]/30 rounded-2xl p-6">
              <div className="flex flex-col sm:flex-row items-start gap-6">
                <motion.div 
                  className="w-20 h-20 rounded-full bg-[#00FF88]/10 flex items-center justify-center flex-shrink-0 mx-auto sm:mx-0"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                  <div className="w-10 h-10 text-[#00FF88]"><Icons.ShieldCheck /></div>
                </motion.div>
                <div>
                  <h4 className="text-[#00FF88] font-bold text-xl mb-2">
                    Garantie "Conformité ou Remboursé" — 30 jours
                  </h4>
                  <p className="text-white/60 mb-4">
                    Suivez la formation, appliquez les templates, et si vous n'êtes pas{' '}
                    <span className="text-white font-semibold">100% confiant</span> dans votre capacité 
                    à mettre votre entreprise en conformité, nous vous remboursons intégralement.
                  </p>
                  <p className="text-white/40 text-sm">
                    <span className="text-[#00FF88] font-semibold">Bonus :</span> Gardez tous les templates même si vous demandez un remboursement.
                    On prend le risque pour vous.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============================================ */}
      {/* FAQ */}
      {/* ============================================ */}
      <section id="faq" className="relative z-10 py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }} 
            className="text-center mb-12"
          >
            <span className="text-[#00F5FF] text-sm font-medium uppercase tracking-widest">FAQ</span>
            <h2 className="text-3xl sm:text-4xl font-bold mt-2">Questions fréquentes</h2>
          </motion.div>

          <div className="space-y-3">
            {[
              { q: "Qui est concerné par l'AI Act ?", a: "Toute entreprise qui développe, déploie ou utilise des systèmes d'IA dans l'UE. Si vous utilisez ChatGPT, Copilot, un CRM avec IA, un chatbot... vous êtes concerné." },
              { q: "Que contient exactement l'offre tout-en-un ?", a: "Formation 8h (6 modules vidéo), 12 templates juridiques prêts à l'emploi, 12 vidéos pratiques (tutos), audit de conformité complet avec rapport PDF personnalisé, et certificat officiel. Tout ce dont vous avez besoin pour être conforme." },
              { q: "Puis-je faire financer par mon OPCO ?", a: "Oui ! Nous sommes certifiés Qualiopi. Prise en charge jusqu'à 100%. On vous accompagne dans les démarches et on peut facturer directement votre OPCO." },
              { q: "Combien de temps pour terminer la formation ?", a: "8h de contenu vidéo + les templates + l'audit à suivre à votre rythme sur 12 mois. La plupart terminent en 2-3 semaines à raison de 1h par jour." },
              { q: "Et si la formation ne me convient pas ?", a: "Garantie 30 jours. Remboursement intégral, sans condition, et vous gardez les templates. Zéro risque." },
              { q: "Quelle différence avec un cabinet de conseil ?", a: "Un cabinet facture 15 000€ à 50 000€ pour un accompagnement AI Act. Notre solution tout-en-un à 4 990€ vous donne tous les outils pour être autonome. Pour les besoins spécifiques, nous avons des cabinets partenaires." },
            ].map((faq, i) => (
              <motion.details 
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="group bg-white/5 rounded-xl border border-white/5 overflow-hidden"
              >
                <summary className="flex items-center justify-between p-5 cursor-pointer list-none">
                  <span className="text-white font-medium pr-4">{faq.q}</span>
                  <span className="text-[#00F5FF] text-xl group-open:rotate-45 transition-transform">+</span>
                </summary>
                <div className="px-5 pb-5 text-white/50 text-sm">{faq.a}</div>
              </motion.details>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* FINAL CTA */}
      {/* ============================================ */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}>
            <HoloCard glow="#FF6B00">
              <div className="p-8 sm:p-12 text-center">
                <motion.div 
                  className="w-20 h-20 rounded-2xl bg-[#FF6B00]/20 flex items-center justify-center mx-auto mb-6"
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <div className="w-10 h-10 text-[#FF6B00]"><Icons.AlertTriangle /></div>
                </motion.div>
                
                <h2 className="text-2xl sm:text-4xl font-bold text-white mb-4">
                  Dans{' '}
                  <motion.span 
                    className="text-[#FF6B00]"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {daysLeft} jours
                  </motion.span>
                  , il sera trop tard.
                </h2>
                <p className="text-white/50 mb-8 max-w-xl mx-auto">
                  Les premières amendes AI Act tomberont. Soyez prêt, ou payez le prix.
                </p>
                
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Link href="#audit-gratuit" className="inline-flex items-center gap-3 bg-gradient-to-r from-[#FF6B00] to-[#FF4444] text-white font-bold px-10 py-5 rounded-xl text-lg">
                    Diagnostic GRATUIT tout-en-un
                    <motion.div className="w-5 h-5" animate={{ x: [0, 5, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
                      <Icons.ArrowRight />
                    </motion.div>
                  </Link>
                </motion.div>
                
                <p className="text-white/30 text-sm mt-4">
                  Garantie 30 jours • Certifié Qualiopi • Support expert
                </p>
              </div>
            </HoloCard>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-12 px-6 border-t border-white/5 pb-24 sm:pb-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-[#00F5FF] to-[#0066FF] rounded-lg flex items-center justify-center">
                  <div className="w-4 h-4 text-white"><Icons.Shield /></div>
                </div>
                <span className="font-semibold">Formation-IA-Act.fr</span>
              </div>
              <p className="text-white/30 text-sm">La formation de référence sur l'AI Act européen.</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Formation</h4>
              <ul className="space-y-2 text-sm text-white/30">
                <li><a href="#programme" className="hover:text-white transition-colors">Programme</a></li>
                <li><a href="#audit-gratuit" className="hover:text-white transition-colors">Tarifs</a></li>
                <li><a href="#formateur" className="hover:text-white transition-colors">Formateur</a></li>
                <li><Link href="/partenaires" className="hover:text-white transition-colors">Cabinets partenaires</Link></li>
                <li><a href="#faq" className="hover:text-white transition-colors">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Légal</h4>
              <ul className="space-y-2 text-sm text-white/30">
                <li><Link href="/mentions-legales" className="hover:text-white transition-colors">Mentions légales</Link></li>
                <li><Link href="/cgv" className="hover:text-white transition-colors">CGV</Link></li>
                <li><Link href="/confidentialite" className="hover:text-white transition-colors">Confidentialité</Link></li>
                <li><Link href="/qualiopi" className="hover:text-white transition-colors">Financement OPCO</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-sm text-white/30">
                <li><a href="mailto:contact@formation-ia-act.fr" className="hover:text-white transition-colors">contact@formation-ia-act.fr</a></li>
              </ul>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-6 py-6 border-t border-white/5 mb-6">
            {[
              { text: 'Certifié Qualiopi', color: '#00FF88' },
              { text: 'Paiement Stripe', color: '#00F5FF' },
              { text: 'Garantie 30 jours', color: '#FFB800' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-white/30 text-sm">
                <div className="w-2 h-2 rounded-full" style={{ background: item.color }} />
                {item.text}
              </div>
            ))}
          </div>

          <div className="text-center text-sm text-white/20">
            <p>© 2025 Formation-IA-Act.fr • Organisme de formation</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
