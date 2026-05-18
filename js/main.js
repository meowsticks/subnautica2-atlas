// =========== MAIN (boot + glue) ===========
// Loads after every other module. Wires global UI handlers and kicks off
// loadState which renders the tree and spawns the creature ecosystem.

function toggleSound(){
  initAudio();
  window.soundEnabled = !window.soundEnabled;
  const btn = document.getElementById('soundBtn');
  btn.classList.toggle('on', window.soundEnabled);
  btn.innerHTML = window.soundEnabled ? '<span class="sound-pulse"></span>Sound: On' : '♪ Sound: Off';
  if(window.soundEnabled) playSonarPing();
}

async function checkForUpdates(){
  const btn = document.getElementById('updateBtn');
  const panel = document.getElementById('updatePanel');
  const content = document.getElementById('updateContent');
  btn.disabled = true;
  btn.innerHTML = 'Scanning <span class="loading-dot"></span><span class="loading-dot"></span><span class="loading-dot"></span>';
  panel.classList.add('show');
  content.innerHTML = '<em style="color:var(--text-dim)">Pinging the surface for the latest community intel...</em>';
  playSonarPing();

  const doneTitles = NODES.filter(n=>completed.has(n.id)).map(n=>n.title);
  const nextTitles = NODES.filter(n=>isAvailable(n)).map(n=>n.title);
  const activeEra = ERAS.find(e=>e.id === getActiveEra());
  const prompt = `I'm playing Subnautica 2 (the new survival sequel from Unknown Worlds — NOT the original Subnautica or Below Zero).

Current active era: ${activeEra ? activeEra.title : 'unknown'}
Already acquired: ${doneTitles.join(', ') || 'nothing yet'}
Available next: ${nextTitles.join(', ') || 'nothing'}

Search the web for the LATEST Subnautica 2 community tips, route optimizations, and patch updates from the last few weeks. Give me:

1. Route advice — what to prioritize next based on current meta
2. Recent changes — any patches or new finds that affect my plan
3. Watch out for — hazards or wasted-effort traps at my stage

Keep it tight: 3 short sections, plain text, no markdown headers, no preamble.`;

  // v3.5.1: Anthropic API requires key + dangerous-direct-browser-access header
  // when called from a regular browser origin (the artifact-sandboxed proxy is
  // not available here on self-hosted localhost / Pages / Tauri).
  let apiKey = '';
  try{ apiKey = localStorage.getItem('subnautica2-anthropic-key-v3.5') || ''; }catch(e){}
  if(!apiKey){
    if(window.setApiKey){
      const ok = window.setApiKey();
      if(ok) apiKey = (localStorage.getItem('subnautica2-anthropic-key-v3.5') || '');
    }
    if(!apiKey){
      content.innerHTML = `<span style="color:var(--kraken)">Update failed: need an Anthropic API key. Click the 💬 chat button → 🔑 to set one. Or skip — the local atlas works fully offline.</span>`;
      btn.disabled = false;
      btn.innerHTML = '⟲ Check for Updates';
      return;
    }
  }

  try{
    const response = await fetch("https://api.anthropic.com/v1/messages",{
      method:"POST",
      headers:{
        "Content-Type":"application/json",
        "anthropic-version":"2023-06-01",
        "x-api-key": apiKey,
        "anthropic-dangerous-direct-browser-access":"true",
      },
      body:JSON.stringify({
        model:"claude-sonnet-4-20250514",
        max_tokens:1000,
        messages:[{role:"user",content:prompt}],
        tools:[{"type":"web_search_20250305","name":"web_search"}]
      })
    });
    if(!response.ok){
      const errText = await response.text();
      throw new Error('('+response.status+') '+errText.slice(0, 200));
    }
    const data = await response.json();
    const text = (data.content||[]).filter(b=>b.type==='text').map(b=>b.text).join('\n\n').trim();
    content.innerText = text || 'No updates returned. Try again in a moment.';
    playUnlock();
  }catch(e){
    content.innerHTML = `<span style="color:var(--kraken)">Update failed: ${e.message}</span>`;
  }
  btn.disabled = false;
  btn.innerHTML = '⟲ Check for Updates';
}

window.toggleSound = toggleSound;
window.checkForUpdates = checkForUpdates;

// =========== BOOT ===========
spawnParticles();
loadState().then(()=>{
  // v3.4: panzoom enables pan + Ctrl-scroll-zoom on the canvas
  if(window.initPanzoom) window.initPanzoom();
}).catch(()=>{
  if(window.initPanzoom) window.initPanzoom();
});
document.body.addEventListener('click', ()=>{if(!window.audioCtx) initAudio()}, {once:true});
