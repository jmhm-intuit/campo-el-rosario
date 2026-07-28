import fs from 'node:fs'
import path from 'node:path'

const root = path.resolve(new URL('..', import.meta.url).pathname)
let failed = false
const fail = (message) => { console.error(`FAIL: ${message}`); failed = true }
const pass = (message) => console.log(`PASS: ${message}`)

const required = [
  'index.html','app.js','styles.css','manifest.webmanifest','sw.js','VERSION.json',
  'assets/map/el-rosario-map.png','assets/geometry/polygons-reviewed-final.json',
  'assets/icons/icon-home-house.png','assets/icons/icon-register-animals.png',
  'assets/kpi/kpi-cow-red-angus.png','assets/kpi/kpi-cow-calf-red-angus.png',
  'assets/kpi/kpi-pasture.png','assets/kpi/kpi-weather-rain.png',
  'assets/conditions/v505/pasture-excellent.png','assets/conditions/v505/pasture-good.png',
  'assets/conditions/v505/pasture-regular.png','assets/conditions/v505/pasture-poor.png',
  'assets/conditions/v505/pasture-waterlogged.png','assets/data/lluvia-laprida-curva-quincenal.csv',
  'assets/animals/aerial/manifest.json','.github/workflows/deploy-pages.yml',
]
for (const file of required) {
  const full = path.join(root,file)
  if (!fs.existsSync(full) || fs.statSync(full).size === 0) fail(`Falta o está vacío: ${file}`)
}
if (!failed) pass('Archivos principales presentes')

const version = JSON.parse(fs.readFileSync(path.join(root,'VERSION.json'),'utf8'))
if (version.version !== '6.01') fail('VERSION.json no corresponde a 6.01')
if (version.storageKey !== 'campo-el-rosario-v2') fail('Cambió la clave de persistencia local')
if (version.cache !== 'campo-v601-assets-1') fail('Caché incorrecta')
if (!failed) pass('Versión, persistencia y caché correctas')

const js = fs.readFileSync(path.join(root,'app.js'),'utf8')
const css = fs.readFileSync(path.join(root,'styles.css'),'utf8')
const jsTerms = [
  "const APP_VERSION = 601", "const APP_VERSION_LABEL = '6.01'",
  'const LAPRIDA_FORTNIGHTS', 'function renderRainPage()',
  'function renderMapLotsTable(', 'function aggregatedOperationalAlerts(',
  'animals/aerial/', "ui.mapMode", "ui.rainGranularity",
  'data-save-rain-monthly', 'data-confirm-zero-rain',
]
for (const term of jsTerms) if (!js.includes(term)) fail(`Falta en app.js: ${term}`)
const cssTerms = ['Campo v6.01', '.kpi-grid.v2.v601', '.map-lots-table', '.rain-comparison-table', '.map-animal-html.aerial', '.coming-soon']
for (const term of cssTerms) if (!css.includes(term)) fail(`Falta en styles.css: ${term}`)
if (!failed) pass('Funciones y estilos v6.01 presentes')

const aerialManifest = JSON.parse(fs.readFileSync(path.join(root,'assets/animals/aerial/manifest.json'),'utf8'))
if (aerialManifest.length !== 64) fail(`Se esperaban 64 sprites aéreos y hay ${aerialManifest.length}`)
for (const item of aerialManifest) {
  const full = path.join(root,'assets',item.path)
  if (!fs.existsSync(full)) fail(`Falta sprite: ${item.path}`)
  else {
    const png = fs.readFileSync(full)
    if (png.toString('ascii',1,4) !== 'PNG') fail(`Sprite no PNG: ${item.path}`)
    if (![4,6].includes(png.readUInt8(25))) fail(`Sprite sin alfa: ${item.path}`)
  }
}
if (!failed) pass('64 sprites aéreos transparentes validados')

const csv = fs.readFileSync(path.join(root,'assets/data/lluvia-laprida-curva-quincenal.csv'),'utf8').replace(/^\uFEFF/,'')
const csvRows = csv.trim().split(/\r?\n/)
if (csvRows.length !== 25) fail(`El CSV debe tener encabezado + 24 quincenas; tiene ${csvRows.length}`)
if (!failed) pass('Curva histórica de Laprida: 24 quincenas')

const geometry = JSON.parse(fs.readFileSync(path.join(root,'assets/geometry/polygons-reviewed-final.json'),'utf8'))
if ((geometry.lots || []).length !== 18) fail('La geometría no contiene 18 lotes')
const hectares = (geometry.lots || []).reduce((sum,lot)=>sum+Number(lot.hectares||0),0)
if (hectares !== 1735) fail(`La superficie total es ${hectares}, no 1735 ha`)
if (!failed) pass('18 lotes y 1.735 ha')

const mapPng = fs.readFileSync(path.join(root,'assets/map/el-rosario-map.png'))
if (mapPng.readUInt32BE(16) !== 1154 || mapPng.readUInt32BE(20) !== 1363) fail('Mapa maestro distinto de 1154 × 1363')
else pass('Mapa maestro 1154 × 1363')

const sw = fs.readFileSync(path.join(root,'sw.js'),'utf8')
if (!sw.includes("const CACHE = 'campo-v601-assets-1'")) fail('Service worker no usa la caché v6.01')
const match = sw.match(/const ASSETS = \[([\s\S]*?)\]/)
if (!match) fail('No se encontró ASSETS en sw.js')
else {
  const paths = [...match[1].matchAll(/'([^']+)'/g)].map((m)=>m[1])
  for (const relative of paths) {
    if (relative === './') continue
    const full = path.join(root,relative.replace(/^\.\//,''))
    if (!fs.existsSync(full)) fail(`SW intenta cachear archivo inexistente: ${relative}`)
  }
  if (!failed) pass(`Service worker validado (${paths.length} rutas)`)
}

if (failed) process.exit(1)
console.log('\nPreflight Campo v6.01 aprobado.')
