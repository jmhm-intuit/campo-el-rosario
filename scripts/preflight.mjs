import fs from 'node:fs'
import path from 'node:path'

const root = path.resolve(new URL('..', import.meta.url).pathname)
const required = [
  'index.html', 'app.js', 'styles.css', 'manifest.webmanifest', 'sw.js',
  'assets/el-rosario-map.png', 'assets/cow-logo.svg',
  'assets/cow-red-standing-right.png', 'assets/cow-red-standing-left.png',
  'assets/cow-red-grazing-right.png', 'assets/cow-red-grazing-left.png',
  'assets/bull-red-standing-right.png', 'assets/calf-red-standing-right.png',
  'assets/house-8-9.png', 'assets/house-13.png',
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

const js = fs.readFileSync(path.join(root, 'app.js'), 'utf8')
for (const term of [
  "const APP_VERSION = 4",
  "const STORAGE_KEY = 'campo-el-rosario-v2'",
  'Registrar animales por lote',
  'Cualquier diferencia de uno o más animales',
  'house-8-9.png',
  'house-13.png',
  'viewBox="0 0 1154 1363"',
  'map-load-badge'
]) {
  if (!js.includes(term)) {
    console.error(`No se encontró texto requerido: ${term}`)
    failed = true
  }
}

const map = fs.readFileSync(path.join(root, 'assets/el-rosario-map.png'))
if (map.readUInt32BE(16) !== 1154 || map.readUInt32BE(20) !== 1363) {
  console.error('La imagen base no tiene 1154 × 1363 px.')
  failed = true
}

for (const asset of required.filter(file => file.endsWith('.png') && file !== 'assets/el-rosario-map.png')) {
  const png = fs.readFileSync(path.join(root, asset))
  if (png.toString('ascii', 1, 4) !== 'PNG') {
    console.error(`PNG inválido: ${asset}`)
    failed = true
  }
  const colorType = png.readUInt8(25)
  if (![4, 6].includes(colorType)) {
    console.error(`El asset no incluye canal alfa: ${asset}`)
    failed = true
  }
}

if (failed) process.exit(1)
console.log('Preflight V4 aprobado.')
