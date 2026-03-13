import type { MetadataRoute } from "next";
import { libraryArticles } from "@/data/library";
import { getAllLocations } from "@/lib/locations";

const BASE_URL = "https://arcjoint.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/locations`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/thank-you`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.2,
    },
  ];

  const libraryRoutes: MetadataRoute.Sitemap = libraryArticles.map((article) => ({
    url: `${BASE_URL}/library/${article.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const locationRoutes: MetadataRoute.Sitemap = getAllLocations().map((location) => ({
    url: `${BASE_URL}/locations/${location.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...libraryRoutes, ...locationRoutes];
}
