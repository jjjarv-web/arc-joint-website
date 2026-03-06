import type { Metadata } from "next";
import Link from "next/link";
import { getAllLocations } from "@/lib/locations";

export const metadata: Metadata = {
  title: "Locations | ARC",
  description: "Browse ARC locations offering preserve-first joint pain treatment pathways.",
};

export default function LocationsPage() {
  const locations = getAllLocations();

  return (
    <main className="min-h-screen bg-white px-6 py-16">
      <div className="mx-auto w-full max-w-5xl">
        <h1 className="text-5xl font-light md:text-7xl">Locations</h1>
        <p className="mt-4 max-w-2xl text-lg text-black/55">
          ARC locations are ranked on the homepage by ZIP proximity. Browse all locations below.
        </p>

        <ul className="mt-12 grid gap-4">
          {locations.map((location) => (
            <li key={location.id} className="rounded-2xl border border-black/10 p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-2xl">{location.name}</p>
                  <p className="text-black/55">
                    {location.city}, {location.state}
                  </p>
                </div>
                <Link
                  href={`/locations/${location.slug}`}
                  className="rounded-full border border-black/20 px-4 py-2 text-sm"
                >
                  View Location
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
