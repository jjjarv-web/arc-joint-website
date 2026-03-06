interface ZippopotamResponse {
  places?: Array<{
    latitude: string;
    longitude: string;
  }>;
}

export async function fetchZipCentroid(zip: string): Promise<{ lat: number; lon: number } | null> {
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
