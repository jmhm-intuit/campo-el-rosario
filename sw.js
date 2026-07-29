const CACHE = 'campo-v802-assets-1'
const CORE_ASSETS = [
  './',
  './index.html',
  './app.js',
  './animal-animation.js',
  './animal-sprite-library.js',
  './styles.css',
  './manifest.webmanifest',
  './VERSION.json',
  './data/sample-v8.js',
  './data/campo-muestra-16-meses-v8.json',
  './assets/map/el-rosario-map.png',
  './assets/geometry/polygons-reviewed-final.json',
  './assets/asset-manifest.json',
  './assets/icons/icon-home-house.png',
  './assets/icons/icon-register-animals.png',
  './assets/ui/register-animals.png',
  './assets/kpi/kpi-cow-red-angus.png',
  './assets/kpi/kpi-cow-calf-red-angus.png',
  './assets/kpi/kpi-pasture.png',
  './assets/kpi/kpi-weather-rain.png',
  './assets/kpi/kpi-growth.png',
  './assets/kpi/kpi-health.png',
  './assets/conditions/v505/pasture-excellent.png',
  './assets/conditions/v505/pasture-good.png',
  './assets/conditions/v505/pasture-regular.png',
  './assets/conditions/v505/pasture-poor.png',
  './assets/conditions/v505/pasture-waterlogged.png',
  './assets/buildings/building-house-main-er08-09.png',
  './assets/buildings/building-house-secondary-er13.png',
  './assets/animals/v601/bull/bull-east-1.png',
  './assets/animals/v601/bull/bull-east-2.png',
  './assets/animals/v601/bull/bull-east-3.png',
  './assets/animals/v601/bull/bull-east-4.png',
  './assets/animals/v601/bull/bull-north-1.png',
  './assets/animals/v601/bull/bull-north-2.png',
  './assets/animals/v601/bull/bull-north-3.png',
  './assets/animals/v601/bull/bull-north-4.png',
  './assets/animals/v601/bull/bull-south-1.png',
  './assets/animals/v601/bull/bull-south-2.png',
  './assets/animals/v601/bull/bull-south-3.png',
  './assets/animals/v601/bull/bull-south-4.png',
  './assets/animals/v601/bull/bull-west-1.png',
  './assets/animals/v601/bull/bull-west-2.png',
  './assets/animals/v601/bull/bull-west-3.png',
  './assets/animals/v601/bull/bull-west-4.png',
  './assets/animals/v601/calf/calf-east-1.png',
  './assets/animals/v601/calf/calf-east-2.png',
  './assets/animals/v601/calf/calf-east-3.png',
  './assets/animals/v601/calf/calf-east-4.png',
  './assets/animals/v601/calf/calf-north-1.png',
  './assets/animals/v601/calf/calf-north-2.png',
  './assets/animals/v601/calf/calf-north-3.png',
  './assets/animals/v601/calf/calf-north-4.png',
  './assets/animals/v601/calf/calf-south-1.png',
  './assets/animals/v601/calf/calf-south-2.png',
  './assets/animals/v601/calf/calf-south-3.png',
  './assets/animals/v601/calf/calf-south-4.png',
  './assets/animals/v601/calf/calf-west-1.png',
  './assets/animals/v601/calf/calf-west-2.png',
  './assets/animals/v601/calf/calf-west-3.png',
  './assets/animals/v601/calf/calf-west-4.png',
  './assets/animals/v601/cow/cow-east-1.png',
  './assets/animals/v601/cow/cow-east-2.png',
  './assets/animals/v601/cow/cow-east-3.png',
  './assets/animals/v601/cow/cow-east-4.png',
  './assets/animals/v601/cow/cow-north-1.png',
  './assets/animals/v601/cow/cow-north-2.png',
  './assets/animals/v601/cow/cow-north-3.png',
  './assets/animals/v601/cow/cow-north-4.png',
  './assets/animals/v601/cow/cow-south-1.png',
  './assets/animals/v601/cow/cow-south-2.png',
  './assets/animals/v601/cow/cow-south-3.png',
  './assets/animals/v601/cow/cow-south-4.png',
  './assets/animals/v601/cow/cow-west-1.png',
  './assets/animals/v601/cow/cow-west-2.png',
  './assets/animals/v601/cow/cow-west-3.png',
  './assets/animals/v601/cow/cow-west-4.png',
  './assets/animals/v601/cow-calf/cow-calf-east-1.png',
  './assets/animals/v601/cow-calf/cow-calf-east-2.png',
  './assets/animals/v601/cow-calf/cow-calf-east-3.png',
  './assets/animals/v601/cow-calf/cow-calf-east-4.png',
  './assets/animals/v601/cow-calf/cow-calf-north-1.png',
  './assets/animals/v601/cow-calf/cow-calf-north-2.png',
  './assets/animals/v601/cow-calf/cow-calf-north-3.png',
  './assets/animals/v601/cow-calf/cow-calf-north-4.png',
  './assets/animals/v601/cow-calf/cow-calf-south-1.png',
  './assets/animals/v601/cow-calf/cow-calf-south-2.png',
  './assets/animals/v601/cow-calf/cow-calf-south-3.png',
  './assets/animals/v601/cow-calf/cow-calf-south-4.png',
  './assets/animals/v601/cow-calf/cow-calf-west-1.png',
  './assets/animals/v601/cow-calf/cow-calf-west-2.png',
  './assets/animals/v601/cow-calf/cow-calf-west-3.png',
  './assets/animals/v601/cow-calf/cow-calf-west-4.png'
]

self.addEventListener('install', (event) => {
  self.skipWaiting()
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(CORE_ASSETS)))
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  )
})

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return

  const request = event.request
  const url = new URL(request.url)
  const isNavigation = request.mode === 'navigate' || url.pathname.endsWith('/index.html')

  if (isNavigation) {
    event.respondWith(
      fetch(request, { cache: 'no-store' })
        .then((response) => {
          if (response.ok) caches.open(CACHE).then((cache) => cache.put('./index.html', response.clone()))
          return response
        })
        .catch(() => caches.match('./index.html'))
    )
    return
  }

  event.respondWith(
    caches.match(request).then((cached) => {
      const network = fetch(request).then((response) => {
        if (response.ok && url.origin === self.location.origin) {
          caches.open(CACHE).then((cache) => cache.put(request, response.clone()))
        }
        return response
      }).catch(() => cached)
      return cached || network
    })
  )
})
