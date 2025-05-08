/**
 * Represents an individual location or specific instance of an activity.
 */
export interface SubActivity {
  /**
   * The name of the sub-activity or specific location.
   */
  name: string;
  /**
   * A Google Maps URL pointing to the location.
   */
  googleMapsUrl: string;
}

/**
 * Represents an activity.
 */
export interface Activity {
  /**
   * The name of the activity.
   */
  name: string;
  /**
   * A short description of the activity.
   */
  description: string;
  /**
   * URL of an icon representing the activity.
   */
  iconUrl: string;
  /**
   * Whether the activity is free or paid.
   */
  isFree: boolean;
  /**
   * AI hint for image generation for this activity.
   */
  dataAiHint?: string;
  /**
   * Optional list of specific locations or sub-types for this activity.
   */
  subActivities?: SubActivity[];
}

/**
 * Retrieves a list of activities.
 *
 * @returns A promise that resolves to an array of Activity objects.
 */
export async function getActivities(): Promise<Activity[]> {
  // TODO: Implement this by calling an external API.

  return [
    {
      name: 'Example Nature Walk',
      description: 'A walk in nature.',
      iconUrl: 'https://picsum.photos/300/200?random=naturewalk',
      isFree: true,
      dataAiHint: 'nature walk',
      subActivities: [
        { name: "Marjan Park Forest Trail", googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Marjan+Park+Split+Croatia+trails" },
        { name: "Žnjan Promenade Walk", googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Žnjan+promenade+Split+Croatia" }
      ]
    },
    {
      name: 'Example Museum Visit',
      description: 'A visit to a museum.',
      iconUrl: 'https://picsum.photos/300/200?random=museumvisit',
      isFree: false,
      dataAiHint: 'museum art'
      // No subActivities for paid activities in this example
    },
    { 
      name: "Old Town Walk", 
      description: "Explore the historic streets and landmarks of Split's Old Town.", 
      iconUrl: "https://picsum.photos/300/200?random=oldtown", 
      isFree: true, 
      dataAiHint: "old town",
      subActivities: [
        { name: "Diocletian's Palace Self-Guided Tour", googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Diocletian's+Palace+Split+Croatia" },
        { name: "Stroll along Riva Promenade", googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Riva+Promenade+Split+Croatia" },
        { name: "Visit Pjaca (People's Square)", googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Pjaca+Split+Croatia" }
      ]
    },
    { 
      name: "Zipline Adventure", 
      description: "Soar through the treetops on an exhilarating zipline course near Split.", 
      iconUrl: "https://picsum.photos/300/200?random=zipline", 
      isFree: false, 
      dataAiHint: "zipline forest" 
    },
  ];
}
