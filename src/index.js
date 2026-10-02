// Linkwise checkpoint host — Phase 0b spike.
// Static files in /public are served by Cloudflare BEFORE this script runs, so this
// script only sees requests for paths that have no file. Nothing here logs anything.
//
// /echo-headers is a TEMPORARY, test-only endpoint for the Referer test (Experiment 3):
// it returns the request headers it received, to the requester only, and stores nothing.
// Delete this handler after the test.
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/echo-headers") {
      const headers = {};
      for (const [k, v] of request.headers) headers[k] = v;
      const body = JSON.stringify({ path: url.pathname, headers }, null, 2);
      return new Response(body, {
        status: 200,
        headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" }
      });
    }
    // TEMPORARY, test-only: simulated server failure for the outage test (Experiment 3).
    if (url.pathname.startsWith("/outage/")) {
      return new Response("<!doctype html><meta charset=utf-8><title>503</title><body style=\"font-family:system-ui;padding:24px;background:#111;color:#eee\"><h1>503 Service Unavailable</h1><p>Simulated outage of the Linkwise checkpoint host (test only).</p>",
        { status: 503, headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store", "retry-after": "60" } });
    }
    // Any other unmatched path: serve the custom 404 page ourselves (not_found_handling is "none"
    // so that this script is reached at all; see Cloudflare's wrangler reference).
    const nf = await env.ASSETS.fetch(new Request(new URL("/404.html", request.url), { method: "GET" }));
    return new Response(nf.body, { status: 404, headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" } });
  }
};
