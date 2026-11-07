import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { buttonVariants } from "@/components/ui/button";
import GameBoard from "@/components/game/GameBoard";
import { Hud, JournalSheet, MobileDpad } from "@/components/game/Hud";
import { InspectionDialog, PuzzleDialog } from "@/components/game/Dialogs";
import { DrawbridgeCinematic, VictoryScreen } from "@/components/game/Cinematics";
import { COLS, ITEMS, ROWS, SCENES } from "@/lib/game/scenes";
import type { Interactable, Puzzle } from "@/lib/game/scenes";
import { useSceneAmbience } from "@/lib/game/types";
import type { Clue, Facing, GameState, SaveGame, ToolId } from "@/lib/game/types";
import { Volume2, VolumeX } from "lucide-react";
import { useSave, useSaveMutation } from "@/lib/game/saves";

const DIRS: Record<Facing, [number, number]> = {
  up: [0, -1],
  down: [0, 1],
  left: [-1, 0],
  right:[1, 0],
};

const KEYS: Record<string, Facing> = {
  arrowup: "up", z: "up", w: "up",
  arrowdown: "down", s: "down",
  arrowleft: "left", q: "left", a: "left",
  arrowright: "right", d: "right",
};

function addClue(s: GameState, clue: Clue): GameState {
  return s.clues.some((c) => c.id === clue.id) ? s : { ...s, clues: [...s.clues, clue] };
}

const visibleObjects = (s: GameState) =>
  SCENES[s.scene].objects.filter((o) => !o.hiddenUntil || s.solved.includes(o.hiddenUntil));

function GameSession({ slot, initial }: { slot: number; initial: SaveGame }) {
  const navigate = useNavigate();
  const saveMut = useSaveMutation(slot);
  const [state, setState] = useState<GameState>(initial);
  const stateRef = useRef<GameState>(initial);
  const [facing, setFacing] = useState<Facing>("up");
  const facingRef = useRef<Facing>("up");
  const [step, setStep] = useState(0);
  const [tool, setTool] = useState<ToolId | null>(null);
  const [flashKey, setFlashKey] = useState(0);
  const [inspect, setInspect] = useState<Interactable | null>(null);
  const [puzzleObj, setPuzzleObj] = useState<Interactable | null>(null);
  const [journal, setJournal] = useState(false);
  const [cinematic, setCinematic] = useState(false);
  const [victory, setVictory] = useState<0 | 1 | 2>(0);
  const [muted, setMuted] = useState(false);
  useSceneAmbience(state.scene, muted);

  const lastMove = useRef(0);

  const scene = SCENES[state.scene];
  const blocking = !!inspect || !!puzzleObj || journal || cinematic || victory > 0;
  const blockingRef = useRef(blocking);
  blockingRef.current = blocking;

  const update = useCallback(
    (fn: (s: GameState) => GameState, save = false) => {
      const next = fn(stateRef.current);
      stateRef.current = next;
      setState(next);
      if (save) saveMut.mutate(next);
    },
    [saveMut],
  );

  const meets = useCallback((o: Interactable, s: GameState) => {
    const r = o.requires;
    if (!r) return true;
    return (r.items ?? []).every((i) => s.inventory.includes(i)) && (r.solved ?? []).every((p) => s.solved.includes(p));
  }, []);

  const isOpen = useCallback(
    (o: Interactable) => meets(o, state) && (!o.puzzle || state.solved.includes(o.puzzle.id)),
    [meets, state],
  );

  const goThrough = useCallback(
    (o: Interactable) => {
      const door = o.door!;
      update((s) => ({ ...s, scene: door.to, x: door.x, y: door.y }), true);
      setTool(null);
      toast(SCENES[door.to].name, { description: SCENES[door.to].subtitle });
    },
    [update],
  );

  const interact = useCallback(
    (o: Interactable) => {
      const s = stateRef.current;
      if (!meets(o, s)) {
        toast.error(o.requires!.lockedText);
        return;
      }
      if (o.puzzle && !s.solved.includes(o.puzzle.id)) {
        setPuzzleObj(o);
        return;
      }
      if (o.door) {
        goThrough(o);
        return;
      }
      const t = tool;
      update((cur) => {
        let next = cur;
        if (o.clueTitle) next = addClue(next, { id: o.id, title: o.clueTitle, text: o.text, scene: cur.scene });
        if (t === "infrared" && o.irText)
          next = addClue(next, { id: `${o.id}-ir`, title: `${o.name} (infrarouge)`, text: o.irText, scene: cur.scene });
        if (t === "camera" && o.photoText)
          next = addClue(next, { id: `${o.id}-photo`, title: `${o.name} (photographie)`, text: o.photoText, scene: cur.scene });
        if (t === "uv" && o.uvText)
          next = addClue(next, { id: `${o.id}-uv`, title: `${o.name} (ultraviolet)`, text: o.uvText, scene: cur.scene });
        if (o.grants && !next.inventory.includes(o.grants)) {
          next = { ...next, inventory: [...next.inventory, o.grants] };
          toast.success(`Objet obtenu : ${ITEMS[o.grants].name}`, { description: ITEMS[o.grants].desc });
        }
        return next;
      }, !!o.grants && !s.inventory.includes(o.grants));
      setInspect(o);
    },
    [meets, goThrough, update, tool],
  );

  const solvePuzzle = useCallback(() => {
    const o = puzzleObj;
    if (!o?.puzzle) return;
    const p: Puzzle = o.puzzle;
    update((cur) => {
      let next: GameState = { ...cur, solved: [...cur.solved, p.id] };
      next = addClue(next, { id: p.id, title: p.title, text: p.solvedText, scene: cur.scene });
      if (p.reward?.item && !next.inventory.includes(p.reward.item)) next = { ...next, inventory: [...next.inventory, p.reward.item] };
      if (p.reward?.flag === "drawbridge") next = { ...next, drawbridge_lowered: true };
      if (p.reward?.flag === "victory" || p.reward?.flag === "victory2") next = { ...next, completed: true };
      return next;
    }, true);
    setPuzzleObj(null);
    toast.success("Énigme résolue", { description: p.solvedText });
    if (p.reward?.item) toast.success(`Objet obtenu : ${ITEMS[p.reward.item].name}`);
    if (p.reward?.flag === "drawbridge") setCinematic(true);
    else if (p.reward?.flag === "victory") setVictory(1);
    else if (p.reward?.flag === "victory2") setVictory(2);
    else if (o.door) goThrough(o);
  }, [puzzleObj, update, goThrough]);

  const objectAt = useCallback(
    (x: number, y: number) => visibleObjects(stateRef.current).find((o) => o.x === x && o.y === y) ?? null,
    [],
  );

  const findTarget = useCallback(
    (s: GameState, f: Facing): Interactable | null => {
      const [dx, dy] = DIRS[f];
      const objs = visibleObjects(s);
      const ahead = objs.find((o) => o.x === s.x + dx && o.y === s.y + dy);
      if (ahead) return ahead;
      for (const [ddx, ddy] of Object.values(DIRS)) {
        const o = objs.find((ob) => ob.x === s.x + ddx && ob.y === s.y + ddy);
        if (o) return o;
      }
      return null;
    },
    [],
  );

  const move = useCallback(
    (f: Facing) => {
      if (blockingRef.current) return;
      const now = performance.now();
      if (now - lastMove.current < 115) return;
      lastMove.current = now;
      facingRef.current = f;
      setFacing(f);
      const s = stateRef.current;
      const [dx, dy] = DIRS[f];
      const nx = s.x + dx;
      const ny = s.y + dy;
      if (nx < 0 || ny < 0 || nx >= COLS || ny >= ROWS) return;
      const obj = objectAt(nx, ny);
      if (obj) {
        if (obj.door) interact(obj);
        return;
      }
      const ch = SCENES[s.scene].map[ny][nx];
      const walkable = "gp.rc".includes(ch) || (ch === "b" && s.drawbridge_lowered);
      if (!walkable) return;
      update((cur) => ({ ...cur, x: nx, y: ny }));
      setStep((v) => v + 1);
    },
    [objectAt, interact, update],
  );

  const action = useCallback(() => {
    if (blockingRef.current) return;
    const t = findTarget(stateRef.current, facingRef.current);
    if (t) interact(t);
  }, [findTarget, interact]);

  const toggleTool = useCallback((t: ToolId) => {
    if (!stateRef.current.inventory.includes(t)) {
      toast("Tu ne possèdes pas encore cet outil.");
      return;
    }
    setTool((cur) => {
      const next = cur === t ? null : t;
      if (next === "camera") setFlashKey((k) => k + 1);
      return next;
    });
  }, []);

  const manualSave = useCallback(() => {
    saveMut.mutate(stateRef.current, { onSuccess: () => toast.success("Partie sauvegardée") });
  }, [saveMut]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (blockingRef.current) return;
      if (KEYS[k]) {
        e.preventDefault();
        move(KEYS[k]);
      } else if (k === "e" || k === "enter" || k === " ") {
        e.preventDefault();
        action();
      } else if (k === "1" || k === "&") toggleTool("infrared");
      else if (k === "2" || k === "é") toggleTool("camera");
      else if (k === "3" || k === '"') toggleTool("uv");
      else if (k === "j") setJournal(true);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [move, action, toggleTool]);

  const target = useMemo(() => (blocking ? null : findTarget(state, facing)), [blocking, findTarget, state, facing]);

  return (
    <div className="flex flex-col gap-3">
    <div className="flex justify-end">
      <button
        type="button"
        onClick={() => setMuted((m) => !m)}
        className="flex items-center gap-1.5 rounded-sm border border-[#263043] bg-[#12161F] px-2.5 py-1 text-xs text-[#A29F96] transition-colors hover:border-[#D4AF37]/60 hover:text-[#EDE8DF]"
      >
        {muted ? <VolumeX className="size-3.5 text-[#FF6B6B]" /> : <Volume2 className="size-3.5 text-[#E5C158]" />}
        {muted ? "Son coupé" : "Ambiance sonore activée"}
      </button>
    </div>
      <GameBoard
        scene={scene}
        objects={visibleObjects(state)}
        x={state.x}
        y={state.y}
        facing={facing}
        step={step}
        lowered={state.drawbridge_lowered}
        tool={tool}
        flashKey={flashKey}
        target={target}
        isOpen={isOpen}
      />
      <Hud state={state} tool={tool} onTool={toggleTool} onJournal={() => setJournal(true)} onSave={manualSave} saving={saveMut.isPending} />
      <MobileDpad onMove={move} onAction={action} />
      <p className="hidden text-xs text-[#5d6578] lg:block">
        <span className="font-mono text-[#8F96A3]">ZQSD / WASD / Flèches</span> se déplacer ·{" "}
        <span className="font-mono text-[#8F96A3]">E</span> interagir · <span className="font-mono text-[#8F96A3]">1</span> lunettes IR ·{" "}
        <span className="font-mono text-[#8F96A3]">2</span> appareil photo · <span className="font-mono text-[#8F96A3]">3</span> lampe UV ·{" "}
        <span className="font-mono text-[#8F96A3]">J</span> journal
      </p>

      <InspectionDialog obj={inspect} tool={tool} onClose={() => setInspect(null)} />
<PuzzleDialog puzzle={puzzleObj?.puzzle ?? null} onClose={() => setPuzzleObj(null)} onSolve={solvePuzzle} />

{cinematic && <DrawbridgeCinematic onDone={() => setCinematic(false)} />}
{victory > 0 && (
<VictoryScreen
chapter={victory as 1 | 2}
name={state.player_name}
clues={state.clues.length}
onHome={() => navigate("/")}
onContinue={() => setVictory(0)}
/>
)}

</div>
);
}
export default function Game() {
  const { slot: slotParam } = useParams();
  const slot = Number(slotParam);
  const valid = slot === 1 || slot === 2 || slot === 3;
  const { data, isLoading } = useSave(valid ? slot : 1);

  return (
    <main className="min-h-screen bg-[#090B0E] px-3 py-4 text-[#EDE8DF] sm:px-6 sm:py-6">
      <div className="mx-auto w-full max-w-[1100px]">
        {(!valid || (!isLoading && !data)) && (
          <div data-testid="game-missing-save" className="mt-24 max-w-md">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#D4AF37]">Emplacement vide</p>
            <h1 className="mt-2 font-heading text-4xl tracking-tight">Aucune partie ici.</h1>
            <p className="mt-3 text-[#A29F96]">Commence une nouvelle enquête depuis l'écran titre.</p>
            <Link to="/" data-testid="game-missing-back-link" className={buttonVariants({ className: "mt-6 bg-[#C59B27] text-[#0A0D14] hover:bg-[#E5C158]" })}>
              Écran titre
            </Link>
          </div>
        )}
        {valid && isLoading && <div data-testid="game-loading" className="aspect-[20/12] w-full animate-pulse rounded-md bg-[#12161F]" />}
        {valid && data && <GameSession key={slot} slot={slot} initial={data} />}
      </div>
    </main>
  );
}
