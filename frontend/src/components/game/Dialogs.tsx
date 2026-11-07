import { useState } from "react";
import { Camera, Eye, Flashlight, RotateCcw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { normalize } from "@/lib/game/scenes";
import type { Interactable, Puzzle } from "@/lib/game/scenes";
import type { ToolId } from "@/lib/game/types";

const panel = "border border-[#D4AF37]/40 bg-[#0F131C] text-[#F8F6F0] shadow-[0_24px_80px_rgba(0,0,0,0.55)]";

export function InspectionDialog({
  obj,
  tool,
  onClose,
}: {
  obj: Interactable | null;
  tool: ToolId | null;
  onClose: () => void;
}) {
  const secret =
    obj && tool === "infrared" && obj.irText
      ? obj.irText
      : obj && tool === "camera" && obj.photoText
        ? obj.photoText
        : obj && tool === "uv" && obj.uvText
          ? obj.uvText
          : null;
  const hidden = Boolean(obj && (obj.irText || obj.photoText || obj.uvText) && !secret);

  return (
    <Dialog open={!!obj} onOpenChange={(open) => !open && onClose()}>
      <DialogContent data-testid="inspection-dialog" className={panel}>
        <DialogHeader>
          <DialogTitle data-testid="inspection-title" className="font-heading text-3xl">{obj?.name}</DialogTitle>
          <DialogDescription data-testid="inspection-description" className="text-base leading-relaxed text-[#D9C7A7]">
            {obj?.text}
          </DialogDescription>
        </DialogHeader>
        {secret && (
          <div className={`mt-4 border-l-2 pl-3 ${tool === "uv" ? "border-[#B44DFF]" : "border-[#FF4444]"}`}>
            <Badge data-testid="inspection-clue-badge" className="mb-2">
              {tool === "infrared" ? (
                <Eye className="mr-1 size-3" />
              ) : tool === "camera" ? (
                <Camera className="mr-1 size-3" />
              ) : (
                <Flashlight className="mr-1 size-3" />
              )}
              {tool === "infrared" ? "Trace thermique" : tool === "camera" ? "Encre sympathique" : "Lumière ultraviolette"}
            </Badge>
            <p className={tool === "infrared" ? "text-[#FF8F8F]" : tool === "camera" ? "text-[#38BDF8]" : "text-[#EBC8FF]"}>
              {secret}
            </p>
          </div>
        )}
        {hidden && (
          <p className="mt-4 text-sm text-[#A29F96]">Quelque chose ici ne se montre qu'à d'autres yeux.</p>
        )}
        <Button data-testid="inspection-close-button" onClick={onClose} className="mt-6 h-11 bg-[#C59B27] font-semibold text-[#0A0D14] hover:bg-[#E5C158]">
          Refermer
        </Button>
      </DialogContent>
    </Dialog>
  );
}

export function PuzzleDialog({
  puzzle,
  onClose,
  onSolve,
}: {
  puzzle: Puzzle | null;
  onClose: () => void;
  onSolve: () => void;
}) {
  const [draft, setDraft] = useState("");
  const [picked, setPicked] = useState<string[]>([]);
  const [error, setError] = useState("");

  const submitCode = () => {
    if (!puzzle || puzzle.kind !== "code") return;
    const accepted = [String(puzzle.answer), ...(puzzle.alt ?? [])].map(normalize);
    if (accepted.includes(normalize(draft))) onSolve();
    else setError("Ce n'est pas la bonne combinaison.");
  };

  const submitSequence = () => {
    if (!puzzle || puzzle.kind !== "sequence" || !Array.isArray(puzzle.answer)) return;
    const ok = picked.length === puzzle.answer.length && picked.every((item, i) => item === puzzle.answer[i]);
    if (ok) onSolve();
    else setError("L'ordre ne répond pas.");
  };

  return (
    <Dialog
      open={!!puzzle}
      onOpenChange={(open) => {
        if (!open) {
          setDraft("");
          setPicked([]);
          setError("");
          onClose();
        }
      }}
    >
      <DialogContent data-testid="code-entry-modal" className={panel}>
        <DialogHeader>
          <DialogTitle className="font-heading text-3xl">{puzzle?.title}</DialogTitle>
          <DialogDescription className="text-base leading-relaxed text-[#D9C7A7]">{puzzle?.prompt}</DialogDescription>
        </DialogHeader>

        {puzzle?.kind === "code" && (
          <form
            className="mt-4 flex gap-2"
            onSubmit={(event) => {
              event.preventDefault();
              submitCode();
            }}
          >
            <Input
              data-testid="code-input-field"
              value={draft}
              placeholder={puzzle.placeholder}
              onChange={(event) => {
                setDraft(event.target.value);
                setError("");
              }}
              autoFocus
            />
            <Button data-testid="code-submit-button" type="submit" className="h-10 bg-[#C59B27] font-semibold text-[#0A0D14]">
              Valider
            </Button>
          </form>
        )}

        {puzzle?.kind === "sequence" && (
          <div className="mt-4">
            <div className="mb-3 flex min-h-10 flex-wrap gap-2">
              {picked.map((item, index) => (
                <Badge key={`${item}-${index}`}>{item}</Badge>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {puzzle.options?.map((option) => (
                <Button
                  key={option}
                  variant="outline"
                  className="h-10 border-[#263043] text-[#EDE8DF]"
                  onClick={() => {
                    setPicked((prev) => [...prev, option]);
                    setError("");
                  }}
                >
                  {option}
                </Button>
              ))}
              <Button
                variant="ghost"
                aria-label="Recommencer la séquence"
                onClick={() => {
                  setPicked([]);
                  setError("");
                }}
              >
                <RotateCcw className="size-4" />
              </Button>
            </div>
            <Button data-testid="code-submit-button" onClick={submitSequence} className="mt-4 h-10 bg-[#C59B27] font-semibold text-[#0A0D14]">
              Valider l'ordre
            </Button>
          </div>
        )}

        {error && (
          <p data-testid="code-feedback-alert" className="mt-3 text-sm text-[#FF6B6B]">
            {error}
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
}
