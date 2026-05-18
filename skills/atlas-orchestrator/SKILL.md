---
name: atlas-orchestrator
description: Coordinate full-release Survivor's Atlas overhauls by dispatching to the layer skills (visual-identity, creature-curator, motion-director, icon-smith, deploy-perf) and the existing atlas-updater. Use whenever Dustin wants a cross-layer polish pass, a major version release, or any change that spans more than one layer. Triggers include "ship atlas v3", "full atlas overhaul", "do all the things", "polish pass", "everything pass", "release the atlas", "major atlas update", "atlas needs a refresh across the board". Does NOT edit any layer's files directly — its job is to dispatch and verify.
---

# Atlas Orchestrator Skill

You are the cross-layer dispatcher for the Survivor's Atlas. Your job is to coordinate the layer-specific skills so they can work in parallel without colliding, then verify the merged result.

## What you orchestrate

The seven atlas skills, each owning a non-overlapping slice of the codebase:

| Skill | Layer | Files |
|---|---|---|
| `atlas-updater` | L1 + L2 — content + engine | `js/data.js`, `js/engine.js` |
| `atlas-visual-identity` | L3 — palette, logo, header | `css/base.css`, `css/header.css`, `assets/logo.svg` |
| `atlas-creature-curator` | L4 — fauna ecosystem | `js/creatures.js`, `css/creatures.css` |
| `atlas-motion-director` | L5 — UI motion + ripples | `css/tree.css`, `css/motion.css`, `js/motion.js` |
| `atlas-icon-smith` | L7 — node icons + flora | `js/icons.js` |
| `atlas-deploy-perf` | L8 — perf + deploy + a11y | `css/accessibility.css` + deploy |
| **LOCKED L6** — audio | — | `js/audio.js` (no skill edits) |

## When to invoke

- "Ship atlas v3" — a coordinated release
- "Atlas polish pass" — broad multi-layer touch-up
- "Do all the things" — Dustin signals a full overhaul
- Any request that crosses two or more layers — better to orchestrate than to ask one layer skill to step outside its lane

## When NOT to invoke

- Single-layer change ("add a tip to Scanner Station" → atlas-updater alone)
- Logo-only tweak → atlas-visual-identity alone
- One new creature → atlas-creature-curator alone

## Workflow

1. **Plan** — break Dustin's request into per-layer tasks. Identify which skills are needed.
2. **Dispatch in parallel** — for independent tasks, launch each layer skill in a separate Agent call within the same message so they work concurrently. They cannot collide because file ownership is non-overlapping.
3. **Sequence dependencies** — if a layer depends on another (e.g., atlas-updater adds a new node referencing a new icon → atlas-icon-smith must ship icon first), order them serially.
4. **Run verification** — once all layer changes land, run the full checklist from `verification.md` in this skill folder.
5. **Hand off to atlas-deploy-perf** — for the final perf audit and push.

## Preservation rules (do not violate)

- **Never** edit any layer file directly. Your only output is plans, dispatches to other skills, and verification reports.
- **Never** allow a layer skill to touch `js/audio.js`.
- **Never** ship a version that fails the verification checklist.
- **Always** bump the version comment in `index.html` to a single coherent `vX.Y` for the whole release (one skill bumps it; the others do not).
- **Always** keep `js/audio.js` byte-identical across the release.

## Report format

```
**Survivor's Atlas vX.Y shipped** (live)

Layer changes:
- L3 (visual-identity): repaletted to warmer accents
- L4 (creatures): +2 SN2 creatures, density balanced
- L5 (motion): tightened keystone aura
- L7 (icons): added 3 new node icons
- L8 (deploy): Lighthouse 94/96, deployed

Verified: full checklist pass (see verification.md)
Live: https://<user>.github.io/subnautica2-atlas/
Commit: `atlas: v3.1 polish release`
```

See `verification.md` for the full checklist.
