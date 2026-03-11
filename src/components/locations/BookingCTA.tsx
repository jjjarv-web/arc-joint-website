"use client";

import { useState } from "react";
import { BookingModal } from "@/components/BookingModal";

interface BookingCTAProps {
  bookingUrl: string;
  locationName: string;
  className?: string;
}

export function BookingCTA({ bookingUrl, locationName, className }: BookingCTAProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={className}
      >
        Check Availability
      </button>
      <BookingModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        bookingUrl={bookingUrl}
        locationName={locationName}
      />
    </>
  );
}
