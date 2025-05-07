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
    en: 'Stibar - Your Personal Travel Assistant',
    it: 'Stibar - Il Tuo Assistente di Viaggio Personale',
    de: 'Stibar - Ihr Persönlicher Reiseassistent',
    pl: 'Stibar - Twój Osobisty Asystent Podróży',
    fr: 'Stibar - Votre Assistant de Voyage Personnel',
    es: 'Stibar - Tu Asistente de Viaje Personal',
  },
  description: {
    en: 'Generate personalized travel itineraries with AI.',
    it: 'Genera itinerari di viaggio personalizzati con l\'IA.',
    de: 'Erstellen Sie personalisierte Reiserouten mit KI.',
    pl: 'Generuj spersonalizowane plany podróży za pomocą AI.',
    fr: 'Générez des itinéraires de voyage personnalisés avec l\'IA.',
    es: 'Genera itinerarios de viaje personalizados con IA.',
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
