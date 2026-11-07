import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { GameState, SaveGame } from "./types";

// La partie reste dans le navigateur tant que le serveur Mongo n'est pas lancé.
const LS_KEY = (slot: number) => `pontlevis-save-${slot}`;

function readLocal(slot: number): SaveGame | null {
  try {
    const raw = localStorage.getItem(LS_KEY(slot));
    return raw ? (JSON.parse(raw) as SaveGame) : null;
  } catch {
    return null;
  }
}

function writeLocal(save: SaveGame) {
  localStorage.setItem(LS_KEY(save.slot), JSON.stringify(save));
}

export function useSaves() {
  return useQuery({
    queryKey: ["saves"],
    queryFn: async () => [1, 2, 3].map(readLocal).filter((s): s is SaveGame => s !== null),
  });
}

export function useSave(slot: number) {
  return useQuery({
    queryKey: ["save", slot],
    queryFn: async (): Promise<SaveGame | null> => readLocal(slot),
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });
}

export async function persistSave(slot: number, state: GameState): Promise<SaveGame> {
  const local: SaveGame = { ...state, slot, updated_at: new Date().toISOString() };
  writeLocal(local);
  return local;
}

export function useSaveMutation(slot: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (state: GameState) => persistSave(slot, state),
    onSuccess: (saved) => {
      qc.setQueryData(["save", slot], saved);
      qc.invalidateQueries({ queryKey: ["saves"] });
    },
  });
}

export function useDeleteSave() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (slot: number) => {
      localStorage.removeItem(LS_KEY(slot));
      return slot;
    },
    onSuccess: (slot) => {
      qc.removeQueries({ queryKey: ["save", slot] });
      qc.invalidateQueries({ queryKey: ["saves"] });
    },
  });
}
