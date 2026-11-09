import type { MetadataRoute } from "next";
import { site } from "@/content/site";
import { categories, services } from "@/content/services";
import { categoryHref, servicePagePath } from "@/lib/services";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: site.url, priority: 1 },
    { url: `${site.url}/services`, priority: 0.9 },
    ...categories.map((c) => ({ url: `${site.url}${categoryHref(c)}`, priority: 0.8 })),
    ...services.map((s) => ({ url: `${site.url}${servicePagePath(s)}`, priority: 0.6 })),
    { url: `${site.url}/partners`, priority: 0.8 },
    { url: `${site.url}/contact`, priority: 0.7 },
  ];
}
