import fs from 'node:fs'
import path from 'node:path'

const root = path.resolve(new URL('..', import.meta.url).pathname)
let failed = false
const fail = (message) => { console.error(`FAIL: ${message}`); failed = true }
const pass = (message) => console.log(`PASS: ${message}`)

const required = [
  'index.html', 'app.js', 'styles.css', 'manifest.webmanifest', 'sw.js', 'VERSION.json',
  'assets/map/el-rosario-map.png', 'assets/geometry/polygons-reviewed-final.json',
  'assets/icons/icon-home-house.png', 'assets/icons/icon-register-animals.png',
  'assets/kpi/kpi-cow-red-angus.png', 'assets/kpi/kpi-cow-calf-red-angus.png',
  'assets/kpi/kpi-pasture.png', 'assets/kpi/kpi-weather-rain.png',
  'assets/animals/v504/cow-red-angus.png', 'assets/animals/v504/cow-red-angus-left.png',
  'assets/animals/v504/bull-red-angus.png', 'assets/animals/v504/bull-red-angus-left.png',
  'assets/animals/v504/calf-red-angus.png', 'assets/animals/v504/calf-red-angus-left.png',
  'assets/animals/v504/cow-calf-red-angus.png', 'assets/animals/v504/cow-calf-red-angus-left.png',
  'assets/conditions/v504/pasture-excellent.png', 'assets/conditions/v504/pasture-good.png',
  'assets/conditions/v504/pasture-regular.png', 'assets/conditions/v504/pasture-poor.png',
  'assets/conditions/v504/pasture-waterlogged.png',
  'assets/buildings/building-house-main-er08-09.png',
  'assets/buildings/building-house-secondary-er13.png',
  '.github/workflows/deploy-pages.yml',
]

for (const file of required) {
  const full = path.join(root, file)
  if (!fs.existsSync(full) || fs.statSync(full).size === 0) fail(`Falta o está vacío: ${file}`)
}
if (!failed) pass('Archivos obligatorios presentes')

const js = fs.readFileSync(path.join(root, 'app.js'), 'utf8')
const css = fs.readFileSync(path.join(root, 'styles.css'), 'utf8')
const sw = fs.readFileSync(path.join(root, 'sw.js'), 'utf8')
const version = JSON.parse(fs.readFileSync(path.join(root, 'VERSION.json'), 'utf8'))

const jsTerms = [
  'const APP_VERSION = 504',
  "const APP_VERSION_LABEL = '5.04'",
  "const STORAGE_KEY = 'campo-el-rosario-v2'",
  "pattern: 'v504/pasture-excellent.png'",
  "pattern: 'v504/pasture-waterlogged.png'",
  "const DEFAULT_CATEGORY_IDS = ['vacas', 'terneros-as', 'toros', 'vaquillonas']",
  'function suggestedCategoryIds()',
  'function allocateVisualKinds(',
  'function renderLotsSummaryTable(',
  'cowCalf:',
  'animal-ground-shadow',
  'condition-pill',
  'load-pill',
  'lot-concept-grid',
  'Math.ceil(heads / 30)',
  "if (value === 'muy-malo') return 'malo'",
  'viewBox="0 0 1154 1363"',
]
for (const term of jsTerms) if (!js.includes(term)) fail(`No se encontró en app.js: ${term}`)
if (!failed) pass('Funciones y reglas de Campo v5.04 presentes')

const cssTerms = [
  '/* Campo v5.04', '.lots-summary-table', '.lot-concept-grid',
  '.map-label .condition-pill.state-muy-bueno', '.map-label .load-pill.critical',
  '.animal-ground-shadow', '.animal-group-row.suggested',
  '.table-condition.state-regular', '.table-load.ok',
]
for (const term of cssTerms) if (!css.includes(term)) fail(`No se encontró estilo requerido: ${term}`)
if (js.includes('<details class="map-condition-legend"')) fail('No debe existir una leyenda permanente de condiciones en el mapa.')
if (!failed) pass('Jerarquía visual, tabla y flujo de carga presentes')

if (version.version !== '5.04' || version.storageKey !== 'campo-el-rosario-v2') fail('VERSION.json no corresponde a v5.04 o cambió la clave local.')
if (!sw.includes("const CACHE = 'campo-v504-assets-1'")) fail('La caché PWA debe ser campo-v504-assets-1.')
if (!failed) pass('Versión, persistencia local y caché correctas')

const assetMatch = sw.match(/const ASSETS = \[([\s\S]*?)\]/)
if (!assetMatch) fail('No se encontró la lista ASSETS del service worker.')
else {
  const paths = [...assetMatch[1].matchAll(/'([^']+)'/g)].map((match) => match[1])
  for (const relative of paths) {
    if (relative === './') continue
    const full = path.join(root, relative.replace(/^\.\//, ''))
    if (!fs.existsSync(full)) fail(`El service worker intenta cachear un archivo inexistente: ${relative}`)
  }
  if (!failed) pass(`Service worker validado (${paths.length} rutas)`)
}

const mapPng = fs.readFileSync(path.join(root, 'assets/map/el-rosario-map.png'))
if (mapPng.toString('ascii', 1, 4) !== 'PNG') fail('El mapa maestro no es PNG.')
else if (mapPng.readUInt32BE(16) !== 1154 || mapPng.readUInt32BE(20) !== 1363) fail('El mapa maestro no mide 1154 × 1363 px.')
else pass('Mapa maestro 1154 × 1363')

const geometry = JSON.parse(fs.readFileSync(path.join(root, 'assets/geometry/polygons-reviewed-final.json'), 'utf8'))
const appLots = new Map()
const lotRegex = /\{ id: '([^']+)', name: '([^']+)', hectares: (\d+), points: '([^']+)'/g
for (const match of js.matchAll(lotRegex)) appLots.set(match[2], { id: match[1], hectares: Number(match[3]), points: match[4] })
if (appLots.size !== 18) fail(`Se esperaban 18 lotes y se encontraron ${appLots.size}.`)
let hectares = 0
for (const lot of geometry.lots || []) {
  const appLot = appLots.get(lot.id)
  hectares += Number(lot.hectares || 0)
  if (!appLot) { fail(`Falta ${lot.id} en app.js.`); continue }
  const points = lot.points.map(({ x, y }) => `${x},${y}`).join(' ')
  if (appLot.points !== points) fail(`La geometría de ${lot.id} no coincide con el JSON aprobado.`)
  if (appLot.hectares !== lot.hectares) fail(`Las hectáreas de ${lot.id} no coinciden.`)
}
if (hectares !== 1735) fail(`La superficie total es ${hectares}, no 1735 ha.`)
if (!failed) pass('18 polígonos revisados y 1.735 ha validados')

const alphaAssets = required.filter((file) => file.includes('assets/animals/v504/'))
for (const asset of alphaAssets) {
  const png = fs.readFileSync(path.join(root, asset))
  if (png.toString('ascii', 1, 4) !== 'PNG') { fail(`PNG inválido: ${asset}`); continue }
  if (![4, 6].includes(png.readUInt8(25))) fail(`El asset no incluye canal alfa: ${asset}`)
}
if (!failed) pass('Ocho variantes animales con transparencia')

for (const texture of required.filter((file) => file.includes('conditions/v504/'))) {
  const png = fs.readFileSync(path.join(root, texture))
  if (png.readUInt32BE(16) !== 512 || png.readUInt32BE(20) !== 512) fail(`La textura no mide 512 × 512: ${texture}`)
}
if (!failed) pass('Cinco texturas contrastadas de 512 × 512')

if (failed) process.exit(1)
console.log('\nPreflight Campo v5.04 aprobado.')
