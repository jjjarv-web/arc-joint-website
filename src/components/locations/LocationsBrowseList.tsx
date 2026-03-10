"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { ClinicLocation } from "@/lib/types";
import {
  TREATMENT_AREA_FILTERS,
  filterByTreatmentArea,
  getTreatmentAreaLabels,
} from "@/lib/locationFilters";
import { BookingModal } from "@/components/BookingModal";

const PROCEDURE_LABELS: Record<string, string> = {
  PNS: "Peripheral Nerve Stimulation",
};

type LocationWithDistance = ClinicLocation & { distanceMiles?: number };

interface LocationsBrowseListProps {
  locations: LocationWithDistance[];
  zip?: string;
  initialArea?: string | null;
}

export function LocationsBrowseList({ locations, zip, initialArea }: LocationsBrowseListProps) {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<string | null>(initialArea ?? null);

  const filtered = useMemo(
    () => filterByTreatmentArea(locations, activeFilter),
    [locations, activeFilter]
  );

  const [activeLocationId, setActiveLocationId] = useState(filtered[0]?.id ?? "");

  useEffect(() => {
    setActiveLocationId(filtered[0]?.id ?? "");
  }, [filtered]);

  const [bookingModal, setBookingModal] = useState<{ url: string; name: string } | null>(null);

  const isSearchMode = !!zip;

  return (
    <>
    <BookingModal
      isOpen={bookingModal !== null}
      onClose={() => setBookingModal(null)}
      bookingUrl={bookingModal?.url ?? ""}
      locationName={bookingModal?.name ?? ""}
    />
    <section className="bg-[#f5f5f5] px-6 py-14 md:px-10">
      <div className="mx-auto w-full max-w-4xl">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[10px] uppercase tracking-[0.22em] text-black/40">
            {filtered.length} Location{filtered.length !== 1 ? "s" : ""}
            {isSearchMode && ` near ${zip}`}
          </p>
        </div>

        <p className="mb-2 text-[10px] uppercase tracking-[0.18em] text-black/35">
          Filter by treatment area
        </p>
        <div className="mb-8 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setActiveFilter(null)}
            className={`rounded-full border px-3 py-1.5 text-[11px] uppercase tracking-[0.1em] transition-colors ${
              !activeFilter
                ? "border-black/20 bg-black/8 text-black/80"
                : "border-black/10 text-black/45 hover:border-black/20 hover:text-black/65"
            }`}
          >
            All
          </button>
          {TREATMENT_AREA_FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setActiveFilter((prev) => (prev === f.id ? null : f.id))}
              className={`rounded-full border px-3 py-1.5 text-[11px] uppercase tracking-[0.1em] transition-colors ${
                activeFilter === f.id
                  ? "border-black/20 bg-black/8 text-black/80"
                  : "border-black/10 text-black/45 hover:border-black/20 hover:text-black/65"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {filtered.length > 0 ? (
          <ul className="space-y-4">
            {filtered.map((location, idx) => {
              const isActive = location.id === activeLocationId;
              const isClosest = idx === 0;
              const treatmentLabels = getTreatmentAreaLabels(location.treatmentsSupported);

              return (
                <li key={location.id}>
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => setActiveLocationId(location.id)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setActiveLocationId(location.id);
                      }
                    }}
                    className={`group relative cursor-pointer overflow-hidden rounded-2xl border bg-white transition-all duration-300 ${
                      isActive
                        ? "border-black/[0.14] shadow-[0_20px_40px_-12px_rgba(0,0,0,0.10)]"
                        : "border-black/[0.06] hover:border-black/[0.12] hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.08)]"
                    }`}
                  >
                    {isClosest && (
                      <span className="absolute right-0 top-0 rounded-bl-lg bg-black/[0.04] px-3 py-1.5 text-[9px] uppercase tracking-[0.16em] text-black/35">
                        Closest
                      </span>
                    )}
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
                        <p className="mt-1 flex items-center gap-2 text-[15px] font-light text-black/55">
                          <span>{location.city}, {location.state}</span>
                          {location.distanceMiles != null && (
                            <span className="rounded-full bg-black/[0.05] px-2 py-0.5 text-[11px] tabular-nums tracking-tight text-black/45">
                              {location.distanceMiles} mi
                            </span>
                          )}
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
                        {location.specialties.map((s) => (
                          <span key={s} className="rounded-full border border-black/[0.12] px-3 py-1 text-[11px] uppercase tracking-[0.1em] text-black/50">
                            {s}
                          </span>
                        ))}
                        {!isActive && (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-black py-2.5 px-4 text-[13px] font-medium text-white transition-colors group-hover:bg-black/85">
                            View Location
                            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <line x1="7" y1="17" x2="17" y2="7" />
                              <polyline points="7 7 17 7 17 17" />
                            </svg>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Expandable detail panel */}
                    <div
                      className="grid transition-[grid-template-rows] duration-300 ease-out"
                      style={{ gridTemplateRows: isActive ? "1fr" : "0fr" }}
                    >
                      <div className="overflow-hidden">
                        <div className="border-t border-black/[0.06] px-6 pb-6 pt-5">
                          <div className="grid gap-6 md:grid-cols-2">
                            {/* Left column — procedures & insurance */}
                            <div>
                              <p className="mb-2 text-[10px] uppercase tracking-[0.18em] text-black/35">
                                Procedures offered
                              </p>
                              <div className="space-y-1">
                                {location.procedures.map((proc) => (
                                  <p key={proc} className="text-[14px] font-light text-black/65">
                                    {PROCEDURE_LABELS[proc] ?? proc}
                                  </p>
                                ))}
                              </div>
                              <p className="mt-4 text-[12px] font-light text-black/40">
                                Medicare and most private insurance accepted
                              </p>
                            </div>

                            {/* Right column — CTA */}
                            <div className="flex flex-col items-start justify-between gap-4 md:items-end">
                              <button
                                type="button"
                                className="block w-full rounded-full bg-[#2563EB] py-3 text-center text-[13px] font-medium text-white transition-colors hover:bg-[#1D4ED8] active:bg-[#1E40AF] md:w-auto md:px-8"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setBookingModal({ url: location.bookingUrl, name: location.name });
                                }}
                              >
                                Request Appointment
                              </button>
                              <div className="w-full text-left md:text-right">
                                <p className="text-[11px] leading-snug text-black/30">
                                  No commitment required
                                </p>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    const params = new URLSearchParams();
                                    if (zip) params.set("zip", zip);
                                    if (activeFilter) params.set("area", activeFilter);
                                    const query = params.toString();
                                    router.push(`/locations/${location.slug}${query ? `?${query}` : ""}`);
                                  }}
                                  className="mt-1 cursor-pointer border-0 bg-transparent p-0 text-[11px] uppercase tracking-[0.14em] text-black/35 transition-colors hover:text-black/65"
                                >
                                  View full profile →
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="py-12 text-center text-[14px] font-light text-black/40">
            No locations match this filter. Try a different treatment area.
          </p>
        )}
      </div>
    </section>
    </>
  );
}
