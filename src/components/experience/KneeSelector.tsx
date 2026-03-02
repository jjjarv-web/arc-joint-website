"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export type KneePainRegion = "anterior" | "medial" | "lateral" | "posterior";

interface KneeSelectorProps {
  selectedRegion: KneePainRegion | "";
  onSelect: (region: KneePainRegion) => void;
}

type ZoneConfig = {
  id: string;
  region: KneePainRegion;
  label: string;
  top: string;
  left: string;
  width: string;
  height: string;
};

const zones: ZoneConfig[] = [
  { id: "left-anterior", region: "anterior", label: "Left kneecap/front", top: "67%", left: "35%", width: "12%", height: "9%" },
  { id: "right-anterior", region: "anterior", label: "Right kneecap/front", top: "67%", left: "53%", width: "12%", height: "9%" },
  { id: "left-medial", region: "medial", label: "Left inner knee", top: "67%", left: "42%", width: "7%", height: "9%" },
  { id: "right-medial", region: "medial", label: "Right inner knee", top: "67%", left: "53%", width: "7%", height: "9%" },
  { id: "left-lateral", region: "lateral", label: "Left outer knee", top: "67%", left: "31%", width: "7%", height: "9%" },
  { id: "right-lateral", region: "lateral", label: "Right outer knee", top: "67%", left: "64%", width: "7%", height: "9%" },
  { id: "left-posterior", region: "posterior", label: "Left back of knee", top: "62%", left: "35%", width: "12%", height: "7%" },
  { id: "right-posterior", region: "posterior", label: "Right back of knee", top: "62%", left: "53%", width: "12%", height: "7%" },
];

export function KneeSelector({ selectedRegion, onSelect }: KneeSelectorProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const hotspotsRef = useRef<HTMLDivElement>(null);
  const pulseTimeoutRef = useRef<number | null>(null);
  const clickLockRef = useRef(false);
  const [interactive, setInteractive] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [hoveredRegion, setHoveredRegion] = useState<KneePainRegion | "">("");
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
      setHoveredRegion("");
      setPressedRegion("");

      if (reducedMotion) {
        gsap.set(".knee-headline", { autoAlpha: 1, y: 0 });
        gsap.set(".knee-image-shell", { autoAlpha: 1, scale: 1, filter: "blur(0px)" });
        gsap.set(".knee-hotspots", { autoAlpha: 1 });
        gsap.set(".knee-microcopy-pre", { autoAlpha: 0 });
        gsap.set(".knee-microcopy-live", { autoAlpha: 0.82 });
        gsap.set(".knee-instruction", { autoAlpha: 1 });
        return;
      }

      gsap.set(".knee-headline", { autoAlpha: 0, y: 52, filter: "blur(10px)" });
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
      gsap.set(".knee-hotspots", { autoAlpha: 0 });
      gsap.set(".knee-microcopy-pre", { autoAlpha: 0.82 });
      gsap.set(".knee-microcopy-live", { autoAlpha: 0 });
      gsap.set(".knee-light-sweep", { xPercent: -130, autoAlpha: 0.045 });

      const headlineTimeline = gsap.timeline({
        defaults: { ease: "power3.out" },
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 40%",
          toggleActions: "play none none reverse",
        },
      });

      headlineTimeline.to(".knee-headline", { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 1.5 });

      gsap.to(".knee-image-shell", {
        autoAlpha: 1,
        y: 0,
        scale: 1.02,
        filter: "blur(0px)",
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 50%",
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
        .to(".knee-image-shell", { rotateY: -5, rotateX: 3, duration: 1.85 }, 0)
        .to(".knee-figure", { scale: 0.98, yPercent: 0, duration: 1.95 }, 0)
        .to(".knee-hotspots", { autoAlpha: 1, duration: 0.8 }, 0.55);

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
    if (!hotspotsRef.current || reducedMotion) {
      return;
    }

    if (!interactive) {
      clickLockRef.current = false;
    }

    gsap.to(".knee-microcopy-pre", {
      autoAlpha: interactive ? 0 : 0.82,
      duration: 0.25,
      ease: "power2.out",
    });
    gsap.to(".knee-microcopy-live", {
      autoAlpha: interactive ? 0.82 : 0,
      duration: 0.25,
      ease: "power2.out",
    });
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

  const preInteractiveCopy = "Tap where it hurts most.";
  const interactiveCopy = "Tap where it hurts most.";

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

            <div className="relative mt-4 h-6 text-sm tracking-[0.01em] text-white/80">
              <p className="knee-microcopy-pre absolute inset-0">{preInteractiveCopy}</p>
              <p className="knee-microcopy-live absolute inset-0">{interactiveCopy}</p>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[560px]">
            <div className="relative mx-auto h-[58vh] w-full overflow-hidden md:h-[66vh]">
              <div
                className={`knee-image-shell relative h-full w-full transition-transform duration-300 ${
                  pressedRegion ? "scale-[1.02]" : "scale-100"
                }`}
              >
                <div className="knee-figure relative h-full w-full">
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
                ref={hotspotsRef}
                className={`knee-hotspots absolute inset-0 transition-opacity ${
                  interactive ? "pointer-events-auto" : "pointer-events-none"
                }`}
              >
                {zones.map((zone) => {
                  const isActive = selectedRegion === zone.region || hoveredRegion === zone.region;

                  return (
                    <button
                      key={zone.id}
                      type="button"
                      aria-label={`Select ${zone.label}`}
                      onMouseEnter={() => setHoveredRegion(zone.region)}
                      onMouseLeave={() => setHoveredRegion("")}
                      onFocus={() => setHoveredRegion(zone.region)}
                      onBlur={() => setHoveredRegion("")}
                      onClick={() => handleSelect(zone.region)}
                      className={`absolute rounded-full transition-all duration-200 ${
                        isActive
                          ? "bg-[#8ad2ff]/[0.08] shadow-[0_0_0_1px_rgba(138,210,255,0.22),0_0_30px_rgba(138,210,255,0.22)]"
                          : "bg-transparent"
                      }`}
                      style={{
                        top: zone.top,
                        left: zone.left,
                        width: zone.width,
                        height: zone.height,
                        cursor: interactive ? "pointer" : "default",
                      }}
                    />
                  );
                })}
              </div>
            </div>
          </div>

          <p className="knee-instruction text-center text-[14px] text-white/58">
            Tap where it hurts most.
          </p>
        </div>
      </div>
    </section>
  );
}
