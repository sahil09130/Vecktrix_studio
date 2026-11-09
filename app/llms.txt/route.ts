import { site } from "@/content/site";
import { categoryHref, deliveredBy, serviceHref, servicesByCategory } from "@/lib/services";

export const dynamic = "force-static";

export function GET() {
  const lines = [
    `# ${site.name}`,
    "",
    `> ${site.description}`,
    "",
    `${site.name} is the client-facing studio of ${site.parentName}, a technology, AI and digital solutions company. This website is the hub: each service below has (or will have) its own website under the ${site.name} brand.`,
    "",
    "Every service in the Creative & Content Production practice (video, motion, 3D, photography and design) is delivered by KritCuts, written as \"KritCuts by Vectrix Studio\". KritCuts has its own name and website. All other services are delivered by Vectrix Studio.",
    "",
    `- [All services](${site.url}/services)`,
    "",
    "## Services",
    "",
    ...servicesByCategory().flatMap(({ category, services }) => [
      `### ${category.number}. ${category.title}`,
      "",
      `${category.intro} [All ${category.title} services](${site.url}${categoryHref(category)})`,
      "",
      ...services.map((s) => {
        const { href } = serviceHref(s);
        const url = href.startsWith("http") ? href : `${site.url}${href}`;
        return `- [${s.name}](${url}): ${s.description} Delivered by ${deliveredBy(s.group)}.`;
      }),
      "",
    ]),
    "",
    "## Contact",
    "",
    `- [Start a project](${site.url}/contact)`,
    `- Email: ${site.email}`,
    "",
  ];
  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
