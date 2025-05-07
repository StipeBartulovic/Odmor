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
      iconUrl: 'https://example.com/nature-walk.png',
      isFree: true,
    },
    {
      name: 'Example Museum',
      description: 'A visit to a museum.',
      iconUrl: 'https://example.com/museum.png',
      isFree: false,
    },
  ];
}
