import * as React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "default" | "md" | "lg" | "xl";
  text?: string;
  fullScreen?: boolean;
}

const sizeClasses = {
  sm: "size-4",
  default: "size-6",
  md: "size-8",
  lg: "size-10",
  xl: "size-12",
};

export const Spinner = ({
  size = "md",
  text,
  fullScreen = false,
  className,
  ...props
}: SpinnerProps) => {
  const content = (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3",
        fullScreen && "p-6 rounded-2xl bg-white shadow-sm border border-border/50",
        className
      )}
      {...props}
    >
      <Loader2 className={cn("animate-spin text-primary", sizeClasses[size])} />
      {text && (
        <p className="text-sm font-medium text-muted-foreground animate-pulse">
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-slate-50/50">
        {content}
      </div>
    );
  }

  return content;
};

export default Spinner;
