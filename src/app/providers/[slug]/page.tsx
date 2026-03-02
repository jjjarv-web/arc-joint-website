import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllProviders, getProviderBySlug } from "@/lib/providers";

interface ProviderPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllProviders().map((provider) => ({ slug: provider.slug }));
}

export async function generateMetadata({ params }: ProviderPageProps): Promise<Metadata> {
  const { slug } = await params;
  const provider = getProviderBySlug(slug);

  if (!provider) {
    return {
      title: "Provider Not Found | ARC",
    };
  }

  return {
    title: `${provider.name} | ARC Provider`,
    description: `${provider.name} in ${provider.city}, ${provider.state}. ${provider.description}`,
  };
}

export default async function ProviderPage({ params }: ProviderPageProps) {
  const { slug } = await params;
  const provider = getProviderBySlug(slug);

  if (!provider) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-white px-6 py-16">
      <div className="mx-auto w-full max-w-4xl">
        <Link href="/providers" className="text-sm text-black/55 underline underline-offset-4">
          Back to providers
        </Link>

        <h1 className="mt-5 text-5xl font-light md:text-7xl">{provider.name}</h1>
        <p className="mt-3 text-xl text-black/55">
          {provider.city}, {provider.state} {provider.zip}
        </p>

        <div className="mt-10 rounded-2xl border border-black/10 p-8">
          <p className="text-lg leading-relaxed text-black/75">{provider.description}</p>
          <div className="mt-6 grid gap-3 text-sm text-black/65 md:grid-cols-2">
            <p>Procedure: {provider.procedures.join(", ")}</p>
            <p>Status: {provider.verified ? "Verified" : "Pending verification"}</p>
          </div>
          <a
            href={provider.bookingUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-8 inline-block rounded-full border border-black/20 px-5 py-2"
          >
            Booking link
          </a>
        </div>
      </div>
    </main>
  );
}
