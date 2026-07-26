import fs from 'node:fs'
import path from 'node:path'
import vm from 'node:vm'

const root = path.resolve(new URL('..', import.meta.url).pathname)
const appPath = path.join(root, 'app.js')
const appElement = { innerHTML: '' }
const noop = () => {}
const localStore = new Map()
const documentStub = {
  getElementById(id) { if (id === 'app') return appElement; return null },
  querySelectorAll() { return [] },
  querySelector() { return null },
  createElement() { return { click: noop, set href(value) { this._href = value }, set download(value) { this._download = value } } },
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
  Intl, Date, Math, JSON, Number, String, Array, Object, Set, Map, Blob,
  URL: { createObjectURL: () => 'blob:mock', revokeObjectURL: noop },
  setTimeout: () => 0,
  clearTimeout: noop,
  alert: noop,
  confirm: () => true,
  prompt: () => null,
}
context.globalThis = context
vm.createContext(context)

const rawSource = fs.readFileSync(appPath, 'utf8')
const source = rawSource + `\n;globalThis.__campoTest = { render, renderDashboard, renderMapPage, renderHistory, renderDataPage, renderSurveyWizard, startSurvey, editSurvey, draftAsSurvey, spriteCountForLot, dominantAnimalKind, sortedSurveys, state, ui };`
vm.runInContext(source, context, { filename: 'app.js' })
const api = context.__campoTest
const checks = []
const check = (condition, message) => { if (!condition) throw new Error(message); checks.push(message) }

check(appElement.innerHTML.includes('Campo v5.01'), 'La versión Campo v5.01 aparece en la interfaz')
check(appElement.innerHTML.includes('id="survey-switcher"'), 'El selector de relevamientos está visible')
check(appElement.innerHTML.includes('v501/pasture-excellent.png'), 'El mapa usa las nuevas superficies de condición')
check(appElement.innerHTML.includes('lot-load-halo'), 'El mapa incluye el halo independiente de carga')
check(appElement.innerHTML.includes('map-cow-red-angus.png'), 'El mapa usa los animales laterales aprobados')
check(appElement.innerHTML.includes('lot-heads'), 'Las etiquetas muestran las cabezas con jerarquía propia')
check(!appElement.innerHTML.includes('map-condition-legend'), 'No se muestra una leyenda permanente de condición')
check(appElement.innerHTML.includes('kpi-cow-calf-red-angus.png'), 'Nacimientos usa vaca con cría')
check(appElement.innerHTML.includes('viewBox="0 0 1154 1363"'), 'El mapa conserva el sistema maestro')

const first = api.state.surveys[0]
api.editSurvey(first.id)
check(api.state.draft?.mode === 'edit', 'Un relevamiento existente entra en modo edición')
check(api.state.draft?.editingSurveyId === first.id, 'La edición conserva el identificador del relevamiento')
check(api.state.draft?.lots?.length === first.lots.length, 'La edición carga los lotes existentes')
const edited = api.draftAsSurvey(api.state.draft)
check(edited.id === first.id && edited.editedAt, 'Guardar una edición conserva el ID y registra editedAt')

api.state.draft = null
api.state.surveys.push({ ...first, id: 'newer-test', date: '2026-08-02', createdAt: '2026-08-02T12:00:00.000Z' })
check(api.sortedSurveys()[0].id === 'newer-test', 'Los relevamientos se ordenan del más reciente al más antiguo')
check(api.spriteCountForLot({}, { animals: 1 }, false) === 1, 'Un lote con animales muestra al menos un sprite')
check(api.spriteCountForLot({}, { animals: 60 }, false) === 2, 'La escala visual es un sprite por cada 30 animales')
check(api.spriteCountForLot({}, { animals: 500 }, false) === 8, 'La vista general limita a ocho sprites')
check(api.dominantAnimalKind({ groups: [{ categoryId: 'toros', quantity: 10 }, { categoryId: 'vacas', quantity: 40 }] }) === 'cow', 'La categoría dominante define un único tipo visual')

for (const view of ['mapa', 'historico', 'datos']) {
  api.ui.view = view
  api.render()
  check(appElement.innerHTML.length > 1000, `La vista ${view} se renderiza`)
}

console.log(`Smoke test Campo v5.01 aprobado (${checks.length} comprobaciones).`)
