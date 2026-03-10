import { NextResponse } from "next/server";
import type { TreatmentArea } from "@/lib/types";
import { fetchZipCentroid } from "@/lib/zip";
import { getNearestLocations } from "@/lib/locations";

const ZIP_REGEX = /^\d{5}$/;

const VALID_AREAS = new Set<string>([
  "cervical",
  "shoulder",
  "lumbar",
  "hip",
  "knee",
  "ankle",
]);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const zip = (searchParams.get("zip") || "").trim();
  const rawArea = (searchParams.get("joint") || searchParams.get("area") || "").trim();
  const area: TreatmentArea | undefined = VALID_AREAS.has(rawArea)
    ? (rawArea as TreatmentArea)
    : undefined;

  if (!ZIP_REGEX.test(zip)) {
    return NextResponse.json(
      { error: "Please enter a valid 5-digit ZIP code." },
      { status: 400 }
    );
  }

  const origin = await fetchZipCentroid(zip);

  if (!origin) {
    return NextResponse.json(
      { error: "ZIP lookup unavailable. Please try another ZIP code." },
      { status: 404 }
    );
  }

  const results = getNearestLocations(origin.lat, origin.lon, area, 10).map((location) => ({
    ...location,
    distanceMiles: Number(location.distanceMiles.toFixed(1)),
  }));

  return NextResponse.json({
    zip,
    origin,
    area: area ?? null,
    count: results.length,
    results,
  });
}
