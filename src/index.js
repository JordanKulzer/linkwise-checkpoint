// Linkwise checkpoint host — Phase 0b spike.
// Static files in /public are served by Cloudflare BEFORE this script runs; this script only
// answers paths that have no file, with the custom 404 page. Nothing here logs anything.
// (The temporary /echo-headers and /outage test endpoints were removed on 2026-10-03.)
export default {
  async fetch(request, env) {
    const nf = await env.ASSETS.fetch(new Request(new URL("/404.html", request.url), { method: "GET" }));
    return new Response(nf.body, { status: 404, headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" } });
  }
};
