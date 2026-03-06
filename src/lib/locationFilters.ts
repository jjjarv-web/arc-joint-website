import type { JointRegion } from "@/lib/types";

export const TREATMENT_AREA_FILTERS = [
  { id: "knee", label: "Knee", regions: ["left-knee", "right-knee"] as JointRegion[] },
  { id: "shoulder", label: "Shoulder", regions: ["left-shoulder", "right-shoulder"] as JointRegion[] },
  { id: "neck", label: "Neck", regions: ["cervical"] as JointRegion[] },
  { id: "hip", label: "Hip", regions: ["left-hip", "right-hip"] as JointRegion[] },
  { id: "lower-back", label: "Lower Back", regions: ["lumbar"] as JointRegion[] },
  { id: "ankle", label: "Ankle", regions: ["left-ankle", "right-ankle"] as JointRegion[] },
] as const;

export function filterByTreatmentArea<T extends { treatmentsSupported: JointRegion[] }>(
  locations: T[],
  selectedId: string | null
): T[] {
  if (!selectedId) return locations;
  const config = TREATMENT_AREA_FILTERS.find((f) => f.id === selectedId);
  if (!config) return locations;
  return locations.filter((loc) =>
    config.regions.some((r) => loc.treatmentsSupported.includes(r))
  );
}

/** Get treatment area labels for display (e.g. "Treats: Knee, Shoulder, Neck, Hip, Lower Back, Ankle") */
export function getTreatmentAreaLabels(regions: JointRegion[]): string[] {
  return TREATMENT_AREA_FILTERS.filter((f) =>
    f.regions.some((r) => regions.includes(r))
  ).map((f) => f.label);
}

/** Map JointRegion (e.g. left-knee) to treatment area id (e.g. knee) for default filter */
export function jointRegionToTreatmentAreaId(region: string): string | null {
  if (!region) return null;
  const found = TREATMENT_AREA_FILTERS.find((f) =>
    f.regions.includes(region as JointRegion)
  );
  return found?.id ?? null;
}
