import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllLocations, getLocationBySlug } from "@/lib/locations";
import { getTreatmentAreaLabels } from "@/lib/locationFilters";
import { BookingCTA } from "@/components/locations/BookingCTA";

interface LocationPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ zip?: string; area?: string }>;
}

const PROCEDURE_LABELS: Record<string, string> = {
  PNS: "Peripheral Nerve Stimulation",
};

export async function generateStaticParams() {
  return getAllLocations().map((location) => ({ slug: location.slug }));
}

export async function generateMetadata({ params }: LocationPageProps): Promise<Metadata> {
  const { slug } = await params;
  const location = getLocationBySlug(slug);

  if (!location) {
    return { title: "Location Not Found | ARC" };
  }

  return {
    title: `${location.name} | ARC Location`,
    description: `${location.name} in ${location.city}, ${location.state}. ${location.description}`,
  };
}

const CREDIBILITY_SIGNALS = [
  {
    headline: "Minimally Invasive",
    detail: "No open surgery. Outpatient procedure with rapid recovery.",
  },
  {
    headline: "Fully Reversible",
    detail: "Unlike surgery, PNS can be removed or adjusted at any time.",
  },
  {
    headline: "Insurance Accepted",
    detail: "Medicare and most private insurance plans accepted.",
  },
  {
    headline: "ARC Certified",
    detail: "Physicians trained in ARC's precision neuromodulation protocol.",
  },
];

export default async function LocationPage({ params, searchParams }: LocationPageProps) {
  const { slug } = await params;
  const { zip, area } = await searchParams;
  const location = getLocationBySlug(slug);

  if (!location) {
    notFound();
  }

  const backHref = zip
    ? `/locations?zip=${zip}${area ? `&area=${area}` : ""}`
    : "/locations";

  const treatmentLabels = getTreatmentAreaLabels(location.treatmentsSupported);
  const procedureLabels = location.procedures.map((p) => PROCEDURE_LABELS[p] ?? p);

  const fullAddress = `${location.address}, ${location.city}, ${location.state} ${location.zip}`;
  const mapsQuery = encodeURIComponent(fullAddress);
  const mapsEmbedUrl = `https://maps.google.com/maps?q=${mapsQuery}&output=embed`;
  const mapsOpenUrl = `https://maps.google.com/maps?q=${mapsQuery}`;

  return (
    <main className="min-h-screen">

      {/* ── Dark hero ─────────────────────────────────────────── */}
      <section className="bg-[#0d0d0d] px-6 pb-14 pt-16 md:px-10">
        <div className="mx-auto w-full max-w-3xl">
          <Link
            href={backHref}
            className="inline-flex items-center gap-1.5 text-[13px] text-white/40 transition-colors hover:text-white/70"
          >
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Back to locations
          </Link>

          <h1 className="mt-7 text-[clamp(36px,6vw,64px)] font-light leading-tight tracking-tight text-white">
            {location.name}
          </h1>
          <p className="mt-2 text-[17px] font-light text-white/45">
            {location.city}, {location.state}
          </p>

          {/* Badges */}
          <div className="mt-5 flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-white/[0.12] px-3 py-1 text-[11px] uppercase tracking-[0.14em] text-white/55">
              {location.specialty}
            </span>
            {location.verified && (
              <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[11px] uppercase tracking-[0.14em] text-emerald-400/80">
                ARC Verified
              </span>
            )}
          </div>

          {/* Treatment areas + procedures */}
          <div className="mt-6 space-y-1">
            <p className="text-[11px] text-white/50">
              Treats: {treatmentLabels.join(", ")}
            </p>
            <p className="text-[11px] text-white/50">
              Treatments offered: {procedureLabels.join(", ")}
            </p>
          </div>

          {/* Description */}
          <p className="mt-8 max-w-xl text-[16px] font-light leading-relaxed text-white/60">
            {location.description}
          </p>

          {/* Primary CTA */}
          <BookingCTA
            bookingUrl={location.bookingUrl}
            locationName={location.name}
            className="mt-8 block w-full cursor-pointer rounded-full bg-[#2563EB] py-4 text-center text-[15px] font-medium tracking-tight text-white transition-colors hover:bg-[#1D4ED8] active:bg-[#1E40AF] md:w-auto md:inline-block md:px-10"
          />
          <p className="mt-3 text-[12px] text-white/30">
            Requesting an appointment is the fastest way to connect — no commitment required.
          </p>
        </div>
      </section>

      {/* ── Credibility grid ──────────────────────────────────── */}
      <section style={{ backgroundColor: "#f5f5f5" }} className="px-6 py-14 md:px-10">
        <div className="mx-auto w-full max-w-3xl">
          <p className="mb-8 text-[10px] uppercase tracking-[0.22em] text-black/40">
            Why ARC Care
          </p>
          <div className="grid gap-px rounded-2xl overflow-hidden border border-black/[0.06]" style={{ gridTemplateColumns: "repeat(2, 1fr)" }}>
            {CREDIBILITY_SIGNALS.map((signal, i) => (
              <div
                key={signal.headline}
                className={`bg-white px-6 py-6 ${i === 2 ? "rounded-bl-2xl" : ""} ${i === 3 ? "rounded-br-2xl" : ""} ${i === 0 ? "rounded-tl-2xl" : ""} ${i === 1 ? "rounded-tr-2xl" : ""}`}
              >
                <p className="text-[15px] font-medium tracking-tight text-black">
                  {signal.headline}
                </p>
                <p className="mt-1.5 text-[13px] font-light leading-snug text-black/50">
                  {signal.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Address + Map ─────────────────────────────────────── */}
      <section className="bg-white px-6 pb-20 pt-14 md:px-10">
        <div className="mx-auto w-full max-w-3xl">

          {/* Address block */}
          <div className="mb-10">
            <p className="mb-3 text-[10px] uppercase tracking-[0.22em] text-black/40">
              Address
            </p>
            <p className="text-[17px] font-light text-black">
              {location.address}
            </p>
            <p className="text-[17px] font-light text-black/55">
              {location.city}, {location.state} {location.zip}
            </p>
            <a
              href={mapsOpenUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-1.5 text-[13px] text-black/45 transition-colors hover:text-black/80"
            >
              Open in Google Maps
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="7" y1="17" x2="17" y2="7" />
                <polyline points="7 7 17 7 17 17" />
              </svg>
            </a>
          </div>

          {/* Map section */}
          <p className="mb-4 text-[10px] uppercase tracking-[0.22em] text-black/40">
            Location
          </p>
          <div
            className="overflow-hidden rounded-2xl"
            style={{
              boxShadow: "0 20px 40px rgba(0,0,0,0.12)",
              animation: "fadeIn 0.4s ease-out both",
            }}
          >
            <iframe
              src={mapsEmbedUrl}
              width="100%"
              className="h-[300px] md:h-[380px]"
              style={{ border: 0, display: "block" }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={`Map showing location of ${location.name}`}
            />
          </div>
        </div>
      </section>

    </main>
  );
}
