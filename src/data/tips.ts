// src/data/tips.ts

interface TipLink {
  text: string;
  url: string;
}

export interface Tip {
  icon?: string; // Name of the lucide icon (optional for individual tips)
  title: string;
  description: string;
  link?: TipLink;
}

export interface TipCategory {
  icon: string; // Name of the lucide icon for the category
  title: string;
  tips: Tip[];
}

export const tipsData: TipCategory[] = [
  {
    icon: 'Wrench', // Essentials
    title: 'Essentials',
    tips: [
      { icon: 'ShieldAlert', title: 'Emergency Number', description: 'Dial 112 for any urgent help (police, fire, ambulance).' },
      { icon: 'Droplets', title: 'Tap Water', description: 'Tap water throughout Croatia is generally safe to drink.' },
      { icon: 'Landmark', title: 'Cash is King', description: 'While cards are widely accepted, smaller establishments, markets, and some taxis may prefer or only accept cash (Croatian Kuna - HRK, or Euro - EUR as of 2023). It\'s good to have some on hand.' },
      { icon: 'Activity', title: 'Pharmacies (Ljekarna)', description: 'Pharmacies are the only place to buy most medicines (even basic painkillers sometimes) and often have limited working hours, especially on weekends. Look for a green cross sign.' },
      { icon: 'Clock', title: 'Shop & Café Hours', description: 'Supermarkets & cafés may close on Sundays or have reduced hours. Many shops close after 8 PM. Smaller shops might observe a "pauza" (mid-day break), especially in smaller towns.' },
    ],
  },
  {
    icon: 'CarFront', // Transport & Navigation
    title: 'Transport & Navigation',
    tips: [
      { icon: 'Smartphone', title: 'Ride-Sharing Apps', description: 'Uber and Bolt are available in major cities like Zagreb, Split, Dubrovnik, and Rijeka. Check availability for your specific location as coverage can vary.' },
      { icon: 'Phone', title: 'Local Taxis', description: 'If ride-sharing is unavailable, look for local taxi numbers. It\'s advisable to agree on a price beforehand or ensure the meter is running.' },
      { icon: 'TrafficCone', title: 'No Right on Red', description: 'Unlike in some countries (e.g., the US), turning right on a red traffic light is generally not allowed unless a specific green arrow signal explicitly permits it.' },
      { icon: 'Ship', title: 'Ferry Tickets', description: 'For ferries to islands (e.g., Hvar, Brač, Korčula), book tickets online in advance, especially during peak season (June-August).', link: { text: 'Jadrolinija (Main Ferry Operator)', url: 'https://www.jadrolinija.hr/' } },
      { icon: 'Bike', title: 'Hiking & Biking Trails', description: 'Croatia offers numerous scenic trails. Check local tourist office maps, or use apps like AllTrails or Komoot for routes and conditions.', link: { text: 'AllTrails Croatia', url: 'https://www.alltrails.com/croatia' } },
      { icon: 'Squirrel', title: 'Wildlife Caution', description: 'When hiking in forests or rural areas, be aware of wildlife. Adders (poskok) are venomous snakes but shy; wear sturdy shoes. Ticks are common in grassy/wooded areas. Wild boars are present but usually avoid humans. Stick to marked trails.' },
    ],
  },
  {
    icon: 'PlugZap', // Accommodation & Power
    title: 'Accommodation & Power',
    tips: [
      { icon: 'Power', title: 'Electrical Devices (Voltage)', description: 'Croatia uses 230V/50Hz. High-power devices from North America (110V) like hair dryers or curling irons require a voltage converter, not just a plug adapter, unless they are dual voltage. Check the device label.' },
      { icon: 'BatteryCharging', title: 'Voltage Converters vs. Adapters', description: 'A plug adapter only changes the pin shape, a voltage converter changes the electricity. Most modern electronics (laptops, phone chargers) are dual voltage and only need an adapter.' },
      { icon: 'Plug', title: 'Socket Type', description: 'Sockets are standard European Type C (Europlug) and Type F (Schuko). ' },
    ],
  },
  {
    icon: 'Utensils', // Dining & Culture
    title: 'Dining & Culture',
    tips: [
      { icon: 'Coins', title: 'Tipping', description: 'Tipping is appreciated for good service but not always mandatory. 5–10% is a polite gesture in restaurants. Rounding up the bill (e.g., to the nearest 10 or 00) is common in cafes and bars.' },
      { icon: 'Receipt', title: 'Getting the Bill', description: 'Waitstaff usually won’t bring the bill automatically. You’ll need to politely ask for it: "Račun, molim" (rah-choon, mo-leem).' },
      { icon: 'CigaretteOff', title: 'Smoking Regulations', description: 'Smoking indoors is generally not allowed in restaurants and most cafes. However, many establishments have outdoor seating (terraces) where smoking is permitted.' },
      { icon: 'MessageSquare', title: 'Communication Apps', description: 'WhatsApp and Viber are very commonly used for communication, often preferred over SMS.' },
      { icon: 'Languages', title: 'Language Basics', description: 'The official language is Croatian. Many people in tourist areas speak English. Basic German or Italian is also spoken, especially in Istria and Kvarner. Learning a few Croatian phrases like "Dobar dan" (Good day) and "Hvala" (Thank you) is appreciated.' },
    ],
  },
  {
    icon: 'Umbrella', // Beach & Outdoor Advice
    title: 'Beach & Outdoor Advice',
    tips: [
      { icon: 'Sun', title: 'Sun Protection', description: 'Sunscreen, hats, and sunglasses are essential, especially during summer months (June-September). The Adriatic sun can be very strong.' },
      { icon: 'Footprints', title: 'Water Shoes', description: 'Many Croatian beaches are rocky or pebbly, not sandy. Water shoes are highly recommended for comfort and to protect against sea urchins in some areas.' },
      { icon: 'Ticket', title: 'National Park Tickets', description: 'For popular national parks like Plitvice Lakes or Krka Waterfalls, buy tickets online in advance, especially during peak season, to avoid long queues or even sold-out entry slots.' },
    ],
  },
];
