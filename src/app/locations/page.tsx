import type { Metadata } from "next";
import Link from "next/link";
import { getAllLocations, getNearestLocations } from "@/lib/locations";
import { fetchZipCentroid } from "@/lib/zip";
import { LocationsBrowseList } from "@/components/locations/LocationsBrowseList";

export const metadata: Metadata = {
  title: "Locations | ARC",
  description: "Browse ARC locations offering preserve-first joint pain treatment pathways.",
};

const ZIP_REGEX = /^\d{5}$/;

interface LocationsPageProps {
  searchParams: Promise<{ zip?: string; area?: string }>;
}

export default async function LocationsPage({ searchParams }: LocationsPageProps) {
  const { zip: zipParam, area: areaParam } = await searchParams;
  const zip = (zipParam ?? "").trim();
  const area = (areaParam ?? "").trim() || null;

  const hasZip = ZIP_REGEX.test(zip);

  let locations: Parameters<typeof LocationsBrowseList>[0]["locations"] = [];
  let zipError = false;

  if (hasZip) {
    const origin = await fetchZipCentroid(zip);
    if (origin) {
      locations = getNearestLocations(origin.lat, origin.lon, undefined, 50).map((loc) => ({
        ...loc,
        distanceMiles: Number(loc.distanceMiles.toFixed(1)),
      }));
    } else {
      zipError = true;
    }
  }

  if (!hasZip || zipError) {
    locations = getAllLocations();
  }

  return (
    <main className="min-h-screen">
      {/* Dark hero — always shows ZIP input */}
      <section className="bg-[#0d0d0d] px-6 pb-14 pt-16 md:px-10">
        <div className="mx-auto w-full max-w-4xl">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-[13px] text-white/40 transition-colors hover:text-white/70"
          >
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Back to home
          </Link>
          <p className="mt-6 text-[11px] uppercase tracking-[0.26em] text-white/35">
            ARC Location Network
          </p>

          {hasZip && !zipError ? (
            <>
              <h1 className="mt-3 text-[clamp(36px,6vw,56px)] font-light leading-tight tracking-tight text-white">
                Locations near {zip}
              </h1>
              <p className="mt-4 max-w-xl text-[17px] font-light leading-relaxed text-white/50">
                {locations.length} location{locations.length !== 1 ? "s" : ""} sorted by distance from your ZIP.
              </p>
            </>
          ) : (
            <>
              <h1 className="mt-3 text-[clamp(36px,6vw,56px)] font-light leading-tight tracking-tight text-white">
                Find a location near you
              </h1>
              <p className="mt-4 max-w-xl text-[17px] font-light leading-relaxed text-white/50">
                {zipError
                  ? `We couldn\u2019t find coordinates for ZIP code ${zip}. Try another ZIP or browse below.`
                  : "Enter your ZIP code to find the nearest ARC locations, or browse all locations below."}
              </p>
            </>
          )}

          <form action="/locations" method="GET" className="mt-8">
            <div className="flex w-full max-w-sm items-stretch overflow-hidden rounded-2xl border border-white/10 bg-white/[0.06] transition-all duration-200 focus-within:border-white/20 focus-within:bg-white/[0.08]">
              <label htmlFor="browse-zip" className="sr-only">ZIP code</label>
              <input
                id="browse-zip"
                name="zip"
                type="text"
                inputMode="numeric"
                pattern="\d{5}"
                maxLength={5}
                placeholder="Enter ZIP code"
                defaultValue={hasZip ? zip : ""}
                required
                className="min-w-0 flex-1 bg-transparent px-5 py-3.5 text-[16px] font-light tracking-tight text-white outline-none placeholder:text-white/30"
              />
              <button
                type="submit"
                className="flex shrink-0 items-center gap-1.5 border-l border-white/10 px-5 text-[13px] font-medium tracking-tight text-white/60 transition-colors hover:text-white/90"
              >
                Search
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </button>
            </div>
          </form>
        </div>
      </section>

      <LocationsBrowseList
        locations={locations}
        zip={hasZip && !zipError ? zip : undefined}
        initialArea={area}
      />
    </main>
  );
}
