import * as React from "react";
import { cn } from "@/lib/utils";

type Tone = "neutral" | "info" | "success" | "warning" | "danger" | "emerald";

const TONES: Record<Tone, string> = {
  neutral: "bg-surface-variant text-on-surface-variant",
  info: "bg-blue-100 text-blue-800",
  success: "bg-emerald-100 text-emerald-800",
  emerald: "bg-secondary-container text-on-secondary-container",
  warning: "bg-amber-100 text-amber-800",
  danger: "bg-error-container text-on-error-container",
};

export function Badge({
  tone = "neutral",
  className,
  ...props
}: React.ComponentProps<"span"> & { tone?: Tone }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-3 py-1 font-label-sm text-label-sm font-semibold capitalize",
        TONES[tone],
        className,
      )}
      {...props}
    />
  );
}

const ITEM_STATUS_TONE: Record<string, Tone> = {
  lost: "danger",
  found: "success",
  claimed: "emerald",
};

const CLAIM_STATUS_TONE: Record<string, Tone> = {
  pending: "warning",
  approved: "success",
  rejected: "danger",
};

export function ItemStatusBadge({ status }: { status: string }) {
  const tone = ITEM_STATUS_TONE[status] ?? "neutral";
  return <Badge tone={tone}>{status}</Badge>;
}

export function ClaimStatusBadge({ status }: { status: string }) {
  const tone = CLAIM_STATUS_TONE[status] ?? "neutral";
  return <Badge tone={tone}>{status}</Badge>;
}
