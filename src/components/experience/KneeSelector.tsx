"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export type KneePainRegion = "front" | "inside" | "outside" | "back" | "under-kneecap";

interface KneeSelectorProps {
  selectedRegion: KneePainRegion | "";
  onSelect: (region: KneePainRegion) => void;
}

const regionLabels: Record<KneePainRegion, string> = {
  front: "Front / Kneecap",
  inside: "Inside (Medial)",
  outside: "Outside (Lateral)",
  back: "Back of Knee",
  "under-kneecap": "Under Kneecap / Deep Ache",
};

export function KneeSelector({ selectedRegion, onSelect }: KneeSelectorProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const didEnableHotspots = useRef(false);
  const [interactive, setInteractive] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncPreference = () => setReducedMotion(query.matches);
    syncPreference();
    query.addEventListener("change", syncPreference);
    return () => query.removeEventListener("change", syncPreference);
  }, []);

  useGSAP(
    () => {
      didEnableHotspots.current = false;
      setInteractive(reducedMotion);

      if (reducedMotion) {
        gsap.set(".knee-wrapper", {
          autoAlpha: 1,
          y: 0,
          scale: 1.05,
          rotateY: -12,
          rotateX: 4,
          transformPerspective: 1200,
          transformOrigin: "50% 50%",
        });
        gsap.set(".knee-spotlight", { autoAlpha: 0.18 });
        return;
      }

      gsap.set(".knee-wrapper", {
        autoAlpha: 0,
        y: 24,
        scale: 0.96,
        rotateY: 0,
        rotateX: 0,
        transformPerspective: 1200,
        transformOrigin: "50% 50%",
      });
      gsap.set(".knee-headline", { autoAlpha: 0, y: 12 });
      gsap.set(".knee-microcopy-pre", { autoAlpha: 0, y: 12 });
      gsap.set(".knee-spotlight", { autoAlpha: 0.08 });

      const headlineTimeline = gsap.timeline({
        defaults: { ease: "power2.out" },
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          toggleActions: "play none none reverse",
        },
      });

      headlineTimeline
        .to(".knee-headline", { autoAlpha: 1, y: 0, duration: 0.35 })
        .to(".knee-microcopy-pre", { autoAlpha: 0.85, y: 0, duration: 0.35 }, "+=0.08");

      gsap.to(".knee-wrapper", {
        autoAlpha: 1,
        y: 0,
        scale: 1.12,
        rotateY: -18,
        rotateX: 6,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          end: "top 35%",
          scrub: 0.7,
          onUpdate: (self) => {
            if (!didEnableHotspots.current && self.progress >= 0.92) {
              didEnableHotspots.current = true;
              setInteractive(true);
            } else if (didEnableHotspots.current && self.progress < 0.9) {
              didEnableHotspots.current = false;
              setInteractive(false);
            }
          },
        },
      });

      gsap.to(".knee-spotlight", {
        autoAlpha: 0.18,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          end: "top 35%",
          scrub: 0.7,
        },
      });
    },
    { scope: sectionRef, dependencies: [reducedMotion] }
  );

  const interactiveCopy = "Tap the area that best matches your pain.";
  const preInteractiveCopy = "Tap the closest match - don't overthink it.";

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[132vh] overflow-hidden rounded-[32px] bg-gradient-to-b from-[#0b0b0d] via-[#0f1013] to-[#0a0a0a] px-6 py-16 text-white md:px-12"
    >
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="knee-spotlight h-[440px] w-[440px] rounded-full bg-[radial-gradient(circle,_rgba(144,185,255,0.28)_0%,_rgba(144,185,255,0.08)_36%,_rgba(0,0,0,0)_72%)]" />
      </div>

      <div className="relative mx-auto w-full max-w-5xl text-center">
        <h3 className="knee-headline text-balance text-[clamp(38px,5.8vw,72px)] font-light leading-[1.02]">
          Where does it hurt most?
        </h3>

        <div className="relative mt-4 h-6 text-sm tracking-wide text-white/85">
          <p
            className={`knee-microcopy-pre absolute inset-0 transition-opacity duration-300 ${
              interactive ? "opacity-0" : "opacity-85"
            }`}
          >
            {preInteractiveCopy}
          </p>
          <p
            className={`absolute inset-0 transition-opacity duration-300 ${
              interactive ? "opacity-85" : "opacity-0"
            }`}
          >
            {interactiveCopy}
          </p>
        </div>
      </div>

      <div className="relative mx-auto mt-12 flex max-w-[430px] items-center justify-center md:mt-16">
        <div className="knee-wrapper w-full">
          <div className="aspect-[2/3] w-full rounded-[32px] border border-white/15 bg-white/5 px-4 py-6 text-center">
            <div className="flex h-full items-center justify-center rounded-[24px] border border-dashed border-white/25 bg-white/5">
              <p className="text-xs uppercase tracking-[0.24em] text-white/45">
                PNG knee placeholder
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="relative mx-auto mt-6 flex max-w-5xl flex-col items-center">
        <div className={`mb-4 flex flex-wrap items-center justify-center gap-2 transition-opacity ${interactive ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
          {(
            [
              ["front", "Front / Kneecap"],
              ["inside", "Inside (Medial)"],
              ["outside", "Outside (Lateral)"],
              ["back", "Back of Knee"],
              ["under-kneecap", "Under Kneecap / Deep Ache"],
            ] as const
          ).map(([region, label]) => (
            <button
              key={region}
              type="button"
              onClick={() => onSelect(region)}
              className={`rounded-full border px-3 py-1 text-xs tracking-wide transition-colors ${
                selectedRegion === region
                  ? "border-[#8accff] bg-[#8accff]/20 text-[#d8efff]"
                  : "border-white/30 text-white/80 hover:border-white/50 hover:text-white"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <p
          className={`text-base text-white/85 transition-all duration-200 ${
            selectedRegion ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0"
          }`}
        >
          {selectedRegion ? `You selected: ${regionLabels[selectedRegion]}` : "\u00A0"}
        </p>
      </div>
    </section>
  );
}
