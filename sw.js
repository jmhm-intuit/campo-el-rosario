const CACHE = 'campo-v4-assets-1'
const ASSETS = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './manifest.webmanifest',
  './assets/el-rosario-map.png',
  './assets/cow-logo.svg',
  './assets/cow-red-standing-right.png',
  './assets/cow-red-standing-left.png',
  './assets/cow-red-grazing-right.png',
  './assets/cow-red-grazing-left.png',
  './assets/cow-red-resting-right.png',
  './assets/bull-red-standing-right.png',
  './assets/bull-red-standing-left.png',
  './assets/calf-red-standing-right.png',
  './assets/calf-red-standing-left.png',
  './assets/house-8-9.png',
  './assets/house-13.png'
]

self.addEventListener('install', event => {
  self.skipWaiting()
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS)))
})

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  )
})

self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        const copy = response.clone()
        caches.open(CACHE).then(cache => cache.put(event.request, copy))
        return response
      })
      .catch(() => caches.match(event.request))
  )
})
