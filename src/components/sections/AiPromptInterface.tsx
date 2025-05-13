'use client';

import type { FormEvent } from 'react';
import { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Wand2, RotateCcw, CalendarIcon, Users, DollarSign, Car, Feather } from 'lucide-react';
import { format } from "date-fns";
import { useLanguage } from '@/contexts/LanguageContext';
import type { ReactNode } from 'react';

const translations = {
  title: {
    en: 'Create Your Dream Journey',
    it: 'Crea il Viaggio dei Tuoi Sogni',
    de: 'Erstellen Sie Ihre Traumreise',
    pl: 'Stwórz Swój Wymarzony Plan Podróży', // Journey can be "Podróż" or "Plan Podróży"
    fr: 'Créez Votre Voyage de Rêve',
    es: 'Crea el Viaje de Tus Sueños',
  },
  promptLabel: {
    en: 'Describe your ideal trip',
    it: 'Descrivi il tuo viaggio ideale',
    de: 'Beschreiben Sie Ihre ideale Reise',
    pl: 'Opisz swoją idealną podróż',
    fr: 'Décrivez votre voyage idéal',
    es: 'Describe tu viaje ideal',
  },
  promptPlaceholder: {
    en: 'e.g., A relaxing 5-day beach vacation in Bali with some cultural experiences.',
    it: 'es., Una rilassante vacanza al mare di 5 giorni a Bali con alcune esperienze culturali.',
    de: 'z.B. Ein entspannender 5-tägiger Strandurlaub auf Bali mit einigen kulturellen Erlebnissen.',
    pl: 'np. Relaksujące 5-dniowe wakacje na plaży na Bali z pewnymi doświadczeniami kulturowymi.',
    fr: 'ex., Des vacances relaxantes de 5 jours à la plage à Bali avec quelques expériences culturelles.',
    es: 'p.ej., Unas relajantes vacaciones de playa de 5 días en Bali con algunas experiencias culturales.',
  },
  generateButton: {
    en: 'Generate',
    it: 'Genera',
    de: 'Generieren',
    pl: 'Generuj',
    fr: 'Générer',
    es: 'Generar',
  },
  loadingJourney: {
    en: 'Generating Your Journey...',
    it: 'Generazione del Tuo Viaggio...',
    de: 'Deine Reise wird generiert...',
    pl: 'Generowanie Twojego Planu Podróży...',
    fr: 'Génération de Votre Voyage...',
    es: 'Generando Tu Viaje...',
  },
  journeyTitle: {
    en: 'Your Personalized Journey',
    it: 'Il Tuo Viaggio Personalizzato',
    de: 'Ihre Persönliche Reise',
    pl: 'Twój Spersonalizowany Plan Podróży',
    fr: 'Votre Voyage Personnalisé',
    es: 'Tu Viaje Personalizado',
  },
  tryAnotherButton: {
    en: 'Create Another Journey',
    it: 'Crea un Altro Viaggio',
    de: 'Weitere Reise Erstellen',
    pl: 'Stwórz Kolejny Plan Podróży',
    fr: 'Créer un Autre Voyage',
    es: 'Crear Otro Viaje',
  },
  noJourney: {
    en: 'No journey generated yet. Fill out the form and click "Generate"!',
    it: 'Nessun viaggio generato ancora. Compila il modulo e clicca "Genera"!',
    de: 'Noch keine Reise generiert. Füllen Sie das Formular aus und klicken Sie auf "Generieren"!',
    pl: 'Nie wygenerowano jeszcze planu podróży. Wypełnij formularz i kliknij "Generuj"!',
    fr: 'Aucun voyage généré pour le moment. Remplissez le formulaire et cliquez sur "Générer" !',
    es: 'Aún no se ha generado ningún viaje. ¡Rellena el formulario y haz clic en "Generar"!',
  },
  numPeopleLabel: {
    en: 'Number of People',
    it: 'Numero di Persone',
    de: 'Anzahl der Personen',
    pl: 'Liczba Osób',
    fr: 'Nombre de Personnes',
    es: 'Número de Personas',
  },
  arrivalDateLabel: {
    en: 'Arrival Date',
    it: 'Data di Arrivo',
    de: 'Ankunftsdatum',
    pl: 'Data Przyjazdu',
    fr: 'Date d\'Arrivée',
    es: 'Fecha de Llegada',
  },
  arrivalDatePlaceholder: {
    en: 'Pick a date',
    it: 'Scegli una data',
    de: 'Datum auswählen',
    pl: 'Wybierz datę',
    fr: 'Choisissez une date',
    es: 'Elige una fecha',
  },
  dailyBudgetLabel: {
    en: 'Daily Budget (per person)',
    it: 'Budget Giornaliero (a persona)',
    de: 'Tagesbudget (pro Person)',
    pl: 'Budżet Dzienny (na osobę)',
    fr: 'Budget Quotidien (par personne)',
    es: 'Presupuesto Diario (por persona)',
  },
  budgetOption1: { en: '< $50', it: '< 50€', de: '< 50€', pl: '< 50$', fr: '< 50€', es: '< 50€' },
  budgetOption2: { en: '$50 - $100', it: '50€ - 100€', de: '50€ - 100€', pl: '50$ - 100$', fr: '50€ - 100€', es: '50€ - 100€' },
  budgetOption3: { en: '$100 - $200', it: '100€ - 200€', de: '100€ - 200€', pl: '100$ - 200$', fr: '100€ - 200€', es: '100€ - 200€' },
  budgetOption4: { en: '$200+', it: '200€+', de: '200€+', pl: '200$+', fr: '200€+', es: '200€+' },
  vehicleLabel: {
    en: 'Vehicle Available?',
    it: 'Veicolo Disponibile?',
    de: 'Fahrzeug Verfügbar?',
    pl: 'Dostępny Pojazd?',
    fr: 'Véhicule Disponible ?',
    es: '¿Vehículo Disponible?',
  },
  preferencesLabel: {
    en: 'Likes & Dislikes (Optional)',
    it: 'Preferenze (Opzionale)',
    de: 'Vorlieben & Abneigungen (Optional)',
    pl: 'Preferencje (Opcjonalnie)',
    fr: 'Préférences (Facultatif)',
    es: 'Preferencias (Opcional)',
  },
  preferencesPlaceholder: {
    en: 'e.g., Love hiking, prefer quiet places, allergic to seafood.',
    it: 'es., Amo le escursioni, preferisco luoghi tranquilli, allergico ai frutti di mare.',
    de: 'z.B. Liebe Wandern, bevorzuge ruhige Orte, allergisch gegen Meeresfrüchte.',
    pl: 'np. Uwielbiam wędrówki, wolę ciche miejsca, alergia na owoce morza.',
    fr: 'ex., J\'adore la randonnée, préfère les endroits calmes, allergique aux fruits de mer.',
    es: 'p.ej., Me encanta el senderismo, prefiero lugares tranquilos, alérgico/a a los mariscos.',
  },
  errorFetching: {
    en: 'Error fetching journey',
    it: 'Errore nel recupero del viaggio',
    de: 'Fehler beim Abrufen der Reise',
    pl: 'Błąd podczas pobierania planu podróży',
    fr: 'Erreur lors de la récupération du voyage',
    es: 'Error al obtener el viaje',
  },
   errorMinPeople: {
    en: 'Number of people must be at least 1.',
    it: 'Il numero di persone deve essere almeno 1.',
    de: 'Die Anzahl der Personen muss mindestens 1 betragen.',
    pl: 'Liczba osób musi wynosić co najmniej 1.',
    fr: 'Le nombre de personnes doit être d\'au moins 1.',
    es: 'El número de personas debe ser de al menos 1.',
  },
  errorDateFormat: {
    en: 'Invalid date format.',
    it: 'Formato data non valido.',
    de: 'Ungültiges Datumsformat.',
    pl: 'Nieprawidłowy format daty.',
    fr: 'Format de date invalide.',
    es: 'Formato de fecha inválido.',
  },
};

const renderJourney = (text: string) => {
  if (!text) return null;

  const sections = text.split(/\n\s*(?=[A-Za-z\s]+:)/) // Split by lines that look like "Section Title:"
    .map(section => section.trim())
    .filter(section => section.length > 0);

  return sections.map((section, sectionIndex) => {
    const lines = section.split('\n');
    const titleLine = lines[0];
    const contentLines = lines.slice(1);

    // Check if titleLine looks like a heading (ends with colon, or common keywords)
    const isHeading = titleLine.endsWith(':') || 
                      /\b(Morning|Midday|Afternoon|Evening|Night|Practical advice|Day \d+|Tip)\b/i.test(titleLine);

    return (
      <div key={sectionIndex} className="mb-6 last:mb-0">
        {isHeading ? (
          <h3 className="font-bold text-xl mt-3 mb-2.5 text-primary">
            {titleLine.replace(/:\s*$/, '')} {/* Remove trailing colon for display */}
          </h3>
        ) : (
          <p className="text-foreground mb-1.5 leading-relaxed font-semibold">{titleLine}</p> // If not a clear heading, treat first line as emphasized paragraph
        )}
        
        {contentLines.map((line, lineIndex) => {
          line = line.trim();
          if (line === '') return null;

          // Bold specific keywords
          let processedLine = line.replace(/\b(Note|Important|Caution|Tip|Remember|Also|Additionally|Finally)\b/gi, '<strong>$1</strong>');
          // Make locations or specific activities bold if they are followed by parenthesized details or specific instructions
          processedLine = processedLine.replace(/([A-Za-z\s\dčćšđžČĆŠĐŽ]+)(\s*\(.*?\))/g, '<strong>$1</strong>$2'); // e.g. "Location (details)"
          processedLine = processedLine.replace(/(\bVisit\s[A-Za-z\s\dčćšđžČĆŠĐŽ]+)/g, '<strong>$1</strong>'); 
          processedLine = processedLine.replace(/(\bTry\s[A-Za-z\s\dčćšđžČĆŠĐŽ]+ for)/g, '<strong>$1</strong>');
          processedLine = processedLine.replace(/(\bHead to\s[A-Za-z\s\dčćšđžČĆŠĐŽ]+)/g, '<strong>$1</strong>');
          
          // Simple list detection (lines starting with -, *, or number.)
          if (/^(\s*-\s+|\s*\*\s+|\s*\d+\.\s+)/.test(line)) {
            return (
              <li key={lineIndex} className="text-foreground mb-1.5 ml-5 leading-relaxed list-disc" dangerouslySetInnerHTML={{ __html: processedLine.replace(/^(\s*-\s+)|(\s*\*\s+)|(\s*\d+\.\s+)/, '') }} />
            );
          }
          return (
            <p key={lineIndex} className="text-foreground mb-1.5 leading-relaxed" dangerouslySetInnerHTML={{ __html: processedLine }} />
          );
        })}
      </div>
    );
  });
};


export function AiPromptInterface() {
  const { selectedLanguage } = useLanguage();
  const [isMounted, setIsMounted] = useState(false);

  const [prompt, setPrompt] = useState('');
  const [numberOfPeople, setNumberOfPeople] = useState<number>(1);
  const [arrivalDate, setArrivalDate] = useState<Date | undefined>(new Date());
  const [dailyBudget, setDailyBudget] = useState<string>('<$50');
  const [vehicleAvailability, setVehicleAvailability] = useState<boolean>(false);
  const [preferences, setPreferences] = useState<string>('');

  const [isLoading, setIsLoading] = useState(false);
  const [journey, setJourney] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const t = (fieldKey: keyof typeof translations): string => {
    const langToUse = isMounted ? selectedLanguage : 'en';
    // @ts-ignore
    const resolvedTranslation = translations[fieldKey]?.[langToUse] || translations[fieldKey]?.['en'];
    if (typeof resolvedTranslation === 'string') {
        return resolvedTranslation;
    }
    return fieldKey.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
  };


  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setJourney(null);
    setError(null);

    if (numberOfPeople < 1) {
      setError(t('errorMinPeople'));
      setIsLoading(false);
      return;
    }

    const formattedArrivalDate = arrivalDate ? format(arrivalDate, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd");

    const formData = {
      prompt,
      numberOfPeople,
      arrivalDate: formattedArrivalDate,
      dailyBudget,
      vehicleAvailability,
      preferences,
    };

    try {
      const response = await fetch(
        'https://stibar.app.n8n.cloud/webhook-test/42bf9126-47bb-43a1-9661-2d4b764e2725',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Error response from webhook:', errorData);
        throw new Error(`${t('errorFetching')}: ${response.status} - ${errorData}`);
      }
      
      const responseData: { myField: string } | [{ output: string }] = await response.json();
      let rawJourneyString: string | undefined;

      if (Array.isArray(responseData) && responseData.length > 0 && typeof responseData[0].output === 'string') {
        rawJourneyString = responseData[0].output;
      } else if (typeof responseData === 'object' && responseData !== null && 'myField' in responseData && typeof (responseData as { myField: string }).myField === 'string') {
        const tempField = (responseData as { myField: string }).myField;
         // The N8N workflow for this user returns "{{ $json.output }}" as a string inside myField
         // if $json.output itself was a string. If $json.output was an object/array that N8N stringified,
         // then myField would contain a stringified JSON.
         // Based on the example output " [{ "output": "Morning: Start..." }] "
         // The $json.output IS the array with one object.
         // So if n8n has `{{ $json.output }}` as the value for `myField`,
         // `tempField` would be a string representation of that array: `"[{\"output\":\"Morning: Start...\"}]"`
        try {
            const parsedMyField = JSON.parse(tempField);
            if (Array.isArray(parsedMyField) && parsedMyField.length > 0 && typeof parsedMyField[0].output === 'string') {
                rawJourneyString = parsedMyField[0].output;
            } else if (typeof parsedMyField === 'string') { 
                // This case handles if $json.output was a simple string and n8n stringified it.
                rawJourneyString = parsedMyField;
            } else {
                 // If myField contained something unexpected after parsing
                rawJourneyString = tempField; // Fallback
            }
        } catch (e) {
            // If JSON.parse(tempField) fails, it means tempField was already a plain string
            // (e.g. if n8n's $json.output was directly a string and not further stringified)
            // OR it's the literal "{{ $json.output }}" if n8n didn't process the template.
            // Given the user's problem, the latter is unlikely if n8n is setup correctly.
            // The goal is to extract the actual journey text.
            rawJourneyString = tempField;
        }
      }


      if (rawJourneyString) {
        setJourney(rawJourneyString);
      } else {
        setJourney(t('noJourney'));
      }

    } catch (err: any) {
      console.error('Error in handleSubmit:', err);
      setError(err.message || t('errorFetching'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleTryAnother = () => {
    setPrompt('');
    setNumberOfPeople(1);
    setArrivalDate(new Date());
    setDailyBudget('<$50');
    setVehicleAvailability(false);
    setPreferences('');
    setJourney(null);
    setError(null);
    setIsLoading(false);
    if (formRef.current) {
        formRef.current.reset(); 
    }
  };
  
  if (!isMounted) {
    return (
      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4">
          <Card className="shadow-xl rounded-xl">
            <CardHeader className="bg-muted/50 p-6">
              <div className="h-8 bg-muted rounded w-1/2 animate-pulse"></div>
            </CardHeader>
            <CardContent className="p-6 md:p-8">
              <div className="space-y-8">
                <div className="h-10 bg-muted rounded w-full animate-pulse"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="h-10 bg-muted rounded w-full animate-pulse"></div>
                  <div className="h-10 bg-muted rounded w-full animate-pulse"></div>
                  <div className="h-10 bg-muted rounded w-full animate-pulse"></div>
                </div>
                <div className="h-20 bg-muted rounded w-full animate-pulse"></div>
                <div className="h-12 bg-primary/50 rounded-lg w-1/3 mx-auto animate-pulse"></div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }


  return (
    <section className="py-8 md:py-12">
      <div className="container mx-auto px-4">
        <Card className="shadow-xl rounded-xl">
          <CardHeader className="bg-muted/50 p-6">
            <CardTitle className="text-2xl md:text-3xl font-semibold text-primary flex items-center gap-3">
              <Wand2 className="h-8 w-8" />
              {isLoading ? t('loadingJourney') : journey ? t('journeyTitle') : t('title')}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 md:p-8">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center min-h-[300px] text-center">
                <Loader2 className="h-16 w-16 animate-spin text-primary mb-6" />
                <p className="text-xl text-muted-foreground">{t('loadingJourney')}</p>
              </div>
            ) : journey ? (
              <div className="space-y-6">
                <div className="bg-muted/30 p-4 sm:p-6 rounded-lg text-sm md:text-base font-sans prose max-w-none prose-headings:text-primary prose-strong:text-foreground">
                  {renderJourney(journey)}
                </div>
                <Button onClick={handleTryAnother} size="lg" className="rounded-lg shadow-md w-full md:w-auto mx-auto flex items-center gap-2">
                  <RotateCcw className="h-5 w-5" />
                  {t('tryAnotherButton')}
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} ref={formRef} className="space-y-8">
                <div className="space-y-3">
                  <Label htmlFor="ai-prompt" className="text-lg font-medium text-foreground flex items-center gap-2">
                    <Feather className="h-5 w-5 text-primary" />
                    {t('promptLabel')}
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="ai-prompt"
                      type="text"
                      placeholder={t('promptPlaceholder')}
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      className="flex-grow rounded-lg shadow-sm"
                      required 
                      disabled={isLoading}
                    />
                    <Button type="submit" size="lg" className="rounded-lg shadow-md bg-primary hover:bg-primary/90" disabled={isLoading}>
                      <Wand2 className="mr-2 h-5 w-5" />
                      {t('generateButton')}
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-end">
                  <div className="space-y-2">
                    <Label htmlFor="num-people" className="flex items-center gap-2 text-foreground">
                      <Users className="h-5 w-5 text-primary" />
                      {t('numPeopleLabel')}
                    </Label>
                    <Input
                      id="num-people"
                      type="number"
                      min="1"
                      value={numberOfPeople}
                      onChange={(e) => setNumberOfPeople(parseInt(e.target.value, 10))}
                      className="rounded-lg shadow-sm"
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="arrival-date" className="flex items-center gap-2 text-foreground">
                      <CalendarIcon className="h-5 w-5 text-primary" />
                       {t('arrivalDateLabel')}
                    </Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={`w-full justify-start text-left font-normal rounded-lg shadow-sm ${!arrivalDate && "text-muted-foreground"}`}
                          id="arrival-date"
                          disabled={isLoading}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {arrivalDate ? format(arrivalDate, "PPP") : <span>{t('arrivalDatePlaceholder')}</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 bg-card border-border shadow-lg rounded-md">
                        <Calendar
                          mode="single"
                          selected={arrivalDate}
                          onSelect={setArrivalDate}
                          initialFocus
                          disabled={isLoading}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="daily-budget" className="flex items-center gap-2 text-foreground">
                      <DollarSign className="h-5 w-5 text-primary" />
                       {t('dailyBudgetLabel')}
                    </Label>
                    <Select 
                        value={dailyBudget} 
                        onValueChange={setDailyBudget}
                        disabled={isLoading}
                    >
                      <SelectTrigger className="w-full rounded-lg shadow-sm" id="daily-budget">
                        <SelectValue placeholder={t('dailyBudgetLabel')} />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-border shadow-lg rounded-md">
                        <SelectItem value="<$50">{t('budgetOption1')}</SelectItem>
                        <SelectItem value="$50-$100">{t('budgetOption2')}</SelectItem>
                        <SelectItem value="$100-$200">{t('budgetOption3')}</SelectItem>
                        <SelectItem value="$200+">{t('budgetOption4')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                    <div className="space-y-2">
                        <Label htmlFor="preferences" className="flex items-center gap-2 text-foreground">
                        <Feather className="h-5 w-5 text-primary" />
                        {t('preferencesLabel')}
                        </Label>
                        <Textarea
                        id="preferences"
                        placeholder={t('preferencesPlaceholder')}
                        value={preferences}
                        onChange={(e) => setPreferences(e.target.value)}
                        className="rounded-lg shadow-sm min-h-[100px]"
                        disabled={isLoading}
                        />
                    </div>
                    <div className="space-y-3 pt-2 md:pt-8"> {/* Adjusted padding for alignment */}
                        <div className="flex items-center space-x-3">
                            <Switch
                                id="vehicle-availability"
                                checked={vehicleAvailability}
                                onCheckedChange={setVehicleAvailability}
                                disabled={isLoading}
                            />
                            <Label htmlFor="vehicle-availability" className="flex items-center gap-2 text-foreground cursor-pointer">
                                <Car className="h-5 w-5 text-primary" />
                                {t('vehicleLabel')}
                            </Label>
                        </div>
                    </div>
                </div>


                {error && <p className="text-destructive text-center font-medium">{error}</p>}

              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
