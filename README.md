# linkwise-checkpoint

Static checkpoint page for the Linkwise Safari extension spike (Phase 0b, Experiments 2–3).
Served by a Cloudflare Worker with static assets. No analytics, no logging, no third-party scripts.

- `public/checkpoint.html` — the page. It reads the link from its own URL fragment (`#https://…`), which browsers never send to the server.
- `public/sw.js` — service worker that caches the page so later visits do not contact the host (cache test).
- `public/_headers` — long `Cache-Control` for the page (cache test).
- `src/index.js` — runs only for paths with no static file. `/outage/*` returns a simulated 503 (test only). Contains the TEMPORARY `/echo-headers` test endpoint (returns the request headers to the requester, stores nothing). Delete after the Referer test.
- `wrangler.jsonc` — Worker configuration.
