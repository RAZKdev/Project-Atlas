/**
 * Solar position and subsolar point calculations for Project Atlas Live Earth.
 * Computes physically accurate sun vector from current UTC time for day/night lighting transitions.
 */

import { geoToVector3, GeoVector3 } from '../geo/geoToVector3';

export interface SolarPosition {
  subsolarLatitude: number;
  subsolarLongitude: number;
  sunVector: GeoVector3;
  utcTimeFormatted: string;
}

/**
 * Calculates day of year (1-366) for declination approximation.
 */
function getDayOfYear(date: Date): number {
  const start = new Date(Date.UTC(date.getUTCFullYear(), 0, 0));
  const diff = date.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}

/**
 * Computes the real-time subsolar coordinates and 3D sun direction vector.
 * @param date Current UTC Date (defaults to now)
 * @param lightDistance Distance of directional light from globe center (default: 8.0)
 */
export function calculateSolarPosition(date: Date = new Date(), lightDistance: number = 8.0): SolarPosition {
  const utcHours = date.getUTCHours() + date.getUTCMinutes() / 60 + date.getUTCSeconds() / 3600;
  
  // Subsolar longitude: 12:00 UTC is at 0° longitude (Prime Meridian).
  // Earth rotates 15° per hour from west to east; the sun moves east to west.
  let subsolarLongitude = (12 - utcHours) * 15;
  if (subsolarLongitude > 180) subsolarLongitude -= 360;
  if (subsolarLongitude < -180) subsolarLongitude += 360;

  // Subsolar latitude (solar declination angle [-23.44°, +23.44°])
  // Using standard astronomical approximation: delta = -23.44 * cos(2*PI/365 * (N + 10))
  const dayOfYear = getDayOfYear(date);
  const angleRad = ((dayOfYear + 10) / 365.25) * 2 * Math.PI;
  const subsolarLatitude = -23.44 * Math.cos(angleRad);

  // Project to 3D Cartesian position for Three.js DirectionalLight
  const projection = geoToVector3(subsolarLatitude, subsolarLongitude, lightDistance, 1.0);

  const utcTimeFormatted = date.toISOString().replace('T', ' ').slice(0, 19) + ' UTC';

  return {
    subsolarLatitude,
    subsolarLongitude,
    sunVector: projection.position,
    utcTimeFormatted,
  };
}
