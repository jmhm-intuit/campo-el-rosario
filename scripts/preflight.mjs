import fs from 'node:fs'
import path from 'node:path'

const root = path.resolve(new URL('..', import.meta.url).pathname)
let failed = false
const pass = (message) => console.log(`PASS  ${message}`)
const fail = (message) => { failed = true; console.error(`FAIL  ${message}`) }

const required = [
  'index.html','app.js','animal-animation.js','animal-sprite-library.js','styles.css',
  'manifest.webmanifest','VERSION.json','sw.js','.nojekyll','scripts/animation-smoke.mjs',
  '.github/workflows/deploy-pages.yml','data/sample-v8.js','data/campo-muestra-16-meses-v8.json',
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
const animation = fs.readFileSync(path.join(root,'animal-animation.js'),'utf8')
const library = fs.readFileSync(path.join(root,'animal-sprite-library.js'),'utf8')
const css = fs.readFileSync(path.join(root,'styles.css'),'utf8')
const sw = fs.readFileSync(path.join(root,'sw.js'),'utf8')
const workflow = fs.readFileSync(path.join(root,'.github/workflows/deploy-pages.yml'),'utf8')
const geometry = JSON.parse(fs.readFileSync(path.join(root,'assets/geometry/polygons-reviewed-final.json'),'utf8'))
const sample = JSON.parse(fs.readFileSync(path.join(root,'data/campo-muestra-16-meses-v8.json'),'utf8'))

if (version.version !== '8.02' || version.build !== 802) fail('VERSION.json no identifica Campo v8.02 build 802')
if (version.storageKey !== 'campo-el-rosario-v2') fail('Cambió la clave real de persistencia')
if (version.demoStorageKey !== 'campo-el-rosario-demo-v1') fail('Falta clave separada de la muestra')
if (version.cache !== 'campo-v802-assets-1') fail('Caché incorrecta')
if (!html.includes('Campo v8.02') || !html.includes('data/sample-v8.js')) fail('index.html no carga v8.02 y la muestra')
if (!js.includes("const APP_VERSION_LABEL = '8.02'")) fail('app.js no identifica v8.02')
if (!js.includes("const STORAGE_KEY = 'campo-el-rosario-v2'")) fail('app.js no conserva storage key')
if (!js.includes("const DEMO_STORAGE_KEY = 'campo-el-rosario-demo-v1'")) fail('app.js no separa datos de muestra')
if (!sw.includes('campo-v802-assets-1') || !sw.includes('./animal-animation.js') || !sw.includes('./animal-sprite-library.js') || !sw.includes('./data/sample-v8.js')) fail('Service worker incompleto')
if (!workflow.includes('node-version: 24')) fail('Workflow no usa Node 24')
if (!workflow.includes('animation-smoke.mjs')) fail('Workflow no ejecuta la prueba de animación')
if (!css.includes('Campo v8.02') || !css.includes('v802-map-svg')) fail('CSS v8.02 ausente')
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
if (!failed) pass(`Muestra disponible: ${sample.surveys.length} relevamientos y ${sample.animalEvents.length} eventos`)

for (const token of [
  'class AnimalAnimationManager','requestAnimationFrame','chooseTarget','validPosition',
  "simfarm",'maxSelectedWalking','cycleMode','advanceWalk','decideNextState','agentsByLot',
]) if (!animation.includes(token)) fail(`Falta dinámica SimFarm: ${token}`)
for (const token of ['ANIMAL_SPRITE_LIBRARY','STANDARD_ANIMAL_SIZE','resolveAnimalSprite','scale: 1','allAnimalSpritePaths']) if (!library.includes(token)) fail(`Falta interfaz uniforme de sprites: ${token}`)
for (const token of [
  'data-animal-id','data-agent-index','data-map-zoom-in="summary"','data-animation-mode',
  'currentSummaryViewBox','zoomSummaryMap','animalAnimator.mount','demoWorkspaceInstalled',
  'installDemoWorkspace','removeDemoWorkspace','switchWorkspace','data-install-demo-workspace',
]) if (!js.includes(token)) fail(`Falta integración v8.02: ${token}`)
if (!js.includes('const width = spriteWidth') || !js.includes('const height = spriteWidth')) fail('Los animales no usan tamaño uniforme')
if (!failed) pass('Dinámica SimFarm, tamaño uniforme y espacio de muestra presentes')

const spriteManifest = JSON.parse(fs.readFileSync(path.join(root,'assets/animals/v601/manifest.json'),'utf8'))
if (spriteManifest.count !== 64 || !Array.isArray(spriteManifest.sprites) || spriteManifest.sprites.length !== 64) fail('La biblioteca actual no contiene 64 sprites')
else pass('64 sprites direccionales reutilizados')

if (failed) process.exit(1)
console.log('Campo v8.02 preflight complete')
