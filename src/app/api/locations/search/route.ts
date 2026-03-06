import { NextResponse } from "next/server";
import type { JointRegion } from "@/lib/types";
import { getNearestLocations } from "@/lib/locations";

interface ZippopotamResponse {
  places?: Array<{
    latitude: string;
    longitude: string;
  }>;
}

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

async function fetchZipCentroid(zip: string): Promise<{ lat: number; lon: number } | null> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 6000);

  try {
    const response = await fetch(`https://api.zippopotam.us/us/${zip}`, {
      signal: controller.signal,
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    const payload = (await response.json()) as ZippopotamResponse;
    const place = payload.places?.[0];

    if (!place) {
      return null;
    }

    const lat = Number(place.latitude);
    const lon = Number(place.longitude);

    if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
      return null;
    }

    return { lat, lon };
  } finally {
    clearTimeout(timeout);
  }
}

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
