// =========== UI MOTION LAYER (L5) ===========
// Owned by `atlas-motion-director`. Sonar ripples, particle bursts, node hover
// reactions that talk to the creature layer, and the IntersectionObserver perf
// pause. Calls audio functions but never modifies them.

// =========== BUBBLE EFFECTS ===========
function spawnBubbleBurst(x, y, count=10){
  for(let i=0;i<count;i++){
    const b = document.createElement('div');
    b.className = 'bubble-pop';
    const angle = (Math.PI * 2 * i) / count + Math.random()*0.5;
    const dist = 35 + Math.random() * 50;
    b.style.left = x + 'px';
    b.style.top = y + 'px';
    b.style.setProperty('--tx', Math.cos(angle) * dist + 'px');
    b.style.setProperty('--ty', Math.sin(angle) * dist - 20 + 'px');
    b.style.setProperty('--size', (5 + Math.random() * 12) + 'px');
    b.style.animationDelay = (Math.random() * 0.1) + 's';
    document.body.appendChild(b);
    setTimeout(()=>b.remove(), 1000);
  }
}

// =========== SONAR RIPPLE — on node click ===========
function spawnSonarRipple(x, y){
  for(let i=0;i<3;i++){
    const r = document.createElement('div');
    r.className = 'sonar-ripple';
    r.style.left = x + 'px';
    r.style.top = y + 'px';
    r.style.animationDelay = (i * 0.15) + 's';
    document.body.appendChild(r);
    setTimeout(()=>r.remove(), 1400);
  }
}

// =========== GENE-PICK BURST — when a node is acquired ===========
// DNA-helix decode visual matching the SN2 Adaptations panel.
function spawnGenePickBurst(x, y, label){
  const burst = document.createElement('div');
  burst.className = 'gene-pick-burst';
  burst.style.left = x + 'px';
  burst.style.top = y + 'px';
  burst.innerHTML = `
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle class="ring" cx="50" cy="50" r="44"/>
      <circle class="ring" cx="50" cy="50" r="32" opacity="0.35"/>
      <path class="strand" d="M34 10 C58 28, 42 38, 66 50 C42 62, 58 72, 34 90"/>
      <path class="strand" d="M66 10 C42 28, 58 38, 34 50 C58 62, 42 72, 66 90"/>
      <line class="rung" x1="34" y1="18" x2="66" y2="18"/>
      <line class="rung" x1="42" y1="32" x2="58" y2="32"/>
      <line class="rung" x1="34" y1="50" x2="66" y2="50"/>
      <line class="rung" x1="42" y1="68" x2="58" y2="68"/>
      <line class="rung" x1="34" y1="82" x2="66" y2="82"/>
    </svg>
  `;
  document.body.appendChild(burst);
  setTimeout(()=>burst.remove(), 1300);

  if(label){
    const toast = document.createElement('div');
    toast.className = 'gene-pick-toast';
    toast.style.left = x + 'px';
    toast.style.top = (y - 70) + 'px';
    toast.textContent = label;
    document.body.appendChild(toast);
    setTimeout(()=>toast.remove(), 1700);
  }
}

// =========== AMBIENT PARTICLES ===========
function spawnParticles(){
  for(let i=0;i<35;i++){
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.left = Math.random()*100 + 'vw';
    p.style.animationDuration = (15 + Math.random()*20) + 's';
    p.style.animationDelay = -Math.random()*30 + 's';
    p.style.opacity = (0.15 + Math.random()*0.35).toFixed(2);
    document.body.appendChild(p);
  }
}

// =========== NODE HOVER REACTIONS ===========
// On node hover, find the nearest creature in the same region and trigger its
// `data-react` behavior. Plays a soft bubble pop. Throttled per node.

let lastHoverTrigger = 0;
function bindNodeMotion(){
  const nodes = document.querySelectorAll('.node');
  nodes.forEach(node=>{
    if(node.dataset.motionBound) return;
    node.dataset.motionBound = '1';
    node.addEventListener('mouseenter', ()=>{
      const now = performance.now();
      if(now - lastHoverTrigger < 220) return;
      lastHoverTrigger = now;
      playBubblePop();
      reactNearestCreature(node);
    });
  });
}

function reactNearestCreature(node){
  const layer = document.getElementById('creatureLayer');
  if(!layer) return;
  const tier = parseInt(node.dataset.tier, 10);
  const isKeystone = node.classList.contains('keystone');
  const isLocked = node.classList.contains('locked');

  // Pick candidates by node state
  const candidates = Array.from(layer.querySelectorAll('.creature'));
  const filtered = candidates.filter(c=>{
    const react = c.dataset.react;
    if(!react) return false;
    if(isLocked && c.dataset.id === 'warper') return true;
    if(isKeystone && c.dataset.id === 'reaper') return Math.random() < 0.34;
    if(isKeystone && c.dataset.id === 'crashfish') return true;
    return react === 'dart';
  });

  if(filtered.length === 0) return;
  const nodeRect = node.getBoundingClientRect();
  const cx = nodeRect.left + nodeRect.width/2;
  const cy = nodeRect.top + nodeRect.height/2;

  // Pick nearest candidate by viewport distance
  let best = filtered[0], bestDist = Infinity;
  filtered.forEach(c=>{
    const r = c.getBoundingClientRect();
    const dx = (r.left + r.width/2) - cx;
    const dy = (r.top + r.height/2) - cy;
    const d = dx*dx + dy*dy;
    if(d < bestDist){ best = c; bestDist = d; }
  });

  best.classList.remove('react-dart','react-pass','react-puff','react-wiggle','react-dart-at-cursor');
  // Force reflow so the same react can retrigger
  void best.offsetWidth;
  const reactCls = 'react-' + best.dataset.react.replace(/_/g,'-');
  best.classList.add(reactCls);
  setTimeout(()=>best.classList.remove(reactCls), 1600);
}

// =========== GSAP CINEMATIC ERA TRANSITION (v3.4) ===========
// Plays a full-screen flash + camera-style pan to the new era banner + a brief
// zoom-in on the era's first keystone. Graceful no-op if GSAP didn't load.
function triggerEraTransition(eraId){
  if(typeof gsap === 'undefined') {
    // Fallback: legacy CSS flash overlay
    const flash = document.createElement('div');
    flash.className = 'era-advance-flash';
    document.body.appendChild(flash);
    setTimeout(()=>flash.remove(), 1700);
    return;
  }

  const era = (window.ERAS || []).find(e => e.id === eraId);
  if(!era) return;

  // 1. Full-screen accent flash
  const flash = document.createElement('div');
  flash.className = 'era-advance-flash';
  flash.style.background = `radial-gradient(ellipse at center, ${era.accent}33, transparent 70%)`;
  document.body.appendChild(flash);

  // 2. Era banner punch — find the banner and pulse it
  const banner = document.querySelector('.era-banner.active') ||
                 document.querySelectorAll('.era-banner')[Math.max(0, eraId - 1)];

  const tl = gsap.timeline({ onComplete: ()=>flash.remove() });
  tl.fromTo(flash, { opacity: 0 }, { opacity: 1, duration: 0.25, ease: 'power2.out' })
    .to(flash, { opacity: 0, duration: 1.1, ease: 'power2.in' }, '+=0.15');

  if(banner){
    tl.fromTo(banner,
      { scale: 0.96, filter: 'brightness(1)' },
      { scale: 1.0, filter: 'brightness(1.6)', duration: 0.6, ease: 'back.out(1.4)', transformOrigin: 'center' },
      0
    ).to(banner,
      { filter: 'brightness(1)', duration: 0.9, ease: 'power2.out' },
      '>'
    );
  }

  // 3. Auto-scroll the tree-wrap to the new era's y position
  const treeWrap = document.querySelector('.tree-wrap');
  if(treeWrap){
    const targetY = Math.max(0, era.y - 200);
    gsap.to(treeWrap, { scrollTop: targetY, duration: 1.3, ease: 'power3.inOut' });
  }

  // 4. Brief glow burst on the era's first keystone
  const keystone = [...document.querySelectorAll('.node.keystone')]
    .find(el => {
      const id = el.dataset.nodeId;
      const node = (window.NODES || []).find(n => n.id === id);
      return node && node.tier === eraId;
    });
  if(keystone){
    gsap.fromTo(keystone,
      { scale: 1 },
      { scale: 1.18, duration: 0.6, ease: 'power2.out', yoyo: true, repeat: 1 }
    );
  }
}

// =========== PANZOOM (v3.4) — pan + scroll-zoom the tree canvas ===========
// Wraps the @panzoom/panzoom CDN library. Excludes .node so node clicks still
// register normally. Graceful no-op if the library didn't load.
let _atlasPanzoom = null;
function initPanzoom(){
  if(typeof Panzoom === 'undefined') return null;
  const canvas = document.getElementById('canvas');
  if(!canvas) return null;
  if(_atlasPanzoom){ try{ _atlasPanzoom.destroy(); }catch(e){} }
  _atlasPanzoom = Panzoom(canvas, {
    maxScale: 2.4,
    minScale: 0.45,
    step: 0.18,
    contain: false,
    cursor: 'grab',
    excludeClass: 'node', // never start a pan from a node click
  });
  const wrap = document.querySelector('.tree-wrap');
  if(wrap){
    wrap.addEventListener('wheel', (e)=>{
      // Ctrl + wheel = zoom; plain wheel = scroll (let the browser handle)
      if(!e.ctrlKey && !e.metaKey) return;
      e.preventDefault();
      _atlasPanzoom.zoomWithWheel(e);
    }, { passive: false });
  }
  return _atlasPanzoom;
}
function resetPanzoom(){
  if(_atlasPanzoom){ try{ _atlasPanzoom.reset(); }catch(e){} }
}

window.spawnBubbleBurst = spawnBubbleBurst;
window.spawnSonarRipple = spawnSonarRipple;
window.spawnGenePickBurst = spawnGenePickBurst;
window.spawnParticles = spawnParticles;
window.bindNodeMotion = bindNodeMotion;
window.triggerEraTransition = triggerEraTransition;
window.initPanzoom = initPanzoom;
window.resetPanzoom = resetPanzoom;
