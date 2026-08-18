const CACHE = 'peptide-toolkit-v1';
const ASSETS = ['./index.html', './manifest.json', './icon.svg'];

self.addEventListener('install', function(event){
    event.waitUntil(caches.open(CACHE).then(function(c){ return c.addAll(ASSETS); }));
    self.skipWaiting();
});

self.addEventListener('activate', function(event){
    event.waitUntil(
          caches.keys().then(function(keys){
                  return Promise.all(keys.filter(function(k){ return k !== CACHE; }).map(function(k){ return caches.delete(k); }));
          })
        );
    self.clients.claim();
});

self.addEventListener('fetch', function(event){
    event.respondWith(
          caches.match(event.request).then(function(cached){
                  const fetchPromise = fetch(event.request).then(function(res){
                            const resClone = res.clone();
                            caches.open(CACHE).then(function(c){ c.put(event.request, resClone); });
                            return res;
                  }).catch(function(){ return cached; });
                  return cached || fetchPromise;
          })
        );
});
