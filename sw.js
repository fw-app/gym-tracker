const CACHE_NAME = 'gym-tracker-v3';
const ASSETS = [
  './',
  './index.html',
  './css/style.css',
  './js/app.js',
  './js/data.js',
  './js/storage.js',
  './js/timer.js',
  './js/profile.js',
  './manifest.json'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Network first, cache fallback - so bekommst du immer die neueste Version
// Cache greift nur wenn du offline bist (z.B. im Keller ohne WLAN)
self.addEventListener('fetch', (e) => {
  e.respondWith(
    fetch(e.request)
      .then((response) => {
        // Erfolgreiche Netzwerk-Antwort -> Cache aktualisieren
        const clone = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(e.request, clone));
        return response;
      })
      .catch(() => {
        // Offline -> aus dem Cache liefern
        return caches.match(e.request);
      })
  );
});
