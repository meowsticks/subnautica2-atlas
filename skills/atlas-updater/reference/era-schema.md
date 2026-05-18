# Era Schema

Every entry in the `ERAS` array follows this shape:

```javascript
{
  id: 1,                                    // tier number 0-5 (must match node `tier` values)
  roman: 'I',                                // Roman numeral shown huge on the banner
  title: 'The Shallows',                     // displayed era name
  subtitle: 'Foundation · Build your home',  // smaller text under title
  depth: '0 – 80m',                          // depth range shown on banner
  accent: '#4dd0e1',                         // hex color: glow, line accents, depth box border
  bg: 'linear-gradient(...)',                // CSS background for the banner
  y: 180,                                    // banner's vertical position on canvas
  creature: 'peeper',                        // key into CREATURES object (swimming animation)
  flora: 'reef'                              // OPTIONAL key into FLORA object (sway animation)
}
```

## Existing eras

| id | roman | title | depth | accent color |
|----|-------|-------|-------|--------------|
| 0 | 0 | Prologue | Surface | `#4dd0e1` cyan |
| 1 | I | The Shallows | 0–80m | `#4dd0e1` cyan |
| 2 | II | Kelp Depths | 80–160m | `#3fbfa0` teal |
| 3 | III | Twilight Zone | 160–300m | `#5aa3d8` blue |
| 4 | IV | Mid Ocean | 300–500m | `#8b6dd3` purple |
| 5 | V | The Abyss | 500–1700m+ | `#ff6b35` orange |

## Adding a new era (rare — only if devs added a biome)

1. Insert a new entry in the `ERAS` array with the next available `id`
2. Pick a thematic `accent` color that doesn't clash with neighbors
3. Set `y` to where the banner should appear (banner is 90px tall, sits 130px above the era's nodes)
4. Add a creature silhouette to the `CREATURES` object — original SVG only, no copyrighted art
5. Optionally add flora to `FLORA` object
6. Shift higher-tier era `y` values down to accommodate
7. Expand the canvas height (`.tree-canvas` CSS rule and SVG viewBox) if needed

## Available creature silhouettes
`peeper`, `stalker`, `gasopod`, `reefback`, `leviathan`, `driftpod`

All are original abstract silhouettes — never copies of in-game creatures.

## Available flora
`kelp`, `reef`

## Accent color guidelines
- Shallow tiers: bright, light, blue/cyan family
- Mid tiers: teal → blue → purple gradient
- Deep tiers: warm-shifted (orange, red) for danger contrast
- Never pure white or pure black
- Maintain hex format `#RRGGBB`

## Banner positioning math

Banner sits at `y - 130` from the first node y in the tier. So for an era with nodes starting at y=600, the era `y` value should be 600.

Example: Kelp Depths era has `y: 540` but nodes start at `y: 620` (Scanner Station). The banner CSS does `top: y - 130` to land above the nodes.
