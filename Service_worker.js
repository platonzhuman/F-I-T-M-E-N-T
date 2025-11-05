// sw.js - Service Worker для оффлайн работы и кэширования
const CACHE_NAME = 'tire-shop-v1.0.0';
const urlsToCache = [
    '/',
    '/styles/main.css',
    '/scripts/optimized-app.js',
    '/images/logo.png',
    '/images/background.jpg'
];

self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function(cache) {
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request)
            .then(function(response) {
                if (response) {
                    return response;
                }
                return fetch(event.request);
            }
        )
    );
});