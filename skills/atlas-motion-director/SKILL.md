---
name: atlas-motion-director
description: Tune the Survivor's Atlas UI motion — button states, node hover/click effects, sonar ripples, era transitions, and the cinematic feel of the tree. Use whenever Dustin asks to smooth animations, change motion timings, retune ripples, adjust button feel, or fix jank. Triggers include "buttons feel stiff", "smoother animations", "add a sonar ripple", "atlas feels laggy", "tune the keystone aura", "motion is too aggressive", "calm the animations down". Owns tree CSS animations, motion CSS keyframes, and the JS motion glue (sonar ripple, hover-react dispatch, IntersectionObserver). Does NOT touch palette, logo, creatures' definitions, nodes' content, or audio.
---

# Atlas Motion Director Skill (Layer L5)

You are the brain for the Survivor's Atlas motion layer. Your job is to keep the atlas feeling alive — smooth, responsive, cinematic — without sacrificing performance.

## Files you own

- `css/tree.css` — `.node`, `.connection`, `.era-banner`, `.panel` animations (node states, era pulse, flow lines)
- `css/motion.css` — shared keyframes: `selected-pulse`, `available-shimmer`, `bubble-trail`, `era-advance-flash`
- `js/motion.js` — `spawnBubbleBurst`, `spawnSonarRipple`, `spawnParticles`, `bindNodeMotion`, `reactNearestCreature`

## Files you do NOT touch

- `js/audio.js` — LOCKED. You may CALL the play* functions; you may not edit them.
- `js/data.js` — node content
- `js/engine.js` — render pipeline (it calls `window.bindNodeMotion` after each render — keep that contract)
- `css/base.css`, `css/header.css` — owned by atlas-visual-identity
- `js/creatures.js`, `css/creatures.css` — owned by atlas-creature-curator (you can REQUEST changes via `reactNearestCreature` but don't edit creature CSS directly)

## Preservation rules (do not violate)

- **Never** modify `js/audio.js`. Call the play* functions only at the call sites you already use.
- **Never** disable `IntersectionObserver` pause logic — it's load-bearing for perf on long-scrolling atlases.
- **Never** add a keyframe that runs continuously at >60fps — prefer transitions or step-based animations.
- **Never** raise total simultaneous animations past ~80 (count: ambient particles 35 + creatures ~30 + connection-flows ~12 + node pulses on available ~5).
- **Always** respect `prefers-reduced-motion` — never override the accessibility.css media query.
- **Always** call `playSonarPing()` on sonar-related effects, `playBubblePop()` on bubble effects, `playUnlock()` on completion — match motion to existing audio cues.
- **Always** bump the version comment in `index.html` on every change.

## Motion contract with engine.js

After every render, `engine.js` calls `window.bindNodeMotion()` if it exists. Your `bindNodeMotion` must:
- Be idempotent (use `dataset.motionBound` flag — already done)
- Bind only event listeners, not re-render anything
- Stay under 5ms total for a full 35-node bind pass

## Typical tasks

- **Tune timings**: edit duration/easing in `css/tree.css` keyframes (`pulse`, `keystone-aura`, `flow`).
- **Add a one-shot effect on unlock**: extend `available-shimmer` or add a new keyframe in `css/motion.css`, trigger via `engine.js`'s `toggleNode` call site (collaborate with atlas-updater).
- **Adjust sonar ripple**: tweak count and stagger in `spawnSonarRipple`, tune `.sonar-ripple` keyframe in `css/creatures.css` (note: that keyframe lives there for cohesion with the creature layer — coordinate with atlas-creature-curator if changing).
- **Throttle hover-react**: change `lastHoverTrigger` cooldown in `motion.js` (default 220ms).

## Workflow

1. Identify which file owns the change (CSS keyframe vs JS trigger).
2. Make surgical edits, keep changes scoped.
3. Bump version comment.
4. Open `index.html` and run a 10s DevTools Performance recording while panning the tree.
5. Verify FPS ≥ 55 sustained, no layout thrash, hover-react fires within 220ms.
6. Toggle OS reduced-motion to confirm animations stop.

## Report format

```
**Updated atlas motion → vX.Y** (live in ~1 min)

Changes:
- Tightened keystone-aura pulse from 5s → 4s — feels more "alive"
- Added bubble-trail micro-particles on button hover

Verified: 60fps panning, hover-react latency 180ms, reduced-motion override clean.

Commit: `atlas-motion: keystone aura + button trails [v3.2]`
```
