import type { GameState, SceneId } from "./types";

export const COLS = 20;
export const ROWS = 12;

export type IconKey =

  | "sign" | "stump" | "lantern" | "rune" | "door" | "fire" | "books" | "painting" | "clock"
  | "chest" | "note" | "armchair" | "winch" | "gargoyle" | "seal" | "throne" | "armor"
  | "candle" | "flask" | "alembic" | "starmap" | "astrolabe" | "telescope" | "sarcophagus" | "tomb"
  | "secret" | "uvlamp" | "vane" | "banner" | "statue" | "sundial" | "fountain" | "mausoleum" | "footprints"
  | "oak" | "mushrooms" | "altar";

export interface Puzzle {
  id: string;
  kind: "code" | "sequence";
  title: string;
  prompt: string;
  answer: string | string[];
  alt?: string[];
  options?: string[];
  placeholder?: string;
  solvedText: string;
  reward?: { item?: string; flag?: "drawbridge" | "victory" | "victory2" };
}

export interface Interactable {
  id: string;
  x: number;
  y: number;
  name: string;
  icon: IconKey;
  text: string;
  clueTitle?: string;
  irText?: string;
  photoText?: string;
  uvText?: string;
  grants?: string;
  hiddenUntil?: string;
  paid?: boolean;
  requires?: { items?: string[]; solved?: string[]; lockedText: string };
  puzzle?: Puzzle;
  door?: { to: SceneId; x: number; y: number };
}

export interface SceneDef {
  id: SceneId;
  name: string;
  subtitle: string;
  map: string[];
  theme: "outdoor" | "manor" | "castle" | "crypt";
  light: number;
  objects: Interactable[];
}

export const ITEMS: Record<string, { name: string; desc: string }> = {
  infrared: { name: "Lunettes infrarouges", desc: "Révèlent les traces de chaleur et les runes thermiques. Touche 1." },
  camera: { name: "Appareil photo à flash", desc: "Le flash révèle l'encre sympathique. Touche 2." },
  uv: { name: "Lampe à ultraviolets", desc: "Sa lumière violette fait luire les encres fluorescentes. Touche 3." },
  crank: { name: "Manivelle du pont-levis", desc: "Une lourde manivelle de fer forgé, frappée d'un blason." },
  fire_seal: { name: "Sceau du Feu", desc: "Un sceau de cire rouge encore tiède." },
  star_seal: { name: "Sceau des Astres", desc: "Un sceau d'argent constellé d'étoiles." },
  treasure: { name: "Cœur de Valombre", desc: "Le trésor des seigneurs de Valombre." },
  graveyard_key: { name: "Clé du cimetière", desc: "Une clé noire en forme de croix." },
  crown: { name: "Couronne de gui", desc: "La couronne des druides de la Forêt Interdite." },
};

export const SCENES: Record<SceneId, SceneDef> = {
  path: {
    id: "path",
    name: "Le Chemin Brumeux",
    subtitle: "Un sentier oublié mène à la demeure des Valombre",
    theme: "outdoor",
    light: 22,
    map: [
      "tttttttttttttttttttt",
      "tggtgggggtgg########",
      "tgggggtggggg########",
      "tggggggggggg####d###",
      "tgggtggggggggggppggt",
      "tgggggggppppppppgggt",
      "tggtgggpgggtgggggggt",
      "tgggggppggggggtggggt",
      "tggggpgggggggggggtgt",
      "tgtgppggggtggggggggt",
      "tgggpgggggggggtggggt",
      "ttttpttttttttttttttt",
    ],
    objects: [
      {
        id: "path_sign", x: 6, y: 10, name: "Panneau vermoulu", icon: "sign",
        text: "« Demeure des Valombre — 300 pas ». Gravé plus bas, à peine lisible : « Ce qui se cache ne se montre qu'à d'autres yeux. »",
        clueTitle: "Le panneau du chemin",
      },
      {
        id: "path_stump", x: 2, y: 7, name: "Souche creuse", icon: "stump",
        text: "Au creux de la souche, enveloppées dans un linge humide, tu trouves d'étranges lunettes aux verres rouges.",
        grants: "infrared",
      },
      {
        id: "path_lantern", x: 11, y: 4, name: "Lanterne du gardien", icon: "lantern",
        text: "La flamme vacille sans vent. Accroché au crochet de la lanterne pend un vieil appareil photo à soufflet.",
        grants: "camera",
      },
      {
        id: "path_rune", x: 14, y: 6, name: "Borne runique", icon: "rune",
        text: "Une borne de granit couverte de mousse. La pierre est étrangement tiède sous ta main.",
        irText: "Sous les lunettes, des chiffres brûlants apparaissent dans la pierre : 1 · 8 · 4 · 7 — « l'année où la porte s'est tue ».",
        clueTitle: "La borne runique",
      },
      {
        id: "path_house_door", x: 16, y: 3, name: "Porte de la demeure", icon: "door",
        text: "La porte de chêne grince.",
        door: { to: "house", x: 9, y: 10 },
        puzzle: {
          id: "path_door", kind: "code", title: "Serrure à molettes",
          prompt: "Quatre molettes de laiton attendent une année. Laquelle ?",
          answer: "1847", placeholder: "????",
          solvedText: "Les molettes cliquettent. La porte de la demeure s'entrouvre dans un long soupir.",
        },
      },
    ],
  },
  house: {
    id: "house",
    name: "Le Manoir Oublié",
    subtitle: "Quatre secrets dorment entre ces murs",
    theme: "manor",
    light: 30,
    map: [
      "##########d#########",
      "#..................#",
      "#..................#",
      "#....rrrrrrrr......#",
      "#....rrrrrrrr......#",
      "#....rrrrrrrr......#",
      "#..................#",
      "#..................#",
      "#..................#",
      "#..................#",
      "#..................#",
      "#########d##########",
    ],
    objects: [
      {
        id: "house_fireplace", x: 3, y: 1, name: "Cheminée de briques", icon: "fire",
        text: "Les cendres sont froides au toucher… du moins en apparence.",
        irText: "Les braises encore chaudes dessinent un chiffre incandescent : « 4 — le premier ».",
        clueTitle: "Les braises de la cheminée",
      },
      {
        id: "house_painting", x: 7, y: 1, name: "Portrait de l'ancêtre", icon: "painting",
        text: "Le seigneur Aldric de Valombre te fixe d'un regard sévère. La toile semble avoir été retouchée.",
        photoText: "Le flash fait surgir une inscription à l'encre d'argent sur le col : « Mon troisième chiffre est 1 ».",
        clueTitle: "Le portrait d'Aldric",
      },
      {
        id: "house_lectern", x: 16, y: 6, name: "Pupitre et poème", icon: "note",
        text: "« D'abord l'astre de la nuit, puis celui qui le chasse, enfin la poussière du ciel. » — signé A.V.",
        clueTitle: "Le poème du pupitre",
      },
      {
        id: "house_books", x: 14, y: 1, name: "Bibliothèque gothique", icon: "books",
        text: "Derrière les livres, un panneau de bois gravé.",
        puzzle: {
          id: "house_books", kind: "sequence", title: "Les trois grimoires",
          prompt: "Trois grimoires dépassent des rayonnages. Tire-les dans le bon ordre.",
          options: ["Grimoire du Soleil", "Grimoire de l'Étoile", "Grimoire de la Lune"],
          answer: ["Grimoire de la Lune", "Grimoire du Soleil", "Grimoire de l'Étoile"],
          solvedText: "Un déclic. Derrière le grimoire de l'Étoile, gravé dans le bois : « Le deuxième chiffre est 7. »",
        },
      },
      {
        id: "house_clock", x: 18, y: 4, name: "Horloge à balancier", icon: "clock",
        text: "Le balancier est immobile. Les aiguilles sont figées sur IX heures. Une plaque : « Le dernier secret est l'heure où le temps s'arrêta. »",
        clueTitle: "L'horloge figée",
      },
      {
        id: "house_armchair", x: 9, y: 4, name: "Fauteuil élimé", icon: "armchair",
        text: "Le velours est usé jusqu'à la trame. Quelqu'un s'est assis ici récemment.",
        irText: "Une empreinte de chaleur encore vive… et des traces de pas qui mènent vers le coffre.",
      },
      {
        id: "house_chest", x: 2, y: 8, name: "Coffre orné", icon: "chest",
        text: "Le coffre est vide maintenant.",
        puzzle: {
          id: "house_chest", kind: "code", title: "Coffre à combinaison",
          prompt: "Quatre chiffres. Le premier dort dans le feu, le deuxième dans les livres, le troisième sur un visage, le dernier dans le temps.",
          answer: "4719", placeholder: "????",
          solvedText: "Le coffre s'ouvre : à l'intérieur, une lourde manivelle frappée du blason des Valombre. La porte arrière se déverrouille.",
          reward: { item: "crank" },
        },
      },
      {
        id: "house_front_door", x: 9, y: 11, name: "Porte d'entrée", icon: "door",
        text: "Vers le chemin brumeux.",
        door: { to: "path", x: 16, y: 4 },
      },
      {
        id: "house_back_door", x: 10, y: 0, name: "Porte arrière", icon: "door",
        text: "Vers les douves du château.",
        requires: { items: ["crank"], lockedText: "La porte arrière est verrouillée. Il te manque un outil trouvé dans le manoir." },
        door: { to: "drawbridge", x: 9, y: 10 },
      },
    ],
  },
  drawbridge: {
    id: "drawbridge",
    name: "Les Douves de Valombre",
    subtitle: "Le pont-levis dressé barre l'accès à la forteresse",
    theme: "outdoor",
    light: 26,
    map: [
      "#########d##########",
      "#cccccccccccccccccc#",
      "#cccccccccccccccccc#",
      "wwwwwwwwwbbwwwwwwwww",
      "wwwwwwwwwbbwwwwwwwww",
      "wwwwwwwwwbbwwwwwwwww",
      "tggggggggppggggggggt",
      "tggggggggppggggggggt",
      "tggggggggppggggggggt",
      "tggggggggppggggggggt",
      "tggggggggppggggggggt",
      "#########d##########",
    ],
    objects: [
      {
        id: "db_gargoyle_l", x: 6, y: 6, name: "Gargouille de pierre", icon: "gargoyle",
        text: "Une chimère grimaçante veille sur l'eau noire.",
        photoText: "Le flash révèle des runes sur le socle : « L'ombre précède la flamme, et la cendre suit le sang. »",
        clueTitle: "L'inscription de la gargouille",
      },
      {
        id: "db_winch", x: 12, y: 6, name: "Treuil rouillé", icon: "winch",
        text: "Le mécanisme du pont-levis est abaissé et fonctionne.",
        requires: { items: ["crank"], lockedText: "L'axe du treuil est nu. Il te faut une manivelle." },
        puzzle: {
          id: "db_winch", kind: "sequence", title: "Le mécanisme du pont",
          prompt: "Quatre crans bloquent la chaîne. Enclenche-les dans l'ordre dicté par la gargouille.",
          options: ["Cran du Sang", "Cran de la Cendre", "Cran de l'Ombre", "Cran de la Flamme"],
          answer: ["Cran de l'Ombre", "Cran de la Flamme", "Cran du Sang", "Cran de la Cendre"],
          solvedText: "Les chaînes grincent dans un fracas métallique. Le pont-levis s'abaisse lourdement sur les douves !",
          reward: { flag: "drawbridge" },
          },
          },
          {
          id: "db_manor_door", x: 9, y: 11, name: "Retour au manoir", icon: "door",
          text: "Rentrer dans le manoir.",
          door: { to: "house", x: 10, y: 1 },
          },
          {
          id: "db_castle_gate", x: 9, y: 0, name: "Herse du château", icon: "door",
          text: "La grande salle s'ouvre devant toi.",
          requires: { solved: ["db_winch"], lockedText: "Le gouffre des douves t'empêche d'atteindre la grille." },
          door: { to: "hall", x: 9, y: 10 },
          },
          ],
          },
          hall: {
          id: "hall",
          name: "La Grande Salle",
          subtitle: "Deux ailes gardent les sceaux de l'abîme",
          theme: "castle",
          light: 32,
          map: [
          "#########d##########",
          "#cccccccccccccccccc#",
          "#cccccccccccccccccc#",
          "#ccccrrrrrrrrrrcccc#",
          "#ccccrrrrrrrrrrcccc#",
          "dccccrrrrrrrrrrccccd",
          "#ccccrrrrrrrrrrcccc#",
          "#cccccccccccccccccc#",
          "#cccccccccccccccccc#",
          "#cccccccccccccccccc#",
          "#cccccccccccccccccc#",
          "#########d##########",
          ],
          objects: [
          {
          id: "hall_throne", x: 9, y: 2, name: "Trône d'obsidienne", icon: "throne",
          text: "Le siège des seigneurs de Valombre est couvert de poussière.",
          irText: "Une chaleur résiduelle pulse derrière le dossier : « Seuls le Feu et les Astres ouvrent le tombeau. »",
          clueTitle: "Le secret du trône",
          },
          {
          id: "hall_armor", x: 4, y: 2, name: "Armure vide", icon: "armor",
          text: "Un harnois d'acier noirci par les siècles.",
          photoText: "L'éclair du flash fait briller un blason caché sur le plastron : un alambic entouré de trois flammes.",
          },
          {
          id: "hall_door_alchemy", x: 0, y: 5, name: "Porte de l'Aile Est", icon: "door",
          text: "Une odeur de soufre s'échappe de cette porte.",
          door: { to: "alchemy", x: 18, y: 5 },
          },
          {
          id: "hall_door_astronomy", x: 19, y: 5, name: "Porte de l'Observatoire", icon: "door",
          text: "Un courant d'air glacial descend de l'escalier.",
          door: { to: "astronomy", x: 1, y: 5 },
          },
          {
          id: "hall_crypt_door", x: 9, y: 0, name: "Portail de la Crypte", icon: "seal",
          text: "Deux empreintes circulaires sont creusées dans la pierre.",
          requires: {
          items: ["fire_seal", "star_seal"],
          lockedText: "Le portail est scellé par deux encoches : l'une brûlante, l'autre constellée d'étoiles.",
          },
          door: { to: "crypt", x: 9, y: 10 },
          },
          {
          id: "hall_exit", x: 9, y: 11, name: "Sortie vers le pont", icon: "door",
          text: "Retourner vers les douves.",
          door: { to: "drawbridge", x: 9, y: 1 },
          },
          ],
          },
          alchemy: {
          id: "alchemy",
          name: "Le Laboratoire d'Alchimie",
          subtitle: "Les fioles murmurent encore des formules oubliées",
          theme: "castle",
          light: 28,
          map: [
          "####################",
          "#cccccccccccccccccc#",
          "#cccccccccccccccccc#",
          "#cccccccccccccccccc#",
          "#cccccccccccccccccc#",
          "#ccccccccccccccccccd",
          "#cccccccccccccccccc#",
          "#cccccccccccccccccc#",
          "#cccccccccccccccccc#",
          "#cccccccccccccccccc#",
          "#cccccccccccccccccc#",
          "####################",
          ],
          objects: [
          {
          id: "alc_flask", x: 4, y: 2, name: "Fioles colorées", icon: "flask",
          text: "Trois flacons alignés : du soufre jaune, du mercure gris et du cinabre rouge.",
          irText: "Seule la fiole de cinabre rouge dégage une chaleur intense.",
          clueTitle: "La chaleur du cinabre",
          },
          {
          id: "alc_candle", x: 12, y: 8, name: "Grimoire calciné", icon: "candle",
          text: "Les pages sont presque illisibles.",
          photoText: "Le flash révèle la formule : « Le nombre d'or des alchimistes est 739. »",
          clueTitle: "La formule alchimique",
          },
          {
          id: "alc_alembic", x: 8, y: 3, name: "Grand alambic", icon: "alembic",
          text: "L'alambic est refroidi, son réceptacle est vide.",
          puzzle: {
          id: "alc_alembic", kind: "code", title: "Le cadran de distillation",
          prompt: "Réglez la température de transmutation indiquée dans le grimoire calciné.",
          answer: "739", placeholder: "???",
          solvedText: "Une flamme bleue jaillit sous le verre. Au fond de la coupelle se solidifie le Sceau du Feu !",
          reward: { item: "fire_seal" },
          },
          },
          {
          id: "alc_back", x: 19, y: 5, name: "Retour à la Grande Salle", icon: "door",
          text: "Quitter le laboratoire.",
          door: { to: "hall", x: 1, y: 5 },
          },
          ],
          },
          astronomy: {
          id: "astronomy",
          name: "L'Observatoire Céleste",
          subtitle: "La voûte étoilée garde la mémoire des anciens",
          theme: "castle",
          light: 28,
          map: [
          "####################",
          "#cccccccccccccccccc#",
          "#cccccccccccccccccc#",
          "#cccccccccccccccccc#",
          "#cccccccccccccccccc#",
          "dcccccccccccccccccc#",
          "#cccccccccccccccccc#",
          "#cccccccccccccccccc#",
          "#cccccccccccccccccc#",
          "#cccccccccccccccccc#",
          "#cccccccccccccccccc#",
          "####################",
          ],
          objects: [
          {
          id: "ast_telescope", x: 15, y: 2, name: "Longue-vue de cuivre", icon: "telescope",
          text: "Pointée vers une constellation oubliée.",
          photoText: "Une note collée sur l'oculaire apparaît au flash : « Alignez d'abord le Nord, puis l'Est, puis l'Abîme. »",
          clueTitle: "L'alignement céleste",
          },
          {
          id: "ast_starmap", x: 6, y: 8, name: "Carte du ciel", icon: "starmap",
          text: "Une immense carte gravée sur ardoise.",
          irText: "Trois étoiles brillent d'une lueur chaude : l'Étoile Polaire (Nord), Sirius (Est) et l'Étoile Noire (Abîme).",
          },
          {
          id: "ast_astrolabe", x: 10, y: 4, name: "Astrolabe d'argent", icon: "astrolabe",
          text: "Les anneaux d'argent tournent librement.",
          puzzle: {
          id: "ast_astrolabe", kind: "sequence", title: "La sphère armillaire",
          prompt: "Orientez les anneaux de l'astrolabe selon les instructions de la longue-vue.",
          options: ["Anneau de l'Est", "Anneau de l'Abîme", "Anneau du Nord"],
          answer: ["Anneau du Nord", "Anneau de l'Est", "Anneau de l'Abîme"],
          solvedText: "Les anneaux s'emboîtent dans un tintement cristallin, libérant le Sceau des Astres !",
          reward: { item: "star_seal" },
          },
          },
          {
          id: "ast_back", x: 0, y: 5, name: "Retour à la Grande Salle", icon: "door",
          text: "Descendre de l'observatoire.",
          door: { to: "hall", x: 18, y: 5 },
          },
          ],
          },
          crypt: {
          id: "crypt",
          name: "La Crypte des Valombre",
          subtitle: "Le cœur du mystère repose dans le silence éternel",
          theme: "crypt",
          light: 20,
          map: [
          "####################",
          "#cccccccccccccccccc#",
          "#cccccccccccccccccc#",
          "#cccccccccccccccccc#",
          "#cccccccccccccccccc#",
          "#cccccccccccccccccc#",
          "#cccccccccccccccccc#",
          "#cccccccccccccccccc#",
          "#cccccccccccccccccc#",
          "#cccccccccccccccccc#",
          "#cccccccccccccccccc#",
          "#########d##########",
          ],
          objects: [
          {
          id: "crypt_tomb_l", x: 4, y: 4, name: "Tombeau d'Aldric", icon: "tomb",
          text: "« Ici repose celui qui a scellé l'ombre pour protéger la lumière. »",
          irText: "Sous la pierre froide brûle un mot secret : « VALOMBRE ».",
          clueTitle: "Le nom gravé dans la tombe",
          },
          {
          id: "crypt_sarcophagus", x: 9, y: 3, name: "Sarcophage Royal", icon: "sarcophagus",
          text: "Le couvercle de marbre noir est scellé par un dernier mot de passe.",
          puzzle: {
          id: "crypt_epitaph", kind: "code", title: "Le Dernier Sceau",
          prompt: "Prononcez le nom de la lignée gravé dans la chaleur de la tombe.",
          answer: "VALOMBRE", placeholder: "????????",
          solvedText: "Le couvercle glisse lentement. À l'intérieur brille le Cœur de Valombre… et un panneau secret s'ouvre dans le mur est !",
          reward: { item: "treasure", flag: "victory" },
          },
          },
          {
          id: "crypt_back", x: 9, y: 11, name: "Remonter vers la salle", icon: "door",
          text: "Quitter la crypte.",
          door: { to: "hall", x: 9, y: 1 },
          },
          {
          id: "crypt_secret_panel", x: 16, y: 2, name: "Panneau secret", icon: "secret",
          text: "Un passage dérobé vers les remparts.",
          hiddenUntil: "crypt_epitaph",
          door: { to: "ramparts", x: 1, y: 10 },
          },
          ],
          },
          ramparts: {
          id: "ramparts",
          name: "Les Remparts",
          subtitle: "Chapitre II — le vent souffle sur les créneaux",
          theme: "castle",
          light: 30,
          map: [
          "####################",
          "#cccccccccccccccccc#",
          "#cccccccccccccccccc#",
          "#cc##############cc#",
          "#cc#gggggggggggg#cc#",
          "#cc#gtggggggggtg#cc#",
          "#cc#gggggggggggg#cc#",
          "#cc#gggtggggtggg#cc#",
          "#cc##############cc#",
          "#cccccccccccccccccc#",
          "#cccccccccccccccccc#",
          "#d################d#",
          ],
          objects: [
          {
          id: "ramparts_chest", x: 5, y: 1, name: "Coffre de la sentinelle", icon: "chest",
          text: "Sous une cape moisie, une étrange lampe à verre violet. Une étiquette : « Pour lire ce que la lune a écrit ».",
          grants: "uv",
          },
          {
          id: "ramparts_vane", x: 10, y: 1, name: "Girouette rouillée", icon: "vane",
          text: "La girouette grince et tourne sans cesse, comme affolée.",
          uvText: "Sous la lumière violette, quatre flèches s'allument l'une après l'autre : Ouest · Nord · Est · Sud.",
          clueTitle: "La girouette",
          },
          {
          id: "ramparts_banner", x: 18, y: 5, name: "Bannière déchirée", icon: "banner",
          text: "La bannière des Valombre claque au vent. Brodé dans un coin : « Le jardin ne s'ouvre qu'aux quatre vents ».",
          photoText: "Le flash révèle une ligne cousue de fil d'argent : « Au jardin, le soleil garde la clé des morts ».",
          clueTitle: "La bannière",
          },
          {
          id: "ramparts_spyglass", x: 1, y: 5, name: "Longue-vue", icon: "telescope",
          text: "Au loin, au-delà du jardin et du cimetière, la Forêt Interdite. Une lueur violette vacille entre les arbres.",
          },
          {
          id: "ramparts_back", x: 1, y: 11, name: "Escalier de la crypte", icon: "door",
          text: "", door: { to: "crypt", x: 16, y: 3 },
          },
          {
          id: "ramparts_gate", x: 18, y: 11, name: "Grille du jardin", icon: "door",
          text: "", door: { to: "garden", x: 1, y: 1 },
          puzzle: {
          id: "ramparts_gate", kind: "sequence", title: "La grille des quatre vents",
          prompt: "Quatre leviers gravés d'une rose des vents. Abaisse-les dans le bon ordre.",
          options: ["Nord", "Sud", "Est", "Ouest"],
          answer: ["Ouest", "Nord", "Est", "Sud"],
          solvedText: "Un souffle traverse les remparts. La grille du jardin de buis se lève lentement.",
          },
          },
          ],
          },
          garden: {
          id: "garden",
          name: "Le Jardin de Buis",
          subtitle: "Chapitre II — un labyrinthe de haies",
          theme: "outdoor",
          light: 22,
          map: [
          "hhhhhhhhhhhhhhhhhhhh",
          "dgggghgggggggghggggh",
          "hhhhghghhhhhhghghhgh",
          "hgggggghggggghgggggh",
          "hghhhhhhghhhghhhhhgh",
          "hgggghggggghgggggggh",
          "hhhhghghhhghhhhhhhgh",
          "hgggggghgggggggggggh",
          "hghhhhhhhhhhhhhhhhgh",
          "hgggghgggggggggghggh",
          "hhhhgggggghhhhhgggdh",
          "hhhhhhhhhhhhhhhhhhhh",
          ],
          objects: [
          {
          id: "garden_statue", x: 1, y: 9, name: "Statue de la jardinière", icon: "statue",
          text: "Une jardinière de marbre tient un bouquet de pierre. Ses yeux sont tournés vers le cadran solaire.",
          photoText: "Sur les pétales, le flash fait apparaître : « Rose II · Lys VI · Iris VIII ».",
          clueTitle: "La statue de la jardinière",
          },
          {
          id: "garden_fountain", x: 18, y: 1, name: "Fontaine tarie", icon: "fountain",
          text: "Une vasque couverte de lierre. Une plaque : « Le cadran n'obéit qu'aux fleurs, dans l'ordre où on les nomme ».",
          uvText: "Une phrase fluorescente dégouline dans la vasque : « Les morts répondent à ceux qui marchent ».",
          clueTitle: "La fontaine tarie",
          },
          {
          id: "garden_sundial", x: 10, y: 9, name: "Cadran solaire", icon: "sundial",
          text: "L'ombre du gnomon pointe vers le cimetière.",
          puzzle: {
          id: "garden_sundial", kind: "code", title: "Le cadran des fleurs",
          prompt: "Trois anneaux de bronze gravés de chiffres romains. Que faut-il composer (en chiffres) ?",
          answer: "268", placeholder: "???",
          solvedText: "Le gnomon pivote et libère une clé noire en forme de croix : la clé du cimetière.",
          reward: { item: "graveyard_key" },
          },
          },
          {
          id: "garden_back", x: 0, y: 1, name: "Retour aux remparts", icon: "door",
          text: "", door: { to: "ramparts", x: 18, y: 10 },
          },
          {
          id: "garden_exit", x: 18, y: 10, name: "Portillon du cimetière", icon: "door",
          text: "", door: { to: "cemetery", x: 1, y: 10 },
          requires: { items: ["graveyard_key"], lockedText: "Le portillon est fermé par une serrure en forme de croix." },
          },
          ],
          },
          cemetery: {
          id: "cemetery",
          name: "Le Cimetière des Valombre",
          subtitle: "Chapitre II — ici dorment les ancêtres",
          theme: "crypt",
          light: 20,
          map: [
          "tttttttttttttttttttt",
          "tggggggggggggggggdtt",
          "tgxgxgxggggggxgxgxgt",
          "tggggggggpgggggggggt",
          "tgxgxgxgpppgxgxgxggt",
          "tggggggggpgggggggggt",
          "tgxgxgxggpggxgxgxggt",
          "tggggggggpgggggggggt",
          "tgxgxgxggpggxgxgxggt",
          "tggggggggpgggggggggt",
          "dppppppppppggggggggt",
          "tttttttttttttttttttt",
          ],
          objects: [
          {
          id: "cemetery_footprints", x: 9, y: 6, name: "Sentier boueux", icon: "footprints",
          text: "La boue est piétinée, mais impossible de dire par qui.",
          irText: "Des empreintes chaudes, par centaines, qui tournent en rond autour du mausolée… sans jamais y entrer.",
          clueTitle: "Le sentier boueux",
          },
          {
          id: "cemetery_grave", x: 13, y: 4, name: "Stèle penchée", icon: "tomb",
          text: "« Ci-gît Mathilde, qui marcha toute sa vie sans jamais arriver. »",
          uvText: "Une inscription violette apparaît : « Réponds en un seul mot : ce que tes pieds laissent derrière toi ».",
          clueTitle: "La stèle de Mathilde",
          },
          {
          id: "cemetery_keeper", x: 3, y: 8, name: "Tombe du fossoyeur", icon: "tomb",
          text: "« Le fossoyeur repose ici. Il disait que le mausolée parlait aux promeneurs. »",
          },
          {
          id: "cemetery_mausoleum", x: 9, y: 2, name: "Mausolée", icon: "mausoleum",
          text: "La porte du mausolée est ouverte. Un escalier de racines descend vers la forêt.",
          puzzle: {
          id: "cemetery_riddle", kind: "code", title: "La voix du mausolée",
          prompt: "Une voix glacée murmure : « Plus tu en fais, plus tu en laisses derrière toi. Que suis-je ? »",
          answer: "pas", alt: ["des pas", "les pas", "empreintes", "des empreintes", "les empreintes", "traces", "des traces", "les traces"],
          placeholder: "Ta réponse",
          solvedText: "Le mausolée soupire. La grille nord du cimetière, vers la Forêt Interdite, se déverrouille.",
          },
          },
          {
          id: "cemetery_back", x: 0, y: 10, name: "Retour au jardin", icon: "door",
          text: "", door: { to: "garden", x: 17, y: 10 },
          },
          {
          id: "cemetery_exit", x: 17, y: 1, name: "Grille de la forêt", icon: "door",
          text: "", door: { to: "forest", x: 1, y: 6 },
          requires: { solved: ["cemetery_riddle"], lockedText: "La grille est scellée. Le mausolée semble attendre une réponse." },
          },
          ],
          },
          forest: {
          id: "forest",
          name: "La Forêt Interdite",
          subtitle: "Chapitre II — le cercle des druides",
          theme: "outdoor",
          light: 17,
          map: [
          "tttttttttttttttttttt",
          "tgtggtgggtggtgggtggt",
          "tggggggtgggggggtgggt",
          "tgtgggggggpgggggggtt",
          "tggggtggpppppggtgggt",
          "tggtgggpggggpggggtgt",
          "dpppppppggggpppgggtt",
          "tggtgggpggggpggggggt",
          "tgggggggpppppggtgggt",
          "tgtgtggggggggggggtgt",
          "tggggggtgggtggtggggt",
          "tttttttttttttttttttt",
          ],
          objects: [
          {
          id: "forest_oak", x: 4, y: 2, name: "Vieux chêne", icon: "oak",
          text: "Un chêne immense, son écorce est couverte de mousse.",
          uvText: "Des runes violettes luisent dans l'écorce : « Le premier, roi de la forêt : le Chêne ».",
          clueTitle: "Le vieux chêne",
          },
          {
          id: "forest_ash", x: 15, y: 5, name: "Grand frêne", icon: "oak",
          text: "Un frêne élancé dont les racines plongent profondément.",
          photoText: "Le flash fige une écriture d'argent sur le tronc : « Le deuxième, l'arbre du monde : le Frêne ».",
          clueTitle: "Le grand frêne",
          },
          {
          id: "forest_willow", x: 6, y: 9, name: "Saule pleureur", icon: "oak",
          text: "Ses branches tombent jusqu'au sol comme des larmes.",
          irText: "Une chaleur étrange émane du tronc et forme des mots : « Le dernier, celui qui pleure : le Saule ».",
          clueTitle: "Le saule pleureur",
          },
          {
          id: "forest_mushrooms", x: 16, y: 8, name: "Cercle de champignons", icon: "mushrooms",
          text: "Un cercle parfait de champignons pâles. On raconte qu'il ne faut jamais y entrer.",
          uvText: "Les champignons s'illuminent : « Trois arbres, trois offrandes. L'if est un mensonge ».",
          clueTitle: "Le cercle de champignons",
          },
          {
          id: "forest_altar", x: 10, y: 6, name: "Autel des druides", icon: "altar",
          text: "L'autel est silencieux. La couronne de gui a été emportée.",
          puzzle: {
          id: "forest_altar", kind: "sequence", title: "L'offrande aux trois arbres",
          prompt: "Quatre feuilles sculptées entourent l'autel. Dépose trois offrandes dans le bon ordre.",
          options: ["Saule", "Chêne", "If", "Frêne"],
          answer: ["Chêne", "Frêne", "Saule"],
          solvedText: "Une lumière verte jaillit de l'autel. Sur la pierre apparaît la couronne de gui des anciens druides.",
          reward: { item: "crown", flag: "victory2" },
          },
          },
          {
          id: "forest_back", x: 0, y: 6, name: "Retour au cimetière", icon: "door",
          text: "", door: { to: "cemetery", x: 16, y: 1 },
          },
          ],
          },
          };
          export const CHAPTER2_SCENES: SceneId[] = ["ramparts", "garden", "cemetery", "forest"];
          const puzzlesOf = (ids: SceneId[]) =>
          ids.flatMap((id) => SCENES[id].objects.filter((o) => o.puzzle).map((o) => o.puzzle!.id));
          export const CHAPTER1_PUZZLES = puzzlesOf(["path", "house", "drawbridge", "hall", "alchemy", "astronomy", "crypt"]);
          export const CHAPTER2_PUZZLES = puzzlesOf(CHAPTER2_SCENES);
          export function progressPct(state: Pick<GameState, "solved">): number {
          const all = [...CHAPTER1_PUZZLES, ...CHAPTER2_PUZZLES];
          return Math.round((state.solved.filter((s) => all.includes(s)).length / all.length) * 100);
          }
          export function newGame(playerName: string): GameState {
          return {
          player_name: playerName.trim() || "Enquêteur",
          scene: "path",
          x: 4,
          y: 10,
          inventory: [],
          solved: [],
          clues: [],
          drawbridge_lowered: false,
          completed: false,
          };
          }
          export function normalize(str: string): string {
          return str
          .trim()
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "");
          }