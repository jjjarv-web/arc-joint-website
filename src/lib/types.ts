export type Procedure = "PNS";

export type JointRegion =
  | "cervical"
  | "left-shoulder"
  | "right-shoulder"
  | "lumbar"
  | "left-hip"
  | "right-hip"
  | "left-knee"
  | "right-knee"
  | "left-ankle"
  | "right-ankle";

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
  treatmentsSupported: JointRegion[];
}

export interface SearchResult extends ClinicLocation {
  distanceMiles: number;
}
