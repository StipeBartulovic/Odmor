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
      name: "Coastal Trail Hike", 
      description: "Enjoy breathtaking views on this scenic coastal hike.", 
      iconUrl: "https://picsum.photos/300/200?random=hike", 
      isFree: true, 
      dataAiHint: "coastal hike",
      subActivities: [
        { name: "Bačvice Beach Coastal Path", googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Bačvice+Beach+Split+Croatia+coastal+path" },
        { name: "Kašjuni Beach Trail", googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Kašjuni+Beach+Split+Croatia+trail" }
      ]
    },
    { 
      name: "Rafting Adventures", 
      description: "Experience thrilling white-water rafting on the Cetina river, near Split.", 
      iconUrl: "https://picsum.photos/300/200?random=rafting", 
      isFree: false, 
      dataAiHint: "rafting river" 
    },
    { 
      name: "Sunset Beach Yoga", 
      description: "Relax and rejuvenate with a yoga session on the beach as the sun sets.", 
      iconUrl: "https://picsum.photos/300/200?random=yoga", 
      isFree: true, 
      dataAiHint: "beach yoga",
      subActivities: [
        { name: "Yoga Spot at Bene Beach", googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Bene+Beach+Split+Croatia" },
        { name: "Peaceful Yoga at Trstenik Beach", googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Trstenik+Beach+Split+Croatia" }
      ]
    },
  ];
}