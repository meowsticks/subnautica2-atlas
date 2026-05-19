// =========== NODE TREE ENGINE (L2) ===========
// Owned by `atlas-updater`. State, persistence, derived flags, render pipeline.
// Touches CREATURES/ICONS/FLORA from sibling modules but does not own their content.

// ---------- STATE ----------
let completed = new Set();
let selectedId = null;
let lastActiveEra = 0;
let points = 0;
// v3.7.1: track most-recent click for double-click-to-allocate
let _lastDblClickTime = 0;
let _lastDblClickId = null;

// ---------- POINTS ECONOMY ----------
// Each node costs points to acquire. Keystones cost more.
// On load and on era advance we auto-grant enough points to clear the current
// active era (and a buffer toward the next) so the player never feels stuck.
function nodeCost(n){
  if(n.type === 'keystone') return 2;
  return 1;
}

function pointsNeededForEra(eraId){
  return NODES
    .filter(n => n.tier === eraId && n.id !== 'start' && !completed.has(n.id))
    .reduce((s,n) => s + nodeCost(n), 0);
}

function ensurePointsForCurrentEra(){
  const active = getActiveEra();
  // Cover everything still unacquired in the active era + the next one as a buffer.
  const need = NODES
    .filter(n => n.tier <= active + 1 && n.id !== 'start' && !completed.has(n.id))
    .reduce((s,n) => s + nodeCost(n), 0);
  if(points < need){
    points = need;
    window.points = points;
  }
}

// ---------- STORAGE ----------
// Prefers Anthropic's window.storage (in claude.ai artifact view), falls back
// to localStorage (when self-hosted on GitHub Pages, file://, or any browser).
const Storage = {
  async get(key){
    if(typeof window !== 'undefined' && window.storage){
      try{ return await window.storage.get(key); }catch(e){}
    }
    const v = localStorage.getItem(key);
    return v ? {value:v} : null;
  },
  async set(key, value){
    if(typeof window !== 'undefined' && window.storage){
      try{ return await window.storage.set(key, value); }catch(e){}
    }
    localStorage.setItem(key, value);
    return {value};
  }
};

async function loadState(){
  try{
    const r = await Storage.get('subnautica2-progress-v2');
    if(r?.value) completed = new Set(JSON.parse(r.value));
  }catch(e){}
  try{
    const p = await Storage.get('subnautica2-points-v3');
    if(p?.value) points = parseInt(p.value, 10) || 0;
  }catch(e){}
  try{
    const s = await Storage.get('subnautica2-selected-v3');
    if(s?.value) selectedId = s.value || null;
  }catch(e){}
  completed.add('start');
  window.completed = completed;
  window.selectedId = selectedId;
  ensurePointsForCurrentEra();
  await saveState();
  await savePoints();
  render();
  if(window.spawnCreatureLayer) window.spawnCreatureLayer();
  if(window.bindNodeMotion) window.bindNodeMotion();
}
async function saveState(){
  try{await Storage.set('subnautica2-progress-v2', JSON.stringify([...completed]))}
  catch(e){console.error('Save failed',e)}
}
async function savePoints(){
  try{await Storage.set('subnautica2-points-v3', String(points))}
  catch(e){console.error('Points save failed',e)}
}
async function saveSelected(){
  try{await Storage.set('subnautica2-selected-v3', selectedId || '')}
  catch(e){console.error('Selection save failed',e)}
}

// ---------- HELPERS ----------
function isAvailable(node){
  if(completed.has(node.id)) return false;
  return node.deps.every(d => completed.has(d));
}
function getState(node){
  if(completed.has(node.id)) return 'completed';
  if(isAvailable(node)) return 'available';
  return 'locked';
}
function nodeById(id){return NODES.find(n=>n.id===id)}

// Suggested next: prefers keystones, then notables in/near the active era,
// then the lowest-tier available node. Returns null if nothing is available.
function getSuggestedNext(){
  const available = NODES.filter(n => isAvailable(n));
  if(available.length === 0) return null;
  const keystone = available.find(n => n.type === 'keystone');
  if(keystone) return keystone;
  const active = getActiveEra();
  const notable = available.find(n => n.type === 'notable' && n.tier <= active + 1);
  if(notable) return notable;
  return [...available].sort((a,b) => a.tier - b.tier)[0];
}

function getActiveEra(){
  let active = 0;
  ERAS.forEach(era=>{
    const inTier = NODES.filter(n=>n.tier===era.id);
    if(inTier.length===0) return;
    const anyAvail = inTier.some(n=>isAvailable(n));
    const anyDone = inTier.some(n=>completed.has(n.id));
    const allDone = inTier.every(n=>completed.has(n.id));
    if(anyAvail || (anyDone && !allDone)){
      if(era.id > active) active = era.id;
    }
  });
  if(active === 0){
    NODES.forEach(n=>{if(completed.has(n.id) && n.tier > active) active = n.tier});
  }
  return active;
}

// ---------- RENDER ----------
function render(){
  renderEraBanners();
  renderNodes();
  renderConnections();
  renderStats();
  renderPanel();
  updateActiveEraIndicator();
  if(window.bindNodeMotion) window.bindNodeMotion();
}

function renderEraBanners(){
  const container = document.getElementById('eraBanners');
  if(!container) return;
  container.innerHTML = '';
  const activeEra = getActiveEra();
  ERAS.forEach(era=>{
    if(era.id === 0) return;
    const banner = document.createElement('div');
    banner.className = 'era-banner' + (era.id === activeEra ? ' active' : '');
    banner.style.top = (era.y - 130) + 'px';
    banner.style.setProperty('--era-accent', era.accent);
    banner.style.setProperty('--era-bg', era.bg);
    banner.style.setProperty('--era-tint', era.accent.replace(')', ', 0.06)').replace('rgb','rgba').replace('#','rgba(0,0,0,0)'));
    const creatureSvg = CREATURES[era.creature] || '';
    const floraSvg = era.flora ? FLORA[era.flora] : '';
    banner.innerHTML = `
      ${creatureSvg ? `<div class="era-creature" style="--swim-duration:${15 + era.id*3}s">${creatureSvg}</div>` : ''}
      ${floraSvg ? `<div class="era-flora" style="left:8%">${floraSvg}</div><div class="era-flora" style="right:8%;animation-delay:-2s">${floraSvg}</div>` : ''}
      <div class="era-content">
        <div class="era-roman">${era.roman}</div>
        <div class="era-text">
          <div class="era-title">${era.title.toUpperCase()}</div>
          <div class="era-meta">${era.subtitle}</div>
        </div>
        <div class="era-depth">${era.depth}</div>
      </div>
    `;
    container.appendChild(banner);
  });
}

function renderNodes(){
  const container = document.getElementById('nodes');
  if(!container) return;
  container.innerHTML = '';
  const suggested = getSuggestedNext();
  const suggestedId = suggested ? suggested.id : null;
  NODES.forEach(n=>{
    const state = getState(n);
    const el = document.createElement('div');
    const extra = [
      n.id === selectedId ? 'selected' : '',
      n.id === suggestedId ? 'suggested' : '',
    ].filter(Boolean).join(' ');
    el.className = `node ${n.type} ${state} ${extra}`.trim();
    el.style.left = n.x+'px';
    el.style.top = n.y+'px';
    el.dataset.nodeId = n.id;
    el.dataset.tier = n.tier;
    el.onclick = (e)=>{
      const rect = el.getBoundingClientRect();
      if(window.spawnBubbleBurst) window.spawnBubbleBurst(rect.left + rect.width/2, rect.top + rect.height/2);
      if(window.spawnSonarRipple) window.spawnSonarRipple(rect.left + rect.width/2, rect.top + rect.height/2);
      playBubblePop();
      selectNode(n.id);
      // v3.7.1: double-click / double-tap allocates (or refunds) the node,
      // so the player can power-through the tree without going through the
      // panel button each time. Works for mouse and touch — `click` fires on
      // both, and we count two within DOUBLE_CLICK_MS on the same node.
      const now = Date.now();
      if(_lastDblClickId === n.id && (now - _lastDblClickTime) < 350){
        toggleNode(n.id);
        _lastDblClickTime = 0;
        _lastDblClickId = null;
      } else {
        _lastDblClickTime = now;
        _lastDblClickId = n.id;
      }
    };
    el.innerHTML = `
      <div class="node-hex">
        <div class="node-hex-inner">
          <div class="node-icon">${ICONS[n.icon] || ICONS.upgrade}</div>
          <div>${n.title}</div>
        </div>
      </div>
      ${n.type==='keystone' ? `<div class="node-tier-badge">KEYSTONE</div>` : ''}
      ${n.type==='notable' ? `<div class="node-tier-badge">NOTABLE</div>` : ''}
    `;
    container.appendChild(el);
  });
}

function renderConnections(){
  const svg = document.getElementById('connections');
  if(!svg) return;
  svg.innerHTML = '';
  NODES.forEach(n=>{
    n.deps.forEach(depId=>{
      const dep = nodeById(depId);
      if(!dep) return;
      const bothDone = completed.has(n.id) && completed.has(depId);
      const oneDone = completed.has(depId);
      const cls = bothDone ? 'completed' : (oneDone ? 'active' : '');
      const line = document.createElementNS('http://www.w3.org/2000/svg','line');
      line.setAttribute('x1', dep.x);
      line.setAttribute('y1', dep.y);
      line.setAttribute('x2', n.x);
      line.setAttribute('y2', n.y);
      line.setAttribute('class', `connection ${cls}`);
      svg.appendChild(line);
      if(bothDone || oneDone){
        const flow = document.createElementNS('http://www.w3.org/2000/svg','line');
        flow.setAttribute('x1', dep.x);
        flow.setAttribute('y1', dep.y);
        flow.setAttribute('x2', n.x);
        flow.setAttribute('y2', n.y);
        flow.setAttribute('class', `connection-flow show ${bothDone ? '' : 'active'}`);
        svg.appendChild(flow);
      }
    });
  });
}

function renderStats(){
  const bar = document.getElementById('statsBar');
  if(!bar) return;
  const total = NODES.length;
  const done = completed.size;
  const available = NODES.filter(n=>isAvailable(n)).length;
  const keystonesDone = NODES.filter(n=>n.type==='keystone' && completed.has(n.id)).length;
  const keystonesTotal = NODES.filter(n=>n.type==='keystone').length;
  bar.innerHTML = `
    <div class="stat stat-points"><div class="stat-label">Skill Points</div><div class="stat-value">${points}</div></div>
    <div class="stat"><div class="stat-label">Acquired</div><div class="stat-value">${done}<span class="total"> / ${total}</span></div></div>
    <div class="stat"><div class="stat-label">Available Now</div><div class="stat-value">${available}</div></div>
    <div class="stat"><div class="stat-label">Keystones</div><div class="stat-value">${keystonesDone}<span class="total"> / ${keystonesTotal}</span></div></div>
    <div class="stat"><div class="stat-label">Progress</div><div class="stat-value">${Math.round(done/total*100)}<span class="total">%</span></div></div>
  `;
}

function renderPanel(){
  const panel = document.getElementById('panel');
  if(!panel) return;
  const suggested = getSuggestedNext();
  const suggestedBannerHtml = suggested
    ? `<div class="suggested-banner">
         <span class="suggested-arrow">→</span>
         <span class="suggested-label">Next Suggested</span>
         <button class="suggested-link" onclick="selectNode('${suggested.id}')">${suggested.title}</button>
       </div>`
    : '';
  if(!selectedId){
    panel.innerHTML = suggestedBannerHtml + `<div class="empty-state">Select a node on the tree to view its description, prerequisites, and survival tips.</div>`;
    return;
  }
  const n = nodeById(selectedId);
  if(!n){
    panel.innerHTML = suggestedBannerHtml + `<div class="empty-state">Saved selection no longer exists — pick a node on the tree.</div>`;
    return;
  }
  const state = getState(n);
  const era = ERAS.find(e=>e.id===n.tier);
  const depsHtml = n.deps.length === 0 ? '' : `
    <div class="section-label">Prerequisites</div>
    ${n.deps.map(id=>{
      const d = nodeById(id);
      const done = completed.has(id);
      return `<div class="dep-item"><span class="${done?'check':'lock'}">${done?'◆':'◇'}</span><span style="color:${done?'var(--gold)':'var(--text-dim)'}">${d.title}</span></div>`;
    }).join('')}`;
  const tipsHtml = (n.tips && n.tips.length) ? `
    <div class="section-label">Tips & Tricks</div>
    ${n.tips.map(t=>`<div class="tip-item">${t}</div>`).join('')}` : '';
  const locationsHtml = (n.locations && n.locations.length) ? `
    <div class="section-label section-locations"><span class="wiki-marker">⌖</span> Where to Find It</div>
    ${n.locations.map(l=>`<div class="wiki-item wiki-location">${l}</div>`).join('')}` : '';
  const resourcesHtml = (n.resources && n.resources.length) ? `
    <div class="section-label section-resources"><span class="wiki-marker">◈</span> Resources Here</div>
    ${n.resources.map(r=>`<div class="wiki-item wiki-resource">${r}</div>`).join('')}` : '';
  const questsHtml = (n.quests && n.quests.length) ? `
    <div class="section-label section-quests"><span class="wiki-marker">▶</span> Quest Hooks</div>
    ${n.quests.map(q=>`<div class="wiki-item wiki-quest">${q}</div>`).join('')}` : '';
  const refreshNote = n.needsRefresh ? `<div class="wiki-refresh">⟲ This entry is flagged for community refresh — atlas-updater will web-source the latest SN2 specifics.</div>` : '';
  const categoryBadge = n.category ? `<span class="category-badge category-${n.category}">${n.category}</span>` : '';
  const cost = nodeCost(n);
  const canAfford = completed.has(n.id) || points >= cost;
  const costSuffix = completed.has(n.id) ? ` (+${cost} pt${cost>1?'s':''} refund)` : ` (${cost} pt${cost>1?'s':''})`;
  const actionLabel = completed.has(n.id)
    ? `Mark Unacquired${costSuffix}`
    : (state==='available'
        ? `Mark Acquired${costSuffix}`
        : 'Locked');
  const actionDisabled = (state==='locked' || (!completed.has(n.id) && !canAfford)) ? 'disabled' : '';
  const actionClass = completed.has(n.id) ? 'btn-toggle unmark' : 'btn-toggle';
  const savedBadge = `<span class="saved-pill">✓ Saved Selection</span>`;
  panel.innerHTML = `
    ${suggestedBannerHtml}
    <div class="node-tier">${era ? era.roman + ' · ' + era.title.toUpperCase() : ''}</div>
    <h2>${n.title} ${savedBadge}</h2>
    <span class="node-type-badge ${n.type}">${n.type}</span>
    ${categoryBadge}
    <p class="desc">${n.desc}</p>
    ${refreshNote}
    ${depsHtml}
    ${locationsHtml}
    ${resourcesHtml}
    ${questsHtml}
    ${tipsHtml}
    <div class="panel-actions">
      <button class="btn ${actionClass}" onclick="toggleNode('${n.id}')" ${actionDisabled}>${actionLabel}</button>
      <button class="btn btn-popout" onclick="toggleFloatMode()" type="button" title="Open intel in a draggable window">⧉ Pop Out Intel</button>
    </div>
  `;
  // v3.6: mirror to the floating panel if it's currently open
  if(window.mirrorToFloatPanel) window.mirrorToFloatPanel();
}

function updateActiveEraIndicator(){
  const active = getActiveEra();
  const era = ERAS.find(e=>e.id===active);
  const el = document.getElementById('activeEraName');
  if(el && era){
    el.textContent = `— ${era.title.toUpperCase()} —`;
    el.style.color = era.accent;
    if(active !== lastActiveEra && lastActiveEra !== 0){
      playDeepRumble();
      // v3.4: GSAP cinematic transition on era advance
      if(window.triggerEraTransition) window.triggerEraTransition(active);
    }
    lastActiveEra = active;
  }
}

function selectNode(id){
  selectedId = id;
  window.selectedId = id;
  // Repaint selection rings without a full tree rerender
  document.querySelectorAll('.node.selected').forEach(el => el.classList.remove('selected'));
  const sel = document.querySelector(`.node[data-node-id="${id}"]`);
  if(sel) sel.classList.add('selected');
  renderPanel();
  saveSelected();
  // v3.5: refresh the chat drawer's context line if it's open
  if(window.updateChatContext) window.updateChatContext();
  // v3.6: let the floating intel window auto-open (mobile) / sync (desktop).
  // It decides whether to show itself based on viewport + user preference.
  if(window.onNodeSelected) window.onNodeSelected();
}

async function toggleNode(id){
  if(id === 'start') return;
  const n = nodeById(id);
  if(!n) return;
  const cost = nodeCost(n);
  const wasCompleted = completed.has(id);

  if(wasCompleted){
    // Unmark + refund + cascade-unmark broken-dep descendants (also refunded)
    completed.delete(id);
    points += cost;
    let changed = true;
    while(changed){
      changed = false;
      NODES.forEach(m=>{
        if(completed.has(m.id) && !m.deps.every(d=>completed.has(d))){
          completed.delete(m.id);
          points += nodeCost(m);
          changed = true;
        }
      });
    }
  } else {
    if(!n.deps.every(d=>completed.has(d))) return;
    if(points < cost){
      flashInsufficientPoints();
      return;
    }
    completed.add(id);
    points -= cost;

    // Gene-pick burst at the node — DNA decode visual + new sound
    const nodeEl = document.querySelector(`.node[data-node-id="${id}"]`);
    if(nodeEl && window.spawnGenePickBurst){
      const rect = nodeEl.getBoundingClientRect();
      window.spawnGenePickBurst(rect.left + rect.width/2, rect.top + rect.height/2, n.title);
    }
    if(window.playGenePick) window.playGenePick();
    playUnlock();
  }

  // After completion, a new era may have unlocked — top up so the player is
  // never stuck without enough points for the new tier.
  ensurePointsForCurrentEra();

  window.completed = completed;
  window.points = points;
  await saveState();
  await savePoints();
  render();
  // v3.5: refresh chat context
  if(window.updateChatContext) window.updateChatContext();
}

function flashInsufficientPoints(){
  const btn = document.querySelector('.btn-toggle');
  if(!btn) return;
  btn.classList.add('insufficient');
  setTimeout(()=>btn.classList.remove('insufficient'), 700);
}

async function resetProgress(){
  if(!confirm('Reset all progress? This cannot be undone.')) return;
  completed = new Set(['start']);
  selectedId = null;
  window.completed = completed;
  window.selectedId = null;
  await saveState();
  render();
  if(window.spawnCreatureLayer) window.spawnCreatureLayer();
}

// Expose for inline handlers and cross-module access
window.completed = completed;
window.selectedId = selectedId;
window.Storage = Storage;
window.loadState = loadState;
window.saveState = saveState;
window.isAvailable = isAvailable;
window.getState = getState;
window.nodeById = nodeById;
window.getActiveEra = getActiveEra;
window.render = render;
window.selectNode = selectNode;
window.toggleNode = toggleNode;
window.resetProgress = resetProgress;
