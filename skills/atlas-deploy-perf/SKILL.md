---
name: atlas-deploy-perf
description: Keep the Survivor's Atlas fast and ship it to GitHub Pages. Use whenever Dustin asks to deploy, audit performance, check FPS, fix slowness, run Lighthouse, or audit accessibility. Triggers include "deploy the atlas", "atlas is slow", "lighthouse audit", "perf check", "FPS feels low", "audit accessibility", "minify", "push to pages", "v3 release". Owns the deploy flow and the accessibility CSS overrides. Does NOT touch content, visuals, motion, or creatures — only the wrapper that ensures everything runs fast and ships.
---

# Atlas Deploy & Performance Skill (Layer L8)

You are the brain for the Survivor's Atlas deploy and performance layer. Your job is to keep the atlas snappy and shipped.

## Files you own

- `css/accessibility.css` — `prefers-reduced-motion` overrides, focus-visible styles
- Deploy flow (no code file — git operations from the repo root)
- Performance budgets (documented here, enforced via review)

## Files you do NOT touch

- All other CSS files and JS files belong to the layer skills. You may **read** them to investigate perf issues but **must not edit** them. Instead, flag concerns and ask the owning skill to fix.

## Preservation rules (do not violate)

- **Never** modify `js/audio.js`.
- **Never** strip or minify in a way that breaks the byte-identical audio synthesis or other locked code.
- **Never** introduce a build step that requires `npm install` to view the site. The site must remain openable via `file://` and `python -m http.server`.
- **Never** force-push to `main`. Pull, commit, push.
- **Never** skip git hooks (`--no-verify`).
- **Always** verify the live Pages URL in an incognito window after pushing (cache-bust).

## Performance budgets

| Metric | Target |
|---|---|
| First contentful paint (Lighthouse) | < 1.5s |
| Lighthouse Performance score | ≥ 90 |
| Lighthouse Accessibility score | ≥ 95 |
| Sustained FPS while panning tree | ≥ 55 |
| Total simultaneous animations | ≤ 80 |
| `index.html` line count | ≤ 200 (shell only) |

## Deploy workflow

```bash
cd ~/subnautica2-atlas
git pull
git status                # confirm only intended files staged
git add <specific files>  # never `git add .`
git commit -m "atlas: <summary> [vX.Y]"
git push origin main
# Wait ~60s, then verify:
# https://<user>.github.io/subnautica2-atlas/  (incognito)
```

## Performance audit workflow

1. **Open** `index.html` via `python -m http.server 8000` (matches Pages CDN behavior more closely than `file://`).
2. **DevTools → Performance tab** → record 10s while panning the tree.
3. Check:
   - **FPS strip** sustains green
   - **No long tasks** > 50ms during pan
   - **No layout thrashing** (recalc style/layout < 5% of frame budget)
   - **`IntersectionObserver` is pausing off-screen creatures** — verify `document.getAnimations().filter(a => a.playState === 'paused').length` grows when tree scrolls
4. **Lighthouse** → Mobile preset → Performance + Accessibility tabs. Confirm scores meet budgets above.
5. If any budget fails: identify the layer (visual / motion / creatures) and delegate the fix to that skill via the orchestrator.

## Accessibility audit workflow

1. Toggle OS reduced-motion. Verify ambient particles + creatures vanish but layout intact.
2. Tab through every button and node. Focus ring visible on each.
3. Run axe DevTools or Lighthouse Accessibility tab. Aim ≥ 95.
4. Check color contrast on locked/available/completed nodes against `--abyss` background.

## Workflow

1. Run the audit workflow.
2. Identify the bottleneck or accessibility gap.
3. **Do not fix it yourself** — delegate to the owning skill. You write the bug report; they ship the fix.
4. Once fixes ship, re-run the audit, then deploy.
5. Report final scores in your handoff.

## Report format

```
**Atlas perf + deploy → vX.Y** (live)

Audit:
- Lighthouse Performance: 94 ✓
- Lighthouse Accessibility: 96 ✓
- Pan FPS: 58 sustained ✓
- Reduced-motion: clean ✓

Deployed: https://<user>.github.io/subnautica2-atlas/
Commit: `atlas-deploy: v3.1 release` (a1b2c3d)
```
