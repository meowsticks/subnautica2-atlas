# Atlas Verification Checklist

Run after every multi-layer release. Serve via local HTTP (matches Pages CDN):

```powershell
cd path\to\subnautica2-atlas
python -m http.server 8000
# open http://localhost:8000
```

## 1. Load

- [ ] `index.html` opens with no console errors
- [ ] DevTools Network tab: all `css/*.css` and `js/*.js` return 200
- [ ] `assets/logo.svg` returns 200
- [ ] Version comment at `index.html:2` matches the target `vX.Y`

## 2. L3 Visual Identity

- [ ] Logo appears top-left of header, glow-pulses (cyan ↔ orange)
- [ ] Concentric ripples on logo animate at 1s stagger
- [ ] Logo hover scales up slightly + rotates 2deg
- [ ] `getComputedStyle(document.body).getPropertyValue('--bio')` returns non-empty
- [ ] Title "SURVIVOR'S ATLAS" reads clearly against background

## 3. L4 Creature Ecosystem

- [ ] At least 20 creatures visible on first paint
- [ ] No creature clips outside `.tree-canvas`
- [ ] Hover any node → nearest small fish darts away within 220ms
- [ ] Hover a keystone → reaper silhouette passes behind (allow ~3 attempts; 1-in-3 trigger)
- [ ] Locked nodes occasionally show warper teleport-flicker nearby
- [ ] DevTools: `document.getElementById('creatureLayer').children.length` ≥ 20

## 4. L5 UI Motion

- [ ] Click any unlocked node → sonar ripple appears at click point
- [ ] Bubble burst spawns on every node click
- [ ] Available nodes pulse (2.5s cycle)
- [ ] Keystone available nodes have aura halo
- [ ] Connection-flow lines animate dashes on completed paths
- [ ] OS reduced-motion → ambient particles + creatures vanish, layout intact

## 5. L1/L2 Engine + Persistence

- [ ] Click `Lifepod Crash` panel → "Mark Acquired" shows (auto-completed)
- [ ] Click a Tier I dependency → unlocks Tier I node
- [ ] `localStorage.getItem('subnautica2-progress-v2')` returns non-null
- [ ] Reload → completed state persists
- [ ] Reset Progress button clears state, returns to start node only

## 6. L6 Audio Regression (LOCKED)

- [ ] Toggle sound ON
- [ ] Click an unlocked node → bubble pop plays
- [ ] Complete a keystone → unlock chord plays (3-tone bell)
- [ ] Advance to a new era (e.g., complete the Scanner Station chain) → deep rumble plays
- [ ] If any silent: `js/audio.js` was corrupted — git revert

## 7. L7 Icons & Flora

- [ ] Every node renders its icon — no broken `<svg>` placeholders
- [ ] Kelp flora sways in Kelp Depths era banner
- [ ] Reef flora visible in Shallows era banner

## 8. L8 Performance & Accessibility

- [ ] DevTools Performance: 10s pan recording → ≥ 55 fps sustained
- [ ] No long tasks > 50ms
- [ ] Lighthouse Performance ≥ 90
- [ ] Lighthouse Accessibility ≥ 95
- [ ] Tab through page → focus ring visible on all buttons and logo

## 9. Deploy

- [ ] `git status` clean except intended files
- [ ] `git push origin main`
- [ ] Wait ~60s
- [ ] Live Pages URL loads in incognito (cache-bust)
- [ ] Live site shows the new version comment

## 10. Final smoke

- [ ] Console clean across 1 minute of interaction
- [ ] No memory leaks (Performance Memory tab — heap doesn't climb continuously)
- [ ] All 7 atlas skills' `SKILL.md` files present and reference current preservation rules
