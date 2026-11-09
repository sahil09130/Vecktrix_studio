import Link from "next/link";
import type { ComponentProps } from "react";

type Variant = "primary" | "ghost";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-colors duration-200";
const variants: Record<Variant, string> = {
  primary: "bg-accent text-bg hover:bg-fg",
  ghost: "border border-line text-fg hover:border-fg",
};

export function ButtonLink({
  variant = "primary",
  className = "",
  ...props
}: { variant?: Variant } & ComponentProps<typeof Link>) {
  return <Link className={`${base} ${variants[variant]} ${className}`} {...props} />;
}

export function ButtonAnchor({
  variant = "primary",
  className = "",
  ...props
}: { variant?: Variant } & ComponentProps<"a">) {
  return <a className={`${base} ${variants[variant]} ${className}`} {...props} />;
}

export function buttonClass(variant: Variant = "primary") {
  return `${base} ${variants[variant]}`;
}
