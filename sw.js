const CACHE = 'campo-v503-assets-1'
const ASSETS = [
  './',
  './index.html',
  './app.js',
  './styles.css',
  './manifest.webmanifest',
  './assets/map/el-rosario-map.png',
  './assets/geometry/polygons-reviewed-final.json',
  './assets/asset-manifest.json',
  './assets/icons/icon-home-house.png',
  './assets/icons/icon-register-animals.png',
  './assets/icons/icon-register-animals-24.png',
  './assets/icons/icon-register-animals-32.png',
  './assets/icons/icon-register-animals-48.png',
  './assets/ui/register-animals.png',
  './assets/kpi/kpi-cow-red-angus.png',
  './assets/kpi/kpi-cow-calf-red-angus.png',
  './assets/kpi/kpi-pasture.png',
  './assets/kpi/kpi-weather-rain.png',
  './assets/kpi/kpi-growth.png',
  './assets/kpi/kpi-health.png',
  './assets/animals/map-cow-red-angus.png',
  './assets/animals/map-cow-red-angus-left.png',
  './assets/animals/map-bull-red-angus.png',
  './assets/animals/map-bull-red-angus-left.png',
  './assets/animals/map-calf-red-angus.png',
  './assets/animals/map-calf-red-angus-left.png',
  './assets/animals/map-cow-calf-red-angus.png',
  './assets/conditions/v503/pasture-excellent.png',
  './assets/conditions/v503/pasture-good.png',
  './assets/conditions/v503/pasture-regular.png',
  './assets/conditions/v503/pasture-poor.png',
  './assets/conditions/v503/pasture-waterlogged.png',
  './assets/conditions/condition-indicator-excellent.png',
  './assets/conditions/condition-indicator-good.png',
  './assets/conditions/condition-indicator-regular.png',
  './assets/conditions/condition-indicator-poor.png',
  './assets/conditions/condition-indicator-flooded.png',
  './assets/conditions/condition-indicator-unobserved.png',
  './assets/buildings/building-house-main-er08-09.png',
  './assets/buildings/building-house-secondary-er13.png',
]

self.addEventListener('install', event => {
  self.skipWaiting()
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS)))
})

self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key)))).then(() => self.clients.claim()))
})

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return
  event.respondWith(fetch(event.request).then(response => {
    if (response.ok) { const copy=response.clone(); caches.open(CACHE).then(cache => cache.put(event.request,copy)) }
    return response
  }).catch(() => caches.match(event.request).then(hit => hit || caches.match('./index.html'))))
})
