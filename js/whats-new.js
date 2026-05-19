/* =========== WHAT'S NEW (v3.7.1) — version-change spotlight ===========
   Surfaces nodes flagged with newIn === VERSION so the player notices the
   new batch instead of stumbling onto them. Auto-opens once per version,
   then quiets down until the next bump.
   - Header button "✦ What's New" toggles the popup
   - Lists new nodes grouped by category (mission / resource / gear / etc.)
   - Each row click selects the node (and opens the float panel on mobile) */

const WHATS_NEW_KEY = 'subnautica2-atlas-seen-version-v1';

function getNewNodes(){
  if(typeof NODES === 'undefined' || typeof VERSION === 'undefined') return [];
  return NODES.filter(n => n.newIn === VERSION);
}

function lastSeenVersion(){
  try{ return localStorage.getItem(WHATS_NEW_KEY) || ''; }catch(_){ return ''; }
}
function recordVersionSeen(){
  try{ localStorage.setItem(WHATS_NEW_KEY, VERSION); }catch(_){}
}
// "Got it" button on the footer — acknowledge and dismiss
function markVersionSeen(){
  recordVersionSeen();
  hideWhatsNew();
}

function showWhatsNew(){
  const panel = document.getElementById('whatsNewPanel');
  const body = document.getElementById('whatsNewBody');
  const verEl = document.getElementById('whatsNewVersion');
  if(!panel || !body) return;
  if(verEl) verEl.textContent = VERSION;
  const newNodes = getNewNodes();
  if(!newNodes.length){
    body.innerHTML = `<p class="whats-new-empty">No new entries in this version yet — check back after the next atlas update.</p>`;
    panel.hidden = false;
    return;
  }
  // Group by category, but missions / quests come first because they drive progression
  const ORDER = ['quest','vehicle','gear','biomod','resource','habitat','biome','wreck','tech'];
  const LABELS = {
    quest:'✦ Missions', vehicle:'⛟ Ships & Chassis', gear:'⚒ Gear',
    biomod:'⚛ Biomods', resource:'◈ Raw Materials', habitat:'⌂ Habitat Locations',
    biome:'⌖ Biomes', wreck:'☗ Wrecks', tech:'⚙ Tech',
  };
  const buckets = {};
  newNodes.forEach(n => {
    const k = n.category || 'tech';
    (buckets[k] = buckets[k] || []).push(n);
  });
  const sectionsHtml = ORDER
    .filter(k => buckets[k])
    .map(k => {
      const items = buckets[k]
        .sort((a, b) => (a.tier - b.tier) || a.title.localeCompare(b.title))
        .map(n => {
          const tier = (typeof ERAS !== 'undefined' && ERAS[n.tier]) ? ERAS[n.tier].roman : n.tier;
          const blurb = (n.desc || '').split('. ').slice(0, 2).join('. ');
          const stamp = blurb.endsWith('.') ? blurb : blurb + '.';
          return `
            <button class="whats-new-item" type="button" data-node-id="${n.id}">
              <div class="whats-new-item-head">
                <span class="whats-new-tier">${tier}</span>
                <strong>${n.title}</strong>
              </div>
              <div class="whats-new-desc">${stamp}</div>
            </button>`;
        }).join('');
      return `
        <div class="whats-new-section">
          <h4 class="whats-new-section-title">${LABELS[k] || k.toUpperCase()}</h4>
          <div class="whats-new-section-grid">${items}</div>
        </div>`;
    }).join('');
  body.innerHTML = `
    <p class="whats-new-intro"><strong>${newNodes.length} new entries</strong> added in ${VERSION}. Each carries fresh locations, raw-material routes, quest hooks, and must-read tips. Tap any entry to jump to it on the tree.</p>
    ${sectionsHtml}
  `;
  body.querySelectorAll('.whats-new-item').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.nodeId;
      hideWhatsNew();
      if(typeof selectNode === 'function') selectNode(id);
    });
  });
  panel.hidden = false;
  // Quiet down — the user has now seen this version. (Don't close the
  // panel; they still need to read it.)
  recordVersionSeen();
}

function hideWhatsNew(){
  const el = document.getElementById('whatsNewPanel');
  if(el) el.hidden = true;
}

function toggleWhatsNew(){
  const el = document.getElementById('whatsNewPanel');
  if(!el) return;
  if(el.hidden) showWhatsNew();
  else hideWhatsNew();
}

function initWhatsNew(){
  // Wire dismiss on Esc + background click
  document.addEventListener('keydown', (e) => {
    if(e.key === 'Escape'){
      const el = document.getElementById('whatsNewPanel');
      if(el && !el.hidden) hideWhatsNew();
    }
  });
  // Hide the header button if there's no new content to show
  const btn = document.getElementById('whatsNewBtn');
  if(btn && !getNewNodes().length) btn.hidden = true;
  // Auto-open on first visit to this version
  if(lastSeenVersion() !== VERSION && getNewNodes().length){
    setTimeout(showWhatsNew, 700);
  }
}

window.showWhatsNew = showWhatsNew;
window.hideWhatsNew = hideWhatsNew;
window.toggleWhatsNew = toggleWhatsNew;
window.initWhatsNew = initWhatsNew;
window.markVersionSeen = markVersionSeen;
