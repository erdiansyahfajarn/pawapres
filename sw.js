const CACHE = "portal-warga-v1";
const ASSETS = [
  "assets/web-app-manifest-192x192.png",
  "assets/web-app-manifest-512x512.png",
  "assets/favicon.ico",
  "assets/favicon.svg",
  "assets/favicon-96x96.png",
  "assets/apple-touch-icon.png",

  "index.html",
  "style.css",
  "cms.js",
  "manifest.json"
];

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(ASSETS))
  );
});

self.addEventListener("fetch", e => {
  e.respondWith(
    caches.match(e.request).then(res => res || fetch(e.request))
  );
});