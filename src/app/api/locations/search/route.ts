import { NextResponse } from "next/server";
import type { JointRegion } from "@/lib/types";
import { fetchZipCentroid } from "@/lib/zip";
import { getNearestLocations } from "@/lib/locations";

const ZIP_REGEX = /^\d{5}$/;

const VALID_JOINTS = new Set<string>([
  "cervical",
  "left-shoulder",
  "right-shoulder",
  "lumbar",
  "left-hip",
  "right-hip",
  "left-knee",
  "right-knee",
  "left-ankle",
  "right-ankle",
]);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const zip = (searchParams.get("zip") || "").trim();
  const rawJoint = (searchParams.get("joint") || "").trim();
  const joint: JointRegion | undefined = VALID_JOINTS.has(rawJoint)
    ? (rawJoint as JointRegion)
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

  const results = getNearestLocations(origin.lat, origin.lon, joint, 10).map((location) => ({
    ...location,
    distanceMiles: Number(location.distanceMiles.toFixed(1)),
  }));

  return NextResponse.json({
    zip,
    origin,
    joint: joint ?? null,
    count: results.length,
    results,
  });
}
