import { locations } from "@/data/locations";
import type { ClinicLocation, JointRegion, SearchResult } from "@/lib/types";
import { haversineMiles } from "@/lib/distance";

export function getAllLocations(): ClinicLocation[] {
  return locations;
}

export function getLocationBySlug(slug: string): ClinicLocation | undefined {
  return locations.find((location) => location.slug === slug);
}

export function getNearestLocations(
  originLat: number,
  originLon: number,
  joint?: JointRegion,
  limit = 10
): SearchResult[] {
  const pool = joint
    ? locations.filter((l) => l.treatmentsSupported.includes(joint))
    : locations;

  return pool
    .map((location) => ({
      ...location,
      distanceMiles: haversineMiles(originLat, originLon, location.lat, location.lon),
    }))
    .sort((a, b) => a.distanceMiles - b.distanceMiles)
    .slice(0, limit);
}
