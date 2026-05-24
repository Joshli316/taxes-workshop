const CACHE = 'taxes-workshop-v6';
const ASSETS = [
  '/',
  '/index.html',
  '/resources.html',
  '/404.html',
  '/styles.css',
  '/print.css',
  '/qrcode.min.js',
  '/app.js',
  '/resources.js',
  '/404.js',
  '/apple-touch-icon.png',
  '/og.png',
  '/sitemap.xml',
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => c.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== CACHE).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (url.origin !== self.location.origin) return;
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});
