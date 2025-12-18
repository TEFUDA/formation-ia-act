import {notFound} from 'next/navigation';
import {getRequestConfig} from 'next-intl/server';

// Liste des langues supportées
export const locales = ['fr', 'de', 'it', 'es', 'nl', 'pt', 'pl', 'en'] as const;
export type Locale = (typeof locales)[number];

// Langue par défaut
export const defaultLocale: Locale = 'fr';

// Mapping domaines -> langues
export const domainLocales: Record<string, Locale> = {
  'formation-ia-act.fr': 'fr',
  'ki-verordnung-schulung.de': 'de',
  'formazione-ai-act.it': 'it',
  'formacion-ai-act.es': 'es',
  'ai-verordening-training.nl': 'nl',
  'formacao-ai-act.pt': 'pt',
  'szkolenie-ai-act.pl': 'pl',
  'ai-act-certification.com': 'en',
  'ai-act-training.eu': 'en',
  'localhost:3000': 'fr', // Dev
};

export default getRequestConfig(async ({locale}) => {
  // Valider que la locale existe
  if (!locales.includes(locale as Locale)) notFound();

  return {
    messages: (await import(`./locales/${locale}.json`)).default
  };
});
