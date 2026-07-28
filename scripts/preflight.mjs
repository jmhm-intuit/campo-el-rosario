import fs from 'node:fs'
import path from 'node:path'

const root = path.resolve(new URL('..', import.meta.url).pathname)
let failed = false
const pass = (message) => console.log(`PASS  ${message}`)
const fail = (message) => { failed = true; console.error(`FAIL  ${message}`) }

const required = [
  'index.html','app.js','styles.css','manifest.webmanifest','VERSION.json','sw.js','.nojekyll',
  '.github/workflows/deploy-pages.yml','data/sample-v7.js','data/campo-muestra-16-meses-v7.json',
  'assets/map/el-rosario-map.png','assets/geometry/polygons-reviewed-final.json',
  'assets/icons/icon-home-house.png','assets/icons/icon-register-animals.png',
  'assets/conditions/v505/pasture-excellent.png','assets/conditions/v505/pasture-good.png',
  'assets/conditions/v505/pasture-regular.png','assets/conditions/v505/pasture-poor.png',
  'assets/conditions/v505/pasture-waterlogged.png','assets/animals/v601/manifest.json',
]
for (const file of required) if (!fs.existsSync(path.join(root,file))) fail(`Falta ${file}`)
if (!failed) pass('Archivos obligatorios presentes')

const version = JSON.parse(fs.readFileSync(path.join(root,'VERSION.json'),'utf8'))
const html = fs.readFileSync(path.join(root,'index.html'),'utf8')
const js = fs.readFileSync(path.join(root,'app.js'),'utf8')
const css = fs.readFileSync(path.join(root,'styles.css'),'utf8')
const sw = fs.readFileSync(path.join(root,'sw.js'),'utf8')
const workflow = fs.readFileSync(path.join(root,'.github/workflows/deploy-pages.yml'),'utf8')
const geometry = JSON.parse(fs.readFileSync(path.join(root,'assets/geometry/polygons-reviewed-final.json'),'utf8'))
const sample = JSON.parse(fs.readFileSync(path.join(root,'data/campo-muestra-16-meses-v7.json'),'utf8'))

if (version.version !== '7.01' || version.build !== 701) fail('VERSION.json no identifica Campo v7.01 build 701')
if (version.storageKey !== 'campo-el-rosario-v2') fail('Cambió la clave de persistencia')
if (version.cache !== 'campo-v701-assets-1') fail('Caché incorrecta')
if (!html.includes('Campo v7.01') || !html.includes('data/sample-v7.js')) fail('index.html no carga v7.01 y la muestra')
if (!js.includes("const APP_VERSION_LABEL = '7.01'")) fail('app.js no identifica v7.01')
if (!js.includes("const STORAGE_KEY = 'campo-el-rosario-v2'")) fail('app.js no conserva storage key')
if (!sw.includes('campo-v701-assets-1') || !sw.includes('./data/sample-v7.js')) fail('Service worker incompleto')
if (!workflow.includes('node-version: 24')) fail('Workflow no usa Node 24')
if (!css.includes('Campo v7.01') && !css.includes('v701-map-svg')) fail('CSS v7.01 ausente')
if (!failed) pass('Versión, persistencia, caché y workflow validados')

function pngInfo(file) {
  const data = fs.readFileSync(file)
  if (data.length < 26 || data.toString('ascii',1,4) !== 'PNG') return null
  return { width:data.readUInt32BE(16), height:data.readUInt32BE(20), colorType:data.readUInt8(25) }
}
const map = pngInfo(path.join(root,'assets/map/el-rosario-map.png'))
if (!map || map.width !== 1154 || map.height !== 1363) fail('Mapa maestro no mide 1154 x 1363')
else pass('Mapa maestro 1154 x 1363')
if (!Array.isArray(geometry.lots) || geometry.lots.length !== 18) fail('Geometría no contiene 18 lotes')
if ((geometry.lots||[]).reduce((a,l)=>a+Number(l.hectares||0),0) !== 1735) fail('Superficie distinta de 1.735 ha')
else pass('18 lotes y 1.735 ha')

if (!Array.isArray(sample.surveys) || sample.surveys.length !== 16) fail('La muestra no contiene 16 relevamientos')
if (!Array.isArray(sample.animalEvents) || sample.animalEvents.length < 40) fail('La muestra no contiene eventos detallados suficientes')
if (!sample.surveys.every(s=>s.nombre==='Muestra')) fail('Hay relevamientos sin Nombre=Muestra')
if (!sample.animalEvents.every(e=>e.nombre==='Muestra')) fail('Hay eventos sin Nombre=Muestra')
const forbidden = new Set(['hembras-no-cria','machos-recria','otros'])
const used = new Set(sample.surveys.flatMap(s=>s.lots||[]).flatMap(l=>l.groups||[]).map(g=>g.categoryId))
for (const id of forbidden) if (used.has(id)) fail(`Categoría antigua presente: ${id}`)
for (const requiredCategory of ['vacas-cria','vacas-descarte','vaquillonas-reposicion','ternero-macho','ternera-hembra','toro-reproductor','novillito']) if (!used.has(requiredCategory)) fail(`Falta categoría v7: ${requiredCategory}`)
if (!failed) pass(`Muestra validada: ${sample.surveys.length} relevamientos y ${sample.animalEvents.length} eventos`)

for (const token of ['renderEventsPage','renderIntroductionPage','herdBalanceForSurvey','projectedLotsForDate','renderLotHistoryChart','data-map-zoom-in','data-archive-survey','data-delete-survey','eventsCsv']) {
  if (!js.includes(token)) fail(`Falta función o control ${token}`)
}
if (!failed) pass('Eventos, balance, proyección, zoom, evolución y archivo presentes')

if (failed) process.exit(1)
console.log('Campo v7.01 preflight complete')
