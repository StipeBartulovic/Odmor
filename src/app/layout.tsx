// src/app/layout.tsx
'use client'; // Required for useEffect and useLanguage

import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { GeistSans } from 'geist/font/sans';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from '@/components/shared/ThemeProvider';
import { LanguageProvider, useLanguage } from '@/contexts/LanguageContext';

const geistSans = GeistSans;

// Static metadata export removed as this is a client component.
// Title and description are set dynamically in AppContent.

const layoutTranslations = {
  title: {
    en: 'odmarAI - Your Personal Travel Assistant',
    it: 'odmarAI - Il Tuo Assistente di Viaggio Personale',
    de: 'odmarAI - Ihr Persönlicher Reiseassistent',
    pl: 'odmarAI - Twój Osobisty Asystent Podróży',
    fr: 'odmarAI - Votre Assistant de Voyage Personnel',
    es: 'odmarAI - Tu Asistente de Viaje Personal',
  },
  description: {
    en: 'Generate personalized travel journeys with AI.',
    it: 'Genera viaggi personalizzati con l\'IA.',
    de: 'Erstellen Sie personalisierte Reisen mit KI.',
    pl: 'Generuj spersonalizowane plany podróży za pomocą AI.',
    fr: 'Générez des voyages personnalisés avec l\'IA.',
    es: 'Genera viajes personalizados con IA.',
  }
};

function AppContent({ children }: { children: ReactNode }) {
  const { selectedLanguage } = useLanguage();

  useEffect(() => {
    document.title = layoutTranslations.title[selectedLanguage as keyof typeof layoutTranslations.title] || layoutTranslations.title.en;
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', layoutTranslations.description[selectedLanguage as keyof typeof layoutTranslations.description] || layoutTranslations.description.en);
    }
    // Update html lang attribute
    document.documentElement.lang = selectedLanguage;
  }, [selectedLanguage]);

  return <>{children}</>;
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // The lang attribute will be updated by AppContent's useEffect
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <LanguageProvider>
            <AppContent>
              {children}
            </AppContent>
            <Toaster />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

