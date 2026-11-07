import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Sheet({
  open,
  onOpenChange,
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50">
      <button type="button" aria-label="Fermer le journal" className="absolute inset-0 bg-black/60" onClick={() => onOpenChange(false)} />
      {children}
    </div>
  );
}

export function SheetContent({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      role="dialog"
      className={cn("fixed inset-y-0 right-0 z-50 flex h-full flex-col shadow-2xl", className)}
      {...props}
    >
      {children}
    </div>
  );
}

export function SheetHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("space-y-1 px-4 pb-2 pt-6", className)} {...props} />;
}

export function SheetTitle({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return <h2 className={cn("text-lg font-semibold", className)} {...props} />;
}

export function SheetDescription({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-sm", className)} {...props} />;
}
