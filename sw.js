/* Survivor's Atlas service worker — v3.5.1
   Strategy: cache-first for app shell + CDN libs, network passthrough for
   Anthropic API. Bump CACHE_VERSION on each release to evict stale caches. */

const CACHE_VERSION = 'atlas-v3.5.2-mobile-nav';
const APP_SHELL = [
  './',
  './index.html',
  './manifest.webmanifest',
  './css/base.css',
  './css/header.css',
  './css/tree.css',
  './css/creatures.css',
  './css/motion.css',
  './css/chat.css',
  './css/accessibility.css',
  './js/audio.js',
  './js/icons.js',
  './js/data.js',
  './js/creatures.js',
  './js/engine.js',
  './js/motion.js',
  './js/tree3d.js',
  './js/chat.js',
  './js/main.js',
  './assets/logo.svg',
  './assets/icon-192.png',
  './assets/icon-512.png',
  './assets/apple-touch-icon.png',
  './assets/favicon-32.png'
];
const CDN_LIBS = [
  'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js',
  'https://unpkg.com/@panzoom/panzoom@4.5.1/dist/panzoom.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_VERSION);
    await cache.addAll(APP_SHELL);
    // CDN libs may fail (offline first install) — add individually, don't abort
    await Promise.all(CDN_LIBS.map((url) =>
      cache.add(new Request(url, { mode: 'no-cors' })).catch(() => {})
    ));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((k) => k !== CACHE_VERSION).map((k) => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // Don't intercept Anthropic API or other dynamic POST endpoints.
  if (url.hostname.endsWith('anthropic.com')) return;

  const sameOrigin = url.origin === self.location.origin;
  const isCdnLib = url.hostname === 'cdnjs.cloudflare.com' || url.hostname === 'unpkg.com';
  if (!sameOrigin && !isCdnLib) return;

  event.respondWith((async () => {
    const cache = await caches.open(CACHE_VERSION);
    const cached = await cache.match(req);
    if (cached) {
      // Refresh in background; serve cached immediately.
      event.waitUntil((async () => {
        try {
          const fresh = await fetch(req);
          if (fresh && fresh.ok) await cache.put(req, fresh.clone());
        } catch (_) { /* offline; keep cached */ }
      })());
      return cached;
    }
    try {
      const fresh = await fetch(req);
      if (fresh && fresh.ok) cache.put(req, fresh.clone());
      return fresh;
    } catch (err) {
      // Last-ditch: for navigations, fall back to cached index.
      if (req.mode === 'navigate') {
        const fallback = await cache.match('./index.html');
        if (fallback) return fallback;
      }
      throw err;
    }
  })());
});
