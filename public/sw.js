// VSTR.OS shell cache. Wallpaper videos remain available to the UI, but are
// fetched directly so install/update never downloads them or stores huge files.
const CACHE_PREFIX = "vstr-os-";
const CACHE_NAME = `${CACHE_PREFIX}v2`;
const PRECACHE_URLS = ["/", "/manifest.json", "/favicon.ico", "/wallpapers/static/os_wallpaper.png"];

self.addEventListener("install", (event) => {
  event.waitUntil((async () => {
    let cache;
    try {
      cache = await caches.open(CACHE_NAME);
    } catch (error) {
      console.warn("[SW] Cache Storage unavailable; installing without offline cache:", error);
      await self.skipWaiting();
      return;
    }
    // Optional shell assets must not block service-worker installation.
    await Promise.all(PRECACHE_URLS.map(async (url) => {
      try {
        const response = await fetch(url, { cache: "reload" });
        if (response.ok) await cache.put(url, response);
      } catch (error) {
        console.warn("[SW] Optional precache failed:", url, error);
      }
    }));
    await self.skipWaiting();
  })());
});

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys
      .filter((key) => key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME)
      .map((key) => caches.delete(key)));
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // APIs and video wallpapers always use the network. Do not persist videos
  // in Cache Storage; normal HTTP caching and the browser media pipeline remain.
  if (url.pathname.startsWith("/api/") || /\.(mp4|webm|ogg)$/i.test(url.pathname)) return;

  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(request);
    if (cached) return cached;
    try {
      const response = await fetch(request);
      if (response.ok && (url.pathname === "/" || url.pathname === "/manifest.json" || url.pathname === "/favicon.ico" || url.pathname.startsWith("/_next/static/"))) {
        await cache.put(request, response.clone());
      }
      return response;
    } catch {
      if (request.mode === "navigate" && url.pathname === "/") {
        return (await cache.match("/")) || new Response("Offline", { status: 503 });
      }
      return new Response("Offline", { status: 503 });
    }
  })());
});
