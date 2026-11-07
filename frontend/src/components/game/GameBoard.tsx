import { TreePine } from "lucide-react";
import { COLS, ROWS } from "@/lib/game/scenes";
import type { Interactable, SceneDef } from "@/lib/game/scenes";
import type { Facing, ToolId } from "@/lib/game/types";
import { OBJECT_ICONS, OPEN_DOOR } from "./icons";
import { cn } from "@/lib/utils";

interface Props {
  scene: SceneDef;
  objects: Interactable[];
  x: number;
  y: number;
  facing: Facing;
  step: number;
  lowered: boolean;
  tool: ToolId | null;
  flashKey: number;
  target: Interactable | null;
  isOpen: (o: Interactable) => boolean;
}

const pct = (v: number, total: number) => `${(v / total) * 100}%`;

function tileClass(ch: string, lowered: boolean, sceneId: string): string {
  const outdoors = sceneId === "path" || sceneId === "drawbridge" || sceneId === "garden" || sceneId === "forest";
  const castle = sceneId === "hall" || sceneId === "alchemy" || sceneId === "astronomy" || sceneId === "crypt" || sceneId === "ramparts";
  switch (ch) {
    case "g": return "tile-grass";
    case "t": return "tile-grass";
    case "p": return "tile-path";
    case "#": return outdoors ? "tile-facade" : castle ? "tile-battlement" : "tile-wall";
    case ".": return "tile-wood";
    case "r": return "tile-rug";
    case "c": return "tile-stone";
    case "w": return "tile-water";
    case "b": return lowered ? "tile-bridge" : "tile-water";
    case "d": return outdoors ? "tile-gate" : "tile-doorway";
    case "h": return "tile-hedge";
    case "x": return "tile-grave";
    default: return "tile-wall";
  }
}

function Hero({ facing, step }: { facing: Facing; step: number }) {
  const lanternX = facing === "left" ? 8 : facing === "right" ? 32 : 30;
  const lanternY = facing === "up" ? 14 : 26;
  return (
    <svg viewBox="0 0 40 40" className={cn("h-full w-full drop-shadow-[0_4px_6px_rgba(0,0,0,0.8)]", step % 2 ? "hero-step-a" : "hero-step-b")}>
      <circle cx={lanternX} cy={lanternY} r="9" fill="url(#lanternGlow)" />
      <defs>
        <radialGradient id="lanternGlow">
          <stop offset="0%" stopColor="#FFD27A" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#FFD27A" stopOpacity="0" />
        </radialGradient>
      </defs>
      <path d="M20 6 C12 6 10 14 10 20 L7 35 Q20 39 33 35 L30 20 C30 14 28 6 20 6 Z" fill="#232838" stroke="#D4AF37" strokeWidth="1" />
      {facing !== "up" && (
        <ellipse cx={facing === "left" ? 17 : facing === "right" ? 23 : 20} cy="15" rx="5" ry="5.5" fill="#0A0C12" />
      )}
      {facing !== "up" && (
        <>
          <circle cx={facing === "left" ? 15.5 : facing === "right" ? 21.5 : 18} cy="15" r="0.9" fill="#F5E6B8" />
          <circle cx={facing === "left" ? 18.5 : facing === "right" ? 24.5 : 22} cy="15" r="0.9" fill="#F5E6B8" />
        </>
      )}
      <path d="M13 26 L27 26" stroke="#D4AF37" strokeWidth="0.8" opacity="0.6" />
      <circle cx={lanternX} cy={lanternY} r="2.2" fill="#FFE29A" stroke="#7A5A1A" strokeWidth="0.6" />
    </svg>
  );
}

export default function GameBoard({ scene, objects, x, y, facing, step, lowered, tool, flashKey, target, isOpen }: Props) {
  const cx = ((x + 0.5) / COLS) * 100;
  const cy = ((y + 0.5) / ROWS) * 100;
  return (
    <div
      data-testid="game-canvas"
      className={cn("game-board relative w-full overflow-hidden rounded-md border border-[#263043] bg-black", `theme-${scene.theme}`)}
      style={{ aspectRatio: `${COLS} / ${ROWS}` }}
    >
      <div className={cn("absolute inset-0 transition-[filter] duration-500", tool === "infrared" && "ir-filter", tool === "camera" && "photo-filter", tool === "uv" && "uv-filter")}>
        <div className="grid h-full w-full" style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)`, gridTemplateRows: `repeat(${ROWS}, 1fr)` }}>
          {scene.map.flatMap((row, ry) =>
            row.split("").map((ch, rx) => (
              <div key={`${rx}-${ry}`} className={cn("relative", tileClass(ch, lowered, scene.id))}>
                {ch === "t" && <TreePine className="absolute inset-[6%] h-[88%] w-[88%] text-[#1d3a2a] fill-[#12241a]" strokeWidth={1.4} />}
              </div>
            )),
          )}
        </div>

        {objects.map((o) => {
          const Icon = o.icon === "door" && isOpen(o) ? OPEN_DOOR : OBJECT_ICONS[o.icon];
          return (
            <div
              key={o.id}
              data-testid={`object-${o.id}`}
              title={o.name}
              className="absolute flex items-center justify-center"
              style={{ left: pct(o.x, COLS), top: pct(o.y, ROWS), width: pct(1, COLS), height: pct(1, ROWS) }}
            >
              <div className={cn("object-chip flex h-[82%] w-[82%] items-center justify-center rounded-sm", o.icon === "door" ? "object-door" : o.icon === "secret" ? "object-secret" : "object-prop")}>
                <Icon className="h-[70%] w-[70%]" strokeWidth={1.6} />
              </div>
            </div>
          );
        })}

        <div
          data-testid="player-character"
          data-x={x}
          data-y={y}
          className="absolute z-10 transition-[left,top] duration-[130ms] ease-linear"
          style={{ left: pct(x, COLS), top: pct(y, ROWS), width: pct(1, COLS), height: pct(1, ROWS) }}
        >
          <Hero facing={facing} step={step} />
        </div>
      </div>

      <div
        className="pointer-events-none absolute z-20 transition-[left,top] duration-[130ms] ease-linear"
        style={{
          left: `${cx}%`,
          top: `${cy}%`,
          width: "190%",
          aspectRatio: "1 / 1",
          transform: "translate(-50%, -50%)",
          background: "radial-gradient(circle, rgba(5,6,10,0) 32%, rgba(5,6,10,0.28) 48%, rgba(5,6,10,0.82) 70%)",
        }}
      />

      {tool &&
        objects
          .filter((o) => (tool === "infrared" ? o.irText : tool === "camera" ? o.photoText : o.uvText))
          .map((o) => (
            <div
              key={`mark-${o.id}`}
              data-testid={`hidden-mark-${o.id}`}
              className="pointer-events-none absolute z-30 flex items-center justify-center"
              style={{ left: pct(o.x, COLS), top: pct(o.y, ROWS), width: pct(1, COLS), height: pct(1, ROWS) }}
            >
              <span className={cn("mark-pulse font-mono text-[clamp(10px,1.6cqw,20px)] font-bold", tool === "infrared" ? "text-[#FFF066] [text-shadow:0_0_8px_#FF2A2A,0_0_18px_#FF2A2A]" : tool === "camera" ? "text-[#E2F4FF] [text-shadow:0_0_8px_#38BDF8,0_0_16px_#38BDF8]" : "text-[#F3D9FF] [text-shadow:0_0_8px_#B44DFF,0_0_18px_#B44DFF]")}>
                {tool === "infrared" ? "ᚱ" : tool === "camera" ? "✶" : "☾"}
              </span>
            </div>
          ))}

      {tool === "infrared" && <div className="ir-vignette pointer-events-none absolute inset-0 z-30" />}
      {tool === "camera" && <div className="photo-grain pointer-events-none absolute inset-0 z-30" />}
      {tool === "uv" && <div className="uv-vignette pointer-events-none absolute inset-0 z-30" />}
      {flashKey > 0 && <div key={flashKey} className="camera-flash pointer-events-none absolute inset-0 z-40 bg-white" />}

      {target && (
        <div
          data-testid="interaction-indicator"
          className="pointer-events-none absolute z-40 flex justify-center"
          style={{ left: pct(target.x - 2, COLS), top: pct(target.y - 0.75, ROWS), width: pct(5, COLS) }}
        >
          <span className="hint-bob whitespace-nowrap rounded-sm border border-[#D4AF37]/70 bg-[#0F131C]/90 px-1.5 py-0.5 font-mono text-[10px] text-[#E5C158] sm:text-xs">
            E · {target.name}
          </span>
        </div>
      )}

      <div data-testid="scene-title-badge" className="pointer-events-none absolute left-3 top-3 z-40 rounded-sm border border-[#263043] bg-[#0F131C]/85 px-3 py-1.5 backdrop-blur-sm">
        <p className="font-heading text-sm text-[#EDE8DF] sm:text-base">{scene.name}</p>
        <p className="hidden text-[11px] tracking-wide text-[#A29F96] sm:block">{scene.subtitle}</p>
      </div>
    </div>
  );
}

