export interface LibraryArticle {
  slug: string;
  title: string;
  description: string;
  body: string[];
}

export const libraryArticles: LibraryArticle[] = [
  {
    slug: "the-science-of-pns",
    title: "The Science of PNS",
    description: "How peripheral nerve stimulation interrupts pain signaling pathways.",
    body: [
      "Peripheral nerve stimulation targets pain signaling before structural replacement pathways are considered.",
      "ARC uses this preserve-first model to sequence interventions with a focus on function, recovery velocity, and patient preference.",
    ],
  },
  {
    slug: "the-decision-model",
    title: "The Decision Model",
    description: "When to preserve, when to modulate, and when to replace.",
    body: [
      "The ARC model prioritizes preserve and modulate paths before replacement whenever clinically appropriate.",
      "This framework helps patients and clinicians align around the least disruptive effective pathway first.",
    ],
  },
];
