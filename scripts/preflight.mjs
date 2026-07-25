import fs from 'node:fs'
import path from 'node:path'

const root = path.resolve(new URL('..', import.meta.url).pathname)
const required = [
  'index.html','app.js','styles.css','manifest.webmanifest','sw.js',
  'assets/el-rosario-map.png','assets/cow-black.png','assets/calf-red.png',
  '.github/workflows/deploy-pages.yml'
]
let failed = false
for (const file of required) {
  const full = path.join(root, file)
  if (!fs.existsSync(full) || fs.statSync(full).size === 0) {
    console.error(`Falta: ${file}`)
    failed = true
  }
}
const js = fs.readFileSync(path.join(root,'app.js'),'utf8')
for (const term of ['Nuevo relevamiento','el-rosario-map.png','Año de nacimiento','Las alertas sirven para detectar']) {
  if (!js.includes(term)) { console.error(`No se encontró texto requerido: ${term}`); failed = true }
}
const map = fs.readFileSync(path.join(root,'assets/el-rosario-map.png'))
if (map.readUInt32BE(16) !== 1154 || map.readUInt32BE(20) !== 1363) {
  console.error('La imagen base no tiene 1154 × 1363 px.')
  failed = true
}
if (failed) process.exit(1)
console.log('Preflight V2 aprobado.')
