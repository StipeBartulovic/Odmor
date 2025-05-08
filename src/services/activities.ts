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
      description: 'A walk in nature, like exploring Marjan Park or taking a stroll along Žnjan promenade.',
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
      description: 'A visit to a local museum to explore art or history.',
      iconUrl: 'https://picsum.photos/300/200?random=museumvisit',
      isFree: false,
      dataAiHint: 'museum art'
      // No subActivities for paid activities in this example
    }
    // "Old Town Walk" and "Zipline Adventure" are provided by demoActivities in ActivitiesSection.tsx
    // to avoid duplicates and ensure correct, distinct content.
  ];
}

