# Blockhaven: CityRT main browser game reconstruction

## Agreed scope

Reconstruct the main browser city-building game feature for feature before starting a separate spin-off task. The result must use original implementation and assets, with its own name. A smaller city builder does not satisfy this scope.

Focus on the main city sandbox. Pass-only modes, premium street walking, career, multiplayer and account/subscription systems are not prerequisites for this phase, following the user's clarification. Features that operate inside the ordinary main city game remain in scope.

## Visual requirements

- A cohesive, realistic game aesthetic, with convincing proportions, materials, streets and building detail.
- Streetlights along roads, visibly illuminated pavement at night, lit windows and a coherent day/night cycle.
- Varied building silhouettes, roof types, lots, landscaping and street furniture.
- Traffic, pedestrians, construction activity and purposeful animations.
- Clear construction feedback and readable controls without obstructing the city.
- A complete playable walkthrough explaining how to start and how the simulation works.

## Definition of completion

A feature is complete only after its reference behavior is recorded, its implementation is usable, and its important success and failure cases are verified. A button or a visual placeholder does not count as an implemented system. Unobserved reference behavior must be labeled unverified rather than guessed or advertised as equivalent.

## Main-game comparison checklist

| System | Reference observations | Current reconstruction | Remaining work |
| --- | --- | --- | --- |
| World size | Starter map observed at 72 × 72; size options advertised through 256 × 256 | Fixed 32 × 32 | Variable map dimensions, larger cities, save migration, performance validation |
| Landscapes | Ten terrain choices advertised | Peninsula, island and river layouts | Inventory remaining landscapes and reproduce their playable behavior |
| Camera and input | City orbit, pan, zoom, construction controls | Mouse and touch camera, keyboard tools | Match reference placement, modifier and selection behavior |
| Road construction | Streets, curbside, wide roads, highways, surfaces, bridges and elevation controls | Five simplified road variants | Full road hierarchy, geometry, directional routing, surfaces, bridges and grades |
| Streetlights | Required street detail | Standard road lamps, pavement falloff and eight nearby real lights added locally | Visual verification, large-city performance and final integration |
| Zoning | Houses, townhouses/houses, apartments, small shops, malls, industry, offices, dezone; cardinal facing | Four sectors and three residential densities | Distinct reference zone classes, facing and development rules |
| Building placement | Multiple catalogs, adjustable shape/settings and orientation | Single-block placement with twelve style presets | Variable lots, orientation, complete functional catalog and distinct buildings |
| Housing | Separate main catalog and growth/upgrade prompts | **v2:** Three densities, plus levels 1–3 with automatic and manual upgrades and green-arrow prompts | Inventory reference building choices and exact upgrade conditions |
| Shops, offices, industry | Separate catalogs and sector demand | Simplified jobs and four income sectors | Complete catalog, demand behavior, outputs, upgrades and goods/import rules |
| Power | Lines, substation, turbine, solar farm, CHP plant | **v2:** Power lines, wind turbine, solar farm and CHP plant. Capacity and demand in MW, flowing over street and power-line networks, with the furthest blocks losing service first | Substation; verify the reference's exact distribution rules |
| Water | Tower, intake, artesian well, waterworks | **v2:** All four, at the observed prices and capacities, as a network supply. The intake needs a shore lot. Plants need power | Verify reference operating rules (e.g. pollution near wells) |
| Sewage | Outfall, small treatment plant, ponds, treatment plant | **v2:** All four, with observed capacities. Homes without sewage service lower approval (−8). Outfall and ponds pollute | Verify reference consequences and per-capita volumes |
| Garbage | Landfill, recycling center, incinerator | **v2:** All three, with observed capacities. No garbage service lowers approval (−6) and raises fire risk. The landfill and incinerator pollute | Collection trucks; verify reference rates |
| Services | Seventeen European service entries observed, including education, health, fire, police, library and post office | **v2:** School, college, clinic, hospital, fire, police, library, post office and Town Hall, with coverage radii and funding | Kindergarten, university, baths; capacities per reference |
| Parks, yards, landmarks | Separate palettes | **v2:** Park, plaza, stadium, parish church and clock belfry; landmarks raise approval nearby | Remaining props and landmarks; yards |
| Districts | District palette and district management | Missing | Boundaries, naming, rules, statistics and effects after reference verification |
| Terrain and surfaces | Separate editing palettes | Landscape generation only | Editable terrain and surface tools, validation, refunds and save support |
| Economy | Four sector taxes, daily income/expenses, service funding, loans and weekly chart | Sector taxes, funding, loan and history | Match remaining expense categories, imports, upgrades and economic behavior |
| Approval and growth | Approval, tier thresholds and sector demand | **v2:** Approval includes sewage, garbage, library, post, landmarks and request mood. Demand bars for all four sectors, including offices. The growth freeze at 1,180 residents is fixed | Verify reference tier thresholds and growth formulas |
| Time | Pause, 1×, 2×, 4× and clock/day phases | **v2:** Pause, 1×, 2× and 4×, plus the lighting cycle | Match clock display |
| Resident/advisor activity | Requests with deadlines, promises, advisor news and map links observed | **v2:** Mayor's office ticker with requests (12-day deadlines, $1,500 reward, approval effects), shortage and fire news, and an "on map" link | Promises, advisor dialogue, neighbor proposals |
| Regional interactions | Neighbor proposals and commuting effects observed inside city | Missing | Verify and implement ordinary sandbox neighbor interactions |
| Layers | Dedicated city-layer palette | Power, water, roads, education, health and pollution | Inventory complete reference layers, legends and interactions |
| Bulldozing and editing | Dedicated tool and selected-building actions | Removal, 25% refunds, undo and enable/disable | Match reference editing, upgrade and removal behavior |
| Disasters | Main-city disaster palette observed | **v2:** Random fires with fire-station coverage and an on/off setting | Other disasters from the palette |
| Saving | Multiple-city load flow | Autosave, JSON backups and eight local snapshots | Verify ordinary save/load options and data retention behavior |
| Onboarding | Guided reference first steps | Eleven-step interactive tutorial | Extend tutorial as the complete systems become available |

## Direct reference play performed

- Opened the signed-in starter city in Chrome.
- Drew an eleven-tile L-shaped street; the game charged 660 and advanced the tutorial.
- Painted residential zoning; the advisor confirmed the zone and construction activity appeared.
- Inspected the budget, sector taxes, service funding and loan terms.
- Inspected the European service palette and the sixteen-item utilities palette.
- Observed building upgrade prompts, resident requests, advisor feed and a neighboring-town proposal.
- Street walking showed a Pass gate; the user subsequently clarified that premium modes are not the focus.
- The full main game has not yet been exhaustively played through. Some reference browser operations timed out; that does not establish a cause for the freezing.

## Utilities inventory directly observed

| Item | Construction price | Displayed capacity |
| --- | ---: | --- |
| Power line | 40 / tile | — |
| Substation | 1,500 | — |
| Sewage outfall | 3,000 | 20 K m³ |
| Water tower | 3,500 | 12 K m³ |
| Wind turbine | 4,000 | 4 MW |
| Landfill | 6,000 | 90 t/day |
| Small treatment plant | 6,000 | 20 K m³ |
| Water intake | 6,500 | 40 K m³ |
| Artesian well | 7,000 | 20 K m³ |
| Treatment ponds | 9,000 | 60 K m³ |
| Solar farm | 9,000 | 12 MW |
| Recycling center | 14,000 | 25 t/day |
| Sewage treatment plant | 16,000 | 90 K m³ |
| CHP plant | 22,000 | 60 MW |
| Waterworks | 26,000 | 100 K m³ |
| Incinerator | 30,000 | 100 t/day |

Prices and capacities are observed interface values, not proof that all operating rules have been reconstructed.

## Verification status

**Version 2 (October 2026):**
- 39 model tests pass. They include loading and round-tripping the real New Port save, growth past 1,180 residents within 30 days, building aging, capacity shortfalls, power lines joining networks, the shore rule, manual upgrades, fires (burning down, keeping the zone, coverage, the off switch), sewage and garbage approval, resident requests, and the new save fields.
- 20 renderer checks pass, and every catalog type is built in the stress scene. No WebGL errors.
- Visual check in headless Chromium at desktop (1336 × 860) and phone (390 × 844) sizes, using New Port with every new building placed: the new models, upgrade arrows, flames and smoke, the ticker and the gauges all render without console errors.

**Earlier record:**

- 27 model tests passed after the latest streetlight code change. These cover the existing simplified simulation, not missing reference systems.
- 20 renderer checks passed, including a lamp on every road block, pavement lighting, eight nearby real lights at night and daylight shutoff. No WebGL errors were reported in that run.
- Browser testing has exercised the current walkthrough, taxes, loans, service funding, save imports/exports, snapshots, graphics settings and narrow-screen controls.
- No claim of perfect behavior, complete parity, stable frame rate or elimination of freezing is supported yet.
- Existing nontrivial city saves must be preserved. Destructive reset tests should use an isolated test origin or disposable fixture.

## Implementation order

1. Finish the reference inventory and maintain this checklist with evidence.
2. Repair street lighting and verify day/night behavior.
3. Replace fixed-size, single-block assumptions with variable maps, lots and orientation while preserving existing saves.
4. Implement the full main-game construction catalog, roads and utility networks/capacities.
5. Complete service coverage, economy, upgrades, districts, terrain and surface editing.
6. Add ordinary sandbox events, resident requests, neighbor interactions and applicable disasters.
7. Bring the walkthrough and controls into line with the complete game.
8. Test every implemented tool and system, including failure cases, save round trips, larger-city performance and visual review.

## Delivery status

**The exact main-game reconstruction is still unfinished.** Version 2 closes the utilities, sewage, garbage, upgrades, requests and fire gaps listed above. Variable map sizes, districts, terrain editing, the full road hierarchy and the remaining catalog are still open.
