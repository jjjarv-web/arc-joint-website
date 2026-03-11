"use client";

import { useState } from "react";
import Link from "next/link";
import { ExploreOverlay } from "@/components/experience/ExploreOverlay";

export default function ThankYouPage() {
  const [exploreOpen, setExploreOpen] = useState(false);

  return (
    <>
      <main className="min-h-screen">
        {/* Hero */}
        <section className="bg-[#0d0d0d] px-6 pb-14 pt-20 md:px-10">
          <div className="mx-auto w-full max-w-2xl">
            <p className="text-[11px] uppercase tracking-[0.26em] text-white/35">
              Appointment sent
            </p>
            <h1 className="mt-4 text-[clamp(32px,5vw,48px)] font-light leading-tight tracking-tight text-white">
              Your appointment has been sent to the clinic
            </h1>
            <p className="mt-5 max-w-xl text-[16px] font-light leading-relaxed text-white/55">
              Your information and appointment details have been securely delivered to the clinic you selected.
            </p>
            <p className="mt-3 text-[15px] font-light leading-relaxed text-white/50">
              You should receive a text message and email shortly confirming your appointment details.
            </p>
          </div>
        </section>

        {/* Body */}
        <section className="bg-white px-6 py-14 md:px-10">
          <div className="mx-auto w-full max-w-2xl space-y-12">
            {/* What happens next */}
            <div>
              <h2 className="mb-6 text-[22px] font-light tracking-tight text-black">
                What happens next
              </h2>
              <ol className="space-y-4">
                <li className="flex items-start gap-4">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-[12px] font-medium text-emerald-700">
                    ✓
                  </span>
                  <div>
                    <p className="font-medium text-black">Step 1: Appointment sent</p>
                    <p className="mt-0.5 text-[14px] text-black/55">Complete</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-black/15 text-[12px] font-medium text-black/60">
                    2
                  </span>
                  <div>
                    <p className="font-medium text-black">Step 2: Clinic confirms details</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-black/15 text-[12px] font-medium text-black/60">
                    3
                  </span>
                  <div>
                    <p className="font-medium text-black">Step 3: Evaluation visit</p>
                  </div>
                </li>
              </ol>
              <p className="mt-6 text-[15px] leading-relaxed text-black/60">
                A care coordinator from the clinic will contact you to verify insurance coverage and finalize your visit details.
              </p>
            </div>

            <div className="h-px w-full bg-black/[0.06]" />

            {/* Important */}
            <div>
              <h2 className="mb-4 text-[22px] font-light tracking-tight text-black">
                Important
              </h2>
              <ul className="space-y-3 text-[15px] leading-relaxed text-black/65">
                <li>Please answer the clinic&apos;s call if possible.</li>
                <li>They may contact you from a number you do not recognize.</li>
                <li>
                  If you miss the call or need to speak with someone sooner, please use the phone number included in the text message or email confirmation the clinic is sending.
                </li>
              </ul>
            </div>

            <div className="h-px w-full bg-black/[0.06]" />

            {/* While you wait */}
            <div>
              <h2 className="mb-4 text-[22px] font-light tracking-tight text-black">
                While you wait
              </h2>
              <button
                type="button"
                onClick={() => setExploreOpen(true)}
                className="inline-flex items-center gap-2 text-[15px] font-medium text-black transition-colors hover:text-black/70"
              >
                See how ARC works
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="7" y1="17" x2="17" y2="7" />
                  <polyline points="7 7 17 7 17 17" />
                </svg>
              </button>
            </div>

            {/* Back to home */}
            <div className="pt-4">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-[13px] text-black/45 transition-colors hover:text-black/70"
              >
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
                Back to home
              </Link>
            </div>
          </div>
        </section>
      </main>

      <ExploreOverlay open={exploreOpen} onClose={() => setExploreOpen(false)} />
    </>
  );
}
