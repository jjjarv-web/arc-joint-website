import type { Metadata } from "next";
import { HomeExperience } from "@/components/experience/HomeExperience";

export const metadata: Metadata = {
  title: "ARC | Preserve-First Joint Pain Treatment",
  description:
    "ARC connects patients with orthopedic surgeons and neurosurgeons offering minimally invasive, reversible joint pain procedures — before surgery. Find a location near you.",
  alternates: {
    canonical: "https://arcjoint.com",
  },
  openGraph: {
    title: "ARC | Preserve-First Joint Pain Treatment",
    description:
      "ARC connects patients with orthopedic surgeons and neurosurgeons offering minimally invasive, reversible joint pain procedures — before surgery.",
    url: "https://arcjoint.com",
    type: "website",
  },
};

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MedicalBusiness",
    name: "ARC Joint",
    url: "https://arcjoint.com",
    description:
      "ARC connects patients with orthopedic surgeons and neurosurgeons offering minimally invasive, reversible joint pain treatment using peripheral nerve stimulation (PNS) — before surgery.",
    medicalSpecialty: [
      "https://schema.org/Orthopedic",
      "https://schema.org/Neurological",
    ],
    availableService: {
      "@type": "MedicalTherapy",
      name: "Peripheral Nerve Stimulation (PNS)",
      description:
        "A minimally invasive and fully reversible procedure that modulates pain signals at the nerve level, designed to reduce chronic joint pain before surgical intervention.",
    },
    areaServed: {
      "@type": "Country",
      name: "United States",
    },
    sameAs: ["https://arcjoint.com"],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HomeExperience />
    </>
  );
}
