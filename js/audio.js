// =========== AUDIO LAYER (L6) — LOCKED ===========
// Preservation rule: function bodies of playBubblePop / playSonarPing / playUnlock /
// playDeepRumble MUST stay byte-identical to v2.0. Only the surrounding state vars
// (audioCtx, soundEnabled) live in this file so the audio subsystem is self-contained.
// Do NOT edit anything below until next major engine review.

let audioCtx = null;
let soundEnabled = false;

// =========== AUDIO (synthesized — no copyrighted samples) ===========
function initAudio(){
  if(audioCtx) return;
  try{audioCtx = new (window.AudioContext || window.webkitAudioContext)()}catch(e){}
}

function playBubblePop(){
  if(!soundEnabled || !audioCtx) return;
  const ctx = audioCtx;
  const now = ctx.currentTime;
  // filtered noise burst
  const bufferSize = ctx.sampleRate * 0.18;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for(let i=0;i<bufferSize;i++){
    data[i] = (Math.random()*2-1) * Math.exp(-i/(bufferSize*0.3));
  }
  const src = ctx.createBufferSource();
  src.buffer = buffer;
  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(600 + Math.random()*400, now);
  filter.frequency.exponentialRampToValueAtTime(1800 + Math.random()*400, now + 0.12);
  filter.Q.value = 6;
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.18, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
  src.connect(filter); filter.connect(gain); gain.connect(ctx.destination);
  src.start(now);
}

function playSonarPing(){
  if(!soundEnabled || !audioCtx) return;
  const ctx = audioCtx;
  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(880, now);
  osc.frequency.exponentialRampToValueAtTime(220, now + 0.6);
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.001, now);
  gain.gain.linearRampToValueAtTime(0.15, now + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);
  osc.connect(gain); gain.connect(ctx.destination);
  osc.start(now); osc.stop(now + 0.7);
}

function playUnlock(){
  if(!soundEnabled || !audioCtx) return;
  const ctx = audioCtx;
  const now = ctx.currentTime;
  // bell-like — two oscillators
  [523.25, 783.99, 1046.5].forEach((freq, i)=>{
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = freq;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.12, now + 0.01 + i*0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.4 + i*0.1);
    osc.connect(gain); gain.connect(ctx.destination);
    osc.start(now); osc.stop(now + 1.5);
  });
}

function playDeepRumble(){
  if(!soundEnabled || !audioCtx) return;
  const ctx = audioCtx;
  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  osc.type = 'sawtooth';
  osc.frequency.value = 55;
  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 120;
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.001, now);
  gain.gain.linearRampToValueAtTime(0.08, now + 0.3);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 2);
  osc.connect(filter); filter.connect(gain); gain.connect(ctx.destination);
  osc.start(now); osc.stop(now + 2);
}

// =========== GENE PICK (v3.1+) — added per Adaptations panel ===========
// NOT one of the 4 byte-locked functions. Modifiable by atlas-motion-director.
// Played on toggleNode acquisition: two quick ascending triangle pings + a
// soft high-frequency noise click — the feel of a DNA latch snapping into place.
function playGenePick(){
  if(!soundEnabled || !audioCtx) return;
  const ctx = audioCtx;
  const now = ctx.currentTime;
  [659.25, 987.77].forEach((freq, i)=>{
    const osc = ctx.createOscillator();
    osc.type = 'triangle';
    osc.frequency.value = freq;
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = freq;
    filter.Q.value = 4;
    const gain = ctx.createGain();
    const start = now + i*0.06;
    gain.gain.setValueAtTime(0.001, start);
    gain.gain.linearRampToValueAtTime(0.14, start + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.001, start + 0.22);
    osc.connect(filter); filter.connect(gain); gain.connect(ctx.destination);
    osc.start(start); osc.stop(start + 0.24);
  });
  const noiseSize = ctx.sampleRate * 0.05;
  const buffer = ctx.createBuffer(1, noiseSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for(let i=0;i<noiseSize;i++){
    data[i] = (Math.random()*2-1) * Math.exp(-i/(noiseSize*0.25));
  }
  const src = ctx.createBufferSource();
  src.buffer = buffer;
  const hp = ctx.createBiquadFilter();
  hp.type = 'highpass';
  hp.frequency.value = 1400;
  const ng = ctx.createGain();
  ng.gain.setValueAtTime(0.08, now);
  ng.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
  src.connect(hp); hp.connect(ng); ng.connect(ctx.destination);
  src.start(now);
}

// Expose for inline handlers and cross-module access
window.initAudio = initAudio;
window.playBubblePop = playBubblePop;
window.playSonarPing = playSonarPing;
window.playUnlock = playUnlock;
window.playDeepRumble = playDeepRumble;
window.playGenePick = playGenePick;
Object.defineProperty(window, 'audioCtx', { get: ()=>audioCtx, set:v=>{audioCtx=v} });
Object.defineProperty(window, 'soundEnabled', { get: ()=>soundEnabled, set:v=>{soundEnabled=v} });
