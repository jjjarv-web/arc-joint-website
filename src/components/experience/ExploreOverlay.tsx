"use client";

import { useEffect, useState } from "react";

interface ExploreOverlayProps {
  open: boolean;
  onClose: () => void;
}

const suggestedTopics = [
  "Am I a candidate?",
  "PNS vs Replacement",
  "Recovery Timeline",
  "Success Rates",
  "Insurance Coverage",
];

export function ExploreOverlay({ open, onClose }: ExploreOverlayProps) {
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 bg-white/95 px-6 py-8 backdrop-blur-sm md:px-20 md:py-14">
      <button
        type="button"
        onClick={onClose}
        aria-label="Close Explore"
        className="absolute right-6 top-6 text-xl text-black/80 md:right-10 md:top-8"
      >
        ×
      </button>

      <div className="mx-auto mt-14 w-full max-w-4xl">
        <p className="mb-5 text-xs uppercase tracking-[0.26em] text-black/45">ARC Library</p>

        <div className="mb-14 border-b border-black/35 pb-3">
          <label className="sr-only" htmlFor="ask-arc">
            Ask ARC
          </label>
          <input
            id="ask-arc"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Ask ARC..."
            className="w-full bg-transparent text-4xl font-light tracking-tight text-black/85 placeholder:text-black/25 focus:outline-none md:text-6xl"
          />
        </div>

        <div className="grid gap-10 md:grid-cols-2">
          <div>
            <h3 className="mb-5 text-sm text-black/75">Suggested Topics</h3>
            <ul className="space-y-3">
              {suggestedTopics.map((topic) => (
                <li key={topic} className="text-lg text-black/55">
                  {topic}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="mb-5 text-sm text-black/75">Deep Dives</h3>
            <div className="space-y-5 text-black/80">
              <div>
                <p className="text-2xl font-light">The Science of PNS</p>
                <p className="text-sm text-black/45">
                  How neuromodulation interrupts pain signals.
                </p>
              </div>
              <div>
                <p className="text-2xl font-light">The Decision Model</p>
                <p className="text-sm text-black/45">
                  When to preserve versus when to replace.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
