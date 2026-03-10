export interface ArticleSection {
  heading: string;
  paragraphs: string[];
}

export interface LibraryArticle {
  slug: string;
  title: string;
  description: string;
  category: "topic" | "deep-dive";
  keywords: string[];
  sections: ArticleSection[];
}

export const libraryArticles: LibraryArticle[] = [
  // ── Suggested Topics ──────────────────────────────────────
  {
    slug: "am-i-a-candidate",
    title: "Am I a Candidate?",
    description: "Find out if peripheral nerve stimulation is right for your joint pain.",
    category: "topic",
    keywords: ["candidate", "eligible", "qualify", "who", "right for me", "good fit", "criteria"],
    sections: [
      {
        heading: "Who PNS is designed for",
        paragraphs: [
          "Peripheral nerve stimulation (PNS) is designed for people experiencing chronic joint pain who want to explore options before committing to surgery. If you have persistent knee, hip, shoulder, ankle, neck, or lower back pain that hasn't responded fully to physical therapy, injections, or medication, PNS may be a strong next step.",
          "Most candidates are people who still have functional joint anatomy — meaning the joint hasn't deteriorated to the point where replacement is the only remaining option. PNS works by modulating pain signals at the nerve level, so it's most effective when the underlying structure can still be preserved.",
        ],
      },
      {
        heading: "Common candidate profiles",
        paragraphs: [
          "You may be a strong candidate if you experience daily or near-daily joint pain that limits your activity, have tried conservative treatments without lasting relief, or have been told joint replacement is your next option but want to explore alternatives first.",
          "PNS is also relevant for patients who aren't ideal surgical candidates due to age, health conditions, or personal preference. Because the procedure is minimally invasive and fully reversible, the risk profile is significantly lower than surgical intervention.",
        ],
      },
      {
        heading: "Who may not be a fit",
        paragraphs: [
          "PNS is not designed for acute injuries, fractures, or joints with severe structural damage where replacement is clearly indicated. It's also not a substitute for conditions that require immediate surgical intervention.",
          "Your physician will evaluate imaging, pain history, and functional status to determine whether PNS is appropriate. The goal is always to match you with the least disruptive effective treatment.",
        ],
      },
      {
        heading: "What to expect at your first visit",
        paragraphs: [
          "During an initial consultation, your physician will review your medical history, examine the affected joint, and discuss your treatment goals. If PNS is appropriate, they'll explain the procedure, expected outcomes, and timeline.",
          "Insurance verification happens before your visit, so cost surprises are minimized. Most consultations take 30 to 45 minutes.",
        ],
      },
    ],
  },
  {
    slug: "pns-vs-replacement",
    title: "PNS vs Replacement",
    description: "How peripheral nerve stimulation compares to joint replacement surgery.",
    category: "topic",
    keywords: ["replacement", "surgery", "compare", "versus", "alternative", "difference", "knee replacement", "hip replacement"],
    sections: [
      {
        heading: "Two fundamentally different approaches",
        paragraphs: [
          "Joint replacement removes the damaged joint and installs a prosthetic. It's a proven, effective treatment — but it's also irreversible, requires significant recovery time, and carries surgical risks including infection, blood clots, and implant wear.",
          "Peripheral nerve stimulation takes a different approach entirely. Instead of replacing the joint, PNS modulates the pain signals traveling from the joint to the brain. The joint itself is preserved, and the procedure is fully reversible.",
        ],
      },
      {
        heading: "Recovery and downtime",
        paragraphs: [
          "Joint replacement typically requires 6 to 12 weeks of structured rehabilitation, with full recovery often taking 3 to 6 months. During this period, mobility is limited and daily activities are significantly affected.",
          "PNS is an outpatient procedure. Most patients return to normal activities within days, not months. There's no hospital stay, no extended rehabilitation protocol, and no prolonged period of restricted movement.",
        ],
      },
      {
        heading: "Reversibility",
        paragraphs: [
          "This is the most significant distinction. Joint replacement is permanent — once the joint is removed, it cannot be restored. If complications arise or the prosthetic wears out, revision surgery is the only path forward.",
          "PNS is fully reversible. If it doesn't provide adequate relief, or if your condition changes, the device can be removed and you retain all future treatment options, including replacement if needed. You lose nothing by trying PNS first.",
        ],
      },
      {
        heading: "When replacement is the right choice",
        paragraphs: [
          "Replacement remains the gold standard for joints with severe structural deterioration — bone-on-bone arthritis, major deformity, or complete loss of function. In these cases, PNS may not provide sufficient relief because the underlying anatomy is too compromised.",
          "The ARC approach doesn't oppose replacement. It sequences treatment so that less invasive options are explored first, and replacement is reserved for when it's clearly the most appropriate path.",
        ],
      },
      {
        heading: "The preserve-first principle",
        paragraphs: [
          "ARC's philosophy is simple: preserve the natural joint whenever possible. PNS gives patients and physicians an intermediate step between conservative care (therapy, injections) and irreversible surgery. For many patients, that intermediate step is all that's needed.",
        ],
      },
    ],
  },

  {
    slug: "recovery-timeline",
    title: "Recovery Timeline",
    description: "What to expect from day one through full recovery after PNS.",
    category: "topic",
    keywords: ["recovery", "timeline", "healing", "how long", "downtime", "after procedure", "return to activity", "post-procedure"],
    sections: [
      {
        heading: "Day of the procedure",
        paragraphs: [
          "PNS is performed as an outpatient procedure, meaning you go home the same day. The procedure itself typically takes 30 to 60 minutes and is done under local anesthesia with light sedation — no general anesthesia required.",
          "Most patients are alert and mobile shortly after the procedure. You'll receive post-care instructions before leaving, and a follow-up is usually scheduled within the first week.",
        ],
      },
      {
        heading: "The first week",
        paragraphs: [
          "Mild soreness at the insertion site is normal and typically resolves within a few days. Many patients report noticeable pain relief within the first 24 to 48 hours as the stimulation begins modulating nerve signals.",
          "Activity restrictions during this period are minimal. You should avoid heavy lifting and high-impact exercise, but walking, light movement, and daily routines are encouraged.",
        ],
      },
      {
        heading: "Weeks two through four",
        paragraphs: [
          "By the second week, most patients have returned to their normal daily activities. Pain relief typically continues to improve as the body adjusts to stimulation.",
          "Your physician may fine-tune stimulation settings during a follow-up visit to optimize pain relief. This adjustment process is non-invasive and takes only a few minutes.",
        ],
      },
      {
        heading: "Long-term outlook",
        paragraphs: [
          "PNS is designed to provide sustained relief. Patients report continued benefit over months and years, with periodic check-ins to ensure optimal device performance.",
          "Because the procedure preserves the natural joint, your long-term mobility and function are maintained. If your condition changes, your physician can adjust the treatment plan — and because PNS is reversible, all future options remain available.",
        ],
      },
      {
        heading: "Compared to surgical recovery",
        paragraphs: [
          "For context, joint replacement typically requires 6 to 12 weeks of structured rehabilitation before returning to normal activities, and full recovery can take 3 to 6 months. PNS compresses that timeline dramatically — most patients measure recovery in days, not months.",
        ],
      },
    ],
  },
  {
    slug: "success-rates",
    title: "Success Rates",
    description: "Clinical outcomes and what the evidence shows about PNS effectiveness.",
    category: "topic",
    keywords: ["success", "results", "outcomes", "effective", "clinical", "evidence", "studies", "data", "pain relief", "percentage"],
    sections: [
      {
        heading: "What the clinical evidence shows",
        paragraphs: [
          "Peripheral nerve stimulation has been studied in multiple clinical trials and peer-reviewed publications. The evidence consistently demonstrates significant pain reduction in patients with chronic joint pain who have not responded adequately to conservative treatments.",
          "In clinical studies, a substantial majority of PNS patients report meaningful pain relief — typically defined as a 50% or greater reduction in pain scores. Many patients exceed this threshold significantly.",
        ],
      },
      {
        heading: "Measuring success",
        paragraphs: [
          "Success in PNS is measured across several dimensions: pain reduction (using standardized pain scales), functional improvement (ability to perform daily activities), medication reduction, and patient satisfaction.",
          "Pain relief alone doesn't tell the full story. Many patients report improvements in sleep quality, mood, activity levels, and overall quality of life — benefits that compound over time as chronic pain patterns are disrupted.",
        ],
      },
      {
        heading: "Durability of results",
        paragraphs: [
          "One of the most compelling aspects of PNS is the durability of relief. Studies have demonstrated sustained benefits lasting well beyond the initial treatment period, with many patients maintaining significant pain reduction at 12-month and longer follow-ups.",
          "Because PNS addresses pain at the nerve signaling level rather than masking symptoms, the mechanism of relief is fundamentally different from medication or injection-based approaches that tend to diminish over time.",
        ],
      },
      {
        heading: "Who responds best",
        paragraphs: [
          "Patients who tend to see the strongest outcomes are those with chronic joint pain and preserved joint anatomy — meaning the joint structure itself hasn't fully deteriorated. Patients who have tried conservative treatments without lasting relief but aren't yet at the point of needing replacement are the core population.",
          "Your physician will evaluate your specific situation to set realistic expectations. Not every patient responds identically, and honest assessment of likely outcomes is a core part of the ARC approach.",
        ],
      },
      {
        heading: "The low-risk profile",
        paragraphs: [
          "Beyond effectiveness, PNS carries a favorable safety profile. Serious adverse events are rare. The most common side effects are mild and temporary — localized soreness at the insertion site being the most frequently reported. The reversibility of PNS means that even in cases where relief is insufficient, the patient retains all future treatment options.",
        ],
      },
    ],
  },
  {
    slug: "insurance-coverage",
    title: "Insurance Coverage",
    description: "Understanding insurance, Medicare, and out-of-pocket costs for PNS.",
    category: "topic",
    keywords: ["insurance", "coverage", "cost", "Medicare", "pay", "price", "afford", "out of pocket", "copay", "deductible", "covered"],
    sections: [
      {
        heading: "Is PNS covered by insurance?",
        paragraphs: [
          "Yes. Peripheral nerve stimulation is covered by Medicare and most major private insurance plans. PNS has established CPT codes and a growing body of clinical evidence supporting medical necessity, which insurance carriers use to evaluate coverage.",
          "Coverage specifics vary by plan, region, and individual medical history. Your ARC location will verify your insurance benefits before your visit so there are no surprises.",
        ],
      },
      {
        heading: "Medicare coverage",
        paragraphs: [
          "Medicare covers PNS for qualifying patients. The procedure, device, and associated physician services fall under established Medicare billing codes. If you have Medicare, your ARC location can confirm coverage and estimate any out-of-pocket costs during the verification process.",
          "Medicare Advantage plans may have different network and prior authorization requirements. Your location's team handles these details on your behalf.",
        ],
      },
      {
        heading: "Private insurance",
        paragraphs: [
          "Most major private insurers — including Blue Cross Blue Shield, Aetna, UnitedHealthcare, Cigna, and Humana — provide coverage for PNS when medical necessity criteria are met. Your physician's documentation of prior treatments, pain history, and functional impact supports the authorization process.",
          "Prior authorization may be required depending on your plan. The ARC location team manages the authorization process and communicates directly with your insurer.",
        ],
      },
      {
        heading: "What to expect for out-of-pocket costs",
        paragraphs: [
          "Your out-of-pocket cost depends on your specific plan's deductible, copay, and coinsurance structure. For many patients, PNS falls within the range of a standard outpatient procedure copay.",
          "During the insurance verification step — which happens before your visit — your location will provide a clear estimate of any patient responsibility. ARC locations prioritize transparency so you can make informed decisions without financial uncertainty.",
        ],
      },
      {
        heading: "The verification process",
        paragraphs: [
          "When you request an appointment through ARC, insurance verification is one of the first steps. The location's team contacts your insurer, confirms coverage, checks authorization requirements, and communicates your estimated costs — all before you walk through the door.",
          "This process typically takes a few business days. You won't be asked to commit to anything until you understand the financial picture.",
        ],
      },
    ],
  },

  // ── Deep Dives ────────────────────────────────────────────
  {
    slug: "the-science-of-pns",
    title: "The Science of PNS",
    description: "How peripheral nerve stimulation interrupts pain signaling pathways.",
    category: "deep-dive",
    keywords: ["science", "how it works", "mechanism", "neuromodulation", "nerve", "pain signals", "technology", "electrical", "stimulation"],
    sections: [
      {
        heading: "How neuromodulation works",
        paragraphs: [
          "Pain is a signal. When a joint is damaged or inflamed, nerve fibers transmit electrical impulses from the affected area through peripheral nerves, up the spinal cord, and into the brain, where they're interpreted as pain. This signaling pathway is the target of peripheral nerve stimulation.",
          "PNS works by delivering mild electrical impulses to the peripheral nerves near the affected joint. These impulses modulate — essentially interrupt or override — the pain signals before they reach the brain. The joint itself is untouched. The intervention happens entirely at the nerve level.",
        ],
      },
      {
        heading: "The gate control mechanism",
        paragraphs: [
          "The scientific foundation of PNS builds on gate control theory, first proposed in 1965 and refined over decades of neuroscience research. The theory describes how non-painful input can close the \"gates\" to painful input, preventing pain signals from traveling to the central nervous system.",
          "PNS leverages this mechanism by stimulating large-diameter nerve fibers that carry non-painful sensory information. When activated, these fibers inhibit the smaller pain-carrying fibers, effectively reducing the pain signal that reaches the brain.",
        ],
      },
      {
        heading: "Precision targeting",
        paragraphs: [
          "Modern PNS systems use imaging guidance to place leads near the specific peripheral nerves responsible for pain in the affected joint. This precision means stimulation is focused exactly where it's needed — at the knee, hip, shoulder, ankle, spine, or other target area.",
          "The stimulation parameters — frequency, pulse width, and amplitude — are customizable for each patient. Your physician adjusts these settings to optimize relief, and they can be fine-tuned over time as your body responds.",
        ],
      },
      {
        heading: "Why PNS differs from spinal cord stimulation",
        paragraphs: [
          "Spinal cord stimulation (SCS) targets the spinal cord itself and is typically used for diffuse or widespread pain conditions. PNS targets individual peripheral nerves and is designed for localized joint pain.",
          "This distinction matters because peripheral targeting allows for more precise pain relief with fewer systemic effects. PNS is also less invasive than SCS — there's no surgery near the spinal cord, and the risk profile is meaningfully lower.",
        ],
      },
      {
        heading: "The biological response",
        paragraphs: [
          "Beyond the immediate gate control effect, emerging research suggests that sustained peripheral nerve stimulation may induce neuroplastic changes — the nervous system adapts over time, potentially reducing pain sensitivity even when stimulation is paused.",
          "This is an active area of clinical investigation, and it represents one of the most promising aspects of PNS: the potential for the treatment to create lasting changes in how the nervous system processes pain, rather than simply masking symptoms.",
        ],
      },
    ],
  },
  {
    slug: "the-decision-model",
    title: "The Decision Model",
    description: "When to preserve, when to modulate, and when to replace.",
    category: "deep-dive",
    keywords: ["decision", "model", "framework", "preserve", "modulate", "replace", "treatment path", "sequence", "algorithm", "pathway"],
    sections: [
      {
        heading: "The treatment spectrum",
        paragraphs: [
          "Joint pain treatment isn't binary — it's not simply \"live with it\" or \"replace it.\" Between those extremes sits a spectrum of interventions, each appropriate at different stages of joint degeneration and pain severity. The ARC Decision Model maps this spectrum into three clear phases: Preserve, Modulate, and Replace.",
          "The model's core principle is sequencing: start with the least disruptive effective intervention and escalate only when clinically appropriate. This ensures patients aren't jumping to irreversible procedures when a less invasive option could provide meaningful relief.",
        ],
      },
      {
        heading: "Phase 1 — Preserve",
        paragraphs: [
          "The first phase focuses on preserving the natural joint through conservative care: physical therapy, activity modification, anti-inflammatory medication, and targeted injections (corticosteroid or hyaluronic acid). These interventions address inflammation and mechanical stress without altering the joint structure.",
          "For many patients, preserve-phase treatments provide sufficient relief. When they don't — when pain persists despite consistent conservative care — the model advances rather than repeating the same interventions indefinitely.",
        ],
      },
      {
        heading: "Phase 2 — Modulate",
        paragraphs: [
          "The modulate phase introduces peripheral nerve stimulation. Instead of treating the joint itself, PNS targets the pain signaling pathway. This is the critical intermediate step that most traditional treatment models skip entirely.",
          "Modulation is appropriate when conservative care has been insufficient but the joint's structural integrity still supports preservation. The joint anatomy matters here — PNS works best when there's still something worth preserving, and the primary complaint is pain rather than complete structural failure.",
        ],
      },
      {
        heading: "Phase 3 — Replace",
        paragraphs: [
          "Replacement is the final phase, reserved for joints where structural deterioration is severe enough that neither preservation nor modulation can provide adequate relief. Bone-on-bone arthritis, significant deformity, or complete loss of mechanical function are typical indicators.",
          "The ARC model doesn't oppose replacement — it respects it as a powerful intervention and ensures it's deployed at the right time, for the right patient, after less invasive options have been appropriately explored.",
        ],
      },
      {
        heading: "Why sequencing matters",
        paragraphs: [
          "The traditional model often jumps from conservative care directly to replacement, skipping the modulate phase entirely. This means patients who could have found relief through PNS are instead undergoing irreversible surgery.",
          "Sequencing protects patients. If PNS provides sufficient relief, the patient avoids surgery entirely. If it doesn't, the patient still has replacement available — they've lost nothing except a small amount of time. The asymmetry of outcomes heavily favors trying modulation first.",
        ],
      },
      {
        heading: "Shared decision-making",
        paragraphs: [
          "The Decision Model is a framework, not a mandate. Every patient's anatomy, pain profile, lifestyle, and preferences are different. The model provides structure for the conversation between patient and physician, ensuring all options are considered before irreversible steps are taken.",
          "ARC-trained physicians use this framework to guide clinical discussions, present evidence, and align on a treatment path that matches the patient's specific situation and goals.",
        ],
      },
    ],
  },
];

export function getArticleBySlug(slug: string): LibraryArticle | undefined {
  return libraryArticles.find((a) => a.slug === slug);
}

export function searchArticles(query: string): LibraryArticle[] {
  if (!query.trim()) return libraryArticles;
  const lower = query.toLowerCase();
  return libraryArticles.filter(
    (a) =>
      a.title.toLowerCase().includes(lower) ||
      a.description.toLowerCase().includes(lower) ||
      a.keywords.some((k) => k.includes(lower)) ||
      a.sections.some((s) =>
        s.heading.toLowerCase().includes(lower) ||
        s.paragraphs.some((p) => p.toLowerCase().includes(lower))
      )
  );
}
