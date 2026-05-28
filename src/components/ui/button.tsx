import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 rounded-full font-label-md text-label-md font-semibold whitespace-nowrap transition-all outline-none cursor-pointer select-none active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-secondary text-on-secondary shadow-lg shadow-secondary/20 hover:opacity-90",
        primary: "bg-primary text-on-primary hover:bg-primary/90",
        outline: "ring-1 ring-outline-variant text-on-surface hover:bg-surface-container-low",
        ghost: "text-on-surface-variant hover:bg-surface-variant/50",
        destructive: "bg-error text-on-error hover:opacity-90",
        subtle: "bg-secondary-container text-on-secondary-container hover:opacity-90",
      },
      size: {
        default: "h-11 px-6",
        sm: "h-9 px-4 text-label-sm",
        lg: "h-13 px-8",
        icon: "size-11",
        "icon-sm": "size-9",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, type = "button", ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  ),
);
Button.displayName = "Button";

export { Button, buttonVariants };
