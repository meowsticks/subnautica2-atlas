// =========== ICONS LAYER (L7) ===========
// Node icons and biome flora SVGs. Original art — no copyrighted assets.
// Owned by the `atlas-icon-smith` skill. Reference an icon by string key
// from any NODE entry's `icon` field.

const ICONS = {
  start: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2 L4 8 L4 16 L12 22 L20 16 L20 8 Z"/><circle cx="12" cy="12" r="3" fill="currentColor"/></svg>`,
  habitat: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="9"/><path d="M3 12 H21 M12 3 V21 M5 5 L19 19 M5 19 L19 5"/></svg>`,
  power: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M13 2 L4 14 H11 L10 22 L20 10 H13 Z"/></svg>`,
  bioreactor: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="8"/><path d="M12 4 V8 M12 16 V20 M4 12 H8 M16 12 H20"/><circle cx="12" cy="12" r="3" fill="currentColor"/></svg>`,
  storage: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="8" height="8"/><rect x="13" y="3" width="8" height="8"/><rect x="3" y="13" width="8" height="8"/><rect x="13" y="13" width="8" height="8"/></svg>`,
  light: `<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="9" r="6" opacity="0.4"/><circle cx="12" cy="9" r="3"/><path d="M9 15 L9 20 L15 20 L15 15 Z"/></svg>`,
  beacon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="6" r="2" fill="currentColor"/><path d="M12 8 V22 M8 22 H16 M7 12 Q12 9 17 12 M5 16 Q12 11 19 16"/></svg>`,
  garden: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 22 V12 M8 14 Q12 8 16 14 M6 18 Q12 10 18 18 M10 22 H14"/><circle cx="12" cy="8" r="2"/></svg>`,
  biobed: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="10" width="18" height="6" rx="1"/><path d="M6 10 V6 M18 10 V6 M3 16 V20 M21 16 V20"/></svg>`,
  processor: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="4" y="4" width="16" height="16" rx="2"/><circle cx="9" cy="9" r="1.5" fill="currentColor"/><circle cx="15" cy="9" r="1.5" fill="currentColor"/><path d="M8 14 H16 M8 17 H14"/></svg>`,
  sensor: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="2" fill="currentColor"/><path d="M12 6 A6 6 0 0 1 18 12" opacity="0.7"/><path d="M12 3 A9 9 0 0 1 21 12" opacity="0.4"/></svg>`,
  seaglide: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 12 L8 8 L20 11 L20 13 L8 16 Z"/><circle cx="18" cy="12" r="1.5" fill="#051226"/></svg>`,
  o2: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="8" y="3" width="8" height="16" rx="3"/><path d="M10 19 V22 M14 19 V22 M11 6 H13 V11 H11 Z" fill="currentColor"/></svg>`,
  fins: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M4 6 Q12 4 20 6 L18 18 Q12 20 6 18 Z" opacity="0.6"/><path d="M6 6 V18 M10 5 V19 M14 5 V19 M18 6 V18"/></svg>`,
  tool: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M14 6 L20 12 L14 18 L11 15 L13 13 L4 4 L6 2 L15 11 L17 9 Z"/></svg>`,
  knife: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 21 L8 16 L20 4 L22 6 L10 18 Z"/></svg>`,
  flashlight: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="9" width="10" height="6" rx="1" fill="currentColor"/><path d="M13 8 L21 4 L21 20 L13 16 Z" opacity="0.5"/></svg>`,
  propulsion: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M4 12 L12 6 L12 18 Z"/><circle cx="18" cy="12" r="3" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="18" cy="12" r="1"/></svg>`,
  multiroom: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polygon points="12,3 21,9 21,15 12,21 3,15 3,9"/><path d="M12 3 V21 M3 9 L21 15 M3 15 L21 9"/></svg>`,
  moonpool: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="6" width="18" height="12"/><ellipse cx="12" cy="14" rx="6" ry="2" fill="currentColor" opacity="0.4"/></svg>`,
  modstation: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="14" width="18" height="6"/><path d="M7 14 V8 H11 V14 M13 14 V4 H17 V14"/></svg>`,
  pipes: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12 H8 V6 H16 V18 H21"/></svg>`,
  mvb: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="14" width="18" height="6"/><path d="M5 14 V10 H8 L10 6 H14 L16 10 H19 V14"/></svg>`,
  seamoth: `<svg viewBox="0 0 24 24" fill="currentColor"><ellipse cx="12" cy="12" rx="9" ry="4.5"/><circle cx="8" cy="12" r="1.8" fill="#051226"/><path d="M3 12 L1 9 L1 15 Z M21 12 L23 10 L23 14 Z"/></svg>`,
  torpedo: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 12 L8 9 L20 11 L22 12 L20 13 L8 15 Z"/><path d="M4 9 L7 12 L4 15" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>`,
  walker: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="6" y="5" width="12" height="11" rx="2" fill="currentColor"/><path d="M5 16 L3 22 M19 16 L21 22 M10 16 L9 22 M14 16 L15 22"/><circle cx="10" cy="10" r="1" fill="#051226"/><circle cx="14" cy="10" r="1" fill="#051226"/></svg>`,
  cyclone: `<svg viewBox="0 0 24 24" fill="currentColor"><ellipse cx="12" cy="12" rx="10" ry="3.5"/><rect x="9" y="6" width="6" height="3"/><circle cx="7" cy="12" r="1.3" fill="#051226"/><circle cx="12" cy="12" r="1.3" fill="#051226"/><circle cx="17" cy="12" r="1.3" fill="#051226"/></svg>`,
  upgrade: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 4 L4 12 L8 12 L8 20 L16 20 L16 12 L20 12 Z"/></svg>`,
  thermal: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 22 Q4 14 8 8 Q12 4 12 10 Q16 6 16 12 Q20 16 12 22 Z" fill="currentColor"/></svg>`,
  defense: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2 L20 6 V12 Q20 18 12 22 Q4 18 4 12 V6 Z"/><path d="M9 12 L11 14 L15 9" stroke-width="2"/></svg>`,
  outpost: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="10" r="5"/><path d="M12 15 V21 M9 21 H15 M7 10 H4 M17 10 H20"/></svg>`,

  // v3.2 wiki icons (biome / resource / quest / wreck / volcano)
  biome: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M2 8 Q6 4 10 8 Q14 12 18 8 Q21 6 22 8 M2 13 Q6 9 10 13 Q14 17 18 13 Q21 11 22 13 M2 18 Q6 14 10 18 Q14 22 18 18 Q21 16 22 18"/></svg>`,
  ore: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M5 18 L3 12 L7 5 L13 5 L17 12 L13 18 Z" opacity="0.95"/><path d="M14 6 L18 4 L22 8 L20 12 L17 11 Z" opacity="0.7"/><path d="M7 19 L4 22 L9 22 L11 19 Z" opacity="0.55"/></svg>`,
  quest_flag: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M6 3 H19 L15 8 L19 13 H6 Z" fill="currentColor"/><line x1="6" y1="3" x2="6" y2="22" stroke-width="1.8"/></svg>`,
  wreck: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M2 14 L8 12 L12 13 L16 12 L22 14 L20 18 L15 19 L12 18 L9 19 L4 18 Z" opacity="0.85"/><path d="M10 4 L14 4 L14 12 L10 12 Z" opacity="0.7"/><path d="M11 6 L12 11 L13 6" fill="none" stroke="#051226" stroke-width="0.8"/></svg>`,
  volcano: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M5 21 L10 8 L14 8 L19 21 Z"/><path d="M9 8 L10 3 L12 6 L13 2 L14 8 Z" opacity="0.7"/><circle cx="12" cy="13" r="1.5" fill="#ffb347"/></svg>`,
};

const FLORA = {
  kelp: `<svg width="80" height="60" viewBox="0 0 80 60" fill="#3fbfa0"><path d="M10 60 Q15 30 20 60 Q25 35 30 60 Q35 40 40 60 Q45 25 50 60 Q55 35 60 60 Q65 30 70 60" stroke="#3fbfa0" stroke-width="3" fill="none"/></svg>`,
  reef: `<svg width="80" height="60" viewBox="0 0 80 60" fill="#ff9580"><path d="M10 60 L15 45 L25 50 L20 60 Z M30 60 L40 35 L50 40 L45 60 Z M55 60 L65 45 L72 55 L68 60 Z" opacity="0.6"/></svg>`,
};

window.ICONS = ICONS;
window.FLORA = FLORA;
