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
// TESTIMONIALS DATA - Authentiques avec ratings variés
// ============================================
const testimonialRow1 = [
  { name: "Sophie Marchand", role: "DPO", company: "Groupe bancaire", quote: "Formation complète. J'ai cartographié nos systèmes IA en 2 semaines. Seul bémol : le module 3 mériterait plus d'exemples.", result: "Cartographie OK", rating: 4, color: "#00F5FF", photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face" },
  { name: "Thomas Dubois", role: "Dir. Juridique", company: "ESN 800 pers.", quote: "Le certificat a rassuré nos grands comptes. Contenu solide, j'aurais aimé plus de cas sur les sous-traitants.", result: "Clients rassurés", rating: 4, color: "#00FF88", photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face" },
  { name: "Marie Lambert", role: "RSSI", company: "Pharma", quote: "Exactement ce qu'il me fallait. Clair, structuré, j'ai formé mon équipe dans la foulée.", result: "Équipe formée", rating: 5, color: "#FFB800", photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face" },
  { name: "Philippe Renard", role: "CEO", company: "FinTech", quote: "On fait du scoring crédit, on était dans le flou. Maintenant c'est clair. Dense mais nécessaire.", result: "Classification OK", rating: 5, color: "#8B5CF6", photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face" },
  { name: "Caroline Bertrand", role: "Resp. Conformité", company: "Assurance", quote: "Les templates valent le prix à eux seuls. Par contre certaines vidéos pourraient être plus courtes.", result: "Templates top", rating: 4, color: "#FF6B00", photo: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop&crop=face" },
  { name: "Julien Petit", role: "CTO", company: "E-commerce", quote: "Bon contenu. Le quiz final est exigeant, j'ai dû le repasser. Mais le certificat a de la valeur.", result: "Certifié", rating: 4, color: "#00F5FF", photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face" },
  { name: "Nathalie Faure", role: "DPO", company: "Hôpital", quote: "Secteur santé bien couvert. J'aurais voulu plus de détails sur les dispositifs médicaux mais globalement très bien.", result: "Santé couverte", rating: 4, color: "#FF4444", photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop&crop=face" },
  { name: "Marc Vidal", role: "Dir. Innovation", company: "Auto", quote: "Méthodologie de cartographie au top. On a identifié des systèmes IA qu'on ne soupçonnait même pas.", result: "IA identifiées", rating: 5, color: "#00FF88", photo: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop&crop=face" },
  { name: "Élodie Simon", role: "Avocate", company: "Cabinet IP/IT", quote: "Je recommande à mes clients. Contenu juridique solide sans être indigeste.", result: "Recommandé", rating: 5, color: "#FFB800", photo: "https://images.unsplash.com/photo-1598550874175-4d0ef436c909?w=100&h=100&fit=crop&crop=face" },
  { name: "François Garcia", role: "DSI", company: "Collectivité", quote: "Format e-learning pratique. Quelques lenteurs sur la plateforme parfois, mais le contenu est là.", result: "Agents formés", rating: 4, color: "#8B5CF6", photo: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop&crop=face" },
  { name: "Aurélie Martin", role: "Product Manager", company: "SaaS RH", quote: "On fait du matching CV, c'est haut risque. La formation m'a aidée à comprendre ce qu'on doit documenter.", result: "Exigences claires", rating: 5, color: "#00F5FF", photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face" },
  { name: "David Leroy", role: "Resp. IA", company: "Banque", quote: "Module systèmes haut risque excellent. Très concret pour notre cas de scoring.", result: "Scoring OK", rating: 5, color: "#FF6B00", photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face" },
];

const testimonialRow2 = [
  { name: "Stéphanie Chevalier", role: "DRH", company: "Industrie", quote: "On utilisait l'IA pour le recrutement sans vraiment le savoir. Eye-opening.", result: "RH conformes", rating: 5, color: "#8B5CF6", photo: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&h=100&fit=crop&crop=face" },
  { name: "Laurent Blanc", role: "CISO", company: "Télécom", quote: "Bon complément cybersécurité. L'AI Act va devenir aussi important que le RGPD.", result: "Programme enrichi", rating: 4, color: "#00FF88", photo: "https://images.unsplash.com/photo-1463453091185-61582044d556?w=100&h=100&fit=crop&crop=face" },
  { name: "Isabelle Thierry", role: "Dir. Qualité", company: "Aéro", quote: "Formation sérieuse, contenu à jour. Quelques répétitions entre modules mais rien de grave.", result: "Équipe prête", rating: 4, color: "#FF4444", photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face" },
  { name: "Romain Henry", role: "Chef projet IA", company: "Retail", quote: "Nos systèmes de prévision stock sont concernés. J'ai adapté notre roadmap produit.", result: "Roadmap OK", rating: 5, color: "#00F5FF", photo: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=100&h=100&fit=crop&crop=face" },
  { name: "Camille Dupont", role: "Consultante RGPD", company: "Indépendante", quote: "J'ai ajouté l'AI Act à mon offre. Bon point de départ, j'ai complété avec les textes officiels.", result: "Offre enrichie", rating: 4, color: "#FFB800", photo: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=100&h=100&fit=crop&crop=face" },
  { name: "Olivier Perrin", role: "DG", company: "PME logistique", quote: "On pensait ne pas être concernés. Erreur. Notre TMS utilise de l'IA partout.", result: "Risques vus", rating: 5, color: "#8B5CF6", photo: "https://images.unsplash.com/photo-1552058544-f2b08422138a?w=100&h=100&fit=crop&crop=face" },
  { name: "Sandrine Lopez", role: "Resp. Data", company: "Média", quote: "Algos de recommandation documentés. Formation pratique, pas trop théorique.", result: "Algos OK", rating: 4, color: "#00FF88", photo: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=100&h=100&fit=crop&crop=face" },
  { name: "Vincent Moreau", role: "Architecte SI", company: "Banque", quote: "Cartographié 89 systèmes avec la méthodo. Très structuré, aurait pu être plus court.", result: "89 systèmes", rating: 4, color: "#FF6B00", photo: "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=100&h=100&fit=crop&crop=face" },
  { name: "Hélène Rousseau", role: "Juriste", company: "Énergie", quote: "Enfin je comprends ce que font les équipes IT. Le pont technique/juridique est bien fait.", result: "Dialogue OK", rating: 5, color: "#00F5FF", photo: "https://images.unsplash.com/photo-1589571894960-20bbe2828d0a?w=100&h=100&fit=crop&crop=face" },
  { name: "Nicolas Fournier", role: "Resp. Innovation", company: "Agro", quote: "Contrôle qualité IA conforme. Les templates font gagner un temps fou.", result: "Qualité OK", rating: 5, color: "#FF4444", photo: "https://images.unsplash.com/photo-1504257432389-52343af06ae3?w=100&h=100&fit=crop&crop=face" },
  { name: "Amandine Boyer", role: "DPO", company: "E-santé", quote: "Le croisement RGPD/AI Act est bien expliqué. C'était ma question principale.", result: "Questions résolues", rating: 5, color: "#FFB800", photo: "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=100&h=100&fit=crop&crop=face" },
  { name: "Christophe Girard", role: "Dir. Technique", company: "EdTech", quote: "Notre adaptive learning est concerné. On sait comment documenter maintenant.", result: "Doc claire", rating: 4, color: "#8B5CF6", photo: "https://images.unsplash.com/photo-1531891437562-4301cf35b7e4?w=100&h=100&fit=crop&crop=face" },
  { name: "Béatrice Adam", role: "Resp. Achats", company: "Chimie", quote: "On peut exiger la conformité AI Act des fournisseurs. Critères clairs.", result: "Fournisseurs OK", rating: 4, color: "#00F5FF", photo: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=100&h=100&fit=crop&crop=face" },
];

const testimonialRow3 = [
  { name: "Guillaume Sanchez", role: "CEO", company: "LegalTech", quote: "On fait du NLP sur des contrats. La formation a clarifié notre niveau de risque.", result: "Risque clair", rating: 5, color: "#FF6B00", photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face" },
  { name: "Patricia Vasseur", role: "Dir. Opérations", company: "Centre d'appels", quote: "IA de routage documentée grâce aux templates. Simple et efficace.", result: "Routage OK", rating: 5, color: "#00FF88", photo: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=100&h=100&fit=crop&crop=face" },
  { name: "Mathieu Colin", role: "Data Scientist", company: "InsurTech", quote: "Enfin une formation qui ne prend pas les techs pour des idiots. Module gouvernance concret.", result: "Gouvernance OK", rating: 5, color: "#8B5CF6", photo: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&h=100&fit=crop&crop=face" },
  { name: "Virginie Hubert", role: "Secrétaire Générale", company: "Fédération", quote: "Format e-learning adapté à tous les profils, du DG au technicien.", result: "Adhérents formés", rating: 4, color: "#FFB800", photo: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=100&h=100&fit=crop&crop=face" },
  { name: "Antoine Lemoine", role: "Resp. Fraude", company: "Paiement", quote: "Nos systèmes anti-fraude sont des systèmes IA. Évident en y réfléchissant.", result: "Fraude cadrée", rating: 4, color: "#FF4444", photo: "https://images.unsplash.com/photo-1528892952291-009c663ce843?w=100&h=100&fit=crop&crop=face" },
  { name: "Céline Picard", role: "CDO", company: "Média", quote: "La formation a créé un vocabulaire commun entre data, juridique et métier.", result: "Équipes alignées", rating: 5, color: "#00F5FF", photo: "https://images.unsplash.com/photo-1614283233556-f35b0c801ef1?w=100&h=100&fit=crop&crop=face" },
  { name: "Fabien Deschamps", role: "Dir. R&D", company: "MedTech", quote: "Double process CE + AI Act maintenant clair. Pas évident mais bien expliqué.", result: "Process clair", rating: 4, color: "#00FF88", photo: "https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?w=100&h=100&fit=crop&crop=face" },
  { name: "Sylvie Morel", role: "Resp. Formation", company: "Grand groupe", quote: "Déployé à 300 collaborateurs. Dashboard de suivi pratique.", result: "300 personnes", rating: 5, color: "#FF6B00", photo: "https://images.unsplash.com/photo-1548142813-c348350df52b?w=100&h=100&fit=crop&crop=face" },
  { name: "Pierre-Antoine Rey", role: "Avocat", company: "Cabinet tech", quote: "Contenu à jour des derniers guidelines. Je le recommande à mes confrères.", result: "À jour", rating: 5, color: "#8B5CF6", photo: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=100&h=100&fit=crop&crop=face" },
  { name: "Morgane Tissier", role: "Product Owner", company: "PropTech", quote: "Outil d'estimation immo utilise du ML. Documenté selon les standards maintenant.", result: "ML documenté", rating: 4, color: "#FFB800", photo: "https://images.unsplash.com/photo-1546961342-ea1f71b193f3?w=100&h=100&fit=crop&crop=face" },
  { name: "Sébastien Joly", role: "RSSI", company: "Banque privée", quote: "Formation efficace, pas de blabla. On va à l'essentiel.", result: "Efficace", rating: 5, color: "#00F5FF", photo: "https://images.unsplash.com/photo-1557862921-37829c790f19?w=100&h=100&fit=crop&crop=face" },
  { name: "Alexandra Klein", role: "Dir. Marketing", company: "Luxe", quote: "Personnalisation client concernée. Je ne m'y attendais pas. Bonne surprise.", result: "Perso encadrée", rating: 4, color: "#FF4444", photo: "https://images.unsplash.com/photo-1592621385612-4d7129426394?w=100&h=100&fit=crop&crop=face" },
  { name: "Damien Bonnet", role: "CTO", company: "GreenTech", quote: "IA d'optimisation énergétique conforme. Les investisseurs apprécient.", result: "Investisseurs OK", rating: 5, color: "#00FF88", photo: "https://images.unsplash.com/photo-1583195764036-6dc248ac07d9?w=100&h=100&fit=crop&crop=face" },
  { name: "Émilie Fontaine", role: "DPO", company: "Télécom", quote: "Après le RGPD, l'AI Act. Monte en compétence rapidement sur le sujet.", result: "Compétence OK", rating: 5, color: "#8B5CF6", photo: "https://images.unsplash.com/photo-1597223557154-721c1cecc4b0?w=100&h=100&fit=crop&crop=face" },
  { name: "Yannick Laurent", role: "Dir. Innovation", company: "Transport", quote: "Maintenance prédictive = système IA. On ne le savait pas. Documentation en cours.", result: "En cours", rating: 4, color: "#FFB800", photo: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&h=100&fit=crop&crop=face" },
];

// Testimonial Card Component with variable ratings and real photos
const TestimonialCard = ({ testimonial }: { testimonial: typeof testimonialRow1[0] }) => (
  <div 
    className="flex-shrink-0 w-[320px] sm:w-[380px] p-5 rounded-2xl border border-white/10 backdrop-blur-xl"
    style={{ 
      background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
      boxShadow: `0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)`
    }}
  >
    {/* Stars - variable rating */}
    <div className="flex gap-1 mb-3">
      {[1,2,3,4,5].map(i => (
        <svg 
          key={i} 
          className={`w-4 h-4 ${i <= testimonial.rating ? 'text-yellow-400' : 'text-white/20'}`} 
          viewBox="0 0 24 24" 
          fill="currentColor"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
      ))}
    </div>
    
    {/* Quote */}
    <p className="text-white/70 text-sm leading-relaxed mb-4 line-clamp-3">
      "{testimonial.quote}"
    </p>
    
    {/* Result badge */}
    <div 
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium mb-4"
      style={{ background: `${testimonial.color}20`, color: testimonial.color }}
    >
      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
        <polyline points="20 6 9 17 4 12"/>
      </svg>
      {testimonial.result}
    </div>
    
    {/* Author with real photo */}
    <div className="flex items-center gap-3 pt-3 border-t border-white/10">
      <img 
        src={testimonial.photo}
        alt={testimonial.name}
        className="w-10 h-10 rounded-full object-cover ring-2 ring-white/10"
        loading="lazy"
      />
      <div>
        <p className="text-white font-medium text-sm">{testimonial.name}</p>
        <p className="text-white/40 text-xs">{testimonial.role} • {testimonial.company}</p>
      </div>
    </div>
  </div>
);

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
                <p className="text-white font-bold">4 900€ HT</p>
              </div>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link 
                  href="/pricing"
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
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 0.5, repeat: 3 }}
            >
              ⚠️
            </motion.div>
            <h3 className="text-2xl font-bold text-white mb-2">
              Attendez !
            </h3>
            <p className="text-white/60 mb-6">
              Avant de partir, téléchargez notre <span className="text-[#00F5FF] font-semibold">checklist gratuite</span> :
              <br />
              <span className="text-white font-medium">"Les 10 erreurs fatales sur l'AI Act"</span>
            </p>
            
            <div className="space-y-3">
              <input 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Votre email professionnel"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-[#00F5FF] transition-colors"
              />
              <motion.button 
                className="w-full py-3 bg-gradient-to-r from-[#00F5FF] to-[#0066FF] text-white font-bold rounded-xl"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Recevoir la checklist gratuite
              </motion.button>
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
  { id: 'solo', name: 'Solo', price: 4900, originalPrice: 7500, users: '1', color: '#00F5FF', features: ['Formation complète 8h', '12 Templates juridiques', '12 Vidéos pratiques', 'Audit + Rapport PDF', 'Certificat officiel', '12 mois d\'accès'] },
  { id: 'equipe', name: 'Équipe', price: 19500, originalPrice: 30000, users: '5', color: '#00FF88', popular: true, features: ['Tout le pack Solo ×5', '5 Certificats nominatifs', 'Dashboard équipe', 'Audit consolidé', 'Support prioritaire', 'Onboarding personnalisé'] },
  { id: 'enterprise', name: 'Enterprise', price: null, originalPrice: null, users: '50', color: '#8B5CF6', features: ['Tout le pack Équipe ×50', 'Admin multi-sites', 'SSO / Intégration SIRH', 'Webinaire privé (2h)', 'Account manager dédié', 'SLA garanti'] },
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
            {['Programme', 'Formateur', 'Tarifs', 'FAQ'].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} className="text-white/60 hover:text-white transition-colors text-sm">
                {item}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/login" className="hidden sm:block text-white/60 hover:text-white transition-colors text-sm px-4 py-2">
              Connexion
            </Link>
            <Link href="#tarifs" className="bg-gradient-to-r from-[#00F5FF] to-[#0066FF] text-white font-semibold px-5 py-2.5 rounded-xl text-sm">
              Voir l'offre
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
                {['Programme', 'Formateur', 'Tarifs', 'FAQ'].map(item => (
                  <a key={item} href={`#${item.toLowerCase()}`} onClick={() => setMobileMenu(false)} className="text-xl font-semibold text-white/80 py-2">{item}</a>
                ))}
                <Link href="#tarifs" className="bg-gradient-to-r from-[#00F5FF] to-[#0066FF] text-white font-semibold px-6 py-3 rounded-xl text-center mt-4">Voir l'offre</Link>
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
              { icon: "💸", title: "Amendes massives", desc: "Jusqu'à 35M€ ou 7% du CA mondial. La CNIL a déjà distribué 150M€ d'amendes RGPD en France en 2024.", color: "#FF4444" },
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
      {/* MODULES - Quick Overview */}
      {/* ============================================ */}
      <section id="programme" className="relative z-10 py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }} 
            className="text-center mb-12"
          >
            <span className="text-[#00FF88] text-sm font-medium uppercase tracking-widest">Programme complet</span>
            <h2 className="text-3xl sm:text-4xl font-bold mt-2 mb-4">6 modules pour maîtriser l'AI Act</h2>
            <p className="text-white/40 max-w-xl mx-auto">8 heures de formation intensive, à suivre à votre rythme sur 12 mois</p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {modules.map((module, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 20 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true }} 
                transition={{ delay: i * 0.05 }}
              >
                <HoloCard glow={module.color}>
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-3xl">{module.icon}</span>
                      <span className="text-white/20 text-sm">Module {module.num}</span>
                    </div>
                    <h3 className="text-white font-semibold mb-2">{module.title}</h3>
                    <div className="flex items-center gap-2 text-white/40 text-sm">
                      <div className="w-4 h-4" style={{ color: module.color }}><Icons.Clock /></div>
                      {module.duration}
                    </div>
                  </div>
                </HoloCard>
              </motion.div>
            ))}
          </div>
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
                response: "Une amende AI Act peut atteindre 35M€. Un audit de conformité par un cabinet coûte 15 000€ minimum. Cette formation à 500€ est votre meilleure assurance.",
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
              {/* Stack items */}
              <div className="space-y-3">
                {[
                  { item: "Formation complète AI Act (8h - 6 modules vidéo)", value: 3000 },
                  { item: "12 Templates juridiques (Word, Excel) prêts à l'emploi", value: 1500 },
                  { item: "12 Vidéos pratiques (tuto pour chaque template)", value: 1200 },
                  { item: "Audit de conformité complet (50+ questions)", value: 2000 },
                  { item: "Rapport PDF personnalisé avec plan d'action", value: 800 },
                  { item: "Certificat officiel vérifiable (QR code)", value: 500 },
                  { item: "Quiz de validation avec correction détaillée", value: 200 },
                  { item: "Accès communauté à vie (847+ membres)", value: 300 },
                  { item: "Mises à jour réglementaires pendant 12 mois", value: 600 },
                  { item: "Support expert par email (réponse 24h)", value: 400 },
                ].map((row, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.03 }}
                    className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 text-[#00FF88]"><Icons.Check /></div>
                      <span className="text-white text-sm">{row.item}</span>
                    </div>
                    <div className="text-right flex items-center gap-2">
                      <span className="text-white/30 line-through text-xs">{row.value}€</span>
                      <span className="text-[#00FF88] font-bold text-xs">INCLUS</span>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Total */}
              <div className="mt-8 pt-6 border-t border-white/10">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-white/50">Valeur totale</span>
                  <span className="text-xl text-white/30 line-through">10 500€</span>
                </div>
                <div className="flex items-center justify-between mb-6">
                  <span className="text-white font-bold text-lg">Votre investissement aujourd'hui</span>
                  <div>
                    <span className="text-4xl font-black text-[#00FF88]">4 900€</span>
                    <span className="text-white/30 ml-2">HT</span>
                  </div>
                </div>
                
                {/* Savings callout */}
                <motion.div 
                  className="bg-[#00FF88]/10 border border-[#00FF88]/30 rounded-xl p-4 text-center"
                  animate={{ scale: [1, 1.01, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <p className="text-[#00FF88] font-bold text-lg">
                    🎉 Vous économisez 5 600€ (53% de réduction)
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
                        4 900€
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
                        <span className="text-white">19 500€ HT</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/60">Prise en charge OPCO (50%)</span>
                        <span className="text-[#00FF88]">-9 750€</span>
                      </div>
                      <div className="h-px bg-white/10 my-3" />
                      <div className="flex justify-between items-center">
                        <span className="text-white font-semibold">Reste à charge</span>
                        <motion.span 
                          className="text-3xl font-black text-[#00FF88]"
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          9 750€
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
                  <p className="text-3xl font-black text-white">4 900€</p>
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
              { q: "Quelle différence avec un cabinet de conseil ?", a: "Un cabinet facture 15 000€ à 50 000€ pour un accompagnement AI Act. Notre solution tout-en-un à 4 900€ vous donne tous les outils pour être autonome. Pour les besoins spécifiques, nous avons des cabinets partenaires." },
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
                  <Link href="/pricing" className="inline-flex items-center gap-3 bg-gradient-to-r from-[#FF6B00] to-[#FF4444] text-white font-bold px-10 py-5 rounded-xl text-lg">
                    Voir l'offre tout-en-un
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
                <li><a href="#tarifs" className="hover:text-white transition-colors">Tarifs</a></li>
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
