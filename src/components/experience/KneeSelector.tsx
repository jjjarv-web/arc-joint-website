"use client";

import { useEffect, useRef, useState, type PointerEvent } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export type KneePainRegion = "anterior" | "medial" | "lateral";

interface KneeSelectorProps {
  selectedRegion: KneePainRegion | "";
  onSelect: (region: KneePainRegion) => void;
  visible?: boolean;
}

const TRUST_HEADLINE = "Performed by Orthopedic and Neurosurgeons in select medical centers";
const TRUST_SPECS = ["Minimally Invasive.", "Reversible.", "Covered by Insurance."];
const regionLabel: Record<KneePainRegion, string> = {
  anterior: "Front (anterior)",
  medial: "Inner (medial)",
  lateral: "Outer (lateral)",
};
const PNG_ASPECT_RATIO = 2000 / 4000;
const LEFT_KNEE_X = 0.445;
const RIGHT_KNEE_X = 0.575;
const KNEE_Y = 0.675;
const SOFT_GATE_MS = 2400;
type KneeSide = "left" | "right";

export function KneeSelector({ selectedRegion, onSelect, visible = true }: KneeSelectorProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const interactionFieldRef = useRef<HTMLDivElement>(null);
  const pulseTimeoutRef = useRef<number | null>(null);
  const gateTimeoutRef = useRef<number | null>(null);
  const clickLockRef = useRef(false);
  const interactiveRef = useRef(false);
  const gateTriggeredRef = useRef(false);
  const [interactive, setInteractive] = useState(false);
  const [softGateActive, setSoftGateActive] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [debugHotspots] = useState(() =>
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search).get("debugHotspots") === "1"
      : false
  );
  const [hoverRegion, setHoverRegion] = useState<KneePainRegion | "">("");
  const [hoverSide, setHoverSide] = useState<KneeSide | "">("");
  const [cursorPoint, setCursorPoint] = useState<{ x: number; y: number }>({ x: 50, y: 68 });
  const [pressedRegion, setPressedRegion] = useState<KneePainRegion | "">("");

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncPreference = () => setReducedMotion(query.matches);
    syncPreference();
    query.addEventListener("change", syncPreference);
    return () => query.removeEventListener("change", syncPreference);
  }, []);

  useEffect(() => {
    // Preload key visual assets for smoother first reveal.
    const body = new window.Image();
    body.src = "/images/knee-assessment.png";
    const grain = new window.Image();
    grain.src = "/images/grain-overlay.png";
  }, []);

  useGSAP(
    () => {
      const isMobile = window.matchMedia("(max-width: 767px)").matches;
      const blurStart = isMobile ? 4 : 6;
      const stageElement = sectionRef.current?.querySelector(".knee-stage");

      setHoverRegion("");
      setHoverSide("");
      setPressedRegion("");
      clickLockRef.current = false;
      interactiveRef.current = reducedMotion;
      gateTriggeredRef.current = false;
      setInteractive(reducedMotion);
      setSoftGateActive(false);

      if (reducedMotion) {
        gsap.set(".knee-light-field", { autoAlpha: 0.86 });
        gsap.set(".knee-trust-copy", { autoAlpha: 0 });
        gsap.set(".knee-step-label", { autoAlpha: 1, y: 0 });
        gsap.set(".knee-headline", { autoAlpha: 1, y: 0, scale: 1, color: "rgba(255,255,255,1)" });
        gsap.set(".knee-image-shell", { autoAlpha: 0.95, scale: 1.05, filter: "blur(0px)" });
        gsap.set(".knee-knee-glow", { autoAlpha: 1, scale: 1 });
        gsap.set(".knee-zone-hint", { autoAlpha: 0.72 });
        gsap.set(".knee-zone-hint-core", { scale: 1 });
        gsap.set(".knee-interaction-field", { autoAlpha: 0.9 });
        gsap.set(".knee-light-sweep", { autoAlpha: 0.04, xPercent: -20 });
        return;
      }

      gsap.set(".knee-light-field", { autoAlpha: 0.54 });
      gsap.set(".knee-trust-headline", {
        autoAlpha: 0.34,
        y: 54,
        scale: 1.52,
        filter: "blur(5px)",
        color: "rgba(154,162,176,0.36)",
      });
      gsap.set(".knee-spec", { autoAlpha: 0, y: 16 });
      gsap.set(".knee-trust-copy", { autoAlpha: 1 });
      gsap.set(".knee-step-label", { autoAlpha: 0, y: 8 });
      gsap.set(".knee-headline", { autoAlpha: 0, y: 22, scale: 0.98 });
      gsap.set(".knee-image-shell", {
        autoAlpha: 0.08,
        y: 10,
        scale: 1,
        rotateY: -5,
        rotateX: 0,
        filter: `blur(${blurStart}px)`,
        transformPerspective: 1200,
        transformOrigin: "50% 46%",
      });
      gsap.set(".knee-figure", { scale: 0.86, yPercent: 0, transformOrigin: "50% 62%" });
      gsap.set(".knee-knee-glow", { autoAlpha: 0.12, scale: 0.9, transformOrigin: "50% 68%" });
      gsap.set(".knee-zone-hint", { autoAlpha: 0.18 });
      gsap.set(".knee-zone-hint-core", { scale: 0.92 });
      gsap.set(".knee-interaction-field", { autoAlpha: 0.2 });
      gsap.set(".knee-light-sweep", { xPercent: -130, autoAlpha: 0.045 });

      const stageTimeline = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=360%",
          scrub: 0.85,
          pin: stageElement,
          anticipatePin: 1,
          onUpdate: (self) => {
            const shouldEnterInteractive = !interactiveRef.current && self.progress >= 0.88;
            const shouldExitInteractive = interactiveRef.current && self.progress <= 0.78;
            if (shouldEnterInteractive || shouldExitInteractive) {
              const nextInteractive = shouldEnterInteractive;
              interactiveRef.current = nextInteractive;
              clickLockRef.current = false;
              setInteractive(nextInteractive);
              if (!nextInteractive) {
                gateTriggeredRef.current = false;
                setSoftGateActive(false);
                setHoverRegion("");
                setHoverSide("");
                if (gateTimeoutRef.current) {
                  window.clearTimeout(gateTimeoutRef.current);
                  gateTimeoutRef.current = null;
                }
              } else if (!gateTriggeredRef.current) {
                gateTriggeredRef.current = true;
                setSoftGateActive(true);
                if (gateTimeoutRef.current) {
                  window.clearTimeout(gateTimeoutRef.current);
                }
                gateTimeoutRef.current = window.setTimeout(() => {
                  setSoftGateActive(false);
                  gateTimeoutRef.current = null;
                }, SOFT_GATE_MS);
              }
            }
          },
        },
      });

      // Entry reveal: by full viewport lock, trust headline has finished zooming to center.
      gsap.to(".knee-trust-headline", {
        autoAlpha: 1,
        y: 0,
        scale: 1,
        filter: "blur(0px)",
        color: "rgba(255,255,255,0.95)",
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 90%",
          end: "top top",
          scrub: 1.1,
        },
      });

      // 0.00-0.15 calibration, 0.15-0.40 trust lock.
      stageTimeline
        .set(
          ".knee-trust-headline",
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            filter: "blur(0px)",
            color: "rgba(255,255,255,0.95)",
          },
          0
        )
        .to(".knee-light-field", { autoAlpha: 0.82, duration: 0.15 }, 0)
        // Smooth trust headline handoff into specs.
        .to(".knee-trust-headline", { autoAlpha: 0, y: -10, scale: 0.95, duration: 0.22 }, 0.12)
        .to(".knee-spec", { autoAlpha: 0.94, y: 0, duration: 0.24, stagger: 0.06 }, 0.18)
        // Clear specs fully before interaction headline enters.
        .to(".knee-spec", { autoAlpha: 0, y: -10, duration: 0.16, stagger: 0.03 }, 0.4)
        .to(".knee-trust-copy", { autoAlpha: 0, duration: 0.12 }, 0.48)
        .set(".knee-trust-copy, .knee-spec", { autoAlpha: 0 }, 0.54)
        .to(".knee-image-shell", { autoAlpha: 0.95, y: 0, scale: 1.05, rotateY: 0, filter: "blur(0px)", duration: 0.34 }, 0.5)
        .to(".knee-figure", { scale: 0.98, yPercent: 0, duration: 0.34 }, 0.5)
        .to(".knee-knee-glow", { autoAlpha: 1, scale: 1, duration: 0.28 }, 0.54)
        // Click-ready headline and zones settle in and hold (one unit, no premature step label).
        .to(".knee-step-label", { autoAlpha: 0.82, y: 0, duration: 0.2 }, 0.68)
        .to(".knee-headline", { autoAlpha: 1, y: 0, scale: 1, color: "rgba(255,255,255,1)", duration: 0.22 }, 0.68)
        .to(".knee-zone-hint", { autoAlpha: 0.84, duration: 0.2, stagger: 0.03 }, 0.7)
        .to(".knee-zone-hint-core", { scale: 1, duration: 0.2, stagger: 0.03 }, 0.7)
        .to(".knee-interaction-field", { autoAlpha: 0.94, duration: 0.2 }, 0.7);

      gsap.to(".knee-light-sweep", {
        xPercent: 130,
        duration: 2.1,
        ease: "power1.inOut",
        repeat: -1,
        repeatDelay: 6.8,
      });
    },
    { scope: sectionRef, dependencies: [reducedMotion] }
  );

  useEffect(() => {
    if (!interactionFieldRef.current || reducedMotion) {
      return;
    }

    if (!interactive) {
      clickLockRef.current = false;
    }

    gsap.to(".knee-interaction-field", {
      autoAlpha: interactive ? 0.9 : 0.25,
      duration: 0.25,
      ease: "power2.out",
    });
    gsap.to(".knee-zone-hint", {
      autoAlpha: interactive ? 0.72 : 0.26,
      duration: 0.25,
      ease: "power2.out",
    });
  }, [interactive, reducedMotion]);

  useEffect(() => {
    if (reducedMotion || !interactive) {
      return;
    }

    gsap.to(".knee-zone-hint", {
      autoAlpha: softGateActive ? 0.94 : 0.76,
      duration: 0.28,
      ease: "power2.out",
      overwrite: "auto",
    });
    if (softGateActive) {
      gsap.fromTo(
        ".knee-zone-hint-core",
        { scale: 1, boxShadow: "0 0 0 1px rgba(138,210,255,0.25),0 0 26px rgba(138,210,255,0.2)" },
        {
          scale: 1.18,
          boxShadow: "0 0 0 1px rgba(138,210,255,0.58),0 0 52px rgba(138,210,255,0.42)",
          duration: 0.4,
          yoyo: true,
          repeat: 2,
          stagger: 0.08,
          ease: "power2.inOut",
        }
      );
    }
  }, [softGateActive, reducedMotion, interactive]);

  useEffect(() => {
    if (!interactive || reducedMotion) {
      return;
    }

    const leftPulse = gsap.to(".knee-zone-hint-core--left", {
      scale: 1.08,
      duration: 0.9,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
    });
    const rightPulse = gsap.to(".knee-zone-hint-core--right", {
      scale: 1.08,
      duration: 0.9,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
      delay: 0.14,
    });

    return () => {
      leftPulse.kill();
      rightPulse.kill();
    };
  }, [interactive, reducedMotion]);

  useEffect(
    () => () => {
      if (pulseTimeoutRef.current) {
        window.clearTimeout(pulseTimeoutRef.current);
      }
      if (gateTimeoutRef.current) {
        window.clearTimeout(gateTimeoutRef.current);
      }
    },
    []
  );

  useEffect(() => {
    if (!sectionRef.current || visible) {
      return;
    }
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const duration = prefersReducedMotion ? 0 : 0.35;
    gsap.to(
      [".knee-image-shell", ".knee-headline", ".knee-step-label", ".knee-zone-hint", ".knee-interaction-field", ".knee-trust-copy"],
      { autoAlpha: 0, duration, ease: "power2.out", overwrite: "auto" }
    );
  }, [visible]);

  const handleSelect = (region: KneePainRegion) => {
    if (!interactiveRef.current || clickLockRef.current) {
      return;
    }

    clickLockRef.current = true;
    setSoftGateActive(false);
    if (gateTimeoutRef.current) {
      window.clearTimeout(gateTimeoutRef.current);
      gateTimeoutRef.current = null;
    }
    if (pulseTimeoutRef.current) {
      window.clearTimeout(pulseTimeoutRef.current);
    }
    setPressedRegion(region);
    pulseTimeoutRef.current = window.setTimeout(() => {
      onSelect(region);
      setPressedRegion("");
    }, 180);
  };

  const inferRegion = (xNorm: number, yNorm: number): KneePainRegion | null => {
    const dxLeft = Math.abs(xNorm - LEFT_KNEE_X);
    const dxRight = Math.abs(xNorm - RIGHT_KNEE_X);
    const centerX = dxLeft < dxRight ? LEFT_KNEE_X : RIGHT_KNEE_X;
    const isLeftKnee = centerX < 0.5;
    const localX = xNorm - centerX;
    const localY = yNorm - KNEE_Y;

    if (Math.abs(localY) > 0.165 || Math.abs(localX) > 0.145) {
      return null;
    }
    if (localY > 0.01 && Math.abs(localX) < 0.045) {
      return "anterior";
    }

    const towardCenter = isLeftKnee ? localX > 0 : localX < 0;
    return towardCenter ? "medial" : "lateral";
  };

  const resolveRegionFromEvent = (
    event: PointerEvent<HTMLDivElement>
  ): { region: KneePainRegion; side: KneeSide; x: number; y: number } | null => {
    const bounds = interactionFieldRef.current?.getBoundingClientRect();
    if (!bounds) {
      return null;
    }

    const imageWidth = Math.min(bounds.width, bounds.height * PNG_ASPECT_RATIO);
    const imageHeight = imageWidth / PNG_ASPECT_RATIO;
    const imageLeft = (bounds.width - imageWidth) / 2;
    const imageTop = (bounds.height - imageHeight) / 2;
    const xInImage = event.clientX - bounds.left - imageLeft;
    const yInImage = event.clientY - bounds.top - imageTop;
    if (xInImage < 0 || yInImage < 0 || xInImage > imageWidth || yInImage > imageHeight) {
      return null;
    }

    const xNorm = xInImage / imageWidth;
    const yNorm = yInImage / imageHeight;
    const side: KneeSide =
      Math.abs(xNorm - LEFT_KNEE_X) <= Math.abs(xNorm - RIGHT_KNEE_X) ? "left" : "right";
    const region = inferRegion(xNorm, yNorm);
    if (!region) {
      return null;
    }

    return {
      region,
      side,
      x: ((imageLeft + xInImage) / bounds.width) * 100,
      y: ((imageTop + yInImage) / bounds.height) * 100,
    };
  };

  return (
    <section ref={sectionRef} className="relative min-h-[460vh] bg-black text-white">
      <div className="knee-stage relative h-screen overflow-hidden px-6 py-[9vh] md:px-10">
        <div className="knee-light-field pointer-events-none absolute inset-0 z-[1] will-change-[opacity]">
          <div className="absolute left-1/2 top-[58%] h-[340px] w-[460px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,_rgba(156,196,232,0.12)_0%,_rgba(72,112,150,0.08)_34%,_rgba(0,0,0,0)_72%)] md:h-[420px] md:w-[560px]" />
          <div className="absolute right-[12%] top-[32%] h-[300px] w-[300px] rounded-full bg-[radial-gradient(circle,_rgba(188,208,226,0.07)_0%,_rgba(0,0,0,0)_72%)] blur-xl" />
        </div>
        <div className="pointer-events-none absolute inset-0 z-[2] bg-[url('/images/grain-overlay.png')] bg-repeat opacity-[0.05]" />
        <div className="pointer-events-none absolute inset-0 z-[4] overflow-hidden">
          <div className="knee-light-sweep absolute -left-1/3 top-0 h-full w-1/3 bg-gradient-to-r from-transparent via-white/[0.04] to-transparent will-change-[transform,opacity]" />
        </div>

        <div className="relative z-[5] flex h-full flex-col items-center justify-between">
          <div className="knee-trust-copy pointer-events-none absolute left-1/2 top-[26%] w-full max-w-5xl -translate-x-1/2 px-4 text-center">
            <p className="knee-trust-headline relative text-balance text-[clamp(34px,5.2vw,72px)] font-semibold leading-[1.05] tracking-[-0.02em] text-white/94 [text-shadow:0_0_34px_rgba(145,180,220,0.1)]">
              Performed by{" "}
              <span className="font-semibold text-white">Orthopedic</span>
              {" "}and{" "}
              <span className="font-semibold text-white">Neurosurgeons</span>
              {" "}in select medical centers
            </p>
            <p className="sr-only">
              {TRUST_HEADLINE}
            </p>
            <div className="mt-7 space-y-2">
              {TRUST_SPECS.map((spec) => (
                <p key={spec} className="knee-spec text-[clamp(16px,1.7vw,24px)] font-light tracking-[-0.01em] text-white/80">
                  {spec}
                </p>
              ))}
            </div>
          </div>
          <div className="relative mx-auto max-w-6xl text-center">
            <p className="knee-step-label mb-3 text-[11px] uppercase tracking-[0.18em] text-white/70">Step 1 of 4</p>
            <h3
              className="knee-headline text-balance text-[clamp(44px,6.8vw,78px)] font-light leading-[1.04] tracking-[-0.02em]"
              style={{ opacity: 0 }}
            >
              Tap{" "}
              <span className="font-semibold text-white">Knee</span>
              {" "}where it hurts to begin.
            </h3>
          </div>

          <div className="relative z-[3] mx-auto w-full max-w-[560px]">
            <div className="relative mx-auto h-[58vh] w-full overflow-hidden md:h-[66vh]">
              <div
                className={`knee-image-shell relative h-full w-full transition-transform duration-300 will-change-[transform,opacity,filter] ${
                  pressedRegion || selectedRegion ? "scale-[1.02]" : "scale-100"
                }`}
              >
                <div className="knee-figure relative h-full w-full">
                  <div
                    className="knee-knee-glow pointer-events-none absolute inset-0 z-[1] will-change-[transform,opacity]"
                    style={{
                      background: `radial-gradient(circle at ${LEFT_KNEE_X * 100}% ${KNEE_Y * 100}%, rgba(106,192,255,0.22) 0%, rgba(106,192,255,0.07) 14%, rgba(0,0,0,0) 30%), radial-gradient(circle at ${RIGHT_KNEE_X * 100}% ${KNEE_Y * 100}%, rgba(106,192,255,0.22) 0%, rgba(106,192,255,0.07) 14%, rgba(0,0,0,0) 30%)`,
                    }}
                  />
                  <Image
                    src="/images/knee-assessment.png"
                    alt="X-ray knee pain selector"
                    fill
                    priority
                    sizes="(max-width: 768px) 92vw, 560px"
                    className="pointer-events-none select-none object-contain object-center"
                  />
                </div>
              </div>

              <div
                ref={interactionFieldRef}
                onPointerMove={(event) => {
                  if (!interactiveRef.current || event.pointerType === "touch") {
                    return;
                  }
                  const resolved = resolveRegionFromEvent(event);
                  if (!resolved) {
                    setHoverRegion("");
                    setHoverSide("");
                    return;
                  }
                  setHoverRegion(resolved.region);
                  setHoverSide(resolved.side);
                  setCursorPoint({ x: resolved.x, y: resolved.y });
                }}
                onPointerLeave={() => {
                  setHoverRegion("");
                  setHoverSide("");
                }}
                onPointerUp={(event) => {
                  if (!interactiveRef.current) {
                    return;
                  }
                  const resolved = resolveRegionFromEvent(event);
                  if (!resolved) {
                    return;
                  }
                  setHoverRegion(resolved.region);
                  setHoverSide(resolved.side);
                  setCursorPoint({ x: resolved.x, y: resolved.y });
                  gsap.fromTo(
                    `.knee-zone-hint-core--${resolved.side}`,
                    { scale: 1, boxShadow: "0 0 0 1px rgba(138,210,255,0.25),0 0 26px rgba(138,210,255,0.2)" },
                    {
                      scale: 1.12,
                      boxShadow: "0 0 0 1px rgba(138,210,255,0.45),0 0 36px rgba(138,210,255,0.34)",
                      duration: 0.11,
                      yoyo: true,
                      repeat: 1,
                      ease: "power2.out",
                    }
                  );
                  handleSelect(resolved.region);
                }}
                className={`knee-interaction-field absolute inset-0 transition-opacity ${
                  interactive ? "pointer-events-auto" : "pointer-events-none"
                }`}
              >
                <div
                  className={`knee-zone-hint pointer-events-none absolute h-[12.8%] w-[12.8%] -translate-x-1/2 -translate-y-1/2 transition-transform duration-200 ease-out ${
                    hoverSide === "left" ? "scale-[1.06]" : "scale-100"
                  }`}
                  style={{ left: `${LEFT_KNEE_X * 100}%`, top: `${KNEE_Y * 100}%` }}
                >
                  <div className="knee-zone-hint-core knee-zone-hint-core--left h-full w-full rounded-full border border-[#8ad2ff]/45 bg-[#8ad2ff]/[0.04] shadow-[0_0_0_1px_rgba(138,210,255,0.25),0_0_26px_rgba(138,210,255,0.2)]" />
                </div>
                <div
                  className={`knee-zone-hint pointer-events-none absolute h-[12.8%] w-[12.8%] -translate-x-1/2 -translate-y-1/2 transition-transform duration-200 ease-out ${
                    hoverSide === "right" ? "scale-[1.06]" : "scale-100"
                  }`}
                  style={{ left: `${RIGHT_KNEE_X * 100}%`, top: `${KNEE_Y * 100}%` }}
                >
                  <div className="knee-zone-hint-core knee-zone-hint-core--right h-full w-full rounded-full border border-[#8ad2ff]/45 bg-[#8ad2ff]/[0.04] shadow-[0_0_0_1px_rgba(138,210,255,0.25),0_0_26px_rgba(138,210,255,0.2)]" />
                </div>
                {debugHotspots && (
                  <>
                    <div className="pointer-events-none absolute left-[1%] top-[1%] rounded border border-[#8ad2ff]/55 bg-black/50 px-2 py-1 text-[10px] text-[#bfe6ff]">
                      debugHotspots=1
                    </div>
                    <div className="pointer-events-none absolute inset-0 border border-[#8ad2ff]/20" />
                  </>
                )}
                {hoverRegion && (
                  <div
                    className="pointer-events-none absolute -translate-x-1/2 -translate-y-[130%] rounded-full border border-[#8ad2ff]/45 bg-black/70 px-3 py-1 text-[11px] tracking-[0.02em] text-[#d8efff] shadow-[0_0_24px_rgba(138,210,255,0.2)] backdrop-blur-sm"
                    style={{ left: `${cursorPoint.x}%`, top: `${cursorPoint.y}%` }}
                  >
                    {regionLabel[hoverRegion]}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="sr-only" role="group" aria-label="Select pain region">
            <button type="button" aria-label="Select front knee pain" onClick={() => handleSelect("anterior")}>
              Front
            </button>
            <button type="button" aria-label="Select inner knee pain" onClick={() => handleSelect("medial")}>
              Inner
            </button>
            <button type="button" aria-label="Select outer knee pain" onClick={() => handleSelect("lateral")}>
              Outer
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
