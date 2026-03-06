import type { Metadata } from "next";
import Link from "next/link";
import { getAllLocations } from "@/lib/locations";
import { getNearestLocations } from "@/lib/locations";
import { fetchZipCentroid } from "@/lib/zip";
import { filterByTreatmentArea } from "@/lib/locationFilters";
import { getTreatmentAreaLabels } from "@/lib/locationFilters";
import { LocationsSearchResults } from "@/components/locations/LocationsSearchResults";

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

  if (hasZip) {
    const origin = await fetchZipCentroid(zip);
    if (!origin) {
      return (
        <main className="min-h-screen">
          <section className="bg-[#0d0d0d] px-6 pb-14 pt-16 md:px-10">
            <div className="mx-auto w-full max-w-4xl">
              <Link
                href="/locations"
                className="inline-flex items-center gap-1.5 text-[13px] text-white/40 transition-colors hover:text-white/70"
              >
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
                Back to locations
              </Link>
              <h1 className="mt-6 text-[clamp(28px,5vw,44px)] font-light leading-tight tracking-tight text-white">
                ZIP lookup unavailable
              </h1>
              <p className="mt-4 max-w-xl text-[17px] font-light leading-relaxed text-white/50">
                We couldn&apos;t find coordinates for ZIP code {zip}. Please try another ZIP or{" "}
                <Link href="/locations" className="text-white/70 underline hover:text-white">
                  browse all locations
                </Link>
                .
              </p>
            </div>
          </section>
        </main>
      );
    }

    const results = getNearestLocations(origin.lat, origin.lon, undefined, 50).map((loc) => ({
      ...loc,
      distanceMiles: Number(loc.distanceMiles.toFixed(1)),
    }));
    const filtered = filterByTreatmentArea(results, area);

    return (
      <main className="min-h-screen">
        {/* Dark hero */}
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
            <h1 className="mt-3 text-[clamp(36px,6vw,56px)] font-light leading-tight tracking-tight text-white">
              Locations near {zip}
            </h1>
            <p className="mt-4 max-w-xl text-[17px] font-light leading-relaxed text-white/50">
              {filtered.length} location{filtered.length !== 1 ? "s" : ""} sorted by distance from your ZIP.
            </p>
          </div>
        </section>

        <LocationsSearchResults results={results} zip={zip} area={area} />
      </main>
    );
  }

  // Browse mode — no ZIP
  const locations = getAllLocations();

  return (
    <main className="min-h-screen">
      {/* Dark hero */}
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
          <h1 className="mt-3 text-[clamp(36px,6vw,56px)] font-light leading-tight tracking-tight text-white">
            Find a location near you
          </h1>
          <p className="mt-4 max-w-xl text-[17px] font-light leading-relaxed text-white/50">
            ARC locations are ranked by ZIP proximity on the homepage. Browse all locations below.
          </p>
        </div>
      </section>

      {/* Browse grid — light cards */}
      <section className="bg-[#f5f5f5] px-6 py-14 md:px-10">
        <div className="mx-auto w-full max-w-4xl">
          <p className="mb-8 text-[10px] uppercase tracking-[0.22em] text-black/40">
            All Locations
          </p>

          <ul className="space-y-4">
            {locations.map((location) => {
              const treatmentLabels = getTreatmentAreaLabels(location.treatmentsSupported);
              return (
                <li key={location.id}>
                  <Link
                    href={`/locations/${location.slug}`}
                    className="group block overflow-hidden rounded-2xl border border-black/[0.06] bg-white transition-all duration-300 hover:border-black/[0.12] hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.12)]"
                  >
                    <div className="flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between md:gap-6">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h2 className="text-[22px] font-light tracking-tight text-black group-hover:text-black/90">
                            {location.name}
                          </h2>
                          {location.verified && (
                            <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] uppercase tracking-[0.12em] text-emerald-600">
                              ARC Verified
                            </span>
                          )}
                        </div>
                        <p className="mt-1 text-[15px] font-light text-black/55">
                          {location.city}, {location.state}
                        </p>
                        <p className="mt-2 line-clamp-2 text-[14px] font-light leading-snug text-black/45">
                          {location.description}
                        </p>
                        {treatmentLabels.length > 0 && (
                          <p className="mt-2 text-[11px] text-black/45">
                            Treats: {treatmentLabels.join(", ")}
                          </p>
                        )}
                      </div>

                      <div className="flex shrink-0 items-center gap-3">
                        <span className="rounded-full border border-black/[0.12] px-3 py-1 text-[11px] uppercase tracking-[0.1em] text-black/50">
                          {location.specialty}
                        </span>
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-black py-2.5 px-4 text-[13px] font-medium text-white transition-colors group-hover:bg-black/85">
                          View Location
                          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="7" y1="17" x2="17" y2="7" />
                            <polyline points="7 7 17 7 17 17" />
                          </svg>
                        </span>
                      </div>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>
    </main>
  );
}
