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
    // Any other unmatched path: let the assets router answer (404 page).
    return env.ASSETS.fetch(request);
  }
};
