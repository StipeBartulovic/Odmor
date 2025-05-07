// src/data/tips.ts

interface TipLink {
  text: Record<string, string>; // Translated text
  url: string;
}

export interface Tip {
  icon?: string;
  title: Record<string, string>; // Translated title
  description: Record<string, string>; // Translated description
  link?: TipLink;
}

export interface TipCategory {
  icon: string;
  title: Record<string, string>; // Translated category title
  tips: Tip[];
}

export const tipsData: TipCategory[] = [
  {
    icon: 'Wrench',
    title: {
      en: 'Essentials',
      it: 'Essenziali',
      de: 'Grundlagen',
      pl: 'Niezbędniki',
      fr: 'Essentiels',
      es: 'Esenciales',
    },
    tips: [
      { 
        icon: 'ShieldAlert', 
        title: { en: 'Emergency Number', it: 'Numero di Emergenza', de: 'Notrufnummer', pl: 'Numer Alarmowy', fr: 'Numéro d\'Urgence', es: 'Número de Emergencia' }, 
        description: { en: 'Dial 112 for any urgent help (police, fire, ambulance).', it: 'Chiama il 112 per qualsiasi aiuto urgente (polizia, vigili del fuoco, ambulanza).', de: 'Wählen Sie 112 für dringende Hilfe (Polizei, Feuerwehr, Krankenwagen).', pl: 'Zadzwoń pod numer 112 w razie pilnej potrzeby pomocy (policja, straż pożarna, pogotowie ratunkowe).', fr: 'Composez le 112 pour toute aide urgente (police, pompiers, ambulance).', es: 'Marque el 112 para cualquier ayuda urgente (policía, bomberos, ambulancia).' }
      },
      { 
        icon: 'Droplets', 
        title: { en: 'Tap Water', it: 'Acqua del Rubinetto', de: 'Leitungswasser', pl: 'Woda Kranowa', fr: 'Eau du Robinet', es: 'Agua del Grifo' }, 
        description: { en: 'Tap water throughout Croatia is generally safe to drink.', it: 'L\'acqua del rubinetto in tutta la Croazia è generalmente sicura da bere.', de: 'Leitungswasser ist in ganz Kroatien im Allgemeinen trinkbar.', pl: 'Woda kranowa w całej Chorwacji jest ogólnie bezpieczna do picia.', fr: 'L\'eau du robinet dans toute la Croatie est généralement potable.', es: 'El agua del grifo en toda Croacia es generalmente segura para beber.' }
      },
      { 
        icon: 'Landmark', 
        title: { en: 'Cash is King', it: 'Contanti Re', de: 'Bargeld ist König', pl: 'Gotówka Króluje', fr: 'L\'argent Liquide est Roi', es: 'El Efectivo es el Rey' }, 
        description: { en: 'While cards are widely accepted, smaller establishments, markets, and some taxis may prefer or only accept cash. It\'s good to have some on hand.', it: 'Mentre le carte sono ampiamente accettate, esercizi più piccoli, mercati e alcuni taxi potrebbero preferire o accettare solo contanti. È bene averne un po\' a portata di mano.', de: 'Obwohl Karten weitgehend akzeptiert werden, bevorzugen kleinere Geschäfte, Märkte und einige Taxis möglicherweise Bargeld oder akzeptieren nur dieses. Es ist gut, etwas Bargeld dabei zu haben.', pl: 'Chociaż karty są powszechnie akceptowane, mniejsze lokale, targi i niektóre taksówki mogą preferować lub akceptować tylko gotówkę. Dobrze jest mieć trochę przy sobie.', fr: 'Bien que les cartes soient largement acceptées, les petits établissements, les marchés et certains taxis peuvent préférer ou n\'accepter que les espèces. Il est bon d\'en avoir sous la main.', es: 'Aunque las tarjetas son ampliamente aceptadas, los establecimientos más pequeños, los mercados y algunos taxis pueden preferir o solo aceptar efectivo. Es bueno tener algo a mano.' }
      },
      { 
        icon: 'ActivityIcon', 
        title: { en: 'Pharmacies (Ljekarna)', it: 'Farmacie (Ljekarna)', de: 'Apotheken (Ljekarna)', pl: 'Apteki (Ljekarna)', fr: 'Pharmacies (Ljekarna)', es: 'Farmacias (Ljekarna)' }, 
        description: { en: 'Pharmacies are the only place to buy most medicines (even basic painkillers sometimes) and often have limited working hours, especially on weekends. Look for a green cross sign.', it: 'Le farmacie sono l\'unico posto dove acquistare la maggior parte dei medicinali (a volte anche antidolorifici di base) e spesso hanno orari di apertura limitati, soprattutto nei fine settimana. Cerca un\'insegna con una croce verde.', de: 'Apotheken sind der einzige Ort, an dem die meisten Medikamente (manchmal sogar einfache Schmerzmittel) gekauft werden können und haben oft eingeschränkte Öffnungszeiten, besonders an Wochenenden. Achten Sie auf ein grünes Kreuzzeichen.', pl: 'Apteki to jedyne miejsce, gdzie można kupić większość leków (czasem nawet podstawowe środki przeciwbólowe) i często mają ograniczone godziny pracy, zwłaszcza w weekendy. Szukaj znaku zielonego krzyża.', fr: 'Les pharmacies sont le seul endroit où acheter la plupart des médicaments (parfois même des analgésiques de base) et ont souvent des horaires d\'ouverture limités, surtout le week-end. Cherchez un panneau avec une croix verte.', es: 'Las farmacias son el único lugar para comprar la mayoría de los medicamentos (a veces incluso analgésicos básicos) y suelen tener horarios limitados, especialmente los fines de semana. Busque una señal de cruz verde.' }
      },
      { 
        icon: 'Clock', 
        title: { en: 'Shop & Café Hours', it: 'Orari Negozi e Caffè', de: 'Öffnungszeiten von Geschäften und Cafés', pl: 'Godziny Otwarcia Sklepów i Kawiarni', fr: 'Horaires des Magasins et Cafés', es: 'Horarios de Tiendas y Cafeterías' }, 
        description: { en: 'Supermarkets & cafés may close on Sundays or have reduced hours. Many shops close after 8 PM. Smaller shops might observe a "pauza" (mid-day break), especially in smaller towns.', it: 'Supermercati e caffè potrebbero chiudere la domenica o avere orari ridotti. Molti negozi chiudono dopo le 20:00. I negozi più piccoli potrebbero osservare una "pauza" (pausa pranzo), soprattutto nelle città più piccole.', de: 'Supermärkte und Cafés können sonntags geschlossen sein oder reduzierte Öffnungszeiten haben. Viele Geschäfte schließen nach 20 Uhr. Kleinere Geschäfte können eine "Pauza" (Mittagspause) einlegen, besonders in kleineren Städten.', pl: 'Supermarkety i kawiarnie mogą być zamknięte w niedziele lub mieć skrócone godziny pracy. Wiele sklepów zamyka się po 20:00. Mniejsze sklepy mogą mieć "pauzę" (przerwę obiadową), zwłaszcza w mniejszych miejscowościach.', fr: 'Les supermarchés et les cafés peuvent fermer le dimanche ou avoir des horaires réduits. De nombreux magasins ferment après 20h. Les petits magasins peuvent observer une "pauza" (pause de midi), surtout dans les petites villes.', es: 'Los supermercados y cafeterías pueden cerrar los domingos o tener horarios reducidos. Muchas tiendas cierran después de las 8 PM. Las tiendas más pequeñas pueden observar una "pauza" (descanso de mediodía), especialmente en pueblos más pequeños.' }
      },
    ],
  },
  {
    icon: 'CarFront',
    title: { en: 'Transport & Navigation', it: 'Trasporti e Navigazione', de: 'Transport & Navigation', pl: 'Transport i Nawigacja', fr: 'Transport et Navigation', es: 'Transporte y Navegación' },
    tips: [
      { 
        icon: 'Smartphone', 
        title: { en: 'Ride-Sharing Apps', it: 'App di Ride-Sharing', de: 'Fahrdienst-Apps', pl: 'Aplikacje do Wspólnych Przejazdów', fr: 'Applications de Covoiturage', es: 'Aplicaciones de Viajes Compartidos' }, 
        description: { en: 'Uber and Bolt are available in major cities like Zagreb, Split, Dubrovnik, and Rijeka. Check availability for your specific location as coverage can vary.', it: 'Uber e Bolt sono disponibili nelle principali città come Zagabria, Spalato, Dubrovnik e Fiume. Verifica la disponibilità per la tua località specifica poiché la copertura può variare.', de: 'Uber und Bolt sind in Großstädten wie Zagreb, Split, Dubrovnik und Rijeka verfügbar. Überprüfen Sie die Verfügbarkeit für Ihren spezifischen Standort, da die Abdeckung variieren kann.', pl: 'Uber i Bolt są dostępne w większych miastach, takich jak Zagrzeb, Split, Dubrownik i Rijeka. Sprawdź dostępność w swojej konkretnej lokalizacji, ponieważ zasięg może się różnić.', fr: 'Uber et Bolt sont disponibles dans les grandes villes comme Zagreb, Split, Dubrovnik et Rijeka. Vérifiez la disponibilité pour votre emplacement spécifique car la couverture peut varier.', es: 'Uber y Bolt están disponibles en las principales ciudades como Zagreb, Split, Dubrovnik y Rijeka. Verifique la disponibilidad para su ubicación específica, ya que la cobertura puede variar.' }
      },
      { 
        icon: 'Phone', 
        title: { en: 'Local Taxis', it: 'Taxi Locali', de: 'Lokale Taxis', pl: 'Lokalne Taksówki', fr: 'Taxis Locaux', es: 'Taxis Locales' }, 
        description: { en: 'If ride-sharing is unavailable, look for local taxi numbers. It\'s advisable to agree on a price beforehand or ensure the meter is running.', it: 'Se il ride-sharing non è disponibile, cerca i numeri dei taxi locali. È consigliabile concordare un prezzo in anticipo o assicurarsi che il tassametro sia in funzione.', de: 'Wenn keine Fahrdienste verfügbar sind, suchen Sie nach lokalen Taxinummern. Es ist ratsam, im Voraus einen Preis zu vereinbaren oder sicherzustellen, dass das Taxameter läuft.', pl: 'Jeśli aplikacje do wspólnych przejazdów są niedostępne, poszukaj numerów lokalnych taksówek. Zaleca się uzgodnienie ceny z góry lub upewnienie się, że taksometr jest włączony.', fr: 'Si le covoiturage n\'est pas disponible, recherchez les numéros de taxi locaux. Il est conseillé de convenir d\'un prix à l\'avance ou de s\'assurer que le compteur tourne.', es: 'Si el viaje compartido no está disponible, busque números de taxi locales. Es aconsejable acordar un precio de antemano o asegurarse de que el taxímetro esté funcionando.' }
      },
      { 
        icon: 'TrafficCone', 
        title: { en: 'No Right on Red', it: 'Divieto di Svolta a Destra con Rosso', de: 'Kein Rechtsabbiegen bei Rot', pl: 'Zakaz Skrętu w Prawo na Czerwonym', fr: 'Pas de Virage à Droite au Rouge', es: 'No Girar a la Derecha en Rojo' }, 
        description: { en: 'Unlike in some countries (e.g., the US), turning right on a red traffic light is generally not allowed unless a specific green arrow signal explicitly permits it.', it: 'A differenza di alcuni paesi (ad es. gli Stati Uniti), svoltare a destra con il semaforo rosso non è generalmente consentito a meno che una specifica freccia verde non lo permetta esplicitamente.', de: 'Anders als in einigen Ländern (z. B. den USA) ist das Rechtsabbiegen bei roter Ampel im Allgemeinen nicht erlaubt, es sei denn, ein grüner Pfeil erlaubt es ausdrücklich.', pl: 'W przeciwieństwie do niektórych krajów (np. USA), skręcanie w prawo na czerwonym świetle jest generalnie niedozwolone, chyba że specjalny sygnał zielonej strzałki wyraźnie na to pozwala.', fr: 'Contrairement à certains pays (par exemple, les États-Unis), il n\'est généralement pas permis de tourner à droite à un feu rouge, sauf si un signal de flèche verte spécifique l\'autorise explicitement.', es: 'A diferencia de algunos países (por ejemplo, EE. UU.), generalmente no se permite girar a la derecha en un semáforo en rojo a menos que una señal de flecha verde específica lo permita explícitamente.' }
      },
      { 
        icon: 'Ship', 
        title: { en: 'Ferry Tickets', it: 'Biglietti Traghetti', de: 'Fährtickets', pl: 'Bilety Promowe', fr: 'Billets de Ferry', es: 'Billetes de Ferry' }, 
        description: { en: 'For ferries to islands (e.g., Hvar, Brač, Korčula), book tickets online in advance, especially during peak season (June-August).', it: 'Per i traghetti verso le isole (ad es. Hvar, Brač, Korčula), prenota i biglietti online in anticipo, soprattutto durante l\'alta stagione (giugno-agosto).', de: 'Für Fähren zu Inseln (z. B. Hvar, Brač, Korčula) buchen Sie Tickets online im Voraus, besonders während der Hochsaison (Juni-August).', pl: 'Na promy na wyspy (np. Hvar, Brač, Korčula) rezerwuj bilety online z wyprzedzeniem, zwłaszcza w szczycie sezonu (czerwiec-sierpień).', fr: 'Pour les ferries vers les îles (par exemple, Hvar, Brač, Korčula), réservez vos billets en ligne à l\'avance, surtout pendant la haute saison (juin-août).', es: 'Para los ferris a las islas (por ejemplo, Hvar, Brač, Korčula), compre los billetes en línea con antelación, especialmente durante la temporada alta (junio-agosto).' },
        link: { text: { en: 'Jadrolinija (Main Ferry Operator)', it: 'Jadrolinija (Principale Operatore Traghetti)', de: 'Jadrolinija (Hauptfährbetreiber)', pl: 'Jadrolinija (Główny Operator Promowy)', fr: 'Jadrolinija (Principal Opérateur de Ferry)', es: 'Jadrolinija (Principal Operador de Ferris)' }, url: 'https://www.jadrolinija.hr/' }
      },
      { 
        icon: 'Bike', 
        title: { en: 'Hiking & Biking Trails', it: 'Sentieri Escursionistici e Ciclabili', de: 'Wander- & Radwege', pl: 'Szlaki Piesze i Rowerowe', fr: 'Sentiers de Randonnée et Pistes Cyclables', es: 'Rutas de Senderismo y Ciclismo' }, 
        description: { en: 'Croatia offers numerous scenic trails. Check local tourist office maps, or use apps like AllTrails or Komoot for routes and conditions.', it: 'La Croazia offre numerosi sentieri panoramici. Controlla le mappe degli uffici turistici locali o usa app come AllTrails o Komoot per percorsi e condizioni.', de: 'Kroatien bietet zahlreiche malerische Wanderwege. Überprüfen Sie die Karten der lokalen Tourismusbüros oder verwenden Sie Apps wie AllTrails oder Komoot für Routen und Bedingungen.', pl: 'Chorwacja oferuje liczne malownicze szlaki. Sprawdź mapy lokalnych biur informacji turystycznej lub użyj aplikacji takich jak AllTrails lub Komoot, aby znaleźć trasy i warunki.', fr: 'La Croatie offre de nombreux sentiers panoramiques. Consultez les cartes des offices de tourisme locaux ou utilisez des applications comme AllTrails ou Komoot pour les itinéraires et les conditions.', es: 'Croacia ofrece numerosas rutas panorámicas. Consulte los mapas de las oficinas de turismo locales o use aplicaciones como AllTrails o Komoot para rutas y condiciones.' },
        link: { text: { en: 'AllTrails Croatia', it: 'AllTrails Croazia', de: 'AllTrails Kroatien', pl: 'AllTrails Chorwacja', fr: 'AllTrails Croatie', es: 'AllTrails Croacia' }, url: 'https://www.alltrails.com/croatia' }
      },
      { 
        icon: 'Squirrel', 
        title: { en: 'Wildlife Caution', it: 'Attenzione alla Fauna Selvatica', de: 'Vorsicht vor Wildtieren', pl: 'Ostrożnie z Dziką Przyrodą', fr: 'Attention à la Faune', es: 'Precaución con la Vida Silvestre' }, 
        description: { en: 'When hiking in forests or rural areas, be aware of wildlife. Adders (poskok) are venomous snakes but shy; wear sturdy shoes. Ticks are common in grassy/wooded areas. Wild boars are present but usually avoid humans. Stick to marked trails.', it: 'Durante le escursioni in foreste o aree rurali, fai attenzione alla fauna selvatica. Le vipere (poskok) sono serpenti velenosi ma timidi; indossa scarpe robuste. Le zecche sono comuni nelle aree erbose/boscose. I cinghiali sono presenti ma di solito evitano gli umani. Segui i sentieri segnalati.', de: 'Seien Sie beim Wandern in Wäldern oder ländlichen Gebieten auf Wildtiere achten. Vipern (Poskok) sind giftige Schlangen, aber scheu; tragen Sie festes Schuhwerk. Zecken sind in grasbewachsenen/bewaldeten Gebieten verbreitet. Wildschweine sind vorhanden, meiden aber normalerweise Menschen. Bleiben Sie auf markierten Wegen.', pl: 'Podczas wędrówek po lasach lub terenach wiejskich uważaj na dziką przyrodę. Żmije (poskok) są jadowitymi wężami, ale płochliwymi; noś solidne buty. Kleszcze są powszechne na obszarach trawiastych/leśnych. Dzikie dziki są obecne, ale zwykle unikają ludzi. Trzymaj się oznakowanych szlaków.', fr: 'Lors de randonnées en forêt ou en zone rurale, soyez conscient de la faune. Les vipères (poskok) sont des serpents venimeux mais timides ; portez des chaussures solides. Les tiques sont courantes dans les zones herbeuses/boisées. Les sangliers sont présents mais évitent généralement les humains. Restez sur les sentiers balisés.', es: 'Al hacer senderismo en bosques o áreas rurales, tenga cuidado con la vida silvestre. Las víboras (poskok) son serpientes venenosas pero tímidas; use zapatos resistentes. Las garrapatas son comunes en áreas cubiertas de hierba/boscosas. Los jabalíes están presentes pero generalmente evitan a los humanos. Manténgase en los senderos marcados.' }
      },
    ],
  },
  {
    icon: 'PlugZap',
    title: { en: 'Accommodation & Power', it: 'Alloggio e Alimentazione', de: 'Unterkunft & Strom', pl: 'Zakwaterowanie i Zasilanie', fr: 'Hébergement et Électricité', es: 'Alojamiento y Electricidad' },
    tips: [
      { 
        icon: 'Power', 
        title: { en: 'Electrical Devices (Voltage)', it: 'Dispositivi Elettrici (Voltaggio)', de: 'Elektrische Geräte (Spannung)', pl: 'Urządzenia Elektryczne (Napięcie)', fr: 'Appareils Électriques (Tension)', es: 'Dispositivos Eléctricos (Voltaje)' }, 
        description: { en: 'Croatia uses 230V/50Hz. High-power devices from North America (110V) like hair dryers or curling irons require a voltage converter, not just a plug adapter, unless they are dual voltage. Check the device label.', it: 'La Croazia utilizza 230V/50Hz. I dispositivi ad alta potenza del Nord America (110V) come asciugacapelli o arricciacapelli richiedono un convertitore di tensione, non solo un adattatore per presa, a meno che non siano a doppia tensione. Controlla l\'etichetta del dispositivo.', de: 'Kroatien verwendet 230V/50Hz. Hochleistungsgeräte aus Nordamerika (110V) wie Haartrockner oder Lockenstäbe benötigen einen Spannungswandler, nicht nur einen Steckeradapter, es sei denn, sie sind für Doppelspannung ausgelegt. Überprüfen Sie das Etikett des Geräts.', pl: 'Chorwacja używa napięcia 230V/50Hz. Urządzenia o dużej mocy z Ameryki Północnej (110V), takie jak suszarki do włosów czy lokówki, wymagają konwertera napięcia, a nie tylko adaptera wtyczki, chyba że są dwunapięciowe. Sprawdź etykietę urządzenia.', fr: 'La Croatie utilise du 230V/50Hz. Les appareils à haute puissance d\'Amérique du Nord (110V) comme les sèche-cheveux ou les fers à friser nécessitent un convertisseur de tension, pas seulement un adaptateur de prise, sauf s\'ils sont à double tension. Vérifiez l\'étiquette de l\'appareil.', es: 'Croacia utiliza 230V/50Hz. Los dispositivos de alta potencia de América del Norte (110V) como secadores de pelo o rizadores requieren un convertidor de voltaje, no solo un adaptador de enchufe, a menos que sean de doble voltaje. Revise la etiqueta del dispositivo.' }
      },
      { 
        icon: 'BatteryCharging', 
        title: { en: 'Voltage Converters vs. Adapters', it: 'Convertitori di Tensione vs. Adattatori', de: 'Spannungswandler vs. Adapter', pl: 'Konwertery Napięcia a Adaptery', fr: 'Convertisseurs de Tension vs Adaptateurs', es: 'Convertidores de Voltaje vs. Adaptadores' }, 
        description: { en: 'A plug adapter only changes the pin shape, a voltage converter changes the electricity. Most modern electronics (laptops, phone chargers) are dual voltage and only need an adapter.', it: 'Un adattatore per presa cambia solo la forma dei pin, un convertitore di tensione cambia l\'elettricità. La maggior parte dell\'elettronica moderna (laptop, caricabatterie per telefoni) è a doppia tensione e necessita solo di un adattatore.', de: 'Ein Steckeradapter ändert nur die Stiftform, ein Spannungswandler ändert die Elektrizität. Die meisten modernen Elektronikgeräte (Laptops, Telefonladegeräte) sind für Doppelspannung ausgelegt und benötigen nur einen Adapter.', pl: 'Adapter wtyczki zmienia tylko kształt pinów, konwerter napięcia zmienia prąd. Większość nowoczesnej elektroniki (laptopy, ładowarki do telefonów) jest dwunapięciowa i potrzebuje tylko adaptera.', fr: 'Un adaptateur de prise change uniquement la forme des broches, un convertisseur de tension change l\'électricité. La plupart des appareils électroniques modernes (ordinateurs portables, chargeurs de téléphone) sont à double tension et n\'ont besoin que d\'un adaptateur.', es: 'Un adaptador de enchufe solo cambia la forma de las clavijas, un convertidor de voltaje cambia la electricidad. La mayoría de los aparatos electrónicos modernos (portátiles, cargadores de teléfonos) son de doble voltaje y solo necesitan un adaptador.' }
      },
      { 
        icon: 'Plug', 
        title: { en: 'Socket Type', it: 'Tipo di Presa', de: 'Steckdosentyp', pl: 'Typ Gniazdka', fr: 'Type de Prise', es: 'Tipo de Enchufe' }, 
        description: { en: 'Sockets are standard European Type C (Europlug) and Type F (Schuko). ', it: 'Le prese sono di tipo europeo standard C (Europlug) e F (Schuko). ', de: 'Steckdosen sind Standard-Europastecker Typ C (Eurostecker) und Typ F (Schuko). ', pl: 'Gniazdka są standardowego typu europejskiego C (Europlug) i F (Schuko). ', fr: 'Les prises sont de type européen standard C (Europlug) et F (Schuko). ', es: 'Los enchufes son de tipo europeo estándar C (Europlug) y F (Schuko). ' }
      },
    ],
  },
  {
    icon: 'Utensils',
    title: { en: 'Dining & Culture', it: 'Ristorazione e Cultura', de: 'Essen & Kultur', pl: 'Gastronomia i Kultura', fr: 'Restauration et Culture', es: 'Gastronomía y Cultura' },
    tips: [
      { 
        icon: 'Coins', 
        title: { en: 'Tipping', it: 'Mance', de: 'Trinkgeld', pl: 'Napiwki', fr: 'Pourboires', es: 'Propinas' }, 
        description: { en: 'Tipping is appreciated for good service but not always mandatory. 5–10% is a polite gesture in restaurants. Rounding up the bill is common in cafes and bars.', it: 'La mancia è apprezzata per un buon servizio ma non sempre obbligatoria. Il 5–10% è un gesto educato nei ristoranti. Arrotondare il conto è comune nei caffè e nei bar.', de: 'Trinkgeld wird für guten Service geschätzt, ist aber nicht immer obligatorisch. 5–10 % sind eine höfliche Geste in Restaurants. Das Aufrunden der Rechnung ist in Cafés und Bars üblich.', pl: 'Napiwki są doceniane za dobrą obsługę, ale nie zawsze obowiązkowe. 5–10% to uprzejmy gest w restauracjach. Zaokrąglanie rachunku jest powszechne w kawiarniach i barach.', fr: 'Les pourboires sont appréciés pour un bon service mais ne sont pas toujours obligatoires. 5 à 10 % est un geste poli dans les restaurants. Arrondir l\'addition est courant dans les cafés et les bars.', es: 'Las propinas se agradecen por un buen servicio, pero no siempre son obligatorias. Un 5–10% es un gesto cortés en los restaurantes. Redondear la cuenta es común en cafés y bares.' }
      },
      { 
        icon: 'Receipt', 
        title: { en: 'Getting the Bill', it: 'Chiedere il Conto', de: 'Die Rechnung bekommen', pl: 'Proszenie o Rachunek', fr: 'Demander l\'Addition', es: 'Pedir la Cuenta' }, 
        description: { en: 'Waitstaff usually won’t bring the bill automatically. You’ll need to politely ask for it: "Račun, molim" (rah-choon, mo-leem).', it: 'I camerieri di solito non portano il conto automaticamente. Dovrai chiederlo educatamente: "Račun, molim" (rah-choon, mo-leem).', de: 'Das Personal bringt die Rechnung normalerweise nicht automatisch. Sie müssen höflich danach fragen: „Račun, molim“ (rah-tschun, mo-liem).', pl: 'Kelnerzy zwykle nie przynoszą rachunku automatycznie. Będziesz musiał grzecznie o niego poprosić: „Račun, molim” (ra-czun, mo-lim).', fr: 'Les serveurs n\'apportent généralement pas l\'addition automatiquement. Vous devrez la demander poliment : "Račun, molim" (ra-tchoune, mo-lime).', es: 'Los camareros generalmente no traen la cuenta automáticamente. Tendrás que pedirla cortésmente: "Račun, molim" (ra-chún, mo-lim).' }
      },
      { 
        icon: 'CigaretteOff', 
        title: { en: 'Smoking Regulations', it: 'Regolamenti sul Fumo', de: 'Rauchvorschriften', pl: 'Przepisy Dotyczące Palenia', fr: 'Réglementation sur le Tabagisme', es: 'Regulaciones sobre Fumar' }, 
        description: { en: 'Smoking indoors is generally not allowed in restaurants and most cafes. However, many establishments have outdoor seating (terraces) where smoking is permitted.', it: 'Fumare al chiuso non è generalmente consentito nei ristoranti e nella maggior parte dei caffè. Tuttavia, molti esercizi dispongono di posti a sedere all\'aperto (terrazze) dove è consentito fumare.', de: 'Das Rauchen in Innenräumen ist in Restaurants und den meisten Cafés generell nicht gestattet. Viele Einrichtungen verfügen jedoch über Sitzgelegenheiten im Freien (Terrassen), wo das Rauchen erlaubt ist.', pl: 'Palenie w pomieszczeniach jest generalnie zabronione w restauracjach i większości kawiarni. Jednak wiele lokali posiada miejsca do siedzenia na zewnątrz (tarasy), gdzie palenie jest dozwolone.', fr: 'Il est généralement interdit de fumer à l\'intérieur des restaurants et de la plupart des cafés. Cependant, de nombreux établissements disposent de terrasses où il est permis de fumer.', es: 'Generalmente no se permite fumar en interiores en restaurantes y la mayoría de las cafeterías. Sin embargo, muchos establecimientos tienen asientos al aire libre (terrazas) donde se permite fumar.' }
      },
      { 
        icon: 'MessageSquare', 
        title: { en: 'Communication Apps', it: 'App di Comunicazione', de: 'Kommunikations-Apps', pl: 'Aplikacje Komunikacyjne', fr: 'Applications de Communication', es: 'Aplicaciones de Comunicación' }, 
        description: { en: 'WhatsApp and Viber are very commonly used for communication, often preferred over SMS.', it: 'WhatsApp e Viber sono molto usati per comunicare, spesso preferiti agli SMS.', de: 'WhatsApp und Viber werden sehr häufig zur Kommunikation verwendet und oft SMS vorgezogen.', pl: 'WhatsApp i Viber są bardzo powszechnie używane do komunikacji, często preferowane zamiast SMS-ów.', fr: 'WhatsApp et Viber sont très couramment utilisés pour la communication, souvent préférés aux SMS.', es: 'WhatsApp y Viber se usan muy comúnmente para la comunicación, a menudo preferidos sobre los SMS.' }
      },
      { 
        icon: 'Languages', 
        title: { en: 'Language Basics', it: 'Basi Linguistiche', de: 'Sprachgrundlagen', pl: 'Podstawy Językowe', fr: 'Bases Linguistiques', es: 'Conceptos Básicos del Idioma' }, 
        description: { en: 'The official language is Croatian. Many people in tourist areas speak English. Basic German or Italian is also spoken, especially in Istria and Kvarner. Learning a few Croatian phrases like "Dobar dan" (Good day) and "Hvala" (Thank you) is appreciated.', it: 'La lingua ufficiale è il croato. Molte persone nelle aree turistiche parlano inglese. Si parla anche tedesco o italiano di base, specialmente in Istria e nel Quarnero. Imparare alcune frasi croate come "Dobar dan" (Buongiorno) e "Hvala" (Grazie) è apprezzato.', de: 'Die Amtssprache ist Kroatisch. Viele Menschen in Touristengebieten sprechen Englisch. Grundkenntnisse in Deutsch oder Italienisch sind ebenfalls verbreitet, besonders in Istrien und Kvarner. Das Erlernen einiger kroatischer Sätze wie „Dobar dan“ (Guten Tag) und „Hvala“ (Danke) wird geschätzt.', pl: 'Językiem urzędowym jest chorwacki. Wiele osób w rejonach turystycznych mówi po angielsku. Podstawowy niemiecki lub włoski jest również używany, zwłaszcza w Istrii i Kvarnerze. Nauka kilku zwrotów po chorwacku, takich jak „Dobar dan“ (Dzień dobry) i „Hvala“ (Dziękuję), jest mile widziana.', fr: 'La langue officielle est le croate. De nombreuses personnes dans les zones touristiques parlent anglais. L\'allemand ou l\'italien de base sont également parlés, en particulier en Istrie et à Kvarner. Apprendre quelques phrases en croate comme "Dobar dan" (Bonjour) et "Hvala" (Merci) est apprécié.', es: 'El idioma oficial es el croata. Muchas personas en zonas turísticas hablan inglés. También se habla alemán o italiano básico, especialmente en Istria y Kvarner. Se agradece aprender algunas frases en croata como "Dobar dan" (Buenos días) y "Hvala" (Gracias).' }
      },
    ],
  },
  {
    icon: 'Umbrella',
    title: { en: 'Beach & Outdoor Advice', it: 'Consigli Spiaggia e All\'Aperto', de: 'Strand- & Outdoor-Tipps', pl: 'Porady Plażowe i Outdoorowe', fr: 'Conseils Plage et Plein Air', es: 'Consejos de Playa y Aire Libre' },
    tips: [
      { 
        icon: 'Sun', 
        title: { en: 'Sun Protection', it: 'Protezione Solare', de: 'Sonnenschutz', pl: 'Ochrona Przeciwsłoneczna', fr: 'Protection Solaire', es: 'Protección Solar' }, 
        description: { en: 'Sunscreen, hats, and sunglasses are essential, especially during summer months (June-September). The Adriatic sun can be very strong.', it: 'Crema solare, cappelli e occhiali da sole sono essenziali, soprattutto durante i mesi estivi (giugno-settembre). Il sole adriatico può essere molto forte.', de: 'Sonnencreme, Hüte und Sonnenbrillen sind unerlässlich, besonders in den Sommermonaten (Juni-September). Die Adriasonne kann sehr stark sein.', pl: 'Krem z filtrem, kapelusze i okulary przeciwsłoneczne są niezbędne, zwłaszcza w miesiącach letnich (czerwiec-wrzesień). Słońce nad Adriatykiem może być bardzo silne.', fr: 'La crème solaire, les chapeaux et les lunettes de soleil sont essentiels, surtout pendant les mois d\'été (juin-septembre). Le soleil de l\'Adriatique peut être très fort.', es: 'El protector solar, los sombreros y las gafas de sol son esenciales, especialmente durante los meses de verano (junio-septiembre). El sol del Adriático puede ser muy fuerte.' }
      },
      { 
        icon: 'Footprints', 
        title: { en: 'Water Shoes', it: 'Scarpe da Acqua', de: 'Wasserschuhe', pl: 'Buty do Wody', fr: 'Chaussures d\'Eau', es: 'Zapatos de Agua' }, 
        description: { en: 'Many Croatian beaches are rocky or pebbly, not sandy. Water shoes are highly recommended for comfort and to protect against sea urchins in some areas.', it: 'Molte spiagge croate sono rocciose o ciottolose, non sabbiose. Le scarpe da acqua sono altamente raccomandate per il comfort e per proteggersi dai ricci di mare in alcune zone.', de: 'Viele kroatische Strände sind felsig oder kieselig, nicht sandig. Wasserschuhe werden für Komfort und zum Schutz vor Seeigeln in einigen Bereichen dringend empfohlen.', pl: 'Wiele chorwackich plaż jest kamienistych lub żwirowych, a nie piaszczystych. Buty do wody są wysoce zalecane dla komfortu i ochrony przed jeżowcami w niektórych obszarach.', fr: 'De nombreuses plages croates sont rocheuses ou caillouteuses, et non sablonneuses. Les chaussures d\'eau sont fortement recommandées pour le confort et pour se protéger des oursins dans certaines zones.', es: 'Muchas playas croatas son rocosas o de guijarros, no de arena. Se recomiendan encarecidamente zapatos de agua para mayor comodidad y para protegerse de los erizos de mar en algunas áreas.' }
      },
      { 
        icon: 'Ticket', 
        title: { en: 'National Park Tickets', it: 'Biglietti Parchi Nazionali', de: 'Nationalpark-Tickets', pl: 'Bilety do Parków Narodowych', fr: 'Billets pour les Parcs Nationaux', es: 'Entradas a Parques Nacionales' }, 
        description: { en: 'For popular national parks like Plitvice Lakes or Krka Waterfalls, buy tickets online in advance, especially during peak season, to avoid long queues or even sold-out entry slots.', it: 'Per i parchi nazionali popolari come i Laghi di Plitvice o le Cascate di Krka, acquista i biglietti online in anticipo, soprattutto durante l\'alta stagione, per evitare lunghe code o addirittura posti esauriti.', de: 'Für beliebte Nationalparks wie die Plitvicer Seen oder die Krka-Wasserfälle kaufen Sie Tickets online im Voraus, besonders während der Hochsaison, um lange Warteschlangen oder sogar ausverkaufte Eintrittskarten zu vermeiden.', pl: 'W przypadku popularnych parków narodowych, takich jak Jeziora Plitwickie czy Wodospady Krka, kupuj bilety online z wyprzedzeniem, zwłaszcza w szczycie sezonu, aby uniknąć długich kolejek, a nawet wyprzedanych miejsc.', fr: 'Pour les parcs nationaux populaires comme les lacs de Plitvice ou les cascades de Krka, achetez vos billets en ligne à l\'avance, surtout pendant la haute saison, pour éviter les longues files d\'attente ou même les créneaux d\'entrée complets.', es: 'Para parques nacionales populares como los Lagos de Plitvice o las Cascadas de Krka, compre las entradas en línea con antelación, especialmente durante la temporada alta, para evitar largas colas o incluso que se agoten las entradas.' }
      },
    ],
  },
];