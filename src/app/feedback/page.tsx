// src/app/feedback/page.tsx
'use client';

import type { FormEvent } from 'react';
import { useState, useEffect } from 'react';
import { AppHeader } from '@/components/shared/AppHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Send, Mail, MessageSquare as MessageSquareIcon, Loader2, ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

const pageTranslations = {
  title: { 
    en: 'Share Your Feedback', 
    it: 'Condividi il Tuo Feedback', 
    de: 'Teilen Sie Ihr Feedback', 
    pl: 'Podziel się Opinią', 
    fr: 'Partagez Vos Commentaires', 
    es: 'Comparte Tus Comentarios' 
  },
  subtitle: { 
    en: 'Help us improve odmarAI! Send us your suggestions, report issues, or tell us what features you\'d like to see.', 
    it: 'Aiutaci a migliorare odmarAI! Inviaci i tuoi suggerimenti, segnala problemi o dicci quali funzionalità vorresti vedere.', 
    de: 'Helfen Sie uns, odmarAI zu verbessern! Senden Sie uns Ihre Vorschläge, melden Sie Probleme oder teilen Sie uns mit, welche Funktionen Sie sich wünschen.', 
    pl: 'Pomóż nam ulepszyć odmarAI! Prześlij nam swoje sugestie, zgłoś problemy lub powiedz, jakie funkcje chciałbyś zobaczyć.', 
    fr: 'Aidez-nous à améliorer odmarAI ! Envoyez-nous vos suggestions, signalez des problèmes ou dites-nous quelles fonctionnalités vous aimeriez voir.', 
    es: '¡Ayúdanos a mejorar odmarAI! Envíanos tus sugerencias, informa problemas o dinos qué características te gustaría ver.' 
  },
  emailLabel: { en: 'Your Email (Optional)', it: 'La Tua Email (Opzionale)', de: 'Ihre E-Mail (Optional)', pl: 'Twój Email (Opcjonalnie)', fr: 'Votre E-mail (Optionnel)', es: 'Tu Email (Opcional)' },
  emailPlaceholder: { en: 'your.email@example.com', it: 'tua.email@esempio.com', de: 'deine.email@beispiel.com', pl: 'twoj.email@przyklad.com', fr: 'votre.email@exemple.com', es: 'tu.email@ejemplo.com' },
  messageLabel: { en: 'Your Message', it: 'Il Tuo Messaggio', de: 'Ihre Nachricht', pl: 'Twoja Wiadomość', fr: 'Votre Message', es: 'Tu Mensaje' },
  messagePlaceholder: { en: "What's on your mind? Any suggestions or features you'd like to see?", it: 'Cosa ti passa per la testa? Qualche suggerimento o funzionalità che vorresti vedere?', de: 'Was geht Ihnen durch den Kopf? Irgendwelche Vorschläge oder Funktionen, die Sie gerne sehen würden?', pl: 'Co masz na myśli? Jakieś sugestie lub funkcje, które chciałbyś zobaczyć?', fr: 'Qu\'avez-vous en tête ? Des suggestions ou des fonctionnalités que vous aimeriez voir ?', es: '¿Qué tienes en mente? ¿Alguna sugerencia o característica que te gustaría ver?' },
  submitButton: { en: 'Send Message', it: 'Invia Messaggio', de: 'Nachricht Senden', pl: 'Wyślij Wiadomość', fr: 'Envoyer le Message', es: 'Enviar Mensaje' },
  sendingMessage: { en: 'Sending...', it: 'Invio...', de: 'Senden...', pl: 'Wysyłanie...', fr: 'Envoi...', es: 'Enviando...' },
  successMessageTitle: { en: 'Message Sent!', it: 'Messaggio Inviato!', de: 'Nachricht Gesendet!', pl: 'Wiadomość Wysłana!', fr: 'Message Envoyé !', es: '¡Mensaje Enviado!' },
  successMessageDescription: { en: 'Thank you for your feedback. We appreciate your input!', it: 'Grazie per il tuo feedback. Apprezziamo il tuo contributo!', de: 'Vielen Dank für Ihr Feedback. Wir schätzen Ihren Beitrag!', pl: 'Dziękujemy za Twoją opinię. Doceniamy Twój wkład!', fr: 'Merci pour vos commentaires. Nous apprécions votre contribution !', es: '¡Gracias por tus comentarios. Apreciamos tu aporte!' },
  errorMessageTitle: { en: 'Error Sending Message', it: 'Errore Invio Messaggio', de: 'Fehler beim Senden der Nachricht', pl: 'Błąd Wysyłania Wiadomości', fr: 'Erreur d\'Envoi du Message', es: 'Error al Enviar el Mensaje' },
  errorMessageDescription: { en: 'Something went wrong. Please try again later.', it: 'Qualcosa è andato storto. Riprova più tardi.', de: 'Etwas ist schiefgegangen. Bitte versuchen Sie es später erneut.', pl: 'Coś poszło nie tak. Spróbuj ponownie później.', fr: 'Quelque chose s\'est mal passé. Veuillez réessayer plus tard.', es: 'Algo salió mal. Por favor, inténtalo de nuevo más tarde.' },
  messageRequiredTitle: { en: 'Message Required', it: 'Messaggio Richiesto', de: 'Nachricht Erforderlich', pl: 'Wiadomość Wymagana', fr: 'Message Requis', es: 'Mensaje Requerido' },
  messageRequiredDescription: { en: 'Please enter a message before sending.', it: 'Inserisci un messaggio prima di inviare.', de: 'Bitte geben Sie vor dem Senden eine Nachricht ein.', pl: 'Wpisz wiadomość przed wysłaniem.', fr: 'Veuillez saisir un message avant d\'envoyer.', es: 'Por favor, escribe un mensaje antes de enviar.' },
  goBackButton: { en: 'Go Back', it: 'Torna Indietro', de: 'Zurück', pl: 'Wróć', fr: 'Retour', es: 'Volver' },
  footerRights: { en: 'All rights reserved.', it: 'Tutti i diritti riservati.', de: 'Alle Rechte vorbehalten.', pl: 'Wszelkie prawa zastrzeżone.', fr: 'Tous droits réservés.', es: 'Todos los derechos reservados.' },
  loading: { en: 'Loading...', it: 'Caricamento...', de: 'Laden...', pl: 'Ładowanie...', fr: 'Chargement...', es: 'Cargando...' }
};

export default function FeedbackPage() {
  const router = useRouter();
  const { selectedLanguage } = useLanguage();
  const [isMounted, setIsMounted] = useState(false);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentYear, setCurrentYear] = useState<number | null>(null);

  useEffect(() => {
    setIsMounted(true);
    setCurrentYear(new Date().getFullYear());
  }, []);

  const t = (fieldKey: keyof typeof pageTranslations): string => {
    const langToUse = isMounted ? selectedLanguage : 'en';
    // @ts-ignore
    const translation = pageTranslations[fieldKey]?.[langToUse] || pageTranslations[fieldKey]?.['en'];
    return typeof translation === 'string' ? translation : String(fieldKey);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!message.trim()) {
      toast({
        title: t('messageRequiredTitle'),
        description: t('messageRequiredDescription'),
        variant: "destructive",
      });
      return;
    }
    setIsLoading(true);
    // console.log('Feedback Submission:', { email, message }); // For local debugging

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    try {
      // In a real app, you'd send this to a backend:
      // const response = await fetch('/api/feedback', {
      //     method: 'POST',
      //     headers: { 'Content-Type': 'application/json' },
      //     body: JSON.stringify({ email, message }),
      // });
      // if (!response.ok) throw new Error('Network response was not ok');
        
      toast({
        title: t('successMessageTitle'),
        description: t('successMessageDescription'),
      });
      setEmail('');
      setMessage('');
    } catch (error) {
      toast({
        title: t('errorMessageTitle'),
        description: t('errorMessageDescription'),
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  if (!isMounted || currentYear === null) {
    return (
      <div className="flex flex-col min-h-screen bg-background items-center justify-center">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
        <p className="text-xl text-muted-foreground mt-4">{t('loading')}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <AppHeader />
      <main className="flex-grow container mx-auto px-4 py-8 space-y-12">
        <div className="mb-8">
          <Button variant="outline" onClick={() => router.push('/')} className="rounded-lg shadow-sm">
            <ArrowLeft className="mr-2 h-5 w-5" />
            {t('goBackButton')}
          </Button>
        </div>
        <Card className="shadow-xl rounded-xl max-w-2xl mx-auto">
          <CardHeader className="bg-muted/50 p-6 text-center">
            <CardTitle className="text-2xl md:text-3xl font-semibold text-primary flex items-center justify-center gap-2">
              <MessageSquareIcon className="h-8 w-8" />
              {t('title')}
            </CardTitle>
            <CardDescription className="mt-2">{t('subtitle')}</CardDescription>
          </CardHeader>
          <CardContent className="p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="feedback-email" className="flex items-center gap-2 text-foreground">
                  <Mail className="h-5 w-5 text-primary" />
                  {t('emailLabel')}
                </Label>
                <Input
                  id="feedback-email"
                  type="email"
                  placeholder={t('emailPlaceholder')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="rounded-lg shadow-sm"
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="feedback-message" className="flex items-center gap-2 text-foreground">
                  <MessageSquareIcon className="h-5 w-5 text-primary" />
                  {t('messageLabel')}
                </Label>
                <Textarea
                  id="feedback-message"
                  placeholder={t('messagePlaceholder')}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="rounded-lg shadow-sm min-h-[150px]"
                  disabled={isLoading}
                  required
                />
              </div>
              <Button type="submit" size="lg" className="w-full rounded-lg shadow-md flex items-center gap-2 bg-primary hover:bg-primary/90">
                {isLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    {t('sendingMessage')}
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5" />
                    {t('submitButton')}
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
      <footer className="py-8 bg-muted text-center">
        <div className="container mx-auto px-4">
          <p className="text-sm text-muted-foreground">
            &copy; {currentYear} odmarAI. {t('footerRights')}
          </p>
        </div>
      </footer>
    </div>
  );
}
