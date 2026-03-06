"use client";

import { useState } from "react";
import { ExploreOverlay } from "@/components/experience/ExploreOverlay";
import { FindLocationOverlay } from "@/components/FindLocationOverlay";

export function SiteNav() {
  const [exploreOpen, setExploreOpen] = useState(false);
  const [findLocationOpen, setFindLocationOpen] = useState(false);

  const pillPrimary =
    "inline-flex items-center gap-2 rounded-full border border-black/5 bg-white/95 px-5 py-2.5 text-[15px] font-medium tracking-tight text-black shadow-[0_6px_18px_rgba(0,0,0,0.08),0_1px_0_rgba(255,255,255,0.8)_inset] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_26px_rgba(0,0,0,0.14),0_1px_0_rgba(255,255,255,0.95)_inset]";

  const pillSubtle =
    "inline-flex items-center gap-2 rounded-full border border-black/[0.04] bg-white/60 px-5 py-2.5 text-[15px] font-medium tracking-tight text-black/50 transition-all duration-300 hover:-translate-y-0.5 hover:text-black/75";

  return (
    <>
      {/* Floating pill pair — fixed top-right on every page */}
      <div className="fixed right-5 top-5 z-40 flex items-center gap-2 md:right-8 md:top-6">
        {/* Explore — secondary/subtle */}
        <button
          type="button"
          onClick={() => setExploreOpen(true)}
          className={pillSubtle}
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="h-[17px] w-[17px]"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="7" />
            <line x1="16.65" y1="16.65" x2="21" y2="21" />
          </svg>
          Explore
        </button>

        {/* Find Location — primary */}
        <button
          type="button"
          onClick={() => setFindLocationOpen(true)}
          className={pillPrimary}
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="h-[15px] w-[15px]"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
            <circle cx="12" cy="9" r="2.5" />
          </svg>
          <span className="hidden sm:inline">Find Location</span>
          <span className="sm:hidden">Find</span>
        </button>
      </div>

      {/* Overlays */}
      <ExploreOverlay open={exploreOpen} onClose={() => setExploreOpen(false)} />
      <FindLocationOverlay open={findLocationOpen} onClose={() => setFindLocationOpen(false)} />
    </>
  );
}
