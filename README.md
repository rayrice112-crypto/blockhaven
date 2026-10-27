# Blockhaven — current source snapshot

This archive contains the current local game source, including changes that have not been published to the hosted site. The CityRT main-game reconstruction remains unfinished. See `docs/MAIN-GAME-RECONSTRUCTION.md` for the scope, missing features and verification status.

## Run the game

Requires Python 3 and a browser with WebGL support. No npm install or build step is needed.

1. Extract this archive.
2. Open a terminal inside the extracted `blockhaven` folder.
3. Run: `python3 -m http.server 4173 --directory dist`
4. Open: http://127.0.0.1:4173/

City saves live in browser storage for the exact origin you use. To transfer an existing city, export its JSON backup from the running game and import it in the destination browser. Personal browser saves are not included in this source archive.

## Controls and help

The eleven-step guided walkthrough explains the current game. Use the question-mark button or Replay walkthrough in the city menu to replay it. Select a construction tool and choose a block. Drag to pan, right-drag to orbit and scroll to zoom. Touch controls support panning and pinching. Shift-drag paints multiple blocks; Escape returns to exploration and Space pauses.

Homes grow with connected roads, electricity, water and sufficient jobs. Use the city report for taxes, loans, service funding, demand and history. The city menu provides local snapshots and JSON import/export. Graphics settings control quality, lighting and reduced motion.

## Source layout

- `dist/index.html`: game interface
- `dist/style.css`: interface styling
- `dist/game.js`: controls, UI, walkthrough and simulation integration
- `dist/model.mjs`: city data, economy, construction, growth and save validation
- `dist/scene.mjs`: Three.js rendering, procedural buildings, lighting and animations
- `dist/vendor/three.module.js`: locally bundled Three.js 0.170.0
- `dist/vendor/THREE-LICENSE.txt`: bundled dependency license
- `dist/test-render.html`: development renderer verification page
- `tests/model.test.mjs`: model tests
- `docs/`: comparison checklist and recorded test results

## Verification

Run model checks with `node --test tests/model.test.mjs` (requires Node.js).
With the server running, open http://127.0.0.1:4173/test-render.html to run deterministic renderer checks. The latest recorded runs passed 27 model checks and 20 renderer checks; these verify existing features, not complete CityRT parity.

## Implementation and dependencies

The game uses original implementation and procedural assets. No CityRT source, branding or assets are included. Three.js is bundled under its MIT license. There are no runtime CDN dependencies, backend services or API keys required by this snapshot.
