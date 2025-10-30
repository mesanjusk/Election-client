const CACHE = 'em-pwa-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
];
self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS)));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.map(k => k !== CACHE && caches.delete(k))))
  );
});
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then(res => res || fetch(e.request).then(resp => {
      const copy = resp.clone();
      if (e.request.method === 'GET' && resp.status === 200 && resp.type === 'basic') {
        caches.open(CACHE).then(cache => cache.put(e.request, copy));
      }
      return resp;
    }))
  );
});
