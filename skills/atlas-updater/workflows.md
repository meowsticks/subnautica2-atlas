# Atlas Update Workflows

End-to-end examples of common update tasks. Use these as templates.

---

## Workflow 1 — Weekly meta refresh

**Trigger:** "Update the atlas with this week's meta"

**Steps:**

1. `web_search`: `Subnautica 2 tips reddit [current month] [current year]`
2. `web_search`: `Subnautica 2 best route [current month] [current year]`
3. Identify 2–4 highest-value findings. Prefer tactical specifics over generic advice.
4. For each finding:
   - Locate the relevant node in `NODES` array
   - Append the new tip to its `tips` array (don't replace existing tips)
   - Keep tip text under ~120 characters
5. Bump version comment: `v2.X → v2.(X+1)`
6. Commit with summary + cited sources

**Example commit:**
```
atlas: weekly tip refresh [v2.1]

- Scanner Station: added tip on MVB priority scan order
- Seamoth: added tip on perimeter defense pre-Reaper biomes
- Bioreactor: added tip on Reginald fish being optimal fuel

Source: reddit.com/r/subnautica thread Nov 2026
```

---

## Workflow 2 — Post-patch revision

**Trigger:** "Subnautica 2 just released patch 1.4 — update the atlas"

**Steps:**

1. `web_search`: `Subnautica 2 patch 1.4 notes`
2. `web_fetch` the official patch notes page
3. Identify mechanics that changed:
   - Vehicle stats (crush depth, speed, storage)
   - Blueprint locations
   - Resource spawn rates
   - New items or removed items
4. For each affected node:
   - Update `desc` if the item itself changed
   - Update relevant `tips` if strategy shifted
   - If a node became obsolete, mark `deprecated: true`
   - If a new item was added, create a new node (see Workflow 3)
5. Bump version comment with patch reference: `v2.0 → v2.1 (SN2 patch 1.4)`
6. Commit with patch citation

---

## Workflow 3 — Adding a new node

**Trigger:** "Subnautica 2 added a new item called X — add it to the atlas"

**Steps:**

1. Confirm via `web_search` what the item does and when it unlocks (which tier)
2. Pick coordinates:
   - `tier` = matching era (1–5)
   - `y` = within that tier's y-range (see `reference/node-schema.md`)
   - `x` = unused slot, ideally on the same horizontal as similar items
   - Verify no overlap with existing nodes
3. Pick `type`:
   - Major mechanic / vehicle / depth unlock → `keystone`
   - Meaningful unlock that changes how you play → `notable`
   - Supporting item → `normal`
4. Pick `icon` from existing ICONS or create a new SVG
5. Write `desc` (one paragraph, plain text)
6. Write 3–4 `tips`
7. Set `deps` to nodes that must come first
8. Insert into NODES array in roughly tier order
9. Bump version comment

**Template:**
```javascript
{id:'t<tier>_<name>', title:'<Name>', tier:<n>, type:'<normal|notable|keystone>', icon:'<key>',
 desc:'<paragraph>',
 tips:['<tip>','<tip>','<tip>'],
 x:<150-1300>, y:<within tier range>, deps:['<id>','<id>']},
```

---

## Workflow 4 — Just appending tips to one node

**Trigger:** "Add more tips to the Scanner Station"

**Steps:**

1. Confirm what kind of tips Dustin wants (advanced strategy, beginner help, etc.)
2. Optionally `web_search` for current community wisdom on that item
3. Find the node in NODES by ID (e.g., `t2_scanner`)
4. Append to the `tips` array — don't replace
5. Bump version comment
6. Commit with one-line message

This is the lowest-risk update type. Default to this when in doubt.

---

## Workflow 5 — Deprecating a node

**Trigger:** "X got removed from Subnautica 2 — update the atlas"

**Steps:**

1. Confirm via patch notes that the item is actually gone
2. Find the node in NODES
3. Add fields (don't delete the node):
   ```javascript
   deprecated: true,
   deprecatedNote: 'Removed in patch X.Y',
   ```
4. Find all nodes that have this ID in their `deps` array — update them to depend on a still-valid alternative
5. Bump version comment
6. Commit with patch citation

---

## Workflow 6 — Reporting back to Dustin

After any update, end with a structured report:

```
**Updated atlas → v2.X** *(live in ~1 min)*

Changes:
- <bulleted summary>

Source: <URLs>

Commit: <commit message>
```

Keep it scannable. Mobile-friendly. No long prose.

---

## Failure modes to avoid

- **Inventing tips** that aren't sourced. Web-search every claim.
- **Changing coordinates** of existing nodes (breaks user save state visually).
- **Reformatting** the file (huge diffs that obscure real changes).
- **Skipping version bump** (Dustin can't tell what was updated when).
- **Touching audio code** (it's tuned — don't).
- **Removing deprecated nodes** instead of marking them (breaks save state).

---

## Tone reminder

Match Dustin's preferences: balanced, encouraging, conversational. Short summary first, then details. Avoid markdown overkill in the commit message (single line summary + bullet body is plenty).
