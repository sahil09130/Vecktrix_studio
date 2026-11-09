/** Small pill marking a service delivered by KritCuts by Vectrix Studio. */
export function KritBadge({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex shrink-0 rounded-full border border-accent px-2 py-0.5 font-mono text-[0.65rem] uppercase tracking-widest text-accent ${className}`}
      title="Delivered by KritCuts by Vectrix Studio"
    >
      KritCuts
    </span>
  );
}
