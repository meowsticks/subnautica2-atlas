# Subnautica 2 — Survivor's Atlas

A PoE-style interactive skill tree for Subnautica 2 progression. Fully static, no API calls at runtime, no ongoing cost. Hosted on GitHub Pages. Updated on demand by asking Claude.

---

## Live atlas
After setup: `https://meowsticks.github.io/subnautica2-atlas/`

### Install as an app (PWA)
The atlas ships as a Progressive Web App — fullscreen, own icon, works offline after the first load. Installs on phone *and* desktop.

- **Desktop (Chrome / Edge / Brave):** when the page is installable, an `⤓ Install App` button appears in the header. Click it to install — the atlas opens in its own window with no browser chrome. You can also use the address-bar install icon (the ⊕ on the right of the URL).
- **iOS (Safari):** open the live URL → Share → **Add to Home Screen** → Add.
- **Android (Chrome):** open the live URL → ⋮ menu → **Install app** (or **Add to Home screen**) → Install.

After install, launch from the home-screen icon (or Start Menu / Dock / Launchpad on desktop). No browser bar, splash uses the atlas logo. To update: open it once while online — the service worker pulls fresh assets in the background and applies them on next launch.

---

## What this is

- A modular HTML/CSS/JS web app styled like Path of Exile's skill tree but themed for Subnautica 2 (Planet Proteus)
- Hex nodes, animated era banners, bubble-pop + gene-pick sound effects, flowing connections between unlocked nodes
- 26 SN1+SN2 creatures drifting across the canvas with hover-react animations
- GSAP cinematic era transitions · panzoom canvas · Three.js 3D view · Tauri desktop overlay scaffold
- Progress + selection + skill points save to your browser's `localStorage` — survives refreshes and closes
- 48 nodes across 6 eras (Prologue → Kelp Forest → Coral Gardens → Sulfur Pyres → Sparse Plains → Red Grass Mesa & Void)
- 12 wiki-rich nodes with locations, resources, quest hooks (web-verified against Reddit, Steam, Unknown Worlds devblogs, major SN2 wikis)
- Updates flow through the **atlas-updater** + plugin skills — no automatic API calls, no token drain

---

## Setup (one-time)

### 1. Push to GitHub (repo already exists at meowsticks/subnautica2-atlas)
The local repo is already initialized at commit `2dc43ce`. From the project root:
```bash
git remote add origin https://github.com/meowsticks/subnautica2-atlas.git
git push -u origin main
```

### 2. Enable GitHub Pages
1. Repo Settings → Pages
2. **Source:** Deploy from a branch
3. **Branch:** `main` · folder: `/ (root)`
4. Save. Wait ~1 minute.
5. Atlas is live at `https://meowsticks.github.io/subnautica2-atlas/`

> **Note:** GitHub Pages on free accounts requires a **Public** repo. If you created the repo as Private, flip to Public in Settings → General → Danger Zone → Change visibility, or the Pages tab will refuse to deploy.

### 3. Install the atlas-updater skill
Copy `skills/atlas-updater/` into your Claude skills directory:
- **Claude.ai web/mobile (Projects):** upload the skill folder as project files
- **Claude Code (Pi 5, desktop):** drop into `~/.claude/skills/` or your configured skills path
- **Cowork:** add to the project's skills

Once installed, any Claude session that loads the skill can update the atlas.

---

## Updating the atlas

### From any Claude chat (most automatic on mobile)
> "Update the atlas with the latest Subnautica 2 community tips"

Claude (with the skill loaded) will:
1. Web-search current SN2 meta + patch notes
2. Produce an updated `index.html` (or a patch JSON)
3. Hand you the file with a suggested commit message

You then commit + push. GitHub Pages redeploys in ~1 minute.

### From Claude Code on your Pi 5 (fully hands-off)
```bash
cd ~/subnautica2-atlas
claude-code
> update the atlas with the latest meta
```
Claude Code researches, modifies `index.html` in place, commits, pushes. Live in ~1 min.

### Manual edit
Open `index.html`, find the `NODES` array, edit by hand. Same effect.

---

## How updates stay cheap

- **Runtime:** the app is plain HTML/CSS/JS. Zero API calls when running. No token cost.
- **Update events:** only when *you* ask Claude. Each update is one chat turn worth of tokens.
- **Hosting:** GitHub Pages is free.

Compare to: an app that polls an API for fresh tips every page load = your tokens drained continuously.

---

## File structure

```
subnautica2-atlas/
├── index.html                          # markup shell + <link>/<script src> tags (~120 lines)
├── README.md                           # this file
├── .gitignore
├── assets/
│   └── logo.svg                        # original SN2-themed hex/sonar mark
├── css/
│   ├── base.css                        # L3 — palette, fonts, body, caustics
│   ├── header.css                      # L3 — logo, title, buttons, stats
│   ├── tree.css                        # L5 — nodes, connections, era banners
│   ├── creatures.css                   # L4 — orbit/swim/hover-react animations
│   ├── motion.css                      # L5 — shared keyframes
│   └── accessibility.css               # L8 — prefers-reduced-motion overrides
├── js/
│   ├── data.js                         # L1 — NODES[], ERAS[], VERSION
│   ├── icons.js                        # L7 — ICONS{}, FLORA{}
│   ├── creatures.js                    # L4 — CREATURES{} (24 SN1+SN2) + spawn manager
│   ├── engine.js                       # L2 — render, dependency graph, storage
│   ├── audio.js                        # L6 — LOCKED, byte-identical synthesis
│   ├── motion.js                       # L5 — sonar ripple, hover-react, observer
│   └── main.js                         # boot + UI handler glue
└── skills/
    ├── atlas-updater/                  # L1+L2 — content + engine brain
    ├── atlas-visual-identity/          # L3 — palette, logo, header
    ├── atlas-creature-curator/         # L4 — fauna ecosystem
    ├── atlas-motion-director/          # L5 — UI motion + ripples
    ├── atlas-icon-smith/               # L7 — node icons + flora
    ├── atlas-deploy-perf/              # L8 — perf + deploy + a11y
    └── atlas-orchestrator/             # cross-layer dispatcher + verification
```

---

## Layered Architecture (v3.0)

The atlas is split into eight non-overlapping layers, each owned by one Claude skill. Skills can edit in parallel because file ownership never collides.

| # | Layer | Files | Brain (skill) |
|---|---|---|---|
| L1 | data-content | `js/data.js` | `atlas-updater` |
| L2 | node-tree-engine | `js/engine.js` | `atlas-updater` |
| L3 | visual-identity | `css/base.css`, `css/header.css`, `assets/logo.svg` | `atlas-visual-identity` |
| L4 | creature-ecosystem | `js/creatures.js`, `css/creatures.css` | `atlas-creature-curator` |
| L5 | ui-motion | `css/tree.css`, `css/motion.css`, `js/motion.js` | `atlas-motion-director` |
| L6 | audio-preserved | `js/audio.js` | **LOCKED** — no skill edits |
| L7 | icons-flora | `js/icons.js` | `atlas-icon-smith` |
| L8 | deploy-perf | `css/accessibility.css` + deploy flow | `atlas-deploy-perf` |

Multi-layer overhauls go through `atlas-orchestrator`, which dispatches to layer skills in parallel and runs the full verification checklist (`skills/atlas-orchestrator/verification.md`) before shipping.

**Why layers:** parallel work without merge conflicts · focused expertise per skill · still no build step, still served straight by GitHub Pages.

---

## Wiki & Quest Plugins (v3.3)

Three plugin skills sit alongside the layer skills, each focused on a content domain rather than a file:

| Plugin | Purpose | Trigger phrases |
|---|---|---|
| `atlas-research-scout` | Live web research — Reddit, X, Steam, Unknown Worlds devblogs, major SN2 wikis. Hands findings to atlas-updater for application. | "refresh atlas with reddit", "x.com subnautica 2", "what's new in subnautica 2 this week" |
| `atlas-quest-tracker` | Tracks NoA blackbox signals — what's next, what gates what, where to go. | "what blackbox is next", "Welcome Center walkthrough", "I'm stuck on Quaker" |
| `atlas-fragment-finder` | Given an item, returns scan / blueprint locations with directions from the Lifepod. | "where is the Haul Chassis", "fragment locations for Repair Tool", "how do I unlock the Processor" |

All three respect the audio-LOCKED rule and produce structured changelogs for atlas-updater to apply — they never write to the atlas directly.

## v3.3 web-verified Subnautica 2 sources

Atlas content as of 2026-05-18 is cross-checked against:

- [Where To Go First In Subnautica 2 — GameSpot](https://www.gamespot.com/articles/subnautica-2-where-to-go-first-walkthrough/1100-6539936/)
- [Subnautica 2 full walkthrough — Sportskeeda](https://www.sportskeeda.com/esports/subnautica-2-walkthrough-all-signals-quests-campaign)
- [Subnautica 2 Vehicles — wikily.gg](https://wikily.gg/subnautica-2/vehicles/)
- [Subnautica 2 Creatures — wikily.gg](https://wikily.gg/subnautica-2/creatures/)
- [Tadpole Haul Chassis fragment locations — allthings.how](https://allthings.how/tadpole-haul-chassis-fragment-locations-in-subnautica-2/)
- [Subnautica 2 Welcome Center walkthrough — Sportskeeda](https://www.sportskeeda.com/esports/subnautica-2-welcome-center-walkthrough-and-best-biomods-take)
- [Subnautica 2 Biomes — wikily.gg](https://wikily.gg/subnautica-2/biomes/)
- [Subnautica 2 Early Access Roadmap — Unknown Worlds](https://unknownworlds.com/en/news/subnautica-2-early-access-roadmap)
- [Subnautica 2 Patch Notes Hub — GameWatcher](https://www.gamewatcher.com/news/subnautica-2-patch-notes-hub-and-roadmap-of-updates-for-2026)
- [Marrowbreach — sub2wiki.com](https://sub2wiki.com/wiki/creatures/marrowbreach/)
- [Subnautica 2 Biomods — wiki.subnautica.com/sn2](https://wiki.subnautica.com/sn2/Biomods)
- [Subnautica 2 — Steam](https://store.steampowered.com/app/1962700/Subnautica_2/)

Nodes flagged `needsRefresh: true` in `js/data.js` are scheduled for the next `atlas-research-scout` pass once the Early Access update cadence picks up.

---

## v3.4 Cinematic Plugins

Four external libraries are now CDN-loaded into `index.html`. Each is wired with a graceful fallback so the atlas still works if the CDN is unreachable.

| Plugin | Purpose | Files |
|---|---|---|
| **GSAP** (3.12) | Cinematic era transitions — full-screen accent flash + banner punch + auto-scroll to new era + keystone glow burst. Triggers via `window.triggerEraTransition(eraId)` whenever the active era advances. | `js/motion.js` (transition logic), `index.html` (CDN script tag) |
| **@panzoom/panzoom** (4.5.1) | Pan + Ctrl-scroll-zoom on the canvas. `Reset Zoom` button restores the default view. Nodes are excluded from drag so clicks still register. | `js/motion.js` (initPanzoom/resetPanzoom), header button |
| **Three.js** (r128) | Optional 3D rotating-tree view. Hex nodes become emissive cylinders arranged in a circular layout per era band, dependency lines drawn between them. Auto-rotates around the y-axis. Drag to orbit, scroll to zoom, click a 3D node to select it in the 2D state. | `js/tree3d.js`, `◈ 3D View` header toggle |
| **Tauri** (1.5) | Native desktop overlay build. Wraps the existing HTML/CSS/JS as a transparent always-on-top window that floats over Subnautica 2 while you play. | `src-tauri/` (Cargo.toml, tauri.conf.json, src/main.rs, build.rs), `package.json` |

### Running the desktop overlay (Tauri)

Prerequisites (one-time):

1. Install **Rust** + Cargo — https://rustup.rs
2. Install **Node.js** 18+ — https://nodejs.org
3. From the project root:
   ```bash
   npm install
   npm run tauri:dev      # develop with hot-reload
   npm run tauri:build    # produce a native installer
   ```

The Tauri window supports:
- **Always-on-top toggle** via `invoke('toggle_overlay')` from the front-end (frameless overlay mode when pinned)
- **Resize** to any size you want next to the game
- **Transparent background** so the abyss palette blends with whatever's beneath

### Running the 3D view

Click the `◈ 3D View` button in the header. The atlas swaps the 2D canvas for a Three.js scene. Drag to orbit, scroll to zoom, click a node sphere to select it. Click the button again to return to 2D.

### GSAP era transition

Auto-fires when you complete enough nodes to advance to a new era. The screen flashes the era's accent color, the era banner punches up briefly, the canvas scrolls to position the new era at the top of your view, and the first keystone in the new tier pulses.

### Panzoom controls

- **Drag** the canvas background (not nodes) to pan
- **Ctrl + scroll wheel** to zoom (normal scroll still scrolls the page)
- **`⊕ Reset Zoom`** button to return to default

---

## Initializing the git repo

The v3.4 build is ready to commit. From the project root:

```bash
git init
git add .
git commit -m "atlas: v3.4 — SN2-verified, GSAP + panzoom + Three.js + Tauri"
# When you create a GitHub repo:
git remote add origin https://github.com/<you>/subnautica2-atlas.git
git branch -M main
git push -u origin main
```

GitHub Pages: Settings → Pages → Deploy from branch `main`, folder `/ (root)`. The atlas goes live at `https://<you>.github.io/subnautica2-atlas/` within ~60s.

---

## Local development

Serve via local HTTP (matches GitHub Pages CDN behavior):

```powershell
cd subnautica2-atlas
python -m http.server 8000
# open http://localhost:8000
```

Or just open `index.html` directly via `file://` for a quick check. Everything works offline:
- Click nodes to mark Acquired / Unacquired
- Toggle Sound for synthesized bubble pops, sonar pings, unlock chimes
- Click Reset to clear progress
- Hover keystone nodes to trigger creature reactions (Reaper passes, Crashfish darts)
- The "Check for Updates" button still requires API access — disabled by default in offline builds

---

## Customization quick-hits

- **Add a node** → `js/data.js` `NODES` array (atlas-updater skill)
- **Change an era's color** → `ERAS[].accent` in `js/data.js` (atlas-updater) or palette vars in `css/base.css` (atlas-visual-identity)
- **Resize the canvas** → `.tree-canvas` in `css/tree.css` and the SVG `viewBox` in `index.html`
- **Add a node icon** → `js/icons.js` `ICONS` object (atlas-icon-smith skill)
- **Add a creature** → `js/creatures.js` `CREATURES` + `CREATURE_META` (atlas-creature-curator skill)
- **Retune motion** → `css/motion.css` keyframes or `js/motion.js` (atlas-motion-director skill)
- **Repalette the whole atlas** → `:root` vars in `css/base.css` (atlas-visual-identity skill)

---

## Stack

- Vanilla HTML / CSS / JS — no framework, no build step, no bundler
- Modular files served as-is by GitHub Pages (one HTTP request per module, CDN-cached)
- Web Audio API for synthesized sounds (no copyrighted samples) — **byte-locked**
- SVG for the logo, connections, hex nodes, creature silhouettes, and node icons
- `localStorage` for progress (with Anthropic `window.storage` fallback)
- `IntersectionObserver` pauses off-screen creatures for performance
- Fonts: Cinzel + Rajdhani (Google Fonts)
- 24 creatures from Subnautica 1 and Subnautica 2 floating across the canvas

---

## Future enhancements (suggested)

- **GSAP** for cinematic era transitions
- **panzoom.js** to pan/zoom the canvas
- **Tauri** to wrap as a desktop overlay (ties into the Subnautica overlay idea)
- **GitHub Actions** workflow for scheduled updates (would need API key as secret)
- **Three.js** for a 3D rotating tree (overkill but spectacular)

---

## Credits
Built with Claude in collaboration. All assets are original — no Subnautica game files included.
