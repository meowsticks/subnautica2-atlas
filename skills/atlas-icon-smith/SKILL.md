---
name: atlas-icon-smith
description: Draw and refine the Survivor's Atlas node icons and biome flora. Use whenever Dustin asks to add a new node icon, redraw an existing icon, refresh the flora, or replace placeholder art. Triggers include "new node icon", "redraw the seamoth", "add coral flora", "the cyclone icon looks off", "make a thermal icon", "icon for [item]", "flora needs more variety". Owns `js/icons.js` (ICONS + FLORA). Does NOT touch nodes, creatures, audio, palette, or motion.
---

# Atlas Icon Smith Skill (Layer L7)

You are the brain for the Survivor's Atlas icon and flora layer. You draw small, recognizable SVG glyphs that fit the existing 24×24 hex-node style.

## Files you own

- `js/icons.js` — `ICONS` (24×24 viewBox SVG strings) and `FLORA` (80×60 viewBox SVG strings)

## Files you do NOT touch

- `js/audio.js` — LOCKED
- `js/data.js` — node content (each node references an icon by key in its `icon` field — you ADD icons, atlas-updater REFERENCES them)
- `js/creatures.js` — creature SVGs are a different layer
- All CSS files
- `js/engine.js`, `js/motion.js`, `js/main.js`

## Preservation rules (do not violate)

- **Never** modify `js/audio.js`.
- **Never** delete an existing icon key. Any node may reference it. Mark unused with a `// deprecated` comment if needed but keep the entry.
- **Never** change an icon's viewBox dimensions away from `0 0 24 24` for ICONS or `0 0 80 60` for FLORA — the node renderer expects these.
- **Always** use `currentColor` for the primary fill/stroke so the icon picks up the parent node's state color (text-dim / bio / gold).
- **Always** use `fill="none" stroke="currentColor" stroke-width="1.5"` for outlined-style icons and `fill="currentColor"` for solid icons. Match the existing visual rhythm.
- **Always** keep icons readable at 26px (normal), 30px (notable), and 38px (keystone) — avoid sub-1px detail.
- **Always** bump the version comment in `index.html` on every change.

## Style guide

- Outlined glyphs: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">...</svg>`
- Solid glyphs: `<svg viewBox="0 0 24 24" fill="currentColor">...</svg>`
- Use 1-2 inner accents in fill="#051226" (the abyss dark) for "windows" / "eyes" / "indicators"
- Avoid raster effects (filters, drop-shadows) — the engine wraps icons in tinted containers and that does the work
- Original art only — no game assets, no traced logos

## Typical tasks

- **New icon**: add `iconKey: \`<svg viewBox="0 0 24 24" ...>...</svg>\``
- **Refresh flora**: edit `FLORA.kelp` or `FLORA.reef` SVG; keep palette consistent (`#3fbfa0` for kelp, `#ff9580` for reef)
- **Add new flora region**: define new entry, then coordinate with atlas-updater to reference it from an `ERAS[].flora` field

## Workflow

1. Sketch the icon mentally: what shape says "thermal plant" or "depth module" at 24px?
2. Add entry to `ICONS` (or `FLORA`).
3. Bump version comment.
4. Open `index.html` and find a node that uses the new icon (or temporarily point a test node at it).
5. Verify icon reads clearly at all three sizes (normal/notable/keystone).
6. Coordinate with atlas-updater if a node should now reference the new icon.

## Report format

```
**Updated atlas iconography → vX.Y** (live in ~1 min)

Changes:
- Added `radio` icon for new Lifepod Radio node
- Refreshed `thermal` glyph — clearer "vent" shape

Verified: legible at 26/30/38px, currentColor inherits node state.

Commit: `atlas-icons: radio + thermal refresh [v3.1]`
```
