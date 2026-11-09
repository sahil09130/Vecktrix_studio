import {
  categories,
  services,
  type Category,
  type Service,
  type ServiceGroup,
} from "@/content/services";

export function categoryHref(c: Category | string): string {
  return `/services/${typeof c === "string" ? c : c.slug}`;
}

/** Where a service links: its own site if set, otherwise its page on this site. */
export function serviceHref(s: Service): { href: string; external: boolean } {
  return s.href
    ? { href: s.href, external: /^https?:\/\//.test(s.href) }
    : { href: `/services/${s.category}/${s.slug}`, external: false };
}

/** The service's page on this site (even when it has its own website). */
export function servicePagePath(s: Service): string {
  return `/services/${s.category}/${s.slug}`;
}

export function deliveredBy(group: ServiceGroup): string {
  return group === "KritCuts" ? "KritCuts by Vectrix Studio" : "Vectrix Studio";
}

export function getService(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}

export function getServiceIn(categorySlug: string, slug: string): Service | undefined {
  return services.find((s) => s.category === categorySlug && s.slug === slug);
}

export function getCategory(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

/** Services of one category, in the order they are listed. */
export function servicesInCategory(categorySlug: string): Service[] {
  return services.filter((s) => s.category === categorySlug);
}

/** The category's homepage tiles, in `featured` order. */
export function featuredServices(categorySlug: string): Service[] {
  const c = getCategory(categorySlug);
  if (!c) return [];
  return c.featured.map((slug) => getServiceIn(categorySlug, slug)).filter((s): s is Service => !!s);
}

/** Every category with its services, in category order. */
export function servicesByCategory(): { category: Category; services: Service[] }[] {
  return categories.map((category) => ({
    category,
    services: servicesInCategory(category.slug),
  }));
}

/** Label such as "03.07": category number, then position inside it. */
export function serviceLabel(s: Service): string {
  const cat = getCategory(s.category);
  const i = servicesInCategory(s.category).findIndex((o) => o.slug === s.slug);
  return `${cat?.number ?? "00"}.${String(i + 1).padStart(2, "0")}`;
}
