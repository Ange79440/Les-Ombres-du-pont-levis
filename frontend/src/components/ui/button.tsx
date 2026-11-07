import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Variant = "default" | "outline" | "ghost" | "destructive";

const variants: Record<Variant, string> = {
  default: "bg-[#C59B27] text-[#0A0D14] hover:bg-[#E5C158]",
  outline: "border border-[#2A3245] bg-transparent hover:bg-[#161B26]",
  ghost: "bg-transparent hover:bg-[#1f2636]",
  destructive: "bg-[#7f1d1d] text-white hover:bg-[#991b1b]",
};

export function buttonVariants({
  variant = "default",
  className,
}: { variant?: Variant; className?: string } = {}) {
  return cn(
    "inline-flex items-center justify-center gap-2 rounded-md px-4 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] focus-visible:ring-offset-2 focus-visible:ring-offset-[#090B0E] disabled:pointer-events-none disabled:opacity-50",
    variants[variant],
    className,
  );
}

export function Button({
  variant = "default",
  className,
  type = "button",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return <button type={type} className={buttonVariants({ variant, className })} {...props} />;
}
