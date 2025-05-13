
'use client';

import type { FormEvent } from 'react';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { KeyRound, Mail, Newspaper } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/contexts/LanguageContext'; // Assuming useLanguage is needed for translations

interface PasswordOverlayProps {
  onAuthenticate: (password: string) => boolean;
}

const overlayTranslations = {
  title: {
    en: 'Travel farther. Go beyond the brochure.',
    it: 'Viaggia più lontano. Vai oltre la brochure.',
    de: 'Reisen Sie weiter. Gehen Sie über die Broschüre hinaus.',
    pl: 'Podróżuj dalej. Wyjdź poza broszurę.',
    fr: 'Voyagez plus loin. Allez au-delà de la brochure.',
    es: 'Viaja más lejos. Ve más allá del folleto.',
  },
  subtitle: {
    en: 'Please enter your email and the password to access odmarAI.',
    it: 'Inserisci la tua email e la password per accedere a odmarAI.',
    de: 'Bitte geben Sie Ihre E-Mail-Adresse und das Passwort ein, um auf odmarAI zuzugreifen.',
    pl: 'Wprowadź swój adres e-mail i hasło, aby uzyskać dostęp do odmarAI.',
    fr: 'Veuillez saisir votre e-mail et votre mot de passe pour accéder à odmarAI.',
    es: 'Introduce tu correo electrónico y la contraseña para acceder a odmarAI.',
  },
  emailLabel: {
    en: 'Email (Optional)',
    it: 'Email (Opzionale)',
    de: 'E-Mail (Optional)',
    pl: 'Email (Opcjonalnie)',
    fr: 'E-mail (Optionnel)',
    es: 'Correo electrónico (Opcional)',
  },
  passwordLabel: {
    en: 'Password',
    it: 'Password',
    de: 'Passwort',
    pl: 'Hasło',
    fr: 'Mot de passe',
    es: 'Contraseña',
  },
  unlockButton: {
    en: 'Unlock odmarAI',
    it: 'Sblocca odmarAI',
    de: 'odmarAI freischalten',
    pl: 'Odblokuj odmarAI',
    fr: 'Déverrouiller odmarAI',
    es: 'Desbloquear odmarAI',
  },
  incorrectPasswordError: {
    en: 'Incorrect password. Please try again.',
    it: 'Password errata. Riprova.',
    de: 'Falsches Passwort. Bitte versuchen Sie es erneut.',
    pl: 'Nieprawidłowe hasło. Spróbuj ponownie.',
    fr: 'Mot de passe incorrect. Veuillez réessayer.',
    es: 'Contraseña incorrecta. Inténtalo de nuevo.',
  },
  newsletterLabel: {
    en: 'Subscribe to our newsletter for travel tips and updates.',
    it: 'Iscriviti alla nostra newsletter per consigli di viaggio e aggiornamenti.',
    de: 'Abonnieren Sie unseren Newsletter für Reisetipps und Updates.',
    pl: 'Zapisz się do naszego newslettera, aby otrzymywać wskazówki podróżne i aktualizacje.',
    fr: 'Abonnez-vous à notre newsletter pour des conseils de voyage et des mises à jour.',
    es: 'Suscríbete a nuestro boletín para recibir consejos de viaje y actualizaciones.',
  }
};


export function PasswordOverlay({ onAuthenticate }: PasswordOverlayProps) {
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [newsletterOptIn, setNewsletterOptIn] = useState(false);
  const [error, setError] = useState('');
  const { selectedLanguage } = useLanguage(); // Get current language
  const [isMounted, setIsMounted] = useState(false);

  useState(() => {
    setIsMounted(true);
  });

  const t = (fieldKey: keyof typeof overlayTranslations): string => {
    const langToUse = isMounted ? selectedLanguage : 'en';
    // @ts-ignore
    const translation = overlayTranslations[fieldKey]?.[langToUse] || overlayTranslations[fieldKey]?.['en'];
    return typeof translation === 'string' ? translation : String(fieldKey);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError(''); // Clear previous error
    
    if (onAuthenticate(password)) {
      // Parent component will handle hiding this overlay by re-rendering
      if (newsletterOptIn) {
        console.log(`Email ${email || 'not provided'} opted into newsletter.`);
        // Here you would typically send the email to your newsletter service
      }
    } else {
      setError(t('incorrectPasswordError'));
      setPassword(''); // Clear password field on error
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-md p-4">
      <div className="bg-card p-8 rounded-xl shadow-2xl w-full max-w-md text-center border border-border">
        <KeyRound className="mx-auto h-16 w-16 text-primary mb-6" />
        <h2 className="text-2xl font-semibold text-foreground mb-3">
          {t('title')}
        </h2>
        <p className="text-muted-foreground mb-8 text-sm">
          {t('subtitle')}
        </p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2 text-left">
            <Label htmlFor="email-overlay" className="flex items-center text-foreground">
              <Mail className="mr-2 h-5 w-5 text-primary" />
              {t('emailLabel')}
            </Label>
            <Input
              id="email-overlay"
              type="email"
              placeholder="your.email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="text-lg h-12 rounded-lg shadow-sm focus:ring-primary focus:border-primary"
              aria-label="Email"
            />
          </div>
           <div className="space-y-2 text-left">
            <Label htmlFor="password-overlay" className="flex items-center text-foreground">
               <KeyRound className="mr-2 h-5 w-5 text-primary" />
              {t('passwordLabel')}
            </Label>
            <Input
              id="password-overlay"
              type="password"
              placeholder={t('passwordLabel')}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="text-lg h-12 rounded-lg shadow-sm focus:ring-primary focus:border-primary"
              aria-label={t('passwordLabel')}
              autoFocus
            />
          </div>

          <div className="flex items-center space-x-2 text-left">
            <Checkbox 
              id="newsletter-opt-in" 
              checked={newsletterOptIn}
              onCheckedChange={(checked) => setNewsletterOptIn(checked as boolean)}
              aria-labelledby="newsletter-label"
            />
            <Label 
              htmlFor="newsletter-opt-in" 
              id="newsletter-label"
              className="text-sm font-normal text-muted-foreground cursor-pointer flex items-center"
            >
              <Newspaper className="mr-2 h-4 w-4 text-primary/80" /> 
              {t('newsletterLabel')}
            </Label>
          </div>

          {error && <p className="text-sm text-destructive font-medium">{error}</p>}
          <Button type="submit" className="w-full text-lg py-3 rounded-lg shadow-md bg-primary hover:bg-primary/90 h-12">
            {t('unlockButton')}
          </Button>
        </form>
      </div>
    </div>
  );
}

