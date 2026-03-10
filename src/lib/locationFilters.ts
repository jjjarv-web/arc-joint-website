import type { TreatmentArea } from "@/lib/types";

export const TREATMENT_AREA_FILTERS = [
  { id: "knee" as TreatmentArea, label: "Knee" },
  { id: "shoulder" as TreatmentArea, label: "Shoulder" },
  { id: "cervical" as TreatmentArea, label: "Neck" },
  { id: "hip" as TreatmentArea, label: "Hip" },
  { id: "lumbar" as TreatmentArea, label: "Lower Back" },
  { id: "ankle" as TreatmentArea, label: "Ankle" },
] as const;

export function filterByTreatmentArea<T extends { treatmentsSupported: TreatmentArea[] }>(
  locations: T[],
  selectedId: string | null
): T[] {
  if (!selectedId) return locations;
  const area = selectedId as TreatmentArea;
  return locations.filter((loc) => loc.treatmentsSupported.includes(area));
}

export function getTreatmentAreaLabels(areas: TreatmentArea[]): string[] {
  return TREATMENT_AREA_FILTERS.filter((f) => areas.includes(f.id)).map((f) => f.label);
}
