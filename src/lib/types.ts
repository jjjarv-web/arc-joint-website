export type Procedure = "PNS";

export interface Provider {
  id: string;
  slug: string;
  name: string;
  description: string;
  city: string;
  state: string;
  zip: string;
  lat: number;
  lon: number;
  bookingUrl: string;
  verified: boolean;
  procedures: Procedure[];
}

export interface SearchResult extends Provider {
  distanceMiles: number;
}
