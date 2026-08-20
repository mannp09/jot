/* jot service worker — the whole point is that capture never depends on a network.
 *
 * ⚠ THE AUDIT RANKED THIS THE WORST GAP IN THE APP and it is the right call:
 * a capture tool that needs a server is broken exactly when it matters, which
 * is standing somewhere with no signal and a thought worth keeping. The data
 * layer was already offline (localStorage); only the SHELL needed the network,
 * which is a silly reason to lose a jot.
 *
 * Cache-first for the shell, because the shell IS the app - one HTML file with
 * everything inlined. A stale shell that opens beats a fresh one that does not.
 */
/* ⚠ v2: the manifest was missing from v1's shell list because the manifest
   itself was missing. An installed app that cannot fetch its own manifest
   offline is the same half-feature one layer down. */
const CACHE = "jot-shell-v59";
const SHELL = ["./", "./index.html", "./manifest.json"];

self.addEventListener("install", e => {
  /* take over immediately rather than waiting for every tab to close - a
     capture app should never be one version behind because a tab is open */
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).catch(() => {}));
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", e => {
  const r = e.request;
  if (r.method !== "GET") return;
  /* ⚠ sync and auth are ALWAYS live, never cached. A cached pull response is
     a stale corpus that survives a reload; a cached auth response is worse. */
  if (new URL(r.url).hostname.endsWith(".supabase.co")) return;

  e.respondWith(
    caches.match(r).then(hit => {
      /* ★ serve the cached shell instantly, then refresh it in the background.
         He gets an app that opens with no network and still picks up the next
         build the following time he opens it. */
      const live = fetch(r).then(res => {
        if (res && res.status === 200 && res.type === "basic"){
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(r, copy)).catch(() => {});
        }
        return res;
      }).catch(() => hit);   /* offline: the cache is the answer, not an error */

      return hit || live;
    })
  );
});
