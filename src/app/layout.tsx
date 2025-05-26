// src/app/layout.tsx
'use client'; 

import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { GeistSans } from 'geist/font/sans';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from '@/components/shared/ThemeProvider';
import { LanguageProvider, useLanguage } from '@/contexts/LanguageContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const geistSans = GeistSans;

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

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    },
  },
});

function AppContent({ children }: { children: ReactNode }) {
  const { selectedLanguage } = useLanguage();

  useEffect(() => {
    const titleKey = selectedLanguage as keyof typeof layoutTranslations.title;
    const descriptionKey = selectedLanguage as keyof typeof layoutTranslations.description;

    document.title = layoutTranslations.title[titleKey] || layoutTranslations.title.en;
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', layoutTranslations.description[descriptionKey] || layoutTranslations.description.en);
    }
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
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} font-sans antialiased`}>
        <QueryClientProvider client={queryClient}>
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
        </QueryClientProvider>
      </body>
    </html>
  );
}
