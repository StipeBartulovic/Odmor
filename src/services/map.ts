/**
 * Represents a geographical coordinate.
 */
export interface Coordinate {
  /**
   * The latitude of the coordinate.
   */
  latitude: number;
  /**
   * The longitude of the coordinate.
   */
  longitude: number;
}

/**
 * Represents a point of interest (POI) on the map.
 */
export interface PointOfInterest {
  /**
   * The name of the point of interest.
   */
  name: string;
  /**
   * The coordinates (latitude and longitude) of the point of interest.
   */
  coordinate: Coordinate;
  /**
   * A short description of the point of interest.
   */
  description: string;
  /**
   * URL of an image representing the point of interest.
   */
  imageUrl: string;
  /**
   * Category of the point of interest.
   */
  category: string;
}

/**
 * Retrieves points of interest (POIs) within a specified radius of a central location.
 *
 * @param centerCoordinate The coordinates of the central location.
 * @param radiusInKilometers The radius within which to search for POIs.
 * @returns A promise that resolves to an array of PointOfInterest objects.
 */
export async function getPointsOfInterest(
  centerCoordinate: Coordinate,
  radiusInKilometers: number
): Promise<PointOfInterest[]> {
  // TODO: Implement this by calling an external API.

  return [
    {
      name: 'Example Restaurant',
      coordinate: { latitude: 34.0522, longitude: -118.2437 },
      description: 'A great place to eat!',
      imageUrl: 'https://example.com/restaurant.jpg',
      category: 'Restaurant',
    },
    {
      name: 'Example Scenic View',
      coordinate: { latitude: 34.0600, longitude: -118.2500 },
      description: 'Beautiful scenic view!',
      imageUrl: 'https://example.com/scenic-view.jpg',
      category: 'Scenic View',
    },
  ];
}
