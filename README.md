# Blockhaven — version 2 (October 2026)

**[▶ Play Blockhaven in your browser](https://rayrice112-crypto.github.io/blockhaven/)** · [Play with the New Port save](https://claude.ai/artifact/GYP8cGaC4gLRKQbPNMqb7e) · [How to play](https://claude.ai/artifact/JaaT58eDNQPTL7zmTxXcCY)

This repository holds the game's source code. Use the link above to play; nothing needs to be installed. The website starts a fresh city, and the New Port link opens Samuel's saved city. The website updates by itself every time the code on `main` changes.

This is version 2 of Blockhaven. It is the original source plus the work described in "What changed in version 2" below. The CityRT main-game reconstruction is further along but still unfinished. See `docs/MAIN-GAME-RECONSTRUCTION.md` for the scope, the remaining features and the verification status.

## What changed in version 2

- **Growth no longer freezes.** In the old version, New Port stopped at 1,180 residents from day 7 onward. Every home hit a fixed cap, and building ages stopped counting. Now every building ages, and homes, shops, workshops and offices upgrade to level 2 and 3. Upgrades happen automatically when a building is mature, approval is 55% or higher, utilities have headroom, and the building is full or jobs are in demand. You can also upgrade a building yourself from its panel for 60% of its price times its level. In a simulation of New Port, the city grows past 1,400 residents within 10 days and then waits for more water capacity.
- **Utilities work like networks.** Power, water, sewage and garbage now have capacity and demand, measured in MW, K m³ and t/day. Service travels along connected streets, and power also travels along the new power lines. When supply runs short, the blocks furthest from the plants lose service first. Plant output follows the funding slider, and water, sewage and garbage plants need power.
- **New buildings from the CityRT catalog, at the observed prices and capacities.** Utilities: solar farm, CHP plant, water intake, artesian well, waterworks, sewage outfall, small treatment plant, treatment ponds, sewage treatment plant, landfill, recycling center and incinerator. Services: college, library, hospital and post office. Parks: plaza and stadium. Landmarks: parish church and clock belfry. Water intakes and sewage outfalls must be built on the shore.
- **CityRT-style HUD.** It has utility gauges, H/S/I/O demand bars, group tabs on the build menu, 4× speed, green arrows over buildings that are ready to upgrade, and a "Mayor's office" news ticker.
- **Resident requests.** Every 9 days, residents ask for something, such as a park, a clinic or sewage service, with a 12-day deadline. Meeting a request pays $1,500 and raises approval for 10 days. Missing one lowers approval.
- **Fires.** They can be switched off. Buildings without fire-station coverage can catch fire and burn down after 3 days, and the lot keeps its zone. Covered fires are put out the next day. Smoke and flames are drawn in 3D.
- **Realistic look.** Buildings are drawn as contemporary architecture in natural daylight. Office towers have glass curtain walls on podiums and reflect the sky. Apartment blocks come in concrete, plaster or brick, some L-shaped or with a setback top floor. Shops have glass storefronts. Flat roofs carry AC units, solar panels or green roofs, streets are lined with trees, and at night some windows light up. Each building picks its own materials, so no two neighbors match.
- **Bigger maps.** New cities can be 32 × 32, 48 × 48 or 64 × 64 blocks (64 is the default), with the starter town in the middle. Saves without a size, including New Port, stay 32 × 32.
- **Camera.** Hold Ctrl (or Cmd) and move the mouse to rotate the city. Right-drag still works.
- **City economy, modeled on Cities: Skylines II.** Every flow of money is a module in `dist/economy.mjs`, and the City report shows each one as its own line. Adding a module there adds it to the budget screen, the daily total and the saves.
  - *Taxes* from 0% to 25%. Residents are split into low, middle and high income by their home's level, and each bracket has its own rate. Shops, industry and offices are taxed separately. High taxes cost approval and push demand down; low taxes pull demand up.
  - *Service fees* for electricity, water and sewage, garbage, healthcare and education, from 0% to 200% of the normal price. Higher fees cost approval.
  - *Trade with neighbors.* Spare power, water, sewage and garbage capacity is sold every day. A shortage can be covered by buying from neighbors at a higher price.
  - *Government subsidy* of up to $250 a day, shrinking as the city grows.
  - *Loans* priced by a credit rating from AAA to CCC. Pick the amount and a 20, 40 or 60-day term, hold up to three, and pay any of them off early without the remaining interest. The original $25,000 emergency loan is still there. A negative treasury pays 0.5% overdraft interest a day.
  - *Policies:* paid street parking, a city lottery, a tourism campaign, a festival program, small business grants, a free trade zone and tech incentives, each with its own cost, income, approval and demand effects.
  - *Money buildings* in a new Economy tab: a hotel (tourism), a cargo harbor on the shore (exports industrial goods), a parking garage (charges for parking near jobs) and a tax office (collects 5% more of every tax).
  - *Budget screen* with income and expenses by line, a 30-day income and expense chart, and a list of income sources the city isn't using yet.
- **Saves.** Version-1 saves, including New Port, still load unchanged. New fields (building level, fire, requests, mood, disaster setting, map size, income tax brackets, fees, policies, trade settings, loans) are optional.

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
- `dist/model.mjs`: city data, construction, growth, utilities and save validation
- `dist/economy.mjs`: the economy registries (taxes, fees, trade, subsidy, loans, policies, money buildings)
- `dist/budget-ui.mjs`: the City report's Budget, Taxes, Fees & trade, Loans and Policies tabs
- `dist/scene.mjs`: Three.js rendering, procedural buildings, lighting and animations
- `dist/vendor/three.module.js`: locally bundled Three.js 0.170.0
- `dist/vendor/THREE-LICENSE.txt`: bundled dependency license
- `dist/test-render.html`: development renderer verification page
- `tests/model.test.mjs`: model tests
- `tests/economy.test.mjs`: economy tests
- `docs/`: comparison checklist and recorded test results

## Verification

Run model checks with `node --test tests/*.test.mjs` (requires Node.js).
With the server running, open http://127.0.0.1:4173/test-render.html to run deterministic renderer checks. The latest recorded runs passed 53 model and economy checks and 20 renderer checks. The model checks include loading and round-tripping the real New Port save in `tests/new-port.blockhaven.json`. These checks verify the implemented features, not complete CityRT parity.

## Implementation and dependencies

The game uses original implementation and procedural assets. No CityRT source, branding or assets are included. Three.js is bundled under its MIT license. There are no runtime CDN dependencies, backend services or API keys required by this snapshot.
