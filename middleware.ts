import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale, domainLocales } from './i18n';

export default createMiddleware({
  // Langues supportées
  locales,
  defaultLocale,
  
  // Détection automatique de la langue
  localeDetection: true,
  
  // Pas de préfixe pour la langue par défaut
  localePrefix: 'as-needed'
});

export const config = {
  // Matcher pour toutes les routes sauf les fichiers statiques
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};
