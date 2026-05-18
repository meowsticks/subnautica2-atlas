// =========== 3D ROTATING TREE (v3.4) — Three.js ===========
// Optional 3D view of the atlas. Built lazily on first toggle. Renders era
// platforms as horizontal hex rings stacked vertically, with nodes as glowing
// hexagonal towers positioned in 3D space mirroring their 2D x/y. Auto-rotates
// around the Y axis. Click a 3D node to selectNode() it in the 2D state.
//
// Graceful no-op if THREE.js didn't load (offline build with no CDN reach).

let _scene, _camera, _renderer, _container, _animId, _nodeMeshes = [];
let _rotating = true;
let _activeIn3d = false;

function init3D(){
  if(typeof THREE === 'undefined') return false;
  if(_scene) return true;

  _container = document.getElementById('tree3dContainer');
  if(!_container) return false;

  const w = _container.clientWidth || window.innerWidth;
  const h = _container.clientHeight || (window.innerHeight - 200);

  _scene = new THREE.Scene();
  _scene.background = new THREE.Color(0x01030a);
  _scene.fog = new THREE.FogExp2(0x01030a, 0.0008);

  _camera = new THREE.PerspectiveCamera(55, w / h, 1, 6000);
  _camera.position.set(0, 1100, 1500);
  _camera.lookAt(0, 1100, 0);

  _renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  _renderer.setSize(w, h);
  _renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  _container.appendChild(_renderer.domElement);

  // Lights — cyan ambient + warm key + cool rim
  _scene.add(new THREE.AmbientLight(0x4dd0e1, 0.5));
  const key = new THREE.PointLight(0x00e5ff, 1.4, 4000);
  key.position.set(800, 1600, 800);
  _scene.add(key);
  const rim = new THREE.PointLight(0xff6b35, 0.7, 4000);
  rim.position.set(-800, 400, -800);
  _scene.add(rim);

  buildEraRings();
  buildNodeMeshes();

  // Drag-to-rotate + scroll-to-zoom (minimal orbit controls)
  let dragging = false, lastX = 0, lastY = 0, theta = 0, phi = 0;
  _renderer.domElement.addEventListener('mousedown', (e)=>{ dragging = true; lastX = e.clientX; lastY = e.clientY; _rotating = false; });
  window.addEventListener('mouseup', ()=>{ dragging = false; });
  window.addEventListener('mousemove', (e)=>{
    if(!dragging) return;
    theta += (e.clientX - lastX) * 0.005;
    phi += (e.clientY - lastY) * 0.005;
    phi = Math.max(-1.2, Math.min(1.2, phi));
    lastX = e.clientX; lastY = e.clientY;
    orbitCamera(theta, phi);
  });
  _renderer.domElement.addEventListener('wheel', (e)=>{
    e.preventDefault();
    const dir = e.deltaY > 0 ? 1.1 : 0.92;
    _camera.position.multiplyScalar(dir);
  }, { passive: false });
  _renderer.domElement.addEventListener('click', onClick3D);

  // Raycaster reused
  _raycaster = new THREE.Raycaster();
  _mouse = new THREE.Vector2();

  // Resize handler
  window.addEventListener('resize', resize3D);

  return true;
}

let _raycaster, _mouse;

function orbitCamera(theta, phi){
  const r = 1800;
  _camera.position.x = r * Math.sin(theta) * Math.cos(phi);
  _camera.position.z = r * Math.cos(theta) * Math.cos(phi);
  _camera.position.y = 1100 + r * Math.sin(phi);
  _camera.lookAt(0, 1100, 0);
}

function buildEraRings(){
  const ERAS = window.ERAS || [];
  ERAS.forEach(era=>{
    if(era.id === 0) return;
    const color = new THREE.Color(era.accent);
    const torusGeom = new THREE.TorusGeometry(700, 6, 8, 80);
    const torusMat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.45 });
    const ring = new THREE.Mesh(torusGeom, torusMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = era.y;
    _scene.add(ring);

    // Inner glow disc
    const discGeom = new THREE.RingGeometry(670, 700, 80);
    const discMat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.18, side: THREE.DoubleSide });
    const disc = new THREE.Mesh(discGeom, discMat);
    disc.rotation.x = Math.PI / 2;
    disc.position.y = era.y - 1;
    _scene.add(disc);
  });
}

function buildNodeMeshes(){
  const NODES = window.NODES || [];
  const completed = window.completed || new Set();
  _nodeMeshes = [];

  NODES.forEach(n=>{
    // Map 2D x (0..1500) onto a circular layout: angle around y axis
    const angle = (n.x / 1500) * Math.PI * 2;
    const radius = 550;
    const px = Math.cos(angle) * radius;
    const pz = Math.sin(angle) * radius;
    const py = n.y;

    const isCompleted = completed.has(n.id);
    const isAvail = window.isAvailable ? window.isAvailable(n) : false;
    const color = isCompleted ? 0xffb347 : (isAvail ? 0x00e5ff : 0x465970);

    const size = n.type === 'keystone' ? 50 : (n.type === 'notable' ? 36 : 26);
    const geom = new THREE.CylinderGeometry(size, size, 18, 6);
    const mat = new THREE.MeshStandardMaterial({
      color,
      emissive: color,
      emissiveIntensity: isCompleted || isAvail ? 0.6 : 0.15,
      metalness: 0.4,
      roughness: 0.4,
    });
    const hex = new THREE.Mesh(geom, mat);
    hex.position.set(px, py, pz);
    hex.userData.nodeId = n.id;
    _scene.add(hex);
    _nodeMeshes.push(hex);

    // Connection beams to deps
    n.deps.forEach(depId=>{
      const dep = NODES.find(d => d.id === depId);
      if(!dep) return;
      const depAngle = (dep.x / 1500) * Math.PI * 2;
      const dx = Math.cos(depAngle) * radius;
      const dz = Math.sin(depAngle) * radius;
      const points = [
        new THREE.Vector3(px, py, pz),
        new THREE.Vector3(dx, dep.y, dz),
      ];
      const geom = new THREE.BufferGeometry().setFromPoints(points);
      const lineMat = new THREE.LineBasicMaterial({
        color: completed.has(depId) ? 0x00e5ff : 0x465970,
        transparent: true,
        opacity: completed.has(depId) ? 0.7 : 0.25,
      });
      _scene.add(new THREE.Line(geom, lineMat));
    });
  });
}

function onClick3D(e){
  if(!_raycaster || !_renderer) return;
  const rect = _renderer.domElement.getBoundingClientRect();
  _mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
  _mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
  _raycaster.setFromCamera(_mouse, _camera);
  const hits = _raycaster.intersectObjects(_nodeMeshes);
  if(hits.length > 0){
    const id = hits[0].object.userData.nodeId;
    if(window.selectNode) window.selectNode(id);
  }
}

function animate3D(){
  if(!_activeIn3d) return;
  _animId = requestAnimationFrame(animate3D);
  if(_rotating){
    // Slow auto-rotation around the y axis
    _scene.rotation.y += 0.0015;
  }
  _renderer.render(_scene, _camera);
}

function resize3D(){
  if(!_renderer || !_camera || !_container) return;
  const w = _container.clientWidth || window.innerWidth;
  const h = _container.clientHeight || (window.innerHeight - 200);
  _camera.aspect = w / h;
  _camera.updateProjectionMatrix();
  _renderer.setSize(w, h);
}

function rebuild3D(){
  // Clear existing scene contents and rebuild from current 2D state
  if(!_scene) return;
  while(_scene.children.length > 0) _scene.remove(_scene.children[0]);
  _scene.add(new THREE.AmbientLight(0x4dd0e1, 0.5));
  const key = new THREE.PointLight(0x00e5ff, 1.4, 4000);
  key.position.set(800, 1600, 800);
  _scene.add(key);
  const rim = new THREE.PointLight(0xff6b35, 0.7, 4000);
  rim.position.set(-800, 400, -800);
  _scene.add(rim);
  buildEraRings();
  buildNodeMeshes();
}

function toggle3D(){
  const wrap2d = document.querySelector('.tree-wrap');
  const wrap3d = document.getElementById('tree3dContainer');
  const btn = document.getElementById('tree3dBtn');
  if(!wrap2d || !wrap3d || !btn) return;

  if(_activeIn3d){
    // Switch back to 2D
    _activeIn3d = false;
    if(_animId) cancelAnimationFrame(_animId);
    wrap3d.style.display = 'none';
    wrap2d.style.display = '';
    btn.classList.remove('on');
    btn.innerHTML = '◈ 3D View';
  } else {
    // Switch to 3D
    const ok = init3D();
    if(!ok){
      btn.disabled = true;
      btn.innerHTML = '3D Unavailable';
      return;
    }
    rebuild3D();
    _activeIn3d = true;
    _rotating = true;
    wrap2d.style.display = 'none';
    wrap3d.style.display = 'block';
    btn.classList.add('on');
    btn.innerHTML = '◈ 3D View · ON';
    animate3D();
  }
}

window.init3D = init3D;
window.toggle3D = toggle3D;
window.rebuild3D = rebuild3D;
