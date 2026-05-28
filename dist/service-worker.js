console.info("--- Service Worker script loaded ---");

// Define a name for our cache
const CACHE_NAME = "__MY_APP__-v1";

// Define the files that make up our app shell
const urlsToCache = [
  // "/",
  // "/index.html",
  // "/styles.css",
  // "/main.js",
  // "/router/index.js",
  // "/pages/HomePage.js",
  // Add any other core files your app depends on
];

// 'self' refers to the service worker's global scope
self.addEventListener("install", (event) => {
  console.info("Service Worker: Installing...");

  event.waitUntil(
    (async () => {
      try {
        const cache = await caches.open(CACHE_NAME);
        console.info("Service Worker: Caching app shell");
        await cache.addAll(urlsToCache);
      } catch (error) {
        console.error("Failed to cache app shell:", error);
      }
      // We use an IFEE
    })()
  );
});

self.addEventListener("activate", (event) => {
  console.info("Service Worker: Activating...");
  // We'll add cache management logic here in a future lesson
});

// Listen for fetch events
self.addEventListener("fetch", (event) => {
  // We use event.respondWith() to take control of the response.
  event.respondWith(
    (async () => {
      // Try to find a cached response
      const cachedResponse = await caches.match(event.request);

      if (cachedResponse) {
        console.info("Serving from cache:", event.request.url);
        return cachedResponse;
      }

      // If not found in cache, fetch from network
      console.info("Fetching from network:", event.request.url);
      return fetch(event.request);
    })()
  );
});
