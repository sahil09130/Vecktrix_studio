import { site } from "@/content/site";

export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-2 font-display text-lg font-bold tracking-tight ${className}`}
    >
      <span aria-hidden="true" className="h-2.5 w-2.5 rotate-45 bg-accent" />
      <span>
        {site.parentName} <span className="font-medium text-muted">Studio</span>
      </span>
      <span className="sr-only">{site.name}</span>
    </span>
  );
}
