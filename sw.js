const CACHE_NAME = 'al-deeb-v3';
const urlsToCache = [
  '/',
  '/index.html',
  '/project.html',
  '/offline.html',
  '/style.css',
  '/script.js',
  '/manifest.json',
  '/logo.png',
  '/ChatGPT Image 31 أكتوبر 2025، 09_29_43 م.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  // Handle navigation requests
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // Cache successful navigation responses
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          // Return cached version or offline page
          return caches.match(event.request)
            .then(response => {
              return response || caches.match('/offline.html');
            });
        })
    );
    return;
  }

  // Handle other requests (API calls, assets)
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request)
          .then(response => {
            // Don't cache API responses or external resources
            if (!event.request.url.includes('script.google.com') &&
                !event.request.url.includes('fonts.googleapis.com') &&
                response.status === 200) {
              const responseClone = response.clone();
              caches.open(CACHE_NAME).then(cache => {
                cache.put(event.request, responseClone);
              });
            }
            return response;
          })
          .catch(() => {
            // For failed requests, return a basic response or nothing
            if (event.request.destination === 'document') {
              return caches.match('/offline.html');
            }
            // For other resources, return empty response
            return new Response('', { status: 404 });
          });
      })
  );
});
