import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { libraryArticles } from "@/data/library";

interface LibraryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return libraryArticles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: LibraryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = libraryArticles.find((entry) => entry.slug === slug);

  if (!article) {
    return { title: "Library Article Not Found | ARC" };
  }

  return {
    title: `${article.title} | ARC Library`,
    description: article.description,
  };
}

export default async function LibraryPage({ params }: LibraryPageProps) {
  const { slug } = await params;
  const article = libraryArticles.find((entry) => entry.slug === slug);

  if (!article) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-white px-6 py-16">
      <article className="mx-auto w-full max-w-3xl">
        <Link href="/" className="text-sm text-black/55 underline underline-offset-4">
          Back to experience
        </Link>
        <h1 className="mt-6 text-5xl font-light md:text-7xl">{article.title}</h1>
        <p className="mt-4 text-xl text-black/60">{article.description}</p>

        <div className="mt-10 space-y-5 text-lg leading-relaxed text-black/75">
          {article.body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </article>
    </main>
  );
}
