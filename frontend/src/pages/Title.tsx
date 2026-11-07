import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { SCENES, newGame, progressPct } from "@/lib/game/scenes";
import { useDeleteSave, useSaveMutation, useSaves } from "@/lib/game/saves";
import type { SaveGame } from "@/lib/game/types";

const HERO =
  "https://images.unsplash.com/photo-1514539079130-25950c84af65?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85&w=2000";

function SlotCard({ slot, save, index }: { slot: number; save?: SaveGame; index: number }) {
  const navigate = useNavigate();
  const saveMut = useSaveMutation(slot);
  const del = useDeleteSave();
  const [name, setName] = useState("");
  const [confirm, setConfirm] = useState(false);

  const start = () => {
    const n = name.trim();
    if (!n) return;
    saveMut.mutate(newGame(n), { onSuccess: () => navigate(`/jeu/${slot}`) });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.25 + index * 0.1, duration: 0.5 }}
      data-testid={`save-slot-card-${slot}`}
      className="group relative rounded-md border border-[#263043] bg-[#12161F]/80 p-5 backdrop-blur-md transition-[border-color,transform] duration-300 hover:-translate-y-0.5 hover:border-[#D4AF37]/50"
    >
      <div className="flex items-baseline justify-between">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#8F96A3]">Emplacement {["I", "II", "III"][slot - 1]}</p>
        {save && (
          <p className="font-mono text-[11px] text-[#5d6578]" data-testid={`save-slot-date-${slot}`}>
            {format(new Date(save.updated_at), "d MMM, HH:mm", { locale: fr })}
          </p>
        )}
      </div>

      {save ? (
        <>
          <h3 data-testid={`save-slot-name-${slot}`} className="mt-2 font-heading text-2xl tracking-tight text-[#F8F6F0]">{save.player_name}</h3>
          <p className="text-sm text-[#A29F96]">{save.completed ? "Enquête achevée" : SCENES[save.scene].name}</p>
          <div className="mt-3 flex items-center gap-2">
            <div className="h-1 flex-1 overflow-hidden rounded-full bg-[#090B0E]">
              <div className="h-full bg-[#C59B27]" style={{ width: `${progressPct(save)}%` }} />
            </div>
            <span data-testid={`save-slot-progress-${slot}`} className="font-mono text-xs text-[#8F96A3]">{progressPct(save)}%</span>
          </div>
          <div className="mt-4 flex gap-2">
            <Button
              data-testid={`save-slot-load-button-${slot}`}
              onClick={() => navigate(`/jeu/${slot}`)}
              className="h-10 flex-1 bg-[#C59B27] font-semibold text-[#0A0D14] hover:bg-[#E5C158]"
            >
              Continuer
            </Button>
            <Button
              data-testid={`save-slot-delete-button-${slot}`}
              variant="ghost"
              aria-label="Effacer la sauvegarde"
              onClick={() => setConfirm(true)}
              className="h-10 text-[#8F96A3] hover:bg-[#2A080C] hover:text-[#FF6B6B]"
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        </>
      ) : (
        <form
          className="mt-3 flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            start();
          }}
        >
          <Input
            data-testid={`new-game-name-input-${slot}`}
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={24}
            placeholder="Nom de l'enquêteur"
            className="h-10 border-[#263043] bg-[#090B0E] text-[#EDE8DF] placeholder:text-[#5d6578] focus-visible:ring-[#D4AF37]"
          />
          <Button
            data-testid={`new-game-button-${slot}`}
            type="submit"
            disabled={!name.trim() || saveMut.isPending}
            className="h-10 bg-[#C59B27] font-semibold text-[#0A0D14] hover:bg-[#E5C158]"
          >
            Nouvelle partie
          </Button>
        </form>
      )}

      <Dialog open={confirm} onOpenChange={setConfirm}>
        <DialogContent className="border border-[#263043] bg-[#0F131C] text-[#F8F6F0]">
          <DialogHeader>
            <DialogTitle className="font-heading text-2xl">Effacer cette partie ?</DialogTitle>
            <DialogDescription className="text-[#A29F96]">L'enquête de {save?.player_name} sera perdue à jamais.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setConfirm(false)} data-testid="delete-cancel-button">Annuler</Button>
            <Button
              data-testid="delete-confirm-button"
              variant="destructive"
              onClick={() =>
                del.mutate(slot, {
                  onSuccess: () => {
                    setConfirm(false);
                    toast("Sauvegarde effacée");
                  },
                })
              }
            >
              Effacer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}

export default function Title() {
  const { data: saves } = useSaves();
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#090B0E] text-[#EDE8DF]">
      <img src={HERO} alt="" className="absolute inset-0 h-full w-full object-cover opacity-60" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(9,11,14,0.7)_0%,rgba(9,11,14,0.95)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(9,11,14,0.95)_0%,rgba(9,11,14,0.4)_60%,rgba(9,11,14,0.85)_100%)]" />
      <div className="mist mist-a" />
      <div className="mist mist-b" />

      <div className="relative z-10 mx-auto grid min-h-screen max-w-7xl items-center gap-12 px-6 py-16 sm:px-10 lg:grid-cols-[1.25fr_1fr] lg:gap-20">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#D4AF37]">Une enquête nocturne</p>
          <h1 data-testid="title-heading" className="mt-4 font-heading text-5xl leading-[0.95] tracking-[-0.03em] text-[#F8F6F0] sm:text-6xl lg:text-7xl">
            Les Ombres
            <br />
            <span className="italic text-[#E5C158]">du Pont-Levis</span>
          </h1>
          <p className="mt-6 max-w-md text-base leading-relaxed text-[#B5B3AC] sm:text-lg">
            Suis le chemin brumeux jusqu'à la demeure des Valombre. Fouille, chausse les lunettes infrarouges, fais crépiter le flash —
            et ouvre le pont-levis du château où d'autres secrets t'attendent.
          </p>
          <div data-testid="controls-guide" className="mt-10 grid max-w-md grid-cols-2 gap-x-6 gap-y-3 text-sm">
            {[
              ["ZQSD · Flèches", "Se déplacer"],
              ["E", "Inspecter / interagir"],
              ["1", "Lunettes infrarouges"],
              ["2", "Appareil photo à flash"],
            ].map(([k, v]) => (
              <div key={k} className="flex items-center gap-3">
                <kbd className="rounded-sm border border-[#263043] bg-[#12161F] px-2 py-1 font-mono text-xs text-[#E5C158]">{k}</kbd>
                <span className="text-[#A29F96]">{v}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <div className="flex flex-col gap-4" data-testid="save-slots-dialog">
          <p className="font-heading text-xl text-[#F8F6F0]">Choisis ton carnet</p>
          {[1, 2, 3].map((slot, i) => (
            <SlotCard key={slot} slot={slot} index={i} save={saves?.find((s) => s.slot === slot)} />
          ))}
        </div>
      </div>
    </main>
  );
}
