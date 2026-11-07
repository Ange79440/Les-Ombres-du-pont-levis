import { motion } from "motion/react";
import { Button } from "@/components/ui/button";

export function DrawbridgeCinematic({ onDone }: { onDone: () => void }) {
  return (
    <motion.div
      data-testid="drawbridge-cinematic"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[60] flex flex-col items-center justify-center gap-8 bg-[#05070A]/95 px-6 backdrop-blur-sm"
    >
      <div className="relative h-[300px] w-full max-w-[460px] [perspective:700px]">
        <div className="absolute inset-x-0 top-0 h-[150px] rounded-t-sm border border-[#263043] bg-[repeating-linear-gradient(0deg,#1b202c_0_18px,#141823_18px_20px),linear-gradient(#1b202c,#1b202c)]">
          <div className="absolute left-1/2 top-6 h-[124px] w-[120px] -translate-x-1/2 rounded-t-[60px] bg-[#05070A] shadow-[inset_0_0_30px_rgba(255,200,120,0.15)]" />
          {[0, 1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="absolute -top-4 h-4 w-8 bg-[#1b202c]" style={{ left: `${i * 15 + 2}%` }} />
          ))}
        </div>
        <div className="moat-shimmer absolute inset-x-0 bottom-0 h-[150px] bg-[#0d1d2b]" />
        <motion.div initial={{ height: 10 }} animate={{ height: 150 }} transition={{ duration: 2.6, ease: "easeInOut", delay: 0.4 }}
          className="absolute left-[calc(50%-62px)] top-[26px] w-[3px] origin-top bg-[repeating-linear-gradient(#8a8f99_0_6px,#3a3f49_6px_9px)]" />
        <motion.div initial={{ height: 10 }} animate={{ height: 150 }} transition={{ duration: 2.6, ease: "easeInOut", delay: 0.4 }}
          className="absolute right-[calc(50%-62px)] top-[26px] w-[3px] origin-top bg-[repeating-linear-gradient(#8a8f99_0_6px,#3a3f49_6px_9px)]" />
        <motion.div
          data-testid="drawbridge-gate-status"
          initial={{ rotateX: -88 }}
          animate={{ rotateX: 0 }}
          transition={{ duration: 2.6, ease: [0.6, 0, 0.3, 1], delay: 0.4 }}
          style={{ transformOrigin: "top center" }}
          className="absolute left-1/2 top-[150px] h-[150px] w-[120px] -translate-x-1/2 border-x-2 border-[#2a1c10] bg-[repeating-linear-gradient(0deg,#5a3f24_0_16px,#3a2716_16px_18px)] shadow-[0_20px_40px_rgba(0,0,0,0.6)]"
        />
      </div>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2.9 }} className="max-w-md text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#D4AF37]">Acte II</p>
        <h2 className="mt-2 font-heading text-3xl tracking-tight text-[#F8F6F0] sm:text-4xl">Le pont-levis s'abaisse</h2>
        <p className="mt-3 text-[#A29F96]">Les chaînes grondent, la brume se déchire. Le château des Valombre t'ouvre enfin ses portes.</p>
        <Button data-testid="drawbridge-enter-button" onClick={onDone} className="mt-6 h-11 bg-[#C59B27] px-8 font-semibold text-[#0A0D14] hover:bg-[#E5C158]">
          Continuer
        </Button>
      </motion.div>
    </motion.div>
  );
}

export function VictoryScreen({
  name,
  clues,
  chapter = 1,
  onHome,
  onContinue,
}: {
  name: string;
  clues: number;
  chapter?: 1 | 2;
  onHome: () => void;
  onContinue?: () => void;
}) {
  return (
    <motion.div
      data-testid="victory-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="fixed inset-0 z-[60] flex items-center bg-[radial-gradient(circle_at_30%_40%,rgba(197,155,39,0.18),#05070A_60%)] px-8 sm:px-20"
    >
      <div className="max-w-xl">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#D4AF37]">
          {chapter === 1 ? "Fin du chapitre I" : "Épilogue"}
        </p>
        <h2 className="mt-3 font-heading text-4xl leading-tight tracking-tight text-[#F8F6F0] sm:text-6xl">
          {chapter === 1 ? `Le Cœur de Valombre est à toi, ${name}.` : `La couronne des druides te reconnaît, ${name}.`}
        </h2>
        <p className="mt-5 text-lg text-[#A29F96]">
          Tu as consigné <span className="text-[#E5C158]">{clues}</span> indices dans ton journal.{" "}
          {chapter === 1
            ? "Mais en reposant le trésor, un déclic résonne : un panneau secret vient de s'ouvrir dans le mur de la crypte…"
            : "La Forêt Interdite se tait enfin. Les ombres des Valombre peuvent reposer en paix."}
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          {onContinue && (
            <Button
              data-testid="victory-continue-button"
              onClick={onContinue}
              className="h-11 bg-[#C59B27] px-8 font-semibold text-[#0A0D14] hover:bg-[#E5C158]"
            >
              {chapter === 1 ? "Examiner le panneau secret" : "Continuer à explorer"}
            </Button>
          )}
          <Button
            data-testid="victory-home-button"
            variant="outline"
            onClick={onHome}
            className="h-11 border-[#263043] bg-transparent px-6 text-[#EDE8DF] hover:bg-[#161B26]"
          >
            Retour à l'écran titre
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
