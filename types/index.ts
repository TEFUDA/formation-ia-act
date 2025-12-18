// Types pour le système B2B multi-utilisateurs
// Formation AI Act - formation-ia-act.fr

// ============================================
// PLANS & ABONNEMENTS
// ============================================

export type PlanType = 'solo' | 'equipe' | 'enterprise';

export interface Plan {
  id: PlanType;
  name: string;
  price: number;
  seats: number; // Nombre de places
  features: string[];
}

export const PLANS: Record<PlanType, Plan> = {
  solo: {
    id: 'solo',
    name: 'Solo',
    price: 500,
    seats: 1,
    features: [
      '1 accès personnel',
      '6 modules de formation',
      '12 ressources téléchargeables',
      'Certificat de compétence',
      'Accès à vie aux mises à jour',
      'Support par email',
    ],
  },
  equipe: {
    id: 'equipe',
    name: 'Équipe',
    price: 2000,
    seats: 5,
    features: [
      '5 accès collaborateurs',
      '6 modules de formation',
      '12 ressources téléchargeables',
      'Certificats de compétence',
      'Tableau de bord manager',
      'Support prioritaire',
      'Session Q&A mensuelle',
    ],
  },
  enterprise: {
    id: 'enterprise',
    name: 'Enterprise',
    price: 18000,
    seats: 50,
    features: [
      '50 accès collaborateurs',
      '6 modules de formation',
      '12 ressources téléchargeables',
      'Certificats de compétence',
      'Tableau de bord admin',
      'Support dédié',
      'Sessions Q&A illimitées',
      'Personnalisation logo',
      'Intégration SSO',
      'Rapport de conformité',
    ],
  },
};

// ============================================
// UTILISATEURS & ENTREPRISES
// ============================================

export type UserRole = 'admin' | 'employee' | 'solo';

export interface Company {
  id: string;
  name: string;
  plan: PlanType;
  seats: number; // Nombre total de places
  usedSeats: number; // Places utilisées
  createdAt: Date;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  companyId?: string; // null pour les solo
  invitedBy?: string; // ID de l'admin qui a invité
  invitedAt?: Date;
  createdAt: Date;
  lastLoginAt?: Date;
  avatarUrl?: string;
}

export interface Invitation {
  id: string;
  email: string;
  companyId: string;
  invitedBy: string; // User ID de l'admin
  status: 'pending' | 'accepted' | 'expired';
  createdAt: Date;
  expiresAt: Date;
  acceptedAt?: Date;
}

// ============================================
// MODULES & LEÇONS
// ============================================

export interface Module {
  id: number;
  title: string;
  description: string;
  duration: string;
  icon: string;
  lessons: Lesson[];
  xp: number;
  order: number;
}

export interface Lesson {
  id: string;
  moduleId: number;
  title: string;
  description: string;
  duration: string;
  videoUrl?: string;
  content: string; // Markdown ou HTML
  order: number;
  quiz: Quiz;
}

// ============================================
// QUIZ & QUESTIONS
// ============================================

export interface Quiz {
  id: string;
  lessonId: string;
  title: string;
  description: string;
  passingScore: number; // Pourcentage minimum (80%)
  questions: Question[];
}

export interface Question {
  id: string;
  quizId: string;
  text: string;
  type: 'single' | 'multiple'; // Choix unique ou multiple
  options: QuestionOption[];
  explanation: string; // Explication affichée après réponse
  order: number;
}

export interface QuestionOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  lessonId: string;
  userId: string;
  answers: UserAnswer[];
  score: number; // Pourcentage
  passed: boolean;
  startedAt: Date;
  completedAt: Date;
}

export interface UserAnswer {
  questionId: string;
  selectedOptionIds: string[];
  isCorrect: boolean;
}

// ============================================
// PROGRESSION
// ============================================

export interface UserProgress {
  userId: string;
  moduleId: number;
  lessonId: string;
  status: 'not_started' | 'in_progress' | 'completed';
  progressPercent: number;
  startedAt?: Date;
  completedAt?: Date;
  quizScore?: number;
  quizPassed?: boolean;
}

export interface UserModuleProgress {
  userId: string;
  moduleId: number;
  lessonsCompleted: number;
  totalLessons: number;
  averageQuizScore: number;
  status: 'locked' | 'in_progress' | 'completed';
  completedAt?: Date;
}

export interface UserOverallProgress {
  userId: string;
  modulesCompleted: number;
  totalModules: number;
  lessonsCompleted: number;
  totalLessons: number;
  averageQuizScore: number;
  totalXP: number;
  streak: number;
  lastActivityAt?: Date;
  certificateEligible: boolean; // true si 100% modules + 80% quiz moyenne
  certificateId?: string;
}

// ============================================
// CERTIFICATS
// ============================================

export interface Certificate {
  id: string;
  uniqueCode: string; // Code unique pour vérification
  userId: string;
  userName: string; // Nom complet au moment de la génération
  companyName?: string;
  issuedAt: Date;
  validUntil?: Date; // null = pas d'expiration
  modulesCompleted: number;
  averageQuizScore: number;
  totalHours: number;
  pdfUrl?: string; // URL du PDF généré
  verificationUrl: string; // URL pour vérifier l'authenticité
}

// Données pour générer le certificat PDF
export interface CertificateData {
  recipientName: string;
  recipientEmail: string;
  companyName?: string;
  completionDate: Date;
  certificateId: string;
  verificationCode: string;
  averageScore: number;
  totalHours: number;
  modules: {
    name: string;
    score: number;
    completedAt: Date;
  }[];
}

// ============================================
// STATISTIQUES ADMIN
// ============================================

export interface TeamStats {
  totalMembers: number;
  activeMembersThisWeek: number;
  averageProgress: number;
  averageQuizScore: number;
  certificatesIssued: number;
  membersInProgress: number;
  membersCompleted: number;
  membersNotStarted: number;
}

export interface MemberProgress {
  user: User;
  progress: UserOverallProgress;
  lastActivity: Date;
  status: 'active' | 'inactive' | 'completed';
}

// ============================================
// API RESPONSES
// ============================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}
