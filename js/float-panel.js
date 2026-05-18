/* =========== FLOAT PANEL (v3.6) — draggable node-intel window ===========
   Pops up when a node is selected so the skill tree stays visible behind.
   - Mobile: opens automatically as a bottom sheet
   - Desktop: opens on demand via the inline panel's "pop out" button,
     defaults to a window in the top-right
   - Drag the header (mouse or touch) to reposition
   - Position + open state persists across reloads */

const FLOAT_STORAGE_KEY = 'subnautica2-atlas-float-v1';
const _floatState = {
  enabled: null,   // user toggle; null = auto (mobile on, desktop off)
  x: null,
  y: null,
};

function _floatLoadState(){
  try{
    const raw = localStorage.getItem(FLOAT_STORAGE_KEY);
    if(raw) Object.assign(_floatState, JSON.parse(raw));
  }catch(_){}
}
function _floatSaveState(){
  try{ localStorage.setItem(FLOAT_STORAGE_KEY, JSON.stringify(_floatState)); }catch(_){}
}

function _floatIsMobile(){
  return window.matchMedia && window.matchMedia('(max-width: 980px)').matches;
}

function _floatDefaultEnabled(){
  // null = follow viewport: mobile auto-opens, desktop stays inline
  if(_floatState.enabled === null) return _floatIsMobile();
  return !!_floatState.enabled;
}

function _floatApplyPosition(){
  const el = document.getElementById('floatPanel');
  if(!el) return;
  if(_floatIsMobile()){
    // Bottom-sheet layout governed by CSS — clear inline positioning
    el.style.top = '';
    el.style.left = '';
    el.style.right = '';
    el.style.bottom = '';
    return;
  }
  if(typeof _floatState.x === 'number' && typeof _floatState.y === 'number'){
    // Clamp to viewport in case window shrunk since last session
    const margin = 8;
    const maxLeft = window.innerWidth - 200 - margin;
    const maxTop = window.innerHeight - 80 - margin;
    el.style.left = Math.max(margin, Math.min(maxLeft, _floatState.x)) + 'px';
    el.style.top = Math.max(margin, Math.min(maxTop, _floatState.y)) + 'px';
    el.style.right = 'auto';
    el.style.bottom = 'auto';
  }
}

function showFloatPanel(){
  const el = document.getElementById('floatPanel');
  if(!el) return;
  el.hidden = false;
  document.body.classList.add('float-panel-open');
  _floatApplyPosition();
  mirrorToFloatPanel();
}

function hideFloatPanel(){
  const el = document.getElementById('floatPanel');
  if(!el) return;
  el.hidden = true;
  document.body.classList.remove('float-panel-open');
}

function isFloatPanelOpen(){
  const el = document.getElementById('floatPanel');
  return !!(el && !el.hidden);
}

// Called from engine.renderPanel after writing #panel.innerHTML so the
// floating window stays in sync (selection, points, deps, etc.).
function mirrorToFloatPanel(){
  const src = document.getElementById('panel');
  const body = document.getElementById('floatPanelBody');
  if(!src || !body) return;
  body.innerHTML = src.innerHTML;
  const titleEl = document.getElementById('floatPanelTitle');
  if(titleEl){
    const sel = window.selectedId && typeof nodeById === 'function' ? nodeById(window.selectedId) : null;
    titleEl.textContent = sel?.title || 'Node Intel';
  }
}

// Engine calls this after a node is selected so the float panel auto-opens
// when appropriate (mobile by default; desktop only after pop-out).
function onNodeSelected(){
  if(_floatDefaultEnabled()){
    showFloatPanel();
  } else if(isFloatPanelOpen()){
    mirrorToFloatPanel();
  }
}

function toggleFloatMode(){
  // "Pop out" from inline panel, or "Dock" from float panel
  const next = !_floatDefaultEnabled();
  _floatState.enabled = next;
  _floatSaveState();
  if(next) showFloatPanel();
  else hideFloatPanel();
}

function initFloatPanel(){
  _floatLoadState();
  const el = document.getElementById('floatPanel');
  const header = document.getElementById('floatPanelHeader');
  if(!el || !header) return;

  document.getElementById('floatPanelClose')?.addEventListener('click', () => {
    hideFloatPanel();
    _floatState.enabled = false;
    _floatSaveState();
  });
  document.getElementById('floatPanelDock')?.addEventListener('click', () => {
    hideFloatPanel();
    _floatState.enabled = false;
    _floatSaveState();
    // Scroll the inline panel into view so the user can see content didn't disappear
    const inline = document.getElementById('panel');
    if(inline && _floatIsMobile()){
      inline.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });

  // Drag — pointer events handle both mouse and touch
  let dragging = false, originLeft = 0, originTop = 0, startX = 0, startY = 0;
  header.addEventListener('pointerdown', (e) => {
    if(e.target.closest('.float-panel-btn')) return;
    dragging = true;
    el.classList.add('dragging');
    const rect = el.getBoundingClientRect();
    originLeft = rect.left;
    originTop = rect.top;
    startX = e.clientX;
    startY = e.clientY;
    try{ header.setPointerCapture(e.pointerId); }catch(_){}
  });
  header.addEventListener('pointermove', (e) => {
    if(!dragging) return;
    const margin = 8;
    let nextLeft = originLeft + (e.clientX - startX);
    let nextTop = originTop + (e.clientY - startY);
    nextLeft = Math.max(margin, Math.min(window.innerWidth - el.offsetWidth - margin, nextLeft));
    nextTop = Math.max(margin, Math.min(window.innerHeight - 80, nextTop));
    el.style.left = nextLeft + 'px';
    el.style.top = nextTop + 'px';
    el.style.right = 'auto';
    el.style.bottom = 'auto';
  });
  const endDrag = (e) => {
    if(!dragging) return;
    dragging = false;
    el.classList.remove('dragging');
    if(!_floatIsMobile()){
      const rect = el.getBoundingClientRect();
      _floatState.x = rect.left;
      _floatState.y = rect.top;
      _floatSaveState();
    }
    try{ header.releasePointerCapture(e.pointerId); }catch(_){}
  };
  header.addEventListener('pointerup', endDrag);
  header.addEventListener('pointercancel', endDrag);

  // Esc closes the floating panel
  document.addEventListener('keydown', (e) => {
    if(e.key === 'Escape' && isFloatPanelOpen()) hideFloatPanel();
  });

  // Re-apply layout / clamp on viewport changes (rotation, resize)
  window.addEventListener('resize', () => {
    if(isFloatPanelOpen()) _floatApplyPosition();
  });
}

window.initFloatPanel = initFloatPanel;
window.showFloatPanel = showFloatPanel;
window.hideFloatPanel = hideFloatPanel;
window.toggleFloatMode = toggleFloatMode;
window.mirrorToFloatPanel = mirrorToFloatPanel;
window.onNodeSelected = onNodeSelected;
window.isFloatPanelOpen = isFloatPanelOpen;
