// =========== CHAT / WIKI DRAWER (v3.5) ===========
// Floating chat panel with two modes:
//   1. WIKI — instant local search across all 48 nodes (title/desc/tips/locations/
//      resources/quests). Zero API cost.
//   2. CLAUDE — chat with Claude via the Anthropic API, passing your current
//      atlas state as context. Uses the same API plumbing as checkForUpdates.
//
// Chat history persists to localStorage under subnautica2-chat-v3.5.

let chatMode = 'wiki';
let chatHistory = []; // [{role:'user'|'claude'|'system'|'error', text:string}]
const CHAT_STORAGE_KEY = 'subnautica2-chat-v3.5';

// =========== DRAWER OPEN/CLOSE ===========
function toggleChat(){
  const drawer = document.getElementById('chatDrawer');
  const fab = document.getElementById('chatFab');
  if(!drawer || !fab) return;
  const open = drawer.classList.toggle('open');
  fab.classList.toggle('open', open);
  fab.innerHTML = open ? '×' : '💬';
  if(open){
    updateChatContext();
    renderChatMessages();
    setTimeout(()=>document.getElementById('chatInput')?.focus(), 250);
  }
}

function setChatMode(mode){
  chatMode = mode;
  document.querySelectorAll('.chat-tab').forEach(t=>{
    t.classList.toggle('active', t.dataset.mode === mode);
  });
  const input = document.getElementById('chatInput');
  if(input){
    input.placeholder = mode === 'wiki'
      ? "Search the atlas — 'Tadpole', 'Sulfur Pyres', 'Quaker'..."
      : "Ask Claude — 'what should I do next?', 'where's the Haul Chassis?'...";
  }
  updateChatContext();
}

// =========== CONTEXT BAR ===========
function updateChatContext(){
  const eraEl = document.getElementById('chatContextEra');
  const nodeEl = document.getElementById('chatContextNode');
  const pointsEl = document.getElementById('chatContextPoints');
  if(!eraEl) return;
  const activeEra = (window.ERAS || []).find(e => e.id === (window.getActiveEra ? window.getActiveEra() : 0));
  eraEl.textContent = activeEra ? activeEra.title : '—';
  const sel = window.selectedId && window.nodeById ? window.nodeById(window.selectedId) : null;
  nodeEl.textContent = sel ? sel.title : 'none';
  if(pointsEl) pointsEl.textContent = (window.points != null) ? window.points : '0';
}

// =========== WIKI SEARCH (instant, local) ===========
function searchWiki(query){
  if(!query || !query.trim()) return [];
  const tokens = query.toLowerCase().trim().split(/\s+/).filter(t => t.length > 1);
  if(tokens.length === 0) return [];
  const NODES = window.NODES || [];
  return NODES
    .map(n => ({ node: n, score: scoreNode(n, tokens), hits: matchHits(n, tokens) }))
    .filter(r => r.score > 0)
    .sort((a,b) => b.score - a.score)
    .slice(0, 6);
}

function scoreNode(n, tokens){
  let score = 0;
  const title = (n.title || '').toLowerCase();
  const desc = (n.desc || '').toLowerCase();
  const tips = (n.tips || []).join(' ').toLowerCase();
  const locs = (n.locations || []).join(' ').toLowerCase();
  const resc = (n.resources || []).join(' ').toLowerCase();
  const quests = (n.quests || []).join(' ').toLowerCase();
  const category = (n.category || '').toLowerCase();
  const id = (n.id || '').toLowerCase();
  tokens.forEach(t => {
    if(title.includes(t)) score += 22;
    if(id.includes(t)) score += 10;
    if(category.includes(t)) score += 9;
    if(locs.includes(t)) score += 7;
    if(resc.includes(t)) score += 6;
    if(quests.includes(t)) score += 6;
    if(desc.includes(t)) score += 5;
    if(tips.includes(t)) score += 3;
  });
  return score;
}

function matchHits(n, tokens){
  // Find the best excerpt-worthy sentence containing any token
  const haystacks = [
    ...(n.locations || []).map(s => ({ s, src: 'loc' })),
    ...(n.resources || []).map(s => ({ s, src: 'res' })),
    ...(n.quests || []).map(s => ({ s, src: 'quest' })),
    ...(n.tips || []).map(s => ({ s, src: 'tip' })),
    { s: n.desc || '', src: 'desc' },
  ];
  for(const h of haystacks){
    const low = h.s.toLowerCase();
    if(tokens.some(t => low.includes(t))) return h;
  }
  return { s: n.desc || '', src: 'desc' };
}

function highlightTokens(text, tokens){
  if(!text) return '';
  let out = escapeHtml(text);
  tokens.forEach(t => {
    if(!t) return;
    const re = new RegExp('(' + escapeRegex(t) + ')', 'gi');
    out = out.replace(re, '<mark>$1</mark>');
  });
  return out;
}
function escapeHtml(s){
  return String(s).replace(/[&<>"']/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' })[c]);
}
function escapeRegex(s){ return String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }

function renderWikiResults(query){
  const results = searchWiki(query);
  if(results.length === 0){
    return `<div class="chat-msg system">No matches in the atlas for "<strong>${escapeHtml(query)}</strong>"</div>`;
  }
  const tokens = query.toLowerCase().split(/\s+/).filter(t => t.length > 1);
  const ERAS = window.ERAS || [];
  return results.map(r => {
    const n = r.node;
    const era = ERAS.find(e => e.id === n.tier);
    const state = window.getState ? window.getState(n) : 'locked';
    const hit = r.hits;
    const srcLabel = { loc:'⌖ Location', res:'◈ Resource', quest:'▶ Quest', tip:'💡 Tip', desc:'' }[hit.src] || '';
    return `
      <div class="wiki-card" onclick="jumpToNode('${n.id}')">
        <div class="wc-title">
          ${escapeHtml(n.title)}
          <span class="wc-tier">${era ? era.roman + ' · ' + era.title : 'Tier ' + n.tier}</span>
        </div>
        <div class="wc-badges">
          <span class="wc-badge state-${state}">${state}</span>
          ${n.category ? `<span class="wc-badge cat-${n.category}">${n.category}</span>` : ''}
          <span class="wc-badge cat-${n.type === 'keystone' ? 'quest' : (n.type === 'notable' ? 'tech' : 'tech')}">${n.type}</span>
        </div>
        <div class="wc-excerpt">${srcLabel ? '<strong>'+srcLabel+':</strong> ' : ''}${highlightTokens(hit.s, tokens)}</div>
      </div>
    `;
  }).join('');
}

function jumpToNode(id){
  if(window.selectNode) window.selectNode(id);
  // Scroll the tree to the node
  const node = window.nodeById ? window.nodeById(id) : null;
  if(node){
    const wrap = document.querySelector('.tree-wrap');
    if(wrap){
      wrap.scrollTo({
        top: Math.max(0, node.y - 200),
        left: Math.max(0, node.x - wrap.clientWidth / 2),
        behavior: 'smooth',
      });
    }
  }
  updateChatContext();
}

// =========== ASK CLAUDE ===========
async function askClaude(question){
  const completed = window.completed || new Set();
  const NODES = window.NODES || [];
  const ERAS = window.ERAS || [];
  const sel = window.selectedId && window.nodeById ? window.nodeById(window.selectedId) : null;
  const activeEra = ERAS.find(e => e.id === (window.getActiveEra ? window.getActiveEra() : 0));
  const doneTitles = NODES.filter(n => completed.has(n.id)).map(n => n.title);
  const availTitles = NODES.filter(n => window.isAvailable && window.isAvailable(n)).map(n => n.title);

  const sysPrompt = `You are the Survivor's Atlas — a SN2 (Subnautica 2 / Planet Proteus, Early Access May 2026) progression assistant. The player is using a PoE-style skill tree atlas. Their current state:

Active era: ${activeEra ? activeEra.title + ' (' + activeEra.depth + ')' : 'unknown'}
Selected node: ${sel ? sel.title + ' — ' + (sel.desc || '').slice(0, 120) : 'none'}
Acquired (${doneTitles.length}): ${doneTitles.slice(0, 12).join(', ')}${doneTitles.length > 12 ? '...' : ''}
Available next: ${availTitles.slice(0, 8).join(', ')}

Game knowledge: SN2 is on Planet Proteus. Vehicles are the Tadpole (chassis: ScoutRay/Haul/Seafrog). Late-game = Trident. NoA is the AI companion. Quests are Blackbox Signals (Tuba @ Camp One, Quaker @ Old Habitat, etc.). Biomes: Kelp Forest, Coral Gardens (Graveyard Spires), Alien Ruins, Sulfur Pyres, Sparse Plains (Collector Leviathan), Red Grass Mesa, The Void (Shiver packs). Threats: Marrowbreach (predator), Collector Leviathan (Sparse Plains), Shiver Leviathan (Void packs).

Answer the player's question in 2-4 short paragraphs. Use web_search if needed for current EA patch info. Be specific and actionable. Reference node names exactly as they appear in their state when relevant.`;

  const response = await fetch("https://api.anthropic.com/v1/messages",{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({
      model:"claude-sonnet-4-20250514",
      max_tokens:900,
      system: sysPrompt,
      messages:[{ role:"user", content: question }],
      tools:[{"type":"web_search_20250305","name":"web_search"}],
    }),
  });
  const data = await response.json();
  const text = (data.content||[]).filter(b => b.type==='text').map(b => b.text).join('\n\n').trim();
  return text || '(No response.)';
}

// =========== MESSAGE FLOW ===========
async function sendChat(){
  const input = document.getElementById('chatInput');
  if(!input) return;
  const q = input.value.trim();
  if(!q) return;
  input.value = '';

  chatHistory.push({ role:'user', text: q });

  if(chatMode === 'wiki'){
    chatHistory.push({ role:'wiki', text: q });
    saveChatHistory();
    renderChatMessages();
    return;
  }

  // claude mode
  renderChatMessages();
  showTyping();
  if(window.playSonarPing) window.playSonarPing();

  try{
    const answer = await askClaude(q);
    chatHistory.push({ role:'claude', text: answer });
    if(window.playUnlock) window.playUnlock();
  }catch(e){
    chatHistory.push({ role:'error', text: 'Claude API failed: ' + (e.message || 'unknown error') });
  }
  hideTyping();
  saveChatHistory();
  renderChatMessages();
}

function showTyping(){
  const box = document.getElementById('chatMessages');
  if(!box) return;
  const t = document.createElement('div');
  t.className = 'chat-typing';
  t.id = 'chatTyping';
  t.innerHTML = '<span></span><span></span><span></span>';
  box.appendChild(t);
  box.scrollTop = box.scrollHeight;
}
function hideTyping(){
  const t = document.getElementById('chatTyping');
  if(t) t.remove();
}

function renderChatMessages(){
  const box = document.getElementById('chatMessages');
  if(!box) return;
  if(chatHistory.length === 0){
    box.innerHTML = `<div class="chat-msg system">${chatMode === 'wiki' ? 'Type a keyword to search 48 atlas nodes. Click a result to jump there.' : 'Ask Claude anything about your SN2 run. Your atlas state is automatically included as context.'}</div>`;
    return;
  }
  box.innerHTML = chatHistory.map(m => {
    if(m.role === 'user'){
      return `<div class="chat-msg user">${escapeHtml(m.text)}</div>`;
    }
    if(m.role === 'wiki'){
      return renderWikiResults(m.text);
    }
    if(m.role === 'claude'){
      return `<div class="chat-msg claude">${escapeHtml(m.text)}</div>`;
    }
    if(m.role === 'system'){
      return `<div class="chat-msg system">${escapeHtml(m.text)}</div>`;
    }
    if(m.role === 'error'){
      return `<div class="chat-msg error">${escapeHtml(m.text)}</div>`;
    }
    return '';
  }).join('');
  box.scrollTop = box.scrollHeight;
}

// =========== PERSISTENCE ===========
async function loadChatHistory(){
  try{
    const r = window.Storage ? await window.Storage.get(CHAT_STORAGE_KEY) : null;
    if(r?.value){
      chatHistory = JSON.parse(r.value);
    }
  }catch(e){
    chatHistory = [];
  }
}
async function saveChatHistory(){
  // Trim to last 40 messages to keep storage bounded
  if(chatHistory.length > 40) chatHistory = chatHistory.slice(-40);
  try{
    if(window.Storage) await window.Storage.set(CHAT_STORAGE_KEY, JSON.stringify(chatHistory));
  }catch(e){}
}
function clearChat(){
  if(!confirm('Clear chat history?')) return;
  chatHistory = [];
  saveChatHistory();
  renderChatMessages();
}

// =========== BOOT ===========
loadChatHistory();

window.toggleChat = toggleChat;
window.setChatMode = setChatMode;
window.sendChat = sendChat;
window.jumpToNode = jumpToNode;
window.clearChat = clearChat;
window.updateChatContext = updateChatContext;
