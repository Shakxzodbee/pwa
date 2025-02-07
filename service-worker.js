const CACHE_NAME = 'dexogen-cache-v2';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/offline.html',
  
  // CSS files
  '/assets/css/css2.css',
  '/assets/css/plyr.css',
  '/assets/css/style.min.css',
  '/assets/css/swiper-bundle.min.css',
  
  // JavaScript files
  '/assets/js/script.js',
  '/assets/js/main.min.js',
  
  // Images
  '/assets/images/favicon.ico',
  '/assets/images/29.png',
  '/assets/images/29.1.jpg',
  '/assets/images/29.2.jpg',
  '/assets/images/29.3.jpg',
  '/assets/images/29.4.jpg',
  '/assets/images/video.mp4',
  '/assets/images/unnamed.webp',
  
  // App icons for different sizes
  '/assets/images/29.png?s=192x192',
  '/assets/images/29.png?s=152x152',
  '/assets/images/29.png?s=180x180',
  '/assets/images/29.png?s=167x167',
  '/assets/images/29.png?s=150x150',
  '/assets/images/29.png?s=300x300',
  '/assets/images/29.png?s=240x240',
  '/assets/images/29.png?s=48x48'
];

// Install the service worker and cache assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Opened cache');
      return cache.addAll(urlsToCache);
    }),
  );
});

// Fetch assets from cache or network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches
      .match(event.request)
      .then((response) => {
        // Return cached response if found
        if (response) {
          return response;
        }

        // Fetch from network if not in cache
        return fetch(event.request).then((response) => {
          // Check if we received a valid response
          if (
            !response ||
            response.status !== 200 ||
            response.type !== 'basic'
          ) {
            return response;
          }

          // Clone the response to cache it
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });

          return response;
        });
      })
      .catch(() => {
        // Return offline fallback page if available
        return caches.match('/offline.html');
      }),
  );
});

// Clean up old
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        }),
      );
    }),
  );
});
