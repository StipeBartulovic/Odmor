
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
    en: 'Create Your Dream Itinerary',
    it: 'Crea l\'Itinerario dei Tuoi Sogni',
    de: 'Erstellen Sie Ihre Traumroute',
    pl: 'Stwórz Swój Wymarzony Plan Podróży',
    fr: 'Créez Votre Itinéraire de Rêve',
    es: 'Crea el Itinerario de Tus Sueños',
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
  loadingItinerary: {
    en: 'Generating Your Itinerary...',
    it: 'Generazione del Tuo Itinerario...',
    de: 'Deine Reiseroute wird generiert...',
    pl: 'Generowanie Twojego Planu Podróży...',
    fr: 'Génération de Votre Itinéraire...',
    es: 'Generando Tu Itinerario...',
  },
  itineraryTitle: {
    en: 'Your Personalized Itinerary',
    it: 'Il Tuo Itinerario Personalizzato',
    de: 'Ihre Persönliche Reiseroute',
    pl: 'Twój Spersonalizowany Plan Podróży',
    fr: 'Votre Itinéraire Personnalisé',
    es: 'Tu Itinerario Personalizado',
  },
  tryAnotherButton: {
    en: 'Create Another Itinerary',
    it: 'Crea un Altro Itinerario',
    de: 'Weitere Reiseroute Erstellen',
    pl: 'Stwórz Kolejny Plan Podróży',
    fr: 'Créer un Autre Itinéraire',
    es: 'Crear Otro Itinerario',
  },
  noItinerary: {
    en: 'No itinerary generated yet. Fill out the form and click "Generate"!',
    it: 'Nessun itinerario generato ancora. Compila il modulo e clicca "Genera"!',
    de: 'Noch keine Reiseroute generiert. Füllen Sie das Formular aus und klicken Sie auf "Generieren"!',
    pl: 'Nie wygenerowano jeszcze planu podróży. Wypełnij formularz i kliknij "Generuj"!',
    fr: 'Aucun itinéraire généré pour le moment. Remplissez le formulaire et cliquez sur "Générer" !',
    es: 'Aún no se ha generado ningún itinerario. ¡Rellena el formulario y haz clic en "Generar"!',
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
    en: 'Error fetching itinerary',
    it: 'Errore nel recupero dell\'itinerario',
    de: 'Fehler beim Abrufen der Reiseroute',
    pl: 'Błąd podczas pobierania planu podróży',
    fr: 'Erreur lors de la récupération de l\'itinéraire',
    es: 'Error al obtener el itinerario',
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
  const [itinerary, setItinerary] = useState<string | null>(null);
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
    // Fallback if translation is missing or not a string
    return fieldKey.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
  };


  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setItinerary(null);
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

      const data: { myField: string } = await response.json();
      
      if (data && data.myField) {
        // The n8n workflow returns a string in "myField".
        // This string *might* be a JSON string itself (e.g., if $json.output was an object/array)
        // or it might be a plain text string.
        let itineraryContentToDisplay = data.myField;

        try {
            // Attempt to parse the content of myField.
            // If $json.output in n8n was an object/array, data.myField would be its stringified version.
            const parsedMyField = JSON.parse(data.myField);

            // If parsing is successful and the result is an object/array,
            // then we re-stringify it with pretty printing for display.
            if (typeof parsedMyField === 'object' && parsedMyField !== null) {
                itineraryContentToDisplay = JSON.stringify(parsedMyField, null, 2);
            } else {
                // If it parsed to a primitive (string, number, boolean), use its string representation.
                // This handles cases where $json.output was a primitive that got stringified.
                itineraryContentToDisplay = String(parsedMyField);
            }
        } catch (e) {
            // If JSON.parse(data.myField) fails, it means data.myField was already a plain string
            // (e.g., $json.output in n8n was a direct text string).
            // In this case, we use data.myField as is.
            itineraryContentToDisplay = data.myField;
        }
        setItinerary(itineraryContentToDisplay);
      } else {
        setItinerary(t('noItinerary'));
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
    setItinerary(null);
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
              {isLoading ? t('loadingItinerary') : itinerary ? t('itineraryTitle') : t('title')}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 md:p-8">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center min-h-[300px] text-center">
                <Loader2 className="h-16 w-16 animate-spin text-primary mb-6" />
                <p className="text-xl text-muted-foreground">{t('loadingItinerary')}</p>
              </div>
            ) : itinerary ? (
              <div className="space-y-6">
                <pre className="bg-muted/30 p-4 rounded-lg whitespace-pre-wrap text-sm md:text-base leading-relaxed font-sans text-foreground">
                  {itinerary}
                </pre>
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
