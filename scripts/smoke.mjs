import fs from 'node:fs'
import path from 'node:path'
import vm from 'node:vm'

const root = path.resolve(new URL('..', import.meta.url).pathname)
const appPath = path.join(root, 'app.js')
const appElement = { innerHTML: '' }
const noop = () => {}

const localStore = new Map()
const documentStub = {
  getElementById(id) {
    if (id === 'app') return appElement
    return null
  },
  querySelectorAll() { return [] },
  querySelector() { return null },
  createElement() {
    return {
      click: noop,
      set href(value) { this._href = value },
      set download(value) { this._download = value },
    }
  },
}

const context = {
  console,
  document: documentStub,
  window: { addEventListener: noop, scrollTo: noop },
  navigator: {},
  location: { hash: '' },
  localStorage: {
    getItem(key) { return localStore.get(key) ?? null },
    setItem(key, value) { localStore.set(key, value) },
    removeItem(key) { localStore.delete(key) },
  },
  crypto: globalThis.crypto,
  Intl,
  Date,
  Math,
  JSON,
  Number,
  String,
  Array,
  Object,
  Set,
  Map,
  Blob,
  URL: {
    createObjectURL: () => 'blob:mock',
    revokeObjectURL: noop,
  },
  setTimeout: (fn) => { if (typeof fn === 'function') fn(); return 0 },
  clearTimeout: noop,
  alert: noop,
  confirm: () => true,
  prompt: () => null,
}
context.globalThis = context
vm.createContext(context)

const rawSource = fs.readFileSync(appPath, 'utf8')
const source = rawSource + `\n;globalThis.__campoTest = { render, renderDashboard, renderMapPage, renderHistory, renderDataPage, renderSurveyWizard, startSurvey, navigate, state, ui };`
vm.runInContext(source, context, { filename: 'app.js' })

const api = context.__campoTest
const checks = []
const check = (condition, message) => {
  if (!condition) throw new Error(message)
  checks.push(message)
}

check(appElement.innerHTML.includes('Campo v5.0.0'), 'La versión V5 aparece en la interfaz')
check(appElement.innerHTML.includes('Datos actualizados'), 'La fecha de datos aparece en la interfaz')
check(appElement.innerHTML.includes('condition-excellent-tile.png'), 'El mapa usa texturas de condición')
check(appElement.innerHTML.includes('building-house-main-er08-09.png'), 'La casa ER-08/09 está en el mapa')
check(appElement.innerHTML.includes('building-house-secondary-er13.png'), 'La casa ER-13 está en el mapa')
check(appElement.innerHTML.includes('animal-sprite'), 'El mapa renderiza sprites de animales')
check(appElement.innerHTML.includes('lot-load-border'), 'El mapa renderiza bordes de carga animal')
check(appElement.innerHTML.includes('viewBox="0 0 1154 1363"'), 'El mapa usa el sistema maestro 1154 × 1363')

for (const view of ['mapa', 'historico', 'datos']) {
  api.ui.view = view
  api.render()
  check(appElement.innerHTML.length > 1000, `La vista ${view} se renderiza`)
}

api.ui.view = 'relevamiento'
api.state.draft = null
api.render()
check(appElement.innerHTML.includes('Registrar animales por lote'), 'El flujo de relevamiento usa el wording aprobado')
check(appElement.innerHTML.includes('survey-mode'), 'El modo móvil de relevamiento se activa')

api.startSurvey()
api.state.draft.step = 2
api.render()
check(appElement.innerHTML.includes('Podés dejar lotes sin cargar'), 'El relevamiento permite dejar lotes sin cargar')

const lots = [...rawSource.matchAll(/\{ id: '([^']+)', name: '([^']+)', hectares: (\d+), points: '([^']+)'/g)]
check(lots.length === 18, 'Hay 18 unidades de gestión')
check(lots.reduce((sum, match) => sum + Number(match[3]), 0) === 1735, 'La superficie total es 1.735 ha')
check(rawSource.includes("modalLotSelect.addEventListener('change'"), 'El lote elegido se conserva al cambiar el estado del campo')

const sw = fs.readFileSync(path.join(root, 'sw.js'), 'utf8')
check(sw.includes('campo-v5-assets-2'), 'La caché PWA corresponde a la versión final')

console.log(`Smoke test V5 aprobado (${checks.length} comprobaciones).`)
