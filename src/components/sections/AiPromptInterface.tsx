"use client";

import type { FormEvent } from 'react';
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CalendarDays, Users, DollarSign, Car, Sparkles, Search } from "lucide-react";
import { format } from "date-fns";
import { useLanguage } from '@/contexts/LanguageContext';
import type { ReactNode } from 'react';

const translations = {
  planAdventure: {
    en: 'Plan Your Next Adventure',
    it: 'Pianifica la Tua Prossima Avventura',
    de: 'Planen Sie Ihr nächstes Abenteuer',
    pl: 'Zaplanuj Swoją Następną Przygodę',
    fr: 'Planifiez Votre Prochaine Aventure',
    es: 'Planifica Tu Próxima Aventura',
  },
  describeTrip: {
    en: 'Describe your dream trip, and let our AI craft the perfect itinerary for you.',
    it: 'Descrivi il viaggio dei tuoi sogni e lascia che la nostra IA crei l\'itinerario perfetto per te.',
    de: 'Beschreiben Sie Ihre Traumreise und lassen Sie unsere KI den perfekten Reiseplan für Sie erstellen.',
    pl: 'Opisz swoją wymarzoną podróż, a nasza sztuczna inteligencja stworzy dla Ciebie idealny plan podróży.',
    fr: 'Décrivez le voyage de vos rêves et laissez notre IA créer l\'itinéraire parfait pour vous.',
    es: 'Describe el viaje de tus sueños y deja que nuestra IA elabore el itinerario perfecto para ti.',
  },
  tellUsAboutTrip: {
    en: 'Tell us about your trip',
    it: 'Parlaci del tuo viaggio',
    de: 'Erzählen Sie uns von Ihrer Reise',
    pl: 'Opowiedz nam o swojej podróży',
    fr: 'Parlez-nous de votre voyage',
    es: 'Cuéntanos sobre tu viaje',
  },
  promptPlaceholder: {
    en: 'e.g., A relaxing 5-day beach vacation in Bali with some cultural experiences',
    it: 'es., Una rilassante vacanza al mare di 5 giorni a Bali con alcune esperienze culturali',
    de: 'z.B. Ein entspannender 5-tägiger Strandurlaub auf Bali mit einigen kulturellen Erlebnissen',
    pl: 'np. Relaksujące 5-dniowe wakacje na plaży na Bali z kilkoma doświadczeniami kulturalnymi',
    fr: 'par ex., Des vacances reposantes de 5 jours à la plage à Bali avec quelques expériences culturelles',
    es: 'p.ej., Unas relajantes vacaciones de 5 días en la playa en Bali con algunas experiencias culturales',
  },
  generateButton: {
    en: 'Generate',
    it: 'Genera',
    de: 'Generieren',
    pl: 'Generuj',
    fr: 'Générer',
    es: 'Generar',
  },
  numPeople: {
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
  pickADate: {
    en: 'Pick a date',
    it: 'Scegli una data',
    de: 'Wählen Sie ein Datum',
    pl: 'Wybierz datę',
    fr: 'Choisissez une date',
    es: 'Elige una fecha',
  },
  dailyBudget: {
    en: 'Daily Budget (per person)',
    it: 'Budget Giornaliero (a persona)',
    de: 'Tagesbudget (pro Person)',
    pl: 'Budżet Dzienny (na osobę)',
    fr: 'Budget Quotidien (par personne)',
    es: 'Presupuesto Diario (por persona)',
  },
  selectBudgetRange: {
    en: 'Select budget range',
    it: 'Seleziona fascia di budget',
    de: 'Wählen Sie den Budgetbereich',
    pl: 'Wybierz przedział budżetowy',
    fr: 'Sélectionnez la fourchette de budget',
    es: 'Selecciona el rango de presupuesto',
  },
  under50: { en: 'Under $50', it: 'Meno di $50', de: 'Unter $50', pl: 'Poniżej $50', fr: 'Moins de 50 $', es: 'Menos de $50' },
  '50-100': { en: '$50 - $100', it: '$50 - $100', de: '$50 - $100', pl: '$50 - $100', fr: '50 $ - 100 $', es: '$50 - $100' },
  '100-200': { en: '$100 - $200', it: '$100 - $200', de: '$100 - $200', pl: '$100 - $200', fr: '100 $ - 200 $', es: '$100 - $200' },
  over200: { en: 'Over $200', it: 'Oltre $200', de: 'Über $200', pl: 'Powyżej $200', fr: 'Plus de 200 $', es: 'Más de $200' },
  customAmount: { en: 'Custom Amount', it: 'Importo Personalizzato', de: 'Benutzerdefinierter Betrag', pl: 'Niestandardowa Kwota', fr: 'Montant Personnalisé', es: 'Cantidad Personalizada' },
  enterAvgDailyAmount: {
    en: 'Enter average daily amount',
    it: 'Inserisci importo medio giornaliero',
    de: 'Geben Sie den durchschnittlichen Tagesbetrag ein',
    pl: 'Wprowadź średnią dzienną kwotę',
    fr: 'Entrez le montant quotidien moyen',
    es: 'Introduce la cantidad diaria promedio',
  },
  vehicleAvailability: {
    en: 'Vehicle Availability',
    it: 'Disponibilità Veicolo',
    de: 'Fahrzeugverfügbarkeit',
    pl: 'Dostępność Pojazdu',
    fr: 'Disponibilité du Véhicule',
    es: 'Disponibilidad de Vehículo',
  },
  vehicleYes: {
    en: 'Yes, we have a vehicle',
    it: 'Sì, abbiamo un veicolo',
    de: 'Ja, wir haben ein Fahrzeug',
    pl: 'Tak, mamy pojazd',
    fr: 'Oui, nous avons un véhicule',
    es: 'Sí, tenemos un vehículo',
  },
  vehicleNo: {
    en: "No, we don't have a vehicle",
    it: 'No, non abbiamo un veicolo',
    de: 'Nein, wir haben kein Fahrzeug',
    pl: 'Nie, nie mamy pojazdu',
    fr: 'Non, nous n\'avons pas de véhicule',
    es: 'No, no tenemos vehículo',
  },
  preferences: {
    en: 'Preferences (Likes & Dislikes)',
    it: 'Preferenze (Piace e Non Piace)',
    de: 'Präferenzen (Vorlieben & Abneigungen)',
    pl: 'Preferencje (Co Lubisz i Czego Nie Lubisz)',
    fr: 'Préférences (Aime et N\'aime Pas)',
    es: 'Preferencias (Gustos y Disgustos)',
  },
  preferencesPlaceholder: {
    en: 'e.g., Love hiking and quiet beaches, dislike crowded tourist spots and spicy food.',
    it: 'es., Amo le escursioni e le spiagge tranquille, non mi piacciono i luoghi turistici affollati e il cibo piccante.',
    de: 'z.B. Liebe Wandern und ruhige Strände, mag keine überfüllten Touristenorte und scharfes Essen.',
    pl: 'np. Uwielbiam wędrówki i ciche plaże, nie lubię zatłoczonych miejsc turystycznych i pikantnego jedzenia.',
    fr: 'par ex., J\'adore la randonnée et les plages tranquilles, je n\'aime pas les sites touristiques bondés et la nourriture épicée.',
    es: 'p.ej., Me encanta el senderismo y las playas tranquilas, no me gustan los lugares turísticos concurridos ni la comida picante.',
  },
  aiSystemDescription: {
    en: 'Our custom-built AI system will use this data, combined with a location-specific prompt, to automatically generate up to three multi-day travel plans tailored to your group. Each plan includes destinations, travel time, cost estimates, nearby dining spots, and more.',
    it: 'Il nostro sistema IA personalizzato utilizzerà questi dati, combinati con un prompt specifico per la località, per generare automaticamente fino a tre piani di viaggio di più giorni su misura per il tuo gruppo. Ogni piano include destinazioni, tempi di viaggio, stime dei costi, ristoranti nelle vicinanze e altro ancora.',
    de: 'Unser maßgeschneidertes KI-System verwendet diese Daten in Kombination mit einer standortspezifischen Eingabeaufforderung, um automatisch bis zu drei mehrtägige Reisepläne zu erstellen, die auf Ihre Gruppe zugeschnitten sind. Jeder Plan enthält Ziele, Reisezeiten, Kostenvoranschläge, nahegelegene Restaurants und mehr.',
    pl: 'Nasz niestandardowy system AI wykorzysta te dane, w połączeniu z monitem specyficznym dla lokalizacji, aby automatycznie wygenerować do trzech wielodniowych planów podróży dostosowanych do Twojej grupy. Każdy plan obejmuje miejsca docelowe, czas podróży, szacunkowe koszty, pobliskie restauracje i wiele więcej.',
    fr: 'Notre système d\'IA personnalisé utilisera ces données, combinées à une invite spécifique à l\'emplacement, pour générer automatiquement jusqu\'à trois plans de voyage de plusieurs jours adaptés à votre groupe. Chaque plan comprend des destinations, des temps de trajet, des estimations de coûts, des restaurants à proximité, et plus encore.',
    es: 'Nuestro sistema de IA personalizado utilizará estos datos, combinados con una indicación específica de la ubicación, para generar automáticamente hasta tres planes de viaje de varios días adaptados a su grupo. Cada plan incluye destinos, tiempos de viaje, estimaciones de costos, lugares para comer cercanos y más.',
  },
};


export function AiPromptInterface() {
  const { selectedLanguage } = useLanguage();
  const [arrivalDate, setArrivalDate] = useState<Date | undefined>(undefined);
  const [numPeople, setNumPeople] = useState<string>("1");
  const [budgetOption, setBudgetOption] = useState<string | undefined>(undefined);
  const [customBudget, setCustomBudget] = useState<string>("");
  const [vehicleAvailable, setVehicleAvailable] = useState<boolean>(false);
  const [preferences, setPreferences] = useState<string>("");
  const [promptText, setPromptText] = useState<string>("");

  useEffect(() => {
    setArrivalDate(new Date());
  }, []);

  const getTranslation = (key: keyof typeof translations, subKey?: string) => {
    const mainKey = translations[key];
    if (subKey && typeof mainKey[subKey as keyof typeof mainKey] === 'object') {
      return mainKey[subKey as keyof typeof mainKey][selectedLanguage] || mainKey[subKey as keyof typeof mainKey]['en'];
    }
    return mainKey[selectedLanguage as keyof typeof mainKey] || mainKey['en'];
  };
  
  const t = (field: keyof typeof translations, subField?: string): string => {
    const dict = translations[field];
    if (subField && typeof dict[subField as keyof typeof dict] === 'object') {
         // @ts-ignore
        return dict[subField][selectedLanguage] || dict[subField]['en'];
    }
     // @ts-ignore
    return dict[selectedLanguage] || dict['en'];
  };


  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log("Form submitted (visually)");
    console.log({
      prompt: promptText,
      numberOfPeople: parseInt(numPeople, 10),
      arrivalDate: arrivalDate ? format(arrivalDate, "yyyy-MM-dd") : "",
      dailyBudget: budgetOption === "custom" ? customBudget : budgetOption,
      vehicleAvailability: vehicleAvailable,
      preferences: preferences,
    });
  };

  return (
    <section className="py-8 md:py-12 bg-background">
      <div className="container mx-auto px-4">
        <Card className="shadow-xl rounded-xl overflow-hidden">
          <CardHeader className="bg-muted/50 p-6">
            <CardTitle className="text-2xl md:text-3xl font-semibold text-primary flex items-center gap-2">
              <Sparkles className="h-8 w-8" />
              {t('planAdventure')}
            </CardTitle>
            <CardDescription className="text-base">
              {t('describeTrip')}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-3">
                <Label htmlFor="ai-prompt" className="text-lg font-medium flex items-center gap-2">
                  <Search className="h-5 w-5 text-primary" />
                  {t('tellUsAboutTrip')}
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="ai-prompt"
                    type="text"
                    placeholder={t('promptPlaceholder')}
                    value={promptText}
                    onChange={(e) => setPromptText(e.target.value)}
                    className="flex-grow text-base p-3 rounded-lg shadow-sm"
                  />
                  <Button type="submit" size="lg" className="rounded-lg shadow-sm flex items-center gap-2">
                    <Sparkles className="h-5 w-5" /> {t('generateButton')}
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t mt-6">
                <div className="space-y-2">
                  <Label htmlFor="num-people" className="flex items-center gap-2"><Users className="h-5 w-5 text-primary" />{t('numPeople')}</Label>
                  <Input
                    id="num-people"
                    type="number"
                    min="1"
                    value={numPeople}
                    onChange={(e) => setNumPeople(e.target.value)}
                    className="rounded-md shadow-sm"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="arrival-date" className="flex items-center gap-2"><CalendarDays className="h-5 w-5 text-primary" />{t('arrivalDateLabel')}</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className="w-full justify-start text-left font-normal rounded-md shadow-sm"
                        id="arrival-date"
                      >
                        <CalendarDays className="mr-2 h-4 w-4" />
                        {arrivalDate ? format(arrivalDate, "PPP") : <span>{t('pickADate')}</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={arrivalDate}
                        onSelect={setArrivalDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="daily-budget" className="flex items-center gap-2"><DollarSign className="h-5 w-5 text-primary" />{t('dailyBudget')}</Label>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Select value={budgetOption} onValueChange={setBudgetOption}>
                      <SelectTrigger className="rounded-md shadow-sm flex-grow">
                        <SelectValue placeholder={t('selectBudgetRange')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="&lt;50">{t('under50')}</SelectItem>
                        <SelectItem value="50-100">{t('50-100')}</SelectItem>
                        <SelectItem value="100-200">{t('100-200')}</SelectItem>
                        <SelectItem value="&gt;200">{t('over200')}</SelectItem>
                        <SelectItem value="custom">{t('customAmount')}</SelectItem>
                      </SelectContent>
                    </Select>
                    {budgetOption === "custom" && (
                      <Input
                        type="number"
                        placeholder={t('enterAvgDailyAmount')}
                        value={customBudget}
                        onChange={(e) => setCustomBudget(e.target.value)}
                        className="rounded-md shadow-sm flex-grow"
                      />
                    )}
                  </div>
                </div>
                
                <div className="space-y-2 flex flex-col items-start">
                  <Label htmlFor="vehicle-availability" className="flex items-center gap-2"><Car className="h-5 w-5 text-primary" />{t('vehicleAvailability')}</Label>
                  <div className="flex items-center space-x-2 p-2 border rounded-md shadow-sm bg-background w-full">
                    <Switch
                      id="vehicle-availability"
                      checked={vehicleAvailable}
                      onCheckedChange={setVehicleAvailable}
                    />
                    <Label htmlFor="vehicle-availability" className="text-sm">
                      {vehicleAvailable ? t('vehicleYes') : t('vehicleNo')}
                    </Label>
                  </div>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="preferences" className="flex items-center gap-2"><Sparkles className="h-5 w-5 text-primary" />{t('preferences')}</Label>
                  <Textarea
                    id="preferences"
                    placeholder={t('preferencesPlaceholder')}
                    value={preferences}
                    onChange={(e) => setPreferences(e.target.value)}
                    className="min-h-[100px] rounded-md shadow-sm"
                  />
                </div>
              </div>

              <div className="pt-6 border-t mt-6">
                <p className="text-sm text-muted-foreground italic leading-relaxed">
                  {t('aiSystemDescription')}
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}