import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import DevButtons from '@/components/DevButtons'
import '../globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Formation AI Act | Certification Conformité IA Europe',
  description: 'Formation certifiante AI Act pour mettre votre entreprise en conformité avec le règlement européen sur l\'Intelligence Artificielle.',
}

export default async function LocaleLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  const messages = await getMessages()
// app/[locale]/layout.tsx

import DevTools from '@/app/components/DevTools';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        {children}
        <DevTools />  {/* ← Ajoute ça */}
      </body>
    </html>
  );
}
  return (
    <html lang={locale} className="dark">
      <body className={inter.className}>
        <NextIntlClientProvider messages={messages}>
          {children}
          <DevButtons />
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
