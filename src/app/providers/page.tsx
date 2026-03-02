import type { Metadata } from "next";
import Link from "next/link";
import { getAllProviders } from "@/lib/providers";

export const metadata: Metadata = {
  title: "Providers | ARC",
  description: "Browse ARC providers offering preserve-first knee pain treatment pathways.",
};

export default function ProvidersPage() {
  const providers = getAllProviders();

  return (
    <main className="min-h-screen bg-white px-6 py-16">
      <div className="mx-auto w-full max-w-5xl">
        <h1 className="text-5xl font-light md:text-7xl">Providers</h1>
        <p className="mt-4 max-w-2xl text-lg text-black/55">
          ARC providers are ranked on the homepage by ZIP proximity. Browse all providers below.
        </p>

        <ul className="mt-12 grid gap-4">
          {providers.map((provider) => (
            <li key={provider.id} className="rounded-2xl border border-black/10 p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-2xl">{provider.name}</p>
                  <p className="text-black/55">
                    {provider.city}, {provider.state}
                  </p>
                </div>
                <Link
                  href={`/providers/${provider.slug}`}
                  className="rounded-full border border-black/20 px-4 py-2 text-sm"
                >
                  View Provider
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
