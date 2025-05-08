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
      name: 'Coastal Beach Walk',
      description: "Enjoy scenic walks along Split's beautiful beaches and coastline.",
      iconUrl: 'https://picsum.photos/300/200?random=beachwalk',
      isFree: true,
      dataAiHint: 'beach coastline',
      subActivities: [
        { name: "Žnjan Beach Promenade", googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Žnjan+beach+promenade+Split+Croatia" },
        { name: "Bačvice to Firule Coastal Path", googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Bačvice+to+Firule+coastal+path+Split+Croatia" },
        { name: "Kašjuni Beach Walk", googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Kašjuni+Beach+Split+Croatia" }
      ]
    },
    {
      name: 'Marjan Park Hiking Trails',
      description: "Explore diverse hiking trails in Marjan Forest Park with stunning city and sea views.",
      iconUrl: 'https://picsum.photos/300/200?random=marjanhike',
      isFree: true,
      dataAiHint: 'forest park',
      subActivities: [
        { name: "Marjan Hill Summit (Telegrin Peak)", googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Telegrin+peak+Marjan+Split+Croatia" },
        { name: "St. Nicholas Church Viewpoint Trail", googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=St.+Nicholas+Church+Marjan+Split+Croatia" },
        { name: "Bene Beach Trail (via Marjan Park)", googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Bene+Beach+Marjan+Park+Split+Croatia" }
      ]
    },
    {
      name: 'Example Museum Visit',
      description: 'A visit to a local museum to explore art or history.',
      iconUrl: 'https://picsum.photos/300/200?random=museumvisit',
      isFree: false,
      dataAiHint: 'museum art'
    },
    {
      name: "Rafting Adventure on Cetina River",
      description: "Experience thrilling white-water rafting on the scenic Cetina river, suitable for most skill levels.",
      iconUrl: "https://picsum.photos/300/200?random=rafting",
      isFree: false,
      dataAiHint: "rafting river"
    }
  ];
}