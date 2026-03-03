"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Link from "next/link";
import type { SearchResult } from "@/lib/types";
import { ExploreOverlay } from "@/components/experience/ExploreOverlay";
import { KneeSelector, type KneePainRegion } from "@/components/experience/KneeSelector";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type AssessmentStep = "knee" | "duration" | "status" | "zip";
type PainRegion = KneePainRegion | "";

function getPersonalizedReview(status: string, duration?: string): { statement: string; credential: string } {
  if (status.includes("scheduled")) {
    return {
      statement: "Knee replacement is major surgery — and about 1 in 5 people still report ongoing pain after TKA.",
      credential: "Some orthopedic surgeons and neurosurgeons now evaluate ARC options that are minimally invasive and typically outpatient, before moving forward with replacement.",
    };
  }
  if (status.includes("waiting")) {
    return {
      statement: "Pausing before replacement is common — recovery can extend well beyond the first few weeks, and about 20% still experience persistent pain after TKA.",
      credential: "Some orthopedic surgeons and neurosurgeons now offer ARC evaluations focused on pain relief and improved mobility using minimally invasive, typically outpatient approaches.",
    };
  }
  if (status.includes("still in pain")) {
    return {
      statement: "Most people expect replacement to end the pain — but research shows about 1 in 5 patients still report persistent pain after TKA.",
      credential: "Some orthopedic surgeons and neurosurgeons now evaluate ARC options specifically for post-replacement pain. Peer-reviewed evidence supports that PNS can reduce persistent pain and improve function in appropriate patients.",
    };
  }
  const isEarly = duration?.toLowerCase().includes("less than 6");
  return {
    statement: isEarly
      ? "If replacement hasn't been recommended yet, you're in the ideal ARC moment — get clarity before committing to irreversible surgery."
      : "Exploring options before replacement is the right move — catching it early can open doors that aren't available later.",
    credential: "Some orthopedic surgeons and neurosurgeons now evaluate ARC approaches that are minimally invasive and typically outpatient, designed to help preserve future options.",
  };
}

export function HomeExperience() {
  const [exploreOpen, setExploreOpen] = useState(false);
  const [step, setStep] = useState<AssessmentStep>("knee");
  const [painRegion, setPainRegion] = useState<PainRegion>("");
  const [duration, setDuration] = useState("");
  const [replacementStatus, setReplacementStatus] = useState("");
  const [zip, setZip] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [analyzing, setAnalyzing] = useState(false);
  const [reviewVisible, setReviewVisible] = useState(false);
  const [providerZip, setProviderZip] = useState("");
  const [providerLoading, setProviderLoading] = useState(false);
  const [providerError, setProviderError] = useState("");
  const [providerResults, setProviderResults] = useState<SearchResult[]>([]);
  const container = useRef<HTMLDivElement>(null);
  const productSectionRef = useRef<HTMLElement>(null);
  const kneeSectionRef = useRef<HTMLDivElement>(null);
  const assessmentPanelRef = useRef<HTMLDivElement>(null);

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
  const providerNearestLabel = useMemo(
    () => (providerResults.length > 0 ? `${providerResults.length} providers` : ""),
    [providerResults]
  );

  const resetAssessment = () => {
    setStep("knee");
    setPainRegion("");
    setDuration("");
    setReplacementStatus("");
    setZip("");
    setError("");
    setResults([]);
    setLoading(false);
  };

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

  const runProviderSearch = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setProviderLoading(true);
    setProviderError("");
    setProviderResults([]);
    try {
      const response = await fetch(`/api/providers/search?zip=${encodeURIComponent(providerZip)}`);
      const data = (await response.json()) as { error?: string; results?: SearchResult[] };
      if (!response.ok) {
        throw new Error(data.error || "Unable to search providers right now.");
      }
      setProviderResults(data.results || []);
    } catch (requestError) {
      const message =
        requestError instanceof Error
          ? requestError.message
          : "Unexpected issue while searching providers.";
      setProviderError(message);
    } finally {
      setProviderLoading(false);
    }
  };

  const handlePainSelection = (region: KneePainRegion) => {
    setPainRegion(region);
    setStep("duration");
  };

  useEffect(() => {
    if (step === "knee" || !assessmentPanelRef.current) {
      return;
    }
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const duration = prefersReducedMotion ? 0 : 0.35;
    gsap.fromTo(
      assessmentPanelRef.current,
      { autoAlpha: 0 },
      { autoAlpha: 1, duration, ease: "power2.out" }
    );
  }, [step]);

  useEffect(() => {
    if (step !== "zip") {
      setAnalyzing(false);
      setReviewVisible(false);
      return;
    }
    setReviewVisible(false);
    setAnalyzing(true);
    const t = window.setTimeout(() => {
      setAnalyzing(false);
      setReviewVisible(true);
    }, 1800);
    return () => window.clearTimeout(t);
  }, [step]);

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

      <div ref={kneeSectionRef} className="relative z-30 min-h-screen bg-black">
        <KneeSelector
          selectedRegion={painRegion}
          onSelect={handlePainSelection}
          visible={step === "knee"}
        />
        {step !== "knee" && (
          <div
            ref={assessmentPanelRef}
            className="assessment-panel pointer-events-auto fixed inset-0 z-[35] flex flex-col items-center justify-center bg-black px-6 py-12"
          >
            <div className="mx-auto w-full max-w-lg">
              <p className="mb-4 text-center text-[11px] uppercase tracking-[0.18em] text-white/70">
                Step {step === "duration" ? 2 : step === "status" ? 3 : 4} of 4
              </p>
              <div className="rounded-2xl border border-white/15 bg-white/5 p-6 backdrop-blur-sm md:p-8">
                {step === "duration" && (
                  <>
                    <p className="mb-5 text-2xl font-light text-white/94 md:text-3xl">
                      How long has it been present?
                    </p>
                    <div className="space-y-3">
                      {["Less than 6 months", "6 to 24 months", "More than 2 years"].map((value) => (
                        <button
                          key={value}
                          type="button"
                          onClick={() => {
                            setDuration(value);
                            setStep("status");
                          }}
                          className="w-full rounded-xl border border-white/20 px-5 py-4 text-left text-white/90 transition-colors hover:bg-white/10 hover:text-white"
                        >
                          {value}
                        </button>
                      ))}
                    </div>
                  </>
                )}

                {step === "status" && (
                  <>
                    <button
                      type="button"
                      onClick={() => setStep("duration")}
                      className="mb-4 text-sm text-white/60 underline hover:text-white/80"
                    >
                      Back
                    </button>
                    <p className="mb-5 text-2xl font-light text-white/94 md:text-3xl">
                      Has a doctor recommended knee replacement?
                    </p>
                    <div className="space-y-3">
                      {[
                        "Yes, it is scheduled",
                        "Yes, but I am waiting",
                        "Not yet",
                        "Had a replacement — still in pain",
                      ].map((value) => (
                        <button
                          key={value}
                          type="button"
                          onClick={() => {
                            setReplacementStatus(value);
                            setStep("zip");
                          }}
                          className="w-full rounded-xl border border-white/20 px-5 py-4 text-left text-white/90 transition-colors hover:bg-white/10 hover:text-white"
                        >
                          {value}
                        </button>
                      ))}
                    </div>
                  </>
                )}

                {step === "zip" && analyzing && (
                  <div className="flex min-h-[12rem] flex-col items-center justify-center gap-4">
                    <p className="animate-pulse text-[11px] uppercase tracking-[0.22em] text-white/50">
                      Analyzing your inputs…
                    </p>
                    <div className="flex gap-1.5">
                      {[0, 1, 2].map((i) => (
                        <span
                          key={i}
                          className="h-1 w-1 rounded-full bg-white/30 animate-pulse"
                          style={{ animationDelay: `${i * 0.2}s` }}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {step === "zip" && !analyzing && reviewVisible && (() => {
                  const { statement, credential } = getPersonalizedReview(replacementStatus, duration);
                  return (
                    <div className="animate-[fadeIn_0.5s_ease-out_forwards]">
                      <button
                        type="button"
                        onClick={() => setStep("status")}
                        className="mb-5 text-sm text-white/50 underline hover:text-white/70"
                      >
                        Back
                      </button>
                      <p className="mb-2 text-[11px] uppercase tracking-[0.18em] text-white/40">
                        Your Knee Pain Review
                      </p>
                      <p className="text-[17px] font-light leading-relaxed text-white/90 md:text-lg">
                        {statement}
                      </p>
                      <p className="mt-4 text-[15px] font-light leading-relaxed text-white/60 md:text-base">
                        {credential}
                      </p>
                      <div className="mt-8 border-t border-white/10 pt-7">
                        <p className="mb-4 text-[11px] uppercase tracking-[0.18em] text-white/40">
                          Find a center near you
                        </p>
                        <form onSubmit={runSearch}>
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
                            placeholder="ZIP code"
                            className="w-full border-b border-white/25 bg-transparent pb-3 text-3xl font-light tracking-tight text-white outline-none placeholder:text-white/30 md:text-4xl"
                          />
                          <button
                            type="submit"
                            disabled={zip.length !== 5 || loading}
                            className="mt-5 rounded-full border border-white/25 px-6 py-2.5 text-sm font-medium text-white/90 transition-colors hover:bg-white/10 disabled:opacity-40"
                          >
                            {loading ? "Searching…" : "Find Providers"}
                          </button>
                        </form>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {error && <p className="mt-4 text-center text-sm text-red-400">{error}</p>}

              {results.length > 0 && (
                <div className="mt-6 rounded-2xl border border-white/15 bg-white/5 p-6 backdrop-blur-sm md:p-8">
                  <div className="mb-5 flex items-center justify-between">
                    <p className="text-xl font-light text-white/94">
                      Providers near <span className="font-medium">{zip}</span>
                    </p>
                    <p className="text-sm text-white/60">{nearestLabel}</p>
                  </div>
                  <ul className="space-y-3">
                    {results.map((provider) => (
                      <li
                        key={provider.id}
                        className="rounded-xl border border-white/15 px-5 py-4"
                      >
                        <div className="flex items-center justify-between gap-4">
                          <p className="text-lg text-white/94">{provider.name}</p>
                          <Link
                            href={`/providers/${provider.slug}`}
                            className="rounded-full border border-white/30 px-3 py-1 text-xs uppercase tracking-[0.1em] text-white/90 hover:bg-white/10"
                          >
                            View
                          </Link>
                        </div>
                        <p className="text-sm text-white/60">
                          {provider.city}, {provider.state} • {provider.distanceMiles.toFixed(1)} mi
                        </p>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/providers"
                    className="mt-5 inline-block text-sm text-white/70 underline hover:text-white/90"
                  >
                    See all providers
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <section className="relative z-20 flex min-h-[75vh] flex-col items-center justify-center bg-[#f7f7f7] px-6">
        <div data-reveal className="mx-auto w-full max-w-4xl text-center">
          <h3 className="text-[clamp(44px,6vw,72px)] font-semibold leading-tight text-black">
            Let&apos;s see where you
            <br />
            are.
          </h3>
          <button
            type="button"
            onClick={() => {
              resetAssessment();
              requestAnimationFrame(() => {
                const trigger = kneeSectionRef.current;
                if (!trigger) return;
                const rect = trigger.getBoundingClientRect();
                const scrollY = window.scrollY ?? document.documentElement.scrollTop;
                const triggerTop = rect.top + scrollY;
                const targetScroll = triggerTop + 3.6 * window.innerHeight;
                window.scrollTo({ top: targetScroll, behavior: "smooth" });
              });
            }}
            className="mt-8 text-base font-semibold text-black transition-opacity hover:opacity-70"
          >
            Begin Assessment
            <span className="ml-1" aria-hidden="true">&gt;</span>
          </button>
        </div>
      </section>

      <section className="relative z-20 flex flex-col items-center justify-center bg-white px-6 py-20">
        <div className="mx-auto w-full max-w-2xl text-center">
          <h3 className="text-xs font-normal tracking-[0.18em] text-black/35">
            Find a provider near you
          </h3>
          <form onSubmit={runProviderSearch} className="mt-5">
            <div className="group inline-flex items-center gap-3 rounded-full border border-black/5 bg-white/95 px-5 py-3 shadow-[0_6px_18px_rgba(0,0,0,0.08),0_1px_0_rgba(255,255,255,0.8)_inset] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_26px_rgba(0,0,0,0.14),0_1px_0_rgba(255,255,255,0.95)_inset]">
              <label htmlFor="provider-zip" className="sr-only">
                Enter ZIP code
              </label>
              <input
                id="provider-zip"
                type="text"
                inputMode="numeric"
                pattern="\d{5}"
                maxLength={5}
                value={providerZip}
                onChange={(e) => setProviderZip(e.target.value.replace(/\D/g, ""))}
                placeholder="ZIP code"
                className="w-24 bg-transparent text-[15px] font-medium tracking-tight text-black outline-none placeholder:text-black/40"
              />
              <button
                type="submit"
                disabled={providerZip.length !== 5 || providerLoading}
                className="flex items-center gap-1.5 text-[15px] font-medium tracking-tight text-black transition-opacity hover:opacity-70 disabled:opacity-40"
              >
                {providerLoading ? "Searching…" : "Find"}
                <span aria-hidden="true">&gt;</span>
              </button>
            </div>
          </form>
          {providerError && (
            <p className="mt-4 text-sm text-red-500">{providerError}</p>
          )}
          {providerResults.length > 0 && (
            <div className="mt-8 rounded-2xl border border-black/8 bg-white/80 p-6 text-left backdrop-blur-sm">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-lg font-medium text-black">
                  Providers near <span className="font-semibold">{providerZip}</span>
                </p>
                <p className="text-sm text-black/55">{providerNearestLabel}</p>
              </div>
              <ul className="space-y-3">
                {providerResults.map((provider) => (
                  <li
                    key={provider.id}
                    className="rounded-xl border border-black/8 px-5 py-4"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <p className="font-medium text-black">{provider.name}</p>
                      <Link
                        href={`/providers/${provider.slug}`}
                        className="rounded-full border border-black/15 px-3 py-1 text-xs uppercase tracking-[0.1em] text-black/90 transition-colors hover:bg-black/5"
                      >
                        View
                      </Link>
                    </div>
                    <p className="mt-1 text-sm text-black/55">
                      {provider.city}, {provider.state} • {provider.distanceMiles.toFixed(1)} mi
                    </p>
                  </li>
                ))}
              </ul>
              <Link
                href="/providers"
                className="mt-4 inline-block text-sm text-black/70 underline hover:text-black/90"
              >
                See all providers
              </Link>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
