const CACHE = 'campo-v2-1'
const ASSETS = ['./','./index.html','./styles.css','./app.js','./manifest.webmanifest','./assets/el-rosario-map.png','./assets/cow-black.png','./assets/cow-red.png','./assets/bull-black.png','./assets/bull-red.png','./assets/calf-black.png','./assets/calf-red.png','./assets/house-small.png','./assets/windmill-tank.png','./assets/corral.png']
self.addEventListener('install', event => event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS))))
self.addEventListener('activate', event => event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key))))))
self.addEventListener('fetch', event => event.respondWith(caches.match(event.request).then(hit => hit || fetch(event.request))))
