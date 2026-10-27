# Blockhaven / CityRT feature audit

Reviewed October 26, 2026. This records direct observations, not a claim of complete equivalence. CityRT assets and code are not part of Blockhaven.

## Reference gameplay actually inspected

- Signed in with the user's assistance and opened the starter city.
- Reviewed the main menu: starter city, New Game, Campaigns, Career, Challenges, Online, Load Game, Mayor Profile, Settings and About. Career and some other features are pass-gated.
- Inspected the live starter-city HUD, upgrades, advisor/feed notifications, road palette and residential/commercial/industrial/office zoning palette.
- In Chrome, drew an 11-tile street. The game charged 660 currency and advanced its tutorial from street construction to residential zoning.
- Inspected the 17-item European service catalog, including police, fire, healthcare, education, library, post office and Town Hall options.
- Reference browser control intermittently timed out in both browsers. Premium modes and online sessions have not been played through. No purchase or subscription was made.

## Comparison

| System | Observed CityRT scope | Blockhaven status |
| --- | --- | --- |
| 3D city | Larger starter city, varied footprints, detailed buildings | Reworked renderer with facade textures, roof tiles, balconies, storefronts, landscaping and shared instancing; still a smaller simulation |
| Roads | Multiple widths, curbside, highways, bridges, surfaces and levels | Street, boulevard, eastbound one-way, pedestrian street and bridge; no highway hierarchy or grade separation |
| Zoning | Houses, townhouses, apartments, shops, malls, industry, offices | Residential, commercial, industrial and office zoning; low/medium/high residential capacity |
| Architecture | 12 styles and a large catalog | 12 original procedural style presets; substantially fewer unique building designs |
| Plot stretching | Adjustable lots and orientation | Single-block placement; variable-size plots not implemented |
| Utilities | Quantities/capacities and distribution tools | v2: Power, water, sewage and garbage capacity networks over streets and power lines, with 16 utility buildings at the observed capacities. No substation or pipe tool |
| Services | Police, fire, education, healthcare, administration, daily life and transit | v2: Schools, college, clinics, hospital, fire, police, library, post office and Town Hall, with radius coverage. No transit |
| Jobs/economy | Housing, commerce, offices, industry; upgrades and other economic tools | Working jobs, taxes, upkeep, tax slider, demand indicators, growth history and advisor notes; building levels 1–3 with upgrade prompts (v2); no regional deals |
| Lighting | Clock, day/night and lit windows | Daylight, golden hour, night and an automatic cycle; lamps on every road block, pavement light falloff, eight nearby real lights and emissive windows |
| Life/animation | Traffic, residents, construction cranes and feed | Connected-road traffic, walking residents, birds, wind-swayed foliage, turbines, bobbing boats, construction growth, demolition dust, milestone particles and player-launched balloons |
| Ground-level view | Walk Around Town, pass-marked in reference | Street-level walking with WASD/arrows or touch controls and collision checks |
| Saves | Load game and multiple cities | Autosave, JSON import/export and eight local city snapshots; no cloud sync |
| Maps | Seven sizes up to 256×256, ten terrain options | Three landscape layouts at 32×32; no terraforming |
| Layers | Multiple city layers | Electricity, water, roads, education, healthcare and pollution overlays |
| Onboarding | Interactive first steps | Eleven-step guided walkthrough, map targets, completion checks and replay |
| Disasters/zombies | Disaster tools and pass-marked zombie mode | v2: Random fires with fire-station coverage and an off switch. Other disasters not implemented |
| Landmarks/yard/surfaces | Separate catalog categories | v2: Park, plaza, stadium, parish church and clock belfry. No yard or surface catalog |
| Campaign/career/challenges | Separate main-menu modes | Not implemented |
| Multiplayer/region/profile | Online rooms, regional management and mayor profile | Not implemented |

Full feature parity is **not achieved**. The missing systems above remain real development work and must not be advertised as available.

The current main-game scope and detailed remaining work are recorded in [MAIN-GAME-RECONSTRUCTION.md](MAIN-GAME-RECONSTRUCTION.md). Pass-only modes and account systems are excluded from this phase by user clarification.
