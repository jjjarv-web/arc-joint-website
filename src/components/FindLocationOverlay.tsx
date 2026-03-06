"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import type { SearchResult } from "@/lib/types";
import { LocationCard } from "@/components/experience/LocationCard";

interface FindLocationOverlayProps {
  open: boolean;
  onClose: () => void;
}

export function FindLocationOverlay({ open, onClose }: FindLocationOverlayProps) {
  const [zip, setZip] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [activeLocationId, setActiveLocationId] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsListRef = useRef<HTMLUListElement>(null);

  // Lock body scroll while open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    // Auto-focus the input when overlay opens
    setTimeout(() => inputRef.current?.focus(), 80);
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  // Close on Escape key
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  // Staggered reveal when results appear
  useEffect(() => {
    if (results.length === 0 || !resultsListRef.current) return;
    const items = resultsListRef.current.querySelectorAll("li");
    gsap.fromTo(
      items,
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.45, stagger: 0.06, ease: "power2.out" }
    );
  }, [results.length]);

  const runSearch = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (zip.length !== 5) return;
    setLoading(true);
    setError("");
    setResults([]);
    setActiveLocationId("");

    const minDelay = new Promise((r) => setTimeout(r, 300));

    try {
      const [_, response] = await Promise.all([
        minDelay,
        fetch(`/api/locations/search?zip=${encodeURIComponent(zip)}`),
      ]);
      const data = (await response.json()) as { error?: string; results?: SearchResult[] };
      if (!response.ok) throw new Error(data.error || "Unable to search locations right now.");
      const incoming = data.results || [];
      setResults(incoming);
      if (incoming.length > 0) setActiveLocationId(incoming[0].id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unexpected error while searching.");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setZip("");
    setError("");
    setResults([]);
    setActiveLocationId("");
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col overflow-y-auto bg-[#0d0d0d] px-6 py-8 md:px-10 md:py-10">
      {/* Close */}
      <button
        type="button"
        onClick={onClose}
        aria-label="Close Find a Location"
        className="absolute right-6 top-6 flex h-8 w-8 items-center justify-center rounded-full text-white/40 transition-colors hover:text-white/80 md:right-10 md:top-8"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>

      <div className="mx-auto mt-10 w-full max-w-lg">
        {/* Header */}
        <p className="mb-1 text-[11px] uppercase tracking-[0.26em] text-white/35">ARC Location Network</p>
        <p className="mb-20 text-[28px] font-light leading-tight tracking-tight text-white md:mb-24 md:text-[34px]">
          Find an ARC location near you
        </p>

        {/* ZIP form */}
        <form onSubmit={runSearch}>
          <div className="relative overflow-hidden rounded-2xl p-px">
            {/* Breathing glow — Apple-style, stops once search has run */}
            <div
              className="pointer-events-none absolute inset-0 rounded-2xl"
              style={{
                boxShadow: "0 0 24px rgba(138,210,255,0.5)",
                animation: results.length > 0 || loading ? "none" : "breathingGlow 5s ease-in-out infinite",
                opacity: results.length > 0 ? 0 : 1,
                transition: "opacity 0.4s ease-out",
              }}
            />
            <div className="relative rounded-[15px] border border-white/[0.08] bg-white/[0.04] px-5 py-5 transition-colors duration-200 focus-within:border-white/[0.12] focus-within:bg-white/[0.06]">
              <label htmlFor="overlay-zip-input" className="mb-2 block text-[13px] font-light text-white/60">
                ZIP Code
              </label>
              <div className="flex items-center gap-3">
                <input
                  ref={inputRef}
                  id="overlay-zip-input"
                  type="text"
                  inputMode="numeric"
                  pattern="\d{5}"
                  maxLength={5}
                  value={zip}
                  onChange={(e) => setZip(e.target.value.replace(/\D/g, ""))}
                  placeholder="e.g. 90210"
                  className="min-w-0 flex-1 bg-transparent text-[22px] font-light tracking-wide text-white outline-none placeholder:text-white/45"
                />
                <span className="shrink-0 text-[12px] tabular-nums text-white/40">{zip.length}/5</span>
              </div>
              <div className="mt-3 h-px w-full rounded-full bg-white/10">
                <div
                  className="h-full rounded-full transition-all duration-200"
                  style={{
                    width: `${(zip.length / 5) * 100}%`,
                    backgroundColor: zip.length === 5 ? "rgba(138,210,255,0.8)" : "rgba(138,210,255,0.4)",
                    boxShadow: zip.length > 0 ? "0 0 6px rgba(138,210,255,0.5)" : "none",
                  }}
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={zip.length !== 5 || loading}
            className="mt-4 w-full rounded-full py-4 text-[15px] font-medium tracking-tight transition-all duration-300 enabled:active:scale-[0.98] disabled:scale-[0.98] disabled:opacity-70"
            style={{
              backgroundColor: zip.length === 5 ? "rgb(255,255,255)" : "rgba(255,255,255,0.08)",
              color: zip.length === 5 ? "rgb(0,0,0)" : "rgba(255,255,255,0.3)",
              boxShadow: zip.length === 5 && results.length === 0 ? "0 0 50px rgba(138,210,255,0.18), 0 0 20px rgba(255,255,255,0.1)" : "none",
              opacity: results.length > 0 ? 0.28 : 1,
            }}
          >
            {loading ? (
              <span className="inline-flex items-center justify-center gap-2">
                <span className="h-3.5 w-3.5 animate-spin rounded-full border border-black/30 border-t-black" />
                Searching…
              </span>
            ) : "Find Locations"}
          </button>
        </form>

        {error && <p className="mt-4 text-center text-sm text-red-400/70">{error}</p>}

        {/* Results */}
        {results.length > 0 && (
          <div className="mt-8">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-[10px] uppercase tracking-[0.22em] text-white/45">Near {zip}</p>
              <div className="flex items-center gap-3">
                <p className="text-[10px] text-white/30">{results.length} location{results.length !== 1 ? "s" : ""}</p>
                <button
                  type="button"
                  onClick={reset}
                  className="text-[10px] uppercase tracking-[0.12em] text-white/30 transition-colors hover:text-white/60"
                >
                  Clear
                </button>
              </div>
            </div>

            <ul ref={resultsListRef} className="space-y-2">
              {results.map((location, index) => (
                <li key={location.id}>
                  <LocationCard
                    location={location}
                    isActive={location.id === activeLocationId}
                    isClosest={index === 0}
                    variant="dark"
                    onSelect={setActiveLocationId}
                    onProfileClick={onClose}
                  />
                </li>
              ))}
            </ul>
          </div>
        )}

        {results.length === 0 && !loading && !error && (
          <p className="mt-5 text-center text-[12px] font-light text-white/35">
            Used nationwide to find ARC-trained care locations.
          </p>
        )}
      </div>
    </div>
  );
}
