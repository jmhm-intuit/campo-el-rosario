import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'

const root = process.cwd()
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8')
const fail = (message) => {
  console.error(`✗ ${message}`)
  process.exitCode = 1
}
const pass = (message) => console.log(`✓ ${message}`)

const requiredFiles = [
  'index.html',
  'src/main.tsx',
  'src/App.tsx',
  'src/data/config.ts',
  'src/components/RanchMap.tsx',
  'src/components/DataUpload.tsx',
  'src/db/store.ts',
  'csv-templates/plantilla-inventario.csv',
  'csv-templates/plantilla-eventos.csv',
  '.github/workflows/deploy-pages.yml',
]

for (const file of requiredFiles) {
  if (fs.existsSync(path.join(root, file))) pass(`Archivo requerido: ${file}`)
  else fail(`Falta el archivo requerido: ${file}`)
}

const config = read('src/data/config.ts')
const mapSource = read('src/components/RanchMap.tsx')

const lotRegex = /\{ id: '([^']+)', name: '([^']+)', shortName: '[^']+', hectares: ([\d.]+), sector: '[^']+' \}/g
const lots = []
let lotMatch
while ((lotMatch = lotRegex.exec(config))) {
  lots.push({ id: lotMatch[1], name: lotMatch[2], hectares: Number(lotMatch[3]) })
}

if (lots.length === 18) pass('18 lotes ER configurados')
else fail(`Se esperaban 18 lotes y se encontraron ${lots.length}`)

const totalHectares = lots.reduce((sum, lot) => sum + lot.hectares, 0)
if (totalHectares === 1735) pass('Superficie total: 1.735 ha')
else fail(`La superficie total debe ser 1.735 ha y es ${totalHectares}`)

for (const expected of ['ER-08-09', 'ER-15-16', 'ER-20-21']) {
  if (lots.some((lot) => lot.id === expected)) pass(`Lote combinado presente: ${expected}`)
  else fail(`Falta el lote combinado ${expected}`)
}

const factorFor = (categoryId) => {
  const match = config.match(new RegExp(`id: '${categoryId}'[\\s\\S]*?loadFactor: ([\\d.]+)`))
  return match ? Number(match[1]) : undefined
}

if (factorFor('terneros') === 0.5 && factorFor('terneras') === 0.5) {
  pass('Terneros y terneras: 0,50 EV')
} else {
  fail('Terneros y terneras deben usar 0,50 EV')
}

if (factorFor('toros-reproductores') === 1.25) pass('Toros reproductores: 1,25 EV')
else fail('Toros reproductores deben usar 1,25 EV')

const geometryRegex = /'([^']+)': \{ points: '([^']+)'/g
const geometry = new Map()
let geometryMatch
while ((geometryMatch = geometryRegex.exec(mapSource))) {
  geometry.set(geometryMatch[1], geometryMatch[2])
}

const polygonArea = (rawPoints) => {
  const points = rawPoints.split(/\s+/).map((point) => point.split(',').map(Number))
  let twiceArea = 0
  points.forEach(([x1, y1], index) => {
    const [x2, y2] = points[(index + 1) % points.length]
    twiceArea += x1 * y2 - x2 * y1
  })
  return Math.abs(twiceArea) / 2
}

const ratios = []
for (const lot of lots) {
  const points = geometry.get(lot.id)
  if (!points) {
    fail(`Falta geometría para ${lot.id}`)
    continue
  }
  ratios.push(polygonArea(points) / lot.hectares)
}

if (ratios.length === lots.length) {
  const average = ratios.reduce((sum, ratio) => sum + ratio, 0) / ratios.length
  const maxDeviation = Math.max(...ratios.map((ratio) => Math.abs(ratio - average) / average))
  if (maxDeviation <= 0.01) pass('El área visual de todos los lotes es proporcional a sus hectáreas')
  else fail(`La geometría supera 1% de desvío proporcional (${(maxDeviation * 100).toFixed(2)}%)`)
}

if (/IndexedDbStore/.test(read('src/db/store.ts')) && /LocalStorageFallback/.test(read('src/db/store.ts'))) {
  pass('Persistencia local con IndexedDB y respaldo de emergencia')
} else {
  fail('No se detectó la estrategia de almacenamiento local requerida')
}

if (/Pegar desde Excel/.test(read('src/components/DataUpload.tsx')) && /Importar CSV/.test(read('src/components/DataUpload.tsx'))) {
  pass('Carga simplificada: matriz, pegado desde Excel e importación CSV')
} else {
  fail('Falta una vía crítica de carga simplificada')
}

if (process.exitCode) {
  console.error('\nPreflight de Campo: FALLÓ')
} else {
  console.log('\nPreflight de Campo: OK')
}
