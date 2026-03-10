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
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-label={`Book appointment at ${locationName}`}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal container */}
      <div className="relative z-10 mx-4 flex h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-white shadow-2xl md:mx-0">
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-black/[0.06] px-5 py-4">
          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-[0.18em] text-black/35">
              Request Appointment
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
            Requesting is the fastest way to connect — the clinic will reach out to confirm.
            Insurance is verified before your visit.
          </p>
        </div>

        {/* Iframe area */}
        <div className="relative flex-1">
          {/* Loading spinner */}
          {!iframeLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-white">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-black/10 border-t-black/50" />
            </div>
          )}

          <iframe
            src={bookingUrl}
            title={`Book appointment at ${locationName}`}
            className="h-full w-full border-0"
            onLoad={() => setIframeLoaded(true)}
          />
        </div>
      </div>
    </div>
  );
}
