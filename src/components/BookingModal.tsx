"use client";

import { useCallback, useEffect, useState } from "react";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingUrl: string;
  locationName: string;
}

export function BookingModal({ isOpen, onClose, bookingUrl, locationName }: BookingModalProps) {
  const [iframeLoaded, setIframeLoaded] = useState(false);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (!isOpen) return;

    setIframeLoaded(false);

    // Lock page scroll while modal is open.
    // Both body and html are locked to cover iOS Safari (which scrolls html)
    // and other browsers (which scroll body).
    const prevBody = document.body.style.overflow;
    const prevHtml = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = prevBody;
      document.documentElement.style.overflow = prevHtml;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  return (
    // Outer shell: fixed inset-0 creates the full-screen layer.
    // On mobile this IS the modal — no sizing tricks, no dvh, no reflow on keyboard.
    // On desktop (md+) it acts as a centered overlay with a backdrop.
    <div
      className="fixed inset-0 z-[9999]"
      role="dialog"
      aria-modal="true"
      aria-label={`Book appointment at ${locationName}`}
    >
      {/* Backdrop — visible on desktop, invisible on mobile (modal IS the screen) */}
      <div
        className="absolute inset-0 md:bg-black/60"
        onClick={onClose}
      />

      {/* Modal panel
          Mobile:  fixed inset-0 (anchored to all 4 edges, immune to keyboard resize)
          Desktop: centered card with max-width, rounded corners, shadow
      */}
      <div
        className="
          absolute inset-0 flex flex-col bg-white
          md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2
          md:w-full md:max-w-lg md:rounded-2xl md:shadow-2xl
          md:h-[90vh]
        "
      >
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-black/[0.06] px-5 py-4">
          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-[0.18em] text-black/35">
              Check Availability
            </p>
            <p className="mt-0.5 truncate text-[15px] font-light tracking-tight text-black">
              {locationName}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="ml-4 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-black/30 transition-colors hover:bg-black/[0.05] hover:text-black/60"
            aria-label="Close booking modal"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Reassurance strip */}
        <div className="shrink-0 border-b border-black/[0.04] bg-black/[0.015] px-5 py-3">
          <p className="text-[12px] leading-relaxed text-black/45">
            Select preferred date and time. This is the fastest way to connect — the clinic will reach out after you select.
            Insurance is checked on the call prior to your visit.
          </p>
        </div>

        {/* Iframe container
            flex-1 + min-h-0 = fills all remaining space in the flex column.
            The iframe itself is absolute inset-0 so it fills the container
            exactly without any height calculation — the container owns the size.
        */}
        <div className="relative min-h-0 flex-1">
          {!iframeLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-white">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-black/10 border-t-black/50" />
            </div>
          )}
          <iframe
            src={bookingUrl}
            title={`Book appointment at ${locationName}`}
            className="absolute inset-0 h-full w-full border-0"
            onLoad={() => setIframeLoaded(true)}
          />
        </div>
      </div>
    </div>
  );
}
