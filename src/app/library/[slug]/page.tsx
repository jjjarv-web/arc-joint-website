import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { libraryArticles, getArticleBySlug } from "@/data/library";

interface LibraryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return libraryArticles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: LibraryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    return { title: "Article Not Found | ARC Library" };
  }

  const url = `https://arcjoint.com/library/${article.slug}`;

  return {
    title: article.title,
    description: article.description,
    alternates: { canonical: url },
    openGraph: {
      title: article.title,
      description: article.description,
      url,
      type: "article",
      siteName: "ARC Joint",
    },
    twitter: {
      card: "summary",
      title: article.title,
      description: article.description,
    },
  };
}

export default async function LibraryPage({ params }: LibraryPageProps) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const articleUrl = `https://arcjoint.com/library/${article.slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    url: articleUrl,
    publisher: {
      "@type": "Organization",
      name: "ARC Joint",
      url: "https://arcjoint.com",
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": articleUrl },
    keywords: article.keywords.join(", "),
  };

  return (
    <main className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Dark hero */}
      <section className="bg-[#0d0d0d] px-6 pb-14 pt-16 md:px-10">
        <div className="mx-auto w-full max-w-3xl">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-[13px] text-white/40 transition-colors hover:text-white/70"
          >
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Back to home
          </Link>

          <p className="mt-6 text-[11px] uppercase tracking-[0.26em] text-white/35">
            ARC Library
            <span className="mx-2 text-white/20">·</span>
            <span className="normal-case tracking-normal text-white/25">
              {article.category === "deep-dive" ? "Deep Dive" : "Topic"}
            </span>
          </p>

          <h1 className="mt-3 text-[clamp(36px,6vw,64px)] font-light leading-tight tracking-tight text-white">
            {article.title}
          </h1>

          <p className="mt-4 max-w-xl text-[17px] font-light leading-relaxed text-white/50">
            {article.description}
          </p>
        </div>
      </section>

      {/* Article body */}
      <section className="bg-white px-6 py-14 md:px-10">
        <div className="mx-auto w-full max-w-3xl">
          <div className="space-y-12">
            {article.sections.map((section, i) => (
              <div key={section.heading}>
                {i > 0 && (
                  <div className="mb-12 h-px w-full bg-black/[0.06]" />
                )}
                <h2 className="mb-5 text-[clamp(22px,3vw,28px)] font-light tracking-tight text-black">
                  {section.heading}
                </h2>
                <div className="space-y-4">
                  {section.paragraphs.map((paragraph, j) => (
                    <p
                      key={j}
                      className="text-[16px] font-light leading-relaxed text-black/60"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA strip */}
      <section className="bg-[#f5f5f5] px-6 py-14 md:px-10">
        <div className="mx-auto w-full max-w-3xl text-center">
          <p className="mb-2 text-[10px] uppercase tracking-[0.22em] text-black/35">
            Ready to explore your options?
          </p>
          <p className="mx-auto max-w-md text-[16px] font-light leading-relaxed text-black/50">
            Find an ARC location near you and request an appointment. Insurance is verified before your visit.
          </p>
          <Link
            href="/locations"
            className="mt-6 inline-block rounded-full bg-[#2563EB] px-8 py-3.5 text-[14px] font-medium text-white transition-colors hover:bg-[#1D4ED8] active:bg-[#1E40AF]"
          >
            Find a Location
          </Link>
        </div>
      </section>

    </main>
  );
}
