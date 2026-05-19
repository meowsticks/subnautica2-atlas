// =========== DATA LAYER (L1) ===========
// NODES, ERAS, VERSION — content owned by the `atlas-updater` skill.
// Schema authority: skills/atlas-updater/reference/{node-schema.md,era-schema.md}
// Preservation: never delete node IDs (use deprecated:true), never shift x/y of
// existing nodes without explicit reason, preserve 5-tier era structure, keystones.

const VERSION = 'v3.7.0';
const VERSION_DATE = '2026-05-19';

// =========== ERAS — Subnautica 2 / Planet Proteus ===========
const ERAS = [
  {id:0, roman:'0', title:'Prologue', subtitle:'Crash on Proteus · NoA awakens', depth:'Surface',
   accent:'#4dd0e1', bg:'radial-gradient(ellipse at top, rgba(77,208,225,0.15), transparent 70%)',
   y:30, creature:'driftpod', flora:null},
  {id:1, roman:'I', title:'Kelp Forest', subtitle:'Foundation · Welcome Center · First Biomods', depth:'Surface – 80m',
   accent:'#4dd0e1', bg:'radial-gradient(ellipse at top, rgba(77,208,225,0.12), transparent 60%), linear-gradient(180deg, rgba(0,229,255,0.04), transparent)',
   y:180, creature:'peeper', flora:'reef'},
  {id:2, roman:'II', title:'Coral Gardens', subtitle:'Tadpole pipeline · Bio Lab unlocks', depth:'80 – 200m',
   accent:'#3fbfa0', bg:'linear-gradient(180deg, rgba(63,191,160,0.08), transparent 70%)',
   y:540, creature:'stalker', flora:'kelp'},
  {id:3, roman:'III', title:'Sulfur Pyres', subtitle:'Thermal vents · Alien Ruins · Chassis upgrades', depth:'200 – 450m',
   accent:'#5aa3d8', bg:'linear-gradient(180deg, rgba(90,163,216,0.08), transparent 70%)',
   y:920, creature:'gasopod', flora:null},
  {id:4, roman:'IV', title:'Sparse Plains', subtitle:'Open ocean · Collector Leviathan · Trident era', depth:'450 – 800m',
   accent:'#8b6dd3', bg:'linear-gradient(180deg, rgba(139,109,211,0.1), transparent 70%)',
   y:1280, creature:'reefback', flora:null},
  {id:5, roman:'V', title:'Red Grass Mesa & Void', subtitle:'Map edge · Shiver packs · Endgame', depth:'1000m+ · Void at 5000m',
   accent:'#ff6b35', bg:'linear-gradient(180deg, rgba(255,107,53,0.12), transparent 60%, rgba(214,40,40,0.08))',
   y:1700, creature:'leviathan', flora:null},
];

// =========== NODES — expanded with tips ===========
const NODES = [
  // PROLOGUE (Tier 0)
  {id:'start', title:'Lifepod Crash', tier:0, type:'keystone', icon:'start',
   desc:'You awaken in an Alterra lifepod, adrift on an alien ocean world. The radio crackles. Survival begins.',
   tips:['Loot the lifepod first — Repair Tool fragments, radio, fabricator are all aboard','Don\'t panic-dive; oxygen is your real currency','Repair the Lifepod hull breaches before exploring far'],
   x:750, y:90, deps:[], autoComplete:true},

  // TIER I — SHALLOWS (Foundation)
  {id:'t1_habitat', title:'First Habitat', tier:1, type:'notable', icon:'habitat',
   desc:'A small starter base near your lifepod: Room + Hatch + Habitat Beacon. A workshop, not a forever home.',
   tips:['Place ~60m east of Lifepod — ocean current there is great for future hydroelectric','Single Room + Hatch is enough; corridors waste materials','Build a window facing the surface for free morale','Easy to dismantle later — pieces return all materials'],
   x:750, y:260, deps:['start']},

  {id:'t1_fabricator', title:'Fabricator', tier:1, type:'normal', icon:'processor',
   desc:'Heart of crafting. Cured fish + filtered water = no more food/water panic.',
   tips:['Cure 5+ Peepers before each long dive','Bladderfish → Filtered Water is the staple','Don\'t waste titanium on placeholder items','Place near your storage for efficient crafting loops'],
   x:550, y:340, deps:['t1_habitat']},

  {id:'t1_processor', title:'Processor', tier:1, type:'normal', icon:'processor',
   desc:'Refines raw materials (titanium ingots, copper ingots, advanced components).',
   tips:['Process 3 titanium → 1 titanium ingot for compact storage','Required for higher-tier base pieces','Stack salt + bleach → disinfected water for safety'],
   x:380, y:430, deps:['t1_fabricator']},

  {id:'t1_lockers', title:'Floor Lockers', tier:1, type:'normal', icon:'storage',
   desc:'30 slots each — far better density than wall lockers.',
   tips:['Label by material type (organic, metal, electronics)','Keep one "field gear" locker near the hatch','Move everything out of your lifepod day 1','Two floor lockers > four wall lockers'],
   x:300, y:260, deps:['t1_habitat']},

  {id:'t1_solar', title:'Solar Panel', tier:1, type:'normal', icon:'power',
   desc:'Daytime power. Cheap, fast, reliable in the shallows.',
   tips:['Mount on top of your base for max sunlight','Power drops sharply below 100m','2-3 panels is enough for a small base','Pair with bioreactor for 24/7 coverage'],
   x:950, y:260, deps:['t1_habitat']},

  {id:'t1_bioreactor', title:'Bioreactor', tier:1, type:'notable', icon:'bioreactor',
   desc:'24-hour power from organic matter. Ends the night blackout problem permanently.',
   tips:['Reginald fish are the best fuel — large + plentiful','Drop in flora too; everything organic burns','One full reactor = ~8 hours of base power','Crucial before scanner station — high draw'],
   x:1100, y:340, deps:['t1_solar']},

  {id:'t1_beacon', title:'Habitat Beacon', tier:1, type:'normal', icon:'beacon',
   desc:'Marks your base from anywhere. Drop more at wrecks and resource clusters.',
   tips:['Rename beacons immediately — "Wreck A" beats "Beacon 4"','Drop one at every interesting wreck','Visible from far underwater — easy nav','Costs almost nothing to craft'],
   x:150, y:340, deps:['t1_habitat']},

  {id:'t1_biobed', title:'Biobed', tier:1, type:'normal', icon:'biobed',
   desc:'Sleep to skip night and restore health. Save point in some builds.',
   tips:['Use to skip dangerous nights when starting out','Restores some health on rest','Place near the hatch for quick access','Pairs with Bioreactor — uninterrupted by darkness'],
   x:600, y:430, deps:['t1_habitat']},

  {id:'t1_garden', title:'Plant Bed', tier:1, type:'normal', icon:'garden',
   desc:'Cultivate exterior plants for sustainable food and crafting materials.',
   tips:['Marblemelon = renewable food + water','Plant cuttings, not whole specimens','Reginald + melon = self-sufficient diet','Cultivate near a window for visibility'],
   x:900, y:430, deps:['t1_habitat']},

  // TIER II — KELP DEPTHS (Intel & Tools)
  {id:'t2_scanner', title:'Scanner Station', tier:2, type:'keystone', icon:'sensor',
   desc:'Mission-critical. Auto-locates fragments, wrecks, and anomalies. Single biggest tool in your arsenal.',
   tips:['Set to Tadpole fragments FIRST — unlocks the vehicle pipeline','Then Modification Station, then Tadpole chassis variants (ScoutRay / Haul)','High power draw — bioreactor strongly recommended','Scanner-tied progression — almost every blueprint flows through this','Relocate base to scan new biomes — Coral Gardens, Sulfur Pyres, Alien Ruins'],
   x:750, y:620, deps:['t1_habitat']},

  {id:'t2_knife', title:'Survival Knife', tier:2, type:'normal', icon:'knife',
   desc:'Cuts kelp, harvests creature samples, fends off small attackers.',
   tips:['SN2\'s Survival Multitool covers cut + smash — 3 Titanium','Required for harvesting Fibrous Pulp, Lucifer Rotsac, and most organics','Use against Marrowbreach if cornered — commit to the engagement','Carry always — weightless and gates most resource collection'],
   x:200, y:620, deps:['t2_scanner']},

  {id:'t2_flashlight', title:'Diving Flashlight', tier:2, type:'normal', icon:'flashlight',
   desc:'Handheld light source for caves and night dives.',
   tips:['Essential before Seaglide unlock','Battery runs out — carry a spare','Less useful once Seaglide is in hand','Still helpful inside dark wrecks'],
   x:400, y:680, deps:['t2_scanner']},

  {id:'t2_seaglide', title:'Seaglide', tier:2, type:'notable', icon:'seaglide',
   desc:'Massive mobility boost with built-in flashlight. Single biggest QoL upgrade before vehicles.',
   tips:['Scan fragments in kelp shallows and floating wrecks','Built-in light replaces standalone flashlight','Battery management matters — craft spares','Pair with Swim Charge Fins for infinite range','Lets you escape most early predators'],
   x:550, y:760, deps:['t2_scanner']},

  {id:'t2_o2tank', title:'High-Cap O2 Tank', tier:2, type:'normal', icon:'o2',
   desc:'Doubles your dive window. Required gear before pushing past 100m without a sub.',
   tips:['Standard Tank → High-Cap → Ultra-High when unlocked','Carry a spare when raiding deep wrecks','Pair with Pipes for cave exploration','Don\'t bother with multiple regular tanks'],
   x:950, y:760, deps:['t2_scanner']},

  {id:'t2_fins', title:'Swim Charge Fins', tier:2, type:'normal', icon:'fins',
   desc:'Recharge Seaglide while you swim. Effectively infinite range.',
   tips:['Recharge passively from leg movement','Combine with Seaglide for "forever" travel','Trade-off: slightly slower than standard fins'],
   x:350, y:830, deps:['t2_seaglide']},

  {id:'t2_repair', title:'Repair Tool', tier:2, type:'normal', icon:'tool',
   desc:'Patches hull breaches, fixes vehicles, mends Lifepod damage.',
   tips:['Carry always — leaks are the #1 base killer','Fix the Lifepod hull breaches for a small story tick','Repairs vehicles too — keep one in every Tadpole','Blueprint scans cluster around the Welcome Center — 3 fragments','Cheap to craft, infinite uses with battery'],
   x:1100, y:830, deps:['t2_scanner']},

  {id:'t2_propulsion', title:'Propulsion Cannon', tier:2, type:'notable', icon:'propulsion',
   desc:'Lifts and hurls objects. Move debris, retrieve sunken loot, push small creatures.',
   tips:['Clears wreck doorways jammed with debris','Move large resource nodes home','Push smaller hostile fish out of your face','Surprisingly fun for navigating tight wrecks'],
   x:1200, y:680, deps:['t2_scanner']},

  // TIER III — TWILIGHT (Construction)
  {id:'t3_multiroom', title:'Multipurpose Room', tier:3, type:'normal', icon:'multiroom',
   desc:'Larger base footprint. Required for some advanced facilities.',
   tips:['Required for Bioreactor placement in some builds','Vertical stack with ladders for multi-floor bases','Use Reinforcements at depth — hull integrity matters','Window panels work on multi-rooms too'],
   x:300, y:1000, deps:['t1_habitat']},

  {id:'t3_modstation', title:'Modification Station', tier:3, type:'normal', icon:'modstation',
   desc:'Required to craft depth modules and tool upgrades.',
   tips:['Place inside base, not exterior','Required for ALL vehicle depth modules','Upgrades stack — keep base materials handy','Often built next to the fabricator'],
   x:500, y:1000, deps:['t2_seaglide']},

  {id:'t3_mvb', title:'Mobile Vehicle Bay', tier:3, type:'keystone', icon:'mvb',
   desc:'Deployable shipyard. Required to construct the Tadpole and every chassis variant after it.',
   tips:['Fragments scattered in wreckage POIs — scan them!','Deploy near surface for visibility','Recover and redeploy as you move base','Co-op: any party member can ferry the MVB'],
   x:750, y:1000, deps:['t2_scanner']},

  {id:'t3_moonpool', title:'Moonpool', tier:3, type:'notable', icon:'moonpool',
   desc:'Tadpole docking bay (the Tadpole Pens analog inside your habitat). Auto-recharges and protects the sub.',
   tips:['Recharges Tadpole power cells automatically','Pairs with the Modification Station for in-bay chassis swaps','Worth the cost once you have the Tadpole','Big footprint — plan base layout around it','Co-op: multiple moonpools = one Tadpole per crewmate'],
   x:1000, y:1000, deps:['t3_multiroom']},

  {id:'t3_pipes', title:'Pipes & Air Compressor', tier:3, type:'normal', icon:'pipes',
   desc:'Extend breathable air into caves and tunnels.',
   tips:['Place compressor at surface; pipes chain downward','Saves your life in long cave runs','Costs a lot of titanium — plan routes','Combine with Repair Tool for damaged pipe sections'],
   x:1200, y:1000, deps:['t1_habitat']},

  // TIER IV — TADPOLE PIPELINE (the SN2 starter submersible)
  {id:'t4_seamoth', title:'Tadpole Submersible', tier:4, type:'keystone', icon:'seamoth',
   desc:'Subnautica 2\'s starter sub. Single-seat, modular, four upgrade slots. Chassis variants change the loadout entirely. The game opens up the moment you climb in.',
   tips:['Built at the Mobile Vehicle Bay — Tadpole Pens area exposes the blueprint','Four upgrade slots — Storage and Depth MK1 are the first two everyone slots','ScoutRay chassis (fastest, ~1600 cm/s²) lives in the Tadpole Pens — scan it there','Haul chassis fragments cluster around the Cicada Wreck debris field, east of the map','Seafrog (walker) chassis is post-launch in Early Access — flagged as "coming soon"','Co-op: a friend can ride passenger in Haul, up to 3 extra seats'],
   x:750, y:1360, deps:['t3_mvb'], needsRefresh:true},

  {id:'t4_depth1', title:'Depth Module MK1', tier:4, type:'notable', icon:'upgrade',
   desc:'First crush-depth upgrade for the Tadpole. Required to push into the deeper Coral Gardens edges and toward the Sulfur Pyres.',
   tips:['Craft at the Modification Station','Top priority right after the base Tadpole','Unlocks the deeper Coral Gardens + the gate to Sulfur Pyres','Pair with the Sonic Resonator for caves'],
   x:480, y:1440, deps:['t4_seamoth','t3_modstation']},

  {id:'t4_storage', title:'Tadpole Storage Module', tier:4, type:'normal', icon:'storage',
   desc:'Adds cargo capacity to the Tadpole. Long resource runs without it are painful.',
   tips:['Slot first — bare Tadpole has no inventory','Stacks of raw ore deposits fit nicely','Haul Chassis multiplies this further — catamaran cargo pods','Co-op: each crewmate can stash their own loot'],
   x:1000, y:1440, deps:['t4_seamoth']},

  {id:'t4_defense', title:'Tadpole Defense Module', tier:4, type:'normal', icon:'defense',
   desc:'Electric pulse module for the Tadpole. Shocks predators off your hull. Lifesaver in Predator-tier territory.',
   tips:['Costs a small amount of power per pulse','Doesn\'t kill — just repels','Worth slotting before the Sparse Plains (Collector Leviathan range)','Pair with Perimeter Lights to spot threats first'],
   x:200, y:1360, deps:['t4_seamoth']},

  {id:'t4_sonar', title:'Tadpole Sonar Module', tier:4, type:'normal', icon:'sensor',
   desc:'Pulses terrain reveal for the Tadpole. Lifesaver in Alien Ruins tunnels and the Sulfur Pyres caves.',
   tips:['Reveals terrain in radar pulses','Becomes essential past Depth MK1','Drains power — toggle off when not needed','Pairs with the Sonic Resonator for puzzle interactions'],
   x:1300, y:1360, deps:['t4_seamoth']},

  {id:'t4_torpedo', title:'Tadpole Weapons Hardpoint', tier:4, type:'normal', icon:'torpedo',
   desc:'Mountable offensive hardpoint for the Tadpole. Optional but useful against Predator-tier creatures.',
   tips:['Less critical than the Defense Module','Useful for clearing aggressive fauna near resource nodes','Costs more than Perimeter Defense — slot Defense first','Co-op: pair one Tadpole as defender, the other as gatherer'],
   x:1300, y:1500, deps:['t4_seamoth'], needsRefresh:true},

  {id:'t4_outpost', title:'Forward Outpost', tier:4, type:'notable', icon:'outpost',
   desc:'A second base in warmer/deeper waters. Story-relevant location.',
   tips:['Build near the next big biome you\'ll explore','Doesn\'t need to be fancy — Room + Fabricator + Locker','Saves a long swim home','Story signals often point here'],
   x:1000, y:1560, deps:['t4_seamoth']},

  // TIER V — DEEP / SPARSE PLAINS / VOID-ADJACENT
  {id:'t5_depth2', title:'Depth Module MK2', tier:5, type:'notable', icon:'upgrade',
   desc:'Tadpole crush depth upgrade for the deepest Early Access biomes — Red Grass Mesa edges and Void approaches.',
   tips:['Required before pushing into Sparse Plains where the Collector Leviathan hunts','Diminishing returns — the Trident eventually replaces this','Craft after both Storage and Defense are installed'],
   x:300, y:1780, deps:['t4_depth1']},

  {id:'t5_prawn', title:'Tadpole Seafrog Chassis', tier:5, type:'keystone', icon:'walker',
   desc:'Tadpole walker variant — the only Exosuit-type chassis. Walks the seabed (512 cm/s²), swims (800 cm/s²), six granted abilities. Flagged as a post-launch addition coming in a later Early Access update.',
   tips:['Not yet craftable at Early Access launch — flagged "coming soon" in roadmap','Once live: built at MVB, requires Tadpole Pens to dock','Six ability slots — heaviest customization of any chassis','Best for seabed resource runs and tight cave traversal','Co-op: one player walks Seafrog while another scouts on ScoutRay'],
   x:550, y:1880, deps:['t5_depth2'], needsRefresh:true},

  {id:'t5_prawn_drill', title:'Seafrog Drill Arm', tier:5, type:'normal', icon:'tool',
   desc:'Resource-extraction limb for the Seafrog chassis. Mines large ore deposits much faster than by hand.',
   tips:['Releases with the Seafrog chassis (post-launch update)','Pair with Storage Module for solo Sulfur Pyres runs','Drill into raw ore deposits for titanium + copper + quartz in one pass'],
   x:380, y:1980, deps:['t5_prawn'], needsRefresh:true},

  {id:'t5_prawn_grapple', title:'Seafrog Grapple Arm', tier:5, type:'normal', icon:'tool',
   desc:'Grapple-hook limb for the Seafrog chassis. Verticality for cave systems and the Sulfur Pyres columns.',
   tips:['Releases with the Seafrog chassis (post-launch update)','Lets Seafrog scale terrain it cannot walk','Combine with drill arm for ultimate field utility'],
   x:720, y:1980, deps:['t5_prawn'], needsRefresh:true},

  {id:'t5_cyclone', title:'Trident Submarine', tier:5, type:'keystone', icon:'cyclone',
   desc:'Multi-crew submarine, SN2\'s large-vessel tier. Confirmed by Unknown Worlds in the First Dive Showcase. Ships in a later Early Access update — not at launch.',
   tips:['Not yet available — confirmed roadmap content','Multi-crew but balanced for solo play','Internal docking expected for the Tadpole','Plan your base now near a future deployment point','Silent Running and decoys expected to return in some form','Trident is the only safe way to approach the Void after release'],
   x:950, y:1880, deps:['t5_depth2'], needsRefresh:true},

  {id:'t5_thermal', title:'Thermal Power Plant', tier:5, type:'notable', icon:'thermal',
   desc:'Generates power from heat vents. The Sulfur Pyres is the canonical place to deploy these in SN2.',
   tips:['Build directly inside Sulfur Pyres thermal columns','Way more efficient than solar at depth','Crucial for end-game bases — passive infinite power','Co-op: one Pyres base powers a whole shared lair'],
   x:1200, y:1880, deps:['t5_cyclone']},

  // =========== v3.3 WIKI EXPANSION — VERIFIED Subnautica 2 / Planet Proteus ===========
  // Sources: pcgamer, gamespot, gamewith, sportskeeda, gamerant, mobalytics,
  // wikily.gg, subnautica2wiki.cc, thegameswiki — May 2026.
  // Each node carries locations[], resources[], quests[] for the renderer.

  // ---------- TIER 1 WIKI — Kelp Forest start, Welcome Center, basics ----------
  {id:'t1_shallows_biome', title:'Kelp Forest (Starter Biome)', tier:1, type:'notable', icon:'biome',
   category:'biome',
   desc:'Subnautica 2\'s starter biome — towering alien kelp groves native to Proteus (Zezura). Bright, mostly safe, where your Lifepod crashes.',
   locations:['Surrounds the Lifepod from the surface to ~80m','Welcome Center signal sits south-southeast, ~250m from the Lifepod','Camp One sits north-northeast, ~250m from the Lifepod','Old Habitat sits ~380m north of the Lifepod'],
   resources:['Titanium (ubiquitous raw ore deposits)','Copper (cave walls and ceilings)','Quartz (orange coral formations on seafloor — glow at night)','Silver (rare — gates the Standard Air Tank)','Fibrous Pulp, Lucifer Rotsac, Acidic Raion Pouch (SN2 organics)'],
   quests:['Reach the Welcome Center (south-southeast)','Pick up the Tuba blackbox at Camp One (north-northeast)','Power the Welcome Center with a Basic Battery — unlocks Bio Lab + first Biomod'],
   tips:['Do NOT eat native flora/fauna at the start — Digestive Incompatibility starves you. Solve via the Angel Comb puzzle for the Digestion Adaptation','Quartz coral formations glow at night — explore in the dark for easier finds','You can\'t outrun a Predator without the Dash Biomod — get to the Welcome Center first','Carry an Air Bladder always — emergency rapid ascent saves your life and can share air with a co-op partner'],
   x:400, y:170, deps:['start']},

  {id:'t1_titanium', title:'Titanium & Raw Ore', tier:1, type:'normal', icon:'ore',
   category:'resource',
   desc:'Backbone construction metal. Raw Ore deposits process into titanium + copper + quartz all at once in the Processor.',
   locations:['Raw Ore deposits scattered throughout the Kelp Forest seafloor','Old Habitat (380m north of Lifepod) has the Processor blueprint scan','Larger deposits cluster around cave entrances and Coral Garden edges'],
   resources:['Raw Ore → Processor → 1 Titanium + 1 Copper + 1 Quartz','Titanium Ingot: 10 Titanium → 1 Ingot (Processor only, NOT Fabricator)','Required for: Survival Multitool (3 Ti), Repair Tool, Habitat pieces, Bioreactor, Sonic Resonator'],
   tips:['Survival Multitool only costs 3 Titanium — craft it FIRST','Build the Processor INSIDE your habitat, not outside — it\'s a base-only machine','Stockpile 30 Titanium before attempting longer expeditions','Co-op: one player mines Raw Ore while the other runs the Processor at base'],
   x:200, y:170, deps:['t1_shallows_biome'], needsRefresh:true},

  {id:'t1_quartz', title:'Quartz & Glass', tier:1, type:'normal', icon:'ore',
   category:'resource',
   desc:'Quartz is glass — windows, scanners, lights, the Standard Air Tank, Biomod scanner. Glows orange in the dark.',
   locations:['Orange coral formations on the Kelp Forest seafloor (glow at night)','Raw Ore deposits also yield 1 Quartz per processed ore','Denser fields toward the Coral Gardens transition'],
   resources:['Quartz (raw)','Glass (Fabricator: 1 Quartz → 1 Glass)','Required for: Standard Air Tank, Habitat windows, Scanner, Bioscanner, all depth modules'],
   tips:['Night dive the seafloor — the orange coral cluster lights guide you straight to deposits','Stack early — every Tadpole module wants glass','Co-op: share quartz freely; it bottlenecks vehicle progression for the group'],
   x:1300, y:170, deps:['t1_shallows_biome'], needsRefresh:true},

  // ---------- TIER 2 WIKI — Coral Gardens, Old Habitat, blackbox signals ----------
  {id:'t2_kelp_biome', title:'Coral Gardens', tier:2, type:'notable', icon:'biome',
   category:'biome',
   desc:'Elevated underwater plateau, bioluminescent jellyfish-like flora. Mid-depth transition between the Kelp Forest and the deeper biomes. Contains the Graveyard Spires sub-biome with colonist blackboxes about the Proteavirus.',
   locations:['Ring around the Kelp Forest, 80–200m','Graveyard Spires sub-biome inside — lore-dense, contains blackboxes','Easiest reached due south/southeast from the Lifepod'],
   resources:['Larger Raw Ore deposits (titanium, copper, quartz)','Gold (key Tadpole module component — see Subnautica 2 Gold Farming Route)','Silver (denser here than Kelp Forest)','Coral Gardens-specific organics for advanced food/water'],
   quests:['Find the Graveyard Spires blackboxes referencing the World Tree','Locate the Tadpole Pens (ScoutRay Chassis lives here)','Investigate signals about the Proteavirus origin'],
   tips:['Avoid lone exploration here without Dash Biomod equipped','Bring at least Depth-tier swimming gear — Standard Air Tank minimum','Co-op: pair up; one player tanks aggression while the other scans creatures for Biomod unlocks'],
   x:550, y:540, deps:['t2_scanner'], needsRefresh:true},

  {id:'t2_creepvine', title:'Fibrous Pulp & Silicone', tier:2, type:'normal', icon:'ore',
   category:'resource',
   desc:'SN2\'s analog of creepvine fiber. Fibrous Pulp + Acidic Raion Pouch + Lucifer Rotsac feed your fiber/rubber/grease tree — fins, batteries, flexible components.',
   locations:['Kelp Forest groves at depth — pulp clusters hang from the alien kelp','Coral Gardens edges (denser Acidic Raion)','Lucifer Rotsac glow purple at night near caves'],
   resources:['Fibrous Pulp → Fiber Mesh','Acidic Raion Pouch → Acid-grade reagent','Lucifer Rotsac → Bioluminescent component','Silicone Rubber from processed organics'],
   tips:['Cut clusters with the Survival Multitool (knife-equivalent on it)','Stockpile 5 of each — every flexible part wants them','Lucifer Rotsac glows — easier to spot at night','Co-op: one player harvests while another keeps watch for Marrowbreach'],
   x:200, y:830, deps:['t2_kelp_biome','t2_knife'], needsRefresh:true},

  {id:'t2_floating_island', title:'Camp One — Tuba Blackbox', tier:2, type:'notable', icon:'quest_flag',
   category:'quest',
   desc:'Abandoned colonist camp tied to the Tuba blackbox signal. First major NoA-tracked questline branch. Required for Old Habitat (Quaker) signal pickup.',
   locations:['~250m north-northeast of the Lifepod','Surface-accessible — no Tadpole required','Recognizable by colonist structures and cargo crates'],
   resources:['Tuba blackbox (story progression)','PDA fragments + colonist logs','Cached materials (titanium, glass, silicone)','First contact with the Proteavirus arc'],
   quests:['Pick up the Tuba blackbox — gates the Quaker signal at Old Habitat','Scan the Camp One terminal for lore','Collect any cached blueprints in the structures'],
   tips:['NoA will not surface the Quaker signal until you collect Tuba first','Hide in the tunnels if a Marrowbreach approaches — they don\'t follow into tight spaces','Co-op: claim the blackbox together — co-op story progression syncs across the party'],
   x:1300, y:830, deps:['t2_seaglide'], needsRefresh:true},

  // ---------- TIER 3 WIKI — Alien Ruins, Old Habitat, Sulfur Pyres entry ----------
  {id:'t3_grand_reef', title:'Alien Ruins', tier:3, type:'notable', icon:'biome',
   category:'biome',
   desc:'Ancient alien structures reclaimed by Proteus\'s native flora. One of the most lore-dense biomes in Early Access — scannable alien tech and data terminals everywhere.',
   locations:['Mid-depth, accessible from Coral Gardens deeper edges','Multiple entrances — east and south of the Kelp Forest','Some Ruins chambers gate behind the Sonic Resonator tool'],
   resources:['Alien data terminals (scan for blueprints)','High-tier scrap fragments — Tadpole chassis-tier components','Story-critical artifacts','Resource caches inside chambers'],
   quests:['Scan all alien terminals for the Proteavirus lore chain','Solve the Angel Comb puzzle — unlocks Digestion Adaptation Biomod','Track signals NoA picks up from Ruins broadcasts'],
   tips:['"Requires unknown tool" prompts here mean you haven\'t unlocked the gating tool yet — note the location and return','Scan everything — Alien Ruins scans drive most of your mid-game blueprints','Co-op: split the chamber scanning workload — different players unlock different blueprints faster'],
   x:550, y:1100, deps:['t3_mvb'], needsRefresh:true},

  {id:'t3_aurora_wreck', title:'Old Habitat — Quaker Blackbox', tier:3, type:'keystone', icon:'wreck',
   category:'wreck',
   desc:'Abandoned colonist habitat ~380m north of the Lifepod. Holds the Quaker blackbox, the Processor blueprint scan, and several mid-tier fragments. Gated by the Tuba signal from Camp One.',
   locations:['~380m north of the Lifepod','Surface-accessible with a Standard Air Tank + Dash Biomod','Marrowbreach occasionally patrols the approach'],
   resources:['Processor blueprint (scan it inside — required for ingots)','Quaker blackbox (story progression)','Repair Tool blueprint fragments','Cached titanium, batteries, food'],
   quests:['Collect Tuba blackbox at Camp One FIRST — NoA gates Quaker until then','Scan the Processor inside the Old Habitat','Pick up the Quaker blackbox','Track the next NoA signal that unlocks after Quaker'],
   tips:['Bring 2 batteries — one for the Welcome Center power socket, one for personal tools','The Old Habitat has a powered interior — refill O2 + craft inside','If you hear a Marrowbreach roar, retreat into the structure','Co-op: 4-player parties should clear together — the blackbox triggers a shared cutscene'],
   x:150, y:1100, deps:['t2_propulsion','t2_repair'], needsRefresh:true},

  // ---------- TIER 4 WIKI — Sulfur Pyres, Sparse Plains entry ----------
  {id:'t4_mountain_island', title:'Sulfur Pyres', tier:4, type:'notable', icon:'volcano',
   category:'biome',
   desc:'Towering geothermal vents rise from the seafloor of Proteus, surrounded by extreme heat. Mineral-rich and the canonical home of Thermal Power Plant deployment.',
   locations:['West of the Lifepod, ~450m','Recognizable by bright sulfur-filled cave systems with fiery columns','Bordered by the Coral Desert zones'],
   resources:['Thermal vents (Thermal Power Plant — infinite passive energy)','Rich mineral deposits — gold, silver, titanium in dense clusters','Sulfur-themed organics for advanced crafting','Late-game Tadpole module fragments'],
   quests:['Deploy a Thermal Power Plant near the central vents','Scan creatures here for Sulfur Pyres-specific Biomod recipes','Track NoA signals broadcasting from the Pyres'],
   tips:['Carry extra coolant — heat damage stacks fast inside the columns','Tadpole Depth MK1 minimum — heat causes hull stress','Co-op: split-role — one player deploys the Thermal Plant, another farms fragments'],
   x:550, y:1620, deps:['t4_seamoth'], needsRefresh:true},

  {id:'t4_blood_kelp', title:'Sparse Plains — Collector Range', tier:4, type:'normal', icon:'biome',
   category:'biome',
   desc:'A single broad pocket between Coral Gardens and the deeper void, where the seafloor flattens out and creature density drops sharply. Home of the Collector Leviathan.',
   locations:['East after ~700m horizontal swim from the starting area','Sits roughly 20,000–25,000 units horizontally from the Lifepod','Flat, dim seafloor — visibility is your only warning system'],
   resources:['High-tier raw ore deposits','Collector Leviathan scan (very dangerous — Biomod-tier unlock)','Cicada Wreck cargo debris (Haul Chassis fragments)','Late-game blueprint caches'],
   quests:['Reach the Cicada Wreck — Haul Chassis fragments cluster among the cargo containers','Scan a Collector Leviathan from safe distance — granting Predator-tier Biomod','Survive a full traversal without a Collector grab'],
   tips:['The Collector pursues you across biome boundaries — once aggro\'d, it does NOT give up','It throws a stun pulse before grabbing — Dash on the pulse warning','Defense Module on Tadpole + Repulsion Cannon = the only viable counter','Co-op: never split here — pack-tactics keep the Collector confused'],
   x:200, y:1620, deps:['t4_depth1'], needsRefresh:true},

  // ---------- TIER 5 WIKI — Red Grass Mesa, Void, Shiver pack hunting ----------
  {id:'t5_lost_river', title:'Red Grass Mesa', tier:5, type:'keystone', icon:'biome',
   category:'biome',
   desc:'Deep eastern biome ~1000m+ from the starting area. Crimson grass plains and stone outcroppings. Gateway to the Void.',
   locations:['East after ~1000m horizontal swim','Past the Sparse Plains','Final stop before the Void boundary'],
   resources:['Deepest-tier resource nodes','Late-game blueprint fragments','Approach point for the Void','Trident deployment zone (when Trident releases)'],
   quests:['Reach the Red Grass Mesa for the deep-biome NoA signal chain','Stage a base or refuel point here for Void expeditions','Track the final EA-launch story beats'],
   tips:['Bring Tadpole Depth MK2 minimum','Pre-stage extra power cells — recharging this far out is brutal','Build a forward base in the rocks for Void approaches','Co-op: 4-player parties have a much easier time — pack mobility wins here'],
   x:150, y:2050, deps:['t5_cyclone'], needsRefresh:true},

  {id:'t5_lava_zone', title:'The Void — Shiver Packs', tier:5, type:'notable', icon:'volcano',
   category:'biome',
   desc:'The outer boundary of Proteus — a featureless, pitch-black abyss where nothing survives except the Shiver Leviathan packs. The map edge.',
   locations:['Past the Red Grass Mesa, beyond any landmark','Void Leviathans (Shivers) spawn at ~5,000m horizontally','No biome features — only darkness and pack hunters'],
   resources:['Endgame Shiver Leviathan scan (Biomod-tier unlock)','Story-critical secrets (no early-access spoilers)','Achievement and bragging rights for survivors'],
   quests:['Survive a Void traversal — Trident strongly recommended (post-launch)','Scan a Shiver Leviathan from safe distance','Reach the planned story-critical Void beat (Early Access roadmap)'],
   tips:['Shivers attack in packs — faster males flank larger females','They will one-shot the Tadpole — do NOT enter without the Trident (once released)','Pre-route an exit: the Void has no landmarks, you can lose your bearing','Co-op: even 4 players cannot brute-force this — coordinate routes, use Dash, never engage'],
   x:1300, y:2050, deps:['t5_cyclone'], needsRefresh:true},

  // =========== v3.7 PROGRESSION EXPANSION — missions / resources / gear / ships / habitats ===========
  // Adds the four progression spines the player asked for, woven into the
  // existing wiki + tech nodes so every section gates the next:
  //   missions  — quest_flag, story-driven beats (Welcome Center → Bio Lab → Angel Comb → Void)
  //   resources — ore, the raw-material bottlenecks per tier (silver, gold, diamond, kyanite)
  //   gear      — tool, mid-game equipment that gates biomes (resonator, stillsuit)
  //   ships     — seamoth, chassis variants that flank the Tadpole (ScoutRay, Haul)
  //   habitats  — outpost, forward bases that anchor each biome (coral, thermal)
  //   biomods   — power, SN2's mutation system (Dash, Digestion Adaptation)

  // ---------- TIER 1 — Welcome Center mission chain + Dash biomod ----------
  {id:'t1_mission_welcome', title:'Mission: Welcome Center', tier:1, type:'notable', icon:'quest_flag',
   category:'quest',
   desc:'The first major story beat — reach the Welcome Center signal south-southeast of the Lifepod, then power its terminal with a Basic Battery to bring the Bio Lab online. Gates every Biomod and most mid-game crafting.',
   locations:['Welcome Center signal: south-southeast of the Lifepod, ~250m','Surface-swimmable with the standard O2 tank (no Tadpole required)','NoA flags the signal automatically the moment you leave the Lifepod'],
   resources:['Battery charge (Basic Battery, fabricated at the Lifepod fabricator)','Story flag: Bio Lab activation','PDA scans of Alterra Welcome Center terminals (lore)'],
   quests:['Reach the Welcome Center within your first 2-3 oxygen cycles','Power the central terminal with a Basic Battery','Bring back a second battery for the Lifepod fabricator','Listen for the NoA signal that unlocks Camp One after the Welcome Center is powered'],
   tips:['Power the terminal first — Bio Lab + Dash Biomod gate behind this','Drop a Habitat Beacon at the door so you can find it from anywhere','Carry a spare Basic Battery — the run is shorter than you think','Co-op: any party member can power the Welcome Center — credit shares across the crew'],
   x:1100, y:170, deps:['start'], newIn:'v3.7.0'},

  {id:'t1_silver', title:'Silver Deposits', tier:1, type:'normal', icon:'ore',
   category:'resource',
   desc:'Silver gates the Standard Air Tank and most early electronics — Wiring Kits, Computer Chips, Power Cells. Rarer than titanium but always within reach of the Kelp Forest.',
   locations:['Sandstone outcrops on the Kelp Forest seafloor','Cave walls 40-80m down (carry a flashlight or scan from the Seaglide)','Denser along the Coral Gardens transition'],
   resources:['Silver (raw)','Silver Ore → Wiring Kit, Battery upgrades, Standard Air Tank','Required for: Standard Air Tank, Wiring Kit, Computer Chip, Power Cell, most Tier-2 electronics'],
   tips:['Stockpile 6+ silver before pushing past 80m — Wiring Kits eat them fast','Easier to spot at night — the deposits glint under the flashlight','Co-op: silver bottlenecks the Wiring Kit supply, share aggressively','Pair runs with quartz expeditions — same depth band'],
   x:600, y:170, deps:['t1_shallows_biome'], newIn:'v3.7.0'},

  {id:'t1_biomod_dash', title:'Dash Biomod', tier:1, type:'keystone', icon:'power',
   category:'biomod',
   desc:'The first and most essential Biomod — a short burst of swim acceleration. Required to outrun Predator-tier creatures (Marrowbreach, Collector spawns). Crafted at the Bio Lab once the Welcome Center is powered.',
   tips:['Equip BEFORE leaving the Kelp Forest — most Predators outrun a bare diver','Short cooldown, recharges from inhaled oxygen','Stacks with Seaglide — Dash + glide = escape velocity','Triggers on the Predator pulse warning — Dash on cue, not after','Co-op: every crewmate should craft one — solo Dash strands the group'],
   x:1300, y:430, deps:['t1_mission_welcome'], newIn:'v3.7.0'},

  // ---------- TIER 2 — Bio Lab + gold/lithium + Digestion biomod + first Forward Outpost ----------
  {id:'t2_bio_lab', title:'Mission: Bio Lab Online', tier:2, type:'keystone', icon:'quest_flag',
   category:'quest',
   desc:'Activate the Bio Lab inside the Welcome Center to enable Biomod crafting. The Bio Lab feeds the Dash Biomod, Digestion Adaptation, and every Predator-scan unlock downstream.',
   locations:['Inside the Welcome Center (powered terminal triggers the unlock)','Bio Lab terminal sits in the lower deck'],
   resources:['Bio Lab crafting access (game-wide unlock)','Biomod recipe slots (Dash, Digestion Adaptation, Predator scans)','Lore terminals on the Proteavirus origin'],
   quests:['Scan all four Bio Lab terminals for the Proteavirus background','Craft your first Biomod (Dash recommended)','Open the Biomod recipe panel — note which scans you still need'],
   tips:['Bio Lab gates the entire Biomod tree — visit it early','Some recipes require creature scans — get the Scanner online first','Co-op: any crewmate crafting a Biomod consumes shared inventory — coordinate'],
   x:1100, y:540, deps:['t1_mission_welcome','t2_scanner'], newIn:'v3.7.0'},

  {id:'t2_gold', title:'Gold Deposits', tier:2, type:'normal', icon:'ore',
   category:'resource',
   desc:'Gold is the Tadpole module backbone — every chassis variant, sonar, and storage upgrade wants it. The Coral Gardens Gold Farming Route covers the densest spawns.',
   locations:['Coral Gardens seafloor (denser than Kelp Forest)','Sandstone outcrops near the Graveyard Spires','Inside Alien Ruins chambers (lore-relevant veins)'],
   resources:['Gold (raw)','Required for: Tadpole Storage Module, Sonar Module, Defense Module, Modification Station upgrades, most Wiring Kits past Tier-2'],
   tips:['One full Coral Gardens loop = 4-6 gold if you know the route','Pair with the Seaglide — gold is too scattered to walk between deposits','Co-op: split the Coral Gardens into wedges per crewmate, regroup at base'],
   x:950, y:540, deps:['t2_kelp_biome'], newIn:'v3.7.0'},

  {id:'t2_biomod_digest', title:'Digestion Adaptation Biomod', tier:2, type:'notable', icon:'power',
   category:'biomod',
   desc:'Eat native Proteus flora and fauna without Digestive Incompatibility starving you. Crafted at the Bio Lab after solving the Angel Comb puzzle in the Alien Ruins.',
   tips:['Without it, native fauna gives zero nutrition — Reginald + Marblemelon only','Unlocks every Sulfur-zone organic food chain','Recipe gates behind the Angel Comb puzzle (Tier 3 quest)','Once equipped, you can eat Lucifer Rotsac and other glow-fauna for huge energy','Co-op: each crewmate needs their own — the buff is per-player'],
   x:1300, y:760, deps:['t2_bio_lab'], newIn:'v3.7.0'},

  {id:'h_coral_outpost', title:'Coral Gardens Forward Outpost', tier:2, type:'notable', icon:'outpost',
   category:'habitat',
   desc:'A small forward base on the Coral Gardens plateau. Saves the long swim home, refills oxygen mid-run, and pre-positions you for the Alien Ruins and Sulfur Pyres pushes.',
   locations:['Build on the plateau ridge ~120m down, south-southeast of the Lifepod','Pick a spot with line-of-sight to a Raw Ore cluster + an Angel Comb spawn','Avoid the Graveyard Spires sub-biome — predator density is too high'],
   resources:['Required pieces: Multipurpose Room, Hatch, Fabricator, 1-2 Lockers, Bioreactor','Recommended: window panel for spotting Marrowbreach, Beacon for navigation','Total cost: ~30 Titanium, 6 Quartz, 4 Silver — one Seaglide trip'],
   quests:['Stage two batteries here before your Old Habitat run','Drop a Beacon so the rest of the crew can find it'],
   tips:['One Bioreactor + cached Reginald = power-stable through the night','Don\'t over-build — this is a refuel post, not a home','Co-op: shared Forward Outpost cuts an hour off Coral Gardens scanning runs','Once you scan the Alien Ruins, this becomes your Resonator-crafting workshop'],
   x:750, y:900, deps:['t2_kelp_biome','t1_habitat'], newIn:'v3.7.0'},

  // ---------- TIER 3 — Diamond, Sonic Resonator gear, Angel Comb puzzle quest ----------
  {id:'t3_diamond', title:'Diamond & Magnetite', tier:3, type:'normal', icon:'ore',
   category:'resource',
   desc:'Diamond gates depth modules and the Sonic Resonator. Magnetite gates the Cyclomotor / Power Cell upgrade. Both cluster around the Alien Ruins.',
   locations:['Alien Ruins floor caves (carry a flashlight — the chamber lights are unreliable)','Coral Gardens deeper cave systems below 180m','Some Sulfur Pyres ledges (heat-risk — Stillsuit recommended)'],
   resources:['Diamond (raw)','Magnetite (raw)','Required for: Sonic Resonator, Tadpole Depth MK1 + MK2, Power Cell upgrade, Stillsuit reinforcement'],
   tips:['Diamond spawns are PER-RUN — scan the cave first, mine on the second pass to budget oxygen','Magnetite throws off the compass — re-bearing before you swim out','Co-op: one crewmate scans, one mines, one carries — bring the Tadpole'],
   x:850, y:1100, deps:['t3_grand_reef'], newIn:'v3.7.0'},

  {id:'t3_resonator', title:'Sonic Resonator', tier:3, type:'keystone', icon:'tool',
   category:'gear',
   desc:'Pulse-tool that opens locked Alien Ruins doors and triggers the Angel Comb puzzle. Crafted at the Modification Station from Diamond + Wiring Kit. Gates the Digestion Adaptation Biomod and several Tier 4 fragments.',
   locations:['Crafted at the Modification Station inside your base','Blueprint scan: inside the deepest Alien Ruins chamber (Resonator pedestal)','Recipe: 2 Diamond, 1 Wiring Kit, 3 Titanium'],
   resources:['Sonic Resonator (handheld tool)','Unlocks: Angel Comb puzzle, Resonator-gated Alien Ruins chambers, Tadpole Sonar puzzle interactions'],
   quests:['Scan the Resonator pedestal in the Alien Ruins','Craft the Resonator and return to the Angel Comb chamber','Use the Resonator on the locked Sulfur Pyres outer ring door'],
   tips:['Carry always — half the Alien Ruins gates behind a Resonator pulse','Battery-powered — keep a spare in your dive locker','Some Tadpole Sonar pings unlock matching Resonator interactions','Co-op: only one Resonator per door — coordinate the lead'],
   x:1100, y:1100, deps:['t3_grand_reef','t3_modstation'], newIn:'v3.7.0'},

  {id:'t3_mission_angel', title:'Mission: Angel Comb Puzzle', tier:3, type:'notable', icon:'quest_flag',
   category:'quest',
   desc:'The signature Alien Ruins puzzle — align the Angel Comb sequence using Sonic Resonator pulses. Solving it unlocks the Digestion Adaptation Biomod recipe at the Bio Lab.',
   locations:['Angel Comb chamber, deep inside the Alien Ruins','Reachable via the Resonator-gated south corridor','Requires Tadpole Depth MK1 to approach safely'],
   resources:['Digestion Adaptation Biomod recipe (unlocks at Bio Lab on solve)','Alien Ruins lore terminal scan','Story flag: Proteavirus mid-arc'],
   quests:['Bring the Sonic Resonator and a full O2 tank','Match the four Angel Comb glyphs in the order shown on the central terminal','Return to the Bio Lab to craft Digestion Adaptation'],
   tips:['Mark the glyph order on a Habitat Beacon name before swimming back','Heat damage rises near the Sulfur Pyres edge — Stillsuit if you can craft it','Co-op: one player triggers, one watches the terminal, one keeps the Tadpole running'],
   x:1300, y:1200, deps:['t3_resonator','t2_bio_lab'], newIn:'v3.7.0'},

  // ---------- TIER 4 — Tadpole chassis variants + kyanite + heat-resist gear ----------
  {id:'v_scout_chassis', title:'Tadpole ScoutRay Chassis', tier:4, type:'notable', icon:'seamoth',
   category:'vehicle',
   desc:'The speed variant of the Tadpole — 1600 cm/s² acceleration, slim profile, two extra utility slots. Best chassis for fragment-hunting runs and outrunning the Collector Leviathan. Blueprint scans live in the Tadpole Pens.',
   locations:['Blueprint fragments: Tadpole Pens inside the Coral Gardens','Built at the Mobile Vehicle Bay — chassis-swap inside your Moonpool','Three fragments total — all in the same Pens chamber'],
   resources:['Crafted from: 2 Gold, 3 Magnetite, 4 Silicone, 1 Wiring Kit','Slots in over the base Tadpole chassis at the Moonpool','Stacks with Depth MK1/2 modules'],
   quests:['Scan all three ScoutRay fragments inside the Tadpole Pens','Return to the MVB and craft the chassis','Use ScoutRay for the Sparse Plains Cicada Wreck run'],
   tips:['Best chassis for scouting, scanning, and outrunning predators','Trades cargo for speed — slot Storage Module first to compensate','Pairs with Swim Charge Fins on dismount for full mobility','Co-op: ScoutRay scouts ahead, Haul follows with cargo'],
   x:300, y:1500, deps:['t4_seamoth','t2_gold'], newIn:'v3.7.0'},

  {id:'v_haul_chassis', title:'Tadpole Haul Chassis', tier:4, type:'notable', icon:'seamoth',
   category:'vehicle',
   desc:'The cargo variant of the Tadpole — catamaran cargo pods, up to three passenger seats, slower but unmatched carry capacity. Blueprint fragments cluster around the Cicada Wreck debris field east of the Sparse Plains.',
   locations:['Blueprint fragments: Cicada Wreck cargo containers, east of the map','Three fragments scattered across the debris field','Built at the Mobile Vehicle Bay — chassis-swap inside your Moonpool'],
   resources:['Crafted from: 3 Gold, 2 Diamond, 6 Titanium Ingot, 2 Wiring Kit','Adds 3 passenger seats and triple the Storage Module capacity','Loses ~30% speed vs base chassis — Sonar Module strongly recommended'],
   quests:['Reach the Cicada Wreck (Sparse Plains run — Collector Leviathan range)','Scan all three Haul fragments among the cargo containers','Return to the MVB and craft the chassis'],
   tips:['The ONLY way to bring a 4-player party along a single Tadpole','Slot Defense Module before the Cicada Wreck run — Collector range','Cargo pods stay attached to your base when chassis-swapping','Co-op: Haul ferries the team, ScoutRay scouts the route'],
   x:1100, y:1500, deps:['t4_seamoth','t4_storage','t4_blood_kelp'], newIn:'v3.7.0'},

  {id:'t4_kyanite', title:'Kyanite & Raw Sulfur', tier:4, type:'normal', icon:'ore',
   category:'resource',
   desc:'Heat-resistant crystals from the Sulfur Pyres. Kyanite gates Depth MK2, the Stillsuit, and the Thermal Power Plant. Raw Sulfur feeds Acid Mushroom recipes and the Seafrog drill arm.',
   locations:['Sulfur Pyres thermal columns (heat damage — bring coolant or Stillsuit)','Kyanite crystal clusters at 350-450m depth inside the Pyres','Raw Sulfur from the sulfur-rich seabed around the central vents'],
   resources:['Kyanite (raw, heat-resistant)','Raw Sulfur (alchemy reagent)','Required for: Tadpole Depth MK2, Stillsuit, Thermal Power Plant, Seafrog Drill Arm'],
   tips:['Cool down between mining sessions — heat stacks and overcooks your tank','Stillsuit + Tadpole Depth MK1 = safe extended Pyres runs','Co-op: one player tanks heat with the Stillsuit, others mine in the safe ring','Stockpile 8 Kyanite before MK2 — it eats the budget fast'],
   x:850, y:1620, deps:['t4_mountain_island'], newIn:'v3.7.0'},

  {id:'t4_stillsuit', title:'Stillsuit (Heat-Resistant)', tier:4, type:'notable', icon:'fins',
   category:'gear',
   desc:'Insulated dive suit that negates Sulfur Pyres heat damage and recycles sweat into drinkable water. Crafted at the Modification Station from Kyanite + Fibrous Pulp. Required for safe deep-Pyres traversal.',
   locations:['Crafted at the Modification Station inside your base','Blueprint scan: data terminal inside the Sulfur Pyres central chamber','Recipe: 4 Kyanite, 3 Fibrous Pulp, 2 Silicone Rubber, 1 Wiring Kit'],
   resources:['Heat resistance: full negation up to 200°C ambient','Water recycling: produces ~1 filtered water per 8 minutes of wear','Required for: Sulfur Pyres long-stays, deep Kyanite runs, Thermal Plant deployment'],
   tips:['Wear before crossing the Pyres column rings — heat ticks add up fast','Pairs with the Tadpole — bake in the Pyres on the outside, refuge inside','Recycled water is a slow drip — still carry filtered backups','Co-op: one Stillsuit per crewmate or pair-tag in safer outer rings'],
   x:1100, y:1620, deps:['t4_kyanite','t3_modstation'], newIn:'v3.7.0'},

  // ---------- TIER 5 — Thermal forward base + Void mission ----------
  {id:'h_thermal_base', title:'Sulfur Pyres Thermal Base', tier:5, type:'notable', icon:'thermal',
   category:'habitat',
   desc:'A permanent base inside the Sulfur Pyres, drawing infinite passive power from a Thermal Power Plant tap. The launchpad for Sparse Plains expeditions and Trident deployment runs.',
   locations:['Build on a stable ledge 50-80m from the central thermal vents','Heat-shielded multiroom + reinforced corridors','Line-of-sight to two thermal taps for redundant power'],
   resources:['Required pieces: 2 Multipurpose Rooms, Thermal Power Plant, Modification Station, Fabricator, 3 Lockers','Recommended: Moonpool for in-bay chassis swaps, Scanner Station for endgame fragments','Total cost: ~80 Titanium Ingot, 8 Kyanite, 6 Gold, 4 Diamond, 2 Wiring Kit'],
   quests:['Survive a full day-night cycle inside the base','Run the Thermal Plant continuously for 24 hours','Stage the first Sparse Plains Cicada Wreck expedition from here'],
   tips:['Stillsuit + Tadpole Defense Module is the minimum kit before this push','Pre-stage power cells — the run home if power fails is brutal','Co-op: 4-player base supports a shared Trident hangar (once it releases)','From here, the Red Grass Mesa and the Void are one Tadpole hop away'],
   x:1100, y:2150, deps:['t5_thermal','h_coral_outpost'], newIn:'v3.7.0'},

  {id:'t5_mission_void', title:'Mission: Void Approach', tier:5, type:'keystone', icon:'quest_flag',
   category:'quest',
   desc:'The endgame mission — stage a Trident expedition to the Void boundary, scan a Shiver Leviathan from safe distance, and recover the planned story-critical artifact. Trident-only; the Tadpole cannot survive a Void encounter.',
   locations:['Stage point: Red Grass Mesa Refuel Outpost or Thermal Base','Approach vector: due east past the Sparse Plains','Engagement zone: 5000m+ horizontal, ~1500m depth (pitch-black abyss)'],
   resources:['Trident (post-launch vehicle) — silent running, decoys, multi-crew','Pre-staged power cells (3+ spares)','Tadpole Defense Module + Stillsuit + every Biomod equipped','Two crewmates minimum for spotter / pilot roles'],
   quests:['Scan a Shiver Leviathan from beyond aggro range','Reach the story-critical Void beat (Early Access roadmap)','Return alive — survival itself is the deliverable'],
   tips:['NEVER engage — Shivers one-shot the Tadpole and outpace the Trident in close','Pre-route an exit and mark it with a Beacon — the Void has no landmarks','Decoys + Silent Running is the only viable approach pattern','Co-op: spotter on sonar, pilot on silent running, gunner on decoys'],
   x:800, y:2250, deps:['t5_cyclone','t5_lava_zone'], newIn:'v3.7.0'},
];

window.NODES = NODES;
window.ERAS = ERAS;
window.VERSION = VERSION;
window.VERSION_DATE = VERSION_DATE;
