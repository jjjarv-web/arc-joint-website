"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Link from "next/link";
import type { SearchResult } from "@/lib/types";
import { AssessmentErrorBoundary } from "@/components/experience/AssessmentErrorBoundary";
import { BodySelector } from "@/components/experience/BodySelector";
import type { JointRegion } from "@/lib/types";
import { ProviderCard } from "@/components/experience/ProviderCard";
import { FindProviderOverlay } from "@/components/FindProviderOverlay";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type AssessmentStep = "knee" | "duration" | "status" | "zip";
type PainRegion = JointRegion | "";

// ── Joint display helpers ─────────────────────────────────────────────────────
const JOINT_DISPLAY_NAME: Record<JointRegion, string> = {
  cervical:        "cervical spine",
  "left-shoulder": "left shoulder",
  "right-shoulder":"right shoulder",
  lumbar:          "lower back",
  "left-hip":      "left hip",
  "right-hip":     "right hip",
  "left-knee":     "left knee",
  "right-knee":    "right knee",
  "left-ankle":    "left ankle",
  "right-ankle":   "right ankle",
};

// Generic joint group for copy purposes
type JointGroup = "spine" | "shoulder" | "hip" | "knee" | "ankle";
function jointGroup(region: JointRegion): JointGroup {
  if (region === "cervical" || region === "lumbar") return "spine";
  if (region.includes("shoulder")) return "shoulder";
  if (region.includes("hip")) return "hip";
  if (region.includes("ankle")) return "ankle";
  return "knee";
}

function getPersonalizedReview(
  region: JointRegion | "",
  status: string,
  duration?: string
): { statement: string; credential: string } {
  const name = region ? JOINT_DISPLAY_NAME[region] : "joint";
  const group = region ? jointGroup(region) : "knee";

  // Post-procedure pain — applies to all joint types
  if (status.includes("still in pain")) {
    return {
      statement: `Most people expect surgery to end the pain — but research shows a meaningful percentage of patients still report persistent pain after ${name} procedures.`,
      credential: "Some orthopedic surgeons and neurosurgeons now evaluate ARC options specifically for post-procedure pain. Peer-reviewed evidence supports that PNS can reduce persistent pain and improve function in appropriate patients.",
    };
  }

  // Scheduled for surgery
  if (status.includes("scheduled")) {
    const procedureName =
      group === "spine" ? "spinal surgery" :
      group === "shoulder" ? "shoulder surgery" :
      group === "hip" ? "hip replacement" :
      group === "ankle" ? "ankle surgery" :
      "knee replacement";
    return {
      statement: `${procedureName.charAt(0).toUpperCase() + procedureName.slice(1)} is a major commitment — and not every patient achieves full relief afterward.`,
      credential: "Some orthopedic surgeons and neurosurgeons now evaluate ARC options that are minimally invasive and typically outpatient, before moving forward with surgery.",
    };
  }

  // Waiting / pausing before surgery
  if (status.includes("waiting")) {
    return {
      statement: `Pausing before surgery is common — recovery can extend well beyond the first few weeks, and outcomes vary more than most patients expect.`,
      credential: "Some orthopedic surgeons and neurosurgeons now offer ARC evaluations focused on pain relief and improved mobility using minimally invasive, typically outpatient approaches.",
    };
  }

  // No procedure recommended yet
  const isEarly = duration?.toLowerCase().includes("less than 6");
  return {
    statement: isEarly
      ? `If surgery hasn't been recommended yet, you're in the ideal ARC moment — get clarity before committing to anything irreversible.`
      : `Exploring options before surgery is the right move — catching it early can open doors that aren't available later.`,
    credential: "Some orthopedic surgeons and neurosurgeons now evaluate ARC approaches that are minimally invasive and typically outpatient, designed to help preserve future options.",
  };
}

export function HomeExperience() {
  const [heroCTAOpen, setHeroCTAOpen] = useState(false);
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
  const [activeProviderId, setActiveProviderId] = useState("");
  const [activeBottomProviderId, setActiveBottomProviderId] = useState("");
  const [zipExpanded, setZipExpanded] = useState(false);

  const isCollapsed = results.length > 0 && !zipExpanded;

  // Refs for GSAP-driven zip transition
  const reviewFormRef = useRef<HTMLDivElement>(null);
  const zipResultsAreaRef = useRef<HTMLDivElement>(null);
  const zipTlRef = useRef<gsap.core.Timeline | null>(null);
  const prevIsCollapsedRef = useRef(false);

  useEffect(() => {
    if (isCollapsed === prevIsCollapsedRef.current) return;
    prevIsCollapsedRef.current = isCollapsed;

    const formEl = reviewFormRef.current;
    const resultsEl = zipResultsAreaRef.current;
    if (!formEl || !resultsEl) return;

    zipTlRef.current?.kill();

    if (isCollapsed) {
      // Fade form out + collapse height, then ease results up
      zipTlRef.current = gsap.timeline()
        .to(formEl, { opacity: 0, height: 0, overflow: "hidden", duration: 0.42, ease: "power2.inOut" })
        .fromTo(resultsEl, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.52, ease: "power2.out" }, "-=0.05");
    } else {
      // Change ZIP: fade results out, restore form
      zipTlRef.current = gsap.timeline()
        .to(resultsEl, { opacity: 0, duration: 0.25, ease: "power2.in" })
        .call(() => { gsap.set(formEl, { clearProps: "height,overflow" }); })
        .to(formEl, { opacity: 1, duration: 0.38, ease: "power2.out" }, "+=0.05");
    }

    return () => { zipTlRef.current?.kill(); };
  }, [isCollapsed]);

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
          ".hero-cta",
          { autoAlpha: 0, y: 10 },
          { autoAlpha: 1, y: 0, duration: 0.9 },
          "-=0.2"
        )
        .fromTo(
          ".hero-scroll-hint",
          { autoAlpha: 0 },
          { autoAlpha: 1, duration: 1 },
          "+=0.4"
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

      const productCopyMedia = gsap.matchMedia();
      productCopyMedia.add(
        { isMobile: "(max-width: 767px)", isDesktop: "(min-width: 768px)" },
        (context) => {
          const conditions = context.conditions as { isMobile: boolean; isDesktop: boolean };
          const from = conditions.isMobile
            ? { autoAlpha: 0, y: 16 }
            : { autoAlpha: 0, x: 86 };
          const to = conditions.isMobile
            ? { autoAlpha: 1, y: 0, duration: 1.95, ease: "power3.out" }
            : { autoAlpha: 1, x: 0, duration: 1.95, ease: "power3.out" };
          gsap.fromTo(".product-copy", from, {
            ...to,
            scrollTrigger: {
              trigger: ".product-headline",
              start: "bottom 92%",
              toggleActions: "play none none reverse",
            },
          });
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

      return () => {
        productCopyMedia.revert();
        handoffMedia.revert();
      };
    },
    { scope: container }
  );

  const nearestLabel = useMemo(() => (results.length > 0 ? `${results.length} providers` : ""), [results]);
  const providerNearestLabel = useMemo(
    () => (providerResults.length > 0 ? `${providerResults.length} providers` : ""),
    [providerResults]
  );

  const resetAssessment = () => {
    zipTlRef.current?.kill();
    setStep("knee");
    setPainRegion("");
    setDuration("");
    setReplacementStatus("");
    setZip("");
    setZipExpanded(false);
    setError("");
    setResults([]);
    setActiveProviderId("");
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

      const incoming = data.results || [];
      setResults(incoming);
      if (incoming.length > 0) {
        setActiveProviderId(incoming[0].id);
        setZipExpanded(false);
      }
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
      const incoming = data.results || [];
      setProviderResults(incoming);
      if (incoming.length > 0) setActiveBottomProviderId(incoming[0].id);
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

  const handlePainSelection = (region: JointRegion) => {
    setPainRegion(region);
    setStep("duration");
  };

  useEffect(() => {
    if (step === "knee" || !assessmentPanelRef.current) {
      return;
    }
    // Only fade in when first entering assessment (knee → duration). Do NOT re-animate on duration→status or status→zip — that causes a white flash.
    if (step !== "duration") {
      gsap.set(assessmentPanelRef.current, { autoAlpha: 1 });
      return;
    }
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const duration = prefersReducedMotion ? 0 : 0.22;
    gsap.fromTo(
      assessmentPanelRef.current,
      { autoAlpha: 0 },
      { autoAlpha: 1, duration, ease: "power1.out" }
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

      <section className="sticky top-0 z-0 flex h-screen flex-col items-center justify-center px-6 text-center">
        <p className="hero-arc text-[clamp(56px,12vw,150px)] font-light tracking-tight">
          ARC
        </p>
        <p className="hero-subtitle mt-3 text-[13px] uppercase tracking-[0.32em] text-black/55 md:text-[14px]">
          Alternative Replacement Care
        </p>
        <button
          type="button"
          onClick={() => setHeroCTAOpen(true)}
          className="hero-cta mt-10 group inline-flex items-center gap-2 rounded-full border border-black/8 bg-white/90 px-5 py-2.5 text-[14px] font-medium tracking-tight text-black shadow-[0_4px_14px_rgba(0,0,0,0.07),0_1px_0_rgba(255,255,255,0.8)_inset] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(0,0,0,0.12),0_1px_0_rgba(255,255,255,0.95)_inset]"
        >
          <svg aria-hidden="true" viewBox="0 0 24 24" className="h-[14px] w-[14px]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
            <circle cx="12" cy="9" r="2.5" />
          </svg>
          Find a location near you
        </button>
        <p className="hero-scroll-hint absolute bottom-14 left-1/2 -translate-x-1/2 text-[11px] uppercase tracking-[0.18em] text-black/25">
          Scroll to explore
        </p>
      </section>
      <FindProviderOverlay open={heroCTAOpen} onClose={() => setHeroCTAOpen(false)} />

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
            className="product-visual order-2 flex aspect-square items-center justify-center rounded-3xl bg-[#f4f4f4] text-xs uppercase tracking-[0.28em] text-black/20 md:order-1"
          >
            Rotating knee placeholder
          </div>
          <div className="product-copy order-1 md:order-2">
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

      <AssessmentErrorBoundary>
      <div ref={kneeSectionRef} className="relative z-30 min-h-screen bg-black">
        <BodySelector
          selectedRegion={painRegion}
          onSelect={handlePainSelection}
          visible={step === "knee"}
        />
        {step !== "knee" && (
          <div
            ref={assessmentPanelRef}
            className="assessment-panel pointer-events-auto fixed inset-0 z-[35] overflow-y-auto bg-[#111111] text-white"
          >
            {/* ── Step 2: initial entry with cinematic headline + card ── */}
            {step === "duration" && (
              <div className="flex min-h-full flex-col items-center justify-center px-6 py-16">
                <div className="w-full max-w-lg">
                  {/* Headline acknowledgement */}
                  <p
                    className="mb-10 text-center text-[clamp(26px,7vw,48px)] font-light leading-tight tracking-tight text-white"
                    style={{ opacity: 0, animation: "fadeUp 0.55s ease-out 0.2s forwards" }}
                    aria-live="polite"
                  >
                    Let&apos;s look at your {painRegion ? JOINT_DISPLAY_NAME[painRegion] : "pain"}.
                  </p>

                  {/* Step indicator */}
                  <div
                    className="mb-4"
                    style={{ opacity: 0, animation: "fadeUp 0.4s ease-out 0.82s forwards" }}
                  >
                    <p className="text-center text-[11px] uppercase tracking-[0.18em] text-white/50">
                      Step 2 of 4
                    </p>
                    <div className="mx-auto mt-2 h-px w-28 bg-white/12">
                      <div className="h-full w-1/3 bg-white/45" />
                    </div>
                  </div>

                  {/* Card */}
                  <div
                    className="rounded-2xl border border-white/[0.14] bg-white/[0.06] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.07)] md:p-7"
                    style={{ opacity: 0, animation: "slideUpSpring 0.6s ease-out 0.88s forwards" }}
                    role="region"
                    aria-label="Step 2 of 4"
                  >
                    <p className="mb-5 text-[22px] font-light tracking-tight text-white">
                      How long has it been present?
                    </p>
                    <div className="space-y-2.5">
                      {["Less than 6 months", "6 to 24 months", "More than 2 years"].map((value) => (
                        <button
                          key={value}
                          type="button"
                          onClick={() => { setDuration(value); setStep("status"); }}
                          className="group flex w-full items-center justify-between rounded-xl border border-white/[0.13] bg-white/[0.05] px-5 py-4 text-left text-white/85 transition-all duration-200 hover:border-white/22 hover:bg-white/[0.10] hover:text-white active:scale-[0.98]"
                        >
                          <span className="text-[17px] font-light">{value}</span>
                          <span className="text-white/35 transition-colors group-hover:text-white/65" aria-hidden="true">›</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── Step 3 ── */}
            {step === "status" && (
              <div className="flex min-h-full flex-col items-center justify-center px-6 py-12">
                <div className="w-full max-w-lg">
                  <div className="mb-4">
                    <p className="text-center text-[11px] uppercase tracking-[0.18em] text-white/50">
                      Step 3 of 4
                    </p>
                    <div className="mx-auto mt-2 h-px w-28 bg-white/12">
                      <div className="h-full w-2/3 bg-white/45 transition-all duration-500" />
                    </div>
                  </div>
                  <div
                    className="rounded-2xl border border-white/[0.14] bg-white/[0.06] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.07)] md:p-7"
                    role="region"
                    aria-label="Step 3 of 4"
                  >
                    <button
                      type="button"
                      onClick={() => setStep("duration")}
                      className="mb-5 flex items-center gap-1.5 text-[11px] uppercase tracking-[0.15em] text-white/50 transition-colors hover:text-white/75"
                    >
                      <span aria-hidden="true">←</span> Back
                    </button>
                    <p className="mb-5 text-[22px] font-light tracking-tight text-white">
                      Has a doctor recommended surgery for your {painRegion ? JOINT_DISPLAY_NAME[painRegion] : "pain"}?
                    </p>
                    <div className="space-y-2.5">
                      {[
                        "Yes, it is scheduled",
                        "Yes, but I am waiting",
                        "Not yet",
                        "Had surgery — still in pain",
                      ].map((value) => (
                        <button
                          key={value}
                          type="button"
                          onClick={() => { setReplacementStatus(value); setStep("zip"); }}
                          className="group flex w-full items-center justify-between rounded-xl border border-white/[0.13] bg-white/[0.05] px-5 py-4 text-left text-white/85 transition-all duration-200 hover:border-white/22 hover:bg-white/[0.10] hover:text-white active:scale-[0.98]"
                        >
                          <span className="text-[17px] font-light">{value}</span>
                          <span className="text-white/35 transition-colors group-hover:text-white/65" aria-hidden="true">›</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── Step 4: zip / analyzing / review ── */}
            {step === "zip" && (
              <div className="flex min-h-full flex-col items-center justify-center px-6 py-12">
                <div className="w-full max-w-lg">

            {analyzing && (
                <div className="flex flex-col items-center justify-center gap-5 py-16">
                  <p className="animate-pulse text-[12px] uppercase tracking-[0.22em] text-white/60">
                    Analyzing your inputs…
                  </p>
                  <div className="flex gap-2">
                    {[0, 1, 2].map((i) => (
                      <span
                        key={i}
                        className="h-1.5 w-1.5 rounded-full bg-white/40 animate-pulse"
                        style={{ animationDelay: `${i * 0.25}s` }}
                      />
                    ))}
                  </div>
                </div>
              )}

            {!analyzing && reviewVisible && (() => {
                const { statement, credential } = getPersonalizedReview(painRegion, replacementStatus, duration);
                return (
                  <div className="w-full">
                    {/* Back */}
                    <button
                      type="button"
                      onClick={() => setStep("status")}
                      style={{ opacity: 0, animation: "fadeIn 0.4s ease-out 0.1s forwards" }}
                      className="mb-8 flex items-center gap-1.5 text-[11px] uppercase tracking-[0.15em] text-white/50 hover:opacity-80"
                    >
                      <span aria-hidden="true">←</span> Back
                    </button>

                    {/* Label */}
                    <p
                      style={{ opacity: 0, animation: "fadeIn 0.5s ease-out 0.2s forwards" }}
                      className="mb-3 text-[11px] uppercase tracking-[0.26em] text-white/50"
                    >
                      Your {painRegion ? JOINT_DISPLAY_NAME[painRegion].charAt(0).toUpperCase() + JOINT_DISPLAY_NAME[painRegion].slice(1) : "Pain"} Review
                    </p>

                    {/* Review + ZIP form — GSAP collapses this on submit */}
                    <div ref={reviewFormRef}>
                      <p
                        style={{ opacity: 0, animation: "fadeIn 0.9s ease-out 0.35s forwards" }}
                        className="text-[22px] font-light leading-[1.48] tracking-tight text-white md:text-[24px]"
                      >
                        {statement}
                      </p>
                      <p
                        style={{ opacity: 0, animation: "fadeIn 0.8s ease-out 0.85s forwards" }}
                        className="mt-5 text-[16px] font-light leading-relaxed text-white/65 md:text-[17px]"
                      >
                        {credential}
                      </p>
                      <div
                        style={{ opacity: 1, animation: "drawLine 0.9s ease-out 2.0s both" }}
                        className="my-10 h-px w-full origin-left bg-white/[0.1]"
                      />

                      <div style={{ opacity: 0, animation: "fadeIn 0.7s ease-out 3.2s forwards" }}>
                        <p className="mb-2 text-[22px] font-medium leading-tight tracking-tight text-white md:text-[24px]">
                          Enter your ZIP to find a provider near you.
                        </p>
                        <form onSubmit={runSearch}>
                          <div className="relative overflow-hidden rounded-2xl p-px">
                            <div
                              className="absolute inset-[-100%]"
                              style={{
                                background: "conic-gradient(from 0deg, transparent 0deg, transparent 120deg, rgba(138,210,255,0.55) 180deg, rgba(255,255,255,0.3) 200deg, rgba(138,210,255,0.55) 220deg, transparent 280deg, transparent 360deg)",
                                animation: results.length > 0 || loading ? "none" : "borderSpin 3.5s linear infinite",
                                opacity: results.length > 0 ? 0 : 1,
                                transition: "opacity 0.4s ease-out",
                              }}
                            />
                            <div className="relative rounded-[15px] px-5 py-5" style={{ backgroundColor: "#1a1a1a" }}>
                              <label htmlFor="zip-input" className="mb-2 block text-[13px] font-light text-white/70">
                                Enter your ZIP code
                              </label>
                              <div className="flex items-center gap-3">
                                <input
                                  id="zip-input"
                                  type="text"
                                  inputMode="numeric"
                                  pattern="\d{5}"
                                  maxLength={5}
                                  value={zip}
                                  onChange={(event) => setZip(event.target.value.replace(/\D/g, ""))}
                                  placeholder="e.g. 90210"
                                  className="min-w-0 flex-1 bg-transparent text-[22px] font-light tracking-wide text-white outline-none placeholder:text-white/25 md:text-[24px]"
                                />
                                <span className="shrink-0 text-[12px] tabular-nums text-white/50">{zip.length}/5</span>
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
                            className="mt-4 w-full rounded-full py-4 text-[15px] font-medium tracking-tight transition-all duration-300 enabled:active:scale-[0.98]"
                            style={{
                              backgroundColor: zip.length === 5 ? "rgb(255,255,255)" : "rgba(255,255,255,0.08)",
                              color: zip.length === 5 ? "rgb(0,0,0)" : "rgba(255,255,255,0.3)",
                              boxShadow: zip.length === 5 ? "0 0 50px rgba(138,210,255,0.18), 0 0 20px rgba(255,255,255,0.1)" : "none",
                              animation: zip.length === 5 ? "subtlePulse 0.4s ease-out" : "none",
                            }}
                          >
                            {loading ? (
                              <span className="inline-flex items-center justify-center gap-2">
                                <span className="h-3.5 w-3.5 animate-spin rounded-full border border-black/30 border-t-black" />
                                Searching…
                              </span>
                            ) : "Show Locations Near Me"}
                          </button>
                        </form>
                        {results.length === 0 && !loading && (
                          <p className="mt-4 text-center text-[12px] font-light text-white/45">
                            Used by patients across the country to find ARC-trained providers.
                          </p>
                        )}
                        {error && <p className="mt-4 text-center text-sm text-red-400/70">{error}</p>}
                      </div>
                    </div>

                    {/* Summary bar + results — always in DOM, GSAP fades in after form collapses */}
                    <div ref={zipResultsAreaRef} style={{ opacity: 0 }}>
                      {/* Summary bar */}
                      <div
                        className="flex items-center justify-between rounded-2xl px-4 py-3"
                        style={{ backgroundColor: "#1a1a1a" }}
                      >
                        <div>
                          <p className="text-[11px] uppercase tracking-[0.16em] text-white/35">Near {zip}</p>
                          <p className="mt-0.5 text-[14px] font-light text-white/70">
                            {results.length} provider{results.length !== 1 ? "s" : ""} found
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setZipExpanded(true)}
                          className="rounded-full px-3.5 py-1.5 text-[12px] font-medium tracking-tight text-white/60 transition-colors hover:text-white/90"
                          style={{ backgroundColor: "rgba(255,255,255,0.08)" }}
                        >
                          Change ZIP
                        </button>
                      </div>

                      {/* Provider results */}
                      {results.length > 0 && (
                      <div className="mt-6">
                        <div className="mb-3 flex items-center justify-between">
                          <p className="text-[10px] uppercase tracking-[0.22em] text-white/55">Near {zip}</p>
                          <p className="text-[10px] text-white/40">{nearestLabel}</p>
                        </div>

                        <ul className="space-y-2">
                          {results.map((provider, index) => (
                            <li key={provider.id}>
                              <ProviderCard
                                provider={provider}
                                isActive={provider.id === activeProviderId}
                                isClosest={index === 0}
                                variant="dark"
                                onSelect={setActiveProviderId}
                              />
                            </li>
                          ))}
                        </ul>

                        <Link
                          href="/providers"
                          className="mt-4 inline-block text-[11px] uppercase tracking-[0.15em] text-white/50 transition-colors hover:text-white/80"
                        >
                          See all providers →
                        </Link>
                      </div>
                      )}
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        )}
      </div>
        )}
      </div>
      </AssessmentErrorBoundary>

      <section className="relative z-20 flex min-h-[75vh] flex-col items-center justify-center bg-[#f7f7f7] px-6">
        <div data-reveal className="mx-auto w-full max-w-4xl text-center">
          <h3 className="text-[clamp(44px,6vw,72px)] font-semibold leading-tight text-black">
            Let&apos;s understand
            <br />
            your knee pain.
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
                const targetScroll = triggerTop + 0.1 * window.innerHeight;
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
            <div className="mt-6 w-full text-left animate-[fadeIn_0.5s_ease-out_forwards]">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-[10px] uppercase tracking-[0.22em] text-black/45">Near {providerZip}</p>
                <p className="text-[10px] text-black/35">{providerNearestLabel}</p>
              </div>

              <ul className="space-y-2">
                {providerResults.map((provider, index) => (
                  <li key={provider.id}>
                    <ProviderCard
                      provider={provider}
                      isActive={provider.id === activeBottomProviderId}
                      isClosest={index === 0}
                      variant="light"
                      onSelect={setActiveBottomProviderId}
                    />
                  </li>
                ))}
              </ul>

              <Link
                href="/providers"
                className="mt-4 inline-block text-[11px] uppercase tracking-[0.15em] text-black/40 transition-colors hover:text-black/70"
              >
                See all providers →
              </Link>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
