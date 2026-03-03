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
}

const regionLabel: Record<KneePainRegion, string> = {
  anterior: "Front (anterior)",
  medial: "Inner (medial)",
  lateral: "Outer (lateral)",
};
const PNG_ASPECT_RATIO = 2000 / 4000;
const LEFT_KNEE_X = 0.445;
const RIGHT_KNEE_X = 0.575;
const KNEE_Y = 0.675;
type KneeSide = "left" | "right";

export function KneeSelector({ selectedRegion, onSelect }: KneeSelectorProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const interactionFieldRef = useRef<HTMLDivElement>(null);
  const pulseTimeoutRef = useRef<number | null>(null);
  const clickLockRef = useRef(false);
  const [interactive, setInteractive] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
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

  useGSAP(
    () => {
      setInteractive(reducedMotion);
      setHoverRegion("");
      setHoverSide("");
      setPressedRegion("");

      if (reducedMotion) {
        gsap.set(".knee-headline", { autoAlpha: 1, y: 0 });
        gsap.set(".knee-subheadline", { autoAlpha: 1, y: 0, scale: 1, color: "rgba(255,255,255,1)" });
        gsap.set(".knee-image-shell", { autoAlpha: 1, scale: 1, filter: "blur(0px)" });
        gsap.set(".knee-knee-glow", { autoAlpha: 0.88, scale: 1 });
        gsap.set(".knee-zone-hint", { autoAlpha: 0.68 });
        gsap.set(".knee-zone-hint-core", { scale: 1 });
        gsap.set(".knee-interaction-field", { autoAlpha: 1 });
        return;
      }

      gsap.set(".knee-headline", { autoAlpha: 0, y: 52, filter: "blur(10px)" });
      gsap.set(".knee-subheadline", {
        autoAlpha: 0,
        y: 18,
        scale: 0.96,
        filter: "blur(6px)",
        color: "rgba(255,255,255,0.72)",
      });
      gsap.set(".knee-image-shell", {
        autoAlpha: 0,
        y: 38,
        scale: 0.95,
        rotateY: 0,
        rotateX: 0,
        filter: "blur(10px)",
        transformPerspective: 1200,
        transformOrigin: "50% 46%",
      });
      gsap.set(".knee-figure", { scale: 0.78, yPercent: 0, transformOrigin: "50% 62%" });
      gsap.set(".knee-knee-glow", { autoAlpha: 0.12, scale: 0.88, transformOrigin: "50% 68%" });
      gsap.set(".knee-zone-hint", { autoAlpha: 0.18 });
      gsap.set(".knee-zone-hint-core", { scale: 0.92 });
      gsap.set(".knee-interaction-field", { autoAlpha: 0.3 });
      gsap.set(".knee-light-sweep", { xPercent: -130, autoAlpha: 0.045 });

      const headlineTimeline = gsap.timeline({
        defaults: { ease: "power3.out" },
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 55%",
          toggleActions: "play none none reverse",
        },
      });

      headlineTimeline
        .to(".knee-headline", { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 1.5 }, 0)
        .to(".knee-subheadline", { autoAlpha: 0.78, y: 0, scale: 1, filter: "blur(0px)", duration: 1.2 }, 0.16);

      gsap.to(".knee-image-shell", {
        autoAlpha: 1,
        y: 0,
        scale: 1.02,
        filter: "blur(0px)",
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 55%",
          end: "top 20%",
          scrub: 1.15,
        },
      });

      const zoomTimeline = gsap.timeline({
        defaults: { ease: "power2.out" },
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top -3%",
          toggleActions: "play none none reverse",
        },
        onComplete: () => {
          clickLockRef.current = false;
          setInteractive(true);
        },
        onReverseComplete: () => {
          clickLockRef.current = false;
          setInteractive(false);
        },
      });

      zoomTimeline
        .to(".knee-image-shell", { rotateY: 0, rotateX: 0, duration: 1.78 }, 0)
        .to(".knee-figure", { scale: 0.98, yPercent: 0, duration: 1.86 }, 0)
        .to(".knee-headline", { scale: 0.86, autoAlpha: 0.55, duration: 1.05 }, 0.08)
        .to(
          ".knee-subheadline",
          { scale: 1.22, autoAlpha: 0.98, y: 2, color: "rgba(255,255,255,1)", duration: 1.05 },
          0.12
        )
        .to(".knee-knee-glow", { autoAlpha: 1, scale: 1, duration: 1.15 }, 0.28)
        .to(".knee-zone-hint", { autoAlpha: 0.72, duration: 0.85, stagger: 0.06 }, 0.56)
        .to(".knee-zone-hint-core", { scale: 1, duration: 0.85, stagger: 0.06 }, 0.56)
        .to(".knee-interaction-field", { autoAlpha: 0.86, duration: 0.8 }, 0.45);

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
        autoAlpha: interactive ? 0.86 : 0.52,
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
    if (!interactive || reducedMotion) {
      return;
    }

    const leftPulse = gsap.to(".knee-zone-hint-core--left", {
      scale: 1.045,
      duration: 1.1,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
    });
    const rightPulse = gsap.to(".knee-zone-hint-core--right", {
      scale: 1.045,
      duration: 1.1,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
      delay: 0.2,
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
    },
    []
  );

  const handleSelect = (region: KneePainRegion) => {
    if (!interactive || clickLockRef.current) {
      return;
    }

    clickLockRef.current = true;
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

    // Region map follows the user reference, simplified:
    // A = center-lower/front, I = inner, O = outer.
    // Keep a slightly narrower anterior lane so inner has more room.
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
    <section ref={sectionRef} className="relative min-h-[190vh] bg-black text-white">
      <div className="knee-stage sticky top-0 h-screen overflow-hidden px-6 py-[9vh] md:px-10">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-[62%] h-[300px] w-[360px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,_rgba(100,180,255,0.08)_0%,_rgba(100,180,255,0.02)_45%,_rgba(0,0,0,0)_72%)] md:h-[360px] md:w-[420px]" />
        </div>

        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="knee-light-sweep absolute -left-1/3 top-0 h-full w-1/3 bg-gradient-to-r from-transparent via-white/[0.05] to-transparent" />
        </div>

        <div className="relative flex h-full flex-col items-center justify-between">
          <div className="relative mx-auto max-w-6xl text-center">
            <h3 className="knee-headline text-balance text-[clamp(44px,6.8vw,78px)] font-light leading-[1.04] tracking-[-0.02em]">
              Where does it hurt?
            </h3>
            <p className="knee-subheadline mt-4 text-sm tracking-[0.01em] text-white/72">Tap where your knee hurts most.</p>
          </div>

          <div className="relative mx-auto w-full max-w-[560px]">
            <div className="relative mx-auto h-[58vh] w-full overflow-hidden md:h-[66vh]">
              <div
                className={`knee-image-shell relative h-full w-full transition-transform duration-300 ${
                  pressedRegion || selectedRegion ? "scale-[1.02]" : "scale-100"
                }`}
              >
                <div className="knee-figure relative h-full w-full">
                  <div
                    className="knee-knee-glow pointer-events-none absolute inset-0 z-[1]"
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
                  if (!interactive || event.pointerType === "touch") {
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
                  if (!interactive) {
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
                    {
                      scale: 1,
                      boxShadow: "0 0 0 1px rgba(138,210,255,0.25),0 0 26px rgba(138,210,255,0.2)",
                    },
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

        </div>
      </div>
    </section>
  );
}
