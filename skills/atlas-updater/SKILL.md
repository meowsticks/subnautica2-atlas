---
name: atlas-updater
description: Update Dustin's Subnautica 2 Survivor's Atlas — a PoE-style interactive HTML skill tree. Use whenever Dustin asks to update, refresh, patch, or revise the atlas with current Subnautica 2 community findings, patch notes, or route optimizations. Triggers include "update the atlas", "/update atlas", "refresh the survivor's atlas", "patch the SN2 tree", "atlas needs new tips", and any mention of his Subnautica 2 progression tree, skill tree, atlas, or Survivor's Atlas needing fresh data after a game patch or community discovery.
---

# Atlas Updater Skill

Dustin maintains the **Survivor's Atlas** — a single-file HTML interactive skill tree for Subnautica 2 progression. This skill handles every update to that repo, end-to-end.

## When to trigger

- "Update the atlas"
- "/update atlas"
- "Refresh the Survivor's Atlas"
- "Patch the SN2 tree"
- "Subnautica 2 just released patch X — update the tree"
- Any mention of needing fresh data, new community routes, or post-patch revisions for the atlas

If Dustin mentions Subnautica 2 progression *but doesn't explicitly say update*, ask before invoking — he may just want to discuss strategy in chat.

## What the atlas is

- A single `index.html` file at the root of the `subnautica2-atlas` GitHub repo
- Pure static HTML/CSS/JS — runs on GitHub Pages with no backend
- Contains `NODES` and `ERAS` JavaScript arrays that define the tree
- Uses synthesized Web Audio (no copyrighted samples) — never modify the audio code
- Has a version comment at the top: `<!-- Survivor's Atlas vX.Y · last-updated YYYY-MM-DD -->`

## Workflow

### Step 1 — Research (always start here)

Use `web_search` to find current Subnautica 2 information. Search queries in priority order:

1. `Subnautica 2 patch notes [current month] [current year]`
2. `Subnautica 2 route guide [current month] [current year]`
3. `Subnautica 2 [Dustin's current era e.g. "kelp depths"] tips` — if known from context
4. `Subnautica 2 reddit best route` — for community wisdom
5. `Unknown Worlds Subnautica 2 update` — for official news

Cite sources for everything you add. If a tip can't be sourced to a real post-cutoff article, don't add it.

### Step 2 — Locate the file to modify

**If running in Claude Code (file access available):**
- `view` the repo's `index.html`
- Confirm the version comment to know baseline state
- Read the `NODES` and `ERAS` arrays into context

**If running in chat without file access:**
- Ask Dustin to confirm the repo URL or paste the current `NODES` array
- Default assumption: `https://github.com/<user>/subnautica2-atlas`

### Step 3 — Identify and categorize changes

For each finding from research, classify:

- **A. New tip on existing node** — append to the `tips` array (most common, lowest risk)
- **B. New node** — add to `NODES` array; requires picking x/y coords, deps, icon
- **C. Modified description or title** — only if the in-game item was renamed/changed
- **D. Re-balanced dependency** — only if community consensus shifts the optimal route significantly
- **E. New era / tier** — only if devs added a new biome (very rare)
- **F. Deprecated node** — never delete; add `deprecated: true` to the node entry

Always prefer A (tip append) over B (new node). New nodes change the visual layout and risk overlapping existing pieces.

### Step 4 — Apply changes (Claude Code path)

```bash
cd ~/subnautica2-atlas
git pull
```

Then in `index.html`:

1. Use `str_replace` on the specific section you're editing
2. Bump the version comment: `<!-- Survivor's Atlas v2.1 · last-updated 2026-05-17 -->`
3. Never reformat unrelated code
4. Verify all `deps` arrays reference real node IDs after edits

```bash
git add index.html
git commit -m "atlas: <summary> [v2.1]

- <change 1>
- <change 2>

Source: <URL or 'community refresh'>"
git push
```

Report the live URL of the deployed Pages site at the end.

### Step 5 — Apply changes (chat path, no file access)

1. Produce a clean change summary first — what you're changing and why
2. Get Dustin's confirmation before generating the full file
3. Produce a complete updated `index.html` as a downloadable artifact, OR a focused patch he can drop in
4. Provide an exact commit message he can copy

## Preservation rules (do not violate)

**Never:**
- Delete a node ID that already exists (mark `deprecated: true` instead)
- Change x/y coordinates of existing nodes without explicit reason (breaks visual layout)
- Modify the audio synthesis functions (`playBubblePop`, `playSonarPing`, `playUnlock`, `playDeepRumble`)
- Modify the Storage wrapper that handles `window.storage` vs `localStorage` fallback
- Strip the version comment from the HTML header
- Touch the CSS or animation code unless explicitly asked
- Change era IDs (0=Prologue, 1=Shallows, 2=Kelp Depths, 3=Twilight, 4=Mid Ocean, 5=Abyss)

**Always:**
- Preserve keystone status for: `start`, `t1_habitat`, `t2_scanner`, `t3_mvb`, `t4_seamoth`, `t5_prawn`, `t5_cyclone`
- Maintain 5-tier era structure
- Bump the version comment on every change
- Validate that all `deps` references point to existing node IDs
- Cite sources in the commit message

## Schemas

See `reference/node-schema.md` and `reference/era-schema.md` for the exact shape of each entry. The schemas are authoritative — if you're unsure about a field, read them.

## Style and tone

Match Dustin's preferences when reporting back:

- Balanced (summary + details, not pure prose)
- Conversational and encouraging
- Mobile-friendly: scannable, short lists, minimal heavy bolding
- Don't bury the actual changes in flavor text

Report format:
> **Updated atlas → v2.1** *(live in ~1 min at your Pages URL)*
>
> Changes:
> - Added 2 new tips to **Scanner Station** about [...]
> - Added node **t4_thermal_blade** in Mid Ocean tier
> - Fixed dependency on t5_prawn (now requires Depth MK2)
>
> Source: [URL], [URL]
>
> Commit: `atlas: scanner tips + thermal blade [v2.1]`

## Common pitfalls

- Don't invent tips that aren't sourced. Subnautica 2 is recent — your training data may be wrong. Always web-search first.
- Don't reformat the file. Surgical edits only.
- If Dustin's tree state is unclear, ask before adding nodes — he may be at an earlier era than you assume.
- The "Check for Updates" button in the artifact is disabled in offline builds. Don't try to fix it — it's intentional.

## Workflow examples

See `workflows.md` in this skill folder for end-to-end examples of common update tasks.
