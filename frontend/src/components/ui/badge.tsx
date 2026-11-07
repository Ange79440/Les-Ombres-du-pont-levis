import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Badge({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm border border-[#D4AF37]/50 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-[#E5C158]",
        className,
      )}
      {...props}
    />
  );
}
