"use client";

import { useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Link from "next/link";
import type { SearchResult } from "@/lib/types";
import { ExploreOverlay } from "@/components/experience/ExploreOverlay";
import { KneeSelector, type KneePainRegion } from "@/components/experience/KneeSelector";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type AssessmentStep = "intro" | "duration" | "status" | "zip";
type PainRegion = KneePainRegion | "";

export function HomeExperience() {
  const [exploreOpen, setExploreOpen] = useState(false);
  const [step, setStep] = useState<AssessmentStep>("intro");
  const [painRegion, setPainRegion] = useState<PainRegion>("");
  const [duration, setDuration] = useState("");
  const [replacementStatus, setReplacementStatus] = useState("");
  const [zip, setZip] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const container = useRef<HTMLDivElement>(null);
  const productSectionRef = useRef<HTMLElement>(null);
  const kneeSectionRef = useRef<HTMLDivElement>(null);
  const assessmentStepsRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const heroTimeline = gsap.timeline({ defaults: { ease: "power2.out" } });
      heroTimeline
        .fromTo(
          ".hero-arc",
          { autoAlpha: 0, y: 24 },
          { autoAlpha: 1, y: 0, duration: 1.4 }
        )
        .fromTo(
          ".hero-subtitle",
          { autoAlpha: 0, y: 16 },
          { autoAlpha: 1, y: 0, duration: 1.1 },
          "-=0.35"
        )
        .fromTo(
          ".hero-scroll-hint",
          { autoAlpha: 0 },
          { autoAlpha: 1, duration: 1 },
          "+=0.55"
        );

      const reveals = gsap.utils.toArray<HTMLElement>("[data-reveal]");
      reveals.forEach((element) => {
        gsap.fromTo(
          element,
          { autoAlpha: 0, y: 32 },
          {
            autoAlpha: 1,
            y: 0,
            ease: "power2.out",
            duration: 1.2,
            scrollTrigger: {
              trigger: element,
              start: "top 82%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });

      const disruptionTimeline = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: ".disruption-section",
          start: "top 48%",
          end: "top -28%",
          scrub: 2,
        },
      });

      disruptionTimeline
        .fromTo(
          ".disruption-eyebrow",
          { autoAlpha: 0, y: 10 },
          { autoAlpha: 1, y: 0, duration: 1.9 }
        )
        .fromTo(
          ".disruption-headline",
          { autoAlpha: 0, scale: 0.96, y: 12, z: -35, filter: "blur(2px)" },
          { autoAlpha: 1, scale: 1, y: 0, z: 0, filter: "blur(0px)", duration: 2.2 },
          "+=1.15"
        )
        .to(
          ".disruption-headline",
          { scale: 1.045, y: -2, z: 15, duration: 1.85 },
          "+=0.25"
        )
        .fromTo(
          ".disruption-cinematic",
          { autoAlpha: 0, y: 10 },
          { autoAlpha: 1, y: 0, duration: 1.6 },
          "+=0.45"
        );

      gsap.fromTo(
        ".philosophy-label",
        { autoAlpha: 0, y: 10 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 1.2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".philosophy-section",
            start: "top 62%",
            toggleActions: "play none none reverse",
          },
        }
      );

      gsap.fromTo(
        ".philosophy-ghost",
        { autoAlpha: 0, y: -36 },
        {
          autoAlpha: 1,
          y: 0,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".philosophy-section",
            start: "top 96%",
            end: "top 54%",
            scrub: 1.45,
          },
        }
      );

      gsap.fromTo(
        ".philosophy-step",
        { autoAlpha: 0, y: 26 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 1.05,
          ease: "power2.out",
          stagger: 0.26,
          scrollTrigger: {
            trigger: ".philosophy-steps",
            start: "top 78%",
            toggleActions: "play none none reverse",
          },
        }
      );

      gsap.fromTo(
        ".product-visual",
        { autoAlpha: 0 },
        {
          autoAlpha: 1,
          duration: 2.35,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".product-headline",
            start: "bottom 92%",
            toggleActions: "play none none reverse",
          },
        }
      );

      gsap.fromTo(
        ".product-copy",
        { autoAlpha: 0, x: 86 },
        {
          autoAlpha: 1,
          x: 0,
          duration: 1.95,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".product-headline",
            start: "bottom 92%",
            toggleActions: "play none none reverse",
          },
        }
      );

      gsap.fromTo(
        ".product-bullet",
        { autoAlpha: 0, y: 12 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.85,
          ease: "power2.out",
          stagger: 0.22,
          scrollTrigger: {
            trigger: ".product-bullets",
            start: "top 88%",
            toggleActions: "play none none reverse",
          },
        }
      );

      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (prefersReducedMotion) {
        gsap.set(".product-dim-overlay", { opacity: 0.55 });
        return;
      }

      const handoffMedia = gsap.matchMedia();
      handoffMedia.add(
        { isMobile: "(max-width: 767px)", isDesktop: "(min-width: 768px)" },
        (context) => {
          const conditions = context.conditions as { isMobile: boolean; isDesktop: boolean };
          const dimTarget = conditions.isMobile ? 0.5 : 0.55;

          gsap.set(".product-dim-overlay", { opacity: 0 });

          gsap.to(".product-dim-overlay", {
            opacity: dimTarget,
            ease: "none",
            scrollTrigger: {
              trigger: kneeSectionRef.current,
              start: "top bottom",
              end: "top 72%",
              scrub: 1.1,
            },
          });
        }
      );

      return () => handoffMedia.revert();
    },
    { scope: container }
  );

  const nearestLabel = useMemo(() => (results.length > 0 ? `${results.length} providers` : ""), [results]);

  const runSearch = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setResults([]);

    try {
      const response = await fetch(`/api/providers/search?zip=${encodeURIComponent(zip)}`);
      const data = (await response.json()) as { error?: string; results?: SearchResult[] };

      if (!response.ok) {
        throw new Error(data.error || "Unable to search providers right now.");
      }

      setResults(data.results || []);
    } catch (requestError) {
      const message =
        requestError instanceof Error
          ? requestError.message
          : "Unexpected issue while searching providers.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handlePainSelection = (region: KneePainRegion) => {
    setPainRegion(region);
    setStep("duration");
    requestAnimationFrame(() => {
      assessmentStepsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  return (
    <main ref={container} className="relative bg-white text-[#111111]">
      <button
        type="button"
        onClick={() => setExploreOpen(true)}
        className="fixed right-5 top-5 z-40 inline-flex items-center gap-2 rounded-full border border-black/5 bg-white/95 px-5 py-2.5 text-[15px] font-medium tracking-tight text-black shadow-[0_6px_18px_rgba(0,0,0,0.08),0_1px_0_rgba(255,255,255,0.8)_inset] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_26px_rgba(0,0,0,0.14),0_1px_0_rgba(255,255,255,0.95)_inset] md:right-8 md:top-6"
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
      <ExploreOverlay open={exploreOpen} onClose={() => setExploreOpen(false)} />

      <section className="sticky top-0 z-0 flex h-screen flex-col items-center justify-center px-6 text-center">
        <p className="hero-arc text-[clamp(56px,12vw,150px)] font-light tracking-tight">
          ARC
        </p>
        <p className="hero-subtitle mt-3 text-[13px] uppercase tracking-[0.32em] text-black/55 md:text-[14px]">
          Alternative Replacement Care
        </p>
        <p className="hero-scroll-hint mt-40 text-xs text-black/35">
          Scroll to begin
        </p>
      </section>

      <section className="disruption-section relative z-20 flex min-h-screen items-center justify-center bg-white px-6 py-20">
        <div className="disruption-inner mx-auto w-full max-w-4xl text-center [perspective:1200px]">
          <p className="disruption-eyebrow text-3xl font-light text-black/38 md:text-5xl">
            You were told replacement is inevitable.
          </p>
          <h2 className="disruption-headline mt-12 origin-center text-[clamp(46px,9vw,92px)] font-semibold leading-none">
            What if it isn&apos;t?
          </h2>
          <div className="disruption-cinematic mt-12 h-[52vh] rounded-2xl bg-[#f2f2f2] text-center text-sm tracking-[0.25em] text-black/20">
            <div className="flex h-full items-center justify-center">CINEMATIC PLACEHOLDER</div>
          </div>
        </div>
      </section>

      <section className="philosophy-section relative z-20 flex min-h-screen items-center bg-black px-6 py-20 text-white">
        <p className="philosophy-ghost pointer-events-none absolute left-1/2 top-[15vh] -translate-x-1/2 text-[clamp(72px,9.5vw,138px)] font-light tracking-tight text-white/[0.08]">
          ARC
        </p>
        <div className="mx-auto w-full max-w-5xl">
          <div className="text-center">
            <p className="philosophy-label text-xs uppercase tracking-[0.26em] text-white/52">
              The Philosophy
            </p>
            <h3 className="mx-auto mt-4 max-w-3xl text-balance text-[clamp(32px,4.6vw,58px)] font-light leading-[1.04] text-white/94">
              A new decision model for orthopedic medicine.
            </h3>
          </div>
          <div className="philosophy-steps mt-12 grid gap-5 text-center md:grid-cols-3">
            <div className="philosophy-step">
              <p className="text-[clamp(40px,4.5vw,62px)] font-thin leading-none tracking-tight text-white/88">
                Preserve
              </p>
              <p className="mt-3 text-xs leading-relaxed text-white/50 md:text-sm">
                Maintain your natural biology.
              </p>
            </div>
            <div className="philosophy-step">
              <p className="text-[clamp(40px,4.5vw,62px)] font-thin leading-none tracking-tight text-white/88">
                Modulate
              </p>
              <p className="mt-3 text-xs leading-relaxed text-white/50 md:text-sm">
                Control pain signals at the source.
              </p>
            </div>
            <div className="philosophy-step">
              <p className="bg-gradient-to-r from-white/34 via-white/24 to-white/12 bg-clip-text text-[clamp(40px,4.5vw,62px)] font-thin leading-none tracking-tight text-transparent">
                Replace
              </p>
              <p className="mt-3 text-xs leading-relaxed text-white/25 md:text-sm">
                Only when absolutely necessary.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section
        ref={productSectionRef}
        className="product-section sticky top-0 z-20 flex h-screen items-center overflow-hidden bg-white px-6 py-20"
      >
        <div className="product-dim-overlay pointer-events-none absolute inset-0 bg-black opacity-0" />
        <div className="mx-auto grid w-full max-w-6xl items-center gap-14 md:grid-cols-2">
          <div
            className="product-visual flex aspect-square items-center justify-center rounded-3xl bg-[#f4f4f4] text-xs uppercase tracking-[0.28em] text-black/20"
          >
            Rotating knee placeholder
          </div>
          <div className="product-copy">
            <h3 className="product-headline text-[clamp(40px,6vw,76px)] font-semibold leading-none">
              Peripheral
              <br />
              Nerve
              <br />
              Stimulation
            </h3>
            <p className="mt-5 max-w-md text-xl font-light text-black/55">
              Precision neuromodulation. No joint removal. No bone hardware.
            </p>
            <ul className="product-bullets mt-8 space-y-3 text-base font-light text-black/82 md:text-[17px]">
              <li className="product-bullet">• Minimally invasive</li>
              <li className="product-bullet">• Reversible</li>
              <li className="product-bullet">• Rapid recovery</li>
            </ul>
          </div>
        </div>
      </section>

      <div ref={kneeSectionRef} className="relative z-30 bg-black">
        <KneeSelector selectedRegion={painRegion} onSelect={handlePainSelection} />
      </div>

      <section className="relative z-20 min-h-screen bg-[#f6f6f6] px-6 py-24">
        <div className="mx-auto w-full max-w-4xl">
          <div data-reveal className="mb-12 text-center">
            <h3 className="text-[clamp(44px,6vw,72px)] font-semibold leading-none">Let&apos;s see where you are.</h3>
            <button
              type="button"
              onClick={() => {
                requestAnimationFrame(() => {
                  kneeSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
                });
              }}
              className="mt-6 border-b border-black pb-1 text-lg"
            >
              Begin Assessment
            </button>
          </div>

          {step !== "intro" && (
              <div ref={assessmentStepsRef} data-reveal className="space-y-8">
                <div className="rounded-2xl border border-black/10 bg-white p-8">
                  {step === "duration" && (
                    <>
                      <p className="mb-5 text-3xl font-light">How long has it been present?</p>
                      <div className="space-y-3">
                        {["Less than 6 months", "6 to 24 months", "More than 2 years"].map((value) => (
                          <button
                            key={value}
                            type="button"
                            onClick={() => {
                              setDuration(value);
                              setStep("status");
                            }}
                            className="w-full rounded-xl border border-black/15 px-5 py-4 text-left hover:bg-black hover:text-white"
                          >
                            {value}
                          </button>
                        ))}
                      </div>
                    </>
                  )}

                  {step === "status" && (
                    <>
                      <p className="mb-5 text-3xl font-light">Have you been told you need replacement?</p>
                      <div className="space-y-3">
                        {[
                          "Yes, it is scheduled",
                          "Yes, but I am waiting",
                          "Not yet",
                          "I am considering options",
                        ].map((value) => (
                          <button
                            key={value}
                            type="button"
                            onClick={() => {
                              setReplacementStatus(value);
                              setStep("zip");
                            }}
                            className="w-full rounded-xl border border-black/15 px-5 py-4 text-left hover:bg-black hover:text-white"
                          >
                            {value}
                          </button>
                        ))}
                      </div>
                    </>
                  )}

                  {step === "zip" && (
                    <>
                      <p className="text-2xl font-light text-black/58">You may not be out of options.</p>
                      <p className="mt-2 text-4xl font-medium">Find your ARC provider.</p>
                      <form className="mt-8" onSubmit={runSearch}>
                        <label className="sr-only" htmlFor="zip-input">
                          Enter ZIP code
                        </label>
                        <input
                          id="zip-input"
                          type="text"
                          inputMode="numeric"
                          pattern="\d{5}"
                          maxLength={5}
                          value={zip}
                          onChange={(event) => setZip(event.target.value.replace(/\D/g, ""))}
                          placeholder="Enter ZIP code"
                          className="w-full border-b-2 border-black/20 bg-transparent py-3 text-5xl font-light tracking-tight outline-none placeholder:text-black/20"
                        />
                        <button
                          type="submit"
                          disabled={zip.length !== 5 || loading}
                          className="mt-5 rounded-full border border-black/20 px-6 py-2 disabled:opacity-40"
                        >
                          {loading ? "Searching..." : "Search"}
                        </button>
                      </form>
                    </>
                  )}
                </div>

                {(painRegion || duration || replacementStatus) && (
                  <p className="text-sm text-black/45">
                    Captured state: {painRegion || "n/a"} • {duration || "n/a"} •{" "}
                    {replacementStatus || "n/a"}
                  </p>
                )}

                {error && <p className="text-sm text-red-600">{error}</p>}

                {results.length > 0 && (
                  <div className="rounded-2xl border border-black/10 bg-white p-8">
                    <div className="mb-5 flex items-center justify-between">
                      <p className="text-2xl font-light">
                        Providers near <span className="font-medium">{zip}</span>
                      </p>
                      <p className="text-sm text-black/45">{nearestLabel}</p>
                    </div>
                    <ul className="space-y-3">
                      {results.map((provider) => (
                        <li key={provider.id} className="rounded-xl border border-black/10 px-5 py-4">
                          <div className="flex items-center justify-between gap-4">
                            <p className="text-xl">{provider.name}</p>
                            <Link
                              href={`/providers/${provider.slug}`}
                              className="rounded-full border border-black/20 px-3 py-1 text-xs uppercase tracking-[0.1em]"
                            >
                              View
                            </Link>
                          </div>
                          <p className="text-sm text-black/50">
                            {provider.city}, {provider.state} • {provider.distanceMiles.toFixed(1)} mi
                          </p>
                        </li>
                      ))}
                    </ul>
                    <Link href="/providers" className="mt-5 inline-block text-sm text-black/55 underline">
                      See all providers
                    </Link>
                  </div>
                )}
              </div>
          )}
        </div>
      </section>
    </main>
  );
}
