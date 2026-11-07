import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "flex h-10 w-full rounded-md border border-[#263043] bg-[#090B0E] px-3 text-sm text-[#EDE8DF] outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]",
        className,
      )}
      {...props}
    />
  );
}
