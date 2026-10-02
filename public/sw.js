// Linkwise checkpoint host — service worker (Experiment 3, caching test).
// Caches checkpoint.html so later visits are served from the phone without a network request.
// Cache-first: if the cached copy exists it is returned and the network is NOT contacted.
// No logging, no fetches to anything except this origin's own files.
const CACHE = "linkwise-checkpoint-v2";
const FILES = ["/checkpoint.html", "/sw.js"];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});
// Round 4 finding (2026-10-01): a cache-first response for a NAVIGATION that arrived through a
// redirect makes Safari fail with "Response served by service worker has redirections."
// Until the caching strategy is redesigned (Experiment 3), the service worker does not answer
// navigations at all: it only pre-caches. Non-navigation fetches of our own files may use the cache.
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;
  if (event.request.mode === "navigate") return;           // let Safari load the page normally
  if (!FILES.includes(url.pathname)) return;
  event.respondWith(caches.match(event.request).then((hit) => hit || fetch(event.request)));
});
