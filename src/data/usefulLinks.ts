// src/data/usefulLinks.ts

interface UsefulLinkItem {
  text: Record<string, string>; // Translated link text
  url: string;
  icon: string; // Lucide icon name
}

export interface UsefulLinkCategory {
  categoryIcon: string; // Lucide icon name for the category
  title: Record<string, string>; // Translated category title
  description: Record<string, string>; // Translated category description
  links: UsefulLinkItem[];
}

export const usefulLinksData: UsefulLinkCategory[] = [
  {
    categoryIcon: 'Mountain',
    title: { 
      en: 'Hiking & Nature', 
      it: 'Escursionismo e Natura', 
      de: 'Wandern & Natur', 
      pl: 'Wędrówki i Przyroda', 
      fr: 'Randonnée et Nature', 
      es: 'Senderismo y Naturaleza' 
    },
    description: { 
      en: 'Find detailed maps of hiking trails, nature parks, and scenic walking routes across Croatia.', 
      it: 'Trova mappe dettagliate di sentieri escursionistici, parchi naturali e percorsi panoramici in Croazia.',
      de: 'Finden Sie detaillierte Karten von Wanderwegen, Naturparks und malerischen Wanderrouten in ganz Kroatien.',
      pl: 'Znajdź szczegółowe mapy szlaków turystycznych, parków przyrody i malowniczych tras spacerowych w całej Chorwacji.',
      fr: 'Trouvez des cartes détaillées des sentiers de randonnée, des parcs naturels et des itinéraires de promenade panoramiques à travers la Croatie.',
      es: 'Encuentre mapas detallados de rutas de senderismo, parques naturales y rutas panorámicas para caminar por Croacia.'
    },
    links: [
      { text: { en: 'HPS Hiking Map', it: 'Mappa Escursionistica HPS', de: 'HPS Wanderkarte', pl: 'Mapa Turystyczna HPS', fr: 'Carte de Randonnée HPS', es: 'Mapa de Senderismo HPS' }, url: 'https://planinarenje.hr/karte', icon: 'Map' },
      { text: { en: 'Croatian Parks', it: 'Parchi Croati', de: 'Kroatische Parks', pl: 'Chorwackie Parki', fr: 'Parcs Croates', es: 'Parques Croatas' }, url: 'https://www.parkovihrvatske.hr/homepage', icon: 'Trees' },
      { text: { en: 'Via Dinarica', it: 'Via Dinarica', de: 'Via Dinarica', pl: 'Via Dinarica', fr: 'Via Dinarica', es: 'Vía Dinarica' }, url: 'https://www.via-dinarica.org/hr/', icon: 'Route' },
    ],
  },
  {
    categoryIcon: 'CloudSun',
    title: { 
      en: 'Weather Forecasts', 
      it: 'Previsioni Meteo', 
      de: 'Wettervorhersagen', 
      pl: 'Prognozy Pogody', 
      fr: 'Prévisions Météorologiques', 
      es: 'Pronósticos del Tiempo' 
    },
    description: { 
      en: 'Get accurate weather forecasts to plan your outdoor adventures safely.', 
      it: 'Ottieni previsioni meteorologiche accurate per pianificare in sicurezza le tue avventure all\'aria aperta.',
      de: 'Erhalten Sie genaue Wettervorhersagen, um Ihre Outdoor-Abenteuer sicher zu planen.',
      pl: 'Uzyskaj dokładne prognozy pogody, aby bezpiecznie planować swoje przygody na świeżym powietrzu.',
      fr: 'Obtenez des prévisions météorologiques précises pour planifier vos aventures en plein air en toute sécurité.',
      es: 'Obtenga pronósticos meteorológicos precisos para planificar sus aventuras al aire libre de forma segura.'
    },
    links: [
      { text: { en: 'Meteo.hr - DHMZ', it: 'Meteo.hr - DHMZ', de: 'Meteo.hr - DHMZ', pl: 'Meteo.hr - DHMZ', fr: 'Meteo.hr - DHMZ', es: 'Meteo.hr - DHMZ' }, url: 'https://meteo.hr/', icon: 'Thermometer' },
      { text: { en: 'Yr.no (Croatia)', it: 'Yr.no (Croazia)', de: 'Yr.no (Kroatien)', pl: 'Yr.no (Chorwacja)', fr: 'Yr.no (Croatie)', es: 'Yr.no (Croacia)' }, url: 'https://www.yr.no/en/forecast/daily-table/2-3202220/Croatia/Grad%20Zagreb/Zagreb', icon: 'CloudDrizzle' },
      { text: { en: 'Windy.com', it: 'Windy.com', de: 'Windy.com', pl: 'Windy.com', fr: 'Windy.com', es: 'Windy.com' }, url: 'https://www.windy.com/', icon: 'Wind' },
    ],
  },
  {
    categoryIcon: 'Car',
    title: { 
      en: 'Transport & Traffic', 
      it: 'Trasporti e Traffico', 
      de: 'Transport & Verkehr', 
      pl: 'Transport i Ruch Drogowy', 
      fr: 'Transport et Trafic', 
      es: 'Transporte y Tráfico' 
    },
    description: { 
      en: 'Check road conditions, ferry schedules, public transport, and travel updates.', 
      it: 'Controlla le condizioni stradali, gli orari dei traghetti, i trasporti pubblici e gli aggiornamenti di viaggio.',
      de: 'Überprüfen Sie Straßenbedingungen, Fährpläne, öffentliche Verkehrsmittel und Reiseaktualisierungen.',
      pl: 'Sprawdź warunki drogowe, rozkłady promów, transport publiczny i aktualizacje dotyczące podróży.',
      fr: 'Vérifiez l\'état des routes, les horaires des ferries, les transports en commun et les mises à jour de voyage.',
      es: 'Consulte el estado de las carreteras, los horarios de los ferris, el transporte público y las actualizaciones de viaje.'
    },
    links: [
      { text: { en: 'HAK Road Conditions', it: 'Condizioni Stradali HAK', de: 'HAK Straßenbedingungen', pl: 'Warunki Drogowe HAK', fr: 'Conditions Routières HAK', es: 'Condiciones de Carretera HAK' }, url: 'https://www.hak.hr/info/stanje-na-cestama/', icon: 'TrafficCone' },
      { text: { en: 'HAK Live Cameras', it: 'Telecamere Live HAK', de: 'HAK Live-Kameras', pl: 'Kamery na Żywo HAK', fr: 'Caméras en Direct HAK', es: 'Cámaras en Vivo HAK' }, url: 'https://www.hak.hr/info/kamere/', icon: 'Camera' },
      { text: { en: 'Jadrolinija', it: 'Jadrolinija', de: 'Jadrolinija', pl: 'Jadrolinija', fr: 'Jadrolinija', es: 'Jadrolinija' }, url: 'https://www.jadrolinija.hr/', icon: 'Ship' }, 
      { text: { en: 'Croatia Bus', it: 'Croatia Bus', de: 'Croatia Bus', pl: 'Croatia Bus', fr: 'Croatia Bus', es: 'Croatia Bus' }, url: 'https://www.croatiabus.hr/', icon: 'Bus' },
      { text: { en: 'HŽ Passenger Rail', it: 'HŽ Trasporto Passeggeri', de: 'HŽ Personenverkehr', pl: 'HŽ Przewozy Pasażerskie', fr: 'HŽ Transport de Passagers', es: 'HŽ Transporte de Pasajeros' }, url: 'https://www.hzpp.hr/', icon: 'Train' },
    ],
  },
  {
    categoryIcon: 'Landmark',
    title: { 
      en: 'Tourist Info & Culture', 
      it: 'Info Turistiche e Cultura', 
      de: 'Touristeninfo & Kultur', 
      pl: 'Informacje Turystyczne i Kultura', 
      fr: 'Infos Touristiques et Culture', 
      es: 'Información Turística y Cultura' 
    },
    description: { 
      en: 'Explore official tourism guides, heritage sites, and local cultural highlights.', 
      it: 'Esplora guide turistiche ufficiali, siti patrimonio dell\'umanità e attrazioni culturali locali.',
      de: 'Entdecken Sie offizielle Tourismusführer, Kulturerbestätten und lokale kulturelle Highlights.',
      pl: 'Przeglądaj oficjalne przewodniki turystyczne, zabytki dziedzictwa kulturowego i lokalne atrakcje kulturalne.',
      fr: 'Explorez les guides touristiques officiels, les sites du patrimoine et les points forts culturels locaux.',
      es: 'Explore guías turísticas oficiales, sitios patrimoniales y destacados culturales locales.'
    },
    links: [
      { text: { en: 'Croatia.hr (Official Tourism)', it: 'Croatia.hr (Turismo Ufficiale)', de: 'Croatia.hr (Offizieller Tourismus)', pl: 'Croatia.hr (Oficjalna Turystyka)', fr: 'Croatia.hr (Tourisme Officiel)', es: 'Croatia.hr (Turismo Oficial)' }, url: 'https://croatia.hr/', icon: 'Globe' },
      { text: { en: 'UNESCO Croatia', it: 'UNESCO Croazia', de: 'UNESCO Kroatien', pl: 'UNESCO Chorwacja', fr: 'UNESCO Croatie', es: 'UNESCO Croacia' }, url: 'https://whc.unesco.org/en/statesparties/hr', icon: 'Building' },
      { text: { en: '[Regional Tourism Portals]', it: '[Portali Turistici Regionali]', de: '[Regionale Tourismusportale]', pl: '[Regionalne Portale Turystyczne]', fr: '[Portails Touristiques Régionaux]', es: '[Portales Turísticos Regionales]' }, url: '#', icon: 'BookOpen', description: {en: 'e.g., Visit Split, Visit Istria, Visit Dubrovnik', it: 'es., Visit Split, Visit Istria, Visit Dubrovnik', de: 'z.B. Visit Split, Visit Istria, Visit Dubrovnik', pl: 'np. Visit Split, Visit Istria, Visit Dubrovnik', fr: 'ex. Visit Split, Visit Istria, Visit Dubrovnik', es: 'ej. Visit Split, Visit Istria, Visit Dubrovnik'} },
    ],
  },
    {
    categoryIcon: 'Compass',
    title: { 
      en: 'Maps & Outdoor Navigation', 
      it: 'Mappe e Navigazione Outdoor', 
      de: 'Karten & Outdoor-Navigation', 
      pl: 'Mapy i Nawigacja Terenowa', 
      fr: 'Cartes et Navigation en Plein Air', 
      es: 'Mapas y Navegación al Aire Libre' 
    },
    description: { 
      en: 'Use detailed maps and apps for hiking, biking, or discovering new places.', 
      it: 'Usa mappe e app dettagliate per escursioni, ciclismo o per scoprire nuovi posti.',
      de: 'Verwenden Sie detaillierte Karten und Apps zum Wandern, Radfahren oder Entdecken neuer Orte.',
      pl: 'Korzystaj ze szczegółowych map i aplikacji do wędrówek pieszych, rowerowych lub odkrywania nowych miejsc.',
      fr: 'Utilisez des cartes et des applications détaillées pour la randonnée, le vélo ou la découverte de nouveaux lieux.',
      es: 'Utilice mapas y aplicaciones detallados para hacer senderismo, andar en bicicleta o descubrir nuevos lugares.'
    },
    links: [
      { text: { en: 'OpenStreetMap', it: 'OpenStreetMap', de: 'OpenStreetMap', pl: 'OpenStreetMap', fr: 'OpenStreetMap', es: 'OpenStreetMap' }, url: 'https://www.openstreetmap.org/', icon: 'Map' },
      { text: { en: 'Google Maps', it: 'Google Maps', de: 'Google Maps', pl: 'Google Maps', fr: 'Google Maps', es: 'Google Maps' }, url: 'https://maps.google.com/', icon: 'Navigation' },
      { text: { en: 'Komoot', it: 'Komoot', de: 'Komoot', pl: 'Komoot', fr: 'Komoot', es: 'Komoot' }, url: 'https://www.komoot.com/', icon: 'Bike' },
      { text: { en: 'AllTrails', it: 'AllTrails', de: 'AllTrails', pl: 'AllTrails', fr: 'AllTrails', es: 'AllTrails' }, url: 'https://www.alltrails.com/', icon: 'Footprints' },
    ],
  },
  {
    categoryIcon: 'BedDouble',
    title: { 
      en: 'Accommodation & Camping', 
      it: 'Alloggi e Campeggi', 
      de: 'Unterkunft & Camping', 
      pl: 'Zakwaterowanie i Kemping', 
      fr: 'Hébergement et Camping', 
      es: 'Alojamiento y Camping' 
    },
    description: { 
      en: 'Find places to stay, including hotels, private rentals, and campsites.', 
      it: 'Trova posti dove soggiornare, inclusi hotel, affitti privati e campeggi.',
      de: 'Finden Sie Übernachtungsmöglichkeiten, einschließlich Hotels, Privatvermietungen und Campingplätzen.',
      pl: 'Znajdź miejsca noclegowe, w tym hotele, kwatery prywatne i kempingi.',
      fr: 'Trouvez des lieux de séjour, y compris des hôtels, des locations privées et des campings.',
      es: 'Encuentre lugares para alojarse, incluidos hoteles, alquileres privados y campings.'
    },
    links: [
      { text: { en: 'Camping.hr', it: 'Camping.hr', de: 'Camping.hr', pl: 'Camping.hr', fr: 'Camping.hr', es: 'Camping.hr' }, url: 'https://www.camping.hr/', icon: 'Tent' },
      { text: { en: 'Booking.com', it: 'Booking.com', de: 'Booking.com', pl: 'Booking.com', fr: 'Booking.com', es: 'Booking.com' }, url: 'https://www.booking.com/', icon: 'Hotel' },
      { text: { en: 'Airbnb', it: 'Airbnb', de: 'Airbnb', pl: 'Airbnb', fr: 'Airbnb', es: 'Airbnb' }, url: 'https://www.airbnb.com/', icon: 'Home' },
    ],
  },
  {
    categoryIcon: 'ShieldAlert',
    title: { 
      en: 'Safety & Emergency Info', 
      it: 'Sicurezza e Info Emergenze', 
      de: 'Sicherheit & Notfallinfos', 
      pl: 'Bezpieczeństwo i Informacje Alarmowe', 
      fr: 'Sécurité et Informations d\'Urgence', 
      es: 'Seguridad e Información de Emergencia' 
    },
    description: { 
      en: 'Stay safe with essential contacts and travel advisories.', 
      it: 'Rimani al sicuro con contatti essenziali e avvisi di viaggio.',
      de: 'Bleiben Sie sicher mit wichtigen Kontakten und Reisehinweisen.',
      pl: 'Dbaj o bezpieczeństwo dzięki niezbędnym kontaktom i ostrzeżeniom podróżnym.',
      fr: 'Restez en sécurité avec les contacts essentiels et les conseils aux voyageurs.',
      es: 'Manténgase seguro con contactos esenciales y avisos de viaje.'
    },
    links: [
      { text: { en: '112.hr', it: '112.hr', de: '112.hr', pl: '112.hr', fr: '112.hr', es: '112.hr' }, url: 'https://112.hr/', icon: 'PhoneForwarded' },
      { text: { en: 'Croatia Travel Safe', it: 'Croazia Viaggia Sicuro', de: 'Kroatien Sicher Reisen', pl: 'Chorwacja Bezpieczne Podróże', fr: 'Croatie Voyagez en Sécurité', es: 'Croacia Viaje Seguro' }, url: 'https://www.safestayincroatia.hr/en', icon: 'AlertTriangle' },
    ],
  },
  {
    categoryIcon: 'Globe2',
    title: { 
      en: 'Useful Extras', 
      it: 'Extra Utili', 
      de: 'Nützliche Extras', 
      pl: 'Przydatne Dodatki', 
      fr: 'Extras Utiles', 
      es: 'Extras Útiles' 
    },
    description: { 
      en: 'Additional helpful tools for foreign travelers and digital nomads.', 
      it: 'Strumenti aggiuntivi utili per viaggiatori stranieri e nomadi digitali.',
      de: 'Zusätzliche hilfreiche Tools für ausländische Reisende und digitale Nomaden.',
      pl: 'Dodatkowe pomocne narzędzia dla zagranicznych podróżników i cyfrowych nomadów.',
      fr: 'Outils supplémentaires utiles pour les voyageurs étrangers et les nomades numériques.',
      es: 'Herramientas útiles adicionales para viajeros extranjeros y nómadas digitales.'
    },
    links: [
      { text: { en: 'Google Translate', it: 'Google Traduttore', de: 'Google Übersetzer', pl: 'Tłumacz Google', fr: 'Google Traduction', es: 'Traductor de Google' }, url: 'https://translate.google.com/', icon: 'Languages' },
      { text: { en: 'Ministry of Foreign Affairs (MVEP)', it: 'Ministero degli Affari Esteri (MVEP)', de: 'Außenministerium (MVEP)', pl: 'Ministerstwo Spraw Zagranicznych (MVEP)', fr: 'Ministère des Affaires Étrangères (MVEP)', es: 'Ministerio de Asuntos Exteriores (MVEP)' }, url: 'https://mvep.gov.hr/services-for-citizens/consular-information-22802/22802', icon: 'Landmark' },
      { text: { en: 'Eventim.hr', it: 'Eventim.hr', de: 'Eventim.hr', pl: 'Eventim.hr', fr: 'Eventim.hr', es: 'Eventim.hr' }, url: 'https://www.eventim.hr/', icon: 'Ticket' },
    ],
  },
];

