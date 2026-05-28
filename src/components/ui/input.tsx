import * as React from "react";
import { cn } from "@/lib/utils";

const fieldClasses =
  "w-full px-5 py-3 rounded-2xl bg-surface-container-low border-0 ring-1 ring-outline-variant focus:ring-2 focus:ring-secondary transition-all outline-none font-body-md text-body-md text-on-surface placeholder:text-outline disabled:opacity-60";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => (
    <input ref={ref} type={type} className={cn(fieldClasses, className)} {...props} />
  ),
);
Input.displayName = "Input";

const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<"textarea">>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(fieldClasses, "min-h-[96px] resize-y rounded-xl", className)}
      {...props}
    />
  ),
);
Textarea.displayName = "Textarea";

const Select = React.forwardRef<HTMLSelectElement, React.ComponentProps<"select">>(
  ({ className, children, ...props }, ref) => (
    <select
      ref={ref}
      className={cn(fieldClasses, "appearance-none cursor-pointer", className)}
      {...props}
    >
      {children}
    </select>
  ),
);
Select.displayName = "Select";

function Label({ className, ...props }: React.ComponentProps<"label">) {
  return (
    <label
      className={cn("font-label-md text-label-md text-on-surface ml-1 block", className)}
      {...props}
    />
  );
}

function Field({
  label,
  children,
  className,
}: {
  label?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("space-y-2", className)}>
      {label && <Label>{label}</Label>}
      {children}
    </div>
  );
}

export { Input, Textarea, Select, Label, Field, fieldClasses };
