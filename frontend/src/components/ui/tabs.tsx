import { createContext, useContext, useState, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

const TabsCtx = createContext<{ value: string; set: (value: string) => void }>({
  value: "",
  set: () => undefined,
});

export function Tabs({
  defaultValue,
  className,
  children,
}: {
  defaultValue: string;
  className?: string;
  children: ReactNode;
}) {
  const [value, set] = useState(defaultValue);
  return (
    <TabsCtx.Provider value={{ value, set }}>
      <div className={className}>{children}</div>
    </TabsCtx.Provider>
  );
}

export function TabsList({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn("inline-flex gap-1 rounded-md p-1", className)}>{children}</div>;
}

export function TabsTrigger({
  value,
  className,
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { value: string }) {
  const ctx = useContext(TabsCtx);
  const active = ctx.value === value;
  return (
    <button
      type="button"
      data-state={active ? "active" : "inactive"}
      className={cn(
        "rounded-sm px-3 py-1.5 text-sm transition-colors",
        active ? "bg-[#0F131C] text-[#EDE8DF]" : "text-[#8F96A3]",
        className,
      )}
      onClick={() => ctx.set(value)}
      {...props}
    >
      {children}
    </button>
  );
}

export function TabsContent({
  value,
  className,
  children,
}: {
  value: string;
  className?: string;
  children: ReactNode;
}) {
  const ctx = useContext(TabsCtx);
  if (ctx.value !== value) return null;
  return <div className={className}>{children}</div>;
}
