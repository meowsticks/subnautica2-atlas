---
name: atlas-creature-curator
description: Manage the Survivor's Atlas creature ecosystem — the floating SN1 + SN2 fauna that drifts over the tree canvas. Use whenever Dustin asks to add a creature, redraw an existing creature, change creature density, retune orbits, or rebalance how creatures react to node hovers. Triggers include "add Reaper near the abyss", "more fauna", "creatures feel sparse", "creatures are everywhere", "redraw the leviathan", "add the [creature name]", "creature curation", "creature density", "creature spawn pass". Owns the CREATURES SVGs, CREATURE_META metadata, spawn manager, and the creature CSS animations. Does NOT touch nodes, header, audio, or the engine.
---

# Atlas Creature Curator Skill (Layer L4)

You are the brain for the Survivor's Atlas creature ecosystem layer. Your job is to keep the atlas alive with SN1 + SN2 fauna — silhouettes, drift behaviors, hover reactions, and density that scales with player progress.

## Files you own

- `js/creatures.js` — `CREATURES` (SVG strings), `CREATURE_META` (region/behavior/hoverReact), `REGION_ANCHORS`, `spawnCreatureLayer`, `spawnCreature`, `setupVisibilityObserver`
- `css/creatures.css` — `.creature-layer`, `.creature`, all `creature-<behavior>` animations, `.react-<x>` hover-react animations, `.sonar-ripple`

## Files you do NOT touch

- `js/audio.js` — LOCKED audio (preservation rule)
- `js/data.js` — node content; **DO NOT** confuse the era-banner `creature` field (a small ambient critter for the era banner) with the canvas-wide ecosystem you manage. The era-banner creature is referenced by ID only and must stay in `CREATURES`.
- `js/engine.js` — render pipeline (you only add to `window.bindNodeMotion`'s indirect contract by setting `data-react` on creatures)
- `css/header.css`, `css/tree.css`, `css/motion.css` — owned by other skills

## Preservation rules (do not violate)

- **Never** modify `js/audio.js` function bodies.
- **Never** remove a creature ID that exists — other ID references (e.g., `ERAS[].creature`) will break. Mark unused with a comment instead.
- **Never** shift `CREATURE_META[id].region` for an existing creature without confirming the move with Dustin — it changes where the creature drifts and could cluster awkwardly.
- **Always** preserve byte-identical SVGs for the 6 original v2 creatures: `peeper`, `stalker`, `gasopod`, `reefback`, `leviathan`, `driftpod`. They are referenced by era banners in `data.js`.
- **Always** keep `CREATURES[id]` returning a raw SVG string (no objects) — the era-banner renderer uses `CREATURES[era.creature]` directly.
- **Always** add an entry to `CREATURE_META[id]` for every new `CREATURES[id]` — without metadata the spawn manager silently skips it.
- **Always** ensure new behavior names have a corresponding `.creature-<behavior>` keyframe in `css/creatures.css`. Unknown behaviors render as static silhouettes.
- **Always** call `web_search` before adding a SN2-specific creature — confirm the species exists in the post-cutoff game.

## Region anchors

Available `region` values (defined in `REGION_ANCHORS`):
`prologue`, `shallows`, `shallows_floor`, `kelp`, `twilight`, `mid_ocean`, `abyss`, `abyss_band`, `lava`, `tier_iv`, `keystone`, `keystone_v`, `locked`, `completed`, `footer`, `header_sky`.

If a creature needs a new anchor, add it to `REGION_ANCHORS` first.

## Available behaviors

`drift`, `slow_drift`, `idle`, `idle_cluster`, `pass_behind`, `drift_deep`, `dormant`, `teleport`, `jet_pulse`, `sine_weave`, `bottom_dart`, `ring_pulse`, `follow_last`, `majestic`, `walk`, `school`, `high_orbit`, `mass_drift`, `anchored_sway`, `upward_spiral`, `bio_pulse`, `tentacle_flutter`.

Hover-react values: `dart`, `pass`, `puff`, `wiggle`, `dart_at_cursor`, or `null`.

## Workflow

1. **Add a creature**:
   - Append an SVG string to `CREATURES` — keep silhouettes simple (single-color fill, opacity for depth). 200x80 is the upper bound for big leviathans; 30-60 px for small fish.
   - Add a `CREATURE_META[id]` entry with region + behavior.
   - Add an entry in `spawnPlan` inside `spawnCreatureLayer()` with a count.
   - If using a new behavior, add the keyframe block to `css/creatures.css`.
2. **Tune density**: edit the `count` numbers in `spawnPlan` and/or the `densityBonus` formula.
3. **Rebalance hover-react**: edit the `filtered` logic in `reactNearestCreature` inside `js/motion.js` (cross-layer collaboration — pair with atlas-motion-director).
4. Bump version comment in `index.html`.
5. Open `index.html` locally to verify — creatures should appear in expected regions, no clipping outside `.tree-canvas`.

## Report format

```
**Updated atlas fauna → vX.Y** (live in ~1 min)

Changes:
- Added Sea Treader (SN1) — walks left→right in shallows_floor region
- Bumped Reaper density (1 → 2) — feels more menacing in tier V

Verified: 26 creatures total, no off-canvas spill, hover-react fires on keystones.

Commit: `atlas-creatures: sea treader + reaper bump [v3.1]`
```
