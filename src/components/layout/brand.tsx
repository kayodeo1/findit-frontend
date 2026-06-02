import Link from "next/link";
import { cn } from "@/lib/utils";

/** The slogan that appears on every page. */
export const SLOGAN = "“Whether you lost it or found it — connect here.”";

/**
 * The L&F logo. A search glyph + the "L&F" wordmark, with an optional
 * tagline ("…connect with your lost item") shown beneath it.
 */
export function Logo({
  href = "/",
  size = "md",
  withTagline = false,
  tone = "dark",
  className,
}: {
  href?: string | null;
  size?: "sm" | "md" | "lg";
  withTagline?: boolean;
  tone?: "dark" | "light";
  className?: string;
}) {
  const icon = {
    sm: "text-[22px]",
    md: "text-[28px]",
    lg: "text-[40px]",
  }[size];
  const word = {
    sm: "text-headline-md",
    md: "text-headline-lg",
    lg: "text-display-lg-mobile",
  }[size];

  const wordColor = tone === "light" ? "text-white" : "text-on-surface";
  const iconColor = tone === "light" ? "text-secondary-fixed" : "text-secondary";

  const inner = (
    <span className="flex flex-col">
      <span className="flex items-center gap-2">
        <span
          className={cn("material-symbols-outlined", icon, iconColor)}
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          travel_explore
        </span>
        <span className={cn("font-headline-lg font-extrabold tracking-tight", word, wordColor)}>
          L&amp;F
        </span>
      </span>
      {withTagline && (
        <span
          className={cn(
            "mt-1 font-label-sm text-label-sm",
            tone === "light" ? "text-white/70" : "text-on-surface-variant",
          )}
        >
          …connect with your lost item
        </span>
      )}
    </span>
  );

  if (href === null) {
    return <div className={cn("inline-flex", className)}>{inner}</div>;
  }
  return (
    <Link href={href} className={cn("inline-flex", className)}>
      {inner}
    </Link>
  );
}

/** Small, italic slogan line — placed on every page. */
export function Slogan({
  tone = "dark",
  className,
}: {
  tone?: "dark" | "light";
  className?: string;
}) {
  return (
    <p
      className={cn(
        "font-label-sm text-label-sm italic",
        tone === "light" ? "text-white/70" : "text-on-surface-variant",
        className,
      )}
    >
      {SLOGAN}
    </p>
  );
}
