import { site } from "@/content/site";
import { categories, type Category, type Service } from "@/content/services";
import { categoryHref, deliveredBy, getCategory, servicePagePath, servicesInCategory } from "@/lib/services";

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${site.url}/#organization`,
    name: site.name,
    url: site.url,
    description: site.description,
    email: site.email,
    parentOrganization: { "@type": "Organization", name: site.parentName },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Services",
      itemListElement: categories.map((c) => ({
        "@type": "OfferCatalog",
        name: c.title,
        url: `${site.url}${categoryHref(c)}`,
      })),
    },
  };
}

export function serviceSchema(s: Service) {
  const page = `${site.url}${servicePagePath(s)}`;
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${page}#service`,
    name: s.name,
    description: s.description,
    serviceType: s.name,
    url: s.href || page,
    provider: {
      "@type": "Organization",
      "@id": `${site.url}/#organization`,
      name: site.name,
    },
    alternateName: deliveredBy(s.group),
    category: getCategory(s.category)?.title,
  };
}

/** A practice page: an OfferCatalog of its services. */
export function categorySchema(c: Category) {
  return {
    "@context": "https://schema.org",
    "@type": "OfferCatalog",
    "@id": `${site.url}${categoryHref(c)}#catalog`,
    name: c.title,
    description: c.intro,
    url: `${site.url}${categoryHref(c)}`,
    provider: { "@type": "Organization", "@id": `${site.url}/#organization`, name: site.name },
    itemListElement: servicesInCategory(c.slug).map((s, i) => ({
      "@type": "Offer",
      position: i + 1,
      itemOffered: { "@type": "Service", name: s.name, url: s.href || `${site.url}${servicePagePath(s)}` },
    })),
  };
}
