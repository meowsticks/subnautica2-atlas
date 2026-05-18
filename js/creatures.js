// =========== CREATURE ECOSYSTEM (L4) ===========
// Owned by `atlas-creature-curator`. Adds a floating layer of SN1 + SN2 fauna
// over the tree canvas. Each creature has an SVG silhouette plus metadata for
// the spawn manager (region, behavior, density).
//
// CREATURES[id] = svg string  (backward-compatible with renderEraBanners)
// CREATURE_META[id] = { region, behavior, size, hoverReact }

// =========== ERA CREATURE SVGS (silhouettes — original art) ===========
const CREATURES = {
  // ---------- existing v2 (preserved byte-identical) ----------
  peeper: `<svg width="60" height="30" viewBox="0 0 60 30" fill="#4dd0e1"><ellipse cx="22" cy="15" rx="18" ry="9"/><circle cx="14" cy="12" r="3" fill="#051226"/><circle cx="14" cy="12" r="1.5" fill="#fff"/><path d="M40 15 L55 8 L55 22 Z"/></svg>`,
  stalker: `<svg width="100" height="40" viewBox="0 0 100 40" fill="#3fbfa0"><path d="M5 22 Q20 14 50 18 Q75 12 95 22 Q75 28 50 25 Q20 30 5 22 Z"/><circle cx="18" cy="20" r="2" fill="#051226"/><path d="M70 18 L78 12 L75 22 Z M82 18 L90 14 L88 24 Z"/></svg>`,
  gasopod: `<svg width="70" height="50" viewBox="0 0 70 50" fill="#5aa3d8"><ellipse cx="35" cy="25" rx="25" ry="18"/><circle cx="55" cy="22" r="3" fill="#051226"/><circle cx="15" cy="20" r="3" opacity="0.7"/><circle cx="20" cy="35" r="2.5" opacity="0.7"/><circle cx="45" cy="40" r="3" opacity="0.7"/></svg>`,
  reefback: `<svg width="140" height="60" viewBox="0 0 140 60" fill="#8b6dd3"><ellipse cx="70" cy="35" rx="60" ry="20"/><path d="M55 18 Q60 5 70 12 Q80 5 85 18 Q75 22 65 22 Z"/><circle cx="110" cy="32" r="2" fill="#051226"/><path d="M10 35 Q5 30 0 38" stroke="#8b6dd3" stroke-width="3" fill="none"/></svg>`,
  leviathan: `<svg width="180" height="60" viewBox="0 0 180 60" fill="#d62828" opacity="0.7"><path d="M5 30 Q40 12 90 22 Q140 12 175 30 Q140 48 90 38 Q40 48 5 30 Z"/><path d="M165 25 L178 18 L172 32 Z"/><circle cx="155" cy="28" r="2.5" fill="#fff"/><path d="M120 18 Q125 8 130 18 M138 16 Q143 6 148 16" stroke="#d62828" stroke-width="2" fill="none"/></svg>`,
  driftpod: `<svg width="40" height="30" viewBox="0 0 40 30" fill="#4dd0e1"><circle cx="20" cy="15" r="10"/><circle cx="20" cy="15" r="4" fill="#051226"/></svg>`,

  // ---------- SN1 expansion ----------
  reaper: `<svg width="220" height="80" viewBox="0 0 220 80" fill="#a8431f"><path d="M5 40 Q60 18 120 30 Q180 18 215 40 Q180 62 120 50 Q60 62 5 40 Z" opacity="0.55"/><path d="M195 28 L218 18 L210 42 Z" opacity="0.6"/><circle cx="185" cy="38" r="3" fill="#fff" opacity="0.9"/><path d="M170 28 L160 14 M178 26 L172 10 M186 26 L184 8 M194 28 L200 12" stroke="#a8431f" stroke-width="2.5" fill="none" opacity="0.8"/><path d="M170 48 L160 62 M178 50 L172 66 M186 50 L184 68" stroke="#a8431f" stroke-width="2" fill="none" opacity="0.7"/></svg>`,
  ghost_leviathan: `<svg width="240" height="60" viewBox="0 0 240 60" fill="#e8f4f8" opacity="0.35"><path d="M5 30 Q50 8 110 22 Q170 8 235 30 Q170 52 110 38 Q50 52 5 30 Z"/><path d="M215 22 L235 14 L228 38 Z"/><circle cx="208" cy="28" r="2.5" fill="#4dd0e1"/><path d="M130 16 L140 4 M150 14 L160 2 M170 14 L180 2" stroke="#e8f4f8" stroke-width="1.5" fill="none"/></svg>`,
  sea_dragon: `<svg width="200" height="80" viewBox="0 0 200 80" fill="#c63a2a"><path d="M10 45 Q40 25 90 35 Q140 20 195 45 Q140 60 90 55 Q40 70 10 45 Z" opacity="0.6"/><path d="M175 32 L195 22 L190 48 Z"/><path d="M170 30 L160 18 M178 28 L172 14 M155 26 L150 12" stroke="#c63a2a" stroke-width="2" fill="none"/><circle cx="183" cy="40" r="2.8" fill="#ffb347"/></svg>`,
  warper: `<svg width="80" height="80" viewBox="0 0 80 80" fill="#7a4dd1"><ellipse cx="40" cy="32" rx="14" ry="18" opacity="0.7"/><path d="M40 50 L26 70 M40 50 L34 72 M40 50 L46 72 M40 50 L54 70" stroke="#7a4dd1" stroke-width="2.5" fill="none"/><circle cx="36" cy="28" r="3" fill="#00e5ff"/><circle cx="44" cy="28" r="3" fill="#00e5ff"/></svg>`,
  crabsquid: `<svg width="90" height="90" viewBox="0 0 90 90" fill="#5b6dd1"><ellipse cx="45" cy="32" rx="26" ry="20"/><circle cx="38" cy="28" r="3" fill="#00e5ff"/><circle cx="52" cy="28" r="3" fill="#00e5ff"/><path d="M25 48 Q20 70 18 86 M35 50 Q34 72 32 88 M45 52 Q45 74 45 90 M55 50 Q56 72 58 88 M65 48 Q70 70 72 86" stroke="#5b6dd1" stroke-width="3" fill="none"/></svg>`,
  bone_shark: `<svg width="110" height="50" viewBox="0 0 110 50" fill="#d8dde8"><path d="M5 25 Q30 12 60 18 Q90 8 105 25 Q90 42 60 35 Q30 38 5 25 Z" opacity="0.7"/><path d="M95 18 L108 8 L102 32 Z"/><circle cx="92" cy="22" r="2" fill="#051226"/><path d="M30 25 L36 18 L40 25 L44 18 L48 25 L52 18 L56 25" stroke="#fff" stroke-width="1.5" fill="none"/></svg>`,
  sand_shark: `<svg width="90" height="40" viewBox="0 0 90 40" fill="#d4a847"><path d="M5 22 Q25 12 55 18 Q75 10 85 22 Q75 32 55 28 Q25 32 5 22 Z"/><path d="M75 18 L88 10 L82 28 Z"/><circle cx="72" cy="20" r="1.8" fill="#051226"/></svg>`,
  crashfish: `<svg width="40" height="40" viewBox="0 0 40 40" fill="#e64a3a"><circle cx="20" cy="20" r="12"/><path d="M20 8 L24 2 L16 2 Z" opacity="0.7"/><path d="M8 24 L2 28 L4 22 Z M32 24 L38 28 L36 22 Z"/><circle cx="20" cy="20" r="3" fill="#ffb347"/></svg>`,
  mesmer: `<svg width="80" height="60" viewBox="0 0 80 60" fill="#a460c8"><ellipse cx="40" cy="30" rx="30" ry="14" opacity="0.55"/><circle cx="40" cy="30" r="10" fill="none" stroke="#ffb347" stroke-width="1.5"/><circle cx="40" cy="30" r="5" fill="none" stroke="#ffb347" stroke-width="1.5"/><circle cx="40" cy="30" r="2" fill="#ffb347"/></svg>`,
  cuddlefish: `<svg width="50" height="35" viewBox="0 0 50 35" fill="#4dc6e0"><ellipse cx="25" cy="18" rx="16" ry="10"/><circle cx="18" cy="15" r="3" fill="#051226"/><circle cx="18" cy="15" r="1.5" fill="#fff"/><circle cx="30" cy="15" r="3" fill="#051226"/><circle cx="30" cy="15" r="1.5" fill="#fff"/><path d="M9 20 L2 14 L2 26 Z M41 20 L48 14 L48 26 Z" opacity="0.7"/></svg>`,
  sea_emperor: `<svg width="280" height="110" viewBox="0 0 280 110" fill="#a07840" opacity="0.5"><ellipse cx="140" cy="55" rx="100" ry="32"/><circle cx="220" cy="44" r="3.5" fill="#fff"/><circle cx="222" cy="58" r="3.5" fill="#fff"/><circle cx="210" cy="40" r="3" fill="#fff"/><circle cx="208" cy="62" r="3" fill="#fff"/><path d="M50 55 Q20 40 5 50 M50 65 Q20 80 5 60 M60 50 Q40 30 30 35 M60 70 Q40 90 30 85" stroke="#a07840" stroke-width="3" fill="none"/></svg>`,
  sea_treader: `<svg width="140" height="90" viewBox="0 0 140 90" fill="#6b8a78" opacity="0.7"><ellipse cx="70" cy="35" rx="50" ry="22"/><circle cx="105" cy="30" r="3" fill="#051226"/><path d="M30 55 L22 88 M50 58 L46 88 M85 58 L88 88 M105 55 L114 88" stroke="#6b8a78" stroke-width="5" fill="none"/></svg>`,
  boomerang: `<svg width="40" height="30" viewBox="0 0 40 30" fill="#ffb347"><path d="M5 15 Q20 5 35 15 Q20 25 5 15 Z"/></svg>`,
  hoverfish: `<svg width="36" height="22" viewBox="0 0 36 22" fill="#4dd0e1"><ellipse cx="14" cy="11" rx="12" ry="6"/><path d="M26 11 L34 7 L34 15 Z"/><circle cx="8" cy="10" r="1.5" fill="#051226"/></svg>`,
  skyray: `<svg width="80" height="40" viewBox="0 0 80 40" fill="#5fa8d8"><path d="M5 22 Q25 5 40 12 Q55 5 75 22 Q55 28 40 22 Q25 28 5 22 Z" opacity="0.6"/><path d="M40 22 L40 38" stroke="#5fa8d8" stroke-width="2"/></svg>`,

  // ---------- SN2 additions ----------
  riftback: `<svg width="120" height="60" viewBox="0 0 120 60" fill="#3fbfd6"><ellipse cx="60" cy="35" rx="50" ry="18" opacity="0.7"/><path d="M40 22 Q50 8 60 16 Q70 8 80 22 Z"/><circle cx="20" cy="35" r="2" fill="#00e5ff"/><circle cx="35" cy="32" r="1.5" fill="#00e5ff"/><circle cx="80" cy="32" r="1.5" fill="#00e5ff"/><circle cx="95" cy="35" r="2" fill="#00e5ff"/></svg>`,
  maned_maranae: `<svg width="70" height="70" viewBox="0 0 70 70" fill="#5e9e4d"><ellipse cx="35" cy="40" rx="18" ry="22"/><path d="M35 18 L25 4 M35 16 L20 8 M35 16 L50 8 M35 18 L45 4 M35 16 L12 14 M35 16 L58 14" stroke="#5e9e4d" stroke-width="2.5" fill="none"/><circle cx="30" cy="38" r="2.5" fill="#051226"/><circle cx="40" cy="38" r="2.5" fill="#051226"/></svg>`,
  drifting_spinefish: `<svg width="60" height="50" viewBox="0 0 60 50" fill="#9b6dd1"><ellipse cx="30" cy="25" rx="16" ry="12"/><path d="M22 12 L18 4 M30 10 L30 2 M38 12 L42 4 M14 18 L4 14 M14 32 L4 36 M22 38 L18 46 M30 40 L30 48 M38 38 L42 46 M46 18 L56 14 M46 32 L56 36" stroke="#9b6dd1" stroke-width="2" fill="none"/><circle cx="38" cy="22" r="2" fill="#ffb347"/></svg>`,
  lumadon: `<svg width="180" height="90" viewBox="0 0 180 90" fill="#ff8a5b" opacity="0.5"><ellipse cx="90" cy="50" rx="75" ry="28"/><circle cx="40" cy="45" r="4" fill="#ffeb3b"/><circle cx="60" cy="50" r="3" fill="#ffeb3b"/><circle cx="80" cy="48" r="3" fill="#ffeb3b"/><circle cx="105" cy="52" r="3" fill="#ffeb3b"/><circle cx="130" cy="48" r="3" fill="#ffeb3b"/><circle cx="150" cy="50" r="3" fill="#ffeb3b"/><path d="M165 42 L178 32 L172 58 Z"/></svg>`,
  nautiloid: `<svg width="70" height="70" viewBox="0 0 70 70" fill="#d8a8e0"><circle cx="35" cy="35" r="24" fill="none" stroke="#d8a8e0" stroke-width="4"/><circle cx="35" cy="35" r="16" fill="none" stroke="#d8a8e0" stroke-width="3"/><circle cx="35" cy="35" r="8" fill="#d8a8e0"/><path d="M35 60 Q30 70 25 68 M35 60 Q40 70 45 68 M35 60 Q35 72 35 70" stroke="#d8a8e0" stroke-width="2" fill="none"/></svg>`,
};

// Spawn metadata. region maps to where the creature drifts on the canvas.
// behavior chooses an animation profile defined in css/creatures.css.
const CREATURE_META = {
  // existing
  peeper:           { region:'shallows',    behavior:'drift',      size:60,  hoverReact:'dart' },
  stalker:          { region:'kelp',        behavior:'drift',      size:100, hoverReact:null },
  gasopod:          { region:'twilight',    behavior:'drift',      size:70,  hoverReact:null },
  reefback:         { region:'mid_ocean',   behavior:'slow_drift', size:140, hoverReact:null },
  leviathan:        { region:'abyss',       behavior:'slow_drift', size:180, hoverReact:null },
  driftpod:         { region:'prologue',    behavior:'idle',       size:40,  hoverReact:null },
  // SN1 expansion
  reaper:           { region:'keystone_v',  behavior:'pass_behind',size:220, hoverReact:'pass' },
  ghost_leviathan:  { region:'abyss_band',  behavior:'drift_deep', size:240, hoverReact:null },
  sea_dragon:       { region:'lava',        behavior:'dormant',    size:200, hoverReact:'puff' },
  warper:           { region:'locked',      behavior:'teleport',   size:80,  hoverReact:null },
  crabsquid:        { region:'twilight',    behavior:'jet_pulse',  size:90,  hoverReact:null },
  bone_shark:       { region:'kelp',        behavior:'sine_weave', size:110, hoverReact:null },
  sand_shark:       { region:'shallows_floor', behavior:'bottom_dart', size:90, hoverReact:null },
  crashfish:        { region:'keystone',    behavior:'idle',       size:40,  hoverReact:'dart_at_cursor' },
  mesmer:           { region:'twilight',    behavior:'ring_pulse', size:80,  hoverReact:null },
  cuddlefish:       { region:'completed',   behavior:'follow_last',size:50,  hoverReact:'wiggle' },
  sea_emperor:      { region:'footer',      behavior:'majestic',   size:280, hoverReact:null },
  sea_treader:      { region:'shallows_floor', behavior:'walk',    size:140, hoverReact:null },
  boomerang:        { region:'shallows',    behavior:'school',     size:40,  hoverReact:null },
  hoverfish:        { region:'shallows',    behavior:'idle_cluster', size:36, hoverReact:null },
  skyray:           { region:'header_sky',  behavior:'high_orbit', size:80,  hoverReact:null },
  // SN2
  riftback:         { region:'mid_ocean',   behavior:'mass_drift', size:120, hoverReact:null },
  maned_maranae:    { region:'kelp',        behavior:'anchored_sway', size:70, hoverReact:null },
  drifting_spinefish:{ region:'twilight',   behavior:'upward_spiral', size:60, hoverReact:null },
  lumadon:          { region:'abyss',       behavior:'bio_pulse',  size:180, hoverReact:null },
  nautiloid:        { region:'tier_iv',     behavior:'tentacle_flutter', size:70, hoverReact:null },
};

// Region → screen anchor on the tree canvas (x%, y px)
const REGION_ANCHORS = {
  prologue:        { xPct:50, y:90,   spread:200 },
  shallows:        { xPct:50, y:300,  spread:600 },
  shallows_floor:  { xPct:50, y:440,  spread:700 },
  kelp:            { xPct:50, y:700,  spread:700 },
  twilight:        { xPct:50, y:1020, spread:700 },
  mid_ocean:       { xPct:50, y:1420, spread:700 },
  abyss:           { xPct:50, y:1820, spread:700 },
  abyss_band:      { xPct:50, y:1900, spread:600 },
  lava:            { xPct:80, y:1950, spread:200 },
  tier_iv:         { xPct:50, y:1480, spread:600 },
  keystone:        { xPct:50, y:1000, spread:1000 },
  keystone_v:      { xPct:50, y:1880, spread:700 },
  locked:          { xPct:50, y:1500, spread:1000 },
  completed:       { xPct:50, y:800,  spread:1000 },
  footer:          { xPct:50, y:2050, spread:600 },
  header_sky:      { xPct:50, y:20,   spread:1200 },
};

// =========== SPAWN MANAGER ===========
function spawnCreatureLayer(){
  const canvas = document.getElementById('canvas');
  if(!canvas) return;
  let layer = document.getElementById('creatureLayer');
  if(layer) layer.remove();
  layer = document.createElement('div');
  layer.id = 'creatureLayer';
  layer.className = 'creature-layer';
  canvas.appendChild(layer);

  // Density scales with progress — peak cinematic always spawns the base set,
  // then adds bonus schools as nodes complete.
  const completedCount = (window.completed && window.completed.size) || 1;
  const densityBonus = Math.min(8, Math.floor(completedCount / 4));

  const spawnPlan = [
    // Always-on ambient
    { id:'skyray',          count:2 },
    { id:'peeper',           count:3 },
    { id:'hoverfish',        count:4 },
    { id:'boomerang',        count:3 },
    { id:'sea_treader',      count:1 },
    { id:'sand_shark',       count:1 },
    { id:'stalker',          count:1 },
    { id:'bone_shark',       count:1 },
    { id:'maned_maranae',    count:2 },
    { id:'gasopod',          count:1 },
    { id:'crabsquid',        count:1 },
    { id:'mesmer',           count:1 },
    { id:'drifting_spinefish', count:2 },
    { id:'reefback',         count:1 },
    { id:'riftback',         count:2 },
    { id:'nautiloid',        count:1 },
    { id:'leviathan',        count:1 },
    { id:'lumadon',          count:1 },
    { id:'ghost_leviathan',  count:1 },
    { id:'reaper',           count:1 },
    { id:'sea_dragon',       count:1 },
    { id:'sea_emperor',      count:1 },
    { id:'warper',           count:2 },
    { id:'crashfish',        count:2 },
    { id:'cuddlefish',       count:Math.min(3, 1 + Math.floor(completedCount/8)) },
    { id:'driftpod',         count:2 + densityBonus },
  ];

  spawnPlan.forEach(({id, count})=>{
    for(let i=0;i<count;i++) spawnCreature(id, i, count, layer);
  });

  // Pause off-screen creatures for perf
  setupVisibilityObserver(layer);
}

function spawnCreature(id, index, total, layer){
  const meta = CREATURE_META[id];
  if(!meta) return;
  const anchor = REGION_ANCHORS[meta.region] || REGION_ANCHORS.shallows;
  const el = document.createElement('div');
  el.className = `creature creature-${meta.behavior} creature-region-${meta.region}`;
  el.dataset.id = id;
  if(meta.hoverReact) el.dataset.react = meta.hoverReact;

  // Spread along anchor band; offset by index for schools
  const seed = (index + 1) / (total + 1);
  const jitter = (Math.random() - 0.5);
  const x = anchor.xPct + (jitter * (anchor.spread / 15));
  const y = anchor.y + (jitter * 80);
  const driftDuration = 18 + Math.random() * 24;
  const driftDelay = -Math.random() * driftDuration;

  el.style.setProperty('--x', x + '%');
  el.style.setProperty('--y', y + 'px');
  el.style.setProperty('--drift-duration', driftDuration + 's');
  el.style.setProperty('--drift-delay', driftDelay + 's');
  el.style.setProperty('--seed', seed.toFixed(3));
  el.style.setProperty('--scale', (0.85 + Math.random() * 0.4).toFixed(2));
  el.innerHTML = CREATURES[id] || '';
  layer.appendChild(el);
}

function setupVisibilityObserver(layer){
  if(!('IntersectionObserver' in window)) return;
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      e.target.style.animationPlayState = e.isIntersecting ? 'running' : 'paused';
    });
  }, { root: document.querySelector('.tree-wrap'), threshold: 0 });
  layer.querySelectorAll('.creature').forEach(c=>io.observe(c));
}

window.CREATURES = CREATURES;
window.CREATURE_META = CREATURE_META;
window.REGION_ANCHORS = REGION_ANCHORS;
window.spawnCreatureLayer = spawnCreatureLayer;
