"use client";

import { useState } from "react";
import Link from "next/link";
import type { SearchResult } from "@/lib/types";
import { LocationCard } from "@/components/experience/LocationCard";
import { TREATMENT_AREA_FILTERS, filterByTreatmentArea } from "@/lib/locationFilters";

interface LocationsSearchResultsProps {
  results: SearchResult[];
  zip: string;
  area: string | null;
}

export function LocationsSearchResults({ results, zip, area }: LocationsSearchResultsProps) {
  const [activeLocationId, setActiveLocationId] = useState(results[0]?.id ?? "");
  const filtered = filterByTreatmentArea(results, area);

  const baseUrl = `/locations?zip=${zip}`;

  return (
    <section className="bg-[#0d0d0d] px-6 py-14 md:px-10">
      <div className="mx-auto w-full max-w-4xl">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-[10px] uppercase tracking-[0.22em] text-white/45">
            {filtered.length} Location{filtered.length !== 1 ? "s" : ""} Near {zip}
          </p>
          <Link
            href="/locations"
            className="text-[10px] uppercase tracking-[0.12em] text-white/30 transition-colors hover:text-white/60"
          >
            Browse all
          </Link>
        </div>

        <p className="mb-2 text-[10px] uppercase tracking-[0.18em] text-white/40">
          Filter by treatment area
        </p>
        <div className="mb-6 flex flex-wrap gap-2">
          <Link
            href={baseUrl}
            className={`rounded-full border px-3 py-1.5 text-[11px] uppercase tracking-[0.1em] transition-colors ${
              !area
                ? "border-white/30 bg-white/15 text-white"
                : "border-white/20 text-white/60 hover:border-white/30 hover:text-white/80"
            }`}
          >
            All
          </Link>
          {TREATMENT_AREA_FILTERS.map((f) => (
            <Link
              key={f.id}
              href={`${baseUrl}&area=${f.id}`}
              className={`rounded-full border px-3 py-1.5 text-[11px] uppercase tracking-[0.1em] transition-colors ${
                area === f.id
                  ? "border-white/30 bg-white/15 text-white"
                  : "border-white/20 text-white/60 hover:border-white/30 hover:text-white/80"
              }`}
            >
              {f.label}
            </Link>
          ))}
        </div>

        <ul className="space-y-2">
          {filtered.length > 0 ? (
            <>
              {filtered.slice(0, 1).map((location) => (
                <li key={location.id}>
                  <LocationCard
                    location={location}
                    isActive={location.id === activeLocationId}
                    isClosest
                    variant="dark"
                    onSelect={setActiveLocationId}
                    zip={zip}
                    area={area ?? undefined}
                  />
                </li>
              ))}
              {filtered.length > 1 && (
                <>
                  <li className="pt-2 pb-1">
                    <p className="text-[10px] uppercase tracking-[0.18em] text-white/35">
                      Other locations
                    </p>
                  </li>
                  {filtered.slice(1).map((location) => (
                    <li key={location.id}>
                      <LocationCard
                        location={location}
                        isActive={location.id === activeLocationId}
                        isClosest={false}
                        variant="dark"
                        onSelect={setActiveLocationId}
                        zip={zip}
                        area={area ?? undefined}
                      />
                    </li>
                  ))}
                </>
              )}
            </>
          ) : (
            <li className="py-8 text-center text-[13px] font-light text-white/50">
              No locations near {zip} treat this area. Try a different filter or{" "}
              <Link href="/locations" className="text-white/70 underline hover:text-white">
                browse all locations
              </Link>
              .
            </li>
          )}
        </ul>
      </div>
    </section>
  );
}
