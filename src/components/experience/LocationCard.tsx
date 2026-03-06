"use client";

import Link from "next/link";
import type { SearchResult } from "@/lib/types";

const PROCEDURE_LABELS: Record<string, string> = {
  PNS: "Peripheral Nerve Stimulation",
};

interface LocationCardProps {
  location: SearchResult;
  isActive: boolean;
  isClosest: boolean;
  variant: "dark" | "light";
  onSelect: (id: string) => void;
}

const tokens = {
  dark: {
    cardResting: "border-white/[0.10] bg-white/[0.05] hover:border-white/[0.16] hover:bg-white/[0.08]",
    cardActive: "border-white/[0.22] bg-white/[0.09]",
    name: "text-white",
    location: "text-white/55",
    badge: "border-white/20 text-white/55",
    specialty: "text-white/70",
    insurance: "text-white/45",
    procedure: "text-white/70",
    divider: "bg-white/[0.08]",
    ctaPrimary: "bg-white text-black hover:opacity-90 active:opacity-75",
    ctaSecondary: "border-white/25 text-white/80 hover:border-white/40 hover:text-white active:opacity-75",
    disclaimer: "text-white/35",
    profileLink: "text-white/40 hover:text-white/70",
  },
  light: {
    cardResting: "border-black/[0.08] bg-black/[0.02] hover:border-black/[0.12] hover:bg-black/[0.04]",
    cardActive: "border-black/[0.14] bg-black/[0.04]",
    name: "text-black",
    location: "text-black/50",
    badge: "border-black/[0.12] text-black/40",
    specialty: "text-black/60",
    insurance: "text-black/40",
    procedure: "text-black/60",
    divider: "bg-black/[0.08]",
    ctaPrimary: "bg-black text-white hover:opacity-85 active:opacity-70",
    ctaSecondary: "border-black/20 text-black/70 hover:border-black/35 hover:text-black active:opacity-70",
    disclaimer: "text-black/30",
    profileLink: "text-black/35 hover:text-black/65",
  },
} as const;

export function LocationCard({ location, isActive, isClosest, variant, onSelect }: LocationCardProps) {
  const t = tokens[variant];

  return (
    <button
      type="button"
      onClick={() => onSelect(location.id)}
      className={`w-full rounded-2xl border px-5 py-4 text-left transition-all duration-300 ease-out ${
        isActive ? t.cardActive : t.cardResting
      }`}
    >
      {/* Always-visible header */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className={`text-[16px] font-light leading-snug ${t.name}`}>
            {location.name}
          </p>
          <p className={`mt-0.5 text-[12px] ${t.location}`}>
            {location.city}, {location.state} · {location.distanceMiles.toFixed(1)} mi
          </p>
        </div>
        {isClosest && (
          <span className={`mt-0.5 shrink-0 rounded-full border px-2.5 py-0.5 text-[10px] uppercase tracking-[0.12em] ${t.badge}`}>
            Closest
          </span>
        )}
      </div>

      {/* Resting state details */}
      <div className="mt-2.5 space-y-0.5">
        <p className={`text-[13px] font-light ${t.specialty}`}>{location.specialty}</p>
        <p className={`text-[12px] ${t.insurance}`}>Medicare and most private insurance accepted</p>
      </div>

      {/* Expanded content — CSS grid animation */}
      <div
        className="grid transition-[grid-template-rows] duration-300 ease-out"
        style={{ gridTemplateRows: isActive ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden">
          <div className="pt-4">
            {/* Procedures */}
            <div className="mb-4 space-y-0.5">
              {location.procedures.map((proc) => (
                <p key={proc} className={`text-[13px] font-light ${t.procedure}`}>
                  {PROCEDURE_LABELS[proc] ?? proc}
                </p>
              ))}
            </div>

            {/* Divider */}
            <div className={`mb-4 h-px w-full ${t.divider}`} />

            {/* CTA */}
            <a
              href={location.bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`block w-full rounded-full py-3 text-center text-[13px] font-medium transition-opacity ${t.ctaPrimary}`}
              onClick={(e) => e.stopPropagation()}
            >
              Request Appointment
            </a>

            {/* Nudge copy */}
            <p className={`mt-2.5 text-center text-[11px] leading-snug ${t.disclaimer}`}>
              Requesting an appointment is the fastest way to connect — no commitment required.
            </p>

            {/* Profile link */}
            <div className="mt-4 text-center">
              <Link
                href={`/locations/${location.slug}`}
                onClick={(e) => e.stopPropagation()}
                className={`text-[11px] uppercase tracking-[0.14em] transition-colors ${t.profileLink}`}
              >
                View full profile →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </button>
  );
}
