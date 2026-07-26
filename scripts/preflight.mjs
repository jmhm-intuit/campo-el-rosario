import fs from 'node:fs'
import path from 'node:path'

const root = path.resolve(new URL('..', import.meta.url).pathname)
const fail = (message) => { console.error(message); failed = true }
let failed = false

const required = [
  'index.html', 'app.js', 'styles.css', 'manifest.webmanifest', 'sw.js',
  'assets/map/el-rosario-map.png',
  'assets/geometry/polygons-reviewed-final.json',
  'assets/asset-manifest.json',
  'assets/kpi/kpi-animals-red-angus.png',
  'assets/kpi/kpi-pasture.png',
  'assets/kpi/kpi-weather-rain.png',
  'assets/kpi/kpi-growth.png',
  'assets/kpi/kpi-health.png',
  'assets/conditions/condition-excellent-tile.png',
  'assets/conditions/condition-good-tile.png',
  'assets/conditions/condition-regular-tile.png',
  'assets/conditions/condition-poor-tile.png',
  'assets/conditions/condition-very-poor-tile.png',
  'assets/conditions/condition-waterlogged-tile.png',
  'assets/conditions/condition-indicator-excellent.png',
  'assets/conditions/condition-indicator-good.png',
  'assets/conditions/condition-indicator-regular.png',
  'assets/conditions/condition-indicator-poor.png',
  'assets/conditions/condition-indicator-very-poor.png',
  'assets/conditions/condition-indicator-flooded.png',
  'assets/conditions/condition-indicator-unobserved.png',
  'assets/animals/cow-diagonal-grazing-23.png',
  'assets/animals/bull-vertical-rear-standing-11.png',
  'assets/animals/calf-diagonal-grazing-33.png',
  'assets/buildings/building-house-main-er08-09.png',
  'assets/buildings/building-house-secondary-er13.png',
  '.github/workflows/deploy-pages.yml'
]

for (const file of required) {
  const full = path.join(root, file)
  if (!fs.existsSync(full) || fs.statSync(full).size === 0) fail(`Falta: ${file}`)
}

const js = fs.readFileSync(path.join(root, 'app.js'), 'utf8')
const css = fs.readFileSync(path.join(root, 'styles.css'), 'utf8')
const sw = fs.readFileSync(path.join(root, 'sw.js'), 'utf8')

for (const term of [
  'const APP_VERSION = 5',
  "const APP_VERSION_LABEL = '5.0.0'",
  "const STORAGE_KEY = 'campo-el-rosario-v2'",
  'Registrar animales por lote',
  'Cualquier diferencia de uno o más animales',
  'condition-excellent-tile.png',
  'condition-waterlogged-tile.png',
  'building-house-main-er08-09.png',
  'building-house-secondary-er13.png',
  "points: '641,795 734,795 734,1030 641,1030'",
  'viewBox="0 0 1154 1363"',
  'Datos actualizados',
  'Campo v${APP_VERSION_LABEL}'
]) {
  if (!js.includes(term)) fail(`No se encontró texto requerido en app.js: ${term}`)
}

for (const term of ['.lot-condition', '.lot-load-border', '.animal-sprite', '.map-house', '.release-status']) {
  if (!css.includes(term)) fail(`No se encontró estilo requerido: ${term}`)
}

if (!sw.includes("const CACHE = 'campo-v5-assets-2'")) fail('La caché PWA no corresponde a Campo V5.')
if (js.includes('building-water-windmill') || js.includes('windmill')) fail('El molino no debe integrarse en esta versión.')

// Validate master-map dimensions directly from the PNG header.
const map = fs.readFileSync(path.join(root, 'assets/map/el-rosario-map.png'))
if (map.readUInt32BE(16) !== 1154 || map.readUInt32BE(20) !== 1363) {
  fail('La imagen base no tiene 1154 × 1363 px.')
}

// Validate that app polygons match the approved geometry JSON exactly.
const geometry = JSON.parse(fs.readFileSync(path.join(root, 'assets/geometry/polygons-reviewed-final.json'), 'utf8'))
const appLots = new Map()
const lotRegex = /\{ id: '([^']+)', name: '([^']+)', hectares: (\d+), points: '([^']+)'/g
for (const match of js.matchAll(lotRegex)) appLots.set(match[2], { id: match[1], hectares: Number(match[3]), points: match[4] })
if (appLots.size !== 18) fail(`Se esperaban 18 lotes en app.js y se encontraron ${appLots.size}.`)
for (const lot of geometry.lots || []) {
  const appLot = appLots.get(lot.id)
  if (!appLot) { fail(`Falta el lote aprobado ${lot.id} en app.js.`); continue }
  const points = lot.points.map(({ x, y }) => `${x},${y}`).join(' ')
  if (appLot.points !== points) fail(`La geometría de ${lot.id} no coincide con el JSON aprobado.`)
  if (appLot.hectares !== lot.hectares) fail(`Las hectáreas de ${lot.id} no coinciden.`)
}

// Critical visual assets must have an alpha channel.
const alphaAssets = [
  'assets/kpi/kpi-animals-red-angus.png',
  'assets/kpi/kpi-pasture.png',
  'assets/kpi/kpi-weather-rain.png',
  'assets/kpi/kpi-growth.png',
  'assets/kpi/kpi-health.png',
  'assets/animals/cow-diagonal-grazing-23.png',
  'assets/animals/bull-vertical-rear-standing-11.png',
  'assets/animals/calf-diagonal-grazing-33.png',
  'assets/buildings/building-house-main-er08-09.png',
  'assets/buildings/building-house-secondary-er13.png',
]
for (const asset of alphaAssets) {
  const png = fs.readFileSync(path.join(root, asset))
  if (png.toString('ascii', 1, 4) !== 'PNG') { fail(`PNG inválido: ${asset}`); continue }
  const colorType = png.readUInt8(25)
  if (![4, 6].includes(colorType)) fail(`El asset no incluye canal alfa: ${asset}`)
}

if (failed) process.exit(1)
console.log('Preflight Campo V5 aprobado: geometría, assets, almacenamiento y PWA validados.')
