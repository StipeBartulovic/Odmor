// src/components/sections/QuickMessageSection.tsx
'use client';

import type { FormEvent } from 'react';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Send, Mail, MessageSquare as MessageSquareIcon, Loader2 } from 'lucide-react'; // Renamed to avoid conflict
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from '@/hooks/use-toast';

const translations = {
  sectionTitle: { en: 'Quick Message', it: 'Messaggio Rapido', de: 'Schnelle Nachricht', pl: 'Szybka Wiadomość', fr: 'Message Rapide', es: 'Mensaje Rápido' },
  sectionSubtitle: { en: 'Help us improve odmarAi! Send us your suggestions or feedback.', it: 'Aiutaci a migliorare odmarAi! Inviaci i tuoi suggerimenti o feedback.', de: 'Helfen Sie uns, odmarAi zu verbessern! Senden Sie uns Ihre Vorschläge oder Ihr Feedback.', pl: 'Pomóż nam ulepszyć odmarAi! Prześlij nam swoje sugestie lub opinie.', fr: 'Aidez-nous à améliorer odmarAi ! Envoyez-nous vos suggestions ou commentaires.', es: '¡Ayúdanos a mejorar odmarAi! Envíanos tus sugerencias o comentarios.' },
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
};

export function QuickMessageSection() {
  const { selectedLanguage } = useLanguage();
  const [isMounted, setIsMounted] = useState(false);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const t = (fieldKey: keyof typeof translations): string => {
    const langToUse = isMounted ? selectedLanguage : 'en';
    // @ts-ignore
    const translation = translations[fieldKey]?.[langToUse] || translations[fieldKey]?.['en'];
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
    console.log('Quick Message Submission:', { email, message });

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

  if (!isMounted) {
    return (
      <section className="py-8 md:py-12 bg-background">
        <div className="container mx-auto px-4">
          <Card className="shadow-xl rounded-xl">
            <CardHeader className="bg-muted/50 p-6">
              <div className="h-8 bg-muted rounded w-1/2 animate-pulse mb-2"></div>
              <div className="h-4 bg-muted rounded w-3/4 animate-pulse"></div>
            </CardHeader>
            <CardContent className="p-6 md:p-8">
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded w-1/4 animate-pulse"></div>
                  <div className="h-10 bg-muted rounded w-full animate-pulse"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded w-1/4 animate-pulse"></div>
                  <div className="h-20 bg-muted rounded w-full animate-pulse"></div>
                </div>
                <div className="h-12 bg-primary/50 rounded-lg w-1/3 animate-pulse"></div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 md:py-12 bg-background">
      <div className="container mx-auto px-4">
        <Card className="shadow-xl rounded-xl">
          <CardHeader className="bg-muted/50 p-6">
            <CardTitle className="text-2xl md:text-3xl font-semibold text-primary flex items-center gap-2">
              <MessageSquareIcon className="h-8 w-8" />
              {t('sectionTitle')}
            </CardTitle>
            <CardDescription>{t('sectionSubtitle')}</CardDescription>
          </CardHeader>
          <CardContent className="p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="quick-message-email" className="flex items-center gap-2 text-foreground">
                  <Mail className="h-5 w-5 text-primary" />
                  {t('emailLabel')}
                </Label>
                <Input
                  id="quick-message-email"
                  type="email"
                  placeholder={t('emailPlaceholder')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="rounded-lg shadow-sm"
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="quick-message-text" className="flex items-center gap-2 text-foreground">
                  <MessageSquareIcon className="h-5 w-5 text-primary" />
                  {t('messageLabel')}
                </Label>
                <Textarea
                  id="quick-message-text"
                  placeholder={t('messagePlaceholder')}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="rounded-lg shadow-sm min-h-[120px]"
                  disabled={isLoading}
                  required
                />
              </div>
              <Button type="submit" size="lg" className="w-full md:w-auto rounded-lg shadow-md flex items-center gap-2 bg-primary hover:bg-primary/90" disabled={isLoading}>
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
      </div>
    </section>
  );
}
