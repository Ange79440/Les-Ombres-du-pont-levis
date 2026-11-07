import { Link } from "react-router-dom";
import { ArrowLeft, Save, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Hand } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ITEMS, SCENES, progressPct } from "@/lib/game/scenes";
import type { Facing, GameState, ToolId } from "@/lib/game/types";
import { ITEM_ICONS, JOURNAL_ICON } from "./icons";
import { cn } from "@/lib/utils";

interface HudProps {
  state: GameState;
  tool: ToolId | null;
  onTool: (t: ToolId) => void;
  onJournal: () => void;
  onSave: () => void;
  saving: boolean;
}

export function Hud({ state, tool, onTool, onJournal, onSave, saving }: HudProps) {
  const pct = progressPct(state);
  const tools: { id: ToolId; key: string; label: string }[] = [
    { id: "infrared", key: "1", label: "Activer les lunettes infrarouges" },
    { id: "camera", key: "2", label: "Activer l'appareil photo à flash" },
    { id: "uv", key: "3", label: "Activer la lampe à ultraviolets" },
  ];
  const others = state.inventory.filter((i) => i !== "infrared" && i !== "camera" && i !== "uv");
  return (
    <div data-testid="hud-bar" className="flex flex-wrap items-center gap-3 rounded-md border border-[#263043] bg-[#161B26]/90 p-2.5 backdrop-blur-md">
      <Link
        to="/"
        data-testid="hud-back-title-link"
        aria-label="Retour à l'écran titre"
        className="flex size-11 items-center justify-center rounded-sm text-[#8F96A3] transition-colors duration-150 hover:bg-[#1f2636] hover:text-[#EDE8DF]"
      >
        <ArrowLeft className="size-5" />
      </Link>

      <div className="flex items-center gap-2">
        {tools.map((t) => {
          const owned = state.inventory.includes(t.id);
          const Icon = ITEM_ICONS[t.id];
          const active = tool === t.id;
          return (
            <button
              key={t.id}
              data-testid={`tool-toggle-${t.id}`}
              aria-label={t.label}
              aria-pressed={active}
              disabled={!owned}
              onClick={() => onTool(t.id)}
              className={cn(
                "relative flex size-11 items-center justify-center rounded-sm border transition-[background-color,border-color,box-shadow,transform] duration-200 active:scale-95 disabled:cursor-not-allowed disabled:opacity-30",
                active && t.id === "infrared" && "border-[#E63946] bg-[#2A080C] text-[#FF8F8F] shadow-[0_0_18px_rgba(230,57,70,0.55)]",
                active && t.id === "camera" && "border-[#0EA5E9] bg-[#0c1a26] text-[#E2F4FF] shadow-[0_0_18px_rgba(14,165,233,0.5)]",
                active && t.id === "uv" && "border-[#B44DFF] bg-[#1A0B26] text-[#EBC8FF] shadow-[0_0_18px_rgba(180,77,255,0.55)]",
                !active && "border-[#2A3245] bg-[#0F131C] text-[#EDE8DF] hover:border-[#D4AF37]/60",
              )}
            >
              <Icon className="size-5" />
              <span className="absolute -right-1 -top-1 rounded-sm bg-[#090B0E] px-1 font-mono text-[10px] text-[#8F96A3]">{t.key}</span>
            </button>
          );
        })}
      </div>

      <div className="h-8 w-px bg-[#263043]" />

      <div className="flex min-w-0 flex-1 items-center gap-2" data-testid="inventory-bar">
        {others.length === 0 && <span className="text-xs text-[#5d6578]">Inventaire vide</span>}
        {others.map((id) => {
          const Icon = ITEM_ICONS[id];
          return (
            <div
              key={id}
              data-testid={`inventory-item-slot-${id}`}
              title={ITEMS[id]?.name}
              className="flex size-11 items-center justify-center rounded-sm border border-[#D4AF37]/50 bg-[#1a1608] text-[#E5C158]"
            >
              {Icon && <Icon className="size-5" />}
            </div>
          );
        })}
      </div>

      <div className="hidden items-center gap-2 sm:flex" data-testid="hud-progress">
        <div className="h-1.5 w-24 overflow-hidden rounded-full bg-[#0F131C]">
          <div className="h-full bg-[#C59B27] transition-[width] duration-700" style={{ width: `${pct}%` }} />
        </div>
        <span className="font-mono text-xs text-[#8F96A3]">{pct}%</span>
      </div>

      <Button data-testid="quest-journal-button" variant="outline" onClick={onJournal} className="h-11 border-[#2A3245] bg-[#0F131C] text-[#EDE8DF] hover:border-[#D4AF37]/60 hover:bg-[#161B26]">
        <JOURNAL_ICON className="size-4" /> <span className="hidden sm:inline">Journal</span>
      </Button>
      <Button data-testid="save-game-button" onClick={onSave} disabled={saving} className="h-11 bg-[#C59B27] font-semibold text-[#0A0D14] hover:bg-[#E5C158]">
        <Save className="size-4" /> <span className="hidden sm:inline">{saving ? "…" : "Sauver"}</span>
      </Button>
    </div>
  );
}

export function JournalSheet({ open, onOpenChange, state }: { open: boolean; onOpenChange: (o: boolean) => void; state: GameState }) {
  const clues = [...state.clues].reverse();
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent data-testid="quest-journal-sheet" className="w-full border-l border-[#263043] bg-[#0F131C] text-[#EDE8DF] sm:max-w-md">
        <SheetHeader>
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#D4AF37]">Carnet de {state.player_name}</p>
          <SheetTitle className="font-heading text-3xl tracking-tight text-[#F8F6F0]">Journal d'enquête</SheetTitle>
          <SheetDescription className="text-[#A29F96]">{progressPct(state)}% des énigmes résolues</SheetDescription>
        </SheetHeader>
        <Tabs defaultValue="clues" className="px-4">
          <TabsList className="bg-[#161B26]">
            <TabsTrigger data-testid="journal-tab-clues" value="clues">Indices ({state.clues.length})</TabsTrigger>
            <TabsTrigger data-testid="journal-tab-items" value="items">Objets</TabsTrigger>
          </TabsList>
          <TabsContent value="clues" className="mt-4">
            <div data-testid="journal-clue-list" className="flex max-h-[70vh] flex-col gap-3 overflow-y-auto pr-1">
              {clues.length === 0 && <p className="text-sm text-[#8F96A3]">Aucun indice pour l'instant. Inspecte les objets avec la touche E.</p>}
              {clues.map((c) => (
                <div key={c.id} data-testid={`journal-clue-${c.id}`} className="border-l-2 border-[#D4AF37]/60 pl-3">
                  <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#8F96A3]">{SCENES[c.scene].name}</p>
                  <p className="font-heading text-lg text-[#F5F2EB]">{c.title}</p>
                  <p className="text-sm leading-relaxed text-[#B8B4AA]">{c.text}</p>
                </div>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="items" className="mt-4 flex flex-col gap-3">
            {state.inventory.length === 0 && <p className="text-sm text-[#8F96A3]">Tes poches sont vides.</p>}
            {state.inventory.map((id) => {
              const Icon = ITEM_ICONS[id];
              return (
                <div key={id} data-testid={`journal-item-${id}`} className="flex items-start gap-3 rounded-sm border border-[#263043] bg-[#161B26] p-3">
                  {Icon && <Icon className="mt-0.5 size-5 shrink-0 text-[#E5C158]" />}
                  <div>
                    <p className="font-medium text-[#F5F2EB]">{ITEMS[id]?.name}</p>
                    <p className="text-sm text-[#8F96A3]">{ITEMS[id]?.desc}</p>
                  </div>
                </div>
              );
            })}
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}

export function MobileDpad({ onMove, onAction }: { onMove: (f: Facing) => void; onAction: () => void }) {
  const btn = "flex size-12 items-center justify-center rounded-sm border border-[#2A3245] bg-[#161B26]/90 text-[#EDE8DF] active:scale-95 active:bg-[#1f2636] transition-transform duration-100";
  return (
    <div data-testid="mobile-dpad" className="flex items-center justify-between gap-6 lg:hidden">
      <div className="grid grid-cols-3 grid-rows-3 gap-1">
        <span />
        <button data-testid="dpad-up" aria-label="Haut" className={btn} onClick={() => onMove("up")}><ChevronUp /></button>
        <span />
        <button data-testid="dpad-left" aria-label="Gauche" className={btn} onClick={() => onMove("left")}><ChevronLeft /></button>
        <span />
        <button data-testid="dpad-right" aria-label="Droite" className={btn} onClick={() => onMove("right")}><ChevronRight /></button>
        <span />
        <button data-testid="dpad-down" aria-label="Bas" className={btn} onClick={() => onMove("down")}><ChevronDown /></button>
        <span />
      </div>
      <button data-testid="dpad-action-e" aria-label="Interagir" onClick={onAction} className="flex size-16 items-center justify-center rounded-full border border-[#D4AF37]/70 bg-[#1a1608] font-mono text-lg text-[#E5C158] transition-transform duration-100 active:scale-95">
        <Hand className="size-6" />
      </button>
    </div>
  );
}
