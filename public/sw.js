/*
 * Retires the old PWA service worker.
 *
 * The site used to ship a Workbox service worker at /sw.js that precached
 * every page. Browsers keep an installed worker until it is replaced, so
 * returning visitors would otherwise keep being served the cached (old) site.
 * Their browser fetches this file on its next update check, installs it, and
 * this worker clears the caches, unregisters itself and reloads open tabs.
 *
 * Safe to delete once old visitors have cycled through (a few months).
 */
self.addEventListener("install", () => self.skipWaiting());

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.map((key) => caches.delete(key)));
      await self.registration.unregister();
      const windows = await self.clients.matchAll({ type: "window" });
      windows.forEach((client) => client.navigate(client.url));
    })()
  );
});
