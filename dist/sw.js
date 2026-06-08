/**
 * Service Worker for DevPrivacy Toolkit
 * Provides offline support and caching
 * @version 2.0.0
 * FIXED: Added proper cache versioning
 * FIXED: Added network timeout handling
 * FIXED: Improved error handling
 * FIXED: Added cache size limits
 */

const CACHE_VERSION = "v3"
const CACHE_NAME = `devprivacy-${CACHE_VERSION}`
const BASE_PATH = "/devvault-pro"

// Static assets to cache on install
const STATIC_ASSETS = [
  BASE_PATH + "/",
  BASE_PATH + "/index.html",
  BASE_PATH + "/manifest.json",
  BASE_PATH + "/favicon.ico",
]

// Maximum cache entries
const MAX_CACHE_ENTRIES = 100

// Network timeout in milliseconds
const NETWORK_TIMEOUT = 5000

// Install: Cache static assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
      .catch((err) => console.error("SW install failed:", err))
  )
})

// Activate: Clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) =>
        Promise.all(
          cacheNames
            .filter((name) => name !== CACHE_NAME)
            .map((name) => caches.delete(name))
        )
      )
      .then(() => self.clients.claim())
      .catch((err) => console.error("SW activate failed:", err))
  )
})

// Helper: Limit cache size
async function limitCacheSize(cache) {
  const keys = await cache.keys()
  if (keys.length > MAX_CACHE_ENTRIES) {
    // Delete oldest entries
    const entriesToDelete = keys.slice(0, keys.length - MAX_CACHE_ENTRIES)
    await Promise.all(entriesToDelete.map((key) => cache.delete(key)))
  }
}

// Helper: Network request with timeout
function fetchWithTimeout(request, timeoutMs) {
  return Promise.race([
    fetch(request),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Network timeout")), timeoutMs)
    ),
  ])
}

// Fetch: Cache-first strategy for static assets, network-first for API
self.addEventListener("fetch", (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Skip non-GET requests
  if (request.method !== "GET") return

  // Skip cross-origin requests
  if (url.origin !== self.location.origin) return

  // Skip non-basePath requests
  if (!url.pathname.startsWith(BASE_PATH)) return

  // Skip chrome-extension and other non-http schemes
  if (!url.protocol.startsWith("http")) return

  // Cache-first for static assets
  if (
    request.destination === "style" ||
    request.destination === "script" ||
    request.destination === "image" ||
    request.destination === "font" ||
    url.pathname === BASE_PATH + "/"
  ) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached

        return fetchWithTimeout(request, NETWORK_TIMEOUT)
          .then((response) => {
            if (!response || response.status !== 200 || response.type !== "basic") {
              return response
            }
            const clone = response.clone()
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, clone)
              limitCacheSize(cache)
            })
            return response
          })
          .catch(() => {
            // Return offline fallback for navigation requests
            if (request.mode === "navigate") {
              return caches.match(BASE_PATH + "/")
            }
            return new Response("Offline", { status: 503 })
          })
      })
    )
    return
  }

  // Network-first for other requests
  event.respondWith(
    fetchWithTimeout(request, NETWORK_TIMEOUT)
      .then((response) => {
        if (!response || response.status !== 200 || response.type !== "basic") {
          return response
        }
        const clone = response.clone()
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(request, clone)
          limitCacheSize(cache)
        })
        return response
      })
      .catch(() => caches.match(request).then((cached) => {
        if (cached) return cached
        return new Response("Offline", { status: 503 })
      }))
  )
})
