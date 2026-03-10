export type Procedure = "PNS";

export type TreatmentArea =
  | "cervical"
  | "shoulder"
  | "lumbar"
  | "hip"
  | "knee"
  | "ankle";

export interface ClinicLocation {
  id: string;
  slug: string;
  name: string;
  description: string;
  specialty: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  lat: number;
  lon: number;
  bookingUrl: string;
  verified: boolean;
  procedures: Procedure[];
  treatmentsSupported: TreatmentArea[];
}

export interface SearchResult extends ClinicLocation {
  distanceMiles: number;
}
