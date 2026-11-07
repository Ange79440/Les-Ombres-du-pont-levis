# Les Ombres du Pont-Levis — SPEC

Top-down gothic puzzle/exploration game (French UI). No auth.

## Flow
Title (`/`) → 3 save slots (new game with name / continue / delete) → `/jeu/:slot`.
Scenes: path → house → drawbridge → hall → alchemy / astronomy → crypt (victory).
Controls: ZQSD/WASD/arrows move, E/Enter/Space interact, 1 = infrared goggles, 2 = camera (flash), J = journal. Mobile D-pad below lg.

## Puzzles & solutions (all data in frontend/src/lib/game/scenes.ts)
- Path: souche (2,7) gives infrared; lanterne (11,4) gives camera; borne (14,6) IR reveals 1847; house door (16,3) code **1847**.
- House: fireplace IR → 4; books sequence **Lune, Soleil, Étoile** → 7; portrait camera → 1; clock → 9; chest code **4719** → crank; back door (10,0) needs chest solved.
- Drawbridge: winch (12,5) needs crank; sequence **Gauche,Gauche,Gauche,Droite** → bridge lowered + cinematic; gate (10,1).
- Hall: alchemy door (3,0), astronomy (9,0), crypt (15,0) needs alchemy_mix + astro_dial.
- Alchemy: alembic sequence **Verte, Rouge, Bleue** → fire seal.
- Astronomy: astrolabe code **375** → star seal.
- Crypt: sarcophagus answer **echo** (accents ignored) → victory, completed=true.
Puzzle ids: path_door, house_books, house_chest, bridge_winch, alchemy_mix, astro_dial, crypt_epitaph.

## Data model (Mongo `saves`, unique on slot)
SaveGame {slot 1-3, player_name, scene, x, y, inventory[], solved[], clues[{id,title,text,scene}], drawbridge_lowered, completed, updated_at}
API: GET /api/saves, GET/PUT/DELETE /api/saves/{slot}. Autosave on scene change / puzzle / item; manual save button. localStorage mirror fallback.
