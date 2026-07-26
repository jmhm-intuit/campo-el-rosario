const CACHE = 'campo-v5-assets-2'
const ASSETS = [
  './',
  './index.html',
  './app.js',
  './styles.css',
  './manifest.webmanifest',
  './assets/map/el-rosario-map.png',
  './assets/kpi/kpi-animals-red-angus.png',
  './assets/kpi/kpi-growth.png',
  './assets/kpi/kpi-health.png',
  './assets/kpi/kpi-hectares.png',
  './assets/kpi/kpi-pasture.png',
  './assets/kpi/kpi-water.png',
  './assets/kpi/kpi-weather-rain.png',
  './assets/conditions/condition-excellent-tile.png',
  './assets/conditions/condition-good-tile.png',
  './assets/conditions/condition-indicator-excellent.png',
  './assets/conditions/condition-indicator-flooded.png',
  './assets/conditions/condition-indicator-good.png',
  './assets/conditions/condition-indicator-poor.png',
  './assets/conditions/condition-indicator-regular.png',
  './assets/conditions/condition-indicator-unobserved.png',
  './assets/conditions/condition-indicator-very-poor.png',
  './assets/conditions/condition-poor-tile.png',
  './assets/conditions/condition-regular-tile.png',
  './assets/conditions/condition-very-poor-tile.png',
  './assets/conditions/condition-waterlogged-tile.png',
  './assets/conditions/decor-water-hole.png',
  './assets/conditions/grass-dense-01.png',
  './assets/conditions/grass-dense-02.png',
  './assets/conditions/grass-dry-01.png',
  './assets/conditions/grass-dry-02.png',
  './assets/conditions/grass-dry-03.png',
  './assets/conditions/grass-flowers.png',
  './assets/animals/bull-diagonal-grazing-14.png',
  './assets/animals/bull-diagonal-grazing-15.png',
  './assets/animals/bull-vertical-front-grazing-13.png',
  './assets/animals/bull-vertical-rear-standing-11.png',
  './assets/animals/bull-vertical-rear-standing-12.png',
  './assets/animals/calf-diagonal-grazing-33.png',
  './assets/animals/calf-diagonal-grazing-34.png',
  './assets/animals/calf-diagonal-lying-lying-43.png',
  './assets/animals/calf-horizontal-lying-lying-35.png',
  './assets/animals/calf-horizontal-lying-lying-44.png',
  './assets/animals/calf-horizontal-lying-lying-45.png',
  './assets/animals/calf-vertical-rear-standing-31.png',
  './assets/animals/calf-vertical-rear-standing-32.png',
  './assets/animals/calf-vertical-rear-standing-41.png',
  './assets/animals/calf-vertical-rear-standing-42.png',
  './assets/animals/cow-diagonal-grazing-23.png',
  './assets/animals/cow-diagonal-grazing-24.png',
  './assets/animals/cow-horizontal-grazing-25.png',
  './assets/animals/cow-vertical-rear-standing-21.png',
  './assets/animals/cow-vertical-rear-standing-22.png',
  './assets/buildings/building-house-main-er08-09.png',
  './assets/buildings/building-house-secondary-er13.png',
  './assets/asset-manifest.json',
  './assets/geometry/polygons-reviewed-final.json'
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
  if (event.request.method !== 'GET') return
  event.respondWith(
    fetch(event.request)
      .then(response => {
        if (response.ok) {
          const copy = response.clone()
          caches.open(CACHE).then(cache => cache.put(event.request, copy))
        }
        return response
      })
      .catch(() => caches.match(event.request).then(hit => hit || caches.match('./index.html')))
  )
})
