import { providers } from "@/data/providers";
import type { Provider, SearchResult } from "@/lib/types";
import { haversineMiles } from "@/lib/distance";

export function getAllProviders(): Provider[] {
  return providers;
}

export function getProviderBySlug(slug: string): Provider | undefined {
  return providers.find((provider) => provider.slug === slug);
}

export function getNearestProviders(
  originLat: number,
  originLon: number,
  limit = 10
): SearchResult[] {
  return providers
    .map((provider) => ({
      ...provider,
      distanceMiles: haversineMiles(originLat, originLon, provider.lat, provider.lon),
    }))
    .sort((a, b) => a.distanceMiles - b.distanceMiles)
    .slice(0, limit);
}
