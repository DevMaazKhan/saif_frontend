import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { Loading } from "./loading";
import { useLoadingContext } from "@/contexts/LoadingContext";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        destructive_outline: "border border-input bg-transparent shadow-sm hover:bg-accent hover:text-accent-foreground",
        outline: "border border-input bg-transparent shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-7 w-7",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  icon?: React.ReactNode;
  onIconClick?: () => void;
  btnClassNames?: string;
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button";

  const { isLoading } = useLoadingContext();

  return (
    <div className={cn("relative", className)}>
      <Comp
        className={cn(buttonVariants({ variant, size, className: props.btnClassNames }), `${props.icon ? "pr-[30px]" : ""}`)}
        disabled={props.loading ? props.loading : isLoading}
        ref={ref}
        {...props}
      />
      <div
        className={`absolute top-[50%] -translate-y-[50%] right-[10px] cursor-pointer ${props.onIconClick ? "pointer-events-auto" : "pointer-events-none"}`}
        onClick={props.onIconClick ? props.onIconClick : undefined}
      >
        {props.loading ? <Loading loading={props.loading} className="w-[16px] h-[16px]" /> : props.icon ? props.icon : null}
      </div>
    </div>
  );
});
Button.displayName = "Button";

export { Button, buttonVariants };
