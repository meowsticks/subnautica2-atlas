---
name: atlas-visual-identity
description: Update the Survivor's Atlas visual identity — color palette, logo, header chrome, and typography. Use whenever Dustin asks to retheme the atlas, change colors, redesign the logo, swap the palette, adjust fonts, or update header chrome. Triggers include "retheme atlas", "change atlas palette", "update atlas colors", "redesign atlas logo", "atlas looks bland", "make the atlas pop", "swap to a warmer palette", or any mention of the atlas needing a visual refresh. Owns CSS variables, header CSS, and the logo SVG. Does NOT touch nodes, creatures, audio, or engine logic.
---

# Atlas Visual Identity Skill (Layer L3)

You are the brain for the Survivor's Atlas visual identity layer. Your job is to keep the atlas looking like a cohesive Subnautica 2 artifact — palette, logo, header chrome, and typography.

## Files you own

- `css/base.css` — `:root` CSS variables, body/html background, ambient particle and bubble-pop visuals
- `css/header.css` — `.atlas-logo` styles, `.title-block`, `.btn`, `.stats-bar`, `.legend`
- `assets/logo.svg` — the hex/sonar/triangle mark

## Files you do NOT touch

- `js/audio.js` — LOCKED audio synthesis (preservation rule)
- `js/data.js` — node and era content
- `js/engine.js` — render pipeline
- `js/creatures.js`, `css/creatures.css` — creature ecosystem (owned by atlas-creature-curator)
- `css/tree.css` — node and tree layout
- `css/motion.css` — shared keyframes (owned by atlas-motion-director)

## Preservation rules (do not violate)

- **Never** modify `js/audio.js` function bodies (`playBubblePop`, `playSonarPing`, `playUnlock`, `playDeepRumble`).
- **Never** rename CSS variables (`--bio`, `--kraken`, `--gold`, `--aqua`, etc.) — other layers reference them. Only change their hex values.
- **Never** delete `--abyss`, `--deep`, `--bio`, `--gold`, `--kraken`, `--text`, `--text-dim`, `--line-locked`. These are load-bearing for tree and creatures layers.
- **Always** bump the version comment at `index.html:2` on every change: `<!-- Survivor's Atlas vX.Y · last-updated YYYY-MM-DD -->`.
- **Always** verify contrast against `--abyss` background — text must remain readable (WCAG AA min).
- **Always** keep the logo's hex frame, central dot, and three concentric ripples — they are the brand mark.

## Typical tasks

- **Repalette** — change `--bio`, `--kraken`, `--gold` to a new accent set. Verify nodes still read clearly.
- **Logo variant** — adjust gradient stops in `<linearGradient id="atlasGrad">`, change "II" mark, tweak ring colors.
- **Header polish** — adjust button hover effects, tweak title-block typography, add subtle gradients.
- **Seasonal theme** — temporarily override accents (e.g., warmer palette for v3.x event).

## Workflow

1. Identify which file the change lives in. Default: smallest scope.
2. Make surgical edits — don't reformat unrelated CSS.
3. Bump version comment in `index.html`.
4. Open `index.html` in a browser to verify visually.
5. Spot-check: contrast on locked/available/completed nodes, button hover state, logo glow-pulse cycle.
6. If user is on Claude Code with git access: stage only changed files, commit with `atlas-visual: <summary> [vX.Y]`.

## Report format

```
**Updated atlas identity → vX.Y** (live in ~1 min)

Changes:
- Repaletted to warmer cyan→amber accents (--bio, --kraken)
- Tightened logo glow-pulse cycle (4s → 3s)

Verified: contrast pass on all node states, logo animates smoothly.

Commit: `atlas-visual: warm palette + faster logo pulse [v3.1]`
```
