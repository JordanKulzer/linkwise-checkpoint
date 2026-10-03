// Linkwise checkpoint host — Phase 0b spike.
// Static files in /public are served by Cloudflare BEFORE this script runs; this script only
// answers paths that have no file, with the custom 404 page. Nothing here logs anything.
// (The temporary /echo-headers and /outage test endpoints were removed on 2026-10-03.)
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    // TEMPORARY, test-only (Phase 1 Round P1-2a): simulates a compromised host that forwards users
    // elsewhere. The extension's test rule sends example.com here with the original URL in ?u=.
    // If ?u= is already example.net, the redirect destination WAS re-intercepted by the catch-all
    // (so we answer 200 instead of looping). Otherwise: 302 to the safe target example.net.
    // Delete this route after the test.
    if (url.pathname === "/sec-test") {
      const u = url.searchParams.get("u") || "";
      if (/^https?:\/\/(www\.)?example\.net/i.test(u)) {
        return new Response("<!doctype html><meta charset=utf-8><title>SEC-TEST: re-intercepted</title><body style=\"font-family:system-ui;padding:24px;background:#111;color:#eee\"><h1>SEC-TEST RESULT: the redirect destination WAS re-intercepted</h1><p>The catch-all rule caught the 302 destination (example.net) and sent it back here. A compromised host could not forward users unchecked.</p><p>u=" + u.replace(/[<>&]/g, "") + "</p>",
          { status: 200, headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" } });
      }
      return new Response(null, { status: 302, headers: { "location": "https://example.net/", "cache-control": "no-store" } });
    }
    const nf = await env.ASSETS.fetch(new Request(new URL("/404.html", request.url), { method: "GET" }));
    return new Response(nf.body, { status: 404, headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" } });
  }
};
