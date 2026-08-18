const C = "nsgy-v36";
const SHELL = ["./", "./index.html", "./watch.html", "./manifest.webmanifest", "./icon-192.png", "./icon-512.png", "./apple-touch-icon.png"];
self.addEventListener("install", e => {
  e.waitUntil(caches.open(C).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== C).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  const url = new URL(e.request.url);
  if (url.origin !== location.origin) return; // never intercept GitHub API etc.
  if (e.request.mode === "navigate") {
    e.respondWith(fetch(e.request).then(r => {
      const cp = r.clone(); caches.open(C).then(c => c.put(e.request, cp)); return r;
    }).catch(() => caches.match(url.pathname.endsWith("/watch.html") ? "./watch.html" : "./index.html")));
    return;
  }
  e.respondWith(caches.match(e.request).then(hit => hit || fetch(e.request).then(r => {
    const cp = r.clone(); caches.open(C).then(c => c.put(e.request, cp)); return r;
  })));
});
