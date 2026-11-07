import {
  Armchair, BookOpen, Camera, Clock, Cog, Crown, DoorClosed, DoorOpen, Flame, FlaskConical, FlaskRound,
  Gem, Glasses, Image as ImageIcon, Lamp, Landmark, Library, Map as MapIcon, Compass, ScrollText, Shield,
  Signpost, Skull, Star, Telescope, TreeDeciduous, Box, Cross, Vault, KeyRound, Flashlight, Wind, Flag,
  PersonStanding, Sun, Droplets, Church, Footprints, Trees, Sparkles, Hexagon, Key,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { IconKey } from "@/lib/game/scenes";

export const OBJECT_ICONS: Record<IconKey, LucideIcon> = {
  sign: Signpost,
  stump: TreeDeciduous,
  lantern: Lamp,
  rune: Landmark,
  door: DoorClosed,
  fire: Flame,
  books: Library,
  painting: ImageIcon,
  clock: Clock,
  chest: Vault,
  note: ScrollText,
  armchair: Armchair,
  winch: Cog,
  gargoyle: Skull,
  seal: Shield,
  throne: Crown,
  armor: Shield,
  candle: Flame,
  flask: FlaskRound,
  alembic: FlaskConical,
  starmap: MapIcon,
  astrolabe: Compass,
  telescope: Telescope,
  sarcophagus: Box,
  tomb: Cross,
  secret: KeyRound,
  uvlamp: Flashlight,
  vane: Wind,
  banner: Flag,
  statue: PersonStanding,
  sundial: Sun,
  fountain: Droplets,
  mausoleum: Church,
  footprints: Footprints,
  oak: Trees,
  mushrooms: Sparkles,
  altar: Hexagon,
};

export const OPEN_DOOR = DoorOpen;

export const ITEM_ICONS: Record<string, LucideIcon> = {
  infrared: Glasses,
  camera: Camera,
  crank: Cog,
  fire_seal: FlaskConical,
  star_seal: Star,
  treasure: Gem,
  uv: Flashlight,
  graveyard_key: Key,
  crown: Crown,
};

export const JOURNAL_ICON = BookOpen;
