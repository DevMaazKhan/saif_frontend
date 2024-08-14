import * as React from "react";

import { cn } from "@/lib/utils";
import { useAppContext } from "@/contexts/AppContext";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  withIcon?: boolean;
  Icon?: React.ReactNode;
  onIconClick?: () => void;
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, error, ...props }, ref) => {
  const { onContextChange } = useAppContext();

  return (
    <div className="flex flex-col">
      <div className="relative">
        <input
          type={type}
          className={cn(
            "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
            `${props.withIcon ? "pr-[30px]" : "pr-3"}`,
            error ? `border-red-500 focus-visible:ring-red-500 ` : "",
            className
          )}
          ref={ref}
          {...props}
          onFocus={(e) => {
            onContextChange(props.placeholder || "");
            props.onFocus && props.onFocus(e);
          }}
          onBlur={(e) => {
            onContextChange("");
            props.onBlur && props.onBlur(e);
          }}
        />

        <div className="absolute top-[50%] -translate-y-[50%] right-[10px] cursor-pointer" onClick={props.onIconClick ? props.onIconClick : undefined}>
          {props.Icon ? props.Icon : null}
        </div>
      </div>
      <span className="text-red-400 text-xs">{error}</span>
    </div>
  );
});
Input.displayName = "Input";

export { Input };
