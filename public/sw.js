// Linkwise checkpoint host — service worker (Experiment 3, caching test).
// Caches checkpoint.html so later visits are served from the phone without a network request.
// Cache-first: if the cached copy exists it is returned and the network is NOT contacted.
// No logging, no fetches to anything except this origin's own files.
const CACHE = "linkwise-checkpoint-v1";
const FILES = ["/checkpoint.html", "/sw.js"];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname !== "/checkpoint.html") return;
  event.respondWith(
    caches.match("/checkpoint.html").then((hit) => hit || fetch(event.request))
  );
});
