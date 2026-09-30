/**
 * Authoritative Geographic Projection Utility for Project Atlas.
 * Converts latitude and longitude into 3D Cartesian coordinates on a sphere.
 *
 * Coordinate Convention:
 * - +Y axis points to the Geographic North Pole (+90° Lat).
 * - -Y axis points to the Geographic South Pole (-90° Lat).
 * - Equator is on the X-Z plane (0° Lat).
 * - Surface offset allows positioning markers slightly above the terrain.
 */

import { validateCoordinates } from './coordinateValidation';

export interface GeoVector3 {
  x: number;
  y: number;
  z: number;
}

export interface GeoProjectionResult {
  position: GeoVector3;
  normal: GeoVector3;
  latitude: number;
  longitude: number;
  radius: number;
}

/**
 * Converts Latitude and Longitude to 3D Cartesian coordinates on a globe.
 * @param latitude Geographic latitude in degrees [-90, +90]
 * @param longitude Geographic longitude in degrees [-180, +180]
 * @param radius Radius of the globe (default: 1.8)
 * @param altitudeOffset Multiplier offset for surface clearance (default: 1.002)
 */
export function geoToVector3(
  latitude: number,
  longitude: number,
  radius: number = 1.8,
  altitudeOffset: number = 1.002,
): GeoProjectionResult {
  const validation = validateCoordinates(latitude, longitude);
  if (!validation.valid) {
    throw new Error(`[geoToVector3] ${validation.error}`);
  }

  // Polar angle (phi) from North Pole [0 to PI]
  const phi = (90 - latitude) * (Math.PI / 180);
  // Azimuthal angle (theta) from Prime Meridian [0 to 2*PI]
  const theta = (longitude + 180) * (Math.PI / 180);

  const effectiveRadius = radius * altitudeOffset;

  // Spherical to Cartesian calculation
  const sinPhi = Math.sin(phi);
  const cosPhi = Math.cos(phi);
  const sinTheta = Math.sin(theta);
  const cosTheta = Math.cos(theta);

  const x = -(effectiveRadius * sinPhi * cosTheta);
  const z = effectiveRadius * sinPhi * sinTheta;
  const y = effectiveRadius * cosPhi;

  // Unit surface normal at this location
  const normalLength = Math.sqrt(x * x + y * y + z * z);
  const normal: GeoVector3 = {
    x: normalLength === 0 ? 0 : x / normalLength,
    y: normalLength === 0 ? 1 : y / normalLength,
    z: normalLength === 0 ? 0 : z / normalLength,
  };

  return {
    position: { x, y, z },
    normal,
    latitude,
    longitude,
    radius: effectiveRadius,
  };
}
