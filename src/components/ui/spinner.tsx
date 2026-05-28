import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function Spinner({ className }: { className?: string }) {
  return <Loader2 className={cn("size-5 animate-spin text-secondary", className)} />;
}

export function PageLoader({ label = "Loading…" }: { label?: string }) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 text-on-surface-variant">
      <Spinner className="size-8" />
      <p className="font-body-md text-body-md">{label}</p>
    </div>
  );
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-lg bg-surface-container-low/50 py-16 text-center">
      {icon && <div className="text-outline">{icon}</div>}
      <div>
        <h3 className="font-headline-md text-headline-md font-semibold text-on-surface">{title}</h3>
        {description && (
          <p className="mt-1 font-body-md text-body-md text-on-surface-variant">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}
