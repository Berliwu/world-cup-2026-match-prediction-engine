import { getVenueById } from "../data/venues.js";

export function altitudeFatigueFactor(altitudeMeters: number): number {
  if (altitudeMeters < 500) return 1.0;
  if (altitudeMeters < 1500) return 0.97;
  return 0.93;
}

export function venuePerformanceModifier(venueId: string, acclimatized: boolean): number {
  const venue = getVenueById(venueId);
  if (!venue) return 1.0;
  if (acclimatized) return 1.0;
  return altitudeFatigueFactor(venue.altitude);
}
