import Link from "next/link";
import { site } from "@/content/site";
import { categories } from "@/content/services";
import { categoryHref } from "@/lib/services";
import { Wordmark } from "./Wordmark";

export function Footer() {
  return (
    <footer className="border-t border-line bg-surface">
      <div className="container-x grid gap-12 py-16 md:grid-cols-[1.4fr_1fr_1.4fr_1fr]">
        <div>
          <Wordmark className="text-2xl" />
          <p className="eyebrow mt-4">{site.parentLine}</p>
          <p className="mt-6 max-w-xs text-sm text-muted">{site.subline}</p>
        </div>

        <nav aria-label="Footer sections">
          <h2 className="eyebrow mb-4">Explore</h2>
          <ul className="space-y-2 text-sm">
            {site.nav.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-fg/80 hover:text-accent">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Footer services">
          <h2 className="eyebrow mb-4">Services</h2>
          <ul className="space-y-2 text-sm">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link href={categoryHref(c)} className="text-fg/80 hover:text-accent">
                  <span className="mr-2 font-mono text-xs text-muted">{c.number}</span>
                  {c.title}
                </Link>
              </li>
            ))}
            <li className="pt-2">
              <Link href="/services" className="text-accent hover:text-fg">
                All services &rarr;
              </Link>
            </li>
          </ul>
        </nav>

        <div>
          <h2 className="eyebrow mb-4">Contact</h2>
          <a
            href={`mailto:${site.email}`}
            className="break-all text-sm text-fg/80 hover:text-accent"
          >
            {site.email}
          </a>
          <p className="mt-1 text-xs text-muted">Placeholder address</p>
          <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm">
            {site.socials.map((s) => (
              <li key={s.label}>
                {s.href ? (
                  <a
                    href={s.href}
                    rel="noopener noreferrer"
                    target="_blank"
                    className="text-fg/80 hover:text-accent"
                  >
                    {s.label}
                  </a>
                ) : (
                  <span className="text-muted" title="Add the URL in content/site.ts">
                    {s.label}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-line">
        <p className="container-x py-6 text-xs text-muted">
          &copy; {new Date().getFullYear()} {site.name}. {site.parentLine}.
        </p>
      </div>
    </footer>
  );
}
