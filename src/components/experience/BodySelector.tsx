"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import type { TreatmentArea } from "@/lib/types";

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface BodySelectorProps {
  selectedRegion: TreatmentArea | "";
  onSelect: (region: TreatmentArea) => void;
  visible?: boolean;
}

const TRUST_HEADLINE = "Performed by Orthopedic Surgeons and Neurosurgeons";

const PNG_ASPECT_RATIO = 2000 / 4000; // width / height = 0.5
const SOFT_GATE_MS = 2400;

// ── Hotspot definitions ──────────────────────────────────────────────────────
// Internal IDs for positioning; emits TreatmentArea on select
type HotspotId = string;

interface Hotspot {
  id: HotspotId;
  area: TreatmentArea;
  label: string;
  x: number;
  y: number;
  w: string;
  h: string;
}

const HOTSPOTS: Hotspot[] = [
  { id: "cervical",        area: "cervical",  label: "Cervical Spine",  x: 0.511, y: 0.150, w: "5%",   h: "7.5%"  },
  { id: "left-shoulder",   area: "shoulder",  label: "Left Shoulder",   x: 0.407, y: 0.195, w: "10%",  h: "6%"    },
  { id: "right-shoulder",  area: "shoulder",  label: "Right Shoulder",  x: 0.613, y: 0.195, w: "10%",  h: "6%"    },
  { id: "lumbar",          area: "lumbar",    label: "Lumbar Spine",    x: 0.513, y: 0.378, w: "4.5%", h: "9%"    },
  { id: "left-hip",        area: "hip",       label: "Left Hip",        x: 0.440, y: 0.477, w: "10%",  h: "7%"    },
  { id: "right-hip",       area: "hip",       label: "Right Hip",       x: 0.582, y: 0.477, w: "10%",  h: "7%"    },
  { id: "left-knee",       area: "knee",      label: "Left Knee",       x: 0.462, y: 0.686, w: "6.5%", h: "11%"   },
  { id: "right-knee",      area: "knee",      label: "Right Knee",      x: 0.557, y: 0.686, w: "6.5%", h: "11%"   },
  { id: "left-ankle",      area: "ankle",     label: "Left Ankle",      x: 0.470, y: 0.912, w: "5%",   h: "6.5%"  },
  { id: "right-ankle",     area: "ankle",     label: "Right Ankle",     x: 0.552, y: 0.912, w: "5%",   h: "6.5%"  },
];

const BRIGHTER_IDS = new Set(["left-knee", "right-knee"]);

export function BodySelector({ selectedRegion, onSelect, visible = true }: BodySelectorProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const interactionFieldRef = useRef<HTMLDivElement>(null);
  const pulseTimeoutRef = useRef<number | null>(null);
  const gateTimeoutRef = useRef<number | null>(null);
  const clickLockRef = useRef(false);
  const interactiveRef = useRef(false);
  const gateTriggeredRef = useRef(false);
  const pulseTweensRef = useRef<gsap.core.Tween[]>([]);
  const stageTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const hasPlayedRef = useRef(false);
  const autoplayDelayRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [interactive, setInteractive] = useState(false);
  const [softGateActive, setSoftGateActive] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [debugHotspots] = useState(() =>
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search).get("debugHotspots") === "1"
      : false
  );
  const [hoverHotspot, setHoverHotspot] = useState<HotspotId | "">("");
  const [cursorPoint, setCursorPoint] = useState<{ x: number; y: number }>({ x: 50, y: 68 });
  const [pressedHotspot, setPressedHotspot] = useState<HotspotId | "">("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.location.hash !== "#relief") return;
    const timer = setTimeout(() => {
      window.scrollBy({ top: 1, behavior: "instant" });
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncPreference = () => setReducedMotion(query.matches);
    syncPreference();
    query.addEventListener("change", syncPreference);
    return () => query.removeEventListener("change", syncPreference);
  }, []);

  useEffect(() => {
    const mobileQuery = window.matchMedia("(max-width: 767px)");
    const sync = () => setIsMobile(mobileQuery.matches);
    sync();
    mobileQuery.addEventListener("change", sync);
    return () => mobileQuery.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const body = new window.Image();
    body.src = "/images/knee-assessment.png";
    const grain = new window.Image();
    grain.src = "/images/grain-overlay.png";
  }, []);

  useGSAP(
    () => {
      const isMobile = window.matchMedia("(max-width: 767px)").matches;
      const blurStart = isMobile ? 4 : 6;
      const stageElement = sectionRef.current?.querySelector(".body-stage");

      setHoverHotspot("");
      setPressedHotspot("");
      clickLockRef.current = false;
      interactiveRef.current = reducedMotion;
      gateTriggeredRef.current = false;
      if (autoplayDelayRef.current) {
        clearTimeout(autoplayDelayRef.current);
        autoplayDelayRef.current = null;
      }
      setInteractive(reducedMotion);
      setSoftGateActive(false);

      if (reducedMotion) {
        gsap.set(".body-light-field", { autoAlpha: 0.86 });
        gsap.set(".body-trust-copy", { autoAlpha: 0 });
        gsap.set(".body-step-label", { autoAlpha: 1, y: 0 });
        gsap.set(".body-headline", { autoAlpha: 1, y: 0, scale: 1, color: "rgba(255,255,255,1)" });
        gsap.set(".body-image-shell", { autoAlpha: 0.95, scale: 1.05, filter: "blur(0px)" });
        gsap.set(".body-joint-glow", { autoAlpha: 0.5, scale: 1 });
        gsap.set(".joint-glow-fill", { autoAlpha: 1 });
        gsap.set(".joint-hint", { autoAlpha: 0.72 });
        gsap.set(".joint-hint-core", { scale: 1 });
        gsap.set(".body-interaction-field", { autoAlpha: 0.9 });
        gsap.set(".body-light-sweep", { autoAlpha: 0.04, xPercent: -20 });
        return;
      }

      gsap.set(".body-light-field", { autoAlpha: 0.54 });
      gsap.set(".body-trust-headline", {
        autoAlpha: 0.34,
        y: 54,
        scale: 1.52,
        filter: "blur(5px)",
        color: "rgba(154,162,176,0.36)",
      });
      gsap.set(".body-trust-emphasis", { color: "rgba(130,142,165,0.4)" });
      gsap.set(".body-trust-copy", { autoAlpha: 1 });
      gsap.set(".body-step-label", { autoAlpha: 0, y: 8 });
      gsap.set(".body-headline", { autoAlpha: 0, y: 22, scale: 0.98 });
      gsap.set(".body-image-shell", {
        autoAlpha: 0.08,
        y: 10,
        scale: 1,
        rotateY: -5,
        rotateX: 0,
        filter: `blur(${blurStart}px)`,
        transformPerspective: 1200,
        transformOrigin: "50% 46%",
      });
      gsap.set(".body-figure", { scale: 0.86, yPercent: 0, transformOrigin: "50% 62%" });
      gsap.set(".body-joint-glow", { autoAlpha: 0.06, scale: 0.9, transformOrigin: "50% 68%" });
      gsap.set(".joint-glow-fill", { autoAlpha: 0.12 });
      gsap.set(".joint-hint", { autoAlpha: 0.18 });
      gsap.set(".joint-hint-core", { scale: 0.92 });
      gsap.set(".body-interaction-field", { autoAlpha: 0.2 });
      gsap.set(".body-light-sweep", { xPercent: -130, autoAlpha: 0.045 });

      // Phase 1: trust headline scroll-driven materialise
      gsap.to(".body-trust-headline", {
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
      gsap.to(".body-trust-emphasis", {
        color: "rgba(255,255,255,1)",
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 72%",
          end: "top top",
          scrub: 1.2,
        },
      });

      const buildStageTimeline = () => {
        const tl = gsap.timeline({ paused: true });
        tl
          .set(".body-trust-headline", { autoAlpha: 1, y: 0, scale: 1, filter: "blur(0px)", color: "rgba(255,255,255,0.95)" })
          .set(".body-trust-emphasis", { color: "rgba(255,255,255,1)" })
          .to(".body-light-field", { autoAlpha: 0.82, duration: 0.5, ease: "none" }, 0)
          .to(".body-trust-headline", { autoAlpha: 0, y: -10, scale: 0.95, duration: 0.55, ease: "power2.in" }, 0)
          .to(".body-trust-copy", { autoAlpha: 0, duration: 0.45, ease: "power2.in" }, 0.1)
          // Body enters and settles (~0.3 → 1.2s)
          .to(".body-image-shell", { autoAlpha: 0.95, y: 0, scale: 1.05, rotateY: 0, filter: "blur(0px)", duration: 0.9, ease: "power2.out" }, 0.3)
          .to(".body-figure", { scale: 0.98, yPercent: 0, duration: 0.9, ease: "power2.out" }, 0.3)
          // Headline appears while body is entering
          .to(".body-step-label", { autoAlpha: 0.82, y: 0, duration: 0.45, ease: "power2.out" }, 0.55)
          .to(".body-headline", { autoAlpha: 1, y: 0, scale: 1, color: "rgba(255,255,255,1)", duration: 0.45, ease: "power2.out" }, 0.55)
          .to(".body-interaction-field", { autoAlpha: 0.94, duration: 0.4, ease: "power2.out" }, 0.55)
          // Joints fade in after body has settled (~1.1s) — directly to resting state
          .to(".body-joint-glow", { autoAlpha: 0.45, scale: 1, duration: 0.6, ease: "power2.out" }, 1.1)
          .to(".joint-glow-fill", { autoAlpha: 0.82, duration: 0.6, ease: "power2.out" }, 1.1)
          .to(".joint-hint", { autoAlpha: 0.84, duration: 0.5, stagger: 0.04, ease: "power2.out" }, 1.2)
          .to(".joint-hint-core", { scale: 1, duration: 0.5, stagger: 0.04, ease: "power2.out" }, 1.2)
          .call(() => {
            interactiveRef.current = true;
            clickLockRef.current = false;
            setInteractive(true);
            if (!gateTriggeredRef.current) {
              gateTriggeredRef.current = true;
              setSoftGateActive(true);
              if (gateTimeoutRef.current) window.clearTimeout(gateTimeoutRef.current);
              gateTimeoutRef.current = window.setTimeout(() => {
                setSoftGateActive(false);
                gateTimeoutRef.current = null;
              }, SOFT_GATE_MS);
            }
          }, undefined, 2.0)
          .call(() => {
            pulseTweensRef.current.forEach((t) => t.kill());
            pulseTweensRef.current = [];
          }, undefined, 2.0);
        return tl;
      };

      const resetVisualState = () => {
        gsap.set(".body-trust-copy", { autoAlpha: 1, overwrite: "auto" });
        gsap.set(".body-step-label", { autoAlpha: 0, y: 8, overwrite: "auto" });
        gsap.set(".body-headline", { autoAlpha: 0, y: 22, scale: 0.98, overwrite: "auto" });
        gsap.set(".body-image-shell", { autoAlpha: 0.08, y: 10, scale: 1, rotateY: -5, filter: `blur(${blurStart}px)`, overwrite: "auto" });
        gsap.set(".body-figure", { scale: 0.86, yPercent: 0, overwrite: "auto" });
        gsap.set(".body-joint-glow", { autoAlpha: 0.06, scale: 0.9, overwrite: "auto" });
        gsap.set(".joint-glow-fill", { autoAlpha: 0.08, overwrite: "auto" });
        gsap.set(".joint-hint", { autoAlpha: 0.18, overwrite: "auto" });
        gsap.set(".joint-hint-core", { scale: 0.92, boxShadow: "none", overwrite: "auto" });
        gsap.set(".body-interaction-field", { autoAlpha: 0.2, overwrite: "auto" });
      };

      const resetToActiveState = () => {
        gsap.set(".body-trust-copy", { autoAlpha: 0, overwrite: "auto" });
        gsap.set(".body-step-label", { autoAlpha: 0.82, y: 0, overwrite: "auto" });
        gsap.set(".body-headline", { autoAlpha: 1, y: 0, scale: 1, overwrite: "auto" });
        gsap.set(".body-image-shell", { autoAlpha: 0.95, y: 0, scale: 1.05, rotateY: 0, filter: "blur(0px)", overwrite: "auto" });
        gsap.set(".body-figure", { scale: 0.98, yPercent: 0, overwrite: "auto" });
        gsap.set(".body-joint-glow", { autoAlpha: 0.45, scale: 1, overwrite: "auto" });
        gsap.set(".joint-glow-fill", { autoAlpha: 0.82, overwrite: "auto" });
        gsap.set(".joint-hint", { autoAlpha: 0.84, overwrite: "auto" });
        gsap.set(".joint-hint-core", { scale: 1, boxShadow: "0 0 18px rgba(138,210,255,0.14)", overwrite: "auto" });
        gsap.set(".body-interaction-field", { autoAlpha: 0.94, overwrite: "auto" });
      };

      const st = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: "+=120%",
        pin: stageElement,
        anticipatePin: 1,
        onEnter: () => {
          if (hasPlayedRef.current) {
            resetToActiveState();
            interactiveRef.current = true;
            setInteractive(true);
            return;
          }
          hasPlayedRef.current = true;
          gsap.fromTo(
            ".knee-trust-emphasis",
            { textShadow: "0 0 20px rgba(255,255,255,0.1)" },
            {
              textShadow: "0 0 38px rgba(255,255,255,0.42)",
              duration: 0.55,
              ease: "power2.out",
              delay: 0.2,
              yoyo: true,
              repeat: 1,
              repeatDelay: 0.18,
            }
          );
          autoplayDelayRef.current = setTimeout(() => {
            autoplayDelayRef.current = null;
            const tl = buildStageTimeline();
            stageTimelineRef.current = tl;
            tl.play();
          }, 1600);
        },
        onEnterBack: () => {
          if (hasPlayedRef.current) {
            resetToActiveState();
            interactiveRef.current = true;
            setInteractive(true);
          }
        },
        onLeaveBack: () => {
          if (autoplayDelayRef.current) {
            clearTimeout(autoplayDelayRef.current);
            autoplayDelayRef.current = null;
          }
          if (stageTimelineRef.current) {
            stageTimelineRef.current.kill();
            stageTimelineRef.current = null;
          }
          const hadPlayed = hasPlayedRef.current;
          interactiveRef.current = false;
          gateTriggeredRef.current = false;
          setInteractive(false);
          setSoftGateActive(false);
          setHoverHotspot("");
          if (gateTimeoutRef.current) {
            window.clearTimeout(gateTimeoutRef.current);
            gateTimeoutRef.current = null;
          }
          pulseTweensRef.current.forEach((t) => t.kill());
          pulseTweensRef.current = [];
          hadPlayed ? resetToActiveState() : resetVisualState();
        },
      });

      gsap.to(".body-light-sweep", {
        xPercent: 130,
        duration: 2.1,
        ease: "power1.inOut",
        repeat: -1,
        repeatDelay: 6.8,
      });

      return () => {
        st.kill();
        if (autoplayDelayRef.current) {
          clearTimeout(autoplayDelayRef.current);
          autoplayDelayRef.current = null;
        }
        stageTimelineRef.current?.kill();
        stageTimelineRef.current = null;
      };
    },
    { scope: sectionRef, dependencies: [reducedMotion] }
  );

  useEffect(() => {
    if (!interactionFieldRef.current || reducedMotion) return;
    if (!interactive) clickLockRef.current = false;
    gsap.to(".body-interaction-field", {
      autoAlpha: interactive ? 0.9 : 0.25,
      duration: 0.25,
      ease: "power2.out",
    });
    gsap.to(".joint-hint", {
      autoAlpha: interactive ? 0.84 : 0.26,
      duration: 0.25,
      ease: "power2.out",
    });
  }, [interactive, reducedMotion]);

  useEffect(() => {
    if (reducedMotion || !interactive) return;
    gsap.to(".joint-hint", {
      autoAlpha: softGateActive ? 0.94 : 0.84,
      duration: 0.28,
      ease: "power2.out",
      overwrite: "auto",
    });
  }, [softGateActive, reducedMotion, interactive]);

  // Hover glow brightening (desktop only — touch already filtered at pointer level)
  useEffect(() => {
    if (!interactive || reducedMotion) return;
    if (hoverHotspot) {
      gsap.to(`.joint-glow-fill--${hoverHotspot}`, {
        autoAlpha: 1,
        scale: 1.15,
        duration: 0.2,
        ease: "power2.out",
        overwrite: "auto",
      });
      gsap.to(`.joint-hint-core--${hoverHotspot}`, {
        boxShadow: "0 0 0 1px rgba(138,210,255,0.5), 0 0 40px rgba(138,210,255,0.45)",
        border: "1px solid rgba(138,210,255,0.45)",
        duration: 0.2,
        ease: "power2.out",
        overwrite: "auto",
      });
    }
    HOTSPOTS.filter((h) => h.id !== hoverHotspot).forEach((h) => {
      const br = BRIGHTER_IDS.has(h.id);
      gsap.to(`.joint-glow-fill--${h.id}`, {
        autoAlpha: 0.82,
        scale: 1,
        duration: 0.28,
        ease: "power2.out",
        overwrite: "auto",
      });
      gsap.to(`.joint-hint-core--${h.id}`, {
        boxShadow: `0 0 ${br ? "20" : "14"}px rgba(138,210,255,${br ? "0.16" : "0.10"})`,
        border: `0.5px solid rgba(138,210,255,${br ? "0.28" : "0.18"})`,
        duration: 0.28,
        ease: "power2.out",
        overwrite: "auto",
      });
    });
  }, [hoverHotspot, interactive, reducedMotion]);

  // Gentle idle pulse on all hotspots after becoming interactive
  useEffect(() => {
    if (!interactive || reducedMotion) return;
    const mobile = window.matchMedia("(max-width: 767px)").matches;
    const tweens = HOTSPOTS.map((h, i) =>
      gsap.to(`.joint-hint-core--${h.id}`, {
        scale: mobile ? 1.12 : 1.07,
        duration: mobile ? 1.0 : 0.9,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        delay: i * 0.09,
      })
    );
    pulseTweensRef.current = tweens;
    return () => {
      tweens.forEach((t) => t.kill());
      pulseTweensRef.current = [];
    };
  }, [interactive, reducedMotion]);

  useEffect(
    () => () => {
      if (pulseTimeoutRef.current) window.clearTimeout(pulseTimeoutRef.current);
      if (gateTimeoutRef.current) window.clearTimeout(gateTimeoutRef.current);
      if (autoplayDelayRef.current) clearTimeout(autoplayDelayRef.current);
    },
    []
  );

  useEffect(() => {
    if (!sectionRef.current || visible) return;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dur = prefersReducedMotion ? 0 : 0.3;
    gsap.to(".body-image-shell", { autoAlpha: 0, scale: 0.95, duration: dur, ease: "power2.out", overwrite: "auto" });
    gsap.to(".body-joint-glow", { autoAlpha: 0, scale: 1.1, duration: dur, ease: "power2.out", overwrite: "auto" });
    gsap.to(".joint-glow-fill", { autoAlpha: 0, duration: dur * 0.7, ease: "power2.out", overwrite: "auto" });
    gsap.to(
      [".body-headline", ".body-step-label", ".joint-hint", ".body-interaction-field", ".body-trust-copy"],
      { autoAlpha: 0, duration: dur * 0.7, ease: "power2.out", overwrite: "auto" }
    );
  }, [visible]);

  const handleSelect = (hotspot: Hotspot) => {
    if (!interactiveRef.current || clickLockRef.current) return;
    clickLockRef.current = true;
    setSoftGateActive(false);
    if (gateTimeoutRef.current) {
      window.clearTimeout(gateTimeoutRef.current);
      gateTimeoutRef.current = null;
    }
    if (pulseTimeoutRef.current) window.clearTimeout(pulseTimeoutRef.current);
    setPressedHotspot(hotspot.id);

    gsap.to(`.joint-hint-core--${hotspot.id}`, {
      scale: 1.3,
      boxShadow: "0 0 0 1.5px rgba(138,210,255,0.8),0 0 48px rgba(138,210,255,0.55)",
      duration: 0.16,
      ease: "power2.out",
      overwrite: "auto",
    });
    gsap.to(`.joint-glow-fill--${hotspot.id}`, {
      autoAlpha: 1,
      duration: 0.16,
      ease: "power2.out",
      overwrite: "auto",
    });
    HOTSPOTS.filter((h) => h.id !== hotspot.id).forEach((h) => {
      gsap.to(`.joint-hint-core--${h.id}`, {
        autoAlpha: 0.25,
        scale: 0.9,
        duration: 0.2,
        ease: "power2.out",
        overwrite: "auto",
      });
      gsap.to(`.joint-glow-fill--${h.id}`, {
        autoAlpha: 0.08,
        duration: 0.2,
        ease: "power2.out",
        overwrite: "auto",
      });
    });
    gsap.to(".body-joint-glow", {
      scale: 1.25,
      autoAlpha: 0.5,
      duration: 0.18,
      ease: "power2.out",
      overwrite: "auto",
    });
    gsap.to(".body-image-shell", {
      autoAlpha: 0.7,
      scale: 0.97,
      duration: 0.18,
      ease: "power2.out",
      overwrite: "auto",
    });
    gsap.to([".body-headline", ".body-step-label", ".body-interaction-field", ".body-trust-copy"], {
      autoAlpha: 0,
      duration: 0.22,
      ease: "power2.out",
      overwrite: "auto",
    });

    pulseTimeoutRef.current = window.setTimeout(() => {
      onSelect(hotspot.area);
      setPressedHotspot("");
    }, 240);
  };

  // Find the closest hotspot to a pointer event
  const resolveHotspotFromEvent = (
    clientX: number,
    clientY: number
  ): { hotspot: Hotspot; x: number; y: number } | null => {
    const bounds = interactionFieldRef.current?.getBoundingClientRect();
    if (!bounds) return null;

    const imageWidth = Math.min(bounds.width, bounds.height * PNG_ASPECT_RATIO);
    const imageHeight = imageWidth / PNG_ASPECT_RATIO;
    const imageLeft = (bounds.width - imageWidth) / 2;
    const imageTop = (bounds.height - imageHeight) / 2;
    const xInImage = clientX - bounds.left - imageLeft;
    const yInImage = clientY - bounds.top - imageTop;

    if (xInImage < 0 || yInImage < 0 || xInImage > imageWidth || yInImage > imageHeight) return null;

    const xNorm = xInImage / imageWidth;
    const yNorm = yInImage / imageHeight;

    // Find nearest hotspot — weighted by aspect-corrected distance
    let best: Hotspot | null = null;
    let bestDist = Infinity;
    for (const h of HOTSPOTS) {
      const dx = (xNorm - h.x) * 2;  // x has half the range in image coords
      const dy = yNorm - h.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < bestDist) {
        bestDist = dist;
        best = h;
      }
    }

    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    const hitRadius = isMobile ? 0.16 : 0.15;
    if (!best || bestDist > hitRadius) return null;

    return {
      hotspot: best,
      x: ((imageLeft + xInImage) / bounds.width) * 100,
      y: ((imageTop + yInImage) / bounds.height) * 100,
    };
  };

  return (
    <section
      id="relief"
      ref={sectionRef}
      className={`relative bg-black text-white ${reducedMotion ? "min-h-[380vh]" : "min-h-[220vh]"}`}
    >
      <div className="body-stage relative h-screen overflow-hidden px-6 py-[9vh] md:px-10">
        {/* Ambient light field */}
        <div className="body-light-field pointer-events-none absolute inset-0 z-[1] will-change-[opacity]">
          <div className="absolute left-1/2 top-[55%] h-[380px] w-[500px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,_rgba(156,196,232,0.11)_0%,_rgba(72,112,150,0.07)_34%,_rgba(0,0,0,0)_72%)] md:h-[460px] md:w-[600px]" />
          <div className="absolute right-[12%] top-[32%] h-[300px] w-[300px] rounded-full bg-[radial-gradient(circle,_rgba(188,208,226,0.07)_0%,_rgba(0,0,0,0)_72%)] blur-xl" />
        </div>

        {/* Film grain */}
        <div className="pointer-events-none absolute inset-0 z-[2] bg-[url('/images/grain-overlay.png')] bg-repeat opacity-[0.05]" />

        {/* Light sweep */}
        <div className="pointer-events-none absolute inset-0 z-[4] overflow-hidden">
          <div className="body-light-sweep absolute -left-1/3 top-0 h-full w-1/3 bg-gradient-to-r from-transparent via-white/[0.04] to-transparent will-change-[transform,opacity]" />
        </div>

        <div className="relative z-[5] flex h-full flex-col items-center justify-between">
          {/* Trust headline */}
          <div className="body-trust-copy pointer-events-none absolute left-1/2 top-[26%] w-full max-w-5xl -translate-x-1/2 px-4 text-center">
            <p className="body-trust-headline relative text-balance text-[clamp(34px,5.2vw,72px)] font-semibold leading-[1.05] tracking-[-0.02em] text-white/94 [text-shadow:0_0_34px_rgba(145,180,220,0.1)]">
              Performed by{" "}
              <span className="body-trust-emphasis font-bold text-white [text-shadow:0_0_20px_rgba(255,255,255,0.1)]">Orthopedic Surgeons</span>
              {" "}and{" "}
              <span className="body-trust-emphasis font-bold text-white [text-shadow:0_0_20px_rgba(255,255,255,0.1)]">Neurosurgeons</span>
            </p>
            <p className="sr-only">{TRUST_HEADLINE}</p>
          </div>

          {/* Step label + headline */}
          <div className="relative mx-auto max-w-6xl text-center">
            <p className="body-step-label mb-3 text-[11px] uppercase tracking-[0.18em] text-white/70">Step 1 of 4</p>
            <h3
              className="body-headline text-balance text-[clamp(44px,6.8vw,78px)] font-light leading-[1.04] tracking-[-0.02em]"
              style={{ opacity: 0 }}
            >
              Tap where it{" "}
              <span className="font-semibold text-white">hurts</span>
              {" "}to begin.
            </h3>
          </div>

          {/* Body + hotspots */}
          <div className="relative z-[3] mx-auto w-full max-w-[560px]">
            <div className="relative mx-auto h-[58vh] w-full overflow-hidden md:h-[66vh]">
              <div
                className={`body-image-shell relative h-full w-full transition-transform duration-300 will-change-[transform,opacity,filter] ${
                  pressedHotspot || selectedRegion ? "scale-[1.02]" : "scale-100"
                }`}
              >
                <div className="body-figure relative h-full w-full">
                  {/* Ambient joint glow layer */}
                  <div
                    className="body-joint-glow pointer-events-none absolute inset-0 z-[1] will-change-[transform,opacity]"
                    style={{
                      background: [
                        // Knees
                        `radial-gradient(ellipse 7% 13% at 46.2% 68.6%, rgba(106,192,255,0.10) 0%, transparent 100%)`,
                        `radial-gradient(ellipse 7% 13% at 55.7% 68.6%, rgba(106,192,255,0.10) 0%, transparent 100%)`,
                        // Hips
                        `radial-gradient(ellipse 11% 8% at 44% 47.7%, rgba(106,192,255,0.07) 0%, transparent 70%)`,
                        `radial-gradient(ellipse 11% 8% at 58.2% 47.7%, rgba(106,192,255,0.07) 0%, transparent 70%)`,
                        // Lumbar
                        `radial-gradient(ellipse 5% 11% at 51.3% 37.8%, rgba(106,192,255,0.06) 0%, transparent 70%)`,
                        // Shoulders
                        `radial-gradient(ellipse 12% 7% at 40.7% 19.5%, rgba(106,192,255,0.06) 0%, transparent 70%)`,
                        `radial-gradient(ellipse 12% 7% at 61.3% 19.5%, rgba(106,192,255,0.06) 0%, transparent 70%)`,
                        // Cervical
                        `radial-gradient(ellipse 5% 8% at 51.1% 15%, rgba(106,192,255,0.06) 0%, transparent 70%)`,
                        // Ankles
                        `radial-gradient(ellipse 5% 7% at 47% 91.2%, rgba(106,192,255,0.05) 0%, transparent 70%)`,
                        `radial-gradient(ellipse 5% 7% at 55.2% 91.2%, rgba(106,192,255,0.05) 0%, transparent 70%)`,
                      ].join(", "),
                    }}
                  />
                  <Image
                    src="/images/knee-assessment.png"
                    alt="Full body joint pain selector"
                    fill
                    priority
                    sizes="(max-width: 768px) 92vw, 560px"
                    className="pointer-events-none select-none object-contain object-center"
                  />
                </div>
              </div>

              {/* Interaction overlay */}
              <div
                ref={interactionFieldRef}
                onPointerMove={(e) => {
                  if (!interactiveRef.current || e.pointerType === "touch") return;
                  const result = resolveHotspotFromEvent(e.clientX, e.clientY);
                  if (!result) {
                    setHoverHotspot("");
                    return;
                  }
                  setHoverHotspot(result.hotspot.id);
                  setCursorPoint({ x: result.x, y: result.y });
                }}
                onPointerLeave={() => setHoverHotspot("")}
                onPointerUp={(e) => {
                  if (!interactiveRef.current) return;
                  const result = resolveHotspotFromEvent(e.clientX, e.clientY);
                  if (!result) return;
                  setHoverHotspot(result.hotspot.id);
                  setCursorPoint({ x: result.x, y: result.y });
                  gsap.fromTo(
                    `.joint-hint-core--${result.hotspot.id}`,
                    { scale: 1, boxShadow: "0 0 14px rgba(138,210,255,0.12)" },
                    {
                      scale: 1.14,
                      boxShadow: "0 0 36px rgba(138,210,255,0.38)",
                      duration: 0.11,
                      yoyo: true,
                      repeat: 1,
                      ease: "power2.out",
                    }
                  );
                  handleSelect(result.hotspot);
                }}
                className={`body-interaction-field absolute inset-0 transition-opacity ${
                  interactive ? "pointer-events-auto" : "pointer-events-none"
                } ${hoverHotspot ? "cursor-pointer" : "cursor-default"}`}
              >
                {/* Hotspot indicators */}
                {HOTSPOTS.map((h) => {
                  const isBrighter = BRIGHTER_IDS.has(h.id);
                  const isHovered = hoverHotspot === h.id;
                  const scale = isMobile ? 1.6 : 1.25;
                  const w = `${parseFloat(h.w) * scale}%`;
                  const hh = `${parseFloat(h.h) * scale}%`;
                  return (
                    <div
                      key={h.id}
                      className={`joint-hint pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 transition-transform duration-200 ease-out ${
                        isHovered ? "scale-[1.3]" : "scale-100"
                      }`}
                      style={{
                        left: `${h.x * 100}%`,
                        top: `${h.y * 100}%`,
                        width: w,
                        height: hh,
                      }}
                    >
                      {/* Inner glow — light emanating from within the joint */}
                      <div
                        className={`joint-glow-fill joint-glow-fill--${h.id} pointer-events-none absolute inset-0`}
                        style={{
                          borderRadius: "50%",
                          background: `radial-gradient(ellipse at center, rgba(180,230,255,${isBrighter ? "1" : "0.92"}) 0%, rgba(138,210,255,${isBrighter ? "0.75" : "0.60"}) 40%, rgba(106,180,255,0.25) 65%, transparent 85%)`,
                          filter: "blur(5px)",
                        }}
                      />
                      <div
                        className={`joint-hint-core joint-hint-core--${h.id} h-full w-full`}
                        style={{
                          borderRadius: "50%",
                          border: `0.5px solid rgba(138,210,255,${isBrighter ? "0.28" : "0.18"})`,
                          background: "transparent",
                          boxShadow: `0 0 ${isBrighter ? "20" : "14"}px rgba(138,210,255,${isBrighter ? "0.16" : "0.10"})`,
                        }}
                      />
                    </div>
                  );
                })}

                {debugHotspots && (
                  <div className="pointer-events-none absolute left-[1%] top-[1%] rounded border border-[#8ad2ff]/55 bg-black/50 px-2 py-1 text-[10px] text-[#bfe6ff]">
                    debugHotspots=1
                  </div>
                )}

                {hoverHotspot && (() => {
                  const h = HOTSPOTS.find((hs) => hs.id === hoverHotspot);
                  return h ? (
                    <div
                      className="pointer-events-none absolute -translate-x-1/2 -translate-y-[130%] rounded-full border border-[#8ad2ff]/45 bg-black/70 px-3 py-1 text-[11px] tracking-[0.02em] text-[#d8efff] shadow-[0_0_24px_rgba(138,210,255,0.2)] backdrop-blur-sm"
                      style={{ left: `${cursorPoint.x}%`, top: `${cursorPoint.y}%` }}
                    >
                      {h.label}
                    </div>
                  ) : null;
                })()}
              </div>
            </div>
          </div>

          <div className="sr-only" role="group" aria-label="Select pain region">
            {HOTSPOTS.map((h) => (
              <button
                key={h.id}
                type="button"
                aria-label={`Select ${h.label} pain`}
                onClick={() => handleSelect(h)}
              >
                {h.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
