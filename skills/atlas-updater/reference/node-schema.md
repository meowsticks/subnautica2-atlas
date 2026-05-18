# Node Schema

Every entry in the `NODES` array of `index.html` follows this shape:

```javascript
{
  id: 'unique_string_id',         // permanent; never change once added
  title: 'Display Name',           // shown on node face + in side panel
  tier: 0,                         // era ID: 0=Prologue, 1=Shallows, 2=Kelp, 3=Twilight, 4=Mid, 5=Abyss
  type: 'normal',                  // 'normal' | 'notable' | 'keystone'
  icon: 'iconKey',                 // must match a key in the ICONS object
  desc: 'One paragraph...',         // shown in side panel under title
  tips: [                          // 2-5 tactical tips, shown as bulleted list
    'Tip one',
    'Tip two'
  ],
  x: 750,                          // canvas x in pixels (canvas is 1500px wide)
  y: 260,                          // canvas y in pixels (canvas is 2100px tall)
  deps: ['other_node_id'],         // prerequisite node IDs; must exist in NODES
  autoComplete: false              // OPTIONAL — only `start` uses this
}
```

## ID naming
- `start` for the lifepod prologue node
- `t<tier>_<short>` for everything else: `t1_habitat`, `t2_scanner`, `t4_seamoth`
- Lowercase, underscores only

## Type tiers
- **`normal`** — supporting nodes (storage, lights, small tools). Default. ~84px hex.
- **`notable`** — meaningful unlocks with a `NOTABLE` badge. ~108px hex.
- **`keystone`** — major milestones with an oversized `KEYSTONE` badge. ~140px hex.

## Layout y-ranges by tier

| Tier | Era | Approx y-range |
|------|-----|----------------|
| 0 | Prologue | 80–100 |
| 1 | Shallows | 200–450 |
| 2 | Kelp Depths | 600–850 |
| 3 | Twilight Zone | 970–1050 |
| 4 | Mid Ocean | 1340–1580 |
| 5 | The Abyss | 1780–2000 |

**Always place new nodes within their tier's y-range.** The era banner sits ~130px above the first y in each tier.

## Layout x range
- Keep `x` between **150 and 1300** to avoid clipping
- Avoid placing within ~120px of an existing node at the same y (overlap risk)
- Keystone nodes need extra clearance (140px wide)

## Available icon keys
Existing keys in the `ICONS` object: `start`, `habitat`, `power`, `bioreactor`, `storage`, `light`, `beacon`, `garden`, `biobed`, `processor`, `sensor`, `seaglide`, `o2`, `fins`, `tool`, `knife`, `flashlight`, `propulsion`, `multiroom`, `moonpool`, `modstation`, `pipes`, `mvb`, `seamoth`, `torpedo`, `walker`, `cyclone`, `upgrade`, `thermal`, `defense`, `outpost`.

If a node needs a new icon:
1. Add the SVG to the `ICONS` object with a descriptive key
2. Keep viewBox `0 0 24 24`
3. Use `fill="currentColor"` or `stroke="currentColor"` so it inherits node state color
4. Keep stroke-width consistent (1.5 is the standard in existing icons)

## Deprecating a node

Never delete. Add:
```javascript
deprecated: true,
deprecatedNote: 'Removed in SN2 patch 1.4'
```

The render logic will skip deprecated nodes but preserves their IDs so user save state stays valid.

## Validation checklist before commit

- [ ] `id` is unique across all NODES
- [ ] `tier` is 0–5
- [ ] `type` is one of: normal, notable, keystone
- [ ] `icon` exists in the ICONS object
- [ ] Every entry in `deps` references a real node ID
- [ ] `x` is between 150 and 1300
- [ ] `y` is within the tier's y-range
- [ ] No overlap with existing nodes at similar coordinates
- [ ] `tips` array has 2–5 entries
- [ ] `desc` is one paragraph (no markdown)
