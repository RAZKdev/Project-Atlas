/**
 * Coordinate validation module for Project Atlas.
 * Validates geographic coordinates to ensure they fall strictly within:
 * - Latitude: [-90, +90]
 * - Longitude: [-180, +180]
 */

export interface CoordinateCheckResult {
  valid: boolean;
  error?: string;
}

export function validateCoordinates(lat: number, lng: number): CoordinateCheckResult {
  if (typeof lat !== 'number' || Number.isNaN(lat)) {
    return { valid: false, error: `Invalid latitude: ${lat} is not a valid number` };
  }
  if (typeof lng !== 'number' || Number.isNaN(lng)) {
    return { valid: false, error: `Invalid longitude: ${lng} is not a valid number` };
  }
  if (lat < -90 || lat > 90) {
    return { valid: false, error: `Latitude out of range [-90, 90]: received ${lat}` };
  }
  if (lng < -180 || lng > 180) {
    return { valid: false, error: `Longitude out of range [-180, 180]: received ${lng}` };
  }
  return { valid: true };
}
