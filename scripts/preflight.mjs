import fs from 'node:fs'
import path from 'node:path'

const root = path.resolve(new URL('..', import.meta.url).pathname)
let failed = false
const fail = (message) => { console.error(message); failed = true }
const required = [
  'index.html','app.js','styles.css','manifest.webmanifest','sw.js',
  'assets/map/el-rosario-map.png','assets/geometry/polygons-reviewed-final.json','assets/asset-manifest.json',
  'assets/kpi/kpi-cow-red-angus.png','assets/kpi/kpi-cow-calf-red-angus.png','assets/kpi/kpi-pasture.png','assets/kpi/kpi-weather-rain.png','assets/kpi/kpi-growth.png','assets/kpi/kpi-health.png',
  'assets/animals/map-cow-red-angus.png','assets/animals/map-cow-red-angus-left.png','assets/animals/map-bull-red-angus.png','assets/animals/map-bull-red-angus-left.png','assets/animals/map-calf-red-angus.png','assets/animals/map-calf-red-angus-left.png','assets/animals/map-cow-calf-red-angus.png',
  'assets/conditions/v501/pasture-excellent.png','assets/conditions/v501/pasture-good.png','assets/conditions/v501/pasture-regular.png','assets/conditions/v501/pasture-poor.png','assets/conditions/v501/pasture-very-poor.png','assets/conditions/v501/pasture-waterlogged.png',
  'assets/buildings/building-house-main-er08-09.png','assets/buildings/building-house-secondary-er13.png',
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
  'const APP_VERSION = 501', "const APP_VERSION_LABEL = '5.01'", "const STORAGE_KEY = 'campo-el-rosario-v2'",
  'function editSurvey(', 'id="survey-switcher"', 'Math.ceil(heads / 30)', 'lot-load-halo',
  'v501/pasture-excellent.png', 'map-cow-red-angus.png', 'kpi-cow-calf-red-angus.png',
  "points: '641,795 734,795 734,1030 641,1030'", 'viewBox="0 0 1154 1363"'
]) if (!js.includes(term)) fail(`No se encontró en app.js: ${term}`)
for (const term of ['.survey-switcher','.lot-load-halo','.load-status-card','.map-label .lot-heads','.aerial-base']) if (!css.includes(term)) fail(`No se encontró estilo: ${term}`)
if (js.includes('<details class="map-condition-legend"')) fail('No debe mostrarse una leyenda permanente de condición.')
if (!sw.includes("const CACHE = 'campo-v501-assets-1'")) fail('La caché PWA no corresponde a v5.01.')
if (js.includes('building-water-windmill') || js.includes('windmill')) fail('El molino sigue fuera del alcance.')

// Map dimensions.
const map = fs.readFileSync(path.join(root, 'assets/map/el-rosario-map.png'))
if (map.readUInt32BE(16) !== 1154 || map.readUInt32BE(20) !== 1363) fail('La imagen base no tiene 1154 × 1363 px.')

// Geometry matches the approved JSON.
const geometry = JSON.parse(fs.readFileSync(path.join(root, 'assets/geometry/polygons-reviewed-final.json'), 'utf8'))
const appLots = new Map()
const lotRegex = /\{ id: '([^']+)', name: '([^']+)', hectares: (\d+), points: '([^']+)'/g
for (const match of js.matchAll(lotRegex)) appLots.set(match[2], { id: match[1], hectares: Number(match[3]), points: match[4] })
if (appLots.size !== 18) fail(`Se esperaban 18 lotes y se encontraron ${appLots.size}.`)
for (const lot of geometry.lots || []) {
  const appLot = appLots.get(lot.id)
  if (!appLot) { fail(`Falta ${lot.id}.`); continue }
  const points = lot.points.map(({x,y}) => `${x},${y}`).join(' ')
  if (appLot.points !== points) fail(`La geometría de ${lot.id} no coincide.`)
  if (appLot.hectares !== lot.hectares) fail(`Las hectáreas de ${lot.id} no coinciden.`)
}

// Critical visuals must support transparency.
const alphaAssets = [
  'assets/kpi/kpi-cow-red-angus.png','assets/kpi/kpi-cow-calf-red-angus.png',
  'assets/animals/map-cow-red-angus.png','assets/animals/map-bull-red-angus.png','assets/animals/map-calf-red-angus.png','assets/animals/map-cow-calf-red-angus.png',
  'assets/buildings/building-house-main-er08-09.png','assets/buildings/building-house-secondary-er13.png'
]
for (const asset of alphaAssets) {
  const png = fs.readFileSync(path.join(root, asset))
  if (png.toString('ascii',1,4) !== 'PNG') { fail(`PNG inválido: ${asset}`); continue }
  const colorType = png.readUInt8(25)
  if (![4,6].includes(colorType)) fail(`El asset no incluye canal alfa: ${asset}`)
}
for (const tile of required.filter((file) => file.includes('conditions/v501'))) {
  const png=fs.readFileSync(path.join(root,tile))
  if (png.readUInt32BE(16)!==512 || png.readUInt32BE(20)!==512) fail(`La textura no mide 512 × 512: ${tile}`)
}
if (failed) process.exit(1)
console.log('Preflight Campo v5.01 aprobado: edición, selector, geometría, superficies y assets validados.')
