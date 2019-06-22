const staticCacheName = 'restnreview-v1';
let cacheThis = [
  './',
  './index.html',
  './restaurant.html',
  './css/app.css',
  './css/app_tiny.css',
  './css/app_med.css',
  './css/app_large.css',
  './data/restaurants.json',
  './js/main.js',
  './js/dbhelper.js',
  './js/restaurant_info.js',
  './favicon.ico',
  'https://necolas.github.io/normalize.css/8.0.1/normalize.css'
];


// Creates a link for each image in the folder
for (i = 1; i < 10; i++) {
  cacheThis.push("./img/" + i + ".jpg");
}

// Tells the service worker what files to cache
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(staticCacheName).then(function(cache) {
      return cache.addAll(cacheThis);
    })
  );
});

// Activates the cache
self.addEventListener('activate', function(event) {
    event.waitUntil(
      caches.keys().then(function(cacheNames) {
        return Promise.all (
          // Deletes older cache
          cacheNames.filter(function(cacheName) {
            return cacheName.startsWith('restnreview-') &&
              cacheName != staticCacheName;
          }).map(function(cacheName) {
            return cache.delete(cacheName);
          })
        );
      })
    );
});

// Recovers failed requests
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      if (response) return response;
      return fetch(event.request);
    })
  );
});
