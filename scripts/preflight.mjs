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
  'assets/icons/icon-register-animals-24.png', 'assets/icons/icon-register-animals-32.png', 'assets/icons/icon-register-animals-48.png',
  'assets/kpi/kpi-cow-red-angus.png', 'assets/kpi/kpi-cow-calf-red-angus.png',
  'assets/kpi/kpi-pasture.png', 'assets/kpi/kpi-weather-rain.png',
  'assets/kpi/kpi-growth.png', 'assets/kpi/kpi-health.png',
  'assets/animals/map-cow-red-angus.png', 'assets/animals/map-cow-red-angus-left.png',
  'assets/animals/map-bull-red-angus.png', 'assets/animals/map-bull-red-angus-left.png',
  'assets/animals/map-calf-red-angus.png', 'assets/animals/map-calf-red-angus-left.png',
  'assets/buildings/building-house-main-er08-09.png',
  'assets/buildings/building-house-secondary-er13.png',
  'assets/conditions/v503/pasture-excellent.png',
  'assets/conditions/v503/pasture-good.png',
  'assets/conditions/v503/pasture-regular.png',
  'assets/conditions/v503/pasture-poor.png',
  'assets/conditions/v503/pasture-waterlogged.png',
  'assets/conditions/condition-indicator-excellent.png',
  'assets/conditions/condition-indicator-good.png',
  'assets/conditions/condition-indicator-regular.png',
  'assets/conditions/condition-indicator-poor.png',
  'assets/conditions/condition-indicator-flooded.png',
  'assets/conditions/condition-indicator-unobserved.png',
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
  'const APP_VERSION = 503',
  "const APP_VERSION_LABEL = '5.03'",
  "const STORAGE_KEY = 'campo-el-rosario-v2'",
  'const CONDITION_RECENT_DAYS = 60',
  'function resolveLotCondition(',
  'function renderSurveyNavigator(',
  'function renderRainModal(',
  'function monthlyRainSummary(',
  "context:'direct'",
  'data-edit-map-lot',
  'Math.ceil(heads / 30)',
  'condition-assumption-hatch',
  "if (value === 'muy-malo') return 'malo'",
  'const patternSize = 480',
  'animal-ground-shadow',
  'lot-load-halo',
  "source: 'seasonal'",
  'data-save-rain-entry',
  'data-open-survey-history',
  "points: '641,795 734,795 734,1030 641,1030'",
  'viewBox="0 0 1154 1363"',
]
for (const term of jsTerms) if (!js.includes(term)) fail(`No se encontró en app.js: ${term}`)
if (!failed) pass('Funciones y reglas de Campo v5.03 presentes')

const cssTerms = [
  '.survey-navigator', '.condition-assumption-hatch', '.condition-detail-card',
  '.lot-inspector-actions', '.rain-entry-list', '.survey-history-option',
  '.map-label.narrow', '.condition-strip', '.lot-load-halo',
  '.aerial-base{opacity:1', '.release-status', '.draft-save-status',
  '.animal-ground-shadow', 'Campo v5.03 — refined pasture assets and cattle contrast',
]
for (const term of cssTerms) if (!css.includes(term)) fail(`No se encontró estilo requerido: ${term}`)
if (js.includes('<details class="map-condition-legend"')) fail('No debe existir una leyenda permanente de condiciones en el mapa.')
if (js.includes('building-water-windmill') || js.includes('windmill')) fail('El molino debe permanecer fuera de Campo v5.03.')
if (js.includes("id: 'muy-malo'")) fail('Muy malo ya no debe aparecer como estado seleccionable en Campo v5.03.')
if (!js.includes("if (value === 'muy-malo') return 'malo'")) fail('Falta la migración automática de Muy malo a Malo.')
if ((js.match(/pattern: 'v503\/pasture-/g) || []).length !== 5) fail('Se esperaban exactamente cinco texturas visuales v5.03.')

if (!failed) pass('Jerarquía visual, edición directa y lluvia diaria estilizadas')

if (version.version !== '5.03' || version.storageKey !== 'campo-el-rosario-v2') fail('VERSION.json no corresponde a v5.03 o cambió la clave local.')
if (!sw.includes("const CACHE = 'campo-v503-assets-1'")) fail('La caché PWA debe ser campo-v503-assets-1.')
if (!failed) pass('Versión, migración local y caché correctas')

// Validate every service-worker asset exists. Missing cache files break installation.
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

// Base image dimensions.
const mapPng = fs.readFileSync(path.join(root, 'assets/map/el-rosario-map.png'))
if (mapPng.toString('ascii', 1, 4) !== 'PNG') fail('El mapa maestro no es PNG.')
else if (mapPng.readUInt32BE(16) !== 1154 || mapPng.readUInt32BE(20) !== 1363) fail('El mapa maestro no mide 1154 × 1363 px.')
else pass('Mapa maestro 1154 × 1363')

// Geometry exactly matches the reviewed JSON.
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

// Transparent UI assets.
const alphaAssets = [
  'assets/icons/icon-home-house.png', 'assets/icons/icon-register-animals.png',
  'assets/icons/icon-register-animals-24.png', 'assets/icons/icon-register-animals-32.png', 'assets/icons/icon-register-animals-48.png',
  'assets/kpi/kpi-cow-red-angus.png', 'assets/kpi/kpi-cow-calf-red-angus.png',
  'assets/animals/map-cow-red-angus.png', 'assets/animals/map-bull-red-angus.png',
  'assets/animals/map-calf-red-angus.png',
  'assets/buildings/building-house-main-er08-09.png',
  'assets/buildings/building-house-secondary-er13.png',
]
for (const asset of alphaAssets) {
  const png = fs.readFileSync(path.join(root, asset))
  if (png.toString('ascii', 1, 4) !== 'PNG') { fail(`PNG inválido: ${asset}`); continue }
  if (![4, 6].includes(png.readUInt8(25))) fail(`El asset no incluye canal alfa: ${asset}`)
}
if (!failed) pass('Assets críticos con transparencia')

for (const texture of required.filter((file) => file.includes('conditions/v503/'))) {
  const png = fs.readFileSync(path.join(root, texture))
  if (png.readUInt32BE(16) !== 768 || png.readUInt32BE(20) !== 768) fail(`La textura no mide 768 × 768: ${texture}`)
}
if (!failed) pass('Texturas de condición 768 × 768')

if (failed) process.exit(1)
console.log('\nPreflight Campo v5.03 aprobado.')
