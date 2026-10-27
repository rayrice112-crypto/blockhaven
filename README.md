# Blockhaven — version 2 (October 2026)

This is version 2 of Blockhaven. It is the original source plus the work described in "What changed in version 2" below. The CityRT main-game reconstruction is further along but still unfinished. See `docs/MAIN-GAME-RECONSTRUCTION.md` for the scope, the remaining features and the verification status.

## What changed in version 2

- **Growth no longer freezes.** In the old version, New Port stopped at 1,180 residents from day 7 onward. Every home hit a fixed cap, and building ages stopped counting. Now every building ages, and homes, shops, workshops and offices upgrade to level 2 and 3. Upgrades happen automatically when a building is mature, approval is 55% or higher, utilities have headroom, and the building is full or jobs are in demand. You can also upgrade a building yourself from its panel for 60% of its price times its level. In a simulation of New Port, the city grows past 1,400 residents within 10 days and then waits for more water capacity.
- **Utilities work like networks.** Power, water, sewage and garbage now have capacity and demand, measured in MW, K m³ and t/day. Service travels along connected streets, and power also travels along the new power lines. When supply runs short, the blocks furthest from the plants lose service first. Plant output follows the funding slider, and water, sewage and garbage plants need power.
- **New buildings from the CityRT catalog, at the observed prices and capacities.** Utilities: solar farm, CHP plant, water intake, artesian well, waterworks, sewage outfall, small treatment plant, treatment ponds, sewage treatment plant, landfill, recycling center and incinerator. Services: college, library, hospital and post office. Parks: plaza and stadium. Landmarks: parish church and clock belfry. Water intakes and sewage outfalls must be built on the shore.
- **CityRT-style HUD.** It has utility gauges, H/S/I/O demand bars, group tabs on the build menu, 4× speed, green arrows over buildings that are ready to upgrade, and a "Mayor's office" news ticker.
- **Resident requests.** Every 9 days, residents ask for something, such as a park, a clinic or sewage service, with a 12-day deadline. Meeting a request pays $1,500 and raises approval for 10 days. Missing one lowers approval.
- **Fires.** They can be switched off. Buildings without fire-station coverage can catch fire and burn down after 3 days, and the lot keeps its zone. Covered fires are put out the next day. Smoke and flames are drawn in 3D.
- **New look.** Every building now picks its own facade and roof colors. Low and mid-rise lots are drawn as a row of two to four narrow buildings with different heights and roofs, some with dormers. Towers get setbacks or rooftop water tanks. The whole city is drawn in an illustrated style, with ink outlines and flat three-tone shading.
- **Saves.** Version-1 saves, including New Port, still load unchanged. New fields (building level, fire, requests, mood, disaster setting) are optional.

## Run the game

Requires Python 3 and a browser with WebGL support. No npm install or build step is needed.

1. Extract this archive.
2. Open a terminal inside the extracted `blockhaven` folder.
3. Run: `python3 -m http.server 4173 --directory dist`
4. Open: http://127.0.0.1:4173/

City saves live in browser storage for the exact origin you use. To transfer an existing city, export its JSON backup from the running game and import it in the destination browser. Personal browser saves are not included in this source archive.

## Controls and help

The eleven-step guided walkthrough explains the current game. Use the question-mark button or Replay walkthrough in the city menu to replay it. Select a construction tool and choose a block. Drag to pan, right-drag to orbit and scroll to zoom. Touch controls support panning and pinching. Shift-drag paints multiple blocks; Escape returns to exploration and Space pauses.

Homes grow with connected roads, electricity, water and sufficient jobs. Each job supports two residents, so add shops, workshops and offices as the city grows. Watch the utility gauges: a gauge below 100% means demand is higher than capacity. Use the city report for taxes, loans, service funding, demand and history. The city menu provides local snapshots and JSON import/export. Graphics settings control quality, lighting and reduced motion.

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
With the server running, open http://127.0.0.1:4173/test-render.html to run deterministic renderer checks. The latest recorded runs (version 2) passed 39 model checks and 20 renderer checks. The model checks include loading and round-tripping the real New Port save in `tests/new-port.blockhaven.json`. These checks verify the implemented features, not complete CityRT parity.

## Implementation and dependencies

The game uses original implementation and procedural assets. No CityRT source, branding or assets are included. Three.js is bundled under its MIT license. There are no runtime CDN dependencies, backend services or API keys required by this snapshot.
