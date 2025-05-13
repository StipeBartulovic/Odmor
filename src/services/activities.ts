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
 * Represents a link for a sub-activity, typically an external booking or info page.
 */
export interface SubActivityLink {
  name: string;
  url: string;
}

/**
 * Represents a category of sub-activities or links.
 */
export interface SubActivityCategory {
  title: string;
  links: SubActivityLink[];
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
   * Optional list of specific locations or sub-types for this activity, typically free.
   */
  subActivities?: SubActivity[];
  /**
   * Optional list of categorized links for sub-activities, e.g. booking options for paid activities.
   */
  subActivityCategories?: SubActivityCategory[];
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
      name: "Old Town Exploration", 
      description: "Discover the historic alleys and significant landmarks of Split's ancient core.", 
      iconUrl: "https://picsum.photos/300/200?random=oldcity", 
      isFree: true, 
      dataAiHint: "old city", 
      subActivities: [
        { name: "Diocletian's Palace Self-Guided Tour", googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Diocletian's+Palace+Split+Croatia" },
        { name: "Stroll along Riva Promenade", googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Riva+Promenade+Split+Croatia" },
        { name: "Visit Pjaca (People's Square)", googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Pjaca+Split+Croatia" }
      ]
    },
    {
      name: 'Exploring Nearby Towns',
      description: "Visit charming nearby towns and villages, easily accessible for a day trip from Split.",
      iconUrl: 'https://picsum.photos/300/200?random=oldtowns',
      isFree: true,
      dataAiHint: 'small town',
      subActivities: [
        { name: "Trogir (UNESCO World Heritage Site)", googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Trogir+Croatia" },
        { name: "Omiš (Historic town at Cetina river mouth)", googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Omiš+Croatia" },
        { name: "Solin (Ancient Salona ruins)", googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Solin+Salona+Croatia" }
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
      name: "Zipline Adventure Over Canyon", 
      description: "Experience an adrenaline rush soaring over a canyon on a zipline.", 
      iconUrl: "https://picsum.photos/300/200?random=ziplinecanyon", 
      isFree: false, 
      dataAiHint: "zipline canyon" 
    },
    {
      name: "Rafting Adventure on Cetina River",
      description: "Experience thrilling white-water rafting on the scenic Cetina river, suitable for most skill levels.",
      iconUrl: "https://picsum.photos/300/200?random=rafting",
      isFree: false,
      dataAiHint: "rafting river",
      subActivityCategories: [
        {
          title: "Large Boats (5-10 people)",
          links: [
            { name: "Viator - Rafting Cetina River", url: "https://www.viator.com/tours/Split/Rafting-Cetina-River/d4185-31976P9" },
            { name: "Viator - Cave & Cliff Jumping", url: "https://www.viator.com/tours/Split/RAFTING-ON-CETINA-RIVER-WITH-CAVE-AND-CLIFF-JUMPING/d4185-114419P1" },
            { name: "Viator - From Split", url: "https://www.viator.com/tours/Split/Cetina-River-Rafting-from-Split/d4185-5489222P1" },
          ]
        },
        {
          title: "Small Boats (2-4 people)",
          links: [
            { name: "TripAdvisor - From Split/Blato na Cetini", url: "https://www.tripadvisor.com/AttractionProductReview-g295370-d11478770-Rafting_on_Cetina_River_Departure_from_Split_or_Blato_na_Cetini_village-Split_Spli.html" },
            { name: "TripAdvisor - From Split/Sestanovac", url: "https://www.tripadvisor.com/AttractionProductReview-g14159163-d13365613-Whitewater_Rafting_on_Cetina_River_from_Split_or_Sestanovac-Sestanovac_Split_Dal.html" },
            { name: "TripAdvisor - Canoeing from Split/Sestanovac", url: "https://www.tripadvisor.com/AttractionProductReview-g295370-d13365608-Whitewater_Canoeing_on_Cetina_River_from_Split_or_Sestanovac-Split_Split_Dalmatia_.html" },
          ]
        }
      ]
    },
    {
      name: 'Island Boat Trip',
      description: "Discover nearby islands with a scenic boat tour, including swimming and snorkeling opportunities.",
      iconUrl: 'https://picsum.photos/300/200?random=boattrip',
      isFree: false,
      dataAiHint: 'boat island',
      // Potential for subActivityCategories with links to specific tour operators
    }
  ];
}

