let cacheV1 = "restnreview-v3";
  cacheThis = [
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
    caches.open(cacheV1)
          .then(function(cache) {
            return cache.addAll(cacheThis);
          })
  );
});

// Returns requests
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request).then(function(resp) {
        let respClone = resp.clone();
        caches.open(cacheV1).then(function(cache) {
          cache.put(event.request, respClone);
        });
        return resp;
      });
    }).catch(function() {
      return caches.match('.img/1.jpg');
    })
  );
});

// Activates the cache
self.addEventListener('activate', function(event) {
  let newCache = [cacheV1];

    event.waitUntil(
      caches.keys().then(function(cacheNames) {
        return Promise.all(cacheNames.map(function(cacheName) {
            if (newCache.indexOf(cacheName) === -1) {
              return caches.delete(cacheName);
            }
          }));
      })
    );
});
