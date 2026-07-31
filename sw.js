const CACHE = 'campo-v1001-assets-1'
const CORE_ASSETS = [
  './',
  './index.html',
  './app.js',
  './icon-library.js',
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
  './assets/icons/status/load-low.svg',
  './assets/icons/status/load-adequate.svg',
  './assets/icons/status/load-optimal.svg',
  './assets/icons/status/load-high.svg',
  './assets/icons/status/load-overload.svg',
  './assets/icons/status/load-critical.svg',
  './assets/icons/status/condition-muy-bueno.svg',
  './assets/icons/status/condition-bueno.svg',
  './assets/icons/status/condition-regular.svg',
  './assets/icons/status/condition-malo.svg',
  './assets/icons/status/condition-anegado.svg',
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
  './assets/animals/v601/cow-calf/cow-calf-west-4.png',
  './assets/icons/v902/64/alert-condition.png',
  './assets/icons/v902/64/alert-data.png',
  './assets/icons/v902/64/alert-inventory.png',
  './assets/icons/v902/64/alert-load.png',
  './assets/icons/v902/64/alert-rain.png',
  './assets/icons/v902/64/backup-export.png',
  './assets/icons/v902/64/backup-import.png',
  './assets/icons/v902/64/balance.png',
  './assets/icons/v902/64/bull.png',
  './assets/icons/v902/64/calendar-commercial.png',
  './assets/icons/v902/64/calendar-pasture.png',
  './assets/icons/v902/64/calendar-vaccination.png',
  './assets/icons/v902/64/calf.png',
  './assets/icons/v902/64/condition-flooded.png',
  './assets/icons/v902/64/condition-good.png',
  './assets/icons/v902/64/condition-no-info.png',
  './assets/icons/v902/64/condition-poor.png',
  './assets/icons/v902/64/condition-regular.png',
  './assets/icons/v902/64/condition-very-good.png',
  './assets/icons/v902/64/cow.png',
  './assets/icons/v902/64/demo-delete.png',
  './assets/icons/v902/64/demo-load.png',
  './assets/icons/v902/64/demo-open.png',
  './assets/icons/v902/64/demo-reset.png',
  './assets/icons/v902/64/demo.png',
  './assets/icons/v902/64/event-adjustment.png',
  './assets/icons/v902/64/event-birth.png',
  './assets/icons/v902/64/event-mortality.png',
  './assets/icons/v902/64/event-purchase.png',
  './assets/icons/v902/64/event-reclassification.png',
  './assets/icons/v902/64/event-sale.png',
  './assets/icons/v902/64/export-csv.png',
  './assets/icons/v902/64/export-pdf.png',
  './assets/icons/v902/64/heifer.png',
  './assets/icons/v902/64/herd.png',
  './assets/icons/v902/64/kpi-animals.png',
  './assets/icons/v902/64/kpi-balance.png',
  './assets/icons/v902/64/kpi-birth.png',
  './assets/icons/v902/64/kpi-condition.png',
  './assets/icons/v902/64/kpi-load.png',
  './assets/icons/v902/64/kpi-mortality.png',
  './assets/icons/v902/64/kpi-purchases.png',
  './assets/icons/v902/64/kpi-rain.png',
  './assets/icons/v902/64/kpi-sales.png',
  './assets/icons/v902/64/kpi-water-index.png',
  './assets/icons/v902/64/load-adequate.png',
  './assets/icons/v902/64/load-critical.png',
  './assets/icons/v902/64/load-high.png',
  './assets/icons/v902/64/load-low.png',
  './assets/icons/v902/64/load-overload.png',
  './assets/icons/v902/64/map-animation.png',
  './assets/icons/v902/64/map-fit.png',
  './assets/icons/v902/64/map-pause.png',
  './assets/icons/v902/64/map-selected.png',
  './assets/icons/v902/64/map-zoom-in.png',
  './assets/icons/v902/64/map-zoom-out.png',
  './assets/icons/v902/64/nav-history.png',
  './assets/icons/v902/64/nav-home.png',
  './assets/icons/v902/64/nav-map.png',
  './assets/icons/v902/64/nav-more.png',
  './assets/icons/v902/64/nav-register.png',
  './assets/icons/v902/64/nav-review.png',
  './assets/icons/v902/64/rain-cumulative.png',
  './assets/icons/v902/64/rain-fortnight.png',
  './assets/icons/v902/64/rain-index.png',
  './assets/icons/v902/64/rain-monthly.png',
  './assets/icons/v902/64/rain.png',
  './assets/icons/v902/64/report-balance.png',
  './assets/icons/v902/64/report-field.png',
  './assets/icons/v902/64/report-herd.png',
  './assets/icons/v902/64/report-monthly.png',
  './assets/icons/v902/64/report-rain.png',
  './assets/icons/v902/64/review-balance.png',
  './assets/icons/v902/64/review-field.png',
  './assets/icons/v902/64/review-herd.png',
  './assets/icons/v902/64/settings-animation.png',
  './assets/icons/v902/64/settings-backup.png',
  './assets/icons/v902/64/settings-demo.png',
  './assets/icons/v902/64/settings-display.png',
  './assets/icons/v902/64/settings-general.png',
  './assets/icons/v902/64/settings-storage.png',
  './assets/icons/v902/64/survey-archive.png',
  './assets/icons/v902/64/survey-delete.png',
  './assets/icons/v902/64/survey-full.png',
  './assets/icons/v902/64/survey-quick.png',
  './assets/icons/v902/64/survey-save.png',
  './assets/icons/v902/64/young-steer.png',
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
